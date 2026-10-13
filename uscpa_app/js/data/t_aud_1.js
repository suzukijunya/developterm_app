// AUD のTBS追加(独立性・倫理規程・GAGAS/重要性・リスク評価・不正・監査契約・分析的手続)

CPA.tbs({
  id: "TBS-AUD-30", section: "AUD", chapter: "AUD-01", title: "対象メンバー・家族関係・融資による独立性の判定(AICPA)",
  scenario: `<p>Baxter &amp; Lee CPAs audits the financial statements of <b>Hart Manufacturing, Inc.</b>, a privately held (nonissuer) company. The lead attest engagement partner, Gomez, practices in the firm's <b>Denver</b> office. The firm's independence coordinator compiled the following matters for the current-year engagement.</p>
<table><tr><th>#</th><th>Matter</th></tr>
<tr><td>1</td><td>Rivera, a partner in the Denver office who performs no services for Hart, owns 50 shares of Hart common stock. The holding is immaterial to Rivera.</td></tr>
<tr><td>2</td><td>Chen, an audit manager in the Boston office, is not on the Hart engagement team, provides no services to Hart, and cannot influence the engagement. Chen owns 2% of Hart's outstanding common stock.</td></tr>
<tr><td>3</td><td>Patel, a senior on the Hart engagement team, knows that his brother owns Hart stock that is material to the brother's net worth.</td></tr>
<tr><td>4</td><td>Gomez's adult son, who is not a dependent, is employed by Hart as a warehouse shift supervisor. The position has no influence over accounting or the financial statements.</td></tr>
<tr><td>5</td><td>The spouse of Kim, a staff accountant on the engagement team, was promoted during the engagement period to Hart's controller.</td></tr>
<tr><td>6</td><td>Walsh, a former firm partner who never worked on Hart, joined Hart as CFO. All capital balances were paid in full, Walsh's retirement benefits are fixed, Walsh does not participate in firm activities, and the firm evaluated the familiarity threat and modified the audit plan.</td></tr>
<tr><td>7</td><td>Patel obtained an automobile loan, collateralized by the vehicle, from First Lakes Bank (another attest client of the firm) under the bank's normal lending procedures, terms, and requirements.</td></tr></table>
<p class="ja">Baxter &amp; Lee会計事務所は非公開会社(非発行体)Hart Manufacturing社の財務諸表監査を行っている。業務執行責任者Gomezはデンバー事務所に所属する。独立性担当者は当期の事項を上表のとおり整理した。1:Hartに業務を提供しないデンバー事務所のパートナーRiveraがHart株50株(本人にとって重要でない)を保有。2:ボストン事務所の監査マネージャーChenは業務チーム外で影響力もなく、Hart株式の2%を保有。3:業務チームのシニアPatelは、兄弟が自身にとって重要な額のHart株を保有していることを知っている。4:Gomezの扶養外の成人の息子がHartの倉庫シフト監督者として勤務(会計・財務諸表への影響なし)。5:業務チームのスタッフKimの配偶者が期間中にHartのコントローラーに昇進。6:Hartの業務に関与したことのない元パートナーWalshがHartのCFOに就任。持分は全額精算済、退職給付は確定額、事務所の活動に参加せず、事務所は馴れ合いの脅威を評価し監査計画を修正した。7:Patelが事務所の別の監査クライアントFirst Lakes銀行から通常の貸付手続・条件で車両担保の自動車ローンを借りた。</p>`,
  rows: [
    { label: "Matter 1 — Rivera's shares(Riveraの株式保有)", type: "select", options: ["Impaired", "Not impaired"], answer: "Impaired" },
    { label: "Matter 2 — Chen's 2% holding(Chenの2%保有)", type: "select", options: ["Impaired", "Not impaired"], answer: "Not impaired" },
    { label: "Matter 3 — Patel's brother's holding(Patelの兄弟の株式保有)", type: "select", options: ["Impaired", "Not impaired"], answer: "Impaired" },
    { label: "Matter 4 — Gomez's son's employment(Gomezの息子の雇用)", type: "select", options: ["Impaired", "Not impaired"], answer: "Not impaired" },
    { label: "Matter 5 — Kim's spouse as controller(Kimの配偶者がコントローラー)", type: "select", options: ["Impaired", "Not impaired"], answer: "Impaired" },
    { label: "Matter 6 — Walsh joins Hart as CFO(WalshのCFO就任)", type: "select", options: ["Impaired", "Not impaired"], answer: "Not impaired" },
    { label: "Matter 7 — Patel's auto loan from a client bank(クライアント銀行からの自動車ローン)", type: "select", options: ["Impaired", "Not impaired"], answer: "Not impaired" },
  ],
  explain: `<p>1:業務執行責任者が業務を行う事務所(オフィス)に所属するパートナーは、業務に関与しなくても対象メンバー(covered member)である。直接的金銭的利害は重要性にかかわらず禁止されるため、独立性は損なわれる。</p>
<p>2:Chenは対象メンバーではない。対象メンバー以外のパートナー・専門職員は、クライアントの発行済持分の<b>10%超</b>を保有すると独立性が損なわれるが、2%は基準内なので損なわれない。</p>
<p>3:兄弟は近親者(close relative)である。業務チームのメンバーが、近親者が本人にとって重要な金銭的利害を保有していると知っている場合、独立性は損なわれる。</p>
<p>4:扶養外の子は近親者であり、近親者が問題となるのは主要な地位(key position)にある場合や重要な金銭的利害を有する場合である。倉庫監督者は主要な地位ではないため損なわれない。</p>
<p>5:配偶者は直近家族(immediate family)であり、業務チームのメンバーの直近家族がクライアントの主要な地位(コントローラー)に就くと独立性は損なわれる。</p>
<p>6:元パートナーがクライアントの主要な地位に就いても、精算済・退職給付確定・事務所活動に不参加等の条件を満たし、脅威を評価して必要な対応(監査計画の修正等)をとれば、独立性は損なわれない。</p>
<p>7:車両担保の自動車ローンは、通常の貸付手続・条件で得たものであれば許容される融資(permitted loan)であり、独立性は損なわれない。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-31", section: "AUD", chapter: "AUD-01", title: "非保証業務の可否:AICPA規程とSEC・PCAOB規則の比較",
  scenario: `<p>Orchard &amp; Pine LLP audits two clients: <b>Maple Foods</b>, a private company (nonissuer) subject to the AICPA Code of Professional Conduct, and <b>Cedar Logistics</b>, an SEC registrant (issuer) subject to SEC and PCAOB independence rules. Both clients have asked the firm to provide the nonattest/nonaudit services below. For Maple Foods, assume management designates an individual with suitable skill, knowledge, and experience to oversee each service, accepts all responsibilities, and the firm documents its understanding (the AICPA general requirements are met). For Cedar Logistics, assume the audit committee would pre-approve any service that is permissible.</p>
<table><tr><th>#</th><th>Requested service</th></tr>
<tr><td>A</td><td>Recording journal entries and maintaining the general ledger from source documents approved by the client</td></tr>
<tr><td>B</td><td>Preparing the entity's federal income tax return, which management reviews, approves, and signs</td></tr>
<tr><td>C</td><td>Designing and developing a new financial information system that aggregates source data underlying the financial statements</td></tr>
<tr><td>D</td><td>Performing internal audit procedures as part of an outsourced internal audit function relating to internal control over financial reporting</td></tr>
<tr><td>E</td><td>Valuing a material intangible asset for financial statement purposes, involving significant subjectivity</td></tr>
<tr><td>F</td><td>Providing personal tax planning to the CFO (a person in a financial reporting oversight role)</td></tr>
<tr><td>G</td><td>Accepting responsibility for signing client checks and holding client cash in a firm-controlled account</td></tr></table>
<p class="ja">Orchard &amp; Pine LLPは、AICPA職業行為規程が適用される非公開会社Maple Foodsと、SEC・PCAOBの独立性規則が適用されるSEC登録会社Cedar Logisticsを監査している。両社から上表の業務の依頼を受けた。Maple Foodsについては、経営者が適切な技能・知識・経験を有する者を監督者に指名し、全責任を引き受け、事務所が理解事項を文書化する(AICPAの一般要件を満たす)と仮定する。Cedar Logisticsについては、許容される業務であれば監査委員会が事前承認すると仮定する。A:クライアント承認済の証憑に基づく仕訳記帳と総勘定元帳の維持。B:連邦法人税申告書の作成(経営者が確認・承認・署名)。C:財務諸表の基礎データを集計する新しい財務情報システムの設計・開発。D:財務報告に係る内部統制に関する内部監査機能の外部委託としての内部監査手続。E:重要な無形資産の財務報告目的の評価(主観性が高い)。F:CFO(財務報告監督者)個人への税務プランニング。G:クライアントの小切手署名とクライアント資金の事務所管理口座での保管。</p>`,
  rows: [
    { label: "Service A — bookkeeping/journal entries(記帳・仕訳)", type: "select", options: ["Permitted for both clients", "Permitted for Maple Foods only", "Prohibited for both clients"], answer: "Permitted for Maple Foods only" },
    { label: "Service B — income tax return preparation(法人税申告書作成)", type: "select", options: ["Permitted for both clients", "Permitted for Maple Foods only", "Prohibited for both clients"], answer: "Permitted for both clients" },
    { label: "Service C — design of financial information system(財務情報システムの設計・開発)", type: "select", options: ["Permitted for both clients", "Permitted for Maple Foods only", "Prohibited for both clients"], answer: "Prohibited for both clients" },
    { label: "Service D — outsourced internal audit (ICFR)(内部監査の外部委託)", type: "select", options: ["Permitted for both clients", "Permitted for Maple Foods only", "Prohibited for both clients"], answer: "Permitted for Maple Foods only" },
    { label: "Service E — valuation with significant subjectivity(主観性の高い重要な評価)", type: "select", options: ["Permitted for both clients", "Permitted for Maple Foods only", "Prohibited for both clients"], answer: "Prohibited for both clients" },
    { label: "Service F — personal tax planning for the CFO(CFO個人の税務プランニング)", type: "select", options: ["Permitted for both clients", "Permitted for Maple Foods only", "Prohibited for both clients"], answer: "Permitted for Maple Foods only" },
    { label: "Service G — signing checks/custody of cash(小切手署名・資金の保管)", type: "select", options: ["Permitted for both clients", "Permitted for Maple Foods only", "Prohibited for both clients"], answer: "Prohibited for both clients" },
  ],
  explain: `<p>AICPA規程(ET 1.295)は、一般要件を満たし経営者の責任を引き受けない限り多くの非保証業務を認める。SEC規則(Regulation S-X Rule 2-01)とPCAOB規則は禁止業務を列挙しており、より厳格である。</p>
<p>A:AICPAでは一般要件を満たせば記帳・仕訳の作成は可能。SECは記帳(bookkeeping)を禁止 → Maple Foodsのみ可。</p>
<p>B:税務申告書の作成は、AICPAでは経営者が承認・署名すれば可。SECでも税務業務は監査委員会の事前承認を条件に許容される → 両社とも可。</p>
<p>C:財務諸表の基礎データを集計する財務情報システムの設計・開発は、AICPAでも独立性を損なう(既製パッケージの導入支援等とは異なる)。SECも禁止 → 両社とも不可。</p>
<p>D:AICPAでは、経営者が内部統制の責任を保持し有能な監督者を指名する等の条件で内部監査支援は可。SECは財務報告に係る内部統制・財務諸表に関する内部監査の外部委託を禁止 → Maple Foodsのみ可。</p>
<p>E:結果が財務諸表に重要で、かつ重大な主観性を伴う評価業務はAICPAでも自己レビューの脅威が大きく独立性を損なう。SECも禁止 → 両社とも不可。</p>
<p>F:PCAOB Rule 3523は、財務報告監督者(およびその直近家族)への税務業務を禁止する。AICPAには同様の禁止はない → Maple Foodsのみ可。</p>
<p>G:小切手への署名やクライアント資産の保管は経営者の責任の引受けであり、AICPAでも独立性を損なう。SECも禁止 → 両社とも不可。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-32", section: "AUD", chapter: "AUD-01", title: "倫理規程のリサーチ:該当するET条項の特定",
  scenario: `<p>You are a manager in the professional standards group of Quill CPAs. Partners have sent the following inquiries. For each, identify the section of the AICPA Code of Professional Conduct (ET) that most directly addresses the matter.</p>
<table><tr><th>#</th><th>Inquiry (email excerpt)</th></tr>
<tr><td>1</td><td>"An audit client, a credit union, offered our engagement senior a home mortgage at a below-market rate. Can she accept it?"</td></tr>
<tr><td>2</td><td>"A software vendor will pay us 10% of the price of any package our compilation clients buy on our recommendation. Is that allowed?"</td></tr>
<tr><td>3</td><td>"A former client refuses to pay our fees and is demanding that we return the client-provided records we still hold. Can we keep them until we are paid?"</td></tr>
<tr><td>4</td><td>"The audit client has not paid last year's audit fee, and we are about to issue this year's report."</td></tr>
<tr><td>5</td><td>"A prospective tax client wants us to work for 20% of any refund we obtain on an amended return."</td></tr>
<tr><td>6</td><td>"The audit client's CEO invited the engagement partner on a week-long resort trip paid by the client."</td></tr>
<tr><td>7</td><td>"A bank wants us to disclose a client's financial information without the client's consent."</td></tr></table>
<p class="ja">あなたはQuill会計事務所の品質管理部門のマネージャーである。パートナーから上表の問い合わせを受けた。各事項を最も直接的に扱うAICPA職業行為規程(ET)の条項を選べ。1:監査クライアントの信用組合がシニアに市場より低金利の住宅ローンを提示。2:ソフトウェア業者が、当事務所の推薦で調製(compilation)クライアントが購入した製品代金の10%を支払うという。3:報酬未払いの元クライアントが、当事務所が保管するクライアント提供資料の返還を要求。支払まで留置できるか。4:監査クライアントが前年の監査報酬を未払いのまま、当年の報告書を発行しようとしている。5:修正申告で得た還付額の20%を報酬とする依頼。6:クライアント負担で業務執行社員を1週間のリゾート旅行に招待。7:銀行がクライアントの同意なく財務情報の開示を求めている。</p>`,
  rows: [
    { label: "Inquiry 1 — below-market mortgage from client(クライアントからの低利住宅ローン)", type: "select", options: ["ET 1.224 Financial Interests", "ET 1.260 Loans", "ET 1.285 Gifts and Entertainment", "ET 1.230 Unpaid Fees", "ET 1.510 Contingent Fees"], answer: "ET 1.260 Loans" },
    { label: "Inquiry 2 — vendor payment for recommendation(推薦の対価)", type: "select", options: ["ET 1.510 Contingent Fees", "ET 1.520 Commissions and Referral Fees", "ET 1.600 Advertising and Other Forms of Solicitation", "ET 1.110 Conflicts of Interest", "ET 1.295 Nonattest Services"], answer: "ET 1.520 Commissions and Referral Fees" },
    { label: "Inquiry 3 — returning client records(クライアント記録の返還)", type: "select", options: ["ET 1.700 Confidential Information", "ET 1.400 Acts Discreditable", "ET 1.230 Unpaid Fees", "ET 1.800 Form of Organization and Name", "ET 1.300 General Standards"], answer: "ET 1.400 Acts Discreditable" },
    { label: "Inquiry 4 — prior-year audit fee unpaid(前年監査報酬の未払い)", type: "select", options: ["ET 1.230 Unpaid Fees", "ET 1.260 Loans", "ET 1.510 Contingent Fees", "ET 1.400 Acts Discreditable", "ET 1.220 Accounting Firms"], answer: "ET 1.230 Unpaid Fees" },
    { label: "Inquiry 5 — fee based on refund obtained(還付額に応じた報酬)", type: "select", options: ["ET 1.520 Commissions and Referral Fees", "ET 1.510 Contingent Fees", "ET 1.230 Unpaid Fees", "ET 1.600 Advertising and Other Forms of Solicitation", "ET 1.100 Integrity and Objectivity"], answer: "ET 1.510 Contingent Fees" },
    { label: "Inquiry 6 — client-paid resort trip(クライアント負担のリゾート旅行)", type: "select", options: ["ET 1.260 Loans", "ET 1.285 Gifts and Entertainment", "ET 1.520 Commissions and Referral Fees", "ET 1.270 Family Relationships With Attest Clients", "ET 1.224 Financial Interests"], answer: "ET 1.285 Gifts and Entertainment" },
    { label: "Inquiry 7 — disclosure without consent(同意なき情報開示)", type: "select", options: ["ET 1.400 Acts Discreditable", "ET 1.700 Confidential Information", "ET 1.110 Conflicts of Interest", "ET 1.300 General Standards", "ET 1.230 Unpaid Fees"], answer: "ET 1.700 Confidential Information" },
  ],
  explain: `<p>1:クライアント(金融機関)からの借入はET 1.260「Loans」で扱う。住宅ローンは許容される融資(自動車ローン等)に該当せず、通常の条件でもない低利融資は独立性を損なう。</p>
<p>2:推薦の対価として受け取る手数料はET 1.520「Commissions and Referral Fees」。調製を含む保証業務のクライアントに関しては受領が禁止される。</p>
<p>3:クライアント記録の返還要求はET 1.400「Acts Discreditable」の解釈(1.400.200 Records Requests)で扱う。報酬未払いでもクライアント提供の記録は留置できない。</p>
<p>4:前年以前の未払報酬はET 1.230「Unpaid Fees」。当期報告書の発行日時点で1年超未払いの報酬は独立性を損なう。</p>
<p>5:成果に応じた報酬はET 1.510「Contingent Fees」。修正申告による還付額に基づく報酬は例外に当たらず禁止される(税務当局の審査に関する場合等を除く)。</p>
<p>6:接待・贈答はET 1.285「Gifts and Entertainment」。合理的範囲を超える接待は独立性を損なう。</p>
<p>7:守秘義務はET 1.700「Confidential Information」。召喚状等の例外を除き、同意なく開示してはならない。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-33", section: "AUD", chapter: "AUD-01", title: "GAGAS(Yellow Book)の脅威の分類とセーフガード",
  scenario: `<p>The <b>Office of the State Auditor (OSA)</b> is planning a financial audit of the State Department of Transportation (DOT) in accordance with <i>Government Auditing Standards</i> (GAGAS). The audit director prepared the following independence worksheet using the GAGAS conceptual framework.</p>
<table><tr><th>#</th><th>Circumstance</th></tr>
<tr><td>1</td><td>Lopez joined OSA three months ago after serving as DOT's budget director. She is assigned to audit the budget execution reports she prepared.</td></tr>
<tr><td>2</td><td>The DOT secretary told OSA that its appropriation request would be opposed unless a finding on contract overruns is removed from the report.</td></tr>
<tr><td>3</td><td>An audit manager has led the DOT audit for 11 consecutive years and vacations annually with DOT's chief financial officer.</td></tr>
<tr><td>4</td><td>An OSA auditor publicly campaigned against the highway program being audited and has stated it is "a waste of taxpayer money."</td></tr>
<tr><td>5</td><td>An OSA senior auditor serves as a voting member of DOT's capital projects committee, which approves construction contracts.</td></tr>
<tr><td>6</td><td>A DOT internal auditor who reports directly to the DOT official in charge of the program being audited is assigned to audit that program.</td></tr></table>
<p>OSA also plans to prepare DOT's financial statements from DOT's adjusted trial balance (a nonaudit service). DOT's deputy CFO, who has suitable skill, knowledge, and experience, will oversee the service.</p>
<p class="ja">州監査局(OSA)は政府監査基準(GAGAS)に準拠した州交通局(DOT)の財務諸表監査を計画している。監査ディレクターはGAGASの概念的枠組みを用いて上表の独立性ワークシートを作成した。1:LopezはDOTの予算部長を務めた後、3か月前にOSAに入局し、自ら作成した予算執行報告書の監査を担当する。2:DOT長官が、契約超過に関する指摘事項を報告書から削除しなければOSAの予算要求に反対すると伝えた。3:監査マネージャーが11年連続でDOT監査を統括し、毎年DOTのCFOと休暇旅行をしている。4:OSAの監査人が監査対象の道路事業に反対する運動を公に行い「税金の無駄」と述べている。5:OSAのシニアがDOTの建設契約を承認する資本プロジェクト委員会の議決権を持つメンバーである。6:監査対象事業の責任者に直属するDOT内部監査人がその事業の監査を担当する。また、OSAはDOTの修正後試算表から財務諸表を作成する(非監査業務)予定で、適切な技能・知識・経験を持つDOT副CFOが監督する。</p>`,
  rows: [
    { label: "Circumstance 1 — threat category(脅威の分類)", type: "select", options: ["Self-interest", "Self-review", "Bias", "Familiarity", "Structural"], answer: "Self-review" },
    { label: "Circumstance 2 — threat category(脅威の分類)", type: "select", options: ["Self-interest", "Bias", "Familiarity", "Undue influence", "Management participation"], answer: "Undue influence" },
    { label: "Circumstance 3 — threat category(脅威の分類)", type: "select", options: ["Self-review", "Bias", "Familiarity", "Undue influence", "Structural"], answer: "Familiarity" },
    { label: "Circumstance 4 — threat category(脅威の分類)", type: "select", options: ["Self-interest", "Self-review", "Bias", "Familiarity", "Management participation"], answer: "Bias" },
    { label: "Circumstance 5 — threat category(脅威の分類)", type: "select", options: ["Self-review", "Bias", "Undue influence", "Management participation", "Structural"], answer: "Management participation" },
    { label: "Circumstance 6 — threat category(脅威の分類)", type: "select", options: ["Self-interest", "Familiarity", "Undue influence", "Management participation", "Structural"], answer: "Structural" },
    { label: "Financial statement preparation — required response(財務諸表作成業務への対応)", type: "select", options: ["No evaluation is needed because preparing statements from a trial balance is always permitted", "Evaluate the threat as significant, apply safeguards such as a review of the audit work by a professional not involved in the service, and document the evaluation", "Decline the audit because GAGAS prohibits any nonaudit service for an audited entity", "Obtain DOT's oral acknowledgment of responsibility; no documentation is required"], answer: "Evaluate the threat as significant, apply safeguards such as a review of the audit work by a professional not involved in the service, and document the evaluation" },
    { label: "If threats in Circumstance 5 cannot be reduced to an acceptable level(許容可能な水準まで低減できない場合)", type: "select", options: ["Disclose the threat in the auditor's report and proceed", "Decline or terminate the audit (or remove the threat, e.g., the auditor leaves the committee before the audit)", "Rely on DOT's audit committee to approve the arrangement", "Proceed, because GAGAS independence rules apply only to audit organization leadership"], answer: "Decline or terminate the audit (or remove the threat, e.g., the auditor leaves the committee before the audit)" },
  ],
  explain: `<p>GAGASの概念的枠組みは脅威を7つに分類する:自己利益、自己レビュー、偏向(bias)、馴れ合い、不当な影響、経営者の職務への関与(management participation)、構造的(structural)。</p>
<p>1:自ら作成した報告書を監査するため、過去の判断・業務を適切に評価できない<b>自己レビューの脅威</b>。</p>
<p>2:予算への反対という圧力で指摘事項の削除を迫るのは<b>不当な影響の脅威</b>。</p>
<p>3:長期関与と被監査側幹部との親密な関係は<b>馴れ合いの脅威</b>。</p>
<p>4:政治的・思想的な立場により客観性を欠くおそれは<b>偏向の脅威</b>。</p>
<p>5:被監査団体の意思決定(契約承認)に参加するのは<b>経営者の職務への関与の脅威</b>。</p>
<p>6:監査組織の組織上の位置づけ(監査対象の責任者への直属)による脅威は<b>構造的脅威</b>。</p>
<p>7:GAGASでは、修正後試算表からの財務諸表作成は重要な(significant)脅威とされ、セーフガード(非関与者によるレビュー等)の適用と評価の文書化が必要である。経営者側に適切なSKEを持つ監督者がいることも前提条件である。</p>
<p>8:セーフガードを適用しても脅威を許容可能な水準まで低減できない場合は、脅威の原因を除去するか、業務を辞退・終了しなければならない。報告書で開示して続行することは認められない。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-34", section: "AUD", chapter: "AUD-01", title: "SEC・PCAOBとAICPAの独立性規則の数値要件と相違",
  scenario: `<p>Sterling Audit LLP has both issuer (SEC registrant) and nonissuer audit clients. A new manager drafted the internal training memo below, leaving blanks for the numeric requirements and several open questions.</p>
<table><tr><th>Topic</th><th>Draft memo text</th></tr>
<tr><td>Partner rotation (issuer)</td><td>The lead and concurring audit partners may serve no more than <b>[1]</b> consecutive years and then must be off the engagement for <b>[2]</b> years. Other audit partners rotate after 7 years with a time-out of <b>[3]</b> years.</td></tr>
<tr><td>Cooling-off (issuer)</td><td>A member of the audit engagement team may not take a financial reporting oversight role at the issuer during the <b>[4]</b>-year period preceding the start of audit procedures without impairing independence.</td></tr>
<tr><td>Credit cards (AICPA)</td><td>A covered member's credit card balances with a client financial institution are permitted if the aggregate outstanding balance is reduced to <b>$[5]</b> or less on a current basis by the payment due date.</td></tr>
<tr><td>Audit committee communication</td><td>Before accepting a new issuer audit and at least annually, the firm must describe in writing to the audit committee all relationships that may reasonably be thought to bear on independence — required by <b>[6]</b>.</td></tr>
<tr><td>Contingent fees</td><td>A contingent fee for a non-tax consulting engagement performed for an audit client is prohibited under <b>[7]</b>.</td></tr></table>
<p class="ja">Sterling Audit LLPは発行体(SEC登録会社)と非発行体の監査クライアントを持つ。新任マネージャーが研修メモを起案し、数値要件と未確定事項を空欄[1]〜[7]とした。パートナー・ローテーション:筆頭・審査パートナーは連続[1]年まで、その後[2]年間離脱。その他の監査パートナーは7年でローテーションし離脱期間は[3]年。クーリングオフ:監査チームのメンバーが監査手続開始前の[4]年間に財務報告監督者の地位に就くと独立性が損なわれる。クレジットカード(AICPA):クライアント金融機関のカード残高は、支払期日までに合計残高を$[5]以下に減らすなら許容される。監査委員会への伝達:新規受嘱前および少なくとも年1回、独立性に関係しうるすべての関係を書面で伝える義務は[6]による。成功報酬:監査クライアントへの税務以外のコンサルティング業務の成功報酬は[7]で禁止される。</p>`,
  rows: [
    { label: "[1] Lead/concurring partner maximum consecutive years(筆頭・審査パートナーの最長連続年数)", type: "num", answer: 5 },
    { label: "[2] Lead/concurring partner time-out years(離脱期間)", type: "num", answer: 5 },
    { label: "[3] Other audit partner time-out years(その他パートナーの離脱期間)", type: "num", answer: 2 },
    { label: "[4] Cooling-off period in years(クーリングオフ期間)", type: "num", answer: 1 },
    { label: "[5] AICPA credit card balance threshold ($)(クレジットカード残高の上限)", type: "num", answer: 10000 },
    { label: "[6] Source of the written audit committee communication requirement(書面伝達義務の根拠)", type: "select", options: ["AICPA ET 1.200", "PCAOB Rule 3526", "AU-C 260 only", "GAGAS chapter 3"], answer: "PCAOB Rule 3526" },
    { label: "[7] Contingent fee for consulting to an audit client is prohibited under(成功報酬を禁止する規則)", type: "select", options: ["SEC/PCAOB rules only", "AICPA Code only", "Both SEC/PCAOB rules and the AICPA Code", "Neither, because the service is not tax-related"], answer: "Both SEC/PCAOB rules and the AICPA Code" },
  ],
  explain: `<p>[1][2]:SEC規則では筆頭(lead)パートナーと審査(concurring)パートナーは5年でローテーションし、5年間のタイムアウトが必要。</p>
<p>[3]:その他の監査パートナー(重要な子会社担当等)は7年でローテーションし、2年間のタイムアウト。</p>
<p>[4]:SECのクーリングオフは1年。監査チームのメンバーが監査手続開始前1年間に財務報告監督者の地位に就くと独立性が損なわれる。AICPAには一律の期間要件はなく、脅威の評価で対応する。</p>
<p>[5]:AICPA ET 1.260では、クレジットカード・当座貸越の合計残高を支払期日までに$10,000以下にすれば許容される融資となる。</p>
<p>[6]:PCAOB Rule 3526は、受嘱前と少なくとも年1回、独立性に影響しうる関係を書面で監査委員会に伝え協議することを求める。</p>
<p>[7]:SEC規則は監査クライアントへのあらゆる成功報酬を禁止する。AICPA ET 1.510も、監査・レビュー・予測財務情報の検証を行うクライアントに対しては、いかなる専門業務についても成功報酬を禁止する。したがって両方で禁止される。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-35", section: "AUD", chapter: "AUD-02", title: "グループ監査の重要性と構成単位の作業範囲の決定",
  scenario: `<p>You are the group engagement team for the audit of <b>Northwind Holdings</b>, a profitable, privately held manufacturer with stable earnings and no history of significant misstatements. Exhibit 1 shows key consolidated data and Exhibit 2 the firm's materiality methodology.</p>
<p><b>Exhibit 1 — Consolidated data (unaudited)</b></p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Revenue</td><td>$120,000,000</td></tr>
<tr><td>Income before taxes from continuing operations</td><td>$8,400,000</td></tr>
<tr><td>Total assets</td><td>$95,000,000</td></tr></table>
<p><b>Exhibit 2 — Firm methodology</b></p>
<table><tr><th>Step</th><th>Policy</th></tr>
<tr><td>Benchmark</td><td>For stable, profitable entities use 5% of income before taxes from continuing operations (alternatives: 0.5% of revenue; 1% of total assets).</td></tr>
<tr><td>Performance materiality</td><td>75% of materiality when risk is low and there is no history of significant misstatements.</td></tr>
<tr><td>Clearly trivial threshold</td><td>5% of materiality.</td></tr>
<tr><td>Component performance materiality</td><td>50% of group performance materiality, for components at which audit procedures are performed on the component's financial information.</td></tr></table>
<p><b>Exhibit 3 — Components</b></p>
<table><tr><th>Component</th><th>Share of group revenue</th><th>Risk assessment</th></tr>
<tr><td>A — Ohio plant</td><td>46%</td><td>Largest operation; risks of material misstatement across most accounts</td></tr>
<tr><td>B — Treasury subsidiary</td><td>4%</td><td>Holds complex derivative contracts; significant risk relating to their valuation</td></tr>
<tr><td>C — Mexico sales office</td><td>3%</td><td>No risks of material misstatement identified</td></tr></table>
<p>During interim work, a misstatement of <b>$18,000</b> was identified at Component C.</p>
<p class="ja">あなたはNorthwind Holdings(収益が安定し、重大な虚偽表示の履歴がない非公開の製造会社)のグループ監査チームである。資料1:連結データ(未監査)— 売上高$120,000,000、継続事業の税引前利益$8,400,000、総資産$95,000,000。資料2:事務所の方法論 — 安定的に利益を計上する企業は税引前利益の5%(代替:売上高の0.5%、総資産の1%)、手続実施上の重要性はリスクが低く重大な虚偽表示の履歴がない場合は重要性の75%、明らかに僅少な金額は重要性の5%、構成単位の財務情報に監査手続を実施する場合の構成単位の手続実施上の重要性はグループの手続実施上の重要性の50%。資料3:構成単位A(オハイオ工場、売上の46%、ほとんどの勘定に重要な虚偽表示リスク)、B(財務子会社、4%、複雑なデリバティブの評価に特別な検討を要するリスク)、C(メキシコ販売拠点、3%、リスクの識別なし)。期中にCで$18,000の虚偽表示を発見した。</p>`,
  rows: [
    { label: "Group materiality ($)(グループの重要性)", type: "num", answer: 420000 },
    { label: "Group performance materiality ($)(グループの手続実施上の重要性)", type: "num", answer: 315000 },
    { label: "Clearly trivial threshold ($)(明らかに僅少な金額の基準)", type: "num", answer: 21000 },
    { label: "Component performance materiality for Component A ($)(構成単位Aの手続実施上の重要性)", type: "num", answer: 157500 },
    { label: "Work for Component A(構成単位Aの作業)", type: "select", options: ["Audit of the component's financial information using component performance materiality", "Specific audit procedures on the derivative balances and related disclosures", "Analytical procedures performed at the group level", "No procedures; exclude the component from the group financial statements"], answer: "Audit of the component's financial information using component performance materiality" },
    { label: "Work for Component B(構成単位Bの作業)", type: "select", options: ["Audit of the component's financial information using component performance materiality", "Specific audit procedures on the derivative balances and related disclosures", "Analytical procedures performed at the group level", "No procedures; exclude the component from the group financial statements"], answer: "Specific audit procedures on the derivative balances and related disclosures" },
    { label: "Work for Component C(構成単位Cの作業)", type: "select", options: ["Audit of the component's financial information using component performance materiality", "Specific audit procedures on the derivative balances and related disclosures", "Analytical procedures performed at the group level", "No procedures; exclude the component from the group financial statements"], answer: "Analytical procedures performed at the group level" },
    { label: "Treatment of the $18,000 misstatement at Component C($18,000の虚偽表示の扱い)", type: "select", options: ["Accumulate it and communicate it to management", "Need not be accumulated because it is below the clearly trivial threshold", "Modify the opinion because it exceeds component materiality", "Report it directly to those charged with governance as a material weakness"], answer: "Need not be accumulated because it is below the clearly trivial threshold" },
  ],
  explain: `<p>重要性:安定的に利益を計上する企業なので税引前利益を基準値とする。8,400,000 × 5% = <b>420,000</b>(参考:売上高基準600,000、総資産基準950,000)。</p>
<p>手続実施上の重要性:420,000 × 75% = <b>315,000</b>。明らかに僅少な金額:420,000 × 5% = <b>21,000</b>。</p>
<p>構成単位Aの手続実施上の重要性:315,000 × 50% = <b>157,500</b>。構成単位の重要性はグループの重要性より低く設定し、集計リスク(各構成単位の未発見虚偽表示が合計でグループの重要性を超えるリスク)に対応する。</p>
<p>A:売上の46%を占め多くの勘定にリスクがあるため、構成単位の財務情報全体に対し構成単位の手続実施上の重要性を用いて監査手続を行う。</p>
<p>B:規模は小さいが、デリバティブの評価に特別な検討を要するリスクがあるため、リスクに焦点を当てた特定の監査手続(デリバティブ残高と開示)を実施する。</p>
<p>C:規模が小さくリスクもないため、グループレベルの分析的手続で足りる。連結対象から除外することはできない。</p>
<p>$18,000は明らかに僅少な金額21,000未満なので、虚偽表示として集計する必要はない。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-36", section: "AUD", chapter: "AUD-02", title: "リスク要因とアサーションの対応・監査手続の選択",
  scenario: `<p>During risk assessment for the December 31 audit of <b>Ridgeline Electronics</b>, a distributor of consumer electronics, the engagement team documented the following in the planning memo.</p>
<table><tr><th>#</th><th>Planning memo excerpt</th></tr>
<tr><td>1</td><td>Several product lines were made obsolete by a competitor's new model in Q4. Management has not updated its inventory reserve methodology since the prior year.</td></tr>
<tr><td>2</td><td>Ridgeline's new term loan requires a current ratio of at least 1.5. The ratio was 1.52 at the end of Q3, and the CFO's bonus depends on covenant compliance.</td></tr>
<tr><td>3</td><td>Sales staff earn quarterly commissions based on shipments recorded through the last day of each quarter. Prior-year audit adjustments related to shipments recorded in the wrong period.</td></tr>
<tr><td>4</td><td>Beginning this year, Ridgeline holds a vendor's goods on consignment in its own warehouse, commingled with company-owned goods.</td></tr></table>
<p class="ja">家電製品の販売会社Ridgeline Electronicsの12月31日決算監査のリスク評価で、監査チームは計画メモに次の事項を記録した。1:第4四半期に競合の新製品によりいくつかの製品ラインが陳腐化したが、経営者は前期から棚卸資産評価引当金の算定方法を見直していない。2:新規タームローンは流動比率1.5以上を要求しており、第3四半期末は1.52、CFOの賞与は財務制限条項の遵守に連動する。3:営業担当者は各四半期末日までに計上された出荷に基づく歩合を受け取る。前期には期間帰属を誤った出荷に関する監査修正があった。4:当期から、仕入先の受託品を自社倉庫で自社所有品と混在して保管している。</p>`,
  rows: [
    { label: "Item 1 — assertion most at risk(最もリスクの高いアサーション)", type: "select", options: ["Existence of inventory", "Valuation and allocation of inventory", "Completeness of inventory", "Rights and obligations of inventory", "Cutoff of purchases"], answer: "Valuation and allocation of inventory" },
    { label: "Item 1 — most responsive procedure(最も有効な手続)", type: "select", options: ["Compare subsequent selling prices and review aging reports to test net realizable value", "Observe the physical inventory count", "Trace shipping documents near year-end to the sales journal", "Examine cash disbursements made after year-end", "Confirm terms with consignors"], answer: "Compare subsequent selling prices and review aging reports to test net realizable value" },
    { label: "Item 2 — assertion most at risk(最もリスクの高いアサーション)", type: "select", options: ["Existence of accounts payable", "Completeness of current liabilities", "Valuation of long-term debt", "Occurrence of expenses", "Rights and obligations of cash"], answer: "Completeness of current liabilities" },
    { label: "Item 2 — most responsive procedure(最も有効な手続)", type: "select", options: ["Confirm recorded accounts payable balances selected from the ledger", "Search for unrecorded liabilities by examining cash disbursements and invoices after year-end", "Vouch recorded sales to shipping documents", "Recalculate depreciation expense", "Test the inventory reserve calculation"], answer: "Search for unrecorded liabilities by examining cash disbursements and invoices after year-end" },
    { label: "Item 3 — assertion most at risk(最もリスクの高いアサーション)", type: "select", options: ["Completeness of revenue", "Cutoff of revenue", "Classification of revenue", "Valuation of receivables", "Presentation of revenue"], answer: "Cutoff of revenue" },
    { label: "Item 3 — most responsive procedure(最も有効な手続)", type: "select", options: ["Compare shipping documents for several days before and after year-end with the period in which sales were recorded", "Perform analytical procedures on annual gross margin", "Confirm the allowance for doubtful accounts with customers", "Inspect the loan agreement", "Search for unrecorded liabilities"], answer: "Compare shipping documents for several days before and after year-end with the period in which sales were recorded" },
    { label: "Item 4 — assertion most at risk(最もリスクの高いアサーション)", type: "select", options: ["Existence of inventory", "Valuation and allocation of inventory", "Rights and obligations of inventory", "Completeness of accounts payable", "Cutoff of sales"], answer: "Rights and obligations of inventory" },
    { label: "Item 4 — most responsive procedure(最も有効な手続)", type: "select", options: ["Test net realizable value of slow-moving items", "Review consignment agreements and confirm consigned goods with the consignor", "Trace receiving reports to the purchases journal", "Recompute the inventory turnover ratio", "Vouch sales to customer orders"], answer: "Review consignment agreements and confirm consigned goods with the consignor" },
  ],
  explain: `<p>1:陳腐化した製品の引当金が未見直し → 棚卸資産の<b>評価と期間配分</b>(過大計上)リスク。対応は事後の販売価格との比較や滞留分析による正味実現可能価額の検証。実地棚卸の立会いは主に実在性への対応である。</p>
<p>2:流動比率の維持に動機があり、流動負債を過小計上(または非流動に分類)するおそれ → 流動負債の<b>網羅性</b>。対応は期末後の支払・請求書を調べる未計上負債の検索。帳簿から選んだ買掛金の確認は実在性向けで、網羅性には有効でない。</p>
<p>3:期末日までの出荷計上に歩合が連動し、前期に期間帰属の修正 → 収益の<b>期間帰属(cutoff)</b>。対応は期末前後数日の出荷書類と売上計上期間の照合(カットオフ・テスト)。</p>
<p>4:受託品が自社在庫と混在 → 自社が所有しない資産を計上するおそれがあり、<b>権利と義務</b>のリスク。対応は委託契約の閲覧と委託者への確認。</p>`,
});
