// 新しい版が出ていたら、開いたとき・戻ってきたときに自動で読み込み直す(スマホは古い版を覚えていることがある)。
// 自分の版は、この script の ?v= から読む。走っている最中(シティデュエルの走行中)は読み込み直さない。
(() => {
  const me = document.currentScript, ver = me && (me.src.split("?v=")[1] || "");
  const tag = document.getElementById("app-ver");
  if (tag && ver) tag.textContent = "版 " + ver;
  async function check() {
    try {
      const hud = document.getElementById("ct-hud");
      if (hud && !hud.hidden) return; // 走行中
      const latest = (await (await fetch("version.json?t=" + Date.now(), { cache: "no-store" })).json()).version;
      if (latest && ver && latest !== ver && sessionStorage.getItem("page_reloaded") !== latest) {
        sessionStorage.setItem("page_reloaded", latest); // 読み込み直しを繰り返さないように
        location.replace(location.pathname + "?v=" + latest);
      }
    } catch (e) {}
  }
  document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && check());
  check();
})();
