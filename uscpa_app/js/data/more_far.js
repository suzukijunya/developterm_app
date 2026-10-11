// FAR の追加問題

CPA.extend("FAR-01", {
  mcq: [
    {
      q: "Under the FASB Conceptual Framework, increases in equity from peripheral or incidental transactions of an entity are defined as:",
      ja: "FASBの概念フレームワークにおいて、企業の付随的・偶発的な取引による持分の増加は何と定義されるか。",
      c: ["Revenues", "Gains", "Investments by owners", "Comprehensive income"],
      a: 1,
      ex: "Gains(利得)は付随的・偶発的な取引による持分の増加。Revenues(収益)は主たる営業活動から生じるもの。",
    },
    {
      q: "Neutrality is a component of which qualitative characteristic?",
      ja: "中立性(Neutrality)はどの質的特性の構成要素か。",
      c: ["Relevance", "Faithful representation", "Comparability", "Understandability"],
      a: 1,
      ex: "Faithful representation(忠実な表現)の構成要素は Completeness・Neutrality・Free from error の3つ。",
    },
    {
      q: "The results of a component of an entity that qualifies as a discontinued operation should be reported:",
      ja: "非継続事業に該当する構成単位の業績はどのように報告すべきか。",
      c: [
        "As part of operating expenses",
        "Separately, net of tax, after income from continuing operations",
        "In other comprehensive income",
        "Only in the notes to the financial statements",
      ],
      a: 1,
      ex: "非継続事業の損益は、継続事業からの利益の後に税引後(net of tax)で区分表示する。",
    },
    {
      q: "A company changes its depreciation method from double-declining balance to straight-line. How should this change be accounted for?",
      ja: "ある会社が減価償却方法を2倍定率法から定額法に変更した。この変更はどのように会計処理すべきか。",
      c: [
        "Retrospectively, as a change in accounting principle",
        "Prospectively, as a change in estimate effected by a change in principle",
        "As a correction of an error",
        "As a cumulative-effect adjustment in net income",
      ],
      a: 1,
      ex: "減価償却方法の変更は「会計方針の変更により生じた見積りの変更」として将来に向かって処理する。",
    },
    {
      q: "Materiality, as described in the FASB Conceptual Framework, is best described as:",
      ja: "FASBの概念フレームワークにおいて、重要性(Materiality)を最もよく説明しているのはどれか。",
      c: [
        "A uniform quantitative threshold set by the FASB",
        "An entity-specific aspect of relevance",
        "An enhancing qualitative characteristic",
        "A component of faithful representation",
      ],
      a: 1,
      ex: "重要性は企業固有の目的適合性の一側面であり、FASBは一律の数値基準を定めていない。",
    },
  ],
  cards: [
    ["Gains", "利得", "付随的・偶発的な取引による持分の増加"],
    ["Change in estimate effected by a change in principle", "方針変更による見積りの変更", "減価償却方法の変更。将来に向かって処理"],
  ],
});

