// REG のTBS追加(法人の§291リキャプチャー・§1244/無価値証券/非事業貸倒れ・§121・§197/創業費、Form 1120とM-1/M-2・資本損失の繰戻し・見積納税・E&P・§302償還・清算とAET/PHC)

CPA.tbs({
  id: "TBS-REG-61", section: "REG", chapter: "REG-04", title: "法人による事業用不動産売却と§291リキャプチャー(20%の通常所得化)",
  scenario: `<p>Atlas Corp., a calendar-year C corporation, sold the following real property used in its trade or business in 2026. All property was held more than one year, all buildings were depreciated straight-line, and Atlas had no other §1231 transactions and no nonrecaptured net §1231 losses from prior years. The corporate tax rate is a flat 21%.</p>
<table><tr><th>Property</th><th>Original cost</th><th>Accumulated depreciation</th><th>Selling price</th></tr>
<tr><td>Warehouse building (nonresidential real property)</td><td>$900,000</td><td>$230,000</td><td>$1,050,000</td></tr>
<tr><td>Land under the warehouse</td><td>$150,000</td><td>—</td><td>$200,000</td></tr>
<tr><td>Office building (nonresidential real property)</td><td>$500,000</td><td>$120,000</td><td>$440,000</td></tr></table>
<p><b>Email from the controller:</b> "Since we used straight-line depreciation, there is no recapture on the buildings, and the entire gain is §1231 gain."</p>
<p class="ja">暦年課税のC法人Atlas社は、2026年に事業用不動産を売却した。いずれも1年超保有で、建物はすべて定額法で償却している。他の§1231取引や過年度の未リキャプチャー§1231純損失はない。法人税率は21%の単一税率である。倉庫建物(非住宅用不動産):取得原価$900,000、減価償却累計額$230,000、売却価額$1,050,000。倉庫の土地:取得原価$150,000、売却価額$200,000。事務所建物(非住宅用不動産):取得原価$500,000、減価償却累計額$120,000、売却価額$440,000。経理部長のメール:「定額法なので建物にリキャプチャーはなく、利得の全額が§1231利得になる。」</p>`,
  rows: [
    { label: "Realized gain on the warehouse building(倉庫建物の実現利得)", type: "num", answer: 380000 },
    { label: "§291 ordinary income on the warehouse building(倉庫建物の§291通常所得)", type: "num", answer: 46000 },
    { label: "§291 ordinary income on the office building(事務所建物の§291通常所得)", type: "num", answer: 12000 },
    { label: "Net §1231 gain for 2026 (all three properties)(2026年の§1231純利得)", type: "num", answer: 432000 },
    { label: "Total federal income tax attributable to these sales(これらの売却に係る連邦法人税額)", type: "num", answer: 102900 },
    { label: "Evaluation of the controller's email(経理部長のメールの評価)", type: "select", options: ["Correct — straight-line real property has no recapture for any taxpayer", "Incorrect — §1245 recaptures all depreciation on the buildings as ordinary income", "Incorrect — for a C corporation §291 treats 20% of the lesser of depreciation taken or the gain as ordinary income", "Incorrect — the gain is unrecaptured §1250 gain taxed at 25%"], answer: "Incorrect — for a C corporation §291 treats 20% of the lesser of depreciation taken or the gain as ordinary income" },
    { label: "If an individual had sold the warehouse building, the $230,000 of depreciation would be(個人が倉庫建物を売却した場合の減価償却相当額$230,000の扱い)", type: "select", options: ["Ordinary income", "Unrecaptured §1250 gain taxed at a maximum 25% rate", "Excluded from income", "28% rate gain"], answer: "Unrecaptured §1250 gain taxed at a maximum 25% rate" },
  ],
  explain: `<p>倉庫建物:調整後取得価額 = 900,000 − 230,000 = 670,000。実現利得 = 1,050,000 − 670,000 = 380,000。</p>
<p>§291:C法人は、建物の減価償却費(§1245であれば取り戻される額)と利得のいずれか小さい方の20%を通常所得とする。倉庫:20% × min(230,000, 380,000) = 46,000。残り334,000が§1231利得。</p>
<p>事務所建物:調整後取得価額380,000、利得 = 440,000 − 380,000 = 60,000。§291 = 20% × min(120,000, 60,000) = 12,000。残り48,000が§1231利得。</p>
<p>土地は減価償却がないので利得50,000(200,000 − 150,000)全額が§1231利得。§1231純利得 = 334,000 + 50,000 + 48,000 = 432,000。</p>
<p>法人には資本利得の優遇税率がないため、通常所得58,000と§1231利得432,000の合計490,000 × 21% = 102,900。</p>
<p>経理部長の見解は誤りで、定額法でも法人には§291が適用される。個人の場合は通常所得のリキャプチャーはなく、償却相当額230,000は最高25%の未リキャプチャー§1250利得となる。</p>`,
});

