# メンバートレカ 入力フォーマット

`member_card_maker/index.html` をブラウザで開くと使えます(サーバー不要。GitHub Pages ならそのまま公開可)。

## 作り方(おすすめの流れ)

1. **① メンバー情報**に名前・部署・役職・得意なこと・口癖・エピソードを入れる
2. **AIでカード文面を作る**を押す(Claude APIキーが必要)
   - キーがない場合は「チャットAI用プロンプトをコピー」→ ChatGPT / Claude に貼る → 返ってきた JSON を「AIの回答(JSON)を貼り付けて反映」へ
3. **③ イラスト**:本人の写真をそのまま入れてもOK(光エフェクトでカードっぽくなります)
   - アニメ調・油彩調にしたい場合は「画像生成AI用プロンプト」をコピーし、本人写真と一緒に画像生成AIへ渡して、できた絵を入れる
   - 画像生成AIには**文字を描かせない**のがポイント。カード名や効果文はこのツールが描くので文字化けしません
   - 枠つきの完成トレカ画像を入れたときは「トレカ画像からイラスト部分だけ使う」を押すと、イラスト部分だけが切り出され枠が二重になりません
4. プレビューの絵をドラッグで位置調整、ホイールで拡大
5. **PNGで保存**(2048×2880px)

カードはブラウザに自動保存されます。別のPCへ移すときやチームで共有するときは「全カードをJSON保存」→「JSON読み込み」。

## JSON の項目

1枚のカードは次の JSON です(「⑤ その他 → このカードのJSON」で確認・直接編集できます)。
複数枚まとめて読み込むときは `{"formatVersion": 1, "cards": [ ... ]}` か配列にします。

```json
{
  "formatVersion": 1,
  "cardType": "effect",
  "name": "財務統括魔導士スズキ",
  "attribute": "光",
  "customAttribute": { "text": "", "color": "#c6352a", "image": null },
  "level": 6,
  "tribe": "CFO族",
  "abilities": "効果",
  "effect": "このカードがフィールドに存在する限り、相手の「グレー金融」の効果は無効化される。\n①：1ターンに1度、…",
  "atk": "2400",
  "def": "2100",
  "cardCode": "WBHC-024",
  "copyright": "©2024 WB ARGO",
  "frameColor": "",
  "nameColor": "gold",
  "art": { "image": null, "zoom": 1, "x": 0, "y": 0, "effect": "gold", "intensity": 0.7 },
  "member": {
    "realName": "スズキ",
    "department": "管理本部",
    "role": "CFO",
    "skills": "財務・契約チェック",
    "personality": "冷静沈着。電卓が相棒",
    "episode": "怪しい契約は必ず見抜く",
    "tone": "かっこよく"
  }
}
```

| 項目 | 内容 | 値 |
|---|---|---|
| `cardType` | カード種類(枠の色が変わる) | `normal` 通常 / `effect` 効果 / `ritual` 儀式 / `fusion` 融合 / `synchro` シンクロ / `xyz` エクシーズ / `spell` 魔法 / `trap` 罠 |
| `name` | カード名。長いと自動で横に縮む | 文字列 |
| `attribute` | 右上の属性マーク | `光` `闇` `炎` `水` `風` `地` `神` `魔` `罠` `custom` |
| `customAttribute` | `attribute: "custom"` のときの中身。`image` に国旗などの画像(URL か data URL)を入れると画像が優先 | `text` 1〜2字 / `color` / `image` |
| `level` | 星の数(エクシーズはランク表示で左から並ぶ)。魔法・罠では無視 | 0〜12 |
| `tribe` | 種族 → 「【CFO族／効果】」の前半 | 文字列 |
| `abilities` | 種族行の後半。空欄ならカード種類から自動(効果モンスターなら「効果」) | 例 `効果`、`融合／効果` |
| `effect` | 効果テキスト。改行で段落、`①：` で始まる行はぶら下げ字下げ、`---` だけの行は区切り線。長いと文字が自動で縮む | 文字列 |
| `atk` / `def` | 攻撃力・守備力。`?` も可 | 文字列 |
| `cardCode` | イラスト右下のカード番号 | 例 `WBHC-024` |
| `copyright` | 一番下の表記 | 例 `©2024 WB ARGO` |
| `frameColor` | 枠の色を上書き。空欄ならカード種類の色 | `#rrggbb` |
| `nameColor` | カード名の文字色 | `gold` / `white` / `black` |
| `art.image` | イラスト。URL か data URL | 文字列 or `null` |
| `art.zoom` `art.x` `art.y` | 拡大率と位置のずらし(枠の幅に対する割合) | 0.5〜4 / -1〜1 / -1〜1 |
| `art.effect` | イラストに重ねる光 | `none` `gold` `purple` `blue` `red` `green` |
| `art.intensity` | 光の強さ | 0〜1 |
| `member` | AI に文面を考えてもらうための情報(カードには印刷されない) | `tone` は `かっこよく` / `面白く` / `かわいく` / `渋く` |

## ファイル構成

| ファイル | 役割 |
|---|---|
| `js/card_format.js` | 上記フォーマットの定義・正規化、AI向けプロンプト |
| `js/card_renderer.js` | JSON → canvas への描画(枠・星・属性・イラスト・テキスト組版) |
| `js/ai.js` | Claude API 呼び出し(キーはブラウザ内のみに保存) |
| `js/app.js` | 画面操作・保存・書き出し |
| `data/samples.js` | 見本カード3枚 |
