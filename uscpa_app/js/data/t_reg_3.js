// REG のTBS追加(受動的活動・趣味活動・在宅オフィス・超過事業損失/NOL、資産の譲渡損益・同種交換・収用・割賦販売・減価償却・関連者間取引)

CPA.tbs({
  id: "TBS-REG-52", section: "REG", chapter: "REG-03", title: "受動的活動損失の制限と賃貸不動産$25,000特別控除の段階的縮小(Form 8582)",
  scenario: `<p>Dana and Lee Ortiz file a joint 2026 return. Their modified AGI for purposes of the rental real estate special allowance (computed without regard to any passive activity loss) is <b>$128,000</b>. The special allowance is <b>$25,000</b>, reduced by 50% of modified AGI over <b>$100,000</b> (fully phased out at $150,000); these amounts are not indexed. Neither spouse is a real estate professional.</p>
<table><tr><th>Activity</th><th>Participation</th><th>2026 result</th></tr>
<tr><td>Duplex rental (Ortizes own 100%)</td><td>Active participation (approve tenants, set rents); no material participation</td><td>Net loss $(34,000)</td></tr>
<tr><td>LP A — limited partnership interest</td><td>Limited partner only</td><td>Net income $6,000</td></tr>
<tr><td>LP B — limited partnership interest</td><td>Limited partner only</td><td>Net loss $(9,000)</td></tr>
<tr><td>LP C — entire interest sold on Sept. 30, 2026 to an unrelated buyer in a fully taxable transaction</td><td>Limited partner only</td><td>Current-year operating loss $(2,000); suspended prior-year losses $8,000</td></tr></table>
<p class="ja">Ortiz夫妻は2026年に夫婦合算で申告する。賃貸不動産特別控除の判定に用いる修正AGI(受動的活動損失を考慮しない)は$128,000である。特別控除額は$25,000で、修正AGIが$100,000を超える額の50%だけ減額される($150,000で全額消失。いずれもインフレ調整なし)。夫婦とも不動産専門家ではない。活動:デュプレックス賃貸(100%所有、積極的参加あり・重要な参加なし)は純損失$(34,000)、LP A(有限責任パートナー)は純利益$6,000、LP B(同)は純損失$(9,000)、LP C(同)は2026年9月30日に持分全部を非関連者へ完全課税取引で売却し、当期営業損失$(2,000)と過年度の停止損失$8,000がある。</p>`,
  rows: [
    { label: "Reduction of the special allowance due to the MAGI phase-out(修正AGIによる特別控除の減額)", type: "num", answer: 14000 },
    { label: "Rental real estate special allowance available for 2026(2026年の賃貸不動産特別控除額)", type: "num", answer: 11000 },
    { label: "Total passive losses allowed in 2026 from the duplex, LP A and LP B (Form 8582 Part IV)(デュプレックス・LP A・LP Bから認められる受動的損失の合計)", type: "num", answer: 17000 },
    { label: "Suspended passive losses carried forward to 2027(2027年へ繰り越される停止損失)", type: "num", answer: 26000 },
    { label: "LP C losses deductible in 2026 (current + suspended)(LP Cについて2026年に控除できる損失)", type: "num", answer: 10000 },
    { label: "Net decrease in 2026 AGI from all passive activity items listed(上記の受動的活動項目全体によるAGIの純減少額)", type: "num", answer: 21000 },
    { label: "If MAGI had been $152,000, the special allowance would be(修正AGIが$152,000だった場合の特別控除)", type: "select", options: ["$25,000", "$12,500", "$1,000", "$0"], answer: "$0" },
    { label: "Treatment of the suspended losses not allowed in 2026(2026年に認められない停止損失の扱い)", type: "select", options: ["Lost permanently", "Carried back 2 years, then forward 20 years", "Carried forward indefinitely and allowed against future passive income or upon a fully taxable disposition", "Deductible as a miscellaneous itemized deduction"], answer: "Carried forward indefinitely and allowed against future passive income or upon a fully taxable disposition" },
  ],
  explain: `<p>減額:(128,000 − 100,000) × 50% = 14,000。特別控除 = 25,000 − 14,000 = 11,000。</p>
<p>Form 8582の計算:積極的参加の賃貸損失(34,000)とその他の受動的活動(利益6,000、損失9,000 → 純損失3,000)を合算すると純損失37,000。特別控除の対象は「賃貸の純損失34,000」と「全体の純損失37,000」の小さい方34,000だが、上限11,000に制限される。認められる損失合計 = 受動的所得6,000 + 特別控除11,000 = 17,000。</p>
<p>停止損失:損失合計(34,000 + 9,000) − 17,000 = 26,000。無期限に繰り越され、将来の受動的所得または活動全体の完全課税処分時に控除される。</p>
<p>LP C:持分全部を非関連者へ完全課税取引で処分したため、当期損失2,000と過年度停止損失8,000の合計10,000は受動的損失の制限を受けず全額控除できる。</p>
<p>AGIへの純影響:LP Aの所得 +6,000、認められた受動的損失 −17,000、LP Cの損失 −10,000 → 純減少21,000。</p>
<p>修正AGI $152,000の場合:減額 = (152,000 − 100,000) × 50% = 26,000 > 25,000 となり特別控除は$0である。</p>`,
});

