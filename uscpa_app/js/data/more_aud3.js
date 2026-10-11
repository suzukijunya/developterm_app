// AUD の追加問題(第3弾)

CPA.extend("AUD-01", {
  mcq: [
    {
      q: "Over the last three years, fees from one nonissuer attest client have grown to represent a significant portion of a small CPA firm's total revenue. Under the AICPA conceptual framework, this situation most directly creates which threat to independence?",
      ja: "過去3年間で、ある非公開の証明業務クライアントからの報酬が小規模会計事務所の総収入の大きな割合を占めるようになった。AICPAの概念的フレームワークのもとで、この状況が最も直接的に生じさせる独立性への脅威はどれか。",
      c: [
        "Self-review threat",
        "Familiarity threat",
        "Self-interest threat",
        "Management participation threat",
      ],
      a: 2,
      ex: "特定クライアントへの報酬依存は、クライアントを失いたくないという経済的利害から自己利益(self-interest)の脅威を生む。自己レビューは自らの業務結果を評価する場合、馴れ合いは長期・密接な関係の場合の脅威である。",
    },
    {
      q: "A CPA firm identifies a threat to independence for an attest client. After evaluation, the firm concludes that the threat is significant and that no safeguards can eliminate it or reduce it to an acceptable level. Under the AICPA conceptual framework, the firm should:",
      ja: "会計事務所が証明業務クライアントに対する独立性への脅威を識別した。評価の結果、脅威は重大であり、いかなるセーフガードでも除去または許容可能な水準まで低減できないと結論づけた。AICPAの概念的フレームワークのもとで、事務所はどうすべきか。",
      c: [
        "Proceed with the engagement and disclose the threat in the auditor's report",
        "Obtain written consent from the client's audit committee and proceed",
        "Decline or discontinue the attest engagement (or the service creating the threat)",
        "Assign a different engagement partner and proceed without further evaluation",
      ],
      a: 2,
      ex: "セーフガードで許容可能な水準まで低減できない場合、独立性は損なわれるため、証明業務(または脅威の原因となる業務)を辞退・中止する。報告書での開示やクライアントの同意で独立性の欠如を治癒することはできない。",
    },
    {
      q: "A covered member and a vice president of a nonissuer attest client each own 50% of a small real estate partnership, and the covered member can exercise significant influence over it. With respect to the attest client, this arrangement:",
      ja: "対象者と非公開の証明業務クライアントの副社長が、小規模な不動産パートナーシップをそれぞれ50%ずつ保有しており、対象者はそのパートナーシップに重要な影響力を行使できる。この関係は証明業務クライアントに関してどうなるか。",
      c: [
        "Impairs independence because it is a joint closely held investment that is material to the covered member",
        "Does not impair independence because the investment is not in the client itself",
        "Impairs independence only if the partnership does business with the client",
        "Does not impair independence if the vice president is not in a key position",
      ],
      a: 0,
      ex: "クライアントやその役員等と共同で支配する非公開の投資(joint closely held investment)が対象者にとって重要であれば独立性を損なう。投資先がクライアント自体でなくても、役員との共同支配関係が問題となる。",
    },
    {
      q: "A covered member owns shares of a broadly diversified mutual fund. The fund holds a small investment in an attest client, and the covered member does not control the fund's investment decisions. This investment is:",
      ja: "対象者が広く分散投資された投資信託の受益証券を保有している。その投資信託は証明業務クライアントに少額を投資しており、対象者は投資信託の投資判断を支配していない。この投資はどう扱われるか。",
      c: [
        "A direct financial interest that impairs independence regardless of amount",
        "An indirect financial interest that impairs independence only if it is material to the covered member",
        "A direct financial interest that impairs independence only if it is material",
        "Never relevant to independence because mutual funds are excluded from the rules",
      ],
      a: 1,
      ex: "分散型の投資信託を通じたクライアント持分は間接的金融持分であり、対象者にとって重要な場合のみ独立性を損なう。直接的金融持分なら金額にかかわらず独立性を損なうが、本件は投資判断を支配していないので間接持分である。",
    },
    {
      q: "Before accepting an initial audit engagement for an issuer, and at least annually thereafter, PCAOB rules require the registered firm to:",
      ja: "公開会社の初年度監査を受嘱する前、およびその後少なくとも毎年、PCAOBの規則は登録会計事務所に何を求めているか。",
      c: [
        "Obtain a written independence confirmation from the SEC",
        "Describe in writing to the audit committee all relationships that may reasonably be thought to bear on independence, discuss them, and affirm independence",
        "Publicly file a list of all nonaudit services provided to the issuer on Form AP",
        "Obtain management's written representation that the firm is independent",
      ],
      a: 1,
      ex: "PCAOB Rule 3526により、受嘱前および毎年、独立性に影響すると合理的に考えられる全ての関係を監査委員会に書面で説明し、協議し、独立性を確認する必要がある。Form APは業務執行パートナー名等の開示であり、経営者の確認書は独立性の根拠にならない。",
    },
    {
      q: "Under Government Auditing Standards (the Yellow Book), before an auditor agrees to provide a nonaudit service to an audited entity, the auditor should determine that management:",
      ja: "政府監査基準(イエローブック)のもとで、監査人が被監査主体に非監査業務を提供することに同意する前に、経営者について何を確認すべきか。",
      c: [
        "Has agreed to pay the fee for the nonaudit service in advance",
        "Has designated an individual with suitable skill, knowledge, or experience to oversee the service and will accept responsibility for its results",
        "Will allow the auditor to make decisions on its behalf to save time",
        "Has obtained approval from the cognizant federal agency",
      ],
      a: 1,
      ex: "イエローブックでは、経営者が適切なスキル・知識・経験(SKE)を有する者を監督者に指名し、業務の結果に責任を負うことが前提となる。監査人が経営判断を行うことは経営者責任の引受けとなり独立性を損なう。",
    },
    {
      q: "Under the AICPA Code, which of the following is an example of an act discreditable to the profession?",
      ja: "AICPA規範のもとで、職業の信用を失墜させる行為(act discreditable)の例はどれか。",
      c: [
        "Advertising services through a firm website with truthful fee information",
        "Accepting a referral fee from another CPA and disclosing it to the client",
        "Failing to follow the requirements of a governmental body when performing an audit for which the member agreed to follow those requirements",
        "Performing an audit for a client in an industry in which the member has limited prior experience, after obtaining necessary competence",
      ],
      a: 2,
      ex: "政府機関等が定める監査要件に従うことを引き受けながら従わないことは、信用失墜行為に該当する。真実の広告や開示した紹介料は許容され、必要な能力を習得したうえでの受嘱は問題ない。",
    },
    {
      q: "A member employed as an accounting manager in industry is instructed by the CFO to record revenue for goods that have not been shipped. The member believes the entry would result in a material misstatement. Under the subordination of judgment guidance, the member should first:",
      ja: "企業に勤務する経理マネージャーの会員が、CFOから未出荷の商品について収益を計上するよう指示された。会員はこの仕訳が重要な虚偽表示をもたらすと考えている。判断の従属(subordination of judgment)に関するガイダンスに従い、会員はまず何をすべきか。",
      c: [
        "Record the entry because the CFO bears responsibility for the financial statements",
        "Immediately report the matter to the SEC and the media",
        "Discuss the concerns with the CFO and, if unresolved, escalate to higher levels of management or those charged with governance, documenting the matter",
        "Resign from the company without communicating the reason",
      ],
      a: 2,
      ex: "まず上司と懸念を協議し、解決しなければ上位の経営者やガバナンス責任者に報告し、記録を残す。上司の指示でも誤った処理に従うことは誠実性・客観性の違反であり、直ちに外部通報や辞任を求められるわけではない(辞任は最終的に検討しうる選択肢)。",
    },
    {
      q: "Under Statement on Quality Management Standards (SQMS) No. 1, a firm's system of quality management:",
      ja: "品質管理基準書(SQMS)第1号のもとで、事務所の品質管理システムはどのようなものか。",
      c: [
        "Must follow a uniform checklist of policies that is identical for all firms regardless of size",
        "Uses a risk-based approach in which the firm establishes quality objectives, identifies and assesses quality risks, and designs responses, with the system evaluated at least annually",
        "Applies only to firms that audit issuers",
        "Is the responsibility of each engagement partner individually, with no firm-level accountability",
      ],
      a: 1,
      ex: "SQMS 1はリスク・ベースのアプローチで、品質目標の設定、品質リスクの識別・評価、対応の整備を行い、少なくとも年1回システムを評価する。画一的チェックリストではなく、非公開会社の監査等を行う全事務所に適用され、最終責任はCEO等の事務所リーダーに割り当てられる。",
    },
    {
      q: "A former audit partner of a CPA firm joins a nonissuer attest client as its CFO. The firm's independence will most likely be impaired unless, among other conditions:",
      ja: "会計事務所の元監査パートナーが非公開の証明業務クライアントのCFOに就任した。他の条件とともに、どの条件が満たされなければ事務所の独立性は損なわれる可能性が高いか。",
      c: [
        "The former partner's retirement benefits from the firm are fixed and not dependent on firm revenues, and the former partner does not participate in or influence the firm's operations",
        "The client agrees to reduce audit fees for the year",
        "The former partner had served on the engagement for at least five years",
        "The firm assigns the former partner's previous staff to the engagement",
      ],
      a: 0,
      ex: "元パートナーがクライアントの重要な職位に就く場合、事務所からの退職給付が固定額で事務所の業績に依存せず、事務所の業務に関与・影響しないことなどが条件となる。かつての部下を配置することは馴れ合いの脅威をかえって高める。",
    },
  ],
});

