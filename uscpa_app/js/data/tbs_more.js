// 追加のTBS

CPA.tbs({
  id: "TBS-FAR-04",
  section: "FAR",
  chapter: "FAR-03",
  title: "棚卸資産の評価方法(FIFO・LIFO・総平均法)",
  scenario: `<p>Ito Co. uses a periodic inventory system. Data for the year:</p>
<table><tr><th></th><th>Units</th><th>Unit cost</th></tr>
<tr><td>Beginning inventory</td><td>100</td><td>$10</td></tr>
<tr><td>Purchase #1</td><td>200</td><td>$12</td></tr>
<tr><td>Purchase #2</td><td>100</td><td>$14</td></tr></table>
<p>Ito sold <b>250</b> units during the year.</p>
<p class="ja">Ito社は棚卸計算法を採用している。期首在庫100個@$10、1回目の仕入200個@$12、2回目の仕入100個@$14。当期に250個を販売した。総平均法は期中の全仕入と期首在庫の加重平均単価を用いる。</p>`,
  rows: [
    { label: "Ending inventory — FIFO(FIFOの期末棚卸高)", type: "num", answer: 2000 },
    { label: "Cost of goods sold — FIFO(FIFOの売上原価)", type: "num", answer: 2800 },
    { label: "Ending inventory — LIFO(LIFOの期末棚卸高)", type: "num", answer: 1600 },
    { label: "Cost of goods sold — LIFO(LIFOの売上原価)", type: "num", answer: 3200 },
    { label: "Ending inventory — weighted average(総平均法の期末棚卸高)", type: "num", answer: 1800 },
  ],
  explain: `<p>販売可能額 = 1,000 + 2,400 + 1,400 = 4,800(400個)。期末在庫 150個。</p>
<p>FIFO:新しい原価が残る 100 × 14 + 50 × 12 = 2,000、売上原価 2,800。</p>
<p>LIFO:古い原価が残る 100 × 10 + 50 × 12 = 1,600、売上原価 3,200。</p>
<p>総平均:4,800 ÷ 400 = 12 → 150 × 12 = 1,800。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-05",
  section: "FAR",
  chapter: "FAR-05",
  title: "持分法による投資の計算",
  scenario: `<p>On January 1, Year 1, Kimura Corp. paid <b>$300,000</b> for <b>25%</b> of the common stock of Nakamura Inc., gaining significant influence. Nakamura's net assets had a book value of <b>$1,000,000</b>. The excess of cost over book value is attributable to equipment with a <b>10-year</b> remaining life. During Year 1, Nakamura reported net income of <b>$120,000</b> and paid dividends of <b>$40,000</b>.</p>
<p class="ja">1年目1月1日、Kimura社はNakamura社の普通株式25%を$300,000で取得し重要な影響力を得た。Nakamura社の純資産の簿価は$1,000,000。取得原価と簿価の差額は残存耐用年数10年の設備に起因する。1年目のNakamura社の純利益は$120,000、配当は$40,000。</p>`,
  rows: [
    { label: "Excess of cost over book value acquired(取得原価と簿価の持分の差額)", type: "num", answer: 50000 },
    { label: "Annual amortization of the excess(差額の年間償却額)", type: "num", answer: 5000 },
    { label: "Equity in investee income, Year 1(1年目の持分法投資利益)", type: "num", answer: 25000 },
    { label: "Dividends received by Kimura(Kimura社の受取配当)", type: "num", answer: 10000 },
    { label: "Investment balance, Dec 31, Year 1(1年目末の投資勘定残高)", type: "num", answer: 315000 },
  ],
  explain: `<p>差額 = 300,000 − 1,000,000 × 25% = 50,000、年間償却 5,000。</p>
<p>投資利益 = 120,000 × 25% − 5,000 = 25,000。受取配当 = 40,000 × 25% = 10,000(投資勘定の減額)。</p>
<p>期末残高 = 300,000 + 25,000 − 10,000 = 315,000。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-06",
  section: "FAR",
  chapter: "FAR-05",
  title: "基本的EPSと希薄化後EPS",
  scenario: `<p>Suzuki Inc. reported net income of <b>$560,000</b>. It has cumulative, nonconvertible preferred stock with annual dividends of <b>$60,000</b>. Common shares: <b>200,000</b> outstanding on January 1; <b>40,000</b> issued on July 1. Employee stock options to buy <b>30,000</b> shares at <b>$15</b> were outstanding all year; the average market price was <b>$25</b>.</p>
<p class="ja">Suzuki社の純利益は$560,000。年間配当$60,000の累積的・非転換優先株がある。普通株式は1月1日に200,000株、7月1日に40,000株を発行。行使価格$15で30,000株を購入できるオプションが期中ずっと存在し、平均株価は$25。EPSは小数第2位まで答えること。</p>`,
  rows: [
    { label: "Income available to common shareholders(普通株主に帰属する利益)", type: "num", answer: 500000 },
    { label: "Weighted-average common shares(加重平均株式数)", type: "num", answer: 220000 },
    { label: "Basic EPS(基本的EPS)", type: "num", answer: 2.27, tol: 0.01 },
    { label: "Incremental shares from options(オプションによる増加株式数)", type: "num", answer: 12000 },
    { label: "Diluted EPS(希薄化後EPS)", type: "num", answer: 2.16, tol: 0.01 },
  ],
  explain: `<p>普通株主に帰属する利益 = 560,000 − 60,000 = 500,000。加重平均 = 200,000 + 40,000 × 6/12 = 220,000。基本的EPS = 500,000 ÷ 220,000 = 2.27。</p>
<p>自己株式法:入金 30,000 × 15 = 450,000 ÷ 25 = 18,000株を買戻し → 増加 12,000株。希薄化後EPS = 500,000 ÷ 232,000 = 2.16。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-03",
  section: "AUD",
  chapter: "AUD-04",
  title: "サンプル数に与える影響",
  scenario: `<p>For each independent change, indicate its effect on the required sample size, holding all other factors constant.</p>
<p class="ja">他の条件を一定として、各変化(独立)が必要なサンプル数に与える影響を選択しなさい。</p>`,
  rows: [
    { label: "Decrease in tolerable misstatement(許容虚偽表示額の減少)", type: "select", options: ["Increase", "Decrease", "No effect"], answer: "Increase" },
    { label: "Increase in expected misstatement(予想虚偽表示額の増加)", type: "select", options: ["Increase", "Decrease", "No effect"], answer: "Increase" },
    { label: "Increase in the assessed risk of material misstatement(重要な虚偽表示リスクの評価の上昇)", type: "select", options: ["Increase", "Decrease", "No effect"], answer: "Increase" },
    { label: "Increase in the acceptable risk of incorrect acceptance(許容できる誤った受入れのリスクの増加)", type: "select", options: ["Increase", "Decrease", "No effect"], answer: "Decrease" },
    { label: "Increase in the tolerable rate of deviation (test of controls)(許容逸脱率の上昇)", type: "select", options: ["Increase", "Decrease", "No effect"], answer: "Decrease" },
    { label: "Population of controls grows from 50,000 to 100,000 items (test of controls)(統制テストの母集団が5万件から10万件に増加)", type: "select", options: ["Increase", "Decrease", "No effect"], answer: "No effect" },
  ],
  explain: `<p>許容額が小さい・予想額が大きい・リスクが高い → サンプル数増加。許容できるリスクや許容逸脱率が大きい → 減少。大きな母集団では母集団の大きさはサンプル数にほとんど影響しない。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-04",
  section: "AUD",
  chapter: "AUD-01",
  title: "独立性に対する脅威の識別",
  scenario: `<p>For each situation, select the type of threat to independence that it most directly creates under the AICPA conceptual framework.</p>
<p class="ja">AICPAの概念的枠組みのもとで、各状況が最も直接的に生じさせる独立性への脅威を選択しなさい。</p>`,
  rows: [
    { label: "The firm designed the client's accounting system and now audits its output(会計システムを設計し、その出力を監査)", type: "select", options: ["Self-review", "Self-interest", "Advocacy", "Familiarity", "Undue influence"], answer: "Self-review" },
    { label: "An engagement partner's spouse owns a material amount of the client's stock(業務執行社員の配偶者が重要な額の株式を保有)", type: "select", options: ["Self-review", "Self-interest", "Advocacy", "Familiarity", "Undue influence"], answer: "Self-interest" },
    { label: "The firm promotes the client's shares to prospective investors(見込み投資家にクライアントの株式を推奨)", type: "select", options: ["Self-review", "Self-interest", "Advocacy", "Familiarity", "Undue influence"], answer: "Advocacy" },
    { label: "The audit senior's brother is the client's CFO(監査シニアの兄弟がクライアントのCFO)", type: "select", options: ["Self-review", "Self-interest", "Advocacy", "Familiarity", "Undue influence"], answer: "Familiarity" },
    { label: "The client threatens to replace the firm unless it accepts an aggressive accounting policy(積極的な会計方針を認めなければ交代させると脅す)", type: "select", options: ["Self-review", "Self-interest", "Advocacy", "Familiarity", "Undue influence"], answer: "Undue influence" },
    { label: "Fees from the client make up a large share of the firm's total revenue(報酬が事務所の総収入の大部分を占める)", type: "select", options: ["Self-review", "Self-interest", "Advocacy", "Familiarity", "Undue influence"], answer: "Self-interest" },
  ],
  explain: `<p>自分の作業結果の監査 → 自己レビュー。財務的利害・報酬依存 → 自己利益。クライアントの立場の推奨 → 擁護。近親者・長期関係 → 馴れ合い。圧力・脅し → 不当な影響。</p>`,
});

