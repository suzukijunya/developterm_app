// TCP のTBS追加(個人の税務計画:贈与・基準価額・株式報酬・退職分配・パッシブ・§121・キディ税・教育控除・寄附・見積納税)

CPA.tbs({ id: "TBS-TCP-21", section: "TCP", chapter: "TCP-01", title: "Form 709の課税贈与額:医療費・授業料・配偶者・慈善・将来権利",
  scenario: `<p>Lena, a U.S. citizen married to a U.S. citizen, made the following transfers in 2026. Her spouse does <b>not</b> consent to gift splitting. Assume an annual exclusion of <b>$19,000</b> per donee and a basic exclusion amount of <b>$15,000,000</b> for 2026 (as provided by the One Big Beautiful Bill Act). Lena's taxable gifts in prior years total <b>$2,000,000</b>; no gift tax was ever paid.</p>
<table><tr><th>#</th><th>Transfer in 2026</th><th>Amount</th></tr>
<tr><td>1</td><td>Cash to adult son</td><td>$50,000</td></tr>
<tr><td>2</td><td>Payment made directly to a hospital for the son's surgery</td><td>$12,000</td></tr>
<tr><td>3</td><td>Cash paid to the son to reimburse him for tuition he had already paid to his university</td><td>$20,000</td></tr>
<tr><td>4</td><td>Publicly traded stock transferred outright to her husband</td><td>$200,000</td></tr>
<tr><td>5</td><td>Land transferred outright to a public charity</td><td>$300,000</td></tr>
<tr><td>6</td><td>Cash to a friend</td><td>$15,000</td></tr>
<tr><td>7</td><td>Remainder interest in a vacation home (Lena keeps a life estate) to granddaughter; value of remainder</td><td>$40,000</td></tr></table>
<p class="ja">米国市民のLenaは米国市民の夫と婚姻しており、2026年に上表の移転を行った。夫は贈与分割に同意していない。2026年の年間非課税枠は受贈者1人当たり$19,000、基礎控除額(OBBBAによる)は$15,000,000とする。過年度の課税贈与累計は$2,000,000で、贈与税の納付実績はない。移転:(1)成人の息子へ現金$50,000、(2)息子の手術代として病院へ直接支払い$12,000、(3)息子が既に大学へ支払った授業料を息子に現金で補填$20,000、(4)上場株式を夫へ無条件で移転$200,000、(5)土地を公益慈善団体へ無条件で移転$300,000、(6)友人へ現金$15,000、(7)別荘の残余権(Lenaが生涯権を保持)を孫娘へ$40,000。</p>`,
  rows: [
    { label: "Taxable gift to the son after the annual exclusion(年間非課税枠控除後の息子への課税贈与額)", type: "num", answer: 51000 },
    { label: "Marital deduction for the transfer to her husband(夫への移転に係る配偶者控除額)", type: "num", answer: 181000 },
    { label: "Taxable gift to the granddaughter(孫娘への課税贈与額)", type: "num", answer: 40000 },
    { label: "Total 2026 taxable gifts(2026年の課税贈与合計)", type: "num", answer: 91000 },
    { label: "Gift tax payable for 2026(2026年の納付贈与税額)", type: "num", answer: 0 },
    { label: "Basic exclusion amount remaining after 2026 gifts(2026年の贈与後に残る基礎控除額)", type: "num", answer: 12909000 },
    { label: "Treatment of transfer #3 (tuition reimbursement)(移転3:授業料の補填の扱い)", type: "select", options: ["Excluded without limit under §2503(e) because it relates to tuition", "Not a §2503(e) exclusion because it was not paid directly to the institution; it is combined with other gifts to the son", "Excluded because it is a medical or educational support obligation of a parent", "Treated as a future-interest gift with no annual exclusion"], answer: "Not a §2503(e) exclusion because it was not paid directly to the institution; it is combined with other gifts to the son" },
  ],
  explain: `<p><b>息子</b>:病院への直接支払い12,000は§2503(e)により無制限に非課税で年間非課税枠も使わない。授業料の補填20,000は教育機関への直接支払いではないため非課税にならず、現金50,000と合算する。(50,000 + 20,000) − 19,000 = <b>51,000</b>。</p>
<p><b>夫</b>:米国市民の配偶者への無条件移転は無制限の配偶者控除の対象。年間非課税枠19,000を先に控除し、残額 200,000 − 19,000 = <b>181,000</b>を配偶者控除とする(課税贈与0)。</p>
<p><b>慈善団体</b>:300,000 − 19,000 = 281,000が慈善控除となり課税贈与0。<b>友人</b>:15,000 ≤ 19,000で0。</p>
<p><b>孫娘</b>:残余権は将来権利(future interest)のため年間非課税枠が使えず、<b>40,000</b>全額が課税贈与。</p>
<p>課税贈与合計 = 51,000 + 40,000 = <b>91,000</b>。累計課税贈与 2,000,000 + 91,000 = 2,091,000 は基礎控除額15,000,000以下のため統一税額控除で全額相殺され、納付税額 <b>0</b>。残る基礎控除額 = 15,000,000 − 2,091,000 = <b>12,909,000</b>。非課税枠超過の贈与と将来権利の贈与があるためForm 709の提出は必要である。</p>`,
});

