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
