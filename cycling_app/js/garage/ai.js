// AIでパーツを読み取る(任意): パーツの写真から、部位・メーカー・モデル・重さ・仕様を読み取り、
// ネットでメーカーの公表値を確かめる。おすすめパーツの写真も探す。
// 自分の Anthropic の API キーを使う(キーはこの端末の中だけに保存し、同期しない)。

const AI = (() => {
  const KEY = "cycling_ai_key";
  const OPTS = "cycling_ai_opts";
  // 使うモデルと、1回あたりの目安(1ドル150円で計算。写真は長い辺1024pxに縮めて送る)
  const MODELS = {
    haiku: { id: "claude-haiku-5-5", label: "Haiku 5.5(いちばん安い)", cost: "約0.2円", costSearch: "約2〜4円", search: "web_search_20250305", fallback: false },
    sonnet: { id: "claude-sonnet-5-5", label: "Sonnet 5.5(バランス)", cost: "約3円", costSearch: "約8〜12円", search: "web_search_20260209", fallback: true },
    opus: { id: "claude-opus-5-5", label: "Opus 5.5(いちばん賢い)", cost: "約5円", costSearch: "約15〜25円", search: "web_search_20260209", fallback: true },
  };
  const SDK = "../vendor/anthropic-sdk-0.130.0.mjs"; // 公式SDKをブラウザ用に1ファイルにまとめたもの

  let key = "";
  let opts = { model: "haiku", search: false };
  try {
    key = localStorage.getItem(KEY) || "";
    opts = Object.assign(opts, JSON.parse(localStorage.getItem(OPTS)) || {});
  } catch (e) {}
  if (!MODELS[opts.model]) opts.model = "haiku";

  function setOpts(o) {
    Object.assign(opts, o);
    try {
      localStorage.setItem(OPTS, JSON.stringify(opts));
    } catch (e) {}
  }

  let sdkP = null;
  async function client() {
    if (!key) throw new Error("no key");
    if (!sdkP) sdkP = import(SDK);
    const { default: Anthropic } = await sdkP;
    return new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });
  }

  function setKey(k) {
    key = String(k || "").trim();
    try {
      if (key) localStorage.setItem(KEY, key);
      else localStorage.removeItem(KEY);
    } catch (e) {}
  }

  const blobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result).split(",")[1]);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(blob);
    });

  // 写真の読み取りは長い辺1024pxで十分(大きいと時間とお金がかかる)
  async function shrink(blob, max = 1024) {
    const img = await createImageBitmap(blob);
    const s = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * s);
    c.height = Math.round(img.height * s);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return new Promise((r) => c.toBlob(r, "image/jpeg", 0.88));
  }

  // 返答のうち、最後の文章(構造化した JSON)を読む。サーバー側の検索で止まったら続きを頼む
  async function run(params) {
    const c = await client();
    let messages = params.messages;
    for (let turn = 0; turn < 4; turn++) {
      const res = await c.beta.messages.create(Object.assign({}, params, { messages }));
      if (res.stop_reason === "refusal") throw new Error("refusal");
      if (res.stop_reason === "pause_turn") {
        messages = messages.concat([{ role: "assistant", content: res.content }]);
        continue;
      }
      const texts = res.content.filter((b) => b.type === "text");
      const last = texts[texts.length - 1];
      if (!last) throw new Error("empty");
      return JSON.parse(last.text);
    }
    throw new Error("too many turns");
  }

  // search: ネット検索を使うか(使うと正確になるが、1回あたり数円高くなる)
  function common(search, maxUses = 2) {
    const m = MODELS[opts.model];
    const p = { model: m.id, max_tokens: 16000 };
    // 断られたときは、サーバー側でほかのモデルが続きを引き受ける(Haiku には無い)
    if (m.fallback) Object.assign(p, { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" });
    if (search) p.tools = [{ type: m.search, name: "web_search", max_uses: maxUses }];
    return p;
  }

  // ---------- パーツの写真を読み取る ----------
  function specGuide() {
    const lines = [];
    for (const [slot, fields] of Object.entries(Library.SPEC_FIELDS)) {
      const f = fields.map((x) => `${x.k}(${x.label}${x.unit ? "・" + x.unit : ""}${x.options ? "・" + x.options.map((o) => o[0]).join("/") : ""})`);
      lines.push(`- ${slot}: ${f.join(", ")}`);
    }
    return lines.join("\n");
  }

  function identifySchema() {
    const item = {
      type: "object",
      additionalProperties: false,
      required: ["slot", "brand", "model", "year", "weight_g", "weight_source", "price_jpy", "specs", "color", "view", "facing", "bbox", "confidence", "note"],
      properties: {
        slot: { type: "string", enum: Parts.SLOTS.map((s) => s.id) },
        brand: { type: "string" },
        model: { type: "string" },
        year: { type: "string" },
        weight_g: { type: "number" },
        weight_source: { type: "string" },
        price_jpy: { type: "number" },
        specs: {
          type: "array",
          items: { type: "object", additionalProperties: false, required: ["key", "value"], properties: { key: { type: "string" }, value: { type: "string" } } },
        },
        color: { type: "string" },
        view: { type: "string", enum: ["side", "top", "front", "other"] },
        facing: { type: "string", enum: ["right", "left", "unknown"] },
        bbox: { type: "array", items: { type: "number" } },
        confidence: { type: "number" },
        note: { type: "string" },
      },
    };
    return { type: "object", additionalProperties: false, required: ["items"], properties: { items: { type: "array", items: item } } };
  }

  // 戻り値: [{ slot, brand, model, year, weight_g, weight_source, price_jpy, specs: {k: v}, color, view, facing, bbox, confidence, note }]
  async function identify(blob, hint) {
    const small = await shrink(blob);
    const data = await blobToBase64(small);
    const slots = Parts.SLOTS.map((s) => `${s.id}=${s.name}`).join(", ");
    const prompt = `ロードバイクのパーツ(または自転車全体)の写真です。写っているパーツを読み取って、アプリのパーツ登録用のデータにしてください。

- 1つのパーツだけの写真なら items は1つ。自転車全体の写真なら、見分けられる部位をそれぞれ items に入れてください(フレームとフォークは同じモデルなら frame にまとめ、fork は入れない)。
- slot はアプリの部位: ${slots}
- brand / model はロゴ・刻印・形から読み取り、わかる範囲で正確な製品名(例: SHIMANO 105 FC-R7000)。年式がわかれば year。わからなければ空文字。
- weight_g はその部位としての重さ(g)。ホイールは前後ペア、タイヤ・チューブは2本分、ペダルは左右ペア、クランクはクランク単体。${opts.search ? "web_search でメーカーの公式ページなどの公表値を確かめ、weight_source にそのURL(確かめられなければ「推定」)。" : "メーカーの公表値を知っていればその値、weight_source は「公表値(記憶)」か「推定」。"}わからなければ 0。
- price_jpy はおおよその日本での新品価格(円)。わからなければ 0。
- specs はアプリの項目キーで(当てはまるものだけ、数値は単位なしの文字):
${specGuide()}
- color はそのパーツの主な色(#rrggbb)。
- view は写真の向き(side=横から, top=真上から, front=正面から, other)。facing は横からの写真で、パーツの前側(自転車の進む向き)が写真の右か左か。
- bbox はそのパーツが写っている範囲 [左, 上, 右, 下](写真の幅・高さに対する0〜1の割合)。
- confidence は読み取りの確かさ(0〜1)。note に日本語で短い補足(迷った点など)。
${hint ? `- 使う人からのヒント: ${hint}` : ""}`;
    const out = await run(
      Object.assign(common(opts.search), {
        output_config: { effort: opts.model === "haiku" ? "medium" : "low", format: { type: "json_schema", schema: identifySchema() } },
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: "image/jpeg", data } },
              { type: "text", text: prompt },
            ],
          },
        ],
      })
    );
    return (out.items || []).map((it) => {
      const specs = {};
      for (const s of it.specs || []) if (s && s.key) specs[s.key] = s.value;
      const b = Array.isArray(it.bbox) && it.bbox.length === 4 ? it.bbox.map((x) => Math.max(0, Math.min(1, +x || 0))) : null;
      return Object.assign({}, it, { specs, bbox: b && b[2] > b[0] && b[3] > b[1] ? b : null });
    });
  }

  // ---------- おすすめパーツの写真を探す ----------
  const IMG_KEY = "cycling_ai_images";
  let imgCache = {};
  try {
    imgCache = JSON.parse(localStorage.getItem(IMG_KEY)) || {};
  } catch (e) {}

  function cachedImage(id) {
    return imgCache[id] || null;
  }

  async function findImage(id, name) {
    if (imgCache[id]) return imgCache[id];
    const out = await run(
      Object.assign(common(true, 1), {
        output_config: {
          effort: "low",
          format: {
            type: "json_schema",
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["image_url", "page_url"],
              properties: { image_url: { type: "string" }, page_url: { type: "string" } },
            },
          },
        },
        messages: [
          {
            role: "user",
            content: `自転車パーツ「${name}」の製品写真を web_search で探し、画像ファイルそのもののURL(https で始まり、.jpg / .png / .webp などの画像)を image_url に、その画像が載っているページを page_url に入れてください。メーカー公式か大手の販売店の、白い背景の製品写真が望ましいです。見つからなければ空文字。`,
          },
        ],
      })
    );
    const url = /^https:\/\//.test(out.image_url || "") ? out.image_url : "";
    imgCache[id] = { url, page: out.page_url || "", at: Date.now() };
    try {
      localStorage.setItem(IMG_KEY, JSON.stringify(imgCache));
    } catch (e) {}
    return imgCache[id];
  }

  return {
    get ready() {
      return !!key;
    },
    get maskedKey() {
      return key ? key.slice(0, 10) + "…" + key.slice(-4) : "";
    },
    get opts() {
      return opts;
    },
    MODELS,
    setOpts,
    setKey,
    identify,
    findImage,
    cachedImage,
  };
})();
