// AUD のTBS追加(内部統制:ウォークスルー・COSO・統制の分類・不備の評価・統制テストのサンプリング・IT統制・統合監査・AU-C 265・SOC 1・職務分掌)

CPA.tbs({
  id: "TBS-AUD-40", section: "AUD", chapter: "AUD-03", title: "購買・支払サイクルのウォークスルー記述書のレビュー",
  scenario: `<p>You are a senior on the audit of <b>Delmar Supply Co.</b> A staff accountant prepared the following narrative after performing a walkthrough of the purchasing and cash disbursements cycle. Evaluate each paragraph.</p>
<table><tr><th>Para.</th><th>Walkthrough narrative (excerpt)</th></tr>
<tr><td>1</td><td>Department heads submit prenumbered purchase requisitions. The purchasing agent, Morgan, prepares a purchase order only after verifying that the requisition was approved by the budget holder.</td></tr>
<tr><td>2</td><td>Morgan also maintains the approved vendor master file and can add new vendors or change vendor bank account details in the ERP system without any review.</td></tr>
<tr><td>3</td><td>When goods arrive, the receiving clerk counts them and prepares a receiving report using a copy of the purchase order that shows the quantities ordered.</td></tr>
<tr><td>4</td><td>The accounts payable clerk, Ruiz, matches the purchase order, receiving report, and vendor invoice (quantities and prices) before recording the liability.</td></tr>
<tr><td>5</td><td>The treasurer reviews the supporting documents and signs the checks. The documents are then returned to Ruiz and filed by vendor name; they are not stamped or otherwise marked.</td></tr>
<tr><td>6</td><td>Each month, Ruiz, who also records cash disbursements in the cash disbursements journal, prepares the bank reconciliation. No one reviews it.</td></tr></table>
<p class="ja">あなたはDelmar Supply社の監査のシニアである。スタッフが購買・支払サイクルのウォークスルーを行い、上表の記述書を作成した。各段落を評価せよ。1:部門長は連番付きの購買依頼書を提出し、購買担当Morganは予算責任者の承認を確認してから発注書を作成する。2:Morganは承認済み仕入先マスタも管理しており、レビューなしで仕入先の追加や振込口座の変更ができる。3:検収係は発注数量が記載された発注書の写しを用いて数量を数え、検収報告書を作成する。4:買掛金担当Ruizは発注書・検収報告書・請求書(数量・単価)を照合してから債務を計上する。5:財務責任者(トレジャラー)は証憑を確認して小切手に署名し、証憑はRuizに戻され仕入先名順に綴じられるが、支払済の押印等はされない。6:支払仕訳帳への記帳も行うRuizが毎月銀行勘定調整表を作成し、誰もレビューしない。</p>`,
  rows: [
    { label: "Paragraph 1 assessment(段落1の評価)", type: "select", options: ["No weakness — effective control", "Weakness — segregation of duties", "Weakness — receiving count is not blind", "Weakness — supporting documents not canceled", "Weakness — lack of authorization"], answer: "No weakness — effective control" },
    { label: "Paragraph 2 assessment(段落2の評価)", type: "select", options: ["No weakness — effective control", "Weakness — segregation of duties", "Weakness — receiving count is not blind", "Weakness — supporting documents not canceled", "Weakness — lack of authorization"], answer: "Weakness — segregation of duties" },
    { label: "Paragraph 3 assessment(段落3の評価)", type: "select", options: ["No weakness — effective control", "Weakness — segregation of duties", "Weakness — receiving count is not blind", "Weakness — supporting documents not canceled", "Weakness — lack of authorization"], answer: "Weakness — receiving count is not blind" },
    { label: "Paragraph 4 assessment(段落4の評価)", type: "select", options: ["No weakness — effective control", "Weakness — segregation of duties", "Weakness — receiving count is not blind", "Weakness — supporting documents not canceled", "Weakness — lack of authorization"], answer: "No weakness — effective control" },
    { label: "Paragraph 5 assessment(段落5の評価)", type: "select", options: ["No weakness — effective control", "Weakness — segregation of duties", "Weakness — receiving count is not blind", "Weakness — supporting documents not canceled", "Weakness — lack of authorization"], answer: "Weakness — supporting documents not canceled" },
    { label: "Paragraph 6 assessment(段落6の評価)", type: "select", options: ["No weakness — effective control", "Weakness — segregation of duties", "Weakness — receiving count is not blind", "Weakness — supporting documents not canceled", "Weakness — lack of authorization"], answer: "Weakness — segregation of duties" },
    { label: "Misstatement most likely to result from the weakness in paragraph 2(段落2の不備から最も生じやすい虚偽表示・不正)", type: "select", options: ["Payments to fictitious vendors (occurrence of purchases)", "Unrecorded liabilities at year-end (completeness)", "Duplicate payment of the same invoice", "Goods received in damaged condition", "Misclassification of capital expenditures"], answer: "Payments to fictitious vendors (occurrence of purchases)" },
  ],
  explain: `<p>段落1:連番付き依頼書と予算責任者の承認確認があり、承認(authorization)の統制として有効である。不備はない。</p>
<p>段落2:発注権限を持つ者が仕入先マスタの登録・振込口座変更まで行える。承認と記録(マスタ管理)の職務が分離されておらず、架空仕入先を登録して発注・支払に結び付けることが可能になる。職務分掌の不備であり、最も生じやすいのは架空仕入先への支払(購買取引の発生 occurrence)である。</p>
<p>段落3:検収係が発注数量を見ながら数えると、実際に数えずに発注数量を書き写すおそれがある。数量欄を消した「ブラインド・コピー」を使うべきであり、独立した検収の不備である。</p>
<p>段落4:3点照合(three-way match)は計上前の予防的統制として有効である。</p>
<p>段落5:支払後の証憑に「支払済(PAID)」の押印や穴あけ等の取消し処理がされていないため、同じ証憑で再度支払処理される(二重払い)リスクがある。</p>
<p>段落6:支払の記帳者が銀行勘定調整表も作成し、レビューもない。記録と独立的検証(照合)の職務分掌の不備であり、支払の隠ぺいを発見できない。</p>
<p>なお、選択肢の「期末の未計上債務(網羅性)」は検収報告書の未照合ファイル管理の不備から、「二重払い」は段落5の不備から生じやすい。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-41", section: "AUD", chapter: "AUD-03", title: "COSOの5つの構成要素と17原則への統制の対応付け",
  scenario: `<p>Brightwater Health, Inc. uses the <b>COSO Internal Control — Integrated Framework (2013)</b>. The internal audit director listed the following controls and activities and asked you to map them to the framework.</p>
<table><tr><th>#</th><th>Control or activity</th></tr>
<tr><td>A</td><td>The board of directors has an audit committee composed solely of independent directors who meet privately with the external and internal auditors and oversee the financial reporting process.</td></tr>
<tr><td>B</td><td>Before acquiring a clinic chain in a new state, the CFO's team analyzed how the acquisition, new billing system, and new regulations would affect the company's internal control over financial reporting.</td></tr>
<tr><td>C</td><td>Management annually evaluates incentives and pressures (e.g., bonus targets tied to revenue), opportunities, and rationalizations that could lead to fraudulent reporting or misappropriation of assets.</td></tr>
<tr><td>D</td><td>Internal audit performs separate evaluations of billing controls and reports deficiencies, with root causes, to senior management and the audit committee on a timely basis.</td></tr>
<tr><td>E</td><td>An anonymous ethics hotline allows employees to report suspected improprieties directly to the audit committee, bypassing management.</td></tr>
<tr><td>F</td><td>The IT department maintains logical access security and program change controls over the patient billing system.</td></tr></table>
<p>COSO principles (partial list): <b>P2</b> Board exercises oversight responsibility; <b>P5</b> Enforces accountability; <b>P8</b> Assesses fraud risk; <b>P9</b> Identifies and analyzes significant change; <b>P11</b> Selects and develops general controls over technology; <b>P14</b> Communicates internally; <b>P15</b> Communicates externally; <b>P17</b> Evaluates and communicates deficiencies.</p>
<p class="ja">Brightwater Health社はCOSO内部統制の統合的フレームワーク(2013年版)を採用している。内部監査部長が上表の統制・活動をフレームワークに対応付けるよう依頼した。A:独立取締役のみで構成される監査委員会が外部・内部監査人と非公開で会合し財務報告プロセスを監督する。B:他州の診療所チェーン買収の前に、CFOのチームが買収・新請求システム・新規制が財務報告に係る内部統制に与える影響を分析した。C:経営者が毎年、不正な財務報告や資産の流用につながる動機・プレッシャー(売上連動賞与等)、機会、正当化を評価する。D:内部監査が請求統制の独立的評価を行い、不備を根本原因とともに適時に経営幹部と監査委員会へ報告する。E:匿名の倫理ホットラインにより従業員は経営者を経由せず監査委員会へ直接通報できる。F:IT部門が患者請求システムの論理アクセス管理とプログラム変更管理を維持している。原則の一部リストは英文のとおり。</p>`,
  rows: [
    { label: "Item A — COSO component(Aの構成要素)", type: "select", options: ["Control environment", "Risk assessment", "Control activities", "Information and communication", "Monitoring activities"], answer: "Control environment" },
    { label: "Item B — COSO component(Bの構成要素)", type: "select", options: ["Control environment", "Risk assessment", "Control activities", "Information and communication", "Monitoring activities"], answer: "Risk assessment" },
    { label: "Item C — COSO principle(Cの原則)", type: "select", options: ["P2", "P5", "P8", "P9", "P11", "P17"], answer: "P8" },
    { label: "Item D — COSO component(Dの構成要素)", type: "select", options: ["Control environment", "Risk assessment", "Control activities", "Information and communication", "Monitoring activities"], answer: "Monitoring activities" },
    { label: "Item D — COSO principle(Dの原則)", type: "select", options: ["P2", "P5", "P9", "P14", "P15", "P17"], answer: "P17" },
    { label: "Item E — COSO principle(Eの原則)", type: "select", options: ["P2", "P5", "P11", "P14", "P15", "P17"], answer: "P14" },
    { label: "Item F — COSO principle(Fの原則)", type: "select", options: ["P2", "P8", "P9", "P11", "P14", "P17"], answer: "P11" },
  ],
  explain: `<p>COSO 2013の構成要素と原則:統制環境(原則1〜5)、リスク評価(6〜9)、統制活動(10〜12)、情報と伝達(13〜15)、モニタリング活動(16〜17)。</p>
<p>A:取締役会(監査委員会)が経営者から独立して内部統制を監督するのは原則2であり、統制環境に属する。</p>
<p>B:買収・新システム・新規制など内部統制に影響する重要な変化の識別・分析は原則9であり、リスク評価に属する。</p>
<p>C:動機・プレッシャー、機会、正当化(不正のトライアングル)を考慮した不正リスクの評価は原則8(リスク評価)である。</p>
<p>D:独立的評価(separate evaluations)の実施と不備の適時な伝達はモニタリング活動に属する。評価結果の不備を根本原因とともに是正責任者・経営幹部・監査委員会へ伝えるのは原則17である(評価の実施自体は原則16)。</p>
<p>E:通常の報告経路が機能しない場合に備えた別の伝達経路(内部通報制度)は、組織内部への伝達である原則14(情報と伝達)である。外部(規制当局・顧客等)への伝達は原則15である。</p>
<p>F:アクセス管理・変更管理などのIT全般統制の選択・整備は原則11(統制活動)である。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-42", section: "AUD", chapter: "AUD-03", title: "給与サイクルの統制の分類(予防的・発見的/手作業・自動化)",
  scenario: `<p>Corwin Logistics processes a biweekly payroll for 1,200 hourly employees using an integrated HR/payroll system. The following controls were documented during your walkthrough.</p>
<table><tr><th>#</th><th>Control description</th></tr>
<tr><td>1</td><td>The timekeeping module rejects any entry exceeding 80 hours per employee per pay period unless a supervisor enters an override code.</td></tr>
<tr><td>2</td><td>A new employee cannot be paid until the HR manager (who has no payroll duties) reviews the signed offer letter and approves the hire record; payroll then activates the employee.</td></tr>
<tr><td>3</td><td>Each month, the payroll supervisor compares payroll register totals to the general ledger salary expense and accrued payroll accounts and investigates differences over $1,000.</td></tr>
<tr><td>4</td><td>After each payroll run, the system automatically compares paid employees to the HR termination file and flags any payment to a terminated employee on an exception log.</td></tr>
<tr><td>5</td><td>Twice a year, internal audit conducts a surprise payroll distribution, requiring each employee to show photo ID to receive a pay advice; unclaimed pay advices are investigated.</td></tr>
<tr><td>6</td><td>Pay rate fields can be changed only by users with the HR compensation role; payroll clerks have read-only access to pay rates.</td></tr></table>
<p class="ja">Corwin Logistics社は統合人事・給与システムで1,200人の時給従業員の隔週給与を処理している。ウォークスルーで次の統制を文書化した。1:勤怠モジュールは1給与期間に80時間を超える入力を、監督者のオーバーライド・コードがない限り受け付けない。2:人事部長(給与業務なし)が署名済み雇用通知書を確認し採用記録を承認するまで新規従業員に支払えず、承認後に給与担当が有効化する。3:毎月、給与担当責任者が給与台帳の合計を総勘定元帳の給与費用・未払給与と照合し、$1,000超の差異を調査する。4:給与計算の実行後、システムが支払対象者を人事の退職者ファイルと自動照合し、退職者への支払を例外ログに表示する。5:年2回、内部監査が抜き打ちで給与明細を配布し、本人確認書類の提示を求め、受取人不明の明細を調査する。6:給与単価欄は人事の報酬ロールのユーザーのみ変更でき、給与担当者は閲覧のみである。</p>`,
  rows: [
    { label: "Control 1(統制1)", type: "select", options: ["Preventive / Automated", "Preventive / Manual", "Detective / Automated", "Detective / Manual"], answer: "Preventive / Automated" },
    { label: "Control 2(統制2)", type: "select", options: ["Preventive / Automated", "Preventive / Manual", "Detective / Automated", "Detective / Manual"], answer: "Preventive / Manual" },
    { label: "Control 3(統制3)", type: "select", options: ["Preventive / Automated", "Preventive / Manual", "Detective / Automated", "Detective / Manual"], answer: "Detective / Manual" },
    { label: "Control 4(統制4)", type: "select", options: ["Preventive / Automated", "Preventive / Manual", "Detective / Automated", "Detective / Manual"], answer: "Detective / Automated" },
    { label: "Control 5(統制5)", type: "select", options: ["Preventive / Automated", "Preventive / Manual", "Detective / Automated", "Detective / Manual"], answer: "Detective / Manual" },
    { label: "Control 6(統制6)", type: "select", options: ["Preventive / Automated", "Preventive / Manual", "Detective / Automated", "Detective / Manual"], answer: "Preventive / Automated" },
    { label: "Control that most directly detects fictitious (ghost) employees already on the payroll(既に給与台帳に存在する架空従業員を最も直接的に発見する統制)", type: "select", options: ["Control 1", "Control 2", "Control 3", "Control 5", "Control 6"], answer: "Control 5" },
  ],
  explain: `<p>予防的統制は誤謬・不正の発生前に防ぎ、発見的統制は発生後に発見する。自動化統制はシステムが人手を介さず実行し、手作業統制は人が実行する。</p>
<p>統制1:入力時点で80時間超を拒否するシステムのエディット・チェック → 予防的・自動化。</p>
<p>統制2:人事部長による採用承認が支払の前提条件 → 予防的・手作業(承認)。</p>
<p>統制3:事後の月次照合(給与台帳と総勘定元帳)と差異調査 → 発見的・手作業。</p>
<p>統制4:支払後にシステムが自動照合し例外を表示 → 発見的・自動化(例外ログのフォローアップは別途手作業の統制となる)。</p>
<p>統制5:抜き打ちの給与配布で本人確認できない明細を調査 → 発見的・手作業。</p>
<p>統制6:ロールベースのアクセス制限で権限のない単価変更を防ぐ → 予防的・自動化。</p>
<p>架空従業員の発見:統制2は新規登録時の予防、統制6は単価改ざんの防止であり、既に台帳に存在する架空従業員を直接発見できるのは、実在する本人に配布して受取人不明分を調査する統制5である。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-43", section: "AUD", chapter: "AUD-03", title: "補完統制を考慮した内部統制の不備の重大度の評価",
  scenario: `<p>In the audit of <b>Halvorsen Manufacturing</b> (nonissuer) for the year ended December 31, Year 1, overall materiality is <b>$600,000</b>. The firm's methodology states: (a) a <b>material weakness</b> exists when there is a reasonable possibility that a misstatement equal to or greater than materiality will not be prevented, or detected and corrected, on a timely basis; (b) a deficiency whose potential misstatement (after considering effective compensating controls) is at least <b>10% of materiality</b> but below materiality is a <b>significant deficiency</b>; (c) below 10% of materiality, it is a <b>deficiency</b>, unless qualitative indicators of a material weakness exist.</p>
<table><tr><th>#</th><th>Deficiency identified</th></tr>
<tr><td>1</td><td>The shipping cutoff control failed during the year. Average daily shipments are <b>$150,000</b>, and the failure could affect shipments in the last <b>6</b> business days of the year. No compensating control exists.</td></tr>
<tr><td>2</td><td>Checks over $10,000 require a second signature; the second signature was missing on 3 of 60 checks tested. Potential misstatement absent other controls is $400,000. However, the controller reviews all disbursements over $5,000 against supporting documents each month; this compensating control was tested, operates effectively, and would detect any misstatement exceeding <b>$20,000</b>.</td></tr>
<tr><td>3</td><td>Reconciliations of three prepaid expense accounts with balances of <b>$80,000</b>, <b>$65,000</b>, and <b>$55,000</b> were not reviewed. No compensating control exists; the full balances could be misstated.</td></tr>
<tr><td>4</td><td>The auditor discovered that the CFO submitted <b>$15,000</b> of fictitious travel expense reimbursements, which were approved by a subordinate.</td></tr>
<tr><td>5</td><td>Fixed asset additions are not reviewed for proper classification; the maximum potential misstatement is <b>$45,000</b>.</td></tr></table>
<p class="ja">Halvorsen Manufacturing社(非発行体)の1年目12月31日終了年度の監査で、全体の重要性は$600,000である。事務所の方法論:(a)重要性以上の虚偽表示が適時に防止・発見・是正されない合理的な可能性があれば重要な欠陥(material weakness)、(b)有効な補完統制を考慮した潜在的虚偽表示が重要性の10%以上で重要性未満なら重要な不備(significant deficiency)、(c)10%未満なら不備(重要な欠陥の質的兆候がない限り)。1:出荷の期間帰属の統制が機能していなかった。1日平均出荷額$150,000、期末前6営業日の出荷に影響し得る。補完統制なし。2:$10,000超の小切手には2名の署名が必要だが、60件中3件で2人目の署名がなかった。他の統制がなければ潜在的虚偽表示は$400,000。ただしコントローラーが毎月$5,000超の支払を証憑と照合しており、この補完統制は有効に運用され$20,000超の虚偽表示を発見できる。3:残高$80,000、$65,000、$55,000の3つの前払費用勘定の調整表がレビューされていない。補完統制はなく残高全額が虚偽表示となり得る。4:CFOが部下の承認を得て$15,000の架空出張旅費を請求していたことを監査人が発見した。5:固定資産の取得の分類がレビューされておらず、最大の潜在的虚偽表示は$45,000である。</p>`,
  rows: [
    { label: "Deficiency 1 — potential misstatement ($)(不備1の潜在的虚偽表示額)", type: "num", answer: 900000 },
    { label: "Deficiency 1 — severity(不備1の重大度)", type: "select", options: ["Deficiency", "Significant deficiency", "Material weakness"], answer: "Material weakness" },
    { label: "Deficiency 2 — severity(不備2の重大度)", type: "select", options: ["Deficiency", "Significant deficiency", "Material weakness"], answer: "Deficiency" },
    { label: "Deficiency 3 — potential misstatement ($)(不備3の潜在的虚偽表示額)", type: "num", answer: 200000 },
    { label: "Deficiency 3 — severity(不備3の重大度)", type: "select", options: ["Deficiency", "Significant deficiency", "Material weakness"], answer: "Significant deficiency" },
    { label: "Deficiency 4 — severity(不備4の重大度)", type: "select", options: ["Deficiency", "Significant deficiency", "Material weakness"], answer: "Material weakness" },
    { label: "Deficiency 5 — severity(不備5の重大度)", type: "select", options: ["Deficiency", "Significant deficiency", "Material weakness"], answer: "Deficiency" },
    { label: "Deficiencies that AU-C 265 requires to be communicated in writing to those charged with governance(AU-C 265により統治責任者へ書面伝達が必要な不備)", type: "select", options: ["1 and 4 only", "1, 3, and 4 only", "1, 2, 3, and 4 only", "All five deficiencies"], answer: "1, 3, and 4 only" },
  ],
  explain: `<p>判定基準:重要性 $600,000、その10% = $60,000。</p>
<p>不備1:150,000 × 6日 = 900,000。重要性 600,000 以上で補完統制もない → 重要な欠陥。</p>
<p>不備2:補完統制がなければ 400,000(重要な不備の水準)だが、有効に運用されている補完統制(コントローラーの月次レビュー)により発見されずに残る虚偽表示は最大 20,000。20,000 < 60,000 → 不備にとどまる。補完統制は有効性が検証されている場合にのみ考慮できる点が重要である。</p>
<p>不備3:80,000 + 65,000 + 55,000 = 200,000。60,000 以上 600,000 未満 → 重要な不備。</p>
<p>不備4:金額は僅少でも、上級経営者による不正の発見は重要な欠陥の兆候(indicator)であり、トーン・アット・ザ・トップと統制環境への影響から重要な欠陥と判断する。</p>
<p>不備5:45,000 < 60,000 で質的兆候もない → 不備。</p>
<p>伝達:AU-C 265は重要な不備と重要な欠陥を経営者と統治責任者に書面で伝達することを求める。したがって1・3・4が対象である。2と5の不備は、経営者の注意に値すると判断したものを適切な階層の経営者に伝達すればよく(口頭も可)、統治責任者への書面伝達は求められない。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-44", section: "AUD", chapter: "AUD-03", title: "統制テストの属性サンプリング:上限逸脱率の算定と結論",
  scenario: `<p>For the audit of <b>Pemberton Foods</b>, the audit team plans to rely on two revenue/purchasing controls and used statistical attribute sampling with a <b>5% risk of overreliance</b> (risk of assessing control risk too low).</p>
<table><tr><th>Control</th><th>Tolerable deviation rate</th><th>Sample size</th><th>Deviations found</th></tr>
<tr><td>A — Credit approval of sales orders</td><td>6%</td><td>60</td><td>1</td></tr>
<tr><td>B — Three-way match before invoice approval</td><td>7%</td><td>100</td><td>2</td></tr></table>
<p><b>Exhibit — Upper deviation rate (%) at 5% risk of overreliance</b></p>
<table><tr><th>Sample size</th><th>0 dev.</th><th>1 dev.</th><th>2 dev.</th><th>3 dev.</th><th>4 dev.</th></tr>
<tr><td>60</td><td>4.9</td><td>7.7</td><td>10.2</td><td>12.5</td><td>14.7</td></tr>
<tr><td>80</td><td>3.7</td><td>5.8</td><td>7.7</td><td>9.5</td><td>11.1</td></tr>
<tr><td>100</td><td>3.0</td><td>4.7</td><td>6.2</td><td>7.6</td><td>8.9</td></tr></table>
<p>Follow-up on Control B revealed that one of the two deviations occurred because the AP supervisor deliberately approved an invoice for a related-party vendor without a receiving report, overriding the system hold.</p>
<p class="ja">Pemberton Foods社の監査で、監査チームは2つの統制への依拠を計画し、過大信頼のリスク(統制リスクを過小評価するリスク)5%の統計的属性サンプリングを用いた。統制A(受注の与信承認):許容逸脱率6%、サンプル60件、逸脱1件。統制B(請求書承認前の3点照合):許容逸脱率7%、サンプル100件、逸脱2件。上限逸脱率の表は英文のとおり。統制Bの追加調査で、逸脱2件のうち1件は買掛金責任者が関連当事者の仕入先の請求書を検収報告書なしで故意に承認し、システムの保留をオーバーライドしたものと判明した。</p>`,
  rows: [
    { label: "Control A — sample deviation rate (%)(統制Aの標本逸脱率%)", type: "num", answer: 1.67, tol: 0.01 },
    { label: "Control A — upper deviation rate (%)(統制Aの上限逸脱率%)", type: "num", answer: 7.7, tol: 0.01 },
    { label: "Control A — conclusion(統制Aの結論)", type: "select", options: ["Supports planned reliance", "Does not support planned reliance; assess control risk higher and expand substantive procedures", "Increase the tolerable deviation rate to 8% to support reliance", "Inconclusive; the sample deviation rate is below the tolerable rate"], answer: "Does not support planned reliance; assess control risk higher and expand substantive procedures" },
    { label: "Control B — sample deviation rate (%)(統制Bの標本逸脱率%)", type: "num", answer: 2, tol: 0.01 },
    { label: "Control B — upper deviation rate (%)(統制Bの上限逸脱率%)", type: "num", answer: 6.2, tol: 0.01 },
    { label: "Control B — allowance for sampling risk (%)(統制Bのサンプリング・リスクの許容値%)", type: "num", answer: 4.2, tol: 0.01 },
    { label: "Control B — conclusion based on the statistical results alone(統計的結果のみに基づく統制Bの結論)", type: "select", options: ["Supports planned reliance", "Does not support planned reliance", "Inconclusive; increase the sample size"], answer: "Supports planned reliance" },
    { label: "Appropriate response to the intentional deviation in Control B(統制Bの故意の逸脱への適切な対応)", type: "select", options: ["No further action, because the upper deviation rate is below the tolerable rate", "Consider the qualitative aspects, including possible fraud and management override, and reassess reliance and the related risks of material misstatement", "Replace the deviation with another randomly selected item", "Exclude the deviation from the computation as an isolated anomaly"], answer: "Consider the qualitative aspects, including possible fraud and management override, and reassess reliance and the related risks of material misstatement" },
  ],
  explain: `<p>統制A:標本逸脱率 = 1 ÷ 60 = 1.67%。表(サンプル60・逸脱1)より上限逸脱率 7.7%。7.7% > 許容逸脱率6% のため、標本逸脱率が許容逸脱率を下回っていても依拠は支持されない。統制リスクを高く評価し、実証手続の範囲を拡大する。結果を見てから許容逸脱率を引き上げるのは不適切である。</p>
<p>統制B:標本逸脱率 = 2 ÷ 100 = 2.0%。表(サンプル100・逸脱2)より上限逸脱率 6.2%。サンプリング・リスクの許容値 = 6.2 − 2.0 = 4.2%。6.2% ≤ 7% のため統計的には依拠が支持される。</p>
<p>故意の逸脱:監査人は逸脱の件数だけでなく性質と原因(質的側面)を評価しなければならない。故意の逸脱や経営者・責任者によるオーバーライドは不正の兆候であり、上限逸脱率が許容範囲内でも統制への依拠と重要な虚偽表示リスク(特に関連当事者取引)を再評価する必要がある。逸脱を他の標本で置き換えたり、異常値として除外したりしてはならない。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-45", section: "AUD", chapter: "AUD-03", title: "IT全般統制と業務処理統制の区分",
  scenario: `<p>Your firm audits <b>Ostrander Retail Group</b>, which runs its sales, inventory, and payroll processes on a single ERP system. The IT audit specialist documented the controls below.</p>
<table><tr><th>#</th><th>Control</th></tr>
<tr><td>1</td><td>Each quarter, IT security sends business owners a listing of ERP users and roles; owners certify access, and access of terminated or transferred users is removed within 2 days.</td></tr>
<tr><td>2</td><td>Changes to the pricing logic are tested in a separate test environment, approved by the sales business owner, and migrated to production by a release team that does not develop code.</td></tr>
<tr><td>3</td><td>Nightly batch jobs are monitored by the operations team; failed jobs are logged, investigated, and rerun, with resolution documented.</td></tr>
<tr><td>4</td><td>The sales order screen rejects any customer number that does not exist in the customer master file.</td></tr>
<tr><td>5</td><td>The system recalculates each invoice line (quantity &times; master price) and compares run-to-run totals from the sales subledger to the amount posted to the general ledger.</td></tr>
<tr><td>6</td><td>Printed payroll registers are distributed only to authorized recipients, who agree their totals to the batch control totals before releasing payment.</td></tr></table>
<p class="ja">Ostrander Retail Group社は販売・在庫・給与の各プロセスを単一のERPで処理している。IT監査スペシャリストが次の統制を文書化した。1:IT部門が四半期ごとにERPのユーザー・ロール一覧を業務責任者に送り、責任者がアクセスを承認し、退職・異動者のアクセスは2日以内に削除される。2:価格計算ロジックの変更は別のテスト環境でテストされ、販売部門の業務責任者が承認し、コードを開発しないリリース・チームが本番環境へ移行する。3:夜間バッチ処理を運用チームが監視し、失敗したジョブは記録・調査・再実行され、対応が文書化される。4:受注画面は顧客マスタに存在しない顧客番号を受け付けない。5:システムが請求書の各行(数量×マスタ単価)を再計算し、売上補助元帳と総勘定元帳への転記額のラン・ツー・ラン合計を比較する。6:出力された給与台帳は承認された受領者にのみ配布され、受領者は支払前に合計額をバッチ・コントロール・トータルと照合する。</p>`,
  rows: [
    { label: "Control 1(統制1)", type: "select", options: ["ITGC — Access to programs and data", "ITGC — Program changes", "ITGC — Computer operations", "Application — Input control", "Application — Processing control", "Application — Output control"], answer: "ITGC — Access to programs and data" },
    { label: "Control 2(統制2)", type: "select", options: ["ITGC — Access to programs and data", "ITGC — Program changes", "ITGC — Computer operations", "Application — Input control", "Application — Processing control", "Application — Output control"], answer: "ITGC — Program changes" },
    { label: "Control 3(統制3)", type: "select", options: ["ITGC — Access to programs and data", "ITGC — Program changes", "ITGC — Computer operations", "Application — Input control", "Application — Processing control", "Application — Output control"], answer: "ITGC — Computer operations" },
    { label: "Control 4(統制4)", type: "select", options: ["ITGC — Access to programs and data", "ITGC — Program changes", "ITGC — Computer operations", "Application — Input control", "Application — Processing control", "Application — Output control"], answer: "Application — Input control" },
    { label: "Control 5(統制5)", type: "select", options: ["ITGC — Access to programs and data", "ITGC — Program changes", "ITGC — Computer operations", "Application — Input control", "Application — Processing control", "Application — Output control"], answer: "Application — Processing control" },
    { label: "Control 6(統制6)", type: "select", options: ["ITGC — Access to programs and data", "ITGC — Program changes", "ITGC — Computer operations", "Application — Input control", "Application — Processing control", "Application — Output control"], answer: "Application — Output control" },
    { label: "If Control 2 had been ineffective for the entire year, the effect on the auditor's plan to rely on the automated price calculation in Control 5(統制2が通年で有効でなかった場合、統制5の自動計算への依拠への影響)", type: "select", options: ["No effect; automated controls operate consistently once tested", "The auditor may not rely on a single test of the automated control; consider other evidence that it operated consistently throughout the period or reduce reliance and expand substantive procedures", "The auditor must issue an adverse opinion on the financial statements", "The auditor should test only the input control (Control 4) instead"], answer: "The auditor may not rely on a single test of the automated control; consider other evidence that it operated consistently throughout the period or reduce reliance and expand substantive procedures" },
  ],
  explain: `<p>IT全般統制(ITGC)は複数のアプリケーションに共通し、業務処理統制が継続的に機能する基盤となる統制である。主な区分はプログラム・データへのアクセス、プログラム変更、プログラム開発、コンピュータ運用である。業務処理統制は個々の取引処理に関する入力・処理・出力の統制である。</p>
<p>統制1:ユーザーアクセスの定期的な棚卸しと削除 → ITGC(アクセス)。</p>
<p>統制2:テスト・承認・開発と移行の職務分離を伴う変更管理 → ITGC(プログラム変更)。</p>
<p>統制3:バッチジョブの監視と障害対応 → ITGC(コンピュータ運用)。</p>
<p>統制4:マスタに存在しない顧客番号を拒否する妥当性チェック → 業務処理統制(入力)。</p>
<p>統制5:再計算とラン・ツー・ラン合計の照合 → 業務処理統制(処理)。</p>
<p>統制6:出力物の配布制限とコントロール・トータルとの照合 → 業務処理統制(出力)。</p>
<p>依拠への影響:自動化統制は一度テストすれば一貫して機能すると推定できるが、それはプログラム変更管理などのITGCが有効であることが前提である。変更管理が無効なら価格ロジックが期中に無承認で変更された可能性があるため、1回のテストでは期間を通じた運用を示せない。期間を通じた運用の他の証拠を入手するか、依拠を減らして実証手続を拡大する。統制の不備が直ちに財務諸表の否定的意見につながるわけではない。</p>`,
});
