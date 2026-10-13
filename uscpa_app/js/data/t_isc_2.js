// ISC のTBS追加(NIST CSF 2.0・攻撃と軽減統制・暗号鍵・ファイアウォール・脆弱性優先順位・インシデント対応・プライバシー・アクセスレビュー)

CPA.tbs({
  id: "TBS-ISC-29", section: "ISC", chapter: "ISC-02", title: "NIST CSF 2.0の機能・カテゴリーへの統制の対応付け",
  scenario: `<p>Harlow Medical Supply, Inc. is aligning its control inventory with the <b>NIST Cybersecurity Framework (CSF) 2.0</b>. The CISO prepared the following excerpt and asks you to assign each control to the single most appropriate CSF 2.0 category.</p>
<p><b>Exhibit — Control inventory (excerpt)</b></p>
<table><tr><th>No.</th><th>Control description</th></tr>
<tr><td>C1</td><td>Before signing a contract, Procurement requires critical vendors to complete a security questionnaire and provide a SOC 2 Type 2 report; contracts include breach-notification and right-to-audit clauses.</td></tr>
<tr><td>C2</td><td>IT maintains a configuration management database (CMDB) listing all hardware, software, and data flows, with an owner and criticality rating for each item.</td></tr>
<tr><td>C3</td><td>Remote access to the ERP requires multifactor authentication, and access rights are granted on a least-privilege basis.</td></tr>
<tr><td>C4</td><td>A security operations center uses a SIEM to monitor network traffic and endpoint activity 24/7 for anomalous behavior.</td></tr>
<tr><td>C5</td><td>After an incident is contained, systems are restored from immutable backups in the sequence set by the recovery plan, and the integrity of restored data is verified before return to production.</td></tr>
<tr><td>C6</td><td>Lessons learned from incidents and annual tabletop exercises are documented and used to update the security program and response plans.</td></tr>
<tr><td>C7</td><td>The board's audit committee reviews quarterly results of the cybersecurity risk management strategy and directs adjustments when performance falls short.</td></tr></table>
<p class="ja">Harlow Medical Supply社は統制一覧を<b>NISTサイバーセキュリティ・フレームワーク(CSF)2.0</b>に整合させている。CISOが作成した抜粋(C1:重要ベンダーとの契約前にセキュリティ質問票とSOC 2 Type 2報告書を要求し、契約に侵害通知条項と監査権条項を入れる/C2:CMDBで全ハードウェア・ソフトウェア・データフローを所有者と重要度付きで管理/C3:ERPへのリモートアクセスに多要素認証を要求し、最小権限で権限付与/C4:SOCがSIEMでネットワークとエンドポイントを24時間365日監視/C5:封じ込め後、復旧計画の順序に従いイミュータブルバックアップから復元し、本番復帰前にデータの完全性を検証/C6:インシデントと年次机上演習の教訓を文書化し、プログラムと対応計画の更新に用いる/C7:取締役会の監査委員会がサイバーリスク管理戦略の結果を四半期ごとにレビューし、不十分な場合は修正を指示)について、最も適切なCSF 2.0のカテゴリーを1つ選べ。</p>`,
  rows: [
    { label: "C1(ベンダーのセキュリティ評価と契約条項)", type: "select", options: ["GV.SC Cybersecurity Supply Chain Risk Management", "ID.RA Risk Assessment", "PR.DS Data Security", "RS.CO Incident Response Reporting and Communication", "GV.PO Policy"], answer: "GV.SC Cybersecurity Supply Chain Risk Management" },
    { label: "C2(CMDBによる資産管理)", type: "select", options: ["PR.PS Platform Security", "ID.AM Asset Management", "GV.OC Organizational Context", "DE.CM Continuous Monitoring", "ID.RA Risk Assessment"], answer: "ID.AM Asset Management" },
    { label: "C3(多要素認証と最小権限)", type: "select", options: ["PR.AT Awareness and Training", "PR.AA Identity Management, Authentication, and Access Control", "PR.DS Data Security", "DE.AE Adverse Event Analysis", "GV.RR Roles, Responsibilities, and Authorities"], answer: "PR.AA Identity Management, Authentication, and Access Control" },
    { label: "C4(SIEMによる常時監視)", type: "select", options: ["DE.CM Continuous Monitoring", "RS.AN Incident Analysis", "PR.PS Platform Security", "ID.AM Asset Management", "RS.MA Incident Management"], answer: "DE.CM Continuous Monitoring" },
    { label: "C5(バックアップからの復元と完全性検証)", type: "select", options: ["RS.MI Incident Mitigation", "PR.IR Technology Infrastructure Resilience", "RC.RP Incident Recovery Plan Execution", "RC.CO Incident Recovery Communication", "PR.DS Data Security"], answer: "RC.RP Incident Recovery Plan Execution" },
    { label: "C6(教訓の文書化と計画の更新)", type: "select", options: ["ID.IM Improvement", "RS.AN Incident Analysis", "GV.OV Oversight", "RC.CO Incident Recovery Communication", "PR.AT Awareness and Training"], answer: "ID.IM Improvement" },
    { label: "C7(監査委員会による戦略結果のレビュー)", type: "select", options: ["GV.RM Risk Management Strategy", "GV.OV Oversight", "ID.RA Risk Assessment", "GV.OC Organizational Context", "DE.AE Adverse Event Analysis"], answer: "GV.OV Oversight" },
    { label: "Number of the seven controls that fall under the Govern (GV) function(7つの統制のうちガバナンス(GV)機能に属する数)", type: "num", answer: 2 },
  ],
  explain: `<p>CSF 2.0の6機能は Govern(統治)・Identify(識別)・Protect(防御)・Detect(検知)・Respond(対応)・Recover(復旧)である。</p>
<p>① C1:サプライヤーの評価や契約上のセキュリティ要求は、2.0で Govern に新設された GV.SC(サプライチェーン・リスク管理)に属する。</p>
<p>② C2:ハードウェア・ソフトウェア・データフローの棚卸と重要度付けは ID.AM(資産管理)である。</p>
<p>③ C3:認証(MFA)とアクセス権の付与・最小権限は PR.AA(ID管理・認証・アクセス制御)である。</p>
<p>④ C4:異常を見つけるための継続的な監視は DE.CM である。検知した事象の分析は DE.AE だが、本統制は監視そのものである。</p>
<p>⑤ C5:封じ込め後に復旧計画に従ってシステムを復元し、完全性を確認するのは RC.RP(復旧計画の実行)である。RS.MI は封じ込め・根絶であり段階が異なる。</p>
<p>⑥ C6:CSF 2.0では改善(Improvement)は Identify 機能の ID.IM に置かれた(1.1では Respond/Recover の各機能に Improvements があった)。</p>
<p>⑦ C7:リスク管理戦略の結果をレビューし調整するのは GV.OV(監督)である。リスク選好や戦略の策定自体は GV.RM である。</p>
<p>⑧ GVに属するのは C1(GV.SC)と C7(GV.OV)の2つ。</p>`,
});
