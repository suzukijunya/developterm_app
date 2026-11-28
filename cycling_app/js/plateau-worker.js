// PLATEAU(国交省の3D都市モデル)の建物タイル(3D Tiles の b3dm)を、シティデュエルの座標に直すワーカー。
// 重い計算(Draco の展開・座標変換・走る道に重なる建物の除外)を、画面を止めずにここでやる。
// 入力: { type: "init", route: { xy, lat0, lon0, kx, kz }, clear }  /  { type: "tile", id, buf, key }  /  { type: "load", id, key, kind }
//   key つきの結果は端末に保存し、次からは load で読むだけにする(下の SHAPE_VER を参照)
// 出力: { id, groups: [{ kind: "t"(写真)/"c"(色つき)/"p"(色なし), img(写真の番号), pos, nor, uv, col }], images: [{ bitmap | bytes, mime }], names, n, skipped }
//   inst: 建物の細部(窓枠・ベランダ・室外機など)の部品の置き方。1つぶん15個の数(下の KIT_* を参照)
//   壁の写真つきの版(LOD2/3/4)は、写真をそのまま貼る(大きすぎる写真は texMax の幅に縮める)

importScripts("vendor/draco/draco_wasm_wrapper.js");

const dracoP = fetch("vendor/draco/draco_decoder.wasm")
  .then((r) => r.arrayBuffer())
  .then((wasmBinary) => new Promise((res) => DracoDecoderModule({ wasmBinary, onModuleLoaded: (m) => res({ m }) })));
// ↑ モジュール自体が then を持つので、そのまま返すと Promise が待ち続ける。{ m } に包んだまま使う

let R = null; // 走るルート { xy, lat0, lon0, kx, kz, grid }
let CLEAR = 3.5;
let TEXMAX = 4096;
let TERRAIN = false;

// ---------- 組み立てた形の保存(IndexedDB) ----------
// 2回目からは、ここで保存した形を読むだけにして、展開と組み立てを飛ばす。読み書きはワーカーの中でやる(画面を止めない)。
// 保存するのは PLATEAU から自前で組み立てた結果だけ。
// ★ 出力の形式や作り方(建物・道の形に関わる所)を変えたら、SHAPE_VER を上げる。古い版の保存は使われず、消される。
const SHAPE_VER = 2;
const SHAPE_MAX = 600 * 1048576; // 上限(約600MB)。超えたら、使っていない古い順に消す
const Shapes = (() => {
  const PRE = "s" + SHAPE_VER + ":";
  let dbp = null;
  // data: キー → 形 / meta: キー → { t: 最後に使った時刻, size: バイト数 }
  function open() {
    if (dbp) return dbp;
    dbp = new Promise((res) => {
      try {
        const rq = indexedDB.open("cycling_city_shapes", 1);
        rq.onupgradeneeded = () => (rq.result.createObjectStore("data"), rq.result.createObjectStore("meta"));
        rq.onsuccess = () => res(rq.result);
        rq.onerror = rq.onblocked = () => res(null);
        setTimeout(() => res(null), 4000); // 返事が来ない端末では、保存なしで進む
      } catch (e) {
        res(null);
      }
    });
    return dbp;
  }
  // 読み書きの終わりを待つ(返事が来ないときも、8秒であきらめて先へ進む)
  const done = (tx) => new Promise((res) => ((tx.oncomplete = () => res(true)), (tx.onerror = tx.onabort = () => res(false)), setTimeout(() => res(false), 8000)));
  async function get(key) {
    const d = await open();
    if (!d || !key) return null;
    try {
      const tx = d.transaction(["data", "meta"], "readwrite");
      const rq = tx.objectStore("data").get(PRE + key);
      rq.onsuccess = () => {
        // 使った時刻を新しくする(古い順に消すため)
        if (rq.result) tx.objectStore("meta").put({ t: Date.now(), size: rq.result.size || 0 }, PRE + key);
      };
      if (!(await done(tx))) return null;
      return rq.result || null;
    } catch (e) {
      return null;
    }
  }
  // 呼んだ時点で中身が写し取られる(このあと配列を画面側へ渡してしまってよい)。先に ready() を待っておくこと
  let db0 = null;
  const ready = async () => (db0 = await open());
  function put(key, rec) {
    if (!db0 || !key) return;
    try {
      const tx = db0.transaction(["data", "meta"], "readwrite");
      tx.objectStore("data").put(rec, PRE + key);
      tx.objectStore("meta").put({ t: Date.now(), size: rec.size || 0 }, PRE + key);
      done(tx).then((ok) => trim(ok ? SHAPE_MAX : 0));
    } catch (e) {}
  }
  // 古い版の保存と、上限を超えたぶん(古い順)を消す。max=0: 書けなかった(容量不足)ので、古い方から4分の1を消す
  let trimming = false;
  async function trim(max) {
    if (trimming || !db0) return;
    trimming = true;
    try {
      const tx = db0.transaction("meta");
      const ks = tx.objectStore("meta").getAllKeys(), vs = tx.objectStore("meta").getAll();
      await done(tx);
      const all = (ks.result || []).map((k, i) => ({ k, t: (vs.result[i] || {}).t || 0, size: (vs.result[i] || {}).size || 0 }));
      const kill = all.filter((e) => !String(e.k).startsWith(PRE));
      const live = all.filter((e) => String(e.k).startsWith(PRE)).sort((a, b) => a.t - b.t);
      let total = live.reduce((a, e) => a + e.size, 0);
      const lim = max || total * 0.75;
      while (live.length > 1 && total > lim) (total -= live[0].size), kill.push(live.shift());
      if (kill.length) {
        const tw = db0.transaction(["data", "meta"], "readwrite");
        for (const e of kill) tw.objectStore("data").delete(e.k), tw.objectStore("meta").delete(e.k);
        await done(tw);
      }
    } catch (e) {}
    trimming = false;
  }
  return { get, put, ready };
})();

self.onmessage = async (e) => {
  const d = e.data;
  if (d.type === "init") {
    R = d.route;
    CLEAR = d.clear || 3.5;
    TEXMAX = d.texMax || 4096;
    TERRAIN = !!d.terrain;
    R.grid = new Map();
    const xy = R.xy;
    for (let i = 0; i < xy.length - 1; i++) {
      const a = xy[i], b = xy[i + 1];
      const x0 = Math.floor((Math.min(a[0], b[0]) - CLEAR) / 50), x1 = Math.floor((Math.max(a[0], b[0]) + CLEAR) / 50);
      const z0 = Math.floor((Math.min(a[1], b[1]) - CLEAR) / 50), z1 = Math.floor((Math.max(a[1], b[1]) + CLEAR) / 50);
      for (let x = x0; x <= x1; x++)
        for (let z = z0; z <= z1; z++) {
          const k = x + ":" + z;
          if (!R.grid.has(k)) R.grid.set(k, []);
          R.grid.get(k).push(i);
        }
    }
    return;
  }
  if (d.type === "load") {
    // 保存してある形を読む(なければ miss)。kind: "tile"(建物)/"mvt"(道)
    try {
      const rec = await Shapes.get(d.key);
      if (!rec) return self.postMessage({ id: d.id, miss: true });
      const tr = [];
      if (d.kind === "mvt") {
        for (const p of rec.polys) for (const r of p.rings) tr.push(r.buffer);
        return self.postMessage({ id: d.id, polys: rec.polys, saved: true }, tr);
      }
      // 写真は、もとの画像のバイト列から、1回目と同じ手順で絵にする
      const out = rec.out;
      out.images = [];
      for (const im of rec.raws) out.images.push(await toBitmap(im.raw, im.mime));
      out.id = d.id;
      out.saved = true;
      for (const g of out.groups) tr.push(g.pos.buffer, g.nor.buffer, g.uv.buffer, g.col.buffer, g.anc.buffer);
      if (out.inst) tr.push(out.inst.buffer);
      for (const im of out.images) tr.push(im.bitmap || im.bytes);
      self.postMessage(out, tr);
    } catch (err) {
      self.postMessage({ id: d.id, miss: true });
    }
    return;
  }
  if (d.type === "mvt") {
    // 道路のベクトルタイル(PLATEAU の交通モデル)→ アプリ座標の多角形
    try {
      const polys = [];
      for (const it of d.bufs) readRoads(it.buf, it.lod, d.z, d.x, d.y, polys);
      const tr = [];
      let size = 0;
      for (const p of polys) for (const r of p.rings) tr.push(r.buffer), (size += r.byteLength);
      if (d.key && (await Shapes.ready())) Shapes.put(d.key, { polys, size });
      self.postMessage({ id: d.id, polys }, tr);
    } catch (err) {
      self.postMessage({ id: d.id, error: String((err && err.message) || err) });
    }
    return;
  }
  if (d.type === "tile") {
    try {
      const out = await tile(d.buf);
      const tr = [];
      let size = 0;
      for (const g of out.groups) tr.push(g.pos.buffer, g.nor.buffer, g.uv.buffer, g.col.buffer, g.anc.buffer), (size += g.pos.byteLength + g.nor.byteLength + g.uv.byteLength + g.col.byteLength + g.anc.byteLength);
      if (out.inst) tr.push(out.inst.buffer), (size += out.inst.byteLength);
      // 保存: 形と、写真のもとの画像(縮める前のバイト列)。配列を画面側へ渡す前に写し取らせる
      const raws = out.raws;
      delete out.raws;
      if (d.key && (await Shapes.ready())) {
        for (const im of raws) size += im.raw.byteLength;
        const images = out.images;
        delete out.images;
        Shapes.put(d.key, { out, raws, size });
        out.images = images;
      }
      out.id = d.id;
      for (const im of out.images) tr.push(im.bitmap || im.bytes);
      self.postMessage(out, tr);
    } catch (err) {
      self.postMessage({ id: d.id, error: String((err && err.message) || err) });
    }
  }
};

