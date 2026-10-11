// AUD の追加問題(第3弾)

CPA.extend("AUD-01", {
  mcq: [
    {
      q: "Over the last three years, fees from one nonissuer attest client have grown to represent a significant portion of a small CPA firm's total revenue. Under the AICPA conceptual framework, this situation most directly creates which threat to independence?",
      ja: "過去3年間で、ある非公開の証明業務クライアントからの報酬が小規模会計事務所の総収入の大きな割合を占めるようになった。AICPAの概念的フレームワークのもとで、この状況が最も直接的に生じさせる独立性への脅威はどれか。",
      c: ["Self-review threat", "Familiarity threat", "Self-interest threat", "Management participation threat"],
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
