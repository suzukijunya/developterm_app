// BAR のTBS追加(原価計算・管理会計:個別・総合・ABC・連産品・CVP・直接原価計算・予算・差異・意思決定・業績評価)

CPA.tbs({
  id: "TBS-BAR-40", section: "BAR", chapter: "BAR-01", title: "個別原価計算の製造間接費配賦と配賦差異の按分処理",
  scenario: `<p>Kurose Manufacturing uses a job-order costing system and applies manufacturing overhead on the basis of direct labor hours (DLH). The direct labor wage rate is $25 per hour.</p>
<table><tr><th>Exhibit 1 — Annual budget (prepared at the beginning of the year)</th><th>Amount</th></tr>
<tr><td>Budgeted manufacturing overhead</td><td>$1,200,000</td></tr>
<tr><td>Budgeted direct labor hours</td><td>60,000 DLH</td></tr></table>
<table><tr><th>Exhibit 2 — Actual results for the year</th><th>Amount</th></tr>
<tr><td>Actual direct labor hours worked</td><td>58,000 DLH</td></tr>
<tr><td>Actual manufacturing overhead incurred</td><td>$1,190,000</td></tr>
<tr><td>Cost of goods sold before any overhead adjustment</td><td>$2,450,000</td></tr></table>
<table><tr><th>Exhibit 3 — Location of DLH worked during the year (year-end)</th><th>DLH</th></tr>
<tr><td>Job 301 — still in work in process</td><td>5,800</td></tr>
<tr><td>Job 302 — completed, in finished goods (unsold)</td><td>11,600</td></tr>
<tr><td>Jobs sold during the year</td><td>40,600</td></tr></table>
<p>Job 302 required direct materials of $84,000. The controller wants to compare closing the overhead difference entirely to cost of goods sold with prorating it based on the overhead applied in the year-end balances.</p>
<p class="ja">Kurose社は個別原価計算を採用し、直接作業時間(DLH)を基準に製造間接費を予定配賦している。直接工の賃率は1時間$25である。資料1:年初の予算は製造間接費$1,200,000、直接作業時間60,000DLH。資料2:当期実績は直接作業時間58,000DLH、実際製造間接費$1,190,000、配賦差異調整前の売上原価$2,450,000。資料3:期末時点の作業時間の所在は、仕掛品のJob 301が5,800DLH、完成未販売(製品)のJob 302が11,600DLH、当期販売済みのJobが40,600DLHである。Job 302の直接材料費は$84,000。経理部長は配賦差異を全額売上原価に賦課する方法と、期末残高に含まれる予定配賦額を基準に按分する方法とを比較したいと考えている。</p>`,
  rows: [
    { label: "Predetermined overhead rate per DLH(DLH当たり予定配賦率)", type: "num", answer: 20 },
    { label: "Total manufacturing overhead applied for the year(当期の予定配賦額合計)", type: "num", answer: 1160000 },
    { label: "Amount of over- or underapplied overhead (absolute value)(配賦差異の金額・絶対値)", type: "num", answer: 30000 },
    { label: "Overhead was(製造間接費は)", type: "select", options: ["Underapplied(配賦不足)", "Overapplied(配賦超過)", "Exactly applied(差異なし)"], answer: "Underapplied(配賦不足)" },
    { label: "Total cost of Job 302 before any overhead adjustment(調整前のJob 302の総原価)", type: "num", answer: 606000 },
    { label: "Portion of the difference allocated to cost of goods sold under proration(按分法で売上原価に配分される差異)", type: "num", answer: 21000 },
    { label: "Adjusted cost of goods sold under proration(按分法による調整後売上原価)", type: "num", answer: 2471000 },
    { label: "Entry if the entire difference is closed to cost of goods sold(差異を全額売上原価に賦課する仕訳)", type: "select", options: ["Dr Cost of goods sold / Cr Manufacturing overhead", "Dr Manufacturing overhead / Cr Cost of goods sold", "Dr Work in process / Cr Manufacturing overhead", "Dr Finished goods / Cr Cost of goods sold"], answer: "Dr Cost of goods sold / Cr Manufacturing overhead" },
  ],
  explain: `<p>予定配賦率 = $1,200,000 ÷ 60,000DLH = $20/DLH。実際時間ではなく予算値で算定する点に注意。</p>
<p>予定配賦額 = 58,000DLH × $20 = $1,160,000。実際発生額$1,190,000の方が大きいので、$30,000の配賦不足(借方差異)である。</p>
<p>Job 302の総原価 = 直接材料費84,000 + 直接労務費(11,600 × $25 = 290,000)+ 製造間接費(11,600 × $20 = 232,000)= $606,000。</p>
<p>按分法:期末残高中の予定配賦額は仕掛品116,000(10%)、製品232,000(20%)、売上原価812,000(70%)で、合計1,160,000。売上原価への配分 = 30,000 × 70% = $21,000(仕掛品3,000、製品6,000)。</p>
<p>調整後売上原価 = 2,450,000 + 21,000 = $2,471,000(全額賦課なら2,480,000)。</p>
<p>配賦不足は製造間接費勘定に借方残高が残っている状態なので、全額賦課の場合は「借方 売上原価/貸方 製造間接費」で締め切る。差異が重要でなければ全額売上原価賦課が実務上一般的である。</p>`,
});