CPA.tbs({
  id: "TBS-REG-53", section: "REG", chapter: "REG-03", title: "馬の繁殖活動の趣味判定(§183の推定規定)と趣味所得・事業損失の比較",
  scenario: `<p>Rachel Kim, a full-time surgeon, began breeding and showing horses in 2020. Her CPA is preparing her 2026 return and has gathered the following.</p>
<p><b>Exhibit 1 — Profit history of the horse activity:</b> 2020 loss; 2021 loss; 2022 loss; 2023 profit; 2024 loss; 2025 loss; 2026 loss (see below).</p>
<p><b>Exhibit 2 — Client interview notes:</b> Rachel keeps no separate bank account or business plan for the activity, spends about 4 hours per week on it (mostly riding for recreation), has not consulted any horse-industry advisers, and has not changed operating methods despite repeated losses. Her surgical income is about $600,000 per year.</p>
<table><tr><th>2026 horse activity</th><th>Amount</th></tr>
<tr><td>Gross receipts (sale of one foal and stud fees)</td><td>$14,000</td></tr>
<tr><td>Cost basis of the foal sold (cost of goods sold)</td><td>$3,000</td></tr>
<tr><td>Feed and boarding</td><td>$12,000</td></tr>
<tr><td>Veterinary fees</td><td>$4,000</td></tr>
<tr><td>Trainer fees</td><td>$6,000</td></tr>
<tr><td>Depreciation on horses and equipment</td><td>$4,000</td></tr></table>
<p>Assume the suspension of miscellaneous itemized deductions subject to the 2% floor is permanent (as made permanent by the One Big Beautiful Bill Act).</p>
<p class="ja">常勤外科医のRachel Kimは2020年に馬の繁殖・ショー出場を始めた。資料1(利益履歴):2020〜2022年は損失、2023年は利益、2024〜2026年は損失。資料2(面談メモ):専用の銀行口座も事業計画もなく、週4時間程度(主に娯楽としての乗馬)を費やし、業界の専門家に相談したこともなく、損失続きでも運営方法を変えていない。外科医としての所得は年約$600,000。2026年の数値:総収入(子馬1頭の売却と種付料)$14,000、売却した子馬の原価$3,000、飼料・預託費$12,000、獣医費$4,000、調教師費$6,000、減価償却費$4,000。2%フロア付きの雑項目別控除の停止はOBBBAにより恒久化されたものとする。</p>`,
  rows: [
    { label: "Safe-harbor profit presumption test for horse breeding, showing or racing(馬の繁殖・ショー・競走に適用される利益推定テスト)", type: "select", options: ["Profit in 3 of 5 consecutive years", "Profit in 2 of 7 consecutive years", "Profit in 2 of 5 consecutive years", "Profit in 1 of 3 consecutive years"], answer: "Profit in 2 of 7 consecutive years" },
    { label: "Conclusion for 2026 based on the exhibits(資料に基づく2026年の結論)", type: "select", options: ["Presumption met — activity engaged in for profit", "Presumption not met, and the facts and circumstances indicate an activity not engaged in for profit (hobby)", "Presumption not met, but the activity is a business because gross receipts exceed $10,000", "Activity is a passive rental activity"], answer: "Presumption not met, and the facts and circumstances indicate an activity not engaged in for profit (hobby)" },
    { label: "Hobby gross income included in 2026 gross income(2026年の総所得に含める趣味所得)", type: "num", answer: 11000 },
    { label: "Hobby expenses deductible in 2026 (feed, vet, trainer, depreciation)(2026年に控除できる趣味費用)", type: "num", answer: 0 },
    { label: "Where the hobby income is reported(趣味所得の記載箇所)", type: "select", options: ["Schedule C, line 1", "Schedule 1, other income", "Schedule E, Part I", "Form 4797"], answer: "Schedule 1, other income" },
    { label: "Schedule C net loss if the activity were instead a trade or business(仮に事業と認定された場合のSchedule C純損失)", type: "num", answer: 15000 },
  ],
  explain: `<p>推定規定:§183(d)では通常5年中3年の利益が必要だが、馬の繁殖・調教・ショー・競走は連続7年中2年の利益で営利目的と推定される。Rachelは2020〜2026年の7年中で利益は2023年の1年のみであり推定を満たさない。</p>
<p>事実と状況:事業的な帳簿・口座がない、専門家に相談していない、損失が続いても方法を変えない、高額の他の所得がある、娯楽要素が大きい、という要因はいずれも営利目的を否定する。よって趣味(営利目的でない活動)と判断する。</p>
<p>趣味所得:総収入14,000 − 売上原価3,000 = 11,000(売上原価は総所得の計算上控除される)。</p>
<p>趣味費用:2%フロア付き雑項目別控除として扱われる費用は停止されており(OBBBAで恒久化)、控除額は0。</p>
<p>記載:Schedule 1の「その他の所得」に記載する。</p>
<p>事業であった場合:11,000 − (12,000 + 4,000 + 6,000 + 4,000 = 26,000) = 純損失15,000。</p>`,
});

