CPA.section({
  id: "AUD",
  name: "Auditing and Attestation",
  ja: "監査および証明業務",
  kind: "必須(Core)",
  color: "#059669",
  exam: { hours: 4, mcq: 78, tbs: 7, weight: "MC 50% / TBS 50%" },
  summary: "監査基準(AICPA の SAS/AU-C、PCAOB の AS)、職業倫理と独立性、内部統制、監査手続、監査報告書、レビュー・コンピレーションなど。計算は少なく、英文の読解力と「なぜその手続か」の理解が問われる。",
  chapters: [
    {
      id: "AUD-01",
      title: "職業倫理と独立性",
      en: "Ethics, Professional Responsibilities and Independence",
      note: `
<h3>1. 適用される基準</h3>
<table><tr><th>対象</th><th>基準設定主体</th></tr>
<tr><td>非公開会社(nonissuer)の監査</td><td>AICPA(ASB)— AU-C</td></tr>
<tr><td>公開会社(issuer)の監査</td><td>PCAOB — AS、SEC の独立性規則</td></tr>
<tr><td>政府監査</td><td>GAO — Yellow Book(GAGAS)</td></tr></table>

<h3>2. 概念的枠組み(<span class="en">Conceptual Framework Approach</span>)</h3>
<p>個別ルールがない状況では、①脅威を識別 → ②重要性を評価 → ③セーフガードで許容可能な水準まで低減。低減できなければ業務を辞退する。</p>
<div class="pt"><b>主な脅威(<span class="en">Threats</span>)</b>
<ul>
<li><b>Self-review</b>:自分が作った記帳・システムを自分で監査する</li>
<li><b>Self-interest</b>:クライアントへの財務的利害</li>
<li><b>Advocacy</b>:クライアントの立場を擁護・宣伝する</li>
<li><b>Familiarity</b>:長期・親密な関係</li>
<li><b>Undue influence</b>:クライアントからの圧力</li>
<li><b>Management participation</b>:経営者の責任を引き受ける</li>
<li><b>Adverse interest</b>:クライアントと対立(訴訟など)</li>
</ul></div>

<h3>3. 独立性(<span class="en">Independence</span>)の要点</h3>
<ul>
<li>対象者(<span class="en">covered member</span>)の<b>直接的</b>な財務的利害は、<b>金額が小さくても独立性を損なう</b>。</li>
<li><b>間接的</b>な財務的利害(投資信託経由など)は、<b>重要な場合のみ</b>独立性を損なう。</li>
<li>非監査業務:経営者の責任を引き受けないこと、経営者に十分な能力のある担当者を置くことなどが条件。</li>
<li>SOX法:公開会社の監査人は、記帳、内部監査の外部委託、財務情報システムの設計・導入、評価業務、法律業務などを提供できない。税務業務は<b>監査委員会の事前承認</b>があれば可。</li>
</ul>

<h3>4. その他の行為規範</h3>
<ul>
<li><b>成功報酬(<span class="en">Contingent fees</span>)</b>:証明業務クライアントからは禁止。<b>原始・修正申告書の作成</b>も禁止。</li>
<li><b>守秘義務</b>:同意なく開示できないが、有効な召喚状(<span class="en">subpoena</span>)、品質管理レビュー、倫理調査への協力は例外。</li>
<li><b>記録の返却</b>:クライアントが提供した記録は、報酬の未払いがあっても返却を求められたら返す。</li>
</ul>
`,
      mcq: [
        {
          q: "Which of the following would impair a covered member's independence with respect to an attest client?",
          ja: "次のうち、証明業務クライアントに対する対象者の独立性を損なうものはどれか。",
          c: [
            "An immaterial indirect financial interest through a diversified mutual fund",
            "An immaterial direct financial interest in the client",
            "A car loan from the client bank obtained under normal lending procedures",
            "A checking account at the client bank that is fully insured",
          ],
          a: 1,
          ex: "直接的な財務的利害は金額の重要性にかかわらず独立性を損なう。間接的利害は重要な場合のみ。通常の条件での自動車ローンや付保された預金口座は認められている。",
        },
        {
          q: "A CPA firm prepares the journal entries and maintains the general ledger for a nonissuer audit client and then audits the resulting financial statements. Which threat to independence is most directly created?",
          ja: "会計事務所が非公開の監査クライアントの仕訳を作成し総勘定元帳を管理したうえで、その財務諸表を監査する。最も直接的に生じる独立性への脅威はどれか。",
          c: ["Advocacy threat", "Familiarity threat", "Self-review threat", "Undue influence threat"],
          a: 2,
          ex: "自分が作成した記録を自分で監査するため自己レビュー(self-review)の脅威。非公開会社なら一定の条件(経営者が責任を負う等)のもとで許容されうるが、公開会社では禁止。",
        },
        {
          q: "Under the AICPA Code of Professional Conduct, a member may NOT accept a contingent fee for:",
          ja: "AICPA職業行為規範において、会員が成功報酬を受け取ってはならないのはどれか。",
          c: [
            "Representing a client in an IRS examination",
            "Preparing an original income tax return",
            "Consulting services for a client for which the firm performs no attest services",
            "Filing an amended return based on a tax issue that is the subject of a test case",
          ],
          a: 1,
          ex: "原始・修正申告書の作成に対する成功報酬は禁止。ただし税務調査での代理や、係争中の論点に基づく還付請求などは例外として認められる。",
        },
        {
          q: "Under the Sarbanes-Oxley Act, which of the following services may an auditor provide to an issuer audit client with audit committee pre-approval?",
          ja: "SOX法のもとで、監査委員会の事前承認があれば公開会社の監査クライアントに提供できる業務はどれか。",
          c: ["Internal audit outsourcing", "Financial information systems design and implementation", "Tax compliance services", "Bookkeeping services"],
          a: 2,
          ex: "税務業務は監査委員会の事前承認があれば提供可能(ただし一部の税務業務は禁止)。内部監査の外部委託、財務情報システムの設計・導入、記帳は禁止業務。",
        },
        {
          q: "A CPA may disclose confidential client information without the client's consent:",
          ja: "公認会計士がクライアントの同意なしに機密情報を開示できるのはどの場合か。",
          c: [
            "To a prospective purchaser of the CPA's practice without a confidentiality agreement",
            "In response to a validly issued and enforceable subpoena",
            "To the client's competitor that requests industry data",
            "To a bank that is considering a loan to the client",
          ],
          a: 1,
          ex: "有効な召喚状への対応は守秘義務の例外。事務所売却の検討では守秘契約が必要。競合他社や銀行への開示はクライアントの同意が必要。",
        },
        {
          q: "When a CPA identifies a threat to compliance with the AICPA Code for which no specific rule exists, the CPA should first:",
          ja: "AICPA規範への準拠に対する脅威を識別したが、具体的な規定が存在しない場合、公認会計士はまず何をすべきか。",
          c: [
            "Withdraw from the engagement immediately",
            "Evaluate the significance of the threat and apply safeguards to reduce it to an acceptable level",
            "Disclose the threat in the auditor's report",
            "Obtain written consent from the client and proceed",
          ],
          a: 1,
          ex: "概念的枠組みアプローチ:脅威の重要性を評価し、許容可能な水準まで低減するセーフガードを適用する。低減できない場合に辞退を検討する。",
        },
      ],
      cards: [
        ["Covered member", "対象者", "独立性規則が適用される業務チームや影響力のある者"],
        ["Direct financial interest", "直接的な財務的利害", "金額にかかわらず独立性を損なう"],
        ["Self-review threat", "自己レビューの脅威", "自分の作業結果を自分で評価する"],
        ["Contingent fee", "成功報酬", "結果に応じて決まる報酬。証明業務・申告書作成で禁止"],
        ["Safeguards", "セーフガード", "脅威を許容可能な水準に下げる措置"],
        ["Audit committee pre-approval", "監査委員会の事前承認", "SOX法で非監査業務に必要"],
      ],
    },
    {
      id: "AUD-02",
      title: "監査計画・重要性・監査リスク",
      en: "Engagement Acceptance, Planning, Materiality and Audit Risk",
      note: `
<h3>1. 契約の受嘱</h3>
<ul>
<li><b>前任監査人とのコミュニケーション</b>:契約を受嘱する<b>前に</b>、クライアントの許可を得て行う(経営者の誠実性、意見の相違、変更の理由など)。</li>
<li><b>契約書(<span class="en">Engagement letter</span>)</b>:業務条件の合意を<b>書面</b>で文書化(目的・範囲、監査人と経営者の責任、限界、報告書の形式)。</li>
</ul>

<h3>2. 監査リスクモデル</h3>
<div class="pt"><b>AR = RMM × DR</b>、RMM = IR × CR<br>
AR(監査リスク)を一定に保つため、<b>RMM が高い → 発見リスク(DR)を低くする</b> → 実証手続を増やす(性質をより強く、時期を期末近くに、範囲を広く)。</div>
<ul>
<li><b>固有リスク(IR)</b>:内部統制がないとした場合の虚偽表示の起こりやすさ</li>
<li><b>統制リスク(CR)</b>:内部統制で防止・発見できないリスク</li>
<li><b>発見リスク(DR)</b>:監査人の手続で発見できないリスク。<b>監査人が唯一コントロールできる</b></li>
</ul>

<h3>3. 重要性(<span class="en">Materiality</span>)</h3>
<ul>
<li>全体としての重要性:例 税引前利益の5%など、ベンチマークに割合を掛けて決める</li>
<li><b>手続実施上の重要性(<span class="en">Performance materiality</span>)</b>:未修正・未発見の虚偽表示の合計が全体の重要性を超える確率を十分に低くするため、<b>全体の重要性より低く</b>設定</li>
<li>明らかに僅少な金額の基準(<span class="en">clearly trivial</span>)</li>
</ul>

<h3>4. 分析的手続と不正</h3>
<ul>
<li>分析的手続は<b>計画段階と最終段階(全般的な結論)で必須</b>。実証手続としては任意。</li>
<li>不正リスクについて<b>チーム内の討議(ブレインストーミング)</b>が必須。</li>
<li><b>収益認識には不正リスクがあると推定</b>する。経営者による内部統制の無効化のリスクは常に存在。</li>
</ul>
`,
      mcq: [
        {
          q: "As the assessed risk of material misstatement increases, the auditor should:",
          ja: "重要な虚偽表示リスクの評価が高まるにつれ、監査人はどうすべきか。",
          c: [
            "Increase the acceptable level of detection risk",
            "Decrease the acceptable level of detection risk",
            "Decrease the extent of substantive procedures",
            "Increase the assessed level of inherent risk",
          ],
          a: 1,
          ex: "AR = RMM × DR。監査リスクを一定に保つため、RMMが高いほど許容できる発見リスクを下げ、実証手続を増やす。",
        },
        {
          q: "Which component of audit risk can the auditor directly control?",
          ja: "監査リスクの構成要素のうち、監査人が直接コントロールできるのはどれか。",
          c: ["Inherent risk", "Control risk", "Detection risk", "Business risk"],
          a: 2,
          ex: "固有リスクと統制リスクは企業側に存在するリスクで、監査人は評価するだけ。発見リスクは監査手続の性質・時期・範囲を変えることでコントロールできる。",
        },
        {
          q: "Communication between a successor auditor and a predecessor auditor should be initiated:",
          ja: "後任監査人と前任監査人とのコミュニケーションはいつ開始すべきか。",
          c: [
            "After the successor has accepted the engagement, without the client's permission",
            "Before the successor accepts the engagement, with the client's permission",
            "Only if the predecessor was dismissed",
            "After the audit report has been issued",
          ],
          a: 1,
          ex: "後任監査人は受嘱前に、クライアントの許可を得たうえで前任監査人に問い合わせる。クライアントが許可しない場合は受嘱を慎重に検討する。",
        },
        {
          q: "Performance materiality is set at an amount:",
          ja: "手続実施上の重要性はどのような金額に設定されるか。",
          c: [
            "Higher than materiality for the financial statements as a whole",
            "Lower than materiality for the financial statements as a whole",
            "Equal to the clearly trivial threshold",
            "Determined by management",
          ],
          a: 1,
          ex: "未修正・未発見の虚偽表示の合計が全体の重要性を超えるリスクを低くするため、手続実施上の重要性は全体の重要性より低く設定する。",
        },
        {
          q: "Analytical procedures are required to be used in which stages of an audit?",
          ja: "分析的手続の実施が求められているのは監査のどの段階か。",
          c: [
            "Planning and substantive testing only",
            "Substantive testing and overall review only",
            "Planning (risk assessment) and overall review near the end of the audit",
            "All three stages: planning, substantive testing, and overall review",
          ],
          a: 2,
          ex: "リスク評価(計画)段階と、監査の最終段階での全般的な結論の形成時に必須。実証手続としての分析的手続は任意。",
        },
        {
          q: "In an audit of financial statements, which risk of material misstatement due to fraud is presumed to exist?",
          ja: "財務諸表監査において、不正による重要な虚偽表示リスクが存在すると推定されるのはどれか。",
          c: ["Risk related to inventory existence", "Risk related to revenue recognition", "Risk related to cash", "Risk related to depreciation"],
          a: 1,
          ex: "監査基準では収益認識に不正リスクがあると推定する(反証できる場合は文書化)。経営者による内部統制の無効化リスクも常に対応が必要。",
        },
      ],
      cards: [
        ["Engagement letter", "監査契約書", "業務条件の書面による合意"],
        ["Predecessor auditor", "前任監査人", "受嘱前にクライアントの許可を得て問い合わせる"],
        ["Risk of material misstatement (RMM)", "重要な虚偽表示リスク", "固有リスク × 統制リスク"],
        ["Detection risk", "発見リスク", "監査人の手続で虚偽表示を発見できないリスク"],
        ["Performance materiality", "手続実施上の重要性", "全体の重要性より低く設定"],
        ["Professional skepticism", "職業的懐疑心", "疑問を持ち、証拠を批判的に評価する姿勢"],
      ],
    },
    {
      id: "AUD-03",
      title: "内部統制",
      en: "Internal Control",
      note: `
<h3>1. COSO フレームワークの5つの構成要素</h3>
<div class="pt">覚え方「<b>CRIME</b>」
<ul>
<li><b>C</b>ontrol environment(統制環境)— 経営者の姿勢(tone at the top)、誠実性、組織構造</li>
<li><b>R</b>isk assessment(リスク評価)</li>
<li><b>I</b>nformation and communication(情報と伝達)</li>
<li><b>M</b>onitoring(モニタリング)</li>
<li><b>E</b>xisting control activities(統制活動)— 承認、照合、職務分掌、物理的管理</li>
</ul></div>

<h3>2. 職務分掌(<span class="en">Segregation of Duties</span>)</h3>
<p>次の3つを別の人に分ける:<b>承認(Authorization)</b>、<b>記録(Recording)</b>、<b>資産の保管(Custody)</b>。<br>例:現金の保管者が入金の記帳もすると、横領を隠せてしまう。</p>

<h3>3. 統制の理解と運用評価手続</h3>
<ul>
<li>すべての監査で、内部統制を<b>理解</b>し、整備状況を評価し、業務に適用されているか確かめる(ウォークスルーなど)。</li>
<li><b>運用評価手続(<span class="en">Tests of controls</span>)</b>は、統制に依拠する(統制リスクを最大未満と評価する)場合、または実証手続だけでは十分な証拠が得られない場合に実施。</li>
</ul>

<h3>4. 不備の区分</h3>
<table><tr><th>区分</th><th>定義</th></tr>
<tr><td>Deficiency</td><td>虚偽表示を適時に防止・発見できない</td></tr>
<tr><td>Significant deficiency</td><td>重要な不備より軽いが、ガバナンス責任者の注意に値する</td></tr>
<tr><td>Material weakness</td><td>重要な虚偽表示が適時に防止・発見されない<b>合理的な可能性(reasonable possibility)</b>がある</td></tr></table>
<p>重要な不備・開示すべき重要な不備は<b>書面</b>で経営者とガバナンス責任者に伝達する。</p>

<h3>5. 統合監査(PCAOB AS 2201)</h3>
<p>公開会社では財務諸表監査と内部統制監査を統合して実施。<b>トップダウン・アプローチ</b>:財務諸表レベル → 全社的統制 → 重要な勘定・開示 → 関連するアサーション → 統制の選択。</p>
`,
      mcq: [
        {
          q: "Which of the following is NOT one of the five components of internal control under the COSO framework?",
          ja: "COSOフレームワークにおける内部統制の5つの構成要素に含まれないものはどれか。",
          c: ["Control environment", "Risk assessment", "Segregation of duties", "Monitoring activities"],
          a: 2,
          ex: "5つの構成要素は統制環境・リスク評価・統制活動・情報と伝達・モニタリング。職務分掌は統制活動の一例であって、構成要素そのものではない。",
        },
        {
          q: "Which combination of duties performed by one employee represents the most serious weakness in internal control over cash receipts?",
          ja: "1人の従業員が担当した場合、現金収入に関する内部統制上最も重大な弱点となる組み合わせはどれか。",
          c: [
            "Opening mail and preparing a remittance list",
            "Custody of cash receipts and recording cash receipts in the accounts receivable ledger",
            "Preparing deposit slips and making deposits",
            "Approving credit and reviewing aging reports",
          ],
          a: 1,
          ex: "資産の保管(現金)と記録(売掛金元帳)の兼務により、着服と記録の改ざんで隠ぺいができてしまう(ラッピング)。",
        },
        {
          q: "An auditor is required to perform tests of controls when:",
          ja: "監査人が運用評価手続を実施しなければならないのはどのような場合か。",
          c: [
            "The auditor assesses control risk at the maximum",
            "The auditor's risk assessment includes an expectation that controls are operating effectively",
            "The client has an internal audit function",
            "The entity is a nonissuer",
          ],
          a: 1,
          ex: "統制が有効に運用されていると期待して依拠する場合(統制リスクを最大未満と評価)、または実証手続だけでは十分な証拠が得られない場合に運用評価手続が必要。",
        },
        {
          q: "A deficiency in internal control such that there is a reasonable possibility that a material misstatement will not be prevented, or detected and corrected, on a timely basis is a:",
          ja: "重要な虚偽表示が適時に防止または発見・是正されない合理的な可能性がある内部統制の不備を何というか。",
          c: ["Control deficiency", "Significant deficiency", "Material weakness", "Management letter comment"],
          a: 2,
          ex: "開示すべき重要な不備(material weakness)の定義。重要な不備(significant deficiency)はそれより軽く、ガバナンス責任者の注意に値するもの。",
        },
        {
          q: "In an integrated audit under PCAOB standards, the auditor should use which approach to select controls to test?",
          ja: "PCAOB基準による統合監査において、監査人は運用評価する統制をどのアプローチで選択すべきか。",
          c: ["Bottom-up approach starting with transaction-level controls", "Top-down approach starting at the financial statement level", "Random selection of controls", "Approach determined by management"],
          a: 1,
          ex: "AS 2201はトップダウン・アプローチを求める。財務諸表レベル → 全社的統制 → 重要な勘定・開示と関連アサーション → 統制の選択。",
        },
        {
          q: "Significant deficiencies and material weaknesses identified during an audit should be communicated:",
          ja: "監査中に識別された重要な不備・開示すべき重要な不備は、どのように伝達すべきか。",
          c: [
            "Orally to the controller only",
            "In writing to management and those charged with governance",
            "In the auditor's opinion paragraph",
            "Only if management requests",
          ],
          a: 1,
          ex: "重要な不備と開示すべき重要な不備は、書面で経営者とガバナンス責任者(監査委員会など)に伝達する。",
        },
      ],
      cards: [
        ["Control environment", "統制環境", "経営者の姿勢・誠実性など。他の構成要素の基礎"],
        ["Segregation of duties", "職務分掌", "承認・記録・保管を分離"],
        ["Tests of controls", "運用評価手続", "統制が有効に運用されているかの検証"],
        ["Walkthrough", "ウォークスルー", "取引を最初から最後まで追跡して統制を理解"],
        ["Material weakness", "開示すべき重要な不備", "重要な虚偽表示の合理的な可能性"],
        ["Top-down approach", "トップダウン・アプローチ", "統合監査での統制選択の方法"],
      ],
    },
    {
      id: "AUD-04",
      title: "監査証拠と監査手続",
      en: "Audit Evidence and Procedures",
      note: `
<h3>1. アサーション(<span class="en">Assertions</span>)</h3>
<table><tr><th>区分</th><th>主なアサーション</th></tr>
<tr><td>取引・事象</td><td>Occurrence(発生)、Completeness(網羅性)、Accuracy(正確性)、Cutoff(期間帰属)、Classification(分類)</td></tr>
<tr><td>期末残高</td><td>Existence(実在性)、Rights & obligations(権利と義務)、Completeness、Accuracy/Valuation & allocation(評価と期間配分)、Classification</td></tr>
<tr><td>表示・開示</td><td>Presentation(表示)</td></tr></table>

<h3>2. 手続の方向</h3>
<div class="pt">
<b>Vouching(証憑突合)</b>:記録 → 証憑。<b>実在性・発生</b>(過大計上)を確かめる。<br>
<b>Tracing(追跡)</b>:証憑 → 記録。<b>網羅性</b>(過少計上)を確かめる。</div>
<ul>
<li>売掛金の<b>確認(<span class="en">Confirmation</span>)</b>:主に実在性</li>
<li>棚卸の<b>立会(<span class="en">Observation</span>)</b>:主に実在性</li>
<li><b>未記録負債の調査</b>(期末後の支払・未払請求書の検討):網羅性</li>
</ul>

<h3>3. 証拠の証明力</h3>
<ul>
<li>外部の独立した情報源から<b>監査人が直接入手</b>した証拠 > 企業経由の証拠</li>
<li>文書による証拠 > 口頭</li>
<li>原本 > コピー</li>
<li>内部統制が有効な状況で作成された内部証拠 > 無効な状況</li>
</ul>

<h3>4. 監査サンプリング</h3>
<table><tr><th>サンプル数を増やす要因</th><th>サンプル数を減らす要因</th></tr>
<tr><td>許容虚偽表示額(tolerable misstatement)が<b>小さい</b></td><td>許容虚偽表示額が大きい</td></tr>
<tr><td>予想虚偽表示額が大きい</td><td>予想虚偽表示額が小さい</td></tr>
<tr><td>RMMが高い/求める確信度が高い</td><td>他の手続から十分な証拠がある</td></tr></table>
<p>誤った受入れのリスク(<span class="en">risk of incorrect acceptance</span>)・統制リスクの過小評価リスクは<b>監査の有効性</b>に関わる(より危険)。誤った棄却のリスクは<b>効率性</b>に関わる。</p>

<h3>5. 経営者確認書(<span class="en">Management Representation Letter</span>)</h3>
<p>日付は<b>監査報告書日</b>と同日。経営者が提出を拒否 → 範囲の制約(通常は意見不表明)。</p>
`,
      mcq: [
        {
          q: "An auditor examines cash disbursements made after year-end to search for unrecorded liabilities. This procedure primarily tests which assertion?",
          ja: "監査人が未記録負債を調査するために期末後の現金支出を検討した。この手続が主に確かめるアサーションはどれか。",
          c: ["Existence", "Completeness", "Valuation", "Rights and obligations"],
          a: 1,
          ex: "期末までに発生していたのに計上されていない負債(過少計上)を探す手続なので、網羅性(completeness)。",
        },
        {
          q: "Selecting recorded sales from the sales journal and vouching them to shipping documents primarily provides evidence about:",
          ja: "売上帳に記録された売上を抽出し、出荷書類と証憑突合する手続は、主に何についての証拠を提供するか。",
          c: ["Completeness of sales", "Occurrence of sales", "Classification of sales", "Presentation of sales"],
          a: 1,
          ex: "記録 → 証憑(vouching)は記録された取引が実際に発生したか(occurrence)を確かめる。網羅性は出荷書類 → 売上帳の追跡(tracing)。",
        },
        {
          q: "Confirmation of accounts receivable primarily provides evidence about which assertion?",
          ja: "売掛金の確認は主にどのアサーションについての証拠を提供するか。",
          c: ["Existence", "Completeness", "Valuation", "Presentation"],
          a: 0,
          ex: "確認は記録された残高に対して得意先が債務を認めるかを確かめるため、主に実在性の証拠となる。回収可能性(評価)の証拠としては弱い。",
        },
        {
          q: "Which of the following types of audit evidence is generally the most reliable?",
          ja: "次のうち、一般に最も証明力が高い監査証拠はどれか。",
          c: [
            "A bank statement obtained from the client",
            "Prenumbered sales invoices prepared by the client",
            "A confirmation received directly by the auditor from an independent third party",
            "Oral representations from the controller",
          ],
          a: 2,
          ex: "外部の独立した情報源から監査人が直接入手した証拠が最も信頼できる。クライアント経由の書類、内部作成の書類、口頭説明の順に証明力が下がる。",
        },
        {
          q: "Which of the following would cause an auditor to increase the sample size for a substantive test of details?",
          ja: "詳細テストのサンプル数を増やす要因となるのはどれか。",
          c: [
            "An increase in tolerable misstatement",
            "A decrease in expected misstatement",
            "A decrease in tolerable misstatement",
            "An increase in the acceptable risk of incorrect acceptance",
          ],
          a: 2,
          ex: "許容虚偽表示額が小さくなる(より小さな虚偽表示も見逃せない)と、サンプル数を増やす必要がある。他の3つはサンプル数を減らす要因。",
        },
        {
          q: "The management representation letter should be dated:",
          ja: "経営者確認書の日付はいつにすべきか。",
          c: ["As of the balance sheet date", "As of the date of the auditor's report", "As of the date the fieldwork began", "As of the date the financial statements are issued"],
          a: 1,
          ex: "経営者確認書は監査報告書日と同じ日付にする(監査報告書日以前で、その日に近い日付であることが求められる)。",
        },
        {
          q: "Observation of the client's physical inventory count primarily provides evidence about:",
          ja: "クライアントの実地棚卸への立会は、主に何についての証拠を提供するか。",
          c: ["Existence of inventory", "Ownership of consigned goods", "Valuation at lower of cost and NRV", "Classification of inventory"],
          a: 0,
          ex: "立会は記録された在庫が実在するかの最良の証拠。所有権(権利と義務)や評価については別の手続が必要。",
        },
      ],
      cards: [
        ["Assertion", "アサーション", "経営者が財務諸表で暗黙に主張している事項"],
        ["Vouching", "証憑突合", "記録 → 証憑。実在性・発生"],
        ["Tracing", "追跡", "証憑 → 記録。網羅性"],
        ["Confirmation", "確認", "第三者から直接回答を得る手続"],
        ["Tolerable misstatement", "許容虚偽表示額", "小さいほどサンプル数が増える"],
        ["Management representation letter", "経営者確認書", "監査報告書日付で経営者から入手"],
      ],
    },
    {
      id: "AUD-05",
      title: "監査報告とその他の業務",
      en: "Reporting and Other Engagements",
      note: `
<h3>1. 監査意見の種類</h3>
<table><tr><th>状況</th><th>重要だが広範でない</th><th>重要かつ広範</th></tr>
<tr><td>重要な虚偽表示(GAAP違反)</td><td>限定付適正意見(<span class="en">Qualified</span>)</td><td><b>不適正意見(<span class="en">Adverse</span>)</b></td></tr>
<tr><td>十分かつ適切な証拠が得られない(範囲の制約)</td><td>限定付適正意見</td><td><b>意見不表明(<span class="en">Disclaimer</span>)</b></td></tr></table>

<h3>2. 意見を変えずに追加する区分</h3>
<ul>
<li><b>継続企業の前提に関する重要な疑義</b>:適切に開示されていれば無限定意見+<b>独立した区分(Going concern section)</b>。開示が不十分なら限定・不適正。</li>
<li><b>強調事項(<span class="en">Emphasis-of-matter</span>)</b>:財務諸表に適切に表示・開示されている事項を強調。</li>
<li><b>その他の事項(<span class="en">Other-matter</span>)</b>:財務諸表に表示されていないが利用者の理解に関連する事項。</li>
<li>首尾一貫性(会計方針の変更が適切な場合)は強調事項として記載。</li>
</ul>

<h3>3. KAM と CAM</h3>
<p><b>CAM(<span class="en">Critical Audit Matters</span>)</b>:PCAOB監査で記載が求められる(一部の企業を除く)。<b>KAM(<span class="en">Key Audit Matters</span>)</b>:AICPA基準では<b>記載を依頼された場合</b>のみ。</p>

<h3>4. 後発事象(<span class="en">Subsequent Events</span>)</h3>
<ul>
<li><b>Type 1(認識される事象)</b>:期末日に存在した状況についての追加証拠 → 財務諸表を<b>修正</b>(例:期末日に存在した顧客の財務悪化による期末後の倒産)</li>
<li><b>Type 2(認識されない事象)</b>:期末日後に生じた状況 → <b>注記</b>(例:期末後の火災、株式発行)</li>
</ul>
<p>監査報告書日は、十分かつ適切な証拠を入手した日より前にはできない。</p>

<h3>5. その他の業務(SSARS)</h3>
<table><tr><th>業務</th><th>保証の程度</th><th>独立性</th></tr>
<tr><td>監査(Audit)</td><td>合理的保証(高い)</td><td>必要</td></tr>
<tr><td>レビュー(Review)</td><td><b>限定的保証</b>(質問と分析的手続が中心)</td><td>必要</td></tr>
<tr><td>コンピレーション(Compilation)</td><td><b>保証なし</b></td><td>不要(欠如は開示)</td></tr>
<tr><td>財務諸表の作成(Preparation)</td><td>保証なし・報告書なし</td><td>不要</td></tr></table>
`,
      mcq: [
        {
          q: "When financial statements contain a material misstatement whose effects are pervasive, the auditor should express:",
          ja: "財務諸表に重要かつ広範な影響を及ぼす虚偽表示がある場合、監査人はどのような意見を表明すべきか。",
          c: ["A qualified opinion", "An adverse opinion", "A disclaimer of opinion", "An unmodified opinion with an emphasis-of-matter paragraph"],
          a: 1,
          ex: "虚偽表示が重要かつ広範 → 不適正意見(adverse)。重要だが広範でなければ限定付適正意見。",
        },
        {
          q: "An auditor is unable to obtain sufficient appropriate audit evidence about an account. The possible effects are material but not pervasive. The auditor should express:",
          ja: "監査人はある勘定について十分かつ適切な監査証拠を入手できなかった。影響は重要だが広範ではない。監査人はどのような意見を表明すべきか。",
          c: ["An adverse opinion", "A disclaimer of opinion", "A qualified opinion", "An unmodified opinion"],
          a: 2,
          ex: "範囲の制約で重要だが広範でない → 限定付適正意見。広範であれば意見不表明(disclaimer)。",
        },
        {
          q: "An auditor concludes that substantial doubt exists about the entity's ability to continue as a going concern, and the matter is adequately disclosed. The auditor's report should include:",
          ja: "監査人は継続企業の前提に重要な疑義があると結論づけ、その事項は適切に開示されている。監査報告書にはどのような記載が必要か。",
          c: [
            "An adverse opinion",
            "A qualified opinion",
            "An unmodified opinion with a separate going concern section",
            "A disclaimer of opinion in all cases",
          ],
          a: 2,
          ex: "適切に開示されていれば意見は変えず(無限定)、継続企業に関する独立した区分を設ける。開示が不十分な場合は意見の修正が必要。",
        },
        {
          q: "After the balance sheet date but before the report date, the auditor learns that a major customer filed for bankruptcy due to a deteriorating financial condition that existed at year-end. The client should:",
          ja: "期末日後・監査報告書日前に、主要顧客が期末時点ですでに存在した財務状況の悪化により破産したことが判明した。クライアントはどうすべきか。",
          c: [
            "Disclose the event in the notes only",
            "Adjust the financial statements",
            "Take no action because it occurred after year-end",
            "Report it as a change in accounting principle",
          ],
          a: 1,
          ex: "期末日に存在した状況(顧客の財務悪化)についての追加証拠なので、Type 1(認識される後発事象)。売掛金の評価を修正する。",
        },
        {
          q: "A review engagement of a nonissuer's financial statements under SSARS provides:",
          ja: "SSARSに基づく非公開会社の財務諸表のレビュー業務は何を提供するか。",
          c: ["Reasonable assurance", "Limited assurance", "No assurance", "Absolute assurance"],
          a: 1,
          ex: "レビューは主に質問と分析的手続による限定的保証。監査は合理的保証、コンピレーションは保証なし。",
        },
        {
          q: "Which of the following engagements does NOT require the accountant to be independent?",
          ja: "次のうち、会計士の独立性が求められない業務はどれか。",
          c: ["Audit of financial statements", "Review of financial statements", "Compilation of financial statements", "Examination of prospective financial information"],
          a: 2,
          ex: "コンピレーションは独立性がなくても実施できる(独立性の欠如を報告書で開示する)。監査・レビュー・検証業務は独立性が必要。",
        },
      ],
      cards: [
        ["Unmodified opinion", "無限定適正意見", "財務諸表がすべての重要な点で適正"],
        ["Qualified opinion", "限定付適正意見", "重要だが広範でない問題"],
        ["Adverse opinion", "不適正意見", "重要かつ広範な虚偽表示"],
        ["Disclaimer of opinion", "意見不表明", "重要かつ広範な範囲の制約"],
        ["Emphasis-of-matter paragraph", "強調事項区分", "適切に開示された事項に注意を促す"],
        ["Critical audit matter (CAM)", "監査上の重要事項(PCAOB)", "監査委員会に伝達した事項のうち特に重要なもの"],
      ],
    },
  ],
});