CPA.tbs({
  id: "TBS-REG-04",
  section: "REG",
  chapter: "REG-04",
  title: "取得方法別の取得価額",
  scenario: `<p>Determine the requested amount for each independent situation.</p>
<p class="ja">各状況(独立)について求められている金額を答えなさい。</p>`,
  rows: [
    { label: "Purchased stock for $8,000 plus a $100 commission — basis(株式を$8,000で購入、手数料$100 — 取得価額)", type: "num", answer: 8100 },
    { label: "Inherited land: decedent's basis $40,000, FMV at death $90,000 — basis(相続した土地:被相続人の取得価額$40,000、死亡時の時価$90,000 — 取得価額)", type: "num", answer: 90000 },
    { label: "Gift of stock: donor's basis $20,000, FMV at gift $30,000, no gift tax — basis for gain(贈与株式:贈与者の取得価額$20,000、贈与時の時価$30,000、贈与税なし — 利益計算上の取得価額)", type: "num", answer: 20000 },
    { label: "Gift of stock: donor's basis $10,000, FMV at gift $7,000; donee sells for $5,000 — recognized loss(贈与株式:贈与者の取得価額$10,000、贈与時の時価$7,000、$5,000で売却 — 認識する損失)", type: "num", answer: 2000 },
    { label: "Exercised NQSOs for 1,000 shares at $10 when FMV was $25 — basis in shares(NQSOを行使価格$10、時価$25で1,000株行使 — 株式の取得価額)", type: "num", answer: 25000 },
  ],
  explain: `<p>購入:購入価額+手数料 = 8,100。相続:死亡時の時価 90,000。</p>
<p>贈与(時価 > 贈与者の取得価額):引継ぎ 20,000。贈与(時価 < 取得価額)で時価より低く売却:損失計算の基準は時価 7,000 → 損失 2,000。</p>
<p>NQSO:支払額 10,000 + 通常所得として課税された差額 15,000 = 25,000。</p>`,
});

