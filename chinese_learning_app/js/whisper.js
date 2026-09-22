// ブラウザ内でWhisperモデルを実行し、発音の認識精度を上げるためのヘルパー。
// transformers.js(Hugging Face)経由でWhisperをCDNから読み込み、録音した
// 音声Blobをその場で文字起こしする。サーバーもAPIキーも不要な代わりに、
// 初回利用時にモデルファイル(数十MB)のダウンロードが発生する。
//
// 読み込みや推論に失敗した場合は null を返す設計にしており、呼び出し側
// (exercises.js)は失敗時に既存のWeb Speech APIによる認識結果をそのまま
// 使い続ける(壊れないフォールバック)。

const WhisperASR = (() => {
  const MODEL_ID = "Xenova/whisper-base";
  let pipelinePromise = null;
  let loaded = false;
  let loading = false;

  async function getPipeline(onProgress) {
    if (!pipelinePromise) {
      loading = true;
      pipelinePromise = import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@3")
        .then(({ pipeline }) =>
          pipeline("automatic-speech-recognition", MODEL_ID, {
            progress_callback: (info) => {
              if (onProgress) onProgress(info);
            },
          })
        )
        .then((p) => {
          loaded = true;
          loading = false;
          return p;
        })
        .catch((err) => {
          loading = false;
          pipelinePromise = null; // 失敗時は次回また読み込みを試せるようにする
          console.warn("Whisperモデルの読み込みに失敗しました", err);
          throw err;
        });
    }
    return pipelinePromise;
  }

  // 録音したBlobを、Whisperが要求する16kHzモノラルのFloat32配列に変換する
  async function blobToPcm16k(blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioCtx();
    let audioBuffer;
    try {
      audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    } finally {
      audioCtx.close();
    }
    const raw = audioBuffer.getChannelData(0);
    if (Math.round(audioBuffer.sampleRate) === 16000) return raw;
    const ratio = audioBuffer.sampleRate / 16000;
    const outLength = Math.round(raw.length / ratio);
    const out = new Float32Array(outLength);
    for (let i = 0; i < outLength; i++) {
      out[i] = raw[Math.min(raw.length - 1, Math.round(i * ratio))];
    }
    return out;
  }

  function isSupported() {
    return !!(window.AudioContext || window.webkitAudioContext);
  }

  async function transcribe(blob, { onProgress } = {}) {
    if (!isSupported()) return null;
    try {
      const transcriber = await getPipeline(onProgress);
      const audio = await blobToPcm16k(blob);
      const result = await transcriber(audio, { language: "chinese", task: "transcribe" });
      const text = (result && result.text ? result.text : "").trim();
      return text || null;
    } catch (err) {
      console.warn("Whisperによる音声認識に失敗しました", err);
      return null;
    }
  }

  return {
    transcribe,
    isSupported,
    get loaded() {
      return loaded;
    },
    get loading() {
      return loading;
    },
  };
})();

window.WhisperASR = WhisperASR;
