// FAR の追加問題(第3弾)

CPA.extend("FAR-01", {
  mcq: [
    {
      q: "For the year, a company reported net income of $300,000. It also had a foreign currency translation gain of $12,000, an unrealized holding loss on available-for-sale debt securities of $8,000, an unrealized gain on equity securities (readily determinable fair value) of $5,000, and a pension prior service cost arising during the year of $6,000. Ignoring income taxes, what is comprehensive income?",
      ja: "当期の純利益は$300,000。ほかに為替換算差益$12,000、売却可能(AFS)負債証券の未実現保有損失$8,000、持分証券(公正価値が容易に算定可能)の未実現利益$5,000、当期に発生した年金の過去勤務費用$6,000がある。税効果を無視した場合、包括利益はいくらか。",
      c: ["$303,000", "$298,000", "$304,000", "$312,000"],
      a: 1,
      ex: "包括利益 = 300,000 + 12,000 − 8,000 − 6,000 = 298,000。持分証券の公正価値変動は既に純利益に含まれるため加算しない($303,000は誤り)。年金の過去勤務費用はOCIの減少項目($304,000は漏れ)。",
    },
    {
      q: "After the balance sheet date but before the financial statements are issued, a major customer filed for bankruptcy because of a deteriorating financial condition that had existed for several months before year-end. The company should:",
      ja: "貸借対照表日後、財務諸表の発行前に、主要顧客が期末の数か月前から続いていた財務状況の悪化を原因として破産を申請した。会社はどうすべきか。",
      c: [
        "Disclose the event in the notes only, without adjusting the financial statements",
        "Make no adjustment or disclosure because the bankruptcy occurred after year-end",
        "Adjust the allowance for credit losses at the balance sheet date to reflect the loss",
        "Report the loss in the following year's financial statements as a prior-period adjustment",
      ],
      a: 2,
      ex: "期末時点で既に存在していた状況について追加的な証拠を提供する事象は「認識される後発事象」であり、期末の財務諸表を修正する(貸倒引当金の増額)。期末後に生じた状況(例:期末後の火災)なら注記のみとなる。",
    },
    {
      q: "Under ASC 280, if the total external revenue reported by operating segments that meet the quantitative thresholds is less than a certain percentage of total consolidated revenue, additional operating segments must be identified as reportable. That percentage is:",
      ja: "ASC 280において、量的基準を満たす事業セグメントの外部収益の合計が連結収益合計の一定割合に満たない場合、追加の事業セグメントを報告セグメントとして識別しなければならない。その割合はどれか。",
      c: ["10%", "50%", "90%", "75%"],
      a: 3,
      ex: "報告セグメントの外部収益合計は連結収益の75%以上でなければならない(75%テスト)。10%は個々のセグメントが報告対象となるかを判定する収益・損益・資産の基準である。",
    },
    {
      q: "Under ASC 820, which of the following is a Level 2 input for measuring the fair value of an asset?",
      ja: "ASC 820において、資産の公正価値測定におけるレベル2のインプットはどれか。",
      c: [
        "Quoted prices for similar assets in active markets",
        "Unadjusted quoted prices for identical assets in active markets that the entity can access",
        "The entity's own projections of future cash flows from the asset",
        "The historical cost of the asset adjusted for depreciation",
      ],
      a: 0,
      ex: "活発な市場における類似資産の相場価格は、直接・間接に観察可能なレベル2のインプット。同一資産の無調整の相場価格はレベル1、企業独自の将来CF予測は観察不能なレベル3。取得原価は公正価値のインプットではない。",
    },
    {
      q: "A company keeps its records on the cash basis. During the year, it collected $200,000 from customers for services. Accounts receivable increased from $30,000 to $45,000, and unearned service revenue decreased from $10,000 to $6,000. What is service revenue on the accrual basis?",
      ja: "ある会社は現金主義で記帳している。当期に顧客から役務の対価として$200,000を回収した。売掛金は$30,000から$45,000に増加し、前受収益は$10,000から$6,000に減少した。発生主義による役務収益はいくらか。",
      c: ["$181,000", "$211,000", "$219,000", "$189,000"],
      a: 2,
      ex: "発生主義の収益 = 現金回収200,000 + 売掛金の増加15,000 + 前受収益の減少4,000 = 219,000。前受収益の減少は過去に受け取った現金が当期に収益となったことを意味するので加算する($211,000は減算した誤り)。",
    },
    {
      q: "A change in the reporting entity, such as presenting consolidated statements in place of the statements of individual entities, should be reported by:",
      ja: "個別財務諸表に代えて連結財務諸表を作成するなど、報告主体の変更はどのように報告すべきか。",
      c: [
        "Including the cumulative effect of the change in current-year net income",
        "Applying the change prospectively in the current and future periods only",
        "Restating the opening balance of retained earnings of the current year only, with no change to prior-period statements",
        "Retrospectively applying the change to the financial statements of all prior periods presented",
      ],
      a: 3,
      ex: "報告主体の変更は、表示されるすべての過去期間の財務諸表に遡及適用する。将来に向けた適用は見積りの変更、累積的影響額の当期損益計上は現行GAAPでは用いない。",
    },
    {
      q: "A small company prepares financial statements using the modified cash basis, a special purpose framework. Which of the following is an acceptable modification of the cash basis?",
      ja: "ある小規模企業は特別目的の財務報告の枠組みである修正現金主義で財務諸表を作成している。現金主義の修正として認められるものはどれか。",
      c: [
        "Recording depreciation on capitalized property and equipment",
        "Recognizing all revenues when earned and all expenses when incurred",
        "Omitting a description of the basis of accounting",
        "Recognizing unrealized gains on all assets based on management's estimates",
      ],
      a: 0,
      ex: "修正現金主義では、固定資産の資本化と減価償却など「実質的な裏付け(substantial support)」のある修正が認められる。すべてを発生主義で処理すればもはやGAAPと同じであり、会計の基礎の説明は必ず開示する。",
    },
    {
      q: "A company had revenues of $900,000 and operating expenses of $600,000, a $20,000 loss on the sale of equipment, a $15,000 unrealized holding gain on available-for-sale debt securities, and a $50,000 pretax loss from a discontinued operation. The tax rate is 25%. What is income from continuing operations?",
      ja: "収益$900,000、営業費用$600,000、設備売却損$20,000、AFS負債証券の未実現保有利益$15,000、非継続事業の税引前損失$50,000がある。税率25%のとき、継続事業からの利益はいくらか。",
      c: ["$221,250", "$172,500", "$210,000", "$225,000"],
      a: 2,
      ex: "継続事業からの税引前利益 = 900,000 − 600,000 − 20,000 = 280,000、税引後 280,000 × 75% = 210,000。AFS負債証券の未実現利益はOCI、非継続事業の損失は継続事業の下に税引後で区分表示するため含めない。",
    },
  ],
});

