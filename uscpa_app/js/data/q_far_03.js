// FAR の追加問題(棚卸資産・有形固定資産の取得)

CPA.extend("FAR-03", {
  mcq: [
    {
      q: "A manufacturer purchased raw materials with an invoice price of $80,000 and took a $1,600 purchase discount. It also paid $3,000 of freight-in, $400 of insurance while the goods were in transit, $2,500 to store finished goods in a warehouse after they were ready for sale, and incurred $1,200 of abnormal spoilage. What amount should be included in inventory cost for these materials?",
      ja: "製造業者が請求額$80,000の原材料を購入し、仕入割引$1,600を受けた。ほかに引取運賃$3,000、輸送中の保険料$400、販売可能となった後の製品の倉庫保管料$2,500を支払い、異常な仕損$1,200が生じた。これらの材料について棚卸資産原価に含めるべき金額はいくらか。",
      c: ["$84,300", "$81,800", "$85,500", "$83,400"],
      a: 1,
      ex: "原価 = 80,000 − 1,600 + 3,000 + 400 = 81,800。販売可能となった後の保管料と異常仕損は期間費用である($84,300・$85,500は誤り)。仕入割引は原価から控除する($83,400は控除漏れ)。",
    },
    {
      q: "A company's normal production capacity is 100,000 units, and its fixed production overhead for the year is $500,000. Because of an unusual equipment breakdown, the company produced only 80,000 units. Under ASC 330, what amount of fixed overhead should be recognized as an expense in the period incurred rather than allocated to inventory?",
      ja: "会社の正常生産能力は100,000個、当期の固定製造間接費は$500,000である。異常な設備故障により、生産量は80,000個にとどまった。ASC 330において、棚卸資産に配賦せず発生期間の費用として認識すべき固定間接費はいくらか。",
      c: ["$0", "$400,000", "$500,000", "$100,000"],
      a: 3,
      ex: "固定間接費は正常生産能力に基づき配賦する:500,000 ÷ 100,000 = $5/個 × 80,000 = 400,000を棚卸資産へ。未配賦の100,000は発生期に費用処理する。実際生産量で割って全額配賦する($0)のは誤り。",
    },
    {
      q: "A company uses the net method to record purchases. It purchased merchandise with a list price of $50,000 on terms 2/10, n/30 and paid the invoice on day 20. At what amount should the merchandise be recorded in inventory?",
      ja: "会社は仕入を純額法で記録している。表示価格$50,000の商品を条件2/10, n/30で購入し、20日目に代金を支払った。棚卸資産にはいくらで記録すべきか。",
      c: ["$49,000", "$50,000", "$51,000", "$48,000"],
      a: 0,
      ex: "純額法では割引後の50,000 × 98% = 49,000で棚卸資産を記録する。割引期間経過後に支払った差額1,000は仕入割引損失(金融費用)とし、棚卸資産原価には含めない。",
    },
    {
      q: "On December 15, a company transferred inventory with a cost of $300,000 to a financial institution for $320,000 cash and agreed to repurchase the same inventory on March 15 for $328,000. How should the company report this arrangement in its December 31 financial statements?",
      ja: "会社は12月15日、原価$300,000の棚卸資産を金融機関に現金$320,000で移転し、3月15日に同じ棚卸資産を$328,000で買い戻すことに合意した。12月31日の財務諸表でこの取引をどのように報告すべきか。",
      c: [
        "As a sale with a $20,000 gross profit and no liability",
        "As a sale, with the repurchase disclosed as a purchase commitment",
        "Keep the inventory on the balance sheet and report a $320,000 liability, accruing the $8,000 difference as interest",
        "Remove the inventory and report a $28,000 deferred gain",
      ],
      a: 2,
      ex: "固定価格での買戻義務がある製品金融取引(product financing arrangement)は実質的に借入であり、在庫は売り手の棚卸資産に残し、受領額$320,000を負債とする。買戻価格との差額$8,000は期間に応じて利息(および保管費用)として計上する。売上として認識するのは誤り。",
    },
    {
      q: "A company's December 31 physical count, taken at cost, totaled $500,000. The count did not include: goods purchased FOB shipping point and in transit, $30,000; goods purchased FOB destination and in transit, $20,000; goods sold FOB destination and in transit to the customer, $15,000; and goods sold FOB shipping point and in transit, $12,000. The count did include $25,000 of goods held on consignment for another company. What is the correct December 31 inventory?",
      ja: "会社の12月31日の実地棚卸高(原価)は$500,000であった。棚卸には次が含まれていない:FOB出荷地点条件で購入し輸送中の商品$30,000、FOB仕向地条件で購入し輸送中の商品$20,000、FOB仕向地条件で販売し顧客へ輸送中の商品$15,000、FOB出荷地点条件で販売し輸送中の商品$12,000。また、他社から受託している委託品$25,000が棚卸に含まれている。正しい12月31日の棚卸資産はいくらか。",
      c: ["$545,000", "$532,000", "$520,000", "$540,000"],
      a: 2,
      ex: "500,000 + 30,000(FOB出荷地点の購入)+ 15,000(FOB仕向地の販売、未着なので自社所有)− 25,000(受託品は委託者の資産)= 520,000。FOB仕向地の購入とFOB出荷地点の販売は所有権が自社にない。受託品を控除しないと$545,000となる。",
    },
    {
      q: "A retailer's physical count at December 31 showed inventory at cost of $250,000. Not included in the count were: goods out on approval with customers (not yet accepted), $12,000; goods shipped to a consignee and unsold, $18,000; goods sold FOB shipping point and in transit, $9,000; and goods ordered FOB destination and in transit, $14,000. What is the correct December 31 inventory?",
      ja: "小売業者の12月31日の実地棚卸高(原価)は$250,000であった。棚卸に含まれていないものは:顧客が未承認の試用販売品$12,000、受託者へ発送済みで未販売の積送品$18,000、FOB出荷地点条件で販売し輸送中の商品$9,000、FOB仕向地条件で発注し輸送中の商品$14,000である。正しい12月31日の棚卸資産はいくらか。",
      c: ["$268,000", "$289,000", "$303,000", "$280,000"],
      a: 3,
      ex: "250,000 + 12,000(承認前の試用販売品)+ 18,000(積送品は委託者の資産)= 280,000。FOB出荷地点で販売済みの商品とFOB仕向地で輸送中の購入品はいずれも自社在庫に含めない($289,000・$303,000は誤り)。",
    },
    {
      q: "A consignor shipped 500 units costing $80 each to a consignee and paid $2,000 of freight to deliver them. By December 31, the consignee had sold 300 of the units. What amount should the consignor report as consigned inventory at December 31?",
      ja: "委託者は1個$80の商品500個を受託者に発送し、運送費$2,000を支払った。12月31日までに受託者は300個を販売した。委託者が12月31日に積送品として報告すべき金額はいくらか。",
      c: ["$16,000", "$16,800", "$25,200", "$0"],
      a: 1,
      ex: "受託者への運送費は積送品の原価に含める:単価 = 80 + 2,000 ÷ 500 = $84。未販売200個 × 84 = 16,800。運送費を除くと$16,000。積送品は受託者の手元にあっても委託者の棚卸資産なので$0は誤り。",
    },
    {
      q: "A company uses a perpetual inventory system. At year-end, the inventory records show a balance of $52,000, while the physical count at cost totals $49,500. The difference is within normal shrinkage levels. What entry should the company record?",
      ja: "会社は継続記録法を採用している。期末に帳簿上の棚卸資産残高は$52,000であったが、原価による実地棚卸高は$49,500であった。差額は正常な減耗の範囲内である。会社が記録すべき仕訳はどれか。",
      c: [
        "Debit cost of goods sold (or inventory shrinkage) $2,500; credit inventory $2,500",
        "No entry, because the perpetual records are the basis for the financial statements",
        "Debit inventory $2,500; credit cost of goods sold $2,500",
        "Debit retained earnings $2,500; credit inventory $2,500",
      ],
      a: 0,
      ex: "継続記録法では帳簿残高と実地棚卸高の差額で減耗を把握し、正常な減耗は売上原価(または棚卸減耗損)として借方計上し、棚卸資産を実地高$49,500に修正する。棚卸計算法では減耗は売上原価に埋没し区別されない。",
    },
    {
      q: "A company had the following inventory activity in January: beginning inventory 100 units at $10; Jan. 5 purchase of 100 units at $12; Jan. 10 sale of 180 units; Jan. 20 purchase of 200 units at $15; Jan. 28 sale of 100 units. Using perpetual LIFO, what is ending inventory on January 31?",
      ja: "会社の1月の棚卸資産の動きは次のとおり:期首在庫100個@$10、1月5日に100個@$12を購入、1月10日に180個を販売、1月20日に200個@$15を購入、1月28日に100個を販売。継続記録法のLIFOによる1月31日の期末棚卸高はいくらか。",
      c: ["$1,240", "$1,800", "$1,700", "$1,500"],
      a: 2,
      ex: "1/10の販売:100個@12と80個@10を払出 → 残20個@10。1/20に200個@15を追加。1/28の販売:100個@15 → 残20個@10 + 100個@15 = 200 + 1,500 = 1,700。棚卸計算法のLIFO(100@10 + 20@12 = 1,240)とは異なる。",
    },
    {
      q: "A company uses the moving-average method in a perpetual system. Beginning inventory was 100 units at $10. It purchased 300 units at $14, then sold 200 units, then purchased 200 units at $16, then sold 100 units. What is ending inventory?",
      ja: "会社は継続記録法で移動平均法を採用している。期首在庫100個@$10。300個@$14を購入し、200個を販売し、200個@$16を購入し、100個を販売した。期末棚卸高はいくらか。",
      c: ["$4,200", "$4,350", "$4,600", "$4,050"],
      a: 1,
      ex: "購入後:400個 5,200(@13.00)。販売200個 → 残200個 2,600。購入後:400個 5,800(@14.50)。販売100個 → 残300個 × 14.50 = 4,350。$4,200は総平均法(8,400 ÷ 600 = 14 × 300)、$4,600はFIFO、$4,050は売上原価合計。",
    },
    {
      q: "A company using a periodic system had beginning inventory of 200 units at $5.00, purchased 300 units at $6.00, and then purchased 500 units at $7.20. It sold 700 units during the period. Using the weighted-average method, what is cost of goods sold?",
      ja: "棚卸計算法を採用する会社の期首在庫は200個@$5.00で、300個@$6.00、続いて500個@$7.20を購入した。期中に700個を販売した。総平均法による売上原価はいくらか。",
      c: ["$4,240", "$4,800", "$4,247", "$4,480"],
      a: 3,
      ex: "加重平均単価 = (1,000 + 1,800 + 3,600)÷ 1,000個 = $6.40。売上原価 = 700 × 6.40 = 4,480。$4,240はFIFO、$4,800はLIFO、$4,247は単価の単純平均(6.0667)を用いた誤り。",
    },
    {
      q: "A company uses LIFO and reported cost of goods sold of $1,300,000 for the year. Its LIFO reserve was $60,000 at the beginning of the year and $85,000 at the end of the year. What would cost of goods sold have been under FIFO?",
      ja: "LIFOを採用する会社の当期の売上原価は$1,300,000であった。LIFO準備金は期首$60,000、期末$85,000であった。FIFOであれば売上原価はいくらになっていたか。",
      c: ["$1,275,000", "$1,325,000", "$1,215,000", "$1,385,000"],
      a: 0,
      ex: "FIFO売上原価 = LIFO売上原価 − LIFO準備金の増加額 = 1,300,000 − (85,000 − 60,000)= 1,275,000。準備金の増加は物価上昇によりLIFOの原価が高いことを示す。期末残高85,000を差し引く($1,215,000)のは誤り。",
    },
    {
      q: "A company that uses LIFO reports inventory of $420,000 and a LIFO reserve of $85,000 at year-end. Its income tax rate is 21%. If the company had always used FIFO, by how much would its year-end retained earnings be higher?",
      ja: "LIFOを採用する会社の期末の棚卸資産は$420,000、LIFO準備金は$85,000である。法人税率は21%。会社が当初からFIFOを採用していた場合、期末の利益剰余金はいくら多くなるか。",
      c: ["$85,000", "$67,150", "$25,000", "$19,750"],
      a: 1,
      ex: "LIFO準備金は累積の税引前利益差額であるため、利益剰余金の差 = 85,000 × (1 − 21%)= 67,150。税効果を無視すると$85,000。当期の増減額のみを用いる($25,000・$19,750)のは誤り。",
    },
    {
      q: "A company using periodic LIFO began the year with a base layer of 2,000 units costing $20 each. During the year, it purchased 10,000 units at $35 each and sold 10,800 units. Compared with replenishing inventory to the beginning level at current cost, how did the LIFO liquidation affect pretax income?",
      ja: "棚卸計算法のLIFOを採用する会社は、期首に1個$20の基準層2,000個を保有していた。当期に1個$35で10,000個を購入し、10,800個を販売した。期首水準まで現在原価で在庫を補充した場合と比べ、LIFO清算は税引前利益にどう影響したか。",
      c: ["Increase of $28,000", "Decrease of $12,000", "No effect", "Increase of $12,000"],
      a: 3,
      ex: "販売量が購入量を800個上回ったため、旧層800個@$20が売上原価に払い出された。現在原価$35との差 800 × (35 − 20)= 12,000だけ売上原価が小さく、利益が増加する。$28,000は800 × 35で誤り。",
    },
    {
      q: "Under the federal LIFO conformity rule, a company that elects LIFO for income tax purposes:",
      ja: "連邦税法のLIFO適合規則のもとで、税務上LIFOを選択した会社は:",
      c: [
        "May use any cost flow assumption in its financial statements",
        "Must use LIFO for tax purposes but FIFO for financial reporting",
        "Must also use LIFO to determine income in its primary financial statements issued to owners and creditors",
        "Is prohibited from disclosing FIFO or current-cost information in the notes",
      ],
      a: 2,
      ex: "税務上LIFOを採用する場合、株主・債権者向けの主たる財務諸表でもLIFOを用いなければならない(LIFO conformity rule)。注記や補足情報でFIFO等による情報(LIFO準備金など)を開示することは認められる。",
    },
    {
      q: "A company using FIFO has 1,000 units of an item with a cost of $90 per unit. The estimated selling price is $95, estimated costs to complete are $6, and estimated costs to sell are $7. Replacement cost is $78 and the normal profit margin is $10 per unit. What inventory write-down should be recognized?",
      ja: "FIFOを採用する会社は単位原価$90の品目を1,000個保有している。見積販売価格は$95、完成までの見積原価は$6、見積販売費は$7。再調達原価は$78、正常利益は1個当たり$10である。認識すべき評価減はいくらか。",
      c: ["$12,000", "$8,000", "$18,000", "$0"],
      a: 1,
      ex: "FIFO・平均法は低価法としてLCNRVを適用:NRV = 95 − 6 − 7 = $82。評価減 = (90 − 82)× 1,000 = 8,000。再調達原価($78、$12,000)や正常利益控除後の下限($72、$18,000)はLIFO・売価還元法のLCMでのみ使用する。",
    },
    {
      q: "A company using LIFO applies the lower of cost or market rule to an item with a cost of $50, a selling price of $60, costs to sell of $12, a normal profit margin of $14, and a replacement cost of $30. At what per-unit amount should the item be reported?",
      ja: "LIFOを採用する会社が、原価$50、販売価格$60、販売費$12、正常利益$14、再調達原価$30の品目に低価法(LCM)を適用する。1個当たりいくらで報告すべきか。",
      c: ["$34", "$30", "$48", "$50"],
      a: 0,
      ex: "上限(NRV)= 60 − 12 = 48、下限 = 48 − 14 = 34。再調達原価$30は下限を下回るため時価は下限の$34。原価$50と比べ低い$34で報告する。再調達原価$30をそのまま用いるのは誤り。",
    },
    {
      q: "A company using LIFO holds 2,000 units of an item with a cost of $50 per unit. Replacement cost is $52, selling price is $60, costs to sell are $12, and the normal profit margin is $14. Applying the lower of cost or market rule, what write-down should be recognized?",
      ja: "LIFOを採用する会社は単位原価$50の品目を2,000個保有している。再調達原価$52、販売価格$60、販売費$12、正常利益$14である。低価法(LCM)を適用した場合、認識すべき評価減はいくらか。",
      c: ["$0", "$32,000", "$4,000", "$28,000"],
      a: 2,
      ex: "上限(NRV)= 60 − 12 = 48、下限 = 34。再調達原価$52は上限を超えるため時価は$48。評価減 = (50 − 48)× 2,000 = 4,000。再調達原価が原価を上回るから評価減不要($0)とするのは誤り。下限$34を用いると$32,000となる。",
    },
    {
      q: "In the first quarter, a calendar-year company wrote inventory down from $200,000 to its net realizable value of $170,000 because of a market decline it expected to be other than temporary. In the third quarter of the same fiscal year, the market price recovered. Under U.S. GAAP, how should the recovery be treated?",
      ja: "暦年決算の会社は第1四半期に、一時的でないと見込まれる市場価格の下落により棚卸資産を$200,000から正味実現可能価額$170,000に評価減した。同一会計年度の第3四半期に市場価格が回復した。米国GAAPにおいて回復はどのように処理すべきか。",
      c: [
        "No recovery may ever be recognized, even within the same fiscal year",
        "The recovery is recognized as a prior-period adjustment",
        "The recovery is recognized in other comprehensive income",
        "A gain may be recognized in the third quarter, limited to the $30,000 previously written down",
      ],
      a: 3,
      ex: "期中報告では、同一会計年度内に回復した場合、過去の四半期で認識した評価減の範囲内で回復益を認識できる。年度末に評価減した後の翌年度以降の回復は認められない(評価減後の金額が新たな原価となる)。",
    },
    {
      q: "Under U.S. GAAP, inventory measured using which of the following methods is subsequently measured at the lower of cost or market (with a ceiling and floor) rather than the lower of cost and net realizable value?",
      ja: "米国GAAPにおいて、次のうちどの方法で測定される棚卸資産が、正味実現可能価額との低価法(LCNRV)ではなく、上限・下限のある低価法(LCM)で事後測定されるか。",
      c: [
        "FIFO and average cost",
        "LIFO and the retail inventory method",
        "Specific identification and FIFO",
        "All inventory cost methods",
      ],
      a: 1,
      ex: "ASU 2015-11により、LIFOと売価還元法以外(FIFO・平均法など)はLCNRVで測定する。LIFOと売価還元法は従来どおり上限(NRV)と下限(NRV − 正常利益)を用いるLCMを適用する。",
    },
    {
      q: "A fire destroyed a company's inventory on June 30. Records show beginning inventory of $120,000, purchases of $480,000, purchase returns of $10,000, freight-in of $8,000, sales of $700,000, and sales returns of $20,000. The company's gross profit is a markup of 25% on cost. Undamaged inventory with a cost of $9,000 was salvaged. What is the estimated inventory loss from the fire?",
      ja: "6月30日の火災で会社の棚卸資産が焼失した。記録によると期首在庫$120,000、仕入$480,000、仕入戻し$10,000、引取運賃$8,000、売上$700,000、売上戻り$20,000である。売上総利益は原価に対する25%の値入である。原価$9,000の無傷の在庫が回収された。火災による棚卸資産の損失見積額はいくらか。",
      c: ["$54,000", "$79,000", "$45,000", "$29,000"],
      a: 2,
      ex: "原価値入25%は売価に対する粗利率20%(25 ÷ 125)。純売上680,000 × 80% = 売上原価544,000。販売可能額 = 120,000 + 480,000 − 10,000 + 8,000 = 598,000 → 期末推定54,000 − 回収9,000 = 45,000。25%を売価基準で使うと$79,000となり誤り。",
    },
    {
      q: "A company estimates its interim inventory using the gross profit method. Beginning inventory was $60,000, net purchases were $230,000, and net sales were $350,000. The company's normal markup is 40% on cost. What is the estimated ending inventory?",
      ja: "会社は売上総利益率法で期中の棚卸資産を見積もっている。期首在庫$60,000、純仕入$230,000、純売上$350,000である。通常の値入率は原価の40%である。期末棚卸高の見積額はいくらか。",
      c: ["$40,000", "$80,000", "$60,000", "$150,000"],
      a: 0,
      ex: "売上原価 = 350,000 ÷ 1.40 = 250,000。期末 = 60,000 + 230,000 − 250,000 = 40,000。40%を売価に対する粗利率と誤ると売上原価210,000、期末80,000となる。",
    },
    {
      q: "A retailer uses the conventional (lower of cost or market) retail inventory method. Data: beginning inventory at cost $36,000 and retail $60,000; purchases at cost $204,000 and retail $330,000; net markups $10,000; net markdowns $20,000; net sales $290,000; normal shrinkage at retail $5,000. What is estimated ending inventory at cost?",
      ja: "小売業者は通常の(低価法)売価還元法を採用している。期首在庫 原価$36,000・売価$60,000、仕入 原価$204,000・売価$330,000、純値上額$10,000、純値下額$20,000、純売上$290,000、売価での正常な減耗$5,000。期末棚卸高(原価)の見積額はいくらか。",
      c: ["$53,684", "$54,000", "$51,000", "$85,000"],
      a: 2,
      ex: "原価率 = 240,000 ÷(60,000 + 330,000 + 10,000)= 60%(値下額は分母に含めない)。期末売価 = 400,000 − 20,000 − 290,000 − 5,000 = 85,000 × 60% = 51,000。値下額を分母に含めると原価率63.16%で$53,684(平均原価法)。",
    },
    {
      q: "A retailer uses the average cost retail inventory method. Data: beginning inventory at cost $27,000 and retail $45,000; purchases at cost $153,000 and retail $255,000; net markups $15,000; net markdowns $15,000; net sales $250,000. What is estimated ending inventory at cost?",
      ja: "小売業者は平均原価による売価還元法を採用している。期首在庫 原価$27,000・売価$45,000、仕入 原価$153,000・売価$255,000、純値上額$15,000、純値下額$15,000、純売上$250,000。期末棚卸高(原価)の見積額はいくらか。",
      c: ["$28,571", "$30,000", "$32,000", "$50,000"],
      a: 1,
      ex: "平均原価法では値上・値下の両方を分母に含める:原価率 = 180,000 ÷ 300,000 = 60%。期末売価 = 300,000 − 250,000 = 50,000 × 60% = 30,000。値下を除く通常法(低価法)の原価率57.14%では$28,571となる。",
    },
    {
      q: "A retailer uses the LIFO retail method and assumes stable prices. Beginning inventory was $30,000 at cost and $50,000 at retail. Current-year purchases were $147,000 at cost and $200,000 at retail; net markups were $20,000 and net markdowns were $10,000. Net sales were $190,000. What is ending inventory at cost?",
      ja: "小売業者は物価安定を前提にLIFO売価還元法を採用している。期首在庫は原価$30,000・売価$50,000。当期仕入は原価$147,000・売価$200,000、純値上額$20,000、純値下額$10,000。純売上は$190,000。期末棚卸高(原価)はいくらか。",
      c: ["$49,000", "$42,000", "$47,654", "$44,000"],
      a: 3,
      ex: "当期の原価率(期首を除き値上・値下を含む)= 147,000 ÷ 210,000 = 70%。期末売価 = 50,000 + 210,000 − 190,000 = 70,000。基準層50,000 × 60% = 30,000 + 新層20,000 × 70% = 14,000 → 44,000。全体に70%を適用すると$49,000。",
    },
    {
      q: "A retailer uses the conventional retail method. Data: beginning inventory at cost $20,000 and retail $40,000; purchases at cost $110,000 and retail $180,000; freight-in $6,000; purchase returns at cost $4,000 and retail $6,000; net markups $6,000; net markdowns $10,000; net sales $150,000; normal shrinkage at retail $4,000. A flood (an abnormal loss) destroyed goods with a cost of $12,000 and a retail value of $20,000. What is estimated ending inventory at cost?",
      ja: "小売業者は通常の売価還元法を採用している。期首在庫 原価$20,000・売価$40,000、仕入 原価$110,000・売価$180,000、引取運賃$6,000、仕入戻し 原価$4,000・売価$6,000、純値上額$6,000、純値下額$10,000、純売上$150,000、売価での正常な減耗$4,000。洪水(異常な損失)により原価$12,000・売価$20,000の商品が損失した。期末棚卸高(原価)の見積額はいくらか。",
      c: ["$21,600", "$33,600", "$24,000", "$22,737"],
      a: 0,
      ex: "原価 = 20,000 + 110,000 + 6,000 − 4,000 − 12,000 = 120,000、売価 = 40,000 + 180,000 − 6,000 + 6,000 − 20,000 = 200,000 → 原価率60%(異常損失は原価・売価の両方から控除)。期末売価 = 200,000 − 10,000 − 150,000 − 4,000 = 36,000 × 60% = 21,600。異常損失を控除しないと$33,600。",
    },
    {
      q: "A retailer's goods available for sale at retail (after net markups) were $300,000. Net markdowns were $15,000, gross sales were $220,000, sales returns were $10,000, and employee discounts were $5,000. The applicable cost-to-retail ratio is 65%. What is estimated ending inventory at cost?",
      ja: "小売業者の販売可能商品の売価(純値上後)は$300,000である。純値下額$15,000、総売上$220,000、売上戻り$10,000、従業員割引$5,000。適用する原価率は65%である。期末棚卸高(原価)の見積額はいくらか。",
      c: ["$48,750", "$45,500", "$39,000", "$55,250"],
      a: 1,
      ex: "期末売価 = 300,000 − 15,000 − 220,000 + 10,000(売上戻りは売上を減らす)− 5,000(従業員割引は売上と同様に控除)= 70,000 × 65% = 45,500。従業員割引を控除しないと$48,750。",
    },
    {
      q: "Why does the conventional retail inventory method exclude net markdowns (but include net markups) when computing the cost-to-retail ratio?",
      ja: "通常の売価還元法では、原価率の計算にあたり純値上額は含めるが純値下額を含めないのはなぜか。",
      c: [
        "To approximate the FIFO cost flow assumption",
        "Because markdowns are recorded as selling expenses",
        "To produce a higher ratio and therefore a higher inventory value",
        "To produce a lower ratio that approximates the lower of cost or market",
      ],
      a: 3,
      ex: "値下を分母から除くと分母が大きくなり原価率が低くなるため、期末棚卸高は低く算定され、低価法(LCM)に近似する。平均原価法は値下も含めるので原価率が高くなる。",
    },
    {
      q: "A company adopted dollar-value LIFO on January 1, Year 2, when inventory was $200,000 (index 1.00). At December 31, Year 2, inventory at current cost was $264,000 (index 1.10). At December 31, Year 3, inventory at current cost was $276,000 (index 1.20). What is the dollar-value LIFO inventory at December 31, Year 3?",
      ja: "会社は第2年度1月1日、棚卸資産$200,000(指数1.00)の時点でドル価値LIFOを採用した。第2年度12月31日の当期原価による棚卸資産は$264,000(指数1.10)、第3年度12月31日は$276,000(指数1.20)であった。第3年度12月31日のドル価値LIFOによる棚卸資産はいくらか。",
      c: ["$233,000", "$276,000", "$236,000", "$244,000"],
      a: 0,
      ex: "第2年度:基準年価格240,000 → 層40,000 × 1.10 = 44,000、合計244,000。第3年度:276,000 ÷ 1.20 = 230,000 → 10,000減少し第2年度層から取り崩す。200,000 + 30,000 × 1.10 = 233,000。残存層に当期指数1.20を使うと$236,000。",
    },
    {
      q: "A company uses dollar-value LIFO. Beginning inventory was $280,000 at base-year cost and $290,000 at dollar-value LIFO cost. Ending inventory is $330,000 at current-year cost and $300,000 at base-year cost. What is ending inventory under dollar-value LIFO?",
      ja: "会社はドル価値LIFOを採用している。期首棚卸資産は基準年原価で$280,000、ドル価値LIFO原価で$290,000であった。期末棚卸資産は当期原価で$330,000、基準年原価で$300,000である。ドル価値LIFOによる期末棚卸高はいくらか。",
      c: ["$330,000", "$312,000", "$310,000", "$300,000"],
      a: 1,
      ex: "当期指数 = 330,000 ÷ 300,000 = 1.10。基準年原価の増加20,000 × 1.10 = 22,000の新層を追加:290,000 + 22,000 = 312,000。増加分を指数換算しない($310,000)のは誤り。",
    },
    {
      q: "In November, a company entered into a noncancelable commitment to purchase 12,000 units of a raw material at $8 per unit next March. At December 31, the market price has fallen to $6.50 per unit, and the decline is not expected to reverse. How should the company report the commitment at December 31?",
      ja: "会社は11月、翌年3月に原材料12,000個を1個$8で購入する解約不能の契約を締結した。12月31日に市場価格は1個$6.50に下落しており、回復は見込まれない。12月31日にこの契約をどのように報告すべきか。",
      c: [
        "Disclose the commitment in the notes only; no loss is recognized until the goods are received",
        "Recognize a $96,000 liability and inventory for the full commitment",
        "Recognize an $18,000 loss in income and a corresponding liability",
        "Recognize an $18,000 loss in other comprehensive income",
      ],
      a: 2,
      ex: "解約不能な購入契約で市場価格が契約価格を下回り損失が見込まれる場合、期末に損失を認識する:12,000 × (8 − 6.50)= 18,000を損益に計上し、同額の負債(購入契約損失引当金)を計上する。注記のみでは不十分。",
    },
    {
      q: "At December 31, Year 1, a company recognized a $40,000 loss and liability on a noncancelable commitment to purchase 10,000 units at $25 because the market price had fallen to $21. When the goods were delivered in Year 2, the market price was $22. What gain should the company recognize in Year 2?",
      ja: "第1年度12月31日、会社は1個$25で10,000個を購入する解約不能契約について、市場価格が$21に下落したため損失と負債$40,000を認識した。第2年度に商品が納入された時点の市場価格は$22であった。第2年度に認識すべき利益はいくらか。",
      c: ["$10,000", "$0", "$40,000", "$30,000"],
      a: 0,
      ex: "納入時の市場価格22で棚卸資産220,000を計上し、負債40,000を取り崩す。支払250,000との差から回復益 = (22 − 21)× 10,000 = 10,000。回復益は過去に認識した損失の範囲内に限られる。",
    },
    {
      q: "A company's December 31, Year 1 ending inventory was overstated by $15,000. The error was never corrected, and the Year 2 ending inventory was correct. What is the effect of the error on Year 2 net income (ignore taxes)?",
      ja: "会社の第1年度12月31日の期末棚卸高が$15,000過大であった。この誤りは修正されず、第2年度の期末棚卸高は正しかった。誤りが第2年度の純利益に与える影響はどれか(税金は無視)。",
      c: ["Overstated by $15,000", "Understated by $15,000", "Not affected", "Understated by $30,000"],
      a: 1,
      ex: "第1年度の期末過大は第2年度の期首過大となり、第2年度の売上原価が15,000過大 → 純利益は15,000過小。第1年度の過大計上と相殺され、第2年度末の利益剰余金は正しくなる(自己修正的誤謬)。",
    },
    {
      q: "A company discovered that its Year 1 ending inventory was understated by $8,000 and its Year 2 ending inventory was overstated by $5,000. Neither error was corrected. What is the effect on Year 2 net income (ignore taxes)?",
      ja: "会社は、第1年度の期末棚卸高が$8,000過小、第2年度の期末棚卸高が$5,000過大であったことを発見した。いずれの誤りも修正されていない。第2年度の純利益への影響はどれか(税金は無視)。",
      c: ["Overstated by $3,000", "Understated by $3,000", "Understated by $13,000", "Overstated by $13,000"],
      a: 3,
      ex: "期首過小8,000 → 売上原価過小 → 利益8,000過大。期末過大5,000 → 売上原価過小 → 利益5,000過大。合計13,000過大。差し引き$3,000とするのは期首誤りの方向を逆に扱った誤り。",
    },
    {
      q: "Goods received on December 30 were properly recorded as a purchase and an account payable but were mistakenly excluded from the December 31 physical count under a periodic system. What is the effect of this error on the year-end financial statements?",
      ja: "12月30日に受け入れた商品は仕入と買掛金として正しく記録されたが、棚卸計算法のもとで12月31日の実地棚卸から誤って除外された。この誤りが期末財務諸表に与える影響はどれか。",
      c: [
        "Inventory understated, accounts payable correct, net income understated",
        "Inventory understated, accounts payable understated, net income correct",
        "Inventory correct, accounts payable overstated, net income understated",
        "Inventory understated, accounts payable correct, net income overstated",
      ],
      a: 0,
      ex: "仕入は計上済みだが期末棚卸から漏れたため、期末棚卸高が過小 → 売上原価過大 → 純利益過小。買掛金は正しく計上されている。",
    },
    {
      q: "Goods purchased FOB shipping point were in transit at December 31. The company recorded neither the purchase nor the payable and did not include the goods in its physical count. What is the effect on the year-end financial statements?",
      ja: "FOB出荷地点条件で購入した商品が12月31日時点で輸送中であった。会社は仕入も買掛金も記録せず、実地棚卸にも含めなかった。期末財務諸表への影響はどれか。",
      c: [
        "Inventory understated, accounts payable correct, net income understated",
        "Inventory correct, accounts payable understated, net income overstated",
        "Inventory understated, accounts payable understated, net income not affected",
        "Inventory understated, accounts payable understated, net income overstated",
      ],
      a: 2,
      ex: "FOB出荷地点では出荷時に所有権が移転するため、棚卸資産と買掛金がともに過小となる。仕入(過小)と期末棚卸高(過小)が同額で売上原価への影響は相殺され、純利益は影響を受けない。",
    },
    {
      q: "A company purchased a parcel of land with an old building for $300,000 and immediately razed the building to construct a new office. Related costs: demolition of the old building $25,000; proceeds from salvaged materials $5,000; legal fees for title search $4,000; delinquent property taxes assumed $6,000; grading and clearing $10,000; paving the parking lot $30,000; architect fees for the new office $40,000. What is the cost of the land?",
      ja: "会社は古い建物付きの土地を$300,000で購入し、新しい事務所を建設するため直ちに建物を取り壊した。関連費用:旧建物の取壊費$25,000、廃材の売却収入$5,000、権原調査の弁護士費用$4,000、引き受けた延滞固定資産税$6,000、整地費$10,000、駐車場の舗装$30,000、新事務所の設計料$40,000。土地の取得原価はいくらか。",
      c: ["$340,000", "$370,000", "$345,000", "$380,000"],
      a: 0,
      ex: "土地 = 300,000 + 25,000 − 5,000 + 4,000 + 6,000 + 10,000 = 340,000。駐車場の舗装は耐用年数のある土地改良(構築物)として別途計上し、設計料は新建物の原価である($370,000は誤り)。廃材収入は取壊費から控除する。",
    },
    {
      q: "A company purchased a machine with an invoice price of $120,000, terms 2/10, n/30, and paid within the discount period. It also paid $2,400 for freight, $600 for insurance during shipment, $5,000 for installation, $1,000 for testing before normal operations, and $1,500 to repair damage the company's own employees caused while uncrating the machine. What is the capitalized cost of the machine?",
      ja: "会社は請求額$120,000、条件2/10, n/30の機械を購入し、割引期間内に支払った。ほかに運送費$2,400、輸送中の保険料$600、据付費$5,000、通常稼働前の試運転費$1,000、自社従業員の開梱時の過失で生じた損傷の修理費$1,500を支払った。機械の取得原価はいくらか。",
      c: ["$129,000", "$128,100", "$125,000", "$126,600"],
      a: 3,
      ex: "取得原価 = 120,000 × 98% + 2,400 + 600 + 5,000 + 1,000 = 126,600。使用可能な状態にするための必要支出を含める。自社の過失による損傷の修理費は費用処理する($128,100は誤り)。割引を控除しないと$129,000。",
    },
    {
      q: "A company acquired land, a building, and equipment for a lump-sum price of $1,200,000 plus $30,000 of closing costs. Appraised fair values were: land $300,000, building $900,000, and equipment $300,000. At what amount should the building be recorded?",
      ja: "会社は土地・建物・設備を一括価格$1,200,000で取得し、ほかに取引手数料$30,000を支払った。鑑定による公正価値は土地$300,000、建物$900,000、設備$300,000であった。建物はいくらで記録すべきか。",
      c: ["$720,000", "$738,000", "$900,000", "$630,000"],
      a: 1,
      ex: "取得総額1,230,000を公正価値の比率で配分:建物 = 1,230,000 × 900,000 ÷ 1,500,000 = 738,000。手数料を除くと$720,000。鑑定額$900,000をそのまま用いるのは誤り。",
    },
    {
      q: "A company acquired equipment by paying $20,000 in cash and signing a $100,000 noninterest-bearing note due in three years. The equipment's cash price is not determinable, and the company's incremental borrowing rate is 8%. The present value of $1 for three periods at 8% is 0.7938. At what amount should the equipment be recorded?",
      ja: "会社は現金$20,000を支払い、3年後に満期の無利息手形$100,000を振り出して設備を取得した。設備の現金価格は不明で、会社の追加借入利子率は8%である。8%・3期の$1の現在価値係数は0.7938である。設備はいくらで記録すべきか。",
      c: ["$120,000", "$79,380", "$99,380", "$95,256"],
      a: 2,
      ex: "取得原価 = 現金20,000 + 手形の現在価値100,000 × 0.7938 = 99,380。額面合計$120,000は利息部分を含むため誤り。現金部分まで割り引く($95,256)のも誤り。差額20,620は手形の割引として利息費用で償却する。",
    },
    {
      q: "On January 1, a company acquired equipment by issuing a note payable requiring five annual payments of $10,000 at the end of each year. The prevailing interest rate for similar notes is 10%, and the present value of an ordinary annuity of $1 for five periods at 10% is 3.7908. What is the carrying amount of the note at December 31 of the first year, after the first payment (round to the nearest dollar)?",
      ja: "会社は1月1日、毎年末に$10,000を5回支払う手形を振り出して設備を取得した。類似の手形の市場利子率は10%で、10%・5期の通常年金現価係数は3.7908である。初年度12月31日の初回支払後の手形の帳簿価額はいくらか(ドル未満四捨五入)。",
      c: ["$40,000", "$27,908", "$34,117", "$31,699"],
      a: 3,
      ex: "設備・手形の当初計上額 = 10,000 × 3.7908 = 37,908。初年度利息 = 37,908 × 10% = 3,791。期末帳簿価額 = 37,908 + 3,791 − 10,000 = 31,699。支払額全額を元本から控除すると$27,908となり誤り。",
    },
    {
      q: "A company issued 10,000 shares of its $1 par common stock, which trades actively on a national exchange at $25 per share, in exchange for land. An independent appraisal valued the land at $240,000. At what amount should the land be recorded?",
      ja: "会社は全国取引所で活発に取引され1株$25の額面$1の普通株式10,000株を発行し、土地と交換した。独立鑑定による土地の評価額は$240,000であった。土地はいくらで記録すべきか。",
      c: ["$240,000", "$10,000", "$250,000", "$245,000"],
      a: 2,
      ex: "株式発行による資産取得は、発行株式と取得資産の公正価値のうちより明確に測定できる方で記録する。活発な市場価格がある株式の公正価値10,000 × 25 = 250,000の方が鑑定評価より信頼性が高い。資本金10,000、資本剰余金240,000を計上する。額面$10,000は誤り。",
    },
    {
      q: "A closely held company with no market for its shares issued 5,000 shares of $1 par common stock to acquire equipment. The equipment had a reliably determined appraised fair value of $85,000 and a carrying amount of $60,000 on the seller's books. At what amount should the equipment be recorded?",
      ja: "株式に市場が存在しない非公開会社が、額面$1の普通株式5,000株を発行して設備を取得した。設備には信頼性のある鑑定公正価値$85,000があり、売り手の帳簿価額は$60,000であった。設備はいくらで記録すべきか。",
      c: ["$5,000", "$85,000", "$60,000", "$0"],
      a: 1,
      ex: "株式の公正価値が容易に測定できない場合は、取得資産の公正価値$85,000で記録し、額面超過額80,000を資本剰余金とする。株式の額面$5,000や売り手の帳簿価額$60,000は取得原価の測定基準ではない。",
    },
    {
      q: "An unrelated private foundation unconditionally donated land with a fair value of $400,000 to a business enterprise to encourage it to build a training center. The enterprise paid $5,000 of legal and recording fees to transfer title. How should the enterprise record the donation?",
      ja: "関係のない民間財団が、研修センター建設を促すため、公正価値$400,000の土地を営利企業に無条件で寄贈した。企業は所有権移転のため弁護士・登記費用$5,000を支払った。企業は寄贈をどのように記録すべきか。",
      c: [
        "Land $405,000; contribution revenue (gain) $400,000",
        "Land $5,000; no revenue recognized",
        "Land $400,000; legal fees expensed; contribution revenue $400,000",
        "Memorandum entry only, with disclosure in the notes",
      ],
      a: 0,
      ex: "営利企業が受け取った無条件の寄贈資産は公正価値で計上し、同額を寄贈収益(利得)として認識する(ASC 958-605)。所有権移転の付随費用$5,000は土地の取得原価に含めるため土地は405,000。支払額のみ($5,000)とするのは誤り。",
    },
    {
      q: "A company constructed a warehouse for its own use. Costs incurred: direct materials $200,000; direct labor $150,000; incremental overhead caused by the construction $40,000; and interest capitalized under ASC 835-20 of $12,000. The lowest bid from an outside contractor was $480,000. At what amount should the warehouse be recorded?",
      ja: "会社は自家使用の倉庫を建設した。発生原価:直接材料費$200,000、直接労務費$150,000、建設により増加した間接費$40,000、ASC 835-20に基づき資本化した利息$12,000。外部業者の最低入札額は$480,000であった。倉庫はいくらで記録すべきか。",
      c: ["$480,000", "$402,000", "$390,000", "$362,000"],
      a: 1,
      ex: "自家建設資産は実際原価で記録する:200,000 + 150,000 + 40,000 + 12,000 = 402,000。外部入札額との差額を自家建設の利益として認識してはならない($480,000は誤り)。資本化利息を含めないと$390,000。",
    },
    {
      q: "During the year, a company's weighted-average accumulated expenditures on a qualifying asset were $1,500,000. It had a $1,000,000 specific construction loan at 9%. Its other borrowings were a $2,000,000 note at 10% and $3,000,000 of bonds at 7.5%. Total interest incurred was $515,000. What amount of interest should be capitalized?",
      ja: "当期、適格資産に対する加重平均累積支出額は$1,500,000であった。9%の特定建設借入金$1,000,000があり、その他の借入金は10%の手形$2,000,000と7.5%の社債$3,000,000であった。発生利息合計は$515,000である。資本化すべき利息はいくらか。",
      c: ["$127,500", "$135,000", "$132,500", "$515,000"],
      a: 2,
      ex: "特定借入分:1,000,000 × 9% = 90,000。超過500,000には一般借入の加重平均利率(200,000 + 225,000)÷ 5,000,000 = 8.5%を適用 → 42,500。回避可能利息 = 132,500(発生利息515,000以下)。全額に8.5%を適用すると$127,500。",
    },
    {
      q: "A company began constructing a building for its own use on January 1 and completed it on December 31. Construction expenditures were $600,000 on January 1, $900,000 on May 1, and $1,200,000 on October 1. What were the weighted-average accumulated expenditures for the year?",
      ja: "会社は1月1日に自家使用の建物の建設を開始し、12月31日に完成させた。建設支出は1月1日$600,000、5月1日$900,000、10月1日$1,200,000であった。当期の加重平均累積支出額はいくらか。",
      c: ["$2,700,000", "$1,350,000", "$1,800,000", "$1,500,000"],
      a: 3,
      ex: "600,000 × 12/12 + 900,000 × 8/12 + 1,200,000 × 3/12 = 600,000 + 600,000 + 300,000 = 1,500,000。支出総額$2,700,000をそのまま用いるのは誤り。",
    },
    {
      q: "A company's weighted-average accumulated expenditures on a qualifying asset were $4,000,000. It had no specific construction borrowings, and the weighted-average rate on its general borrowings was 10%. Total interest incurred during the year was $320,000. What amount of interest should be capitalized?",
      ja: "適格資産に対する加重平均累積支出額は$4,000,000であった。特定の建設借入金はなく、一般借入金の加重平均利率は10%であった。当期の発生利息合計は$320,000である。資本化すべき利息はいくらか。",
      c: ["$400,000", "$320,000", "$80,000", "$360,000"],
      a: 1,
      ex: "回避可能利息 = 4,000,000 × 10% = 400,000だが、資本化額は当期の実際発生利息320,000を上限とする。よって320,000。上限を考慮しない$400,000は誤り。",
    },
    {
      q: "A company's weighted-average accumulated expenditures on a qualifying asset were $800,000. It borrowed $1,000,000 at 8% specifically for the project, and its general borrowings carry a weighted-average rate of 9%. Total interest incurred exceeded $200,000. What amount of interest should be capitalized?",
      ja: "適格資産に対する加重平均累積支出額は$800,000であった。会社はこのプロジェクトのために8%で$1,000,000を特定借入しており、一般借入金の加重平均利率は9%である。発生利息合計は$200,000を超えている。資本化すべき利息はいくらか。",
      c: ["$64,000", "$80,000", "$72,000", "$0"],
      a: 0,
      ex: "加重平均累積支出額が特定借入額以下なので、支出額に特定借入の利率を適用する:800,000 × 8% = 64,000。特定借入の利息全額(80,000)を資本化するのは誤り。一般借入利率9%(72,000)は特定借入を超える部分にのみ用いる。",
    },
    {
      q: "Under U.S. GAAP, a company temporarily invested part of the proceeds of a taxable general-purpose borrowing that is being used to finance construction of its new headquarters and earned $15,000 of interest income. How should the interest income be treated?",
      ja: "米国GAAPにおいて、会社は新本社の建設資金に充てている課税対象の一般目的借入金の一部を一時的に運用し、受取利息$15,000を得た。この受取利息はどのように処理すべきか。",
      c: [
        "Offset against the interest cost capitalized",
        "Deducted from the cost of the building",
        "Deferred and amortized over the building's useful life",
        "Reported as interest income; it is not offset against capitalized interest",
      ],
      a: 3,
      ex: "米国GAAPでは原則として一時的運用による受取利息を資本化利息と相殺しない(非課税借入金の特定の場合を除く)。IFRSでは特定借入金の一時的運用益を資本化額から控除するため、混同しないよう注意する。",
    },
    {
      q: "A company purchased land on which it is constructing its own office building. Interest capitalized during the construction period that relates to the expenditures for the land should be added to the cost of:",
      ja: "会社は自社の事務所ビルを建設するための土地を購入した。建設期間中に資本化される利息のうち、土地への支出に係る部分はどの資産の原価に加算すべきか。",
      c: [
        "The land",
        "The building",
        "Neither; it should be expensed because land is not depreciated",
        "Land improvements",
      ],
      a: 1,
      ex: "土地自体は適格資産ではないが、建物建設のために土地を開発している場合、土地への支出も累積支出に含め、その資本化利息は建物の原価に加算する(建物を通じて減価償却される)。",
    },
    {
      q: "A company exchanged a used truck (cost $60,000; accumulated depreciation $25,000; fair value $42,000) and $10,000 cash for a new truck with a fair value of $52,000. The exchange has commercial substance. At what amount should the new truck be recorded?",
      ja: "会社は中古トラック(取得原価$60,000、減価償却累計額$25,000、公正価値$42,000)と現金$10,000を、公正価値$52,000の新しいトラックと交換した。交換には経済的実質がある。新しいトラックはいくらで記録すべきか。",
      c: ["$52,000", "$45,000", "$42,000", "$62,000"],
      a: 0,
      ex: "経済的実質がある交換は公正価値で測定:42,000 + 10,000 = 52,000で記録し、利得7,000(42,000 − 35,000)を全額認識する。$45,000は帳簿価額35,000 + 現金10,000で、経済的実質がない場合の金額である。",
    },
    {
      q: "A company exchanged equipment (carrying amount $35,000; fair value $42,000) plus $10,000 cash for similar equipment with a fair value of $52,000. The exchange lacks commercial substance. At what amount should the acquired equipment be recorded?",
      ja: "会社は設備(帳簿価額$35,000、公正価値$42,000)と現金$10,000を、公正価値$52,000の類似設備と交換した。交換に経済的実質はない。取得した設備はいくらで記録すべきか。",
      c: ["$52,000", "$35,000", "$45,000", "$42,000"],
      a: 2,
      ex: "経済的実質がなく現金を支払う側は利得を認識しない:新設備 = 帳簿価額35,000 + 支払現金10,000 = 45,000(利得7,000は繰り延べられる)。公正価値$52,000で記録するのは経済的実質がある場合。",
    },
    {
      q: "A company exchanged equipment with a carrying amount of $60,000 and a fair value of $80,000 for similar equipment with a fair value of $70,000 plus $10,000 cash. The exchange lacks commercial substance. What gain should the company recognize?",
      ja: "会社は帳簿価額$60,000、公正価値$80,000の設備を、公正価値$70,000の類似設備と現金$10,000と交換した。交換に経済的実質はない。会社が認識すべき利得はいくらか。",
      c: ["$20,000", "$0", "$10,000", "$2,500"],
      a: 3,
      ex: "受取現金の割合 = 10,000 ÷ 80,000 = 12.5%(25%未満なので非貨幣性交換)。利得総額20,000のうち現金受取分に比例して認識:20,000 × 10,000 ÷ 80,000 = 2,500。受取現金額$10,000をそのまま利得とするのは誤り。",
    },
    {
      q: "A company exchanged a machine (carrying amount $40,000; fair value $60,000) for a similar machine with a fair value of $48,000 plus $12,000 cash. The exchange lacks commercial substance. At what amount should the acquired machine be recorded?",
      ja: "会社は機械(帳簿価額$40,000、公正価値$60,000)を、公正価値$48,000の類似機械と現金$12,000と交換した。交換に経済的実質はない。取得した機械はいくらで記録すべきか。",
      c: ["$48,000", "$32,000", "$28,000", "$44,000"],
      a: 1,
      ex: "受取現金20%(25%未満)。認識利得 = 20,000 × 12,000 ÷ 60,000 = 4,000。新機械 = 40,000 − 12,000 + 4,000 = 32,000(= 公正価値48,000 − 繰延利得16,000)。利得を認識しないと$28,000となる。",
    },
    {
      q: "A company exchanged equipment with a carrying amount of $60,000 and a fair value of $80,000 for other equipment with a fair value of $50,000 plus $30,000 cash. Although the assets are similar and the exchange would otherwise lack commercial substance, what gain should the company recognize?",
      ja: "会社は帳簿価額$60,000、公正価値$80,000の設備を、公正価値$50,000の別の設備と現金$30,000と交換した。資産は類似しており、それ以外の点では経済的実質がないとしても、会社が認識すべき利得はいくらか。",
      c: ["$20,000", "$7,500", "$0", "$12,500"],
      a: 0,
      ex: "受取現金の割合 = 30,000 ÷ 80,000 = 37.5%で25%以上のため、取引全体を貨幣性交換として公正価値で処理し、利得20,000(80,000 − 60,000)を全額認識する。比例計算の$7,500は25%未満の場合の方法。",
    },
    {
      q: "A company exchanged equipment with a carrying amount of $50,000 and a fair value of $42,000, plus $5,000 cash, for similar equipment with a fair value of $47,000. The exchange lacks commercial substance. What should the company report?",
      ja: "会社は帳簿価額$50,000、公正価値$42,000の設備と現金$5,000を、公正価値$47,000の類似設備と交換した。交換に経済的実質はない。会社は何を報告すべきか。",
      c: [
        "No loss; new equipment recorded at $55,000",
        "Loss of $8,000; new equipment recorded at $42,000",
        "Loss of $8,000; new equipment recorded at $47,000",
        "Loss of $3,000; new equipment recorded at $52,000",
      ],
      a: 2,
      ex: "損失は経済的実質の有無にかかわらず全額を直ちに認識する:42,000 − 50,000 = 8,000の損失。新設備 = 42,000 + 5,000 = 47,000(公正価値)。損失を繰り延べ帳簿価額+現金の$55,000とするのは誤り。",
    },
    {
      q: "A company replaced the roof of its building for $90,000. The old roof's original cost of $40,000 and related accumulated depreciation of $30,000 are separately identifiable. How should the company account for the replacement?",
      ja: "会社は建物の屋根を$90,000で交換した。旧屋根の取得原価$40,000と関連する減価償却累計額$30,000は個別に識別可能である。この交換をどのように会計処理すべきか。",
      c: [
        "Expense $90,000 as a repair",
        "Debit accumulated depreciation $90,000",
        "Capitalize $50,000, the net increase in cost",
        "Remove the old roof and recognize a $10,000 loss, and capitalize $90,000 for the new roof",
      ],
      a: 3,
      ex: "旧構成部分の帳簿価額が識別可能な場合は置換法:旧屋根の原価40,000と累計額30,000を除去し、帳簿価額10,000を損失とし、新屋根90,000を資産計上する。修繕費処理は耐用年数を延長する取替には不適切。",
    },
    {
      q: "A company made a major overhaul of a machine that extended its useful life by four years but did not increase its productivity. The carrying amount of the components replaced cannot be determined. How should the overhaul cost generally be recorded?",
      ja: "会社は機械の大規模なオーバーホールを行い、耐用年数が4年延長したが、生産能力は増加しなかった。取り替えた構成部分の帳簿価額は算定できない。オーバーホールの費用は一般にどのように記録すべきか。",
      c: [
        "As a debit to accumulated depreciation",
        "As a debit to repairs and maintenance expense",
        "As a debit to the machine account with a loss on the old components",
        "As a deferred charge amortized over four years",
      ],
      a: 0,
      ex: "耐用年数を延長する支出で旧部分の帳簿価額が不明な場合、過去の減価償却を戻す考え方で減価償却累計額を借方計上する(資産の帳簿価額が増加)。生産性・品質を向上させる改良であれば資産勘定を借方とする。",
    },
    {
      q: "During the year, a company incurred the following costs on its existing plant: construction of a new wing, $300,000; an improvement that significantly increased the efficiency of a production line (old components not identifiable), $80,000; routine replacement of worn parts, $15,000; and repainting of the plant interior, $12,000. What total amount should be capitalized?",
      ja: "当期、会社は既存工場について次の支出を行った:新棟の増築$300,000、生産ラインの効率を大幅に高める改良(旧部分は識別不能)$80,000、摩耗部品の定期的な交換$15,000、工場内部の塗装$12,000。資本化すべき合計額はいくらか。",
      c: ["$392,000", "$395,000", "$380,000", "$300,000"],
      a: 2,
      ex: "増築(addition)300,000と効率を高める改良(improvement)80,000を資本化し、合計380,000。定期的な部品交換と塗装は通常の修繕で費用処理する($395,000・$392,000は誤り)。",
    },
  ],
});

