// REG のTBS追加(パススルー事業体・免税団体)

CPA.tbs({
  id: "TBS-REG-70", section: "REG", chapter: "REG-05", title: "試算表からのForm 1065通常事業所得と別記項目・K-1配分",
  scenario: `<p>Alder Partners LP (calendar year, accrual basis) has two partners: <b>Ann</b>, the general partner who manages the business (60% profits/loss interest), and <b>Ben</b>, a limited partner who performs no services (40%). The partnership agreement provides Ann a guaranteed payment of <b>$60,000</b> for services. Ann and Ben are U.S. individuals.</p>
<p><b>Exhibit 1 — Year 2026 trial balance (income statement accounts)</b></p>
<table><tr><th>Account</th><th>Debit</th><th>Credit</th></tr>
<tr><td>Gross receipts</td><td></td><td>$900,000</td></tr>
<tr><td>Cost of goods sold</td><td>$360,000</td><td></td></tr>
<tr><td>Salaries — employees</td><td>$150,000</td><td></td></tr>
<tr><td>Guaranteed payment — Ann (services)</td><td>$60,000</td><td></td></tr>
<tr><td>Rent expense</td><td>$36,000</td><td></td></tr>
<tr><td>Depreciation (MACRS, no §179)</td><td>$24,000</td><td></td></tr>
<tr><td>Business meals (50% deductible)</td><td>$4,000</td><td></td></tr>
<tr><td>Interest income — savings account</td><td></td><td>$4,000</td></tr>
<tr><td>Qualified dividends</td><td></td><td>$6,000</td></tr>
<tr><td>Net §1231 gain</td><td></td><td>$15,000</td></tr>
<tr><td>Net long-term capital gain</td><td></td><td>$8,000</td></tr>
<tr><td>Charitable contributions (cash)</td><td>$5,000</td><td></td></tr>
<tr><td>Tax-exempt municipal bond interest</td><td></td><td>$2,000</td></tr></table>
<p><b>Exhibit 2 — Email from the tax manager:</b> "Please prepare page 1 (ordinary business income) and the K-1 amounts for both partners. Self-employment amounts should be shown before the 92.35% factor."</p>
<p class="ja">Alder Partners LPのパートナーは、事業を運営するジェネラル・パートナーのAnn(損益60%)と役務を提供しないリミテッド・パートナーのBen(40%)である。Annには役務の対価として保証支払$60,000が定められている。証拠資料1は2026年の試算表(損益勘定)、証拠資料2は「1ページ目(通常事業所得)と両パートナーのK-1を作成せよ。自営業所得は92.35%を乗じる前の金額で示すこと」という税務マネージャーのメールである。</p>`,
  rows: [
    { label: "Ordinary business income, Form 1065 page 1(Form 1065の通常事業所得)", type: "num", answer: 268000 },
    { label: "Ann's share of ordinary business income, K-1 Box 1(AnnのK-1 Box 1)", type: "num", answer: 160800 },
    { label: "Ann's net earnings from self-employment, K-1 Box 14(Annの自営業所得)", type: "num", answer: 220800 },
    { label: "Ben's net earnings from self-employment(Benの自営業所得)", type: "num", answer: 0 },
    { label: "Ben's share of net long-term capital gain(Benの長期キャピタル・ゲイン配分額)", type: "num", answer: 3200 },
    { label: "Reporting of the net §1231 gain(§1231純利得の報告方法)", type: "select", options: ["Included in ordinary business income", "Separately stated on Schedule K/K-1", "Reported only on Schedule M-1", "Not reported because it is netted against capital gains"], answer: "Separately stated on Schedule K/K-1" },
    { label: "Treatment of the $2,000 tax-exempt interest(非課税利息$2,000の取扱い)", type: "select", options: ["Included in ordinary business income", "Separately stated; not taxable but increases partners' outside basis", "Separately stated; taxable to the partners as portfolio income", "Ignored for both tax and basis purposes"], answer: "Separately stated; not taxable but increases partners' outside basis" },
    { label: "Treatment of Ann's guaranteed payment(Annの保証支払の取扱い)", type: "select", options: ["Deductible in computing ordinary business income; ordinary and SE income to Ann", "Treated as a distribution that reduces Ann's basis; not deductible", "Separately stated as a portfolio deduction", "Deductible by the partnership but excluded from Ann's SE income"], answer: "Deductible in computing ordinary business income; ordinary and SE income to Ann" },
  ],
  explain: `<p>通常事業所得 = 900,000 − 360,000 − 150,000 − 60,000(保証支払)− 36,000 − 24,000 − 2,000(飲食費の50%)= 268,000。受取利息・配当・§1231利得・キャピタル・ゲイン・寄附金・非課税利息は各パートナーの税額計算で扱いが異なるため別記項目(separately stated)となり、通常事業所得には含めない。</p>
<p>Ann の Box 1 = 268,000 × 60% = 160,800。</p>
<p>Ann の自営業所得 = 通常事業所得の配分額 160,800 + 役務の保証支払 60,000 = 220,800(ジェネラル・パートナーは配分額全体が自営業所得)。</p>
<p>Ben はリミテッド・パートナーで役務の保証支払もないため、自営業所得は 0 である。</p>
<p>Ben の長期キャピタル・ゲイン = 8,000 × 40% = 3,200。</p>
<p>§1231純利得はパートナー段階で他の§1231損益と通算するため別記項目となる。非課税利息は別記され、課税されないが持分の取得価額(outside basis)を増額する。保証支払はパートナーシップの通常事業所得の計算上控除され、Annには通常所得かつ自営業所得として課税される。</p>`,
});