CPA.extend("AUD-02", {
  mcq: [
    {
      q: "Under SAS No. 145, which of the following is NOT one of the inherent risk factors the auditor considers when assessing inherent risk?",
      ja: "SAS第145号のもとで、監査人が固有リスクを評価する際に考慮する固有リスク要因に該当しないものはどれか。",
      c: [
        "Complexity",
        "Subjectivity",
        "Effectiveness of general IT controls",
        "Susceptibility to misstatement due to management bias or fraud",
      ],
      a: 2,
      ex: "SAS 145の固有リスク要因は、複雑性・主観性・変化・不確実性・経営者の偏向や不正に起因する虚偽表示の生じやすさ等である。全般IT統制の有効性は統制リスクに関する要素であり、固有リスク要因ではない。",
    },
    {
      q: "Under SAS No. 145, a significant risk is best described as an identified risk of material misstatement:",
      ja: "SAS第145号のもとで、特別な検討を必要とするリスク(significant risk)の最も適切な説明はどれか。",
      c: [
        "For which the assessment of control risk is at the maximum",
        "For which the assessment of inherent risk is close to the upper end of the spectrum of inherent risk, or that is required to be treated as significant by other AU-C sections",
        "That relates to any account balance exceeding performance materiality",
        "That management has identified in its own risk assessment process",
      ],
      a: 1,
      ex: "SAS 145では、固有リスクの程度(スペクトラム)の上限近くに評価されたリスク、または他の基準で特別な検討を要するとされるリスク(収益認識の不正リスク等)が特別な検討を必要とするリスクである。統制リスクや金額基準のみで決まるものではない。",
    },
    {
      q: "An auditor does not plan to test the operating effectiveness of controls over the existence of inventory. Under SAS No. 145, the auditor's assessment of the risk of material misstatement for this assertion should be:",
      ja: "監査人は棚卸資産の実在性に関する内部統制の運用状況の有効性を評価する予定がない。SAS第145号のもとで、このアサーションに関する重要な虚偽表示リスクの評価はどうすべきか。",
      c: [
        "Equal to the assessment of inherent risk, because control risk is assessed at the maximum",
        "Low, because the auditor will rely on substantive procedures",
        "Based on the auditor's evaluation of the design of controls only",
        "Not required, because no tests of controls will be performed",
      ],
      a: 0,
      ex: "SAS 145では固有リスクと統制リスクを区分して評価し、運用評価手続を予定しない場合、統制リスクは最大と評価されるため、重要な虚偽表示リスクは固有リスクの評価と同じになる。整備評価のみでは統制リスクを下げられない。",
    },
    {
      q: "An auditor has assessed a material account balance as having no relevant assertions with an identified risk of material misstatement. Under AICPA standards, the auditor should:",
      ja: "監査人は、ある重要な勘定残高について、重要な虚偽表示リスクが識別された関連するアサーションがないと評価した。AICPA基準のもとで、監査人はどうすべきか。",
      c: [
        "Perform no procedures on the balance",
        "Perform only tests of controls on the balance",
        "Still design and perform substantive procedures for the material account balance",
        "Document that the balance is excluded from the scope of the audit",
      ],
      a: 2,
      ex: "評価したリスクにかかわらず、重要な取引種類・勘定残高・開示等には実証手続を立案・実施しなければならない(いわゆる「スタンドバック」の考え方)。手続を全く行わない、または運用評価のみとすることは認められない。",
    },
    {
      q: "During planning, an auditor sets a threshold below which misstatements need not be accumulated because their correction would clearly have no material effect, individually or in aggregate. This threshold is referred to as:",
      ja: "計画段階で、監査人は個別にも合計しても重要な影響がないことが明らかであるため虚偽表示を集計する必要がない金額の閾値を設定する。この閾値は何と呼ばれるか。",
      c: [
        "The clearly trivial threshold",
        "Performance materiality",
        "Tolerable misstatement",
        "Specific materiality",
      ],
      a: 0,
      ex: "明らかに僅少(clearly trivial)な金額を下回る虚偽表示は集計を要しない。手続上の重要性は未発見の虚偽表示を考慮して全体の重要性より低く設定する金額で、許容虚偽表示額はサンプリングで用いる金額である。",
    },
    {
      q: "Before accepting a new nonissuer audit, the auditor learns that management intends to impose a limitation on the scope of the audit that the auditor believes would result in a disclaimer of opinion. Unless required by law or regulation, the auditor should:",
      ja: "非公開会社の新規監査を受嘱する前に、監査人は経営者が意見不表明につながる監査範囲の制約を課す意向であることを知った。法令で要求されない限り、監査人はどうすべきか。",
      c: [
        "Accept the engagement and issue a disclaimer at the end",
        "Accept the engagement and issue a qualified opinion",
        "Not accept the engagement as an audit",
        "Accept the engagement and convert it to a compilation later if needed",
      ],
      a: 2,
      ex: "受嘱前に意見不表明となる範囲制約が課されることが判明した場合、法令で要求される場合を除き、監査契約を受嘱すべきでない。限定意見は範囲制約の影響が広範でない場合であり、後で業務変更することを前提に受嘱すべきでもない。",
    },
    {
      q: "To address the risk of management override of controls, AICPA standards require the auditor to perform all of the following procedures EXCEPT:",
      ja: "経営者による内部統制の無効化リスクに対応するため、AICPA基準が監査人に要求する手続に含まれないものはどれか。",
      c: [
        "Test the appropriateness of journal entries recorded in the general ledger and other adjustments",
        "Review accounting estimates for biases that could result in material misstatement due to fraud",
        "Evaluate the business rationale for significant unusual transactions",
        "Interview all employees with access to the general ledger to obtain written fraud representations",
      ],
      a: 3,
      ex: "経営者による統制無効化への対応として、仕訳テスト、会計上の見積りの偏向の検討、通例でない重要な取引の事業上の合理性の評価の3つが必須である。総勘定元帳にアクセスできる全従業員から書面による陳述を得ることは要求されていない。",
    },
    {
      q: "With respect to laws and regulations that do NOT have a direct effect on the determination of material amounts and disclosures (for example, environmental regulations), the auditor's responsibility is to:",
      ja: "財務諸表の重要な金額や開示の決定に直接的な影響を及ぼさない法令(例:環境規制)について、監査人の責任はどれか。",
      c: [
        "Obtain sufficient appropriate audit evidence of compliance with all such laws",
        "Perform specified procedures, such as inquiry of management and inspection of correspondence with regulators, that may identify noncompliance",
        "Provide an opinion on the entity's compliance with such laws",
        "Ignore such laws, because they are outside the scope of a financial statement audit",
      ],
      a: 1,
      ex: "間接的な影響を持つ法令については、経営者への質問や規制当局との往復文書の閲覧など、違反の識別に役立つ特定の手続を実施する。十分かつ適切な監査証拠の入手が求められるのは直接的な影響を持つ法令であり、遵守について意見を表明するわけではない。",
    },
    {
      q: "A prospective successor auditor receives permission from the client to contact the predecessor auditor, but the predecessor declines to respond fully to the successor's inquiries, citing pending litigation. The successor should:",
      ja: "後任監査人候補はクライアントから前任監査人への問合せの許可を得たが、前任監査人は係争中の訴訟を理由に質問への十分な回答を拒否した。後任監査人はどうすべきか。",
      c: [
        "Automatically decline the engagement",
        "Report the predecessor to the state board of accountancy",
        "Accept the engagement without further consideration, since the client gave permission",
        "Consider the implications of the limited response in deciding whether to accept the engagement",
      ],
      a: 3,
      ex: "前任監査人が訴訟等を理由に回答を制限した場合、その旨を示すべきであり、後任監査人は限定的な回答の影響を受嘱の判断において考慮する。自動的に辞退する必要はなく、無条件に受嘱すべきでもない。",
    },
    {
      q: "In applying the risk assessment standard, the auditor determines that an entity recently implemented a new revenue system and began selling bundled products with variable consideration. These changes most directly affect the auditor's assessment of:",
      ja: "リスク評価基準を適用する中で、監査人は企業が最近新しい収益システムを導入し、変動対価を伴う複合製品の販売を開始したことを把握した。これらの変化が最も直接的に影響するのは、監査人のどの評価か。",
      c: [
        "Detection risk at the financial statement level only",
        "Inherent risk, through the factors of change, complexity, and subjectivity",
        "The auditor's independence",
        "Materiality for the financial statements as a whole, which must be reduced to zero",
      ],
      a: 1,
      ex: "新システム導入や変動対価を伴う新取引は、変化・複雑性・主観性といった固有リスク要因を通じて固有リスクを高める。発見リスクは評価結果に応じて監査人が設定するものであり、独立性や重要性をゼロにすることとは無関係である。",
    },
  ],
});