CPA.tbs({
  id: "TBS-REG-54", section: "REG", chapter: "REG-03", title: "在宅オフィス控除:簡便法と通常法の比較と所得制限による減価償却費の繰越",
  scenario: `<p>Marcus Lee is a self-employed consultant who uses a 300-square-foot room exclusively and regularly as his principal place of business. His home has 2,400 square feet. He has used the office for the entire year since 2024. The simplified method rate is <b>$5 per square foot</b> for up to <b>300 square feet</b>.</p>
<table><tr><th>2026 home expenses</th><th>Amount</th></tr>
<tr><td>Mortgage interest (entire home)</td><td>$14,000</td></tr>
<tr><td>Real estate taxes (entire home)</td><td>$6,000</td></tr>
<tr><td>Homeowner's insurance (entire home)</td><td>$1,600</td></tr>
<tr><td>Utilities (entire home)</td><td>$4,000</td></tr>
<tr><td>General repairs (entire home)</td><td>$800</td></tr>
<tr><td>Painting the office only (direct expense)</td><td>$400</td></tr>
<tr><td>Basis of the home's building (excluding land) used for depreciation; office depreciated over 39 years straight-line, full year</td><td>$360,000</td></tr></table>
<p><b>Memo:</b> Gross income from the consulting business is $60,000 and business expenses unrelated to the home are $56,000. Round to the nearest dollar.</p>
<p class="ja">自営コンサルタントのMarcus Leeは、自宅2,400平方フィートのうち300平方フィートの部屋を主たる事業所として専属的かつ継続的に使用している(2024年から通年使用)。簡便法は1平方フィートあたり$5、上限300平方フィート。2026年の自宅費用:住宅ローン利息$14,000、固定資産税$6,000、住宅保険$1,600、光熱費$4,000、全体の修繕費$800、オフィスのみの塗装費$400(直接費)、建物部分(土地除く)の取得価額$360,000(オフィス部分は39年定額法で通年償却)。メモ:コンサル事業の総収入$60,000、自宅に関係しない事業費用$56,000。1ドル未満は四捨五入する。</p>`,
  rows: [
    { label: "Deduction under the simplified method(簡便法による控除額)", type: "num", answer: 1500 },
    { label: "Regular method: business portion of mortgage interest and real estate taxes(通常法:住宅ローン利息と固定資産税の事業部分)", type: "num", answer: 2500 },
    { label: "Regular method: operating expenses allowed (insurance, utilities, repairs, painting)(通常法:認められる運営費用)", type: "num", answer: 1200 },
    { label: "Regular method: depreciation allowed in 2026(通常法:2026年に認められる減価償却費)", type: "num", answer: 300 },
    { label: "Disallowed depreciation carried forward to 2027(2027年へ繰り越す減価償却費)", type: "num", answer: 854, tol: 1 },
    { label: "Total home office deduction under the regular method(通常法による在宅オフィス控除の合計)", type: "num", answer: 4000 },
    { label: "Method that produces the larger 2026 home office deduction(2026年の控除額が大きくなる方法)", type: "select", options: ["Simplified method", "Regular method", "Both produce the same deduction", "Neither — the gross income limit eliminates the deduction"], answer: "Regular method" },
  ],
  explain: `<p>事業使用割合 = 300 ÷ 2,400 = 12.5%。</p>
<p>簡便法:300 × $5 = 1,500(この場合、住宅ローン利息と固定資産税は全額をSchedule Aで扱う)。</p>
<p>所得制限:控除は事業の総所得から自宅に関係しない事業費用を引いた額 60,000 − 56,000 = 4,000 に制限され、①利息・税金 → ②運営費 → ③減価償却の順に充当する。</p>
<p>①(14,000 + 6,000) × 12.5% = 2,500。残り1,500。</p>
<p>②(1,600 + 4,000 + 800) × 12.5% = 800 + 直接費400 = 1,200(残り1,500以内なので全額)。残り300。</p>
<p>③減価償却:360,000 × 12.5% = 45,000 ÷ 39 = 1,154。残り300までしか控除できず、繰越 = 1,154 − 300 = 854。</p>
<p>通常法合計 = 2,500 + 1,200 + 300 = 4,000 > 簡便法1,500 → 通常法が有利である。</p>`,
});