CPA.tbs({
  id: "TBS-REG-62", section: "REG", chapter: "REG-04", title: "§1244株式の損失・無価値証券・非事業貸倒れと資本損失の繰越",
  scenario: `<p>Grace and Henry Lowe file a joint 2026 return. Their CPA's workpaper lists the following items. They have no other capital gains or losses and no capital loss carryovers.</p>
<table><tr><th>#</th><th>Item</th></tr>
<tr><td>1</td><td>Grace bought 1,000 shares of Startup Inc. directly from the corporation at original issuance in 2023 for $180,000. Startup qualified as a small business corporation (capital received ≤ $1,000,000) and met the gross receipts test. The stock became wholly worthless in August 2026.</td></tr>
<tr><td>2</td><td>Henry bought shares of a publicly traded company on November 15, 2025 for $12,000. The company went bankrupt and the shares became wholly worthless in March 2026.</td></tr>
<tr><td>3</td><td>In 2024 Henry made a bona fide $25,000 personal loan to a friend, evidenced by a note. In 2026 the friend died insolvent and the loan became totally worthless.</td></tr>
<tr><td>4</td><td>Grace loaned $10,000 to her cousin in 2025 (bona fide, nonbusiness). In 2026 it was determined that 40% of the loan will not be repaid; the cousin continues to pay the rest.</td></tr>
<tr><td>5</td><td>Long-term capital gain distributions from a mutual fund: $20,000.</td></tr></table>
<p>The §1244 ordinary loss limit is $100,000 on a joint return ($50,000 otherwise); the $3,000 annual capital loss limit is not indexed.</p>
<p class="ja">Lowe夫妻は2026年に夫婦合算で申告する。他の資本損益や繰越損失はない。(1)Graceは2023年にStartup社から新規発行株式1,000株を$180,000で直接取得した。同社は小規模事業法人(受入資本$1,000,000以下)の要件と総収入要件を満たす。株式は2026年8月に完全に無価値となった。(2)Henryは2025年11月15日に上場株式を$12,000で取得したが、発行会社が破産し2026年3月に完全に無価値となった。(3)Henryは2024年に友人へ$25,000の真正な個人的貸付けを行った(手形あり)。2026年に友人が債務超過で死亡し、全額回収不能となった。(4)Graceは2025年にいとこへ$10,000を貸し付けた(真正・非事業)。2026年に40%が回収不能と判明したが、残りの返済は続いている。(5)投資信託からの長期キャピタルゲイン分配$20,000。§1244の通常損失限度は夫婦合算で$100,000(それ以外は$50,000)、資本損失の年間控除限度$3,000はインフレ調整されない。</p>`,
  rows: [
    { label: "Ordinary loss on the Startup Inc. stock (§1244)(Startup株式の通常損失)", type: "num", answer: 100000 },
    { label: "Capital loss on the Startup Inc. stock(Startup株式の資本損失)", type: "num", answer: 80000 },
    { label: "Holding period character of the loss on Henry's public stock (item 2)(項目2の損失の保有期間区分)", type: "select", options: ["Short-term, because the stock became worthless in March 2026", "Long-term, because worthless securities are treated as sold on the last day of the tax year", "Ordinary loss under §165(g)", "Not deductible until the bankruptcy is closed"], answer: "Long-term, because worthless securities are treated as sold on the last day of the tax year" },
    { label: "Deduction allowed in 2026 for the partially worthless loan to the cousin (item 4)(項目4の部分的貸倒れの控除額)", type: "num", answer: 0 },
    { label: "Net capital loss deducted against ordinary income in 2026(2026年に通常所得から控除する資本損失)", type: "num", answer: 3000 },
    { label: "Short-term capital loss carryover to 2027(2027年への短期資本損失の繰越額)", type: "num", answer: 22000 },
    { label: "Long-term capital loss carryover to 2027(2027年への長期資本損失の繰越額)", type: "num", answer: 72000 },
    { label: "Character of the bad debt loss on the loan to the friend (item 3)(項目3の貸倒損失の性質)", type: "select", options: ["Ordinary loss", "Short-term capital loss", "Long-term capital loss", "Nondeductible personal loss"], answer: "Short-term capital loss" },
  ],
  explain: `<p>(1)§1244株式:損失180,000のうち夫婦合算の限度100,000が通常損失、残り80,000は資本損失。無価値証券は課税年度末日(2026年12月31日)に売却したものとみなされ、2023年取得なので長期資本損失である。</p>
<p>(2)上場株式:みなし売却日は2026年12月31日で、2025年11月15日からの保有は1年超となるため長期資本損失12,000。</p>
<p>(3)非事業貸倒れは、全額が無価値になった年に短期資本損失として扱う(保有期間を問わない)。短期資本損失25,000。</p>
<p>(4)非事業債権の部分的な貸倒れは控除できない。控除額0。</p>
<p>ネッティング:短期 = −25,000。長期 = −80,000 − 12,000 + 20,000 = −72,000。純資本損失97,000のうち3,000を控除する。控除はまず短期損失から充当されるので、繰越は短期 25,000 − 3,000 = 22,000、長期72,000(合計94,000)。繰越損失は無期限に繰り越され、性質を保持する。</p>`,
});

