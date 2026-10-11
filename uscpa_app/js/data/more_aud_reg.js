// AUD・REG の追加問題

CPA.extend("AUD-01", {
  mcq: [
    {
      q: "Long association of a senior engagement partner with an attest client most directly creates which threat?",
      ja: "上級の業務執行社員が証明業務クライアントと長期間関与することで、最も直接的に生じる脅威はどれか。",
      c: ["Self-review threat", "Familiarity threat", "Advocacy threat", "Adverse interest threat"],
      a: 1,
      ex: "長期の関与や親密な関係は、クライアントに同調的になりやすい馴れ合い(familiarity)の脅威を生む。",
    },
    {
      q: "Under SEC rules, the lead audit partner on an issuer audit must rotate off the engagement after how many consecutive years?",
      ja: "SECの規則において、公開会社監査の筆頭監査パートナーは連続何年の関与後にローテーションしなければならないか。",
      c: ["3 years", "5 years", "7 years", "10 years"],
      a: 1,
      ex: "筆頭パートナーと審査担当パートナーは5年でローテーションし、5年間のクーリングオフ期間がある。",
    },
    {
      q: "A covered member obtains a new loan from an attest client bank under normal lending terms. Which type of loan would impair independence?",
      ja: "対象者が、証明業務クライアントである銀行から通常の貸出条件で新たに借入れを行った。独立性を損なうのはどの種類の借入れか。",
      c: [
        "An automobile loan collateralized by the automobile",
        "A loan fully collateralized by cash deposits at the bank",
        "A home mortgage",
        "A loan against the cash surrender value of an insurance policy",
      ],
      a: 2,
      ex: "対象者となった後の住宅ローンは独立性を損なう(対象者になる前の住宅ローンは一定条件で許容=grandfathered)。担保付き自動車ローン、預金で全額担保された借入れ、保険の解約返戻金を担保とする借入れは許容される。",
    },
    {
      q: "A CPA in public practice may NOT accept a commission for recommending a product to which of the following clients?",
      ja: "開業している公認会計士が、製品を推奨したことに対する手数料(コミッション)を受け取ってはならないのは、次のどのクライアントか。",
      c: [
        "A client for which the CPA performs only tax return preparation, with disclosure",
        "A client for which the CPA performs an audit",
        "A client for which the CPA provides consulting only, with disclosure",
        "A client for which the CPA performs no professional services",
      ],
      a: 1,
      ex: "監査・レビュー・(独立性の欠如を開示しない第三者利用の)コンピレーション・将来財務情報の検証を行うクライアントからは手数料を受け取れない。それ以外は開示すれば認められる。",
    },
    {
      q: "Under Government Auditing Standards (the Yellow Book), auditors must complete how many hours of continuing professional education every two years?",
      ja: "政府監査基準(Yellow Book)のもとで、監査人は2年ごとに何時間の継続的専門研修(CPE)を修了しなければならないか。",
      c: ["40 hours", "60 hours", "80 hours", "120 hours"],
      a: 2,
      ex: "2年ごとに80時間(うち24時間は政府監査・政府環境に直接関連するもの)のCPEが求められる。",
    },
  ],
  cards: [
    ["Familiarity threat", "馴れ合いの脅威", "長期・親密な関係による脅威"],
    ["Partner rotation", "パートナーのローテーション", "SECでは筆頭・審査パートナーが5年で交代"],
    ["Yellow Book (GAGAS)", "政府監査基準", "GAOが定める。独立性とCPE80時間"],
  ],
});

