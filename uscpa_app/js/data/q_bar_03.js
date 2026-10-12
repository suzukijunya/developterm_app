// BAR の追加問題(意思決定・価格設定・振替価格・業績評価・資本予算・資本コスト・企業価値評価・運転資本・ERM・財務リスク)

CPA.extend("BAR-01", {
  mcq: [
    {
      q: "A company has capacity to produce 50,000 units per year and currently sells 46,000 units at $60 each. Variable cost is $35 per unit, including $3 of variable selling cost. A customer offers to buy 8,000 units at $45 each on an all-or-nothing basis; no variable selling cost would be incurred on this order. If the company accepts, by how much will operating income change?",
      ja: "ある会社の年間生産能力は50,000個で、現在46,000個を1個$60で販売している。変動費は1個$35で、うち$3は変動販売費である。顧客が8,000個を1個$45で一括(全量か否か)購入したいと申し出た。この注文には変動販売費は発生しない。注文を受けた場合、営業利益はいくら変化するか。",
      c: ["$104,000 increase", "$4,000 increase", "$20,000 decrease", "$80,000 increase"],
      a: 1,
      ex: "特別注文の貢献利益 = 8,000 × (45 − 32) = 104,000。遊休能力は4,000個しかないため通常販売4,000個を失い、逸失貢献利益は4,000 × (60 − 35) = 100,000。差引$4,000の増加である。$104,000は通常販売の喪失(機会原価)を無視した誤り。",
    },
    {
      q: "A company makes 20,000 units of a part per year at the following unit costs: direct materials $8, direct labor $6, variable overhead $4, and fixed overhead $10. Forty percent of the fixed overhead would be eliminated if the part were purchased. An outside supplier offers the part for $24 per unit. If the part is purchased, the freed space could be rented for $30,000 per year. Which option is better, and by how much?",
      ja: "ある会社は部品を年20,000個自製しており、単位原価は直接材料費$8、直接労務費$6、変動製造間接費$4、固定製造間接費$10である。購入に切り替えると固定製造間接費の40%が削減される。外部業者は1個$24で供給すると提案している。購入した場合、空いたスペースを年$30,000で賃貸できる。どちらが有利で、その差額はいくらか。",
      c: ["Buy; saves $80,000", "Make; saves $40,000", "Buy; saves $20,000", "Make; saves $10,000"],
      a: 3,
      ex: "自製の関連原価 = (8 + 6 + 4 + 10 × 40%) × 20,000 = 440,000に、賃貸収入の機会原価30,000を加えて470,000。購入原価は24 × 20,000 = 480,000なので、自製が$10,000有利。$40,000は機会原価を無視、$80,000は削減できない固定費まで含めた全部原価(28)で比較した誤り。",
    },
    {
      q: "A product line reports sales of $400,000, variable costs of $260,000, and fixed costs of $180,000, of which $90,000 are allocated corporate costs that would continue if the line were dropped. Management estimates that dropping the line would also reduce the contribution margin of a complementary product line by $25,000. What is the effect on company operating income of dropping the line?",
      ja: "ある製品ラインの売上高は$400,000、変動費は$260,000、固定費は$180,000で、うち$90,000はラインを廃止しても存続する本社共通費の配賦額である。また、廃止すると補完関係にある別製品ラインの貢献利益が$25,000減少すると見積もられている。このラインを廃止した場合、全社の営業利益への影響はいくらか。",
      c: ["$40,000 increase", "$50,000 decrease", "$75,000 decrease", "$15,000 increase"],
      a: 2,
      ex: "廃止により貢献利益140,000(400,000 − 260,000)と補完製品の貢献利益25,000を失い、回避可能固定費90,000のみ節約できる。影響 = −140,000 − 25,000 + 90,000 = −75,000。$40,000の増加は配賦共通費を含む報告上の損失をそのまま回避できると誤解したもの。",
    },
    {
      q: "Machine hours are limited to 12,000 per year. Data: Product A — contribution margin $24 per unit, 2 machine hours per unit, maximum demand 3,000 units; Product B — $30 per unit, 3 hours, demand 2,000 units; Product C — $21 per unit, 1.5 hours, demand 4,000 units. What is the maximum total contribution margin?",
      ja: "機械時間は年12,000時間に制約されている。製品A:単位貢献利益$24、1個当たり2機械時間、最大需要3,000個。製品B:$30、3時間、需要2,000個。製品C:$21、1.5時間、需要4,000個。最大の貢献利益合計はいくらか。",
      c: ["$156,000", "$132,000", "$168,000", "$144,000"],
      a: 0,
      ex: "制約資源1時間当たり貢献利益はC $14、A $12、B $10。Cを4,000個(6,000時間)、Aを3,000個(6,000時間)生産し、4,000 × 21 + 3,000 × 24 = 156,000。$132,000は単位当たり貢献利益の大きいB→Aの順で配分した誤り、$168,000は需要上限を無視して全時間をCに充てた誤りである。",
    },
    {
      q: "At the split-off point, 10,000 units of a joint product can be sold for $12 per unit. Alternatively, the units can be processed further at an incremental cost of $50,000 of fixed costs plus $2 per unit and then sold for $20 per unit. The joint cost allocated to the product is $8 per unit. What should the company do?",
      ja: "連産品10,000個は分離点で1個$12で販売できる。あるいは、追加の固定費$50,000と1個当たり$2の追加原価をかけて追加加工し、1個$20で販売することもできる。この製品への結合原価配賦額は1個$8である。会社はどうすべきか。",
      c: [
        "Process further; operating income increases by $30,000",
        "Sell at split-off; processing further decreases operating income by $70,000",
        "Process further; operating income increases by $10,000",
        "Process further; operating income increases by $60,000",
      ],
      a: 2,
      ex: "増分収益 = (20 − 12) × 10,000 = 80,000、増分原価 = 50,000 + 2 × 10,000 = 70,000で、追加加工により$10,000増益。結合原価は分離点以前に発生する埋没原価で判断に無関係。$30,000は変動加工費、$60,000は追加の固定費を見落とした誤り。",
    },
    {
      q: "A company is considering replacing an old machine with a book value of $60,000 that can be sold today for $15,000. A new machine costs $90,000 and would reduce cash operating costs by $25,000 per year over its 4-year life. Neither machine will have salvage value at the end of 4 years. Ignoring income taxes and the time value of money, what is the net advantage (disadvantage) of replacing the old machine over the 4 years?",
      ja: "簿価$60,000で現在$15,000で売却できる旧機械を取り替えるか検討している。新機械は$90,000で、耐用年数4年間にわたり現金営業費を年$25,000削減する。4年後にはどちらの機械も残存価額はない。税金と貨幣の時間価値を無視した場合、4年間での取替えの純利得(損失)はいくらか。",
      c: ["$25,000", "$(35,000)", "$10,000", "$40,000"],
      a: 0,
      ex: "関連項目は費用削減25,000 × 4 = 100,000、新機械の取得90,000、旧機械の売却収入15,000で、100,000 − 90,000 + 15,000 = 25,000の有利。旧機械の簿価60,000は埋没原価であり、差し引いた$(35,000)は誤り。",
    },
    {
      q: "A company with sufficient idle capacity receives a one-time order for 2,000 units. The normal variable manufacturing cost is $22 per unit, and the order requires special packaging costing $1.50 per unit and a one-time setup of $6,000. Fixed manufacturing overhead is allocated at $8 per unit. What is the minimum price per unit the company should accept?",
      ja: "十分な遊休能力のある会社が2,000個の1回限りの注文を受けた。通常の変動製造原価は1個$22で、この注文には1個$1.50の特別包装費と1回限りの段取費$6,000が必要である。固定製造間接費は1個$8で配賦されている。受け入れるべき最低単価はいくらか。",
      c: ["$23.50", "$34.50", "$26.50", "$22.00"],
      a: 2,
      ex: "増分原価 = 22 + 1.50 + 6,000 ÷ 2,000 = 26.50。遊休能力があるため固定製造間接費の配賦額$8は増分原価ではなく、含めた$34.50は誤り。$23.50は注文固有の段取費を見落としている。",
    },
    {
      q: "A company operating below capacity is evaluating a one-time special order that will not affect regular sales. Which of the following costs is irrelevant to the decision?",
      ja: "生産能力に余裕のある会社が、通常販売に影響しない1回限りの特別注文を検討している。次のうち、意思決定に無関係な原価はどれか。",
      c: [
        "Direct materials that must be purchased for the order",
        "Fixed manufacturing overhead allocated to the units in the order",
        "A shipping charge the company will pay on the order",
        "Overtime premium for workers needed to complete the order on time",
      ],
      a: 1,
      ex: "遊休能力がある場合、既存の固定製造間接費は注文の有無で変わらないため、その配賦額は無関係である。追加の材料費、運送費、残業割増はいずれも注文により発生する増分原価である。",
    },
    {
      q: "A product has variable cost of $40 per unit and fixed costs of $200,000 at a normal volume of 10,000 units. The company sets prices using a 30% markup on full cost. What markup percentage on variable cost would produce the same selling price?",
      ja: "ある製品の変動費は1個$40、正常操業度10,000個における固定費は$200,000である。会社は全部原価に30%のマークアップを加えて価格を設定している。同じ販売価格となる変動費基準のマークアップ率は何%か。",
      c: ["30%", "50%", "65%", "95%"],
      a: 3,
      ex: "全部原価 = 40 + 200,000 ÷ 10,000 = 60、価格 = 60 × 1.3 = 78。変動費基準のマークアップ = (78 − 40) ÷ 40 = 95%。50%は単位固定費20を変動費で割っただけの誤りである。",
    },
    {
      q: "Competitors sell a comparable product for $150, which the company must match. The company requires a profit equal to 20% of the selling price. The current estimated cost of the product is $128 per unit. Under target costing, by how much must the unit cost be reduced?",
      ja: "競合他社は同等品を$150で販売しており、会社もこの価格に合わせる必要がある。会社は販売価格の20%の利益を要求している。現在の見積単位原価は$128である。原価企画(ターゲット・コスティング)の下で、単位原価をいくら引き下げる必要があるか。",
      c: ["$8", "$3", "$22", "$30"],
      a: 0,
      ex: "目標原価 = 150 − 150 × 20% = 120で、必要な原価低減額は128 − 120 = 8。$3は利益を原価の20%と誤解し150 ÷ 1.2 = 125を目標原価とした誤り。",
    },
    {
      q: "A company invests $2,000,000 in assets to produce a new product and wants a 15% annual return on that investment. It expects to sell 50,000 units per year. Variable cost is $20 per unit and annual fixed costs are $500,000. What target selling price per unit achieves the desired return?",
      ja: "ある会社は新製品の生産のため資産に$2,000,000を投資し、その投資に対して年15%のリターンを求めている。年間販売見込は50,000個、変動費は1個$20、年間固定費は$500,000である。目標リターンを達成する販売単価はいくらか。",
      c: ["$30.00", "$36.00", "$26.00", "$34.50"],
      a: 1,
      ex: "単位原価 = 20 + 500,000 ÷ 50,000 = 30。要求利益 = 2,000,000 × 15% ÷ 50,000 = 6。価格 = 36。$34.50は投資額ではなく原価に15%を乗じた誤りである。",
    },
    {
      q: "Life-cycle cost management emphasizes the design and development stages of a product primarily because:",
      ja: "ライフサイクル・コスト管理が製品の設計・開発段階を重視する主な理由はどれか。",
      c: [
        "Most of the costs incurred over the life cycle are actually spent during design",
        "Design costs are the only costs that can be capitalized under GAAP",
        "A large percentage of life-cycle costs are committed (locked in) by design decisions, even though they are incurred later",
        "Production costs are fixed and cannot be influenced by management",
      ],
      a: 2,
      ex: "製品のライフサイクル原価の大部分は設計段階の意思決定で事実上確定(コミット)され、実際の支出は製造・販売段階で生じる。支出額自体が設計段階に集中するわけではない。",
    },
    {
      q: "A company is planning a new product with expected life-cycle sales of 25,000 units. Estimated costs: research and development $400,000, design $200,000, production $30 per unit, and marketing and customer service $150,000 plus $5 per unit. Management wants a total life-cycle profit of $250,000. What unit price is required?",
      ja: "ある会社は、ライフサイクル全体で25,000個の販売を見込む新製品を計画している。見積原価は研究開発費$400,000、設計費$200,000、製造費1個$30、マーケティング・顧客サービス費$150,000と1個$5である。経営者はライフサイクル全体で$250,000の利益を望んでいる。必要な販売単価はいくらか。",
      c: ["$65", "$51", "$45", "$75"],
      a: 3,
      ex: "総原価 = 400,000 + 200,000 + 150,000 + 35 × 25,000 = 1,625,000。利益を加えて1,875,000 ÷ 25,000 = 75。$65は目標利益を、$51は上流の研究開発・設計費を除外した誤りである。",
    },
    {
      q: "Which of the following is a major weakness of setting transfer prices at the selling division's full (absorption) cost?",
      ja: "販売事業部の全部原価で振替価格を設定する方法の主な欠点はどれか。",
      c: [
        "The buying division may treat the selling division's fixed costs as variable, which can lead to decisions that are suboptimal for the company",
        "It always produces a transfer price below the selling division's variable cost",
        "It requires the existence of a perfectly competitive external market",
        "It guarantees the selling division a profit on every internal transfer",
      ],
      a: 0,
      ex: "全部原価基準では、販売側の固定費が購入側にとって変動費のように見え、全社的には有利な取引を購入側が拒否するなどの準最適な意思決定を招く。また販売側に利益が出ず原価管理の動機も弱い。",
    },
    {
      q: "Division S can produce 100,000 units per year and currently sells 90,000 units externally at $40 each. Its variable cost is $25 per unit. Division B wants to buy 20,000 units from Division S, all in one lot. What is the minimum transfer price per unit Division S should accept?",
      ja: "S事業部の年間生産能力は100,000個で、現在90,000個を外部に1個$40で販売している。変動費は1個$25である。B事業部はS事業部から20,000個を一括で購入したいと考えている。S事業部が受け入れるべき最低振替価格はいくらか。",
      c: ["$25.00", "$32.50", "$40.00", "$37.50"],
      a: 1,
      ex: "遊休能力は10,000個のため、残り10,000個は外部販売を断念する。機会原価 = 10,000 × (40 − 25) = 150,000を20,000個で割ると7.50。最低振替価格 = 25 + 7.50 = 32.50。$25は能力に完全な余裕がある場合、$40は余裕が全くない場合の値である。",
    },
    {
      q: "The selling division has excess capacity and a variable cost of $45 per unit for a component. The buying division can purchase the same component from an outside supplier for $70 per unit. Within what range should a negotiated transfer price fall so that both divisions are willing to trade?",
      ja: "販売事業部には遊休能力があり、部品の変動費は1個$45である。購入事業部は同じ部品を外部業者から1個$70で購入できる。両事業部が取引に応じる交渉振替価格の範囲はどれか。",
      c: ["Between $0 and $45", "Exactly $70", "Between $45 and $70", "Above $70"],
      a: 2,
      ex: "販売側の下限は変動費45(遊休能力があるため機会原価はゼロ)、購入側の上限は外部購入価格70である。この範囲内の価格であれば両事業部とも利益が増え、全社利益も最大化される。",
    },
    {
      q: "Under a dual transfer pricing system, the selling division is credited with the market price while the buying division is charged the selling division's variable cost. Which of the following is a consequence of this approach?",
      ja: "二重価格制度の下で、販売事業部には市場価格で収益を計上し、購入事業部には販売事業部の変動費で原価を負担させる。この方法の帰結はどれか。",
      c: [
        "The sum of the divisional profits exceeds the company's total profit, and the difference must be eliminated",
        "The buying division has an incentive to purchase externally even when internal transfers benefit the company",
        "The selling division has no incentive to make internal transfers",
        "Divisional profits are identical to what they would be using a market-based transfer price",
      ],
      a: 0,
      ex: "二重価格では両事業部に有利な価格が適用されるため、事業部利益の合計が全社利益を上回り、連結時に消去が必要となる。双方に内部取引の動機を与える一方、原価管理の規律が緩むという欠点がある。",
    },
    {
      q: "Division A has excess capacity and could produce 5,000 units of a component for Division B at a variable cost of $38 per unit. Division B instead purchases the component from an outside supplier at $60 per unit. If the components were transferred internally, what would be the effect on the company's total operating income?",
      ja: "A事業部には遊休能力があり、B事業部向けに部品5,000個を変動費1個$38で生産できる。しかしB事業部は外部業者から1個$60で購入している。部品を社内で振り替えた場合、全社の営業利益への影響はいくらか。",
      c: ["$190,000 increase", "$300,000 increase", "No effect, because the transfer price cancels out", "$110,000 increase"],
      a: 3,
      ex: "全社的には外部支払60を回避し、変動費38のみ発生するため、5,000 × (60 − 38) = 110,000の増益。振替価格自体は社内で相殺されるが、外部への現金支出の差は全社利益に影響する。",
    },
    {
      q: "A division reports sales of $5,000,000, operating income of $400,000, and average operating assets of $2,500,000. If management reduces average operating assets so that asset turnover rises to 2.5 while sales and the profit margin are unchanged, what will the division's ROI be?",
      ja: "ある事業部の売上高は$5,000,000、営業利益は$400,000、平均営業資産は$2,500,000である。売上高と利益率を変えずに平均営業資産を削減し、資産回転率を2.5に高めた場合、事業部のROIはいくらになるか。",
      c: ["16%", "20%", "18%", "10%"],
      a: 1,
      ex: "売上高利益率 = 400,000 ÷ 5,000,000 = 8%。ROI = 利益率 × 回転率 = 8% × 2.5 = 20%。16%は現状のROI(8% × 2.0)である。",
    },
    {
      q: "A division has operating income of $600,000 and average operating assets of $4,000,000. The company's required rate of return is 12%. The division manager is considering a project requiring $500,000 of additional assets that would generate $70,000 of annual operating income. If the project is accepted, what will the division's residual income be?",
      ja: "ある事業部の営業利益は$600,000、平均営業資産は$4,000,000で、会社の要求収益率は12%である。事業部長は追加資産$500,000を要し、年$70,000の営業利益を生むプロジェクトを検討している。採用した場合、事業部の残余利益はいくらになるか。",
      c: ["$120,000", "$10,000", "$130,000", "$70,000"],
      a: 2,
      ex: "採用後の残余利益 = 670,000 − 4,500,000 × 12% = 670,000 − 540,000 = 130,000(現状120,000から10,000増加)。ROIは15%から約14.9%へ低下するため、ROIで評価される管理者は採用を見送る可能性がある。",
    },
    {
      q: "A company reports operating income (EBIT) of $2,000,000, total assets of $10,000,000, and non-interest-bearing current liabilities of $2,000,000. The tax rate is 25%, and the weighted-average cost of capital is 10%. What is the company's economic value added (EVA)?",
      ja: "ある会社の営業利益(EBIT)は$2,000,000、総資産は$10,000,000、無利子の流動負債は$2,000,000である。税率は25%、加重平均資本コストは10%である。経済付加価値(EVA)はいくらか。",
      c: ["$500,000", "$1,200,000", "$1,000,000", "$700,000"],
      a: 3,
      ex: "NOPAT = 2,000,000 × (1 − 25%) = 1,500,000。投下資本 = 10,000,000 − 2,000,000 = 8,000,000。EVA = 1,500,000 − 8,000,000 × 10% = 700,000。$500,000は総資産に資本コストを課した誤り、$1,200,000は税引前利益を用いた誤りである。",
    },
    {
      q: "The manager of a company's European subsidiary is responsible for its revenues and costs and has authority to approve capital expenditures and manage the subsidiary's working capital. This subsidiary is best described as a(n):",
      ja: "ある会社の欧州子会社の責任者は、収益と費用に責任を持ち、設備投資の承認権限と運転資本の管理権限も有している。この子会社はどの責任センターに該当するか。",
      c: ["Cost center", "Revenue center", "Profit center", "Investment center"],
      a: 3,
      ex: "収益・費用に加え投下資産(投資)についても権限と責任を持つため投資センターであり、ROI・残余利益・EVAで評価される。資産の決定権限がなければ利益センターにとどまる。",
    },
    {
      q: "A company measures divisional ROI using the net book value of operating assets. Which behavior is this measurement most likely to encourage among division managers?",
      ja: "ある会社は営業資産の正味簿価を用いて事業部のROIを測定している。この測定方法が事業部長に最も促しやすい行動はどれか。",
      c: [
        "Replacing old, fully depreciated equipment more quickly",
        "Keeping old equipment rather than replacing it, because ROI rises as assets depreciate",
        "Investing in any project with a return above the cost of capital",
        "Reducing accounts payable to lower the asset base",
      ],
      a: 1,
      ex: "正味簿価基準では減価償却が進むほど分母が小さくなりROIが自動的に上昇するため、新設備への取替えを先送りする動機が生じる。総額(取得原価)基準を用いるとこの歪みは緩和される。",
    },
    {
      q: "A profit center reports sales of $900,000, variable costs of $500,000, fixed costs controllable by the manager of $150,000, traceable fixed costs not controllable by the manager of $100,000, and allocated common corporate costs of $80,000. Which amount best measures the manager's performance?",
      ja: "あるプロフィット・センターの売上高は$900,000、変動費は$500,000、管理者が管理可能な固定費は$150,000、個別に跡付け可能だが管理者が管理不能な固定費は$100,000、配賦された全社共通費は$80,000である。管理者の業績を最もよく測る金額はどれか。",
      c: ["$250,000", "$150,000", "$70,000", "$400,000"],
      a: 0,
      ex: "管理者の評価には管理可能利益(貢献利益400,000 − 管理可能固定費150,000 = 250,000)を用いる。$150,000はセグメント・マージンで部門自体の評価に用いる。共通費配賦後の$70,000は管理者評価に不適切である。",
    },
    {
      q: "A company is evaluating equipment costing $200,000 with a 5-year life and no salvage value, depreciated straight-line for tax purposes. The equipment will generate pretax cash operating savings of $60,000 per year. The tax rate is 25%, and the required rate of return is 10% (present value of an ordinary annuity of $1 for 5 years at 10% = 3.791). What is the project's net present value?",
      ja: "ある会社は、取得原価$200,000、耐用年数5年、残存価額ゼロ、税務上定額法で償却する設備を検討している。この設備は年$60,000の税引前現金営業費節約をもたらす。税率は25%、要求収益率は10%である(10%・5年の年金現価係数 = 3.791)。このプロジェクトの正味現在価値はいくらか。",
      c: ["$27,460", "$(29,405)", "$8,505", "$37,910"],
      a: 2,
      ex: "年間税引後キャッシュフロー = 60,000 × (1 − 0.25) + 40,000 × 0.25 = 45,000 + 10,000 = 55,000。NPV = 55,000 × 3.791 − 200,000 = 8,505。$27,460は税金を無視、$(29,405)は減価償却の節税効果を無視した誤りである。",
    },
    {
      q: "A company acquires equipment that will be depreciated at $80,000 per year for 4 years for tax purposes. The tax rate is 21%, and the after-tax discount rate is 8% (present value of an ordinary annuity of $1 for 4 years at 8% = 3.312). What is the present value of the depreciation tax shield?",
      ja: "ある会社は、税務上4年間にわたり毎年$80,000償却する設備を取得する。税率は21%、税引後割引率は8%である(8%・4年の年金現価係数 = 3.312)。減価償却による節税効果の現在価値はいくらか。",
      c: ["$264,960", "$55,642", "$209,318", "$67,200"],
      a: 1,
      ex: "年間節税額 = 80,000 × 21% = 16,800、現在価値 = 16,800 × 3.312 = 55,642。$264,960は償却額そのものの現在価値、$209,318はそれに(1 − 税率)を乗じた誤り、$67,200は割引前の節税額合計である。",
    },
    {
      q: "A new product line requires an investment of $50,000 in inventory and receivables at the start of the project. The working capital will be fully recovered at the end of the project's 6-year life. The discount rate is 12% (present value of $1 at the end of 6 years at 12% = 0.507). What is the net effect of the working capital investment on the project's NPV?",
      ja: "新製品ラインには、プロジェクト開始時に棚卸資産と売掛金へ$50,000の投資が必要である。この運転資本は6年後のプロジェクト終了時に全額回収される。割引率は12%である(12%・6年後の$1の現価係数 = 0.507)。運転資本投資がプロジェクトのNPVに与える正味の影響はいくらか。",
      c: ["$(24,650)", "$(50,000)", "$0", "$25,350"],
      a: 0,
      ex: "期首に50,000の流出、6年後に50,000 × 0.507 = 25,350の流入となるため、正味の影響は−24,650である。回収されるから影響ゼロと考えるのは貨幣の時間価値を無視した誤りである。",
    },
    {
      q: "At the end of a project, equipment with a tax basis of $30,000 is expected to be sold for $45,000. The company's tax rate is 25%. What after-tax cash flow from the sale should be included in the capital budgeting analysis?",
      ja: "プロジェクト終了時に、税務上の簿価$30,000の設備を$45,000で売却する見込みである。税率は25%である。資本予算の分析に含めるべき売却による税引後キャッシュフローはいくらか。",
      c: ["$45,000", "$33,750", "$48,750", "$41,250"],
      a: 3,
      ex: "売却益15,000(45,000 − 30,000)に対する税金3,750を差し引き、45,000 − 3,750 = 41,250。$33,750は売却額全体に課税した誤り、$48,750は税金を加算した誤りである。",
    },
    {
      q: "A project requires an initial investment of $37,910 and will produce after-tax cash inflows of $10,000 at the end of each of the next 5 years. Present value of an ordinary annuity of $1 for 5 years: 8% = 3.993; 10% = 3.791; 12% = 3.605. What is the project's internal rate of return?",
      ja: "あるプロジェクトは初期投資$37,910を要し、今後5年間の各年末に$10,000の税引後キャッシュインフローを生む。5年の年金現価係数:8% = 3.993、10% = 3.791、12% = 3.605。このプロジェクトの内部収益率はいくらか。",
      c: ["8%", "10%", "12%", "26.4%"],
      a: 1,
      ex: "IRRはNPVがゼロとなる割引率であり、年金現価係数 = 37,910 ÷ 10,000 = 3.791となる10%である。26.4%は年間キャッシュフローを投資額で割った単純な利回りで、時間価値を考慮していない。",
    },
    {
      q: "A company has a capital budget of $1,000,000 and must choose among four independent, indivisible projects: A — cost $400,000, NPV $120,000; B — cost $600,000, NPV $150,000; C — cost $500,000, NPV $140,000; D — cost $100,000, NPV $20,000. Which combination should the company select?",
      ja: "ある会社の資本予算は$1,000,000で、互いに独立かつ分割不能な4つのプロジェクトから選択しなければならない。A:投資額$400,000、NPV $120,000。B:$600,000、NPV $150,000。C:$500,000、NPV $140,000。D:$100,000、NPV $20,000。会社はどの組合せを選ぶべきか。",
      c: [
        "A and B; total NPV $270,000",
        "B and C; total NPV $290,000",
        "A and C; total NPV $260,000",
        "A, C, and D; total NPV $280,000",
      ],
      a: 3,
      ex: "資本制約下では予算内で合計NPVを最大化する組合せを選ぶ。A+C+D(投資額1,000,000)のNPV 280,000が最大である。B+Cは1,100,000で予算超過、NPVの大きい順に選ぶA+Bは270,000にとどまる。",
    },
    {
      q: "A project costs $100,000 and is expected to generate after-tax cash inflows of $30,000, $40,000, $50,000, and $20,000 in years 1 through 4, respectively. Assuming cash flows occur evenly within each year, what is the payback period?",
      ja: "あるプロジェクトの投資額は$100,000で、1年目から4年目にそれぞれ$30,000、$40,000、$50,000、$20,000の税引後キャッシュインフローが見込まれる。各年内でキャッシュフローが均等に発生すると仮定した場合、回収期間はいくらか。",
      c: ["2.6 years", "2.86 years", "3.0 years", "2.4 years"],
      a: 0,
      ex: "2年目末までの累計回収額は70,000で、残り30,000を3年目の50,000で回収するため、2 + 30,000 ÷ 50,000 = 2.6年。2.86年は平均キャッシュフロー35,000で割った誤りである。",
    },
    {
      q: "A project requires an investment of $50,000 and generates cash inflows of $20,000 at the end of each year for 4 years. The discount rate is 10% (present value of $1 at 10%: year 1 = 0.909, year 2 = 0.826, year 3 = 0.751, year 4 = 0.683). Assuming cash flows occur evenly within each year, what is the discounted payback period, to the nearest tenth of a year?",
      ja: "あるプロジェクトは$50,000の投資を要し、4年間各年末に$20,000のキャッシュインフローを生む。割引率は10%である(10%の現価係数:1年 = 0.909、2年 = 0.826、3年 = 0.751、4年 = 0.683)。各年内でキャッシュフローが均等に発生すると仮定した場合、割引回収期間は(小数第1位まで)いくらか。",
      c: ["2.5 years", "3.7 years", "3.0 years", "2.0 years"],
      a: 2,
      ex: "割引後の累計は18,180、34,700、49,720で、3年目末までに49,720を回収する。残り280を4年目の13,660で回収するため3 + 0.02 ≒ 3.0年。2.5年は割引しない通常の回収期間である。",
    },
    {
      q: "An investment of $240,000 in equipment with a 6-year life and no salvage value is expected to produce net after-tax cash inflows of $60,000 per year. The company uses straight-line depreciation. What is the accounting rate of return based on the average investment?",
      ja: "耐用年数6年、残存価額ゼロの設備への$240,000の投資は、年$60,000の税引後正味キャッシュインフローを生むと見込まれる。会社は定額法で償却している。平均投資額に基づく会計的利益率はいくらか。",
      c: ["8.3%", "25.0%", "16.7%", "50.0%"],
      a: 2,
      ex: "会計上の利益 = 60,000 − 減価償却費40,000 = 20,000。平均投資額 = 240,000 ÷ 2 = 120,000で、20,000 ÷ 120,000 = 16.7%。8.3%は初期投資額基準、25%と50%は利益ではなくキャッシュフローを用いた誤りである。",
    },
    {
      q: "In evaluating a proposal to build a new warehouse, which of the following items should be included in the project's incremental cash flows?",
      ja: "新倉庫建設案の評価において、次のうちプロジェクトの増分キャッシュフローに含めるべき項目はどれか。",
      c: [
        "Interest payments on the loan used to finance construction",
        "The after-tax rent the company could earn by leasing the land it already owns to a third party",
        "A $40,000 site survey completed and paid for last year",
        "An allocation of existing corporate headquarters costs that will not change",
      ],
      a: 1,
      ex: "既存の土地を他に貸せば得られた賃貸収入は機会原価として含める。資金調達コスト(利息)は割引率に反映されるため二重計上となり、過去に支払済みの調査費は埋没原価、変化しない本社費配賦は無関連原価である。",
    },
    {
      q: "A company expects annual revenues of $500,000, cash operating expenses of $300,000, and tax depreciation of $80,000 from a new project. The tax rate is 30%. What is the project's annual after-tax operating cash flow?",
      ja: "ある会社は新プロジェクトから、年間収益$500,000、現金営業費用$300,000、税務上の減価償却費$80,000を見込んでいる。税率は30%である。プロジェクトの年間税引後営業キャッシュフローはいくらか。",
      c: ["$140,000", "$164,000", "$220,000", "$84,000"],
      a: 1,
      ex: "税引後利益 = (500,000 − 300,000 − 80,000) × 0.7 = 84,000に減価償却費80,000を足し戻して164,000(= 200,000 × 0.7 + 80,000 × 0.3)。$140,000は節税効果を無視、$220,000は減価償却費を控除せずに足し戻した誤りである。",
    },
    {
      q: "Using the company's 10% cost of capital, an analyst computes a net present value of $(5,000) for a project with conventional cash flows (an initial outflow followed by inflows). Which of the following is true?",
      ja: "アナリストが会社の資本コスト10%を用いて、通常型のキャッシュフロー(初期の流出の後に流入が続く)を持つプロジェクトのNPVを$(5,000)と算定した。次のうち正しいものはどれか。",
      c: [
        "The IRR is greater than 10%, and the profitability index is greater than 1.0",
        "The IRR is less than 10%, and the profitability index is greater than 1.0",
        "The IRR is greater than 10%, and the profitability index is less than 1.0",
        "The IRR is less than 10%, and the profitability index is less than 1.0",
      ],
      a: 3,
      ex: "資本コストでのNPVが負であれば、NPVをゼロにする割引率(IRR)は10%より低く、将来キャッシュフローの現在価値は投資額を下回るので収益性指数も1.0未満となる。NPV、IRR、PIの採否判断は独立プロジェクトでは一致する。",
    },
    {
      q: "A company's outstanding bonds have a 7% coupon rate and currently trade at a yield to maturity of 9%. The company's marginal tax rate is 21%. What after-tax cost of debt should be used in computing the weighted-average cost of capital?",
      ja: "ある会社の発行済社債は表面利率7%で、現在の最終利回りは9%で取引されている。限界税率は21%である。加重平均資本コストの計算に用いるべき税引後負債コストはいくらか。",
      c: ["5.53%", "9.00%", "7.11%", "10.89%"],
      a: 2,
      ex: "負債コストには表面利率ではなく現在の市場利回りを用い、利息の損金算入を考慮して9% × (1 − 0.21) = 7.11%。5.53%は表面利率に税効果を適用した誤り、9.00%は税効果を無視している。",
    },
    {
      q: "A company can issue $100 par preferred stock paying an annual dividend of 6% at a market price of $80 per share. Flotation costs are $5 per share. The tax rate is 30%. What is the cost of the new preferred stock?",
      ja: "ある会社は、額面$100、年6%の配当を支払う優先株式を1株$80の市場価格で発行できる。発行費用は1株$5である。税率は30%である。新規優先株式のコストはいくらか。",
      c: ["8.0%", "7.5%", "6.0%", "5.6%"],
      a: 0,
      ex: "優先株式コスト = 配当6 ÷ 発行手取額(80 − 5) = 8.0%。優先配当は損金算入されないため税効果調整は行わない(5.6%は誤って税調整したもの)。7.5%は発行費用を無視した数値である。",
    },
    {
      q: "The risk-free rate is 4%, the expected return on the market portfolio is 10%, and a company's stock has a beta of 1.3. Using the capital asset pricing model, what is the company's cost of equity?",
      ja: "無リスク利子率は4%、市場ポートフォリオの期待収益率は10%、ある会社の株式のベータは1.3である。資本資産評価モデル(CAPM)を用いた場合、この会社の株主資本コストはいくらか。",
      c: ["13.0%", "17.0%", "7.8%", "11.8%"],
      a: 3,
      ex: "株主資本コスト = 4% + 1.3 × (10% − 4%) = 11.8%。17.0%は市場リスク・プレミアムではなく市場収益率全体にベータを乗じた誤り、7.8%は無リスク利子率を加え忘れた誤りである。",
    },
    {
      q: "A company's capital structure at market values consists of debt of $4,000,000 (pretax cost 8%), preferred stock of $1,000,000 (cost 9%), and common equity of $5,000,000 (cost 14%). The tax rate is 25%. What is the weighted-average cost of capital?",
      ja: "ある会社の市場価値ベースの資本構成は、負債$4,000,000(税引前コスト8%)、優先株式$1,000,000(コスト9%)、普通株主資本$5,000,000(コスト14%)である。税率は25%である。加重平均資本コストはいくらか。",
      c: ["11.1%", "10.3%", "9.7%", "12.0%"],
      a: 1,
      ex: "WACC = 0.4 × 8% × (1 − 0.25) + 0.1 × 9% + 0.5 × 14% = 2.4% + 0.9% + 7.0% = 10.3%。11.1%は負債の税効果を無視、9.7%は資本構成比率を用いずに単純平均した誤りである。",
    },
    {
      q: "A company's common stock sells for $40 per share. The dividend expected at the end of this year is $2.40 per share, and dividends are expected to grow at a constant 6% annually. Flotation costs on new common stock are 10% of the selling price. What is the cost of new external common equity?",
      ja: "ある会社の普通株式の株価は1株$40である。今年度末に予想される配当は1株$2.40で、配当は毎年6%の一定率で成長すると見込まれる。新株発行の発行費用は発行価格の10%である。新規発行普通株式のコストはいくらか。",
      c: ["12.0%", "13.1%", "12.7%", "6.7%"],
      a: 2,
      ex: "新株のコスト = 2.40 ÷ (40 × 0.9) + 6% = 6.67% + 6% = 12.7%。12.0%は発行費用を考慮しない内部留保のコスト、13.1%は既に翌期の配当であるD1にさらに成長率を乗じた誤りである。",
    },
    {
      q: "A company's weighted-average cost of capital is 10%. It is evaluating a project in a new line of business whose risk is substantially greater than the risk of its existing operations. How should the project be evaluated?",
      ja: "ある会社の加重平均資本コストは10%である。既存事業よりリスクが大幅に高い新規事業のプロジェクトを評価している。このプロジェクトはどのように評価すべきか。",
      c: [
        "Discount its cash flows at the 10% WACC because the WACC reflects the company's overall financing mix",
        "Discount its cash flows at the after-tax cost of debt if the project will be financed entirely with debt",
        "Discount its cash flows at a risk-adjusted rate higher than 10%, such as one based on the betas of companies in the new line of business",
        "Shorten the payback requirement and ignore discounting because the risk cannot be measured",
      ],
      a: 2,
      ex: "WACCは既存事業と同程度のリスクのプロジェクトにのみ適切であり、リスクの高いプロジェクトには同業他社のベータなどに基づくリスク調整後の高い割引率を用いる。特定の調達源泉のコストで割り引くのは誤りである。",
    },
    {
      q: "An analyst projects that a company's free cash flow to the firm will be $5 million next year and will grow at 3% per year indefinitely. The company's WACC is 9%. The company has debt with a market value of $20 million and cash of $5 million. What is the estimated value of the company's equity?",
      ja: "アナリストは、ある会社の企業フリー・キャッシュフロー(FCFF)が来年$5百万で、以後永続的に年3%成長すると予測している。WACCは9%である。会社には市場価値$20百万の負債と$5百万の現金がある。株主資本価値の見積額はいくらか。",
      c: ["$83.3 million", "$68.3 million", "$63.3 million", "$58.3 million"],
      a: 1,
      ex: "企業価値 = 5 ÷ (9% − 3%) = 83.3百万。株主資本価値 = 企業価値 − 負債20 + 現金5 = 68.3百万。$83.3百万は企業価値そのもの、$63.3百万は現金の加算漏れ、$58.3百万は現金を誤って控除したものである。",
    },
    {
      q: "Comparable public companies trade at an average enterprise value-to-EBITDA multiple of 8.0. A target company has EBITDA of $12 million, debt of $35 million, cash of $5 million, and 5 million shares outstanding. What is the implied value per share of the target's equity?",
      ja: "比較対象の上場会社は平均EV/EBITDA倍率8.0倍で取引されている。対象会社のEBITDAは$12百万、負債は$35百万、現金は$5百万、発行済株式数は5百万株である。対象会社の1株当たり株主資本価値の推定値はいくらか。",
      c: ["$19.20", "$25.20", "$7.20", "$13.20"],
      a: 3,
      ex: "企業価値 = 12 × 8.0 = 96百万。純有利子負債30百万(35 − 5)を控除して株主資本価値66百万、1株当たり66 ÷ 5 = $13.20。$19.20は企業価値を株式数で割った誤り、$25.20は純負債を加算した誤りである。",
    },
    {
      q: "A company reported net income of $6 million, which includes a $1 million after-tax nonrecurring gain on the sale of a building. It has 2 million shares outstanding. Comparable companies trade at a price-to-earnings ratio of 14. Using normalized earnings, what is the estimated value per share?",
      ja: "ある会社の純利益は$6百万で、これには建物売却による$1百万(税引後)の非経常的利益が含まれている。発行済株式数は2百万株である。比較対象会社の株価収益率(P/E)は14倍である。正常化した利益を用いた1株当たりの推定価値はいくらか。",
      c: ["$35.00", "$42.00", "$49.00", "$28.00"],
      a: 0,
      ex: "正常化EPS = (6 − 1) ÷ 2 = 2.50、推定株価 = 2.50 × 14 = $35.00。$42.00は非経常的利益を除外しなかった誤り、$49.00は利益を二重に加算した誤りである。",
    },
    {
      q: "When valuing a company using market multiples, which of the following pairs a value measure with a consistent earnings or cash flow measure?",
      ja: "市場倍率を用いて企業を評価する場合、次のうち価値指標と利益(またはキャッシュフロー)指標の組合せが整合しているものはどれか。",
      c: [
        "Equity value ÷ EBIT",
        "Enterprise value ÷ EBITDA",
        "Enterprise value ÷ net income",
        "Equity value ÷ unlevered free cash flow",
      ],
      a: 1,
      ex: "企業価値(債権者と株主の双方に帰属)には利息控除前のEBITDAやEBIT、FCFFを、株主資本価値には純利益など利息控除後の指標を対応させる。他の選択肢は帰属する資本提供者が分子と分母で一致していない。",
    },
    {
      q: "A company reports EBIT of $10 million, depreciation of $2 million, capital expenditures of $3 million, and an increase in net working capital of $1 million. The tax rate is 25%. What is the company's free cash flow to the firm?",
      ja: "ある会社のEBITは$10百万、減価償却費は$2百万、資本的支出は$3百万、正味運転資本の増加額は$1百万である。税率は25%である。企業フリー・キャッシュフロー(FCFF)はいくらか。",
      c: ["$6.5 million", "$8.5 million", "$5.5 million", "$1.5 million"],
      a: 2,
      ex: "FCFF = EBIT × (1 − 税率) + 減価償却費 − 資本的支出 − 運転資本増加 = 7.5 + 2 − 3 − 1 = 5.5百万。$6.5百万は運転資本の増加を無視、$1.5百万は減価償却費を加算せず控除した誤りである。",
    },
    {
      q: "A retailer sells 40,000 units of a product evenly throughout the year. The cost of placing an order is $50, and the annual carrying cost is $4 per unit. What are the economic order quantity and the resulting total annual ordering and carrying cost?",
      ja: "ある小売業者は製品を年間40,000個、年間を通じて均等に販売している。1回の発注費用は$50、年間保管費用は1個当たり$4である。経済的発注量(EOQ)と、その場合の年間発注費用と保管費用の合計はいくらか。",
      c: ["1,000 units; $2,000", "707 units; $2,828", "1,000 units; $4,000", "1,414 units; $4,243"],
      a: 2,
      ex: "EOQ = √(2 × 40,000 × 50 ÷ 4) = 1,000個。発注費用 = 40回 × 50 = 2,000、保管費用 = (1,000 ÷ 2) × 4 = 2,000で合計4,000。EOQでは発注費用と保管費用が等しくなる。$2,000はどちらか一方のみである。",
    },
    {
      q: "A manufacturer uses 200 units of a component per working day. The supplier's lead time is 6 working days, and the company maintains a safety stock of 500 units. At what inventory level should the company reorder?",
      ja: "ある製造業者は部品を1稼働日当たり200個使用する。仕入先のリードタイムは6稼働日で、会社は500個の安全在庫を維持している。在庫がどの水準になったときに再発注すべきか。",
      c: ["1,200 units", "1,700 units", "700 units", "2,200 units"],
      a: 1,
      ex: "発注点 = 1日当たり使用量 × リードタイム + 安全在庫 = 200 × 6 + 500 = 1,700個。1,200個は安全在庫を加え忘れた誤りである。",
    },
    {
      q: "A company places 12 orders per year. Each stockout costs $1,000. The carrying cost is $4 per unit per year. The probability of a stockout during an order cycle is 30% with no safety stock, 10% with 100 units, 2% with 200 units, and 0% with 300 units. Which safety stock level minimizes total annual cost?",
      ja: "ある会社は年12回発注する。品切れ1回当たりのコストは$1,000、保管費用は1個当たり年$4である。1発注サイクル中の品切れ確率は、安全在庫なしで30%、100個で10%、200個で2%、300個で0%である。年間総コストを最小化する安全在庫水準はどれか。",
      c: ["0 units", "100 units", "300 units", "200 units"],
      a: 3,
      ex: "年間総コスト = 保管費用 + 品切れ確率 × 12回 × 1,000。0個:3,600、100個:400 + 1,200 = 1,600、200個:800 + 240 = 1,040、300個:1,200。最小は200個である。品切れを完全に防ぐ300個は保管費用が過大となる。",
    },
    {
      q: "A supplier offers credit terms of 2/10, net 40. Using a 365-day year, what is the approximate annual cost of forgoing the discount and paying on day 40?",
      ja: "仕入先が2/10, net 40の信用条件を提示している。1年を365日とした場合、割引を受けずに40日目に支払うことの年率換算のおおよそのコストはいくらか。",
      c: ["24.8%", "24.3%", "18.6%", "2.0%"],
      a: 0,
      ex: "コスト = 2 ÷ 98 × 365 ÷ (40 − 10) = 24.8%。24.3%は分母に98ではなく100を用いた誤り、18.6%は信用期間全体の40日で割った誤りである。",
    },
    {
      q: "A company purchases materials on terms of 1/10, net 30 and currently pays on day 30. Its bank will lend short-term funds at 15% annual interest. Using a 365-day year, what should the company do?",
      ja: "ある会社は1/10, net 30の条件で材料を購入しており、現在は30日目に支払っている。取引銀行は年15%で短期資金を融資する。1年を365日とした場合、会社はどうすべきか。",
      c: [
        "Continue paying on day 30, because the 1% discount is less than the 15% bank rate",
        "Borrow from the bank to pay on day 10, because forgoing the discount costs about 18.4% per year",
        "Continue paying on day 30, because forgoing the discount costs about 12.2% per year",
        "Pay on day 10 only if the bank rate is below 1%",
      ],
      a: 1,
      ex: "割引を受けないコスト = 1 ÷ 99 × 365 ÷ 20 = 18.4%で、銀行借入の15%を上回るため、借入れて割引を受けるべきである。1%と15%を直接比較するのは期間を年率換算していない誤りである。",
    },
    {
      q: "A company is considering factoring $300,000 of receivables each month. The factor charges a 2% fee on receivables factored, holds a 10% reserve, and charges interest of 1% per month on the amount advanced (receivables less fee and reserve). Factoring would eliminate $2,000 per month of credit department costs and bad debts equal to 1% of receivables. What is the approximate effective annual cost of factoring?",
      ja: "ある会社は毎月$300,000の売掛金のファクタリングを検討している。ファクターは譲渡債権額の2%の手数料を課し、10%を留保金として保持し、前渡額(債権額から手数料と留保金を控除した額)に月1%の利息を課す。ファクタリングにより与信管理部門のコスト月$2,000と、債権額の1%の貸倒損失が不要になる。ファクタリングの実効年利はおおよそいくらか。",
      c: ["39.3%", "14.6%", "12.0%", "16.5%"],
      a: 3,
      ex: "前渡額 = 300,000 − 6,000 − 30,000 = 264,000。月間正味コスト = 手数料6,000 + 利息2,640 − 節約2,000 − 貸倒3,000 = 3,640。年率 = 3,640 × 12 ÷ 264,000 = 16.5%。39.3%は節約額を無視、14.6%は債権総額を分母とした誤りである。",
    },
    {
      q: "Under COSO's Enterprise Risk Management—Integrating with Strategy and Performance (2017), which of the following is NOT one of the five components of the framework?",
      ja: "COSOの「全社的リスクマネジメント―戦略およびパフォーマンスとの統合」(2017年)において、次のうちフレームワークの5つの構成要素に該当しないものはどれか。",
      c: ["Governance and Culture", "Review and Revision", "Control Activities", "Information, Communication, and Reporting"],
      a: 2,
      ex: "2017年版ERMの構成要素は、ガバナンスとカルチャー、戦略と目標設定、パフォーマンス、レビューと修正、情報・伝達および報告の5つである。統制活動はCOSOの内部統制フレームワーク(2013年)の構成要素である。",
    },
    {
      q: "A company's board has stated that it is willing to accept moderate risk to achieve 8% annual revenue growth. Management then specifies that customer on-time delivery must remain between 95% and 98%, and any result outside this range will trigger corrective action. Under the COSO ERM framework (2017), the 95%–98% range is best described as:",
      ja: "ある会社の取締役会は、年8%の売上成長を達成するため中程度のリスクを受け入れると表明した。経営者はこれを受け、顧客への納期遵守率を95%から98%の範囲に維持し、範囲外の結果が出れば是正措置を講じると定めた。COSO ERMフレームワーク(2017年)において、この95%~98%の範囲は何と表現するのが最も適切か。",
      c: ["Risk appetite", "Risk capacity", "Risk profile", "Tolerance"],
      a: 3,
      ex: "許容度(tolerance)はパフォーマンスの許容可能な変動幅であり、具体的な業績指標の範囲として表される。リスク選好(risk appetite)は価値追求のために受け入れるリスクの総量で、取締役会による中程度のリスク受容の表明がそれに当たる。",
    },
    {
      q: "After analyzing its risk profile, a company concludes that it has excess capacity to take on risk and decides to expand aggressively into an emerging market to increase growth. Under the COSO ERM framework (2017), this response is classified as:",
      ja: "リスク・プロファイルを分析した結果、ある会社はリスクを引き受ける余力が十分にあると判断し、成長を高めるため新興市場へ積極的に進出することを決定した。COSO ERMフレームワーク(2017年)において、この対応はどれに分類されるか。",
      c: ["Pursue", "Accept", "Share", "Avoid"],
      a: 0,
      ex: "2017年版ERMのリスク対応は受容、回避、追求、低減、共有の5つであり、より高いパフォーマンスを得るためにリスクを積極的に増やすのは「追求(pursue)」である。「受容」は何もしないで現状のリスクを受け入れる対応である。",
    },
    {
      q: "Under the COSO ERM framework (2017), identifying risks, assessing their severity, prioritizing them, selecting responses, and developing a portfolio view are principles within which component?",
      ja: "COSO ERMフレームワーク(2017年)において、リスクの識別、重大度の評価、優先順位付け、対応の選択、ポートフォリオ観の構築は、どの構成要素の原則か。",
      c: ["Strategy and Objective-Setting", "Performance", "Review and Revision", "Governance and Culture"],
      a: 1,
      ex: "パフォーマンス(Performance)の構成要素には、リスクの識別・重大度の評価・優先順位付け・対応の実施・ポートフォリオ観の構築の5原則が含まれる。戦略と目標設定はリスク選好の定義や事業目標の策定を扱う。",
    },
    {
      q: "A company holds a bond portfolio with a modified duration of 7.0. If market interest rates increase by 1 percentage point, the value of the portfolio will approximately:",
      ja: "ある会社は修正デュレーション7.0の債券ポートフォリオを保有している。市場金利が1%ポイント上昇した場合、ポートフォリオの価値はおおよそどうなるか。",
      c: ["Increase by 7%", "Decrease by 1%", "Decrease by 0.7%", "Decrease by 7%"],
      a: 3,
      ex: "価格変動率 ≒ −修正デュレーション × 金利変化 = −7.0 × 1% = −7%。金利と債券価格は逆方向に動くため、増加とする選択肢は誤りである。",
    },
    {
      q: "A U.S. company must pay a supplier €1,000,000 in 90 days. Management wants to protect against a rise in the dollar cost of the euro while retaining the ability to benefit if the euro weakens. Which hedging instrument best meets this objective?",
      ja: "ある米国企業は90日後に仕入先へ€1,000,000を支払わなければならない。経営者はユーロ高によるドル建てコストの上昇を防ぎつつ、ユーロ安になった場合の利益は享受したいと考えている。この目的に最も適したヘッジ手段はどれか。",
      c: [
        "Purchase a call option on €1,000,000",
        "Enter into a forward contract to buy €1,000,000 in 90 days",
        "Purchase a put option on €1,000,000",
        "Enter into a forward contract to sell €1,000,000 in 90 days",
      ],
      a: 0,
      ex: "ユーロのコール・オプションを購入すれば、ユーロ高の場合は権利行使で上限レートを確保し、ユーロ安の場合は放棄して有利な直物レートで購入できる(プレミアムが対価)。為替予約による買いはレートを固定するため、ユーロ安の利益を放棄することになる。",
    },
    {
      q: "An investor holds a well-diversified portfolio of 40 stocks across many industries. Which type of risk remains in the portfolio and is reflected in its beta?",
      ja: "ある投資家は、多くの業種にわたる40銘柄からなる十分に分散されたポートフォリオを保有している。このポートフォリオに残り、ベータに反映されるリスクはどれか。",
      c: [
        "Unsystematic (firm-specific) risk, such as a product recall",
        "Systematic (market) risk, such as changes in interest rates and economic cycles",
        "Business risk unique to each individual company",
        "Default risk of individual issuers",
      ],
      a: 1,
      ex: "分散投資により個別企業固有の非システマティック・リスクは除去されるが、金利や景気変動などの市場全体に起因するシステマティック・リスクは分散できず、ベータで測定される。CAPMではこのリスクのみが報酬の対象となる。",
    },
  ],
});