CPA.extend("AUD-03", {
  mcq: [
    {
      q: "Under SAS No. 145, the auditor is required to evaluate the design and determine the implementation of certain controls in the control activities component. Which of the following is NOT among those required controls?",
      ja: "SAS第145号のもとで、監査人は統制活動の構成要素のうち一定の内部統制について、整備状況を評価し業務への適用を判断しなければならない。次のうち、その対象に含まれないものはどれか。",
      c: [
        "Controls that address a significant risk",
        "Controls over journal entries, including nonstandard entries",
        "Controls whose operating effectiveness the auditor plans to test",
        "Every control the entity has documented in its policies manual",
      ],
      a: 3,
      ex: "SAS 145で整備・適用の評価が求められるのは、特別な検討を必要とするリスクに対応する統制、仕訳に関する統制、運用評価を予定する統制、それらに関連する全般IT統制などである。企業が文書化した全ての統制を評価する必要はない。",
    },
    {
      q: "An auditor makes inquiries of the controller and inspects documentation of a monthly account reconciliation control for one month. These procedures primarily provide evidence about:",
      ja: "監査人は財務担当責任者(コントローラー)に質問し、月次の勘定照合統制の1か月分の文書を閲覧した。これらの手続が主に提供する証拠はどれか。",
      c: [
        "The design and implementation of the control",
        "The operating effectiveness of the control throughout the period",
        "The completeness of all account balances",
        "The absence of fraud in the reconciled accounts",
      ],
      a: 0,
      ex: "質問と1時点の文書閲覧は、統制が適切に整備され業務に適用されているか(整備・適用)の証拠となる。期間を通じた運用状況の有効性を示すには、期間全体から適切なサンプルを抽出した運用評価手続が必要である。",
    },
    {
      q: "An auditor tested an automated three-way match control in the prior year and found it effective. In the current year, which condition best supports the auditor testing the automated control with minimal procedures (benchmarking) rather than a full retest?",
      ja: "監査人は前年に自動化された3点照合統制をテストし、有効と判断した。当年度において、全面的な再テストではなく最小限の手続(ベンチマーキング)で自動化統制を評価することを最も支持する状況はどれか。",
      c: [
        "The control is performed manually by an experienced clerk",
        "General IT controls, particularly program change controls, are effective and the program has not changed",
        "The entity's revenue increased significantly",
        "Management represents that the control works",
      ],
      a: 1,
      ex: "自動化統制は、プログラム変更管理などの全般IT統制が有効でプログラムが変更されていなければ、一貫して機能すると期待でき、ベンチマーキングが可能になる。手作業の統制や経営者の陳述だけでは根拠にならない。",
    },
    {
      q: "A user auditor obtains a Type 2 SOC 1 report on a payroll service organization. The report lists complementary user entity controls (CUECs). The user auditor should:",
      ja: "利用者監査人は給与計算受託会社のSOC 1タイプ2報告書を入手した。報告書には相補的なユーザー統制(CUEC)が記載されている。利用者監査人はどうすべきか。",
      c: [
        "Ignore the CUECs because the service auditor tested them",
        "Evaluate whether the user entity has designed and implemented (and, if relying, tested) the CUECs relevant to the audit",
        "Request that the service auditor test the user entity's controls",
        "Treat the SOC 1 report as a substitute for all substantive procedures on payroll",
      ],
      a: 1,
      ex: "CUECは委託会社(ユーザー企業)側で実施されるべき統制であり、受託会社監査人はテストしない。利用者監査人がユーザー企業での整備・適用(依拠する場合は運用)を評価する必要がある。SOC 1報告書は実証手続を全て代替するものではない。",
    },
    {
      q: "Which of the following functions should be segregated from the purchasing department to provide the most effective control over purchases?",
      ja: "購買に関する内部統制を最も有効にするため、購買部門から分離すべき機能はどれか。",
      c: [
        "Preparing purchase orders based on approved requisitions",
        "Selecting vendors from an approved vendor list",
        "Receiving goods and preparing receiving reports",
        "Negotiating prices with vendors",
      ],
      a: 2,
      ex: "検収(物品の受入れと受入報告書の作成)は資産の保管に関わり、発注を行う購買部門から独立させるべきである。発注書の作成、仕入先選定、価格交渉は購買部門の本来の機能である。",
    },
    {
      q: "Under PCAOB AS 2201, a walkthrough performed in an integrated audit involves:",
      ja: "PCAOB AS 2201のもとで、統合監査において実施するウォークスルーとはどのような手続か。",
      c: [
        "Following a transaction from origination through the company's processes until it is reflected in the financial records, using the same documents and technology as company personnel",
        "Physically walking through the client's facilities to observe inventory",
        "Testing a statistical sample of 60 transactions for operating effectiveness",
        "Reviewing the minutes of all board meetings for the year",
      ],
      a: 0,
      ex: "ウォークスルーは、取引の発生から財務記録への反映までを、会社の担当者と同じ書類や技術を用いて追跡する手続で、虚偽表示の発生源の理解や統制の整備評価に有効である。棚卸立会やサンプルによる運用評価とは異なる。",
    },
    {
      q: "In an integrated audit, which of the following is an indicator of a material weakness in internal control over financial reporting?",
      ja: "統合監査において、財務報告に係る内部統制の重要な不備(material weakness)の兆候となるものはどれか。",
      c: [
        "The company's controls did not detect a material misstatement that the auditor identified during the audit",
        "The company uses a third-party service organization for payroll",
        "A single immaterial error in an expense account was found and corrected by management's review",
        "The company recently hired a new controller with relevant experience",
      ],
      a: 0,
      ex: "会社の内部統制では発見できなかった重要な虚偽表示を監査人が識別した場合は、重要な不備の兆候である。他に、上級経営者の不正、過年度の訂正再表示、監査委員会の監督が有効でないことなども兆候とされる。受託会社の利用や軽微な誤謬の自主的訂正は該当しない。",
    },
    {
      q: "An auditor selects a sample of sales invoices and, for each, both examines evidence of credit approval and recomputes the invoice amount and agrees it to the ledger. This is best described as a:",
      ja: "監査人は売上請求書のサンプルを抽出し、各請求書について与信承認の証跡を確かめるとともに、請求金額を再計算して元帳と照合した。この手続は何と呼ばれるか。",
      c: [
        "Walkthrough",
        "Dual-purpose test",
        "Substantive analytical procedure",
        "Test of the control environment",
      ],
      a: 1,
      ex: "同一のサンプルで統制の運用評価(与信承認の証跡)と詳細テスト(金額の再計算・照合)を同時に行う手続は、二重目的テスト(dual-purpose test)である。分析的実証手続は財務データ間の関係を利用する手続である。",
    },
    {
      q: "The internal audit function performs periodic evaluations of whether the entity's controls are operating as intended and reports deficiencies to the audit committee. Under the COSO framework, this activity is part of which component?",
      ja: "内部監査部門は、企業の内部統制が意図どおりに運用されているかを定期的に評価し、不備を監査委員会に報告している。COSOフレームワークのもとで、この活動はどの構成要素に該当するか。",
      c: [
        "Control environment",
        "Risk assessment",
        "Information and communication",
        "Monitoring activities",
      ],
      a: 3,
      ex: "内部統制が機能しているかを継続的・独立的に評価し、不備を適時に伝達する活動はモニタリング活動に該当する。統制環境は組織の気風や誠実性・倫理観など、リスク評価は目的達成を阻害するリスクの識別・分析である。",
    },
    {
      q: "An auditor obtained evidence about the operating effectiveness of controls during an interim period (January through September) of a calendar-year audit. To rely on those controls for the full year, the auditor should:",
      ja: "暦年決算の監査で、監査人は期中(1月から9月)における内部統制の運用状況の有効性について証拠を入手した。通期でこの統制に依拠するために、監査人はどうすべきか。",
      c: [
        "Do nothing further, because interim evidence covers the full year",
        "Obtain evidence about significant changes to the controls after the interim period and determine what additional evidence is needed for the remaining period",
        "Retest all controls as of December 31 using the same sample size",
        "Obtain a written representation from management only",
      ],
      a: 1,
      ex: "期中の運用評価に依拠する場合、残余期間における統制の重要な変更の有無について証拠を入手し、残余期間に必要な追加証拠(残余期間の長さやリスク等を考慮)を決定する。期中証拠だけで通期をカバーできず、同規模の全面再テストが必須でもない。",
    },
  ],
});

