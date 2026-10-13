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

CPA.tbs({
  id: "TBS-REG-44", section: "REG", chapter: "REG-03", title: "AGI調整項目ワークシート(自営業税・健康保険・HSA・IRAと学資ローン利息の段階的縮小)",
  scenario: `<p>Marcus Hale, single, age 38, prepares the Schedule 1, Part II worksheet for 2026. Assume the following 2026 amounts: IRA contribution limit <b>$7,500</b>; IRA deduction phase-out for a single active participant <b>$81,000–$91,000</b> of MAGI; student loan interest phase-out (single) <b>$85,000–$100,000</b> of MAGI; HSA limit for self-only coverage <b>$4,400</b>; OASDI wage base <b>$184,500</b>.</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>W-2 wages (Marcus is an active participant in his employer's 401(k); the employer offers no health plan)</td><td>$64,000</td></tr>
<tr><td>Schedule C net profit from weekend photography business</td><td>$40,000</td></tr>
<tr><td>Premiums for a self-only high-deductible health plan bought on the marketplace (covered all year)</td><td>$4,800</td></tr>
<tr><td>Contribution to his HSA made with after-tax personal funds</td><td>$4,400</td></tr>
<tr><td>Alimony paid to former spouse under a divorce decree finalized in 2017 (never modified)</td><td>$6,000</td></tr>
<tr><td>Penalty on early withdrawal of a certificate of deposit (Form 1099-INT box 2)</td><td>$200</td></tr>
<tr><td>Moving expenses for a new civilian job 300 miles away</td><td>$3,500</td></tr>
<tr><td>Traditional IRA contribution made April 1, 2027, designated for 2026</td><td>$7,500</td></tr>
<tr><td>Interest paid on a qualified student loan</td><td>$3,000</td></tr></table>
<p>Marcus's W-2 wages are below the OASDI wage base. Round the IRA deduction as the IRS worksheet requires (up to the next $10).</p>
<p class="ja">独身・38歳のMarcus Haleは2026年のSchedule 1 Part II(AGI調整)を作成する。2026年の金額は次を仮定する:IRA拠出上限$7,500、職場年金加入者(独身)のIRA控除段階的縮小$81,000〜$91,000(MAGI)、学資ローン利息控除の段階的縮小(独身)$85,000〜$100,000(MAGI)、HSA(本人のみ)上限$4,400、OASDI課税上限$184,500。表の内容:W-2給与$64,000(勤務先401(k)に加入、勤務先は健康保険を提供していない)、週末の写真業のSchedule C純利益$40,000、マーケットプレイスで購入した本人のみの高額免責健康保険の保険料$4,800(年間加入)、個人資金によるHSA拠出$4,400、2017年に確定した離婚判決に基づく支払扶養料$6,000(変更なし)、定期預金の中途解約ペナルティ$200、300マイル離れた民間の新職場への引越費用$3,500、2027年4月1日に2026年分として行った伝統的IRA拠出$7,500、適格学資ローンの支払利息$3,000。給与はOASDI上限未満である。IRA控除はIRSのワークシートに従い$10単位に切り上げる。</p>`,
  rows: [
    { label: "Deductible part of self-employment tax(自営業税の控除可能部分)", type: "num", answer: 2826, tol: 1 },
    { label: "Self-employed health insurance deduction(自営業者の健康保険料控除)", type: "num", answer: 4800 },
    { label: "Treatment of the $6,000 alimony paid(支払扶養料$6,000の扱い)", type: "select", options: ["Deductible for AGI — divorce instrument executed before 2019", "Not deductible — TCJA repealed the deduction for all alimony", "Deductible as an itemized deduction", "Deductible only to the extent of the recipient's income"], answer: "Deductible for AGI — divorce instrument executed before 2019" },
    { label: "Treatment of the $3,500 moving expenses(引越費用$3,500の扱い)", type: "select", options: ["Deductible for AGI because the distance test is met", "Not deductible — limited to active-duty Armed Forces members (and, after 2025, certain intelligence community employees) moving under orders", "Deductible as a miscellaneous itemized deduction", "Deductible on Schedule C"], answer: "Not deductible — limited to active-duty Armed Forces members (and, after 2025, certain intelligence community employees) moving under orders" },
    { label: "Traditional IRA deduction(伝統的IRAの控除額)", type: "num", answer: 3920 },
    { label: "Student loan interest deduction(学資ローン利息控除)", type: "num", answer: 2500 },
    { label: "Total adjustments to income(AGI調整額の合計)", type: "num", answer: 24646, tol: 1 },
    { label: "Adjusted gross income(AGI)", type: "num", answer: 79354, tol: 1 },
  ],
  explain: `<p>自営業税 = 40,000 × 92.35% = 36,940 × 15.3% = 5,651.82(給与がOASDI上限未満のため全額12.4%部分も課税)。控除可能部分は50% = 2,825.91 ≒ 2,826。</p>
<p>自営業者の健康保険料:勤務先の補助付き保険に加入資格がなく、保険料4,800は事業の純利益(40,000 − 2,826)以下なので全額控除。HSA:本人のみ高額免責保険に年間加入しており、上限4,400以内なので全額控除(給与天引きではないためAGI調整)。</p>
<p>扶養料:2018年12月31日以前に締結された離婚証書に基づくため旧法が適用され、支払者はAGI控除できる。引越費用:民間人は控除不可(軍人および2026年以降の一部情報機関職員のみ)。中途解約ペナルティ200は控除可能。</p>
<p>IRAと学資ローンを除く調整額 = 2,826 + 4,800 + 4,400 + 6,000 + 200 = 18,226。総所得 = 64,000 + 40,000 = 104,000。IRA判定用MAGI = 104,000 − 18,226 = 85,774。</p>
<p>IRA:(91,000 − 85,774) ÷ 10,000 × 7,500 = 3,919.5 → $10単位に切り上げて3,920(翌年4月15日までの拠出は2026年分として認められる)。</p>
<p>学資ローン利息:MAGI = 85,774 − 3,920 = 81,854 < 85,000 のため縮小なし。上限2,500(支払3,000のうち)。</p>
<p>調整額合計 = 18,226 + 3,920 + 2,500 = 24,646。AGI = 104,000 − 24,646 = 79,354。</p>`,
});

