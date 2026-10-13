// FAR のTBS追加(投資・信用損失・持分法・株主資本・EPS・株式報酬・外貨建取引)

CPA.tbs({
  id: "TBS-FAR-67", section: "FAR", chapter: "FAR-05", title: "負債証券ポートフォリオの期末仕訳とAFS売却時の組替",
  scenario: `<p>Kanda Co. holds the debt securities below. None of the declines in fair value is credit-related, and Kanda neither intends to sell nor is more likely than not required to sell any security in an unrealized loss position. Expected credit losses on the HTM bond are immaterial (allowance = $0). Ignore income taxes.</p>
<table><tr><th>Security</th><th>Classification</th><th>Amortized cost 12/31 Y0</th><th>Fair value 12/31 Y0</th><th>Amortized cost 12/31 Y1</th><th>Fair value 12/31 Y1</th></tr>
<tr><td>Bond A (bought 3/1 Y1 at par)</td><td>Trading</td><td>—</td><td>—</td><td>$50,000</td><td>$47,500</td></tr>
<tr><td>Bond B</td><td>Available-for-sale</td><td>$97,000</td><td>$98,000</td><td>$97,600</td><td>$96,500</td></tr>
<tr><td>Bond C (bought at par)</td><td>Held-to-maturity</td><td>$150,000</td><td>$151,000</td><td>$150,000</td><td>$146,000</td></tr>
<tr><td>Bond D (bought at par)</td><td>Available-for-sale</td><td>$40,000</td><td>$41,800</td><td colspan="2">Sold 9/30 Y1 for $42,500</td></tr></table>
<p><b>Controller's memo:</b> "AOCI at 1/1 Y1 contains only the unrealized amounts on Bonds B and D. Please prepare the Year 1 year-end adjustments and the OCI note, including the reclassification of Bond D."</p>
<p class="ja">Kanda社は上表の負債証券を保有している。公正価値の下落はいずれも信用要因ではなく、含み損のある証券を売却する意図も、売却を要求される可能性が高い状況もない。HTM社債の予想信用損失は重要性がない(引当金$0)。法人税は無視する。<br>経理部長メモ:「1/1 Y1のAOCIには社債BとDの未実現損益のみが含まれる。第1年度末の修正仕訳と、社債Dの組替を含むOCI注記を作成してほしい。」</p>`,
  rows: [
    { label: "Unrealized holding loss on Bond A recognized in Year 1 net income(社債Aについて第1年度の純利益に計上する未実現保有損失)", type: "num", answer: 2500 },
    { label: "Year 1 other comprehensive loss on Bond B(社債Bの第1年度のその他の包括損失)", type: "num", answer: 2100 },
    { label: "Debit balance of AOCI related to Bond B at 12/31 Y1(12/31 Y1の社債Bに係るAOCI借方残高)", type: "num", answer: 1100 },
    { label: "Gain on sale of Bond D reported in Year 1 net income(社債D売却により第1年度の純利益に計上する売却益)", type: "num", answer: 2500 },
    { label: "Net decrease in AOCI attributable to Bond D during Year 1(第1年度の社債Dに係るAOCIの純減少額)", type: "num", answer: 1800 },
    { label: "Total Year 1 other comprehensive loss from debt securities(第1年度の負債証券に係るその他の包括損失合計)", type: "num", answer: 3900 },
    { label: "Amount at which Bond C is reported on the 12/31 Y1 balance sheet(12/31 Y1の貸借対照表における社債Cの計上額)", type: "select", options: ["$146,000 fair value", "$150,000 amortized cost (net of a $0 allowance)", "$146,000 lower of cost or fair value", "$151,000 prior-year fair value"], answer: "$150,000 amortized cost (net of a $0 allowance)" },
  ],
  explain: `<p>社債A(売買目的):公正価値の変動は純利益に計上する。50,000 − 47,500 = 2,500 の未実現保有損失。</p>
<p>社債B(AFS):期首の未実現損益 = 98,000 − 97,000 = 1,000(利益・AOCI貸方)。期末の未実現損益 = 96,500 − 97,600 = △1,100(損失)。必要なAOCIの変動 = △1,100 − 1,000 = △2,100 をOCIの損失として計上する。期末のAOCI残高は借方1,100。償却原価の増加600は受取利息として純利益に入るため、公正価値の変動と混同しない。</p>
<p>社債D(AFS売却):売却益 = 42,500 − 償却原価40,000 = 2,500 を純利益に計上する。期中の保有利益700(41,800→42,500)をOCIに計上した後、実現した2,500を組替調整としてOCIから控除するため、社債Dに係るAOCIの純変動 = 700 − 2,500 = △1,800 となり、期首AOCI貸方1,800がゼロになる。</p>
<p>OCI合計 = 社債B △2,100 + 社債D △1,800 = △3,900(その他の包括損失3,900)。</p>
<p>社債C(HTM):償却原価から信用損失引当金を控除した額で計上し、公正価値の変動は認識しない(公正価値は注記のみ)。よって $150,000。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-68", section: "FAR", chapter: "FAR-05", title: "CECL引当金のロールフォワード(年齢調べ・損失率法)",
  scenario: `<p>Hayama Corp. applies the current expected credit loss (CECL) model to its trade receivables and its commercial loan portfolio.</p>
<p><b>Exhibit 1 – Aging of trade receivables at 12/31 Y1</b></p>
<table><tr><th>Age</th><th>Balance</th><th>Expected loss rate</th></tr>
<tr><td>Current</td><td>$400,000</td><td>1%</td></tr>
<tr><td>1–30 days past due</td><td>$150,000</td><td>3%</td></tr>
<tr><td>31–60 days past due</td><td>$80,000</td><td>8%</td></tr>
<tr><td>61–90 days past due</td><td>$40,000</td><td>20%</td></tr>
<tr><td>Over 90 days past due</td><td>$30,000</td><td>45%</td></tr></table>
<p>Because the rates above are based on historical experience, management adds a qualitative (forecast) adjustment of <b>$3,600</b> for an expected economic slowdown.</p>
<p><b>Exhibit 2 – Trade receivables allowance activity, Year 1</b></p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Allowance balance, 1/1 Y1 (credit)</td><td>$32,000</td></tr>
<tr><td>Accounts written off</td><td>$29,500</td></tr>
<tr><td>Recoveries of accounts previously written off</td><td>$2,700</td></tr></table>
<p><b>Exhibit 3 – Loan pool (loss-rate method):</b> amortized cost at 12/31 Y1 is <b>$1,200,000</b>; historical lifetime loss rate is <b>1.5%</b>, adjusted upward by <b>0.25 percentage points</b> for reasonable and supportable forecasts. The loan allowance was <b>$18,000</b> at 1/1 Y1 and there were no write-offs or recoveries.</p>
<p class="ja">Hayama社は売掛金と商業貸付金ポートフォリオに現在予想信用損失(CECL)モデルを適用している。表1は12/31 Y1の売掛金の年齢調べ表である。上記の率は過去実績に基づくため、経営者は景気後退予測について$3,600の定性的(将来予測)調整を加える。表2は第1年度の売掛金引当金の動き(期首残高$32,000、貸倒償却$29,500、過去に償却した債権の回収$2,700)である。表3:貸付金プール(損失率法)の12/31 Y1償却原価は$1,200,000、過去の生涯損失率1.5%に合理的かつ裏付け可能な予測として0.25ポイントを加算する。期首の貸付金引当金は$18,000で、償却・回収はない。</p>`,
  rows: [
    { label: "Required allowance for trade receivables at 12/31 Y1(12/31 Y1に必要な売掛金の引当金残高)", type: "num", answer: 40000 },
    { label: "Trade receivables allowance balance before the year-end adjustment(期末修正前の売掛金引当金残高)", type: "num", answer: 5200 },
    { label: "Year 1 credit loss expense on trade receivables(第1年度の売掛金に係る信用損失費用)", type: "num", answer: 34800 },
    { label: "Net trade receivables reported at 12/31 Y1(12/31 Y1に計上する売掛金の純額)", type: "num", answer: 660000 },
    { label: "Required allowance for the loan pool at 12/31 Y1(12/31 Y1の貸付金プールの必要引当金)", type: "num", answer: 21000 },
    { label: "Total Year 1 credit loss expense (receivables and loans)(第1年度の信用損失費用合計)", type: "num", answer: 37800 },
    { label: "Entries to record a recovery of an account previously written off(過去に償却した債権の回収時の仕訳)", type: "select", options: ["Dr Cash / Cr Credit loss expense only", "Dr Accounts receivable / Cr Allowance; then Dr Cash / Cr Accounts receivable", "Dr Allowance / Cr Accounts receivable; then Dr Cash / Cr Allowance", "Dr Cash / Cr Retained earnings"], answer: "Dr Accounts receivable / Cr Allowance; then Dr Cash / Cr Accounts receivable" },
    { label: "Codification subtopic that governs these allowances(これらの引当金を規定する基準のサブトピック)", type: "select", options: ["ASC 310-10", "ASC 326-20", "ASC 326-30", "ASC 450-20"], answer: "ASC 326-20" },
  ],
  explain: `<p>年齢調べによる見積り:400,000×1% = 4,000、150,000×3% = 4,500、80,000×8% = 6,400、40,000×20% = 8,000、30,000×45% = 13,500、合計36,400。定性的調整3,600を加え、必要引当金 = 40,000。</p>
<p>修正前残高 = 期首32,000 − 償却29,500 + 回収2,700 = 5,200(貸方)。信用損失費用 = 40,000 − 5,200 = 34,800。</p>
<p>売掛金純額 = (400,000+150,000+80,000+40,000+30,000) 700,000 − 40,000 = 660,000。</p>
<p>貸付金:損失率 = 1.5% + 0.25% = 1.75%。必要引当金 = 1,200,000 × 1.75% = 21,000。費用 = 21,000 − 18,000 = 3,000。信用損失費用合計 = 34,800 + 3,000 = 37,800。</p>
<p>回収時は、まず償却仕訳を戻して債権と引当金を復活させ(Dr 売掛金/Cr 引当金)、次に現金回収を記録する(Dr 現金/Cr 売掛金)。償却原価で測定する金融資産の信用損失はASC 326-20が規定する(326-30はAFS負債証券)。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-69", section: "FAR", chapter: "FAR-05", title: "AFS負債証券の信用損失と非信用要因の区分",
  scenario: `<p>Oda Corp. reviews its available-for-sale (AFS) debt securities for impairment at December 31, Year 2. All bonds were purchased at par, so amortized cost equals face value. The present value of expected cash flows is discounted at each bond's original effective interest rate.</p>
<table><tr><th>Bond</th><th>Amortized cost</th><th>Fair value 12/31 Y1</th><th>Fair value 12/31 Y2</th><th>PV of expected cash flows 12/31 Y2</th><th>Intent / requirement to sell</th></tr>
<tr><td>X</td><td>$500,000</td><td>$492,000</td><td>$440,000</td><td>$470,000</td><td>No intent; not more likely than not required to sell</td></tr>
<tr><td>Y</td><td>$200,000</td><td>$200,000</td><td>$185,000</td><td>$178,000</td><td>No intent; not more likely than not required to sell</td></tr>
<tr><td>Z</td><td>$120,000</td><td>$120,000</td><td>$112,000</td><td>$119,000</td><td>Oda intends to sell Z in January, Year 3</td></tr></table>
<p>At December 31, Year 3, the present value of expected cash flows on Bond X improves to <b>$485,000</b>; its fair value is then $478,000.</p>
<p class="ja">Oda社は第2年度12月31日に売却可能(AFS)負債証券の減損を検討する。すべて額面で購入しており、償却原価は額面と等しい。予想キャッシュフローの現在価値は各社債の当初実効金利で割り引いている。社債Zについては第3年度1月に売却する意図がある。第3年度12月31日に社債Xの予想キャッシュフロー現在価値は$485,000に改善し、公正価値は$478,000となる。</p>`,
  rows: [
    { label: "Credit loss recognized in Year 2 net income for Bond X(社債Xについて第2年度の純利益に計上する信用損失)", type: "num", answer: 30000 },
    { label: "Year 2 other comprehensive loss for Bond X(社債Xの第2年度のその他の包括損失)", type: "num", answer: 22000 },
    { label: "Credit loss recognized in Year 2 net income for Bond Y(社債Yについて第2年度の純利益に計上する信用損失)", type: "num", answer: 15000 },
    { label: "Loss recognized in Year 2 net income for Bond Z(社債Zについて第2年度の純利益に計上する損失)", type: "num", answer: 8000 },
    { label: "Total Year 2 impairment-related losses in net income (X, Y, Z)(第2年度の純利益に計上する減損関連損失合計)", type: "num", answer: 53000 },
    { label: "Reversal of credit loss recognized in Year 3 net income for Bond X(第3年度に社債Xについて純利益に計上する信用損失の戻入額)", type: "num", answer: 15000 },
    { label: "Accounting for Bond Z at 12/31 Y2(12/31 Y2における社債Zの会計処理)", type: "select", options: ["Record an allowance for the credit portion only", "Write down the amortized cost basis to fair value through earnings; no allowance", "Record the entire decline in OCI", "No entry because the decline is not credit-related"], answer: "Write down the amortized cost basis to fair value through earnings; no allowance" },
  ],
  explain: `<p>社債X:信用損失 = 償却原価500,000 − 予想CF現在価値470,000 = 30,000。上限は公正価値の下落額(500,000 − 440,000 = 60,000)なので30,000を引当金(純利益)に計上する。非信用要因 = 60,000 − 30,000 = 30,000 はAOCIに計上される。期首AOCIには既に未実現損失8,000(500,000 − 492,000)があるため、第2年度のOCI損失 = 30,000 − 8,000 = 22,000。</p>
<p>社債Y:償却原価200,000 − 現在価値178,000 = 22,000 だが、公正価値による下限(200,000 − 185,000 = 15,000)を超えられないため15,000。非信用要因は0。</p>
<p>社債Z:売却意図がある場合は引当金方式を使わず、償却原価を公正価値まで直接切り下げ、全額 120,000 − 112,000 = 8,000 を純利益に計上する。</p>
<p>合計 = 30,000 + 15,000 + 8,000 = 53,000。</p>
<p>第3年度:必要引当金 = 500,000 − 485,000 = 15,000(公正価値下落額22,000以内)。引当金30,000を15,000に減らし、15,000を信用損失費用の戻入として純利益に計上する(AFSでは引当金方式のため戻入が可能)。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-70", section: "FAR", chapter: "FAR-05", title: "持分法:超過額の償却と内部取引未実現利益(ダウンストリーム)",
  scenario: `<p>On January 1, Year 1, Aoki Inc. paid <b>$1,200,000</b> for <b>30%</b> of the voting stock of Beta Co. and obtained significant influence. Aoki uses the equity method.</p>
<p><b>Exhibit 1 – Beta's net assets at 1/1 Y1:</b> book value <b>$3,000,000</b>. Fair value exceeded book value for equipment by <b>$400,000</b> (remaining life <b>8 years</b>, straight-line) and for land by <b>$200,000</b>. All other assets and liabilities had fair values equal to book values.</p>
<p><b>Exhibit 2 – Beta's results</b></p>
<table><tr><th>Year</th><th>Net income</th><th>Dividends paid</th></tr>
<tr><td>Year 1</td><td>$500,000</td><td>$200,000</td></tr>
<tr><td>Year 2</td><td>$600,000</td><td>$250,000</td></tr></table>
<p><b>Exhibit 3 – Intra-entity sale:</b> In Year 1 Aoki sold inventory costing <b>$100,000</b> to Beta for <b>$160,000</b>. At 12/31 Y1, <b>25%</b> of this inventory remained in Beta's warehouse; it was sold to outside customers in Year 2. There were no other intra-entity transactions.</p>
<p class="ja">第1年度1月1日、Aoki社はBeta社の議決権株式の30%を$1,200,000で取得し、重要な影響力を得た。持分法を適用する。表1:取得日のBeta社純資産の簿価は$3,000,000。設備の公正価値は簿価を$400,000上回り(残存耐用年数8年・定額法)、土地は$200,000上回る。その他の資産負債は公正価値と簿価が等しい。表2:Beta社の純利益と配当。表3:第1年度にAoki社は原価$100,000の棚卸資産をBeta社へ$160,000で販売し、期末に25%がBeta社に残っていた(第2年度に外部へ販売)。他の内部取引はない。</p>`,
  rows: [
    { label: "Goodwill implicit in the investment(投資に含まれるのれん)", type: "num", answer: 120000 },
    { label: "Annual amortization of the excess cost related to equipment(設備に係る超過額の年間償却額)", type: "num", answer: 15000 },
    { label: "Aoki's share of unrealized intra-entity profit deferred at 12/31 Y1(12/31 Y1に繰り延べる内部取引未実現利益のAoki社持分)", type: "num", answer: 4500 },
    { label: "Equity in earnings of Beta for Year 1(第1年度の持分法投資利益)", type: "num", answer: 130500 },
    { label: "Investment in Beta balance at 12/31 Y1(12/31 Y1の投資勘定残高)", type: "num", answer: 1270500 },
    { label: "Equity in earnings of Beta for Year 2(第2年度の持分法投資利益)", type: "num", answer: 169500 },
    { label: "Treatment of dividends received from Beta(Beta社からの受取配当の処理)", type: "select", options: ["Dividend income in net income", "Reduction of the investment account", "Credit to other comprehensive income", "Increase in the investment account"], answer: "Reduction of the investment account" },
    { label: "Subsequent treatment of the equity method goodwill(持分法のれんの事後処理)", type: "select", options: ["Amortized over 10 years", "Tested annually for impairment as a separate asset", "Not amortized or separately tested; the investment as a whole is evaluated for other-than-temporary impairment", "Written off immediately to retained earnings"], answer: "Not amortized or separately tested; the investment as a whole is evaluated for other-than-temporary impairment" },
  ],
  explain: `<p>簿価持分 = 3,000,000 × 30% = 900,000。超過額 = 1,200,000 − 900,000 = 300,000。設備 400,000 × 30% = 120,000、土地 200,000 × 30% = 60,000。のれん = 300,000 − 120,000 − 60,000 = 120,000。</p>
<p>設備の超過額償却 = 120,000 ÷ 8 = 15,000/年(土地とのれんは償却しない)。</p>
<p>未実現利益:販売益 160,000 − 100,000 = 60,000、期末残存25% → 15,000。持分法ではダウンストリームでも投資比率分を消去する:15,000 × 30% = 4,500。</p>
<p>第1年度の持分法利益 = 500,000 × 30% − 15,000 − 4,500 = 150,000 − 19,500 = 130,500。</p>
<p>期末投資残高 = 1,200,000 + 130,500 − 配当(200,000 × 30%)60,000 = 1,270,500。</p>
<p>第2年度 = 600,000 × 30% − 15,000 + 4,500(前期繰延利益の実現)= 169,500。</p>
<p>受取配当は投資の払戻しとして投資勘定を減額する。持分法のれんは償却せず、単独での減損テストも行わず、投資全体として一時的でない価値下落を検討する。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-71", section: "FAR", chapter: "FAR-05", title: "公正価値評価から持分法への変更(段階取得)",
  scenario: `<p>Kato Corp. acquired <b>10%</b> of the common stock of Delta Inc. on January 1, Year 1, for <b>$400,000</b>. Lacking significant influence, Kato measured the investment at fair value through net income. Delta paid total dividends of <b>$200,000</b> in Year 1. Fair value of Kato's 10% interest at 12/31 Y1 was <b>$430,000</b>.</p>
<p>On January 1, Year 2, Kato purchased an additional <b>15%</b> of Delta for <b>$690,000</b> cash and obtained significant influence. Kato remeasures its previously held interest to fair value immediately before applying the equity method, using the per-share price paid in this transaction. Delta's book value of net assets at 1/1 Y2 was <b>$4,200,000</b>; the entire excess of Kato's total investment over its share of book value is attributable to a patent with a <b>10-year</b> remaining life.</p>
<p>Delta reported Year 2 net income of <b>$800,000</b> and paid dividends of <b>$240,000</b> in December, Year 2.</p>
<p class="ja">Kato社は第1年度1月1日にDelta社の普通株式の10%を$400,000で取得した。重要な影響力がないため公正価値(変動は純利益)で測定した。Delta社は第1年度に総額$200,000の配当を支払い、12/31 Y1のKato社持分10%の公正価値は$430,000であった。第2年度1月1日、Kato社は追加で15%を$690,000で取得し重要な影響力を得た。持分法適用直前に、この取引の1株当たり価格を用いて既存持分を公正価値で再測定する。1/1 Y2のDelta社純資産簿価は$4,200,000で、投資総額と簿価持分の差額はすべて残存10年の特許権に帰属する。第2年度のDelta社純利益は$800,000、12月の配当は$240,000である。</p>`,
  rows: [
    { label: "Dividend income recognized by Kato in Year 1(第1年度にKato社が計上する受取配当金)", type: "num", answer: 20000 },
    { label: "Unrealized holding gain in Kato's Year 1 net income(第1年度の純利益に計上する未実現保有利益)", type: "num", answer: 30000 },
    { label: "Gain on remeasurement of the 10% interest at 1/1 Y2(1/1 Y2の既存10%持分の再測定益)", type: "num", answer: 30000 },
    { label: "Equity method investment basis at 1/1 Y2(1/1 Y2の持分法投資の取得原価)", type: "num", answer: 1150000 },
    { label: "Equity in earnings of Delta for Year 2(第2年度の持分法投資利益)", type: "num", answer: 190000 },
    { label: "Investment in Delta balance at 12/31 Y2(12/31 Y2の投資勘定残高)", type: "num", answer: 1280000 },
    { label: "Effect of adopting the equity method on prior periods(持分法採用が過年度に与える影響)", type: "select", options: ["Retrospectively restate Year 1 as if the equity method had always applied", "Apply prospectively from the date significant influence is obtained; no retroactive adjustment", "Record a cumulative-effect adjustment to opening retained earnings", "Restate only the Year 1 dividend income"], answer: "Apply prospectively from the date significant influence is obtained; no retroactive adjustment" },
  ],
  explain: `<p>第1年度:受取配当 = 200,000 × 10% = 20,000。未実現保有利益 = 430,000 − 400,000 = 30,000(公正価値の変動は純利益)。</p>
<p>1/1 Y2:1%当たり価格 = 690,000 ÷ 15 = 46,000。既存10%の公正価値 = 460,000。再測定益 = 460,000 − 430,000 = 30,000。</p>
<p>持分法の基礎 = 460,000 + 690,000 = 1,150,000(ASU 2016-07により、追加取得の原価を既存持分の帳簿価額に加算し、遡及修正しない)。</p>
<p>簿価持分 = 4,200,000 × 25% = 1,050,000。超過額 = 100,000 → 特許権償却 10,000/年。持分法利益 = 800,000 × 25% − 10,000 = 190,000。</p>
<p>期末残高 = 1,150,000 + 190,000 − 配当 240,000 × 25%(60,000)= 1,280,000。</p>
<p>持分法は重要な影響力を得た日から将来に向かって適用し、過年度の修正は行わない。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-72", section: "FAR", chapter: "FAR-05", title: "株主資本ロールフォワード(自己株式の原価法・消却・株式分割)",
  scenario: `<p>Nagano Corp.'s stockholders' equity at January 1, Year 1: common stock, $1 par, 500,000 shares issued and outstanding, <b>$500,000</b>; additional paid-in capital (APIC) – common stock, <b>$4,500,000</b> (all original shares were issued at $10); retained earnings, <b>$6,000,000</b>. Nagano has no APIC from treasury stock at January 1 and uses the <b>cost method</b> for treasury stock.</p>
<table><tr><th>Date</th><th>Year 1 transaction</th></tr>
<tr><td>Feb 1</td><td>Issued 50,000 new shares for $14 per share.</td></tr>
<tr><td>Mar 15</td><td>Reacquired 30,000 shares at $16 per share.</td></tr>
<tr><td>Jun 1</td><td>Reissued 10,000 treasury shares at $19 per share.</td></tr>
<tr><td>Aug 1</td><td>Reissued 8,000 treasury shares at $12 per share.</td></tr>
<tr><td>Oct 1</td><td>Formally retired the remaining treasury shares (originally issued at $10).</td></tr>
<tr><td>Nov 1</td><td>Declared and distributed a 10% stock dividend; market price $20 per share.</td></tr>
<tr><td>Dec 15</td><td>Effected a 2-for-1 stock split by reducing par value to $0.50.</td></tr>
<tr><td>Dec 20</td><td>Declared a cash dividend of $0.10 per share (payable in January, Year 2).</td></tr>
<tr><td>Dec 31</td><td>Net income for Year 1 was $1,500,000.</td></tr></table>
<p class="ja">Nagano社の1/1 Y1の株主資本:普通株式(額面$1、発行済・流通500,000株)$500,000、資本剰余金(普通株式)$4,500,000(既存株式はすべて1株$10で発行)、利益剰余金$6,000,000。期首に自己株式由来の資本剰余金はなく、自己株式は原価法で処理する。第1年度の取引は表のとおり(2/1 新株50,000株を$14で発行、3/15 30,000株を$16で取得、6/1 10,000株を$19で再発行、8/1 8,000株を$12で再発行、10/1 残りの自己株式を消却(当初$10で発行)、11/1 10%株式配当(時価$20)、12/15 額面を$0.50に下げる2対1の株式分割、12/20 1株$0.10の現金配当を宣言、純利益$1,500,000)。</p>`,
  rows: [
    { label: "Debit to retained earnings on the August 1 reissuance(8/1の再発行で利益剰余金に借記する額)", type: "num", answer: 2000 },
    { label: "Debit to retained earnings on the October 1 retirement(10/1の消却で利益剰余金に借記する額)", type: "num", answer: 72000 },
    { label: "Number of shares distributed in the November 1 stock dividend(11/1の株式配当で交付する株式数)", type: "num", answer: 53800 },
    { label: "Retained earnings charged for the stock dividend(株式配当で利益剰余金から振り替える額)", type: "num", answer: 1076000 },
    { label: "Shares outstanding at 12/31 Y1(12/31 Y1の流通株式数)", type: "num", answer: 1183600 },
    { label: "Common stock (par) balance at 12/31 Y1(12/31 Y1の普通株式(額面)残高)", type: "num", answer: 591800 },
    { label: "Retained earnings balance at 12/31 Y1(12/31 Y1の利益剰余金残高)", type: "num", answer: 6231640 },
    { label: "If the November distribution had been a 30% stock dividend, retained earnings would be debited for(11月の配当が30%株式配当だった場合の利益剰余金借記額の基礎)", type: "select", options: ["Market value of the shares distributed", "Par value of the shares distributed", "No entry, as for a stock split", "Book value per share of the shares distributed"], answer: "Par value of the shares distributed" },
  ],
  explain: `<p>2/1:普通株式50,000、資本剰余金 50,000 × $13 = 650,000。3/15:自己株式 30,000 × $16 = 480,000。</p>
<p>6/1:現金190,000、自己株式160,000、自己株式処分差益(APIC–TS)30,000。</p>
<p>8/1:現金96,000、自己株式128,000、不足額32,000はまずAPIC–TS 30,000を取り崩し、残り2,000を利益剰余金に借記する。</p>
<p>10/1:残り12,000株(原価192,000)を消却。普通株式12,000、資本剰余金(当初発行時の$9/株)108,000を取り崩し、APIC–TSは残高ゼロのため残額 192,000 − 120,000 = 72,000 を利益剰余金に借記する。</p>
<p>11/1:流通株式 = 発行済 550,000 − 消却12,000 = 538,000(自己株式なし)。10%は小規模株式配当なので時価で処理:53,800株 × $20 = 1,076,000 を利益剰余金から振替(普通株式53,800、資本剰余金1,022,200)。</p>
<p>12/15:株式分割は仕訳なし。流通株式 = 591,800 × 2 = 1,183,600。普通株式残高 = 500,000 + 50,000 − 12,000 + 53,800 = 591,800(= 1,183,600 × $0.50)。</p>
<p>12/20:現金配当 = 1,183,600 × $0.10 = 118,360。</p>
<p>利益剰余金 = 6,000,000 − 2,000 − 72,000 − 1,076,000 + 1,500,000 − 118,360 = 6,231,640。</p>
<p>20〜25%以上の大規模株式配当は額面(法定資本)で利益剰余金から振り替える。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-73", section: "FAR", chapter: "FAR-05", title: "優先株式配当の配分(累積・完全参加型)と現物配当",
  scenario: `<p>Ishikawa Corp. has the following stock outstanding throughout Years 2 and 3:</p>
<table><tr><th>Class</th><th>Terms</th><th>Total par</th></tr>
<tr><td>Preferred</td><td>6%, cumulative, fully participating; $100 par; 10,000 shares</td><td>$1,000,000</td></tr>
<tr><td>Common</td><td>$10 par; 200,000 shares</td><td>$2,000,000</td></tr></table>
<p>Ishikawa paid preferred dividends in full through Year 1 but declared no dividends in Year 2. In December, Year 3, the board declared cash dividends totaling <b>$420,000</b>.</p>
<p>Also in Year 3, Ishikawa declared a property dividend of a parcel of land held for investment with a carrying amount of <b>$150,000</b> and a fair value of <b>$190,000</b> on the declaration date.</p>
<p><b>Board minutes excerpt (draft):</b> "The Year 2 preferred dividends not declared will be recognized as a current liability on the 12/31 Y2 balance sheet."</p>
<p class="ja">Ishikawa社は第2・第3年度を通じて上表の株式を発行している(優先株式:6%・累積的・完全参加型、額面$100、10,000株、計$1,000,000/普通株式:額面$10、200,000株、計$2,000,000)。第1年度までの優先配当は全額支払済みだが、第2年度は配当を宣言しなかった。第3年度12月、取締役会は総額$420,000の現金配当を宣言した。また第3年度に、帳簿価額$150,000、宣言日の公正価値$190,000の投資用土地による現物配当を宣言した。取締役会議事録案:「第2年度に宣言されなかった優先配当は12/31 Y2の貸借対照表に流動負債として計上する。」</p>`,
  rows: [
    { label: "Preferred dividends in arrears at 12/31 Y2(12/31 Y2の優先株式の延滞配当)", type: "num", answer: 60000 },
    { label: "Year 3 cash dividends allocated to preferred stockholders(第3年度の現金配当のうち優先株主への配分額)", type: "num", answer: 180000 },
    { label: "Year 3 cash dividends allocated to common stockholders(第3年度の現金配当のうち普通株主への配分額)", type: "num", answer: 240000 },
    { label: "Allocation to preferred if the preferred were cumulative but nonparticipating(優先株式が累積的・非参加型だった場合の優先株主への配分額)", type: "num", answer: 120000 },
    { label: "Gain recognized on the property dividend(現物配当で認識する利益)", type: "num", answer: 40000 },
    { label: "Reduction in retained earnings from the property dividend(現物配当による利益剰余金の減少額)", type: "num", answer: 190000 },
    { label: "Correct wording to replace the draft board minute(議事録案の正しい修正文)", type: "select", options: ["Recognize the arrearage as a current liability", "Recognize the arrearage as a noncurrent liability", "Disclose the arrearage in the notes; no liability until declared", "Reduce retained earnings for the arrearage without recording a liability"], answer: "Disclose the arrearage in the notes; no liability until declared" },
  ],
  explain: `<p>延滞配当 = 1,000,000 × 6% = 60,000(第2年度分)。</p>
<p>第3年度の配分:①延滞分 60,000 → 優先 ②当期分 60,000 → 優先 ③普通株式に同率6%:2,000,000 × 6% = 120,000 ④残額 420,000 − 240,000 = 180,000 を額面比(1,000,000:2,000,000)で参加配分 → 優先60,000、普通120,000。</p>
<p>優先 = 60,000 + 60,000 + 60,000 = 180,000。普通 = 120,000 + 120,000 = 240,000。</p>
<p>非参加型なら優先は延滞分と当期分の120,000のみで、残り300,000は普通株主に配分される。</p>
<p>現物配当:非貨幣性資産を宣言日の公正価値で再測定し、利益 = 190,000 − 150,000 = 40,000 を認識する。利益剰余金は公正価値190,000だけ減少する。</p>
<p>累積的優先株式の延滞配当は宣言されるまで負債ではなく、1株当たり金額・総額を注記で開示する。</p>`,
});
