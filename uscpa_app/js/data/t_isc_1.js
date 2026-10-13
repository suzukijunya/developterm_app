// ISC のTBS追加(SQL・正規化・ITGC・業務処理統制・BCP/DRP・クラウド・SDLC・職務分掌・データライフサイクル)

CPA.tbs({
  id: "TBS-ISC-20", section: "ISC", chapter: "ISC-01", title: "給与データに対するSQLクエリ(架空従業員の検出)",
  scenario: `<p>As part of payroll fraud procedures, an auditor queries two tables extracted from Kestrel Inc.'s HR/payroll database. EmpID is the primary key of Employees and appears in Payroll as a foreign key, but referential integrity is <b>not enforced</b> by the database. A blank BankAcct cell is NULL.</p>
<p><b>Exhibit 1 — Employees</b></p>
<table><tr><th>EmpID</th><th>Name</th><th>Dept</th><th>Status</th><th>BankAcct</th></tr>
<tr><td>E01</td><td>Ana</td><td>Sales</td><td>Active</td><td>1111</td></tr>
<tr><td>E02</td><td>Ben</td><td>Sales</td><td>Active</td><td>2222</td></tr>
<tr><td>E03</td><td>Cara</td><td>Ops</td><td>Terminated</td><td>3333</td></tr>
<tr><td>E04</td><td>Dan</td><td>Ops</td><td>Active</td><td>1111</td></tr>
<tr><td>E05</td><td>Eve</td><td>Admin</td><td>Active</td><td></td></tr></table>
<p><b>Exhibit 2 — Payroll (March 2026)</b></p>
<table><tr><th>PayID</th><th>EmpID</th><th>PayDate</th><th>Gross</th></tr>
<tr><td>P1</td><td>E01</td><td>2026-03-15</td><td>4,000</td></tr>
<tr><td>P2</td><td>E02</td><td>2026-03-15</td><td>3,500</td></tr>
<tr><td>P3</td><td>E03</td><td>2026-03-15</td><td>2,800</td></tr>
<tr><td>P4</td><td>E04</td><td>2026-03-15</td><td>3,000</td></tr>
<tr><td>P5</td><td>E01</td><td>2026-03-31</td><td>4,000</td></tr>
<tr><td>P6</td><td>E06</td><td>2026-03-31</td><td>2,500</td></tr>
<tr><td>P7</td><td>E04</td><td>2026-03-31</td><td>3,000</td></tr>
<tr><td>P8</td><td>E02</td><td>2026-03-31</td><td>3,500</td></tr></table>
<p>Determine the result of each query.</p>
<p class="ja">給与不正に関する手続の一環として、監査人はKestrel社の人事・給与データベースから抽出した2つのテーブルにクエリを実行する。EmpIDはEmployeesの主キーで、Payrollでは外部キーとして使われるが、データベースは参照整合性を強制して<b>いない</b>。BankAcctの空欄はNULLである。各クエリの結果を求めよ(データは英文の表のとおり)。</p>`,
  rows: [
    { label: "SELECT COUNT(*) FROM Payroll p LEFT JOIN Employees e ON p.EmpID = e.EmpID WHERE e.EmpID IS NULL;(返される値)", type: "num", answer: 1 },
    { label: "SELECT SUM(p.Gross) FROM Payroll p INNER JOIN Employees e ON p.EmpID = e.EmpID WHERE e.Status = 'Terminated';(返される値)", type: "num", answer: 2800 },
    { label: "Rows returned: SELECT BankAcct, COUNT(*) FROM Employees GROUP BY BankAcct HAVING COUNT(*) > 1;(返される行数)", type: "num", answer: 1 },
    { label: "SELECT COUNT(BankAcct) FROM Employees;(返される値)", type: "num", answer: 4 },
    { label: "SELECT AVG(Gross) FROM Payroll WHERE PayDate = '2026-03-31';(返される値)", type: "num", answer: 3250 },
    { label: "SELECT COUNT(DISTINCT EmpID) FROM Payroll;(返される値)", type: "num", answer: 5 },
    { label: "Name returned: SELECT e.Name FROM Employees e LEFT JOIN Payroll p ON e.EmpID = p.EmpID WHERE p.PayID IS NULL;(返される氏名)", type: "select", options: ["Ana", "Cara", "Dan", "Eve", "No rows returned"], answer: "Eve" },
  ],
  explain: `<p>① Payrollを左側にしたLEFT JOINで、Employeesに対応がない行(e.EmpIDがNULL)を数える。E06のP6だけが該当し、1件。参照整合性が強制されていないため、存在しない従業員への支払(架空従業員の兆候)が残り得る。</p>
<p>② StatusがTerminatedなのはE03(Cara)のみ。その支払はP3の2,800。退職者への支払の検出である。</p>
<p>③ BankAcctでグループ化すると1111が2件(E01・E04)、2222・3333・NULLはそれぞれ1件。HAVING COUNT(*) > 1を満たすのは1111の1行。複数従業員が同一口座を共有している点は不正の兆候となる。</p>
<p>④ COUNT(列名)はNULLを数えない。E05のNULLを除き4。</p>
<p>⑤ 3月31日の支払はP5 4,000、P6 2,500、P7 3,000、P8 3,500で合計13,000。13,000 ÷ 4 = 3,250(WHEREは結合していないのでP6も含まれる)。</p>
<p>⑥ PayrollのEmpIDの重複を除くとE01・E02・E03・E04・E06の5。</p>
<p>⑦ Employeesを左側にしたLEFT JOINで支払がない従業員を抽出すると、E05のEveのみ。</p>`,
});

