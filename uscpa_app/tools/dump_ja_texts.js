// 聞き流しで読む日本語の文章を一覧にして出力する(tools/make_audio.py が使う)
// 使い方: node tools/dump_ja_texts.js <アプリのフォルダ> [all]
//   all を付けると「詳しく聞く」の説明文(長い)も含める
const fs = require("fs"), vm = require("vm"), path = require("path");
const D = process.argv[2] || ".";
const all = process.argv[3] === "all";
const html = fs.readFileSync(path.join(D, "index.html"), "utf8");
const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
for (const m of html.matchAll(/src="(js\/data\/[^"?]+)/g)) if (!m[1].includes("audio_ja")) vm.runInContext(fs.readFileSync(path.join(D, m[1]), "utf8"), ctx, { filename: m[1] });
const cards = vm.runInContext("CPA.allCards()", ctx);
const explain = vm.runInContext("typeof CPA_EXPLAIN !== 'undefined' ? CPA_EXPLAIN : {}", ctx);
// 決まり文句は app.js の LP から取り出す(書き換えたら自動で追従する)
const app = fs.readFileSync(path.join(D, "js/app.js"), "utf8");
const lp = app.match(/const LP = \{([\s\S]*?)\};/)[1];
const texts = new Set([...lp.matchAll(/:\s*"([^"]+)"/g)].map((m) => m[1]));
for (const c of cards) {
  if (c.ja) texts.add(c.ja);
  if (c.desc) texts.add(c.desc);
  if (all) {
    const x = explain[c.id] || c.xp;
    if (x && x[0]) texts.add(x[0]);
    if (x && x[1]) texts.add(x[1]);
  }
}
process.stdout.write(JSON.stringify([...texts]));