CPA.tbs({
  id: "TBS-REG-55", section: "REG", chapter: "REG-03", title: "超過事業損失(§461(l))の制限とNOL繰越・80%所得制限",
  scenario: `<p>Ken and Aiko Mori file a joint 2026 return. Assume the 2026 excess business loss threshold is <b>$512,000</b> for joint filers (the §461(l) limitation has been made permanent by the One Big Beautiful Bill Act). Neither spouse has any passive activity or at-risk limitation.</p>
<table><tr><th>2026 item</th><th>Amount</th></tr>
<tr><td>Ken — Schedule C net loss from his restaurant</td><td>$(900,000)</td></tr>
<tr><td>Aiko — ordinary business income from a partnership (Schedule K-1, materially participates)</td><td>$150,000</td></tr>
<tr><td>Aiko — W-2 wages as an employee of an unrelated hospital</td><td>$600,000</td></tr>
<tr><td>Interest income (personal savings)</td><td>$20,000</td></tr>
<tr><td>Long-term capital gain on sale of personal investment stock</td><td>$50,000</td></tr></table>
<p><b>Projection for 2027:</b> the Moris expect taxable income of <b>$200,000</b> before any NOL deduction (no §199A deduction applies).</p>
<p class="ja">Mori夫妻は2026年に夫婦合算で申告する。2026年の超過事業損失の閾値は夫婦合算で$512,000とする(§461(l)の制限はOBBBAにより恒久化)。受動的活動や危険負担額の制限はない。項目:Kenのレストラン(Schedule C)純損失$(900,000)、Aikoのパートナーシップからの通常事業所得$150,000(重要な参加あり)、Aikoの非関連病院からのW-2給与$600,000、個人預金の利息$20,000、個人投資株式の長期譲渡益$50,000。2027年はNOL控除前の課税所得$200,000を見込む(§199A控除なし)。</p>`,
  rows: [
    { label: "Aggregate net loss from trades or businesses for §461(l)(事業の純損失の合計)", type: "num", answer: 750000 },
    { label: "Treatment of Aiko's W-2 wages in the §461(l) computation(§461(l)計算上のAikoの給与の扱い)", type: "select", options: ["Business income that offsets the Schedule C loss", "Not treated as trade or business income", "Treated as business income only up to the Social Security wage base", "Excluded from gross income"], answer: "Not treated as trade or business income" },
    { label: "Excess business loss disallowed in 2026(2026年に否認される超過事業損失)", type: "num", answer: 238000 },
    { label: "2026 adjusted gross income(2026年の調整後総所得)", type: "num", answer: 158000 },
    { label: "Treatment of the disallowed excess business loss(否認された超過事業損失の扱い)", type: "select", options: ["Lost permanently", "Carried back 2 years as an NOL", "Carried forward to 2027 as part of the NOL carryover", "Carried forward only against future business income of the restaurant"], answer: "Carried forward to 2027 as part of the NOL carryover" },
    { label: "NOL deduction allowed in 2027(2027年に認められるNOL控除額)", type: "num", answer: 160000 },
    { label: "NOL carryforward remaining after 2027(2027年後に残るNOL繰越額)", type: "num", answer: 78000 },
  ],
  explain: `<p>事業純損失:Schedule C損失900,000 − パートナーシップ事業所得150,000 = 750,000。給与所得は§461(l)の計算上、事業所得に含めない(CARES法による明確化)。利息・個人投資の譲渡益も事業所得ではない。</p>
<p>超過事業損失 = 750,000 − 512,000 = 238,000(2026年は否認)。</p>
<p>AGI = 給与600,000 + 利息20,000 + 譲渡益50,000 + パートナーシップ150,000 − 認容されるSchedule C損失(900,000 − 238,000 = 662,000) = 158,000。</p>
<p>否認された238,000はNOLとして2027年へ繰り越される(繰戻しはなく、無期限繰越)。</p>
<p>2027年:2017年後発生のNOLはNOL控除前課税所得の80%が上限 → 200,000 × 80% = 160,000。残額 = 238,000 − 160,000 = 78,000を翌年以降へ繰り越す。</p>`,
});

CPA.tbs({
  id: "TBS-REG-56", section: "REG", chapter: "REG-04", title: "資本損益のネッティングと税率区分(28%・25%・15%)ワークシート",
  scenario: `<p>Pat Quinn, a single taxpayer, had the following 2026 transactions. Pat's ordinary income is taxed in the 35% bracket. For 2026, assume the 0% rate on net capital gain applies to taxable income up to <b>$49,450</b> and the 15% rate up to <b>$545,500</b> for single filers; Pat's taxable income is between these amounts. Pat has a <b>$5,000 long-term capital loss carryover</b> from 2025.</p>
<table><tr><th>#</th><th>Asset</th><th>Facts</th></tr>
<tr><td>1</td><td>Stock X</td><td>Bought 3/1/2025 for $20,000; sold 2/10/2026 for $14,000</td></tr>
<tr><td>2</td><td>Stock Y</td><td>Bought 2019 for $30,000; sold 2026 for $52,000</td></tr>
<tr><td>3</td><td>Gold coins (collectibles)</td><td>Bought 2018 for $10,000; sold 2026 for $18,000</td></tr>
<tr><td>4</td><td>Stock inherited from father</td><td>Father's basis $12,000; FMV at death (11/2025) $40,000; Pat sold 1/2026 for $37,000</td></tr>
<tr><td>5</td><td>Stock received as a gift (2024)</td><td>Donor's basis $25,000; FMV at gift $18,000; Pat sold 2026 for $21,000</td></tr>
<tr><td>6</td><td>Stock Z</td><td>Basis $15,000; sold 12/5/2026 for $11,000; identical shares repurchased 12/15/2026 for $11,500</td></tr>
<tr><td>7</td><td>Rental building (Form 4797)</td><td>Net §1231 gain of $12,000, all of which is unrecaptured §1250 gain</td></tr></table>
<p class="ja">独身のPat Quinnの2026年の取引は上表のとおり。通常所得は35%の税率区分で課税される。2026年の独身者の純キャピタルゲイン0%税率は課税所得$49,450まで、15%税率は$545,500までとし、Patの課税所得はこの間にある。2025年からの長期キャピタルロス繰越$5,000がある。表:①株式X 2025/3/1取得$20,000、2026/2/10売却$14,000。②株式Y 2019年取得$30,000、2026年売却$52,000。③金貨(収集品)2018年取得$10,000、2026年売却$18,000。④父からの相続株式(父の取得価額$12,000、死亡時(2025年11月)時価$40,000)を2026年1月に$37,000で売却。⑤2024年の受贈株式(贈与者の取得価額$25,000、贈与時時価$18,000)を2026年に$21,000で売却。⑥株式Z(取得価額$15,000)を2026/12/5に$11,000で売却し、12/15に同一株式を$11,500で買い戻した。⑦賃貸建物:§1231純利益$12,000(全額が未回収§1250利益)。</p>`,
  rows: [
    { label: "Gain or loss recognized on the gifted stock (#5)(受贈株式の認識損益)", type: "num", answer: 0 },
    { label: "Long-term capital loss recognized on the inherited stock (#4)(相続株式の長期譲渡損)", type: "num", answer: 3000 },
    { label: "Basis of the repurchased Stock Z shares (#6)(買い戻した株式Zの取得価額)", type: "num", answer: 15500 },
    { label: "Net 28% rate gain after netting(ネッティング後の28%区分の利益)", type: "num", answer: 2000 },
    { label: "Net 15% rate gain after netting(ネッティング後の15%区分の利益)", type: "num", answer: 14000 },
    { label: "Net capital gain for 2026(2026年の純キャピタルゲイン)", type: "num", answer: 28000 },
    { label: "Total tax on the net capital gain(純キャピタルゲインに対する税額)", type: "num", answer: 5660 },
    { label: "Holding period of the inherited stock(相続株式の保有期間)", type: "select", options: ["Short-term, because Pat held it less than one year", "Long-term automatically, regardless of how long Pat or the decedent held it", "Includes the decedent's holding period only if the basis is carried over", "Begins on the date the estate distributed the shares"], answer: "Long-term automatically, regardless of how long Pat or the decedent held it" },
  ],
  explain: `<p>①短期譲渡損:14,000 − 20,000 = (6,000)。②長期譲渡益22,000(15%区分)。③収集品の長期譲渡益8,000(28%区分)。</p>
<p>④相続財産の取得価額は死亡時時価40,000(ステップアップ)。37,000 − 40,000 = (3,000)の長期譲渡損(相続財産は自動的に長期保有)。</p>
<p>⑤贈与時時価が贈与者の取得価額を下回る場合、利益計算の基準額は25,000、損失計算の基準額は18,000。売却価額21,000はその間にあるため損益なし(0)。</p>
<p>⑥30日以内に同一株式を買い戻したためウォッシュセールとなり損失4,000は否認。新株の取得価額 = 11,500 + 4,000 = 15,500。</p>
<p>⑦未回収§1250利益12,000(25%区分)。</p>
<p>区分ごとの集計:28%区分 8,000、25%区分 12,000、15%区分 22,000 − 3,000 − 繰越5,000 = 14,000、短期 (6,000)。純短期損失は28%区分 → 25%区分 → 15%区分の順に充当するため、28%区分 = 8,000 − 6,000 = 2,000。</p>
<p>純キャピタルゲイン = 2,000 + 12,000 + 14,000 = 28,000。</p>
<p>税額:2,000 × 28% = 560、12,000 × 25% = 3,000(通常税率35%より低い上限税率)、14,000 × 15% = 2,100。合計5,660。</p>`,
});