CPA.extend("FAR-02", {
  mcq: [
    {
      q: "A company sells Products A, B, and C together for $90. Standalone selling prices are $40, $30, and $30, respectively. The company regularly sells A alone for $40 and regularly sells B and C together as a bundle for $50. How much of the transaction price should be allocated to Product A?",
      ja: "ある会社は製品A・B・Cを合わせて$90で販売する。独立販売価格はそれぞれ$40、$30、$30。会社はAを単独で定期的に$40で販売し、BとCをセットで定期的に$50で販売している。製品Aに配分すべき取引価格はいくらか。",
      c: ["$36", "$40", "$30", "$45"],
      a: 1,
      ex: "値引き10(=100−90)はBとCのセット販売に起因する観察可能な証拠があるため、BとCにのみ配分し、Aには独立販売価格の$40をそのまま配分する。比例配分の$36は、値引きの帰属に関する証拠がない場合の答え。",
    },
    {
      q: "On January 1, Year 1, a company delivers equipment to a customer, who will pay $121,000 on December 31, Year 2. The contract contains a significant financing component, and the appropriate discount rate is 10%. How much revenue from the sale of the equipment, and how much interest income, should be recognized in Year 1?",
      ja: "1年目1月1日、会社は顧客に設備を引き渡し、顧客は2年目12月31日に$121,000を支払う。契約には重要な金融要素が含まれ、適切な割引率は10%である。1年目に認識すべき設備の売上収益と受取利息はいくらか。",
      c: [
        "Revenue $121,000; interest income $0",
        "Revenue $110,000; interest income $11,000",
        "Revenue $100,000; interest income $10,000",
        "Revenue $0; interest income $10,000",
      ],
      a: 2,
      ex: "収益は現金販売価格(現在価値)121,000 ÷ 1.1² = 100,000で引渡時に認識し、受取利息は100,000 × 10% = 10,000(2年目は11,000)。名目額$121,000を収益とするのは金融要素を無視した誤り。",
    },
    {
      q: "A beverage manufacturer pays a retailer a $10,000 slotting fee for shelf space. The manufacturer receives no distinct good or service in exchange. Under ASC 606, the manufacturer should account for the payment as:",
      ja: "飲料メーカーが小売業者に棚スペース確保のための$10,000の陳列料(slotting fee)を支払う。メーカーはその対価として別個の財・サービスを受け取らない。ASC 606上、メーカーはこの支払いをどう処理すべきか。",
      c: [
        "A reduction of the transaction price (revenue)",
        "Advertising expense",
        "An intangible asset amortized over the contract term",
        "A cost to obtain a contract capitalized as an asset",
      ],
      a: 0,
      ex: "顧客に支払われる対価で、別個の財・サービスと交換されないものは取引価格(収益)の減額として処理する。広告宣伝費とするのは、別個のサービスを公正価値で受け取る場合に限られる。",
    },
    {
      q: "A company incurred $4,000 of legal fees to draft a contract with a potential customer. The fees would have been incurred whether or not the contract was obtained. Under ASC 340-40, the costs should be:",
      ja: "ある会社は見込み顧客との契約書作成のために弁護士費用$4,000を支出した。この費用は契約を獲得できたかどうかにかかわらず発生するものである。ASC 340-40上、この費用はどう処理すべきか。",
      c: [
        "Capitalized as an incremental cost of obtaining a contract",
        "Capitalized and amortized over the expected customer relationship period",
        "Deducted from the transaction price",
        "Expensed as incurred",
      ],
      a: 3,
      ex: "契約獲得の増分コスト(契約を獲得しなければ発生しなかったコスト、例:成功報酬型の販売手数料)のみ資産計上できる。契約の成否にかかわらず発生する弁護士費用は増分コストではなく、発生時に費用処理する。",
    },
    {
      q: "A retailer's customers earn loyalty points on purchases. During the month, sales totaled $50,000 (standalone selling price of the goods), and the points earned have a standalone selling price of $5,000 after considering the likelihood of redemption. How much revenue should be recognized when the goods are transferred?",
      ja: "小売業者の顧客は購入に応じてポイントを獲得する。当月の売上は$50,000(商品の独立販売価格)で、付与ポイントの独立販売価格は使用見込みを考慮して$5,000である。商品の引渡時に認識すべき収益はいくらか。",
      c: ["$50,000", "$45,000", "$45,455", "$55,000"],
      a: 2,
      ex: "ポイントは重要な権利として別個の履行義務。商品への配分 = 50,000 × 50,000 ÷ 55,000 = 45,455、ポイント分4,545は契約負債とし使用時に収益認識する。$45,000は差し引き計算した誤りで、相対的独立販売価格で配分する。",
    },
    {
      q: "A contract calls for 120 units at $100 each. After 60 units are delivered, the contract is modified to add 30 distinct units at $80 each, which is not their standalone selling price ($95). Remaining units are distinct from those already delivered. What revenue per unit should be recognized on the remaining 90 units?",
      ja: "120個を1個$100で販売する契約がある。60個を引き渡した後、契約が変更され、別個の製品30個を1個$80(独立販売価格$95ではない)で追加した。残りの製品はすでに引き渡した製品と別個である。残り90個について1個当たりいくらの収益を認識すべきか。",
      c: ["$93.33", "$100.00 for original units and $80.00 for added units", "$95.00", "$93.75"],
      a: 0,
      ex: "追加分が独立販売価格を反映しないため別契約にはならず、既存契約を終了し新契約を締結したものとして将来に向けて処理する。(60 × 100 + 30 × 80) ÷ 90 = 93.33。元の単価と追加単価を別々に適用するのは別契約扱いの場合。",
    },
    {
      q: "A company sells an asset to a customer for $500,000 and has an unconditional right (call option) to repurchase it in two years for $550,000. Under ASC 606, the company should account for the arrangement as:",
      ja: "ある会社は資産を顧客に$500,000で売却し、2年後に$550,000で買い戻す無条件の権利(コール・オプション)を持つ。ASC 606上、この取引はどのように処理すべきか。",
      c: [
        "A sale with a right of return",
        "A financing arrangement",
        "A lease",
        "A sale, with a gain recognized at delivery",
      ],
      a: 1,
      ex: "企業が買戻し権(コール・オプション)を持つ場合、顧客は資産を支配していないため収益は認識しない。買戻価格が当初の販売価格以上なら金融取引、下回るならリースとして処理する。本問は550,000 ≥ 500,000なので金融取引。",
    },
    {
      q: "A company sells a product for $100 per unit. If a customer purchases more than 1,000 units in a calendar year, the price is retroactively reduced to $90 per unit for all units. In the first quarter, a customer bought 300 units, and the company expects (and it is probable that a significant reversal will not occur) that the customer will exceed the threshold. How much revenue should be recognized in the first quarter?",
      ja: "ある会社は製品を1個$100で販売する。顧客が暦年で1,000個を超えて購入した場合、全数量について価格を遡及的に1個$90に引き下げる。第1四半期に顧客は300個を購入し、会社は顧客が基準を超えると見込んでいる(重大な戻入れが生じない可能性が高い)。第1四半期に認識すべき収益はいくらか。",
      c: ["$30,000", "$3,000", "$29,700", "$27,000"],
      a: 3,
      ex: "数量値引きは変動対価であり、基準超過が見込まれるので1個$90で見積もる:300 × 90 = 27,000。差額3,000は返金負債。$30,000は変動対価を考慮していない。",
    },
  ],
});

