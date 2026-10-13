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

CPA.tbs({
  id: "TBS-BAR-45", section: "BAR", chapter: "BAR-01", title: "全部原価計算と直接原価計算の営業利益差異の調整",
  scenario: `<p>Nakamura Industries makes a single product and uses FIFO. Management prepares variable costing statements internally and absorption costing statements for external reporting.</p>
<table><tr><th>Exhibit 1 — Current year data</th><th>Amount</th></tr>
<tr><td>Beginning finished goods inventory</td><td>4,000 units (fixed overhead of $7 per unit under absorption costing)</td></tr>
<tr><td>Units produced</td><td>50,000</td></tr>
<tr><td>Units sold</td><td>48,000</td></tr>
<tr><td>Selling price per unit</td><td>$60</td></tr>
<tr><td>Variable manufacturing cost per unit (same as prior year)</td><td>$22</td></tr>
<tr><td>Fixed manufacturing overhead (actual = budget)</td><td>$400,000</td></tr>
<tr><td>Variable selling and administrative cost per unit sold</td><td>$4</td></tr>
<tr><td>Fixed selling and administrative costs</td><td>$250,000</td></tr></table>
<p>Fixed manufacturing overhead is assigned to units based on actual production. There are no work-in-process inventories.</p>
<p class="ja">Nakamura Industries社は単一製品を製造し、FIFOを採用している。内部管理用に直接原価計算、外部報告用に全部原価計算の損益計算書を作成する。当期データ:期首製品4,000個(全部原価計算での固定製造間接費は1個当たり$7)、生産量50,000個、販売量48,000個、販売価格$60、変動製造原価$22/個(前期と同じ)、固定製造間接費$400,000(実際=予算)、変動販管費は販売1個当たり$4、固定販管費$250,000。固定製造間接費は実際生産量で製品に配賦する。仕掛品はない。</p>`,
  rows: [
    { label: "Current-year unit product cost under absorption costing(全部原価計算による当期の製品単位原価)", type: "num", answer: 30 },
    { label: "Operating income under variable costing(直接原価計算による営業利益)", type: "num", answer: 982000 },
    { label: "Cost of goods sold under absorption costing(全部原価計算による売上原価)", type: "num", answer: 1436000 },
    { label: "Operating income under absorption costing(全部原価計算による営業利益)", type: "num", answer: 1002000 },
    { label: "Fixed manufacturing overhead deferred in ending inventory(期末製品に繰り延べられる固定製造間接費)", type: "num", answer: 48000 },
    { label: "Ending finished goods inventory under variable costing(直接原価計算による期末製品棚卸高)", type: "num", answer: 132000 },
    { label: "Which method is required for external financial reporting under U.S. GAAP?(米国GAAPで外部報告に求められる方法)", type: "select", options: ["Absorption costing (ASC 330, Inventory)", "Variable costing (ASC 330, Inventory)", "Either method, if applied consistently", "Throughput costing (ASC 606)"], answer: "Absorption costing (ASC 330, Inventory)" },
  ],
  explain: `<p>当期の製品単位原価(全部原価)= 変動22 + 固定400,000 ÷ 50,000 = 8 → $30。</p>
<p>直接原価計算:貢献利益 = 48,000 ×(60 − 22 − 4)= 1,632,000。営業利益 = 1,632,000 − 400,000 − 250,000 = $982,000(固定製造間接費は全額期間費用)。</p>
<p>全部原価計算の売上原価(FIFO)= 期首4,000 ×(22 + 7)= 116,000 + 当期製造分44,000 × 30 = 1,320,000 → $1,436,000。</p>
<p>営業利益 = 売上2,880,000 − 1,436,000 − 販管費(48,000 × 4 + 250,000 = 442,000)= $1,002,000。</p>
<p>期末製品6,000個 × $8 = $48,000の固定製造間接費が繰り延べられる。調整:982,000 + 期末繰延48,000 − 期首から繰り越された28,000(4,000 × 7)= 1,002,000で一致する。</p>
<p>直接原価計算の期末製品 = 6,000 × 22 = $132,000(全部原価では180,000)。</p>
<p>外部報告(GAAP)では固定製造間接費を棚卸資産原価に含める全部原価計算が求められる(ASC 330)。直接原価計算は内部管理目的に限られる。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-46", section: "BAR", chapter: "BAR-01", title: "総合予算(製造・材料購入・現金予算と借入額)",
  scenario: `<p>Fujii Products is preparing its second-quarter master budget. Each unit sells for $50 and requires 3 pounds of material costing $4 per pound.</p>
<table><tr><th>Exhibit 1 — Budgeted unit sales</th><th>March (actual)</th><th>April</th><th>May</th><th>June</th><th>July</th></tr>
<tr><td>Units</td><td>9,000</td><td>10,000</td><td>12,000</td><td>15,000</td><td>14,000</td></tr></table>
<table><tr><th>Exhibit 2 — Policies</th></tr>
<tr><td>Finished goods ending inventory = 20% of next month's unit sales (March 31 balance follows this policy).</td></tr>
<tr><td>Raw materials ending inventory = 25% of next month's production needs (March 31 balance follows this policy).</td></tr>
<tr><td>All sales are on credit: 30% collected in the month of sale, 65% the following month, 5% uncollectible.</td></tr>
<tr><td>Material purchases: 40% paid in the month of purchase, 60% the following month.</td></tr></table>
<table><tr><th>Exhibit 3 — Other May data</th><th>Amount</th></tr>
<tr><td>Cash balance, May 1</td><td>$40,000</td></tr>
<tr><td>Other operating expenses (including $30,000 depreciation), paid as incurred</td><td>$330,000</td></tr>
<tr><td>Equipment purchase paid in cash</td><td>$150,000</td></tr>
<tr><td>Minimum required ending cash balance; borrowing in multiples of $10,000 at the beginning of the month</td><td>$30,000</td></tr></table>
<p class="ja">Fujii Products社は第2四半期の総合予算を作成中である。販売価格は1個$50、1個当たり材料3ポンド(1ポンド$4)を要する。資料1:販売数量は3月(実績)9,000個、4月10,000個、5月12,000個、6月15,000個、7月14,000個。資料2:製品の月末在庫は翌月販売量の20%、材料の月末在庫は翌月生産所要量の25%(3月末残高もこの方針どおり)。売上はすべて掛売りで、当月30%、翌月65%回収、5%は回収不能。材料購入代金は当月40%、翌月60%支払。資料3(5月):月初現金$40,000、その他営業費用$330,000(減価償却費$30,000を含み、発生時に支払)、設備購入$150,000(現金払い)、月末最低現金残高$30,000、借入は月初に$10,000単位。</p>`,
  rows: [
    { label: "Budgeted production in April (units)(4月の製造予算・個数)", type: "num", answer: 10400 },
    { label: "Budgeted production in May (units)(5月の製造予算・個数)", type: "num", answer: 12600 },
    { label: "Budgeted cost of material purchases in April(4月の材料購入予算額)", type: "num", answer: 131400 },
    { label: "Budgeted cash collections in May(5月の現金回収額)", type: "num", answer: 505000 },
    { label: "Budgeted cash payments for materials in May(5月の材料代金支払額)", type: "num", answer: 141960 },
    { label: "Amount to be borrowed at the beginning of May(5月初の借入額)", type: "num", answer: 80000 },
    { label: "Budgeted ending cash balance, May 31(5月末の現金残高)", type: "num", answer: 33040 },
    { label: "Treatment of the $30,000 depreciation in the cash budget(現金予算における減価償却費$30,000の扱い)", type: "select", options: ["Excluded, because it is a noncash expense", "Included as a cash disbursement", "Added to cash receipts", "Included only if straight-line depreciation is used"], answer: "Excluded, because it is a noncash expense" },
  ],
  explain: `<p>製造量 = 当月販売 + 月末在庫 − 月初在庫。4月 = 10,000 + 2,400(5月12,000 × 20%)− 2,000(4月10,000 × 20%)= 10,400個。5月 = 12,000 + 3,000 − 2,400 = 12,600個。6月 = 15,000 + 2,800 − 3,000 = 14,800個。</p>
<p>材料所要量:4月31,200、5月37,800、6月44,400ポンド。4月購入量 = 31,200 + 9,450(37,800 × 25%)− 7,800(31,200 × 25%)= 32,850ポンド × $4 = $131,400。5月購入量 = 37,800 + 11,100 − 9,450 = 39,450ポンド × $4 = $157,800。</p>
<p>5月回収 = 5月売上600,000 × 30% + 4月売上500,000 × 65% = 180,000 + 325,000 = $505,000(回収不能分5%は現金化しない)。</p>
<p>5月材料支払 = 157,800 × 40% + 131,400 × 60% = 63,120 + 78,840 = $141,960。</p>
<p>現金収支:40,000 + 505,000 = 545,000。支出 = 141,960 + 300,000(330,000 − 減価償却30,000)+ 150,000 = 591,960。財務活動前の過不足 = −46,960。最低残高30,000の確保に76,960が必要 → $10,000単位で$80,000を借入。</p>
<p>月末現金 = −46,960 + 80,000 = $33,040。</p>
<p>減価償却費は現金支出を伴わない費用なので現金予算から除外する。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-47", section: "BAR", chapter: "BAR-01", title: "変動予算と原価差異の総合分析(材料・労務・変動/固定製造間接費)",
  scenario: `<p>Ishikawa Parts uses a standard cost system. Overhead is applied on standard direct labor hours (DLH). The static budget was based on 20,000 units (the normal capacity used to set the fixed overhead rate); 22,000 units were actually produced and sold.</p>
<table><tr><th>Exhibit 1 — Standard cost card (per unit)</th><th>Standard quantity</th><th>Standard price</th><th>Cost</th></tr>
<tr><td>Direct materials</td><td>4 lbs</td><td>$3.00/lb</td><td>$12</td></tr>
<tr><td>Direct labor</td><td>0.5 DLH</td><td>$24.00/DLH</td><td>$12</td></tr>
<tr><td>Variable overhead</td><td>0.5 DLH</td><td>$10.00/DLH</td><td>$5</td></tr>
<tr><td>Fixed overhead (budget $220,000 ÷ 10,000 DLH)</td><td>0.5 DLH</td><td>$22.00/DLH</td><td>$11</td></tr></table>
<table><tr><th>Exhibit 2 — Actual results</th><th>Amount</th></tr>
<tr><td>Budgeted / actual selling price per unit</td><td>$80 / $78</td></tr>
<tr><td>Materials purchased</td><td>95,000 lbs at $3.10 per lb</td></tr>
<tr><td>Materials used in production</td><td>90,000 lbs</td></tr>
<tr><td>Direct labor</td><td>10,500 DLH at $25.00 per DLH</td></tr>
<tr><td>Variable overhead incurred</td><td>$110,250</td></tr>
<tr><td>Fixed overhead incurred</td><td>$226,000</td></tr></table>
<p>The materials price variance is recognized at the time of purchase. There are no variable selling costs.</p>
<p class="ja">Ishikawa Parts社は標準原価計算を採用し、製造間接費は標準直接作業時間(DLH)で配賦する。固定予算は20,000個(固定費率算定の基準操業度)で作成されたが、実際の製造・販売量は22,000個だった。資料1(標準原価カード):材料4ポンド×$3.00=$12、労務0.5DLH×$24=$12、変動間接費0.5DLH×$10=$5、固定間接費0.5DLH×$22=$11(予算$220,000÷10,000DLH)。資料2(実績):販売価格は予算$80・実際$78、材料購入95,000ポンド@$3.10、材料消費90,000ポンド、直接労務10,500DLH@$25、変動間接費実際$110,250、固定間接費実際$226,000。材料価格差異は購入時に認識する。変動販売費はない。</p>`,
  rows: [
    { label: "Direct materials price variance(材料価格差異)", type: "select", options: ["$9,500 Unfavorable", "$9,500 Favorable", "$9,000 Unfavorable", "$8,800 Unfavorable"], answer: "$9,500 Unfavorable" },
    { label: "Direct materials quantity (usage) variance — absolute amount(材料数量差異・絶対値)", type: "num", answer: 6000 },
    { label: "Direct labor efficiency variance(労働能率差異)", type: "select", options: ["$12,000 Favorable", "$12,000 Unfavorable", "$12,500 Favorable", "$10,500 Unfavorable"], answer: "$12,000 Favorable" },
    { label: "Variable overhead spending variance — absolute amount(変動製造間接費予算(支出)差異・絶対値)", type: "num", answer: 5250 },
    { label: "Variable overhead efficiency variance — absolute amount(変動製造間接費能率差異・絶対値)", type: "num", answer: 5000 },
    { label: "Fixed overhead spending (budget) variance — absolute amount(固定製造間接費予算差異・絶対値)", type: "num", answer: 6000 },
    { label: "Fixed overhead production-volume variance(固定製造間接費操業度差異)", type: "select", options: ["$22,000 Favorable", "$22,000 Unfavorable", "$16,000 Favorable", "$6,000 Unfavorable"], answer: "$22,000 Favorable" },
    { label: "Sales-volume variance in contribution margin — absolute amount(貢献利益ベースの販売数量差異・絶対値)", type: "num", answer: 102000 },
  ],
  explain: `<p>実際生産22,000個に対する標準:材料88,000ポンド、作業時間11,000DLH。</p>
<p>材料価格差異(購入時)=(3.10 − 3.00)× 購入量95,000 = $9,500 不利。消費量90,000で計算した9,000は購入時認識の場合誤り。</p>
<p>材料数量差異 =(90,000 − 88,000)× 3.00 = $6,000 不利。</p>
<p>労働能率差異 =(10,500 − 11,000)× 24 = $12,000 有利(実際賃率25を使った12,500は誤り)。なお賃率差異は(25 − 24)× 10,500 = 10,500 不利。</p>
<p>変動間接費予算差異 = 110,250 − 10,500 × 10 = $5,250 不利。能率差異 =(10,500 − 11,000)× 10 = $5,000 有利。</p>
<p>固定間接費予算差異 = 226,000 − 220,000 = $6,000 不利。操業度差異 = 予算220,000 − 配賦額(11,000 × 22 = 242,000)= $22,000 有利(基準操業度を上回って生産したため)。</p>
<p>販売数量差異 =(22,000 − 20,000)× 予算単位貢献利益(80 − 12 − 12 − 5 = 51)= $102,000 有利。なお販売価格差異は(78 − 80)× 22,000 = 44,000 不利である。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-48", section: "BAR", chapter: "BAR-01", title: "製品ライン廃止と特別注文の意思決定(関連原価分析)",
  scenario: `<p>Sakai Housewares reports the following segmented income statement for its three product lines. The VP of Sales has proposed dropping Line C, and a hotel chain has requested a special order for Line A products.</p>
<table><tr><th>Exhibit 1 — Segmented income statement</th><th>Line A</th><th>Line B</th><th>Line C</th></tr>
<tr><td>Sales</td><td>$500,000</td><td>$400,000</td><td>$300,000</td></tr>
<tr><td>Variable costs</td><td>300,000</td><td>220,000</td><td>210,000</td></tr>
<tr><td>Traceable fixed costs</td><td>80,000</td><td>70,000</td><td>60,000</td></tr>
<tr><td>Allocated common fixed costs (12% of sales)</td><td>60,000</td><td>48,000</td><td>36,000</td></tr>
<tr><td>Operating income (loss)</td><td>$60,000</td><td>$62,000</td><td>$(6,000)</td></tr></table>
<p><b>Memo — Line C:</b> Line C's traceable fixed costs include $20,000 of depreciation on specialized equipment that has no resale value; the remaining traceable fixed costs would be eliminated. Because customers buy Line B and Line C together, Line B sales would fall by 5% if Line C were dropped. Common fixed costs would not change.</p>
<p><b>Memo — Special order:</b> Line A sells 10,000 units at $50 per unit; capacity is 12,000 units. The hotel wants 3,000 units at $38 per unit (all or nothing). Variable cost per unit is $30, of which $2 is a sales commission not paid on this order. Special tooling of $5,000 is required. Any regular sales displaced would be lost.</p>
<p class="ja">Sakai Housewares社の製品ライン別損益計算書は資料1のとおりである。売上高:A $500,000、B $400,000、C $300,000。変動費:300,000、220,000、210,000。個別固定費:80,000、70,000、60,000。共通固定費配賦額(売上高の12%):60,000、48,000、36,000。営業損益:60,000、62,000、(6,000)。販売担当副社長はラインCの廃止を提案し、ホテルチェーンからはラインAの特別注文の依頼があった。ラインCに関するメモ:個別固定費のうち$20,000は売却価値のない専用設備の減価償却費で、残りは廃止により回避できる。顧客はBとCを併せて購入するため、C廃止でBの売上高は5%減少する。共通固定費は変わらない。特別注文に関するメモ:ラインAは1個$50で10,000個を販売、生産能力は12,000個。ホテルは3,000個を1個$38で一括発注(全量受注が条件)。単位変動費$30のうち$2は販売手数料でこの注文には発生しない。特殊工具$5,000が必要。通常販売を圧迫した分は失われる。</p>`,
  rows: [
    { label: "Segment margin of Line C(ラインCのセグメント・マージン)", type: "num", answer: 30000 },
    { label: "Decrease in total company operating income if Line C is dropped(ラインC廃止による全社営業利益の減少額)", type: "num", answer: 59000 },
    { label: "Recommendation for Line C(ラインCについての提言)", type: "select", options: ["Keep Line C", "Drop Line C", "Indifferent"], answer: "Keep Line C" },
    { label: "Cost that is irrelevant to the decision to drop Line C(ラインC廃止の意思決定に無関連な原価)", type: "select", options: ["Allocated common fixed costs", "Avoidable traceable fixed costs", "Lost contribution margin of Line B", "Variable costs of Line C"], answer: "Allocated common fixed costs" },
    { label: "Contribution margin lost on displaced regular sales of Line A(特別注文により失われるラインAの通常販売の貢献利益)", type: "num", answer: 20000 },
    { label: "Increase in operating income from accepting the special order(特別注文受諾による営業利益の増加額)", type: "num", answer: 5000 },
    { label: "Minimum price per unit for the special order to break even(特別注文の最低受諾価格・1個当たり)", type: "num", answer: 36.33, tol: 0.01 },
  ],
  explain: `<p>ラインCのセグメント・マージン = 貢献利益(300,000 − 210,000 = 90,000)− 個別固定費60,000 = $30,000。共通費配賦後の損失(6,000)は廃止の判断材料にならない。</p>
<p>C廃止の影響:失われる貢献利益90,000 − 回避可能固定費(60,000 − 20,000 = 40,000)= 50,000の減少。さらにBの売上高5%減少で貢献利益(400,000 − 220,000 = 180,000)× 5% = 9,000を失う。合計$59,000の減益 → Cは継続すべき。</p>
<p>共通固定費の配賦額は廃止しても発生額が変わらず、他ラインに再配賦されるだけなので無関連である。</p>
<p>特別注文:遊休能力は12,000 − 10,000 = 2,000個なので1,000個の通常販売を失う。失われる貢献利益 = 1,000 ×(50 − 30)= $20,000。</p>
<p>増分利益 = 収益3,000 × 38 = 114,000 − 変動費3,000 ×(30 − 2)= 84,000 − 工具5,000 − 機会原価20,000 = $5,000 → 受諾すべき。</p>
<p>最低価格 =(84,000 + 5,000 + 20,000)÷ 3,000 = $36.33。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-49", section: "BAR", chapter: "BAR-01", title: "事業部の業績評価(ROI・残余利益・CAPMによるWACCとEVA)と振替価格の範囲",
  scenario: `<p>Ueda Corporation evaluates its Motor Division as an investment center. Headquarters asked you to complete the performance package and to advise on a proposed internal transfer.</p>
<table><tr><th>Exhibit 1 — Motor Division, current year</th><th>Amount</th></tr>
<tr><td>Operating income (before tax)</td><td>$1,800,000</td></tr>
<tr><td>Average operating assets (total assets)</td><td>$12,000,000</td></tr>
<tr><td>Current liabilities</td><td>$2,000,000</td></tr>
<tr><td>Minimum required rate of return for residual income</td><td>10%</td></tr>
<tr><td>Income tax rate</td><td>25%</td></tr></table>
<table><tr><th>Exhibit 2 — Capital market data (Ueda Corporation)</th><th>Amount</th></tr>
<tr><td>Risk-free rate / Expected market return / Equity beta</td><td>4% / 9% / 1.2</td></tr>
<tr><td>Pretax cost of debt</td><td>8%</td></tr>
<tr><td>Market value of debt / Market value of equity</td><td>$4,000,000 / $6,000,000</td></tr></table>
<p><b>Email from the Assembly Division manager:</b> "We need 8,000 motors next year. An outside supplier quotes $112 each. Can Motor supply them?"</p>
<p><b>Motor Division data:</b> capacity 50,000 motors; outside sales are expected to be 45,000 motors at $120 each. Variable cost is $70 per motor, including a $6 selling cost that is avoided on internal transfers.</p>
<p><b>Proposal:</b> Motor's manager is also considering a $2,000,000 investment expected to earn operating income of $260,000 per year.</p>
<p class="ja">Ueda社はMotor事業部を投資センターとして評価している。資料1(Motor事業部・当期):税引前営業利益$1,800,000、平均営業資産(総資産)$12,000,000、流動負債$2,000,000、残余利益の最低要求利益率10%、税率25%。資料2(資本市場):無リスク利子率4%、市場期待収益率9%、株式ベータ1.2、税引前負債コスト8%、負債時価$4,000,000、株式時価$6,000,000。Assembly事業部長からのメール:「来年モーターが8,000個必要だ。外部業者の見積りは1個$112である。Motorから供給できるか。」Motor事業部:生産能力50,000個、外部販売見込45,000個(1個$120)、変動費は1個$70で、うち$6の販売費は社内振替では発生しない。また、Motor事業部長は$2,000,000を投資して年$260,000の営業利益を得る案件を検討中である。</p>`,
  rows: [
    { label: "Cost of equity using CAPM (decimal)(CAPMによる株主資本コスト・小数)", type: "num", answer: 0.1, tol: 0.0005 },
    { label: "Weighted-average cost of capital (decimal)(加重平均資本コスト・小数)", type: "num", answer: 0.084, tol: 0.0005 },
    { label: "Return on investment of Motor Division (decimal)(Motor事業部のROI・小数)", type: "num", answer: 0.15, tol: 0.0005 },
    { label: "Residual income of Motor Division(Motor事業部の残余利益)", type: "num", answer: 600000 },
    { label: "Economic value added of Motor Division(Motor事業部のEVA)", type: "num", answer: 510000 },
    { label: "Minimum average transfer price per motor acceptable to Motor for the 8,000 units(8,000個に対しMotorが受け入れ可能な最低平均振替価格)", type: "num", answer: 82.75, tol: 0.01 },
    { label: "Maximum transfer price per motor Assembly should pay(Assemblyが支払ってよい最高振替価格)", type: "num", answer: 112 },
    { label: "If Motor's manager is evaluated on ROI, the $2,000,000 proposal will likely be(ROIで評価されるMotor事業部長は$2,000,000の案件を)", type: "select", options: ["Rejected, although it would increase residual income", "Accepted, because its ROI exceeds the minimum required return", "Rejected, because it would decrease residual income", "Accepted, because it would increase divisional ROI"], answer: "Rejected, although it would increase residual income" },
  ],
  explain: `<p>CAPM:株主資本コスト = 4% + 1.2 ×(9% − 4%)= 10%。</p>
<p>WACC:負債ウェイト40%、株式60%。税引後負債コスト = 8% ×(1 − 0.25)= 6%。WACC = 0.4 × 6% + 0.6 × 10% = 2.4% + 6.0% = 8.4%。</p>
<p>ROI = 1,800,000 ÷ 12,000,000 = 15%。残余利益 = 1,800,000 − 12,000,000 × 10% = $600,000。</p>
<p>EVA = 税引後営業利益(1,800,000 × 0.75 = 1,350,000)−(総資産12,000,000 − 流動負債2,000,000)× 8.4% = 1,350,000 − 840,000 = $510,000。</p>
<p>最低振替価格 = 増分変動費 + 機会原価。遊休能力5,000個は変動費70 − 6 = $64。残り3,000個は外部販売を失うため64 + 失う貢献利益(120 − 70 = 50)= $114。平均 =(5,000 × 64 + 3,000 × 114)÷ 8,000 = 662,000 ÷ 8,000 = $82.75。</p>
<p>最高振替価格 = Assemblyが外部から購入できる価格$112。82.75〜112の範囲で交渉すれば全社利益が増える。</p>
<p>新規案件のROI = 260,000 ÷ 2,000,000 = 13%で現在の15%を下回るため、ROI評価の事業部長は棄却しがちである。しかし残余利益は260,000 − 200,000 = +60,000で全社的には有利(準最適化の典型例)。</p>`,
});