CPA.tbs({
  id: "TBS-REG-57", section: "REG", chapter: "REG-04", title: "複数の事業用資産売却の性質決定(§1245・§1250・§1231)と5年ルックバック",
  scenario: `<p>Elena Ruiz operates a manufacturing business as a sole proprietorship. All depreciation on buildings was computed using the straight-line method. In 2026 she sold the following assets to unrelated buyers.</p>
<table><tr><th>Asset</th><th>Acquired</th><th>Cost</th><th>Accumulated depreciation</th><th>Selling price</th></tr>
<tr><td>Machinery</td><td>2022</td><td>$80,000</td><td>$50,000</td><td>$45,000</td></tr>
<tr><td>Equipment</td><td>2021</td><td>$60,000</td><td>$20,000</td><td>$75,000</td></tr>
<tr><td>Factory building (nonresidential)</td><td>2012</td><td>$500,000</td><td>$160,000</td><td>$420,000</td></tr>
<tr><td>Land under the factory</td><td>2012</td><td>$100,000</td><td>—</td><td>$70,000</td></tr>
<tr><td>Delivery truck</td><td>May 2026 (held 8 months)</td><td>$40,000</td><td>$6,000</td><td>$31,000</td></tr></table>
<p><b>Prior-year Form 4797 history (net §1231 results):</b> 2020 net loss $(7,000); 2021 net loss $(12,000); 2022 none; 2023 net gain $4,000 (all recaptured as ordinary income under the lookback rule); 2024 net loss $(9,000); 2025 none.</p>
<p class="ja">個人事業主Elena Ruizは製造業を営む。建物の減価償却はすべて定額法である。2026年に非関連者へ次の資産を売却した:機械(2022年取得、原価$80,000、償却累計額$50,000、売却価額$45,000)、設備(2021年取得、$60,000、$20,000、$75,000)、工場建物(非住宅用、2012年取得、$500,000、$160,000、$420,000)、工場の土地(2012年取得、$100,000、売却価額$70,000)、配送トラック(2026年5月取得・保有8か月、$40,000、$6,000、$31,000)。過年度の§1231純損益:2020年純損失$(7,000)、2021年純損失$(12,000)、2022年なし、2023年純利益$4,000(ルックバックにより全額通常所得として回収済)、2024年純損失$(9,000)、2025年なし。</p>`,
  rows: [
    { label: "Total §1245 depreciation recapture (ordinary income)(§1245による減価償却リキャプチャーの合計)", type: "num", answer: 35000 },
    { label: "Section 1231 gain on the equipment(設備の§1231利益)", type: "num", answer: 15000 },
    { label: "Character of the $80,000 gain on the factory building(工場建物の利益$80,000の性質)", type: "select", options: ["Ordinary income under §1250 to the extent of all depreciation", "Section 1231 gain, all of which is unrecaptured §1250 gain", "Section 1231 gain taxed at 15%/20% only", "Short-term capital gain"], answer: "Section 1231 gain, all of which is unrecaptured §1250 gain" },
    { label: "Character of the loss on the delivery truck(配送トラックの損失の性質)", type: "select", options: ["Section 1231 loss", "Short-term capital loss", "Ordinary loss (not §1231 property because held one year or less)", "Nondeductible personal loss"], answer: "Ordinary loss (not §1231 property because held one year or less)" },
    { label: "Net §1231 gain for 2026 before the lookback rule(ルックバック適用前の2026年の§1231純利益)", type: "num", answer: 65000 },
    { label: "Nonrecaptured net §1231 losses from the prior five years(過去5年の未回収§1231純損失)", type: "num", answer: 17000 },
    { label: "Net §1231 gain treated as long-term capital gain(長期キャピタルゲインとして扱われる§1231純利益)", type: "num", answer: 48000 },
    { label: "Total ordinary income (loss) from all 2026 sales, including lookback recapture(2026年の全売却から生じる通常所得の純額)", type: "num", answer: 49000 },
  ],
  explain: `<p>機械:帳簿価額30,000、利益15,000 ≤ 償却累計額50,000 → 全額§1245通常所得15,000。</p>
<p>設備:帳簿価額40,000、利益35,000 → 償却累計額20,000までが§1245通常所得、残り15,000が§1231利益。§1245合計 = 15,000 + 20,000 = 35,000。</p>
<p>建物:帳簿価額340,000、利益80,000。定額法のため個人には§1250の追加償却リキャプチャーはなく、全額§1231利益だが、定額法償却額160,000の範囲で未回収§1250利益(25%上限)となる。</p>
<p>土地:70,000 − 100,000 = §1231損失(30,000)。</p>
<p>トラック:保有1年以下のため§1231資産ではなく、帳簿価額34,000に対する損失3,000は通常損失である。</p>
<p>§1231純利益 = 15,000 + 80,000 − 30,000 = 65,000。</p>
<p>ルックバック(2021〜2025年):12,000 − 4,000(2023年に回収済)+ 9,000 = 17,000。2020年は5年の範囲外。この17,000が通常所得に再分類され、残り48,000が長期キャピタルゲインとなる。なお再分類額は未回収§1250利益から先に減らすため、未回収§1250利益 = min(80,000, 65,000) − 17,000 = 48,000 となり、長期キャピタルゲイン48,000は全額25%区分である。</p>
<p>通常所得合計 = §1245 35,000 + ルックバック17,000 − トラック損失3,000 = 49,000。</p>`,
});