CPA.tbs({ id: "TBS-TCP-22", section: "TCP", chapter: "TCP-01", title: "贈与・相続財産の基準価額:保有期間・代替評価日・§1014(e)・夫婦共有",
  scenario: `<p>Answer each independent case. Enter a loss as a negative number. No gift tax was paid.</p>
<table><tr><th>Case</th><th>Facts</th></tr>
<tr><td>A</td><td>Kai received stock as a gift from his father. Father's basis <b>$60,000</b> (held 3 years); FMV at the gift date <b>$45,000</b>. Kai sold the stock <b>4 months</b> after the gift for <b>$40,000</b>.</td></tr>
<tr><td>B</td><td>Nami inherited land from her aunt. Aunt's basis <b>$100,000</b>; FMV at the date of death <b>$400,000</b>; FMV six months after death <b>$350,000</b>. The executor validly elected the alternate valuation date (the land was not distributed or sold within six months). Nami sold the land <b>8 months</b> after the aunt's death for <b>$370,000</b>.</td></tr>
<tr><td>C</td><td>Sam gave stock (basis <b>$10,000</b>, FMV <b>$90,000</b>) to his elderly uncle. The uncle died <b>8 months</b> later and bequeathed the same stock back to Sam; FMV at the uncle's death was <b>$100,000</b>.</td></tr>
<tr><td>D</td><td>Rin and her husband (common-law state) bought a home as joint tenants with right of survivorship for <b>$200,000</b>. The husband died when the home was worth <b>$600,000</b>.</td></tr></table>
<p class="ja">各ケースは独立している。損失はマイナスで入力する。贈与税の支払いはない。A:Kaiは父から株式を贈与された(父の取得価額$60,000、保有3年、贈与時時価$45,000)。贈与の4か月後に$40,000で売却。B:Namiは叔母から土地を相続した(叔母の取得価額$100,000、死亡時時価$400,000、死亡6か月後の時価$350,000)。遺言執行者は代替評価日を有効に選択した(6か月以内の分配・売却なし)。死亡の8か月後に$370,000で売却。C:Samは株式(取得価額$10,000、時価$90,000)を高齢の叔父に贈与した。叔父は8か月後に死亡し、同じ株式をSamに遺贈した(死亡時時価$100,000)。D:Rinと夫(コモンロー州)は自宅を$200,000で生存者権付き合有として購入した。夫の死亡時の時価は$600,000。</p>`,
  rows: [
    { label: "Case A: Kai's recognized gain (loss)(ケースA:Kaiの認識損益)", type: "num", answer: -5000 },
    { label: "Case A: character of the gain or loss(ケースA:損益の性格)", type: "select", options: ["Long-term, because the donor's holding period tacks", "Short-term, because the FMV basis is used and the holding period starts at the gift date", "Long-term, because gifted property is always long-term", "Ordinary loss under §1244"], answer: "Short-term, because the FMV basis is used and the holding period starts at the gift date" },
    { label: "Case B: Nami's basis in the land(ケースB:Namiの土地の取得価額)", type: "num", answer: 350000 },
    { label: "Case B: Nami's recognized gain (loss)(ケースB:Namiの認識損益)", type: "num", answer: 20000 },
    { label: "Case C: Sam's basis in the stock he inherits(ケースC:Samが相続した株式の取得価額)", type: "num", answer: 10000 },
    { label: "Case D: Rin's basis in the home after her husband's death(ケースD:夫死亡後のRinの自宅の取得価額)", type: "num", answer: 400000 },
    { label: "Case D: Rin's basis if the home had been community property(ケースD:自宅が夫婦共有財産(community property)だった場合の取得価額)", type: "num", answer: 600000 },
  ],
  explain: `<p><b>A</b>:贈与時時価45,000 < 贈与者の取得価額60,000のため二重基準。売却額40,000は時価を下回るので、損失計算用の基準価額(時価)45,000を用い 40,000 − 45,000 = <b>−5,000</b>。時価を基準価額とする場合は贈与者の保有期間を通算できず、贈与日から起算するため4か月で<b>短期</b>となる。</p>
<p><b>B</b>:代替評価日を選択したので基準価額は6か月後の時価 <b>350,000</b>。370,000 − 350,000 = <b>20,000</b>。相続財産は保有期間にかかわらず常に長期である。</p>
<p><b>C</b>:§1014(e)により、死亡前1年以内に贈与された値上り資産が贈与者(またはその配偶者)に戻る場合、ステップアップは認められず、被相続人の死亡直前の取得価額 <b>10,000</b>を引き継ぐ。</p>
<p><b>D</b>:配偶者間の合有財産は半分のみが夫の遺産に含まれる。Rin自身の持分100,000 + 夫の持分の死亡時時価 600,000 × 1/2 = 300,000 → <b>400,000</b>。夫婦共有財産であれば両方の持分がステップアップされ <b>600,000</b>となる。</p>`,
});

