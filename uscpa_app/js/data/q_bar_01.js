// BAR の追加問題(財務諸表分析・データ分析・KPI・予測・経済学)

CPA.extend("BAR-01", {
  mcq: [
    {
      q: "A company has current assets of $400,000 and current liabilities of $200,000. It then pays $50,000 of accounts payable with cash. What is the company's current ratio immediately after the payment?",
      ja: "ある会社の流動資産は$400,000、流動負債は$200,000である。その後、買掛金$50,000を現金で支払った。支払直後の流動比率はいくらか。",
      c: ["2.00", "2.33", "1.75", "2.50"],
      a: 1,
      ex: "支払後の流動資産 350,000 ÷ 流動負債 150,000 = 2.33。流動比率が1を超える場合、分子と分母を同額減らすと比率は上昇する。1.75は負債を減らし忘れた誤り(350,000 ÷ 200,000)。",
    },
    {
      q: "A company with a current ratio of 0.8 purchases inventory on account. What is the effect of this transaction on the company's current ratio and quick ratio?",
      ja: "流動比率が0.8の会社が、棚卸資産を掛けで購入した。この取引は流動比率と当座比率にどのような影響を与えるか。",
      c: [
        "Current ratio decreases; quick ratio decreases",
        "Current ratio unchanged; quick ratio decreases",
        "Current ratio increases; quick ratio decreases",
        "Current ratio increases; quick ratio unchanged",
      ],
      a: 2,
      ex: "流動比率が1未満のとき、分子と分母に同額を加えると比率は1に近づく(上昇する)。棚卸資産は当座資産に含まれないため、当座比率は分母だけが増えて低下する。流動比率が1超なら逆に低下する点に注意。",
    },
    {
      q: "A company reports total assets of $1,200,000 and total liabilities of $480,000. What is the company's debt-to-equity ratio?",
      ja: "ある会社の総資産は$1,200,000、総負債は$480,000である。負債資本倍率(D/Eレシオ)はいくらか。",
      c: ["0.40", "1.50", "0.60", "0.67"],
      a: 3,
      ex: "自己資本 = 1,200,000 − 480,000 = 720,000。D/E = 480,000 ÷ 720,000 = 0.67。0.40は負債比率(負債÷総資産)、1.50は逆数、0.60は自己資本比率である。",
    },
    {
      q: "A company's debt ratio (total liabilities ÷ total assets) is 60%. What is its equity multiplier as used in DuPont analysis?",
      ja: "ある会社の負債比率(総負債÷総資産)は60%である。デュポン分析で用いる財務レバレッジ(株主資本乗数)はいくらか。",
      c: ["2.50", "1.67", "1.50", "0.40"],
      a: 0,
      ex: "自己資本比率 = 1 − 0.60 = 0.40。株主資本乗数 = 総資産 ÷ 自己資本 = 1 ÷ 0.40 = 2.50。1.67は1 ÷ 0.60(負債比率の逆数)、1.50はD/Eレシオ(0.60 ÷ 0.40)である。",
    },
    {
      q: "A company reported sales of $2,000,000 and net income of $120,000. Average total assets were $1,600,000 and average stockholders' equity was $800,000. Using the three-factor DuPont model, what is return on equity?",
      ja: "ある会社の売上高は$2,000,000、純利益は$120,000。平均総資産は$1,600,000、平均自己資本は$800,000であった。3要素デュポン・モデルによるROEはいくらか。",
      c: ["7.5%", "12.0%", "15.0%", "18.0%"],
      a: 2,
      ex: "売上高純利益率6% × 総資産回転率1.25回 × 株主資本乗数2.0 = 15.0%(= 120,000 ÷ 800,000)。7.5%はROA(株主資本乗数を掛け忘れ)である。",
    },
    {
      q: "Using the five-factor DuPont model, a company has a tax burden (NI ÷ EBT) of 0.75, an interest burden (EBT ÷ EBIT) of 0.80, an EBIT margin of 12%, total asset turnover of 1.25, and an equity multiplier of 2.0. What is the company's return on equity?",
      ja: "5要素デュポン・モデルにおいて、税負担率(純利益÷税引前利益)0.75、金利負担率(税引前利益÷EBIT)0.80、EBITマージン12%、総資産回転率1.25回、株主資本乗数2.0である。ROEはいくらか。",
      c: ["14.4%", "18.0%", "24.0%", "9.0%"],
      a: 1,
      ex: "ROE = 0.75 × 0.80 × 0.12 × 1.25 × 2.0 = 18.0%。14.4%は総資産回転率を、24.0%は税負担率を掛け忘れた誤りである。",
    },
    {
      q: "In a five-factor DuPont analysis, a company's interest burden ratio (EBT ÷ EBIT) declined from 0.90 to 0.75 while its EBIT margin and asset turnover were unchanged. Which of the following best explains the change?",
      ja: "5要素デュポン分析において、金利負担率(税引前利益÷EBIT)が0.90から0.75に低下した。EBITマージンと総資産回転率は変わっていない。この変化を最もよく説明するのはどれか。",
      c: [
        "Interest expense consumed a larger share of operating income, likely due to more debt or higher borrowing rates",
        "The effective income tax rate increased",
        "The company generated less revenue per dollar of assets",
        "Operating expenses increased relative to sales",
      ],
      a: 0,
      ex: "金利負担率はEBITのうち支払利息控除後に残る割合であり、低下は支払利息の負担増(借入増加や金利上昇)を示す。税率上昇は税負担率、資産効率は総資産回転率、営業費用はEBITマージンに表れる。",
    },
    {
      q: "A company had credit sales of $1,800,000 for the year. Accounts receivable were $130,000 at the beginning of the year and $170,000 at year-end. Using a 365-day year, what is the average collection period (days sales outstanding)?",
      ja: "当期の掛売上高は$1,800,000、売掛金は期首$130,000、期末$170,000であった。1年を365日として、売掛金回収期間(DSO)はいくらか。",
      c: ["26.4 days", "34.5 days", "12.0 days", "30.4 days"],
      a: 3,
      ex: "平均売掛金 = (130,000 + 170,000)÷ 2 = 150,000。回転率 = 1,800,000 ÷ 150,000 = 12回、DSO = 365 ÷ 12 ≒ 30.4日。期末残高のみなら34.5日、期首残高のみなら26.4日となる。12.0は回転率そのものである。",
    },
    {
      q: "A company reported sales of $800,000, cost of goods sold of $500,000, selling and administrative expenses of $180,000, and interest expense of $20,000. The income tax rate is 25%. What is the net profit margin?",
      ja: "売上高$800,000、売上原価$500,000、販売費及び一般管理費$180,000、支払利息$20,000、法人税率25%である。売上高純利益率はいくらか。",
      c: ["15.0%", "12.5%", "9.4%", "37.5%"],
      a: 2,
      ex: "税引前利益 = 800,000 − 500,000 − 180,000 − 20,000 = 100,000、純利益 = 100,000 × 0.75 = 75,000。75,000 ÷ 800,000 ≒ 9.4%。15.0%は営業利益率、12.5%は税引前利益率、37.5%は売上総利益率である。",
    },
    {
      q: "A company reported cash flows from operating activities of $360,000. Current liabilities were $400,000 at the beginning of the year and $500,000 at the end of the year. What is the operating cash flow ratio based on average current liabilities?",
      ja: "営業活動によるキャッシュ・フローは$360,000、流動負債は期首$400,000、期末$500,000であった。平均流動負債に基づく営業キャッシュ・フロー比率はいくらか。",
      c: ["0.72", "0.90", "1.25", "0.80"],
      a: 3,
      ex: "平均流動負債 = (400,000 + 500,000)÷ 2 = 450,000。360,000 ÷ 450,000 = 0.80。0.72は期末残高、0.90は期首残高を用いた誤り、1.25は逆数である。",
    },
    {
      q: "A company with a current ratio of 1.6 declares a cash dividend that will be paid next month. What is the effect of the declaration on working capital and the current ratio?",
      ja: "流動比率1.6の会社が、翌月支払予定の現金配当を宣言した。宣言が運転資本と流動比率に与える影響はどれか。",
      c: [
        "Working capital decreases; current ratio decreases",
        "Working capital unchanged; current ratio decreases",
        "Working capital decreases; current ratio unchanged",
        "No effect on either until the dividend is paid",
      ],
      a: 0,
      ex: "宣言時に未払配当金(流動負債)が増え、流動資産は変わらないため、運転資本・流動比率ともに低下する。支払時は分子・分母が同額減るため、比率>1なら流動比率は上昇し運転資本は不変となる。",
    },
    {
      q: "A company uses the allowance method for credit losses. It writes off a specific $15,000 customer account as uncollectible. What is the effect of the write-off on the current ratio and working capital?",
      ja: "貸倒引当金法を採用する会社が、特定の顧客の売掛金$15,000を回収不能として償却した。この償却が流動比率と運転資本に与える影響はどれか。",
      c: [
        "Both decrease",
        "No effect on either",
        "Current ratio decreases; working capital unchanged",
        "Both increase",
      ],
      a: 1,
      ex: "償却仕訳は貸倒引当金(借方)/売掛金(貸方)であり、売掛金の純額は変わらない。よって流動比率・運転資本ともに影響しない。影響が生じるのは引当金の繰入(貸倒費用計上)時である。",
    },
    {
      q: "During a period of rising prices and stable inventory quantities, a company using LIFO is compared with an otherwise identical company using FIFO. The LIFO company will report:",
      ja: "物価上昇期で在庫数量が安定している場合、LIFOを採用する会社を、それ以外は同一のFIFO採用会社と比較する。LIFO採用会社が報告する指標はどうなるか。",
      c: [
        "Lower inventory turnover and a higher current ratio",
        "Higher gross margin and a higher current ratio",
        "Higher inventory turnover and a lower current ratio",
        "The same inventory turnover but a lower gross margin",
      ],
      a: 2,
      ex: "LIFOでは売上原価が大きく(分子増)、期末棚卸資産が小さい(分母減)ため棚卸資産回転率は高くなり、流動資産が小さいため流動比率は低くなる。売上総利益率もFIFOより低い。",
    },
    {
      q: "Which of the following patterns would most strongly suggest low quality of earnings and warrant further investigation?",
      ja: "次のうち、利益の質が低いことを最も強く示唆し、追加調査を要するパターンはどれか。",
      c: [
        "Net income and operating cash flow both increased about 8%",
        "Operating cash flow consistently exceeds net income because of large depreciation charges",
        "Gross margin improved after a planned price increase, with stable receivable days",
        "Net income increased 25% while operating cash flow declined and days sales outstanding rose sharply",
      ],
      a: 3,
      ex: "利益が伸びる一方で営業CFが減少し、DSOが急上昇しているのは、積極的な収益認識(押込販売等)による発生主義利益の膨張を示唆する。利益とCFが連動している場合や、減価償却によりCFが利益を上回る場合は質が高い兆候である。",
    },
    {
      q: "A company reported net income of $500,000 and cash flows from operating activities of $200,000. Average total assets were $3,000,000. What is the company's accruals ratio (net income minus operating cash flow, scaled by average total assets)?",
      ja: "純利益は$500,000、営業活動によるキャッシュ・フローは$200,000、平均総資産は$3,000,000であった。発生主義比率(純利益−営業CFを平均総資産で除したもの)はいくらか。",
      c: ["10.0%", "6.7%", "16.7%", "60.0%"],
      a: 0,
      ex: "アクルーアル = 500,000 − 200,000 = 300,000、300,000 ÷ 3,000,000 = 10.0%。60.0%は純利益で割った誤り。比率が高いほど利益が現金の裏付けを欠き、利益の質が低いと評価される。",
    },
    {
      q: "In a common-size balance sheet, a company reports inventory of $150,000, total current assets of $500,000, and total assets of $1,200,000. What percentage is presented for inventory?",
      ja: "百分率(共通サイズ)貸借対照表において、棚卸資産$150,000、流動資産合計$500,000、総資産$1,200,000である。棚卸資産として表示される割合はいくらか。",
      c: ["30.0%", "15.0%", "12.5%", "25.0%"],
      a: 2,
      ex: "共通サイズ貸借対照表の基準は総資産(100%)であり、150,000 ÷ 1,200,000 = 12.5%。30.0%は流動資産を基準にした誤り。損益計算書の場合は売上高(純額)を基準とする。",
    },
    {
      q: "A company's sales were $400,000 in Year 1, $460,000 in Year 2, and $506,000 in Year 3. Using Year 1 as the base year, what is the trend percentage (index) for Year 3 sales?",
      ja: "売上高は1年目$400,000、2年目$460,000、3年目$506,000であった。1年目を基準年とした場合、3年目の売上高の趨勢比率(指数)はいくらか。",
      c: ["110.0%", "115.0%", "125.0%", "126.5%"],
      a: 3,
      ex: "趨勢分析では各年を基準年で割る:506,000 ÷ 400,000 = 126.5%。110.0%は前年比(506,000 ÷ 460,000)、125.0%は各年の前年比増加率(15%と10%)を単純合計した誤りである。",
    },
    {
      q: "In a horizontal analysis, a company's net result changed from a net loss of $(50,000) in the prior year to net income of $100,000 in the current year. How should the percentage change be presented?",
      ja: "水平分析において、当社の損益は前年の純損失$(50,000)から当年の純利益$100,000に変化した。変動率はどのように表示すべきか。",
      c: [
        "As not meaningful, because the base-year amount is negative",
        "As an increase of 300%",
        "As a decrease of 300%",
        "As an increase of 200%",
      ],
      a: 0,
      ex: "基準年の金額がマイナスまたはゼロの場合、変動率は数学的に意味を持たないため算定せず、金額の変動($150,000の増加)のみを示す。150,000 ÷ (−50,000) = −300%と計算すると改善が減少に見える誤りとなる。",
    },
    {
      q: "A company reports sales of $1,095,000 and cost of goods sold of $876,000. Average inventory is $120,000, average accounts receivable is $150,000, and average accounts payable is $72,000. Assuming a 365-day year and using cost of goods sold for payables, what is the cash conversion cycle?",
      ja: "売上高$1,095,000、売上原価$876,000。平均棚卸資産$120,000、平均売掛金$150,000、平均買掛金$72,000である。1年365日とし、買掛金回転日数には売上原価を用いる。キャッシュ・コンバージョン・サイクルは何日か。",
      c: ["100 days", "70 days", "130 days", "80 days"],
      a: 1,
      ex: "DIO = 120,000 ÷ 876,000 × 365 = 50日、DSO = 150,000 ÷ 1,095,000 × 365 = 50日、DPO = 72,000 ÷ 876,000 × 365 = 30日。CCC = 50 + 50 − 30 = 70日。100日は営業循環期間(DPOを控除しない)、130日はDPOを加算した誤り。",
    },
    {
      q: "A company's days inventory outstanding increases by 8 days, its days sales outstanding decreases by 5 days, and it negotiates supplier terms that increase days payables outstanding by 10 days. What is the net effect on the cash conversion cycle?",
      ja: "棚卸資産回転日数が8日増加、売掛金回転日数が5日減少し、仕入先との交渉により買掛金回転日数が10日増加した。キャッシュ・コンバージョン・サイクルへの純影響はどれか。",
      c: ["Decreases by 23 days", "Decreases by 7 days", "Increases by 13 days", "Decreases by 15 days"],
      a: 1,
      ex: "CCC = DIO + DSO − DPO なので、変化は +8 − 5 − 10 = −7日(7日短縮)。DPOの増加はCCCを短縮させる。23日はDIOの増加も短縮と扱った誤り、15日はDIOの変化を無視した誤りである。",
    },
    {
      q: "A company has long-term debt of $400,000, current maturities of long-term debt of $50,000, short-term notes payable of $50,000, accounts payable of $100,000, and stockholders' equity of $1,000,000. What is its debt-to-total-capital ratio, where debt is interest-bearing debt only?",
      ja: "長期借入金$400,000、1年内返済予定の長期借入金$50,000、短期手形借入金$50,000、買掛金$100,000、自己資本$1,000,000である。有利子負債のみを負債とした場合の負債・総資本比率(Debt-to-capital)はいくらか。",
      c: ["37.5%", "28.6%", "50.0%", "33.3%"],
      a: 3,
      ex: "有利子負債 = 400,000 + 50,000 + 50,000 = 500,000。500,000 ÷ (500,000 + 1,000,000) = 33.3%。37.5%は買掛金を含めた誤り、28.6%は長期借入金のみ、50.0%は有利子負債÷自己資本である。",
    },
    {
      q: "A company reported net income of $600,000 and declared preferred dividends of $100,000. Average total stockholders' equity was $3,500,000, which includes $1,000,000 of preferred stock. What is the return on common stockholders' equity?",
      ja: "純利益$600,000、優先配当の宣言額$100,000。平均株主資本合計は$3,500,000で、そのうち優先株式が$1,000,000である。普通株主資本利益率はいくらか。",
      c: ["24.0%", "17.1%", "20.0%", "14.3%"],
      a: 2,
      ex: "普通株主に帰属する利益 = 600,000 − 100,000 = 500,000、平均普通株主資本 = 3,500,000 − 1,000,000 = 2,500,000。500,000 ÷ 2,500,000 = 20.0%。24.0%は優先配当を控除し忘れた誤りである。",
    },
    {
      q: "A company reported cost of goods sold of $900,000. Inventory was $100,000 at the beginning of the year and $140,000 at year-end. Average accounts payable (all for inventory purchases) was $94,000. Using purchases and a 365-day year, what is days payables outstanding?",
      ja: "売上原価$900,000、棚卸資産は期首$100,000、期末$140,000。平均買掛金(すべて商品仕入分)は$94,000である。仕入高と1年365日を用いた場合、買掛金回転日数はいくらか。",
      c: ["36.5 days", "38.1 days", "40.6 days", "10.0 days"],
      a: 0,
      ex: "仕入高 = 売上原価900,000 + 期末140,000 − 期首100,000 = 940,000。回転率 = 940,000 ÷ 94,000 = 10回、DPO = 365 ÷ 10 = 36.5日。38.1日は仕入高でなく売上原価を用いた誤り、10.0は回転率である。",
    },
    {
      q: "A company with a current ratio of 1.5 and a debt-to-equity ratio of 0.8 issues 10-year bonds for cash. Immediately after the issuance, what happens to these two ratios?",
      ja: "流動比率1.5、D/Eレシオ0.8の会社が、10年満期の社債を発行して現金を受け取った。発行直後、これらの比率はどうなるか。",
      c: [
        "Current ratio unchanged; debt-to-equity increases",
        "Current ratio increases; debt-to-equity unchanged",
        "Current ratio decreases; debt-to-equity increases",
        "Current ratio increases; debt-to-equity increases",
      ],
      a: 3,
      ex: "現金(流動資産)が増え、流動負債は増えないため流動比率は上昇する。長期負債が増え自己資本は不変なのでD/Eレシオも上昇する。流動性は改善するが支払能力(ソルベンシー)指標は悪化する。",
    },
    {
      q: "A retailer's sales in its Northeast region fell 18% last quarter. Management asks the analytics team to drill down into store, product, and promotion data to determine why the decline occurred. This is an example of which type of analytics?",
      ja: "小売業者の北東地域の売上高が前四半期に18%減少した。経営者は分析チームに、店舗・製品・販促データを掘り下げて減少の原因を突き止めるよう依頼した。これはどの種類の分析か。",
      c: ["Descriptive analytics", "Predictive analytics", "Diagnostic analytics", "Prescriptive analytics"],
      a: 2,
      ex: "「なぜ起きたか」を探るドリルダウンや相関分析は診断的分析である。記述的分析は「何が起きたか」(18%減少の報告)、予測的分析は「何が起きるか」、処方的分析は「何をすべきか」に答える。",
    },
    {
      q: "A company implements a model that uses demand forecasts, carrying costs, and supplier lead times to automatically recommend the optimal reorder quantity for each SKU. This is best described as:",
      ja: "需要予測、保管コスト、仕入先のリードタイムを用いて、SKUごとに最適な発注量を自動的に推奨するモデルを導入した。これを最もよく表すのはどれか。",
      c: ["Prescriptive analytics", "Diagnostic analytics", "Descriptive analytics", "Predictive analytics"],
      a: 0,
      ex: "最適化等により取るべき行動(最適発注量)を推奨するのは処方的分析である。需要予測自体は予測的分析だが、それを入力として意思決定を推奨する点が処方的分析の特徴である。",
    },
    {
      q: "A simple linear regression of monthly sales on advertising spending yields a correlation coefficient (r) of −0.80. What is the coefficient of determination, and how should it be interpreted?",
      ja: "月次売上高を広告費に回帰した単回帰分析で、相関係数(r)が−0.80となった。決定係数はいくらで、どのように解釈すべきか。",
      c: [
        "−0.64; advertising reduces 64% of sales",
        "0.80; 80% of the variation in sales is explained by advertising",
        "0.64; 64% of the variation in sales is explained by advertising",
        "0.36; 36% of the variation in sales is explained by advertising",
      ],
      a: 2,
      ex: "決定係数R² = r² = (−0.80)² = 0.64であり、負になることはない。売上高の変動の64%が広告費の変動で説明されることを示す。0.36は説明されない部分(1 − R²)である。",
    },
    {
      q: "A multiple regression of quarterly sales on advertising spending and number of sales representatives shows that the coefficient on sales representatives has a p-value of 0.30. Using a 5% significance level, the analyst should conclude that:",
      ja: "四半期売上高を広告費と営業担当者数に回帰した重回帰分析で、営業担当者数の係数のp値が0.30であった。有意水準5%を用いると、分析者はどう結論すべきか。",
      c: [
        "The number of sales representatives explains 30% of the variation in sales",
        "The coefficient on sales representatives is not statistically significant",
        "The coefficient is significant because the p-value is greater than 0.05",
        "The model's R-squared must be below 0.30",
      ],
      a: 1,
      ex: "p値0.30 > 0.05のため、係数がゼロであるという帰無仮説を棄却できず、統計的に有意でない。p値は説明力(R²)を示すものではなく、p値が小さいほど有意である。",
    },
    {
      q: "An analyst finds a correlation coefficient of 0.92 between a region's ice cream sales and the number of sunburn cases reported at local clinics. Which conclusion is most appropriate?",
      ja: "分析者は、ある地域のアイスクリーム売上高と地域の診療所で報告された日焼け患者数との間に0.92の相関係数を見出した。最も適切な結論はどれか。",
      c: [
        "There is a strong positive linear association, but it does not establish causation",
        "Ice cream consumption causes sunburn",
        "92% of sunburn cases are explained by ice cream sales",
        "The relationship is weak because the coefficient is less than 1.0",
      ],
      a: 0,
      ex: "0.92は強い正の線形関係を示すが、相関は因果関係を意味しない(気温という第三の要因が両方に影響している可能性がある)。説明割合はr² ≒ 0.85であり、92%ではない。",
    },
    {
      q: "A regression model estimates monthly sales (in thousands) as: Sales = 120 + 2.5 × Advertising + 0.8 × Store traffic, where advertising is in thousands of dollars and store traffic is in hundreds of visitors. If next month's advertising is $40,000 and store traffic is 15,000 visitors, what are predicted sales?",
      ja: "回帰モデルの推定式は 売上高(千ドル)= 120 + 2.5 × 広告費 + 0.8 × 来店者数 である。広告費は千ドル単位、来店者数は百人単位である。翌月の広告費が$40,000、来店者数が15,000人の場合、予測売上高はいくらか。",
      c: ["$232,000", "$12,220,000", "$340,000", "$220,000"],
      a: 2,
      ex: "広告費 = 40(千ドル)、来店者数 = 150(百人)。売上 = 120 + 2.5 × 40 + 0.8 × 150 = 120 + 100 + 120 = 340(千ドル)= $340,000。単位を変換しない(15,000をそのまま使う)と$12,220,000となる。$220,000は来店者数の項を漏らした誤り。",
    },
    {
      q: "A company developed a regression model of maintenance cost using monthly data in which machine hours ranged from 2,000 to 6,000. Management now wants to use the model to predict maintenance cost for a month with 12,000 machine hours after a major expansion. What is the primary concern?",
      ja: "機械稼働時間が2,000〜6,000時間の範囲にある月次データを用いて、保守費の回帰モデルを作成した。経営者は大規模な拡張後、12,000時間の月の保守費をこのモデルで予測したいと考えている。主な懸念は何か。",
      c: [
        "The intercept will become negative at higher activity levels",
        "The prediction requires extrapolation outside the relevant range of the data",
        "The R-squared will automatically decrease",
        "Regression models cannot be used for cost prediction",
      ],
      a: 1,
      ex: "回帰式は観測データの範囲(関連範囲)内でのみ信頼できる。12,000時間は範囲外への外挿であり、コスト構造(段階的固定費等)が変化している可能性がある。R²はモデル推定時の値であり予測によって変わらない。",
    },
    {
      q: "During data preparation, an analyst finds that 22% of customer records have no value in the required credit limit field. Which data quality dimension is primarily affected?",
      ja: "データ準備の段階で、分析者は顧客レコードの22%で必須項目である与信限度額が空欄であることを発見した。主に影響を受けるデータ品質の側面はどれか。",
      c: ["Timeliness", "Uniqueness", "Validity", "Completeness"],
      a: 3,
      ex: "必須項目の値が欠落しているのは完全性(completeness)の問題である。一意性は重複レコード、適時性はデータの鮮度、妥当性は形式・範囲のルールへの適合(例:負の与信限度額)に関する側面である。",
    },
    {
      q: "A CFO wants a visualization to show how monthly revenue has changed over the past 36 months and highlight any seasonal pattern. Which chart type is most appropriate?",
      ja: "CFOは、過去36か月の月次売上高の推移を示し、季節的パターンを強調する可視化を求めている。最も適切なグラフはどれか。",
      c: ["Pie chart", "Line chart", "Scatter plot", "Treemap"],
      a: 1,
      ex: "時系列の推移や季節性を示すには折れ線グラフが最適である。円グラフは構成比、散布図は2つの数値変数の関係、ツリーマップは階層的な構成比の表示に適する。",
    },
    {
      q: "An analyst wants to visually examine whether there is a relationship between each store's square footage and its annual sales for 250 stores. Which visualization is most appropriate?",
      ja: "分析者は、250店舗について売場面積と年間売上高との間に関係があるかを視覚的に確認したい。最も適切な可視化はどれか。",
      c: ["Stacked bar chart", "Pie chart", "Gauge chart", "Scatter plot"],
      a: 3,
      ex: "2つの連続的な数値変数の関係(相関・外れ値)を見るには散布図が適している。積み上げ棒グラフは構成の比較、円グラフは全体に対する割合、ゲージはKPIの単一値の表示に用いる。",
    },
    {
      q: "An internal audit analytics team wants to show the distribution of 40,000 expense report amounts to identify clustering just below the $500 approval threshold. Which chart is most appropriate?",
      ja: "内部監査の分析チームは、40,000件の経費精算額の分布を示し、承認基準額$500の直下に集中があるかを識別したい。最も適切なグラフはどれか。",
      c: ["Histogram", "Line chart", "Pie chart", "Bubble chart"],
      a: 0,
      ex: "数値データの度数分布を示すにはヒストグラムが適しており、$480〜$499の区間への異常な集中を視覚的に発見できる。折れ線グラフは時系列、円グラフは構成比を示すもので分布の把握には向かない。",
    },
    {
      q: "An analyst adds three additional independent variables to a regression model. R-squared rises from 0.71 to 0.73, but adjusted R-squared falls from 0.69 to 0.66. What is the most reasonable conclusion?",
      ja: "分析者が回帰モデルに独立変数を3つ追加したところ、R²は0.71から0.73に上昇したが、自由度調整済みR²は0.69から0.66に低下した。最も合理的な結論はどれか。",
      c: [
        "The added variables substantially improve the model's explanatory power",
        "The model now explains 73% of the variation, so it should be retained",
        "The added variables do not add enough explanatory power to justify their inclusion",
        "Adjusted R-squared is always lower than R-squared, so the change is irrelevant",
      ],
      a: 2,
      ex: "R²は変数を追加すれば必ず上昇(または不変)するが、自由度調整済みR²は変数の数に対してペナルティを課す。調整済みR²が低下したことは、追加変数が説明力の向上に見合わないことを示し、簡潔なモデルが望ましい。",
    },
    {
      q: "In a regression of shipping cost on package weight, the slope coefficient is 4.50 with a standard error of 1.50. Using the rule of thumb that a t-statistic above 2.0 indicates significance, what is the t-statistic and conclusion?",
      ja: "配送費を荷物の重量に回帰した分析で、傾きの係数は4.50、その標準誤差は1.50であった。t値が2.0を超えれば有意とする経験則を用いた場合、t値と結論はどれか。",
      c: [
        "0.33; not significant",
        "6.75; significant",
        "3.00; not significant",
        "3.00; significant",
      ],
      a: 3,
      ex: "t値 = 係数 ÷ 標準誤差 = 4.50 ÷ 1.50 = 3.00 > 2.0のため、重量は配送費の有意な説明変数である。0.33は逆に割った誤り、6.75は掛けた誤りである。",
    },
    {
      q: "A lender builds a model using historical borrower data to estimate the probability that each new loan applicant will default within 12 months. This is an example of:",
      ja: "貸手が過去の借手データを用いて、新規申込者ごとに12か月以内に債務不履行となる確率を推定するモデルを構築した。これは何の例か。",
      c: ["Descriptive analytics", "Predictive analytics", "Diagnostic analytics", "Data cleansing"],
      a: 1,
      ex: "過去データから将来の事象の発生確率を推定するのは予測的分析である。過去の貸倒率を集計するだけなら記述的分析、なぜ貸倒が増えたかを分析するなら診断的分析となる。",
    },
    {
      q: "A management presentation shows a bar chart of two divisions' gross margins of 31% and 33%, with the vertical axis starting at 30%. The bar for the second division appears three times as tall as the first. What is the primary problem with this visualization?",
      ja: "経営陣向け資料に、2事業部の売上総利益率31%と33%を示す棒グラフがあり、縦軸は30%から始まっている。2番目の事業部の棒は1番目の3倍の高さに見える。この可視化の主な問題は何か。",
      c: [
        "Bar charts cannot be used to compare percentages",
        "The colors are not accessible to color-blind users",
        "The truncated axis exaggerates the difference between the divisions",
        "The chart should have used a pie chart instead",
      ],
      a: 2,
      ex: "棒グラフの軸をゼロ以外から始めると、2ポイントの差が3倍の差に見えるなど違いが誇張され、誤解を招く。棒グラフは長さで値を比較するため、原則として軸をゼロから始める。",
    },
    {
      q: "Under the balanced scorecard, which of the following measures is most appropriately classified in the internal business process perspective?",
      ja: "バランスト・スコアカードにおいて、内部ビジネス・プロセスの視点に分類するのが最も適切な指標はどれか。",
      c: [
        "Customer retention rate",
        "Return on invested capital",
        "Employee training hours per year",
        "First-pass production yield (defect-free units ÷ total units started)",
      ],
      a: 3,
      ex: "歩留まり率や不良率、サイクルタイムは業務プロセスの品質・効率を測る内部ビジネス・プロセスの指標である。顧客維持率は顧客の視点、ROICは財務の視点、研修時間は学習と成長の視点に属する。",
    },
    {
      q: "For a typical production order, processing time is 4 hours, inspection time is 1 hour, move time is 2 hours, and queue (wait) time is 13 hours. What is the manufacturing cycle efficiency?",
      ja: "標準的な製造指図において、加工時間4時間、検査時間1時間、移動時間2時間、待ち時間13時間である。製造サイクル効率(MCE)はいくらか。",
      c: ["20%", "25%", "35%", "57%"],
      a: 0,
      ex: "MCE = 付加価値時間(加工時間)÷ スループット時間 = 4 ÷ (4 + 1 + 2 + 13) = 4 ÷ 20 = 20%。検査・移動・待ちは非付加価値時間である。35%は検査と移動を付加価値と扱った誤り(7 ÷ 20)。",
    },
    {
      q: "A company's strategy is to grow revenue through superior customer service. Which of the following would be the best leading indicator of future financial performance in its balanced scorecard?",
      ja: "ある会社の戦略は、卓越した顧客サービスを通じて売上を成長させることである。バランスト・スコアカードにおいて、将来の財務業績の先行指標として最も適切なものはどれか。",
      c: [
        "Prior-year net income",
        "Percentage of service staff who completed customer-service certification",
        "Last quarter's return on assets",
        "Prior-year revenue growth",
      ],
      a: 1,
      ex: "学習と成長の視点の指標(従業員の能力開発)は、プロセス改善→顧客満足→財務成果という因果関係の起点となる先行指標である。純利益・ROA・売上成長率は過去の成果を示す遅行指標である。",
    },
    {
      q: "In a customer survey, 50% of respondents are promoters (scores of 9-10), 30% are passives (scores of 7-8), and 20% are detractors (scores of 0-6). What is the Net Promoter Score (NPS)?",
      ja: "顧客調査で、回答者の50%が推奨者(9〜10点)、30%が中立者(7〜8点)、20%が批判者(0〜6点)であった。ネット・プロモーター・スコア(NPS)はいくらか。",
      c: ["50", "80", "30", "60"],
      a: 2,
      ex: "NPS = 推奨者の割合 − 批判者の割合 = 50 − 20 = 30。中立者は計算に含めない。80は推奨者と中立者を合計した誤り、50は推奨者の割合のみである。",
    },
    {
      q: "A division manager is evaluated solely on return on investment (ROI). The division currently earns an ROI of 22%, and the company's cost of capital is 12%. The manager rejects a project expected to earn 16%. Which statement best describes this outcome?",
      ja: "事業部長は投資利益率(ROI)のみで評価されている。事業部の現在のROIは22%、全社の資本コストは12%である。事業部長は16%のリターンが見込まれるプロジェクトを却下した。この結果を最もよく表すのはどれか。",
      c: [
        "Goal congruence is achieved because the division's ROI is maximized",
        "The decision is correct because 16% is below the division's current ROI",
        "The project should be rejected because it reduces residual income",
        "This is suboptimal behavior; the project would increase company value and residual income",
      ],
      a: 3,
      ex: "16%は資本コスト12%を上回るため、全社にとって価値を創造し残余利益も増加させるが、事業部ROIを22%から引き下げるため却下された。ROIのみの評価は目標の不一致(部分最適)を生じさせる典型例であり、残余利益の併用で緩和できる。",
    },
    {
      q: "A company's sales are $5,000,000 and are projected to increase to $6,000,000 next year. Assets that vary with sales are 60% of sales, spontaneous liabilities are 10% of sales, the net profit margin is 5%, and the dividend payout ratio is 40%. The company is at full capacity. Using the percent-of-sales method, what is the additional funds needed (AFN)?",
      ja: "売上高は$5,000,000で、翌年は$6,000,000への増加が予測される。売上に比例する資産は売上高の60%、自発的負債は売上高の10%、売上高純利益率は5%、配当性向は40%である。会社はフル稼働状態にある。売上高百分率法による追加必要資金(AFN)はいくらか。",
      c: ["$320,000", "$500,000", "$350,000", "$200,000"],
      a: 0,
      ex: "資産増加 = 0.60 × 1,000,000 = 600,000、自発的負債増加 = 0.10 × 1,000,000 = 100,000、内部留保 = 6,000,000 × 5% × (1 − 0.40) = 180,000。AFN = 600,000 − 100,000 − 180,000 = 320,000。$500,000は内部留保を無視、$350,000は当年売上で内部留保を計算した誤りである。",
    },
    {
      q: "A company projects next year's sales, all on credit, at $3,650,000 and expects days sales outstanding to be 40 days. Using a 365-day year, what is the projected year-end accounts receivable balance?",
      ja: "翌年の売上高(すべて掛売上)は$3,650,000と予測され、売掛金回収期間(DSO)は40日と見込まれる。1年を365日として、期末売掛金残高の予測額はいくらか。",
      c: ["$365,000", "$400,000", "$304,167", "$146,000"],
      a: 1,
      ex: "1日当たり売上高 = 3,650,000 ÷ 365 = 10,000。期末売掛金 = 10,000 × 40日 = 400,000。$304,167は1か月分の売上高(÷12)であり、DSOを反映していない。",
    },
    {
      q: "Which statement best distinguishes sensitivity analysis from scenario analysis in financial projections?",
      ja: "財務予測における感応度分析とシナリオ分析の違いを最もよく説明しているのはどれか。",
      c: [
        "Sensitivity analysis changes one input at a time holding others constant, whereas scenario analysis changes several inputs together to reflect a coherent set of conditions",
        "Sensitivity analysis uses probability distributions for all inputs, whereas scenario analysis uses only the base case",
        "Scenario analysis changes one input at a time, whereas sensitivity analysis changes all inputs simultaneously",
        "Sensitivity analysis is used only for capital budgeting, whereas scenario analysis is used only for budgeting",
      ],
      a: 0,
      ex: "感応度分析は他の条件を一定として1つの変数を変化させ、その影響度(どの変数が重要か)を測る。シナリオ分析は景気後退などの状況に整合する複数の変数を同時に変化させる。全変数を確率分布で扱うのはモンテカルロ・シミュレーションである。",
    },
    {
      q: "A company prepared three scenarios for a new product: best case NPV of $500,000 (probability 30%), base case NPV of $200,000 (probability 50%), and worst case NPV of $(300,000) (probability 20%). What is the expected NPV?",
      ja: "新製品について3つのシナリオを作成した。最良ケースのNPVは$500,000(確率30%)、基本ケースは$200,000(確率50%)、最悪ケースは$(300,000)(確率20%)である。期待NPVはいくらか。",
      c: ["$133,333", "$190,000", "$310,000", "$250,000"],
      a: 1,
      ex: "期待NPV = 0.3 × 500,000 + 0.5 × 200,000 + 0.2 × (−300,000) = 150,000 + 100,000 − 60,000 = 190,000。$133,333は確率を無視した単純平均、$310,000は最悪ケースを加算した誤りである。",
    },
    {
      q: "A company sells 20,000 units at $40 per unit. Variable cost is $25 per unit and fixed costs are $200,000. As part of a sensitivity analysis, management tests a 5% decrease in selling price, holding volume and costs constant. By what percentage does operating income decrease?",
      ja: "販売数量20,000個、販売単価$40、単位当たり変動費$25、固定費$200,000である。感応度分析として、数量とコストを一定とし販売価格を5%引き下げた場合を検討する。営業利益は何%減少するか。",
      c: ["5%", "40%", "25%", "20%"],
      a: 1,
      ex: "現状の営業利益 = (40 − 25) × 20,000 − 200,000 = 100,000。価格$38では (38 − 25) × 20,000 − 200,000 = 60,000。減少率 = 40,000 ÷ 100,000 = 40%。価格は利益に対して高い感応度を持ち、価格の変化率(5%)がそのまま利益に表れるわけではない。",
    },
    {
      q: "Monthly unit sales were: January 100, February 120, March 110, and April 130. Using a three-month simple moving average, what is the forecast for May?",
      ja: "月次販売数量は1月100、2月120、3月110、4月130であった。3か月単純移動平均を用いた場合、5月の予測値はいくらか。",
      c: ["120", "123.3", "130", "110"],
      a: 0,
      ex: "直近3か月(2月〜4月)の平均 = (120 + 110 + 130)÷ 3 = 120。110は1月〜3月の古い区間を用いた誤り、130は直近値をそのまま使った単純予測である。",
    },
    {
      q: "A company uses exponential smoothing with a smoothing constant (alpha) of 0.3. The forecast for last month was 200 units, and actual demand was 220 units. What is the forecast for this month?",
      ja: "平滑化定数(α)0.3の指数平滑法を用いている。前月の予測値は200個、実際の需要は220個であった。今月の予測値はいくらか。",
      c: ["214", "220", "200", "206"],
      a: 3,
      ex: "新予測 = 前回予測 + α × (実績 − 前回予測)= 200 + 0.3 × (220 − 200)= 206。214はαと(1 − α)を取り違えた誤り(0.7を実績側に適用)である。",
    },
    {
      q: "When a company raised the price of its product from $10 to $12, the quantity demanded fell from 1,000 units to 800 units. Using the midpoint (arc) method, what is the price elasticity of demand and the effect on total revenue?",
      ja: "製品価格を$10から$12に引き上げたところ、需要量が1,000個から800個に減少した。中点法(弧弾力性)による需要の価格弾力性と、総収入への影響はどれか。",
      c: [
        "0.82, inelastic; total revenue increases",
        "1.00, unit elastic; total revenue unchanged",
        "1.22, elastic; total revenue decreases",
        "1.22, elastic; total revenue increases",
      ],
      a: 2,
      ex: "数量変化率 = 200 ÷ 900 = 22.2%、価格変化率 = 2 ÷ 11 = 18.2%、弾力性 = 22.2 ÷ 18.2 ≒ 1.22(弾力的)。弾力的な需要で値上げすると総収入は減少する(10,000 → 9,600)。",
    },
    {
      q: "When average consumer income in a market rose 10%, the quantity demanded of a store-brand canned food product fell 4%, holding price constant. The product is best described as:",
      ja: "ある市場で平均消費者所得が10%上昇したところ、価格一定のもとでプライベートブランドの缶詰の需要量が4%減少した。この製品を最もよく表すのはどれか。",
      c: ["A luxury good", "An inferior good", "A normal good that is a necessity", "A complementary good"],
      a: 1,
      ex: "所得弾力性 = −4% ÷ 10% = −0.4 < 0 であり、所得増加で需要が減る下級財(劣等財)である。0〜1は必需品(正常財)、1超は奢侈品である。補完財は交差弾力性で判定する概念である。",
    },
    {
      q: "The price of Product B increased 10%, and as a result the quantity demanded of Product A increased 6%. Products A and B are:",
      ja: "製品Bの価格が10%上昇した結果、製品Aの需要量が6%増加した。製品AとBの関係はどれか。",
      c: ["Substitutes", "Complements", "Unrelated goods", "Inferior goods"],
      a: 0,
      ex: "交差弾力性 = 6% ÷ 10% = +0.6 > 0 であり、代替財である(Bが高くなりAに需要が移る)。交差弾力性が負なら補完財、ゼロに近ければ無関係である。",
    },
    {
      q: "An industry has many firms selling similar but differentiated products, uses significant advertising and branding, and has low barriers to entry. Which market structure and long-run outcome best describe this industry?",
      ja: "ある業界では、多数の企業が類似しているが差別化された製品を販売し、広告やブランドを重視しており、参入障壁は低い。この業界を最もよく表す市場構造と長期的な帰結はどれか。",
      c: [
        "Perfect competition; firms are price takers and earn positive economic profit",
        "Oligopoly; firms are highly interdependent and earn sustained economic profit",
        "Monopoly; a single firm sets price where marginal revenue equals marginal cost",
        "Monopolistic competition; firms earn zero economic profit in the long run",
      ],
      a: 3,
      ex: "多数の企業・製品差別化・低い参入障壁は独占的競争の特徴である。短期的には超過利潤を得られても、新規参入により長期的には経済的利潤がゼロになる。寡占は少数企業で相互依存性が高く、参入障壁が高い。",
    },
    {
      q: "A firm in a perfectly competitive market faces a market price of $18 per unit. At its profit-maximizing output, average variable cost is $20 and average total cost is $25. In the short run, the firm should:",
      ja: "完全競争市場の企業が直面する市場価格は1単位$18である。利潤最大化産出量において、平均可変費用は$20、平均総費用は$25である。短期的に企業はどうすべきか。",
      c: [
        "Continue producing because the price covers part of fixed costs",
        "Continue producing because shutting down would increase losses",
        "Shut down because the price is below average variable cost",
        "Raise its price to $25 to cover average total cost",
      ],
      a: 2,
      ex: "価格$18が平均可変費用$20を下回るため、生産するほど変動費すら回収できず損失が拡大する。操業停止すれば損失は固定費のみとなる。価格がAVCとATCの間にあれば短期的には操業を続ける。完全競争企業はプライス・テイカーで価格を設定できない。",
    },
    {
      q: "A CFO wants to monitor economic indicators that tend to change before the overall economy turns. Which of the following is a leading economic indicator?",
      ja: "CFOは、経済全体が転換する前に変化する傾向のある経済指標を監視したいと考えている。次のうち先行指標はどれか。",
      c: [
        "Average duration of unemployment",
        "Building permits for new private housing units",
        "Average prime rate charged by banks",
        "Industrial production",
      ],
      a: 1,
      ex: "住宅着工許可件数は将来の建設活動を示す先行指標である。失業期間の平均やプライムレートは景気に遅れて動く遅行指標、鉱工業生産は景気と同時に動く一致指標である。",
    },
    {
      q: "The Federal Reserve raises interest rates while other major central banks hold their rates steady. All else equal, what is the most likely effect on the U.S. dollar and on U.S. exporters?",
      ja: "FRBが利上げを行い、他の主要中央銀行は金利を据え置いた。他の条件が一定の場合、米ドルと米国の輸出企業への最も可能性の高い影響はどれか。",
      c: [
        "The dollar appreciates, making U.S. exports more expensive for foreign buyers",
        "The dollar depreciates, making U.S. exports cheaper for foreign buyers",
        "The dollar appreciates, making U.S. exports cheaper for foreign buyers",
        "The dollar is unaffected because exchange rates depend only on trade balances",
      ],
      a: 0,
      ex: "相対的な高金利は海外資本を引き付けドル需要を高めるため、ドル高となる。ドル高では外国の買手にとって米国製品が割高になり、輸出企業の競争力は低下する(一方、輸入企業には有利)。",
    },
    {
      q: "A one-year Treasury security offers a nominal yield of 7%, and expected inflation is 3%. Using the exact Fisher relationship, what is the real interest rate?",
      ja: "1年物の国債の名目利回りは7%、期待インフレ率は3%である。フィッシャー方程式の厳密式を用いた場合、実質金利はいくらか。",
      c: ["4.00%", "10.21%", "2.33%", "3.88%"],
      a: 3,
      ex: "(1 + 名目)=(1 + 実質)×(1 + インフレ)より、実質金利 = 1.07 ÷ 1.03 − 1 ≒ 3.88%。4.00%は近似式(7% − 3%)による値、10.21%は名目金利とインフレ率を複利的に合算した誤りである。",
    },
    {
      q: "The spot exchange rate is $1.10 per euro. The one-year interest rate is 5% in the United States and 3% in the eurozone. Under interest rate parity, what is the one-year forward rate?",
      ja: "直物為替レートは1ユーロ=$1.10である。1年金利は米国5%、ユーロ圏3%である。金利平価説によれば、1年先渡レートはいくらか。",
      c: ["$1.0790 per euro", "$1.1000 per euro", "$1.1214 per euro", "$1.1330 per euro"],
      a: 2,
      ex: "先渡レート = 1.10 × (1.05 ÷ 1.03)≒ $1.1214。高金利通貨(ドル)は先渡で減価し、ユーロは先渡プレミアムとなる。$1.0790は金利を逆に適用した誤りである。",
    },
  ],
});