// ---------- b3dm を読む ----------
async function tile(buf) {
  const dv = new DataView(buf);
  const u8 = new Uint8Array(buf);
  const td = new TextDecoder();
  if (td.decode(u8.subarray(0, 4)) !== "b3dm") throw new Error("not b3dm");
  const ftj = dv.getUint32(12, true), ftb = dv.getUint32(16, true), btj = dv.getUint32(20, true), btb = dv.getUint32(24, true);
  let p = 28;
  const ft = ftj ? JSON.parse(td.decode(u8.subarray(p, p + ftj))) : {};
  p += ftj + ftb;
  const bt = btj ? JSON.parse(td.decode(u8.subarray(p, p + btj))) : {};
  p += btj + btb;
  // glb
  const glb = p;
  const jsonLen = dv.getUint32(glb + 12, true);
  const gj = JSON.parse(td.decode(u8.subarray(glb + 20, glb + 20 + jsonLen)));
  const binStart = glb + 20 + jsonLen + 8;
  const center = (gj.extensions && gj.extensions.CESIUM_RTC && gj.extensions.CESIUM_RTC.center) || ft.RTC_CENTER || [0, 0, 0];
  const draco = (await dracoP).m;

  const parts = [];
  const usedImg = new Set();
  for (const mesh of gj.meshes || [])
    for (const prim of mesh.primitives || []) {
      const ext = prim.extensions && prim.extensions.KHR_draco_mesh_compression;
      if (!ext) continue;
      const bv = gj.bufferViews[ext.bufferView];
      const arr = new Int8Array(buf, binStart + (bv.byteOffset || 0), bv.byteLength);
      const comps = (name) => {
        const a = gj.accessors[prim.attributes[name]];
        return a ? { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[a.type] || 3 : 3;
      };
      const part = decode(draco, arr, ext.attributes, comps);
      // 材質: 写真(baseColorTexture)があれば、その写真の番号
      const mat = (gj.materials || [])[prim.material] || {};
      const pbr = mat.pbrMetallicRoughness || {};
      const tex = pbr.baseColorTexture ? (gj.textures || [])[pbr.baseColorTexture.index] : null;
      const img = tex ? (tex.source != null ? tex.source : tex.extensions && tex.extensions.EXT_texture_webp ? tex.extensions.EXT_texture_webp.source : null) : null;
      part.img = img != null && part.tex ? img : null;
      part.factor = pbr.baseColorFactor || [1, 1, 1, 1];
      if (part.img != null) usedImg.add(part.img);
      parts.push(part);
    }
  const out = build(parts, center, bt);
  // 写真を取り出して(必要なら縮めて)画像にする
  out.images = [];
  out.raws = []; // 保存用: 写真のもとのバイト列
  const remap = new Map();
  for (const i of usedImg) {
    const im = gj.images[i];
    if (!im || im.bufferView == null) continue;
    const bv = gj.bufferViews[im.bufferView];
    const bytes = buf.slice(binStart + (bv.byteOffset || 0), binStart + (bv.byteOffset || 0) + bv.byteLength);
    remap.set(i, out.images.length);
    out.images.push(await toBitmap(bytes, im.mimeType || "image/jpeg"));
    out.raws.push({ raw: bytes, mime: im.mimeType || "image/jpeg" });
  }
  for (const g of out.groups) if (g.kind === "t") g.img = remap.has(g.img) ? remap.get(g.img) : -1;
  out.groups = out.groups.filter((g) => g.kind !== "t" || g.img >= 0);
  return out;
}

// 写真の大きさ(WebP/PNG/JPEG の頭から読む)。わからなければ null
function imgSize(b, mime) {
  const u = new Uint8Array(b), dv = new DataView(b);
  try {
    if (/webp/.test(mime)) {
      const tag = String.fromCharCode(u[12], u[13], u[14], u[15]);
      if (tag === "VP8 ") return [dv.getUint16(26, true) & 0x3fff, dv.getUint16(28, true) & 0x3fff];
      if (tag === "VP8L") {
        const v = dv.getUint32(21, true);
        return [(v & 0x3fff) + 1, ((v >> 14) & 0x3fff) + 1];
      }
      if (tag === "VP8X") return [(u[24] | (u[25] << 8) | (u[26] << 16)) + 1, (u[27] | (u[28] << 8) | (u[29] << 16)) + 1];
    }
    if (/png/.test(mime)) return [dv.getUint32(16), dv.getUint32(20)];
    if (/jpe?g/.test(mime))
      for (let p = 2; p < u.length - 9; ) {
        if (u[p] !== 0xff) break;
        const m = u[p + 1], len = dv.getUint16(p + 2);
        if (m >= 0xc0 && m <= 0xc3) return [dv.getUint16(p + 7), dv.getUint16(p + 5)];
        p += 2 + len;
      }
  } catch (e) {}
  return null;
}
async function toBitmap(bytes, mime) {
  if (typeof createImageBitmap !== "function") return { bytes, mime };
  try {
    const blob = new Blob([bytes], { type: mime });
    const sz = imgSize(bytes, mime);
    const k = sz ? Math.min(1, TEXMAX / Math.max(sz[0], sz[1])) : 1;
    const opt = k < 1 ? { resizeWidth: Math.round(sz[0] * k), resizeHeight: Math.round(sz[1] * k), resizeQuality: "high" } : {};
    let bm = await createImageBitmap(blob, opt);
    if (bm.width > TEXMAX || bm.height > TEXMAX) {
      const k2 = TEXMAX / Math.max(bm.width, bm.height);
      const small = await createImageBitmap(bm, { resizeWidth: Math.round(bm.width * k2), resizeHeight: Math.round(bm.height * k2), resizeQuality: "high" });
      bm.close();
      bm = small;
    }
    return { bitmap: bm };
  } catch (e) {
    return { bytes, mime };
  }
}

function decode(draco, arr, ids, comps) {
  const dec = new draco.Decoder();
  const mesh = new draco.Mesh();
  const db = new draco.DecoderBuffer();
  db.Init(arr, arr.byteLength);
  const st = dec.DecodeBufferToMesh(db, mesh);
  draco.destroy(db);
  if (!st.ok() || mesh.ptr === 0) throw new Error("draco: " + st.error_msg());
  const attr = (id, comps) => {
    const a = dec.GetAttributeByUniqueId(mesh, id);
    const n = mesh.num_points() * comps, bytes = n * 4;
    const ptr = draco._malloc(bytes);
    dec.GetAttributeDataArrayForAllPoints(mesh, a, draco.DT_FLOAT32, bytes, ptr);
    const out = new Float32Array(draco.HEAPF32.buffer, ptr, n).slice();
    draco._free(ptr);
    return out;
  };
  const pos = attr(ids.POSITION, 3);
  const bid = ids._BATCHID != null ? attr(ids._BATCHID, 1) : new Float32Array(mesh.num_points());
  const tex = ids.TEXCOORD_0 != null ? attr(ids.TEXCOORD_0, 2) : null;
  const cn = ids.COLOR_0 != null ? comps("COLOR_0") : 0;
  const color = cn ? attr(ids.COLOR_0, cn) : null;
  const nIdx = mesh.num_faces() * 3, bytes = nIdx * 4;
  const ptr = draco._malloc(bytes);
  dec.GetTrianglesUInt32Array(mesh, bytes, ptr);
  const idx = new Uint32Array(draco.HEAPF32.buffer, ptr, nIdx).slice();
  draco._free(ptr);
  draco.destroy(mesh);
  draco.destroy(dec);
  return { pos, bid, idx, tex, color, cn };
}

// ---------- 座標: 地心座標(ECEF)→ アプリの平面(x=東, z=南, y=上) ----------
const A = 6378137, F = 1 / 298.257222101, E2 = F * (2 - F); // GRS80(JGD2011)
function geodetic(x, y, z) {
  const b = A * (1 - F), ep2 = (A * A - b * b) / (b * b);
  const pp = Math.hypot(x, y), th = Math.atan2(z * A, pp * b);
  const lon = Math.atan2(y, x);
  const lat = Math.atan2(z + ep2 * b * Math.sin(th) ** 3, pp - E2 * A * Math.cos(th) ** 3);
  const h = pp / Math.cos(lat) - A / Math.sqrt(1 - E2 * Math.sin(lat) ** 2);
  return { lat, lon, h };
}

function build(parts, center, bt) {
  const { lat, lon, h: hc } = geodetic(center[0], center[1], center[2]);
  const sl = Math.sin(lat), cl = Math.cos(lat), so = Math.sin(lon), co = Math.cos(lon);
  const N = A / Math.sqrt(1 - E2 * sl * sl), M = (A * (1 - E2)) / Math.pow(1 - E2 * sl * sl, 1.5);
  const D = Math.PI / 180;
  const latD = lat / D, lonD = lon / D;
  // アプリの地図(project)と同じ縮尺に合わせる
  const cx = (lonD - R.lon0) * R.kx, cz = -(latD - R.lat0) * R.kz;
  const sx = R.kx / (N * cl * D), sz = R.kz / (M * D);
  const names = bt["gml:name"] || [], usage = bt["bldg:usage"] || [];

  // 1) 全頂点をアプリ座標へ。建物(バッチ)ごとに一番低い所をそろえる(地面の起伏はならす)
  let total = 0;
  for (const pt of parts) total += pt.pos.length / 3;
  const P = new Float32Array(total * 3), B = new Int32Array(total);
  let o = 0;
  for (const pt of parts) {
    const q = pt.pos;
    for (let i = 0; i < q.length; i += 3) {
      // glTF は y が上 → 3D Tiles は z が上: (x, y, z) → (x, -z, y)
      const dx = q[i], dy = -q[i + 2], dz = q[i + 1];
      const e = -so * dx + co * dy;
      const n = -sl * co * dx - sl * so * dy + cl * dz;
      const u = cl * co * dx + cl * so * dy + sl * dz;
      P[o * 3] = cx + e * sx;
      P[o * 3 + 1] = u;
      P[o * 3 + 2] = cz - n * sz;
      B[o] = pt.bid[i / 3] | 0;
      o++;
    }
  }
  let maxB = 0;
  for (let i = 0; i < B.length; i++) if (B[i] > maxB) maxB = B[i];
  const NB = maxB + 1;
  const minY = new Float32Array(NB).fill(1e9), maxY = new Float32Array(NB).fill(-1e9);
  const bx0 = new Float32Array(NB).fill(1e9), bx1 = new Float32Array(NB).fill(-1e9), bz0 = new Float32Array(NB).fill(1e9), bz1 = new Float32Array(NB).fill(-1e9);
  for (let i = 0; i < total; i++) {
    const b = B[i], x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2];
    if (y < minY[b]) minY[b] = y;
    if (y > maxY[b]) maxY[b] = y;
    if (x < bx0[b]) bx0[b] = x;
    if (x > bx1[b]) bx1[b] = x;
    if (z < bz0[b]) bz0[b] = z;
    if (z > bz1[b]) bz1[b] = z;
  }
  // 2) 走る道に重なる建物を外す(建物の輪郭=頂点の凸包に、道の線が入る/近すぎる)
  const pts = Array.from({ length: NB }, () => []);
  for (let i = 0; i < total; i++) pts[B[i]].push(P[i * 3], P[i * 3 + 2]);
  const skip = new Uint8Array(NB);
  let skipped = 0;
  for (let b = 0; b < NB; b++) {
    if (!pts[b].length) continue;
    if (onRoute(pts[b], bx0[b], bx1[b], bz0[b], bz1[b])) (skip[b] = 1), skipped++;
  }
  // 3) 三角形ごとに書き出す。写真つきは写真の座標、色つきはその色、色なしは壁に窓の模様・屋根は暗い色
  const groups = new Map();
  const G = (key, kind, img, n) => {
    let g = groups.get(key);
    if (!g) groups.set(key, (g = { kind, img, cap: 0, w: 0, parts: [] }));
    g.cap += n;
    return g;
  };
  // 写真のない建物は、外壁の種類(0=戸建て 1=マンション 2=オフィス・商業)ごとに分ける
  const storeys = bt["bldg:storeysAboveGround"] || [];
  const style = new Uint8Array(NB);
  for (let b = 0; b < NB; b++) {
    const us = String(usage[b] || ""), h = maxY[b] - minY[b], st = +storeys[b] || 0;
    // 0=戸建て 1=マンション 2=オフィス(ガラスの壁) 3=タワーマンション 4=商業ビル(店の入ったビル) 5=戸建て(黒い外壁)
    const hk = hash(b * 53 + Math.round(bx0[b] * 3)), house = hk < 0.22 ? 5 : 0;
    if (/共同住宅/.test(us)) style[b] = h >= 45 || st >= 15 ? 3 : h >= 7 || st >= 3 ? 1 : house;
    else if (/商業|宿泊|娯楽|商業系複合/.test(us)) style[b] = h >= 45 ? 2 : h >= 7 ? 4 : house;
    else if (/業務|官公庁|文教|医療|運輸/.test(us)) style[b] = h >= 9 ? 2 : house;
    else if (/住宅/.test(us)) style[b] = h >= 45 ? 3 : h >= 12 ? 1 : house;
    else style[b] = h >= 45 ? 3 : h >= 22 ? (hk < 0.5 ? 2 : 4) : h >= 11 ? (hk < 0.75 ? 1 : 4) : house;
  }
  const PG = [];
  for (const pt of parts)
    if (pt.img != null) pt.g = G("t" + pt.img, "t", pt.img, pt.idx.length);
    else if (pt.color) pt.g = G("c", "c", null, pt.idx.length);
    else {
      pt.g = null;
      // (屋根を足すぶん、少し多めに場所を取る)
      for (let k = 0; k < 6; k++) (PG[k] = G("p" + k, "p", null, pt.idx.length * 8)), (PG[k].style = k);
    }
  // anc: その頂点が属する建物の「中心x・足もとy・中心z」。近づくと建物ごとに立ち上がる動きに使う
  for (const g of groups.values()) Object.assign(g, { pos: new Float32Array(g.cap * 3), nor: new Int8Array(g.cap * 3), uv: new Float32Array(g.cap * 2), col: new Uint8Array(g.cap * 3), anc: new Float32Array(g.cap * 3) });
  // 戸建ての屋根: 箱のまま(屋根が平ら)の小さな家には、寄棟(よせむね)の屋根をのせる
  const house = new Uint8Array(NB), hx = new Float32Array(NB * 8); // 軸x, 軸z, 中心x, 中心z, 棟の半分の長さ, 屋根の高さ, 壁の高さ, 家の幅の半分
  const slopeB = new Uint8Array(NB); // 傾いた屋根がある建物(屋上の物は置かない)
  {
    const slope = slopeB, other = new Uint8Array(NB), top = Array.from({ length: NB }, () => null);
    let b0 = 0;
    for (const pt of parts) {
      const ix = pt.idx, plain = pt.img == null && !pt.color;
      for (let t = 0; t < ix.length; t += 3) {
        const ia = b0 + ix[t], ib = b0 + ix[t + 1], ic = b0 + ix[t + 2], b = B[ia];
        if (skip[b]) continue;
        if (!plain) { other[b] = 1; continue; }
        if (style[b] !== 0 && style[b] !== 5) continue;
        const ux = P[ib * 3] - P[ia * 3], uy = P[ib * 3 + 1] - P[ia * 3 + 1], uz = P[ib * 3 + 2] - P[ia * 3 + 2];
        const vx = P[ic * 3] - P[ia * 3], vy = P[ic * 3 + 1] - P[ia * 3 + 1], vz = P[ic * 3 + 2] - P[ia * 3 + 2];
        const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, L = Math.hypot(nx, ny, nz) || 1;
        const a = Math.abs(ny / L);
        if (a <= 0.55) continue;
        if (a < 0.97) { slope[b] = 1; continue; }
        for (const i of [ia, ib, ic]) if (P[i * 3 + 1] >= maxY[b] - 0.05) (top[b] || (top[b] = [])).push(P[i * 3], P[i * 3 + 2]);
      }
      b0 += pt.pos.length / 3;
    }
    for (let b = 0; b < NB; b++) {
      const q = top[b], h = maxY[b] - minY[b];
      if (!q || q.length < 6 || slope[b] || other[b] || h < 2.6 || h > 10.5 || bx1[b] - bx0[b] > 24 || bz1[b] - bz0[b] > 24) continue;
      // 屋根の点の広がりから、家の長い向き(棟の向き)を出す
      let mx = 0, mz = 0;
      const n = q.length / 2;
      for (let i = 0; i < q.length; i += 2) (mx += q[i]), (mz += q[i + 1]);
      (mx /= n), (mz /= n);
      let sxx = 0, szz = 0, sxz = 0;
      for (let i = 0; i < q.length; i += 2) {
        const dx = q[i] - mx, dz = q[i + 1] - mz;
        (sxx += dx * dx), (szz += dz * dz), (sxz += dx * dz);
      }
      const ang = 0.5 * Math.atan2(2 * sxz, sxx - szz);
      let ax = Math.cos(ang), az = Math.sin(ang);
      let a0 = 1e9, a1 = -1e9, p0 = 1e9, p1 = -1e9;
      for (let i = 0; i < q.length; i += 2) {
        const dx = q[i] - mx, dz = q[i + 1] - mz, a = dx * ax + dz * az, pp = -dx * az + dz * ax;
        if (a < a0) a0 = a;
        if (a > a1) a1 = a;
        if (pp < p0) p0 = pp;
        if (pp > p1) p1 = pp;
      }
      let hl = (a1 - a0) / 2, hw = (p1 - p0) / 2;
      const ca = (a0 + a1) / 2, cp = (p0 + p1) / 2;
      const cxb = mx + ax * ca - az * cp, czb = mz + az * ca + ax * cp;
      if (hw > hl) [ax, az, hl, hw] = [-az, ax, hw, hl];
      if (hw < 1.2) continue;
      house[b] = 1;
      hx.set([ax, az, cxb, czb, Math.max(0, hl - hw), Math.min(2.6, Math.max(0.9, hw * 0.55)), h, hw], b * 8);
    }
  }
  // ---- 細部(本当の形として足す): 窓枠・水切り・面格子・玄関の庇・室外機・ベランダ・外廊下と鉄骨階段・店の看板とテント・屋上の機械 ----
  // 壁の三角形のうち、下の2点が地面にあるものから「建物の足もとの辺」と外向きがわかる。その辺にそって部品を置く。
  // 形そのものは画面側の部品(KIT_*)を使い回す(インスタンス描画)。ここでは「どの部品を・どこに・どの向き・大きさ・色で」だけを書き出す。
  // 窓枠は、外壁の絵の窓の位置(u = 壁にそった距離 / FW, v = 高さ / FH)から計算して、絵の窓にぴったり重ねる
  const INST = [];
  const roofDone = new Uint8Array(NB);
  let exA = [0, 0, 0];
  // 置く: 部品・場所(x, y, z。y は本当の高さ)・外向き(nx, nz)・大きさ・色(0〜255)・fl(1=写真の街でも消さない)
  const put = (kit, x, y, z, nx, nz, sx, sy, sz, c, fl = 0) => INST.push(kit, x, y, z, Math.atan2(nx, nz), sx, sy, sz, c[0] / 255, c[1] / 255, c[2] / 255, exA[0], exA[1], exA[2], fl);
  // 絵の模様(1枚の幅 W m)の中の横の位置 off(m)が、この辺のどこ(辺の中心からの距離 t)に来るか。辺の中に収まるものを全部
  const along = (E, W, off, half, fn) => {
    const sm = -E.mx * E.nz + E.mz * E.nx, sg = -E.ex * E.nz + E.ez * E.nx, hl = E.L / 2 - half - 0.1;
    if (hl <= 0 || Math.abs(sg) < 0.5) return;
    const k0 = Math.floor((sm - E.L / 2) / W) - 1, k1 = Math.ceil((sm + E.L / 2) / W) + 1;
    for (let k = k0; k <= k1; k++) {
      const t = (k * W + off - sm) / sg;
      if (t >= -hl && t <= hl) fn(t, k);
    }
  };
  // 絵の窓(1枚に2階ぶん。上の階が y=0〜128px)の高さ。1階(3.2mまで)は別の絵なので除く
  const rows = (st, y0p, y1p, hB, fn) => {
    const F = FH[st];
    for (let j = 0; j * F < hB; j++)
      for (const fy of [128, 0]) {
        const yb = j * F + F * (1 - (fy + y1p) / 256), yt = j * F + F * (1 - (fy + y0p) / 256);
        if (yb >= 3.3 && yt <= hB - 0.35) fn(yb, yt, j * 2 + (fy ? 0 : 1));
      }
  };
  // 外壁の絵の窓: [左px, 右px, 上px, 下px, 部品]
  const WINS = { 0: [[34, 108, 38, 92, KIT_WIN2], [150, 206, 38, 92, KIT_WIN2]], 5: [[30, 56, 30, 100, KIT_WIN1], [110, 206, 44, 78, KIT_WIN3]], 1: [[14, 114, 20, 90, KIT_WIN2], [142, 242, 20, 90, KIT_WIN2]], 4: [[14, 72, 34, 84, KIT_WIN2], [90, 148, 34, 84, KIT_WIN2], [166, 224, 34, 84, KIT_WIN2]] };
  const FRAME = [[238, 238, 234], [178, 182, 186], [82, 68, 58], [46, 46, 48]];
  const SIGNC = [[200, 54, 44], [31, 95, 158], [47, 138, 78], [232, 160, 32], [58, 58, 58], [122, 58, 160], [240, 240, 236]];
  // hB: 建物の高さ、hE: この壁の高さ(傾いた屋根の建物では、軒の高さまでの壁がある。窓などは壁の高さまで)
  function extras(b, st, ax, az, bx, bz, nx, nz, y0, hR, ei, hs, hE) {
    const L = Math.hypot(bx - ax, bz - az), hB = Math.min(hR, hE);
    if (L < 1.2) return;
    const ex = (bx - ax) / L, ez = (bz - az) / L, nl = Math.hypot(nx, nz) || 1;
    nx /= nl;
    nz /= nl;
    const mx = (ax + bx) / 2, mz = (az + bz) / 2, hk = hash(b * 131 + ei * 17 + Math.round(ax));
    const bk = hash(b * 977 + Math.round(bx0[b] * 7)), bk2 = hash(b * 389 + 11); // 建物ごとの選び(どの辺でも同じ)
    const E = { mx, mz, ex, ez, nx, nz, L };
    exA = [(bx0[b] + bx1[b]) / 2, y0, (bz0[b] + bz1[b]) / 2];
    // P: 辺の中心から t・壁から外へ d・高さ y(足もとから)に置く。B: 壁から d0〜d1、高さ ya〜yb の箱(長さ len)
    const P = (kit, t, d, y, sx, sy, sz, c, fl) => put(kit, mx + ex * t + nx * d, y0 + y, mz + ez * t + nz * d, nx, nz, sx, sy, sz, c, fl);
    const B = (kit, t, len, d0, d1, ya, yb, c, fl) => P(kit, t, d0, ya, len, yb - ya, d1 - d0, c, fl);
    const house = st === 0 || st === 5;
    const fc = st === 5 ? [34, 34, 36] : st === 1 ? (bk < 0.6 ? [178, 182, 186] : [112, 96, 80]) : st === 4 ? [186, 188, 190] : FRAME[Math.floor(bk * 4)];
    // 上の階の窓: 枠・水切り・中桟。戸建ては、シャッターボックスや戸袋、小さな窓の面格子
    const W = WINS[st];
    if (W && L >= 1.6) {
      const shut = house && bk2 > 0.5, tob = st === 0 && bk2 > 0.25 && bk2 <= 0.5;
      for (const [x0p, x1p, y0p, y1p, kit] of W) {
        const w = ((x1p - x0p) / 256) * FW[st];
        along(E, FW[st], ((x0p + x1p) / 512) * FW[st], w / 2 + 0.08, (t) =>
          rows(st, y0p, y1p, hB, (yb, yt) => {
            const h = yt - yb;
            P(kit, t, 0, (yb + yt) / 2, w, h, 1, fc);
            if (shut && w > 1) B(KIT_BOX, t, w + 0.16, 0, 0.2, yt + 0.06, yt + 0.32, fc);
            else if (tob && w > 1.2) {
              const off = w * 0.75 + 0.08;
              for (const sgn of [1, -1]) if (Math.abs(t + sgn * off) + w * 0.25 < L / 2 - 0.1) { B(KIT_BOX, t + sgn * off, w * 0.5, 0, 0.13, yb - 0.06, yt + 0.06, [216, 208, 192]); break; }
            }
            if (st === 0 && x0p === 150 && hk < 0.6) B(KIT_BARS, t, w + 0.06, 0.07, 0.1, yb - 0.03, yt + 0.03, [206, 206, 202]);
          })
        );
      }
    }
    // 1階(外壁の1階の絵と同じ並び)
    if (house) {
      const cc = bk < 0.5 ? [86, 88, 92] : [226, 224, 218], dc = FRAME[Math.floor(bk2 * 4)];
      for (let n = 0; n < 3; n++) {
        const x0 = n * 7;
        along(E, 21, x0 + [1.0, 4.6, 2.9][n] + 0.45, 0.7, (t) => {
          P(KIT_DOOR, t, 0, 0, 0.9, 2.1, 1, dc);
          B(KIT_BOX, t, 1.4, 0, 0.66, 2.24, 2.32, cc); // 玄関の庇
          B(KIT_EBOX, t + 0.55, 0.12, 0.06, 0.16, 1.72, 1.92, [255, 232, 184]); // 玄関の灯り
        });
        along(E, 21, x0 + [3.4, 1.0, 5.0][n] + 0.8, 0.9, (t) => {
          P(KIT_WIN2, t, 0, 1.55, 1.6, 1.1, 1, fc);
          if (n !== 1) B(KIT_BARS, t, 1.66, 0.07, 0.1, 0.97, 2.13, [214, 214, 210]); // 面格子
        });
        along(E, 21, x0 + [5.6, 3.0, 0.6][n] + 0.4, 0.45, (t) => {
          P(KIT_AC, t, 0, 0, 1, 1, 1, [238, 238, 234]);
          B(KIT_BOX, t + 0.31, 0.08, 0, 0.08, 0.5, 2.6, [232, 232, 228]); // 配管の化粧カバー
        });
        if (n === 0) {
          along(E, 21, x0 + 0.45 + 0.16, 0.2, (t) => B(KIT_BOX, t, 0.34, 0, 0.12, 0.98, 1.44, [156, 47, 42])); // 郵便受け
          along(E, 21, x0 + 6.6 + 0.12, 0.15, (t) => B(KIT_BOX, t, 0.26, 0, 0.1, 0.5, 1.4, [204, 204, 200])); // メーター
        }
      }
      // 雨どい(たて): 辺の端に
      if (hk < 0.55 && hB > 3) {
        const pc = bk2 < 0.5 ? [226, 226, 222] : [74, 64, 56], tp = L / 2 - 0.22;
        B(KIT_BOX, tp, 0.08, 0.03, 0.11, 0, hB - 0.22, pc);
        if (hs) B(KIT_BOX, tp, 0.08, 0.03, 0.56, hB - 0.3, hB - 0.22, pc);
      }
    } else if (st === 1) {
      for (let n = 0; n < 3; n++) {
        const x0 = n * 7.2;
        if (n === 1)
          along(E, 21.6, x0 + 2.6, 1.75, (t) => {
            B(KIT_BOX6, t, 3.5, 0, 1.5, 2.72, 2.9, [92, 94, 98]); // 入口の庇
            for (const o of [-0.9, 0.9]) B(KIT_EBOX, t + o, 0.32, 0.6, 0.92, 2.69, 2.72, [255, 236, 204]);
            B(KIT_BOX, t, 0.06, 0, 0.05, 0, 2.4, [58, 61, 64]);
            B(KIT_EBOX, t + 2.0, 1.3, 0, 0.06, 2.08, 2.18, [214, 196, 150]); // 館名板(文字なし)
          });
        else
          for (const dx of [0.8, 4.4]) {
            along(E, 21.6, x0 + dx + 0.425, 0.6, (t) => {
              P(KIT_DOOR, t, 0, 0, 0.85, 2.0, 1, [150, 150, 146]);
              B(KIT_BOX, t, 1.1, 0, 0.55, 2.12, 2.2, [204, 204, 200]);
            });
            along(E, 21.6, x0 + dx + 1.85, 0.65, (t) => {
              P(KIT_WIN2, t, 0, 1.5, 1.16, 0.88, 1, fc);
              B(KIT_BARS, t, 1.2, 0.07, 0.1, 1.04, 1.96, [214, 214, 210]);
            });
          }
      }
    } else if (st === 3) {
      along(E, 21.6, 7.2 + 3.6, 3.45, (t) => {
        B(KIT_BOX6, t, 6.8, 0, 3.2, 2.9, 3.18, [52, 54, 58]); // 車寄せの庇
        for (const o of [-2.9, 2.9]) B(KIT_BOX, t + o, 0.24, 2.8, 3.04, 0, 2.9, [74, 76, 80]);
        for (const o of [-2.2, 0, 2.2]) B(KIT_EBOX, t + o, 0.6, 1.2, 1.8, 2.86, 2.9, [255, 232, 190]);
        for (const m of [1.8, 3.0, 4.2, 5.4]) B(KIT_BOX, t + m + 0.025 - 3.6, 0.06, 0, 0.07, 0, 2.9, [42, 45, 48]);
      });
    } else if (st === 4) {
      for (let n = 0; n < 4; n++)
        along(E, 24, n * 6 + 3.11, 3.0, (t) => {
          const T = (x) => t + x - 3.11;
          B(KIT_BOX, t, 5.8, 0, 0.16, 2.49, 2.55, [56, 58, 62]); // 看板の枠
          B(KIT_BOX, t, 5.8, 0, 0.16, 3.06, 3.12, [56, 58, 62]);
          B(KIT_BOX, T(0.11), 0.22, 0, 0.1, 0, 3.2, [150, 146, 140]);
          if (n === 0) B(KIT_EBOX, T(0.95), 0.46, 0.16, 0.62, 1.32, 2.08, [216, 54, 44]); // 提灯
          if (n === 1) for (const m of [1.6, 3.1, 4.6]) B(KIT_BOX, T(m + 0.025), 0.06, 0, 0.06, 0.2, 2.55, [40, 44, 48]);
          if (n === 2) P(KIT_AWN, T(3.1), 0, 2.28, 5.6, 0.46, 1.0, [47, 106, 60]);
          if (n === 3) for (const m of [2, 4]) B(KIT_BOX, T(m + 0.025), 0.06, 0, 0.06, 0.3, 2.55, [90, 93, 96]);
        });
    } else if (st === 2) {
      for (let n = 0; n < 4; n++)
        along(E, 24, n * 6 + 3, 3.0, (t) => {
          for (const x of [0.125, 5.875]) B(KIT_BOX, t + x - 3, 0.25, 0, 0.12, 0, 2.55, [172, 172, 168]);
          B(KIT_BOX, t, 6, 0, 0.18, 3.14, 3.2, [70, 72, 76]);
          B(KIT_BOX, t, 6, 0, 0.18, 2.5, 2.55, [70, 72, 76]);
          if (n !== 2) for (const m of [1.6, 3.4, 4.6]) B(KIT_BOX, t + m + 0.03 - 3, 0.06, 0, 0.06, 0, 2.55, [52, 55, 58]);
          if (n === 1 || n === 3) P(KIT_AWN, t, 0, 2.18, 5.8, 0.42, 0.9, n === 1 ? [179, 38, 30] : [47, 106, 60]);
        });
      // カーテンウォールの方立て(1.5mごと)と、階ごとの帯の出っ張り
      if (hB > 4.5) {
        for (let q = 0; q < 4; q++) along(E, 6, ((32 + 64 * q) / 256) * 6, 0.06, (t) => B(KIT_BOX, t, 0.1, 0, 0.16, 3.2, hB - 0.12, [78, 86, 95]));
        for (let f = 1; f * 4 + 1 < hB; f++) B(KIT_BOX, 0, L - 0.04, 0, 0.1, f * 4 + 0.86, f * 4 + 0.96, [204, 207, 212]);
      }
    }
    if (st === 1 || st === 3) {
      // マンション: 南向きの長い辺と、ほかの辺の一部にベランダ。タワーマンションは長い辺ぜんぶ
      const fh = FH[st] / 2, on = st === 3 ? L >= 6 : L >= 5 && (nz > 0.35 || hk < 0.3);
      // 低いアパートの北側は、外廊下と鉄骨の階段
      const corr = st === 1 && !on && nz < -0.35 && L >= 7 && hB <= 12.5;
      if (on) {
        const len = L - 0.8, slab = st === 3 ? [226, 226, 222] : [220, 218, 212];
        const rk = st === 3 ? 3 : bk < 0.45 ? 0 : bk < 0.75 ? 1 : 2; // 0=アルミの縦格子 1=パネル 2=くもりガラス 3=ガラス
        const rc = rk === 0 ? (bk2 < 0.5 ? [176, 180, 184] : [96, 86, 76]) : rk === 1 ? [188, 192, 196] : rk === 2 ? [200, 214, 222] : [150, 190, 214];
        for (let f = 1; f * fh < hB - 1.2; f++) {
          const y = f * fh;
          B(KIT_BOX6, 0, len, 0, 1.15, y - 0.16, y, slab);
          if (rk === 0) B(KIT_BARS, 0, len, 1.1, 1.14, y, y + 1.0, rc);
          else B(rk === 1 ? KIT_BOX : KIT_GBOX, 0, len, 1.09, 1.14, y + 0.08, y + 1.0, rc);
          B(KIT_BOX, 0, len + 0.02, 1.06, 1.18, y + 1.0, y + 1.07, st === 3 ? [70, 74, 80] : [214, 214, 210]); // 笠木
          if (st === 1) {
            // となりの家とのしきり板(外壁の絵の住戸の境目に)と、ベランダの室外機
            for (const px of [4, 129]) along(E, 7.2, (px / 256) * 7.2, 0.05, (t) => B(KIT_BOX, t, 0.05, 0, 1.08, y, y + 1.9, [236, 236, 232]));
            for (const px of [108, 236]) along(E, 7.2, (px / 256) * 7.2, 0.45, (t) => P(KIT_AC, t, 0.02, y, 1, 1, 1, [232, 232, 228]));
          }
        }
        if (st === 3) along(E, 7.2, 0.11, 0.15, (t) => B(KIT_BOX, t, 0.24, 0, 1.2, 3.2, hB - 0.2, [112, 116, 122])); // 柱(ベランダの仕切り)
      } else if (corr) {
        const sg = nz * ex - nx * ez > 0 ? 1 : -1, tS = -sg * (L / 2 - 1.6);
        const c0 = sg > 0 ? -L / 2 + 3.2 : -L / 2 + 0.3, c1 = sg > 0 ? L / 2 - 0.3 : L / 2 - 3.2, tc = (c0 + c1) / 2, lc = c1 - c0;
        const wallC = colors[b] || pal(b), sc = [[64, 66, 70], [120, 84, 64], [214, 208, 196]][Math.floor(bk2 * 3)];
        for (let f = 1; f * fh < hB - 1.2; f++) {
          const y = f * fh;
          B(KIT_BOX6, tc, lc, 0, 1.25, y - 0.18, y, [212, 210, 204]);
          B(KIT_BOX, tc, lc, 1.1, 1.25, y, y + 1.1, wallC); // 腰壁
          B(KIT_BOX, tc, lc + 0.02, 1.08, 1.27, y + 1.1, y + 1.16, [196, 196, 192]);
          for (let t = c0 + 0.9; t < c1 - 0.6; t += 3.6) {
            P(KIT_DOOR, t, 0, y, 0.85, 2.0, 1, [150, 152, 156]);
            B(KIT_BOX, t, 0.85, 0, 0.035, y, y + 2.0, [118, 124, 132]); // 玄関のドア
            B(KIT_EBOX, t + 1.0, 0.24, 0.45, 0.7, y + fh - 0.22, y + fh - 0.18, [255, 240, 214]); // 廊下の灯り
          }
          P(KIT_STAIR, tS, 0, y - fh, 1, fh / 2.9, 1, sc);
        }
      }
    } else if (st === 4) {
      // 商業ビル: 1階の上に庇、壁からつき出たそで看板(夜は光る)
      if (L >= 4) B(KIT_BOX6, 0, L - 0.4, 0, 0.95, 3.22, 3.4, SIGNC[Math.floor(hk * 7)]);
      if (L >= 5 && hB > 7 && hk < 0.75) {
        const t = (hash(b * 7 + ei) - 0.5) * (L - 2), top = Math.min(hB - 0.5, 4 + hash(b + ei * 3) * 9);
        B(KIT_EBOX, t, 0.22, 0.05, 1.0, 3.9, Math.max(5.6, top), SIGNC[Math.floor(hash(b * 3 + ei * 5) * 7)]);
        B(KIT_BOX, t, 0.06, 0, 0.06, 3.8, Math.max(5.7, top + 0.1), [70, 72, 76]);
      }
      // 壁の看板(少し浮いた板)
      if (L >= 6 && hB > 9 && hk > 0.4) B(KIT_EBOX, 0, Math.min(L - 1.5, 6), 0, 0.14, 7.3, 8.6, SIGNC[Math.floor(hash(b * 11 + ei) * 7)]);
    } else if (st === 2) {
      // オフィス: 入口の庇(長い辺の一部)
      if (L >= 10 && hk < 0.5) B(KIT_BOX6, 0, Math.min(8, L * 0.4), 0, 1.6, 3.3, 3.5, [70, 74, 80]);
    } else if (hB >= 5 && L >= 5 && hk < 0.3) {
      // 戸建て: 2階の小さなベランダ(アルミの手すり か 壁)
      const t = (hash(b * 5 + ei) - 0.5) * (L - 3.6), c = st === 5 ? [58, 60, 64] : [238, 236, 230];
      B(KIT_BOX6, t, 3.0, 0, 0.95, 2.75, 2.88, c);
      if (bk2 < 0.5) {
        B(KIT_BARS, t, 3.0, 0.9, 0.94, 2.88, 3.9, st === 5 ? [40, 40, 42] : [186, 190, 194]);
        B(KIT_BOX, t, 3.04, 0.88, 0.97, 3.9, 3.96, st === 5 ? [40, 40, 42] : [186, 190, 194]);
      } else B(KIT_BOX, t, 3.0, 0.88, 0.95, 2.88, 3.95, c);
    }
    // 屋上のふち(笠木)。平らな屋根の建物だけ
    if (!hs && !slopeB[b] && hB >= 2.6) B(KIT_BOX, 0, L + 0.04, -0.22, 0.03, hB - 0.04, hB + (house ? 0.1 : 0.16), house ? [200, 198, 194] : [188, 188, 184], 1);
    // 屋上(平らな屋根の建物に1回だけ): 機械室と、室外機のならび、給水タンク、屋上の看板
    if (!roofDone[b] && st >= 1 && st <= 4 && hR >= 9 && !slopeB[b] && hE >= hR - 0.3) {
      roofDone[b] = 1;
      const cx = exA[0], cz = exA[2], top = y0 + hB, w = Math.min(bx1[b] - bx0[b], bz1[b] - bz0[b]);
      const R = (kit, a, d, y, sx, sy, sz, c) => put(kit, cx + ex * a + nx * d, top + y, cz + ez * a + nz * d, nx, nz, sx, sy, sz, c, 1);
      if (w > 7) {
        R(KIT_BOX6, 0, -1.6, 0, 3.4, 2.7, 3.2, [206, 204, 198]);
        R(KIT_BOX6, 0, -1.7, 2.7, 3.6, 0.1, 3.4, [180, 178, 172]);
        R(KIT_DOOR, 0.6, 1.6, 0, 0.8, 1.9, 1, [150, 152, 156]);
        R(KIT_BOX, 0.6, 1.6, 0, 0.8, 1.9, 0.03, [128, 132, 138]);
        for (let k = 0; k < Math.min(5, Math.floor(w / 3)); k++) put(KIT_AC, cx + ex * (-3.4 - k * 1.1) - nx * 0.15, top, cz + ez * (-3.4 - k * 1.1) - nz * 0.15, nx, nz, 1, 1, 1, [214, 216, 218], 1);
        if (st !== 3 && hash(b * 19) < 0.5) {
          for (const [a, d] of [[2.5, -0.7], [3.9, -0.7], [2.5, 0.7], [3.9, 0.7]]) R(KIT_BOX6, a, d - 0.05, 0, 0.1, 0.8, 0.1, [120, 120, 118]);
          R(KIT_BOX6, 3.2, -0.9, 0.8, 1.8, 1.8, 1.8, [226, 226, 222]); // 給水タンク
          R(KIT_BOX6, 3.2, -0.95, 2.6, 1.9, 0.08, 1.9, [206, 206, 202]);
        }
        if (st === 4 && bk < 0.4 && L >= 6) {
          // 屋上の看板(文字なしの光る板と、鉄骨の脚)
          const sw = Math.min(L - 1.5, 6);
          for (const o of [-sw / 2 + 0.3, sw / 2 - 0.3]) B(KIT_BOX, o, 0.12, -0.9, -0.78, hB, hB + 1.0, [90, 92, 96], 1);
          B(KIT_EBOX, 0, sw, -0.9, -0.75, hB + 1.0, hB + 2.8, SIGNC[Math.floor(bk2 * 7)], 1);
        }
      }
    }
  }
  let base = 0;
  // 外壁の色(写真のない建物)。東京の住宅地に多い色から選ぶ
  const WALL = [
    [[246, 244, 238], [236, 228, 212], [222, 218, 210], [204, 190, 170], [168, 150, 128], [232, 232, 228], [190, 192, 194]],
    [[244, 242, 236], [232, 222, 204], [214, 208, 198], [196, 172, 150], [226, 226, 222]],
    [[206, 216, 226], [192, 202, 212], [222, 226, 230], [176, 190, 204]],
    [[236, 236, 232], [214, 216, 220], [196, 190, 182], [226, 220, 210]],
    [[244, 240, 232], [232, 222, 206], [216, 210, 202], [240, 232, 214], [206, 196, 184]],
    [[250, 250, 250], [236, 236, 240], [244, 240, 234]],
  ];
  const ROOF = [[78, 80, 86], [96, 74, 62], [62, 72, 88], [120, 118, 114], [140, 92, 70]];
  const pal = (b) => {
    const hh = hash(b * 7919 + Math.round(P[0] * 3));
    const list = WALL[style[b]];
    return list[Math.floor(hh * list.length)];
  };
  const colors = new Array(NB);
  for (const pt of parts) {
    const ix = pt.idx;
    for (let t = 0; t < ix.length; t += 3) {
      const ia = base + ix[t], ib = base + ix[t + 1], ic = base + ix[t + 2];
      const b = B[ia];
      if (skip[b]) continue;
      const g = pt.g || PG[style[b]];
      const { pos, nor, uv, col, anc } = g;
      let w = g.w;
      const ancX = (bx0[b] + bx1[b]) / 2, ancY = TERRAIN ? minY[b] : 0, ancZ = (bz0[b] + bz1[b]) / 2;
      const ax = P[ia * 3], ay = P[ia * 3 + 1] - minY[b], az = P[ia * 3 + 2];
      const bx = P[ib * 3], by = P[ib * 3 + 1] - minY[b], bz = P[ib * 3 + 2];
      const qx = P[ic * 3], qy = P[ic * 3 + 1] - minY[b], qz = P[ic * 3 + 2];
      // 面の向き
      const ux = bx - ax, uy = by - ay, uz = bz - az, vx = qx - ax, vy = qy - ay, vz = qz - az;
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      const L = Math.hypot(nx, ny, nz) || 1;
      nx /= L;
      ny /= L;
      nz /= L;
      const c = g.kind === "p" ? colors[b] || (colors[b] = pal(b)) : null;
      const roof = Math.abs(ny) > 0.55;
      const hs = house[b] && g.kind === "p", wallH = hx[b * 8 + 6];
      // 屋根をのせる家: もとの平らな屋根は出さない
      if (hs && roof && ay >= wallH - 0.05 && by >= wallH - 0.05 && qy >= wallH - 0.05) continue;
      // 屋根: 傾いた屋根は瓦・金属の色、平らな屋根はコンクリートの色
      const rc = roof && g.kind === "p" ? (ny < 0.97 ? ROOF[Math.floor(hash(b * 31 + 7) * ROOF.length)] : [150, 150, 146]) : null;
      const vi = [ix[t], ix[t + 1], ix[t + 2]];
      const V = [ax, ay, az, bx, by, bz, qx, qy, qz];
      for (let j = 0; j < 3; j++) {
        const X = V[j * 3], Y = V[j * 3 + 1], Z = V[j * 3 + 2];
        pos[w * 3] = X;
        pos[w * 3 + 1] = Y + (TERRAIN ? minY[b] : 0); // 坂のあるとき: 建物の足もとの本当の高さのまま
        pos[w * 3 + 2] = Z;
        anc[w * 3] = ancX;
        anc[w * 3 + 1] = ancY;
        anc[w * 3 + 2] = ancZ;
        nor[w * 3] = Math.round(nx * 127);
        nor[w * 3 + 1] = Math.round(ny * 127);
        nor[w * 3 + 2] = Math.round(nz * 127);
        const v = vi[j];
        if (g.kind === "t") {
          uv[w * 2] = pt.tex[v * 2];
          uv[w * 2 + 1] = pt.tex[v * 2 + 1];
          col[w * 3] = col[w * 3 + 1] = col[w * 3 + 2] = 255;
        } else if (g.kind === "c") {
          const f = pt.factor, cn = pt.cn;
          for (let q = 0; q < 3; q++) col[w * 3 + q] = Math.max(0, Math.min(255, Math.round(pt.color[v * cn + q] * f[q] * 255)));
        } else {
          const st = style[b];
          // 傾いた屋根は、瓦・スレート・金属の模様(画面側で描く。uv.y=-105 が印、uv.x=種類)
          // ※ 壁の uv.x は街の座標から出すので負にもなる。印は、壁では負にならない uv.y の方に付ける
          if (roof && ny < 0.97) (uv[w * 2] = roofKind(b)), (uv[w * 2 + 1] = -105);
          else if (roof) (uv[w * 2] = RUV[st][0]), (uv[w * 2 + 1] = RUV[st][1]);
          else {
            // 壁にそって横に進む距離で、外壁の模様(窓・ベランダ)を貼る
            uv[w * 2] = (-X * nz + Z * nx) / FW[st];
            uv[w * 2 + 1] = Y / FH[st];
          }
          // 地面に近いほど少し暗く(影のたまり)
          const ao = roof ? 1 : 0.74 + 0.26 * Math.min(1, Y / 4);
          const cc = rc || c;
          col[w * 3] = cc[0] * ao;
          col[w * 3 + 1] = cc[1] * ao;
          col[w * 3 + 2] = cc[2] * ao;
        }
        w++;
      }
      // 寄棟の屋根: 壁の上の辺から、棟(むね)へ向かう面を張る
      if (hs && !roof) {
        const T = [];
        for (let j = 0; j < 3; j++) if (V[j * 3 + 1] >= wallH - 0.05) T.push(j);
        if (T.length === 2) {
          const o8 = b * 8, rx = hx[o8], rz = hx[o8 + 1], ccx = hx[o8 + 2], ccz = hx[o8 + 3], rl = hx[o8 + 4], rh = hx[o8 + 5], hw = hx[o8 + 7];
          // 軒の出(OV): 屋根を壁の外へのばす。同じ傾きのまま、軒先は壁の上より少し低い
          const OV = 0.5, yW = wallH + (TERRAIN ? minY[b] : 0), yA = yW - (OV * rh) / Math.max(1, hw), yR = yW + rh;
          const ridge = (X, Z) => {
            const sg = Math.max(-rl, Math.min(rl, (X - ccx) * rx + (Z - ccz) * rz));
            return [ccx + rx * sg, ccz + rz * sg];
          };
          // 角の点を、棟の向きとその直角の向きに、それぞれ外へ OV ずらす(となりの辺と同じ点になるので、すき間ができない)
          const ext = (X, Z) => {
            const dx = X - ccx, dz = Z - ccz;
            let a = dx * rx + dz * rz, q = -dx * rz + dz * rx;
            a += Math.sign(a) * OV;
            q += Math.sign(q) * OV;
            return [ccx + rx * a - rz * q, ccz + rz * a + rx * q];
          };
          const A0 = [V[T[0] * 3], V[T[0] * 3 + 2]], B0 = [V[T[1] * 3], V[T[1] * 3 + 2]];
          const A = ext(A0[0], A0[1]), Bq = ext(B0[0], B0[1]);
          const ra = ridge(A0[0], A0[1]), rb = ridge(B0[0], B0[1]);
          const rcol = ROOF[Math.floor(hash(b * 31 + 7) * ROOF.length)], rk = roofKind(b);
          // 1枚の三角形を書く。want: 面を向けたい向き(逆なら点の順を入れかえる)
          const face = (P1, P2, P3, want, c, u0, u1, shade) => {
            const ex = P2[0] - P1[0], ey = P2[1] - P1[1], ez = P2[2] - P1[2], fx = P3[0] - P1[0], fy = P3[1] - P1[1], fz = P3[2] - P1[2];
            let mx = ey * fz - ez * fy, my = ez * fx - ex * fz, mz = ex * fy - ey * fx;
            const ml = Math.hypot(mx, my, mz);
            if (ml < 1e-4) return;
            let pp = [P1, P2, P3];
            if (mx * want[0] + my * want[1] + mz * want[2] < 0) (pp = [P1, P3, P2]), (mx = -mx), (my = -my), (mz = -mz);
            for (let j = 0; j < 3; j++) {
              pos[w * 3] = pp[j][0];
              pos[w * 3 + 1] = pp[j][1];
              pos[w * 3 + 2] = pp[j][2];
              anc[w * 3] = ancX;
              anc[w * 3 + 1] = ancY;
              anc[w * 3 + 2] = ancZ;
              nor[w * 3] = Math.round((mx / ml) * 127);
              nor[w * 3 + 1] = Math.round((my / ml) * 127);
              nor[w * 3 + 2] = Math.round((mz / ml) * 127);
              uv[w * 2] = u0;
              uv[w * 2 + 1] = u1;
              const sh = shade ? (pp[j][1] > yA + 0.01 ? 1.08 : 0.9) : 1;
              col[w * 3] = Math.min(255, c[0] * sh);
              col[w * 3 + 1] = Math.min(255, c[1] * sh);
              col[w * 3 + 2] = Math.min(255, c[2] * sh);
              w++;
            }
          };
          const P3 = (p, y) => [p[0], y, p[1]];
          const UP = [0, 1, 0], DN = [0, -1, 0], OUT = [nx, 0, nz];
          // 屋根の面(瓦などの模様は画面側で描く)。棟に近いほど少し明るく
          face(P3(A, yA), P3(Bq, yA), P3(ra, yR), UP, rcol, rk, -105, true);
          face(P3(Bq, yA), P3(rb, yR), P3(ra, yR), UP, rcol, rk, -105, true);
          // 軒裏(下から見える面)と、鼻隠し(軒先のたての板)
          const so = bk3(b) < 0.5 ? [228, 226, 220] : [150, 128, 104], fa = bk3(b) < 0.7 ? [236, 234, 230] : [60, 58, 56];
          face(P3(A0, yW), P3(B0, yW), P3(Bq, yA), DN, so, 0, -101, false);
          face(P3(A0, yW), P3(Bq, yA), P3(A, yA), DN, so, 0, -101, false);
          face(P3(A, yA), P3(Bq, yA), P3(Bq, yA - 0.16), OUT, fa, 0, -101, false);
          face(P3(A, yA), P3(Bq, yA - 0.16), P3(A, yA - 0.16), OUT, fa, 0, -101, false);
          // 軒どい(軒先にそった、横の雨どい)
          const gl = Math.hypot(Bq[0] - A[0], Bq[1] - A[1]);
          if (gl > 1) {
            exA = [ancX, ancY, ancZ];
            put(KIT_BOX, (A[0] + Bq[0]) / 2, yA - 0.24, (A[1] + Bq[1]) / 2, nx, nz, gl + 0.04, 0.13, 0.12, bk3(b) < 0.6 ? [226, 226, 222] : [76, 66, 58]);
          }
        }
      }
      // 足もとの辺(下の2点が地面にある壁の三角形)から、出っ張りを足す
      if (g.kind === "p" && !roof) {
        const lo = [];
        for (let j = 0; j < 3; j++) if (V[j * 3 + 1] < 0.35) lo.push(j);
        if (lo.length === 2) extras(b, style[b], V[lo[0] * 3], V[lo[0] * 3 + 2], V[lo[1] * 3], V[lo[1] * 3 + 2], nx, nz, ancY, hs ? wallH : maxY[b] - minY[b], t, hs, Math.max(V[1], V[4], V[7]));
      }
      g.w = w;
    }
    base += pt.pos.length / 3;
  }
  const lm = [];
  for (let b = 0; b < NB; b++) if (names[b] && !skip[b] && pts[b].length) lm.push({ name: String(names[b]), x: (bx0[b] + bx1[b]) / 2, z: (bz0[b] + bz1[b]) / 2, h: maxY[b] - minY[b] });
  const out = [];
  for (const g of groups.values()) {
    const E = null;
    if (!g.w) continue;
    // 出っ張りのぶんを、後ろにつなげる
    const cat = (T, a, n, extra) => {
      const o = new T(n + (extra ? extra.length : 0));
      o.set(a.subarray(0, n));
      if (extra) o.set(extra, n);
      return o;
    };
    out.push({ kind: g.kind, img: g.img, style: g.style, pos: cat(Float32Array, g.pos, g.w * 3, E && E.pos), nor: cat(Int8Array, g.nor, g.w * 3, E && E.nor), uv: cat(Float32Array, g.uv, g.w * 2, E && E.uv), col: cat(Uint8Array, g.col, g.w * 3, E && E.col), anc: cat(Float32Array, g.anc, g.w * 3, E && E.anc) });
  }
  // 地面の高さ合わせ用: 建物の足もと(楕円体高 = hc + minY)と場所を、いくつか返す
  const feet = [];
  for (let b = 0; b < NB && feet.length < 80; b += Math.max(1, Math.floor(NB / 80))) if (pts[b].length && !skip[b]) feet.push([(bx0[b] + bx1[b]) / 2, (bz0[b] + bz1[b]) / 2, hc + minY[b]]);
  return { groups: out, inst: new Float32Array(INST), names: lm, n: NB - skipped, skipped, hc, feet, terrain: TERRAIN };
}