CPA.extend("AUD-02", {
  mcq: [
    {
      q: "Risk assessment procedures performed to obtain an understanding of the entity include all of the following EXCEPT:",
      ja: "企業を理解するために実施するリスク評価手続に含まれないものはどれか。",
      c: ["Inquiries of management", "Analytical procedures", "Observation and inspection", "Confirmation of all account balances"],
      a: 3,
      ex: "リスク評価手続は質問・分析的手続・観察と閲覧。確認はリスク対応手続(実証手続)として実施する。",
    },
    {
      q: "When the external auditor uses the work of the internal audit function, responsibility for the audit opinion:",
      ja: "外部監査人が内部監査機能の作業を利用する場合、監査意見に対する責任はどうなるか。",
      c: [
        "Is shared with the internal auditors",
        "Rests solely with the external auditor",
        "Is transferred to the audit committee",
        "Is divided based on the work performed",
      ],
      a: 1,
      ex: "内部監査人の作業を利用しても、監査意見に対する責任は外部監査人だけが負い、監査報告書で内部監査に言及しない。",
    },
    {
      q: "A client asks to change an engagement from an audit to a review before the audit is complete. Which reason would NOT ordinarily be reasonable for the change?",
      ja: "監査の完了前に、クライアントが監査からレビューへの業務の変更を求めた。変更の理由として通常合理的でないものはどれか。",
      c: [
        "The bank no longer requires audited financial statements",
        "There was a misunderstanding about the nature of the services",
        "The client has refused to allow the auditor to correspond with its legal counsel",
        "A change in the client's circumstances affecting its need for an audit",
      ],
      a: 2,
      ex: "顧問弁護士への照会を拒否するなど、範囲の制約に起因する変更要請は通常合理的ではない。要求の変化や誤解は合理的な理由になりうる。",
    },
    {
      q: "A misstatement that is quantitatively small may still be material if it:",
      ja: "金額的に小さな虚偽表示でも重要となりうるのはどのような場合か。",
      c: [
        "Occurs in the fourth quarter",
        "Changes a net loss into net income",
        "Is detected by the auditor rather than management",
        "Involves a current asset",
      ],
      a: 1,
      ex: "損失を利益に変える、財務制限条項の遵守に影響する、不正に起因するなど、質的な要因で重要になる場合がある。",
    },
    {
      q: "Regarding related party transactions, the auditor should primarily:",
      ja: "関連当事者との取引について、監査人が主に行うべきことはどれか。",
      c: [
        "Determine whether the transactions were at arm's length in every case",
        "Evaluate whether the transactions are appropriately accounted for and disclosed",
        "Prohibit the client from engaging in them",
        "Report them to the SEC",
      ],
      a: 1,
      ex: "関連当事者取引が適切に識別・会計処理・開示されているかを評価する。独立第三者間取引と同等の条件であると主張する場合は、その主張を裏付ける証拠が必要。",
    },
  ],
  cards: [
    ["Risk assessment procedures", "リスク評価手続", "質問・分析的手続・観察と閲覧"],
    ["Internal audit function", "内部監査機能", "利用しても意見の責任は外部監査人のみ"],
    ["Related party", "関連当事者", "取引の識別・会計処理・開示を評価"],
  ],
});