CPA.tbs({
  id: "TBS-ISC-21", section: "ISC", chapter: "ISC-01", title: "データベースの正規化と更新時異常",
  scenario: `<p>Juniper Supply's database administrator is reviewing the design of three tables before a system upgrade.</p>
<p><b>Exhibit 1 — OrderLines</b> (primary key: OrderID + ProductID)</p>
<table><tr><th>OrderID</th><th>ProductID</th><th>OrderDate</th><th>CustID</th><th>CustName</th><th>ProductDesc</th><th>UnitPrice</th><th>Qty</th></tr>
<tr><td>5001</td><td>P-7</td><td>2026-04-02</td><td>C-10</td><td>Ridge LLC</td><td>Steel bracket</td><td>12.00</td><td>40</td></tr>
<tr><td>5001</td><td>P-9</td><td>2026-04-02</td><td>C-10</td><td>Ridge LLC</td><td>Hinge kit</td><td>8.50</td><td>15</td></tr>
<tr><td>5002</td><td>P-7</td><td>2026-04-03</td><td>C-22</td><td>Monroe Co.</td><td>Steel bracket</td><td>12.00</td><td>25</td></tr></table>
<p>UnitPrice is the product's standard list price; every value in the table is atomic.</p>
<p><b>Exhibit 2 — Customers</b> (primary key: CustID): CustID, CustName, ZipCode, City. Each ZipCode determines exactly one City.</p>
<p><b>Exhibit 3 — Vendors</b> (primary key: VendorID): VendorID, VendorName, Phones. The Phones field holds entries such as "555-0101, 555-0188".</p>
<p class="ja">Juniper Supply社のデータベース管理者は、システム更新の前に3つのテーブル設計を検討している。資料1のOrderLinesは主キーがOrderID+ProductIDの複合キーで、UnitPriceは製品の標準定価、すべての値は原子的である。資料2のCustomers(主キーCustID)はCustID、CustName、ZipCode、Cityを持ち、ZipCodeが決まればCityは1つに決まる。資料3のVendors(主キーVendorID)はPhones欄に「555-0101, 555-0188」のように複数の電話番号を保持している。</p>`,
  rows: [
    { label: "Highest normal form satisfied by OrderLines(OrderLinesが満たす最も高い正規形)", type: "select", options: ["None (unnormalized)", "First normal form (1NF)", "Second normal form (2NF)", "Third normal form (3NF)"], answer: "First normal form (1NF)" },
    { label: "Dependency of ProductDesc in OrderLines(OrderLinesにおけるProductDescの従属関係)", type: "select", options: ["Full functional dependency on the whole key", "Partial dependency on part of the key", "Transitive dependency through a non-key attribute", "No dependency on the key"], answer: "Partial dependency on part of the key" },
    { label: "Dependency of Qty in OrderLines(OrderLinesにおけるQtyの従属関係)", type: "select", options: ["Full functional dependency on the whole key", "Partial dependency on part of the key", "Transitive dependency through a non-key attribute", "No dependency on the key"], answer: "Full functional dependency on the whole key" },
    { label: "If order 5001 is deleted, the description of P-9 is lost. This is a(n):(注文5001を削除するとP-9の説明が失われる。これは何か)", type: "select", options: ["Insertion anomaly", "Update (modification) anomaly", "Deletion anomaly", "Referential integrity violation"], answer: "Deletion anomaly" },
    { label: "Highest normal form satisfied by Customers(Customersが満たす最も高い正規形)", type: "select", options: ["None (unnormalized)", "First normal form (1NF)", "Second normal form (2NF)", "Third normal form (3NF)"], answer: "Second normal form (2NF)" },
    { label: "Highest normal form satisfied by Vendors(Vendorsが満たす最も高い正規形)", type: "select", options: ["None (unnormalized)", "First normal form (1NF)", "Second normal form (2NF)", "Third normal form (3NF)"], answer: "None (unnormalized)" },
    { label: "Number of tables needed to put the OrderLines data in 3NF(OrderLinesのデータを3NFにするのに必要なテーブル数)", type: "num", answer: 4 },
  ],
  explain: `<p>① OrderLinesは値がすべて原子的なので1NFを満たすが、OrderDate・CustID・CustNameはOrderIDだけに、ProductDesc・UnitPriceはProductIDだけに従属する(部分従属)。複合キーの一部への従属があるため2NFを満たさず、最高は1NFである。</p>
<p>② ProductDescはProductIDのみで決まるため、キーの一部への部分従属である。</p>
<p>③ Qtyは「どの注文の」「どの製品の」数量かで決まるため、複合キー全体への完全関数従属である。</p>
<p>④ ある事実(製品P-9の説明)を保持する唯一の行を削除すると、無関係な情報まで失われる。これは削除時異常である。</p>
<p>⑤ Customersは単一列の主キーなので部分従属は生じず2NFを満たす。しかしCityはZipCode(非キー属性)を経由してCustIDに推移従属するため3NFを満たさない。最高は2NFである。</p>
<p>⑥ Phones欄に複数の値が入っており原子性がない(繰り返しグループ)ため、1NFも満たさない非正規形である。</p>
<p>⑦ 3NFへの分解:Orders(OrderID, OrderDate, CustID)、Customers(CustID, CustName)、Products(ProductID, ProductDesc, UnitPrice)、OrderLines(OrderID, ProductID, Qty)の4テーブル。UnitPriceは標準定価なので製品テーブルに置く。</p>`,
});