// 細部の部品の番号(city.js の KIT と同じ並び)。1つぶんの書き出し: [部品, x, y, z, 向き, 大きさx, y, z, 色r, g, b, 建物の中心x, 足もとy, 中心z, fl]
const KIT_BOX = 0, KIT_GBOX = 1, KIT_EBOX = 2, KIT_BARS = 3, KIT_AWN = 4, KIT_WIN1 = 5, KIT_WIN2 = 6, KIT_WIN3 = 7, KIT_DOOR = 8, KIT_AC = 9, KIT_STAIR = 10, KIT_BOX6 = 11;
// 傾いた屋根の種類(0=瓦 1=スレート 2=金属のたてはぜ)と、建物ごとの色の選び
const roofKind = (b) => { const h = hash(b * 57 + 3); return h < 0.4 ? 0 : h < 0.8 ? 1 : 2; };
const bk3 = (b) => hash(b * 613 + 5);
// 外壁の模様1枚ぶんの大きさ(m)と、屋根に使う模様の中の無地の場所
const FW = [7, 7.2, 6, 7.2, 6, 7], FH = [6.4, 5.8, 8, 6, 7, 6.4];
const RUV = [[0.02, 0.98], [0.015, 0.5], [0.5, 0.07], [0.015, 0.5], [0.02, 0.98], [0.02, 0.98]];

