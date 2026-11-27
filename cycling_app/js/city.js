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

  // ---------- 組み立てた形の保存(建物・道) ----------
  // PLATEAU から組み立てた形(頂点の配列)は、ワーカー(plateau-worker.js)が端末(IndexedDB)に保存する。
  // 2回目からは保存を読むだけで、ダウンロード・展開・組み立てを飛ばす。版番号と上限はワーカー側(SHAPE_VER / SHAPE_MAX)。
  // 形は「どの道を走るか」で変わる(座標の原点、走る道に重なる建物の除外)ので、キーにルートの印を入れる。
  // Google のデータ(Googleの3D・ストリートビュー・写真の街)は、ここには一切入れない。
  const Saved = (() => {
    const stat = { bHit: 0, bNew: 0, rHit: 0, rNew: 0 };
    // 文字列の短い印(FNV-1a)
    const hash = (str) => {
      let h = 2166136261;
      for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
      return (h >>> 0).toString(36);
    };
    let sigR = null, sigP = null;
    // 座標の原点だけの印(道の形はこれだけで決まる)
    const proj = () => sigP || (sigP = hash([route.lat0, route.lon0, route.kx, route.kz].join(",")));
    // ルート全体の印(建物は、走る道に重なるものを外すので)
    const routeSig = () => sigR || (sigR = hash(proj() + ":" + route.xy.map((p) => p[0].toFixed(2) + "," + p[1].toFixed(2)).join(";")));
    function open() {
      return new Promise((res) => {
        try {
          const rq = indexedDB.open("cycling_city_shapes", 1);
          rq.onupgradeneeded = () => (rq.result.createObjectStore("data"), rq.result.createObjectStore("meta"));
          rq.onsuccess = () => res(rq.result);
          rq.onerror = rq.onblocked = () => res(null);
        } catch (e) {
          res(null);
        }
      });
    }
    // 保存してある形の合計(バイト)。わからなければ null
    async function size() {
      const d = await open();
      if (!d) return null;
      return new Promise((res) => {
        try {
          const rq = d.transaction("meta").objectStore("meta").getAll();
          rq.onsuccess = () => (d.close(), res(rq.result.reduce((a, m) => a + ((m && m.size) || 0), 0)));
          rq.onerror = () => (d.close(), res(null));
        } catch (e) {
          res(null);
        }
      });
    }
    // 保存を消す: 組み立てた形と、ダウンロードした元データ(PLATEAU・国土地理院・地図タイル)
    async function clear() {
      const d = await open();
      if (d)
        await new Promise((res) => {
          try {
            const tx = d.transaction(["data", "meta"], "readwrite");
            tx.objectStore("data").clear();
            tx.objectStore("meta").clear();
            tx.oncomplete = tx.onerror = tx.onabort = () => res();
          } catch (e) {
            res();
          }
        }).then(() => d.close());
      try {
        for (const n of ["city-plateau-v1", "city-roads-v1", "city-img-v1"]) await caches.delete(n);
      } catch (e) {}
      try {
        const t = await db();
        if (t) t.transaction("tiles", "readwrite").objectStore("tiles").clear();
      } catch (e) {}
    }
    return { stat, hash, proj, routeSig, size, clear };
  })();

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
            // 高さの段: 橋の印があるものだけ高架(印のない layer は、土手や踏切のある地上の線にも付いている)
            const lv = pr.brunnel === "bridge" ? Math.max(1, +pr.layer || 1) : 0;
            for (const rg of rings) {
              if (rg.length < 4) continue;
              const pts = [];
              for (let i = 0; i < rg.length; i += 2) pts.push(...toLL(rg[i], rg[i + 1]));
              out.r.push([-(++n), "rail", pts, 0, lv, 0]);
            }
          } else if (name === "transportation" && type === 2) {
            const kind = pr.class === "path" && pr.subclass === "cycleway" ? "cycleway" : CLASS[pr.class];
            if (!kind) continue;
            for (const rg of rings) {
              if (rg.length < 4) continue;
              const pts = [];
              for (let i = 0; i < rg.length; i += 2) pts.push(...toLL(rg[i], rg[i + 1]));
              // [4] 高さの段(橋=正・トンネル=負。屋内の通路は数えない) [5] 1=一方通行 2=出入口の道(ランプ) 4=掘割(屋根のない、掘り下げた道)
              // トンネルは、段が負と書いてあるものだけ(書いていないものは、建物の下の通り抜けや屋根つきの道が多い)
              // 橋でもトンネルでもないのに段が負の道は、掘割(交差点の下をくぐるアンダーパスの坂など)
              const cut = !pr.brunnel && !pr.indoor && +pr.layer < 0;
              const lv = pr.indoor ? 0 : pr.brunnel === "bridge" ? Math.max(1, +pr.layer || 1) : pr.brunnel === "tunnel" ? Math.min(0, +pr.layer || 0) : cut ? +pr.layer : 0;
              out.r.push([-(++n), kind, pts, pr.brunnel === "tunnel" ? 1 : 0, lv, (pr.oneway ? 1 : 0) | (pr.ramp ? 2 : 0) | (cut ? 4 : 0)]);
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
    const key = `v7:${Z}:${ix}:${iy}`;
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
    // mask: ガラスの場所(白)。空を映すのに使う
    let mask = null, kind = 0;
    const RES = 4;
    // ---- 細かい描きこみ(本物の建物らしく見せるための部品) ----
    // 窓: 枠・ガラスの上の影・カーテン・下の水切り(出っ張り)とその影
    const win = (w, x, y, ww, hh, o = {}) => {
      w.fillStyle = o.frame || "#c9c9c4";
      w.fillRect(x - 2.5, y - 2.5, ww + 5, hh + 5);
      glass(w, x, y, ww, hh, o.top || "#93a8ba", o.bot || "#2f3d4b");
      // カーテン(左右)やブラインド
      const sd = x * 7 + y * 13;
      if (o.blind) {
        if (hash(sd) < 0.6) {
          const bh = hh * (0.3 + hash(sd + 1) * 0.6);
          w.fillStyle = "rgba(236,234,226,0.9)";
          w.fillRect(x, y, ww, bh);
          w.fillStyle = "rgba(0,0,0,0.12)";
          for (let q = y; q < y + bh; q += 1.6) w.fillRect(x, q, ww, 0.5);
          if (mask) (mask.fillStyle = "#000"), mask.fillRect(x, y, ww, bh);
        }
      } else if (hash(sd) < 0.75) {
        const cw = ww * (0.14 + hash(sd + 2) * 0.22), col = ["rgba(240,236,226,0.92)", "rgba(226,214,196,0.92)", "rgba(206,218,226,0.92)", "rgba(232,222,226,0.92)"][Math.floor(hash(sd + 3) * 4)];
        for (const cx of hash(sd + 4) < 0.5 ? [x, x + ww - cw] : [x]) {
          w.fillStyle = col;
          w.fillRect(cx, y, cw, hh);
          w.fillStyle = "rgba(0,0,0,0.1)";
          for (let q = cx + 1; q < cx + cw; q += 2.2) w.fillRect(q, y, 0.5, hh);
          if (mask) (mask.fillStyle = "#000"), mask.fillRect(cx, y, cw, hh);
        }
      }
      // ガラスの上と左の影(窓が壁より奥にあるように見せる)
      let gr = w.createLinearGradient(0, y, 0, y + 7);
      gr.addColorStop(0, "rgba(0,0,0,0.5)");
      gr.addColorStop(1, "rgba(0,0,0,0)");
      w.fillStyle = gr;
      w.fillRect(x, y, ww, 7);
      gr = w.createLinearGradient(x, 0, x + 4, 0);
      gr.addColorStop(0, "rgba(0,0,0,0.35)");
      gr.addColorStop(1, "rgba(0,0,0,0)");
      w.fillStyle = gr;
      w.fillRect(x, y, 4, hh);
      // 真ん中の桟
      w.fillStyle = o.frame || "#d6d6d1";
      for (let q = 1; q < (o.panes || 2); q++) w.fillRect(x + (ww * q) / (o.panes || 2) - 0.8, y, 1.6, hh);
      // 水切りと、その下の影・雨だれ
      w.fillStyle = "#e4e4e0";
      w.fillRect(x - 4, y + hh + 2, ww + 8, 2.4);
      w.fillStyle = "rgba(0,0,0,0.22)";
      w.fillRect(x - 4, y + hh + 4.4, ww + 8, 1.6);
      for (let q = 0; q < 5; q++) {
        const sx = x + hash(sd + 20 + q) * ww, sl = 6 + hash(sd + 30 + q) * 16;
        const sg = w.createLinearGradient(0, y + hh + 6, 0, y + hh + 6 + sl);
        sg.addColorStop(0, "rgba(60,58,52,0.16)");
        sg.addColorStop(1, "rgba(60,58,52,0)");
        w.fillStyle = sg;
        w.fillRect(sx, y + hh + 6, 1 + hash(sd + 40 + q) * 1.5, sl);
      }
    };
    // 壁の汚れ・色むら(大きなしみ)と、雨どい
    const grime = (w, n, a = 0.05) => {
      for (let i = 0; i < n; i++) {
        const x = hash(i * 17 + 1) * S, y = hash(i * 23 + 2) * S, r = 14 + hash(i * 29) * 40;
        const g2 = w.createRadialGradient(x, y, 0, x, y, r);
        g2.addColorStop(0, hash(i * 31) < 0.6 ? `rgba(70,64,54,${a})` : `rgba(255,255,255,${a})`);
        g2.addColorStop(1, "rgba(0,0,0,0)");
        w.fillStyle = g2;
        for (const [ox, oy] of [[0, 0], [S, 0], [-S, 0], [0, S], [0, -S]]) w.fillRect(x - r + ox, y - r + oy, r * 2, r * 2);
      }
    };
    const pipe = (w, x) => {
      w.fillStyle = "rgba(0,0,0,0.18)";
      w.fillRect(x + 2.2, 0, 1.4, S);
      w.fillStyle = "#b9bab6";
      w.fillRect(x, 0, 2.4, S);
      w.fillStyle = "#8f908c";
      for (let y = 20; y < S; y += 64) w.fillRect(x - 0.8, y, 4, 1.6);
    };
    const lin = (cv) => {
      const t = new THREE.CanvasTexture(cv);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = 4;
      return t;
    };
    const mk = (draw) => {
      // 絵は4倍の細かさ(1024px)で描く。描くときの数字は、今までどおり256のマス目のまま
      const a = document.createElement("canvas"), b = document.createElement("canvas"), k = document.createElement("canvas");
      a.width = a.height = k.width = k.height = S * RES;
      b.width = b.height = S;
      const w = a.getContext("2d"), g = b.getContext("2d");
      mask = k.getContext("2d");
      w.scale(RES, RES);
      mask.scale(RES, RES);
      mask.fillStyle = "#000";
      mask.fillRect(0, 0, S, S);
      g.fillStyle = "#000";
      g.fillRect(0, 0, S, S);
      draw(w, g);
      // 窓ガラスには、まわりの景色が本当に映る(下の facMat で、ガラスの所だけ鏡のようにする)
      const mapT = tex(a);
      mapT.anisotropy = 8;
      const m = new THREE.MeshStandardMaterial({ map: mapT, emissiveMap: tex(b), emissive: 0xffffff, emissiveIntensity: 0, vertexColors: true, roughness: 0.92, metalness: 0, envMapIntensity: 1 });
      const gf = groundFloor(kind);
      m.userData.fac = { mask: lin(k), ground: tex(gf.cv), gmask: lin(gf.mk), gw: gf.gw, fw: [7, 7.2, 6, 7.2, 6, 7][kind] };
      kind++;
      return m;
    };
    const glass = (w, x, y, ww, hh, top, bot) => {
      const gr = w.createLinearGradient(0, y, 0, y + hh);
      gr.addColorStop(0, top);
      gr.addColorStop(1, bot);
      w.fillStyle = gr;
      w.fillRect(x, y, ww, hh);
      if (mask) (mask.fillStyle = "#fff"), mask.fillRect(x, y, ww, hh);
    };
    // 1階の絵(高さ3.2m)。玄関・窓・室外機、マンションの入口と郵便受け、店のガラスと看板・ひさし・自販機。
    // 横幅は 外壁の模様3〜4枚ぶん。st: 0=戸建て 1=マンション 2=店・オフィス
    function groundFloor(st) {
      const GW = [21, 21.6, 24, 21.6, 24, 21][st], W = 2048, Hh = 256, X = W / GW, Y = Hh / 3.2;
      const cv = document.createElement("canvas"), mkc = document.createElement("canvas");
      cv.width = mkc.width = W;
      cv.height = mkc.height = Hh;
      const c = cv.getContext("2d"), k = mkc.getContext("2d");
      k.fillStyle = "#000";
      k.fillRect(0, 0, W, Hh);
      // x・y(地面から)・幅・高さ は m
      const R = (x, y, w, h, col) => ((c.fillStyle = col), c.fillRect(x * X, Hh - (y + h) * Y, w * X, h * Y));
      const G = (x, y, w, h, top = "#8fa6ba", bot = "#2e3c4a") => {
        const gr = c.createLinearGradient(0, Hh - (y + h) * Y, 0, Hh - y * Y);
        gr.addColorStop(0, top);
        gr.addColorStop(1, bot);
        c.fillStyle = gr;
        c.fillRect(x * X, Hh - (y + h) * Y, w * X, h * Y);
        k.fillStyle = "#fff";
        k.fillRect(x * X, Hh - (y + h) * Y, w * X, h * Y);
      };
      const lines = (x, y, w, h, step, col, vert) => {
        c.fillStyle = col;
        if (vert) for (let q = x; q < x + w; q += step) c.fillRect(q * X, Hh - (y + h) * Y, 2, h * Y);
        else for (let q = y; q < y + h; q += step) c.fillRect(x * X, Hh - (q + 0.01) * Y, w * X, 2);
      };
      const acUnit = (x) => {
        R(x, 0.05, 0.8, 0.58, "#e4e4e0");
        R(x + 0.05, 0.12, 0.5, 0.44, "#b9bcbd");
        c.strokeStyle = "#8a8d8e";
        c.beginPath();
        c.arc((x + 0.3) * X, Hh - 0.34 * Y, 0.19 * Y, 0, 7);
        c.stroke();
      };
      const door = (x, w, h, col, glassTop) => {
        R(x - 0.06, 0, w + 0.12, h + 0.06, "#cfcfca");
        R(x, 0, w, h, col);
        if (glassTop) G(x + 0.12, h * 0.45, w - 0.24, h * 0.42);
        R(x + w - 0.16, h * 0.45, 0.05, 0.16, "#d8d8d0");
      };
      const vending = (x, col) => {
        R(x, 0, 0.95, 1.85, col);
        G(x + 0.08, 0.85, 0.79, 0.85, "#e8eef2", "#9aa8b2");
        for (let q = 0; q < 6; q++) R(x + 0.12 + q * 0.125, 1.0 + (q % 2) * 0.32, 0.08, 0.22, ["#d83a3a", "#2f7dd0", "#e8b020", "#3aa860", "#f0f0f0", "#7a4ab0"][q]);
        R(x + 0.1, 0.3, 0.75, 0.3, "#1c1e22");
      };
      // 文字(看板など。実在の店の名前は書かない)
      const TX = (text, x, y, size, col, bold = 900) => {
        c.fillStyle = col;
        c.font = `${bold} ${Math.round(size * Y)}px sans-serif`;
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(text, x * X, Hh - y * Y);
      };
      if (st === 3) {
        // タワーマンション: 石張りの腰、2層ぶんに見える大きなガラスのロビー、車寄せの庇、植え込み
        R(0, 0, GW, 3.2, "#5a5650");
        lines(0, 0, GW, 3.2, 0.6, "rgba(0,0,0,0.18)");
        lines(0, 0, GW, 3.2, 1.2, "rgba(0,0,0,0.14)", true);
        for (let n = 0; n < 3; n++) {
          const x0 = n * 7.2;
          if (n === 1) {
            G(x0 + 0.6, 0, 6.0, 2.9, "#c2d2de", "#33424f");
            for (const mx of [1.8, 3.0, 4.2, 5.4]) R(x0 + mx, 0, 0.05, 2.9, "#2a2d30");
            R(x0 + 2.7, 0, 1.8, 2.3, "rgba(255,240,210,0.35)"); // 明るいロビー
            R(x0 + 0.3, 2.9, 6.6, 0.2, "#2a2d30"); // 庇
            R(x0 + 3.2, 2.45, 0.8, 0.22, "#c9b27a"); // 館名板(文字なし)
          } else {
            G(x0 + 0.5, 0.9, 2.6, 1.7, "#b6c6d4", "#2f3d4a");
            G(x0 + 3.8, 0.9, 2.6, 1.7, "#b6c6d4", "#2f3d4a");
            R(x0 + 0.3, 0, 6.6, 0.55, "#3a4a34"); // 植え込み
            for (let q = 0; q < 26; q++) R(x0 + 0.35 + q * 0.25, 0.5, 0.18, 0.12 + (q % 3) * 0.06, q % 2 ? "#4a6a3c" : "#3c5a34");
          }
        }
      } else if (st === 4) {
        // 商業ビルの1階: 6mごとに、居酒屋(のれんと提灯)・フィットネスジム・カフェ・ドラッグストア風の店
        R(0, 0, GW, 3.2, "#cfcbc4");
        for (let n = 0; n < 4; n++) {
          const x0 = n * 6;
          R(x0, 0, 0.22, 3.2, "#8f8c86");
          if (n === 0) {
            R(x0 + 0.22, 0, 5.78, 3.2, "#3a2a1e"); // 木の壁
            lines(x0 + 0.22, 0, 5.78, 3.2, 0.22, "rgba(0,0,0,0.25)", true);
            R(x0 + 1.6, 0, 2.6, 2.2, "#1a1410"); // 入口
            for (let q = 0; q < 5; q++) R(x0 + 1.62 + q * 0.52, 1.55, 0.48, 0.65, "#1f3a6a"); // のれん
            TX("酒", x0 + 2.9, 1.88, 0.42, "#f4f0e6");
            c.fillStyle = "#d8362c";
            c.beginPath();
            c.ellipse((x0 + 0.95) * X, Hh - 1.7 * Y, 0.3 * X, 0.42 * Y, 0, 0, 7);
            c.fill(); // 提灯
            R(x0 + 4.6, 0.3, 0.9, 1.3, "#f0ead8"); // 品書き
            lines(x0 + 4.7, 0.5, 0.7, 1.0, 0.16, "#3a3a3a", true);
            R(x0 + 0.22, 2.55, 5.78, 0.5, "#241a12");
            TX("居酒屋", x0 + 3.1, 2.8, 0.34, "#f0d8a0");
          } else if (n === 1) {
            G(x0 + 0.22, 0.2, 5.78, 2.35, "#c8d8e4", "#3a4a58"); // 全面ガラス
            for (const mx of [1.6, 3.1, 4.6]) R(x0 + mx, 0.2, 0.05, 2.35, "#2a2d30");
            // 中に見える器具(ランニングマシンとバーベルのかげ)
            for (let q = 0; q < 3; q++) (R(x0 + 0.6 + q * 1.7, 0.35, 1.1, 0.12, "rgba(20,22,26,0.7)"), R(x0 + 0.65 + q * 1.7, 0.47, 0.08, 0.9, "rgba(20,22,26,0.7)"), R(x0 + 0.6 + q * 1.7, 1.3, 0.5, 0.3, "rgba(20,22,26,0.7)"));
            R(x0 + 0.22, 2.55, 5.78, 0.6, "#16181c");
            TX("FITNESS GYM", x0 + 3.1, 2.84, 0.36, "#f2c230");
            R(x0 + 0.22, 0, 5.78, 0.2, "#16181c");
          } else if (n === 2) {
            R(x0 + 0.22, 0, 5.78, 3.2, "#e9e2d2");
            G(x0 + 0.5, 0.9, 2.4, 1.5, "#bccad4", "#3d4a56");
            R(x0 + 3.4, 0, 1.0, 2.2, "#6a4a30");
            G(x0 + 3.55, 0.9, 0.7, 1.1);
            for (let q = 0; q < 10; q++) R(x0 + 0.3 + q * 0.56, 2.35, 0.56, 0.35, q % 2 ? "#2f6a3c" : "#f4efe6"); // しまの庇
            TX("CAFE", x0 + 3.0, 2.9, 0.34, "#3a2a1e");
            R(x0 + 4.9, 0, 0.7, 1.1, "#2a2d30"); // 立て看板
            R(x0 + 0.6, 0, 0.5, 0.5, "#8a623e"); // 鉢
            R(x0 + 0.55, 0.5, 0.6, 0.5, "#3c6a34");
          } else {
            G(x0 + 0.22, 0.3, 5.78, 2.25, "#eef2f4", "#aab8c0"); // 明るい店内
            for (let r = 0; r < 3; r++) for (let q = 0; q < 18; q++) R(x0 + 0.4 + q * 0.3, 0.5 + r * 0.6, 0.22, 0.42, ["#d8463a", "#3a7ad0", "#e8b82a", "#49a868", "#f0f0ea", "#e07a30"][(q + r * 2) % 6]);
            for (const mx of [2.0, 4.0]) R(x0 + mx, 0.3, 0.05, 2.25, "#5a5d60");
            R(x0 + 0.22, 2.55, 5.78, 0.6, "#d8402c");
            TX("ドラッグ", x0 + 3.1, 2.84, 0.36, "#fff");
            R(x0 + 0.22, 0, 5.78, 0.3, "#8a8d90");
          }
        }
        vending(17.0, "#f2f2ee");
      } else if (st === 0 || st === 5) {
        R(0, 0, GW, 3.2, st === 5 ? "#3a3c40" : "#f4f2ee");
        lines(0, 0, GW, 3.2, 0.2, "rgba(0,0,0,0.05)");
        R(0, 0, GW, 0.32, "#b9b7b2"); // 基礎
        for (let n = 0; n < 3; n++) {
          const x0 = n * 7;
          if (st === 5) R(x0 + [0.5, 4.1, 2.4][n], 0, 1.9, 3.2, "#8a623e"); // 黒い家: 玄関まわりは木の板
          door(x0 + [1.0, 4.6, 2.9][n], 0.9, 2.1, st === 5 ? ["#2a2018", "#1c1c1e", "#3a2a1e"][n] : ["#4a3426", "#27384a", "#5a5c5e"][n], n === 1);
          R(x0 + [1.0, 4.6, 2.9][n] - 0.2, 2.25, 1.3, 0.08, "#8f8d88"); // ひさし
          const wx = [3.4, 1.0, 5.0][n];
          R(wx + x0 - 0.08, 0.92, 1.76, 1.26, "#d6d6d1");
          G(x0 + wx, 1.0, 1.6, 1.1);
          R(x0 + wx + 0.78, 1.0, 0.04, 1.1, "#e9e9e6");
          if (n !== 1) lines(x0 + wx, 1.0, 1.6, 1.1, 0.14, "rgba(240,240,236,0.7)", true); // 面格子
          acUnit(x0 + [5.6, 3.0, 0.6][n]);
          R(x0 + [0.45, 6.1, 2.2][n], 1.0, 0.32, 0.42, "#9c2f2a"); // 郵便受け
          R(x0 + [6.6, 0.3, 6.5][n], 0.5, 0.25, 0.9, "#c9c9c4"); // メーター
        }
      } else if (st === 1) {
        R(0, 0, GW, 3.2, "#e9e7e1");
        R(0, 0, GW, 0.9, "#b7aea2"); // 腰のタイル
        lines(0, 0, GW, 0.9, 0.15, "rgba(0,0,0,0.12)");
        lines(0, 0, GW, 0.9, 0.3, "rgba(0,0,0,0.1)", true);
        R(0, 2.85, GW, 0.35, "#d4d1ca");
        for (let n = 0; n < 3; n++) {
          const x0 = n * 7.2;
          if (n === 1) {
            // 入口: ガラスの自動ドアと集合ポスト
            R(x0 + 1.2, 0, 4.4, 2.9, "#8f8a82");
            G(x0 + 1.5, 0, 2.2, 2.4, "#aebfcd", "#3a4a5a");
            R(x0 + 2.58, 0, 0.05, 2.4, "#3a3d40");
            R(x0 + 1.5, 2.4, 2.2, 0.3, "#2f3236");
            R(x0 + 4.0, 0.8, 1.3, 1.1, "#c9c9c6");
            lines(x0 + 4.0, 0.8, 1.3, 1.1, 0.22, "#8f8f8c");
            lines(x0 + 4.0, 0.8, 1.3, 1.1, 0.26, "#8f8f8c", true);
          } else {
            for (const dx of [0.8, 4.4]) {
              door(x0 + dx, 0.85, 2.0, "#cbb99a", false);
              R(x0 + dx + 0.3, 1.5, 0.25, 0.12, "#f2f2ee");
              R(x0 + dx + 1.2, 1.0, 1.3, 1.0, "#d2d2cd");
              G(x0 + dx + 1.27, 1.06, 1.16, 0.88);
              lines(x0 + dx + 1.27, 1.06, 1.16, 0.88, 0.13, "rgba(235,235,230,0.75)", true);
              R(x0 + dx + 2.7, 0.3, 0.3, 0.8, "#bdbdb8");
            }
          }
        }
      } else {
        R(0, 0, GW, 3.2, "#d9d9d6");
        const SIGN = ["#1f5fae", "#2f8a4e", "#b3261e", "#3a3a3a"], AWN = [null, ["#b3261e", "#f4efe6"], null, ["#2f6a3c", "#f4efe6"]];
        for (let n = 0; n < 4; n++) {
          const x0 = n * 6;
          R(x0, 2.55, 6, 0.65, SIGN[n]); // 看板の帯
          R(x0 + 0.5, 2.72, 2.6 + n * 0.5, 0.3, "rgba(255,255,255,0.92)"); // 文字のかわりの帯
          R(x0 + 4.4, 2.72, 0.9, 0.3, n % 2 ? "#f2c230" : "rgba(255,255,255,0.6)");
          R(x0, 0, 0.25, 2.55, "#b9b9b5");
          R(x0 + 5.75, 0, 0.25, 2.55, "#b9b9b5");
          if (n === 2) {
            // シャッターの閉まった店
            R(x0 + 0.25, 0, 5.5, 2.55, "#a9acae");
            lines(x0 + 0.25, 0, 5.5, 2.55, 0.11, "rgba(0,0,0,0.22)");
          } else {
            G(x0 + 0.25, 0.35, 5.5, 2.2, "#b6c8d6", "#2c3946");
            R(x0 + 0.25, 0, 5.5, 0.35, "#6a6d70");
            for (const mx of [1.6, 3.4, 4.6]) R(x0 + mx, 0, 0.06, 2.55, "#3a3d40");
            R(x0 + 3.46, 0, 1.14, 0.35, "#3a3d40"); // ドアの下
            if (n === 0) for (let q = 0; q < 3; q++) R(x0 + 0.35 + q * 0.42, 0.5, 0.36, 1.0, ["#e9e2d0", "#d8e2e8", "#e8d8d8"][q]); // 貼り紙
          }
          if (AWN[n]) {
            for (let q = 0; q < 12; q++) R(x0 + 0.1 + q * 0.483, 2.2, 0.49, 0.4, AWN[n][q % 2]);
            R(x0 + 0.1, 2.16, 5.8, 0.05, "rgba(0,0,0,0.35)");
          }
        }
        vending(5.0, "#f2f2ee");
        vending(11.2, "#c8262a");
        vending(12.25, "#2a5fb0");
      }
      return { cv, mk: mkc, gw: GW };
    }
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
        // サイディングの継ぎ目(縦)と、階のさかいの帯
        for (let x = 0; x < S; x += 36.5) (w.fillStyle = "rgba(0,0,0,0.07)"), w.fillRect(x, 0, 0.7, S);
        grime(w, 16);
        for (const fy of [0, 128]) {
          w.fillStyle = "rgba(0,0,0,0.1)";
          w.fillRect(0, fy + 125, S, 1.2);
          for (const [x, ww] of [[34, 74], [150, 56]]) {
            win(w, x, fy + 38, ww, 54, { panes: ww > 60 ? 2 : 2 });
            lit(g, x, fy + 38, ww, 54, x * 3 + fy);
          }
          // 換気口
          for (const vx of [18, 128]) {
            w.fillStyle = "#cfcfca";
            w.beginPath();
            w.arc(vx, fy + 24, 3.2, 0, 7);
            w.fill();
            w.fillStyle = "rgba(0,0,0,0.3)";
            w.fillRect(vx - 2.4, fy + 23.4, 4.8, 0.7);
            w.fillRect(vx - 2.4, fy + 25, 4.8, 0.7);
          }
        }
        pipe(w, 244);
      }),
      // マンション: 7.2m×2階(5.8m)。ベランダの手すりと掃き出し窓、住戸の仕切り
      mk((w, g) => {
        w.fillStyle = "#eeece6";
        w.fillRect(0, 0, S, S);
        grime(w, 14, 0.04);
        for (const fy of [0, 128]) {
          // ベランダの奥(暗いへこみ)と、掃き出し窓・室外機・物干し
          w.fillStyle = "rgba(0,0,0,0.16)";
          w.fillRect(8, fy + 4, 116, 110);
          w.fillRect(134, fy + 4, 122, 110);
          win(w, 14, fy + 20, 100, 70, { panes: 2, top: "#9db0c2", bot: "#34424f" });
          win(w, 142, fy + 20, 100, 70, { panes: 2, top: "#9db0c2", bot: "#34424f" });
          lit(g, 14, fy + 20, 100, 70, fy + 11);
          lit(g, 142, fy + 20, 100, 70, fy + 29);
          for (const ax of [98, 226]) {
            w.fillStyle = "#e2e2de";
            w.fillRect(ax, fy + 70, 20, 15);
            w.fillStyle = "#a9acad";
            w.beginPath();
            w.arc(ax + 7, fy + 77.5, 5, 0, 7);
            w.fill();
          }
          w.fillStyle = "#c8c8c4";
          w.fillRect(10, fy + 12, 112, 0.9);
          w.fillRect(136, fy + 12, 112, 0.9);
          // 上の階のベランダの床の影
          let sh = w.createLinearGradient(0, fy, 0, fy + 12);
          sh.addColorStop(0, "rgba(0,0,0,0.45)");
          sh.addColorStop(1, "rgba(0,0,0,0)");
          w.fillStyle = sh;
          w.fillRect(0, fy, S, 12);
          // 手すり(半透明のパネルと、上の笠木・たての柱)
          w.fillStyle = "rgba(150,158,166,0.9)";
          w.fillRect(0, fy + 84, S, 30);
          sh = w.createLinearGradient(0, fy + 84, 0, fy + 114);
          sh.addColorStop(0, "rgba(255,255,255,0.22)");
          sh.addColorStop(1, "rgba(0,0,0,0.12)");
          w.fillStyle = sh;
          w.fillRect(0, fy + 84, S, 30);
          w.fillStyle = "rgba(255,255,255,0.3)";
          for (let x = 4; x < S; x += 9) w.fillRect(x, fy + 86, 0.8, 27);
          w.fillStyle = "#eeeeea";
          w.fillRect(0, fy + 82.5, S, 2.2);
          w.fillStyle = "#dcdad4";
          w.fillRect(0, fy + 114, S, 14);
          w.fillStyle = "rgba(0,0,0,0.25)";
          w.fillRect(0, fy + 126.4, S, 1.6);
          for (let x = 30; x < S; x += 60) {
            const sg = w.createLinearGradient(0, fy + 116, 0, fy + 128);
            sg.addColorStop(0, "rgba(60,58,52,0.2)");
            sg.addColorStop(1, "rgba(60,58,52,0)");
            w.fillStyle = sg;
            w.fillRect(x + hash(x + fy) * 20, fy + 116, 1.6, 12);
          }
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
            // ブラインド(窓ごとに下ろし具合が違う)と、たての方立て・その影
            if (hash(x * 3 + fy) < 0.7) {
              const bh = 20 + hash(x + fy * 7) * 70;
              w.fillStyle = "rgba(232,232,226,0.55)";
              w.fillRect(x - 28, fy + 2, 60, bh);
              w.fillStyle = "rgba(0,0,0,0.08)";
              for (let q = fy + 2; q < fy + 2 + bh; q += 1.8) w.fillRect(x - 28, q, 60, 0.5);
            }
            w.fillStyle = "#4d565f";
            w.fillRect(x, fy, 4, 98);
            w.fillStyle = "rgba(255,255,255,0.35)";
            w.fillRect(x, fy, 0.8, 98);
            w.fillStyle = "rgba(0,0,0,0.25)";
            w.fillRect(x + 4, fy, 2, 98);
            w.fillStyle = "rgba(0,0,0,0.3)";
            w.fillRect(x - 30, fy + 48, 64, 1);
            lit(g, x - 26, fy + 6, 56, 88, x + fy * 5);
          }
          // 階のさかいの帯の影と目地
          w.fillStyle = "rgba(0,0,0,0.3)";
          w.fillRect(0, fy + 98, S, 2);
          w.fillStyle = "rgba(255,255,255,0.25)";
          w.fillRect(0, fy + 126.5, S, 1.5);
          for (let x = 0; x < S; x += 32) (w.fillStyle = "rgba(0,0,0,0.12)"), w.fillRect(x, fy + 100, 0.7, 28);
        }
      }),
      // タワーマンション: 7.2m×2階(6m)。暗い色の外壁、床から天井までのガラス、ガラスの手すりのバルコニー
      mk((w, g) => {
        w.fillStyle = "#6f7378";
        w.fillRect(0, 0, S, S);
        grime(w, 8, 0.03);
        for (const fy of [0, 128]) {
          glass(w, 10, fy + 10, 236, 104, "#a6bccd", "#2e3d4c");
          for (const x of [10, 70, 128, 186]) lit(g, x, fy + 12, 56, 100, x * 5 + fy);
          // カーテンと、室内の影
          for (let q = 0; q < 4; q++) {
            const x = 12 + q * 59;
            if (hash(q * 7 + fy) < 0.6) (w.fillStyle = ["rgba(236,232,222,0.85)", "rgba(210,216,222,0.85)", "rgba(226,214,200,0.85)"][Math.floor(hash(q + fy * 3) * 3)]), w.fillRect(x, fy + 10, 10 + hash(q * 13 + fy) * 18, 104);
          }
          w.fillStyle = "#3a3e44";
          for (const x of [68, 127, 186]) w.fillRect(x, fy + 10, 2.2, 104); // サッシ
          let sh = w.createLinearGradient(0, fy + 10, 0, fy + 24);
          sh.addColorStop(0, "rgba(0,0,0,0.5)");
          sh.addColorStop(1, "rgba(0,0,0,0)");
          w.fillStyle = sh;
          w.fillRect(10, fy + 10, 236, 14);
          // ガラスの手すり(うす青)と、上の笠木
          w.fillStyle = "rgba(170,205,225,0.42)";
          w.fillRect(0, fy + 74, S, 42);
          w.fillStyle = "rgba(255,255,255,0.5)";
          w.fillRect(0, fy + 73, S, 1.6);
          for (let x = 0; x < S; x += 42) (w.fillStyle = "rgba(60,66,72,0.8)"), w.fillRect(x, fy + 74, 1.2, 42);
          // 床の板(白い線)と影
          w.fillStyle = "#e6e6e2";
          w.fillRect(0, fy + 116, S, 9);
          w.fillStyle = "rgba(0,0,0,0.35)";
          w.fillRect(0, fy + 125, S, 3);
          w.fillStyle = "#7a7e84";
          w.fillRect(0, fy, 8, 128); // 柱(屋根の色にも使う)
        }
      }),
      // 商業ビル(雑居ビル): 6m×2階(7m)。タイルの壁、四角い窓、階ごとの看板の帯、そで看板
      mk((w, g) => {
        w.fillStyle = "#d6d0c4";
        w.fillRect(0, 0, S, S);
        for (let y = 0; y < S; y += 4) (w.fillStyle = "rgba(0,0,0,0.06)"), w.fillRect(0, y, S, 0.5);
        for (let x = 0; x < S; x += 8) (w.fillStyle = "rgba(0,0,0,0.045)"), w.fillRect(x, 0, 0.5, S);
        grime(w, 18, 0.06);
        const SG = ["#c8362c", "#1f5f9e", "#2f8a4e", "#e8a020", "#3a3a3a", "#7a3aa0"];
        for (const fy of [0, 128]) {
          for (const x of [14, 90, 166]) {
            win(w, x, fy + 34, 58, 50, { panes: 2, blind: true, top: "#9fb4c6", bot: "#33414f" });
            lit(g, x, fy + 34, 58, 50, x * 3 + fy);
            // 窓に貼った文字(店の案内)のかわりの色の帯
            if (hash(x + fy * 5) < 0.5) (w.fillStyle = SG[Math.floor(hash(x * 3 + fy) * 6)]), w.fillRect(x + 4, fy + 62, 50, 9);
          }
          // 階ごとの看板の帯
          const col = SG[Math.floor(hash(fy + 3) * 6)];
          w.fillStyle = col;
          w.fillRect(8, fy + 100, 226, 22);
          w.fillStyle = "rgba(255,255,255,0.9)";
          w.fillRect(20, fy + 106, 90 + hash(fy) * 70, 9);
          w.fillStyle = "rgba(0,0,0,0.3)";
          w.fillRect(8, fy + 122, 226, 2);
          // そで看板(たてに並ぶ色の板)
          w.fillStyle = "#2a2c30";
          w.fillRect(238, fy, 16, 128);
          for (let q = 0; q < 4; q++) (w.fillStyle = SG[Math.floor(hash(q * 5 + fy * 7) * 6)]), w.fillRect(240, fy + 4 + q * 31, 12, 27);
          for (let q = 0; q < 4; q++) lit(g, 240, fy + 4 + q * 31, 12, 27, q + fy);
        }
      }),
      // 戸建て(黒い外壁の今風の家): 7m×2階(6.4m)。たてのすじの金属の壁と、細長い窓
      mk((w, g) => {
        w.fillStyle = "#3c3e42";
        w.fillRect(0, 0, S, S);
        for (let x = 0; x < S; x += 6) (w.fillStyle = "rgba(255,255,255,0.05)"), w.fillRect(x, 0, 1, S), (w.fillStyle = "rgba(0,0,0,0.18)"), w.fillRect(x + 1, 0, 0.6, S);
        grime(w, 10, 0.04);
        for (const fy of [0, 128]) {
          win(w, 30, fy + 30, 26, 70, { panes: 1, frame: "#1c1d1f" });
          win(w, 110, fy + 44, 96, 34, { panes: 3, frame: "#1c1d1f" });
          lit(g, 30, fy + 30, 26, 70, fy + 1);
          lit(g, 110, fy + 44, 96, 34, fy + 9);
          w.fillStyle = "rgba(0,0,0,0.25)";
          w.fillRect(0, fy + 126, S, 1.4);
        }
        pipe(w, 246);
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
      area: Xing.holeMat(new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide })),
      pcol: new THREE.MeshLambertMaterial({ vertexColors: true }),
      fac: facadeMats(tex),
    };
  }

  // ---------- 1枚ぶんの街を作る ----------
  // 実物の建物: 読み込めたら、建物ごとに地面からばねのように立ち上がる(急にパッと出ない)。
  // anc = 建物の中心x・足もとy・中心z・出はじめる時刻(秒)。頂点シェーダーで高さを 0→1 に伸ばす
  // uG3: Googleの3Dと組み合わせるとき。自分の位置(x,z)と、きれいな建物を立てる範囲(ここまで全部 / ここから先は無し)。w=0 なら使わない
  const popU = { uPopT: { value: 0 }, uG3: { value: null }, uShops: { value: null } };
  // 道・木・電柱など: Googleの3Dと組み合わせるときは、近くだけ描く(遠くは Google の街にまかせる)
  const clipU = { uClip: { value: 1e9 } };
  function clipMat(m) {
    if (!m || !(m.isMeshLambertMaterial || m.isMeshStandardMaterial) || m.onBeforeCompile !== T().Material.prototype.onBeforeCompile) return m;
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uClip = clipU.uClip;
      sh.fragmentShader = "uniform float uClip;\n" + sh.fragmentShader.replace("#include <clipping_planes_fragment>", "if (length(vViewPosition) > uClip) discard;\n#include <clipping_planes_fragment>");
    };
    m.customProgramCacheKey = () => "clip";
    return m;
  }
  function popMat(m, photo) {
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uPopT = popU.uPopT;
      if (!popU.uG3.value) popU.uG3.value = new (T().Vector4)(0, 0, 0, 0);
      sh.uniforms.uG3 = popU.uG3;
      sh.uniforms.uShops = popU.uShops;
      sh.vertexShader = "attribute vec4 anc;\nuniform float uPopT;\nuniform vec4 uG3;\nuniform vec3 uShops[16];\n" + sh.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
        float popT = clamp((uPopT - anc.w) / 0.95, 0.0, 1.0);
        float popK = popT >= 1.0 ? 1.0 : (popT <= 0.0 ? 0.0 : 1.0 - exp(-6.0 * popT) * cos(8.0 * popT));
        // Googleの3Dと組み合わせるとき: 建物ごとに、近くのものだけ立てる
        if (uG3.w > 0.0) popK *= 1.0 - smoothstep(uG3.z, uG3.w, distance(anc.xz, uG3.xy));
        // 店や施設を専用の形で建てた場所では、もとの建物(その敷地に中心があるもの)は出さない
        for (int si = 0; si < 16; si++) if (uShops[si].z > 0.0 && distance(anc.xz, uShops[si].xy) < uShops[si].z) popK = 0.0;
        transformed.y = anc.y + (transformed.y - anc.y) * popK - (1.0 - min(popK, 1.0)) * 1.5;`);
      // 壁の写真は暗く写っていることが多いので、少し明るく起こす
      if (photo) sh.fragmentShader = sh.fragmentShader.replace("#include <map_fragment>", "#include <map_fragment>\n diffuseColor.rgb = pow(diffuseColor.rgb, vec3(0.78)) * 1.12;");
    };
    m.customProgramCacheKey = () => "pop4" + (photo ? 1 : 0);
    return m;
  }
  // 外壁の材質: 1階には専用の絵(入口・店)を貼り、窓ガラスには空を映す(見る角度が浅いほど強く映る)
  const facU = { uZen: { value: null }, uHor: { value: null }, uRefl: { value: 1 } };
  function facMat(m) {
    const THREE = T(), f = m.userData.fac;
    if (!facU.uZen.value) (facU.uZen.value = new THREE.Color(0x3f7fd0)), (facU.uHor.value = new THREE.Color(0xd6e4f0));
    popMat(m);
    const pop = m.onBeforeCompile;
    m.onBeforeCompile = (sh) => {
      pop(sh);
      Object.assign(sh.uniforms, { uMask: { value: f.mask }, uGround: { value: f.ground }, uGMask: { value: f.gmask }, uGk: { value: f.fw / f.gw }, uZen: facU.uZen, uHor: facU.uHor, uRefl: facU.uRefl });
      sh.vertexShader = "varying float vFh;\nvarying float vWall;\n" + sh.vertexShader.replace("#include <begin_vertex>", "vFh = position.y - anc.y;\n vWall = step(abs(normal.y), 0.5);\n#include <begin_vertex>");
      sh.fragmentShader = "varying float vFh;\nvarying float vWall;\nuniform sampler2D uMask;\nuniform sampler2D uGround;\nuniform sampler2D uGMask;\nuniform float uGk;\nuniform float uRefl;\nuniform vec3 uZen;\nuniform vec3 uHor;\n" +
        sh.fragmentShader
          .replace("#include <map_fragment>", `#include <map_fragment>
        float facGlass = 0.0;
        #ifdef USE_MAP
          if (vUv.x < -0.5) {
            // 出っ張り(ベランダ・庇・看板・屋上の機械): 外壁の絵は貼らず、色だけ。-2 はガラス
            diffuseColor.rgb = diffuse;
            facGlass = vUv.x < -1.5 ? 0.75 : 0.0;
          } else if (vWall > 0.5) {
            facGlass = texture2D(uMask, vUv).r;
            if (vFh < 3.2) {
              vec2 guv = vec2(vUv.x * uGk, clamp(vFh / 3.2, 0.004, 0.996));
              diffuseColor.rgb = diffuse * texture2D(uGround, guv).rgb;
              facGlass = texture2D(uGMask, guv).r;
            }
          }
        #endif`)
          .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
        if ((vWall > 0.5 && vFh < 3.2) || vUv.x < -0.5) totalEmissiveRadiance *= 0.0;`)
          // ガラスの所: つるつるで、鏡に近い(まわりの景色が映る)。色も暗いガラスの色にする
          .replace("#include <metalnessmap_fragment>", `#include <metalnessmap_fragment>
        // 地面の近くは、はね返りの汚れで少し暗く
        if (vWall > 0.5 && vUv.x > -0.5) diffuseColor.rgb *= 0.86 + 0.14 * smoothstep(0.0, 1.8, vFh);
        roughnessFactor = mix(roughnessFactor, 0.05, facGlass);
        metalnessFactor = mix(metalnessFactor, 0.92 * uRefl, facGlass);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.52, 0.6, 0.68), facGlass * 0.7);`);
    };
    m.customProgramCacheKey = () => "fac5";
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
  async function buildTile(data, ix, iy) {
    const THREE = T();
    const group = new THREE.Group();
    const rest = slicer(5);
    // 高架(橋の線)は、桁や橋脚のある形にする。地面の道としては描かない
    let xp = null;
    try {
      xp = Xing.plan(data, ix, iy, false, 0);
      const xm = Xing.build(xp);
      if (xm) group.add(xm);
    } catch (e) {
      console.error(e);
      xp = null;
    }
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
      for (let ri = 0; ri < data.r.length; ri++) {
        const [id, kind, ll, tunnel] = data.r[ri];
        await rest();
        if (tunnel || (xp && xp.elev.has(ri))) continue;
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
          // 掘り下げた所(アンダーパス)には描かない。線路だけは、ふたの上をもとの地面の高さで渡る
          const zn = Xing.any() ? Xing.zone((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) : 0;
          if (zn && !(rail && zn === 2)) continue;
          for (const [x, z, u, v] of q) {
            pos.push(x, y + Terrain.h0(x, z), z);
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
            pos.push(pts[i][0], y + Terrain.h0(pts[i][0], pts[i][1]), pts[i][1]);
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
    // 店や施設(コンビニ・スーパー・ガソリンスタンド・交番・郵便局・銀行)は、種類ごとの形で道ぞいに建てる
    for (const [nm0, cls, sub, la, lo] of data.poi || []) {
      const kind = Shops.kindOf(cls, sub);
      if (!kind) continue;
      const q = project(la, lo), d = routeDist(q);
      if (d > 45) continue;
      const key = kind + ":" + Math.round(q[0] / 12) + ":" + Math.round(q[1] / 12);
      if (Shops.seen.has(key)) continue;
      Shops.seen.add(key);
      await rest();
      try {
        const o = Shops.place(kind, q, d.along, nm0);
        if (o) group.add(o);
      } catch (e) {
        console.error(e);
      }
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
  // ---------- 店や施設の形 ----------
  // 実在のチェーンの名前・ロゴ・配色は使わない(色の帯と、種類を表すふつうの言葉だけ)
  const Shops = (() => {
    const seen = new Set(), all = []; // all: [敷地の中心x, z, 半径]
    let M = null;
    // 自分に近い16か所を、建物を消す場所として渡す
    function update(px, pz) {
      const THREE = T();
      if (!popU.uShops.value) popU.uShops.value = Array.from({ length: 16 }, () => new THREE.Vector3());
      const near = all.map((a) => [a, (a[0] - px) ** 2 + (a[1] - pz) ** 2]).sort((a, b) => a[1] - b[1]).slice(0, 16);
      popU.uShops.value.forEach((v, i) => (near[i] ? v.set(near[i][0][0], near[i][0][1], near[i][0][2]) : v.set(0, 0, 0)));
    }
    function kindOf(cls, sub) {
      if (sub === "convenience") return "conv";
      if (sub === "supermarket") return "super";
      if (cls === "fuel" || sub === "fuel") return "gas";
      if (cls === "police" || sub === "police") return "koban";
      if (cls === "post" || sub === "post_office") return "post";
      if (cls === "bank" || sub === "bank") return "bank";
      return null;
    }
    function mats() {
      if (M) return M;
      const THREE = T();
      const L = (c, o) => new THREE.MeshLambertMaterial(Object.assign({ color: c }, o || {}));
      // 看板の帯: 地の色・線の色・文字
      const sign = (bg, line, text, fg = "#fff", w = 512, h = 96) => {
        const cv = document.createElement("canvas");
        cv.width = w;
        cv.height = h;
        const c = cv.getContext("2d");
        c.fillStyle = bg;
        c.fillRect(0, 0, w, h);
        c.fillStyle = line;
        c.fillRect(0, h * 0.78, w, h * 0.1);
        c.fillStyle = fg;
        c.font = `900 ${Math.round(h * 0.52)}px sans-serif`;
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(text, w / 2, h * 0.42);
        const t = new THREE.CanvasTexture(cv);
        t.encoding = THREE.sRGBEncoding;
        t.anisotropy = 8;
        return new THREE.MeshBasicMaterial({ map: t });
      };
      // 店の中(棚と明かり)が見えるガラス
      const inside = (() => {
        const cv = document.createElement("canvas");
        cv.width = 512;
        cv.height = 128;
        const c = cv.getContext("2d");
        const g = c.createLinearGradient(0, 0, 0, 128);
        g.addColorStop(0, "#f4f6f2");
        g.addColorStop(1, "#b9c2c4");
        c.fillStyle = g;
        c.fillRect(0, 0, 512, 128);
        for (let x = 0; x < 512; x += 64) {
          c.fillStyle = "#e9e6dc";
          c.fillRect(x + 6, 40, 52, 80);
          for (let r = 0; r < 4; r++) for (let q = 0; q < 6; q++) ((c.fillStyle = ["#d8463a", "#3a7ad0", "#e8b82a", "#49a868", "#f0f0ea", "#8a55b8", "#e07a30"][(q + r * 2 + x) % 7]), c.fillRect(x + 9 + q * 8, 44 + r * 19, 6, 14));
        }
        c.fillStyle = "#fff";
        for (let x = 20; x < 512; x += 90) c.fillRect(x, 8, 56, 6); // 天井の明かり
        c.fillStyle = "rgba(180,205,225,0.28)";
        c.fillRect(0, 0, 512, 128);
        c.fillStyle = "#4a4e52";
        for (let x = 0; x <= 512; x += 128) c.fillRect(x - 2, 0, 4, 128); // サッシ
        const t = new THREE.CanvasTexture(cv);
        t.encoding = THREE.sRGBEncoding;
        t.wrapS = THREE.RepeatWrapping;
        return new THREE.MeshBasicMaterial({ map: t });
      })();
      M = {
        wall: L(0xeeede8), dark: L(0x3c4046), grey: L(0x9a9da0), white: L(0xfafaf8), asph: L(0x55585c), line: L(0xf2f2ee), red: new THREE.MeshBasicMaterial({ color: 0xff3828 }), gold: L(0xc9a23a), pump: L(0xd8dadc), glass: new THREE.MeshStandardMaterial({ color: 0x7f97aa, metalness: 0.85, roughness: 0.08 }), inside,
        conv: sign("#5b3fa8", "#f2c230", "コンビニ  24"), convA: sign("#1c2c58", "#d8b040", "コンビニ  A"), convC: sign("#1f5a3c", "#ffffff", "コンビニ  C"), convD: sign("#6a4a30", "#f0e0c0", "コンビニ"),
        poleA: sign("#1c2c58", "#d8b040", "A", "#fff", 128, 128), poleCc: sign("#1f5a3c", "#ffffff", "C", "#fff", 128, 128), poleD: sign("#6a4a30", "#f0e0c0", "24", "#fff", 128, 128), wood: L(0x7a5a3a), sup: sign("#c8362c", "#ffffff", "スーパーマーケット"), gas: sign("#1c8c8a", "#ffffff", "GS  セルフ"), koban: sign("#f4f4f0", "#2c4a8c", "交番  KOBAN", "#1c2c58"), post: sign("#d8402c", "#ffffff", "〒  郵便局"), bank: sign("#1f5f9e", "#d8c070", "銀行  ATM"),
        poleC: sign("#5b3fa8", "#f2c230", "24", "#fff", 128, 128), poleG: sign("#1c8c8a", "#ffffff", "GS", "#fff", 128, 128), poleS: sign("#c8362c", "#ffffff", "P", "#fff", 128, 128),
      };
      return M;
    }
    // 道のどちら側か・道のふちまでの距離から、建てる場所と向きを決める
    function place(kind, q, along, name = "") {
      const THREE = T(), m = mats();
      const p = at(along), r = Roads.ride(along);
      const side = (q[0] - p.x) * p.tz - (q[1] - p.z) * p.tx > 0 ? 1 : -1; // +1 = 進む向きの左
      const W = r ? r.W : 6, left = r ? r.off + 0.9 : 3, edge = (side > 0 ? left : Math.max(1.5, W - left)) + 2.2; // 車道のふち + 歩道
      const nx = p.tz * side, nz = -p.tx * side; // 道から外へ
      const g = new THREE.Group();
      const add = (geo, mat, x, y, z, ry = 0, par = g) => {
        const o = new THREE.Mesh(geo, mat);
        o.position.set(x, y, z);
        o.rotation.y = ry;
        o.castShadow = o.receiveShadow = true;
        par.add(o);
        return o;
      };
      const B = (w, h, d) => new THREE.BoxGeometry(w, h, d);
      const C = (r0, h, n = 10) => new THREE.CylinderGeometry(r0, r0, h, n);
      // 店の箱: 正面(+z)にガラス、上に看板の帯。w 幅・d 奥行き・h 高さ・gh ガラスの高さ
      const shop = (w, d, h, sg, gh = 2.5, lot = 0) => {
        add(B(w, h, d), m.wall, 0, h / 2, -lot - d / 2);
        add(B(w + 0.1, 0.25, d + 0.1), m.grey, 0, h + 0.12, -lot - d / 2); // 屋根のふち
        add(new THREE.PlaneGeometry(w - 0.6, gh), m.inside, 0, 0.35 + gh / 2, -lot + 0.02).material.map.repeat.set(Math.max(1, Math.round(w / 7)), 1);
        add(B(w - 0.6, 0.35, 0.08), m.grey, 0, 0.17, -lot + 0.03); // 腰
        add(B(w + 0.3, 0.85, 0.3), sg, 0, 0.35 + gh + 0.5, -lot + 0.1); // 看板の帯
        add(B(1.9, gh, 0.06), m.glass, w * 0.18, 0.35 + gh / 2, -lot + 0.05); // 自動ドア
        add(B(0.05, gh, 0.08), m.dark, w * 0.18, 0.35 + gh / 2, -lot + 0.07);
        add(B(2.4, 0.03, 1.2), m.dark, w * 0.18, 0.02, -lot + 0.65); // 入口のマット
      };
      const poleSign = (x, z, mat, hgt = 6) => {
        add(C(0.09, hgt), m.grey, x, hgt / 2, z);
        add(B(1.5, 1.5, 0.22), mat, x, hgt - 0.2, z);
      };
      const lot = (w, d, n) => {
        // 駐車場: アスファルトと白線・車止め
        add(B(w, 0.04, d), m.asph, 0, 0.02, -d / 2);
        for (let k = 0; k <= n; k++) add(B(0.1, 0.05, d * 0.62), m.line, -w / 2 + 0.6 + (k * (w - 1.2)) / n, 0.03, -d * 0.58);
        for (let k = 0; k < n; k++) add(B(1.4, 0.12, 0.14), m.white, -w / 2 + 0.6 + ((k + 0.5) * (w - 1.2)) / n, 0.08, -d + 0.5);
      };
      let depth = 0;
      if (kind === "conv") {
        // チェーンごとに、ちがう見た目にする(3つの大きなチェーンと、それ以外)。実在の看板やロゴ・色づかいは使わず、
        // このアプリだけの色と形で区別する: A=紺に金の線・角ばった庇 / B=紫に黄の線 / C=深緑に白の線・丸い柱 / ほか=茶
        const v = /セブン|7-?eleven|seven/i.test(name) ? 0 : /ファミリーマート|family ?mart/i.test(name) ? 1 : /ローソン|lawson/i.test(name) ? 2 : 3;
        const sg = [m.convA, m.conv, m.convC, m.convD][v], pl = [m.poleA, m.poleC, m.poleCc, m.poleD][v];
        lot(14, 6.5, 4);
        shop(14, 9, 3.6, sg, 2.5, 6.5);
        if (v === 0) add(B(14.6, 0.14, 1.3), m.dark, 0, 2.95, -5.9); // A: 平らな庇
        if (v === 2) for (const px of [-6.6, 6.6]) add(C(0.16, 3.6), m.white, px, 1.8, -6.3); // C: 丸い柱
        if (v === 3) add(B(14.2, 0.5, 0.2), m.wood, 0, 2.6, -6.38); // ほか: 木の帯
        add(B(0.7, 1.0, 0.6), m.dark, -5.2, 0.5, -5.9); // ごみ箱
        add(B(0.7, 1.0, 0.6), m.grey, -4.4, 0.5, -5.9);
        add(B(1.2, 1.6, 0.5), m.white, 5.4, 0.8, -6.1); // のぼり・ATMの案内
        poleSign(6.3, -0.6, pl);
        depth = 15.5;
      } else if (kind === "super") {
        lot(24, 8, 8);
        shop(24, 16, 7, m.sup, 3.2, 8);
        add(B(10, 0.25, 3), m.grey, 4, 3.9, -6.6); // 入口の庇
        for (const x of [-0.6, 8.6]) add(C(0.1, 3.9), m.grey, x, 1.95, -5.3);
        for (let k = 0; k < 6; k++) add(B(0.06, 0.9, 1.4), m.grey, -9 + k * 0.7, 0.45, -7.2); // 駐輪場のラック
        for (let k = 0; k < 4; k++) add(B(0.6, 0.9, 0.9), m.pump, 9.5, 0.45, -7.4 + k * 0.0 - k * 0.001, 0); // カート置き場
        poleSign(11, -0.6, m.poleS, 7);
        depth = 24;
      } else if (kind === "gas") {
        add(B(22, 0.04, 14), m.asph, 0, 0.02, -7);
        add(B(16, 0.5, 9), m.white, 0, 5.2, -6); // 大きな屋根(キャノピー)
        add(B(16.1, 0.75, 0.12), m.gas, 0, 5.2, -1.48);
        for (const [x, z] of [[-6, -3], [6, -3], [-6, -9], [6, -9]]) add(C(0.22, 5), m.grey, x, 2.5, z);
        for (const x of [-4, 0, 4]) {
          add(B(2.6, 0.18, 1.1), m.grey, x, 0.09, -6); // 給油機の島
          add(B(0.9, 1.7, 0.6), m.pump, x, 1.0, -6);
          add(B(0.7, 0.45, 0.62), m.dark, x, 1.5, -6);
          add(B(0.92, 0.25, 0.62), m.gas, x, 1.98, -6);
        }
        shop(8, 5, 3.2, m.gas, 2.2, 12.5);
        poleSign(-10, -0.8, m.poleG, 7);
        depth = 17.5;
      } else if (kind === "koban") {
        add(B(5, 3.4, 4.5), m.wall, 0, 1.7, -2.25);
        add(B(5.6, 0.22, 5.6), m.grey, 0, 3.5, -2.0); // ひさし
        add(new THREE.PlaneGeometry(2.6, 2.0), m.glass, 0.7, 1.45, 0.02);
        add(B(1.0, 2.2, 0.06), m.dark, -1.5, 1.1, 0.03); // 戸
        add(B(3.6, 0.6, 0.12), m.koban, 0, 3.05, 0.08);
        add(new THREE.SphereGeometry(0.2, 12, 10), m.red, 0, 3.95, 0.6); // 赤い灯
        add(C(0.05, 0.4), m.grey, 0, 3.75, 0.6);
        add(C(0.18, 0.04, 16), m.gold, -1.5, 2.6, 0.06).rotation.x = Math.PI / 2; // 記章(ただの丸)
        add(B(1.6, 1.2, 0.1), m.white, 3.4, 1.3, -0.3); // 掲示板
        for (const x of [2.7, 4.1]) add(C(0.04, 1.9), m.grey, x, 0.95, -0.3);
        depth = 4.5;
      } else {
        const pm = kind === "post";
        shop(pm ? 9 : 11, 8, pm ? 3.8 : 6.5, pm ? m.post : m.bank, 2.4, 0);
        if (pm) {
          add(B(0.5, 1.1, 0.45), m.red, -3.6, 0.75, 0.9); // ポスト
          add(C(0.06, 0.4), m.grey, -3.6, 0.2, 0.9);
        } else add(B(2.2, 2.3, 0.1), m.dark, -3.8, 1.5, 0.06); // ATMコーナー
        depth = 8;
      }
      // 置く: 正面(+z)を道へ向ける。道のふちから少し下げて、地面の高さに
      const x = p.x + nx * edge, z = p.z + nz * edge;
      g.position.set(x, H(x, z) + 0.05, z);
      g.rotation.y = Math.atan2(-nx, -nz);
      g.userData.shop = kind;
      all.push([x + nx * depth * 0.5, z + nz * depth * 0.5, depth * 0.5 + 3]);
      return g;
    }
    return { kindOf, place, seen, update };
  })();

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
    let keyBase = ""; // 保存のキーの頭(ルートの印と、ワーカーに渡した設定)
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
      const cfg = { clear: CLEAR, texMax: innerWidth < 900 ? 2048 : 4096, terrain: Terrain.ok() };
      // 形はこの設定でも変わるので、保存のキーに入れる
      keyBase = ["b", Saved.routeSig(), cfg.clear, cfg.texMax, cfg.terrain ? 1 : 0].join("|");
      worker.postMessage(Object.assign({ type: "init", route: { xy: route.xy, lat0: route.lat0, lon0: route.lon0, kx: route.kx, kz: route.kz } }, cfg));
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
      // Googleの3Dと組み合わせるときは、きれいな建物を遠く(約650m)まで立てるので、先まで読む
      const ahead = Math.min(3000, Math.max(typeof G3 !== "undefined" && G3.on() ? 800 : 500, (sim ? sim.v * sim.speedX : 7) * 20));
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
        // 保存してある形があれば、それを読むだけ(ダウンロードも組み立ても飛ばす)
        const skey = keyBase + "|" + L.url;
        const ask = (msg, tr) =>
          new Promise((res) => {
            const id = Math.random();
            waiting.set(id, res);
            worker.postMessage(Object.assign(msg, { id }), tr || []);
          });
        const lt0 = performance.now();
        let d = await ask({ type: "load", kind: "tile", key: skey });
        if (!d || d.miss || d.error || !d.groups) {
          const buf = await cached(L.url, "bin");
          d = await ask({ type: "tile", buf, key: skey }, [buf]);
        }
        if (d.error) throw new Error(d.error);
        d.saved ? Saved.stat.bHit++ : Saved.stat.bNew++;
        Perf.span(d.saved ? "建物を読む(保存)" : "建物を組み立てる", performance.now() - lt0);
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
  // 画像(地面の航空写真・標高)を、端末に保存して使い回す。同じ道を走るときは、2回目から通信しない。
  // 戻り値: 画像に使えるURL(保存してあるものは端末の中のURL)。無い画像だとわかっているものは null。保存できない端末では、もとのURL
  const savedMiss = new Set();
  async function savedImg(url) {
    if (savedMiss.has(url)) return null;
    try {
      const c = await caches.open("city-img-v1");
      let hit = await c.match(url);
      if (!hit) {
        const res = await fetch(url, { mode: "cors" });
        if (res.status === 404) return savedMiss.add(url), c.put(url, new Response("", { status: 200, headers: { "x-miss": "1" } })).catch(() => {}), null;
        if (!res.ok) return url;
        c.put(url, res.clone()).catch(() => {});
        hit = res;
      }
      if (hit.headers.get("x-miss")) return savedMiss.add(url), null;
      return URL.createObjectURL(await hit.blob());
    } catch (e) {
      return url;
    }
  }
  const savedDone = (src) => src && src.startsWith("blob:") && URL.revokeObjectURL(src);
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
    const loadImg = async (url) => {
      const src = await savedImg(url);
      if (!src) return null; // 前に「無い」とわかった所
      return new Promise((res) => {
        const im = new Image();
        im.crossOrigin = "anonymous";
        im.onload = () => (savedDone(src), res(im));
        im.onerror = () => (savedDone(src), res(null));
        im.src = src;
      });
    };
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
      // 橋や水路: 標高のデータは川底の高さなので、道が急に落ちこむ。幅60mまでのくぼみは、前後の高さでならして埋める
      const fill = raw.slice();
      for (let i = 0; i < n; i++) for (const k of [2, 3]) if (i - k >= 0 && i + k < n) fill[i] = Math.max(fill[i], (raw[i - k] + raw[i + k]) / 2);
      prof = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        let sum = 0, k = 0;
        for (let j = Math.max(0, i - 3); j <= Math.min(n - 1, i + 3); j++) (sum += fill[j]), k++;
        prof[i] = sum / k;
      }
      // ルートの点を、48mのマス目に入れておく(近くの点をすぐ探せるように)
      pts = [];
      grid = new Map();
      for (let i = 0; i < n; i++) {
        const p = at(i * 10);
        pts.push(p.x, p.z);
        const key = Math.floor(p.x / CELL) + ":" + Math.floor(p.z / CELL);
        let a = grid.get(key);
        if (!a) grid.set(key, (a = []));
        a.push(i);
      }
    }
    // ルートのそば(走る道とそのまわり)の高さ。道にそって、なめらかな1本の坂にする。
    // 標高のデータ(約4mの目)をそのまま使うと、細かいでこぼこや川のくぼみで、道の面と自転車の高さがずれて、道に埋もれて見える。
    // 戻り値: [ルートからの距離, 高さ]。45mより遠ければ null
    const CELL = 48;
    let pts = [], grid = null;
    const seg = [0, 0, 0, 0]; // [距離, 高さ, 道のり, 横の位置(左が正)]
    function corridor(x, z) {
      if (!grid) return null;
      const cx = Math.floor(x / CELL), cz = Math.floor(z / CELL);
      let best = 2025, bi = -1;
      for (let dx = -1; dx <= 1; dx++)
        for (let dz = -1; dz <= 1; dz++) {
          const a = grid.get(cx + dx + ":" + (cz + dz));
          if (!a) continue;
          for (let k = 0; k < a.length; k++) {
            const i = a[k], d = (pts[i * 2] - x) ** 2 + (pts[i * 2 + 1] - z) ** 2;
            if (d < best) (best = d), (bi = i);
          }
        }
      if (bi < 0) return null;
      // いちばん近い点の前後の線分に下ろして、距離と高さを細かく出す
      let bd = best, bh = prof[bi], ba = bi * 10, bl = 0;
      for (const j of [bi - 1, bi]) {
        if (j < 0 || j + 1 >= prof.length) continue;
        const ax = pts[j * 2], az = pts[j * 2 + 1], ex = pts[j * 2 + 2] - ax, ez = pts[j * 2 + 3] - az, L2 = ex * ex + ez * ez;
        if (L2 < 1e-6) continue;
        const t = Math.max(0, Math.min(1, ((x - ax) * ex + (z - az) * ez) / L2)), d = (ax + ex * t - x) ** 2 + (az + ez * t - z) ** 2;
        if (d <= bd) (bd = d), (bh = prof[j] + (prof[j + 1] - prof[j]) * t), (ba = (j + t) * 10), (bl = ((x - ax) * ez - (z - az) * ex) / Math.sqrt(L2));
      }
      seg[0] = Math.sqrt(bd);
      seg[1] = bh;
      seg[2] = ba;
      seg[3] = bl;
      return seg;
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
    // 掘り下げる前の高さ(もとの地面)
    let hc = null;
    function h0(x, z) {
      hc = null;
      if (!ok) return (hc = corridor(x, z)), 0;
      const v = abs(route.lat0 - z / route.kz, route.lon0 + x / route.kx);
      const c = (hc = corridor(x, z));
      if (!c) return isNaN(v) ? nearRoute(x, z) : v - base;
      if (isNaN(v) || c[0] <= 14) return c[1]; // 道から14mまでは、道の坂そのまま
      // 14〜45m: 道の坂から、まわりの地形へなだらかにつなぐ
      const w = 1 - (c[0] - 14) / 31, sm = w * w * (3 - 2 * w);
      return v - base + (c[1] - (v - base)) * sm;
    }
    // 地面の高さ。アンダーパスの区間は、道の幅だけ掘り下げる
    function h(x, z) {
      const v = h0(x, z);
      return hc && hc[0] < 40 && Xing.any() ? v - Xing.dip(hc[2], hc[3]) : v;
    }
    const profAt = (a) => {
      if (!prof) return 0;
      const i = Math.max(0, Math.min(prof.length - 1, a / 10)), i0 = Math.floor(i), i1 = Math.min(prof.length - 1, i0 + 1);
      return prof[i0] + (prof[i1] - prof[i0]) * (i - i0);
    };
    // 勾配(%)。前後20mの高さの差から
    function grade(along) {
      if (!prof) return 0;
      const g = ((profAt(along + 20) - profAt(along - 20)) / 40) * 100;
      // アンダーパスの下り・上りは、前後10mで測る(短い坂なのでならしすぎない)
      return Xing.any() ? g - ((Xing.dip(along + 10, 0) - Xing.dip(along - 10, 0)) / 20) * 100 : g;
    }
    // 標高のデータそのまま(出発地点からの差。無ければ NaN)
    const raw = (x, z) => (ok ? abs(route.lat0 - z / route.kz, route.lon0 + x / route.kx) - base : NaN);
    return { prepare, h, h0, raw, profAt, locate: corridor, abs: (x, z) => (ok ? h(x, z) + base : 0), grade, ok: () => ok, base: () => base };
  })();

  // ---------- 立体交差(高架とアンダーパス) ----------
  // 地図タイルの道・線路には「橋(bridge)」「トンネル(tunnel)」と高さの段(layer)が入っている。
  //   高架: 橋の線にそって、箱桁・橋脚・高欄(鉄道はレールと架線柱)を作る。並んだ線は1つの構造物に束ねる。
  //   アンダーパス: 走るルートがトンネルの区間、または低い橋の下をくぐる所は、道の幅だけ地面を掘り下げ(Terrain.h が引く)、
  //     両脇に擁壁を立てる。上を横切る線路や道は、もとの地面の高さのまま渡す(ふた、または橋)。
  //   ルート自身が橋の区間には、欄干を付ける。
  const Xing = (() => {
    const DEPTH = 5.5, SLOPE = 0.055, GIRD = 1.3, CLR = 4.7, LV = 6, ST = 4, INSET = 1.2;
    let dips = []; // { a0, a1, s0, s1, lo, hi, D, lids: [[a, b]…], arr, mesh }
    const plans = new Map(); // "ix:iy" → その区画の高架の設計
    let group = null, mat = null;
    const HN = 32;
    const holeU = { uHoleA: { value: null }, uHoleB: { value: null }, uHoleN: { value: 0 } };
    function reset() {
      for (const d of dips) if (d.mesh) dispose(d.mesh);
      dips = [];
      plans.clear();
      holeU.uHoleN.value = 0;
    }
    const any = () => dips.length > 0;
    function dipOf(al) {
      for (let k = 0; k < dips.length; k++) if (al > dips[k].s0 && al < dips[k].s1) return dips[k];
      return null;
    }
    // 掘り下げる深さ(m)。lat: ルートの線から左へ何m
    function dip(al, lat) {
      for (let k = 0; k < dips.length; k++) {
        const d = dips[k];
        if (al <= d.s0 || al >= d.s1 || lat < d.lo || lat > d.hi) continue;
        const f = (al - d.s0) / 2, i = Math.floor(f);
        return d.arr[i] + (d.arr[i + 1] - d.arr[i]) * (f - i);
      }
      return 0;
    }
    // その場所: 0=ふつう 1=掘り下げた所(空が見える) 2=掘り下げた所で、上にふたがある
    function zone(x, z) {
      if (!dips.length) return 0;
      const c = Terrain.locate(x, z);
      if (!c || c[0] > 40) return 0;
      const al = c[2], lat = c[3], d = dipOf(al);
      if (!d || lat < d.lo || lat > d.hi || dip(al, lat) < 0.05) return 0;
      for (const [a, b] of d.lids) if (al >= a && al <= b) return 2;
      return 1;
    }
    // 掘り下げる区間を足す(近くの区間とは1つにまとめる)。a0〜a1 がいちばん深い所(地面から D m下)で、その前後が坂
    function addDip(n) {
      const reachM = n.D / SLOPE + 60;
      let d = { a0: n.a0, a1: n.a1, lo: n.lo, hi: n.hi, D: n.D, lids: n.lid ? [[n.a0, n.a1]] : [], parts: [[n.a0, n.a1, n.D]] };
      for (let k = dips.length - 1; k >= 0; k--) {
        const o = dips[k];
        if (o.s1 < n.a0 - reachM || o.s0 > n.a1 + reachM) continue;
        d = { a0: Math.min(d.a0, o.a0), a1: Math.max(d.a1, o.a1), lo: Math.min(d.lo, o.lo), hi: Math.max(d.hi, o.hi), D: Math.max(d.D, o.D), lids: d.lids.concat(o.lids), parts: d.parts.concat(o.parts) };
        if (o.mesh) dispose(o.mesh);
        dips.splice(k, 1);
      }
      // 近い深い所どうし(80m まで)は、間も深いままつなぐ(間で道が盛り上がらないように)
      d.parts.sort((p, q) => p[0] - q[0]);
      d.parts = d.parts.reduce((r, q) => (r.length && q[0] <= r[r.length - 1][1] + 80 ? ((r[r.length - 1][1] = Math.max(r[r.length - 1][1], q[1])), (r[r.length - 1][2] = Math.max(r[r.length - 1][2], q[2]))) : r.push(q.slice()), r), []);
      // ふたは、重なるものを1つに
      d.lids.sort((p, q) => p[0] - q[0]);
      d.lids = d.lids.reduce((r, l) => (r.length && l[0] <= r[r.length - 1][1] + 6 ? (r[r.length - 1][1] = Math.max(r[r.length - 1][1], l[1])) : r.push(l.slice()), r), []);
      // 底の高さ: 深い所は「両端の地面を結んだ線 − D」。その外は 5.5% の坂で、もとの地面に出会うまで上る
      // (標高のデータにもとから坂や土手が入っている所でも、底はまっすぐな坂になる)
      const PA = Terrain.profAt, LIM = 280;
      const depth = (al) => {
        let v = 0;
        for (const [a, b, D] of d.parts) {
          const pa = PA(a), pb = PA(b), g = PA(al);
          let fl;
          if (al < a) fl = pa - D + (a - al) * SLOPE;
          else if (al > b) fl = pb - D + (al - b) * SLOPE;
          else fl = Math.min(pa + ((pb - pa) * (al - a)) / Math.max(1, b - a), g) - D;
          const out = Math.max(a - al, al - b, 0);
          v = Math.max(v, (g - fl) * Math.max(0, Math.min(1, (LIM - out) / 40)));
        }
        return Math.max(0, v);
      };
      let s0 = d.a0, s1 = d.a1;
      while (s0 > d.a0 - LIM && depth(s0) > 0.01) s0 -= 2;
      while (s1 < d.a1 + LIM && depth(s1) > 0.01) s1 += 2;
      d.s0 = s0 - 12;
      d.s1 = s1 + 12;
      const m = Math.ceil((d.s1 - d.s0) / 2) + 2, raw = new Float32Array(m);
      for (let i = 0; i < m; i++) {
        const al = d.s0 + i * 2;
        raw[i] = al > s0 && al < s1 ? depth(al) : 0;
      }
      // 坂の始まりと底の角を丸める
      d.arr = new Float32Array(m);
      for (let i = 0; i < m; i++) {
        let s = 0, k = 0;
        for (let j = Math.max(0, i - 4); j <= Math.min(m - 1, i + 4); j++) (s += raw[j]), k++;
        d.arr[i] = s / k;
      }
      d.arr[0] = d.arr[m - 1] = d.arr[m - 2] = 0;
      dips.push(d);
    }
    // 線を、区画の四角で切る(となりの区画と同じ物を二重に作らないため)。cut: 端が区画のふちで切れた
    function clip(ll, la0, la1, lo0, lo1) {
      const out = [];
      let cur = null;
      for (let i = 0; i + 3 < ll.length; i += 2) {
        const ay = ll[i], ax = ll[i + 1], dy = ll[i + 2] - ay, dx = ll[i + 3] - ax;
        let t0 = 0, t1 = 1, ok = true;
        for (const [p, q] of [[-dx, ax - lo0], [dx, lo1 - ax], [-dy, ay - la0], [dy, la1 - ay]]) {
          if (p === 0) {
            if (q < 0) ok = false;
          } else {
            const r = q / p;
            if (p < 0) {
              if (r > t1) ok = false;
              else if (r > t0) t0 = r;
            } else if (r < t0) ok = false;
            else if (r < t1) t1 = r;
          }
        }
        if (!ok) {
          cur = null;
          continue;
        }
        if (!cur || t0 > 0) out.push((cur = { pts: [project(ay + dy * t0, ax + dx * t0)], cut0: t0 > 0 || i > 0, cut1: false }));
        cur.pts.push(project(ay + dy * t1, ax + dx * t1));
        if (t1 < 1) (cur.cut1 = true), (cur = null);
      }
      return out;
    }
    // 線を step mごとの点に直す
    function resample(pts, step) {
      const out = [pts[0]];
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i], n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
        for (let k = 1; k <= n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
      }
      return out;
    }
    const tan = (st, i) => {
      const a = st[Math.max(0, i - 1)], b = st[Math.min(st.length - 1, i + 1)], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      return [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
    };
    const grpOf = (kind) => (kind === "rail" ? "rail" : ROAD_W[kind] <= 3 ? "foot" : "road");
    const widthOf = (kind, fl) => (kind === "rail" ? 5.2 : ROAD_W[kind] <= 3 ? 2.8 : fl & 2 ? 6.5 : fl & 1 ? Math.max(5.5, ROAD_W[kind] * 0.5 + 1) : Math.max(6, ROAD_W[kind] * 0.8));
    // ルートがトンネルを通る区間を探して、掘り下げる(far: これより手前はもう街ができているので掘らない)
    function scanTunnels(data, far) {
      const hit = [], hitCut = [], lines = [];
      for (const e of data.r) {
        // 車の通る道だけ(駅の地下通路などは、道の真下を並んで通っているだけのことが多い)
        if (!(e[4] < 0) || e[1] === "motorway" || e[1] === "rail" || e[1] === "service" || !(ROAD_W[e[1]] > 4.5)) continue;
        const ll = e[2], pts = [];
        for (let i = 0; i < ll.length; i += 2) pts.push(project(ll[i], ll[i + 1]));
        if (!isNear(pts[0]) && !isNear(pts[pts.length - 1])) continue;
        const st = resample(pts, 3), rec = [];
        for (let i = 0; i < st.length; i++) {
          const c = Terrain.locate(st[i][0], st[i][1]);
          if (!c || c[0] > 26) continue;
          const al = c[2], lat = c[3], d0 = c[0], t = tan(st, i), p = at(al);
          if (Math.abs(t[0] * p.tx + t[1] * p.tz) < 0.85) continue;
          rec.push([al, lat]);
          if (d0 < 2.5) (e[5] & 4 ? hitCut : hit).push(al);
        }
        if (rec.length) lines.push({ rec, w: widthOf(e[1], e[5]), foot: grpOf(e[1]) === "foot" });
      }
      // トンネルは上にふたをする。掘割は空が見えるまま(上を渡る道は、橋として plan が作る)
      // 掘割は、交差点の下(上を渡る道の橋の下)で線が切れていることが多いので、70m までのすき間はつなぐ
      for (const [hs, lid, gap] of [[hit, true, 12], [hitCut, false, 70]]) {
        hs.sort((a, b) => a - b);
        for (let i = 0; i < hs.length; ) {
          let j = i;
          while (j + 1 < hs.length && hs[j + 1] - hs[j] < gap) j++;
          const a0 = hs[i], a1 = hs[j];
          i = j + 1;
          if (a1 - a0 < 10 || a0 < far) continue;
          let lo = -3.5, hi = 3.5, foot = true;
          for (const l of lines)
            for (const [al, lat] of l.rec)
              if (al >= a0 && al <= a1) (lo = Math.min(lo, lat - l.w / 2 - INSET)), (hi = Math.max(hi, lat + l.w / 2 + INSET)), (foot = foot && l.foot);
          addDip({ a0, a1, lo: Math.max(-18, lo), hi: Math.min(18, hi), D: foot ? 3.6 : DEPTH, lid });
        }
      }
    }
    // ルートの道のおおよその幅(その区画の線から)。[右の端, 左の端](ルートの線から。左が正)
    function roadSpan(data, al) {
      const p = at(al);
      let best = null;
      for (const e of data.r) {
        if (e[4] || e[1] === "rail" || !ROAD_W[e[1]]) continue;
        const ll = e[2];
        for (let i = 0; i + 3 < ll.length; i += 2) {
          const a = project(ll[i], ll[i + 1]), b = project(ll[i + 2], ll[i + 3]);
          if (segDist(a, b, [p.x, p.z], [p.x + p.tx * 0.1, p.z + p.tz * 0.1]) > 3.5) continue;
          const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
          if (Math.abs(((b[0] - a[0]) * p.tx + (b[1] - a[1]) * p.tz) / L) < 0.85) continue;
          if (!best || ROAD_W[e[1]] > ROAD_W[best[1]]) best = e;
        }
      }
      if (!best) return [-6, 6];
      const w = ROAD_W[best[1]];
      // 一方通行(上下が別の線)なら、反対向きの車道は右にある
      return best[5] & 1 && w >= 9 ? [-(w * 0.75 + 2.5), w * 0.25 + 2.5] : [-(w / 2 + 2.5), w / 2 + 2.5];
    }
    // 1つの区画の高架を設計する(線をつなぐ・束ねる・高さを決める)。dig: 低い橋の下でルートを掘り下げてよいか
    function plan(data, ix, iy, dig, far) {
      const key = ix + ":" + iy;
      if (plans.has(key)) return plans.get(key);
      const P = { elev: new Set(), list: [], own: [] };
      plans.set(key, P);
      if (!data || !data.r) return P;
      const la1 = tileLat(iy), la0 = tileLat(iy + 1), lo0 = tileLon(ix), lo1 = tileLon(ix + 1);
      // 1) 橋の線を集めて、端どうしをつなぐ
      let ch = [];
      const tun = [];
      data.r.forEach((e, idx) => {
        if (e[4] === -1 && !(e[5] & 4) && e[1] !== "motorway") {
          const pts = [];
          for (let i = 0; i < e[2].length; i += 2) pts.push(project(e[2][i], e[2][i + 1]));
          if (isNear(pts[0]) || isNear(pts[pts.length - 1])) tun.push(resample(pts, 3));
        }
        if (!(e[4] > 0)) return;
        for (const c of clip(e[2], la0, la1, lo0, lo1)) {
          if (!c.pts.some(isNear)) continue;
          ch.push({ grp: grpOf(e[1]), kind: e[1], lv: e[4], w: widthOf(e[1], e[5]), pts: c.pts, cut0: c.cut0, cut1: c.cut1, src: [idx] });
        }
      });
      const close = (a, b) => Math.abs(a[0] - b[0]) < 0.8 && Math.abs(a[1] - b[1]) < 0.8;
      for (let again = true; again; ) {
        again = false;
        for (let i = 0; i < ch.length && !again; i++)
          for (let j = 0; j < ch.length && !again; j++) {
            const A = ch[i], B = ch[j];
            if (i === j || A.grp !== B.grp) continue;
            const ae = A.pts[A.pts.length - 1];
            let add = null;
            if (!A.cut1 && !B.cut0 && close(ae, B.pts[0])) add = B.pts.slice(1), (A.cut1 = B.cut1);
            else if (!A.cut1 && !B.cut1 && close(ae, B.pts[B.pts.length - 1])) add = B.pts.slice(0, -1).reverse(), (A.cut1 = B.cut0);
            if (!add && !A.cut0 && !B.cut0 && close(A.pts[0], B.pts[0])) {
              A.pts = B.pts.slice(1).reverse().concat(A.pts);
              A.cut0 = B.cut1;
              add = [];
            }
            if (!add) continue;
            A.pts = A.pts.concat(add);
            A.src = A.src.concat(B.src);
            A.w = Math.max(A.w, B.w);
            A.lv = Math.max(A.lv, B.lv);
            ch.splice(j, 1);
            again = true;
          }
      }
      // 端がほかの橋の線の端に付いているなら、そこは構造物の端ではない
      for (const A of ch)
        for (const B of ch) {
          if (A === B) continue;
          for (const q of [B.pts[0], B.pts[B.pts.length - 1]]) {
            if (close(A.pts[0], q)) A.cut0 = true;
            if (close(A.pts[A.pts.length - 1], q)) A.cut1 = true;
          }
        }
      for (const c of ch) (c.st = resample(c.pts, ST)), (c.len = (c.st.length - 1) * ST);
      ch = ch.filter((c) => c.st.length >= 3);
      // 2) トンネルの道の真上を渡る短い橋は、地面の高さのまま(ふたの上を通す)
      ch = ch.filter((c) => !(c.lv === 1 && c.len < 150 && tun.some((t) => t.some((q) => c.st.some((s) => Math.abs(s[0] - q[0]) < 4 && Math.abs(s[1] - q[1]) < 4)))));
      // 3) 並んで走る線を束ねる(長い線を軸にして、近い線の横の位置を幅に入れる)
      ch.sort((a, b) => b.len - a.len);
      const reach = (c) => (c.grp === "rail" ? 16 : c.grp === "road" ? 20 : 0);
      for (let m = 0; m < ch.length; m++) {
        const A = ch[m], n = A.st.length;
        A.lo = new Float32Array(n);
        A.hi = new Float32Array(n);
        A.tracks = [A.st.map((s, i) => [s[0], s[1], i])];
        const R = reach(A);
        for (let k = ch.length - 1; k > m; k--) {
          const B = ch[k];
          if (!R || B.grp !== A.grp || B.lv !== A.lv) continue;
          const got = [], rest = [];
          let run = null, step = 0, last = 0;
          for (let i = 0; i < B.st.length; i++) {
            const s = B.st[i];
            // 近い軸の点(前の点の近くから探す)
            let bi = -1, bd = R * R;
            const from = step ? Math.max(0, last - 12) : 0, to = step ? Math.min(n - 1, last + 12) : n - 1;
            for (let j = from; j <= to; j++) {
              const d = (A.st[j][0] - s[0]) ** 2 + (A.st[j][1] - s[1]) ** 2;
              if (d < bd) (bd = d), (bi = j);
            }
            const tb = tan(B.st, i), ta = bi >= 0 ? tan(A.st, bi) : null;
            if (bi >= 0 && Math.abs(ta[0] * tb[0] + ta[1] * tb[1]) > 0.9) {
              const lat = (s[0] - A.st[bi][0]) * ta[1] - (s[1] - A.st[bi][1]) * ta[0];
              got.push([s[0], s[1], bi, lat]);
              (last = bi), (step = 1), (run = null);
            } else {
              step = 0;
              if (!run) rest.push((run = []));
              run.push(s);
            }
          }
          if (got.length < 3) continue;
          for (const [, , bi, lat] of got) (A.lo[bi] = Math.min(A.lo[bi], lat - (B.w - A.w) / 2)), (A.hi[bi] = Math.max(A.hi[bi], lat + (B.w - A.w) / 2));
          A.tracks.push(got);
          A.src = A.src.concat(B.src);
          ch.splice(k, 1);
          // 軸からはみ出た残りは、別の構造物として残す
          for (const r of rest) if (r.length >= 6) ch.push({ grp: B.grp, kind: B.kind, lv: B.lv, w: B.w, pts: r, st: r, len: (r.length - 1) * ST, cut0: true, cut1: true, src: [] });
        }
        // 幅の変わり目をなだらかに
        for (const arr of [A.lo, A.hi]) {
          const c = arr.slice(), sg = arr === A.lo ? -1 : 1;
          for (let i = 0; i < n; i++) {
            let v = 0;
            for (let j = Math.max(0, i - 4); j <= Math.min(n - 1, i + 4); j++) v = Math.max(v, sg * c[j] - Math.abs(j - i) * 0.6);
            arr[i] = sg * v;
          }
        }
      }
      // 4) 高さ(桁の上の面)を決める
      for (const A of ch) {
        const n = A.st.length, g = (A.g = new Float32Array(n));
        A.skip = new Uint8Array(n);
        for (let i = 0; i < n; i++) g[i] = Terrain.h0(A.st[i][0], A.st[i][1]);
        // ルートと重なる所・横切る所
        const cross = [];
        let run = [];
        const endRun = () => {
          if (run.length >= 4 && A.grp === "road") P.own.push([Math.min(...run), Math.max(...run), null, A.kind]);
          run = [];
        };
        for (let i = 0; i < n; i++) {
          const c = Terrain.locate(A.st[i][0], A.st[i][1]);
          if (!c || c[0] > 6) {
            endRun();
            continue;
          }
          const al = c[2], d0 = c[0], p = at(al), t = tan(A.st, i), dot = t[0] * p.tx + t[1] * p.tz;
          if (Math.abs(dot) > 0.8) {
            // ルートと同じ向き: ルート自身の橋(欄干だけ付ける)。その上には桁を作らない
            A.skip[i] = 1;
            run.push(al);
          } else {
            endRun();
            if (d0 < ST * 0.75 && (!cross.length || i - cross[cross.length - 1][0] > 3)) cross.push([i, al, Math.sqrt(1 - dot * dot)]);
          }
        }
        endRun();
        A.cross = cross;
      }
      // ルート自身が橋の所で横切る、同じ段の橋(川を渡る歩道の橋など)は、同じ高さで交わっているので、ふつうの道として描く
      const ownAt = (al) => P.own.some(([a, b]) => al > a - 12 && al < b + 12);
      // 走る道をまたがない短い歩道の橋(川ぞいの歩道など)も、ふつうの道として描く(地面の高さで桁や欄干を作ると、道の上の壁になる)
      ch = ch.filter((A) => !(A.grp !== "rail" && A.lv <= 1 && A.cross.length && A.cross.every(([, al]) => ownAt(al))) && !(A.grp === "foot" && !A.cross.length && A.len < 150));
      for (const A of ch) {
        const n = A.st.length, g = A.g, top = new Float32Array(n), cross = A.cross;
        const gs = (i) => {
          let s = 0, k = 0;
          for (let j = Math.max(0, i - 10); j <= Math.min(n - 1, i + 10); j++) (s += g[j]), k++;
          return s / k;
        };
        // 短い橋は、両端の地面(土手)の高さをそのまま結ぶ。長い高架は、段の数×6m
        const e0 = Terrain.raw(A.st[0][0], A.st[0][1]), e1 = Terrain.raw(A.st[n - 1][0], A.st[n - 1][1]);
        let flat = A.grp !== "foot" && A.len < 150 && !A.cut0 && !A.cut1 && !isNaN(e0) && !isNaN(e1);
        // 掘り下げた道(掘割)の上を渡る短い歩道の橋は、地面の高さのまま(歩道橋のように高く上げない)
        const footFlat = A.grp === "foot" && A.len < 80 && cross.every(([, al]) => dip(al, 0) > 4.6);
        if (footFlat) flat = true;
        for (let i = 0; i < n; i++) {
          if (footFlat) top[i] = g[i] + 0.4;
          else if (flat) top[i] = Math.max(e0 + ((e1 - e0) * i) / (n - 1), g[i]) + 0.4;
          else if (A.grp === "rail") top[i] = gs(i) + (A.lv >= 3 ? 12 : 7.5); // 鉄道の高架は、段の数によらずほぼ同じ高さ
          else if (A.grp === "foot") top[i] = gs(i) + 5.6;
          else {
            // 道の高架: 端は地面から上っていく
            const dEnd = Math.min(A.cut0 ? 1e9 : i * ST, A.cut1 ? 1e9 : (n - 1 - i) * ST);
            top[i] = gs(i) + Math.min(Math.min(18, LV * A.lv), 0.4 + 0.06 * dEnd);
          }
        }
        for (const [i, al, sin] of cross) {
          const need = Terrain.profAt(al) - dip(al, 0) + (A.grp === "foot" ? 3.8 : CLR) + GIRD + 0.1;
          let def = need - top[i];
          if (def > 1.5 && flat && dig && al > far && al > 40 && al < route.length - 40) {
            // 低い橋(線路や道が地面の高さのまま渡る): ルートのほうを掘り下げてくぐる
            const D = Math.min(DEPTH, def), half = ((A.hi[i] - A.lo[i] + A.w) / 2 + 1) / Math.max(0.5, sin) + 2, [lo, hi] = roadSpan(data, al);
            addDip({ a0: al - half, a1: al + half, lo, hi, D, lid: false });
            def = need - top[i] - dip(al, 0);
          }
          // 掘れない所は、桁のほうを持ち上げてまたぐ
          if (def > 0.05) for (let j = 0; j < n; j++) top[j] = Math.max(top[j], need - (A.grp === "rail" ? 0.03 : 0.055) * ST * Math.abs(j - i));
        }
        A.top = top;
        for (const s of A.src) P.elev.add(s);
        P.list.push(A);
      }
      return P;
    }
    // 走り出す前: ルートの通る区画の地図を先に読み、掘り下げる区間を決める(地面や道を作る前に決まっている必要がある)
    async function prepare() {
      reset();
      const keys = [];
      for (let d = 0; d <= route.length; d += 150) {
        const p = at(d), k = tileX(route.lon0 + p.x / route.kx) + ":" + tileY(route.lat0 - p.z / route.kz);
        if (!keys.includes(k)) keys.push(k);
      }
      const t0 = Date.now();
      for (let i = 0; i < Math.min(keys.length, 16) && Date.now() - t0 < 20000; i += 4)
        await Promise.all(
          keys.slice(i, i + 4).map(async (k) => {
            const [ix, iy] = k.split(":").map(Number);
            try {
              learn(await fetchTile(ix, iy), ix, iy, -1);
            } catch (e) {}
          })
        );
    }
    // 読めた区画から、掘り下げる区間を足す(far: これより手前は掘らない)
    function learn(data, ix, iy, far) {
      if (!route || !data || !data.r || plans.has(ix + ":" + iy)) return;
      try {
        scanTunnels(data, far);
        plan(data, ix, iy, true, far);
      } catch (e) {
        console.error(e);
      }
    }
    function material() {
      if (!mat) mat = new (T().MeshLambertMaterial)({ vertexColors: true, side: T().DoubleSide });
      return mat;
    }
    // 形を集める入れ物(頂点の色つき・面ごとの向き)
    function buf() {
      const P = [], C = [];
      const tri = (a, b, c, col, c2, c3) => {
        P.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
        C.push(col[0], col[1], col[2], ...(c2 || col), ...(c3 || col));
      };
      // a→b が下の辺、c→d が上の辺(色を上下で変えられる)
      const quad = (a, b, c, d, col, colTop) => (tri(a, b, c, col, col, colTop || col), tri(a, c, d, col, colTop || col, colTop || col));
      // 向き(tx, tz)にそった箱: 中心(x, z)、前後の半分 hl、左右の半分 hw、高さ y0〜y1
      const box = (x, z, tx, tz, hl, hw, y0, y1, col) => {
        const c = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [x + tx * hl * a + tz * hw * b, z + tz * hl * a - tx * hw * b]);
        const dark = [col[0] * 0.8, col[1] * 0.8, col[2] * 0.8];
        for (let i = 0; i < 4; i++) {
          const p = c[i], q = c[(i + 1) % 4];
          quad([p[0], y0, p[1]], [q[0], y0, q[1]], [q[0], y1, q[1]], [p[0], y1, p[1]], dark, col);
        }
        quad([c[0][0], y1, c[0][1]], [c[1][0], y1, c[1][1]], [c[2][0], y1, c[2][1]], [c[3][0], y1, c[3][1]], col);
        quad([c[0][0], y0, c[0][1]], [c[1][0], y0, c[1][1]], [c[2][0], y0, c[2][1]], [c[3][0], y0, c[3][1]], dark);
      };
      const mesh = () => {
        if (!P.length) return null;
        const THREE = T(), geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(P, 3));
        geo.setAttribute("color", new THREE.Float32BufferAttribute(C, 3));
        geo.computeVertexNormals();
        const m = new THREE.Mesh(geo, material());
        m.castShadow = m.receiveShadow = true;
        return m;
      };
      return { tri, quad, box, mesh };
    }
    // 桁やふたの下の暗がり(地面に重ねる半透明の黒)。p0→p1 と q0→q1 の間を横に細かく割り、地面の高さに沿わせる
    let shadeMat = null;
    function shader() {
      const P = [];
      const strip = (p0, p1, q0, q1) => {
        const w = Math.max(Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), Math.hypot(q1[0] - q0[0], q1[1] - q0[1])), m = Math.max(1, Math.ceil(w / 1.5));
        const pt = (a, b, t) => {
          const x = a[0] + (b[0] - a[0]) * t, z = a[1] + (b[1] - a[1]) * t;
          return [x, H(x, z) + 0.09, z];
        };
        for (let k = 0; k < m; k++) {
          const a = pt(p0, p1, k / m), b = pt(p0, p1, (k + 1) / m), c = pt(q0, q1, (k + 1) / m), d = pt(q0, q1, k / m);
          // 擁壁のふちをまたぐ所(高さが急に変わる所)は置かない
          if (Math.max(a[1], b[1], c[1], d[1]) - Math.min(a[1], b[1], c[1], d[1]) > 0.6) continue;
          P.push(...a, ...b, ...c, ...a, ...c, ...d);
        }
      };
      const mesh = () => {
        if (!P.length) return null;
        const THREE = T(), geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(P, 3));
        if (!shadeMat) shadeMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 });
        const m = new THREE.Mesh(geo, shadeMat);
        m.renderOrder = 2;
        return m;
      };
      return { strip, mesh };
    }
    const CONC = [0.7, 0.69, 0.66], CONC2 = [0.6, 0.59, 0.57], UNDER = [0.17, 0.17, 0.18], ASPH = [0.2, 0.2, 0.21], BALLAST = [0.4, 0.36, 0.32], STEEL = [0.3, 0.31, 0.32], PANEL = [0.62, 0.68, 0.67], LID = [0.43, 0.43, 0.44];
    // 区画の高架の形を作る(1つのメッシュにまとめる)
    function build(P) {
      if (!P.list.length && !P.own.length) return null;
      const B = buf(), SH = shader();
      for (const A of P.list) {
        const n = A.st.length, rail = A.grp === "rail", foot = A.grp === "foot", big = !rail && !foot && A.w >= 8;
        const topCol = rail ? BALLAST : foot ? CONC2 : ASPH, ph = rail ? 1.1 : foot ? 1.1 : 1.0;
        // 断面: [横の位置, 高さ(上の面から)]。左が正
        const sec = (i) => {
          const L = A.hi[i] + A.w / 2, R = A.lo[i] - A.w / 2, W = L - R, ins = Math.min(W * 0.22, 2.4), t = tan(A.st, i), y = A.top[i], s = A.st[i];
          const at2 = (lat, dy) => [s[0] + t[1] * lat, y + dy, s[1] - t[0] * lat];
          return { L, R, W, t, y, at2, ring: [at2(L, 0), at2(R, 0), at2(R, -0.45), at2(R + ins, -GIRD), at2(L - ins, -GIRD), at2(L, -0.45)] };
        };
        let prev = null;
        const cols = [topCol, CONC, CONC2, UNDER, CONC2, CONC];
        for (let i = 0; i < n; i++) {
          const S = sec(i);
          if (prev && !A.skip[i] && !A.skip[i - 1]) {
            // 走る道の近くでは、桁の下の地面を暗く
            const c = Terrain.locate(A.st[i][0], A.st[i][1]);
            if (c && c[0] < 30 && S.y - GIRD - H(A.st[i][0], A.st[i][1]) > 2.5) {
              const g2 = (q) => [q[0], q[2]];
              SH.strip(g2(prev.at2(prev.R, 0)), g2(prev.at2(prev.L, 0)), g2(S.at2(S.R, 0)), g2(S.at2(S.L, 0)));
            }
            for (let k = 0; k < 6; k++) {
              const a = prev.ring[k], b = prev.ring[(k + 1) % 6], c = S.ring[(k + 1) % 6], d = S.ring[k];
              B.quad(a, b, c, d, cols[k]);
            }
            // 高欄(広い道は、その上に防音壁)
            for (const [sd, lat0, lat1] of [[1, prev.L, S.L], [-1, prev.R, S.R]]) {
              const a0 = prev.at2(lat0, 0), a1 = S.at2(lat1, 0), b0 = prev.at2(lat0 - sd * 0.25, 0), b1 = S.at2(lat1 - sd * 0.25, 0);
              const up = (p, h) => [p[0], p[1] + h, p[2]];
              B.quad(a0, a1, up(a1, ph), up(a0, ph), CONC);
              B.quad(b0, b1, up(b1, ph), up(b0, ph), CONC2);
              B.quad(up(a0, ph), up(a1, ph), up(b1, ph), up(b0, ph), CONC);
              if (big) B.quad(up(a0, ph), up(a1, ph), up(a1, ph + 1.6), up(a0, ph + 1.6), PANEL);
            }
          }
          const open = !A.skip[i];
          // 端(橋台): 断面をふさぎ、地面まで壁を下ろす
          if (open && ((i === 0 && !A.cut0) || (i === n - 1 && !A.cut1))) {
            for (let k = 1; k < 5; k++) B.tri(S.ring[0], S.ring[k], S.ring[k + 1], CONC2);
            if (S.y - GIRD - A.g[i] > 0.6) B.box(A.st[i][0] + (S.t[1] * (S.L + S.R)) / 2, A.st[i][1] - (S.t[0] * (S.L + S.R)) / 2, S.t[0], S.t[1], 0.8, S.W / 2, A.g[i] - 0.6, S.y - 0.45, CONC2);
          }
          // 橋脚(20mおき。走る道の上と、掘り下げた所には立てない)
          if (open && i % 5 === 2 && i > 0 && i < n - 1) {
            const mid = (S.L + S.R) / 2, x = A.st[i][0] + S.t[1] * mid, z = A.st[i][1] - S.t[0] * mid, gy = Terrain.h0(x, z), under = S.y - GIRD;
            const c = Terrain.locate(x, z), nearRoad = c && c[0] < S.W / 2 + 9;
            if (under - gy > 1.8 && !nearRoad && !zone(x, z)) {
              if (foot || S.W < 7.5) B.box(x, z, S.t[0], S.t[1], foot ? 0.3 : 0.7, foot ? 0.3 : 0.9, gy - 0.6, under, CONC);
              else {
                const two = S.W >= 15;
                B.box(x, z, S.t[0], S.t[1], 0.85, S.W / 2 - 1.2, under - 1.1, under, CONC);
                for (const o of two ? [-S.W * 0.26, S.W * 0.26] : [0]) B.box(x + S.t[1] * o, z - S.t[0] * o, S.t[0], S.t[1], 0.75, two ? 1.0 : 1.3, gy - 0.6, under - 1.1, CONC);
              }
            }
          }
          // 架線柱(約48mおき): 両脇の柱と、上の梁
          if (rail && open && i % 12 === 6) {
            const pl = S.at2(S.L - 0.55, 0), pr = S.at2(S.R + 0.55, 0);
            for (const q of [pl, pr]) B.box(q[0], q[2], S.t[0], S.t[1], 0.12, 0.12, q[1], q[1] + 6.6, STEEL);
            B.box((pl[0] + pr[0]) / 2, (pl[2] + pr[2]) / 2, S.t[0], S.t[1], 0.1, S.W / 2 - 0.55, S.y + 6.0, S.y + 6.3, STEEL);
          }
          prev = S;
        }
        // レール(線ごとに2本)
        if (rail)
          for (const tr of A.tracks)
            for (let k = 1; k < tr.length; k++) {
              const a = tr[k - 1], b = tr[k];
              if (A.skip[a[2]] || A.skip[b[2]]) continue;
              const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz);
              if (L < 0.5 || L > ST * 2.5) continue;
              const nx = dz / L, nz = -dx / L, ya = A.top[a[2]], yb = A.top[b[2]];
              for (const o of [-0.53, 0.53]) {
                const p = (q, y, w, h) => [q[0] + nx * (o + w), y + h, q[1] + nz * (o + w)];
                B.quad(p(a, ya, -0.04, 0.16), p(b, yb, -0.04, 0.16), p(b, yb, 0.04, 0.16), p(a, ya, 0.04, 0.16), STEEL);
                B.quad(p(a, ya, -0.04, 0), p(b, yb, -0.04, 0), p(b, yb, -0.04, 0.16), p(a, ya, -0.04, 0.16), UNDER);
                B.quad(p(a, ya, 0.04, 0), p(b, yb, 0.04, 0), p(b, yb, 0.04, 0.16), p(a, ya, 0.04, 0.16), UNDER);
              }
            }
      }
      // ルート自身が橋の区間: 両脇に欄干
      for (const [a0, a1, , kind] of P.own) {
        const half = (ROAD_W[kind] || 6) / 2 + 3.5;
        for (let al = a0; al < a1; al += 2) {
          const p = at(al), q = at(Math.min(a1, al + 2));
          const r = Roads.ride(al), L = r ? Math.max(half, r.off + 0.9 + 3.2) : half, R = r ? Math.min(-half, r.off + 0.9 - r.W - 3.2) : -half;
          for (const lat of [L, R]) {
            const ax = p.x + p.tz * lat, az = p.z - p.tx * lat, bx = q.x + q.tz * lat, bz = q.z - q.tx * lat;
            const ya = H(ax, az), yb = H(bx, bz), post = Math.round(al / 2) % 2 === 0;
            B.quad([ax, ya, az], [bx, yb, bz], [bx, yb + 0.35, bz], [ax, ya + 0.35, az], CONC);
            B.quad([ax, ya + 0.98, az], [bx, yb + 0.98, bz], [bx, yb + 1.1, bz], [ax, ya + 1.1, az], STEEL);
            B.quad([ax, ya + 0.62, az], [bx, yb + 0.62, bz], [bx, yb + 0.7, bz], [ax, ya + 0.7, az], STEEL);
            if (post) B.box(ax, az, p.tx, p.tz, 0.06, 0.06, ya + 0.3, ya + 1.1, STEEL);
          }
        }
      }
      return withShade(B.mesh(), SH.mesh());
    }
    const withShade = (m, sh) => (m && sh && m.add(sh), m);
    const dispose = (m) => (m.parent && m.parent.remove(m), m.traverse((o) => o.geometry && o.geometry.dispose()));
    // アンダーパスの形: 底の面・両脇の擁壁・壁の上のふち・上を渡るふた
    function buildDip(d) {
      const B = buf(), SH = shader(), LT = buf(), a0 = Math.max(0, d.s0), a1 = Math.min(route.length, d.s1);
      const wl = d.hi - INSET, wr = d.lo + INSET;
      const SEAM = [0.42, 0.41, 0.39], BEAM = [0.13, 0.13, 0.14], FENCE = [0.55, 0.62, 0.58], LAMP_ON = [1.0, 0.93, 0.78];
      const lidAt = (al) => d.lids.some(([a, b]) => al >= a && al <= b);
      let prev = null;
      for (let al = a0; al <= a1 + 0.01; al += 2) {
        const p = at(al), dep = dip(al, 0), lid = lidAt(al);
        const P = (lat, y) => [p.x + p.tz * lat, y, p.z - p.tx * lat];
        const nat = (lat) => Terrain.h0(p.x + p.tz * lat, p.z - p.tx * lat);
        const yF = Terrain.profAt(al) - dep - 0.03, par = lid ? 0.02 : Math.min(1.0, dep * 2.5);
        const S = { al, lid, dep, fl: P(wl + 0.05, yF), fr: P(wr - 0.05, yF), sides: [] };
        for (const [sd, w, edge] of [[1, wl, d.hi], [-1, wr, d.lo]]) {
          const yN = nat(edge + sd * 0.6), yT = yN + par;
          S.sides.push({ b: P(w, yF - 0.3), t: P(w, yT), t2: P(w + sd * 0.4, yT), o: P(w + sd * 0.4, yN + 0.04), e: P(edge + sd * 0.7, yN + 0.04) });
        }
        S.yL = (S.sides[0].o[1] + S.sides[1].o[1]) / 2;
        if (prev) {
          B.quad(prev.fl, S.fl, S.fr, prev.fr, ASPH);
          const shade = Math.round(al / 4) % 2 ? CONC : [CONC[0] * 0.96, CONC[1] * 0.96, CONC[2] * 0.96];
          for (let k = 0; k < 2; k++) {
            const a = prev.sides[k], b = S.sides[k];
            // 擁壁(下ほど汚れて暗い。ふたの下は日が当たらないので暗く)
            const dk = prev.lid && S.lid ? 0.5 : 1;
            if (Math.max(prev.dep, S.dep) > 0.03) B.quad(a.b, b.b, b.t, a.t, [shade[0] * 0.72 * dk, shade[1] * 0.72 * dk, shade[2] * 0.72 * dk], [shade[0] * dk, shade[1] * dk, shade[2] * dk]);
            B.quad(a.t, b.t, b.t2, a.t2, CONC);
            B.quad(a.o, b.o, b.t2, a.t2, CONC2);
            B.quad(a.o, b.o, b.e, a.e, CONC2);
          }
          // 擁壁の継ぎ目(4mごとの縦の目地)と、地上のふちの転落防止柵(柱2mおき・上と中の横棒)
          const step = Math.round(al / 2);
          for (let k = 0; k < 2; k++) {
            const a = prev.sides[k], b = S.sides[k], sd = k ? -1 : 1;
            if (step % 2 === 0 && Math.max(prev.dep, S.dep) > 0.6) {
              const inw = (q, o) => [q[0] - p.tz * sd * o, q[1], q[2] + p.tx * sd * o];
              B.quad(inw(b.b, 0.01), inw([b.b[0] + p.tx * 0.12, b.b[1], b.b[2] + p.tz * 0.12], 0.01), inw([b.t[0] + p.tx * 0.12, b.t[1], b.t[2] + p.tz * 0.12], 0.01), inw(b.t, 0.01), SEAM);
            }
            if (!(prev.lid && S.lid) && Math.max(prev.dep, S.dep) > 1.2) {
              const ft = (q, y) => [q[0], q[1] + y, q[2]];
              B.box(b.t2[0], b.t2[2], p.tx, p.tz, 0.04, 0.04, b.t2[1], b.t2[1] + 1.2, FENCE);
              for (const y of [1.15, 0.6]) B.quad(ft(a.t2, y - 0.04), ft(b.t2, y - 0.04), ft(b.t2, y + 0.04), ft(a.t2, y + 0.04), FENCE);
              // 金網(うすい面)
              B.quad(ft(a.t2, 0.05), ft(b.t2, 0.05), ft(b.t2, 1.15), ft(a.t2, 1.15), [0.36, 0.42, 0.4]);
            }
          }
          // ふた(上を渡る道や線路の地面): 上の面と、暗い天井
          if (prev.lid && S.lid) {
            // 天井の横の梁(3mおき)と、照明(6mおき。壁ぎわに2列、夜も昼も光る)
            const l = S.sides[0], r = S.sides[1], yC = (l.t[1] + r.t[1]) / 2 - 0.9;
            if (step % 3 === 0) B.box((l.t[0] + r.t[0]) / 2, (l.t[2] + r.t[2]) / 2, p.tx, p.tz, 0.3, (wl - wr) / 2, yC - 0.7, yC, BEAM);
            if (step % 3 === 1)
              for (const [q, sd] of [[l, 1], [r, -1]]) {
                const x = q.t[0] - p.tz * sd * 0.6, z = q.t[2] + p.tx * sd * 0.6;
                LT.box(x, z, p.tx, p.tz, 0.6, 0.09, yC - 0.18, yC - 0.06, LAMP_ON);
              }
          }
          if (prev.lid && S.lid) {
            const [l0, r0, l1, r1] = [prev.sides[0], prev.sides[1], S.sides[0], S.sides[1]];
            const dn = (q, h) => [q[0], q[1] - h, q[2]];
            B.quad(l0.e, l1.e, r1.e, r0.e, LID);
            B.quad(dn(l0.t, 0.9), dn(l1.t, 0.9), dn(r1.t, 0.9), dn(r0.t, 0.9), UNDER);
            // ふたの下の道は暗く
            const g2 = (q) => [q[0], q[2]];
            SH.strip(g2(prev.fr), g2(prev.fl), g2(S.fr), g2(S.fl));
          }
          // 坑口: ふたの端の壁(上に低い壁)
          if (prev.lid !== S.lid) {
            const E = S.lid ? S : prev, l = E.sides[0], r = E.sides[1];
            B.quad([l.t[0], l.t[1] - 0.9, l.t[2]], [r.t[0], r.t[1] - 0.9, r.t[2]], [r.t[0], r.t[1] + 1.0, r.t[2]], [l.t[0], l.t[1] + 1.0, l.t[2]], CONC2, CONC);
            B.box((l.t[0] + r.t[0]) / 2, (l.t[2] + r.t[2]) / 2, p.tx, p.tz, 0.2, (wl - wr) / 2 + 0.4, E.yL, E.yL + 1.0, CONC);
          }
        }
        prev = S;
      }
      const m = withShade(B.mesh(), SH.mesh()), lm = LT.mesh();
      if (m && lm) {
        lm.material = new (T().MeshBasicMaterial)({ vertexColors: true });
        lm.castShadow = lm.receiveShadow = false;
        m.add(lm);
      }
      return m;
    }
    // 走っている間: 近くのアンダーパスの形を用意し、地面にあける穴(掘り下げた所)をシェーダーへ渡す
    function sync(along) {
      if (!scene) return;
      const THREE = T();
      if (!group) (group = new THREE.Group()), scene.add(group);
      group.visible = !G3.on();
      if (!holeU.uHoleA.value) {
        holeU.uHoleA.value = Array.from({ length: HN }, () => new THREE.Vector4());
        holeU.uHoleB.value = Array.from({ length: HN }, () => new THREE.Vector4());
      }
      const boxes = [];
      for (const d of dips) {
        if (d.s0 > along + 1600 || d.s1 < along - 400) continue;
        if (!d.mesh) {
          d.mesh = buildDip(d);
          if (d.mesh) group.add(d.mesh);
        }
        for (let al = Math.max(0, d.s0); al < Math.min(route.length, d.s1); al += 9) {
          const b = Math.min(d.s1, al + 9), p = at((al + b) / 2);
          if (dip((al + b) / 2, 0) > 0.02 || dip(al, 0) > 0.02 || dip(b, 0) > 0.02) boxes.push([Math.abs((al + b) / 2 - along), p.x, p.z, p.tx, p.tz, (b - al) / 2 + 0.6, d.lo, d.hi]);
        }
      }
      boxes.sort((a, b) => a[0] - b[0]);
      const n = Math.min(HN, boxes.length);
      for (let i = 0; i < n; i++) {
        const b = boxes[i];
        holeU.uHoleA.value[i].set(b[1], b[2], b[3], b[4]);
        holeU.uHoleB.value[i].set(b[5], b[6], b[7], 0);
      }
      holeU.uHoleN.value = G3.on() ? 0 : n;
    }
    // 地面の材料に「掘り下げた所は描かない」を足す(もとの書きかえは残す)
    function holeMat(m) {
      const prev = m.onBeforeCompile, pk = m.customProgramCacheKey;
      m.onBeforeCompile = (sh, r) => {
        prev.call(m, sh, r);
        Object.assign(sh.uniforms, holeU);
        sh.vertexShader = "varying vec2 vHoleW;\n" + sh.vertexShader.replace("#include <project_vertex>", "#include <project_vertex>\nvHoleW = (modelMatrix * vec4(transformed, 1.0)).xz;");
        sh.fragmentShader =
          `varying vec2 vHoleW;\nuniform vec4 uHoleA[${HN}];\nuniform vec4 uHoleB[${HN}];\nuniform int uHoleN;\n` +
          sh.fragmentShader.replace(
            "#include <clipping_planes_fragment>",
            `for (int hi = 0; hi < ${HN}; hi++) {
              if (hi >= uHoleN) break;
              vec2 hd = vHoleW - uHoleA[hi].xy;
              float hl = hd.x * uHoleA[hi].w - hd.y * uHoleA[hi].z;
              if (abs(dot(hd, uHoleA[hi].zw)) < uHoleB[hi].x && hl > uHoleB[hi].y && hl < uHoleB[hi].z) discard;
            }
            #include <clipping_planes_fragment>`
          );
      };
      m.customProgramCacheKey = () => (pk ? pk.call(m) : "") + "|hole";
      m.userData.holed = true;
      return m;
    }
    return { prepare, learn, plan, build, sync, holeMat, any, dip, dipOf, zone, reset, list: () => dips, plans, near: (al) => dips.some((d) => al > d.s0 - 250 && al < d.s1 + 250) };
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
    // (x, z) から (dx, dz) の向きに t m の間、詳しい形(車道・歩道など)が1つも無く、道路全体の形だけか
    function only4(x, z, dx, dz, t) {
      for (let u = 0.5; u < t; u += 1) if (kindAt(x + dx * u, z + dz * u) !== 4) return false;
      return true;
    }
    // ---- ルートの道幅を測る ----
    function measure(i) {
      const p = at(i * STEP);
      const k = kindAt(p.x, p.z);
      if (!isCar(k)) return (raw[i] = raw[i] || null);
      const lx = p.tz, lz = -p.tx; // 左
      let L = reach(p.x, p.z, lx, lz), R = reach(p.x, p.z, -lx, -lz);
      // 歩道と車道を分けた詳しい形が無い所は、道路全体(歩道こみ)の形しかない。広い道ならふつう両側に歩道があるので、
      // その分(約3m)を引いて車道の端にする(引かないと、左端から0.9mの走る位置が歩道の上になる)
      if (k === 4 && L + R >= 11 && only4(p.x, p.z, lx, lz, L) && only4(p.x, p.z, -lx, -lz, R)) {
        const sw = Math.min(3.5, (L + R) * 0.14);
        L = Math.max(1.5, L - sw);
        R = Math.max(1.5, R - sw);
      }
      raw[i] = { L, R, cross: k === 1 };
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
    // 走る位置: 交差点や曲がり角では、横の道のぶんまで「道幅」に入って左端が外へ飛び、角の建物に突っ込んでしまう。
    // 前後24mの中でいちばん内側(道のまん中寄り)の値を使い、道が急に広がる所でも手前の道の端の線を保つ
    const rideMemo = new Map();
    function ride(along) {
      const k = Math.round(along / STEP), now = performance.now();
      const hit = rideMemo.get(k);
      if (hit && now - hit.t < 2000) return hit.v;
      const c = ride1(along);
      let v = c;
      if (c) {
        let off = c.off;
        for (const d of [-24, -16, -8, 8, 16, 24]) {
          const q = ride1(along + d);
          if (q && q.off < off) off = q.off;
        }
        v = { off, W: c.W };
        // アンダーパスの中は、擁壁の内側におさめる
        const d = Xing.any() && Xing.dipOf(along);
        if (d) {
          v.off = Math.max(d.lo + 3.2, Math.min(v.off, d.hi - 2.4));
          v.W = Math.max(2.5, Math.min(v.W, v.off + 0.9 - (d.lo + 1.5)));
        }
      }
      if (rideMemo.size > 4000) rideMemo.clear();
      rideMemo.set(k, { t: now, v });
      return v;
    }
    function ride1(along) {
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
      // アスファルト: 細かい石の粒だけを描く(補修跡・ひび・マンホールは別の薄い絵で、場所ごとに置く)。
      // でこぼこ(法線)と、つや(粗さ)の絵も一緒に作って、光の当たり方でざらつきが見えるようにする
      const AS = 512, hgt = new Float32Array(AS * AS);
      const acv = document.createElement("canvas");
      acv.width = acv.height = AS;
      {
        const c = acv.getContext("2d");
        c.fillStyle = "#55585c";
        c.fillRect(0, 0, AS, AS);
        // 石の粒(明るい石・暗いすき間)。大きめの石も少しまぜる
        for (let i = 0; i < 60000; i++) {
          const x = Math.floor(hash(i + 1e4) * AS), y = Math.floor(hash(i + 2e4) * AS), k = hash(i), sz = k < 0.012 ? 3 : k < 0.07 ? 2 : 1;
          const v = k < 0.5 ? 38 + Math.floor(hash(i + 5e4) * 40) : 108 + Math.floor(hash(i + 6e4) * 84), w = hash(i + 7e4) < 0.12 ? 8 : 0;
          c.fillStyle = `rgba(${v + w},${v + Math.round(w * 0.6)},${v + 3 - w},${sz > 1 ? 0.85 : 0.5})`;
          c.fillRect(x, y, sz, sz);
          for (let a = 0; a < sz; a++) for (let b = 0; b < sz; b++) hgt[((y + b) % AS) * AS + ((x + a) % AS)] += v > 100 ? 0.9 : -0.7;
        }
      }
      const asph = new THREE.CanvasTexture(acv);
      asph.wrapS = asph.wrapT = THREE.RepeatWrapping;
      asph.encoding = THREE.sRGBEncoding;
      asph.anisotropy = 16;
      // 高さ → 法線の絵 と 粗さの絵(石の頭はすり減って少しつやがあり、すき間はざらざら。緑の成分を粗さに使う)
      const ncv = document.createElement("canvas"), rcv = document.createElement("canvas");
      ncv.width = ncv.height = rcv.width = rcv.height = AS;
      {
        const c = ncv.getContext("2d"), im = c.createImageData(AS, AS), c2 = rcv.getContext("2d"), im2 = c2.createImageData(AS, AS);
        const hAt = (x, y) => hgt[((y + AS) % AS) * AS + ((x + AS) % AS)];
        for (let y = 0; y < AS; y++)
          for (let x = 0; x < AS; x++) {
            const dx = (hAt(x + 1, y) - hAt(x - 1, y)) * 0.5, dy = (hAt(x, y + 1) - hAt(x, y - 1)) * 0.5, l = Math.hypot(dx, dy, 1), o = (y * AS + x) * 4, hh = hAt(x, y);
            im.data[o] = 128 - (dx / l) * 127;
            im.data[o + 1] = 128 + (dy / l) * 127;
            im.data[o + 2] = 128 + (1 / l) * 127;
            im.data[o + 3] = 255;
            im2.data[o] = im2.data[o + 2] = 0;
            im2.data[o + 1] = hh > 0.5 ? 168 : hh < -0.5 ? 250 : 222;
            im2.data[o + 3] = 255;
          }
        c.putImageData(im, 0, 0);
        c2.putImageData(im2, 0, 0);
      }
      const asphN = new THREE.CanvasTexture(ncv);
      asphN.wrapS = asphN.wrapT = THREE.RepeatWrapping;
      asphN.anisotropy = 8;
      const asphR = new THREE.CanvasTexture(rcv);
      asphR.wrapS = asphR.wrapT = THREE.RepeatWrapping;
      asphR.anisotropy = 4;
      // 広い範囲のむら(色・つや)に使う、つなぎ目のない雲もよう。赤・緑・青に別々の模様
      const macro = (() => {
        const N = 256, data = new Uint8Array(N * N * 4);
        const lat = (ch, o, x, y, per) => hash((((x % per) + per) % per) * 131 + (((y % per) + per) % per) * 7919 + ch * 977 + o * 3301);
        for (let y = 0; y < N; y++)
          for (let x = 0; x < N; x++)
            for (let ch = 0; ch < 3; ch++) {
              let v = 0, amp = 0.5, per = 4;
              for (let o = 0; o < 5; o++, amp *= 0.5, per *= 2) {
                const fx = (x / N) * per, fy = (y / N) * per, x0 = Math.floor(fx), y0 = Math.floor(fy);
                let tx = fx - x0, ty = fy - y0;
                (tx = tx * tx * (3 - 2 * tx)), (ty = ty * ty * (3 - 2 * ty));
                const a = lat(ch, o, x0, y0, per), b = lat(ch, o, x0 + 1, y0, per), c = lat(ch, o, x0, y0 + 1, per), d = lat(ch, o, x0 + 1, y0 + 1, per);
                v += amp * (a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty);
              }
              data[(y * N + x) * 4 + ch] = Math.max(0, Math.min(255, (v - 0.5) * 1.7 * 255 + 128));
            }
        for (let i = 3; i < data.length; i += 4) data[i] = 255;
        const t = new THREE.DataTexture(data, N, N, THREE.RGBAFormat);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.magFilter = THREE.LinearFilter;
        t.minFilter = THREE.LinearMipmapLinearFilter;
        t.generateMipmaps = true;
        t.needsUpdate = true;
        return t;
      })();
      // アスファルトの材質: 同じ絵を、向きと大きさを変えた2枚で場所ごとにまぜ(繰り返しを目立たなくする)、
      // 広い範囲の色むら・つやのむら(古い舗装のあせ、すり減り、しみ)を、場所(世界の x,z)から決める
      const asphMat = new THREE.MeshStandardMaterial({ map: asph, normalMap: asphN, normalScale: new THREE.Vector2(0.9, 0.9), roughnessMap: asphR, roughness: 0.95, metalness: 0, envMapIntensity: 0.55 });
      asphMat.onBeforeCompile = (sh) => {
        sh.uniforms.uClip = clipU.uClip;
        sh.uniforms.uMacro = { value: macro };
        sh.fragmentShader = "uniform float uClip;\nuniform sampler2D uMacro;\n" + sh.fragmentShader
          .replace("#include <clipping_planes_fragment>", "if (length(vViewPosition) > uClip) discard;\n#include <clipping_planes_fragment>")
          .replace("#include <map_fragment>", `
            vec2 rdW = vUv * 3.0; // 世界の x,z(m)
            vec3 rdA = texture2D(uMacro, rdW * 0.0137).rgb;
            vec3 rdB = texture2D(uMacro, rdW.yx * 0.071 + 0.37).rgb;
            vec4 rdT1 = texture2D(map, vUv);
            vec4 rdT2 = texture2D(map, vec2(vUv.x * 0.62 - vUv.y * 0.78, vUv.x * 0.78 + vUv.y * 0.62) * 0.77 + 0.19);
            vec4 sampledDiffuseColor = mix(rdT1, rdT2, smoothstep(0.42, 0.58, rdB.b));
            sampledDiffuseColor.rgb *= 0.72 + 0.4 * rdA.r + 0.22 * (rdB.r - 0.5);
            sampledDiffuseColor.rgb = mix(sampledDiffuseColor.rgb, sampledDiffuseColor.rgb * vec3(1.1, 1.05, 0.96) + 0.012, smoothstep(0.35, 0.8, rdA.g));
            // 黒っぽいしみ(油・水のあと)
            sampledDiffuseColor.rgb *= 1.0 - 0.3 * smoothstep(0.66, 0.8, rdB.g) * smoothstep(0.4, 0.6, rdA.b);
            diffuseColor *= sampledDiffuseColor;`)
          .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\n roughnessFactor = clamp(roughnessFactor * (0.8 + 0.34 * rdA.b - 0.1 * smoothstep(0.66, 0.8, rdB.g)), 0.25, 1.0);");
      };
      asphMat.customProgramCacheKey = () => "asph2";
      // 縁石: コンクリートのブロック(長さ0.6m)のつなぎ目と、よごれ
      const curbT = tex((c) => {
        c.fillStyle = "#a9a8a2";
        c.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 5000; i++) {
          const v = 120 + Math.floor(hash(i * 3 + 9) * 90);
          c.fillStyle = `rgba(${v},${v},${v - 4},0.35)`;
          c.fillRect(hash(i * 5 + 1) * 256, hash(i * 7 + 2) * 256, 1.5, 1.5);
        }
        for (let i = 0; i < 14; i++) {
          const x = hash(i * 11 + 3) * 256, w = 6 + hash(i * 13) * 26, g = c.createLinearGradient(0, 0, 0, 256);
          g.addColorStop(0, "rgba(40,38,34,0)");
          g.addColorStop(1, "rgba(40,38,34,0.3)");
          c.fillStyle = g;
          c.fillRect(x, 0, w, 256);
        }
        c.fillStyle = "rgba(30,30,30,0.7)";
        for (const x of [0, 128]) c.fillRect(x, 0, 3, 256);
        c.fillStyle = "rgba(255,255,255,0.18)";
        c.fillRect(0, 0, 256, 10);
        c.fillStyle = "rgba(25,25,25,0.4)";
        c.fillRect(0, 236, 256, 20);
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
        asph: asphMat,
        walk: new THREE.MeshLambertMaterial({ map: walk }),
        curb: new THREE.MeshLambertMaterial({ map: curbT, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 }),
        isl: new THREE.MeshLambertMaterial({ color: 0x6f8a5a }),
        // 路面に貼る薄い絵(標示・ふた・補修跡)。路面とちらつかないよう、奥行きを少し手前に寄せる
        decal: new THREE.MeshStandardMaterial({ map: markAtlas(), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -6, roughness: 0.72, metalness: 0, envMapIntensity: 0.5, vertexColors: true }),
        pole: new THREE.MeshLambertMaterial({ color: 0x9d9c97 }),
        dark: new THREE.MeshLambertMaterial({ color: 0x4a4c50 }),
        wire: new THREE.LineBasicMaterial({ color: 0x1c1c1e }),
        trunk: new THREE.MeshLambertMaterial({ color: 0x5a4632 }),
        leaf: new THREE.MeshLambertMaterial({ color: 0xffffff }),
        // 葉のかたまりの絵(すき間のある葉むら)。板に貼って、いろいろな向きに重ねる
        // 葉むらの絵(小枝と、先のとがった葉。葉には葉脈と明るいふち、奥の葉は暗く)。板に貼って、いろいろな向きに重ねる
        leafCard: (() => {
          const cv = document.createElement("canvas");
          cv.width = cv.height = 512;
          const c = cv.getContext("2d");
          // 小枝
          c.strokeStyle = "#4a3a28";
          c.lineCap = "round";
          for (let i = 0; i < 9; i++) {
            let x = 256, y = 256, a = (i / 9) * 6.28 + hash(i * 3) * 0.5;
            c.lineWidth = 5;
            c.beginPath();
            c.moveTo(x, y);
            for (let k = 0; k < 7; k++) ((a += (hash(i * 7 + k) - 0.5) * 0.7), (x += Math.cos(a) * 30), (y += Math.sin(a) * 30), c.lineTo(x, y));
            c.stroke();
          }
          // 葉: 奥(暗い)→ 手前(明るい)の順に重ねる
          for (let i = 0; i < 900; i++) {
            const layer = i / 900, a = hash(i * 3) * 6.28, r = Math.sqrt(hash(i * 5 + 1)) * 226, x = 256 + Math.cos(a) * r, y = 256 + Math.sin(a) * r * 0.94;
            const l = (70 + layer * 110 + hash(i * 7) * 50) * (0.7 + (1 - y / 512) * 0.45), L2 = 11 + hash(i * 13) * 10, W2 = 4.5 + hash(i * 17) * 4;
            c.save();
            c.translate(x, y);
            c.rotate(hash(i * 11) * 6.28);
            c.fillStyle = `rgb(${Math.floor(l * 0.58)},${Math.floor(l)},${Math.floor(l * 0.42)})`;
            c.beginPath();
            c.moveTo(-L2, 0);
            c.quadraticCurveTo(0, -W2 * 1.5, L2, 0);
            c.quadraticCurveTo(0, W2 * 1.5, -L2, 0);
            c.fill();
            c.strokeStyle = `rgba(${Math.floor(l * 0.8)},${Math.min(255, Math.floor(l * 1.25))},${Math.floor(l * 0.55)},0.8)`;
            c.lineWidth = 0.8;
            c.beginPath();
            c.moveTo(-L2, 0);
            c.lineTo(L2, 0);
            c.stroke();
            c.restore();
          }
          const t = new THREE.CanvasTexture(cv);
          t.encoding = THREE.sRGBEncoding;
          t.anisotropy = 8;
          const lm = new THREE.MeshLambertMaterial({ map: t, alphaTest: 0.5, side: THREE.DoubleSide, color: 0xffffff });
          // 風でゆれる(葉むらごとに、少しずつずれて)。Googleの3Dと組み合わせるときは、遠くを描かない
          lm.onBeforeCompile = (sh) => {
            sh.uniforms.uT = popU.uPopT;
            sh.uniforms.uClip = clipU.uClip;
            sh.vertexShader = "uniform float uT;\n" + sh.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
              #ifdef USE_INSTANCING
                float wph = instanceMatrix[3][0] * 0.7 + instanceMatrix[3][2] * 0.9 + instanceMatrix[3][1] * 1.3;
                transformed.x += sin(uT * 1.7 + wph) * 0.05 + sin(uT * 3.9 + wph * 2.0 + position.y * 2.0) * 0.02;
                transformed.y += sin(uT * 2.3 + wph * 1.3 + position.x * 2.0) * 0.03;
              #endif`);
            sh.fragmentShader = "uniform float uClip;\n" + sh.fragmentShader.replace("#include <clipping_planes_fragment>", "if (length(vViewPosition) > uClip) discard;\n#include <clipping_planes_fragment>");
          };
          lm.customProgramCacheKey = () => "leafwind";
          return lm;
        })(),
        // 幹: 樹皮のたてのすじ
        bark: (() => {
          const cv = document.createElement("canvas");
          cv.width = 64;
          cv.height = 128;
          const c = cv.getContext("2d");
          c.fillStyle = "#6a5642";
          c.fillRect(0, 0, 64, 128);
          for (let i = 0; i < 90; i++) {
            const v = 50 + Math.floor(hash(i * 3) * 70);
            c.fillStyle = `rgba(${v + 20},${v + 5},${v - 10},0.55)`;
            c.fillRect(hash(i * 5) * 64, hash(i * 7) * 128, 1 + hash(i * 11) * 2.5, 8 + hash(i * 13) * 34);
          }
          const t = new THREE.CanvasTexture(cv);
          t.encoding = THREE.sRGBEncoding;
          t.wrapS = t.wrapT = THREE.RepeatWrapping;
          return new THREE.MeshLambertMaterial({ map: t });
        })(),
        soil: new THREE.MeshLambertMaterial({ color: 0x4a3c2c }),
        grate: new THREE.MeshLambertMaterial({ color: 0x8c8a84 }),
        rail: new THREE.MeshLambertMaterial({ color: 0xf4f4f0, side: THREE.DoubleSide }),
        stripe: new THREE.MeshBasicMaterial({ color: 0x35d6ff, transparent: true, opacity: 0.42, depthWrite: false, side: THREE.DoubleSide }),
      };
      for (const k in M) clipMat(M[k]);
      return M;
    }
    // ---- 路面の標示・ふた・補修跡の絵(1枚にまとめる) ----
    // 白線・停止線・横断歩道・「止まれ」・矢印・速度の数字・自転車ナビマーク・マンホール・側溝のふた・補修跡・ひびを、
    // かすれやよごれをつけて描く。路面に薄い板として貼る(厚みはない)。CELLS[名前] = [u0, 上のv, u1, 下のv]
    let CELLS = null;
    function markAtlas() {
      const THREE = T(), S = 2048, PAD = 6;
      const cv = document.createElement("canvas");
      cv.width = cv.height = S;
      const c0 = cv.getContext("2d");
      CELLS = {};
      const fills = [];
      let px = PAD, py = PAD, rowH = 0;
      const add = (name, w, h, bleed, draw) => {
        if (px + w + PAD > S) (px = PAD), (py += rowH + PAD * 2), (rowH = 0);
        const t = document.createElement("canvas");
        t.width = w;
        t.height = h;
        draw(t.getContext("2d"), w, h);
        c0.drawImage(t, px, py);
        CELLS[name] = [(px + 0.5) / S, (py + 0.5) / S, (px + w - 0.5) / S, (py + h - 0.5) / S];
        fills.push([px - PAD, py - PAD, w + PAD * 2, h + PAD * 2, bleed]);
        px += w + PAD * 2;
        rowH = Math.max(rowH, h);
      };
      const rnd = (seed) => {
        let s = seed * 7919;
        return () => hash((s += 104729));
      };
      const WHITE = [236, 234, 227], YEL = [232, 164, 30], BLUE = [44, 108, 206], IRON = [58, 56, 54], DARK = [30, 31, 33], CONC = [160, 158, 151];
      const css = (k, a = 1) => `rgba(${k[0]},${k[1]},${k[2]},${a})`;
      // 塗料のかすれ・はがれ・ひび・よごれ(すでに描いた形の中だけに効く)。amt: 0=新しい 〜 1=かなり古い
      const wear = (c, w, h, seed, amt) => {
        const r = rnd(seed), big = Math.max(w, h);
        c.globalCompositeOperation = "destination-out";
        for (let i = 0, n = w * h * 0.02 * amt; i < n; i++) {
          c.fillStyle = `rgba(0,0,0,${0.3 + r() * 0.7})`;
          const s = r() < 0.12 ? 3 : r() < 0.5 ? 2 : 1;
          c.fillRect(r() * w, r() * h, s, s * (1 + r() * 2));
        }
        for (let i = 0; i < 2 + 4 * amt; i++) {
          const x = r() * w, y = r() * h, rad = (0.1 + r() * 0.3) * big, g = c.createRadialGradient(x, y, 0, x, y, rad);
          g.addColorStop(0, `rgba(0,0,0,${0.15 + 0.5 * amt * r()})`);
          g.addColorStop(1, "rgba(0,0,0,0)");
          c.fillStyle = g;
          c.fillRect(x - rad, y - rad, rad * 2, rad * 2);
        }
        c.strokeStyle = "rgba(0,0,0,0.9)";
        for (let i = 0; i < 2 + amt * 5; i++) {
          let x = r() * w, y = r() * h, a = r() * 6.28;
          c.lineWidth = 0.8 + r() * 1.4;
          c.beginPath();
          c.moveTo(x, y);
          for (let k = 0; k < 14; k++) ((a += (r() - 0.5) * 1.2), (x += Math.cos(a) * (4 + r() * 8)), (y += Math.sin(a) * (4 + r() * 8)), c.lineTo(x, y));
          c.stroke();
        }
        c.globalCompositeOperation = "source-atop";
        c.fillStyle = `rgba(92,88,80,${0.1 + 0.1 * amt})`;
        c.fillRect(0, 0, w, h);
        for (let i = 0; i < 7; i++) {
          const x = r() * w, y = r() * h, rad = (0.08 + r() * 0.25) * big, g = c.createRadialGradient(x, y, 0, x, y, rad);
          g.addColorStop(0, `rgba(56,52,46,${0.12 + 0.2 * r()})`);
          g.addColorStop(1, "rgba(56,52,46,0)");
          c.fillStyle = g;
          c.fillRect(x - rad, y - rad, rad * 2, rad * 2);
        }
        c.globalCompositeOperation = "source-over";
      };
      // 砂目(コンクリート・鉄・補修したアスファルトのざらつき)
      const speck = (c, w, h, seed, n, lo, hi, a) => {
        const r = rnd(seed);
        for (let i = 0; i < n; i++) {
          const v = lo + Math.floor(r() * (hi - lo));
          c.fillStyle = `rgba(${v},${v},${v},${a})`;
          c.fillRect(r() * w, r() * h, 1 + r() * 1.5, 1 + r() * 1.5);
        }
      };
      const paint = (name, w, h, col, seed, amt, shape) =>
        add(name, w, h, col, (c) => {
          c.fillStyle = css(col, 0.96);
          c.strokeStyle = css(col, 0.96);
          shape(c, w, h);
          wear(c, w, h, seed, amt);
        });
      // 背の高い絵を先に1段にならべる
      paint("zebra0", 96, 768, WHITE, 5, 0.5, (c, w, h) => c.fillRect(0, 0, w, h));
      paint("zebra1", 96, 768, WHITE, 6, 1, (c, w, h) => c.fillRect(0, 0, w, h));
      // 「止まれ」(進む向きに 止→ま→れ の順にならぶ。たてに引きのばした字)
      paint("tomare", 200, 868, WHITE, 7, 0.6, (c, w) => {
        c.font = "900 175px 'Hiragino Kaku Gothic ProN','Hiragino Sans','Noto Sans JP','Noto Sans CJK JP','Yu Gothic',sans-serif";
        c.textAlign = "center";
        c.textBaseline = "middle";
        ["れ", "ま", "止"].forEach((ch, i) => {
          c.save();
          c.translate(w / 2, 132 + i * 302);
          c.scale(1.08, 1.5);
          c.fillText(ch, 0, 7, 178);
          c.restore();
        });
      });
      // 進行方向の矢印: 直進 / 直進と左折
      const arrow = (c, x) => {
        c.beginPath();
        c.moveTo(x, 0), c.lineTo(x + 70, 300), c.lineTo(x + 17, 300), c.lineTo(x + 17, 800), c.lineTo(x - 17, 800), c.lineTo(x - 17, 300), c.lineTo(x - 70, 300);
        c.fill();
      };
      paint("arrowS", 144, 800, WHITE, 8, 0.55, (c) => arrow(c, 72));
      paint("arrowSL", 240, 800, WHITE, 9, 0.6, (c) => {
        arrow(c, 180);
        c.lineWidth = 34;
        c.beginPath();
        c.moveTo(180, 640), c.lineTo(96, 420);
        c.stroke();
        c.beginPath();
        c.moveTo(6, 410), c.lineTo(112, 318), c.lineTo(112, 500);
        c.fill();
      });
      // 制限速度の数字(黄色。たてに引きのばした字)
      for (const n of ["30", "40", "50"])
        paint("n" + n, 280, 800, YEL, 10 + Number(n), 0.55, (c, w, h) => {
          c.font = "900 250px 'Helvetica Neue',Arial,sans-serif";
          c.textAlign = "center";
          c.textBaseline = "middle";
          c.translate(w / 2, h / 2);
          c.scale(1, 3.3);
          c.fillText(n, 0, 8, 262);
          c.setTransform(1, 0, 0, 1, 0, 0);
        });
      // 自転車ナビマーク(白い自転車の絵と、進む向きの矢印)
      paint("bike", 180, 640, WHITE, 20, 0.5, (c) => {
        c.beginPath();
        c.moveTo(90, 0), c.lineTo(176, 150), c.lineTo(176, 215), c.lineTo(90, 70), c.lineTo(4, 215), c.lineTo(4, 150);
        c.fill();
        c.translate(0, 250);
        c.scale(1, 1.7);
        c.lineWidth = 11;
        c.lineJoin = c.lineCap = "round";
        for (const x of [45, 135]) (c.beginPath(), c.arc(x, 150, 36, 0, 7), c.stroke());
        c.beginPath();
        c.moveTo(45, 150), c.lineTo(72, 92), c.lineTo(122, 92), c.lineTo(135, 150);
        c.moveTo(72, 92), c.lineTo(92, 150), c.lineTo(45, 150);
        c.moveTo(92, 150), c.lineTo(122, 92), c.lineTo(116, 68), c.lineTo(134, 62);
        c.moveTo(60, 76), c.lineTo(84, 76);
        c.moveTo(72, 92), c.lineTo(72, 76);
        c.stroke();
        c.setTransform(1, 0, 0, 1, 0, 0);
      });
      // 白線(2種類)・黄色の線・停止線・横断歩道の白い帯(2種類)
      paint("line0", 768, 32, WHITE, 1, 0.45, (c, w, h) => c.fillRect(0, 0, w, h));
      paint("line1", 768, 32, WHITE, 2, 0.9, (c, w, h) => c.fillRect(0, 0, w, h));
      paint("lineY", 768, 32, YEL, 3, 0.6, (c, w, h) => c.fillRect(0, 0, w, h));
      paint("stopln", 768, 96, WHITE, 4, 0.55, (c, w, h) => c.fillRect(0, 0, w, h));
      // 側溝のふた(コンクリートのふたが4枚ならぶ。両はしに手をかける切り欠き)
      add("lids", 768, 116, CONC, (c, w, h) => {
        c.fillStyle = "#8f8d86";
        c.fillRect(0, 0, w, h);
        speck(c, w, h, 31, 9000, 90, 180, 0.4);
        const r = rnd(32);
        for (let i = 0; i < 4; i++) {
          const x = i * 192;
          c.fillStyle = `rgba(${r() < 0.5 ? "0,0,0" : "255,255,255"},${0.03 + r() * 0.07})`;
          c.fillRect(x, 0, 192, h);
          c.fillStyle = "rgba(20,20,20,0.85)";
          c.fillRect(x - 1.5, 0, 3, h);
          for (const y of [8, h - 8]) (c.beginPath(), c.ellipse(x + 96, y, 16, 6, 0, 0, 7), c.fill());
        }
        c.fillStyle = "rgba(20,20,20,0.7)";
        c.fillRect(0, 0, w, 3);
        c.fillRect(0, h - 3, w, 3);
        for (let i = 0; i < 8; i++) {
          const x = r() * w, y = r() * h, rad = 20 + r() * 60, g = c.createRadialGradient(x, y, 0, x, y, rad);
          g.addColorStop(0, `rgba(50,52,40,${0.12 + r() * 0.2})`);
          g.addColorStop(1, "rgba(50,52,40,0)");
          c.fillStyle = g;
          c.fillRect(x - rad, y - rad, rad * 2, rad * 2);
        }
      });
      // 街渠(縁石の足もとのコンクリートの帯)。上が縁石側: 縁石ぎわに土やよごれがたまる
      add("apron", 768, 160, CONC, (c, w, h) => {
        c.fillStyle = "#96948d";
        c.fillRect(0, 0, w, h);
        speck(c, w, h, 41, 12000, 95, 190, 0.4);
        const g = c.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, "rgba(48,44,36,0.55)");
        g.addColorStop(0.3, "rgba(48,44,36,0.12)");
        g.addColorStop(1, "rgba(48,44,36,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, w, h);
        const r = rnd(42);
        for (let i = 0; i < 10; i++) {
          const x = r() * w, rad = 14 + r() * 50, gg = c.createRadialGradient(x, 6, 0, x, 6, rad);
          gg.addColorStop(0, `rgba(40,42,30,${0.2 + r() * 0.3})`);
          gg.addColorStop(1, "rgba(40,42,30,0)");
          c.fillStyle = gg;
          c.fillRect(x - rad, 0, rad * 2, rad + 6);
        }
        c.fillStyle = "rgba(22,22,22,0.75)";
        c.fillRect(0, h - 3, w, 3);
        c.fillRect(-1, 0, 3, h);
        c.fillRect(383, 0, 2, h);
      });
      // 四角い小さなふた(しま鋼板)と、水道の小さな丸いふた
      add("hh", 160, 160, IRON, (c, w) => {
        c.fillStyle = "rgba(22,22,23,0.9)";
        c.fillRect(0, 0, w, w);
        c.fillStyle = "#77736c";
        c.fillRect(4, 4, w - 8, w - 8);
        c.fillStyle = "#4b4a4a";
        c.fillRect(11, 11, w - 22, w - 22);
        c.fillStyle = "rgba(20,20,21,0.7)";
        for (let y = 18; y < w - 20; y += 12) for (let x = 18; x < w - 20; x += 12) (c.save(), c.translate(x + 4, y + 4), c.rotate(((x + y) / 12) & 1 ? 0.785 : -0.785), c.fillRect(-4.5, -1.3, 9, 2.6), c.restore());
        speck(c, w, w, 71, 1800, 90, 220, 0.2);
      });
      add("valve", 96, 96, IRON, (c, w) => {
        c.fillStyle = "rgba(22,22,23,0.9)";
        c.beginPath(), c.arc(48, 48, 47, 0, 7), c.fill();
        c.fillStyle = "#7a7062";
        c.beginPath(), c.arc(48, 48, 43, 0, 7), c.fill();
        c.fillStyle = "#3f4a5c";
        c.beginPath(), c.arc(48, 48, 35, 0, 7), c.fill();
        c.strokeStyle = "rgba(15,15,16,0.8)";
        c.lineWidth = 4;
        c.beginPath(), c.arc(48, 48, 20, 0, 7), c.moveTo(20, 48), c.lineTo(76, 48), c.stroke();
        c.globalCompositeOperation = "source-atop";
        speck(c, w, w, 72, 700, 60, 210, 0.25);
        c.globalCompositeOperation = "source-over";
      });
      // 掘り返して埋めた跡(細長い帯)。長い辺にシールの黒い線
      add("trench", 768, 160, DARK, (c, w, h) => {
        c.fillStyle = "rgba(34,35,38,0.62)";
        c.fillRect(0, 0, w, h);
        speck(c, w, h, 51, 14000, 20, 110, 0.35);
        const r = rnd(52);
        c.strokeStyle = "rgba(8,8,9,0.85)";
        for (const y0 of [3, h - 3]) {
          c.lineWidth = 3.5;
          c.beginPath();
          c.moveTo(0, y0);
          for (let x = 0; x <= w; x += 24) c.lineTo(x, y0 + (r() - 0.5) * 3);
          c.stroke();
        }
      });
      // 自転車ナビライン(青い矢羽根・2種類)
      for (const k of [0, 1])
        paint("chev" + k, 150, 300, BLUE, 22 + k, 0.45 + k * 0.45, (c) => {
          c.beginPath();
          c.moveTo(75, 0), c.lineTo(150, 170), c.lineTo(150, 300), c.lineTo(75, 130), c.lineTo(0, 300), c.lineTo(0, 170);
          c.fill();
        });
      // マンホールのふた(3種類: 同心円 / 格子 / 放射。実在の柄ではない)
      for (const k of [0, 1, 2])
        add("mh" + k, 224, 224, IRON, (c, w) => {
          const R = w / 2, r = rnd(60 + k);
          c.translate(R, R);
          c.fillStyle = "rgba(24,24,25,0.9)";
          c.beginPath(), c.arc(0, 0, R - 1, 0, 7), c.fill();
          c.fillStyle = "#6e6a64";
          c.beginPath(), c.arc(0, 0, R - 5, 0, 7), c.fill();
          c.fillStyle = "#1b1b1c";
          c.beginPath(), c.arc(0, 0, R - 15, 0, 7), c.fill();
          const g = c.createRadialGradient(-20, -24, 6, 0, 0, R);
          g.addColorStop(0, ["#6a655f", "#5d5c5e", "#6b5f55"][k]);
          g.addColorStop(1, ["#45423f", "#3c3c3f", "#473e37"][k]);
          c.fillStyle = g;
          c.beginPath(), c.arc(0, 0, R - 18, 0, 7), c.fill();
          c.strokeStyle = "rgba(18,18,19,0.85)";
          c.fillStyle = "rgba(18,18,19,0.85)";
          c.lineWidth = 5;
          if (k === 0) {
            for (const q of [78, 58, 38]) (c.beginPath(), c.arc(0, 0, q, 0, 7), c.stroke());
            for (let i = 0; i < 24; i++) (c.rotate(6.2832 / 24), c.fillRect(-2.5, 62, 5, 14), i % 2 || c.fillRect(-2.5, 42, 5, 13));
            c.beginPath(), c.arc(0, 0, 16, 0, 7), c.fill();
          } else if (k === 1) {
            c.save();
            c.beginPath(), c.arc(0, 0, R - 24, 0, 7), c.clip();
            for (let y = -96; y < 96; y += 19) for (let x = -96; x < 96; x += 19) c.fillRect(x + ((y / 19) & 1 ? 9 : 0), y, 11, 11);
            c.restore();
          } else {
            for (let i = 0; i < 16; i++) (c.rotate(6.2832 / 16), c.beginPath(), c.ellipse(0, 54, 9, 26, 0, 0, 7), c.stroke());
            c.beginPath(), c.arc(0, 0, 22, 0, 7), c.stroke();
          }
          // かぎ穴と、すり減って光った所・さび
          for (const a of [0.4, 3.54]) (c.beginPath(), c.arc(Math.cos(a) * 80, Math.sin(a) * 80, 5, 0, 7), c.fill());
          c.setTransform(1, 0, 0, 1, 0, 0);
          c.globalCompositeOperation = "source-atop";
          for (let i = 0; i < 2600; i++) {
            const v = r() < 0.6 ? 150 + r() * 70 : 30;
            c.fillStyle = `rgba(${v},${v * 0.97},${v * 0.92},${0.1 + r() * 0.25})`;
            c.fillRect(r() * w, r() * w, 1 + r() * 2, 1 + r() * 2);
          }
          for (let i = 0; i < 5; i++) {
            const x = r() * w, y = r() * w, rad = 20 + r() * 50, gg = c.createRadialGradient(x, y, 0, x, y, rad);
            gg.addColorStop(0, `rgba(120,70,36,${0.1 + r() * 0.16})`);
            gg.addColorStop(1, "rgba(120,70,36,0)");
            c.fillStyle = gg;
            c.fillRect(x - rad, y - rad, rad * 2, rad * 2);
          }
          c.globalCompositeOperation = "source-over";
        });
      // グレーチング(鉄の格子のふた)
      add("grate", 256, 192, IRON, (c, w, h) => {
        c.fillStyle = "#0d0d0e";
        c.fillRect(0, 0, w, h);
        c.fillStyle = "#74777a";
        for (let x = 10; x < w - 8; x += 13) c.fillRect(x, 8, 4.5, h - 16);
        c.fillStyle = "#8b8e90";
        for (let y = 36; y < h - 20; y += 40) c.fillRect(8, y, w - 16, 3);
        c.strokeStyle = "#8a8c8c";
        c.lineWidth = 9;
        c.strokeRect(4.5, 4.5, w - 9, h - 9);
        c.strokeStyle = "rgba(15,15,15,0.8)";
        c.lineWidth = 2;
        c.strokeRect(1, 1, w - 2, h - 2);
        const r = rnd(73);
        for (let i = 0; i < 1500; i++) {
          c.fillStyle = `rgba(${r() < 0.5 ? "110,66,34" : "30,30,30"},${0.1 + r() * 0.25})`;
          c.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 3);
        }
      });
      // 補修跡(四角。新しくて黒い / 古くて白っぽい)
      for (const k of [0, 1])
        add("patch" + k, 320, 240, k ? [118, 116, 110] : DARK, (c, w, h) => {
          const r = rnd(80 + k);
          c.fillStyle = k ? "rgba(132,130,124,0.4)" : "rgba(30,31,34,0.66)";
          c.fillRect(3, 3, w - 6, h - 6);
          speck(c, w, h, 81 + k, 9000, k ? 70 : 18, k ? 190 : 105, 0.33);
          c.strokeStyle = k ? "rgba(20,20,21,0.55)" : "rgba(8,8,9,0.9)";
          c.lineWidth = k ? 2.5 : 4;
          c.beginPath();
          const pts = [[3, 3], [w - 3, 3], [w - 3, h - 3], [3, h - 3], [3, 3]];
          c.moveTo(3, 3);
          for (let i = 0; i < 4; i++) for (let t = 1; t <= 10; t++) c.lineTo(pts[i][0] + ((pts[i + 1][0] - pts[i][0]) * t) / 10 + (r() - 0.5) * 2.5, pts[i][1] + ((pts[i + 1][1] - pts[i][1]) * t) / 10 + (r() - 0.5) * 2.5);
          c.stroke();
        });
      // ひび(1本のひび / 亀の甲のひび / ひびをふさいだ黒いシール)
      for (const k of [0, 1, 2])
        add("crack" + k, 448, 224, [14, 14, 15], (c, w, h) => {
          const r = rnd(90 + k);
          c.lineCap = c.lineJoin = "round";
          const walk = (x, y, a, n, lw, al, wob) => {
            c.strokeStyle = `rgba(12,12,13,${al})`;
            c.lineWidth = lw;
            c.beginPath();
            c.moveTo(x, y);
            for (let i = 0; i < n; i++) {
              a += (r() - 0.5) * wob;
              (x += Math.cos(a) * 9), (y += Math.sin(a) * 9);
              if (x < 6 || x > w - 6 || y < 6 || y > h - 6) break;
              c.lineTo(x, y);
              if (k < 2 && lw > 1.2 && r() < 0.07) (c.stroke(), walk(x, y, a + (r() < 0.5 ? 1 : -1) * (0.6 + r() * 0.6), 12, lw * 0.6, al * 0.85, wob), (c.strokeStyle = `rgba(12,12,13,${al})`), (c.lineWidth = lw), c.beginPath(), c.moveTo(x, y));
            }
            c.stroke();
          };
          if (k === 0) (walk(10, 110 + r() * 40, 0, 56, 2.2, 0.8, 0.7), walk(140, 30, 0.9, 30, 1.4, 0.6, 0.9));
          else if (k === 1) {
            for (let i = 0; i < 26; i++) walk(60 + r() * (w - 120), 40 + r() * (h - 80), r() * 6.28, 7 + r() * 8, 1.1 + r() * 1.1, 0.5 + r() * 0.3, 1.3);
          } else (walk(8, 90 + r() * 70, 0.05, 56, 6.5, 0.92, 0.5), walk(200, 20, 1.2, 22, 5.5, 0.9, 0.5));
        });
      if (py + rowH > S) console.warn("路面の絵が1枚に入りきっていません");
      // 透明な所の色を、まわりの絵の色にしておく(遠くで縮めたとき、ふちが黒ずまないように)
      const im = c0.getImageData(0, 0, S, S), d = im.data;
      for (const [fx, fy, fw, fh, col] of fills)
        for (let y = Math.max(0, fy); y < Math.min(S, fy + fh); y++)
          for (let x = Math.max(0, fx), o = (y * S + x) * 4; x < Math.min(S, fx + fw); x++, o += 4) if (d[o + 3] === 0) (d[o] = col[0]), (d[o + 1] = col[1]), (d[o + 2] = col[2]);
      const tex = new THREE.DataTexture(new Uint8Array(d.buffer), S, S, THREE.RGBAFormat);
      tex.encoding = THREE.sRGBEncoding;
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.generateMipmaps = true;
      tex.anisotropy = 16;
      tex.needsUpdate = true;
      return tex;
    }
    // ---- 路面の高さ: 路面の三角形を4mのマスに分けて覚えておき、標示をのせる点の高さを「面」から求める ----
    // (地面の高さをじかに使うと、大きな三角形の途中で標示が路面より浮いたり埋まったりする)
    const SC = 4, surf = new Map(); // "x:z" → { a: [頂点の配列…], o: [三角形の先頭…] }
    function surfAdd(arr) {
      const keys = new Set();
      for (let o = 0; o + 8 < arr.length; o += 9) {
        const x0 = Math.floor(Math.min(arr[o], arr[o + 3], arr[o + 6]) / SC), x1 = Math.floor(Math.max(arr[o], arr[o + 3], arr[o + 6]) / SC);
        const z0 = Math.floor(Math.min(arr[o + 2], arr[o + 5], arr[o + 8]) / SC), z1 = Math.floor(Math.max(arr[o + 2], arr[o + 5], arr[o + 8]) / SC);
        for (let x = x0; x <= x1; x++)
          for (let z = z0; z <= z1; z++) {
            const k = x + ":" + z;
            let c = surf.get(k);
            if (!c) surf.set(k, (c = { a: [], o: [] }));
            c.a.push(arr), c.o.push(o), keys.add(k);
          }
      }
      return keys;
    }
    function surfDrop(arr, keys) {
      for (const k of keys) {
        const c = surf.get(k);
        if (!c) continue;
        const a = [], o = [];
        for (let i = 0; i < c.a.length; i++) if (c.a[i] !== arr) (a.push(c.a[i]), o.push(c.o[i]));
        if (a.length) (c.a = a), (c.o = o);
        else surf.delete(k);
      }
    }
    function surfY(x, z) {
      const c = surf.get(Math.floor(x / SC) + ":" + Math.floor(z / SC));
      let best = -1e9;
      if (c)
        for (let i = 0; i < c.o.length; i++) {
          const a = c.a[i], o = c.o[i], ax = a[o], az = a[o + 2], bx = a[o + 3], bz = a[o + 5], cx = a[o + 6], cz = a[o + 8];
          const d = (bz - cz) * (ax - cx) + (cx - bx) * (az - cz);
          if (Math.abs(d) < 1e-9) continue;
          const u = ((bz - cz) * (x - cx) + (cx - bx) * (z - cz)) / d, v = ((cz - az) * (x - cx) + (ax - cx) * (z - cz)) / d, w = 1 - u - v;
          if (u < -1e-3 || v < -1e-3 || w < -1e-3) continue;
          const y = u * a[o + 1] + v * a[o + 4] + w * a[o + 7];
          if (y > best) best = y;
        }
      return best > -1e8 ? best : H(x, z) + 0.062;
    }
    // ---- 薄い絵をためて、1つのメッシュにする(区画ごと・ルートの区間ごとに1つ) ----
    function batch() {
      const THREE = T(), decalMat = mats().decal; // (絵と CELLS は mats() が1回だけ作る)
      const pos = [], uv = [], col = [];
      // 四角い絵: 中心(cx,cz)、絵の上の向き(fx,fz)、幅 w(横)・長さ l(たて)。1.4m以下のマスに割って路面にそわせる
      const quad = (name, cx, cz, fx, fz, w, l, sh = 1, ua = 0, ub = 1) => {
        const cl = CELLS[name];
        if (!cl) return;
        const rx = -fz, rz = fx, nu = Math.max(1, Math.ceil(w / 1.4)), nv = Math.max(1, Math.ceil(l / 1.4));
        const U0 = cl[0] + (cl[2] - cl[0]) * ua, U1 = cl[0] + (cl[2] - cl[0]) * ub, P = [];
        for (let j = 0; j <= nv; j++)
          for (let i = 0; i <= nu; i++) {
            const a = i / nu - 0.5, b = j / nv - 0.5, x = cx + rx * a * w + fx * b * l, z = cz + rz * a * w + fz * b * l;
            P.push(x, surfY(x, z) + 0.006, z, U0 + ((U1 - U0) * i) / nu, cl[3] + ((cl[1] - cl[3]) * j) / nv);
          }
        const put = (k) => (pos.push(P[k * 5], P[k * 5 + 1], P[k * 5 + 2]), uv.push(P[k * 5 + 3], P[k * 5 + 4]), col.push(sh, sh, sh));
        for (let j = 0; j < nv; j++)
          for (let i = 0; i < nu; i++) {
            const a = j * (nu + 1) + i, b = a + 1, d = a + nu + 1, c = d + 1;
            put(a), put(b), put(c), put(a), put(c), put(d);
          }
      };
      // 帯: a → b を幅 w で。絵の横の長さが per m にあたる。絵の上は、進む向きの左側。seed を渡すと、絵の使う場所を区切りごとに変える
      const band = (name, ax, az, bx, bz, w, per, sh = 1, seed = -1) => {
        const L = Math.hypot(bx - ax, bz - az);
        if (L < 0.05) return;
        const n = Math.ceil(L / Math.min(per, 2.4)), len = L / n, sp = Math.min(1, len / per), dx = (bx - ax) / L, dz = (bz - az) / L;
        for (let k = 0; k < n; k++) {
          const ua = seed < 0 ? 0 : hash(seed + k * 31 + Math.round(ax * 7 + az * 13)) * (1 - sp), t = (k + 0.5) * len;
          quad(name, ax + dx * t, az + dz * t, dz, -dx, len, w, sh, ua, ua + sp);
        }
      };
      const mesh = (order) => {
        if (!pos.length) return null;
        const geo = new THREE.BufferGeometry(), nor = new Float32Array(pos.length);
        for (let i = 1; i < nor.length; i += 3) nor[i] = 1;
        geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
        geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
        geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
        const m = new THREE.Mesh(geo, decalMat);
        m.receiveShadow = true;
        m.renderOrder = order;
        return m;
      };
      return { quad, band, mesh };
    }
    // 道ばたの物の材質と絵(1回だけ作る)
    let PM = null;
    function propMats() {
      if (PM) return PM;
      const THREE = T();
      const cvs = (w, h, draw) => {
        const cv = document.createElement("canvas");
        cv.width = w;
        cv.height = h;
        draw(cv.getContext("2d"), w, h);
        const t = new THREE.CanvasTexture(cv);
        t.encoding = THREE.sRGBEncoding;
        t.anisotropy = 4;
        return t;
      };
      const sign = (draw) => new THREE.MeshBasicMaterial({ map: cvs(128, 128, draw), transparent: true, alphaTest: 0.5, side: THREE.DoubleSide });
      PM = {
        // 自販機の正面
        vend: new THREE.MeshBasicMaterial({
          map: cvs(128, 256, (c, w, h) => {
            c.fillStyle = "#f3f3f0";
            c.fillRect(0, 0, w, h);
            const gr = c.createLinearGradient(0, 14, 0, 130);
            gr.addColorStop(0, "#eef4f7");
            gr.addColorStop(1, "#b9c6ce");
            c.fillStyle = gr;
            c.fillRect(8, 14, w - 16, 118);
            const col = ["#d83a3a", "#2f7dd0", "#e8b020", "#3aa860", "#f4f4f0", "#7a4ab0", "#e07030", "#20a0a8"];
            for (let r = 0; r < 3; r++) for (let q = 0; q < 8; q++) ((c.fillStyle = col[(q + r * 3) % 8]), c.fillRect(13 + q * 13, 22 + r * 37, 9, 26)), ((c.fillStyle = "rgba(255,255,255,0.75)"), c.fillRect(13 + q * 13, 50 + r * 37, 9, 4));
            c.fillStyle = "#2a2d31";
            c.fillRect(86, 142, 30, 44);
            c.fillStyle = "#9aa0a6";
            c.fillRect(92, 150, 18, 6);
            c.fillStyle = "#16181b";
            c.fillRect(12, 198, w - 24, 40);
            c.fillStyle = "#d0d4d8";
            c.fillRect(14, 142, 60, 44);
          }),
        }),
        body: new THREE.MeshLambertMaterial({ color: 0xffffff }),
        metal: new THREE.MeshLambertMaterial({ color: 0xb4b8bc }),
        orange: new THREE.MeshLambertMaterial({ color: 0xe8791c }),
        mirror: new THREE.MeshStandardMaterial({ color: 0xdde6ee, metalness: 1, roughness: 0.04, envMapIntensity: 1.5 }),
        pot: new THREE.MeshLambertMaterial({ color: 0xffffff }),
        // 電柱の黄色と黒のしま
        tiger: new THREE.MeshLambertMaterial({
          map: cvs(64, 32, (c, w, h) => {
            c.fillStyle = "#f2c81e";
            c.fillRect(0, 0, w, h);
            c.fillStyle = "#1a1a1a";
            for (let x = -h; x < w; x += 16) {
              c.beginPath();
              c.moveTo(x, h);
              c.lineTo(x + h, 0);
              c.lineTo(x + h + 8, 0);
              c.lineTo(x + 8, h);
              c.fill();
            }
          }),
        }),
        // 標識: 止まれ・最高速度30・一方通行
        stop: sign((c) => {
          c.fillStyle = "#fff";
          c.beginPath();
          c.moveTo(4, 8);
          c.lineTo(124, 8);
          c.lineTo(64, 122);
          c.fill();
          c.fillStyle = "#d21f1f";
          c.beginPath();
          c.moveTo(14, 14);
          c.lineTo(114, 14);
          c.lineTo(64, 110);
          c.fill();
          c.fillStyle = "#fff";
          c.font = "900 27px sans-serif";
          c.textAlign = "center";
          c.fillText("止まれ", 64, 52);
        }),
        s30: sign((c) => {
          c.fillStyle = "#d21f1f";
          c.beginPath();
          c.arc(64, 64, 60, 0, 7);
          c.fill();
          c.fillStyle = "#fff";
          c.beginPath();
          c.arc(64, 64, 45, 0, 7);
          c.fill();
          c.fillStyle = "#1c3f94";
          c.font = "900 54px sans-serif";
          c.textAlign = "center";
          c.fillText("30", 64, 84);
        }),
        oneway: sign((c) => {
          c.fillStyle = "#1c57b4";
          c.fillRect(2, 38, 124, 52);
          c.fillStyle = "#fff";
          c.fillRect(22, 56, 54, 16);
          c.beginPath();
          c.moveTo(72, 44);
          c.lineTo(110, 64);
          c.lineTo(72, 84);
          c.fill();
        }),
      };
      for (const k in PM) clipMat(PM[k]);
      return PM;
    }
    // 道ばたの物を置く。同じ形はまとめて描く(数が多くても重くならない)
    function streetProps(g, props, poles) {
      const THREE = T(), pm = propMats();
      const mt = new THREE.Matrix4(), ro = new THREE.Matrix4(), tr = new THREE.Matrix4(), c = new THREE.Color();
      // 向き: 自分の +z を、道の外向き(ox, oz)に合わせる
      const at = (p, lx, ly, lz, extraY = 0) => mt.makeTranslation(p.x, H(p.x, p.z) + 0.05, p.z).multiply(ro.makeRotationY(Math.atan2(p.ox, p.oz))).multiply(tr.makeTranslation(lx, ly, lz)).multiply(ro.makeRotationY(extraY));
      const inst = (geo, mat, list, fn, colors) => {
        if (!list.length) return null;
        const im = new THREE.InstancedMesh(geo, mat, list.length);
        list.forEach((p, i) => {
          im.setMatrixAt(i, fn(p, i));
          if (colors) im.setColorAt(i, c.set(colors(p, i)));
        });
        im.castShadow = true;
        g.add(im);
        return im;
      };
      // 自販機(白・赤・青)
      const vend = props.filter((p) => p.kind === "vend");
      inst(new THREE.BoxGeometry(1.0, 1.83, 0.7), pm.body, vend, (p) => at(p, 0, 0.915, 0.2), (p) => (p.r < 0.5 ? 0xf2f2ee : p.r < 0.75 ? 0xc8262a : 0x2a5fb0));
      inst(new THREE.PlaneGeometry(0.94, 1.76), pm.vend, vend, (p) => at(p, 0, 0.92, -0.155, Math.PI));
      // カーブミラー(オレンジの柱と、ふちつきの丸い鏡)
      const mir = props.filter((p) => p.kind === "mirror");
      inst(new THREE.CylinderGeometry(0.045, 0.045, 2.9, 8), pm.orange, mir, (p) => at(p, 0, 1.45, 0.1));
      const disc = new THREE.CylinderGeometry(0.36, 0.36, 0.05, 20);
      disc.rotateX(Math.PI / 2);
      inst(disc, pm.orange, mir, (p) => at(p, 0, 2.75, 0.02).multiply(ro.makeRotationX(0.25)));
      const glassD = new THREE.CircleGeometry(0.31, 20);
      inst(glassD, pm.mirror, mir, (p) => at(p, 0, 2.75, -0.012, Math.PI).multiply(ro.makeRotationX(-0.25)));
      // 標識(柱と板。板は道の向きに立てて、走ってくる人から見えるように)
      const signs = props.filter((p) => p.kind === "stop" || p.kind === "s30" || p.kind === "oneway");
      inst(new THREE.CylinderGeometry(0.03, 0.03, 2.7, 6), pm.metal, signs, (p) => at(p, 0, 1.35, 0.1));
      for (const k of ["stop", "s30", "oneway"]) {
        const sz = k === "stop" ? 0.8 : 0.6;
        inst(new THREE.PlaneGeometry(sz, sz), pm[k], signs.filter((p) => p.kind === k), (p) => at(p, 0.035, 2.35, 0.1, Math.PI / 2));
      }
      // 植木ばち(鉢と葉)
      const pl = props.filter((p) => p.kind === "plant");
      inst(new THREE.CylinderGeometry(0.2, 0.15, 0.34, 8), pm.pot, pl, (p) => at(p, 0, 0.17, 0.12), (p) => (p.r < 0.4 ? 0xa8623e : p.r < 0.7 ? 0x8c8e90 : 0xd8d2c4));
      // 鉢の草木: 葉むらの板を十字に2枚。3つに1つは花(小さな色の玉)がつく
      const lc = mats().leafCard;
      for (const ry of [0, Math.PI / 2]) inst(new THREE.PlaneGeometry(0.85, 0.85), lc, pl, (p) => at(p, 0, 0.66 + p.r * 0.12, 0.12, ry + p.r * 3).multiply(tr.makeScale(1, 1 + p.r * 0.5, 1)), (p) => c.setHSL(0.27 + p.r * 0.08, 0.42, 0.26 + p.r * 0.08).getHex());
      const fl = pl.filter((p) => p.r > 0.62);
      for (const [dx, dy, dz] of [[0.12, 0.8, 0.1], [-0.1, 0.72, 0.2], [0.02, 0.9, 0.02], [-0.14, 0.84, 0.06]]) inst(new THREE.IcosahedronGeometry(0.05, 0), pm.body, fl, (p) => at(p, dx, dy, dz + 0.12), (p) => [0xe8506a, 0xf2c230, 0xf4f4f0, 0xb060d8][Math.floor(p.r * 31) % 4]);
      // 電柱: 足もとの黄色と黒のしま、広告の板(色だけ)
      const pp = poles.map((q) => ({ x: q.x, z: q.z, ox: Math.sin(q.ang), oz: -Math.cos(q.ang), r: hash(Math.round(q.x * 9) + Math.round(q.z * 4)) }));
      inst(new THREE.CylinderGeometry(0.19, 0.2, 0.9, 10), pm.tiger, pp.filter((q) => q.r < 0.55), (p) => at(p, 0, 1.0, 0));
      inst(new THREE.BoxGeometry(0.42, 1.2, 0.04), pm.body, pp.filter((q) => q.r > 0.35), (p) => at(p, 0, 2.9, -0.22), (p) => [0x1f5fae, 0x2f8a4e, 0xf4f4f0, 0xb3261e, 0xe8b020][Math.floor(p.r * 97) % 5]);
    }
    function buildTile(polys, rect) {
      const THREE = T();
      const m = mats();
      const g = new THREE.Group();
      const near = (p) => {
        const b = p.box;
        return isNear([b[0], b[1]]) || isNear([b[2], b[3]]) || isNear([(b[0] + b[2]) / 2, (b[1] + b[3]) / 2]) || isNear([b[0], b[3]]) || isNear([b[2], b[1]]);
      };
      const A = { asph: [[], []], walk: [[], []], curb: [[], []], isl: [[], []] }; // [位置, uv]
      // 路面に貼る薄い絵は、路面ができてから置く(高さを路面から引くため)。下から順に: 補修跡・帯 / ひび・ふた / 塗料
      const B = batch(), dP = [], dC = [], dL = [];
      const hs = (x, z, n) => hash(Math.round(x * 7) * 13 + Math.round(z * 5) * 29 + n * 101);
      // 道のふちに沿う帯(ふちから inset m 内側。絵の上が外側になる向きで)
      const along = (list, name, ax, az, bx, bz, ox, oz, inset, w, per, seed) => {
        const x0 = ax - ox * inset, z0 = az - oz * inset, x1 = bx - ox * inset, z1 = bz - oz * inset;
        const fwd = (bx - ax) * -oz + (bz - az) * ox > 0;
        list.push(() => (fwd ? B.band(name, x0, z0, x1, z1, w, per, 1, seed) : B.band(name, x1, z1, x0, z0, w, per, 1, seed)));
      };
      // 路面の小物(17mごとに、場所から決まる確率で): マンホール・小さなふた・掘り返した跡・補修跡・ひび
      let litRun = 0, grRun = 0;
      const litter = (ax, az, ex, ez, ox, oz, L) => {
        for (let t = (17 - litRun) % 17; t < L; t += 17) {
          const px = ax + ex * t, pz = az + ez * t, h0 = hs(px, pz, 1), h1 = hs(px, pz, 2), h2 = hs(px, pz, 3);
          const d = 0.9 + h1 * 2.0, x = px - ox * d, z = pz - oz * d;
          if (!isCar(kindAt(x, z)) || !isCar(kindAt(x - ox * 0.7, z - oz * 0.7))) continue;
          const ang = h2 * 6.283, fx = Math.cos(ang), fz = Math.sin(ang);
          if (h0 < 0.2) {
            // マンホール(3つに1つは、まわりを四角く補修してある)
            if (h2 < 0.33) dP.push(() => B.quad("patch" + (h1 < 0.5 ? 0 : 1), x, z, ex, ez, 1.5, 1.5, 1));
            dC.push(() => B.quad("mh" + Math.floor(h1 * 2.999), x, z, fx, fz, 0.66, 0.66, 0.85 + h2 * 0.3));
          } else if (h0 < 0.27) dC.push(() => B.quad("hh", x, z, ex, ez, 0.45, 0.45, 0.9));
          else if (h0 < 0.36) dC.push(() => B.quad("valve", px - ox * 0.75, pz - oz * 0.75, fx, fz, 0.26, 0.26, 0.95));
          else if (h0 < 0.5) {
            const len = Math.min(L - t, 3 + h2 * 9), w = 0.6 + h1 * 0.5;
            if (len > 1.5) dP.push(() => B.band("trench", x, z, x + ex * len, z + ez * len, w, 3.6, 0.9 + h2 * 0.25, 5));
          } else if (h0 < 0.57) dP.push(() => B.quad("patch" + (h2 < 0.5 ? 0 : 1), x, z, ex, ez, 1.1 + h1 * 1.6, 0.9 + h2 * 1.4, 1));
          else if (h0 < 0.8) {
            // ひび(だいたい道に沿う向き)
            const a2 = (h1 - 0.5) * 0.9, co = Math.cos(a2), si = Math.sin(a2);
            dC.push(() => B.quad("crack" + Math.floor(h2 * 2.999), x, z, -ox * co + oz * si, -ox * si - oz * co, 2.2 + h1 * 1.2, 1.1 + h1 * 0.6, 1));
          }
        }
        litRun = (litRun + L) % 17;
      };
      // ふちのグレーチング(per mごと)
      const grates = (ax, az, ex, ez, ox, oz, L, per, inset, l) => {
        for (let t = (per - grRun) % per; t < L - 0.3; t += per) {
          const x = ax + ex * t - ox * inset, z = az + ez * t - oz * inset;
          dC.push(() => B.quad("grate", x, z, -ox, -oz, 0.5, l, 0.95));
        }
        grRun = (grRun + L) % per;
      };
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
        // 大きな三角形は、辺が5.5m以下になるまで細かく割って、1点ずつ地面の高さに合わせる。
        // (割らないと、坂やでこぼこの所で道の面が本当の地面より上に出て、自転車が道に埋もれて見える)
        // 「長い辺は必ず真ん中で割る」決まりなので、となりの三角形と割れ目の位置がそろい、すき間はできない
        const emit = (ax, az, bx, bz, cx, cz, d) => {
          const ab = (bx - ax) ** 2 + (bz - az) ** 2, bc = (cx - bx) ** 2 + (cz - bz) ** 2, ca = (ax - cx) ** 2 + (az - cz) ** 2;
          const mx = Math.max(ab, bc, ca);
          // アンダーパスのふちをまたぐ三角形は、もっと細かく割る(段の斜めの面が、擁壁の内側へはみ出さないように)
          const edge = mx > 1.7 && d <= 16 && Xing.any() && ((za) => za !== (Xing.zone(bx, bz) > 0) || za !== (Xing.zone(cx, cz) > 0))(Xing.zone(ax, az) > 0);
          if (!edge && (mx <= 64 || d > 8)) { // 辺が8m以下(道のまわりの高さはなめらかにしてあるので、これで足りる)
            // アンダーパスの中: 地上の歩道や島(データでは同じ場所に重なっている)は作らない
            if (key !== "asph" && Xing.any() && Xing.zone((ax + bx + cx) / 3, (az + bz + cz) / 3)) return;
            q(key, [ax, y + H(ax, az), az, bx, y + H(bx, bz), bz, cx, y + H(cx, cz), cz], [ax / sc, az / sc, bx / sc, bz / sc, cx / sc, cz / sc]);
            return;
          }
          if (mx === ab) {
            const px = (ax + bx) / 2, pz = (az + bz) / 2;
            emit(ax, az, px, pz, cx, cz, d + 1), emit(px, pz, bx, bz, cx, cz, d + 1);
          } else if (mx === bc) {
            const px = (bx + cx) / 2, pz = (bz + cz) / 2;
            emit(ax, az, bx, bz, px, pz, d + 1), emit(ax, az, px, pz, cx, cz, d + 1);
          } else {
            const px = (cx + ax) / 2, pz = (cz + az) / 2;
            emit(ax, az, bx, bz, px, pz, d + 1), emit(px, pz, bx, bz, cx, cz, d + 1);
          }
        };
        for (const t of tri) {
          const a = all[t[0]], b = all[t[2]], c = all[t[1]];
          emit(a.x, a.y, b.x, b.y, c.x, c.y, 0);
        }
      };
      // 縁石: 多角形のふちに、低い壁
      const walls = (p, y0, y1) => {
        for (const r of p.rings)
          for (let i = 0, j = r.length - 2; i < r.length; j = i, i += 2) {
            const ax = r[j], az = r[j + 1], bx = r[i], bz = r[i + 1];
            const L0 = Math.hypot(bx - ax, bz - az);
            if (L0 < 0.05) continue;
            // 長い辺は4.5mごとに区切って、地面の高さにそわせる
            const nS = Math.max(1, Math.ceil(L0 / 4.5));
            for (let k = 0; k < nS; k++) {
              const x0 = ax + ((bx - ax) * k) / nS, z0 = az + ((bz - az) * k) / nS, x1 = ax + ((bx - ax) * (k + 1)) / nS, z1 = az + ((bz - az) * (k + 1)) / nS, L = L0 / nS;
              if (Xing.any() && Xing.zone((x0 + x1) / 2, (z0 + z1) / 2)) continue;
              const ha = H(x0, z0), hb = H(x1, z1);
              const u0 = (k * L) / 1.2, u1 = ((k + 1) * L) / 1.2; // 絵の1枚 = ブロック2つ(1.2m)
              q("curb", [x0, y0 + ha, z0, x1, y0 + hb, z1, x1, y1 + hb, z1, x0, y0 + ha, z0, x1, y1 + hb, z1, x0, y1 + ha, z0], [u0, 0, u1, 0, u1, 1, u0, 0, u1, 1, u0, 1]);
              q("curb", [x0, y0 + ha, z0, x1, y1 + hb, z1, x1, y0 + hb, z1, x0, y0 + ha, z0, x0, y1 + ha, z0, x1, y1 + hb, z1], [u0, 0, u1, 1, u1, 0, u0, 0, u0, 1, u1, 1]);
            }
          }
      };
      const poles = [], trees = [], posts = [], rails = [[], []], props = [], slamps = [];
      let slampRun = 0;
      let propRun = 0;
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
            if (Xing.any() && Xing.zone(mx, mz)) continue; // アンダーパスの中には、地上の交差点の飾り(横断歩道・縁石まわり)を置かない
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
            // ふちに側溝のふた(コンクリートのふたの列と、ところどころグレーチング)、その内側に路側帯の白線
            along(dP, "lids", ax, az, bx, bz, ox, oz, 0.2, 0.36, 2.4, -1);
            grates(ax, az, ex, ez, ox, oz, L, 12, 0.2, 0.36);
            along(dL, hs(mx, mz, 7) < 0.5 ? "line0" : "line1", ax, az, bx, bz, ox, oz, 0.55, 0.15, 3.6, 3);
            litter(ax, az, ex, ez, ox, oz, L);
            for (let t = (32 - poleRun) % 32; t < L; t += 32) {
              const x = ax + ex * t + ox * 0.35, z = az + ez * t + oz * 0.35;
              if (hash(Math.round(x) * 73 + Math.round(z) * 31) < 0.45) continue;
              poles.push({ x, z, rx: -ox, rz: -oz, ang: Math.atan2(ez, ex), prev: lastPole && Math.hypot(lastPole.x - x, lastPole.z - z) < 48 ? lastPole : null, tr: hash(Math.round(x * 3) + Math.round(z)) < 0.3 });
              lastPole = poles[poles.length - 1];
            }
            poleRun = (poleRun + L) % 32;
            // 道ばたの物(19mごとに、場所から決まる確率で): 自販機・カーブミラー・標識・植木
            for (let t = (19 - propRun) % 19; t < L; t += 19) {
              const px = ax + ex * t, pz = az + ez * t, hx = hash(Math.round(px * 7) * 13 + Math.round(pz * 5) * 29);
              const kind = hx < 0.1 ? "vend" : hx < 0.16 ? "mirror" : hx < 0.21 ? "stop" : hx < 0.27 ? "s30" : hx < 0.31 ? "oneway" : hx < 0.45 ? "plant" : null;
              if (kind) props.push({ kind, x: px + ox * 0.18, z: pz + oz * 0.18, ox, oz, ex, ez, r: hash(Math.round(px * 3) + Math.round(pz * 11)) });
            }
            propRun = (propRun + L) % 19;
          });
        } else if (p.f === 0 || p.f === 1) {
          flat(p, p.f === 1 ? 0.065 : 0.06, "asph", 3);
          if (p.f === 0)
            edges(p, (ax, az, bx, bz, L, ex, ez, ox, oz, out) => {
              if (out === 1) {
                // 交差点の入口: 横断歩道(しま模様。白い帯は道に沿う向き、幅0.45m・間隔0.45m、長さ4m)
                if (L < 3 || L > 34) return;
                const zb = hs(ax, az, 5) < 0.6 ? "zebra0" : "zebra1";
                for (let t = 0.6; t < L - 0.4; t += 0.9) {
                  const x = ax + ex * t - ox * 2.6, z = az + ez * t - oz * 2.6;
                  dL.push(() => B.quad(zb, x, z, -ox, -oz, 0.45, 4, 1));
                }
                return;
              }
              if (out === 0) return;
              if (out === 2) {
                // 歩道のある所: 縁石の足もとに街渠(コンクリートの帯)と雨水ます、その内側に車道外側線
                along(dP, "apron", ax, az, bx, bz, ox, oz, 0.25, 0.5, 2.4, -1);
                grates(ax, az, ex, ez, ox, oz, L, 14, 0.25, 0.4);
                along(dL, hs(ax, az, 7) < 0.5 ? "line0" : "line1", ax, az, bx, bz, ox, oz, 0.62, 0.15, 3.6, 3);
              } else if (out !== 4 && ![1, 1.5, 2.5].some((d) => isCar(kindAt((ax + bx) / 2 + ox * d, (az + bz) / 2 + oz * d))) && kindAt((ax + bx) / 2 - ox * 0.2, (az + bz) / 2 - oz * 0.2) !== 1) along(dL, "line0", ax, az, bx, bz, ox, oz, 0.2, 0.15, 3.6, 3); // (面と面のすき間には引かない)
              litter(ax, az, ex, ez, ox, oz, L);
            });
        } else if (p.f === 2) {
          flat(p, 0.17, "walk", 1.2);
          walls(p, 0.0, 0.17);
          edges(p, (ax, az, bx, bz, L, ex, ez, ox, oz, out) => {
            if (isCar(out)) {
              // 車道に面したふち: 縁石の上の面(幅15cm。歩道の面よりわずかに上)
              const nS = Math.max(1, Math.ceil(L / 4.5)), up = ez * -ox - ex * -oz > 0;
              for (let k = 0; k < nS; k++) {
                const x0 = ax + (ex * L * k) / nS, z0 = az + (ez * L * k) / nS, x1 = ax + (ex * L * (k + 1)) / nS, z1 = az + (ez * L * (k + 1)) / nS;
                const ha = H(x0, z0) + 0.178, hb = H(x1, z1) + 0.178, u0 = (k * L) / nS / 1.2, u1 = ((k + 1) * L) / nS / 1.2;
                const a = [x0, ha, z0, u0, 1], b = [x1, hb, z1, u1, 1], c = [x1 - ox * 0.15, hb, z1 - oz * 0.15, u1, 0.82], d = [x0 - ox * 0.15, ha, z0 - oz * 0.15, u0, 0.82];
                for (const v of up ? [a, b, c, a, c, d] : [a, c, b, a, d, c]) q("curb", [v[0], v[1], v[2]], [v[3], v[4]]);
              }
            }
            if (out !== 0) return;
            // 車道に面したふち: ガードパイプ(2.4mごとの柱と2本の横棒)と、街路樹(11mごと)
            const ix = -ox, iz = -oz;
            const wide = kindAt((ax + bx) / 2 + ix * 2.4, (az + bz) / 2 + iz * 2.4) === 2;
            for (let t = (2.4 - postRun) % 2.4; t < L; t += 2.4) posts.push([ax + ex * t + ix * 0.3, az + ez * t + iz * 0.3]);
            postRun = (postRun + L) % 2.4;
            for (const [k, yy] of [[0, 0.78], [1, 0.45]]) rails[k].push([ax + ix * 0.3, az + iz * 0.3, bx + ix * 0.3, bz + iz * 0.3, yy]);
            // 歩道の街灯(26mごと。車道のふちから55cm内側に立て、腕を車道へ張り出す)
            for (let t = (26 - slampRun) % 26; t < L; t += 26) slamps.push({ x: ax + ex * t + ix * 0.55, z: az + ez * t + iz * 0.55, rx: ox, rz: oz, own: true });
            slampRun = (slampRun + L) % 26;
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
      for (const [key, mat] of [["asph", m.asph], ["walk", m.walk], ["curb", m.curb], ["isl", m.isl]]) {
        const [pos, uv] = A[key];
        if (!pos.length) continue;
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
        geo.computeVertexNormals();
        const mesh = new THREE.Mesh(geo, mat);
        mesh.receiveShadow = true;
        g.add(mesh);
        // 路面の三角形を覚えておく(標示の高さを引くため。区画を片づけるときに忘れる)
        if (key === "asph") g.userData.surf = { arr: geo.attributes.position.array, keys: surfAdd(geo.attributes.position.array) };
      }
      // 路面に貼る薄い絵(区画ごとに1つのメッシュ)
      for (const list of [dP, dC, dL]) for (const f of list) f();
      const dm = B.mesh(1);
      if (dm) g.add(dm);
      // 掘り下げた所(アンダーパス)には、地上の柵・木・電柱を置かない
      if (Xing.any()) {
        const keep = (a) => {
          for (let i = a.length - 1; i >= 0; i--) {
            const q = a[i], x = q.x !== undefined ? q.x : q.length >= 4 ? (q[0] + q[2]) / 2 : q[0], z = q.z !== undefined ? q.z : q.length >= 4 ? (q[1] + q[3]) / 2 : q[1];
            if (Xing.zone(x, z)) a.splice(i, 1);
          }
        };
        for (const a of [posts, trees, rails[0], rails[1], poles]) keep(a);
        for (const q of poles) if (q.prev && poles.indexOf(q.prev) < 0) q.prev = null;
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
      // 街路樹: 幹と、葉のかたまり4つ(大きさ・位置・色を少しずつ変えて、こんもりした形にする)と、根もとの植え込み
      if (trees.length) {
        // 幹は枝分かれした1つの形(幹 + 太い枝3本)。葉は、葉むらの絵を貼った板を 18枚、いろいろな向きに重ねる。
        // 中に暗い緑のかたまりを1つ入れて、すき間から向こうが見えすぎないようにする
        // 木の種類を3つ(丸く広がる木 / 背の高い細い木 / 低く横に広い木)。葉むらの板は1本に30枚
        const K = 30;
        const tg = [];
        const cyl = (r0, r1, len, px, py, pz, rx, rz) => {
          const q = new THREE.CylinderGeometry(r0, r1, len, 7);
          q.translate(0, len / 2, 0);
          q.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(px, py, pz), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, 0, rz)), new THREE.Vector3(1, 1, 1)));
          return q.toNonIndexed();
        };
        // 幹(根もとが少し広がる)と、太い枝5本、その先の細い枝
        tg.push(cyl(0.1, 0.2, 0.5, 0, 0, 0, 0, 0), cyl(0.085, 0.1, 2.1, 0, 0.45, 0, 0.03, -0.02));
        for (const [rx, rz, y0] of [[0.55, 0.25, 2.3], [-0.5, -0.4, 2.2], [0.1, 0.65, 2.45], [-0.25, -0.6, 2.45], [0.02, 0.05, 2.5]]) {
          tg.push(cyl(0.045, 0.085, 1.5, 0, y0, 0, rx, rz));
          const ex = -Math.sin(rz) * 1.4, ey = y0 + Math.cos(rz) * Math.cos(rx) * 1.4, ez = Math.sin(rx) * 1.4;
          tg.push(cyl(0.02, 0.04, 0.9, ex, ey, ez, rx * 1.6 + 0.2, rz * 0.5), cyl(0.02, 0.04, 0.8, ex, ey, ez, rx * 0.4 - 0.3, rz * 1.7));
        }
        const tpos = [], tnor = [], tuv = [];
        for (const q of tg) (tpos.push(...q.attributes.position.array), tnor.push(...q.attributes.normal.array), tuv.push(...q.attributes.uv.array));
        const trunkG = new THREE.BufferGeometry();
        trunkG.setAttribute("position", new THREE.Float32BufferAttribute(tpos, 3));
        trunkG.setAttribute("normal", new THREE.Float32BufferAttribute(tnor, 3));
        trunkG.setAttribute("uv", new THREE.Float32BufferAttribute(tuv, 2));
        const trunk = new THREE.InstancedMesh(trunkG, m.bark, trees.length);
        const card = new THREE.InstancedMesh(new THREE.PlaneGeometry(2.0, 2.0), m.leafCard, trees.length * K);
        const core = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), m.leaf, trees.length);
        // 根もと: 土の植えます(四角)と、低い下草(葉むらの板を3枚)
        const pit = new THREE.InstancedMesh(new THREE.BoxGeometry(1.3, 0.06, 1.3), m.soil, trees.length);
        const rim = new THREE.InstancedMesh(new THREE.BoxGeometry(1.5, 0.04, 1.5), m.grate, trees.length);
        const bush = new THREE.InstancedMesh(new THREE.PlaneGeometry(1.1, 0.7), m.leafCard, trees.length * 3);
        const mt = new THREE.Matrix4(), sc = new THREE.Matrix4(), ro = new THREE.Matrix4(), c = new THREE.Color(), eu = new THREE.Euler();
        trees.forEach(([x, z], i) => {
          const hs = (n) => hash(Math.round(x * 5) * 3 + Math.round(z * 3) * 7 + n * 131);
          const kind = hs(3) < 0.5 ? 0 : hs(3) < 0.8 ? 1 : 2; // 丸い / 細くて高い / 低くて広い
          const s = (0.85 + hs(0) * 0.5) * [1, 1.15, 0.85][kind], h = H(x, z) + 0.17, yaw = hs(2) * 6.28;
          const hue = [0.25, 0.2, 0.3][kind] + hs(1) * 0.06, sx = [1.25, 0.75, 1.5][kind], sy = [1.05, 1.7, 0.8][kind], cy = [3.8, 4.3, 3.4][kind];
          trunk.setMatrixAt(i, mt.makeTranslation(x, h, z).multiply(ro.makeRotationY(yaw)).multiply(sc.makeScale(s, s * (kind === 1 ? 1.15 : 1), s)));
          for (let k = 0; k < K; k++) {
            // 葉むらは、木の上のほうの範囲(種類ごとの形)の、外側に多く散らす
            const a = hs(10 + k) * 6.28, el = (hs(20 + k) - 0.3) * 1.7, rr = (0.45 + Math.sqrt(hs(30 + k)) * 0.75) * s;
            const px = Math.cos(a) * Math.cos(el) * rr * sx, py = cy * s + Math.sin(el) * rr * sy, pz = Math.sin(a) * Math.cos(el) * rr * sx, rs = (0.7 + hs(40 + k) * 0.5) * s;
            card.setMatrixAt(i * K + k, mt.makeTranslation(x + px, h + py, z + pz).multiply(ro.makeRotationFromEuler(eu.set((hs(50 + k) - 0.5) * 1.6, hs(60 + k) * 6.28, (hs(70 + k) - 0.5) * 1.2))).multiply(sc.makeScale(rs, rs, rs)));
            // 上と外側の葉は明るく、下と内側は暗く
            card.setColorAt(i * K + k, c.setHSL(hue + (hs(80 + k) - 0.5) * 0.04, 0.2 + hs(90 + k) * 0.1, 0.13 + Math.max(0, Math.sin(el)) * 0.11 + (rr / s - 0.45) * 0.05 + hs(95 + k) * 0.04));
          }
          core.setMatrixAt(i, mt.makeTranslation(x, h + cy * s, z).multiply(sc.makeScale(0.8 * s * sx, 0.8 * s * sy, 0.8 * s * sx)));
          core.setColorAt(i, c.setHSL(hue, 0.4, 0.1));
          pit.setMatrixAt(i, mt.makeTranslation(x, h + 0.03, z).multiply(ro.makeRotationY(yaw)));
          rim.setMatrixAt(i, mt.makeTranslation(x, h + 0.015, z).multiply(ro.makeRotationY(yaw)));
          for (let k = 0; k < 3; k++) {
            bush.setMatrixAt(i * 3 + k, mt.makeTranslation(x, h + 0.36, z).multiply(ro.makeRotationY(yaw + (k * Math.PI) / 3)));
            bush.setColorAt(i * 3 + k, c.setHSL(hue + 0.03, 0.26, 0.13 + hs(100 + k) * 0.05));
          }
        });
        g.add(pit, rim);
        trunk.castShadow = card.castShadow = core.castShadow = true;
        g.add(trunk, card, core, bush);
      }
      // 道ばたの物
      if (props.length) streetProps(g, props, poles);
      // 歩道の街灯の柱(細い鋼管)
      if (slamps.length) {
        const mt0 = new THREE.Matrix4();
        const sh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.06, 0.09, 7.6, 8), m.dark, slamps.length);
        slamps.forEach((p, i) => {
          p.h = H(p.x, p.z) + 0.18;
          sh.setMatrixAt(i, mt0.makeTranslation(p.x, p.h + 3.8, p.z));
        });
        sh.castShadow = true;
        g.add(sh);
      }
      // 電柱と電線
      if (poles.length || slamps.length) {
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
        // 街灯: 電柱の半分ほどに、道の上へ張り出した腕とLEDの灯具。夕方・夜は灯具が光り、足もとの道を丸く照らす
        const lit = poles.filter((p) => p.rx != null && hash(Math.round(p.x * 7) * 13 + Math.round(p.z * 5)) < 0.55).concat(slamps);
        if (lit.length) {
          const LM = lampMats();
          const bk = new THREE.InstancedMesh(new THREE.BoxGeometry(0.06, 0.06, 1.3), m.dark, lit.length);
          const hd = new THREE.InstancedMesh(new THREE.BoxGeometry(0.22, 0.07, 0.5), m.dark, lit.length);
          const ld = new THREE.InstancedMesh(new THREE.BoxGeometry(0.18, 0.02, 0.42), LM.head, lit.length);
          const pl = new THREE.InstancedMesh(new THREE.CircleGeometry(1, 28).rotateX(-Math.PI / 2), LM.pool, lit.length);
          const q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(1, 1, 1), pos = new THREE.Vector3();
          lit.forEach((p, i) => {
            const yaw = Math.atan2(p.rx, p.rz); // 腕(ローカル +z)を道の側へ向ける
            q.setFromEuler(e.set(-0.18, yaw, 0));
            bk.setMatrixAt(i, mt.compose(pos.set(p.x + p.rx * 0.65, p.h + 7.35, p.z + p.rz * 0.65), q, sc));
            q.setFromEuler(e.set(-0.05, yaw, 0));
            hd.setMatrixAt(i, mt.compose(pos.set(p.x + p.rx * 1.45, p.h + 7.5, p.z + p.rz * 1.45), q, sc));
            ld.setMatrixAt(i, mt.compose(pos.set(p.x + p.rx * 1.45, p.h + 7.455, p.z + p.rz * 1.45), q, sc));
            const cx = p.x + p.rx * 2.2, cz = p.z + p.rz * 2.2;
            pl.setMatrixAt(i, mt.compose(pos.set(cx, H(cx, cz) + 0.085, cz), q.identity(), sc.set(5.5, 1, 5.5)));
            sc.set(1, 1, 1);
          });
          pl.renderOrder = 2;
          bk.castShadow = hd.castShadow = true;
          // 灯具のまわりのにじむ光(夜だけ)
          const gp = [];
          for (const p of lit) gp.push(p.x + p.rx * 1.45, p.h + 7.38, p.z + p.rz * 1.45);
          const gg = new THREE.BufferGeometry();
          gg.setAttribute("position", new THREE.Float32BufferAttribute(gp, 3));
          const halo = new THREE.Points(gg, LM.halo);
          halo.renderOrder = 3;
          g.add(bk, hd, ld, pl, halo);
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
    // ---- ルート上の標示(走っている道だけ。測った道幅から) ----
    // センターライン・車線の線・停止線・横断歩道・「止まれ」・進行方向の矢印・制限速度の数字・自転車ナビマーク(青い矢羽根)。
    // ルートを120mごとの区間に分け、区間ごとに1つのメッシュにまとめて1回だけ作る(道幅の測定や信号が増えたときだけ作り直す)
    const CH = 120, chunks = new Map(); // 区間の番号 → { sig, mesh }
    const okAt = (i) => !!raw[i] && !raw[i].cross && raw[i].L + raw[i].R > 2;
    // ルートの along の所から、左へ o m の点と、道の向き
    const lat = (al, o) => {
      const p = at(al);
      return [p.x + p.tz * o, p.z - p.tx * o, p.tx, p.tz];
    };
    // 道の真ん中のずれ(左が+)と幅を、前後の測定でならす(線がガタガタしないように)
    function mid(i) {
      let c = 0, w = 0, n = 0;
      for (let k = i - 2; k <= i + 2; k++) if (okAt(k)) (c += (raw[k].L - raw[k].R) / 2), (w += raw[k].L + raw[k].R), n++;
      return n ? { c: c / n, W: w / n } : null;
    }
    function crossings() {
      const out = [];
      let a = null;
      for (let i = 0; i < raw.length; i++) {
        const c = raw[i] && raw[i].cross;
        if (c && a == null) a = i * STEP;
        if (!c && a != null) out.push([a, i * STEP]), (a = null);
      }
      return out;
    }
    function chunkSig(c) {
      const i0 = Math.floor((c * CH) / STEP) - 3, i1 = Math.floor(((c + 1) * CH) / STEP) + 3;
      let n = 0, s = 0, g = 0;
      for (let i = i0; i <= i1; i++) if (raw[i]) n++, (s += raw[i].L + raw[i].R + (raw[i].cross ? 100 : 0));
      for (const sg of Signals.list()) if (sg.along > c * CH - 60 && sg.along < (c + 1) * CH + 60) g += Math.round(sg.along);
      return n + ":" + Math.round(s * 4) + ":" + g;
    }
    function buildChunk(c) {
      const B = batch(), a0 = c * CH, a1 = a0 + CH;
      const sigs = Signals.list(), xs = crossings();
      const nearSig = (al, before, after) => sigs.some((s) => al > s.along - 6 - before && al < s.along + after);
      const inX = (al, m) => xs.some(([x0, x1]) => al > x0 - m && al < x1 + m);
      const idx = (al) => Math.round(al / STEP);
      // 自分の車線の真ん中(左が+)。せまい道は道の真ん中
      const laneC = (md) => {
        if (md.W < 5.5) return md.c;
        const half = md.W / 2, lanes = Math.max(1, Math.floor(half / 3));
        return md.c + half * (1 - 1 / (2 * lanes));
      };
      // 停止線: 左のふちから、センターラインまで(せまい道は道幅いっぱい)
      const stopLine = (al, md) => {
        const P = lat(al, md.c + md.W / 2 - 0.6), Q = lat(al, md.W >= 5.5 ? md.c + 0.2 : md.c - md.W / 2 + 0.6);
        B.band("stopln", P[0], P[1], Q[0], Q[1], 0.45, 3.6, 1, Math.round(al));
      };
      // 1) センターラインと車線の線
      for (let i = Math.ceil(a0 / STEP); i * STEP < a1; i++) {
        if (!okAt(i) || !okAt(i + 1)) continue;
        const ma = mid(i), mb = mid(i + 1), W = (ma.W + mb.W) / 2;
        if (W < 5.5) continue;
        const al = i * STEP, half = W / 2, lanes = Math.max(1, Math.floor(half / 3));
        // 片側2車線以上は実線。片側1車線は破線(4mおき)で、信号の手前30mは黄色の実線(はみ出し禁止)
        const yel = lanes < 2 && nearSig(al, 30, 0);
        if (lanes >= 2 || yel || i % 2 === 0) {
          const P = lat(al, ma.c), Q = lat(al + STEP, mb.c);
          B.band(yel ? "lineY" : i % 5 ? "line0" : "line1", P[0], P[1], Q[0], Q[1], 0.15, 3.6, 1, i);
        }
        if (lanes >= 2 && i % 4 < 2)
          for (let k = 1; k < lanes; k++)
            for (const sg of [-1, 1]) {
              const o = (sg * half * k) / lanes, P = lat(al, ma.c + o), Q = lat(al + STEP, mb.c + o);
              B.band("line0", P[0], P[1], Q[0], Q[1], 0.12, 3.6, 1, i + k * 7);
            }
      }
      // 2) 信号: 停止線(信号の6m手前 = 止まる位置)、横断歩道、手前に進行方向の矢印
      for (const s of sigs) {
        const st = s.along - 6;
        if (st < a0 || st >= a1) continue;
        const md = mid(idx(st)) || mid(idx(st) - 2) || mid(idx(st) - 4);
        if (!md) continue;
        stopLine(st, md);
        // 横断歩道は、交差点の面のデータがない所だけ(ある所は、区画のほうで入口に描いてある)
        if (!inX(st + 5, 9)) for (let o = md.c + md.W / 2 - 0.5; o > md.c - md.W / 2 + 0.3; o -= 0.9) {
          const P = lat(st + 3.2, o);
          B.quad(hash(Math.round(o * 9 + st)) < 0.6 ? "zebra0" : "zebra1", P[0], P[1], P[2], P[3], 0.45, 3, 1);
        }
        if (md.W >= 5.5)
          for (const [d, k] of [[10, 0], [34, 1]]) {
            const al = st - d, m2 = mid(idx(al));
            if (!m2 || m2.W < 5.5 || inX(al, 3)) continue;
            const two = hash(Math.round(s.along) + k * 5) < 0.5, P = lat(al, laneC(m2) + (two ? 0.3 : 0));
            B.quad(two ? "arrowSL" : "arrowS", P[0], P[1], P[2], P[3], two ? 1.5 : 0.9, 5, 1);
          }
      }
      // 3) 信号のない交差点: 自分がせまい道から広い道へ出る所に、停止線と「止まれ」
      for (const [x0, x1] of xs) {
        if (x0 < a0 || x0 >= a1 || x0 < 30) continue;
        if (sigs.some((s) => s.along > x0 - 25 && s.along < x1 + 25)) continue;
        const md = mid(idx(x0 - 6)) || mid(idx(x0 - 10));
        if (!md || md.W >= 7) continue;
        if (x1 - x0 < md.W && hash(Math.round(x0) * 17) > 0.55) continue;
        if (xs.some(([, y1]) => y1 <= x0 && y1 > x0 - 40)) continue; // 交差点が続く所は、最初の1つだけ
        // 交差点の入口の正確な位置(測定は4mおきなので、細かく探す)。入口に横断歩道がある道では、その手前に引く
        let e = x0;
        for (let a = x0 - STEP; a < x0; a += 0.25) {
          const p = at(a);
          if (kindAt(p.x, p.z) === 1) {
            e = a;
            break;
          }
        }
        const pz = at(e - 2), st = e - (kindAt(pz.x, pz.z) === 0 ? 5.9 : 1.0);
        stopLine(st, md);
        const P = lat(st - 4.6, laneC(md));
        B.quad("tomare", P[0], P[1], P[2], P[3], Math.min(1.2, md.W * 0.34), 5.2, 1);
      }
      // 4) 制限速度の数字(180mおき。交差点・信号の近くには書かない)
      for (let k = Math.ceil((a0 - 70) / 180); 70 + k * 180 < a1; k++) {
        const al = 70 + k * 180, i = idx(al), md = mid(i);
        if (al < 40 || !md || !okAt(i - 1) || !okAt(i) || !okAt(i + 1) || inX(al, 12) || nearSig(al, 45, 20)) continue;
        const P = lat(al, laneC(md));
        B.quad(md.W < 5.5 ? "n30" : md.W < 9 ? "n40" : "n50", P[0], P[1], P[2], P[3], Math.min(1.4, md.W * 0.36), 4.2, 1);
      }
      // 5) 自転車ナビマーク(120mおき)と、広い道の自転車ナビライン(青い矢羽根・10mおき)。走る位置のすぐ右に
      for (let al = Math.ceil(a0 / 10) * 10; al < a1; al += 10) {
        const r = ride(al), big = al % 120 === 40;
        if (al < 20 || al > route.length - 15 || !r || r.W < 2.6 || (r.W < 5.5 && !big)) continue;
        if (big ? inX(al, 8) || nearSig(al, 14, 8) : nearSig(al, 1.5, -5)) continue;
        const P = lat(al, r.off - (r.W >= 5.5 ? 0.4 : 0.1));
        if (big) B.quad("bike", P[0], P[1], P[2], P[3], 0.9, 3.2, 1);
        else B.quad("chev" + (hash(al * 3 + 1) < 0.6 ? 0 : 1), P[0], P[1], P[2], P[3], 0.75, 1.5, 1);
      }
      return B.mesh(2);
    }
    function paintRoute(along) {
      const c0 = Math.max(0, Math.floor((along - 80) / CH)), c1 = Math.floor(Math.min(route.length, along + 460) / CH);
      let made = 0;
      for (let c = c0; c <= c1 && made < 2; c++) {
        const sig = chunkSig(c), ch = chunks.get(c);
        if (ch && ch.sig === sig) continue;
        if (ch && ch.mesh) scene.remove(ch.mesh), ch.mesh.geometry.dispose();
        const mesh = buildChunk(c);
        if (mesh) (mesh.visible = visible), scene.add(mesh);
        chunks.set(c, { sig, mesh });
        made++;
      }
      // 通り過ぎた区間は片づける
      for (const [c, ch] of chunks)
        if (c < c0 - 1 || c > c1 + 1) {
          if (ch.mesh) scene.remove(ch.mesh), ch.mesh.geometry.dispose();
          chunks.delete(c);
        }
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
    // flag.soft: 「無い」と決まったわけではない失敗(通信の不調など)があった
    async function get(url, flag) {
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
        if (!res.ok) return flag && (flag.soft = true), null;
        return res.arrayBuffer();
      }
    }
    function want(along) {
      if (!IDX.length) return;
      const need = new Map();
      const ahead = Math.min(2500, Math.max(typeof G3 !== "undefined" && G3.on() ? 750 : 500, (sim ? sim.v * sim.speedX : 7) * 18));
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
          if (t.group.userData.surf) surfDrop(t.group.userData.surf.arr, t.group.userData.surf.keys);
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
        const srcs = [];
        for (const c of IDX)
          for (const [u, b, mz, lod] of [[c[2], c[3], c[4], 2], [c[5], c[6], c[7], 1]]) {
            if (!u || !b || lon < b[0] - 0.01 || lon > b[2] + 0.01 || lat < b[1] - 0.01 || lat > b[3] + 0.01) continue;
            if (mz && mz < Z) continue;
            srcs.push({ url: u.replace("{z}", Z).replace("{x}", x).replace("{y}", y), lod });
          }
        let polys = [];
        if (srcs.length) {
          startWorker();
          const ask = (msg, tr) =>
            new Promise((res) => {
              const id = Math.random();
              waiting.set(id, res);
              worker.postMessage(Object.assign(msg, { id }), tr || []);
            });
          // 保存してある道の形があれば、それを読むだけ
          const skey = ["r", Saved.proj(), Saved.hash(srcs.map((q) => q.lod + q.url).join("|"))].join("|");
          let d = await ask({ type: "load", kind: "mvt", key: skey });
          if (!d || d.miss || d.error || !d.polys) {
            const bufs = [], flag = {};
            for (const q of srcs) {
              const buf = await get(q.url, flag);
              if (buf) bufs.push({ buf, lod: q.lod });
            }
            // 元データが無い区画も、空の結果として保存する(次から問い合わせない)。通信の不調で取れなかったときは保存しない
            d = await ask({ type: "mvt", bufs, z: Z, x, y, key: flag.soft ? null : skey }, bufs.map((b) => b.buf));
          }
          if (d.error) throw new Error(d.error);
          d.saved ? Saved.stat.rHit++ : Saved.stat.rNew++;
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
        console.error("道を作れませんでした", e);
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
      crossings,
      left: () => queue.length + busy,
      fails: () => fails,
      setVisible(v) {
        visible = v;
        for (const t of tl.values()) if (t.group) t.group.visible = v;
        for (const ch of chunks.values()) if (ch.mesh) ch.mesh.visible = v;
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
      const x = p.x + p.tz * o, z = p.z - p.tx * o, y = H(x, z) + 0.072; // 路面(約+6.5cm)のすぐ上
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
    // 形をいくつか1つにまとめる(描く回数を減らす)。parts: [{ geo, m(置き場所), c(色) }]
    function merge(parts) {
      const THREE = T();
      const pos = [], nor = [], col = [];
      const cc = new THREE.Color();
      for (const pt of parts) {
        const g = pt.geo.index ? pt.geo.toNonIndexed() : pt.geo.clone();
        if (pt.m) g.applyMatrix4(pt.m);
        const a = g.attributes.position, n = g.attributes.normal;
        cc.set(pt.c == null ? 0xffffff : pt.c).convertSRGBToLinear(); // 色は画面用の値なので、光の計算用に直す(直さないと白っぽくなる)
        for (let k = 0; k < a.count; k++) {
          pos.push(a.getX(k), a.getY(k), a.getZ(k));
          nor.push(n.getX(k), n.getY(k), n.getZ(k));
          col.push(cc.r, cc.g, cc.b);
        }
        g.dispose();
      }
      const out = new THREE.BufferGeometry();
      out.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      out.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
      out.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
      return out;
    }
    function templates() {
      if (tpl) return tpl;
      const THREE = T();
      const M4 = (x, y, z, rx, ry, rz, sx, sy, sz) => new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx || 0, ry || 0, rz || 0)), new THREE.Vector3(sx || 1, sy || sx || 1, sz || sx || 1));
      // 材質: 塗装(つやがあって空が映る)・ガラス(暗くてよく映る)・つやなし(タイヤ・ライトなど、そのままの色)
      const paint = new THREE.MeshPhysicalMaterial({ vertexColors: true, metalness: 0.45, roughness: 0.42, envMapIntensity: 0.9, clearcoat: 1, clearcoatRoughness: 0.06 }); // つやのある上塗り
      const glassM = new THREE.MeshStandardMaterial({ color: 0x0d141b, metalness: 0.85, roughness: 0.06, envMapIntensity: 1.6 });
      const flat = new THREE.MeshBasicMaterial({ vertexColors: true });
      const cloth = new THREE.MeshLambertMaterial({ vertexColors: true });
      // 乗用車のガラス: 中が見える、うすい色つき。空やまわりが映る
      const glass2 = new THREE.MeshStandardMaterial({ color: 0x1a2630, metalness: 0.6, roughness: 0.05, envMapIntensity: 1.5, transparent: true, opacity: 0.62, depthWrite: false });
      // ヘッドライトが路面を照らす光(夕方と夜)
      const beamG = new THREE.PlaneGeometry(9, 3.4);
      beamG.rotateX(-Math.PI / 2);
      const bcv = document.createElement("canvas");
      bcv.width = 128;
      bcv.height = 64;
      const bcx = bcv.getContext("2d"), bgr = bcx.createRadialGradient(8, 32, 2, 8, 32, 120);
      bgr.addColorStop(0, "rgba(255,246,214,0.75)");
      bgr.addColorStop(0.5, "rgba(255,246,214,0.22)");
      bgr.addColorStop(1, "rgba(255,246,214,0)");
      bcx.fillStyle = bgr;
      bcx.fillRect(0, 0, 128, 64);
      const beamM = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(bcv), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      // 足もとの丸い影(本物の影を使わない端末で、地面に浮いて見えないように)
      const sc = document.createElement("canvas");
      sc.width = sc.height = 64;
      const sg = sc.getContext("2d"), gr = sg.createRadialGradient(32, 32, 4, 32, 32, 31);
      gr.addColorStop(0, "rgba(0,0,0,0.75)");
      gr.addColorStop(0.6, "rgba(0,0,0,0.35)");
      gr.addColorStop(1, "rgba(0,0,0,0)");
      sg.fillStyle = gr;
      sg.fillRect(0, 0, 64, 64);
      const blobM = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false, opacity: 0.8 });
      const blobG = new THREE.PlaneGeometry(1, 1);
      blobG.rotateX(-Math.PI / 2);
      const blob = (lx, lz) => {
        const b = new THREE.Mesh(blobG, blobM);
        b.scale.set(lx, 1, lz);
        b.position.y = 0.04;
        b.renderOrder = 1;
        b.userData.blob = true;
        return b;
      };
      const useBlob = () => !(lights.sun && lights.sun.castShadow);
      // 横から見た輪郭(前が +x)を、幅の方向に押し出して角を丸める
      const extr = (pts, wid, bev) => {
        const sh = new THREE.Shape();
        pts.forEach((q, k) => {
          if (!k) sh.moveTo(q[0], q[1]);
          else if (q.length === 4) sh.quadraticCurveTo(q[2], q[3], q[0], q[1]);
          else sh.lineTo(q[0], q[1]);
        });
        const g = new THREE.ExtrudeGeometry(sh, { depth: wid - bev * 2, bevelEnabled: true, bevelSize: bev, bevelThickness: bev, bevelSegments: 2, curveSegments: 5 });
        g.translate(0, 0, -(wid - bev * 2) / 2);
        return g;
      };
      const boxG = (w, h, d) => new THREE.BoxGeometry(w, h, d);
      // 車(前が +x)。o: 長さL・幅W・高さH・窓の下の線 belt・ボンネットの高さ hood・後ろの高さ trunk・
      //   客室の後ろ/前 cabR/cabF・窓の傾き rakeR/rakeF・タイヤの半径 wr・色・屋根の行灯 sign・荷台/箱 cargo
      const car = (o) => {
        const { L, W, H: Ht, belt, hood, trunk, cabR, cabF, rakeR, rakeF, wr, color } = o;
        const cl = 0.19, x0 = -L / 2, x1 = L / 2;
        const body = [], gl = [], fl = [];
        // 下半分の車体
        body.push({ geo: extr([[x0 + 0.12, cl], [x0, cl + 0.22, x0, cl], [x0 + 0.03, trunk - 0.08], [x0 + 0.18, trunk, x0 + 0.03, trunk], [cabR, belt], [cabF, belt], [x1 - 0.25, hood, (cabF + x1) / 2, belt - 0.02], [x1, hood - 0.2, x1, hood], [x1 - 0.02, cl + 0.2], [x1 - 0.14, cl, x1, cl]], W, 0.09), c: color });
        if (!o.cargo) {
          // 窓(客室)と屋根
          gl.push({ geo: extr([[cabR, belt - 0.02], [cabR + rakeR, Ht - 0.04], [cabF - rakeF, Ht - 0.04], [cabF, belt - 0.02]], W * 0.88, 0.06) });
          body.push({ geo: extr([[cabR + rakeR - 0.03, Ht - 0.07], [cabR + rakeR + 0.02, Ht, cabR + rakeR - 0.03, Ht], [cabF - rakeF - 0.04, Ht], [cabF - rakeF + 0.04, Ht - 0.07, cabF - rakeF + 0.04, Ht]], W * 0.86, 0.05), c: color });
          // 柱(前・中・後ろ)
          const mid = (cabR + cabF) / 2 - 0.1;
          body.push({ geo: boxG(0.07, Ht - belt - 0.05, W * 0.885), m: M4(mid, (Ht + belt) / 2 - 0.03, 0), c: color });
          for (const [xa, xb] of [[cabR + 0.02, cabR + rakeR], [cabF - 0.02, cabF - rakeF]]) {
            const ang = Math.atan2(Ht - 0.06 - belt, xb - xa), len = Math.hypot(Ht - 0.06 - belt, xb - xa);
            body.push({ geo: boxG(len, 0.06, W * 0.885), m: M4((xa + xb) / 2, (Ht - 0.06 + belt) / 2, 0, 0, 0, ang), c: color });
          }
        } else {
          // 運転席(前)と、荷台か箱
          const cf = x1 - 0.25, cr = cf - 1.25;
          gl.push({ geo: extr([[cr, belt - 0.02], [cr + 0.03, Ht - 0.05], [cf - 0.35, Ht - 0.05], [cf, belt - 0.02]], W * 0.9, 0.05) });
          body.push({ geo: extr([[cr, Ht - 0.08], [cr, Ht], [cf - 0.36, Ht], [cf - 0.3, Ht - 0.08]], W * 0.88, 0.04), c: color });
          body.push({ geo: boxG(0.07, Ht - belt, W * 0.905), m: M4(cr + 0.03, (Ht + belt) / 2 - 0.02, 0), c: color });
          if (o.cargo === "box") body.push({ geo: extr([[x0 + 0.05, belt - 0.2], [x0 + 0.05, o.boxH], [cr - 0.08, o.boxH], [cr - 0.08, belt - 0.2]], W * 1.02, 0.03), c: 0xf2f2ee });
          else {
            for (const sz of [-1, 1]) body.push({ geo: boxG(cr - x0 - 0.12, 0.3, 0.04), m: M4((x0 + cr) / 2, belt + 0.1, sz * (W / 2 - 0.03)), c: color });
            body.push({ geo: boxG(0.04, 0.3, W - 0.06), m: M4(x0 + 0.06, belt + 0.1, 0), c: color });
          }
        }
        if (o.sign) fl.push({ geo: boxG(0.42, 0.14, 0.2), m: M4((cabR + cabF) / 2, Ht + 0.07, 0), c: o.sign });
        // 下まわり(黒)・グリル・ナンバー・ライト
        fl.push({ geo: boxG(L * 0.9, 0.12, W * 0.9), m: M4(0, cl + 0.03, 0), c: 0x121314 });
        fl.push({ geo: boxG(0.03, 0.14, W * 0.5), m: M4(x1 + 0.005, hood - 0.33, 0), c: 0x16181a });
        fl.push({ geo: boxG(0.02, 0.11, 0.33), m: M4(x1 + 0.012, cl + 0.2, 0), c: 0xf4f4f0 });
        fl.push({ geo: boxG(0.02, 0.11, 0.33), m: M4(x0 - 0.012, trunk - 0.32, 0), c: 0xf4f4f0 });
        for (const sz of [-1, 1]) {
          fl.push({ geo: boxG(0.05, 0.11, W * 0.2), m: M4(x1 - 0.03, hood - 0.16, sz * W * 0.33), c: 0xfff6d8 });
          fl.push({ geo: boxG(0.05, 0.1, W * 0.22), m: M4(x0 + 0.015, trunk - 0.14, sz * W * 0.32), c: 0xd0181c });
          fl.push({ geo: boxG(0.12, 0.07, 0.05), m: M4(cabF - 0.25, belt + 0.07, sz * (W / 2 + 0.03)), c: 0x18191b }); // ミラー
        }
        // タイヤとホイール
        const tg = new THREE.CylinderGeometry(wr, wr, 0.2, 16), rg = new THREE.CylinderGeometry(wr * 0.62, wr * 0.62, 0.21, 12), hg = new THREE.CylinderGeometry(wr * 0.2, wr * 0.2, 0.22, 8);
        for (const wx of [x0 + L * 0.19, x1 - L * 0.18])
          for (const sz of [-1, 1]) {
            const m = M4(wx, wr, sz * (W / 2 - 0.075), Math.PI / 2, 0, 0); // 車体より少し外に出す
            fl.push({ geo: tg, m, c: 0x0e0e0f }, { geo: rg, m, c: 0xaab0b6 }, { geo: hg, m, c: 0x54585c });
            // タイヤの上の黒いふち(タイヤハウス)
            body.push({ geo: new THREE.TorusGeometry(wr + 0.06, 0.04, 6, 14, Math.PI), m: M4(wx, wr, sz * (W / 2 - 0.01)), c: 0x101112 });
          }
        const g = new THREE.Group();
        g.add(new THREE.Mesh(merge(body), paint), new THREE.Mesh(merge(gl), glassM), new THREE.Mesh(merge(fl), flat));
        g.userData.size = [L * 1.25, W * 1.5];
        return g;
      };
      // 乗用車: 車体を、前から後ろへ並べた断面をつないで作る(ロフト)。
      // 上から見ると前後が細く、屋根はゆるく丸く、窓は上へ行くほど内側へ傾く。窓・柱・ライト・ドアの線・ホイールを付ける。
      // o: L 長さ・W 幅・H 屋根・belt 窓の下の線・hood ボンネット・deck トランク(無い車は後ろの窓の下)・
      //    xG0 後ろの窓の下の位置・xR0/xR1 屋根の後ろ/前・xW1 フロントガラスの下・wr タイヤの半径・pillars 柱(屋根の範囲の割合)
      const car2 = (o) => {
        const { L, W, H: Ht, belt, hood, deck, xG0, xR0, xR1, xW1, wr, color } = o;
        const NS = 34, x0 = -L / 2, x1 = L / 2, cl = 0.18;
        const ss = (a, b, x) => {
          const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
          return t * t * (3 - 2 * t);
        };
        // 上の線(横から見た輪郭)
        const top = (x) => {
          let y;
          if (x < xG0) y = deck - 0.2 * (1 - ss(x0, x0 + 0.28, x)); // 後ろの端は丸く落とす
          else if (x < xR0) y = deck + (Ht - deck) * ss(xG0, xR0, x);
          else if (x < xR1) y = Ht - 0.035 * ((x - (xR0 + xR1) / 2) / ((xR1 - xR0) / 2)) ** 2 + 0.035;
          else if (x < xW1) y = hood + 0.05 + (Ht - hood - 0.05) * (1 - ss(xR1, xW1, x));
          else y = hood + 0.05 - 0.09 * ss(xW1, x1 - 0.35, x) - 0.24 * ss(x1 - 0.35, x1, x);
          return y;
        };
        const half = (x) => {
          const u = Math.abs(x) / (L / 2);
          return (W / 2) * (1 - 0.05 * u * u - 0.15 * Math.pow(u, 9)); // 前後を少し絞り、角は丸める
        };
        const st = [];
        for (let i = 0; i <= NS; i++) {
          // 端のほうは断面を細かく(丸みが出るように)
          const t = i / NS, x = x0 + L * (0.5 - 0.5 * Math.cos(Math.PI * t) * 0.35 + (t - 0.5) * 0.65);
          const tp = top(x), w = half(x), ys = Math.min(belt + 0.02 * (-x / (L / 2)), tp - 0.03), g = Math.max(0, Math.min(1, (tp - ys) / 0.4));
          const yb = cl + 0.1 * (ss(x1 - 0.5, x1, x) + (1 - ss(x0, x0 + 0.45, x))); // 前後の下は少し上げる
          const wt = w * (0.93 - 0.15 * g); // 屋根の幅(窓は内側へ傾く)
          st.push({ x, tp, ys, g, pts: [[0, yb], [w * 0.8, yb], [w * 0.965, yb + 0.1], [w, yb + (ys - yb) * 0.45], [w * 0.992, ys - 0.08], [w * 0.955, ys], [(w * 0.955 + wt) / 2, ys + (tp - ys) * 0.55], [wt, tp - 0.045], [wt * 0.88, tp - 0.008], [wt * 0.48, tp + 0.012 * g], [0, tp + 0.016 * g]] });
        }
        const R = 20, P = [];
        for (const q of st) {
          for (let k = 0; k <= 10; k++) P.push(q.x, q.pts[k][1], q.pts[k][0]);
          for (let k = 9; k >= 1; k--) P.push(q.x, q.pts[k][1], -q.pts[k][0]);
        }
        // 端のふた(真ん中の1点へ集める)
        const capA = P.length / 3;
        P.push(x0 - 0.02, (st[0].pts[0][1] + st[0].tp) / 2, 0);
        const capB = P.length / 3;
        P.push(x1 + 0.02, (st[NS].pts[0][1] + st[NS].tp) / 2, 0);
        const iB = [], iG = [];
        const pil = (o.pillars || [0.5]).map((f) => xR0 + (xR1 - xR0) * f);
        const tri = (list, a, b, c) => {
          // 外向きになるように、向きをそろえる
          const ax = P[a * 3], ay = P[a * 3 + 1], az = P[a * 3 + 2], ux = P[b * 3] - ax, uy = P[b * 3 + 1] - ay, uz = P[b * 3 + 2] - az, vx = P[c * 3] - ax, vy = P[c * 3 + 1] - ay, vz = P[c * 3 + 2] - az;
          const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
          const mx = (ax + P[b * 3] + P[c * 3]) / 3, my = (ay + P[b * 3 + 1] + P[c * 3 + 1]) / 3, mz = (az + P[b * 3 + 2] + P[c * 3 + 2]) / 3;
          const cx = Math.max(x0 + 0.5, Math.min(x1 - 0.5, mx));
          if (nx * (mx - cx) + ny * (my - 0.7) + nz * mz >= 0) list.push(a, b, c);
          else list.push(a, c, b);
        };
        for (let i = 0; i < NS; i++) {
          const a = st[i], b = st[i + 1], xm = (a.x + b.x) / 2;
          const roofZone = a.x >= xR0 - 0.02 && b.x <= xR1 + 0.02, isPil = pil.some((px) => Math.abs(px - xm) < (b.x - a.x) * 0.55 + 0.03);
          const glassTop = (xm > xR1 + 0.04 && xm < xW1 - 0.04) || (xm > xG0 + 0.05 && xm < xR0 - 0.04 && o.rearGlass !== false);
          for (let j = 0; j < R; j++) {
            const k = j < 10 ? j : 19 - j; // 右と左で同じ番号
            const side = k === 5 || k === 6, upper = k >= 7;
            const gl = (side && roofZone && !isPil && a.x > xR0 + 0.06 && b.x < xR1 - 0.02) || (upper && k <= 9 && glassTop && !(k === 7 && false));
            const v00 = i * R + j, v01 = i * R + ((j + 1) % R), v10 = (i + 1) * R + j, v11 = (i + 1) * R + ((j + 1) % R);
            const list = gl ? iG : iB;
            tri(list, v00, v10, v11);
            tri(list, v00, v11, v01);
          }
        }
        for (let j = 0; j < R; j++) (tri(iB, capA, j, (j + 1) % R), tri(iB, capB, NS * R + j, NS * R + ((j + 1) % R)));
        const mk = (idx) => {
          const g = new THREE.BufferGeometry();
          g.setAttribute("position", new THREE.Float32BufferAttribute(P, 3));
          g.setIndex(idx);
          g.computeVertexNormals();
          return g;
        };
        const body = [{ geo: mk(iB), c: color }], gl = [{ geo: mk(iG) }], fl = [];
        const hw = (x) => half(x);
        // 下まわり・グリル・ナンバー・ライト(前はボンネットの下、後ろはトランクの下)
        fl.push({ geo: boxG(L * 0.86, 0.1, W * 0.86), m: M4(0, cl + 0.04, 0), c: 0x111213 });
        const nH = top(x1 - 0.06), tH = top(x0 + 0.08);
        fl.push({ geo: boxG(0.04, 0.16, W * 0.46), m: M4(x1 - 0.005, nH - 0.3, 0), c: 0x121416 }); // グリル
        fl.push({ geo: boxG(0.04, 0.1, W * 0.62), m: M4(x1 - 0.03, cl + 0.2, 0), c: 0x17191b }); // 下の吸気口
        fl.push({ geo: boxG(0.02, 0.11, 0.33), m: M4(x1 + 0.012, nH - 0.47, 0), c: 0xf4f4f0 });
        fl.push({ geo: boxG(0.02, 0.11, 0.33), m: M4(x0 - 0.012, tH - 0.42, 0), c: 0xf4f4f0 });
        fl.push({ geo: boxG(0.03, 0.08, W * 0.7), m: M4(x0 + 0.02, cl + 0.2, 0), c: 0x17191b });
        for (const sz of [-1, 1]) {
          // ヘッドライト(角に回りこむ形)とテールライト
          fl.push({ geo: boxG(0.2, 0.1, W * 0.2), m: M4(x1 - 0.13, nH - 0.12, sz * W * 0.335, 0, -sz * 0.5, 0), c: 0xfff8e0 });
          fl.push({ geo: boxG(0.06, 0.035, W * 0.16), m: M4(x1 - 0.12, nH - 0.19, sz * W * 0.345, 0, -sz * 0.5, 0), c: 0xffc040 });
          fl.push({ geo: boxG(0.16, 0.11, W * 0.19), m: M4(x0 + 0.1, tH - 0.13, sz * W * 0.34, 0, sz * 0.45, 0), c: 0xc8161a });
          fl.push({ geo: boxG(0.05, 0.05, W * 0.1), m: M4(x0 + 0.06, tH - 0.24, sz * W * 0.35, 0, sz * 0.45, 0), c: 0xffffff });
          // ミラー
          body.push({ geo: new THREE.SphereGeometry(0.085, 8, 6), m: M4(xW1 - 0.42, belt + 0.09, sz * (hw(xW1 - 0.42) + 0.07), 0, 0, 0, 0.75, 0.62, 1.15), c: color });
          // ドアの線と取っ手
          const sill = cl + 0.14;
          for (const dx of [xW1 - 0.52, ...pil, xR0 + 0.12]) fl.push({ geo: boxG(0.009, belt - sill - 0.04, 0.012), m: M4(dx, (belt + sill) / 2, sz * (hw(dx) * 0.992 + 0.004)), c: 0x0c0c0d });
          for (const px of pil) fl.push({ geo: boxG(0.16, 0.03, 0.02), m: M4(px - 0.2, belt - 0.11, sz * (hw(px) * 0.985 + 0.012)), c: 0x1a1b1d });
          fl.push({ geo: boxG(0.16, 0.03, 0.02), m: M4(xR0 + 0.32, belt - 0.11, sz * (hw(xR0) * 0.985 + 0.012)), c: 0x1a1b1d });
          // 窓の下のふち
          fl.push({ geo: boxG(xW1 - 0.3 - (xR0 - 0.1), 0.022, 0.012), m: M4((xW1 - 0.3 + xR0 - 0.1) / 2, belt + 0.005, sz * (hw(0) * 0.957 + 0.004)), c: 0x0e0f10 });
        }
        // タイヤ・ホイール・タイヤハウス
        const tg = new THREE.CylinderGeometry(wr, wr, 0.21, 22), rg = new THREE.CylinderGeometry(wr * 0.66, wr * 0.66, 0.215, 18), hg = new THREE.CylinderGeometry(wr * 0.16, wr * 0.16, 0.225, 8);
        const arch = new THREE.RingGeometry(wr * 0.97, wr + 0.085, 20, 1, 0, Math.PI);
        for (const wx of [x0 + L * 0.19, x1 - L * 0.185])
          for (const sz of [-1, 1]) {
            const zz = sz * (hw(wx) - 0.1);
            const m = M4(wx, wr, zz, Math.PI / 2, 0, 0);
            // タイヤは角を丸く(ドーナツの形)、ホイールは奥にへこませる
            fl.push({ geo: new THREE.TorusGeometry(wr - 0.085, 0.085, 10, 26), m: M4(wx, wr, zz), c: 0x0d0d0e }, { geo: new THREE.TorusGeometry(wr - 0.1, 0.07, 8, 26), m: M4(wx, wr, zz + sz * 0.04), c: 0x16171a });
            fl.push({ geo: new THREE.CylinderGeometry(wr * 0.7, wr * 0.7, 0.16, 20), m, c: 0x0d0d0e }, { geo: rg, m: M4(wx, wr, zz + sz * 0.02, Math.PI / 2, 0, 0), c: 0xb4bac0 }, { geo: hg, m: M4(wx, wr, zz + sz * 0.05, Math.PI / 2, 0, 0), c: 0x3c4044 });
            fl.push({ geo: new THREE.TorusGeometry(wr * 0.66, 0.012, 6, 26), m: M4(wx, wr, zz + sz * 0.13), c: 0xe4e8ec }); // リムのふち
            // スポークのすき間(暗い板を5枚)
            for (let q = 0; q < 5; q++) fl.push({ geo: boxG(wr * 0.13, wr * 0.36, 0.01), m: M4(wx + Math.sin((q / 5) * 6.283) * wr * 0.4, wr + Math.cos((q / 5) * 6.283) * wr * 0.4, zz + sz * 0.135, 0, 0, -(q / 5) * 6.283), c: 0x1a1c1e });
            fl.push({ geo: arch, m: M4(wx, wr, sz * (hw(wx) + 0.004), 0, sz > 0 ? 0 : Math.PI, 0), c: 0x0b0b0c });
          }
        if (o.sign) fl.push({ geo: boxG(0.42, 0.14, 0.2), m: M4((xR0 + xR1) / 2, Ht + 0.09, 0), c: o.sign });
        // ---- 細部 ----
        // 室内(ガラスごしに見える): 座席・背もたれ・ヘッドレスト・ダッシュボード・ハンドル・運転している人
        const inn = [], seatY = belt - 0.34, fx = xW1 - 1.15, rx2 = xR0 + 0.45, zw = W * 0.2;
        for (const sx of [fx, rx2])
          for (const sz of [-1, 1]) {
            inn.push({ geo: boxG(0.48, 0.14, 0.44), m: M4(sx, seatY, sz * zw), c: 0x2c2e33 });
            inn.push({ geo: boxG(0.12, 0.58, 0.44), m: M4(sx - 0.25, seatY + 0.32, sz * zw, 0, 0, 0.18), c: 0x33363b });
            inn.push({ geo: boxG(0.1, 0.17, 0.24), m: M4(sx - 0.31, seatY + 0.7, sz * zw), c: 0x2c2e33 });
          }
        inn.push({ geo: boxG(0.35, 0.22, W * 0.8), m: M4(xW1 - 0.42, belt - 0.08, 0), c: 0x1e2024 }); // ダッシュボード
        inn.push({ geo: new THREE.TorusGeometry(0.17, 0.02, 6, 16), m: M4(xW1 - 0.7, belt + 0.02, zw, 0, Math.PI / 2 - 0.0, 0.0), c: 0x101113 }); // ハンドル(右)
        inn.push({ geo: new THREE.CapsuleGeometry(0.17, 0.3, 4, 8), m: M4(fx - 0.06, seatY + 0.38, zw, 0, 0, 0.1), c: [0x39445a, 0x5a3d3a, 0x3d4a3c, 0x6a6a6e][Math.floor(rnd() * 4)] }); // 運転している人
        inn.push({ geo: new THREE.SphereGeometry(0.105, 10, 8), m: M4(fx - 0.02, seatY + 0.78, zw), c: 0xd9a27e });
        inn.push({ geo: new THREE.SphereGeometry(0.108, 10, 8, 0, 6.3, 0, 1.7), m: M4(fx - 0.035, seatY + 0.8, zw), c: 0x1a1512 });
        // ワイパー・屋根のアンテナ・マフラー・泥よけの下の黒い帯・バンパーの継ぎ目
        for (const sz of [-1, 1]) fl.push({ geo: boxG(0.02, 0.02, W * 0.34), m: M4(xW1 - 0.05, top(xW1 - 0.05) + 0.015, sz * W * 0.17 + 0.05, 0, 0.12, 0), c: 0x0c0c0d });
        body.push({ geo: new THREE.ConeGeometry(0.035, 0.16, 6), m: M4(xR0 + 0.15, Ht + 0.06, 0, 0, 0, 0.5, 1.6, 1, 0.5), c: 0x101113 });
        fl.push({ geo: new THREE.CylinderGeometry(0.03, 0.03, 0.14, 8), m: M4(x0 + 0.04, cl + 0.07, -W * 0.28, 0, 0, Math.PI / 2), c: 0x8a8d90 });
        for (const sz of [-1, 1]) {
          fl.push({ geo: boxG(L * 0.5, 0.07, 0.012), m: M4(0, cl + 0.1, sz * (hw(0) * 0.972 + 0.004)), c: 0x101113 });
          fl.push({ geo: boxG(0.008, 0.32, 0.012), m: M4(x1 - 0.42, cl + 0.36, sz * (hw(x1 - 0.42) * 0.99 + 0.004)), c: 0x0c0c0d });
          fl.push({ geo: boxG(0.008, 0.32, 0.012), m: M4(x0 + 0.4, cl + 0.36, sz * (hw(x0 + 0.4) * 0.99 + 0.004)), c: 0x0c0c0d });
          // ヘッドライトの中のレンズ(丸い目)と、テールライトの中の白い部分
          fl.push({ geo: new THREE.SphereGeometry(0.045, 10, 8), m: M4(x1 - 0.07, nH - 0.12, sz * W * 0.3, 0, 0, 0, 0.5, 1, 1), c: 0xffffff });
          fl.push({ geo: new THREE.TorusGeometry(0.055, 0.008, 6, 14), m: M4(x1 - 0.055, nH - 0.12, sz * W * 0.3, 0, Math.PI / 2, 0), c: 0x9aa0a6 });
        }
        // ブレーキランプ(止まるとき・減速するときに光る)と、ヘッドライトの光(夕方と夜)
        const bk = [];
        for (const sz of [-1, 1]) bk.push({ geo: boxG(0.17, 0.12, W * 0.2), m: M4(x0 + 0.095, tH - 0.13, sz * W * 0.34, 0, sz * 0.45, 0), c: 0xff3020 });
        bk.push({ geo: boxG(0.03, 0.03, W * 0.3), m: M4(xG0 + 0.05, top(xG0 + 0.05) + 0.02, 0), c: 0xff3020 }); // 上の3つ目のランプ
        const brake = new THREE.Mesh(merge(bk), flat);
        brake.userData.brake = true;
        brake.visible = false;
        const beam = new THREE.Mesh(beamG, beamM);
        beam.position.set(x1 + 4.2, 0.06, 0);
        beam.userData.beam = true;
        beam.visible = false;
        const lampOn = [];
        for (const sz of [-1, 1]) lampOn.push({ geo: new THREE.SphereGeometry(0.09, 8, 6), m: M4(x1 - 0.05, nH - 0.12, sz * W * 0.31, 0, 0, 0, 0.4, 1, 1.6), c: 0xfffbe6 });
        const lamp = new THREE.Mesh(merge(lampOn), flat);
        lamp.userData.beam = true;
        lamp.visible = false;
        const g = new THREE.Group();
        g.add(new THREE.Mesh(merge(inn), cloth), new THREE.Mesh(merge(body), paint), new THREE.Mesh(merge(fl), flat), brake, lamp, beam, new THREE.Mesh(merge(gl), glass2));
        g.userData.size = [L * 1.25, W * 1.5];
        return g;
      };
      const sedan = (c, sign) => car2({ L: 4.6, W: 1.78, H: 1.43, belt: 0.9, hood: 0.8, deck: 0.98, xG0: -1.62, xR0: -0.95, xR1: 0.22, xW1: 1.02, wr: 0.32, color: c, sign });
      const hatch = (c) => car2({ L: 4.0, W: 1.7, H: 1.5, belt: 0.9, hood: 0.82, deck: 1.02, xG0: -1.88, xR0: -1.45, xR1: 0.18, xW1: 0.95, wr: 0.31, color: c });
      const kei = (c) => car2({ L: 3.4, W: 1.48, H: 1.74, belt: 0.95, hood: 0.92, deck: 1.05, xG0: -1.62, xR0: -1.42, xR1: 0.55, xW1: 1.05, wr: 0.28, color: c, pillars: [0.48] });
      const van = (c) => car2({ L: 4.8, W: 1.8, H: 1.86, belt: 1.0, hood: 0.95, deck: 1.1, xG0: -2.32, xR0: -2.08, xR1: 0.75, xW1: 1.55, wr: 0.33, color: c, pillars: [0.36, 0.7] });
      const suv = (c) => car2({ L: 4.5, W: 1.84, H: 1.68, belt: 1.02, hood: 0.98, deck: 1.12, xG0: -2.1, xR0: -1.7, xR1: 0.2, xW1: 0.92, wr: 0.36, color: c, pillars: [0.42, 0.78] });
      const ktruck = (c) => car({ L: 3.4, W: 1.48, H: 1.78, belt: 0.95, hood: 0.95, trunk: 0.72, cabR: -1.6, cabF: 1.45, rakeR: 0, rakeF: 0, wr: 0.28, color: c, cargo: "bed" });
      const box2t = (c) => car({ L: 4.7, W: 1.75, H: 2.0, belt: 1.05, hood: 1.05, trunk: 0.8, cabR: -2.2, cabF: 2.1, rakeR: 0, rakeF: 0, wr: 0.34, color: c, cargo: "box", boxH: 2.55 });
      // 歩行者: 胴・頭・髪・腕をまとめた1つと、歩く脚2本
      const SKIN = [0xe8b896, 0xd9a27e, 0xc68e6a, 0xf0c8a8], HAIR = [0x1a1512, 0x2a1e16, 0x3a2a1c, 0x555555, 0x101010];
      const person = (shirt, pants) => {
        const g = new THREE.Group();
        const sk = SKIN[Math.floor(rnd() * SKIN.length)], hr = HAIR[Math.floor(rnd() * HAIR.length)], tall = 0.94 + rnd() * 0.12, wide = 0.92 + rnd() * 0.2;
        const cap = (r, l) => new THREE.CapsuleGeometry(r, l, 4, 10);
        const parts = [
          { geo: cap(0.15, 0.32), m: M4(0, 1.2, 0, 0, 0, 0, 0.8 * wide, 1, 1.22 * wide), c: shirt }, // 胴
          { geo: cap(0.13, 0.08), m: M4(0, 0.93, 0, 0, 0, 0, 0.82 * wide, 1, 1.15 * wide), c: pants }, // 腰
          { geo: new THREE.CylinderGeometry(0.045, 0.05, 0.08, 8), m: M4(0, 1.5, 0), c: sk },
          { geo: new THREE.SphereGeometry(0.108, 14, 10), m: M4(0.005, 1.62, 0, 0, 0, 0, 1, 1.12, 0.94), c: sk },
          { geo: new THREE.SphereGeometry(0.114, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55), m: M4(-0.012, 1.635, 0, 0, 0, 0.25, 1, 1.1, 0.97), c: hr }, // 髪
        ];
        // 顔(目と口)・耳・えり。3人に1人は、肩かけかばんかリュック
        for (const sz of [-1, 1]) (parts.push({ geo: new THREE.SphereGeometry(0.012, 6, 5), m: M4(0.098, 1.635, sz * 0.04), c: 0x1c1410 }), parts.push({ geo: new THREE.SphereGeometry(0.022, 6, 5), m: M4(0, 1.62, sz * 0.105, 0, 0, 0, 0.6, 1, 0.5), c: sk }));
        parts.push({ geo: boxG(0.012, 0.01, 0.04), m: M4(0.1, 1.575, 0), c: 0x7a3a34 });
        parts.push({ geo: new THREE.CylinderGeometry(0.075, 0.085, 0.04, 8), m: M4(0, 1.46, 0), c: shirt });
        const bagK = rnd();
        if (bagK < 0.2) parts.push({ geo: boxG(0.14, 0.36, 0.3), m: M4(-0.17, 1.2, 0), c: [0x2a2c30, 0x3a4a6a, 0x6a3a2a][Math.floor(rnd() * 3)] }); // リュック
        else if (bagK < 0.36) (parts.push({ geo: boxG(0.3, 0.22, 0.08), m: M4(0.02, 0.95, 0.27 * wide), c: [0x4a3424, 0x1c1c1e, 0x8a7a5a][Math.floor(rnd() * 3)] }), parts.push({ geo: boxG(0.02, 0.62, 0.02), m: M4(0, 1.22, 0.14 * wide, 0.42, 0, 0), c: 0x1c1c1e }));
        const body = new THREE.Mesh(merge(parts), cloth);
        // 腕は肩を支点に振る(歩くとき、脚と逆に動く)
        const armG = merge([{ geo: cap(0.045, 0.24), m: M4(0, -0.17, 0), c: shirt }, { geo: cap(0.038, 0.22), m: M4(0.02, -0.44, 0), c: sk }, { geo: new THREE.SphereGeometry(0.045, 8, 6), m: M4(0.03, -0.62, 0), c: sk }]);
        const armL = new THREE.Mesh(armG, cloth), armR = new THREE.Mesh(armG, cloth);
        armL.position.set(0, 1.42, -0.215 * wide);
        armR.position.set(0, 1.42, 0.215 * wide);
        g.add(armL, armR);
        g.userData.arms = [armL, armR];
        g.userData.body = body;
        const legG = merge([{ geo: cap(0.068, 0.62), m: M4(0, -0.39, 0), c: pants }, { geo: boxG(0.24, 0.07, 0.1), m: M4(0.05, -0.8, 0), c: 0x202024 }]);
        const legL = new THREE.Mesh(legG, cloth), legR = new THREE.Mesh(legG, cloth);
        legL.position.set(0, 0.86, -0.085 * wide);
        legR.position.set(0, 0.86, 0.085 * wide);
        g.add(body, legL, legR);
        g.scale.setScalar(tall);
        g.userData.legs = [legL, legR];
        g.userData.size = [0.75, 0.75];
        return g;
      };
      tpl = {
        cars: [sedan(0xf2f2ee), sedan(0x24272c), sedan(0x9aa3ab), sedan(0x7a1c22), hatch(0xe8e9e6), hatch(0x2c5f9e), hatch(0xb9bfc4), kei(0xdfe7ee), kei(0xf0d9a8), kei(0x8fb7a8), van(0xf4f4f1), van(0x30343a), suv(0x1e2226), suv(0xe6e6e2), ktruck(0xf1f1ee), box2t(0x3a6ea8),
          sedan(0x16181b, 0x3ec46a), sedan(0xe9c43a, 0xffffff), sedan(0x1d4f3c, 0xffe27a)],
        person, blob, useBlob,
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
      // 足もとの丸い影(本物の影がない端末だけ)
      if (t.useBlob()) {
        const sz = obj.userData.size || [1.9, 0.8];
        obj.add(t.blob(sz[0], sz[1]));
      }
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
          // 前の車(同じ車線)との間をあける: 7mより近づいたら止まる(信号待ちで重ならないように)
          let ahead = null;
          for (const o of list) if (o !== e && o.kind === "car" && o.dir > 0 && o.along > e.along && o.along - e.along < 14 && (!ahead || o.along < ahead.along)) ahead = o;
          if (ahead) {
            const gap = ahead.along - e.along;
            v = gap < 7 ? 0 : Math.min(v, (ahead.cv || 0) + (gap - 7) * 0.9);
          }
        }
        // 車は自転車(自分)をひかない: 後ろから来た車は、横に1m以上あけて追い越す。あけられない狭い道では、後ろについて走る。
        // 前を走る車に自分が追いついたら、車のほうが先へ逃げる
        let r = Roads.ride(e.along), off = laneOff(e, r);
        if (e.kind === "car" && e.dir > 0) {
          const rel0 = e.along - s.along, half = (e.obj.userData.size ? e.obj.userData.size[1] / 1.5 : 1.75) / 2;
          const myOff0 = (r ? r.off : 0) - (s.dodge || 0), need = half + 0.3 + 1.0; // 車の半分 + 自分の半分 + あける幅
          if (rel0 > -14 && rel0 < 7) {
            const W = r ? r.W : 4, Lf = r ? r.off + (W >= 4.5 ? 0.9 : Math.max(0.6, W * 0.22)) : 2;
            const minOff = Lf - W + half + 0.15; // 道の右端いっぱい
            const want = Math.min(off, myOff0 - need);
            if (want >= minOff) e.shift = (e.shift || 0) + (want - off - (e.shift || 0)) * Math.min(1, dt * 3);
            else {
              // よけきれない: 追い越さない
              e.shift = (e.shift || 0) + (Math.max(minOff, want) - off - (e.shift || 0)) * Math.min(1, dt * 3);
              if (rel0 < 0) v = Math.min(v, rel0 > -7 ? Math.max(0, s.v - 0.5) : s.v + 2);
              else v = Math.max(v, s.v + 2);
            }
          } else e.shift = (e.shift || 0) * Math.max(0, 1 - dt * 1.5);
          off += e.shift || 0;
        }
        // 信号: 車・人・ほかの自転車も、赤と(止まれる)黄色では停止線で止まる
        if (e.dir > 0) v = Math.min(v, Signals.limit(e.along, s.t, v));
        else
          for (const sg of Signals.list()) {
            const d = e.along - (sg.along + 6); // 向こうから来るものは、交差点の向こう側の停止線
            if (d < -1 || d > 70) continue;
            const st = Signals.stateAt(sg, s.t);
            if (st === "g" || (st === "y" && d < (v * v) / 6 - 1)) continue;
            v = Math.min(v, d <= 0.3 ? 0 : Math.sqrt(5 * Math.max(0, d)));
          }
        // 向こうから来る車どうしも、前の車との間をあける
        if (e.kind === "car" && e.dir < 0) for (const o of list) if (o !== e && o.kind === "car" && o.dir < 0 && o.along < e.along && e.along - o.along < 7) v = 0;
        e.cv = v;
        if (e.kind === "car") {
          if (e.lamps === undefined) e.lamps = e.obj.children.filter((o) => o.userData.brake || o.userData.beam);
          const night = timeMode !== "day";
          for (const o of e.lamps) o.visible = o.userData.brake ? v < e.v * 0.6 : night;
        }
        e.along += e.dir * v * dt;
        r = Roads.ride(e.along);
        const p = at(e.along);
        const x = p.x + p.tz * off, z = p.z - p.tx * off;
        e.obj.position.set(x, H(x, z) + (e.kind === "ped" && W5(r) ? 0.17 : 0), z);
        e.obj.rotation.y = -Math.atan2(p.tz, p.tx) + (e.dir < 0 ? Math.PI : 0);
        if (e.kind === "ped") {
          const ph = (s.t * 6 + e.lane * 10) % (Math.PI * 2);
          // 止まっているとき(信号待ち)は動かさない
          const k = Math.min(1, v / 0.6), ud = e.obj.userData;
          ud.legs[0].rotation.z = Math.sin(ph) * 0.45 * k;
          ud.legs[1].rotation.z = -Math.sin(ph) * 0.45 * k;
          if (ud.arms) (ud.arms[0].rotation.z = -Math.sin(ph) * 0.4 * k), (ud.arms[1].rotation.z = Math.sin(ph) * 0.4 * k);
          if (ud.body) (ud.body.position.y = Math.abs(Math.cos(ph)) * 0.025 * k), (ud.body.rotation.y = Math.sin(ph) * 0.07 * k);
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
    return { update, dodge, score: () => score, passed: () => passed, _tpl: templates, objs: () => list.map((e) => e.obj) };
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
    // 止まるのは大きな交差点だけ。小さな交差点の信号と、信号で左折する所は、見えていても止まらずに進む
    function must(sg) {
      if (sg.must != null && sg.mustN > 3) return sg.must;
      const a = at(Math.max(0, sg.along - 14)), b = at(Math.min(route.length, sg.along + 14));
      const left = a.tx * b.tz - a.tz * b.tx < -0.55;
      let span = 0;
      for (const [a0, a1] of Roads.crossings()) if (a0 - 8 < sg.along && a1 + 8 > sg.along) span = Math.max(span, a1 - a0);
      const r = Roads.ride(sg.along - 12) || Roads.ride(sg.along + 12);
      // 横切る道の幅(交差点の長さ)が14m以上か、自分の道が11m以上なら「大きな交差点」
      const big = span >= 14 || (r && r.W >= 11);
      sg.mustN = (sg.mustN || 0) + (span > 0 || r ? 4 : 1); // 道の形が届くまでは決めきらない
      return (sg.must = big && !left);
    }
    function limit(along, t, v) {
      const sg = next(along);
      if (!sg || !must(sg)) return 99;
      const stop = sg.along - 6, d = stop - along; // 停止線は信号の6m手前
      if (d < -1) return 99;
      const st = stateAt(sg, t);
      // 黄色: 止まれる距離なら止まる。止まれなければそのまま行く
      if (st === "g") return 99;
      // 黄色のうちに停止線を越えられるときだけ、そのまま行く
      if (st === "y" && d < v * left(sg, t) - 0.5) return 99;
      return d <= 0.3 ? 0 : Math.sqrt(2 * 2.5 * Math.max(0, d));
    }
    // 赤のあいだは、停止線を絶対に越えさせない(a0 から a1 へ進もうとしたときの、進んでよい位置を返す)
    function gate(a0, a1, t) {
      for (const sg of list) {
        const stop = sg.along - 6;
        if (stop < a0 - 0.5) continue;
        if (stop >= a1) break;
        if (must(sg) && stateAt(sg, t) === "r") return Math.max(a0, stop);
      }
      return a1;
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
      // 停止線は Roads が路面にそわせて描く(止まる位置 = 信号の6m手前)
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
    return { prepare, update, limit, gate, next, stateAt, list: () => list, source: () => source };
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
        tiles.addEventListener("load-model", (e) => {
          models++;
          if (e && e.scene) flatPatch(e.scene);
        });
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
    // ---- 近くの補正 ----
    // Googleの3Dは空から撮った写真で作った形なので、道の高さから見ると建物も道も溶けて見える。
    // そこで自分のまわり(600mまで)は、Googleの形を地面の高さへ押しつぶして「写真を貼った地面」にし、
    // その上に、形のきれいな建物(国のデータ)と道路を立てる。700mより先は Google の街をそのまま見せる(遠くはきれいに見える)。
    const FL = { R1: 600, R2: 700, size: 1760, n: 128 };
    const flatU = { uFlatH: { value: null }, uFlatC: { value: null }, uFlatR: { value: null } };
    let flatAt = null;
    function flatPatch(root) {
      const THREE = T();
      if (!flatU.uFlatC.value) (flatU.uFlatC.value = new THREE.Vector4(0, 0, FL.size, 0)), (flatU.uFlatR.value = new THREE.Vector4(0, 0, FL.R1, FL.R2));
      root.traverse((o) => {
        const m = o.isMesh && o.material;
        if (!m || m.userData.flat) return;
        m.userData.flat = true;
        m.onBeforeCompile = (sh) => {
          Object.assign(sh.uniforms, flatU);
          sh.vertexShader = "uniform sampler2D uFlatH;\nuniform vec4 uFlatC;\nuniform vec4 uFlatR;\n" + sh.vertexShader.replace("#include <project_vertex>", `
            vec4 mvPosition = modelMatrix * vec4(transformed, 1.0);
            if (uFlatC.w > 0.5) {
              float fk = smoothstep(uFlatR.z, uFlatR.w, distance(mvPosition.xz, uFlatR.xy));
              float fh = texture2D(uFlatH, (mvPosition.xz - uFlatC.xy) / uFlatC.z + 0.5).r;
              // 近く: 地面の高さ(少し下)へ。高さの順番だけは残す(屋根や木の上が上になる。空から見た写真と同じ)
              mvPosition.y = mix(fh - 0.1 + (mvPosition.y - fh) * 0.003, mvPosition.y, fk);
            }
            mvPosition = viewMatrix * mvPosition;
            gl_Position = projectionMatrix * mvPosition;`);
        };
        m.customProgramCacheKey = () => "g3flat";
        m.needsUpdate = true;
      });
    }
    // 自分のまわりの地面の高さを、小さな絵(128×128・1760m四方)にして渡す。90m動くごとに作り直す
    function flatUpdate(p) {
      const THREE = T();
      if (!flatU.uFlatC.value) (flatU.uFlatC.value = new THREE.Vector4(0, 0, FL.size, 0)), (flatU.uFlatR.value = new THREE.Vector4(0, 0, FL.R1, FL.R2));
      flatU.uFlatR.value.set(p.x, p.z, FL.R1, FL.R2);
      flatU.uFlatC.value.w = 1;
      if (flatAt && Math.hypot(p.x - flatAt[0], p.z - flatAt[1]) < 90) return;
      flatAt = [p.x, p.z];
      const n = FL.n, a = new Float32Array(n * n);
      for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) a[j * n + i] = H(p.x + ((i + 0.5) / n - 0.5) * FL.size, p.z + ((j + 0.5) / n - 0.5) * FL.size);
      const old = flatU.uFlatH.value;
      const tx = new THREE.DataTexture(a, n, n, THREE.RedFormat, THREE.FloatType);
      tx.magFilter = tx.minFilter = renderer.extensions.has("OES_texture_float_linear") ? THREE.LinearFilter : THREE.NearestFilter;
      tx.needsUpdate = true;
      flatU.uFlatH.value = tx;
      flatU.uFlatC.value.set(p.x, p.z, FL.size, 1);
      if (old) old.dispose();
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
      // タイヤの下の狭い範囲を9点測り、低いほうから3番目を路面とする
      // (いちばん低い点だと、くぼみに合わせてしまいタイヤが沈む。高い点は車や木)
      const ys = [];
      for (const [dx, dz] of [[0, 0], [0.5, 0], [-0.5, 0], [0, 0.5], [0, -0.5], [0.9, 0.9], [-0.9, 0.9], [0.9, -0.9], [-0.9, -0.9]]) {
        ray.caster.set(new THREE.Vector3(x + dx, 400, z + dz), new THREE.Vector3(0, -1, 0));
        const hit = ray.caster.intersectObject(tiles.group, true)[0];
        if (hit) ys.push(hit.point.y);
      }
      if (!ys.length) return null;
      ys.sort((a, b) => a - b);
      return ys[Math.min(ys.length - 1, 2)];
    }
    function update(dt) {
      if (!on || !tiles) return;
      const s = sim;
      place(s.along);
      if ((ray.tick += dt) > 0.12) {
        ray.tick = 0;
        const p = at(s.along);
        // 道のまん中ではなく、自分のタイヤの真下で測る
        const mp = typeof me !== "undefined" && me && me.g ? me.g.position : p;
        const g = groundAt(mp.x, mp.z);
        const want = typeof me !== "undefined" && me && me.g ? mp.y : H(p.x, p.z);
        if (g != null && Math.abs(g - want) < 60) {
          groundH += (g - want) * 0.85;
          place(s.along, true);
        }
        const r = at(s.rAlong);
        const gr = Math.hypot(r.x - p.x, r.z - p.z) < 600 ? groundAt(r.x - r.tz * 1.3, r.z + r.tx * 1.3) : null;
        ray.rival = gr != null && Math.abs(gr - H(r.x, r.z)) < 40 ? gr : H(r.x, r.z);
      }
      flatUpdate(at(s.along));
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
      _flat: [flatPatch, flatUpdate],
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
    let on = false, err = "", el = null, lastAlong = -1e9, busy = false, lastId = "", hdg = null, povT = 0, miss = 0, failed = false, tryAt = 0, why = "", told = false;
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
    // ストリートビューは、別のページ(sv.html)を画面いっぱいに埋めこんで出す。
    // この画面の中に直接作ると、見た目の決まり(CSS)や大きさの影響で、写真が真っ黒になることがあった。
    let frame = null, ready = false, hello = false, status = "", draw = "", logs = "", toldLog = false;
    const post = (m) => frame && frame.contentWindow && frame.contentWindow.postMessage(Object.assign({ sv: 1 }, m), location.origin);
    function fail(text) {
      err = text;
      failed = true;
      stop();
      try {
        localStorage.setItem("city_sv", "0");
      } catch (e) {}
      ticker("ストリートビューを表示できないので、3Dの街に戻しました。" + err, "opp");
    }
    window.addEventListener("message", (e) => {
      const d = e.data;
      if (e.origin !== location.origin || !d || !d.sv || !frame || e.source !== frame.contentWindow) return;
      if (d.t === "hello") (hello = true), post({ t: "key", key: G3.getKey() });
      else if (d.t === "ready") ready = true;
      else if (d.t === "auth") fail("キーで Maps JavaScript API が使えません。Google Cloud で「Maps JavaScript API」を有効にして、キーの「API の制限」にも加えてください");
      else if (d.t === "fail") fail(d.why || "");
      else if (d.t === "status") status = d.s;
      else if (d.t === "draw") draw = d.s;
      else if (d.t === "log") {
        logs = (logs + " / " + d.why).slice(-160);
        if (!toldLog) (toldLog = true), ticker("ストリートビューの中でエラー: " + d.why, "opp");
      }
      else if (d.t === "ok") (busy = false), (miss = 0), (lastId = d.id);
      else if (d.t === "miss") {
        busy = false;
        miss++;
        why = d.why || "";
        // 3回続けて取れなかったら、理由を1度だけ知らせる
        if (miss === 3 && !told) (told = true), ticker(`ストリートビューの写真を取れません(${why || "理由不明"})。3Dの街で走ります`, "opp");
      }
    });
    async function start() {
      err = "";
      if (!G3.getKey()) return (err = "APIキーを入れてください"), false;
      if (failed) return (err = "キーで Maps JavaScript API が使えません(Google Cloud で有効にして、キーの「API の制限」に加えたあと、ページを読み込み直してください)"), false;
      if (!frame && over()) return (err = over() + "。料金がかからないように止めています"), false;
      if (!el) {
        el = document.createElement("div");
        el.className = "ct-sv off";
        el.innerHTML = `<iframe class="ct-sv-pano" title="ストリートビュー" tabindex="-1"></iframe><div class="ct-sv-rival" hidden><i></i><b></b></div><div class="ct-sv-bike"></div>`;
        $("ct-view").appendChild(el);
      }
      if (!frame) {
        const u = usage();
        u.n++;
        u.dn++;
        try {
          localStorage.setItem("city_svuse", JSON.stringify(u));
        } catch (e) {}
        frame = el.firstChild;
        const me = document.querySelector('script[src*="js/city.js"]');
        frame.src = "sv.html" + (me && me.src.includes("?") ? "?" + me.src.split("?")[1] : "");
      }
      el.classList.add("off"); // 最初の写真が届いてから出す
      on = true;
      lastAlong = -1e9;
      lastId = "";
      miss = 0;
      busy = false;
      return true;
    }
    function stop() {
      on = false;
      if (el) el.classList.add("off");
      const c = $("ct-sv");
      if (c) c.checked = false;
    }
    // 走っている向き(北=0・東=90)
    const heading = (p) => ((Math.atan2(p.tx, -p.tz) * 180) / Math.PI + 360) % 360;
    function update(dt, p, s) {
      if (!on || !ready) return;
      // 向き: 道の向きへ、なめらかに回す
      const want = heading(p);
      if (hdg == null || isNaN(hdg)) hdg = want;
      hdg = (hdg + ((((want - hdg) % 360) + 540) % 360 - 180) * Math.min(1, dt * 2.5) + 360) % 360;
      // 向きは、変わったときだけ送る(毎回送ると、写真の読み込みのじゃまになることがある)
      if ((povT += dt) > 0.15 && !isNaN(hdg) && (sentH == null || Math.abs(hdg - sentH) > 0.4)) (povT = 0), (sentH = hdg), post({ t: "pov", h: hdg });
      // いまの道のりを毎コマ知らせる(写真を、進んだ分だけ大きくして、前へ進んで見せるため)
      post({ t: "at", a: s.along });
      // 写真を先へ進める: 25mごと(速いときは、3秒に1回までに間引く)。
      // まだ1枚も出せていない間(出発地点のそばに写真が無いなど)は、2秒おきに、範囲を広げて探し直す
      const step = Math.max(25, s.v * s.speedX * 3), now = performance.now();
      if (busy && now - tryAt > 6000) busy = false; // 返事が来ないとき
      const retry = (!lastId || miss > 0) && now - tryAt > 2000;
      if (!busy && (Math.abs(s.along - lastAlong) >= step || retry)) {
        lastAlong = s.along;
        tryAt = now;
        busy = true;
        const q = at(s.along + 6);
        post({ t: "find", a: s.along + 6, wait: 1300, lat: route.lat0 - q.z / route.kz, lng: route.lon0 + q.x / route.kx, r: miss > 0 || !lastId ? 150 : 35, outdoor: !(miss > 1) });
      }
      // 写真を出せている間だけ、写真の画面にする。出せない間は、下の3Dの街を見せる(真っ黒にしない)
      const show = !!lastId && miss < 3;
      if (el.classList.contains("off") === show) {
        el.classList.toggle("off", !show);
        if (!show && lastId) ticker("このあたりはストリートビューの写真がないので、3Dの街で走ります", "opp");
      }
      // ライバル: 前にいるときだけ、距離に合わせた大きさで出す
      const d = s.rAlong - s.along, rv = el.querySelector(".ct-sv-rival");
      rv.hidden = !(d > 4 && d < 120);
      if (!rv.hidden) {
        const k = Math.min(1, 9 / d);
        rv.style.transform = `translate(-50%, 0) scale(${k.toFixed(3)})`;
        rv.lastChild.textContent = `${Math.round(d)}m`;
      }
    }
    let sentH = null;
    const info = () => `準備 ${hello ? "○" : "×"}/${ready ? "○" : "×"}・写真 ${lastId ? "あり" : "なし"}・状態 ${status || "-"}・失敗 ${miss}${why ? "(" + why + ")" : ""}<br>${draw}${logs ? "<br>エラー: " + esc(logs) : ""}`;
    return { start, stop, update, info, heading: () => (hdg == null || isNaN(hdg) ? 0 : hdg), on: () => on, showing: () => on && !!el && !el.classList.contains("off"), err: () => err, usage: () => Object.assign(usage(), { capM: CAP_M, capD: CAP_D, over: over() }) };
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
    // Googleの3Dのとき: 近くは、きれいな建物(国のデータ)と道路を立てる。地面の写真と仮の建物は Google のものを使う
    if (ground) ground.position.y = g ? -3 : 0;
    for (const [, m] of photos) m.visible = !g && !!m.material.map;
    if (sim) Xing.sync(sim.along);
    Plateau.setVisible(true);
    Roads.setVisible(true);
    clipU.uClip.value = g ? 660 : 1e9;
    if (!popU.uG3.value) popU.uG3.value = new (T().Vector4)(0, 0, 0, 0);
    if (!g) popU.uG3.value.w = 0;
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
  // 地面の航空写真は、近くで見るとぼやける。細かいざらつき(砂・アスファルトの粒)を重ねて、近くでも面に見えるようにする
  let detailTex = null;
  function groundDetail(mat, tileM) {
    const THREE = T();
    if (!detailTex) {
      const cv = document.createElement("canvas");
      cv.width = cv.height = 256;
      const c = cv.getContext("2d"), im = c.createImageData(256, 256);
      let sd = 7;
      const r = () => ((sd = (sd * 16807) % 2147483647) / 2147483647);
      for (let i = 0; i < 65536; i++) {
        const v = 128 + (r() - 0.5) * 120 + (r() < 0.04 ? 60 : 0) - (r() < 0.05 ? 70 : 0);
        im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = Math.max(0, Math.min(255, v));
        im.data[i * 4 + 3] = 255;
      }
      c.putImageData(im, 0, 0);
      detailTex = new THREE.CanvasTexture(cv);
      detailTex.wrapS = detailTex.wrapT = THREE.RepeatWrapping;
      detailTex.anisotropy = 4;
    }
    const rep = Math.max(8, Math.round(tileM / 2.2)); // 1枚の模様が約2.2m
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uDetail = { value: detailTex };
      sh.uniforms.uDetailRep = { value: rep };
      sh.fragmentShader = "uniform sampler2D uDetail;\nuniform float uDetailRep;\n" + sh.fragmentShader.replace("#include <map_fragment>", `#include <map_fragment>
        #ifdef USE_MAP
          float dA = texture2D(uDetail, vUv * uDetailRep).r, dB = texture2D(uDetail, vUv * uDetailRep * 0.23 + 0.37).r;
          diffuseColor.rgb *= 0.8 + 0.28 * dA + 0.14 * dB;
        #endif`);
    };
    mat.customProgramCacheKey = () => "gdetail" + rep;
    return mat;
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
        return [x, h + Terrain.h0(x, z), z, u, 1 - v];
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
      const mesh = new THREE.Mesh(geo, Xing.holeMat(groundDetail(new THREE.MeshBasicMaterial({ color: 0xa9aec4, polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 6 }), Math.hypot(b[0] - a[0], b[1] - a[1]))));
      mesh.visible = false;
      mesh.userData.g3hide = true;
      photos.set(key, mesh);
      scene.add(mesh);
      savedImg(`https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/${key}.jpg`).then((src) => {
        if (!src || photos.get(key) !== mesh) return savedDone(src);
        const ld = new THREE.TextureLoader();
        ld.setCrossOrigin("anonymous");
        ld.load(
          src,
          (tex) => {
            savedDone(src);
            if (photos.get(key) !== mesh) return tex.dispose();
            tex.encoding = THREE.sRGBEncoding;
            tex.anisotropy = 8;
            mesh.material.map = tex;
            mesh.material.needsUpdate = true;
            mesh.visible = !G3.on();
          },
          undefined,
          () => savedDone(src)
        );
      });
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
      const g = tiles.get(key) === t ? await buildTile(data, t.ix, t.iy) : null;
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
      // この先の立体交差も先に調べる(まだ街を作っていない、4km以上先だけ掘り下げる)
      Xing.learn(await fetchTile(ix, iy), ix, iy, sim.along + 4000);
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
  // ガレージのバイクは、部品1つ1つが別の物体(約130個)で、1コマに部品の数だけ「描く命令」が出る(影や映り込みでも、もう一度)。
  // いっしょに動く部品(同じ部位・同じ回る軸の下)で、材質の中身が同じもの同士を1つの形にまとめる。
  // 頂点の数も見た目も同じで、描く命令の数だけが減る。まとめられない部品(透ける物・写真を貼る物など)はそのまま。
  function mergeBike(bikeG) {
    const THREE = T();
    const moving = (o) => !!(o.userData && (o.userData.spin || o.userData.crank || o.userData.pedal || o.userData.slot));
    // 材質の中身を文字にする(同じ文字なら、同じ見た目)。比べられない物が入っていたら null
    const matSig = (m) => {
      const out = [m.type];
      for (const k of Object.keys(m).sort()) {
        if (k === "uuid" || k === "name" || k === "version") continue;
        const v = m[k];
        if (v == null || typeof v === "number" || typeof v === "string" || typeof v === "boolean") out.push(k + "=" + v);
        else if (v.isColor) out.push(k + "=" + v.r + "," + v.g + "," + v.b);
        else if (v.isTexture) out.push(k + "=t" + v.uuid);
        else if (v.isVector2 || v.isVector3) out.push(k + "=" + v.toArray().join(","));
        else if (Array.isArray(v) && v.every((x) => typeof x === "number")) out.push(k + "=[" + v.join(",") + "]");
        else if (k === "defines" || k === "userData") {
          for (const d of Object.keys(v)) if (typeof v[d] === "object" && v[d] !== null) return null;
          out.push(k + "=" + JSON.stringify(v));
        } else return null;
      }
      return out.join(";");
    };
    bikeG.updateMatrixWorld(true);
    const sets = new Map();
    bikeG.traverse((o) => {
      if (!o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || o.children.length || moving(o) || o.userData.decal) return;
      const m = o.material, g = o.geometry;
      if (!m || Array.isArray(m) || m.transparent || !g || !g.attributes.position || !g.attributes.normal) return;
      if (Object.keys(g.morphAttributes || {}).length || g.drawRange.start !== 0 || g.drawRange.count !== Infinity) return;
      const names = Object.keys(g.attributes).sort();
      for (const n of names) {
        const at = g.attributes[n];
        if (!["position", "normal", "uv", "color"].includes(n) || at.isInterleavedBufferAttribute || at.normalized || !(at.array instanceof Float32Array)) return;
      }
      if (g.index && g.index.count % 3) return;
      // いっしょに動く親(部位か、回る軸)を探す。途中に見えない物があれば、まとめない
      let a = o;
      while (a === o || !(a === bikeG || moving(a))) {
        if (!a.visible || !a.parent) return;
        a = a.parent;
      }
      const sig = matSig(m);
      if (!sig) return;
      const key = [a.uuid, sig, o.castShadow, o.receiveShadow, o.renderOrder, o.layers.mask, o.frustumCulled, names.map((n) => n + g.attributes[n].itemSize).join(",")].join("|");
      if (!sets.has(key)) sets.set(key, { anchor: a, names, list: [] });
      sets.get(key).list.push(o);
    });
    // まず全部の形を作ってから、最後に入れ替える(途中で失敗しても、もとのバイクのまま)
    const jobs = [];
    const inv = new THREE.Matrix4(), rel = new THREE.Matrix4(), nm = new THREE.Matrix3(), v = new THREE.Vector3();
    for (const { anchor, names, list } of sets.values()) {
      if (list.length < 2) continue;
      inv.copy(anchor.matrixWorld).invert();
      let nv = 0, ni = 0;
      for (const o of list) (nv += o.geometry.attributes.position.count), (ni += o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count);
      const arr = {};
      for (const n of names) arr[n] = new Float32Array(nv * list[0].geometry.attributes[n].itemSize);
      const idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
      let v0 = 0, i0 = 0;
      for (const o of list) {
        const g = o.geometry, cnt = g.attributes.position.count;
        rel.multiplyMatrices(inv, o.matrixWorld);
        nm.getNormalMatrix(rel);
        const flip = rel.determinant() < 0; // 鏡うつしの部品は、面の表裏を入れ替える
        for (const n of names) {
          const at = g.attributes[n], sz = at.itemSize;
          arr[n].set(at.array.subarray(0, cnt * sz), v0 * sz);
        }
        for (let i = v0; i < v0 + cnt; i++) {
          v.fromArray(arr.position, i * 3).applyMatrix4(rel).toArray(arr.position, i * 3);
          v.fromArray(arr.normal, i * 3).applyMatrix3(nm).normalize().toArray(arr.normal, i * 3);
        }
        const ix = g.index ? g.index.array : null, n3 = ix ? g.index.count : cnt;
        for (let i = 0; i < n3; i += 3) {
          const p = ix ? ix[i] : i, q = ix ? ix[i + 1] : i + 1, r = ix ? ix[i + 2] : i + 2;
          idx[i0++] = v0 + p;
          idx[i0++] = v0 + (flip ? r : q);
          idx[i0++] = v0 + (flip ? q : r);
        }
        v0 += cnt;
      }
      const geo = new THREE.BufferGeometry();
      for (const n of names) geo.setAttribute(n, new THREE.BufferAttribute(arr[n], list[0].geometry.attributes[n].itemSize));
      geo.setIndex(new THREE.BufferAttribute(idx, 1));
      const f = list[0], mesh = new THREE.Mesh(geo, f.material);
      mesh.castShadow = f.castShadow;
      mesh.receiveShadow = f.receiveShadow;
      mesh.renderOrder = f.renderOrder;
      mesh.layers.mask = f.layers.mask;
      mesh.frustumCulled = f.frustumCulled;
      jobs.push({ anchor, list, mesh });
    }
    let cut = 0;
    for (const { anchor, list, mesh } of jobs) {
      for (const o of list) o.parent.remove(o);
      anchor.add(mesh);
      cut += list.length - 1;
    }
    return cut;
  }
  function garageBikers(meFallback, rivalFallback) {
    const THREE = T();
    let root = null, spriteOn = false;
    try {
      const G = typeof Store !== "undefined" && Store.garage;
      if (typeof View3D === "undefined" || typeof Fit === "undefined" || !G || !G.builds) return null;
      const b = G.builds[G.active] || G.builds.current;
      if (!b || !b.geo || !G.body) return null;
      const tire = (b.parts.tires && b.parts.tires.attrs && b.parts.tires.attrs.width) || 28;
      // ガレージの保存データを書き換えないよう、複製して使う
      const bc = JSON.parse(JSON.stringify(b));
      // 写真から作ったバイクで走るときは、乗り手の姿勢をそのバイクの形に合わせる。
      // (絵のバイクは、ガレージのバイクとサドル・ブラケットの位置が違う。そのままだと手が届かず、サドルから浮く)
      try {
        // 写真のバイク(1枚の絵)は使わない。絵は決まった角度からの見た目しか持たないので、見る向きによって
        // 体の向きとずれ、手がハンドルから外れ、サドルから浮いて見える。体に合わせて作る3Dのバイク(黒いTCRの形)だけにした
        spriteOn = false;
      } catch (e) {}
      if (spriteOn) {
        // 絵(横向きのコマ)の中で測った位置。BB を原点に、前が+x・上が+y。単位は「車輪の半径=150」のときの長さ
        const K = (0.311 + tire / 1000) / 150;
        const P = { saddle: [-93.4, 325], hood: [280.3, 298.2], rear: [-182.8, 40.6] };
        const sd = P.saddle, rr = P.rear;
        bc.geo = Object.assign({}, bc.geo, { seatAngle: (Math.atan2(sd[1], -sd[0]) * 180) / Math.PI, chainstay: Math.hypot(rr[0], rr[1]) * K, bbDrop: rr[1] * K });
        bc.pos = Object.assign({}, bc.pos, { saddleHeight: Math.hypot(sd[0], sd[1]) * K, saddleSetback: 0, reachAdj: 0, dropAdj: 0 });
        const h0 = Fit.bike(bc.geo, bc.pos, { radius: 0.311 + tire / 1000 }).grips.hoods.pt;
        bc.pos.reachAdj = P.hood[0] * K - h0.x;
        bc.pos.dropAdj = -(P.hood[1] * K - h0.y);
      }
      const fit = Fit.compute({ geo: bc.geo, pos: bc.pos, aero: Parts.aeroOf(b.parts), wheelRadius: 0.311 + tire / 1000 }, G.body);
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
      const on = spriteOn;
      bikeG = View3D.bikeObj && View3D.bikeObj();
      // バイクの部品をまとめて、描く命令を減らす(失敗しても、もとのまま走れる)
      try {
        if (bikeG && !on) Perf.merged = mergeBike(bikeG);
      } catch (e) {
        console.error(e);
      }
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
        // 絵の中の BB(中心から 40.6 後ろ・94.7 下)を、3Dの BB(原点)に重ねる
        mesh.position.set(40.6 * m, 94.7 * m, ctr.z);
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
    // 大きさ: レベルが高いほど大きい(Lv4で約1.2m・Lv8で約1.9m・Lv10で約2.2m)。エースはさらに一回り大きく
    const size = (m) => (0.6 + 0.16 * Math.max(1, Math.min(12, m.lv || 4))) * (m.ace ? 1.15 : 1);
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
    // ---- モンスターの3Dの姿(ガレージで3Dモデルを登録していないカード用) ----
    // 種族ごとの形を、丸みのある管・回転体・羽・膜・布から細かく組み立てる。模様は自作の画像。
    // 高さ1ほど・足もとが原点・前が +x。userData.tick(t) で翼・首・尾・布が動く
    const ATTR_COL = { 風: [0x1f9e7a, 0x7dffd0], 炎: [0xb5341c, 0xffa040], 水: [0x1d5fb4, 0x70d0ff], 地: [0x7a5a2c, 0xf0d070], 光: [0xd8c070, 0xfff6c0], 闇: [0x3a2360, 0xc070ff] };
    const ICON_KIND = { "🐉": "dragon", "🐲": "dragon", "🐍": "serpent", "🦅": "bird", "🦉": "bird", "🐦": "bird", "🐧": "bird", "🦢": "bird", "🔥": "bird", "🐺": "beast", "🐯": "beast", "🦁": "beast", "🐻": "beast", "🦊": "beast", "🐇": "beast", "🐎": "beast", "🐃": "beast", "🐆": "beast", "🐗": "beast", "🦌": "beast", "🐕": "beast", "🐢": "beast", "⚙️": "machine", "🤖": "machine", "🛸": "machine", "🌀": "machine", "🏎️": "machine", "🚀": "machine", "🎵": "mage", "🎼": "mage", "🧙": "mage", "🔮": "mage", "🛡️": "knight", "⚔️": "knight", "🗡️": "knight", "🏃": "knight", "🗿": "golem", "💀": "spirit", "👻": "spirit", "🌑": "spirit", "💫": "spirit", "😈": "spirit", "👼": "spirit" };
    const RACE_KIND = { 戦士: "knight", 獣: "beast", 鳥獣: "bird", ドラゴン: "dragon", 機械: "machine", 魔法使い: "mage", 魚: "serpent", 水: "serpent", 昆虫: "insect", 岩石: "golem", 植物: "mage", アンデット: "spirit", 悪魔: "spirit", 天使: "spirit", 雷: "crystal", シンクロ: "dragon" };
    // 形と模様は種類ごとに1回だけ作って、同じ種類のモンスターで使い回す
    const GEO = new Map(), TEXC = new Map();
    const G = (key, f) => {
      let g = GEO.get(key);
      if (!g) GEO.set(key, (g = f()));
      return g;
    };
    // 模様の画像(白黒。色は材質の色を掛ける)
    const tile9 = (f) => {
      for (const dx of [-256, 0, 256]) for (const dy of [-256, 0, 256]) f(dx, dy);
    };
    const cracks = (r) => {
      const out = [];
      for (let i = 0; i < 13; i++) {
        let x = r() * 256, y = r() * 256, a = r() * 6.28;
        const p = [[x, y]];
        for (let k = 0; k < 9; k++) ((a += (r() - 0.5) * 1.5), (x += Math.cos(a) * 15), (y += Math.sin(a) * 15), p.push([x, y]));
        out.push(p);
      }
      return out;
    };
    const glyph = (c, r, x, y, s) => {
      c.beginPath();
      for (let k = 0; k < 4; k++) {
        const ax = x + (Math.floor(r() * 3) - 1) * s, ay = y + (Math.floor(r() * 4) - 1.5) * s * 0.7, bx = x + (Math.floor(r() * 3) - 1) * s, by = y + (Math.floor(r() * 4) - 1.5) * s * 0.7;
        c.moveTo(ax, ay);
        r() < 0.3 ? c.arc(ax, ay, s * 0.45, 0, 3.6) : c.lineTo(bx, by);
      }
      c.stroke();
    };
    const PAINT = {
      scale(c) {
        c.fillStyle = "#444";
        c.fillRect(0, 0, 256, 256);
        for (let row = 9; row >= -1; row--)
          for (let col = -1; col < 9; col++) {
            const x = col * 32 + (row & 1 ? 16 : 0), y = row * 32;
            const g = c.createRadialGradient(x, y - 9, 2, x, y, 22);
            g.addColorStop(0, "#fff");
            g.addColorStop(0.65, "#b8b8b8");
            g.addColorStop(0.9, "#707070");
            g.addColorStop(1, "#101010");
            c.fillStyle = g;
            c.beginPath();
            c.arc(x, y, 22, 0, 7);
            c.fill();
          }
      },
      fur(c, r) {
        c.fillStyle = "#909090";
        c.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 1100; i++) {
          const x = r() * 256, y = r() * 256, l = 14 + r() * 30, v = (80 + r() * 170) | 0, b1 = (r() - 0.5) * 6, b2 = (r() - 0.5) * 9;
          c.strokeStyle = `rgb(${v},${v},${v})`;
          c.lineWidth = 1 + r() * 1.6;
          for (const dy of [0, -256]) (c.beginPath(), c.moveTo(x, y + dy), c.quadraticCurveTo(x + b1, y + dy + l / 2, x + b2, y + dy + l), c.stroke());
        }
      },
      feather(c) {
        let g = c.createLinearGradient(0, 256, 0, 0);
        g.addColorStop(0, "#cfcfcf");
        g.addColorStop(0.55, "#f6f6f6");
        g.addColorStop(0.8, "#9c9c9c");
        g.addColorStop(1, "#303030");
        c.fillStyle = g;
        c.fillRect(0, 0, 256, 256);
        c.strokeStyle = "rgba(20,20,20,0.33)";
        c.lineWidth = 1.3;
        for (let y = -60; y < 320; y += 7) (c.beginPath(), c.moveTo(0, y), c.lineTo(128, y + 44), c.lineTo(256, y), c.stroke());
        c.strokeStyle = "#fff";
        c.lineWidth = 8;
        (c.beginPath(), c.moveTo(128, 256), c.lineTo(128, 0), c.stroke());
        c.strokeStyle = "rgba(0,0,0,0.45)";
        c.lineWidth = 1.5;
        for (const x of [122, 134]) (c.beginPath(), c.moveTo(x, 256), c.lineTo(x, 0), c.stroke());
        g = c.createLinearGradient(0, 0, 256, 0);
        g.addColorStop(0, "rgba(0,0,0,0.5)");
        g.addColorStop(0.2, "rgba(0,0,0,0)");
        g.addColorStop(0.8, "rgba(0,0,0,0)");
        g.addColorStop(1, "rgba(0,0,0,0.5)");
        c.fillStyle = g;
        c.fillRect(0, 0, 256, 256);
      },
      // 翼の膜: 下(手首)から上(ふち)へ血管が枝分かれする
      membrane(c, r) {
        let g = c.createLinearGradient(0, 256, 0, 0);
        g.addColorStop(0, "#f0f0f0");
        g.addColorStop(0.7, "#b0b0b0");
        g.addColorStop(1, "#4a4a4a");
        c.fillStyle = g;
        c.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 70; i++) {
          const x = r() * 256, y = r() * 256, s = 8 + r() * 22;
          g = c.createRadialGradient(x, y, 0, x, y, s);
          g.addColorStop(0, `rgba(${r() < 0.5 ? "0,0,0" : "255,255,255"},0.13)`);
          g.addColorStop(1, "rgba(0,0,0,0)");
          c.fillStyle = g;
          c.fillRect(x - s, y - s, s * 2, s * 2);
        }
        c.strokeStyle = "rgba(15,15,15,0.5)";
        const vein = (x, y, a, w, d) => {
          for (let k = 0; k < 7 && y > -5; k++) {
            const nx = x + Math.sin(a) * 15, ny = y - Math.cos(a) * 15;
            c.lineWidth = w;
            (c.beginPath(), c.moveTo(x, y), c.lineTo(nx, ny), c.stroke());
            ((x = nx), (y = ny), (a += (r() - 0.5) * 0.5), (w *= 0.9));
            if (d < 2 && r() < 0.4) vein(x, y, a + (r() < 0.5 ? 0.7 : -0.7), w * 0.7, d + 1);
          }
        };
        for (let i = 0; i < 12; i++) vein(8 + i * 21 + r() * 8, 256, (r() - 0.5) * 0.3, 2.6, 0);
        vein(128, 150, 0, 2, 0);
      },
      plate(c, r) {
        c.fillStyle = "#c6c6c6";
        c.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 500; i++) {
          const v = r() < 0.5 ? 0 : 255;
          c.fillStyle = `rgba(${v},${v},${v},0.07)`;
          c.fillRect(r() * 256, r() * 256, 20 + r() * 80, 1);
        }
        const P = [[6, 6, 116, 116], [134, 6, 116, 76], [134, 94, 116, 156], [6, 134, 116, 116]];
        for (const [x, y, w, h] of P) {
          c.strokeStyle = "#1c1c1c";
          c.lineWidth = 4;
          c.strokeRect(x, y, w, h);
          c.strokeStyle = "rgba(255,255,255,0.8)";
          c.lineWidth = 1.2;
          c.strokeRect(x + 3.5, y + 3.5, w - 7, h - 7);
          for (const [rx, ry] of [[x + 12, y + 12], [x + w - 12, y + 12], [x + 12, y + h - 12], [x + w - 12, y + h - 12]]) ((c.fillStyle = "#222"), c.beginPath(), c.arc(rx, ry, 4, 0, 7), c.fill(), (c.fillStyle = "#eee"), c.beginPath(), c.arc(rx - 1, ry - 1, 1.6, 0, 7), c.fill());
        }
      },
      // 鎧・機械の光る線
      plateE(c) {
        c.fillStyle = "#000";
        c.fillRect(0, 0, 256, 256);
        c.strokeStyle = "#fff";
        c.shadowColor = "#fff";
        c.shadowBlur = 7;
        c.lineWidth = 3.5;
        c.lineCap = "round";
        const L = (...p) => {
          c.beginPath();
          c.moveTo(p[0], p[1]);
          for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]);
          c.stroke();
        };
        L(24, 64, 60, 64, 76, 48, 104, 48);
        L(24, 84, 70, 84);
        for (let k = 0; k < 3; k++) L(152, 130 + k * 34, 192, 160 + k * 34, 232, 130 + k * 34);
        (c.beginPath(), c.arc(64, 192, 30, 0.4, 5.6), c.stroke());
        (c.beginPath(), c.arc(64, 192, 10, 0, 7), c.stroke());
        for (let k = 0; k < 4; k++) L(152 + k * 22, 30, 164 + k * 22, 30);
        L(152, 56, 232, 56);
      },
      rock(c, r) {
        const cr = cracks(r);
        c.fillStyle = "#9a9a9a";
        c.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 300; i++) {
          const x = r() * 256, y = r() * 256, s = 6 + r() * 26, v = r() < 0.5 ? "0,0,0" : "255,255,255";
          tile9((dx, dy) => {
            const g = c.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, s);
            g.addColorStop(0, `rgba(${v},0.16)`);
            g.addColorStop(1, `rgba(${v},0)`);
            c.fillStyle = g;
            c.fillRect(x + dx - s, y + dy - s, s * 2, s * 2);
          });
        }
        for (let i = 0; i < 1800; i++) ((c.fillStyle = `rgba(0,0,0,${r() * 0.35})`), c.fillRect(r() * 256, r() * 256, 1.5, 1.5));
        c.lineJoin = "round";
        for (const [w, col] of [[7, "rgba(0,0,0,0.35)"], [3.5, "#0c0c0c"]])
          for (const p of cr)
            tile9((dx, dy) => {
              c.strokeStyle = col;
              c.lineWidth = w;
              c.beginPath();
              p.forEach((q, i) => (i ? c.lineTo(q[0] + dx, q[1] + dy) : c.moveTo(q[0] + dx, q[1] + dy)));
              c.stroke();
            });
      },
      // 岩のひびの中の光
      rockE(c, r) {
        const cr = cracks(r);
        c.fillStyle = "#000";
        c.fillRect(0, 0, 256, 256);
        c.strokeStyle = "#fff";
        c.shadowColor = "#fff";
        c.shadowBlur = 5;
        c.lineWidth = 2.2;
        c.lineJoin = "round";
        for (const p of cr)
          tile9((dx, dy) => {
            c.beginPath();
            p.forEach((q, i) => (i ? c.lineTo(q[0] + dx, q[1] + dy) : c.moveTo(q[0] + dx, q[1] + dy)));
            c.stroke();
          });
      },
      cloth(c, r) {
        c.fillStyle = "#b6b6b6";
        c.fillRect(0, 0, 256, 256);
        for (let y = 0; y < 256; y += 4) ((c.fillStyle = "rgba(0,0,0,0.13)"), c.fillRect(0, y, 256, 1.5));
        for (let x = 0; x < 256; x += 4) ((c.fillStyle = "rgba(255,255,255,0.1)"), c.fillRect(x, 0, 1.5, 256));
        for (let i = 0; i < 400; i++) ((c.fillStyle = `rgba(0,0,0,${r() * 0.12})`), c.fillRect(r() * 256, r() * 256, 2 + r() * 10, 2));
        // すその飾り帯
        c.fillStyle = "#f4f4f4";
        c.fillRect(0, 214, 256, 30);
        c.fillStyle = "#333";
        c.fillRect(0, 212, 256, 3);
        c.fillRect(0, 243, 256, 3);
        for (let x = 16; x < 256; x += 32) (c.beginPath(), c.moveTo(x, 219), c.lineTo(x + 9, 229), c.lineTo(x, 239), c.lineTo(x - 9, 229), c.fill());
      },
      clothE(c, r) {
        c.fillStyle = "#000";
        c.fillRect(0, 0, 256, 256);
        c.strokeStyle = "#fff";
        c.shadowColor = "#fff";
        c.shadowBlur = 5;
        c.lineWidth = 3;
        for (let k = 0; k < 6; k++) glyph(c, r, 22 + k * 42.6, 170, 11);
        c.lineWidth = 2;
        for (const y of [140, 200]) (c.beginPath(), c.moveTo(0, y), c.lineTo(256, y), c.stroke());
      },
      // 魔法陣の帯(横に1周ぶん)
      rune(c, r) {
        c.fillStyle = "#000";
        c.fillRect(0, 0, 256, 256);
        c.strokeStyle = "#fff";
        c.shadowColor = "#fff";
        c.shadowBlur = 8;
        c.lineWidth = 9;
        c.lineCap = "round";
        for (let k = 0; k < 5; k++) glyph(c, r, 26 + k * 51.2, 128, 30);
        c.lineWidth = 10;
        for (const y of [22, 234]) (c.beginPath(), c.moveTo(0, y), c.lineTo(256, y), c.stroke());
        for (let k = 0; k < 5; k++) (c.beginPath(), c.arc(k * 51.2, 128, 5, 0, 7), c.stroke());
      },
      chitin(c, r) {
        c.fillStyle = "#b0b0b0";
        c.fillRect(0, 0, 256, 256);
        for (let x = 0; x < 256; x += 16) {
          const g = c.createLinearGradient(x, 0, x + 16, 0);
          g.addColorStop(0, "rgba(0,0,0,0.3)");
          g.addColorStop(0.5, "rgba(255,255,255,0.25)");
          g.addColorStop(1, "rgba(0,0,0,0.3)");
          c.fillStyle = g;
          c.fillRect(x, 0, 16, 256);
        }
        for (let i = 0; i < 700; i++) ((c.fillStyle = `rgba(0,0,0,${0.1 + r() * 0.3})`), c.beginPath(), c.arc(r() * 256, r() * 256, 0.8 + r() * 1.6, 0, 7), c.fill());
        for (let y = 0; y < 256; y += 64) ((c.fillStyle = "rgba(0,0,0,0.35)"), c.fillRect(0, y, 256, 3));
      },
      // 虫の羽(白いところほど濃い)
      wingI(c, r) {
        c.fillStyle = "#3a3a3a";
        c.fillRect(0, 0, 256, 256);
        c.strokeStyle = "#fff";
        c.lineWidth = 3;
        for (let k = 0; k < 6; k++) (c.beginPath(), c.moveTo(20 + k * 8, 256), c.bezierCurveTo(10 + k * 30, 180, 20 + k * 44, 90, 60 + k * 30, 0), c.stroke());
        c.lineWidth = 1.6;
        for (let i = 0; i < 60; i++) {
          const x = r() * 256, y = r() * 256;
          (c.beginPath(), c.moveTo(x, y), c.lineTo(x + 20 + r() * 26, y + (r() - 0.5) * 24), c.stroke());
        }
        const g = c.createLinearGradient(0, 60, 0, 0);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(1, "rgba(255,255,255,0.7)");
        c.fillStyle = g;
        c.fillRect(0, 0, 256, 60);
      },
    };
    function tex(kind, rx = 1, ry = 1) {
      const key = kind + "|" + rx + "|" + ry;
      if (TEXC.has(key)) return TEXC.get(key);
      const THREE = T();
      let base = TEXC.get(kind);
      if (!base) {
        const cv = document.createElement("canvas");
        cv.width = cv.height = 256;
        let sd = 11;
        const r = () => (sd = (Math.imul(sd, 1103515245) + 12345) >>> 0) / 4294967296;
        PAINT[kind](cv.getContext("2d"), r);
        base = new THREE.CanvasTexture(cv);
        base.wrapS = base.wrapT = THREE.RepeatWrapping;
        base.encoding = THREE.sRGBEncoding;
        base.anisotropy = 4;
        TEXC.set(kind, base);
      }
      const t = base.clone();
      t.repeat.set(rx, ry);
      t.needsUpdate = true;
      TEXC.set(key, t);
      return t;
    }
    // ぼんやりした光の玉(目・核のまわり)
    function glowTex() {
      if (TEXC.has("glow")) return TEXC.get("glow");
      const cv = document.createElement("canvas");
      cv.width = cv.height = 128;
      const c = cv.getContext("2d"), g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.25, "rgba(255,255,255,0.45)");
      g.addColorStop(0.6, "rgba(255,255,255,0.1)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = g;
      c.fillRect(0, 0, 128, 128);
      const t = new (T().CanvasTexture)(cv);
      TEXC.set("glow", t);
      return t;
    }
    const geoOf = (pos, nor, uv, idx) => {
      const THREE = T(), g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      if (nor) g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
      g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      if (!nor) g.computeVertexNormals();
      return g;
    };
    // 管: 中心線(点の列)にそって、太さを変えながら丸い断面を並べる。胴・首・腕・角に使う
    function sweep(P, R, o = {}) {
      const THREE = T(), nv = o.nv || 16, nu = o.nu || Math.max(10, (P.length - 1) * 7), ey = o.ey || 1, ez = o.ez || 1;
      const cur = new THREE.CatmullRomCurve3(P.map((p) => new THREE.Vector3(p[0], p[1], p[2] || 0)), false, "centripetal");
      const rc = typeof R === "function" ? null : new THREE.CatmullRomCurve3(R.map((r, i) => new THREE.Vector3(r, i, 0)), false, "centripetal");
      const rad = (u) => Math.max(0.0004, (rc ? rc.getPoint(u).x : R(u)) * (o.rf ? o.rf(u) : 1));
      const pos = [], nor = [], uv = [], idx = [];
      const C = new THREE.Vector3(), Tn = new THREE.Vector3(), N = new THREE.Vector3(), B = new THREE.Vector3(), a1 = new THREE.Vector3(), a2 = new THREE.Vector3(), n = new THREE.Vector3();
      const Z = new THREE.Vector3(0, 0, 1), Y = new THREE.Vector3(0, 1, 0);
      for (let i = 0; i <= nu; i++) {
        const u = i / nu, e = 0.5 / nu, u1 = Math.min(1, u + e), u0 = Math.max(0, u - e);
        cur.getPoint(u, C);
        cur.getTangent(u, Tn);
        N.crossVectors(Math.abs(Tn.z) < 0.95 ? Z : Y, Tn).normalize();
        B.crossVectors(Tn, N);
        const r = rad(u), dr = (rad(u1) - rad(u0)) / Math.max(1e-5, cur.getPoint(u1, a1).distanceTo(cur.getPoint(u0, a2)));
        for (let j = 0; j <= nv; j++) {
          const a = (j / nv) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
          pos.push(C.x + r * (ca * ey * N.x + sa * ez * B.x), C.y + r * (ca * ey * N.y + sa * ez * B.y), C.z + r * (ca * ey * N.z + sa * ez * B.z));
          n.set(0, 0, 0).addScaledVector(N, ca / ey).addScaledVector(B, sa / ez).normalize().addScaledVector(Tn, -Math.max(-3, Math.min(3, dr))).normalize();
          nor.push(n.x, n.y, n.z);
          uv.push(j / nv, u);
        }
      }
      for (let i = 0; i < nu; i++)
        for (let j = 0; j < nv; j++) {
          const a = i * (nv + 1) + j, b = a + nv + 1;
          idx.push(a, a + 1, b, b, a + 1, b + 1);
        }
      return geoOf(pos, nor, uv, idx);
    }
    // いくつもの形を1つにまとめる(歯・とげ・羽などの細かい部品を1回で描くため)
    function merge(parts) {
      const THREE = T(), pos = [], nor = [], uv = [], idx = [], v = new THREE.Vector3(), nm = new THREE.Matrix3();
      let base = 0;
      for (const [g, m] of parts) {
        const p = g.attributes.position, n = g.attributes.normal, t = g.attributes.uv, flip = m.determinant() < 0;
        nm.getNormalMatrix(m);
        for (let i = 0; i < p.count; i++) {
          v.fromBufferAttribute(p, i).applyMatrix4(m);
          pos.push(v.x, v.y, v.z);
          v.fromBufferAttribute(n, i).applyMatrix3(nm).normalize();
          nor.push(v.x, v.y, v.z);
          uv.push(t ? t.getX(i) : 0, t ? t.getY(i) : 0);
        }
        const ix = g.index ? g.index.array : null, cnt = ix ? ix.length : p.count;
        for (let k = 0; k < cnt; k += 3) {
          const a = base + (ix ? ix[k] : k), b = base + (ix ? ix[k + 1] : k + 1), c = base + (ix ? ix[k + 2] : k + 2);
          flip ? idx.push(a, c, b) : idx.push(a, b, c);
        }
        base += p.count;
      }
      return geoOf(pos, nor, uv, idx);
    }
    // 膜: 付け根 W から、となり合う骨の先どうしの間に張る。ふちは内へえぐれ、中ほどはふくらむ
    function membrane(W, tips, sag, billow) {
      const ns = 8, nt = 8, pos = [], uv = [], idx = [], n = tips.length - 1;
      for (let f = 0; f < n; f++) {
        const A = tips[f], B = tips[f + 1], b0 = pos.length / 3, sg = Array.isArray(sag) ? sag[f] : sag;
        for (let i = 0; i <= ns; i++)
          for (let j = 0; j <= nt; j++) {
            const s = i / ns, t = j / nt, e = s * (1 - sg * Math.sin(Math.PI * t) * s), bl = billow * Math.sin(Math.PI * t) * Math.sin(Math.PI * Math.min(1, s * 1.15));
            pos.push(W[0] + ((A[0] - W[0]) * (1 - t) + (B[0] - W[0]) * t) * e, W[1] + ((A[1] - W[1]) * (1 - t) + (B[1] - W[1]) * t) * e + bl, W[2] + ((A[2] - W[2]) * (1 - t) + (B[2] - W[2]) * t) * e);
            uv.push((f + t) / n, s);
          }
        for (let i = 0; i < ns; i++)
          for (let j = 0; j < nt; j++) {
            const a = b0 + i * (nt + 1) + j, b = a + nt + 1;
            idx.push(a, b, a + 1, a + 1, b, b + 1);
          }
      }
      return geoOf(pos, null, uv, idx);
    }
    // 布(マント・すそ・リボン): 格子の点を式で動かす。closed は筒(横が1周つながる)
    function sheet(nu, nv, fn, closed) {
      const pos = new Array((nu + 1) * (nv + 1) * 3).fill(0), uv = [], idx = [], o = [0, 0, 0];
      for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) uv.push(i / nu, 1 - j / nv);
      for (let j = 0; j < nv; j++)
        for (let i = 0; i < nu; i++) {
          const a = j * (nu + 1) + i, b = a + nu + 1;
          idx.push(a, b, a + 1, a + 1, b, b + 1);
        }
      const g = geoOf(pos, null, uv, idx), p = g.attributes.position, nr = g.attributes.normal;
      const upd = (t) => {
        for (let j = 0; j <= nv; j++)
          for (let i = 0; i <= nu; i++) {
            fn(i / nu, j / nv, t, o);
            p.setXYZ(j * (nu + 1) + i, o[0], o[1], o[2]);
          }
        p.needsUpdate = true;
        g.computeVertexNormals();
        if (closed)
          for (let j = 0; j <= nv; j++) {
            const a = j * (nu + 1), b = a + nu, x = nr.getX(a) + nr.getX(b), y = nr.getY(a) + nr.getY(b), z = nr.getZ(a) + nr.getZ(b), l = Math.hypot(x, y, z) || 1;
            nr.setXYZ(a, x / l, y / l, z / l);
            nr.setXYZ(b, x / l, y / l, z / l);
          }
      };
      upd(0);
      return { g, upd };
    }
    function proc(m, side) {
      const THREE = T();
      const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
      let hsh = 7;
      for (const ch of String(m.name)) hsh = (Math.imul(hsh, 31) + ch.codePointAt(0)) >>> 0;
      const rnd = (n) => hash(hsh + n * 97);
      // 種族: カードの種族(「機械族/シンクロ」なら機械)を先に見る。わからないシンクロ・エースは竜
      const cardRace = typeof MonsterArt !== "undefined" && MonsterArt.CARD && MonsterArt.CARD[m.name] ? String(MonsterArt.CARD[m.name].type || "").split("族")[0] : "";
      const kind = RACE_KIND[m.race] || RACE_KIND[cardRace] || (m.ace || m.synchro ? "dragon" : null) || ICON_KIND[m.icon] || ["knight", "beast", "dragon", "bird", "machine", "mage", "spirit"][hsh % 7];
      const pal = ATTR_COL[m.attr] || (side === "opp" ? ATTR_COL.闇 : [[0x1f9e7a, 0x7dffd0], [0x1d5fb4, 0x70d0ff], [0xb5341c, 0xffa040], [0xd8c070, 0xfff6c0]][hsh % 4]);
      // 色は画面用の値なので、光の計算用に直す(直さないと白っぽくなる)
      const lin = (h) => new THREE.Color(h).convertSRGBToLinear();
      const base = new THREE.Color(pal[0]).offsetHSL((rnd(1) - 0.5) * 0.06, 0.1, (rnd(2) - 0.5) * 0.06).convertSRGBToLinear();
      const glow = new THREE.Color(pal[1]).offsetHSL(0, 0.2, -0.12).convertSRGBToLinear();
      const gold = m.ace || m.synchro, dark = m.attr === "闇" || (!ATTR_COL[m.attr] && side === "opp");
      const metal = kind === "knight" || kind === "machine";
      // ---- 材質 ----
      const PM = (o) => new THREE.MeshPhysicalMaterial(Object.assign({ envMapIntensity: 0.9 }, o));
      const skinKind = { dragon: "scale", serpent: "scale", bird: "fur", beast: "fur", insect: "chitin", knight: "plate", machine: "plate", golem: "rock", mage: "cloth", spirit: "cloth", crystal: "plate" }[kind];
      const sk = tex(skinKind, kind === "dragon" || kind === "serpent" ? 6 : 3, kind === "dragon" || kind === "serpent" ? 5 : 3);
      const bright = base.clone().multiplyScalar(1.5);
      const M1 = PM({ color: bright, map: sk, bumpMap: sk, bumpScale: metal ? 0.004 : 0.008, metalness: metal ? 0.9 : 0.3, roughness: metal ? 0.3 : 0.45, clearcoat: 0.7, clearcoatRoughness: 0.25 }); // 体
      const pt = tex("plate", 2, 2);
      const M2 = PM({ color: gold ? lin(0xe0a938) : base.clone().multiplyScalar(0.3).addScalar(0.02), map: pt, bumpMap: pt, bumpScale: 0.004, metalness: 0.95, roughness: gold ? 0.24 : 0.34, clearcoat: 0.5, clearcoatRoughness: 0.2 }); // 鎧・金具
      const M3 = PM({ color: lin(dark ? 0x3a3340 : 0xefe4cc), metalness: 0.05, roughness: 0.3, clearcoat: 0.9, clearcoatRoughness: 0.15 }); // 角・爪・歯
      const sk2 = tex(skinKind, 2, 8);
      const M4 = PM({ color: base.clone().lerp(lin(0xf4e8c8), 0.55), map: sk2, bumpMap: sk2, bumpScale: 0.006, metalness: 0.15, roughness: 0.5, clearcoat: 0.4 }); // 腹
      const GL = new THREE.MeshBasicMaterial({ color: glow.clone().multiplyScalar(1.7) }); // 光る部品
      const BK = new THREE.MeshStandardMaterial({ color: 0x06060a, roughness: 0.6, metalness: 0.2 });
      const GE = PM({ color: base.clone().multiplyScalar(0.35), map: pt, emissive: glow, emissiveIntensity: 2.2, emissiveMap: tex("plateE", 2, 2), metalness: 0.85, roughness: 0.32, clearcoat: 0.5 }); // 光る線の入った鎧
      const mt = tex("membrane");
      const WG = PM({ color: base.clone().multiplyScalar(1.1).lerp(glow, 0.25), map: mt, bumpMap: mt, bumpScale: 0.006, side: THREE.DoubleSide, metalness: 0.1, roughness: 0.5, clearcoat: 0.3, emissive: glow, emissiveIntensity: 0.22, emissiveMap: mt }); // 膜
      const ft = tex("feather");
      const FT = PM({ color: base.clone().lerp(lin(0xffffff), 0.45), map: ft, bumpMap: ft, bumpScale: 0.004, side: THREE.DoubleSide, metalness: 0.1, roughness: 0.5, sheen: 0.6 }); // 風切り羽
      const FT2 = PM({ color: base.clone().multiplyScalar(0.9).lerp(glow, 0.2), map: ft, bumpMap: ft, bumpScale: 0.004, side: THREE.DoubleSide, metalness: 0.15, roughness: 0.5, emissive: glow, emissiveIntensity: 0.12 }); // 雨おおい羽
      const RN = new THREE.MeshBasicMaterial({ color: glow.clone().multiplyScalar(1.4), map: tex("rune", 3, 1), transparent: true, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }); // 魔法陣
      const halos = {};
      const root = new THREE.Group(), anim = [];
      // 飛び方の状態: t=時刻 ph=羽ばたきの位相 amp=羽ばたきの強さ climb=上昇(+)下降(-) turn=旋回 fold=翼のたたみ
      const S = { t: 0, ph: 0.9, amp: 0.8, climb: 0, turn: 0, fold: 0, w: 3, lift: 0.03 };
      // ---- 部品を置く道具 ----
      const add = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx, parent = root) => {
        const o = new THREE.Mesh(geo, mat);
        o.position.set(x, y, z);
        o.rotation.set(rx, ry, rz);
        o.scale.set(sx, sy, sz);
        o.castShadow = true;
        parent.add(o);
        return o;
      };
      const grp = (par, x = 0, y = 0, z = 0) => {
        const g = new THREE.Group();
        g.position.set(x, y, z);
        par.add(g);
        return g;
      };
      // 向き d(形の +x)と、上 u(形の +y)で置く
      const bas = (p, d, u, sx = 1, sy = sx, sz = sx) => {
        const X = V(d[0], d[1], d[2]).normalize(), Z = V().crossVectors(X, V(u[0], u[1], u[2]));
        if (Z.lengthSq() < 1e-8) Z.crossVectors(X, Math.abs(X.y) < 0.9 ? V(0, 1, 0) : V(1, 0, 0));
        Z.normalize();
        const Y = V().crossVectors(Z, X);
        return new THREE.Matrix4().makeBasis(X.multiplyScalar(sx), Y.multiplyScalar(sy), Z.multiplyScalar(sz)).setPosition(p[0], p[1], p[2]);
      };
      const put = (geo, mat, p, d, u, sx = 1, sy = sx, sz = sx, parent = root) => {
        const o = new THREE.Mesh(geo, mat);
        bas(p, d, u, sx, sy, sz).decompose(o.position, o.quaternion, o.scale);
        parent.add(o);
        return o;
      };
      const gput = (par, p, d, u, s = 1) => {
        const g = new THREE.Group();
        bas(p, d, u, s).decompose(g.position, g.quaternion, g.scale);
        par.add(g);
        return g;
      };
      const mirror = (par, f) => {
        for (const sg of [1, -1]) {
          const g = grp(par);
          g.scale.z = sg;
          f(g, sg);
        }
      };
      const halo = (par, x, y, z, s, op = 0.6) => {
        const sp = new THREE.Sprite(halos[op] || (halos[op] = new THREE.SpriteMaterial({ map: glowTex(), color: glow, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: op })));
        sp.position.set(x, y, z);
        sp.scale.set(s, s, 1);
        par.add(sp);
        return sp;
      };
      const tab = (a, u) => {
        const f = Math.max(0, Math.min(1, u)) * (a.length - 1), i = Math.min(a.length - 2, Math.floor(f));
        return a[i] + (a[i + 1] - a[i]) * (f - i);
      };
      // 胴の表面: x での中心の高さと半径
      const atX = (P, R, x) => {
        let i = 0;
        while (i < P.length - 2 && (P[i + 1][0] - x) * (P[i + 1][0] - P[0][0]) < 0) i++;
        const f = Math.max(0, Math.min(1, (x - P[i][0]) / (P[i + 1][0] - P[i][0])));
        return [P[i][1] + (P[i + 1][1] - P[i][1]) * f, R[i] + (R[i + 1] - R[i]) * f];
      };
      // ---- 基本の形 ----
      const sph = G("sph", () => new THREE.SphereGeometry(1, 28, 18));
      const hemi = G("hemi", () => new THREE.SphereGeometry(1, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2));
      const cylG = G("cyl", () => new THREE.CylinderGeometry(1, 1, 1, 24));
      const boxG = G("box", () => new THREE.BoxGeometry(1, 1, 1));
      const tor = (ratio, arc = 6.2832) => G(`tor:${ratio}:${arc.toFixed(2)}`, () => new THREE.TorusGeometry(1, ratio, 12, 48, arc));
      const tooth = G("tooth", () => {
        const g = new THREE.ConeGeometry(1, 1, 8);
        g.rotateZ(-Math.PI / 2);
        g.translate(0.5, 0, 0);
        return g;
      });
      const sw = (P, R, o, tag = "") => G("sw:" + tag + JSON.stringify([P, typeof R === "function" ? 0 : R, o && Object.assign({}, o, { rf: o.rf ? 1 : 0 })]), () => sweep(P, R, o));
      // 角・爪・とげ: +x へのび、+y へ反る。長さ1・根元の半径 rr
      const hornG = (rr, bend = 0, ridge = 0) =>
        G(`horn:${rr}:${bend}:${ridge}`, () => {
          const P = [];
          for (let i = 0; i <= 5; i++) {
            const a = (bend * i) / 5;
            P.push(Math.abs(bend) < 0.01 ? [i / 5, 0, 0] : [Math.sin(a) / bend, (1 - Math.cos(a)) / bend, 0]);
          }
          return sweep(P, (u) => rr * Math.pow(1 - u, 0.85) * (1 + ridge * Math.sin(u * 60)) + 0.003, { nv: 12, nu: ridge ? 50 : 16 });
        });
      // 押し出した板(ふちは丸める): 刃・盾・ひれ・機械の翼
      const ext = (key, pts, depth, bev, smooth = 0) =>
        G("ext:" + key, () => {
          let v = pts.map((p) => new THREE.Vector2(p[0], p[1]));
          if (smooth) v = new THREE.SplineCurve(v.concat([v[0]])).getPoints(smooth).slice(0, -1);
          const g = new THREE.ExtrudeGeometry(new THREE.Shape(v), { depth, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 3, curveSegments: 8 });
          g.translate(0, 0, -depth / 2);
          return g;
        });
      // 羽1枚: +x へのび、幅は z、表は +y。軸のところが少し盛り上がり、先は下へ反る
      const featherG = G("feather", () => {
        const nu = 12, nv = 4, pos = [], uv = [], idx = [];
        for (let i = 0; i <= nu; i++) {
          const s = i / nu, w = 0.11 * Math.pow(Math.sin(Math.PI * Math.pow(s, 0.62)), 0.55) + 0.004;
          for (let j = 0; j <= nv; j++) {
            const q = (j / nv) * 2 - 1;
            pos.push(s, -0.08 * s * s + 0.3 * w * (1 - q * q), q * w);
            uv.push(j / nv, s);
          }
        }
        for (let i = 0; i < nu; i++)
          for (let j = 0; j < nv; j++) {
            const a = i * (nv + 1) + j, b = a + nv + 1;
            idx.push(a, a + 1, b, b, a + 1, b + 1);
          }
        return geoOf(pos, null, uv, idx);
      });
      // 毛のふさ
      const tuftG = G("tuft", () => sweep([[0, 0, 0], [0.3, 0.05, 0], [0.7, 0.05, 0], [1, -0.03, 0]], [0.1, 0.13, 0.08, 0.004], { nv: 8, ez: 0.6 }));
      // 六角の結晶(両端がとがる)。中心が原点・長さ1(y)
      const gemG = G("gem", () => {
        const c = new THREE.CylinderGeometry(1, 1, 0.5, 6, 1, true).toNonIndexed(), t = new THREE.ConeGeometry(1, 0.25, 6, 1, true).toNonIndexed();
        c.computeVertexNormals();
        t.computeVertexNormals();
        return merge([[c, new THREE.Matrix4()], [t, new THREE.Matrix4().makeTranslation(0, 0.375, 0)], [t, new THREE.Matrix4().makeRotationX(Math.PI).setPosition(0, -0.375, 0)]]);
      });
      // 平たい輪(水平)。模様は1周に巻く
      const annulus = (r0) =>
        G("ann:" + r0, () => {
          const n = 64, pos = [], uv = [], idx = [];
          for (let i = 0; i <= n; i++) {
            const a = (i / n) * 6.2832;
            pos.push(Math.cos(a) * r0, 0, Math.sin(a) * r0, Math.cos(a), 0, Math.sin(a));
            uv.push(i / n, 0, i / n, 1);
            if (i < n) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 2, i * 2 + 1, i * 2 + 3);
          }
          return geoOf(pos, null, uv, idx);
        });
      // ごつごつした岩(球をでこぼこにする)
      const boulder = (sd) =>
        G("bd:" + sd, () => {
          const g = new THREE.IcosahedronGeometry(1, 10), p = g.attributes.position, nr = g.attributes.normal;
          const f = (d, o) => {
            const n = Math.sin(d.x * 3.1 + sd) * Math.sin(d.y * 2.7 + sd * 1.7) * Math.sin(d.z * 3.3 + sd * 0.6) * 0.22 + Math.sin(d.x * 6.3 + d.y * 5.1 + sd * 2) * Math.sin(d.z * 7.1 - d.y * 4.3 + sd) * 0.08 + Math.sin(d.x * 13 + sd) * Math.sin(d.y * 12 - sd) * Math.sin(d.z * 14) * 0.03;
            return o.copy(d).multiplyScalar(1 + n);
          };
          const d = V(), t1 = V(), t2 = V(), a = V(), b = V(), c = V(), q = V();
          for (let i = 0; i < p.count; i++) {
            d.fromBufferAttribute(p, i).normalize();
            t1.crossVectors(d, Math.abs(d.y) < 0.9 ? V(0, 1, 0) : V(1, 0, 0)).normalize();
            t2.crossVectors(d, t1);
            f(d, a);
            f(q.copy(d).addScaledVector(t1, 0.02).normalize(), b);
            f(q.copy(d).addScaledVector(t2, 0.02).normalize(), c);
            b.sub(a);
            c.sub(a);
            q.crossVectors(b, c).normalize();
            if (q.dot(d) < 0) q.negate();
            p.setXYZ(i, a.x, a.y, a.z);
            nr.setXYZ(i, q.x, q.y, q.z);
          }
          return g;
        });
      // 胴をおおう羽・毛: 胴の表面にそって、後ろ向きに少し立てて並べる
      const coat = (key, geo, P, R, ez, rows, per, len, tilt, wid = 1, u0 = 0, u1 = 1, arc = Math.PI, a0 = 0) =>
        G("coat:" + key, () => {
          const parts = [], xs = P.map((p) => p[0]), ys = P.map((p) => p[1]);
          for (let i = 0; i < rows; i++) {
            const u = u0 + ((u1 - u0) * i) / Math.max(1, rows - 1), x = tab(xs, u), cy = tab(ys, u), r = tab(R, u);
            for (let j = 0; j < per; j++) {
              const a = a0 + ((j + (i % 2) * 0.5 + 0.25) / per) * 2 * arc - arc, l = len * (0.8 + 0.4 * hash(i * 31 + j * 7 + 1));
              parts.push([geo, bas([x, cy + r * Math.cos(a) * 0.97, r * ez * Math.sin(a) * 0.97], [-1, tilt * Math.cos(a), tilt * Math.sin(a)], [0, Math.cos(a), Math.sin(a)], l, l, l * wid)]);
            }
          }
          return merge(parts);
        });
      const xt = (par, mat, p, d, l, r, rz = r) => put(gemG, mat, p, [d[1], -d[0], 0], d, r, l, rz, par);
      // 光る目: くぼみ・光る玉・たて長のひとみ・にじむ光
      const eye = (par, x, y, z, r, slit = true) => {
        for (const sg of [-1, 1]) {
          add(sph, BK, x - r * 0.2, y, sg * (z - r * 0.5), 0, 0, 0, r * 1.35, r * 1.2, r * 0.7, par);
          add(sph, GL, x, y, sg * z, 0, 0, 0, r, r * 0.85, r * 0.7, par);
          if (slit) add(sph, BK, x + r * 0.35, y, sg * (z + r * 0.5), 0, 0, 0, r * 0.22, r * 0.7, r * 0.3, par);
          halo(par, x, y, sg * (z + r), r * 9, 0.6);
        }
      };
      const claws = (par, p, d, u, len, n = 3, spread = 0.5, mat = M3) => {
        const ax = V(u[0], u[1], u[2]).normalize();
        for (let i = 0; i < n; i++) {
          const D = V(d[0], d[1], d[2]).applyAxisAngle(ax, (i - (n - 1) / 2) * spread);
          put(hornG(0.2, -1.0), mat, p, [D.x, D.y, D.z], u, len, len, len, par);
        }
      };
      const limb = (par, hip, P, R, mat = M1, o) => {
        const g = grp(par, hip[0], hip[1], hip[2]);
        add(sw(P, R, o || { nv: 16 }), mat, 0, 0, 0, 0, 0, 0, 1, 1, 1, g);
        return g;
      };
      // 節でつないだ管(首・尾・長い胴)。節ごとに少しずつ曲がり、波が根元から先へ伝わる。上昇・旋回には遅れてついてくる
      const chain = (par, x, y, n, len, rk, mat, o = {}) => {
        const dir = o.dir || -1, ey = o.ey || 1, ez = o.ez || 1, js = [];
        const R = (k) => (typeof rk === "function" ? rk(k) : rk[0] + (rk[1] - rk[0]) * (k / n));
        let p = par;
        for (let k = 0; k < n; k++) {
          const j = grp(p, k ? dir * len : x, k ? 0 : y, 0), ra = R(k), rb = R(k + 1), q = Math.round((rb / ra) * 20) / 20;
          add(G(`seg:${dir}:${q}`, () => {
            const g = new THREE.CylinderGeometry(q, 1, 1, 20, 1, true);
            g.rotateZ(dir > 0 ? -Math.PI / 2 : Math.PI / 2);
            g.translate(dir * 0.5, 0, 0);
            return g;
          }), mat, 0, 0, 0, 0, 0, 0, len, ra * ey, ra * ez, j);
          add(sph, mat, 0, 0, 0, 0, 0, 0, ra, ra * ey, ra * ez, j);
          if (o.each) o.each(j, k, ra, rb);
          js.push(j);
          p = j;
        }
        const tip = grp(p, dir * len, 0, 0);
        add(sph, mat, 0, 0, 0, 0, 0, 0, R(n), R(n) * ey, R(n) * ez, tip);
        const bz = o.bz || (() => 0), w = o.w || 2.4, pz = o.pz == null ? 0.6 : o.pz, az = o.az == null ? 0.1 : o.az, ay = o.ay == null ? 0.1 : o.ay, lag = o.lag == null ? 0.05 : o.lag, ph0 = o.ph || 0;
        anim.push(() => {
          for (let k = 0; k < n; k++) {
            const g = o.gain ? o.gain(k / n) : 0.4 + k / n;
            js[k].rotation.z = bz(k) + Math.sin(S.t * w - k * pz + ph0) * az * g - dir * S.climb * lag;
            js[k].rotation.y = Math.sin(S.t * w * 0.73 - k * pz + 1 + ph0) * ay * g + S.turn * lag;
          }
          // 長い胴は、波の分だけ根元を逆へ向けて、全体の向きがぶれないようにする
          if (o.level) ((js[0].rotation.z += (az * Math.cos(S.t * w + ph0 + pz / 2)) / (2 * Math.sin(pz / 2))), (js[0].rotation.y += (ay * Math.cos(S.t * w * 0.73 + 1 + ph0 + pz / 2)) / (2 * Math.sin(pz / 2))));
        });
        return { js, tip };
      };
      // 羽ばたき: 肩で大きく上下し、手首から先は遅れてしなる。下降中は小さくたたんで滑空する
      const flap = (sh, hd, o) =>
        anim.push(() => {
          const ph = S.ph + (o.ph || 0), a = S.amp * (o.amp || 1);
          sh.rotation.x = -((o.dih == null ? 0.25 : o.dih) + S.fold * 0.25 + Math.sin(ph) * 0.6 * a);
          sh.rotation.y = Math.cos(ph) * 0.14 * a - S.fold * 0.25;
          sh.rotation.z = Math.cos(ph) * 0.16 * a;
          hd.rotation.x = Math.sin(ph - 1.1) * 0.55 * a - S.fold * 0.5;
        });
      // 膜の翼: 肩→ひじ→手首の腕と、手首から開く4本の指。大きさ1で作って L 倍する
      const batWing = (par, x, y, z, L, o = {}) => {
        const E = [-0.1, 0.07, 0.34], W = [0.16, 0.1, 0.6], F = [[0.12, 0.04, 1.3], [-0.36, 0, 1.1], [-0.66, -0.02, 0.76], [-0.74, -0.02, 0.34]], Bp = [-0.62, -0.06, 0.02];
        // 手首から先は、いちばん内側の指を軸に折れる(内側の膜とすき間ができない)
        const q = new THREE.Quaternion().setFromUnitVectors(V(1, 0, 0), V(F[3][0] - W[0], F[3][1] - W[1], F[3][2] - W[2]).normalize()), qi = q.clone().invert();
        const loc = (p) => V(p[0] - W[0], p[1] - W[1], p[2] - W[2]).applyQuaternion(qi).toArray();
        const gIn = G("bw:in", () => membrane([0, 0, 0], [W, F[3], Bp], [0, 0.3], 0.05));
        const gOut = G("bw:out", () => membrane([0, 0, 0], F.map(loc), 0.34, 0.06));
        const bIn = G("bw:bi", () => merge([[sweep([[0, 0, 0], E, W], [0.04, 0.03, 0.026], { nv: 12 }), new THREE.Matrix4()], [sph, new THREE.Matrix4().makeScale(0.036, 0.036, 0.036).setPosition(E[0], E[1], E[2])], [sph, new THREE.Matrix4().makeScale(0.034, 0.034, 0.034).setPosition(W[0], W[1], W[2])], [sweep([W, [(W[0] + F[3][0]) / 2, 0.06, (W[2] + F[3][2]) / 2 + 0.02], F[3]], [0.016, 0.012, 0.004], { nv: 8 }), new THREE.Matrix4()]]));
        const bOut = G("bw:bo", () => merge(F.slice(0, 3).map((f) => {
          const l = loc(f);
          return [sweep([[0, 0, 0], [l[0] * 0.5, l[1] * 0.5 + 0.035, l[2] * 0.5], l], [0.018, 0.013, 0.004], { nv: 8 }), new THREE.Matrix4()];
        })));
        mirror(par, (g) => {
          g.position.set(x, y, z);
          g.scale.multiplyScalar(L);
          g.userData.nb = true;
          const sh = grp(g);
          add(gIn, WG, 0, 0, 0, 0, 0, 0, 1, 1, 1, sh);
          add(bIn, M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, sh);
          put(hornG(0.2, 0.8), M3, W, [0.6, 0.8, 0.1], [-1, 0, 0], 0.14, 0.14, 0.14, sh); // 手首の爪
          const h0 = grp(sh, W[0], W[1], W[2]);
          h0.quaternion.copy(q);
          const hd = grp(h0);
          add(gOut, WG, 0, 0, 0, 0, 0, 0, 1, 1, 1, hd);
          add(bOut, M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, hd);
          flap(sh, hd, o);
        });
      };
      // 羽の翼: 風切り羽(手に初列・腕に次列)の上に、雨おおい羽を2段かさねる
      const featherWing = (par, x, y, z, L, o = {}) => {
        const E = [-0.06, 0.05, 0.3], W = [0.1, 0.07, 0.58], Tp = [0.0, 0.03, 0.9];
        const row = (key, A, B, n, len, dy, d0, d1, wid) =>
          G("fw:" + key, () => {
            const parts = [];
            for (let i = 0; i < n; i++) {
              const t = i / (n - 1), l = len * (0.85 + 0.3 * Math.sin(Math.PI * (0.25 + t * 0.6)));
              parts.push([featherG, bas([A[0] + (B[0] - A[0]) * t - 0.01, A[1] + (B[1] - A[1]) * t + dy + i * 0.0015, A[2] + (B[2] - A[2]) * t], [d0[0] + (d1[0] - d0[0]) * t, -0.04, d0[1] + (d1[1] - d0[1]) * t], [0.12, 1, -0.2], l, l, l * wid)]);
            }
            return merge(parts);
          });
        const armG = G("fw:arm", () => merge([[sweep([[0, 0, 0], E, W], [0.06, 0.05, 0.04], { nv: 12 }), new THREE.Matrix4()], [sph, new THREE.Matrix4().makeScale(0.07, 0.06, 0.07)]]));
        const handG = G("fw:hand", () => sweep([[0, 0, 0], [Tp[0] - W[0], Tp[1] - W[1], Tp[2] - W[2]]], [0.04, 0.012], { nv: 10 }));
        const H = [Tp[0] - W[0], Tp[1] - W[1], Tp[2] - W[2]];
        mirror(par, (g) => {
          g.position.set(x, y, z);
          g.scale.multiplyScalar(L);
          g.userData.nb = true;
          const sh = grp(g);
          add(armG, M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, sh);
          add(row("sec", [-0.02, 0, 0.04], W, 10, 0.5, -0.012, [-1, 0.1], [-1, 0.32], 1.25), FT, 0, 0, 0, 0, 0, 0, 1, 1, 1, sh);
          add(row("sc1", [-0.02, 0, 0.04], W, 11, 0.27, 0.008, [-1, 0.1], [-1, 0.3], 1.5), FT2, 0, 0, 0, 0, 0, 0, 1, 1, 1, sh);
          add(row("sc2", [-0.01, 0, 0.05], W, 12, 0.15, 0.024, [-1, 0.1], [-1, 0.3], 1.7), FT, 0, 0, 0, 0, 0, 0, 1, 1, 1, sh);
          const hd = grp(sh, W[0], W[1], W[2]);
          add(handG, M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, hd);
          add(row("pri", [0, 0, 0], H, 10, 0.62, -0.012, [-1, 0.42], [-0.05, 1], 1.1), FT, 0, 0, 0, 0, 0, 0, 1, 1, 1, hd);
          add(row("pc1", [0, 0, 0], H, 9, 0.3, 0.008, [-1, 0.42], [-0.15, 1], 1.4), FT2, 0, 0, 0, 0, 0, 0, 1, 1, 1, hd);
          add(row("pc2", [0, 0, 0], H, 9, 0.16, 0.022, [-1, 0.42], [-0.2, 1], 1.6), FT, 0, 0, 0, 0, 0, 0, 1, 1, 1, hd);
          flap(sh, hd, o);
        });
      };
      // ひれ(骨のあいだに膜)。根元が原点、+x へ開く扇(x–z の面)
      const fin = (par, p, d, u, len, n, spread, mat = WG) => {
        const tips = [];
        for (let i = 0; i < n; i++) {
          const a = (i / (n - 1) - 0.5) * spread, l = 1 - 0.3 * Math.abs(i / (n - 1) - 0.5) * 2;
          tips.push([Math.cos(a) * l, 0, Math.sin(a) * l]);
        }
        const g = gput(par, p, d, u, len);
        add(G(`fin:${n}:${spread}`, () => membrane([0, 0, 0], tips, 0.3, 0.03)), mat, 0, 0, 0, 0, 0, 0, 1, 1, 1, g);
        add(G(`finb:${n}:${spread}`, () => merge(tips.map((t) => [sweep([[0, 0, 0], t], [0.022, 0.004], { nv: 6, nu: 4 }), new THREE.Matrix4()]))), M3, 0, 0, 0, 0, 0, 0, 1, 1, 1, g);
        g.userData.nb = true;
        return g;
      };
      // 竜・海蛇の頭: 長い鼻面・まゆ・歯のならんだ上下のあご(下あごは開く)・角
      const rhead = (par, horns) => {
        const h = grp(par);
        add(sw([[-0.06, 0, 0], [0.05, 0.022, 0], [0.16, 0.016, 0], [0.27, -0.004, 0], [0.335, -0.014, 0]], [0.04, 0.075, 0.062, 0.044, 0.02], { ez: 0.95, ey: 0.82, nv: 22 }), M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, h);
        for (let k = 0; k < 5; k++) add(hemi, M2, 0.06 + k * 0.055, 0.074 - k * 0.0135, 0, 0, 0, -0.22, 0.042 - k * 0.005, 0.016, 0.034 - k * 0.004, h); // 鼻すじの板
        mirror(h, (g) => {
          add(sw([[0.02, 0.05, 0.04], [0.1, 0.07, 0.056], [0.18, 0.04, 0.045]], [0.012, 0.022, 0.006], { nv: 10 }), M2, 0, 0, 0, 0, 0, 0, 1, 1, 1, g); // まゆ
          add(sph, BK, 0.318, -0.002, 0.013, 0, 0, 0, 0.007, 0.005, 0.005, g);
          if (horns) {
            put(hornG(0.085, 0.7, 0.1), M3, [-0.01, 0.05, 0.045], [-0.85, 0.42, 0.32], [0, 1, 0], 0.4, 0.4, 0.4, g);
            put(hornG(0.09, -0.6, 0.1), M3, [-0.02, 0.0, 0.058], [-0.9, 0.05, 0.5], [0, 1, 0], 0.22, 0.22, 0.22, g);
            for (let k = 0; k < 3; k++) put(hornG(0.16, 0.3), M2, [0.0, -0.03 + k * 0.02, 0.058], [-0.8, -0.35 + k * 0.3, 0.55], [0, 1, 0], 0.13 - k * 0.02, 0.13, 0.07, g);
          } else for (let k = 0; k < 3; k++) fin(g, [0.0, 0.02 - k * 0.03, 0.055], [-0.75, 0.3 - k * 0.3, 0.6], [0.6, 0, 0.8], 0.2 - k * 0.03, 4, 0.9); // えらのひれ
        });
        eye(h, 0.105, 0.03, 0.057, 0.018);
        add(G("rh:tu", () => {
          const parts = [];
          for (let k = 0; k < 9; k++) for (const sg of [-1, 1]) parts.push([tooth, bas([0.13 + k * 0.024, -0.022 - k * 0.002, sg * (0.042 - k * 0.003)], [0.12, -1, 0], [0, 0, 1], k === 7 ? 0.045 : 0.02 + (k % 2) * 0.007, 0.007, 0.007)]);
          return merge(parts);
        }), M3, 0, 0, 0, 0, 0, 0, 1, 1, 1, h);
        const jaw = grp(h, 0, -0.036, 0);
        add(sw([[0, 0, 0], [0.1, -0.02, 0], [0.2, -0.018, 0], [0.3, 0.0, 0]], [0.034, 0.04, 0.03, 0.012], { ey: 0.6, ez: 0.95, nv: 16 }), M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, jaw);
        add(G("rh:tl", () => {
          const parts = [];
          for (let k = 0; k < 8; k++) for (const sg of [-1, 1]) parts.push([tooth, bas([0.11 + k * 0.024, 0.0, sg * (0.035 - k * 0.003)], [0.1, 1, 0], [0, 0, 1], k === 7 ? 0.032 : 0.017 + (k % 2) * 0.006, 0.006, 0.006)]);
          return merge(parts);
        }), M3, 0, 0, 0, 0, 0, 0, 1, 1, 1, jaw);
        add(sph, GL, 0.1, 0.0, 0, 0, 0, 0, 0.07, 0.007, 0.02, jaw); // 口の中の光
        mirror(jaw, (g) => put(hornG(0.18, 0.5), M3, [0.07, -0.03, 0.02], [-0.6, -0.8, 0.25], [-1, 0, 0], 0.07, 0.07, 0.07, g));
        if (horns) put(hornG(0.22, 0.5), M3, [0.29, 0.02, 0], [0.3, 1, 0], [-1, 0, 0], 0.06, 0.06, 0.04, h);
        anim.push(() => (jaw.rotation.z = -0.14 - Math.max(0, Math.sin(S.t * 1.3 + 1)) ** 3 * 0.32));
        return h;
      };
      // ふちがぎざぎざの衣(すそがなびく)
      const robe = (par, mat, y0, h, r0, r1, back, folds, taper = 0) => {
        const sh = sheet(32, 12, (u, v, t, out) => {
          const a = u * 6.2832, w = Math.pow(v, 0.8), r = (r0 + (r1 - r0) * w) * (1 + 0.11 * v * Math.sin(a * folds + Math.sin(t * 2.2 + v * 3) * 1.1)) * (1 - taper * v * v);
          out[0] = Math.cos(a) * r * 0.85 - v * v * back + Math.sin(t * 1.9 - v * 3) * 0.03 * v * v;
          out[1] = y0 - v * h + 0.05 * v ** 4 * Math.sin(a * 9 + 1);
          out[2] = Math.sin(a) * r + Math.sin(t * 2.4 - v * 3.5) * 0.05 * v * v;
        }, true);
        const me = add(sh.g, mat, 0, 0, 0, 0, 0, 0, 1, 1, 1, par);
        anim.push(() => sh.upd(S.t));
        return me;
      };
      const CL = () => PM({ color: bright, map: tex("cloth", 4, 1), bumpMap: tex("cloth", 4, 1), bumpScale: 0.004, side: THREE.DoubleSide, roughness: 0.7, metalness: 0.05, sheen: 1, sheenColor: glow, emissive: glow, emissiveIntensity: 1.6, emissiveMap: tex("clothE", 4, 1) });

      const BUILD = {
        dragon() {
          S.w = 5.2;
          S.lift = 0.07;
          const BP = [[-0.42, 0.5, 0], [-0.24, 0.52, 0], [0, 0.54, 0], [0.2, 0.56, 0], [0.35, 0.6, 0]], BR = [0.075, 0.13, 0.17, 0.16, 0.1];
          add(sw(BP, BR, { ez: 0.85, nv: 28 }), M1, 0, 0, 0);
          add(sw(BP.map((p) => [p[0], p[1] - 0.035, 0]), BR.map((r) => r * 0.86), { ez: 0.72, nv: 24, nu: 60, rf: (u) => 1 + 0.07 * Math.abs(Math.sin(u * 34)) }, "dbelly"), M4, 0, 0, 0); // 腹の板
          // 背の鎧(4段)・背びれのとげ・わき腹の光る線
          for (let k = 0; k < 4; k++) {
            const x = 0.22 - k * 0.125, [cy, r] = atX(BP, BR, x);
            add(hemi, M2, x, cy + r * 0.8, 0, 0, 0, 0.2, 0.1, 0.06, 0.1 - k * 0.008);
          }
          add(G("dspine", () => {
            const parts = [];
            for (let k = 0; k < 9; k++) {
              const x = 0.3 - k * 0.085, [cy, r] = atX(BP, BR, x), l = 0.1 + 0.06 * Math.sin((k / 8) * Math.PI);
              parts.push([hornG(0.25, 0.5), bas([x, cy + r * 0.95, 0], [-0.45, 1, 0], [-1, 0, 0], l, l, l * 0.45)]);
            }
            return merge(parts);
          }), M3, 0, 0, 0);
          mirror(root, (g, sg) => {
            add(sw(BP.map((p, i) => [p[0], p[1] + 0.02, BR[i] * 0.85 * 0.99]), [0.002, 0.008, 0.009, 0.008, 0.002], { nv: 8 }), GL, 0, 0, 0, 0, 0, 0, 1, 1, 1, g);
            // 前あし・後ろあし(飛んでいるので後ろへたたむ)
            const fl = limb(g, [0.2, 0.5, 0.11], [[0, 0, 0], [-0.06, -0.14, 0.03], [0.04, -0.23, 0.025], [0.12, -0.26, 0.02]], [0.07, 0.055, 0.034, 0.03]);
            claws(fl, [0.12, -0.26, 0.02], [0.85, -0.5, 0], [0, 1, 0], 0.08);
            add(sph, M2, -0.05, -0.13, 0.035, 0, 0, 0, 0.04, 0.04, 0.035, fl);
            const hl = limb(g, [-0.26, 0.48, 0.11], [[0, 0, 0], [0.06, -0.15, 0.04], [-0.08, -0.22, 0.035], [-0.2, -0.27, 0.03]], [0.085, 0.06, 0.035, 0.03]);
            claws(hl, [-0.2, -0.27, 0.03], [-0.8, -0.6, 0], [0, 1, 0], 0.08);
            add(sph, M1, 0, 0, 0, 0, 0, 0.3, 0.095, 0.115, 0.06, hl);
            anim.push(() => ((fl.rotation.z = Math.sin(S.t * 1.3 + sg) * 0.08 - S.climb * 0.2), (hl.rotation.z = Math.sin(S.t * 1.1 + sg * 2) * 0.08 + S.climb * 0.15)));
          });
          // 胸の核
          add(sph, GL, 0.385, 0.53, 0, 0, 0, 0, 0.04, 0.05, 0.045);
          add(tor(0.22), M2, 0.39, 0.53, 0, 0, Math.PI / 2, 0, 0.055);
          halo(root, 0.43, 0.53, 0, 0.4, 0.5);
          // 首(S字)と頭
          const nbz = [0.62, 0.3, 0.1, -0.1, -0.25, -0.3];
          const nk = chain(root, 0.33, 0.61, 6, 0.07, [0.1, 0.062], M1, {
            dir: 1, bz: (k) => nbz[k], az: 0.05, ay: 0.06, w: 1.7, pz: 0.5, lag: 0.07,
            each: (j, k, ra) => {
              put(hornG(0.25, 0.5), M3, [0.03, ra * 0.9, 0], [-0.4, 1, 0], [-1, 0, 0], 0.075 - k * 0.004, 0.075, 0.035, j);
              add(sph, M4, 0.035, -ra * 0.35, 0, 0, 0, 0, 0.045, ra * 0.75, ra * 0.7, j);
            },
          });
          const hd = grp(nk.tip);
          hd.scale.setScalar(1.15);
          const hh = rhead(hd, true);
          anim.push(() => ((hd.rotation.z = -0.5 + Math.sin(S.t * 1.1) * 0.06 - S.climb * 0.12), (hd.rotation.y = Math.sin(S.t * 0.7) * 0.12 + S.turn * 0.2)));
          // 尾と、先の刃
          const tl = chain(root, -0.4, 0.5, 12, 0.058, [0.078, 0.014], M1, {
            bz: (k) => -0.07 + 0.012 * k, az: 0.09, ay: 0.13, w: 2.2, pz: 0.55, lag: 0.05,
            each: (j, k, ra) => {
              put(hornG(0.25, 0.5), M3, [-0.02, ra * 0.9, 0], [-0.5, 1, 0], [-1, 0, 0], ra * 1.1, ra * 1.1, ra * 0.5, j);
              add(sph, M4, -0.03, -ra * 0.3, 0, 0, 0, 0, 0.035, ra * 0.78, ra * 0.72, j);
            },
          });
          add(ext("dblade", [[0, 0.012], [-0.04, 0.07], [-0.11, 0.055], [-0.24, 0], [-0.11, -0.055], [-0.04, -0.07], [0, -0.012]], 0.004, 0.008), M3, 0, 0, 0, 0, 0, 0, 1, 1, 1, tl.tip);
          add(sph, GL, -0.07, 0, 0, 0, 0, 0, 0.03, 0.02, 0.012, tl.tip);
          batWing(root, 0.1, 0.66, 0.08, gold ? 1.15 : 1.0, { dih: 0.3 });
          if (gold) {
            // エース・シンクロ: 小さい翼がもう1組と、頭の後ろの光の輪
            batWing(root, -0.16, 0.6, 0.07, 0.62, { dih: 0.12, ph: -0.8, amp: 0.7 });
            const ring = grp(hh, -0.1, 0.12, 0);
            ring.rotation.z = 0.3;
            add(tor(0.035), GL, 0, 0, 0, 0, Math.PI / 2, 0, 0.17, 0.17, 0.17, ring);
            const rn = add(annulus(0.72), RN, 0, 0, 0, 0, 0, Math.PI / 2, 0.24, 0.24, 0.24, ring);
            anim.push(() => (rn.rotation.x = S.t * 0.8));
            for (let k = 0; k < 3; k++) xt(hh, GL, [0.0, 0.085 + (k === 1 ? 0.015 : 0), (k - 1) * 0.03], [-0.3, 1, (k - 1) * 0.5], k === 1 ? 0.1 : 0.07, 0.012);
          }
        },
        serpent() {
          S.w = 2.6;
          S.lift = 0;
          const n = 22, len = 0.066, rr = (k) => 0.03 + 0.062 * Math.pow(Math.sin(Math.PI * Math.min(1, (k + 3.5) / (n + 5))), 0.8) * (1 - (k / n) ** 3 * 0.75);
          const bd = chain(root, 0.42, 0.6, n, len, rr, M1, {
            ez: 0.82, az: 0.2, ay: 0.13, w: 2.6, pz: 0.52, lag: 0.012, gain: () => 1, level: true,
            each: (j, k, ra) => {
              const h = 0.03 + 0.1 * Math.sin((k / n) * Math.PI) ** 0.7;
              add(sph, M4, -len / 2, -ra * 0.32, 0, 0, 0, 0, len * 0.62, ra * 0.76, ra * 0.62, j); // 腹の板
              if (k % 2 === 0) mirror(j, (g) => (add(sph, GL, -0.02, ra * 0.1, ra * 0.8, 0, 0, 0, 0.009, 0.009, 0.005, g), k % 4 === 0 && halo(g, -0.02, ra * 0.1, ra * 0.86, 0.06, 0.6))); // 体の横の光る点
              // 背びれ(骨と膜)
              put(hornG(0.1, 0.3), M3, [0, ra * 0.9, 0], [-0.55, 1, 0], [-1, 0, 0], h * 1.25, h, h, j);
              add(G("sfin", () => geoOf([0, 0, 0, -1, 0, 0, -0.55, 1, 0, -1.55, 1, 0], null, [0, 0, 1, 0, 0, 1, 1, 1], [0, 1, 2, 2, 1, 3])), WG, 0, ra * 0.9, 0, 0, 0, 0, len, h * 1.05, 1, j).userData.nb = true;
              if (k === 2 || k === 9) {
                // 胸びれ・腹びれ: ゆっくりあおぐ
                mirror(j, (g, sg) => {
                  const f = fin(g, [0, -ra * 0.2, ra * 0.7], [-0.55, -0.25, 0.8], [0, 1, 0.3], k === 2 ? 0.34 : 0.2, 5, 1.2);
                  const pv = grp(g);
                  pv.add(f);
                  anim.push(() => (pv.rotation.x = Math.sin(S.t * 2.2 + k) * 0.35 - 0.1));
                });
              }
            },
          });
          bd.tip.userData.nb = true;
          for (const s of [1, -1]) fin(bd.tip, [0, 0, 0], [-1, s * 0.5, 0], [0, 0, 1], 0.26, 5, 1.0); // 尾びれ
          const hd = grp(root, 0.42, 0.6, 0);
          hd.scale.setScalar(1.25);
          const hh = rhead(hd, false);
          fin(hh, [0.08, 0.06, 0], [-0.8, 0.6, 0], [0, 0, 1], 0.24, 5, 1.0); // とさかのひれ
          // 長いひげ
          mirror(hh, (g, sg) => {
            const b = grp(g, 0.3, -0.01, 0.02);
            b.rotation.y = -0.5;
            chain(b, 0, 0, 9, 0.045, [0.008, 0.002], GL, { dir: 1, bz: () => -0.09, az: 0.12, ay: 0.12, w: 3, pz: 0.7, lag: 0.02, ph: sg });
          });
          anim.push(() => ((hd.rotation.z = Math.sin(S.t * 2.6 + 0.6) * 0.12 - S.climb * 0.1), (hd.rotation.y = Math.sin(S.t * 1.9 + 1.5) * 0.1 + S.turn * 0.2)));
          halo(root, 0.5, 0.6, 0, 0.3, 0.25);
        },
        bird() {
          S.w = 6.4;
          S.lift = 0.08;
          const BP = [[-0.32, 0.5, 0], [-0.16, 0.5, 0], [0.02, 0.51, 0], [0.18, 0.55, 0], [0.28, 0.62, 0]], BR = [0.03, 0.1, 0.14, 0.125, 0.08];
          add(sw(BP, BR, { ez: 0.9, nv: 24 }), M1, 0, 0, 0);
          // 体じゅうの羽(うろこのように重なる)。胸は明るい色
          add(coat("bird", featherG, BP, BR, 0.9, 11, 12, 0.13, 0.28, 2.3, 0.08, 0.98), FT2, 0, 0, 0);
          add(coat("birdB", featherG, BP.map((p) => [p[0], p[1] - 0.004, 0]), BR, 0.9, 8, 5, 0.12, 0.3, 2.4, 0.3, 0.95, 0.6, Math.PI), FT, 0, 0, 0);
          // 頭: かぎ形のくちばし(下は開く)・けわしいまゆ・後ろへなびく冠羽
          const hd = grp(root, 0.3, 0.64, 0);
          add(sph, M1, 0.06, 0.04, 0, 0, 0, 0.2, 0.1, 0.088, 0.08, hd);
          add(G("bhead", () => {
            const parts = [];
            for (let i = 0; i < 4; i++) for (let j = 0; j < 9; j++) {
              const a = ((j + (i % 2) * 0.5) / 9) * 6.2832, x = 0.11 - i * 0.035, r = 0.055 + i * 0.012;
              parts.push([featherG, bas([x, 0.04 + Math.cos(a) * r, Math.sin(a) * r * 0.9], [-1, 0.5 * Math.cos(a), 0.5 * Math.sin(a)], [0, Math.cos(a), Math.sin(a)], 0.09, 0.09, 0.2)]);
            }
            return merge(parts);
          }), FT2, 0, 0, 0, 0, 0, 0, 1, 1, 1, hd);
          add(sw([[0.12, 0.045, 0], [0.2, 0.04, 0], [0.265, 0.008, 0], [0.272, -0.045, 0]], [0.046, 0.036, 0.022, 0.002], { ez: 0.72, nv: 14 }), M3, 0, 0, 0, 0, 0, 0, 1, 1, 1, hd);
          add(sph, M2, 0.135, 0.062, 0, 0, 0, 0, 0.03, 0.022, 0.034, hd); // ろう膜
          const jaw = grp(hd, 0.11, 0.012, 0);
          add(sw([[0, 0, 0], [0.07, -0.012, 0], [0.125, -0.016, 0]], [0.03, 0.022, 0.003], { ez: 0.75, ey: 0.6, nv: 12 }), M3, 0, 0, 0, 0, 0, 0, 1, 1, 1, jaw);
          anim.push(() => (jaw.rotation.z = -0.06 - Math.max(0, Math.sin(S.t * 1.7)) ** 4 * 0.4));
          mirror(hd, (g) => add(sw([[0.05, 0.085, 0.04], [0.11, 0.09, 0.058], [0.16, 0.06, 0.045]], [0.01, 0.018, 0.005], { nv: 8 }), M2, 0, 0, 0, 0, 0, 0, 1, 1, 1, g));
          eye(hd, 0.115, 0.058, 0.066, 0.017);
          const crest = grp(hd, 0.03, 0.1, 0);
          add(G("bcrest", () => {
            const parts = [];
            for (let k = 0; k < 7; k++) {
              const a = (k - 3) * 0.2, l = 0.34 - Math.abs(k - 3) * 0.045;
              parts.push([featherG, bas([0, 0, 0], [-1, 0.45 - Math.abs(a) * 0.3, Math.sin(a) * 0.9], [0.4, 1, 0], l, l, l * 0.8)]);
            }
            return merge(parts);
          }), FT, 0, 0, 0, 0, 0, 0, 1, 1, 1, crest).userData.nb = true;
          anim.push(() => ((crest.rotation.z = Math.sin(S.t * 3.1) * 0.08 + S.climb * 0.15), (hd.rotation.z = Math.sin(S.t * 1.2) * 0.05 - S.climb * 0.2), (hd.rotation.y = Math.sin(S.t * 0.8) * 0.15 + S.turn * 0.25)));
          // 尾羽の扇と、長い飾り羽
          const tg = grp(root, -0.3, 0.5, 0);
          tg.userData.nb = true;
          add(G("btail", () => {
            const parts = [];
            for (let k = 0; k < 9; k++) {
              const a = (k - 4) * 0.13, l = 0.36 - Math.abs(k - 4) * 0.025;
              parts.push([featherG, bas([0.03, Math.abs(k - 4) * -0.004, Math.sin(a) * 0.05], [-Math.cos(a), -0.05, Math.sin(a)], [0, 1, 0], l, l, l * 0.9)]);
            }
            return merge(parts);
          }), FT, 0, 0, 0, 0, 0, 0, 1, 1, 1, tg);
          add(coat("btc", featherG, [[0.06, 0, 0], [-0.12, 0, 0]], [0.06, 0.05], 1.4, 3, 7, 0.16, 0.1, 1.6, 0, 1, 1.5), FT2, 0, 0, 0, 0, 0, 0, 1, 1, 1, tg);
          mirror(tg, (g, sg) => {
            const b = grp(g, 0, 0, 0.03);
            b.rotation.y = 0.12;
            const st = chain(b, 0, 0, 8, 0.06, [0.012, 0.01], FT2, { ey: 0.25, ez: 1.6, az: 0.1, ay: 0.08, w: 3.2, pz: 0.6, lag: 0.04, ph: sg });
            add(featherG, FT, 0.02, 0, 0, 0, Math.PI, 0, 0.3, 0.3, 0.42, st.tip);
            add(sph, GL, -0.2, 0, 0, 0, 0, 0, 0.03, 0.006, 0.02, st.tip);
          });
          anim.push(() => (tg.rotation.z = 0.08 + Math.sin(S.ph - 0.6) * 0.1 * S.amp - S.climb * 0.25));
          // あし(後ろへたたむ)とかぎ爪
          mirror(root, (g, sg) => {
            add(sph, FT2, -0.06, 0.42, 0.07, 0, 0, 0.5, 0.07, 0.09, 0.055, g);
            const l = limb(g, [-0.08, 0.38, 0.075], [[0, 0, 0], [-0.07, -0.05, 0], [-0.15, -0.045, 0]], [0.028, 0.02, 0.016], M3);
            claws(l, [-0.15, -0.045, 0], [-0.75, -0.65, 0], [0, 1, 0], 0.085, 3, 0.55, M2);
            put(hornG(0.2, -1.0), M2, [-0.15, -0.045, 0], [0.6, -0.8, 0], [0, 1, 0], 0.06, 0.06, 0.06, l);
            anim.push(() => (l.rotation.z = Math.sin(S.t * 1.4 + sg) * 0.1 + S.climb * 0.3));
          });
          featherWing(root, 0.1, 0.61, 0.09, 0.66, { dih: 0.2 });
        },
        beast() {
          S.w = 7.5;
          S.lift = 0.05;
          const BP = [[-0.38, 0.57, 0], [-0.2, 0.55, 0], [0, 0.56, 0], [0.18, 0.59, 0], [0.3, 0.64, 0]], BR = [0.085, 0.11, 0.125, 0.16, 0.12];
          const MM = PM({ color: base.clone().multiplyScalar(0.5).lerp(glow, 0.45), map: tex("fur", 1, 2), roughness: 0.6, metalness: 0.1, emissive: glow, emissiveIntensity: 0.3 }); // たてがみ
          const bd = grp(root);
          add(sw(BP, BR, { ez: 0.8, nv: 26 }), M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, bd);
          add(sw(BP.map((p) => [p[0], p[1] - 0.03, 0]), BR.map((r) => r * 0.85), { ez: 0.7, nv: 20 }), M4, 0, 0, 0, 0, 0, 0, 1, 1, 1, bd);
          add(coat("bfur", tuftG, BP, BR, 0.8, 11, 18, 0.075, 0.2, 0.5, 0.05, 0.75, 2.2), M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, bd);
          add(coat("bmane", tuftG, BP, BR.map((r) => r * 1.02), 0.8, 5, 20, 0.15, 0.42, 0.4, 0.7, 1.0), MM, 0, 0, 0, 0, 0, 0, 1, 1, 1, bd); // 首まわりのたてがみ
          add(coat("bridge", tuftG, BP, BR, 0.8, 10, 1, 0.1, 0.8, 0.4, 0.0, 0.66, 0.01), MM, 0, 0, 0, 0, 0, 0, 1, 1, 1, bd); // 背すじ
          // 肩の鎧(2段)と首輪の宝石
          mirror(bd, (g) => {
            add(hemi, GE, 0.17, 0.66, 0.1, 0.9, 0, 0, 0.11, 0.05, 0.1, g);
            add(hemi, M2, 0.12, 0.62, 0.11, 1.1, 0, 0, 0.09, 0.04, 0.085, g);
            put(hornG(0.2, 0.6), M3, [0.17, 0.7, 0.13], [-0.3, 0.6, 0.7], [0, 1, 0], 0.1, 0.1, 0.1, g);
          });
          // 頭: 鼻面・きば・耳・ひたいの角
          const hd = grp(bd, 0.33, 0.69, 0);
          add(sw([[-0.06, -0.03, 0], [0.04, 0.03, 0], [0.12, 0.06, 0]], [0.12, 0.1, 0.085], { nv: 20, ez: 0.9 }), M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, hd);
          add(sph, M1, 0.13, 0.07, 0, 0, 0, 0, 0.1, 0.09, 0.088, hd);
          add(sw([[0.15, 0.065, 0], [0.25, 0.045, 0], [0.33, 0.035, 0]], [0.065, 0.048, 0.03], { ez: 0.85, ey: 0.85, nv: 16 }), M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, hd);
          add(sph, BK, 0.345, 0.045, 0, 0, 0, 0, 0.022, 0.018, 0.024, hd); // 鼻
          add(tor(0.3), M2, 0.0, 0.0, 0, 0, Math.PI / 2 - 0.5, 0, 0.105, 0.105, 0.105, hd).rotation.z = 0.5;
          add(sph, GL, 0.085, -0.055, 0, 0, 0, 0, 0.022, 0.026, 0.022, hd);
          halo(hd, 0.1, -0.06, 0, 0.2, 0.5);
          mirror(hd, (g) => {
            add(G("bear", () => sweep([[0, 0, 0], [0.0, 0.07, 0.01], [-0.02, 0.15, 0.02]], [0.04, 0.035, 0.002], { nv: 10, ey: 0.35 })), M1, 0.08, 0.13, 0.055, 0.25, 0.3, 0, 1, 1, 1, g); // 耳
            add(sw([[0.1, 0.115, 0.04], [0.16, 0.125, 0.055], [0.22, 0.09, 0.04]], [0.01, 0.02, 0.005], { nv: 8 }), M2, 0, 0, 0, 0, 0, 0, 1, 1, 1, g);
            put(hornG(0.16, -0.5), M3, [0.29, 0.02, 0.03], [0.15, -1, 0.05], [1, 0, 0], 0.1, 0.1, 0.07, g); // 長いきば
            add(G("bteeth", () => merge([0, 1, 2, 3].map((k) => [tooth, bas([0.19 + k * 0.022, 0.012, 0.038 - k * 0.002], [0, -1, 0], [0, 0, 1], 0.02, 0.006, 0.006)]))), M3, 0, 0, 0, 0, 0, 0, 1, 1, 1, g);
            for (let k = 0; k < 3; k++) put(tuftG, MM, [0.08, 0.02 + k * 0.03, 0.08], [-0.7, -0.3 + k * 0.25, 0.6], [0, 1, 0], 0.11, 0.11, 0.05, g); // ほおの毛
          });
          eye(hd, 0.175, 0.095, 0.062, 0.016);
          put(ext("bhorn", [[0, -0.02], [0.2, 0.0], [0.0, 0.03]], 0.004, 0.006), M3, [0.17, 0.14, 0], [0.5, 0.85, 0], [0, 0, 1], 1, 1, 1, hd);
          put(hornG(0.1, 0.5), GL, [0.18, 0.13, 0], [0.55, 0.85, 0], [-1, 0, 0], 0.13, 0.05, 0.03, hd);
          const jaw = grp(hd, 0.14, 0.02, 0);
          add(sw([[0, 0, 0], [0.09, -0.016, 0], [0.165, -0.012, 0]], [0.04, 0.032, 0.016], { ey: 0.6, ez: 0.85, nv: 12 }), M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, jaw);
          mirror(jaw, (g) => put(tooth, M3, [0.145, 0.005, 0.02], [0, 1, 0], [0, 0, 1], 0.035, 0.008, 0.008, g));
          add(sph, GL, 0.07, 0.006, 0, 0, 0, 0, 0.06, 0.006, 0.02, jaw);
          // あし: 肩・ひざ・足首で曲げて、空を駆ける。足先に光
          const legs = [];
          mirror(bd, (g, sg) => {
            for (const fr of [1, 0]) {
              const hip = grp(g, fr ? 0.2 : -0.28, fr ? 0.54 : 0.55, fr ? 0.1 : 0.09);
              add(sph, M1, 0, 0, 0, 0, 0, 0, fr ? 0.075 : 0.09, fr ? 0.1 : 0.12, 0.06, hip);
              add(sw([[0, 0, 0], [fr ? 0.02 : -0.03, -0.1, 0], [0, -0.19, 0]], [0.07, 0.055, 0.04], { nv: 14 }), M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, hip);
              const kn = grp(hip, 0, -0.19, 0);
              add(sw([[0, 0, 0], [fr ? -0.01 : 0.03, -0.09, 0], [0, -0.18, 0]], [0.04, 0.032, 0.026], { nv: 12 }), M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, kn);
              add(tor(0.3), M2, 0, -0.1, 0, Math.PI / 2, 0, 0, 0.036, 0.036, 0.036, kn);
              const pw = grp(kn, 0, -0.18, 0);
              add(sph, M1, 0.03, -0.012, 0, 0, 0, 0, 0.05, 0.03, 0.04, pw);
              claws(pw, [0.06, -0.015, 0], [0.9, -0.4, 0], [0, 1, 0], 0.05, 3, 0.4);
              add(sph, GL, 0.02, -0.035, 0, 0, 0, 0, 0.035, 0.008, 0.03, pw);
              halo(pw, 0.02, -0.04, 0, 0.26, 0.5);
              legs.push([hip, kn, pw, fr, (fr ? 0 : 2.6) + (sg > 0 ? 0 : 0.7)]);
            }
          });
          anim.push(() => {
            for (const [hip, kn, pw, fr, p0] of legs) {
              const a = S.ph + p0;
              hip.rotation.z = Math.sin(a) * 0.6 + (fr ? 0.25 : -0.25);
              kn.rotation.z = (fr ? -1 : 1) * (0.35 + 0.35 * Math.sin(a + (fr ? 1.3 : -1.3)));
              pw.rotation.z = (fr ? 1 : -1) * 0.3 * Math.sin(a + 2);
            }
            // 駆けるたびに背中が伸び縮みする
            bd.rotation.z = Math.sin(S.ph + 0.5) * 0.07;
            hd.rotation.z = -Math.sin(S.ph + 0.5) * 0.1 - S.climb * 0.15 + 0.05;
            hd.rotation.y = S.turn * 0.25;
            jaw.rotation.z = -0.1 - Math.max(0, Math.sin(S.t * 1.5)) ** 3 * 0.3;
          });
          // ふさふさの尾
          chain(bd, -0.4, 0.6, 8, 0.065, (k) => 0.03 + 0.03 * Math.sin((k / 8) * Math.PI), M1, {
            bz: (k) => (k < 2 ? -0.35 : 0.08), az: 0.12, ay: 0.14, w: 4, pz: 0.6, lag: 0.06,
            each: (j, k, ra) => {
              for (let i = 0; i < 5; i++) {
                const a = (i / 5) * 6.2832 + k;
                put(tuftG, k > 4 ? MM : M1, [0, Math.cos(a) * ra * 0.7, Math.sin(a) * ra * 0.7], [-1, Math.cos(a) * 0.55, Math.sin(a) * 0.55], [0, Math.cos(a), Math.sin(a)], 0.06 + ra, 0.06 + ra, 0.04, j);
              }
            },
          });
        },
        insect() {
          S.w = 26;
          S.lift = 0.012;
          M1.clearcoat = 1;
          M1.roughness = 0.25;
          M1.metalness = 0.6;
          M1.iridescence = 0.8;
          const IW = PM({ color: lin(0xffffff).lerp(glow, 0.4), map: tex("wingI"), alphaMap: tex("wingI"), transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false, roughness: 0.15, metalness: 0, emissive: glow, emissiveIntensity: 0.5, emissiveMap: tex("wingI"), iridescence: 1 });
          // 胸・頭・角
          add(sw([[-0.1, 0.5, 0], [0.04, 0.52, 0], [0.2, 0.5, 0]], [0.09, 0.13, 0.075], { nv: 24, ez: 1.05 }), M1, 0, 0, 0);
          add(hemi, M2, 0.07, 0.56, 0, 0, 0, -0.15, 0.13, 0.1, 0.14); // 胸の盾
          add(tor(0.08), GL, 0.07, 0.565, 0, Math.PI / 2, 0, 0, 0.125, 0.135, 0.125).rotation.y = -0.15;
          const hd = grp(root, 0.24, 0.47, 0);
          add(sph, M1, 0.03, 0, 0, 0, 0, 0, 0.07, 0.06, 0.075, hd);
          const ME = PM({ color: glow.clone().multiplyScalar(0.4), emissive: glow, emissiveIntensity: 1.3, emissiveMap: tex("scale", 5, 4), bumpMap: tex("scale", 5, 4), bumpScale: 0.004, roughness: 0.15, clearcoat: 1 });
          mirror(hd, (g, sg) => {
            add(sph, ME, 0.06, 0.02, 0.05, 0, 0, 0, 0.04, 0.045, 0.036, g); // 複眼
            halo(g, 0.08, 0.02, 0.08, 0.16, 0.4);
            const md = grp(g, 0.08, -0.03, 0.03);
            put(hornG(0.16, 0.9, 0.08), M3, [0, 0, 0], [1, -0.15, 0.5], [0, 0, -1], 0.17, 0.17, 0.1, md); // 大あご
            anim.push(() => (md.rotation.y = Math.sin(S.t * 3) * 0.2 + 0.1));
            const an = grp(g, 0.06, 0.05, 0.03);
            an.rotation.set(0, -0.4, 0.7);
            chain(an, 0, 0, 9, 0.05, [0.007, 0.002], M2, { dir: 1, bz: () => -0.1, az: 0.1, ay: 0.1, w: 3.4, pz: 0.6, lag: 0.02, ph: sg });
          });
          add(sw([[0.2, 0.56, 0], [0.34, 0.63, 0], [0.47, 0.76, 0], [0.5, 0.9, 0]], [0.04, 0.03, 0.022, 0.012], { nv: 14 }), M2, 0, 0, 0); // 大きな角
          mirror(root, (g) => put(hornG(0.25, 0.7), M2, [0.5, 0.89, 0.0], [0.3, 0.6, 0.75], [1, 0, 0], 0.13, 0.13, 0.13, g));
          add(sph, GL, 0.5, 0.9, 0, 0, 0, 0, 0.016);
          halo(root, 0.5, 0.9, 0, 0.2, 0.5);
          // 腹: 節ごとに光る帯。先は針
          const rr = [0.095, 0.12, 0.125, 0.11, 0.09, 0.065, 0.04, 0.02];
          const ab = chain(root, -0.1, 0.5, 7, 0.078, (k) => rr[k], M1, {
            bz: () => 0.1, az: 0.05, ay: 0.04, w: 3, pz: 0.5, lag: 0.03,
            each: (j, k, ra) => {
              add(tor(0.06), GL, 0, 0, 0, 0, Math.PI / 2, 0, ra * 1.0, ra * 1.0, ra, j);
              add(tor(0.16), M2, -0.03, 0, 0, 0, Math.PI / 2, 0, ra * 0.98, ra * 0.98, ra * 0.98, j);
            },
          });
          put(hornG(0.3, -0.6), M3, [0, 0, 0], [-1, 0, 0], [0, 1, 0], 0.12, 0.12, 0.12, ab.tip);
          add(sph, GL, -0.11, -0.03, 0, 0, 0, 0, 0.012, 0.012, 0.012, ab.tip);
          // かたい前羽(開いて立てる)と、うすい後ろ羽(速くふるえる。残像を重ねる)
          mirror(root, (g, sg) => {
            g.userData.nb = true;
            const el = grp(g, 0.02, 0.6, 0.05);
            const elG = G("elytra", () => new THREE.SphereGeometry(1, 24, 12, 0, Math.PI));
            add(elG, GE, -0.27, 0, 0.02, Math.PI / 2, 0, 0, 0.3, 0.1, 0.06, el);
            add(elG, M2, -0.27, -0.004, 0.02, Math.PI / 2, 0, 0, 0.29, 0.095, 0.04, el);
            anim.push(() => (el.rotation.set(-0.9 + Math.sin(S.t * 9) * 0.03, 0.75, 0)));
            for (const [bx, L, d] of [[0.0, 0.62, 0.35], [-0.07, 0.48, 0.9]]) {
              const pv = grp(g, bx, 0.61, 0.05);
              pv.rotation.y = -d;
              const bl = [0, 0.4, 0.8].map((lagp) => add(G("iwing", () => {
                const pos = [], uv = [], idx = [];
                for (let i = 0; i <= 12; i++) {
                  const s = i / 12, w = 0.17 * Math.pow(Math.sin(Math.PI * Math.pow(s, 0.6)), 0.7);
                  pos.push(-w * 1.5, 0, s, w * 0.4, 0, s);
                  uv.push(0, s, 1, s);
                  if (i < 12) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 2, i * 2 + 1, i * 2 + 3);
                }
                return geoOf(pos, null, uv, idx);
              }), IW, 0, 0, 0, 0, 0, 0, L, L, L, pv));
              anim.push(() => bl.forEach((b, i) => (b.rotation.x = -0.35 - Math.sin(S.ph + d * 2 - i * 0.55) * 0.75)));
            }
            // 6本のあし(3節)
            for (let k = 0; k < 3; k++) {
              const l = limb(g, [0.14 - k * 0.11, 0.43, 0.07], [[0, 0, 0], [0.02 - k * 0.03, 0.02, 0.12], [0.04 - k * 0.06, -0.14, 0.17], [0.0 - k * 0.07, -0.26, 0.13]], [0.022, 0.018, 0.012, 0.006], M2, { nv: 10 });
              put(hornG(0.25, -0.8), M3, [0.0 - k * 0.07, -0.26, 0.13], [0.2, -1, -0.2], [1, 0, 0], 0.05, 0.05, 0.05, l);
              anim.push(() => ((l.rotation.x = Math.sin(S.t * 5 + k * 2 + sg) * 0.12), (l.rotation.z = Math.sin(S.t * 3.7 + k) * 0.1)));
            }
          });
          anim.push(() => (hd.rotation.z = Math.sin(S.t * 2) * 0.06));
        },
        knight() {
          S.w = 2.2;
          S.lift = 0.035;
          const fig = grp(root);
          fig.rotation.z = -0.3;
          const SW = PM({ color: lin(0xdfe6f0), metalness: 1, roughness: 0.14, clearcoat: 1, emissive: glow, emissiveIntensity: 0.12 });
          const CP = PM({ color: gold ? lin(0x8a1420) : base.clone().multiplyScalar(0.6).lerp(glow, 0.15), map: tex("cloth", 2, 1), bumpMap: tex("cloth", 2, 1), bumpScale: 0.004, side: THREE.DoubleSide, roughness: 0.75, metalness: 0, sheen: 1, emissive: glow, emissiveIntensity: 1.2, emissiveMap: tex("clothE", 2, 1) });
          // 胴よろい: 胸当て・腹の段(3枚)・腰の板
          add(sw([[0, 0.5, 0], [0, 0.6, 0], [0, 0.72, 0], [0, 0.82, 0]], [0.085, 0.078, 0.125, 0.085], { ey: 0.78, ez: 1.1, nv: 24 }), M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, fig);
          add(sph, GE, 0.035, 0.725, 0, 0, 0, 0, 0.085, 0.085, 0.12, fig);
          for (let k = 0; k < 3; k++) add(tor(0.16), M2, 0, 0.635 - k * 0.045, 0, Math.PI / 2, 0, 0, 0.066 + k * 0.006, 0.086 + k * 0.007, 0.07, fig);
          add(sph, GL, 0.112, 0.735, 0, 0, 0, 0, 0.014, 0.024, 0.024, fig);
          add(tor(0.25), M2, 0.112, 0.735, 0, 0, Math.PI / 2, 0, 0.03, 0.03, 0.03, fig);
          halo(fig, 0.13, 0.735, 0, 0.22, 0.5);
          add(tor(0.3), M2, 0, 0.855, 0, Math.PI / 2, 0, 0, 0.05, 0.06, 0.05, fig); // のど当て
          for (let k = 0; k < 6; k++) {
            const a = (k / 6) * 6.2832 + 0.52;
            add(hemi, k % 2 ? M2 : M1, Math.cos(a) * 0.07, 0.5, Math.sin(a) * 0.09, Math.PI + Math.sin(a) * 0.35, 0, -Math.cos(a) * 0.35, 0.045, 0.12, 0.055, fig); // 腰の板
          }
          // かぶと: 面ぼおの光るすき間・とさか・羽かざり
          const hd = grp(fig, 0.01, 0.93, 0);
          add(sph, M1, 0, 0, 0, 0, 0, 0, 0.078, 0.084, 0.074, hd);
          add(sw([[0.02, -0.06, 0], [0.065, -0.03, 0], [0.085, 0.0, 0]], [0.05, 0.05, 0.03], { nv: 16, ey: 1, ez: 1.25 }), M2, 0, 0, 0, 0, 0, 0, 1, 1, 1, hd); // 面ぼお
          add(tor(0.085, 2.3), GL, 0.012, 0.012, 0, Math.PI / 2, 0, 0, 0.073, 0.07, 0.07, hd).rotation.z = -1.15;
          halo(hd, 0.09, 0.012, 0, 0.2, 0.5);
          add(ext("kcrest", [[0.07, 0.03], [0.04, 0.1], [-0.04, 0.125], [-0.11, 0.09], [-0.14, 0.02], [-0.07, 0.06], [0, 0.07]], 0.006, 0.006, 40), M2, 0, 0, 0, 0, 0, 0, 1, 1, 1, hd);
          mirror(hd, (g) => put(ext("kwing", [[0, 0], [0.02, 0.05], [-0.06, 0.13], [-0.03, 0.06], [-0.1, 0.07], [-0.04, 0.02], [-0.07, -0.01]], 0.003, 0.004), gold ? M2 : GE, [0, 0.02, 0.07], [1, 0.2, -0.25], [0, 1, 0], 1, 1, 1, g)); // 耳の羽かざり
          const pl = grp(hd, -0.1, 0.09, 0);
          pl.userData.nb = true;
          add(G("kplume", () => merge([0, 1, 2, 3, 4].map((k) => [featherG, bas([0, 0, 0], [-1, 0.5 - k * 0.22, 0], [0.3, 1, 0], 0.3 - k * 0.02, 0.3, 0.3)]))), FT2, 0, 0, 0, 0, 0, 0, 1, 1, 1, pl);
          anim.push(() => (pl.rotation.z = Math.sin(S.t * 5) * 0.08 - 0.1));
          // 肩当て(3段)・腕・こて
          const arm = (sg) => {
            const g = grp(fig);
            g.scale.z = sg;
            for (let k = 0; k < 3; k++) add(hemi, k === 1 ? GE : M2, 0, 0.81 - k * 0.03, 0.165 + k * 0.028, 0.75 + k * 0.3, 0, 0, 0.09 - k * 0.012, 0.06, 0.09 - k * 0.01, g);
            put(hornG(0.2, 0.4), M2, [0, 0.86, 0.17], [-0.1, 0.7, 0.7], [0, 1, 0], 0.08, 0.08, 0.08, g);
            const sh = grp(g, 0, 0.79, 0.19);
            add(sw([[0, 0, 0], [0.005, -0.08, 0.005], [0.01, -0.16, 0]], [0.042, 0.044, 0.036], { nv: 14 }), M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, sh);
            const el = grp(sh, 0.01, -0.16, 0);
            add(sph, M2, 0, 0, 0, 0, 0, 0, 0.044, 0.044, 0.044, el);
            add(sw([[0, 0, 0], [0.07, -0.01, 0], [0.15, -0.01, 0]], [0.036, 0.048, 0.034], { nv: 14 }), M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, el);
            add(tor(0.22), GL, 0.075, -0.01, 0, 0, Math.PI / 2, 0, 0.046, 0.046, 0.046, el);
            add(sph, M2, 0.18, -0.01, 0, 0, 0, 0, 0.04, 0.036, 0.04, el); // にぎりこぶし
            return { g, sh, el };
          };
          const ar = arm(1), al = arm(-1);
          // 大剣: 光るみぞ・つば・柄頭
          const sword = grp(ar.el, 0.18, -0.01, 0);
          sword.rotation.set(0, 0, 0.9);
          add(ext("kblade", [[0, -0.032], [0.5, -0.026], [0.66, 0], [0.5, 0.026], [0, 0.032]], 0.002, 0.008), SW, 0.04, 0, 0, 0, 0, 0, 1, 1, 1, sword);
          add(boxG, GL, 0.3, 0, 0, 0, 0, 0, 0.48, 0.008, 0.02, sword);
          add(sw([[0.03, -0.1, 0], [0.045, -0.05, 0], [0.04, 0, 0], [0.045, 0.05, 0], [0.03, 0.1, 0]], [0.008, 0.016, 0.022, 0.016, 0.008], { nv: 10 }), M2, 0, 0, 0, 0, 0, 0, 1, 1, 1, sword);
          add(sph, GL, 0.042, 0, 0, 0, 0, 0, 0.016, 0.016, 0.026, sword);
          add(cylG, BK, -0.04, 0, 0, 0, 0, Math.PI / 2, 0.014, 0.14, 0.014, sword);
          add(sph, M2, -0.12, 0, 0, 0, 0, 0, 0.024, 0.024, 0.024, sword);
          halo(sword, 0.68, 0, 0, 0.25, 0.5);
          // 盾: ふちどり・中央の紋
          const shd = grp(al.el, 0.1, -0.02, 0.07);
          shd.rotation.set(0.15, 0, 1.2);
          add(ext("kshield", [[0, 0.17], [0.11, 0.15], [0.13, 0.02], [0.08, -0.12], [0, -0.21], [-0.08, -0.12], [-0.13, 0.02], [-0.11, 0.15]], 0.012, 0.01, 48), M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, shd);
          add(ext("kshield2", [[0, 0.13], [0.08, 0.115], [0.095, 0.02], [0.06, -0.09], [0, -0.16], [-0.06, -0.09], [-0.095, 0.02], [-0.08, 0.115]], 0.012, 0.006, 48), GE, 0, 0, 0.012, 0, 0, 0, 1, 1, 1, shd);
          add(sph, M2, 0, 0.0, 0.02, 0, 0, 0, 0.04, 0.04, 0.025, shd);
          add(sph, GL, 0, 0.0, 0.04, 0, 0, 0, 0.018, 0.018, 0.012, shd);
          add(tor(0.1), GL, 0, 0, 0.026, 0, 0, 0, 0.062, 0.062, 0.062, shd);
          // 脚: もも当て・ひざ当て・すね当て・とがった鉄ぐつ。足の裏から光を噴く
          const legs = [];
          for (const sg of [1, -1]) {
            const hip = grp(fig, 0, 0.5, sg * 0.062);
            add(sw([[0, 0, 0], [0.015, -0.1, 0], [0, -0.2, 0]], [0.062, 0.06, 0.044], { nv: 16 }), M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, hip);
            const kn = grp(hip, 0, -0.2, 0);
            add(sph, M2, 0.012, 0, 0, 0, 0, 0, 0.05, 0.05, 0.048, kn);
            put(hornG(0.3, 0.3), M2, [0.05, 0.0, 0], [1, 0.5, 0], [0, 1, 0], 0.06, 0.06, 0.06, kn);
            add(sw([[0, 0, 0], [-0.015, -0.1, 0], [0, -0.2, 0]], [0.042, 0.05, 0.03], { nv: 16 }), M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, kn);
            add(tor(0.2), GL, 0, -0.035, 0, Math.PI / 2, 0, 0, 0.044, 0.044, 0.044, kn);
            add(sw([[-0.03, -0.2, 0], [0.03, -0.235, 0], [0.11, -0.24, 0]], [0.03, 0.036, 0.008], { nv: 12, ey: 0.7 }), M2, 0, 0, 0, 0, 0, 0, 1, 1, 1, kn);
            const jet = add(G("jet", () => new THREE.ConeGeometry(1, 1, 16, 1, true).rotateX(Math.PI).translate(0, -0.5, 0)), GL, 0, -0.25, 0, 0, 0, 0, 0.025, 0.16, 0.025, kn);
            jet.userData.nb = true;
            halo(kn, 0, -0.27, 0, 0.3, 0.5);
            legs.push([hip, kn, jet, sg]);
          }
          // マント(風になびく)
          const cape = sheet(12, 14, (u, v, t, out) => {
            const w = Math.sin(t * 5 - v * 6 + u * 2.5) * 0.04 * v + Math.sin(t * 3.1 - v * 3.5 - u * 3) * 0.03 * v;
            out[0] = -0.075 - v * 0.42 - Math.sin(u * Math.PI) * 0.03 * (1 - v);
            out[1] = 0.845 - v * 0.33 - v * v * 0.12 + w + S.climb * -0.1 * v * v;
            out[2] = (u - 0.5) * (0.27 + v * 0.3) + Math.sin(t * 4 - v * 5) * 0.02 * v;
          });
          add(cape.g, CP, 0, 0, 0, 0, 0, 0, 1, 1, 1, fig).userData.nb = true;
          anim.push(() => {
            cape.upd(S.t);
            for (const [hip, kn, jet, sg] of legs) {
              hip.rotation.z = -0.15 + sg * 0.22 + Math.sin(S.t * 1.6 + sg) * 0.06;
              kn.rotation.z = -0.5 - sg * 0.2;
              jet.scale.y = 0.14 + Math.sin(S.t * 31 + sg) * 0.03 + S.climb * 0.08;
            }
            fig.rotation.z = -0.3 - S.climb * 0.1;
            hd.rotation.z = 0.22 + Math.sin(S.t * 0.9) * 0.04;
            hd.rotation.y = Math.sin(S.t * 0.6) * 0.2 + S.turn * 0.3;
            ar.sh.rotation.set(0.25, 0, 0.5 + Math.sin(S.t * 1.8) * 0.1);
            ar.el.rotation.z = 0.35 + Math.sin(S.t * 1.8 + 0.6) * 0.12;
            al.sh.rotation.set(0.2, 0, 0.3 + Math.sin(S.t * 1.5 + 2) * 0.06);
            al.el.rotation.z = 0.5;
          });
        },
        golem() {
          S.w = 1.4;
          S.lift = 0.04;
          const rk = tex("rock", 2, 2), rkE = tex("rockE", 2, 2);
          const MR = PM({ color: base.clone().lerp(lin(0x9a948c), 0.6).multiplyScalar(1.2), map: rk, bumpMap: rk, bumpScale: 0.02, roughness: 0.85, metalness: 0.05, clearcoat: 0, emissive: glow, emissiveIntensity: 2.4, emissiveMap: rkE });
          const MX = PM({ color: glow, emissive: glow, emissiveIntensity: 0.7, roughness: 0.08, metalness: 0, clearcoat: 1, flatShading: true, transparent: true, opacity: 0.9 });
          // 胴・腰・頭(岩)。胸に核と金具
          add(boulder(1), MR, 0, 0.64, 0, 0, 0, 0, 0.25, 0.23, 0.24);
          add(boulder(2), MR, -0.03, 0.4, 0, 0, 0, 0, 0.15, 0.11, 0.15);
          const core = add(sph, GL, 0.2, 0.64, 0, 0, 0, 0, 0.06, 0.075, 0.075);
          add(tor(0.2), M2, 0.215, 0.64, 0, 0, Math.PI / 2, 0, 0.09, 0.09, 0.09);
          const rn = add(annulus(0.7), RN, 0.25, 0.64, 0, 0, 0, Math.PI / 2, 0.16, 0.16, 0.16);
          const hc = halo(root, 0.27, 0.64, 0, 0.5, 0.6);
          const hd = grp(root, 0.08, 0.93, 0);
          add(boulder(3), MR, 0, 0, 0, 0, 0, 0, 0.12, 0.1, 0.11, hd);
          add(boulder(4), MR, 0.04, -0.085, 0, 0, 0, 0, 0.085, 0.045, 0.08, hd); // あご
          add(sph, BK, 0.085, 0.0, 0, 0, 0, 0, 0.03, 0.03, 0.085, hd);
          add(sph, GL, 0.1, 0.0, 0, 0, 0, 0, 0.02, 0.016, 0.07, hd); // ひとつ目のすき間
          halo(hd, 0.13, 0, 0, 0.3, 0.6);
          for (let k = 0; k < 5; k++) xt(hd, MX, [-0.03 - Math.abs(k - 2) * 0.01, 0.08, (k - 2) * 0.04], [-0.3, 1, (k - 2) * 0.3], 0.2 - Math.abs(k - 2) * 0.04, 0.022); // 結晶の冠
          for (let k = 0; k < 6; k++) xt(root, MX, [-0.2, 0.6 + rnd(k) * 0.2, (rnd(k + 3) - 0.5) * 0.3], [-1, 0.6 + rnd(k + 5), (rnd(k + 3) - 0.5) * 1.2], 0.2 + rnd(k + 7) * 0.16, 0.03 + rnd(k + 9) * 0.02); // 背の結晶
          // 肩と、宙に浮く腕・こぶし
          const arms = [];
          mirror(root, (g, sg) => {
            add(boulder(5), MR, 0, 0.8, 0.3, 0, 0, 0, 0.14, 0.12, 0.14, g);
            xt(g, MX, [0, 0.88, 0.33], [-0.2, 1, 0.5], 0.2, 0.03);
            xt(g, MX, [-0.05, 0.86, 0.26], [-0.5, 1, 0.1], 0.14, 0.022);
            const a = grp(g, 0.03, 0.58, 0.4);
            add(boulder(6), MR, 0, 0, 0, 0, 0, 0, 0.085, 0.11, 0.085, a);
            const f = grp(a, 0.1, -0.2, 0.03);
            add(boulder(7), MR, 0, 0, 0, 0, 0, 0, 0.13, 0.15, 0.13, f);
            for (let k = 0; k < 4; k++) add(boulder(8), MR, 0.1, -0.1, (k - 1.5) * 0.06, 0, 0, 0, 0.05, 0.06, 0.035, f); // 指
            add(boulder(8), MR, 0.06, 0.0, -0.13, 0, 0, 0, 0.045, 0.055, 0.04, f);
            const wr = add(annulus(0.75), RN, 0, 0.1, 0, 0, 0, 0, 0.19, 0.19, 0.19, f);
            add(tor(0.07), M2, 0, 0.13, 0, Math.PI / 2, 0, 0, 0.1, 0.1, 0.1, f);
            arms.push([a, f, wr, sg]);
          });
          // 腰の下: 回りながら浮く岩のかけら
          const sh = [];
          for (let k = 0; k < 6; k++) sh.push(add(boulder(9 + (k % 3)), MR, 0, 0, 0, rnd(k) * 3, rnd(k + 1) * 3, 0, 0.05 + rnd(k + 2) * 0.03, 0.09 + rnd(k + 3) * 0.05, 0.05 + rnd(k + 4) * 0.03));
          const belt = add(annulus(0.8), RN, -0.03, 0.42, 0, 0, 0, 0, 0.28, 0.28, 0.28);
          anim.push(() => {
            const t = S.t;
            core.scale.setScalar(0.065 + Math.sin(t * 3) * 0.008);
            hc.scale.setScalar(0.5 + Math.sin(t * 3) * 0.08);
            rn.rotation.x = t * 0.9;
            belt.rotation.y = -t * 0.6;
            hd.rotation.y = Math.sin(t * 0.6) * 0.25 + S.turn * 0.3;
            hd.position.y = 0.93 + Math.sin(t * 1.4 + 1) * 0.012;
            for (const [a, f, wr, sg] of arms) {
              a.position.y = 0.58 + Math.sin(t * 1.4 + sg) * 0.025;
              a.rotation.z = Math.sin(t * 1.1 + sg * 1.5) * 0.18 - S.climb * 0.2;
              f.position.y = -0.2 + Math.sin(t * 1.4 + sg + 1) * 0.02;
              f.rotation.z = Math.sin(t * 1.3 + sg) * 0.2 + 0.2;
              wr.rotation.y = t * 1.5 * sg;
            }
            sh.forEach((o, k) => {
              const a = (k / 6) * 6.2832 + t * 0.7;
              o.position.set(Math.cos(a) * (0.1 + (k % 2) * 0.08) - 0.03, 0.2 - (k % 3) * 0.06 + Math.sin(t * 1.7 + k) * 0.025, Math.sin(a) * (0.1 + (k % 2) * 0.08));
              o.rotation.y = t * 0.5 + k;
            });
          });
        },
        machine() {
          S.w = 3.1;
          S.lift = 0.02;
          const GLS = PM({ color: glow.clone().multiplyScalar(0.5), emissive: glow, emissiveIntensity: 1.1, roughness: 0.02, metalness: 0, clearcoat: 1, clearcoatRoughness: 0 });
          // 機体: 胴・背の放熱ひれ・光る筋
          const HP = [[-0.34, 0.55, 0], [-0.18, 0.56, 0], [0.04, 0.56, 0], [0.24, 0.55, 0], [0.34, 0.54, 0]], HR = [0.05, 0.115, 0.14, 0.1, 0.065];
          add(sw(HP, HR, { nv: 28, ey: 0.85 }), M1, 0, 0, 0);
          add(sw(HP.map((p) => [p[0] * 0.8, p[1] + 0.012, 0]), HR.map((r) => r * 0.93), { nv: 24, ey: 0.85, ez: 0.8 }), GE, 0, 0, 0);
          add(G("mfins", () => merge([0, 1, 2, 3, 4, 5, 6].map((k) => [boxG, new THREE.Matrix4().makeScale(0.012, 0.05 - Math.abs(k - 2.5) * 0.006, 0.1).setPosition(-0.2 + k * 0.035, 0.675, 0)]))), M2, 0, 0, 0);
          mirror(root, (g) => add(sw(HP.map((p, i) => [p[0], p[1], HR[i] * 1.0]), [0.002, 0.01, 0.011, 0.01, 0.002], { nv: 8 }), GL, 0, 0, 0, 0, 0, 0, 1, 1, 1, g));
          // 機首の目(レンズ): 輪を重ねた中に光る玉
          const eyeG = grp(root, 0.36, 0.54, 0);
          for (let k = 0; k < 3; k++) add(tor(0.16), k === 1 ? GL : M2, k * 0.02, 0, 0, 0, Math.PI / 2, 0, 0.075 - k * 0.012, 0.075 - k * 0.012, 0.06, eyeG);
          add(sph, GLS, 0.03, 0, 0, 0, 0, 0, 0.05, 0.05, 0.05, eyeG);
          add(sph, BK, 0.07, 0, 0, 0, 0, 0, 0.014, 0.022, 0.022, eyeG);
          halo(eyeG, 0.09, 0, 0, 0.4, 0.6);
          anim.push(() => ((eyeG.rotation.y = Math.sin(S.t * 0.9) * 0.3 + S.turn * 0.3), (eyeG.rotation.z = Math.sin(S.t * 1.3) * 0.15)));
          // 胴をかこむ2重の輪(逆向きに回る)。歯のような突起つき
          const rings = [0.21, 0.26].map((r, i) => {
            const g = grp(root, -0.02, 0.56, 0);
            add(tor(0.07), i ? GE : M2, 0, 0, 0, 0, Math.PI / 2, 0, r, r, r, g);
            add(G("mteeth", () => merge(Array.from({ length: 16 }, (_, k) => [boxG, new THREE.Matrix4().makeRotationX((k / 16) * 6.2832).multiply(new THREE.Matrix4().makeTranslation(0, 1.08, 0)).multiply(new THREE.Matrix4().makeScale(0.2, 0.14, 0.16))]))), M2, 0, 0, 0, 0, 0, 0, r, r, r, g);
            g.userData.nb = true;
            return g;
          });
          anim.push(() => (rings[0].rotation.set(S.t * 1.7, 0, 0.25), rings[1].rotation.set(-S.t * 1.1, 0.5, -0.2)));
          // 左右の推進器: 吸気口の輪・噴射の炎・翼
          const pods = [];
          mirror(root, (g, sg) => {
            add(sw([[0, 0.58, 0.1], [-0.02, 0.6, 0.22], [-0.04, 0.58, 0.32]], [0.03, 0.022, 0.03], { nv: 10 }), M2, 0, 0, 0, 0, 0, 0, 1, 1, 1, g);
            const pd = grp(g, -0.05, 0.57, 0.36);
            add(sw([[-0.24, 0, 0], [-0.1, 0, 0], [0.06, 0, 0], [0.17, 0, 0]], [0.04, 0.075, 0.07, 0.045], { nv: 20 }), M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, pd);
            add(tor(0.14), M2, 0.17, 0, 0, 0, Math.PI / 2, 0, 0.05, 0.05, 0.05, pd);
            add(sph, BK, 0.165, 0, 0, 0, 0, 0, 0.02, 0.042, 0.042, pd);
            add(tor(0.1), GL, -0.02, 0, 0, 0, Math.PI / 2, 0, 0.076, 0.076, 0.076, pd);
            add(tor(0.18), M2, -0.24, 0, 0, 0, Math.PI / 2, 0, 0.044, 0.044, 0.044, pd);
            const fl = add(G("jetx", () => new THREE.ConeGeometry(1, 1, 16, 1, true).rotateZ(Math.PI / 2).translate(-0.5, 0, 0)), GL, -0.24, 0, 0, 0, 0, 0, 0.2, 0.036, 0.036, pd);
            fl.userData.nb = true;
            halo(pd, -0.28, 0, 0, 0.3, 0.6);
            // 翼(後退翼)と小さい前翼。ふちが光る
            const wg = grp(pd, -0.02, 0, 0.06);
            wg.userData.nb = true;
            add(ext("mwing", [[0.1, 0], [0.02, 0.42], [-0.12, 0.5], [-0.2, 0.46], [-0.13, 0.2], [-0.16, 0]], 0.012, 0.008), M1, 0, 0, 0, Math.PI / 2, 0, 0, 1, 1, 1, wg);
            add(ext("mwing2", [[0.06, 0.03], [0.0, 0.36], [-0.08, 0.4], [-0.06, 0.03]], 0.012, 0.004), GE, 0, 0.008, 0, Math.PI / 2, 0, 0, 1, 1, 1, wg);
            add(sw([[0.1, 0, 0], [0.02, 0, 0.42], [-0.12, 0, 0.5]], [0.008, 0.008, 0.008], { nv: 6 }), GL, 0, 0, 0, 0, 0, 0, 1, 1, 1, wg);
            add(ext("mcanard", [[0.06, 0], [0.0, 0.16], [-0.05, 0.16], [-0.04, 0]], 0.008, 0.005), M2, 0.18, 0.55, 0.1, Math.PI / 2 - 0.2, 0, 0, 1, 1, 1, g);
            pods.push([pd, fl, wg, sg]);
          });
          // 尾翼(V字)・アンテナ・腹の下のつかみ腕
          mirror(root, (g) => add(ext("mtail", [[0.06, 0], [-0.04, 0.2], [-0.12, 0.2], [-0.08, 0]], 0.008, 0.005), M2, -0.3, 0.6, 0.02, -0.5, 0, 0, 1, 1, 1, g));
          add(cylG, M2, -0.1, 0.76, 0, 0, 0, -0.3, 0.004, 0.2, 0.004);
          const bl = add(sph, GL, -0.07, 0.86, 0, 0, 0, 0, 0.012);
          const arms = [];
          mirror(root, (g, sg) => {
            const a = limb(g, [0.12, 0.45, 0.06], [[0, 0, 0], [0.06, -0.1, 0.02], [0.16, -0.12, 0.02]], [0.022, 0.018, 0.016], M2, { nv: 10 });
            add(sph, GL, 0.06, -0.1, 0.02, 0, 0, 0, 0.022, 0.022, 0.022, a);
            claws(a, [0.16, -0.12, 0.02], [1, -0.2, 0], [0, 1, 0], 0.08, 3, 0.7, M2);
            arms.push([a, sg]);
          });
          anim.push(() => {
            bl.visible = Math.sin(S.t * 6) > 0;
            for (const [pd, fl, wg, sg] of pods) {
              pd.rotation.z = Math.sin(S.t * 1.3 + sg) * 0.06 + S.climb * 0.3;
              fl.scale.x = 0.16 + Math.sin(S.t * 37 + sg) * 0.03 + Math.max(0, S.climb) * 0.14;
              wg.rotation.x = Math.sin(S.t * 2.1 + sg) * 0.08 - 0.12 - S.turn * sg * 0.15;
            }
            for (const [a, sg] of arms) a.rotation.z = Math.sin(S.t * 1.7 + sg) * 0.2 - 0.2;
          });
        },
        mage() {
          S.w = 1.8;
          S.lift = 0.04;
          const fig = grp(root);
          fig.rotation.z = -0.14;
          const C1 = CL();
          // 衣(すそがなびく)・胴・帯・肩かけ・高いえり
          robe(fig, C1, 0.64, 0.62, 0.095, 0.27, 0.16, 7);
          add(sw([[0, 0.6, 0], [0, 0.7, 0], [0, 0.82, 0]], [0.1, 0.11, 0.08], { nv: 20, ey: 0.85 }), M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, fig);
          add(tor(0.18), M2, 0, 0.63, 0, Math.PI / 2, 0, 0, 0.088, 0.1, 0.1, fig);
          add(gemG, GL, 0.1, 0.63, 0, 0, 0, 0, 0.022, 0.07, 0.022, fig);
          halo(fig, 0.12, 0.63, 0, 0.2, 0.5);
          add(sw([[0, 0.87, 0], [0, 0.82, 0], [0, 0.75, 0]], [0.06, 0.17, 0.21], { nv: 24, nu: 16 }), M2, 0, 0, 0, 0, 0, 0, 1, 1, 1, fig);
          add(tor(0.03), GL, 0, 0.752, 0, Math.PI / 2, 0, 0, 0.205, 0.205, 0.205, fig);
          add(G("mcollar", () => new THREE.CylinderGeometry(0.15, 0.08, 0.17, 24, 4, true, Math.PI * 0.75, Math.PI * 1.5)), PM({ color: M2.color, map: pt, metalness: 0.9, roughness: 0.3, side: THREE.DoubleSide }), 0, 0.92, 0, 0, 0, 0, 1, 1, 1, fig);
          // 頭巾(先がたれる)。中は暗く、目だけが光る
          const hd = grp(fig, 0.01, 0.94, 0);
          add(sph, M1, 0, 0, 0, 0, 0, 0, 0.088, 0.095, 0.085, hd);
          add(sw([[-0.02, 0.06, 0], [-0.1, 0.1, 0], [-0.19, 0.06, 0], [-0.22, -0.02, 0]], [0.065, 0.045, 0.022, 0.003], { nv: 14 }), M1, 0, 0, 0, 0, 0, 0, 1, 1, 1, hd);
          add(sph, BK, 0.035, -0.008, 0, 0, 0, 0, 0.066, 0.07, 0.064, hd);
          add(tor(0.14), M2, 0.04, -0.005, 0, 0, Math.PI / 2, 0, 0.07, 0.076, 0.07, hd);
          mirror(hd, (g) => (add(sph, GL, 0.092, 0.0, 0.027, 0.3, 0, 0, 0.009, 0.009, 0.02, g), halo(g, 0.1, 0, 0.03, 0.05, 0.6)));
          const crown = [0, 1, 2, 3, 4].map((k) => add(gemG, GL, 0, 0, 0, 0, 0, 0, 0.01, 0.06, 0.01, hd));
          // そで(口が広い)と手
          const arm = (sg, rz, rx) => {
            const sh = grp(fig, 0, 0.8, sg * 0.14);
            sh.rotation.set(rx * sg, 0, rz);
            add(sw([[0, 0, 0], [0.08, -0.04, 0], [0.19, -0.04, 0]], [0.05, 0.058, 0.085], { nv: 18 }), C1, 0, 0, 0, 0, 0, 0, 1, 1, 1, sh);
            add(sph, BK, 0.18, -0.04, 0, 0, 0, 0, 0.015, 0.07, 0.07, sh);
            add(sph, M3, 0.22, -0.04, 0, 0, 0, 0, 0.03, 0.022, 0.026, sh);
            for (let k = 0; k < 4; k++) put(hornG(0.14, -0.5), M3, [0.235, -0.035, (k - 1.5) * 0.013], [1, 0.1, (k - 1.5) * 0.15], [0, 1, 0], 0.05, 0.05, 0.05, sh);
            return sh;
          };
          const ar = arm(1, 0.5, 0.3), al = arm(-1, 0.15, 0.5);
          // 杖: 三日月の先に光る玉
          const st = grp(ar, 0.24, -0.04, 0);
          st.rotation.z = -0.4;
          add(sw([[0, -0.5, 0], [0.01, -0.2, 0], [0, 0.1, 0], [0, 0.34, 0]], [0.008, 0.014, 0.013, 0.016], { nv: 10, rf: (u) => 1 + 0.25 * Math.max(0, Math.sin(u * 40)) ** 6 }, "staff"), M2, 0, 0, 0, 0, 0, 0, 1, 1, 1, st);
          add(tor(0.14, 4.4), M2, 0, 0.43, 0, 0, 0, 0, 0.09, 0.09, 0.09, st).rotation.z = -0.63;
          const orb = add(sph, GL, 0, 0.43, 0, 0, 0, 0, 0.045, 0.045, 0.045, st);
          const oh = halo(st, 0, 0.43, 0, 0.5, 0.6);
          const sat = [0, 1, 2].map(() => add(gemG, GL, 0, 0, 0, 0, 0, 0, 0.008, 0.045, 0.008, st));
          // 宙に浮く魔導書(表紙がゆっくり開閉する)
          const bk = grp(fig, 0.3, 0.62, -0.2);
          bk.userData.nb = true;
          const cov = [1, -1].map((s) => {
            const g = grp(bk);
            add(boxG, M2, 0, 0, s * 0.055, 0, 0, 0, 0.14, 0.012, 0.1, g);
            add(boxG, M3, 0, 0.012, s * 0.052, 0, 0, 0, 0.125, 0.014, 0.09, g);
            add(boxG, GL, 0, 0.0205, s * 0.052, 0, 0, 0, 0.08, 0.001, 0.05, g);
            return [g, s];
          });
          halo(bk, 0, 0.05, 0, 0.3, 0.4);
          // 足もとの魔法陣と、体をめぐる輪
          const circ = [[0.45, 0.02, 0.8], [0.3, 0.02, -1.3]].map(([r, y, sp]) => [add(annulus(0.82), RN, -0.05, y, 0, 0, 0, 0, r, r, r), sp]);
          const rg = [0, 1].map((k) => add(annulus(0.88), RN, 0, 0.5, 0, 0, 0, 0, 0.36 + k * 0.06, 0.36, 0.36 + k * 0.06));
          circ.concat(rg.map((r) => [r, 0])).forEach(([o]) => (o.userData.nb = true));
          anim.push(() => {
            const t = S.t;
            orb.scale.setScalar(0.045 + Math.sin(t * 4) * 0.007);
            oh.scale.setScalar(0.5 + Math.sin(t * 4) * 0.1);
            sat.forEach((o, k) => (o.position.set(Math.cos(t * 2.5 + k * 2.1) * 0.1, 0.43 + Math.sin(t * 1.7 + k) * 0.03, Math.sin(t * 2.5 + k * 2.1) * 0.1), (o.rotation.y = t * 3)));
            crown.forEach((o, k) => o.position.set(Math.cos(t * 1.2 + k * 1.2566) * 0.1 - 0.01, 0.15 + Math.sin(t * 2 + k) * 0.012, Math.sin(t * 1.2 + k * 1.2566) * 0.1));
            for (const [o, sp] of circ) o.rotation.y = t * sp;
            rg.forEach((o, k) => (o.rotation.set(0.5 * Math.sin(t * 0.7 + k * 2), t * (k ? -1.3 : 1), 0.45 * Math.cos(t * 0.6 + k)), (o.position.y = 0.5 + k * 0.15)));
            for (const [g, s] of cov) g.rotation.x = s * (-0.35 - Math.sin(t * 1.3) * 0.15);
            bk.position.y = 0.62 + Math.sin(t * 1.6) * 0.03;
            bk.rotation.y = 0.5 + Math.sin(t * 0.8) * 0.2;
            fig.rotation.z = -0.14 - S.climb * 0.1;
            hd.rotation.y = Math.sin(t * 0.7) * 0.2 + S.turn * 0.3;
            ar.rotation.z = 0.5 + Math.sin(t * 1.5) * 0.08;
            al.rotation.z = 0.15 + Math.sin(t * 1.6 + 1) * 0.1;
          });
        },
        spirit() {
          const dk = m.race === "悪魔" || (m.attr === "闇" && m.race !== "天使" && m.race !== "アンデット"), an = !dk && (m.race === "天使" || m.attr === "光");
          S.w = dk ? 5.6 : an ? 4.4 : 1.7;
          S.lift = dk || an ? 0.06 : 0.04;
          const fig = grp(root);
          fig.rotation.z = -0.2;
          const C1 = CL();
          // ぼろぼろの衣(先は細くなって後ろへ流れる)。あばら骨の中で核が光る
          robe(fig, C1, 0.66, 0.66, 0.1, 0.2, 0.32, 6, 0.78);
          add(sw([[0, 0.6, 0], [0, 0.72, 0], [0, 0.83, 0]], [0.07, 0.095, 0.075], { nv: 20, ey: 0.8 }), BK, 0, 0, 0, 0, 0, 0, 1, 1, 1, fig);
          for (let k = 0; k < 4; k++) add(tor(0.11, 5.0), an ? M2 : M3, 0, 0.8 - k * 0.045, 0, Math.PI / 2, 0, 0, 0.1 - k * 0.006, 0.125 - k * 0.008, 0.1, fig).rotation.z = 0.64 + Math.PI; // あばら
          const core = add(sph, GL, 0.02, 0.73, 0, 0, 0, 0, 0.04, 0.05, 0.04, fig);
          const hc = halo(fig, 0.06, 0.73, 0, 0.45, 0.6);
          add(sw([[0, 0.87, 0], [0, 0.83, 0], [0, 0.78, 0]], [0.05, 0.14, 0.17], { nv: 24, nu: 14 }), an ? M2 : C1, 0, 0, 0, 0, 0, 0, 1, 1, 1, fig); // 肩
          const hd = grp(fig, 0.02, 0.95, 0);
          // 細い腕と長い指
          const arms = [];
          mirror(fig, (g, sg) => {
            const sh = grp(g, 0, 0.82, 0.15);
            add(sw([[0, 0, 0], [0.04, -0.11, 0.02], [0.16, -0.14, 0.0]], [0.03, 0.024, 0.02], { nv: 12 }), an ? M1 : M3, 0, 0, 0, 0, 0, 0, 1, 1, 1, sh);
            add(sph, an ? M2 : M3, 0.04, -0.11, 0.02, 0, 0, 0, 0.03, 0.03, 0.03, sh);
            if (an) add(tor(0.25), M2, 0.12, -0.132, 0.005, 0, Math.PI / 2, 0, 0.026, 0.026, 0.026, sh).rotation.z = -0.2;
            for (let k = 0; k < 4; k++) put(hornG(0.1, -0.7), an ? M2 : M3, [0.16, -0.14, (k - 1.5) * 0.012], [1, -0.1, (k - 1.5) * 0.25], [0, 1, 0], dk ? 0.14 : 0.09, 0.09, 0.09, sh);
            arms.push([sh, sg]);
          });
          if (dk) {
            // 悪魔: 骨の面・巻いた角・膜の翼・先のとがった尾
            add(sph, M3, 0, 0, 0, 0, 0, 0, 0.078, 0.085, 0.072, hd);
            add(sw([[0.03, -0.04, 0], [0.08, -0.05, 0], [0.12, -0.06, 0]], [0.045, 0.04, 0.024], { nv: 14, ey: 0.8 }), M3, 0, 0, 0, 0, 0, 0, 1, 1, 1, hd);
            add(G("dteeth", () => merge([-2, -1, 0, 1, 2].map((k) => [tooth, bas([0.115 - Math.abs(k) * 0.012, -0.075, k * 0.011], [0, -1, 0], [0, 0, 1], 0.022, 0.006, 0.006)]))), M3, 0, 0, 0, 0, 0, 0, 1, 1, 1, hd);
            eye(hd, 0.06, 0.005, 0.034, 0.016);
            mirror(hd, (g) => {
              add(G("ramhorn", () => {
                const P = [];
                for (let i = 0; i <= 8; i++) {
                  const a = (i / 8) * 4.4;
                  P.push([-0.02 - Math.sin(a) * 0.09, 0.06 + (1 - Math.cos(a)) * 0.06, 0.05 + i * 0.016]);
                }
                return sweep(P, (u) => 0.034 * Math.pow(1 - u, 0.7) * (1 + 0.1 * Math.sin(u * 90)) + 0.002, { nv: 12, nu: 70 });
              }), M2, 0, 0, 0, 0, 0, 0, 1, 1, 1, g);
              add(sw([[0.02, 0.04, 0.03], [0.07, 0.05, 0.045], [0.1, 0.02, 0.035]], [0.008, 0.016, 0.004], { nv: 8 }), M3, 0, 0, 0, 0, 0, 0, 1, 1, 1, g);
            });
            add(gemG, GL, 0.075, 0.045, 0, 0, 0, -0.3, 0.01, 0.04, 0.01, hd);
            mirror(fig, (g) => put(hornG(0.2, 0.5), M3, [0, 0.86, 0.14], [-0.3, 0.7, 0.6], [0, 1, 0], 0.14, 0.14, 0.14, g));
            batWing(fig, -0.06, 0.8, 0.06, 0.82, { dih: 0.35 });
            const tl = chain(fig, -0.08, 0.5, 11, 0.06, [0.022, 0.008], M3, { bz: (k) => (k < 3 ? 0.5 : -0.25), az: 0.14, ay: 0.16, w: 3, pz: 0.6, lag: 0.05 });
            add(ext("dspade", [[0, 0.008], [-0.03, 0.05], [-0.12, 0], [-0.03, -0.05], [0, -0.008]], 0.004, 0.006), GL, 0, 0, 0, 0, 0, 0, 1, 1, 1, tl.tip);
          } else if (an) {
            // 天使: なめらかな面・光の輪・2組の羽の翼・光の槍・腰のリボン
            add(sph, M3, 0, 0, 0, 0, 0, 0, 0.076, 0.086, 0.07, hd);
            add(sw([[-0.05, 0.0, 0], [0.0, 0.085, 0], [0.07, 0.05, 0]], [0.06, 0.05, 0.02], { nv: 16, ez: 1.25, ey: 0.6 }), M2, 0, 0, 0, 0, 0, 0, 1, 1, 1, hd); // かぶと
            add(tor(0.09, 2.2), GL, 0.008, 0.008, 0, Math.PI / 2, 0, 0, 0.072, 0.068, 0.07, hd).rotation.z = -1.1;
            halo(hd, 0.08, 0.01, 0, 0.2, 0.5);
            mirror(hd, (g) => add(G("awing", () => merge([0, 1, 2, 3].map((k) => [featherG, bas([0, 0, 0], [-1, 0.75 - k * 0.3, 0.25], [0, 0.3, 1], 0.2 - k * 0.025, 0.2, 0.2)]))), FT, -0.01, 0.03, 0.066, 0, 0, 0, 1, 1, 1, g));
            const hl = grp(hd, -0.07, 0.13, 0);
            hl.rotation.z = 0.35;
            hl.userData.nb = true;
            add(tor(0.05), GL, 0, 0, 0, Math.PI / 2, 0, 0, 0.12, 0.12, 0.12, hl);
            add(annulus(0.8), RN, 0, 0, 0, 0, 0, 0, 0.19, 0.19, 0.19, hl);
            for (let k = 0; k < 8; k++) xt(hl, GL, [Math.cos(k * 0.785) * 0.17, 0, Math.sin(k * 0.785) * 0.17], [Math.cos(k * 0.785), 0.001, Math.sin(k * 0.785)], k % 2 ? 0.06 : 0.1, 0.008, 0.004);
            anim.push(() => (hl.rotation.y = S.t * 0.6));
            featherWing(fig, -0.05, 0.82, 0.07, 0.95, { dih: 0.4 });
            featherWing(fig, -0.07, 0.72, 0.07, 0.6, { dih: -0.05, ph: -0.9, amp: 0.7 });
            const sp = grp(arms[0][0], 0.17, -0.14, 0);
            sp.rotation.z = 0.5;
            add(cylG, M2, 0.05, 0, 0, 0, 0, Math.PI / 2, 0.008, 0.8, 0.008, sp);
            add(ext("aspear", [[0, -0.012], [0.05, -0.04], [0.26, 0], [0.05, 0.04], [0, 0.012]], 0.002, 0.007), GL, 0.44, 0, 0, 0, 0, 0, 1, 1, 1, sp);
            add(tor(0.2), M2, 0.43, 0, 0, 0, Math.PI / 2, 0, 0.02, 0.02, 0.02, sp);
            halo(sp, 0.56, 0, 0, 0.4, 0.5);
            for (const sg of [1, -1]) {
              const rb = sheet(3, 14, (u, v, t, out) => {
                out[0] = -0.06 - v * 0.5;
                out[1] = 0.62 - v * 0.2 + Math.sin(t * 4 - v * 7 + sg) * 0.05 * v;
                out[2] = sg * (0.08 + v * 0.14) + (u - 0.5) * 0.05 + Math.sin(t * 3 - v * 5) * 0.04 * v;
              });
              add(rb.g, C1, 0, 0, 0, 0, 0, 0, 1, 1, 1, fig).userData.nb = true;
              anim.push(() => rb.upd(S.t));
            }
          } else {
            // 亡霊: 頭巾の中のどくろ・大鎌・まわりをめぐる人魂
            add(sph, C1, -0.01, 0.005, 0, 0, 0, 0, 0.092, 0.1, 0.09, hd);
            add(sw([[-0.03, 0.06, 0], [-0.11, 0.09, 0], [-0.2, 0.03, 0]], [0.065, 0.04, 0.003], { nv: 14 }), C1, 0, 0, 0, 0, 0, 0, 1, 1, 1, hd);
            add(sph, BK, 0.03, -0.005, 0, 0, 0, 0, 0.07, 0.076, 0.068, hd);
            add(sph, M3, 0.035, 0.0, 0, 0, 0, 0, 0.058, 0.064, 0.052, hd);
            add(sw([[0.04, -0.045, 0], [0.07, -0.06, 0], [0.085, -0.075, 0]], [0.036, 0.032, 0.02], { nv: 12, ey: 0.8 }), M3, 0, 0, 0, 0, 0, 0, 1, 1, 1, hd);
            add(G("gteeth", () => merge([-2, -1, 0, 1, 2].map((k) => [boxG, new THREE.Matrix4().makeScale(0.004, 0.016, 0.008).setPosition(0.098 - Math.abs(k) * 0.005, -0.072, k * 0.01)]))), BK, 0, 0, 0, 0, 0, 0, 1, 1, 1, hd);
            eye(hd, 0.078, 0.008, 0.024, 0.014, false);
            const sc = grp(arms[0][0], 0.17, -0.14, 0);
            sc.rotation.z = 1.3;
            sc.userData.nb = true;
            add(sw([[-0.4, 0, 0], [0, 0.012, 0], [0.42, 0, 0]], [0.01, 0.012, 0.01], { nv: 8 }), M2, 0, 0, 0, 0, 0, 0, 1, 1, 1, sc);
            const bl = grp(sc, 0.42, 0, 0);
            bl.rotation.z = 0.5;
            add(ext("scythe", [[0, 0], [0.05, 0.06], [0.02, 0.2], [-0.1, 0.36], [-0.26, 0.42], [-0.12, 0.3], [-0.04, 0.17], [-0.04, 0.02]], 0.002, 0.006, 40), M3, 0, 0, 0, 0, 0, 0, 1, 1, 1, bl);
            add(sw([[0.055, 0.06, 0], [0.03, 0.2, 0], [-0.09, 0.365, 0], [-0.26, 0.425, 0]], [0.004, 0.006, 0.006, 0.002], { nv: 6 }), GL, 0, 0, 0, 0, 0, 0, 1, 1, 1, bl);
          }
          // まわりをめぐる人魂
          const wisps = [0, 1, 2, 3].map((k) => {
            const g = grp(root);
            g.userData.nb = true;
            add(sph, GL, 0, 0, 0, 0, 0, 0, 0.022, 0.03, 0.022, g);
            add(tooth, GL, 0, 0.015, 0, 0, 0, Math.PI / 2, 0.06, 0.018, 0.018, g);
            halo(g, 0, 0, 0, 0.2, 0.6);
            return g;
          });
          anim.push(() => {
            const t = S.t;
            core.scale.set(0.04 + Math.sin(t * 3.4) * 0.006, 0.05 + Math.sin(t * 3.4) * 0.006, 0.04);
            hc.scale.setScalar(0.45 + Math.sin(t * 3.4) * 0.08);
            wisps.forEach((g, k) => g.position.set(Math.cos(t * 1.1 + k * 1.57) * 0.42, 0.55 + Math.sin(t * 1.9 + k * 2) * 0.22, Math.sin(t * 1.1 + k * 1.57) * 0.42));
            fig.rotation.z = -0.2 - S.climb * 0.12;
            hd.rotation.y = Math.sin(t * 0.7) * 0.2 + S.turn * 0.3;
            hd.rotation.z = Math.sin(t * 1.1) * 0.06 + 0.1;
            for (const [sh, sg] of arms) sh.rotation.set(0.25, 0, 0.45 + Math.sin(t * 1.4 + sg * 1.3) * 0.15);
          });
        },
        crystal() {
          S.w = 1.6;
          S.lift = 0.05;
          const MX = PM({ color: bright.clone().lerp(glow, 0.5), emissive: glow, emissiveIntensity: 0.3, roughness: 0.05, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.02, flatShading: true, transparent: true, opacity: 0.86, envMapIntensity: 1.6 });
          // 大きな結晶と、まわりに生えた小さな結晶。中に光る芯
          const cg = grp(root, 0, 0.6, 0);
          const core = add(sph, GL, 0, 0, 0, 0, 0, 0, 0.05, 0.2, 0.05, cg);
          add(gemG, MX, 0, 0, 0, 0, 0.3, 0, 0.15, 0.72, 0.15, cg);
          for (let k = 0; k < 11; k++) {
            const a = (k / 11) * 6.2832 + rnd(k), up = k % 2 ? 1 : -1, l = 0.2 + rnd(k + 20) * 0.18;
            put(gemG, MX, [Math.cos(a) * 0.09, up * (0.1 + rnd(k + 4) * 0.08), Math.sin(a) * 0.09], [Math.sin(a), 0, -Math.cos(a)], [Math.cos(a) * 0.55, up, Math.sin(a) * 0.55], 0.04 + rnd(k + 8) * 0.025, l, 0.04 + rnd(k + 8) * 0.025, cg);
          }
          const hc = halo(cg, 0, 0, 0, 0.9, 0.5);
          // 結晶をつかむ金のつめと、逆向きに回る2本の輪
          for (const up of [1, -1]) for (let k = 0; k < 3; k++) {
            const a = k * 2.094 + (up > 0 ? 0 : 1.05);
            put(hornG(0.14, 1.1, 0.06), M2, [Math.cos(a) * 0.2, up * 0.28, Math.sin(a) * 0.2], [-Math.cos(a) * 0.2, -up, -Math.sin(a) * 0.2], [-Math.cos(a), 0, -Math.sin(a)], 0.22, 0.22, 0.22, cg);
          }
          for (const up of [1, -1]) add(tor(0.12), M2, 0, up * 0.27, 0, Math.PI / 2, 0, 0, 0.2, 0.2, 0.2, cg);
          const rings = [0, 1].map((i) => {
            const g = grp(cg);
            g.userData.nb = true;
            add(tor(0.035), M2, 0, 0, 0, Math.PI / 2, 0, 0, 0.36 + i * 0.06, 0.36 + i * 0.06, 0.36, g);
            add(annulus(0.86), RN, 0, 0, 0, 0, 0, 0, 0.35 + i * 0.06, 0.35, 0.35 + i * 0.06, g);
            for (let k = 0; k < 6; k++) add(gemG, GL, Math.cos(k * 1.047) * (0.36 + i * 0.06), 0, Math.sin(k * 1.047) * (0.36 + i * 0.06), 0, 0, 0, 0.012, 0.06, 0.012, g);
            return g;
          });
          // 左右に浮く刃のような結晶(腕のかわり)
          const blades = [];
          mirror(root, (g, sg) => {
            const b = grp(g, 0.05, 0.62, 0.42);
            b.userData.nb = true;
            add(gemG, MX, 0, 0, 0, 0, 0, -0.5, 0.045, 0.42, 0.03, b);
            add(sph, GL, 0, 0, 0, 0, 0, -0.5, 0.012, 0.14, 0.01, b);
            add(tor(0.15), M2, 0, 0, 0, Math.PI / 2, 0, 0, 0.05, 0.05, 0.05, b);
            blades.push([b, sg]);
          });
          // めぐるかけらと、ときどき走る稲妻
          const sh = [0, 1, 2, 3, 4, 5, 6].map((k) => add(gemG, k % 2 ? GL : MX, 0, 0, 0, 0, 0, 0, 0.02 + rnd(k + 9) * 0.015, 0.09 + rnd(k) * 0.06, 0.02 + rnd(k + 9) * 0.015));
          sh.forEach((o) => (o.userData.nb = true));
          const bolts = [0, 1, 2].map((k) => {
            const P = [[0, 0, 0]];
            for (let i = 1; i <= 7; i++) P.push([i * 0.075, (hash(k * 50 + i) - 0.5) * 0.12, (hash(k * 50 + i + 20) - 0.5) * 0.12]);
            const g = grp(cg);
            g.userData.nb = true;
            add(G("bolt" + k, () => {
              const parts = [];
              for (let i = 0; i < 7; i++) {
                const d = [P[i + 1][0] - P[i][0], P[i + 1][1] - P[i][1], P[i + 1][2] - P[i][2]];
                parts.push([cylG, bas(P[i], [-d[1], d[0], 0.0001], d, 0.006, Math.hypot(d[0], d[1], d[2]), 0.006).multiply(new THREE.Matrix4().makeTranslation(0, 0.5, 0))]);
              }
              return merge(parts);
            }), GL, 0, 0, 0, 0, 0, 0, 1, 1, 1, g);
            return g;
          });
          anim.push(() => {
            const t = S.t;
            cg.rotation.y = t * 0.5;
            core.scale.set(0.05 + Math.sin(t * 5) * 0.012, 0.2, 0.05 + Math.sin(t * 5) * 0.012);
            hc.scale.setScalar(0.9 + Math.sin(t * 5) * 0.15);
            rings[0].rotation.set(0.5 + Math.sin(t * 0.7) * 0.2, t * 1.3, 0.2);
            rings[1].rotation.set(-0.4, -t * 0.9, 0.5 + Math.cos(t * 0.6) * 0.2);
            for (const [b, sg] of blades) ((b.position.y = 0.62 + Math.sin(t * 1.6 + sg) * 0.05), (b.rotation.z = Math.sin(t * 1.2 + sg) * 0.2 - S.climb * 0.3), (b.rotation.y = Math.sin(t * 0.9) * 0.3));
            sh.forEach((o, k) => {
              const a = (k / 7) * 6.2832 + t * (0.9 + (k % 3) * 0.2);
              o.position.set(Math.cos(a) * 0.5, 0.6 + Math.sin(t * 2 + k * 1.3) * 0.28, Math.sin(a) * 0.5);
              o.rotation.set(t + k, t * 2, 0.4);
            });
            bolts.forEach((g, k) => {
              const n = Math.floor(t * 11 + k * 3.7), on = hash(n * 7 + k) > 0.55;
              g.visible = on;
              if (on) g.rotation.set(hash(n) * 6.28, hash(n + 5) * 6.28, hash(n + 9) * 6.28);
            });
          });
        },
      };
      BUILD[kind]();
      // 高さ1ほどにそろえて、足もとを原点へ(翼・マントなど、はみ出してよい部品は測らない)
      const wrap = new THREE.Group();
      wrap.add(root);
      const tick = (t) => {
        const dt = Math.min(0.1, Math.max(0, t - S.t)), d = wrap.userData.drive;
        S.t = t;
        if (d) {
          const k = Math.min(1, dt * 5);
          S.climb += (d.climb - S.climb) * k;
          S.turn += (d.turn - S.turn) * k;
        }
        S.amp = 0.75 + 0.35 * S.climb;
        S.fold = Math.max(0, -S.climb);
        S.ph += dt * S.w * (1 + 0.3 * S.climb);
        for (const f of anim) f(t);
        wrap.userData.lift = -Math.sin(S.ph - 0.5) * S.lift * S.amp; // 打ち下ろすと体が持ち上がる
      };
      tick(0);
      root.updateMatrixWorld(true);
      const bx = new THREE.Box3(), tb = new THREE.Box3();
      const measure = (o) => {
        if (o.userData.nb) return;
        if (o.isMesh) {
          if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
          bx.union(tb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld));
        }
        for (const c of o.children) measure(c);
      };
      measure(root);
      const sz = bx.getSize(new THREE.Vector3());
      const k = 1 / Math.max(sz.y, sz.x * 0.62, 0.6);
      root.scale.setScalar(k);
      root.position.set((-(bx.min.x + bx.max.x) / 2) * k * 0.5, -bx.min.y * k, 0);
      wrap.userData.tick = tick;
      wrap.userData.kind = kind;
      return wrap;
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
      const L0 = {};
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
      // 3Dモデルを登録していないカードは、部品から組み立てた姿で出す(絵文字は使わない)
      let fb;
      try {
        fb = proc(m, side);
        fb.scale.setScalar(s);
      } catch (e) {
        console.error(e);
        fb = sprite(m, side);
        fb.scale.set(s * 1.2, s * 1.2, 1);
      }
      body.add(fb);
      template(m, side).then((tpl) => {
        if (!tpl) return;
        const c = tpl.clone(true);
        c.scale.setScalar(s);
        body.remove(fb);
        body.add(c);
        L0.fb = null;
      });
      obj.scale.setScalar(0.01);
      scene.add(obj);
      L0.obj = obj;
      Object.assign(L0, { body, ring, side, born: sim ? sim.t : 0, gone: null, m, fb });
      return L0;
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
        // 自転車の斜め後ろの上を飛ぶ(カメラから自転車が隠れないように、左右と上に分ける)
        const back = L.slot === 2 ? 2.6 : 1.8, lat = L.slot === 0 ? 1.7 : L.slot === 1 ? -1.7 : 0;
        // 飛ぶ道すじ: 上下に大きく波うち、左右は8の字、前後にも出入りする。ときどき深く急降下して舞い上がる
        const ph = t * 0.9 + L.slot * 2.1, dive = Math.max(0, Math.sin(ph * 0.37)) ** 6;
        const oy = Math.sin(ph) * 0.6 + Math.sin(ph * 2.3 + 1) * 0.2 - dive * 0.8;
        const oz = Math.sin(ph * 0.5 + 0.5) * 0.6 + Math.sin(ph * 1.3) * 0.15;
        const ox = Math.cos(ph * 0.5 + 0.5) * 0.45 + dive * 0.5;
        // 道の幅の中だけを飛ぶ(翼が建物にめり込まないように)。自転車は道の左端から約0.9m。左が正
        const rr = Roads.ride(L.side === "you" ? sim.along : sim.rAlong), RW = rr ? rr.W : 6;
        const bikeL = 0.9 + (L.side === "you" ? sim.dodge || 0 : 1.1), span = size(L.m) * 0.85;
        let lo = -(RW - bikeL) + span, hi = bikeL - span, narrow = 0;
        if (lo > hi) (lo = hi = (lo + hi) / 2), (narrow = 1); // 翼より狭い道: 道のまん中を、縦に並んで高めに飛ぶ
        L.nar = (L.nar || 0) + (narrow - (L.nar || 0)) * Math.min(1, dt * 2);
        const latT = Math.max(lo, Math.min(hi, lat + oz));
        const backT = back - ox + L.nar * L.slot * 1.6;
        const tx = bike.position.x - dx * backT + dz * latT, tz = bike.position.z - dz * backT - dx * latT, ty = bike.position.y + (L.slot === 2 ? 3.6 : 2.6) + oy + L.nar * (1.2 + L.slot * 0.9);
        const k = 1 - Math.exp(-dt * 5);
        const o = L.obj;
        if (o.scale.x < 0.05) o.position.set(tx, ty, tz);
        o.position.x += (tx - o.position.x) * k;
        o.position.y += (ty - o.position.y) * k;
        o.position.z += (tz - o.position.z) * k;
        o.rotation.y = yaw;
        // 動く向きに体を合わせる: 上昇で頭を上げ、下降で下げる。横へ動くとき・道を曲がるときは内側へ傾く
        let dyaw = yaw - (L.yaw == null ? yaw : L.yaw);
        dyaw -= Math.round(dyaw / (2 * Math.PI)) * 2 * Math.PI;
        L.yaw = yaw;
        const q = L.pv || (L.pv = { oy, oz, vy: 0, vz: 0, yr: 0 }), e = Math.min(1, dt * 4), idt = dt > 1e-4 ? 1 / dt : 0;
        const cl = (v, a) => Math.max(-a, Math.min(a, v));
        q.vy += ((oy - q.oy) * idt - q.vy) * e;
        q.vz += ((oz - q.oz) * idt - q.vz) * e;
        q.yr += (cl(dyaw * idt, 2) - q.yr) * e;
        q.oy = oy;
        q.oz = oz;
        L.body.rotation.y = cl(q.vz * 0.25, 0.4);
        L.body.rotation.z = cl(q.vy * 0.42, 0.6);
        L.body.rotation.x = cl(-q.vz * 0.6 - q.yr * 0.5, 0.7);
        L.ring.rotation.z += dt * 1.5;
        if (L.fb && L.fb.userData.tick) {
          // 上昇中は強く速く羽ばたき、下降中は翼をたたんで滑空する。首と尾は遅れてついてくる
          L.fb.userData.drive = { climb: cl(q.vy * 0.9, 1), turn: cl(q.vz * 0.6 + q.yr * 0.6, 1) };
          L.fb.userData.tick(performance.now() / 1000 + L.slot * 1.3);
          // 羽ばたきに合わせて体が上下する
          L.body.position.y = (L.fb.userData.lift || 0) * size(L.m);
        } else L.body.position.y = 0;
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
    // 画面のキャンバスの隅に一度だけ描いて、正方形の絵として切り出す(描く前の設定は元に戻す)
    function snap(sc, cam) {
      const THREE = T();
      const cv = renderer.domElement, S = Math.min(cv.width, cv.height, 900);
      const vp = renderer.getViewport(new THREE.Vector4()), sci = renderer.getScissor(new THREE.Vector4()), st = renderer.getScissorTest();
      const cc = renderer.getClearColor(new THREE.Color()), ca = renderer.getClearAlpha(), ac = renderer.autoClear, pr = renderer.getPixelRatio();
      const rt = renderer.getRenderTarget();
      renderer.setRenderTarget(null);
      renderer.setViewport(0, 0, S / pr, S / pr);
      renderer.setScissor(0, 0, S / pr, S / pr);
      renderer.setScissorTest(true);
      renderer.setClearColor(0x000000, 0);
      renderer.autoClear = true;
      renderer.render(sc, cam);
      const out = document.createElement("canvas");
      out.width = out.height = S;
      out.getContext("2d").drawImage(cv, 0, cv.height - S, S, S, 0, 0, S, S);
      renderer.setViewport(vp);
      renderer.setScissor(sci);
      renderer.setScissorTest(st);
      renderer.setClearColor(cc, ca);
      renderer.autoClear = ac;
      renderer.setRenderTarget(rt);
      return out.toDataURL("image/png");
    }
    // 見せ場に出す人物: 実際に走っている3Dの乗り手(自分・ライバル)を、ななめ前の低い位置から撮る
    const riderShots = new Map();
    function riderPortrait(side, view) {
      const b = side === "opp" ? rival : me;
      if (!b || !b.g || !renderer) return null;
      const key = side + "|" + (view || "bust");
      if (riderShots.has(key)) return riderShots.get(key);
      let url = null;
      const g = b.g, parent = g.parent;
      try {
        const THREE = T();
        const sc = new THREE.Scene();
        sc.environment = scene.environment;
        sc.add(new THREE.HemisphereLight(0xe6eeff, 0x2a2430, 0.9));
        const yaw = g.rotation.y, cx = Math.cos(yaw), sx = Math.sin(yaw);
        const L = (lx, ly, lz) => new THREE.Vector3(g.position.x + lx * cx + lz * sx, g.position.y + ly, g.position.z - lx * sx + lz * cx);
        const k1 = new THREE.DirectionalLight(0xfff0dc, 2.6), k2 = new THREE.DirectionalLight(side === "opp" ? 0xff5a7a : 0x6fd0ff, 2.4);
        k1.position.copy(L(3, 3, 2.5));
        k1.target.position.copy(L(0.2, 1.2, 0));
        k2.position.copy(L(-2.5, 2, -2.5));
        k2.target.position.copy(L(0.2, 1.2, 0));
        sc.add(k1, k1.target, k2, k2.target);
        sc.add(g);
        const V = { bust: [[1.75, 1.02, 0.78], [0.3, 1.28, 0.0], 30], face: [[1.25, 1.42, 0.3], [0.42, 1.52, 0.0], 22], side: [[0.5, 1.2, 2.2], [0.25, 1.15, 0], 34] }[view || "bust"];
        const cam = new THREE.PerspectiveCamera(V[2], 1, 0.05, 50);
        cam.position.copy(L(...V[0]));
        cam.lookAt(L(...V[1]));
        url = snap(sc, cam);
      } catch (e) {
        console.error(e);
      }
      if (parent) parent.add(g);
      riderShots.set(key, url);
      return url;
    }
    window.RiderPortrait = riderPortrait;
    // 見せ場(Cinema)に出す姿: 組み立てた3Dのモンスターを、ななめ前から撮った絵にする(名前と側ごとに1回だけ)。
    // 画面のキャンバスの右下に一瞬だけ描いて切り抜く。見せ場は画面全体をおおうので、描いたあとが見えることはない
    const shots = new Map();
    function portrait(m, side) {
      if (!m || !renderer || !scene) return null;
      const key = (m.name || "") + "|" + side;
      if (shots.has(key)) return shots.get(key);
      let url = null;
      try {
        const THREE = T();
        const fb = proc(m, side);
        const sc = new THREE.Scene();
        sc.environment = scene.environment;
        sc.add(new THREE.HemisphereLight(0xdfeaff, 0x302838, 1.1));
        const key1 = new THREE.DirectionalLight(0xfff2e0, 2.4);
        key1.position.set(3, 4, 4);
        const rim = new THREE.DirectionalLight(side === "opp" ? 0xff6a8a : 0x7fd8ff, 2.2);
        rim.position.set(-4, 2, -3);
        sc.add(key1, rim, fb);
        fb.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(fb), ctr = box.getCenter(new THREE.Vector3()), sz = box.getSize(new THREE.Vector3());
        const R = Math.max(sz.x, sz.y, sz.z) * 0.62;
        const cam = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
        // ななめ前・少し下から見上げる(強そうに見える角度)
        const yaw = 0.75, pit = -0.14, d = (R / Math.tan((15 * Math.PI) / 180)) * 0.82;
        cam.position.set(ctr.x + Math.cos(pit) * Math.cos(yaw) * d, ctr.y + Math.sin(pit) * d + R * 0.05, ctr.z + Math.cos(pit) * Math.sin(yaw) * d);
        cam.lookAt(ctr);
        url = snap(sc, cam);
        sc.remove(fb);
      } catch (e) {
        console.error(e);
      }
      shots.set(key, url);
      return url;
    }
    window.MonPortrait = portrait;
    return { update, portrait, _proc: proc, objs: () => [...live.values()].map((L) => L.obj) };
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
  // ---------- 本格的な映り込み: 自分のまわりの景色を、6方向ぶん撮って「映り込み用の絵」にする ----------
  // 車の塗装・窓ガラス・カーブミラー・路面に、まわりの建物や空が実際に映る。重いので、1コマおきに1方向ずつ撮る
  // (6方向そろうのに12コマ=約0.2秒)。コマ数が足りない端末では自動でやめる。
  const Refl = (() => {
    let rt = null, cube = null, face = 0, tick = 0, on = true, used = false;
    try {
      on = localStorage.getItem("city_refl") !== "0";
    } catch (e) {}
    function update(p) {
      if (!on || !renderer) return;
      const THREE = T();
      if (!rt) {
        rt = new THREE.WebGLCubeRenderTarget(256, { generateMipmaps: false });
        cube = new THREE.CubeCamera(1.8, 700, rt);
      }
      // 1方向を撮るのは1秒に約30回(60Hzなら1コマおき、120Hzなら4コマに1回)。6方向そろう時間は画面の速さによらず同じ
      if (tick++ % Rate.every()) return;
      if (face === 0) {
        cube.position.set(p.x, p.y + 2.3, p.z);
        cube.updateMatrixWorld(true);
      }
      const tm = renderer.toneMapping, vis = me && me.g.visible;
      renderer.toneMapping = THREE.NoToneMapping;
      if (me) me.g.visible = false; // 自分は映さない(撮る場所が自分の中なので)
      const bg = scene.background;
      if (skyFlat) scene.background = skyFlat;
      renderer.setRenderTarget(rt, face);
      renderer.render(scene, cube.children[face]);
      renderer.setRenderTarget(null);
      scene.background = bg;
      if (me) me.g.visible = vis;
      renderer.toneMapping = tm;
      if (++face >= 6) {
        face = 0;
        rt.texture.needsPMREMUpdate = true;
        if (!used) (scene.environment = rt.texture), (used = true);
      }
    }
    return {
      update,
      on: () => on,
      set(v, keep) {
        on = v;
        if (!keep)
          try {
            localStorage.setItem("city_refl", v ? "1" : "0");
          } catch (e) {}
      },
    };
  })();
  // ---------- 写真の街: 道で撮った写真(Google のストリートビューの画像)を、3Dの街の形に貼って走る ----------
  // ストリートビューの画面を切り替えて見せるのではなく、写真を「光」のように3Dの建物・道・地面へ映す。
  // 形は国のデータ(建物)と道路、色は写真。カメラは3Dの中を自由に動けるので、写真の実写感のまま、奥行きのある空間として走れる。
  // 画像は Map Tiles API の Street View Tiles から取る(保存はしない)。料金がかからないよう、この端末では月の枚数に上限を付ける。
  const PV = (() => {
    const STEP = 28, Z = 2, CAP_M = 24000; // 28mごとに1枚。1枚=タイル8枚(2048×1024)。月の上限(タイルの枚数)
    let on = false, session = null, sessionP = null, err = "", mat = null, walkT = 0, stT = 0, told = false, copy = "";
    const panos = new Map(); // i(道のり/STEP) → { state, tex, x, y, z, hd, al }
    const usage = () => {
      const d = new Date(), m = d.getFullYear() + "-" + (d.getMonth() + 1);
      let u = null;
      try {
        u = JSON.parse(localStorage.getItem("city_pvuse") || "null");
      } catch (e) {}
      return u && u.m === m ? u : { m, n: 0 };
    };
    const count = (k) => {
      const u = usage();
      u.n += k;
      try {
        localStorage.setItem("city_pvuse", JSON.stringify(u));
      } catch (e) {}
    };
    const api = "https://tile.googleapis.com/v1/";
    async function getSession() {
      if (session) return session;
      if (!sessionP)
        sessionP = fetch(api + "createSession?key=" + encodeURIComponent(G3.getKey()), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mapType: "streetview", language: "ja-JP", region: "JP" }) }).then(async (r) => {
          const j = await r.json().catch(() => ({}));
          if (!r.ok || !j.session) throw new Error((j.error && j.error.message) || "HTTP " + r.status);
          return (session = j.session);
        }).catch((e) => {
          sessionP = null; // 失敗を覚えたままにしない(次に写真を取るときに、もう一度つなぐ)
          throw e;
        });
      return sessionP;
    }
    async function load(i) {
      const P = { state: "load", al: i * STEP };
      panos.set(i, P);
      try {
        const ses = await getSession(), q = `session=${ses}&key=${encodeURIComponent(G3.getKey())}`;
        const a = at(P.al), lat = route.lat0 - a.z / route.kz, lng = route.lon0 + a.x / route.kx;
        const md = await (await fetch(`${api}streetview/metadata?${q}&lat=${lat}&lng=${lng}&radius=40`)).json();
        if (!md.panoId) throw new Error((md.error && md.error.message) || "写真なし");
        // 道で撮った Google の写真だけ使う(店の中などで撮られた、投稿の写真は使わない)
        if (md.copyright && !/Google/i.test(md.copyright)) throw new Error("道の写真なし");
        // 同じ写真をもう持っていれば使い回す
        for (const o of panos.values()) if (o !== P && o.id === md.panoId && o.tex) return Object.assign(P, { state: "ok", tex: o.tex, shared: true, id: o.id, x: o.x, y: o.y, z: o.z, hd: o.hd });
        const cols = 2 ** Z, rows = 2 ** (Z - 1), tw = md.tileWidth || 512, th = md.tileHeight || 512;
        if (usage().n + cols * rows > CAP_M) throw new Error("今月の上限");
        count(cols * rows);
        const cv = document.createElement("canvas");
        // 写真の実際の大きさ(このズームでの幅と高さ)。端のタイルは、はみ出しぶんが黒いので切り落とす
        const fullW = md.imageWidth / 2 ** (5 - Z), fullH = md.imageHeight / 2 ** (5 - Z);
        cv.width = Math.min(cols * tw, Math.round(fullW) || cols * tw);
        cv.height = Math.min(rows * th, Math.round(fullH) || rows * th);
        const c = cv.getContext("2d");
        await Promise.all(
          Array.from({ length: cols * rows }, async (_, k) => {
            const tx = k % cols, ty = Math.floor(k / cols);
            const r = await fetch(`${api}streetview/tiles/${Z}/${tx}/${ty}?${q}&panoId=${encodeURIComponent(md.panoId)}`);
            if (!r.ok) return;
            const bm = await createImageBitmap(await r.blob());
            c.drawImage(bm, tx * tw, ty * th);
          })
        );
        const THREE = T();
        const tex = new THREE.CanvasTexture(cv);
        tex.wrapS = THREE.RepeatWrapping;
        tex.minFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        const [x, z] = project(md.lat, md.lng);
        copy = md.copyright || copy;
        Object.assign(P, { state: "ok", tex, id: md.panoId, x, z, y: H(x, z) + 2.5, hd: ((md.heading || 0) * Math.PI) / 180 });
      } catch (e) {
        P.state = "fail";
        P.failT = performance.now();
        err = String((e && e.message) || e).slice(0, 80);
        // 期限切れなどで写真が取れなくなったら、つなぎ直す
        if (/session|expired|unauth|40[13]/i.test(err)) session = null;
        if (!told) (told = true), ticker("写真の街: 写真を取れません(" + err + ")", "opp");
      }
    }
    // 写真を貼るための材質。もとの街をふつうに描いたあと、その上に重ねて描く。
    // 写真を撮った場所から見えない面(建物の裏・かげ)や、遠すぎる面には貼らない(もとの3Dの絵がそのまま見える)
    function material() {
      if (mat) return mat;
      const THREE = T();
      const U = (v) => ({ value: v });
      const VS = `attribute vec4 anc; uniform vec3 uShops[16]; varying vec3 vW;
          void main() {
            vec4 p = vec4(position, 1.0);
            #ifdef USE_INSTANCING
              p = instanceMatrix * p;
            #endif
            vec4 w = modelMatrix * p;
            // 店を専用の形で建てた敷地の、もとの建物は描かない(ふつうの描き方と同じ決まり)
            if (anc.w > 1.5) for (int si = 0; si < 16; si++) if (uShops[si].z > 0.0 && distance(anc.xz, uShops[si].xy) < uShops[si].z) w.y = -500.0;
            vW = w.xyz;
            gl_Position = projectionMatrix * viewMatrix * w;
          }`;
      mat = new THREE.ShaderMaterial({
        extensions: { derivatives: true },
        side: THREE.DoubleSide, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2,
        uniforms: { tA: U(null), tB: U(null), dA: U(null), dB: U(null), cA: U(new THREE.Vector4()), cB: U(new THREE.Vector4()), mixK: U(0), has: U(new THREE.Vector4(0, 0, 0, 0)), uShops: popU.uShops },
        vertexShader: VS,
        // その点が、写真を撮った場所から見てどの向きにあるかで、写真のどこを貼るかを決める(北=-z・東=+x)
        fragmentShader: `uniform sampler2D tA; uniform sampler2D tB; uniform samplerCube dA; uniform samplerCube dB; uniform vec4 cA; uniform vec4 cB; uniform float mixK; uniform vec4 has;
          varying vec3 vW;
          vec4 pano(sampler2D t, samplerCube dm, vec4 c, float hasD) {
            vec3 v = vW - c.xyz;
            float dist = length(v);
            vec3 d = v / dist;
            float yaw = atan(d.x, -d.z) - c.w;
            vec2 uv = vec2(yaw / 6.2831853 + 0.5, 0.5 + asin(clamp(d.y, -1.0, 1.0)) / 3.14159265);
            // 見えているか: 撮った場所から、この向きでいちばん手前にある面までの距離とくらべる
            float vis = 1.0;
            if (hasD > 0.5) {
              vec4 e = textureCube(dm, v);
              float hitD = (e.r + e.g / 255.0) * 800.0;
              vis = clamp((hitD * 1.04 + 2.2 - dist) / 1.4, 0.0, 1.0);
            }
            vec3 col = texture2D(t, uv).rgb;
            // 面を斜めから見る所は、写真が引きのばされて崩れる。面の向きを調べて、斜めすぎる所はもとの絵に戻す
            vec3 nn = normalize(cross(dFdx(vW), dFdy(vW)));
            float gz = abs(dot(nn, d));
            if (abs(nn.y) > 0.7) {
              // 地面: 撮った場所の近く(約28mまで)だけ
              vis *= clamp((gz - 0.07) / 0.08, 0.0, 1.0) * clamp((34.0 - dist) / 10.0, 0.0, 1.0);
            } else {
              vis *= clamp((gz - 0.22) / 0.22, 0.0, 1.0) * clamp((60.0 - dist) / 22.0, 0.0, 1.0);
              // 壁なのに写真では空が写っている所(実物より形が高い・ずれている)は貼らない
              float lum = dot(col, vec3(0.3, 0.59, 0.11));
              float sky = step(0.03, d.y) * smoothstep(0.62, 0.8, lum) * step(col.r, col.b + 0.03);
              vis *= 1.0 - sky;
            }
            return vec4(col, vis);
          }
          void main() {
            vec4 a = has.x > 0.5 ? pano(tA, dA, cA, has.z) : vec4(0.0);
            vec4 b = has.y > 0.5 ? pano(tB, dB, cB, has.w) : vec4(0.0);
            // 2枚を半々に混ぜると二重にぶれて見えるので、切り替えは短い区間で一気に
            float mk = smoothstep(0.35, 0.65, mixK);
            float wa = a.a * (1.0 - mk), wb = b.a * mk;
            // 片方しか使えない所は、使えるほうだけで
            if (wa + wb < 0.02) { wa = a.a; wb = b.a; }
            float sum = wa + wb;
            if (sum < 0.02) discard;
            gl_FragColor = vec4((a.rgb * wa + b.rgb * wb) / sum, min(1.0, max(a.a, b.a)));
          }`,
      });
      // 距離を測るための材質(写真を撮った場所から、まわりの面までの距離を6方向ぶん撮る)
      distMat = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: { cP: U(new THREE.Vector3()), uShops: popU.uShops },
        vertexShader: VS,
        fragmentShader: `uniform vec3 cP; varying vec3 vW;
          void main() {
            float v = clamp(length(vW - cP) / 800.0, 0.0, 0.9999) * 255.0;
            gl_FragColor = vec4(floor(v) / 255.0, fract(v), 0.0, 1.0);
          }`,
      });
      return mat;
    }
    let distMat = null, cubeT = 0, cubeN = 0;
    function depthOf(P) {
      const THREE = T();
      if (!P.rt) {
        P.rt = new THREE.WebGLCubeRenderTarget(256, { generateMipmaps: false, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
        P.cam = new THREE.CubeCamera(0.5, 800, P.rt);
        for (const ch of P.cam.children) ch.layers.set(2);
      }
      P.cam.position.set(P.x, P.y, P.z);
      P.cam.updateMatrixWorld(true);
      distMat.uniforms.cP.value.set(P.x, P.y, P.z);
      const bg = scene.background, fog = scene.fog, tm = renderer.toneMapping, sm = renderer.shadowMap.autoUpdate, cc = renderer.getClearColor(new THREE.Color()), ca = renderer.getClearAlpha();
      scene.background = null;
      scene.fog = null;
      scene.overrideMaterial = distMat;
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.shadowMap.autoUpdate = false;
      renderer.setClearColor(0xffff00, 1); // 何もない向き = いちばん遠い
      P.cam.update(renderer, scene);
      renderer.setClearColor(cc, ca);
      renderer.shadowMap.autoUpdate = sm;
      renderer.toneMapping = tm;
      scene.overrideMaterial = null;
      scene.background = bg;
      scene.fog = fog;
      P.depthAt = performance.now();
    }
    // 写真を貼る物(動かない建物・道・地面)に2番の印を付ける
    function mark() {
      const dyn = new Set([me.g, rival.g, ...Traffic.objs(), ...Mons.objs()]);
      const walk = (o) => {
        if (!o || dyn.has(o)) return;
        if (o.isMesh && !o.isInstancedMesh && !o.isSkinnedMesh && o.material && !o.material.transparent && o.material.depthTest !== false && !o.userData.blob && !o.userData.sign) {
          // アンダーパスの近くでは、穴をあけた地面には写真を貼らない(穴をふさいでしまう)
          // 材質が組(配列)のメッシュもある。userData の無い材質で止まらないように調べる
          const holed = Array.isArray(o.material) ? o.material.some((x) => x && x.userData && x.userData.holed) : o.material.userData && o.material.userData.holed;
          if (holed && Xing.near(sim.along)) o.layers.disable(2);
          else o.layers.enable(2);
        }
        for (const ch of o.children) walk(ch);
      };
      walk(scene);
    }
    // 写真の街として描く。描けたら true(ふつうの描き方は、この中で済ませる)
    function render(p, s, real) {
      if (!on) return false;
      const i0 = Math.floor(s.along / STEP);
      for (const i of [i0, i0 + 1, i0 + 2]) {
        const P = panos.get(i);
        // 取れなかった所は、写真が無い所を除いて20秒おきに取り直す
        if (P && P.state === "fail" && !/写真なし|道の写真なし|今月の上限/.test(err) && performance.now() - P.failT > 20000) panos.delete(i);
        if (i * STEP <= route.length && !panos.has(i)) load(i);
      }
      // チェックの横に、いまの状態を出す(止まっているのに気づけるように)
      if ((stT = (stT || 0) + 1) % 30 === 0) {
        let ok = 0, ng = 0;
        for (const P of panos.values()) P.state === "ok" ? ok++ : P.state === "fail" && ng++;
        const st = !ok && ng ? `止まっています: ${err}` : usage().n + 8 > CAP_M ? "今月の上限" : "";
        for (const id of ["ct-pv-st"]) if ($(id) && $(id).textContent !== st) $(id).textContent = st;
      }
      for (const [i, P] of panos)
        if (i < i0 - 2 || i > i0 + 5) {
          if (P.tex && ![...panos.values()].some((o) => o !== P && o.tex === P.tex)) P.tex.dispose();
          if (P.rt) P.rt.dispose();
          panos.delete(i);
        }
      const A = panos.get(i0), B = panos.get(i0 + 1), okA = A && A.state === "ok", okB = B && B.state === "ok";
      if (!okA && !okB) return false;
      // 掘り下げた道(アンダーパス)では写真を貼らない。写真は地上の高さで撮られていることが多く、
      // 壁や天井に地上の景色が引き伸ばされて、別の世界のように見えてしまう
      if (Xing.list().some((d) => s.along > d.s0 - 40 && s.along < d.s1 + 40)) return false; // まだ1枚もない間は、ふつうの3Dの街
      const m = material(), u = m.uniforms;
      if ((walkT -= real) <= 0) (walkT = 0.7), mark();
      // 距離の絵は、街が読み込まれるたびに変わるので、2秒おきに撮り直す(1コマに1枚ずつ)
      if ((cubeT -= real) <= 0) {
        cubeT = 0.25;
        const list = [A, B].filter((P) => P && P.state === "ok").sort((x, y) => (x.depthAt || 0) - (y.depthAt || 0));
        if (list[0] && (!list[0].depthAt || performance.now() - list[0].depthAt > 2000)) depthOf(list[0]);
      }
      // 1) ふつうに描く(もとの3Dの街と、動く物)
      renderer.render(scene, camera);
      // 2) その上に、写真を重ねる
      if (okA) (u.tA.value = A.tex), u.cA.value.set(A.x, A.y, A.z, A.hd), (u.dA.value = A.rt ? A.rt.texture : null);
      if (okB) (u.tB.value = B.tex), u.cB.value.set(B.x, B.y, B.z, B.hd), (u.dB.value = B.rt ? B.rt.texture : null);
      u.has.value.set(okA ? 1 : 0, okB ? 1 : 0, okA && A.rt ? 1 : 0, okB && B.rt ? 1 : 0);
      // 2枚の写真の間を、進み具合でなめらかに入れ替える
      const f = (s.along - i0 * STEP) / STEP, k = Math.min(1, Math.max(0, (f - 0.25) / 0.5));
      u.mixK.value = okB ? (okA ? k * k * (3 - 2 * k) : 1) : 0;
      const bg = scene.background, fog = scene.fog;
      scene.background = null;
      scene.fog = null;
      scene.overrideMaterial = m;
      camera.layers.set(2);
      renderer.autoClear = false;
      renderer.render(scene, camera);
      renderer.autoClear = true;
      scene.overrideMaterial = null;
      camera.layers.set(0);
      scene.background = bg;
      scene.fog = fog;
      return true;
    }
    return {
      render,
      on: () => on,
      set(v) {
        on = v && !!G3.getKey();
        if (!on) err = "";
        return on;
      },
      info: () => `写真の街: 今月のタイル ${usage().n}/${CAP_M}・持っている写真 ${[...panos.values()].filter((x) => x.state === "ok").length}${err ? "・" + err : ""}`,
      credit: () => copy,
      _panos: () => panos,
    };
  })();
  const TIMES = {
    day: { sky: [[0, "#3f7fd0"], [0.5, "#8fbbe8"], [0.7, "#d6e4f0"], [1, "#e4ebf0"]], fog: 0xc9d6e2, near: 220, far: 1100, hemi: [0xe6efff, 0x8a8478, 1.05], sun: [0xfff4e2, 1.1, [-0.35, 0.8, 0.45]], glow: 0, win: 0, ground: 0x3b3d40, photo: 0xffffff },
    dusk: { sky: [[0, "#0b1230"], [0.45, "#27306a"], [0.62, "#b0567a"], [0.72, "#f0a060"], [1, "#f0a060"]], fog: 0x6a4a66, near: 120, far: 620, hemi: [0xaab4ff, 0x3a3038, 0.85], sun: [0xffb070, 0.9, [-0.6, 0.35, 0.5]], glow: 0.85, win: 0.75, ground: 0x23272b, photo: 0xb8aab4 },
    night: { sky: [[0, "#02040c"], [0.6, "#0a1430"], [0.75, "#1c2340"], [1, "#2a2a3a"]], fog: 0x141a2c, near: 90, far: 520, hemi: [0x5a6aa0, 0x10121a, 0.5], sun: [0x8aa0ff, 0.25, [0.3, 0.6, -0.4]], glow: 1.1, win: 1, ground: 0x15171a, photo: 0x6a6e80 },
  };
  let skyFlat = null;
  // 街灯の灯具と、足もとの光の輪(昼は消える)。材質は1つずつにして、時間帯で明るさだけ変える
  let LAMP = null;
  function lampMats() {
    if (LAMP) return LAMP;
    const THREE = T();
    const cv = document.createElement("canvas");
    cv.width = cv.height = 128;
    const x = cv.getContext("2d"), gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(255,236,196,1)");
    gr.addColorStop(0.35, "rgba(255,226,180,0.55)");
    gr.addColorStop(0.75, "rgba(255,214,160,0.12)");
    gr.addColorStop(1, "rgba(255,210,150,0)");
    x.fillStyle = gr;
    x.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(cv);
    LAMP = {
      head: new THREE.MeshBasicMaterial({ color: 0x55575b }),
      pool: new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -8, fog: false }),
    };
    LAMP.halo = new THREE.PointsMaterial({ map: tex, size: 2.6, sizeAttenuation: true, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
    LAMP.pool.visible = LAMP.halo.visible = false;
    return LAMP;
  }
  function lampTime(m) {
    const L = lampMats(), on = m === "night" ? 1 : m === "dusk" ? 0.55 : 0;
    L.head.color.setHex(on ? 0xfff4dc : 0x55575b);
    L.pool.opacity = on * 0.6;
    L.halo.opacity = on * 0.85;
    L.pool.visible = L.halo.visible = on > 0;
  }
  function setTime(m) {
    lampTime(TIMES[m] ? m : "day");
    const THREE = T();
    const c = TIMES[m] || TIMES.day;
    timeMode = TIMES[m] ? m : "day";
    try {
      localStorage.setItem("city_time", timeMode);
    } catch (e) {}
    // 空: ぐるり360度の絵にして、雲・太陽(夜は月と星)・地平線のかすみを描く。窓や車にも、この空が映る
    const cv = document.createElement("canvas"), SW = 2048, SH = 1024;
    cv.width = SW;
    cv.height = SH;
    const x = cv.getContext("2d"), gr = x.createLinearGradient(0, 0, 0, SH / 2);
    // 色の変わり目を地平線の近くに寄せる(空の高い所まで青く。寄せないと、見える範囲がほとんど白っぽくなる)
    for (const [o, col] of c.sky) gr.addColorStop(Math.pow(o, 0.4), col);
    x.fillStyle = gr;
    x.fillRect(0, 0, SW, SH / 2);
    x.fillStyle = c.sky[c.sky.length - 1][1];
    x.fillRect(0, SH / 2, SW, SH / 2);
    const sdir = new THREE.Vector3(...c.sun[2]).normalize();
    const sunX = (Math.atan2(sdir.z, sdir.x) / (2 * Math.PI) + 0.5) * SW, sunY = (0.5 - Math.asin(sdir.y) / Math.PI) * SH;
    const night = m === "night", dusk = m === "dusk";
    // 星(夜)
    if (night) for (let i = 0; i < 700; i++) ((x.fillStyle = `rgba(255,255,${220 + Math.floor(hash(i * 3) * 35)},${0.3 + hash(i * 5) * 0.7})`), x.fillRect(hash(i * 7) * SW, hash(i * 11) * SH * 0.46, hash(i * 13) < 0.1 ? 2 : 1, hash(i * 13) < 0.1 ? 2 : 1));
    // 太陽(月)と、そのまわりの光
    for (const ox of [0, SW, -SW]) {
      const g2 = x.createRadialGradient(sunX + ox, sunY, 0, sunX + ox, sunY, night ? 90 : 420);
      g2.addColorStop(0, night ? "rgba(235,240,255,0.9)" : dusk ? "rgba(255,220,170,1)" : "rgba(255,255,244,1)");
      g2.addColorStop(night ? 0.14 : 0.035, night ? "rgba(235,240,255,0.85)" : dusk ? "rgba(255,200,140,0.95)" : "rgba(255,255,240,0.95)");
      g2.addColorStop(night ? 0.2 : 0.09, night ? "rgba(160,180,255,0.18)" : dusk ? "rgba(255,170,100,0.5)" : "rgba(255,250,225,0.45)");
      g2.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = g2;
      x.fillRect(sunX + ox - 430, sunY - 430, 860, 860);
    }
    // 雲: やわらかい丸を重ねたかたまり。上が明るく、下が少し暗い。地平線に近いほど小さく、つぶれて見える
    const cl = night ? [40, 46, 70] : dusk ? [255, 190, 160] : [255, 255, 255], sh2 = night ? [20, 24, 40] : dusk ? [120, 80, 110] : [176, 188, 204];
    for (let i = 0; i < 46; i++) {
      const cx = hash(i * 17 + 3) * SW, v = 0.06 + hash(i * 19 + 5) * 0.4, cy = v * SH, k = 0.35 + v * 1.6, w = (60 + hash(i * 23) * 150) / k, n = 14 + Math.floor(hash(i * 29) * 14);
      for (let pass = 0; pass < 2; pass++)
        for (let q = 0; q < n; q++) {
          const px = cx + (hash(i * 31 + q * 7) - 0.5) * w * 2.2, py = cy + (hash(i * 37 + q * 11) - 0.5) * w * 0.34 + (pass ? -w * 0.08 : w * 0.06), r = w * (0.22 + hash(i * 41 + q * 13) * 0.3);
          const col = pass ? cl : sh2;
          for (const ox of [0, SW, -SW]) {
            const g3 = x.createRadialGradient(px + ox, py, 0, px + ox, py, r);
            g3.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},${pass ? 0.5 : 0.34})`);
            g3.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
            x.fillStyle = g3;
            x.save();
            x.translate(px + ox, py);
            x.scale(1, 0.5);
            x.fillRect(-r, -r, r * 2, r * 2);
            x.restore();
          }
        }
    }
    // 地平線のかすみ
    const hz = x.createLinearGradient(0, SH * 0.445, 0, SH * 0.51);
    const fc = new THREE.Color(c.fog), fs = `${Math.round(fc.r * 255)},${Math.round(fc.g * 255)},${Math.round(fc.b * 255)}`;
    hz.addColorStop(0, `rgba(${fs},0)`);
    hz.addColorStop(0.8, `rgba(${fs},0.75)`);
    hz.addColorStop(1, `rgba(${fs},1)`);
    x.fillStyle = hz;
    x.fillRect(0, SH * 0.445, SW, SH * 0.6);
    const tx = new THREE.CanvasTexture(cv);
    tx.encoding = THREE.sRGBEncoding;
    tx.mapping = THREE.EquirectangularReflectionMapping;
    // 映り込みを撮るとき用の、かんたんな空(色のぼかしだけ)。360度の絵は、映り込みの撮影では黒く写ってしまうため
    const fcv = document.createElement("canvas");
    fcv.width = 4;
    fcv.height = 256;
    const fx = fcv.getContext("2d"), fg = fx.createLinearGradient(0, 0, 0, 256);
    for (const [o, col] of c.sky) fg.addColorStop(o, col);
    fx.fillStyle = fg;
    fx.fillRect(0, 0, 4, 256);
    if (skyFlat) skyFlat.dispose();
    skyFlat = new THREE.CanvasTexture(fcv);
    skyFlat.encoding = THREE.sRGBEncoding;
    if (scene.background && scene.background.dispose) scene.background.dispose();
    scene.background = tx;
    // 窓に映る空の色(真上と、地平線のあたり)。夜は映り込みを弱める
    if (facU.uZen.value) {
      facU.uZen.value.set(c.sky[0][1]).convertSRGBToLinear();
      facU.uHor.value.set(c.sky[Math.min(2, c.sky.length - 1)][1]).convertSRGBToLinear();
      facU.uRefl.value = m === "night" ? 0.45 : 1;
    }
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
    const sel = $("ct-tod");
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
      a.setXYZ(i, x, Terrain.h0(x, z) - 0.12, z);
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
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" }); // alpha: ストリートビューの上に、乗り手だけを重ねて描くため
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
    lights.hemi.layers.enable(1); // 1番の層 = ストリートビューに重ねる物(自分とライバル)
    lights.sun.layers.enable(1);
    // 影(PCだけ。自分のまわり140m四方に、建物・木・電柱・自転車の影を落とす)
    if (innerWidth >= 900) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      const sh = lights.sun.shadow;
      lights.sun.castShadow = true;
      // 4096点で160m四方(1点 約4cm)。前方を広く取るよう、中心は乗り手の少し先に置く(下の光の追従で)
      sh.mapSize.set(4096, 4096);
      Object.assign(sh.camera, { left: -80, right: 80, top: 80, bottom: -80, near: 1, far: 500 });
      sh.bias = -0.0008;
      sh.normalBias = 0.04;
    }
    camera = new THREE.PerspectiveCamera(60, 1, 0.3, 1400);
    ground = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), Xing.holeMat(new THREE.MeshLambertMaterial({ color: 0x23272b })));
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
    for (const m of [mats.bld, mats.pcol]) popMat(m);
    for (const m of mats.fac) facMat(m);
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
  // ゴールの門: 道をまたぐアーチと、市松もようの幕・「GOAL」。目的地の少し手前(8m)に立てる
  function buildGoal() {
    const THREE = T();
    const al = Math.max(0, route.length - 8), p = at(al), r = Roads.ride(al);
    const W = Math.max(5, (r ? r.W : 5) + 1.2), off = r ? r.off + 0.9 - (r.W || 4) / 2 : 0;
    const g = new THREE.Group();
    const post = new THREE.MeshStandardMaterial({ color: 0xe8e8ec, metalness: 0.6, roughness: 0.3 });
    const cv = document.createElement("canvas");
    cv.width = 1024;
    cv.height = 128;
    const c = cv.getContext("2d");
    for (let y = 0; y < 4; y++) for (let x = 0; x < 32; x++) ((c.fillStyle = (x + y) % 2 ? "#111" : "#fff"), c.fillRect(x * 32, y * 32, 32, 32));
    c.fillStyle = "#d8302a";
    c.fillRect(352, 0, 320, 128);
    c.fillStyle = "#fff";
    c.font = "900 96px sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("GOAL", 512, 68);
    const tex = new THREE.CanvasTexture(cv);
    tex.encoding = THREE.sRGBEncoding;
    const banner = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.9, W), [new THREE.MeshBasicMaterial({ map: tex }), new THREE.MeshBasicMaterial({ map: tex }), post, post, post, post]);
    banner.position.y = 4.6;
    g.add(banner);
    for (const sz of [-1, 1]) {
      const q = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 5.1, 12), post);
      q.position.set(0, 2.55, (sz * W) / 2);
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.3, 0.7), new THREE.MeshLambertMaterial({ color: 0x2a2c30 }));
      base.position.set(0, 0.15, (sz * W) / 2);
      g.add(q, base);
    }
    // 路面のゴールライン
    const line = new THREE.Mesh(new THREE.PlaneGeometry(0.9, W), new THREE.MeshBasicMaterial({ map: tex }));
    line.rotation.x = -Math.PI / 2;
    line.position.y = 0.09;
    g.add(line);
    const x = p.x + p.tz * off, z = p.z - p.tx * off;
    g.position.set(x, H(x, z), z);
    g.rotation.y = -Math.atan2(p.tz, p.tx);
    g.traverse((o) => o.isMesh && (o.castShadow = true));
    scene.add(g);
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
    routeStrip = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x35d6ff, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -6 }));
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
    Xing.sync(0);
    photoStyle();
    wantPhotos(0);
    Plateau.want(0);
    Roads.want(0);
    buildGoal();
    Traffic._tpl(); // 車と人の形は、待っている間に作っておく(走り出してから作ると、その瞬間に引っかかる)
    hudDuel();
    // 最初の街が出るまで待つ(長くても40秒。出なければ道の線だけで走り出す)
    sim.paused = true;
    const wait = $("ct-wait");
    wait.hidden = false;
    const t0 = Date.now();
    const iv = setInterval(() => {
      const g3 = $("ct-google") && $("ct-google").checked && !SV.on();
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
    // 赤信号・黄色: 自分と同じように、停止線までに必ず止まる(ゆっくり減速するだけだと、止まりきれずに通り抜けていた)
    const rsig = Signals.limit(s.rAlong, s.t, s.rV);
    if (s.rV > rsig) s.rV = Math.max(rsig, s.rV - 5 * dt);
    if (rsig === 0 && s.rV < 0.3) s.rV = 0;
    const rNext = Signals.gate(s.rAlong, s.rAlong + s.rV * dt, s.t);
    if (rNext < s.rAlong + s.rV * dt - 1e-6) s.rV = 0;
    s.rAlong = Math.min(route.length, rNext);
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
  // 右上の地図: 地図アプリ風(淡い色の地図・青いルート・青い現在地)。＋−やホイールで拡大縮小、「全体」でルート全体
  let miniZ = 16.2, miniFit = false;
  const mapImgs = new Map();
  function mapTile(z, x, y) {
    const key = z + "/" + x + "/" + y;
    let im = mapImgs.get(key);
    if (!im) {
      im = new Image();
      im.crossOrigin = "anonymous";
      im.src = `https://cyberjapandata.gsi.go.jp/xyz/pale/${key}.png`;
      mapImgs.set(key, im);
      if (mapImgs.size > 260) mapImgs.delete(mapImgs.keys().next().value);
    }
    return im.complete && im.naturalWidth ? im : null;
  }
  const merc = (lat, lon) => [(lon + 180) / 360, (1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2];
  function miniZoom(d) {
    if (miniFit && route && route.fitZ) miniZ = route.fitZ;
    miniFit = false;
    miniZ = Math.max(11, Math.min(18.6, miniZ + d));
  }
  function drawMini() {
    const cv = $("ct-mini"), dpr = Math.min(2, window.devicePixelRatio || 1);
    const cw = Math.round(cv.clientWidth * dpr) || 200, ch = Math.round(cv.clientHeight * dpr) || 200;
    if (cv.width !== cw || cv.height !== ch) (cv.width = cw), (cv.height = ch);
    const c = cv.getContext("2d"), W = cw, H = ch;
    const ll = (x, z) => merc(route.lat0 - z / route.kz, route.lon0 + x / route.kx);
    if (!route.mxy) {
      route.mxy = route.xy.map(([x, z]) => ll(x, z));
      let x0 = 9, x1 = -9, y0 = 9, y1 = -9;
      for (const [x, y] of route.mxy) (x0 = Math.min(x0, x)), (x1 = Math.max(x1, x)), (y0 = Math.min(y0, y)), (y1 = Math.max(y1, y));
      route.mbox = { x0, x1, y0, y1 };
    }
    const p = at(sim.along);
    let cx, cy, z;
    if (miniFit) {
      const b = route.mbox;
      z = Math.min(17, Math.log2(Math.min((W / dpr - 36) / Math.max(1e-9, (b.x1 - b.x0) * 256), (H / dpr - 36) / Math.max(1e-9, (b.y1 - b.y0) * 256))));
      route.fitZ = z;
      cx = (b.x0 + b.x1) / 2;
      cy = (b.y0 + b.y1) / 2;
    } else {
      [cx, cy] = ll(p.x, p.z);
      z = miniZ;
    }
    const Z = Math.max(5, Math.min(18, Math.ceil(z - 0.15))), n = 2 ** Z * 256, k = 2 ** (z - Z) * dpr;
    const x0 = cx * n - W / 2 / k, y0 = cy * n - H / 2 / k;
    c.fillStyle = "#f2efe9";
    c.fillRect(0, 0, W, H);
    for (let tx = Math.floor(x0 / 256); tx <= Math.floor((x0 + W / k) / 256); tx++)
      for (let ty = Math.floor(y0 / 256); ty <= Math.floor((y0 + H / k) / 256); ty++) {
        const im = mapTile(Z, tx, ty);
        if (im) c.drawImage(im, (tx * 256 - x0) * k, (ty * 256 - y0) * k, 256 * k + 0.5, 256 * k + 0.5);
      }
    const M = ([mx, my]) => [(mx * n - x0) * k, (my * n - y0) * k];
    const toPx = (x, zz) => M(ll(x, zz));
    // ルート: 白いふち+青。走り終えたところは灰色
    let done = 0;
    while (done < route.cum.length - 1 && route.cum[done + 1] < sim.along) done++;
    const line = (i0, i1, w, col, extra) => {
      c.strokeStyle = col;
      c.lineWidth = w * dpr;
      c.beginPath();
      for (let i = i0; i <= i1; i++) {
        const [qx, qy] = M(route.mxy[i]);
        if (i === i0) c.moveTo(qx, qy);
        else c.lineTo(qx, qy);
      }
      if (extra) c.lineTo(extra[0], extra[1]);
      c.stroke();
    };
    c.lineCap = c.lineJoin = "round";
    const me = toPx(p.x, p.z), last = route.mxy.length - 1;
    line(0, last, 7.5, "#ffffff");
    line(0, last, 5, "#4285f4");
    line(0, done, 5, "#9aa7b8", me);
    // ゴールの赤いピン
    const [gx, gy] = M(route.mxy[last]);
    c.fillStyle = "#ea4335";
    c.strokeStyle = "#fff";
    c.lineWidth = 1.5 * dpr;
    c.beginPath();
    c.arc(gx, gy - 11 * dpr, 6.5 * dpr, Math.PI * 0.85, Math.PI * 0.15);
    c.lineTo(gx, gy);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = "#fff";
    c.beginPath();
    c.arc(gx, gy - 11 * dpr, 2.3 * dpr, 0, Math.PI * 2);
    c.fill();
    // ライバル(赤い丸)
    const r = at(sim.rAlong), [rx, ry] = toPx(r.x, r.z);
    c.fillStyle = "#ff4455";
    c.lineWidth = 2 * dpr;
    c.beginPath();
    c.arc(rx, ry, 5 * dpr, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // 自分: 青い丸と、進む向きの扇
    const ang = Math.atan2(p.tz, p.tx);
    const gr = c.createRadialGradient(me[0], me[1], 0, me[0], me[1], 34 * dpr);
    gr.addColorStop(0, "rgba(66,133,244,0.55)");
    gr.addColorStop(1, "rgba(66,133,244,0)");
    c.fillStyle = gr;
    c.beginPath();
    c.moveTo(me[0], me[1]);
    c.arc(me[0], me[1], 34 * dpr, ang - 0.5, ang + 0.5);
    c.closePath();
    c.fill();
    c.fillStyle = "#4285f4";
    c.strokeStyle = "#fff";
    c.lineWidth = 2.5 * dpr;
    c.beginPath();
    c.arc(me[0], me[1], 7 * dpr, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // 縮尺
    const lat = route.lat0 - p.z / route.kz;
    const mpp = (40075016 * Math.cos((lat * Math.PI) / 180)) / (256 * 2 ** z); // 画面1pxあたりのm
    let bar = 50;
    for (const v of [20, 50, 100, 200, 500, 1000, 2000, 5000]) if (v / mpp <= 70) bar = v;
    const bw = (bar / mpp) * dpr;
    c.fillStyle = "rgba(255,255,255,0.85)";
    c.fillRect(6 * dpr, H - 18 * dpr, bw + 8 * dpr, 14 * dpr);
    c.fillStyle = "#444";
    c.fillRect(10 * dpr, H - 8 * dpr, bw, 1.5 * dpr);
    c.font = `${9 * dpr}px sans-serif`;
    c.fillText(bar >= 1000 ? bar / 1000 + "km" : bar + "m", 10 * dpr, H - 10 * dpr);
    c.fillStyle = "rgba(255,255,255,0.85)";
    c.fillRect(W - 50 * dpr, H - 13 * dpr, 50 * dpr, 13 * dpr);
    c.fillStyle = "#555";
    c.fillText("地理院地図", W - 47 * dpr, H - 3.5 * dpr);
  }

  // 向きをならすときの [位置のずれ(m), 重み] の並び(毎コマ作り直さない)
  const SMOOTH = [-3, 1, -1.5, 2, 0, 3, 1.5, 3, 3, 2, 5, 1];
  // side: 走る位置(車道の左端から約0.9m)から、さらに右へ何m
  function riderPos(along, side) {
    const p = at(along), r = Roads.ride(along), o = (r ? r.off : 0) - side;
    // 向きは、少し後ろ〜少し先の向きをならして使う(道の折れ目でカクッと向きが変わらないように)
    {
      let tx = 0, tz = 0;
      for (let i = 0; i < 12; i += 2) {
        const q = at(along + SMOOTH[i]), w = SMOOTH[i + 1];
        (tx += q.tx * w), (tz += q.tz * w);
      }
      const L = Math.hypot(tx, tz);
      if (L > 1e-3) (p.tx = tx / L), (p.tz = tz / L);
    }
    const x = p.x + p.tz * o, z = p.z - p.tx * o;
    // 道の面(アスファルト)は地面より約6.5cm上に敷いてある。その面にタイヤを乗せる(地面の高さのままだとタイヤが沈む)
    return { x, z, y: H(x, z) + (r ? 0.068 : 0), tx: p.tx, tz: p.tz };
  }
  function placeBiker(b, along, side, dt, v, pedaling) {
    const p = riderPos(along, side);
    b.g.position.set(p.x, p.y, p.z);
    // 実際のロードバイクらしい動き: コーナーでは速さと曲がり具合に合わせて車体を倒す、坂では前後に傾く、
    // 立ちこぎ(スプリント・きつい上り)では車体を左右に振る、下りの速い所は脚を止める、止まったら少し左へ傾けて足をつく
    const d = b.dyn || (b.dyn = { lean: 0, pitch: 0, ph: 0, cad: 0 });
    const q0 = at(along - 4), q1 = at(along + 5);
    const kap = Math.asin(Math.max(-1, Math.min(1, q0.tx * q1.tz - q0.tz * q1.tx))) / 9; // 曲がり具合(1/m)。右が正
    const gr = Terrain.grade(along) / 100;
    let lean = Math.max(-0.48, Math.min(0.48, Math.atan((v * v * kap) / 9.8)));
    const coast = gr < -0.035 && v > 9.5;
    const cadW = !pedaling || coast ? 0 : Math.max(5.5, Math.min(10.8, 3.2 + v * 0.62 - Math.max(0, gr) * 28)) * (b.sp ? 1.18 : 1);
    d.cad += (cadW - d.cad) * Math.min(1, dt * 3);
    d.ph += d.cad * dt;
    const stand = pedaling && (b.sp || gr > 0.055) ? 1 : 0;
    d.stand = (d.stand || 0) + (stand - (d.stand || 0)) * Math.min(1, dt * 4);
    lean += Math.sin(d.ph) * 0.085 * d.stand; // 立ちこぎの振り
    if (v < 0.4) lean = -0.06; // 止まっているときは左足をつく
    else if (v < 3) lean += Math.sin(d.ph * 0.5) * 0.02; // ゆっくりのときのふらつき
    d.lean += (lean - d.lean) * Math.min(1, dt * 5);
    d.pitch += (Math.atan(gr) - d.pitch) * Math.min(1, dt * 4);
    b.g.rotation.order = "YXZ";
    b.g.rotation.y = -Math.atan2(p.tz, p.tx) - d.lean * 0.12 * d.stand;
    b.g.rotation.x = d.lean;
    b.g.rotation.z = d.pitch;
    b.pose(d.cad * dt, (v * dt) / 0.34);
    return p;
  }

  // 画面の書きかえの速さ(1秒に何回。60/90/120/144…)を、起動時に requestAnimationFrame の間隔から測る。
  // 120Hz の画面なら120コマを目指す(下の autoRes の目標や、影・映り込みを作り直す間隔に使う)
  const Rate = (() => {
    const KNOWN = [48, 50, 60, 72, 75, 90, 100, 120, 144, 165, 180, 240];
    let hz = 60, done = false;
    function measure() {
      if (typeof requestAnimationFrame !== "function") return;
      const ts = [];
      const step = (t) => {
        ts.push(t);
        if (ts.length < 50) return requestAnimationFrame(step);
        // はじめの10コマは読み込みで乱れるので捨てて、間隔の真ん中の値を使う
        const gaps = [];
        for (let i = 11; i < ts.length; i++) gaps.push(ts[i] - ts[i - 1]);
        gaps.sort((x, y) => x - y);
        const raw = 1000 / Math.max(1, gaps[gaps.length >> 1]);
        // 45より遅いのは、画面ではなく端末が重いだけ(測れていない)なので、60のままにする
        if (raw >= 45) hz = KNOWN.reduce((best, k) => (Math.abs(k - raw) < Math.abs(best - raw) ? k : best), 60);
        done = true;
      };
      requestAnimationFrame(step);
    }
    return {
      measure,
      hz: () => hz,
      done: () => done,
      goal: () => Math.round(hz * 0.9), // 目標のコマ数(画面の速さの約9割)
      // 影と映り込みは1秒に約30回作り直す(60Hzで2コマに1回、120Hzで4コマに1回。見え方は60Hzのときと同じ)
      every: () => Math.max(2, Math.round(hz / 30)),
    };
  })();

  // 画面の細かさを、端末の速さに合わせて上げ下げする(コマ数が落ちたら少し粗くして、なめらかさを優先)
  // 目標は画面の速さの約9割(60Hzなら54、120Hzなら108コマ)。それを十分下回ると粗くし(約83%)、上回ると戻す(約95%)
  const res = { t: 0, n: 0, slow: 0, cool: 0 };
  function autoRes(dt) {
    const max = Math.min(2, window.devicePixelRatio || 1);
    const k = Rate.hz() / 60; // 60Hzのときの数字を、画面の速さに合わせてのばす
    if (res.pr == null) res.pr = renderer.getPixelRatio();
    (res.t += dt), res.n++;
    if (dt > 0.034 / k) res.slow++;
    res.cool -= dt;
    if (res.t < 1.2) return;
    const fps = res.n / res.t, slow = res.slow / res.n;
    (res.t = 0), (res.n = 0), (res.slow = 0);
    if (document.hidden || res.cool > 0) return;
    let pr = res.pr;
    // いちばん粗くしてもコマ数が足りないときは、影をやめる(見た目より、なめらかさを優先)
    const floor = Math.min(1, max);
    // まず本格的な映り込みをやめる(次に影)
    // 映り込みと影をやめるのは見た目が変わるので、画面が120Hzでも「本当に遅いとき(42・45コマ未満)」だけのまま
    if (pr <= floor + 0.01 && fps < 42 && Refl.on()) {
      if ((res.lowR = (res.lowR || 0) + 1) >= 3) {
        Refl.set(false, true);
        if ($("ct-refl")) $("ct-refl").checked = false;
        ticker("動きを優先して、映り込みを軽くしました", "opp");
      }
      return;
    }
    if (pr <= floor + 0.01 && fps < 45 && renderer.shadowMap.enabled) {
      if ((res.low = (res.low || 0) + 1) >= 3) {
        renderer.shadowMap.enabled = false;
        lights.sun.castShadow = false;
        scene.traverse((o) => o.material && (Array.isArray(o.material) ? o.material.forEach((m) => (m.needsUpdate = true)) : (o.material.needsUpdate = true)));
      }
    } else res.low = 0;
    if (fps < 50 * k || slow > 0.15) pr = Math.max(Math.min(1, max), pr * (fps < 35 * k ? 0.78 : 0.88)); // 等倍より粗くはしない(ぼやけて見えるため)
    else if (fps > 57 * k && slow < 0.03 && pr < max) pr = Math.min(max, pr * 1.07), (res.cool = 4);
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
      const ms = g.length ? g.reduce((a, b) => a + b, 0) / g.length : 0; // 1コマの平均時間
      // work: そのうち、このアプリの処理(描く命令を出すまで)にかかった平均
      const work = Object.entries(this.sum).reduce((a, [k, v]) => a + (k === "描画待ち・その他" ? 0 : v), 0) / Math.max(1, this.n);
      // 遅いコマ: 画面の書きかえ2回ぶんより長くかかったコマ(60Hzなら34ms)
      const lim = 34 * (60 / Rate.hz());
      const r = { fps: ms ? 1000 / ms : 0, ms, work, p50: q(0.5), p99: q(0.99), worst: q(1), slow: g.filter((x) => x > lim).length, n: g.length, top, avg };
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
  let camWant = null; // カメラを置きたい場所(毎コマ作り直さない)
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
      if ((s.tileT = (s.tileT || 0) + real) > 1.5) (s.tileT = 0), wantTiles(s.along), Xing.sync(s.along), Roads.want(s.along), Plateau.want(s.along), G3.on() || wantPhotos(s.along);
    }
    // 走るラインの帯は、地面の高さが届くたびに敷き直す(古い高さのままだと浮いて、タイヤが沈んで見える)
    if ((s.stripT = (s.stripT == null ? 9 : s.stripT) + real) > 2.5) (s.stripT = 0), rebuildStrip();
    if (photoMore && !G3.on() && (s.phT = (s.phT || 0) + real) > 0.15) (s.phT = 0), wantPhotos(s.along);
    Perf.lap("街の予約");
    // 道の端の人をよける(なめらかに右へ寄って、また左へ戻る)
    s.dodge = (s.dodge || 0) + (Traffic.dodge(s.along) - (s.dodge || 0)) * Math.min(1, real * s.speedX * 3);
    const p = placeBiker(me, s.along, s.dodge, real * s.speedX, s.v, (s.auto || s.pedal) && !s.brake && !s.paused);
    placeBiker(rival, s.rAlong, 1.1, real * s.speedX, s.rV, !s.paused);
    if (G3.on()) rival.g.position.y = G3.rivalY();
    const myPed = (s.auto || s.pedal) && !s.brake && !s.paused && !s.done;
    const mySp = myPed && s.sprint && s.stamina > 0.02;
    me.sp = mySp;
    // ライバルは、ゴール前500mか、ぐっと加速しているときにスプリント
    const rvSp = !s.paused && !s.done && (route.length - s.rAlong < 500 || s.rV > s.rivalV * 1.06);
    rival.sp = rvSp;
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
    const vm = viewMode === "auto" ? "close" : viewMode;
    if (G3.on() && popU.uG3.value) popU.uG3.value.set(p.x, p.z, 585, 670);
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
    const want = (camWant || (camWant = new THREE.Vector3())).set(p.x + bx * back + p.tz * side, p.y + up, p.z + bz * back - p.tx * side);
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
    if (s.frameN % 30 === 0 || !popU.uShops.value) Shops.update(p.x, p.z);
    // 影の地図は1秒に約30回だけ作り直す(60Hzなら2コマに1回)。光の位置も同じコマでだけ動かす(ずれると影がガタガタ揺れる)
    s.frameN = (s.frameN || 0) + 1;
    const shadowNow = s.frameN % Rate.every() === 0;
    if (lights.sun.castShadow && shadowNow) {
      const d = lights.sun.userData.dir || [0, 1, 0];
      // 影の範囲の中心: 進む向きへ35m先(カメラに映る所を広く覆う)。光から見た面の上で、影の地図の1点ずつに合わせて動かす
      // (半端に動くと、影のふちがちらちら揺れる)
      let cx = p.x + p.tx * 35, cy = p.y, cz = p.z + p.tz * 35;
      {
        const dl = Math.hypot(d[0], d[1], d[2]) || 1, lx = d[0] / dl, ly = d[1] / dl, lz = d[2] / dl;
        let rx = lz, rz = -lx; // 横の軸 = 上(0,1,0) × 光の向き
        const rl = Math.hypot(rx, rz) || 1;
        (rx /= rl), (rz /= rl);
        const ux = ly * rz, uy = lz * rx - lx * rz, uz = -ly * rx; // 縦の軸 = 光の向き × 横
        const sc = lights.sun.shadow.camera, tex = (sc.right - sc.left) / lights.sun.shadow.mapSize.x;
        const a = cx * rx + cz * rz, b = cx * ux + cy * uy + cz * uz, c = cx * lx + cy * ly + cz * lz;
        const a2 = Math.round(a / tex) * tex, b2 = Math.round(b / tex) * tex;
        cx = rx * a2 + ux * b2 + lx * c;
        cy = uy * b2 + ly * c;
        cz = rz * a2 + uz * b2 + lz * c;
      }
      lights.sun.position.set(cx + d[0] * 200, cy + d[1] * 200, cz + d[2] * 200);
      lights.sun.target.position.set(cx, cy, cz);
      lights.sun.target.updateMatrixWorld();
    }
    Perf.lap("カメラ・地面");
    Roads.update(s.along, real);
    Perf.lap("道");
    SV.update(real, p, s);
    // ストリートビューのときは、3Dの街は描かない(下に隠れて見えないので、その分軽くする)
    if (SV.showing()) {
      svRender(p);
      if ((s.hudT = (s.hudT || 0) + real) > 0.12) (s.hudT = 0), hud();
      if ((s.perfT = (s.perfT || 0) + real) > 1) (s.perfT = 0), perfHud();
      return;
    }
    G3.update(real);
    riseUpdate(real);
    revealStep();
    Perf.lap("Google3D");
    Refl.update(p);
    Perf.lap("映り込み");
    // 影は数コマに1回だけ作り直す(上の shadowNow と同じコマ)
    if (renderer.shadowMap.enabled) (renderer.shadowMap.autoUpdate = false), (renderer.shadowMap.needsUpdate = shadowNow);
    if (!PV.render(p, s, real)) renderer.render(scene, camera);
    Perf.lap("描く");
    autoRes(real);
    if ((s.hudT = (s.hudT || 0) + real) > 0.12) (s.hudT = 0), hud();
    Perf.lap("表示");
    Perf.loopMs = performance.now() - Perf.t0;
    if ((s.perfT = (s.perfT || 0) + real) > 1) (s.perfT = 0), perfHud();
  }
  // ストリートビューの写真の上に、3Dの自分とライバルだけを重ねて描く(街は描かない。背景は透明)。
  // カメラは、写真を撮った車の屋根の高さ(約2.4m)で、自分の5.5m後ろから、写真と同じ向き・同じ画角で見る
  let svLayered = false;
  function svRender(p) {
    const THREE = T();
    if (!svLayered) {
      svLayered = true;
      for (const b of [me, rival]) b.g.traverse((o) => o.layers.enable(1));
    }
    const h = (SV.heading() * Math.PI) / 180, dx = Math.sin(h), dz = -Math.cos(h); // 北=0・東=90
    camera.position.set(p.x - dx * 5.5, p.y + 2.4, p.z - dz * 5.5);
    camera.lookAt(camera.position.x + dx * 10, camera.position.y - Math.tan((4 * Math.PI) / 180) * 10, camera.position.z + dz * 10);
    // ストリートビューの標準の画角は、横に90度
    camera.fov = (2 * Math.atan(1 / Math.max(0.3, camera.aspect)) * 180) / Math.PI;
    camera.updateProjectionMatrix();
    const bg = scene.background, fog = scene.fog, env = scene.environment;
    scene.background = null;
    scene.fog = null;
    camera.layers.set(1);
    renderer.setClearColor(0x000000, 0);
    renderer.render(scene, camera);
    camera.layers.set(0);
    scene.background = bg;
    scene.fog = fog;
    scene.environment = env;
    sim.camPos = null; // 3Dの街に戻ったとき、カメラを置き直す
  }
  // 性能の表示(左上のパネルの「性能を表示」)。カクつくときに、何が重いかを見る
  function perfHud() {
    const el = $("ct-perf");
    if (!el || el.hidden) return;
    const r = Perf.report(), inf = renderer.info.render;
    const sv = Saved.stat;
    el.innerHTML = `<b>${r.fps.toFixed(0)}コマ/秒</b> 目標 ${Rate.goal()}コマ(画面 ${Rate.hz()}Hz${Rate.done() ? "" : "・計測中"})・1コマ平均 ${r.ms.toFixed(1)}ms(うち処理 ${r.work.toFixed(1)}ms)<br>遅いコマ ${r.slow}/${r.n} ・最悪 ${r.worst.toFixed(0)}ms ・保存から読んだ形: 建物 ${sv.bHit}/${sv.bHit + sv.bNew}・道 ${sv.rHit}/${sv.rHit + sv.rNew}<br>描く量 ${(inf.triangles / 10000).toFixed(0)}万面・${inf.calls}回 ・細かさ×${renderer.getPixelRatio().toFixed(2)}${renderer.shadowMap.enabled ? "・影あり" : ""}<br>平均: ${r.avg.join(" / ")}<br>最悪: ${r.top.join(" / ")}${SV.on() ? `<br>ストリートビュー: ${SV.info()}` : ""}${PV.on() ? `<br>${PV.info()}` : ""}`;
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
    for (const p of saved) if (p.lat && p.lon) list.push({ name: "📍 " + p.name, lat: p.lat, lon: p.lon, via: p.via || [] });
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
      // 行きは目的地の経由地を順に、帰り(登録した場所から出る)は逆の順に通る
      const via = (to.via && to.via.length ? to.via : (from.via || []).slice().reverse()) || [];
      const key = `city_route:${from.lat},${from.lon}:${to.lat},${to.lon}:${via.map((v) => v.lat.toFixed(4) + "," + v.lon.toFixed(4)).join("|")}`;
      let pts = null;
      try {
        pts = JSON.parse(localStorage.getItem(key) || "null");
      } catch (e) {}
      if (!pts) {
        const r = await Nav.fetchRoute(from, to, via);
        pts = r.points;
        try {
          localStorage.setItem(key, JSON.stringify(pts));
        } catch (e) {}
      }
      makeRoute(pts);
      msg.textContent = "坂(標高)を調べています…";
      try {
        await Terrain.prepare();
        msg.textContent = "立体交差を調べています…";
        await Xing.prepare();
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
    // ストリートビューで走るときは、Googleの3Dは読まない(画面に出ないのに、回数だけ使ってしまう)
    const sv0 = $("ct-sv0") && $("ct-sv0").checked && !!G3.getKey();
    if ($("ct-google0").checked && !sv0) G3.set(true).then(syncGoogle);
    if (sv0 && setSVfn) (starting = true), setSVfn(true);
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
    const showVia = () => {
      const el = $("ct-via");
      if (!el) return;
      const list = placeOptions(), to = list[+$("ct-to").value], from = list[+$("ct-from").value];
      const via = (to && to.via && to.via.length ? to.via : ((from && from.via) || []).slice().reverse()) || [];
      el.innerHTML = via.length ? `経由地: ${via.map((v) => esc(v.name)).join(" → ")}` : `経由地: なし <a href="index.html">(走る画面の 設定 → 目的地 →「経由地」で登録できます)</a>`;
    };
    $("ct-from").onchange = $("ct-to").onchange = () => (saveLast(), showVia());
    showVia();
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
    $("ct-mini").addEventListener("click", () => $("ct-mapbox").classList.toggle("big"));
    $("ct-mini").addEventListener("wheel", (e) => (e.preventDefault(), miniZoom(e.deltaY < 0 ? 0.35 : -0.35)), { passive: false });
    $("ct-mz-in").onclick = () => miniZoom(0.6);
    $("ct-mz-out").onclick = () => miniZoom(-0.6);
    $("ct-mz-all").onclick = () => (miniFit = !miniFit);
    $("ct-tod").value = timeMode;
    $("ct-tod").onchange = (e) => sim && setTime(e.target.value);
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
    // 写真の街は、Googleの3D・ストリートビューと同時には使わない(あとから選んだほうを残す)
    const pvOff = () => {
      if (!PV.on()) return;
      PV.set(false);
      for (const k of ["ct-pv", "ct-pv0"]) if ($(k)) $(k).checked = false;
      try {
        localStorage.setItem("city_pv", "0");
      } catch (e) {}
    };
    const setGoogle = async (v) => {
      if (v && !G3.getKey()) {
        $("ct-google0").checked = $("ct-google").checked = false;
        $("ct-msg").textContent = "Googleの3Dを使うには、スタート画面でAPIキーを入れてください";
        return;
      }
      $("ct-google0").checked = $("ct-google").checked = v;
      if (v) pvOff();
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
      if (v) pvOff();
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
      } else {
        SV.stop();
        // ストリートビューをやめたら、Googleの3Dにチェックがあれば、そちらを始める
        if ($("ct-google") && $("ct-google").checked && !G3.on()) G3.set(true).then(syncGoogle);
      }
    };
    setSVfn = setSV;
    for (const id of ["ct-sv", "ct-sv0"]) if ($(id)) $(id).onchange = (e) => setSV(e.target.checked);
    try {
      if ($("ct-sv0")) $("ct-sv0").checked = localStorage.getItem("city_sv") === "1" && !!G3.getKey();
    } catch (err) {}
    const su = SV.usage();
    if ($("ct-svuse")) $("ct-svuse").textContent = `ストリートビューを開いた回数(この端末): 今月 ${su.n}/${su.capM}回・今日 ${su.dn}/${su.capD}回`;
    // 右上のデュエルの盤面を出す/出さない
    for (const id of ["ct-board"])
      if ($(id)) {
        let v = true;
        try {
          v = localStorage.getItem("city_board") !== "0";
        } catch (e) {}
        $(id).checked = v;
        document.body.classList.toggle("no-board", !v);
        $(id).onchange = (e) => {
          document.body.classList.toggle("no-board", !e.target.checked);
          try {
            localStorage.setItem("city_board", e.target.checked ? "1" : "0");
          } catch (err) {}
        };
      }
    if ($("ct-perf0")) $("ct-perf0").onchange = (e) => ($("ct-perf").hidden = !e.target.checked);
    // 写真の街
    for (const id of ["ct-pv", "ct-pv0"])
      if ($(id)) {
        try {
          $(id).checked = localStorage.getItem("city_pv") === "1" && !!G3.getKey();
        } catch (err) {}
        $(id).onchange = (e) => {
          const v = PV.set(e.target.checked);
          // 写真の街は、形のきれいな3Dの街に貼る。Googleの3D(溶けた形)やストリートビューとは一緒に使わない
          if (v) {
            for (const k of ["ct-google", "ct-google0"]) if ($(k) && $(k).checked) (($(k).checked = false), $(k).onchange({ target: $(k) }));
            for (const k of ["ct-sv", "ct-sv0"]) if ($(k) && $(k).checked) (($(k).checked = false), $(k).onchange({ target: $(k) }));
          }
          for (const k of ["ct-pv", "ct-pv0"]) if ($(k)) $(k).checked = v;
          try {
            localStorage.setItem("city_pv", v ? "1" : "0");
          } catch (err) {}
          if (e.target.checked && !v) $("ct-msg").textContent = "写真の街を使うには、APIキーを入れてください";
          $("ct-gm").hidden = !(v || G3.on());
        };
      }
    if ($("ct-pv0") && $("ct-pv0").checked) (PV.set(true), $("ct-pv0").onchange({ target: $("ct-pv0") }));
    if ($("ct-refl")) {
      $("ct-refl").checked = Refl.on();
      $("ct-refl").onchange = (e) => Refl.set(e.target.checked);
    }
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
    // 保存した街(組み立てた形)の大きさと、消すボタン
    if ($("ct-saved")) {
      const show = () =>
        Saved.size().then((b) => {
          $("ct-saved").textContent = b == null ? "保存した街: この端末では保存できません" : `保存した街: ${b < 1048576 && b > 0 ? "1MB未満" : Math.round(b / 1048576) + "MB"}`;
        });
      show();
      $("ct-saved-clear").onclick = async () => {
        if (!confirm("保存した街を消しますか?(次に走るとき、もう一度ダウンロードします)")) return;
        $("ct-saved-clear").disabled = true;
        await Saved.clear();
        $("ct-saved-clear").disabled = false;
        show();
      };
    }
    const keys = { " ": "pedal", ArrowUp: "pedal", ArrowDown: "brake", Shift: "sprint" };
    window.addEventListener("keydown", (e) => {
      if (sim && keys[e.key]) (sim[keys[e.key]] = true), e.key === "Shift" && (sim.pedal = true), e.preventDefault();
    });
    window.addEventListener("keyup", (e) => {
      if (sim && keys[e.key]) (sim[keys[e.key]] = false), e.key === "Shift" && (sim.pedal = false);
    });
  }

  if (typeof document !== "undefined") document.addEventListener("DOMContentLoaded", bind), Rate.measure();
  return { at, turnAhead, readTile, _H: (x, z) => H(x, z), _state: () => ({ Xing, Terrain, PV, Shops, Mons, G3, popU, clipU, sim, route, tiles, failed, camera, Plateau, Roads, scene, me, Traffic, Signals, renderer, Perf, Saved, Rate }), ride: (a) => Roads.ride(a) };
})();