CPA.tbs({
  id: "TBS-ISC-22", section: "ISC", chapter: "ISC-01", title: "ITGC運用評価における例外事項の評価(変更管理・アクセスレビュー)",
  scenario: `<p>An auditor is testing the operating effectiveness of two IT general controls at Halden Corp. for the year ended December 31, 2026.</p>
<p><b>Exhibit 1 — Change management policy (excerpt)</b></p>
<ul><li>All production changes require a ticket approved by the Change Advisory Board (CAB) <b>before</b> deployment.</li>
<li>Emergency changes may be deployed first but must be approved by the CAB within <b>two business days</b> after deployment.</li>
<li>User acceptance testing (UAT) sign-off must be attached to the ticket before deployment.</li>
<li>Code may be migrated to production only by the release team; developers may not migrate their own code.</li></ul>
<p><b>Exhibit 2 — Results of testing a sample of 25 changes</b> (population: 180 changes; tolerable deviation rate 5%; expected deviation rate 0%). All other 21 sampled tickets complied with every policy requirement.</p>
<table><tr><th>Ticket</th><th>Observation</th></tr>
<tr><td>CHG-104</td><td>Normal change; CAB approval dated two days <b>after</b> deployment.</td></tr>
<tr><td>CHG-117</td><td>Emergency change deployed on a Tuesday night; CAB approval dated Wednesday morning.</td></tr>
<tr><td>CHG-131</td><td>UAT sign-off attached; deployment log shows the developer who wrote the code migrated it to production.</td></tr>
<tr><td>CHG-150</td><td>CAB approved before deployment; no UAT sign-off attached and none could be located.</td></tr></table>
<p><b>Exhibit 3 — Quarterly user access review (Q3)</b>: The ERP owner's review identified four terminated users who still had access and requested removal. IT removed three. The fourth account remained active for 45 more days, and the system log shows one login during that period.</p>
<p class="ja">監査人は、Halden社の2026年12月31日終了年度における2つのIT全般統制の運用状況の有効性を評価している。資料1は変更管理方針(本番変更はデプロイ<b>前</b>にCAB承認が必要。緊急変更は先にデプロイしてよいが、デプロイ後<b>2営業日以内</b>にCAB承認が必要。デプロイ前にUATの承認書を添付。本番移送はリリースチームのみが行い、開発者は自分のコードを移送できない)。資料2はサンプル25件(母集団180件、許容逸脱率5%、予想逸脱率0%)の結果で、表の4件以外の21件はすべて方針に準拠していた。資料3は第3四半期のアクセスレビューで、退職者4名のアクセス削除が依頼されたが、ITが削除したのは3名分で、残る1アカウントはさらに45日間有効のままで、その間に1回のログインが記録されていた。</p>`,
  rows: [
    { label: "CHG-104(チケットCHG-104の評価)", type: "select", options: ["Control deviation", "Not a deviation"], answer: "Control deviation" },
    { label: "CHG-117(チケットCHG-117の評価)", type: "select", options: ["Control deviation", "Not a deviation"], answer: "Not a deviation" },
    { label: "CHG-131(チケットCHG-131の評価)", type: "select", options: ["Control deviation", "Not a deviation"], answer: "Control deviation" },
    { label: "CHG-150(チケットCHG-150の評価)", type: "select", options: ["Control deviation", "Not a deviation"], answer: "Control deviation" },
    { label: "Sample deviation rate for change management, in %(変更管理統制のサンプル逸脱率・%)", type: "num", answer: 12 },
    { label: "Conclusion on the change management control(変更管理統制に関する結論)", type: "select", options: ["Operating effectively; planned reliance is supported", "Operating effectively, but expand the sample to 60 items before concluding", "Not operating effectively; reduce reliance and evaluate the effect on dependent automated controls and substantive procedures", "Not operating effectively; no further consideration is needed because no misstatement was found"], answer: "Not operating effectively; reduce reliance and evaluate the effect on dependent automated controls and substantive procedures" },
    { label: "Most appropriate follow-up on the access review exception(アクセスレビューの例外に対する最も適切な追加対応)", type: "select", options: ["None, because the reviewer correctly identified the user", "Determine what activity the terminated user's account performed after termination and assess its effect on financial data", "Conclude that the quarterly review control is ineffective for the entire year without further work", "Request that management re-perform the Q1 and Q2 reviews"], answer: "Determine what activity the terminated user's account performed after termination and assess its effect on financial data" },
  ],
  explain: `<p>① CHG-104は通常変更なのにデプロイ後にCAB承認されており、「デプロイ前承認」の要件に反する逸脱である。</p>
<p>② CHG-117は緊急変更で、火曜夜のデプロイの翌朝(1営業日以内)に承認されている。方針の2営業日以内を満たすため逸脱ではない。</p>
<p>③ CHG-131はUAT承認はあるが、開発者自身が本番移送しており、開発と本番移送の職務分離の要件に反する逸脱である。</p>
<p>④ CHG-150はUAT承認書がなく、デプロイ前のテスト承認という要件に反する逸脱である。</p>
<p>⑤ 逸脱は104・131・150の3件。3 ÷ 25 = 12%。</p>
<p>⑥ サンプル逸脱率12%は許容逸脱率5%を上回る(予想0%で計画したサンプルで逸脱が出ている)ため、統制は有効に運用されていないと結論づける。変更管理は自動化統制やシステム生成レポートの信頼性の前提となるため、依拠を減らし、影響を受ける自動化統制や実証手続の範囲を見直す。虚偽表示が見つからなかったことは統制の有効性の根拠にならない。</p>
<p>⑦ レビュー自体は退職者を識別できたが、削除が完了していなかった(是正の不備)。退職後にログインがあるため、そのアカウントで何が行われたか(取引の入力・承認やデータ変更の有無)を調査し、財務データへの影響を評価するのが適切である。</p>`,
});

