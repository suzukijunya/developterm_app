// TBS(Task-Based Simulation)。本試験の「表を埋める」形式を再現する。
// rows の各行は { label, type: "num" | "select", answer, options?, tol? }。
// num の答えは整数(ドル)で、tol(許容誤差)を指定できる。

CPA.tbs({
  id: "TBS-FAR-01",
  section: "FAR",
  chapter: "FAR-04",
  title: "社債の償却スケジュール(実効金利法)",
  scenario: `<p>On January 1, Year 1, Kato Corp. issued <b>$100,000</b> face value, <b>8%</b> bonds for <b>$95,000</b>. The bonds were priced to yield <b>9%</b>. Interest is paid annually on December 31. Kato uses the effective interest method.</p>
<p class="ja">1年目1月1日、Kato社は額面$100,000、表面利率8%の社債を$95,000で発行した(実効利回り9%)。利息は毎年12月31日払い、実効金利法を用いる。端数は四捨五入してドル単位で答えること。</p>`,
  rows: [
    { label: "Year 1 interest expense(1年目の支払利息)", type: "num", answer: 8550 },
    { label: "Year 1 cash interest paid(1年目の現金支払額)", type: "num", answer: 8000 },
    { label: "Year 1 discount amortization(1年目の割引償却額)", type: "num", answer: 550 },
    { label: "Carrying amount, Dec 31, Year 1(1年目末の帳簿価額)", type: "num", answer: 95550 },
    { label: "Year 2 interest expense(2年目の支払利息)", type: "num", answer: 8600, tol: 1 },
    { label: "Carrying amount, Dec 31, Year 2(2年目末の帳簿価額)", type: "num", answer: 96150, tol: 1 },
  ],
  explain: `<p>1年目:95,000 × 9% = 8,550。現金 100,000 × 8% = 8,000。償却 550。期末簿価 95,000 + 550 = 95,550。</p>
<p>2年目:95,550 × 9% = 8,599.5 ≒ 8,600。償却 600。期末簿価 95,550 + 600 = 96,150。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-02",
  section: "FAR",
  chapter: "FAR-07",
  title: "キャッシュフロー計算書の区分",
  scenario: `<p>Select the classification of each transaction in Hayashi Inc.'s statement of cash flows prepared under U.S. GAAP.</p>
<p class="ja">US GAAPに基づくHayashi社のキャッシュフロー計算書において、各取引の区分を選択しなさい。</p>`,
  rows: [
    { label: "Purchased equipment for cash(設備を現金で購入)", type: "select", options: ["Operating", "Investing", "Financing", "Noncash disclosure"], answer: "Investing" },
    { label: "Issued bonds payable for cash(社債を発行し現金を受領)", type: "select", options: ["Operating", "Investing", "Financing", "Noncash disclosure"], answer: "Financing" },
    { label: "Paid cash dividends to shareholders(株主への配当の支払)", type: "select", options: ["Operating", "Investing", "Financing", "Noncash disclosure"], answer: "Financing" },
    { label: "Paid interest on bonds(社債利息の支払)", type: "select", options: ["Operating", "Investing", "Financing", "Noncash disclosure"], answer: "Operating" },
    { label: "Acquired land by issuing common stock(普通株式を発行して土地を取得)", type: "select", options: ["Operating", "Investing", "Financing", "Noncash disclosure"], answer: "Noncash disclosure" },
    { label: "Collected principal on a loan made to another company(他社への貸付金の元本回収)", type: "select", options: ["Operating", "Investing", "Financing", "Noncash disclosure"], answer: "Investing" },
    { label: "Purchased treasury stock(自己株式の取得)", type: "select", options: ["Operating", "Investing", "Financing", "Noncash disclosure"], answer: "Financing" },
  ],
  explain: `<p>US GAAPでは、利息の支払・受取と配当の受取は営業活動、配当の支払は財務活動。貸付と回収は投資活動。株式発行による土地取得は現金の動きがないため非資金取引として別途開示する。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-03",
  section: "FAR",
  chapter: "FAR-07",
  title: "税効果会計の計算",
  scenario: `<p>Mori Corp. reported pretax financial income of <b>$500,000</b> for Year 1. Differences between book and tax:</p>
<ul><li>Tax depreciation exceeded book depreciation by <b>$60,000</b> (temporary).</li>
<li>Interest income on municipal bonds was <b>$20,000</b>.</li>
<li>Warranty expense accrued for books but not yet paid was <b>$40,000</b> (temporary; deductible when paid).</li></ul>
<p>The enacted tax rate for all years is <b>21%</b>. There were no beginning deferred tax balances.</p>
<p class="ja">Mori社の1年目の税引前当期純利益は$500,000。税務上の減価償却が会計上を$60,000上回る(一時差異)、地方債利息$20,000、未払の製品保証費用$40,000(支払時に損金算入される一時差異)。税率はすべての年度で21%、期首の繰延税金残高はない。</p>`,
  rows: [
    { label: "Taxable income(課税所得)", type: "num", answer: 460000 },
    { label: "Current income tax expense(当期税金費用)", type: "num", answer: 96600 },
    { label: "Deferred tax liability(繰延税金負債)", type: "num", answer: 12600 },
    { label: "Deferred tax asset(繰延税金資産)", type: "num", answer: 8400 },
    { label: "Total income tax expense(法人税等合計)", type: "num", answer: 100800 },
  ],
  explain: `<p>課税所得 = 500,000 − 60,000(減価償却)− 20,000(地方債利息・永久差異)+ 40,000(製品保証)= 460,000。当期税金 = 460,000 × 21% = 96,600。</p>
<p>DTL = 60,000 × 21% = 12,600、DTA = 40,000 × 21% = 8,400。繰延税金費用 = 12,600 − 8,400 = 4,200。</p>
<p>合計 = 96,600 + 4,200 = 100,800(検算:永久差異を除いた 480,000 × 21% = 100,800)。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-01",
  section: "AUD",
  chapter: "AUD-04",
  title: "監査手続とアサーション",
  scenario: `<p>For each audit procedure, select the assertion for which the procedure <b>primarily</b> provides evidence.</p>
<p class="ja">各監査手続が主に証拠を提供するアサーションを選択しなさい。</p>`,
  rows: [
    { label: "Send positive confirmations to customers for A/R balances(売掛金の積極的確認)", type: "select", options: ["Existence", "Completeness", "Valuation", "Rights and obligations", "Cutoff"], answer: "Existence" },
    { label: "Examine cash disbursements after year-end for unrecorded payables(期末後の支払から未記録負債を調査)", type: "select", options: ["Existence", "Completeness", "Valuation", "Rights and obligations", "Cutoff"], answer: "Completeness" },
    { label: "Review the aging of receivables and test the allowance(売掛金の年齢調べと貸倒引当金の検討)", type: "select", options: ["Existence", "Completeness", "Valuation", "Rights and obligations", "Cutoff"], answer: "Valuation" },
    { label: "Examine shipping documents for sales recorded near year-end(期末前後の売上と出荷書類の照合)", type: "select", options: ["Existence", "Completeness", "Valuation", "Rights and obligations", "Cutoff"], answer: "Cutoff" },
    { label: "Inspect title documents and lease agreements for property(不動産の権利証とリース契約の閲覧)", type: "select", options: ["Existence", "Completeness", "Valuation", "Rights and obligations", "Cutoff"], answer: "Rights and obligations" },
  ],
  explain: `<p>確認 → 実在性、未記録負債の調査 → 網羅性、年齢調べ → 評価、期末前後の出荷 → 期間帰属(cutoff)、権利証・契約 → 権利と義務。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-02",
  section: "AUD",
  chapter: "AUD-05",
  title: "監査意見の判断",
  scenario: `<p>For each independent situation in an audit of a nonissuer, select the most appropriate auditor's opinion. Assume each matter is material.</p>
<p class="ja">非公開会社の監査における各状況(独立)について、最も適切な監査意見を選択しなさい。いずれの事項も重要であるとする。</p>`,
  rows: [
    { label: "Client refuses to capitalize leases; effect is material but not pervasive(リースを資産計上しない。重要だが広範でない)", type: "select", options: ["Unmodified", "Qualified", "Adverse", "Disclaimer"], answer: "Qualified" },
    { label: "Financial statements omit consolidation of a major subsidiary; effect is pervasive(主要子会社を連結していない。広範)", type: "select", options: ["Unmodified", "Qualified", "Adverse", "Disclaimer"], answer: "Adverse" },
    { label: "Management refuses to provide a representation letter(経営者が確認書の提出を拒否)", type: "select", options: ["Unmodified", "Qualified", "Adverse", "Disclaimer"], answer: "Disclaimer" },
    { label: "Substantial doubt about going concern, adequately disclosed(継続企業の重要な疑義・適切に開示)", type: "select", options: ["Unmodified", "Qualified", "Adverse", "Disclaimer"], answer: "Unmodified" },
    { label: "Auditor could not observe inventory at one of several locations; no alternative procedures; not pervasive(複数拠点の1つで棚卸立会できず代替手続もない。広範でない)", type: "select", options: ["Unmodified", "Qualified", "Adverse", "Disclaimer"], answer: "Qualified" },
  ],
  explain: `<p>GAAP違反:重要 → 限定、広範 → 不適正。範囲の制約:重要 → 限定、広範 → 意見不表明。経営者確認書の拒否は通常、意見不表明(または辞任)。継続企業の疑義が適切に開示されていれば無限定意見+継続企業の区分。</p>`,
});