CPA.extend("AUD-03", {
  mcq: [
    {
      q: "In a small business with limited segregation of duties, which control would best compensate for the weakness?",
      ja: "職務分掌が限られた小規模企業で、その弱点を最もよく補う統制はどれか。",
      c: [
        "The owner reviews bank reconciliations and supporting documents",
        "The bookkeeper takes a two-week vacation",
        "The company switches to a different bank",
        "The company stops using prenumbered checks",
      ],
      a: 0,
      ex: "オーナーによる銀行勘定調整表や証憑の直接レビューは、職務分掌の不足を補う代表的な補完統制(compensating control)。",
    },
    {
      q: "Lapping of accounts receivable is most likely to be detected by:",
      ja: "売掛金のラッピング(入金の流用と後の入金での穴埋め)を発見する可能性が最も高いのはどれか。",
      c: [
        "Comparing the details of deposit slips with remittance advices and postings to customer accounts",
        "Recomputing depreciation",
        "Observing the inventory count",
        "Reviewing the minutes of board meetings",
      ],
      a: 0,
      ex: "ラッピングでは顧客ごとの入金記録の日付がずれるため、預金伝票の明細と送金通知・得意先元帳への記帳を照合すると発見できる。確認も有効。",
    },
    {
      q: "Under AICPA standards, if an auditor plans to rely on controls that have not changed since they were last tested, the auditor should test their operating effectiveness at least once every:",
      ja: "AICPA基準において、前回テスト以降変更されていない統制に依拠する場合、監査人は少なくとも何年に1回運用状況の有効性をテストすべきか。",
      c: ["Year", "Second year", "Third year", "Fifth year"],
      a: 2,
      ex: "前年度までの証拠を利用する場合でも、少なくとも3年に1回はテストし、毎年一部の統制はテストする。重要なリスクに対応する統制は毎年テストが必要。",
    },
    {
      q: "Before approving a vendor invoice for payment, the accounts payable clerk should match the invoice to the:",
      ja: "仕入先の請求書を支払承認する前に、買掛金担当者は請求書を何と照合すべきか。",
      c: [
        "Sales order and bill of lading",
        "Purchase order and receiving report",
        "Customer remittance advice",
        "Bank statement",
      ],
      a: 1,
      ex: "購買の三点照合(three-way match):発注書・受領報告書・請求書の数量・価格が一致することを確認してから支払う。",
    },
    {
      q: "Which of the following is an entity-level control?",
      ja: "次のうち、全社的な統制(entity-level control)はどれか。",
      c: [
        "A clerk compares invoice prices with the price list",
        "The audit committee oversees the financial reporting process",
        "A system edit check rejects invalid customer numbers",
        "A supervisor approves each overtime card",
      ],
      a: 1,
      ex: "監査委員会による監視、経営者の姿勢、リスク評価プロセスなどは全社的統制。他は取引レベルの統制。",
    },
  ],
  cards: [
    ["Compensating control", "補完統制", "他の統制の不備を補う統制"],
    ["Lapping", "ラッピング", "入金を流用し後続の入金で穴埋めする不正"],
    ["Three-way match", "三点照合", "発注書・受領報告書・請求書の照合"],
  ],
});

CPA.extend("AUD-04", {
  mcq: [
    {
      q: "An auditor obtains a bank cutoff statement primarily to:",
      ja: "監査人が銀行カットオフ・ステートメントを入手する主な目的は何か。",
      c: [
        "Verify reconciling items on the year-end bank reconciliation",
        "Confirm the interest rate on loans",
        "Test the accuracy of payroll",
        "Detect unrecorded sales",
      ],
      a: 0,
      ex: "期末後の短い期間の銀行取引明細を銀行から直接入手し、期末の銀行勘定調整表の未取付小切手や未記帳入金が実際に決済されたかを確かめる。",
    },
    {
      q: "Check kiting is most likely to be detected by:",
      ja: "小切手のカイティング(口座間の資金移動を利用した残高の水増し)を発見する可能性が最も高いのはどれか。",
      c: ["A bank transfer schedule", "An inventory observation", "A search for unrecorded liabilities", "Recalculating accrued interest"],
      a: 0,
      ex: "期末前後の銀行間振替の支払日・入金日を一覧にした bank transfer schedule で、二重計上された残高を発見できる。",
    },
    {
      q: "In attribute sampling for tests of controls, if the upper deviation limit exceeds the tolerable rate of deviation, the auditor should:",
      ja: "統制テストの属性サンプリングで、逸脱率の上限が許容逸脱率を超えた場合、監査人はどうすべきか。",
      c: [
        "Assess control risk lower than planned",
        "Increase the assessed level of control risk and modify substantive procedures",
        "Decrease substantive testing",
        "Issue a qualified opinion",
      ],
      a: 1,
      ex: "統制が期待どおり有効でないため、統制リスクの評価を引き上げ、実証手続の性質・時期・範囲を見直す(増やす)。",
    },
    {
      q: "The primary source of evidence about litigation, claims, and assessments is:",
      ja: "訴訟・請求・賦課に関する証拠の主な情報源はどれか。",
      c: [
        "The client's legal counsel, through a letter of inquiry sent by the client",
        "The client's board minutes only",
        "Public court records only",
        "The predecessor auditor",
      ],
      a: 0,
      ex: "経営者が識別・評価する一次的な責任を負い、監査人は経営者を通じて顧問弁護士に照会状を送り、回答は弁護士から監査人へ直接返送してもらう。",
    },
    {
      q: "Substantive analytical procedures are generally most effective for:",
      ja: "実証手続としての分析的手続が一般に最も効果的なのはどのような場合か。",
      c: [
        "Large volumes of transactions that tend to be predictable over time",
        "Nonroutine, one-time transactions",
        "Accounts with a high risk of fraud",
        "Transactions with related parties",
      ],
      a: 0,
      ex: "安定した関係があり予測しやすい大量の取引(例:給与、利息、賃料)に適している。非経常的な取引や不正リスクの高い領域では詳細テストが中心。",
    },
    {
      q: "Probability-proportional-to-size (PPS) sampling is most useful when the auditor is concerned primarily with:",
      ja: "金額単位サンプリング(PPS)が最も有用なのは、監査人が主に何を懸念している場合か。",
      c: ["Understatement of an account", "Overstatement of an account", "Accounts with many zero balances", "Accounts with negative balances"],
      a: 1,
      ex: "PPSでは金額の大きい項目ほど抽出されやすいため、過大計上の発見に適する。過少計上やゼロ・マイナス残高の項目は抽出されにくい。",
    },
  ],
  cards: [
    ["Bank cutoff statement", "銀行カットオフ明細", "期末後の取引明細を銀行から直接入手"],
    ["Kiting", "カイティング", "口座間振替を利用した残高の水増し"],
    ["Letter of inquiry", "弁護士への照会状", "訴訟等の主な証拠"],
    ["PPS sampling", "金額単位サンプリング", "過大計上の検出に適する"],
  ],
});