CPA.tbs({
  id: "TBS-ISC-23", section: "ISC", chapter: "ISC-01", title: "バッチ管理合計と処理・出力統制の対応",
  scenario: `<p>Corvid Co.'s accounts payable clerk prepares a batch control slip before vendor invoices are keyed into the AP system.</p>
<p><b>Exhibit 1 — Batch 0412 source documents</b></p>
<table><tr><th>Invoice</th><th>Vendor number</th><th>Amount</th></tr>
<tr><td>1001</td><td>210</td><td>$1,250.00</td></tr>
<tr><td>1002</td><td>305</td><td>$860.00</td></tr>
<tr><td>1003</td><td>118</td><td>$2,400.00</td></tr>
<tr><td>1004</td><td>210</td><td>$515.00</td></tr>
<tr><td>1005</td><td>402</td><td>$1,975.00</td></tr></table>
<p>The control slip includes a record count, a financial total of invoice amounts, and a hash total of vendor numbers. After keying, the system edit report for batch 0412 shows: record count 5; financial total $7,000.00; hash total of vendor numbers <b>1,290</b>.</p>
<p><b>Exhibit 2 — Other errors identified during the year</b></p>
<ul><li>(a) In another batch, invoice 2203 for $2,400.00 was keyed as $4,200.00 with the correct vendor number.</li>
<li>(b) A program error in the nightly posting job dropped one record; the AP master file balance after the run did not equal the prior balance plus the batch postings.</li>
<li>(c) A vendor payment register containing bank account numbers was printed and delivered to the sales department.</li>
<li>(d) Prenumbered receiving reports entered into the system skipped from #4417 to #4419.</li></ul>
<p class="ja">Corvid社の買掛金担当者は、仕入先請求書をAPシステムに入力する前にバッチ管理票を作成する。管理票にはレコード件数、請求額の金額合計、仕入先番号のハッシュ合計を記載する。入力後のバッチ0412のエディットレポートは、件数5、金額合計$7,000.00、仕入先番号のハッシュ合計<b>1,290</b>を示した。資料2は年度中に識別されたその他の誤り:(a)別バッチで請求書2203の$2,400.00が$4,200.00と入力された(仕入先番号は正しい)。(b)夜間の転記ジョブのプログラムエラーでレコードが1件脱落し、処理後のAPマスター残高が前回残高+転記額と一致しなかった。(c)銀行口座番号を含む仕入先支払一覧が印刷され営業部に配付された。(d)連番の受領報告書の入力が#4417から#4419に飛んでいた。</p>`,
  rows: [
    { label: "Correct hash total of vendor numbers for batch 0412(バッチ0412の仕入先番号の正しいハッシュ合計)", type: "num", answer: 1245 },
    { label: "Correct financial total for batch 0412, $(バッチ0412の正しい金額合計)", type: "num", answer: 7000 },
    { label: "Invoice most likely keyed with a transposed vendor number(仕入先番号の転置入力が最も疑われる請求書)", type: "select", options: ["1001", "1002", "1003", "1004", "1005"], answer: "1002" },
    { label: "Control that detects error (a)(誤り(a)を検出する統制)", type: "select", options: ["Record count", "Financial (amount) total", "Hash total", "Sequence check", "Run-to-run totals", "Output distribution control"], answer: "Financial (amount) total" },
    { label: "Control that detects error (b)(誤り(b)を検出する統制)", type: "select", options: ["Record count", "Financial (amount) total", "Hash total", "Sequence check", "Run-to-run totals", "Output distribution control"], answer: "Run-to-run totals" },
    { label: "Control that would prevent error (c)(誤り(c)を防止する統制)", type: "select", options: ["Record count", "Financial (amount) total", "Hash total", "Sequence check", "Run-to-run totals", "Output distribution control"], answer: "Output distribution control" },
    { label: "Control that detects error (d)(誤り(d)を検出する統制)", type: "select", options: ["Record count", "Financial (amount) total", "Hash total", "Sequence check", "Run-to-run totals", "Output distribution control"], answer: "Sequence check" },
  ],
  explain: `<p>① ハッシュ合計:210 + 305 + 118 + 210 + 402 = 1,245。仕入先番号の合計自体に意味はないが、入力内容の改変を検出できる。</p>
<p>② 金額合計:1,250 + 860 + 2,400 + 515 + 1,975 = 7,000。件数・金額は一致しているので、誤りは仕入先番号にある。</p>
<p>③ 差額は1,290 − 1,245 = 45。転置誤りの差は9の倍数になる。305を350と入力すると+45で一致する。他の候補は210→201(−9)、118→181(+63)、402→420(+18)で一致しない。よって1002。</p>
<p>④ (a)は件数も仕入先番号も正しく、金額だけが$1,800過大なので金額合計で検出する。</p>
<p>⑤ (b)は処理の前後で残高・件数を引き継いで照合するラン・ツー・ラン合計(処理統制)で検出する。</p>
<p>⑥ (c)は出力の配付先を限定する出力配付統制(配付リスト・受領確認)で防止する。</p>
<p>⑦ (d)は連番の欠番・重複を検出するシーケンスチェックで検出する。</p>`,
});

CPA.tbs({
  id: "TBS-ISC-24", section: "ISC", chapter: "ISC-01", title: "バックアップの復元セットと復旧サイトの選択",
  scenario: `<p>Larkspur Co. is reviewing its disaster recovery plan for the ERP system.</p>
<p><b>Exhibit 1 — Backup schedule</b>: A full backup runs every Sunday at 11:00 p.m. An <b>incremental</b> backup runs Monday through Saturday at 11:00 p.m. Backups are stored offsite and no other replication is performed.</p>
<p><b>Exhibit 2 — Business impact analysis</b>: For the ERP system, the recovery time objective (RTO) is <b>48 hours</b> and the recovery point objective (RPO) is <b>24 hours</b>.</p>
<p><b>Exhibit 3 — Recovery site options</b></p>
<table><tr><th>Option</th><th>Time to restore ERP</th><th>Annual cost</th></tr>
<tr><td>Hot site</td><td>4 hours</td><td>$420,000</td></tr>
<tr><td>Cloud DR service (DRaaS)</td><td>12 hours</td><td>$180,000</td></tr>
<tr><td>Warm site</td><td>36 hours</td><td>$150,000</td></tr>
<tr><td>Cold site</td><td>10 days</td><td>$40,000</td></tr></table>
<p>The primary data center fails on <b>Thursday at 3:00 p.m.</b></p>
<p class="ja">Larkspur社はERPシステムの災害復旧計画を見直している。資料1:毎週日曜午後11時にフルバックアップ、月曜から土曜の午後11時に<b>増分</b>バックアップを取得し、オフサイトに保管する(他の複製はない)。資料2:ERPのRTOは<b>48時間</b>、RPOは<b>24時間</b>。資料3:復旧サイトの選択肢(ホットサイト4時間・年$420,000、DRaaS 12時間・年$180,000、ウォームサイト36時間・年$150,000、コールドサイト10日・年$40,000)。主データセンターが<b>木曜午後3時</b>に停止した。</p>`,
  rows: [
    { label: "Number of backup sets needed to restore the ERP data(ERPデータの復元に必要なバックアップセット数)", type: "num", answer: 4 },
    { label: "Number of backup sets needed if differential backups were used instead of incremental(増分ではなく差分バックアップだった場合の必要セット数)", type: "num", answer: 2 },
    { label: "Hours of transaction data lost(失われる取引データの時間数)", type: "num", answer: 16 },
    { label: "Does the backup schedule meet the RPO?(バックアップ計画はRPOを満たすか)", type: "select", options: ["Yes — maximum data loss does not exceed 24 hours", "No — maximum data loss exceeds 24 hours", "Cannot be determined without the RTO"], answer: "Yes — maximum data loss does not exceed 24 hours" },
    { label: "Lowest-cost recovery site option that meets the RTO(RTOを満たす最も低コストの復旧サイト)", type: "select", options: ["Hot site", "Cloud DR service (DRaaS)", "Warm site", "Cold site"], answer: "Warm site" },
    { label: "Lowest-cost option if the RTO is reduced to 8 hours(RTOが8時間に短縮された場合の最も低コストの選択肢)", type: "select", options: ["Hot site", "Cloud DR service (DRaaS)", "Warm site", "Cold site"], answer: "Hot site" },
    { label: "Change needed to achieve an RPO of 1 hour(RPOを1時間にするために必要な変更)", type: "select", options: ["Switch from incremental to differential backups", "Move to a hot site", "Replicate or ship transaction logs to the recovery location at least hourly", "Test the recovery plan twice a year"], answer: "Replicate or ship transaction logs to the recovery location at least hourly" },
  ],
  explain: `<p>① 増分バックアップは前回のバックアップ(フルまたは増分)以降の変更のみを含む。木曜午後3時時点で利用できるのは日曜のフル+月・火・水の増分で、すべてを順に復元する必要があるため4セット。</p>
<p>② 差分バックアップは直近のフル以降の累積変更を含むので、日曜のフル+水曜の差分の2セットで足りる(復元は速いが、日々のバックアップ量は増える)。</p>
<p>③ 最後のバックアップは水曜午後11時。停止は木曜午後3時なので、23:00〜15:00の16時間分のデータが失われる。</p>
<p>④ バックアップは毎晩取得されるので、最大データ損失は24時間(直前のバックアップ直前に障害が起きた場合)以下でRPO 24時間を満たす。RTOは復旧時間の目標でありRPOの判定には不要である。</p>
<p>⑤ RTO 48時間以内に復旧できるのはホット(4h)、DRaaS(12h)、ウォーム(36h)。このうち最も安いのはウォームサイト$150,000。コールドサイトは10日でRTOを満たさない。</p>
<p>⑥ RTO 8時間を満たすのはホットサイト(4h)のみ。DRaaSは12時間で満たさない。</p>
<p>⑦ RPOはデータの取得頻度で決まる。復旧サイトの種類(RTOに影響)や差分化(復元セット数に影響)ではRPOは短縮されない。1時間以内にするにはトランザクションログの複製(ジャーナリング、リモート複製)を少なくとも1時間ごとに行う必要がある。</p>`,
});

