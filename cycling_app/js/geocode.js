// 住所・駅名・施設名から緯度経度を探す。
// 国土地理院の住所検索(住所に強い)→ 見つからなければ OpenStreetMap(駅名・施設名に強い)の順に探す。
// 「35.7295, 139.7109」のような緯度経度(Googleマップで長押しするとコピーできる)もそのまま使える。

const Geocode = (() => {
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
    return data.slice(0, 5).map((f) => ({
      label: f.properties.title,
      lat: f.geometry.coordinates[1],
      lon: f.geometry.coordinates[0],
    }));
  }

  async function osm(q) {
    const res = await fetch(
      "https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=jp&accept-language=ja&q=" + encodeURIComponent(q)
    );
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    return data.map((r) => ({
      // 「池袋駅, 西池袋一丁目, 豊島区, 東京都, 171-0021, 日本」→ 先頭の4つまで
      label: r.display_name.split(", ").filter((s) => s !== "日本" && !/^\d{3}-\d{4}$/.test(s)).slice(0, 4).join(" "),
      lat: parseFloat(r.lat),
      lon: parseFloat(r.lon),
    }));
  }

  // 戻り値: 候補の配列(見つからなければ空)。どちらの検索も使えなければ例外
  async function search(q) {
    const direct = parseLatLon(q);
    if (direct) return direct;
    let failed = 0;
    for (const fn of [gsi, osm]) {
      try {
        const list = await fn(q);
        if (list.length) return list;
      } catch (e) {
        failed++;
      }
    }
    if (failed === 2) throw new Error("search unavailable");
    return [];
  }

  return { search, parseLatLon };
})();
