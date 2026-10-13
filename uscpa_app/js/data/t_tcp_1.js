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
<p><b>ISO#1</b>:行使から1年以内(付与から2年以内でもない場合を含む)の売却は不適格処分。通常所得 = 行使時の差益 (50 − 20) × 1,000 = 30,000 と実際の利益 (45 − 20) × 1,000 = 25,000 の少ない方 = <b>25,000</b>。取得価額は 20,000 + 25,000 = 45,000、売却額45,000のためキャピタル損益は <b>0</b>。</p>
<p><b>AMT</b>:行使と同一年に不適格処分したISO#1はAMT調整が不要(通常税で既に所得計上)。ISO#2の差益 (25 − 5) × 2,000 = <b>40,000</b>のみが加算調整。ISO#2の通常税上の取得価額は10,000、AMT上は 10,000 + 40,000 = <b>50,000</b>。</p>
<p><b>譲渡制限株式</b>:§83(b)選択により受領時の時価 1,000 × 3 = <b>3,000</b>を2026年に通常所得として認識。2028年の権利確定時には課税されず、将来の値上り益はキャピタルゲインとなる。</p>`,
});
