// BAR の追加問題(経営分析・企業結合・政府会計の応用。計算問題を中心に)

CPA.extend("BAR-01", {
  mcq: [
    {
      q: "A company reported cost of goods sold of $730,000. Inventory was $90,000 at the beginning of the year and $110,000 at the end of the year. Using a 365-day year, what is the company's days' sales in inventory (days inventory outstanding)?",
      ja: "ある会社の売上原価は$730,000、棚卸資産は期首$90,000、期末$110,000であった。1年を365日として、棚卸資産回転日数はいくらか。",
      c: ["45 days", "50 days", "55 days", "7.3 days"],
      a: 1,
      ex: "平均棚卸資産 = (90,000 + 110,000)÷ 2 = 100,000。回転率 = 730,000 ÷ 100,000 = 7.3回。回転日数 = 365 ÷ 7.3 = 50日。期首・期末の一方だけを使うと45日・55日になる。",
    },
    {
      q: "A company has days inventory outstanding of 50 days, days sales outstanding of 35 days, and days payables outstanding of 30 days. What is its cash conversion cycle?",
      ja: "ある会社の棚卸資産回転日数は50日、売上債権回転日数は35日、仕入債務回転日数は30日である。キャッシュ・コンバージョン・サイクルは何日か。",
      c: ["115 days", "45 days", "85 days", "55 days"],
      a: 3,
      ex: "CCC = 棚卸資産回転日数 + 売上債権回転日数 − 仕入債務回転日数 = 50 + 35 − 30 = 55日。85日は営業循環(仕入債務を引く前)。",
    },
    {
      q: "A company sells Products A and B in a constant sales mix of 3 units of A for every 2 units of B. Unit contribution margins are $10 for A and $15 for B. Total fixed costs are $360,000. How many units of Product B must be sold to break even?",
      ja: "ある会社は製品Aと製品Bを、A 3個に対しB 2個の一定の割合で販売する。単位貢献利益はAが$10、Bが$15、固定費総額は$360,000である。損益分岐点に達するには製品Bを何個販売する必要があるか。",
      c: ["12,000 units", "18,000 units", "24,000 units", "14,400 units"],
      a: 0,
      ex: "セット(A3個+B2個)の貢献利益 = 3 × 10 + 2 × 15 = 60。損益分岐セット数 = 360,000 ÷ 60 = 6,000セット → B = 6,000 × 2 = 12,000個(Aは18,000個)。",
    },
    {
      q: "A product sells for $40 per unit and has variable costs of $26 per unit. Fixed costs are $210,000, and the income tax rate is 25%. What level of sales dollars is required to earn after-tax income of $42,000?",
      ja: "製品の販売価格は1個$40、変動費は1個$26、固定費は$210,000、法人税率は25%である。税引後利益$42,000を得るために必要な売上高はいくらか。",
      c: ["$720,000", "$760,000", "$600,000", "$266,000"],
      a: 1,
      ex: "貢献利益率 = (40 − 26)÷ 40 = 35%。税引前目標利益 = 42,000 ÷(1 − 0.25)= 56,000。必要売上高 = (210,000 + 56,000)÷ 0.35 = 760,000。税引後利益をそのまま使うと720,000になる。",
    },
    {
      q: "A company's static budget was based on 10,000 units at a selling price of $25 and variable cost of $15 per unit, with fixed costs of $60,000. Actual sales were 11,000 units. What is the sales-volume variance on operating income?",
      ja: "ある会社の固定予算は、販売量10,000個、販売価格1個$25、変動費1個$15、固定費$60,000に基づいていた。実際の販売量は11,000個であった。営業利益に対する販売数量差異はいくらか。",
      c: ["$25,000 favorable", "$10,000 unfavorable", "$10,000 favorable", "$15,000 unfavorable"],
      a: 2,
      ex: "販売数量差異 = (実際販売量 − 予算販売量)× 予算単位貢献利益 = 1,000 × (25 − 15) = 10,000 有利。25,000は売上高だけの差異。",
    },
    {
      q: "During the month, a company used 4,100 direct labor hours at a total cost of $92,250. The standard labor rate is $22 per hour, and 4,000 standard hours were allowed for actual output. What is the direct labor rate variance?",
      ja: "当月、ある会社は直接作業時間4,100時間を総額$92,250で使用した。標準賃率は1時間$22、実際生産量に対する標準作業時間は4,000時間である。直接労務費の賃率差異はいくらか。",
      c: ["$2,050 unfavorable", "$2,050 favorable", "$2,000 unfavorable", "$4,250 unfavorable"],
      a: 0,
      ex: "実際賃率 = 92,250 ÷ 4,100 = 22.50。賃率差異 = (22.50 − 22.00)× 実際時間4,100 = 2,050 不利。標準時間4,000を使うと2,000になる誤り。",
    },
    {
      q: "Variable overhead is applied at $8 per direct labor hour. Actual direct labor hours were 5,400, and 5,000 standard hours were allowed for actual output. Actual variable overhead was $44,000. What is the variable overhead spending variance?",
      ja: "変動製造間接費は直接作業時間1時間あたり$8で配賦される。実際作業時間は5,400時間、実際生産量に対する標準時間は5,000時間、実際の変動製造間接費は$44,000であった。変動製造間接費の予算(支出)差異はいくらか。",
      c: ["$3,200 unfavorable", "$4,000 unfavorable", "$800 favorable", "$800 unfavorable"],
      a: 3,
      ex: "予算差異 = 実際発生額 − 実際時間 × 標準配賦率 = 44,000 − 5,400 × 8(43,200)= 800 不利。3,200は能率差異(400時間 × 8)、4,000は総差異。",
    },
    {
      q: "Budgeted fixed manufacturing overhead is $120,000, based on a denominator level of 10,000 machine hours. Standard machine hours allowed for actual output were 9,000, and actual fixed overhead was $123,000. What is the fixed overhead production-volume variance?",
      ja: "固定製造間接費の予算は$120,000で、基準操業度は機械時間10,000時間である。実際生産量に対する標準機械時間は9,000時間、実際の固定製造間接費は$123,000であった。固定製造間接費の操業度差異はいくらか。",
      c: ["$12,000 favorable", "$12,000 unfavorable", "$3,000 unfavorable", "$15,000 unfavorable"],
      a: 1,
      ex: "固定費率 = 120,000 ÷ 10,000 = 12。配賦額 = 9,000 × 12 = 108,000。操業度差異 = 予算120,000 − 配賦108,000 = 12,000 不利(基準操業度に達しなかった)。3,000は予算差異。",
    },
    {
      q: "A company is considering a $200,000 machine with a 4-year life and no salvage value, depreciated straight-line for tax purposes. The machine will produce pretax cash savings of $70,000 per year. The tax rate is 25%, and the present value of an ordinary annuity of $1 for 4 periods at the 10% cost of capital is 3.170. What is the project's NPV?",
      ja: "ある会社は、耐用年数4年・残存価額ゼロで税務上定額法により償却する$200,000の機械を検討している。機械は年間$70,000の税引前現金節約を生む。税率25%、資本コスト10%・4期の年金現価係数は3.170である。NPVはいくらか。",
      c: ["$6,050", "$21,900", "$(33,575)", "$61,525"],
      a: 0,
      ex: "年間CF = 70,000 × (1 − 0.25) + 減価償却50,000 × 0.25(タックスシールド12,500)= 65,000。NPV = 65,000 × 3.170 − 200,000 = 206,050 − 200,000 = 6,050。税を無視すると21,900、タックスシールドを忘れると−33,575。",
    },
    {
      q: "An investment of $37,910 will generate cash inflows of $10,000 at the end of each year for 5 years. Present value of an ordinary annuity of $1 for 5 periods: 8% = 3.993; 10% = 3.791; 12% = 3.605. What is the project's internal rate of return?",
      ja: "$37,910の投資から、5年間毎年末に$10,000のキャッシュインフローが生じる。5期の年金現価係数は8%:3.993、10%:3.791、12%:3.605である。内部収益率(IRR)はいくらか。",
      c: ["8%", "12%", "10%", "26.4%"],
      a: 2,
      ex: "IRRはNPV = 0となる率。必要な年金現価係数 = 37,910 ÷ 10,000 = 3.791 → 10%。26.4%は年間CF ÷ 投資額で、時間価値を無視している。",
    },
    {
      q: "A project costs $90,000 and is expected to generate cash inflows of $30,000 in Year 1, $40,000 in Year 2, $25,000 in Year 3, and $20,000 in Year 4. Assuming cash flows occur evenly within each year, what is the payback period?",
      ja: "あるプロジェクトの投資額は$90,000で、キャッシュインフローは1年目$30,000、2年目$40,000、3年目$25,000、4年目$20,000と見込まれる。各年のCFは年間を通じて均等に発生するとすると、回収期間は何年か。",
      c: ["3.0 years", "2.8 years", "3.13 years", "3.6 years"],
      a: 1,
      ex: "2年目末までの累計回収 = 70,000。残り20,000 ÷ 3年目のCF 25,000 = 0.8年 → 回収期間 2.8年。3.13年は4年間の平均CF(115,000 ÷ 4 = 28,750)で割った誤り。",
    },
    {
      q: "A company makes a component at the following per-unit costs for 10,000 units: direct materials $12, direct labor $8, variable overhead $5, and allocated fixed overhead $10, of which $4 per unit is avoidable if the component is purchased. An outside supplier offers the component for $28 per unit. If the company buys the component, operating income will:",
      ja: "ある会社は部品10,000個を、1個あたり直接材料費$12、直接労務費$8、変動製造間接費$5、配賦固定製造間接費$10(うち$4は外部購入すれば回避可能)で製造している。外部業者が1個$28で供給を申し出た。部品を購入した場合、営業利益はどうなるか。",
      c: ["Increase by $10,000", "Decrease by $30,000", "Increase by $70,000", "Decrease by $10,000"],
      a: 0,
      ex: "自製の関連原価 = 12 + 8 + 5 + 回避可能固定費4 = 29。購入価格28との差1 × 10,000個 = 10,000 の増益。回避不能な固定費$6は意思決定に無関係。",
    },
    {
      q: "A segment reports sales of $500,000, variable costs of $320,000, avoidable direct fixed costs of $140,000, and allocated common fixed costs of $80,000, resulting in a reported loss of $40,000. If the segment is dropped and the common costs continue, the company's total operating income will:",
      ja: "あるセグメントは売上高$500,000、変動費$320,000、回避可能な個別固定費$140,000、配賦された共通固定費$80,000で、$40,000の損失を計上している。このセグメントを廃止し、共通費は引き続き発生する場合、会社全体の営業利益はどうなるか。",
      c: ["Increase by $40,000", "Decrease by $180,000", "Decrease by $40,000", "Decrease by $120,000"],
      a: 2,
      ex: "セグメント・マージン = 500,000 − 320,000 − 140,000 = 40,000。廃止するとこの40,000を失い、共通費80,000は残るので全社利益は40,000減少する。",
    },
    {
      q: "Machine hours are a binding constraint. Product X has a contribution margin of $30 per unit and requires 3 machine hours; Product Y has a contribution margin of $24 and requires 2 machine hours; Product Z has a contribution margin of $40 and requires 5 machine hours. Demand is unlimited. To maximize profit, the company should first produce:",
      ja: "機械時間が制約条件となっている。製品Xは単位貢献利益$30で機械時間3時間、製品Yは$24で2時間、製品Zは$40で5時間を要する。需要に上限はない。利益を最大化するために、最初に生産すべき製品はどれか。",
      c: ["Product Y", "Product Z", "Product X", "Products X and Z equally"],
      a: 0,
      ex: "制約資源1単位あたりの貢献利益で判断する。X = 30 ÷ 3 = 10、Y = 24 ÷ 2 = 12、Z = 40 ÷ 5 = 8 → Yが最大。単位貢献利益が最大のZを選ぶのは典型的な誤り。",
    },
    {
      q: "Division A sells a part externally for $50. Its variable cost is $30 per unit, which includes $3 of variable selling costs that are avoided on internal transfers. Division A is operating at full capacity. What is the minimum transfer price Division A should accept for sales to Division B?",
      ja: "A事業部は部品を外部に$50で販売している。変動費は1個$30で、そのうち$3は社内振替では発生しない変動販売費である。A事業部はフル操業である。B事業部への振替でA事業部が受け入れるべき最低振替価格はいくらか。",
      c: ["$30", "$50", "$27", "$47"],
      a: 3,
      ex: "最低振替価格 = 振替の増分原価 + 機会原価。増分原価 = 30 − 3 = 27、フル操業なので失う外部販売の貢献利益 = 50 − 30 = 20。27 + 20 = 47。遊休能力があれば27。",
    },
    {
      q: "A company's target capital structure is 40% debt and 60% common equity. Its pretax cost of debt is 8%, and its tax rate is 25%. The risk-free rate is 4%, the expected market return is 9%, and the company's beta is 1.2. What is the weighted-average cost of capital?",
      ja: "ある会社の目標資本構成は負債40%、普通株式60%である。税引前負債コストは8%、税率は25%。リスクフリーレートは4%、市場の期待収益率は9%、ベータは1.2である。加重平均資本コスト(WACC)はいくらか。",
      c: ["9.2%", "8.4%", "8.88%", "7.6%"],
      a: 1,
      ex: "株主資本コスト(CAPM)= 4% + 1.2 × (9% − 4%) = 10%。税引後負債コスト = 8% × 0.75 = 6%。WACC = 0.4 × 6% + 0.6 × 10% = 8.4%。税引前の8%を使うと9.2%。",
    },
    {
      q: "A company just paid a dividend of $2.00 per share. Dividends are expected to grow at a constant 5% per year, and the stock currently sells for $42. Using the dividend growth model, what is the cost of common equity?",
      ja: "ある会社は1株$2.00の配当を支払ったばかりである。配当は毎年5%で一定成長すると見込まれ、株価は現在$42である。配当成長モデルによる普通株式のコストはいくらか。",
      c: ["9.76%", "5.00%", "10.00%", "10.25%"],
      a: 2,
      ex: "Ke = D1 ÷ P0 + g。D1 = 2.00 × 1.05 = 2.10。2.10 ÷ 42 = 5% + 成長率5% = 10%。当期配当D0をそのまま使うと9.76%になる。",
    },
    {
      q: "Under activity-based costing, setup costs of $90,000 are driven by 300 setups, and inspection costs of $60,000 are driven by 1,500 inspection hours. Product P required 20 setups and 100 inspection hours for a production run of 1,000 units. What is the ABC overhead cost per unit of Product P?",
      ja: "活動基準原価計算で、段取費$90,000は段取回数300回、検査費$60,000は検査時間1,500時間がコスト・ドライバーである。製品Pは1,000個の生産で段取20回、検査100時間を要した。製品Pの1個あたりのABC間接費はいくらか。",
      c: ["$6", "$10", "$4", "$15"],
      a: 1,
      ex: "段取の配賦率 = 90,000 ÷ 300 = 300/回、検査 = 60,000 ÷ 1,500 = 40/時間。製品P = 20 × 300 + 100 × 40 = 6,000 + 4,000 = 10,000 → 1,000個で1個あたり10。",
    },
    {
      q: "A regression analysis of monthly maintenance cost (Y) on machine hours (X) produced the equation Y = $4,200 + $2.50X, with an R-squared of 0.81. What is the predicted maintenance cost for a month with 3,000 machine hours?",
      ja: "月次の保守費(Y)を機械時間(X)で回帰分析した結果、Y = $4,200 + $2.50X、決定係数(R²)0.81となった。機械時間3,000時間の月の保守費の予測値はいくらか。",
      c: ["$7,500", "$9,477", "$4,200", "$11,700"],
      a: 3,
      ex: "Y = 4,200 + 2.50 × 3,000 = 11,700。R² = 0.81 は保守費の変動の81%が機械時間で説明されることを示す当てはまりの指標で、予測値に掛けるものではない。",
    },
    {
      q: "Using the high-low method, a company identified its highest activity month at 9,000 machine hours with total overhead of $48,000 and its lowest activity month at 5,000 machine hours with total overhead of $32,000. What is the estimated monthly fixed overhead?",
      ja: "高低点法で、操業度が最も高い月は機械時間9,000時間・製造間接費総額$48,000、最も低い月は5,000時間・$32,000であった。月間の固定製造間接費の見積額はいくらか。",
      c: ["$12,000", "$20,000", "$16,000", "$32,000"],
      a: 0,
      ex: "変動費率 = (48,000 − 32,000)÷(9,000 − 5,000)= 4/時間。固定費 = 48,000 − 9,000 × 4 = 12,000(低点でも 32,000 − 20,000 = 12,000)。",
    },
    {
      q: "A division has average operating assets of $2,000,000 and operating income of $300,000. The company's required rate of return is 12%. What is the division's residual income?",
      ja: "ある事業部の平均営業資産は$2,000,000、営業利益は$300,000である。会社の要求収益率は12%である。この事業部の残余利益はいくらか。",
      c: ["$240,000", "$36,000", "$60,000", "$300,000"],
      a: 2,
      ex: "残余利益 = 営業利益 − 営業資産 × 要求収益率 = 300,000 − 2,000,000 × 12% = 60,000。ROIは15%。残余利益で評価すると、ROIを下げても要求収益率を上回る投資が採用されやすい。",
    },
    {
      q: "Credit sales are budgeted at $100,000 for April, $120,000 for May, and $150,000 for June. Customers pay 30% in the month of sale, 60% in the following month, and 8% in the second month after the sale; 2% are uncollectible. What are budgeted cash collections for June?",
      ja: "掛売上の予算は4月$100,000、5月$120,000、6月$150,000である。顧客は販売月に30%、翌月に60%、翌々月に8%を支払い、2%は回収不能となる。6月の現金回収予算はいくらか。",
      c: ["$127,000", "$125,000", "$150,000", "$117,000"],
      a: 1,
      ex: "6月の回収 = 6月売上 150,000 × 30% + 5月 120,000 × 60% + 4月 100,000 × 8% = 45,000 + 72,000 + 8,000 = 125,000。回収不能の2%は回収されないので含めない(4月分の回収を8%+2%=10%と誤ると127,000)。",
    },
  ],
});

