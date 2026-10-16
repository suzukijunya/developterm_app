// パーツ表の読み込み: 表計算ソフトからのコピー(貼り付け)・CSV・表の写真(文字認識)から、
// パーツ名と重さを読み取り、部位を推定する。

const Importer = (() => {
  // 部位を推定するための言葉(上から順に調べる)
  const RULES = [
    { slot: "tubes", words: ["チューブ", "tube", "シーラント", "sealant"] },
    { slot: "tires", words: ["タイヤ", "tire", "tyre", "agilist", "gp5000", "gp 5000"] },
    { slot: "wheels", words: ["ホイール", "wheel", "リム", "ハブ"] },
    { slot: "fork", words: ["フォーク", "fork"] },
    { slot: "frame", words: ["フレーム", "frame", "ヘッドセット", "headset", "ヘッドパーツ"] },
    { slot: "bartape", words: ["バーテープ", "bar tape", "bartape"] },
    { slot: "handlebar", words: ["ハンドル", "handlebar", "ドロップバー"] },
    { slot: "stem", words: ["ステム", "stem"] },
    { slot: "seatpost", words: ["シートポスト", "seatpost", "seat post", "ピラー"] },
    { slot: "saddle", words: ["サドル", "saddle"] },
    { slot: "pedals", words: ["ペダル", "pedal"] },
    { slot: "cages", words: ["ケージ", "cage", "ボトル", "bottle"] },
    {
      slot: "groupset",
      words: ["クランク", "crank", "bb", "ボトムブラケット", "ディレイラー", "ディレーラー", "derailleur", "sti", "レバー", "シフター", "shifter", "スプロケット", "カセット", "cassette", "sprocket", "チェーン", "chain", "ブレーキ", "brake", "キャリパー", "ローター", "rotor", "グループセット", "コンポ"],
    },
    { slot: "accessories", words: ["クイック", "quick", "スルーアクスル", "ライト", "light", "サイコン", "マウント", "ベル", "スタンド", "バッグ", "bag", "小物"] },
  ];

  // 合計の行(読み込まずに、合計の確かめに使う)
  const TOTAL_WORDS = ["合計", "総重量", "トータル", "total", "小計", "全体", "込み", "込"];

  function norm(s) {
    return String(s || "").normalize("NFKC").trim();
  }

  function guessSlot(text) {
    const t = norm(text).toLowerCase();
    for (const r of RULES) if (r.words.some((w) => t.includes(w))) return r.slot;
    return "accessories";
  }

  // 1行を「名前・重さ・備考」に分ける。重さがなければ null
  function splitRow(line) {
    const raw = norm(line);
    if (!raw) return null;
    // 表計算ソフトのコピーはタブ区切り、CSVはカンマ区切り
    let cells = raw.includes("\t") ? raw.split("\t") : /,(?!\d{3}(?!\d))/.test(raw) && raw.split(",").length >= 2 && !/\d,\d{3}/.test(raw) ? raw.split(",") : null;
    if (cells) {
      cells = cells.map((c) => c.trim().replace(/^"|"$/g, ""));
      const wi = cells.findIndex((c, i) => i > 0 && /^[\d,]+(\.\d+)?\s*(g|kg)?$/i.test(c));
      if (wi < 0) return null;
      const w = cells[wi];
      const g = /kg/i.test(w) ? parseFloat(w.replace(/,/g, "")) * 1000 : parseFloat(w.replace(/,/g, ""));
      return { name: cells.slice(0, wi).filter(Boolean).join(" "), g, note: cells.slice(wi + 1).filter(Boolean).join(" ") };
    }
    // 写真の文字認識やスペース区切り: 「名前 1,850 備考」。名前の中の数字(25cなど)と区別するため、
    // 3桁区切りの数字か、前後に空白がある数字を重さとみなす(最後に見つかったもの)
    const re = /(?:^|\s)(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)\s*(kg|g)?(?=\s|$)/gi;
    let m, last = null;
    while ((m = re.exec(raw))) last = m;
    if (!last) return null;
    const name = raw.slice(0, last.index).trim();
    if (!name) return null;
    let g = parseFloat(last[1].replace(/,/g, ""));
    if (last[2] && last[2].toLowerCase() === "kg") g *= 1000;
    return { name, g, note: raw.slice(last.index + last[0].length).trim() };
  }

  // 表のテキストから行を読み取る。戻り値: { rows: [{ name, g, note, slot, include }], totals: [{ name, g }] }
  function parse(text) {
    const rows = [];
    const totals = [];
    for (const line of String(text || "").split(/\r?\n/)) {
      const r = splitRow(line);
      if (!r || !(r.g > 0) || r.g > 30000) continue;
      const label = r.name + " " + r.note;
      if (TOTAL_WORDS.some((w) => r.name.toLowerCase().includes(w))) {
        totals.push({ name: r.name, g: Math.round(r.g) });
        continue;
      }
      rows.push({ name: r.name.replace(/\s+/g, " "), g: Math.round(r.g), note: r.note, slot: guessSlot(label), include: true });
    }
    return { rows, totals };
  }

  // 行の名前・備考から分かる寸法など(タイヤ幅、一体型ハンドルなど)
  function attrsFrom(slot, text) {
    const t = norm(text).toLowerCase();
    const a = {};
    if (slot === "tires") {
      const m = t.match(/(\d{2})\s*c\b/) || t.match(/[x×]\s*(\d{2})/);
      if (m) a.width = +m[1];
    }
    if (slot === "handlebar" && /一体型|integrated/.test(t)) a.type = "integrated";
    if (slot === "frame" && /エアロ|aero/.test(t)) a.aero = "aero";
    return a;
  }

  // ---------- 写真の文字認識(tesseract.js をその場で読み込む) ----------
  let loading = null;
  function loadOcr() {
    if (window.Tesseract) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
      s.onload = resolve;
      s.onerror = () => {
        loading = null;
        reject(new Error("ocr"));
      };
      document.head.appendChild(s);
    });
    return loading;
  }

  // 写真の表を文字にする。onProgress(0〜1) で進み具合を返す
  async function ocr(file, onProgress) {
    await loadOcr();
    const worker = await Tesseract.createWorker(["jpn", "eng"], 1, {
      logger: (m) => {
        if (onProgress && m.status === "recognizing text") onProgress(m.progress);
      },
    });
    try {
      // 表は行ごとに読むのがよい
      await worker.setParameters({ tessedit_pageseg_mode: "6", preserve_interword_spaces: "1" });
      const res = await worker.recognize(file);
      return res.data.text;
    } finally {
      await worker.terminate();
    }
  }

  return { parse, guessSlot, attrsFrom, ocr, splitRow };
})();

if (typeof module !== "undefined") module.exports = Importer;
