// TCP のTBS追加(信託・遺産の所得課税、遺産税、免税団体)

CPA.tbs({ id: "TBS-TCP-41", section: "TCP", chapter: "TCP-03", title: "単純信託:信託会計上の所得(FAI)とDNIの差異・受益者K-1の性質",
  scenario: `<p>The Mori Trust is a <b>simple trust</b> for 2026: the instrument requires all trust accounting income to be distributed currently to the sole beneficiary, Rina, and no charitable contributions are permitted. Under the instrument and the state principal and income act, capital gains are allocated to corpus and trustee fees are charged <b>one-half to income and one-half to corpus</b>.</p>
<table><tr><th>Item (2026)</th><th>Amount</th></tr>
<tr><td>Qualified dividends</td><td>$30,000</td></tr>
<tr><td>Taxable interest</td><td>$10,000</td></tr>
<tr><td>Tax-exempt municipal bond interest</td><td>$20,000</td></tr>
<tr><td>Long-term capital gain (allocated to corpus)</td><td>$15,000</td></tr>
<tr><td>Trustee fees (total)</td><td>$6,000</td></tr></table>
<p><b>Trustee's note:</b> "Allocate trustee fees to tax-exempt interest in the ratio of tax-exempt interest to total accounting-income receipts (dividends, taxable interest and tax-exempt interest). Allocate the deductible fees between dividends and taxable interest in proportion to those items when preparing Rina's Schedule K-1." A simple trust's exemption is $300.</p>
<p class="ja">Mori信託は2026年において単純信託である。信託証書は信託会計上の所得の全額を唯一の受益者Rinaに当期分配することを要求し、慈善寄附は認めていない。信託証書と州の元本・収益法により、キャピタルゲインは元本に配分され、受託者報酬は所得と元本に2分の1ずつ負担させる。2026年の数値は、適格配当$30,000、課税利息$10,000、非課税地方債利息$20,000、長期キャピタルゲイン(元本配分)$15,000、受託者報酬合計$6,000である。受託者メモ:「受託者報酬は、信託会計上の所得受領額合計(配当・課税利息・非課税利息)に占める非課税利息の割合で非課税利息に配賦する。RinaのSchedule K-1作成にあたり、控除可能な報酬は配当と課税利息にその金額比で配分する。」単純信託の人的控除は$300である。</p>`,
  rows: [
    { label: "Fiduciary accounting income required to be distributed to Rina(Rinaに分配が要求される信託会計上の所得)", type: "num", answer: 57000 },
    { label: "Trustee fees allocable to tax-exempt interest (nondeductible)(非課税利息に配賦され控除不能な受託者報酬)", type: "num", answer: 2000 },
    { label: "Distributable net income (DNI)(配分可能純所得)", type: "num", answer: 54000 },
    { label: "Income distribution deduction(所得分配控除額)", type: "num", answer: 36000 },
    { label: "Trust taxable income(信託の課税所得)", type: "num", answer: 14700 },
    { label: "Qualified dividends reported on Rina's Schedule K-1(RinaのK-1に記載される適格配当)", type: "num", answer: 27000 },
    { label: "Why is Rina taxed on less than the $57,000 she receives?(Rinaが受領額$57,000より少ない額にしか課税されない理由)", type: "select", options: ["DNI caps the amount taxable to the beneficiary; the corpus share of the fees reduces DNI but not accounting income, and net tax-exempt interest keeps its exempt character", "Simple trusts may deduct the full distribution, so the beneficiary reports only taxable interest", "The capital gain allocated to corpus is deducted from Rina's distribution", "The trust's $300 exemption is passed through to Rina"], answer: "DNI caps the amount taxable to the beneficiary; the corpus share of the fees reduces DNI but not accounting income, and net tax-exempt interest keeps its exempt character" },
  ],
  explain: `<p>①FAI = 配当30,000 + 課税利息10,000 + 非課税利息20,000 − 所得負担の報酬3,000(6,000 × 1/2)= <b>57,000</b>。キャピタルゲインと元本負担の報酬3,000はFAIに影響しない。単純信託なので57,000全額を分配する。</p>
<p>②報酬は所得負担・元本負担を問わず全額6,000が税務上の控除対象だが、非課税所得に対応する部分は§265で控除不能となる。6,000 × 20,000 / 60,000 = <b>2,000</b>。控除可能な報酬は4,000。</p>
<p>③DNI = 課税部分(30,000 + 10,000 − 4,000 = 36,000)+ 純非課税利息(20,000 − 2,000 = 18,000)= <b>54,000</b>。元本に配分されたキャピタルゲイン15,000はDNIから除く。</p>
<p>④分配控除 = 分配57,000とDNI54,000の小さい方54,000から純非課税利息18,000を除いた <b>36,000</b>。</p>
<p>⑤信託の課税所得 = 総所得55,000(30,000 + 10,000 + 15,000)− 報酬4,000 − 分配控除36,000 − 人的控除300 = <b>14,700</b>。これは元本に留保されたキャピタルゲイン15,000 − 300と一致する。</p>
<p>⑥控除可能報酬4,000を配当と課税利息に30:10で配分すると、配当に3,000、利息に1,000。K-1の適格配当 = 30,000 − 3,000 = <b>27,000</b>、課税利息 = 9,000、非課税利息 = 18,000(合計54,000 = DNI)。</p>
<p>⑦受益者の課税額はDNIが上限となる。元本負担の報酬がDNIを減らすがFAIは減らさないため受領額57,000がDNIを上回り、差額3,000は課税されない。また非課税利息は性質を保持して受益者に引き継がれる。</p>`,
});

