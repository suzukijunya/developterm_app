// FAR のTBS追加(棚卸資産・固定資産・無形資産)

CPA.tbs({
  id: "TBS-FAR-47", section: "FAR", chapter: "FAR-03", title: "継続記録法と棚卸計算法の比較(FIFO・LIFO・移動平均・総平均)",
  scenario: `<p>Exhibit 1 shows the January activity of Product Z at Mori Supply Co. All units sold were sold at $20 per unit. Mori is evaluating which inventory system and cost flow assumption to adopt.</p>
<table><tr><th>Date</th><th>Transaction</th><th>Units</th><th>Unit cost</th></tr>
<tr><td>Jan 1</td><td>Beginning inventory</td><td>200</td><td>$10</td></tr>
<tr><td>Jan 8</td><td>Purchase</td><td>300</td><td>$12</td></tr>
<tr><td>Jan 15</td><td>Sale</td><td>400</td><td>—</td></tr>
<tr><td>Jan 22</td><td>Purchase</td><td>500</td><td>$13</td></tr>
<tr><td>Jan 29</td><td>Sale</td><td>350</td><td>—</td></tr></table>
<p>Exhibit 2 (Memo from the controller): "Please compute the January amounts under each alternative so we can compare them before the board meeting. Round per-unit averages to the nearest cent."</p>
<p class="ja">Exhibit 1はMori Supply社の製品Zの1月の取引である。販売単価はすべて$20。1月1日期首棚卸200個@$10、1月8日仕入300個@$12、1月15日販売400個、1月22日仕入500個@$13、1月29日販売350個。Exhibit 2(コントローラーのメモ):各方法による1月の金額を比較したい。平均単価はセント未満を四捨五入すること。</p>`,
  rows: [
    { label: "Ending inventory — perpetual LIFO(継続記録法LIFOの期末棚卸高)", type: "num", answer: 2950 },
    { label: "Cost of goods sold — periodic LIFO(棚卸計算法LIFOの売上原価)", type: "num", answer: 9500 },
    { label: "Gross profit — perpetual LIFO(継続記録法LIFOの売上総利益)", type: "num", answer: 5850 },
    { label: "Ending inventory — moving average (perpetual)(移動平均法の期末棚卸高)", type: "num", answer: 3175 },
    { label: "Cost of goods sold — moving average (perpetual)(移動平均法の売上原価)", type: "num", answer: 8925 },
    { label: "Ending inventory — weighted average (periodic)(総平均法の期末棚卸高)", type: "num", answer: 3025 },
    { label: "Cost flow assumption that always yields the same ending inventory under perpetual and periodic systems(継続記録法と棚卸計算法で常に同じ期末棚卸高となる方法)", type: "select", options: ["FIFO", "LIFO", "Average cost", "None of these"], answer: "FIFO" },
    { label: "In a period of rising prices, the method reporting the highest gross profit for January(物価上昇局面で1月の売上総利益が最も大きい方法)", type: "select", options: ["FIFO", "Periodic LIFO", "Perpetual LIFO", "Moving average", "Weighted average"], answer: "FIFO" },
  ],
  explain: `<p>販売可能数量 = 200 + 300 + 500 = 1,000個、販売可能原価 = 2,000 + 3,600 + 6,500 = 12,100。販売数量 750個、期末数量 250個、売上高 = 750 × 20 = 15,000。</p>
<p>継続記録法LIFO:1/15の販売400個 = 300@12 + 100@10 = 4,600(残り100@10)。1/22に500@13を受入れ、1/29の販売350個 = 350@13 = 4,550。期末 = 100@10 + 150@13 = 1,000 + 1,950 = 2,950。売上原価 = 4,600 + 4,550 = 9,150、売上総利益 = 15,000 − 9,150 = 5,850。</p>
<p>棚卸計算法LIFO:期末250個は最も古い層から = 200@10 + 50@12 = 2,600。売上原価 = 12,100 − 2,600 = 9,500。期中の販売時点を考慮しないため継続記録法LIFOと異なる。</p>
<p>移動平均法:1/8後 500個・5,600 → 単価11.20。販売400個 × 11.20 = 4,480、残100個・1,120。1/22後 600個・7,620 → 単価12.70。販売350個 × 12.70 = 4,445。期末 = 250 × 12.70 = 3,175、売上原価 = 4,480 + 4,445 = 8,925(= 12,100 − 3,175)。</p>
<p>総平均法:12,100 ÷ 1,000 = 12.10、期末 = 250 × 12.10 = 3,025(売上原価9,075)。</p>
<p>FIFOは期末に最も新しい原価が残るため、販売のタイミングに関係なく継続記録法・棚卸計算法で同額(250@13 = 3,250、売上原価8,850)になる。物価上昇局面ではFIFOの売上原価8,850が最小で、売上総利益6,150が最大である。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-48", section: "FAR", chapter: "FAR-03", title: "低価法の評価減スケジュール(LCNRVとLIFOの低価法)",
  scenario: `<p>Hayashi Industries has two divisions. The East Division uses FIFO; the West Division uses LIFO. Both apply the lower-of-cost-or-market (or NRV) rule on an item-by-item basis at December 31, Year 4. The normal profit margin for the West Division is 20% of selling price.</p>
<table><tr><th>Item</th><th>Division</th><th>Cost</th><th>Replacement cost</th><th>Estimated selling price</th><th>Costs to complete and sell</th></tr>
<tr><td>A</td><td>East (FIFO)</td><td>$50,000</td><td>$48,000</td><td>$60,000</td><td>$7,000</td></tr>
<tr><td>B</td><td>East (FIFO)</td><td>$38,000</td><td>$33,000</td><td>$40,000</td><td>$4,500</td></tr>
<tr><td>C</td><td>East (FIFO)</td><td>$22,000</td><td>$21,000</td><td>$25,000</td><td>$6,000</td></tr>
<tr><td>D</td><td>West (LIFO)</td><td>$30,000</td><td>$26,000</td><td>$36,000</td><td>$3,000</td></tr>
<tr><td>E</td><td>West (LIFO)</td><td>$18,000</td><td>$12,000</td><td>$20,000</td><td>$2,000</td></tr>
<tr><td>F</td><td>West (LIFO)</td><td>$24,000</td><td>$27,000</td><td>$26,000</td><td>$3,000</td></tr></table>
<p class="ja">Hayashi Industries社の東部門はFIFO、西部門はLIFOを採用し、第4年度12月31日に個別品目ごとに低価法を適用する。西部門の正常利益率は販売価格の20%である。表は各品目の原価、再調達原価、見積販売価格、完成・販売に要する費用である。</p>`,
  rows: [
    { label: "Carrying amount of Item B at December 31, Year 4(品目Bの期末帳簿価額)", type: "num", answer: 35500 },
    { label: "Total write-down for the East Division(東部門の評価減合計)", type: "num", answer: 5500 },
    { label: "Designated market value of Item E(品目Eの指定時価)", type: "num", answer: 14000 },
    { label: "Designated market value of Item F(品目Fの指定時価)", type: "num", answer: 23000 },
    { label: "Total carrying amount of West Division inventory(西部門の棚卸資産帳簿価額合計)", type: "num", answer: 63000 },
    { label: "Inventory measurement methods excluded from the LCNRV model of ASU 2015-11(ASU 2015-11のLCNRVの対象外となる方法)", type: "select", options: ["FIFO and average cost", "LIFO and the retail inventory method", "Specific identification and FIFO", "All cost methods are subject to LCNRV"], answer: "LIFO and the retail inventory method" },
    { label: "If the NRV of Item C recovers to $24,000 in Year 5, the annual financial statements should(品目CのNRVが第5年度に回復した場合の年次財務諸表上の処理)", type: "select", options: ["Reverse the write-down up to original cost", "Reverse the write-down through OCI", "Not reverse the write-down; the reduced amount is the new cost basis", "Disclose the recovery only if it exceeds 10%"], answer: "Not reverse the write-down; the reduced amount is the new cost basis" },
  ],
  explain: `<p>東部門(FIFO)はLCNRV:NRV = 見積販売価格 − 完成・販売費用。再調達原価は使わない。</p>
<p>A:NRV 60,000 − 7,000 = 53,000 > 原価50,000 → 50,000(評価減なし)。B:NRV 40,000 − 4,500 = 35,500 < 38,000 → 35,500(評価減2,500)。C:NRV 25,000 − 6,000 = 19,000 → 評価減3,000。東部門合計の評価減 = 2,500 + 3,000 = 5,500。</p>
<p>西部門(LIFO)は従来の低価法:時価 = 再調達原価(上限NRV、下限NRV − 正常利益)の中間値。</p>
<p>D:上限 33,000、下限 33,000 − 7,200 = 25,800、再調達原価26,000は範囲内 → 時価26,000 → 26,000(評価減4,000)。</p>
<p>E:上限 18,000、下限 18,000 − 4,000 = 14,000、再調達原価12,000は下限未満 → 時価14,000 → 14,000(評価減4,000)。</p>
<p>F:上限 26,000 − 3,000 = 23,000、下限 23,000 − 5,200 = 17,800、再調達原価27,000は上限超 → 時価23,000 → 23,000(評価減1,000)。</p>
<p>西部門合計 = 26,000 + 14,000 + 23,000 = 63,000(原価72,000、評価減9,000)。</p>
<p>ASU 2015-11のLCNRVはLIFOと売価還元法以外(FIFO・平均法等)に適用され、LIFOと売価還元法は従来の低価法が残る。US GAAPでは年次の評価減は戻入れできず、切下げ後の金額が新たな取得原価となる(IFRSは戻入れ可)。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-49", section: "FAR", chapter: "FAR-03", title: "売価還元法(従来型の低価売価還元法とLIFO売価還元法)",
  scenario: `<p>Ueda Department Store uses the retail inventory method. Selected Year 2 data for its apparel department follow. Prices were stable during Year 2, so no price index adjustment is needed for the LIFO retail computation, and the beginning inventory is the LIFO base layer.</p>
<table><tr><th>Item</th><th>Cost</th><th>Retail</th></tr>
<tr><td>Beginning inventory, Jan 1</td><td>$30,100</td><td>$50,000</td></tr>
<tr><td>Purchases</td><td>$170,400</td><td>$260,000</td></tr>
<tr><td>Freight-in</td><td>$3,900</td><td>—</td></tr>
<tr><td>Purchase returns</td><td>$6,000</td><td>$10,000</td></tr>
<tr><td>Net markups</td><td>—</td><td>$20,000</td></tr>
<tr><td>Net markdowns</td><td>—</td><td>$15,000</td></tr>
<tr><td>Gross sales</td><td>—</td><td>$245,000</td></tr>
<tr><td>Sales returns</td><td>—</td><td>$7,000</td></tr>
<tr><td>Employee discounts</td><td>—</td><td>$3,000</td></tr>
<tr><td>Normal shrinkage</td><td>—</td><td>$2,000</td></tr></table>
<p class="ja">Ueda百貨店は売価還元法を採用している。表は衣料部門の第2年度のデータ(原価・売価)である。第2年度の物価は安定しており、LIFO売価還元法で物価指数調整は不要、期首棚卸はLIFOの基準層である。</p>`,
  rows: [
    { label: "Cost-to-retail ratio — conventional (lower-of-cost-or-market) method(従来型売価還元法の原価率)", type: "num", answer: 0.62, tol: 0.001 },
    { label: "Ending inventory at retail(期末棚卸高(売価))", type: "num", answer: 62000 },
    { label: "Ending inventory at cost — conventional method(従来型による期末棚卸高(原価))", type: "num", answer: 38440 },
    { label: "Cost of goods sold — conventional method(従来型による売上原価)", type: "num", answer: 159960 },
    { label: "Cost-to-retail ratio for Year 2 layer — LIFO retail(LIFO売価還元法の当期層の原価率)", type: "num", answer: 0.66, tol: 0.001 },
    { label: "Ending inventory at cost — LIFO retail method(LIFO売価還元法による期末棚卸高(原価))", type: "num", answer: 38020 },
    { label: "Treatment of employee discounts and normal shrinkage(従業員割引と正常減耗の扱い)", type: "select", options: ["Added to goods available at retail", "Deducted from goods available at retail, like sales", "Excluded from the computation", "Deducted only in the cost column"], answer: "Deducted from goods available at retail, like sales" },
    { label: "Reason the conventional method excludes net markdowns from the ratio(従来型が原価率の計算から値下げを除く理由)", type: "select", options: ["To approximate the average cost of inventory", "To approximate lower of cost or market", "To comply with the LIFO conformity rule", "Because markdowns are recorded only in the cost column"], answer: "To approximate lower of cost or market" },
  ],
  explain: `<p>従来型(低価):原価 = 30,100 + 170,400 + 3,900(運賃は原価のみ)− 6,000 = 198,400。売価(値下げ前)= 50,000 + 260,000 − 10,000 + 20,000 = 320,000。原価率 = 198,400 ÷ 320,000 = 0.62。</p>
<p>値下げ後の販売可能売価 = 320,000 − 15,000 = 305,000。控除:純売上 245,000 − 7,000 = 238,000、従業員割引3,000、正常減耗2,000、合計243,000。期末売価 = 305,000 − 243,000 = 62,000。</p>
<p>従来型の期末原価 = 62,000 × 0.62 = 38,440、売上原価 = 198,400 − 38,440 = 159,960。</p>
<p>LIFO売価還元法:期首を除き、値上げ・値下げとも含めて当期の原価率を計算する。当期原価 = 170,400 + 3,900 − 6,000 = 168,300、当期売価 = 260,000 − 10,000 + 20,000 − 15,000 = 255,000、原価率 = 0.66。</p>
<p>期末売価62,000のうち基準層50,000(原価30,100、率0.602)、増加層12,000 × 0.66 = 7,920。期末原価 = 30,100 + 7,920 = 38,020。</p>
<p>従業員割引と正常減耗は売上と同様に売価から控除する(異常減耗は原価・売価の両方から除く)。値下げを分母から除くと原価率が低くなり、期末棚卸が低価法に近い金額となる。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-50", section: "FAR", chapter: "FAR-03", title: "売上総利益率法による火災損失の見積り",
  scenario: `<p>On May 15, Year 3, a fire destroyed the main warehouse of Sato Wholesale Co. The accounting records were saved. Sato's goods are priced at a markup of 25% on cost. Information for January 1 – May 15, Year 3:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Inventory, January 1 (at cost)</td><td>$84,000</td></tr>
<tr><td>Purchases (includes Exhibit 2 goods in transit)</td><td>$310,000</td></tr>
<tr><td>Purchase returns</td><td>$6,000</td></tr>
<tr><td>Freight-in</td><td>$12,000</td></tr>
<tr><td>Sales</td><td>$480,000</td></tr>
<tr><td>Sales returns and allowances</td><td>$20,000</td></tr></table>
<p>Exhibit 2 (Adjuster's notes): (1) Goods costing $8,000 shipped FOB shipping point by a supplier on May 12 were in transit at the time of the fire and arrived May 20. (2) Sato's goods costing $4,000 were held by a consignee at the time of the fire. (3) Goods in the warehouse costing $3,000 were undamaged. (4) Damaged goods can be sold for a net realizable value of $2,500. (5) The insurer agreed to pay $12,000.</p>
<p class="ja">第3年度5月15日、Sato Wholesale社の主倉庫が火災で焼失した(会計記録は無事)。商品は原価に25%を上乗せして販売している。1月1日〜5月15日のデータは表のとおり。Exhibit 2:(1)5月12日に仕入先がFOB出荷地点条件で出荷した原価$8,000の商品は火災時に輸送中で5月20日に到着した(仕入に計上済)。(2)原価$4,000の自社商品が受託者のもとにあった。(3)倉庫内の原価$3,000の商品は無傷。(4)損傷品は正味実現可能価額$2,500で売却できる。(5)保険会社は$12,000を支払う。</p>`,
  rows: [
    { label: "Gross profit rate on net sales(純売上高に対する売上総利益率)", type: "select", options: ["20%", "25%", "33.3%", "75%", "80%"], answer: "20%" },
    { label: "Estimated cost of goods sold, January 1 – May 15(見積売上原価)", type: "num", answer: 368000 },
    { label: "Estimated total inventory owned at May 15(5月15日に所有する見積棚卸高)", type: "num", answer: 32000 },
    { label: "Estimated inventory in the warehouse at the time of the fire(火災時に倉庫内にあった見積棚卸高)", type: "num", answer: 20000 },
    { label: "Inventory casualty loss before insurance(保険金控除前の棚卸資産の火災損失)", type: "num", answer: 14500 },
    { label: "Net loss after insurance recovery(保険金控除後の純損失)", type: "num", answer: 2500 },
    { label: "Income statement presentation of the net loss(純損失の損益計算書上の表示)", type: "select", options: ["Extraordinary item, net of tax", "Within income from continuing operations (separately disclosed if unusual or infrequent)", "Discontinued operations", "Direct charge to retained earnings"], answer: "Within income from continuing operations (separately disclosed if unusual or infrequent)" },
    { label: "Acceptability of the gross profit method(売上総利益率法の容認範囲)", type: "select", options: ["Acceptable for annual financial statements", "Acceptable for estimates and interim reporting but not for annual financial statements", "Required for casualty losses in annual reports", "Prohibited for all purposes"], answer: "Acceptable for estimates and interim reporting but not for annual financial statements" },
  ],
  explain: `<p>原価に対する値入率25%を売価基準に換算:0.25 ÷ 1.25 = 20%。売上原価率は80%。</p>
<p>純売上高 = 480,000 − 20,000 = 460,000、見積売上原価 = 460,000 × 80% = 368,000。</p>
<p>販売可能商品原価 = 84,000 + 310,000 − 6,000 + 12,000 = 400,000。見積期末棚卸高 = 400,000 − 368,000 = 32,000(輸送中品と積送品を含む所有分)。</p>
<p>倉庫内の棚卸高 = 32,000 − 8,000(FOB出荷地点で輸送中、所有するが倉庫外)− 4,000(受託者保管の積送品)= 20,000。</p>
<p>火災損失(保険前)= 20,000 − 3,000(無傷)− 2,500(損傷品のNRV)= 14,500。純損失 = 14,500 − 12,000 = 2,500。</p>
<p>ASU 2015-01で異常項目の区分は廃止され、継続事業の損益に含める(異常または稀な項目は別掲・注記)。売上総利益率法は見積り・期中報告用であり、年次財務諸表の棚卸評価としては認められない。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-51", section: "FAR", chapter: "FAR-03", title: "棚卸資産の誤謬が2年度に与える影響と前期損益修正",
  scenario: `<p>During the Year 3 audit of Kudo Retail Inc. (periodic inventory system, calendar year), the audit senior documented the following. The Year 2 books have been closed. Ignore income taxes.</p>
<table><tr><th>Item</th><th>Finding</th></tr>
<tr><td>1</td><td>Ending inventory at December 31, Year 1 was overstated by $15,000 because of a double count.</td></tr>
<tr><td>2</td><td>Ending inventory at December 31, Year 2 was understated by $9,000 because one aisle was omitted from the count.</td></tr>
<tr><td>3</td><td>Goods costing $6,000, received December 28, Year 2 and included in the Year 2 count, were not recorded as a purchase until January Year 3 (the January entry was later reversed).</td></tr></table>
<p>Exhibit 2: Reported net income was $120,000 for Year 1 and $135,000 for Year 2. Kudo presents comparative financial statements for Year 2 and Year 3.</p>
<p class="ja">Kudo Retail社(棚卸計算法、暦年決算)の第3年度監査で次が判明した。第2年度の帳簿は締め切られている。税金は無視する。(1)第1年度末の棚卸高は二重計上により$15,000過大。(2)第2年度末の棚卸高は一部の棚の計上漏れにより$9,000過少。(3)第2年度12月28日に受け入れ第2年度末の実地棚卸に含めた原価$6,000の商品が、仕入として計上されていなかった(第3年度1月の計上は後に取消済)。報告純利益は第1年度$120,000、第2年度$135,000。比較財務諸表は第2年度と第3年度を表示する。</p>`,
  rows: [
    { label: "Corrected net income for Year 1(第1年度の修正後純利益)", type: "num", answer: 105000 },
    { label: "Corrected net income for Year 2(第2年度の修正後純利益)", type: "num", answer: 153000 },
    { label: "Amount by which reported Year 2 cost of goods sold was overstated(第2年度の報告売上原価の過大額)", type: "num", answer: 18000 },
    { label: "Misstatement of retained earnings at December 31, Year 1(第1年度末利益剰余金の誤謬)", type: "select", options: ["Overstated by $15,000", "Understated by $15,000", "Overstated by $9,000", "No misstatement"], answer: "Overstated by $15,000" },
    { label: "Net adjustment to retained earnings at December 31, Year 2 (increase)(第2年度末利益剰余金の修正額(増加))", type: "num", answer: 3000 },
    { label: "Accounts payable at December 31, Year 2 was(第2年度末の買掛金)", type: "select", options: ["Overstated by $6,000", "Understated by $6,000", "Understated by $3,000", "Correctly stated"], answer: "Understated by $6,000" },
    { label: "Required accounting for the errors(誤謬の会計処理)", type: "select", options: ["Correct prospectively in Year 3 income", "Restate prior-period financial statements; adjust opening retained earnings (ASC 250)", "Treat as a change in accounting estimate", "Disclose only, because Year 1 error has self-corrected"], answer: "Restate prior-period financial statements; adjust opening retained earnings (ASC 250)" },
  ],
  explain: `<p>第1年度:期末棚卸の過大15,000 → 売上原価過少 → 純利益過大15,000。修正後 = 120,000 − 15,000 = 105,000。第1年度末の利益剰余金も15,000過大。</p>
<p>第2年度:①期首棚卸の過大15,000 → 売上原価過大 → 純利益 +15,000。②期末棚卸の過少9,000 → 売上原価過大 → +9,000。③仕入計上漏れ6,000 → 売上原価過少 → −6,000。修正後 = 135,000 + 15,000 + 9,000 − 6,000 = 153,000。</p>
<p>第2年度の売上原価の過大額 = 15,000 + 9,000 − 6,000 = 18,000(= 153,000 − 135,000)。</p>
<p>第2年度末の利益剰余金:第1年度の誤謬(−15,000過大)は第2年度で自動的に解消し、残るのは棚卸過少9,000と買掛金過少6,000の差額で、純資産が3,000過少。よって利益剰余金を3,000増加させる(仕訳:棚卸資産9,000/買掛金6,000・利益剰余金3,000)。</p>
<p>買掛金は仕入計上漏れの6,000だけ過少。誤謬の訂正はASC 250により過年度の修正再表示(比較表示する第2年度を修正し、表示される最も古い期間の期首利益剰余金を調整)で行い、自動解消していても修正再表示が必要である。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-52", section: "FAR", chapter: "FAR-03", title: "有形固定資産の取得原価スケジュール(一括購入・延払い・自家建設と利息資本化)",
  scenario: `<p>Nagano Manufacturing completed three capital transactions in Year 1. Prepare the acquisition-cost schedule. Round to the nearest dollar.</p>
<p><b>Exhibit 1 — Lump-sum purchase (January 2):</b> Land, a building, and equipment were acquired for $1,800,000 cash plus $20,000 of legal fees for the purchase contract. Appraised fair values: land $600,000; building $1,200,000; equipment $200,000. Nagano also paid $4,000 for title insurance on the land and $6,000 of property taxes on the land that were in arrears from the seller's ownership.</p>
<p><b>Exhibit 2 — Deferred payment (January 2):</b> A machine was acquired for $50,000 down plus a non-interest-bearing note requiring three annual payments of $100,000 beginning December 31, Year 1. The imputed rate is 8% (PV of an ordinary annuity of $1, 3 periods, 8% = 2.5771). Installation cost was $7,290.</p>
<p><b>Exhibit 3 — Self-constructed warehouse:</b> Construction began January 1 and was completed December 31, Year 1. Expenditures: Jan 1 $600,000; Apr 1 $800,000; Sep 1 $900,000; Dec 31 $300,000. A $1,000,000, 9% construction loan was obtained Jan 1; idle loan proceeds earned $5,000 of interest income. Other debt outstanding all year: $2,000,000 at 10% and $3,000,000 at 7%.</p>
<p class="ja">Nagano Manufacturing社の第1年度の3つの取引について取得原価を集計する(1ドル未満四捨五入)。Exhibit 1:1月2日、土地・建物・設備を現金$1,800,000+契約の弁護士費用$20,000で一括取得。公正価値は土地$600,000、建物$1,200,000、設備$200,000。土地の権原保険$4,000と売主の滞納固定資産税$6,000も支払った。Exhibit 2:1月2日、頭金$50,000と第1年度12月31日から毎年$100,000を3回支払う無利息手形で機械を取得。帰属利率8%(3期年金現価係数2.5771)。据付費$7,290。Exhibit 3:倉庫を1月1日着工・12月31日完成。支出は1/1 $600,000、4/1 $800,000、9/1 $900,000、12/31 $300,000。1月1日に建設専用借入$1,000,000(9%)、未使用資金の運用益$5,000。その他の借入は年間を通じて$2,000,000(10%)と$3,000,000(7%)。</p>`,
  rows: [
    { label: "Cost of land(土地の取得原価)", type: "num", answer: 556000 },
    { label: "Cost of building(建物の取得原価)", type: "num", answer: 1092000 },
    { label: "Cost of machine (Exhibit 2)(機械の取得原価)", type: "num", answer: 315000, tol: 1 },
    { label: "Interest expense on the note for Year 1(手形の第1年度支払利息)", type: "num", answer: 20617, tol: 1 },
    { label: "Weighted-average accumulated expenditures(加重平均累積支出額)", type: "num", answer: 1500000 },
    { label: "Interest capitalized in Year 1(第1年度の資本化利息)", type: "num", answer: 131000 },
    { label: "Total cost of the warehouse(倉庫の取得原価合計)", type: "num", answer: 2731000 },
    { label: "Treatment of the $5,000 interest income on idle loan proceeds(未使用借入資金の運用益$5,000の処理)", type: "select", options: ["Offset against capitalized interest", "Recognize as interest income; do not offset", "Deduct from the cost of the warehouse directly", "Defer and amortize over the warehouse life"], answer: "Recognize as interest income; do not offset" },
  ],
  explain: `<p>一括購入の総額 = 1,800,000 + 20,000 = 1,820,000 を公正価値比(30%:60%:10%)で配分:土地546,000、建物1,092,000、設備182,000。土地には権原保険4,000と売主の滞納税6,000(取得のための支出)を加算し、546,000 + 10,000 = 556,000。</p>
<p>機械:手形の現在価値 = 100,000 × 2.5771 = 257,710。取得原価 = 50,000 + 257,710 + 7,290(据付費)= 315,000。第1年度の支払利息 = 257,710 × 8% = 20,617。</p>
<p>加重平均累積支出額 = 600,000 × 12/12 + 800,000 × 9/12 + 900,000 × 4/12 + 300,000 × 0/12 = 600,000 + 600,000 + 300,000 = 1,500,000。</p>
<p>その他借入の加重平均利率 = (200,000 + 210,000) ÷ 5,000,000 = 8.2%。回避可能利息 = 1,000,000 × 9% + 500,000 × 8.2% = 90,000 + 41,000 = 131,000。実際の利息 = 90,000 + 410,000 = 500,000 より小さいので131,000を資本化する。</p>
<p>倉庫の取得原価 = 支出合計2,600,000 + 131,000 = 2,731,000。US GAAPでは借入資金の運用益を資本化利息と相殺しないため、5,000は受取利息として計上する(IFRSでは特定借入の運用益を控除する)。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-53", section: "FAR", chapter: "FAR-03", title: "非貨幣性資産交換の判定グリッド(5件の交換と25%基準)",
  scenario: `<p>Ishikawa Logistics completed five exchanges of nonfinancial assets with unrelated parties during Year 2. Fair values are reliably determinable. Ishikawa's staff accountant prepared the following worksheet for your review.</p>
<table><tr><th>Exchange</th><th>Asset given: carrying amount</th><th>Asset given: fair value</th><th>Cash</th><th>Fair value of asset received</th><th>Commercial substance?</th></tr>
<tr><td>1</td><td>$30,000</td><td>$42,000</td><td>None</td><td>$42,000</td><td>Yes</td></tr>
<tr><td>2</td><td>$50,000</td><td>$60,000</td><td>Received $9,000</td><td>$51,000</td><td>No</td></tr>
<tr><td>3</td><td>$40,000</td><td>$35,000</td><td>Paid $10,000</td><td>$45,000</td><td>No</td></tr>
<tr><td>4</td><td>$26,000</td><td>$40,000</td><td>Paid $8,000</td><td>$48,000</td><td>No</td></tr>
<tr><td>5</td><td>$70,000</td><td>$100,000</td><td>Received $30,000</td><td>$70,000</td><td>No</td></tr></table>
<p class="ja">Ishikawa Logistics社は第2年度に非関連当事者と5件の非金融資産の交換を行った。公正価値は信頼性をもって測定できる。表は各交換の引渡資産の帳簿価額・公正価値、現金の授受、受領資産の公正価値、経済的実質の有無である。</p>`,
  rows: [
    { label: "Exchange 1: gain recognized(交換1の認識利得)", type: "num", answer: 12000 },
    { label: "Exchange 2: gain recognized(交換2の認識利得)", type: "num", answer: 1500 },
    { label: "Exchange 2: carrying amount of asset received(交換2の受領資産の計上額)", type: "num", answer: 42500 },
    { label: "Exchange 3: loss recognized(交換3の認識損失)", type: "num", answer: 5000 },
    { label: "Exchange 4: carrying amount of asset received(交換4の受領資産の計上額)", type: "num", answer: 34000 },
    { label: "Exchange 5: gain recognized(交換5の認識利得)", type: "num", answer: 30000 },
    { label: "Reason for the Exchange 5 treatment(交換5の処理の根拠)", type: "select", options: ["Losses and gains are always recognized in full", "Boot received is 25% or more of fair value, so the transaction is treated as a monetary exchange", "The exchange lacks commercial substance, so no gain is recognized", "Only the boot portion of the gain is recognized"], answer: "Boot received is 25% or more of fair value, so the transaction is treated as a monetary exchange" },
  ],
  explain: `<p>交換1(経済的実質あり):公正価値で測定し、利得 = 42,000 − 30,000 = 12,000を全額認識。受領資産42,000。</p>
<p>交換2(経済的実質なし・現金受取):現金受取9,000 ÷ 公正価値60,000 = 15% < 25%。総利得 = 60,000 − 50,000 = 10,000のうち、受け取った現金の割合だけ認識:10,000 × 9,000/60,000 = 1,500。受領資産 = 50,000 − 9,000 + 1,500 = 42,500(= 51,000 − 繰延利得8,500)。</p>
<p>交換3:損失は経済的実質の有無にかかわらず全額認識。損失 = 40,000 − 35,000 = 5,000。受領資産 = 35,000 + 10,000 = 45,000。</p>
<p>交換4(経済的実質なし・現金支払):利得は認識しない。受領資産 = 帳簿価額26,000 + 現金8,000 = 34,000(繰延利得14,000)。</p>
<p>交換5:現金受取30,000 ÷ 100,000 = 30% ≥ 25% のため、全体を貨幣性取引とみなし、利得 = 100,000 − 70,000 = 30,000を全額認識。受領資産は公正価値70,000。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-54", section: "FAR", chapter: "FAR-03", title: "減価償却スケジュール(期中取得・償却方法と見積りの変更)",
  scenario: `<p>Yamada Corp. (calendar year) computes depreciation to the nearest month. Prepare the depreciation schedule for the assets below.</p>
<table><tr><th>Asset</th><th>Acquired</th><th>Cost</th><th>Salvage</th><th>Life</th><th>Method</th></tr>
<tr><td>Machine</td><td>April 1, Year 1</td><td>$250,000</td><td>$25,000</td><td>5 years</td><td>Sum-of-the-years'-digits</td></tr>
<tr><td>Equipment</td><td>July 1, Year 1</td><td>$160,000</td><td>$10,000</td><td>8 years</td><td>Double-declining balance</td></tr>
<tr><td>Building</td><td>January 1, Year -7</td><td>$900,000</td><td>$60,000</td><td>40 years</td><td>Straight-line</td></tr>
<tr><td>Truck</td><td>January 1, Year 3</td><td>$90,000</td><td>$6,000</td><td>200,000 miles</td><td>Units of production</td></tr></table>
<p>Exhibit 2 (Changes effective January 1, Year 3): (a) Equipment — management switched to straight-line to better reflect the pattern of use; the remaining life is 5 years and the salvage value is revised to $5,000. (b) Building — the total remaining life is revised to 20 years and salvage value to $50,000. (c) The truck was driven 30,000 miles in Year 3.</p>
<p class="ja">Yamada社(暦年決算)は月割で減価償却する。機械:第1年度4月1日取得、原価$250,000、残存$25,000、5年、級数法。設備:第1年度7月1日取得、$160,000、残存$10,000、8年、200%定率法。建物:第-7年度1月1日取得、$900,000、残存$60,000、40年、定額法。トラック:第3年度1月1日取得、$90,000、残存$6,000、200,000マイル、生産高比例法。Exhibit 2(第3年度1月1日から):(a)設備を定額法に変更、残存耐用年数5年、残存価額$5,000。(b)建物の残存耐用年数を20年、残存価額を$50,000に見直し。(c)トラックの第3年度走行距離は30,000マイル。</p>`,
  rows: [
    { label: "Machine depreciation, Year 1(機械の第1年度減価償却費)", type: "num", answer: 56250 },
    { label: "Machine depreciation, Year 2(機械の第2年度減価償却費)", type: "num", answer: 63750 },
    { label: "Equipment depreciation, Year 2(設備の第2年度減価償却費)", type: "num", answer: 35000 },
    { label: "Equipment depreciation, Year 3(設備の第3年度減価償却費)", type: "num", answer: 20000 },
    { label: "Building depreciation, Year 3(建物の第3年度減価償却費)", type: "num", answer: 32000 },
    { label: "Total depreciation expense, Year 3 (all four assets)(第3年度の減価償却費合計)", type: "num", answer: 113350 },
    { label: "Classification of the equipment method change(設備の償却方法変更の分類)", type: "select", options: ["Change in accounting principle — retrospective application", "Change in accounting estimate effected by a change in accounting principle — prospective", "Correction of an error — restatement", "Change in reporting entity"], answer: "Change in accounting estimate effected by a change in accounting principle — prospective" },
  ],
  explain: `<p>機械(級数法):償却基礎 = 225,000、級数合計15。償却1年目(4/1/Y1〜3/31/Y2)= 225,000 × 5/15 = 75,000、2年目 = 60,000、3年目 = 45,000。第1年度 = 75,000 × 9/12 = 56,250。第2年度 = 75,000 × 3/12 + 60,000 × 9/12 = 18,750 + 45,000 = 63,750。第3年度 = 60,000 × 3/12 + 45,000 × 9/12 = 15,000 + 33,750 = 48,750。</p>
<p>設備(200%定率法、率 = 2/8 = 25%):第1年度 = 160,000 × 25% × 6/12 = 20,000。第2年度 = (160,000 − 20,000)× 25% = 35,000。第2年度末帳簿価額 = 105,000。第3年度(定額法へ変更、将来に向けて)=(105,000 − 5,000)÷ 5 = 20,000。</p>
<p>建物:年間償却 = (900,000 − 60,000) ÷ 40 = 21,000。第-7年度〜第2年度の10年分で累計210,000、帳簿価額690,000。第3年度 = (690,000 − 50,000) ÷ 20 = 32,000。</p>
<p>トラック:(90,000 − 6,000) ÷ 200,000 = 0.42/マイル × 30,000 = 12,600。</p>
<p>第3年度合計 = 48,750 + 20,000 + 32,000 + 12,600 = 113,350。償却方法の変更は「会計原則の変更により生じた会計上の見積りの変更」として将来に向けて処理する(ASC 250)。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-55", section: "FAR", chapter: "FAR-03", title: "資産グループの減損損失の配分と売却目的保有資産の再測定",
  scenario: `<p><b>Exhibit 1 — Asset group (held and used), December 31, Year 1:</b> Because of a significant decline in market demand, Okada Foods tested its Kobe plant asset group for recoverability. The group has no goodwill.</p>
<table><tr><th>Asset</th><th>Carrying amount</th></tr>
<tr><td>Building</td><td>$600,000</td></tr>
<tr><td>Machinery</td><td>$300,000</td></tr>
<tr><td>Equipment</td><td>$100,000</td></tr></table>
<p>Sum of undiscounted future cash flows of the group: $850,000. Fair value of the group: $760,000. The fair value of the equipment alone is reliably determinable at $94,000; individual fair values of the building and machinery are not determinable.</p>
<p><b>Exhibit 2 — Held for sale:</b> On December 31, Year 2, a separate warehouse (carrying amount $380,000) met all held-for-sale criteria. Its fair value was $350,000 and costs to sell were $15,000. On December 31, Year 3, the warehouse was still unsold; its fair value was $370,000 and costs to sell were $15,000.</p>
<p class="ja">Exhibit 1:第1年度12月31日、Okada Foods社は需要の大幅な低下により神戸工場の資産グループ(のれんなし)の回収可能性テストを行った。帳簿価額は建物$600,000、機械$300,000、設備$100,000。割引前将来キャッシュフロー合計$850,000、グループの公正価値$760,000。設備単独の公正価値は$94,000と信頼性をもって測定できるが、建物と機械の個別公正価値は測定できない。Exhibit 2:第2年度12月31日、別の倉庫(帳簿価額$380,000)が売却目的保有の要件をすべて満たした。公正価値$350,000、売却費用$15,000。第3年度12月31日も未売却で、公正価値$370,000、売却費用$15,000。</p>`,
  rows: [
    { label: "Total impairment loss on the asset group, Year 1(資産グループの減損損失合計)", type: "num", answer: 240000 },
    { label: "Impairment loss allocated to the equipment(設備への配分額)", type: "num", answer: 6000 },
    { label: "Impairment loss allocated to the building(建物への配分額)", type: "num", answer: 156000 },
    { label: "Carrying amount of the machinery after impairment(減損後の機械の帳簿価額)", type: "num", answer: 222000 },
    { label: "Loss recognized on the warehouse, Year 2(第2年度の倉庫の損失)", type: "num", answer: 45000 },
    { label: "Gain recognized on the warehouse, Year 3(第3年度の倉庫の利得)", type: "num", answer: 20000 },
    { label: "If the plant's fair value recovers in Year 2, the Year 1 impairment loss(工場の公正価値が第2年度に回復した場合の第1年度減損損失)", type: "select", options: ["Is reversed up to the original carrying amount", "Is reversed only to the extent of later depreciation", "Is not reversed; the reduced carrying amount is the new cost basis", "Is reclassified to OCI"], answer: "Is not reversed; the reduced carrying amount is the new cost basis" },
    { label: "Depreciation on the warehouse during Year 3(第3年度の倉庫の減価償却)", type: "select", options: ["Continue straight-line depreciation", "Depreciate down to fair value less costs to sell", "No depreciation while classified as held for sale", "Depreciate only if sale is expected beyond one year"], answer: "No depreciation while classified as held for sale" },
  ],
  explain: `<p>回収可能性テスト:帳簿価額合計1,000,000 > 割引前CF 850,000 → 減損あり。減損損失 = 1,000,000 − 公正価値760,000 = 240,000。</p>
<p>帳簿価額比で按分:建物60% = 144,000、機械30% = 72,000、設備10% = 24,000。ただし個々の資産は公正価値(測定可能な場合)を下回って減額できない。設備は100,000 − 94,000 = 6,000までしか減額できず、超過18,000を建物と機械に帳簿価額比(600:300 = 2:1)で再配分:建物 +12,000、機械 +6,000。</p>
<p>最終配分:建物156,000、機械78,000、設備6,000(合計240,000)。減損後帳簿価額:建物444,000、機械222,000、設備94,000(合計760,000)。</p>
<p>売却目的保有:公正価値 − 売却費用 = 350,000 − 15,000 = 335,000。損失 = 380,000 − 335,000 = 45,000。</p>
<p>第3年度:370,000 − 15,000 = 355,000。回復額20,000は過去に認識した損失45,000の範囲内なので利得として認識し、帳簿価額355,000とする。</p>
<p>保有使用資産の減損損失は戻入れできない。売却目的保有に分類された資産は減価償却しない。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-56", section: "FAR", chapter: "FAR-03", title: "研究開発費・ソフトウェア原価の資本化と無形資産・のれんの減損",
  scenario: `<p>Exhibit 1 lists costs incurred by Fujii Tech in Year 1 (calendar year). Fujii has not early adopted ASU 2025-06 and applies the project-stage model for internal-use software.</p>
<table><tr><th>#</th><th>Cost</th><th>Amount</th></tr>
<tr><td>1</td><td>Salaries of research staff searching for new product applications</td><td>$400,000</td></tr>
<tr><td>2</td><td>Materials consumed in R&amp;D projects</td><td>$60,000</td></tr>
<tr><td>3</td><td>Lab equipment bought January 1 with alternative future uses (5-year life, straight-line, no salvage)</td><td>$500,000</td></tr>
<tr><td>4</td><td>Equipment bought for one R&amp;D project with no alternative future use</td><td>$80,000</td></tr>
<tr><td>5</td><td>Software to be sold: costs before technological feasibility (established July 1)</td><td>$300,000</td></tr>
<tr><td>6</td><td>Software to be sold: coding and testing after technological feasibility, before general release on October 1</td><td>$180,000</td></tr>
<tr><td>7</td><td>Internal-use software: preliminary project stage (evaluating alternatives)</td><td>$50,000</td></tr>
<tr><td>8</td><td>Internal-use software: application development stage (coding, installation, testing)</td><td>$220,000</td></tr>
<tr><td>9</td><td>Internal-use software: training and data conversion</td><td>$40,000</td></tr></table>
<p>Exhibit 2: Revenue from the software product in Year 1 was $120,000; total current and future revenue is estimated at $1,200,000 over an estimated economic life of 3 years.</p>
<p>Exhibit 3 (December 31, Year 1 impairment tests): An indefinite-lived trademark has a carrying amount of $150,000 and fair value of $120,000. After any trademark impairment, Reporting Unit X has a carrying amount of $2,500,000 (including goodwill of $400,000) and a fair value of $2,280,000. Ignore income taxes.</p>
<p class="ja">Exhibit 1はFujii Tech社(暦年決算)の第1年度の支出である(ASU 2025-06は早期適用せず、自社利用ソフトウェアは段階別モデルを適用)。1 研究員の給与$400,000、2 研究開発で消費した材料$60,000、3 1月1日購入の他の将来用途がある研究設備$500,000(5年・定額・残存なし)、4 特定の研究開発プロジェクト専用で他用途のない設備$80,000、5 販売用ソフトウェアの技術的実現可能性確立(7月1日)前の原価$300,000、6 確立後・一般販売開始(10月1日)前のコーディング・テスト$180,000、7 自社利用ソフトの予備的プロジェクト段階$50,000、8 アプリケーション開発段階$220,000、9 研修とデータ変換$40,000。Exhibit 2:当期のソフトウェア収益$120,000、当期と将来の収益見積総額$1,200,000、見積経済的耐用年数3年。Exhibit 3:耐用年数を確定できない商標の帳簿価額$150,000、公正価値$120,000。商標減損後の報告単位Xの帳簿価額$2,500,000(のれん$400,000を含む)、公正価値$2,280,000。税金は無視する。</p>`,
  rows: [
    { label: "Total research and development expense for Year 1(第1年度の研究開発費合計)", type: "num", answer: 940000 },
    { label: "Software development costs capitalized (software to be sold)(販売用ソフトウェアの資本化額)", type: "num", answer: 180000 },
    { label: "Amortization of capitalized software to be sold, Year 1(販売用ソフトウェアの第1年度償却額)", type: "num", answer: 18000 },
    { label: "Internal-use software costs capitalized(自社利用ソフトウェアの資本化額)", type: "num", answer: 220000 },
    { label: "Trademark impairment loss(商標の減損損失)", type: "num", answer: 30000 },
    { label: "Goodwill impairment loss for Reporting Unit X(報告単位Xののれん減損損失)", type: "num", answer: 220000 },
    { label: "Measurement basis of the goodwill impairment under ASU 2017-04(ASU 2017-04におけるのれん減損の測定)", type: "select", options: ["Carrying amount of goodwill minus implied fair value of goodwill", "Excess of reporting unit carrying amount over its fair value, limited to goodwill", "Excess of carrying amount over undiscounted cash flows", "Not measured; goodwill is amortized over 10 years by all entities"], answer: "Excess of reporting unit carrying amount over its fair value, limited to goodwill" },
    { label: "Order of impairment testing(減損テストの順序)", type: "select", options: ["Goodwill first, then the trademark", "Trademark (and other assets) first, then goodwill", "Only goodwill is tested", "Order does not matter"], answer: "Trademark (and other assets) first, then goodwill" },
  ],
  explain: `<p>研究開発費 = 給与400,000 + 材料60,000 + 他用途のある設備の減価償却500,000 ÷ 5 = 100,000 + 他用途のない専用設備80,000(全額費用)+ 技術的実現可能性確立前のソフトウェア原価300,000 = 940,000。他用途のある設備自体は資本化し、償却費のみR&amp;D費用となる。</p>
<p>販売用ソフトウェア:技術的実現可能性の確立後から一般販売開始までの180,000を資本化する。</p>
<p>償却額は「収益比率法」と「定額法」のいずれか大きい方:収益比率 120,000 ÷ 1,200,000 = 10% → 18,000。定額法 180,000 ÷ 3 × 3/12(10〜12月)= 15,000。大きい方の18,000。</p>
<p>自社利用ソフトウェア:アプリケーション開発段階の220,000のみ資本化。予備的段階50,000と研修・データ変換40,000は発生時の費用。</p>
<p>商標(耐用年数を確定できない無形資産):帳簿価額150,000 − 公正価値120,000 = 30,000の減損。のれんより先に、他の資産の減損を判定してから報告単位のテストを行う。</p>
<p>のれん(ASU 2017-04の1ステップ):2,500,000 − 2,280,000 = 220,000。のれん400,000を上限とするため220,000を認識する。暗示的公正価値(旧ステップ2)は廃止された。</p>`,
});