CPA.tbs({
  id: "TBS-REG-71", section: "REG", chapter: "REG-05", title: "持分の取得価額の期中推移(負債の増加・分配・損失制限の順序)",
  scenario: `<p>Carla owns a <b>30%</b> interest in Cedar Partners, a calendar-year partnership. All partnership liabilities are recourse and are shared by the partners in their 30% loss ratio. Carla is fully at risk and the passive activity rules do not apply.</p>
<p><b>Exhibit 1 — Carla's basis workpaper (beginning balance)</b></p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Outside basis, January 1, 2026 (includes 30% share of $60,000 of liabilities)</td><td>$40,000</td></tr>
<tr><td>Partnership liabilities, December 31, 2026</td><td>$100,000</td></tr></table>
<p><b>Exhibit 2 — Carla's 2026 Schedule K-1 (excerpt)</b></p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Ordinary business loss</td><td>($60,000)</td></tr>
<tr><td>Net long-term capital gain</td><td>$3,000</td></tr>
<tr><td>Tax-exempt interest income</td><td>$1,500</td></tr>
<tr><td>Nondeductible expenses (penalties)</td><td>($1,000)</td></tr>
<tr><td>Cash distribution (current, nonliquidating)</td><td>$6,000</td></tr></table>
<p class="ja">CarlaはCedar Partnersの30%持分を保有する。負債はすべてリコース負債で、損失負担割合30%で按分される。Carlaは全額アットリスクで、パッシブ活動規定は適用されないものとする。2026年1月1日の持分の取得価額は$40,000(期首負債$60,000の30%を含む)、2026年12月31日のパートナーシップ負債は$100,000である。K-1の内容は、通常事業損失($60,000)、長期キャピタル・ゲイン$3,000、非課税利息$1,500、損金不算入費用(罰金)($1,000)、現金分配(非清算)$6,000である。</p>`,
  rows: [
    { label: "Increase in basis from Carla's share of the liability increase(負債増加による取得価額の増加額)", type: "num", answer: 12000 },
    { label: "Basis after increases, before distributions and decreases(増加項目加算後・分配前の取得価額)", type: "num", answer: 56500 },
    { label: "Gain recognized by Carla on the cash distribution(現金分配による認識利得)", type: "num", answer: 0 },
    { label: "Ordinary loss deductible by Carla in 2026(2026年に控除できる通常損失)", type: "num", answer: 49500 },
    { label: "Loss suspended and carried forward(繰り越される停止損失)", type: "num", answer: 10500 },
    { label: "Outside basis, December 31, 2026(2026年末の持分の取得価額)", type: "num", answer: 0 },
    { label: "Order of basis adjustments under the regulations(取得価額調整の順序)", type: "select", options: ["Losses, then distributions, then increases", "Increases, then distributions, then nondeductible expenses, then losses", "Distributions, then increases, then losses, then nondeductible expenses", "Increases, then losses, then distributions"], answer: "Increases, then distributions, then nondeductible expenses, then losses" },
    { label: "If Carla's share of liabilities had instead decreased by $12,000(負債負担額が$12,000減少した場合の取扱い)", type: "select", options: ["Ignored until the partnership is liquidated", "Treated as a deemed cash distribution under §752(b)", "Treated as ordinary income under §751", "Treated as a deemed contribution under §752(a)"], answer: "Treated as a deemed cash distribution under §752(b)" },
  ],
  explain: `<p>負債負担額:期首 60,000 × 30% = 18,000、期末 100,000 × 30% = 30,000。増加額 12,000 は§752(a)のみなし出資として取得価額を増額する。</p>
<p>増加項目加算後 = 40,000 + 12,000 + 3,000 + 1,500 = 56,500。</p>
<p>現金分配 6,000 は取得価額 56,500 以下なので利得は認識せず、取得価額は 50,500 となる。</p>
<p>次に損金不算入費用 1,000 を減算して 49,500。最後に損失 60,000 を減算するが、取得価額を超える部分は控除できない。控除可能額 49,500、停止損失(繰越し)= 60,000 − 49,500 = 10,500。期末の取得価額は 0 となる。</p>
<p>順序は「増加項目 → 分配 → 損金不算入費用 → 損失」であり、分配を損失より先に減算するため損失が制限されやすい。負債負担額の減少は§752(b)により現金のみなし分配として扱われ、取得価額を超えれば利得を認識する。</p>`,
});