CPA.tbs({ id: "TBS-TCP-42", section: "TCP", chapter: "TCP-03", title: "複合信託のティア制度:第1順位の強制所得分配と第2順位の裁量分配",
  scenario: `<p>The Sato Family Trust is a complex trust. The instrument requires the trustee to pay <b>$30,000 of income each year to Aki</b>. The trustee may also distribute income or corpus to Ben and Chie in its discretion. Capital gains are allocated to corpus, and trustee fees are charged to corpus.</p>
<table><tr><th>Item (2026)</th><th>Amount</th></tr>
<tr><td>Taxable interest</td><td>$50,000</td></tr>
<tr><td>Tax-exempt interest</td><td>$10,000</td></tr>
<tr><td>Long-term capital gain (allocated to corpus)</td><td>$20,000</td></tr>
<tr><td>Trustee fees (charged to corpus)</td><td>$6,000</td></tr></table>
<p>2026 distributions: Aki $30,000 (mandatory income distribution); Ben $20,000 and Chie $20,000 (discretionary). Allocate trustee fees to tax-exempt interest in the ratio of tax-exempt interest to total accounting income. The trust's exemption is $100. There is no charitable deduction.</p>
<p class="ja">Sato家信託は複合信託である。信託証書は毎年所得から$30,000をAkiに支払うことを受託者に要求している。受託者はさらにBenとChieに所得または元本を裁量で分配できる。キャピタルゲインは元本に配分し、受託者報酬は元本に負担させる。2026年の数値は課税利息$50,000、非課税利息$10,000、長期キャピタルゲイン(元本配分)$20,000、受託者報酬(元本負担)$6,000である。2026年の分配はAkiへ$30,000(強制的な所得分配)、Benへ$20,000、Chieへ$20,000(いずれも裁量分配)である。受託者報酬は信託会計上の所得合計に占める非課税利息の割合で非課税利息に配賦する。人的控除は$100、慈善控除はない。</p>`,
  rows: [
    { label: "Fiduciary accounting income(信託会計上の所得)", type: "num", answer: 60000 },
    { label: "Distributable net income (DNI)(配分可能純所得)", type: "num", answer: 54000 },
    { label: "Taxable income Aki reports from the trust(Akiが信託から申告する課税所得)", type: "num", answer: 25000 },
    { label: "Total DNI carried out to Ben (taxable + tax-exempt)(Benに配分されるDNI合計)", type: "num", answer: 12000 },
    { label: "Taxable income Ben reports from the trust(Benが信託から申告する課税所得)", type: "num", answer: 10000 },
    { label: "Income distribution deduction(所得分配控除額)", type: "num", answer: 45000 },
    { label: "Trust taxable income(信託の課税所得)", type: "num", answer: 19900 },
    { label: "Treatment of the remaining $8,000 Ben received(Benが受領した残り$8,000の取扱い)", type: "select", options: ["Tax-free distribution of corpus (no throwback for a domestic trust)", "Taxable as long-term capital gain", "Taxable in 2027 under the 65-day rule", "Taxed to Aki as a first-tier beneficiary"], answer: "Tax-free distribution of corpus (no throwback for a domestic trust)" },
  ],
  explain: `<p>①FAI = 50,000 + 10,000 = <b>60,000</b>(報酬は元本負担、キャピタルゲインは元本配分のためFAIに影響しない)。</p>
<p>②非課税利息への報酬配賦 = 6,000 × 10,000/60,000 = 1,000、控除可能5,000。DNI = (50,000 − 5,000) + (10,000 − 1,000) = 45,000 + 9,000 = <b>54,000</b>。課税部分の割合は45/54、非課税部分は9/54。</p>
<p>③第1順位(当期分配が要求される所得):Akiの30,000はDNI54,000以下なので全額がDNIを運ぶ。非課税部分 = 30,000 × 9/54 = 5,000、課税部分 = <b>25,000</b>。</p>
<p>④第2順位:残りDNI = 54,000 − 30,000 = 24,000。第2順位の分配合計40,000で按分し、Ben・Chieはそれぞれ24,000 × 20/40 = <b>12,000</b>。Benの課税部分 = 12,000 × 45/54 = <b>10,000</b>、非課税2,000。</p>
<p>⑤分配控除 = 分配70,000とDNI54,000の小さい方から非課税9,000を除く = <b>45,000</b>(25,000 + 10,000 + 10,000と一致)。</p>
<p>⑥信託の課税所得 = 50,000 + 20,000 − 5,000 − 45,000 − 100 = <b>19,900</b>(元本に留保したキャピタルゲイン20,000 − 100)。</p>
<p>⑦Benの受領額20,000のうちDNIを超える8,000は元本の分配として非課税である。国内信託にはスローバック規定は適用されない。</p>`,
});

CPA.tbs({ id: "TBS-TCP-43", section: "TCP", chapter: "TCP-03", title: "65日ルールの選択による税額削減とグランター信託の判定グリッド",
  scenario: `<p><b>Part A.</b> The Kato Trust, a calendar-year complex trust, has 2026 fiduciary accounting income and DNI of <b>$40,000</b>, all taxable interest (no capital gains, no tax-exempt income, no deductions). The trustee distributed $25,000 to the beneficiary during 2026 and plans an additional cash distribution in early 2027. Use the following 2026 trust rate schedule (indexed): 10% on the first $3,300; 24% on $3,300–$11,700; 35% on $11,700–$16,000; 37% above $16,000. The trust's exemption is $100. The net investment income tax threshold for trusts equals the start of the 37% bracket ($16,000).</p>
<p><b>Part B.</b> A client has established four separate trusts. Determine whether each is a grantor trust for income tax purposes.</p>
<table><tr><th>Trust</th><th>Facts</th></tr>
<tr><td>Trust 1</td><td>Income is payable to the grantor's spouse for life; no adverse party must consent.</td></tr>
<tr><td>Trust 2</td><td>An independent bank trustee (not related or subordinate to the grantor) may sprinkle income among the grantor's adult children; the grantor holds no powers.</td></tr>
<tr><td>Trust 3</td><td>The grantor holds, in a nonfiduciary capacity, the power to reacquire trust assets by substituting property of equivalent value.</td></tr>
<tr><td>Trust 4</td><td>Corpus reverts to the grantor after 12 years; at inception the reversion was valued at 20% of the trust.</td></tr></table>
<p class="ja">Part A:Kato信託は暦年の複合信託で、2026年の信託会計上の所得とDNIはいずれも$40,000(全額が課税利息、キャピタルゲイン・非課税所得・控除なし)である。受託者は2026年中に受益者へ$25,000を分配し、2027年初めに追加の現金分配を予定している。2026年の信託税率表(インフレ調整後)は、$3,300まで10%、$3,300〜$11,700は24%、$11,700〜$16,000は35%、$16,000超は37%とする。人的控除は$100、信託の純投資所得税の閾値は37%ブラケットの始点($16,000)である。Part B:顧客が4つの信託を設定した。所得税上グランター信託に当たるかを判定する。信託1:配偶者に生涯所得を支払い、不利益当事者の同意は不要。信託2:グランターと関係・従属関係のない独立の銀行受託者が成人した子の間で所得を裁量配分でき、グランターは権限を持たない。信託3:グランターが受託者以外の立場で同等価値の財産と差し替えて信託財産を取り戻す権限を持つ。信託4:12年後に元本がグランターに復帰し、設定時の復帰権の価値は信託の20%である。</p>`,
  rows: [
    { label: "Latest date a 2027 distribution can be treated as made in 2026(2026年分の分配として扱える2027年の分配の期限)", type: "select", options: ["January 31, 2027", "March 6, 2027", "March 15, 2027", "April 15, 2027"], answer: "March 6, 2027" },
    { label: "Maximum amount eligible for the 65-day election(65日ルールの選択対象となる最大額)", type: "num", answer: 15000 },
    { label: "2026 trust income tax saved by distributing and electing the maximum(最大額を分配・選択した場合に削減される信託の2026年所得税)", type: "num", answer: 3466 },
    { label: "Trust 1(信託1)", type: "select", options: ["Grantor trust", "Not a grantor trust"], answer: "Grantor trust" },
    { label: "Trust 2(信託2)", type: "select", options: ["Grantor trust", "Not a grantor trust"], answer: "Not a grantor trust" },
    { label: "Trust 3(信託3)", type: "select", options: ["Grantor trust", "Not a grantor trust"], answer: "Grantor trust" },
    { label: "Trust 4(信託4)", type: "select", options: ["Grantor trust", "Not a grantor trust"], answer: "Grantor trust" },
  ],
  explain: `<p>①§663(b)の65日ルール:課税年度末後65日以内の分配を前年分として選択できる。2027年1月31日 + 2月28日 = 59日、残り6日で <b>2027年3月6日</b>。選択は前年のForm 1041の申告期限(延長含む)までに行い、取消不能である。</p>
<p>②選択できる額は、FAIとDNIの大きい方(40,000)から当年中の分配額25,000を控除した <b>15,000</b> が上限。</p>
<p>③選択しない場合の課税所得 = 40,000 − 25,000 − 100 = 14,900。税額 = 3,300 × 10% (330) + 8,400 × 24% (2,016) + 3,200 × 35% (1,120) = <b>3,466</b>。課税所得が16,000以下のためNIITはない。15,000を追加分配して選択すると分配控除はDNI全額の40,000となり課税所得は0、信託の税額は0になるので削減額は3,466(受益者側で課税される)。</p>
<p>④信託1:配偶者のために所得が分配され得る場合は§677でグランター信託。</p>
<p>⑤信託2:独立受託者による配分権は§674(c)の例外に当たり、グランターは権限を持たないためグランター信託ではない(信託自体が課税)。</p>
<p>⑥信託3:受託者以外の立場での財産差替権は§675(4)の管理権限でグランター信託(いわゆるIDGT。所得税はグランター課税だが遺産税上は総遺産に含まれない設計が可能)。</p>
<p>⑦信託4:設定時の復帰権の価値が5%を超えるので§673によりグランター信託。</p>`,
});

