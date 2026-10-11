// FAR の追加問題(財務諸表の表示・注記・後発事象・公正価値・会計上の変更・期中報告・セグメント・特別目的の枠組み・概念フレームワーク)

CPA.extend("FAR-01", {
  mcq: [
    {
      q: "At December 31, Year 1, a company had a $500,000 note payable due March 31, Year 2. On January 20, Year 2, before the Year 1 financial statements were issued on February 15, the company issued $400,000 of 10-year bonds and used the proceeds, together with $100,000 of cash on hand, to retire the note at maturity. What amount of the note should be classified as a current liability on the December 31, Year 1 balance sheet?",
      ja: "Year 1年12月31日現在、会社にはYear 2年3月31日満期の手形借入金$500,000がある。Year 1の財務諸表を2月15日に発行する前のYear 2年1月20日に、会社は10年満期の社債$400,000を発行し、その手取金と手許現金$100,000を用いて満期に手形を返済した。Year 1年12月31日の貸借対照表で流動負債に分類すべき手形の金額はいくらか。",
      c: ["$0", "$100,000", "$400,000", "$500,000"],
      a: 1,
      ex: "貸借対照表日後・発行前に長期債務の発行で借換えた場合、非流動に分類できるのは長期債務の手取金で返済される部分($400,000)に限られる。手許現金で返済する$100,000は流動負債のままである。全額を非流動とする$0は誤り。",
    },
    {
      q: "A company with a 15-month operating cycle reports the following at year-end: cash $50,000; trade receivables collectible within the operating cycle $120,000; cash surrender value of officers' life insurance $30,000; a bond sinking fund for bonds maturing in five years $80,000; prepaid insurance covering the next 12 months $6,000; and inventory $90,000. What amount should be reported as total current assets?",
      ja: "営業循環期間が15か月の会社の期末残高は次のとおり。現金$50,000、営業循環期間内に回収予定の売掛金$120,000、役員生命保険の解約返戻金$30,000、5年後満期の社債のための減債基金$80,000、今後12か月分の前払保険料$6,000、棚卸資産$90,000。流動資産合計はいくらか。",
      c: ["$296,000", "$346,000", "$376,000", "$266,000"],
      a: 3,
      ex: "流動資産 = 50,000 + 120,000 + 6,000 + 90,000 = 266,000。営業循環期間内に回収される売掛金は1年超でも流動。解約返戻金と長期債務返済用の減債基金は非流動資産(投資等)であり、これらを含めると$296,000や$346,000になる。",
    },
    {
      q: "A company's records for the year show: sales $1,000,000; sales returns and allowances $20,000; cost of goods sold $600,000; selling expenses $90,000; general and administrative expenses $70,000; interest expense $15,000; and dividend revenue $8,000. In a multiple-step income statement, what amount should be reported as income from operations?",
      ja: "当期の記録は次のとおり。売上高$1,000,000、売上戻り・値引$20,000、売上原価$600,000、販売費$90,000、一般管理費$70,000、支払利息$15,000、受取配当金$8,000。多段階損益計算書で営業利益として報告すべき金額はいくらか。",
      c: ["$380,000", "$240,000", "$220,000", "$213,000"],
      a: 2,
      ex: "純売上高980,000 − 売上原価600,000 = 売上総利益380,000。営業利益 = 380,000 − 90,000 − 70,000 = 220,000。支払利息と受取配当金は営業外項目であり($213,000は営業外を含めた誤り)、売上戻りを控除しないと$240,000になる。",
    },
    {
      q: "A company has a net actuarial loss in accumulated other comprehensive income related to its defined benefit pension plan. During the year, $4,000 of the net loss was amortized as a component of net periodic pension cost, and a new actuarial gain of $10,000 arose from a change in the discount rate. Ignoring income taxes, what is the net effect of these items on other comprehensive income for the year?",
      ja: "会社は確定給付年金制度に関する純数理計算上の損失をその他の包括利益累計額(AOCI)に計上している。当期に純損失のうち$4,000が期間年金費用の構成要素として償却され、割引率の変更により新たに数理計算上の利益$10,000が発生した。税効果を無視した場合、これらの項目が当期のOCIに与える純影響はいくらか。",
      c: ["$14,000 increase", "$6,000 increase", "$10,000 increase", "$4,000 decrease"],
      a: 0,
      ex: "当期発生の数理計算上の利益+10,000に加え、損失の償却額4,000はAOCIから純利益への組替調整(AOCIの損失残高を減らす)としてOCIを増加させる。合計+14,000。償却を減算した$6,000は方向を誤っている。",
    },
    {
      q: "A company's retained earnings at January 1 were $400,000. During the year: net income was $120,000; cash dividends of $30,000 were declared; a 10% stock dividend with a fair value of $25,000 was distributed; treasury stock costing $15,000 was acquired (cost method); and an error that understated the prior year's net income by $10,000 (net of tax) was discovered. What is retained earnings at December 31 in the statement of changes in equity?",
      ja: "1月1日の利益剰余金は$400,000。当期中に、純利益$120,000、現金配当$30,000の宣言、公正価値$25,000の10%株式配当の交付、原価法による自己株式$15,000の取得、前期純利益を税引後$10,000過少計上していた誤謬の発見があった。株主資本等変動計算書における12月31日の利益剰余金はいくらか。",
      c: ["$475,000", "$500,000", "$460,000", "$465,000"],
      a: 0,
      ex: "期首400,000 + 誤謬修正10,000(期首残高の修正)+ 純利益120,000 − 現金配当30,000 − 株式配当25,000 = 475,000。原価法の自己株式取得は利益剰余金に影響しない($460,000は誤り)。小規模株式配当は公正価値で利益剰余金から振り替える。",
    },
    {
      q: "A company's notes state that its purchases from an entity controlled by the company's CEO were made on terms equivalent to those that prevail in arm's-length transactions. Under ASC 850, such a representation:",
      ja: "会社の注記には、CEOが支配する企業からの仕入は独立第三者間取引と同等の条件で行われたと記載されている。ASC 850上、このような表明はどう扱われるか。",
      c: [
        "Is required for every related party transaction",
        "Is prohibited in all circumstances",
        "Should not be made unless it can be substantiated",
        "Eliminates the need to disclose the dollar amount of the transactions",
      ],
      a: 2,
      ex: "関連当事者取引が独立第三者間取引と同等の条件で行われた旨の表明は、それを立証できる場合に限り記載できる。必須ではなく、記載しても取引金額等の開示は免除されない。",
    },
    {
      q: "Under ASC 850, which of the following related party items is NOT required to be disclosed?",
      ja: "ASC 850において、次の関連当事者項目のうち開示が要求されないものはどれか。",
      c: [
        "Amounts due to or from related parties at the balance sheet date",
        "Compensation arrangements and expense allowances for officers in the ordinary course of business",
        "The nature of the relationship involved in a material related party transaction",
        "Transactions with related parties for which no amounts were recorded",
      ],
      a: 1,
      ex: "通常の営業過程における役員報酬・経費手当等は関連当事者開示の対象外である。期末の債権債務残高、関係の性質、金額が計上されていない(無償の)取引は開示が必要である。",
    },
    {
      q: "Which of the following would most appropriately be included in a company's summary of significant accounting policies?",
      ja: "次のうち、重要な会計方針の要約に含めるのが最も適切なものはどれか。",
      c: [
        "The amount of depreciation expense recognized for the year",
        "The composition of inventories by raw materials, work in process, and finished goods",
        "The maturity schedule of long-term debt for the next five years",
        "The method used to recognize revenue from long-term contracts",
      ],
      a: 3,
      ex: "会計方針の要約には、選択した原則とその適用方法(収益認識方法、減価償却方法、棚卸資産の評価方法等)を記載する。減価償却費の金額、棚卸資産の内訳、債務の満期スケジュールは財務諸表や他の注記で示される数値情報であり、方針の要約に重複させない。",
    },
    {
      q: "A manufacturer purchases 85% of a critical component from a single overseas supplier. Qualifying alternative suppliers exist, but switching would take about 18 months. Under ASC 275, disclosure of this concentration is required if:",
      ja: "製造業者は重要部品の85%を単一の海外仕入先から購入している。代替仕入先は存在するが切替えに約18か月かかる。ASC 275上、この集中の開示が要求されるのはどのような場合か。",
      c: [
        "It is probable that a loss has been incurred and the amount can be reasonably estimated",
        "The concentration exists at the balance sheet date, makes the entity vulnerable to a near-term severe impact, and it is at least reasonably possible that events causing such impact will occur in the near term",
        "The supplier is a related party of the entity",
        "The concentration has existed for more than one year before the balance sheet date",
      ],
      a: 1,
      ex: "集中の開示要件は、(1)財務諸表日に集中が存在し、(2)近い将来に深刻な影響を受けるリスクにさらされ、(3)そのような影響を生じさせる事象が近い将来(1年以内)に発生する可能性が少なくとも合理的に可能(reasonably possible)であること。発生可能性が高い(probable)損失の計上要件(ASC 450)とは異なる。",
    },
    {
      q: "Management identified conditions that raise substantial doubt about the company's ability to continue as a going concern. However, management concluded that its plans, which are probable of being effectively implemented, alleviate the substantial doubt. Which of the following is required in the notes?",
      ja: "経営者は継続企業としての存続能力に重要な疑義を生じさせる状況を識別した。しかし、効果的に実行される可能性が高い経営者の計画により重要な疑義は解消されたと結論付けた。注記で要求されるのはどれか。",
      c: [
        "No disclosure, because the substantial doubt has been alleviated",
        "A statement that there is substantial doubt about the entity's ability to continue as a going concern",
        "Adoption of the liquidation basis of accounting",
        "The principal conditions that raised substantial doubt, management's evaluation of their significance, and management's plans that alleviated the doubt",
      ],
      a: 3,
      ex: "計画により重要な疑義が解消された場合でも、疑義を生じさせた主要な状況、その重要性に関する経営者の評価、疑義を解消した経営者の計画を開示する。「重要な疑義がある」旨の明示的記載は、疑義が解消されない場合に要求される。清算基準は清算が差し迫った場合のみ。",
    },
    {
      q: "At December 31, Year 1, a company accrued a $200,000 litigation liability, its best estimate for a lawsuit filed in Year 1 over a product defect that occurred in Year 1. On February 10, Year 2, before the financial statements were issued, the suit was settled for $260,000. On January 15, Year 2, a fire destroyed a warehouse, causing an uninsured loss of $150,000. What litigation liability should be reported on the December 31, Year 1 balance sheet?",
      ja: "Year 1年12月31日に、会社はYear 1に発生した製品欠陥についてYear 1に提起された訴訟に関し、最善の見積りである訴訟債務$200,000を計上した。財務諸表発行前のYear 2年2月10日、訴訟は$260,000で和解した。Year 2年1月15日には火災で倉庫が焼失し、無保険の損失$150,000が生じた。Year 1年12月31日の貸借対照表に計上すべき訴訟債務はいくらか。",
      c: ["$200,000", "$410,000", "$260,000", "$60,000"],
      a: 2,
      ex: "訴訟の原因は期末前に存在しており、和解は期末の状況に関する追加的証拠を提供する認識される後発事象である。よって債務を$260,000に修正する。期末後の火災は期末後に生じた状況であり、注記のみ(認識しない後発事象)のため$410,000は誤り。",
    },
    {
      q: "A calendar-year company reported net income of $600,000 and had 100,000 weighted-average common shares outstanding for Year 1. On February 10, Year 2, before the Year 1 financial statements were issued, the company effected a 2-for-1 stock split. What basic earnings per share should be reported for Year 1?",
      ja: "暦年決算の会社はYear 1の純利益$600,000、加重平均普通株式数100,000株であった。Year 1の財務諸表発行前のYear 2年2月10日に、1株を2株とする株式分割を実施した。Year 1について報告すべき基本的1株当たり利益はいくらか。",
      c: ["$6.00", "$4.00", "$1.50", "$3.00"],
      a: 3,
      ex: "期末後・財務諸表発行前の株式分割は、表示されるすべての期間の株式数を遡及修正する。600,000 ÷ (100,000 × 2) = $3.00。分割を無視した$6.00は誤り。",
    },
    {
      q: "A private company that is not an SEC filer and not a conduit bond obligor evaluates subsequent events. Which of the following must it disclose?",
      ja: "SEC登録会社でも導管債の債務者でもない非公開会社が後発事象を評価する。次のうち開示しなければならないものはどれか。",
      c: [
        "The date through which subsequent events have been evaluated and whether that date is the date the financial statements were issued or were available to be issued",
        "Nothing about the evaluation period, because only SEC filers must disclose it",
        "Only the date of the auditor's report",
        "The date of the balance sheet and the date of the next annual meeting",
      ],
      a: 0,
      ex: "SEC登録会社以外の企業は、後発事象を評価した日付と、その日が財務諸表の発行日か発行可能日かを開示する。SEC登録会社は発行日まで評価し、この日付の開示は不要である。",
    },
    {
      q: "A company reissues its prior-year financial statements in connection with a filing. Regarding events that occurred after the original issuance but before the reissuance, the company should:",
      ja: "会社は届出に関連して前年度の財務諸表を再発行する。当初発行後から再発行前までに生じた事象について、会社はどうすべきか。",
      c: [
        "Recognize all such events in the reissued financial statements",
        "Not recognize them unless the adjustment is required by GAAP or regulatory requirements, although disclosure may be needed to keep the statements from being misleading",
        "Ignore them entirely, including any disclosure",
        "Restate the original statements as an error correction",
      ],
      a: 1,
      ex: "再発行財務諸表では、当初発行(または発行可能)後に生じた事象は、GAAPまたは規制上要求される場合を除き認識しない。ただし誤解を避けるために注記開示が必要な場合がある。",
    },
    {
      q: "An asset is sold in two active markets. In Market X, the price is $52, transaction costs are $7, and transportation costs to that market are $2. In Market Y, the price is $50, transaction costs are $4, and transportation costs are $2. Market X has the greatest volume and level of activity for the asset. Under ASC 820, what is the asset's fair value?",
      ja: "ある資産は2つの活発な市場で売買されている。市場Xでは価格$52、取引コスト$7、市場までの輸送コスト$2。市場Yでは価格$50、取引コスト$4、輸送コスト$2。市場Xがその資産について取引量・活動水準が最も大きい。ASC 820上、資産の公正価値はいくらか。",
      c: ["$48", "$43", "$50", "$52"],
      a: 2,
      ex: "主要な市場(取引量最大の市場X)の価格を用いる。公正価値 = 52 − 輸送コスト2 = 50。取引コストは公正価値の調整項目ではない(取引コストまで控除した$43は誤り)。主要な市場がある場合、より有利な市場Yは用いない。",
    },
    {
      q: "Using the same facts as a two-market scenario in which Market X quotes $52 with transaction costs of $7 and transportation costs of $2, and Market Y quotes $50 with transaction costs of $4 and transportation costs of $2, assume that neither market is the principal market for the asset. Under ASC 820, what is the asset's fair value?",
      ja: "市場Xは価格$52、取引コスト$7、輸送コスト$2、市場Yは価格$50、取引コスト$4、輸送コスト$2という2市場の状況で、いずれの市場も主要な市場ではないと仮定する。ASC 820上、資産の公正価値はいくらか。",
      c: ["$48", "$44", "$50", "$43"],
      a: 0,
      ex: "主要な市場がない場合、取引コストと輸送コスト控除後の手取額が最大となる最も有利な市場を選ぶ。X:52−7−2=43、Y:50−4−2=44 → 市場Y。公正価値は取引コストを控除しない 50 − 2 = 48。$44は市場選択に使う手取額であり公正価値ではない。",
    },
    {
      q: "A company acquired land in a business combination that it currently uses as the site of a factory. Market participants would convert the land to residential use, which is physically possible, legally permissible (zoning allows it), and financially feasible. The land's value for residential development is $5,000,000 before demolition costs of $300,000 to remove the factory. The value of the land as currently used is $4,200,000. What is the fair value of the land under ASC 820?",
      ja: "会社は企業結合で土地を取得し、現在は工場用地として使用している。市場参加者はこの土地を住宅用に転用すると考えられ、それは物理的に可能、法的に許容(用途地域上可能)、財務的に実行可能である。住宅開発用としての価値は工場の取壊し費用$300,000控除前で$5,000,000、現行用途での価値は$4,200,000である。ASC 820上の土地の公正価値はいくらか。",
      c: ["$4,200,000", "$5,000,000", "$4,500,000", "$4,700,000"],
      a: 3,
      ex: "非金融資産は市場参加者の観点からの最有効使用(highest and best use)で測定し、企業の現在の用途には拘束されない。住宅用 5,000,000 − 取壊し費用300,000 = 4,700,000 > 現行用途4,200,000。取壊し費用を控除しない$5,000,000は誤り。",
    },
    {
      q: "A company measures the fair value of a specialized production machine by estimating the amount that would currently be required to construct a substitute asset of comparable utility, adjusted for physical deterioration and functional and economic obsolescence. Which valuation approach is being used?",
      ja: "会社は特殊な生産機械の公正価値を、同等の効用を持つ代替資産を現在建設するのに必要な金額を見積り、物理的劣化および機能的・経済的陳腐化を調整して測定している。用いている評価アプローチはどれか。",
      c: ["Market approach", "Income approach", "Cost approach", "Residual approach"],
      a: 2,
      ex: "資産の用役能力を置き換えるのに現在必要な金額(現在再調達原価)に基づくのはコスト・アプローチである。マーケット・アプローチは類似取引の価格、インカム・アプローチは将来キャッシュフローの現在価値等に基づく。",
    },
    {
      q: "A company values a derivative using an observable quoted price of the underlying stock (Level 1), observable interest rate curves (Level 2), and an unobservable volatility assumption that is significant to the entire measurement. In which level of the fair value hierarchy should the measurement be categorized?",
      ja: "会社はデリバティブを、原株の観察可能な相場価格(レベル1)、観察可能な金利カーブ(レベル2)、および測定全体にとって重要な観察不能のボラティリティ仮定を用いて評価している。この公正価値測定はヒエラルキーのどのレベルに分類すべきか。",
      c: ["Level 1", "Level 3", "Level 2", "It is split among Levels 1, 2, and 3 in proportion to each input"],
      a: 1,
      ex: "公正価値測定全体は、測定全体にとって重要なインプットのうち最も低いレベルに基づいて分類する。重要な観察不能インプットがあるためレベル3。インプットごとに按分して分類することはしない。",
    },
    {
      q: "When measuring the fair value of a liability under ASC 820, a company should:",
      ja: "ASC 820に基づき負債の公正価値を測定する際、会社はどうすべきか。",
      c: [
        "Assume the liability would be settled with the counterparty at its carrying amount",
        "Exclude the effect of its own credit risk because it is entity-specific",
        "Reflect nonperformance risk, including the entity's own credit risk, and assume it is the same before and after the transfer",
        "Use the amount the entity would need to pay to extinguish the liability immediately, including prepayment penalties",
      ],
      a: 2,
      ex: "負債の公正価値は市場参加者への移転を仮定し、自社の信用リスクを含む不履行リスクを反映する。不履行リスクは移転の前後で同一と仮定する。自社の信用リスクを除外するのは誤りである。",
    },
    {
      q: "A company holds 100,000 shares of a listed company, representing 10% of its outstanding shares. The quoted closing price in the active market is $20 per share. A broker estimates that selling the entire block at once would depress the price to $18 per share. Under ASC 820, the fair value of the holding is:",
      ja: "会社は上場会社の発行済株式の10%にあたる100,000株を保有している。活発な市場での終値は1株$20。ブローカーは一括売却すれば株価が1株$18に下がると見積っている。ASC 820上、この保有株式の公正価値はいくらか。",
      c: ["$1,800,000", "$2,000,000", "$1,900,000", "$200,000"],
      a: 1,
      ex: "レベル1の資産は相場価格 × 数量で測定し、ブロックディスカウント(blockage factor)は認められない。100,000 × 20 = 2,000,000。大量保有による値下がりを反映した$1,800,000は誤り。",
    },
    {
      q: "A company estimates the fair value of a privately held investee by applying enterprise value/EBITDA multiples derived from a group of comparable public companies. Which valuation approach is being used?",
      ja: "会社は非上場の投資先の公正価値を、比較可能な上場会社群から算出したEV/EBITDA倍率を適用して見積っている。用いている評価アプローチはどれか。",
      c: ["Market approach", "Income approach", "Cost approach", "Net realizable value approach"],
      a: 0,
      ex: "同一または比較可能な資産・企業の市場取引から得られる価格や倍率を用いるのはマーケット・アプローチである。DCF法やオプション価格モデルはインカム・アプローチ、再調達原価はコスト・アプローチである。",
    },
    {
      q: "Equipment costing $100,000 was purchased on January 1, Year 1, and depreciated on the straight-line basis over 10 years with no salvage value. On January 1, Year 4, the company determined that the equipment's remaining useful life is 5 years and that it will have a salvage value of $10,000. What depreciation expense should be recognized in Year 4?",
      ja: "Year 1年1月1日に$100,000で取得した設備を、残存価額ゼロ、耐用年数10年の定額法で償却してきた。Year 4年1月1日、残存耐用年数は5年、残存価額は$10,000と判断した。Year 4に計上すべき減価償却費はいくらか。",
      c: ["$14,000", "$11,250", "$12,000", "$10,000"],
      a: 2,
      ex: "見積りの変更は将来に向かって適用する。Year 4期首の帳簿価額 = 100,000 − 30,000 = 70,000。(70,000 − 10,000) ÷ 5 = 12,000。残存価額を無視した$14,000、取得原価から再計算した$11,250((100,000−10,000)÷8)は誤り。",
    },
    {
      q: "A company's December 31, Year 1 ending inventory was overstated by $30,000. The December 31, Year 2 ending inventory was correct. The error was discovered in Year 3, after the Year 2 books were closed. Ignoring income taxes, which entry is required in the Year 3 accounting records?",
      ja: "Year 1年12月31日の期末棚卸高が$30,000過大計上されていた。Year 2年12月31日の期末棚卸高は正しい。この誤りはYear 2の帳簿締切後のYear 3に発見された。税効果を無視した場合、Year 3の会計記録で必要な仕訳はどれか。",
      c: [
        "Debit retained earnings $30,000; credit inventory $30,000",
        "Debit retained earnings $30,000; credit cost of goods sold $30,000",
        "Debit inventory $30,000; credit retained earnings $30,000",
        "No entry is required",
      ],
      a: 3,
      ex: "Year 1の利益は30,000過大、Year 2の利益は同額過小となり、Year 2末で自動的に相殺(counterbalancing)され、利益剰余金も棚卸資産も正しい。帳簿上の修正仕訳は不要だが、比較財務諸表でYear 1・Year 2を表示する場合は修正再表示する。",
    },
    {
      q: "At the end of Year 2, before the books were closed, a company discovered that (1) wages of $8,000 earned in late Year 1 had not been accrued but were paid and expensed in Year 2, and (2) Year 2 ending inventory was understated by $12,000. Reported Year 2 net income before correction was $100,000. Ignoring income taxes, what is corrected Year 2 net income?",
      ja: "Year 2末の帳簿締切前に、会社は(1)Year 1末に発生した賃金$8,000が未払計上されず、Year 2に支払って費用計上されていたこと、(2)Year 2の期末棚卸高が$12,000過少であったことを発見した。修正前のYear 2純利益は$100,000である。税効果を無視した場合、修正後のYear 2純利益はいくらか。",
      c: ["$104,000", "$120,000", "$112,000", "$80,000"],
      a: 1,
      ex: "Year 2の賃金費用にはYear 1分8,000が含まれ過大 → +8,000。期末棚卸高過少は売上原価過大 → +12,000。100,000 + 8,000 + 12,000 = 120,000。賃金を減算した$104,000は誤り(Year 1の利益は8,000過大であり期首利益剰余金を減額修正する)。",
    },
    {
      q: "A company changes its inventory method from FIFO to LIFO for financial reporting. Because the cumulative effect on prior periods cannot be determined, the change is generally accounted for by:",
      ja: "会社は財務報告上の棚卸資産の評価方法をFIFOからLIFOに変更する。過去の期間への累積的影響額を算定できないため、この変更は一般にどのように会計処理されるか。",
      c: [
        "Retrospective application to all periods presented",
        "Reporting the cumulative effect in current-year net income",
        "Applying LIFO prospectively, using the beginning inventory of the year of change as the base-year layer, and disclosing why retrospective application is impracticable",
        "Restating the prior-year statements as an error correction",
      ],
      a: 2,
      ex: "LIFOへの変更は過去のLIFOレイヤーの再構築が実務上不可能なため、変更年度の期首棚卸高をLIFOの基準年度レイヤーとして将来に向かって適用し、遡及適用が実務上不可能な理由を開示する。累積的影響額を当期損益に含める方法は現行GAAPでは認められない。",
    },
    {
      q: "In Year 3, a company discovered that a $50,000 equipment purchase on January 1, Year 1, had been expensed. The equipment has a 5-year life with no salvage value (straight-line). The Year 3 financial statements are presented comparatively with Year 2. Ignoring income taxes, what adjustment should be made to the January 1, Year 2 retained earnings balance?",
      ja: "Year 3に、Year 1年1月1日の設備購入$50,000が費用処理されていたことが判明した。設備の耐用年数は5年、残存価額ゼロ(定額法)。Year 3の財務諸表はYear 2との比較形式で表示される。税効果を無視した場合、Year 2年1月1日の利益剰余金に対する修正額はいくらか。",
      c: ["$50,000 increase", "$40,000 increase", "$30,000 increase", "$10,000 decrease"],
      a: 1,
      ex: "表示される最も古い期間(Year 2)の期首利益剰余金を修正する。Year 1の費用は50,000過大、減価償却費10,000過少 → Year 1末の利益剰余金は40,000過少。Year 2分の減価償却はYear 2の比較財務諸表で修正する($30,000はYear 2末までの累積額)。",
    },
    {
      q: "In the second quarter, a company using LIFO liquidated 1,000 units of a base-year layer costing $10 per unit. Management expects to replace the units before year-end at a cost of $14 per unit. In its second-quarter interim financial statements, cost of goods sold for these units should be:",
      ja: "LIFOを採用する会社は第2四半期に単価$10の基準年度レイヤー1,000個を取り崩した。経営者は年度末までに単価$14でこれを補充する予定である。第2四半期の期中財務諸表で、これらの売上原価はいくらとすべきか。",
      c: ["$10,000", "$4,000", "$24,000", "$14,000"],
      a: 3,
      ex: "期中のLIFOレイヤーの一時的な取崩しで年度末までに補充が見込まれる場合、売上原価は予想再調達原価で計上する。1,000 × 14 = 14,000。差額4,000は負債(LIFO補充引当)として計上し、取崩しによる利益を期中に計上しない。",
    },
    {
      q: "In January, a company paid its $80,000 annual property tax for the calendar year. It also estimates that an annual employee bonus of $120,000 will be paid in December based on full-year performance. What total expense for these two items should be reported in the first-quarter interim income statement?",
      ja: "会社は1月に暦年分の固定資産税$80,000を支払った。また、通期業績に基づく年次従業員賞与$120,000を12月に支払う見込みである。第1四半期の期中損益計算書で、これら2項目について報告すべき費用の合計はいくらか。",
      c: ["$110,000", "$80,000", "$50,000", "$200,000"],
      a: 2,
      ex: "期中報告は年度の不可欠な一部とみなし、複数の期間に便益が及ぶ費用は配分する。固定資産税 80,000 ÷ 4 = 20,000、賞与 120,000 ÷ 4 = 30,000、合計50,000。固定資産税を支払時に全額計上した$110,000は誤り。",
    },
    {
      q: "For the first quarter, a company had pretax income of $200,000 and recorded income tax expense of $50,000 using an estimated annual effective tax rate of 25%. At the end of the second quarter, year-to-date pretax income is $500,000 and the estimated annual effective tax rate is revised to 24%. What income tax expense should be reported for the second quarter?",
      ja: "第1四半期の税引前利益は$200,000で、見積年間実効税率25%により法人税等$50,000を計上した。第2四半期末の累計税引前利益は$500,000、見積年間実効税率は24%に改訂された。第2四半期に報告すべき法人税等はいくらか。",
      c: ["$70,000", "$72,000", "$75,000", "$120,000"],
      a: 0,
      ex: "累計ベースで計算し前四半期までの計上額を控除する。500,000 × 24% = 120,000 − 50,000 = 70,000。第2四半期単独の利益300,000 × 24% = $72,000は、第1四半期分の税率改訂の影響を反映していない。",
    },
    {
      q: "In the first quarter, a company wrote down inventory by $40,000 because of a market price decline that was not expected to be temporary. In the third quarter, market prices recovered, and the inventory's value increased by $50,000. What gain should be recognized in the third quarter?",
      ja: "第1四半期に、会社は一時的ではないと見込まれる市場価格の下落により棚卸資産を$40,000評価減した。第3四半期に市場価格が回復し、棚卸資産の価値が$50,000上昇した。第3四半期に認識すべき利益はいくらか。",
      c: ["$0", "$50,000", "$10,000", "$40,000"],
      a: 3,
      ex: "期中に計上した評価損が同一年度内の後の期中期間に回復した場合、過去に認識した評価損の範囲で利益を認識する。上限は40,000であり、$50,000全額は認識できない。年度をまたぐ回復は認められない。",
    },
    {
      q: "A company has four operating segments with the following revenues (in thousands): Segment A — external $500, intersegment $100; Segment B — external $55, intersegment $30; Segment C — external $120, intersegment $0; Segment D — external $70, intersegment $20. Which segments meet the 10% revenue test under ASC 280?",
      ja: "会社には4つの事業セグメントがあり、収益(千ドル)は次のとおり。A:外部$500・セグメント間$100、B:外部$55・セグメント間$30、C:外部$120・セグメント間$0、D:外部$70・セグメント間$20。ASC 280の10%収益基準を満たすセグメントはどれか。",
      c: ["A and C only", "A, C, and D only", "A, B, C, and D", "A only"],
      a: 1,
      ex: "収益基準はセグメント間収益を含む合計収益で判定する。合計 = 600 + 85 + 120 + 90 = 895、10% = 89.5。A(600)、C(120)、D(90)が該当し、B(85)は該当しない。外部収益のみ(合計745、基準74.5)で判定するとA・Cのみとなり誤り。",
    },
    {
      q: "A company's operating segments reported the following profit (loss) (in thousands): A $300; B $(100); C $40; D $(20); E $30. Which segments meet the 10% profit or loss test under ASC 280?",
      ja: "事業セグメントの損益(千ドル)は次のとおり。A $300、B $(100)、C $40、D $(20)、E $30。ASC 280の10%損益基準を満たすセグメントはどれか。",
      c: ["A and C only", "A, B, C, and E only", "A only", "A, B, and C only"],
      a: 3,
      ex: "利益セグメントの合計370と損失セグメントの合計(絶対値)120のうち大きい370の10% = 37と各セグメント損益の絶対値を比較する。A(300)、B(100)、C(40)が該当。純額250を基準(25)にするとEも含まれるが誤り。",
    },
    {
      q: "Under ASC 280 as amended by ASU 2023-07, which of the following statements is correct for a public entity?",
      ja: "ASU 2023-07による改訂後のASC 280において、公開企業に関して正しい記述はどれか。",
      c: [
        "A public entity with a single reportable segment must provide all disclosures required by ASC 280, including significant segment expenses",
        "Significant segment expenses must be disclosed only in annual financial statements",
        "Significant segment expenses include all expenses of the segment, whether or not they are regularly provided to the chief operating decision maker",
        "An entity may not disclose more than one measure of segment profit or loss",
      ],
      a: 0,
      ex: "ASU 2023-07では、単一の報告セグメントの企業もASC 280の全開示(重要なセグメント費用を含む)を行う。重要なセグメント費用は定期的にCODMに提供されセグメント損益に含まれるものであり、年次だけでなく期中にも開示する。CODMが用いる場合は複数の損益指標の開示も認められる。",
    },
    {
      q: "A public entity's chief operating decision maker (CODM) regularly receives the following for Segment North: revenue $1,000,000; cost of goods sold $550,000; and payroll expense $150,000. Segment North's reported measure of segment profit is $200,000. Under ASU 2023-07, what amount should be disclosed as \"other segment items\" for Segment North?",
      ja: "公開企業の最高経営意思決定者(CODM)はノース・セグメントについて、収益$1,000,000、売上原価$550,000、人件費$150,000を定期的に受け取っている。ノース・セグメントの報告されるセグメント利益は$200,000である。ASU 2023-07上、ノース・セグメントについて「その他のセグメント項目」として開示すべき金額はいくらか。",
      c: ["$100,000", "$300,000", "$250,000", "$0"],
      a: 0,
      ex: "その他のセグメント項目 = セグメント収益 − 重要なセグメント費用 − セグメント損益 = 1,000,000 − 550,000 − 150,000 − 200,000 = 100,000。重要なセグメント費用以外の差額を一括して開示し、その性質を記述する。",
    },
    {
      q: "A company's consolidated revenue is $2,000,000. Sales to a single external customer, made by two of its operating segments, total $220,000. Under ASC 280, the company must disclose:",
      ja: "会社の連結収益は$2,000,000である。2つの事業セグメントを通じた単一の外部顧客への売上は合計$220,000である。ASC 280上、会社が開示しなければならないのはどれか。",
      c: [
        "The identity of the customer and the amount of revenue from it",
        "The fact of the major customer, the total revenue from it, and the segments reporting the revenue, but not the customer's identity",
        "Nothing, because no single segment's sales to the customer reach 10% of consolidated revenue",
        "Only the fact that a concentration exists, without any amounts",
      ],
      a: 1,
      ex: "単一の外部顧客からの収益が連結収益の10%以上(220,000 ≥ 200,000)なら、その事実、収益総額、当該収益を計上するセグメントを開示する。顧客名の開示は不要。判定は企業全体の合計で行い、セグメント別ではない。",
    },
    {
      q: "A company's consolidated external revenue is $2,000,000. The operating segments that meet the 10% quantitative thresholds report total external revenue of $1,380,000. Under ASC 280, what is the minimum amount of additional external revenue that must be represented by additional reportable segments?",
      ja: "会社の連結外部収益は$2,000,000である。10%の量的基準を満たす事業セグメントの外部収益合計は$1,380,000である。ASC 280上、追加の報告セグメントで最低限カバーしなければならない外部収益の額はいくらか。",
      c: ["$120,000", "$0", "$620,000", "$20,000"],
      a: 0,
      ex: "報告セグメントの外部収益は連結収益の75%以上が必要。2,000,000 × 75% = 1,500,000 − 1,380,000 = 120,000。この不足分を満たすまで、基準未満のセグメントを追加で報告セグメントとする。70%で計算した$20,000は誤り。",
    },
    {
      q: "A partnership prepares its financial statements using the income tax basis of accounting. Which titles are most appropriate for its basic financial statements?",
      ja: "パートナーシップは税務基準で財務諸表を作成している。基本財務諸表の名称として最も適切なのはどれか。",
      c: [
        "Balance sheet and income statement",
        "Statement of financial position and statement of comprehensive income",
        "Statement of assets, liabilities, and capital—income tax basis and statement of revenues and expenses—income tax basis",
        "Statement of cash receipts and disbursements only",
      ],
      a: 2,
      ex: "特別目的の枠組みでは、GAAPと誤解されないよう「貸借対照表」「損益計算書」ではなく、「資産・負債・資本計算書—税務基準」「収益・費用計算書—税務基準」のような名称を用いる。現金収支計算書は現金基準の名称である。",
    },
    {
      q: "Under AU-C 800, which of the following is NOT a special purpose framework?",
      ja: "AU-C 800において、次のうち特別目的の枠組みでないものはどれか。",
      c: [
        "The cash basis of accounting",
        "A regulatory basis prescribed by an insurance commission",
        "A contractual basis specified in a loan agreement",
        "International Financial Reporting Standards issued by the IASB",
      ],
      a: 3,
      ex: "特別目的の枠組みには現金基準、税務基準、規制基準、契約基準、その他の基準がある。IASBが公表するIFRSは一般目的の枠組みであり、特別目的の枠組みではない。",
    },
    {
      q: "A small service business uses the modified cash basis. During its first year it collected $300,000 from customers and paid $180,000 in cash, which included $50,000 for equipment purchased on January 1 with a 5-year useful life and no salvage value. Under its modified cash basis, the business capitalizes and depreciates long-lived assets (straight-line). What net income should it report?",
      ja: "小規模なサービス業者は修正現金基準を採用している。初年度に顧客から$300,000を回収し、現金$180,000を支払った。支払には1月1日に購入した設備(耐用年数5年、残存価額ゼロ)の$50,000が含まれる。この修正現金基準では長期資産を資産計上して定額法で償却する。報告すべき純利益はいくらか。",
      c: ["$160,000", "$120,000", "$170,000", "$110,000"],
      a: 0,
      ex: "支出180,000のうち設備50,000は資産計上し、減価償却費10,000(50,000 ÷ 5)を計上する。300,000 − 130,000 − 10,000 = 160,000。純粋な現金基準なら$120,000となるが、修正(実質的裏付けのある修正)により設備は資産計上される。",
    },
    {
      q: "Under FASB Concepts Statement No. 8, Chapter 4, Elements of Financial Statements, an asset is defined as:",
      ja: "FASB概念書第8号第4章「財務諸表の構成要素」において、資産はどのように定義されているか。",
      c: [
        "Probable future economic benefits obtained or controlled by a particular entity as a result of past transactions or events",
        "A present right of an entity to an economic benefit",
        "Any resource the entity owns that has a measurable cost",
        "A resource expected to be converted into cash within one year",
      ],
      a: 1,
      ex: "2021年公表の概念書第8号第4章は資産を「企業の経済的便益に対する現在の権利」と定義した。「過去の取引・事象の結果として特定の企業が取得・支配する発生可能性の高い将来の経済的便益」は旧概念書第6号の定義である。",
    },
    {
      q: "Under FASB Concepts Statement No. 8, Chapter 4, a liability is defined as:",
      ja: "FASB概念書第8号第4章において、負債はどのように定義されているか。",
      c: [
        "Probable future sacrifices of economic benefits arising from present obligations",
        "Any amount the entity expects to pay in the future",
        "The residual interest in the assets after deducting equity",
        "A present obligation of an entity to transfer an economic benefit",
      ],
      a: 3,
      ex: "概念書第8号第4章は負債を「経済的便益を移転する企業の現在の義務」と定義し、旧定義の「発生可能性の高い(probable)」という文言を削除した。残余持分は持分(純資産)の定義である。",
    },
    {
      q: "Financial information about last year's actual sales is used by analysts to evaluate the accuracy of the forecasts they made a year ago. Under the conceptual framework, this information is said to have:",
      ja: "前年の実際の売上に関する財務情報は、アナリストが1年前に行った予測の正確性を評価するために用いられる。概念フレームワーク上、この情報は何を有するといえるか。",
      c: ["Confirmatory value", "Predictive value", "Verifiability", "Timeliness"],
      a: 0,
      ex: "過去の評価についてフィードバックを提供し、それを確認または変更する情報は確認価値(confirmatory value)を持つ。予測価値は将来の結果の予測に用いられる性質であり、両者はいずれも目的適合性の構成要素である。",
    },
    {
      q: "A standard setter decides not to require a new disclosure because the expected benefits to users would not justify the expense of preparing and auditing it. Under the conceptual framework, this decision reflects:",
      ja: "基準設定主体は、利用者が得る便益が作成・監査のコストに見合わないとして、新たな開示を要求しないことを決定した。概念フレームワーク上、この決定は何を反映しているか。",
      c: ["The materiality characteristic", "Conservatism", "The cost constraint", "The going concern assumption"],
      a: 2,
      ex: "有用な財務情報の提供に対する広範な制約はコストであり、情報の便益がコストを正当化するかを判断する。重要性は企業固有の目的適合性の側面であり、基準設定主体の費用対効果の判断とは異なる。",
    },
    {
      q: "FASB Concepts Statement No. 8, Chapter 6, Measurement, identifies which two measurement systems for recognized items?",
      ja: "FASB概念書第8号第6章「測定」が認識項目について示す2つの測定システムはどれか。",
      c: [
        "Historical cost and fair value",
        "Entry price and exit price",
        "Present value and future value",
        "Replacement cost and net realizable value",
      ],
      a: 1,
      ex: "概念書第8号第6章は測定システムを入口価格(entry price:取得原価等)と出口価格(exit price:公正価値等)の2つに整理した。取得原価と公正価値はそれぞれのシステム内の測定属性の例である。",
    },
    {
      q: "At December 31, a company violated a debt covenant on a long-term note, making the note callable by the lender. Before the financial statements were issued, the lender waived its right to demand repayment for 15 months from the balance sheet date, and it is not probable that the company will violate the covenant again within 12 months. How should the note be classified at December 31?",
      ja: "12月31日、会社は長期借入金の財務制限条項に違反し、借入金は貸手の請求により返済を要するものとなった。財務諸表発行前に、貸手は貸借対照表日から15か月間返済を請求する権利を放棄し、また12か月以内に再び違反する可能性は高くない。12月31日に借入金をどのように分類すべきか。",
      c: [
        "Noncurrent liability",
        "Current liability",
        "Current liability, with a note disclosing the waiver",
        "Split equally between current and noncurrent",
      ],
      a: 0,
      ex: "貸手が貸借対照表日から1年(または営業循環期間)を超える期間について返済請求権を放棄し、再違反の可能性が高くない場合、借入金は非流動負債に分類できる。放棄期間が1年以内であれば流動負債となる。",
    },
    {
      q: "A company's accumulated other comprehensive income (AOCI) at January 1 was a $40,000 credit. During the year: foreign currency translation loss $15,000; unrealized holding gain on available-for-sale debt securities arising during the year $9,000; reclassification out of AOCI of a previously recognized holding gain on AFS securities sold during the year $6,000; and net actuarial loss arising during the year $10,000. Ignoring taxes, what is AOCI at December 31?",
      ja: "1月1日のその他の包括利益累計額(AOCI)は貸方$40,000。当期に、為替換算損失$15,000、当期に発生したAFS負債証券の未実現保有利益$9,000、当期に売却したAFS証券について以前認識した保有利益$6,000のAOCIからの組替、当期に発生した純数理計算上の損失$10,000があった。税効果を無視した場合、12月31日のAOCIはいくらか。",
      c: ["$24,000 credit", "$30,000 credit", "$18,000 credit", "$8,000 credit"],
      a: 2,
      ex: "40,000 − 15,000 + 9,000 − 6,000 − 10,000 = 18,000(貸方)。売却時の組替調整は過去にOCIで認識した利益を純利益に振り替えるためAOCIを減少させる。組替を無視した$24,000、加算した$30,000は誤り。",
    },
    {
      q: "A company reported net income of $200,000. Before income taxes, it had a foreign currency translation gain of $30,000 and an unrealized holding gain on available-for-sale debt securities of $20,000. The applicable tax rate is 25%. What is comprehensive income?",
      ja: "会社の純利益は$200,000。税効果考慮前で為替換算差益$30,000、AFS負債証券の未実現保有利益$20,000がある。適用税率は25%。包括利益はいくらか。",
      c: ["$200,000", "$250,000", "$212,500", "$237,500"],
      a: 3,
      ex: "OCI(税引後)= (30,000 + 20,000) × (1 − 25%) = 37,500。包括利益 = 200,000 + 37,500 = 237,500。OCIを税引前で加算した$250,000、税額12,500をOCIとした$212,500は誤り。",
    },
    {
      q: "Under ASC 220, which of the following presentations of comprehensive income is NOT permitted?",
      ja: "ASC 220において、包括利益の表示方法として認められないものはどれか。",
      c: [
        "A single continuous statement of comprehensive income",
        "Reporting components of other comprehensive income only in the statement of changes in stockholders' equity",
        "Two separate but consecutive statements: an income statement followed by a statement of comprehensive income",
        "Presenting OCI components net of related tax effects with tax disclosed in the notes",
      ],
      a: 1,
      ex: "包括利益は単一の連続した計算書、または損益計算書に続く2つの連続した計算書で表示しなければならない。OCIの構成要素を株主資本等変動計算書のみで表示する方法はASU 2011-05で廃止された。税効果は税引後表示と注記の組合せも可能である。",
    },
    {
      q: "At December 31, a company reports: accounts payable $80,000; cash dividends declared, payable January 20, $20,000; a stock dividend distributable $15,000; customer deposits refundable on demand $10,000; bonds payable due in three years $100,000; and the current portion of long-term debt $25,000. What amount should be reported as total current liabilities?",
      ja: "12月31日の残高は次のとおり。買掛金$80,000、1月20日支払予定の宣言済現金配当$20,000、交付予定の株式配当$15,000、要求払いで返金される顧客預り金$10,000、3年後満期の社債$100,000、長期債務の1年以内返済部分$25,000。流動負債合計はいくらか。",
      c: ["$135,000", "$150,000", "$235,000", "$110,000"],
      a: 0,
      ex: "80,000 + 20,000 + 10,000 + 25,000 = 135,000。交付予定の株式配当は資産の流出を伴わないため負債ではなく株主資本に表示する($150,000は誤り)。3年後満期の社債は非流動負債である。",
    },
    {
      q: "A company restated its prior-year financial statements to correct a material error. Which of the following is NOT required?",
      ja: "会社は重要な誤謬を訂正するため前年度の財務諸表を修正再表示した。次のうち要求されないものはどれか。",
      c: [
        "Disclosure that previously issued financial statements have been restated and a description of the nature of the error",
        "Disclosure of the effect of the correction on each financial statement line item and any per-share amounts affected for each prior period presented",
        "Disclosure of the cumulative effect of the change on retained earnings as of the beginning of the earliest period presented",
        "Repetition of the restatement disclosures in the financial statements of all subsequent periods",
      ],
      a: 3,
      ex: "誤謬の修正再表示時には、修正再表示の事実と誤謬の性質、各表示期間の項目別・1株当たり影響額、最も古い表示期間の期首利益剰余金への累積的影響を開示する。以後の期間の財務諸表でこれらの開示を繰り返す必要はない。",
    },
    {
      q: "A company voluntarily changes from one generally accepted accounting principle to another. Which of the following is required under ASC 250?",
      ja: "会社は一般に公正妥当と認められた会計原則の1つから別の原則へ任意に変更する。ASC 250上、要求されるのはどれか。",
      c: [
        "Approval of the change by the company's external auditor before adoption",
        "Recognition of the cumulative effect of the change in current-period net income",
        "Justification that the newly adopted principle is preferable, disclosed with the nature of and reason for the change",
        "Prospective application with no disclosure",
      ],
      a: 2,
      ex: "任意の会計原則の変更は、新原則がより望ましい(preferable)ことを正当化でき、変更の性質と理由を開示する場合にのみ認められ、原則として遡及適用する。監査人の事前承認は会計基準上の要件ではなく、累積的影響額の当期損益計上は認められない。",
    },
    {
      q: "On July 1, Year 1, a company paid $24,000 for a two-year insurance policy and charged the entire amount to insurance expense. The error was discovered on December 31, Year 2, before the Year 2 books were closed; no insurance entries had been made in Year 2. Ignoring income taxes, what amount should be credited to retained earnings in the correcting entry?",
      ja: "Year 1年7月1日、会社は2年間の保険料$24,000を支払い、全額を保険料費用に計上した。この誤りはYear 2の帳簿締切前のYear 2年12月31日に発見された。Year 2には保険関連の仕訳は行われていない。税効果を無視した場合、修正仕訳で利益剰余金に貸記する金額はいくらか。",
      c: ["$18,000", "$24,000", "$12,000", "$6,000"],
      a: 0,
      ex: "Year 1の正しい費用は6,000(6か月分)であり、Year 1の利益は18,000過少。修正仕訳:借方 前払保険料6,000・保険料費用12,000(Year 2分)/貸方 利益剰余金18,000。$24,000は支払総額であり誤り。",
    },
    {
      q: "For recurring fair value measurements categorized within Level 3 of the hierarchy, which of the following disclosures is required for a public business entity but is NOT required for Level 1 measurements?",
      ja: "ヒエラルキーのレベル3に分類される経常的な公正価値測定について、公開営利企業に要求されるがレベル1の測定には要求されない開示はどれか。",
      c: [
        "The fair value measurement at the reporting date",
        "A reconciliation of the opening balances to the closing balances, showing gains and losses, purchases, sales, issues, settlements, and transfers",
        "The level of the hierarchy in which the measurements are categorized",
        "The class of assets or liabilities measured",
      ],
      a: 1,
      ex: "経常的なレベル3測定には期首から期末残高への調整表(ロールフォワード)の開示が要求される(非公開企業は簡素化あり)。報告日の公正価値、ヒエラルキーのレベル、資産・負債のクラスはすべてのレベルで開示する。",
    },
    {
      q: "A company's year ends December 31, and its financial statements are issued March 1. Which of the following events occurring in February requires disclosure but NOT adjustment of the year-end financial statements?",
      ja: "会社の決算日は12月31日、財務諸表の発行日は3月1日である。2月に生じた次の事象のうち、注記は必要だが期末財務諸表の修正は要しないものはどれか。",
      c: [
        "Settlement of a lawsuit for an injury that occurred in November",
        "Receipt of information that a customer was insolvent at year-end because of losses incurred over the prior year",
        "Sale in February of inventory on hand at year-end at a price below cost, reflecting conditions that existed at year-end",
        "A significant decline in the market value of equity securities held, caused by a market drop in February",
      ],
      a: 3,
      ex: "期末後の市場価格の下落は期末後に生じた状況であり、認識しない後発事象(注記のみ)である。期末前に原因がある訴訟の和解、期末時点の顧客の支払不能、期末状況を反映した原価割れ販売は、期末の状況の証拠を提供するため修正を要する。",
    },
    {
      q: "A retailer earns about 60% of its annual revenue in the fourth quarter. In its first-quarter interim financial statements, the retailer should:",
      ja: "小売業者は年間収益の約60%を第4四半期に稼得している。第1四半期の期中財務諸表で、この小売業者はどうすべきか。",
      c: [
        "Recognize one-fourth of estimated annual revenue each quarter",
        "Defer first-quarter costs to the fourth quarter to match the seasonal revenue",
        "Recognize revenue as earned on the same basis as for the annual period and disclose the seasonal nature of its activities",
        "Present interim results only on a twelve-month trailing basis",
      ],
      a: 2,
      ex: "期中の収益は年度と同じ基準で稼得時に認識し、季節変動を平準化しない。季節性の高い事業は、期中結果が年間結果を示唆しないよう季節的性質を開示する(12か月累計情報の補足開示が推奨される)。",
    },
    {
      q: "In Year 1, a company purchased an available-for-sale debt security for $50,000. Its fair value was $58,000 at December 31, Year 1. In Year 2, the company sold the security for $61,000. Ignoring income taxes, what is the net effect on other comprehensive income in Year 2?",
      ja: "Year 1に、会社は売却可能(AFS)負債証券を$50,000で購入した。Year 1年12月31日の公正価値は$58,000であった。Year 2に$61,000で売却した。税効果を無視した場合、Year 2のOCIに対する純影響はいくらか。",
      c: ["$8,000 decrease", "$3,000 increase", "$5,000 decrease", "$11,000 increase"],
      a: 0,
      ex: "Year 1末のAOCIは+8,000。Year 2の売却までの保有利益+3,000をOCIに計上してAOCIは11,000となり、売却時に全額11,000を純利益(実現利益11,000)へ組替える。OCI純影響 = 3,000 − 11,000 = −8,000。組替額を前期末残高8,000のみとした$5,000の減少は誤り。",
    },
    {
      q: "A company recognized a deferred tax asset related to a warranty liability that is expected to reverse within six months after the balance sheet date. Under current U.S. GAAP, how should the deferred tax asset be classified in a classified balance sheet?",
      ja: "会社は貸借対照表日後6か月以内に解消が見込まれる製品保証負債に係る繰延税金資産を計上した。現行の米国GAAPにおいて、分類貸借対照表上この繰延税金資産はどのように分類すべきか。",
      c: [
        "Current asset, because it reverses within one year",
        "Current or noncurrent based on the classification of the related warranty liability",
        "Netted against income taxes payable as a current item",
        "Noncurrent",
      ],
      a: 3,
      ex: "ASU 2015-17により、繰延税金資産・負債はすべて非流動に分類する(同一納税主体・同一税務管轄内では相殺して表示)。関連する資産・負債の分類や解消時期に基づく流動・非流動の区分は廃止された。",
    },
    {
      q: "A parent provides accounting and administrative services to its wholly owned subsidiary at no charge, and the subsidiary records no expense for these services. In the subsidiary's separately issued financial statements:",
      ja: "親会社は完全子会社に経理・管理サービスを無償で提供しており、子会社はこれらのサービスについて費用を計上していない。子会社が個別に発行する財務諸表ではどうすべきか。",
      c: [
        "No disclosure is necessary because no amounts were recorded",
        "The arrangement should be disclosed as a related party transaction even though no amount was recorded",
        "The subsidiary must record the services at fair value as a capital contribution and no disclosure is required",
        "Disclosure is required only if the parent is a public company",
      ],
      a: 1,
      ex: "ASC 850では、金額が計上されていない、または名目的な金額の関連当事者取引も開示対象である。関係の性質、取引の内容等を開示する。親会社が公開企業かどうかは関係ない。",
    },
    {
      q: "Two independent and knowledgeable observers examine a company's inventory count and costing records and reach the same conclusion that the reported inventory amount is faithfully represented. Which enhancing qualitative characteristic does this demonstrate?",
      ja: "知識のある2人の独立した観察者が会社の棚卸記録と原価計算を調べ、報告された棚卸資産の金額は忠実に表現されているという同じ結論に達した。これはどの補強的質的特性を示しているか。",
      c: ["Comparability", "Understandability", "Verifiability", "Timeliness"],
      a: 2,
      ex: "検証可能性(verifiability)とは、知識のある独立した観察者が、ある描写が忠実な表現であることについて(必ずしも完全一致でなくとも)合意に達し得ることをいう。比較可能性は企業間・期間間の類似点と相違点を識別できる性質である。",
    },
  ],
});

