// 選択科目(Discipline):BAR / ISC / TCP。受験者は3つのうち1つを選んで受験する。

CPA.section({
  id: "BAR",
  name: "Business Analysis and Reporting",
  ja: "ビジネス分析と報告",
  kind: "選択(Discipline)",
  color: "#7c3aed",
  exam: { hours: 4, mcq: 50, tbs: 7, weight: "MC 50% / TBS 50%" },
  summary: "財務分析・管理会計・意思決定、FARの発展論点(企業結合、デリバティブとヘッジ、株式報酬など)、州・地方政府会計の発展論点。FARの延長として選ぶ人が多い。",
  chapters: [
    {
      id: "BAR-01",
      title: "経営分析と管理会計",
      en: "Business Analysis and Managerial Accounting",
      note: `
<h3>1. 主な財務比率</h3>
<table><tr><th>比率</th><th>計算式</th></tr>
<tr><td>流動比率(Current ratio)</td><td>流動資産 ÷ 流動負債</td></tr>
<tr><td>当座比率(Quick ratio)</td><td>(現金+市場性有価証券+売掛金)÷ 流動負債 ※棚卸資産・前払費用を除く</td></tr>
<tr><td>棚卸資産回転率</td><td>売上原価 ÷ 平均棚卸資産。回転日数 = 365 ÷ 回転率</td></tr>
<tr><td>売掛金回転率</td><td>売上高 ÷ 平均売掛金</td></tr>
<tr><td>ROE(デュポン分析)</td><td>売上高利益率 × 総資産回転率 × 財務レバレッジ(総資産 ÷ 自己資本)</td></tr></table>

<h3>2. CVP分析(損益分岐点)</h3>
<div class="pt">単位当たり貢献利益(CM)= 販売価格 − 単位変動費<br>
損益分岐点販売量 = 固定費 ÷ 単位CM<br>
目標利益達成販売量 = (固定費 + 目標利益)÷ 単位CM<br>
安全余裕率 = (実際売上 − 損益分岐点売上)÷ 実際売上</div>
<p class="ex">例:固定費 $120,000、価格 $50、変動費 $30 → CM $20 → 損益分岐点 <b>6,000個</b>、目標利益 $40,000 なら <b>8,000個</b></p>

<h3>3. 差異分析(標準原価計算)</h3>
<ul>
<li>材料価格差異 = (実際価格 − 標準価格)× 実際購入量</li>
<li>材料数量差異 = (実際使用量 − 標準許容量)× 標準価格</li>
<li>実際が標準より高い(多い)→ 不利差異(<span class="en">Unfavorable</span>)</li>
</ul>

<h3>4. 設備投資の意思決定</h3>
<table><tr><th>手法</th><th>特徴</th></tr>
<tr><td>正味現在価値(NPV)</td><td>CFの現在価値 − 初期投資。<b>NPV > 0 なら採用</b>。貨幣の時間価値を考慮</td></tr>
<tr><td>内部収益率(IRR)</td><td>NPV = 0 となる割引率。資本コストを上回れば採用</td></tr>
<tr><td>回収期間法(Payback)</td><td>初期投資 ÷ 年間CF。<b>時間価値と回収後のCFを無視</b></td></tr>
<tr><td>会計的利益率(ARR)</td><td>平均利益 ÷ 投資額。時間価値を無視</td></tr></table>
<p class="ex">例:初期投資 $100,000、年CF $30,000 × 5年、10%の年金現価係数 3.791 → NPV = 113,730 − 100,000 = <b>$13,730</b>、回収期間 3.33年</p>
`,
      mcq: [
        {
          q: "A company has current assets of $300,000 (including inventory of $120,000 and prepaid expenses of $30,000) and current liabilities of $150,000. What is the quick ratio?",
          ja: "ある会社の流動資産は$300,000(うち棚卸資産$120,000、前払費用$30,000)、流動負債は$150,000である。当座比率はいくらか。",
          c: ["2.0", "1.2", "1.0", "0.8"],
          a: 2,
          ex: "当座資産 = 300,000 − 120,000 − 30,000 = 150,000。当座比率 = 150,000 ÷ 150,000 = 1.0。流動比率なら2.0。",
        },
        {
          q: "A product sells for $50 per unit with variable costs of $30 per unit. Fixed costs are $120,000. How many units must be sold to break even?",
          ja: "製品の販売価格は1個$50、変動費は1個$30、固定費は$120,000である。損益分岐点の販売量は何個か。",
          c: ["2,400", "4,000", "6,000", "8,000"],
          a: 2,
          ex: "単位貢献利益 = 50 − 30 = 20。損益分岐点 = 120,000 ÷ 20 = 6,000個。",
        },
        {
          q: "Using the same data (price $50, variable cost $30, fixed costs $120,000), how many units must be sold to earn a target profit of $40,000?",
          ja: "同じデータ(価格$50、変動費$30、固定費$120,000)で、目標利益$40,000を達成するには何個販売する必要があるか。",
          c: ["6,000", "7,000", "8,000", "10,000"],
          a: 2,
          ex: "(固定費 + 目標利益)÷ 単位貢献利益 = (120,000 + 40,000)÷ 20 = 8,000個。",
        },
        {
          q: "A company purchased 10,000 pounds of material at $4.20 per pound. The standard price is $4.00 per pound. What is the material price variance?",
          ja: "ある会社は材料10,000ポンドを1ポンド$4.20で購入した。標準価格は1ポンド$4.00である。材料価格差異はいくらか。",
          c: ["$2,000 favorable", "$2,000 unfavorable", "$4,200 unfavorable", "$200 unfavorable"],
          a: 1,
          ex: "(4.20 − 4.00)× 10,000 = $2,000。実際価格が標準より高いので不利差異。",
        },
        {
          q: "A project requires an initial investment of $100,000 and generates annual cash inflows of $30,000 for 5 years. The present value of an ordinary annuity of $1 for 5 periods at 10% is 3.791. What is the net present value at 10%?",
          ja: "あるプロジェクトは初期投資$100,000で、5年間毎年$30,000のキャッシュインフローを生む。10%・5期の年金現価係数は3.791である。10%での正味現在価値はいくらか。",
          c: ["$50,000", "$13,730", "$(13,730)", "$37,910"],
          a: 1,
          ex: "CFの現在価値 = 30,000 × 3.791 = 113,730。NPV = 113,730 − 100,000 = $13,730(正なので採用)。",
        },
        {
          q: "Which of the following is a limitation of the payback method?",
          ja: "次のうち、回収期間法の欠点はどれか。",
          c: [
            "It requires an estimate of the cost of capital",
            "It ignores cash flows after the payback period and the time value of money",
            "It is difficult to compute",
            "It always favors long-term projects",
          ],
          a: 1,
          ex: "単純な回収期間法は貨幣の時間価値と回収後のキャッシュフローを無視する。資本コストは不要で、計算は簡単。",
        },
        {
          q: "Under DuPont analysis, return on equity equals:",
          ja: "デュポン分析において、ROEは何に等しいか。",
          c: [
            "Net profit margin × asset turnover × equity multiplier",
            "Net profit margin × current ratio",
            "Asset turnover × debt-to-equity ratio",
            "Gross margin × inventory turnover",
          ],
          a: 0,
          ex: "ROE = 売上高純利益率(NI/売上)× 総資産回転率(売上/総資産)× 財務レバレッジ(総資産/自己資本)。",
        },
      ],
      cards: [
        ["Quick ratio", "当座比率", "(現金+有価証券+売掛金)÷ 流動負債"],
        ["Contribution margin", "貢献利益", "売上 − 変動費"],
        ["Break-even point", "損益分岐点", "固定費 ÷ 単位貢献利益"],
        ["Unfavorable variance", "不利差異", "実際原価が標準原価を上回る"],
        ["Net present value (NPV)", "正味現在価値", "CFの現在価値 − 初期投資"],
        ["Internal rate of return (IRR)", "内部収益率", "NPVがゼロになる割引率"],
      ],
    },
    {
      id: "BAR-02",
      title: "企業結合・デリバティブ・株式報酬",
      en: "Technical Accounting: Business Combinations, Derivatives, Share-based Payment",
      note: `
<h3>1. 企業結合(ASC 805)— 取得法</h3>
<div class="pt">のれん = 移転した対価の公正価値 + 非支配持分(NCI)の公正価値 − 識別可能純資産の公正価値</div>
<ul>
<li>差額がマイナス → <b>割安購入益(<span class="en">bargain purchase gain</span>)</b>を取得企業の損益に計上(再検討後)</li>
<li><b>取得関連費用</b>(弁護士・会計士報酬など)→ <b>発生時に費用処理</b></li>
<li>株式発行費用 → APIC から控除</li>
<li>条件付対価(contingent consideration)→ 取得日の公正価値で対価に含める</li>
</ul>
<p class="ex">例:80%を $800,000 で取得、NCI の公正価値 $200,000、識別可能純資産 $900,000 → のれん <b>$100,000</b></p>

<h3>2. のれんの減損(ASU 2017-04)</h3>
<p>減損損失 = 報告単位の帳簿価額 − 報告単位の公正価値(<b>のれんの額が上限</b>)。定性的評価(Step 0)で可能性が低ければ省略可。非公開会社はのれんの償却(10年以内)を選択できる。</p>

<h3>3. デリバティブとヘッジ会計</h3>
<table><tr><th>ヘッジの種類</th><th>デリバティブの評価差額</th></tr>
<tr><td>公正価値ヘッジ</td><td><b>当期純利益</b>(ヘッジ対象の公正価値変動も純利益)</td></tr>
<tr><td>キャッシュフロー・ヘッジ</td><td><b>OCI</b> → ヘッジ対象取引が損益に影響する時に組替え</td></tr>
<tr><td>在外営業活動体への純投資ヘッジ</td><td>OCI(換算調整勘定)</td></tr>
<tr><td>ヘッジ指定なし</td><td>当期純利益</td></tr></table>

<h3>4. 株式報酬(ASC 718)</h3>
<ul>
<li>持分決済型:<b>付与日の公正価値</b>で測定し、<b>必要勤務期間</b>にわたり費用計上。その後の株価変動で再測定しない</li>
<li>負債決済型(現金決済SARなど):毎期末に公正価値で再測定</li>
</ul>
<p class="ex">例:ストック・オプション10,000個、付与日公正価値 $12、4年の一括権利確定 → 年間費用 <b>$30,000</b></p>
`,
      mcq: [
        {
          q: "An acquirer pays $800,000 for 80% of a target. The fair value of the noncontrolling interest is $200,000, and the fair value of the identifiable net assets is $900,000. What goodwill should be recognized?",
          ja: "取得企業は被取得企業の80%を$800,000で取得した。非支配持分の公正価値は$200,000、識別可能純資産の公正価値は$900,000である。認識すべきのれんはいくらか。",
          c: ["$0", "$80,000", "$100,000", "$280,000"],
          a: 2,
          ex: "のれん = 800,000 + 200,000 − 900,000 = $100,000。",
        },
        {
          q: "In a business combination, legal and accounting fees incurred by the acquirer to complete the acquisition should be:",
          ja: "企業結合において、取得企業が取得完了のために負担した弁護士・会計士報酬はどう処理すべきか。",
          c: ["Included in goodwill", "Expensed as incurred", "Deducted from additional paid-in capital", "Amortized over 5 years"],
          a: 1,
          ex: "取得関連費用は発生時に費用処理する。株式の発行費用のみAPICから控除する。",
        },
        {
          q: "When the fair value of identifiable net assets acquired exceeds the consideration transferred plus the fair value of the noncontrolling interest, the acquirer should:",
          ja: "取得した識別可能純資産の公正価値が、移転した対価と非支配持分の公正価値の合計を上回る場合、取得企業はどうすべきか。",
          c: [
            "Record negative goodwill as a liability",
            "Reduce the values of noncurrent assets to zero",
            "Recognize a gain on bargain purchase in earnings after reassessing the measurements",
            "Record the excess in other comprehensive income",
          ],
          a: 2,
          ex: "まず識別と測定を再検討し、それでも差額が残れば割安購入益として取得企業の損益に計上する。",
        },
        {
          q: "For a derivative designated as a cash flow hedge, the gain or loss on the effective hedging instrument is initially reported in:",
          ja: "キャッシュフロー・ヘッジに指定されたデリバティブについて、ヘッジ手段の損益は当初どこに計上されるか。",
          c: ["Net income", "Other comprehensive income", "Retained earnings directly", "The notes only"],
          a: 1,
          ex: "キャッシュフロー・ヘッジのヘッジ手段の損益はOCIに計上し、ヘッジ対象の予定取引が損益に影響する時に組み替える。公正価値ヘッジは当期純利益。",
        },
        {
          q: "A company grants 10,000 stock options with a grant-date fair value of $12 each. The options cliff-vest after 4 years of service. What compensation expense should be recognized in Year 1, assuming no forfeitures?",
          ja: "ある会社は付与日の公正価値が1個$12のストック・オプションを10,000個付与した。4年間の勤務後に一括で権利確定する。失効がないとすると、1年目に認識すべき報酬費用はいくらか。",
          c: ["$120,000", "$30,000", "$40,000", "$0"],
          a: 1,
          ex: "総報酬費用 = 10,000 × 12 = 120,000 を必要勤務期間4年で配分。120,000 ÷ 4 = $30,000。",
        },
        {
          q: "Under current U.S. GAAP for public business entities, a goodwill impairment loss is measured as:",
          ja: "現行のUS GAAP(公開企業)において、のれんの減損損失はどのように測定されるか。",
          c: [
            "The excess of the reporting unit's carrying amount over its fair value, limited to the goodwill allocated to it",
            "The excess of the implied fair value of goodwill over its carrying amount",
            "Goodwill divided by 10 years",
            "The difference between undiscounted cash flows and carrying amount",
          ],
          a: 0,
          ex: "ASU 2017-04により、報告単位の帳簿価額が公正価値を超える額を減損損失とする(のれんの額が上限)。のれんの「暗示された公正価値」を計算するStep 2は廃止された。",
        },
      ],
      cards: [
        ["Acquisition method", "取得法", "企業結合の会計処理。識別可能資産負債を公正価値で計上"],
        ["Goodwill", "のれん", "対価+NCI − 識別可能純資産"],
        ["Bargain purchase", "割安購入", "差額がマイナス。利益に計上"],
        ["Noncontrolling interest (NCI)", "非支配持分", "親会社以外の株主の持分"],
        ["Cash flow hedge", "キャッシュフロー・ヘッジ", "予定取引などのCF変動をヘッジ。差額はOCI"],
        ["Requisite service period", "必要勤務期間", "株式報酬費用を配分する期間"],
      ],
    },
    {
      id: "BAR-03",
      title: "州・地方政府会計(発展)",
      en: "State and Local Governments",
      note: `
<h3>1. 財務報告の全体像(ACFR)</h3>
<p>年次包括財務報告書(<span class="en">Annual Comprehensive Financial Report</span>)は<b>Introductory / Financial / Statistical</b>の3セクション。Financial には監査報告書、MD&A、基本財務諸表、必要補足情報(RSI)が含まれる。</p>

<h3>2. 政府全体の活動計算書(<span class="en">Statement of Activities</span>)</h3>
<p><b>純(費用)収益形式</b>:機能・プログラムごとに 費用 − プログラム収益 を表示。<br>
プログラム収益:①サービス料金 ②運営補助金・寄付 ③資本補助金・寄付。税収は一般収益(general revenues)。</p>

<h3>3. ファンド財務諸表 → 政府全体への調整</h3>
<div class="pt"><b>主な調整項目(政府型ファンド → 政府全体)</b>
<ul><li>固定資産の取得:ファンドでは支出 → 政府全体では資産計上(<b>加算</b>)、減価償却費は減算</li>
<li>長期債の発行:ファンドではその他の財源(収入) → 政府全体では負債(<b>減算</b>)</li>
<li>長期債の元本返済:ファンドでは支出 → 政府全体では負債の減少(加算)</li>
<li>内部サービス・ファンドは通常、政府型活動に含める</li></ul></div>

<h3>4. 非交換取引の収益認識(GASB 33)</h3>
<table><tr><th>種類</th><th>例</th><th>認識(発生主義)</th></tr>
<tr><td>派生税収</td><td>売上税、所得税</td><td>基礎となる交換取引が発生したとき</td></tr>
<tr><td>賦課税収</td><td>固定資産税、罰金</td><td>課税対象となる期間(固定資産税)</td></tr>
<tr><td>政府が命じる・任意の非交換取引</td><td>補助金</td><td>適格要件(期間要件含む)を満たしたとき</td></tr></table>

<h3>5. その他</h3>
<ul>
<li><b>インフラ資産の修正アプローチ</b>:資産管理システムと状態評価の要件を満たせば減価償却しない(維持費用を費用計上)。</li>
<li><b>予算会計</b>:発注時に<b>引当(Encumbrance)</b>を記録し、予算の超過を防ぐ。</li>
<li>受託型ファンドは政府全体財務諸表に含めない。</li>
</ul>
`,
      mcq: [
        {
          q: "Which of the following is NOT a category of program revenues in the government-wide statement of activities?",
          ja: "政府全体の活動計算書において、プログラム収益の区分に含まれないものはどれか。",
          c: ["Charges for services", "Operating grants and contributions", "Capital grants and contributions", "Property taxes levied for general purposes"],
          a: 3,
          ex: "一般目的の固定資産税は一般収益(general revenues)。プログラム収益は、サービス料金、運営補助金・寄付、資本補助金・寄付の3区分。",
        },
        {
          q: "In reconciling the governmental funds balance sheet/operating statement to the government-wide statements, capital outlay expenditures are:",
          ja: "政府型ファンドの財務諸表を政府全体財務諸表へ調整する際、資本的支出(capital outlay)はどう扱われるか。",
          c: [
            "Added back, because they are capitalized in the government-wide statements",
            "Subtracted, because they are expenses in the government-wide statements",
            "Ignored, because they are the same in both",
            "Reported as other financing sources",
          ],
          a: 0,
          ex: "ファンドでは支出として費用化されているが、政府全体では資産計上されるため、調整で加算する(減価償却費は減算)。",
        },
        {
          q: "Under the modified approach for infrastructure assets, a government:",
          ja: "インフラ資産の修正アプローチのもとで、政府は何をするか。",
          c: [
            "Depreciates infrastructure over a shorter life",
            "Does not report depreciation if certain asset management and condition assessment requirements are met",
            "Expenses all infrastructure acquisitions",
            "Reports infrastructure only in the fund statements",
          ],
          a: 1,
          ex: "資産管理システムを持ち、定められた状態水準を維持していることを文書化するなどの要件を満たせば、減価償却を計上せず維持費用を費用処理できる。",
        },
        {
          q: "Under GASB, derived tax revenues such as sales taxes are recognized on the accrual basis when:",
          ja: "GASBにおいて、売上税などの派生税収は発生主義のもとでいつ認識されるか。",
          c: ["The tax is levied", "The underlying exchange transaction occurs", "Cash is collected", "The budget is adopted"],
          a: 1,
          ex: "派生税収は基礎となる交換取引(売上)が発生したときに認識する。固定資産税などの賦課税収は課税対象期間で認識する。",
        },
        {
          q: "The three sections of an Annual Comprehensive Financial Report (ACFR) are:",
          ja: "年次包括財務報告書(ACFR)の3つのセクションはどれか。",
          c: [
            "Introductory, financial, and statistical",
            "Management, audit, and budget",
            "Fund, government-wide, and notes",
            "Narrative, quantitative, and supplementary",
          ],
          a: 0,
          ex: "ACFRは導入(introductory)、財務(financial)、統計(statistical)の3セクションで構成される。",
        },
        {
          q: "In governmental fund budgetary accounting, encumbrances are recorded when:",
          ja: "政府型ファンドの予算会計において、引当(encumbrance)はいつ記録されるか。",
          c: ["Goods are received", "A purchase order is issued", "The invoice is paid", "The fiscal year ends"],
          a: 1,
          ex: "発注書の発行時に引当を記録して予算の使用予定額を確保し、物品受領時に引当を戻して支出を記録する。",
        },
      ],
      cards: [
        ["ACFR", "年次包括財務報告書", "Introductory / Financial / Statistical の3部構成"],
        ["Program revenues", "プログラム収益", "サービス料金・運営補助金・資本補助金"],
        ["Derived tax revenue", "派生税収", "売上税・所得税。交換取引の発生時に認識"],
        ["Imposed nonexchange revenue", "賦課税収", "固定資産税・罰金"],
        ["Modified approach", "修正アプローチ", "インフラ資産を減価償却しない方法"],
        ["Encumbrance", "引当(予算上の拘束)", "発注時に予算を確保する記録"],
      ],
    },
  ],
});