CPA.extend("AUD-05", {
  mcq: [
    {
      q: "With respect to other information included in an annual report that contains audited financial statements, the auditor should:",
      ja: "監査済み財務諸表を含む年次報告書のその他の記載内容について、監査人は何をすべきか。",
      c: [
        "Audit the other information",
        "Read the other information and consider whether there are material inconsistencies with the financial statements",
        "Ignore the other information",
        "Express a separate opinion on it",
      ],
      a: 1,
      ex: "その他の記載内容は監査対象ではないが、通読して財務諸表との重要な相違や事実の重要な誤記がないかを検討する。",
    },
    {
      q: "After the report release date, an auditor discovers facts that existed at the report date and would have affected the report. Users are likely relying on the statements. The auditor should:",
      ja: "監査報告書の発行後、報告書日に存在し、報告書に影響したであろう事実を発見した。利用者は財務諸表に依拠している可能性が高い。監査人はどうすべきか。",
      c: [
        "Take no action because the report has been released",
        "Discuss the matter with management and request that revised financial statements be issued",
        "Immediately notify the SEC without discussing with management",
        "Issue a new report on next year's statements only",
      ],
      a: 1,
      ex: "経営者と協議し、修正した財務諸表の発行と利用者への通知を求める。経営者が協力しない場合は、報告書への依拠を防ぐ措置を講じる。",
    },
    {
      q: "In a comfort letter to underwriters, an accountant may provide:",
      ja: "引受会社へのコンフォート・レターで、会計士が提供できるものはどれか。",
      c: [
        "Positive assurance on unaudited interim information",
        "Negative assurance on unaudited condensed interim financial information",
        "An opinion on internal control",
        "A guarantee of the securities' value",
      ],
      a: 1,
      ex: "コンフォート・レターでは、レビューした未監査の期中財務情報について消極的保証(negative assurance)を提供できる。",
    },
    {
      q: "In an agreed-upon procedures engagement, the practitioner:",
      ja: "合意された手続(AUP)業務において、実務家は何を行うか。",
      c: [
        "Expresses an opinion on the subject matter",
        "Performs specified procedures and reports findings without providing an opinion or conclusion",
        "Provides limited assurance",
        "Determines the sufficiency of the procedures",
      ],
      a: 1,
      ex: "AUPでは依頼者が手続の十分性に責任を負い、実務家は手続を実施して発見事項を報告するのみで、意見や結論は表明しない。",
    },
    {
      q: "When a group engagement partner decides to make reference to the audit of a component auditor in the auditor's report, this indicates:",
      ja: "グループ監査の責任者が、監査報告書で構成単位の監査人の監査に言及することにした場合、それは何を示すか。",
      c: [
        "A qualified opinion",
        "A division of responsibility for the audit",
        "That the component's statements are unaudited",
        "A scope limitation",
      ],
      a: 1,
      ex: "言及(making reference)は責任の分担を示すもので、意見の限定ではない。言及しない場合はグループ監査人が構成単位の監査を含め全責任を負う。",
    },
  ],
  cards: [
    ["Other information", "その他の記載内容", "通読して重要な相違を検討"],
    ["Comfort letter", "コンフォート・レター", "引受会社向け。消極的保証が可能"],
    ["Agreed-upon procedures (AUP)", "合意された手続", "発見事項を報告。意見・結論なし"],
  ],
});

