// BAR・ISC・TCP の追加問題

CPA.extend("BAR-01", {
  mcq: [
    {
      q: "A company has earnings before interest and taxes of $400,000 and interest expense of $80,000. What is its times-interest-earned ratio?",
      ja: "ある会社の利息・税金控除前利益(EBIT)は$400,000、支払利息は$80,000である。インタレスト・カバレッジ・レシオ(times interest earned)はいくらか。",
      c: ["4.0", "5.0", "6.0", "0.2"],
      a: 1,
      ex: "Times interest earned = EBIT ÷ 支払利息 = 400,000 ÷ 80,000 = 5.0倍。",
    },
    {
      q: "A company has a contribution margin of $300,000 and operating income of $100,000. If sales increase by 10%, operating income will increase by:",
      ja: "ある会社の貢献利益は$300,000、営業利益は$100,000である。売上が10%増加すると、営業利益は何%増加するか。",
      c: ["10%", "20%", "30%", "33%"],
      a: 2,
      ex: "営業レバレッジ度 = 貢献利益 ÷ 営業利益 = 300,000 ÷ 100,000 = 3.0。営業利益の増加率 = 10% × 3.0 = 30%。",
    },
    {
      q: "A company with excess capacity receives a one-time special order for 1,000 units at $40 each. Variable cost is $32 per unit, and fixed costs will not change. Accepting the order will increase operating income by:",
      ja: "遊休能力のある会社が1個$40で1,000個の一度限りの特別注文を受けた。変動費は1個$32で、固定費は変わらない。注文を受けると営業利益はいくら増加するか。",
      c: ["$40,000", "$8,000", "$0", "$32,000"],
      a: 1,
      ex: "関連収益・関連原価だけを比較する。(40 − 32)× 1,000 = $8,000。変わらない固定費は意思決定に無関連。",
    },
    {
      q: "When production exceeds sales for the period, operating income under absorption costing compared with variable costing is:",
      ja: "当期の生産量が販売量を上回る場合、全部原価計算の営業利益は直接原価計算と比べてどうなるか。",
      c: ["Higher", "Lower", "The same", "Cannot be determined"],
      a: 0,
      ex: "全部原価計算では固定製造間接費の一部が期末在庫に繰り越されるため、生産 > 販売のとき利益が大きくなる。",
    },
    {
      q: "Actual direct labor hours were 5,200, and standard hours allowed for actual output were 5,000. The standard rate is $20 per hour. What is the direct labor efficiency variance?",
      ja: "実際の直接作業時間は5,200時間、実際の生産量に対する標準作業時間は5,000時間、標準賃率は1時間$20である。直接労務費の作業時間差異はいくらか。",
      c: ["$4,000 favorable", "$4,000 unfavorable", "$5,200 unfavorable", "$200 unfavorable"],
      a: 1,
      ex: "(5,200 − 5,000)× $20 = $4,000。実際時間が標準より多いので不利差異。",
    },
    {
      q: "When NPV and IRR rank mutually exclusive projects differently, the NPV method is generally preferred because it:",
      ja: "相互排他的なプロジェクトでNPVとIRRの順位が異なる場合、一般にNPV法が好まれる理由は何か。",
      c: [
        "Ignores the time value of money",
        "Assumes cash flows are reinvested at the cost of capital",
        "Is easier to compute",
        "Always produces a higher number",
      ],
      a: 1,
      ex: "NPVは再投資利回りを資本コストと仮定し、企業価値の増加額を直接示す。IRRはIRR自体での再投資を仮定するため、規模や時期の違いで判断を誤ることがある。",
    },
  ],
  cards: [
    ["Times interest earned", "インタレスト・カバレッジ", "EBIT ÷ 支払利息"],
    ["Degree of operating leverage", "営業レバレッジ度", "貢献利益 ÷ 営業利益"],
    ["Relevant cost", "関連原価", "選択肢によって変わる将来の原価"],
    ["Absorption costing", "全部原価計算", "固定製造間接費を製品原価に含める"],
  ],
});