CPA.tbs({
  id: "TBS-ISC-25", section: "ISC", chapter: "ISC-01", title: "サービスモデル別の利用者責任の範囲",
  scenario: `<p>Brightwater Health, a regional hospital group, is moving several systems to the cloud. Its IT risk committee prepared the following matrix to clarify which control activities Brightwater (the customer) remains responsible for under each cloud service model:</p>
<ul><li><b>IaaS</b>: Brightwater rents virtual machines, storage, and networking.</li>
<li><b>PaaS</b>: Brightwater deploys its own custom applications on a provider-managed platform (operating system, runtime, and database engine are managed by the provider).</li>
<li><b>SaaS</b>: Brightwater subscribes to a provider's finished application.</li></ul>
<p>For each control activity, select the service models under which Brightwater is responsible. Then answer the remaining questions.</p>
<p class="ja">地域の病院グループBrightwater Healthは、複数のシステムをクラウドへ移行する。ITリスク委員会は、各サービスモデルにおいて利用者であるBrightwaterが責任を負う統制活動を整理する。IaaSは仮想マシン・ストレージ・ネットワークを借りる、PaaSは事業者が管理する基盤(OS、ランタイム、DBエンジンは事業者が管理)上に自社の独自アプリケーションを展開する、SaaSは事業者の完成したアプリケーションを利用する。各統制活動について、Brightwaterが責任を負うサービスモデルを選べ。あわせて残りの問いに答えよ。</p>`,
  rows: [
    { label: "Physical access controls and environmental protection at the data center(データセンターの物理アクセス統制と環境保護)", type: "select", options: ["IaaS only", "IaaS and PaaS", "IaaS, PaaS, and SaaS", "None — provider in all three"], answer: "None — provider in all three" },
    { label: "Patching the operating system(OSへのパッチ適用)", type: "select", options: ["IaaS only", "IaaS and PaaS", "IaaS, PaaS, and SaaS", "None — provider in all three"], answer: "IaaS only" },
    { label: "Secure development and change management of the application code(アプリケーションコードのセキュア開発と変更管理)", type: "select", options: ["IaaS only", "IaaS and PaaS", "IaaS, PaaS, and SaaS", "None — provider in all three"], answer: "IaaS and PaaS" },
    { label: "Granting user access and performing periodic user access reviews(利用者アクセスの付与と定期的なアクセスレビュー)", type: "select", options: ["IaaS only", "IaaS and PaaS", "IaaS, PaaS, and SaaS", "None — provider in all three"], answer: "IaaS, PaaS, and SaaS" },
    { label: "Maintaining and securing the hypervisor(ハイパーバイザーの保守とセキュリティ)", type: "select", options: ["IaaS only", "IaaS and PaaS", "IaaS, PaaS, and SaaS", "None — provider in all three"], answer: "None — provider in all three" },
    { label: "Deployment model for infrastructure shared only by several hospitals with common HIPAA requirements(共通のHIPAA要件を持つ複数病院だけで共有する基盤の展開モデル)", type: "select", options: ["Public cloud", "Private cloud", "Community cloud", "Hybrid cloud"], answer: "Community cloud" },
    { label: "Report Brightwater's external auditor should obtain on the SaaS billing provider's controls relevant to financial reporting(SaaS請求事業者の財務報告関連統制について入手すべき報告書)", type: "select", options: ["SOC 1 Type 2 report", "SOC 2 Type 1 report", "SOC 3 report", "SOC for Cybersecurity report"], answer: "SOC 1 Type 2 report" },
  ],
  explain: `<p>① 物理セキュリティはどのモデルでも事業者の責任である。</p>
<p>② OSはIaaSでは利用者が管理するが、PaaS・SaaSでは事業者が管理する。よってIaaSのみ。</p>
<p>③ 自社の独自アプリはIaaSでもPaaSでも利用者が開発・変更管理する。SaaSではアプリ自体が事業者のものなので事業者の責任。よってIaaSとPaaS。</p>
<p>④ 誰にアクセスを与えるか、データをどう分類・保護するかは、どのモデルでも利用者に残る責任である(責任共有モデルの基本)。</p>
<p>⑤ ハイパーバイザー(仮想化層)はIaaSでも事業者が管理する。利用者の責任はその上の仮想マシン以降である。</p>
<p>⑥ 共通の目的・規制要件を持つ複数組織だけで共有するのはコミュニティクラウドである。</p>
<p>⑦ 財務報告に関連する内部統制について監査人が依拠するにはSOC 1報告書、それも一定期間の運用状況の有効性を含むType 2が適切である。SOC 2はセキュリティ等のトラストサービス規準、SOC 3は一般向けの要約版である。</p>`,
});