CPA.extend("FAR-02", {
  mcq: [
    {
      q: "A customer option to acquire additional goods at a significant discount that the customer would not receive without entering into the contract represents:",
      ja: "契約を締結しなければ得られない大幅な割引で追加の財を取得できる顧客のオプションは何に該当するか。",
      c: ["A marketing expense", "A separate performance obligation (material right)", "Variable consideration only", "A contract cost asset"],
      a: 1,
      ex: "重要な権利(material right)を顧客に与えるオプションは独立した履行義務となり、取引価格の一部を配分する。",
    },
    {
      q: "An entity is not required to adjust the transaction price for a significant financing component if, at contract inception, the period between transfer of the good and customer payment is expected to be:",
      ja: "契約開始時点で、財の移転から顧客の支払までの期間がどの程度と見込まれる場合、重要な金融要素について取引価格を調整しなくてよいか。",
      c: ["Two years or less", "One year or less", "Six months or less", "Any length, if the customer is creditworthy"],
      a: 1,
      ex: "実務上の便法:移転と支払の間が1年以内と見込まれる場合は、重要な金融要素の調整をしなくてよい。",
    },
    {
      q: "An extended warranty that a customer can purchase separately should be accounted for as:",
      ja: "顧客が別途購入できる延長保証はどのように会計処理すべきか。",
      c: [
        "A warranty cost accrual at the time of sale",
        "A separate performance obligation with revenue recognized over the warranty period",
        "Revenue recognized in full at the time of sale",
        "A reduction of cost of goods sold",
      ],
      a: 1,
      ex: "別途購入できる保証はサービス型保証で独立した履行義務。収益を繰り延べ、保証期間にわたって認識する。品質保証型(assurance-type)は費用の見積計上。",
    },
    {
      q: "A contractor may earn a $50,000 performance bonus if a project is completed by a certain date; otherwise it earns nothing. Which method is most appropriate for estimating this variable consideration?",
      ja: "期日までに完成すれば$50,000のボーナス、そうでなければゼロという契約がある。この変動対価の見積りに最も適した方法はどれか。",
      c: ["Expected value method", "Most likely amount method", "Residual approach", "Cost-plus margin approach"],
      a: 1,
      ex: "結果が2つしかない場合は最頻値法(most likely amount)が適切。結果が多数ある場合は期待値法。",
    },
    {
      q: "A contract modification adds distinct goods at a price that reflects their standalone selling prices. The modification should be accounted for as:",
      ja: "契約変更により、独立販売価格を反映した価格で区別できる財が追加された。この変更はどう会計処理すべきか。",
      c: [
        "A separate contract",
        "A cumulative catch-up adjustment to the original contract",
        "Termination of the original contract and creation of a new one in all cases",
        "A reduction of the original transaction price",
      ],
      a: 0,
      ex: "区別できる財が独立販売価格で追加される場合は、別個の契約として処理する。",
    },
  ],
  cards: [
    ["Material right", "重要な権利", "契約がなければ得られない割引などのオプション。独立した履行義務"],
    ["Significant financing component", "重要な金融要素", "支払時期により顧客または企業に金融の便益がある"],
    ["Assurance-type warranty", "品質保証型保証", "仕様どおりであることの保証。費用を見積計上"],
  ],
});

CPA.extend("FAR-03", {
  mcq: [
    {
      q: "A company using a periodic system had beginning inventory of 100 units at $10, purchased 200 units at $12 and then 100 units at $14, and sold 250 units. What is ending inventory under LIFO?",
      ja: "棚卸計算法を用いる会社の期首在庫は100個@$10。その後200個@$12、100個@$14を仕入れ、250個を販売した。LIFOによる期末棚卸高はいくらか。",
      c: ["$1,600", "$1,800", "$2,000", "$2,100"],
      a: 0,
      ex: "期末在庫150個。LIFOでは古い原価が残る:100個 × $10 + 50個 × $12 = 1,000 + 600 = $1,600。FIFOなら100 × 14 + 50 × 12 = $2,000、総平均法なら$12 × 150 = $1,800。",
    },
    {
      q: "Equipment costing $33,000 with a salvage value of $3,000 and a five-year life is depreciated using the sum-of-the-years'-digits method. What is depreciation in year 1?",
      ja: "取得原価$33,000、残存価額$3,000、耐用年数5年の設備を年数総和法で償却する。1年目の減価償却費はいくらか。",
      c: ["$6,000", "$10,000", "$11,000", "$13,200"],
      a: 1,
      ex: "年数総和 = 1+2+3+4+5 = 15。(33,000 − 3,000)× 5/15 = $10,000。",
    },
    {
      q: "Goods purchased FOB shipping point that are in transit at year-end should be included in the inventory of:",
      ja: "期末に輸送中である、FOB出荷地点条件で購入した商品は、誰の棚卸資産に含めるべきか。",
      c: ["The seller", "The buyer", "The carrier", "Neither party until received"],
      a: 1,
      ex: "FOB shipping point では出荷時点で所有権が買手に移るため、輸送中の商品は買手の在庫に含める。FOB destination なら到着まで売手の在庫。",
    },
    {
      q: "When an entity recognizes an asset retirement obligation for a long-lived asset, the offsetting entry is to:",
      ja: "長期性資産について資産除去債務を認識するとき、相手勘定は何か。",
      c: [
        "Expense the full amount immediately",
        "Increase the carrying amount of the related long-lived asset",
        "Record a deferred tax asset",
        "Reduce retained earnings",
      ],
      a: 1,
      ex: "資産除去債務の公正価値(現在価値)を負債に計上し、同額を関連する資産の帳簿価額に加算して耐用年数にわたり償却する。",
    },
    {
      q: "In a nonmonetary exchange of similar productive assets that has commercial substance, a gain on the asset given up should be:",
      ja: "商業的実質のある非貨幣性資産の交換において、引き渡した資産に係る利得はどう扱うべきか。",
      c: ["Deferred entirely", "Recognized in full", "Recognized only to the extent of cash received", "Recorded in other comprehensive income"],
      a: 1,
      ex: "商業的実質があれば公正価値で測定し、損益を全額認識する。商業的実質がない場合は原則として利得を繰り延べる(現金受領分を除く)。",
    },
  ],
  cards: [
    ["FOB shipping point", "出荷地点渡し", "出荷時に所有権が買手へ移転"],
    ["Asset retirement obligation (ARO)", "資産除去債務", "現在価値で負債計上し、資産の帳簿価額に加算"],
    ["Commercial substance", "商業的実質", "交換によりキャッシュフローが大きく変わること"],
  ],
});

