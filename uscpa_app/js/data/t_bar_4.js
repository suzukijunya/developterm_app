// BAR のTBS追加(州・地方政府:政府全体への転換・純ポジション・基金残高・主要基金・リース・SBITA・年金・埋立地)

CPA.tbs({
  id: "TBS-BAR-60", section: "BAR", chapter: "BAR-03", title: "転換ワークシート:基金残高から政府活動の純ポジションへ(社債プレミアム・内部サービス基金)",
  scenario: `<p>Harbor City is preparing the conversion worksheet that converts its governmental funds balance sheet (modified accrual) to the governmental activities column of the government-wide statement of net position (accrual) at <b>December 31, Year 5</b>. Assume GASB Statement No. 103 is effective; it does not change the conversion items below.</p>
<table><tr><th>Exhibit 1 — Data</th><th>Amount</th></tr>
<tr><td>Total fund balances — all governmental funds</td><td>$3,450,000</td></tr>
<tr><td>Capital assets used in governmental activities, at cost</td><td>$18,600,000</td></tr>
<tr><td>Accumulated depreciation on those capital assets</td><td>$7,200,000</td></tr>
<tr><td>General obligation bonds payable (face)</td><td>$6,000,000</td></tr>
<tr><td>Unamortized premium on the general obligation bonds</td><td>$150,000</td></tr>
<tr><td>Accrued interest on the bonds (next payment due March 1, Year 6)</td><td>$75,000</td></tr>
<tr><td>Property taxes receivable reported as deferred inflows of resources — unavailable revenue (General Fund)</td><td>$210,000</td></tr>
<tr><td>Compensated absences liability (none due and payable at year-end)</td><td>$320,000</td></tr>
<tr><td>Net position of the Fleet Internal Service Fund (serves only governmental departments)</td><td>$480,000</td></tr></table>
<p><b>Exhibit 2 — Draft memo from staff accountant:</b> “Because the accrued bond interest is a legal obligation at year-end, it should already be in the General Fund balance sheet, so no worksheet entry is needed.”</p>
<p class="ja">Harbor市は5年目12月31日現在で、政府資金の貸借対照表(修正発生主義)を政府全体の純ポジション計算書の政府活動欄(発生主義)へ転換するワークシートを作成している。GASB 103号は適用済みとし、以下の転換項目には影響しないものとする。<br>
政府資金全体の基金残高合計$3,450,000、政府活動で使用する資本資産の取得原価$18,600,000、減価償却累計額$7,200,000、一般財源債(額面)$6,000,000、未償却プレミアム$150,000、社債の未払利息$75,000(次回支払は6年目3月1日)、一般基金で「利用不能収益」として繰延資源流入に計上した固定資産税債権$210,000、有給休暇負債$320,000(期末に支払期日到来分なし)、政府部門のみにサービスを提供するFleet内部サービス基金の純ポジション$480,000。<br>
資料2(担当者のメモ):「社債の未払利息は期末時点の法的債務なので一般基金の貸借対照表に既に計上されているはずであり、ワークシート修正は不要である。」</p>`,
  rows: [
    { label: "Worksheet adjustment for capital assets, net(資本資産(純額)の加算額)", type: "num", answer: 11400000 },
    { label: "Total long-term liabilities added for bonds, premium and compensated absences(社債・プレミアム・有給休暇負債として加える長期負債合計)", type: "num", answer: 6470000 },
    { label: "Evaluate the memo on accrued interest(未払利息に関するメモの評価)", type: "select", options: ["Correct — accrued interest is already reported in the General Fund", "Incorrect — interest not yet due is not a fund liability; deduct $75,000 on the worksheet", "Incorrect — accrued interest is reported only in the Debt Service Fund as a deferred outflow", "Correct — interest is never accrued in government-wide statements"], answer: "Incorrect — interest not yet due is not a fund liability; deduct $75,000 on the worksheet" },
    { label: "Effect of the unavailable property tax revenue on net position(利用不能収益の調整による純ポジションへの影響額)", type: "num", answer: 210000 },
    { label: "How the internal service fund is handled(内部サービス基金の取扱い)", type: "select", options: ["Reported as a separate business-type activities column", "Its assets and liabilities are added to governmental activities (net position +$480,000)", "Excluded from the government-wide statements", "Reported as a discretely presented component unit"], answer: "Its assets and liabilities are added to governmental activities (net position +$480,000)" },
    { label: "Net position — governmental activities, Dec 31, Year 5(政府活動の純ポジション)", type: "num", answer: 8995000 },
  ],
  explain: `<p>資本資産(純額)= 18,600,000 − 7,200,000 = 11,400,000。政府資金では資本支出は支出処理され資産計上されないため加算する。</p>
<p>長期負債 = 社債6,000,000 + プレミアム150,000 + 有給休暇320,000 = 6,470,000。いずれも当期の流動財源で決済されないため基金には計上されない。</p>
<p>未払利息:修正発生主義では一般長期負債の利息は支払期日に支出計上する。期日未到来の75,000は基金負債にならないので、メモは誤りであり、ワークシートで75,000を負債として控除する。</p>
<p>利用不能収益:発生主義では課税年度の収益として認識するため、繰延資源流入210,000を取り消し純ポジションを210,000増やす。</p>
<p>内部サービス基金は主に政府部門にサービスを提供するため、その資産・負債を政府活動欄に含める(+480,000)。</p>
<p>純ポジション = 3,450,000 + 11,400,000 − 6,470,000 − 75,000 + 210,000 + 480,000 = 8,995,000。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-61", section: "BAR", chapter: "BAR-03", title: "活動計算書:機能別純(費用)収益とプログラム収益の分類",
  scenario: `<p>Pine County is preparing the governmental activities section of its statement of activities for Year 3. Expenses include depreciation allocated to functions.</p>
<table><tr><th>Function</th><th>Expenses</th><th>Related inflows</th></tr>
<tr><td>General government</td><td>$1,200,000</td><td>Building permits and business licenses $150,000</td></tr>
<tr><td>Public safety</td><td>$3,400,000</td><td>Traffic fines $220,000; state grant restricted to police training $80,000</td></tr>
<tr><td>Public works</td><td>$2,100,000</td><td>State grant restricted to bridge reconstruction $600,000; state-shared motor fuel tax restricted by state law to road maintenance $300,000</td></tr>
<tr><td>Culture and recreation</td><td>$900,000</td><td>Pool admission fees $180,000; private donation restricted to park construction $250,000</td></tr>
<tr><td>Interest on long-term debt</td><td>$300,000</td><td>—</td></tr></table>
<p>Other inflows: property taxes $5,000,000 (of which $700,000 was levied specifically for debt service), unrestricted state aid $400,000, unrestricted investment earnings $60,000.</p>
<p class="ja">Pine郡は3年目の活動計算書(政府活動)を作成している。費用には機能別に配分した減価償却費を含む。<br>
一般行政:費用$1,200,000、建築許可・営業許可料$150,000。公共安全:費用$3,400,000、交通違反罰金$220,000、警察研修に使途制限された州補助金$80,000。公共事業:費用$2,100,000、橋梁再建に使途制限された州補助金$600,000、州法で道路維持に使途制限された州分与燃料税$300,000。文化・レクリエーション:費用$900,000、プール入場料$180,000、公園建設に使途制限された民間寄付$250,000。長期債務利息:$300,000。<br>
その他:固定資産税$5,000,000(うち$700,000は債務返済目的で課税)、使途制限のない州補助$400,000、使途制限のない投資収益$60,000。</p>`,
  rows: [
    { label: "Classification of the state-shared motor fuel tax restricted to road maintenance(道路維持に使途制限された州分与燃料税の分類)", type: "select", options: ["Charges for services", "Operating grants and contributions", "Capital grants and contributions", "General revenues — taxes"], answer: "Operating grants and contributions" },
    { label: "Classification of the $700,000 property tax levied for debt service(債務返済目的の固定資産税$700,000の分類)", type: "select", options: ["Program revenue — interest on long-term debt", "Operating grants and contributions", "General revenues", "Special item"], answer: "General revenues" },
    { label: "Net (expense) revenue — public safety (enter negative)(公共安全の純(費用)収益)", type: "num", answer: -3100000 },
    { label: "Net (expense) revenue — public works (enter negative)(公共事業の純(費用)収益)", type: "num", answer: -1200000 },
    { label: "Net (expense) revenue — culture and recreation (enter negative)(文化・レクリエーションの純(費用)収益)", type: "num", answer: -470000 },
    { label: "Total net (expense) revenue — governmental activities (enter negative)(政府活動の純(費用)収益合計)", type: "num", answer: -6120000 },
    { label: "Change in net position — governmental activities (enter negative if decrease)(政府活動の純ポジション変動額)", type: "num", answer: -660000 },
  ],
  explain: `<p>他の政府からの分与収入で特定プログラムに使途制限されたものは、プログラム収益の「経常補助金・寄付」に分類する。一方、政府自身が課税した税は、使途が制限されていても一般収益である(固定資産税$700,000も一般収益)。</p>
<p>公共安全 = −3,400,000 + 罰金220,000(使用料等)+ 補助金80,000(経常補助金)= −3,100,000。</p>
<p>公共事業 = −2,100,000 + 資本補助金600,000 + 経常補助金300,000 = −1,200,000。</p>
<p>文化・レクリエーション = −900,000 + 入場料180,000 + 資本寄付250,000 = −470,000。</p>
<p>一般行政 = −1,200,000 + 150,000 = −1,050,000。長期債務利息 = −300,000(プログラム収益なし)。合計 = −1,050,000 − 3,100,000 − 1,200,000 − 470,000 − 300,000 = −6,120,000。</p>
<p>一般収益 = 5,000,000 + 400,000 + 60,000 = 5,460,000。純ポジション変動額 = 5,460,000 − 6,120,000 = −660,000。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-62", section: "BAR", chapter: "BAR-03", title: "企業基金の純ポジション区分:未使用の起債収入と債務返済積立",
  scenario: `<p>The Ridgeview Water Utility (an enterprise fund) reports the following at <b>June 30, Year 4</b>:</p>
<table><tr><th>Statement of net position item</th><th>Amount</th></tr>
<tr><td>Cash and investments — unrestricted</td><td>$1,500,000</td></tr>
<tr><td>Accounts receivable (net)</td><td>$700,000</td></tr>
<tr><td>Restricted cash — construction account (unspent revenue bond proceeds)</td><td>$2,000,000</td></tr>
<tr><td>Restricted cash — debt service reserve required by bond covenant</td><td>$900,000</td></tr>
<tr><td>Capital assets, net of accumulated depreciation</td><td>$24,000,000</td></tr>
<tr><td>Deferred outflow — deferred loss on refunding of capital debt</td><td>$120,000</td></tr>
<tr><td>Accounts payable (operations)</td><td>$400,000</td></tr>
<tr><td>Retainage payable to construction contractor (to be paid from operating cash)</td><td>$250,000</td></tr>
<tr><td>Accrued interest payable on revenue bonds (payable from the debt service reserve)</td><td>$100,000</td></tr>
<tr><td>Revenue bonds payable (issued to finance capital assets)</td><td>$15,000,000</td></tr>
<tr><td>Net pension liability</td><td>$1,800,000</td></tr>
<tr><td>Deferred inflow — pensions</td><td>$200,000</td></tr></table>
<p class="ja">Ridgeview水道事業(企業基金)の4年目6月30日現在の残高:無制限の現金・投資$1,500,000、売掛金(純額)$700,000、建設勘定の制限付現金(未使用のレベニュー債収入)$2,000,000、社債契約で要求される債務返済積立の制限付現金$900,000、資本資産(純額)$24,000,000、資本債務の借換損(繰延資源流出)$120,000、買掛金$400,000、建設業者への留保金未払額$250,000(営業現金から支払)、レベニュー債の未払利息$100,000(債務返済積立から支払)、レベニュー債$15,000,000(資本資産の取得目的)、純年金負債$1,800,000、年金に係る繰延資源流入$200,000。</p>`,
  rows: [
    { label: "Total net position(純ポジション合計)", type: "num", answer: 11470000 },
    { label: "Treatment of the unspent bond proceeds in the construction account(建設勘定の未使用起債収入の扱い)", type: "select", options: ["Included in net investment in capital assets as an asset", "Reported as restricted net position for capital projects of $2,000,000", "The proceeds and the related $2,000,000 of debt are both excluded from net investment in capital assets", "Included in unrestricted net position"], answer: "The proceeds and the related $2,000,000 of debt are both excluded from net investment in capital assets" },
    { label: "Net investment in capital assets(資本資産への純投資)", type: "num", answer: 10870000 },
    { label: "Restricted net position — debt service(制限付純ポジション:債務返済)", type: "num", answer: 800000 },
    { label: "Unrestricted net position (enter negative if deficit)(無制限純ポジション)", type: "num", answer: -200000 },
    { label: "Treatment of the retainage payable(留保金未払額の扱い)", type: "select", options: ["Reduces net investment in capital assets (capital-related payable)", "Reduces unrestricted net position", "Reduces restricted net position", "Disclosed only in the notes"], answer: "Reduces net investment in capital assets (capital-related payable)" },
  ],
  explain: `<p>資産合計 = 1,500,000 + 700,000 + 2,000,000 + 900,000 + 24,000,000 = 29,100,000、繰延資源流出 120,000。負債合計 = 400,000 + 250,000 + 100,000 + 15,000,000 + 1,800,000 = 17,550,000、繰延資源流入 200,000。純ポジション = 29,100,000 + 120,000 − 17,550,000 − 200,000 = 11,470,000。</p>
<p>未使用の起債収入2,000,000に対応する債務部分は資本資産への純投資(NIICA)の計算から除外し、制限付現金と相殺されるため制限付純ポジションにもならない(純額ゼロ)。</p>
<p>NIICA = 資本資産24,000,000 + 借換損120,000 −(社債15,000,000 − 未使用分2,000,000)− 資本関連の未払留保金250,000 = 10,870,000。</p>
<p>債務返済の制限付純ポジション = 制限付資産900,000 − それから支払う未払利息100,000 = 800,000。</p>
<p>無制限 = 11,470,000 − 10,870,000 − 800,000 = −200,000(検算:1,500,000 + 700,000 − 400,000 − 1,800,000 − 200,000 = −200,000)。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-63", section: "BAR", chapter: "BAR-03", title: "基金残高の分類グリッド:安定化積立・翌年度予算充当・特別収入基金の赤字",
  scenario: `<p>Lakeshore Township's General Fund reports total fund balance of <b>$1,400,000</b> at December 31, Year 2. The finance director provides the following analysis:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>(a) Inventory of supplies</td><td>$45,000</td></tr>
<tr><td>(b) Prepaid insurance</td><td>$15,000</td></tr>
<tr><td>(c) Unspent state grant restricted by the grantor to library programs</td><td>$120,000</td></tr>
<tr><td>(d) Stabilization (“rainy day”) amount set aside by ordinance of the Township Board (highest level of decision-making authority); the ordinance specifies the circumstances for use and can be changed only by another ordinance</td><td>$300,000</td></tr>
<tr><td>(e) Outstanding purchase orders approved by the finance director under authority delegated by Board policy</td><td>$80,000</td></tr>
<tr><td>(f) Portion of fund balance appropriated in the Year 3 budget to eliminate a projected budget deficit</td><td>$100,000</td></tr></table>
<p>The Township's Street Lighting Special Revenue Fund has a fund balance <b>deficit of $30,000</b> because expenditures exceeded restricted revenues.</p>
<p class="ja">Lakeshore町の一般基金の2年目12月31日現在の基金残高合計は$1,400,000である。(a)消耗品在庫$45,000、(b)前払保険料$15,000、(c)交付者により図書館事業に使途制限された未使用の州補助金$120,000、(d)町議会(最高意思決定機関)の条例で設定した安定化(レイニーデイ)積立$300,000(使用状況を条例で特定し、変更には別の条例が必要)、(e)議会方針で委任された権限に基づき財務部長が承認した未済発注$80,000、(f)3年目予算で見込まれる赤字を解消するために充当した基金残高$100,000。<br>
また、街路照明特別収入基金は支出が制限付収入を上回ったため、基金残高が$30,000の赤字である。</p>`,
  rows: [
    { label: "Classification of item (b) prepaid insurance(前払保険料の分類)", type: "select", options: ["Nonspendable", "Restricted", "Committed", "Assigned", "Unassigned"], answer: "Nonspendable" },
    { label: "Classification of item (d) stabilization amount(安定化積立の分類)", type: "select", options: ["Nonspendable", "Restricted", "Committed", "Assigned", "Unassigned"], answer: "Committed" },
    { label: "Classification of item (f) appropriation to eliminate the Year 3 deficit(翌年度赤字解消のための充当額の分類)", type: "select", options: ["Nonspendable", "Restricted", "Committed", "Assigned", "Unassigned"], answer: "Assigned" },
    { label: "General Fund — total nonspendable fund balance(一般基金の非支出可能残高合計)", type: "num", answer: 60000 },
    { label: "General Fund — total assigned fund balance(一般基金の指定済残高合計)", type: "num", answer: 180000 },
    { label: "General Fund — unassigned fund balance(一般基金の未指定残高)", type: "num", answer: 740000 },
    { label: "Reporting of the Street Lighting fund deficit(特別収入基金の赤字の表示)", type: "select", options: ["Negative restricted fund balance", "Negative unassigned fund balance", "Negative committed fund balance", "Reclassified to the General Fund as a liability"], answer: "Negative unassigned fund balance" },
    { label: "Total unassigned fund balance — all governmental funds (General Fund + Street Lighting)(政府資金全体の未指定残高合計)", type: "num", answer: 710000 },
  ],
  explain: `<p>(a)在庫と(b)前払費用は支出可能な形態でないため非支出可能(Nonspendable)= 45,000 + 15,000 = 60,000。</p>
<p>(c)外部の交付者による制限 → 制限付(Restricted)120,000。(d)最高意思決定機関の正式な措置(条例)による拘束で、同じ措置でしか変更できない → 拘束済(Committed)300,000。</p>
<p>(e)委任された財務部長による意図の表明 → 指定済(Assigned)。(f)翌年度予算の赤字解消への充当も指定済に分類する。指定済合計 = 80,000 + 100,000 = 180,000。</p>
<p>未指定 = 1,400,000 − 60,000 − 120,000 − 300,000 − 180,000 = 740,000。</p>
<p>一般基金以外の政府資金では正の未指定残高は報告しないが、赤字(支出が制限・拘束・指定額を超過)は負の未指定残高として報告する。政府資金全体の未指定 = 740,000 − 30,000 = 710,000。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-64", section: "BAR", chapter: "BAR-03", title: "主要基金の判定:10%基準と5%基準の計算",
  scenario: `<p>Westbrook City is determining which funds to present as major funds for Year 6. Totals (in dollars):</p>
<table><tr><th>Element</th><th>Total governmental funds</th><th>Total enterprise funds</th></tr>
<tr><td>Assets + deferred outflows</td><td>20,000,000</td><td>30,000,000</td></tr>
<tr><td>Liabilities + deferred inflows</td><td>6,000,000</td><td>14,000,000</td></tr>
<tr><td>Revenues (excluding other financing sources)</td><td>30,000,000</td><td>10,000,000</td></tr>
<tr><td>Expenditures / expenses (excluding other financing uses)</td><td>28,000,000</td><td>9,000,000</td></tr></table>
<table><tr><th>Individual fund</th><th>Assets + DO</th><th>Liabilities + DI</th><th>Revenues</th><th>Expenditures / expenses</th></tr>
<tr><td>Road Special Revenue Fund</td><td>2,200,000</td><td>300,000</td><td>3,200,000</td><td>2,500,000</td></tr>
<tr><td>Debt Service Fund</td><td>1,900,000</td><td>500,000</td><td>2,900,000</td><td>2,700,000</td></tr>
<tr><td>Parking Enterprise Fund</td><td>2,800,000</td><td>1,500,000</td><td>800,000</td><td>700,000</td></tr>
<tr><td>Golf Course Enterprise Fund</td><td>2,400,000</td><td>600,000</td><td>1,100,000</td><td>950,000</td></tr></table>
<p>Management does not elect to report any fund as major for public-interest reasons.</p>
<p class="ja">Westbrook市は6年目に主要基金として表示する基金を判定している。政府資金合計:資産+繰延資源流出20,000,000、負債+繰延資源流入6,000,000、収益30,000,000、支出28,000,000。企業基金合計:それぞれ30,000,000、14,000,000、10,000,000、9,000,000。<br>
個別基金(資産+DO/負債+DI/収益/支出・費用):道路特別収入基金 2,200,000/300,000/3,200,000/2,500,000、債務返済基金 1,900,000/500,000/2,900,000/2,700,000、駐車場企業基金 2,800,000/1,500,000/800,000/700,000、ゴルフ場企業基金 2,400,000/600,000/1,100,000/950,000。経営者が重要性を理由に任意で主要基金とするものはない。</p>`,
  rows: [
    { label: "10% threshold — governmental funds revenues(政府資金の収益の10%基準額)", type: "num", answer: 3000000 },
    { label: "5% threshold — combined governmental and enterprise liabilities + deferred inflows(政府資金と企業基金合算の負債+DIの5%基準額)", type: "num", answer: 1000000 },
    { label: "Road Special Revenue Fund(道路特別収入基金)", type: "select", options: ["Major fund", "Nonmajor — meets a 10% test but not the 5% test for the same element", "Nonmajor — fails every 10% test"], answer: "Major fund" },
    { label: "Debt Service Fund(債務返済基金)", type: "select", options: ["Major fund", "Nonmajor — meets a 10% test but not the 5% test for the same element", "Nonmajor — fails every 10% test"], answer: "Nonmajor — fails every 10% test" },
    { label: "Parking Enterprise Fund(駐車場企業基金)", type: "select", options: ["Major fund", "Nonmajor — meets a 10% test but not the 5% test for the same element", "Nonmajor — fails every 10% test"], answer: "Major fund" },
    { label: "Golf Course Enterprise Fund(ゴルフ場企業基金)", type: "select", options: ["Major fund", "Nonmajor — meets a 10% test but not the 5% test for the same element", "Nonmajor — fails every 10% test"], answer: "Nonmajor — meets a 10% test but not the 5% test for the same element" },
    { label: "Presentation of nonmajor governmental funds in the fund statements(非主要政府資金の表示)", type: "select", options: ["Each in a separate column", "Aggregated in a single column", "Omitted from the fund statements and shown only in notes", "Combined with the General Fund"], answer: "Aggregated in a single column" },
  ],
  explain: `<p>基準:個別基金のいずれかの要素が①同種基金(政府資金または企業基金)合計の10%以上、かつ②同じ要素について政府資金+企業基金合算の5%以上なら主要基金。一般基金は常に主要基金。</p>
<p>政府資金の10%基準:資産2,000,000、負債600,000、収益3,000,000、支出2,800,000。企業基金の10%基準:3,000,000、1,400,000、1,000,000、900,000。合算の5%基準:資産50,000,000×5% = 2,500,000、負債20,000,000×5% = 1,000,000、収益40,000,000×5% = 2,000,000、支出37,000,000×5% = 1,850,000。</p>
<p>道路基金:収益3,200,000 ≥ 3,000,000 かつ ≥ 2,000,000 → 主要基金(資産2,200,000は10%を満たすが5%の2,500,000未満)。</p>
<p>債務返済基金:資産1,900,000 < 2,000,000、負債500,000 < 600,000、収益2,900,000 < 3,000,000、支出2,700,000 < 2,800,000 → 10%基準をすべて満たさず非主要。</p>
<p>駐車場:負債1,500,000 ≥ 1,400,000 かつ ≥ 1,000,000 → 主要基金。</p>
<p>ゴルフ場:収益1,100,000 ≥ 1,000,000、費用950,000 ≥ 900,000 と10%は満たすが、5%基準(2,000,000、1,850,000)は満たさない。資産・負債は10%未満 → 非主要。</p>
<p>非主要の政府資金は1つの列に集約して表示する。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-65", section: "BAR", chapter: "BAR-03", title: "企業基金のキャッシュ・フロー計算書:4区分への分類と合計",
  scenario: `<p>The Northgate Transit Authority (an enterprise fund) had the following cash transactions for Year 7. Assume GASB Statement No. 103 is effective and that, for this task, it does not change the four cash flow categories or the classification of interest applied below.</p>
<table><tr><th>Cash transaction</th><th>Amount</th></tr>
<tr><td>Cash received from customers (fares)</td><td>$2,400,000</td></tr>
<tr><td>Cash paid to employees</td><td>$900,000</td></tr>
<tr><td>Cash paid to suppliers</td><td>$600,000</td></tr>
<tr><td>Operating subsidy received from the county (not restricted to capital)</td><td>$150,000</td></tr>
<tr><td>Transfer out to the General Fund</td><td>$200,000</td></tr>
<tr><td>Proceeds of short-term note to cover operating cash needs</td><td>$100,000</td></tr>
<tr><td>Interest paid on the short-term operating note</td><td>$10,000</td></tr>
<tr><td>Proceeds from issuance of revenue bonds for bus purchases</td><td>$3,000,000</td></tr>
<tr><td>Acquisition of buses</td><td>$2,800,000</td></tr>
<tr><td>Principal paid on revenue bonds</td><td>$400,000</td></tr>
<tr><td>Interest paid on revenue bonds</td><td>$180,000</td></tr>
<tr><td>Federal capital grant received for bus purchases</td><td>$500,000</td></tr>
<tr><td>Interest received on investments</td><td>$40,000</td></tr>
<tr><td>Purchase of investments</td><td>$300,000</td></tr></table>
<p class="ja">Northgate交通局(企業基金)の7年目の現金取引。GASB 103号は適用済みとし、本問では以下で用いる4区分および利息の分類を変更しないものとする。<br>
顧客からの運賃収入$2,400,000、従業員への支払$900,000、仕入先への支払$600,000、郡からの経常補助金(資本目的に制限なし)$150,000、一般基金への繰出$200,000、運転資金のための短期借入$100,000、その短期借入の利息支払$10,000、バス購入のためのレベニュー債発行収入$3,000,000、バスの取得$2,800,000、レベニュー債元本返済$400,000、レベニュー債利息支払$180,000、バス購入のための連邦資本補助金$500,000、投資の受取利息$40,000、投資の購入$300,000。</p>`,
  rows: [
    { label: "Net cash provided by operating activities(営業活動による純キャッシュ・フロー)", type: "num", answer: 900000 },
    { label: "Net cash provided by noncapital financing activities(非資本財務活動による純キャッシュ・フロー)", type: "num", answer: 40000 },
    { label: "Net cash provided by capital and related financing activities(資本及び関連財務活動による純キャッシュ・フロー)", type: "num", answer: 120000 },
    { label: "Net cash used by investing activities (enter negative)(投資活動による純キャッシュ・フロー)", type: "num", answer: -260000 },
    { label: "Net increase in cash and cash equivalents(現金及び現金同等物の純増加額)", type: "num", answer: 800000 },
    { label: "Classification of interest paid on the revenue bonds(レベニュー債の利息支払の分類)", type: "select", options: ["Operating activities", "Noncapital financing activities", "Capital and related financing activities", "Investing activities"], answer: "Capital and related financing activities" },
    { label: "Method of presenting operating activities(営業活動の表示方法)", type: "select", options: ["Indirect method only", "Direct method required, with a reconciliation of operating income to net operating cash flows", "Either method; no reconciliation required", "Direct method; reconciliation starts with change in net position"], answer: "Direct method required, with a reconciliation of operating income to net operating cash flows" },
  ],
  explain: `<p>営業活動 = 2,400,000 − 900,000 − 600,000 = 900,000。</p>
<p>非資本財務活動 = 経常補助金150,000 − 繰出200,000 + 短期借入100,000 − その利息10,000 = 40,000。資本目的でない借入の利息は非資本財務活動に分類する(GASBでは支払利息は営業活動にしない)。</p>
<p>資本及び関連財務活動 = 社債発行3,000,000 − バス取得2,800,000 − 元本400,000 − 利息180,000 + 資本補助金500,000 = 120,000。</p>
<p>投資活動 = 受取利息40,000 − 投資購入300,000 = −260,000(受取利息は投資活動)。</p>
<p>純増加 = 900,000 + 40,000 + 120,000 − 260,000 = 800,000。</p>
<p>GASBでは直接法が必須で、営業利益から営業活動の純キャッシュ・フローへの調整表を併せて表示する。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-66", section: "BAR", chapter: "BAR-03", title: "GASB 87:借手・貸手のリース処理(政府資金と政府全体の比較)",
  scenario: `<p>On January 1, Year 1, Maple County (a) leased road equipment for the Public Works Department (accounted for in the General Fund) and (b) leased space in a county-owned building to a café operator.</p>
<table><tr><th>Exhibit 1 — Lessee lease (equipment)</th><th></th></tr>
<tr><td>Lease term (noncancelable; no purchase option)</td><td>5 years</td></tr>
<tr><td>Annual payment, due each December 31 beginning Year 1</td><td>$50,000</td></tr>
<tr><td>County's incremental borrowing rate</td><td>5%</td></tr>
<tr><td>PV of ordinary annuity, 5 periods, 5%</td><td>4.32948</td></tr>
<tr><td>Useful life of the equipment</td><td>8 years</td></tr></table>
<table><tr><th>Exhibit 2 — Lessor lease (café space)</th><th></th></tr>
<tr><td>Lease term</td><td>10 years</td></tr>
<tr><td>Present value of lease payments to be received (measured at commencement)</td><td>$120,000</td></tr>
<tr><td>No payments were received at or before commencement</td><td></td></tr></table>
<p>Round all amounts to the nearest dollar.</p>
<p class="ja">1年目1月1日、Maple郡は(a)公共事業部(一般基金で会計処理)のために道路機材をリースで借り入れ、(b)郡所有ビルのスペースをカフェ事業者に貸し出した。<br>
借手リース:リース期間5年(解約不能、購入オプションなし)、年間支払額$50,000(1年目から毎年12月31日払い)、追加借入利子率5%、5期5%の通常年金現価係数4.32948、機材の耐用年数8年。<br>
貸手リース:リース期間10年、受け取るリース料の現在価値(開始日測定)$120,000、開始日以前の受取なし。金額は1ドル未満を四捨五入する。</p>`,
  rows: [
    { label: "Lease liability at commencement — government-wide(開始日のリース負債:政府全体)", type: "num", answer: 216474, tol: 1 },
    { label: "General Fund entry at commencement(開始日の一般基金の仕訳)", type: "select", options: ["No entry until the first payment", "Dr Expenditures—capital outlay; Cr Other financing sources—leases, $216,474", "Dr Lease asset; Cr Lease liability, $216,474", "Dr Expenditures—rent $50,000; Cr Cash $50,000"], answer: "Dr Expenditures—capital outlay; Cr Other financing sources—leases, $216,474" },
    { label: "Year 1 interest expense — government-wide(1年目の支払利息:政府全体)", type: "num", answer: 10824, tol: 1 },
    { label: "Year 1 amortization expense on the lease asset — government-wide(1年目のリース資産償却費)", type: "num", answer: 43295, tol: 1 },
    { label: "Lease liability, Dec 31, Year 1 — government-wide(1年目末のリース負債)", type: "num", answer: 177298, tol: 1 },
    { label: "General Fund expenditure for debt service — principal, Year 1(1年目の一般基金の債務返済元本支出)", type: "num", answer: 39176, tol: 1 },
    { label: "Lessor recognition at commencement(貸手の開始日の認識)", type: "select", options: ["Lease receivable and lease revenue of $120,000", "Lease receivable and deferred inflow of resources of $120,000; the building remains on the books", "Derecognize the leased portion of the building and recognize a gain", "No entry; revenue is recognized as cash is received"], answer: "Lease receivable and deferred inflow of resources of $120,000; the building remains on the books" },
    { label: "Year 1 lease revenue recognized from the deferred inflow (straight-line)(1年目に繰延資源流入から認識するリース収益)", type: "num", answer: 12000 },
  ],
  explain: `<p>リース負債 = 50,000 × 4.32948 = 216,474。政府全体ではリース資産(使用権資産)とリース負債を同額で認識する。</p>
<p>一般基金(修正発生主義)では、開始日に資本支出216,474とその他の財源(リース)216,474を計上する(資産・長期負債は計上しない)。</p>
<p>1年目利息 = 216,474 × 5% = 10,824。償却費 = 216,474 ÷ 5年(リース期間 < 耐用年数8年なので短い方)= 43,295。</p>
<p>1年目末負債 = 216,474 + 10,824 − 50,000 = 177,298。</p>
<p>一般基金の支払時:債務返済(元本)支出 = 50,000 − 10,824 = 39,176、債務返済(利息)支出10,824。</p>
<p>貸手:リース債権とリースに係る繰延資源流入を120,000で認識し、原資産(建物)は引き続き計上する。繰延資源流入はリース期間にわたり規則的に収益化:120,000 ÷ 10 = 12,000(債権には別途利息収益を認識する)。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-67", section: "BAR", chapter: "BAR-03", title: "GASB 96:サブスクリプション型ITアレンジメント(SBITA)の資産計上",
  scenario: `<p>On July 1, Year 3, Riverside School District signed a cloud-based enterprise resource planning subscription (SBITA). Terms and costs:</p>
<table><tr><th>Item</th><th>Amount / detail</th></tr>
<tr><td>Noncancelable subscription term</td><td>4 years</td></tr>
<tr><td>Annual subscription payment, due each July 1 (first payment made at commencement)</td><td>$90,000</td></tr>
<tr><td>Incremental borrowing rate</td><td>6%</td></tr>
<tr><td>PV of ordinary annuity, 3 periods, 6%</td><td>2.67301</td></tr>
<tr><td>Preliminary project stage — needs assessment and vendor selection</td><td>$25,000</td></tr>
<tr><td>Initial implementation stage — configuration, coding and interface testing</td><td>$60,000</td></tr>
<tr><td>Training of district staff</td><td>$15,000</td></tr></table>
<p><b>Exhibit 2:</b> The district also signed a separate 10-month subscription for survey software with no renewal options.</p>
<p>The district's fiscal year ends June 30. Round to the nearest dollar.</p>
<p class="ja">3年目7月1日、Riverside学区はクラウド型ERPのサブスクリプション契約(SBITA)を締結した。解約不能期間4年、年間支払額$90,000(毎年7月1日払い、初回は開始日に支払済)、追加借入利子率6%、3期6%の通常年金現価係数2.67301。予備的プロジェクト段階(ニーズ評価・ベンダー選定)$25,000、初期導入段階(設定・コーディング・インターフェース試験)$60,000、職員研修$15,000。<br>
資料2:別途、更新オプションのない10か月のアンケートソフトの契約も締結した。会計年度末は6月30日。金額は1ドル未満を四捨五入する。</p>`,
  rows: [
    { label: "Subscription liability at commencement (after the first payment)(開始日のサブスクリプション負債)", type: "num", answer: 240571, tol: 2 },
    { label: "Subscription asset at commencement(開始日のサブスクリプション資産)", type: "num", answer: 390571, tol: 2 },
    { label: "Total costs expensed as incurred(発生時に費用処理する額の合計)", type: "num", answer: 40000 },
    { label: "Amortization expense for fiscal year ending June 30, Year 4(4年6月期の償却費)", type: "num", answer: 97643, tol: 2 },
    { label: "Interest expense for fiscal year ending June 30, Year 4(4年6月期の支払利息)", type: "num", answer: 14434, tol: 2 },
    { label: "Accounting for the 10-month survey software subscription(10か月契約の会計処理)", type: "select", options: ["Capitalize a subscription asset and liability", "Short-term SBITA — recognize outflows as expense based on the payment terms", "Recognize an intangible asset only for the implementation costs and a liability for all payments", "Disclose only"], answer: "Short-term SBITA — recognize outflows as expense based on the payment terms" },
    { label: "Governmental fund reporting at commencement for the ERP SBITA(政府資金での開始日の表示)", type: "select", options: ["Subscription asset and subscription liability", "Capital outlay expenditure and an other financing source equal to the initial subscription liability", "Deferred outflow of resources for the full payment stream", "No recognition until each annual payment"], answer: "Capital outlay expenditure and an other financing source equal to the initial subscription liability" },
  ],
  explain: `<p>負債:開始日の支払後に残る3回の支払の現在価値 = 90,000 × 2.67301 = 240,571。</p>
<p>資産 = 負債240,571 + 開始日の支払90,000 + 初期導入段階の資本化コスト60,000 = 390,571。</p>
<p>予備的プロジェクト段階のコスト25,000と研修費15,000は発生時に費用処理 → 40,000(研修費は段階にかかわらず費用)。</p>
<p>償却費 = 390,571 ÷ 4年 = 97,643。支払利息 = 240,571 × 6% = 14,434。</p>
<p>最長期間が12か月以下の短期SBITAは資産・負債を認識せず、支払条件に基づき費用処理する。</p>
<p>政府資金では、リースと同様に初期のサブスクリプション負債額を資本支出とその他の財源として計上する(開始日の支払90,000は支出として別途計上)。</p>`,
});
