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
