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

CPA.tbs({
  id: "TBS-REG-48", section: "REG", chapter: "REG-03", title: "子供・扶養家族介護費用控除と教育税額控除(AOTC・LLC)の段階的縮小",
  scenario: `<p>Daniel and Priya Okafor file a joint 2026 return. Their modified AGI is <b>$170,000</b>. Daniel's earned income is $122,000 and Priya's is $48,000. Assume the following 2026 amounts:</p>
<ul><li>Child and dependent care credit: expense limit $3,000 (one qualifying person) / $6,000 (two or more), reduced by amounts excluded under an employer dependent care FSA. At the Okafors' AGI the applicable credit percentage is <b>30%</b>.</li>
<li>Child tax credit $2,200 per qualifying child under age 17; credit for other dependents $500; phase-out begins at $400,000 (joint).</li>
<li>American opportunity tax credit (AOTC): 100% of the first $2,000 and 25% of the next $2,000 of qualified expenses per eligible student; 40% refundable. Lifetime learning credit (LLC): 20% of up to $10,000 of qualified expenses per return. Both credits phase out ratably between MAGI of <b>$160,000 and $180,000</b> (joint).</li></ul>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Ava (age 4): licensed day-care center while both parents work</td><td>$7,000</td></tr>
<tr><td>Ben (age 10): after-school care program</td><td>$2,500</td></tr>
<tr><td>Ben: two-week overnight summer camp</td><td>$1,500</td></tr>
<tr><td>Daniel's employer dependent care FSA reimbursements (excluded from wages)</td><td>$2,000</td></tr>
<tr><td>Chloe (age 19, dependent, first year of college, full-time): tuition</td><td>$5,200</td></tr>
<tr><td>Chloe: required enrollment fees</td><td>$400</td></tr>
<tr><td>Chloe: required textbooks</td><td>$600</td></tr>
<tr><td>Chloe: room and board</td><td>$9,000</td></tr>
<tr><td>Chloe: tax-free scholarship applied to tuition</td><td>$1,800</td></tr>
<tr><td>Priya: one graduate course to improve job skills (not degree program): tuition</td><td>$3,000</td></tr></table>
<p class="ja">Daniel と Priya Okafor は2026年に夫婦合算申告する。修正AGIは<b>$170,000</b>。Danielの勤労所得は$122,000、Priyaは$48,000。2026年の金額は以下を前提とする:介護費用控除の対象費用上限は1人$3,000/2人以上$6,000で、雇用主の扶養介護FSAで除外した額だけ減額。夫婦のAGIでの控除率は<b>30%</b>。児童税額控除は17歳未満の適格子女1人$2,200、その他扶養親族控除$500、縮小開始$400,000(合算)。AOTCは学生1人あたり最初の$2,000の100%と次の$2,000の25%、40%が還付可能。LLCは申告書あたり$10,000までの20%。両控除はMAGI <b>$160,000〜$180,000</b>(合算)で比例縮小する。資料:Ava(4歳)認可保育所$7,000、Ben(10歳)放課後プログラム$2,500、Benの2週間の宿泊サマーキャンプ$1,500、DanielのFSA払戻(給与から除外)$2,000、Chloe(19歳・扶養親族・大学1年・フルタイム)授業料$5,200・必須登録料$400・必須教科書$600・寮費食費$9,000・授業料に充当された非課税奨学金$1,800、Priyaの職業能力向上目的の大学院科目1つ(学位課程外)授業料$3,000。</p>`,
  rows: [
    { label: "Qualifying child care expenses before the dollar limit(上限適用前の適格介護費用)", type: "num", answer: 9500 },
    { label: "Child and dependent care credit(子供・扶養家族介護費用控除)", type: "num", answer: 1200 },
    { label: "Child tax credit plus credit for other dependents(児童税額控除+その他扶養親族控除)", type: "num", answer: 4900 },
    { label: "AOTC for Chloe after phase-out(縮小後のChloeのAOTC)", type: "num", answer: 1250 },
    { label: "Refundable portion of the AOTC(AOTCの還付可能部分)", type: "num", answer: 500 },
    { label: "Credit available for Priya's course(Priyaの受講に使える控除)", type: "select", options: ["American opportunity tax credit", "Lifetime learning credit", "No education credit — not a degree program", "Tuition and fees deduction"], answer: "Lifetime learning credit" },
    { label: "Lifetime learning credit after phase-out(縮小後のLLC)", type: "num", answer: 300 },
  ],
  explain: `<p>適格介護費用:13歳未満の子の就労のための介護費用が対象。保育所7,000 + 放課後プログラム2,500 = 9,500。宿泊型キャンプ1,500は対象外。</p>
<p>介護費用控除:対象者2人なので上限6,000 − FSA除外額2,000 = 4,000(低い方の勤労所得48,000を下回る)。4,000 × 30% = 1,200。</p>
<p>児童税額控除:Ava・Benは17歳未満 → 2 × 2,200 = 4,400。Chloe(19歳)はその他扶養親族控除500。合計4,900(AGI 170,000は縮小開始額400,000未満)。</p>
<p>AOTC:対象費用は授業料・必須登録料・必須教科書(AOTCでは教材も対象)= 5,200 + 400 + 600 = 6,200、寮費食費は対象外、非課税奨学金1,800を控除 → 4,400、上限4,000。控除額 = 2,000 + 25% × 2,000 = 2,500。縮小:(170,000 − 160,000) ÷ 20,000 = 50%減 → 1,250。</p>
<p>還付可能部分:1,250 × 40% = 500。</p>
<p>Priya:学位課程外・半期未満でもLLCは職業能力向上目的の科目を対象とする。AOTCは学位課程で半期以上在籍が要件(かつ大学4年分まで)。授業料・手数料控除は2020年で廃止。</p>
<p>LLC:3,000 × 20% = 600、50%縮小 → 300。</p>`,
});