CPA.tbs({ id: "TBS-FAR-19", section: "FAR", chapter: "FAR-03", title: "ドル価値LIFO(複数年度の層の計算)",
  scenario: `<p>Mori Co. adopted dollar-value LIFO on December 31, Year 1, when its inventory was $150,000 (base-year price index 1.00). Year-end data:</p>
<table><tr><th>Date</th><th>Inventory at current-year cost</th><th>Price index</th></tr>
<tr><td>Dec. 31, Year 1</td><td>$150,000</td><td>1.00</td></tr>
<tr><td>Dec. 31, Year 2</td><td>$180,400</td><td>1.10</td></tr>
<tr><td>Dec. 31, Year 3</td><td>$189,000</td><td>1.20</td></tr>
<tr><td>Dec. 31, Year 4</td><td>$208,000</td><td>? (inventory at base-year cost: $160,000)</td></tr></table>
<p class="ja">Mori社は第1年度12月31日、棚卸資産$150,000(基準年物価指数1.00)の時点でドル価値LIFOを採用した。各年度末の当期原価による棚卸資産と物価指数は上表のとおり。第4年度の指数は示されていないが、基準年原価による棚卸資産は$160,000である。</p>`,
  rows: [
    { label: "Dollar-value LIFO inventory, Dec. 31, Year 2(第2年度末のドル価値LIFO棚卸高)", type: "num", answer: 165400 },
    { label: "Dollar-value LIFO inventory, Dec. 31, Year 3(第3年度末のドル価値LIFO棚卸高)", type: "num", answer: 158250 },
    { label: "Price index for Year 4(第4年度の物価指数)", type: "num", answer: 1.3, tol: 0.001 },
    { label: "Layer added in Year 4 at dollar-value LIFO cost(第4年度に追加された層のドル価値LIFO原価)", type: "num", answer: 3250 },
    { label: "Dollar-value LIFO inventory, Dec. 31, Year 4(第4年度末のドル価値LIFO棚卸高)", type: "num", answer: 161500 },
  ],
  explain: `<p>第2年度:180,400 ÷ 1.10 = 164,000(基準年原価)→ 増加14,000 × 1.10 = 15,400。150,000 + 15,400 = 165,400。</p>
<p>第3年度:189,000 ÷ 1.20 = 157,500 → 6,500減少。最新の第2年度層から取り崩し、残る第2年度層 7,500 × 1.10 = 8,250。150,000 + 8,250 = 158,250(取り崩した層は復活しない)。</p>
<p>第4年度:指数 = 208,000 ÷ 160,000 = 1.30。基準年原価の増加 160,000 − 157,500 = 2,500 × 1.30 = 3,250。150,000 + 8,250 + 3,250 = 161,500。</p>`,
});