CPA.tbs({ id: "TBS-TCP-23", section: "TCP", chapter: "TCP-01", title: "RSU・ISOの不適格処分・§83(b)選択とAMT調整",
  scenario: `<p>Aya is an employee of Tech Co., a publicly traded corporation. Her 2026 equity compensation events are below. All options were granted at an exercise price equal to FMV and had no readily ascertainable value at grant.</p>
<table><tr><th>Award</th><th>Facts</th></tr>
<tr><td>RSUs</td><td>500 restricted stock units granted in 2023 (FMV $40). Units vested and were settled in shares on April 1, 2026 when FMV was <b>$60</b>. Aya sold the 500 shares on October 1, 2026 for <b>$70</b> per share.</td></tr>
<tr><td>ISO grant #1</td><td>Granted 2023; 1,000 shares, exercise price <b>$20</b>. Exercised March 2026 when FMV was <b>$50</b>. All shares sold November 2026 for <b>$45</b> per share.</td></tr>
<tr><td>ISO grant #2</td><td>Granted 2024; 2,000 shares, exercise price <b>$5</b>. Exercised December 2026 when FMV was <b>$25</b>. Shares still held at year-end.</td></tr>
<tr><td>Restricted stock</td><td>1,000 shares issued to Aya in February 2026 for no payment when FMV was <b>$3</b>; shares vest in 2028. Aya filed a timely §83(b) election.</td></tr></table>
<p class="ja">Ayaは上場企業Tech社の従業員である。オプションはすべて時価と等しい行使価格で付与され、付与時に容易に算定可能な価値はない。RSU:2023年に500単位付与(時価$40)、2026年4月1日に時価$60で権利確定し株式で決済。2026年10月1日に1株$70で500株を売却。ISO#1:2023年付与、1,000株、行使価格$20。2026年3月に時価$50で行使し、2026年11月に1株$45で全株売却。ISO#2:2024年付与、2,000株、行使価格$5。2026年12月に時価$25で行使し、年末時点で保有。譲渡制限株式:2026年2月に時価$3の株式1,000株を無償で受領、2028年に権利確定。期限内に§83(b)選択を行った。</p>`,
  rows: [
    { label: "RSUs: ordinary (wage) income in 2026(RSU:2026年の通常所得(給与))", type: "num", answer: 30000 },
    { label: "RSUs: capital gain on the October sale(RSU:10月の売却によるキャピタルゲイン)", type: "num", answer: 5000 },
    { label: "RSU sale gain is(RSU売却益の性格)", type: "select", options: ["Long-term, because the holding period runs from the 2023 grant", "Short-term, because the holding period begins at vesting", "Ordinary income", "Excluded under §83(i)"], answer: "Short-term, because the holding period begins at vesting" },
    { label: "ISO #1: ordinary income from the disqualifying disposition(ISO#1:不適格処分による通常所得)", type: "num", answer: 25000 },
    { label: "ISO #1: capital gain (loss) on the sale(ISO#1:売却によるキャピタル損益)", type: "num", answer: 0 },
    { label: "Total 2026 AMT adjustment from ISO exercises(ISO行使による2026年のAMT調整額合計)", type: "num", answer: 40000 },
    { label: "ISO #2: AMT basis in the shares(ISO#2:株式のAMT上の取得価額)", type: "num", answer: 50000 },
    { label: "Restricted stock: ordinary income recognized in 2026(譲渡制限株式:2026年に認識する通常所得)", type: "num", answer: 3000 },
  ],
  explain: `<p><b>RSU</b>:付与時は課税なし。権利確定・決済時に 500 × 60 = <b>30,000</b>を給与所得として認識し、株式の取得価額は30,000。売却益 500 × (70 − 60) = <b>5,000</b>。保有期間は確定日から起算するため6か月で<b>短期</b>。</p>
<p><b>ISO#1</b>:行使から1年以内の売却は保有要件を満たさないため不適格処分となる。通常所得 = 行使時の差益 (50 − 20) × 1,000 = 30,000 と実際の利益 (45 − 20) × 1,000 = 25,000 の少ない方 = <b>25,000</b>。取得価額は 20,000 + 25,000 = 45,000、売却額45,000のためキャピタル損益は <b>0</b>。</p>
<p><b>AMT</b>:行使と同一年に不適格処分したISO#1はAMT調整が不要(通常税で既に所得計上)。ISO#2の差益 (25 − 5) × 2,000 = <b>40,000</b>のみが加算調整。ISO#2の通常税上の取得価額は10,000、AMT上は 10,000 + 40,000 = <b>50,000</b>。</p>
<p><b>譲渡制限株式</b>:§83(b)選択により受領時の時価 1,000 × 3 = <b>3,000</b>を2026年に通常所得として認識。2028年の権利確定時には課税されず、将来の値上り益はキャピタルゲインとなる。</p>`,
});

CPA.tbs({ id: "TBS-TCP-24", section: "TCP", chapter: "TCP-01", title: "Roth IRAの分配順序(転換の5年ルール)と10%追加税の例外",
  scenario: `<p>Kenji, age 45, files jointly. His 2026 AGI is <b>$100,000</b> (including the traditional IRA distribution below). He received the following in 2026:</p>
<table><tr><th>Account</th><th>Facts</th></tr>
<tr><td>Roth IRA (first opened in 2015)</td><td>Before the distribution: regular contributions <b>$18,000</b>; conversion in 2022 <b>$30,000</b> (fully taxable when converted); conversion in 2024 <b>$20,000</b> (fully taxable when converted); earnings <b>$12,000</b>. Distribution in 2026: <b>$60,000</b>, of which <b>$10,000</b> was used to buy his first principal residence (no prior first-time homebuyer distributions).</td></tr>
<tr><td>Traditional IRA (no basis)</td><td>Distribution in 2026: <b>$15,000</b>. Kenji paid <b>$13,000</b> of unreimbursed deductible medical expenses in 2026, and his child was born in 2026; he designates <b>$5,000</b> of the distribution as a qualified birth or adoption distribution.</td></tr></table>
<p class="ja">45歳のKenjiは夫婦合算申告で、2026年のAGIは$100,000(下記の伝統的IRA分配を含む)である。Roth IRA(2015年に初めて開設):分配前の内訳は通常拠出$18,000、2022年の転換$30,000(転換時に全額課税済み)、2024年の転換$20,000(同)、運用益$12,000。2026年に$60,000の分配を受け、うち$10,000で初めての主たる住居を購入した(初回住宅購入の分配は過去になし)。伝統的IRA(取得価額なし):2026年に$15,000の分配。2026年に補填されない控除対象医療費$13,000を支払い、同年に子が誕生したため分配のうち$5,000を適格出産・養子縁組分配として指定した。</p>`,
  rows: [
    { label: "Taxable amount of the Roth IRA distribution(Roth IRA分配の課税額)", type: "num", answer: 0 },
    { label: "Roth distribution amount subject to the 10% additional tax before any exception(例外適用前に10%追加税の対象となるRoth分配額)", type: "num", answer: 42000 },
    { label: "10% additional tax on the Roth IRA distribution(Roth IRA分配に係る10%追加税)", type: "num", answer: 3200 },
    { label: "Taxable amount of the traditional IRA distribution(伝統的IRA分配の課税額)", type: "num", answer: 15000 },
    { label: "10% additional tax on the traditional IRA distribution(伝統的IRA分配に係る10%追加税)", type: "num", answer: 450 },
    { label: "Total 10% additional tax for 2026(2026年の10%追加税合計)", type: "num", answer: 3650 },
    { label: "Required minimum distributions from Kenji's Roth IRA during his lifetime(Kenji存命中のRoth IRAの最低必要分配)", type: "select", options: ["Begin at age 73", "Begin at age 75", "Not required while the owner is alive", "Required only after the five-year period ends"], answer: "Not required while the owner is alive" },
  ],
  explain: `<p><b>Roth</b>:59½歳未満のため適格分配ではなく、順序規則が適用される:①通常拠出 → ②転換額(古い順、各転換の課税済部分から) → ③運用益。60,000 = 拠出18,000 + 2022年転換30,000 + 2024年転換12,000。運用益には到達しないので課税額は <b>0</b>。</p>
<p>転換額には転換年の1月1日から起算する転換ごとの5年ルールがある。2022年転換の5年間は2022〜2026年で、2026年の分配はまだ期間内。2024年転換も期間内。よって追加税の対象は 30,000 + 12,000 = <b>42,000</b>。初回住宅購入の例外(生涯$10,000)を差し引き (42,000 − 10,000) × 10% = <b>3,200</b>。</p>
<p><b>伝統的IRA</b>:取得価額がないため <b>15,000</b>全額が課税。例外:医療費のAGI 7.5%超過額 13,000 − 100,000 × 7.5% = 5,500(項目別控除の有無を問わない)と、出産分配5,000。対象額 15,000 − 5,500 − 5,000 = 4,500 × 10% = <b>450</b>。</p>
<p>合計 3,200 + 450 = <b>3,650</b>。Roth IRAは所有者の存命中はRMDが不要である。</p>`,
});