CPA.tbs({
  id: "TBS-ISC-26", section: "ISC", chapter: "ISC-01", title: "テストの種類と移行方法の期待コスト比較",
  scenario: `<p>Ashford Industries is replacing its sales commission and payroll systems. The project manager's status memo lists the activities below.</p>
<p><b>Exhibit 1 — Project activities</b></p>
<ul><li>(1) Business analysts interview sales managers and document that the system must calculate commissions under three tiered plans.</li>
<li>(2) Programmers test each newly coded module in isolation before it is combined with others.</li>
<li>(3) Payroll and accounting staff run month-end scenarios in the test environment and formally sign off.</li>
<li>(4) After a vendor patch, the team reruns previously passed payroll test scripts to confirm nothing else broke.</li>
<li>(5) Six months after go-live, users request a new column on the commission report.</li></ul>
<p><b>Exhibit 2 — Conversion decisions</b></p>
<ul><li>Payroll (3,000 employees): management states that any payroll failure is unacceptable.</li>
<li>Commission system (12 sales offices): management wants to install it at one office for two months and fix problems before rolling it out to the other offices.</li></ul>
<p><b>Exhibit 3 — Payroll conversion cost estimates</b></p>
<table><tr><th></th><th>Direct cutover</th><th>Parallel conversion</th></tr>
<tr><td>Incremental staffing cost</td><td>$0</td><td>6 clerks × 3 months × $5,000 per clerk-month</td></tr>
<tr><td>Probability of a significant failure</td><td>10%</td><td>1%</td></tr>
<tr><td>Loss if a significant failure occurs</td><td>$1,200,000</td><td>$1,200,000</td></tr></table>
<p class="ja">Ashford社は販売コミッションと給与のシステムを更新している。資料1は活動:(1)業務アナリストが営業マネージャーにヒアリングし、3段階のコミッション計算が必要だと文書化する。(2)プログラマーが新規モジュールを他と結合する前に単独でテストする。(3)給与・経理担当者がテスト環境で月末処理を実行し正式に承認する。(4)ベンダーのパッチ適用後、合格済みの給与テストスクリプトを再実行して他に影響がないことを確認する。(5)本稼働6か月後に、利用者がコミッション報告書への列の追加を要望する。資料2は移行の判断:給与(従業員3,000人)はいかなる失敗も許容できない。コミッション(営業所12か所)は1つの営業所に2か月導入して問題を修正した後、他の営業所へ展開したい。資料3は給与の移行コスト見積り(直接切替:追加人件費$0、重大な失敗の確率10%。並行移行:事務員6人×3か月×$5,000、失敗確率1%。失敗時の損失はいずれも$1,200,000)。</p>`,
  rows: [
    { label: "SDLC phase of activity (1)(活動(1)のSDLCフェーズ)", type: "select", options: ["Planning/feasibility", "Analysis (requirements)", "Design", "Development", "Implementation", "Maintenance"], answer: "Analysis (requirements)" },
    { label: "SDLC phase of activity (5)(活動(5)のSDLCフェーズ)", type: "select", options: ["Planning/feasibility", "Analysis (requirements)", "Design", "Development", "Implementation", "Maintenance"], answer: "Maintenance" },
    { label: "Type of testing in activity (2)(活動(2)のテストの種類)", type: "select", options: ["Unit testing", "Integration testing", "User acceptance testing", "Regression testing", "Stress testing"], answer: "Unit testing" },
    { label: "Type of testing in activity (3)(活動(3)のテストの種類)", type: "select", options: ["Unit testing", "Integration testing", "User acceptance testing", "Regression testing", "Stress testing"], answer: "User acceptance testing" },
    { label: "Type of testing in activity (4)(活動(4)のテストの種類)", type: "select", options: ["Unit testing", "Integration testing", "User acceptance testing", "Regression testing", "Stress testing"], answer: "Regression testing" },
    { label: "Conversion method for the commission system(コミッションシステムの移行方法)", type: "select", options: ["Direct (plunge) cutover", "Parallel conversion", "Pilot conversion", "Phased (modular) conversion"], answer: "Pilot conversion" },
    { label: "Expected cost savings of parallel conversion over direct cutover for payroll, $(給与での並行移行の直接切替に対する期待コスト削減額)", type: "num", answer: 18000 },
  ],
  explain: `<p>① 利用者のニーズを聴取し要件を文書化するのは分析(要件定義)フェーズである。</p>
<p>② 本稼働後の変更・機能追加の要望は保守フェーズで扱う。</p>
<p>③ 個々のモジュールを単独でテストするのは単体テストである(結合後のインターフェースの確認は結合テスト)。</p>
<p>④ 利用者部門が業務シナリオで検証し正式に承認するのはユーザー受入テスト(UAT)である。</p>
<p>⑤ 変更後に既存機能が壊れていないか、合格済みのテストを再実行するのは回帰テストである。</p>
<p>⑥ 1つの拠点で先行導入し、問題を解決してから他拠点に展開するのはパイロット移行である(段階的移行はモジュール・機能単位で順次導入する方法)。なお給与は失敗が許されないため並行移行が適する。</p>
<p>⑦ 直接切替の期待コスト = 0 + 10% × 1,200,000 = 120,000。並行移行の期待コスト = 6 × 3 × 5,000 = 90,000 + 1% × 1,200,000 = 12,000 → 102,000。削減額 = 120,000 − 102,000 = 18,000。期待コストの面でも並行移行が有利である。</p>`,
});

