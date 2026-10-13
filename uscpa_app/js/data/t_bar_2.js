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

CPA.tbs({
  id: "TBS-BAR-41", section: "BAR", chapter: "BAR-01", title: "後工程の総合原価計算(前工程費・工程終点投入材料・FIFO)",
  scenario: `<p>Moriya Chemicals has two processing departments. Units from Mixing are transferred to the Finishing Department, where additional packaging materials are added at the <b>end</b> of the process and conversion costs are incurred evenly. Finishing uses the FIFO method. Data for October follow.</p>
<table><tr><th>Exhibit 1 — Physical units (Finishing)</th><th>Units</th><th>Conversion % complete</th></tr>
<tr><td>Beginning work in process, October 1</td><td>4,000</td><td>60%</td></tr>
<tr><td>Transferred in from Mixing during October</td><td>36,000</td><td>—</td></tr>
<tr><td>Completed and transferred to finished goods</td><td>34,000</td><td>100%</td></tr>
<tr><td>Ending work in process, October 31</td><td>6,000</td><td>25%</td></tr></table>
<table><tr><th>Exhibit 2 — Costs (Finishing)</th><th>Transferred-in</th><th>Materials</th><th>Conversion</th></tr>
<tr><td>Beginning work in process</td><td>$52,000</td><td>$0</td><td>$18,000</td></tr>
<tr><td>Added during October</td><td>$486,000</td><td>$102,000</td><td>$165,500</td></tr></table>
<p class="ja">Moriya Chemicals社には2つの工程がある。混合工程の製品は仕上工程に振り替えられ、仕上工程では包装材料を工程の<b>終点</b>で投入し、加工費は平均的に発生する。仕上工程は先入先出法(FIFO)を採用する。資料1(数量):月初仕掛品4,000個(加工進捗度60%)、当月前工程受入36,000個、完成品34,000個、月末仕掛品6,000個(加工進捗度25%)。資料2(原価):月初仕掛品は前工程費$52,000、材料費$0、加工費$18,000。当月発生は前工程費$486,000、材料費$102,000、加工費$165,500。</p>`,
  rows: [
    { label: "FIFO equivalent units — transferred-in costs(FIFO換算量:前工程費)", type: "num", answer: 36000 },
    { label: "FIFO equivalent units — materials(FIFO換算量:材料費)", type: "num", answer: 34000 },
    { label: "FIFO equivalent units — conversion costs(FIFO換算量:加工費)", type: "num", answer: 33100 },
    { label: "Cost per equivalent unit — conversion (FIFO)(換算量単位当たり加工費)", type: "num", answer: 5, tol: 0.01 },
    { label: "Total cost of units completed and transferred out(完成品原価合計)", type: "num", answer: 735000 },
    { label: "Cost of ending work in process(月末仕掛品原価)", type: "num", answer: 88500 },
    { label: "Equivalent units for conversion if the weighted-average method were used(平均法の場合の加工費換算量)", type: "num", answer: 35500 },
    { label: "Why is no materials cost assigned to ending work in process?(月末仕掛品に材料費が配分されない理由)", type: "select", options: ["Materials are added at the end of the process, which ending units have not reached", "FIFO never assigns materials cost to ending inventory", "Transferred-in costs already include all materials", "Materials cost is treated as a period cost"], answer: "Materials are added at the end of the process, which ending units have not reached" },
  ],
  explain: `<p>FIFO換算量 =(月初仕掛品の当月完成分)+(当月着手完成分)+(月末仕掛品)。当月着手完成 = 34,000 − 4,000 = 30,000個。</p>
<p>前工程費:月初分は前月に受入済みなので0、30,000 + 6,000 = 36,000。単価 = 486,000 ÷ 36,000 = $13.50。</p>
<p>材料費(終点投入):月初仕掛品4,000は当月に終点を通過するので4,000、着手完成30,000、月末0 → 34,000。単価 = 102,000 ÷ 34,000 = $3.00。</p>
<p>加工費:4,000 × 40% = 1,600 + 30,000 + 6,000 × 25% = 1,500 → 33,100。単価 = 165,500 ÷ 33,100 = $5.00。</p>
<p>完成品原価 = 月初仕掛品原価70,000 + 月初分の追加(材料4,000 × 3 = 12,000、加工1,600 × 5 = 8,000)+ 着手完成30,000 × $21.50 = 645,000 → $735,000。</p>
<p>月末仕掛品 = 前工程費6,000 × 13.50 = 81,000 + 加工費1,500 × 5 = 7,500 = $88,500。検算:総原価823,500 = 735,000 + 88,500。</p>
<p>平均法の加工費換算量 = 完成34,000 + 月末1,500 = 35,500(月初仕掛品の前月作業分1,600だけFIFOより多い)。</p>
<p>月末仕掛品は進捗度25%で終点に達していないため、終点投入の材料はまだ投入されていない。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-42", section: "BAR", chapter: "BAR-01", title: "活動基準原価計算(ABC)と伝統的配賦の製品原価比較",
  scenario: `<p>Tanabe Audio makes two speakers. Total manufacturing overhead of $900,000 is currently applied using a plantwide rate based on direct labor hours. The CFO suspects the Deluxe model is mispriced and has gathered activity data.</p>
<table><tr><th>Exhibit 1 — Product data</th><th>Standard</th><th>Deluxe</th></tr>
<tr><td>Annual production (units)</td><td>10,000</td><td>2,500</td></tr>
<tr><td>Direct materials per unit</td><td>$30</td><td>$80</td></tr>
<tr><td>Direct labor hours per unit ($20 per hour)</td><td>1.5</td><td>2.0</td></tr>
<tr><td>Selling price per unit</td><td>$150</td><td>$300</td></tr></table>
<table><tr><th>Exhibit 2 — Activity cost pools</th><th>Cost</th><th>Driver</th><th>Standard</th><th>Deluxe</th></tr>
<tr><td>Machine setups</td><td>$240,000</td><td>Setups</td><td>40</td><td>80</td></tr>
<tr><td>Machining</td><td>$360,000</td><td>Machine hours</td><td>20,000</td><td>10,000</td></tr>
<tr><td>Quality inspections</td><td>$300,000</td><td>Inspections</td><td>100</td><td>400</td></tr></table>
<p class="ja">Tanabe Audio社は2種類のスピーカーを製造している。製造間接費総額$900,000は現在、直接作業時間を基準とする工場全体配賦率で配賦している。CFOはDeluxeの価格設定が誤っていると考え、活動データを収集した。資料1:年間生産量はStandard 10,000個、Deluxe 2,500個。単位当たり直接材料費$30/$80、直接作業時間1.5時間/2.0時間(賃率$20)、販売価格$150/$300。資料2:段取活動$240,000(段取回数40/80)、機械加工$360,000(機械時間20,000/10,000)、品質検査$300,000(検査回数100/400)。</p>`,
  rows: [
    { label: "Plantwide overhead rate per direct labor hour(工場全体配賦率・DLH当たり)", type: "num", answer: 45 },
    { label: "Unit product cost of Deluxe under the traditional system(伝統的方法によるDeluxeの単位原価)", type: "num", answer: 210 },
    { label: "Activity rate per setup(段取1回当たり活動レート)", type: "num", answer: 2000 },
    { label: "ABC overhead cost per unit of Deluxe(ABCによるDeluxeの単位当たり製造間接費)", type: "num", answer: 208 },
    { label: "Unit product cost of Standard under ABC(ABCによるStandardの単位原価)", type: "num", answer: 98 },
    { label: "Gross margin per unit of Deluxe under ABC (negative if loss)(ABCによるDeluxeの単位当たり売上総利益・損失は負数)", type: "num", answer: -28 },
    { label: "Under the traditional system, the Deluxe model is(伝統的方法ではDeluxeは)", type: "select", options: ["Undercosted, because it consumes a disproportionate share of batch-level activities", "Overcosted, because it uses more direct labor hours per unit", "Correctly costed, because total overhead is the same under both systems", "Undercosted, because machining is a unit-level activity"], answer: "Undercosted, because it consumes a disproportionate share of batch-level activities" },
  ],
  explain: `<p>総DLH = 10,000 × 1.5 + 2,500 × 2.0 = 15,000 + 5,000 = 20,000。配賦率 = 900,000 ÷ 20,000 = $45/DLH。</p>
<p>伝統的方法のDeluxe単位原価 = 材料80 + 労務費(2 × 20 = 40)+ 間接費(2 × 45 = 90)= $210。Standardは30 + 30 + 67.5 = $127.5。</p>
<p>活動レート:段取 240,000 ÷ 120回 = $2,000/回、機械加工 360,000 ÷ 30,000 = $12/機械時間、検査 300,000 ÷ 500 = $600/回。</p>
<p>ABC間接費:Deluxe = 80 × 2,000 + 10,000 × 12 + 400 × 600 = 160,000 + 120,000 + 240,000 = 520,000 → ÷2,500 = $208/個。Standard = 80,000 + 240,000 + 60,000 = 380,000 → ÷10,000 = $38/個(合計900,000で一致)。</p>
<p>ABCのStandard単位原価 = 30 + 30 + 38 = $98。Deluxe = 80 + 40 + 208 = $328 → 売上総利益 = 300 − 328 = −$28。</p>
<p>Deluxeは少量生産なのに段取・検査といったバッチレベル活動を多く消費するため、作業時間基準の配賦では原価が過小計算(内部補助)されていた。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-43", section: "BAR", chapter: "BAR-01", title: "連産品原価の配分方法と追加加工の意思決定",
  scenario: `<p>Oshima Foods processes a raw commodity in a joint process that costs $360,000 per batch and yields three products at the split-off point.</p>
<table><tr><th>Exhibit 1 — Split-off data</th><th>Product A</th><th>Product B</th><th>Product C</th></tr>
<tr><td>Pounds produced</td><td>20,000</td><td>30,000</td><td>10,000</td></tr>
<tr><td>Selling price per pound at split-off</td><td>$10</td><td>$8</td><td>$16</td></tr></table>
<table><tr><th>Exhibit 2 — Further processing options</th><th>Product A → A-Plus</th><th>Product C → C-Plus</th></tr>
<tr><td>Separable (further processing) costs</td><td>$120,000</td><td>$105,000</td></tr>
<tr><td>Selling price per pound after processing</td><td>$18</td><td>$25</td></tr></table>
<p>Product B cannot be processed further. For the net realizable value (NRV) allocation, assume management's <b>current plan</b> processes both A and C further. Pounds are unchanged by further processing.</p>
<p class="ja">Oshima Foods社は1バッチ当たり$360,000の連結工程で原料を加工し、分離点で3製品を産出する。資料1:産出量はA 20,000ポンド、B 30,000ポンド、C 10,000ポンド。分離点での販売価格は1ポンド当たりA $10、B $8、C $16。資料2:Aを追加加工してA-Plusにすると個別費$120,000、販売価格$18。Cを追加加工してC-Plusにすると個別費$105,000、販売価格$25。Bは追加加工できない。正味実現可能価額(NRV)法による配分では、現行計画どおりAとCの両方を追加加工すると仮定する。追加加工でポンド数は変わらない。</p>`,
  rows: [
    { label: "Joint cost allocated to Product B — physical units method(物量基準法によるBへの連結原価配分額)", type: "num", answer: 180000 },
    { label: "Joint cost allocated to Product C — relative sales value at split-off method(分離点販売価値法によるCへの配分額)", type: "num", answer: 96000 },
    { label: "Joint cost allocated to Product A — NRV method(NRV法によるAへの配分額)", type: "num", answer: 138240 },
    { label: "Incremental operating income from processing A further (negative if a loss)(Aを追加加工した場合の増分利益・損失は負数)", type: "num", answer: 40000 },
    { label: "Incremental operating income from processing C further (negative if a loss)(Cを追加加工した場合の増分利益・損失は負数)", type: "num", answer: -15000 },
    { label: "Decision for Product C(製品Cの意思決定)", type: "select", options: ["Sell at split-off", "Process further into C-Plus", "Indifferent", "Discontinue the joint process"], answer: "Sell at split-off" },
    { label: "Role of the $360,000 joint cost in the sell-or-process-further decision(追加加工の意思決定における連結原価$360,000の扱い)", type: "select", options: ["Irrelevant, because it is incurred regardless of the decision at split-off", "Relevant, allocated using the NRV method", "Relevant, allocated using physical units", "Relevant only for the product with the highest sales value"], answer: "Irrelevant, because it is incurred regardless of the decision at split-off" },
  ],
  explain: `<p>物量基準:総量60,000ポンド。B = 360,000 × 30,000/60,000 = $180,000。</p>
<p>分離点販売価値:A 200,000、B 240,000、C 160,000、合計600,000。C = 360,000 × 160/600 = $96,000。</p>
<p>NRV法:A = 20,000 × 18 − 120,000 = 240,000、B = 240,000(分離点売却)、C = 10,000 × 25 − 105,000 = 145,000、合計625,000。A = 360,000 × 240/625 = $138,240(B 138,240、C 83,520)。</p>
<p>Aの増分利益 =(18 − 10)× 20,000 − 120,000 = 160,000 − 120,000 = $40,000 → 追加加工すべき。</p>
<p>Cの増分利益 =(25 − 16)× 10,000 − 105,000 = 90,000 − 105,000 = −$15,000 → 分離点で売却すべき。</p>
<p>連結原価は分離点までに既に発生し、追加加工の可否によって変わらないため、意思決定には無関連である(配分方法を変えても結論は変わらない)。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-44", section: "BAR", chapter: "BAR-01", title: "セールスミックスを用いた税引後目標利益と安全余裕率・営業レバレッジ",
  scenario: `<p>Hayama Tools sells two products in a constant unit sales mix of 3 Basic : 1 Pro.</p>
<table><tr><th>Exhibit 1 — Unit data</th><th>Basic</th><th>Pro</th></tr>
<tr><td>Selling price</td><td>$40</td><td>$100</td></tr>
<tr><td>Variable cost</td><td>$24</td><td>$60</td></tr></table>
<table><tr><th>Exhibit 2 — Other data</th><th>Amount</th></tr>
<tr><td>Annual fixed costs</td><td>$528,000</td></tr>
<tr><td>Income tax rate</td><td>25%</td></tr>
<tr><td>Target net income (after tax)</td><td>$99,000</td></tr>
<tr><td>Budgeted sales next year</td><td>24,000 Basic and 8,000 Pro</td></tr></table>
<p class="ja">Hayama Tools社は2製品を販売数量比 Basic 3:Pro 1 の一定のミックスで販売している。資料1:販売価格はBasic $40、Pro $100、変動費は$24、$60。資料2:年間固定費$528,000、法人税率25%、税引後目標利益$99,000、翌年度の予算販売量はBasic 24,000個、Pro 8,000個。</p>`,
  rows: [
    { label: "Weighted-average contribution margin ratio (decimal)(加重平均貢献利益率・小数)", type: "num", answer: 0.4, tol: 0.001 },
    { label: "Break-even sales in units of Basic(損益分岐点におけるBasicの販売数量)", type: "num", answer: 18000 },
    { label: "Units of Pro required to earn the target net income(税引後目標利益達成に必要なProの販売数量)", type: "num", answer: 7500 },
    { label: "Total sales revenue required to earn the target net income(目標利益達成に必要な売上高合計)", type: "num", answer: 1650000 },
    { label: "Margin of safety percentage at budgeted sales (decimal)(予算売上高での安全余裕率・小数)", type: "num", answer: 0.25, tol: 0.001 },
    { label: "Degree of operating leverage at budgeted sales(予算売上高での営業レバレッジ係数)", type: "num", answer: 4, tol: 0.01 },
    { label: "If the mix shifts toward Pro with total units unchanged, break-even total units will(総数量一定でミックスがProへ移ると損益分岐点の総数量は)", type: "select", options: ["Decrease, because Pro has a higher contribution margin per unit", "Increase, because Pro has a higher selling price", "Remain unchanged, because fixed costs do not change", "Decrease, because Pro has a lower contribution margin ratio"], answer: "Decrease, because Pro has a higher contribution margin per unit" },
  ],
  explain: `<p>単位貢献利益:Basic 16、Pro 40。組合せ単位(Basic3+Pro1)の貢献利益 = 48 + 40 = 88、売上高 = 120 + 100 = 220。加重平均貢献利益率 = 88 ÷ 220 = 0.40。</p>
<p>損益分岐点 = 528,000 ÷ 88 = 6,000組 → Basic 18,000個、Pro 6,000個(売上高1,320,000)。</p>
<p>税引前目標利益 = 99,000 ÷(1 − 0.25)= 132,000。必要組数 =(528,000 + 132,000)÷ 88 = 7,500組 → Pro 7,500個、Basic 22,500個。売上高 = 7,500 × 220 = $1,650,000。</p>
<p>予算売上高 = 8,000組 × 220 = 1,760,000。安全余裕率 =(1,760,000 − 1,320,000)÷ 1,760,000 = 0.25。</p>
<p>営業利益 = 8,000 × 88 − 528,000 = 176,000。営業レバレッジ係数 = 貢献利益704,000 ÷ 176,000 = 4.0。</p>
<p>Proは単位貢献利益が大きい(貢献利益率も40%で同じ)ため、Proの比率が上がると組合せ当たり貢献利益が増え、損益分岐点の総数量は減少する。</p>`,
});