CPA.section({
  id: "ISC",
  name: "Information Systems and Controls",
  ja: "情報システムと統制",
  kind: "選択(Discipline)",
  color: "#0891b2",
  exam: { hours: 4, mcq: 82, tbs: 6, weight: "MC 60% / TBS 40%" },
  summary: "ITガバナンス、情報システムとデータ管理、セキュリティ・機密性・プライバシー、SOC業務(SOC 1・SOC 2)。監査(AUD)と相性がよく、計算はほとんどない。",
  chapters: [
    {
      id: "ISC-01",
      title: "情報システムとデータ管理",
      en: "Information Systems and Data Management",
      note: `
<h3>1. ITガバナンス</h3>
<ul>
<li><b>COBIT</b>:企業のIT(情報と技術)のガバナンスとマネジメントのためのフレームワーク(ISACA)</li>
<li><b>ERP</b>:購買・販売・会計・人事などの業務プロセスを<b>単一のデータベース</b>で統合するシステム</li>
</ul>

<h3>2. システム開発と変更管理(SDLC)</h3>
<div class="pt">プログラムの不正な変更を防ぐ主な統制:
<ul><li><b>開発・テスト・本番環境の分離</b></li>
<li>変更要求の承認、テスト、ユーザーによる受入れ、移行の承認</li>
<li>開発者に本番環境へのアクセス権を与えない(職務分掌)</li></ul></div>

<h3>3. 事業継続と災害復旧</h3>
<table><tr><th>用語</th><th>意味</th></tr>
<tr><td>RPO(目標復旧時点)</td><td>許容できる<b>データ損失</b>の最大量(時間で表す)。バックアップ頻度を決める</td></tr>
<tr><td>RTO(目標復旧時間)</td><td>システムを復旧するまでに許容できる<b>停止時間</b></td></tr>
<tr><td>ホットサイト</td><td>設備・データが揃い、<b>すぐに</b>切替え可能。高コスト</td></tr>
<tr><td>ウォームサイト</td><td>一部の設備あり。数日で復旧</td></tr>
<tr><td>コールドサイト</td><td>場所と電源・空調のみ。復旧に時間がかかる。低コスト</td></tr></table>

<h3>4. データ管理</h3>
<ul>
<li><b>正規化(<span class="en">Normalization</span>)</b>:データの冗長性をなくし、更新時の不整合(異常)を防ぐ</li>
<li>主キー(<span class="en">primary key</span>):レコードを一意に識別。外部キー(<span class="en">foreign key</span>):他のテーブルの主キーを参照</li>
<li>入力統制の例:妥当性チェック、範囲チェック、<b>チェックデジット</b>、完全性チェック、照合合計(<span class="en">hash total</span>)</li>
</ul>
`,
      mcq: [
        {
          q: "Which of the following controls is most effective in preventing unauthorized changes to production programs?",
          ja: "本番プログラムへの不正な変更を防止するうえで最も効果的な統制はどれか。",
          c: [
            "Allowing programmers to update production code directly to save time",
            "Separating development, test, and production environments with approved change migration",
            "Reviewing the system log annually",
            "Requiring users to change passwords every 30 days",
          ],
          a: 1,
          ex: "環境の分離と、承認された手順による本番環境への移行が変更管理の中心となる統制。開発者が本番を直接更新できる状態は重大な不備。",
        },
        {
          q: "A recovery point objective (RPO) represents:",
          ja: "目標復旧時点(RPO)は何を表すか。",
          c: [
            "The maximum acceptable downtime for a system",
            "The maximum acceptable amount of data loss measured in time",
            "The location of the backup facility",
            "The cost of restoring operations",
          ],
          a: 1,
          ex: "RPOは許容できるデータ損失の最大量(例:直近4時間分まで)で、バックアップの頻度を決める。停止時間の許容値はRTO。",
        },
        {
          q: "Which type of recovery site is fully equipped and can be operational almost immediately?",
          ja: "設備が完全に整っており、ほぼ直ちに稼働できる復旧サイトはどれか。",
          c: ["Cold site", "Warm site", "Hot site", "Reciprocal agreement site"],
          a: 2,
          ex: "ホットサイトはハードウェア・ソフトウェア・データが揃い即座に切り替えられる(高コスト)。コールドサイトは場所と基本設備のみ。",
        },
        {
          q: "COBIT is best described as:",
          ja: "COBITを最もよく説明しているのはどれか。",
          c: [
            "A framework for the governance and management of enterprise information and technology",
            "An encryption standard",
            "A database query language",
            "A framework for internal control over financial reporting only",
          ],
          a: 0,
          ex: "COBITはISACAが策定した、企業のITのガバナンスとマネジメントのためのフレームワーク。財務報告の内部統制フレームワークはCOSO。",
        },
        {
          q: "The primary purpose of database normalization is to:",
          ja: "データベースの正規化の主な目的は何か。",
          c: ["Encrypt sensitive data", "Reduce data redundancy and update anomalies", "Increase the speed of backups", "Create audit trails"],
          a: 1,
          ex: "正規化はデータの重複を排除し、更新・挿入・削除時の不整合(異常)を防ぐための設計手法。",
        },
        {
          q: "A check digit is an example of which type of control?",
          ja: "チェックデジットはどの種類の統制の例か。",
          c: ["Output control", "Input (data validation) control", "Physical control", "Disaster recovery control"],
          a: 1,
          ex: "チェックデジットは番号の一部から計算した桁を付け、入力ミス(転記・入替え)を検出する入力統制。",
        },
      ],
      cards: [
        ["COBIT", "COBIT", "ITガバナンス・マネジメントのフレームワーク"],
        ["Enterprise resource planning (ERP)", "統合基幹業務システム", "業務プロセスを単一DBで統合"],
        ["Change management", "変更管理", "プログラム変更の承認・テスト・移行の統制"],
        ["Recovery point objective (RPO)", "目標復旧時点", "許容できるデータ損失量"],
        ["Recovery time objective (RTO)", "目標復旧時間", "許容できる停止時間"],
        ["Normalization", "正規化", "データの冗長性を排除する設計"],
      ],
    },
    {
      id: "ISC-02",
      title: "セキュリティ・機密性・プライバシー",
      en: "Security, Confidentiality and Privacy",
      note: `
<h3>1. 統制の種類</h3>
<table><tr><th>種類</th><th>例</th></tr>
<tr><td>予防的(Preventive)</td><td>ファイアウォール、アクセス制御、職務分掌、暗号化</td></tr>
<tr><td>発見的(Detective)</td><td>ログのレビュー、侵入検知システム(IDS)、照合</td></tr>
<tr><td>是正的(Corrective)</td><td>バックアップからの復元、パッチ適用、インシデント対応</td></tr></table>

<h3>2. 暗号化</h3>
<div class="pt">
<b>機密性</b>:送信者が<b>受信者の公開鍵</b>で暗号化 → 受信者だけが自分の秘密鍵で復号<br>
<b>電子署名</b>(真正性・否認防止):送信者が<b>自分の秘密鍵</b>で署名 → 誰でも送信者の公開鍵で検証</div>
<p>共通鍵暗号(symmetric)は速いが鍵の受け渡しが課題。公開鍵暗号(asymmetric)は鍵配送の問題を解決。</p>

<h3>3. 認証とアクセス管理</h3>
<ul>
<li><b>多要素認証(MFA)</b>:知識(パスワード)・所持(スマホ、トークン)・生体(指紋)の<b>異なる種類</b>を組み合わせる。パスワード+PINは同じ「知識」なのでMFAではない</li>
<li><b>最小権限の原則</b>:業務に必要な最小限のアクセス権のみ付与</li>
</ul>

<h3>4. 脅威</h3>
<ul>
<li><b>フィッシング</b>:偽のメール等で情報を盗む<b>ソーシャル・エンジニアリング</b></li>
<li>ランサムウェア、DDoS、中間者攻撃、SQLインジェクション</li>
</ul>

<h3>5. NIST サイバーセキュリティ・フレームワーク(CSF 2.0)</h3>
<p>6つの機能:<b>Govern, Identify, Protect, Detect, Respond, Recover</b>(2.0で Govern が追加)</p>
`,
      mcq: [
        {
          q: "To send a confidential message using asymmetric encryption, the sender should encrypt the message with:",
          ja: "公開鍵暗号を使って機密のメッセージを送る場合、送信者は何でメッセージを暗号化すべきか。",
          c: ["The sender's private key", "The sender's public key", "The recipient's public key", "The recipient's private key"],
          a: 2,
          ex: "受信者の公開鍵で暗号化すれば、対応する秘密鍵を持つ受信者だけが復号できる。送信者の秘密鍵を使うのは電子署名。",
        },
        {
          q: "Which of the following is an example of multi-factor authentication?",
          ja: "次のうち、多要素認証の例はどれか。",
          c: [
            "A password and a security question",
            "A password and a PIN",
            "A password and a one-time code sent to the user's registered phone",
            "Two different passwords",
          ],
          a: 2,
          ex: "パスワード(知識)とスマートフォン(所持)は異なる種類の要素の組合せ。他の選択肢はすべて「知識」の要素のみ。",
        },
        {
          q: "Reviewing system access logs for unusual activity is an example of a:",
          ja: "システムのアクセスログを異常な活動がないか確認することは、どの統制の例か。",
          c: ["Preventive control", "Detective control", "Corrective control", "Directive control"],
          a: 1,
          ex: "ログのレビューは、すでに起きた事象を発見する発見的統制。ファイアウォールやアクセス制限は予防的統制。",
        },
        {
          q: "An email that appears to come from a company's bank and asks the recipient to verify login credentials through a link is an example of:",
          ja: "取引銀行からのように見せかけ、リンクからログイン情報の確認を求めるメールは何の例か。",
          c: ["Denial-of-service attack", "Phishing", "SQL injection", "Brute-force attack"],
          a: 1,
          ex: "信頼できる相手を装って情報を詐取するフィッシングで、ソーシャル・エンジニアリングの一種。",
        },
        {
          q: "Which function was added in version 2.0 of the NIST Cybersecurity Framework?",
          ja: "NISTサイバーセキュリティ・フレームワークのバージョン2.0で追加された機能はどれか。",
          c: ["Identify", "Protect", "Govern", "Recover"],
          a: 2,
          ex: "CSF 2.0ではGovern(統治)が追加され、Govern・Identify・Protect・Detect・Respond・Recoverの6機能となった。",
        },
        {
          q: "The principle of least privilege requires that users:",
          ja: "最小権限の原則が求めるのはどれか。",
          c: [
            "Share accounts to reduce administrative costs",
            "Be granted only the access necessary to perform their job duties",
            "Have administrator rights on their own computers",
            "Change passwords daily",
          ],
          a: 1,
          ex: "ユーザーには業務に必要な最小限のアクセス権のみを付与する。不正や誤操作による影響範囲を小さくできる。",
        },
      ],
      cards: [
        ["Preventive control", "予防的統制", "問題の発生を防ぐ(ファイアウォール等)"],
        ["Detective control", "発見的統制", "発生した問題を発見する(ログレビュー等)"],
        ["Asymmetric encryption", "公開鍵暗号", "公開鍵と秘密鍵のペアを使う"],
        ["Digital signature", "電子署名", "送信者の秘密鍵で署名し真正性を保証"],
        ["Multi-factor authentication (MFA)", "多要素認証", "知識・所持・生体の異なる要素を組合せ"],
        ["Social engineering", "ソーシャル・エンジニアリング", "人の心理を突いて情報を得る攻撃"],
      ],
    },
    {
      id: "ISC-03",
      title: "SOC業務",
      en: "System and Organization Controls (SOC) Engagements",
      note: `
<h3>1. SOC レポートの種類</h3>
<table><tr><th>種類</th><th>対象</th><th>利用者</th></tr>
<tr><td>SOC 1</td><td>利用企業の<b>財務報告に係る内部統制(ICFR)</b>に関連する受託会社の統制</td><td>利用企業と<b>その監査人</b>(利用制限あり)</td></tr>
<tr><td>SOC 2</td><td><b>Trust Services Criteria</b>(セキュリティ・可用性・処理のインテグリティ・機密性・プライバシー)</td><td>知識のある特定の利用者(利用制限あり)</td></tr>
<tr><td>SOC 3</td><td>SOC 2 と同じ基準の概要版</td><td><b>一般利用(General use)</b></td></tr></table>
<p>SOC 2 では<b>セキュリティ(共通規準)は必須</b>、ほかの4つは選択。</p>

<h3>2. Type 1 と Type 2</h3>
<div class="pt">
<b>Type 1</b>:<b>特定時点</b>のシステムの記述の適正性と、統制の<b>デザイン</b>の適切性<br>
<b>Type 2</b>:Type 1 の内容+<b>一定期間</b>にわたる統制の<b>運用状況の有効性</b>(運用評価手続の内容と結果を含む)</div>
<p>利用企業の監査人が受託会社の統制に依拠して統制リスクを下げたいなら、<b>Type 2</b> が必要。</p>

<h3>3. 再委託先と利用企業の統制</h3>
<ul>
<li><b>Carve-out法</b>:再委託先(サブサービス組織)の統制を記述・テストの範囲から<b>除外</b></li>
<li><b>Inclusive法</b>:再委託先の統制も範囲に<b>含める</b></li>
<li><b>CUEC(相補的な利用企業の統制)</b>:受託会社の統制目的の達成のために、<b>利用企業側が実施する必要がある</b>統制(例:利用企業がアクセス権を適時に削除する)</li>
</ul>
`,
      mcq: [
        {
          q: "A SOC 1 report addresses a service organization's controls that are relevant to:",
          ja: "SOC 1レポートが対象とする受託会社の統制は、何に関連するものか。",
          c: [
            "User entities' internal control over financial reporting",
            "The service organization's privacy practices only",
            "The service organization's own financial statements",
            "Compliance with environmental regulations",
          ],
          a: 0,
          ex: "SOC 1は利用企業の財務報告に係る内部統制(ICFR)に関連する受託会社の統制を対象とし、主に利用企業の監査人が利用する。",
        },
        {
          q: "In a SOC 2 engagement, which trust services category must always be included?",
          ja: "SOC 2業務において、常に含めなければならないTrust Servicesのカテゴリーはどれか。",
          c: ["Availability", "Processing integrity", "Security", "Privacy"],
          a: 2,
          ex: "セキュリティは共通規準(common criteria)として必須。可用性・処理のインテグリティ・機密性・プライバシーは必要に応じて追加する。",
        },
        {
          q: "A Type 2 SOC report differs from a Type 1 report in that a Type 2 report includes:",
          ja: "Type 2のSOCレポートはType 1と何が異なるか。",
          c: [
            "An opinion on the operating effectiveness of controls throughout a specified period",
            "Only a description of the system",
            "An opinion on the user entity's financial statements",
            "No description of tests performed",
          ],
          a: 0,
          ex: "Type 2は、記述とデザインに加えて、一定期間にわたる統制の運用状況の有効性に関する意見と、運用評価手続の内容・結果を含む。",
        },
        {
          q: "Controls that the service organization assumes will be implemented by user entities, and that are necessary to achieve the control objectives, are called:",
          ja: "受託会社が利用企業によって実施されることを前提とし、統制目的の達成に必要とされる統制を何というか。",
          c: ["Subservice organization controls", "Complementary user entity controls", "Entity-level controls", "Compensating controls"],
          a: 1,
          ex: "相補的な利用企業の統制(CUEC)。利用企業の監査人は、これらが利用企業で実施されているかを評価する必要がある。",
        },
        {
          q: "Under the carve-out method, the service organization's description:",
          ja: "Carve-out法のもとで、受託会社のシステムの記述はどうなるか。",
          c: [
            "Includes the subservice organization's controls, which are tested by the service auditor",
            "Excludes the subservice organization's controls from the description and scope of the engagement",
            "Is not permitted in SOC 1 engagements",
            "Includes only complementary user entity controls",
          ],
          a: 1,
          ex: "Carve-out法では再委託先の統制目的と統制を記述と業務範囲から除外する(再委託先の利用自体は記述される)。含めるのはInclusive法。",
        },
        {
          q: "Which SOC report is intended for general use and may be freely distributed?",
          ja: "一般利用を目的とし、自由に配布できるSOCレポートはどれか。",
          c: ["SOC 1 Type 2", "SOC 2 Type 1", "SOC 2 Type 2", "SOC 3"],
          a: 3,
          ex: "SOC 3は一般利用のレポートで、Webサイトなどで公開できる。SOC 1・SOC 2は利用が制限される。",
        },
      ],
      cards: [
        ["SOC 1", "SOC 1", "利用企業のICFRに関連する統制の報告"],
        ["SOC 2", "SOC 2", "Trust Services Criteriaに基づく報告"],
        ["Trust Services Criteria", "トラストサービス規準", "セキュリティ・可用性・処理のインテグリティ・機密性・プライバシー"],
        ["Type 2 report", "Type 2報告書", "一定期間の運用状況の有効性を含む"],
        ["Carve-out method", "除外法", "再委託先の統制を範囲から除外"],
        ["Complementary user entity controls (CUEC)", "相補的な利用企業の統制", "利用企業側で必要な統制"],
      ],
    },
  ],
});

