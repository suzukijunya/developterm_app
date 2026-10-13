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
