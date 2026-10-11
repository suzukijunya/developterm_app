// 住所・駅名・施設名から緯度経度を探す。
// 国土地理院の住所検索(住所に強い)と OpenStreetMap(駅名・施設名に強い)の両方で探し、
// 近くの場所を優先して近い順に並べる。
// 「35.7295, 139.7109」のような緯度経度(Googleマップで長押しするとコピーできる)もそのまま使える。

const Geocode = (() => {
  const P = typeof Physics !== "undefined" ? Physics : require("./physics.js");
  const NEAR_DEG = 0.25; // 近くを優先して探す範囲(緯度経度で±0.25度 ≒ 25km)
  const MAX_RESULTS = 10;

  function parseLatLon(q) {
    const m = q.match(/^\s*(-?\d{1,3}\.\d+)\s*[,、\s]\s*(-?\d{1,3}\.\d+)\s*$/);
    if (!m) return null;
    const lat = parseFloat(m[1]);
    const lon = parseFloat(m[2]);
    if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
    return [{ label: `緯度 ${lat.toFixed(5)}, 経度 ${lon.toFixed(5)}`, lat, lon }];
  }

  async function gsi(q) {
    const res = await fetch("https://msearch.gsi.go.jp/address-search/AddressSearch?q=" + encodeURIComponent(q));
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    return data.slice(0, 10).map((f) => ({
      label: f.properties.title,
      lat: f.geometry.coordinates[1],
      lon: f.geometry.coordinates[0],
    }));
  }

  // near があれば、その周辺だけで探す
  async function osm(q, near) {
    let url = "https://nominatim.openstreetmap.org/search?format=json&limit=10&countrycodes=jp&accept-language=ja&q=" + encodeURIComponent(q);
    if (near) {
      const box = [near.lon - NEAR_DEG, near.lat + NEAR_DEG, near.lon + NEAR_DEG, near.lat - NEAR_DEG].map((x) => x.toFixed(3));
      url += "&bounded=1&viewbox=" + box.join(",");
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    return data.map((r) => ({
      // 「池袋駅, 西池袋一丁目, 豊島区, 東京都, 171-0021, 日本」→ 郵便番号と国名を除いて先頭の4つまで
      label: r.display_name.split(", ").filter((s) => s !== "日本" && !/^\d{3}-\d{4}$/.test(s)).slice(0, 4).join(" "),
      lat: parseFloat(r.lat),
      lon: parseFloat(r.lon),
    }));
  }

  // 戻り値: 候補の配列(近い順、見つからなければ空)。どの検索も使えなければ例外
  // near: { lat, lon } 現在地など。あれば近くの候補を優先する
  async function search(q, near) {
    const direct = parseLatLon(q);
    if (direct) return direct;
    const tasks = [gsi(q), near ? osm(q, near) : osm(q)];
    const settled = await Promise.allSettled(tasks);
    let list = settled.filter((s) => s.status === "fulfilled").flatMap((s) => s.value);
    let failed = settled.filter((s) => s.status === "rejected").length;
    // 近くの候補が10件に満たなければ、全国の候補で埋める
    if (near && list.length < MAX_RESULTS) {
      try {
        list = list.concat(await osm(q));
      } catch (e) {
        failed++;
      }
    }
    if (!list.length && failed >= 2) throw new Error("search unavailable");
    // 同じ場所(50m以内)の重複を除く
    const out = [];
    for (const r of list) {
      if (!out.some((o) => P.distance(o.lat, o.lon, r.lat, r.lon) < 50)) out.push(r);
    }
    if (near) {
      for (const r of out) r.dist = P.distance(near.lat, near.lon, r.lat, r.lon);
      out.sort((a, b) => a.dist - b.dist);
    }
    return out.slice(0, MAX_RESULTS);
  }

  // 緯度経度から住所を調べる。OpenStreetMap → だめなら国土地理院(町名まで)。わからなければ null
  async function reverse(lat, lon) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&zoom=18&accept-language=ja&lat=${lat.toFixed(6)}&lon=${lon.toFixed(6)}`
      );
      if (!res.ok) throw new Error(res.status);
      const a = (await res.json()).address || {};
      const town = a.quarter || a.neighbourhood || a.suburb || a.city_district || "";
      const parts = [a.province || a.state || "", a.city || a.town || a.village || "", town, a.house_number || ""];
      const text = parts.filter((x, i) => x && parts.indexOf(x) === i).join("");
      // 建物や施設に名前があれば先頭につける(名前のない建物は "yes" になる)
      const name = [a.amenity, a.shop, a.office, a.building].find((x) => x && x !== "yes");
      if (text) return (name ? name + " " : "") + text + " 付近";
    } catch (e) {
      // 国土地理院で再試行
    }
    try {
      const res = await fetch(`https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=${lat}&lon=${lon}`);
      const r = (await res.json()).results;
      if (r && r.lv01Nm && r.lv01Nm !== "－") return r.lv01Nm + " 付近";
    } catch (e) {
      // わからない
    }
    return null;
  }

  return { search, reverse, parseLatLon };
})();

if (typeof module !== "undefined") module.exports = Geocode;