CPA.tbs({ id: "TBS-TCP-25", section: "TCP", chapter: "TCP-01", title: "基準価額・アットリスク・パッシブの3段階制限と停止損失",
  scenario: `<p>Rio is a limited partner in Harbor LP, an equipment leasing partnership in which she does not materially participate. She is not a real estate professional. At the beginning of Year 1:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Cash contributed by Rio</td><td>$20,000</td></tr>
<tr><td>Rio's share of Harbor LP nonrecourse liabilities (not qualified nonrecourse financing)</td><td>$30,000</td></tr></table>
<p>Rio's distributive share of Harbor LP's results: Year 1 ordinary loss <b>$(45,000)</b>; Year 2 ordinary income <b>$10,000</b>. Her only other passive activity, Delta LLC, produced net passive income of <b>$8,000</b> in Year 1 and $0 in Year 2. Harbor LP made no distributions, and its liabilities did not change.</p>
<p class="ja">RioはHarbor LP(設備リースのパートナーシップ)のリミテッド・パートナーで、実質的に関与していない。不動産専門家ではない。第1年度期首:Rioの出資現金$20,000、Harbor LPのノンリコース負債のRio持分$30,000(適格ノンリコース融資ではない)。Rioの持分損益:第1年度は通常損失$(45,000)、第2年度は通常所得$10,000。他の唯一のパッシブ活動Delta LLCの純パッシブ所得は第1年度$8,000、第2年度$0。分配はなく、負債も変動していない。</p>`,
  rows: [
    { label: "Year 1 loss allowed under the basis limitation (§704(d))(第1年度:基準価額制限を通過する損失)", type: "num", answer: 45000 },
    { label: "Year 1 loss suspended under the at-risk rules (§465)(第1年度:アットリスク規定で停止される損失)", type: "num", answer: 25000 },
    { label: "Year 1 Harbor loss deductible after the passive activity rules(第1年度:パッシブ規定適用後に控除できるHarborの損失)", type: "num", answer: 8000 },
    { label: "Year 1 suspended passive activity loss(第1年度:停止されるパッシブ損失)", type: "num", answer: 12000 },
    { label: "Rio's outside basis at the end of Year 1(第1年度末のRioの持分基準価額)", type: "num", answer: 5000 },
    { label: "Year 2 at-risk carryover loss allowed under §465(第2年度:§465上で認められるアットリスク繰越損失)", type: "num", answer: 10000 },
    { label: "Total suspended losses (at-risk plus passive) carried to Year 3(第3年度へ繰り越される停止損失合計(アットリスク+パッシブ))", type: "num", answer: 27000 },
    { label: "Which liability would have increased Rio's amount at risk?(Rioのアットリスク額を増加させた負債は)", type: "select", options: ["Nonrecourse loan from the equipment seller", "Qualified nonrecourse financing secured by real property from a commercial lender", "Nonrecourse loan from another partner", "Any nonrecourse liability included in outside basis"], answer: "Qualified nonrecourse financing secured by real property from a commercial lender" },
  ],
  explain: `<p>損失は①基準価額 → ②アットリスク → ③パッシブの順に判定する。</p>
<p>①基準価額 = 20,000 + 30,000 = 50,000 ≥ 45,000 → <b>45,000</b>が通過。②アットリスク額は現金20,000のみ(適格でないノンリコース負債は含まない)→ 20,000を通過し <b>25,000</b>を停止。③パッシブ損失20,000はパッシブ所得(Delta 8,000)の範囲でのみ控除 → <b>8,000</b>控除、<b>12,000</b>停止。</p>
<p>期末基準価額 = 50,000 − 45,000 = <b>5,000</b>(§704(d)を通過した損失は、アットリスクで停止されていても基準価額を減らす)。</p>
<p>第2年度:持分所得10,000でアットリスク額が0 → 10,000に増加し、アットリスク繰越損失25,000のうち <b>10,000</b>が通過。Harborの所得10,000と通過損失10,000は相殺されて純額0、他のパッシブ所得もないため、過年度の停止パッシブ損失12,000は使えない。繰越合計 = アットリスク 25,000 − 10,000 = 15,000 + パッシブ12,000 = <b>27,000</b>。</p>
<p>適格ノンリコース融資(不動産を担保とする商業金融機関等からの借入)のみがノンリコースでもアットリスク額に含まれる。売主や関係者からのノンリコース借入は含まれない。</p>`,
});