CPA.tbs({
  id: "TBS-REG-01",
  section: "REG",
  chapter: "REG-03",
  title: "総所得に含まれるか",
  scenario: `<p>For each item received by an individual taxpayer this year, indicate whether it is included in or excluded from gross income.</p>
<p class="ja">個人納税者が当年に受け取った各項目について、総所得に含まれるか除外されるかを選択しなさい。</p>`,
  rows: [
    { label: "Wages from employer(給与)", type: "select", options: ["Included", "Excluded"], answer: "Included" },
    { label: "Interest on municipal bonds(地方債の利息)", type: "select", options: ["Included", "Excluded"], answer: "Excluded" },
    { label: "Life insurance proceeds on the death of a parent(親の死亡による生命保険金)", type: "select", options: ["Included", "Excluded"], answer: "Excluded" },
    { label: "Gambling winnings(ギャンブルの賞金)", type: "select", options: ["Included", "Excluded"], answer: "Included" },
    { label: "Cash gift from a relative(親族からの現金贈与)", type: "select", options: ["Included", "Excluded"], answer: "Excluded" },
    { label: "State unemployment compensation(州の失業給付)", type: "select", options: ["Included", "Excluded"], answer: "Included" },
    { label: "Damages received for a physical injury(身体的傷害の損害賠償金)", type: "select", options: ["Included", "Excluded"], answer: "Excluded" },
  ],
  explain: `<p>給与・ギャンブル賞金・失業給付は総所得。地方債利息・死亡による生命保険金・贈与・身体的傷害の損害賠償は除外項目。</p>`,
});