CPA.extend("REG-01", {
  mcq: [
    {
      q: "The civil fraud penalty imposed on a taxpayer is equal to what percentage of the underpayment attributable to fraud?",
      ja: "納税者に課される民事上の詐欺ペナルティは、詐欺に起因する過少納付額の何%か。",
      c: ["20%", "25%", "50%", "75%"],
      a: 3,
      ex: "民事詐欺ペナルティは75%。過失・著しい過少申告による正確性関連ペナルティは20%。",
    },
    {
      q: "A taxpayer filed a return 3 months late and paid the tax due at the same time. Ignoring the interaction with the failure-to-pay penalty, the failure-to-file penalty is generally:",
      ja: "納税者は期限から3か月遅れて申告し、同時に税金を納付した。納付遅延ペナルティとの調整を無視すると、無申告(期限後申告)ペナルティは一般にいくらか。",
      c: ["0.5% per month of unpaid tax", "5% per month of unpaid tax, up to 25%", "10% of unpaid tax", "25% of unpaid tax regardless of time"],
      a: 1,
      ex: "期限後申告ペナルティは未納税額の月5%(最大25%)。納付遅延ペナルティは月0.5%(最大25%)で、同じ月は期限後申告ペナルティから控除される。",
    },
    {
      q: "In a U.S. Tax Court case involving an IRS deficiency, the burden of proof is generally on:",
      ja: "IRSの更正をめぐる租税裁判所の訴訟において、立証責任は一般に誰にあるか。",
      c: ["The IRS", "The taxpayer", "The court", "The tax preparer"],
      a: 1,
      ex: "原則として納税者が立証責任を負う。ただし詐欺の主張などではIRSに立証責任があり、納税者が信頼できる証拠を提出し協力した場合は移転することもある。",
    },
    {
      q: "Working papers prepared by a CPA in an audit engagement are owned by:",
      ja: "監査業務で公認会計士が作成した調書の所有者は誰か。",
      c: ["The client", "The CPA", "The client's bankers", "The state board of accountancy"],
      a: 1,
      ex: "調書は会計士の所有物。ただし守秘義務があり、クライアントの同意なく第三者に開示できない(召喚状などの例外を除く)。",
    },
    {
      q: "Under Circular 230, a practitioner may charge a contingent fee for:",
      ja: "Circular 230のもとで、実務家が成功報酬を請求できるのはどれか。",
      c: [
        "Preparing an original tax return",
        "Services in connection with an IRS examination of an original return",
        "Preparing an amended return filed long after the IRS has begun an examination, in all cases",
        "Advising a client on a tax shelter's expected tax benefits",
      ],
      a: 1,
      ex: "成功報酬は原則禁止だが、IRSの調査や原申告の異議申立てに関連する業務、一定期間内の還付請求、司法手続などは例外として認められる。原申告書の作成は不可。",
    },
  ],
  cards: [
    ["Civil fraud penalty", "民事詐欺ペナルティ", "過少納付額の75%"],
    ["Accuracy-related penalty", "正確性関連ペナルティ", "過失・著しい過少申告で20%"],
    ["Failure-to-file penalty", "期限後申告ペナルティ", "月5%、最大25%"],
  ],
});