CPA.tbs({ id: "TBS-TCP-26", section: "TCP", chapter: "TCP-01", title: "§121の非適格使用期間・減価償却と転勤による部分的除外",
  scenario: `<p><b>Part 1.</b> Sora, single, purchased a house on January 1, 2017 for <b>$300,000</b>. Use history:</p>
<table><tr><th>Period</th><th>Use</th><th>Depreciation claimed</th></tr>
<tr><td>Jan 1, 2017 – Dec 31, 2018 (2 years)</td><td>Rented to tenants</td><td>$20,000</td></tr>
<tr><td>Jan 1, 2019 – Dec 31, 2024 (6 years)</td><td>Sora's principal residence</td><td>—</td></tr>
<tr><td>Jan 1, 2025 – Dec 31, 2026 (2 years)</td><td>Rented to tenants after Sora moved out</td><td>$20,000</td></tr></table>
<p>Sora sold the house on December 31, 2026 for <b>$800,000</b> and paid selling expenses of <b>$20,000</b>. She has not used §121 on any other sale.</p>
<p><b>Part 2.</b> Independently, Ben, single, bought a home on October 1, 2025 and used it as his principal residence until he sold it on December 31, 2026 (15 months), realizing a gain of <b>$200,000</b>. He sold because his employer transferred him to a job 300 miles away.</p>
<p class="ja">【第1部】独身のSoraは2017年1月1日に住宅を$300,000で購入した。2017年1月1日〜2018年12月31日(2年)は賃貸(減価償却$20,000)、2019年1月1日〜2024年12月31日(6年)は主たる住居、2025年1月1日〜2026年12月31日(2年)は転居後に賃貸(減価償却$20,000)。2026年12月31日に$800,000で売却し、売却費用$20,000を支払った。他の売却で§121を使っていない。【第2部】別のケースとして、独身のBenは2025年10月1日に自宅を購入し、2026年12月31日の売却まで(15か月)主たる住居として使用し、売却益$200,000を実現した。勤務先の転勤命令(300マイル離れた勤務地)が売却理由である。</p>`,
  rows: [
    { label: "Part 1: Sora's realized gain(第1部:Soraの実現利益)", type: "num", answer: 520000 },
    { label: "Part 1: gain ineligible for exclusion because of post-May 6, 1997 depreciation(第1部:減価償却のため除外対象外となる利益)", type: "num", answer: 40000 },
    { label: "Part 1: gain allocated to nonqualified use(第1部:非適格使用期間に配分される利益)", type: "num", answer: 96000 },
    { label: "Part 1: §121 exclusion(第1部:§121の除外額)", type: "num", answer: 250000 },
    { label: "Part 1: total recognized gain(第1部:認識利益合計)", type: "num", answer: 270000 },
    { label: "Part 1: the 2025–2026 rental period is(第1部:2025〜2026年の賃貸期間の扱い)", type: "select", options: ["Nonqualified use, because the home was not a residence", "Not nonqualified use, because it follows the last use as a principal residence and is within the 5-year look-back period", "Disqualifying, because Sora fails the 2-out-of-5-year use test", "Counted as qualified use only if Sora rented to a relative"], answer: "Not nonqualified use, because it follows the last use as a principal residence and is within the 5-year look-back period" },
    { label: "Part 2: Ben's maximum reduced exclusion(第2部:Benの減額後の除外上限額)", type: "num", answer: 156250 },
    { label: "Part 2: Ben's recognized gain(第2部:Benの認識利益)", type: "num", answer: 43750 },
  ],
  explain: `<p><b>第1部</b>:実現額 800,000 − 20,000 = 780,000、調整後取得価額 300,000 − 40,000 = 260,000 → 実現利益 <b>520,000</b>。1997年5月6日以後の減価償却 <b>40,000</b>は除外できず、未回収§1250利益(最高25%)として課税される。</p>
<p>非適格使用:2009年以降で主たる住居として使用していない期間のうち、最後に住居として使用した後の期間(5年以内)は除かれる。よって非適格使用は2017〜2018年の2年のみ。所有期間10年。配分 = (520,000 − 40,000) × 2/10 = <b>96,000</b>。</p>
<p>除外対象となりうる利益 = 480,000 − 96,000 = 384,000。過去5年(2022〜2026年)のうち3年を住居として使用し所有・使用要件を満たすので、独身の上限 <b>250,000</b>を除外。認識利益 = 40,000 + 96,000 + (384,000 − 250,000) = <b>270,000</b>。</p>
<p><b>第2部</b>:2年要件を満たさないが、雇用場所の変更(50マイル超)による売却は部分的除外が認められる。250,000 × 15/24 = <b>156,250</b>。認識利益 = 200,000 − 156,250 = <b>43,750</b>。</p>`,
});