CPA.tbs({
  id: "TBS-REG-02",
  section: "REG",
  chapter: "REG-04",
  title: "同種資産の交換",
  scenario: `<p>Tanaka exchanged an office building held for investment (adjusted basis <b>$400,000</b>, FMV <b>$550,000</b>) for an apartment building with an FMV of <b>$480,000</b> plus <b>$70,000</b> cash. The transaction qualifies as a like-kind exchange under §1031.</p>
<p class="ja">Tanakaは投資目的のオフィスビル(取得価額$400,000、時価$550,000)を、時価$480,000の集合住宅と現金$70,000と交換した。§1031の同種資産の交換に該当する。</p>`,
  rows: [
    { label: "Amount realized(譲渡収入)", type: "num", answer: 550000 },
    { label: "Realized gain(実現利益)", type: "num", answer: 150000 },
    { label: "Recognized gain(認識利益)", type: "num", answer: 70000 },
    { label: "Deferred gain(繰延利益)", type: "num", answer: 80000 },
    { label: "Basis of the apartment building(集合住宅の取得価額)", type: "num", answer: 400000 },
  ],
  explain: `<p>譲渡収入 = 480,000 + 70,000 = 550,000。実現利益 = 550,000 − 400,000 = 150,000。認識利益 = min(150,000, ボート70,000) = 70,000。繰延 = 80,000。</p>
<p>新資産の取得価額 = 480,000 − 80,000 = 400,000(= 旧basis 400,000 + 認識利益 70,000 − ボート 70,000)。</p>`,
});

