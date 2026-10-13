// FAR のTBS追加(政府・非営利会計/法人税等・キャッシュフロー計算書)

CPA.tbs({
  id: "TBS-FAR-77", section: "FAR", chapter: "FAR-06", title: "一般基金の予算勘定と支出負担行為(エンカンブランス)の仕訳",
  scenario: `<p>The City of Ashford adopted the following General Fund budget for the fiscal year ended June 30, 2027:</p>
<table><tr><th>Budget item</th><th>Amount</th></tr>
<tr><td>Estimated revenues</td><td>$5,000,000</td></tr>
<tr><td>Estimated other financing sources (transfers in)</td><td>$200,000</td></tr>
<tr><td>Appropriations</td><td>$4,800,000</td></tr>
<tr><td>Estimated other financing uses (transfers out)</td><td>$300,000</td></tr></table>
<p><b>Exhibit — Purchasing log</b></p>
<table><tr><th>Date</th><th>Event</th><th>Amount</th></tr>
<tr><td>Sept 10</td><td>Purchase order issued for office supplies</td><td>$85,000</td></tr>
<tr><td>Oct 2</td><td>Supplies received; vendor invoice approved</td><td>$83,500</td></tr>
<tr><td>May 20</td><td>Purchase order issued for maintenance equipment (not received by June 30)</td><td>$40,000</td></tr></table>
<p>Other actual results for the year: salaries (not encumbered) $2,900,000; other expenditures (encumbered and received at the same amounts) $1,650,000; actual revenues $5,060,000; actual transfers in $200,000; actual transfers out $300,000. The City's policy is that outstanding encumbrances at year-end are honored in the following year.</p>
<p class="ja">Ashford市は2027年6月30日終了年度の一般基金予算を採択した(見積収益5,000,000ドル、見積その他財源(繰入)200,000ドル、歳出予算4,800,000ドル、見積その他財源使用(繰出)300,000ドル)。購買記録:9月10日に事務用品の発注85,000ドル、10月2日に事務用品を受領し請求書83,500ドルを承認、5月20日に保守用設備を発注40,000ドル(6月30日時点で未受領)。その他の実績:給与(支出負担行為なし)2,900,000ドル、その他支出(発注額と同額で受領済み)1,650,000ドル、実際収益5,060,000ドル、実際繰入200,000ドル、実際繰出300,000ドル。期末の未履行の支出負担行為は翌年度に履行する方針である。</p>`,
  rows: [
    { label: "Budgetary fund balance recorded when the budget is adopted(予算採択時の予算上の基金残高の金額)", type: "num", answer: 100000 },
    { label: "Budgetary fund balance — debit or credit?(予算上の基金残高は借方か貸方か)", type: "select", options: ["Debit", "Credit", "No entry is recorded"], answer: "Credit" },
    { label: "Oct 2 — amount of encumbrance reversed(10月2日に取り消す支出負担行為の金額)", type: "num", answer: 85000 },
    { label: "Total General Fund expenditures for the year(当年度の一般基金支出合計)", type: "num", answer: 4633500 },
    { label: "Unencumbered (available) appropriations at June 30, 2027(6月30日時点の未使用歳出予算残高)", type: "num", answer: 126500 },
    { label: "Net change in General Fund fund balance(一般基金の基金残高の純増減)", type: "num", answer: 326500 },
    { label: "Reporting of the $40,000 outstanding encumbrance in the June 30 balance sheet(未履行支出負担行為40,000ドルの貸借対照表上の扱い)", type: "select", options: ["Reported as a liability (vouchers payable)", "Reported as an expenditure of the current year", "Included within restricted, committed, or assigned fund balance as appropriate (no separate reserve classification)", "Reported as a deferred outflow of resources"], answer: "Included within restricted, committed, or assigned fund balance as appropriate (no separate reserve classification)" },
  ],
  explain: `<p><b>予算仕訳:</b>借方 見積収益 5,000,000+見積その他財源 200,000 = 5,200,000、貸方 歳出予算 4,800,000+見積その他財源使用 300,000 = 5,100,000。差額 100,000 を予算上の基金残高(Budgetary fund balance)として<b>貸方</b>に計上する(収入見込が支出見込を上回るため)。</p>
<p><b>10月2日:</b>まず発注時に計上した支出負担行為 85,000 を全額取り消し(借方 Encumbrance reserve / 貸方 Encumbrances)、実際の請求額 83,500 を支出として計上する。取り消すのは請求額ではなく当初の発注額である。</p>
<p><b>支出合計:</b>83,500 + 2,900,000 + 1,650,000 = 4,633,500。未受領設備の40,000は支出ではない。</p>
<p><b>未使用歳出予算:</b>4,800,000 − 支出 4,633,500 − 未履行支出負担行為 40,000 = 126,500。</p>
<p><b>基金残高の純増減:</b>収益 5,060,000 + 繰入 200,000 − 支出 4,633,500 − 繰出 300,000 = 326,500。予算勘定は期末に逆仕訳で締め切られ、財務諸表上の基金残高には影響しない。</p>
<p><b>期末の支出負担行為:</b>GASB 54 により「Reserved for encumbrances」という区分はなく、拘束の性質に応じて restricted・committed・assigned の中に含め、注記で開示する。負債や当期支出にはならない。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-78", section: "FAR", chapter: "FAR-06", title: "固定資産税の60日ルールと繰延インフロー・純資産変動への調整",
  scenario: `<p>Brenton County's fiscal year ends December 31, 2026. On January 1, 2026, the County levied 2026 property taxes of <b>$8,000,000</b> for use in fiscal 2026 and estimated that <b>2%</b> would be uncollectible.</p>
<table><tr><th>Collections of the 2026 levy</th><th>Amount</th></tr>
<tr><td>During calendar 2026</td><td>$7,400,000</td></tr>
<tr><td>January 1 – February 28, 2027</td><td>$250,000</td></tr>
<tr><td>Expected after February 28, 2027</td><td>remainder of the collectible amount</td></tr></table>
<p><b>Exhibit — Data for the reconciliation of governmental funds to the government-wide statement of activities (all governmental funds, 2026)</b></p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Net change in fund balances — total governmental funds</td><td>$1,200,000</td></tr>
<tr><td>Capital outlay expenditures (all capitalizable)</td><td>$2,500,000</td></tr>
<tr><td>Depreciation expense on governmental capital assets</td><td>$900,000</td></tr>
<tr><td>Proceeds of general obligation bonds issued at par</td><td>$3,000,000</td></tr>
<tr><td>Principal repayments on long-term debt</td><td>$600,000</td></tr>
<tr><td>Deferred inflows — unavailable property tax revenue: beginning / ending</td><td>$150,000 / $190,000</td></tr>
<tr><td>Increase in accrued interest payable on long-term debt</td><td>$30,000</td></tr>
<tr><td>Increase in long-term compensated absences liability</td><td>$50,000</td></tr></table>
<p class="ja">Brenton郡の会計年度は2026年12月31日に終了する。2026年1月1日に2026年度用の固定資産税8,000,000ドルを賦課し、2%を回収不能と見積もった。2026年度賦課分の回収:2026年中7,400,000ドル、2027年1月1日〜2月28日250,000ドル、2月28日後に残りの回収可能額を回収見込み。政府全体の活動計算書への調整資料(全政府基金・2026年):基金残高純増減1,200,000ドル、資本的支出2,500,000ドル(全額資産計上対象)、減価償却費900,000ドル、額面発行の一般財源債の発行収入3,000,000ドル、長期債務元本返済600,000ドル、固定資産税の未利用収益(繰延インフロー)期首150,000ドル・期末190,000ドル、長期債務の未払利息増加30,000ドル、長期有給休暇負債の増加50,000ドル。</p>`,
  rows: [
    { label: "2026 levy — property tax revenue in the General Fund (fund statements)(2026年賦課分の一般基金の固定資産税収益)", type: "num", answer: 7650000 },
    { label: "Deferred inflows of resources for the 2026 levy at Dec 31, 2026 (fund statements)(基金財務諸表上の2026年賦課分の繰延インフロー)", type: "num", answer: 190000 },
    { label: "2026 levy — property tax revenue in the government-wide statement of activities(政府全体の活動計算書上の2026年賦課分の固定資産税収益)", type: "num", answer: 7840000 },
    { label: "Basis for recognizing the $250,000 collected in January–February 2027 as 2026 fund revenue(2027年1〜2月回収分を2026年の基金収益とする根拠)", type: "select", options: ["Full accrual — the levy is an enforceable legal claim", "Modified accrual — measurable and available (collected within 60 days after year-end)", "Cash basis — collected before the financial statements were issued", "Budgetary basis — included in estimated revenues"], answer: "Modified accrual — measurable and available (collected within 60 days after year-end)" },
    { label: "Fund balance sheet classification of the uncollected amount expected after Feb 28, 2027(2月28日後回収見込額の基金貸借対照表上の相手勘定)", type: "select", options: ["Liability — unearned revenue", "Deferred inflows of resources — unavailable revenue", "Deferred outflows of resources", "Unassigned fund balance"], answer: "Deferred inflows of resources — unavailable revenue" },
    { label: "Change in net position of governmental activities(政府活動の純財政状態の変動額)", type: "num", answer: 360000 },
    { label: "Adjustment in the reconciliation for bond proceeds(調整表における債券発行収入の扱い)", type: "select", options: ["Added — bond proceeds are revenue in the statement of activities", "Deducted — proceeds increase long-term liabilities, not revenue", "No adjustment — treated the same in both statements", "Added — bonds were issued at par"], answer: "Deducted — proceeds increase long-term liabilities, not revenue" },
  ],
  explain: `<p><b>回収可能額:</b>8,000,000 × (1 − 2%) = 7,840,000。期末の正味未収額 = 7,840,000 − 7,400,000 = 440,000。</p>
<p><b>基金収益(修正発生主義):</b>測定可能かつ利用可能(期末後60日以内に回収)な部分のみ。7,400,000 + 250,000 = 7,650,000。</p>
<p><b>繰延インフロー:</b>440,000 − 250,000 = 190,000。賦課により強制可能な請求権は生じているが「利用可能」でないため、負債ではなく deferred inflows of resources(unavailable revenue)とする。</p>
<p><b>政府全体(発生主義):</b>賦課の対象期間である2026年に回収可能額全額 7,840,000 を収益認識する(回収不能見込は収益から控除)。</p>
<p><b>純財政状態の変動:</b>1,200,000 + 資本的支出 2,500,000 − 減価償却 900,000 − 債券発行収入 3,000,000 + 元本返済 600,000 + 繰延インフロー増加 40,000(190,000 − 150,000)− 未払利息増 30,000 − 有給休暇負債増 50,000 = 360,000。</p>
<p>債券発行収入は基金ではその他財源だが、政府全体では長期負債の増加であり収益ではないため差し引く。元本返済は逆に基金の支出を取り消すため加算する。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-79", section: "FAR", chapter: "FAR-06", title: "資本プロジェクト基金・債務償還基金の仕訳と基金種類の選択",
  scenario: `<p>On July 1, 2026, the Town of Millbrook issued <b>$10,000,000</b> of 4% general obligation serial bonds at <b>102</b> to finance a new library. Fiscal year ends June 30, 2027.</p>
<p><b>Exhibit A — Library Capital Projects Fund activity</b></p>
<table><tr><th>Event</th><th>Amount</th></tr>
<tr><td>Bond issuance costs paid from proceeds</td><td>$150,000</td></tr>
<tr><td>Bond premium transferred to the Debt Service Fund (as required by bond covenant)</td><td>$200,000</td></tr>
<tr><td>Construction contract signed</td><td>$9,600,000</td></tr>
<tr><td>Contractor progress billings received (5% retainage withheld)</td><td>$6,000,000</td></tr></table>
<p><b>Exhibit B — Debt Service Fund activity</b></p>
<table><tr><th>Event</th><th>Amount</th></tr>
<tr><td>Transfer in from the General Fund</td><td>$1,250,000</td></tr>
<tr><td>Interest paid (Dec 31 and June 30)</td><td>$400,000</td></tr>
<tr><td>First principal installment paid June 30, 2027</td><td>$1,000,000</td></tr></table>
<p>Neither fund had a beginning balance. The Town also asks which fund type should report each of the activities listed in rows 6–8.</p>
<p class="ja">Millbrook町は2026年7月1日に新図書館建設のため、利率4%の一般財源連続償還債10,000,000ドルを102で発行した。会計年度末は2027年6月30日。資本プロジェクト基金:発行費用150,000ドルを発行収入から支払、債券プレミアム200,000ドルを債券契約に従い債務償還基金へ振替、建設契約9,600,000ドルを締結、出来高請求6,000,000ドルを受領(5%を留保)。債務償還基金:一般基金からの繰入1,250,000ドル、利息支払400,000ドル(12月31日・6月30日)、2027年6月30日に第1回元本1,000,000ドルを返済。両基金とも期首残高はない。行6〜8の活動をどの基金種類で報告するかも問われている。</p>`,
  rows: [
    { label: "Capital Projects Fund — total other financing sources recognized at issuance(資本プロジェクト基金:発行時のその他財源合計)", type: "num", answer: 10200000 },
    { label: "Capital Projects Fund — fund balance at June 30, 2027(資本プロジェクト基金の期末基金残高)", type: "num", answer: 3850000 },
    { label: "Debt Service Fund — total expenditures for the year(債務償還基金の当期支出合計)", type: "num", answer: 1400000 },
    { label: "Debt Service Fund — fund balance at June 30, 2027(債務償還基金の期末基金残高)", type: "num", answer: 50000 },
    { label: "Government-wide treatment of the $150,000 bond issuance costs(政府全体財務諸表での債券発行費用の扱い)", type: "select", options: ["Deferred outflow of resources amortized over the bond term", "Reduction of bonds payable amortized by the effective interest method", "Expense (outflow) in the period incurred", "Capitalized as part of the library cost"], answer: "Expense (outflow) in the period incurred" },
    { label: "Green-fee and cart-rental activity of a Town golf course financed by user charges(利用料で賄う町営ゴルフ場の運営)", type: "select", options: ["General Fund", "Special revenue fund", "Enterprise fund", "Internal service fund", "Custodial fund"], answer: "Enterprise fund" },
    { label: "Central vehicle-maintenance garage billing other Town departments at cost(他部局に原価で請求する車両整備部門)", type: "select", options: ["General Fund", "Special revenue fund", "Enterprise fund", "Internal service fund", "Custodial fund"], answer: "Internal service fund" },
    { label: "Sales taxes collected by the Town on behalf of the county, not held in a trust(郡のために徴収し信託によらず保有する売上税)", type: "select", options: ["General Fund", "Special revenue fund", "Enterprise fund", "Internal service fund", "Custodial fund"], answer: "Custodial fund" },
  ],
  explain: `<p><b>行1:</b>額面10,000,000をその他財源(債券発行収入)、プレミアム200,000もその他財源として計上する。合計 10,200,000。</p>
<p><b>行2:</b>10,200,000 − 発行費用(支出)150,000 − 繰出 200,000 − 建設支出 6,000,000 = 3,850,000。留保額300,000は支払っていないが支出は請求額全額で計上し、相手勘定は留保未払金(retainage payable)である。未履行の契約残高3,600,000は支出負担行為にすぎず支出ではない。</p>
<p><b>行3:</b>債務償還基金では元本・利息は支払期日に支出計上する。1,000,000 + 400,000(10,000,000 × 4%)= 1,400,000。</p>
<p><b>行4:</b>繰入 200,000 + 1,250,000 − 1,400,000 = 50,000。</p>
<p><b>行5:</b>GASB 65 により、保険料前払分を除く債券発行費用は発生時の費用(アウトフロー)とする。</p>
<p><b>行6〜8:</b>外部利用者への有料サービスはエンタープライズ基金、政府内部への原価ベースのサービスは内部サービス基金、信託によらず他の政府のために保有する資源は受託(custodial)基金で報告する。</p>`,
});