CPA.tbs({ id: "TBS-TCP-44", section: "TCP", chapter: "TCP-03", title: "遺産の最終年度:超過控除とキャピタルロス繰越の受益者への引継ぎ",
  scenario: `<p>The Estate of Ruth Ono files its <b>final</b> Form 1041 for the period ending November 30, 2026, when all remaining assets were distributed. Under the will, Uma received a specific bequest of $50,000 (paid in 2025); the residue passed <b>60% to Sam and 40% to Tina</b>, both calendar-year individuals.</p>
<table><tr><th>Final-year item</th><th>Amount</th></tr>
<tr><td>Taxable interest</td><td>$18,000</td></tr>
<tr><td>Ordinary dividends</td><td>$6,000</td></tr>
<tr><td>Executor commissions</td><td>$22,000</td></tr>
<tr><td>Attorney fees for estate administration</td><td>$9,000</td></tr>
<tr><td>Investment advisory fees (of a type commonly incurred by individuals)</td><td>$3,000</td></tr>
<tr><td>Long-term capital loss carryover from 2025 (unused)</td><td>$8,000</td></tr></table>
<p>The estate had no capital transactions in the final year and no charitable deductions. Executor commissions and attorney fees are costs that would not have been incurred if the property were not held by an estate (§67(e)). Assume current law permanently disallows miscellaneous itemized deductions.</p>
<p class="ja">Ruth Onoの遺産財団は、残余財産をすべて分配した2026年11月30日終了の期間について最終のForm 1041を提出する。遺言によりUmaは$50,000の特定遺贈を受け(2025年に支払済)、残余はSamに60%、Tinaに40%が承継された(いずれも暦年の個人)。最終年度の数値は、課税利息$18,000、普通配当$6,000、遺言執行者報酬$22,000、遺産管理のための弁護士費用$9,000、投資顧問料(個人も通常負担する種類)$3,000、2025年からの未使用の長期キャピタルロス繰越$8,000である。最終年度に資本取引や慈善控除はない。遺言執行者報酬と弁護士費用は、財産が遺産財団に保有されていなければ生じなかった費用(§67(e))である。現行法上、雑多の項目別控除は恒久的に認められないものとする。</p>`,
  rows: [
    { label: "Estate's total excess deductions on termination(終了時の超過控除の合計)", type: "num", answer: 7000 },
    { label: "Sam's share of the excess deductions(Samに配分される超過控除)", type: "num", answer: 4200 },
    { label: "How Sam deducts his share(Samの控除方法)", type: "select", options: ["Deduction in arriving at AGI (retains §67(e) character)", "Miscellaneous itemized deduction (disallowed)", "Itemized deduction subject to the 0.5%/2% floors", "Net operating loss carryforward"], answer: "Deduction in arriving at AGI (retains §67(e) character)" },
    { label: "Tax year in which Sam claims the excess deductions(Samが超過控除を計上する年度)", type: "select", options: ["2026 only; any unused amount is lost", "2026, with any unused amount carried forward indefinitely", "2025, by amended return", "Spread evenly over 2026 and 2027"], answer: "2026 only; any unused amount is lost" },
    { label: "Uma's share of the excess deductions(Umaに配分される超過控除)", type: "num", answer: 0 },
    { label: "Long-term capital loss carryover passed to Tina(Tinaに引き継がれる長期キャピタルロス繰越)", type: "num", answer: 3200 },
  ],
  explain: `<p>①最終年度の総所得 = 18,000 + 6,000 = 24,000。控除可能額 = 遺言執行者報酬22,000 + 弁護士費用9,000 = 31,000。投資顧問料3,000は個人も通常負担する費用で§67(e)に該当せず、雑多の項目別控除として控除できないため超過控除にも含めない。人的控除や慈善控除も超過控除の計算から除く。超過控除 = 31,000 − 24,000 = <b>7,000</b>。</p>
<p>②§642(h)により超過控除は残余財産を承継する受益者に承継割合で配分される。Sam = 7,000 × 60% = <b>4,200</b>(Tinaは2,800)。</p>
<p>③Reg. §1.642(h)-2により、超過控除は性質を保持する。§67(e)の費用はAGI算定上の控除(Schedule 1)となり、雑多の項目別控除として否認されない。</p>
<p>④超過控除は遺産の最終年度が終了する日を含む受益者の課税年度(2026年)にのみ控除でき、繰越はできない。</p>
<p>⑤Umaは特定遺贈の受遺者で残余受益者ではないため配分は <b>0</b>。</p>
<p>⑥キャピタルロス繰越は性質(長期)を保持して残余受益者に引き継がれ、受益者の段階で無期限に繰り越せる。最終年度は課税所得がマイナスのため$3,000の控除による繰越の減少もない。Tina = 8,000 × 40% = <b>3,200</b>(Samは4,800)。</p>`,
});

