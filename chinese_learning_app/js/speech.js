// 音声合成(TTS)・音声認識(STT)のヘルパー

const Speech = (() => {
  let zhVoice = null;

  function pickVoice() {
    if (!("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    zhVoice =
      voices.find((v) => v.lang === "zh-CN") ||
      voices.find((v) => v.lang && v.lang.startsWith("zh")) ||
      null;
    return zhVoice;
  }

  if ("speechSynthesis" in window) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }

  function speak(text, { rate = 0.9 } = {}) {
    if (!("speechSynthesis" in window)) {
      return Promise.reject(new Error("no-tts"));
    }
    return new Promise((resolve, reject) => {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "zh-CN";
      if (zhVoice) utter.voice = zhVoice;
      utter.rate = rate;
      utter.onend = () => resolve();
      utter.onerror = (e) => reject(e);
      window.speechSynthesis.speak(utter);
    });
  }

  function isRecognitionSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  function recognizeOnce({ timeout = 6000 } = {}) {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return Promise.reject(new Error("no-stt"));

    return new Promise((resolve, reject) => {
      const recognition = new Recognition();
      recognition.lang = "zh-CN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;

      let done = false;
      const timer = setTimeout(() => {
        if (!done) {
          done = true;
          recognition.stop();
          reject(new Error("timeout"));
        }
      }, timeout);

      recognition.onresult = (event) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        const alternatives = Array.from(event.results[0]).map((r) => r.transcript);
        resolve(alternatives);
      };

      recognition.onerror = (event) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        reject(event.error || new Error("recognition-error"));
      };

      recognition.onend = () => {
        if (!done) {
          done = true;
          clearTimeout(timer);
          reject(new Error("no-speech"));
        }
      };

      recognition.start();
    });
  }

  // 声調記号やスペースを取り除いた比較用文字列を作る
  function normalizePinyin(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // 声調記号(NFD分解された結合文字)を除去
      .replace(/[üǖǘǚǜ]/g, "u")
      .replace(/[^a-z]/g, ""); // スペース・数字・記号を除去
  }

  return { speak, isRecognitionSupported, recognizeOnce, normalizePinyin };
})();