CPA.tbs({ id: "TBS-BAR-09", section: "BAR", chapter: "BAR-01", title: "財務比率分析(流動性・活動性・収益性・安全性)",
  scenario: `<p>Selected year-end data for Hayashi Corp. are shown below. For simplicity, use year-end balances (not averages) and a 365-day year.</p>
<table><tr><th>Balance sheet item</th><th>Amount</th></tr>
<tr><td>Cash</td><td>$60,000</td></tr>
<tr><td>Marketable securities</td><td>$40,000</td></tr>
<tr><td>Accounts receivable, net</td><td>$150,000</td></tr>
<tr><td>Inventory</td><td>$200,000</td></tr>
<tr><td>Prepaid expenses</td><td>$30,000</td></tr>
<tr><td>Property, plant and equipment, net</td><td>$720,000</td></tr>
<tr><td>Current liabilities</td><td>$240,000</td></tr>
<tr><td>Long-term debt</td><td>$240,000</td></tr>
<tr><td>Stockholders' equity</td><td>$720,000</td></tr></table>
<table><tr><th>Income statement item</th><th>Amount</th></tr>
<tr><td>Net sales (all on credit)</td><td>$1,825,000</td></tr>
<tr><td>Cost of goods sold</td><td>$1,200,000</td></tr>
<tr><td>Net income</td><td>$108,000</td></tr></table>
<p>Compute the ratios below. Round ratios to two decimals and percentages to one decimal.</p>
<p class="ja">Hayashi社の期末データは上表のとおりである。簡便のため平均残高ではなく期末残高を用い、1年を365日とする。比率は小数第2位、百分率は小数第1位まで求めよ。</p>`,
  rows: [
    { label: "Current ratio(流動比率)", type: "num", answer: 2.0, tol: 0.01 },
    { label: "Quick (acid-test) ratio(当座比率)", type: "num", answer: 1.04, tol: 0.01 },
    { label: "Days sales outstanding, in days(売掛金回収日数)", type: "num", answer: 30, tol: 0.1 },
    { label: "Inventory turnover, times(棚卸資産回転率)", type: "num", answer: 6.0, tol: 0.01 },
    { label: "Return on equity, %(ROE、%)", type: "num", answer: 15.0, tol: 0.1 },
    { label: "Debt-to-equity ratio(負債資本倍率)", type: "num", answer: 0.67, tol: 0.01 },
  ],
  explain: `<p>流動資産 = 60,000 + 40,000 + 150,000 + 200,000 + 30,000 = 480,000。流動比率 = 480,000 ÷ 240,000 = 2.00。</p>
<p>当座資産 = 現金 + 有価証券 + 売掛金 = 250,000(棚卸資産・前払費用は除く)。当座比率 = 250,000 ÷ 240,000 ≒ 1.04。</p>
<p>DSO = 150,000 ÷ 1,825,000 × 365 = 30日(1日当たり売上5,000)。棚卸資産回転率 = 売上原価1,200,000 ÷ 200,000 = 6.0回(売上高ではなく売上原価を用いる)。</p>
<p>ROE = 108,000 ÷ 720,000 = 15.0%。D/E = 総負債(240,000 + 240,000)480,000 ÷ 720,000 ≒ 0.67。</p>`,
});