CPA.tbs({ id: "TBS-BAR-15", section: "BAR", chapter: "BAR-01", title: "節税効果と運転資本を考慮したNPV",
  scenario: `<p>Hotaka Corp. is evaluating new packaging equipment. Data:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Equipment cost (paid at time 0)</td><td>$500,000</td></tr>
<tr><td>Tax depreciation</td><td>Straight-line over 5 years, zero salvage value</td></tr>
<tr><td>Annual pretax cash operating savings (years 1–5)</td><td>$150,000</td></tr>
<tr><td>Working capital required at time 0 (fully recovered at end of year 5)</td><td>$60,000</td></tr>
<tr><td>Expected sale price of equipment at end of year 5</td><td>$40,000</td></tr>
<tr><td>Income tax rate</td><td>25%</td></tr>
<tr><td>Required rate of return</td><td>10%</td></tr>
<tr><td>PV of ordinary annuity of $1, 5 years, 10%</td><td>3.791</td></tr>
<tr><td>PV of $1 at end of year 5, 10%</td><td>0.621</td></tr></table>
<p>Assume all operating cash flows occur at year-end. Compute the amounts below (round NPV to the nearest dollar).</p>
<p class="ja">穂高社は新しい包装設備を検討している。設備原価$500,000(0時点で支払)、税務上5年定額法・残存価額ゼロ、年間税引前現金営業費節約$150,000(1~5年目)、0時点で運転資本$60,000が必要(5年目末に全額回収)、5年目末の設備売却見込額$40,000、税率25%、要求収益率10%、10%・5年の年金現価係数3.791、10%・5年後の現価係数0.621。営業キャッシュフローはすべて年末に発生するものとする。以下の金額を求めよ(NPVは1ドル未満を四捨五入)。</p>`,
  rows: [
    { label: "Annual depreciation tax shield(年間の減価償却による節税額)", type: "num", answer: 25000 },
    { label: "Annual after-tax operating cash flow, years 1–5(1~5年目の年間税引後営業キャッシュフロー)", type: "num", answer: 137500 },
    { label: "Total initial cash outflow at time 0(0時点の初期キャッシュアウトフロー合計)", type: "num", answer: 560000 },
    { label: "After-tax cash flow from sale of equipment at end of year 5(5年目末の設備売却による税引後キャッシュフロー)", type: "num", answer: 30000 },
    { label: "Net present value of the project(プロジェクトの正味現在価値)", type: "num", answer: 17153, tol: 2 },
    { label: "Decision(判断)", type: "select", options: ["Accept", "Reject"], answer: "Accept" },
  ],
  explain: `<p>年間減価償却費 = 500,000 ÷ 5 = 100,000、節税額 = 100,000 × 25% = 25,000。</p>
<p>年間税引後営業CF = 150,000 × (1 − 0.25) + 25,000 = 137,500。</p>
<p>初期流出 = 設備500,000 + 運転資本60,000 = 560,000。</p>
<p>設備の税務簿価はゼロなので売却額40,000全額が課税対象:40,000 × (1 − 0.25) = 30,000。</p>
<p>NPV = 137,500 × 3.791 + (30,000 + 60,000) × 0.621 − 560,000 = 521,263 + 55,890 − 560,000 = 17,153。NPVが正なので採用する。運転資本の回収と売却益への課税を忘れないこと。</p>`,
});