CPA.tbs({
  id: "TBS-REG-49", section: "REG", chapter: "REG-03", title: "予定納税のセーフハーバー(前年税額110%基準)と四半期ごとの過少納付額",
  scenario: `<p>Marisol Vega, a single filer, is a self-employed architect. Her prior-year (2025) return showed AGI of <b>$180,000</b> and total tax of <b>$30,000</b> (a full 12-month return). Her 2026 total tax is <b>$48,000</b>. During 2026 she also worked a short W-2 engagement on which <b>$6,000</b> of federal income tax was withheld; she makes no election to treat withholding as paid on the actual dates. She did not use the annualized income installment method.</p>
<table><tr><th>Installment due date</th><th>Estimated tax paid on the due date</th></tr>
<tr><td>April 15, 2026</td><td>$4,000</td></tr>
<tr><td>June 15, 2026</td><td>$4,000</td></tr>
<tr><td>September 15, 2026</td><td>$9,000</td></tr>
<tr><td>January 15, 2027</td><td>$9,000</td></tr></table>
<p>Tax law excerpt (IRC §6654): The required annual payment is the lesser of (1) 90% of the current-year tax or (2) 100% of the prior-year tax (110% if prior-year AGI exceeded $150,000). No penalty applies if the tax shown on the return, reduced by withholding and credits, is less than $1,000.</p>
<p class="ja">個人申告者のMarisol Vegaは自営の建築家。前年(2025年、12か月の申告)のAGIは<b>$180,000</b>、税額合計は<b>$30,000</b>。2026年の税額合計は<b>$48,000</b>。2026年には短期の給与所得もあり、源泉徴収額は<b>$6,000</b>で、源泉徴収を実際の日に納付したものとして扱う選択はしていない。年換算所得法は使っていない。予定納税は4/15に$4,000、6/15に$4,000、9/15に$9,000、2027/1/15に$9,000(いずれも期限日に納付)。条文要旨(IRC §6654):年間必要納付額は(1)当年税額の90%と(2)前年税額の100%(前年AGIが$150,000超なら110%)のいずれか少ない額。申告税額から源泉徴収・税額控除を差し引いた額が$1,000未満ならペナルティはない。</p>`,
  rows: [
    { label: "90% of current-year tax(当年税額の90%)", type: "num", answer: 43200 },
    { label: "Required annual payment(年間必要納付額)", type: "num", answer: 33000 },
    { label: "Required installment for each quarter(各四半期の必要納付額)", type: "num", answer: 8250 },
    { label: "Underpayment for the April 15 installment(4/15期の過少納付額)", type: "num", answer: 2750 },
    { label: "Cumulative underpayment as of June 15(6/15時点の累積過少納付額)", type: "num", answer: 5500 },
    { label: "Cumulative underpayment as of September 15(9/15時点の累積過少納付額)", type: "num", answer: 3250 },
    { label: "Cumulative underpayment as of January 15, 2027(2027/1/15時点の累積過少納付額)", type: "num", answer: 1000 },
    { label: "Is an underpayment penalty potentially due?(過少納付ペナルティの可能性)", type: "select", options: ["No — the $1,000 de minimis exception applies", "No — withholding alone covers 100% of the prior-year tax", "Yes — the balance due exceeds $1,000 and installments fell short", "No — self-employed individuals are exempt"], answer: "Yes — the balance due exceeds $1,000 and installments fell short" },
  ],
  explain: `<p>当年基準:48,000 × 90% = 43,200。</p>
<p>前年基準:前年AGI 180,000 > 150,000 なので 30,000 × 110% = 33,000。少ない方 → 年間必要納付額33,000。</p>
<p>各期:33,000 ÷ 4 = 8,250。源泉徴収6,000は各期に均等(1,500ずつ)納付されたものとみなす。</p>
<p>4/15期:8,250 − (1,500 + 4,000) = 2,750。</p>
<p>6/15時点:必要累計16,500 − 納付累計(3,000 + 8,000 = 11,000)= 5,500。</p>
<p>9/15時点:必要累計24,750 − 納付累計(4,500 + 17,000 = 21,500)= 3,250。</p>
<p>1/15時点:必要累計33,000 − 納付累計(6,000 + 26,000 = 32,000)= 1,000。</p>
<p>判定:申告税額48,000 − 源泉6,000 = 42,000 ≥ 1,000 なので少額免除はなく、各期の納付が不足しているためペナルティ(過少額 × 期間 × 利率)が生じ得る。申告時の納付残高は48,000 − 32,000 = 16,000。</p>`,
});