CPA.tbs({ id: "TBS-TCP-45", section: "TCP", chapter: "TCP-03", title: "総遺産算入の判定グリッド:合有財産・生命保険・§2036・3年内贈与・年金",
  scenario: `<p>Hiro Tanaka, a U.S. citizen, died on March 10, 2026, survived by his wife, Emi (a U.S. citizen). The executor's worksheet lists the following (values at date of death unless stated; no alternate valuation election):</p>
<table><tr><th>#</th><th>Item</th><th>Value</th></tr>
<tr><td>1</td><td>Residence held by Hiro and Emi as joint tenants with right of survivorship</td><td>$900,000</td></tr>
<tr><td>2</td><td>Brokerage account held with Hiro's brother as joint tenants with right of survivorship; Hiro furnished 75% of the consideration</td><td>$300,000</td></tr>
<tr><td>3</td><td>Life insurance on Hiro's life, owned by Hiro, payable to his daughter</td><td>$1,000,000</td></tr>
<tr><td>4</td><td>Life insurance on Hiro's life, transferred by Hiro to an irrevocable life insurance trust in June 2024 (face amount)</td><td>$500,000</td></tr>
<tr><td>5</td><td>Life insurance owned by Hiro on Emi's life (face $300,000; interpolated terminal reserve plus unearned premium)</td><td>$40,000</td></tr>
<tr><td>6</td><td>Vacation home deeded to his son in 2023; Hiro kept the right to use it rent-free for life and did so until death</td><td>$600,000</td></tr>
<tr><td>7</td><td>Assets in Hiro's revocable living trust</td><td>$1,200,000</td></tr>
<tr><td>8</td><td>Stock given to his niece in 2025 (FMV at gift $100,000; no gift tax paid)</td><td>$130,000</td></tr>
<tr><td>9</td><td>Joint-and-survivor annuity purchased solely by Hiro; value of Emi's survivor payments</td><td>$250,000</td></tr>
<tr><td>10</td><td>Single-life annuity on Hiro's life that ceased at his death</td><td>$0</td></tr></table>
<p class="ja">米国市民のHiro Tanakaは2026年3月10日に死亡し、妻Emi(米国市民)が生存している。遺言執行者のワークシートの項目は次のとおり(特記なき限り死亡日の価値、代替評価日の選択なし)。1:HiroとEmiの生存者権付き合有の自宅$900,000。2:Hiroの兄弟との生存者権付き合有の証券口座$300,000(Hiroが対価の75%を拠出)。3:Hiroが所有し娘が受取人のHiroの生命保険$1,000,000。4:Hiroが2024年6月に取消不能生命保険信託へ移転したHiroの生命保険(保険金額)$500,000。5:Hiroが所有するEmiの生命保険(保険金額$300,000、補間ターミナルリザーブ+未経過保険料)$40,000。6:2023年に息子へ譲渡したが生涯無償使用権を留保し死亡まで使用した別荘$600,000。7:Hiroの撤回可能生前信託の資産$1,200,000。8:2025年に姪へ贈与した株式(贈与時の時価$100,000、贈与税の納付なし)$130,000。9:Hiroが単独で購入した連生終身年金のうちEmiの生存者給付の価値$250,000。10:Hiroの死亡で終了した単生年金$0。</p>`,
  rows: [
    { label: "Item 1 — amount included(項目1の算入額)", type: "num", answer: 450000 },
    { label: "Item 2 — amount included(項目2の算入額)", type: "num", answer: 225000 },
    { label: "Item 4 — treatment(項目4の取扱い)", type: "select", options: ["Included at $500,000 under §2035 (incident of ownership transferred within 3 years of death)", "Excluded because the ILIT owns the policy at death", "Included only to the extent of premiums paid within 3 years", "Included at the policy's cash value on the transfer date"], answer: "Included at $500,000 under §2035 (incident of ownership transferred within 3 years of death)" },
    { label: "Item 5 — amount included(項目5の算入額)", type: "num", answer: 40000 },
    { label: "Item 6 — basis for inclusion(項目6の算入根拠)", type: "select", options: ["§2036 retained life estate — included at $600,000", "§2035 gift within 3 years — included at value on the 2023 gift date", "§2038 revocable transfer — included at $600,000", "Not included; completed gift in 2023"], answer: "§2036 retained life estate — included at $600,000" },
    { label: "Item 8 — amount included(項目8の算入額)", type: "num", answer: 0 },
    { label: "Item 9 — amount included(項目9の算入額)", type: "num", answer: 250000 },
    { label: "Gross estate (items 1–10)(総遺産額)", type: "num", answer: 4265000 },
  ],
  explain: `<p>①配偶者間の生存者権付き合有は適格合有財産(§2040(b))として拠出に関係なく半分を算入:900,000 × 1/2 = <b>450,000</b>。</p>
<p>②配偶者以外との合有は拠出割合で算入(拠出ルール):300,000 × 75% = <b>225,000</b>。</p>
<p>③本人が付随的権利を保有する生命保険は§2042で全額1,000,000を算入。</p>
<p>④死亡前3年以内に生命保険の付随的権利を移転した場合は§2035(a)で保険金額500,000を算入(2024年6月は3年以内)。</p>
<p>⑤他人の生命に掛けた保険を被相続人が所有する場合は保険金ではなく保険契約の価値(補間ターミナルリザーブ+未経過保険料)<b>40,000</b>を§2033で算入。</p>
<p>⑥生涯の使用・収益権を留保した譲渡は§2036で死亡時の時価 <b>600,000</b> を算入(贈与時期に関係ない)。</p>
<p>⑦撤回可能信託は§2038で1,200,000を算入。</p>
<p>⑧3年内贈与のルールは生命保険や§2036〜2038の権利の移転と贈与税の納付額(グロスアップ)に限られる。株式の贈与は算入しない:<b>0</b>(贈与額は調整課税贈与として税額計算の基礎に反映される)。</p>
<p>⑨被相続人が購入した連生年金は生存者の受取分の価値を§2039で <b>250,000</b> 算入。単生年金は死亡で消滅し0。</p>
<p>⑩総遺産 = 450,000 + 225,000 + 1,000,000 + 500,000 + 40,000 + 600,000 + 1,200,000 + 0 + 250,000 + 0 = <b>4,265,000</b>。</p>`,
});

