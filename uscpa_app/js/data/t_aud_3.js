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
