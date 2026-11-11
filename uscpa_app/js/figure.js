// 問題文の図解。図のデータ(js/data/fig_*.js)を受け取り、HTMLで描く。
// 図は「問題文に書かれた事実」だけを描く(計算結果・正解は描かない)。
//
// 図のデータの形:{ t: "タイトル", b: [ブロック, ...] }
// ブロック(k で種類を指定):
//   timeline  { k, ev: [{ at: "日付", lb: "できごと", v?: "金額など" }], period?: { from, to, lb } }
//   bars      { k, unit?: "$", items: [{ lb, v: 数値, tone?: "in"|"out"|"base" }] }
//   flow      { k, steps: [{ lb, v? }], arrows?: ["矢印のラベル", ...] }
//   rel       { k, nodes: [{ id, lb, sub? }], links: [{ a, b, lb }] }
//   split     { k, lb, unit?, parts: [{ lb, v: 数値 }] }
//   table     { k, head: [...], rows: [[...], ...] }
//   note      { k, tx }

const Figure = (() => {
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const num = (v, unit) => {
    if (typeof v !== "number") return esc(v);
    const s = Math.abs(v).toLocaleString("en-US");
    if (unit === "%") return (v < 0 ? "−" : "") + s + "%";
    return (v < 0 ? "−" : "") + (unit === undefined ? "$" : esc(unit)) + s;
  };

  const blocks = {
    timeline(b) {
      const ev = b.ev || [];
      return `<div class="fg-tl">
        <div class="fg-tl-track">${ev
          .map(
            (e) => `<div class="fg-tl-ev"><span class="fg-tl-dot"></span><b>${esc(e.at)}</b><span>${esc(e.lb)}</span>${e.v ? `<em>${esc(e.v)}</em>` : ""}</div>`
          )
          .join("")}</div>
        ${b.period ? `<div class="fg-tl-period"><span>${esc(b.period.lb || "期間")}</span>${esc(b.period.from)} 〜 ${esc(b.period.to)}</div>` : ""}
      </div>`;
    },
    bars(b) {
      const items = b.items || [];
      const max = Math.max(1, ...items.map((x) => Math.abs(+x.v || 0)));
      return `<div class="fg-bars">${items
        .map(
          (x) => `<div class="fg-bar ${esc(x.tone || "")}"><span class="fg-bar-lb">${esc(x.lb)}</span><span class="fg-bar-track"><span style="width:${Math.max(3, (Math.abs(+x.v || 0) / max) * 100)}%"></span></span><span class="fg-bar-v">${num(x.v, b.unit)}</span></div>`
        )
        .join("")}</div>`;
    },
    flow(b) {
      const steps = b.steps || [];
      const arrows = b.arrows || [];
      return `<div class="fg-flow">${steps
        .map(
          (s, i) =>
            `${i ? `<span class="fg-arrow">${arrows[i - 1] ? `<small>${esc(arrows[i - 1])}</small>` : ""}<i>→</i></span>` : ""}<div class="fg-box"><b>${esc(s.lb)}</b>${s.v ? `<span>${esc(s.v)}</span>` : ""}</div>`
        )
        .join("")}</div>`;
    },
    rel(b) {
      const byId = Object.fromEntries((b.nodes || []).map((n) => [n.id, n]));
      const box = (id) => {
        const n = byId[id] || { lb: id };
        return `<div class="fg-box"><b>${esc(n.lb)}</b>${n.sub ? `<span>${esc(n.sub)}</span>` : ""}</div>`;
      };
      return `<div class="fg-rel">${(b.links || [])
        .map((l) => `<div class="fg-rel-row">${box(l.a)}<span class="fg-arrow"><small>${esc(l.lb)}</small><i>→</i></span>${box(l.b)}</div>`)
        .join("")}</div>`;
    },
    split(b) {
      const parts = b.parts || [];
      const total = parts.reduce((a, p) => a + Math.abs(+p.v || 0), 0) || 1;
      return `<div class="fg-split">${b.lb ? `<div class="fg-split-lb">${esc(b.lb)}</div>` : ""}
        <div class="fg-split-bar">${parts.map((p, i) => `<span class="c${i % 5}" style="flex:${Math.abs(+p.v || 0) / total}"></span>`).join("")}</div>
        <div class="fg-split-legend">${parts.map((p, i) => `<span><i class="c${i % 5}"></i>${esc(p.lb)} <b>${num(p.v, b.unit)}</b></span>`).join("")}</div>
      </div>`;
    },
    table(b) {
      return `<div class="fg-table-wrap"><table class="fg-table"><thead><tr>${(b.head || []).map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${(b.rows || [])
        .map((r) => `<tr>${r.map((c) => `<td>${typeof c === "number" ? c.toLocaleString("en-US") : esc(c)}</td>`).join("")}</tr>`)
        .join("")}</tbody></table></div>`;
    },
    note(b) {
      return `<p class="fg-note">${esc(b.tx)}</p>`;
    },
  };

  function render(spec) {
    if (!spec || !Array.isArray(spec.b)) return "";
    const body = spec.b
      .map((b) => {
        try {
          return blocks[b.k] ? blocks[b.k](b) : "";
        } catch (e) {
          return "";
        }
      })
      .join("");
    if (!body) return "";
    return `<figure class="fig"><figcaption>図解${spec.t ? `:${esc(spec.t)}` : ""}<small>問題文の条件を整理した図(答えは含みません)</small></figcaption>${body}</figure>`;
  }

  return { render };
})();
