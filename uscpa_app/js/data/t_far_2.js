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