CPA.extend("FAR-04", {
  mcq: [
    {
      q: "When bonds are issued at a premium, the carrying amount of the bonds over their term will:",
      ja: "社債が打歩発行された場合、社債の帳簿価額は期間を通じてどう変化するか。",
      c: ["Increase", "Decrease", "Remain constant", "Increase then decrease"],
      a: 1,
      ex: "打歩発行では、プレミアムの償却により帳簿価額は満期にかけて額面まで減少していく。",
    },
    {
      q: "A short-term obligation may be classified as noncurrent if the entity intends to refinance it on a long-term basis and:",
      ja: "短期の債務を非流動に分類できるのは、長期で借り換える意図があり、かつどのような場合か。",
      c: [
        "Management believes refinancing is likely",
        "It demonstrates the ability to refinance, such as by refinancing after the balance sheet date or entering a financing agreement before the statements are issued",
        "The debt is owed to a related party",
        "The interest rate is fixed",
      ],
      a: 1,
      ex: "意図に加えて、貸借対照表日後・財務諸表発行前の借換え実行、または要件を満たす融資契約の締結によって能力を示す必要がある。",
    },
    {
      q: "Under U.S. GAAP, a probable gain contingency should be:",
      ja: "US GAAPにおいて、可能性の高い偶発利益はどう扱うべきか。",
      c: ["Recognized when probable and estimable", "Not recognized until realized, but may be disclosed", "Recognized in other comprehensive income", "Recognized at the midpoint of the range"],
      a: 1,
      ex: "保守主義の観点から偶発利益は実現するまで計上せず、注記での開示にとどめる(誤解を招く表現は避ける)。",
    },
    {
      q: "A lessee recorded a finance lease liability of $44,651. The first annual payment of $10,000 was made at lease commencement, and the discount rate is 6%. What is interest expense for year 1?",
      ja: "借手はファイナンス・リース負債$44,651を計上した。初回の年額$10,000はリース開始日に支払い、割引率は6%である。1年目の支払利息はいくらか。",
      c: ["$2,679", "$2,079", "$600", "$3,279"],
      a: 1,
      ex: "開始日の支払後の負債残高 44,651 − 10,000 = 34,651。利息 = 34,651 × 6% = 2,079。",
    },
    {
      q: "A lessee elects the short-term lease exemption for a 10-month equipment lease. The lessee should:",
      ja: "借手は10か月の設備リースについて短期リースの免除を選択した。借手はどう処理すべきか。",
      c: [
        "Record a right-of-use asset and a lease liability",
        "Recognize lease payments as expense on a straight-line basis without recording a ROU asset or liability",
        "Capitalize the payments as equipment",
        "Disclose the lease only",
      ],
      a: 1,
      ex: "リース期間12か月以内(購入オプションの行使が合理的に確実でない)なら、使用権資産・リース負債を計上せず、定額で費用処理できる。",
    },
  ],
  cards: [
    ["Bond premium", "社債発行差金(打歩)", "表面利率 > 市場利率のとき。償却で簿価が減少"],
    ["Gain contingency", "偶発利益", "実現するまで計上しない"],
    ["Short-term lease", "短期リース", "12か月以内。ROU資産・負債の計上を免除できる"],
  ],
});