CPA.tbs({ id: "TBS-FAR-13", section: "FAR", chapter: "FAR-01", title: "後発事象(認識される事象と認識されない事象)",
  scenario: `<p>Kato Corp.'s fiscal year ends December 31, Year 1. Its financial statements will be issued on March 5, Year 2. The following events occurred between December 31, Year 1 and March 5, Year 2:</p>
<table><tr><th>Date</th><th>Event</th></tr>
<tr><td>Jan 25</td><td>A lawsuit for an injury that occurred in October Year 1 was settled for $180,000. At December 31, Year 1, Kato had accrued $120,000 as its best estimate.</td></tr>
<tr><td>Feb 3</td><td>A customer owing $90,000 at December 31, Year 1 filed for bankruptcy because of a deteriorating financial condition that existed at year-end. Kato expects to recover 20% of the balance. No allowance had been provided for this customer.</td></tr>
<tr><td>Feb 14</td><td>A fire destroyed a warehouse, causing an uninsured loss of $250,000.</td></tr>
<tr><td>Feb 20</td><td>Kato issued $2,000,000 of 10-year bonds.</td></tr></table>
<p class="ja">Kato社の決算日はYear 1年12月31日、財務諸表の発行日はYear 2年3月5日である。1月25日:Year 1年10月に発生した傷害事故の訴訟が$180,000で和解した(期末に最善の見積りとして$120,000を計上済み)。2月3日:期末に$90,000の債務があった顧客が、期末に既に存在した財務状況の悪化により破産申請した。回収見込みは20%で、この顧客に対する引当は未計上。2月14日:火災により倉庫が焼失し、無保険の損失$250,000が生じた。2月20日:10年満期の社債$2,000,000を発行した。</p>`,
  rows: [
    { label: "Litigation liability reported at December 31, Year 1(期末に計上すべき訴訟債務)", type: "num", answer: 180000 },
    { label: "Additional litigation loss recognized in Year 1(Year 1に追加計上する訴訟損失)", type: "num", answer: 60000 },
    { label: "Treatment of the customer bankruptcy(顧客破産の取扱い)", type: "select", options: ["Recognized (adjust the financial statements)", "Nonrecognized (disclose only)", "No adjustment or disclosure"], answer: "Recognized (adjust the financial statements)" },
    { label: "Additional credit loss recognized in Year 1(Year 1に追加計上する信用損失)", type: "num", answer: 72000 },
    { label: "Treatment of the warehouse fire(倉庫火災の取扱い)", type: "select", options: ["Recognized (adjust the financial statements)", "Nonrecognized (disclose only)", "No adjustment or disclosure"], answer: "Nonrecognized (disclose only)" },
    { label: "Treatment of the bond issuance(社債発行の取扱い)", type: "select", options: ["Recognized (adjust the financial statements)", "Nonrecognized (disclose only)", "No adjustment or disclosure"], answer: "Nonrecognized (disclose only)" },
  ],
  explain: `<p>期末日に存在した状況について追加的証拠を提供する事象は「認識される後発事象」として期末の財務諸表を修正し、期末後に生じた状況による事象は「認識されない後発事象」として重要なものを注記する。</p>
<p>訴訟:事故は期末前に発生 → 修正。債務 = 180,000、追加損失 = 180,000 − 120,000 = 60,000。</p>
<p>顧客破産:原因は期末に存在 → 修正。信用損失 = 90,000 × (1 − 20%) = 72,000。</p>
<p>火災・社債発行:期末後に生じた事象 → 修正せず注記のみ(火災損失$250,000はYear 2の損失)。</p>`,
});