CPA.tbs({
  id: "TBS-REG-72", section: "REG", chapter: "REG-05", title: "非清算分配と清算分配の取得価額・損益の比較",
  scenario: `<p>Three partners of Dogwood Partners received distributions on December 31, 2026. Each partner's outside basis shown is immediately before the distribution, after all 2026 operating adjustments. The partnership has no §754 election, and no distribution triggers §751(b) or §737. No marketable securities were distributed. All partners have held their interests for more than one year.</p>
<p><b>Exhibit — Distribution schedule</b></p>
<table><tr><th>Partner / type</th><th>Outside basis</th><th>Property received</th><th>Partnership's inside basis</th><th>FMV</th></tr>
<tr><td>Dana — current (nonliquidating)</td><td>$50,000</td><td>Cash<br>Inventory<br>Land</td><td>$10,000<br>$15,000<br>$40,000</td><td>$10,000<br>$20,000<br>$55,000</td></tr>
<tr><td>Eli — liquidating</td><td>$70,000</td><td>Cash<br>Inventory</td><td>$12,000<br>$18,000</td><td>$12,000<br>$25,000</td></tr>
<tr><td>Faye — liquidating</td><td>$29,000</td><td>Cash<br>Equipment<br>Land</td><td>$8,000<br>$12,000<br>$30,000</td><td>$8,000<br>$12,000<br>$24,000</td></tr></table>
<p class="ja">Dogwood Partnersの3名のパートナーが2026年12月31日に分配を受けた。表示の取得価額は分配直前(2026年の営業上の調整後)の金額である。§754選択はなく、§751(b)・§737の適用もなく、市場性有価証券の分配もない。全員1年超保有している。Danaは非清算分配で現金$10,000、棚卸資産(内部簿価$15,000、時価$20,000)、土地(内部簿価$40,000、時価$55,000)を受け取った(持分の取得価額$50,000)。Eliは清算分配で現金$12,000と棚卸資産(内部簿価$18,000、時価$25,000)を受け取った(取得価額$70,000)。Fayeは清算分配で現金$8,000、設備(内部簿価$12,000、時価$12,000)、土地(内部簿価$30,000、時価$24,000)を受け取った(取得価額$29,000)。</p>`,
  rows: [
    { label: "Dana's basis in the inventory(Danaの棚卸資産の取得価額)", type: "num", answer: 15000 },
    { label: "Dana's basis in the land(Danaの土地の取得価額)", type: "num", answer: 25000 },
    { label: "Dana's remaining outside basis(Danaの分配後の持分の取得価額)", type: "num", answer: 0 },
    { label: "Loss recognized by Eli(Eliが認識する損失)", type: "num", answer: 40000 },
    { label: "Character of Eli's loss(Eliの損失の性質)", type: "select", options: ["Ordinary loss", "Capital loss", "§1231 loss", "No loss — added to the basis of the inventory"], answer: "Capital loss" },
    { label: "Faye's basis in the equipment(Fayeの設備の取得価額)", type: "num", answer: 7000 },
    { label: "Faye's basis in the land(Fayeの土地の取得価額)", type: "num", answer: 14000 },
    { label: "Dana's holding period for the land(Danaの土地の保有期間)", type: "select", options: ["Begins on the distribution date", "Includes the partnership's holding period", "Equals Dana's holding period in her partnership interest", "Begins on the date the land is sold"], answer: "Includes the partnership's holding period" },
  ],
  explain: `<p><b>Dana(非清算分配)</b>:まず現金で 50,000 − 10,000 = 40,000。次に棚卸資産は内部簿価 15,000 を引き継ぎ、残り 25,000。土地は内部簿価 40,000 と残りの取得価額 25,000 の小さい方で 25,000。分配後の取得価額は 0。非清算分配では現金が取得価額を超えない限り損益を認識せず、損失は認識できない。</p>
<p><b>Eli(清算分配)</b>:現金・未実現債権・棚卸資産のみを受け取った場合は損失を認識できる。損失 = 70,000 − 12,000 − 18,000(棚卸資産は内部簿価を超えて増額できない)= 40,000。持分の処分による損失なのでキャピタル・ロスである。</p>
<p><b>Faye(清算分配)</b>:現金控除後 29,000 − 8,000 = 21,000 を設備と土地に配分する。内部簿価合計 42,000 なので減額 21,000。まず含み損のある資産に含み損まで配分:土地 30,000 − 24,000 = 6,000 減額し土地 24,000。残り 15,000 を調整後簿価比(設備 12,000:土地 24,000 = 1:2)で配分:設備 5,000、土地 10,000。設備 12,000 − 5,000 = 7,000、土地 24,000 − 10,000 = 14,000(合計 21,000)。</p>
<p>分配資産の保有期間はパートナーシップの保有期間を通算する(§735(b))。</p>`,
});