CPA.tbs({
  id: "TBS-REG-58", section: "REG", chapter: "REG-04", title: "債務の引受けを伴う§1031交換と収用(§1033)による代替資産の取得価額",
  scenario: `<p><b>Exhibit 1 — Like-kind exchange.</b> On April 1, 2026, Grace Park exchanged an apartment building held for investment for a warehouse held for investment owned by an unrelated party.</p>
<table><tr><th></th><th>Grace gives up: apartment building</th><th>Grace receives: warehouse</th></tr>
<tr><td>Fair market value</td><td>$900,000</td><td>$800,000</td></tr>
<tr><td>Grace's adjusted basis</td><td>$400,000</td><td>—</td></tr>
<tr><td>Mortgage on the property</td><td>$300,000 (assumed by the other party)</td><td>$250,000 (assumed by Grace)</td></tr>
<tr><td>Cash</td><td colspan="2">Grace receives $50,000 cash to equalize equity</td></tr></table>
<p><b>Exhibit 2 — Condemnation.</b> On June 15, 2026, the city condemned a parcel of land Grace held for use in her business (adjusted basis $150,000) and paid an award of $260,000. On March 1, 2027, Grace purchased replacement business real property for $230,000. Grace is a calendar-year taxpayer and elects to defer gain to the extent permitted.</p>
<p class="ja">資料1(同種交換):2026年4月1日、Grace Parkは投資用アパート(時価$900,000、調整後取得価額$400,000、抵当債務$300,000を相手方が引受け)を、非関連者所有の投資用倉庫(時価$800,000、抵当債務$250,000をGraceが引受け)と交換し、持分調整として現金$50,000を受け取った。資料2(収用):2026年6月15日、市はGraceの事業用土地(調整後取得価額$150,000)を収用し補償金$260,000を支払った。Graceは2027年3月1日に代替の事業用不動産を$230,000で購入した。暦年課税者で、可能な範囲で利益の繰延べを選択する。</p>`,
  rows: [
    { label: "Gain realized on the exchange(交換による実現利益)", type: "num", answer: 500000 },
    { label: "Boot received by Grace for gain recognition purposes(利益認識上Graceが受け取ったボート)", type: "select", options: ["$50,000 cash only", "$50,000 net liability relief only", "$100,000 ($50,000 cash + $50,000 net liability relief)", "$350,000 ($50,000 cash + $300,000 liability relief)"], answer: "$100,000 ($50,000 cash + $50,000 net liability relief)" },
    { label: "Gain recognized on the exchange(交換による認識利益)", type: "num", answer: 100000 },
    { label: "Grace's basis in the warehouse(倉庫の取得価額)", type: "num", answer: 400000 },
    { label: "Gain recognized on the condemnation(収用による認識利益)", type: "num", answer: 30000 },
    { label: "Basis of the replacement property(代替資産の取得価額)", type: "num", answer: 150000 },
    { label: "Last date to acquire qualified replacement property(適格代替資産の取得期限)", type: "select", options: ["June 15, 2028", "December 31, 2028", "December 31, 2029", "June 15, 2029"], answer: "December 31, 2029" },
  ],
  explain: `<p>実現額 = 倉庫時価800,000 + 現金50,000 + 債務免除300,000 − 引受債務250,000 = 900,000。実現利益 = 900,000 − 400,000 = 500,000。</p>
<p>ボート:引き受けた債務250,000は免除された債務300,000と相殺でき、純債務免除50,000がボート。受け取った現金50,000は引受債務と相殺できない。ボート合計100,000。</p>
<p>認識利益 = min(実現利益500,000, ボート100,000) = 100,000。</p>
<p>倉庫の取得価額 = 旧資産400,000 + 引受債務250,000 + 認識利益100,000 − 現金50,000 − 債務免除300,000 = 400,000(検算:時価800,000 − 繰延利益400,000)。</p>
<p>収用:実現利益 = 260,000 − 150,000 = 110,000。再投資しなかった額 260,000 − 230,000 = 30,000を認識。繰延利益80,000。代替資産の取得価額 = 230,000 − 80,000 = 150,000。</p>
<p>期限:事業用・投資用不動産の収用は、利益を実現した課税年度末から3年以内(2026年12月31日 + 3年 = 2029年12月31日)。</p>`,
});