CPA.tbs({
  id: "TBS-ISC-27", section: "ISC", chapter: "ISC-01", title: "ロールマトリクスによるIT職務の分離の評価",
  scenario: `<p>During an IT general controls walkthrough at Pembrook Corp., the auditor obtained the following extract of the system role matrix. An "X" means the user holds the permission in the <b>production</b> environment unless otherwise noted.</p>
<table><tr><th>User</th><th>Write program code (development)</th><th>Migrate code to production</th><th>Security administration (create users, assign roles)</th><th>Run/modify production job schedule</th><th>Direct update of production database tables</th><th>Business transaction rights</th></tr>
<tr><td>Kim</td><td>X</td><td>X</td><td></td><td></td><td></td><td>None</td></tr>
<tr><td>Lee</td><td></td><td></td><td>X</td><td></td><td></td><td>Create vendors; enter AP invoices</td></tr>
<tr><td>Patel</td><td></td><td></td><td></td><td>X (run only)</td><td></td><td>None (help desk password resets only)</td></tr>
<tr><td>Ortiz</td><td>X</td><td></td><td></td><td>X (run and modify parameters)</td><td></td><td>None</td></tr>
<tr><td>Chen</td><td></td><td></td><td></td><td></td><td>X</td><td>Approve journal entries in the GL</td></tr></table>
<p>Pembrook's IT department has only six employees.</p>
<p class="ja">Pembrook社のIT全般統制のウォークスルーで、監査人はシステムのロールマトリクスを入手した。「X」は特記がない限り<b>本番</b>環境でその権限を持つことを示す。列は左から、プログラム作成(開発)、本番への移送、セキュリティ管理(ユーザー作成・ロール付与)、本番ジョブスケジュールの実行・変更、本番DBテーブルの直接更新、業務取引権限。Kimは開発と移送、Leeはセキュリティ管理と仕入先登録・買掛金請求書入力、Patelはジョブの実行のみ(ヘルプデスクのパスワードリセットのみ)、Ortizは開発とジョブの実行・パラメータ変更、Chenは本番DBの直接更新と総勘定元帳の仕訳承認を持つ。同社のIT部門は6名しかいない。</p>`,
  rows: [
    { label: "Kim(Kimの評価)", type: "select", options: ["No incompatible duties", "Incompatible: program development and production migration", "Incompatible: security administration and transaction processing", "Incompatible: computer operations and program development", "Incompatible: direct data modification and transaction authorization"], answer: "Incompatible: program development and production migration" },
    { label: "Lee(Leeの評価)", type: "select", options: ["No incompatible duties", "Incompatible: program development and production migration", "Incompatible: security administration and transaction processing", "Incompatible: computer operations and program development", "Incompatible: direct data modification and transaction authorization"], answer: "Incompatible: security administration and transaction processing" },
    { label: "Patel(Patelの評価)", type: "select", options: ["No incompatible duties", "Incompatible: program development and production migration", "Incompatible: security administration and transaction processing", "Incompatible: computer operations and program development", "Incompatible: direct data modification and transaction authorization"], answer: "No incompatible duties" },
    { label: "Ortiz(Ortizの評価)", type: "select", options: ["No incompatible duties", "Incompatible: program development and production migration", "Incompatible: security administration and transaction processing", "Incompatible: computer operations and program development", "Incompatible: direct data modification and transaction authorization"], answer: "Incompatible: computer operations and program development" },
    { label: "Chen(Chenの評価)", type: "select", options: ["No incompatible duties", "Incompatible: program development and production migration", "Incompatible: security administration and transaction processing", "Incompatible: computer operations and program development", "Incompatible: direct data modification and transaction authorization"], answer: "Incompatible: direct data modification and transaction authorization" },
    { label: "Number of users with at least one incompatible combination(不適合な職務の組合せを持つ利用者数)", type: "num", answer: 4 },
    { label: "Best compensating control if Kim's duties cannot be separated(Kimの職務を分離できない場合の最適な補完統制)", type: "select", options: ["Require Kim to sign an annual code of conduct acknowledgment", "Have an independent person compare production change logs to approved tickets and review the migrated code changes", "Increase the frequency of full backups", "Require Kim to change passwords every 30 days"], answer: "Have an independent person compare production change logs to approved tickets and review the migrated code changes" },
  ],
  explain: `<p>① Kim:開発者が自分のコードを本番に移送できると、未承認・未テストのプログラム変更(不正なロジックを含む)を本番に入れられる。開発と本番移送の不適合。</p>
<p>② Lee:セキュリティ管理者が業務取引も行えると、自分に追加権限を付与して取引を処理し、記録を隠せる。さらに仕入先登録と請求書入力を同時に持つことも架空仕入先リスクを高める。セキュリティ管理と取引処理の不適合。</p>
<p>③ Patel:ジョブの実行のみでパラメータ変更権限はなく、プログラム開発や取引権限もない。ヘルプデスクのパスワードリセットは本人確認手続があれば通常の職務であり、不適合な組合せはない。</p>
<p>④ Ortiz:開発者が本番ジョブを実行・変更できると、プログラムや処理パラメータを操作して本番処理を変えられる。オペレーションと開発の不適合。</p>
<p>⑤ Chen:本番データを直接更新できる者が仕訳承認も行えると、承認統制を迂回して記録を改変できる。データの直接変更と取引承認の不適合。</p>
<p>⑥ 不適合はKim・Lee・Ortiz・Chenの4名(Patelのみ問題なし)。</p>
<p>⑦ 小規模組織で職務分離が困難な場合、独立した者が本番変更ログを承認済みチケットと突合し、移送された変更内容をレビューする発見的統制が最も直接的な補完統制となる。行動規範の署名、バックアップ頻度、パスワード変更はこのリスクに対応しない。</p>`,
});