CPA.tbs({
  id: "TBS-REG-63", section: "REG", chapter: "REG-04", title: "主たる住居の売却(§121):減価償却部分の課税と転勤による部分的除外",
  scenario: `<p><b>Exhibit 1 — Sam and Tia Novak (married filing jointly).</b> The Novaks bought their principal residence in January 2019 for $400,000 and added a $50,000 kitchen remodel in 2020. From 2021 through 2025 Sam used a room inside the house exclusively as a home office for his consulting business and claimed $8,000 of depreciation on it. Both spouses owned and lived in the home continuously until it was sold in July 2026 for $1,100,000. Selling expenses (commissions and closing costs) were $60,000. Neither spouse excluded gain on another home within the prior two years.</p>
<p><b>Exhibit 2 — Uma Reyes (single).</b> Uma bought a condominium in March 2025 and used it as her principal residence for exactly 15 months. In June 2026 her employer transferred her to a job 400 miles away, and she sold the condo at a realized gain of $180,000. She has never excluded gain on another home.</p>
<p>Assume the §121 exclusion limits are $250,000 ($500,000 for a qualifying joint return); these amounts are not indexed for inflation.</p>
<p class="ja">資料1:Novak夫妻(夫婦合算申告)は2019年1月に主たる住居を$400,000で購入し、2020年に$50,000のキッチン改装を行った。2021年から2025年まで、Samは住宅内の一室を自身のコンサルティング事業の専用ホームオフィスとして使用し、$8,000の減価償却を計上した。夫妻は2026年7月に$1,100,000で売却するまで継続して所有・居住した。売却費用(仲介手数料・決済費用)は$60,000。過去2年以内に他の住宅で除外を受けていない。資料2:Uma Reyes(単身)は2025年3月にコンドミニアムを購入し、ちょうど15か月間主たる住居として使用した。2026年6月に勤務先から400マイル離れた職場へ転勤を命じられ、実現利得$180,000で売却した。他の住宅で除外を受けたことはない。§121の除外限度は$250,000(要件を満たす夫婦合算は$500,000)で、インフレ調整はない。</p>`,
  rows: [
    { label: "Novaks — amount realized(Novak夫妻の実現額)", type: "num", answer: 1040000 },
    { label: "Novaks — adjusted basis of the residence(住宅の調整後取得価額)", type: "num", answer: 442000 },
    { label: "Novaks — recognized (taxable) gain(課税される利得)", type: "num", answer: 98000 },
    { label: "Novaks — portion of the taxable gain that is unrecaptured §1250 gain(課税利得のうち未リキャプチャー§1250利得)", type: "num", answer: 8000 },
    { label: "Uma — maximum reduced exclusion(Umaの縮減後の除外限度額)", type: "num", answer: 156250 },
    { label: "Uma — taxable gain(Umaの課税利得)", type: "num", answer: 23750 },
    { label: "Basic ownership and use test for the full §121 exclusion(全額除外のための所有・使用要件)", type: "select", options: ["Owned and used as principal residence for at least 1 year of the last 3 years", "Owned and used as principal residence for at least 2 years of the 5-year period ending on the date of sale", "Owned for 5 years and used for 3 years", "Used as principal residence on the date of sale"], answer: "Owned and used as principal residence for at least 2 years of the 5-year period ending on the date of sale" },
  ],
  explain: `<p>実現額 = 1,100,000 − 60,000 = 1,040,000。調整後取得価額 = 400,000 + 50,000 − 8,000 = 442,000。実現利得 = 598,000。</p>
<p>1997年5月6日以後に計上した減価償却相当額8,000は§121の除外対象外である。ホームオフィスが住居ユニット内にあるため、利得を事業部分と住居部分に按分する必要はない。除外対象となりうる利得590,000のうち500,000を除外し、課税利得 = 598,000 − 500,000 = 98,000(うち8,000は最高25%の未リキャプチャー§1250利得、残り90,000は長期キャピタルゲイン)。</p>
<p>Uma:2年要件を満たさないが、転勤(距離のセーフハーバー)という不測の事情による売却なので部分的除外が認められる。限度額 = 250,000 × 15/24 = 156,250。課税利得 = 180,000 − 156,250 = 23,750。</p>
<p>原則の要件は、売却日以前5年間のうち2年以上所有かつ主たる住居として使用していることである。</p>`,
});