CPA.tbs({
  id: "TBS-REG-50", section: "REG", chapter: "REG-03", title: "複数事業のQBI控除(W-2賃金・UBIA制限、SSTB、REIT配当、課税所得制限)",
  scenario: `<p>Graham and Lena Holt file a joint 2026 return. Their taxable income before the QBI deduction is <b>$600,000</b>, which includes <b>$50,000</b> of net capital gain (long-term gains and qualified dividends). Assume the 2026 §199A threshold amount for joint filers is <b>$403,500</b> and the phase-in range is <b>$150,000</b> (so limitations apply fully at $553,500 and above). Each activity below is a separate trade or business; no aggregation election is made.</p>
<table><tr><th>Activity</th><th>QBI</th><th>Allocable W-2 wages</th><th>UBIA of qualified property</th></tr>
<tr><td>Holt Fabrication (S corporation, manufacturing) — K-1</td><td>$300,000</td><td>$80,000</td><td>$600,000</td></tr>
<tr><td>Holt Advisory LLC (management consulting) — Schedule C</td><td>$150,000</td><td>$40,000</td><td>$20,000</td></tr>
<tr><td>Apartment building (rental rising to the level of a trade or business) — Schedule E</td><td>$100,000</td><td>$0</td><td>$1,200,000</td></tr></table>
<p>They also received <b>$10,000</b> of qualified REIT dividends (Form 1099-DIV box 5) and have no PTP income.</p>
<p class="ja">Graham と Lena Holt は2026年に夫婦合算申告する。QBI控除前の課税所得は<b>$600,000</b>で、そのうち<b>$50,000</b>は純キャピタルゲイン(長期譲渡益と適格配当)。2026年の§199Aの基準額は合算で<b>$403,500</b>、段階適用幅は<b>$150,000</b>(つまり$553,500以上で制限が全面適用)と仮定する。各活動は別個の事業で、合算(aggregation)選択はしていない。Holt Fabrication(S法人・製造業、K-1):QBI $300,000、W-2賃金$80,000、適格資産のUBIA $600,000。Holt Advisory LLC(経営コンサルティング、Schedule C):QBI $150,000、W-2賃金$40,000、UBIA $20,000。賃貸アパート(事業に該当、Schedule E):QBI $100,000、W-2賃金$0、UBIA $1,200,000。ほかに適格REIT配当$10,000(1099-DIV 5欄)があり、PTP所得はない。</p>`,
  rows: [
    { label: "QBI component — Holt Fabrication(Holt FabricationのQBI構成額)", type: "num", answer: 40000 },
    { label: "Treatment of Holt Advisory LLC(Holt Advisoryの取扱い)", type: "select", options: ["Specified service trade or business — excluded entirely at this income level", "Eligible, limited to 50% of W-2 wages", "Eligible, no wage limit because it is a sole proprietorship", "Eligible, limited to 2.5% of UBIA"], answer: "Specified service trade or business — excluded entirely at this income level" },
    { label: "QBI component — apartment building(賃貸アパートのQBI構成額)", type: "num", answer: 20000 },
    { label: "REIT/PTP component(REIT・PTP構成額)", type: "num", answer: 2000 },
    { label: "Overall taxable-income limitation(課税所得による全体制限額)", type: "num", answer: 110000 },
    { label: "QBI deduction(QBI控除額)", type: "num", answer: 62000 },
    { label: "Holt Fabrication component if taxable income were $478,500 instead(課税所得が$478,500だった場合のHolt Fabrication構成額)", type: "num", answer: 50000 },
  ],
  explain: `<p>Holt Fabrication:20% × 300,000 = 60,000。W-2/UBIA制限は (a) 50% × 80,000 = 40,000 と (b) 25% × 80,000 + 2.5% × 600,000 = 20,000 + 15,000 = 35,000 の大きい方 = 40,000。課税所得600,000は553,500以上なので制限が全面適用 → 40,000。</p>
<p>Holt Advisory:コンサルティングは特定サービス事業(SSTB)。課税所得が段階適用幅の上限を超えるため、QBI・賃金・UBIAのすべてが除外され構成額は0。</p>
<p>賃貸アパート:20% × 100,000 = 20,000。制限は 50% × 0 = 0 と 25% × 0 + 2.5% × 1,200,000 = 30,000 の大きい方 = 30,000 → 20,000(制限内)。</p>
<p>REIT構成額:適格REIT配当にはW-2/UBIA制限がない → 20% × 10,000 = 2,000。</p>
<p>全体制限:20% × (600,000 − 50,000) = 110,000。</p>
<p>QBI控除:(40,000 + 0 + 20,000) + 2,000 = 62,000 < 110,000 → 62,000。</p>
<p>課税所得478,500の場合:段階適用率 = (478,500 − 403,500) ÷ 150,000 = 50%。20%QBI 60,000 − 制限額40,000 = 20,000 の50%を減額 → 60,000 − 10,000 = 50,000。</p>`,
});