CPA.extend("FAR-05", {
  mcq: [
    {
      q: "A company declares a 5% stock dividend when the market price of its stock exceeds par value. Retained earnings should be debited for:",
      ja: "株価が額面を上回るときに5%の株式配当を宣言した。利益剰余金はいくらで借記すべきか。",
      c: ["Par value of the shares distributed", "Fair value of the shares distributed", "Book value per share", "No entry is required"],
      a: 1,
      ex: "小規模な株式配当(通常20〜25%未満)は分配株式の公正価値で利益剰余金を減額する。大規模な株式配当は額面で処理する。",
    },
    {
      q: "A company has 10,000 stock options outstanding with an exercise price of $20. The average market price of the stock during the year was $25. Using the treasury stock method, how many incremental shares are added to the denominator of diluted EPS?",
      ja: "行使価格$20のストック・オプションが10,000個ある。当期の平均株価は$25だった。自己株式法により、希薄化後EPSの分母に加算される増加株式数は何株か。",
      c: ["10,000", "8,000", "2,000", "0"],
      a: 2,
      ex: "行使による入金 10,000 × 20 = 200,000 で平均株価$25の自己株式を 8,000株 買い戻すと仮定。増加株式数 = 10,000 − 8,000 = 2,000株。",
    },
    {
      q: "Unrealized holding gains on debt securities classified as trading are reported in:",
      ja: "売買目的に分類された負債証券の未実現保有利益はどこで報告されるか。",
      c: ["Other comprehensive income", "Net income", "Additional paid-in capital", "The notes only"],
      a: 1,
      ex: "売買目的(trading)の負債証券は公正価値で測定し、評価差額を当期純利益に計上する。AFSならOCI。",
    },
    {
      q: "An investor paid $300,000 for 25% of an investee whose net assets had a book value of $1,000,000. The $50,000 excess is attributable to equipment with a 10-year remaining life. By how much does the excess reduce the investor's annual equity method income?",
      ja: "投資会社は純資産の簿価$1,000,000の被投資会社の25%を$300,000で取得した。差額$50,000は残存耐用年数10年の設備に起因する。この差額は持分法による投資利益を毎年いくら減少させるか。",
      c: ["$0", "$5,000", "$12,500", "$50,000"],
      a: 1,
      ex: "取得原価 300,000 − 簿価の持分 250,000 = 50,000 を設備の残存耐用年数10年で償却 → 毎年 $5,000 を投資利益から減額する。",
    },
    {
      q: "Dividends in arrears on cumulative preferred stock that have not been declared should be:",
      ja: "未宣言の累積的優先株式の延滞配当はどう扱うべきか。",
      c: ["Recorded as a current liability", "Recorded as a reduction of retained earnings", "Disclosed in the notes but not recorded as a liability", "Ignored entirely"],
      a: 2,
      ex: "配当は宣言されるまで負債にならない。延滞配当の金額は注記で開示する(EPSの計算では当期分を控除する)。",
    },
  ],
  cards: [
    ["Stock dividend", "株式配当", "小規模は公正価値、大規模は額面で処理"],
    ["Treasury stock method", "自己株式法", "オプション行使代金で自己株式を買い戻すと仮定"],
    ["Dividends in arrears", "延滞配当", "累積的優先株の未払配当。負債ではなく注記"],
  ],
});

CPA.extend("FAR-06", {
  mcq: [
    {
      q: "Which governmental fund accounts for resources accumulated to pay principal and interest on general long-term debt?",
      ja: "一般長期債務の元本と利息の支払のために蓄積された資源を会計処理する政府型ファンドはどれか。",
      c: ["General fund", "Capital projects fund", "Debt service fund", "Permanent fund"],
      a: 2,
      ex: "Debt service fund(債務返済ファンド)。Capital projects fund は大型の資本的資産の取得・建設の資源を扱う。",
    },
    {
      q: "A city operates a water utility that charges fees to the public to recover its costs. This activity should be accounted for in:",
      ja: "市は費用を回収するため一般市民から料金を徴収する水道事業を運営している。この活動はどのファンドで会計処理すべきか。",
      c: ["An enterprise fund", "An internal service fund", "A special revenue fund", "A custodial fund"],
      a: 0,
      ex: "外部の利用者に料金を課す事業はEnterprise fund。政府内部の部署にサービスを提供する場合はInternal service fund。",
    },
    {
      q: "Under the modified accrual basis, property tax revenue is generally considered available if collected within how many days after year-end?",
      ja: "修正発生主義において、固定資産税収入は一般に期末後何日以内に回収されれば「利用可能」とみなされるか。",
      c: ["30 days", "60 days", "90 days", "120 days"],
      a: 1,
      ex: "固定資産税は期末後60日以内に回収されるものを利用可能(available)として当期の収入に計上する。",
    },
    {
      q: "In the government-wide statement of net position, net position is classified as:",
      ja: "政府全体の純資産計算書において、純ポジションはどのように区分されるか。",
      c: [
        "With donor restrictions and without donor restrictions",
        "Net investment in capital assets, restricted, and unrestricted",
        "Nonspendable, restricted, committed, assigned, and unassigned",
        "Current and noncurrent",
      ],
      a: 1,
      ex: "政府全体の純ポジションは、資本的資産への純投資・拘束・非拘束の3区分。5区分はファンド財務諸表のファンド残高の区分。",
    },
    {
      q: "When a not-for-profit entity satisfies a donor-imposed purpose restriction, it reports:",
      ja: "非営利組織が寄付者の課した目的制約を満たしたとき、何を報告するか。",
      c: [
        "New contribution revenue",
        "A reclassification from net assets with donor restrictions to net assets without donor restrictions",
        "A prior period adjustment",
        "A decrease in net assets with donor restrictions only, with no other effect",
      ],
      a: 1,
      ex: "制約の解除は、制約あり純資産から制約なし純資産への組替え(net assets released from restrictions)として活動計算書に表示する。",
    },
  ],
  cards: [
    ["Debt service fund", "債務返済ファンド", "一般長期債務の元利払いのための資源"],
    ["Enterprise fund", "企業ファンド", "外部利用者に料金を課す事業"],
    ["Net investment in capital assets", "資本的資産への純投資", "資本的資産 − 減価償却累計額 − 関連する債務"],
  ],
});