CPA.tbs({
  id: "TBS-REG-64", section: "REG", chapter: "REG-04", title: "事業買収による§197無形資産の償却と創業費・設立費の控除",
  scenario: `<p>Kestrel Corp., a newly formed calendar-year C corporation, purchased the assets of an existing landscaping business and began business on <b>July 1, 2026</b>. Kestrel elects to deduct start-up and organizational costs to the maximum extent allowed.</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Purchase price allocated to goodwill</td><td>$300,000</td></tr>
<tr><td>Purchase price allocated to the seller's customer list</td><td>$90,000</td></tr>
<tr><td>Covenant not to compete signed by the seller (3-year term), entered into in connection with the acquisition</td><td>$60,000</td></tr>
<tr><td>Start-up costs incurred before July 1 (market surveys, employee training, pre-opening advertising)</td><td>$53,000</td></tr>
<tr><td>Organizational costs (state incorporation fees, legal fees for the charter and bylaws)</td><td>$12,000</td></tr>
<tr><td>Commissions paid to a placement agent to sell Kestrel stock</td><td>$8,000</td></tr></table>
<p>The start-up and organizational expense rules each allow up to $5,000 of immediate deduction, reduced dollar-for-dollar by costs in excess of $50,000, with the remainder amortized over 180 months beginning with the month business begins (these amounts are not indexed).</p>
<p class="ja">新設の暦年課税C法人Kestrel社は、既存の造園事業の資産を取得し、2026年7月1日に事業を開始した。創業費・設立費は認められる最大限を控除する選択をする。のれん$300,000、売主の顧客リスト$90,000、買収に伴い売主が締結した競業避止契約(期間3年)$60,000、7月1日前の創業費(市場調査・従業員研修・開業前広告)$53,000、設立費(州の設立手数料、定款・付属定款の弁護士費用)$12,000、Kestrel株式の販売を仲介業者に依頼した手数料$8,000。創業費と設立費はそれぞれ$5,000まで即時控除でき、$50,000超過額だけ1ドルずつ減額され、残額は事業開始月から180か月で償却する(インフレ調整なし)。</p>`,
  rows: [
    { label: "2026 amortization of §197 intangibles(2026年の§197無形資産の償却額)", type: "num", answer: 15000 },
    { label: "Start-up costs deducted immediately(創業費の即時控除額)", type: "num", answer: 2000 },
    { label: "Total 2026 deduction for start-up costs(2026年の創業費の控除合計)", type: "num", answer: 3700 },
    { label: "Total 2026 deduction for organizational costs(2026年の設立費の控除合計)", type: "num", answer: 5233, tol: 1 },
    { label: "Amortization period for the 3-year covenant not to compete(3年の競業避止契約の償却期間)", type: "select", options: ["3 years", "5 years", "15 years", "Not amortizable"], answer: "15 years" },
    { label: "Treatment of the $8,000 stock-selling commissions(株式発行手数料$8,000の扱い)", type: "select", options: ["Organizational cost amortized over 180 months", "Start-up cost", "Deductible in full in 2026", "Not deductible or amortizable; reduces paid-in capital"], answer: "Not deductible or amortizable; reduces paid-in capital" },
    { label: "If Kestrel later sells the customer list at a loss while keeping the goodwill, the loss is(のれんを保持したまま顧客リストを売却損で処分した場合)", type: "select", options: ["Deductible as an ordinary loss", "Deductible as a §1231 loss", "Disallowed and added to the basis of the retained §197 intangibles", "Deductible as a capital loss"], answer: "Disallowed and added to the basis of the retained §197 intangibles" },
  ],
  explain: `<p>§197無形資産(のれん・顧客リスト・事業買収に伴う競業避止契約)は契約期間にかかわらず15年(180か月)で、取得月から定額償却する。(300,000 + 90,000 + 60,000) ÷ 180 × 6か月(7〜12月) = 450,000 ÷ 180 × 6 = 15,000。</p>
<p>創業費:53,000は50,000を3,000超えるので、即時控除 = 5,000 − 3,000 = 2,000。残り51,000 ÷ 180 × 6 = 1,700。合計3,700。</p>
<p>設立費:12,000は50,000以下なので即時控除5,000。残り7,000 ÷ 180 × 6 = 233.33。合計5,233.33 ≒ 5,233。</p>
<p>株式の発行・販売費用は設立費に該当せず、控除も償却もできない(払込資本の減少)。同一取引で取得した§197無形資産の一部を処分して損失が生じても、他の無形資産を保持していれば損失は否認され、保持する§197無形資産の取得価額に加算される。</p>`,
});