CPA.tbs({ id: "TBS-TCP-46", section: "TCP", chapter: "TCP-03", title: "遺産税の計算:調整課税贈与・DSUE(ポータビリティ)・州死亡税控除",
  scenario: `<p>Helen Ito, a U.S. citizen, died in 2026 unmarried. Her husband, Ken, died in 2021 when the basic exclusion amount was $11,700,000; Ken's taxable estate plus adjusted taxable gifts totaled $4,700,000, and his executor elected portability on a timely filed Form 706. Helen never remarried.</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Gross estate</td><td>$24,000,000</td></tr>
<tr><td>Funeral expenses</td><td>$30,000</td></tr>
<tr><td>Administration expenses (deducted on Form 706)</td><td>$170,000</td></tr>
<tr><td>Debts and mortgages</td><td>$300,000</td></tr>
<tr><td>Bequest to a qualified public charity</td><td>$1,000,000</td></tr>
<tr><td>State estate tax paid</td><td>$400,000</td></tr></table>
<p>In 2019 Helen gave stock worth $2,015,000 to her son; she claimed the $15,000 annual exclusion, paid no gift tax and did not split gifts. The stock was worth $3,100,000 at Helen's death and is not included in her gross estate. Assume a 2026 basic exclusion amount of <b>$15,000,000</b> (OBBBA) and the unified rate schedule: tax on $1,000,000 is $345,800, plus 40% of the excess.</p>
<p class="ja">米国市民のHelen Itoは2026年に未婚で死亡した。夫Kenは基礎控除額$11,700,000であった2021年に死亡し、Kenの課税遺産と調整課税贈与の合計は$4,700,000で、遺言執行者は期限内のForm 706でポータビリティを選択した。Helenは再婚していない。Helenの総遺産$24,000,000、葬儀費用$30,000、遺産管理費用(Form 706で控除)$170,000、債務・抵当債務$300,000、適格公益慈善団体への遺贈$1,000,000、支払った州遺産税$400,000。2019年にHelenは息子へ時価$2,015,000の株式を贈与し、$15,000の年間除外を適用、贈与税の納付はなく贈与分割もしていない。死亡時の株式の時価は$3,100,000で総遺産には含まれない。2026年の基礎控除額はOBBBAにより$15,000,000、統一税率表は$1,000,000に対する税額$345,800に超過額の40%を加えるものとする。</p>`,
  rows: [
    { label: "Taxable estate(課税遺産額)", type: "num", answer: 22100000 },
    { label: "Adjusted taxable gifts(調整課税贈与)", type: "num", answer: 2000000 },
    { label: "Tentative tax base(暫定税額計算の基礎)", type: "num", answer: 24100000 },
    { label: "DSUE amount available to Helen's estate(Helenの遺産が使えるDSUE)", type: "num", answer: 7000000 },
    { label: "Helen's applicable exclusion amount(Helenの適用除外額)", type: "num", answer: 22000000 },
    { label: "Net federal estate tax payable(納付すべき連邦遺産税)", type: "num", answer: 840000 },
    { label: "Which statement about the DSUE is correct?(DSUEに関する正しい記述)", type: "select", options: ["DSUE comes from the last deceased spouse and is not indexed for inflation after the first spouse's death", "DSUE is recomputed using the $15,000,000 basic exclusion in effect at Helen's death", "DSUE is available only if Helen's executor files Form 706 within 9 months of Ken's death", "DSUE can also be used to offset the generation-skipping transfer tax"], answer: "DSUE comes from the last deceased spouse and is not indexed for inflation after the first spouse's death" },
  ],
  explain: `<p>①課税遺産 = 24,000,000 − 葬儀30,000 − 管理費170,000 − 債務300,000 − 慈善1,000,000 − 州遺産税400,000(§2058)= <b>22,100,000</b>。</p>
<p>②調整課税贈与 = 1976年後の課税贈与で総遺産に含まれないもの。贈与時の価値で評価する:2,015,000 − 15,000 = <b>2,000,000</b>(死亡時の3,100,000ではない)。</p>
<p>③暫定税額計算の基礎 = 22,100,000 + 2,000,000 = <b>24,100,000</b>。暫定税額 = 345,800 + (24,100,000 − 1,000,000) × 40% = 9,585,800。</p>
<p>④DSUE = Kenの死亡時の基礎控除額11,700,000 − 使用額4,700,000 = <b>7,000,000</b>。</p>
<p>⑤適用除外額 = 基礎控除15,000,000 + DSUE7,000,000 = <b>22,000,000</b>。適用控除額(統一税額控除)= 345,800 + 21,000,000 × 40% = 8,745,800。</p>
<p>⑥過去の贈与税納付額は0なので遺産税 = 9,585,800 − 8,745,800 = <b>840,000</b>(= (24,100,000 − 22,000,000) × 40%)。</p>
<p>⑦DSUEは「最後に死亡した配偶者」から引き継ぎ、第1死亡時の金額で固定されインフレ調整されない。ポータビリティは第1死亡配偶者の遺産の期限内(Rev. Proc. 2022-32では5年以内の簡易救済あり)のForm 706で選択する。GST税の非課税枠には使えない。</p>`,
});