CPA.tbs({ id: "TBS-FAR-14", section: "FAR", chapter: "FAR-01", title: "公正価値測定(主要な市場・最有効使用・ヒエラルキー)",
  scenario: `<p>Nara Co. holds 1,000 units of a commodity that trades in three active markets (per-unit data):</p>
<table><tr><th>Market</th><th>Price</th><th>Transaction costs</th><th>Transportation costs</th><th>Share of total volume</th></tr>
<tr><td>Market 1</td><td>$100</td><td>$6</td><td>$3</td><td>40%</td></tr>
<tr><td>Market 2</td><td>$104</td><td>$12</td><td>$4</td><td>25%</td></tr>
<tr><td>Market 3</td><td>$101</td><td>$4</td><td>$5</td><td>35%</td></tr></table>
<p>Nara also owns a parcel of land currently used as a parking lot, valued at $800,000 in its current use. Market participants would develop the land for residential use, which is physically possible, legally permissible, and financially feasible; the land would be worth $1,100,000 for residential use, less conversion costs of $150,000.</p>
<p>Nara also holds (a) listed shares with a quoted price in an active market, (b) a corporate bond valued using quoted prices for similar bonds in active markets, and (c) a private equity investment valued using a discounted cash flow model based on Nara's own projections.</p>
<p class="ja">Nara社は3つの活発な市場で取引される商品を1,000単位保有している(上表は1単位当たりのデータ)。また、現在駐車場として使用している土地(現行用途での価値$800,000)を保有する。市場参加者はこの土地を住宅用に開発すると考えられ(物理的に可能・法的に許容・財務的に実行可能)、住宅用の価値は$1,100,000、転用費用は$150,000である。さらに、(a)活発な市場で相場価格のある上場株式、(b)活発な市場における類似社債の相場価格で評価する社債、(c)自社の予測に基づくDCFモデルで評価する未公開株式投資を保有している。</p>`,
  rows: [
    { label: "Fair value of the 1,000 units, assuming the market with the greatest volume is the principal market(取引量最大の市場が主要な市場である場合の1,000単位の公正価値)", type: "num", answer: 97000 },
    { label: "Fair value of the 1,000 units, assuming there is no principal market(主要な市場がない場合の1,000単位の公正価値)", type: "num", answer: 96000 },
    { label: "Fair value of the land(土地の公正価値)", type: "num", answer: 950000 },
    { label: "Hierarchy level — listed shares(上場株式のレベル)", type: "select", options: ["Level 1", "Level 2", "Level 3"], answer: "Level 1" },
    { label: "Hierarchy level — corporate bond(社債のレベル)", type: "select", options: ["Level 1", "Level 2", "Level 3"], answer: "Level 2" },
    { label: "Hierarchy level — private equity investment(未公開株式投資のレベル)", type: "select", options: ["Level 1", "Level 2", "Level 3"], answer: "Level 3" },
  ],
  explain: `<p>主要な市場:取引量が最大の市場1(40%)。公正価値は輸送コストのみ控除し取引コストは控除しない:(100 − 3) × 1,000 = 97,000。</p>
<p>主要な市場がない場合は最も有利な市場を手取額(価格 − 取引コスト − 輸送コスト)で選ぶ:市場1 = 91、市場2 = 88、市場3 = 92 → 市場3。公正価値 = (101 − 5) × 1,000 = 96,000。</p>
<p>土地:最有効使用は住宅用 1,100,000 − 150,000 = 950,000 > 現行用途800,000。</p>
<p>レベル:活発な市場の同一資産の相場価格 = レベル1、類似資産の相場価格 = レベル2、企業自身の予測など重要な観察不能インプット = レベル3。</p>`,
});