CPA.tbs({
  id: "TBS-REG-65", section: "REG", chapter: "REG-05", title: "Form 1120:会計上の利益からの課税所得計算(M-1・M-2、寄附金1%下限、DRDの課税所得制限)",
  scenario: `<p>Pepper Corp., a calendar-year C corporation, provides its 2026 book income statement and supplemental notes.</p>
<table><tr><th>Income statement — 2026</th><th>Amount</th></tr>
<tr><td>Sales</td><td>$1,200,000</td></tr>
<tr><td>Dividend from a domestic corporation in which Pepper owns 30%</td><td>100,000</td></tr>
<tr><td>Interest on municipal bonds</td><td>8,000</td></tr>
<tr><td>Loss on sale of stock investments (capital loss; no capital gains in 2026)</td><td>(7,000)</td></tr>
<tr><td>Cost of goods sold</td><td>(800,000)</td></tr>
<tr><td>Salaries</td><td>(250,000)</td></tr>
<tr><td>Depreciation (book; MACRS depreciation is $55,000)</td><td>(40,000)</td></tr>
<tr><td>Premiums on key-officer life insurance (Pepper is beneficiary)</td><td>(6,000)</td></tr>
<tr><td>Business meals with clients (restaurant)</td><td>(10,000)</td></tr>
<tr><td>Client entertainment (sporting events)</td><td>(4,000)</td></tr>
<tr><td>Fines paid to a government agency</td><td>(3,000)</td></tr>
<tr><td>Cash contributions to qualified public charities</td><td>(22,000)</td></tr>
<tr><td>Other deductible operating expenses</td><td>(90,000)</td></tr>
<tr><td>Federal income tax expense</td><td>(6,615)</td></tr>
<tr><td><b>Net income per books</b></td><td><b>$69,385</b></td></tr></table>
<p>Other data: unappropriated retained earnings at January 1, 2026 were $400,000; Pepper declared and paid cash dividends of $25,000 in 2026. Pepper has no NOL or contribution carryovers. <b>Assumptions (OBBBA, tax years beginning after 2025):</b> the corporate charitable deduction is allowed only for contributions in excess of 1% of taxable income computed before the charitable deduction and the DRD, and may not exceed 10% of that same amount; because Pepper's contributions exceed the 10% cap, all nondeductible contributions (including those disallowed by the 1% floor) carry forward 5 years. The corporate rate is 21%.</p>
<p class="ja">暦年課税のC法人Pepper社の2026年の損益計算書(上表):売上$1,200,000、持株比率30%の内国法人からの受取配当$100,000、地方債利息$8,000、投資株式の売却損(資本損失、2026年に資本利得なし)$(7,000)、売上原価$(800,000)、給与$(250,000)、減価償却費(会計上。MACRSは$55,000)$(40,000)、役員保険料(受取人は会社)$(6,000)、顧客との飲食(レストラン)$(10,000)、顧客接待(スポーツ観戦)$(4,000)、政府機関への罰金$(3,000)、適格公益団体への現金寄附$(22,000)、その他の損金算入営業費用$(90,000)、連邦法人税費用$(6,615)、当期純利益$69,385。その他:2026年1月1日の未処分利益剰余金$400,000、2026年の現金配当支払$25,000。NOLや寄附金の繰越はない。前提(OBBBA、2025年後開始年度):法人の寄附金控除は、寄附金控除とDRD控除前の課税所得の1%を超える部分のみ認められ、同じ金額の10%が上限である。Pepper社の寄附は10%上限を超えるため、控除できない寄附(1%下限で否認された部分を含む)は全額5年間繰り越される。税率は21%。</p>`,
  rows: [
    { label: "Charitable contribution deduction for 2026(2026年の寄附金控除額)", type: "num", answer: 10000 },
    { label: "Charitable contribution carryforward to 2027(2027年への寄附金繰越額)", type: "num", answer: 12000 },
    { label: "Dividends-received deduction(受取配当控除)", type: "num", answer: 58500 },
    { label: "Taxable income (Form 1120, line 30)(課税所得)", type: "num", answer: 31500 },
    { label: "Schedule M-1, line 5 — expenses recorded on books not deducted on the return(M-1第5行:会計上の費用で申告書上控除しないもの)", type: "num", answer: 30000 },
    { label: "Schedule M-1, line 10 — income (Form 1120, line 28)(M-1第10行:特別控除・NOL控除前の所得)", type: "num", answer: 90000 },
    { label: "Schedule M-2 — unappropriated retained earnings at December 31, 2026(M-2:期末未処分利益剰余金)", type: "num", answer: 444385 },
    { label: "Why the DRD is less than 65% of the dividend(DRDが配当の65%を下回る理由)", type: "select", options: ["The 1% charitable floor reduces the DRD", "The DRD is limited to 65% of taxable income before the DRD because the full DRD would not create an NOL", "The 30% ownership reduces the rate to 50%", "Dividends from domestic corporations are limited to $50,000"], answer: "The DRD is limited to 65% of taxable income before the DRD because the full DRD would not create an NOL" },
  ],
  explain: `<p>寄附金控除・DRD前の課税所得 = 売上1,200,000 + 配当100,000 − 売上原価800,000 − 給与250,000 − MACRS 55,000 − 飲食の50% 5,000 − その他90,000 = 100,000(地方債利息は非課税、資本損失は資本利得がないため控除不可、役員保険料・接待費・罰金・法人税は損金不算入)。</p>
<p>寄附金:1%下限 = 1,000、10%上限 = 10,000。22,000 − 1,000 = 21,000 > 10,000 なので控除10,000、繰越 = 22,000 − 10,000 = 12,000。</p>
<p>DRD前の課税所得 = 100,000 − 10,000 = 90,000(=1120第28行)。持株20%以上80%未満なので65%。65% × 100,000 = 65,000 と 65% × 90,000 = 58,500 を比較する。90,000 − 65,000 = 25,000 でNOLは生じないので課税所得制限が適用され、DRD = 58,500。課税所得 = 90,000 − 58,500 = 31,500(税額 31,500 × 21% = 6,615 で会計上の法人税費用と一致)。</p>
<p>M-1:第1行 当期純利益69,385、第2行 法人税6,615、第3行 資本損失の超過7,000、第5行 = 役員保険料6,000 + 飲食の損金不算入5,000 + 接待4,000 + 罰金3,000 + 寄附金超過12,000 = 30,000、第6行合計113,000。第7行 地方債利息8,000、第8行 減価償却の税務超過額15,000。第10行 = 113,000 − 23,000 = 90,000。</p>
<p>M-2:400,000 + 69,385 − 25,000 = 444,385。</p>`,
});