CPA.tbs({
  id: "TBS-REG-73", section: "REG", chapter: "REG-05", title: "パートナーシップ持分の売却と§751ホット・アセット",
  scenario: `<p>On December 31, 2026, Gus sold his <b>25%</b> interest in Gingko Partners (held for six years) to Hana for <b>$90,000</b> cash. Hana also assumed Gus's share of partnership liabilities. Gus's outside basis immediately before the sale (after all 2026 adjustments) was <b>$70,000</b>, which equals his 25% share of inside basis. Gingko is a cash-basis partnership and has no §754 election.</p>
<p><b>Exhibit — Gingko Partners balance sheet, December 31, 2026</b></p>
<table><tr><th>Asset</th><th>Adjusted basis</th><th>FMV</th></tr>
<tr><td>Cash</td><td>$40,000</td><td>$40,000</td></tr>
<tr><td>Accounts receivable</td><td>$0</td><td>$60,000</td></tr>
<tr><td>Inventory</td><td>$80,000</td><td>$100,000</td></tr>
<tr><td>Equipment (cost $100,000; accumulated depreciation $60,000)</td><td>$40,000</td><td>$70,000</td></tr>
<tr><td>Land (investment)</td><td>$120,000</td><td>$170,000</td></tr>
<tr><td><b>Total</b></td><td><b>$280,000</b></td><td><b>$440,000</b></td></tr>
<tr><th>Liabilities and capital</th><th></th><th></th></tr>
<tr><td>Liabilities (shared by profit ratio)</td><td>$80,000</td><td>$80,000</td></tr>
<tr><td>Partners' capital</td><td>$200,000</td><td>$360,000</td></tr></table>
<p class="ja">Gusは2026年12月31日、6年間保有したGingko Partnersの25%持分をHanaに現金$90,000で売却し、HanaはGusの負債負担分も引き受けた。売却直前のGusの持分の取得価額は$70,000(内部簿価の25%と一致)。Gingkoは現金主義で§754選択はない。貸借対照表:現金(簿価・時価$40,000)、売掛金(簿価$0・時価$60,000)、棚卸資産(簿価$80,000・時価$100,000)、設備(取得原価$100,000・減価償却累計額$60,000、簿価$40,000・時価$70,000)、土地(簿価$120,000・時価$170,000)。負債$80,000(利益割合で按分)、資本(簿価$200,000・時価$360,000)。</p>`,
  rows: [
    { label: "Gus's amount realized(Gusの実現額)", type: "num", answer: 110000 },
    { label: "Gus's total gain on the sale(売却による利得総額)", type: "num", answer: 40000 },
    { label: "Ordinary income under §751(a)(§751(a)による通常所得)", type: "num", answer: 27500 },
    { label: "Long-term capital gain(長期キャピタル・ゲイン)", type: "num", answer: 12500 },
    { label: "Treatment of the §1245 depreciation recapture in the equipment(設備の§1245減価償却リキャプチャーの取扱い)", type: "select", options: ["Ignored because the partnership did not sell the equipment", "Treated as an unrealized receivable (hot asset)", "Treated as §1231 gain", "Treated as unrecaptured §1250 gain taxed at 25%"], answer: "Treated as an unrealized receivable (hot asset)" },
    { label: "Must inventory be substantially appreciated to be a hot asset in this sale?(本件売却で棚卸資産がホット・アセットとなるには著しい値上がりが必要か)", type: "select", options: ["Yes — FMV must exceed 120% of basis", "No — the substantial-appreciation test applies only to §751(b) distributions", "Yes — FMV must exceed 150% of basis", "No — inventory is never a hot asset"], answer: "No — the substantial-appreciation test applies only to §751(b) distributions" },
    { label: "Hana's initial outside basis(Hanaの当初の持分の取得価額)", type: "num", answer: 110000 },
  ],
  explain: `<p>実現額 = 現金 90,000 + 負債負担分の免除 80,000 × 25% = 20,000 → 110,000。</p>
<p>利得総額 = 110,000 − 70,000 = 40,000。</p>
<p>§751(a)のホット・アセット(未実現債権と棚卸資産)に係る持分相当の利得は通常所得となる。売掛金 60,000 − 0 = 60,000、棚卸資産 100,000 − 80,000 = 20,000、設備の§1245リキャプチャー:時価 70,000 は取得原価 100,000 以下なので含み益 30,000 全額がリキャプチャー(未実現債権扱い)。合計 110,000 × 25% = 27,500。</p>
<p>キャピタル・ゲイン = 40,000 − 27,500 = 12,500(土地の含み益 50,000 × 25% と一致)。6年保有なので長期。</p>
<p>売却(§751(a))では棚卸資産の著しい値上がり要件は不要で、120%テストは§751(b)の不均衡分配にのみ適用される。</p>
<p>Hanaの取得価額 = 支払現金 90,000 + 引き受けた負債負担分 20,000 = 110,000。</p>`,
});