CPA.tbs({
  id: "TBS-REG-05",
  section: "REG",
  chapter: "REG-02",
  title: "契約の有効性",
  scenario: `<p>Classify each contract as valid, void, voidable, or unenforceable.</p>
<p class="ja">各契約を、有効(valid)・無効(void)・取り消しうる(voidable)・強制不能(unenforceable)に分類しなさい。</p>`,
  rows: [
    { label: "An agreement to commit a crime(犯罪を行う合意)", type: "select", options: ["Valid", "Void", "Voidable", "Unenforceable"], answer: "Void" },
    { label: "A 16-year-old buys a gaming console (not a necessary)(16歳がゲーム機を購入。必需品ではない)", type: "select", options: ["Valid", "Void", "Voidable", "Unenforceable"], answer: "Voidable" },
    { label: "An oral agreement to sell land, with no part performance(一部履行のない口頭の土地売買合意)", type: "select", options: ["Valid", "Void", "Voidable", "Unenforceable"], answer: "Unenforceable" },
    { label: "A contract induced by the seller's fraudulent misrepresentation, from the buyer's standpoint(売主の詐欺的不実表示で締結した契約。買主の立場から)", type: "select", options: ["Valid", "Void", "Voidable", "Unenforceable"], answer: "Voidable" },
    { label: "A written contract signed by both merchants for $2,000 of goods(商人同士が署名した$2,000の物品売買の書面契約)", type: "select", options: ["Valid", "Void", "Voidable", "Unenforceable"], answer: "Valid" },
  ],
  explain: `<p>違法な目的 → 無効。未成年者・詐欺の被害者 → 取り消しうる。詐欺防止法の対象で書面がない → 強制不能。要件をすべて満たした書面契約 → 有効。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-02",
  section: "BAR",
  chapter: "BAR-01",
  title: "設備投資の評価",
  scenario: `<p>Hashimoto Co. is evaluating a machine that costs <b>$100,000</b>, has a <b>5-year</b> life with no salvage value, and generates annual after-tax cash inflows of <b>$30,000</b>. Straight-line depreciation is used. The cost of capital is <b>10%</b>; the present value of an ordinary annuity of $1 for 5 periods at 10% is <b>3.791</b>.</p>
<p class="ja">Hashimoto社は、取得原価$100,000、耐用年数5年・残存価額ゼロ、年間の税引後キャッシュインフロー$30,000の機械を検討している。減価償却は定額法。資本コスト10%、10%・5期の年金現価係数3.791。回収期間と収益性指数は小数第2位、会計的利益率は%の数値で答えること。</p>`,
  rows: [
    { label: "Net present value(正味現在価値)", type: "num", answer: 13730 },
    { label: "Payback period in years(回収期間・年)", type: "num", answer: 3.33, tol: 0.01 },
    { label: "Accounting rate of return on initial investment, %(当初投資に対する会計的利益率・%)", type: "num", answer: 10 },
    { label: "Profitability index(収益性指数)", type: "num", answer: 1.14, tol: 0.01 },
    { label: "Decision based on NPV(NPVに基づく判断)", type: "select", options: ["Accept", "Reject"], answer: "Accept" },
  ],
  explain: `<p>NPV = 30,000 × 3.791 − 100,000 = 13,730。回収期間 = 100,000 ÷ 30,000 = 3.33年。</p>
<p>会計上の利益 = 30,000 − 減価償却 20,000 = 10,000 → ARR = 10,000 ÷ 100,000 = 10%。</p>
<p>収益性指数 = 113,730 ÷ 100,000 = 1.14。NPV > 0 なので採用。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-03",
  section: "BAR",
  chapter: "BAR-02",
  title: "連結の基本計算",
  scenario: `<p>On January 1, Parent Co. acquired <b>80%</b> of Sub Co. for <b>$800,000</b>. The fair value of the noncontrolling interest was <b>$200,000</b>, and the fair value of Sub's identifiable net assets equaled their book value of <b>$900,000</b>. During the year, Sub reported net income of <b>$150,000</b>. Parent sold inventory costing <b>$60,000</b> to Sub for <b>$80,000</b>; <b>25%</b> remained in Sub's ending inventory.</p>
<p class="ja">1月1日、親会社は子会社の80%を$800,000で取得した。非支配持分の公正価値は$200,000、子会社の識別可能純資産の公正価値は簿価と同じ$900,000。当期の子会社の純利益は$150,000。親会社は原価$60,000の商品を子会社に$80,000で販売し、25%が子会社の期末在庫に残っている(ダウンストリーム取引)。</p>`,
  rows: [
    { label: "Goodwill(のれん)", type: "num", answer: 100000 },
    { label: "Intercompany sales eliminated(消去する内部売上高)", type: "num", answer: 80000 },
    { label: "Unrealized profit in ending inventory eliminated(消去する期末在庫の未実現利益)", type: "num", answer: 5000 },
    { label: "Net income attributable to noncontrolling interest(非支配持分に帰属する純利益)", type: "num", answer: 30000 },
  ],
  explain: `<p>のれん = 800,000 + 200,000 − 900,000 = 100,000。内部売上 80,000 を売上と売上原価から消去。未実現利益 = 20,000 × 25% = 5,000。</p>
<p>ダウンストリーム(親 → 子)の未実現利益は親会社が全額負担するため、非支配持分の純利益 = 150,000 × 20% = 30,000。</p>`,
});