CPA.extend("AUD-04", {
  mcq: [
    {
      q: "An auditor plans to use a system-generated aging report produced by the client as the population for testing the allowance for doubtful accounts. Under SAS No. 142, the auditor should:",
      ja: "監査人は、貸倒引当金のテストの母集団として、クライアントのシステムが作成した年齢調べ表を利用する予定である。SAS第142号のもとで、監査人はどうすべきか。",
      c: [
        "Accept the report as reliable because it was system-generated",
        "Use the report only if it was prepared by the internal audit function",
        "Obtain only management's representation that the report is complete",
        "Evaluate whether the information is sufficiently reliable, including obtaining evidence about its accuracy and completeness",
      ],
      a: 3,
      ex: "企業が作成した情報(IPE)を監査証拠として利用する場合、正確性と網羅性を含め、目的に照らして十分に信頼できるかを評価する必要がある。システム出力だからといって無条件に信頼できるわけではなく、経営者の陳述だけでは不十分である。",
    },
    {
      q: "Under SAS No. 142, when evaluating whether sufficient appropriate audit evidence has been obtained, the auditor should:",
      ja: "SAS第142号のもとで、十分かつ適切な監査証拠を入手したかを評価する際、監査人はどうすべきか。",
      c: [
        "Consider only evidence that corroborates management's assertions",
        "Consider all relevant audit evidence, regardless of whether it appears to corroborate or contradict the assertions",
        "Disregard evidence obtained using automated tools and techniques",
        "Rely primarily on oral representations from management",
      ],
      a: 1,
      ex: "SAS 142では、アサーションを裏付けるか矛盾するかにかかわらず、全ての関連する監査証拠を考慮し、職業的懐疑心を保持して評価する。自動化ツールによる証拠も適切に利用でき、口頭の陳述は単独では十分な証拠とならない。",
    },
    {
      q: "Under AICPA standards on auditing accounting estimates, the primary purpose of a retrospective review of the outcome of prior-period accounting estimates is to:",
      ja: "会計上の見積りの監査に関するAICPA基準のもとで、前期の会計上の見積りの結果を遡及的に検討(retrospective review)する主な目的はどれか。",
      c: [
        "Call into question the auditor's professional judgments made in the prior period",
        "Restate the prior-period financial statements for any differences",
        "Assist in identifying and assessing risks of material misstatement, including indications of possible management bias",
        "Determine the auditor's fee for the current year",
      ],
      a: 2,
      ex: "遡及的検討は、見積りプロセスの有効性や経営者の偏向の兆候を把握し、当期のリスク識別・評価に役立てるために行う。過年度の判断を問題視することや、差異について過年度を修正再表示することが目的ではない。",
    },
    {
      q: "An auditor is concerned that accounts payable may be understated. The most effective direction of testing is to select items from:",
      ja: "監査人は買掛金が過少計上されている可能性を懸念している。最も有効なテストの方向はどれか。",
      c: [
        "Receiving reports and vendor statements and trace them to the accounts payable records",
        "The accounts payable subsidiary ledger and vouch them to vendor invoices",
        "The general ledger and recompute the totals",
        "Paid checks issued before year-end and vouch them to the ledger",
      ],
      a: 0,
      ex: "過少計上(網羅性)を検証するには、記録の外にある証拠源(検収報告書・仕入先の請求明細書)から帳簿へ追跡(trace)する。帳簿から証憑への証憑突合(vouch)は過大計上(実在性)の検証に有効である。",
    },
    {
      q: "Management refuses to allow the auditor to send a confirmation request to a major customer, citing an ongoing dispute. The auditor should FIRST:",
      ja: "経営者は、係争中であることを理由に、主要な得意先への確認状の発送を監査人に認めなかった。監査人はまず何をすべきか。",
      c: [
        "Immediately issue a disclaimer of opinion",
        "Send the confirmation anyway without management's knowledge",
        "Inquire about management's reasons and seek evidence about their validity and reasonableness",
        "Accept management's refusal and perform no further procedures on the account",
      ],
      a: 2,
      ex: "経営者が確認を拒否した場合、まず理由を質問し、その妥当性・合理性について証拠を求め、不正リスク評価への影響を検討したうえで代替手続を実施する。理由が不合理なら統治責任者に伝達し、範囲制約として意見への影響を判断する。直ちに意見不表明とするわけではない。",
    },
    {
      q: "A client's inventory is held in a public warehouse operated by an independent third party and is material to the financial statements. The auditor would most likely:",
      ja: "クライアントの棚卸資産は独立した第三者が運営する営業倉庫に保管されており、財務諸表上重要である。監査人が最も実施する可能性の高い手続はどれか。",
      c: [
        "Rely solely on the client's perpetual inventory records",
        "Obtain a management representation only",
        "Exclude the inventory from the audit because the client does not physically hold it",
        "Obtain confirmation from the warehouse custodian and/or perform inspection or other procedures as appropriate",
      ],
      a: 3,
      ex: "第三者が保管する重要な棚卸資産については、保管者への確認や、必要に応じた実地棚卸の立会・視察等の手続で実在性と状態の証拠を得る。クライアントの帳簿記録や経営者の陳述だけでは不十分である。",
    },
    {
      q: "A client's legal counsel refuses to respond to the auditor's letter of inquiry about a material pending lawsuit, and the auditor cannot obtain sufficient appropriate evidence by alternative procedures. This most likely results in:",
      ja: "クライアントの顧問弁護士は、係争中の重要な訴訟に関する監査人の照会状への回答を拒否し、監査人は代替手続でも十分かつ適切な証拠を入手できなかった。最も可能性の高い結果はどれか。",
      c: [
        "An unmodified opinion with an emphasis-of-matter paragraph",
        "A scope limitation leading to a qualified opinion or disclaimer of opinion",
        "An adverse opinion",
        "No effect on the auditor's report",
      ],
      a: 1,
      ex: "弁護士の回答拒否で十分な証拠が得られない場合は監査範囲の制約となり、影響の重要性・広範性に応じて限定意見または意見不表明となる。不適正意見は財務諸表に重要かつ広範な虚偽表示がある場合である。",
    },
    {
      q: "Under PCAOB AS 1215, Audit Documentation, a complete and final set of audit documentation should be assembled for retention no later than how many days after the report release date?",
      ja: "PCAOB AS 1215(監査調書)のもとで、完全かつ最終的な監査調書は、報告書の発行日からいつまでに保存のために整理しなければならないか。",
      c: [
        "14 days",
        "45 days",
        "60 days",
        "90 days",
      ],
      a: 1,
      ex: "PCAOB基準では、報告書発行日から45日以内に最終的な監査調書を整理し、7年間保存する。AICPA基準(非公開会社)では60日以内に整理し、5年以上保存する。",
    },
    {
      q: "In substantive testing using sampling, the risk of incorrect acceptance relates to the:",
      ja: "サンプリングを用いた実証手続において、誤った受入れのリスク(risk of incorrect acceptance)が関係するのはどれか。",
      c: [
        "Effectiveness of the audit",
        "Efficiency of the audit",
        "Selection of the sampling unit",
        "Nonsampling risk only",
      ],
      a: 0,
      ex: "誤った受入れのリスクは、重要な虚偽表示があるのに勘定を適正と結論づけるリスクで、監査の有効性に関係する。誤った棄却のリスクは追加の作業を招くため効率性に関係する。",
    },
    {
      q: "An auditor performs substantive tests of details of accounts receivable as of October 31 (an interim date) for a December 31 year-end client. To extend the conclusions to year-end, the auditor should:",
      ja: "12月決算のクライアントについて、監査人は期中の10月31日時点で売掛金の詳細テストを実施した。結論を期末まで拡張するために、監査人はどうすべきか。",
      c: [
        "Perform no further work, because interim substantive tests cover the full year",
        "Repeat the identical confirmation procedures at December 31 in all cases",
        "Obtain management's representation that no significant changes occurred",
        "Perform substantive procedures, or substantive procedures combined with tests of controls, covering the remaining period",
      ],
      a: 3,
      ex: "期中に実証手続を行った場合、残余期間について実証手続(または運用評価と組み合わせた実証手続)を実施し、期中の結論を期末まで拡張する(ロールフォワード)。経営者の陳述のみでは不十分で、常に同一の確認を再実施する必要もない。",
    },
  ],
});

