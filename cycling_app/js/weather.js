// 天気予報(Open-Meteo)から、現在の天気と1時間ごとの予報を取得する。
// 位置は約1km単位に丸めて送る。取得できなければ null(無風として計算する)。

const Weather = (() => {
  const TTL = 15 * 60 * 1000;
  let cache = null; // { lat, lon, at, current, hourly }
  let pending = null;

  // WMO天気コード → 絵文字と日本語
  function describe(code) {
    if (code === 0) return { icon: "☀️", label: "快晴" };
    if (code === 1) return { icon: "🌤️", label: "晴れ" };
    if (code === 2) return { icon: "⛅", label: "晴れ時々曇り" };
    if (code === 3) return { icon: "☁️", label: "曇り" };
    if (code === 45 || code === 48) return { icon: "🌫️", label: "霧" };
    if (code >= 51 && code <= 57) return { icon: "🌦️", label: "霧雨" };
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { icon: "🌧️", label: "雨" };
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { icon: "🌨️", label: "雪" };
    if (code >= 95) return { icon: "⛈️", label: "雷雨" };
    return { icon: "🌡️", label: "" };
  }

  function near(a, lat, lon) {
    return Math.abs(a.lat - lat) < 0.03 && Math.abs(a.lon - lon) < 0.03;
  }

  async function get(lat, lon) {
    if (cache && Date.now() - cache.at < TTL && near(cache, lat, lon)) return cache;
    if (pending) return pending;
    pending = load(lat, lon).finally(() => {
      pending = null;
    });
    return pending;
  }

  async function load(lat, lon) {
    try {
      const url =
        "https://api.open-meteo.com/v1/forecast?latitude=" + lat.toFixed(2) + "&longitude=" + lon.toFixed(2) +
        "&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m" +
        "&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m,wind_direction_10m" +
        "&wind_speed_unit=ms&timezone=auto&timeformat=unixtime&forecast_days=2";
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.status);
      const d = await res.json();
      const c = d.current;
      const h = d.hourly;
      const now = Date.now();
      const hourly = h.time
        .map((t, i) => ({
          t: t * 1000,
          temp: h.temperature_2m[i],
          pop: h.precipitation_probability[i],
          code: h.weather_code[i],
          speed: h.wind_speed_10m[i],
          from: h.wind_direction_10m[i],
        }))
        .filter((x) => x.t > now - 3600 * 1000)
        .slice(0, 12);
      cache = {
        lat,
        lon,
        at: now,
        current: { temp: c.temperature_2m, code: c.weather_code, speed: c.wind_speed_10m, from: c.wind_direction_10m },
        hourly,
      };
      return cache;
    } catch (e) {
      return cache; // 失敗したら前回の結果を使う
    }
  }

  // 通勤予報用: いくつかの地点(出発地・途中・目的地)の、1時間ごとと15分ごとの予報を1回で取る
  const routeCache = {};
  async function route(points) {
    const key = points.map((p) => p.lat.toFixed(2) + "," + p.lon.toFixed(2)).join("|");
    const c = routeCache[key];
    if (c && Date.now() - c.at < TTL) return c.data;
    try {
      const url =
        "https://api.open-meteo.com/v1/forecast?latitude=" + points.map((p) => p.lat.toFixed(2)).join(",") +
        "&longitude=" + points.map((p) => p.lon.toFixed(2)).join(",") +
        "&hourly=precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m" +
        "&minutely_15=precipitation&forecast_minutely_15=24" +
        "&wind_speed_unit=ms&timezone=auto&timeformat=unixtime&forecast_days=2";
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.status);
      let d = await res.json();
      if (!Array.isArray(d)) d = [d];
      const now = Date.now();
      const data = d.map((x) => ({
        hourly: x.hourly.time
          .map((t, i) => ({ t: t * 1000, pop: x.hourly.precipitation_probability[i], mm: x.hourly.precipitation[i], code: x.hourly.weather_code[i], speed: x.hourly.wind_speed_10m[i], from: x.hourly.wind_direction_10m[i] }))
          .filter((h) => h.t > now - 3 * 3600 * 1000 && h.t < now + 8 * 3600 * 1000),
        m15: x.minutely_15 && x.minutely_15.time ? x.minutely_15.time.map((t, i) => ({ t: t * 1000, mm: x.minutely_15.precipitation[i] })).filter((m) => m.t > now - 30 * 60 * 1000) : [],
      }));
      routeCache[key] = { at: now, data };
      return data;
    } catch (e) {
      return c ? c.data : null;
    }
  }

  return { get, route, describe, get latest() { return cache; } };
})();