CPA.extend("BAR-02", {
  mcq: [
    {
      q: "A parent sold inventory costing $60,000 to its subsidiary for $80,000. At year-end, 25% of the inventory remains unsold by the subsidiary. What unrealized profit must be eliminated in consolidation?",
      ja: "親会社が原価$60,000の商品を子会社に$80,000で販売した。期末に子会社はその25%を在庫として保有している。連結で消去すべき未実現利益はいくらか。",
      c: ["$20,000", "$15,000", "$5,000", "$0"],
      a: 2,
      ex: "利益 20,000 のうち期末在庫に残る25%が未実現:20,000 × 25% = $5,000。グループ内売上高・売上原価の80,000も消去する。",
    },
    {
      q: "In consolidated financial statements, the noncontrolling interest is reported:",
      ja: "連結財務諸表において、非支配持分はどのように報告されるか。",
      c: [
        "As a liability",
        "In equity, separately from the parent's equity",
        "Between liabilities and equity (mezzanine) in all cases",
        "Only in the notes",
      ],
      a: 1,
      ex: "非支配持分は純資産(equity)の区分に、親会社株主に帰属する持分とは区別して表示する。",
    },
    {
      q: "When a foreign subsidiary's functional currency is its local currency, translation adjustments are reported in:",
      ja: "在外子会社の機能通貨が現地通貨である場合、換算差額はどこに報告されるか。",
      c: ["Net income", "Other comprehensive income", "Retained earnings directly", "Additional paid-in capital"],
      a: 1,
      ex: "機能通貨から報告通貨への換算(current rate method)による差額はOCI(換算調整勘定)。記帳通貨から機能通貨への再測定(remeasurement)の差額は当期純利益。",
    },
    {
      q: "Cash-settled stock appreciation rights classified as liabilities are measured:",
      ja: "負債に分類される現金決済型の株式増価受益権(SAR)はどのように測定されるか。",
      c: [
        "At grant-date fair value with no remeasurement",
        "At fair value remeasured at each reporting date until settlement",
        "At intrinsic value on the grant date only",
        "At historical cost",
      ],
      a: 1,
      ex: "負債分類の株式報酬は決済まで各報告日に公正価値で再測定し、変動を報酬費用として認識する。持分分類は付与日の公正価値で固定。",
    },
    {
      q: "A reporting entity must consolidate a variable interest entity (VIE) if it is the primary beneficiary, meaning it has:",
      ja: "報告企業が変動持分事業体(VIE)を連結しなければならないのは主たる受益者である場合だが、主たる受益者とは何を有する企業か。",
      c: [
        "More than 50% of the voting shares",
        "The power to direct the activities that most significantly affect the VIE's economic performance and the obligation to absorb losses or right to receive benefits that could be significant",
        "Any investment in the VIE",
        "A seat on the VIE's board of directors",
      ],
      a: 1,
      ex: "VIEモデルでは、議決権ではなく「経済的成果に最も重要な影響を与える活動を指示するパワー」と「重要になりうる損失負担義務または便益受取権」の両方を持つ企業が連結する。",
    },
  ],
  cards: [
    ["Unrealized intercompany profit", "未実現利益", "グループ内取引の利益のうち外部に未販売の部分"],
    ["Functional currency", "機能通貨", "主たる経済環境の通貨"],
    ["Remeasurement", "再測定", "記帳通貨→機能通貨。差額は当期純利益"],
    ["Variable interest entity (VIE)", "変動持分事業体", "主たる受益者が連結"],
  ],
});

