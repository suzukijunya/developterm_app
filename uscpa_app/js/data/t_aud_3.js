// AUD のTBS追加(実証手続・監査証拠:アサーション対応・確認・現金・棚卸・未計上負債・分析的手続・サンプリング・文書レビュー・後発事象・ADA)

CPA.tbs({
  id: "TBS-AUD-50", section: "AUD", chapter: "AUD-04", title: "取引サイクル別の監査手続とアサーションの対応(購買・固定資産・人件費・借入金)",
  scenario: `<p>Reyes &amp; Okafor CPAs is auditing the December 31, Year 2 financial statements of <b>Corbin Tool Co.</b>, a nonissuer. The audit senior drafted the following substantive procedures for the purchases/payables, property and equipment, payroll, and debt areas. For each procedure, select the <b>primary</b> assertion the procedure is designed to address.</p>
<table><tr><th>#</th><th>Procedure</th></tr>
<tr><td>1</td><td>Select receiving reports dated in the last ten days of Year 2 and the first ten days of Year 3 and trace them to the purchases journal and vendor invoices to determine the period in which each purchase was recorded.</td></tr>
<tr><td>2</td><td>Select additions to equipment recorded during Year 2, vouch them to vendor invoices, and physically inspect the assets on the plant floor.</td></tr>
<tr><td>3</td><td>Scan the repairs and maintenance expense ledger for large or unusual items and examine supporting invoices.</td></tr>
<tr><td>4</td><td>Inspect certificates of title for delivery vehicles and property tax bills for the land and building.</td></tr>
<tr><td>5</td><td>Recompute depreciation expense using the company's policy and compare useful lives with industry experience.</td></tr>
<tr><td>6</td><td>Send confirmations to major vendors, including vendors with zero balances at year-end, requesting a statement of the amount owed.</td></tr>
<tr><td>7</td><td>For a sample of employees on the payroll register, compare names, pay rates, and Social Security numbers to personnel files and verify that each employee is currently employed.</td></tr>
<tr><td>8</td><td>Read loan agreements and board minutes to determine whether any portion of long-term debt is due within twelve months of the balance sheet date.</td></tr></table>
<p class="ja">Reyes &amp; Okafor CPAsは非発行体であるCorbin Tool Co.の第2年度12月31日の財務諸表を監査している。シニアが購買・買掛金、有形固定資産、人件費、借入金について次の実証手続を立案した。各手続が主として対応するアサーションを選択せよ。(1)第2年度最後の10日間と第3年度最初の10日間の受入報告書を仕入帳・請求書へ追跡し計上期間を確かめる。(2)当期の設備取得を請求書に証憑突合し、現物を視察する。(3)修繕費勘定から多額・異常な項目を閲覧し証憑を調べる。(4)車両の所有権証書と土地建物の固定資産税請求書を閲覧する。(5)会社の方針で減価償却費を再計算し、耐用年数を業界実績と比べる。(6)期末残高ゼロの仕入先を含む主要仕入先に残高確認を送付する。(7)給与台帳の従業員を人事ファイルと照合し在籍を確かめる。(8)借入契約書と取締役会議事録を読み、1年以内返済部分の有無を確かめる。</p>`,
  rows: [
    { label: "Procedure 1(手続1:受入報告書の期間帰属テスト)", type: "select", options: ["Occurrence", "Completeness", "Accuracy", "Cutoff", "Classification"], answer: "Cutoff" },
    { label: "Procedure 2(手続2:設備取得の証憑突合と現物視察)", type: "select", options: ["Existence", "Completeness", "Rights and obligations", "Valuation and allocation", "Classification"], answer: "Existence" },
    { label: "Procedure 3(手続3:修繕費の閲覧)", type: "select", options: ["Existence", "Completeness", "Rights and obligations", "Valuation and allocation", "Cutoff"], answer: "Completeness" },
    { label: "Procedure 4(手続4:所有権証書・固定資産税請求書の閲覧)", type: "select", options: ["Existence", "Completeness", "Rights and obligations", "Valuation and allocation", "Classification"], answer: "Rights and obligations" },
    { label: "Procedure 5(手続5:減価償却費の再計算)", type: "select", options: ["Existence", "Completeness", "Rights and obligations", "Valuation and allocation", "Cutoff"], answer: "Valuation and allocation" },
    { label: "Procedure 6(手続6:残高ゼロを含む仕入先への確認)", type: "select", options: ["Existence", "Completeness", "Rights and obligations", "Valuation and allocation", "Classification"], answer: "Completeness" },
    { label: "Procedure 7(手続7:給与台帳から人事ファイルへの照合)", type: "select", options: ["Occurrence", "Completeness", "Accuracy", "Cutoff", "Classification"], answer: "Occurrence" },
    { label: "Procedure 8(手続8:1年以内返済部分の検討)", type: "select", options: ["Existence", "Completeness", "Rights and obligations", "Valuation and allocation", "Classification"], answer: "Classification" },
  ],
  explain: `<p>(1)期末日前後の受入報告書を仕入帳へ追跡し、正しい期間に計上されたかを確かめるので<b>期間帰属(Cutoff)</b>である。</p>
<p>(2)帳簿上の取得記録(記録)から証憑・現物へ向かう方向(vouching)であり、計上された資産が実在するかを確かめる<b>実在性(Existence)</b>である。</p>
<p>(3)本来資産計上すべき支出が費用処理されていないかを探す手続であり、有形固定資産の<b>網羅性(Completeness)</b>に対応する(費用側から見れば分類の問題でもあるが、主目的は資産の計上漏れの発見である)。</p>
<p>(4)所有権証書や固定資産税の納税義務者を確かめるのは<b>権利と義務(Rights and obligations)</b>である。</p>
<p>(5)減価償却は取得原価の期間配分であり、<b>評価と期間配分(Valuation and allocation)</b>である。</p>
<p>(6)買掛金の確認を期末残高ゼロの仕入先や取引量の多い仕入先に送るのは、計上漏れ(過小計上)を発見するためであり<b>網羅性</b>である。買掛金は過小計上リスクが高い点が売掛金との違いである。</p>
<p>(7)給与台帳(記録)から人事ファイルへ照合し架空従業員がいないかを確かめるので、人件費取引の<b>発生(Occurrence)</b>である。</p>
<p>(8)1年以内に返済期限が到来する部分を流動負債へ振り替える必要があるかの検討であり、<b>分類(Classification)</b>(表示)である。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-51", section: "AUD", chapter: "AUD-04", title: "売掛金確認結果の集計・母集団への推定と代替手続",
  scenario: `<p>The auditor of <b>Lindqvist Supply, Inc.</b> sent positive confirmations as of December 31, Year 2 to a nonstatistical sample of customer accounts. The accounts receivable population totals <b>$2,400,000</b>; the sample accounts total <b>$600,000</b>. Tolerable misstatement for accounts receivable is <b>$50,000</b>. The auditor projects misstatements using the ratio of misstatement to book value in the sample.</p>
<p><b>Exhibit — Confirmation results</b></p>
<table><tr><th>Customer</th><th>Book value</th><th>Result / follow-up</th></tr>
<tr><td>A</td><td>$80,000</td><td>Confirmed without exception.</td></tr>
<tr><td>B</td><td>$65,000</td><td>Customer reports $59,000. Customer mailed a $6,000 check on December 30; client deposited it January 3, Year 3.</td></tr>
<tr><td>C</td><td>$72,000</td><td>Customer reports $64,800. Auditor confirmed the invoice was billed at an incorrect unit price; customer's amount is correct.</td></tr>
<tr><td>D</td><td>$54,000</td><td>Customer reports $50,000. A $4,000 shipment, terms FOB destination, left the client's dock December 31 and was received by the customer January 4; the client recorded the sale in December.</td></tr>
<tr><td>E</td><td>$90,000</td><td>No response to second request. Auditor matched January cash receipts of $90,000 to the specific December invoices.</td></tr>
<tr><td>F</td><td>$48,000</td><td>No response. January receipts of $30,000 matched to invoices; remaining $18,000 vouched to signed customer purchase orders and carrier-signed shipping documents.</td></tr>
<tr><td>G</td><td>$41,000</td><td>Customer reports $38,000. Goods of $3,000 were returned December 28; the client issued the credit memo January 6.</td></tr>
<tr><td>Others</td><td>$150,000</td><td>Confirmed without exception.</td></tr></table>
<p class="ja">Lindqvist Supply, Inc.の監査人は第2年度12月31日現在で非統計的サンプルの得意先に積極的確認を送付した。売掛金母集団は$2,400,000、サンプル合計は$600,000、売掛金の許容虚偽表示は$50,000である。虚偽表示はサンプルの帳簿価額に対する虚偽表示の比率で推定する。B:顧客回答$59,000、差額$6,000は12月30日郵送の小切手で1月3日入金。C:顧客回答$64,800、単価誤りの請求で顧客が正しい。D:顧客回答$50,000、仕向地渡し$4,000の出荷が12月31日出荷・1月4日到着なのに12月に売上計上。E:再請求後も回答なし、1月入金$90,000を12月の個別請求書と照合。F:回答なし、1月入金$30,000を照合し残り$18,000は署名入り注文書と運送業者署名入り出荷書類に証憑突合。G:顧客回答$38,000、12月28日の返品$3,000の貸方票を1月6日に発行。その他$150,000は差異なし。</p>`,
  rows: [
    { label: "Total misstatement identified in the sample ($)(サンプルで識別された虚偽表示の合計)", type: "num", answer: 14200 },
    { label: "Projected misstatement for the population ($)(母集団への推定虚偽表示)", type: "num", answer: 56800 },
    { label: "Customer B difference(得意先Bの差異)", type: "select", options: ["Misstatement — accounts receivable overstated $6,000", "Timing difference (payment in transit) — not a misstatement; verify the January deposit", "Cutoff misstatement — revenue overstated $6,000", "Indicator of lapping — treat as a fraud misstatement"], answer: "Timing difference (payment in transit) — not a misstatement; verify the January deposit" },
    { label: "Customer D difference(得意先Dの差異)", type: "select", options: ["Not a misstatement because title passed at shipment", "Cutoff misstatement — sales and receivables overstated $4,000", "Pricing misstatement — receivables overstated $4,000", "Timing difference — no adjustment"], answer: "Cutoff misstatement — sales and receivables overstated $4,000" },
    { label: "Adequacy of alternative procedures for Customers E and F(E・Fの代替手続の妥当性)", type: "select", options: ["Inadequate — nonresponses must be treated as misstatements in full", "Adequate — subsequent receipts and vouching to shipping documents provide evidence of existence", "Inadequate — the auditor must send negative confirmations instead", "Adequate only for E; F's unpaid balance must be projected as misstatement"], answer: "Adequate — subsequent receipts and vouching to shipping documents provide evidence of existence" },
    { label: "Conclusion on accounts receivable(売掛金についての結論)", type: "select", options: ["Accept the balance — the known misstatement is below tolerable misstatement", "Accept the balance — projected misstatement is below overall materiality", "Projected misstatement exceeds tolerable misstatement — request adjustment and/or perform additional procedures before concluding", "Issue an adverse opinion immediately"], answer: "Projected misstatement exceeds tolerable misstatement — request adjustment and/or perform additional procedures before concluding" },
  ],
  explain: `<p><b>虚偽表示の判定</b>:Bは期末日時点で顧客が既に支払った未着金(タイミング差異)で虚偽表示ではない。Cは単価誤り$7,200(72,000−64,800)、Dは仕向地渡しで12月31日時点では所有権が移転していないのに売上計上した期間帰属誤り$4,000、Gは期末前の返品の貸方票未計上$3,000。E・Fは代替手続で実在性が確かめられ虚偽表示なし。</p>
<p>サンプルの虚偽表示合計 = 7,200 + 4,000 + 3,000 = <b>$14,200</b>。</p>
<p>推定:虚偽表示率 = 14,200 ÷ 600,000 = 2.3667%。母集団への推定額 = 2,400,000 × 14,200 ÷ 600,000 = <b>$56,800</b>(サンプル内の既知額を含む総額)。</p>
<p>未回答先の代替手続としては期末日後の入金の検証(特定の請求書との照合)と、未入金部分の出荷書類・注文書への証憑突合が典型であり妥当である。未回答を自動的に虚偽表示とみなすわけではない。</p>
<p>推定虚偽表示$56,800は許容虚偽表示$50,000を超えるため、サンプリングリスクを考えると売掛金が重要な虚偽表示を含む可能性がある。経営者に修正を求め、または追加手続を実施してから結論を出す。既知の額だけで判断するのは誤りである。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-52", section: "AUD", chapter: "AUD-04", title: "カットオフ銀行残高証明書を用いた銀行勘定調整表のレビュー",
  scenario: `<p>The auditor of <b>Pellham Distributors</b> is reviewing the client-prepared bank reconciliation for the general operating account at December 31, Year 2. The auditor obtained a <b>cutoff bank statement</b> for January 1–14, Year 3 directly from the bank.</p>
<p><b>Exhibit 1 — Client bank reconciliation, December 31, Year 2</b></p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Balance per bank statement</td><td>$182,400</td></tr>
<tr><td>Add: deposits in transit</td><td>24,600</td></tr>
<tr><td>Less: outstanding checks (#1201 $5,000; #1205 $8,250; #1207 $18,000)</td><td>(31,250)</td></tr>
<tr><td>Adjusted balance per bank</td><td>$175,750</td></tr>
<tr><td>Balance per general ledger</td><td>$178,150</td></tr>
<tr><td>Less: bank service charge not recorded</td><td>(400)</td></tr>
<tr><td>Less: NSF customer check not recorded</td><td>(2,000)</td></tr>
<tr><td>Adjusted balance per books</td><td>$175,750</td></tr></table>
<p><b>Exhibit 2 — Auditor's notes from the cutoff bank statement and supporting documents</b></p>
<ul><li>Deposits credited January 2: $14,600 (deposit slip dated December 31). Deposits credited January 9: $10,000 (deposit slip dated January 8; the remittance advices show the customer checks were received January 7 and 8). Both amounts were recorded as December cash receipts in the general ledger.</li>
<li>Checks cleared: #1199 $6,500 (dated and recorded December 20) cleared January 3; #1201 $5,000 cleared January 4; #1205 $8,250 cleared January 6. Check #1207 had not cleared by January 14.</li>
<li>The service charge and NSF check amounts agree to the December bank statement.</li></ul>
<p class="ja">Pellham Distributorsの監査人は、第2年度12月31日の当座預金の銀行勘定調整表(会社作成)をレビューしている。1月1日〜14日のカットオフ銀行残高証明書を銀行から直接入手した。注記:1月2日入金$14,600(預入票12月31日付)、1月9日入金$10,000(預入票1月8日付、顧客小切手の受領は1月7日・8日)。どちらも総勘定元帳では12月の入金として記帳されている。#1199 $6,500(12月20日付・記帳済)が1月3日に決済、#1201は1月4日、#1205は1月6日に決済、#1207は1月14日時点で未決済。手数料とNSF小切手は12月の銀行明細と一致する。</p>`,
  rows: [
    { label: "Correct deposits in transit at December 31 ($)(12月31日の正しい未達預金)", type: "num", answer: 14600 },
    { label: "Correct total outstanding checks at December 31 ($)(正しい未取付小切手の合計)", type: "num", answer: 37750 },
    { label: "Correct adjusted balance per bank ($)(正しい修正後銀行残高)", type: "num", answer: 159250 },
    { label: "Correct adjusted balance per books before investigating any remaining difference ($)(差異調査前の正しい修正後帳簿残高)", type: "num", answer: 165750 },
    { label: "Unreconciled difference ($)(未調整差異)", type: "num", answer: 6500 },
    { label: "The $10,000 January 9 deposit indicates(1月9日入金$10,000が示すもの)", type: "select", options: ["A proper deposit in transit", "A cash cutoff error — January receipts recorded as December receipts, overstating cash and understating receivables", "Check kiting between two bank accounts", "An unrecorded bank credit to be added to the book balance"], answer: "A cash cutoff error — January receipts recorded as December receipts, overstating cash and understating receivables" },
    { label: "Most appropriate auditor response to the unreconciled difference(未調整差異への最も適切な対応)", type: "select", options: ["Pass on the difference because it is below overall materiality", "Propose an adjustment to bank service charge expense", "Treat it as a possible indicator of misappropriation concealed by omitting a check; evaluate fraud implications and communicate to the appropriate level of management", "Request a new bank confirmation and take no further action"], answer: "Treat it as a possible indicator of misappropriation concealed by omitting a check; evaluate fraud implications and communicate to the appropriate level of management" },
    { label: "Primary reason the cutoff statement was sent directly to the auditor(カットオフ明細を直接入手する主な理由)", type: "select", options: ["To confirm loan balances and compensating balances", "To obtain evidence about reconciling items from an independent source not subject to client alteration", "To test the completeness of accounts payable", "To satisfy the requirement to confirm every bank account"], answer: "To obtain evidence about reconciling items from an independent source not subject to client alteration" },
  ],
  explain: `<p><b>未達預金</b>:預入票が12月31日付の$14,600のみが正当な未達預金である。$10,000は1月に受領した小切手であり期末の未達預金ではない。正しい未達預金 = <b>$14,600</b>。</p>
<p><b>未取付小切手</b>:#1199($6,500)は12月20日付で記帳済みなのに1月3日に決済されているので期末に未取付であり、リストから漏れている。#1201・#1205は1月に決済され期末未取付として正しい。#1207は未決済のままなので引き続き未取付(後日の決済を追跡する)。合計 = 31,250 + 6,500 = <b>$37,750</b>。</p>
<p>修正後銀行残高 = 182,400 + 14,600 − 37,750 = <b>$159,250</b>。</p>
<p>修正後帳簿残高 = 178,150 − 400 − 2,000 − 10,000(1月入金を12月に計上した分を除く)= <b>$165,750</b>。</p>
<p>差異 = 165,750 − 159,250 = <b>$6,500</b>。帳簿上の現金が実際より$6,500多い。会社の調整表は#1199を除外することで一致したように見せており、現金の流用を隠蔽した可能性がある。</p>
<p>$10,000は翌期の入金を当期に計上した期間帰属の誤り(現金過大・売掛金過小)であり、期末の流動比率等を良く見せる操作の可能性もある。カイティングは銀行間振替の二重計上であり本件とは異なる。</p>
<p>不正の兆候は金額の多寡にかかわらず質的に重要であり、不正の影響を評価し適切な階層の経営者(関与する者によっては統治責任者)へ伝達する。カットオフ明細を銀行から直接入手するのは、会社が改ざんできない独立した情報源で調整項目(未達預金・未取付小切手)を検証するためである。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-53", section: "AUD", chapter: "AUD-04", title: "棚卸立会とプライステストの発見事項の集計",
  scenario: `<p>The auditor observed the December 31, Year 2 physical inventory of <b>Okonkwo Industrial Parts</b> and performed a pricing test. The client's compiled inventory listing (FIFO, lower of cost and net realizable value) totals <b>$1,250,000</b>. The auditor noted the following.</p>
<table><tr><th>#</th><th>Finding</th></tr>
<tr><td>1</td><td>Test count, tag 1142 (Part X): client listing shows 1,200 units at $15; the auditor's test count was 120 units. The client agrees the listing contains a keying error.</td></tr>
<tr><td>2</td><td>Goods held on consignment for Vendor Q, cost $22,500, were counted and included in the listing.</td></tr>
<tr><td>3</td><td>Goods purchased FOB shipping point, invoice $14,000, were shipped by the vendor December 29 and received January 3. They were not in the count, and the purchase was recorded in January.</td></tr>
<tr><td>4</td><td>Pricing test, Part Y: 2,000 units priced at $48 per unit; the most recent vendor invoices (covering more than 2,000 units) show $42 per unit.</td></tr>
<tr><td>5</td><td>Part Z: 500 units at cost of $30 per unit. Due to a design change, the estimated selling price is $20 per unit, with estimated costs to sell of $4 per unit.</td></tr></table>
<p class="ja">監査人はOkonkwo Industrial Partsの第2年度12月31日の実地棚卸に立会い、プライステストを行った。会社の棚卸表(先入先出法、原価と正味実現可能価額の低い方)の合計は$1,250,000である。(1)タグ1142の部品Xは棚卸表で1,200個@$15だが監査人のテストカウントは120個(入力誤り)。(2)仕入先Qからの受託品(原価$22,500)がカウントされ棚卸表に含まれている。(3)工場渡し条件の仕入$14,000が12月29日出荷・1月3日到着で、カウントに含まれず仕入も1月に計上。(4)部品Y 2,000個が@$48で評価されているが、直近の請求書(2,000個超をカバー)は@$42。(5)部品Z 500個の原価は@$30、設計変更により見積売価@$20、見積販売費用@$4。</p>`,
  rows: [
    { label: "Misstatement from tag 1142 ($, overstatement)(タグ1142による過大計上額)", type: "num", answer: 16200 },
    { label: "Misstatement from the Part Y pricing test ($, overstatement)(部品Yの単価誤りによる過大計上額)", type: "num", answer: 12000 },
    { label: "Write-down required for Part Z ($)(部品Zの評価減額)", type: "num", answer: 7000 },
    { label: "Net adjustment to inventory ($; enter a decrease as a negative number)(棚卸資産の純修正額:減少はマイナス)", type: "num", answer: -43700 },
    { label: "Corrected inventory balance ($)(修正後の棚卸資産残高)", type: "num", answer: 1206300 },
    { label: "Finding 3 — other account also misstated(発見事項3で併せて虚偽表示となる勘定)", type: "select", options: ["Cost of goods sold overstated $14,000", "Accounts payable understated $14,000", "Sales overstated $14,000", "No other account is affected"], answer: "Accounts payable understated $14,000" },
    { label: "Tracing tags selected on the warehouse floor to the inventory listing primarily tests(倉庫の現物から棚卸表への追跡が主に検証するもの)", type: "select", options: ["Existence", "Completeness", "Rights and obligations", "Valuation"], answer: "Completeness" },
  ],
  explain: `<p>(1)タグ1142:(1,200 − 120)× $15 = <b>$16,200</b> 過大。</p>
<p>(2)受託品は所有権が会社にないため除外する:$22,500 過大(権利と義務)。</p>
<p>(3)工場渡し(FOB shipping point)なので12月29日の出荷時点で所有権が移転しており、期末の棚卸資産に含めるべきである:$14,000 過小。仕入も1月計上なので<b>買掛金も$14,000過小</b>である(棚卸資産と買掛金が同額過小のため売上原価・利益には影響しない)。</p>
<p>(4)部品Y:(48 − 42)× 2,000 = <b>$12,000</b> 過大(FIFOでは直近の仕入単価が期末在庫に残る)。</p>
<p>(5)部品Z:正味実現可能価額 = 20 − 4 = $16。評価減 =(30 − 16)× 500 = <b>$7,000</b>。</p>
<p>純修正額 = −16,200 − 22,500 + 14,000 − 12,000 − 7,000 = <b>−$43,700</b>。修正後残高 = 1,250,000 − 43,700 = <b>$1,206,300</b>。</p>
<p>現物(床)から棚卸表への追跡は、存在する在庫が記録に漏れていないかを確かめる<b>網羅性</b>のテストである。逆方向(棚卸表から現物)は実在性のテストである。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-54", section: "AUD", chapter: "AUD-04", title: "期末日後支払からの未計上負債の検索と未修正虚偽表示の集計(AU-C 450)",
  scenario: `<p>The auditor of <b>Haverford Media, Inc.</b> (year-end December 31, Year 2) performed a search for unrecorded liabilities by examining cash disbursements made after year-end. Recorded accounts payable at December 31 was <b>$640,000</b>. All disbursements below were recorded in January, Year 3 unless stated otherwise.</p>
<p><b>Exhibit 1 — Subsequent disbursements, January Year 3</b></p>
<table><tr><th>Check</th><th>Date</th><th>Amount</th><th>Description</th></tr>
<tr><td>#3010</td><td>Jan 5</td><td>$18,500</td><td>Supplies received Dec 18; vendor invoice dated Dec 20. The invoice appears on the December 31 accounts payable listing.</td></tr>
<tr><td>#3014</td><td>Jan 8</td><td>$27,000</td><td>Paper stock; receiving report dated Dec 28; invoice dated Jan 2. The goods were not included in the December 31 physical count.</td></tr>
<tr><td>#3021</td><td>Jan 12</td><td>$9,600</td><td>Legal fees for services rendered December 1–31; invoice dated Jan 10.</td></tr>
<tr><td>#3025</td><td>Jan 15</td><td>$45,000</td><td>Printing equipment ordered Dec 15, shipped FOB destination, received Jan 10.</td></tr>
<tr><td>#3030</td><td>Jan 20</td><td>$12,000</td><td>Utilities for the service period December 1 – January 31 (usage was even across the period).</td></tr>
<tr><td>#3033</td><td>Jan 22</td><td>$4,800</td><td>Annual software subscription for February 1, Year 3 – January 31, Year 4.</td></tr></table>
<p><b>Exhibit 2 — Other uncorrected misstatements identified (effect on pretax income)</b></p>
<table><tr><th>Item</th><th>Type</th><th>Effect</th></tr>
<tr><td>Warranty liability: client's estimate is below the auditor's point estimate</td><td>Judgmental</td><td>Liability understated $20,000</td></tr>
<tr><td>Inventory pricing sample, projected</td><td>Projected</td><td>Inventory overstated $18,000</td></tr></table>
<p>Overall materiality is <b>$75,000</b> (based on pretax income); the clearly trivial threshold is <b>$3,000</b>. Management has declined to record any of the misstatements.</p>
<p class="ja">Haverford Media, Inc.(12月31日決算)の監査人は期末日後の支払を調べて未計上負債の検索を行った。12月31日の計上済買掛金は$640,000。#3010:12月18日受入・12月20日付請求の消耗品$18,500(期末買掛金リストに記載あり)。#3014:12月28日受入・1月2日付請求の用紙$27,000(期末実地棚卸に含まれていない)。#3021:12月1〜31日の弁護士報酬$9,600(1月10日付請求)。#3025:12月15日発注、仕向地渡し、1月10日到着の印刷機$45,000。#3030:12月1日〜1月31日の光熱費$12,000(使用量は均等)。#3033:2月1日開始の年間ソフトウェア利用料$4,800。その他の未修正虚偽表示:製品保証引当金が監査人の点推定より$20,000少ない(判断による虚偽表示)、棚卸資産の単価サンプルからの推定過大$18,000(推定虚偽表示)。全体の重要性は$75,000(税引前利益基準)、明らかに僅少な金額は$3,000。経営者は修正を拒否している。</p>`,
  rows: [
    { label: "Check #3010(小切手#3010)", type: "select", options: ["Unrecorded liability — full amount", "Unrecorded liability — partial amount", "Not a December 31 liability", "Already recorded at December 31"], answer: "Already recorded at December 31" },
    { label: "Check #3014(小切手#3014)", type: "select", options: ["Unrecorded liability — full amount", "Unrecorded liability — partial amount", "Not a December 31 liability", "Already recorded at December 31"], answer: "Unrecorded liability — full amount" },
    { label: "Check #3025(小切手#3025)", type: "select", options: ["Unrecorded liability — full amount", "Unrecorded liability — partial amount", "Not a December 31 liability", "Already recorded at December 31"], answer: "Not a December 31 liability" },
    { label: "Check #3030(小切手#3030)", type: "select", options: ["Unrecorded liability — full amount", "Unrecorded liability — partial amount", "Not a December 31 liability", "Already recorded at December 31"], answer: "Unrecorded liability — partial amount" },
    { label: "Total unrecorded liabilities at December 31 ($)(12月31日の未計上負債合計)", type: "num", answer: 42600 },
    { label: "Aggregate overstatement of pretax income from all uncorrected misstatements ($)(未修正虚偽表示による税引前利益の過大計上合計)", type: "num", answer: 53600 },
    { label: "Appropriate auditor action under AU-C 450(AU-C 450に基づく適切な対応)", type: "select", options: ["No action — aggregate is below overall materiality, so the misstatements may be ignored", "Request management to correct all accumulated misstatements; if not corrected, obtain the reasons, evaluate the aggregate (including qualitative factors and the risk of undetected misstatement), communicate to those charged with governance, and obtain a written representation", "Issue a qualified opinion because management refused to correct", "Correct only the factual misstatements; judgmental and projected misstatements are never communicated"], answer: "Request management to correct all accumulated misstatements; if not corrected, obtain the reasons, evaluate the aggregate (including qualitative factors and the risk of undetected misstatement), communicate to those charged with governance, and obtain a written representation" },
  ],
  explain: `<p><b>#3010</b>:期末の買掛金リストに記載済み → 計上済みで追加不要。</p>
<p><b>#3014</b>:12月28日に受入済みで期末に債務が存在する → 全額$27,000が未計上負債。棚卸にも含まれていないため棚卸資産と買掛金が同額過小で、損益への影響はない。</p>
<p><b>#3021</b>:12月中の役務提供に対する報酬 → 全額$9,600が未計上(費用も過小)。</p>
<p><b>#3025</b>:仕向地渡しで1月10日到着 → 期末に債務なし。</p>
<p><b>#3030</b>:12月分のみが当期の負債:12,000 × 1/2 = $6,000(一部未計上)。</p>
<p><b>#3033</b>:翌期の役務 → 期末の負債ではない。</p>
<p>未計上負債合計 = 27,000 + 9,600 + 6,000 = <b>$42,600</b>。</p>
<p>税引前利益への影響:費用の計上漏れ 9,600 + 6,000 = 15,600(#3014は損益影響なし)。これに保証引当金不足20,000と棚卸資産の推定過大18,000を加え、15,600 + 20,000 + 18,000 = <b>$53,600</b> の利益過大。</p>
<p>AU-C 450では、明らかに僅少なもの以外の集計した虚偽表示をすべて適時に経営者へ伝達し修正を求める。修正されない場合は理由を把握し、未修正虚偽表示が個別・合計で重要か(質的要因、未発見の虚偽表示を加えると重要性を超えるリスク)を評価する。$53,600は重要性$75,000を下回るが余裕は小さい。統治責任者への伝達と、未修正虚偽表示の影響が重要でない旨の経営者確認書(一覧の添付)が必要である。重要性未満なので直ちに限定意見となるわけではない。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-55", section: "AUD", chapter: "AUD-04", title: "実証的分析的手続:賃貸収入の期待値・許容差異・差異調査",
  scenario: `<p>The auditor of <b>Brightwater Residential LLC</b>, which owns a single <b>240-unit</b> apartment complex, plans to use a substantive analytical procedure as the primary test of rental revenue for Year 2. The auditor has tested controls over the property-management system that tracks occupancy and lease rates and found them effective.</p>
<p><b>Exhibit — Data</b></p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Monthly rent per unit, January–June</td><td>$1,500</td></tr>
<tr><td>Monthly rent per unit, July–December (4% increase effective July 1)</td><td>$1,560</td></tr>
<tr><td>Average occupancy for the year (per tested system reports)</td><td>95%</td></tr>
<tr><td>Rental revenue recorded in the general ledger</td><td>$4,262,000</td></tr>
<tr><td>Threshold for differences not requiring further investigation</td><td>$40,000</td></tr></table>
<p>When asked about the difference, the property manager explained that <b>late fees and parking income of $52,000</b> are recorded in the rental revenue account. The auditor agreed this amount to the fee and parking sub-ledgers and tested a sample of the underlying charges without exception.</p>
<p class="ja">Brightwater Residential LLCは240戸のアパート1棟を所有している。監査人は第2年度の賃貸収入の主たるテストとして実証的分析的手続を用いる予定である。入居率と賃料を管理するシステムの内部統制は有効と判断済みである。1〜6月の1戸当たり月額賃料$1,500、7月1日から4%値上げで7〜12月は$1,560、年間平均入居率95%、総勘定元帳の賃貸収入$4,262,000、追加調査不要とする差異の閾値は$40,000。差異について管理者は延滞料と駐車場収入$52,000が賃貸収入勘定に含まれていると説明し、監査人は補助元帳と照合し、その明細をサンプルテストして例外はなかった。</p>`,
  rows: [
    { label: "Auditor's expectation of rental revenue ($)(賃貸収入の期待値)", type: "num", answer: 4186080 },
    { label: "Difference between recorded and expected revenue ($)(計上額と期待値の差異)", type: "num", answer: 75920 },
    { label: "Required response to the difference(差異に対して必要な対応)", type: "select", options: ["None — differences of this size are expected in revenue", "Inquire of management and obtain corroborating audit evidence for the difference; if it cannot be explained, consider it a possible misstatement", "Accept management's oral explanation without further evidence", "Abandon the analytical procedure and confirm every tenant balance"], answer: "Inquire of management and obtain corroborating audit evidence for the difference; if it cannot be explained, consider it a possible misstatement" },
    { label: "Unexplained difference after the corroborated explanation ($)(裏付けられた説明後の未解明差異)", type: "num", answer: 23920 },
    { label: "Conclusion on the remaining difference(残る差異についての結論)", type: "select", options: ["Below the threshold — no further investigation of the remaining difference is required", "Must be recorded as a known misstatement", "Requires a qualified opinion", "Exceeds tolerable misstatement — expand to tests of details"], answer: "Below the threshold — no further investigation of the remaining difference is required" },
    { label: "Type of analytical procedure used(用いた分析的手続の種類)", type: "select", options: ["Trend analysis", "Ratio analysis", "Reasonableness test", "Regression analysis"], answer: "Reasonableness test" },
    { label: "Change that would most improve the precision of the expectation(期待値の精度を最も高める変更)", type: "select", options: ["Comparing total revenue with the prior year", "Disaggregating the expectation by month and unit type using tested occupancy data", "Raising the threshold to $80,000", "Using the client's budget as the expectation"], answer: "Disaggregating the expectation by month and unit type using tested occupancy data" },
  ],
  explain: `<p>期待値 = 240戸 × 95% × (1,500 × 6 + 1,560 × 6) = 228 × (9,000 + 9,360) = 228 × 18,360 = <b>$4,186,080</b>。</p>
<p>差異 = 4,262,000 − 4,186,080 = <b>$75,920</b>(閾値$40,000を超える)。</p>
<p>AU-C 520では、閾値を超える差異について経営者に質問し、その回答を裏付ける適切な監査証拠を入手する。口頭説明だけでは不十分であり、説明できない差異は虚偽表示の可能性として扱う。</p>
<p>延滞料・駐車場収入$52,000は補助元帳と照合し明細テストで裏付けられたので差異から除く:75,920 − 52,000 = <b>$23,920</b>。これは閾値$40,000未満なので、残りについて追加調査は不要である(ただし勘定の内容としては賃料以外の収入が含まれる点を表示の観点で検討してもよい)。</p>
<p>戸数・入居率・賃料という財務・非財務データから独立に金額を見積もる手法は<b>合理性テスト(reasonableness test)</b>である。月別・タイプ別に分解し、テスト済みのデータを用いるほど期待値の精度は高まる。前年比較や予算は精度が低く、閾値を上げることは精度向上ではない。</p>`,
});