CPA.tbs({ id: "TBS-TCP-47", section: "TCP", chapter: "TCP-03", title: "代替評価日(§2032)の選択:6か月内の売却・分配と時の経過による減価",
  scenario: `<p>Masao Kudo, a never-married U.S. citizen, died on <b>January 10, 2026</b>. His executor is considering the alternate valuation date election. Values:</p>
<table><tr><th>Asset</th><th>Value at death</th><th>Event within 6 months</th><th>Value on July 10, 2026</th></tr>
<tr><td>Stock A</td><td>$6,000,000</td><td>Sold May 1, 2026 for $5,100,000</td><td>$4,500,000</td></tr>
<tr><td>Stock B</td><td>$9,000,000</td><td>None</td><td>$7,800,000</td></tr>
<tr><td>Land</td><td>$4,500,000</td><td>Distributed to heir June 1, 2026 (FMV $4,350,000)</td><td>$4,200,000</td></tr>
<tr><td>Patent (remaining life 10 years)</td><td>$1,200,000</td><td>None; decline solely from lapse of time</td><td>$1,020,000</td></tr>
<tr><td>Cash</td><td>$1,500,000</td><td>None</td><td>$1,500,000</td></tr></table>
<p>Debts and funeral expenses deductible on Form 706 total $200,000. Masao made no lifetime taxable gifts. Assume a 2026 basic exclusion amount of $15,000,000 and a flat 40% marginal rate above the exclusion.</p>
<p class="ja">未婚の米国市民Masao Kudoは2026年1月10日に死亡した。遺言執行者は代替評価日の選択を検討している。株式A:死亡時$6,000,000、2026年5月1日に$5,100,000で売却、7月10日の価値$4,500,000。株式B:死亡時$9,000,000、7月10日$7,800,000。土地:死亡時$4,500,000、2026年6月1日に相続人へ分配(時価$4,350,000)、7月10日$4,200,000。特許(残存期間10年):死亡時$1,200,000、7月10日$1,020,000で、減少は時の経過のみによる。現金$1,500,000(変動なし)。Form 706で控除できる債務・葬儀費用は$200,000。生前の課税贈与はない。2026年の基礎控除額は$15,000,000、控除額を超える部分の限界税率は一律40%とする。</p>`,
  rows: [
    { label: "Alternate-valuation value of Stock A(株式Aの代替評価額)", type: "num", answer: 5100000 },
    { label: "Alternate-valuation value of the land(土地の代替評価額)", type: "num", answer: 4350000 },
    { label: "Alternate-valuation value of the patent(特許の代替評価額)", type: "num", answer: 1200000 },
    { label: "Gross estate if the election is made(選択した場合の総遺産額)", type: "num", answer: 19950000 },
    { label: "Estate tax if the election is made(選択した場合の遺産税額)", type: "num", answer: 1900000 },
    { label: "May the executor make the §2032 election?(§2032の選択は可能か)", type: "select", options: ["Yes — it reduces both the gross estate and the estate tax; it applies to all assets and is irrevocable", "Yes — and it may be applied asset by asset", "No — alternate valuation is unavailable when assets are sold within 6 months", "No — the election is available only when no estate tax would otherwise be due"], answer: "Yes — it reduces both the gross estate and the estate tax; it applies to all assets and is irrevocable" },
    { label: "Heir's income tax basis in Stock B if the election is made(選択時の相続人の株式Bの基準価額)", type: "num", answer: 7800000 },
  ],
  explain: `<p>①代替評価日は死亡後6か月(2026年7月10日)。その間に売却・分配された資産は処分日の価値で評価する。株式A = 売却日5,100,000、土地 = 分配日4,350,000。</p>
<p>②時の経過のみによる価値の変動(特許・年金・終身権など)は代替評価で考慮しないので、特許は死亡日の <b>1,200,000</b>。</p>
<p>③代替評価による総遺産 = 5,100,000 + 7,800,000 + 4,350,000 + 1,200,000 + 1,500,000 = <b>19,950,000</b>(死亡日評価では22,200,000)。</p>
<p>④遺産税(選択時)= (19,950,000 − 200,000 − 15,000,000) × 40% = 4,750,000 × 40% = <b>1,900,000</b>。選択しない場合は (22,200,000 − 200,000 − 15,000,000) × 40% = 2,800,000 で、900,000の減少。</p>
<p>⑤§2032の選択は総遺産と(遺産税+GST税)の両方を減少させる場合に限り可能で、全資産に一括適用され、資産ごとの選択はできない。期限後1年以内のForm 706で行い取消不能。遺産税がゼロの遺産が基準価額を引き上げる目的で使うことはできない。</p>
<p>⑥相続人の基準価額は遺産税上の評価額と一致する(§1014)。株式B = <b>7,800,000</b>。</p>`,
});

