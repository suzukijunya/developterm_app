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

  // マイクの使用許可を1回取得したら使い回し、毎回ブラウザの許可ダイアログが
  // 出ないようにする(取得済みかつ有効なストリームがあれば再利用)
  let cachedMicStream = null;
  async function getMicStream() {
    if (cachedMicStream && cachedMicStream.active) return cachedMicStream;
    cachedMicStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return cachedMicStream;
  }

  function isRecordingSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }

  // 発音練習の録音。stop()を呼ぶと録音したBlobを返す(あとで再生するため)
  async function startRecording() {
    if (!isRecordingSupported()) throw new Error("no-recording");
    const stream = await getMicStream();
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };
    const stopped = new Promise((resolve) => {
      recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType || "audio/webm" }));
    });
    recorder.start();
    return {
      stop: async () => {
        if (recorder.state !== "inactive") recorder.stop();
        else return new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        return stopped;
      },
    };
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

  return {
    speak,
    isRecognitionSupported,
    recognizeOnce,
    normalizePinyin,
    isRecordingSupported,
    startRecording,
  };
})();