CPA.tbs({
  id: "TBS-ISC-03",
  section: "ISC",
  chapter: "ISC-01",
  title: "事業継続・バックアップの用語",
  scenario: `<p>Match each description to the most appropriate term.</p>
<p class="ja">各説明に最も適切な用語を選択しなさい。</p>`,
  rows: [
    { label: "Maximum tolerable amount of data loss, measured in time(時間で表した許容できるデータ損失の最大量)", type: "select", options: ["RPO", "RTO", "Hot site", "Cold site", "Incremental backup", "Differential backup"], answer: "RPO" },
    { label: "Maximum tolerable downtime before the system must be restored(システム復旧までに許容できる最大停止時間)", type: "select", options: ["RPO", "RTO", "Hot site", "Cold site", "Incremental backup", "Differential backup"], answer: "RTO" },
    { label: "Fully equipped facility that can take over almost immediately(ほぼ即座に引き継げる設備完備の施設)", type: "select", options: ["RPO", "RTO", "Hot site", "Cold site", "Incremental backup", "Differential backup"], answer: "Hot site" },
    { label: "Facility with space, power, and cooling only(場所・電源・空調のみの施設)", type: "select", options: ["RPO", "RTO", "Hot site", "Cold site", "Incremental backup", "Differential backup"], answer: "Cold site" },
    { label: "Copies only data changed since the last backup of any type(種類を問わず直近のバックアップ以降の変更のみ)", type: "select", options: ["RPO", "RTO", "Hot site", "Cold site", "Incremental backup", "Differential backup"], answer: "Incremental backup" },
    { label: "Copies all data changed since the last full backup(直近のフルバックアップ以降の変更すべて)", type: "select", options: ["RPO", "RTO", "Hot site", "Cold site", "Incremental backup", "Differential backup"], answer: "Differential backup" },
  ],
  explain: `<p>RPO はデータ損失、RTO は停止時間。ホットサイトは即時、コールドサイトは場所のみ。増分は前回のバックアップ以降、差分は前回のフルバックアップ以降(復元時はフル+最新の差分だけで済む)。</p>`,
});