CPA.extend("REG-02", {
  mcq: [
    {
      q: "A contract entered into by a minor for nonnecessary goods is generally:",
      ja: "未成年者が生活必需品ではない物品について締結した契約は、一般にどうなるか。",
      c: ["Void", "Voidable by the minor", "Voidable by the adult party", "Fully enforceable against the minor"],
      a: 1,
      ex: "未成年者の契約は未成年者側が取り消すことができる(voidable)。必需品(necessaries)については合理的な価額の支払義務を負う。",
    },
    {
      q: "The parol evidence rule generally prohibits the introduction of:",
      ja: "口頭証拠排除法則(parol evidence rule)が一般に禁止するのはどれか。",
      c: [
        "Evidence of fraud in the formation of the contract",
        "Prior or contemporaneous oral agreements that contradict the terms of a fully integrated written contract",
        "Subsequent modifications to the contract",
        "Evidence to clarify an ambiguous term",
      ],
      a: 1,
      ex: "完全に統合された書面契約の内容と矛盾する、事前または同時の口頭合意を証拠とすることはできない。詐欺の証拠、事後の変更、曖昧な条項の解釈は例外。",
    },
    {
      q: "Under the UCC, when goods are shipped FOB shipping point by common carrier, risk of loss passes to the buyer when:",
      ja: "UCCのもとで、運送業者によりFOB出荷地点条件で物品が出荷される場合、危険負担はいつ買主に移転するか。",
      c: [
        "The contract is signed",
        "The seller delivers the goods to the carrier",
        "The goods arrive at the buyer's place of business",
        "The buyer pays for the goods",
      ],
      a: 1,
      ex: "出荷地契約(FOB shipping point)では、売主が物品を運送業者に引き渡した時点で危険負担が買主に移る。仕向地契約なら到着時。",
    },
    {
      q: "Which of the following debts is generally NOT discharged in a Chapter 7 bankruptcy?",
      ja: "次のうち、チャプター7破産で一般に免責されない債務はどれか。",
      c: ["Credit card debt", "Medical bills", "Child support obligations", "Unsecured trade payables"],
      a: 2,
      ex: "養育費などの家族扶養義務、多くの学生ローン、一定の税金、詐欺による債務などは免責されない。",
    },
    {
      q: "An agent's actual authority terminates automatically, without notice, upon:",
      ja: "代理人の実際の代理権が、通知なしに自動的に終了するのはどのような場合か。",
      c: [
        "The principal's dissatisfaction with the agent",
        "The death or incapacity of the principal",
        "The agent's request for a raise",
        "The completion of half of the agency term",
      ],
      a: 1,
      ex: "本人の死亡・行為能力の喪失などは法の作用(operation of law)による終了で、第三者への通知がなくても代理権は終了する。",
    },
  ],
  cards: [
    ["Voidable contract", "取り消しうる契約", "一方当事者が取り消せる契約(未成年者など)"],
    ["Parol evidence rule", "口頭証拠排除法則", "統合された書面と矛盾する事前・同時の口頭合意を排除"],
    ["Risk of loss", "危険負担", "FOB出荷地は運送人への引渡し時に移転"],
    ["Discharge", "免責", "破産で債務の支払義務が消滅すること"],
  ],
});

