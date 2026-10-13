// BAR のTBS追加(財務諸表分析・データ分析・予測・経済指標・ERM・運転資本管理)

CPA.tbs({
  id: "TBS-BAR-30", section: "BAR", chapter: "BAR-01", title: "3期比較による比率トレンド分析(平均残高ベース)",
  scenario: `<p>Kestrel Corp. is negotiating a renewal of its revolving credit line. The lender's analyst asks you to compute selected 2025 ratios and compare them with 2024. Use <b>average</b> balances for activity ratios and a <b>360-day</b> year. All sales are on credit. Amounts are in thousands.</p>
<p><b>Exhibit 1 — Balance sheet data (December 31)</b></p>
<table><tr><th>Item</th><th>2023</th><th>2024</th><th>2025</th></tr>
<tr><td>Cash</td><td>$40</td><td>$35</td><td>$30</td></tr>
<tr><td>Marketable securities</td><td>$20</td><td>$15</td><td>$10</td></tr>
<tr><td>Accounts receivable, net</td><td>$100</td><td>$120</td><td>$150</td></tr>
<tr><td>Inventory</td><td>$140</td><td>$160</td><td>$210</td></tr>
<tr><td>Prepaid expenses</td><td>$10</td><td>$10</td><td>$10</td></tr>
<tr><td>Current liabilities</td><td>$180</td><td>$200</td><td>$250</td></tr>
<tr><td>Long-term debt</td><td>$300</td><td>$320</td><td>$400</td></tr>
<tr><td>Stockholders' equity</td><td>$500</td><td>$520</td><td>$540</td></tr></table>
<p><b>Exhibit 2 — Income statement data</b></p>
<table><tr><th>Item</th><th>2024</th><th>2025</th></tr>
<tr><td>Net credit sales</td><td>$1,100</td><td>$1,215</td></tr>
<tr><td>Cost of goods sold</td><td>$750</td><td>$851</td></tr>
<tr><td>Earnings before interest and taxes (EBIT)</td><td>$120</td><td>$110</td></tr>
<tr><td>Interest expense</td><td>$24</td><td>$32</td></tr></table>
<p>Round ratios to two decimals and days to the nearest whole day.</p>
<p class="ja">Kestrel社はリボルビング与信枠の更新交渉中である。貸手のアナリストから2025年の主要比率を計算し2024年と比較するよう求められた。活動性比率には<b>平均</b>残高を用い、1年は<b>360日</b>とする。売上はすべて掛売上である。金額単位は千ドル。Exhibit 1は各年12月31日の貸借対照表データ(2023/2024/2025)、Exhibit 2は損益データ(2024/2025:掛売上高1,100/1,215、売上原価750/851、EBIT 120/110、支払利息24/32)である。比率は小数第2位、日数は整数に丸めよ。</p>`,
  rows: [
    { label: "Current ratio, 2025(2025年の流動比率)", type: "num", answer: 1.64, tol: 0.01 },
    { label: "Quick (acid-test) ratio, 2025(2025年の当座比率)", type: "num", answer: 0.76, tol: 0.01 },
    { label: "Days sales outstanding, 2025(2025年の売上債権回転日数)", type: "num", answer: 40, tol: 0.5 },
    { label: "Inventory turnover, 2025(2025年の棚卸資産回転率)", type: "num", answer: 4.6, tol: 0.01 },
    { label: "Times interest earned, 2025(2025年のインタレスト・カバレッジ・レシオ)", type: "num", answer: 3.44, tol: 0.01 },
    { label: "Total debt-to-equity ratio, 2025(2025年の負債資本比率)", type: "num", answer: 1.20, tol: 0.01 },
    { label: "Compared with 2024, the quick ratio and DSO indicate(2024年と比べた当座比率と売上債権回転日数の示す傾向)", type: "select", options: ["Improving liquidity and faster collections", "Weakening liquidity and slower collections", "Weakening liquidity but faster collections", "No meaningful change"], answer: "Weakening liquidity and slower collections" },
    { label: "Which loan covenant is most at risk if the 2025 trend continues?(2025年の傾向が続く場合、最も抵触リスクの高い財務制限条項)", type: "select", options: ["Minimum inventory turnover of 4.0", "Minimum times interest earned of 3.0", "Maximum DSO of 60 days", "Minimum current ratio of 1.25"], answer: "Minimum times interest earned of 3.0" },
  ],
  explain: `<p>2025年流動資産 = 30 + 10 + 150 + 210 + 10 = 410。流動比率 = 410 ÷ 250 = 1.64(2024年は340 ÷ 200 = 1.70)。</p>
<p>当座資産 = 現金30 + 有価証券10 + 売掛金150 = 190(棚卸資産と前払費用は除く)。当座比率 = 190 ÷ 250 = 0.76(2024年は170 ÷ 200 = 0.85)。</p>
<p>平均売掛金 = (120 + 150) ÷ 2 = 135。1日当たり売上 = 1,215 ÷ 360 = 3.375。DSO = 135 ÷ 3.375 = 40日(2024年は平均110 ÷ (1,100 ÷ 360) = 36日)。</p>
<p>平均棚卸資産 = (160 + 210) ÷ 2 = 185。回転率 = 851 ÷ 185 = 4.60回(2024年は750 ÷ 150 = 5.00回)。</p>
<p>TIE = EBIT 110 ÷ 支払利息32 = 3.44倍(2024年は120 ÷ 24 = 5.00倍)。負債資本比率 = (250 + 400) ÷ 540 = 1.20(2024年は520 ÷ 520 = 1.00)。</p>
<p>当座比率は0.85→0.76に低下し、DSOは36日→40日に長期化しているため、流動性は悪化し回収は遅くなっている。各制限条項との余裕を見ると、TIEは5.00→3.44と急低下しており下限3.0に最も近い。流動比率1.64(下限1.25)、DSO 40日(上限60日)、棚卸資産回転率4.60(下限4.0)はTIEほど逼迫していない。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-31", section: "BAR", chapter: "BAR-01", title: "取引が財務比率に与える影響(影響グリッド)",
  scenario: `<p>Before the transactions below, Plover Inc. reported the following (amounts in thousands):</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Cash</td><td>$100</td></tr>
<tr><td>Accounts receivable</td><td>$120</td></tr>
<tr><td>Inventory</td><td>$180</td></tr>
<tr><td>Total current assets</td><td>$400</td></tr>
<tr><td>Current liabilities</td><td>$200</td></tr>
<tr><td>Long-term debt</td><td>$300</td></tr>
<tr><td>Stockholders' equity</td><td>$600</td></tr></table>
<p>Thus the current ratio is 2.00, the quick ratio is 1.10, and the total debt-to-equity ratio is 0.83. Consider each transaction <b>independently</b>, starting from the balances above.</p>
<ol><li>Paid $50 of accounts payable in cash.</li>
<li>Purchased $40 of inventory on account.</li>
<li>Collected $30 of accounts receivable.</li>
<li>Sold inventory costing $60 for $90 on account (ignore income taxes).</li>
<li>Borrowed $100 cash on a five-year note payable.</li>
<li>Declared a $20 cash dividend, payable next month.</li></ol>
<p class="ja">下記取引前のPlover社の残高(千ドル)は上表のとおりで、流動比率2.00、当座比率1.10、負債資本比率0.83である。各取引は<b>独立</b>に、上記残高から生じるものとして考えよ。(1) 買掛金$50を現金で支払った。(2) 棚卸資産$40を掛けで仕入れた。(3) 売掛金$30を回収した。(4) 原価$60の商品を$90で掛販売した(法人税は無視)。(5) 5年満期の借入で現金$100を調達した。(6) 翌月支払の現金配当$20を宣言した。</p>`,
  rows: [
    { label: "Transaction 1 — effect on current ratio(取引1:流動比率への影響)", type: "select", options: ["Increase", "Decrease", "No effect"], answer: "Increase" },
    { label: "Transaction 2 — effect on current ratio(取引2:流動比率への影響)", type: "select", options: ["Increase", "Decrease", "No effect"], answer: "Decrease" },
    { label: "Transaction 2 — effect on quick ratio(取引2:当座比率への影響)", type: "select", options: ["Increase", "Decrease", "No effect"], answer: "Decrease" },
    { label: "Transaction 3 — effect on current ratio(取引3:流動比率への影響)", type: "select", options: ["Increase", "Decrease", "No effect"], answer: "No effect" },
    { label: "Transaction 4 — effect on quick ratio(取引4:当座比率への影響)", type: "select", options: ["Increase", "Decrease", "No effect"], answer: "Increase" },
    { label: "Transaction 5 — effect on debt-to-equity ratio(取引5:負債資本比率への影響)", type: "select", options: ["Increase", "Decrease", "No effect"], answer: "Increase" },
    { label: "Transaction 6 — effect on current ratio(取引6:流動比率への影響)", type: "select", options: ["Increase", "Decrease", "No effect"], answer: "Decrease" },
    { label: "Current ratio after transaction 1 only(取引1のみ実行後の流動比率)", type: "num", answer: 2.33, tol: 0.01 },
  ],
  explain: `<p>(1) 流動資産・流動負債がともに50減少:350 ÷ 150 = 2.33。比率が1を超える状態で分子分母を同額減らすと比率は上昇する。</p>
<p>(2) 流動資産・流動負債がともに40増加:440 ÷ 240 = 1.83で低下。当座資産は220のまま流動負債が240に増えるため当座比率も1.10→0.92に低下する。</p>
<p>(3) 現金と売掛金の振替であり流動資産総額は不変、流動比率は影響なし(当座比率も不変)。</p>
<p>(4) 売掛金+90、棚卸資産−60。当座資産は220→310となり当座比率は1.10→1.55に上昇する(流動資産も純額30増加)。</p>
<p>(5) 現金+100、長期負債+100。負債総額500→600、資本600不変で負債資本比率は0.83→1.00に上昇する(流動比率は500 ÷ 200 = 2.50に上昇)。</p>
<p>(6) 配当宣言で未払配当金(流動負債)+20、利益剰余金−20。流動資産は不変で流動負債が220となり、400 ÷ 220 = 1.82に低下する。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-32", section: "BAR", chapter: "BAR-01", title: "百分率損益計算書・趨勢分析と3要素デュポン",
  scenario: `<p>The CFO of Wren Outfitters asks for a common-size and horizontal analysis of the last two years, followed by a three-factor DuPont comparison. Amounts are in thousands; the income tax rate is 25%.</p>
<table><tr><th>Income statement</th><th>2024</th><th>2025</th></tr>
<tr><td>Net sales</td><td>$2,000</td><td>$2,300</td></tr>
<tr><td>Cost of goods sold</td><td>$1,200</td><td>$1,449</td></tr>
<tr><td>Selling, general and administrative</td><td>$500</td><td>$552</td></tr>
<tr><td>Depreciation</td><td>$100</td><td>$115</td></tr>
<tr><td>Interest expense</td><td>$40</td><td>$46</td></tr>
<tr><td>Income tax expense</td><td>$40</td><td>$34.5</td></tr></table>
<table><tr><th>Balance sheet averages</th><th>2024</th><th>2025</th></tr>
<tr><td>Average total assets</td><td>$1,600</td><td>$1,840</td></tr>
<tr><td>Average stockholders' equity</td><td>$800</td><td>$900</td></tr></table>
<p>Enter percentages as numbers rounded to one decimal (e.g., 12.5 for 12.5%). Round turnover to two decimals.</p>
<p class="ja">Wren Outfitters社のCFOから、直近2年間の百分率分析(共通規模分析)と趨勢分析(水平分析)、さらに3要素デュポン分析による比較を求められた。金額単位は千ドル、税率25%。損益計算書と期中平均の総資産・株主資本は上表のとおり。百分率は小数第1位の数値で(12.5%なら12.5)、回転率は小数第2位で答えよ。</p>`,
  rows: [
    { label: "Sales growth, 2025 vs 2024, %(売上高増加率、%)", type: "num", answer: 15.0, tol: 0.1 },
    { label: "Gross margin (common-size), 2025, %(2025年の売上総利益率、%)", type: "num", answer: 37.0, tol: 0.1 },
    { label: "Percentage change in operating income, 2025 vs 2024, %(営業利益の増減率、%。減少はマイナス)", type: "num", answer: -8.0, tol: 0.1 },
    { label: "Net profit margin, 2025, %(2025年の売上高純利益率、%)", type: "num", answer: 4.5, tol: 0.1 },
    { label: "Total asset turnover, 2025(2025年の総資産回転率)", type: "num", answer: 1.25, tol: 0.01 },
    { label: "Return on equity, 2025, %(2025年のROE、%)", type: "num", answer: 11.5, tol: 0.1 },
    { label: "The decline in operating margin is primarily caused by(営業利益率低下の主因)", type: "select", options: ["Higher cost of goods sold relative to sales", "Higher SG&A relative to sales", "Higher depreciation relative to sales", "Higher interest expense"], answer: "Higher cost of goods sold relative to sales" },
    { label: "Which DuPont component explains most of the decline in ROE from 2024?(ROE低下を主に説明するデュポン構成要素)", type: "select", options: ["Net profit margin", "Total asset turnover", "Equity multiplier", "Tax rate"], answer: "Net profit margin" },
  ],
  explain: `<p>2024年:売上総利益800(40.0%)、営業利益 = 800 − 500 − 100 = 200(10.0%)、税引前利益160、税40、純利益120(6.0%)。</p>
<p>2025年:売上総利益 = 2,300 − 1,449 = 851(37.0%)、SG&A 552(24.0%、前年25.0%)、減価償却115(5.0%、前年5.0%)、営業利益 = 851 − 552 − 115 = 184(8.0%)、税引前利益138、税34.5、純利益103.5(4.5%)。</p>
<p>売上増加率 = (2,300 − 2,000) ÷ 2,000 = 15.0%。営業利益増減率 = (184 − 200) ÷ 200 = −8.0%。</p>
<p>営業利益率は10.0%→8.0%と2ポイント低下した。売上総利益率が3ポイント低下(売上原価率60%→63%)した一方、SG&A比率は1ポイント改善、減価償却比率は不変であるため、主因は売上原価率の上昇である。</p>
<p>デュポン:2024年 = 6.0% × 1.25(2,000 ÷ 1,600)× 2.00(1,600 ÷ 800)= 15.0%。2025年 = 4.5% × 1.25(2,300 ÷ 1,840)× 2.04(1,840 ÷ 900)= 11.5%(= 103.5 ÷ 900)。回転率は不変、財務レバレッジはわずかに上昇しており、ROE低下は純利益率の低下で説明される。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-33", section: "BAR", chapter: "BAR-01", title: "ERMのリスク対応の分類と期待損失の評価",
  scenario: `<p>Heron Logistics is updating its risk register under the COSO <i>Enterprise Risk Management — Integrating with Strategy and Performance</i> (2017) framework.</p>
<p><b>Exhibit 1 — Excerpt from the risk committee minutes</b></p>
<table><tr><th>Item</th><th>Decision recorded</th></tr>
<tr><td>A</td><td>Purchase a cyber-liability insurance policy covering ransomware losses.</td></tr>
<tr><td>B</td><td>Close the subsidiary in a country where expropriation risk exceeds the board's risk appetite.</td></tr>
<tr><td>C</td><td>Install a second, geographically separate data center with automatic failover.</td></tr>
<tr><td>D</td><td>Minor fuel-price fluctuations are within risk appetite; take no action and continue monitoring.</td></tr>
<tr><td>E</td><td>Enter a new same-day delivery market, accepting higher operational risk to achieve higher performance targets.</td></tr></table>
<p><b>Exhibit 2 — Warehouse fire risk assessment</b></p>
<table><tr><th>Item</th><th>Value</th></tr>
<tr><td>Annual probability of a major fire (no new controls)</td><td>20%</td></tr>
<tr><td>Estimated loss if a fire occurs</td><td>$2,500,000</td></tr>
<tr><td>Annual probability with proposed sprinkler and monitoring system</td><td>5%</td></tr>
<tr><td>Annual cost of the proposed system</td><td>$200,000</td></tr></table>
<p class="ja">Heron Logistics社はCOSOの『全社的リスクマネジメント—戦略およびパフォーマンスとの統合』(2017年)に基づきリスク台帳を更新している。Exhibit 1はリスク委員会議事録の抜粋で、A:ランサムウェア損失を補償するサイバー保険に加入、B:収用リスクが取締役会のリスク選好を超える国の子会社を閉鎖、C:自動切替機能付きの地理的に離れた第2データセンターを設置、D:軽微な燃料価格変動はリスク選好の範囲内であり対応せずモニタリングを継続、E:より高い業績目標の達成のため、より高い業務リスクを受け入れて即日配送市場に参入、である。Exhibit 2は倉庫火災リスクの評価で、新規統制なしの年間発生確率20%、発生時の損失額$2,500,000、スプリンクラーと監視システム導入後の年間確率5%、システムの年間コスト$200,000である。</p>`,
  rows: [
    { label: "Item A — risk response(A:リスク対応)", type: "select", options: ["Accept", "Avoid", "Pursue", "Reduce", "Share"], answer: "Share" },
    { label: "Item B — risk response(B:リスク対応)", type: "select", options: ["Accept", "Avoid", "Pursue", "Reduce", "Share"], answer: "Avoid" },
    { label: "Item C — risk response(C:リスク対応)", type: "select", options: ["Accept", "Avoid", "Pursue", "Reduce", "Share"], answer: "Reduce" },
    { label: "Item D — risk response(D:リスク対応)", type: "select", options: ["Accept", "Avoid", "Pursue", "Reduce", "Share"], answer: "Accept" },
    { label: "Item E — risk response(E:リスク対応)", type: "select", options: ["Accept", "Avoid", "Pursue", "Reduce", "Share"], answer: "Pursue" },
    { label: "Annual expected loss from fire without new controls(新規統制なしの年間期待損失額)", type: "num", answer: 500000 },
    { label: "Annual expected loss with the proposed system (residual)(システム導入後の年間期待損失額)", type: "num", answer: 125000 },
    { label: "Annual net benefit of the proposed system(システム導入の年間純便益)", type: "num", answer: 175000 },
  ],
  explain: `<p>COSO ERM(2017)のリスク対応は受容(Accept)、回避(Avoid)、追求(Pursue)、低減(Reduce)、共有(Share)の5つである。</p>
<p>A:保険によって損失の一部を第三者に移転するので「共有」。B:リスクを生む活動自体から撤退するので「回避」。C:発生可能性・影響度を下げる統制を導入するので「低減」。D:リスク選好内であり追加対応をしないので「受容」。E:より高い業績を得るためにより大きなリスクを取りに行くので「追求」。</p>
<p>期待損失(統制なし)= 20% × 2,500,000 = 500,000。導入後 = 5% × 2,500,000 = 125,000。期待損失の減少額375,000からシステムコスト200,000を差し引いた純便益は175,000であり、費用対効果の観点から導入が支持される。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-34", section: "BAR", chapter: "BAR-01", title: "回帰分析の出力表の解釈(製造間接費の予測)",
  scenario: `<p>A staff analyst at Osprey Manufacturing ran a multiple regression of monthly factory overhead cost on machine hours and number of production setups using 15 months of data. The output is shown below.</p>
<p><b>Exhibit 1 — Regression statistics</b></p>
<table><tr><th>Statistic</th><th>Value</th></tr>
<tr><td>R-squared</td><td>0.86</td></tr>
<tr><td>Adjusted R-squared</td><td>0.83</td></tr>
<tr><td>Standard error of the estimate</td><td>$2,150</td></tr>
<tr><td>Observations</td><td>15</td></tr></table>
<p><b>Exhibit 2 — Coefficients</b></p>
<table><tr><th>Variable</th><th>Coefficient</th><th>Standard error</th><th>t-stat</th><th>p-value</th></tr>
<tr><td>Intercept</td><td>12,500</td><td>3,100</td><td>4.03</td><td>0.002</td></tr>
<tr><td>Machine hours</td><td>8.40</td><td>1.20</td><td>7.00</td><td>&lt;0.001</td></tr>
<tr><td>Number of setups</td><td>145</td><td>160</td><td>0.91</td><td>0.380</td></tr></table>
<p><b>Exhibit 3 — E-mail from the controller</b></p>
<p><i>"Next month we expect 4,000 machine hours and 30 setups. Please give me the overhead estimate from the full model, and tell me whether we should keep both drivers."</i></p>
<p class="ja">Osprey Manufacturing社のアナリストが、15か月分のデータを用い、月次製造間接費を機械稼働時間と段取回数で説明する重回帰分析を行った。Exhibit 1は回帰統計量(決定係数0.86、自由度調整済決定係数0.83、推定値の標準誤差$2,150、観測数15)、Exhibit 2は係数表(切片12,500/標準誤差3,100/t値4.03/p値0.002、機械稼働時間8.40/1.20/7.00/0.001未満、段取回数145/160/0.91/0.380)である。Exhibit 3はコントローラーからのメールで「来月は機械稼働時間4,000時間、段取30回を見込んでいる。全変数モデルによる間接費の見積りと、両方の要因を残すべきか教えてほしい」とある。</p>`,
  rows: [
    { label: "Estimated overhead for next month using the full model(全変数モデルによる来月の間接費見積額)", type: "num", answer: 50450 },
    { label: "Expected increase in overhead from 500 additional machine hours, holding setups constant(段取回数一定で機械稼働時間が500時間増えた場合の間接費増加額)", type: "num", answer: 4200 },
    { label: "Interpretation of the R-squared of 0.86(決定係数0.86の解釈)", type: "select", options: ["86% of the variation in overhead is explained by the independent variables", "The model's predictions are accurate 86% of the time", "Overhead and machine hours have a correlation coefficient of 0.86", "There is an 86% probability that the coefficients are correct"], answer: "86% of the variation in overhead is explained by the independent variables" },
    { label: "Which variable is NOT statistically significant at the 5% level?(5%水準で統計的に有意でない変数)", type: "select", options: ["Intercept", "Machine hours", "Number of setups", "All variables are significant"], answer: "Number of setups" },
    { label: "Best interpretation of the intercept of $12,500(切片$12,500の最も適切な解釈)", type: "select", options: ["Estimated monthly fixed overhead, reliable only within the relevant range", "Variable overhead per machine hour", "Total overhead at the average activity level", "The standard error of the overhead estimate"], answer: "Estimated monthly fixed overhead, reliable only within the relevant range" },
    { label: "If machine hours and setups are highly correlated with each other, the model suffers from(機械稼働時間と段取回数が互いに高い相関を持つ場合の問題)", type: "select", options: ["Multicollinearity", "Heteroscedasticity", "Autocorrelation", "Overfitting due to too many observations"], answer: "Multicollinearity" },
    { label: "Best visualization to show the controller the relationship between machine hours and overhead(機械稼働時間と間接費の関係を示すのに最適な可視化)", type: "select", options: ["Scatter plot with a fitted trend line", "Pie chart", "Stacked area chart", "Treemap"], answer: "Scatter plot with a fitted trend line" },
  ],
  explain: `<p>見積額 = 12,500 + 8.40 × 4,000 + 145 × 30 = 12,500 + 33,600 + 4,350 = 50,450。</p>
<p>偏回帰係数8.40は、他の変数を一定としたときの機械稼働時間1時間当たりの間接費増加額である。500時間 × 8.40 = 4,200。</p>
<p>決定係数(R²)は従属変数の変動のうち独立変数で説明される割合を表す。予測の的中率や相関係数そのものではない(単回帰でもR²は相関係数の2乗である)。</p>
<p>段取回数のt値は145 ÷ 160 = 0.91で、p値0.380 > 0.05のため有意でない。切片(p = 0.002)と機械稼働時間(p < 0.001)は有意である。したがって段取回数を除いたモデルの検討が考えられる。</p>
<p>切片は操業度ゼロのときの推定間接費、すなわち月次固定費の推定値と解釈されるが、ゼロ操業はデータの関連範囲外であるため慎重に扱う。</p>
<p>独立変数同士の相関が高い状態は多重共線性であり、個々の係数の標準誤差が大きくなりt値が小さくなる(段取回数の非有意の一因となり得る)。2つの連続変数の関係を示すには散布図(近似直線付き)が最適である。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-35", section: "BAR", chapter: "BAR-01", title: "データ品質の問題の識別と可視化手法の選択",
  scenario: `<p>Before building a sales dashboard, the internal audit analytics team at Finch Retail extracted March 2026 sales data on <b>April 5, 2026</b>. The company's data standards require: every field populated; two-letter USPS state codes; one row per invoice; sale quantities and amounts greater than zero; and transaction dates within the extraction period. When an invoice appears more than once, treat its first occurrence as the valid record.</p>
<p><b>Exhibit 1 — Sample of extracted records</b></p>
<table><tr><th>Row</th><th>Invoice</th><th>Date</th><th>Customer</th><th>Region</th><th>State</th><th>Qty</th><th>Amount</th></tr>
<tr><td>1</td><td>INV-1001</td><td>2026-03-02</td><td>C-210</td><td>West</td><td>CA</td><td>10</td><td>$1,200</td></tr>
<tr><td>2</td><td>INV-1002</td><td>2026-03-02</td><td>C-115</td><td></td><td>TX</td><td>5</td><td>$600</td></tr>
<tr><td>3</td><td>INV-1003</td><td>2026-03-03</td><td>C-302</td><td>East</td><td>N.Y.</td><td>8</td><td>$960</td></tr>
<tr><td>4</td><td>INV-1004</td><td>2026-03-05</td><td>C-118</td><td>South</td><td>FL</td><td>3</td><td>$360</td></tr>
<tr><td>5</td><td>INV-1004</td><td>2026-03-05</td><td>C-118</td><td>South</td><td>FL</td><td>3</td><td>$360</td></tr>
<tr><td>6</td><td>INV-1005</td><td>2026-03-09</td><td>C-207</td><td>West</td><td>WA</td><td>−4</td><td>−$480</td></tr>
<tr><td>7</td><td>INV-1006</td><td>2027-03-11</td><td>C-140</td><td>Central</td><td>IL</td><td>6</td><td>$720</td></tr>
<tr><td>8</td><td>INV-1007</td><td>2026-03-12</td><td>C-221</td><td>West</td><td>OR</td><td>2</td><td>$240</td></tr></table>
<p class="ja">Finch Retail社の内部監査データ分析チームは、売上ダッシュボード作成に先立ち<b>2026年4月5日</b>に2026年3月の売上データを抽出した。同社のデータ基準は、全項目入力済み、州コードはUSPSの2文字コード、請求書1件につき1行、販売数量・金額はゼロ超、取引日は抽出対象期間内であることを求めている。同一請求書が複数行ある場合は最初の行を有効なレコードとして扱う。Exhibit 1は抽出レコードのサンプル(行1〜8)である。</p>`,
  rows: [
    { label: "Row 2 — primary data quality dimension violated(行2:主に損なわれているデータ品質の側面)", type: "select", options: ["Completeness", "Consistency", "Uniqueness", "Validity"], answer: "Completeness" },
    { label: "Row 3 — primary data quality dimension violated(行3:主に損なわれているデータ品質の側面)", type: "select", options: ["Completeness", "Consistency", "Uniqueness", "Timeliness"], answer: "Consistency" },
    { label: "Row 5 — primary data quality dimension violated(行5:主に損なわれているデータ品質の側面)", type: "select", options: ["Completeness", "Consistency", "Uniqueness", "Validity"], answer: "Uniqueness" },
    { label: "Row 6 — primary data quality dimension violated(行6:主に損なわれているデータ品質の側面)", type: "select", options: ["Completeness", "Consistency", "Uniqueness", "Validity"], answer: "Validity" },
    { label: "Number of rows in the sample that meet all data standards(全基準を満たす行数)", type: "num", answer: 3 },
    { label: "Visualization to show monthly revenue over the past 24 months(過去24か月の月次売上推移を示す可視化)", type: "select", options: ["Line chart", "Pie chart", "Scatter plot", "Histogram"], answer: "Line chart" },
    { label: "Visualization to show the distribution of invoice amounts and spot outliers(請求金額の分布と外れ値を示す可視化)", type: "select", options: ["Line chart", "Pie chart", "Box plot or histogram", "Bullet chart"], answer: "Box plot or histogram" },
    { label: "Visualization to compare March revenue across the four regions(4地域の3月売上を比較する可視化)", type: "select", options: ["Bar chart", "Scatter plot", "Line chart", "Histogram"], answer: "Bar chart" },
  ],
  explain: `<p>行2:地域(Region)が空欄であり、全項目入力の要件に反する(完全性)。</p>
<p>行3:州コードが「N.Y.」で、他の行の2文字コード(NY)と表記が統一されていない(一貫性)。なお書式規則への不適合は妥当性に分類されることもあるため、本行の選択肢には妥当性を含めていない。</p>
<p>行5:行4と請求書番号を含め全項目が同一の重複行であり、1請求書1行の要件に反する(一意性)。行4自体は最初の出現であり基準を満たす。</p>
<p>行6:販売取引で数量・金額がマイナスであり、許容値の範囲外である(妥当性)。行7も取引日2027-03-11が抽出期間(2026年3月)外かつ抽出日より後であり、妥当性の問題がある。</p>
<p>全基準を満たす行は行1・行4・行8の3行である(行2、3、5、6、7は問題あり)。</p>
<p>可視化:時系列の推移には折れ線グラフ、分布と外れ値の把握には箱ひげ図またはヒストグラム、カテゴリ間の数量比較には棒グラフが適している。円グラフは構成比向けで推移・分布の表示には向かない。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-36", section: "BAR", chapter: "BAR-01", title: "バランスト・スコアカードの視点分類と製造サイクル効率",
  scenario: `<p>Sparrow Components is redesigning its balanced scorecard. The strategy team proposed the measures listed below and provided time data for its main product line.</p>
<p><b>Exhibit 1 — Proposed measures</b></p>
<table><tr><th>Measure</th><th>Description</th></tr>
<tr><td>M1</td><td>Average training hours per production employee</td></tr>
<tr><td>M2</td><td>Percentage of prior-year customers who placed orders this year</td></tr>
<tr><td>M3</td><td>Economic value added (EVA) of the components division</td></tr>
<tr><td>M4</td><td>Defective units per million produced</td></tr>
<tr><td>M5</td><td>Voluntary employee turnover rate</td></tr></table>
<p><b>Exhibit 2 — Average time per production batch (hours)</b></p>
<table><tr><th>Activity</th><th>Hours</th></tr>
<tr><td>Processing</td><td>3.0</td></tr>
<tr><td>Inspection</td><td>0.5</td></tr>
<tr><td>Move</td><td>1.0</td></tr>
<tr><td>Queue (waiting)</td><td>5.5</td></tr></table>
<p class="ja">Sparrow Components社はバランスト・スコアカードを再設計している。Exhibit 1は戦略チームが提案した指標(M1:製造従業員1人当たり平均研修時間、M2:前年の顧客のうち当年も発注した割合、M3:部品事業部の経済的付加価値(EVA)、M4:生産100万個当たり不良品数、M5:自発的離職率)、Exhibit 2は主力製品ラインのバッチ当たり平均時間(加工3.0、検査0.5、運搬1.0、待機5.5時間)である。</p>`,
  rows: [
    { label: "M1 — scorecard perspective(M1:視点)", type: "select", options: ["Financial", "Customer", "Internal business process", "Learning and growth"], answer: "Learning and growth" },
    { label: "M2 — scorecard perspective(M2:視点)", type: "select", options: ["Financial", "Customer", "Internal business process", "Learning and growth"], answer: "Customer" },
    { label: "M3 — scorecard perspective(M3:視点)", type: "select", options: ["Financial", "Customer", "Internal business process", "Learning and growth"], answer: "Financial" },
    { label: "M4 — scorecard perspective(M4:視点)", type: "select", options: ["Financial", "Customer", "Internal business process", "Learning and growth"], answer: "Internal business process" },
    { label: "M5 — scorecard perspective(M5:視点)", type: "select", options: ["Financial", "Customer", "Internal business process", "Learning and growth"], answer: "Learning and growth" },
    { label: "Throughput (manufacturing cycle) time per batch, hours(バッチ当たりスループット時間、時間)", type: "num", answer: 10, tol: 0.01 },
    { label: "Manufacturing cycle efficiency (MCE), as a decimal(製造サイクル効率、小数)", type: "num", answer: 0.30, tol: 0.01 },
    { label: "Which measure is best described as a lagging indicator?(遅行指標として最も適切なもの)", type: "select", options: ["M1 — training hours", "M3 — economic value added", "M4 — defect rate", "M5 — employee turnover"], answer: "M3 — economic value added" },
  ],
  explain: `<p>M1(研修時間)とM5(離職率)は人材・組織能力に関する指標で学習と成長の視点。M2(顧客維持率)は顧客の視点。M3(EVA)は株主価値に関する財務の視点。M4(不良率)は業務プロセスの品質を測る社内ビジネス・プロセスの視点である。</p>
<p>スループット時間 = 加工3.0 + 検査0.5 + 運搬1.0 + 待機5.5 = 10.0時間。</p>
<p>MCE = 付加価値時間(加工時間)÷ スループット時間 = 3.0 ÷ 10.0 = 0.30。検査・運搬・待機は非付加価値時間であり、削減によりMCEが改善する。</p>
<p>BSCでは学習と成長→業務プロセス→顧客→財務の因果連鎖を想定し、財務指標は過去の意思決定の結果を示す遅行指標である。研修時間・不良率・離職率は将来の財務成果を先取りする先行指標と位置付けられる。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-37", section: "BAR", chapter: "BAR-01", title: "遊休生産能力がある場合の予測財務諸表と追加必要資金",
  scenario: `<p>Tern Industries forecasts that 2026 sales will grow 25% from 2025 sales of $8,000 (in thousands). Fixed assets operated at only <b>80% of capacity</b> in 2025. Current assets and spontaneous liabilities (accounts payable and accruals) vary directly with sales. The net profit margin is expected to remain 5% and the dividend payout ratio 40%. Notes payable, long-term debt and common stock will not change unless additional financing is arranged.</p>
<p><b>Exhibit — Balance sheet, December 31, 2025 (thousands)</b></p>
<table><tr><th>Assets</th><th>Amount</th><th>Liabilities and equity</th><th>Amount</th></tr>
<tr><td>Current assets</td><td>$2,400</td><td>Accounts payable and accruals</td><td>$800</td></tr>
<tr><td>Net fixed assets</td><td>$3,200</td><td>Notes payable</td><td>$600</td></tr>
<tr><td></td><td></td><td>Long-term debt</td><td>$1,400</td></tr>
<tr><td></td><td></td><td>Common stock</td><td>$1,000</td></tr>
<tr><td></td><td></td><td>Retained earnings</td><td>$1,800</td></tr>
<tr><td>Total</td><td>$5,600</td><td>Total</td><td>$5,600</td></tr></table>
<p>Enter all amounts in thousands.</p>
<p class="ja">Tern Industries社は2026年の売上高が2025年の$8,000(千ドル)から25%増加すると予測している。2025年の固定資産の稼働率は<b>80%</b>にとどまっていた。流動資産と自発的負債(買掛金・未払費用)は売上高に比例して変動する。売上高純利益率5%、配当性向40%は維持される見込みである。短期借入金、長期負債、普通株式は追加調達をしない限り変わらない。2025年12月31日の貸借対照表は上表のとおり。金額はすべて千ドル単位で答えよ。</p>`,
  rows: [
    { label: "Full-capacity sales level(フル稼働時の売上高)", type: "num", answer: 10000 },
    { label: "Required increase in net fixed assets for 2026(2026年に必要な固定資産の増加額)", type: "num", answer: 0 },
    { label: "Pro forma current assets, 2026(2026年の予測流動資産)", type: "num", answer: 3000 },
    { label: "Pro forma total assets, 2026(2026年の予測総資産)", type: "num", answer: 6200 },
    { label: "Addition to retained earnings, 2026(2026年の内部留保増加額)", type: "num", answer: 300 },
    { label: "Additional funds needed (AFN)(追加必要資金)", type: "num", answer: 100 },
    { label: "AFN if fixed assets had been operating at full capacity in 2025(2025年に固定資産がフル稼働だった場合のAFN)", type: "num", answer: 900 },
    { label: "Which change, by itself, would reduce AFN?(単独でAFNを減少させる変化)", type: "select", options: ["A lower dividend payout ratio", "A higher growth rate in sales", "A lower ratio of spontaneous liabilities to sales", "A higher ratio of current assets to sales"], answer: "A lower dividend payout ratio" },
  ],
  explain: `<p>フル稼働売上高 = 現在の売上高 ÷ 稼働率 = 8,000 ÷ 0.80 = 10,000。2026年売上高 = 8,000 × 1.25 = 10,000であり、現有の固定資産で対応できるため固定資産の追加は0である。</p>
<p>流動資産は売上高の30%(2,400 ÷ 8,000)。予測流動資産 = 10,000 × 30% = 3,000(増加600)。予測総資産 = 3,000 + 3,200 = 6,200。</p>
<p>自発的負債は売上高の10%:10,000 × 10% = 1,000(増加200)。内部留保増加 = 10,000 × 5% × (1 − 0.40) = 300。</p>
<p>AFN = 資産増加600 − 自発的負債増加200 − 内部留保300 = 100(検算:予測負債・資本 = 1,000 + 600 + 1,400 + 1,000 + 2,100 = 6,100、6,200 − 6,100 = 100)。</p>
<p>フル稼働の場合、固定資産も売上高の40%(3,200 ÷ 8,000)で比例増加し、増加額は2,000 × 40% = 800。AFN = (600 + 800) − 200 − 300 = 900。遊休能力の存在によりAFNが800減少している。</p>
<p>配当性向の引下げは内部留保を増やしAFNを減少させる。売上成長率の上昇、自発的負債比率の低下、流動資産比率の上昇はいずれもAFNを増加させる。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-38", section: "BAR", chapter: "BAR-01", title: "価格・所得・交差弾力性と実質GDP成長率",
  scenario: `<p>The planning group at Lark Beverages is preparing assumptions for next year's budget.</p>
<p><b>Exhibit 1 — Price test for Lark's sparkling water (one region)</b></p>
<table><tr><th>Item</th><th>Before</th><th>After</th></tr>
<tr><td>Price per case</td><td>$40</td><td>$36</td></tr>
<tr><td>Cases sold per month</td><td>10,000</td><td>12,000</td></tr></table>
<p><b>Exhibit 2 — Market research memo</b></p>
<p><i>"When regional household income rose 5%, monthly demand for Lark's private-label economy soda fell 2%. When a competitor raised the price of its sparkling water by 10%, demand for Lark's sparkling water rose 6%, other factors held constant."</i></p>
<p><b>Exhibit 3 — Macroeconomic data (billions)</b></p>
<table><tr><th>Item</th><th>2024</th><th>2025</th></tr>
<tr><td>Nominal GDP</td><td>$21,000</td><td>$23,100</td></tr>
<tr><td>GDP price deflator (base year = 100)</td><td>120</td><td>125</td></tr></table>
<p>Use the midpoint (arc) method for the price elasticity. Round elasticities to two decimals and percentages to one decimal.</p>
<p class="ja">Lark Beverages社の計画グループは来年度予算の前提を作成している。Exhibit 1はある地域での炭酸水の価格テスト(1ケース$40→$36、月間販売数10,000→12,000ケース)である。Exhibit 2の市場調査メモには「地域の世帯所得が5%上昇したとき、同社のプライベートブランドの廉価ソーダの月間需要は2%減少した。競合他社が炭酸水の価格を10%引き上げたとき、他の条件を一定として当社の炭酸水の需要は6%増加した」とある。Exhibit 3はマクロ経済データ(名目GDP 2024年21,000、2025年23,100(十億ドル)、GDPデフレーター120、125)である。価格弾力性は中間点(弧)法で求め、弾力性は小数第2位、百分率は小数第1位に丸めよ。</p>`,
  rows: [
    { label: "Price elasticity of demand, absolute value (midpoint method)(需要の価格弾力性の絶対値、中間点法)", type: "num", answer: 1.73, tol: 0.01 },
    { label: "Demand for sparkling water over this price range is(この価格帯での炭酸水の需要)", type: "select", options: ["Elastic", "Inelastic", "Unit elastic", "Perfectly inelastic"], answer: "Elastic" },
    { label: "Change in monthly total revenue from the price cut, $(値下げによる月間総収入の変化額、$。減少はマイナス)", type: "num", answer: 32000 },
    { label: "Income elasticity of demand for the economy soda(廉価ソーダの需要の所得弾力性)", type: "num", answer: -0.4, tol: 0.01 },
    { label: "The economy soda is classified as(廉価ソーダの財の分類)", type: "select", options: ["A normal good", "An inferior good", "A luxury good", "A complementary good"], answer: "An inferior good" },
    { label: "Lark's and the competitor's sparkling waters are(当社と競合他社の炭酸水の関係)", type: "select", options: ["Substitutes", "Complements", "Unrelated goods", "Inferior goods"], answer: "Substitutes" },
    { label: "Real GDP growth rate, 2025, %(2025年の実質GDP成長率、%)", type: "num", answer: 5.6, tol: 0.1 },
    { label: "Which is generally classified as a leading economic indicator?(一般に先行指標に分類されるもの)", type: "select", options: ["Building permits for new private housing", "Average duration of unemployment", "Industrial production", "Average prime rate charged by banks"], answer: "Building permits for new private housing" },
  ],
  explain: `<p>中間点法:数量変化率 = (12,000 − 10,000) ÷ 11,000 = 18.18%、価格変化率 = (36 − 40) ÷ 38 = −10.53%。弾力性 = 18.18 ÷ 10.53 ≒ 1.73(絶対値)。1を超えるため弾力的である。</p>
<p>総収入:値下げ前40 × 10,000 = 400,000、値下げ後36 × 12,000 = 432,000、増加額32,000。弾力的な需要では値下げにより総収入が増加する(弾力性の判定と整合)。</p>
<p>所得弾力性 = 需要変化率 ÷ 所得変化率 = −2% ÷ 5% = −0.40。負であるため下級財(劣等財)である(正常財は正、奢侈品は1超)。</p>
<p>交差弾力性 = +6% ÷ +10% = +0.60。正であるため代替財である(補完財は負)。</p>
<p>実質GDP = 名目GDP ÷ (デフレーター ÷ 100)。2024年 = 21,000 ÷ 1.20 = 17,500、2025年 = 23,100 ÷ 1.25 = 18,480。成長率 = (18,480 − 17,500) ÷ 17,500 = 5.6%(名目成長率10.0%のうち物価上昇分を除いたもの)。</p>
<p>住宅着工許可件数は景気に先行する先行指標である。失業の平均継続期間とプライムレートは遅行指標、鉱工業生産は一致指標である。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-39", section: "BAR", chapter: "BAR-01", title: "キャッシュ・コンバージョン・サイクルとEOQ・発注点",
  scenario: `<p>The treasurer of Robin Appliances wants to shorten the cash conversion cycle and tighten inventory management of its key component, a control board.</p>
<p><b>Exhibit 1 — Annual financial data (365-day year)</b></p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Net credit sales</td><td>$4,380,000</td></tr>
<tr><td>Cost of goods sold</td><td>$3,650,000</td></tr>
<tr><td>Average inventory</td><td>$600,000</td></tr>
<tr><td>Average accounts receivable</td><td>$540,000</td></tr>
<tr><td>Average accounts payable</td><td>$350,000</td></tr></table>
<p><b>Exhibit 2 — Control board data</b></p>
<table><tr><th>Item</th><th>Value</th></tr>
<tr><td>Annual usage</td><td>40,000 units</td></tr>
<tr><td>Cost of placing one order</td><td>$50</td></tr>
<tr><td>Annual carrying cost per unit</td><td>$4</td></tr>
<tr><td>Working days per year</td><td>250</td></tr>
<tr><td>Supplier lead time</td><td>5 working days</td></tr>
<tr><td>Safety stock</td><td>300 units</td></tr></table>
<p>Use cost of goods sold to compute days payables outstanding.</p>
<p class="ja">Robin Appliances社の財務担当役員は、キャッシュ・コンバージョン・サイクルの短縮と主要部品(制御基板)の在庫管理の強化を図りたい。Exhibit 1は年間財務データ(1年365日:掛売上高$4,380,000、売上原価$3,650,000、平均棚卸資産$600,000、平均売掛金$540,000、平均買掛金$350,000)、Exhibit 2は制御基板のデータ(年間使用量40,000個、1回の発注費$50、1個当たり年間保管費$4、年間稼働日250日、調達リードタイム5稼働日、安全在庫300個)である。仕入債務回転日数は売上原価を用いて計算せよ。</p>`,
  rows: [
    { label: "Days inventory outstanding(棚卸資産回転日数)", type: "num", answer: 60, tol: 0.5 },
    { label: "Days sales outstanding(売上債権回転日数)", type: "num", answer: 45, tol: 0.5 },
    { label: "Days payables outstanding(仕入債務回転日数)", type: "num", answer: 35, tol: 0.5 },
    { label: "Cash conversion cycle, days(キャッシュ・コンバージョン・サイクル、日)", type: "num", answer: 70, tol: 0.5 },
    { label: "Economic order quantity, units(経済的発注量、個)", type: "num", answer: 1000 },
    { label: "Total annual ordering and carrying cost at the EOQ (excluding safety stock)(EOQにおける年間発注費・保管費合計、安全在庫分を除く)", type: "num", answer: 4000 },
    { label: "Reorder point, units(発注点、個)", type: "num", answer: 1100 },
    { label: "If Robin negotiates supplier terms that extend DPO to 50 days, all else equal, the CCC will(仕入債務回転日数を50日に延長できた場合のCCC)", type: "select", options: ["Decrease to 55 days", "Increase to 85 days", "Decrease to 20 days", "Not change"], answer: "Decrease to 55 days" },
  ],
  explain: `<p>DIO = 平均棚卸資産 ÷ (売上原価 ÷ 365) = 600,000 ÷ 10,000 = 60日。DSO = 540,000 ÷ (4,380,000 ÷ 365 = 12,000) = 45日。DPO = 350,000 ÷ 10,000 = 35日。</p>
<p>CCC = DIO + DSO − DPO = 60 + 45 − 35 = 70日。</p>
<p>EOQ = √(2 × 年間需要 × 発注費 ÷ 保管費) = √(2 × 40,000 × 50 ÷ 4) = √1,000,000 = 1,000個。</p>
<p>発注回数 = 40,000 ÷ 1,000 = 40回、発注費 = 40 × 50 = 2,000。平均在庫(安全在庫除く)= 1,000 ÷ 2 = 500個、保管費 = 500 × 4 = 2,000。合計4,000(EOQでは発注費と保管費が等しい)。</p>
<p>1日当たり使用量 = 40,000 ÷ 250 = 160個。発注点 = 160 × 5日 + 安全在庫300 = 800 + 300 = 1,100個。</p>
<p>DPOを50日に延長すると CCC = 60 + 45 − 50 = 55日に短縮される(ただし早期支払割引の喪失や仕入先との関係悪化のコストを考慮する必要がある)。</p>`,
});