CPA.extend("FAR-07", {
  mcq: [
    {
      q: "For a net operating loss arising in tax years beginning after 2017, a corporation generally may:",
      ja: "2017年より後に開始する事業年度に生じた純営業損失(NOL)について、法人は一般に何ができるか。",
      c: [
        "Carry it back 2 years and forward 20 years",
        "Carry it forward indefinitely, limited to 80% of taxable income in the carryforward year",
        "Deduct it only against capital gains",
        "Carry it back 5 years only",
      ],
      a: 1,
      ex: "TCJA以降、NOLは原則として繰戻し不可、無期限に繰越可能で、各年の課税所得の80%が控除の上限。会計上は繰延税金資産を計上する。",
    },
    {
      q: "Under ASC 740, the tax benefit of an uncertain tax position is recognized only if the position is:",
      ja: "ASC 740において、不確実な税務ポジションの税務上の便益を認識できるのは、そのポジションがどのような場合か。",
      c: [
        "Possible of being sustained on examination",
        "More likely than not to be sustained on examination based on its technical merits",
        "Virtually certain to be sustained",
        "Approved in writing by the IRS",
      ],
      a: 1,
      ex: "技術的な妥当性に基づき、税務調査で認められる可能性が50%超(more likely than not)の場合に認識し、実現可能性が50%を超える最大額で測定する。",
    },
    {
      q: "Cost of goods sold was $500,000. Inventory increased by $20,000 and accounts payable to suppliers increased by $15,000. Under the direct method, what were cash payments to suppliers?",
      ja: "売上原価は$500,000。棚卸資産は$20,000増加し、仕入先への買掛金は$15,000増加した。直接法による仕入先への支払額はいくらか。",
      c: ["$485,000", "$495,000", "$505,000", "$535,000"],
      a: 2,
      ex: "仕入高 = 500,000 + 20,000(在庫増)= 520,000。支払額 = 520,000 − 15,000(買掛金増)= $505,000。",
    },
    {
      q: "Cash received from the sale of equipment is reported in the statement of cash flows as:",
      ja: "設備の売却による現金収入はキャッシュフロー計算書でどう報告されるか。",
      c: ["An operating activity", "An investing activity", "A financing activity", "A noncash activity"],
      a: 1,
      ex: "売却代金の全額が投資活動の収入。間接法では売却損益を営業活動の区分で調整(利益は減算)する。",
    },
    {
      q: "When a change in tax rates is enacted, the effect on existing deferred tax assets and liabilities is recognized:",
      ja: "税率の変更が制定された場合、既存の繰延税金資産・負債への影響はいつ認識されるか。",
      c: [
        "Retrospectively by restating prior years",
        "In income from continuing operations in the period of enactment",
        "When the temporary differences reverse",
        "In other comprehensive income only",
      ],
      a: 1,
      ex: "税率変更の影響は、制定された期間に継続事業からの利益(税金費用)で一括して認識する。",
    },
  ],
  cards: [
    ["Net operating loss (NOL)", "純営業損失", "2018年以降は無期限繰越・課税所得の80%まで"],
    ["Uncertain tax position", "不確実な税務ポジション", "more likely than not で認識"],
    ["Direct method", "直接法", "現金収支を総額で表示する営業CFの作成方法"],
  ],
});