CPA.extend("REG-03", {
  mcq: [
    {
      q: "The \"kiddie tax\" applies to a child's:",
      ja: "「キディ・タックス」は子どものどの所得に適用されるか。",
      c: ["Earned income from wages", "Unearned income, such as interest and dividends, above a threshold", "Gifts received from parents", "Scholarships used for tuition"],
      a: 1,
      ex: "一定額を超える子どもの不労所得(利子・配当など)に親の税率で課税する制度。給与などの勤労所得には適用されない。",
    },
    {
      q: "To file as head of household, a taxpayer generally must be unmarried at year-end and:",
      ja: "世帯主(head of household)として申告するには、一般に年末時点で未婚であることに加え、何が必要か。",
      c: [
        "Have gross income below a threshold",
        "Pay more than half the cost of maintaining a home that is the principal home of a qualifying person for more than half the year",
        "Be over age 65",
        "Have no dependents",
      ],
      a: 1,
      ex: "適格者(qualifying person)が年の半分超居住する住居の維持費用の半分超を負担する必要がある(扶養する親は同居不要の例外あり)。",
    },
    {
      q: "Which of the following tax credits is refundable?",
      ja: "次のうち、還付される(refundable)税額控除はどれか。",
      c: ["Foreign tax credit", "Child and dependent care credit", "Earned income credit", "Credit for the elderly or disabled"],
      a: 2,
      ex: "勤労所得税額控除(EIC)は税額を超えた部分も還付される。他の3つは税額を上限とする非還付型。",
    },
    {
      q: "An individual donates publicly traded stock held for 3 years to a public charity. The stock's fair market value is $50,000 and its basis is $10,000. The deduction is generally measured at:",
      ja: "個人が3年間保有した上場株式を公益慈善団体に寄付した。時価は$50,000、取得価額は$10,000である。控除額は一般にどう測定されるか。",
      c: [
        "$10,000, limited to 60% of AGI",
        "$50,000, limited to 30% of AGI",
        "$40,000, with no AGI limit",
        "$50,000, with no AGI limit",
      ],
      a: 1,
      ex: "長期保有のキャピタルゲイン資産を公益慈善団体に寄付すると時価で控除できるが、上限はAGIの30%。超過分は5年間繰り越せる。",
    },
    {
      q: "Under a divorce agreement executed in 2020, alimony payments are:",
      ja: "2020年に締結された離婚協議に基づく扶養料(alimony)の支払は、どう扱われるか。",
      c: [
        "Deductible by the payer and taxable to the recipient",
        "Not deductible by the payer and not taxable to the recipient",
        "Deductible by the payer but not taxable to the recipient",
        "Taxable to both parties",
      ],
      a: 1,
      ex: "2018年12月31日より後に締結された離婚協議では、扶養料は支払者が控除できず、受取者も所得に含めない。",
    },
    {
      q: "A sole proprietor has net earnings from self-employment. The combined self-employment tax rate (Social Security plus Medicare), below the Social Security wage base, is:",
      ja: "個人事業主に自営業の純所得がある。社会保障税の賃金上限以下の部分にかかる自営業税の合計税率(社会保障+メディケア)は何%か。",
      c: ["7.65%", "12.4%", "15.3%", "2.9%"],
      a: 2,
      ex: "社会保障12.4% + メディケア2.9% = 15.3%。課税対象は純利益の92.35%で、自営業税の50%は所得調整控除できる。",
    },
  ],
  cards: [
    ["Kiddie tax", "キディ・タックス", "子どもの不労所得に親の税率で課税"],
    ["Head of household", "世帯主", "未婚で適格者の住居費用の半分超を負担"],
    ["Refundable credit", "還付型税額控除", "税額を超える部分も還付(EICなど)"],
  ],
});

CPA.extend("REG-04", {
  mcq: [
    {
      q: "When property is received as a gift and the donee's basis is the donor's basis, the donee's holding period:",
      ja: "贈与により取得した財産で受贈者の取得価額が贈与者の取得価額を引き継ぐ場合、受贈者の保有期間はどうなるか。",
      c: ["Begins on the date of the gift", "Includes the donor's holding period", "Is always long-term", "Is always short-term"],
      a: 1,
      ex: "取得価額を引き継ぐ場合は保有期間も通算(tacking)される。損失計算に時価を使う場合は贈与日から起算する。",
    },
    {
      q: "A net Section 1231 gain for the current year is treated as ordinary income to the extent of:",
      ja: "当年の§1231純利益は、どの範囲で通常所得として扱われるか。",
      c: [
        "Depreciation taken on all assets",
        "Unrecaptured net Section 1231 losses from the previous five years",
        "Capital losses of the current year",
        "$3,000",
      ],
      a: 1,
      ex: "過去5年間に通常損失として控除した§1231純損失のうち、まだリキャプチャーされていない部分まで通常所得となる(5年ルックバック)。",
    },
    {
      q: "In an involuntary conversion under Section 1033, a taxpayer that reinvests in qualified replacement property recognizes gain:",
      ja: "§1033の非自発的転換において、適格な代替資産に再投資した納税者はどの範囲で利益を認識するか。",
      c: [
        "In full",
        "Only to the extent the amount realized exceeds the cost of the replacement property",
        "Never",
        "Only if the property was a principal residence",
      ],
      a: 1,
      ex: "保険金などの受取額のうち、代替資産に再投資しなかった部分だけ利益を認識する(選択による繰延べ)。",
    },
    {
      q: "A taxpayer sells land with a basis of $60,000 for $100,000 under the installment method and receives $25,000 in the year of sale. How much gain is recognized in the year of sale?",
      ja: "納税者は取得価額$60,000の土地を割賦基準で$100,000で売却し、売却年に$25,000を受け取った。売却年に認識する利益はいくらか。",
      c: ["$40,000", "$25,000", "$15,000", "$10,000"],
      a: 3,
      ex: "粗利益率 = (100,000 − 60,000)÷ 100,000 = 40%。売却年の利益 = 25,000 × 40% = $10,000。",
    },
    {
      q: "The maximum tax rate on long-term capital gain from the sale of collectibles held by an individual is:",
      ja: "個人が保有する収集品の売却による長期キャピタルゲインの最高税率は何%か。",
      c: ["15%", "20%", "25%", "28%"],
      a: 3,
      ex: "収集品(美術品・切手・コインなど)の長期キャピタルゲインは最高28%。unrecaptured §1250 gain は最高25%。",
    },
  ],
  cards: [
    ["Tacking", "保有期間の通算", "取得価額を引き継ぐと保有期間も引き継ぐ"],
    ["Involuntary conversion", "非自発的転換", "災害・収用など。再投資で利益を繰延べ"],
    ["Installment method", "割賦基準", "受取額 × 粗利益率で利益を認識"],
  ],
});

