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