CPA.extend("BAR-02", {
  mcq: [
    {
      q: "Acquirer Co. paid $720,000 for 80% of Target Co. The fair value of the noncontrolling interest was $170,000, and the fair value of Target's identifiable net assets was $950,000. What amount of gain, if any, should Acquirer recognize on the acquisition date?",
      ja: "Acquirer社はTarget社の80%を$720,000で取得した。非支配持分の公正価値は$170,000、Target社の識別可能純資産の公正価値は$950,000であった。取得日にAcquirer社が認識すべき利得はいくらか。",
      c: ["$40,000", "$48,000", "$60,000", "$0"],
      a: 2,
      ex: "割安購入益 = 識別可能純資産の公正価値 − (対価 + 非支配持分の公正価値)= 950,000 − (720,000 + 170,000) = 60,000。全額が取得企業の利益として計上され、非支配持分には配分しない。",
    },
    {
      q: "In a business combination, contingent consideration classified as a liability had an acquisition-date fair value of $50,000. At year-end, after the measurement period, its fair value increased to $70,000 because the acquiree exceeded performance targets. How should the $20,000 change be reported?",
      ja: "企業結合で、負債に分類された条件付対価の取得日の公正価値は$50,000であった。測定期間終了後の期末に、被取得企業が業績目標を上回ったため公正価値は$70,000に増加した。$20,000の変動はどのように報告するか。",
      c: ["As an increase in goodwill", "As a $20,000 loss in earnings", "As a $20,000 loss in other comprehensive income", "No adjustment; contingent consideration is not remeasured"],
      a: 1,
      ex: "取得日後の事象による負債分類の条件付対価の公正価値の変動は、のれんを修正せず当期損益で認識する。資本に分類された条件付対価は再測定しない。",
    },
    {
      q: "At the acquisition date, an acquirer provisionally recorded acquired equipment at $400,000. Five months later, an appraisal based on facts that existed at the acquisition date valued the equipment at $360,000. The acquirer should:",
      ja: "取得日に、取得企業は取得した設備を暫定的に$400,000で計上した。5か月後、取得日時点に存在した事実に基づく鑑定で、設備の評価額は$360,000となった。取得企業はどうすべきか。",
      c: ["Recognize a $40,000 impairment loss", "Restate the prior-period financial statements", "Increase goodwill by $40,000 in the period the adjustment is determined", "Make no adjustment because the acquisition has been recorded"],
      a: 2,
      ex: "測定期間(最長1年)中に取得日時点の事実に関する情報を入手した場合、暫定額を修正し、相手勘定はのれんとする。修正は判明した期に計上し(過年度の修正再表示は不要)、減価償却への影響も同じ期に反映する。",
    },
    {
      q: "Parent previously held a 20% interest in Sub with a carrying amount of $150,000 and a fair value of $200,000. Parent acquires an additional 60% of Sub for $660,000, obtaining control. The fair value of the 20% noncontrolling interest is $220,000, and the fair value of Sub's identifiable net assets is $900,000. What amount of goodwill should be recognized?",
      ja: "親会社はSub社株式の20%(簿価$150,000、公正価値$200,000)を保有していた。親会社はさらに60%を$660,000で取得し支配を獲得した。非支配持分20%の公正価値は$220,000、Sub社の識別可能純資産の公正価値は$900,000である。認識すべきのれんはいくらか。",
      c: ["$130,000", "$180,000", "$120,000", "$200,000"],
      a: 1,
      ex: "段階取得では既存持分を取得日の公正価値で再測定する(利得 200,000 − 150,000 = 50,000を損益計上)。のれん = 660,000 + 200,000 + 220,000 − 900,000 = 180,000。簿価を使うと130,000になる。",
    },
    {
      q: "A public company's reporting unit has a carrying amount of $1,200,000, including goodwill of $100,000. The fair value of the reporting unit is $1,000,000. Under current U.S. GAAP, what goodwill impairment loss should be recognized?",
      ja: "公開企業の報告単位の帳簿価額は$1,200,000で、うちのれんは$100,000である。報告単位の公正価値は$1,000,000である。現行の米国会計基準で認識すべきのれんの減損損失はいくらか。",
      c: ["$200,000", "$0", "$150,000", "$100,000"],
      a: 3,
      ex: "減損損失 = 帳簿価額 − 公正価値 = 200,000 だが、その報告単位に配分されたのれんの額(100,000)が上限となる。",
    },
    {
      q: "A private company elects the private company accounting alternative for goodwill. Which of the following is correct?",
      ja: "非公開企業が、のれんに関する非公開企業向けの代替的会計処理を選択した。正しいものはどれか。",
      c: [
        "Goodwill is amortized on a straight-line basis over 10 years, or less if a shorter useful life is more appropriate",
        "Goodwill is amortized over a maximum of 40 years",
        "Goodwill is never tested for impairment",
        "Goodwill is written off immediately to retained earnings",
      ],
      a: 0,
      ex: "非公開企業の代替処理では、のれんを10年(より短い耐用年数が適切ならその期間)で定額償却する。減損テストは、トリガー事象が生じた場合に(企業全体または報告単位レベルで)行う。",
    },
    {
      q: "Parent owns 70% of Sub. At acquisition, the fair value of Sub's equipment exceeded its book value by $50,000; the equipment has a 5-year remaining life. Sub reported net income of $200,000 for the year, and there were no intercompany transactions. What is the net income attributable to the noncontrolling interest?",
      ja: "親会社はSub社の70%を保有している。取得時、Sub社の設備の公正価値は簿価を$50,000上回り、残存耐用年数は5年である。当期のSub社の純利益は$200,000で、内部取引はない。非支配持分に帰属する純利益はいくらか。",
      c: ["$60,000", "$57,000", "$54,000", "$63,000"],
      a: 1,
      ex: "公正価値差額の追加償却 = 50,000 ÷ 5 = 10,000。調整後純利益 = 200,000 − 10,000 = 190,000。非支配持分 = 190,000 × 30% = 57,000。",
    },
    {
      q: "Parent owns 80% of Sub. During the year, Sub sold inventory to Parent at a profit, and $30,000 of that profit remains in Parent's ending inventory. Sub reported net income of $250,000. What is the net income attributable to the noncontrolling interest?",
      ja: "親会社はSub社の80%を保有している。当期、Sub社は親会社に利益を付けて商品を販売し、その利益のうち$30,000が親会社の期末在庫に残っている。Sub社の純利益は$250,000である。非支配持分に帰属する純利益はいくらか。",
      c: ["$50,000", "$56,000", "$6,000", "$44,000"],
      a: 3,
      ex: "アップストリーム(子 → 親)の未実現利益は子会社の利益から控除し、親と非支配持分で按分する。(250,000 − 30,000)× 20% = 44,000。",
    },
    {
      q: "On January 1, Parent sold equipment with a carrying amount of $40,000 to its subsidiary for $60,000. The equipment has a remaining life of 5 years with no salvage value. In consolidation at December 31 of that year, the net effect of the elimination entries on consolidated net income is a decrease of:",
      ja: "1月1日、親会社は帳簿価額$40,000の設備を子会社に$60,000で売却した。設備の残存耐用年数は5年で残存価額はない。同年12月31日の連結で、消去仕訳が連結純利益に与える正味の影響(減少額)はいくらか。",
      c: ["$16,000", "$20,000", "$4,000", "$24,000"],
      a: 0,
      ex: "内部売却益20,000を消去し、子会社が計上した超過減価償却 20,000 ÷ 5 = 4,000 を取り消す。正味の減少 = 20,000 − 4,000 = 16,000。",
    },
    {
      q: "Parent owns 80% of Sub. Sub declares and pays cash dividends of $50,000. In the consolidated financial statements:",
      ja: "親会社はSub社の80%を保有している。Sub社は$50,000の現金配当を宣言・支払った。連結財務諸表ではどうなるか。",
      c: [
        "Consolidated dividends include the full $50,000",
        "The $40,000 paid to Parent is eliminated, and the noncontrolling interest is reduced by $10,000",
        "The full $50,000 is eliminated with no effect on the noncontrolling interest",
        "The $10,000 paid to noncontrolling shareholders is reported as an expense",
      ],
      a: 1,
      ex: "親会社への配当40,000は内部取引として消去する。非支配株主への10,000は連結外部への支払いであり、非支配持分を減少させる。連結上の配当は親会社の配当のみ。",
    },
    {
      q: "Which of the following conditions, by itself, would cause a legal entity to be a variable interest entity (VIE)?",
      ja: "次のうち、それだけで法的実体が変動持分事業体(VIE)となる条件はどれか。",
      c: [
        "The entity has more than one class of equity",
        "The entity's equity holders have voting rights proportional to their economic interests",
        "The entity's total equity investment at risk is not sufficient to finance its activities without additional subordinated financial support",
        "The entity is financed partly with long-term bank debt",
      ],
      a: 2,
      ex: "リスクにさらされた資本が、追加の劣後的支援なしに活動を賄うのに不十分であることはVIEの条件の一つ。ほかに、資本保有者の集団として重要な活動を指図する権限がない等がある。銀行借入があること自体はVIEの条件ではない。",
    },
    {
      q: "A company designates a futures contract as a fair value hedge of its inventory. During the period, the futures contract has a gain of $12,000, and the inventory has a loss of $11,000 attributable to the hedged risk. What is the net effect on earnings for the period?",
      ja: "ある会社は先物契約を棚卸資産の公正価値ヘッジとして指定している。当期、先物契約に$12,000の利得、ヘッジ対象のリスクに起因する棚卸資産の損失が$11,000生じた。当期の損益への正味の影響はいくらか。",
      c: ["$1,000 gain", "$12,000 gain", "$11,000 loss", "$0; the gain is deferred in OCI"],
      a: 0,
      ex: "公正価値ヘッジでは、ヘッジ手段の損益とヘッジ対象のヘッジされたリスクに起因する損益の両方を当期損益に計上する。12,000 − 11,000 = 1,000の利得。OCIを使うのはキャッシュ・フロー・ヘッジ。",
    },
    {
      q: "A company has $1,000,000 of variable-rate debt that pays SOFR plus 1%. It enters into an interest rate swap to pay a fixed 5% and receive SOFR on a $1,000,000 notional amount. If SOFR is 3.5% for the year, what is the company's net interest cost for the year?",
      ja: "ある会社は、SOFR+1%を支払う$1,000,000の変動金利借入を有している。同社は想定元本$1,000,000で、固定5%を支払いSOFRを受け取る金利スワップを締結した。当年のSOFRが3.5%の場合、正味の支払利息はいくらか。",
      c: ["$45,000", "$50,000", "$15,000", "$60,000"],
      a: 3,
      ex: "借入利息 = (3.5% + 1%) × 1,000,000 = 45,000。スワップの純支払 = (5% − 3.5%) × 1,000,000 = 15,000。合計60,000 = 固定5% + スプレッド1% = 6%に固定される。",
    },
    {
      q: "A calendar-year company reported pretax income of $150,000 in Q1, when it estimated an annual effective tax rate of 30%. Year-to-date pretax income through Q2 is $400,000, and the revised estimated annual effective tax rate is 25%. What income tax expense should be reported for Q2?",
      ja: "暦年決算の会社は、第1四半期に税引前利益$150,000を計上し、その時点の年間見積実効税率は30%であった。第2四半期までの累計税引前利益は$400,000で、見直し後の年間見積実効税率は25%である。第2四半期に計上すべき法人税等はいくらか。",
      c: ["$62,500", "$55,000", "$75,000", "$100,000"],
      a: 1,
      ex: "期中報告の税金は累計ベースで計算する。累計税金 = 400,000 × 25% = 100,000。第1四半期計上済み 150,000 × 30% = 45,000 を差し引き、第2四半期 = 55,000。四半期単独の250,000 × 25% = 62,500は誤り。",
    },
    {
      q: "A company designates a forward contract as a cash flow hedge of a forecasted inventory purchase. The hedge is fully effective, and a $15,000 gain accumulates in AOCI. When should the gain be reclassified into earnings?",
      ja: "ある会社は、予定された棚卸資産の購入に対するキャッシュ・フロー・ヘッジとして先渡契約を指定した。ヘッジは完全に有効で、AOCIに$15,000の利得が累積した。この利得はいつ損益に振り替えるか。",
      c: [
        "When the forward contract is settled",
        "When the inventory is purchased",
        "Immediately at each reporting date",
        "When the purchased inventory affects earnings, i.e., when it is sold and cost of goods sold is recognized",
      ],
      a: 3,
      ex: "キャッシュ・フロー・ヘッジのAOCI累積額は、ヘッジ対象の予定取引が損益に影響する期に、同じ損益項目(この場合は売上原価)へ振り替える。棚卸資産が販売された時点である。",
    },
    {
      q: "On November 15, a U.S. company purchased inventory on account from a German supplier for €100,000, payable in euros on January 15. The spot rate was $1.10 per euro on November 15 and $1.14 per euro on December 31. What should the company report in its December 31 income statement?",
      ja: "11月15日、米国企業はドイツの仕入先から€100,000の商品を掛けで購入し、1月15日にユーロで支払う。直物レートは11月15日に1ユーロ=$1.10、12月31日に$1.14であった。12月31日の損益計算書に何を計上すべきか。",
      c: ["A $4,000 foreign currency transaction gain", "No gain or loss until settlement", "A $4,000 foreign currency transaction loss", "A $4,000 translation adjustment in OCI"],
      a: 2,
      ex: "外貨建買掛金は期末レートで換算替えする。100,000 × (1.14 − 1.10) = 4,000 の負債増加 → 為替差損4,000を当期損益に計上。外貨建取引の差損益はOCIではない。",
    },
    {
      q: "A foreign subsidiary keeps its books in its local currency, but its functional currency is the U.S. dollar. When its financial statements are remeasured into U.S. dollars, which of the following accounts is remeasured at the historical exchange rate?",
      ja: "在外子会社は現地通貨で帳簿を記録しているが、機能通貨は米ドルである。財務諸表を米ドルに再測定する際、取得時(歴史的)レートで再測定する勘定はどれか。",
      c: ["Accounts receivable", "Property, plant, and equipment", "Accounts payable", "Cash"],
      a: 1,
      ex: "再測定(テンポラル法)では、貨幣性項目(現金・債権・債務)は期末レート、非貨幣性項目(有形固定資産・原価評価の棚卸資産等)は歴史的レート。再測定差額は当期損益に計上する。",
    },
    {
      q: "A foreign subsidiary whose functional currency is its local currency (LC) reported revenue of LC 1,000,000 earned evenly during the year. The average exchange rate for the year was $0.80 per LC, and the year-end rate was $0.85. At what amount should revenue be reported in the consolidated income statement?",
      ja: "機能通貨が現地通貨(LC)である在外子会社は、年間を通じて均等に稼得した収益LC 1,000,000を計上した。年間平均レートは1LC=$0.80、期末レートは$0.85であった。連結損益計算書に計上する収益はいくらか。",
      c: ["$850,000", "$1,000,000", "$825,000", "$800,000"],
      a: 3,
      ex: "換算(カレントレート法)では、収益・費用は取引日レート(均等発生なら期中平均レートで近似)で換算する。1,000,000 × 0.80 = 800,000。資産・負債は期末レート、換算差額はOCI。",
    },
    {
      q: "On January 1, Year 1, a company granted 12,000 stock options with a grant-date fair value of $10 each that cliff-vest after 3 years. The company elected to estimate forfeitures and initially expected 10% to be forfeited. In Year 2, it revised the estimate to 15%. What compensation expense should be recognized in Year 2?",
      ja: "1年目1月1日、ある会社は付与日の公正価値1個$10のストック・オプション12,000個を付与した。権利確定は3年後の一括確定である。会社は失効を見積もる方針を選択し、当初は10%の失効を見込んでいたが、2年目に15%へ見直した。2年目に認識すべき報酬費用はいくらか。",
      c: ["$34,000", "$36,000", "$32,000", "$40,000"],
      a: 2,
      ex: "1年目 = 12,000 × 90% × 10 × 1/3 = 36,000。2年目末累計 = 12,000 × 85% × 10 × 2/3 = 68,000。2年目 = 68,000 − 36,000 = 32,000(見積変更の影響は累計キャッチアップで当期に反映)。",
    },
    {
      q: "A company granted 1,000 cash-settled stock appreciation rights that vest after 2 years of service. The fair value of each SAR was $8 at the end of Year 1 and $11 at the end of Year 2. What compensation expense should be recognized in Year 2?",
      ja: "ある会社は、2年の勤務で権利確定する現金決済型の株式増価受益権(SAR)1,000個を付与した。SAR 1個の公正価値は1年目末$8、2年目末$11であった。2年目に認識すべき報酬費用はいくらか。",
      c: ["$7,000", "$11,000", "$5,500", "$3,000"],
      a: 0,
      ex: "負債分類のSARは各期末の公正価値で再測定する。1年目 = 1,000 × 8 × 1/2 = 4,000。2年目末累計 = 1,000 × 11 × 2/2 = 11,000。2年目 = 11,000 − 4,000 = 7,000。",
    },
    {
      q: "A manufacturer leases equipment to a customer in a lease classified as a sales-type lease. The equipment's carrying amount is $80,000, and its fair value is $100,000, which equals the present value of the lease payments (no residual value). What selling profit should the lessor recognize at lease commencement?",
      ja: "製造業者が顧客に設備をリースし、販売型リースに分類された。設備の帳簿価額は$80,000、公正価値は$100,000で、リース料の現在価値と等しい(残存価値なし)。リース開始日に貸手が認識すべき販売利益はいくらか。",
      c: ["$0; selling profit is deferred over the lease term", "$100,000", "$20,000", "$8,000"],
      a: 2,
      ex: "販売型リースでは、開始日に原資産の認識を中止して正味リース投資を計上し、販売利益 = 100,000 − 80,000 = 20,000 を認識する。直接金融リースでは販売利益は繰り延べられ正味投資に含まれる。",
    },
    {
      q: "A public company has five operating segments with total revenues (including intersegment revenues) as follows: A $400, B $90, C $300, D $110, and E $100 (in millions). Under the revenue test, which segments are reportable?",
      ja: "公開企業には5つの事業セグメントがあり、売上高(セグメント間売上を含む)はA $400、B $90、C $300、D $110、E $100(百万ドル)である。売上高テストにより報告セグメントとなるのはどれか。",
      c: ["A and C only", "A, C, D, and E", "A, C, and D only", "All five segments"],
      a: 1,
      ex: "合計1,000の10%(100)以上の売上高のセグメントが報告対象。A・C・D・Eが該当し、Bは90で該当しない。報告セグメントの外部売上高が全体の75%以上という要件も確認する。現行基準では重要なセグメント費用(CODMに定期的に提供されるもの)の開示も求められる。",
    },
  ],
});