CPA.extend("AUD-05", {
  mcq: [
    {
      q: "Under the auditor's report format required by SAS No. 134 for nonissuers, which section appears FIRST in the auditor's report?",
      ja: "SAS第134号が非公開会社に求める監査報告書の様式において、最初に記載される区分はどれか。",
      c: [
        "Basis for Opinion",
        "Responsibilities of Management for the Financial Statements",
        "Opinion",
        "Auditor's Responsibilities for the Audit of the Financial Statements",
      ],
      a: 2,
      ex: "SAS 134の様式では「意見」区分が冒頭に置かれ、その直後に独立性や倫理要件の遵守の記載を含む「意見の根拠」区分が続く。経営者の責任・監査人の責任はその後に記載される。",
    },
    {
      q: "Under PCAOB AS 3101, a critical audit matter (CAM) is a matter arising from the audit that was communicated or required to be communicated to the audit committee and that:",
      ja: "PCAOB AS 3101のもとで、監査上の主要な事項(CAM)とは、監査から生じた事項で監査委員会に伝達した(または伝達が求められた)ものであって、さらにどのような事項か。",
      c: [
        "Relates to any account, regardless of materiality, and involved a disagreement with management",
        "Relates to accounts or disclosures that are material to the financial statements and involved especially challenging, subjective, or complex auditor judgment",
        "Represents a deficiency in internal control over financial reporting",
        "Was identified by management as a significant risk in its MD&A",
      ],
      a: 1,
      ex: "CAMは、①監査委員会に伝達した(すべき)事項で、②財務諸表上重要な勘定・開示に関連し、③特に困難・主観的・複雑な監査人の判断を伴ったものである。経営者との意見相違や内部統制の不備そのものが要件ではない。",
    },
    {
      q: "A nonissuer's financial statements are fairly presented and include adequate disclosure of a major fire that destroyed a key production facility after year-end. The auditor believes the matter is fundamental to users' understanding. The auditor should most likely:",
      ja: "非公開会社の財務諸表は適正に表示されており、期末後に主要な生産施設を焼失させた大規模火災について適切に開示している。監査人はこの事項が利用者の理解にとって基本的に重要であると考えている。監査人が最も行う可能性の高い対応はどれか。",
      c: [
        "Include an emphasis-of-matter paragraph referring to the disclosure, with an unmodified opinion",
        "Issue a qualified opinion",
        "Include an other-matter paragraph describing the fire",
        "Issue a disclaimer of opinion",
      ],
      a: 0,
      ex: "財務諸表に適切に表示・開示されている事項で利用者の理解に基本的に重要なものは、強調事項(emphasis-of-matter)区分で注意喚起し、無限定意見とする。その他の事項区分は財務諸表に表示・開示されていない事項に用いる。",
    },
    {
      q: "Based on its evaluation, the auditor concludes that management's plans alleviate the substantial doubt that initially existed about the entity's ability to continue as a going concern, and the plans are adequately disclosed. The auditor's report should:",
      ja: "評価の結果、監査人は当初存在した継続企業の前提に関する重要な疑義が経営者の対応策によって解消されたと判断し、その対応策は適切に開示されている。監査報告書はどうすべきか。",
      c: [
        "Include a separate section titled 'Substantial Doubt About the Entity's Ability to Continue as a Going Concern'",
        "Express a qualified opinion",
        "Not be required to include a going concern section, although the auditor may include an emphasis-of-matter paragraph",
        "Express an adverse opinion",
      ],
      a: 2,
      ex: "重要な疑義が経営者の対応策により解消された場合、継続企業に関する独立区分は要求されない(必要に応じ強調事項区分を記載することは可能)。重要な疑義が残る場合に独立区分の記載が必要となる。",
    },
    {
      q: "In a preparation engagement under SSARS, the accountant prepares financial statements for a nonissuer. The accountant is required to:",
      ja: "SSARSに基づく財務諸表作成業務(preparation engagement)において、会計士は非公開会社の財務諸表を作成する。会計士に求められることはどれか。",
      c: [
        "Issue a compilation report on the financial statements",
        "Perform analytical procedures and inquiries to obtain limited assurance",
        "Be independent of the entity",
        "Include a statement on each page indicating that no assurance is provided, or issue a disclaimer report",
      ],
      a: 3,
      ex: "作成業務では報告書は不要だが、各ページに「保証は提供されない」旨を表示する(表示できない場合は意見不表明の報告書を発行する等)。独立性は要求されず、質問・分析的手続による限定的保証はレビュー業務である。",
    },
    {
      q: "During a review of a nonissuer's financial statements under SSARS, the accountant identifies a material departure from GAAP that management refuses to correct. The departure is not so pervasive that the financial statements are misleading as a whole. The accountant should:",
      ja: "SSARSに基づく非公開会社の財務諸表のレビューで、会計士は経営者が修正を拒否する重要なGAAPからの逸脱を識別した。その逸脱は財務諸表全体を誤解させるほど広範ではない。会計士はどうすべきか。",
      c: [
        "Issue an adverse review conclusion",
        "Modify the review report by including a separate section disclosing the departure",
        "Issue an unmodified review report because a review provides only limited assurance",
        "Convert the engagement to an audit",
      ],
      a: 1,
      ex: "レビューでGAAPからの重要な逸脱が修正されない場合、レビュー報告書に逸脱を開示する区分を設けて報告書を修正する。限定的保証であることを理由に無修正とはできず、監査への切替えも不要である。逸脱が全体として誤解を招く場合は業務からの撤退を検討する。",
    },
    {
      q: "Under the AICPA attestation standards for agreed-upon procedures (as revised by SSAE No. 19), which of the following is required?",
      ja: "AICPAの合意された手続業務に関する証明基準(SSAE第19号で改訂)のもとで、要求されることはどれか。",
      c: [
        "The practitioner must express limited assurance on the subject matter",
        "All intended users must sign the engagement letter before any procedures are performed",
        "The engaging party must acknowledge that the procedures performed are appropriate for the intended purpose",
        "The practitioner must obtain a written assertion from the responsible party in all cases",
      ],
      a: 2,
      ex: "SSAE 19では、依頼者(engaging party)が手続の適切性を認めることが求められ、実施者は手続と発見事項を報告するだけで保証は提供しない。全利用者の事前同意は不要となり、責任当事者からのアサーションも必須ではない。",
    },
    {
      q: "A nonissuer's financial statements are prepared in accordance with the cash basis of accounting, and the auditor concludes they are fairly presented in accordance with that basis. The auditor's report should include:",
      ja: "非公開会社の財務諸表は現金主義会計に基づき作成されており、監査人はその基準に準拠して適正に表示されていると結論づけた。監査報告書に含めるべきものはどれか。",
      c: [
        "A qualified opinion due to the departure from GAAP",
        "An adverse opinion, because the financial statements are not in accordance with GAAP",
        "An other-matter paragraph stating that GAAP financial statements were not presented",
        "An emphasis-of-matter paragraph alerting users that the statements are prepared on a special purpose framework",
      ],
      a: 3,
      ex: "特別目的の財務報告の枠組み(現金主義など)による財務諸表の監査報告書には、作成基準を記述する注記に注意を促し、GAAP以外の基準であることを示す強調事項区分を含める。枠組みに準拠していればGAAPとの相違を理由に限定・不適正とはしない。",
    },
    {
      q: "After the report release date, an auditor concludes that an auditing procedure considered necessary at the time of the audit was omitted. The auditor should FIRST:",
      ja: "報告書の発行日後、監査人は監査時点で必要と考えられた監査手続が省略されていたと判断した。監査人がまず行うべきことはどれか。",
      c: [
        "Assess the importance of the omitted procedure to the auditor's present ability to support the previously expressed opinion",
        "Notify all users that the report should no longer be relied upon",
        "Withdraw the auditor's report and reissue a disclaimer of opinion",
        "Do nothing, because the report has already been released",
      ],
      a: 0,
      ex: "手続の省略が判明した場合、まず省略が現時点で過去の意見を裏付ける能力にどの程度影響するかを評価し、影響する場合は省略した手続または代替手続を実施する。直ちに利用者への通知や報告書の撤回を行うわけではない。",
    },
    {
      q: "Comparative financial statements are presented. The prior-period financial statements were audited by a predecessor auditor whose report is NOT reissued. The successor auditor's report on the current period should:",
      ja: "比較財務諸表が表示されている。前期の財務諸表は前任監査人が監査しており、その監査報告書は再発行されない。当期に関する後任監査人の監査報告書はどうすべきか。",
      c: [
        "Include an other-matter paragraph stating that the prior period was audited by a predecessor, the type of opinion expressed, and the date of that report",
        "Express an opinion on both periods without any reference to the predecessor",
        "Include an emphasis-of-matter paragraph naming the predecessor firm",
        "Disclaim an opinion on the current period",
      ],
      a: 0,
      ex: "前任監査人の報告書が再発行されない場合、後任監査人はその他の事項区分で、前期は前任監査人が監査したこと、意見の種類(修正があれば理由)、報告書日付を記載する。前任監査人の事務所名は通常記載しない。",
    },
  ],
});