CPA.extend("REG-05", {
  mcq: [
    {
      q: "A corporation incurs $53,000 of organizational expenditures in its first year. What is the maximum amount it may deduct in that year, before amortization of the remainder?",
      ja: "法人は初年度に$53,000の創立費を支出した。残額の償却を除き、初年度に即時控除できる最大額はいくらか。",
      c: ["$0", "$2,000", "$5,000", "$53,000"],
      a: 1,
      ex: "即時控除は$5,000が上限で、支出が$50,000を超える分だけ減額される。5,000 − 3,000 = $2,000。残りは180か月で償却する。",
    },
    {
      q: "An S corporation election may be voluntarily revoked with the consent of shareholders holding:",
      ja: "S法人の選択は、どれだけの株式を保有する株主の同意があれば任意に取り消すことができるか。",
      c: ["All shares", "More than 50% of the shares", "At least two-thirds of the shares", "At least 80% of the shares"],
      a: 1,
      ex: "発行済株式の過半数(50%超)を保有する株主の同意で取消し(revocation)できる。選択(election)には全株主の同意が必要。",
    },
    {
      q: "A partnership generally:",
      ja: "パートナーシップは一般にどうなっているか。",
      c: [
        "Pays federal income tax at the entity level at 21%",
        "Files an information return (Form 1065) and issues Schedules K-1 to partners",
        "Is not required to file any return",
        "Pays tax only on guaranteed payments",
      ],
      a: 1,
      ex: "パートナーシップは事業体段階で課税されず、情報申告書(Form 1065)を提出し、各パートナーに配分額を示すSchedule K-1を交付する。",
    },
    {
      q: "An increase in a partner's share of partnership liabilities is treated as:",
      ja: "パートナーシップの負債に対するパートナーの持分の増加はどう扱われるか。",
      c: ["A distribution of cash", "A contribution of money that increases the partner's basis", "Taxable income to the partner", "A decrease in the partner's basis"],
      a: 1,
      ex: "負債の持分の増加は金銭の拠出とみなされ outside basis を増やす。減少は金銭の分配とみなされ basis を減らす。",
    },
    {
      q: "For a calendar-year C corporation, Form 1120 is due on:",
      ja: "暦年のC法人について、Form 1120の申告期限はいつか。",
      c: ["March 15", "April 15", "May 15", "September 15"],
      a: 1,
      ex: "C法人は事業年度終了後4か月目の15日(暦年なら4月15日)。パートナーシップ(1065)とS法人(1120-S)は3か月目の15日(3月15日)。",
    },
  ],
  cards: [
    ["Organizational expenditures", "創立費", "最大$5,000即時控除、残りは180か月償却"],
    ["Form 1065", "パートナーシップ申告書", "情報申告。K-1を交付。期限は3月15日(暦年)"],
    ["Revocation of S election", "S法人選択の取消し", "株式の過半数を持つ株主の同意"],
  ],
});
