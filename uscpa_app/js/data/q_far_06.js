// FAR の追加問題(投資・資本・EPS・株式報酬・外貨建取引)

CPA.extend("FAR-05", {
  mcq: [
    {
      q: "On January 1, Year 1, a company purchased $500,000 face value, 8% bonds (interest paid annually on December 31) for $462,092 to yield 10%. The bonds are classified as held-to-maturity, and the effective interest method is used. What is the carrying amount of the investment at December 31, Year 1?",
      ja: "第1年度1月1日、会社は額面$500,000、利率8%(利息は毎年12月31日払い)の社債を、利回り10%となる$462,092で購入した。満期保有目的(HTM)に分類し、実効金利法を用いる。第1年度12月31日の投資の帳簿価額はいくらか。",
      c: ["$462,092", "$468,301", "$455,883", "$470,000"],
      a: 1,
      ex: "受取利息 = 462,092 × 10% = 46,209、現金受取 40,000、ディスカウント償却 6,209。帳簿価額 = 462,092 + 6,209 = 468,301。ディスカウントは帳簿価額を増加させる(減算した$455,883は誤り)。",
    },
    {
      q: "On January 1, Year 1, an investor purchased $100,000 face value, 10% bonds paying interest annually for $107,985, a price that yields 8%. The bonds are classified as held-to-maturity. Using the effective interest method, how much interest revenue should the investor report for Year 1?",
      ja: "第1年度1月1日、投資者は額面$100,000、利率10%(年1回利払い)の社債を利回り8%となる$107,985で購入し、HTMに分類した。実効金利法による第1年度の受取利息はいくらか。",
      c: ["$10,000", "$8,000", "$8,639", "$11,361"],
      a: 2,
      ex: "受取利息 = 107,985 × 8% = 8,639。現金受取10,000との差額1,361はプレミアム償却として投資の帳簿価額を減らす。$10,000は表面利息のみで償却を無視している。",
    },
    {
      q: "A company purchased an available-for-sale debt security at par for $200,000 in Year 1. Its fair value was $212,000 at December 31, Year 1, and $205,000 at December 31, Year 2. There is no credit loss. What amount should be reported in other comprehensive income for Year 2?",
      ja: "会社は第1年度に売却可能(AFS)負債証券を額面の$200,000で購入した。公正価値は第1年度末$212,000、第2年度末$205,000であった。信用損失はない。第2年度のその他の包括利益(OCI)に計上すべき金額はいくらか。",
      c: ["Unrealized gain of $5,000", "Unrealized loss of $7,000", "Unrealized gain of $12,000", "Zero, because the loss is reported in net income"],
      a: 1,
      ex: "第2年度のOCIは当期の公正価値変動 205,000 − 212,000 = 7,000の損失である。$5,000の利益は取得原価からの累計額(AOCI残高)であり当期のOCIではない。信用損失以外のAFSの変動は純利益ではなくOCIに計上する。",
    },
    {
      q: "An available-for-sale debt security with an amortized cost of $80,000 was reported at its fair value of $86,000 at the prior year-end. During the current year, before any further fair value adjustment, the security was sold for $89,000. What gain should be recognized in net income on the sale?",
      ja: "償却原価$80,000のAFS負債証券は、前期末に公正価値$86,000で報告されていた。当期、追加の公正価値調整を行う前に$89,000で売却した。売却により純利益に認識すべき利益はいくらか。",
      c: ["$3,000", "$6,000", "$9,000", "$15,000"],
      a: 2,
      ex: "実現利益 = 売却価額 89,000 − 償却原価 80,000 = 9,000。AOCIに累積していた6,000は組替調整(リサイクリング)により純利益へ振り替えられる。$3,000は前期末の公正価値との差額のみで組替を無視している。",
    },
    {
      q: "On November 1, Year 1, a company purchased debt securities classified as trading for $30,000. At December 31, Year 1, the fair value was $27,500. The securities were sold on February 10, Year 2, for $31,000. Ignoring interest, what gain should be reported in Year 2 net income?",
      ja: "第1年度11月1日、会社はトレーディング目的の負債証券を$30,000で購入した。第1年度末の公正価値は$27,500であった。第2年度2月10日に$31,000で売却した。利息を無視した場合、第2年度の純利益に計上すべき利益はいくらか。",
      c: ["$1,000", "$2,500", "$4,500", "$3,500"],
      a: 3,
      ex: "トレーディングは公正価値変動を毎期純利益に計上するため、第1年度に2,500の損失を認識済み。第2年度の利益 = 31,000 − 27,500 = 3,500。$1,000は取得原価との比較で、前期に計上した損失を二重に考慮していない。",
    },
    {
      q: "A company transfers a debt security from held-to-maturity to available-for-sale. At the transfer date, the security's amortized cost is $150,000 and its fair value is $158,000. How should the $8,000 difference be reported?",
      ja: "会社は負債証券をHTMからAFSへ振り替えた。振替日の償却原価は$150,000、公正価値は$158,000である。差額$8,000はどのように報告すべきか。",
      c: [
        "As an unrealized holding gain in other comprehensive income",
        "As a gain in net income",
        "It is not recognized until the security is sold",
        "As a deferred credit amortized over the remaining life of the security",
      ],
      a: 0,
      ex: "HTMからAFSへの振替時の未実現保有損益はOCIに計上する。トレーディングへ振り替える場合は純利益に計上するので、選択肢を混同しないこと。",
    },
    {
      q: "An available-for-sale debt security has an amortized cost of $60,000. At the prior year-end it was reported at a fair value of $63,000. When its fair value is $65,000, the company transfers it to the trading category. How much should be recognized in net income at the date of transfer?",
      ja: "AFS負債証券の償却原価は$60,000で、前期末は公正価値$63,000で報告されていた。公正価値が$65,000の時点でトレーディングへ振り替えた。振替日に純利益に認識すべき金額はいくらか。",
      c: ["$0", "$2,000", "$3,000", "$5,000"],
      a: 3,
      ex: "トレーディングへの振替時は、未実現損益の全額を直ちに純利益に認識する。AOCIからの組替3,000 + 当期の変動2,000 = 5,000。$2,000は当期変動のみでAOCIの組替を漏らしている。",
    },
    {
      q: "A company transfers a debt security from the trading category to available-for-sale. Unrealized holding gains of $4,000 had been recognized in earnings before the transfer. How should these previously recognized gains be treated at the transfer date?",
      ja: "会社は負債証券をトレーディングからAFSへ振り替えた。振替前に未実現保有利益$4,000が純利益に認識されていた。振替日にこの既認識の利益はどのように扱うべきか。",
      c: [
        "Reversed out of earnings and recorded in other comprehensive income",
        "Not reversed, because they have already been recognized in earnings",
        "Reversed out of earnings and deferred until the security is sold",
        "Reclassified to retained earnings as a prior-period adjustment",
      ],
      a: 1,
      ex: "トレーディングからの振替では、振替日の未実現保有損益は既に純利益に認識済みであり、戻し入れない。振替日の公正価値が新たな基準となり、以後の変動はOCIに計上する。",
    },
    {
      q: "On April 1, an investor purchased $100,000 face value, 6% bonds that pay interest semiannually on January 1 and July 1. The purchase price was 98 plus accrued interest. What total cash did the investor pay?",
      ja: "4月1日、投資者は額面$100,000、利率6%(1月1日と7月1日の年2回利払い)の社債を98に経過利息を加えた価格で購入した。投資者が支払った現金総額はいくらか。",
      c: ["$98,000", "$96,500", "$99,500", "$101,500"],
      a: 2,
      ex: "経過利息 = 100,000 × 6% × 3/12 = 1,500。支払総額 = 98,000 + 1,500 = 99,500。経過利息は投資原価ではなく未収利息であり、7月1日の利払いで回収される。",
    },
    {
      q: "At year-end, a company's trade receivables aging schedule shows: current $400,000 (1% expected loss), 1-30 days past due $100,000 (5%), 31-90 days past due $50,000 (20%), and over 90 days past due $20,000 (50%). Before adjustment, the allowance for credit losses has a credit balance of $6,000. What is the credit loss expense for the year?",
      ja: "期末の売掛金年齢表は、期日未到来$400,000(予想損失率1%)、1-30日延滞$100,000(5%)、31-90日延滞$50,000(20%)、90日超延滞$20,000(50%)である。調整前の貸倒引当金は貸方残高$6,000である。当期の信用損失費用はいくらか。",
      c: ["$23,000", "$29,000", "$35,000", "$17,000"],
      a: 0,
      ex: "必要引当金 = 4,000 + 5,000 + 10,000 + 10,000 = 29,000。貸方残高6,000があるため費用 = 29,000 − 6,000 = 23,000。$35,000は残高を借方残高として加算した誤り。",
    },
    {
      q: "Under the allowance method, a company writes off a $5,000 customer account determined to be uncollectible. What is the effect of the write-off on net accounts receivable and on net income?",
      ja: "引当金法の下で、会社は回収不能と判断した顧客の売掛金$5,000を償却した。この償却が売掛金の純額および純利益に与える影響はどれか。",
      c: [
        "Net receivables decrease $5,000; net income decreases $5,000",
        "Net receivables decrease $5,000; no effect on net income",
        "No effect on net receivables; net income decreases $5,000",
        "No effect on net receivables or net income",
      ],
      a: 3,
      ex: "償却の仕訳は(借)貸倒引当金/(貸)売掛金であり、総額と引当金が同額減少するため純額は不変、費用も計上されない。費用は引当金設定時(信用損失費用)に認識済みである。",
    },
    {
      q: "A company's allowance for credit losses on receivables was $20,000 at the beginning of the year. During the year, $18,000 of accounts were written off and $3,000 of previously written-off accounts were recovered. Based on an expected loss analysis, the required ending allowance is $25,000. What is credit loss expense for the year?",
      ja: "売掛金の貸倒引当金は期首$20,000であった。当期中に$18,000を償却し、過去に償却した$3,000を回収した。予想損失分析による期末の必要引当金は$25,000である。当期の信用損失費用はいくらか。",
      c: ["$25,000", "$23,000", "$20,000", "$5,000"],
      a: 2,
      ex: "調整前残高 = 20,000 − 18,000 + 3,000 = 5,000。費用 = 25,000 − 5,000 = 20,000。償却債権の回収は引当金に戻し入れるため、回収を無視した$23,000は誤り。",
    },
    {
      q: "Under ASC 326 (CECL), which of the following best describes how an entity measures the allowance for credit losses on a pool of trade receivables?",
      ja: "ASC 326(CECL)の下で、売掛金のプールに係る貸倒引当金の測定方法として最も適切なものはどれか。",
      c: [
        "Losses are recognized only when it is probable that a loss has been incurred at the balance sheet date",
        "Expected credit losses over the contractual term are estimated on a collective basis for assets with similar risk characteristics, using historical experience, current conditions, and reasonable and supportable forecasts",
        "An allowance is required only for receivables that are more than 90 days past due",
        "Expected credit losses for the next 12 months only are recognized, unless credit risk has increased significantly",
      ],
      a: 1,
      ex: "CECLは契約期間全体の予想信用損失を、類似のリスク特性を持つ資産はプール(集合)単位で、過去の実績・現在の状況・合理的で裏付け可能な予測に基づき見積る。「発生の可能性が高い」基準は旧来の発生損失モデル、12か月予想はIFRS 9の考え方である。",
    },
    {
      q: "A company holds held-to-maturity debt securities with an amortized cost of $400,000. At the end of Year 1, it recorded an allowance for expected credit losses of $15,000. At the end of Year 2, improved issuer conditions reduce expected credit losses to $9,000. How should the change be reported in Year 2?",
      ja: "会社は償却原価$400,000のHTM負債証券を保有している。第1年度末に予想信用損失の引当金$15,000を計上した。第2年度末、発行体の状況改善により予想信用損失は$9,000に減少した。第2年度にこの変動をどのように報告すべきか。",
      c: [
        "A $6,000 reduction of credit loss expense (reversal) in net income",
        "No entry, because reversals of credit losses on HTM securities are prohibited",
        "A $6,000 gain in other comprehensive income",
        "A $9,000 credit loss expense in net income",
      ],
      a: 0,
      ex: "CECLでは引当金方式のため、予想信用損失の減少は引当金を減額し、純利益で戻し入れる(15,000 − 9,000 = 6,000)。旧OTTIモデルの「直接減額後は戻し入れ不可」と混同しないこと。",
    },
    {
      q: "An available-for-sale debt security has an amortized cost of $500,000 and a fair value of $470,000. The present value of expected cash flows is $455,000. The company does not intend to sell and it is not more likely than not that it will be required to sell before recovery. What credit loss should be recognized in net income?",
      ja: "AFS負債証券の償却原価は$500,000、公正価値は$470,000である。予想キャッシュ・フローの現在価値は$455,000である。会社に売却意図はなく、回復前に売却を要求される可能性も高くない。純利益に認識すべき信用損失はいくらか。",
      c: ["$45,000", "$30,000", "$15,000", "$0"],
      a: 1,
      ex: "信用損失は償却原価 − CF現在価値 = 45,000だが、AFSでは引当金は公正価値が償却原価を下回る額(30,000)を上限とする(フェア・バリュー・フロア)。よって30,000を引当金として純利益に計上する。",
    },
    {
      q: "An available-for-sale debt security has an amortized cost of $300,000, a fair value of $270,000, and a present value of expected cash flows of $290,000. The entity has no intent to sell. What amount of the decline should be reported in other comprehensive income?",
      ja: "AFS負債証券の償却原価は$300,000、公正価値は$270,000、予想キャッシュ・フローの現在価値は$290,000である。会社に売却意図はない。下落額のうちOCIに計上すべき金額はいくらか。",
      c: ["$30,000", "$10,000", "$20,000", "$0"],
      a: 2,
      ex: "信用損失 = 300,000 − 290,000 = 10,000(引当金、純利益)。残りの非信用要因の下落 30,000 − 10,000 = 20,000をOCIに計上する。$30,000は信用損失部分を区分していない。",
    },
    {
      q: "An available-for-sale debt security has an amortized cost of $120,000 and a fair value of $105,000. Management intends to sell the security before recovery of its amortized cost basis. How should the decline be accounted for?",
      ja: "AFS負債証券の償却原価は$120,000、公正価値は$105,000である。経営者は償却原価が回復する前に売却する意図がある。下落はどのように会計処理すべきか。",
      c: [
        "Record an allowance for credit losses of $15,000 that may be reversed later",
        "Report $15,000 in other comprehensive income until the sale",
        "Recognize only the credit-related portion in net income and the rest in OCI",
        "Write down the amortized cost basis to $105,000 and recognize a $15,000 loss in net income",
      ],
      a: 3,
      ex: "売却意図がある(または売却を要求される可能性が高い)場合、引当金ではなく償却原価を公正価値まで直接減額し、全額15,000を純利益に計上する。信用・非信用の区分は売却意図がない場合の処理である。",
    },
    {
      q: "A company previously wrote off an $8,000 receivable against the allowance for credit losses. In the current year, the customer unexpectedly pays $3,000 of the balance. Which entry records the reinstatement of the recovered amount?",
      ja: "会社は以前、売掛金$8,000を貸倒引当金と相殺して償却した。当期、顧客が予想外に$3,000を支払った。回収額を復活させる仕訳はどれか。",
      c: [
        "Debit accounts receivable $3,000; credit allowance for credit losses $3,000",
        "Debit cash $3,000; credit credit loss expense $3,000",
        "Debit accounts receivable $8,000; credit allowance for credit losses $8,000",
        "Debit cash $3,000; credit retained earnings $3,000",
      ],
      a: 0,
      ex: "回収額のみ売掛金を復活させ(借)売掛金3,000/(貸)貸倒引当金3,000、続いて(借)現金/(貸)売掛金とする。回収見込のない残額5,000まで復活させる必要はない。",
    },
    {
      q: "In Year 1, a company purchased 2,000 shares of a listed company's common stock (an insignificant interest) at $25 per share. At December 31, Year 1, the market price was $28 per share, and during Year 1 the company received dividends of $1 per share. What total amount should be included in Year 1 net income from this investment?",
      ja: "第1年度、会社は上場会社の普通株式2,000株(重要な影響力なし)を1株$25で購入した。第1年度末の時価は1株$28で、第1年度中に1株$1の配当を受け取った。この投資から第1年度の純利益に含めるべき金額の合計はいくらか。",
      c: ["$2,000", "$6,000", "$8,000", "$4,000"],
      a: 2,
      ex: "持分証券(公正価値が容易に算定可能)はFV-NIで測定。未実現利益 2,000 × 3 = 6,000 + 受取配当 2,000 = 8,000。持分証券はAFS区分がないため、6,000をOCIとする処理は認められない。",
    },
    {
      q: "In Year 1, a company purchased 500 shares of equity securities with a readily determinable fair value for $60 per share. The fair value was $52 per share at December 31, Year 1. In Year 2, the shares were sold for $57 per share. What should be reported in Year 2 net income on the sale?",
      ja: "第1年度、会社は公正価値が容易に算定可能な持分証券500株を1株$60で購入した。第1年度末の公正価値は1株$52であった。第2年度に1株$57で売却した。第2年度の純利益に計上すべき金額はどれか。",
      c: ["Loss of $1,500", "Gain of $2,500", "Gain of $4,000", "Zero"],
      a: 1,
      ex: "第1年度末に52へ評価替えし損失4,000を計上済み。第2年度は (57 − 52) × 500 = 2,500の利益。取得原価との比較による$1,500の損失は前期計上分を二重計上する誤り。",
    },
    {
      q: "A company holds an equity investment without a readily determinable fair value and has elected the measurement alternative. The carrying amount is $100,000. During the year, the issuer sold identical shares to another investor in an orderly transaction at a price implying a value of $115,000 for the company's holding. What should the company record?",
      ja: "会社は公正価値が容易に算定できない持分投資を保有し、測定の代替法を選択している。帳簿価額は$100,000である。当期中、発行体が同一の株式を秩序ある取引で他の投資者に売却し、その価格によれば会社の保有分は$115,000と評価される。会社は何を計上すべきか。",
      c: [
        "No entry, because the measurement alternative is a cost-based method",
        "A $15,000 unrealized gain in other comprehensive income",
        "A $15,000 gain in net income, increasing the carrying amount to $115,000",
        "Disclosure of the $115,000 value only",
      ],
      a: 2,
      ex: "測定の代替法は、取得原価 − 減損 ± 同一または類似の投資の秩序ある取引で観察可能な価格変動で測定し、変動は純利益に計上する。上方修正も認められ、OCIは用いない。",
    },
    {
      q: "A company measures an equity investment without a readily determinable fair value using the measurement alternative at $90,000. A qualitative assessment indicates impairment, and the investment's fair value is estimated at $70,000. What should be recognized?",
      ja: "会社は公正価値が容易に算定できない持分投資を測定の代替法により$90,000で計上している。定性的評価により減損の兆候があり、公正価値は$70,000と見積られる。何を認識すべきか。",
      c: [
        "An impairment loss of $20,000 in net income",
        "An impairment loss of $20,000 in other comprehensive income",
        "No loss unless the decline is other than temporary",
        "A credit loss allowance of $20,000",
      ],
      a: 0,
      ex: "測定の代替法では、定性的評価で減損が示唆された場合、公正価値まで減額し差額20,000を純利益に計上する(一時的か否かの判断は不要)。持分証券にCECLの引当金は適用されない。",
    },
    {
      q: "An investor acquires a 5% interest in a publicly traded company's common stock and has no significant influence. Under current U.S. GAAP, how must the investment be classified and measured?",
      ja: "投資者は上場会社の普通株式の5%を取得し、重要な影響力はない。現行の米国GAAPでは、この投資はどのように分類・測定しなければならないか。",
      c: [
        "Available-for-sale, at fair value with changes in OCI",
        "Held-to-maturity, at amortized cost",
        "At cost, with dividends recognized as income",
        "At fair value, with changes in fair value recognized in net income",
      ],
      a: 3,
      ex: "ASC 321により、公正価値が容易に算定可能な持分証券はFV-NIで測定する。AFS・HTMは負債証券のみの区分であり、原価法(測定の代替法)は公正価値が容易に算定できない場合に限られる。",
    },
    {
      q: "On January 1, an investor paid $600,000 for 30% of an investee's common stock and obtained significant influence. The investee's net assets had a book value of $1,500,000, and its equipment (10-year remaining life) was undervalued by $200,000; any remaining excess is goodwill. For the year, the investee reported net income of $250,000 and paid dividends of $100,000. What is the investment's carrying amount at December 31?",
      ja: "1月1日、投資者は被投資会社の普通株式30%を$600,000で取得し、重要な影響力を得た。被投資会社の純資産簿価は$1,500,000で、設備(残存耐用年数10年)が$200,000過小評価されていた。残りの超過額はのれんである。当期、被投資会社は純利益$250,000を計上し、配当$100,000を支払った。12月31日の投資の帳簿価額はいくらか。",
      c: ["$645,000", "$639,000", "$669,000", "$630,000"],
      a: 1,
      ex: "持分利益 75,000 − 設備超過額の償却(200,000 × 30% ÷ 10 = 6,000)− 配当 30,000。600,000 + 75,000 − 6,000 − 30,000 = 639,000。のれん部分(90,000)は償却しない。$645,000は設備の償却漏れ。",
    },
    {
      q: "An investor owns 40% of an investee and applies the equity method. At the beginning of Year 1, the investment's carrying amount was $50,000. The investee reported a net loss of $200,000 in Year 1 and net income of $100,000 in Year 2. The investor has not guaranteed the investee's obligations or committed to provide further support. What is the investment's carrying amount at the end of Year 2?",
      ja: "投資者は被投資会社の40%を保有し持分法を適用している。第1年度期首の投資帳簿価額は$50,000であった。被投資会社は第1年度に純損失$200,000、第2年度に純利益$100,000を計上した。投資者は債務保証や追加支援の約束をしていない。第2年度末の投資帳簿価額はいくらか。",
      c: ["$40,000", "$0", "$10,000", "$20,000"],
      a: 2,
      ex: "第1年度の持分損失80,000のうち50,000のみ認識し投資はゼロ、未認識損失30,000。第2年度の持分利益40,000は未認識損失30,000を相殺した後の10,000のみ認識する。$40,000は未認識損失の相殺を無視している。",
    },
    {
      q: "An investor owns 25% of an investee's common stock and has significant influence. The investee reported net income of $400,000 and paid cash dividends of $160,000 during the year. What amount of investment income should the investor report?",
      ja: "投資者は被投資会社の普通株式25%を保有し重要な影響力を有する。被投資会社は当期に純利益$400,000を計上し、現金配当$160,000を支払った。投資者が計上すべき投資利益はいくらか。",
      c: ["$40,000", "$60,000", "$140,000", "$100,000"],
      a: 3,
      ex: "持分法では投資利益 = 400,000 × 25% = 100,000。受取配当40,000は投資勘定の減少(投資の回収)であり収益ではない。$60,000は利益から配当を差し引いた誤り。",
    },
    {
      q: "An investor owns 30% of an investee and uses the equity method. During the year, the investor sold inventory costing $80,000 to the investee for $120,000. At year-end, half of this inventory remained unsold by the investee. The investee reported net income of $300,000. What equity method income should the investor recognize?",
      ja: "投資者は被投資会社の30%を保有し持分法を適用している。当期、投資者は原価$80,000の棚卸資産を被投資会社に$120,000で販売した。期末に被投資会社はその半分を在庫として保有している。被投資会社の純利益は$300,000である。投資者が認識すべき持分法投資利益はいくらか。",
      c: ["$84,000", "$90,000", "$78,000", "$70,000"],
      a: 0,
      ex: "未実現利益 = 40,000 × 50% × 30% = 6,000を消去。90,000 − 6,000 = 84,000。持分法ではダウンストリームでも投資者の持分割合のみ消去するため、20,000全額を消去した$70,000は誤り。",
    },
    {
      q: "An investor owns 40% of an investee. During the year, the investee sold merchandise to the investor at a gross profit of $25,000; 60% of the merchandise remained in the investor's inventory at year-end. The investee's net income was $200,000. What equity method income should the investor report?",
      ja: "投資者は被投資会社の40%を保有している。当期、被投資会社は投資者に粗利益$25,000で商品を販売し、期末にその60%が投資者の在庫に残っている。被投資会社の純利益は$200,000である。投資者が計上すべき持分法投資利益はいくらか。",
      c: ["$80,000", "$65,000", "$74,000", "$70,000"],
      a: 2,
      ex: "アップストリームの未実現利益 = 25,000 × 60% × 40% = 6,000。80,000 − 6,000 = 74,000。$70,000は粗利益全額の40%(10,000)を消去しており、販売済み部分まで消去している。",
    },
    {
      q: "An investor held a 10% interest in an investee, measured at fair value through net income with a carrying amount (equal to fair value) of $150,000. On July 1, it purchased an additional 20% for $330,000 and obtained significant influence. Under current U.S. GAAP, what is the initial carrying amount of the equity method investment?",
      ja: "投資者は被投資会社の10%を保有し、FV-NIで測定していた(帳簿価額=公正価値$150,000)。7月1日、追加で20%を$330,000で取得し重要な影響力を得た。現行の米国GAAPにおける持分法投資の当初帳簿価額はいくらか。",
      c: ["$330,000", "$450,000", "$480,000", "$495,000"],
      a: 2,
      ex: "ASU 2016-07により、既存投資の帳簿価額に追加取得原価を加算し(150,000 + 330,000 = 480,000)、持分法を将来に向かって適用する。過去に遡って持分法を適用する(遡及修正)必要はない。",
    },
    {
      q: "An investor that had applied the equity method sells part of its holding and loses significant influence. How should the investor account for the remaining investment at the date significant influence is lost?",
      ja: "持分法を適用していた投資者が保有株式の一部を売却し、重要な影響力を失った。重要な影響力を失った日に、残りの投資をどのように会計処理すべきか。",
      c: [
        "Retroactively restate prior periods as if the cost method had always been applied",
        "Reverse the previously recognized equity method earnings through retained earnings",
        "Discontinue the equity method prospectively; previously recognized equity method earnings remain in the carrying amount and are not restated",
        "Continue to apply the equity method until the investment is fully sold",
      ],
      a: 2,
      ex: "重要な影響力を失った場合、持分法の適用を将来に向かって中止し、過去に認識した持分損益は修正しない。その後はASC 321に従い測定する(公正価値が容易に算定可能なら公正価値)。",
    },
    {
      q: "An investor owns 40% of an investee and applies the equity method. The investment's carrying amount is $400,000. The investor sells one-fourth of its holding (a 10% interest in the investee) for $120,000 and retains significant influence. What gain should be recognized on the sale?",
      ja: "投資者は被投資会社の40%を保有し持分法を適用している。投資の帳簿価額は$400,000である。保有分の4分の1(被投資会社の10%)を$120,000で売却し、重要な影響力は維持している。売却益はいくらか。",
      c: ["$0", "$20,000", "$80,000", "$120,000"],
      a: 1,
      ex: "売却分の帳簿価額 = 400,000 × 1/4 = 100,000。売却益 = 120,000 − 100,000 = 20,000。残りの30%は引き続き持分法で処理する(帳簿価額300,000)。",
    },
    {
      q: "An investor owns 25% of an investee's voting common stock. Which of the following, by itself, would most likely indicate that the investor does NOT have significant influence and should not apply the equity method?",
      ja: "投資者は被投資会社の議決権付普通株式の25%を保有している。それ単独で、投資者が重要な影響力を有さず持分法を適用すべきでないことを最も強く示すものはどれか。",
      c: [
        "The investor has one representative on the investee's ten-member board",
        "There are material intra-entity transactions between the investor and the investee",
        "The investee has filed a lawsuit and complaints with regulators challenging the investor's ability to exercise influence, and the investor cannot obtain the financial information needed to apply the equity method",
        "The investor and investee exchange managerial personnel",
      ],
      a: 2,
      ex: "20%以上の保有は重要な影響力があると推定されるが、被投資会社による訴訟・規制当局への異議申立てや、持分法適用に必要な財務情報が入手できないことは反証となる。取締役の派遣・重要な内部取引・人事交流は影響力の存在を示す指標である。",
    },
    {
      q: "A company issued 10,000 shares of $5 par value common stock for $18 per share and paid $6,000 of direct stock issuance costs. By what amount should additional paid-in capital increase?",
      ja: "会社は額面$5の普通株式10,000株を1株$18で発行し、株式発行の直接費用$6,000を支払った。払込剰余金(APIC)の増加額はいくらか。",
      c: ["$130,000", "$124,000", "$174,000", "$180,000"],
      a: 1,
      ex: "APIC = (18 − 5) × 10,000 − 6,000 = 124,000。株式発行費用は費用処理せず払込資本から控除する。$130,000は発行費用を控除していない。",
    },
    {
      q: "A corporation issued 5,000 shares of no-par common stock that has no stated value for $15 per share. How should the proceeds be recorded?",
      ja: "会社は表示価額(stated value)のない無額面普通株式5,000株を1株$15で発行した。払込金額はどのように記録すべきか。",
      c: [
        "Common stock $75,000",
        "Common stock $5,000 and additional paid-in capital $70,000",
        "Common stock $10,000 and additional paid-in capital $65,000",
        "Additional paid-in capital $75,000",
      ],
      a: 0,
      ex: "表示価額のない無額面株式は、払込金額の全額75,000を資本金(普通株式)に計上する。表示価額(例:$2)がある場合は表示価額部分を資本金、超過分をAPICとする。",
    },
    {
      q: "A company received subscriptions for 2,000 shares of $10 par common stock at $25 per share and collected 40% of the subscription price in cash. The subscriptions receivable is reported as a contra-equity account. By what amount did total stockholders' equity increase as a result of the subscription?",
      ja: "会社は額面$10の普通株式2,000株について1株$25で申込を受け、申込価額の40%を現金で受け取った。株式申込未収金は資本の控除項目として表示する。申込により株主資本合計はいくら増加したか。",
      c: ["$50,000", "$30,000", "$20,000", "$0"],
      a: 2,
      ex: "(借)現金20,000・申込未収金30,000/(貸)申込済普通株式20,000・APIC 30,000。申込未収金30,000は資本から控除されるため、株主資本の純増は現金受領額20,000となる。",
    },
    {
      q: "Using the cost method, a company reacquired 1,000 shares of its own common stock at $40 per share. It later reissued 400 shares at $45 per share and then 300 shares at $32 per share. There was no previous paid-in capital from treasury stock. By what amount is retained earnings reduced by these transactions?",
      ja: "原価法により、会社は自己株式1,000株を1株$40で取得した。その後400株を1株$45で、さらに300株を1株$32で再発行した。それ以前の自己株式処分差益はない。これらの取引により利益剰余金はいくら減少するか。",
      c: ["$0", "$2,400", "$2,000", "$400"],
      a: 3,
      ex: "最初の再発行でAPIC(自己株式)2,000が生じる。2回目の差損 (40 − 32) × 300 = 2,400は、まずAPIC(自己株式)2,000を取り崩し、不足分400を利益剰余金から減額する。",
    },
    {
      q: "A company's $10 par common stock was originally issued at $16 per share. The company reacquired 2,000 of these shares at $22 per share (cost method) and later formally retired them. There is no paid-in capital from treasury stock. What amount should be debited to retained earnings upon retirement?",
      ja: "会社の額面$10の普通株式は当初1株$16で発行された。会社はこのうち2,000株を1株$22で取得し(原価法)、その後正式に消却した。自己株式処分差益はない。消却時に利益剰余金に借記すべき金額はいくらか。",
      c: ["$12,000", "$24,000", "$0", "$32,000"],
      a: 0,
      ex: "消却時:(借)普通株式20,000・APIC 12,000(当初発行時の超過額6 × 2,000)・利益剰余金12,000/(貸)自己株式44,000。$24,000はAPICの取り崩しをせず額面との差額全額を利益剰余金にした誤り。",
    },
    {
      q: "A company declared a scrip dividend of $50,000 in the form of a six-month promissory note bearing 10% annual interest. The note was paid at maturity. By what total amount was retained earnings directly debited for the dividend (excluding the effect of interest on net income)?",
      ja: "会社は$50,000のスクリップ配当(年利10%、期間6か月の約束手形)を宣言し、満期に支払った。配当として利益剰余金に直接借記された金額(利息が純利益に与える影響を除く)はいくらか。",
      c: ["$52,500", "$55,000", "$50,000", "$47,500"],
      a: 2,
      ex: "宣言時に(借)利益剰余金50,000/(貸)未払手形配当50,000。利息2,500(50,000 × 10% × 6/12)は支払利息として費用処理し、配当には含めない。",
    },
    {
      q: "A mining company declared and paid a cash dividend of $300,000 when its retained earnings balance was $220,000. The excess is a return of capital. What amount should be debited to additional paid-in capital?",
      ja: "鉱業会社は利益剰余金残高が$220,000のときに$300,000の現金配当を宣言・支払った。超過分は資本の払戻しである。払込剰余金に借記すべき金額はいくらか。",
      c: ["$0", "$80,000", "$220,000", "$300,000"],
      a: 1,
      ex: "利益剰余金を超える部分 300,000 − 220,000 = 80,000は清算配当(資本の払戻し)であり、APICを減額する。株主にとっても投資の回収として扱われる。",
    },
    {
      q: "A company with 100,000 shares of $1 par common stock outstanding declared and distributed a 10% stock dividend when the market price was $15 per share. By what amount should additional paid-in capital increase?",
      ja: "額面$1の普通株式100,000株が発行済の会社は、時価が1株$15のときに10%の株式配当を宣言・交付した。払込剰余金の増加額はいくらか。",
      c: ["$150,000", "$10,000", "$0", "$140,000"],
      a: 3,
      ex: "小規模株式配当(20-25%未満)は時価で振り替える。利益剰余金 10,000株 × 15 = 150,000を減額し、資本金10,000、APIC 140,000を計上する。$150,000は利益剰余金の減少額である。",
    },
    {
      q: "A company with 50,000 shares of $2 par common stock outstanding declared a 40% stock dividend when the market price was $20 per share. The company records the dividend at the minimum amount required by law. By what amount should retained earnings decrease?",
      ja: "額面$2の普通株式50,000株が発行済の会社は、時価が1株$20のときに40%の株式配当を宣言した。会社は法定最低額で記録する。利益剰余金の減少額はいくらか。",
      c: ["$40,000", "$400,000", "$0", "$360,000"],
      a: 0,
      ex: "大規模株式配当(20-25%超)は額面(法定資本)で振り替える。20,000株 × $2 = 40,000。時価による$400,000は小規模株式配当の処理である。",
    },
    {
      q: "On December 20, a company declared a 5% stock dividend to be distributed on January 15. How should the common stock dividend distributable be reported on the December 31 balance sheet?",
      ja: "12月20日、会社は1月15日に交付する5%の株式配当を宣言した。12月31日の貸借対照表で未交付株式配当(common stock dividend distributable)はどのように表示すべきか。",
      c: [
        "As a current liability",
        "As a reduction of retained earnings in a contra-equity account",
        "In stockholders' equity as part of paid-in capital",
        "Only in the notes to the financial statements",
      ],
      a: 2,
      ex: "株式配当は資産の流出を伴わないため負債ではなく、未交付株式配当は株主資本の払込資本区分に表示する。現金配当の未払配当金は流動負債となる点と区別する。",
    },
    {
      q: "A company has 10,000 shares of $100 par, 6% cumulative, nonparticipating preferred stock and 200,000 shares of common stock outstanding. No dividends were declared in Year 1 or Year 2. In Year 3, the company declared total dividends of $200,000. What amount of the Year 3 dividends should be allocated to common shareholders?",
      ja: "会社は額面$100、6%累積的・非参加型優先株式10,000株と普通株式200,000株を発行している。第1年度・第2年度は配当を宣言しなかった。第3年度に配当総額$200,000を宣言した。第3年度の配当のうち普通株主への配分額はいくらか。",
      c: ["$140,000", "$80,000", "$20,000", "$200,000"],
      a: 2,
      ex: "優先配当は年60,000 × 3年分(延滞2年+当期)= 180,000。普通株主 = 200,000 − 180,000 = 20,000。$140,000は延滞配当を無視している。",
    },
    {
      q: "A company has $500,000 par value of 5% noncumulative, fully participating preferred stock and $1,000,000 par value of common stock outstanding. It declared total dividends of $120,000. What amount should be allocated to the preferred shareholders?",
      ja: "会社は額面総額$500,000の5%非累積的・完全参加型優先株式と額面総額$1,000,000の普通株式を発行している。配当総額$120,000を宣言した。優先株主への配分額はいくらか。",
      c: ["$25,000", "$40,000", "$60,000", "$45,000"],
      a: 1,
      ex: "優先25,000、普通にも同率5%で50,000を配分。残額45,000を額面比(1:2)で参加配分し優先に15,000。優先合計 = 25,000 + 15,000 = 40,000。$25,000は参加権を無視している。",
    },
    {
      q: "The board of directors appropriated $500,000 of retained earnings for future plant expansion. What is the effect of the appropriation on total retained earnings and total stockholders' equity?",
      ja: "取締役会は将来の工場拡張のため利益剰余金$500,000を積立(appropriation)とした。この積立が利益剰余金合計および株主資本合計に与える影響はどれか。",
      c: [
        "Both decrease by $500,000",
        "Retained earnings decreases; total stockholders' equity is unchanged",
        "Retained earnings is unchanged; total stockholders' equity decreases",
        "Neither total retained earnings nor total stockholders' equity changes",
      ],
      a: 3,
      ex: "積立は利益剰余金の内部での振替(未処分→積立)にすぎず、合計額も株主資本も変わらない。工場拡張の支出を積立金に直接負担させることはできず、積立は不要になれば戻し入れる。",
    },
    {
      q: "At the beginning of the year, total stockholders' equity was $900,000. During the year, net income was $150,000; cash dividends of $40,000 were declared and paid; a 10% stock dividend valued at $60,000 was distributed; treasury stock was purchased for $25,000; and treasury stock with a cost of $10,000 was reissued for $12,000. What is total stockholders' equity at year-end?",
      ja: "期首の株主資本合計は$900,000であった。当期の純利益$150,000、現金配当$40,000を宣言・支払、評価額$60,000の10%株式配当を交付、自己株式を$25,000で取得、原価$10,000の自己株式を$12,000で再発行した。期末の株主資本合計はいくらか。",
      c: ["$937,000", "$985,000", "$1,022,000", "$997,000"],
      a: 3,
      ex: "900,000 + 150,000 − 40,000 − 25,000 + 12,000 = 997,000。株式配当は株主資本内の振替で合計に影響しない($937,000は誤って控除)。自己株式の再発行は受取額12,000だけ資本を増やす。",
    },
    {
      q: "A company had 80,000 common shares outstanding on January 1. It issued 24,000 shares on March 1, purchased 9,000 shares of treasury stock on July 1, and distributed a 10% stock dividend on November 1. What is the weighted-average number of common shares for basic EPS?",
      ja: "会社の普通株式は1月1日に80,000株であった。3月1日に24,000株を発行し、7月1日に自己株式9,000株を取得し、11月1日に10%の株式配当を交付した。基本的EPSの加重平均株式数はいくらか。",
      c: ["95,500", "97,083", "105,050", "114,400"],
      a: 2,
      ex: "株式配当前:80,000 + 24,000 × 10/12 − 9,000 × 6/12 = 95,500。株式配当は期首に遡って調整するため × 1.1 = 105,050。株式配当を11月1日から加重した$97,083は誤り。",
    },
    {
      q: "On April 1, a company granted 20,000 stock options with an exercise price of $30. The average market price of the common stock from April 1 through December 31 was $40, and the year-end market price was $45. Using the treasury stock method, how many incremental shares should be included in the weighted-average shares for diluted EPS for the year?",
      ja: "4月1日、会社は行使価格$30のストック・オプション20,000個を付与した。4月1日から12月31日までの平均株価は$40、期末株価は$45であった。自己株式法により、当期の希薄化後EPSの加重平均株式数に含める増加株式数はいくらか。",
      c: ["5,000", "3,750", "6,667", "15,000"],
      a: 1,
      ex: "増加株式数 = 20,000 − 20,000 × 30 ÷ 40 = 5,000。期中付与のため9/12を乗じて3,750。希薄化後EPSでは平均株価を用い、期末株価による$6,667は誤り。",
    },
    {
      q: "A company reported net income of $400,000 and had 200,000 weighted-average common shares outstanding. It also had $1,000,000 of 5% convertible bonds, issued at par, outstanding all year and convertible into 40,000 common shares. The tax rate is 25%. What is diluted EPS?",
      ja: "会社の純利益は$400,000、加重平均普通株式数は200,000株である。期中を通じて、額面発行した利率5%の転換社債$1,000,000(普通株式40,000株に転換可能)が残存している。税率は25%である。希薄化後EPSはいくらか。",
      c: ["$1.88", "$2.00", "$1.67", "$1.82"],
      a: 3,
      ex: "転換仮定法:分子 = 400,000 + 50,000 × (1 − 25%) = 437,500、分母 = 240,000。437,500 ÷ 240,000 = 1.82。税効果を考慮せず利息50,000を全額加算した$1.88は誤り。",
    },
    {
      q: "A company's net income is $250,000, and preferred dividends of $60,000 were declared on convertible preferred stock that is convertible into 20,000 common shares. Weighted-average common shares outstanding are 100,000. There are no other potential common shares. What is diluted EPS?",
      ja: "会社の純利益は$250,000で、普通株式20,000株に転換可能な転換優先株式に対し優先配当$60,000が宣言された。加重平均普通株式数は100,000株で、他に潜在株式はない。希薄化後EPSはいくらか。",
      c: ["$1.90", "$2.08", "$2.50", "$1.58"],
      a: 0,
      ex: "基本的EPS = (250,000 − 60,000) ÷ 100,000 = 1.90。転換仮定では 250,000 ÷ 120,000 = 2.08 > 1.90となり逆希薄化のため除外し、希薄化後EPSは1.90。",
    },
    {
      q: "A company has income from continuing operations available to common shareholders of $1,000,000 and 500,000 weighted-average common shares. Potential common shares: options producing 20,000 incremental shares; convertible preferred stock adding $60,000 to the numerator and 40,000 shares; and convertible bonds adding $120,000 (after tax) to the numerator and 50,000 shares. What is diluted EPS?",
      ja: "普通株主に帰属する継続事業利益は$1,000,000、加重平均普通株式数は500,000株である。潜在株式は、増加株式数20,000株のオプション、分子に$60,000・分母に40,000株を加える転換優先株式、分子に税引後$120,000・分母に50,000株を加える転換社債である。希薄化後EPSはいくらか。",
      c: ["$1.92", "$1.93", "$1.89", "$1.96"],
      a: 2,
      ex: "希薄化効果の大きい順に加える。オプション(0):1,000,000 ÷ 520,000 = 1.923。優先株(1株当たり1.50):1,060,000 ÷ 560,000 = 1.893。社債(2.40)は1.893を上回り逆希薄化のため除外。全部含めた$1.93は誤り。",
    },
    {
      q: "A company agreed to issue 10,000 additional common shares to the former owners of an acquired business if the acquired business's net income exceeds $1,000,000 in each of the next two years. At the end of the first year, net income was $1,200,000. How should the 10,000 contingent shares be treated in the first year's EPS?",
      ja: "会社は、取得した事業の純利益が今後2年間それぞれ$1,000,000を超えた場合、旧所有者に普通株式10,000株を追加発行することに合意した。1年目末の純利益は$1,200,000であった。1年目のEPSで条件付発行株式10,000株をどのように扱うべきか。",
      c: [
        "Included in both basic and diluted EPS",
        "Excluded from basic EPS but included in diluted EPS",
        "Excluded from both basic and diluted EPS",
        "Included in basic EPS but excluded from diluted EPS",
      ],
      a: 1,
      ex: "基本的EPSには全ての条件が満たされた時点から含めるため除外する。希薄化後EPSでは期末が条件期間の末日であると仮定して条件を満たしていれば含める(期末の利益が基準を超えている)。",
    },
    {
      q: "A company's net income is $600,000. It has 100,000 common shares and 20,000 shares of participating preferred stock that share in dividends with common stock on a one-for-one basis. During the year, dividends of $2 per share were declared on both classes. Using the two-class method, what is basic EPS for common stock?",
      ja: "会社の純利益は$600,000である。普通株式100,000株と、普通株式と1対1で配当に参加する参加型優先株式20,000株がある。当期、両種類に1株$2の配当を宣言した。二区分法による普通株式の基本的EPSはいくらか。",
      c: ["$6.00", "$5.60", "$4.00", "$5.00"],
      a: 3,
      ex: "未分配利益 = 600,000 − 240,000 = 360,000を株式数比(100:20)で配分し普通株に300,000。普通株EPS = (200,000 + 300,000) ÷ 100,000 = 5.00。$5.60は参加型優先株への未分配利益の配分を無視している。",
    },
    {
      q: "A company reported net income of $300,000 and had 75,000 weighted-average common shares for the year ended December 31. On February 10 of the following year, before the financial statements were issued, it effected a 2-for-1 stock split. There is no preferred stock. What basic EPS should be reported for the year ended December 31?",
      ja: "12月31日に終了する年度の純利益は$300,000、加重平均普通株式数は75,000株であった。翌年2月10日、財務諸表の発行前に1対2の株式分割を実施した。優先株式はない。12月31日終了年度に報告すべき基本的EPSはいくらか。",
      c: ["$2.00", "$4.00", "$3.00", "$1.00"],
      a: 0,
      ex: "期末後・財務諸表発行前の株式分割や株式配当は、表示される全期間のEPSに遡及して反映する。300,000 ÷ 150,000 = 2.00。分割を無視した$4.00は誤り。",
    },
    {
      q: "On January 1, Year 1, a company granted 30,000 stock options with a grant-date fair value of $9 per option that cliff vest at the end of Year 3. The company elected to estimate forfeitures, and initially expected 10% of the options to be forfeited. At the end of Year 2, it revised the expected forfeiture rate to 5%. What compensation expense should be recognized in Year 2?",
      ja: "第1年度1月1日、会社は付与日公正価値1個$9のストック・オプション30,000個を付与した。第3年度末に一括権利確定(クリフ・ベスティング)する。会社は失効を見積る方針を選択し、当初は10%の失効を見込んでいた。第2年度末に見込失効率を5%に修正した。第2年度に認識すべき報酬費用はいくらか。",
      c: ["$85,500", "$81,000", "$90,000", "$171,000"],
      a: 2,
      ex: "第1年度 = 30,000 × 9 × 90% ÷ 3 = 81,000。第2年度末の累計 = 30,000 × 9 × 95% × 2/3 = 171,000。第2年度 = 171,000 − 81,000 = 90,000。見積の変更は累積キャッチアップで当期に反映する。",
    },
    {
      q: "A company granted 10,000 equity-classified stock options that cliff vest after four years of service. The grant-date fair value was $8 per option. At the end of Year 1, the fair value of each option had increased to $11. The company accounts for forfeitures as they occur, and none occurred. What compensation expense should be recognized in Year 1?",
      ja: "会社は4年間の勤務後に一括確定する資本分類のストック・オプション10,000個を付与した。付与日公正価値は1個$8で、第1年度末には$11に上昇した。会社は失効を発生時に処理する方針で、失効はなかった。第1年度の報酬費用はいくらか。",
      c: ["$27,500", "$20,000", "$80,000", "$7,500"],
      a: 1,
      ex: "資本分類の報酬は付与日公正価値で測定し、その後再測定しない。10,000 × 8 ÷ 4 = 20,000。期末公正価値を用いた$27,500は負債分類(SARの現金決済等)の処理である。",
    },
    {
      q: "On January 1, Year 1, a company granted 12,000 stock options with a grant-date fair value of $10 each. One-third of the options vest at the end of each of Years 1, 2, and 3 (graded vesting with service conditions only). The company elected the straight-line attribution policy. What compensation cost should be recognized in Year 1?",
      ja: "第1年度1月1日、会社は付与日公正価値1個$10のストック・オプション12,000個を付与した。第1・第2・第3年度末にそれぞれ3分の1が確定する(勤務条件のみの段階的確定)。会社は定額法による配分方針を選択した。第1年度に認識すべき報酬費用はいくらか。",
      c: ["$40,000", "$73,333", "$120,000", "$20,000"],
      a: 0,
      ex: "勤務条件のみの段階的確定では、全体を定額法で配分できる:120,000 ÷ 3 = 40,000(累計費用は確定済み部分40,000以上という要件も満たす)。$73,333は各トランシェを別個に配分する加速法の結果である。",
    },
    {
      q: "On January 1, Year 1, a company granted 10,000 cash-settled stock appreciation rights (SARs) that vest after two years of service. The fair value of each SAR was $6 at December 31, Year 1, and $9 at December 31, Year 2. What compensation expense should be recognized in Year 2?",
      ja: "第1年度1月1日、会社は2年間の勤務で確定する現金決済型の株式増価受益権(SAR)10,000個を付与した。各SARの公正価値は第1年度末$6、第2年度末$9であった。第2年度に認識すべき報酬費用はいくらか。",
      c: ["$45,000", "$90,000", "$30,000", "$60,000"],
      a: 3,
      ex: "現金決済型SARは負債分類で、毎期末公正価値で再測定する。第2年度末の累計 = 10,000 × 9 × 2/2 = 90,000、第1年度計上額 = 10,000 × 6 × 1/2 = 30,000。第2年度 = 60,000。",
    },
    {
      q: "On December 1, Year 1, a U.S. company purchased inventory from a German supplier for €100,000, payable on January 30, Year 2. Exchange rates ($ per €) were: December 1, $1.10; December 31, $1.13; January 30, $1.08. What should the company report in Year 2 related to this payable?",
      ja: "第1年度12月1日、米国企業はドイツの仕入先から€100,000の棚卸資産を購入し、第2年度1月30日に支払う。為替レート($/€)は12月1日$1.10、12月31日$1.13、1月30日$1.08であった。この買掛金に関して第2年度に報告すべきものはどれか。",
      c: ["Transaction gain of $2,000", "Transaction loss of $3,000", "Transaction gain of $5,000", "No gain or loss; the difference adjusts inventory"],
      a: 2,
      ex: "第1年度末に113,000へ換算替え(損失3,000)済み。第2年度の決済額108,000との差 = 5,000の為替差益。取引日レートとの比較による$2,000は前期計上分を考慮していない。為替差損益は棚卸資産の原価を修正しない。",
    },
    {
      q: "On November 15, Year 1, a U.S. company sold goods to a Japanese customer for ¥50,000,000, to be collected in February, Year 2. The exchange rate was $0.0090 per yen on November 15 and $0.0086 per yen on December 31, Year 1. How should the effect of the rate change be reported in the Year 1 financial statements?",
      ja: "第1年度11月15日、米国企業は日本の顧客に¥50,000,000で商品を販売し、第2年度2月に回収予定である。為替レートは11月15日$0.0090/円、第1年度12月31日$0.0086/円であった。レート変動の影響は第1年度の財務諸表でどのように報告すべきか。",
      c: [
        "A $20,000 transaction loss in other comprehensive income",
        "A $20,000 transaction loss in net income",
        "A $20,000 reduction of sales revenue",
        "No recognition until the receivable is collected",
      ],
      a: 1,
      ex: "外貨建債権は期末レートで再測定し、50,000,000 × (0.0090 − 0.0086) = 20,000の為替差損を純利益(継続事業)に計上する。OCIに計上するのは在外営業活動体の換算差額であり、売上は取引日レートで確定済み。",
    },
  ],
});