CPA.tbs({
  id: "TBS-REG-03",
  section: "REG",
  chapter: "REG-05",
  title: "パートナーの持分の取得価額",
  scenario: `<p>On January 1, Sato contributed land (adjusted basis <b>$60,000</b>, FMV <b>$100,000</b>) subject to a mortgage of <b>$20,000</b> to a new partnership for a <b>40%</b> interest. The partnership assumed the mortgage. During the year, Sato's distributive share of ordinary income was <b>$15,000</b>, and Sato received a cash distribution of <b>$5,000</b>.</p>
<p class="ja">1月1日、Satoは土地(取得価額$60,000、時価$100,000、抵当債務$20,000)を新設パートナーシップに拠出し、40%の持分を取得した。パートナーシップは抵当債務を引き受けた。当年、Satoへの通常所得の配分は$15,000、現金分配は$5,000だった。</p>`,
  rows: [
    { label: "Gain recognized by Sato on contribution(拠出時にSatoが認識する利益)", type: "num", answer: 0 },
    { label: "Sato's initial basis in partnership interest(拠出直後の持分の取得価額)", type: "num", answer: 48000 },
    { label: "Partnership's basis in the land(パートナーシップの土地の取得価額)", type: "num", answer: 60000 },
    { label: "Sato's basis at year-end(期末の持分の取得価額)", type: "num", answer: 58000 },
  ],
  explain: `<p>他のパートナーに移った負債 = 20,000 × 60% = 12,000 は basis 60,000 を超えないので利益は認識しない。</p>
<p>当初 basis = 60,000 − 20,000 + 20,000 × 40% = 48,000。パートナーシップの土地の取得価額は引継ぎで 60,000。</p>
<p>期末 = 48,000 + 15,000 − 5,000 = 58,000。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-01",
  section: "BAR",
  chapter: "BAR-01",
  title: "CVP分析と差異分析",
  scenario: `<p>Ishii Co. sells a single product for <b>$80</b> per unit. Variable costs are <b>$48</b> per unit, and annual fixed costs are <b>$256,000</b>. Expected sales are <b>12,000</b> units.</p>
<p>The standard material cost is 3 lbs at $5.00 per lb. Last month, Ishii purchased and used <b>9,500</b> lbs at <b>$5.20</b> per lb to produce <b>3,000</b> units.</p>
<p class="ja">Ishii社の製品価格は1個$80、変動費は1個$48、年間固定費は$256,000、予想販売量は12,000個。材料の標準は1個あたり3ポンド×$5.00。先月、9,500ポンドを1ポンド$5.20で購入・使用し、3,000個を生産した。差異は金額のみ(正の数)で答えること。</p>`,
  rows: [
    { label: "Contribution margin per unit(単位貢献利益)", type: "num", answer: 32 },
    { label: "Break-even point in units(損益分岐点販売量)", type: "num", answer: 8000 },
    { label: "Margin of safety in units(安全余裕・個数)", type: "num", answer: 4000 },
    { label: "Material price variance (amount)(材料価格差異)", type: "num", answer: 1900 },
    { label: "Material price variance: F or U", type: "select", options: ["Favorable", "Unfavorable"], answer: "Unfavorable" },
    { label: "Material quantity variance (amount)(材料数量差異)", type: "num", answer: 2500 },
    { label: "Material quantity variance: F or U", type: "select", options: ["Favorable", "Unfavorable"], answer: "Unfavorable" },
  ],
  explain: `<p>CM = 80 − 48 = 32。損益分岐点 = 256,000 ÷ 32 = 8,000個。安全余裕 = 12,000 − 8,000 = 4,000個。</p>
<p>価格差異 = (5.20 − 5.00)× 9,500 = 1,900 U。数量差異 = (9,500 − 3,000 × 3)× 5.00 = 500 × 5 = 2,500 U。</p>`,
});

CPA.tbs({
  id: "TBS-ISC-01",
  section: "ISC",
  chapter: "ISC-02",
  title: "統制の種類の分類",
  scenario: `<p>Classify each IT control as preventive, detective, or corrective.</p>
<p class="ja">各IT統制を、予防的・発見的・是正的に分類しなさい。</p>`,
  rows: [
    { label: "Firewall blocks unauthorized inbound traffic(ファイアウォール)", type: "select", options: ["Preventive", "Detective", "Corrective"], answer: "Preventive" },
    { label: "Intrusion detection system alerts security staff(侵入検知システム)", type: "select", options: ["Preventive", "Detective", "Corrective"], answer: "Detective" },
    { label: "Restoring data from backup after ransomware(ランサムウェア後のバックアップ復元)", type: "select", options: ["Preventive", "Detective", "Corrective"], answer: "Corrective" },
    { label: "Monthly review of user access rights(アクセス権の月次レビュー)", type: "select", options: ["Preventive", "Detective", "Corrective"], answer: "Detective" },
    { label: "Role-based access restricting developers from production(開発者の本番アクセス制限)", type: "select", options: ["Preventive", "Detective", "Corrective"], answer: "Preventive" },
    { label: "Applying a security patch to fix an exploited vulnerability(悪用された脆弱性へのパッチ適用)", type: "select", options: ["Preventive", "Detective", "Corrective"], answer: "Corrective" },
  ],
  explain: `<p>予防的:問題の発生を防ぐ(ファイアウォール、アクセス制限)。発見的:発生した問題を見つける(IDS、アクセス権レビュー)。是正的:発生後に回復・修正する(バックアップ復元、悪用後のパッチ)。</p>`,
});

CPA.tbs({
  id: "TBS-ISC-02",
  section: "ISC",
  chapter: "ISC-03",
  title: "SOCレポートの選択",
  scenario: `<p>For each user need, select the most appropriate report.</p>
<p class="ja">各ニーズに最も適したレポートを選択しなさい。</p>`,
  rows: [
    { label: "User auditor wants to rely on payroll processor's controls over the full year(利用企業の監査人が給与計算受託会社の統制に年間を通じて依拠したい)", type: "select", options: ["SOC 1 Type 1", "SOC 1 Type 2", "SOC 2 Type 2", "SOC 3"], answer: "SOC 1 Type 2" },
    { label: "A cloud provider wants a report it can post on its public website(クラウド事業者が公開Webサイトに掲載したい)", type: "select", options: ["SOC 1 Type 1", "SOC 1 Type 2", "SOC 2 Type 2", "SOC 3"], answer: "SOC 3" },
    { label: "A customer's vendor-risk team wants detailed testing of a SaaS provider's security and availability controls over a period(顧客がSaaS事業者のセキュリティ・可用性の統制について期間の詳細なテスト結果を求める)", type: "select", options: ["SOC 1 Type 1", "SOC 1 Type 2", "SOC 2 Type 2", "SOC 3"], answer: "SOC 2 Type 2" },
    { label: "A new service organization needs a report on the design of ICFR-relevant controls as of a date(新しい受託会社がICFR関連統制のデザインについて特定時点の報告書を必要とする)", type: "select", options: ["SOC 1 Type 1", "SOC 1 Type 2", "SOC 2 Type 2", "SOC 3"], answer: "SOC 1 Type 1" },
  ],
  explain: `<p>ICFR関連 → SOC 1、それ以外の運用(セキュリティ等)→ SOC 2/3。期間の運用状況 → Type 2、特定時点のデザイン → Type 1。一般公開 → SOC 3。</p>`,
});

CPA.tbs({
  id: "TBS-TCP-01",
  section: "TCP",
  chapter: "TCP-02",
  title: "パートナーシップの非清算分配",
  scenario: `<p>Ono's outside basis in the ABC Partnership is <b>$50,000</b> immediately before a nonliquidating distribution. Ono receives <b>$15,000</b> cash and inventory with a partnership basis of <b>$10,000</b> (FMV $14,000) and equipment with a partnership basis of <b>$30,000</b> (FMV $45,000).</p>
<p class="ja">Onoの非清算分配直前の outside basis は$50,000。現金$15,000、棚卸資産(パートナーシップの取得価額$10,000、時価$14,000)、設備(同$30,000、時価$45,000)を受け取った。</p>`,
  rows: [
    { label: "Gain recognized by Ono(Onoが認識する利益)", type: "num", answer: 0 },
    { label: "Ono's basis in the inventory(棚卸資産の取得価額)", type: "num", answer: 10000 },
    { label: "Ono's basis in the equipment(設備の取得価額)", type: "num", answer: 25000 },
    { label: "Ono's remaining outside basis(残りの outside basis)", type: "num", answer: 0 },
  ],
  explain: `<p>現金 15,000 < basis 50,000 なので利益なし。残り 35,000 をまず棚卸資産(未実現売掛金・棚卸資産)にパートナーシップの取得価額 10,000 で配分 → 残り 25,000。</p>
<p>設備のパートナーシップの取得価額 30,000 > 残り 25,000 なので、設備の取得価額は 25,000。outside basis は 0 になる。</p>`,
});