CPA.tbs({ id: "TBS-TCP-48", section: "TCP", chapter: "TCP-03", title: "相続による所得(IRD)と§691(c)の遺産税控除",
  scenario: `<p>Naoko Abe, a never-married U.S. citizen, died on February 2, 2026. Her taxable estate is <b>$16,000,000</b>; she made no lifetime taxable gifts. The executor identified the following items of income in respect of a decedent (IRD), all included in the gross estate at the values shown, and one deduction in respect of a decedent (DRD), which was also deducted on Form 706 as a debt:</p>
<table><tr><th>Item</th><th>Amount</th><th>Recipient</th></tr>
<tr><td>Year-end bonus earned in 2025, paid in April 2026</td><td>$50,000</td><td>Estate</td></tr>
<tr><td>Traditional IRA (no basis)</td><td>$400,000</td><td>Son, Jiro (named beneficiary)</td></tr>
<tr><td>Deferred gain on an installment note</td><td>$100,000</td><td>Estate</td></tr>
<tr><td>Accrued but unpaid business expenses (DRD)</td><td>($50,000)</td><td>Estate</td></tr></table>
<p>Jiro withdrew <b>$100,000</b> from the inherited IRA in 2026. Assume a 2026 basic exclusion amount of $15,000,000 and a flat 40% marginal estate tax rate above the exclusion. Ignore any overall limitation on itemized deductions.</p>
<p class="ja">未婚の米国市民Naoko Abeは2026年2月2日に死亡した。課税遺産は$16,000,000で、生前の課税贈与はない。遺言執行者は次の相続による所得(IRD)を特定した(いずれも表示額で総遺産に算入済)。また相続による控除(DRD)が1項目あり、Form 706でも債務として控除している。2025年に稼得し2026年4月に支払われた賞与$50,000(遺産が受領)、伝統的IRA(基準価額なし)$400,000(受取人に指定された息子Jiro)、割賦販売手形の繰延利得$100,000(遺産)、未払の事業経費(DRD)$50,000(遺産)。Jiroは2026年に相続IRAから$100,000を引き出した。2026年の基礎控除額は$15,000,000、控除額を超える部分の遺産税の限界税率は一律40%とする。項目別控除の全体的な制限は無視する。</p>`,
  rows: [
    { label: "Net value of IRD (IRD less DRD)(IRDの純額)", type: "num", answer: 500000 },
    { label: "Federal estate tax actually payable(実際の連邦遺産税額)", type: "num", answer: 400000 },
    { label: "Estate tax attributable to net IRD(純IRDに帰属する遺産税)", type: "num", answer: 200000 },
    { label: "§691(c) deduction attributable to the entire IRA(IRA全体に帰属する§691(c)控除)", type: "num", answer: 145455, tol: 1 },
    { label: "Jiro's 2026 §691(c) deduction(Jiroの2026年の§691(c)控除)", type: "num", answer: 36364, tol: 1 },
    { label: "How Jiro claims the §691(c) deduction(Jiroの§691(c)控除の計上方法)", type: "select", options: ["Itemized deduction on Schedule A not treated as a miscellaneous itemized deduction", "Deduction in arriving at AGI", "Miscellaneous itemized deduction (disallowed)", "Credit against income tax"], answer: "Itemized deduction on Schedule A not treated as a miscellaneous itemized deduction" },
    { label: "Income tax basis of the IRA in Jiro's hands(Jiroが受けたIRAの基準価額)", type: "select", options: ["Zero — IRD receives no §1014 step-up", "$400,000 — fair market value at death", "$400,000 reduced by the §691(c) deduction", "$145,455 — the estate tax attributable to the IRA"], answer: "Zero — IRD receives no §1014 step-up" },
  ],
  explain: `<p>①IRD合計 = 50,000 + 400,000 + 100,000 = 550,000。純IRD = 550,000 − DRD50,000 = <b>500,000</b>。</p>
<p>②実際の遺産税 = (16,000,000 − 15,000,000) × 40% = <b>400,000</b>。</p>
<p>③純IRDを除いた場合の課税遺産 = 16,000,000 − 500,000 = 15,500,000、遺産税 = 500,000 × 40% = 200,000。純IRDに帰属する遺産税 = 400,000 − 200,000 = <b>200,000</b>(限界税率で計算する)。</p>
<p>④各IRD項目への配分は、IRD総額(DRD控除前)550,000に対する当該項目の比率による。IRA分 = 200,000 × 400,000/550,000 = 145,454.55 ≒ <b>145,455</b>(賞与分18,182、割賦手形分36,364)。</p>
<p>⑤§691(c)控除はIRDを所得に含めた年に、含めた割合で控除する。Jiro = 145,455 × 100,000/400,000 = 36,363.6 ≒ <b>36,364</b>。残りは今後の引出し時に控除できる。</p>
<p>⑥§691(c)控除は§67(b)(7)で雑多の項目別控除から除かれる項目別控除で、Schedule Aで控除できる(AGI算定上の控除ではない)。</p>
<p>⑦IRDは§1014(c)により死亡時の時価への基準価額引上げを受けないため、IRAの基準価額は0で、引出額全額が通常所得となる。</p>`,
});

CPA.tbs({ id: "TBS-TCP-49", section: "TCP", chapter: "TCP-03", title: "パブリックチャリティの公的支援テストと私的財団の物品税(§4940・§4942)",
  scenario: `<p><b>Part A.</b> Hope Learning Center, a §501(c)(3) organization, is testing public charity status under §170(b)(1)(A)(vi) for 2026 using its five-year (2021–2025) support data:</p>
<table><tr><th>Source (2021–2025 total)</th><th>Amount</th></tr>
<tr><td>Contributions from numerous individuals (no individual gave more than $50,000 in total)</td><td>$1,200,000</td></tr>
<tr><td>Contributions from one founding family</td><td>$900,000</td></tr>
<tr><td>Grants from a state government agency</td><td>$400,000</td></tr>
<tr><td>Dividends and interest</td><td>$1,500,000</td></tr>
<tr><td>Tuition and fees from its educational programs (exempt-function receipts)</td><td>$600,000</td></tr></table>
<p><b>Part B.</b> The Kimura Foundation, a private nonoperating foundation, reports for 2026: net investment income $2,000,000; average fair market value of noncharitable-use assets $40,000,000; no unrelated business income tax. Qualifying distributions treated as made out of its 2026 undistributed income totaled only $1,500,000 by December 31, 2027.</p>
<p class="ja">Part A:§501(c)(3)団体のHope Learning Centerは、§170(b)(1)(A)(vi)に基づく2026年のパブリックチャリティ判定を5年間(2021〜2025年)の支援データで行う。多数の個人からの寄附$1,200,000(どの個人も合計$50,000超の寄附なし)、創業家1家族からの寄附$900,000、州政府機関からの助成金$400,000、配当・利息$1,500,000、教育プログラムの授業料等(免税目的の事業収入)$600,000。Part B:私的非事業型財団のKimura財団の2026年の数値は、純投資所得$2,000,000、非慈善目的資産の平均時価$40,000,000、非関連事業所得税なしである。2026年の未分配所得から行われたとみなされる適格分配は、2027年12月31日までに$1,500,000にとどまった。</p>`,
  rows: [
    { label: "Total support for the §170(b)(1)(A)(vi) test(公的支援テストの総支援額)", type: "num", answer: 4000000 },
    { label: "Public support(公的支援額)", type: "num", answer: 1680000 },
    { label: "Public support percentage (%)(公的支援割合、%)", type: "num", answer: 42, tol: 0.1 },
    { label: "Hope's classification for 2026(Hopeの2026年の区分)", type: "select", options: ["Public charity — meets the 33⅓% mechanical test", "Public charity — qualifies only under the 10% facts-and-circumstances test", "Private foundation — fails both tests", "Private operating foundation"], answer: "Public charity — meets the 33⅓% mechanical test" },
    { label: "Kimura's §4940 excise tax on net investment income(Kimura財団の§4940純投資所得税)", type: "num", answer: 27800 },
    { label: "Kimura's 2026 distributable amount(2026年の分配必要額)", type: "num", answer: 1972200 },
    { label: "Kimura's §4942 initial (first-tier) tax(§4942の第1次税)", type: "num", answer: 141660 },
  ],
  explain: `<p>①§170(b)(1)(A)(vi)のテストでは免税目的の事業収入(授業料600,000)は総支援額に含めない(§509(a)(2)テストとの違い)。総支援額 = 1,200,000 + 900,000 + 400,000 + 1,500,000 = <b>4,000,000</b>。投資収益は総支援額には含むが公的支援には含まない。</p>
<p>②1人の寄附者からの寄附は総支援額の2%(4,000,000 × 2% = 80,000)までしか公的支援に算入できない。創業家は80,000に制限され、個人寄附者はいずれも80,000以下なので全額算入。政府助成金は全額公的支援。公的支援 = 1,200,000 + 80,000 + 400,000 = <b>1,680,000</b>。</p>
<p>③割合 = 1,680,000 / 4,000,000 = <b>42%</b> ≥ 33⅓%なので機械的テストでパブリックチャリティとなる(10%の事実・状況テストは不要)。</p>
<p>④私的財団の純投資所得税は1.39%(OBBBAの最終法では段階税率は採用されなかった):2,000,000 × 1.39% = <b>27,800</b>。</p>
<p>⑤最低投資収益 = 40,000,000 × 5% = 2,000,000。分配必要額 = 2,000,000 − §4940税27,800 = <b>1,972,200</b>。</p>
<p>⑥翌年末までに分配されない未分配所得 = 1,972,200 − 1,500,000 = 472,200。第1次税 = 472,200 × 30% = <b>141,660</b>(さらに是正されなければ100%の第2次税)。</p>`,
});