CPA.tbs({
  id: "TBS-FAR-28",
  section: "FAR",
  chapter: "FAR-05",
  title: "負債証券投資(HTM・AFS)の償却と評価",
  scenario: `<p>On January 1, Year 1, Mori Corp. purchased $200,000 face value, 6% bonds of another company maturing on December 31, Year 4. Interest is paid annually on December 31. Mori paid <b>$186,752</b>, a price that yields <b>8%</b>. Mori uses the effective interest method.</p>
<p>Assume first that the bonds are classified as <b>held-to-maturity</b>. Then, alternatively, assume they are classified as <b>available-for-sale</b>; their fair value at December 31, Year 1, is <b>$193,000</b>, and there is no credit loss. Under the AFS alternative, Mori sells the bonds on January 1, Year 2, for <b>$194,000</b>.</p>
<p class="ja">第1年度1月1日、Mori社は他社が発行した額面$200,000、利率6%、第4年度12月31日満期の社債を購入した。利息は毎年12月31日に支払われる。Mori社は利回り8%となる$186,752を支払い、実効金利法を用いる。まず満期保有目的(HTM)に分類したと仮定する。別案として売却可能(AFS)に分類したと仮定し、第1年度末の公正価値は$193,000、信用損失はないものとする。AFSの場合、第2年度1月1日に$194,000で売却する。</p>`,
  rows: [
    { label: "Year 1 interest revenue(第1年度の受取利息)", type: "num", answer: 14940, tol: 1 },
    { label: "HTM carrying amount at December 31, Year 1(第1年度末のHTM帳簿価額)", type: "num", answer: 189692, tol: 1 },
    { label: "HTM interest revenue for Year 2(第2年度のHTM受取利息)", type: "num", answer: 15175, tol: 1 },
    { label: "AFS: unrealized holding gain for Year 1(AFS:第1年度の未実現保有利益)", type: "num", answer: 3308, tol: 2 },
    { label: "AFS: where the Year 1 unrealized gain is reported(AFS:第1年度の未実現利益の表示区分)", type: "select", options: ["Net income", "Other comprehensive income", "Retained earnings directly", "Not recognized"], answer: "Other comprehensive income" },
    { label: "AFS: gain recognized in net income on the January 1, Year 2 sale(AFS:第2年度1月1日の売却で純利益に認識する利益)", type: "num", answer: 4308, tol: 2 },
  ],
  explain: `<p>第1年度の受取利息 = 186,752 × 8% = 14,940。現金利息 12,000 との差 2,940 がディスカウント償却となり、期末帳簿価額 = 186,752 + 2,940 = 189,692。</p>
<p>第2年度の受取利息 = 189,692 × 8% = 15,175。</p>
<p>AFSの場合、償却原価 189,692 と公正価値 193,000 の差 3,308 を未実現保有利益としてOCIに計上する(利息は同じく実効金利法で純利益)。</p>
<p>売却益 = 194,000 − 償却原価 189,692 = 4,308。AOCIの3,308は組替調整で純利益へ振り替えられる。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-29",
  section: "FAR",
  chapter: "FAR-05",
  title: "株主資本の変動(新株発行・自己株式・株式配当)",
  scenario: `<p>At January 1, Year 1, Sato Inc. had the following stockholders' equity: common stock, $10 par, 100,000 shares issued and outstanding, <b>$1,000,000</b>; additional paid-in capital, <b>$1,500,000</b>; retained earnings, <b>$2,000,000</b>. Year 1 transactions:</p>
<table><tr><th>Date</th><th>Transaction</th></tr>
<tr><td>Feb 1</td><td>Issued 10,000 shares at $32 per share; direct issuance costs were $8,000</td></tr>
<tr><td>Apr 1</td><td>Purchased 5,000 shares of treasury stock at $35 per share (cost method)</td></tr>
<tr><td>Jul 1</td><td>Reissued 2,000 treasury shares at $40 per share</td></tr>
<tr><td>Sep 1</td><td>Declared and distributed a 10% stock dividend on outstanding shares; market price $38 per share</td></tr>
<tr><td>Dec 15</td><td>Declared and paid a cash dividend of $1 per outstanding share</td></tr>
<tr><td>Dec 31</td><td>Net income for the year was $600,000</td></tr></table>
<p class="ja">第1年度1月1日、Sato社の株主資本は、普通株式(額面$10、発行済・流通100,000株)$1,000,000、払込剰余金$1,500,000、利益剰余金$2,000,000であった。第1年度の取引:2月1日に10,000株を1株$32で発行(直接発行費用$8,000)、4月1日に自己株式5,000株を1株$35で取得(原価法)、7月1日に自己株式2,000株を1株$40で再発行、9月1日に流通株式に対し10%の株式配当を宣言・交付(時価1株$38)、12月15日に流通株式1株当たり$1の現金配当を宣言・支払、当期純利益$600,000。払込剰余金には自己株式処分差益を含めること。</p>`,
  rows: [
    { label: "Common stock at December 31, Year 1(期末の普通株式)", type: "num", answer: 1207000 },
    { label: "Additional paid-in capital (including treasury stock) at December 31(期末の払込剰余金・自己株式処分差益含む)", type: "num", answer: 2021600 },
    { label: "Treasury stock at December 31(期末の自己株式)", type: "num", answer: 105000 },
    { label: "Retained earnings at December 31(期末の利益剰余金)", type: "num", answer: 2075700 },
    { label: "Total stockholders' equity at December 31(期末の株主資本合計)", type: "num", answer: 5199300 },
  ],
  explain: `<p>2/1:普通株式 +100,000、APIC +(320,000 − 100,000 − 8,000)= +212,000。</p>
<p>4/1:自己株式 175,000。7/1:再発行 2,000 × (40 − 35) = APIC(自己株式)+10,000、自己株式残 3,000株 = 105,000。</p>
<p>9/1:流通株式 = 110,000 − 3,000 = 107,000株 → 10,700株(小規模株式配当で時価)。利益剰余金 −406,600、普通株式 +107,000、APIC +299,600。</p>
<p>12/15:流通株式 117,700株 × $1 = 117,700。</p>
<p>普通株式 = 1,000,000 + 100,000 + 107,000 = 1,207,000。APIC = 1,500,000 + 212,000 + 10,000 + 299,600 = 2,021,600。利益剰余金 = 2,000,000 + 600,000 − 406,600 − 117,700 = 2,075,700。合計 = 1,207,000 + 2,021,600 + 2,075,700 − 105,000 = 5,199,300。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-30",
  section: "FAR",
  chapter: "FAR-05",
  title: "基本的EPSと希薄化後EPS(オプション・転換社債)",
  scenario: `<p>Kudo Corp. reported net income of <b>$900,000</b> for Year 1. The tax rate is 25%. Additional information:</p>
<table><tr><th>Item</th><th>Details</th></tr>
<tr><td>Common shares</td><td>200,000 outstanding on January 1; 40,000 issued on April 1; 12,000 reacquired as treasury stock on October 1</td></tr>
<tr><td>Preferred stock</td><td>$1,000,000 par, 6% cumulative, nonconvertible; no dividends declared in Year 1</td></tr>
<tr><td>Stock options</td><td>30,000 options outstanding all year, exercise price $25; average market price $40</td></tr>
<tr><td>Convertible bonds</td><td>$2,000,000 of 4% bonds issued at par, outstanding all year, convertible into 50,000 common shares</td></tr></table>
<p class="ja">Kudo社の第1年度の純利益は$900,000、税率は25%である。普通株式は1月1日に200,000株、4月1日に40,000株を発行、10月1日に12,000株を自己株式として取得した。優先株式は額面$1,000,000、6%累積的・非転換で、第1年度に配当は宣言されていない。ストック・オプション30,000個(行使価格$25、平均株価$40)が期中を通じて残存。額面発行の4%転換社債$2,000,000(普通株式50,000株に転換可能)が期中を通じて残存している。</p>`,
  rows: [
    { label: "Weighted-average common shares(加重平均普通株式数)", type: "num", answer: 227000 },
    { label: "Income available to common shareholders(普通株主に帰属する利益)", type: "num", answer: 840000 },
    { label: "Basic EPS(基本的EPS)", type: "num", answer: 3.70, tol: 0.01 },
    { label: "Incremental shares from options(オプションによる増加株式数)", type: "num", answer: 11250 },
    { label: "Effect of the convertible bonds(転換社債の影響)", type: "select", options: ["Dilutive", "Antidilutive"], answer: "Dilutive" },
    { label: "Diluted EPS(希薄化後EPS)", type: "num", answer: 3.12, tol: 0.01 },
  ],
  explain: `<p>加重平均株式数 = 200,000 + 40,000 × 9/12 − 12,000 × 3/12 = 227,000。</p>
<p>累積的優先株式の配当60,000は宣言の有無にかかわらず控除:900,000 − 60,000 = 840,000。基本的EPS = 840,000 ÷ 227,000 = 3.70。</p>
<p>オプション:30,000 − 30,000 × 25 ÷ 40 = 11,250株。オプション考慮後 840,000 ÷ 238,250 = 3.53。</p>
<p>転換社債:税引後利息 2,000,000 × 4% × 75% = 60,000、1株当たり 60,000 ÷ 50,000 = 1.20 < 3.53 のため希薄化効果あり。</p>
<p>希薄化後EPS = (840,000 + 60,000) ÷ (227,000 + 11,250 + 50,000) = 900,000 ÷ 288,250 = 3.12。</p>`,
});
