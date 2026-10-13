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