CPA.tbs({ id: "TBS-FAR-15", section: "FAR", chapter: "FAR-01", title: "多段階損益計算書と包括利益",
  scenario: `<p>Sato Inc. reports the following for the year. The income tax rate is 25% on all items, including OCI items.</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Net sales</td><td>$2,400,000</td></tr>
<tr><td>Cost of goods sold</td><td>1,440,000</td></tr>
<tr><td>Selling expenses</td><td>250,000</td></tr>
<tr><td>General and administrative expenses</td><td>210,000</td></tr>
<tr><td>Interest expense</td><td>40,000</td></tr>
<tr><td>Dividend income</td><td>10,000</td></tr>
<tr><td>Realized gain on sale of available-for-sale debt securities</td><td>20,000</td></tr>
<tr><td>Unrealized gain on equity securities with readily determinable fair values</td><td>12,000</td></tr>
<tr><td>Unrealized holding gain on AFS debt securities arising during the year</td><td>60,000</td></tr>
<tr><td>Foreign currency translation loss</td><td>16,000</td></tr></table>
<p>The $20,000 realized gain had previously been recognized in accumulated other comprehensive income (AOCI). AOCI at January 1 was a $50,000 credit (net of tax).</p>
<p class="ja">Sato社の当期データは上表のとおり。税率はOCI項目を含むすべての項目に25%を適用する。実現したAFS証券売却益$20,000は、以前にその他の包括利益累計額(AOCI)に計上されていたものである。1月1日のAOCIは貸方$50,000(税引後)。</p>`,
  rows: [
    { label: "Gross profit(売上総利益)", type: "num", answer: 960000 },
    { label: "Income from operations(営業利益)", type: "num", answer: 500000 },
    { label: "Net income(純利益)", type: "num", answer: 376500 },
    { label: "Other comprehensive income, net of tax(税引後その他の包括利益)", type: "num", answer: 18000 },
    { label: "Comprehensive income(包括利益)", type: "num", answer: 394500 },
    { label: "AOCI at December 31 (credit)(12月31日のAOCI・貸方)", type: "num", answer: 68000 },
  ],
  explain: `<p>売上総利益 = 2,400,000 − 1,440,000 = 960,000。営業利益 = 960,000 − 250,000 − 210,000 = 500,000。</p>
<p>税引前利益 = 500,000 − 40,000 + 10,000 + 20,000 + 12,000 = 502,000。純利益 = 502,000 × 75% = 376,500(持分証券の評価益は純利益に含める)。</p>
<p>OCI(税引前)= 60,000 − 組替調整20,000 − 換算損失16,000 = 24,000、税引後 = 18,000。包括利益 = 376,500 + 18,000 = 394,500。</p>
<p>期末AOCI = 50,000 + 18,000 = 68,000(貸方)。</p>`,
});