CPA.tbs({
  id: "TBS-REG-66", section: "REG", chapter: "REG-05", title: "法人の純資本損失の3年繰戻し・5年繰越と大法人の見積税額の納付",
  scenario: `<p>Baxter Corp., a calendar-year C corporation, reports the following for 2026 and prior years. The corporate rate was 21% in every year shown.</p>
<table><tr><th>Year</th><th>Taxable income</th><th>Net capital gain included in taxable income</th><th>Total tax</th></tr>
<tr><td>2023</td><td>$800,000</td><td>$10,000</td><td>$168,000</td></tr>
<tr><td>2024</td><td>$1,400,000</td><td>$5,000</td><td>$294,000</td></tr>
<tr><td>2025</td><td>$900,000</td><td>$15,000</td><td>$189,000</td></tr></table>
<p>2026 capital transactions: long-term capital loss $50,000; short-term capital gain $12,000. Baxter's 2026 taxable income (from ordinary operations) is <b>$1,600,000</b>, and its 2026 tax liability is $336,000. Baxter does not use the annualized or adjusted seasonal installment methods.</p>
<p class="ja">暦年課税のC法人Baxter社の資料(税率は各年21%)。2023年:課税所得$800,000(うち純資本利得$10,000)、税額$168,000。2024年:課税所得$1,400,000(うち純資本利得$5,000)、税額$294,000。2025年:課税所得$900,000(うち純資本利得$15,000)、税額$189,000。2026年の資本取引は長期資本損失$50,000、短期資本利得$12,000。2026年の課税所得(通常の営業から)は$1,600,000、2026年の税額は$336,000。年換算法や季節調整法は用いない。</p>`,
  rows: [
    { label: "2026 net capital loss(2026年の純資本損失)", type: "num", answer: 38000 },
    { label: "Total net capital loss absorbed by carrybacks to 2023–2025(2023〜2025年への繰戻しで吸収される額)", type: "num", answer: 30000 },
    { label: "Total refund from the carrybacks(繰戻しによる還付額合計)", type: "num", answer: 6300 },
    { label: "Character and last year of use of the remaining carryforward(残りの繰越損失の性質と使用期限)", type: "select", options: ["$8,000 long-term capital loss, through 2031", "$8,000 short-term capital loss, through 2031", "$8,000 short-term capital loss, carried forward indefinitely", "$8,000 ordinary loss (NOL), through 2046"], answer: "$8,000 short-term capital loss, through 2031" },
    { label: "Required first 2026 estimated tax installment (minimum)(2026年第1回見積納税額の最低額)", type: "num", answer: 47250 },
    { label: "Required second 2026 estimated tax installment(2026年第2回見積納税額)", type: "num", answer: 120750 },
    { label: "Why Baxter cannot base all four installments on its 2025 tax(全4回を2025年税額基準にできない理由)", type: "select", options: ["Its 2025 return showed a tax liability", "It had taxable income of $1 million or more in at least one of the three preceding years (large corporation)", "Its 2026 tax exceeds $250,000", "Corporations may never use the prior-year safe harbor"], answer: "It had taxable income of $1 million or more in at least one of the three preceding years (large corporation)" },
    { label: "Due date of the fourth installment(第4回の納期限)", type: "select", options: ["December 15, 2026", "January 15, 2027", "March 15, 2027", "April 15, 2027"], answer: "December 15, 2026" },
  ],
  explain: `<p>純資本損失 = 50,000 − 12,000 = 38,000。法人は資本損失を通常所得から控除できず、3年繰戻し・5年繰越する(繰戻し・繰越分は短期資本損失として扱う)。</p>
<p>繰戻しは古い年から順に、各年の純資本利得の範囲で充当する:2023年10,000、2024年5,000、2025年15,000 → 合計30,000。還付額 = 30,000 × 21% = 6,300。</p>
<p>残り8,000は短期資本損失として2027〜2031年の5年間繰り越す。</p>
<p>見積納税:2024年の課税所得が$1,000,000以上なので大法人に該当する。大法人は前年税額基準を第1回にしか使えない。第1回 = 189,000 × 25% = 47,250。第2回では当年税額基準で不足分を取り戻す:336,000 × 50% − 47,250 = 120,750。第3回・第4回は各84,000。暦年法人の納期限は4月15日、6月15日、9月15日、12月15日である。</p>`,
});

