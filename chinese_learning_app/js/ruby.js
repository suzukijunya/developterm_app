// 漢字の上にピンインを1文字ずつ載せて表示するためのヘルパー。
// データ側のピンインは「単語ごとにスペース区切り」なので、音節に分割して
// 漢字1文字ずつに対応付け、あわせて単語の区切り(タイル問題用)も得る。

const Ruby = (() => {
  const VOWELS = "aeiouüvāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ";
  const PINYIN_SEPARATORS = /[\s,.!?;:，。！？、；：…“”"()（）«»\-—]+/;

  function isVowel(ch) {
    return VOWELS.includes(ch);
  }

  function isHanzi(ch) {
    return /[㐀-鿿豈-﫿]/.test(ch);
  }

  // 1語分のピンイン(例: "xuéshēng")を音節(["xué","shēng"])に分割する。
  // 母音のかたまりの間の子音は、zh/ch/shなら2文字、それ以外は1文字を
  // 次の音節の声母とみなす(ピンイン正書法では曖昧な境界に ' が入るため)
  function splitWord(word) {
    return word.split(/['’]/).filter(Boolean).flatMap((part) => {
      const lower = part.toLowerCase();
      const clusters = [];
      let i = 0;
      while (i < lower.length) {
        if (isVowel(lower[i])) {
          let j = i;
          while (j < lower.length && isVowel(lower[j])) j++;
          clusters.push([i, j]);
          i = j;
        } else {
          i++;
        }
      }
      if (clusters.length <= 1) return [part];
      const cuts = [];
      for (let k = 0; k < clusters.length - 1; k++) {
        const consStart = clusters[k][1];
        const consEnd = clusters[k + 1][0];
        const cons = lower.slice(consStart, consEnd);
        const initialLen = /(zh|ch|sh)$/.test(cons) ? 2 : Math.min(1, cons.length);
        cuts.push(consEnd - initialLen);
      }
      const out = [];
      let prev = 0;
      cuts.forEach((c) => {
        out.push(part.slice(prev, c));
        prev = c;
      });
      out.push(part.slice(prev));
      return out.filter(Boolean);
    });
  }

  // 漢字とピンインを単語単位に対応付ける。対応が取れない場合は null。
  // 戻り値: [{ type: "word", chars: [{ ch, py }] } | { type: "punct", text }]
  // 儿化音(nǎr=哪儿 など)。単独の er/ér/ěr/èr は通常の音節なので除く
  function isErhua(syllable) {
    const plain = syllable.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    return plain.endsWith("r") && plain !== "er";
  }

  function segment(hanzi, pinyin) {
    if (!hanzi || !pinyin) return null;
    // 会話文の「A:」「B:」や「ABC公司」のようなアルファベット(大文字のみの語)は
    // ピンインではないので対応付けの対象から外す
    const words = pinyin
      .split(PINYIN_SEPARATORS)
      .filter((w) => w && !/^[A-Z]+$/.test(w))
      .map(splitWord);
    const chars = Array.from(hanzi);
    const syllableTotal = words.reduce((n, w) => n + w.length, 0);
    const erhuaTotal = words.reduce((n, w) => n + w.filter(isErhua).length, 0);
    const hanziTotal = chars.filter(isHanzi).length;
    if (syllableTotal === 0) return null;
    let erhuaMode = false;
    if (hanziTotal === syllableTotal + erhuaTotal && erhuaTotal > 0) erhuaMode = true;
    else if (hanziTotal !== syllableTotal) return null;

    const tokens = [];
    let ci = 0;
    function flushPunct() {
      let text = "";
      while (ci < chars.length && !isHanzi(chars[ci])) {
        text += chars[ci];
        ci++;
      }
      const trimmed = text.replace(/\s+/g, "");
      if (trimmed) tokens.push({ type: "punct", text: trimmed });
    }
    words.forEach((syllables) => {
      flushPunct();
      const wordChars = [];
      syllables.forEach((py) => {
        while (ci < chars.length && !isHanzi(chars[ci])) ci++;
        wordChars.push({ ch: chars[ci], py });
        ci++;
        if (erhuaMode && isErhua(py) && chars[ci] === "儿") {
          wordChars.push({ ch: "儿", py: "" });
          ci++;
        }
      });
      tokens.push({ type: "word", chars: wordChars });
    });
    flushPunct();
    const aligned = tokens.every((t) => t.type === "punct" || t.chars.every((c) => c.ch && isHanzi(c.ch)));
    return aligned && ci >= chars.length ? tokens : null;
  }

  function wordText(token) {
    return token.type === "word" ? token.chars.map((c) => c.ch).join("") : token.text;
  }

  function wordPinyin(token) {
    return token.type === "word" ? token.chars.map((c) => c.py).join("") : "";
  }

  // タイル問題用: 句読点は直前の単語にくっつけた単語リストを返す
  function tiles(hanzi, pinyin) {
    const tokens = segment(hanzi, pinyin);
    if (!tokens) return null;
    const out = [];
    tokens.forEach((t) => {
      if (t.type === "punct") {
        if (out.length > 0) out[out.length - 1].punct += t.text;
        return;
      }
      out.push({ hanzi: wordText(t), pinyin: wordPinyin(t), chars: t.chars, punct: "" });
    });
    return out;
  }

  function charRuby(ch, py) {
    const ruby = document.createElement("ruby");
    ruby.className = "rb-char";
    ruby.appendChild(document.createTextNode(ch));
    const rt = document.createElement("rt");
    rt.textContent = py || "";
    ruby.appendChild(rt);
    return ruby;
  }

  // 1文字ずつピンインを載せた文を描画する。対応が取れない場合は
  // ピンイン行 + 漢字行の2段表示にフォールバックする。
  // 漢字1文字ごとの要素には data-i(漢字の通し番号)を振り、
  // 発音の採点結果で色付けできるようにする
  function render(hanzi, pinyin, { className = "", highlight = null } = {}) {
    const line = document.createElement("span");
    line.className = "rb-line " + className;
    const tokens = segment(hanzi, pinyin);
    let hanziIndex = 0;

    if (!tokens) {
      line.classList.add("rb-line--fallback");
      if (pinyin) {
        const py = document.createElement("span");
        py.className = "rb-fallback-pinyin";
        py.textContent = pinyin;
        line.appendChild(py);
      }
      const hz = document.createElement("span");
      hz.className = "rb-fallback-hanzi";
      Array.from(hanzi).forEach((ch) => {
        const span = document.createElement("span");
        span.textContent = ch;
        if (isHanzi(ch)) {
          span.className = "rb-char";
          span.dataset.i = String(hanziIndex++);
        }
        hz.appendChild(span);
      });
      line.appendChild(hz);
      return line;
    }

    tokens.forEach((t) => {
      if (t.type === "punct") {
        const p = document.createElement("span");
        p.className = "rb-punct";
        p.appendChild(charRuby(t.text, ""));
        line.appendChild(p);
        return;
      }
      const w = document.createElement("span");
      w.className = "rb-word";
      if (highlight && wordText(t) === highlight) w.classList.add("rb-word--highlight");
      t.chars.forEach((c) => {
        const r = charRuby(c.ch, c.py);
        r.dataset.i = String(hanziIndex++);
        w.appendChild(r);
      });
      line.appendChild(w);
    });
    return line;
  }

  return { segment, tiles, render, splitWord, isHanzi, wordText };
})();

if (typeof module !== "undefined") module.exports = Ruby;