CPA.extend("BAR-03", {
  mcq: [
    {
      q: "Under GASB, the statement of cash flows for proprietary funds must be prepared using:",
      ja: "GASBにおいて、事業型ファンドのキャッシュフロー計算書はどの方法で作成しなければならないか。",
      c: ["The indirect method", "The direct method", "Either method", "No cash flow statement is required"],
      a: 1,
      ex: "GASBは事業型ファンドのキャッシュフロー計算書に直接法を要求し、営業利益から営業CFへの調整表も添付する。",
    },
    {
      q: "A GASB cash flow statement for proprietary funds includes which four categories?",
      ja: "事業型ファンドのGASBキャッシュフロー計算書に含まれる4つの区分はどれか。",
      c: [
        "Operating, investing, financing, and noncash",
        "Operating, noncapital financing, capital and related financing, and investing",
        "Operating, capital, debt, and equity",
        "Governmental, business-type, fiduciary, and component units",
      ],
      a: 1,
      ex: "営業・非資本的財務・資本的財務・投資の4区分。利息の受取は投資活動、資本的資産の取得は資本的財務活動に含まれる点がFASBと異なる。",
    },
    {
      q: "In governmental fund financial statements, amounts that can be used only for specific purposes determined by a formal action of the government's highest level of decision-making authority are classified as:",
      ja: "政府型ファンド財務諸表で、政府の最高意思決定機関の正式な決定によって特定の目的にのみ使用できる金額は、どう区分されるか。",
      c: ["Restricted", "Committed", "Assigned", "Unassigned"],
      a: 1,
      ex: "Committed(拘束決定済み)は最高意思決定機関(議会など)の正式な決定による制約。Restricted は外部(債権者・法律など)による制約、Assigned は意図による割当て。",
    },
    {
      q: "In a debt service fund using modified accrual, interest on general long-term debt is generally recognized as an expenditure:",
      ja: "修正発生主義を用いる債務返済ファンドでは、一般長期債務の利息は一般にいつ支出として認識されるか。",
      c: ["As it accrues daily", "When it is due", "When the debt is issued", "At the end of the debt term"],
      a: 1,
      ex: "一般長期債務の元利は支払期日到来時(when due)に支出として認識するのが原則。期末に未払利息を見越計上しない。",
    },
    {
      q: "A government's net pension liability for employees in governmental activities is reported:",
      ja: "政府型活動の職員に係る政府の純年金負債はどこに報告されるか。",
      c: [
        "In the general fund balance sheet",
        "In the government-wide statement of net position",
        "Only in required supplementary information",
        "In a pension trust fund as a liability of the government",
      ],
      a: 1,
      ex: "長期負債である純年金負債は、政府全体の純資産計算書に計上する。政府型ファンドは当座の財務資源に焦点を当てるため計上しない。",
    },
  ],
  cards: [
    ["Committed fund balance", "拘束決定済みファンド残高", "最高意思決定機関の正式決定による制約"],
    ["Restricted fund balance", "拘束ファンド残高", "外部(法律・債権者等)による制約"],
    ["Net pension liability", "純年金負債", "政府全体財務諸表に計上"],
  ],
});