CPA.tbs({
  id: "TBS-ISC-28", section: "ISC", chapter: "ISC-01", title: "データライフサイクルと記録保存・廃棄の判断",
  scenario: `<p>Thornbury Retail's records manager is performing the semiannual retention review as of <b>June 30, 2026</b>. Thornbury's fiscal year ends December 31.</p>
<p><b>Exhibit 1 — Retention policy (excerpt)</b></p>
<table><tr><th>Record type</th><th>Retention period</th></tr>
<tr><td>Accounts payable invoices</td><td>7 years after the end of the fiscal year in which created</td></tr>
<tr><td>Payroll registers</td><td>4 years after the end of the calendar year of payment</td></tr>
<tr><td>Applications of unsuccessful job applicants</td><td>1 year after the hiring decision</td></tr>
<tr><td>Web server logs</td><td>90 days after creation</td></tr>
<tr><td>All records</td><td>Records subject to a legal hold may not be destroyed until Legal releases the hold</td></tr></table>
<p><b>Exhibit 2 — Records inventory</b></p>
<table><tr><th>Set</th><th>Description</th></tr>
<tr><td>A</td><td>AP invoices created in fiscal 2018</td></tr>
<tr><td>B</td><td>AP invoices created in fiscal 2019</td></tr>
<tr><td>C</td><td>Payroll registers for 2021 payments</td></tr>
<tr><td>D</td><td>Supplier contracts that expired in 2017; subject to a legal hold issued in 2025 for a pending lawsuit</td></tr>
<tr><td>E</td><td>Unsuccessful applicant files; hiring decisions made in 2023</td></tr>
<tr><td>F</td><td>Web server logs created January–March 2026</td></tr></table>
<p class="ja">Thornbury Retail社の記録管理責任者は、<b>2026年6月30日</b>時点の半期の保存期間レビューを行っている。会計年度末は12月31日。資料1の保存方針:買掛金請求書は作成した会計年度末から7年、給与台帳は支払暦年末から4年、不採用応募者の応募書類は採否決定から1年、Webサーバーログは作成から90日。リーガルホールド(訴訟ホールド)の対象記録は法務部が解除するまで廃棄できない。資料2の記録一覧:A=2018年度作成のAP請求書、B=2019年度作成のAP請求書、C=2021年支払分の給与台帳、D=2017年に失効した仕入先契約で、係属中の訴訟のため2025年にリーガルホールドが発行されている、E=2023年に採否決定した不採用者の書類、F=2026年1〜3月作成のWebサーバーログ。</p>`,
  rows: [
    { label: "Number of record sets (A–F) eligible for destruction at June 30, 2026(2026年6月30日時点で廃棄可能な記録セット数)", type: "num", answer: 4 },
    { label: "Calendar year in which set B first becomes eligible for destruction(セットBが初めて廃棄可能になる暦年)", type: "num", answer: 2027 },
    { label: "Appropriate action for set D(セットDに対する適切な対応)", type: "select", options: ["Destroy, because the retention period has expired", "Retain until Legal releases the hold, then apply the normal policy", "Move to archive and destroy after one more year", "Destroy the originals but keep scanned copies"], answer: "Retain until Legal releases the hold, then apply the normal policy" },
    { label: "Lifecycle stage: closed-period sales data moved to low-cost, read-only storage and rarely accessed(ライフサイクル段階:締め済みの販売データを低コストの読取専用ストレージに移し、ほとんど参照しない)", type: "select", options: ["Create/capture", "Store", "Use", "Share", "Archive", "Destroy"], answer: "Archive" },
    { label: "Lifecycle stage: customer data sent to an outside analytics firm under a data-processing agreement(ライフサイクル段階:データ処理契約に基づき顧客データを外部の分析会社に送る)", type: "select", options: ["Create/capture", "Store", "Use", "Share", "Archive", "Destroy"], answer: "Share" },
    { label: "Appropriate disposal method for decommissioned SSDs holding customer PII(顧客の個人情報を保持する廃棄予定SSDの適切な処分方法)", type: "select", options: ["Delete the files and empty the recycle bin", "Perform a quick format", "Cryptographic erase or physical destruction (shredding), with a certificate of destruction", "Store the drives in a locked cabinet indefinitely"], answer: "Cryptographic erase or physical destruction (shredding), with a certificate of destruction" },
    { label: "Marketing wants to keep full payment card numbers indefinitely for analytics. Best response(マーケティング部が分析目的でカード番号全桁の無期限保存を求めている。最適な対応)", type: "select", options: ["Approve, if the data is stored in the data warehouse", "Approve, if access is limited to the marketing team", "Tokenize or truncate the card numbers and purge full numbers once the business need ends", "Move the full numbers to offsite backup tapes"], answer: "Tokenize or truncate the card numbers and purge full numbers once the business need ends" },
  ],
  explain: `<p>① 各セットの判定(2026年6月30日時点):A=2018年度末(2018/12/31)+7年=2025/12/31経過で廃棄可。B=2019/12/31+7年=2026/12/31まで保存のため不可。C=2021年末+4年=2025/12/31経過で可。D=保存期間は経過しているがリーガルホールド中のため不可。E=2023年の決定+1年=2024年中に経過で可。F=最も新しい3月31日作成分も90日後の6月29日までに経過しており可。よって可能なのはA・C・E・Fの4セット。</p>
<p>② Bは2026年12月31日まで保存が必要なので、廃棄可能になるのは2027年。</p>
<p>③ リーガルホールドは通常の保存期間に優先する。保存期間が過ぎていても、法務部が解除するまでは保存し、解除後に通常の方針を適用する。ホールド中の廃棄は証拠隠滅(spoliation)となり得る。</p>
<p>④ 利用頻度の低いデータを長期保存用の低コスト・読取専用環境に移すのはアーカイブ段階である。</p>
<p>⑤ 組織外の第三者にデータを提供するのは共有段階であり、契約による保護義務の設定が重要となる。</p>
<p>⑥ ファイル削除やクイックフォーマットではデータが復元可能である。SSDは上書きが確実に効かないため、暗号消去または物理破壊(シュレッド)を行い、廃棄証明書を入手する。</p>
<p>⑦ データ最小化の原則とPCI DSSでは、不要なカード番号全桁を保存しない。分析にはトークン化・切り捨て(マスキング)したデータを用い、業務上の必要がなくなった全桁データは消去する。保管場所やアクセス制限だけでは無期限保存は正当化されない。</p>`,
});