function hash(n) {
  let x = (n ^ 0x9e3779b9) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

// ---------- 道に重なるか ----------
function hull(flat) {
  const p = [];
  for (let i = 0; i < flat.length; i += 2) p.push([flat[i], flat[i + 1]]);
  p.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) {
    while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop();
    lo.push(q);
  }
  for (let i = p.length - 1; i >= 0; i--) {
    const q = p[i];
    while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop();
    up.push(q);
  }
  up.pop();
  lo.pop();
  return lo.concat(up);
}
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
function onRoute(flat, x0, x1, z0, z1) {
  const segs = new Set();
  for (let x = Math.floor((x0 - CLEAR) / 50); x <= Math.floor((x1 + CLEAR) / 50); x++)
    for (let z = Math.floor((z0 - CLEAR) / 50); z <= Math.floor((z1 + CLEAR) / 50); z++) for (const i of R.grid.get(x + ":" + z) || []) segs.add(i);
  if (!segs.size) return false;
  const h = hull(flat);
  if (h.length < 3) return false;
  for (const i of segs) {
    const a = R.xy[i], b = R.xy[i + 1];
    // 道の点が建物の中
    for (const q of [a, b]) {
      let inside = true;
      for (let j = 0; j < h.length; j++) {
        const p0 = h[j], p1 = h[(j + 1) % h.length];
        if ((p1[0] - p0[0]) * (q[1] - p0[1]) - (p1[1] - p0[1]) * (q[0] - p0[0]) < 0) {
          inside = false;
          break;
        }
      }
      if (inside) return true;
    }
    for (let j = 0; j < h.length; j++) if (segDist(a, b, h[j], h[(j + 1) % h.length]) < CLEAR) return true;
  }
  return false;
}

