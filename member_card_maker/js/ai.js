// Claude API でメンバー情報からカード文面を作る。
// APIキーはこのブラウザ(localStorage)にだけ保存し、送信先は api.anthropic.com のみ。
// SDK は中国語学習アプリに同梱しているものを共用する。

const CardAI = (() => {
  const SETTINGS_KEY = "member_card_ai_v1";
  const DEFAULT_MODEL = "claude-opus-5";
  const MODELS = [
    { id: "claude-opus-5", label: "Claude Opus 5(標準・高品質)" },
    { id: "claude-sonnet-5", label: "Claude Sonnet 5(速い・安い)" },
    { id: "claude-haiku-4-5", label: "Claude Haiku 4.5(最速・最安)" },
  ];
  const SDK_URL = new URL("../../chinese_learning_app/js/vendor/anthropic-sdk.min.mjs", document.currentScript.src).href;

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
      // 保存できない環境では今回の表示中のみ有効
    }
    return next;
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

  function describeError(Anthropic, err) {
    if (err instanceof AIError) return err;
    if (Anthropic) {
      if (err instanceof Anthropic.AuthenticationError) return new AIError("APIキーが正しくありません。");
      if (err instanceof Anthropic.PermissionDeniedError) return new AIError("このAPIキーではこのモデルを使えません。モデルを変えてください。");
      if (err instanceof Anthropic.RateLimitError) return new AIError("利用上限に達しました。少し待ってから再度お試しください。");
      if (err instanceof Anthropic.BadRequestError) return new AIError(`リクエストエラー: ${err.message}`);
      if (err instanceof Anthropic.APIConnectionError) return new AIError("AIに接続できませんでした。通信状況を確認してください。");
      if (err instanceof Anthropic.APIError) return new AIError(`AIでエラーが発生しました(${err.status || "?"})。`);
    }
    return new AIError(err && err.message ? err.message : "AIの呼び出しに失敗しました。");
  }

  // メンバー情報 → { name, attribute, level, tribe, effect, atk, def, ... }
  async function generateCard(member, extra) {
    const { apiKey, model } = loadSettings();
    if (!apiKey) throw new AIError("APIキーが未設定です。「AI設定」から入力してください。");
    let Anthropic = null;
    try {
      Anthropic = await loadSdk();
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      const req = CardFormat.buildAiRequest(member, extra);
      const params = {
        model,
        max_tokens: 16000,
        system: req.system,
        messages: [{ role: "user", content: req.user }],
        output_config: { format: { type: "json_schema", schema: req.schema } },
      };
      if (model !== "claude-haiku-4-5") params.output_config.effort = "medium";
      if (model === "claude-opus-5") {
        // 安全フィルタで断られた場合はサーバー側で別モデルに自動で切り替える
        params.betas = ["server-side-fallback-2026-07-01"];
        params.fallbacks = "default";
      }
      const message = await client.beta.messages.create(params);
      if (message.stop_reason === "refusal") throw new AIError("この内容ではAIが回答できませんでした。入力を変えてお試しください。");
      if (message.stop_reason === "max_tokens") throw new AIError("AIの回答が途中で切れました。もう一度お試しください。");
      const text = message.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("");
      return JSON.parse(text);
    } catch (err) {
      throw describeError(Anthropic, err);
    }
  }

  return { MODELS, DEFAULT_MODEL, loadSettings, saveSettings, generateCard, AIError };
})();