CPA.tbs({ id: "TBS-FAR-20", section: "FAR", chapter: "FAR-03", title: "利息の資本化(回避可能利息)",
  scenario: `<p>Sato Corp. constructed a new headquarters building for its own use. Construction began January 1, Year 1, and the building was completed and ready for use on December 31, Year 1. Construction expenditures were:</p>
<table><tr><th>Date</th><th>Expenditure</th></tr>
<tr><td>January 1</td><td>$1,200,000</td></tr>
<tr><td>April 1</td><td>$1,600,000</td></tr>
<tr><td>September 1</td><td>$1,500,000</td></tr>
<tr><td>December 31</td><td>$500,000</td></tr></table>
<p>Debt outstanding all year: an 8% specific construction loan of $2,000,000; a 10% note payable of $3,000,000; and 6% bonds payable of $2,000,000. Sato also earned $20,000 by temporarily investing part of the construction loan proceeds (the loan is taxable).</p>
<p class="ja">Sato社は自家使用の本社ビルを建設した。建設は第1年度1月1日に開始し、12月31日に完成・使用可能となった。建設支出は上表のとおり。年間を通じた借入金:8%の特定建設借入金$2,000,000、10%の手形$3,000,000、6%の社債$2,000,000。また、建設借入金(課税対象)の一部を一時運用して$20,000の利息を得た。</p>`,
  rows: [
    { label: "Weighted-average accumulated expenditures(加重平均累積支出額)", type: "num", answer: 2900000 },
    { label: "Weighted-average interest rate on general borrowings, in %(一般借入金の加重平均利率、%)", type: "num", answer: 8.4, tol: 0.01 },
    { label: "Interest capitalized for Year 1(第1年度の資本化利息)", type: "num", answer: 235600 },
    { label: "Interest expense reported for Year 1(第1年度に計上する支払利息)", type: "num", answer: 344400 },
    { label: "Capitalized cost of the building(建物の取得原価)", type: "num", answer: 5035600 },
    { label: "Treatment of the $20,000 investment income(受取利息$20,000の処理)", type: "select", options: ["Deducted from capitalized interest", "Reported as investment (interest) income", "Deducted from the cost of the building"], answer: "Reported as investment (interest) income" },
  ],
  explain: `<p>加重平均累積支出額 = 1,200,000 × 12/12 + 1,600,000 × 9/12 + 1,500,000 × 4/12 + 500,000 × 0/12 = 1,200,000 + 1,200,000 + 500,000 + 0 = 2,900,000。</p>
<p>一般借入金の加重平均利率 = (300,000 + 120,000)÷ 5,000,000 = 8.4%。</p>
<p>回避可能利息 = 2,000,000 × 8% = 160,000 + 900,000 × 8.4% = 75,600 → 235,600。実際発生利息 = 160,000 + 300,000 + 120,000 = 580,000(上限を下回る)ため235,600を資本化し、残り344,400を費用処理する。</p>
<p>建物原価 = 支出合計4,800,000 + 235,600 = 5,035,600。米国GAAPでは課税対象借入金の一時運用益は資本化利息と相殺せず、受取利息として計上する。</p>`,
});