CPA.extend("ISC-01", {
  mcq: [
    {
      q: "A batch total that sums a field with no meaningful numeric value, such as customer account numbers, is called a:",
      ja: "顧客番号のように数値としての意味がない項目を合計したバッチ合計を何というか。",
      c: ["Record count", "Financial total", "Hash total", "Check digit"],
      a: 2,
      ex: "Hash total は意味のない数値項目の合計で、データの欠落・改変を検出する。Record count は件数、Financial total は金額の合計。",
    },
    {
      q: "A differential backup copies:",
      ja: "差分バックアップ(differential backup)は何をコピーするか。",
      c: [
        "All data, every time",
        "All changes since the last full backup",
        "Only changes since the last backup of any type",
        "Only system files",
      ],
      a: 1,
      ex: "差分バックアップは直近のフルバックアップ以降の変更すべて。増分(incremental)バックアップは直近のバックアップ(種類を問わず)以降の変更のみ。",
    },
    {
      q: "Which of the following is an IT general control rather than an application control?",
      ja: "次のうち、アプリケーション統制ではなくIT全般統制(ITGC)に該当するものはどれか。",
      c: [
        "An edit check that rejects invalid dates in a sales order",
        "Logical access controls over who can modify programs and data",
        "Automatic calculation of invoice totals",
        "A three-way match performed by the system",
      ],
      a: 1,
      ex: "ITGCはプログラムとデータへのアクセス、プログラム変更、開発、運用など、システム全体の環境に関する統制。他は個々の取引処理に組み込まれたアプリケーション統制。",
    },
    {
      q: "In which cloud service model does the customer manage the operating system and applications while the provider manages the physical infrastructure?",
      ja: "顧客がOSとアプリケーションを管理し、事業者が物理インフラを管理するクラウドのサービスモデルはどれか。",
      c: ["Software as a Service (SaaS)", "Platform as a Service (PaaS)", "Infrastructure as a Service (IaaS)", "On-premises hosting"],
      a: 2,
      ex: "IaaSでは事業者がサーバー・ストレージ・ネットワークを提供し、顧客がOS以上を管理する。SaaSはアプリケーションまで事業者が管理する。",
    },
    {
      q: "Emergency changes to production programs should be:",
      ja: "本番プログラムへの緊急変更はどのように扱うべきか。",
      c: [
        "Prohibited in all circumstances",
        "Made without any documentation to save time",
        "Logged, reviewed, and approved after implementation",
        "Made only by end users",
      ],
      a: 2,
      ex: "緊急時は事前承認の手続を省略できる場合もあるが、記録を残し、事後にレビュー・承認を受ける必要がある。",
    },
  ],
  cards: [
    ["Hash total", "ハッシュ合計", "意味のない数値項目の合計による入力統制"],
    ["Differential backup", "差分バックアップ", "前回のフルバックアップ以降の変更"],
    ["IT general controls (ITGC)", "IT全般統制", "アクセス・変更・開発・運用の統制"],
    ["Infrastructure as a Service (IaaS)", "IaaS", "顧客がOS以上を管理するクラウド"],
  ],
});