CPA.tbs({
  id: "TBS-REG-74", section: "REG", chapter: "REG-05", title: "S法人の適格要件・選択・終了とチェック・ザ・ボックスの判定",
  scenario: `<p>You are reviewing client files for a tax engagement. All entities are domestic and calendar-year. Unless stated, each corporation meets all S corporation requirements other than the fact described. Assume a corporation may have no more than <b>100</b> shareholders (members of a family are treated as one shareholder) and Form 2553 must be filed no later than the 15th day of the third month of the tax year for the election to be effective for that year.</p>
<p><b>Exhibit — Client facts</b></p>
<table><tr><th>Client</th><th>Fact</th></tr>
<tr><td>1. Ivy Corp.</td><td>Has 120 individual shareholders, all lineal descendants (and their spouses) of a common ancestor within six generations.</td></tr>
<tr><td>2. Juniper Corp.</td><td>One of its 12 shareholders is a nonresident alien individual.</td></tr>
<tr><td>3. Kale Corp.</td><td>Has voting and nonvoting common stock with identical distribution and liquidation rights.</td></tr>
<tr><td>4. Laurel Corp.</td><td>A C corporation since 2018; filed Form 2553 on March 10, 2026, with all shareholders' consents, requesting S status for 2026.</td></tr>
<tr><td>5. Maple Inc.</td><td>An S corporation with accumulated E&amp;P from its C years; passive investment income exceeded 25% of gross receipts in 2023, 2024, and 2025.</td></tr>
<tr><td>6. Nutmeg Inc.</td><td>Its S election was revoked effective January 1, 2024. It now wants to re-elect S status without IRS consent.</td></tr>
<tr><td>7. Oak LLC</td><td>A newly formed LLC with two individual members; it filed no Form 8832.</td></tr></table>
<p class="ja">税務業務のクライアント資料を検討している。すべて内国・暦年の事業体であり、記載された事実以外はS法人の要件を満たすものとする。株主数の上限は100名(家族は1名とみなす)、Form 2553は課税年度の3か月目の15日までに提出すればその年度から効力を生じる。1. Ivy社:株主は120名の個人で、全員6世代以内の共通の祖先の直系子孫(及びその配偶者)。2. Juniper社:12名の株主のうち1名が非居住外国人。3. Kale社:分配・残余財産の権利が同一の議決権株式と無議決権株式がある。4. Laurel社:2018年からC法人で、2026年3月10日に全株主の同意付きでForm 2553を提出し2026年からのS法人を求めた。5. Maple社:C法人時代の累積E&Pがあり、2023〜2025年の受動的投資所得が総収入の25%を超えた。6. Nutmeg社:S選択を2024年1月1日付で撤回し、IRSの同意なしに再選択したい。7. Oak LLC:個人2名をメンバーとする新設LLCで、Form 8832を提出していない。</p>`,
  rows: [
    { label: "1. Ivy Corp. — S corporation eligibility(S法人の適格性)", type: "select", options: ["Eligible", "Not eligible"], answer: "Eligible" },
    { label: "2. Juniper Corp. — S corporation eligibility(S法人の適格性)", type: "select", options: ["Eligible", "Not eligible"], answer: "Not eligible" },
    { label: "3. Kale Corp. — S corporation eligibility(S法人の適格性)", type: "select", options: ["Eligible", "Not eligible"], answer: "Eligible" },
    { label: "4. Laurel Corp. — first year S election is effective(S選択の効力発生年度)", type: "select", options: ["2026", "2027", "Effective on March 10, 2026", "Not effective without IRS consent"], answer: "2026" },
    { label: "5. Maple Inc. — effect of the passive investment income(受動的投資所得の影響)", type: "select", options: ["No effect; only a tax on excess passive income", "S election terminates effective January 1, 2026", "S election terminated retroactively to January 1, 2023", "S election terminates effective December 31, 2026"], answer: "S election terminates effective January 1, 2026" },
    { label: "6. Nutmeg Inc. — earliest year for re-election without IRS consent(IRSの同意なしに再選択できる最初の年度)", type: "select", options: ["2026", "2027", "2028", "2029"], answer: "2029" },
    { label: "7. Oak LLC — default federal tax classification(デフォルトの税務上の区分)", type: "select", options: ["Disregarded entity", "Partnership", "C corporation", "S corporation"], answer: "Partnership" },
  ],
  explain: `<p>1. 共通の祖先から6世代以内の家族は1名の株主とみなされるため、120名でも株主数は1名となり適格である。</p>
<p>2. 非居住外国人は株主になれないため不適格である。</p>
<p>3. 1種類株式要件は分配・残余財産の権利が同一であればよく、議決権の差異は認められるため適格である。</p>
<p>4. 3月10日は3か月目の15日(3月15日)以前なので2026年1月1日から効力を生じる。</p>
<p>5. 累積E&Pを有するS法人の受動的投資所得が3年連続で総収入の25%を超えると、4年目の初日(2026年1月1日)にS選択が終了する。</p>
<p>6. 撤回・終了後は終了が効力を生じた年度から5課税年度(2024〜2028年)は再選択できないため、IRSの同意なしでは2029年が最初となる。</p>
<p>7. メンバーが2名以上の国内適格事業体はForm 8832で法人課税を選択しない限り、デフォルトでパートナーシップとして扱われる(1名なら無視される事業体)。</p>`,
});