CPA.extend("BAR-03", {
  mcq: [
    {
      q: "A city's governmental funds reported a net change in fund balances of $500,000. During the year, capital outlay expenditures were $800,000, depreciation expense was $300,000, general obligation bonds of $1,000,000 were issued, and bond principal payments were $200,000. What is the change in net position of governmental activities?",
      ja: "市の政府資金の基金残高の純増減は$500,000であった。当年度、資本的支出は$800,000、減価償却費は$300,000、一般財源保証債$1,000,000を発行し、債券元本の返済は$200,000であった。政府活動の純資産の増減はいくらか。",
      c: ["$1,800,000", "$200,000", "$1,000,000", "$(800,000)"],
      a: 1,
      ex: "500,000 + 資本的支出800,000 − 減価償却300,000 − 債券発行収入1,000,000 + 元本返済200,000 = 200,000。発行収入は政府全体では負債であり、元本返済は負債の減少で費用ではない。",
    },
    {
      q: "Total fund balances of a county's governmental funds are $2,000,000. Capital assets (net of accumulated depreciation) used in governmental activities are $6,000,000; bonds payable are $3,500,000; property taxes reported as deferred inflows (unavailable revenue) in the funds are $150,000; and the internal service fund, which primarily serves governmental departments, has net position of $100,000. What is net position of governmental activities?",
      ja: "郡の政府資金の基金残高合計は$2,000,000である。政府活動で使用する資本資産(減価償却累計額控除後)は$6,000,000、債券は$3,500,000、基金で繰延資金流入(未入手可能収益)とされた固定資産税は$150,000、主に政府部門にサービスを提供する内部サービス基金の純資産は$100,000である。政府活動の純資産はいくらか。",
      c: ["$4,450,000", "$4,500,000", "$4,750,000", "$11,750,000"],
      a: 2,
      ex: "2,000,000 + 資本資産6,000,000 − 債券3,500,000 + 未入手可能収益150,000(発生主義では収益)+ 内部サービス基金100,000 = 4,750,000。",
    },
    {
      q: "In the government-wide financial statements, the assets and liabilities of an internal service fund that predominantly serves governmental departments are generally reported in:",
      ja: "政府全体の財務諸表で、主に政府部門にサービスを提供する内部サービス基金の資産・負債は、一般にどこに報告されるか。",
      c: ["Business-type activities", "A separate fiduciary column", "Governmental activities", "Discretely presented component units"],
      a: 2,
      ex: "内部サービス基金はファンド財務諸表では proprietary fund だが、政府全体では主な利用者が政府部門なら governmental activities に含める(内部取引は消去)。",
    },
    {
      q: "Under GASB standards, an activity must be reported as an enterprise fund if:",
      ja: "GASB基準のもとで、ある活動を企業基金として報告しなければならないのはどのような場合か。",
      c: [
        "The activity is financed with debt secured solely by a pledge of the net revenues from fees and charges of the activity",
        "The activity provides services primarily to other departments of the government",
        "The activity receives any amount of fees from external users",
        "The activity is financed primarily by property taxes",
      ],
      a: 0,
      ex: "手数料収入の純額のみを担保とする債務(レベニュー債)で資金調達している場合、法令で費用を手数料で回収することが求められる場合、料金設定方針が費用回収を目的とする場合は企業基金が必須。政府内部向けなら内部サービス基金。",
    },
    {
      q: "A county collects property taxes on behalf of several school districts and remits them monthly. The arrangement is not administered through a trust agreement. In which fund should the county report these resources?",
      ja: "郡は複数の学区のために固定資産税を徴収し、毎月送金している。この取り決めは信託契約を通じて管理されていない。郡はこの資源をどの基金で報告すべきか。",
      c: ["Private-purpose trust fund", "Special revenue fund", "Investment trust fund", "Custodial fund"],
      a: 3,
      ex: "GASB 84 では、他者のために保有し信託契約で管理されていない受託資源は custodial fund(管理基金)に報告する。信託契約があれば private-purpose trust fund 等となる。",
    },
    {
      q: "Fiduciary activities of a state or local government are reported:",
      ja: "州・地方政府の受託活動は、どこに報告されるか。",
      c: [
        "In both the government-wide statements and the fund financial statements",
        "Only in the fund financial statements, using the economic resources measurement focus and accrual basis",
        "Only in the government-wide statements, as business-type activities",
        "Only in the notes to the financial statements",
      ],
      a: 1,
      ex: "受託基金の資源は政府自身の活動に使えないため、政府全体の財務諸表からは除外され、ファンド財務諸表(受託純資産計算書・受託純資産変動計算書)にのみ経済資源・発生主義で報告される。",
    },
    {
      q: "Under GASB Statement No. 87, a city's general fund enters into a 5-year equipment lease as lessee. The lease liability at commencement is $250,000. How should the general fund report the lease at commencement?",
      ja: "GASB第87号のもとで、市の一般基金が借手として5年間の設備リースを締結した。開始日のリース負債は$250,000である。一般基金は開始日にこのリースをどのように報告するか。",
      c: [
        "A lease asset and a lease liability of $250,000 each",
        "No entry until the first payment is made",
        "A capital outlay expenditure and an other financing source of $250,000 each",
        "Rent expenditure of $250,000",
      ],
      a: 2,
      ex: "政府資金(修正発生主義)では、リース開始時に資本的支出(expenditure)とその他の財源(other financing source)を同額計上する。リース資産・リース負債は政府全体の財務諸表に計上する。",
    },
    {
      q: "Under GASB Statement No. 87, at the commencement of a lease that is not short-term, a governmental lessor should:",
      ja: "GASB第87号のもとで、短期リースではないリースの開始時に、政府の貸手は何を行うべきか。",
      c: [
        "Recognize a lease receivable and a deferred inflow of resources, and continue to report the underlying asset",
        "Derecognize the underlying asset and recognize a gain",
        "Recognize lease revenue for the total of all lease payments",
        "Recognize a lease receivable and unearned revenue (a liability), and derecognize the underlying asset",
      ],
      a: 0,
      ex: "GASB 87の貸手は、リース債権と繰延資金流入(deferred inflow of resources)を計上し、原資産は引き続き計上して償却する。繰延資金流入はリース期間にわたり規則的に収益認識する。",
    },
    {
      q: "Under GASB Statement No. 87, a short-term lease is one whose maximum possible term under the contract, including any options to extend, is:",
      ja: "GASB第87号のもとで、短期リースとは、延長オプションを含めた契約上の最長可能期間がどのようなものをいうか。",
      c: ["12 months or less", "24 months or less", "5 years or less", "Less than 75% of the asset's economic life"],
      a: 0,
      ex: "短期リースは、延長オプションを含む最長可能期間が12か月以内のもの。短期リースは資産・負債を計上せず、支払(受取)を期間に応じて費用(収益)とする。",
    },
    {
      q: "Under GASB Statement No. 96, a government entered into a subscription-based IT arrangement (SBITA). The initial subscription liability is $180,000. The government also paid $20,000 to the vendor at commencement, incurred $8,000 in preliminary project stage costs, $15,000 in initial implementation stage costs, and $5,000 for training during the operation stage. What is the initial subscription asset?",
      ja: "GASB第96号のもとで、政府はサブスクリプション型IT契約(SBITA)を締結した。当初のサブスクリプション負債は$180,000である。さらに、開始時にベンダーへ$20,000を支払い、予備的プロジェクト段階の費用$8,000、初期導入段階の費用$15,000、運用段階の研修費$5,000が生じた。当初のサブスクリプション資産はいくらか。",
      c: ["$180,000", "$228,000", "$200,000", "$215,000"],
      a: 3,
      ex: "サブスクリプション資産 = 負債180,000 + 開始時までの支払20,000 + 初期導入段階の費用15,000 = 215,000。予備的プロジェクト段階と運用・追加導入段階(研修など)の費用は発生時に費用処理する。",
    },
    {
      q: "A government uses the modified approach for its eligible road network. During the year, it spent $2,000,000 on maintaining and preserving existing roads at the established condition level and $3,000,000 to add new lanes that increase capacity. How much should be expensed in the government-wide statement of activities?",
      ja: "政府は適格な道路網に修正アプローチを採用している。当年度、既存道路を設定した状態水準に維持・保全するために$2,000,000、容量を増やす車線の増設に$3,000,000を支出した。政府全体の活動計算書で費用計上すべき額はいくらか。",
      c: ["$0", "$2,000,000", "$3,000,000", "$5,000,000"],
      a: 1,
      ex: "修正アプローチでは減価償却を行わず、維持・保全の支出(2,000,000)は費用処理する。容量や効率を高める追加・改良(3,000,000)は資本化する。",
    },
    {
      q: "A citizen donated land to a city. The donor's original cost was $100,000, the land's acquisition value (the price that would be paid to acquire it) at the donation date was $400,000, and its assessed value for property tax purposes was $320,000. At what amount should the land be reported in the government-wide statement of net position?",
      ja: "市民が市に土地を寄贈した。寄贈者の取得原価は$100,000、寄贈日の取得価値(取得するために支払うであろう価格)は$400,000、固定資産税の評価額は$320,000であった。政府全体の純資産計算書で土地をいくらで報告すべきか。",
      c: ["$100,000", "$320,000", "$400,000", "$0"],
      a: 2,
      ex: "寄贈された資本資産は、GASB 72 により取得価値(acquisition value、入口価格)で計上する。400,000。政府資金では資本資産を計上しない。",
    },
    {
      q: "A city sold land used in governmental activities for $150,000 in cash. The land had a carrying amount of $120,000. In reconciling the net change in governmental fund balances to the change in net position of governmental activities, the sale requires:",
      ja: "市は政府活動で使用していた土地を現金$150,000で売却した。土地の帳簿価額は$120,000であった。政府資金の基金残高の純増減から政府活動の純資産の増減への調整で、この売却はどのような調整を要するか。",
      c: ["A deduction of $150,000", "A deduction of $120,000", "An addition of $30,000", "No adjustment"],
      a: 1,
      ex: "政府資金は売却収入150,000をその他の財源として計上する。政府全体では売却益30,000のみが収益となるため、差額である土地の帳簿価額120,000を控除する。",
    },
    {
      q: "A state's single-employer pension plan reports a total pension liability of $10,000,000 and plan fiduciary net position of $7,600,000. Under GASB Statement No. 68, what amount should the employer report as its net pension liability?",
      ja: "州の単一事業主年金制度の総年金負債は$10,000,000、年金制度の受託純資産は$7,600,000である。GASB第68号のもとで、事業主が報告すべき純年金負債はいくらか。",
      c: ["$2,400,000", "$10,000,000", "$7,600,000", "$17,600,000"],
      a: 0,
      ex: "純年金負債 = 総年金負債 − 制度の受託純資産 = 10,000,000 − 7,600,000 = 2,400,000。政府全体の財務諸表(および proprietary fund)に計上する。",
    },
    {
      q: "Under GASB Statement No. 68, projected earnings on pension plan investments were $500,000, and actual earnings were $300,000. How much of this difference is included in the current year's pension expense?",
      ja: "GASB第68号のもとで、年金制度の投資の予想運用収益は$500,000、実際の運用収益は$300,000であった。この差額のうち、当年度の年金費用に含まれる額はいくらか。",
      c: ["$200,000", "$0", "$33,333", "$40,000"],
      a: 3,
      ex: "予想と実際の運用収益の差額(200,000の不足)は繰延資金流出として、5年間の閉鎖期間で規則的に償却する。当年度の年金費用に含まれるのは 200,000 ÷ 5 = 40,000。",
    },
    {
      q: "A city's general fund paid $850,000 in pension contributions during the year, and no contributions were due and unpaid at year-end. Pension expense computed under GASB Statement No. 68 for the governmental activities was $1,200,000. What amount of pension expenditure should the general fund report?",
      ja: "市の一般基金は当年度に年金拠出金$850,000を支払い、期末に未払の拠出金はない。GASB第68号に基づく政府活動の年金費用は$1,200,000であった。一般基金が報告すべき年金支出はいくらか。",
      c: ["$1,200,000", "$850,000", "$350,000", "$2,050,000"],
      a: 1,
      ex: "政府資金(修正発生主義)では、拠出として支払った額と、利用可能な支出可能財源で決済されると通常見込まれる額の変動の合計を支出とする。本問では850,000。1,200,000は政府全体の発生主義の費用。",
    },
    {
      q: "A government provides other postemployment benefits (OPEB) through a plan that is not administered through a trust meeting GASB criteria. In its government-wide statements, the government should report:",
      ja: "政府はGASBの要件を満たす信託を通じて管理されていない制度で退職後給付(OPEB)を提供している。政府全体の財務諸表で何を報告すべきか。",
      c: [
        "No liability, because OPEB is recognized on a pay-as-you-go basis",
        "A net OPEB liability equal to total OPEB liability less assets set aside in the general fund",
        "The total OPEB liability, because no plan assets may be offset",
        "Only a note disclosure of the actuarial accrued liability",
      ],
      a: 2,
      ex: "GASB 75 では、要件を満たす信託がない場合、資産を相殺できないため総OPEB負債(total OPEB liability)を計上する。信託がある場合は受託純資産を控除した純OPEB負債を計上する。",
    },
    {
      q: "Under GASB Statement No. 91, a city issues conduit debt to finance a private hospital's construction project. The city has made no additional commitment to support debt service. How should the city report the conduit debt?",
      ja: "GASB第91号のもとで、市は民間病院の建設資金のために導管債(conduit debt)を発行した。市は債務の元利払いを支援する追加的なコミットメントを行っていない。市は導管債をどのように報告すべきか。",
      c: [
        "As a liability in the government-wide statements and in the general fund",
        "As a liability in the government-wide statements only",
        "As a liability only if the hospital's credit rating is below investment grade",
        "Not as a liability; the city discloses information about its conduit debt obligations in the notes",
      ],
      a: 3,
      ex: "導管債の発行者は負債を認識しない(債務者は第三者)。追加的コミットメントを行い、支援する可能性が高い(more likely than not)場合のみ負債を認識する。注記で開示する。",
    },
    {
      q: "Which of the following is NOT required supplementary information (RSI) for a state or local government?",
      ja: "州・地方政府の必須補足情報(RSI)に該当しないものはどれか。",
      c: [
        "Management's discussion and analysis",
        "Ten-year schedules of changes in the net pension liability",
        "Ten-year trend information on property tax revenue capacity",
        "A budgetary comparison schedule for the general fund (when not presented as a basic statement)",
      ],
      a: 2,
      ex: "MD&A、年金・OPEBの10年スケジュール、一般基金等の予算比較スケジュール、修正アプローチのインフラ情報はRSI。収入能力の10年趨勢などはACFRの統計セクションの情報で、RSIではない。",
    },
    {
      q: "The statistical section of an ACFR includes all of the following categories EXCEPT:",
      ja: "ACFRの統計セクションに含まれないカテゴリーはどれか。",
      c: ["Debt capacity information", "Demographic and economic information", "Revenue capacity information", "Combining statements for nonmajor funds"],
      a: 3,
      ex: "統計セクションは財政状態の趨勢、収入能力、債務能力、人口・経済情報、運営情報の5区分。非主要基金の結合計算書は財務セクションに含まれる。",
    },
    {
      q: "A special revenue fund reported revenues of $1,200,000. Total revenues were $10,000,000 for all governmental funds and $30,000,000 for all governmental and enterprise funds combined. The fund does not meet the criteria on any other element. Which statement is correct?",
      ja: "特別収入基金の収入は$1,200,000である。収入合計は全政府資金で$10,000,000、政府資金と企業基金の合計で$30,000,000である。他の要素ではいずれも基準を満たしていない。正しいものはどれか。",
      c: [
        "The fund must be reported as a major fund because revenues exceed 10% of governmental fund revenues",
        "The fund is not required to be reported as a major fund, although the government may elect to do so",
        "The fund must be reported as a major fund because it is a special revenue fund",
        "The fund cannot be reported as a major fund",
      ],
      a: 1,
      ex: "主要基金の判定:同一要素で政府資金合計の10%以上(1.2 ÷ 10 = 12%)かつ政府資金+企業基金合計の5%以上(1.2 ÷ 30 = 4%)が必要。後者を満たさないため強制ではない。ただし重要と判断すれば主要基金として表示できる。一般基金は常に主要基金。",
    },
    {
      q: "An enterprise fund reported the following cash flows: received from customers $900,000; paid to suppliers $400,000; paid to employees $300,000; interest paid on revenue bonds issued to construct capital assets $50,000; interest received on investments $20,000; and an operating grant received from the state $60,000. What is net cash provided by operating activities?",
      ja: "企業基金のキャッシュ・フローは次のとおり。顧客からの受取$900,000、仕入先への支払$400,000、従業員への支払$300,000、資本資産建設のためのレベニュー債の利息支払$50,000、投資の受取利息$20,000、州からの運営補助金の受取$60,000。営業活動による正味キャッシュ・フローはいくらか。",
      c: ["$170,000", "$260,000", "$200,000", "$230,000"],
      a: 2,
      ex: "営業活動 = 900,000 − 400,000 − 300,000 = 200,000。GASBでは、資本関連の利息支払は資本・関連財務活動、受取利息は投資活動、運営補助金は非資本財務活動に分類する(FASBと異なる)。",
    },
  ],
});