CPA.tbs({ id: "TBS-TCP-50", section: "TCP", chapter: "TCP-03", title: "UBTIのサイロ規則(§512(a)(6))・負債調達資産とForm 990シリーズの選択",
  scenario: `<p>Riverbend Youth Center, a calendar-year §501(c)(3) corporation, reports the following unrelated activities and other income for 2026:</p>
<table><tr><th>Activity / item</th><th>Gross income</th><th>Directly connected expenses</th></tr>
<tr><td>Fitness club open to the general public (unrelated trade or business)</td><td>$210,000</td><td>$140,000</td></tr>
<tr><td>Catering for outside weddings (separate unrelated trade or business)</td><td>$60,000</td><td>$75,000</td></tr>
<tr><td>Rental of debt-financed land to an unrelated party</td><td>$90,000</td><td>$50,000</td></tr>
<tr><td>Royalty for licensing its name and logo</td><td>$25,000</td><td>—</td></tr></table>
<p>Other data: the fitness club has a post-2017 NOL carryover of $10,000 from 2025. For the debt-financed land, average acquisition indebtedness was $420,000 and average adjusted basis was $1,050,000. The $1,000 specific deduction applies, and the corporate rate is 21%.</p>
<p>The client also asks which annual return each of its affiliates should file:</p>
<table><tr><th>Affiliate</th><th>Facts</th></tr>
<tr><td>Affiliate X</td><td>§501(c)(3) public charity; gross receipts normally $40,000 per year</td></tr>
<tr><td>Affiliate Y</td><td>§501(c)(3) private nonoperating foundation; total assets $300,000; gross receipts $60,000</td></tr></table>
<p class="ja">暦年の§501(c)(3)法人Riverbend Youth Centerの2026年の非関連活動その他の所得は次のとおり。一般向けフィットネスクラブ(非関連事業):総収入$210,000、直接関連費用$140,000。外部の結婚式向けケータリング(別個の非関連事業):総収入$60,000、費用$75,000。無関係の第三者への負債調達土地の賃貸:賃料$90,000、費用$50,000。名称・ロゴのライセンスによるロイヤルティ$25,000。その他:フィットネスクラブには2025年からの2017年後発生NOL繰越$10,000がある。負債調達土地の年平均取得負債は$420,000、年平均調整基準価額は$1,050,000。$1,000の特別控除を適用し、法人税率は21%とする。顧客は関連団体の年次申告書の種類も質問している。関連団体X:§501(c)(3)パブリックチャリティで、総収入は通常年$40,000。関連団体Y:§501(c)(3)私的非事業型財団で、総資産$300,000、総収入$60,000。</p>`,
  rows: [
    { label: "UBTI from the debt-financed land(負債調達土地からのUBTI)", type: "num", answer: 16000 },
    { label: "Fitness club UBTI after its NOL carryover(NOL控除後のフィットネスクラブのUBTI)", type: "num", answer: 60000 },
    { label: "Total UBTI after the specific deduction(特別控除後のUBTI合計)", type: "num", answer: 75000 },
    { label: "Unrelated business income tax(非関連事業所得税額)", type: "num", answer: 15750 },
    { label: "Catering NOL carried forward (usable only against catering income)(ケータリングのNOL繰越額)", type: "num", answer: 15000 },
    { label: "Treatment of the logo royalty(ロゴのロイヤルティの取扱い)", type: "select", options: ["Excluded from UBTI as a passive royalty", "Included in UBTI as a separate trade or business", "Included in UBTI because the logo is used commercially", "Excluded only if the licensee is another exempt organization"], answer: "Excluded from UBTI as a passive royalty" },
    { label: "Minimum annual information return required of Affiliate X(関連団体Xに最低限要求される年次申告書)", type: "select", options: ["Form 990-N (e-Postcard)", "Form 990-EZ", "Form 990", "Form 990-PF", "Form 990-T"], answer: "Form 990-N (e-Postcard)" },
    { label: "Minimum annual information return required of Affiliate Y(関連団体Yに最低限要求される年次申告書)", type: "select", options: ["Form 990-N (e-Postcard)", "Form 990-EZ", "Form 990", "Form 990-PF", "Form 990-T"], answer: "Form 990-PF" },
  ],
  explain: `<p>①負債調達比率 = 420,000 / 1,050,000 = 40%。UBTI = (90,000 − 50,000) × 40% = <b>16,000</b>。負債調達資産の賃料には受動的賃料の除外が適用されない(§514)。</p>
<p>②§512(a)(6)のサイロ規則により、各非関連事業ごとにUBTIを計算し、ある事業の損失を他の事業の所得と相殺できない。フィットネス:210,000 − 140,000 = 70,000。2017年後のNOLは当該事業の所得の80%(56,000)まで控除でき、10,000は全額控除可能:70,000 − 10,000 = <b>60,000</b>。</p>
<p>③ケータリングは15,000の損失で、他の事業と相殺できず、ケータリング事業のNOLとして <b>15,000</b> を繰り越す。負債調達資産などの投資活動は1つの区分として扱う。</p>
<p>④UBTI合計 = 60,000 + 0 + 16,000 = 76,000、特別控除1,000後 <b>75,000</b>。税額 = 75,000 × 21% = <b>15,750</b>(総収入$1,000以上のためForm 990-Tを提出)。</p>
<p>⑤名称・ロゴのライセンス料は受動的ロイヤルティとして§512(b)(2)でUBTIから除外(負債調達でない限り)。</p>
<p>⑥関連団体X:総収入が通常$50,000以下の団体はForm 990-N(電子ポストカード)で足りる(990-EZ・990も任意で可)。</p>
<p>⑦関連団体Y:私的財団は規模に関係なくForm 990-PFを提出する(990-EZや990-Nは使えない)。</p>`,
});
