// PLATEAU(国交省の3D都市モデル)の建物タイル(3D Tiles の b3dm)を、シティデュエルの座標に直すワーカー。
// 重い計算(Draco の展開・座標変換・走る道に重なる建物の除外)を、画面を止めずにここでやる。
// 入力: { type: "init", route: { xy, lat0, lon0, kx, kz }, clear }  /  { type: "tile", id, buf }
// 出力: { id, groups: [{ kind: "t"(写真)/"c"(色つき)/"p"(色なし), img(写真の番号), pos, nor, uv, col }], images: [{ bitmap | bytes, mime }], names, n, skipped }
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
  if (d.type === "mvt") {
    // 道路のベクトルタイル(PLATEAU の交通モデル)→ アプリ座標の多角形
    try {
      const polys = [];
      for (const it of d.bufs) readRoads(it.buf, it.lod, d.z, d.x, d.y, polys);
      const tr = [];
      for (const p of polys) for (const r of p.rings) tr.push(r.buffer);
      self.postMessage({ id: d.id, polys }, tr);
    } catch (err) {
      self.postMessage({ id: d.id, error: String((err && err.message) || err) });
    }
    return;
  }
  if (d.type === "tile") {
    try {
      const out = await tile(d.buf);
      out.id = d.id;
      const tr = [];
      for (const g of out.groups) tr.push(g.pos.buffer, g.nor.buffer, g.uv.buffer, g.col.buffer, g.anc.buffer);
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
  const remap = new Map();
  for (const i of usedImg) {
    const im = gj.images[i];
    if (!im || im.bufferView == null) continue;
    const bv = gj.bufferViews[im.bufferView];
    const bytes = buf.slice(binStart + (bv.byteOffset || 0), binStart + (bv.byteOffset || 0) + bv.byteLength);
    remap.set(i, out.images.length);
    out.images.push(await toBitmap(bytes, im.mimeType || "image/jpeg"));
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
      for (let k = 0; k < 6; k++) (PG[k] = G("p" + k, "p", null, pt.idx.length * 3)), (PG[k].style = k);
    }
  // anc: その頂点が属する建物の「中心x・足もとy・中心z」。近づくと建物ごとに立ち上がる動きに使う
  for (const g of groups.values()) Object.assign(g, { pos: new Float32Array(g.cap * 3), nor: new Int8Array(g.cap * 3), uv: new Float32Array(g.cap * 2), col: new Uint8Array(g.cap * 3), anc: new Float32Array(g.cap * 3) });
  // 戸建ての屋根: 箱のまま(屋根が平ら)の小さな家には、寄棟(よせむね)の屋根をのせる
  const house = new Uint8Array(NB), hx = new Float32Array(NB * 7); // 軸x, 軸z, 中心x, 中心z, 棟の半分の長さ, 屋根の高さ, 壁の高さ
  {
    const slope = new Uint8Array(NB), other = new Uint8Array(NB), top = Array.from({ length: NB }, () => null);
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
      hx.set([ax, az, cxb, czb, Math.max(0, hl - hw), Math.min(2.6, Math.max(0.9, hw * 0.55)), h], b * 7);
    }
  }
  // ---- 出っ張り(本当の形として足す): ベランダの床と手すり、店の庇、そで看板、屋上の機械室と室外機 ----
  // 壁の三角形のうち、下の2点が地面にあるものから「建物の足もとの辺」と外向きがわかる。その辺にそって箱を足す。
  // uv の x を -1 にした面は、外壁の絵を貼らずに色だけで描く(-2 はガラス)
  const EX = Array.from({ length: 6 }, () => ({ pos: [], nor: [], uv: [], col: [], anc: [] }));
  const roofDone = new Uint8Array(NB);
  let exA = [0, 0, 0];
  const quad = (E, p0, p1, p2, p3, n, c, flag) => {
    for (const q of [p0, p1, p2, p0, p2, p3]) {
      E.pos.push(q[0], q[1], q[2]);
      E.nor.push(Math.round(n[0] * 127), Math.round(n[1] * 127), Math.round(n[2] * 127));
      E.uv.push(flag, flag);
      E.col.push(c[0], c[1], c[2]);
      E.anc.push(exA[0], exA[1], exA[2]);
    }
  };
  // 箱: 中心(cx, cz)・辺の向き(ex, ez)・外向き(nx, nz)。長さ len、外へ d0〜d1、高さ y0〜y1
  const exBox = (st, cx, cz, ex, ez, nx, nz, len, d0, d1, y0, y1, c, flag = -1) => {
    const E = EX[st], h = len / 2;
    const P = (a, d, y) => [cx + ex * a + nx * d, y, cz + ez * a + nz * d];
    const dk = [c[0] * 0.72, c[1] * 0.72, c[2] * 0.72], lt = [Math.min(255, c[0] * 1.06), Math.min(255, c[1] * 1.06), Math.min(255, c[2] * 1.06)];
    quad(E, P(-h, d1, y0), P(h, d1, y0), P(h, d1, y1), P(-h, d1, y1), [nx, 0, nz], c, flag); // 外の面
    quad(E, P(h, d0, y0), P(-h, d0, y0), P(-h, d0, y1), P(h, d0, y1), [-nx, 0, -nz], dk, flag); // 内の面
    quad(E, P(-h, d0, y0), P(-h, d1, y0), P(-h, d1, y1), P(-h, d0, y1), [-ex, 0, -ez], dk, flag);
    quad(E, P(h, d1, y0), P(h, d0, y0), P(h, d0, y1), P(h, d1, y1), [ex, 0, ez], dk, flag);
    quad(E, P(-h, d0, y1), P(-h, d1, y1), P(h, d1, y1), P(h, d0, y1), [0, 1, 0], lt, flag); // 上
    quad(E, P(-h, d1, y0), P(-h, d0, y0), P(h, d0, y0), P(h, d1, y0), [0, -1, 0], dk, flag); // 下
  };
  const SIGNC = [[200, 54, 44], [31, 95, 158], [47, 138, 78], [232, 160, 32], [58, 58, 58], [122, 58, 160], [240, 240, 236]];
  function extras(b, st, ax, az, bx, bz, nx, nz, y0, hB, ei) {
    const L = Math.hypot(bx - ax, bz - az);
    if (L < 2.5) return;
    const ex = (bx - ax) / L, ez = (bz - az) / L, nl = Math.hypot(nx, nz) || 1;
    nx /= nl;
    nz /= nl;
    const mx = (ax + bx) / 2, mz = (az + bz) / 2, hk = hash(b * 131 + ei * 17 + Math.round(ax));
    exA = [(bx0[b] + bx1[b]) / 2, y0, (bz0[b] + bz1[b]) / 2];
    if (st === 1 || st === 3) {
      // マンション: 南向きの長い辺と、ほかの辺の一部にベランダ。タワーマンションは長い辺ぜんぶ
      const fh = FH[st] / 2, on = st === 3 ? L >= 6 : L >= 5 && (nz > 0.35 || hk < 0.3);
      if (!on) return;
      const len = L - 0.8, slab = st === 3 ? [226, 226, 222] : [220, 218, 212], rail = st === 3 ? [150, 190, 214] : [176, 182, 188];
      for (let f = 1; f * fh < hB - 1.2; f++) {
        const y = y0 + f * fh;
        exBox(st, mx, mz, ex, ez, nx, nz, len, 0, 1.15, y - 0.16, y, slab);
        exBox(st, mx, mz, ex, ez, nx, nz, len, 1.08, 1.15, y, y + 1.05, rail, st === 3 ? -2 : -1);
        // となりの家とのしきり板
        if (st === 1) for (let t = -len / 2 + 7.2; t < len / 2 - 2; t += 7.2) exBox(st, mx + ex * t, mz + ez * t, ex, ez, nx, nz, 0.06, 0, 1.1, y, y + 1.9, [236, 236, 232]);
      }
    } else if (st === 4) {
      // 商業ビル: 1階の上に庇、壁からつき出たそで看板
      if (L >= 4) exBox(st, mx, mz, ex, ez, nx, nz, L - 0.4, 0, 0.95, y0 + 3.22, y0 + 3.4, SIGNC[Math.floor(hk * 7)]);
      if (L >= 5 && hB > 7 && hk < 0.75) {
        const t = (hash(b * 7 + ei) - 0.5) * (L - 2), top = Math.min(hB - 0.5, 4 + hash(b + ei * 3) * 9);
        exBox(st, mx + ex * t, mz + ez * t, ex, ez, nx, nz, 0.22, 0.05, 1.0, y0 + 3.9, y0 + Math.max(5.6, top), SIGNC[Math.floor(hash(b * 3 + ei * 5) * 7)]);
      }
      // 壁の看板(少し浮いた板)
      if (L >= 6 && hB > 9 && hk > 0.4) exBox(st, mx, mz, ex, ez, nx, nz, Math.min(L - 1.5, 6), 0, 0.14, y0 + 7.3, y0 + 8.6, SIGNC[Math.floor(hash(b * 11 + ei) * 7)]);
    } else if (st === 2) {
      // オフィス: 入口の庇(長い辺の一部)
      if (L >= 10 && hk < 0.5) exBox(st, mx, mz, ex, ez, nx, nz, Math.min(8, L * 0.4), 0, 1.6, y0 + 3.3, y0 + 3.5, [70, 74, 80]);
    } else if (hB >= 5 && L >= 5 && hk < 0.3) {
      // 戸建て: 2階の小さなベランダ
      const t = (hash(b * 5 + ei) - 0.5) * (L - 3.6), c = st === 5 ? [58, 60, 64] : [238, 236, 230];
      exBox(st, mx + ex * t, mz + ez * t, ex, ez, nx, nz, 3.0, 0, 0.95, y0 + 2.75, y0 + 2.88, c);
      exBox(st, mx + ex * t, mz + ez * t, ex, ez, nx, nz, 3.0, 0.9, 0.95, y0 + 2.88, y0 + 3.95, c);
    }
    // 屋上(平らな屋根の建物に1回だけ): 機械室と、室外機のならび、手すり
    if (!roofDone[b] && st >= 1 && st <= 4 && hB >= 9) {
      roofDone[b] = 1;
      const cx = exA[0], cz = exA[2], top = y0 + hB, w = Math.min(bx1[b] - bx0[b], bz1[b] - bz0[b]);
      if (w > 7) {
        exBox(st, cx, cz, ex, ez, nx, nz, 3.4, -1.6, 1.6, top, top + 2.7, [206, 204, 198]);
        for (let k = 0; k < Math.min(5, Math.floor(w / 3)); k++) exBox(st, cx + ex * (-3.4 - k * 1.1), cz + ez * (-3.4 - k * 1.1), ex, ez, nx, nz, 0.9, -0.4, 0.4, top, top + 0.85, [214, 216, 218]);
        if (st !== 3 && hash(b * 19) < 0.5) exBox(st, cx + ex * 3.2, cz + ez * 3.2, ex, ez, nx, nz, 1.8, -0.9, 0.9, top + 0.8, top + 2.6, [226, 226, 222]); // 給水タンク
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
      const hs = house[b] && g.kind === "p", wallH = hx[b * 7 + 6];
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
          if (roof) (uv[w * 2] = RUV[st][0]), (uv[w * 2 + 1] = RUV[st][1]);
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
          const o7 = b * 7, rx = hx[o7], rz = hx[o7 + 1], ccx = hx[o7 + 2], ccz = hx[o7 + 3], rl = hx[o7 + 4], rh = hx[o7 + 5];
          const yA = wallH + (TERRAIN ? minY[b] : 0), yR = yA + rh;
          const ridge = (X, Z) => {
            const sg = Math.max(-rl, Math.min(rl, (X - ccx) * rx + (Z - ccz) * rz));
            return [ccx + rx * sg, ccz + rz * sg];
          };
          const A = [V[T[0] * 3], V[T[0] * 3 + 2]], Bq = [V[T[1] * 3], V[T[1] * 3 + 2]];
          const ra = ridge(A[0], A[1]), rb = ridge(Bq[0], Bq[1]);
          const rcol = ROOF[Math.floor(hash(b * 31 + 7) * ROOF.length)];
          const tri = (p1, y1, p2, y2, p3, y3) => {
            let ex = p2[0] - p1[0], ey = y2 - y1, ez = p2[1] - p1[1], fx = p3[0] - p1[0], fy = y3 - y1, fz = p3[1] - p1[1];
            let mx = ey * fz - ez * fy, my = ez * fx - ex * fz, mz = ex * fy - ey * fx;
            const ml = Math.hypot(mx, my, mz);
            if (ml < 1e-4) return;
            let pp = [p1, p2, p3], yy = [y1, y2, y3];
            if (my < 0) (pp = [p1, p3, p2]), (yy = [y1, y3, y2]), (mx = -mx), (my = -my), (mz = -mz);
            for (let j = 0; j < 3; j++) {
              pos[w * 3] = pp[j][0];
              pos[w * 3 + 1] = yy[j];
              pos[w * 3 + 2] = pp[j][1];
              anc[w * 3] = ancX;
              anc[w * 3 + 1] = ancY;
              anc[w * 3 + 2] = ancZ;
              nor[w * 3] = Math.round((mx / ml) * 127);
              nor[w * 3 + 1] = Math.round((my / ml) * 127);
              nor[w * 3 + 2] = Math.round((mz / ml) * 127);
              uv[w * 2] = RUV[0][0];
              uv[w * 2 + 1] = RUV[0][1];
              // 棟に近いほど少し明るく(面の向きが見えるように)
              const sh = yy[j] > yA + 0.01 ? 1.08 : 0.9;
              col[w * 3] = Math.min(255, rcol[0] * sh);
              col[w * 3 + 1] = Math.min(255, rcol[1] * sh);
              col[w * 3 + 2] = Math.min(255, rcol[2] * sh);
              w++;
            }
          };
          tri(A, yA, Bq, yA, ra, yR);
          tri(Bq, yA, rb, yR, ra, yR);
        }
      }
      // 足もとの辺(下の2点が地面にある壁の三角形)から、出っ張りを足す
      if (g.kind === "p" && !roof) {
        const lo = [];
        for (let j = 0; j < 3; j++) if (V[j * 3 + 1] < 0.35) lo.push(j);
        if (lo.length === 2) extras(b, style[b], V[lo[0] * 3], V[lo[0] * 3 + 2], V[lo[1] * 3], V[lo[1] * 3 + 2], nx, nz, ancY, hs ? wallH : maxY[b] - minY[b], t);
      }
      g.w = w;
    }
    base += pt.pos.length / 3;
  }
  const lm = [];
  for (let b = 0; b < NB; b++) if (names[b] && !skip[b] && pts[b].length) lm.push({ name: String(names[b]), x: (bx0[b] + bx1[b]) / 2, z: (bz0[b] + bz1[b]) / 2, h: maxY[b] - minY[b] });
  const out = [];
  for (const g of groups.values()) {
    const E = g.kind === "p" && g.style != null ? EX[g.style] : null;
    if (!g.w && !(E && E.pos.length)) continue;
    // 出っ張りのぶんを、後ろにつなげる
    const cat = (T, a, n, extra) => {
      const o = new T(n + (extra ? extra.length : 0));
      o.set(a.subarray(0, n));
      if (extra) o.set(extra, n);
      return o;
    };
    out.push({ kind: g.kind, img: g.img, style: g.style, pos: cat(Float32Array, g.pos, g.w * 3, E && E.pos), nor: cat(Int8Array, g.nor, g.w * 3, E && E.nor), uv: cat(Float32Array, g.uv, g.w * 2, E && E.uv), col: cat(Uint8Array, g.col, g.w * 3, E && E.col), anc: cat(Float32Array, g.anc, g.w * 3, E && E.anc) });
    if (E) E.pos = [];
  }
  // 地面の高さ合わせ用: 建物の足もと(楕円体高 = hc + minY)と場所を、いくつか返す
  const feet = [];
  for (let b = 0; b < NB && feet.length < 80; b += Math.max(1, Math.floor(NB / 80))) if (pts[b].length && !skip[b]) feet.push([(bx0[b] + bx1[b]) / 2, (bz0[b] + bz1[b]) / 2, hc + minY[b]]);
  return { groups: out, names: lm, n: NB - skipped, skipped, hc, feet, terrain: TERRAIN };
}

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