CPA.tbs({
  id: "TBS-REG-45", section: "REG", chapter: "REG-03", title: "高所得夫婦の項目別控除と標準控除の比較(SALT上限の段階的縮小・住宅ローン利息の按分・寄附金0.5%フロア)",
  scenario: `<p>Daniel and Grace Okafor file jointly for 2026. Their AGI (and MAGI) is <b>$520,000</b>. Assume the following 2026 rules and amounts:</p>
<ul><li>Standard deduction, married filing jointly: <b>$32,200</b>.</li>
<li>SALT cap: <b>$40,400</b>, reduced by 30% of MAGI over <b>$505,000</b>, but not below <b>$10,000</b>.</li>
<li>Charitable contributions of itemizers are deductible only to the extent they exceed <b>0.5% of AGI</b> (contribution base).</li>
<li>Qualified residence acquisition debt limit: <b>$750,000</b> (debt incurred after December 15, 2017).</li>
<li>The couple's taxable income is below the 37% bracket, so no overall limitation on itemized deductions applies.</li></ul>
<table><tr><th>Item paid in 2026</th><th>Amount</th></tr>
<tr><td>State income tax withheld and paid</td><td>$28,000</td></tr>
<tr><td>Real property tax on main home</td><td>$14,000</td></tr>
<tr><td>Value-based vehicle registration fee</td><td>$600</td></tr>
<tr><td>Mortgage interest on main home bought in 2021; average acquisition debt $900,000</td><td>$45,000</td></tr>
<tr><td>Interest on a $100,000 home equity loan used to buy a car</td><td>$6,000</td></tr>
<tr><td>Cash donated to a public charity (receipt obtained)</td><td>$30,000</td></tr>
<tr><td>Listed stock held 6 years donated to a public charity: FMV $20,000, basis $5,000</td><td>$20,000</td></tr>
<tr><td>Unreimbursed medical expenses</td><td>$30,000</td></tr></table>
<p class="ja">Okafor夫妻は2026年を夫婦合算で申告し、AGI(MAGI)は$520,000である。2026年の規定は次を仮定する:夫婦合算の標準控除$32,200。SALT上限$40,400はMAGIが$505,000を超える額の30%だけ減額されるが$10,000を下回らない。項目別控除者の寄附金はAGI(寄附金計算基準額)の0.5%を超える部分のみ控除できる。取得債務の上限$750,000(2017年12月15日以降の借入)。課税所得は37%ブラケット未満であり項目別控除の全体制限は適用されない。2026年の支払:州所得税$28,000、自宅の固定資産税$14,000、価額基準の自動車登録料$600、2021年購入の自宅の住宅ローン利息$45,000(平均取得債務残高$900,000)、自動車購入に充てた$100,000のホームエクイティローンの利息$6,000、公益慈善団体への現金寄附$30,000(領収書あり)、6年保有の上場株式の公益慈善団体への寄附(時価$20,000、取得価額$5,000)、補填のない医療費$30,000。</p>`,
  rows: [
    { label: "Deductible state and local taxes after the cap(上限適用後のSALT控除額)", type: "num", answer: 35900 },
    { label: "Deductible qualified residence interest(控除可能な適格住宅ローン利息)", type: "num", answer: 37500 },
    { label: "Treatment of the $6,000 home equity loan interest(ホームエクイティローン利息$6,000の扱い)", type: "select", options: ["Fully deductible as qualified residence interest", "Deductible up to $100,000 of home equity debt", "Not deductible — proceeds were not used to buy, build, or substantially improve the residence", "Deductible as investment interest"], answer: "Not deductible — proceeds were not used to buy, build, or substantially improve the residence" },
    { label: "Deductible medical expenses(控除可能な医療費)", type: "num", answer: 0 },
    { label: "Deductible charitable contributions after the 0.5% floor(0.5%フロア適用後の寄附金控除額)", type: "num", answer: 47400 },
    { label: "Total itemized deductions(項目別控除の合計)", type: "num", answer: 120800 },
    { label: "Deduction the couple should claim(選択すべき控除)", type: "select", options: ["Standard deduction of $32,200", "Itemized deductions — they exceed the standard deduction", "Standard deduction plus the charitable deduction for non-itemizers", "Either; the amounts are equal"], answer: "Itemized deductions — they exceed the standard deduction" },
  ],
  explain: `<p>SALT:合計 = 28,000 + 14,000 + 600 = 42,600。上限 = 40,400 − 30% × (520,000 − 505,000) = 40,400 − 4,500 = 35,900(下限10,000以上)。控除額は35,900。</p>
<p>住宅ローン利息:取得債務900,000のうち上限750,000分のみ → 45,000 × 750,000 / 900,000 = 37,500。ホームエクイティローンは自動車購入に使われたため利息は控除不可(住宅の取得・建設・大規模改良に使われた場合のみ取得債務となる)。</p>
<p>医療費:AGIの7.5% = 39,000 を超える部分のみ控除可能 → 30,000 < 39,000 のため0。</p>
<p>寄附金:現金30,000(60%限度内)+ 長期保有の上場株式は時価20,000(公益慈善団体へのキャピタルゲイン資産、30%限度 = 156,000以内)= 50,000。0.5%フロア = 520,000 × 0.5% = 2,600 → 50,000 − 2,600 = 47,400。</p>
<p>合計 = 35,900 + 37,500 + 0 + 47,400 = 120,800 > 標準控除32,200 のため項目別控除を選択する(非項目別控除者向け寄附金控除は項目別控除と併用できない)。</p>`,
});