CPA.tbs({ id: "TBS-FAR-21", section: "FAR", chapter: "FAR-03", title: "非貨幣性資産の交換(経済的実質・現金授受)",
  scenario: `<p>Kato Co. completed three independent exchanges of equipment during the year:</p>
<table><tr><th></th><th>Exchange A</th><th>Exchange B</th><th>Exchange C</th></tr>
<tr><td>Carrying amount of asset given</td><td>$40,000</td><td>$45,000</td><td>$70,000</td></tr>
<tr><td>Fair value of asset given</td><td>$52,000</td><td>$75,000</td><td>$62,000</td></tr>
<tr><td>Cash paid (received)</td><td>$8,000 paid</td><td>($15,000) received</td><td>$4,000 paid</td></tr>
<tr><td>Fair value of asset received</td><td>$60,000</td><td>$60,000</td><td>$66,000</td></tr>
<tr><td>Commercial substance?</td><td>Yes</td><td>No</td><td>No</td></tr></table>
<p class="ja">Kato社は当期に設備の独立した3件の交換を行った。各交換の引渡資産の帳簿価額・公正価値、現金の支払(受取)、受入資産の公正価値、経済的実質の有無は上表のとおり。</p>`,
  rows: [
    { label: "Exchange A — gain recognized(交換A:認識する利得)", type: "num", answer: 12000 },
    { label: "Exchange A — cost of asset received(交換A:受入資産の取得原価)", type: "num", answer: 60000 },
    { label: "Exchange B — gain recognized(交換B:認識する利得)", type: "num", answer: 6000 },
    { label: "Exchange B — cost of asset received(交換B:受入資産の取得原価)", type: "num", answer: 36000 },
    { label: "Exchange C — loss recognized(交換C:認識する損失)", type: "num", answer: 8000 },
    { label: "Exchange C — cost of asset received(交換C:受入資産の取得原価)", type: "num", answer: 66000 },
  ],
  explain: `<p>交換A(経済的実質あり):公正価値で測定。利得 = 52,000 − 40,000 = 12,000。受入資産 = 52,000 + 8,000 = 60,000。</p>
<p>交換B(経済的実質なし・現金受取):受取現金の割合 15,000 ÷ 75,000 = 20%(25%未満)。利得総額30,000 × 20% = 6,000を認識。受入資産 = 45,000 − 15,000 + 6,000 = 36,000(= 60,000 − 繰延利得24,000)。</p>
<p>交換C(経済的実質なし):損失は常に全額認識。損失 = 70,000 − 62,000 = 8,000。受入資産 = 62,000 + 4,000 = 66,000(公正価値)。</p>`,
});