CPA.extend("FAR-03", {
  mcq: [
    {
      q: "A company using LIFO applies the lower of cost or market rule. For one inventory item: cost $30, replacement cost $22, selling price $34, costs to sell $4, and normal profit margin $6. At what per-unit amount should the item be reported?",
      ja: "LIFOを採用する会社は低価法(lower of cost or market)を適用する。ある品目は原価$30、再調達原価$22、売価$34、販売費用$4、正常利益$6である。1個当たりいくらで計上すべきか。",
      c: ["$22", "$30", "$24", "$28"],
      a: 2,
      ex: "上限(NRV)= 34 − 4 = 30、下限 = 30 − 6 = 24。再調達原価22は下限を下回るため市場価格は24。原価30と比べて低い24で計上する。LIFO・売価還元法以外ならNRVとの比較(LCNRV)となる。",
    },
    {
      q: "A company adopted dollar-value LIFO when its inventory was $100,000 (base-year index 1.00). At the end of Year 1, inventory at current-year cost was $132,000, and the price index was 1.10. What is ending inventory under dollar-value LIFO?",
      ja: "ある会社は棚卸資産が$100,000(基準年度指数1.00)のときにドル価値LIFOを採用した。1年目末の当年度原価による棚卸資産は$132,000、物価指数は1.10。ドル価値LIFOによる期末棚卸資産はいくらか。",
      c: ["$120,000", "$122,000", "$132,000", "$130,000"],
      a: 1,
      ex: "基準年度価格 = 132,000 ÷ 1.10 = 120,000、増加層20,000に当年度指数を掛けて22,000。期末 = 基準層100,000 + 22,000 = 122,000。$120,000は増加層を基準年度価格のまま、$132,000は当年度原価のまま計上した誤り。",
    },
    {
      q: "Using the conventional (lower of cost or market) retail inventory method: beginning inventory cost $30,000, retail $50,000; purchases cost $120,000, retail $190,000; net markups $10,000; net markdowns $20,000; sales $180,000. What is estimated ending inventory at cost?",
      ja: "通常の売価還元法(低価法)を用いる。期首棚卸資産は原価$30,000・売価$50,000、仕入は原価$120,000・売価$190,000、純値上額$10,000、純値下額$20,000、売上$180,000。期末棚卸資産の見積原価はいくらか。",
      c: ["$32,609", "$50,000", "$31,250", "$30,000"],
      a: 3,
      ex: "低価法の原価率は値下げを除外して計算:150,000 ÷ (50,000 + 190,000 + 10,000) = 60%。期末売価 = 250,000 − 20,000 − 180,000 = 50,000、原価 = 50,000 × 60% = 30,000。値下げを含めた原価率(65.2%)では$32,609となり原価法の答え。",
    },
    {
      q: "A company purchased land and a building for a lump sum of $600,000. Appraised fair values were $200,000 for the land and $550,000 for the building. At what amount should the building be recorded?",
      ja: "ある会社は土地と建物を一括で$600,000で購入した。鑑定による公正価値は土地$200,000、建物$550,000。建物はいくらで計上すべきか。",
      c: ["$440,000", "$400,000", "$550,000", "$450,000"],
      a: 0,
      ex: "一括購入価格は相対的公正価値で配分:600,000 × 550,000 ÷ 750,000 = 440,000。$400,000は土地の公正価値を差し引いた残余法で、相対的公正価値法ではない。",
    },
    {
      q: "A reporting unit has a carrying amount of $900,000, including goodwill of $150,000. Its fair value is $820,000. Under current U.S. GAAP for public business entities, what goodwill impairment loss should be recognized?",
      ja: "ある報告単位の帳簿価額は$900,000で、そのうちのれんは$150,000。報告単位の公正価値は$820,000。現行の米国GAAP(公開企業)上、認識すべきのれんの減損損失はいくらか。",
      c: ["$150,000", "$0", "$80,000", "$70,000"],
      a: 2,
      ex: "ASU 2017-04後は1ステップ:帳簿価額が公正価値を超える額900,000 − 820,000 = 80,000を減損とする(のれんの帳簿価額150,000が上限)。インプライドのれんの算定(旧ステップ2)は不要。",
    },
    {
      q: "A company purchased equipment for $200,000 to be used in a research and development project. The equipment has alternative future uses in other R&D projects and has a 5-year useful life. How should the cost be accounted for?",
      ja: "ある会社は研究開発プロジェクトで使用する設備を$200,000で購入した。この設備は他の研究開発プロジェクトにも転用可能(代替的な将来の用途あり)で、耐用年数は5年。この支出はどう処理すべきか。",
      c: [
        "Expensed immediately as R&D expense",
        "Capitalized and depreciated, with the depreciation reported as R&D expense",
        "Capitalized as an intangible asset and tested annually for impairment",
        "Capitalized and depreciated, with the depreciation reported in cost of goods sold",
      ],
      a: 1,
      ex: "代替的な将来の用途がある研究開発用の設備は資産計上し、その減価償却費を研究開発費として計上する。代替用途がなければ取得時に全額研究開発費となる。",
    },
    {
      q: "Under ASC 350-40, which of the following costs of developing internal-use software should be capitalized?",
      ja: "ASC 350-40において、社内利用ソフトウェアの開発コストのうち資産計上すべきものはどれか。",
      c: [
        "Costs of evaluating alternatives during the preliminary project stage",
        "Training costs incurred after the software is placed in service",
        "Coding and testing costs incurred during the application development stage",
        "Data conversion costs and routine maintenance",
      ],
      a: 2,
      ex: "社内利用ソフトウェアは、予備的プロジェクト段階後のアプリケーション開発段階のコスト(設計・コーディング・テスト等)を資産計上する。予備段階のコスト、トレーニング、データ変換、保守は費用処理。",
    },
    {
      q: "A mining company paid $2,000,000 for a mineral deposit estimated to contain 1,000,000 tons. Estimated restoration costs (asset retirement cost) are $300,000, and the land's residual value is $100,000. During the year, 120,000 tons were extracted and 100,000 tons were sold. How much depletion is included in cost of goods sold?",
      ja: "鉱業会社は推定埋蔵量1,000,000トンの鉱床を$2,000,000で取得した。原状回復費用(資産除去コスト)の見積りは$300,000、土地の残存価額は$100,000。当期に120,000トンを採掘し、100,000トンを販売した。売上原価に含まれる減耗償却費はいくらか。",
      c: ["$264,000", "$220,000", "$230,000", "$190,000"],
      a: 1,
      ex: "減耗償却の基礎 = 2,000,000 + 300,000 − 100,000 = 2,200,000、1トン当たり2.20。採掘分の減耗費264,000は棚卸資産となり、販売分100,000 × 2.20 = 220,000が売上原価に含まれる(残り44,000は期末棚卸資産)。",
    },
  ],
});