CPA.tbs({ id: "TBS-TCP-27", section: "TCP", chapter: "TCP-01", title: "キディ税:勤労所得と不労所得がある子の税額計算",
  scenario: `<p>Emi, age 15, is claimed as a dependent by her parents, who file jointly. Emi's only income in 2026:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Wages from a part-time job</td><td>$2,000</td></tr>
<tr><td>Interest from a custodial (UTMA) account</td><td>$6,000</td></tr></table>
<p>Assume for 2026: a dependent's standard deduction is the greater of <b>$1,350</b> or earned income plus <b>$450</b> (not to exceed the regular standard deduction); net unearned income is unearned income minus <b>$2,700</b> (two times $1,350, since Emi has no itemized deductions). The parents' marginal tax rate is <b>32%</b> on all additional income, and Emi's own rate on her remaining taxable income is <b>10%</b>.</p>
<p class="ja">15歳のEmiは夫婦合算申告をする両親の被扶養者である。2026年のEmiの所得はアルバイトの給与$2,000と、未成年者口座(UTMA)の利息$6,000のみ。2026年について次を仮定する:被扶養者の標準控除は$1,350と勤労所得+$450のいずれか大きい額(通常の標準控除が上限)、純不労所得は不労所得から$2,700($1,350の2倍。Emiに項目別控除はない)を控除した額。両親の限界税率は追加所得の全額について32%、Emiの残りの課税所得に対する税率は10%とする。</p>`,
  rows: [
    { label: "Emi's standard deduction(Emiの標準控除額)", type: "num", answer: 2450 },
    { label: "Emi's taxable income(Emiの課税所得)", type: "num", answer: 5550 },
    { label: "Net unearned income taxed at the parents' rate(両親の税率で課税される純不労所得)", type: "num", answer: 3300 },
    { label: "Tax on net unearned income at the parents' rate(純不労所得に対する両親の税率での税額)", type: "num", answer: 1056 },
    { label: "Tax on the remaining taxable income at Emi's rate(残りの課税所得に対するEmiの税率での税額)", type: "num", answer: 225 },
    { label: "Emi's total 2026 income tax(Emiの2026年の所得税合計)", type: "num", answer: 1281 },
    { label: "May the parents elect to report Emi's income on their own return (Form 8814)?(両親はEmiの所得を自身の申告書で申告する選択(Form 8814)ができるか)", type: "select", options: ["Yes, because Emi is under age 19", "Yes, because her unearned income is less than $13,500", "No, because Emi has earned income (the election is limited to children with only interest, dividends and capital gain distributions)", "No, because the election applies only to single parents"], answer: "No, because Emi has earned income (the election is limited to children with only interest, dividends and capital gain distributions)" },
  ],
  explain: `<p>標準控除 = max(1,350, 2,000 + 450) = <b>2,450</b>。総所得 2,000 + 6,000 = 8,000 → 課税所得 8,000 − 2,450 = <b>5,550</b>。</p>
<p>純不労所得 = 6,000 − 2,700 = <b>3,300</b>(課税所得5,550以下なので全額)。両親の税率で 3,300 × 32% = <b>1,056</b>。</p>
<p>残り 5,550 − 3,300 = 2,250 × 10% = <b>225</b>。合計 1,056 + 225 = <b>1,281</b>。</p>
<p>Form 8814の選択は、子の所得が利息・配当・キャピタルゲイン分配のみで一定額未満の場合に限られる。Emiは給与所得があるため選択できず、自身でForm 8615を添付して申告する。</p>`,
});

CPA.tbs({ id: "TBS-TCP-28", section: "TCP", chapter: "TCP-01", title: "AOTCとLLCの選択・フェーズアウトと529分配の調整",
  scenario: `<p>Hiro and Yuna file jointly; their 2026 modified AGI is <b>$170,000</b>. They claim both children as dependents. Assume the AOTC and the lifetime learning credit (LLC) each phase out ratably for joint filers between modified AGI of <b>$160,000</b> and <b>$180,000</b>.</p>
<table><tr><th>Student</th><th>2026 facts</th></tr>
<tr><td>Daughter Mei</td><td>Second-year undergraduate, enrolled full-time in a degree program; no felony drug conviction; AOTC claimed in one prior year. Tuition <b>$14,000</b>; required textbooks bought at the campus bookstore <b>$1,000</b>; on-campus room and board <b>$12,000</b> (equal to the school's allowance). A §529 plan distributed <b>$10,000</b> to pay her expenses.</td></tr>
<tr><td>Son Ryo</td><td>Graduate (master's) student; AOTC was claimed for him in four prior years. Tuition <b>$9,000</b>, paid with the parents' own funds.</td></tr></table>
<p>The parents allocate expenses so as to maximize credits while keeping the §529 distribution tax-free if possible.</p>
<p class="ja">HiroとYunaは夫婦合算申告で、2026年の修正AGIは$170,000。子2人を被扶養者とする。AOTCと生涯学習控除(LLC)は、夫婦合算申告の場合、修正AGI $160,000〜$180,000の間で比例的に減額されるとする。娘Mei:学位課程の2年生でフルタイム在籍、薬物関連の重罪歴なし、AOTCは過去1年のみ適用。授業料$14,000、大学書店で購入した必修教科書$1,000、学内寮の寮費・食費$12,000(大学の基準額と同額)。§529プランから費用支払いのため$10,000を分配。息子Ryo:修士課程の大学院生で、過去4年にAOTCを適用済み。授業料$9,000は両親の自己資金で支払った。両親は控除を最大化しつつ、可能であれば529分配を非課税とするよう費用を配分する。</p>`,
  rows: [
    { label: "Mei: AOTC before the phase-out(Mei:フェーズアウト前のAOTC)", type: "num", answer: 2500 },
    { label: "Mei: AOTC after the phase-out(Mei:フェーズアウト後のAOTC)", type: "num", answer: 1250 },
    { label: "Refundable portion of Mei's AOTC(MeiのAOTCのうち還付対象部分)", type: "num", answer: 500 },
    { label: "Ryo: credit allowed after the phase-out(Ryo:フェーズアウト後の控除額)", type: "num", answer: 900 },
    { label: "Mei: adjusted qualified education expenses available for the 529 distribution(Mei:529分配に充当できる調整後適格教育費)", type: "num", answer: 23000 },
    { label: "Taxable earnings included in income from the 529 distribution(529分配のうち所得に算入される運用益)", type: "num", answer: 0 },
    { label: "Total education credits for 2026(2026年の教育控除合計)", type: "num", answer: 2150 },
    { label: "Which credit applies to Ryo?(Ryoに適用される控除)", type: "select", options: ["AOTC, because he is enrolled at least half-time", "Lifetime learning credit, because the AOTC four-year limit has been used", "Neither, because graduate tuition is not a qualified expense", "Both credits may be claimed for him in the same year"], answer: "Lifetime learning credit, because the AOTC four-year limit has been used" },
  ],
  explain: `<p><b>Mei(AOTC)</b>:最初の$2,000の100% + 次の$2,000の25% = <b>2,500</b>(教科書は大学から購入しなくても対象。寮費・食費はAOTCの対象外)。フェーズアウト率 = (180,000 − 170,000) ÷ 20,000 = 50% → <b>1,250</b>。還付対象は40%:1,250 × 40% = <b>500</b>。</p>
<p><b>Ryo(LLC)</b>:AOTCは4年まで。大学院の授業料はLLCの対象:9,000 × 20% = 1,800(上限は納税者当たり$10,000の20%=2,000)。50%減額で <b>900</b>。</p>
<p><b>529</b>:529の適格費用は授業料・教科書・寮費食費(半時間以上在籍)で 14,000 + 1,000 + 12,000 = 27,000。AOTCに使った4,000を差し引くと <b>23,000</b>。分配10,000 ≤ 23,000 なので全額非課税、所得算入額は <b>0</b>(同じ費用を二重に使わないことが調整の要点)。</p>
<p>控除合計 = 1,250 + 900 = <b>2,150</b>。</p>`,
});