CPA.tbs({ id: "TBS-BAR-16", section: "BAR", chapter: "BAR-01", title: "自製か購入かの意思決定",
  scenario: `<p>Tateyama Inc. manufactures 10,000 units per year of a valve used in its main product. Current unit costs of making the valve:</p>
<table><tr><th>Cost element</th><th>Per unit</th></tr>
<tr><td>Direct materials</td><td>$12</td></tr>
<tr><td>Direct labor</td><td>$9</td></tr>
<tr><td>Variable manufacturing overhead</td><td>$5</td></tr>
<tr><td>Fixed manufacturing overhead</td><td>$8</td></tr>
<tr><td>Total</td><td>$34</td></tr></table>
<p>An outside supplier offers to sell the valve for $30 per unit. If the valve is purchased, $30,000 of the annual fixed overhead (a supervisor's salary) would be eliminated; the remainder is allocated depreciation and plant-wide costs that would continue. The space now used to make the valve could be rented to another company for $25,000 per year.</p>
<p class="ja">立山社は主力製品に使用するバルブを年10,000個自製している。現在の単位原価は直接材料費$12、直接労務費$9、変動製造間接費$5、固定製造間接費$8、合計$34である。外部業者が1個$30での供給を提案している。購入に切り替えると、年間固定製造間接費のうち$30,000(監督者の給与)が削減され、残りは引き続き発生する減価償却費等の配賦額である。現在バルブ製造に使用しているスペースは他社に年$25,000で賃貸できる。</p>`,
  rows: [
    { label: "Avoidable (relevant) cost per unit to make(自製の回避可能(関連)単位原価)", type: "num", answer: 29 },
    { label: "Total relevant cost to make, excluding the rental opportunity(賃貸の機会原価を除く自製の関連原価合計)", type: "num", answer: 290000 },
    { label: "Total cost to buy(購入原価合計)", type: "num", answer: 300000 },
    { label: "Net annual advantage of the better alternative, including the rental opportunity(賃貸機会を含めた有利な案の年間差額)", type: "num", answer: 15000 },
    { label: "Better alternative(有利な案)", type: "select", options: ["Make", "Buy"], answer: "Buy" },
    { label: "Maximum price per unit Tateyama could pay the supplier and be no worse off(立山社が不利にならない最高購入単価)", type: "num", answer: 31.5, tol: 0.01 },
  ],
  explain: `<p>回避可能な単位原価 = 12 + 9 + 5 + 30,000 ÷ 10,000 = 29。自製の関連原価 = 29 × 10,000 = 290,000。</p>
<p>購入原価 = 30 × 10,000 = 300,000。</p>
<p>自製すると賃貸収入25,000を失う(機会原価)ので、自製の総関連原価は315,000。購入が315,000 − 300,000 = 15,000有利である。</p>
<p>最高購入単価 = 315,000 ÷ 10,000 = $31.50。全部原価$34との比較や、賃貸機会の無視(自製が10,000有利と誤判断)が典型的な誤りである。</p>`,
});