CPA.extend("FAR-04", {
  mcq: [
    {
      q: "A company issued $1,000,000 face value bonds with detachable stock warrants for total proceeds of $1,030,000. Immediately after issuance, the bonds without warrants had a fair value of $990,000 and the warrants had a fair value of $110,000. What amount should be allocated to the warrants (additional paid-in capital)?",
      ja: "ある会社は分離可能な新株予約権付きの額面$1,000,000の社債を発行し、総額$1,030,000を受け取った。発行直後の新株予約権を除く社債の公正価値は$990,000、新株予約権の公正価値は$110,000。新株予約権(資本剰余金)に配分すべき額はいくらか。",
      c: ["$110,000", "$30,000", "$40,000", "$103,000"],
      a: 3,
      ex: "分離可能な新株予約権は相対的公正価値で配分:1,030,000 × 110,000 ÷ 1,100,000 = 103,000。$110,000は公正価値そのもの、$40,000は残余法(1,030,000 − 990,000)。分離不能な転換社債なら全額を負債とする。",
    },
    {
      q: "Under current U.S. GAAP, debt issuance costs related to a recognized term loan should be presented in the balance sheet as:",
      ja: "現行の米国GAAPにおいて、認識済みのタームローンに関する社債(借入)発行費は貸借対照表上どのように表示すべきか。",
      c: [
        "A direct deduction from the carrying amount of the debt liability",
        "A deferred charge (noncurrent asset) amortized over the term of the debt",
        "An expense in the period the debt is issued",
        "A reduction of additional paid-in capital",
      ],
      a: 0,
      ex: "ASU 2015-03により、債務発行費は社債割引発行差金と同様に負債の帳簿価額から直接控除して表示し、実効金利法で利息費用として償却する。繰延資産として計上する方法は旧基準。",
    },
    {
      q: "In a troubled debt restructuring, a debtor transfers land with a carrying amount of $70,000 and a fair value of $90,000 to a creditor in full settlement of debt with a carrying amount of $120,000. What gains should the debtor recognize?",
      ja: "条件変更(トラブルド・デット・リストラクチャリング)において、債務者は帳簿価額$70,000・公正価値$90,000の土地を債権者に譲渡し、帳簿価額$120,000の債務を全額弁済した。債務者が認識すべき利益はどれか。",
      c: [
        "Gain on restructuring $50,000; no gain on the land",
        "Gain on transfer of land $20,000; gain on restructuring $30,000",
        "Gain on transfer of land $50,000; no gain on restructuring",
        "Gain on transfer of land $20,000; gain on restructuring $50,000",
      ],
      a: 1,
      ex: "債務者はまず土地を公正価値で評価し譲渡益90,000 − 70,000 = 20,000を認識、次に債務の帳簿価額と土地の公正価値の差120,000 − 90,000 = 30,000を条件変更益とする。合計は50,000だが区分して計上する。",
    },
    {
      q: "At lease commencement, a lessee's lease liability (present value of unpaid lease payments) is $50,000. The lessee incurred initial direct costs of $2,000 and received a lease incentive of $3,000 from the lessor. Under ASC 842, at what amount should the right-of-use asset be initially measured?",
      ja: "リース開始日に、借手のリース負債(未払リース料の現在価値)は$50,000である。借手は当初直接コスト$2,000を負担し、貸手からリース・インセンティブ$3,000を受け取った。ASC 842上、使用権資産の当初測定額はいくらか。",
      c: ["$50,000", "$52,000", "$49,000", "$55,000"],
      a: 2,
      ex: "使用権資産 = リース負債50,000 + 開始日以前の前払リース料 + 当初直接コスト2,000 − 受け取ったリース・インセンティブ3,000 = 49,000。インセンティブは控除項目である。",
    },
    {
      q: "A seller-lessee sells a building and leases it back. The seller-lessee has an option to repurchase the building at a fixed price, and the building is not readily available in the marketplace. Under ASC 842, the seller-lessee should:",
      ja: "売手である借手が建物を売却しリースバックする。売手である借手は固定価格で建物を買い戻すオプションを有し、建物は市場で容易に入手できるものではない。ASC 842上、売手である借手はどう処理すべきか。",
      c: [
        "Derecognize the building and recognize the full gain at the date of sale",
        "Derecognize the building and defer the gain over the leaseback term",
        "Recognize a right-of-use asset and lease liability for the leaseback, and derecognize the building",
        "Continue to recognize the building and record the proceeds as a financial liability",
      ],
      a: 3,
      ex: "買戻オプション(行使価格が公正価値でなく、資産が市場で容易に入手できない)があると、ASC 606上の支配の移転がなく売却不成立(failed sale)となる。建物の認識を継続し、受取額を金融負債として処理する。",
    },
    {
      q: "On January 1, a lessee recognized a finance lease liability and right-of-use asset of $100,000 for a 5-year lease. Payments are made at the end of each year, the interest rate is 8%, and the ROU asset is amortized on a straight-line basis over the lease term. What total lease expense is recognized in Year 1?",
      ja: "1月1日、借手は5年間のファイナンス・リースについてリース負債と使用権資産$100,000を認識した。支払は各年末、利率は8%、使用権資産はリース期間にわたり定額法で償却する。1年目に認識するリース費用の合計はいくらか。",
      c: ["$28,000", "$25,047", "$20,000", "$33,000"],
      a: 0,
      ex: "ファイナンス・リースでは支払利息と償却費を別々に認識:利息100,000 × 8% = 8,000、償却100,000 ÷ 5 = 20,000、合計28,000(初年度に費用が多くなる)。年間支払額で均等に費用計上するのはオペレーティング・リース。",
    },
    {
      q: "At year-end, a company violated a debt covenant on a long-term loan, making the loan callable by the lender. Under U.S. GAAP, the loan should be classified as noncurrent only if:",
      ja: "期末に、会社は長期借入金の財務制限条項に違反し、貸手が返済を請求できる状態になった。米国GAAP上、この借入金を非流動負債に分類できるのはどのような場合か。",
      c: [
        "Management believes the lender is unlikely to demand repayment",
        "The lender waives its right to demand repayment for more than one year from the balance sheet date",
        "The company has sufficient cash to repay the loan",
        "The loan's original maturity date is more than one year after the balance sheet date",
      ],
      a: 1,
      ex: "条項違反で請求可能となった債務は流動負債とする。ただし貸手が貸借対照表日から1年超の期間、返済請求権を放棄した場合(または猶予期間内に違反が解消される可能性が高い場合)は非流動に分類できる。経営者の期待や当初の満期日では不十分。",
    },
    {
      q: "A company elected the fair value option for its bonds payable. During the year, the fair value of the bonds decreased by $50,000, of which $12,000 resulted from a change in the company's instrument-specific credit risk. How should the $50,000 be reported?",
      ja: "ある会社は発行社債に公正価値オプションを選択した。当期に社債の公正価値が$50,000減少し、そのうち$12,000は自社の商品固有の信用リスクの変動によるものである。$50,000はどのように報告すべきか。",
      c: [
        "$38,000 gain in net income and $12,000 gain in other comprehensive income",
        "$50,000 gain in net income",
        "$50,000 gain in other comprehensive income",
        "$12,000 gain in net income and $38,000 gain in other comprehensive income",
      ],
      a: 0,
      ex: "公正価値オプションを選択した金融負債の公正価値変動のうち、自社の信用リスクの変動に起因する部分はOCI、残りは純利益に計上する(ASU 2016-01)。38,000は純利益、12,000はOCI。",
    },
  ],
});

