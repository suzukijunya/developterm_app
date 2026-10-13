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
