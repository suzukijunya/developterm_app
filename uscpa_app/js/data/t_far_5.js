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

CPA.tbs({
  id: "TBS-FAR-80", section: "FAR", chapter: "FAR-06", title: "非営利組織の活動計算書(純資産区分と制約解除)",
  scenario: `<p>Harbor Arts Center, a private not-for-profit museum, prepares its statement of activities for the year ended June 30, 2027. Selected information:</p>
<table><tr><th>#</th><th>Transaction</th><th>Amount</th></tr>
<tr><td>1</td><td>Contributions with no donor restrictions</td><td>$900,000</td></tr>
<tr><td>2</td><td>Admission and program service fees</td><td>$600,000</td></tr>
<tr><td>3</td><td>Gift restricted by donor to the education program; $250,000 spent on that program this year</td><td>$400,000</td></tr>
<tr><td>4</td><td>Gift restricted to acquire a building; building purchased for $800,000 and placed in service in March (no donor stipulation on how long it must be used; Center has no policy implying a time restriction)</td><td>$1,000,000</td></tr>
<tr><td>5</td><td>Cash gift to establish a perpetual endowment</td><td>$2,000,000</td></tr>
<tr><td>6</td><td>Endowment investment return (donor requires return to be used for scholarships); $70,000 appropriated and spent on scholarships this year</td><td>$120,000</td></tr>
<tr><td>7</td><td>Unconditional promise received in June 2027, payable in fiscal 2028 (present value)</td><td>$285,000</td></tr>
<tr><td>8</td><td>Expenses: program services $1,300,000; management and general $300,000; fundraising $150,000</td><td>$1,750,000</td></tr></table>
<p class="ja">私立の非営利美術館Harbor Arts Centerの2027年6月30日終了年度の活動計算書を作成する。①使途制約のない寄付900,000ドル、②入館料・事業収入600,000ドル、③教育事業に使途を限定された寄付400,000ドル(当期に同事業へ250,000ドル支出)、④建物取得に限定された寄付1,000,000ドル(3月に800,000ドルで建物を購入し供用開始、寄付者による使用期間の指定はなく、時間制約を推定する方針もない)、⑤永久基本財産を設定する現金寄付2,000,000ドル、⑥基本財産の運用収益120,000ドル(奨学金に使用するよう寄付者が指定、当期に70,000ドルを予算化し奨学金に支出)、⑦2027年6月に受領した2028年度支払の無条件の寄付約束(現在価値)285,000ドル、⑧費用:事業費1,300,000ドル、管理費300,000ドル、資金調達費150,000ドル。</p>`,
  rows: [
    { label: "Net assets released from restrictions(制約から解除された純資産の合計)", type: "num", answer: 1120000 },
    { label: "Change in net assets without donor restrictions(寄付者制約なし純資産の変動額)", type: "num", answer: 870000 },
    { label: "Contribution revenue with donor restrictions(寄付者制約付きの寄付収益)", type: "num", answer: 3685000 },
    { label: "Change in net assets with donor restrictions(寄付者制約付き純資産の変動額)", type: "num", answer: 2685000 },
    { label: "Classification of the $50,000 of endowment return not yet appropriated(未予算化の基本財産運用収益50,000ドルの区分)", type: "select", options: ["Net assets without donor restrictions, board-designated", "Net assets with donor restrictions until appropriated for expenditure", "Liability until spent", "Added to the perpetual endowment principal"], answer: "Net assets with donor restrictions until appropriated for expenditure" },
    { label: "Presentation of releases in the statement of activities(活動計算書における制約解除の表示)", type: "select", options: ["Revenue without donor restrictions and expense with donor restrictions", "Reclassification: increase net assets without donor restrictions and decrease net assets with donor restrictions", "Disclosed in the notes only", "Direct adjustment to beginning net assets"], answer: "Reclassification: increase net assets without donor restrictions and decrease net assets with donor restrictions" },
    { label: "Required analysis of expenses(費用の分析に関する要求事項)", type: "select", options: ["Natural classification only, in the notes", "Functional classification only, on the face of the statement", "Both nature and function, in one location (face, separate statement, or notes)", "Required only for voluntary health and welfare entities"], answer: "Both nature and function, in one location (face, separate statement, or notes)" },
  ],
  explain: `<p><b>制約解除:</b>教育事業への支出 250,000 + 建物の供用開始 800,000(期間の定めがなければ供用開始時に解除)+ 奨学金支出 70,000 = 1,120,000。</p>
<p><b>制約なし純資産:</b>寄付 900,000 + 事業収入 600,000 + 解除 1,120,000 − 費用 1,750,000 = 870,000。費用はすべて制約なし純資産で報告する。</p>
<p><b>制約付き寄付収益:</b>400,000 + 1,000,000 + 2,000,000 + 285,000(将来受領の約束は時間制約付き)= 3,685,000。</p>
<p><b>制約付き純資産の変動:</b>3,685,000 + 運用収益 120,000 − 解除 1,120,000 = 2,685,000。</p>
<p><b>行5:</b>寄付者が使途を指定した基本財産の運用収益は、UPMIFA に基づき予算化(appropriation)され支出されるまで制約付き純資産に留まる。120,000 − 70,000 = 50,000 が残る。</p>
<p><b>行6:</b>制約解除は収益・費用ではなく純資産区分間の振替(reclassification)として両区分に同額表示する。</p>
<p><b>行7:</b>ASU 2016-14 により、すべての NFP は費用を性質別・機能別の両面で一か所(本表・別表・注記のいずれか)にまとめて分析表示する。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-81", section: "FAR", chapter: "FAR-06", title: "非営利組織の寄付の認識判定グリッド(条件付・役務・収蔵品・代理)",
  scenario: `<p>Riverside Food Alliance, a private not-for-profit, received the following during 2026. The Alliance's policy is <b>not to capitalize</b> collection items; its collection meets all criteria for nonrecognition (held for public exhibition, protected and preserved, and proceeds from sales used to acquire other collection items or for direct care).</p>
<table><tr><th>Item</th><th>Description</th></tr>
<tr><td>A</td><td>Pledge of $50,000 payable only if the Alliance raises $50,000 of matching gifts from other donors by June 2027; donor may cancel if the match is not met. Matching gifts raised to date: $12,000.</td></tr>
<tr><td>B</td><td>A CPA firm performed the year-end accounting close at no charge; the Alliance would otherwise have purchased these services. Fair value $18,000.</td></tr>
<tr><td>C</td><td>Community volunteers sorted food and staffed a fundraising gala; estimated value $25,000.</td></tr>
<tr><td>D</td><td>Historical photograph collection donated and added to the Alliance's exhibit collection; fair value $35,000.</td></tr>
<tr><td>E</td><td>$40,000 received from a donor who specified that the Alliance must pass it to a named, unaffiliated shelter; the Alliance has no variance power.</td></tr>
<tr><td>F</td><td>Unconditional pledge of $100,000 payable evenly over 2027–2029; present value $92,000 (no other restriction).</td></tr>
<tr><td>G</td><td>Land with no donor restrictions; fair value $300,000.</td></tr></table>
<p class="ja">私立非営利組織Riverside Food Allianceは2026年に以下を受領した。同組織は収蔵品を資産計上しない方針で、その収蔵品は非認識の要件(公開展示目的、保護・保存、売却代金を他の収蔵品取得または直接的な維持管理に使用)をすべて満たす。A:2027年6月までに他の寄付者から50,000ドルのマッチング寄付を集めた場合にのみ支払われる50,000ドルの寄付約束(未達なら取消可、現在までの調達額12,000ドル)。B:会計事務所が期末決算業務を無償で提供(本来は購入する役務、公正価値18,000ドル)。C:地域ボランティアによる食品の仕分けと資金集めパーティの運営(見積価値25,000ドル)。D:展示用収蔵品として歴史的写真コレクションを受贈(公正価値35,000ドル)。E:寄付者が特定の無関係のシェルターへ渡すよう指定した40,000ドル(差替権なし)。F:2027〜2029年に均等支払の無条件寄付約束100,000ドル(現在価値92,000ドル、他の制約なし)。G:制約のない土地(公正価値300,000ドル)。</p>`,
  rows: [
    { label: "Item A(項目A)", type: "select", options: ["Contribution revenue without donor restrictions", "Contribution revenue with donor restrictions", "Not recognized as revenue", "Liability (agency transaction)"], answer: "Not recognized as revenue" },
    { label: "Item B(項目B)", type: "select", options: ["Contribution revenue without donor restrictions", "Contribution revenue with donor restrictions", "Not recognized as revenue", "Liability (agency transaction)"], answer: "Contribution revenue without donor restrictions" },
    { label: "Item C(項目C)", type: "select", options: ["Contribution revenue without donor restrictions", "Contribution revenue with donor restrictions", "Not recognized as revenue", "Liability (agency transaction)"], answer: "Not recognized as revenue" },
    { label: "Item D(項目D)", type: "select", options: ["Contribution revenue without donor restrictions", "Contribution revenue with donor restrictions", "Not recognized as revenue", "Liability (agency transaction)"], answer: "Not recognized as revenue" },
    { label: "Item E(項目E)", type: "select", options: ["Contribution revenue without donor restrictions", "Contribution revenue with donor restrictions", "Not recognized as revenue", "Liability (agency transaction)"], answer: "Liability (agency transaction)" },
    { label: "Item F(項目F)", type: "select", options: ["Contribution revenue without donor restrictions", "Contribution revenue with donor restrictions", "Not recognized as revenue", "Liability (agency transaction)"], answer: "Contribution revenue with donor restrictions" },
    { label: "Total contribution revenue recognized in 2026 (Items A–G)(2026年に認識する寄付収益の合計)", type: "num", answer: 410000 },
  ],
  explain: `<p><b>A:</b>マッチング達成という障壁(barrier)と未達時の取消権(right of release)があるため条件付寄付であり、条件が満たされるまで収益認識しない(12,000ドルの達成は部分的にすぎない)。</p>
<p><b>B:</b>専門的技能を要する役務で、寄付がなければ購入していたものは公正価値で寄付収益(制約なし)と同額の費用を計上する。18,000。</p>
<p><b>C:</b>専門的技能を要さないボランティア役務で、非金融資産を創造・増強するものでもないため認識しない。</p>
<p><b>D:</b>収蔵品の非認識要件を満たし資産計上しない方針のため、収益も資産も計上しない。</p>
<p><b>E:</b>特定の受益者への受け渡しを指示され差替権(variance power)がないため、仲介者・代理人として資産と負債を計上し、収益にはしない。</p>
<p><b>F:</b>将来期間に受け取る無条件の寄付約束は暗黙の時間制約があるため制約付き。現在価値 92,000 で計上する。</p>
<p><b>合計:</b>B 18,000 + F 92,000 + G 300,000 = 410,000。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-82", section: "FAR", chapter: "FAR-07", title: "複数の一時差異と税率スケジュールによる繰延税金・評価性引当額",
  scenario: `<p>Calloway Corp. is computing income taxes for the year ended December 31, 2026. Assume a single jurisdiction with the following <b>enacted</b> combined income tax rates: 2026 — 24%; 2027 — 25%; 2028 — 26%; 2029 and later — 28%. Taxable income for 2026 is <b>$900,000</b>.</p>
<p><b>Exhibit — Differences existing at December 31, 2026 and scheduled reversals</b></p>
<table><tr><th>Item</th><th>Total</th><th>2027</th><th>2028</th><th>2029</th></tr>
<tr><td>Equipment: book basis exceeds tax basis</td><td>$600,000</td><td>$200,000</td><td>$200,000</td><td>$200,000</td></tr>
<tr><td>Installment sale gain recognized for books in 2026, taxable when collected</td><td>$240,000</td><td>$120,000</td><td>$120,000</td><td>—</td></tr>
<tr><td>Warranty liability (deductible when paid)</td><td>$150,000</td><td>$150,000</td><td>—</td><td>—</td></tr>
<tr><td>Accrued litigation loss (deductible when paid)</td><td>$100,000</td><td>—</td><td>—</td><td>$100,000</td></tr>
<tr><td>Capital loss carryforward (usable only against capital gains)</td><td>$80,000</td><td>$80,000</td><td>—</td><td>—</td></tr></table>
<p><b>Memo from the tax director:</b> "We have no capital gains planned and no feasible tax-planning strategies; it is more likely than not that <b>none</b> of the capital loss carryforward will be realized. All other deferred tax assets are expected to be realized."</p>
<p>At December 31, 2025, Calloway reported a deferred tax liability of $150,000 and a deferred tax asset (net of valuation allowance) of $40,000.</p>
<p class="ja">Calloway社は2026年12月31日終了年度の法人税等を計算している。単一の課税地域とし、制定済みの合算税率は2026年24%、2027年25%、2028年26%、2029年以降28%とする。2026年の課税所得は900,000ドル。2026年末の差異と解消予定:設備の簿価が税務基準額を600,000ドル上回る(2027〜2029年に各200,000ドル)、2026年に会計上認識した割賦販売益240,000ドル(回収時に課税、2027・2028年に各120,000ドル)、製品保証負債150,000ドル(2027年に支払・損金算入)、未払訴訟損失100,000ドル(2029年に支払・損金算入)、キャピタル・ロス繰越80,000ドル(キャピタル・ゲインとのみ相殺可、2027年に利用予定)。税務部長のメモ:キャピタル・ゲインの予定も実行可能なタックス・プランニングもなく、キャピタル・ロス繰越は全額実現しない可能性の方が高い。その他の繰延税金資産は実現見込み。2025年末の繰延税金負債は150,000ドル、繰延税金資産(評価性引当額控除後)は40,000ドル。</p>`,
  rows: [
    { label: "Deferred tax liability at Dec 31, 2026(2026年末の繰延税金負債)", type: "num", answer: 219200 },
    { label: "Gross deferred tax asset before valuation allowance(評価性引当額控除前の繰延税金資産)", type: "num", answer: 85500 },
    { label: "Valuation allowance at Dec 31, 2026(評価性引当額)", type: "num", answer: 20000 },
    { label: "Deferred income tax expense for 2026(2026年の繰延税金費用)", type: "num", answer: 43700 },
    { label: "Total income tax expense for 2026(2026年の法人税等合計)", type: "num", answer: 259700 },
    { label: "Balance sheet presentation at Dec 31, 2026(2026年末の貸借対照表表示)", type: "select", options: ["Current DTA $65,500 and noncurrent DTL $219,200", "Net noncurrent deferred tax liability $153,700", "Net noncurrent deferred tax liability $133,700", "Net current deferred tax liability $153,700"], answer: "Net noncurrent deferred tax liability $153,700" },
    { label: "Rate used to measure each temporary difference(各一時差異の測定に用いる税率)", type: "select", options: ["Current-year rate of 24% for all differences", "Enacted rates for the years the differences are expected to reverse", "Rates expected to be enacted in future legislation", "Average of the enacted rates for 2027–2029"], answer: "Enacted rates for the years the differences are expected to reverse" },
  ],
  explain: `<p><b>繰延税金負債(将来加算一時差異):</b>2027年 (200,000 + 120,000) × 25% = 80,000、2028年 (200,000 + 120,000) × 26% = 83,200、2029年 200,000 × 28% = 56,000。合計 219,200。</p>
<p><b>繰延税金資産:</b>保証 150,000 × 25% = 37,500、訴訟 100,000 × 28% = 28,000、キャピタル・ロス 80,000 × 25% = 20,000。合計 85,500。</p>
<p><b>評価性引当額:</b>キャピタル・ロス分は全額実現しない可能性が高い(more likely than not)ため 20,000。正味 DTA = 65,500。</p>
<p><b>繰延税金費用:</b>DTL 増加 (219,200 − 150,000) 69,200 − 正味 DTA 増加 (65,500 − 40,000) 25,500 = 43,700。</p>
<p><b>法人税等合計:</b>当期税金 900,000 × 24% = 216,000 + 43,700 = 259,700。</p>
<p><b>表示:</b>ASU 2015-17 により繰延税金はすべて非流動に分類し、同一課税地域内では相殺する。219,200 − 65,500 = 153,700 の非流動 DTL。測定には差異が解消する年度の制定済み税率を用いる。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-83", section: "FAR", chapter: "FAR-07", title: "永久差異と実効税率の調整表",
  scenario: `<p>Dunmore Inc., a public business entity, reports pretax financial income of <b>$2,000,000</b> for 2026. The federal statutory rate is <b>21%</b>; ignore state taxes. The controller's worksheet lists the following items included in pretax income:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Interest income on municipal bonds</td><td>$80,000</td></tr>
<tr><td>Premiums on officers' life insurance (company is beneficiary)</td><td>$30,000</td></tr>
<tr><td>Fines paid to a government agency for a regulatory violation</td><td>$20,000</td></tr>
<tr><td>Business meals expense (50% deductible)</td><td>$60,000</td></tr>
<tr><td>Dividends from a 20%-owned domestic corporation (65% dividends-received deduction; investment accounted for at fair value)</td><td>$100,000</td></tr>
<tr><td>Tax depreciation in excess of book depreciation</td><td>$150,000</td></tr></table>
<p>No deferred tax balances existed other than for depreciation; the enacted rate for all future years is 21%.</p>
<p class="ja">公開営利企業であるDunmore社の2026年の税引前会計利益は2,000,000ドル。連邦法定税率は21%で州税は無視する。税引前利益には以下が含まれる:地方債の受取利息80,000ドル、役員生命保険料(会社が受取人)30,000ドル、規制違反による政府機関への罰金20,000ドル、ビジネス上の飲食費60,000ドル(50%損金算入)、20%保有の国内法人からの配当100,000ドル(受取配当控除65%、投資は公正価値で会計処理)、税務上の減価償却費が会計上を上回る額150,000ドル。減価償却以外の繰延税金残高はなく、将来の制定税率はすべて21%である。</p>`,
  rows: [
    { label: "Taxable income for 2026(2026年の課税所得)", type: "num", answer: 1785000 },
    { label: "Current income tax expense(当期税金費用)", type: "num", answer: 374850 },
    { label: "Total income tax expense(法人税等合計)", type: "num", answer: 406350 },
    { label: "Effective tax rate, % (two decimals)(実効税率 %、小数第2位まで)", type: "num", answer: 20.32, tol: 0.01 },
    { label: "Rate reconciliation — reduction for the dividends-received deduction ($)(調整表:受取配当控除による減少額)", type: "num", answer: 13650 },
    { label: "Effect of the excess tax depreciation on the effective tax rate(減価償却差異が実効税率に与える影響)", type: "select", options: ["Decreases it — taxable income is lower", "Increases it — deferred tax expense is recorded", "No effect — temporary difference offset by deferred tax expense", "Reported as a reconciling item at 21%"], answer: "No effect — temporary difference offset by deferred tax expense" },
    { label: "ASU 2023-09 rate reconciliation requirement for Dunmore(ASU 2023-09による調整表の開示要求)", type: "select", options: ["Qualitative description of significant reconciling items only", "Percentages only, for items exceeding 5% of pretax income", "Both percentages and amounts in specified categories, with separate disclosure of items meeting a 5% of statutory tax threshold", "No rate reconciliation is required for public business entities"], answer: "Both percentages and amounts in specified categories, with separate disclosure of items meeting a 5% of statutory tax threshold" },
  ],
  explain: `<p><b>永久差異:</b>地方債利息 −80,000、生命保険料 +30,000、罰金 +20,000、飲食費の損金不算入 +30,000(60,000 × 50%)、受取配当控除 −65,000(100,000 × 65%)。純額 −65,000。</p>
<p><b>課税所得:</b>2,000,000 − 65,000 − 減価償却差異 150,000 = 1,785,000。当期税金 1,785,000 × 21% = 374,850。</p>
<p><b>繰延税金費用:</b>150,000 × 21% = 31,500。合計 374,850 + 31,500 = 406,350(=(2,000,000 − 65,000)× 21%)。</p>
<p><b>実効税率:</b>406,350 ÷ 2,000,000 = 20.3175% ≒ 20.32%。</p>
<p><b>調整表:</b>法定税額 420,000 − 地方債 16,800 + 損金不算入項目 (30,000 + 20,000 + 30,000) × 21% = 16,800 − 受取配当控除 65,000 × 21% = 13,650 = 406,350。</p>
<p>一時差異は当期税金の減少と同額の繰延税金費用で相殺されるため実効税率に影響しない。ASU 2023-09 では、公開営利企業は特定カテゴリーごとに率と金額の両方を表形式で開示し、法定税額の5%以上の項目を区分開示する。</p>`,
});