CPA.extend("FAR-05", {
  mcq: [
    {
      q: "An available-for-sale debt security has an amortized cost of $100,000 and a fair value of $88,000. The company does not intend to sell it and is not more likely than not required to sell it before recovery. The present value of expected cash flows is $94,000. Under ASC 326, how is the decline reported?",
      ja: "売却可能(AFS)負債証券の償却原価は$100,000、公正価値は$88,000。会社は売却の意図がなく、回復前に売却を要求される可能性も高くない。予想キャッシュフローの現在価値は$94,000。ASC 326上、価値の下落はどう報告されるか。",
      c: [
        "$12,000 credit loss in net income through a direct write-down",
        "$6,000 credit loss in net income through an allowance, and $6,000 in other comprehensive income",
        "$12,000 in other comprehensive income, with no credit loss",
        "$6,000 credit loss in net income through a direct write-down, and $6,000 in other comprehensive income",
      ],
      a: 1,
      ex: "AFS負債証券の信用損失は償却原価と予想CFの現在価値の差100,000 − 94,000 = 6,000を貸倒引当金(allowance)で純利益に計上(公正価値との差額12,000が上限)。残りの6,000は信用以外の要因としてOCI。売却意図がある場合は全額12,000を損益で直接減額する。",
    },
    {
      q: "An investor holds an equity security without a readily determinable fair value and without significant influence. If the investor elects the measurement alternative, the investment is measured at:",
      ja: "投資者は、公正価値が容易に算定できず重要な影響力もない持分証券を保有している。測定の代替法(measurement alternative)を選択した場合、投資はどのように測定されるか。",
      c: [
        "Fair value, with changes reported in other comprehensive income",
        "Amortized cost",
        "Cost minus impairment, plus or minus changes from observable price changes in orderly transactions for identical or similar investments of the same issuer",
        "The investor's share of the investee's net assets",
      ],
      a: 2,
      ex: "測定の代替法では、取得原価から減損を控除し、同一発行体の同一・類似証券の秩序ある取引で観察可能な価格変動を加減して測定する(変動は純利益)。持分証券の公正価値変動をOCIに計上する方法は現行GAAPにはない。",
    },
    {
      q: "A company acquired 1,000 shares of its own common stock at $30 per share (cost method). It later reissued 600 shares at $35 per share and then the remaining 400 shares at $20 per share. Before these transactions, there was no paid-in capital from treasury stock. How much should be debited to retained earnings?",
      ja: "ある会社は自己株式1,000株を1株$30で取得した(原価法)。その後600株を1株$35で再発行し、残り400株を1株$20で再発行した。取引前には自己株式処分差益(資本剰余金)はなかった。利益剰余金に借記すべき額はいくらか。",
      c: ["$0", "$4,000", "$3,000", "$1,000"],
      a: 3,
      ex: "600株の再発行で差益600 × (35 − 30) = 3,000を資本剰余金(自己株式)に計上。400株の再発行差損400 × (30 − 20) = 4,000は、まず3,000を同勘定から減額し、不足する1,000を利益剰余金に借記する。",
    },
    {
      q: "On January 1, Year 1, a company granted 10,000 stock options to executives. The grant-date fair value is $12 per option, and the options cliff-vest after four years of service. No forfeitures are expected. What compensation expense should be recognized in Year 1?",
      ja: "1年目1月1日、会社は役員に10,000個のストック・オプションを付与した。付与日の公正価値は1個$12で、4年間の勤務後に一括で権利確定する。失効は見込まれない。1年目に認識すべき報酬費用はいくらか。",
      c: ["$30,000", "$120,000", "$40,000", "$0"],
      a: 0,
      ex: "持分決済型の報酬は付与日の公正価値で測定し、必要勤務期間にわたり費用配分:10,000 × 12 ÷ 4 = 30,000。付与日に全額を費用化したり、権利行使まで費用を認識しないのは誤り。",
    },
    {
      q: "A company had 100,000 common shares outstanding on January 1. It issued 20,000 shares on March 1, distributed a 10% stock dividend on July 1, and purchased 6,000 treasury shares on October 1. What is the weighted-average number of shares for basic EPS?",
      ja: "ある会社は1月1日に普通株式100,000株が発行済みであった。3月1日に20,000株を発行、7月1日に10%の株式配当を実施、10月1日に自己株式6,000株を取得した。基本的EPSの加重平均株式数はいくらか。",
      c: ["$125,167", "126,833", "121,167", "128,333"],
      a: 1,
      ex: "株式配当は期首(または発行日)に遡って適用:100,000 × 1.1 + 20,000 × 1.1 × 10/12 − 6,000 × 3/12 = 110,000 + 18,333 − 1,500 = 126,833。3月発行分に株式配当を遡及しないと125,167になる。",
    },
    {
      q: "A company's net income is $300,000, and preferred dividends on its convertible preferred stock are $50,000. Weighted-average common shares are 125,000. The preferred stock is convertible into 20,000 common shares. There are no other potential common shares. What is diluted EPS?",
      ja: "純利益は$300,000、転換優先株の優先配当は$50,000。普通株式の加重平均株式数は125,000株。優先株は普通株式20,000株に転換可能で、ほかに潜在株式はない。希薄化後EPSはいくらか。",
      c: ["$2.07", "$2.40", "$2.00", "$1.72"],
      a: 2,
      ex: "基本的EPS = (300,000 − 50,000) ÷ 125,000 = 2.00。転換を仮定すると 300,000 ÷ 145,000 = 2.07で基本的EPSを上回る(1株当たり増分2.50)ため逆希薄化となり除外。希薄化後EPSは2.00。",
    },
    {
      q: "Parent paid $800,000 cash to acquire 80% of Subsidiary. At the acquisition date, the fair value of the noncontrolling interest was $190,000, and the fair value of Subsidiary's identifiable net assets was $900,000. What amount of goodwill should be reported in the consolidated balance sheet?",
      ja: "親会社は子会社の80%を現金$800,000で取得した。取得日の非支配持分の公正価値は$190,000、子会社の識別可能純資産の公正価値は$900,000。連結貸借対照表に計上すべきのれんはいくらか。",
      c: ["$80,000", "$0", "$100,000", "$90,000"],
      a: 3,
      ex: "取得法では全部のれん:(移転対価800,000 + 非支配持分の公正価値190,000) − 識別可能純資産900,000 = 90,000。$80,000は親会社持分のみ(800,000 − 720,000)で計算した誤り。",
    },
    {
      q: "During the year, Parent sold inventory costing $60,000 to its wholly owned subsidiary for $80,000. At year-end, 25% of this inventory remained in the subsidiary's ending inventory. In consolidation, by how much should ending inventory be reduced?",
      ja: "当期に親会社は原価$60,000の棚卸資産を100%子会社に$80,000で販売した。期末に、この棚卸資産の25%が子会社の期末在庫に残っている。連結上、期末棚卸資産をいくら減額すべきか。",
      c: ["$5,000", "$20,000", "$15,000", "$4,000"],
      a: 0,
      ex: "未実現利益 = (80,000 − 60,000) × 25% = 5,000を期末棚卸資産から消去する。$20,000は利益全額、$15,000は外部に販売され実現した部分。連結では売上高・売上原価も80,000ずつ消去する。",
    },
  ],
});