CPA.tbs({
  id: "TBS-REG-59", section: "REG", chapter: "REG-04", title: "減価償却リキャプチャーを伴う割賦販売と関連者間売却(§267)の損失否認",
  scenario: `<p><b>Exhibit 1 — Installment sale.</b> On July 1, 2026, Victor Hale, a sole proprietor, sold a production machine to an unrelated buyer. The buyer paid $80,000 at closing and signed a note for $320,000 payable in four annual principal installments of $80,000 beginning July 1, 2027, with adequate stated interest. Victor did not elect out of the installment method.</p>
<table><tr><th>Machine data</th><th>Amount</th></tr>
<tr><td>Original cost</td><td>$300,000</td></tr>
<tr><td>Accumulated MACRS depreciation</td><td>$180,000</td></tr>
<tr><td>Selling price</td><td>$400,000</td></tr>
<tr><td>Selling expenses paid by Victor</td><td>$10,000</td></tr></table>
<p><b>Exhibit 2 — Related-party sale.</b> On August 1, 2026, Victor sold 1,000 shares of listed stock held for investment (basis $50,000) to his brother Paul for their fair market value of $35,000. On November 20, 2026, Paul sold all 1,000 shares to an unrelated party for $46,000.</p>
<p class="ja">資料1(割賦販売):2026年7月1日、個人事業主Victor Haleは製造機械を非関連者へ売却した。買手は引渡時に$80,000を支払い、残額$320,000は2027年7月1日から毎年$80,000ずつ4回払いの手形(適正な利息付き)とした。割賦基準の不適用は選択していない。機械の原価$300,000、MACRS償却累計額$180,000、売却価額$400,000、Victor負担の売却費用$10,000。資料2(関連者間売却):2026年8月1日、Victorは投資目的の上場株式1,000株(取得価額$50,000)を弟Paulに時価$35,000で売却した。Paulは2026年11月20日に全株を非関連者へ$46,000で売却した。</p>`,
  rows: [
    { label: "Total gain realized on the machine sale(機械売却の実現利益合計)", type: "num", answer: 270000 },
    { label: "Section 1245 ordinary income recognized in 2026(2026年に認識する§1245通常所得)", type: "num", answer: 180000 },
    { label: "Gross profit percentage applied to principal payments (%)(元本回収に適用する売上総利益率(%))", type: "num", answer: 22.5, tol: 0.01 },
    { label: "Total gain on the machine recognized in 2026(2026年に認識する機械売却益の合計)", type: "num", answer: 198000 },
    { label: "Section 1231 gain recognized in 2027 on the first note installment(2027年の第1回元本回収で認識する§1231利益)", type: "num", answer: 18000 },
    { label: "Loss Victor may deduct on the sale to Paul(Paulへの売却でVictorが控除できる損失)", type: "num", answer: 0 },
    { label: "Gain Paul recognizes on his resale for $46,000(Paulの$46,000での再売却による認識利益)", type: "num", answer: 0 },
    { label: "Sale to which buyer would NOT be subject to the §267 loss disallowance?(§267の損失否認の対象とならない買手)", type: "select", options: ["Victor's grandmother", "Victor's sister-in-law", "A corporation in which Victor owns 60% of the stock", "Victor's adult daughter"], answer: "Victor's sister-in-law" },
  ],
  explain: `<p>実現利益 = 売却価額400,000 − 売却費用10,000 − 帳簿価額(300,000 − 180,000 = 120,000) = 270,000。</p>
<p>§1245リキャプチャー:償却累計額180,000は割賦基準にかかわらず売却年度に全額認識する。</p>
<p>割賦基準:リキャプチャー額は取得価額に加算する。調整後基準額 = 120,000 + 10,000 + 180,000 = 310,000。売上総利益 = 400,000 − 310,000 = 90,000。契約価額400,000(債務引受なし)。売上総利益率 = 90,000 ÷ 400,000 = 22.5%。</p>
<p>2026年:頭金80,000 × 22.5% = 18,000(§1231利益)。2026年の合計 = 180,000 + 18,000 = 198,000。2027年:80,000 × 22.5% = 18,000。</p>
<p>§267:兄弟姉妹は関連者であり、損失15,000(50,000 − 35,000)は否認される。Paulの取得価額は35,000で、再売却益11,000は否認された損失15,000の範囲で減額されるため認識利益0(残る4,000の否認損失は消滅する)。</p>
<p>関連者:家族は兄弟姉妹・配偶者・直系尊属・直系卑属に限られ、義理の姉妹は含まれない。50%超を所有する法人は関連者である。</p>`,
});

