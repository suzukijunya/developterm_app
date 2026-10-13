// REG のTBS追加(受動的活動・趣味活動・在宅オフィス・超過事業損失/NOL、資産の譲渡損益・同種交換・収用・割賦販売・減価償却・関連者間取引)

CPA.tbs({
  id: "TBS-REG-52", section: "REG", chapter: "REG-03", title: "受動的活動損失の制限と賃貸不動産$25,000特別控除の段階的縮小(Form 8582)",
  scenario: `<p>Dana and Lee Ortiz file a joint 2026 return. Their modified AGI for purposes of the rental real estate special allowance (computed without regard to any passive activity loss) is <b>$128,000</b>. The special allowance is <b>$25,000</b>, reduced by 50% of modified AGI over <b>$100,000</b> (fully phased out at $150,000); these amounts are not indexed. Neither spouse is a real estate professional.</p>
<table><tr><th>Activity</th><th>Participation</th><th>2026 result</th></tr>
<tr><td>Duplex rental (Ortizes own 100%)</td><td>Active participation (approve tenants, set rents); no material participation</td><td>Net loss $(34,000)</td></tr>
<tr><td>LP A — limited partnership interest</td><td>Limited partner only</td><td>Net income $6,000</td></tr>
<tr><td>LP B — limited partnership interest</td><td>Limited partner only</td><td>Net loss $(9,000)</td></tr>
<tr><td>LP C — entire interest sold on Sept. 30, 2026 to an unrelated buyer in a fully taxable transaction</td><td>Limited partner only</td><td>Current-year operating loss $(2,000); suspended prior-year losses $8,000</td></tr></table>
<p class="ja">Ortiz夫妻は2026年に夫婦合算で申告する。賃貸不動産特別控除の判定に用いる修正AGI(受動的活動損失を考慮しない)は$128,000である。特別控除額は$25,000で、修正AGIが$100,000を超える額の50%だけ減額される($150,000で全額消失。いずれもインフレ調整なし)。夫婦とも不動産専門家ではない。活動:デュプレックス賃貸(100%所有、積極的参加あり・重要な参加なし)は純損失$(34,000)、LP A(有限責任パートナー)は純利益$6,000、LP B(同)は純損失$(9,000)、LP C(同)は2026年9月30日に持分全部を非関連者へ完全課税取引で売却し、当期営業損失$(2,000)と過年度の停止損失$8,000がある。</p>`,
  rows: [
    { label: "Reduction of the special allowance due to the MAGI phase-out(修正AGIによる特別控除の減額)", type: "num", answer: 14000 },
    { label: "Rental real estate special allowance available for 2026(2026年の賃貸不動産特別控除額)", type: "num", answer: 11000 },
    { label: "Total passive losses allowed in 2026 from the duplex, LP A and LP B (Form 8582 Part IV)(デュプレックス・LP A・LP Bから認められる受動的損失の合計)", type: "num", answer: 17000 },
    { label: "Suspended passive losses carried forward to 2027(2027年へ繰り越される停止損失)", type: "num", answer: 26000 },
    { label: "LP C losses deductible in 2026 (current + suspended)(LP Cについて2026年に控除できる損失)", type: "num", answer: 10000 },
    { label: "Net decrease in 2026 AGI from all passive activity items listed(上記の受動的活動項目全体によるAGIの純減少額)", type: "num", answer: 21000 },
    { label: "If MAGI had been $152,000, the special allowance would be(修正AGIが$152,000だった場合の特別控除)", type: "select", options: ["$25,000", "$12,500", "$1,000", "$0"], answer: "$0" },
    { label: "Treatment of the suspended losses not allowed in 2026(2026年に認められない停止損失の扱い)", type: "select", options: ["Lost permanently", "Carried back 2 years, then forward 20 years", "Carried forward indefinitely and allowed against future passive income or upon a fully taxable disposition", "Deductible as a miscellaneous itemized deduction"], answer: "Carried forward indefinitely and allowed against future passive income or upon a fully taxable disposition" },
  ],
  explain: `<p>減額:(128,000 − 100,000) × 50% = 14,000。特別控除 = 25,000 − 14,000 = 11,000。</p>
<p>Form 8582の計算:積極的参加の賃貸損失(34,000)とその他の受動的活動(利益6,000、損失9,000 → 純損失3,000)を合算すると純損失37,000。特別控除の対象は「賃貸の純損失34,000」と「全体の純損失37,000」の小さい方34,000だが、上限11,000に制限される。認められる損失合計 = 受動的所得6,000 + 特別控除11,000 = 17,000。</p>
<p>停止損失:損失合計(34,000 + 9,000) − 17,000 = 26,000。無期限に繰り越され、将来の受動的所得または活動全体の完全課税処分時に控除される。</p>
<p>LP C:持分全部を非関連者へ完全課税取引で処分したため、当期損失2,000と過年度停止損失8,000の合計10,000は受動的損失の制限を受けず全額控除できる。</p>
<p>AGIへの純影響:LP Aの所得 +6,000、認められた受動的損失 −17,000、LP Cの損失 −10,000 → 純減少21,000。</p>
<p>修正AGI $152,000の場合:減額 = (152,000 − 100,000) × 50% = 26,000 > 25,000 となり特別控除は$0である。</p>`,
});