CPA.extend("ISC-02", {
  mcq: [
    {
      q: "A hash value computed for a file is primarily used to provide assurance about the file's:",
      ja: "ファイルについて計算したハッシュ値は、主にファイルの何を保証するために使われるか。",
      c: ["Confidentiality", "Integrity", "Availability", "Ownership"],
      a: 1,
      ex: "ハッシュ値が一致すれば内容が改ざんされていないこと(完全性)を確認できる。ハッシュは暗号化ではないため機密性は保証しない。",
    },
    {
      q: "Layering multiple, independent security controls so that the failure of one does not compromise the system is known as:",
      ja: "1つの統制が破られてもシステムが侵害されないよう、独立した複数のセキュリティ統制を重ねることを何というか。",
      c: ["Least privilege", "Defense in depth", "Segregation of duties", "Single sign-on"],
      a: 1,
      ex: "多層防御(defense in depth)。ファイアウォール、エンドポイント保護、アクセス制御、監視などを重ねて配置する。",
    },
    {
      q: "Which control is most effective for recovering from a ransomware attack without paying the ransom?",
      ja: "身代金を支払わずにランサムウェア攻撃から復旧するうえで最も効果的な統制はどれか。",
      c: [
        "Longer passwords",
        "Regularly tested offline or immutable backups",
        "Annual security awareness training only",
        "A firewall rule review",
      ],
      a: 1,
      ex: "ネットワークから隔離された(またはイミュータブルな)バックアップを定期的に取得し、復元テストをしておくことが復旧の決め手になる是正的統制。",
    },
    {
      q: "The privacy principle of data minimization requires an organization to:",
      ja: "プライバシーにおけるデータ最小化の原則が組織に求めるのはどれか。",
      c: [
        "Collect only the personal information necessary for the stated purpose",
        "Encrypt all data at rest",
        "Delete all data after one year",
        "Store personal information in a single database",
      ],
      a: 0,
      ex: "特定した目的に必要な個人情報だけを収集・保持すること。漏えい時の影響を小さくする効果もある。",
    },
    {
      q: "How does a penetration test differ from a vulnerability scan?",
      ja: "ペネトレーション・テストは脆弱性スキャンとどう異なるか。",
      c: [
        "A penetration test actively attempts to exploit weaknesses to determine whether they can be used to gain access",
        "A penetration test only lists missing patches",
        "A vulnerability scan is always performed manually",
        "There is no difference",
      ],
      a: 0,
      ex: "脆弱性スキャンは既知の脆弱性を自動的に洗い出す。ペネトレーション・テストは実際に攻撃を試みて侵入できるか、影響はどの程度かを確かめる。",
    },
    {
      q: "According to the NIST incident response life cycle, which phase immediately follows detection and analysis?",
      ja: "NISTのインシデント対応ライフサイクルで、検知と分析の直後に来るフェーズはどれか。",
      c: ["Preparation", "Containment, eradication, and recovery", "Post-incident activity", "Risk assessment"],
      a: 1,
      ex: "準備 → 検知と分析 → 封じ込め・根絶・復旧 → 事後対応(教訓の反映)の順。",
    },
  ],
  cards: [
    ["Hashing", "ハッシュ化", "一方向の変換で完全性を確認"],
    ["Defense in depth", "多層防御", "独立した統制を重ねる"],
    ["Data minimization", "データ最小化", "目的に必要な個人情報のみ収集"],
    ["Penetration test", "侵入テスト", "実際に攻撃を試みて侵入可能性を確認"],
  ],
});

CPA.extend("ISC-03", {
  mcq: [
    {
      q: "A user auditor receives a SOC 1 Type 1 report. The user auditor may use it to:",
      ja: "利用企業の監査人がSOC 1 Type 1レポートを入手した。これを何に利用できるか。",
      c: [
        "Reduce assessed control risk based on operating effectiveness",
        "Obtain an understanding of the controls at the service organization",
        "Replace all substantive procedures",
        "Express an opinion on the service organization",
      ],
      a: 1,
      ex: "Type 1は特定時点のデザインのみを対象とし運用状況を検証していないため、統制の理解には使えるが、統制リスクを下げる根拠にはならない。",
    },
    {
      q: "In the user auditor's report on a user entity's financial statements, the user auditor should:",
      ja: "利用企業の財務諸表に対する監査報告書において、利用企業の監査人はどうすべきか。",
      c: [
        "Refer to the service auditor's report to divide responsibility",
        "Not refer to the work of the service auditor in an unmodified opinion",
        "Attach the SOC report",
        "Name the service organization in the opinion paragraph",
      ],
      a: 1,
      ex: "無限定意見では受託会社監査人の作業に言及しない。言及しても責任は軽減されないため。",
    },
    {
      q: "A bridge (gap) letter is provided by:",
      ja: "ブリッジ・レター(ギャップ・レター)は誰が提供するか。",
      c: [
        "The service auditor, as an opinion on the gap period",
        "Service organization management, covering the period between the end of the SOC report period and the user's year-end",
        "The user auditor",
        "The PCAOB",
      ],
      a: 1,
      ex: "SOCレポートの対象期間末から利用企業の期末までの空白期間について、受託会社の経営者が統制に重要な変更がない旨を記載する書面。監査人の保証はない。",
    },
    {
      q: "In a SOC engagement, the service organization's management must provide:",
      ja: "SOC業務において、受託会社の経営者が提供しなければならないものはどれか。",
      c: [
        "A written assertion about the description and the controls",
        "An audit opinion on its own financial statements",
        "A guarantee to user entities",
        "A list of all user auditors",
      ],
      a: 0,
      ex: "経営者はシステムの記述と統制のデザイン(Type 2では運用状況の有効性も)に関する書面のアサーションを提供し、受託会社監査人はそれについて意見を表明する。",
    },
    {
      q: "A SOC for Cybersecurity engagement reports on:",
      ja: "SOC for Cybersecurity 業務は何について報告するか。",
      c: [
        "An entity's cybersecurity risk management program",
        "A user entity's financial statements",
        "A service organization's ICFR-relevant controls only",
        "Individual employees' security certifications",
      ],
      a: 0,
      ex: "組織全体のサイバーセキュリティ・リスクマネジメント・プログラムの記述と統制の有効性について報告する一般利用の報告書。",
    },
  ],
  cards: [
    ["Bridge letter", "ブリッジ・レター", "SOC対象期間と利用企業の期末の空白を埋める経営者の書面"],
    ["Management's assertion", "経営者のアサーション", "SOC業務で記述と統制について経営者が提供"],
    ["SOC for Cybersecurity", "SOCサイバーセキュリティ", "全社のサイバーリスク管理プログラムの報告"],
  ],
});