CPA.tbs({ id: "TBS-TCP-29", section: "TCP", chapter: "TCP-01", title: "寄附のバンチング:値上り株式のDAF寄附とOBBBAの0.5%フロア",
  scenario: `<p>Email from client Ota (married filing jointly):</p>
<p><i>"We normally give $10,000 cash to our church every year. Our AGI will be about $300,000 in both 2026 and 2027. Each year we pay $25,000 of state and local taxes and $5,000 of mortgage interest. A friend suggested we instead give our appreciated stock to a donor-advised fund (DAF) in 2026 and skip our church gift in 2027 except for a $2,000 cash gift. Which plan gives more deductions?"</i></p>
<table><tr><th>Plan</th><th>2026</th><th>2027</th></tr>
<tr><td>A (current)</td><td>$10,000 cash to church</td><td>$10,000 cash to church</td></tr>
<tr><td>B (bunching)</td><td>Publicly traded stock held 6 years (basis <b>$4,000</b>, FMV <b>$20,000</b>) to a DAF sponsored by a public charity</td><td>$2,000 cash directly to church</td></tr></table>
<p>Assumptions (law after the One Big Beautiful Bill Act): standard deduction for joint filers <b>$32,200</b> in both years; itemized charitable deductions are allowed only to the extent they exceed <b>0.5% of AGI</b>; non-itemizers may deduct cash gifts to public charities (other than DAFs) up to <b>$2,000</b> on a joint return; the SALT deduction cap is not binding; the couple is in the 24% bracket, so the itemized-deduction value cap does not apply.</p>
<p class="ja">顧客Ota夫妻(夫婦合算申告)からのメール:「毎年教会に現金$10,000を寄附している。2026年・2027年ともAGIは約$300,000の見込み。毎年、州・地方税$25,000と住宅ローン利息$5,000を支払う。友人から、2026年に値上りした株式をドナー・アドバイズド・ファンド(DAF)に寄附し、2027年は現金$2,000の寄附にとどめる案を勧められた。どちらの控除が大きいか。」プランA:両年とも教会に現金$10,000。プランB:2026年に6年保有の上場株式(取得価額$4,000、時価$20,000)を公益慈善団体が運営するDAFへ寄附、2027年は教会へ直接現金$2,000。前提(OBBBA後の法律):夫婦合算の標準控除は両年とも$32,200。項目別控除の寄附金はAGIの0.5%を超える部分のみ控除可能。項目別控除を選ばない者は公益慈善団体(DAFを除く)への現金寄附を合算申告で$2,000まで控除できる。SALT上限は影響しない。税率区分は24%で、項目別控除の価値上限は適用されない。</p>`,
  rows: [
    { label: "Plan A: total deductions from AGI for 2026 and 2027 combined(プランA:2026・2027年のAGIからの控除合計)", type: "num", answer: 77000 },
    { label: "Plan B: 2026 charitable deduction after the 0.5% floor(プランB:0.5%フロア適用後の2026年の寄附金控除)", type: "num", answer: 18500 },
    { label: "Plan B: 2026 total itemized deductions(プランB:2026年の項目別控除合計)", type: "num", answer: 48500 },
    { label: "Plan B: 2027 total deductions from AGI(プランB:2027年のAGIからの控除合計)", type: "num", answer: 34200 },
    { label: "Plan B: total deductions for both years combined(プランB:両年の控除合計)", type: "num", answer: 82700 },
    { label: "Capital gain that the couple avoids recognizing by donating the stock(株式寄附により認識を回避できるキャピタルゲイン)", type: "num", answer: 16000 },
    { label: "AGI percentage limit applicable to the 2026 stock gift(2026年の株式寄附に適用されるAGI限度割合)", type: "select", options: ["60%", "50%", "30%", "20%"], answer: "30%" },
    { label: "If the stock had been held only 8 months, the 2026 contribution amount before the floor would be(株式の保有期間が8か月だった場合、フロア適用前の2026年の寄附額)", type: "select", options: ["$20,000 (FMV)", "$4,000 (basis)", "$12,000 (average of basis and FMV)", "$0, because short-term property is not deductible"], answer: "$4,000 (basis)" },
  ],
  explain: `<p>0.5%フロア = 300,000 × 0.5% = 1,500。寄附以外の項目別控除 = 25,000 + 5,000 = 30,000。</p>
<p><b>プランA</b>:各年 30,000 + (10,000 − 1,500) = 38,500 > 標準控除32,200 → 項目別控除。2年合計 38,500 × 2 = <b>77,000</b>。</p>
<p><b>プランB 2026年</b>:長期保有の値上りキャピタル・ゲイン資産を公益慈善団体(DAFのスポンサーは公益慈善団体)へ寄附 → 時価20,000で控除、AGIの<b>30%</b>限度(90,000)内。フロア後 20,000 − 1,500 = <b>18,500</b>。項目別控除 30,000 + 18,500 = <b>48,500</b>。</p>
<p><b>プランB 2027年</b>:項目別控除30,000 < 32,200 なので標準控除を選択。教会への直接の現金寄附2,000は非項目別控除者向けの寄附金控除(上限2,000)の対象 → 32,200 + 2,000 = <b>34,200</b>。両年合計 48,500 + 34,200 = <b>82,700</b>(プランAより5,700多い)。</p>
<p>株式を売却せず寄附するので含み益 20,000 − 4,000 = <b>16,000</b>は課税されない。保有1年以下なら通常所得資産となり、控除額は取得価額 <b>4,000</b>に限られる。</p>`,
});

