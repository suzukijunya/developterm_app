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
  // 実物の建物: 読み込めたら、建物ごとに地面からばねのように立ち上がる(急にパッと出ない)。
  // anc = 建物の中心x・足もとy・中心z・出はじめる時刻(秒)。頂点シェーダーで高さを 0→1 に伸ばす
  const popU = { uPopT: { value: 0 } };
  function popMat(m, photo) {
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uPopT = popU.uPopT;
      sh.vertexShader = "attribute vec4 anc;\nuniform float uPopT;\n" + sh.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
        float popT = clamp((uPopT - anc.w) / 0.95, 0.0, 1.0);
        float popK = popT >= 1.0 ? 1.0 : (popT <= 0.0 ? 0.0 : 1.0 - exp(-6.0 * popT) * cos(8.0 * popT));
        transformed.y = anc.y + (transformed.y - anc.y) * popK - (1.0 - min(popK, 1.0)) * 1.5;`);
      // 壁の写真は暗く写っていることが多いので、少し明るく起こす
      if (photo) sh.fragmentShader = sh.fragmentShader.replace("#include <map_fragment>", "#include <map_fragment>\n diffuseColor.rgb = pow(diffuseColor.rgb, vec3(0.78)) * 1.12;");
    };
    m.customProgramCacheKey = () => "pop" + (photo ? 1 : 0);
    return m;
  }
  // anc の4つ目(出はじめる時刻)を入れる。建物ごとに少しずつずらす
  function popAttr(geo, anc) {
    const n = anc.length / 3, a = new Float32Array(n * 4), t0 = popU.uPopT.value + 0.05;
    for (let i = 0; i < n; i++) {
      const x = anc[i * 3], z = anc[i * 3 + 2];
      a[i * 4] = x;
      a[i * 4 + 1] = anc[i * 3 + 1];
      a[i * 4 + 2] = z;
      const hsh = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
      a[i * 4 + 3] = t0 + (hsh - Math.floor(hsh)) * 0.9;
    }
    geo.setAttribute("anc", new (T().BufferAttribute)(a, 4));
  }
  // 街のタイルを作る。1コマで使う時間を決めて、何コマかに分けて作る(作っている間に画面が止まらないように)
  const slicer = (ms) => {
    let t0 = performance.now();
    return async () => {
      if (performance.now() - t0 < ms) return;
      await new Promise((res) => {
        let done = false;
        const go = () => done || ((done = true), res());
        requestAnimationFrame(go);
        setTimeout(go, 80); // 画面が裏にあるときも進める
      });
      t0 = performance.now();
    };
  };
  async function buildTile(data) {
    const THREE = T();
    const group = new THREE.Group();
    const rest = slicer(5);
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
        await rest();
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
        // 地面の高さ: 輪郭のいちばん低い所に建てて、少し埋める(坂で浮かないように)
        let gb = 1e9;
        for (const q of pts) gb = Math.min(gb, H(q[0], q[1]));
        gb -= 0.4;
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
          push(a[0], gb, a[1], nx, 0, nz, u0, 0, c);
          push(b[0], gb, b[1], nx, 0, nz, u1, 0, c);
          push(b[0], gb + h, b[1], nx, 0, nz, u1, v1, c);
          push(a[0], gb, a[1], nx, 0, nz, u0, 0, c);
          push(b[0], gb + h, b[1], nx, 0, nz, u1, v1, c);
          push(a[0], gb + h, a[1], nx, 0, nz, u0, v1, c);
        }
        const tri = THREE.ShapeUtils.triangulateShape(pts.map((p) => new THREE.Vector2(p[0], p[1])), []);
        for (const t of tri) for (const i of [t[0], t[2], t[1]]) push(pts[i][0], gb + h, pts[i][1], 0, 1, 0, 0.004, 0.004, cr);
      }
      group.userData.chunks = [];
      for (const ch of chunks.values()) {
        if (!ch.pos.length) continue;
        await rest();
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(ch.pos, 3));
        geo.setAttribute("normal", new THREE.Float32BufferAttribute(ch.nor, 3));
        geo.setAttribute("uv", new THREE.Float32BufferAttribute(ch.uv, 2));
        geo.setAttribute("color", new THREE.Float32BufferAttribute(ch.col, 3));
        const m = new THREE.Mesh(geo, mats.bld);
        m.castShadow = true;
        m.visible = !G3.on() && !(plateauOn && Plateau.hasAt(ch.cx, ch.cz));
        group.add(m);
        group.userData.chunks.push({ cx: ch.cx, cz: ch.cz, mesh: m });
      }
    }
    // 道
    {
      const pos = [], nor = [], uv = [], col = [];
      for (const [id, kind, ll, tunnel] of data.r) {
        await rest();
        if (tunnel) continue;
        const rail = kind === "rail";
        const w = rail ? 3.6 : ROAD_W[kind] || 4, big = w >= 9, walk = w <= 3 && !rail;
        const y = rail ? 0.07 : big ? 0.05 : walk ? 0.02 : 0.035;
        const c = rail ? [1.9, 1.5, 1.2] : walk ? [1.5, 1.42, 1.3] : [1, 1, 1];
        const p0 = [];
        for (let i = 0; i < ll.length; i += 2) p0.push(project(ll[i], ll[i + 1]));
        if (!isNear(p0[0]) && !isNear(p0[p0.length - 1])) continue;
        // 坂にそわせるため、10mごとに点を足す
        const p = [p0[0]];
        for (let i = 1; i < p0.length; i++) {
          const a = p0[i - 1], b = p0[i], n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 10);
          for (let k = 1; k <= n; k++) p.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
        }
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
            pos.push(x, y + H(x, z), z);
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
        await rest();
        const pts = [];
        for (let i = 0; i < ll.length; i += 2) pts.push(project(ll[i], ll[i + 1]));
        if (pts.length > 3 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1]) pts.pop();
        if (pts.length < 3 || !pts.some(isNear)) continue;
        const c = COL[kind] || COL.park, y = kind === "water" ? 0.024 : 0.018;
        const tri = THREE.ShapeUtils.triangulateShape(pts.map((q) => new THREE.Vector2(q[0], q[1])), []);
        for (const t of tri)
          for (const i of t) {
            pos.push(pts[i][0], y + H(pts[i][0], pts[i][1]), pts[i][1]);
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
      await rest();
      const lm = landmark(nm0, cls, sub, rank);
      if (!lm) continue;
      const q = project(la, lo);
      const d = routeDist(q);
      if (d > lm.r || got.has(lm.name)) continue;
      got.add(lm.name);
      // 看板は建物の少し上。画面の上で読める大きさを保ち、近づいたときだけ出す
      const hgt = lm.big ? 24 : 15;
      const sp = signSprite(lm);
      sp.position.set(q[0], hgt + H(q[0], q[1]), q[1]);
      sp.visible = false;
      sp.userData.sign = true;
      group.add(sp);
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, hgt, 6), new THREE.MeshBasicMaterial({ color: lm.color, transparent: true, opacity: 0.6, depthTest: false, fog: false }));
      beam.position.set(q[0], hgt / 2 + H(q[0], q[1]), q[1]);
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
        if (lm.big) banner(lm.name);
      }
    }
    townBanner(town ? town.replace(/[一二三四五六七八九十]+丁目$/, "") : "");
    nextMark();
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
      worker.postMessage({ type: "init", route: { xy: route.xy, lat0: route.lat0, lon0: route.lon0, kx: route.kx, kz: route.kz }, clear: CLEAR, texMax: innerWidth < 900 ? 2048 : 4096, terrain: Terrain.ok() });
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
          // 写真を描画の装置へ送るのは、1コマに1枚ずつ(まとめて送ると、その瞬間に画面が止まる)
          for (const tx of texs) {
            if (!tx || !renderer.initTexture) continue;
            try {
              renderer.initTexture(tx);
            } catch (e) {}
            await new Promise((res) => {
              let done = false;
              const go = () => done || ((done = true), res());
              requestAnimationFrame(go);
              setTimeout(go, 80);
            });
          }
          if (loaded.get(L.key) !== t || !plateauOn) {
            for (const tx of texs) tx && tx.dispose();
            loaded.delete(L.key);
            busy--;
            return pump();
          }
          const pt0 = performance.now();
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
              if (g.anc) popAttr(geo, g.anc);
              geo.computeBoundingSphere();
              const fm = new THREE.Mesh(geo, mats.fac[g.style] || mats.bld);
              fm.castShadow = fm.receiveShadow = true;
              t.mesh.add(fm);
              continue;
            }
            const geo = new THREE.BufferGeometry();
            geo.setAttribute("position", new THREE.BufferAttribute(g.pos, 3));
            geo.setAttribute("normal", new THREE.BufferAttribute(g.nor, 3, true));
            geo.setAttribute("uv", new THREE.BufferAttribute(g.uv, 2));
            geo.setAttribute("color", new THREE.BufferAttribute(g.col, 3, true));
            if (g.anc) popAttr(geo, g.anc);
            geo.computeBoundingSphere();
            let mat = mats.bld;
            if (g.kind === "t") {
              const tx = texs[g.img];
              // 写真は光の当たり方まで写っているので、ライトの影響を受けない材質でそのまま見せる
              mat = tx ? popMat(new THREE.MeshBasicMaterial({ map: tx, color: photoTint }), true) : mats.pcol;
            } else if (g.kind === "c") mat = mats.pcol;
            const mesh = new THREE.Mesh(geo, mat);
            mesh.castShadow = true;
            if (g.kind === "t") mesh.userData.photo = true;
            t.mesh.add(mesh);
          }
          // 坂: 建物の足もとの高さを、標高タイルの地面にそろえる(楕円体高とのずれ=ジオイド高 を中央値で出す)
          if (d.terrain && d.feet && d.feet.length) {
            const diffs = d.feet.map(([x, z, he]) => he - Terrain.abs(x, z)).sort((a, b) => a - b);
            const off = diffs[diffs.length >> 1];
            t.mesh.position.y = d.hc - off - Terrain.base() - 0.3;
          }
          t.state = "ok";
          t.names = d.names;
          // 形のデータも、1コマに2つずつ見せていく(初めて描くときに装置へ送られるため)
          for (const ch of t.mesh.children) (ch.visible = false), reveal.push(ch);
          scene.add(t.mesh);
          Perf.span("実物の建物を置く", performance.now() - pt0);
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

  // ---------- 地面の高さと勾配(国土地理院の標高タイル: 5mメッシュ、なければ10mメッシュ) ----------
  // 走り出す前に、ルートのまわりの標高を読んでおく。高さは「出発地点=0」からの差(m)
  const Terrain = (() => {
    const Z = 15, NT = 2 ** Z;
    const tiles = new Map(); // "x:y" → Float32Array(256*256) (NaN=なし)
    let base = 0, ok = false;
    const px = (lat, lon) => [((lon + 180) / 360) * NT * 256, ((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * NT * 256];
    function decode(img) {
      const cv = document.createElement("canvas");
      cv.width = cv.height = 256;
      const c = cv.getContext("2d", { willReadFrequently: true });
      c.drawImage(img, 0, 0);
      const d = c.getImageData(0, 0, 256, 256).data, out = new Float32Array(65536);
      for (let i = 0; i < 65536; i++) {
        const v = d[i * 4] * 65536 + d[i * 4 + 1] * 256 + d[i * 4 + 2];
        out[i] = d[i * 4 + 3] === 0 || v === 8388608 ? NaN : v < 8388608 ? v * 0.01 : (v - 16777216) * 0.01;
      }
      return out;
    }
    const loadImg = (url) =>
      new Promise((res) => {
        const im = new Image();
        im.crossOrigin = "anonymous";
        im.onload = () => res(im);
        im.onerror = () => res(null);
        im.src = url;
      });
    async function loadTile(x, y) {
      let im = await loadImg(`https://cyberjapandata.gsi.go.jp/xyz/dem5a_png/${Z}/${x}/${y}.png`);
      let a = im ? decode(im) : null;
      // 5mメッシュがない所は、10mメッシュ(ズーム14)の4分の1を拡大して使う
      if (!a || a.every((v) => isNaN(v))) {
        const im2 = await loadImg(`https://cyberjapandata.gsi.go.jp/xyz/dem_png/${Z - 1}/${x >> 1}/${y >> 1}.png`);
        if (im2) {
          const b = decode(im2), ox = (x & 1) * 128, oy = (y & 1) * 128;
          a = new Float32Array(65536);
          for (let j = 0; j < 256; j++) for (let i = 0; i < 256; i++) a[j * 256 + i] = b[(oy + (j >> 1)) * 256 + ox + (i >> 1)];
        }
      }
      if (a) tiles.set(x + ":" + y, a);
    }
    function abs(lat, lon) {
      const [fx, fy] = px(lat, lon);
      const sx = fx - 0.5, sy = fy - 0.5;
      const x0 = Math.floor(sx), y0 = Math.floor(sy), tx = sx - x0, ty = sy - y0;
      const g = (X, Y) => {
        const t = tiles.get((X >> 8) + ":" + (Y >> 8));
        return t ? t[(Y & 255) * 256 + (X & 255)] : NaN;
      };
      const a = g(x0, y0), b = g(x0 + 1, y0), c = g(x0, y0 + 1), d = g(x0 + 1, y0 + 1);
      const v = [a, b, c, d].filter((q) => !isNaN(q));
      if (v.length < 4) return v.length ? v.reduce((p, q) => p + q, 0) / v.length : NaN;
      return a * (1 - tx) * (1 - ty) + b * tx * (1 - ty) + c * (1 - tx) * ty + d * tx * ty;
    }
    // ルートのまわり(地面の網が届く左右900m)の標高タイルを全部読む
    async function prepare() {
      const need = new Set();
      for (let d = 0; d <= route.length; d += 100) {
        const p = at(d);
        for (const [ox, oz] of [[0, 0], [450, 0], [-450, 0], [0, 450], [0, -450], [900, 0], [-900, 0], [0, 900], [0, -900], [640, 640], [-640, 640], [640, -640], [-640, -640]]) {
          const lat = route.lat0 - (p.z + oz) / route.kz, lon = route.lon0 + (p.x + ox) / route.kx;
          const [fx, fy] = px(lat, lon);
          need.add((fx >> 8) + ":" + (fy >> 8));
        }
      }
      const list = [...need];
      for (let i = 0; i < list.length; i += 8) await Promise.all(list.slice(i, i + 8).map((k) => loadTile(...k.split(":").map(Number))));
      const b0 = abs(route.lat0, route.lon0);
      if (!isNaN(b0)) (base = b0), (ok = true);
      buildProfile();
    }
    // 走る線にそった標高(10mごと・前後30mでならす)と勾配
    let prof = null;
    function buildProfile() {
      const n = Math.ceil(route.length / 10) + 1, raw = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const p = at(i * 10);
        const v = abs(route.lat0 - p.z / route.kz, route.lon0 + p.x / route.kx);
        raw[i] = isNaN(v) ? (i ? raw[i - 1] : 0) : v - base;
      }
      prof = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        let sum = 0, k = 0;
        for (let j = Math.max(0, i - 3); j <= Math.min(n - 1, i + 3); j++) (sum += raw[j]), k++;
        prof[i] = sum / k;
      }
    }
    // 標高がわからない所は、いちばん近いルート上の高さを使う(出発地点の高さにすると、下った先で地面が浮く)
    function nearRoute(x, z) {
      if (!prof) return 0;
      let best = 1e18, bi = 0;
      for (let i = 0; i < prof.length; i += 3) {
        const p = at(i * 10), d = (p.x - x) ** 2 + (p.z - z) ** 2;
        if (d < best) (best = d), (bi = i);
      }
      return prof[bi];
    }
    function h(x, z) {
      if (!ok) return 0;
      const v = abs(route.lat0 - z / route.kz, route.lon0 + x / route.kx);
      return isNaN(v) ? nearRoute(x, z) : v - base;
    }
    // 勾配(%)。前後20mの高さの差から
    function grade(along) {
      if (!prof) return 0;
      const f = (a) => {
        const i = Math.max(0, Math.min(prof.length - 1, a / 10)), i0 = Math.floor(i), i1 = Math.min(prof.length - 1, i0 + 1);
        return prof[i0] + (prof[i1] - prof[i0]) * (i - i0);
      };
      return ((f(along + 20) - f(along - 20)) / 40) * 100;
    }
    return { prepare, h, abs: (x, z) => (ok ? h(x, z) + base : 0), grade, ok: () => ok, base: () => base };
  })();

  // ---------- 道路(PLATEAU 交通モデル): 実際の道幅・歩道・白線、左側通行の走る位置、電柱と街路樹 ----------
  // 道路の面(車道・交差点・歩道)を地図の区画(z16・約600m四方)ごとに読み、
  //   車道はアスファルト、歩道は縁石の高さ(15cm)の段にして、車道のふちに白線、交差点の入口に横断歩道を引く。
  //   走っている道の幅を左右に測って、ライダーは「車道の左端から約0.9m」を走る(日本の左側通行)。
  //   歩道の車道側にはガードパイプと街路樹、歩道のない道の外側には電柱と電線を立てる。
  const Roads = (() => {
    const IDX = typeof PLATEAU_ROADS !== "undefined" ? PLATEAU_ROADS : [];
    const Z = 16, NT = 2 ** Z, CELL = 20, STEP = 4;
    const tl = new Map(); // "x:y" → { state, group, rect }
    const grid = new Map(); // 20m のマス → 多角形の一覧
    const raw = []; // ルートの STEP m ごとの { L, R, cross } (測れたところだけ)
    let queue = [], busy = 0, worker = null, fails = 0, visible = true, stripDirty = false, stripT = 0;
    const waiting = new Map();
    const lonOf = (v) => (v / NT) * 360 - 180, latOf = (v) => (Math.atan(Math.sinh(Math.PI * (1 - (2 * v) / NT))) * 180) / Math.PI;
    const tileRect = (x, y) => {
      const a = project(latOf(y), lonOf(x)), b = project(latOf(y + 1), lonOf(x + 1));
      return [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1])];
    };
    // ---- 多角形の検索 ----
    function addPoly(p) {
      let x0 = 1e9, z0 = 1e9, x1 = -1e9, z1 = -1e9;
      const r = p.rings[0];
      for (let i = 0; i < r.length; i += 2) (x0 = Math.min(x0, r[i])), (x1 = Math.max(x1, r[i])), (z0 = Math.min(z0, r[i + 1])), (z1 = Math.max(z1, r[i + 1]));
      p.box = [x0, z0, x1, z1];
      for (let x = Math.floor(x0 / CELL); x <= Math.floor(x1 / CELL); x++)
        for (let z = Math.floor(z0 / CELL); z <= Math.floor(z1 / CELL); z++) {
          const k = x + ":" + z;
          if (!grid.has(k)) grid.set(k, []);
          grid.get(k).push(p);
        }
    }
    function inPoly(p, x, z) {
      if (x < p.box[0] || x > p.box[2] || z < p.box[1] || z > p.box[3]) return false;
      let c = false;
      for (const r of p.rings)
        for (let i = 0, j = r.length - 2; i < r.length; j = i, i += 2) {
          const xi = r[i], zi = r[i + 1], xj = r[j], zj = r[j + 1];
          if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c;
        }
      return c;
    }
    // その場所の種類: 0=車道 1=交差点 2=歩道 3=島 4=道路(区別なし) -1=道路の外
    function kindAt(x, z) {
      const list = grid.get(Math.floor(x / CELL) + ":" + Math.floor(z / CELL));
      if (!list) return -1;
      let l1 = false;
      for (const p of list)
        if (inPoly(p, x, z)) {
          if (p.f !== 4) return p.f;
          l1 = true;
        }
      return l1 ? 4 : -1;
    }
    const isCar = (k) => k === 0 || k === 1 || k === 4;
    // (x, z) から (dx, dz) の向きに、車道が続く距離
    function reach(x, z, dx, dz) {
      let t = 0;
      while (t < 16 && isCar(kindAt(x + dx * (t + 0.25), z + dz * (t + 0.25)))) t += 0.25;
      return t;
    }
    // ---- ルートの道幅を測る ----
    function measure(i) {
      const p = at(i * STEP);
      const k = kindAt(p.x, p.z);
      if (!isCar(k)) return (raw[i] = raw[i] || null);
      const lx = p.tz, lz = -p.tx; // 左
      raw[i] = { L: reach(p.x, p.z, lx, lz), R: reach(p.x, p.z, -lx, -lz), cross: k === 1 };
      stripDirty = true;
    }
    function measureRect(r) {
      const n = Math.ceil(route.length / STEP);
      for (let i = 0; i <= n; i++) {
        const p = at(i * STEP);
        if (p.x >= r[0] - 20 && p.x <= r[2] + 20 && p.z >= r[1] - 20 && p.z <= r[3] + 20) measure(i);
      }
    }
    // 走る位置: センターラインから左へ何m(交差点の中や測れない所は、前後の値で埋める)
    function ride(along) {
      const i0 = Math.round(along / STEP);
      for (const w of [3, 6]) {
        const v = [];
        for (let i = i0 - w; i <= i0 + w; i++) {
          const s = raw[i];
          if (s && !s.cross && s.L + s.R > 2) v.push(s);
        }
        if (v.length) {
          // 中央値で、はみ出した値(バス停の切り込みなど)を外す
          const off = v.map((s) => {
            const W = s.L + s.R;
            return s.L - (W >= 4.5 ? 0.9 : Math.max(0.6, W * 0.22));
          });
          off.sort((a, b) => a - b);
          const W = v.map((s) => s.L + s.R).sort((a, b) => a - b);
          return { off: off[off.length >> 1], W: W[W.length >> 1] };
        }
      }
      return null;
    }
    // ---- メッシュを作る ----
    let M = null;
    function mats() {
      if (M) return M;
      const THREE = T();
      const tex = (draw, rep) => {
        const cv = document.createElement("canvas");
        cv.width = cv.height = 256;
        draw(cv.getContext("2d"));
        const t = new THREE.CanvasTexture(cv);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.encoding = THREE.sRGBEncoding;
        t.anisotropy = 8;
        return t;
      };
      const asph = tex((c) => {
        c.fillStyle = "#5b5e62";
        c.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 9000; i++) {
          const v = 70 + Math.floor(hash(i) * 70);
          c.fillStyle = `rgba(${v},${v},${v + 4},0.5)`;
          c.fillRect(hash(i + 1e4) * 256, hash(i + 2e4) * 256, 1 + hash(i + 3e4) * 1.5, 1 + hash(i + 4e4) * 1.5);
        }
      });
      const walk = tex((c) => {
        c.fillStyle = "#b9b3a8";
        c.fillRect(0, 0, 256, 256);
        for (let y = 0; y < 256; y += 32)
          for (let x = 0; x < 256; x += 64) {
            const o = (y / 32) % 2 ? 32 : 0, v = 168 + Math.floor(hash(x * 7 + y) * 30);
            c.fillStyle = `rgb(${v},${v - 6},${v - 14})`;
            c.fillRect(x + o + 1, y + 1, 62, 30);
          }
      });
      M = {
        asph: new THREE.MeshLambertMaterial({ map: asph, color: 0xffffff }),
        walk: new THREE.MeshLambertMaterial({ map: walk }),
        curb: new THREE.MeshLambertMaterial({ color: 0xa4a39e }),
        isl: new THREE.MeshLambertMaterial({ color: 0x6f8a5a }),
        line: new THREE.MeshLambertMaterial({ color: 0xf2f2ee, emissive: 0x303030 }),
        pole: new THREE.MeshLambertMaterial({ color: 0x9d9c97 }),
        dark: new THREE.MeshLambertMaterial({ color: 0x4a4c50 }),
        wire: new THREE.LineBasicMaterial({ color: 0x1c1c1e }),
        trunk: new THREE.MeshLambertMaterial({ color: 0x5a4632 }),
        leaf: new THREE.MeshLambertMaterial({ color: 0xffffff }),
        rail: new THREE.MeshLambertMaterial({ color: 0xf4f4f0, side: THREE.DoubleSide }),
        stripe: new THREE.MeshBasicMaterial({ color: 0x35d6ff, transparent: true, opacity: 0.42, depthWrite: false, side: THREE.DoubleSide }),
      };
      return M;
    }
    function buildTile(polys, rect) {
      const THREE = T();
      const m = mats();
      const g = new THREE.Group();
      const near = (p) => {
        const b = p.box;
        return isNear([b[0], b[1]]) || isNear([b[2], b[3]]) || isNear([(b[0] + b[2]) / 2, (b[1] + b[3]) / 2]) || isNear([b[0], b[3]]) || isNear([b[2], b[1]]);
      };
      const A = { asph: [[], []], walk: [[], []], curb: [[], []], isl: [[], []], line: [[], []] }; // [位置, uv]
      const q = (key, pts, uvs) => (A[key][0].push(...pts), A[key][1].push(...uvs));
      const flat = (p, y, key, sc) => {
        const V = (r) => {
          const a = [];
          for (let i = 0; i < r.length; i += 2) a.push(new THREE.Vector2(r[i], r[i + 1]));
          if (a.length > 1 && a[0].equals(a[a.length - 1])) a.pop();
          return a;
        };
        const outer = V(p.rings[0]), holes = p.rings.slice(1).map(V);
        let tri;
        try {
          tri = THREE.ShapeUtils.triangulateShape(outer, holes);
        } catch (e) {
          return;
        }
        const all = outer.concat(...holes);
        for (const t of tri)
          for (const i of [t[0], t[2], t[1]]) {
            const v = all[i];
            q(key, [v.x, y + H(v.x, v.y), v.y], [v.x / sc, v.y / sc]);
          }
      };
      // 縁石: 多角形のふちに、低い壁
      const walls = (p, y0, y1) => {
        for (const r of p.rings)
          for (let i = 0, j = r.length - 2; i < r.length; j = i, i += 2) {
            const ax = r[j], az = r[j + 1], bx = r[i], bz = r[i + 1];
            const L = Math.hypot(bx - ax, bz - az);
            if (L < 0.05) continue;
            const ha = H(ax, az), hb = H(bx, bz);
            q("curb", [ax, y0 + ha, az, bx, y0 + hb, bz, bx, y1 + hb, bz, ax, y0 + ha, az, bx, y1 + hb, bz, ax, y1 + ha, az], [0, 0, L, 0, L, 1, 0, 0, L, 1, 0, 1]);
            q("curb", [ax, y0 + ha, az, bx, y1 + hb, bz, bx, y0 + hb, bz, ax, y0 + ha, az, ax, y1 + ha, az, bx, y1 + hb, bz], [0, 0, L, 1, L, 0, 0, 0, 0, 1, L, 1]);
          }
      };
      // 細い帯(白線など): a → b を幅 w で
      const band = (ax, az, bx, bz, w, y, key = "line") => {
        const L = Math.hypot(bx - ax, bz - az);
        if (L < 0.05) return;
        const nx = (-(bz - az) / L) * (w / 2), nz = ((bx - ax) / L) * (w / 2);
        const ha = H(ax, az) + y, hb = H(bx, bz) + y;
        q(key, [ax - nx, ha, az - nz, bx - nx, hb, bz - nz, bx + nx, hb, bz + nz, ax - nx, ha, az - nz, bx + nx, hb, bz + nz, ax + nx, ha, az + nz], [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]);
      };
      const poles = [], trees = [], posts = [], rails = [[], []];
      const edges = (p, fn) => {
        for (const r of p.rings)
          for (let i = 0, j = r.length - 2; i < r.length; j = i, i += 2) {
            const ax = r[j], az = r[j + 1], bx = r[i], bz = r[i + 1];
            const L = Math.hypot(bx - ax, bz - az);
            if (L < 0.4) continue;
            const ex = (bx - ax) / L, ez = (bz - az) / L;
            let ox = -ez, oz = ex; // 外向き(多角形の外側)
            const mx = (ax + bx) / 2, mz = (az + bz) / 2;
            if (inPoly(p, mx + ox * 0.05, mz + oz * 0.05)) (ox = -ox), (oz = -oz);
            fn(ax, az, bx, bz, L, ex, ez, ox, oz, kindAt(mx + ox * 0.6, mz + oz * 0.6));
          }
      };
      const hasL2 = polys.some((p) => p.f !== 4);
      let poleRun = 0, treeRun = 0, postRun = 0, lastPole = null;
      for (const p of polys) {
        if (!near(p)) continue;
        if (p.f === 4) {
          flat(p, 0.055, "asph", 3);
          // 歩道のない道: ふちに路側帯の白線、その外側に電柱
          edges(p, (ax, az, bx, bz, L, ex, ez, ox, oz, out) => {
            const mx = (ax + bx) / 2, mz = (az + bz) / 2;
            if (out === 4 || out === 0 || out === 1) return; // となりも道路(つなぎ目)
            if (hasL2 && kindAt(mx - ox * 0.6, mz - oz * 0.6) !== 4) return; // 詳しいデータ(歩道あり)の所
            band(ax - ox * 0.55, az - oz * 0.55, bx - ox * 0.55, bz - oz * 0.55, 0.15, 0.07);
            for (let t = (32 - poleRun) % 32; t < L; t += 32) {
              const x = ax + ex * t + ox * 0.35, z = az + ez * t + oz * 0.35;
              if (hash(Math.round(x) * 73 + Math.round(z) * 31) < 0.45) continue;
              poles.push({ x, z, ang: Math.atan2(ez, ex), prev: lastPole && Math.hypot(lastPole.x - x, lastPole.z - z) < 48 ? lastPole : null, tr: hash(Math.round(x * 3) + Math.round(z)) < 0.3 });
              lastPole = poles[poles.length - 1];
            }
            poleRun = (poleRun + L) % 32;
          });
        } else if (p.f === 0 || p.f === 1) {
          flat(p, p.f === 1 ? 0.065 : 0.06, "asph", 3);
          if (p.f === 0)
            edges(p, (ax, az, bx, bz, L, ex, ez, ox, oz, out) => {
              if (out === 1) {
                // 交差点の入口: 横断歩道(しま模様。白い帯は道に沿う向き、幅0.45m・間隔0.45m、長さ4m)
                if (L < 3 || L > 34) return;
                for (let t = 0.6; t < L - 0.4; t += 0.9) {
                  const x = ax + ex * t, z = az + ez * t;
                  const ix = -ox, iz = -oz;
                  const sx = x + ix * 0.6, sz = z + iz * 0.6;
                  q("line", ...stripe(sx, sz, ex, ez, ix, iz));
                }
                return;
              }
              if (out === 0) return;
              band(ax - ox * 0.2, az - oz * 0.2, bx - ox * 0.2, bz - oz * 0.2, 0.15, 0.075);
            });
        } else if (p.f === 2) {
          flat(p, 0.17, "walk", 1.2);
          walls(p, 0.0, 0.17);
          edges(p, (ax, az, bx, bz, L, ex, ez, ox, oz, out) => {
            if (out !== 0) return;
            // 車道に面したふち: ガードパイプ(2.4mごとの柱と2本の横棒)と、街路樹(11mごと)
            const ix = -ox, iz = -oz;
            const wide = kindAt((ax + bx) / 2 + ix * 2.4, (az + bz) / 2 + iz * 2.4) === 2;
            for (let t = (2.4 - postRun) % 2.4; t < L; t += 2.4) posts.push([ax + ex * t + ix * 0.3, az + ez * t + iz * 0.3]);
            postRun = (postRun + L) % 2.4;
            for (const [k, yy] of [[0, 0.78], [1, 0.45]]) rails[k].push([ax + ix * 0.3, az + iz * 0.3, bx + ix * 0.3, bz + iz * 0.3, yy]);
            if (wide) {
              for (let t = (11 - treeRun) % 11; t < L; t += 11) trees.push([ax + ex * t + ix * 1.0, az + ez * t + iz * 1.0]);
              treeRun = (treeRun + L) % 11;
            }
          });
        } else if (p.f === 3) {
          flat(p, 0.2, "isl", 2);
          walls(p, 0.0, 0.2);
        }
      }
      for (const [key, mat] of [["asph", m.asph], ["walk", m.walk], ["curb", m.curb], ["isl", m.isl], ["line", m.line]]) {
        const [pos, uv] = A[key];
        if (!pos.length) continue;
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
        geo.computeVertexNormals();
        const mesh = new THREE.Mesh(geo, mat);
        mesh.receiveShadow = true;
        g.add(mesh);
      }
      // ガードパイプ
      if (posts.length) {
        const im = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.03, 0.03, 0.85, 6), m.rail, posts.length);
        const mt = new THREE.Matrix4();
        posts.forEach(([x, z], i) => im.setMatrixAt(i, mt.makeTranslation(x, 0.17 + 0.42 + H(x, z), z)));
        g.add(im);
        const rp = [];
        for (const list of rails)
          for (const [ax, az, bx, bz, y] of list) {
            const ha = H(ax, az) + 0.17 + y, hb = H(bx, bz) + 0.17 + y;
            rp.push(ax, ha, az, bx, hb, bz, bx, hb + 0.05, bz, ax, ha, az, bx, hb + 0.05, bz, ax, ha + 0.05, az);
          }
        const rg = new THREE.BufferGeometry();
        rg.setAttribute("position", new THREE.Float32BufferAttribute(rp, 3));
        rg.computeVertexNormals();
        g.add(new THREE.Mesh(rg, m.rail));
      }
      // 街路樹
      if (trees.length) {
        const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.1, 0.14, 2.8, 6), m.trunk, trees.length);
        const leaf = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1.5, 1), m.leaf, trees.length);
        const mt = new THREE.Matrix4(), c = new THREE.Color();
        trees.forEach(([x, z], i) => {
          const s = 0.8 + hash(Math.round(x * 5) + Math.round(z * 3)) * 0.5, h = H(x, z);
          trunk.setMatrixAt(i, mt.makeTranslation(x, h + 1.4 * s + 0.17, z).multiply(new THREE.Matrix4().makeScale(s, s, s)));
          leaf.setMatrixAt(i, mt.makeTranslation(x, h + 3.4 * s + 0.17, z).multiply(new THREE.Matrix4().makeScale(s * 1.1, s * 1.25, s * 1.1)));
          leaf.setColorAt(i, c.setHSL(0.26 + hash(i * 7 + Math.round(x)) * 0.06, 0.42, 0.26 + hash(i * 3) * 0.1));
        });
        trunk.castShadow = leaf.castShadow = true;
        g.add(trunk, leaf);
      }
      // 電柱と電線
      if (poles.length) {
        const n = poles.length;
        const shaft = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.13, 0.18, 10.5, 8), m.pole, n);
        const arm = new THREE.InstancedMesh(new THREE.BoxGeometry(0.1, 0.1, 1.5), m.dark, n);
        const trs = poles.filter((p) => p.tr);
        const tr = trs.length ? new THREE.InstancedMesh(new THREE.CylinderGeometry(0.28, 0.28, 0.9, 10), m.pole, trs.length) : null;
        const mt = new THREE.Matrix4(), rot = new THREE.Matrix4();
        const wires = [];
        poles.forEach((p, i) => {
          const h = H(p.x, p.z);
          shaft.setMatrixAt(i, mt.makeTranslation(p.x, h + 5.25, p.z));
          arm.setMatrixAt(i, mt.makeTranslation(p.x, h + 9.6, p.z).multiply(rot.makeRotationY(-p.ang)));
          p.h = h;
        });
        trs.forEach((p, i) => tr.setMatrixAt(i, mt.makeTranslation(p.x + Math.sin(p.ang) * 0.35, p.h + 8.2, p.z - Math.cos(p.ang) * 0.35)));
        for (const p of poles) {
          const a = p.prev;
          if (!a) continue;
          // 腕の両端と真ん中の3本、少し下に通信線。たるみをつける
          const sa = Math.sin(a.ang), ca = Math.cos(a.ang), sb = Math.sin(p.ang), cb = Math.cos(p.ang);
          for (const [o, y] of [[-0.65, 9.62], [0, 9.62], [0.65, 9.62], [0.2, 7.6]]) {
            const x0 = a.x + sa * o, z0 = a.z - ca * o, y0 = a.h + y, x1 = p.x + sb * o, z1 = p.z - cb * o, y1 = p.h + y;
            const L = Math.hypot(x1 - x0, z1 - z0), sag = L * 0.025;
            let px = x0, py = y0, pz = z0;
            for (let k = 1; k <= 8; k++) {
              const t = k / 8, x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t, yy = y0 + (y1 - y0) * t - Math.sin(t * Math.PI) * sag;
              wires.push(px, py, pz, x, yy, z);
              (px = x), (py = yy), (pz = z);
            }
          }
        }
        shaft.castShadow = arm.castShadow = true;
        g.add(shaft, arm);
        if (tr) g.add(tr);
        if (wires.length) {
          const wg = new THREE.BufferGeometry();
          wg.setAttribute("position", new THREE.Float32BufferAttribute(wires, 3));
          g.add(new THREE.LineSegments(wg, m.wire));
        }
      }
      return g;
    }
    // 横断歩道の1本ぶん(位置とuv)
    function stripe(sx, sz, ex, ez, ix, iz) {
      const hw = 0.225, len = 4;
      const P = [
        [sx - ex * hw, sz - ez * hw],
        [sx + ex * hw, sz + ez * hw],
        [sx + ex * hw + ix * len, sz + ez * hw + iz * len],
        [sx - ex * hw + ix * len, sz - ez * hw + iz * len],
      ];
      const v = (k) => [P[k][0], H(P[k][0], P[k][1]) + 0.078, P[k][1]];
      return [[...v(0), ...v(1), ...v(2), ...v(0), ...v(2), ...v(3)], [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]];
    }
    // ---- センターライン・車線(走っている道だけ。測った道幅から) ----
    let marks = null;
    function paintRoute(along) {
      const THREE = T();
      const pos = [];
      const put = (ax, az, bx, bz, w) => {
        const L = Math.hypot(bx - ax, bz - az);
        if (L < 0.05) return;
        const nx = (-(bz - az) / L) * (w / 2), nz = ((bx - ax) / L) * (w / 2);
        const ha = H(ax, az) + 0.08, hb = H(bx, bz) + 0.08;
        pos.push(ax - nx, ha, az - nz, bx - nx, hb, bz - nz, bx + nx, hb, bz + nz, ax - nx, ha, az - nz, bx + nx, hb, bz + nz, ax + nx, ha, az + nz);
      };
      const i0 = Math.max(0, Math.floor((along - 40) / STEP)), i1 = Math.min(raw.length - 1, Math.ceil((along + 420) / STEP));
      for (let i = i0; i < i1; i++) {
        const a = raw[i], b = raw[i + 1];
        if (!a || !b || a.cross || b.cross) continue;
        const W = (a.L + a.R + b.L + b.R) / 2;
        if (W < 5.5) continue;
        const pa = at(i * STEP), pb = at((i + 1) * STEP);
        // 道の真ん中(センターラインのずれを、測った左右の幅で直す)
        const ca = (a.L - a.R) / 2, cb = (b.L - b.R) / 2;
        const ax = pa.x + pa.tz * ca, az = pa.z - pa.tx * ca, bx = pb.x + pb.tz * cb, bz = pb.z - pb.tx * cb;
        const half = W / 2, lanes = Math.max(1, Math.floor(half / 3));
        if (lanes >= 2 || i % 2 === 0) put(ax, az, bx, bz, 0.15); // 2車線以上は実線、それ以外は破線(4mおき)
        if (lanes >= 2 && i % 3 !== 2)
          for (let k = 1; k < lanes; k++)
            for (const sg of [-1, 1]) {
              const o = (sg * half * k) / lanes;
              put(ax + pa.tz * o, az - pa.tx * o, bx + pb.tz * o, bz - pb.tx * o, 0.12);
            }
      }
      if (marks) (scene.remove(marks), marks.geometry.dispose());
      if (!pos.length) return (marks = null);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      geo.computeVertexNormals();
      marks = new THREE.Mesh(geo, mats().line);
      marks.visible = visible;
      scene.add(marks);
    }
    // ---- 読み込み ----
    function startWorker() {
      if (worker) return;
      const me = document.querySelector('script[src*="js/city.js"]');
      const v = me && me.src.includes("?") ? "?" + me.src.split("?")[1] : "";
      worker = new Worker("js/plateau-worker.js" + v);
      worker.postMessage({ type: "init", route: { xy: route.xy, lat0: route.lat0, lon0: route.lon0, kx: route.kx, kz: route.kz }, clear: 3.5 });
      worker.onmessage = (e) => {
        const w = waiting.get(e.data.id);
        waiting.delete(e.data.id);
        if (w) w(e.data);
      };
    }
    async function get(url) {
      try {
        const c = await caches.open("city-roads-v1");
        const hit = await c.match(url);
        if (hit) return hit.status === 204 ? null : hit.arrayBuffer();
        const res = await fetch(url);
        if (res.status === 404 || res.status === 403) {
          c.put(url, new Response(null, { status: 204 })).catch(() => {});
          return null;
        }
        if (!res.ok) throw new Error(res.status);
        c.put(url, res.clone()).catch(() => {});
        return res.arrayBuffer();
      } catch (e) {
        const res = await fetch(url);
        if (!res.ok) return null;
        return res.arrayBuffer();
      }
    }
    function want(along) {
      if (!IDX.length) return;
      const need = new Map();
      const ahead = Math.min(2500, Math.max(500, (sim ? sim.v * sim.speedX : 7) * 18));
      for (let d = -100; d <= ahead; d += 150) {
        const p = at(along + d);
        const lat = route.lat0 - p.z / route.kz, lon = route.lon0 + p.x / route.kx;
        const cx = Math.floor(((lon + 180) / 360) * NT), cy = Math.floor(((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * NT);
        for (let dx = -1; dx <= 1; dx++)
          for (let dy = -1; dy <= 1; dy++) {
            const r = tileRect(cx + dx, cy + dy);
            const dist = Math.hypot(Math.max(r[0] - p.x, 0, p.x - r[2]), Math.max(r[1] - p.z, 0, p.z - r[3]));
            const key = cx + dx + ":" + (cy + dy);
            if (dist < 160 && (!need.has(key) || need.get(key) > dist + Math.max(0, d))) need.set(key, dist + Math.max(0, d));
          }
      }
      for (const key of need.keys()) if (!tl.has(key)) tl.set(key, { state: "wait" }), queue.push(key);
      queue = queue.filter((k) => need.has(k) && tl.get(k).state === "wait");
      queue.sort((a, b) => need.get(a) - need.get(b));
      // 通り過ぎた区画の見た目は片づける(道幅の値は残す)
      const p0 = at(along);
      for (const [key, t] of tl) {
        if (!t.group || need.has(key)) continue;
        const r = t.rect;
        if (Math.hypot(Math.max(r[0] - p0.x, 0, p0.x - r[2]), Math.max(r[1] - p0.z, 0, p0.z - r[3])) > 700) {
          scene.remove(t.group);
          t.group.traverse((o) => o.geometry && o.geometry.dispose());
          t.group = null;
        }
      }
      pump();
    }
    async function pump() {
      if (busy >= 2 || !queue.length) return;
      const key = queue.shift();
      const t = tl.get(key);
      if (!t || t.state !== "wait") return pump();
      t.state = "load";
      busy++;
      try {
        const [x, y] = key.split(":").map(Number);
        const lat = latOf(y + 0.5), lon = lonOf(x + 0.5);
        const bufs = [];
        for (const c of IDX)
          for (const [u, b, mz, lod] of [[c[2], c[3], c[4], 2], [c[5], c[6], c[7], 1]]) {
            if (!u || !b || lon < b[0] - 0.01 || lon > b[2] + 0.01 || lat < b[1] - 0.01 || lat > b[3] + 0.01) continue;
            if (mz && mz < Z) continue;
            const buf = await get(u.replace("{z}", Z).replace("{x}", x).replace("{y}", y));
            if (buf) bufs.push({ buf, lod });
          }
        let polys = [];
        if (bufs.length) {
          startWorker();
          const id = Math.random();
          const d = await new Promise((res) => {
            waiting.set(id, res);
            worker.postMessage({ type: "mvt", id, bufs, z: Z, x, y }, bufs.map((b) => b.buf));
          });
          if (d.error) throw new Error(d.error);
          polys = d.polys;
        }
        for (const p of polys) addPoly(p);
        t.rect = tileRect(x, y);
        t.polys = polys;
        measureRect(t.rect);
        const rt0 = performance.now();
        t.group = buildTile(polys, t.rect);
        Perf.span("道を作る", performance.now() - rt0);
        t.group.visible = visible;
        scene.add(t.group);
        t.state = "ok";
      } catch (e) {
        fails++;
        t.state = "fail";
      }
      busy--;
      pump();
    }
    function update(along, dt) {
      if ((stripT += dt) > 1.2) {
        stripT = 0;
        paintRoute(along);
        if (stripDirty) (stripDirty = false), rebuildStrip();
      }
    }
    return {
      want,
      update,
      ride,
      // ルート上の交差点の区間 [始まり, 終わり](m)
      crossings() {
        const out = [];
        let a = null;
        for (let i = 0; i < raw.length; i++) {
          const c = raw[i] && raw[i].cross;
          if (c && a == null) a = i * STEP;
          if (!c && a != null) out.push([a, i * STEP]), (a = null);
        }
        return out;
      },
      left: () => queue.length + busy,
      fails: () => fails,
      setVisible(v) {
        visible = v;
        for (const t of tl.values()) if (t.group) t.group.visible = v;
        if (marks) marks.visible = v;
      },
    };
  })();
  // ルートの帯(走る位置にそって細く)
  function rebuildStrip() {
    const THREE = T();
    const pos = [];
    const n = Math.ceil(route.length / 3);
    let prev = null;
    for (let i = 0; i <= n; i++) {
      const al = Math.min(route.length, i * 3), p = at(al), r = Roads.ride(al), o = r ? r.off : 0;
      const x = p.x + p.tz * o, z = p.z - p.tx * o, y = H(x, z) + 0.1;
      if (prev) {
        const dx = x - prev[0], dz = z - prev[2], L = Math.hypot(dx, dz) || 1, nx = (-dz / L) * 0.32, nz = (dx / L) * 0.32;
        pos.push(prev[0] - nx, prev[1], prev[2] - nz, x - nx, y, z - nz, x + nx, y, z + nz, prev[0] - nx, prev[1], prev[2] - nz, x + nx, y, z + nz, prev[0] + nx, prev[1], prev[2] + nz);
      }
      prev = [x, y, z];
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    if (routeStrip) routeStrip.geometry.dispose(), (routeStrip.geometry = geo);
  }
  // 地面の高さ(出発地点=0)
  const H = (x, z) => Terrain.h(x, z);

  // ---------- 道の上の人と車: 後ろから来る車・対向車・歩行者・ほかの自転車 ----------
  // 自分の前後(後ろ60m〜前250m)にだけ置く。道の幅(Roads で測った値)で、車が通れる道か・車線の位置を決める。
  // 車に近くで抜かれたら「ヒヤリ」、人や自転車を抜いたら「抜いた人」、近くをすり抜けたら「すり抜け」。
  const Traffic = (() => {
    const list = [];
    let tpl = null, score = 0, passed = 0, spawnT = 0, seed = 1;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const KM = 1 / 3.6;
    function templates() {
      if (tpl) return tpl;
      const THREE = T();
      const M = (c, o) => new THREE.MeshLambertMaterial(Object.assign({ color: c }, o || {}));
      const glass = M(0x2a3644), tire = M(0x151515), light = new THREE.MeshBasicMaterial({ color: 0xfff3c4 }), tail = new THREE.MeshBasicMaterial({ color: 0xc81e1e });
      const box = (w, h, d, m, x, y, z) => {
        const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
        o.position.set(x, y, z);
        o.castShadow = true;
        return o;
      };
      // 車(前が +x): 乗用車・軽・バン・タクシー
      const car = (color, len, wid, hgt, cabin, roof) => {
        const g = new THREE.Group(), body = M(color);
        g.add(box(len, hgt * 0.5, wid, body, 0, 0.32 + hgt * 0.25, 0));
        g.add(box(len * cabin, hgt * 0.45, wid * 0.92, glass, -len * 0.05, 0.32 + hgt * 0.72, 0));
        g.add(box(len * cabin * 0.96, 0.06, wid * 0.88, body, -len * 0.05, 0.32 + hgt * 0.95, 0));
        if (roof) g.add(box(0.5, 0.18, 0.3, M(0xffd23d), -len * 0.05, 0.32 + hgt + 0.06, 0));
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
          const w = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.22, 12), tire);
          w.rotation.x = Math.PI / 2;
          w.position.set(sx * len * 0.32, 0.31, sz * wid * 0.45);
          g.add(w);
        }
        for (const sz of [-1, 1]) {
          g.add(box(0.05, 0.12, 0.3, light, len / 2, 0.32 + hgt * 0.32, sz * wid * 0.32));
          g.add(box(0.05, 0.12, 0.26, tail, -len / 2, 0.32 + hgt * 0.32, sz * wid * 0.34));
        }
        return g;
      };
      const person = (shirt, pants) => {
        const g = new THREE.Group();
        const sk = M(0xd9a27e);
        const torso = box(0.26, 0.55, 0.36, M(shirt), 0, 1.2, 0);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), sk);
        head.position.set(0, 1.62, 0);
        const legL = box(0.14, 0.8, 0.14, M(pants), 0, 0.45, -0.1), legR = box(0.14, 0.8, 0.14, M(pants), 0, 0.45, 0.1);
        legL.geometry.translate(0, -0.35, 0);
        legR.geometry.translate(0, -0.35, 0);
        legL.position.y = legR.position.y = 0.85;
        g.add(torso, head, legL, legR);
        g.userData.legs = [legL, legR];
        return g;
      };
      tpl = {
        cars: [car(0xf4f4f2, 4.5, 1.75, 1.45, 0.55), car(0x2b2f36, 4.6, 1.8, 1.45, 0.55), car(0x9aa4ad, 4.4, 1.75, 1.45, 0.55), car(0xc8d4e2, 3.4, 1.48, 1.65, 0.62), car(0x1d4f8c, 4.7, 1.7, 1.95, 0.75), car(0xe9c43a, 4.6, 1.7, 1.5, 0.55, true), car(0x7a1f26, 4.5, 1.75, 1.45, 0.55)],
        person,
      };
      return tpl;
    }
    function spawn(kind, along, dir) {
      const THREE = T();
      const t = templates();
      let obj, v, w;
      if (kind === "car") {
        obj = t.cars[Math.floor(rnd() * t.cars.length)].clone();
        v = (dir > 0 ? 34 + rnd() * 12 : 30 + rnd() * 12) * KM;
        w = 1.75;
      } else if (kind === "ped") {
        const shirts = [0x2f5d9a, 0xe8e2d8, 0x3a3a3a, 0x9a3a3a, 0x6a7a4a, 0xd9c08a];
        obj = t.person(shirts[Math.floor(rnd() * shirts.length)], 0x2a2e36);
        v = (3.6 + rnd() * 1.6) * KM;
        w = 0.5;
      } else {
        const b = makeBiker([0x2b6fd6, 0x3a3a3a, 0xe8e8e8, 0x1d8a5a][Math.floor(rnd() * 4)], [0x222222, 0x6a6a6a, 0x9a3a3a][Math.floor(rnd() * 3)]);
        obj = b.g;
        obj.userData.pose = b.pose;
        v = (14 + rnd() * 6) * KM;
        w = 0.6;
      }
      obj.traverse((o) => o.isMesh && (o.castShadow = true));
      scene.add(obj);
      const e = { kind, dir, along, v, w, obj, lane: rnd(), rel0: null, seen: false };
      list.push(e);
      return e;
    }
    // 道幅から、その種類の通る位置(センターラインから左へ何m。+が左)
    function laneOff(e, r) {
      const W = r ? r.W : 4, L = r ? r.off + (W >= 4.5 ? 0.9 : Math.max(0.6, W * 0.22)) : 2; // 左端までの距離
      if (e.kind === "car") {
        if (W < 5.5) return e.dir > 0 ? L - W / 2 + 0.2 : L - W / 2 - 0.6; // 狭い道は真ん中あたりを通る
        const lanes = Math.max(1, Math.floor(W / 2 / 3));
        const k = Math.floor(e.lane * lanes);
        return e.dir > 0 ? L - 1.95 - k * 3.1 : L - W + 1.9 + k * 3.1;
      }
      if (e.kind === "ped") return W >= 5.5 ? L + 1.4 + e.lane * 1.2 : L - 0.2 - e.lane * 0.15; // 広い道は歩道、狭い道は道の端
      return (r ? r.off : 0) + (e.lane - 0.5) * 0.4; // ほかの自転車も左端
    }
    function update(dt) {
      const s = sim;
      if (!s || s.paused || s.done) return;
      // 出す
      if ((spawnT -= dt) <= 0) {
        spawnT = 0.7 / Math.max(1, s.speedX * 0.6);
        const r = Roads.ride(s.along + 200), W = r ? r.W : 4;
        const n = (k) => list.filter((e) => e.kind === k).length;
        if (W >= 5.5 && n("car") < 10 && rnd() < 0.55) {
          // 後ろから来る車(自分より速い)と、向こうから来る車
          if (rnd() < 0.5) spawn("car", s.along - 60, 1);
          else spawn("car", s.along + 240, -1);
        } else if (W < 5.5 && n("car") < 3 && rnd() < 0.18) spawn("car", rnd() < 0.5 ? s.along - 50 : s.along + 220, rnd() < 0.5 ? 1 : -1);
        if (n("ped") < 14 && rnd() < 0.6) spawn("ped", s.along + 150 + rnd() * 100, rnd() < 0.5 ? 1 : -1);
        if (n("bike") < 3 && rnd() < 0.12) spawn("bike", s.along + 180 + rnd() * 60, 1);
      }
      for (let i = list.length - 1; i >= 0; i--) {
        const e = list[i];
        // 進む(車は前に自分がいたら速さを合わせる)
        let v = e.v;
        if (e.kind === "car" && e.dir > 0) {
          const ahead = list.find((o) => o !== e && o.kind === "car" && o.dir > 0 && o.along > e.along && o.along - e.along < 12 && Math.abs(o.lane - e.lane) < 0.3);
          if (ahead) v = Math.min(v, ahead.v);
        }
        e.along += e.dir * v * dt;
        const r = Roads.ride(e.along), off = laneOff(e, r);
        const p = at(e.along);
        const x = p.x + p.tz * off, z = p.z - p.tx * off;
        e.obj.position.set(x, H(x, z) + (e.kind === "ped" && W5(r) ? 0.17 : 0), z);
        e.obj.rotation.y = -Math.atan2(p.tz, p.tx) + (e.dir < 0 ? Math.PI : 0);
        if (e.kind === "ped") {
          const ph = (s.t * 6 + e.lane * 10) % (Math.PI * 2);
          e.obj.userData.legs[0].rotation.z = Math.sin(ph) * 0.45;
          e.obj.userData.legs[1].rotation.z = -Math.sin(ph) * 0.45;
        } else if (e.kind === "bike") e.obj.userData.pose(dt * 7, (v * dt) / 0.34);
        // 自分との位置関係
        const rel = e.along - s.along;
        const myOff = r ? r.off : 0;
        if (e.rel0 != null && Math.sign(rel) !== Math.sign(e.rel0) && Math.abs(rel) < 20) {
          const gap = Math.abs(off - myOff) - e.w / 2 - 0.35;
          if (e.kind === "car" && e.dir > 0 && rel > 0 && gap < 1.1) pop("ヒヤリ!", 300, "warn");
          else if ((e.kind === "ped" || e.kind === "bike") && rel < 0 && e.dir > 0) {
            passed++;
            if (gap < 0.9) pop("すり抜け", 50);
          } else if ((e.kind === "ped" || e.kind === "bike") && rel < 0) passed += 0; // すれ違い
        }
        e.rel0 = rel;
        if (rel < -80 || rel > 300) {
          scene.remove(e.obj);
          list.splice(i, 1);
        }
      }
      // 車線の注意: 後ろから車・向こうから車(狭い道)
      const back = list.some((e) => e.kind === "car" && e.dir > 0 && e.along < s.along && s.along - e.along < 35);
      const r0 = Roads.ride(s.along);
      const front = r0 && r0.W < 5.5 && list.some((e) => e.kind === "car" && e.dir < 0 && e.along > s.along && e.along - s.along < 60);
      const el = $("ct-lane");
      el.textContent = back ? "後ろから車 ⚠" : front ? "対向車 ⚠" : r0 ? (r0.W >= 9 ? "車道の左端" : r0.W >= 5.5 ? "車道の左端(2車線)" : "狭い道(左端)") : "";
      el.className = "ct-lane" + (back || front ? " warn" : "");
      $("ct-score").innerHTML = `<b>${score.toLocaleString()}</b><small>抜いた人 ${passed}</small>`;
    }
    const W5 = (r) => r && r.W >= 5.5;
    // 画面の真ん中に、得点の小さな文字を浮かべる
    function pop(text, pts, cls = "") {
      score += pts;
      const el = document.createElement("div");
      el.className = "ct-pop " + cls;
      el.textContent = `${text} +${pts}`;
      $("ct-pops").appendChild(el);
      setTimeout(() => el.remove(), 1400);
      if (pts >= 300) banner(`${text}+${pts}`, 1.6);
    }
    // 自分の前(-2〜+8m)の道の端に人や自転車がいたら、右へよける幅(m)
    function dodge(along) {
      const r = Roads.ride(along), my = r ? r.off : 0;
      let d = 0;
      for (const e of list) {
        if (e.kind === "car") continue;
        const rel = e.along - along;
        if (rel < -2 || rel > 8) continue;
        const off = laneOff(e, Roads.ride(e.along));
        const need = e.w / 2 + 0.55 - (my - off); // 相手の右側を、0.55m あけて通る
        if (off > my - 1.2 && need > d) d = need;
      }
      return Math.min(1.2, Math.max(0, d));
    }
    return { update, dodge, score: () => score, passed: () => passed };
  })();

  // ---------- 信号と交差点 ----------
  // OpenStreetMap の信号の点(日本では交差点名が付いていることが多い)を、走り出す前にルートのまわりだけ取る。
  // 取れなかったときは、PLATEAU の道路データの「交差点」から、広い道どうしの交差点に信号があるとみなす(推定)。
  // 信号は 60秒の周期(青35・黄3・赤22)で変わり、赤と黄では自分もライバルも停止線で止まる。
  const Signals = (() => {
    let list = []; // { along, name, phase, est, mesh, lamps }
    let source = "";
    const CYCLE = 60, G = 35, Y = 3;
    const OVERPASS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter", "https://overpass.private.coffee/api/interpreter"];
    function stateAt(sg, t) {
      const x = (((t + sg.phase) % CYCLE) + CYCLE) % CYCLE;
      return x < G ? "g" : x < G + Y ? "y" : "r";
    }
    function left(sg, t) {
      const x = (((t + sg.phase) % CYCLE) + CYCLE) % CYCLE;
      return x < G ? G - x : x < G + Y ? G + Y - x : CYCLE - x;
    }
    // 点をルートに投影(ルートから18m以内のものだけ)
    function onRoute(lat, lon) {
      const [x, z] = project(lat, lon);
      let best = 18, along = null;
      const { xy, cum } = route;
      for (let i = 0; i < xy.length - 1; i++) {
        const a = xy[i], b = xy[i + 1], vx = b[0] - a[0], vz = b[1] - a[1], L2 = vx * vx + vz * vz;
        if (!L2) continue;
        const t = Math.max(0, Math.min(1, ((x - a[0]) * vx + (z - a[1]) * vz) / L2));
        const d = Math.hypot(x - a[0] - vx * t, z - a[1] - vz * t);
        if (d < best) (best = d), (along = cum[i] + Math.sqrt(L2) * t);
      }
      return along;
    }
    async function prepare() {
      const key = "city_sig:" + route.points.length + ":" + route.length.toFixed(0) + ":" + route.points[0].join(",");
      try {
        const c = JSON.parse(localStorage.getItem(key) || "null");
        if (c && Date.now() - c.t < 14 * 864e5) return use(c.nodes, "OpenStreetMap");
      } catch (e) {}
      let la0 = 90, la1 = -90, lo0 = 180, lo1 = -180;
      for (const [la, lo] of route.points) (la0 = Math.min(la0, la)), (la1 = Math.max(la1, la)), (lo0 = Math.min(lo0, lo)), (lo1 = Math.max(lo1, lo));
      const m = 0.0015, box = `${(la0 - m).toFixed(5)},${(lo0 - m).toFixed(5)},${(la1 + m).toFixed(5)},${(lo1 + m).toFixed(5)}`;
      const q = `[out:json][timeout:20];(node["highway"="traffic_signals"](${box});node["crossing"="traffic_signals"](${box}););out;`;
      for (const url of OVERPASS) {
        try {
          const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 15000);
          const res = await fetch(url, { method: "POST", body: "data=" + encodeURIComponent(q), headers: { "Content-Type": "application/x-www-form-urlencoded" }, signal: ctl.signal });
          clearTimeout(to);
          if (!res.ok) continue;
          const j = await res.json();
          const nodes = (j.elements || []).map((e) => [e.lat, e.lon, (e.tags && (e.tags.name || e.tags["name:ja"])) || ""]);
          try {
            localStorage.setItem(key, JSON.stringify({ t: Date.now(), nodes }));
          } catch (e) {}
          return use(nodes, "OpenStreetMap");
        } catch (e) {}
      }
      source = "";
    }
    function use(nodes, src) {
      const pts = [];
      for (const [la, lo, name] of nodes) {
        const a = onRoute(la, lo);
        if (a != null) pts.push({ along: a, name });
      }
      pts.sort((a, b) => a.along - b.along);
      // ひとつの交差点の信号(四隅・歩行者用)を、まとめる
      list = [];
      for (const p of pts) {
        const last = list[list.length - 1];
        if (last && p.along - last.along < 35) {
          if (!last.name && p.name) last.name = p.name;
          continue;
        }
        list.push({ along: p.along, name: p.name, phase: hash(Math.round(p.along)) * CYCLE, est: false });
      }
      list = list.filter((s) => s.along > 25 && s.along < route.length - 15);
      source = src;
    }
    // データがないときの推定: 道路の交差点のうち、走っている道が広い(5.5m以上)ところ
    function infer() {
      if (source) return;
      const xs = Roads.crossings();
      const have = new Set(list.map((s) => Math.round(s.along / 30)));
      for (const [a0, a1] of xs) {
        const c = (a0 + a1) / 2, r = Roads.ride(a0 - 10) || Roads.ride(a1 + 10);
        if (!r || r.W < 5.5 || have.has(Math.round(c / 30)) || c < 25 || c > route.length - 15) continue;
        if (list.some((s) => Math.abs(s.along - c) < 40)) continue;
        list.push({ along: c, name: "", phase: hash(Math.round(c)) * CYCLE, est: true });
        have.add(Math.round(c / 30));
      }
      list.sort((a, b) => a.along - b.along);
    }
    // 次の信号(along より先)
    const next = (along) => list.find((s) => s.along > along - 2);
    // 止まるべきなら、その場所で出せる最高速度(m/s)を返す(止まらなくてよければ 99)
    function limit(along, t, v) {
      const sg = next(along);
      if (!sg) return 99;
      const stop = sg.along - 6, d = stop - along; // 停止線は信号の6m手前
      if (d < -1) return 99;
      const st = stateAt(sg, t);
      // 黄色: 止まれる距離なら止まる。止まれなければそのまま行く
      if (st === "g") return 99;
      if (st === "y" && d < (v * v) / (2 * 3) - 1) return 99;
      return d <= 0.3 ? 0 : Math.sqrt(2 * 2.5 * Math.max(0, d));
    }
    // ---- 3D: 停止線の向こう側(左)に、横向きの信号機(左から青・黄・赤) ----
    let M = null;
    function build(sg) {
      const THREE = T();
      if (!M) M = { pole: new THREE.MeshLambertMaterial({ color: 0x8e9196 }), box: new THREE.MeshLambertMaterial({ color: 0x2b2d31 }), off: new THREE.MeshLambertMaterial({ color: 0x1a1c1f }), g: new THREE.MeshBasicMaterial({ color: 0x19e8a8 }), y: new THREE.MeshBasicMaterial({ color: 0xffb21a }), r: new THREE.MeshBasicMaterial({ color: 0xff2a2a }), line: new THREE.MeshBasicMaterial({ color: 0xf2f2ee }) };
      const g = new THREE.Group();
      const p = at(sg.along + 4), r = Roads.ride(sg.along + 4) || Roads.ride(sg.along - 12);
      const Lft = r ? r.off + 1.6 : 4; // 道の左端の外
      const x = p.x + p.tz * Lft, z = p.z - p.tx * Lft, y = H(x, z);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 6.2, 8), M.pole);
      pole.position.set(0, 3.1, 0);
      g.add(pole);
      const reach = Math.min(6, (r ? r.W : 5) * 0.55); // 腕が道の上へ伸びる
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, reach), M.pole);
      arm.position.set(0, 5.9, reach / 2);
      g.add(arm);
      const head = new THREE.Group();
      head.position.set(-0.2, 5.6, reach - 0.4);
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.42, 1.25), M.box);
      head.add(body);
      const lamps = {};
      [["g", -0.4], ["y", 0], ["r", 0.4]].forEach(([k, zz]) => {
        const l = new THREE.Mesh(new THREE.CircleGeometry(0.14, 16), M.off);
        l.rotation.y = -Math.PI / 2;
        l.position.set(-0.15, 0, zz);
        head.add(l);
        lamps[k] = l;
      });
      g.add(head);
      g.position.set(x, y, z);
      // 腕(+z)が道の中央(右)へ、ランプ(−x)が自分(手前)を向くように
      g.rotation.y = -Math.atan2(p.tz, p.tx);
      // 停止線
      const s0 = at(sg.along - 6), rr = Roads.ride(sg.along - 6);
      if (rr) {
        const a = rr.off + 0.9, b = rr.off + 0.9 - Math.min(rr.W / 2, 4);
        const ax = s0.x + s0.tz * a, az = s0.z - s0.tx * a, bx = s0.x + s0.tz * b, bz = s0.z - s0.tx * b;
        const line = new THREE.Mesh(new THREE.PlaneGeometry(Math.hypot(bx - ax, bz - az), 0.45), M.line);
        line.rotation.x = -Math.PI / 2;
        line.rotation.z = Math.atan2(-(bz - az), bx - ax);
        line.position.set((ax + bx) / 2, H((ax + bx) / 2, (az + bz) / 2) + 0.085, (az + bz) / 2);
        sg.line = line;
        scene.add(line);
      }
      g.traverse((o) => o.isMesh && (o.castShadow = true));
      scene.add(g);
      sg.mesh = g;
      sg.lamps = lamps;
    }
    function update(along, t) {
      infer();
      for (const sg of list) {
        const d = sg.along - along;
        if (d > -60 && d < 450) {
          if (!sg.mesh) build(sg);
          const st = stateAt(sg, t);
          for (const k of ["g", "y", "r"]) sg.lamps[k].material = k === st ? M[k] : M.off;
        } else if (sg.mesh) {
          scene.remove(sg.mesh);
          if (sg.line) scene.remove(sg.line);
          sg.mesh = sg.line = null;
        }
      }
      // 次の信号: 上の「次:」と、左下の表示
      const sg = next(along), el = $("ct-sig");
      if (!sg || sg.along - along > 600) {
        el.textContent = "";
        return null;
      }
      const st = stateAt(sg, t), sec = Math.ceil(left(sg, t));
      el.innerHTML = `<i class="sig ${st}"></i>${sg.name ? esc(sg.name) : "交差点"}${sg.est ? "(推定)" : ""} ${Math.max(0, Math.round(sg.along - along))}m <small>${st === "g" ? "青" : st === "y" ? "黄" : "赤"} あと${sec}秒</small>`;
      return sg;
    }
    return { prepare, update, limit, next, stateAt, list: () => list, source: () => source };
  })();

  // ---------- 大きな見出し(町名・目印・ラスト1km・ゴール) ----------
  let bannerTo = 0, lastTown = "", lastBanner = "";
  function banner(text, sec = 2.6) {
    const el = $("ct-banner");
    if (!el || (text === lastBanner && !el.hidden)) return;
    lastBanner = text;
    el.textContent = text;
    el.hidden = false;
    el.classList.remove("in");
    void el.offsetWidth;
    el.classList.add("in");
    clearTimeout(bannerTo);
    bannerTo = setTimeout(() => (el.hidden = true), (sec * 1000) / Math.min(3, Math.max(1, sim ? sim.speedX / 2 : 1)));
  }
  // 次の目印(この先1.5km以内の駅・施設)までの距離
  function nextMark() {
    let best = null;
    for (const t of tiles.values()) {
      const inf = t.state === "ok" && t.group && t.group.userData.info;
      for (const lm of (inf && inf.lms) || []) {
        const d = lm.along - sim.along;
        if (d > 20 && d < 1500 && (!best || d < best.d || (lm.big && !best.big && d < best.d + 300))) best = { name: lm.name, icon: lm.icon, d, big: lm.big };
      }
    }
    const left = route.length - sim.along;
    $("ct-next").textContent = best && best.d < left ? `次: ${best.icon} ${best.name} ${Math.round(best.d)}m` : `ゴールまで ${left >= 1000 ? (left / 1000).toFixed(1) + "km" : Math.round(left) + "m"}`;
  }
  function townBanner(town) {
    if (town && town !== lastTown) {
      if (lastTown) banner(town.replace(/[一二三四五六七八九十]+丁目$/, ""));
      lastTown = town;
    }
    const left = route.length - sim.along;
    if (left < 1000 && left > 960) banner("ラスト1km");
    if (left < 300 && left > 270) banner("ゴール目前!");
  }

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
    // 使った回数(この端末・今月と今日)。Googleの料金は「開始1回」ごとに数えるので、無料の範囲(月1,000回)を
    // 超えないように、この端末では 月450回・1日20回 で止める(PCとスマホの2台で使っても900回まで)
    const CAP_M = 450, CAP_D = 20;
    const usage = () => {
      const d = new Date(), m = d.getFullYear() + "-" + (d.getMonth() + 1), day = m + "-" + d.getDate();
      let u = null;
      try {
        u = JSON.parse(localStorage.getItem("city_g3use") || "null");
      } catch (e) {}
      if (!u || u.m !== m) u = { m, n: 0, day, dn: 0 };
      if (u.day !== day) (u.day = day), (u.dn = 0);
      return u;
    };
    const overCap = () => {
      const u = usage();
      return u.n >= CAP_M ? `今月の上限(${CAP_M}回)に達しました` : u.dn >= CAP_D ? `今日の上限(${CAP_D}回)に達しました` : "";
    };
    const countUse = () => {
      const u = usage();
      u.n++;
      u.dn++;
      try {
        localStorage.setItem("city_g3use", JSON.stringify(u));
      } catch (e) {}
    };
    async function start() {
      if (tiles || starting) return starting;
      if (overCap()) return (err = overCap() + "。料金がかからないように、Googleの3Dを止めています"), null;
      countUse();
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
        tiles.errorTarget = innerWidth < 900 ? 12 : 6;
        // 同時に取りに行く数・ほどく数を増やす(はじめの粗い形から、細かい形に早く切り替わるように)
        try {
          tiles.downloadQueue.maxJobs = innerWidth < 900 ? 12 : 24;
          tiles.parseQueue.maxJobs = innerWidth < 900 ? 3 : 6;
        } catch (e) {}
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
        const want = H(p.x, p.z);
        if (g != null && Math.abs(g - want) < 60) {
          groundH += (g - want) * 0.6;
          place(s.along, true);
        }
        const r = at(s.rAlong);
        const gr = Math.hypot(r.x - p.x, r.z - p.z) < 600 ? groundAt(r.x - r.tz * 1.3, r.z + r.tx * 1.3) : null;
        ray.rival = gr != null && Math.abs(gr - H(r.x, r.z)) < 40 ? gr : H(r.x, r.z);
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
      usage: () => Object.assign(usage(), { capM: CAP_M, capD: CAP_D, over: overCap() }),
      getKey,
      setKey(k) {
        try {
          localStorage.setItem("city_gkey", (k || "").trim());
        } catch (e) {}
      },
      async set(v) {
        on = v && !!getKey();
        if (on) await start();
        if (on && !tiles && !starting) on = false; // 上限で始められなかった
        if (tiles) tiles.group.visible = on;
        return on;
      },
      on: () => on && !!tiles,
      // 細かい形まで届いたか(取りに行っているものがなくなって1秒たった)。走り出す前に待つのに使う
      ready() {
        if (!on || err) return true;
        if (!tiles) return false;
        const st = tiles.stats || {};
        const busy = (st.downloading || 0) + (st.parsing || 0);
        if (busy || models < 30) return (ray.idle = 0), false;
        if (!ray.idle) ray.idle = Date.now();
        return Date.now() - ray.idle > 1000;
      },
      update,
      credits,
      rivalY: () => ray.rival,
      err: () => err,
      models: () => models,
    };
  })();
  // ---------- ストリートビュー(道の目線の、本物の写真)で走る ----------
  // Google の地図の部品(Maps JavaScript API)のストリートビューを画面いっぱいに出し、走った分だけ写真を先へ進める。
  // 写真は十数mおきにしかないので、景色は数秒ごとに切り替わる(なめらかな3Dにはならない)。
  // 料金は「ストリートビューを開いた回数」で数えるはずなので、1回のライドで1回だけ開く。この端末では1日20回・月450回で止める。
  const SV = (() => {
    let on = false, pano = null, svc = null, loading = null, err = "", el = null, lastAlong = -1e9, busy = false, lastId = "", hdg = null, povT = 0, miss = 0;
    const CAP_M = 450, CAP_D = 20;
    const usage = () => {
      const d = new Date(), m = d.getFullYear() + "-" + (d.getMonth() + 1), day = m + "-" + d.getDate();
      let u = null;
      try {
        u = JSON.parse(localStorage.getItem("city_svuse") || "null");
      } catch (e) {}
      if (!u || u.m !== m) u = { m, n: 0, day, dn: 0 };
      if (u.day !== day) (u.day = day), (u.dn = 0);
      return u;
    };
    const over = () => {
      const u = usage();
      return u.n >= CAP_M ? `今月の上限(${CAP_M}回)に達しました` : u.dn >= CAP_D ? `今日の上限(${CAP_D}回)に達しました` : "";
    };
    function load() {
      if (loading) return loading;
      loading = new Promise((res, rej) => {
        if (window.google && google.maps && google.maps.StreetViewPanorama) return res();
        window.__svReady = () => res();
        window.gm_authFailure = () => {
          err = "キーが使えません。Google Cloud で「Maps JavaScript API」を有効にして、キーの「APIの制限」にも加えてください";
          stop();
        };
        const sc = document.createElement("script");
        sc.src = "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(G3.getKey()) + "&v=weekly&loading=async&callback=__svReady";
        sc.onerror = () => rej(new Error("読み込めませんでした"));
        document.head.appendChild(sc);
      });
      return loading;
    }
    async function start() {
      err = "";
      if (!G3.getKey()) return (err = "APIキーを入れてください"), false;
      if (!pano && over()) return (err = over() + "。料金がかからないように止めています"), false;
      try {
        await load();
      } catch (e) {
        loading = null;
        return (err = "Google の地図の部品を読み込めませんでした"), false;
      }
      if (!el) {
        el = document.createElement("div");
        el.className = "ct-sv";
        el.innerHTML = `<div class="ct-sv-pano"></div><div class="ct-sv-rival" hidden><i></i><b></b></div><div class="ct-sv-bike"></div><p class="ct-sv-msg" hidden></p>`;
        $("ct-view").appendChild(el);
      }
      if (!pano) {
        const u = usage();
        u.n++;
        u.dn++;
        try {
          localStorage.setItem("city_svuse", JSON.stringify(u));
        } catch (e) {}
        pano = new google.maps.StreetViewPanorama(el.firstChild, { disableDefaultUI: true, clickToGo: false, linksControl: false, panControl: false, zoomControl: false, addressControl: false, fullscreenControl: false, motionTracking: false, motionTrackingControl: false, scrollwheel: false, showRoadLabels: true, zoom: 0.4, visible: true });
        svc = new google.maps.StreetViewService();
      }
      el.hidden = false;
      on = true;
      lastAlong = -1e9;
      return true;
    }
    function stop() {
      on = false;
      if (el) el.hidden = true;
      const c = $("ct-sv");
      if (c) c.checked = false;
    }
    // 走っている向き(北=0・東=90)
    const heading = (p) => ((Math.atan2(p.tx, -p.tz) * 180) / Math.PI + 360) % 360;
    function update(dt, p, s) {
      if (!on || !pano) return;
      // 向き: 道の向きへ、なめらかに回す
      const want = heading(p);
      if (hdg == null) hdg = want;
      hdg = (hdg + ((((want - hdg) % 360) + 540) % 360 - 180) * Math.min(1, dt * 2.5) + 360) % 360;
      if ((povT += dt) > 0.1) (povT = 0), pano.setPov({ heading: hdg, pitch: -4 });
      // 写真を先へ進める: 15mごと(速いときは、1.5秒に1回までに間引く)
      const step = Math.max(15, s.v * s.speedX * 1.5);
      if (!busy && Math.abs(s.along - lastAlong) >= step) {
        lastAlong = s.along;
        busy = true;
        const q = at(s.along + 6);
        const loc = { lat: route.lat0 - q.z / route.kz, lng: route.lon0 + q.x / route.kx };
        svc.getPanorama({ location: loc, radius: 35, preference: google.maps.StreetViewPreference.NEAREST, sources: [google.maps.StreetViewSource.OUTDOOR] })
          .then((r) => {
            const id = r.data.location.pano;
            miss = 0;
            if (id !== lastId) (lastId = id), pano.setPano(id);
          })
          .catch(() => miss++)
          .finally(() => (busy = false));
      }
      const msg = el.querySelector(".ct-sv-msg");
      msg.hidden = miss < 3;
      if (miss >= 3) msg.textContent = "このあたりはストリートビューの写真がありません";
      // ライバル: 前にいるときだけ、距離に合わせた大きさで出す
      const d = s.rAlong - s.along, rv = el.querySelector(".ct-sv-rival");
      rv.hidden = !(d > 4 && d < 120);
      if (!rv.hidden) {
        const k = Math.min(1, 9 / d);
        rv.style.transform = `translate(-50%, 0) scale(${k.toFixed(3)})`;
        rv.lastChild.textContent = `${Math.round(d)}m`;
      }
    }
    return { start, stop, update, on: () => on, err: () => err, usage: () => Object.assign(usage(), { capM: CAP_M, capD: CAP_D, over: over() }) };
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
    Roads.setVisible(!g);
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
  // これから見せる物(1コマに2つずつ)
  const reveal = [];
  function revealStep() {
    for (let i = 0; i < 2 && reveal.length; i++) reveal.shift().visible = true;
  }
  let photoMore = 0;
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
    // 走っている間は、1回に2枚まで作る(まとめて作ると、その瞬間に引っかかる)
    let made = 0;
    photoMore = 0;
    for (const key of need) {
      if (photos.has(key)) continue;
      if (running && sim && !sim.paused && made >= 2) {
        photoMore++;
        continue;
      }
      made++;
      const [z, x, y] = key.split("/").map(Number), n = 2 ** z;
      const lonOf = (v) => (v / n) * 360 - 180, latOf = (v) => (Math.atan(Math.sinh(Math.PI * (1 - (2 * v) / n))) * 180) / Math.PI;
      const a = project(latOf(y), lonOf(x)), b = project(latOf(y), lonOf(x + 1)), c = project(latOf(y + 1), lonOf(x + 1)), d = project(latOf(y + 1), lonOf(x));
      const h = z === 18 ? -0.03 : z === 17 ? -0.04 : -0.05;
      // 坂にそわせるため、細かく分けて高さをつける(標高の目の細かさ=約4mに合わせる。
      // 粗いと、でこぼこした所で写真の地面が道や自転車より上に出て、埋もれて見える)
      const N = z === 18 ? 30 : 32, P = [], U = [];
      const pt = (i, j) => {
        const u = i / N, v = j / N;
        const x = a[0] + (b[0] - a[0]) * u + (d[0] - a[0]) * v, z = a[1] + (b[1] - a[1]) * u + (d[1] - a[1]) * v;
        return [x, h + H(x, z), z, u, 1 - v];
      };
      for (let j = 0; j < N; j++)
        for (let i = 0; i < N; i++)
          for (const [ii, jj] of [[i, j], [i, j + 1], [i + 1, j + 1], [i, j], [i + 1, j + 1], [i + 1, j]]) {
            const q = pt(ii, jj);
            P.push(q[0], q[1], q[2]);
            U.push(q[3], q[4]);
          }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(P, 3));
      geo.setAttribute("uv", new THREE.Float32BufferAttribute(U, 2));
      const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xa9aec4, polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 6 }));
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
    if (photoMore) return; // まだ作り終えていない間は、古い写真を消さない
    for (const [key, mesh] of photos) {
      if (need.has(key)) continue;
      scene.remove(mesh);
      mesh.geometry.dispose();
      if (mesh.material.map) mesh.material.map.dispose();
      mesh.material.dispose();
      photos.delete(key);
    }
  }

  // 新しくできた建物は、地面からばねのように立ち上がる(急にパッと出ない)
  const rising = [];
  function riseIn(group) {
    let i = 0;
    for (const ch of group.userData.chunks || []) {
      if (!ch.mesh.visible) continue;
      ch.mesh.position.y = -45;
      rising.push({ m: ch.mesh, y: -45, v: 0, wait: 0.12 * i++ });
    }
  }
  function riseUpdate(dt) {
    for (let i = rising.length - 1; i >= 0; i--) {
      const r = rising[i];
      if ((r.wait -= dt) > 0) continue;
      // ばね(少し行きすぎて戻る)。こまかく刻んで、コマ落ちしても同じ動きにする
      for (let n = Math.max(1, Math.ceil(dt * 120)), h = dt / n, k = 0; k < n; k++) {
        r.v += (-38 * r.y - 9.5 * r.v) * h;
        r.y += r.v * h;
      }
      if (Math.abs(r.y) < 0.02 && Math.abs(r.v) < 0.05) (r.y = 0), rising.splice(i, 1);
      r.m.position.y = r.y;
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
      const g = tiles.get(key) === t ? await buildTile(data) : null;
      if (g && tiles.get(key) === t) {
        t.group = g;
        t.state = "ok";
        if (G3.on()) hideOwnCity(t.group, true);
        riseIn(t.group);
        scene.add(t.group);
      } else if (g) g.traverse((o) => o.geometry && o.geometry.dispose());
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
      // ガレージの保存データを書き換えないよう、複製して使う
      const bc = JSON.parse(JSON.stringify(b));
      root = View3D.headless(fit, bc, G.body);
    } catch (e) {
      return null;
    }
    if (!root) return null;
    // 自分: 簡単な形は隠して、ガレージのモデルを入れる(名札などはそのまま)
    for (const c of meFallback.g.children) c.visible = false;
    meFallback.g.add(root);
    meFallback.pose = () => {};
    // 写真から作ったバイク(コマ画像)に差し替える: 3Dのバイクは隠し、カメラから見た角度のコマを板に貼って立てる。
    // ライダーは3Dのまま。ライバルはガレージの3Dのバイク(赤)のまま
    let imp = null, bikeG = null;
    try {
      let on = false;
      try {
        on = localStorage.getItem("city_tcr2") === "1"; // 初めはオフ(体の位置と合わないため)
      } catch (e) {}
      bikeG = View3D.bikeObj && View3D.bikeObj();
      if (on && bikeG && typeof BikeSpin !== "undefined") {
        const S = BikeSpin.SMALL, Rw = View3D.wheelRadius();
        const m = Rw / 150; // もとの動画で、車輪の半径は150px
        const W = 780 * m, H = 550 * m; // 切り出した1コマは 780×550px、地面(回る軸の足もと)は下から70px
        root.updateMatrixWorld(true);
        // 前後のタイヤの真ん中に立てる(地面はタイヤの接地点)
        let tiresObj = null;
        bikeG.traverse((o) => !tiresObj && o.userData && o.userData.slot === "tires" && (tiresObj = o));
        const box = new THREE.Box3().setFromObject(tiresObj || bikeG);
        const ctr = root.worldToLocal(box.getCenter(new THREE.Vector3()));
        const tex = new THREE.TextureLoader().load(S.src);
        if ("colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace;
        else tex.encoding = THREE.sRGBEncoding;
        tex.repeat.set(1 / S.cols, 1 / S.rows);
        tex.generateMipmaps = false;
        tex.minFilter = THREE.LinearFilter;
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshBasicMaterial({ map: tex, alphaTest: 0.45, side: THREE.DoubleSide }));
        mesh.position.set(ctr.x, -root.position.y + (550 / 2 - 70) * m, ctr.z);
        mesh.userData.impostor = true;
        root.add(mesh);
        bikeG.visible = false;
        const v = new THREE.Vector3();
        imp = {
          mesh,
          face(cam) {
            if (!cam) return;
            v.copy(cam.position);
            root.worldToLocal(v);
            const a = Math.atan2(v.x - mesh.position.x, v.z - mesh.position.z); // 右横(+z)から見て0、正面(+x)から見て90度
            mesh.rotation.y = a;
            const f = ((Math.round((a / (Math.PI * 2)) * S.n) % S.n) + S.n) % S.n;
            tex.offset.set((f % S.cols) / S.cols, 1 - (Math.floor(f / S.cols) + 1) / S.rows);
          },
        };
      }
    } catch (e) {
      console.error(e);
      imp = null;
    }
    const R = View3D.wheelRadius();
    const st = { crank: 90, wheel: 0, rCrank: 270, rWheel: 0, drop: 0, rDrop: 0, clone: null, src: null, dst: null, busy: false };
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
      // mySp / rvSp: スプリント中か。手はドロップの下へ(0.25秒ほどで持ち替え)、回転も上がる(約85→110rpm)
      update(dt, myPed, myV, rvPed, rvV, mySp, rvSp) {
        const ease = Math.min(1, dt * 4);
        st.drop += ((mySp ? 1 : 0) - st.drop) * ease;
        st.rDrop += ((rvSp ? 1 : 0) - st.rDrop) * ease;
        if (myPed) st.crank = (st.crank + dt * 510 * (1 + 0.3 * st.drop)) % 360;
        st.wheel += (myV * dt) / R;
        if (rvPed) st.rCrank = (st.rCrank + dt * 510 * (1 + 0.3 * st.rDrop)) % 360;
        st.rWheel += (rvV * dt) / R;
        if (!st.clone && !st.busy && View3D.hasRig() && (st.tries = (st.tries || 0) + 1) < 4) makeRival();
        if (st.clone) {
          View3D.poseAt(st.rCrank, st.rWheel, st.rDrop);
          const a = st.src, b = st.dst;
          for (let i = 0; i < a.length; i++) {
            b[i].position.copy(a[i].position);
            b[i].quaternion.copy(a[i].quaternion);
            b[i].scale.copy(a[i].scale);
            // ライバルは3Dのバイクのまま(写真のバイクの板は出さない)
            b[i].visible = imp && a[i] === bikeG ? true : imp && a[i] === imp.mesh ? false : a[i].visible;
          }
        }
        View3D.poseAt(st.crank, st.wheel, st.drop);
        if (imp) imp.face(camera);
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
    const sd = new THREE.Vector3(...c.sun[2]).normalize();
    lights.sun.userData.dir = [sd.x, sd.y, sd.z];
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

  // 地面: 自分のまわり1.6km四方を、標高にそった網にする(200m動いたら作り直す)
  let groundAt = null;
  function updateGround(p) {
    const THREE = T();
    if (groundAt && Math.hypot(p.x - groundAt[0], p.z - groundAt[1]) < 200) return;
    groundAt = [p.x, p.z];
    const S = 1600, N = 64;
    const geo = new THREE.PlaneGeometry(S, S, N, N);
    geo.rotateX(-Math.PI / 2);
    const a = geo.attributes.position;
    for (let i = 0; i < a.count; i++) {
      const x = a.getX(i) + p.x, z = a.getZ(i) + p.z;
      a.setXYZ(i, x, H(x, z) - 0.12, z);
    }
    geo.computeVertexNormals();
    ground.geometry.dispose();
    ground.geometry = geo;
    ground.rotation.x = 0;
    ground.position.set(0, 0, 0);
    ground.receiveShadow = true;
  }

  function init3D() {
    const THREE = T();
    const el = $("ct-view");
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputEncoding = THREE.sRGBEncoding;
    // 明るい所が白く飛ばず、影がしまる(映画のフィルムに近い色の出し方)
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    orbitInit(renderer.domElement);
    el.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x6a4a66, 120, 620);
    lights.hemi = new THREE.HemisphereLight(0xaab4ff, 0x3a3038, 0.85);
    lights.sun = new THREE.DirectionalLight(0xffb070, 0.9);
    scene.add(lights.hemi, lights.sun, lights.sun.target);
    // 影(PCだけ。自分のまわり140m四方に、建物・木・電柱・自転車の影を落とす)
    if (innerWidth >= 900) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      const sh = lights.sun.shadow;
      lights.sun.castShadow = true;
      sh.mapSize.set(2048, 2048);
      Object.assign(sh.camera, { left: -48, right: 48, top: 48, bottom: -48, near: 1, far: 400 }); // 近くの影をくっきり(1点 約5cm)
      sh.bias = -0.0008;
      sh.normalBias = 0.04;
    }
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
    for (const m of [mats.bld, mats.pcol, ...mats.fac]) popMat(m);
    setTime(timeMode);
    clock = new THREE.Clock();
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
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
    gate.position.set(g.x, H(g.x, g.z), g.z);
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
    for (const b of [me, rival]) b.g.traverse((o) => o.isMesh && (o.castShadow = true));
    if (typeof MonsterArt !== "undefined") MonsterArt.load();
    Battle.deal(sim.ride);
    buildRouteStrip();
    wantTiles(0);
    photoStyle();
    wantPhotos(0);
    Plateau.want(0);
    Roads.want(0);
    hudDuel();
    // 最初の街が出るまで待つ(長くても40秒。出なければ道の線だけで走り出す)
    sim.paused = true;
    const wait = $("ct-wait");
    wait.hidden = false;
    const t0 = Date.now();
    const iv = setInterval(() => {
      const g3 = $("ct-google") && $("ct-google").checked;
      const ok = [...tiles.values()].some((t) => t.state === "ok") && Plateau.ready() && (!g3 || G3.ready());
      const sec = Math.round((Date.now() - t0) / 1000);
      wait.querySelector("small").textContent = `${sec}秒${g3 && !G3.ready() ? ` ・Googleの3Dを読み込み中(${G3.models()}個)` : ""}${lastErr ? " ・地図サーバー: " + lastErr + "(やり直し中)" : ""}`;
      if (ok || sec >= (g3 ? 75 : 40)) {
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
    // 勾配: 上りは重力が後ろへ、下りは前へ(sin ≒ 勾配/100)
    s.grade = Terrain.grade(s.along);
    let F = P / v - 0.5 * 1.2 * 0.32 * s.v * s.v - 0.005 * s.mass * 9.81 * (s.v > 0.05 ? 1 : 0) - s.mass * 9.81 * (s.grade / 100);
    if (s.brake) F -= s.mass * 4;
    // 曲がり角では、曲がれる速さまで自動で落とす
    const turn = turnAhead(s.along);
    // 赤信号・黄色: 停止線までに止まれる速さまで落とす(止まったら青まで待つ)
    const vsig = Signals.limit(s.along, s.t, s.v);
    const vmax = Math.min(turn > 75 ? 16 / KMH : turn > 50 ? 23 / KMH : turn > 28 ? 31 / KMH : 99, vsig);
    s.v = Math.max(0, s.v + (F / s.mass) * dt);
    if (s.v > vmax) s.v = Math.max(vmax, s.v - (vsig < 99 ? 4 : 6) * dt);
    s.waiting = vsig === 0 && s.v < 0.3;
    s.along = Math.min(route.length, s.along + s.v * dt);
    s.power = P;
    // ライバル: 決めたペースを中心に、少し速くなったり遅くなったりする
    const rt = turnAhead(s.rAlong);
    const rmax = rt > 75 ? 16 / KMH : rt > 50 ? 23 / KMH : rt > 28 ? 31 / KMH : 99;
    // ライバルも、上りでは遅く・下りでは速く(1%で約7%)
    const rg = Terrain.grade(s.rAlong);
    const target = Math.min(rmax, Signals.limit(s.rAlong, s.t, s.rV), s.rivalV * Math.max(0.45, Math.min(1.3, 1 - rg * 0.07)) * (1 + 0.09 * Math.sin(s.t / 37) + 0.05 * Math.sin(s.t / 11 + 2)));
    s.rV += Math.max(-4, Math.min(0.55, target - s.rV)) * Math.min(1, dt * 1.2);
    if (target === 0 && s.rV < 0.3) s.rV = 0;
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
    const gr = Terrain.grade(s.along);
    $("ct-power").textContent = `${s.power || 0} W`;
    const ge = $("ct-grade");
    ge.textContent = Terrain.ok() ? `${gr >= 0 ? "▲" : "▼"} ${Math.abs(gr).toFixed(1)}%` : "";
    ge.className = "ct-grade " + (gr > 2 ? "up" : gr < -2 ? "down" : "");
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

  // side: 走る位置(車道の左端から約0.9m)から、さらに右へ何m
  function riderPos(along, side) {
    const p = at(along), r = Roads.ride(along), o = (r ? r.off : 0) - side;
    // 向きは、少し後ろ〜少し先の向きをならして使う(道の折れ目でカクッと向きが変わらないように)
    {
      let tx = 0, tz = 0;
      for (const [d, w] of [[-3, 1], [-1.5, 2], [0, 3], [1.5, 3], [3, 2], [5, 1]]) {
        const q = at(along + d);
        (tx += q.tx * w), (tz += q.tz * w);
      }
      const L = Math.hypot(tx, tz);
      if (L > 1e-3) (p.tx = tx / L), (p.tz = tz / L);
    }
    const x = p.x + p.tz * o, z = p.z - p.tx * o;
    return { x, z, y: H(x, z), tx: p.tx, tz: p.tz };
  }
  function placeBiker(b, along, side, dt, v, pedaling) {
    const p = riderPos(along, side);
    b.g.position.set(p.x, p.y, p.z);
    b.g.rotation.y = -Math.atan2(p.tz, p.tx);
    b.pose(pedaling ? dt * 9 : 0, (v * dt) / 0.34);
    return p;
  }

  // 画面の細かさを、端末の速さに合わせて上げ下げする(コマ数が落ちたら少し粗くして、なめらかさを優先)
  const res = { t: 0, n: 0, slow: 0, cool: 0 };
  function autoRes(dt) {
    const max = Math.min(2, window.devicePixelRatio || 1);
    if (res.pr == null) res.pr = renderer.getPixelRatio();
    (res.t += dt), res.n++;
    if (dt > 0.034) res.slow++;
    res.cool -= dt;
    if (res.t < 1.2) return;
    const fps = res.n / res.t, slow = res.slow / res.n;
    (res.t = 0), (res.n = 0), (res.slow = 0);
    if (document.hidden || res.cool > 0) return;
    let pr = res.pr;
    // いちばん粗くしてもコマ数が足りないときは、影をやめる(見た目より、なめらかさを優先)
    const floor = Math.min(1, max);
    if (pr <= floor + 0.01 && fps < 45 && renderer.shadowMap.enabled) {
      if ((res.low = (res.low || 0) + 1) >= 3) {
        renderer.shadowMap.enabled = false;
        lights.sun.castShadow = false;
        scene.traverse((o) => o.material && (Array.isArray(o.material) ? o.material.forEach((m) => (m.needsUpdate = true)) : (o.material.needsUpdate = true)));
      }
    } else res.low = 0;
    if (fps < 50 || slow > 0.15) pr = Math.max(Math.min(1, max), pr * (fps < 35 ? 0.78 : 0.88)); // 等倍より粗くはしない(ぼやけて見えるため)
    else if (fps > 57 && slow < 0.03 && pr < max) pr = Math.min(max, pr * 1.07), (res.cool = 4);
    if (Math.abs(pr - res.pr) < 0.01) return;
    res.pr = pr;
    renderer.setPixelRatio(pr);
    const el = $("ct-view");
    renderer.setSize(el.clientWidth, el.clientHeight);
  }

  // 性能の記録: 1コマの中の、どの部分にどれだけ時間がかかったか(引っかかりの原因を探すため)
  const Perf = {
    t: 0, sum: {}, max: {}, n: 0, gaps: [], last: 0,
    begin() {
      const now = performance.now();
      if (this.last) {
        const gap = now - this.last;
        this.gaps.push(gap), this.gaps.length > 600 && this.gaps.shift();
        // このアプリの処理以外で待った時間(画面に出すまでの待ち・ほかの仕事)
        this.span("描画待ち・その他", gap - (this.loopMs || 0));
      }
      this.t0 = this.last = this.t = now;
      this.n++;
    },
    lap(k) {
      const now = performance.now(), d = now - this.t;
      this.t = now;
      this.sum[k] = (this.sum[k] || 0) + d;
      if (d > (this.max[k] || 0)) this.max[k] = d;
    },
    // コマの外で動く仕事(街を作るなど)の長さ
    span(k, ms) {
      if (ms > (this.max[k] || 0)) this.max[k] = ms;
    },
    report() {
      const g = this.gaps.slice().sort((a, b) => a - b), q = (p) => g[Math.floor((g.length - 1) * p)] || 0;
      const top = Object.entries(this.max).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k} ${v.toFixed(0)}`);
      const avg = Object.entries(this.sum).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${k} ${(v / Math.max(1, this.n)).toFixed(1)}`);
      const r = { fps: g.length ? 1000 / (g.reduce((a, b) => a + b, 0) / g.length) : 0, p50: q(0.5), p99: q(0.99), worst: q(1), slow: g.filter((x) => x > 34).length, n: g.length, top, avg };
      return r;
    },
    reset() {
      (this.sum = {}), (this.max = {}), (this.n = 0), (this.gaps = []);
    },
  };
  let setSVfn = null, starting = false;
  const orbit = { yaw: 0, pit: 0, down: false, hold: 0, x: 0, y: 0 };
  function orbitInit(el) {
    el.style.touchAction = "none";
    el.addEventListener("pointerdown", (e) => ((orbit.down = true), (orbit.x = e.clientX), (orbit.y = e.clientY), el.setPointerCapture && el.setPointerCapture(e.pointerId)));
    el.addEventListener("pointermove", (e) => {
      if (!orbit.down) return;
      orbit.yaw = Math.max(-Math.PI, Math.min(Math.PI, orbit.yaw + ((e.clientX - orbit.x) / Math.max(200, innerWidth)) * 4.5));
      orbit.pit = Math.max(-0.25, Math.min(0.9, orbit.pit + ((e.clientY - orbit.y) / Math.max(200, innerHeight)) * 2));
      (orbit.x = e.clientX), (orbit.y = e.clientY);
    });
    const up = () => ((orbit.down = false), (orbit.hold = performance.now() + 2500));
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  }
  let viewMode = "auto";
  try {
    viewMode = localStorage.getItem("city_view") || "auto";
  } catch (e) {}
  function loop() {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const THREE = T();
    const real = Math.min(0.1, clock.getDelta());
    const s = sim;
    Perf.begin();
    if (!s.paused && !s.done) {
      const n = s.speedX;
      for (let i = 0; i < n; i++) {
        physics(real);
        stepDuel();
        if (s.paused) break;
      }
      if (s.along >= route.length - 0.5) finish();
      Perf.lap("対戦");
      if ((s.tileT = (s.tileT || 0) + real) > 1.5) (s.tileT = 0), wantTiles(s.along), Roads.want(s.along), G3.on() || (wantPhotos(s.along), Plateau.want(s.along));
    }
    if (photoMore && !G3.on() && (s.phT = (s.phT || 0) + real) > 0.15) (s.phT = 0), wantPhotos(s.along);
    Perf.lap("街の予約");
    // 道の端の人をよける(なめらかに右へ寄って、また左へ戻る)
    s.dodge = (s.dodge || 0) + (Traffic.dodge(s.along) - (s.dodge || 0)) * Math.min(1, real * s.speedX * 3);
    const p = placeBiker(me, s.along, s.dodge, real * s.speedX, s.v, (s.auto || s.pedal) && !s.brake && !s.paused);
    placeBiker(rival, s.rAlong, 1.1, real * s.speedX, s.rV, !s.paused);
    if (G3.on()) rival.g.position.y = G3.rivalY();
    const myPed = (s.auto || s.pedal) && !s.brake && !s.paused && !s.done;
    const mySp = myPed && s.sprint && s.stamina > 0.02;
    // ライバルは、ゴール前500mか、ぐっと加速しているときにスプリント
    const rvSp = !s.paused && !s.done && (route.length - s.rAlong < 500 || s.rV > s.rivalV * 1.06);
    if (GB) GB.update(real * s.speedX, myPed, s.paused ? 0 : s.v, !s.paused && !s.done, s.paused ? 0 : s.rV, mySp, rvSp);
    Mons.update(real * Math.min(4, s.speedX));
    Perf.lap("乗り手");
    Traffic.update(real * s.speedX);
    Perf.lap("人と車");
    const sg = Signals.update(s.along, s.t);
    Perf.lap("信号");
    if (sg && sg.name && sg.along - s.along < 70 && sg.along - s.along > 40 && sg.bannered !== true) (sg.bannered = true), banner(sg.name.replace(/交差点$/, "") + " 交差点", 2.2);
    if (s.waiting && !s.wasWaiting) banner("信号待ち", 1.6);
    s.wasWaiting = s.waiting;
    // 追いかけるカメラ(後ろ上から。速いほど少し引いて、視野を広げる)
    // 視点: 近く(すぐ後ろ)/上から(ドローンのように)/空から。Googleの3Dは空から撮った街なので、
    // 道のすぐ上から見ると溶けたように見える。「おまかせ」では、Googleの3Dのときだけ上から見る
    // 「すぐ後ろ」は、乗り手の肩ごしに近くから見る(3人称のゲームのような見え方)。
    const vm = viewMode === "auto" ? (G3.on() ? "high" : "close") : viewMode;
    const VW = { close: [3.7 + s.v * 0.09, 1.75 + s.v * 0.02, 7, 0.45, 50], near: [6.5 + s.v * 0.18, 2.9 + s.v * 0.05, 9, 0, 58], high: [30, 26, 16, 0, 58], sky: [60, 75, 22, 0, 58] }[vm] || [6.5, 2.9, 9, 0, 58];
    s.vw = s.vw && s.vw.length === 5 ? s.vw : VW.slice();
    for (let i = 0; i < 5; i++) s.vw[i] += (VW[i] - s.vw[i]) * Math.min(1, real * 2.2); // 切り替えはなめらかに
    // 画面を引くと、乗り手のまわりを回って見られる。手を離して少したつと、後ろに戻る
    if (!orbit.down && performance.now() > orbit.hold) {
      const k = Math.min(1, real * 2.5);
      (orbit.yaw -= orbit.yaw * k), (orbit.pit -= orbit.pit * k);
    }
    const oy = orbit.yaw, cs = Math.cos(oy), sn = Math.sin(oy);
    const bx = -(p.tx * cs - p.tz * sn), bz = -(p.tx * sn + p.tz * cs); // 後ろ向きを、回した分だけ回す
    const back = s.vw[0], up = Math.max(0.5, s.vw[1] + back * Math.tan(orbit.pit)), side = s.vw[3] * Math.max(0, 1 - Math.abs(oy) * 2);
    const want = new THREE.Vector3(p.x + bx * back + p.tz * side, p.y + up, p.z + bz * back - p.tx * side);
    if (!s.camPos) s.camPos = want.clone();
    // 早送りでもカメラが遅れないように、追いつく速さも倍速に合わせる
    s.camPos.lerp(want, 1 - Math.exp(-real * (orbit.down ? 14 : vm === "close" ? 5 : 3.2) * Math.max(1, s.speedX)));
    if (s.camPos.distanceTo(want) > 30) s.camPos.copy(want);
    camera.position.copy(s.camPos);
    // 回して見ているときは乗り手を、ふだんは少し先を見る
    const la = s.vw[2] * Math.max(0, 1 - Math.abs(oy) * 1.5);
    camera.lookAt(p.x + p.tx * la, p.y + 1.2, p.z + p.tz * la);
    camera.fov = s.vw[4] + Math.min(16, s.v * 1.1);
    camera.updateProjectionMatrix();
    updateGround(p);
    popU.uPopT.value = performance.now() / 1000;
    // 影の地図は2コマに1回だけ作り直す。光の位置も同じコマでだけ動かす(ずれると影がガタガタ揺れる)
    s.frameN = (s.frameN || 0) + 1;
    if (lights.sun.castShadow && s.frameN % 2 === 0) {
      const d = lights.sun.userData.dir || [0, 1, 0];
      lights.sun.position.set(p.x + d[0] * 150, p.y + d[1] * 150, p.z + d[2] * 150);
      lights.sun.target.position.set(p.x, p.y, p.z);
      lights.sun.target.updateMatrixWorld();
    }
    Perf.lap("カメラ・地面");
    Roads.update(s.along, real);
    Perf.lap("道");
    SV.update(real, p, s);
    // ストリートビューのときは、3Dの街は描かない(下に隠れて見えないので、その分軽くする)
    if (SV.on()) {
      if ((s.hudT = (s.hudT || 0) + real) > 0.12) (s.hudT = 0), hud();
      return;
    }
    G3.update(real);
    riseUpdate(real);
    revealStep();
    Perf.lap("Google3D");
    // 影は2コマに1回だけ作り直す(見た目はほぼ同じで、描く量が減る)
    if (renderer.shadowMap.enabled) (renderer.shadowMap.autoUpdate = false), (renderer.shadowMap.needsUpdate = s.frameN % 2 === 0);
    renderer.render(scene, camera);
    Perf.lap("描く");
    autoRes(real);
    if ((s.hudT = (s.hudT || 0) + real) > 0.12) (s.hudT = 0), hud();
    Perf.lap("表示");
    Perf.loopMs = performance.now() - Perf.t0;
    if ((s.perfT = (s.perfT || 0) + real) > 1) (s.perfT = 0), perfHud();
  }
  // 性能の表示(左上のパネルの「性能を表示」)。カクつくときに、何が重いかを見る
  function perfHud() {
    const el = $("ct-perf");
    if (!el || el.hidden) return;
    const r = Perf.report(), inf = renderer.info.render;
    el.innerHTML = `<b>${r.fps.toFixed(0)}コマ/秒</b> 遅いコマ ${r.slow}/${r.n} ・最悪 ${r.worst.toFixed(0)}ms<br>描く量 ${(inf.triangles / 10000).toFixed(0)}万面・${inf.calls}回 ・細かさ×${renderer.getPixelRatio().toFixed(2)}${renderer.shadowMap.enabled ? "・影あり" : ""}<br>平均: ${r.avg.join(" / ")}<br>最悪: ${r.top.join(" / ")}`;
    if ((Perf.resetT = (Perf.resetT || 0) + 1) >= 10) (Perf.resetT = 0), (Perf.max = {}), (Perf.sum = {}), (Perf.n = 0);
  }

  function finish() {
    const s = sim;
    s.done = true;
    const v = Battle.verdict(Battle.state(s.ride));
    const first = s.along >= s.rAlong;
    const m = Math.floor(s.t / 60), sec = Math.floor(s.t % 60);
    banner(`ゴール ${m}分${sec}秒`, 4);
    $("ct-result").hidden = false;
    $("ct-result").innerHTML = `<div class="ct-res-box">
      <small>GOAL</small>
      <h2>${v.winner === "you" ? "デュエルに勝利" : v.winner === "opp" ? "デュエルに敗北" : "デュエルは引き分け"}</h2>
      <p>${first ? "ライバルより先にゴール" : "ライバルが先にゴール"} ・ ${m}分${sec}秒 ・ ${(route.length / 1000).toFixed(1)}km ・ 平均 ${((route.length / Math.max(1, s.t)) * KMH).toFixed(1)}km/h</p>
      <p>LP ${v.you} − ${v.opp}(${v.wins}勝 ${v.losses}敗 / ${v.turns}ターン)</p>
      <p>ライドの得点 ${Traffic.score().toLocaleString()} ・ 抜いた人 ${Traffic.passed()}</p>
      <button class="btn start" id="ct-again">もう一度</button> <a class="btn sub" href="index.html">アプリに戻る</a></div>`;
    $("ct-again").onclick = () => location.reload();
    Bgm.stop();
    say(v.winner === "you" ? "俺の勝ちだ。いいライディングだったぜ" : "次は必ず追い抜く");
  }

  // ---------- はじめの画面 ----------
  // 自宅: この端末にだけ保存(住所は公開のページに書かない)
  const homeOf = () => {
    try {
      return JSON.parse(localStorage.getItem("city_home") || "null");
    } catch (e) {
      return null;
    }
  };
  function placeOptions() {
    const list = STATIONS.slice();
    const home = homeOf();
    if (home && home.lat) list.unshift({ name: "🏠 自宅", lat: home.lat, lon: home.lon });
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
      msg.textContent = "坂(標高)を調べています…";
      try {
        await Terrain.prepare();
        msg.textContent = "信号を調べています…";
        await Signals.prepare();
      } catch (e) {}
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
    if ($("ct-sv0") && $("ct-sv0").checked && setSVfn) (starting = true), setSVfn(true);
    $("ct-auto").checked = sim.auto;
  }
  function bind() {
    // 出発・目的地の選択肢。前回選んだもの(なければ 出発=自宅か荻窪駅、目的地=池袋駅)
    const fill = () => {
      const list = placeOptions();
      let last = {};
      try {
        last = JSON.parse(localStorage.getItem("city_last") || "{}");
      } catch (e) {}
      const idx = (name, def) => {
        const i = list.findIndex((p) => p.name === name);
        return i >= 0 ? i : Math.max(0, list.findIndex((p) => p.name === def));
      };
      const opt = (sel) => list.map((p, i) => `<option value="${i}" ${i === sel ? "selected" : ""}>${esc(p.name)}</option>`).join("");
      $("ct-from").innerHTML = opt(idx(last.from, homeOf() ? "🏠 自宅" : "荻窪駅"));
      $("ct-to").innerHTML = opt(idx(last.to, "池袋駅"));
    };
    fill();
    const saveLast = () => {
      const list = placeOptions();
      try {
        localStorage.setItem("city_last", JSON.stringify({ from: (list[+$("ct-from").value] || {}).name, to: (list[+$("ct-to").value] || {}).name }));
      } catch (e) {}
    };
    $("ct-from").onchange = $("ct-to").onchange = saveLast;
    // 自宅の登録: 住所を国土地理院の住所検索で緯度経度にして、この端末に保存
    const hm = homeOf();
    $("ct-home-now").textContent = hm ? `登録済み: ${hm.label || ""}` : "未登録";
    $("ct-home-save").onclick = async () => {
      const q = $("ct-home").value.trim();
      if (!q) return;
      $("ct-home-now").textContent = "住所を調べています…";
      try {
        const res = await fetch("https://msearch.gsi.go.jp/address-search/AddressSearch?q=" + encodeURIComponent(q));
        const r = (await res.json())[0];
        if (!r) throw new Error("none");
        const [lon, lat] = r.geometry.coordinates;
        localStorage.setItem("city_home", JSON.stringify({ lat, lon, label: r.properties.title }));
        localStorage.setItem("city_last", JSON.stringify({ from: "🏠 自宅", to: (placeOptions()[+$("ct-to").value] || {}).name || "池袋駅" }));
        $("ct-home").value = "";
        $("ct-home-now").textContent = `登録済み: ${r.properties.title}`;
        fill();
      } catch (e) {
        $("ct-home-now").textContent = "住所が見つかりませんでした。番地まで入れてみてください";
      }
    };
    $("ct-go").onclick = () => (saveLast(), begin());
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
    const gu = G3.usage();
    if ($("ct-g3use")) $("ct-g3use").textContent = `この端末で使った回数: 今月 ${gu.n}/${gu.capM}回・今日 ${gu.dn}/${gu.capD}回${gu.over ? `(${gu.over}。Googleの3Dは止まります)` : ""}`;
    gk.onchange = () => {
      G3.setKey(gk.value);
      if (gk.value.trim()) setGoogle(true);
    };
    $("ct-google0").onchange = (e) => setGoogle(e.target.checked);
    $("ct-google").onchange = (e) => setGoogle(e.target.checked);
    // ストリートビュー
    const setSV = async (v) => {
      try {
        localStorage.setItem("city_sv", v ? "1" : "0");
      } catch (err) {}
      for (const id of ["ct-sv", "ct-sv0"]) if ($(id)) $(id).checked = v;
      if (!running && !starting) return; // スタート画面では、チェックを覚えるだけ
      if (v) {
        const ok = await SV.start();
        if (!ok) {
          for (const id of ["ct-sv", "ct-sv0"]) if ($(id)) $(id).checked = false;
          ticker("ストリートビュー: " + SV.err(), "opp");
        }
      } else SV.stop();
    };
    setSVfn = setSV;
    for (const id of ["ct-sv", "ct-sv0"]) if ($(id)) $(id).onchange = (e) => setSV(e.target.checked);
    try {
      if ($("ct-sv0")) $("ct-sv0").checked = localStorage.getItem("city_sv") === "1" && !!G3.getKey();
    } catch (err) {}
    const su = SV.usage();
    if ($("ct-svuse")) $("ct-svuse").textContent = `ストリートビューを開いた回数(この端末): 今月 ${su.n}/${su.capM}回・今日 ${su.dn}/${su.capD}回`;
    if ($("ct-perf0")) $("ct-perf0").onchange = (e) => ($("ct-perf").hidden = !e.target.checked);
    // すっきり表示: カードや記録の表示を隠して、景色を広く見る
    if ($("ct-clean")) {
      let cl = false;
      try {
        cl = localStorage.getItem("city_clean") === "1";
      } catch (err) {}
      $("ct-clean").checked = cl;
      $("ct-hud").classList.toggle("clean", cl);
      $("ct-clean").onchange = (e) => {
        $("ct-hud").classList.toggle("clean", e.target.checked);
        try {
          localStorage.setItem("city_clean", e.target.checked ? "1" : "0");
        } catch (err) {}
      };
    }
    if ($("ct-view-sel")) {
      $("ct-view-sel").value = viewMode;
      $("ct-view-sel").onchange = (e) => {
        viewMode = e.target.value;
        try {
          localStorage.setItem("city_view", viewMode);
        } catch (err) {}
      };
    }
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
    if ($("ct-tcr0")) {
      try {
        $("ct-tcr0").checked = localStorage.getItem("city_tcr2") === "1";
      } catch (e) {}
      $("ct-tcr0").onchange = (e) => {
        try {
          localStorage.setItem("city_tcr2", e.target.checked ? "1" : "0");
        } catch (er) {}
      };
    }
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
  return { at, turnAhead, readTile, _state: () => ({ sim, route, tiles, failed, camera, Plateau, Roads, scene, me, Traffic, Signals, renderer, Perf }), ride: (a) => Roads.ride(a) };
})();