CPA.extend("TCP-01", {
  mcq: [
    {
      q: "An employee sells stock acquired through an incentive stock option before meeting the required holding periods (a disqualifying disposition). The result is:",
      ja: "従業員が適格ストック・オプションで取得した株式を、保有要件を満たす前に売却した(不適格処分)。結果はどうなるか。",
      c: [
        "All gain is long-term capital gain",
        "The bargain element at exercise is generally taxed as ordinary compensation income",
        "No tax is due",
        "The entire sales price is ordinary income",
      ],
      a: 1,
      ex: "不適格処分では、行使時の差額(bargain element)が原則として通常の給与所得になり、それを超える値上がりはキャピタルゲインとなる。",
    },
    {
      q: "Earnings in a Section 529 qualified tuition program are:",
      ja: "§529教育資金積立制度の運用益はどう扱われるか。",
      c: [
        "Taxed annually as ordinary income",
        "Tax-free if distributed for qualified education expenses",
        "Always subject to a 10% penalty",
        "Deductible on the federal return when contributed",
      ],
      a: 1,
      ex: "529プランの拠出は連邦では控除されないが、運用益は非課税で積み立てられ、適格な教育費に使えば引出しも非課税。",
    },
    {
      q: "An individual who itemizes contributes appreciated stock to a donor-advised fund. When is the charitable deduction generally available?",
      ja: "項目別控除を選ぶ個人が、含み益のある株式をドナー・アドバイズド・ファンドに拠出した。慈善寄付控除は一般にいつ認められるか。",
      c: [
        "When the fund makes grants to charities",
        "In the year of the contribution to the fund",
        "Spread evenly over five years",
        "Never, because the donor retains advisory privileges",
      ],
      a: 1,
      ex: "DAFへの拠出年に控除できる(慈善団体への助成は後年でもよい)。控除を特定の年に集中させる(bunching)戦略に使われる。",
    },
    {
      q: "For an individual whose activity is a hobby rather than a trade or business, current law provides that:",
      ja: "活動が事業ではなく趣味(hobby)と判断された個人について、現行法ではどうなっているか。",
      c: [
        "Hobby income is excluded and expenses are deductible",
        "Hobby income is included in gross income and hobby expenses are not deductible",
        "Both income and expenses are ignored",
        "Expenses are deductible up to hobby income as an above-the-line deduction",
      ],
      a: 1,
      ex: "TCJA以降、趣味の収入は総所得に含まれる一方、その費用は控除できない(以前の2%フロアの項目別控除が廃止されたため)。",
    },
    {
      q: "The 3.8% net investment income tax does NOT apply to:",
      ja: "3.8%の純投資所得税(NIIT)が適用されないのはどれか。",
      c: ["Interest income", "Rental income from a passive activity", "Wages", "Capital gains on stock"],
      a: 2,
      ex: "NIITは利子・配当・パッシブ活動の賃料・キャピタルゲインなどの投資所得に課される。給与・自営業の所得は対象外(追加メディケア税の対象)。",
    },
  ],
  cards: [
    ["Disqualifying disposition", "不適格処分", "ISO株式を保有要件前に売却。差額は通常所得"],
    ["Section 529 plan", "529プラン", "教育資金の非課税積立制度"],
    ["Donor-advised fund", "ドナー・アドバイズド・ファンド", "拠出年に寄付控除、助成は後で"],
  ],
});