CPA.tbs({
  id: "TBS-REG-75", section: "REG", chapter: "REG-05", title: "S法人株主の株式・貸付金取得価額と損失制限の順序・回復",
  scenario: `<p>Kai owns <b>50%</b> of Kappa Inc., a calendar-year S corporation. In 2025 Kai lent Kappa <b>$20,000</b> evidenced by a written note; his debt basis was $20,000 at January 1, 2026. Kai also personally guaranteed a <b>$50,000</b> bank loan to Kappa in 2026 but has made no payment on the guarantee. Kai is at risk and materially participates.</p>
<p><b>Exhibit 1 — Kai's stock basis, January 1, 2026:</b> $18,000</p>
<p><b>Exhibit 2 — Kai's Schedule K-1 items</b></p>
<table><tr><th>Item</th><th>2026</th><th>2027</th></tr>
<tr><td>Ordinary business income (loss)</td><td>($45,000)</td><td>$12,000</td></tr>
<tr><td>Net long-term capital gain</td><td>$3,000</td><td>—</td></tr>
<tr><td>Tax-exempt interest</td><td>$2,000</td><td>—</td></tr>
<tr><td>Nondeductible expenses (fines)</td><td>($1,000)</td><td>—</td></tr>
<tr><td>Cash distributions</td><td>$4,000</td><td>—</td></tr></table>
<p>Kappa made no repayment on Kai's note in 2026 or 2027.</p>
<p class="ja">KaiはS法人Kappa社(暦年)の株式50%を保有する。2025年に$20,000を書面の約束手形で貸し付けており、2026年1月1日の貸付金取得価額は$20,000である。2026年には同社の銀行借入$50,000を個人保証したが、保証債務の支払はしていない。Kaiはアットリスクで、重要な関与をしている。2026年1月1日の株式取得価額は$18,000。K-1の内容:2026年は通常事業損失($45,000)、長期キャピタル・ゲイン$3,000、非課税利息$2,000、損金不算入費用(罰金)($1,000)、現金分配$4,000。2027年は通常事業所得$12,000のみ。2026年・2027年に貸付金の返済はない。</p>`,
  rows: [
    { label: "Stock basis available for the 2026 loss (after increases, distributions, and nondeductible expenses)(2026年の損失に充当できる株式取得価額)", type: "num", answer: 18000 },
    { label: "Ordinary loss deductible by Kai in 2026(2026年に控除できる通常損失)", type: "num", answer: 38000 },
    { label: "Suspended loss carried to 2027(2027年に繰り越される停止損失)", type: "num", answer: 7000 },
    { label: "Debt basis, December 31, 2026(2026年末の貸付金取得価額)", type: "num", answer: 0 },
    { label: "Loss deductible by Kai in 2027 from the carryover(2027年に控除できる繰越損失)", type: "num", answer: 7000 },
    { label: "Debt basis, December 31, 2027(2027年末の貸付金取得価額)", type: "num", answer: 5000 },
    { label: "Effect of Kai's guarantee of the $50,000 bank loan(銀行借入保証の影響)", type: "select", options: ["Increases debt basis by $50,000", "Increases stock basis by $25,000", "No basis increase until Kai makes payment on the guarantee", "Increases debt basis by $25,000 (50% share)"], answer: "No basis increase until Kai makes payment on the guarantee" },
    { label: "If Kappa later repays the note when debt basis is less than face(貸付金取得価額が額面未満で手形が返済された場合の差額の性質)", type: "select", options: ["Not taxable; return of capital", "Capital gain because the debt is a written note", "Ordinary income regardless of form", "Reduces stock basis instead"], answer: "Capital gain because the debt is a written note" },
  ],
  explain: `<p>2026年:株式取得価額 18,000 + 3,000 + 2,000 = 23,000 → 分配 4,000 減算 19,000 → 損金不算入費用 1,000 減算 18,000(損失に充当可能な株式取得価額)。</p>
<p>損失 45,000 はまず株式取得価額 18,000 を 0 まで減らし、次に貸付金取得価額 20,000 を 0 まで減らす。控除可能額 = 18,000 + 20,000 = 38,000、停止損失 = 45,000 − 38,000 = 7,000。2026年末の貸付金取得価額は 0。</p>
<p>2027年:繰越損失 7,000 は2027年の損失として扱われる。所得 12,000 − 損失 7,000 = 純増加額 5,000。所得 12,000 が取得価額を回復させるので繰越損失 7,000 は全額控除でき、純増加額 5,000 はまず減額された貸付金取得価額の回復に充てる(株式より先)。2027年末の貸付金取得価額 5,000、株式取得価額 0。</p>
<p>保証は経済的支出(actual economic outlay)がないため取得価額を増やさない。支払った時点で貸付金取得価額となる。書面の約束手形を取得価額未満で返済されると差額は利得となり、書面の手形(資本資産)ならキャピタル・ゲイン、オープン・アカウントなら通常所得となる。</p>`,
});