// ---------- 道路(PLATEAU 交通モデルの MVT) ----------
// 種類 f: 0=車道 1=交差点 2=歩道 3=島・植樹帯 4=道路の面(LOD1。歩道と車道の区別なし)
function roadKind(lod, layer, fn) {
  if (lod === 1) return 4;
  fn = String(fn || "");
  if (layer === "AuxiliaryTrafficArea") return /路肩|停車/.test(fn) ? 0 : 3;
  if (/交差/.test(fn)) return 1;
  if (/歩道|自転車|歩行者/.test(fn)) return 2;
  if (/島|植樹|中央帯|分離帯/.test(fn)) return 3;
  return 0;
}
function readRoads(buf, lod, z, tx, ty, out) {
  let u8 = new Uint8Array(buf);
  const td = new TextDecoder();
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
  const n = 2 ** z;
  const lonOf = (v) => (v / n) * 360 - 180;
  const latOf = (v) => (Math.atan(Math.sinh(Math.PI * (1 - (2 * v) / n))) * 180) / Math.PI;
  each(u8.length, (f, w, a, b) => {
    if (f !== 3 || w !== 2) return;
    const save = pos;
    pos = a;
    let name = "", extent = 4096;
    const keys = [], vals = [], feats = [];
    each(b, (f2, w2, a2, b2) => {
      if (f2 === 1) name = td.decode(u8.subarray(a2, b2));
      else if (f2 === 2) feats.push([a2, b2]);
      else if (f2 === 3) keys.push(td.decode(u8.subarray(a2, b2)));
      else if (f2 === 4) {
        const sv = pos;
        pos = a2;
        let v = null;
        each(b2, (f3, w3, a3, b3) => {
          if (f3 === 1) v = td.decode(u8.subarray(a3, b3));
        });
        vals.push(v);
        pos = sv;
      } else if (f2 === 5) extent = a2;
    });
    for (const [fa, fb] of feats) {
      pos = fa;
      let type = 0, tags = null, geom = null;
      each(fb, (f3, w3, a3, b3) => {
        if (f3 === 3) type = a3;
        else if (f3 === 2) tags = [a3, b3];
        else if (f3 === 4) geom = [a3, b3];
      });
      if (type !== 3 || !geom) continue;
      let fn = "";
      if (tags) {
        pos = tags[0];
        while (pos < tags[1]) {
          const k = keys[varint()], v = vals[varint()];
          if (k === "tran_function") fn = v;
        }
      }
      const kind = roadKind(lod, name, fn);
      pos = geom[0];
      let cx = 0, cy = 0, cur = null, poly = null;
      const rings = [];
      while (pos < geom[1]) {
        const cmd = varint(), id = cmd & 7, cnt = cmd >>> 3;
        if (id === 7) {
          if (cur && cur.length >= 6) rings.push(cur);
          cur = null;
          continue;
        }
        for (let i = 0; i < cnt; i++) {
          const dx = varint(), dy = varint();
          cx += dx & 1 ? -(dx + 1) / 2 : dx / 2;
          cy += dy & 1 ? -(dy + 1) / 2 : dy / 2;
          if (id === 1) {
            if (cur && cur.length >= 6) rings.push(cur);
            cur = [];
          }
          const lon = lonOf(tx + cx / extent), lat = latOf(ty + cy / extent);
          cur.push((lon - R.lon0) * R.kx, -(lat - R.lat0) * R.kz);
        }
      }
      if (cur && cur.length >= 6) rings.push(cur);
      // 外側の輪(時計回り)ごとに、続く穴をまとめる
      for (const r of rings) {
        let area = 0;
        for (let i = 0; i < r.length; i += 2) {
          const j = (i + 2) % r.length;
          area += r[i] * r[j + 1] - r[j] * r[i + 1];
        }
        // MVT は y が下向き。アプリの z も南向きなので、外側の輪は面積がプラス
        if (area > 0 || !poly) out.push((poly = { f: kind, lod, rings: [new Float32Array(r)] }));
        else poly.rings.push(new Float32Array(r));
      }
    }
    pos = save;
  });
}