CPA.tbs({
  id: "TBS-REG-46", section: "REG", chapter: "REG-03", title: "Schedule C草案のレビューと給与所得者の自営業税(OASDI上限・追加メディケア税)",
  scenario: `<p>Priya Nair, single, is a salaried engineer (2026 W-2 box 3 Social Security wages and box 5 Medicare wages: <b>$170,000</b>) who also runs a cash-basis consulting sole proprietorship. A junior staff member drafted her 2026 Schedule C from the client's ledger below. Assume the following 2026 amounts: OASDI wage base <b>$184,500</b>; business standard mileage rate <b>72.5 cents</b> per mile; simplified home office rate <b>$5</b> per square foot. The Additional Medicare Tax threshold for a single filer is <b>$200,000</b> (not indexed).</p>
<table><tr><th>Ledger item</th><th>Amount</th></tr>
<tr><td>Fees reported on Forms 1099-NEC</td><td>$145,000</td></tr>
<tr><td>Fees received by check from clients that did not issue a 1099-NEC</td><td>$10,000</td></tr>
<tr><td>Retainer received December 28, 2026 for work to be performed in 2027</td><td>$5,000</td></tr>
<tr><td>Business meals with clients (substantiated)</td><td>$4,000</td></tr>
<tr><td>Basketball season tickets used to entertain clients</td><td>$3,000</td></tr>
<tr><td>Home office: 300 sq. ft. used regularly and exclusively (simplified method elected)</td><td>300 sq. ft.</td></tr>
<tr><td>Business miles driven in personal car (standard mileage rate elected)</td><td>8,000 miles</td></tr>
<tr><td>Computer equipment placed in service in 2026 (§179 elected)</td><td>$12,000</td></tr>
<tr><td>Office supplies</td><td>$3,700</td></tr>
<tr><td>Federal estimated income tax payments</td><td>$20,000</td></tr>
<tr><td>Health insurance premiums for Priya (her employer plan was declined)</td><td>$6,000</td></tr></table>
<p class="ja">独身のPriya Nairは給与所得のエンジニア(2026年のW-2の社会保障給与・メディケア給与はともに$170,000)であり、現金主義のコンサルティング個人事業も営む。若手スタッフが下記の元帳から2026年のSchedule C草案を作成した。2026年の金額は次を仮定する:OASDI課税上限$184,500、事業用標準走行距離単価1マイル72.5セント、簡便法の自宅事務所単価1平方フィート$5。独身者の追加メディケア税の基準額は$200,000(インフレ調整なし)。元帳:1099-NEC記載の報酬$145,000、1099-NECを発行しない顧客からの小切手入金$10,000、2027年に提供する業務の着手金として2026年12月28日受領$5,000、顧客との飲食$4,000(立証あり)、顧客接待用のバスケットボールのシーズンチケット$3,000、自宅事務所300平方フィート(常時・専用、簡便法選択)、私有車での事業走行8,000マイル(標準単価選択)、2026年に供用したコンピュータ機器$12,000(§179選択)、事務用品$3,700、連邦予定納税$20,000、Priya本人の健康保険料$6,000(勤務先の保険は辞退)。</p>`,
  rows: [
    { label: "Schedule C line 1 gross receipts(Schedule C 1行目の総収入)", type: "num", answer: 160000 },
    { label: "Deductible meals and entertainment combined(飲食・接待費の控除額合計)", type: "num", answer: 2000 },
    { label: "Treatment of the $20,000 federal estimated tax payments(連邦予定納税$20,000の扱い)", type: "select", options: ["Deductible on Schedule C as taxes and licenses", "Not deductible; claimed as a payment against the 2026 tax liability", "Deductible on Schedule A as a state and local tax", "Deductible for AGI on Schedule 1"], answer: "Not deductible; claimed as a payment against the 2026 tax liability" },
    { label: "Schedule C net profit(Schedule Cの純利益)", type: "num", answer: 135000 },
    { label: "Social Security (12.4%) portion of SE tax(自営業税のうち社会保障部分)", type: "num", answer: 1798 },
    { label: "Medicare (2.9%) portion of SE tax(自営業税のうちメディケア部分)", type: "num", answer: 3616, tol: 1 },
    { label: "Total self-employment tax on Schedule SE(Schedule SEの自営業税合計)", type: "num", answer: 5414, tol: 1 },
    { label: "Additional Medicare Tax on self-employment income (Form 8959)(自営業所得に係る追加メディケア税)", type: "num", answer: 852, tol: 1 },
  ],
  explain: `<p>総収入:現金主義では1099の有無を問わず受領額を計上し、前受の着手金も受領年度に課税される → 145,000 + 10,000 + 5,000 = 160,000。</p>
<p>費用:飲食4,000 × 50% = 2,000、接待(シーズンチケット)は控除不可で0 → 合計2,000。自宅事務所 300 × 5 = 1,500。車両 8,000 × 0.725 = 5,800。§179 12,000。事務用品3,700。連邦所得税は控除不可で税額からの支払として扱う。本人の健康保険料はSchedule Cではなく、Schedule 1の自営業者健康保険料控除(AGI調整)で扱う。</p>
<p>純利益 = 160,000 − (2,000 + 1,500 + 5,800 + 12,000 + 3,700) = 160,000 − 25,000 = 135,000。</p>
<p>自営業純所得 = 135,000 × 92.35% = 124,672.50。社会保障部分:OASDI上限の残り = 184,500 − 170,000 = 14,500 → 14,500 × 12.4% = 1,798。メディケア部分:124,672.50 × 2.9% = 3,615.50(上限なし)。合計 = 5,413.50 ≒ 5,414。</p>
<p>追加メディケア税:自営業所得の基準額は給与分だけ減額 → 200,000 − 170,000 = 30,000。(124,672.50 − 30,000) × 0.9% = 852.05 ≒ 852(給与には基準額未満のため追加税なし。この税は自営業税の控除可能部分の計算には含めない)。</p>`,
});