CPA.section({
  id: "TCP",
  name: "Tax Compliance and Planning",
  ja: "税務コンプライアンスと計画",
  kind: "選択(Discipline)",
  color: "#db2777",
  exam: { hours: 4, mcq: 68, tbs: 7, weight: "MC 50% / TBS 50%" },
  summary: "REGの税法の発展論点。個人の税務計画、事業体(パートナーシップ・S法人・C法人)の高度な論点、贈与税・遺産税、信託と遺産財団。REGと重複が多く、税務キャリアを目指す人向け。",
  chapters: [
    {
      id: "TCP-01",
      title: "個人の税務計画",
      en: "Individual Tax Compliance and Planning",
      note: `
<h3>1. ストック・オプション</h3>
<table><tr><th></th><th>ISO(適格)</th><th>NQSO(非適格)</th></tr>
<tr><td>付与時</td><td>課税なし</td><td>課税なし(通常)</td></tr>
<tr><td>行使時</td><td>通常の所得税なし。ただし<b>差額がAMTの調整項目</b></td><td><b>時価と行使価格の差額が通常所得</b></td></tr>
<tr><td>売却時</td><td>保有要件を満たせば全額長期キャピタルゲイン</td><td>行使時の時価からの値上がり分がキャピタルゲイン</td></tr></table>
<p>ISOの保有要件:付与から2年超、かつ行使から1年超。</p>

<h3>2. パッシブ活動の損失(§469)</h3>
<ul>
<li>パッシブ活動の損失は<b>パッシブ所得とのみ</b>相殺。使えない損失は繰り越し、<b>課税対象となる全部の処分</b>時にすべて使える。</li>
<li>賃貸不動産に<b>積極的に参加</b>している場合:最大 <b>$25,000</b> を非パッシブ所得と相殺可。MAGI <b>$100,000〜$150,000</b> で段階的に縮小。</li>
</ul>

<h3>3. 住宅売却益の非課税(§121)</h3>
<p>過去5年のうち<b>2年以上所有かつ居住</b> → 売却益のうち <b>$250,000(夫婦合算 $500,000)</b> まで非課税。</p>

<h3>4. 退職口座</h3>
<ul>
<li>伝統的IRA:拠出時に控除(条件あり)、引出し時に課税</li>
<li><b>Roth IRA</b>:拠出時は控除なし。<b>適格分配</b>(最初の拠出から5年経過+59½歳到達・死亡・障害・初めての住宅購入)は<b>非課税</b></li>
</ul>

<h3>5. 贈与税の基本</h3>
<ul>
<li>年間非課税枠(annual exclusion):受贈者1人あたり。金額は毎年インフレ調整</li>
<li><b>教育機関・医療機関への直接支払い</b>(授業料・医療費)は金額無制限で贈与にならない</li>
<li><b>配偶者間の贈与分割(gift splitting)</b>:配偶者の同意により、一方の贈与を夫婦で半分ずつ行ったものとみなせる</li>
</ul>
`,
      mcq: [
        {
          q: "An employee exercises incentive stock options (ISOs). For regular income tax purposes, the employee recognizes at exercise:",
          ja: "従業員が適格ストック・オプション(ISO)を行使した。通常の所得税上、行使時に従業員が認識するものは何か。",
          c: [
            "Ordinary income equal to the spread",
            "No income, although the spread is an AMT adjustment",
            "Capital gain equal to the spread",
            "Ordinary income equal to the exercise price",
          ],
          a: 1,
          ex: "ISOは行使時に通常の所得税は課されないが、時価と行使価格の差額はAMT(代替ミニマム税)の調整項目となる。NQSOなら差額が通常所得。",
        },
        {
          q: "An employee exercises nonqualified stock options with an exercise price of $10 per share when the market price is $25, acquiring 1,000 shares. What ordinary income is recognized at exercise?",
          ja: "従業員が行使価格$10の非適格ストック・オプションを、株価$25のときに行使し、1,000株を取得した。行使時に認識する通常所得はいくらか。",
          c: ["$0", "$10,000", "$15,000", "$25,000"],
          a: 2,
          ex: "NQSOは行使時に時価と行使価格の差額が通常所得。(25 − 10)× 1,000 = $15,000。この金額は株式の取得価額にも加算される。",
        },
        {
          q: "A taxpayer actively participates in a rental real estate activity. The special allowance to deduct up to $25,000 of rental losses against nonpassive income is phased out when modified AGI is between:",
          ja: "納税者は賃貸不動産活動に積極的に参加している。賃貸損失を非パッシブ所得から最大$25,000控除できる特例は、修正AGIがいくらの範囲で段階的に縮小されるか。",
          c: ["$50,000 and $100,000", "$100,000 and $150,000", "$150,000 and $200,000", "$200,000 and $250,000"],
          a: 1,
          ex: "MAGIが$100,000を超えると、超過額の50%ずつ縮小し、$150,000で特例はゼロになる。",
        },
        {
          q: "A married couple filing jointly sells their principal residence, which they owned and lived in for the past 10 years, at a gain of $600,000. How much of the gain can be excluded?",
          ja: "夫婦合算申告の夫婦が、過去10年間所有・居住していた主たる住居を売却し、$600,000の利益を得た。非課税にできる利益はいくらか。",
          c: ["$250,000", "$500,000", "$600,000", "$0"],
          a: 1,
          ex: "§121により、所有・居住要件(5年のうち2年)を満たせば夫婦合算で$500,000まで非課税。残り$100,000は課税される。",
        },
        {
          q: "Which of the following payments is NOT treated as a taxable gift, regardless of amount?",
          ja: "次のうち、金額にかかわらず課税対象の贈与として扱われない支払いはどれか。",
          c: [
            "Paying a grandchild's tuition directly to the university",
            "Giving cash to a grandchild to pay tuition",
            "Paying a friend's rent",
            "Transferring stock to a niece",
          ],
          a: 0,
          ex: "授業料を教育機関へ直接支払う場合は金額無制限で贈与から除外される(医療機関への直接支払いも同様)。本人に現金を渡すと贈与になる。",
        },
        {
          q: "A distribution from a Roth IRA is a qualified (tax-free) distribution if the five-year holding period is met and the distribution is made:",
          ja: "Roth IRAからの分配が適格(非課税)分配となるのは、5年の保有期間を満たし、かつ分配がどのような場合に行われたときか。",
          c: [
            "For any reason after age 50",
            "After the owner reaches age 59½",
            "To pay credit card debt",
            "Only upon the owner's retirement from employment",
          ],
          a: 1,
          ex: "59½歳到達後、死亡、障害、初めての住宅購入(上限あり)のいずれかで、かつ5年要件を満たせば適格分配として非課税。",
        },
      ],
      cards: [
        ["Incentive stock option (ISO)", "適格ストック・オプション", "行使時は通常課税なし、AMT調整あり"],
        ["Nonqualified stock option (NQSO)", "非適格ストック・オプション", "行使時に差額が通常所得"],
        ["Passive activity loss", "パッシブ活動損失", "パッシブ所得とのみ相殺"],
        ["Section 121 exclusion", "住宅売却益の非課税", "$250,000 / 夫婦合算$500,000"],
        ["Roth IRA", "ロスIRA", "拠出は控除なし、適格分配は非課税"],
        ["Gift splitting", "贈与分割", "配偶者の同意で贈与を夫婦で半分ずつとみなす"],
      ],
    },
    {
      id: "TCP-02",
      title: "事業体の税務計画",
      en: "Entity Tax Compliance and Planning",
      note: `
<h3>1. 法人設立(§351)</h3>
<p>出資者(グループ)が出資<b>直後に80%以上を支配</b>していれば、資産の拠出で損益を認識しない。<b>ボート</b>を受け取ると、実現利益とボートの少ない方を認識。</p>

<h3>2. 法人の分配</h3>
<ul>
<li>配当:E&P(利益積立金)の範囲で配当所得 → 超過分は株式の取得価額の回収 → さらに超過分はキャピタルゲイン</li>
<li><b>含み益のある資産</b>を分配:法人は<b>売却したものとみなして利益を認識</b>(含み損は認識しない)</li>
<li>清算(完全清算):株主は 受取財産のFMV − 株式の取得価額 をキャピタルゲイン/ロスとして認識</li>
</ul>

<h3>3. パートナーシップの非清算分配</h3>
<div class="pt">
<ol><li>まず<b>現金</b>を outside basis から減額。現金が outside basis を超えた部分は<b>利益を認識</b></li>
<li>次に資産:パートナーの取得価額 = <b>パートナーシップの帳簿上の取得価額</b>と<b>残りの outside basis</b>の小さい方</li></ol>
非清算分配では<b>損失は認識しない</b>。</div>
<p class="ex">例:outside basis $30,000、現金 $10,000 と土地(パートナーシップの取得価額 $25,000、FMV $40,000)を受領<br>→ 現金後の basis 20,000 → 土地の取得価額 <b>$20,000</b>、outside basis 0、損益なし</p>

<h3>4. S法人の株主の basis</h3>
<ul>
<li>損失の控除は<b>株式の basis + 株主から法人への貸付の basis</b>の範囲まで(超過分は繰越)</li>
<li>分配:AAA(累積調整勘定)の範囲で、株式の basis まで非課税。basis を超えた分はキャピタルゲイン</li>
</ul>
`,
      mcq: [
        {
          q: "A partner with an outside basis of $30,000 receives a nonliquidating distribution of $10,000 cash and land with a partnership basis of $25,000 and a fair market value of $40,000. What is the partner's basis in the land?",
          ja: "outside basisが$30,000のパートナーが、非清算分配として現金$10,000と土地(パートナーシップの取得価額$25,000、時価$40,000)を受け取った。パートナーの土地の取得価額はいくらか。",
          c: ["$40,000", "$25,000", "$20,000", "$30,000"],
          a: 2,
          ex: "まず現金で basis を減額:30,000 − 10,000 = 20,000。土地の取得価額はパートナーシップの取得価額(25,000)と残りの basis(20,000)の小さい方 = $20,000。",
        },
        {
          q: "In a nonliquidating partnership distribution, a partner recognizes gain only when:",
          ja: "パートナーシップの非清算分配において、パートナーが利益を認識するのはどのような場合か。",
          c: [
            "Property received has a fair value greater than its basis",
            "Cash received exceeds the partner's outside basis",
            "Any property other than cash is received",
            "The partnership has a profit for the year",
          ],
          a: 1,
          ex: "非清算分配で利益を認識するのは、受け取った現金(市場性有価証券を含む)が outside basis を超える場合のみ。",
        },
        {
          q: "Under Section 351, no gain or loss is recognized on a transfer of property to a corporation solely for stock if the transferors control the corporation immediately after the exchange. Control means ownership of at least:",
          ja: "§351では、出資者が交換直後に法人を支配していれば、株式のみと引換えの資産の拠出について損益は認識されない。支配とは少なくとも何%の所有をいうか。",
          c: ["50%", "51%", "80%", "100%"],
          a: 2,
          ex: "議決権株式の80%以上、かつ各種類の無議決権株式の80%以上を所有すること。",
        },
        {
          q: "A C corporation distributes land with a fair market value of $90,000 and an adjusted basis of $50,000 to a shareholder. How much gain does the corporation recognize?",
          ja: "C法人が株主に時価$90,000、取得価額$50,000の土地を分配した。法人が認識する利益はいくらか。",
          c: ["$0", "$40,000", "$50,000", "$90,000"],
          a: 1,
          ex: "含み益のある資産の分配は、法人が時価で売却したものとみなして利益を認識する。90,000 − 50,000 = $40,000。",
        },
        {
          q: "An S corporation shareholder may deduct pass-through losses only to the extent of:",
          ja: "S法人の株主がパススルーされた損失を控除できる範囲はどれか。",
          c: [
            "The shareholder's stock basis only",
            "The shareholder's stock basis plus basis in loans made by the shareholder to the corporation",
            "The corporation's total liabilities",
            "The corporation's retained earnings",
          ],
          a: 1,
          ex: "S法人の損失は株式の basis と、株主が法人に直接行った貸付の basis の合計まで控除できる(パートナーシップと異なり、法人の一般債務は含まない)。",
        },
        {
          q: "In a complete liquidation of a C corporation, a shareholder generally recognizes:",
          ja: "C法人の完全清算において、株主は一般に何を認識するか。",
          c: [
            "Dividend income equal to the fair value received",
            "Capital gain or loss equal to the fair value received minus the stock basis",
            "No gain or loss",
            "Ordinary income equal to the corporation's E&P",
          ],
          a: 1,
          ex: "完全清算では、受け取った財産の時価から株式の取得価額を差し引いた額をキャピタルゲイン(ロス)として認識する。",
        },
      ],
      cards: [
        ["Section 351", "法人設立の非課税規定", "出資直後に80%以上支配で損益不認識"],
        ["Earnings and profits (E&P)", "利益積立金", "配当所得となる範囲を決める"],
        ["Nonliquidating distribution", "非清算分配", "パートナーは現金超過時のみ利益認識"],
        ["Accumulated adjustments account (AAA)", "累積調整勘定", "S法人の課税済み未分配利益"],
        ["Debt basis", "貸付の basis", "S法人株主の損失控除の枠に含まれる"],
        ["Complete liquidation", "完全清算", "株主はFMV − 株式basisを損益認識"],
      ],
    },
    {
      id: "TCP-03",
      title: "信託・遺産財団と遺産税",
      en: "Trusts, Estates and Gift/Estate Tax",
      note: `
<h3>1. 信託の種類</h3>
<table><tr><th>種類</th><th>特徴</th></tr>
<tr><td>Simple trust</td><td>当期の所得を<b>すべて分配</b>しなければならない、慈善寄付なし、元本(corpus)の分配なし</td></tr>
<tr><td>Complex trust</td><td>simple 以外(所得の留保、元本の分配、慈善寄付が可能)</td></tr>
<tr><td>Grantor trust</td><td>設定者が支配を保持(例:撤回可能信託)→ <b>所得は設定者に課税</b></td></tr></table>

<h3>2. 分配可能純所得(DNI)</h3>
<p>DNI は、信託・遺産財団の<b>分配控除の上限</b>であり、<b>受益者が課税される金額の上限</b>。所得の性格(非課税利息など)は受益者に引き継がれる(導管理論)。</p>

<h3>3. 遺産税(<span class="en">Estate Tax</span>)</h3>
<ul>
<li>総遺産:死亡時に所有するすべての財産(FMV)。<b>被相続人が支配権(incidents of ownership)を持つ生命保険</b>も含む</li>
<li>控除:<b>配偶者控除(米国市民の配偶者への移転は無制限)</b>、慈善控除、債務・葬儀費用・管理費用</li>
<li>統一税額控除(unified credit):生前贈与と遺産で共通の非課税枠(金額は法改正・インフレ調整に注意)</li>
</ul>

<h3>4. 申告期限</h3>
<table><tr><th>申告書</th><th>期限</th></tr>
<tr><td>Form 706(遺産税)</td><td>死亡日から<b>9か月</b>(6か月延長可)</td></tr>
<tr><td>Form 709(贈与税)</td><td>翌年4月15日</td></tr>
<tr><td>Form 1041(信託・遺産財団の所得税)</td><td>年度終了後<b>4か月目の15日</b>(暦年なら4月15日)</td></tr></table>
`,
      mcq: [
        {
          q: "Which of the following is a requirement for a trust to be classified as a simple trust?",
          ja: "信託がsimple trustに分類されるための要件はどれか。",
          c: [
            "It must distribute all of its income currently",
            "It must make charitable contributions each year",
            "It must distribute corpus annually",
            "It must have only one beneficiary",
          ],
          a: 0,
          ex: "Simple trustは当期の所得をすべて分配する必要があり、慈善寄付や元本の分配は行わない。受益者の数は要件ではない。",
        },
        {
          q: "Distributable net income (DNI) serves to:",
          ja: "分配可能純所得(DNI)の役割はどれか。",
          c: [
            "Determine the trust's tax rate",
            "Limit the distribution deduction and the amount taxable to beneficiaries",
            "Measure the trust's corpus",
            "Determine the estate tax exemption",
          ],
          a: 1,
          ex: "DNIは信託の分配控除の上限であり、受益者が課税される金額の上限でもある(二重課税と課税漏れを防ぐ)。",
        },
        {
          q: "Income of a revocable trust in which the grantor retains the power to revoke is taxed to:",
          ja: "設定者が撤回権を保持する撤回可能信託の所得は、誰に課税されるか。",
          c: ["The trust", "The beneficiaries", "The grantor", "The trustee"],
          a: 2,
          ex: "設定者が支配を保持するgrantor trustの所得は、設定者自身に課税される。",
        },
        {
          q: "A decedent leaves the entire estate to a surviving spouse who is a U.S. citizen. The estate's marital deduction is:",
          ja: "被相続人が全財産を米国市民である配偶者に遺した。遺産の配偶者控除はどうなるか。",
          c: ["Limited to 50% of the gross estate", "Unlimited", "Limited to the annual exclusion", "Not allowed"],
          a: 1,
          ex: "米国市民の配偶者への移転は配偶者控除が無制限のため、遺産税はかからない(配偶者が非市民の場合は制限あり)。",
        },
        {
          q: "When is the federal estate tax return (Form 706) generally due?",
          ja: "連邦遺産税申告書(Form 706)の期限は一般にいつか。",
          c: ["April 15 of the following year", "6 months after the date of death", "9 months after the date of death", "12 months after the date of death"],
          a: 2,
          ex: "Form 706は死亡日から9か月以内(6か月の延長が可能)。",
        },
        {
          q: "Life insurance proceeds on the decedent's life are included in the gross estate if:",
          ja: "被相続人の生命保険金が総遺産に含まれるのはどのような場合か。",
          c: [
            "The policy was owned by an unrelated third party",
            "The decedent held incidents of ownership in the policy at death",
            "The proceeds are paid to a charity",
            "The policy was a term policy",
          ],
          a: 1,
          ex: "被相続人が死亡時に保険契約の支配権(受取人の変更、解約など)を持っていた場合、または遺産が受取人の場合に総遺産に含まれる。",
        },
      ],
      cards: [
        ["Simple trust", "単純信託", "所得の全額分配が必要"],
        ["Grantor trust", "グランター信託", "所得は設定者に課税"],
        ["Distributable net income (DNI)", "分配可能純所得", "分配控除と受益者課税の上限"],
        ["Gross estate", "総遺産", "死亡時の財産の時価合計"],
        ["Marital deduction", "配偶者控除", "米国市民の配偶者への移転は無制限"],
        ["Incidents of ownership", "保険契約の支配権", "あれば生命保険金が総遺産に含まれる"],
      ],
    },
  ],
});