CPA.extend("FAR-06", {
  mcq: [
    {
      q: "Under GASB 87, when a government enters into a 5-year lease of equipment (as lessee) that is accounted for in the general fund, what is reported in the general fund at lease commencement?",
      ja: "GASB 87において、政府が借手として設備の5年リースを締結し、一般基金で会計処理する場合、リース開始時に一般基金で何を報告するか。",
      c: [
        "An intangible right-to-use asset and a lease liability",
        "Nothing until the first lease payment is made",
        "An expenditure and an other financing source equal to the initial lease liability",
        "A capital asset and deferred inflows of resources",
      ],
      a: 2,
      ex: "政府基金(修正発生主義)では、リース開始時に初期リース負債と同額の支出(capital outlay)とその他の財源(other financing source)を計上する。使用権資産(無形資産)とリース負債は政府全体財務諸表で報告する。",
    },
    {
      q: "Under GASB 96, a government enters into a subscription-based information technology arrangement (SBITA) with a maximum possible term, including options to extend, of 10 months. The government should:",
      ja: "GASB 96において、政府が延長オプションを含む最長可能期間が10か月のサブスクリプション型ITアレンジメント(SBITA)を締結した。政府はどう処理すべきか。",
      c: [
        "Recognize a subscription asset and subscription liability at commencement",
        "Recognize subscription payments as outflows of resources based on the payment terms, without recognizing an asset or liability",
        "Capitalize all implementation costs as a capital asset",
        "Report the arrangement as a capital lease",
      ],
      a: 1,
      ex: "最長可能期間が12か月以下のSBITAは短期SBITAとして、資産・負債を認識せず支払条件に従って費用(支出)を認識する。12か月超なら開始時にサブスクリプション資産(無形)と負債を認識する。",
    },
    {
      q: "A city's general fund, which uses encumbrance accounting, issued a purchase order for $5,000. The goods arrived with an invoice for $4,800. Upon receipt of the goods, the city should record:",
      ja: "予算統制のため負担行為(encumbrance)会計を用いる市の一般基金は、$5,000の発注書を発行した。商品は$4,800の請求書とともに到着した。商品受領時に市が記録すべきものはどれか。",
      c: [
        "Reversal of the $5,000 encumbrance and an expenditure of $4,800",
        "An expenditure of $5,000 and no reversal of the encumbrance",
        "Reversal of $4,800 of the encumbrance and an expenditure of $4,800",
        "An expense of $4,800 and a capital asset of $200",
      ],
      a: 0,
      ex: "受領時には発注時に計上した負担行為の全額5,000を取り消し(Budgetary fund balance reserved for encumbrancesを借記、Encumbrancesを貸記)、実際の請求額4,800を支出として計上する。",
    },
    {
      q: "A city's general obligation bonds pay interest of $60,000 each January 15. The city does not provide resources in the debt service fund in advance of the due date. What interest expenditure related to the January 15 payment should the debt service fund report for the year ended December 31?",
      ja: "市の一般財源債(GO債)は毎年1月15日に利息$60,000を支払う。市は支払期日前に債務償還基金へ資金を拠出していない。12月31日終了年度に、債務償還基金が1月15日の支払いに関して報告すべき利息支出はいくらか。",
      c: ["$57,500", "$60,000", "$5,000", "$0"],
      a: 3,
      ex: "修正発生主義では一般長期債務の元利金は支払期日(due)に支出を認識し、期末に経過利息を見越計上しない。翌期首早々に期日が到来し資金を事前に拠出した場合に限り、期末に計上することが認められる。政府全体財務諸表では発生主義で見越計上する。",
    },
    {
      q: "Governmental funds reported capital outlay expenditures of $500,000. Depreciation expense on governmental capital assets was $120,000. In the reconciliation of the change in fund balances of governmental funds to the change in net position of governmental activities, the net adjustment for these items is:",
      ja: "政府基金は資本的支出(capital outlay)$500,000を報告した。政府活動の固定資産の減価償却費は$120,000。政府基金の基金残高の増減から政府活動の純資産の増減への調整表において、これらの項目による純調整額はいくらか。",
      c: ["Decrease of $380,000", "Increase of $500,000", "Increase of $380,000", "Decrease of $120,000"],
      a: 2,
      ex: "政府全体では資本的支出は資産計上されるため+500,000、減価償却費は費用となるため−120,000、純額で純資産の増減を380,000増加させる調整を行う。",
    },
    {
      q: "A donor promises a not-for-profit organization $100,000 only if the organization raises $100,000 from other donors by year-end; if the goal is not met, the donor will give nothing. By year-end, the organization has raised $60,000 from other donors. How much revenue from this donor's promise should be recognized?",
      ja: "寄付者は、非営利組織が年度末までに他の寄付者から$100,000を集めた場合にのみ$100,000を寄付すると約束した。目標に達しなければ一切寄付しない。年度末までに組織は他の寄付者から$60,000を集めた。この寄付者の約束による収益はいくら認識すべきか。",
      c: ["$100,000", "$60,000", "$40,000", "$0"],
      a: 3,
      ex: "障壁(barrier)と返還・解除の権利がある条件付約束は、条件が満たされるまで収益を認識しない(ASU 2018-08)。全額か無しかの条件で目標未達のため0。他の寄付者からの60,000は別途寄付収益となる。",
    },
    {
      q: "A not-for-profit entity's investments earned dividends and interest of $40,000 and net realized and unrealized gains of $25,000. External investment advisor fees were $5,000, and direct internal investment expenses were $2,000. How should investment return be reported in the statement of activities?",
      ja: "非営利組織の投資から配当・利息$40,000、実現・未実現の純利益$25,000が生じた。外部の投資顧問報酬は$5,000、直接的な内部投資費用は$2,000。活動計算書で投資収益はどのように報告すべきか。",
      c: [
        "Investment return of $58,000, net of external and direct internal investment expenses",
        "Investment return of $65,000, with $7,000 reported as management and general expense",
        "Investment return of $60,000, with $2,000 reported as program expense",
        "Dividends and interest of $40,000 only, with gains reported directly in net assets",
      ],
      a: 0,
      ex: "ASU 2016-14により、投資収益は外部および直接的な内部投資費用を控除した純額で報告する:40,000 + 25,000 − 5,000 − 2,000 = 58,000。控除した費用の開示は不要。",
    },
    {
      q: "A city receives a gift that must be invested permanently; only the earnings may be used to maintain the city's public parks. In which fund should the gift be reported?",
      ja: "市は、元本を永久に運用しなければならず、その運用益のみを市の公園の維持に使用できる寄付を受け取った。この寄付はどの基金で報告すべきか。",
      c: ["Private-purpose trust fund", "Special revenue fund", "Permanent fund", "Custodial fund"],
      a: 2,
      ex: "元本は使用できず運用益のみが政府自身のプログラム(市民全体の便益)に使われる資源は永久基金(政府基金)で報告する。運用益が特定の個人・組織のためなら私的目的信託基金(受託基金)となる。",
    },
  ],
});

