// 診断用の足あとログ。ホーム画面アプリがメモリ不足などで落ちると画面ごと
// 再読み込みされてエラーを拾えないので、処理の区切りごとに localStorage へ
// 記録しておき、次に開いたとき「どこで落ちたか」を設定画面に表示する。
const APP_VERSION = "2026.09.26b";

const Diag = (() => {
  const KEY = "zh_diag_v1";
  const MAX = 40;

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || { trail: [], active: null, crashes: [] };
    } catch (e) {
      return { trail: [], active: null, crashes: [] };
    }
  }

  function save(d) {
    try {
      localStorage.setItem(KEY, JSON.stringify(d));
    } catch (e) {
      /* 保存できなくても動作には影響しない */
    }
  }

  const data = load();

  // 前回「作業中」のまま終わっていたら、落ちた可能性が高いので記録する
  if (data.active) {
    data.crashes.unshift({
      at: data.active.at,
      during: data.active.name,
      version: data.active.version,
      trail: data.trail.slice(-12),
    });
    data.crashes = data.crashes.slice(0, 5);
    data.active = null;
  }
  data.trail = [];
  save(data);

  function time() {
    const d = new Date();
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}.${String(d.getMilliseconds()).padStart(3, "0")}`;
  }

  function mark(step) {
    data.trail.push(`${time()} ${step}`);
    if (data.trail.length > MAX) data.trail.splice(0, data.trail.length - MAX);
    save(data);
  }

  // 落ちる可能性がある処理の開始/終了。終了せずにページが消えたら次回「落ちた」と判定する
  function begin(name) {
    data.active = { name, at: new Date().toLocaleString("ja-JP"), version: APP_VERSION };
    mark(`▶ ${name}`);
  }

  function end() {
    if (data.active) mark(`■ ${data.active.name}`);
    data.active = null;
    save(data);
  }

  function crashes() {
    return data.crashes.slice();
  }

  function clear() {
    data.crashes = [];
    data.trail = [];
    save(data);
  }

  // ページを閉じる・別アプリに切り替えるのは正常終了として扱う
  window.addEventListener("pagehide", () => {
    if (data.active) {
      mark("(画面を閉じた)");
      data.active = null;
      save(data);
    }
  });

  return { mark, begin, end, crashes, clear };
})();