CPA.tbs({
  id: "TBS-REG-67", section: "REG", chapter: "REG-05", title: "当期E&Pの計算と年2回の現金分配の性質決定(配当・資本の払戻し・譲渡益)",
  scenario: `<p>Crane Corp., a calendar-year C corporation, is owned 100% by Lin Park, whose stock basis at January 1, 2026 was $70,000. Crane's accumulated E&P at January 1, 2026 was <b>$60,000</b>. Crane's tax manager provides the following 2026 data.</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Taxable income</td><td>$200,000</td></tr>
<tr><td>Federal income tax liability (21%)</td><td>42,000</td></tr>
<tr><td>Tax-exempt municipal bond interest</td><td>20,000</td></tr>
<tr><td>Dividends-received deduction claimed (50%, on $70,000 of dividends from a 10%-owned corporation)</td><td>35,000</td></tr>
<tr><td>MACRS depreciation deducted</td><td>120,000</td></tr>
<tr><td>Depreciation under the alternative depreciation system (ADS) on the same assets</td><td>70,000</td></tr>
<tr><td>Fines and penalties paid (nondeductible)</td><td>5,000</td></tr>
<tr><td>Premiums on key-employee life insurance (no cash surrender value)</td><td>4,000</td></tr>
<tr><td>Net capital loss for 2026 (not deductible)</td><td>6,000</td></tr>
<tr><td>Charitable contributions in excess of the 10% limit</td><td>9,000</td></tr></table>
<p>Cash distributions to Lin: <b>$200,000 on April 1</b> and <b>$200,000 on October 1, 2026</b>.</p>
<p class="ja">暦年課税のC法人Crane社はLin Parkが100%所有し、2026年1月1日の株式の取得価額は$70,000である。2026年1月1日の累積E&Pは$60,000。2026年の資料:課税所得$200,000、連邦法人税(21%)$42,000、非課税の地方債利息$20,000、受取配当控除(持株10%の法人からの配当$70,000の50%)$35,000、MACRS減価償却$120,000、同一資産のADS減価償却$70,000、罰金(損金不算入)$5,000、役員保険料(解約返戻金なし)$4,000、2026年の純資本損失(控除不可)$6,000、10%限度超過の寄附金$9,000。Linへの現金分配は2026年4月1日に$200,000、10月1日に$200,000。</p>`,
  rows: [
    { label: "Current E&P for 2026(2026年の当期E&P)", type: "num", answer: 239000 },
    { label: "Dividend income from the April 1 distribution(4月1日分配のうち配当所得)", type: "num", answer: 179500 },
    { label: "Dividend income from the October 1 distribution(10月1日分配のうち配当所得)", type: "num", answer: 119500 },
    { label: "Capital gain recognized by Lin in 2026(Linが2026年に認識する譲渡益)", type: "num", answer: 31000 },
    { label: "Lin's stock basis at December 31, 2026(2026年末のLinの株式の取得価額)", type: "num", answer: 0 },
    { label: "If accumulated E&P at January 1 had instead been a deficit of $(150,000), total 2026 dividend income would be(1月1日の累積E&Pが$(150,000)の欠損だった場合の配当所得合計)", type: "num", answer: 239000 },
    { label: "Allocation rule for current vs. accumulated E&P(当期E&Pと累積E&Pの配分ルール)", type: "select", options: ["Both current and accumulated E&P are allocated pro rata to all distributions", "Current E&P is allocated pro rata to distributions; accumulated E&P is applied chronologically", "Current E&P is applied chronologically; accumulated E&P is allocated pro rata", "Accumulated E&P is used first, then current E&P"], answer: "Current E&P is allocated pro rata to distributions; accumulated E&P is applied chronologically" },
  ],
  explain: `<p>当期E&P = 課税所得200,000 + 地方債利息20,000 + DRD 35,000(E&Pでは控除不可) + 減価償却の超過額(120,000 − 70,000)50,000 − 法人税42,000 − 罰金5,000 − 保険料4,000 − 純資本損失6,000 − 寄附金限度超過額9,000 = 239,000。</p>
<p>当期E&Pは分配額に比例配分する:239,000 × 200/400 = 119,500ずつ。累積E&P 60,000は時系列順に充当するので4月の分配に全額充てる。</p>
<p>4月:配当 = 119,500 + 60,000 = 179,500。残り20,500は資本の払戻しで株式の取得価額を70,000 → 49,500に減額。</p>
<p>10月:配当119,500。残り80,500のうち49,500は資本の払戻し(取得価額0)、超過31,000は資本利得。期末の取得価額は0。</p>
<p>累積E&Pが欠損でも当期E&Pが正なら、当期E&Pの範囲で配当となる(欠損と相殺しない)。配当所得合計 = 239,000。</p>`,
});

