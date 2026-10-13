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
