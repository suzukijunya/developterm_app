// FAR のTBS追加(負債・引当金・偶発事象・社債・リース)

CPA.tbs({
  id: "TBS-FAR-57", section: "FAR", chapter: "FAR-04", title: "給与・有給休暇・賞与の期末未払計上",
  scenario: `<p>Harbor Fabrication Inc. is closing its books for the year ended December 31, Year 2. You are preparing the year-end accrual schedule for compensation-related liabilities. Assume all employees have already exceeded the FUTA and SUTA wage bases for Year 2, and that the Social Security wage base has not been reached by any employee. FICA is 7.65% for both employer and employee.</p>
<table><tr><th>Exhibit 1 — Payroll register (excerpt)</th><th>Amount</th></tr>
<tr><td>Gross wages for the pay period ended and paid December 26, Year 2</td><td>$120,000</td></tr>
<tr><td>Federal income tax withheld from the December 26 payroll (not yet remitted at 12/31)</td><td>18,000</td></tr>
<tr><td>Employee and employer FICA on the December 26 payroll (not yet remitted at 12/31)</td><td>see rate above</td></tr>
<tr><td>Gross wages earned December 27–31, Year 2 (to be paid January 9, Year 3)</td><td>42,000</td></tr></table>
<table><tr><th>Exhibit 2 — HR memo on compensated absences</th><th>Data</th></tr>
<tr><td>Unused vacation days at 12/31, Year 2 (vest; carried forward and paid on termination)</td><td>300 days</td></tr>
<tr><td>Unused sick days at 12/31, Year 2 (accumulate but do NOT vest; paid only upon actual illness)</td><td>500 days</td></tr>
<tr><td>Average daily pay rate, Year 2 (company policy: accrue at current rates)</td><td>$200</td></tr>
<tr><td>Average daily pay rate expected for Year 3</td><td>$210</td></tr></table>
<p>Exhibit 3 — Bonus agreement: Managers receive a bonus equal to 10% of income after deducting the bonus but before income taxes. Income before the bonus and income taxes is $660,000. Ignore payroll taxes on compensated absences and the bonus. Harbor elects not to accrue non-vesting sick pay.</p>
<p class="ja">Harbor Fabrication社は第2年度12月31日終了年度の決算を行っている。報酬関連負債の期末未払計上表を作成する。全従業員は第2年度のFUTA・SUTAの課税上限に達しており、社会保障税の上限に達した者はいない。FICAは雇用主・従業員とも7.65%である。</p>
<p class="ja">資料1:12月26日締め・支給の総支給額$120,000、同給与からの源泉所得税$18,000(12/31時点で未納付)、同給与の従業員・雇用主負担FICA(未納付)、12月27日〜31日の稼得給与$42,000(第3年度1月9日支給)。</p>
<p class="ja">資料2:未消化の有給休暇300日(権利確定・繰越可能、退職時に支払)、未消化の病気休暇500日(累積するが権利確定しない)、第2年度の平均日額$200(方針:現行単価で計上)、第3年度の見込日額$210。</p>
<p class="ja">資料3:管理職賞与は「賞与控除後・法人税控除前利益」の10%。賞与・法人税控除前利益は$660,000。有給休暇と賞与に係る給与税は無視する。権利確定しない病気休暇は計上しない方針である。</p>`,
  rows: [
    { label: "Accrued wages payable at 12/31, Year 2(期末未払給与)", type: "num", answer: 42000 },
    { label: "Employer FICA accrued on the 12/31 accrued wages(未払給与に係る雇用主FICA)", type: "num", answer: 3213 },
    { label: "Withholdings and payroll taxes payable from the December 26 payroll(12月26日給与に係る預り金・未払給与税合計)", type: "num", answer: 36360 },
    { label: "Accrued vacation liability(未払有給休暇)", type: "num", answer: 60000 },
    { label: "Required accounting for the unused sick days(未消化病気休暇の会計処理)", type: "select", options: ["Accrue $100,000 because the rights accumulate", "Accrue $105,000 at the Year 3 rate", "Accrual not required because the rights do not vest; expense when paid", "Disclose only as a gain contingency"], answer: "Accrual not required because the rights do not vest; expense when paid" },
    { label: "Bonus payable(未払賞与)", type: "num", answer: 60000 },
    { label: "Total compensation-related current liabilities at 12/31, Year 2(報酬関連の流動負債合計)", type: "num", answer: 201573 },
  ],
  explain: `<p>① 未払給与:12月27日〜31日の稼得分$42,000は発生主義で計上する。</p>
<p>② 雇用主FICA:$42,000 × 7.65% = $3,213。FUTA・SUTAは課税上限到達済みのため0である。</p>
<p>③ 12月26日給与:源泉所得税$18,000+従業員FICA $120,000×7.65%=$9,180+雇用主FICA $9,180 = $36,360。従業員から預かった分も納付までは会社の負債である。</p>
<p>④ 有給休暇:権利確定(vest)しており、金額を合理的に見積れるので計上が必要(ASC 710)。300日 × 現行日額$200 = $60,000。</p>
<p>⑤ 病気休暇:累積するが権利確定しない病気休暇は計上が強制されない(計上は容認)。会社は計上しない方針のため支払時に費用とする。</p>
<p>⑥ 賞与:B = 0.10 ×($660,000 − B) → 1.1B = $66,000 → B = $60,000。</p>
<p>⑦ 合計:$42,000 + $3,213 + $36,360 + $60,000 + $60,000 = $201,573。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-58", section: "FAR", chapter: "FAR-04", title: "製品保証・延長保証・景品引当の計算",
  scenario: `<p>Lakeview Appliances sells kitchen appliances and runs a customer premium program. The following information relates to Year 1. The company's fiscal year ends December 31.</p>
<table><tr><th>Exhibit 1 — Assurance-type warranty</th><th>Data</th></tr>
<tr><td>Warranty liability, January 1, Year 1</td><td>$30,000</td></tr>
<tr><td>Sales of appliances, Year 1 (8,000 units × $500)</td><td>$4,000,000</td></tr>
<tr><td>Estimated warranty cost (2-year assurance warranty included in price)</td><td>3% of sales</td></tr>
<tr><td>Actual warranty costs incurred in Year 1</td><td>$50,000</td></tr></table>
<table><tr><th>Exhibit 2 — Extended warranty contracts (sold separately)</th><th>Data</th></tr>
<tr><td>Contracts sold July 1, Year 1</td><td>1,000 contracts</td></tr>
<tr><td>Price per contract (2-year coverage beginning July 1, Year 1)</td><td>$240</td></tr>
<tr><td>Pattern of service</td><td>Evenly over the term</td></tr></table>
<table><tr><th>Exhibit 3 — Premium program</th><th>Data</th></tr>
<tr><td>Boxes of cleaning pods sold in Year 1 (one coupon per box)</td><td>600,000</td></tr>
<tr><td>Coupons required for one premium (customer also remits $1)</td><td>5</td></tr>
<tr><td>Cost of each premium to Lakeview</td><td>$4</td></tr>
<tr><td>Estimated coupon redemption rate</td><td>40%</td></tr>
<tr><td>Coupons redeemed in Year 1</td><td>150,000</td></tr></table>
<p>The premium program is accounted for as a selling expense with an estimated liability (the effect of allocating transaction price is immaterial).</p>
<p class="ja">Lakeview Appliances社は家電を販売し、景品プログラムを実施している。会計年度は12月31日終了である。</p>
<p class="ja">資料1(保証型製品保証):期首保証引当金$30,000、第1年度売上$4,000,000(8,000台×$500)、見積保証費は売上の3%、第1年度の実際保証費$50,000。</p>
<p class="ja">資料2(別売の延長保証):7月1日に1,000件販売、1件$240(7月1日から2年間)、サービスは期間にわたり均等に提供。</p>
<p class="ja">資料3(景品):洗剤箱600,000箱販売(1箱1枚のクーポン)、クーポン5枚+$1で景品1個、景品原価$4、見積回収率40%、第1年度回収150,000枚。景品は販売費として見積負債を計上する(取引価格配分の影響は重要でない)。</p>`,
  rows: [
    { label: "Warranty expense for Year 1 (assurance-type)(保証費用)", type: "num", answer: 120000 },
    { label: "Warranty liability at December 31, Year 1(期末保証引当金)", type: "num", answer: 100000 },
    { label: "Extended warranty revenue recognized in Year 1(延長保証収益)", type: "num", answer: 60000 },
    { label: "Contract liability (unearned extended warranty revenue) at 12/31, Year 1(期末契約負債)", type: "num", answer: 180000 },
    { label: "Premium expense for Year 1(景品費用)", type: "num", answer: 144000 },
    { label: "Estimated premium liability at 12/31, Year 1(期末景品引当金)", type: "num", answer: 54000 },
    { label: "How is the extended (service-type) warranty accounted for?(延長保証の会計処理)", type: "select", options: ["Accrue the estimated cost as a loss contingency at the point of sale", "Separate performance obligation; defer revenue and recognize over the coverage period", "Recognize all revenue at sale because the price is nonrefundable", "Recognize revenue only when claims are paid"], answer: "Separate performance obligation; defer revenue and recognize over the coverage period" },
  ],
  explain: `<p>① 保証型保証は販売時に費用・負債を見積計上する:$4,000,000 × 3% = $120,000。</p>
<p>② 期末保証引当金:$30,000 + $120,000 − $50,000 = $100,000。</p>
<p>③ 延長保証はサービス型で別個の履行義務(ASC 606)。総額$240,000を24か月で認識し、第1年度は6か月分:$240,000 × 6/24 = $60,000。</p>
<p>④ 契約負債:$240,000 − $60,000 = $180,000(うち$120,000が流動、$60,000が非流動)。</p>
<p>⑤ 景品費用:回収見込クーポン600,000 × 40% = 240,000枚 → 景品48,000個 × 正味原価($4 − $1)= $144,000。</p>
<p>⑥ 期中回収:150,000 ÷ 5 = 30,000個 × $3 = $90,000。期末引当金 = $144,000 − $90,000 = $54,000。</p>
<p>⑦ サービス型保証は別個の履行義務として収益を繰り延べ、保証期間にわたり認識する。偶発損失として原価を見積計上するのは保証型保証の処理である。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-59", section: "FAR", chapter: "FAR-04", title: "偶発事象の分類グリッド(計上・注記・なし)",
  scenario: `<p>Brennan Industries is finalizing its December 31, Year 4 financial statements, which will be issued March 1, Year 5. Legal counsel's letter and the risk manager's memo identified the matters below. No amounts have been recorded for any of them.</p>
<table><tr><th>Item</th><th>Description (from legal letter / risk memo)</th></tr>
<tr><td>A</td><td>A former distributor sued Brennan for breach of contract in Year 4. Counsel believes an unfavorable outcome is probable; the loss is estimated in a range of $200,000 to $500,000, with no amount in the range a better estimate than any other.</td></tr>
<tr><td>B</td><td>A product-liability suit filed in Year 4 seeks $750,000. Counsel believes an unfavorable outcome is reasonably possible.</td></tr>
<tr><td>C</td><td>Brennan sued a competitor for patent infringement. Counsel believes it is probable Brennan will be awarded $400,000.</td></tr>
<tr><td>D</td><td>Brennan guaranteed a $1,000,000 bank loan of an unaffiliated supplier in a prior year (any guarantee liability recognized at inception has been fully amortized). The likelihood of the supplier defaulting is remote.</td></tr>
<tr><td>E</td><td>A customer was injured on Brennan's premises in December, Year 4. No claim has been filed, but counsel believes a claim is probable and an unfavorable outcome is probable; the best estimate of loss is $120,000.</td></tr>
<tr><td>F</td><td>An environmental incident occurred at a plant in Year 3. No claim has been asserted, and counsel believes assertion of a claim is not probable.</td></tr>
<tr><td>G</td><td>The EPA named Brennan a potentially responsible party for a site cleanup. Loss is probable; the estimated range is $60,000 to $150,000, with $90,000 the best estimate.</td></tr>
<tr><td>H</td><td>Brennan is self-insured for fire losses. Management wants to record a $50,000 reserve for possible future fires; no fire has occurred.</td></tr></table>
<p class="ja">Brennan Industries社は第4年度12月31日の財務諸表を確定中である(発行日は第5年度3月1日)。弁護士の回答書とリスク管理部門のメモで以下の事項が識別された。いずれも未計上である。</p>
<p class="ja">A:元販売代理店からの契約違反訴訟。敗訴の可能性は高い(probable)。損失は$200,000〜$500,000で、範囲内に最善の見積りはない。B:製造物責任訴訟(請求額$750,000)。敗訴は合理的に起こりうる(reasonably possible)。C:当社が競合他社を特許侵害で提訴。$400,000の勝訴がprobable。D:前年度に無関係の仕入先の銀行借入$1,000,000を保証(当初認識した保証負債は償却済)。債務不履行の可能性はremote。E:12月に当社敷地内で顧客が負傷。請求は未提起だが、提起も敗訴もprobable、最善見積り$120,000。F:第3年度の環境事故。請求は未提起で、提起の可能性はprobableではない。G:EPAにより浄化費用の潜在的責任当事者に指定。損失はprobable、範囲$60,000〜$150,000、最善見積り$90,000。H:火災損失を自家保険としている。経営者は将来の火災に備え$50,000の引当金計上を希望(火災は未発生)。</p>`,
  rows: [
    { label: "Item A — required treatment(A の処理)", type: "select", options: ["Accrue and disclose", "Disclose only", "Neither accrue nor disclose"], answer: "Accrue and disclose" },
    { label: "Item B — required treatment(B の処理)", type: "select", options: ["Accrue and disclose", "Disclose only", "Neither accrue nor disclose"], answer: "Disclose only" },
    { label: "Item C — required treatment(C の処理)", type: "select", options: ["Accrue and disclose", "Disclose only", "Neither accrue nor disclose"], answer: "Disclose only" },
    { label: "Item D — required treatment(D の処理)", type: "select", options: ["Accrue and disclose", "Disclose only", "Neither accrue nor disclose"], answer: "Disclose only" },
    { label: "Item E — required treatment(E の処理)", type: "select", options: ["Accrue and disclose", "Disclose only", "Neither accrue nor disclose"], answer: "Accrue and disclose" },
    { label: "Item F — required treatment(F の処理)", type: "select", options: ["Accrue and disclose", "Disclose only", "Neither accrue nor disclose"], answer: "Neither accrue nor disclose" },
    { label: "Total estimated loss liabilities to accrue at 12/31, Year 4 (Items A–H)(計上すべき見積損失合計)", type: "num", answer: 410000 },
    { label: "Amount of additional reasonably possible loss to disclose for Item A(A について注記する追加損失額)", type: "num", answer: 300000 },
  ],
  explain: `<p>ASC 450-20:損失がprobableかつ合理的に見積可能なら計上、reasonably possibleなら注記のみ、remoteなら原則不要(ただし債務保証は remote でも注記)。</p>
<p>A:probableで見積可能。範囲内に最善見積りがないので最低額$200,000を計上し、注記する。</p>
<p>B:reasonably possible → 注記のみ(計上なし)。</p>
<p>C:利得の偶発事象は実現するまで認識しない(ASC 450-30)。誤解を招かないよう注記のみ。</p>
<p>D:債務保証は不履行の可能性がremoteでも注記が必要(ASC 460)。追加の偶発損失計上はない。</p>
<p>E:未提起の請求でも、提起がprobableかつ不利な結果がprobableで見積可能なら計上する:$120,000。</p>
<p>F:未提起で提起の可能性がprobableでなければ、計上も注記も不要。</p>
<p>G:最善見積り$90,000を計上する。H:将来の火災など一般的な事業リスクは負債ではなく、引当金計上は認められない(0)。</p>
<p>計上合計 = $200,000(A)+ $120,000(E)+ $90,000(G)= $410,000。</p>
<p>Aの注記:範囲の上限との差額 $500,000 − $200,000 = $300,000 の追加損失が合理的に起こりうる旨を注記する。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-60", section: "FAR", chapter: "FAR-04", title: "割引発行社債の償却・期中発行・期限前償還損益",
  scenario: `<p>Corwin Manufacturing has two bond issues. Corwin uses the effective interest method unless the straight-line method produces results that are not materially different, as noted.</p>
<table><tr><th>Exhibit 1 — Series A bonds</th><th>Terms</th></tr>
<tr><td>Face amount</td><td>$1,000,000</td></tr>
<tr><td>Stated rate / payment dates</td><td>8% per year, paid semiannually on June 30 and December 31</td></tr>
<tr><td>Date issued / maturity</td><td>January 1, Year 1 / December 31, Year 5</td></tr>
<tr><td>Market yield at issuance</td><td>10% per year (5% per half-year)</td></tr>
<tr><td>PV of $1, 10 periods, 5%</td><td>0.61391</td></tr>
<tr><td>PV of ordinary annuity of $1, 10 periods, 5%</td><td>7.72173</td></tr></table>
<p>On July 1, Year 2 (immediately after the June 30 interest payment), Corwin retired the entire Series A issue by purchasing it on the open market at 98.</p>
<table><tr><th>Exhibit 2 — Series B bonds</th><th>Terms</th></tr>
<tr><td>Face amount / stated rate</td><td>$500,000 / 6%, paid June 30 and December 31</td></tr>
<tr><td>Bond date / maturity</td><td>January 1, Year 1 / December 31, Year 5</td></tr>
<tr><td>Issue date / price</td><td>May 1, Year 1 at 101 plus accrued interest</td></tr>
<tr><td>Amortization method</td><td>Straight-line from issue date to maturity (not materially different)</td></tr></table>
<p class="ja">Corwin Manufacturing社は2つの社債を発行している。原則として実効金利法を用いるが、定額法との差が重要でない場合は定額法による。</p>
<p class="ja">資料1(A社債):額面$1,000,000、表面利率年8%(6月30日・12月31日の半年払い)、第1年度1月1日発行・第5年度12月31日満期、発行時の市場利率年10%(半年5%)。10期・5%の現価係数0.61391、年金現価係数7.72173。第2年度7月1日(6月30日の利払直後)に市場で98で全額買入償還した。</p>
<p class="ja">資料2(B社債):額面$500,000、年6%(6月30日・12月31日払い)、社債の日付は第1年度1月1日、満期は第5年度12月31日。第1年度5月1日に101+経過利息で発行。プレミアムは発行日から満期まで定額法で償却する。</p>`,
  rows: [
    { label: "Series A issue price on January 1, Year 1(A社債の発行価額)", type: "num", answer: 922783, tol: 5 },
    { label: "Series A interest expense for Year 1(A社債の第1年度支払利息)", type: "num", answer: 92585, tol: 3 },
    { label: "Series A carrying amount on July 1, Year 2, before retirement(償還直前のA社債帳簿価額)", type: "num", answer: 942136, tol: 3 },
    { label: "Loss on extinguishment of Series A bonds(A社債の償還損失)", type: "num", answer: 37864, tol: 3 },
    { label: "Presentation of the extinguishment loss(償還損失の表示)", type: "select", options: ["Extraordinary item, net of tax", "Other comprehensive income", "Income from continuing operations (not extraordinary)", "Adjustment to additional paid-in capital"], answer: "Income from continuing operations (not extraordinary)" },
    { label: "Cash received from issuing Series B bonds on May 1, Year 1(B社債発行時の受取現金)", type: "num", answer: 515000 },
    { label: "Series B interest expense for Year 1(B社債の第1年度支払利息)", type: "num", answer: 19286, tol: 1 },
  ],
  explain: `<p>① 発行価額:$40,000 × 7.72173 + $1,000,000 × 0.61391 = $308,869 + $613,910 ≒ $922,783(係数の端数により$922,779〜$922,783)。</p>
<p>② 6/30 Y1:$922,783 × 5% = $46,139(償却$6,139、簿価$928,922)。12/31 Y1:$928,922 × 5% = $46,446(償却$6,446、簿価$935,368)。第1年度支払利息 = $46,139 + $46,446 = $92,585。</p>
<p>③ 6/30 Y2:$935,368 × 5% = $46,768、償却$6,768 → 簿価$942,136。</p>
<p>④ 償還損失:支払額$1,000,000 × 98% = $980,000 − 簿価$942,136 = $37,864(損失)。</p>
<p>⑤ 債務消滅損益は異常項目ではなく継続事業の損益に含める(ASU 2015-01で異常項目は廃止)。</p>
<p>⑥ B社債:$500,000 × 101% = $505,000 + 経過利息 $500,000 × 6% × 4/12 = $10,000 → $515,000。</p>
<p>⑦ 支払利息:支払利息$15,000 × 2 = $30,000 − 受取経過利息$10,000 = $20,000。プレミアム$5,000を発行日から満期まで56か月で償却し、第1年度は8か月分 $5,000 × 8/56 = $714。$20,000 − $714 = $19,286。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-61", section: "FAR", chapter: "FAR-04", title: "新株予約権付社債と転換社債(ASU 2020-06後)",
  scenario: `<p>Delmar Technologies completed two financings. Delmar has adopted ASU 2020-06. Neither instrument contains embedded features that require bifurcation as derivatives.</p>
<table><tr><th>Exhibit 1 — Bonds with detachable warrants (issued January 1, Year 1)</th><th>Data</th></tr>
<tr><td>Face amount of 10-year bonds ($1,000 each)</td><td>$2,000,000</td></tr>
<tr><td>Detachable warrants attached to each bond</td><td>10 warrants</td></tr>
<tr><td>Total proceeds received</td><td>$2,054,000</td></tr>
<tr><td>Fair value of the bonds without warrants (quoted)</td><td>96</td></tr>
<tr><td>Fair value of each warrant (quoted)</td><td>$8</td></tr>
<tr><td>Each warrant permits purchase of one share of $10 par common stock at</td><td>$30</td></tr></table>
<p>On July 1, Year 2, holders exercised 10,000 of the warrants.</p>
<table><tr><th>Exhibit 2 — Convertible bonds</th><th>Data</th></tr>
<tr><td>Face amount issued January 1, Year 1, at 101</td><td>$1,000,000</td></tr>
<tr><td>Conversion terms</td><td>Each $1,000 bond converts into 40 shares of $1 par common stock</td></tr>
<tr><td>Carrying amount when all bonds were converted on January 1, Year 4</td><td>$1,006,000</td></tr></table>
<p class="ja">Delmar Technologies社は2件の資金調達を行った。ASU 2020-06を適用済みであり、いずれの商品にもデリバティブとして区分すべき組込要素はない。</p>
<p class="ja">資料1(分離型新株予約権付社債、第1年度1月1日発行):10年債の額面$2,000,000(1口$1,000)、1口につき新株予約権10個、受取総額$2,054,000、新株予約権を除いた社債の公正価値96、新株予約権1個の公正価値$8、1個で額面$10の普通株式1株を$30で購入できる。第2年度7月1日に10,000個が行使された。</p>
<p class="ja">資料2(転換社債):第1年度1月1日に額面$1,000,000を101で発行。$1,000につき額面$1の普通株式40株に転換可能。第4年度1月1日に全額転換され、その時点の帳簿価額は$1,006,000であった。</p>`,
  rows: [
    { label: "Method to allocate proceeds of the bonds with detachable warrants(分離型の払込金配分方法)", type: "select", options: ["Allocate all proceeds to the bonds", "Relative fair value method", "Incremental method, valuing the bonds first", "Allocate based on par values"], answer: "Relative fair value method" },
    { label: "Amount credited to APIC — warrants on January 1, Year 1(新株予約権に配分される金額)", type: "num", answer: 158000 },
    { label: "Discount on bonds payable on January 1, Year 1(社債発行差金・割引額)", type: "num", answer: 104000 },
    { label: "Increase in APIC (excess over par) from the July 1, Year 2 warrant exercise(行使によるAPIC増加額)", type: "num", answer: 279000 },
    { label: "Amount of the convertible bond proceeds recorded in equity at issuance(転換社債のうち資本に計上される額)", type: "num", answer: 0 },
    { label: "APIC credited on conversion of the convertible bonds(転換時のAPIC計上額)", type: "num", answer: 966000 },
    { label: "Gain or loss on conversion(転換損益)", type: "select", options: ["Gain equal to carrying amount minus market value of shares", "Loss equal to market value of shares minus carrying amount", "No gain or loss — book value method", "Gain equal to unamortized premium"], answer: "No gain or loss — book value method" },
  ],
  explain: `<p>① 社債と新株予約権の双方の公正価値が分かるので相対的公正価値法で配分する(片方のみ判明なら増分法)。</p>
<p>② 公正価値:社債 $2,000,000 × 96% = $1,920,000、新株予約権 2,000口 × 10個 × $8 = $160,000、合計$2,080,000。新株予約権 = $2,054,000 × 160,000/2,080,000 = $158,000。</p>
<p>③ 社債への配分 = $2,054,000 × 1,920,000/2,080,000 = $1,896,000。割引額 = $2,000,000 − $1,896,000 = $104,000。</p>
<p>④ 行使:現金 10,000 × $30 = $300,000 + 新株予約権APIC取崩 $158,000 × 10,000/20,000 = $79,000 − 資本金 10,000 × $10 = $100,000 → APIC $279,000。</p>
<p>⑤ ASU 2020-06後、区分不要な転換社債は全額を負債として計上する(資本区分は0、受取額$1,010,000が社債+プレミアム)。</p>
<p>⑥ 転換:1,000口 × 40株 = 40,000株 × $1 = $40,000が資本金。APIC = $1,006,000 − $40,000 = $966,000。</p>
<p>⑦ 簿価法(book value method)によるため転換損益は認識しない。</p>`,
});