CPA.tbs({
  id: "TBS-REG-76", section: "REG", chapter: "REG-05", title: "累積E&PのあるS法人の分配(AAA・配当・資本の払戻し)",
  scenario: `<p>Mu Corp. converted from a C corporation to an S corporation in 2022. Its sole shareholder is Pat. No election under §1368(e)(3) has been made. There is no previously taxed income.</p>
<p><b>Exhibit 1 — Balances, January 1, 2026</b></p>
<table><tr><th>Account</th><th>Amount</th></tr>
<tr><td>Accumulated adjustments account (AAA)</td><td>$20,000</td></tr>
<tr><td>Accumulated E&amp;P (from C corporation years)</td><td>$30,000</td></tr>
<tr><td>Pat's stock basis</td><td>$50,000</td></tr></table>
<p><b>Exhibit 2 — 2026 activity</b></p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Ordinary business income</td><td>$40,000</td></tr>
<tr><td>Tax-exempt interest income</td><td>$5,000</td></tr>
<tr><td>Nondeductible expenses (fines; unrelated to tax-exempt income)</td><td>$3,000</td></tr>
<tr><td>Cash distributions to Pat (December 2026)</td><td>$90,000</td></tr></table>
<p class="ja">Mu社は2022年にC法人からS法人へ転換した。株主はPat 1名で、§1368(e)(3)の選択はなく、既課税所得(PTI)もない。2026年1月1日残高:AAA $20,000、累積E&P(C法人時代)$30,000、Patの株式取得価額$50,000。2026年の活動:通常事業所得$40,000、非課税利息$5,000、損金不算入費用(罰金、非課税所得とは無関係)$3,000、Patへの現金分配(2026年12月)$90,000。</p>`,
  rows: [
    { label: "AAA available before the distribution(分配前のAAA)", type: "num", answer: 57000 },
    { label: "Portion of distribution nontaxable from AAA(AAAからの非課税分配額)", type: "num", answer: 57000 },
    { label: "Portion taxable as a dividend(配当として課税される額)", type: "num", answer: 30000 },
    { label: "Portion that is a nontaxable return of remaining basis(残りの取得価額の払戻し額)", type: "num", answer: 3000 },
    { label: "Capital gain recognized by Pat(Patが認識するキャピタル・ゲイン)", type: "num", answer: 0 },
    { label: "Pat's stock basis, December 31, 2026(2026年末のPatの株式取得価額)", type: "num", answer: 32000 },
    { label: "Effect of the tax-exempt interest on AAA(非課税利息のAAAへの影響)", type: "select", options: ["Increases AAA", "No effect on AAA (increases OAA); increases stock basis", "Decreases AAA", "No effect on AAA or stock basis"], answer: "No effect on AAA (increases OAA); increases stock basis" },
    { label: "How could Mu distribute E&P before AAA?(AAAより先にE&Pを分配するには)", type: "select", options: ["Not permitted", "Elect under §1368(e)(3) with consent of all affected shareholders", "Automatic if E&P exceeds AAA", "File Form 8832"], answer: "Elect under §1368(e)(3) with consent of all affected shareholders" },
  ],
  explain: `<p>AAA = 20,000 + 40,000 − 3,000 = 57,000(非課税利息はAAAではなくOAAに計上)。</p>
<p>分配 90,000 の配分:①AAA 57,000 は非課税(取得価額を減額)、②累積E&P 30,000 は配当(適格配当)、③残り 90,000 − 57,000 − 30,000 = 3,000 は取得価額の払戻し。</p>
<p>株式取得価額:50,000 + 40,000 + 5,000 = 95,000。分配のうち配当以外の 60,000 を減算(分配は損金不算入費用より先)→ 35,000。損金不算入費用 3,000 を減算 → 32,000。払戻し 3,000 は取得価額の範囲内なのでキャピタル・ゲインは 0。</p>
<p>非課税利息はAAAに影響しないが(OAA)、株式取得価額は増額する。E&Pを先に分配したい場合は、影響を受ける全株主の同意を得て§1368(e)(3)の選択を行う。</p>`,
});