CPA.tbs({
  id: "TBS-TCP-02",
  section: "TCP",
  chapter: "TCP-02",
  title: "法人の分配とE&P",
  scenario: `<p>Watanabe Corp., a C corporation, has current E&P of <b>$30,000</b> and an accumulated E&P deficit of <b>$(50,000)</b> at the beginning of the year. On December 31, it distributes <b>$40,000</b> cash to its sole shareholder, whose stock basis is <b>$6,000</b>.</p>
<p class="ja">C法人であるWatanabe社の当期E&Pは$30,000、期首の累積E&Pは$(50,000)の欠損。12月31日に、株式の取得価額が$6,000の唯一の株主に現金$40,000を分配した。</p>`,
  rows: [
    { label: "Taxable dividend(課税される配当)", type: "num", answer: 30000 },
    { label: "Nontaxable return of capital(非課税の資本の払戻し)", type: "num", answer: 6000 },
    { label: "Capital gain recognized by the shareholder(株主が認識するキャピタルゲイン)", type: "num", answer: 4000 },
    { label: "Shareholder's stock basis after the distribution(分配後の株式の取得価額)", type: "num", answer: 0 },
  ],
  explain: `<p>当期E&Pがプラスなので、累積の欠損に関係なく当期E&P 30,000 までが配当。残り 10,000 のうち取得価額 6,000 までは資本の払戻し(basisを0まで減額)、超過 4,000 はキャピタルゲイン。</p>`,
});