CPA.tbs({ id: "TBS-TCP-30", section: "TCP", chapter: "TCP-01", title: "NIITを含む見積納税のセーフハーバーと四半期納付額",
  scenario: `<p>The Moris file jointly. You are planning their 2026 estimated tax payments.</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>2025 AGI</td><td>$180,000</td></tr>
<tr><td>2025 total tax (full-year return filed)</td><td>$30,000</td></tr>
<tr><td>2026 projected wages (combined; neither spouse earns over $200,000)</td><td>$200,000</td></tr>
<tr><td>2026 projected taxable interest</td><td>$10,000</td></tr>
<tr><td>2026 projected qualified dividends</td><td>$30,000</td></tr>
<tr><td>2026 projected long-term capital gain on stock sales</td><td>$80,000</td></tr>
<tr><td>2026 projected regular income tax (before NIIT)</td><td>$60,000</td></tr>
<tr><td>2026 projected federal income tax withholding from wages</td><td>$24,000</td></tr></table>
<p>There are no investment expenses, no foreign income, and no other taxes. The NIIT threshold for joint filers is <b>$250,000</b> (not indexed). Modified AGI equals AGI.</p>
<p class="ja">Mori夫妻は夫婦合算申告で、2026年の見積納税を計画する。2025年AGI $180,000、2025年の税額合計$30,000(通年の申告書を提出済み)。2026年見込み:給与合計$200,000(いずれの配偶者も$200,000以下)、課税利息$10,000、適格配当$30,000、株式売却の長期キャピタルゲイン$80,000、NIIT前の通常所得税$60,000、給与からの源泉徴収$24,000。投資費用・国外所得・その他の税はない。夫婦合算申告のNIIT基準額は$250,000(物価調整なし)。修正AGIはAGIと同じ。</p>`,
  rows: [
    { label: "2026 net investment income(2026年の純投資所得)", type: "num", answer: 120000 },
    { label: "2026 net investment income tax(2026年のNIIT)", type: "num", answer: 2660 },
    { label: "90% of the 2026 total tax(2026年の税額合計の90%)", type: "num", answer: 56394 },
    { label: "Required annual payment to avoid the underpayment penalty(過少納付ペナルティを回避するための必要年間納付額)", type: "num", answer: 33000 },
    { label: "Total 2026 estimated tax payments needed in addition to withholding(源泉徴収に加えて必要な2026年の見積納税額合計)", type: "num", answer: 9000 },
    { label: "Required installment for each of the four due dates(4回の各納期限の必要納付額)", type: "num", answer: 2250 },
    { label: "Required annual payment if 2025 AGI had been $140,000(2025年のAGIが$140,000だった場合の必要年間納付額)", type: "num", answer: 30000 },
    { label: "If the Moris skip the first three installments, which action can still avoid all penalty?(最初の3回の納付を怠った場合、ペナルティを全額回避できる方法)", type: "select", options: ["Paying the full $9,000 with the January 15, 2027 installment", "Increasing December 2026 wage withholding by $9,000, because withholding is treated as paid ratably during the year", "Filing the 2026 return by April 15, 2027 with full payment", "Electing the annualized income installment method, because their income was earned evenly"], answer: "Increasing December 2026 wage withholding by $9,000, because withholding is treated as paid ratably during the year" },
  ],
  explain: `<p>純投資所得 = 10,000 + 30,000 + 80,000 = <b>120,000</b>。修正AGI = 200,000 + 120,000 = 320,000、基準超過額 70,000。NIIT = 3.8% × min(120,000, 70,000) = <b>2,660</b>。給与は各配偶者とも合算でも$250,000以下のため追加メディケア税はない。</p>
<p>2026年の税額合計 = 60,000 + 2,660 = 62,660(NIITも見積納税の対象)。90% = <b>56,394</b>。</p>
<p>前年AGIが$150,000超なので前年基準は110%:30,000 × 110% = 33,000。必要年間納付額 = min(56,394, 33,000) = <b>33,000</b>。源泉24,000を控除し、見積納税 <b>9,000</b>、各回 9,000 ÷ 4 = <b>2,250</b>。</p>
<p>前年AGIが$150,000以下なら100%基準:min(56,394, 30,000) = <b>30,000</b>。</p>
<p>源泉徴収は別段の選択がない限り年間を通じて均等に納付されたものとみなされるため、12月の源泉増額で過去の納期の不足も解消できる。1月15日の一括納付や期限内申告では、それ以前の納期の不足に対するペナルティは回避できない。年換算法は所得が年後半に偏る場合に有効で、均等な所得では効果がない。</p>`,
});
