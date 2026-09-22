// 任意の中国語テキストをピンイン(声調記号付き)に変換するヘルパー。
// pinyin-pro を CDN からESMで読み込む。読み込みに失敗しても他の機能は
// 壊れないよう、呼び出し側は window.PinyinConv の有無を確認してから使う。

let pinyinPromise = null;

async function loadPinyinLib() {
  if (!pinyinPromise) {
    pinyinPromise = import("https://cdn.jsdelivr.net/npm/pinyin-pro@3/dist/index.mjs")
      .then((mod) => mod.pinyin)
      .catch((err) => {
        console.warn("pinyin-pro の読み込みに失敗しました", err);
        return null;
      });
  }
  return pinyinPromise;
}

window.PinyinConv = {
  async convert(text) {
    const pinyinFn = await loadPinyinLib();
    if (!pinyinFn || !text) return null;
    try {
      return pinyinFn(text, { toneType: "symbol", type: "string" });
    } catch (err) {
      console.warn("ピンイン変換に失敗しました", err);
      return null;
    }
  },
  // 1文字ずつの声調なしピンイン配列(発音採点で同音異字を正解扱いにするため)
  async toSyllables(text) {
    const pinyinFn = await loadPinyinLib();
    if (!pinyinFn || !text) return null;
    try {
      return pinyinFn(text, { toneType: "none", type: "array" });
    } catch (err) {
      return null;
    }
  },
};
