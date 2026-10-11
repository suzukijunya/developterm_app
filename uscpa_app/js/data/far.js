CPA.section({
  id: "FAR",
  name: "Financial Accounting and Reporting",
  ja: "財務会計",
  kind: "必須(Core)",
  color: "#2563eb",
  exam: { hours: 4, mcq: 50, tbs: 7, weight: "MC 50% / TBS 50%" },
  summary: "米国会計基準(US GAAP)に基づく企業会計、政府会計、非営利組織会計。出題範囲が最も広く、学習時間の配分も最大になる科目。",
  chapters: [
    {
      id: "FAR-01",
      title: "概念フレームワークと財務諸表",
      en: "Conceptual Framework & Financial Statements",
      note: `
<h3>1. 概念フレームワーク(<span class="en">Conceptual Framework</span>)</h3>
<p>FASB の概念フレームワークは、個々の基準を作るときの「考え方の土台」。財務報告の目的は、<b>投資家・債権者などの資源提供者の意思決定に役立つ情報</b>を提供すること。</p>
<div class="pt"><b>質的特性(<span class="en">Qualitative Characteristics</span>)</b>
<ul>
<li><b>基本的特性(<span class="en">Fundamental</span>)</b>:<span class="en">Relevance</span>(目的適合性)と <span class="en">Faithful representation</span>(忠実な表現)の2つ。
<ul><li>Relevance の構成要素:<span class="en">Predictive value / Confirmatory value / Materiality</span></li>
<li>Faithful representation の構成要素:<span class="en">Completeness / Neutrality / Free from error</span></li></ul></li>
<li><b>補強的特性(<span class="en">Enhancing</span>)</b>:<span class="en">Comparability, Verifiability, Timeliness, Understandability</span></li>
<li>制約:<span class="en">Cost constraint</span>(便益がコストを上回ること)</li>
</ul></div>
<p>ひっかけ:Predictive value や Neutrality は「構成要素」であって、補強的特性ではない。</p>

<h3>2. 財務諸表の構成要素(<span class="en">Elements</span>)</h3>
<p>Assets, Liabilities, Equity, Investments by owners, Distributions to owners, Revenues, Expenses, Gains, Losses, Comprehensive income の10要素。</p>

<h3>3. 包括利益(<span class="en">Comprehensive Income</span>)</h3>
<p>包括利益 = 当期純利益 + その他の包括利益(OCI)。OCI の代表例は次の4つ:</p>
<table><tr><th>項目</th><th>内容</th></tr>
<tr><td><span class="en">Pension adjustments</span></td><td>年金の数理差異・過去勤務費用</td></tr>
<tr><td><span class="en">Unrealized gains/losses on AFS debt securities</span></td><td>売却可能(AFS)<b>負債証券</b>の未実現損益</td></tr>
<tr><td><span class="en">Foreign currency translation adjustments</span></td><td>在外子会社の換算調整勘定</td></tr>
<tr><td><span class="en">Cash flow hedges</span></td><td>キャッシュフロー・ヘッジの有効部分(公正価値ヘッジは当期純利益)</td></tr></table>
<p>注意:<b>持分証券</b>の評価損益は原則として当期純利益(FV-NI)。<b>外貨建「取引」</b>の損益も当期純利益。</p>

<h3>4. 会計上の変更と誤謬(<span class="en">Accounting Changes & Error Corrections</span>)</h3>
<table><tr><th>種類</th><th>処理</th></tr>
<tr><td>会計方針の変更(例:加重平均法→FIFO)</td><td><b>遡及適用</b>(<span class="en">Retrospective</span>)</td></tr>
<tr><td>見積りの変更(耐用年数・残存価額など)</td><td><b>将来に向かって</b>(<span class="en">Prospective</span>)</td></tr>
<tr><td>減価償却方法の変更</td><td>見積りの変更として扱い、将来に向かって</td></tr>
<tr><td>過去の誤謬の訂正</td><td><b>修正再表示</b>(<span class="en">Restatement</span>)。期首利益剰余金を修正(<span class="en">Prior period adjustment</span>)</td></tr></table>

<h3>5. 非継続事業(<span class="en">Discontinued Operations</span>)</h3>
<p>戦略的な転換(<span class="en">strategic shift</span>)となる構成単位の処分。継続事業からの利益の下に、<b>税引後(net of tax)</b>で区分表示する。</p>
`,
      mcq: [
        {
          q: "Under the FASB Conceptual Framework, which of the following are the fundamental qualitative characteristics of useful financial information?",
          ja: "FASBの概念フレームワークにおいて、有用な財務情報の基本的な質的特性はどれか。",
          c: ["Relevance and faithful representation", "Comparability and verifiability", "Timeliness and understandability", "Materiality and consistency"],
          a: 0,
          ex: "基本的特性は Relevance(目的適合性)と Faithful representation(忠実な表現)の2つ。Comparability・Verifiability・Timeliness・Understandability は補強的特性。Materiality は Relevance の構成要素。",
        },
        {
          q: "Which of the following is an enhancing qualitative characteristic?",
          ja: "次のうち、補強的な質的特性はどれか。",
          c: ["Predictive value", "Completeness", "Verifiability", "Neutrality"],
          a: 2,
          ex: "Verifiability(検証可能性)は補強的特性。Predictive value は Relevance の構成要素、Completeness と Neutrality は Faithful representation の構成要素。",
        },
        {
          q: "Which of the following items is reported in other comprehensive income?",
          ja: "次のうち、その他の包括利益(OCI)で報告されるものはどれか。",
          c: ["Unrealized gain on equity securities with a readily determinable fair value", "Unrealized holding gain on available-for-sale debt securities", "Foreign currency transaction gain", "Gain from discontinued operations"],
          a: 1,
          ex: "AFS(売却可能)負債証券の未実現保有損益は OCI。持分証券の評価損益は当期純利益(FV-NI)。外貨建取引の損益も当期純利益。非継続事業の損益は純利益の中で区分表示される。",
        },
        {
          q: "A company changed its inventory method from weighted-average to FIFO. How should this change be reported?",
          ja: "ある会社が棚卸資産の評価方法を加重平均法からFIFOに変更した。この変更はどのように報告すべきか。",
          c: ["Prospectively, in the current and future periods only", "As a cumulative-effect adjustment in current-period net income", "By retrospective application to all prior periods presented", "Through disclosure in the notes only"],
          a: 2,
          ex: "会計方針(principle)の変更は原則として遡及適用(retrospective application)。表示される過去の期間を新方針で修正し、最も古い期の期首利益剰余金で累積影響を調整する。",
        },
        {
          q: "A company revised the estimated useful life of its equipment from 10 years to 8 years. This change should be accounted for:",
          ja: "ある会社が設備の見積耐用年数を10年から8年に変更した。この変更はどのように会計処理すべきか。",
          c: ["Retrospectively, by restating prior years", "Prospectively, in the current and future periods", "As a prior period adjustment to beginning retained earnings", "As an extraordinary item"],
          a: 1,
          ex: "耐用年数の変更は「見積りの変更(change in estimate)」なので将来に向かって(prospectively)処理する。変更時点の未償却残高を残りの耐用年数で償却し直す。",
        },
        {
          q: "An error in previously issued financial statements was discovered in the current year. The correction should be reported as:",
          ja: "当期に、過去に公表した財務諸表の誤謬が発見された。この訂正はどのように報告すべきか。",
          c: ["A component of current-year income from continuing operations", "A prior period adjustment to the beginning balance of retained earnings", "A component of other comprehensive income", "A change in accounting estimate"],
          a: 1,
          ex: "誤謬の訂正は修正再表示(restatement)。表示されている最も古い期の期首利益剰余金を前期修正(prior period adjustment)として調整する。",
        },
      ],
      cards: [
        ["Relevance", "目的適合性", "意思決定に違いをもたらす情報。予測価値・確認価値・重要性で構成"],
        ["Faithful representation", "忠実な表現", "完全・中立・誤謬がないこと"],
        ["Comprehensive income", "包括利益", "純利益+その他の包括利益(OCI)"],
        ["Retrospective application", "遡及適用", "会計方針の変更で過去の期間を修正すること"],
        ["Prior period adjustment", "前期修正", "誤謬訂正による期首利益剰余金の修正"],
        ["Discontinued operations", "非継続事業", "戦略的転換となる処分。税引後で区分表示"],
      ],
    },
    {
      id: "FAR-02",
      title: "収益認識(ASC 606)",
      en: "Revenue Recognition",
      note: `
<h3>1. 収益認識の5ステップ</h3>
<div class="pt"><ol>
<li>契約の識別(<span class="en">Identify the contract</span>)</li>
<li>履行義務の識別(<span class="en">Identify the performance obligations</span>)</li>
<li>取引価格の算定(<span class="en">Determine the transaction price</span>)</li>
<li>取引価格の配分(<span class="en">Allocate the transaction price</span>)</li>
<li>履行義務の充足時(または充足につれて)収益を認識(<span class="en">Recognize revenue when (or as) satisfied</span>)</li>
</ol></div>

<h3>2. 取引価格の配分</h3>
<p>独立販売価格(<span class="en">Standalone selling price, SSP</span>)の比率で配分する。</p>
<p class="ex">例:機械+2年保守を合計 $10,000 で販売。SSP は機械 $9,000、保守 $3,000。<br>機械への配分 = 10,000 × 9,000 / 12,000 = <b>$7,500</b>、保守 = $2,500</p>

<h3>3. 変動対価(<span class="en">Variable Consideration</span>)</h3>
<p>期待値法または最頻値法で見積もる。ただし「<b>重大な戻入れが生じない可能性が高い(probable)</b>」範囲でのみ取引価格に含める(<span class="en">constraint</span>)。</p>

<h3>4. 一定期間にわたる認識(<span class="en">Over time</span>)の要件(いずれか1つ)</h3>
<ul>
<li>顧客が便益を受けると同時に消費する(例:清掃サービス)</li>
<li>企業の履行で顧客が支配する資産が生じる・増える(例:顧客の土地での建設)</li>
<li>他に転用できない資産で、かつ<b>履行済み部分の支払請求権</b>がある</li>
</ul>
<p>いずれも満たさなければ「一時点(<span class="en">point in time</span>)」で、支配の移転時に認識。</p>

<h3>5. 本人と代理人(<span class="en">Principal vs. Agent</span>)</h3>
<p>財・サービスを顧客に移転する前に<b>支配</b>していれば本人 → 総額(gross)で収益計上。代理人 → 手数料部分のみ純額(net)。</p>

<h3>6. その他の論点</h3>
<ul>
<li><b>委託販売(<span class="en">Consignment</span>)</b>:受託者が最終顧客に販売した時点で、委託者が収益認識。</li>
<li><b>契約獲得の増分コスト</b>(販売手数料など):回収見込みなら資産計上して償却。償却期間1年以内なら費用処理できる実務上の便法あり。</li>
</ul>
`,
      mcq: [
        {
          q: "Under ASC 606, what is the correct order of the steps for recognizing revenue?",
          ja: "ASC 606において、収益認識のステップの正しい順序はどれか。",
          c: [
            "Identify contract → identify performance obligations → determine transaction price → allocate price → recognize revenue",
            "Identify contract → determine transaction price → identify performance obligations → recognize revenue → allocate price",
            "Determine transaction price → identify contract → allocate price → identify performance obligations → recognize revenue",
            "Identify performance obligations → identify contract → allocate price → determine transaction price → recognize revenue",
          ],
          a: 0,
          ex: "契約の識別 → 履行義務の識別 → 取引価格の算定 → 取引価格の配分 → 履行義務の充足による収益認識 の5ステップ。",
        },
        {
          q: "A company sells equipment and a two-year service contract for a total of $10,000. The standalone selling prices are $9,000 for the equipment and $3,000 for the service. What amount of the transaction price should be allocated to the equipment?",
          ja: "ある会社が設備と2年間のサービス契約を合計$10,000で販売した。独立販売価格は設備$9,000、サービス$3,000である。設備に配分すべき取引価格はいくらか。",
          c: ["$10,000", "$9,000", "$7,500", "$6,667"],
          a: 2,
          ex: "SSPの比率で配分:10,000 × 9,000 / (9,000 + 3,000) = $7,500。",
        },
        {
          q: "Variable consideration should be included in the transaction price only to the extent that:",
          ja: "変動対価は、どの範囲においてのみ取引価格に含めるべきか。",
          c: [
            "The amount has been collected in cash",
            "It is probable that a significant reversal of cumulative revenue recognized will not occur",
            "The customer has signed a written acknowledgment of the amount",
            "The most likely amount exceeds the expected value",
          ],
          a: 1,
          ex: "変動対価の制限(constraint):不確実性が解消されたときに、認識済み収益の重大な戻入れが生じない可能性が高い(probable)範囲でのみ含める。",
        },
        {
          q: "An entity that arranges for another party to provide goods to a customer, and does not control the goods before they are transferred, should recognize revenue:",
          ja: "他社が顧客に商品を提供するよう手配するだけで、移転前に商品を支配していない企業は、収益をどのように認識すべきか。",
          c: ["At the gross amount billed to the customer", "At the net amount of its fee or commission", "Only when the customer pays the supplier", "As a reduction of cost of goods sold"],
          a: 1,
          ex: "移転前に支配していない → 代理人(agent)。受け取る手数料(net amount)のみを収益計上する。",
        },
        {
          q: "Which of the following conditions indicates that a performance obligation is satisfied over time?",
          ja: "次のうち、履行義務が一定期間にわたり充足されることを示す条件はどれか。",
          c: [
            "The customer has paid the full contract price in advance",
            "The contract term exceeds one year",
            "The customer simultaneously receives and consumes the benefits as the entity performs",
            "The entity has physical possession of the asset",
          ],
          a: 2,
          ex: "「顧客が便益を受けると同時に消費する」は over time の3要件の1つ。前払いや契約期間の長さは要件ではない。",
        },
        {
          q: "Under a consignment arrangement, the consignor should recognize revenue when:",
          ja: "委託販売において、委託者はいつ収益を認識すべきか。",
          c: ["The goods are shipped to the consignee", "The consignee sells the goods to the end customer", "The consignment agreement is signed", "The consignee pays a deposit"],
          a: 1,
          ex: "受託者(consignee)は商品を支配していないため、委託者が収益を認識するのは受託者が最終顧客に販売した時点。",
        },
        {
          q: "Sales commissions paid to obtain a three-year customer contract that the entity expects to recover should be:",
          ja: "回収が見込まれる3年契約を獲得するために支払った販売手数料はどう処理すべきか。",
          c: ["Expensed when paid", "Capitalized and amortized over the period of benefit", "Deducted from revenue at contract inception", "Recorded as a reduction of equity"],
          a: 1,
          ex: "契約獲得の増分コストは回収見込みであれば資産計上し、便益期間にわたり償却する。償却期間が1年以内なら費用処理の実務上の便法が使えるが、本問は3年。",
        },
      ],
      cards: [
        ["Performance obligation", "履行義務", "顧客に区別できる財・サービスを移転する約束"],
        ["Transaction price", "取引価格", "企業が権利を得ると見込む対価の額"],
        ["Standalone selling price", "独立販売価格", "単独で販売した場合の価格。配分の基準"],
        ["Variable consideration", "変動対価", "値引き・リベート・ボーナスなどで変動する対価"],
        ["Principal vs. agent", "本人と代理人", "移転前に支配していれば本人(総額)、なければ代理人(純額)"],
        ["Consignment", "委託販売", "受託者が販売した時点で委託者が収益認識"],
      ],
    },
    {
      id: "FAR-03",
      title: "棚卸資産と有形固定資産",
      en: "Inventory and PP&E",
      note: `
<h3>1. 棚卸資産の評価方法</h3>
<table><tr><th>物価上昇時</th><th>期末棚卸高</th><th>売上原価</th><th>利益</th></tr>
<tr><td>FIFO(先入先出)</td><td>高い</td><td>低い</td><td>高い</td></tr>
<tr><td>LIFO(後入先出)</td><td>低い</td><td>高い</td><td>低い</td></tr></table>
<p>LIFO は US GAAP では認められるが IFRS では禁止。税務で LIFO を使うなら財務報告でも LIFO(<span class="en">LIFO conformity rule</span>)。</p>

<h3>2. 低価法</h3>
<div class="pt">
<ul><li><b>FIFO・平均法</b>:<span class="en">Lower of cost and net realizable value (LCNRV)</span></li>
<li><b>LIFO・売価還元法</b>:<span class="en">Lower of cost or market (LCM)</span>。market は 再調達原価を上限NRV・下限(NRV−通常利益)で挟んだ中央値</li></ul></div>
<p class="ex">例:FIFO、原価 $50,000、NRV $46,000、再調達原価 $44,000 → LCNRV なので <b>$46,000</b>(再調達原価は使わない)</p>

<h3>3. 有形固定資産の取得原価</h3>
<p>使用可能な状態にするまでの支出はすべて資産計上:購入価格、運賃、据付費、試運転費など。<br>
資産計上しないもの:従業員の研修費、使用開始後の保険料・修繕費。</p>

<h3>4. 減価償却</h3>
<ul>
<li>定額法:(取得原価 − 残存価額)÷ 耐用年数</li>
<li>2倍定率法(<span class="en">Double-declining balance</span>):期首帳簿価額 × (2 ÷ 耐用年数)。<b>残存価額は最初に差し引かない</b>(帳簿価額が残存価額を下回らないように止める)</li>
<li>年数総和法(<span class="en">Sum-of-the-years'-digits</span>):(取得原価 − 残存価額)× 残存年数 / 年数総和</li>
</ul>

<h3>5. 減損(使用中の長期性資産、US GAAP)</h3>
<div class="pt"><ol>
<li><b>回収可能性テスト</b>:割引前将来キャッシュフロー < 帳簿価額 なら減損あり</li>
<li><b>測定</b>:減損損失 = 帳簿価額 − 公正価値</li></ol>
US GAAP では使用中資産の減損の<b>戻入れは禁止</b>(IFRS は可)。</div>

<h3>6. 利息の資本化</h3>
<p>自社使用のために建設する資産など(<span class="en">qualifying assets</span>)について、建設期間中の<b>回避可能利息</b>(<span class="en">avoidable interest</span>)を資産計上。日常的に反復生産する棚卸資産は対象外。</p>
`,
      mcq: [
        {
          q: "During a period of rising prices, which inventory cost flow assumption results in the highest ending inventory?",
          ja: "物価上昇期において、期末棚卸高が最も高くなる原価配分方法はどれか。",
          c: ["LIFO", "FIFO", "Weighted average", "Specific identification always"],
          a: 1,
          ex: "FIFOでは古い(安い)原価から売上原価に払い出され、期末在庫には新しい(高い)原価が残るため、期末棚卸高が最も高くなる。",
        },
        {
          q: "A company using FIFO has inventory with a cost of $50,000, a net realizable value of $46,000, and a replacement cost of $44,000. At what amount should the inventory be reported?",
          ja: "FIFOを採用する会社の棚卸資産は、原価$50,000、正味実現可能価額$46,000、再調達原価$44,000である。棚卸資産はいくらで報告すべきか。",
          c: ["$50,000", "$46,000", "$44,000", "$45,000"],
          a: 1,
          ex: "FIFO・平均法は LCNRV(原価と正味実現可能価額の低い方)。min(50,000, 46,000) = $46,000。再調達原価は LIFO・売価還元法の LCM で使う。",
        },
        {
          q: "A company purchased equipment for $100,000. It also paid $3,000 for freight, $5,000 for installation, $2,000 to train employees, and $1,000 for insurance for the first year after the equipment was placed in service. What is the capitalized cost of the equipment?",
          ja: "ある会社が設備を$100,000で購入した。ほかに運賃$3,000、据付費$5,000、従業員研修費$2,000、使用開始後1年目の保険料$1,000を支払った。設備の取得原価はいくらか。",
          c: ["$100,000", "$108,000", "$110,000", "$111,000"],
          a: 1,
          ex: "使用可能にするための支出(購入価格+運賃+据付費)= 100,000 + 3,000 + 5,000 = $108,000。研修費と使用開始後の保険料は費用処理。",
        },
        {
          q: "Equipment costing $50,000 with a salvage value of $5,000 and a 5-year useful life is depreciated using the double-declining-balance method. What is the depreciation expense for year 2?",
          ja: "取得原価$50,000、残存価額$5,000、耐用年数5年の設備を2倍定率法で償却している。2年目の減価償却費はいくらか。",
          c: ["$18,000", "$12,000", "$10,800", "$9,000"],
          a: 1,
          ex: "償却率 = 2 ÷ 5 = 40%。1年目 50,000 × 40% = 20,000。2年目 (50,000 − 20,000) × 40% = $12,000。2倍定率法では残存価額を最初に控除しない。",
        },
        {
          q: "An asset held and used has a carrying amount of $500,000, undiscounted future cash flows of $450,000, and a fair value of $380,000. Under U.S. GAAP, what impairment loss should be recognized?",
          ja: "使用中の資産の帳簿価額は$500,000、割引前将来キャッシュフローは$450,000、公正価値は$380,000である。US GAAPで認識すべき減損損失はいくらか。",
          c: ["$0", "$50,000", "$70,000", "$120,000"],
          a: 3,
          ex: "回収可能性テスト:450,000 < 500,000 なので減損あり。減損損失 = 帳簿価額 − 公正価値 = 500,000 − 380,000 = $120,000。",
        },
        {
          q: "Interest should be capitalized for which of the following assets?",
          ja: "次のうち、利息を資産計上すべき資産はどれか。",
          c: ["Inventory routinely manufactured in large quantities", "A building being constructed for the company's own use", "Land held for investment with no development activity", "Equipment already in use"],
          a: 1,
          ex: "自社使用のために建設中の資産は qualifying asset。日常的に大量生産する棚卸資産、開発活動のない土地、すでに使用中の資産は対象外。",
        },
      ],
      cards: [
        ["Net realizable value (NRV)", "正味実現可能価額", "見積売価 − 完成・販売に要する費用"],
        ["LIFO conformity rule", "LIFO適合ルール", "税務でLIFOなら財務報告もLIFO"],
        ["Double-declining balance", "2倍定率法", "期首簿価 × 2/耐用年数。残存価額を最初に控除しない"],
        ["Recoverability test", "回収可能性テスト", "割引前CF < 帳簿価額なら減損"],
        ["Avoidable interest", "回避可能利息", "建設支出がなければ避けられた利息。資産計上の上限"],
        ["Qualifying asset", "適格資産", "利息を資本化できる資産(自社建設資産など)"],
      ],
    },
    {
      id: "FAR-04",
      title: "負債・社債・リース",
      en: "Liabilities, Bonds and Leases",
      note: `
<h3>1. 社債(<span class="en">Bonds Payable</span>)</h3>
<p>発行価額 = 額面の現在価値 + 利払いの現在価値(市場利率で割引)。</p>
<table><tr><th></th><th>表面利率 < 市場利率</th><th>表面利率 > 市場利率</th></tr>
<tr><td>発行</td><td>割引発行(<span class="en">Discount</span>)</td><td>打歩発行(<span class="en">Premium</span>)</td></tr>
<tr><td>支払利息 vs 現金利息</td><td>支払利息 > 現金</td><td>支払利息 < 現金</td></tr></table>
<div class="pt"><b>実効金利法(<span class="en">Effective interest method</span>)</b><br>
支払利息 = 期首帳簿価額 × 市場(実効)利率<br>現金利息 = 額面 × 表面利率<br>差額 = 割引(打歩)の償却額</div>
<p class="ex">例:額面 $100,000、表面8%、実効9%、発行価額 $95,000、年1回払い。<br>1年目 支払利息 95,000 × 9% = 8,550、現金 8,000、償却 550 → 期末簿価 <b>$95,550</b></p>
<p>社債発行費:US GAAP では負債の帳簿価額から<b>直接控除</b>して表示。</p>

<h3>2. 偶発損失(<span class="en">Loss Contingencies</span>)</h3>
<table><tr><th></th><th>合理的に見積り可能</th><th>見積り不能</th></tr>
<tr><td>Probable(可能性が高い)</td><td>計上+注記</td><td>注記</td></tr>
<tr><td>Reasonably possible</td><td>注記</td><td>注記</td></tr>
<tr><td>Remote</td><td>なし</td><td>なし</td></tr></table>
<p>見積りが幅で、最善の見積りがない場合 → US GAAP は<b>最小値</b>を計上(IFRS は中央値)。偶発利益は実現するまで計上しない。</p>

<h3>3. リース(ASC 842)— 借手</h3>
<div class="pt"><b>ファイナンス・リースの判定(1つでも該当すれば)「OWNES」</b>
<ul>
<li><b>O</b>wnership transfer:所有権の移転</li>
<li><b>W</b>ritten option:合理的に確実な購入オプション</li>
<li><b>N</b>et present value:リース料の現在価値が公正価値のほぼすべて(目安90%以上)</li>
<li><b>E</b>conomic life:リース期間が経済的耐用年数の大部分(目安75%以上)</li>
<li><b>S</b>pecialized:借手専用の特殊資産</li>
</ul></div>
<ul>
<li>どちらの分類でも(12か月超なら)<b>使用権資産(ROU asset)とリース負債</b>を計上。</li>
<li>ファイナンス:償却費と支払利息を別々に計上(前半に費用が多い)。</li>
<li>オペレーティング:<b>単一の定額リース費用</b>を計上。</li>
</ul>
<p class="ex">例:毎年期首に $10,000 を5回支払い、割引率6%(期首払い年金現価係数 4.4651) → リース負債 = <b>$44,651</b></p>
`,
      mcq: [
        {
          q: "When bonds are issued at a discount, interest expense under the effective interest method will be:",
          ja: "社債が割引発行された場合、実効金利法による支払利息はどうなるか。",
          c: ["Less than the cash interest paid", "Equal to the cash interest paid", "Greater than the cash interest paid", "Zero until maturity"],
          a: 2,
          ex: "割引発行 = 市場利率 > 表面利率。支払利息(簿価×市場利率)は現金利息(額面×表面利率)より大きく、その差額が割引の償却額となり簿価が増加していく。",
        },
        {
          q: "On January 1, a company issued $100,000 face value, 8% bonds for $95,000 to yield 9%. Interest is paid annually on December 31. Using the effective interest method, what is the interest expense for the first year?",
          ja: "1月1日に額面$100,000、表面利率8%の社債を利回り9%となるよう$95,000で発行した。利息は毎年12月31日に支払う。実効金利法による1年目の支払利息はいくらか。",
          c: ["$8,000", "$8,550", "$9,000", "$7,600"],
          a: 1,
          ex: "支払利息 = 期首帳簿価額 × 実効利率 = 95,000 × 9% = $8,550。現金支払は 100,000 × 8% = 8,000、差額550が割引の償却。",
        },
        {
          q: "Under U.S. GAAP, a loss contingency should be accrued when the loss is:",
          ja: "US GAAPにおいて、偶発損失を計上すべきなのはどのような場合か。",
          c: ["Reasonably possible and reasonably estimable", "Probable and reasonably estimable", "Probable, even if it cannot be estimated", "Remote but material"],
          a: 1,
          ex: "発生の可能性が高く(probable)、かつ合理的に見積り可能な場合に計上する。reasonably possible なら注記のみ。",
        },
        {
          q: "A probable loss is estimated to be within a range of $200,000 to $500,000, with no amount in the range being a better estimate than any other. Under U.S. GAAP, what amount should be accrued?",
          ja: "可能性の高い損失が$200,000〜$500,000の範囲と見積もられ、範囲内のどの金額も他より良い見積りとはいえない。US GAAPではいくら計上すべきか。",
          c: ["$0", "$200,000", "$350,000", "$500,000"],
          a: 1,
          ex: "US GAAPでは最善の見積りがない場合、範囲の最小値($200,000)を計上し、追加損失の可能性を注記する。IFRSでは中央値。",
        },
        {
          q: "Which of the following is NOT one of the criteria for classifying a lease as a finance lease by a lessee under ASC 842?",
          ja: "ASC 842において、借手がファイナンス・リースに分類する要件に含まれないものはどれか。",
          c: [
            "The lease transfers ownership of the asset to the lessee by the end of the lease term",
            "The lessee's incremental borrowing rate is lower than the rate implicit in the lease",
            "The lease term is for the major part of the remaining economic life of the asset",
            "The asset is so specialized that it is expected to have no alternative use to the lessor",
          ],
          a: 1,
          ex: "ファイナンス・リースの5要件は、所有権移転・合理的に確実な購入オプション・耐用年数の大部分・現在価値がほぼすべて・特殊資産。利率の大小は要件ではない。",
        },
        {
          q: "A lessee signs a 5-year lease requiring annual payments of $10,000 at the beginning of each year. The discount rate is 6%, and the present value factor for an annuity due of 5 periods at 6% is 4.4651. What is the initial lease liability?",
          ja: "借手が毎年期首に$10,000を支払う5年リース契約を締結した。割引率は6%、期首払い5期の年金現価係数は4.4651である。当初のリース負債はいくらか。",
          c: ["$50,000", "$44,651", "$42,124", "$34,651"],
          a: 1,
          ex: "リース負債 = リース料の現在価値 = 10,000 × 4.4651 = $44,651。",
        },
        {
          q: "For an operating lease, a lessee generally recognizes in its income statement:",
          ja: "オペレーティング・リースについて、借手は損益計算書で一般に何を認識するか。",
          c: [
            "Separate amortization expense and interest expense",
            "A single lease cost on a straight-line basis",
            "Rent expense only when cash is paid",
            "No expense; the lease is disclosed only",
          ],
          a: 1,
          ex: "オペレーティング・リースでは単一のリース費用を定額で認識する(貸借対照表には使用権資産とリース負債を計上)。償却費と利息を分けるのはファイナンス・リース。",
        },
      ],
      cards: [
        ["Effective interest method", "実効金利法", "期首簿価 × 実効利率で利息を計上"],
        ["Bond discount", "社債発行差金(割引)", "表面利率 < 市場利率のときに発生"],
        ["Loss contingency", "偶発損失", "probable かつ見積り可能なら計上"],
        ["Right-of-use (ROU) asset", "使用権資産", "リース期間中に資産を使用する権利"],
        ["Lease liability", "リース負債", "未払リース料の現在価値"],
        ["Incremental borrowing rate", "追加借入利子率", "計算利子率が不明な場合に借手が使う割引率"],
      ],
    },
    {
      id: "FAR-05",
      title: "投資・純資産・EPS",
      en: "Investments, Equity and EPS",
      note: `
<h3>1. 投資の分類</h3>
<table><tr><th>種類</th><th>測定</th><th>評価差額</th></tr>
<tr><td>満期保有(HTM)負債証券</td><td>償却原価</td><td>なし</td></tr>
<tr><td>売買目的(Trading)負債証券</td><td>公正価値</td><td>当期純利益</td></tr>
<tr><td>売却可能(AFS)負債証券</td><td>公正価値</td><td><b>OCI</b></td></tr>
<tr><td>持分証券(重要な影響なし)</td><td>公正価値</td><td>当期純利益</td></tr>
<tr><td>持分証券(重要な影響あり、通常20〜50%)</td><td colspan="2">持分法(<span class="en">Equity method</span>)</td></tr></table>

<h3>2. 持分法</h3>
<div class="pt">投資勘定 = 取得原価 + 被投資会社の純利益 × 持分比率 − 受取配当金<br>受取配当金は収益ではなく、<b>投資勘定の減額</b>。</div>
<p class="ex">例:30%保有。被投資会社の純利益 $200,000、配当 $50,000 → 投資勘定 +60,000 − 15,000 = <b>+$45,000</b></p>

<h3>3. 自己株式(<span class="en">Treasury Stock</span>)— 原価法</h3>
<ul><li>取得:取得原価で自己株式(純資産のマイナス)</li>
<li>原価より高く再発行:差額は <b>APIC – treasury stock</b>(利益は計上しない)</li>
<li>原価より低く再発行:APIC – treasury stock を取り崩し、不足分は利益剰余金</li></ul>

<h3>4. 1株当たり利益(EPS)</h3>
<div class="pt">基本的EPS = (当期純利益 − 優先配当)÷ 普通株式の加重平均株式数</div>
<ul>
<li>累積的優先株:宣言の有無にかかわらず当期分を控除</li>
<li>非累積的優先株:宣言された分のみ控除</li>
<li><b>株式分割・株式配当は期首にさかのぼって</b>調整(期中発行分も含めて)</li>
<li>希薄化後EPS:新株予約権は自己株式法(<span class="en">treasury stock method</span>)、転換社債・転換優先株は転換仮定法(<span class="en">if-converted method</span>)。逆希薄化(EPSが増える)なら含めない</li>
</ul>
<p class="ex">例:1/1 100,000株、4/1 に12,000株発行、10/1 に2対1の株式分割<br>(100,000 + 12,000 × 9/12)× 2 = <b>218,000株</b></p>
`,
      mcq: [
        {
          q: "An investor owns 30% of an investee and uses the equity method. During the year, the investee reported net income of $200,000 and paid dividends of $50,000. By how much should the investment account increase?",
          ja: "投資会社は被投資会社の30%を保有し、持分法を適用している。当期、被投資会社は純利益$200,000を計上し、配当$50,000を支払った。投資勘定はいくら増加するか。",
          c: ["$60,000", "$45,000", "$15,000", "$150,000"],
          a: 1,
          ex: "純利益の持分 200,000 × 30% = 60,000 を加算、受取配当 50,000 × 30% = 15,000 を減算。60,000 − 15,000 = $45,000。",
        },
        {
          q: "Debt securities that an entity has the positive intent and ability to hold to maturity are measured at:",
          ja: "満期まで保有する積極的な意図と能力がある負債証券は、どのように測定されるか。",
          c: ["Fair value through net income", "Fair value through other comprehensive income", "Amortized cost", "Lower of cost or market"],
          a: 2,
          ex: "満期保有目的(HTM)負債証券は償却原価で測定する。公正価値の変動は認識しない。",
        },
        {
          q: "Changes in the fair value of an investment in equity securities with a readily determinable fair value, where the investor has no significant influence, are reported in:",
          ja: "重要な影響力がなく、公正価値が容易に算定できる持分証券への投資について、公正価値の変動はどこで報告されるか。",
          c: ["Other comprehensive income", "Net income", "Additional paid-in capital", "Notes only"],
          a: 1,
          ex: "持分証券(重要な影響なし)は公正価値で測定し、変動は当期純利益で認識する(FV-NI)。AFS区分は負債証券のみ。",
        },
        {
          q: "A company reported net income of $500,000. It has cumulative, nonconvertible preferred stock with annual dividends of $50,000 (not declared this year). The weighted-average number of common shares outstanding was 90,000. What is basic EPS?",
          ja: "ある会社の当期純利益は$500,000。年間配当$50,000の累積的・非転換優先株があり(当期は未宣言)、普通株式の加重平均株式数は90,000株である。基本的EPSはいくらか。",
          c: ["$5.56", "$5.00", "$4.50", "$5.26"],
          a: 1,
          ex: "累積的優先株は宣言の有無にかかわらず当期分を控除。(500,000 − 50,000)÷ 90,000 = $5.00。",
        },
        {
          q: "A company had 100,000 common shares outstanding on January 1. It issued 12,000 shares on April 1 and declared a 2-for-1 stock split on October 1. What is the weighted-average number of shares for EPS?",
          ja: "1月1日の普通株式は100,000株。4月1日に12,000株を発行し、10月1日に2対1の株式分割を行った。EPS計算上の加重平均株式数はいくらか。",
          c: ["109,000", "112,000", "218,000", "224,000"],
          a: 2,
          ex: "株式分割は期首にさかのぼって調整。(100,000 + 12,000 × 9/12)× 2 = 109,000 × 2 = 218,000株。",
        },
        {
          q: "Under the cost method, when treasury stock is reissued at a price above its cost, the excess is credited to:",
          ja: "原価法において、自己株式を取得原価を上回る価格で再発行した場合、差額は何に貸記されるか。",
          c: ["Gain on sale of treasury stock (income statement)", "Retained earnings", "Additional paid-in capital from treasury stock", "Common stock"],
          a: 2,
          ex: "自己株式の取引から損益は生じない。超過額は APIC – treasury stock(資本剰余金)に計上する。",
        },
      ],
      cards: [
        ["Equity method", "持分法", "重要な影響(通常20〜50%)がある投資の会計処理"],
        ["Available-for-sale (AFS)", "売却可能", "負債証券のみ。評価差額はOCI"],
        ["Held-to-maturity (HTM)", "満期保有目的", "償却原価で測定"],
        ["Treasury stock", "自己株式", "自社が買い戻した株式。純資産の控除項目"],
        ["Weighted-average shares", "加重平均株式数", "株式分割・株式配当は遡及調整"],
        ["Antidilutive", "逆希薄化", "EPSを増加させる潜在株式。希薄化後EPSに含めない"],
      ],
    },
    {
      id: "FAR-06",
      title: "政府会計と非営利組織会計",
      en: "Governmental and Not-for-Profit Accounting",
      note: `
<h3>1. 政府会計(GASB)— ファンドの3分類</h3>
<table><tr><th>分類</th><th>ファンド</th><th>基準</th></tr>
<tr><td>Governmental(政府型)</td><td>General, Special revenue, Debt service, Capital projects, Permanent(覚え方「GRSPP」)</td><td><b>修正発生主義</b>/当座の財務資源</td></tr>
<tr><td>Proprietary(事業型)</td><td>Enterprise, Internal service</td><td>発生主義/経済的資源</td></tr>
<tr><td>Fiduciary(受託型)</td><td>Pension trust, Investment trust, Private-purpose trust, Custodial</td><td>発生主義/経済的資源</td></tr></table>

<div class="pt"><b>政府全体財務諸表(<span class="en">Government-wide</span>)</b>:発生主義・経済的資源。受託型ファンドは<b>含めない</b>。<br>
<b>ファンド財務諸表(政府型)</b>:修正発生主義。固定資産の購入は<b>支出(Expenditure)</b>として計上し、資産計上しない。</div>
<p>修正発生主義の収益:<b>測定可能かつ利用可能(available)</b>になったときに認識(当期の負債の支払いに使えるうちに回収)。</p>

<h3>2. 非営利組織(FASB)</h3>
<ul>
<li>純資産の区分:<b>寄付者の制約あり</b>(<span class="en">with donor restrictions</span>)と<b>制約なし</b>(<span class="en">without donor restrictions</span>)の2区分</li>
<li>財務諸表:<span class="en">Statement of financial position, Statement of activities, Statement of cash flows</span>。費用の機能別・性質別の分析も必要</li>
<li><b>無条件の寄付の約束</b>:約束を受けた時点で収益計上(公正価値)。<b>条件付き</b>:条件(障壁)が満たされたときに計上</li>
</ul>
<div class="pt"><b>役務の寄付(<span class="en">Contributed services</span>)の認識要件</b>(どちらか):
<ol><li>非金融資産を作り出す・価値を高める</li>
<li>専門的技能を要し、その技能を持つ者が提供し、寄付がなければ通常購入するもの</li></ol></div>
`,
      mcq: [
        {
          q: "Governmental funds use which measurement focus and basis of accounting?",
          ja: "政府型ファンドはどの測定の焦点と会計基準を用いるか。",
          c: ["Economic resources; accrual basis", "Current financial resources; modified accrual basis", "Economic resources; modified accrual basis", "Current financial resources; cash basis"],
          a: 1,
          ex: "政府型ファンドは「当座の財務資源」の測定の焦点と修正発生主義。事業型・受託型ファンドと政府全体財務諸表は経済的資源・発生主義。",
        },
        {
          q: "Which of the following is a proprietary fund?",
          ja: "次のうち、事業型ファンドはどれか。",
          c: ["Special revenue fund", "Capital projects fund", "Internal service fund", "Permanent fund"],
          a: 2,
          ex: "事業型ファンドは Enterprise fund と Internal service fund。Special revenue・Capital projects・Permanent は政府型ファンド。",
        },
        {
          q: "When the general fund purchases a capital asset, the fund financial statements report:",
          ja: "一般ファンドが固定資産を購入したとき、ファンド財務諸表では何を報告するか。",
          c: ["A capital asset and depreciation expense", "An expenditure", "An expense", "A deferred outflow of resources"],
          a: 1,
          ex: "政府型ファンドは当座の財務資源に焦点を当てるため、固定資産の購入は支出(expenditure)として計上する。資産計上と減価償却は政府全体財務諸表で行う。",
        },
        {
          q: "Which funds are excluded from the government-wide financial statements?",
          ja: "政府全体財務諸表から除外されるファンドはどれか。",
          c: ["Enterprise funds", "Internal service funds", "Fiduciary funds", "Debt service funds"],
          a: 2,
          ex: "受託型(fiduciary)ファンドの資源は政府自身の活動に使えないため、政府全体財務諸表には含めない。",
        },
        {
          q: "A not-for-profit entity reports net assets in which classes?",
          ja: "非営利組織は純資産をどの区分で報告するか。",
          c: [
            "Unrestricted, temporarily restricted, and permanently restricted",
            "With donor restrictions and without donor restrictions",
            "Invested in capital assets, restricted, and unrestricted",
            "Designated and undesignated",
          ],
          a: 1,
          ex: "現行基準(ASU 2016-14以降)では、寄付者の制約あり・制約なしの2区分。3区分(unrestricted / temporarily / permanently restricted)は旧基準。Invested in capital assets などは政府の純ポジションの区分。",
        },
        {
          q: "A not-for-profit organization received an unconditional promise to give $50,000 next year. When should the contribution revenue be recognized?",
          ja: "非営利組織が、翌年に$50,000を寄付するという無条件の約束を受けた。寄付収益はいつ認識すべきか。",
          c: ["When the cash is received next year", "When the promise is received", "Only when the donor's restriction expires", "It is disclosed but never recognized"],
          a: 1,
          ex: "無条件の寄付の約束は、約束を受けた時点で収益として認識する(将来受け取るため寄付者の制約あり純資産に区分されるのが通常)。条件付きの約束は条件が満たされるまで認識しない。",
        },
        {
          q: "A CPA volunteers to perform accounting services for a not-for-profit organization that would otherwise purchase those services. The contributed services should be:",
          ja: "公認会計士が非営利組織に会計サービスを無償で提供した。組織はこのサービスがなければ購入していたはずである。この役務の寄付はどう扱うべきか。",
          c: ["Disclosed only", "Recognized as contribution revenue and expense at fair value", "Ignored because no cash was exchanged", "Recognized only if the CPA requests a receipt"],
          a: 1,
          ex: "専門的技能を要し、その技能を持つ者が提供し、通常は購入するサービスなので、公正価値で寄付収益と費用を認識する。",
        },
      ],
      cards: [
        ["Modified accrual basis", "修正発生主義", "政府型ファンドの会計基準。収益は measurable かつ available で認識"],
        ["Expenditure", "支出", "政府型ファンドで資源の流出を表す。固定資産購入も支出"],
        ["Government-wide financial statements", "政府全体財務諸表", "発生主義・経済的資源。受託型は除外"],
        ["Fiduciary fund", "受託型ファンド", "第三者のために保有する資源"],
        ["Net assets with donor restrictions", "寄付者の制約あり純資産", "寄付者が目的・時期を制約した純資産"],
        ["Contributed services", "役務の寄付", "非金融資産を高めるか専門技能の場合に認識"],
      ],
    },
    {
      id: "FAR-07",
      title: "法人所得税とキャッシュフロー計算書",
      en: "Income Taxes and Statement of Cash Flows",
      note: `
<h3>1. 税効果会計(ASC 740)</h3>
<table><tr><th>差異</th><th>例</th><th>結果</th></tr>
<tr><td>将来加算一時差異</td><td>税務上の償却 > 会計上の償却、割賦販売</td><td>繰延税金負債(DTL)</td></tr>
<tr><td>将来減算一時差異</td><td>製品保証引当金、貸倒引当金、前受収益</td><td>繰延税金資産(DTA)</td></tr>
<tr><td>永久差異</td><td>地方債の利息、罰金、生命保険料(会社受取人)</td><td>税効果なし</td></tr></table>
<div class="pt">DTL・DTA = 一時差異 × <b>解消年度に適用される制定済み税率</b>(<span class="en">enacted rate</span>)<br>
DTA は実現しない可能性が50%超(<span class="en">more likely than not</span>)なら<b>評価性引当額</b>(<span class="en">valuation allowance</span>)を計上。<br>
貸借対照表では DTA・DTL はすべて<b>非流動</b>区分。</div>

<h3>2. キャッシュフロー計算書</h3>
<table><tr><th>区分</th><th>例(US GAAP)</th></tr>
<tr><td>営業(Operating)</td><td>顧客からの入金、仕入・給与の支払、<b>利息の支払・受取、配当の受取</b>、法人税</td></tr>
<tr><td>投資(Investing)</td><td>固定資産の購入・売却、他社への貸付・回収、他社の株式・社債の購入</td></tr>
<tr><td>財務(Financing)</td><td>借入・返済、株式発行、<b>配当の支払</b>、自己株式の取得</td></tr>
<tr><td>非資金取引</td><td>株式発行による土地取得、転換社債の転換 → 別途開示</td></tr></table>

<h3>3. 間接法による営業CF</h3>
<div class="pt">当期純利益<br>+ 減価償却費・償却費、売却損<br>− 売却益<br>− 流動資産(売掛金・棚卸資産など)の増加 / + 減少<br>+ 流動負債(買掛金など)の増加 / − 減少</div>
<p class="ex">例:純利益100,000、減価償却20,000、設備売却益5,000、売掛金増加8,000、買掛金増加6,000<br>→ 100,000 + 20,000 − 5,000 − 8,000 + 6,000 = <b>$113,000</b></p>
`,
      mcq: [
        {
          q: "Depreciation deducted for tax purposes exceeds depreciation recorded for financial reporting. This creates a:",
          ja: "税務上の減価償却費が会計上の減価償却費を上回っている。これにより何が生じるか。",
          c: ["Deferred tax asset", "Deferred tax liability", "Permanent difference", "Valuation allowance"],
          a: 1,
          ex: "今は税金が少なく、将来の課税所得が増える(将来加算一時差異)ため、繰延税金負債(DTL)が生じる。",
        },
        {
          q: "At year-end, a company has a taxable temporary difference of $40,000 that will reverse next year. The current tax rate is 21%, and the enacted rate for next year is 25%. What deferred tax liability should be reported?",
          ja: "期末に、翌年解消する将来加算一時差異$40,000がある。当期の税率は21%、翌年の制定済み税率は25%である。報告すべき繰延税金負債はいくらか。",
          c: ["$8,400", "$10,000", "$9,200", "$0"],
          a: 1,
          ex: "解消年度に適用される制定済み税率を使う。40,000 × 25% = $10,000。",
        },
        {
          q: "Which of the following results in a permanent difference rather than a temporary difference?",
          ja: "次のうち、一時差異ではなく永久差異となるものはどれか。",
          c: ["Warranty expense accrued for books", "Interest received on municipal bonds", "Accelerated tax depreciation", "Unearned rent received in advance"],
          a: 1,
          ex: "地方債の利息は会計上は収益だが税務上は永久に非課税のため永久差異。他の3つは解消される一時差異。",
        },
        {
          q: "A valuation allowance against a deferred tax asset is required when:",
          ja: "繰延税金資産に対して評価性引当額が必要となるのはどのような場合か。",
          c: [
            "It is more likely than not that some portion of the asset will not be realized",
            "It is probable that the asset will be realized",
            "The tax rate is expected to increase",
            "The deferred tax asset exceeds the deferred tax liability",
          ],
          a: 0,
          ex: "DTAの一部または全部が実現しない可能性が50%超(more likely than not)の場合に評価性引当額を計上する。",
        },
        {
          q: "Under U.S. GAAP, dividends paid to shareholders are classified in the statement of cash flows as:",
          ja: "US GAAPにおいて、株主への配当の支払はキャッシュフロー計算書でどの区分に分類されるか。",
          c: ["Operating activities", "Investing activities", "Financing activities", "Noncash disclosure"],
          a: 2,
          ex: "配当の支払は財務活動。なお利息の支払と配当の受取は営業活動(US GAAP)。",
        },
        {
          q: "Net income was $100,000. Depreciation was $20,000, gain on sale of equipment was $5,000, accounts receivable increased by $8,000, and accounts payable increased by $6,000. What is net cash provided by operating activities under the indirect method?",
          ja: "当期純利益$100,000、減価償却費$20,000、設備売却益$5,000、売掛金の増加$8,000、買掛金の増加$6,000。間接法による営業活動によるキャッシュフローはいくらか。",
          c: ["$113,000", "$123,000", "$103,000", "$127,000"],
          a: 0,
          ex: "100,000 + 20,000(減価償却)− 5,000(売却益)− 8,000(売掛金増)+ 6,000(買掛金増)= $113,000。",
        },
      ],
      cards: [
        ["Deferred tax liability (DTL)", "繰延税金負債", "将来加算一時差異から生じる"],
        ["Deferred tax asset (DTA)", "繰延税金資産", "将来減算一時差異・繰越欠損金から生じる"],
        ["Valuation allowance", "評価性引当額", "DTAが実現しない可能性が50%超のとき計上"],
        ["Permanent difference", "永久差異", "解消しない差異。税効果なし"],
        ["Indirect method", "間接法", "純利益から調整して営業CFを求める"],
        ["Noncash investing and financing activities", "非資金取引", "現金を伴わない投資・財務活動。別途開示"],
      ],
    },
  ],
});