CPA.tbs({
  id: "TBS-REG-47", section: "REG", chapter: "REG-03", title: "家族の扶養親族判定と申告資格(適格子女・適格親族・HOH)",
  scenario: `<p>Elena Ruiz, age 45, has been divorced since 2024 and did not remarry. She is a U.S. citizen with 2026 AGI of <b>$85,000</b> and paid more than half the cost of maintaining her home. Everyone listed has a valid SSN. Assume the 2026 qualifying-relative gross income limit is <b>$5,300</b>, the head of household standard deduction is <b>$24,150</b>, the child tax credit is <b>$2,200</b> per qualifying child under age 17, and the credit for other dependents is <b>$500</b> (phase-outs begin at $200,000 of MAGI for a head of household).</p>
<table><tr><th>Person</th><th>Facts for 2026</th></tr>
<tr><td>Jacob (son)</td><td>Age 17 at December 31; lived with Elena all year; did not provide over half of his own support.</td></tr>
<tr><td>Mia (daughter)</td><td>Age 22; full-time college student for 8 months; lived with Elena except while away at school; earned $9,000 of wages but did not provide over half of her own support.</td></tr>
<tr><td>Rosa (Elena's mother)</td><td>Age 70; lives in her own apartment across town. Income: taxable interest $3,000 and Social Security benefits $14,000 (none taxable). Elena provided 60% of Rosa's support.</td></tr>
<tr><td>Leo (nephew)</td><td>Age 10; lived with Elena for 5 months and with his mother (Elena's sister) for 7 months; Elena paid 55% of his support.</td></tr>
<tr><td>Sam (friend)</td><td>Age 30; lived with Elena all year as a member of the household; earned $6,000; Elena provided 70% of his support.</td></tr></table>
<p class="ja">45歳のElena Ruizは2024年に離婚し再婚していない。米国市民で2026年のAGIは$85,000、自宅の維持費の半分超を負担した。全員が有効なSSNを持つ。2026年の適格親族の総所得上限は$5,300、世帯主(HOH)の標準控除は$24,150、児童税額控除は17歳未満の適格子女1人あたり$2,200、その他の扶養親族控除は$500(HOHのMAGI $200,000から段階的縮小)と仮定する。Jacob(息子):12月31日時点で17歳、通年同居、自身の扶養費の半分超を負担していない。Mia(娘):22歳、8か月間フルタイムの大学生、通学中以外は同居、給与$9,000を得たが自身の扶養費の半分超は負担していない。Rosa(母):70歳、市内の自分のアパートに居住、課税利息$3,000と社会保障給付$14,000(非課税)、Elenaが扶養費の60%を負担。Leo(甥):10歳、Elenaと5か月、母親(Elenaの姉妹)と7か月同居、Elenaが扶養費の55%を負担。Sam(友人):30歳、世帯員として通年同居、所得$6,000、Elenaが扶養費の70%を負担。</p>`,
  rows: [
    { label: "Jacob's status(Jacobの区分)", type: "select", options: ["Qualifying child — eligible for the $2,200 child tax credit", "Qualifying child — eligible only for the $500 credit for other dependents", "Qualifying relative", "Not a dependent"], answer: "Qualifying child — eligible only for the $500 credit for other dependents" },
    { label: "Mia's status(Miaの区分)", type: "select", options: ["Qualifying child (full-time student under age 24)", "Qualifying relative", "Not a dependent — her income exceeds the gross income limit", "Not a dependent — she is over age 18"], answer: "Qualifying child (full-time student under age 24)" },
    { label: "Rosa's status(Rosaの区分)", type: "select", options: ["Qualifying relative", "Not a dependent — she does not live with Elena", "Not a dependent — her total income exceeds $5,300", "Qualifying child"], answer: "Qualifying relative" },
    { label: "Leo's status(Leoの区分)", type: "select", options: ["Qualifying child of Elena", "Qualifying relative of Elena", "Not Elena's dependent — he is his mother's qualifying child", "Elena and her sister may each claim him"], answer: "Not Elena's dependent — he is his mother's qualifying child" },
    { label: "Sam's status(Samの区分)", type: "select", options: ["Qualifying relative — member of household all year", "Not a dependent — gross income exceeds the limit", "Not a dependent — not related to Elena", "Qualifying child"], answer: "Not a dependent — gross income exceeds the limit" },
    { label: "Elena's filing status(Elenaの申告資格)", type: "select", options: ["Single", "Head of household", "Qualifying surviving spouse", "Married filing separately"], answer: "Head of household" },
    { label: "Total child tax credit plus credit for other dependents(児童税額控除とその他扶養親族控除の合計)", type: "num", answer: 1500 },
    { label: "Elena's standard deduction(Elenaの標準控除額)", type: "num", answer: 24150 },
  ],
  explain: `<p>Jacob:関係・居住・年齢(19歳未満)・扶養の各テストを満たす適格子女だが、児童税額控除は年末時点で17歳未満が要件 → $500のその他扶養親族控除のみ。</p>
<p>Mia:24歳未満で5か月以上フルタイム学生、通学による不在は一時的不在として同居扱い。適格子女には総所得テストがないため給与9,000は無関係 → 適格子女(17歳以上のため$500)。</p>
<p>Rosa:親は同居不要。総所得テストでは非課税の社会保障給付を含めない → 3,000 < 5,300。扶養費60%を負担 → 適格親族($500)。</p>
<p>Leo:Elenaとの同居は半年未満で適格子女にならない。母親と7か月同居しており母親の適格子女であるため、他人の適格子女はElenaの適格親族にもなれない → 扶養親族ではない。</p>
<p>Sam:通年の世帯員なので関係テストは満たすが、総所得6,000 > 5,300 → 扶養親族ではない。</p>
<p>申告資格:未婚で、適格子女(Jacob・Mia)と同居し住居費の半分超を負担 → 世帯主(HOH)。なお親(Rosa)は同居していなくても HOH の適格者になる。</p>
<p>税額控除:Jacob 500 + Mia 500 + Rosa 500 = 1,500(AGI 85,000は段階的縮小の開始額未満)。標準控除:HOH 24,150。</p>`,
});