CPA.extend("TCP-02", {
  mcq: [
    {
      q: "When a partner sells a partnership interest, the portion of the gain attributable to unrealized receivables and inventory (\"hot assets\") is treated as:",
      ja: "パートナーが持分を売却した場合、未実現債権と棚卸資産(ホット・アセット)に起因する利益部分はどう扱われるか。",
      c: ["Long-term capital gain", "Ordinary income", "Tax-exempt income", "Section 1231 gain"],
      a: 1,
      ex: "§751により、ホット・アセットに対応する部分は通常所得となり、残りがキャピタルゲインになる。",
    },
    {
      q: "In a liquidating distribution, a partner may recognize a loss only if the partner receives:",
      ja: "清算分配において、パートナーが損失を認識できるのはどのような財産のみを受け取った場合か。",
      c: [
        "Any property other than cash",
        "Only cash, unrealized receivables, and inventory, and their bases are less than the partner's outside basis",
        "Only land and buildings",
        "Property with a fair value above its basis",
      ],
      a: 1,
      ex: "現金・未実現債権・棚卸資産だけを受け取り、その合計(現金額と引継ぎ取得価額)が outside basis に満たない場合に損失を認識する。",
    },
    {
      q: "A C corporation that elects S status may owe the built-in gains tax when it:",
      ja: "S法人を選択した元C法人に含み益課税(built-in gains tax)がかかるのはどのような場合か。",
      c: [
        "Recognizes gain within the recognition period on assets that had built-in gain at conversion",
        "Pays any dividend",
        "Has more than 100 shareholders",
        "Elects a calendar year",
      ],
      a: 0,
      ex: "S法人転換時に含み益のあった資産を認識期間(5年)内に売却すると、転換時の含み益の範囲で法人段階で最高法人税率により課税される。",
    },
    {
      q: "A corporation has current E&P of $30,000 and an accumulated E&P deficit of $50,000. It distributes $40,000 to its sole shareholder. How much is a taxable dividend?",
      ja: "法人の当期E&Pは$30,000、累積E&Pは$50,000のマイナスである。唯一の株主に$40,000を分配した。課税される配当はいくらか。",
      c: ["$0", "$30,000", "$40,000", "$10,000"],
      a: 1,
      ex: "当期E&Pがプラスなら累積E&Pの欠損に関係なく当期E&Pの範囲で配当となる。$30,000が配当、残り$10,000は株式の取得価額の回収(超過分はキャピタルゲイン)。",
    },
    {
      q: "A Section 754 election allows a partnership to:",
      ja: "§754選択によってパートナーシップは何ができるか。",
      c: [
        "Avoid filing Form 1065",
        "Adjust the inside basis of partnership property upon certain transfers of interests or distributions",
        "Elect to be taxed as an S corporation",
        "Change its tax year",
      ],
      a: 1,
      ex: "§754選択により、持分の売却・相続や分配の際にパートナーシップ資産の取得価額(inside basis)を調整(§743(b)・§734(b))できる。",
    },
    {
      q: "If the IRS determines that salary paid to a shareholder-employee of a C corporation is unreasonably high, the excess is generally treated as:",
      ja: "C法人の株主兼従業員への給与が不合理に高いとIRSが判断した場合、超過分は一般にどう扱われるか。",
      c: [
        "A deductible business expense",
        "A constructive dividend that is not deductible by the corporation",
        "A loan to the shareholder",
        "A capital contribution",
      ],
      a: 1,
      ex: "不相当に高額な報酬の超過部分はみなし配当(constructive dividend)とされ、法人は損金算入できない。",
    },
  ],
  cards: [
    ["Hot assets (Section 751)", "ホット・アセット", "未実現債権・棚卸資産。売却益は通常所得"],
    ["Built-in gains tax", "含み益課税", "S法人転換後5年内の含み益実現に法人課税"],
    ["Section 754 election", "§754選択", "inside basis を調整する選択"],
    ["Constructive dividend", "みなし配当", "過大報酬などを配当として扱う"],
  ],
});

