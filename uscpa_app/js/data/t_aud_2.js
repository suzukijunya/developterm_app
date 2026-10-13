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
