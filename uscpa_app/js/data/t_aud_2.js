// AUD のTBS追加(内部統制:ウォークスルー・COSO・統制の分類・不備の評価・統制テストのサンプリング・IT統制・統合監査・AU-C 265・SOC 1・職務分掌)

CPA.tbs({
  id: "TBS-AUD-40", section: "AUD", chapter: "AUD-03", title: "購買・支払サイクルのウォークスルー記述書のレビュー",
  scenario: `<p>You are a senior on the audit of <b>Delmar Supply Co.</b> A staff accountant prepared the following narrative after performing a walkthrough of the purchasing and cash disbursements cycle. Evaluate each paragraph.</p>
<table><tr><th>Para.</th><th>Walkthrough narrative (excerpt)</th></tr>
<tr><td>1</td><td>Department heads submit prenumbered purchase requisitions. The purchasing agent, Morgan, prepares a purchase order only after verifying that the requisition was approved by the budget holder.</td></tr>
<tr><td>2</td><td>Morgan also maintains the approved vendor master file and can add new vendors or change vendor bank account details in the ERP system.</td></tr>
<tr><td>3</td><td>When goods arrive, the receiving clerk counts them and prepares a receiving report using a copy of the purchase order that shows the quantities ordered.</td></tr>
<tr><td>4</td><td>The accounts payable clerk, Ruiz, matches the purchase order, receiving report, and vendor invoice (quantities and prices) before recording the liability.</td></tr>
<tr><td>5</td><td>The treasurer reviews the supporting documents and signs the checks. The documents are then returned to Ruiz and filed by vendor name; they are not stamped or otherwise marked.</td></tr>
<tr><td>6</td><td>Each month, Ruiz, who also records cash disbursements in the cash disbursements journal, prepares the bank reconciliation. No one reviews it.</td></tr></table>
<p class="ja">あなたはDelmar Supply社の監査のシニアである。スタッフが購買・支払サイクルのウォークスルーを行い、上表の記述書を作成した。各段落を評価せよ。1:部門長は連番付きの購買依頼書を提出し、購買担当Morganは予算責任者の承認を確認してから発注書を作成する。2:Morganは承認済み仕入先マスタも管理しており、仕入先の追加や振込口座の変更ができる。3:検収係は発注数量が記載された発注書の写しを用いて数量を数え、検収報告書を作成する。4:買掛金担当Ruizは発注書・検収報告書・請求書(数量・単価)を照合してから債務を計上する。5:財務責任者(トレジャラー)は証憑を確認して小切手に署名し、証憑はRuizに戻され仕入先名順に綴じられるが、支払済の押印等はされない。6:支払仕訳帳への記帳も行うRuizが毎月銀行勘定調整表を作成し、誰もレビューしない。</p>`,
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

CPA.tbs({
  id: "TBS-AUD-46", section: "AUD", chapter: "AUD-03", title: "統合監査(AS 2201):トップダウン・アプローチと報告",
  scenario: `<p>Your firm is performing an integrated audit of <b>Lindqvist Technologies, Inc.</b>, an accelerated filer, for the year ended December 31, Year 1, under <b>PCAOB AS 2201</b>. Planning materiality is <b>$1,000,000</b>. Excerpts from the planning memo and year-end status notes follow.</p>
<table><tr><th>Item</th><th>Planning memo / status note</th></tr>
<tr><td>1</td><td>Account data: Revenue $84M; Inventory $19M; Prepaid insurance $40,000 (no unusual risk factors); Litigation reserve and related disclosure $600,000 (a patent lawsuit with significant judgment about the probability and amount of loss).</td></tr>
<tr><td>2</td><td>The team proposes to begin by selecting individual transaction-level controls over revenue and then work upward to the entity level.</td></tr>
<tr><td>3</td><td>The team will perform a walkthrough of the revenue process, following a transaction from origination through recording.</td></tr>
<tr><td>4</td><td>In Q4, the team identified a material weakness in the period-end financial reporting process. Management corrected all resulting misstatements, and substantive procedures provided sufficient appropriate evidence that the financial statements are fairly presented. Management's report discloses the material weakness and concludes ICFR is not effective.</td></tr>
<tr><td>5</td><td>The partner asks when and how the material weakness must be communicated to the audit committee.</td></tr></table>
<p class="ja">あなたの事務所は早期提出会社Lindqvist Technologies社の1年目12月31日終了年度の統合監査をPCAOB AS 2201に基づき実施している。計画上の重要性は$1,000,000。1:勘定データ — 売上高$84M、棚卸資産$19M、前払保険料$40,000(特段のリスク要因なし)、訴訟引当金と関連開示$600,000(損失の発生可能性と金額に重要な判断を伴う特許訴訟)。2:チームは売上の取引レベルの統制から選定を始め、全社的レベルへと積み上げることを提案している。3:売上プロセスについて取引の発生から記録までを追跡するウォークスルーを行う。4:第4四半期に決算・財務報告プロセスで重要な欠陥を識別した。経営者は生じた虚偽表示をすべて修正し、実証手続により財務諸表の適正表示について十分かつ適切な証拠を得た。経営者報告書は重要な欠陥を開示しICFRは有効でないと結論している。5:パートナーは重要な欠陥を監査委員会にいつ、どのように伝達すべきかを尋ねている。</p>`,
  rows: [
    { label: "Item 1 — Account that is significant even though its amount is below planning materiality(計画上の重要性未満でも重要な勘定となるもの)", type: "select", options: ["Prepaid insurance", "Litigation reserve and related disclosure", "Neither; only accounts exceeding materiality can be significant", "Both"], answer: "Litigation reserve and related disclosure" },
    { label: "Item 2 — Correct starting point under the top-down approach(トップダウン・アプローチの正しい出発点)", type: "select", options: ["Transaction-level controls over the highest-volume accounts", "The financial statement level and the auditor's understanding of overall risks to ICFR, then entity-level controls", "Management's list of key controls, tested in the order provided", "IT general controls over all systems"], answer: "The financial statement level and the auditor's understanding of overall risks to ICFR, then entity-level controls" },
    { label: "Item 3 — Primary purpose of the walkthrough(ウォークスルーの主な目的)", type: "select", options: ["To provide sufficient evidence of operating effectiveness for the entire year", "To understand the likely sources of misstatement and evaluate the design and implementation of controls", "To substitute for substantive tests of revenue", "To determine planning materiality"], answer: "To understand the likely sources of misstatement and evaluate the design and implementation of controls" },
    { label: "Item 4 — Opinion on ICFR(ICFRに対する意見)", type: "select", options: ["Unqualified", "Qualified", "Adverse", "Disclaimer"], answer: "Adverse" },
    { label: "Item 4 — Opinion on the financial statements(財務諸表に対する意見)", type: "select", options: ["Unqualified", "Qualified", "Adverse", "Disclaimer"], answer: "Unqualified" },
    { label: "Item 4 — Dating of the two reports(2つの報告書の日付)", type: "select", options: ["The ICFR report is dated as of December 31, Year 1", "Both reports must bear the same date", "The ICFR report must be dated later than the financial statement report", "The dates may differ by up to 60 days"], answer: "Both reports must bear the same date" },
    { label: "Item 5 — Communication of the material weakness to the audit committee(重要な欠陥の監査委員会への伝達)", type: "select", options: ["Orally, at any time before the next year's audit begins", "In writing, prior to the issuance of the auditor's report on ICFR", "In writing, within 60 days after the report release date", "Communication is unnecessary because management's report discloses it"], answer: "In writing, prior to the issuance of the auditor's report on ICFR" },
  ],
  explain: `<p>重要な勘定:AS 2201では、勘定・開示が重要かどうかは金額だけでなく質的なリスク要因(複雑さ、判断の程度、偶発事象など)で判断する。訴訟引当金は$600,000と重要性未満だが、損失見積りに重要な判断を伴い虚偽表示が重要となる合理的な可能性があるため重要な勘定・開示である。前払保険料は僅少でリスク要因もないため重要ではない。</p>
<p>トップダウン:財務諸表レベルからICFR全体のリスクを理解し、全社的統制(entity-level controls)を評価し、次に重要な勘定・開示と関連するアサーションを識別し、虚偽表示の発生源を理解したうえで検証する統制を選定する。取引レベルから積み上げるのは逆である。</p>
<p>ウォークスルー:虚偽表示の発生しうる箇所の理解の確認と統制のデザイン・業務への適用の評価が目的であり、通年の運用評価の十分な証拠にはならない。</p>
<p>報告:期末日時点で重要な欠陥が存在すればICFRには否定的意見(adverse)を表明する。一方、虚偽表示が修正され実証手続で十分な証拠を得ていれば、財務諸表には無限定適正意見を表明できる。ICFRと財務諸表の報告書(別個の報告書の場合)は同じ日付としなければならない。</p>
<p>伝達:AS 2201は重要な欠陥(および重要な不備)を、ICFRの監査報告書の発行前に、書面で経営者と監査委員会に伝達することを求める。経営者の報告書に開示されていても伝達は省略できない。60日以内という期限はAU-C 265(非発行体)の規定である。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-47", section: "AUD", chapter: "AUD-03", title: "AU-C 265に基づく内部統制の不備の伝達文書のレビュー",
  scenario: `<p>The audit of <b>Rourke Distributors, LLC</b> (nonissuer) was completed and the auditor's report release date was <b>March 10, Year 2</b>. A staff member drafted the communication of internal control matters and a cover memo. Review the bracketed items.</p>
<table><tr><th>Ref.</th><th>Draft wording</th></tr>
<tr><td>[A]</td><td>Addressed "To the Members and Lenders of Rourke Distributors, LLC."</td></tr>
<tr><td>[B]</td><td>"In planning and performing our audit, we considered internal control as a basis for designing audit procedures and to express an opinion on the effectiveness of the Company's internal control."</td></tr>
<tr><td>[C]</td><td>"A material weakness is a deficiency, or combination of deficiencies, in internal control such that there is a <i>remote</i> possibility that a material misstatement will not be prevented, or detected and corrected, on a timely basis."</td></tr>
<tr><td>[D]</td><td>"A significant deficiency is a deficiency, or a combination of deficiencies, in internal control that is <i>more severe than a material weakness</i>."</td></tr>
<tr><td>[E]</td><td>"A significant deficiency in inventory reconciliations is not reported here because management remediated it in February, Year 2."</td></tr>
<tr><td>[F]</td><td>"We are pleased to report that no other significant deficiencies exist."</td></tr>
<tr><td>[G]</td><td>Cover memo: "The letter will be delivered by <i>July 8, Year 2 (120 days after the report release date)</i>."</td></tr></table>
<p class="ja">Rourke Distributors社(非発行体)の監査が完了し、監査報告書の発行日(report release date)は2年目3月10日である。スタッフが内部統制に関する事項の伝達文書とカバー・メモを起案した。[A]宛先が「社員および貸手各位」。[B]「監査の計画と実施にあたり、監査手続を立案する基礎として、また会社の内部統制の有効性に意見を表明するために内部統制を検討した。」[C]重要な欠陥の定義で「僅少な(remote)可能性」。[D]重要な不備の定義で「重要な欠陥より重大な」。[E]棚卸資産の調整に関する重要な不備は2年目2月に経営者が是正したので記載しない。[F]「その他の重要な不備は存在しないことを報告する。」[G]カバー・メモ:「報告書発行日から120日後の2年目7月8日までに提出する。」</p>`,
  rows: [
    { label: "[A] Appropriate addressees(適切な宛先)", type: "select", options: ["Members and lenders", "Management and those charged with governance", "The state licensing board", "Any party requesting a copy"], answer: "Management and those charged with governance" },
    { label: "[B] Correct wording(正しい文言)", type: "select", options: ["Keep as drafted", "\"...but not for the purpose of expressing an opinion on the effectiveness of internal control. Accordingly, we do not express an opinion on the effectiveness of internal control.\"", "\"...and we provide limited assurance on internal control.\"", "\"...and we conclude that internal control is effective.\""], answer: "\"...but not for the purpose of expressing an opinion on the effectiveness of internal control. Accordingly, we do not express an opinion on the effectiveness of internal control.\"" },
    { label: "[C] Replacement for \"remote\"(「remote」の置換)", type: "select", options: ["remote (no change)", "reasonable", "probable", "more than remote but less than likely"], answer: "reasonable" },
    { label: "[D] Replacement for \"more severe than a material weakness\"(「重要な欠陥より重大な」の置換)", type: "select", options: ["equal in severity to a material weakness", "less severe than a material weakness, yet important enough to merit attention by those charged with governance", "that results in a misstatement exceeding materiality", "identified by management rather than the auditor"], answer: "less severe than a material weakness, yet important enough to merit attention by those charged with governance" },
    { label: "[E] Treatment of the remediated inventory deficiency(是正済みの棚卸資産の不備の取扱い)", type: "select", options: ["Omit, because it was remediated", "Include it, because significant deficiencies identified during the audit must be communicated even if remediated", "Communicate orally only", "Report it only if it recurs next year"], answer: "Include it, because significant deficiencies identified during the audit must be communicated even if remediated" },
    { label: "[F] Treatment of the statement(この記述の取扱い)", type: "select", options: ["Keep as drafted", "Delete; the auditor should not issue a written communication stating that no significant deficiencies were identified", "Change to \"no material weaknesses exist\"", "Move it to the auditor's report on the financial statements"], answer: "Delete; the auditor should not issue a written communication stating that no significant deficiencies were identified" },
    { label: "[G] Latest permissible delivery date(提出の最終期限)", type: "select", options: ["March 10, Year 2", "April 9, Year 2", "May 9, Year 2", "July 8, Year 2"], answer: "May 9, Year 2" },
  ],
  explain: `<p>[A]:AU-C 265の書面伝達は経営者と統治責任者宛てであり、利用は経営者・統治責任者・組織内の者(および該当する場合は規制当局)に制限される旨のアラートを付す。貸手は宛先とならない。</p>
<p>[B]:財務諸表監査では内部統制は手続立案の基礎として検討するにとどまり、内部統制の有効性に対する意見表明目的ではない。その旨と意見を表明しない旨を記載する。</p>
<p>[C]:重要な欠陥の定義は「重要な虚偽表示が適時に防止または発見・是正されない合理的な可能性(reasonable possibility)がある」不備である。</p>
<p>[D]:重要な不備は「重要な欠陥ほど重大ではないが、統治責任者の注意に値するほど重要な」不備である。</p>
<p>[E]:監査中に識別された重要な不備・重要な欠陥は、監査期間中に是正されたものも含めて伝達しなければならない。</p>
<p>[F]:「重要な不備は存在しない」といった書面を発行してはならない。財務諸表監査の範囲では、そのような保証を与える根拠がなく誤解を招くためである。</p>
<p>[G]:書面伝達は報告書発行日までに行うのが望ましいが、遅くとも報告書発行日の60日後までに行う。3月10日 + 60日:3月の残り21日 + 4月30日 = 51日、残り9日 → 5月9日。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-48", section: "AUD", chapter: "AUD-03", title: "ユーザー監査人によるSOC 1報告書の利用",
  scenario: `<p><b>Tamsin Home Goods</b> (nonissuer, year end December 31, Year 1) outsources payroll processing to <b>PayCore Services</b>. The auditor of Tamsin (the user auditor) plans to rely on controls at PayCore to reduce substantive testing of payroll expense. PayCore provided the following report.</p>
<table><tr><th>Feature of PayCore's report</th><th>Detail</th></tr>
<tr><td>Report type</td><td>SOC 1 <b>Type 2</b> report on the description of PayCore's system and the suitability of design and operating effectiveness of controls</td></tr>
<tr><td>Period covered</td><td>January 1, Year 1 through <b>September 30, Year 1</b></td></tr>
<tr><td>Complementary user entity controls</td><td>"User entities should review payroll registers for accuracy and approve them before funds are released."</td></tr>
<tr><td>Subservice organization</td><td>PayCore uses DataHarbor for hosting; DataHarbor's controls are excluded from the description (<b>carve-out method</b>).</td></tr>
<tr><td>Service auditor's opinion</td><td>Qualified for deviations in PayCore's control over changes to tax tables.</td></tr></table>
<p class="ja">Tamsin Home Goods社(非発行体、12月31日決算)は給与計算をPayCore Servicesに委託している。Tamsinの監査人(ユーザー監査人)は給与費用の実証手続を減らすためPayCoreの統制に依拠する予定である。PayCoreの報告書:SOC 1 Type 2報告書(システムの記述、統制のデザインの適切性と運用の有効性)、対象期間は1年目1月1日〜9月30日、補完的なユーザー・エンティティ統制として「ユーザーは資金の支払前に給与台帳の正確性を確認し承認すべきである」、サブサービス組織DataHarbor(ホスティング)の統制は記述から除外(カーブアウト方式)、受託会社監査人の意見は税率テーブル変更の統制の逸脱について限定付き。</p>`,
  rows: [
    { label: "Number of months in Tamsin's fiscal year not covered by the SOC 1 report(SOC 1報告書の対象外となる会計期間の月数)", type: "num", answer: 3 },
    { label: "Appropriate response to the uncovered period(対象外期間への適切な対応)", type: "select", options: ["No action; nine months of coverage is sufficient", "Obtain additional evidence, such as inquiring of user entity and service organization personnel about changes (e.g., a bridge letter) and considering further tests", "Request that the service auditor reissue the report dated December 31", "Treat the uncovered period as a material weakness"], answer: "Obtain additional evidence, such as inquiring of user entity and service organization personnel about changes (e.g., a bridge letter) and considering further tests" },
    { label: "Responsibility for the complementary user entity control(補完的ユーザー・エンティティ統制の検証責任)", type: "select", options: ["The service auditor tests it at PayCore", "The user auditor evaluates and, if relying on it, tests the control at Tamsin", "DataHarbor tests it", "No one; it is outside the scope of the audit"], answer: "The user auditor evaluates and, if relying on it, tests the control at Tamsin" },
    { label: "Effect of the carve-out of DataHarbor(DataHarborのカーブアウトの影響)", type: "select", options: ["The SOC 1 report already provides evidence on DataHarbor's controls", "The user auditor considers whether evidence about DataHarbor's relevant controls is needed, e.g., a SOC 1 report from DataHarbor or other procedures", "The user auditor must visit DataHarbor in all cases", "The SOC 1 report cannot be used at all"], answer: "The user auditor considers whether evidence about DataHarbor's relevant controls is needed, e.g., a SOC 1 report from DataHarbor or other procedures" },
    { label: "Effect of the qualified service auditor's opinion(受託会社監査人の限定付意見の影響)", type: "select", options: ["Ignore it, because it relates to the service organization", "Evaluate its effect on the assessment of risk and on planned reliance on payroll controls, and perform additional procedures as needed", "Issue a qualified opinion on Tamsin's financial statements", "Withdraw from the engagement"], answer: "Evaluate its effect on the assessment of risk and on planned reliance on payroll controls, and perform additional procedures as needed" },
    { label: "Reference to the service auditor in the user auditor's unmodified opinion(ユーザー監査人の無限定意見での受託会社監査人への言及)", type: "select", options: ["Required, to divide responsibility", "Permitted if the service auditor consents", "Not permitted", "Required only for a Type 1 report"], answer: "Not permitted" },
    { label: "If PayCore had provided only a SOC 1 Type 1 report, it would provide evidence of(SOC 1 Type 1報告書のみの場合に得られる証拠)", type: "select", options: ["Operating effectiveness of controls over the period", "The fairness of the description and the suitability of design of controls as of a specified date only", "Controls relevant to security, availability, and confidentiality (Trust Services Criteria)", "The accuracy of Tamsin's payroll expense balance"], answer: "The fairness of the description and the suitability of design of controls as of a specified date only" },
  ],
  explain: `<p>対象外期間:報告書は9月30日までであり、10月1日〜12月31日の3か月が対象外である(12 − 9 = 3)。ユーザー監査人は、残りの期間について経営者や受託会社への質問(ブリッジ・レター等による重要な変更の有無の確認)、追加の統制テスト等により追加的な証拠を入手する。対象外期間があること自体は重要な欠陥ではない。</p>
<p>補完的ユーザー・エンティティ統制(CUEC):受託会社の統制目的の達成にはユーザー側の統制が前提となっている。ユーザー監査人はTamsinでこの統制(給与台帳の確認・承認)を評価し、依拠するならテストする必要がある。</p>
<p>カーブアウト方式:サブサービス組織の統制はSOC 1報告書の記述とテストに含まれない。ユーザー監査人はDataHarborの関連統制について証拠が必要かを検討し、DataHarbor自身のSOC 1報告書の入手その他の手続を行う(インクルーシブ方式なら一体として報告される)。</p>
<p>限定付意見:受託会社監査人の報告書における逸脱や限定は、ユーザー監査人のリスク評価と依拠計画への影響を評価し、必要に応じて追加手続を行う。直ちにTamsinの財務諸表意見が限定されるわけではない。</p>
<p>言及:AU-C 402では、無限定意見の監査報告書で受託会社監査人の作業に言及してはならない(法令で求められる場合を除く)。限定等の意見に関連する場合に限り言及でき、その場合も責任は軽減されない旨を示す。</p>
<p>Type 1:特定時点の記述の適正性とデザインの適切性のみで、運用の有効性の証拠にはならない。運用評価の証拠を得るにはType 2が必要である。セキュリティ等のトラスト・サービス規準はSOC 2の対象である。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-49", section: "AUD", chapter: "AUD-03", title: "現金・棚卸資産サイクルの職務分掌マトリクスの評価",
  scenario: `<p><b>Fairhaven Garden Supply</b> is a small wholesale company. As part of understanding the control environment and control activities, you prepared the following segregation-of-duties matrix for the cash and inventory cycles.</p>
<table><tr><th>Employee</th><th>Duties performed</th></tr>
<tr><td>Ana</td><td>Opens the mail and receives customer checks; posts customer payments to the accounts receivable subsidiary ledger.</td></tr>
<tr><td>Ben</td><td>Warehouse manager with keys to the warehouse; approves write-offs of obsolete inventory and personally arranges their disposal.</td></tr>
<tr><td>Carla</td><td>Reports to the controller; prepares the monthly bank reconciliations directly from bank statements received unopened. Performs no cash receipts or disbursements duties.</td></tr>
<tr><td>Dev</td><td>Records inventory receipts and shipments in the perpetual inventory records; also compares the perpetual records to cycle counts and posts the adjustments without review.</td></tr>
<tr><td>Eve</td><td>Approves vendor invoices for payment and records them in the accounts payable ledger.</td></tr>
<tr><td>Fay</td><td>Treasurer; signs checks after reviewing supporting documents approved and recorded by others, and mails the checks directly. Has no recording duties.</td></tr></table>
<p class="ja">Fairhaven Garden Supply社は小規模な卸売会社である。統制環境と統制活動の理解の一環として、現金・棚卸資産サイクルの職務分掌マトリクスを作成した。Ana:郵便物を開封して顧客の小切手を受け取り、売掛金補助元帳に入金を記帳する。Ben:倉庫の鍵を持つ倉庫管理者で、陳腐化在庫の廃棄を承認し、自ら廃棄の手配をする。Carla:コントローラーに報告し、未開封で受け取った銀行取引明細書から毎月の銀行勘定調整表を作成する。入出金の業務は行わない。Dev:継続記録に在庫の受入・出荷を記帳し、継続記録と循環棚卸の結果を照合して、レビューなしで修正を記帳する。Eve:仕入先請求書の支払を承認し、買掛金元帳に記帳する。Fay:財務責任者で、他者が承認・記帳した証憑を確認して小切手に署名し、直接郵送する。記帳業務はない。</p>`,
  rows: [
    { label: "Ana(Ana)", type: "select", options: ["No incompatible duties", "Custody + recording", "Authorization + custody", "Authorization + recording", "Recording + reconciliation"], answer: "Custody + recording" },
    { label: "Ben(Ben)", type: "select", options: ["No incompatible duties", "Custody + recording", "Authorization + custody", "Authorization + recording", "Recording + reconciliation"], answer: "Authorization + custody" },
    { label: "Carla(Carla)", type: "select", options: ["No incompatible duties", "Custody + recording", "Authorization + custody", "Authorization + recording", "Recording + reconciliation"], answer: "No incompatible duties" },
    { label: "Dev(Dev)", type: "select", options: ["No incompatible duties", "Custody + recording", "Authorization + custody", "Custody + reconciliation", "Recording + reconciliation"], answer: "Recording + reconciliation" },
    { label: "Eve(Eve)", type: "select", options: ["No incompatible duties", "Custody + recording", "Authorization + custody", "Authorization + recording", "Recording + reconciliation"], answer: "Authorization + recording" },
    { label: "Fay(Fay)", type: "select", options: ["No incompatible duties", "Custody + recording", "Authorization + custody", "Authorization + recording", "Recording + reconciliation"], answer: "No incompatible duties" },
    { label: "Number of employees with incompatible duties(職務の兼務に問題がある従業員数)", type: "num", answer: 4 },
    { label: "Fraud scheme most directly enabled by Ana's duties(Anaの職務により最も直接的に可能となる不正)", type: "select", options: ["Lapping of accounts receivable", "Kiting between bank accounts", "Fictitious vendor payments", "Ghost employees on the payroll"], answer: "Lapping of accounts receivable" },
  ],
  explain: `<p>職務分掌の基本は、取引の承認(authorization)、資産の保管(custody)、記録(recording)、独立的な照合・検証(reconciliation)を別の者に担当させることである。</p>
<p>Ana:小切手の受領(保管)と売掛金の記帳(記録)を兼務 → 保管+記録。入金を着服し、後の別顧客の入金で穴埋めするラッピング(lapping)が可能となる。</p>
<p>Ben:廃棄の承認(承認)と在庫への物理的アクセス・廃棄の実行(保管) → 承認+保管。良品を陳腐化品として廃棄承認し持ち出すことができる。</p>
<p>Carla:入出金にも記帳にも関与せず、未開封の明細書から調整表を作成する独立した照合担当 → 問題なし。</p>
<p>Dev:在庫の記録者が実地との照合・修正記帳もレビューなしで行う → 記録+照合。記録の誤りや差異を隠ぺいできる。</p>
<p>Eve:支払の承認と買掛金の記帳 → 承認+記録。架空請求の承認・計上が可能となる。</p>
<p>Fay:他者が承認・記帳した証憑に基づき署名し、小切手を直接郵送する(保管のみで記帳しない) → 問題なし。</p>
<p>問題のある従業員数 = Ana、Ben、Dev、Eve の4名。カイティングは銀行口座間の資金移動のタイミングを利用する不正、架空仕入先・架空従業員はそれぞれ購買・給与サイクルの不正であり、Anaの職務とは直接結び付かない。</p>`,
});
