// REG のTBS追加(個人課税:総所得・AGI調整・控除・自営業税・扶養・税額控除・別荘・AMT・QBI)

CPA.tbs({
  id: "TBS-REG-43", section: "REG", chapter: "REG-03", title: "退職夫婦の情報申告書パケットから総所得と社会保障給付の課税額を計算",
  scenario: `<p>Walter (age 74) and June (age 66) Brennan file a joint 2026 Form 1040. Their tax preparer assembled the following information returns and client notes. Assume the 2026 qualified charitable distribution (QCD) limit is <b>$111,000</b> per IRA owner. The Social Security base amounts for joint filers are <b>$32,000</b> and <b>$44,000</b> (not indexed).</p>
<table><tr><th>Document</th><th>Description</th><th>Amount</th></tr>
<tr><td>Form W-2 (June)</td><td>Box 1 wages, part-time job</td><td>$18,000</td></tr>
<tr><td>Form 1099-R (Walter)</td><td>Employer pension, box 2a taxable amount</td><td>$12,000</td></tr>
<tr><td>Form 1099-R (Walter)</td><td>Traditional IRA distribution (no basis); $3,000 was paid directly by the IRA trustee to a public charity</td><td>$8,000</td></tr>
<tr><td>Form 1099-R (June)</td><td>Roth IRA distribution; account opened 2012, June over age 59&frac12;</td><td>$6,000</td></tr>
<tr><td>Form 1099-INT</td><td>Box 1 bank interest</td><td>$2,500</td></tr>
<tr><td>Form 1099-INT</td><td>Box 8 tax-exempt municipal bond interest</td><td>$4,000</td></tr>
<tr><td>Form 1099-DIV</td><td>Box 1a ordinary dividends</td><td>$3,500</td></tr>
<tr><td>Form W-2G</td><td>Casino slot winnings</td><td>$1,000</td></tr>
<tr><td>Form SSA-1099</td><td>Combined net Social Security benefits (box 5)</td><td>$28,000</td></tr>
<tr><td>Form 1099-G</td><td>State income tax refund (couple claimed the standard deduction in 2025)</td><td>$900</td></tr>
<tr><td>Client note</td><td>Life insurance proceeds on the death of Walter's brother</td><td>$25,000</td></tr></table>
<p class="ja">Walter(74歳)とJune(66歳)のBrennan夫妻は2026年のForm 1040を夫婦合算で申告する。税務担当者は上表の情報申告書と顧客メモを収集した。2026年の適格慈善分配(QCD)の上限はIRA所有者1人あたり$111,000と仮定する。夫婦合算申告者の社会保障給付の基準額は$32,000と$44,000(インフレ調整なし)である。表の内容:June のW-2給与$18,000、Walterの企業年金(課税額)$12,000、Walterの伝統的IRA分配$8,000(拠出基準額なし。うち$3,000はIRA受託者から公益慈善団体へ直接支払)、JuneのRoth IRA分配$6,000(2012年開設、59歳半超)、銀行利息$2,500、非課税の地方債利息$4,000、普通配当$3,500、カジノのスロット賞金$1,000、社会保障給付(純額)$28,000、州所得税還付$900(2025年は標準控除を選択)、Walterの兄の死亡による生命保険金$25,000。</p>`,
  rows: [
    { label: "Taxable amount of Walter's traditional IRA distribution(伝統的IRA分配の課税額)", type: "num", answer: 5000 },
    { label: "Treatment of the $900 state income tax refund(州税還付$900の扱い)", type: "select", options: ["Fully taxable as other income", "Excluded — no tax benefit was received in 2025 (tax benefit rule)", "Taxable only to the extent it exceeds $500", "Reduces the 2026 SALT deduction instead"], answer: "Excluded — no tax benefit was received in 2025 (tax benefit rule)" },
    { label: "Treatment of June's $6,000 Roth IRA distribution(Roth IRA分配$6,000の扱い)", type: "select", options: ["Fully taxable", "Taxable to the extent of earnings only", "Excluded — qualified distribution (5-year rule met and over age 59½)", "Subject to the 10% additional tax"], answer: "Excluded — qualified distribution (5-year rule met and over age 59½)" },
    { label: "Provisional (combined) income for Social Security purposes(社会保障給付判定用の暫定所得)", type: "num", answer: 60000 },
    { label: "Taxable Social Security benefits(社会保障給付の課税額)", type: "num", answer: 19600 },
    { label: "Total gross income reported as total income on Form 1040(Form 1040の総所得合計)", type: "num", answer: 61600 },
  ],
  explain: `<p>IRA分配:Walterは70歳半以上であり、受託者から慈善団体へ直接支払われた$3,000は適格慈善分配(QCD)として総所得から除外される(上限$111,000以内)。課税額 = 8,000 − 3,000 = 5,000。</p>
<p>州税還付:2025年は標準控除を選択しており州税の控除による税務上の便益を受けていないため、タックス・ベネフィット・ルールにより非課税である。</p>
<p>Roth IRA:口座開設から5課税年度が経過し59歳半超であるため適格分配として全額非課税。生命保険金も死亡給付として非課税である。</p>
<p>社会保障給付以外の総所得 = 給与18,000 + 年金12,000 + IRA 5,000 + 利息2,500 + 配当3,500 + 賭博所得1,000 = 42,000。</p>
<p>暫定所得 = 42,000 + 非課税地方債利息4,000 + 給付の50% 14,000 = 60,000。</p>
<p>課税額:(a) 85% × 28,000 = 23,800 と、(b) 85% × (60,000 − 44,000) + min(50% × 28,000 = 14,000, 50% × (44,000 − 32,000) = 6,000) = 13,600 + 6,000 = 19,600 のいずれか少ない方 → 19,600。</p>
<p>総所得合計 = 42,000 + 19,600 = 61,600。</p>`,
});
