// 自転車ナビ: ルートの取得、ルート上の現在位置、次の曲がり角、音声案内のタイミング、ルート外れの判定。
// ルートは無料のルート検索サービス(OpenStreetMapの地図データ)で自転車向けに計算する。
//   1. Valhalla(自転車・ロードバイク向けの設定)
//   2. だめなら OSRM の自転車ルート
// 画面やブラウザAPIには依存しない(fetch だけ使う)。

const Nav = (() => {
  const OFF_ROUTE_M = 40; // ルートからこれ以上離れたら「外れた」候補
  const OFF_ROUTE_COUNT = 3; // 何回続けて外れたらルートを引き直すか

  // ---------- 距離の計算(近い範囲なので平面で近似) ----------
  function toXY(lat, lon, lat0) {
    return [lon * Math.cos((lat0 * Math.PI) / 180) * 111320, lat * 110540];
  }

  function dist(a, b) {
    const [x1, y1] = toXY(a[0], a[1], a[0]);
    const [x2, y2] = toXY(b[0], b[1], a[0]);
    return Math.hypot(x2 - x1, y2 - y1);
  }

  // ---------- ルートの読み込み ----------
  // Valhalla の形状(polyline, 精度6桁)を [[lat, lon], ...] に戻す
  function decodePolyline(str, precision = 6) {
    const factor = Math.pow(10, precision);
    const out = [];
    let i = 0;
    let lat = 0;
    let lon = 0;
    while (i < str.length) {
      for (const k of [0, 1]) {
        let shift = 0;
        let result = 0;
        let b;
        do {
          b = str.charCodeAt(i++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        const d = result & 1 ? ~(result >> 1) : result >> 1;
        if (k === 0) lat += d;
        else lon += d;
      }
      out.push([lat / factor, lon / factor]);
    }
    return out;
  }

  function withCumulative(points) {
    const cum = [0];
    for (let i = 1; i < points.length; i++) cum.push(cum[i - 1] + dist(points[i - 1], points[i]));
    return cum;
  }

  // 曲がり方の種類 → 表示と音声の言葉・矢印
  const TURNS = {
    straight: { text: "直進", arrow: "↑" },
    "slight-right": { text: "斜め右", arrow: "↗" },
    right: { text: "右折", arrow: "→" },
    "sharp-right": { text: "大きく右", arrow: "↘" },
    "slight-left": { text: "斜め左", arrow: "↖" },
    left: { text: "左折", arrow: "←" },
    "sharp-left": { text: "大きく左", arrow: "↙" },
    uturn: { text: "Uターン", arrow: "↶" },
    roundabout: { text: "ロータリー", arrow: "↻" },
    arrive: { text: "目的地", arrow: "🏁" },
  };

  // Valhalla の maneuver type → 曲がり方
  const VALHALLA_TYPES = {
    4: "arrive", 5: "arrive", 6: "arrive",
    7: "straight", 8: "straight", 17: "straight", 22: "straight", 25: "straight",
    9: "slight-right", 18: "slight-right", 20: "slight-right", 23: "slight-right",
    10: "right",
    11: "sharp-right",
    12: "uturn", 13: "uturn",
    14: "sharp-left",
    15: "left",
    16: "slight-left", 19: "slight-left", 21: "slight-left", 24: "slight-left",
    26: "roundabout", 27: "roundabout",
  };

  function fromValhalla(json) {
    const leg = json.trip.legs[0];
    const points = decodePolyline(leg.shape, 6);
    const cum = withCumulative(points);
    const steps = [];
    for (const m of leg.maneuvers) {
      const kind = VALHALLA_TYPES[m.type];
      if (!kind) continue; // 出発(1〜3)などは案内しない
      const at = cum[Math.min(m.begin_shape_index, cum.length - 1)];
      steps.push({ at, kind, street: (m.street_names || [])[0] || "" });
    }
    return finish(points, cum, steps, "Valhalla");
  }

  // OSRM の maneuver(type + modifier)→ 曲がり方
  function osrmKind(m) {
    if (m.type === "arrive") return "arrive";
    if (m.type === "depart") return null;
    if (m.type === "roundabout" || m.type === "rotary" || m.type === "exit roundabout") return "roundabout";
    const mod = (m.modifier || "straight").replace(" ", "-");
    if (m.type === "new name" || m.type === "continue") return mod === "straight" ? null : mod;
    return TURNS[mod] ? mod : "straight";
  }

  function fromOsrm(json) {
    const r = json.routes[0];
    const points = r.geometry.coordinates.map(([lon, lat]) => [lat, lon]);
    const cum = withCumulative(points);
    const steps = [];
    let at = 0;
    for (const s of r.legs[0].steps) {
      const kind = osrmKind(s.maneuver);
      if (kind) steps.push({ at: Math.min(at, cum[cum.length - 1]), kind, street: s.name || "" });
      at += s.distance;
    }
    return finish(points, cum, steps, "OSRM");
  }

  function finish(points, cum, steps, source) {
    const length = cum[cum.length - 1];
    if (!steps.length || steps[steps.length - 1].kind !== "arrive") steps.push({ at: length, kind: "arrive", street: "" });
    return { points, cum, length, steps, source };
  }

  // ---------- ルートの取得 ----------
  // from: { lat, lon, heading? }  to: { lat, lon }
  async function fetchRoute(from, to) {
    try {
      const loc0 = { lat: from.lat, lon: from.lon };
      if (from.heading != null) Object.assign(loc0, { heading: Math.round(from.heading), heading_tolerance: 60 });
      const req = {
        locations: [loc0, { lat: to.lat, lon: to.lon }],
        costing: "bicycle",
        costing_options: { bicycle: { bicycle_type: "Road", use_roads: 0.5, use_hills: 0.3 } },
        directions_options: { units: "kilometers" },
      };
      const res = await fetch("https://valhalla1.openstreetmap.de/route?json=" + encodeURIComponent(JSON.stringify(req)));
      if (!res.ok) throw new Error(res.status);
      return fromValhalla(await res.json());
    } catch (e) {
      // OSRM で再試行
    }
    const res = await fetch(
      `https://routing.openstreetmap.de/routed-bike/route/v1/bike/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson&steps=true`
    );
    if (!res.ok) throw new Error(res.status);
    const json = await res.json();
    if (!json.routes || !json.routes.length) throw new Error("no route");
    return fromOsrm(json);
  }

  // ---------- ルート上の現在位置 ----------
  // 戻り値: { along: ルートの始点からの距離(m), off: ルートからの距離(m), seg }
  // hint があれば、前回の位置の近くから探す(行ったり来たりする道で、反対側に飛ばないように)
  function snap(route, pos, hint) {
    const pts = route.points;
    const lat0 = pos.lat;
    const [px, py] = toXY(pos.lat, pos.lon, lat0);
    const search = (lo, hi) => {
      let best = null;
      for (let i = Math.max(0, lo); i < Math.min(pts.length - 1, hi); i++) {
        const [ax, ay] = toXY(pts[i][0], pts[i][1], lat0);
        const [bx, by] = toXY(pts[i + 1][0], pts[i + 1][1], lat0);
        const dx = bx - ax;
        const dy = by - ay;
        const len2 = dx * dx + dy * dy;
        const t = len2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2)) : 0;
        const off = Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
        if (!best || off < best.off) best = { seg: i, off, along: route.cum[i] + t * (route.cum[i + 1] - route.cum[i]) };
      }
      return best;
    };
    if (hint && hint.seg != null) {
      // 少し戻ったところから、600m先までを探す
      let hi = hint.seg;
      while (hi < pts.length - 1 && route.cum[hi] < hint.along + 600) hi++;
      const near = search(hint.seg - 5, hi + 1);
      if (near && near.off < OFF_ROUTE_M) return near;
    }
    return search(0, pts.length - 1) || { seg: 0, off: Infinity, along: 0 };
  }

  // 次に案内する曲がり角と、そこまでの距離
  function next(route, along) {
    const i = route.steps.findIndex((s) => s.at > along + 8);
    const idx = i < 0 ? route.steps.length - 1 : i;
    const step = route.steps[idx];
    return { idx, step, dist: Math.max(0, step.at - along), after: route.steps[idx + 1] || null };
  }

  function turnInfo(kind) {
    return TURNS[kind] || TURNS.straight;
  }

  // 表示用の距離(50m単位、1km以上はkm)
  function distText(m) {
    if (m >= 1000) return (m / 1000).toFixed(1) + "km";
    if (m >= 100) return Math.round(m / 50) * 50 + "m";
    return Math.max(10, Math.round(m / 10) * 10) + "m";
  }

  // 音声案内の文。phase: "far"(手前) / "near"(直前)
  function speech(step, d, phase) {
    if (step.kind === "arrive") return phase === "near" ? "まもなく目的地です" : `${distText(d)}先、目的地です`;
    const t = turnInfo(step.kind).text;
    if (phase === "near") return `まもなく${t}です`;
    return `${distText(d)}先、${t}です` + (step.street ? `。${step.street}に入ります` : "");
  }

  // 音声で案内するかどうか。announced: { [stepIdx]: Set(phase) }
  // 手前の案内は約20秒前(最低150m)、直前の案内は40m手前
  function announcement(route, along, speed, announced) {
    const n = next(route, along);
    if (n.step.kind === "straight") return null;
    const farM = Math.max(150, (speed || 5) * 20);
    const done = announced[n.idx] || (announced[n.idx] = new Set());
    if (n.dist <= 40 && !done.has("near")) {
      done.add("near");
      done.add("far");
      return speech(n.step, n.dist, "near");
    }
    if (n.dist <= farM && n.dist > 60 && !done.has("far")) {
      done.add("far");
      return speech(n.step, n.dist, "far");
    }
    return null;
  }

  // ルートから外れたかを数える。戻り値 true ならルートを引き直す
  function offRoute(state, off, accuracy) {
    if (off > OFF_ROUTE_M + Math.min(30, accuracy || 0)) state.offCount = (state.offCount || 0) + 1;
    else state.offCount = 0;
    return state.offCount >= OFF_ROUTE_COUNT;
  }

  return { decodePolyline, fromValhalla, fromOsrm, fetchRoute, snap, next, turnInfo, distText, speech, announcement, offRoute };
})();

if (typeof module !== "undefined") module.exports = Nav;