CPA.tbs({
  id: "TBS-BAR-04",
  section: "BAR",
  chapter: "BAR-01",
  title: "製造間接費の差異分析",
  scenario: `<p>Kondo Co. applies manufacturing overhead on the basis of direct labor hours (DLH). The standard is <b>2 DLH</b> per unit. The variable overhead rate is <b>$6</b> per DLH. Budgeted fixed overhead is <b>$180,000</b>, based on a denominator level of <b>30,000 DLH</b>.</p>
<p>During the year, Kondo produced <b>14,000</b> units and used <b>29,000</b> actual DLH. Actual variable overhead was <b>$178,000</b>, and actual fixed overhead was <b>$184,000</b>.</p>
<p class="ja">Kondo社は直接作業時間(DLH)を基準に製造間接費を配賦している。標準は1個あたり2DLH。変動製造間接費率は1DLHあたり$6。固定製造間接費の予算は$180,000で、基準操業度は30,000DLH。当年度、14,000個を生産し、実際作業時間は29,000DLHであった。実際の変動製造間接費は$178,000、固定製造間接費は$184,000であった。差異は金額のみ(正の数)で答えること。</p>`,
  rows: [
    { label: "Variable overhead spending variance (amount)(変動製造間接費の予算差異)", type: "num", answer: 4000 },
    { label: "Variable overhead efficiency variance (amount)(変動製造間接費の能率差異)", type: "num", answer: 6000 },
    { label: "Fixed overhead applied to production(固定製造間接費の配賦額)", type: "num", answer: 168000 },
    { label: "Fixed overhead spending (budget) variance (amount)(固定製造間接費の予算差異)", type: "num", answer: 4000 },
    { label: "Fixed overhead production-volume variance (amount)(固定製造間接費の操業度差異)", type: "num", answer: 12000 },
    { label: "Production-volume variance: F or U", type: "select", options: ["Favorable", "Unfavorable"], answer: "Unfavorable" },
  ],
  explain: `<p>標準時間 = 14,000 × 2 = 28,000DLH。固定費率 = 180,000 ÷ 30,000 = 6/DLH。</p>
<p>変動費の予算差異 = 178,000 − 29,000 × 6(174,000)= 4,000 不利。能率差異 = (29,000 − 28,000)× 6 = 6,000 不利。</p>
<p>固定費の配賦額 = 28,000 × 6 = 168,000。予算差異 = 184,000 − 180,000 = 4,000 不利。操業度差異 = 180,000 − 168,000 = 12,000 不利(基準操業度を下回ったため固定費が配賦不足)。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-05",
  section: "BAR",
  chapter: "BAR-01",
  title: "税効果を考慮したNPV",
  scenario: `<p>Matsuda Co. is evaluating new equipment costing <b>$300,000</b>. The equipment has a <b>5-year</b> life and will be depreciated straight-line to zero for tax purposes. It is expected to be sold for <b>$20,000</b> at the end of Year 5. The project requires an additional investment in working capital of <b>$30,000</b> at the start, which will be fully recovered at the end of Year 5.</p>
<p>The equipment will increase annual pretax cash revenues net of cash expenses by <b>$100,000</b>. The income tax rate is <b>25%</b>, and the cost of capital is <b>10%</b>. Present value of an ordinary annuity of $1 for 5 periods at 10% = <b>3.791</b>; present value of $1 in 5 periods at 10% = <b>0.621</b>.</p>
<p class="ja">Matsuda社は$300,000の新設備を検討している。耐用年数5年で、税務上は定額法で残存価額ゼロまで償却する。5年目末に$20,000で売却する見込み。開始時に運転資本$30,000の追加投資が必要で、5年目末に全額回収される。設備により年間の税引前の現金収入(現金費用控除後)は$100,000増加する。税率25%、資本コスト10%。10%・5期の年金現価係数3.791、10%・5期の現価係数0.621。</p>`,
  rows: [
    { label: "Initial cash outflow, including working capital(運転資本を含む当初キャッシュアウトフロー)", type: "num", answer: 330000 },
    { label: "Annual depreciation tax shield(年間の減価償却タックスシールド)", type: "num", answer: 15000 },
    { label: "Annual after-tax cash flow, Years 1–5(1〜5年目の年間税引後キャッシュフロー)", type: "num", answer: 90000 },
    { label: "After-tax terminal cash flow at end of Year 5 (salvage + working capital)(5年目末の税引後終了時CF:売却+運転資本)", type: "num", answer: 45000 },
    { label: "Net present value(正味現在価値)", type: "num", answer: 39135, tol: 1 },
    { label: "Decision based on NPV(NPVに基づく判断)", type: "select", options: ["Accept", "Reject"], answer: "Accept" },
  ],
  explain: `<p>当初CF = 300,000 + 運転資本30,000 = 330,000。減価償却 = 300,000 ÷ 5 = 60,000、タックスシールド = 60,000 × 25% = 15,000。</p>
<p>年間CF = 100,000 × (1 − 0.25) + 15,000 = 75,000 + 15,000 = 90,000。</p>
<p>税務上の簿価はゼロなので売却益20,000に課税 → 税引後 20,000 × 0.75 = 15,000。終了時CF = 15,000 + 運転資本回収30,000 = 45,000。</p>
<p>NPV = 90,000 × 3.791 + 45,000 × 0.621 − 330,000 = 341,190 + 27,945 − 330,000 = 39,135 > 0 → 採用。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-06",
  section: "BAR",
  chapter: "BAR-02",
  title: "取得日ののれんと非支配持分",
  scenario: `<p>On July 1, Okada Corp. acquired <b>75%</b> of the outstanding common stock of Sato Inc. Okada paid <b>$1,500,000</b> in cash and agreed to pay contingent consideration with an acquisition-date fair value of <b>$60,000</b>. Okada also incurred <b>$30,000</b> of legal and advisory fees. The fair value of the noncontrolling interest was <b>$480,000</b>.</p>
<p>The book value of Sato's net assets was <b>$1,400,000</b>. Fair values differed from book values as follows: inventory <b>+$40,000</b>; building <b>+$200,000</b>. Sato also had an unrecorded customer list that meets the contractual-legal or separability criterion, with a fair value of <b>$100,000</b>. Ignore income taxes.</p>
<p class="ja">7月1日、Okada社はSato社の発行済普通株式の75%を取得した。Okada社は現金$1,500,000を支払い、取得日の公正価値$60,000の条件付対価の支払に合意した。また法務・アドバイザリー費用$30,000が発生した。非支配持分の公正価値は$480,000。Sato社の純資産の簿価は$1,400,000で、公正価値との差額は棚卸資産+$40,000、建物+$200,000。さらに、契約法律規準または分離可能性規準を満たす未計上の顧客リスト(公正価値$100,000)がある。税効果は無視する。</p>`,
  rows: [
    { label: "Consideration transferred(移転された対価)", type: "num", answer: 1560000 },
    { label: "Fair value of identifiable net assets acquired(取得した識別可能純資産の公正価値)", type: "num", answer: 1740000 },
    { label: "Total goodwill(のれん総額)", type: "num", answer: 300000 },
    { label: "Goodwill attributable to the noncontrolling interest(非支配持分に帰属するのれん)", type: "num", answer: 45000 },
    { label: "Noncontrolling interest reported at acquisition date(取得日に計上する非支配持分)", type: "num", answer: 480000 },
    { label: "Treatment of the $30,000 legal and advisory fees($30,000の法務・アドバイザリー費用の処理)", type: "select", options: ["Expensed as incurred", "Added to goodwill", "Charged against additional paid-in capital"], answer: "Expensed as incurred" },
  ],
  explain: `<p>対価 = 現金1,500,000 + 条件付対価の公正価値60,000 = 1,560,000(取得関連費用は含めない)。</p>
<p>識別可能純資産 = 1,400,000 + 40,000 + 200,000 + 顧客リスト100,000 = 1,740,000。</p>
<p>のれん = 1,560,000 + 480,000 − 1,740,000 = 300,000。非支配持分ののれん = 480,000 − 1,740,000 × 25%(435,000)= 45,000(親会社分は 1,560,000 − 1,305,000 = 255,000)。</p>
<p>非支配持分は公正価値480,000で計上。取得関連費用は発生時に費用処理する(株式発行費用であれば資本から控除)。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-07",
  section: "BAR",
  chapter: "BAR-02",
  title: "取得後1年目の連結と非支配持分",
  scenario: `<p>On January 1, Year 1, Ueda Co. acquired <b>90%</b> of Mori Co. for <b>$900,000</b>. The fair value of the noncontrolling interest was <b>$100,000</b>. Mori's stockholders' equity consisted of common stock of <b>$200,000</b> and retained earnings of <b>$600,000</b>. The fair value of Mori's identifiable net assets exceeded book value only for equipment, by <b>$100,000</b>, which has a <b>5-year</b> remaining life (straight-line).</p>
<p>During Year 1, Mori reported net income of <b>$150,000</b> and paid dividends of <b>$50,000</b>. Mori also sold inventory to Ueda at a markup; <b>$20,000</b> of intercompany profit remained in Ueda's ending inventory at December 31, Year 1.</p>
<p class="ja">1年目1月1日、Ueda社はMori社の90%を$900,000で取得した。非支配持分の公正価値は$100,000。Mori社の株主資本は資本金$200,000、利益剰余金$600,000。識別可能純資産の公正価値が簿価を上回るのは設備のみで$100,000(残存耐用年数5年、定額法)。1年目、Mori社の純利益は$150,000、配当は$50,000。またMori社はUeda社に利益を付けて商品を販売し、1年目末のUeda社の期末在庫に内部利益$20,000が残っている。</p>`,
  rows: [
    { label: "Goodwill at acquisition(取得時ののれん)", type: "num", answer: 100000 },
    { label: "Excess depreciation on equipment, Year 1(1年目の設備の追加減価償却)", type: "num", answer: 20000 },
    { label: "Net income attributable to NCI, Year 1(1年目の非支配持分に帰属する純利益)", type: "num", answer: 11000 },
    { label: "NCI balance, Dec 31, Year 1(1年目末の非支配持分残高)", type: "num", answer: 106000 },
    { label: "Unamortized equipment fair value adjustment, Dec 31, Year 1(1年目末の設備の公正価値差額の未償却残高)", type: "num", answer: 80000 },
    { label: "The unrealized inventory profit is allocated to(未実現利益の負担)", type: "select", options: ["Parent only", "Parent and NCI proportionately", "NCI only"], answer: "Parent and NCI proportionately" },
  ],
  explain: `<p>のれん = 900,000 + 100,000 − (800,000 + 100,000) = 100,000。追加減価償却 = 100,000 ÷ 5 = 20,000、期末未償却 80,000。</p>
<p>アップストリーム(子 → 親)の未実現利益は親と非支配持分で按分する。調整後純利益 = 150,000 − 20,000 − 20,000 = 110,000 → 非支配持分 = 110,000 × 10% = 11,000。</p>
<p>非支配持分残高 = 100,000 + 11,000 − 配当 50,000 × 10%(5,000)= 106,000。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-08",
  section: "BAR",
  chapter: "BAR-03",
  title: "政府資金から政府全体への調整",
  scenario: `<p>The City of Hayama reported a net change in fund balances of <b>$350,000</b> for its governmental funds. The following information relates to the year:</p>
<ul>
<li>Capital outlay expenditures: <b>$1,200,000</b>; depreciation expense on governmental capital assets: <b>$450,000</b></li>
<li>Land with a carrying amount of <b>$80,000</b> was sold for <b>$100,000</b>; the proceeds were reported as an other financing source</li>
<li>General obligation bond proceeds: <b>$1,000,000</b>; bond principal repayments: <b>$600,000</b></li>
<li>Property taxes reported as deferred inflows (unavailable revenue) in the funds increased by <b>$70,000</b></li>
<li>The liability for compensated absences (not payable from current financial resources) increased by <b>$40,000</b></li>
<li>The change in net position of the internal service fund, which serves governmental departments, was <b>$25,000</b></li>
</ul>
<p class="ja">Hayama市の政府資金の基金残高の純増減は$350,000であった。当年度の情報:資本的支出$1,200,000、政府の資本資産の減価償却費$450,000。帳簿価額$80,000の土地を$100,000で売却し、収入はその他の財源として計上。一般財源保証債の発行収入$1,000,000、元本返済$600,000。基金で繰延資金流入(未入手可能収益)とした固定資産税が$70,000増加。有給休暇負債(当期の財源から支払われないもの)が$40,000増加。政府部門向け内部サービス基金の純資産増減は$25,000。調整額は金額のみ(正の数)で答えること。</p>`,
  rows: [
    { label: "Amount by which capital outlay exceeds depreciation (adjustment)(資本的支出が減価償却費を上回る額)", type: "num", answer: 750000 },
    { label: "Adjustment for the land sale (amount)(土地売却の調整額)", type: "num", answer: 80000 },
    { label: "Net adjustment for bond proceeds less principal repayments (amount)(債券発行収入と元本返済の純調整額)", type: "num", answer: 400000 },
    { label: "Increase in unavailable property tax revenue: add or deduct(未入手可能収益の増加:加算か減算か)", type: "select", options: ["Add", "Deduct", "No adjustment"], answer: "Add" },
    { label: "Increase in compensated absences liability: add or deduct(有給休暇負債の増加:加算か減算か)", type: "select", options: ["Add", "Deduct", "No adjustment"], answer: "Deduct" },
    { label: "Change in net position of governmental activities(政府活動の純資産の増減)", type: "num", answer: 675000 },
  ],
  explain: `<p>資本的支出 − 減価償却 = 1,200,000 − 450,000 = 750,000 を加算。土地売却:政府全体では売却益20,000のみなので、収入100,000との差額=帳簿価額80,000を減算。</p>
<p>債券:発行収入は負債の増加なので1,000,000を減算、元本返済は負債の減少なので600,000を加算 → 純額400,000を減算。</p>
<p>未入手可能収益の増加70,000は発生主義では収益なので加算。有給休暇負債の増加40,000は政府全体の費用なので減算。内部サービス基金25,000を加算。</p>
<p>350,000 + 750,000 − 80,000 − 400,000 + 70,000 − 40,000 + 25,000 = 675,000。</p>`,
});