CPA.tbs({
  id: "TBS-AUD-05",
  section: "AUD",
  chapter: "AUD-04",
  title: "金額単位サンプリング(MUS)の評価",
  scenario: `<p>An auditor uses monetary unit sampling (MUS) to test the existence of accounts receivable with a recorded balance of <b>$2,000,000</b>. Tolerable misstatement is <b>$180,000</b>, and the risk of incorrect acceptance is 5%. The sampling interval is <b>$50,000</b>. The following misstatements were found:</p>
<table><tr><th>Item</th><th>Book value</th><th>Audit value</th></tr>
<tr><td>A</td><td>$10,000</td><td>$8,000</td></tr>
<tr><td>B</td><td>$60,000</td><td>$54,000</td></tr>
<tr><td>C</td><td>$25,000</td><td>$20,000</td></tr></table>
<p>Reliability factors at 5% risk of incorrect acceptance: 0 misstatements = <b>3.00</b>; 1 = <b>4.75</b>; 2 = <b>6.30</b>. Incremental allowance is computed as (incremental change in reliability factor − 1) × projected misstatement, with projected misstatements ranked from largest to smallest (equal amounts may be taken in either order).</p>
<p class="ja">監査人は金額単位サンプリング(MUS)を用いて、帳簿残高$2,000,000の売掛金の実在性をテストする。許容虚偽表示額は$180,000、誤った受入れのリスクは5%、サンプリング間隔は$50,000である。上表の虚偽表示が発見された。誤った受入れのリスク5%の信頼係数は、虚偽表示0件=3.00、1件=4.75、2件=6.30。追加許容額は(信頼係数の増分 − 1)× 推定虚偽表示額で計算し、推定虚偽表示額は大きい順に並べる(同額の場合は順不同)。</p>`,
  rows: [
    { label: "Projected misstatement for item A(項目Aの推定虚偽表示額)", type: "num", answer: 10000 },
    { label: "Projected misstatement for item B(項目Bの推定虚偽表示額)", type: "num", answer: 6000 },
    { label: "Total projected misstatement(推定虚偽表示額の合計)", type: "num", answer: 26000 },
    { label: "Basic precision(基礎精度)", type: "num", answer: 150000 },
    { label: "Upper misstatement limit(虚偽表示の上限額)", type: "num", answer: 189000 },
    {
      label: "Conclusion(結論)",
      type: "select",
      options: [
        "Accept: the balance is not materially misstated",
        "Do not accept: the upper misstatement limit exceeds tolerable misstatement",
        "Accept: total projected misstatement is less than tolerable misstatement",
        "Inconclusive: MUS cannot be used for overstatement testing",
      ],
      answer: "Do not accept: the upper misstatement limit exceeds tolerable misstatement",
    },
  ],
  explain: `<p>項目A:帳簿価額がサンプリング間隔未満なので、汚染率(tainting)= 2,000 ÷ 10,000 = 20% → 推定 50,000 × 20% = 10,000。項目C:5,000 ÷ 25,000 = 20% → 10,000。</p>
<p>項目B:帳簿価額がサンプリング間隔以上なので、実際の虚偽表示 6,000 をそのまま用いる(追加許容額の計算には含めない)。推定虚偽表示額合計 = 10,000 + 6,000 + 10,000 = 26,000。</p>
<p>基礎精度 = 3.00 × 50,000 = 150,000。追加許容額 = (4.75 − 3.00 − 1)× 10,000 + (6.30 − 4.75 − 1)× 10,000 = 7,500 + 5,500 = 13,000。</p>
<p>上限額 = 26,000 + 150,000 + 13,000 = 189,000 > 許容虚偽表示額 180,000 のため、残高は受け入れられない(推定額だけで判断するのは誤り)。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-06",
  section: "AUD",
  chapter: "AUD-05",
  title: "監査報告書への影響(区分・段落の選択)",
  scenario: `<p>For each independent situation in a nonissuer audit under AICPA standards, select the most appropriate effect on the auditor's report. Assume each item is material unless stated otherwise.</p>
<p class="ja">AICPA基準による非公開会社の監査において、以下のそれぞれ独立した状況について、監査報告書への最も適切な影響を選択せよ。特に記載がない限り、各事項は重要であるとする。</p>`,
  rows: [
    {
      label: "Substantial doubt about going concern remains after considering management's plans, and disclosure is adequate(経営者の対応策を考慮しても継続企業の前提に関する重要な疑義が残り、開示は適切)",
      type: "select",
      options: ["No change to the report", "Emphasis-of-matter paragraph", "Other-matter paragraph", "Separate going concern section", "Qualified opinion", "Disclaimer of opinion"],
      answer: "Separate going concern section",
    },
    {
      label: "The entity changed its method of inventory costing; the change is justified and properly accounted for and disclosed(棚卸資産の評価方法を変更し、正当な理由があり適切に会計処理・開示されている)",
      type: "select",
      options: ["No change to the report", "Emphasis-of-matter paragraph", "Other-matter paragraph", "Separate going concern section", "Qualified opinion", "Disclaimer of opinion"],
      answer: "Emphasis-of-matter paragraph",
    },
    {
      label: "Prior-year comparative statements were audited by a predecessor whose report is not reissued(前期の比較財務諸表は前任監査人が監査し、その報告書は再発行されない)",
      type: "select",
      options: ["No change to the report", "Emphasis-of-matter paragraph", "Other-matter paragraph", "Separate going concern section", "Qualified opinion", "Disclaimer of opinion"],
      answer: "Other-matter paragraph",
    },
    {
      label: "The auditor could not observe the count of inventory at one of several warehouses; the possible effect is material but not pervasive, and alternative procedures were not possible(複数倉庫のうち1か所で棚卸立会ができず、代替手続も不可能。影響は重要だが広範ではない)",
      type: "select",
      options: ["No change to the report", "Emphasis-of-matter paragraph", "Other-matter paragraph", "Separate going concern section", "Qualified opinion", "Disclaimer of opinion"],
      answer: "Qualified opinion",
    },
    {
      label: "Management refuses to provide written representations acknowledging its responsibility for the financial statements(経営者が財務諸表に対する責任を認める経営者確認書の提出を拒否した)",
      type: "select",
      options: ["No change to the report", "Emphasis-of-matter paragraph", "Other-matter paragraph", "Separate going concern section", "Qualified opinion", "Disclaimer of opinion"],
      answer: "Disclaimer of opinion",
    },
    {
      label: "Uncorrected misstatements, individually and in aggregate, are clearly immaterial(未修正の虚偽表示は個別にも合計でも明らかに重要でない)",
      type: "select",
      options: ["No change to the report", "Emphasis-of-matter paragraph", "Other-matter paragraph", "Separate going concern section", "Qualified opinion", "Disclaimer of opinion"],
      answer: "No change to the report",
    },
  ],
  explain: `<p>① 重要な疑義が残り開示が適切なら、意見は無限定のまま「継続企業の前提に関する重要な疑義」の独立区分を設ける。</p>
<p>② 会計方針の変更(首尾一貫性)は、適切に処理・開示されていても強調事項区分で注意喚起する。</p>
<p>③ 再発行されない前任監査人の報告書については、その他の事項区分で前任監査人の監査・意見の種類・日付を記載する。</p>
<p>④ 範囲制約の影響が重要だが広範でない場合は限定意見(広範なら意見不表明)。</p>
<p>⑤ 経営者の責任に関する確認書が得られない場合は、経営者の誠実性に疑義が生じるため意見不表明とする。</p>
<p>⑥ 重要でない未修正の虚偽表示は報告書に影響しない(統治責任者への伝達は必要)。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-07",
  section: "AUD",
  chapter: "AUD-03",
  title: "内部統制の不備とCOSO構成要素",
  scenario: `<p>During the audit of Hayashi Corp., the auditor identified the following deficiencies. For each, select the COSO internal control component to which the deficiency most directly relates.</p>
<p class="ja">Hayashi社の監査中に、監査人は以下の不備を識別した。それぞれについて、不備が最も直接的に関係するCOSOの内部統制の構成要素を選択せよ。</p>`,
  rows: [
    {
      label: "The board has no independent directors, and the audit committee met only once during the year(取締役会に独立取締役がおらず、監査委員会は年1回しか開催されなかった)",
      type: "select",
      options: ["Control environment", "Risk assessment", "Control activities", "Information and communication", "Monitoring activities"],
      answer: "Control environment",
    },
    {
      label: "Management did not analyze how a new ERP implementation and a new overseas subsidiary could affect financial reporting(経営者は新ERPの導入と新たな海外子会社が財務報告に与える影響を分析しなかった)",
      type: "select",
      options: ["Control environment", "Risk assessment", "Control activities", "Information and communication", "Monitoring activities"],
      answer: "Risk assessment",
    },
    {
      label: "The same employee can add new vendors to the master file and approve vendor payments(同一の従業員が仕入先マスターへの新規登録と支払承認を行える)",
      type: "select",
      options: ["Control environment", "Risk assessment", "Control activities", "Information and communication", "Monitoring activities"],
      answer: "Control activities",
    },
    {
      label: "There is no hotline or other separate channel for employees to report suspected improprieties(従業員が不正の疑いを報告するためのホットラインなどの別経路がない)",
      type: "select",
      options: ["Control environment", "Risk assessment", "Control activities", "Information and communication", "Monitoring activities"],
      answer: "Information and communication",
    },
    {
      label: "The internal audit function was eliminated, and no ongoing or separate evaluations of controls are performed(内部監査部門が廃止され、統制の日常的評価・独立的評価が行われていない)",
      type: "select",
      options: ["Control environment", "Risk assessment", "Control activities", "Information and communication", "Monitoring activities"],
      answer: "Monitoring activities",
    },
    {
      label: "Monthly bank reconciliations are prepared but never reviewed by a supervisor(銀行勘定調整表は毎月作成されるが、上長によるレビューが行われていない)",
      type: "select",
      options: ["Control environment", "Risk assessment", "Control activities", "Information and communication", "Monitoring activities"],
      answer: "Control activities",
    },
  ],
  explain: `<p>① 取締役会の独立性・監督は統制環境(原則2)。② 重要な変化の識別・分析はリスク評価(原則9)。</p>
<p>③ 職務分離の欠如、⑥ 照合結果のレビュー欠如は、方針・手続による統制活動(原則10〜12)の不備。</p>
<p>④ 内部通報制度など別の伝達経路は情報と伝達(原則14:社内の伝達)に含まれる。⑤ 日常的評価・独立的評価の欠如はモニタリング活動(原則16)の不備。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-08",
  section: "AUD",
  chapter: "AUD-02",
  title: "不正リスク要因の分類(不正のトライアングル)",
  scenario: `<p>While performing risk assessment procedures at Mori Manufacturing, the audit team identified the following conditions. Classify each as a fraud risk factor relating primarily to incentive/pressure, opportunity, or attitude/rationalization.</p>
<p class="ja">Mori製作所でリスク評価手続を実施中、監査チームは以下の状況を識別した。それぞれを、主に動機・プレッシャー、機会、姿勢・正当化のいずれに関する不正リスク要因かに分類せよ。</p>`,
  rows: [
    {
      label: "A large portion of executives' compensation depends on meeting aggressive quarterly EPS targets(経営陣の報酬の大部分が、強気な四半期EPS目標の達成に依存している)",
      type: "select",
      options: ["Incentive/pressure", "Opportunity", "Attitude/rationalization"],
      answer: "Incentive/pressure",
    },
    {
      label: "Management is dominated by a single person, and the board provides little oversight(経営が1人の人物に支配され、取締役会による監督がほとんどない)",
      type: "select",
      options: ["Incentive/pressure", "Opportunity", "Attitude/rationalization"],
      answer: "Opportunity",
    },
    {
      label: "Management frequently disputes the auditor's conclusions and tries to justify marginal or inappropriate accounting on the basis of materiality(経営者は監査人の結論に頻繁に異議を唱え、重要性を理由に際どい会計処理を正当化しようとする)",
      type: "select",
      options: ["Incentive/pressure", "Opportunity", "Attitude/rationalization"],
      answer: "Attitude/rationalization",
    },
    {
      label: "Significant related party transactions occur outside the ordinary course of business with entities not audited(通常の営業過程外で、監査されていない関連当事者との重要な取引がある)",
      type: "select",
      options: ["Incentive/pressure", "Opportunity", "Attitude/rationalization"],
      answer: "Opportunity",
    },
    {
      label: "Operating cash flows are recurring negative while reported earnings continue to grow, and debt covenants are close to being breached(営業キャッシュフローは継続的にマイナスである一方、報告利益は増加し続けており、財務制限条項への抵触が迫っている)",
      type: "select",
      options: ["Incentive/pressure", "Opportunity", "Attitude/rationalization"],
      answer: "Incentive/pressure",
    },
    {
      label: "Management has failed for several years to remediate known significant deficiencies in internal control on a timely basis(経営者は既知の重要な不備を何年も適時に是正していない)",
      type: "select",
      options: ["Incentive/pressure", "Opportunity", "Attitude/rationalization"],
      answer: "Attitude/rationalization",
    },
  ],
  explain: `<p>動機・プレッシャー:業績連動報酬への過度の依存(①)、財務的安定性・収益性の悪化や財務制限条項の圧力(⑤)。</p>
<p>機会:経営者の支配と監督の不備(②)、通常でない関連当事者取引など取引の性質(④)。</p>
<p>姿勢・正当化:監査人との頻繁な対立や際どい処理の正当化(③)、既知の重要な不備を適時に是正しないこと(⑥)は、経営者の姿勢の問題として例示されている。</p>`,
});