CPA.tbs({
  id: "TBS-REG-68", section: "REG", chapter: "REG-05", title: "株式償還(§302)の判定と§318のみなし保有(家族・パートナーシップからの帰属)",
  scenario: `<p>Harbor Corp., a C corporation with 1,000 shares of a single class of common stock outstanding and accumulated E&P of $500,000, plans two possible stock redemptions at <b>$150 per share</b>. <b>Analyze each redemption independently, as if it were the only redemption.</b></p>
<table><tr><th>Shareholder</th><th>Relationship</th><th>Shares owned directly</th></tr>
<tr><td>Ana</td><td>—</td><td>300 (basis $40 per share)</td></tr>
<tr><td>Ben</td><td>Ana's son</td><td>200</td></tr>
<tr><td>Carl</td><td>Ana's father</td><td>100</td></tr>
<tr><td>Dina</td><td>Ana's sister</td><td>100</td></tr>
<tr><td>Delta Partnership</td><td>Ana is a 50% partner; the other partner is unrelated</td><td>200</td></tr>
<tr><td>Ed</td><td>Unrelated to everyone</td><td>100 (basis $60 per share)</td></tr></table>
<p><b>Redemption A:</b> Harbor redeems 200 of Ana's shares. <b>Redemption B:</b> Harbor redeems all 100 of Ed's shares.</p>
<p class="ja">Harbor社(単一種類の普通株式1,000株発行済、累積E&P$500,000)は、1株$150で2つの償還を検討している。各償還はそれのみが行われたものとして独立に分析すること。株主:Ana 300株(1株当たり取得価額$40)、Anaの息子Ben 200株、Anaの父Carl 100株、Anaの姉妹Dina 100株、Delta Partnership(Anaが50%パートナー、他のパートナーは非関連者)200株、全員と無関係のEd 100株(1株当たり取得価額$60)。償還A:Anaの株式200株を償還。償還B:Edの株式100株全部を償還。</p>`,
  rows: [
    { label: "Shares attributed to Ana from her sister Dina under §318(§318でDinaからAnaに帰属する株式数)", type: "num", answer: 0 },
    { label: "Ana's percentage ownership (direct + constructive) before Redemption A(償還A前のAnaの保有割合、%)", type: "num", answer: 70 },
    { label: "Ana's percentage ownership (direct + constructive) after Redemption A(償還A後のAnaの保有割合、%)", type: "num", answer: 62.5, tol: 0.1 },
    { label: "Tax treatment of Redemption A(償還Aの課税上の扱い)", type: "select", options: ["Exchange — substantially disproportionate under §302(b)(2)", "Exchange — complete termination under §302(b)(3)", "Exchange — not essentially equivalent to a dividend under §302(b)(1)", "§301 distribution (dividend to the extent of E&P)"], answer: "§301 distribution (dividend to the extent of E&P)" },
    { label: "Ana's dividend income from Redemption A(償還AによるAnaの配当所得)", type: "num", answer: 30000 },
    { label: "Ana's total basis in her 100 remaining shares after Redemption A(償還A後のAnaの残存100株の取得価額合計)", type: "num", answer: 12000 },
    { label: "Ed's recognized capital gain from Redemption B(償還BによるEdの資本利得)", type: "num", answer: 9000 },
  ],
  explain: `<p>§318の家族帰属は配偶者・子・孫・親に限られ、兄弟姉妹や祖父母は含まれない。DinaからAnaへの帰属は0株。パートナーシップ所有株式はパートナーへ持分比率で帰属するので、Deltaの200株 × 50% = 100株がAnaに帰属する。</p>
<p>償還A前:直接300 + Ben 200 + Carl 100 + Delta 100 = 700株 ÷ 1,000 = 70%。償還A後:直接100 + 200 + 100 + 100 = 500株 ÷ 800 = 62.5%。</p>
<p>実質的不均衡償還の要件は、償還後の割合が50%未満かつ償還前の80%(70% × 80% = 56%)未満であることだが、62.5%なので満たさない。完全終了でもなく、支配権を維持しているため意味のある減少もない。よって§301の分配となり、E&Pが十分なので200株 × 150 = 30,000全額が配当である。</p>
<p>配当扱いの場合、償還株式の取得価額200 × 40 = 8,000は残存株式に付け替えられる。残存100株の取得価額 = 100 × 40 + 8,000 = 12,000。</p>
<p>償還B:Edは無関係で帰属株式がなく、全株式が償還されるので§302(b)(3)の完全終了として売却扱い。利得 = 15,000 − 6,000 = 9,000。</p>`,
});