CPA.extend("TCP-03", {
  mcq: [
    {
      q: "An executor may elect the alternate valuation date for an estate only if the election:",
      ja: "遺言執行者が遺産に代替評価日を選択できるのは、その選択がどのような場合に限られるか。",
      c: [
        "Increases the value of the gross estate",
        "Decreases both the value of the gross estate and the estate tax liability",
        "Is made within 30 days of death",
        "Applies only to real estate",
      ],
      a: 1,
      ex: "代替評価日(死亡から6か月後)は、総遺産の価額と遺産税額の両方が減少する場合にのみ選択できる。期間中に処分した資産は処分日の価額。",
    },
    {
      q: "A gift of a future interest, such as a remainder interest in a trust, generally:",
      ja: "信託の残余権など将来の権利の贈与は、一般にどうなるか。",
      c: [
        "Qualifies for the annual gift tax exclusion",
        "Does not qualify for the annual gift tax exclusion",
        "Is exempt from gift tax entirely",
        "Is taxed only to the donee",
      ],
      a: 1,
      ex: "年間非課税枠は現在の権利(present interest)の贈与にのみ適用される。信託への贈与でも Crummey 条項で受益者に引出権を与えれば現在の権利とされうる。",
    },
    {
      q: "An estate must file Form 1041 if its gross income for the tax year is at least:",
      ja: "遺産財団は、課税年度の総所得がいくら以上の場合にForm 1041を提出しなければならないか。",
      c: ["$100", "$600", "$1,000", "$5,000"],
      a: 1,
      ex: "遺産財団は総所得が$600以上(または非居住外国人の受益者がいる場合)に申告が必要。",
    },
    {
      q: "A simple trust has DNI of $40,000, which includes $10,000 of tax-exempt interest. It distributes all income to its sole beneficiary. How much is taxable to the beneficiary?",
      ja: "単純信託のDNIは$40,000で、そのうち$10,000は非課税の利息である。全所得を唯一の受益者に分配した。受益者が課税されるのはいくらか。",
      c: ["$40,000", "$30,000", "$10,000", "$0"],
      a: 1,
      ex: "所得の性格は受益者に引き継がれる(導管理論)。非課税利息$10,000は受益者でも非課税なので、課税対象は$30,000。",
    },
    {
      q: "The generation-skipping transfer tax applies to transfers to:",
      ja: "世代飛び越し移転税(GST税)はどのような者への移転に適用されるか。",
      c: [
        "A spouse",
        "Children of the transferor",
        "Skip persons, such as grandchildren",
        "Qualified charities",
      ],
      a: 2,
      ex: "GST税は孫など2世代以上若い者(skip person)への移転に、贈与税・遺産税とは別に課される(非課税枠あり)。",
    },
  ],
  cards: [
    ["Alternate valuation date", "代替評価日", "死亡6か月後。総遺産と税額の両方が減る場合のみ"],
    ["Present interest", "現在の権利", "年間非課税枠の対象"],
    ["Generation-skipping transfer tax", "世代飛び越し移転税", "孫など skip person への移転に課税"],
  ],
});