CPA.extend("FAR-07", {
  mcq: [
    {
      q: "At the end of Year 1, a company has a taxable temporary difference of $90,000 that will reverse equally over Years 2, 3, and 4. Enacted tax rates are 21% for Year 2 and 25% for Years 3 and 4. What deferred tax liability should be reported at the end of Year 1?",
      ja: "1年目末に、2年目・3年目・4年目に均等に解消する将来加算一時差異$90,000がある。制定済みの税率は2年目21%、3年目・4年目25%。1年目末に報告すべき繰延税金負債はいくらか。",
      c: ["$18,900", "$22,500", "$21,300", "$20,700"],
      a: 2,
      ex: "繰延税金は差異が解消する年度の制定済み税率で測定:30,000 × 21% + 30,000 × 25% × 2 = 6,300 + 15,000 = 21,300。現行税率(21%)のみ、または最終税率(25%)のみの適用は誤り。",
    },
    {
      q: "A company's taxable income is $400,000, and the tax rate is 21%. During the year, its deferred tax liability increased by $10,000 and its deferred tax asset (with no valuation allowance) increased by $3,000. What is total income tax expense?",
      ja: "課税所得は$400,000、税率は21%。当期に繰延税金負債が$10,000増加し、繰延税金資産(評価性引当額なし)が$3,000増加した。法人税等合計はいくらか。",
      c: ["$97,000", "$91,000", "$84,000", "$87,000"],
      a: 1,
      ex: "当期税金 = 400,000 × 21% = 84,000。繰延税金費用 = DTLの増加10,000 − DTAの増加3,000 = 7,000。合計91,000。DTAの増加は繰延税金の便益(費用の減少)となる。",
    },
    {
      q: "Under current U.S. GAAP, deferred tax assets and deferred tax liabilities in a classified balance sheet are presented as:",
      ja: "現行の米国GAAPにおいて、流動・非流動区分のある貸借対照表で、繰延税金資産および負債はどのように表示されるか。",
      c: [
        "Current or noncurrent based on the classification of the related asset or liability",
        "Current or noncurrent based on the expected reversal date",
        "Current in all cases",
        "Noncurrent in all cases, netted within each tax-paying component and jurisdiction",
      ],
      a: 3,
      ex: "ASU 2015-17により、繰延税金資産・負債はすべて非流動として表示し、同一の納税主体・税務管轄内で相殺して純額表示する。関連する資産・負債の区分による分類は旧基準。",
    },
    {
      q: "A company's pretax financial income is $500,000, including $20,000 of interest on municipal bonds and after deducting $10,000 of fines paid for violating a law. There are no temporary differences, and the tax rate is 21%. What is income tax expense?",
      ja: "税引前会計利益は$500,000で、地方債の受取利息$20,000を含み、法令違反の罰金$10,000を控除した後の金額である。一時差異はなく、税率は21%。法人税等はいくらか。",
      c: ["$105,000", "$100,800", "$102,900", "$98,700"],
      a: 2,
      ex: "地方債利息は非課税(減算)、罰金は損金不算入(加算)の永久差異:課税所得 = 500,000 − 20,000 + 10,000 = 490,000、税額 = 490,000 × 21% = 102,900。永久差異は繰延税金を生じず、実効税率を変える。",
    },
    {
      q: "A company acquired a building by signing a $1,000,000 mortgage note payable to the seller, with no cash exchanged. In the statement of cash flows, this transaction should be:",
      ja: "ある会社は売主に対して$1,000,000の抵当付手形を振り出して建物を取得し、現金の授受はなかった。キャッシュフロー計算書上、この取引はどのように表示すべきか。",
      c: [
        "Reported as an investing outflow and a financing inflow of $1,000,000",
        "Disclosed as a noncash investing and financing activity, not in the body of the statement",
        "Reported as an operating activity",
        "Omitted entirely from the financial statements",
      ],
      a: 1,
      ex: "現金を伴わない投資・財務活動はキャッシュフロー計算書の本体には含めず、別途(計算書の末尾または注記で)開示する。投資・財務の両方にグロスで計上するのは誤り。",
    },
    {
      q: "Under U.S. GAAP, cash paid to purchase debt securities acquired specifically for resale and classified as trading is reported in the statement of cash flows as:",
      ja: "米国GAAPにおいて、転売目的で取得しトレーディングに分類した負債証券の購入による支出は、キャッシュフロー計算書上どのように表示されるか。",
      c: [
        "An operating activity",
        "An investing activity",
        "A financing activity",
        "A noncash activity",
      ],
      a: 0,
      ex: "トレーディング目的(転売目的)で取得した証券の売買は性質に基づき営業活動に分類する。売却可能・満期保有の負債証券や持分証券(非トレーディング)の売買は投資活動。",
    },
    {
      q: "Operating expenses on the income statement were $200,000, including depreciation of $30,000. Prepaid expenses increased by $5,000, and accrued liabilities decreased by $4,000. Using the direct method, what was cash paid for operating expenses?",
      ja: "損益計算書の営業費用は$200,000で、減価償却費$30,000を含む。前払費用は$5,000増加し、未払費用は$4,000減少した。直接法による営業費用の支払額はいくらか。",
      c: ["$161,000", "$171,000", "$209,000", "$179,000"],
      a: 3,
      ex: "支払額 = 200,000 − 減価償却費30,000 + 前払費用の増加5,000 + 未払費用の減少4,000 = 179,000。前払の増加・未払の減少はいずれも費用以上に現金を支払ったことを意味する。",
    },
    {
      q: "During the year, a company issued bonds for $300,000, declared dividends of $60,000 (dividends payable increased by $10,000), purchased treasury stock for $40,000, and made principal payments of $15,000 on a finance lease liability. What is net cash provided by financing activities?",
      ja: "当期に会社は社債を$300,000で発行し、配当$60,000を宣言し(未払配当金は$10,000増加)、自己株式を$40,000で取得し、ファイナンス・リース負債の元本$15,000を支払った。財務活動によるキャッシュフローの純額はいくらか。",
      c: ["$195,000", "$185,000", "$210,000", "$235,000"],
      a: 0,
      ex: "配当の支払額 = 60,000 − 10,000 = 50,000。財務CF = 300,000 − 50,000 − 40,000 − 15,000 = 195,000。ファイナンス・リースの元本返済は財務活動(利息部分は営業活動)。宣言額60,000を使うと185,000となる。",
    },
  ],
});