CPA.tbs({
  id: "TBS-REG-60", section: "REG", chapter: "REG-04", title: "§179即時償却の段階的縮小・100%ボーナス償却(OBBBA)・MACRS減価償却スケジュール",
  scenario: `<p>Brightline Fabrication Inc., a calendar-year C corporation, placed the following new assets in service in 2026. All property was acquired by binding contracts entered into after January 19, 2025. Brightline's taxable income from the active conduct of its business (before §179) is $5,000,000.</p>
<table><tr><th>Asset</th><th>MACRS class</th><th>Placed in service</th><th>Cost</th></tr>
<tr><td>Production machinery</td><td>7-year</td><td>March 10, 2026</td><td>$3,000,000</td></tr>
<tr><td>Office furniture</td><td>7-year</td><td>June 5, 2026</td><td>$400,000</td></tr>
<tr><td>Computers and servers</td><td>5-year</td><td>November 12, 2026</td><td>$900,000</td></tr>
<tr><td>Office building (land excluded)</td><td>39-year nonresidential real property</td><td>February 2, 2026</td><td>$2,000,000</td></tr></table>
<p><b>Assumptions and elections:</b> For 2026, assume the §179 dollar limit is <b>$2,560,000</b>, reduced dollar-for-dollar by the cost of §179 property placed in service in excess of <b>$4,090,000</b>. Under the One Big Beautiful Bill Act, 100% bonus depreciation applies to qualified property acquired after January 19, 2025. Brightline (1) elects the maximum §179 deduction, applied entirely to the production machinery; (2) elects out of bonus depreciation for the 7-year class; and (3) claims bonus depreciation on the 5-year class. First-year MACRS table rates: 7-year half-year 14.29%; 5-year half-year 20.00%; 39-year property placed in service in February 2.247%.</p>
<p class="ja">暦年決算のC法人Brightline Fabrication社は2026年に次の新規資産を事業の用に供した(いずれも2025年1月19日後に締結した拘束力ある契約で取得)。事業からの課税所得(§179控除前)は$5,000,000。資産:製造機械(7年、2026/3/10、$3,000,000)、事務用家具(7年、6/5、$400,000)、コンピュータ・サーバー(5年、11/12、$900,000)、事務所建物(土地除く、39年非住宅用不動産、2/2、$2,000,000)。前提と選択:2026年の§179上限は$2,560,000とし、§179対象資産の供用額が$4,090,000を超える額だけ1ドルずつ減額される。OBBBAにより2025年1月19日後取得の適格資産には100%ボーナス償却が適用される。同社は(1)§179の最大額を全額製造機械に適用し、(2)7年クラスについてボーナス償却の不適用を選択し、(3)5年クラスにはボーナス償却を適用する。初年度MACRS表の率:7年・ハーフイヤー14.29%、5年・ハーフイヤー20.00%、2月供用の39年資産2.247%。</p>`,
  rows: [
    { label: "Maximum §179 deduction for 2026 after the phase-out(段階的縮小後の2026年の§179最大控除額)", type: "num", answer: 2350000 },
    { label: "Applicable convention for the 7-year and 5-year property(7年・5年資産に適用される期中慣行)", type: "select", options: ["Half-year convention", "Mid-quarter convention", "Mid-month convention", "Full-month convention"], answer: "Half-year convention" },
    { label: "Regular MACRS depreciation on the machinery after §179(§179適用後の機械の通常MACRS償却費)", type: "num", answer: 92885 },
    { label: "Regular MACRS depreciation on the office furniture(事務用家具の通常MACRS償却費)", type: "num", answer: 57160 },
    { label: "Bonus depreciation on the computers and servers(コンピュータ・サーバーのボーナス償却額)", type: "num", answer: 900000 },
    { label: "MACRS depreciation on the office building(事務所建物のMACRS償却費)", type: "num", answer: 44940 },
    { label: "Total 2026 cost recovery deduction (§179 + bonus + MACRS)(2026年の費用回収控除の合計)", type: "num", answer: 3444985 },
  ],
  explain: `<p>§179:対象資産(機械・家具・コンピュータ。建物は対象外)の供用額 = 3,000,000 + 400,000 + 900,000 = 4,300,000。超過額 = 4,300,000 − 4,090,000 = 210,000。上限 = 2,560,000 − 210,000 = 2,350,000。課税所得制限5,000,000は拘束しない。</p>
<p>期中慣行:第4四半期の供用額900,000 ÷ 動産合計(§179控除分2,350,000を除外すると1,950,000、除外しなくても4,300,000)は40%以下(約46%?の誤りに注意:900,000 ÷ 1,950,000 = 46.2%となるが、§179を除外した後の基準でも判定する必要がある)。</p>
<p>機械:(3,000,000 − 2,350,000) × 14.29% = 650,000 × 14.29% = 92,885。家具:400,000 × 14.29% = 57,160(7年クラスはボーナス不適用を選択)。</p>
<p>コンピュータ:100%ボーナス償却 = 900,000(残額0のため通常MACRSなし)。</p>
<p>建物:39年資産はボーナス対象外、月央慣行。2,000,000 × 2.247% = 44,940。</p>
<p>合計 = 2,350,000 + 92,885 + 57,160 + 900,000 + 44,940 = 3,444,985。</p>`,
});
