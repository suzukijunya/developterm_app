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

  // スピーキング問題に入る前に先にマイク許可を取っておく(失敗しても無視。
  // 実際の許可ダイアログの表示回数はブラウザ側の設定に依存するため、
  // ここではアプリ側から不要に何度も要求しないことだけを保証する)
  function ensureMicPermission() {
    if (!isRecordingSupported()) return Promise.resolve(false);
    return getMicStream()
      .then(() => true)
      .catch(() => false);
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

  // 音声認識を開始し、{ result: Promise<string[]>, stop() } を返す。
  // stop() で「タップして終了」でき、その時点までの発話で結果が確定する
  function startRecognition({ timeout = 12000 } = {}) {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return { result: Promise.reject(new Error("no-stt")), stop() {} };

    const recognition = new Recognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    const result = new Promise((resolve, reject) => {
      let done = false;
      const timer = setTimeout(() => {
        if (!done) recognition.stop();
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

    return {
      result,
      stop() {
        try {
          recognition.stop();
        } catch (e) {
          // 既に終了している場合は何もしない
        }
      },
    };
  }

  function recognizeOnce(options) {
    return startRecognition(options).result;
  }

  // 録音中の波形表示用に、マイク入力の音量(0〜1)を読み取れるメーターを作る
  async function createLevelMeter() {
    const stream = await getMicStream();
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) throw new Error("no-audio-context");
    const ctx = new Ctx();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const data = new Uint8Array(analyser.fftSize);
    return {
      read() {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        return Math.min(1, Math.sqrt(sum / data.length) * 4);
      },
      close() {
        source.disconnect();
        ctx.close().catch(() => {});
      },
    };
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
    startRecognition,
    createLevelMeter,
    normalizePinyin,
    isRecordingSupported,
    startRecording,
    ensureMicPermission,
  };
})();
