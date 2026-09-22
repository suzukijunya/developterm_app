// Claude API をブラウザから直接呼び出すためのヘルパー。
// APIキーはこの端末のブラウザ(localStorage)にだけ保存し、どこにも送らない
// (送信先は api.anthropic.com のみ)。SDKは js/vendor に同梱したものを使う。

const AI = (() => {
  const SETTINGS_KEY = "zh_app_ai_v1";
  const DEFAULT_MODEL = "claude-opus-5";
  const MODELS = [
    { id: "claude-opus-5", label: "Claude Opus 5(標準・高品質)" },
    { id: "claude-sonnet-5", label: "Claude Sonnet 5(速い・安い)" },
    { id: "claude-haiku-4-5", label: "Claude Haiku 4.5(最速・最安)" },
  ];
  const SDK_URL = new URL("vendor/anthropic-sdk.min.mjs", document.currentScript.src).href;

  let sdkPromise = null;

  function loadSettings() {
    try {
      return Object.assign({ apiKey: "", model: DEFAULT_MODEL }, JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"));
    } catch (e) {
      return { apiKey: "", model: DEFAULT_MODEL };
    }
  }

  function saveSettings(patch) {
    const next = Object.assign(loadSettings(), patch);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch (e) {
      // 保存できない環境(プライベートモード等)では今回の起動中のみ有効
    }
    return next;
  }

  function hasKey() {
    return !!loadSettings().apiKey;
  }

  function loadSdk() {
    if (!sdkPromise) {
      sdkPromise = import(SDK_URL).then((mod) => mod.default);
      sdkPromise.catch(() => {
        sdkPromise = null;
      });
    }
    return sdkPromise;
  }

  class AIError extends Error {}

  async function getClient() {
    const { apiKey } = loadSettings();
    if (!apiKey) throw new AIError("APIキーが設定されていません。マイページ → 設定 から入力してください。");
    const Anthropic = await loadSdk();
    return { Anthropic, client: new Anthropic({ apiKey, dangerouslyAllowBrowser: true }) };
  }

  // モデルごとに使えるパラメータが違うので、ここでまとめて組み立てる。
  // - Opus 5: 安全フィルタで断られたときに別モデルで自動で再実行する fallbacks を有効化
  // - Haiku 4.5: effort 非対応
  function baseParams(model, effort) {
    const params = { model };
    if (model === "claude-opus-5") {
      params.betas = ["server-side-fallback-2026-07-01"];
      params.fallbacks = "default";
    }
    if (effort && model !== "claude-haiku-4-5") params.output_config = { effort };
    return params;
  }

  function describeError(Anthropic, err) {
    if (err instanceof AIError) return err;
    if (Anthropic) {
      if (err instanceof Anthropic.AuthenticationError) return new AIError("APIキーが正しくありません。設定を確認してください。");
      if (err instanceof Anthropic.PermissionDeniedError) return new AIError("このAPIキーではこのモデルを利用できません。設定でモデルを変更してください。");
      if (err instanceof Anthropic.RateLimitError) return new AIError("リクエストが集中しています(利用上限)。少し待ってからもう一度お試しください。");
      if (err instanceof Anthropic.BadRequestError) return new AIError(`リクエストエラー: ${err.message}`);
      if (err instanceof Anthropic.APIConnectionError) return new AIError("AIに接続できませんでした。通信状況を確認してください。");
      if (err instanceof Anthropic.APIError) return new AIError(`AIでエラーが発生しました(${err.status || "?"})。時間をおいて再度お試しください。`);
    }
    return new AIError(err && err.message ? err.message : "AIの呼び出しに失敗しました。");
  }

  function checkStop(message) {
    if (message.stop_reason === "refusal") {
      throw new AIError("この内容にはAIが回答できませんでした。言い方を変えてもう一度お試しください。");
    }
    if (message.stop_reason === "max_tokens") {
      throw new AIError("AIの回答が長くなりすぎて途中で切れました。もう一度お試しください。");
    }
  }

  function textOf(message) {
    return message.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");
  }

  // JSONスキーマに沿った回答を受け取る(構造化出力)
  async function json({ system, messages, schema, effort = "low" }) {
    let Anthropic = null;
    try {
      const { model } = loadSettings();
      const sdk = await getClient();
      Anthropic = sdk.Anthropic;
      const params = baseParams(model, effort);
      params.output_config = Object.assign({}, params.output_config, { format: { type: "json_schema", schema } });
      const message = await sdk.client.beta.messages.create(
        Object.assign(params, { max_tokens: 16000, system, messages })
      );
      checkStop(message);
      return JSON.parse(textOf(message));
    } catch (err) {
      throw describeError(Anthropic, err);
    }
  }

  // 文章をストリーミングで受け取り、届いた分ずつ onText に渡す
  async function streamText({ system, messages, effort = "medium", onText }) {
    let Anthropic = null;
    try {
      const { model } = loadSettings();
      const sdk = await getClient();
      Anthropic = sdk.Anthropic;
      const stream = sdk.client.beta.messages.stream(
        Object.assign(baseParams(model, effort), { max_tokens: 64000, system, messages })
      );
      let full = "";
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          full += event.delta.text;
          onText(full);
        }
      }
      const message = await stream.finalMessage();
      checkStop(message);
      return full;
    } catch (err) {
      throw describeError(Anthropic, err);
    }
  }

  // 設定画面の「接続テスト」用
  async function ping() {
    const result = await json({
      system: "Reply with the JSON object requested.",
      messages: [{ role: "user", content: "中国語で「こんにちは」と返してください。" }],
      schema: {
        type: "object",
        properties: { reply: { type: "string" } },
        required: ["reply"],
        additionalProperties: false,
      },
    });
    return result.reply;
  }

  // 撮影した写真を長辺 maxSide px の JPEG(base64)に縮小する(送信量とコストを抑える)
  function imageFileToBase64(file, maxSide = 1280) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        resolve({ dataUrl, base64: dataUrl.split(",")[1], mediaType: "image/jpeg" });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new AIError("画像を読み込めませんでした。"));
      };
      img.src = url;
    });
  }

  return {
    MODELS,
    DEFAULT_MODEL,
    loadSettings,
    saveSettings,
    hasKey,
    json,
    streamText,
    ping,
    imageFileToBase64,
    AIError,
  };
})();