CPA.tbs({ id: "TBS-BAR-17", section: "BAR", chapter: "BAR-01", title: "加重平均資本コスト(WACC)",
  scenario: `<p>Norikura Co. is computing its weighted-average cost of capital using market-value weights. Data:</p>
<table><tr><th>Source</th><th>Data</th></tr>
<tr><td>Bonds</td><td>20,000 bonds outstanding, $1,000 par, market price $950 each; pretax yield to maturity 8%</td></tr>
<tr><td>Preferred stock</td><td>50,000 shares outstanding, market price $50 per share, annual dividend $4.50 per share</td></tr>
<tr><td>Common stock</td><td>1,000,000 shares outstanding, market price $28.50 per share; beta 1.2</td></tr>
<tr><td>Risk-free rate</td><td>4%</td></tr>
<tr><td>Market risk premium</td><td>7%</td></tr>
<tr><td>Income tax rate</td><td>25%</td></tr></table>
<p>Ignore flotation costs. Enter percentages to two decimal places (e.g., 7.25 for 7.25%).</p>
<p class="ja">乗鞍社は市場価値ウェイトで加重平均資本コストを計算している。社債:発行済20,000口、額面$1,000、市場価格1口$950、税引前最終利回り8%。優先株式:発行済50,000株、株価$50、年間配当1株$4.50。普通株式:発行済1,000,000株、株価$28.50、ベータ1.2。無リスク利子率4%、市場リスク・プレミアム7%、税率25%。発行費用は無視する。パーセントは小数第2位まで入力すること(例:7.25%なら7.25)。</p>`,
  rows: [
    { label: "After-tax cost of debt, %(税引後負債コスト、%)", type: "num", answer: 6.0, tol: 0.01 },
    { label: "Cost of preferred stock, %(優先株式コスト、%)", type: "num", answer: 9.0, tol: 0.01 },
    { label: "Cost of common equity (CAPM), %(普通株主資本コスト(CAPM)、%)", type: "num", answer: 12.4, tol: 0.01 },
    { label: "Total market value of capital, $(資本の市場価値合計、$)", type: "num", answer: 50000000 },
    { label: "Weighted-average cost of capital, %(加重平均資本コスト、%)", type: "num", answer: 9.80, tol: 0.01 },
    { label: "Should an average-risk project with an IRR of 9.5% be accepted?(IRR 9.5%の平均的リスクのプロジェクトを採用すべきか)", type: "select", options: ["Yes", "No"], answer: "No" },
  ],
  explain: `<p>税引後負債コスト = 8% × (1 − 0.25) = 6.00%(表面利率ではなく最終利回りを用いる)。</p>
<p>優先株式コスト = 4.50 ÷ 50 = 9.00%(税調整なし)。普通株主資本コスト = 4% + 1.2 × 7% = 12.40%。</p>
<p>市場価値:負債20,000 × 950 = 19,000,000(38%)、優先株式2,500,000(5%)、普通株式28,500,000(57%)、合計50,000,000。</p>
<p>WACC = 0.38 × 6% + 0.05 × 9% + 0.57 × 12.4% = 2.28% + 0.45% + 7.068% = 9.80%。IRR 9.5%はWACCを下回るため採用しない。</p>`,
});