CPA.tbs({ id: "TBS-BAR-10", section: "BAR", chapter: "BAR-01", title: "5要素デュポン分析",
  scenario: `<p>Matsuda Inc. reported the following for the current year:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Sales</td><td>$4,000,000</td></tr>
<tr><td>Earnings before interest and taxes (EBIT)</td><td>$480,000</td></tr>
<tr><td>Interest expense</td><td>$80,000</td></tr>
<tr><td>Income tax expense</td><td>$100,000</td></tr>
<tr><td>Net income</td><td>$300,000</td></tr>
<tr><td>Average total assets</td><td>$3,200,000</td></tr>
<tr><td>Average stockholders' equity</td><td>$1,600,000</td></tr></table>
<p>Decompose return on equity using the five-factor DuPont model. Round ratios to two decimals and percentages to two decimals.</p>
<p class="ja">Matsuda社の当年度の数値は上表のとおりである。5要素デュポン・モデルによりROEを分解せよ。比率・百分率とも小数第2位まで求めよ。</p>`,
  rows: [
    { label: "Tax burden — NI ÷ EBT(税負担率)", type: "num", answer: 0.75, tol: 0.01 },
    { label: "Interest burden — EBT ÷ EBIT(金利負担率)", type: "num", answer: 0.83, tol: 0.01 },
    { label: "EBIT margin, %(EBITマージン、%)", type: "num", answer: 12, tol: 0.01 },
    { label: "Total asset turnover(総資産回転率)", type: "num", answer: 1.25, tol: 0.01 },
    { label: "Return on equity, %(ROE、%)", type: "num", answer: 18.75, tol: 0.01 },
    { label: "If interest expense fell to $40,000 with the same tax rate and all else unchanged, ROE would(支払利息が$40,000に減少し他は不変の場合のROE)", type: "select", options: ["Increase", "Decrease", "Not change"], answer: "Increase" },
  ],
  explain: `<p>EBT = 480,000 − 80,000 = 400,000。税負担率 = 300,000 ÷ 400,000 = 0.75(実効税率25%)。金利負担率 = 400,000 ÷ 480,000 ≒ 0.83。</p>
<p>EBITマージン = 480,000 ÷ 4,000,000 = 12%。総資産回転率 = 4,000,000 ÷ 3,200,000 = 1.25回。株主資本乗数 = 3,200,000 ÷ 1,600,000 = 2.0。</p>
<p>ROE = 0.75 × 0.8333 × 0.12 × 1.25 × 2.0 = 18.75%(= 300,000 ÷ 1,600,000 で検算)。</p>
<p>支払利息が40,000になるとEBT 440,000、純利益330,000、ROE = 20.63%となり上昇する(金利負担率が0.92に改善)。</p>`,
});

