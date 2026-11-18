// シティデュエル: 実際の街(OpenStreetMap の建物と道)を3Dで走りながら進めるライディングデュエル。
// 家で遊ぶシミュレーション用(走行の記録は作らない)。ルートは Nav.fetchRoute、街は Overpass API から取り、端末に保存して使い回す。
// 外部に送るのは、ルートの両端の位置と、ルート周辺の緯度経度の範囲だけ。

const City = (() => {
  const T = () => window.THREE;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // ---------- 場所 ----------
  const STATIONS = [
    { name: "荻窪駅", lat: 35.7046, lon: 139.62 },
    { name: "池袋駅", lat: 35.7295, lon: 139.7109 },
    { name: "新宿駅", lat: 35.6896, lon: 139.7006 },
    { name: "中野駅", lat: 35.7056, lon: 139.6659 },
    { name: "吉祥寺駅", lat: 35.7031, lon: 139.5798 },
  ];
  const LOAD_R = 450, DROP_R = 1500;
  const NEAR = 420; // ルートからこれより遠い建物・道は作らない(m)。数を減らして軽くする
  const CLEAR = 3.5; // 走る線から、これより近い建物は建てない(m)

  let renderer, scene, camera, clock;
  let route = null; // { xy: [[x,z]...], cum: [], length, lat0, lon0, kx, kz }
  let me, rival, routeStrip, ground;
  let tiles = new Map(); // "ix:iy" → { state, group }
  let seen = new Set(); // 作り終えた way の id
  let queue = [];
  let loading = 0, failed = 0, lastErr = "", ahead = null;
  let mats = null;
  let sim = null;
  let running = false;
  let raf = 0;

  // ---------- 座標 ----------
  function project(lat, lon) {
    return [(lon - route.lon0) * route.kx, -(lat - route.lat0) * route.kz];
  }
  function makeRoute(points) {
    const lat0 = points[0][0], lon0 = points[0][1];
    route = { lat0, lon0, kx: Math.cos((lat0 * Math.PI) / 180) * 111320, kz: 110540 };
    const xy = points.map(([la, lo]) => project(la, lo));
    const cum = [0];
    for (let i = 1; i < xy.length; i++) cum.push(cum[i - 1] + Math.hypot(xy[i][0] - xy[i - 1][0], xy[i][1] - xy[i - 1][1]));
    Object.assign(route, { xy, cum, length: cum[cum.length - 1], points });
    // ルートの線を、50mのマス目に入れておく(建物がルートに重なっていないか、すばやく調べるため)
    const grid = new Map();
    for (let i = 0; i < xy.length - 1; i++) {
      const a = xy[i], b = xy[i + 1];
      const x0 = Math.floor((Math.min(a[0], b[0]) - CLEAR) / 50), x1 = Math.floor((Math.max(a[0], b[0]) + CLEAR) / 50);
      const z0 = Math.floor((Math.min(a[1], b[1]) - CLEAR) / 50), z1 = Math.floor((Math.max(a[1], b[1]) + CLEAR) / 50);
      for (let x = x0; x <= x1; x++)
        for (let z = z0; z <= z1; z++) {
          const k = x + ":" + z;
          if (!grid.has(k)) grid.set(k, []);
          grid.get(k).push(i);
        }
    }
    route.grid = grid;
    // ルートから NEAR m以内のマス(100m角)
    const near = new Set();
    const R = Math.ceil(NEAR / 100);
    for (let d = 0; d <= route.length; d += 60) {
      const p = at(d), cx = Math.floor(p.x / 100), cz = Math.floor(p.z / 100);
      for (let x = -R; x <= R; x++) for (let z = -R; z <= R; z++) if (x * x + z * z <= R * R) near.add(cx + x + ":" + (cz + z));
    }
    route.near = near;
  }
  const isNear = (p) => route.near.has(Math.floor(p[0] / 100) + ":" + Math.floor(p[1] / 100));
  // 2本の線分のいちばん近い距離
  function segDist(a, b, c, d) {
    const pd = (p, q, r) => {
      const vx = r[0] - q[0], vz = r[1] - q[1], L = vx * vx + vz * vz;
      const t = L ? Math.max(0, Math.min(1, ((p[0] - q[0]) * vx + (p[1] - q[1]) * vz) / L)) : 0;
      return Math.hypot(p[0] - q[0] - vx * t, p[1] - q[1] - vz * t);
    };
    const cr = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
    if (cr(a, b, c) * cr(a, b, d) < 0 && cr(c, d, a) * cr(c, d, b) < 0) return 0;
    return Math.min(pd(a, c, d), pd(b, c, d), pd(c, a, b), pd(d, a, b));
  }
  // 建物(輪郭 pts)が、走るルートに重なるか、すぐ横(CLEAR m以内)にあるか
  function onRoute(pts) {
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
    for (const p of pts) (x0 = Math.min(x0, p[0])), (x1 = Math.max(x1, p[0])), (z0 = Math.min(z0, p[1])), (z1 = Math.max(z1, p[1]));
    const done = new Set();
    for (let x = Math.floor(x0 / 50); x <= Math.floor(x1 / 50); x++)
      for (let z = Math.floor(z0 / 50); z <= Math.floor(z1 / 50); z++)
        for (const i of route.grid.get(x + ":" + z) || []) {
          if (done.has(i)) continue;
          done.add(i);
          const a = route.xy[i], b = route.xy[i + 1];
          // ルートの点が建物の中にある
          let inside = false;
          for (let j = 0, k = pts.length - 1; j < pts.length; k = j++) {
            const p = pts[j], q = pts[k];
            if (p[1] > a[1] !== q[1] > a[1] && a[0] < ((q[0] - p[0]) * (a[1] - p[1])) / (q[1] - p[1]) + p[0]) inside = !inside;
          }
          if (inside) return true;
          for (let j = 0; j < pts.length; j++) if (segDist(a, b, pts[j], pts[(j + 1) % pts.length]) < CLEAR) return true;
        }
    return false;
  }
  // ルート上の along(m)の位置と向き
  function at(along) {
    const { xy, cum } = route;
    const d = Math.max(0, Math.min(route.length, along));
    let lo = 0, hi = cum.length - 1;
    while (hi - lo > 1) {
      const m = (lo + hi) >> 1;
      if (cum[m] <= d) lo = m;
      else hi = m;
    }
    const f = (d - cum[lo]) / Math.max(1e-6, cum[hi] - cum[lo]);
    const a = xy[lo], b = xy[hi];
    const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz) || 1;
    return { x: a[0] + dx * f, z: a[1] + dz * f, tx: dx / L, tz: dz / L, seg: lo };
  }
  // この先 ahead(m)までに曲がる角度(度)
  function turnAhead(along, ahead = 22) {
    const a = at(along), b = at(along + ahead);
    const dot = Math.max(-1, Math.min(1, a.tx * b.tx + a.tz * b.tz));
    return (Math.acos(dot) * 180) / Math.PI;
  }

  // ---------- 端末への保存(IndexedDB) ----------
  let dbp = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise((res) => {
      try {
        const rq = indexedDB.open("cycling_city", 1);
        rq.onupgradeneeded = () => rq.result.createObjectStore("tiles");
        rq.onsuccess = () => res(rq.result);
        rq.onerror = () => res(null);
      } catch (e) {
        res(null);
      }
    });
    return dbp;
  }
  async function cacheGet(key) {
    const d = await db();
    if (!d) return null;
    return new Promise((res) => {
      const rq = d.transaction("tiles").objectStore("tiles").get(key);
      rq.onsuccess = () => res(rq.result || null);
      rq.onerror = () => res(null);
    });
  }
  async function cachePut(key, val) {
    const d = await db();
    if (!d) return;
    try {
      d.transaction("tiles", "readwrite").objectStore("tiles").put(val, key);
    } catch (e) {}
  }

  // ---------- 街のデータ(OpenFreeMap の地図タイル。鍵なし・1枚 約2km四方) ----------
  const ROAD_W = { motorway: 16, trunk: 16, primary: 14, secondary: 11, tertiary: 9, unclassified: 6.5, residential: 6, living_street: 5, service: 4, pedestrian: 5, cycleway: 2.5, footway: 2.2, path: 2, steps: 2, track: 3 };
  const CLASS = { motorway: "motorway", trunk: "trunk", primary: "primary", secondary: "secondary", tertiary: "tertiary", minor: "residential", service: "service", track: "track", path: "footway", busway: "service" };
  const WANT = new Set(["building", "transportation", "transportation_name", "place", "poi", "water", "park", "landuse", "landcover"]);
  const AREA = { university: "campus", college: "campus", school: "campus", hospital: "hospital", cemetery: "park", stadium: "park", pitch: "park", playground: "park", railway: "rail" };
  const Z = 14, NT = 2 ** Z;
  const tileX = (lon) => Math.floor(((lon + 180) / 360) * NT);
  const tileY = (lat) => Math.floor(((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * NT);
  const tileLon = (x) => (x / NT) * 360 - 180;
  const tileLat = (y) => (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / NT))) * 180) / Math.PI;

  // 地図タイル(Mapbox Vector Tile)を読む。必要な層(building / transportation)だけ取り出す
  function readTile(buf, x, y) {
    const u8 = new Uint8Array(buf), dv = new DataView(buf);
    let pos = 0;
    const varint = () => {
      let r = 0, sh = 0, b;
      do {
        b = u8[pos++];
        r += (b & 0x7f) * 2 ** sh;
        sh += 7;
      } while (b & 0x80);
      return r;
    };
    // 1つのメッセージの中身を、項目ごとに fn(番号, 種類, 始まり, 終わり or 値) で渡す
    const each = (end, fn) => {
      while (pos < end) {
        const tag = varint(), f = tag >>> 3, w = tag & 7;
        if (w === 0) fn(f, w, varint());
        else if (w === 2) {
          const len = varint(), st = pos;
          fn(f, w, st, st + len);
          pos = st + len;
        } else if (w === 5) (fn(f, w, pos), (pos += 4));
        else if (w === 1) (fn(f, w, pos), (pos += 8));
        else return;
      }
    };
    const str = (a, b) => new TextDecoder().decode(u8.subarray(a, b));
    const out = { b: [], r: [], n: [], pl: [], poi: [], a: [] };
    let n = 0;
    each(u8.length, (f, w, a, b) => {
      if (f !== 3 || w !== 2) return;
      // 層
      const save = pos;
      pos = a;
      let name = "", extent = 4096;
      const keys = [], vals = [], feats = [];
      each(b, (f2, w2, a2, b2) => {
        if (f2 === 1) name = str(a2, b2);
        else if (f2 === 2) feats.push([a2, b2]);
        else if (f2 === 3) keys.push(str(a2, b2));
        else if (f2 === 4) {
          const sv = pos;
          pos = a2;
          let v = null;
          each(b2, (f3, w3, a3, b3) => {
            if (f3 === 1) v = str(a3, b3);
            else if (f3 === 2) v = dv.getFloat32(a3, true);
            else if (f3 === 3) v = dv.getFloat64(a3, true);
            else if (f3 === 6) v = a3 & 1 ? -(a3 + 1) / 2 : a3 / 2;
            else if (f3 === 7) v = !!a3;
            else v = a3;
          });
          vals.push(v);
          pos = sv;
        } else if (f2 === 5) extent = a2;
      });
      if (WANT.has(name)) {
        const toLL = (px, py) => [+tileLat(y + py / extent).toFixed(6), +tileLon(x + px / extent).toFixed(6)];
        for (const [fa, fb] of feats) {
          pos = fa;
          let type = 0, tags = null, geom = null;
          each(fb, (f3, w3, a3, b3) => {
            if (f3 === 3) type = a3;
            else if (f3 === 2) tags = [a3, b3];
            else if (f3 === 4) geom = [a3, b3];
          });
          if (!geom) continue;
          const pr = {};
          if (tags) {
            pos = tags[0];
            while (pos < tags[1]) {
              const k = keys[varint()], v = vals[varint()];
              pr[k] = v;
            }
          }
          // 図形(MoveTo / LineTo / ClosePath)
          pos = geom[0];
          const rings = [];
          let cx = 0, cy = 0, cur = null;
          while (pos < geom[1]) {
            const cmd = varint(), id = cmd & 7, cnt = cmd >>> 3;
            if (id === 7) continue;
            for (let i = 0; i < cnt; i++) {
              const dx = varint(), dy = varint();
              cx += dx & 1 ? -(dx + 1) / 2 : dx / 2;
              cy += dy & 1 ? -(dy + 1) / 2 : dy / 2;
              if (id === 1) rings.push((cur = []));
              cur.push(cx, cy);
            }
          }
          if (name === "building" && type === 3) {
            const h = +pr.render_height || 0;
            for (const rg of rings) {
              if (rg.length < 6) continue;
              let area = 0;
              for (let i = 0; i < rg.length; i += 2) {
                const j = (i + 2) % rg.length;
                area += rg[i] * rg[j + 1] - rg[j] * rg[i + 1];
              }
              if (area <= 0) continue; // 穴(中庭)は省く
              const pts = [];
              for (let i = 0; i < rg.length; i += 2) pts.push(...toLL(rg[i], rg[i + 1]));
              out.b.push([-(++n) - x * 131 - y * 7919 * 4096, Math.min(250, h), pts]);
            }
          } else if (name === "transportation_name" && type === 2 && pr.name && CLASS[pr.class] && pr.class !== "path" && pr.class !== "service" && !/[;;]/.test(pr.name)) {
            // 道の名前(いま走っている道を表示するため)
            for (const rg of rings) {
              const pts = [];
              for (let i = 0; i < rg.length; i += 2) pts.push(...toLL(rg[i], rg[i + 1]));
              out.n.push([String(pr.name), pts]);
            }
          } else if (name === "place" && type === 1 && pr.name && rings[0]) {
            out.pl.push([String(pr.name), String(pr.class || ""), ...toLL(rings[0][0], rings[0][1]), +pr.rank || 99]);
          } else if (name === "poi" && type === 1 && pr.name && rings[0]) {
            out.poi.push([String(pr.name), String(pr.class || ""), String(pr.subclass || ""), ...toLL(rings[0][0], rings[0][1]), +pr.rank || 99]);
          } else if ((name === "water" || name === "park" || name === "landuse" || name === "landcover") && type === 3) {
            const kind = name === "water" ? "water" : name === "park" ? "park" : name === "landcover" ? (pr.class === "grass" || pr.class === "wood" ? "park" : "") : AREA[pr.class] || "";
            if (!kind) continue;
            for (const rg of rings) {
              if (rg.length < 6) continue;
              let area = 0;
              for (let i = 0; i < rg.length; i += 2) {
                const j = (i + 2) % rg.length;
                area += rg[i] * rg[j + 1] - rg[j] * rg[i + 1];
              }
              if (area <= 0) continue;
              const pts = [];
              for (let i = 0; i < rg.length; i += 2) pts.push(...toLL(rg[i], rg[i + 1]));
              out.a.push([kind, pts]);
            }
          } else if (name === "transportation" && type === 2 && (pr.class === "rail" || pr.class === "transit")) {
            if (pr.brunnel === "tunnel") continue;
            for (const rg of rings) {
              if (rg.length < 4) continue;
              const pts = [];
              for (let i = 0; i < rg.length; i += 2) pts.push(...toLL(rg[i], rg[i + 1]));
              out.r.push([-(++n), "rail", pts, 0]);
            }
          } else if (name === "transportation" && type === 2) {
            const kind = pr.class === "path" && pr.subclass === "cycleway" ? "cycleway" : CLASS[pr.class];
            if (!kind) continue;
            for (const rg of rings) {
              if (rg.length < 4) continue;
              const pts = [];
              for (let i = 0; i < rg.length; i += 2) pts.push(...toLL(rg[i], rg[i + 1]));
              out.r.push([-(++n), kind, pts, pr.brunnel === "tunnel" ? 1 : 0]);
            }
          }
        }
      }
      pos = save;
    });
    return out;
  }
  let tmpl = null;
  async function tileUrl(x, y) {
    if (!tmpl) {
      try {
        const c = JSON.parse(localStorage.getItem("city_tiles") || "null");
        if (c && Date.now() - c.t < 3 * 86400000) tmpl = c.u;
      } catch (e) {}
    }
    if (!tmpl) {
      const res = await fetch("https://tiles.openfreemap.org/planet");
      if (!res.ok) throw new Error(res.status);
      tmpl = (await res.json()).tiles[0];
      try {
        localStorage.setItem("city_tiles", JSON.stringify({ t: Date.now(), u: tmpl }));
      } catch (e) {}
    }
    return tmpl.replace("{z}", Z).replace("{x}", x).replace("{y}", y);
  }
  async function fetchTile(ix, iy) {
    const key = `v5:${Z}:${ix}:${iy}`;
    const hit = await cacheGet(key);
    if (hit) return hit;
    try {
      const ctl = new AbortController();
      const to = setTimeout(() => ctl.abort(), 25000);
      let res = await fetch(await tileUrl(ix, iy), { signal: ctl.signal });
      if (res.status === 404 || res.status === 410) {
        // 地図の版が新しくなった: 置き場所を取り直す
        tmpl = null;
        localStorage.removeItem("city_tiles");
        res = await fetch(await tileUrl(ix, iy), { signal: ctl.signal });
      }
      clearTimeout(to);
      if (!res.ok) throw new Error(res.status);
      const data = readTile(await res.arrayBuffer(), ix, iy);
      cachePut(key, data);
      lastErr = "";
      return data;
    } catch (e) {
      lastErr = e && e.name === "AbortError" ? "時間切れ" : String((e && e.message) || e).slice(0, 40);
      throw e;
    }
  }

  // ---------- 見た目の材料 ----------
  function hash(n) {
    let x = (n ^ 0x9e3779b9) >>> 0;
    x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
    x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
    return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
  }
  // 写真のない実物の建物の外壁(0=戸建て 1=マンション 2=オフィス)。昼は窓が光らず、夜は一部の窓が光る
  function facadeMats(tex) {
    const THREE = T();
    const S = 256;
    const mk = (draw) => {
      const a = document.createElement("canvas"), b = document.createElement("canvas");
      a.width = a.height = b.width = b.height = S;
      const w = a.getContext("2d"), g = b.getContext("2d");
      g.fillStyle = "#000";
      g.fillRect(0, 0, S, S);
      draw(w, g);
      return new THREE.MeshLambertMaterial({ map: tex(a), emissiveMap: tex(b), emissive: 0xffffff, emissiveIntensity: 0, vertexColors: true });
    };
    const glass = (w, x, y, ww, hh, top, bot) => {
      const gr = w.createLinearGradient(0, y, 0, y + hh);
      gr.addColorStop(0, top);
      gr.addColorStop(1, bot);
      w.fillStyle = gr;
      w.fillRect(x, y, ww, hh);
    };
    const lit = (g, x, y, ww, hh, seed) => {
      if (hash(seed) < 0.45) return;
      g.fillStyle = hash(seed + 1) < 0.3 ? "#cfe0ff" : "#ffd590";
      g.fillRect(x, y, ww, hh);
    };
    return [
      // 戸建て: 7m×2階(6.4m)。外壁のサイディングと、枠つきの窓
      mk((w, g) => {
        w.fillStyle = "#f4f2ee";
        w.fillRect(0, 0, S, S);
        for (let y = 0; y < S; y += 8) (w.fillStyle = "rgba(0,0,0,0.05)"), w.fillRect(0, y, S, 1);
        for (const fy of [0, 128])
          for (const [x, ww] of [[34, 74], [150, 56]]) {
            w.fillStyle = "#d8d8d4";
            w.fillRect(x - 4, fy + 34, ww + 8, 62);
            glass(w, x, fy + 38, ww, 54, "#9fb2c4", "#3c4a58");
            w.fillStyle = "#e9e9e6";
            w.fillRect(x + ww / 2 - 1, fy + 38, 2, 54);
            lit(g, x, fy + 38, ww, 54, x * 3 + fy);
          }
      }),
      // マンション: 7.2m×2階(5.8m)。ベランダの手すりと掃き出し窓、住戸の仕切り
      mk((w, g) => {
        w.fillStyle = "#eeece6";
        w.fillRect(0, 0, S, S);
        for (const fy of [0, 128]) {
          glass(w, 14, fy + 20, 100, 70, "#a9bccc", "#46566a");
          glass(w, 142, fy + 20, 100, 70, "#a9bccc", "#46566a");
          lit(g, 14, fy + 20, 100, 70, fy + 11);
          lit(g, 142, fy + 20, 100, 70, fy + 29);
          w.fillStyle = "rgba(120,126,134,0.88)";
          w.fillRect(0, fy + 84, S, 30);
          w.fillStyle = "rgba(255,255,255,0.18)";
          for (let x = 4; x < S; x += 9) w.fillRect(x, fy + 84, 2, 30);
          w.fillStyle = "#dcdad4";
          w.fillRect(0, fy + 114, S, 14);
          w.fillStyle = "#f6f5f2";
          w.fillRect(0, fy, 8, 128);
          w.fillRect(124, fy, 10, 128);
        }
      }),
      // オフィス・商業: 6m×2階(8m)。ガラスのカーテンウォールと、階ごとの帯
      mk((w, g) => {
        glass(w, 0, 0, S, S, "#9db6cc", "#4a6074");
        for (const fy of [0, 128]) {
          const gr = w.createLinearGradient(0, fy, S, fy + 90);
          gr.addColorStop(0, "rgba(255,255,255,0.22)");
          gr.addColorStop(0.5, "rgba(255,255,255,0)");
          gr.addColorStop(1, "rgba(255,255,255,0.12)");
          w.fillStyle = gr;
          w.fillRect(0, fy, S, 98);
          w.fillStyle = "#c9ccd0";
          w.fillRect(0, fy + 98, S, 30);
          for (let x = 30; x < S; x += 64) {
            w.fillStyle = "#59626c";
            w.fillRect(x, fy, 4, 98);
            lit(g, x - 26, fy + 6, 56, 88, x + fy * 5);
          }
        }
      }),
    ];
  }

  function buildMats() {
    const THREE = T();
    // 壁: 8×8 個の窓。いくつかは明かりがついている(光る分は別の絵に描く)
    const N = 8, S = 256, c = S / N;
    const wall = document.createElement("canvas"), glow = document.createElement("canvas");
    wall.width = wall.height = glow.width = glow.height = S;
    const w = wall.getContext("2d"), g = glow.getContext("2d");
    w.fillStyle = "#c9ccd2";
    w.fillRect(0, 0, S, S);
    g.fillStyle = "#000";
    g.fillRect(0, 0, S, S);
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++) {
        const lit = hash(i * 31 + j * 17 + 5) < 0.42;
        const x = i * c + c * 0.2, y = j * c + c * 0.22, ww = c * 0.6, hh = c * 0.5;
        w.fillStyle = lit ? "#f2e2b0" : "#232a36";
        w.fillRect(x, y, ww, hh);
        if (lit) {
          g.fillStyle = hash(i * 7 + j * 3) < 0.25 ? "#bcd6ff" : "#ffd98a";
          g.fillRect(x, y, ww, hh);
        }
      }
    const tex = (cv) => {
      const t = new THREE.CanvasTexture(cv);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.encoding = THREE.sRGBEncoding;
      t.anisotropy = 4;
      return t;
    };
    // 道: 両端の白線と、真ん中の破線
    const rd = document.createElement("canvas");
    rd.width = 64;
    rd.height = 256;
    const r = rd.getContext("2d");
    r.fillStyle = "#2b2e33";
    r.fillRect(0, 0, 64, 256);
    for (let i = 0; i < 500; i++) {
      r.fillStyle = `rgba(255,255,255,${0.02 + hash(i) * 0.04})`;
      r.fillRect(hash(i + 900) * 64, hash(i + 1800) * 256, 1, 1);
    }
    r.fillStyle = "#d8dadd";
    r.fillRect(3, 0, 2, 256);
    r.fillRect(59, 0, 2, 256);
    r.fillStyle = "#e9c84a";
    r.fillRect(31, 0, 2, 128);
    mats = {
      bld: new THREE.MeshLambertMaterial({ map: tex(wall), emissiveMap: tex(glow), emissive: 0xffffff, emissiveIntensity: 0.85, vertexColors: true }),
      road: new THREE.MeshLambertMaterial({ map: tex(rd), vertexColors: true }),
      area: new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide }),
      pcol: new THREE.MeshLambertMaterial({ vertexColors: true }),
      fac: facadeMats(tex),
    };
  }

  // ---------- 1枚ぶんの街を作る ----------
  function buildTile(data) {
    const THREE = T();
    const group = new THREE.Group();
    // 建物(250m の塊ごとに別のメッシュにする。実物の建物=PLATEAU が届いた塊は隠す)
    {
      const chunks = new Map();
      let pos, nor, uv, col;
      const chunkOf = (x, z) => {
        const key = Math.floor(x / 250) + ":" + Math.floor(z / 250);
        let ch = chunks.get(key);
        if (!ch) chunks.set(key, (ch = { key, cx: (Math.floor(x / 250) + 0.5) * 250, cz: (Math.floor(z / 250) + 0.5) * 250, pos: [], nor: [], uv: [], col: [] }));
        return ch;
      };
      const push = (x, y, z, nx, ny, nz, u, v, c) => {
        pos.push(x, y, z);
        nor.push(nx, ny, nz);
        uv.push(u, v);
        col.push(c[0], c[1], c[2]);
      };
      const PAL = [[0.82, 0.8, 0.76], [0.7, 0.72, 0.76], [0.86, 0.84, 0.8], [0.62, 0.6, 0.6], [0.78, 0.7, 0.62], [0.66, 0.7, 0.72]];
      for (const [id, h0, ll] of data.b) {
        if (!isNear(project(ll[0], ll[1]))) continue;
        const pts = [];
        for (let i = 0; i < ll.length; i += 2) pts.push(project(ll[i], ll[i + 1]));
        if (pts.length > 3 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1]) pts.pop();
        if (pts.length < 3 || onRoute(pts)) continue; // 走る道の上に重なる建物は建てない(建物に当たらないように)
        let area = 0;
        for (let i = 0; i < pts.length; i++) {
          const a = pts[i], b = pts[(i + 1) % pts.length];
          area += a[0] * b[1] - b[0] * a[1];
        }
        if (Math.abs(area) < 8) continue; // とても小さいものは省く
        if (area < 0) pts.reverse();
        ({ pos, nor, uv, col } = chunkOf(pts[0][0], pts[0][1]));
        const k = hash(id);
        // 高さがわからない建物は、広さから見当をつける(広いほど高め)
        const h = h0 || Math.min(40, 5.5 + k * 5 + Math.sqrt(Math.abs(area) / 2) * 0.22);
        const c = PAL[Math.floor(hash(id + 7) * PAL.length)];
        const cr = [c[0] * 0.45, c[1] * 0.45, c[2] * 0.48];
        let per = hash(id + 3) * 8;
        for (let i = 0; i < pts.length; i++) {
          const a = pts[i], b = pts[(i + 1) % pts.length];
          const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz);
          if (L < 0.05) continue;
          const nx = dz / L, nz = -dx / L;
          const u0 = per / 28, u1 = (per + L) / 28, v1 = h / 25.6;
          per += L;
          push(a[0], 0, a[1], nx, 0, nz, u0, 0, c);
          push(b[0], 0, b[1], nx, 0, nz, u1, 0, c);
          push(b[0], h, b[1], nx, 0, nz, u1, v1, c);
          push(a[0], 0, a[1], nx, 0, nz, u0, 0, c);
          push(b[0], h, b[1], nx, 0, nz, u1, v1, c);
          push(a[0], h, a[1], nx, 0, nz, u0, v1, c);
        }
        const tri = THREE.ShapeUtils.triangulateShape(pts.map((p) => new THREE.Vector2(p[0], p[1])), []);
        for (const t of tri) for (const i of [t[0], t[2], t[1]]) push(pts[i][0], h, pts[i][1], 0, 1, 0, 0.004, 0.004, cr);
      }
      group.userData.chunks = [];
      for (const ch of chunks.values()) {
        if (!ch.pos.length) continue;
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(ch.pos, 3));
        geo.setAttribute("normal", new THREE.Float32BufferAttribute(ch.nor, 3));
        geo.setAttribute("uv", new THREE.Float32BufferAttribute(ch.uv, 2));
        geo.setAttribute("color", new THREE.Float32BufferAttribute(ch.col, 3));
        const m = new THREE.Mesh(geo, mats.bld);
        m.visible = !G3.on() && !(plateauOn && Plateau.hasAt(ch.cx, ch.cz));
        group.add(m);
        group.userData.chunks.push({ cx: ch.cx, cz: ch.cz, mesh: m });
      }
    }
    // 道
    {
      const pos = [], nor = [], uv = [], col = [];
      for (const [id, kind, ll, tunnel] of data.r) {
        if (tunnel) continue;
        const rail = kind === "rail";
        const w = rail ? 3.6 : ROAD_W[kind] || 4, big = w >= 9, walk = w <= 3 && !rail;
        const y = rail ? 0.07 : big ? 0.05 : walk ? 0.02 : 0.035;
        const c = rail ? [1.9, 1.5, 1.2] : walk ? [1.5, 1.42, 1.3] : [1, 1, 1];
        const p = [];
        for (let i = 0; i < ll.length; i += 2) p.push(project(ll[i], ll[i + 1]));
        if (!isNear(p[0]) && !isNear(p[p.length - 1])) continue;
        let run = 0;
        const side = (i) => {
          const a = p[Math.max(0, i - 1)], b = p[Math.min(p.length - 1, i + 1)];
          const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz) || 1;
          return [(dz / L) * w * 0.5, (-dx / L) * w * 0.5];
        };
        for (let i = 0; i < p.length - 1; i++) {
          const a = p[i], b = p[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
          const sa = side(i), sb = side(i + 1);
          const u0 = big ? 0 : 0.14, u1 = big ? 1 : 0.4;
          const v0 = run / 10, v1 = (run + L) / 10;
          run += L;
          const q = [
            [a[0] - sa[0], a[1] - sa[1], u0, v0], [a[0] + sa[0], a[1] + sa[1], u1, v0], [b[0] + sb[0], b[1] + sb[1], u1, v1],
            [a[0] - sa[0], a[1] - sa[1], u0, v0], [b[0] + sb[0], b[1] + sb[1], u1, v1], [b[0] - sb[0], b[1] - sb[1], u0, v1],
          ];
          for (const [x, z, u, v] of q) {
            pos.push(x, y, z);
            nor.push(0, 1, 0);
            uv.push(u, v);
            col.push(c[0], c[1], c[2]);
          }
        }
      }
      if (pos.length) {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
        geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
        geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
        const m = new THREE.Mesh(geo, mats.road);
        m.material.side = THREE.DoubleSide;
        group.add(m);
      }
    }
    // 公園・水面・学校や病院の敷地(地面の色を変える)
    {
      const pos = [], col = [];
      const COL = { water: [0.16, 0.36, 0.62], park: [0.2, 0.42, 0.24], campus: [0.42, 0.38, 0.3], hospital: [0.44, 0.32, 0.34], rail: [0.26, 0.24, 0.24] };
      for (const [kind, ll] of data.a || []) {
        const pts = [];
        for (let i = 0; i < ll.length; i += 2) pts.push(project(ll[i], ll[i + 1]));
        if (pts.length > 3 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1]) pts.pop();
        if (pts.length < 3 || !pts.some(isNear)) continue;
        const c = COL[kind] || COL.park, y = kind === "water" ? 0.024 : 0.018;
        const tri = THREE.ShapeUtils.triangulateShape(pts.map((q) => new THREE.Vector2(q[0], q[1])), []);
        for (const t of tri)
          for (const i of t) {
            pos.push(pts[i][0], y, pts[i][1]);
            col.push(c[0], c[1], c[2]);
          }
      }
      if (pos.length) {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
        geo.computeVertexNormals();
        group.add(new THREE.Mesh(geo, mats.area));
      }
    }
    // いまどこを走っているかを出すための名前(道・町)と、目印になる施設
    const info = { names: [], places: [], lms: [] };
    for (const [nm, ll] of data.n || []) {
      const pts = [];
      for (let i = 0; i < ll.length; i += 2) pts.push(project(ll[i], ll[i + 1]));
      if (pts.some(isNear)) info.names.push({ name: nm, pts });
    }
    for (const [nm, cls, la, lo] of data.pl || []) {
      const [x, z] = project(la, lo);
      info.places.push({ name: nm, cls, x, z });
    }
    const got = new Set();
    for (const [nm0, cls, sub, la, lo, rank] of data.poi || []) {
      const lm = landmark(nm0, cls, sub, rank);
      if (!lm) continue;
      const q = project(la, lo);
      const d = routeDist(q);
      if (d > lm.r || got.has(lm.name)) continue;
      got.add(lm.name);
      // 看板は建物の少し上。画面の上で読める大きさを保ち、近づいたときだけ出す
      const hgt = lm.big ? 24 : 15;
      const sp = signSprite(lm);
      sp.position.set(q[0], hgt, q[1]);
      sp.visible = false;
      sp.userData.sign = true;
      group.add(sp);
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, hgt, 6), new THREE.MeshBasicMaterial({ color: lm.color, transparent: true, opacity: 0.6, depthTest: false, fog: false }));
      beam.position.set(q[0], hgt / 2, q[1]);
      beam.visible = false;
      beam.userData.sign = true;
      group.add(beam);
      info.lms.push({ name: lm.name, icon: lm.icon, x: q[0], z: q[1], along: d.along, big: lm.big, sp, beam });
    }
    group.userData.info = info;
    return group;
  }
  // 目印にする施設かどうか。r: ルートからこの距離(m)までなら看板を立てる
  function landmark(name, cls, sub, rank) {
    const L = (icon, color, r, big, nm) => ({ name: nm || name, icon, color, r, big });
    if (cls === "railway" && /station|subway|halt|tram/.test(sub)) return L("🚉", "#3db8ff", 330, true, /駅$/.test(name) ? name : name + "駅");
    if (cls === "college") return L("🎓", "#c79bff", 330, true);
    if (cls === "stadium") return L("🏟️", "#ffd36b", 330, true);
    if (cls === "hospital" && sub === "hospital" && rank <= 4) return L("🏥", "#ff8fa3", 220);
    if (cls === "town_hall" && sub === "townhall") return L("🏛️", "#ffd36b", 220);
    if ((cls === "museum" || cls === "attraction" || cls === "castle") && rank <= 30) return L("🏛️", "#ffd36b", 220);
    if (cls === "park" && rank <= 6) return L("🌳", "#7be08a", 140);
    if (cls === "place_of_worship" && rank <= 4) return L("⛩️", "#ff9a6b", 140);
    if (cls === "school" && sub === "school" && rank <= 6) return L("🏫", "#c79bff", 110);
    if (cls === "library" && sub === "library") return L("📚", "#9ad0ff", 110);
    if (cls === "police" || cls === "fire_station") return L(cls === "police" ? "🚓" : "🚒", "#9ad0ff", 80);
    if (cls === "cinema" || cls === "theatre") return L("🎭", "#ffd36b", 110);
    return null;
  }
  // 点 q からルートまでの距離(近くの線分だけ調べる)。数値として使え、.along にルート上の位置が入る
  function routeDist(q) {
    let best = 1e9, along = 0;
    const cx = Math.floor(q[0] / 50), cz = Math.floor(q[1] / 50), R = 7;
    const done = new Set();
    for (let x = cx - R; x <= cx + R; x++)
      for (let z = cz - R; z <= cz + R; z++)
        for (const i of route.grid.get(x + ":" + z) || []) {
          if (done.has(i)) continue;
          done.add(i);
          const a = route.xy[i], b = route.xy[i + 1];
          const vx = b[0] - a[0], vz = b[1] - a[1], L = vx * vx + vz * vz;
          const t = L ? Math.max(0, Math.min(1, ((q[0] - a[0]) * vx + (q[1] - a[1]) * vz) / L)) : 0;
          const d = Math.hypot(q[0] - a[0] - vx * t, q[1] - a[1] - vz * t);
          if (d < best) (best = d), (along = route.cum[i] + Math.sqrt(L) * t);
        }
    const out = new Number(best);
    out.along = along;
    return out;
  }
  // 施設の名前の看板(空に浮かべる。建物の向こうでも見える)
  function signSprite(lm) {
    const THREE = T();
    const cv = document.createElement("canvas");
    cv.width = 512;
    cv.height = 128;
    const c = cv.getContext("2d");
    c.font = "700 54px 'Hiragino Sans', 'Noto Sans JP', sans-serif";
    const text = lm.name.length > 14 ? lm.name.slice(0, 13) + "…" : lm.name;
    const w = Math.min(500, c.measureText(text).width + 110);
    const x0 = (512 - w) / 2;
    c.fillStyle = "rgba(6,10,20,0.86)";
    c.fillRect(x0, 14, w, 100);
    c.fillStyle = lm.color;
    c.fillRect(x0, 14, w, 7);
    c.fillRect(x0, 107, w, 7);
    c.textBaseline = "middle";
    c.font = "60px sans-serif";
    c.fillText(lm.icon, x0 + 14, 66);
    c.font = "700 54px 'Hiragino Sans', 'Noto Sans JP', sans-serif";
    c.fillStyle = "#fff";
    c.fillText(text, x0 + 92, 66, w - 104);
    const tex = new THREE.CanvasTexture(cv);
    tex.encoding = THREE.sRGBEncoding;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true, sizeAttenuation: false, fog: false }));
    const k = lm.big ? 0.34 : 0.25;
    sp.scale.set(k, k / 4, 1);
    sp.renderOrder = 5;
    return sp;
  }
  // いまいる場所: 区・町名・道の名前・近くの目印
  function whereAmI() {
    const p = at(sim.along);
    let city = null, cd = 1e9, town = null, td = 1e9, road = null, rd = 22;
    for (const t of tiles.values()) {
      const inf = t.state === "ok" && t.group && t.group.userData.info;
      if (!inf) continue;
      for (const pl of inf.places) {
        const d = Math.hypot(pl.x - p.x, pl.z - p.z);
        if (pl.cls === "city" || pl.cls === "town") d < cd && ((cd = d), (city = pl.name));
        else if (pl.cls === "neighbourhood" || pl.cls === "quarter") {
          // 丁目のほうを優先(同じくらいの距離なら)
          const dd = pl.cls === "neighbourhood" ? d : d + 250;
          dd < td && ((td = dd), (town = pl.name));
        }
      }
      for (const n of inf.names)
        for (let i = 0; i < n.pts.length - 1; i++) {
          const a = n.pts[i], b = n.pts[i + 1];
          const vx = b[0] - a[0], vz = b[1] - a[1], L = vx * vx + vz * vz;
          const tt = L ? Math.max(0, Math.min(1, ((p.x - a[0]) * vx + (p.z - a[1]) * vz) / L)) : 0;
          const d = Math.hypot(p.x - a[0] - vx * tt, p.z - a[1] - vz * tt);
          if (d < rd) (rd = d), (road = n.name);
        }
      // 目印の近くを通ったら知らせる
      for (const lm of inf.lms) {
        // 看板は、近く(大きな目印は450m、ほかは260m)まで来たら出す
        const near = Math.hypot(lm.x - p.x, lm.z - p.z) < (lm.big ? 450 : 260);
        lm.sp.visible = lm.beam.visible = near;
        if (lm.said || Math.abs(lm.along - sim.along) > 90) continue;
        lm.said = true;
        const el = $("ct-near");
        el.textContent = `${lm.icon} ${lm.name} 付近`;
        el.hidden = false;
        clearTimeout(whereAmI.to);
        whereAmI.to = setTimeout(() => (el.hidden = true), 4500 / Math.min(4, sim.speedX));
        if (sim.speedX <= 2) ticker(`${lm.icon} ${lm.name} を通過`, "you");
      }
    }
    $("ct-where").textContent = city || town || road ? `📍 ${[city, town].filter(Boolean).join(" ")}${road ? " ・ " + road : ""}` : "";
  }

  // いまの位置のまわりの街を用意する(足りない分を順に取りに行く)
  function tileDist(ix, iy, p) {
    const [x0, z0] = project(tileLat(iy), tileLon(ix)), [x1, z1] = project(tileLat(iy + 1), tileLon(ix + 1));
    const dx = Math.max(Math.min(x0, x1) - p.x, 0, p.x - Math.max(x0, x1)), dz = Math.max(Math.min(z0, z1) - p.z, 0, p.z - Math.max(z0, z1));
    return Math.hypot(dx, dz);
  }
  function wantTiles(along) {
    const want = new Map();
    for (const d of [0, 300, 600]) {
      const p = at(along + d);
      const lat = route.lat0 - p.z / route.kz, lon = route.lon0 + p.x / route.kx;
      const cx = tileX(lon), cy = tileY(lat);
      for (let dx = -1; dx <= 1; dx++)
        for (let dy = -1; dy <= 1; dy++) {
          const ix = cx + dx, iy = cy + dy, key = ix + ":" + iy;
          const dist = tileDist(ix, iy, p);
          if (dist < LOAD_R && (!want.has(key) || want.get(key).dist > dist + d)) want.set(key, { ix, iy, dist: dist + d });
        }
    }
    for (const [key, t] of want) if (!tiles.has(key)) (tiles.set(key, { state: "wait", ix: t.ix, iy: t.iy }), queue.push(key));
    queue.sort((a, b) => ((want.get(a) || { dist: 9e9 }).dist) - ((want.get(b) || { dist: 9e9 }).dist));
    // 遠くなった分は片づける
    const p0 = at(along);
    for (const [key, t] of tiles) {
      if (t.state !== "ok") continue;
      if (tileDist(t.ix, t.iy, p0) > DROP_R) {
        scene.remove(t.group);
        t.group.traverse((o) => o.geometry && o.geometry.dispose());
        tiles.delete(key);
      }
    }
    pump();
  }
  // ---------- 実物の建物(PLATEAU: 国土交通省の3D都市モデル) ----------
  // 区ごとの建物データ(3D Tiles)から、ルートの近くの区画(約500m四方)だけを読み、ワーカーで座標を直して置く。
  // 一度読んだ区画は端末(Cache Storage)に残す。走る道に重なる建物はワーカーが外す。
  let plateauOn = typeof PLATEAU_INDEX !== "undefined" && (() => {
    try {
      const v = localStorage.getItem("city_plateau");
      return v == null ? true : v === "1";
    } catch (e) {
      return true;
    }
  })();
  const Plateau = (() => {
    const IDX = typeof PLATEAU_INDEX !== "undefined" ? PLATEAU_INDEX : [];
    let leaves = null, worker = null, waiting = new Map(), loaded = new Map(), queue = [], busy = 0, fails = 0, broken = false, prepared = null;
    const R = () => (innerWidth < 900 ? 230 : 330); // 読む範囲(m)
    const covers = (lat, lon) => !broken && IDX.some((c) => lon >= c[4] && lon <= c[6] && lat >= c[5] && lat <= c[7]);
    // (x, z) の場所の実物の建物が、もう出ているか
    function hasAt(x, z) {
      if (!leaves) return false;
      for (const L of leaves) if (x >= L.rect[0] && x <= L.rect[2] && z >= L.rect[1] && z <= L.rect[3]) {
        const t = loaded.get(L.key);
        if (t && t.state === "ok") return true;
      }
      return false;
    }
    async function cached(url, type) {
      try {
        const c = await caches.open("city-plateau-v1");
        const hit = await c.match(url);
        if (hit) return type === "json" ? hit.json() : hit.arrayBuffer();
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.status);
        c.put(url, res.clone()).catch(() => {});
        return type === "json" ? res.json() : res.arrayBuffer();
      } catch (e) {
        if (e && /^\d+$/.test(e.message)) throw e;
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.status);
        return type === "json" ? res.json() : res.arrayBuffer();
      }
    }
    // ルートが通る市区町村の区画を集める
    function prepare() {
      if (prepared) return prepared;
      let la0 = 90, la1 = -90, lo0 = 180, lo1 = -180;
      for (const [la, lo] of route.points) (la0 = Math.min(la0, la)), (la1 = Math.max(la1, la)), (lo0 = Math.min(lo0, lo)), (lo1 = Math.max(lo1, lo));
      const m = 0.006;
      const cities = IDX.filter((c) => c[4] < lo1 + m && c[6] > lo0 - m && c[5] < la1 + m && c[7] > la0 - m);
      const D = 180 / Math.PI;
      prepared = Promise.all(
        cities.map((c) =>
          cached(c[3] + "tileset.json", "json")
            .then((ts) => {
              const out = [];
              const walk = (n) => {
                const r = n.boundingVolume && n.boundingVolume.region;
                if (r) {
                  const w = r[0] * D, so = r[1] * D, e = r[2] * D, no = r[3] * D;
                  if (e < lo0 - m || w > lo1 + m || no < la0 - m || so > la1 + m) return;
                  const uri = n.content && (n.content.uri || n.content.url);
                  if (!(n.children && n.children.length) && uri && /\.b3dm$/.test(uri)) {
                    const a = project(no, w), b = project(so, e);
                    const rect = [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1])];
                    // ルートから離れた区画は使わない
                    let near = false;
                    for (let x = Math.floor(rect[0] / 100); x <= Math.floor(rect[2] / 100) && !near; x++) for (let z = Math.floor(rect[1] / 100); z <= Math.floor(rect[3] / 100); z++) if (route.near.has(x + ":" + z)) (near = true);
                    if (near) out.push({ key: c[0] + "/" + uri, url: c[3] + uri, rect });
                  }
                }
                for (const ch of n.children || []) walk(ch);
              };
              walk(ts.root);
              return out;
            })
            .catch(() => (fails++, []))
        )
      ).then((all) => {
        leaves = all.flat();
        if (cities.length && !leaves.length) broken = true; // 一つも読めなかった: 地図(OSM)の建物に戻す
        return leaves;
      });
      return prepared;
    }
    function startWorker() {
      if (worker) return;
      // ページと同じ版のワーカーを読む(古いものが残らないように)
      const me = document.querySelector('script[src*="js/city.js"]');
      const v = me && me.src.includes("?") ? "?" + me.src.split("?")[1] : "";
      worker = new Worker("js/plateau-worker.js" + v);
      worker.postMessage({ type: "init", route: { xy: route.xy, lat0: route.lat0, lon0: route.lon0, kx: route.kx, kz: route.kz }, clear: CLEAR, texMax: innerWidth < 900 ? 2048 : 4096 });
      worker.onmessage = (e) => {
        const d = e.data, w = waiting.get(d.id);
        waiting.delete(d.id);
        if (w) w(d);
      };
    }
    const rectDist = (r, p) => Math.hypot(Math.max(r[0] - p.x, 0, p.x - r[2]), Math.max(r[1] - p.z, 0, p.z - r[3]));
    function want(along) {
      if (!plateauOn || broken) return clear(), syncPlaceholders();
      if (!leaves) return void prepare().then(() => want(along));
      const need = new Map();
      // 先読み: 早送りのときほど先まで(20秒ぶん。最大3km)
      const ahead = Math.min(3000, Math.max(500, (sim ? sim.v * sim.speedX : 7) * 20));
      const marks = [0, 250, 500];
      for (let d = 800; d <= ahead; d += 300) marks.push(d);
      for (const d of marks) {
        const p = at(along + d);
        for (const L of leaves) {
          const dist = rectDist(L.rect, p);
          if (dist < R() && (!need.has(L.key) || need.get(L.key) > dist + d)) need.set(L.key, dist + d);
        }
      }
      for (const L of leaves) if (need.has(L.key) && !loaded.has(L.key) && !queue.includes(L)) queue.push(L);
      queue = queue.filter((L) => need.has(L.key) && !loaded.has(L.key));
      queue.sort((a, b) => need.get(a.key) - need.get(b.key));
      // 通り過ぎて遠くなった区画は片づける(この先の区画は残す)
      const p0 = at(along);
      for (const [key, t] of loaded) {
        const L = leaves.find((x) => x.key === key);
        if (t.mesh && L && !need.has(key) && rectDist(L.rect, p0) > (t.texs && t.texs.length ? 600 : 900)) {
          drop(t);
          loaded.delete(key);
        }
      }
      syncPlaceholders();
      pump();
    }
    async function pump() {
      if (busy >= (innerWidth < 900 ? 2 : 3) || !queue.length) return;
      const L = queue.shift();
      if (loaded.has(L.key)) return pump();
      loaded.set(L.key, { state: "load" });
      busy++;
      hudMap();
      try {
        startWorker();
        const buf = await cached(L.url, "bin");
        const id = Math.random();
        const d = await new Promise((res) => {
          waiting.set(id, res);
          worker.postMessage({ type: "tile", id, buf }, [buf]);
        });
        if (d.error) throw new Error(d.error);
        const t = loaded.get(L.key);
        if (t && plateauOn) {
          const THREE = T();
          // 写真(壁や屋根のテクスチャ)
          const texs = await Promise.all((d.images || []).map(toTexture));
          t.mesh = new THREE.Group();
          t.texs = texs.filter(Boolean);
          for (const g of d.groups) {
            if (g.kind === "p" && g.style != null) {
              // 写真のない建物: 外壁の種類ごと
              const geo = new THREE.BufferGeometry();
              geo.setAttribute("position", new THREE.BufferAttribute(g.pos, 3));
              geo.setAttribute("normal", new THREE.BufferAttribute(g.nor, 3, true));
              geo.setAttribute("uv", new THREE.BufferAttribute(g.uv, 2));
              geo.setAttribute("color", new THREE.BufferAttribute(g.col, 3, true));
              geo.computeBoundingSphere();
              t.mesh.add(new THREE.Mesh(geo, mats.fac[g.style] || mats.bld));
              continue;
            }
            const geo = new THREE.BufferGeometry();
            geo.setAttribute("position", new THREE.BufferAttribute(g.pos, 3));
            geo.setAttribute("normal", new THREE.BufferAttribute(g.nor, 3, true));
            geo.setAttribute("uv", new THREE.BufferAttribute(g.uv, 2));
            geo.setAttribute("color", new THREE.BufferAttribute(g.col, 3, true));
            geo.computeBoundingSphere();
            let mat = mats.bld;
            if (g.kind === "t") {
              const tx = texs[g.img];
              // 写真は光の当たり方まで写っているので、ライトの影響を受けない材質でそのまま見せる
              mat = tx ? new THREE.MeshBasicMaterial({ map: tx, color: photoTint }) : mats.pcol;
            } else if (g.kind === "c") mat = mats.pcol;
            const mesh = new THREE.Mesh(geo, mat);
            if (g.kind === "t") mesh.userData.photo = true;
            t.mesh.add(mesh);
          }
          t.state = "ok";
          t.names = d.names;
          scene.add(t.mesh);
          if (G3.on()) t.mesh.visible = false;
          syncPlaceholders();
        } else loaded.delete(L.key);
      } catch (e) {
        fails++;
        loaded.set(L.key, { state: "fail" });
      }
      busy--;
      hudMap();
      pump();
      pump();
    }
    // 写真(ImageBitmap か、取り出せなかったときは画像のバイト列)からテクスチャを作る
    async function toTexture(im) {
      const THREE = T();
      try {
        let src = im.bitmap;
        if (!src) {
          const url = URL.createObjectURL(new Blob([im.bytes], { type: im.mime }));
          src = await new Promise((res, rej) => {
            const i = new Image();
            i.onload = () => res(i);
            i.onerror = rej;
            i.src = url;
          });
          URL.revokeObjectURL(url);
          const max = innerWidth < 900 ? 2048 : 4096;
          if (src.width > max || src.height > max) {
            const k = max / Math.max(src.width, src.height), cv = document.createElement("canvas");
            cv.width = Math.round(src.width * k);
            cv.height = Math.round(src.height * k);
            cv.getContext("2d").drawImage(src, 0, 0, cv.width, cv.height);
            src = cv;
          }
        }
        const tx = new THREE.Texture(src);
        tx.flipY = false; // glTF の写真の座標は上が0
        tx.encoding = THREE.sRGBEncoding;
        tx.anisotropy = 8;
        tx.wrapS = tx.wrapT = THREE.ClampToEdgeWrapping;
        tx.needsUpdate = true;
        return tx;
      } catch (e) {
        return null;
      }
    }
    function drop(t) {
      if (!t.mesh) return;
      scene.remove(t.mesh);
      t.mesh.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material && o.material.map && o.material !== mats.bld) o.material.dispose();
      });
      for (const tx of t.texs || []) {
        if (tx.image && tx.image.close) tx.image.close();
        tx.dispose();
      }
    }
    function clear() {
      queue = [];
      for (const [, t] of loaded) drop(t);
      loaded.clear();
    }
    return {
      covers,
      hasAt,
      setVisible: (v) => {
        for (const [, t] of loaded) if (t.mesh) t.mesh.visible = v;
      },
      want,
      clear,
      prepare,
      // 走り出してよいか(ルートの最初の区画が出た/読めない/区画がない)
      ready: () => !plateauOn || broken || (leaves && (!leaves.length || [...loaded.values()].some((t) => t.state !== "load"))),
      left: () => queue.length + busy,
      fails: () => fails,
      broken: () => broken,
    };
  })();

  // 実物の建物が届いた所では、地図の(仮の)建物を隠す
  function syncPlaceholders() {
    const g = typeof G3 !== "undefined" && G3.on();
    for (const t of tiles.values()) for (const ch of (t.group && t.group.userData.chunks) || []) ch.mesh.visible = !g && !(plateauOn && Plateau.hasAt(ch.cx, ch.cz));
  }

  // ---------- Googleの3D(Photorealistic 3D Tiles: Googleマップの3Dと同じ写真の街) ----------
  // 使う人の Google Maps Platform の APIキー(端末にだけ保存)で読む。Googleマップのロゴと、データの出典を画面に出す。
  // 3D Tiles の座標(地心)を、アプリの平面(x=東, y=上, z=南)に合わせる。誤差が出ないよう、自分の近くを基準点にして400mごとに置き直す。
  const G3 = (() => {
    let tiles = null, on = false, starting = null, anchor = null, groundH = 80, err = "", models = 0, t0 = 0;
    const ray = { caster: null, tick: 0, me: 0, rival: 0 };
    const getKey = () => {
      try {
        return localStorage.getItem("city_gkey") || "";
      } catch (e) {
        return "";
      }
    };
    async function start() {
      if (tiles || starting) return starting;
      starting = (async () => {
        const THREE = T();
        const [lib, plug, { GLTFLoader }, { DRACOLoader }] = await Promise.all([
          import("3d-tiles-renderer"),
          import("3d-tiles-renderer/plugins"),
          import("three/examples/jsm/loaders/GLTFLoader.js"),
          import("three/examples/jsm/loaders/DRACOLoader.js"),
        ]);
        tiles = new lib.TilesRenderer();
        tiles.registerPlugin(new plug.GoogleCloudAuthPlugin({ apiToken: getKey(), autoRefreshToken: true }));
        // 細かさ(小さいほど細かい)。スマホは軽めに
        tiles.errorTarget = innerWidth < 900 ? 16 : 8;
        tiles.lruCache.minSize = innerWidth < 900 ? 300 : 900;
        tiles.lruCache.maxSize = innerWidth < 900 ? 500 : 1600;
        const draco = new DRACOLoader();
        draco.setDecoderPath("js/vendor/draco/");
        const gl = new GLTFLoader(tiles.manager);
        gl.setDRACOLoader(draco);
        tiles.manager.addHandler(/\.gltf$/, gl);
        tiles.addEventListener("load-model", () => models++);
        tiles.setCamera(camera);
        tiles.setResolutionFromRenderer(camera, renderer);
        tiles.group.matrixAutoUpdate = false;
        scene.add(tiles.group);
        ray.caster = new THREE.Raycaster();
        ray.caster.firstHitOnly = true;
        t0 = Date.now();
        place(sim ? sim.along : 0, true);
      })().catch((e) => {
        err = "読み込めませんでした(" + String((e && e.message) || e).slice(0, 40) + ")";
        tiles = null;
        starting = null;
      });
      return starting;
    }
    // 基準点(自分のいる所)を置き直し、地心座標 → アプリの平面 の変換を作る
    function place(along, force) {
      if (!tiles) return;
      const THREE = T();
      const p = at(along);
      if (!force && anchor && Math.hypot(p.x - anchor.x, p.z - anchor.z) < 400) return;
      anchor = { x: p.x, z: p.z };
      const lat = route.lat0 - p.z / route.kz, lon = route.lon0 + p.x / route.kx;
      const D = Math.PI / 180, A = 6378137, E2 = 0.00669437999014;
      const sl = Math.sin(lat * D), N = A / Math.sqrt(1 - E2 * sl * sl), M = (A * (1 - E2)) / Math.pow(1 - E2 * sl * sl, 1.5);
      const sx = route.kx / (N * Math.cos(lat * D) * D), sz = route.kz / (M * D);
      const enu = new THREE.Matrix4();
      tiles.ellipsoid.getEastNorthUpFrame(lat * D, lon * D, enu);
      const toApp = new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1); // (東, 北, 上) → (x, y, z) = (東, 上, -北)
      // 縮尺は東西と南北でわずかに違う(0.3%ほど)。3D Tiles の細かさの計算が狂わないよう、平均の1つにそろえる(400mで1m未満の差)
      const k = (sx + sz) / 2;
      const m = new THREE.Matrix4().makeTranslation(p.x, -groundH, p.z).multiply(new THREE.Matrix4().makeScale(k, k, k)).multiply(toApp).multiply(enu.invert());
      tiles.group.matrix.copy(m);
      tiles.group.matrixWorldNeedsUpdate = true;
      tiles.group.updateMatrixWorld(true);
    }
    // 地面の高さ: 自分の真下を測って、道路の面が y=0 になるようにする
    function groundAt(x, z) {
      const THREE = T();
      let best = null;
      for (const [dx, dz] of [[0, 0], [1.2, 0], [-1.2, 0], [0, 1.2], [0, -1.2]]) {
        ray.caster.set(new THREE.Vector3(x + dx, 400, z + dz), new THREE.Vector3(0, -1, 0));
        const hit = ray.caster.intersectObject(tiles.group, true)[0];
        if (hit && (best == null || hit.point.y < best)) best = hit.point.y; // 木や車ではなく、いちばん低い所(路面)
      }
      return best;
    }
    function update(dt) {
      if (!on || !tiles) return;
      const s = sim;
      place(s.along);
      if ((ray.tick += dt) > 0.3) {
        ray.tick = 0;
        const p = at(s.along);
        const g = groundAt(p.x, p.z);
        if (g != null && Math.abs(g) < 60) {
          groundH += g * 0.6;
          place(s.along, true);
        }
        const r = at(s.rAlong);
        const gr = Math.hypot(r.x - p.x, r.z - p.z) < 600 ? groundAt(r.x - r.tz * 1.3, r.z + r.tx * 1.3) : null;
        ray.rival = gr != null && Math.abs(gr) < 40 ? gr : 0;
      }
      camera.updateMatrixWorld();
      tiles.setResolutionFromRenderer(camera, renderer);
      tiles.update();
      if (!err && !models && Date.now() - t0 > 20000) {
        // 届かないときは、自前の街に戻して走り続ける
        err = "街が届きません。APIキーと、Map Tiles API の有効化・請求先の設定を確かめてください";
        on = false;
        tiles.group.visible = false;
        $("ct-google").checked = false;
        syncGoogle();
        ticker("Googleの3Dが読めないので、いつもの街で走ります", "opp");
      }
    }
    function credits() {
      if (!tiles) return "";
      const list = [];
      try {
        for (const a of tiles.getAttributions()) if (a.type === "string" && a.value) list.push(a.value);
      } catch (e) {}
      return list.join(" ・ ");
    }
    return {
      getKey,
      setKey(k) {
        try {
          localStorage.setItem("city_gkey", (k || "").trim());
        } catch (e) {}
      },
      async set(v) {
        on = v && !!getKey();
        if (on) await start();
        if (tiles) tiles.group.visible = on;
        return on;
      },
      on: () => on && !!tiles,
      update,
      credits,
      rivalY: () => ray.rival,
      err: () => err,
      models: () => models,
    };
  })();
  // 地図の区画のうち、施設の看板だけは残す(Googleの3Dでも、どこを走っているかわかるように)
  function hideOwnCity(group, g) {
    for (const ch of group.children) if (!ch.userData.sign) ch.visible = !g;
  }
  // Googleの3Dを使うときは、自前の街(地図の建物・道・PLATEAU・航空写真)を隠す
  function syncGoogle() {
    const g = G3.on();
    for (const t of tiles.values()) if (t.group) hideOwnCity(t.group, g);
    syncPlaceholders();
    if (routeStrip) routeStrip.visible = !g;
    if (ground) ground.position.y = g ? -3 : 0;
    for (const [, m] of photos) m.visible = !g && !!m.material.map;
    Plateau.setVisible(!g);
    $("ct-gm").hidden = !g;
  }

  // ---------- 地面の航空写真(国土地理院の地図タイル) ----------
  // 近くだけ細かい写真(ズーム18・1枚 約120m)。早送りのときは粗い写真にして、取りに行く枚数を減らす
  let photos = new Map(), photoOn = true;
  function photoStyle() {
    // 写真があるときは、描いた道をうすくして写真の道を見せる。公園などの色ぬりは消す
    mats.road.transparent = true;
    mats.road.opacity = photoOn ? 0.28 : 1;
    mats.road.depthWrite = !photoOn;
    mats.area.visible = !photoOn;
  }
  function wantPhotos(along) {
    const THREE = T();
    const need = new Set();
    if (photoOn) {
      const z = sim.speedX >= 10 ? 16 : sim.speedX >= 5 ? 17 : 18, n = 2 ** z;
      const R = z === 18 ? 240 : z === 17 ? 430 : 820;
      for (const d of [0, R * 0.8]) {
        const p = at(along + d);
        const lat = route.lat0 - p.z / route.kz, lon = route.lon0 + p.x / route.kx;
        const size = (40075016 * Math.cos((lat * Math.PI) / 180)) / n, k = Math.ceil(R / size);
        const cx = Math.floor(((lon + 180) / 360) * n), cy = Math.floor(((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * n);
        for (let dx = -k; dx <= k; dx++) for (let dy = -k; dy <= k; dy++) if (Math.hypot(dx, dy) * size < R + size * 0.75) need.add(`${z}/${cx + dx}/${cy + dy}`);
      }
    }
    for (const key of need) {
      if (photos.has(key)) continue;
      const [z, x, y] = key.split("/").map(Number), n = 2 ** z;
      const lonOf = (v) => (v / n) * 360 - 180, latOf = (v) => (Math.atan(Math.sinh(Math.PI * (1 - (2 * v) / n))) * 180) / Math.PI;
      const a = project(latOf(y), lonOf(x)), b = project(latOf(y), lonOf(x + 1)), c = project(latOf(y + 1), lonOf(x + 1)), d = project(latOf(y + 1), lonOf(x));
      const h = z === 18 ? 0.014 : z === 17 ? 0.01 : 0.006;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute([a[0], h, a[1], d[0], h, d[1], c[0], h, c[1], a[0], h, a[1], c[0], h, c[1], b[0], h, b[1]], 3));
      geo.setAttribute("uv", new THREE.Float32BufferAttribute([0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1], 2));
      const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xa9aec4 }));
      mesh.visible = false;
      mesh.userData.g3hide = true;
      photos.set(key, mesh);
      scene.add(mesh);
      const ld = new THREE.TextureLoader();
      ld.setCrossOrigin("anonymous");
      ld.load(
        `https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/${key}.jpg`,
        (tex) => {
          tex.encoding = THREE.sRGBEncoding;
          tex.anisotropy = 8;
          mesh.material.map = tex;
          mesh.material.needsUpdate = true;
          mesh.visible = !G3.on();
        },
        undefined,
        () => {}
      );
    }
    for (const [key, mesh] of photos) {
      if (need.has(key)) continue;
      scene.remove(mesh);
      mesh.geometry.dispose();
      if (mesh.material.map) mesh.material.map.dispose();
      mesh.material.dispose();
      photos.delete(key);
    }
  }

  async function pump() {
    if (loading) return;
    if (!queue.length) return prefetch();
    const key = queue.shift();
    const t = tiles.get(key);
    if (!t || t.state !== "wait") return pump();
    loading++;
    hudMap();
    try {
      const data = await fetchTile(t.ix, t.iy);
      if (tiles.get(key) === t) {
        t.group = buildTile(data);
        t.state = "ok";
        if (G3.on()) hideOwnCity(t.group, true);
        scene.add(t.group);
      }
    } catch (e) {
      // 3回までやり直す(混んでいるだけのことが多い)
      t.tries = (t.tries || 0) + 1;
      if (t.tries < 3) {
        t.state = "wait";
        setTimeout(() => (tiles.get(key) === t && queue.push(key), pump()), 6000 * t.tries);
      } else (t.state = "fail"), failed++;
    }
    loading--;
    hudMap();
    setTimeout(pump, 400); // 地図サーバーに続けて送りすぎない
  }
  // 手が空いているときに、この先のルートの街を先に取って端末に保存しておく(表示は近づいてから)
  async function prefetch() {
    if (!route || !sim || sim.done) return;
    if (!ahead) {
      ahead = [];
      const got = new Set();
      for (let d = 0; d <= route.length; d += 200) {
        const p = at(d);
        const k = tileX(route.lon0 + p.x / route.kx) + ":" + tileY(route.lat0 - p.z / route.kz);
        if (!got.has(k)) got.add(k), ahead.push(k);
      }
    }
    const key = ahead.shift();
    if (!key) return;
    const [ix, iy] = key.split(":").map(Number);
    loading++;
    try {
      await fetchTile(ix, iy);
    } catch (e) {}
    loading--;
    setTimeout(pump, 1200);
  }
  function hudMap() {
    const el = $("ct-map-state");
    if (!el) return;
    const n = queue.length + loading;
    const pn = typeof Plateau !== "undefined" && plateauOn && !G3.on() ? Plateau.left() : 0;
    el.textContent = (n ? `街を読み込み中… 残り${n}区画` : failed ? `読めなかった区画 ${failed}(道と建物が出ない所があります)` : "") + (pn ? ` 実物の建物を読み込み中… 残り${pn}区画` : "") + (lastErr ? ` ・地図サーバー: ${lastErr}` : "") + (G3.err() ? ` ・Googleの3D: ${G3.err()}` : "");
  }

  // ---------- 自転車と人(かんたんな形) ----------
  function makeBiker(color, color2) {
    const THREE = T();
    const g = new THREE.Group();
    const M = (c, o) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.55, metalness: 0.2 }, o || {}));
    const frameM = M(color, { metalness: 0.5, roughness: 0.35 }), black = M(0x15171a), skin = M(0xd9a27e), kit = M(color2), white = M(0xf1f1f1);
    const cyl = (a, b, r, m) => {
      const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A);
      const me2 = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 10), m);
      me2.position.copy(A).addScaledVector(d, 0.5);
      me2.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
      return me2;
    };
    const R = 0.34;
    const wheels = [];
    for (const x of [-0.5, 0.52]) {
      const w = new THREE.Group();
      w.add(new THREE.Mesh(new THREE.TorusGeometry(R - 0.02, 0.022, 8, 28), black));
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI;
        w.add(cyl([Math.cos(a) * (R - 0.03), Math.sin(a) * (R - 0.03), 0], [-Math.cos(a) * (R - 0.03), -Math.sin(a) * (R - 0.03), 0], 0.003, white));
      }
      w.position.set(x, R, 0);
      g.add(w);
      wheels.push(w);
    }
    const bb = [0, 0.28, 0], seat = [-0.17, 0.86, 0], head = [0.4, 0.84, 0], headB = [0.44, 0.7, 0], rear = [-0.5, R, 0], front = [0.52, R, 0], bar = [0.46, 0.93, 0];
    for (const [a, b, r] of [[bb, seat, 0.017], [seat, head, 0.016], [bb, headB, 0.019], [head, headB, 0.018], [bb, rear, 0.011], [seat, rear, 0.009], [headB, front, 0.013], [head, bar, 0.013]]) g.add(cyl(a, b, r, frameM));
    g.add(cyl([-0.19, 0.93, 0], seat, 0.012, black));
    const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.12), black);
    saddle.position.set(-0.2, 0.95, 0);
    g.add(saddle);
    g.add(cyl([0.5, 0.93, -0.2], [0.5, 0.93, 0.2], 0.012, black));
    for (const s of [-1, 1]) g.add(cyl([0.5, 0.93, s * 0.2], [0.57, 0.84, s * 0.2], 0.012, black));
    // 体
    const hip = [-0.16, 0.98, 0], sh = [0.3, 1.33, 0];
    const torso = cyl(hip, sh, 0.12, kit);
    torso.scale.z = 1.25;
    g.add(torso);
    const hd = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), skin);
    hd.position.set(0.4, 1.47, 0);
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.115, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), white);
    helmet.position.set(0.39, 1.49, 0);
    helmet.scale.set(1.25, 1, 1);
    g.add(hd, helmet);
    for (const s of [-1, 1]) {
      g.add(cyl([sh[0], sh[1], s * 0.17], [0.42, 1.08, s * 0.2], 0.04, skin));
      g.add(cyl([0.42, 1.08, s * 0.2], [0.55, 0.9, s * 0.2], 0.035, skin));
    }
    // 脚(クランクに合わせて動く)
    const legs = [];
    for (const s of [-1, 1]) {
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.05, 1, 10), black);
      const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 1, 10), skin);
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.05, 0.08), white);
      const crank = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.17, 0.015), black);
      g.add(thigh, shank, foot, crank);
      legs.push({ s, thigh, shank, foot, crank });
    }
    const ringM = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.008, 24), black);
    ringM.rotation.x = Math.PI / 2;
    ringM.position.set(0, 0.28, 0.05);
    g.add(ringM);
    const place = (mesh, a, b) => {
      const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A);
      mesh.scale.y = d.length();
      mesh.position.copy(A).addScaledVector(d, 0.5);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    };
    let th = 0;
    const pose = (dAngle, spin) => {
      th += dAngle;
      for (const w of wheels) w.rotation.z -= spin;
      for (const L of legs) {
        const a = th + (L.s > 0 ? 0 : Math.PI), z = L.s * 0.11;
        const px = Math.sin(a) * 0.17, py = 0.28 + Math.cos(a) * 0.17;
        const ax = px - 0.1, ay = py + 0.11; // 足首
        const dx = ax - hip[0], dy = ay - hip[1], D = Math.min(0.89, Math.hypot(dx, dy));
        const l1 = 0.46, l2 = 0.44;
        const al = Math.atan2(dy, dx) + Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + D * D - l2 * l2) / (2 * l1 * D))));
        const kx = hip[0] + Math.cos(al) * l1, ky = hip[1] + Math.sin(al) * l1;
        place(L.thigh, [hip[0], hip[1], z * 0.8], [kx, ky, z]);
        place(L.shank, [kx, ky, z], [ax, ay, z]);
        L.foot.position.set(px + 0.02, py + 0.04, z);
        L.crank.position.set(px / 2, 0.28 + (py - 0.28) / 2, L.s * 0.085);
        L.crank.rotation.z = -a;
      }
    };
    pose(0, 0);
    return { g, pose };
  }
  // ---------- ガレージと同じ3Dのバイクとライダー ----------
  // 自分: ガレージで組んだ「いま選んでいる構成」。ライバル: 同じモデルを複製して、フレームを赤に塗る
  let GB = null;
  function garageBikers(meFallback, rivalFallback) {
    const THREE = T();
    let root = null;
    try {
      const G = typeof Store !== "undefined" && Store.garage;
      if (typeof View3D === "undefined" || typeof Fit === "undefined" || !G || !G.builds) return null;
      const b = G.builds[G.active] || G.builds.current;
      if (!b || !b.geo || !G.body) return null;
      const tire = (b.parts.tires && b.parts.tires.attrs && b.parts.tires.attrs.width) || 28;
      const fit = Fit.compute({ geo: b.geo, pos: b.pos, aero: Parts.aeroOf(b.parts), wheelRadius: 0.311 + tire / 1000 }, G.body);
      root = View3D.headless(fit, b, G.body);
    } catch (e) {
      return null;
    }
    if (!root) return null;
    // 自分: 簡単な形は隠して、ガレージのモデルを入れる(名札などはそのまま)
    for (const c of meFallback.g.children) c.visible = false;
    meFallback.g.add(root);
    meFallback.pose = () => {};
    const R = View3D.wheelRadius();
    const st = { crank: 90, wheel: 0, rCrank: 270, rWheel: 0, clone: null, src: null, dst: null, busy: false };
    async function makeRival() {
      st.busy = true;
      try {
        const { clone } = await import("three/examples/jsm/utils/SkeletonUtils.js");
        View3D.poseAt(st.crank, st.wheel);
        const c = clone(root);
        // フレームとフォークを赤に
        c.traverse((o) => {
          if (o.userData && (o.userData.slot === "frame" || o.userData.slot === "fork"))
            o.traverse((m) => {
              if (m.isMesh && m.material && m.material.color && !m.material.map) {
                m.material = m.material.clone();
                m.material.color.setHex(0xc81e3a);
              }
            });
        });
        st.src = [];
        st.dst = [];
        root.traverse((o) => st.src.push(o));
        c.traverse((o) => st.dst.push(o));
        if (st.src.length !== st.dst.length) return;
        for (const ch of rivalFallback.g.children) if (!ch.isSprite) ch.visible = false;
        rivalFallback.g.add(c);
        rivalFallback.pose = () => {};
        st.clone = c;
      } catch (e) {
        // 複製できなければ、ライバルは簡単な形のまま
      } finally {
        st.busy = false;
      }
    }
    return {
      update(dt, myPed, myV, rvPed, rvV) {
        if (myPed) st.crank = (st.crank + dt * 510) % 360;
        st.wheel += (myV * dt) / R;
        if (rvPed) st.rCrank = (st.rCrank + dt * 510) % 360;
        st.rWheel += (rvV * dt) / R;
        if (!st.clone && !st.busy && View3D.hasRig() && (st.tries = (st.tries || 0) + 1) < 4) makeRival();
        if (st.clone) {
          View3D.poseAt(st.rCrank, st.rWheel);
          const a = st.src, b = st.dst;
          for (let i = 0; i < a.length; i++) {
            b[i].position.copy(a[i].position);
            b[i].quaternion.copy(a[i].quaternion);
            b[i].scale.copy(a[i].scale);
            b[i].visible = a[i].visible;
          }
        }
        View3D.poseAt(st.crank, st.wheel);
      },
    };
  }

  // ---------- 召喚中のモンスター: 自転車の後ろについて浮かぶ ----------
  const Mons = (() => {
    const live = new Map(); // "side:uid" → { obj, side, slot, born, gone, seen }
    const cache = new Map();
    let loader = null;
    const size = (m) => (m.ace ? 1.9 : m.synchro ? 1.5 : 1.1);
    // ガレージで登録した3Dモデル(なければ null)。高さ1・足もとが原点・前が +x
    function template(m, side) {
      const key = side + "|" + m.name;
      if (!cache.has(key))
        cache.set(
          key,
          (async () => {
            const THREE = T();
            if (typeof MonsterArt === "undefined" || !MonsterArt.glb || !window.GLTFLoader) return null;
            const g = await MonsterArt.glb(m, side);
            if (!g) return null;
            loader = loader || new window.GLTFLoader();
            const gltf = await new Promise((res, rej) => loader.parse(g.buf, "", res, rej));
            const inner = new THREE.Group();
            inner.add(gltf.scene);
            inner.rotation.set(g.tf.flip ? Math.PI : 0, (g.tf.rotY || 0) + Math.PI / 2, 0);
            const wrap = new THREE.Group();
            wrap.add(inner);
            let box = new THREE.Box3().setFromObject(wrap);
            const sz = box.getSize(new THREE.Vector3());
            inner.scale.setScalar(1 / Math.max(sz.y, sz.x * 0.7, sz.z * 0.7, 1e-3));
            box = new THREE.Box3().setFromObject(wrap);
            const c = box.getCenter(new THREE.Vector3());
            inner.position.set(-c.x, -box.min.y, -c.z);
            return wrap;
          })().catch(() => null)
        );
      return cache.get(key);
    }
    // 3Dモデルがないときは、絵(ガレージで焼いた絵)か絵文字を光の中に浮かべる
    function sprite(m, side) {
      const THREE = T();
      const cv = document.createElement("canvas");
      cv.width = cv.height = 256;
      const c = cv.getContext("2d");
      const col = side === "you" ? "120,200,255" : "255,90,120";
      const gr = c.createRadialGradient(128, 128, 10, 128, 128, 128);
      gr.addColorStop(0, `rgba(${col},0.55)`);
      gr.addColorStop(0.6, `rgba(${col},0.18)`);
      gr.addColorStop(1, `rgba(${col},0)`);
      c.fillStyle = gr;
      c.fillRect(0, 0, 256, 256);
      const tex = new THREE.CanvasTexture(cv);
      tex.encoding = THREE.sRGBEncoding;
      const url = typeof MonsterArt !== "undefined" && MonsterArt.src(m, side);
      if (url) {
        const im = new Image();
        im.onload = () => {
          const k = Math.min(220 / im.width, 220 / im.height);
          c.drawImage(im, 128 - (im.width * k) / 2, 128 - (im.height * k) / 2, im.width * k, im.height * k);
          tex.needsUpdate = true;
        };
        im.src = url;
      } else {
        c.font = "150px sans-serif";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(m.icon || "❔", 128, 140);
      }
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
      sp.center.set(0.5, 0.08);
      return sp;
    }
    function atkTag(m, side) {
      const THREE = T();
      const cv = document.createElement("canvas");
      cv.width = 256;
      cv.height = 64;
      const c = cv.getContext("2d");
      c.fillStyle = side === "you" ? "rgba(10,40,110,0.82)" : "rgba(110,10,36,0.82)";
      c.fillRect(20, 10, 216, 44);
      c.fillStyle = "#ffd23d";
      c.fillRect(20, 10, 216, 3);
      c.font = "700 30px sans-serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillStyle = "#fff";
      c.fillText(`ATK ${m.atk}${m.lv ? "  ★" + m.lv : ""}`, 128, 34);
      const t = new THREE.CanvasTexture(cv);
      t.encoding = THREE.sRGBEncoding;
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
      sp.scale.set(0.9, 0.225, 1);
      return sp;
    }
    function spawn(m, side) {
      const THREE = T();
      const obj = new THREE.Group();
      const body = new THREE.Group();
      obj.add(body);
      const s = size(m);
      // 足もとの光の輪
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.35, 0.5, 32), new THREE.MeshBasicMaterial({ color: side === "you" ? 0x6cc8ff : 0xff5a78, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false }));
      ring.rotation.x = -Math.PI / 2;
      ring.scale.setScalar(s * 0.8);
      obj.add(ring);
      const tag = atkTag(m, side);
      tag.position.y = s + 0.22;
      obj.add(tag);
      const fb = sprite(m, side);
      fb.scale.set(s * 1.2, s * 1.2, 1);
      body.add(fb);
      template(m, side).then((tpl) => {
        if (!tpl) return;
        const c = tpl.clone(true);
        c.scale.setScalar(s);
        body.remove(fb);
        body.add(c);
      });
      obj.scale.setScalar(0.01);
      scene.add(obj);
      return { obj, body, ring, side, born: sim ? sim.t : 0, gone: null, m };
    }
    function update(dt) {
      if (!sim || !sim.ride.duel) return;
      const b = Battle.state(sim.ride);
      for (const L of live.values()) L.seen = false;
      for (const side of ["you", "opp"])
        (b[side].field || []).forEach((m, i) => {
          if (!m) return;
          const key = side + ":" + m.uid;
          let L = live.get(key);
          if (!L) live.set(key, (L = spawn(m, side)));
          L.slot = i;
          L.seen = true;
          L.gone = null;
        });
      const t = sim.t;
      for (const [key, L] of live) {
        if (!L.seen && L.gone == null) L.gone = t;
        const bike = L.side === "you" ? me.g : rival.g;
        const yaw = bike.rotation.y, dx = Math.cos(-yaw), dz = Math.sin(-yaw);
        // 自転車の斜め後ろの上に浮かぶ(カメラから自転車が隠れないように、左右と上に分ける)
        const back = L.slot === 2 ? 2.6 : 1.8, lat = L.slot === 0 ? 1.7 : L.slot === 1 ? -1.7 : 0;
        const bob = Math.sin(t * 1.7 + L.slot * 2) * 0.15;
        const tx = bike.position.x - dx * back + dz * lat, tz = bike.position.z - dz * back - dx * lat, ty = bike.position.y + (L.slot === 2 ? 3.4 : 2.3) + bob;
        const k = 1 - Math.exp(-dt * 5);
        const o = L.obj;
        if (o.scale.x < 0.05) o.position.set(tx, ty, tz);
        o.position.x += (tx - o.position.x) * k;
        o.position.y += (ty - o.position.y) * k;
        o.position.z += (tz - o.position.z) * k;
        o.rotation.y = yaw;
        L.body.rotation.y = Math.sin(t * 0.8 + L.slot) * 0.25;
        L.ring.rotation.z += dt * 1.5;
        // 出てくるときは光って大きくなり、やられたら小さくなって消える
        const life = L.gone == null ? Math.min(1, (t - L.born) / 0.6) : Math.max(0, 1 - (t - L.gone) / 0.5);
        const sc = Math.max(0.01, life < 1 && L.gone == null ? 1 - Math.pow(1 - life, 3) * 1 + Math.sin(life * Math.PI) * 0.25 : life);
        o.scale.setScalar(sc);
        if (L.gone != null && life <= 0) {
          scene.remove(o);
          live.delete(key);
        }
      }
    }
    return { update };
  })();

  function nameTag(text, color) {
    const THREE = T();
    const cv = document.createElement("canvas");
    cv.width = 256;
    cv.height = 64;
    const c = cv.getContext("2d");
    c.fillStyle = "rgba(8,10,14,0.75)";
    c.fillRect(0, 8, 256, 48);
    c.fillStyle = color;
    c.fillRect(0, 8, 6, 48);
    c.font = "700 30px sans-serif";
    c.fillStyle = "#fff";
    c.textBaseline = "middle";
    c.fillText(text.slice(0, 12), 16, 33);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), depthTest: false }));
    sp.scale.set(2.4, 0.6, 1);
    sp.position.y = 2.15;
    return sp;
  }

  // ---------- 3Dの用意 ----------
  // 時間帯。昼は航空写真や壁の写真と同じ光(リアル優先)、夕方・夜は窓に明かり
  const lights = {};
  let timeMode = (() => {
    try {
      return localStorage.getItem("city_time") || "day";
    } catch (e) {
      return "day";
    }
  })();
  const TIMES = {
    day: { sky: [[0, "#3f7fd0"], [0.5, "#8fbbe8"], [0.7, "#d6e4f0"], [1, "#e4ebf0"]], fog: 0xc9d6e2, near: 220, far: 1100, hemi: [0xe6efff, 0x8a8478, 1.05], sun: [0xfff4e2, 1.1, [-0.35, 0.8, 0.45]], glow: 0, win: 0, ground: 0x3b3d40, photo: 0xffffff },
    dusk: { sky: [[0, "#0b1230"], [0.45, "#27306a"], [0.62, "#b0567a"], [0.72, "#f0a060"], [1, "#f0a060"]], fog: 0x6a4a66, near: 120, far: 620, hemi: [0xaab4ff, 0x3a3038, 0.85], sun: [0xffb070, 0.9, [-0.6, 0.35, 0.5]], glow: 0.85, win: 0.75, ground: 0x23272b, photo: 0xb8aab4 },
    night: { sky: [[0, "#02040c"], [0.6, "#0a1430"], [0.75, "#1c2340"], [1, "#2a2a3a"]], fog: 0x141a2c, near: 90, far: 520, hemi: [0x5a6aa0, 0x10121a, 0.5], sun: [0x8aa0ff, 0.25, [0.3, 0.6, -0.4]], glow: 1.1, win: 1, ground: 0x15171a, photo: 0x6a6e80 },
  };
  function setTime(m) {
    const THREE = T();
    const c = TIMES[m] || TIMES.day;
    timeMode = TIMES[m] ? m : "day";
    try {
      localStorage.setItem("city_time", timeMode);
    } catch (e) {}
    const cv = document.createElement("canvas");
    cv.width = 4;
    cv.height = 256;
    const x = cv.getContext("2d"), gr = x.createLinearGradient(0, 0, 0, 256);
    for (const [o, col] of c.sky) gr.addColorStop(o, col);
    x.fillStyle = gr;
    x.fillRect(0, 0, 4, 256);
    const tx = new THREE.CanvasTexture(cv);
    tx.encoding = THREE.sRGBEncoding;
    if (scene.background && scene.background.dispose) scene.background.dispose();
    scene.background = tx;
    scene.fog.color.setHex(c.fog);
    scene.fog.near = c.near;
    scene.fog.far = c.far;
    lights.hemi.color.setHex(c.hemi[0]);
    lights.hemi.groundColor.setHex(c.hemi[1]);
    lights.hemi.intensity = c.hemi[2];
    lights.sun.color.setHex(c.sun[0]);
    lights.sun.intensity = c.sun[1];
    lights.sun.position.set(...c.sun[2]);
    if (mats) {
      mats.bld.emissiveIntensity = c.glow;
      for (const f of mats.fac) f.emissiveIntensity = c.win;
    }
    if (ground) ground.material.color.setHex(c.ground);
    photoTint = c.photo;
    scene.traverse((o) => o.isMesh && o.material && o.material.isMeshBasicMaterial && o.material.map && o.userData.photo && o.material.color.setHex(c.photo));
    const sel = $("ct-time");
    if (sel) sel.value = timeMode;
  }
  let photoTint = 0xffffff;

  function init3D() {
    const THREE = T();
    const el = $("ct-view");
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputEncoding = THREE.sRGBEncoding;
    el.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x6a4a66, 120, 620);
    lights.hemi = new THREE.HemisphereLight(0xaab4ff, 0x3a3038, 0.85);
    lights.sun = new THREE.DirectionalLight(0xffb070, 0.9);
    scene.add(lights.hemi, lights.sun);
    camera = new THREE.PerspectiveCamera(60, 1, 0.3, 1400);
    ground = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), new THREE.MeshLambertMaterial({ color: 0x23272b }));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);
    // 金属や塗装(ガレージのバイク)に空が映り込むように、周りの景色を作る
    try {
      const cv = document.createElement("canvas");
      cv.width = 64;
      cv.height = 32;
      const x = cv.getContext("2d"), gr = x.createLinearGradient(0, 0, 0, 32);
      gr.addColorStop(0, "#9cc4ee");
      gr.addColorStop(0.48, "#e8eef4");
      gr.addColorStop(0.52, "#7a7c80");
      gr.addColorStop(1, "#3a3c40");
      x.fillStyle = gr;
      x.fillRect(0, 0, 64, 32);
      const et = new THREE.CanvasTexture(cv);
      et.mapping = THREE.EquirectangularReflectionMapping;
      et.encoding = THREE.sRGBEncoding;
      const pm = new THREE.PMREMGenerator(renderer);
      scene.environment = pm.fromEquirectangular(et).texture;
      pm.dispose();
    } catch (e) {}
    buildMats();
    setTime(timeMode);
    clock = new THREE.Clock();
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);
    resize();
  }
  function buildRouteStrip() {
    const THREE = T();
    const pos = [];
    const { xy } = route;
    for (let i = 0; i < xy.length - 1; i++) {
      const a = xy[i], b = xy[i + 1], dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz) || 1;
      const nx = (dz / L) * 0.55, nz = (-dx / L) * 0.55;
      pos.push(a[0] - nx, 0.09, a[1] - nz, a[0] + nx, 0.09, a[1] + nz, b[0] + nx, 0.09, b[1] + nz, a[0] - nx, 0.09, a[1] - nz, b[0] + nx, 0.09, b[1] + nz, b[0] - nx, 0.09, b[1] - nz);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    routeStrip = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x35d6ff, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false }));
    scene.add(routeStrip);
    // ゴールの門
    const g = at(route.length);
    const gate = new THREE.Mesh(new THREE.TorusGeometry(5, 0.35, 8, 24, Math.PI), new THREE.MeshBasicMaterial({ color: 0xffc44d }));
    gate.position.set(g.x, 0, g.z);
    gate.rotation.y = -Math.atan2(g.tz, g.tx) + Math.PI / 2;
    scene.add(gate);
  }

  // ---------- ゲームの進行 ----------
  const KMH = 3.6;
  function start(opts) {
    const THREE = T();
    const prof = (typeof Store !== "undefined" && Store.profile) || {};
    const bikeKg = (prof.useGarage && prof.bikeKg) || 9;
    sim = {
      t: 0, along: 0, v: 0, rAlong: 0, rV: 0, pedal: false, brake: false, sprint: false, auto: !!opts.auto, speedX: 1,
      stamina: 1, mass: (prof.weightKg || 70) + bikeKg, rivalV: opts.rivalKmh / KMH, done: false, paused: false, cad: 0,
      ride: { startedAt: 1700000000000 + Math.floor(Math.random() * 1e6), distance: 0, last: { t: 0 } },
      camPos: null,
    };
    sim.ride.last.t = sim.ride.startedAt;
    me = makeBiker(0xff8a1f, 0x1b2f6b);
    rival = makeBiker(0xd22b3a, 0x161616);
    scene.add(me.g, rival.g);
    const foe = Battle.foeOf(Battle.state(sim.ride));
    rival.g.add(nameTag(foe.name, "#ff4455"));
    GB = garageBikers(me, rival);
    if (typeof MonsterArt !== "undefined") MonsterArt.load();
    Battle.deal(sim.ride);
    buildRouteStrip();
    wantTiles(0);
    photoStyle();
    wantPhotos(0);
    Plateau.want(0);
    hudDuel();
    // 最初の街が出るまで待つ(長くても40秒。出なければ道の線だけで走り出す)
    sim.paused = true;
    const wait = $("ct-wait");
    wait.hidden = false;
    const t0 = Date.now();
    const iv = setInterval(() => {
      const ok = [...tiles.values()].some((t) => t.state === "ok") && Plateau.ready();
      const sec = Math.round((Date.now() - t0) / 1000);
      wait.querySelector("small").textContent = `${sec}秒${lastErr ? " ・地図サーバー: " + lastErr + "(やり直し中)" : ""}`;
      if (ok || sec >= 40) {
        clearInterval(iv);
        wait.hidden = true;
        sim.paused = false;
        ticker(`ライディング・デュエル、アクセラレーション! 相手は${foe.name}`, "you");
        if (typeof DuelLines !== "undefined") sayLine(DuelLines.accel());
        if (!ok) ticker("街を読めていません。道の線だけで走ります", "opp");
      }
    }, 300);
    running = true;
    clock.getDelta();
    loop();
  }

  function physics(dt) {
    const s = sim;
    const want = s.auto || s.pedal;
    if (s.sprint && s.stamina > 0.02 && want) s.stamina = Math.max(0, s.stamina - dt / 14);
    else s.stamina = Math.min(1, s.stamina + dt / 45);
    const P = s.brake ? 0 : want ? (s.sprint && s.stamina > 0.02 ? 620 : s.auto && !s.pedal ? 150 : 270) : 0;
    const v = Math.max(s.v, 1.2);
    let F = P / v - 0.5 * 1.2 * 0.32 * s.v * s.v - 0.005 * s.mass * 9.81 * (s.v > 0.05 ? 1 : 0);
    if (s.brake) F -= s.mass * 4;
    // 曲がり角では、曲がれる速さまで自動で落とす
    const turn = turnAhead(s.along);
    const vmax = turn > 75 ? 16 / KMH : turn > 50 ? 23 / KMH : turn > 28 ? 31 / KMH : 99;
    s.v = Math.max(0, s.v + (F / s.mass) * dt);
    if (s.v > vmax) s.v = Math.max(vmax, s.v - 6 * dt);
    s.along = Math.min(route.length, s.along + s.v * dt);
    s.power = P;
    // ライバル: 決めたペースを中心に、少し速くなったり遅くなったりする
    const rt = turnAhead(s.rAlong);
    const rmax = rt > 75 ? 16 / KMH : rt > 50 ? 23 / KMH : rt > 28 ? 31 / KMH : 99;
    const target = Math.min(rmax, s.rivalV * (1 + 0.09 * Math.sin(s.t / 37) + 0.05 * Math.sin(s.t / 11 + 2)));
    s.rV += Math.max(-4, Math.min(0.55, target - s.rV)) * Math.min(1, dt * 1.2);
    s.rAlong = Math.min(route.length, s.rAlong + s.rV * dt);
    s.t += dt;
  }

  function stepDuel() {
    const s = sim;
    s.ride.distance = s.along;
    s.ride.last.t = s.ride.startedAt + s.t * 1000;
    const ev = Battle.step(s.ride, s.rivalV);
    if (!ev) return;
    const names = { you: "YOU", opp: ev.foe ? ev.foe.name : "相手" };
    for (const line of turnLines(ev, names)) ticker(line[0], line[1]);
    hudDuel(ev);
    // 早送り(×5以上)のときは、演出を出さずに文だけ流す
    Bgm.heat(Battle.state(s.ride).you.lp <= 3000 || route.length - s.along < 1000);
    if (s.speedX > 2) return;
    // ふつうのターンは、画面の右上に小さな盤面を出して、1手ずつ動かして見せる
    const sc = ev.drama ? ev.drama.score : 0;
    const big = typeof Cinema !== "undefined" && sc >= 7 && s.t - (s.cineT || -99) > 45;
    if (!big && typeof Board !== "undefined" && ev.before && !(typeof Cinema !== "undefined" && Cinema.busy())) {
      try {
        Board.play(ev, names);
      } catch (e) {}
    }
    if (!big) duelVoice(ev);
    // 見せ場だけ、走りを止めて全画面の演出を入れる
    if (big) {
      try {
        const ok = Cinema.play(ev, (c) => say(c.line, c.vside || c.side, c.tone), () => (s.paused = false));
        if (ok) (s.paused = true), (s.cineT = s.t), setTimeout(() => (s.paused = false), 16000);
      } catch (e) {
        s.paused = false;
      }
    }
  }
  // 1ターンの出来事を、短い文にする
  function turnLines(ev, names) {
    const out = [];
    const who = (sd) => names[sd] || "";
    for (const st of ev.steps) {
      const sd = st.side || ev.side;
      if (st.t === "newfoe") out.push([`新たなライバル ${st.foe.name}(${st.foe.deckName})`, "opp"]);
      else if (st.t === "summon") out.push([`${who(sd)}: ${st.mon.name} を${st.how === "synchro" ? "シンクロ召喚" : st.how === "ace" ? "エース召喚" : "召喚"} ATK${st.mon.atk}`, sd]);
      else if (st.t === "spell") out.push([`${who(sd)}: ${st.card.name} 発動`, sd]);
      else if (st.t === "attack") out.push([`${who(sd)}: ${st.mon.name} の攻撃${st.dmg ? ` −${st.dmg}` : ""}`, sd]);
      else if (st.t === "burn") out.push([`${who(sd === "you" ? "opp" : "you")} に効果ダメージ −${st.dmg}`, sd]);
      else if (st.t === "destroy") out.push([`${st.mon.name} 破壊`, sd]);
      else if (st.t === "chain") out.push([`チェーン${st.links.length}!`, sd]);
      else if (st.t === "win") out.push([st.side === "you" ? `${st.foe} を撃破!` : "ライフがゼロに…", st.side]);
      else if ((st.t === "effect" || st.t === "info") && st.text) out.push([st.text, sd]);
    }
    return out.slice(0, 5);
  }
  function ticker(text, side) {
    const el = $("ct-ticker");
    if (!el) return;
    el.insertAdjacentHTML("beforeend", `<div class="ct-line ${side || ""}">${esc(text)}</div>`);
    while (el.children.length > 5) el.firstElementChild.remove();
  }
  // 声: 設定してあればAIの声(アプリ本体と同じ音声パック)、なければ端末の読み上げ
  function say(text, side = "you", tone = "") {
    if (!text || !$("ct-voice") || !$("ct-voice").checked) return;
    const tts = () => {
      if (!window.speechSynthesis) return;
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "ja-JP";
        u.rate = 1.15;
        u.pitch = side === "opp" ? 0.7 : 0.9;
        speechSynthesis.speak(u);
      } catch (e) {}
    };
    try {
      if (typeof AIVoice !== "undefined" && AIVoice.enabled() && AIVoice.say(text, { side, tone, fallback: tts })) return;
    } catch (e) {}
    tts();
  }
  const sayLine = (l) => l && say(l[0], l[1], l[2]);
  const sfx = (name, delay) => typeof Cinema !== "undefined" && $("ct-bgm") && $("ct-bgm").checked && Cinema.sfx(name, delay);
  // 1ターンで、いちばんの見せ場を一言だけ話す。効果音も鳴らす
  function duelVoice(ev) {
    if (typeof DuelLines === "undefined") return;
    const DL = DuelLines;
    let best = null, pri = 0;
    const put = (p, l) => p > pri && ((pri = p), (best = l));
    for (const st of ev.steps) {
      const sd = st.side || ev.side;
      if (st.t === "win") put(9, st.side === "you" ? DL.ko(st.foe) : DL.lifeZero()), sfx("shine");
      else if (st.t === "summon" && (st.how === "synchro" || st.how === "ace")) put(8, st.how === "ace" ? DL.aceCall(st.mon.name, sd) : DL.synchroCall(st.mon.name, sd)), sfx("riser"), sfx("shine", 0.5);
      else if (st.t === "chain" && st.links.length >= 2) put(6, DL.chain(st.links.length, sd)), sfx("clink");
      else if (st.t === "attack") put(st.target ? 4 : 5, DL.attack(st.mon.name, sd, !st.target)), sfx("hit", 0.2);
      else if (st.t === "burn") put(4, DL.burn(sd)), sfx("stab");
      else if (st.t === "spell" && sd === "you") put(3, DL.activate(st.card.name)), sfx("whoosh");
      else if (st.t === "summon") put(2, DL.summonCry(st.mon.name, sd)), sfx("whoosh");
    }
    if (!best && ev.side === "you") best = DL.myDraw();
    sayLine(best);
  }

  // ---------- バトルBGM(その場で音を作って鳴らす。オリジナルの曲) ----------
  const Bgm = (() => {
    let ac = null, gain = null, timer = 0, step = 0, nextT = 0, on = false, hot = false;
    const BPM = 148, S16 = 60 / BPM / 4;
    // Eマイナーの進行: Em → C → D → Bm(1小節ずつ)
    const ROOT = [40, 36, 38, 35];
    const ARP = [[0, 7, 12, 15, 19, 15, 12, 7], [0, 7, 12, 16, 19, 16, 12, 7], [0, 7, 12, 16, 19, 16, 12, 7], [0, 7, 12, 15, 19, 15, 12, 7]];
    const LEAD = [76, 0, 79, 0, 83, 81, 79, 0, 76, 0, 74, 76, 0, 0, 71, 0, 72, 0, 76, 0, 79, 0, 84, 83, 0, 79, 0, 76, 74, 0, 0, 0, 74, 0, 78, 0, 81, 0, 86, 0, 85, 81, 0, 78, 0, 74, 0, 0, 71, 0, 74, 0, 78, 0, 83, 0, 81, 78, 0, 74, 71, 0, 0, 0];
    const hz = (m) => 440 * 2 ** ((m - 69) / 12);
    const tone = (t, m, dur, type, vol, cut) => {
      const o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter();
      o.type = type;
      o.frequency.value = hz(m);
      f.type = "lowpass";
      f.frequency.value = cut;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(f).connect(g).connect(gain);
      o.start(t);
      o.stop(t + dur + 0.02);
    };
    const drum = (t, kind) => {
      if (kind === "kick") {
        const o = ac.createOscillator(), g = ac.createGain();
        o.frequency.setValueAtTime(150, t);
        o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
        g.gain.setValueAtTime(0.9, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        o.connect(g).connect(gain);
        o.start(t);
        o.stop(t + 0.18);
        return;
      }
      const len = kind === "snare" ? 0.14 : 0.04;
      const buf = ac.createBuffer(1, Math.ceil(ac.sampleRate * len), ac.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      const src = ac.createBufferSource(), g = ac.createGain(), f = ac.createBiquadFilter();
      src.buffer = buf;
      f.type = "highpass";
      f.frequency.value = kind === "snare" ? 1400 : 7000;
      g.gain.value = kind === "snare" ? 0.45 : 0.16;
      src.connect(f).connect(g).connect(gain);
      src.start(t);
    };
    const tick = () => {
      while (nextT < ac.currentTime + 0.18) {
        const bar = Math.floor(step / 16) % 4, i = step % 16, t = nextT;
        if (i % 4 === 0) drum(t, "kick");
        if (hot && i % 4 === 2 && i > 8) drum(t, "kick");
        if (i === 4 || i === 12) drum(t, "snare");
        if (i % 2 === 0) drum(t, "hat");
        if (i % 2 === 0) tone(t, ROOT[bar] + (i % 8 === 6 ? 12 : 0), S16 * 1.8, "sawtooth", 0.3, 520);
        tone(t, ROOT[bar] + 24 + ARP[bar][i % 8], S16 * 0.9, "square", 0.07, 2400);
        const n = LEAD[(Math.floor(step / 16) % 4) * 16 + i];
        if (n && Math.floor(step / 64) % 2 === 1) tone(t, n, S16 * 2.6, "triangle", 0.2, 3600);
        step++;
        nextT += S16;
      }
    };
    return {
      start() {
        try {
          if (!ac) {
            ac = new (window.AudioContext || window.webkitAudioContext)();
            gain = ac.createGain();
            gain.gain.value = 0.16;
            gain.connect(ac.destination);
          }
          if (ac.state === "suspended") ac.resume();
          if (on) return;
          on = true;
          nextT = ac.currentTime + 0.1;
          timer = setInterval(tick, 60);
        } catch (e) {}
      },
      stop() {
        on = false;
        clearInterval(timer);
      },
      // ピンチ・終盤は、ドラムを増やして盛り上げる
      heat(v) {
        hot = v;
      },
    };
  })();
  function hudDuel() {
    const b = Battle.state(sim.ride);
    const foe = Battle.foeOf(b);
    const pct = (lp) => Math.max(0, Math.min(100, (lp / Battle.LP0) * 100));
    $("ct-lp").innerHTML = `
      <div class="ct-lpb you"><span>YOU</span><b>${b.you.lp}</b><i><u style="width:${pct(b.you.lp)}%"></u></i></div>
      <div class="ct-turn">TURN ${b.turn}<small>${b.wins || 0}勝 ${b.losses || 0}敗</small></div>
      <div class="ct-lpb opp"><span>${esc(foe.name)}</span><b>${b.opp.lp}</b><i><u style="width:${pct(b.opp.lp)}%"></u></i></div>`;
    const hand = b.you.hand.slice(0, 5).map((k) => Battle.cardOf(k));
    $("ct-hand").innerHTML = hand.map((c) => `<span class="ct-card ${c.kind}">${c.icon || ""}<small>${esc(c.name)}</small></span>`).join("");
  }
  function hud() {
    const s = sim;
    if ((s.mapT = (s.mapT || 0) + 1) % 10 === 1) hudMap();
    if (G3.on() && (s.credT = (s.credT || 0) + 1) % 8 === 1) $("ct-gm-cred").textContent = G3.credits();
    $("ct-speed").textContent = (s.v * KMH).toFixed(0);
    if ((s.whereT = (s.whereT || 0) + 1) % 6 === 1) whereAmI();
    $("ct-power").textContent = `${s.power || 0} W`;
    $("ct-remain").textContent = `ゴールまで ${((route.length - s.along) / 1000).toFixed(2)} km`;
    const gap = s.along - s.rAlong;
    const el = $("ct-gap");
    el.textContent = Math.abs(gap) < 1 ? "ライバルと並走" : gap > 0 ? `リード +${gap.toFixed(0)} m` : `ビハインド ${gap.toFixed(0)} m`;
    el.className = "ct-gap " + (gap >= 0 ? "lead" : "behind");
    $("ct-stam").style.width = (s.stamina * 100).toFixed(0) + "%";
    const m = Math.floor(s.t / 60), sec = Math.floor(s.t % 60);
    $("ct-time").textContent = `${m}:${String(sec).padStart(2, "0")}`;
    drawMini();
  }
  // 右上の地図: ふだんは自分のまわり(地理院地図。駅名・道路名つき)、タップでルート全体
  let miniWhole = false;
  const mapImgs = new Map();
  function mapTile(z, x, y) {
    const key = z + "/" + x + "/" + y;
    let im = mapImgs.get(key);
    if (!im) {
      im = new Image();
      im.crossOrigin = "anonymous";
      im.src = `https://cyberjapandata.gsi.go.jp/xyz/std/${key}.png`;
      mapImgs.set(key, im);
      if (mapImgs.size > 120) mapImgs.delete(mapImgs.keys().next().value);
    }
    return im.complete && im.naturalWidth ? im : null;
  }
  function drawMini() {
    if (!miniWhole) return drawLocalMap();
    drawWholeMap();
  }
  function drawLocalMap() {
    const cv = $("ct-mini"), c = cv.getContext("2d");
    const W = cv.width, H = cv.height;
    const p = at(sim.along);
    const lat = route.lat0 - p.z / route.kz, lon = route.lon0 + p.x / route.kx;
    const Z = 16, n = 2 ** Z;
    // 地図のタイル座標(ピクセル)で、自分の位置
    const fx = ((lon + 180) / 360) * n * 256, fy = ((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * n * 256;
    const k = 1.0; // 地図1ピクセル = 画面1ピクセル(約2.4m)
    c.fillStyle = "#e8e6e0";
    c.fillRect(0, 0, W, H);
    const x0 = fx - W / 2 / k, y0 = fy - H / 2 / k;
    for (let tx = Math.floor(x0 / 256); tx <= Math.floor((x0 + W / k) / 256); tx++)
      for (let ty = Math.floor(y0 / 256); ty <= Math.floor((y0 + H / k) / 256); ty++) {
        const im = mapTile(Z, tx, ty);
        if (im) c.drawImage(im, (tx * 256 - x0) * k, (ty * 256 - y0) * k, 256 * k, 256 * k);
      }
    // ルート(地図のピクセル座標へ)
    const toPx = (x, z) => {
      const la = route.lat0 - z / route.kz, lo = route.lon0 + x / route.kx;
      const px = ((lo + 180) / 360) * n * 256, py = ((1 - Math.asinh(Math.tan((la * Math.PI) / 180)) / Math.PI) / 2) * n * 256;
      return [(px - x0) * k, (py - y0) * k];
    };
    c.lineCap = c.lineJoin = "round";
    for (const [w, col] of [[6, "rgba(255,255,255,0.9)"], [3.5, "#1e88ff"]]) {
      c.strokeStyle = col;
      c.lineWidth = w;
      c.beginPath();
      route.xy.forEach(([x, z], i) => {
        const [qx, qy] = toPx(x, z);
        if (i) c.lineTo(qx, qy);
        else c.moveTo(qx, qy);
      });
      c.stroke();
    }
    // ライバルと自分(自分は進む向きの矢印)
    const r = at(sim.rAlong), [rx, ry] = toPx(r.x, r.z);
    c.fillStyle = "#ff4455";
    c.strokeStyle = "#fff";
    c.lineWidth = 2;
    c.beginPath();
    c.arc(rx, ry, 5, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    const ang = Math.atan2(p.tz, p.tx);
    c.save();
    c.translate(W / 2, H / 2);
    c.rotate(ang);
    c.fillStyle = "#ff9a1f";
    c.beginPath();
    c.moveTo(10, 0);
    c.lineTo(-7, -7);
    c.lineTo(-3, 0);
    c.lineTo(-7, 7);
    c.closePath();
    c.fill();
    c.stroke();
    c.restore();
    c.fillStyle = "rgba(255,255,255,0.85)";
    c.fillRect(W - 54, H - 14, 54, 14);
    c.fillStyle = "#333";
    c.font = "9px sans-serif";
    c.fillText("地理院地図", W - 51, H - 4);
  }
  function drawWholeMap() {
    const cv = $("ct-mini"), c = cv.getContext("2d");
    const W = cv.width, H = cv.height;
    if (!route.box) {
      let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
      for (const [x, z] of route.xy) (x0 = Math.min(x0, x)), (x1 = Math.max(x1, x)), (z0 = Math.min(z0, z)), (z1 = Math.max(z1, z));
      const k = Math.min((W - 16) / Math.max(1, x1 - x0), (H - 16) / Math.max(1, z1 - z0));
      route.box = { x0, z0, k, ox: (W - (x1 - x0) * k) / 2, oz: (H - (z1 - z0) * k) / 2 };
    }
    const b = route.box, P = (x, z) => [b.ox + (x - b.x0) * b.k, b.oz + (z - b.z0) * b.k];
    c.clearRect(0, 0, W, H);
    c.fillStyle = "rgba(6,9,14,0.75)";
    c.fillRect(0, 0, W, H);
    c.strokeStyle = "rgba(255,255,255,0.55)";
    c.lineWidth = 2;
    c.beginPath();
    route.xy.forEach(([x, z], i) => {
      const [px, py] = P(x, z);
      if (i) c.lineTo(px, py);
      else c.moveTo(px, py);
    });
    c.stroke();
    // 駅など大きな目印を、地図にも出す
    c.font = "9px sans-serif";
    for (const t of tiles.values()) {
      const inf = t.state === "ok" && t.group && t.group.userData.info;
      for (const lm of (inf && inf.lms) || []) {
        if (lm.icon !== "🚉" && lm.icon !== "🎓") continue;
        const [px, py] = P(lm.x, lm.z);
        c.fillStyle = "#7fd8ff";
        c.fillRect(px - 2, py - 2, 4, 4);
        c.fillStyle = "rgba(255,255,255,0.9)";
        c.fillText(lm.name.slice(0, 6), px + 4, py + 3);
      }
    }
    for (const [al, col] of [[sim.rAlong, "#ff4455"], [sim.along, "#ffa030"]]) {
      const p = at(al), [px, py] = P(p.x, p.z);
      c.fillStyle = col;
      c.beginPath();
      c.arc(px, py, 4, 0, Math.PI * 2);
      c.fill();
    }
  }

  function placeBiker(b, along, side, dt, v, pedaling) {
    const p = at(along);
    b.g.position.set(p.x - p.tz * side, 0, p.z + p.tx * side);
    b.g.rotation.y = -Math.atan2(p.tz, p.tx);
    b.pose(pedaling ? dt * 9 : 0, (v * dt) / 0.34);
    return p;
  }

  function loop() {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const THREE = T();
    const real = Math.min(0.1, clock.getDelta());
    const s = sim;
    if (!s.paused && !s.done) {
      const n = s.speedX;
      for (let i = 0; i < n; i++) {
        physics(real);
        stepDuel();
        if (s.paused) break;
      }
      if (s.along >= route.length - 0.5) finish();
      if ((s.tileT = (s.tileT || 0) + real) > 1.5) (s.tileT = 0), wantTiles(s.along), G3.on() || (wantPhotos(s.along), Plateau.want(s.along));
    }
    const p = placeBiker(me, s.along, 0, real * s.speedX, s.v, (s.auto || s.pedal) && !s.brake && !s.paused);
    placeBiker(rival, s.rAlong, 1.3, real * s.speedX, s.rV, !s.paused);
    rival.g.position.y = G3.on() ? G3.rivalY() : 0;
    const myPed = (s.auto || s.pedal) && !s.brake && !s.paused && !s.done;
    if (GB) GB.update(real * s.speedX, myPed, s.paused ? 0 : s.v, !s.paused && !s.done, s.paused ? 0 : s.rV);
    Mons.update(real * Math.min(4, s.speedX));
    // 追いかけるカメラ(後ろ上から。速いほど少し引いて、視野を広げる)
    const back = 6.5 + s.v * 0.18, up = 2.9 + s.v * 0.05;
    const want = new THREE.Vector3(p.x - p.tx * back, up, p.z - p.tz * back);
    if (!s.camPos) s.camPos = want.clone();
    s.camPos.lerp(want, Math.min(1, real * 3.2));
    camera.position.copy(s.camPos);
    camera.lookAt(p.x + p.tx * 9, 1.2, p.z + p.tz * 9);
    camera.fov = 58 + Math.min(16, s.v * 1.1);
    camera.updateProjectionMatrix();
    ground.position.set(p.x, 0, p.z);
    G3.update(real);
    renderer.render(scene, camera);
    if ((s.hudT = (s.hudT || 0) + real) > 0.12) (s.hudT = 0), hud();
  }

  function finish() {
    const s = sim;
    s.done = true;
    const v = Battle.verdict(Battle.state(s.ride));
    const first = s.along >= s.rAlong;
    const m = Math.floor(s.t / 60), sec = Math.floor(s.t % 60);
    $("ct-result").hidden = false;
    $("ct-result").innerHTML = `<div class="ct-res-box">
      <small>GOAL</small>
      <h2>${v.winner === "you" ? "デュエルに勝利" : v.winner === "opp" ? "デュエルに敗北" : "デュエルは引き分け"}</h2>
      <p>${first ? "ライバルより先にゴール" : "ライバルが先にゴール"} ・ ${m}分${sec}秒 ・ ${(route.length / 1000).toFixed(1)}km ・ 平均 ${((route.length / Math.max(1, s.t)) * KMH).toFixed(1)}km/h</p>
      <p>LP ${v.you} − ${v.opp}(${v.wins}勝 ${v.losses}敗 / ${v.turns}ターン)</p>
      <button class="btn start" id="ct-again">もう一度</button> <a class="btn sub" href="index.html">アプリに戻る</a></div>`;
    $("ct-again").onclick = () => location.reload();
    Bgm.stop();
    say(v.winner === "you" ? "俺の勝ちだ。いいライディングだったぜ" : "次は必ず追い抜く");
  }

  // ---------- はじめの画面 ----------
  function placeOptions() {
    const list = STATIONS.slice();
    const saved = (typeof Store !== "undefined" && Store.places) || [];
    for (const p of saved) if (p.lat && p.lon) list.push({ name: "📍 " + p.name, lat: p.lat, lon: p.lon });
    return list;
  }
  async function begin() {
    const list = placeOptions();
    const from = list[+$("ct-from").value], to = list[+$("ct-to").value];
    const msg = $("ct-msg");
    if (!from || !to || (from.lat === to.lat && from.lon === to.lon)) return (msg.textContent = "出発と目的地を別の場所にしてください");
    $("ct-go").disabled = true;
    msg.textContent = "ルートを調べています…";
    try {
      const key = `city_route:${from.lat},${from.lon}:${to.lat},${to.lon}`;
      let pts = null;
      try {
        pts = JSON.parse(localStorage.getItem(key) || "null");
      } catch (e) {}
      if (!pts) {
        const r = await Nav.fetchRoute(from, to);
        pts = r.points;
        try {
          localStorage.setItem(key, JSON.stringify(pts));
        } catch (e) {}
      }
      makeRoute(pts);
    } catch (e) {
      $("ct-go").disabled = false;
      return (msg.textContent = "ルートを取れませんでした。通信を確かめて、もう一度お試しください");
    }
    // 音は、押したとき(ここ)に準備しないと鳴らせない
    try {
      if (typeof Cinema !== "undefined") Cinema.unlock();
      if (typeof AIVoice !== "undefined") AIVoice.unlock();
    } catch (e) {}
    if ($("ct-bgm").checked) Bgm.start();
    $("ct-setup").hidden = true;
    $("ct-hud").hidden = false;
    init3D();
    G3.setKey($("ct-gkey").value);
    start({ rivalKmh: +$("ct-rival").value, auto: $("ct-auto0").checked });
    $("ct-google").checked = $("ct-google0").checked;
    if ($("ct-google0").checked) G3.set(true).then(syncGoogle);
    $("ct-auto").checked = sim.auto;
  }
  function bind() {
    const list = placeOptions();
    const opt = (sel) => list.map((p, i) => `<option value="${i}" ${i === sel ? "selected" : ""}>${esc(p.name)}</option>`).join("");
    $("ct-from").innerHTML = opt(0);
    $("ct-to").innerHTML = opt(1);
    $("ct-go").onclick = begin;
    const hold = (id, key) => {
      const el = $(id);
      const on = (e) => (e.preventDefault(), sim && (sim[key] = true));
      const off = () => sim && (sim[key] = false);
      el.addEventListener("pointerdown", on);
      for (const ev of ["pointerup", "pointerleave", "pointercancel"]) el.addEventListener(ev, off);
    };
    hold("ct-pedal", "pedal");
    hold("ct-brake", "brake");
    hold("ct-sprint", "sprint");
    $("ct-sprint").addEventListener("pointerdown", () => sim && (sim.pedal = true));
    $("ct-sprint").addEventListener("pointerup", () => sim && (sim.pedal = false));
    $("ct-auto").onchange = (e) => sim && (sim.auto = e.target.checked);
    $("ct-x").onchange = (e) => sim && (sim.speedX = +e.target.value);
    $("ct-bgm").onchange = (e) => (e.target.checked ? Bgm.start() : Bgm.stop());
    $("ct-mini").addEventListener("click", () => (miniWhole = !miniWhole));
    $("ct-time").value = timeMode;
    $("ct-time").onchange = (e) => sim && setTime(e.target.value);
    const gk = $("ct-gkey");
    gk.value = G3.getKey();
    const gOn = (() => {
      try {
        return localStorage.getItem("city_google") === "1";
      } catch (e) {
        return false;
      }
    })();
    $("ct-google0").checked = $("ct-google").checked = gOn && !!G3.getKey();
    const setGoogle = async (v) => {
      if (v && !G3.getKey()) {
        $("ct-google0").checked = $("ct-google").checked = false;
        $("ct-msg").textContent = "Googleの3Dを使うには、スタート画面でAPIキーを入れてください";
        return;
      }
      $("ct-google0").checked = $("ct-google").checked = v;
      try {
        localStorage.setItem("city_google", v ? "1" : "0");
      } catch (e) {}
      if (sim) {
        await G3.set(v);
        syncGoogle();
      }
    };
    gk.onchange = () => {
      G3.setKey(gk.value);
      if (gk.value.trim()) setGoogle(true);
    };
    $("ct-google0").onchange = (e) => setGoogle(e.target.checked);
    $("ct-google").onchange = (e) => setGoogle(e.target.checked);
    $("ct-plateau").checked = plateauOn;
    $("ct-plateau0").checked = plateauOn;
    const setPlateau = (on) => {
      plateauOn = on;
      $("ct-plateau").checked = $("ct-plateau0").checked = on;
      try {
        localStorage.setItem("city_plateau", on ? "1" : "0");
      } catch (e) {}
      if (!sim) return;
      Plateau.want(sim.along);
      syncPlaceholders();
    };
    $("ct-plateau").onchange = (e) => setPlateau(e.target.checked);
    $("ct-plateau0").onchange = (e) => setPlateau(e.target.checked);
    $("ct-photo").onchange = (e) => {
      photoOn = e.target.checked;
      if (sim) photoStyle(), wantPhotos(sim.along);
    };
    const keys = { " ": "pedal", ArrowUp: "pedal", ArrowDown: "brake", Shift: "sprint" };
    window.addEventListener("keydown", (e) => {
      if (sim && keys[e.key]) (sim[keys[e.key]] = true), e.key === "Shift" && (sim.pedal = true), e.preventDefault();
    });
    window.addEventListener("keyup", (e) => {
      if (sim && keys[e.key]) (sim[keys[e.key]] = false), e.key === "Shift" && (sim.pedal = false);
    });
  }

  if (typeof document !== "undefined") document.addEventListener("DOMContentLoaded", bind);
  return { at, turnAhead, readTile, _state: () => ({ sim, route, tiles, failed, camera, Plateau }) };
})();