CPA.tbs({
  id: "TBS-REG-51", section: "REG", chapter: "REG-03", title: "AMTワークシート(ISO・私的活動債利子・減価償却調整と免除額の50%縮小)",
  scenario: `<p>Nathan Cole, a single filer, has 2026 regular taxable income of <b>$450,000</b> and a regular tax liability of <b>$126,269</b> (no capital gains or qualified dividends). He itemized deductions, including <b>$10,000</b> of state and local taxes and <b>$18,000</b> of home mortgage interest on acquisition debt used to buy his residence. Additional facts:</p>
<ul><li>In 2026 he exercised incentive stock options (ISOs) and held the shares at year-end. Fair market value at exercise exceeded the exercise price by <b>$120,000</b>.</li>
<li>He received <b>$15,000</b> of interest on specified private activity bonds issued in 2019 (excluded from regular gross income).</li>
<li>On a Schedule C rental-equipment activity, regular-tax MACRS depreciation was <b>$25,000</b>; depreciation under the AMT (150% declining balance) method was <b>$18,000</b>.</li></ul>
<p>Assume the following 2026 AMT amounts for single filers: exemption <b>$90,100</b>, reduced by <b>50%</b> of AMTI over <b>$500,000</b>; tax rates 26% on the first <b>$244,500</b> of the AMT base and 28% on the excess.</p>
<p class="ja">個人申告者のNathan Coleの2026年の通常課税所得は<b>$450,000</b>、通常税額は<b>$126,269</b>(キャピタルゲイン・適格配当なし)。項目別控除を選択し、州・地方税<b>$10,000</b>と自宅取得のための借入の住宅ローン利息<b>$18,000</b>を含む。追加事項:2026年にISOを行使し年末まで株式を保有、行使時の時価が行使価格を<b>$120,000</b>上回った。2019年発行の特定私的活動債の利息<b>$15,000</b>を受領(通常の総所得からは除外)。Schedule Cの機器賃貸事業の通常税上のMACRS減価償却費は<b>$25,000</b>、AMT上(150%定率法)は<b>$18,000</b>。2026年の単身者のAMT金額は次を仮定する:免除額<b>$90,100</b>、AMTIが<b>$500,000</b>を超える額の<b>50%</b>だけ減額。税率はAMT課税ベースの最初の<b>$244,500</b>まで26%、超過分28%。</p>`,
  rows: [
    { label: "Total AMT adjustments and preferences(AMT調整項目・優遇項目の合計)", type: "num", answer: 152000 },
    { label: "Alternative minimum taxable income (AMTI)(代替ミニマム課税所得)", type: "num", answer: 602000 },
    { label: "AMT exemption after phase-out(縮小後の免除額)", type: "num", answer: 39100 },
    { label: "Tentative minimum tax(暫定ミニマム税)", type: "num", answer: 152722 },
    { label: "Alternative minimum tax(代替ミニマム税)", type: "num", answer: 26453 },
    { label: "Treatment of the mortgage interest(住宅ローン利息の取扱い)", type: "select", options: ["No adjustment — qualified housing interest on acquisition debt", "Add back in full", "Add back only the portion over $10,000", "Tax preference item"], answer: "No adjustment — qualified housing interest on acquisition debt" },
    { label: "Items that generate a minimum tax credit carryforward(最低税額控除の繰越を生む項目)", type: "select", options: ["All four items (SALT, ISO, bond interest, depreciation)", "ISO bargain element and depreciation (deferral items) only", "SALT and private activity bond interest (exclusion items) only", "None — the minimum tax credit was repealed"], answer: "ISO bargain element and depreciation (deferral items) only" },
  ],
  explain: `<p>調整・優遇項目:SALTの加算10,000 + ISOのバーゲン要素120,000 + 私的活動債利子15,000(優遇項目)+ 減価償却調整(25,000 − 18,000 = 7,000)= 152,000。取得債務の住宅ローン利息は調整不要。</p>
<p>AMTI:450,000 + 152,000 = 602,000。</p>
<p>免除額:90,100 − 50% × (602,000 − 500,000) = 90,100 − 51,000 = 39,100。</p>
<p>暫定ミニマム税:課税ベース602,000 − 39,100 = 562,900。26% × 244,500 = 63,570、28% × (562,900 − 244,500 = 318,400) = 89,152、合計152,722。</p>
<p>AMT:152,722 − 通常税額126,269 = 26,453。</p>
<p>最低税額控除:将来の通常税で逆転する繰延項目(ISO・減価償却)から生じたAMTだけが控除の対象。SALTや私的活動債利子は恒久的な除外項目で控除を生まない。</p>`,
});