CPA.tbs({ id: "TBS-BAR-11", section: "BAR", chapter: "BAR-01", title: "売上高百分率法による資金需要予測",
  scenario: `<p>Kobayashi Co. had sales of $2,000,000 this year and forecasts 25% sales growth next year. The company is operating at full capacity. Relationships expected to hold next year:</p>
<table><tr><th>Item</th><th>Assumption</th></tr>
<tr><td>Assets that vary with sales</td><td>50% of sales</td></tr>
<tr><td>Spontaneous liabilities (accounts payable and accruals)</td><td>15% of sales</td></tr>
<tr><td>Net profit margin</td><td>6% of sales</td></tr>
<tr><td>Dividend payout ratio</td><td>50% of net income</td></tr></table>
<p>Use the percent-of-sales method to determine next year's external financing requirement.</p>
<p class="ja">Kobayashi社の当年度売上高は$2,000,000で、翌年度は25%の増収を予測している。会社はフル稼働状態である。売上に比例する資産は売上高の50%、自発的負債(買掛金・未払費用)は15%、売上高純利益率は6%、配当性向は50%とする。売上高百分率法により翌年度の外部資金必要額を求めよ。</p>`,
  rows: [
    { label: "Required increase in assets(必要な資産増加額)", type: "num", answer: 250000 },
    { label: "Increase in spontaneous liabilities(自発的負債の増加額)", type: "num", answer: 75000 },
    { label: "Addition to retained earnings(内部留保の増加額)", type: "num", answer: 75000 },
    { label: "Additional funds needed (AFN)(追加必要資金)", type: "num", answer: 100000 },
    { label: "AFN if the company paid no dividends next year(翌年度無配とした場合のAFN)", type: "num", answer: 25000 },
    { label: "Which change, by itself, would increase AFN?(単独でAFNを増加させる変化)", type: "select", options: ["A higher net profit margin", "A higher dividend payout ratio", "Higher spontaneous liabilities as a percentage of sales"], answer: "A higher dividend payout ratio" },
  ],
  explain: `<p>翌年度売上高 = 2,000,000 × 1.25 = 2,500,000、売上増加額 = 500,000。</p>
<p>資産増加 = 500,000 × 50% = 250,000。自発的負債増加 = 500,000 × 15% = 75,000。内部留保 = 2,500,000 × 6% × (1 − 0.5) = 75,000(翌年度の売上高で計算する)。</p>
<p>AFN = 250,000 − 75,000 − 75,000 = 100,000。無配なら内部留保は150,000となり、AFN = 250,000 − 75,000 − 150,000 = 25,000。</p>
<p>配当性向の上昇は内部留保を減らすためAFNを増加させる。利益率の上昇や自発的負債比率の上昇はAFNを減少させる。</p>`,
});
