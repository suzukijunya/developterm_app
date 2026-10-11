// BAR の追加問題(原価計算・CVP・予算・差異分析)

CPA.extend("BAR-01", {
  mcq: [
    {
      q: "A manufacturer applies overhead on the basis of direct labor hours. Budgeted overhead for the year is $480,000 and budgeted direct labor hours are 60,000. Job 101 used $5,000 of direct materials and 400 direct labor hours at $15 per hour. What is the total cost of Job 101 under normal costing?",
      ja: "ある製造業者は直接作業時間を基準に製造間接費を配賦している。年間の予算製造間接費は$480,000、予算直接作業時間は60,000時間である。ジョブ101は直接材料費$5,000、直接作業400時間(時給$15)を消費した。正常原価計算によるジョブ101の総原価はいくらか。",
      c: ["$11,000", "$14,200", "$17,000", "$13,800"],
      a: 1,
      ex: "予定配賦率 = 480,000 ÷ 60,000 = $8/時間。総原価 = 5,000 + 400 × 15 + 400 × 8 = 14,200。$11,000は製造間接費の配賦を漏らした額である。",
    },
    {
      q: "Using a predetermined rate of $8 per direct labor hour (based on budgeted overhead of $480,000), a company worked 62,000 actual direct labor hours and incurred actual overhead of $505,000. Overhead for the year was:",
      ja: "予定配賦率$8/直接作業時間(予算製造間接費$480,000に基づく)を用いている会社で、実際直接作業時間は62,000時間、実際製造間接費は$505,000であった。当期の製造間接費はどうなったか。",
      c: ["Overapplied by $16,000", "Underapplied by $25,000", "Overapplied by $9,000", "Underapplied by $9,000"],
      a: 3,
      ex: "配賦額 = 62,000 × 8 = 496,000。実際505,000 − 配賦496,000 = 9,000の配賦不足。$25,000は実際額と予算額の比較(予算差異)であり、配賦差異ではない。",
    },
    {
      q: "At year-end, manufacturing overhead is underapplied by $40,000, which is material. The overhead applied during the year that remains in ending balances is: Work in Process $20,000, Finished Goods $30,000, and Cost of Goods Sold $150,000. The total account balances are WIP $50,000, FG $70,000, and COGS $380,000. Using the most accurate proration method, how much of the underapplied overhead is charged to COGS?",
      ja: "期末に製造間接費の配賦不足$40,000(重要性あり)がある。期末残高に含まれる当期配賦額は仕掛品$20,000、製品$30,000、売上原価$150,000である。勘定残高合計は仕掛品$50,000、製品$70,000、売上原価$380,000である。最も精緻な按分方法によると、売上原価に配分される配賦不足額はいくらか。",
      c: ["$30,000", "$30,400", "$40,000", "$10,000"],
      a: 0,
      ex: "最も精緻なのは各勘定に含まれる当期配賦額の比率による按分:40,000 × 150,000 ÷ 200,000 = 30,000。$30,400は勘定残高比率(76%)による按分で、直接材料費等も含むため精度が劣る。",
    },
    {
      q: "A company closes its entire overapplied manufacturing overhead balance directly to cost of goods sold at year-end. Compared with leaving the balance unadjusted, this entry will:",
      ja: "ある会社は期末に製造間接費の配賦超過額全額を売上原価に直接振り替えている。調整しない場合と比べて、この仕訳の影響はどれか。",
      c: [
        "Increase cost of goods sold and decrease net income",
        "Decrease cost of goods sold and increase net income",
        "Decrease work in process and finished goods inventories",
        "Have no effect on net income because overhead is a product cost",
      ],
      a: 1,
      ex: "配賦超過は原価を過大に配賦していたことを意味するため、売上原価から減額し、純利益が増加する。全額を売上原価で処理する場合、棚卸資産勘定は変動しない。",
    },
    {
      q: "A company uses normal costing and applies overhead at 150% of direct labor cost. For the period: beginning WIP $30,000; direct materials used $120,000; direct labor $90,000; actual overhead $140,000; ending WIP $45,000. What is the cost of goods manufactured?",
      ja: "ある会社は正常原価計算を採用し、直接労務費の150%で製造間接費を配賦している。期首仕掛品$30,000、直接材料消費額$120,000、直接労務費$90,000、実際製造間接費$140,000、期末仕掛品$45,000である。当期製品製造原価はいくらか。",
      c: ["$335,000", "$375,000", "$300,000", "$330,000"],
      a: 3,
      ex: "配賦額 = 90,000 × 150% = 135,000。製造原価 = 30,000 + 120,000 + 90,000 + 135,000 − 45,000 = 330,000。$335,000は実際製造間接費を用いた誤り(正常原価計算では配賦額を使う)。",
    },
    {
      q: "A custom furniture maker accumulates costs by individual order. On which document are direct materials, direct labor, and applied overhead accumulated for each order, and which account do the costs of unfinished orders support at period-end?",
      ja: "注文家具メーカーは個別注文ごとに原価を集計している。各注文の直接材料費・直接労務費・配賦製造間接費を集計する書類はどれか、また期末未完成の注文の原価はどの勘定の明細となるか。",
      c: [
        "Materials requisition form; Raw Materials Inventory",
        "Production cost report; Finished Goods Inventory",
        "Job cost sheet; Work in Process Inventory",
        "Time ticket; Manufacturing Overhead",
      ],
      a: 2,
      ex: "個別原価計算では製造指図書(ジョブ・コスト・シート)に原価を集計し、未完成ジョブの指図書合計が仕掛品勘定の補助元帳となる。製造原価報告書(production cost report)は総合原価計算で用いる。",
    },
    {
      q: "A department uses FIFO process costing. Beginning WIP was 5,000 units, 40% complete as to conversion. During the period 25,000 units were started. Ending WIP is 6,000 units, 70% complete as to conversion. What are the equivalent units for conversion costs?",
      ja: "ある工程は先入先出法(FIFO)による総合原価計算を採用している。期首仕掛品5,000個(加工進捗度40%)、当期投入25,000個、期末仕掛品6,000個(加工進捗度70%)である。加工費の完成品換算量はいくらか。",
      c: ["28,200", "26,200", "24,200", "30,000"],
      a: 1,
      ex: "完成品 = 5,000 + 25,000 − 6,000 = 24,000。FIFO:期首仕掛品の当期作業 5,000 × 60% = 3,000 + 当期着手完成 19,000 + 期末 6,000 × 70% = 4,200 → 26,200。28,200は平均法(期首仕掛品の前期作業分2,000を含む)。",
    },
    {
      q: "A company uses the weighted-average method. Equivalent units for conversion are 28,000 under weighted average (25,000 under FIFO). Conversion costs in beginning WIP were $22,000, and conversion costs added during the period were $146,000. What is the conversion cost per equivalent unit under the weighted-average method?",
      ja: "会社は平均法を採用している。加工費の完成品換算量は平均法で28,000(FIFOでは25,000)である。期首仕掛品の加工費は$22,000、当期発生加工費は$146,000である。平均法による加工費の換算量当たり単価はいくらか。",
      c: ["$5.84", "$5.21", "$6.00", "$6.72"],
      a: 2,
      ex: "平均法は期首仕掛品原価と当期発生原価を合算する:(22,000 + 146,000) ÷ 28,000 = $6.00。$5.84は当期発生原価÷FIFO換算量(FIFO単価)である。",
    },
    {
      q: "Materials are added at the beginning of the process. Ending WIP consists of 3,000 units that are 40% complete as to conversion. Weighted-average cost per equivalent unit is $5 for materials and $8 for conversion. What is the cost of ending WIP?",
      ja: "材料は工程の始点で投入される。期末仕掛品は3,000個で加工進捗度は40%である。平均法による換算量当たり単価は材料費$5、加工費$8である。期末仕掛品原価はいくらか。",
      c: ["$39,000", "$15,600", "$24,600", "$9,600"],
      a: 2,
      ex: "材料は始点投入なので100%:3,000 × 5 = 15,000。加工費 3,000 × 40% × 8 = 9,600。合計24,600。$15,600は材料にも40%を適用した誤り、$39,000は完成品扱いした誤り。",
    },
    {
      q: "Under which circumstance will equivalent units computed under the weighted-average method equal equivalent units computed under the FIFO method?",
      ja: "平均法による完成品換算量とFIFOによる完成品換算量が一致するのはどのような場合か。",
      c: [
        "When there is no beginning work in process inventory",
        "When there is no ending work in process inventory",
        "When materials are added at the beginning of the process",
        "When units started equal units completed",
      ],
      a: 0,
      ex: "両者の差は期首仕掛品の前期作業分(平均法は含め、FIFOは除く)のみである。期首仕掛品がなければ一致する。期末仕掛品の有無は両法で同様に扱われるため差を生まない。",
    },
    {
      q: "In a process costing system with two sequential departments, units received by the second department from the first department are, with respect to transferred-in costs in the second department, considered to be:",
      ja: "2つの連続工程を持つ総合原価計算において、第1工程から第2工程に振り替えられた単位は、第2工程の前工程費に関してどの程度完成しているとみなされるか。",
      c: [
        "0% complete until processing in the second department begins",
        "Complete to the same degree as conversion costs in the second department",
        "50% complete, by convention",
        "100% complete",
      ],
      a: 3,
      ex: "前工程費は第2工程の始点で投入される材料と同様に扱われ、第2工程にある全単位について常に100%完成である。加工進捗度は第2工程の加工費の換算にのみ用いる。",
    },
    {
      q: "During the month a company incurred $4,000 of spoilage that is inherent in its efficient production process and $6,000 of spoilage caused by a machine malfunction. How much spoilage cost should be recognized as a loss for the period rather than included in the cost of good units produced?",
      ja: "当月、効率的な生産工程に本来伴う仕損費$4,000と、機械の故障による仕損費$6,000が発生した。良品の原価に含めず、当期の損失として認識すべき仕損費はいくらか。",
      c: ["$0", "$4,000", "$6,000", "$10,000"],
      a: 2,
      ex: "正常仕損(工程に本来伴うもの)は良品の原価に含め、異常仕損(故障等で回避可能なもの)は期間損失とする。したがって$6,000。$10,000は正常仕損も損失とした誤り。",
    },
    {
      q: "A company started 10,000 units during the month and completed 9,200 good units; there was no beginning or ending WIP. Normal spoilage is 5% of good units produced. Spoiled units are detected at the end of the process, and the full cost per unit is $25. What is the cost of abnormal spoilage?",
      ja: "当月10,000個を投入し、良品9,200個が完成した。期首・期末仕掛品はない。正常仕損は良品産出量の5%である。仕損は工程の終点で発見され、1個当たりの原価は$25である。異常仕損費はいくらか。",
      c: ["$7,500", "$20,000", "$11,500", "$8,500"],
      a: 3,
      ex: "仕損 = 10,000 − 9,200 = 800個。正常仕損 = 9,200 × 5% = 460個、異常仕損 = 340個 × 25 = 8,500。$7,500は投入量(10,000)の5%を正常仕損とした誤り。",
    },
    {
      q: "A company uses activity-based costing with three pools: setups ($150,000; 500 setups), material handling ($60,000; 3,000 moves), and machining ($400,000; 20,000 machine hours). Product Delta (5,000 units) uses 40 setups, 600 moves, and 2,000 machine hours. What is Delta's overhead cost per unit under ABC?",
      ja: "ある会社は3つのコスト・プール(段取:$150,000/500回、運搬:$60,000/3,000回、機械加工:$400,000/20,000機械時間)による活動基準原価計算(ABC)を採用している。製品Delta(5,000個)は段取40回、運搬600回、機械時間2,000時間を使用した。ABCによるDeltaの1個当たり製造間接費はいくらか。",
      c: ["$12.80", "$12.20", "$8.00", "$15.20"],
      a: 0,
      ex: "活動率:段取$300、運搬$20、機械$20。Delta = 40 × 300 + 600 × 20 + 2,000 × 20 = 64,000 ÷ 5,000 = $12.80。$12.20は全間接費610,000を機械時間で一括配賦した伝統的方法による額。",
    },
    {
      q: "In the activity-based costing cost hierarchy, which of the following costs is best classified as a batch-level cost?",
      ja: "ABCの原価階層において、バッチ・レベルの原価に最も適切に分類されるのはどれか。",
      c: [
        "Engineering costs of maintaining a product's design specifications",
        "Machine setup costs incurred each time a production run begins",
        "Property taxes on the factory building",
        "Electricity consumed by machines in proportion to machine hours",
      ],
      a: 1,
      ex: "段取費は生産ロット(バッチ)ごとに発生し、ロット内の数量に依存しないためバッチ・レベル原価である。設計仕様の維持は製品維持レベル、固定資産税は施設維持レベル、機械の電力は単位レベル。",
    },
    {
      q: "A plant produces a high-volume standard product and a low-volume specialty product that requires many setups and engineering changes. The plant currently allocates all overhead on direct labor hours. If the plant adopts activity-based costing, the most likely result is that:",
      ja: "ある工場は大量生産の標準品と、多数の段取や設計変更を要する少量の特殊品を生産している。現在は全製造間接費を直接作業時間で配賦している。ABCを導入した場合に最も起こりうる結果はどれか。",
      c: [
        "The specialty product's unit cost will decrease and the standard product's unit cost will increase",
        "Both products' unit costs will increase because ABC identifies more overhead",
        "The specialty product's unit cost will increase and the standard product's unit cost will decrease",
        "Unit costs will not change because total overhead is unchanged",
      ],
      a: 2,
      ex: "操業度基準の配賦では、段取等のバッチ・製品レベル活動を多く消費する少量品が原価過小評価(内部補助)され、大量品が過大評価される。ABCはこれを是正し、特殊品の単価が上昇する。総間接費は同じでも配分が変わる。",
    },
    {
      q: "A company's purchasing department costs $240,000 per year and processes 4,000 purchase orders. Product A requires 900 purchase orders and 30,000 units are produced. Total production of all products is 120,000 units. What purchasing cost per unit should be assigned to Product A under ABC?",
      ja: "購買部門の年間コストは$240,000で、処理する発注書は4,000件である。製品Aは発注書900件を必要とし、生産量は30,000個である。全製品の生産量合計は120,000個である。ABCで製品Aに配賦される1個当たり購買コストはいくらか。",
      c: ["$2.00", "$60.00", "$0.45", "$1.80"],
      a: 3,
      ex: "活動率 = 240,000 ÷ 4,000 = $60/件。製品A = 900 × 60 = 54,000 ÷ 30,000 = $1.80。$2.00は生産量基準(240,000 ÷ 120,000)で配賦した額で、発注という原価作用因を無視している。",
    },
    {
      q: "Joint costs of $120,000 are incurred to produce 6,000 pounds of Product A and 4,000 pounds of Product B. Using the physical units method, how much joint cost is allocated to Product A?",
      ja: "結合原価$120,000で製品A 6,000ポンドと製品B 4,000ポンドが産出される。物量基準法による製品Aへの結合原価配分額はいくらか。",
      c: ["$72,000", "$48,000", "$60,000", "$40,000"],
      a: 0,
      ex: "A = 120,000 × 6,000 ÷ 10,000 = 72,000。$48,000はBへの配分額、$60,000は均等配分である。",
    },
    {
      q: "Joint costs of $120,000 produce 6,000 pounds of Product A with a sales value at split-off of $15 per pound and 4,000 pounds of Product B with a sales value at split-off of $45 per pound. Using the relative sales value at split-off method, how much joint cost is allocated to Product A?",
      ja: "結合原価$120,000で、分離点での販売価値が$15/ポンドの製品A 6,000ポンドと、$45/ポンドの製品B 4,000ポンドが産出される。分離点販売価値法による製品Aへの配分額はいくらか。",
      c: ["$72,000", "$80,000", "$40,000", "$60,000"],
      a: 2,
      ex: "販売価値:A = 90,000、B = 180,000、合計270,000。A = 120,000 × 90,000 ÷ 270,000 = 40,000。$72,000は物量基準、$80,000はBへの配分額。",
    },
    {
      q: "Joint costs are $90,000. Product X (5,000 units) requires $50,000 of further processing and sells for $34 per unit. Product Y (10,000 units) requires $30,000 of further processing and sells for $9 per unit. Neither product has a market at split-off. Using the net realizable value method, how much joint cost is allocated to Product X?",
      ja: "結合原価は$90,000である。製品X(5,000個)は追加加工費$50,000を要し、$34で販売される。製品Y(10,000個)は追加加工費$30,000を要し、$9で販売される。いずれも分離点での市場はない。正味実現可能価額(NRV)法による製品Xへの配分額はいくらか。",
      c: ["$58,846", "$60,000", "$45,000", "$30,000"],
      a: 1,
      ex: "NRV:X = 170,000 − 50,000 = 120,000、Y = 90,000 − 30,000 = 60,000、合計180,000。X = 90,000 × 120/180 = 60,000。$58,846は追加加工費を控除しない最終販売価値で按分した誤り、$30,000は物量基準。",
    },
    {
      q: "Product Z emerges from a joint process with 8,000 units and an allocated joint cost of $6 per unit. Z can be sold at split-off for $10 per unit, or processed further at an additional cost of $4 per unit and sold for $13 per unit. What should the company do?",
      ja: "製品Zは結合工程から8,000個産出され、配分された結合原価は1個$6である。Zは分離点で$10で販売するか、1個$4の追加加工を行い$13で販売できる。会社はどうすべきか。",
      c: [
        "Process further, because profit increases by $24,000",
        "Sell at split-off, because processing further would reduce profit by $8,000",
        "Process further, because the $13 price exceeds total cost of $10 per unit",
        "Sell at split-off, because processing further would reduce profit by $56,000",
      ],
      a: 1,
      ex: "結合原価は埋没原価で意思決定に無関連。追加収益3(13 − 10) < 追加原価4 → 1個当たり$1、8,000個で$8,000利益が減少する。$24,000は追加収益のみを見た誤り。",
    },
    {
      q: "A joint process costs $200,000 and yields main Products A and B and a by-product. The by-product's expected sales value is $18,000 with $3,000 of disposal costs, and the company reduces joint cost by the by-product's net realizable value. The remaining joint cost is allocated 60% to A and 40% to B based on relative sales value. How much joint cost is allocated to Product A?",
      ja: "結合工程の原価は$200,000で、主製品A・Bと副産物が産出される。副産物の見込販売価額は$18,000、処分費用は$3,000であり、会社は副産物のNRVを結合原価から控除している。残りの結合原価は相対的販売価値によりAに60%、Bに40%配分される。製品Aへの配分額はいくらか。",
      c: ["$120,000", "$109,200", "$74,000", "$111,000"],
      a: 3,
      ex: "副産物NRV = 18,000 − 3,000 = 15,000。A = (200,000 − 15,000) × 60% = 111,000。$109,200は処分費用を控除せず販売価額18,000を差し引いた誤り、$120,000は副産物を考慮しない額。",
    },
    {
      q: "A company's monthly utility costs were as follows: 3,000 units, $46,000; 4,000 units, $40,000; 6,500 units, $70,000; 8,000 units, $76,000. Using the high-low method, what are estimated total utility costs at 6,000 units?",
      ja: "月次の水道光熱費は次のとおりである:3,000個 $46,000、4,000個 $40,000、6,500個 $70,000、8,000個 $76,000。高低点法によると、6,000個のときの水道光熱費の見積総額はいくらか。",
      c: ["$58,000", "$57,000", "$64,000", "$92,000"],
      a: 2,
      ex: "高低点は操業度で選ぶ:(76,000 − 46,000) ÷ (8,000 − 3,000) = $6/個、固定費 = 76,000 − 48,000 = 28,000。6,000個 = 28,000 + 36,000 = 64,000。$58,000は原価の最低月(4,000個)を低点とした誤り。",
    },
    {
      q: "A regression of monthly overhead cost on machine hours produced: intercept $15,000 (t-statistic 1.2), slope $2.50 per machine hour (t-statistic 6.8), and R-squared of 0.72. Which conclusion is appropriate?",
      ja: "月次製造間接費を機械時間で回帰した結果、切片$15,000(t値1.2)、傾き$2.50/機械時間(t値6.8)、決定係数0.72であった。適切な結論はどれか。",
      c: [
        "Machine hours is a statistically significant cost driver because the slope's t-statistic exceeds 2",
        "72% of total overhead cost is variable",
        "The fixed cost estimate of $15,000 is statistically significant at the 95% level",
        "The correlation coefficient between overhead and machine hours is 0.72",
      ],
      a: 0,
      ex: "t値の絶対値がおおむね2を超えれば係数は有意である。傾きのt値6.8は有意、切片のt値1.2は有意でない。R² = 0.72は変動の72%が説明されることを意味し(変動費比率ではない)、相関係数は√0.72 ≈ 0.85。",
    },
    {
      q: "Within the relevant range, a company's total production cost is $70,000 at 10,000 units and its average cost is $6.00 per unit at 14,000 units. What is the company's total fixed cost?",
      ja: "関連範囲内において、ある会社の総製造原価は10,000個で$70,000、14,000個で1個当たり平均原価$6.00である。総固定費はいくらか。",
      c: ["$14,000", "$35,000", "$0", "$49,000"],
      a: 1,
      ex: "14,000個の総原価 = 84,000。変動費率 = (84,000 − 70,000) ÷ 4,000 = $3.50。固定費 = 70,000 − 35,000 = 35,000。単価が操業度で下がっている以上、固定費0は誤り。",
    },
    {
      q: "A company sells two products. Product A represents 60% of total sales dollars and has a contribution margin ratio of 40%; Product B represents 40% of sales dollars with a contribution margin ratio of 25%. Fixed costs are $510,000. What is breakeven sales in dollars, assuming the sales mix is constant?",
      ja: "2製品を販売する会社で、製品Aは売上高の60%を占め貢献利益率は40%、製品Bは売上高の40%で貢献利益率25%である。固定費は$510,000。売上構成が一定とすると、損益分岐点売上高はいくらか。",
      c: ["$1,569,231", "$1,275,000", "$2,040,000", "$1,500,000"],
      a: 3,
      ex: "加重平均貢献利益率 = 0.6 × 40% + 0.4 × 25% = 34%。510,000 ÷ 0.34 = 1,500,000。$1,569,231は単純平均32.5%を用いた誤り。",
    },
    {
      q: "A company sells Products X, Y, and Z in a constant unit mix of 1:2:2. Unit contribution margins are $20 for X, $10 for Y, and $5 for Z. Fixed costs are $300,000. How many units of Product Y must be sold to break even?",
      ja: "製品X・Y・Zを数量比1:2:2の一定構成で販売している。単位貢献利益はX $20、Y $10、Z $5。固定費は$300,000である。損益分岐点で販売すべき製品Yの数量はいくらか。",
      c: ["6,000", "24,000", "12,000", "30,000"],
      a: 2,
      ex: "1セット(X1・Y2・Z2)の貢献利益 = 20 + 20 + 10 = 50。セット数 = 300,000 ÷ 50 = 6,000。Y = 6,000 × 2 = 12,000。6,000はセット数、30,000は固定費をYの単位貢献利益だけで割った誤り。",
    },
    {
      q: "A product sells for $80 per unit with variable costs of $56 per unit. Fixed costs are $360,000. The income tax rate is 30%. How many units must be sold to earn after-tax income of $84,000?",
      ja: "製品の販売価格は$80、変動費は1個$56、固定費は$360,000、法人税率は30%である。税引後利益$84,000を達成するために必要な販売数量はいくらか。",
      c: ["18,500", "20,000", "19,550", "15,000"],
      a: 1,
      ex: "税引前利益 = 84,000 ÷ (1 − 0.3) = 120,000。(360,000 + 120,000) ÷ 24 = 20,000個。18,500は税引後利益をそのまま加えた誤り、19,550は84,000 × 1.3で税前換算した誤り。",
    },
    {
      q: "Budgeted sales are $900,000, and breakeven sales are $675,000. What is the margin of safety ratio?",
      ja: "予算売上高は$900,000、損益分岐点売上高は$675,000である。安全余裕率はいくらか。",
      c: ["75%", "33.3%", "25%", "20%"],
      a: 2,
      ex: "安全余裕額 = 900,000 − 675,000 = 225,000。安全余裕率 = 225,000 ÷ 900,000 = 25%。33.3%は損益分岐点売上高で割った誤り、75%は損益分岐点比率である。",
    },
    {
      q: "A company's contribution margin is $480,000 and operating income is $120,000. If sales volume increases by 15% with no change in prices or cost structure, what will operating income be?",
      ja: "ある会社の貢献利益は$480,000、営業利益は$120,000である。価格と原価構造が変わらず販売数量が15%増加した場合、営業利益はいくらになるか。",
      c: ["$138,000", "$192,000", "$552,000", "$72,000"],
      a: 1,
      ex: "営業レバレッジ係数(DOL) = 480,000 ÷ 120,000 = 4。営業利益の増加率 = 4 × 15% = 60% → 120,000 × 1.6 = 192,000(検算:貢献利益増加72,000)。$138,000は利益も15%増とした誤り、$72,000は増加額のみ。",
    },
    {
      q: "At current sales of $2,000,000, a company's degree of operating leverage is 5. What is the company's breakeven sales?",
      ja: "現在の売上高$2,000,000において、ある会社の営業レバレッジ係数は5である。損益分岐点売上高はいくらか。",
      c: ["$1,600,000", "$400,000", "$1,000,000", "$2,400,000"],
      a: 0,
      ex: "安全余裕率 = 1 ÷ DOL = 20%。安全余裕額 = 2,000,000 × 20% = 400,000。損益分岐点 = 2,000,000 − 400,000 = 1,600,000。$400,000は安全余裕額そのもの。",
    },
    {
      q: "A product sells for $25 per unit with variable costs of $15 per unit and fixed costs of $200,000. If variable costs increase to $17 per unit with no other changes, the new breakeven point in units is:",
      ja: "製品の販売価格は$25、変動費は1個$15、固定費は$200,000である。他の条件を変えずに変動費が1個$17に上昇した場合、新しい損益分岐点販売数量はいくらか。",
      c: ["20,000", "22,222", "11,765", "25,000"],
      a: 3,
      ex: "新しい単位貢献利益 = 25 − 17 = $8。200,000 ÷ 8 = 25,000個(従来は200,000 ÷ 10 = 20,000)。11,765は変動費で割った誤り。",
    },
    {
      q: "A company currently sells 20,000 units at $50 per unit; variable cost is $30 per unit and fixed costs are $250,000. Management expects that raising the price by 10% will reduce unit sales by 5%. What is the effect on operating income?",
      ja: "現在、1個$50で20,000個を販売しており、変動費は1個$30、固定費は$250,000である。経営者は価格を10%引き上げると販売数量が5%減少すると見込んでいる。営業利益への影響はいくらか。",
      c: ["Increase of $75,000", "Increase of $100,000", "Increase of $95,000", "Decrease of $25,000"],
      a: 0,
      ex: "現状:20,000 × 20 − 250,000 = 150,000。改定後:19,000 × (55 − 30) − 250,000 = 225,000。増加75,000。$100,000は数量減少を無視した誤り、$95,000は値上げ分(19,000 × 5)のみを見た誤り。",
    },
    {
      q: "A company sells two products in a constant mix. If the sales mix shifts toward the product with the lower contribution margin per unit, while selling prices, unit variable costs, and fixed costs remain unchanged, the company's breakeven point in total units will:",
      ja: "2製品を一定の構成で販売している会社で、販売価格・単位変動費・固定費は不変のまま、売上構成が単位貢献利益の低い製品の方へシフトした。総販売数量で見た損益分岐点はどうなるか。",
      c: ["Decrease", "Remain unchanged", "Increase", "Change in a direction that cannot be determined"],
      a: 2,
      ex: "加重平均単位貢献利益が低下するため、固定費を回収するのに必要な総数量が増加する。固定費が変わらなくても構成変化で損益分岐点は変わる。",
    },
    {
      q: "A company is choosing between two production methods. Method A has annual fixed costs of $200,000 and variable costs of $12 per unit. Method B has annual fixed costs of $320,000 and variable costs of $8 per unit. At what annual volume are total costs equal under the two methods?",
      ja: "2つの生産方法を比較している。方法Aは年間固定費$200,000、変動費1個$12。方法Bは年間固定費$320,000、変動費1個$8である。両方法の総原価が等しくなる年間生産量はいくらか。",
      c: ["16,667 units", "40,000 units", "26,667 units", "30,000 units"],
      a: 3,
      ex: "200,000 + 12X = 320,000 + 8X → 4X = 120,000 → X = 30,000個。これを超えると変動費の低いBが有利になる。40,000は320,000 ÷ 8で求めた誤り。",
    },
    {
      q: "In its first year of operations, a company produced 12,000 units and sold 10,000 units. Fixed manufacturing overhead was $240,000, and variable costing operating income was $150,000. What is absorption costing operating income?",
      ja: "操業1年目に12,000個を生産し、10,000個を販売した。固定製造間接費は$240,000、直接原価計算による営業利益は$150,000であった。全部原価計算による営業利益はいくらか。",
      c: ["$110,000", "$190,000", "$150,000", "$200,000"],
      a: 1,
      ex: "固定製造間接費配賦率 = 240,000 ÷ 12,000 = $20。期末在庫2,000個に繰り越される固定費 = 40,000。全部原価計算の利益 = 150,000 + 40,000 = 190,000。生産>販売なので全部原価の利益の方が大きい。",
    },
    {
      q: "A company uses FIFO. Beginning finished goods consisted of 3,000 units carrying fixed manufacturing overhead of $18 per unit; ending finished goods consist of 1,000 units carrying fixed manufacturing overhead of $20 per unit. Variable costing operating income is $500,000. What is absorption costing operating income?",
      ja: "FIFOを採用する会社で、期首製品3,000個には1個$18、期末製品1,000個には1個$20の固定製造間接費が含まれている。直接原価計算による営業利益は$500,000である。全部原価計算による営業利益はいくらか。",
      c: ["$464,000", "$460,000", "$534,000", "$466,000"],
      a: 3,
      ex: "差額 = 期末在庫の固定費(1,000 × 20 = 20,000) − 期首在庫の固定費(3,000 × 18 = 54,000) = −34,000。全部原価 = 500,000 − 34,000 = 466,000。$464,000は在庫減少2,000個に$18を掛けた簡便計算で単価の違いを無視した誤り。",
    },
    {
      q: "Per-unit costs are: direct materials $10, direct labor $6, variable manufacturing overhead $4, and variable selling expense $3. Fixed manufacturing overhead is $180,000 per year, and 30,000 units are produced. What is the unit product cost under variable costing?",
      ja: "1個当たり原価は直接材料費$10、直接労務費$6、変動製造間接費$4、変動販売費$3である。固定製造間接費は年$180,000で、生産量は30,000個。直接原価計算による製品単位原価はいくらか。",
      c: ["$20", "$23", "$26", "$29"],
      a: 0,
      ex: "直接原価計算の製品原価は変動製造原価のみ:10 + 6 + 4 = $20。変動販売費は製品原価ではなく期間費用($23は誤り)。$26は固定製造間接費$6を含めた全部原価計算の単位原価。",
    },
    {
      q: "In its first year, a company produced 25,000 units and sold 22,000 units. Variable manufacturing costs were $17 per unit, and fixed manufacturing overhead was $200,000. What is the cost of ending finished goods inventory under absorption costing?",
      ja: "操業1年目に25,000個を生産し22,000個を販売した。変動製造原価は1個$17、固定製造間接費は$200,000である。全部原価計算による期末製品棚卸高はいくらか。",
      c: ["$51,000", "$75,000", "$24,000", "$78,273"],
      a: 1,
      ex: "固定費単価 = 200,000 ÷ 25,000 = $8。全部原価の単位原価 = 17 + 8 = $25。期末3,000個 × 25 = 75,000。$51,000は直接原価計算による額、$78,273は販売数量(22,000)で固定費単価を計算した誤り。",
    },
    {
      q: "Which of the following statements about variable (direct) costing is correct?",
      ja: "直接原価計算(変動原価計算)に関する記述として正しいのはどれか。",
      c: [
        "It is required under U.S. GAAP for external financial reporting of inventory",
        "It treats fixed manufacturing overhead as a period cost, so operating income is not affected by changes in inventory levels",
        "It includes variable selling and administrative costs in inventory",
        "It reports higher operating income than absorption costing whenever production exceeds sales",
      ],
      a: 1,
      ex: "直接原価計算は固定製造間接費を期間費用とするため、利益は販売量に連動し在庫水準の影響を受けない。外部報告(GAAP)では全部原価計算が要求される。生産>販売のときは全部原価計算の利益の方が高い。",
    },
    {
      q: "A department uses FIFO process costing; materials are added at the start. Beginning WIP of 2,000 units (40% complete as to conversion) carried costs of $13,000. Current-period costs per equivalent unit are $4 for materials and $6 for conversion. During the period, 10,000 units were started and completed. What is the total cost of units transferred out?",
      ja: "FIFOによる総合原価計算で、材料は始点投入である。期首仕掛品2,000個(加工進捗度40%)の原価は$13,000。当期の換算量当たり単価は材料費$4、加工費$6である。当期着手完成品は10,000個。完成品(振替)原価合計はいくらか。",
      c: ["$120,000", "$113,000", "$120,200", "$125,000"],
      a: 2,
      ex: "期首仕掛品分:13,000 + 2,000 × 60% × 6 = 20,200(材料は始点投入済みで追加なし)。当期着手完成分:10,000 × (4 + 6) = 100,000。合計120,200。$125,000は期首仕掛品の残り作業を100%とした誤り。",
    },
    {
      q: "A company's contribution margin ratio is 35%, and fixed costs are $280,000. What sales revenue is required to earn pretax operating income of $70,000?",
      ja: "ある会社の貢献利益率は35%、固定費は$280,000である。税引前営業利益$70,000を達成するのに必要な売上高はいくらか。",
      c: ["$800,000", "$1,000,000", "$538,462", "$1,200,000"],
      a: 1,
      ex: "必要売上高 = (280,000 + 70,000) ÷ 0.35 = 1,000,000。$800,000は損益分岐点売上高(目標利益を加えていない)、$538,462は変動費率65%で割った誤り。",
    },
    {
      q: "In preparing a master budget, which budget must be completed before the direct materials purchases budget can be prepared?",
      ja: "総合予算(マスター・バジェット)の編成において、直接材料購買予算の前に完成させなければならない予算はどれか。",
      c: ["Cash budget", "Budgeted balance sheet", "Production budget", "Selling and administrative expense budget"],
      a: 2,
      ex: "編成順序は販売予算 → 製造(生産)予算 → 直接材料・直接労務・製造間接費予算 → 売上原価予算 → 現金予算 → 予算財務諸表。材料購買量は生産量に基づく。現金予算や予算貸借対照表は後工程である。",
    },
    {
      q: "Budgeted unit sales are 50,000 for the second quarter and 60,000 for the third quarter. The company's policy is to maintain finished goods inventory at the end of each quarter equal to 20% of the following quarter's budgeted sales. How many units should be produced in the second quarter?",
      ja: "予算販売数量は第2四半期50,000個、第3四半期60,000個である。各四半期末の製品在庫は翌四半期の予算販売量の20%とする方針である。第2四半期の生産量はいくらか。",
      c: ["50,000", "48,000", "62,000", "52,000"],
      a: 3,
      ex: "期末在庫 = 60,000 × 20% = 12,000、期首在庫 = 50,000 × 20% = 10,000。生産量 = 50,000 + 12,000 − 10,000 = 52,000。48,000は期首・期末を逆に扱った誤り。",
    },
    {
      q: "Second-quarter production is budgeted at 52,000 units and third-quarter production at 58,000 units. Each unit requires 3 pounds of material costing $2 per pound. Ending raw materials inventory must equal 10% of the following quarter's production needs, and beginning raw materials inventory for the second quarter is 15,600 pounds. What is the budgeted cost of materials purchases for the second quarter?",
      ja: "製造予算は第2四半期52,000個、第3四半期58,000個である。製品1個に材料3ポンド(1ポンド$2)を要する。材料の期末在庫は翌四半期の所要量の10%とし、第2四半期の期首材料在庫は15,600ポンドである。第2四半期の材料購入予算額はいくらか。",
      c: ["$315,600", "$312,000", "$308,400", "$346,800"],
      a: 0,
      ex: "所要量 = 52,000 × 3 = 156,000ポンド。期末在庫 = 58,000 × 3 × 10% = 17,400。購入量 = 156,000 + 17,400 − 15,600 = 157,800 × $2 = 315,600。$308,400は期首・期末の加減を逆にした誤り。",
    },
    {
      q: "Purchases on account are budgeted at $80,000 for April and $100,000 for May. The company pays 40% of purchases in the month of purchase, taking a 2% discount on those payments, and pays the remaining 60% in the following month (no discount). What are budgeted cash disbursements for purchases in May?",
      ja: "掛仕入予算は4月$80,000、5月$100,000である。会社は仕入の40%を当月に支払い(その支払について2%の割引を受ける)、残り60%を翌月に支払う(割引なし)。5月の仕入に係る現金支出予算はいくらか。",
      c: ["$88,000", "$92,000", "$87,200", "$98,000"],
      a: 2,
      ex: "5月仕入の当月支払 = 100,000 × 40% × 98% = 39,200。4月仕入の翌月支払 = 80,000 × 60% = 48,000。合計87,200。$88,000は割引を無視、$92,000は当月・翌月の比率を逆にした誤り。",
    },
    {
      q: "For June, a company budgets a beginning cash balance of $25,000, cash receipts of $180,000, and cash disbursements of $210,000. It must maintain a minimum cash balance of $20,000 and can borrow only in multiples of $5,000. How much should the company plan to borrow in June?",
      ja: "6月の予算は期首現金残高$25,000、現金収入$180,000、現金支出$210,000である。最低現金残高$20,000を維持する必要があり、借入は$5,000単位でのみ可能である。6月の借入予定額はいくらか。",
      c: ["$5,000", "$25,000", "$30,000", "$20,000"],
      a: 1,
      ex: "資金調達前残高 = 25,000 + 180,000 − 210,000 = −5,000。最低残高20,000を確保するには25,000の借入が必要(5,000の倍数を満たす)。$5,000は不足額の補填のみで最低残高を無視した誤り。",
    },
    {
      q: "A company's flexible budget formula for manufacturing costs is $80,000 per month plus $6 per unit. The static budget was based on 10,000 units. Actual production was 11,000 units, and actual manufacturing costs were $152,000. What is the flexible budget variance for manufacturing costs?",
      ja: "製造原価の変動予算式は月$80,000 + 1個$6である。固定予算は10,000個に基づいていた。実際生産量は11,000個、実際製造原価は$152,000であった。製造原価の変動予算差異はいくらか。",
      c: ["$12,000 unfavorable", "$6,000 favorable", "$6,000 unfavorable", "$0"],
      a: 2,
      ex: "実際操業度での変動予算 = 80,000 + 6 × 11,000 = 146,000。差異 = 152,000 − 146,000 = 6,000(不利)。$12,000は固定予算(140,000)との比較で、操業度の違いが混入している。",
    },
    {
      q: "The difference between the flexible budget amount at actual volume and the static (master) budget amount is best described as the:",
      ja: "実際操業度における変動予算額と固定予算(マスター・バジェット)額との差は、何と呼ばれるか。",
      c: ["Flexible budget variance", "Sales volume (activity) variance", "Spending variance", "Efficiency variance"],
      a: 1,
      ex: "変動予算と固定予算の差は販売数量(操業度)差異であり、計画と異なる数量を販売した影響を示す。実際額と変動予算の差は変動予算差異(価格・効率の差異に分解される)。",
    },
    {
      q: "Budgeted manufacturing overhead for March is $90,000, which includes $15,000 of depreciation on factory equipment and $5,000 of expired prepaid insurance paid in January. All other overhead is paid in the month incurred. What amount of overhead should appear as a cash disbursement in the March cash budget?",
      ja: "3月の予算製造間接費は$90,000で、工場設備の減価償却費$15,000と1月に支払済みの前払保険料の期間経過分$5,000を含む。その他の製造間接費は発生月に支払われる。3月の現金予算に計上すべき製造間接費の現金支出額はいくらか。",
      c: ["$70,000", "$75,000", "$85,000", "$90,000"],
      a: 0,
      ex: "非資金費用(減価償却15,000)と既支払分の費用化(保険5,000)を除く:90,000 − 15,000 − 5,000 = 70,000。$75,000は減価償却のみ控除した誤り。",
    },
    {
      q: "The standard is 5 pounds of material per unit at $3.00 per pound. During the month, 2,000 units were produced. The company purchased 12,000 pounds for $37,200 and used 10,500 pounds. What is the direct materials quantity (usage) variance?",
      ja: "標準は製品1個当たり材料5ポンド、1ポンド$3.00である。当月の生産量は2,000個。材料12,000ポンドを$37,200で購入し、10,500ポンドを消費した。直接材料数量差異はいくらか。",
      c: ["$1,550 unfavorable", "$6,000 unfavorable", "$1,500 favorable", "$1,500 unfavorable"],
      a: 3,
      ex: "標準消費量 = 2,000 × 5 = 10,000ポンド。数量差異 = (10,500 − 10,000) × 標準価格3.00 = 1,500(不利)。$1,550は実際価格(3.10)を用いた誤り、$6,000は購入量で計算した誤り。",
    },
    {
      q: "The labor standard is 2 hours per unit at $22 per hour. During the period 3,000 units were produced using 5,800 direct labor hours at a total cost of $124,700. What is the direct labor efficiency variance?",
      ja: "労務標準は製品1個当たり2時間、時給$22である。当期は3,000個を生産し、直接作業時間5,800時間、総額$124,700を要した。直接作業時間差異(能率差異)はいくらか。",
      c: ["$4,400 favorable", "$4,300 favorable", "$4,400 unfavorable", "$2,900 favorable"],
      a: 0,
      ex: "標準時間 = 3,000 × 2 = 6,000。能率差異 = (5,800 − 6,000) × 22 = 4,400(有利)。$4,300は実際賃率21.50を用いた誤り、$2,900は賃率差異(5,800 × 0.50 有利)。",
    },
    {
      q: "The standard labor rate is $20 per hour. Workers worked 6,000 actual hours, and the labor rate variance was $3,000 unfavorable. What was the actual labor rate per hour?",
      ja: "標準賃率は時給$20である。実際作業時間は6,000時間、賃率差異は$3,000(不利)であった。実際賃率はいくらか。",
      c: ["$19.50", "$20.50", "$20.05", "$23.00"],
      a: 1,
      ex: "賃率差異 = 実際時間 × (実際賃率 − 標準賃率) → 3,000 = 6,000 × (AR − 20) → AR = $20.50。不利差異なので実際賃率は標準より高い($19.50は誤り)。",
    },
    {
      q: "Variable overhead is applied at $6 per machine hour. During the month, 9,200 actual machine hours were used, 9,500 standard machine hours were allowed for actual output, and actual variable overhead was $57,000. What is the variable overhead spending variance?",
      ja: "変動製造間接費は機械時間1時間当たり$6で配賦される。当月の実際機械時間は9,200時間、実際生産量に対する標準機械時間は9,500時間、実際変動製造間接費は$57,000であった。変動製造間接費の予算差異(spending variance)はいくらか。",
      c: ["$1,800 favorable", "$0", "$3,600 unfavorable", "$1,800 unfavorable"],
      a: 3,
      ex: "予算差異 = 57,000 − 9,200 × 6 (55,200) = 1,800(不利)。能率差異 = (9,200 − 9,500) × 6 = 1,800(有利)。合計0であり、$0は総差異を答えた誤り。",
    },
    {
      q: "Budgeted fixed manufacturing overhead is $300,000, based on a denominator activity of 50,000 direct labor hours. Actual fixed overhead was $306,000, and 46,000 standard direct labor hours were allowed for actual output. What are the fixed overhead spending (budget) and production-volume variances?",
      ja: "予算固定製造間接費は$300,000で、基準操業度は直接作業50,000時間である。実際固定製造間接費は$306,000、実際生産量に対する標準直接作業時間は46,000時間であった。固定製造間接費の予算差異と操業度差異はいくらか。",
      c: [
        "Spending $6,000 U; volume $24,000 U",
        "Spending $30,000 U; volume $0",
        "Spending $6,000 U; volume $24,000 F",
        "Spending $24,000 U; volume $6,000 U",
      ],
      a: 0,
      ex: "予算差異 = 306,000 − 300,000 = 6,000(不利)。配賦率 = $6/時間、配賦額 = 46,000 × 6 = 276,000。操業度差異 = 300,000 − 276,000 = 24,000(不利、基準操業度を下回ったため)。",
    },
    {
      q: "Which statement best describes the fixed overhead production-volume variance?",
      ja: "固定製造間接費の操業度差異の説明として最も適切なのはどれか。",
      c: [
        "It measures the difference between actual and budgeted fixed overhead spending and is controllable by department managers",
        "It arises because fixed overhead is unitized at a denominator level that differs from the standard hours allowed for actual output",
        "It measures the efficiency with which the allocation base was used",
        "It is always unfavorable when actual output exceeds the denominator level",
      ],
      a: 1,
      ex: "操業度差異は固定費を基準操業度で単位化(配賦率化)したことにより、実際産出の標準時間と基準操業度が異なると生じる。支出の管理可能性を示すものではない(それは予算差異)。実際産出が基準を上回れば有利差異となる。",
    },
    {
      q: "A company budgeted sales of 10,000 units at $50 per unit with a standard contribution margin of $18 per unit. It actually sold 9,500 units at $48 per unit. What is the sales volume variance measured in contribution margin?",
      ja: "販売予算は10,000個、単価$50、標準単位貢献利益$18であった。実際には9,500個を単価$48で販売した。貢献利益ベースの販売数量差異はいくらか。",
      c: ["$25,000 unfavorable", "$19,000 unfavorable", "$9,000 favorable", "$9,000 unfavorable"],
      a: 3,
      ex: "販売数量差異 = (9,500 − 10,000) × 標準貢献利益18 = 9,000(不利)。$25,000は売上高ベース(×50)、$19,000は販売価格差異(9,500 × 2 不利)である。",
    },
    {
      q: "A company budgeted a sales mix of 60% Product A (standard contribution margin $20 per unit) and 40% Product B ($10 per unit). It actually sold 10,000 total units, 50% A and 50% B. What is the sales mix variance?",
      ja: "予算売上構成は製品A(標準単位貢献利益$20)60%、製品B($10)40%であった。実際の総販売数量は10,000個で、A・Bが各50%であった。セールス・ミックス差異はいくらか。",
      c: ["$10,000 favorable", "$10,000 unfavorable", "$20,000 unfavorable", "$30,000 unfavorable"],
      a: 1,
      ex: "ミックス差異 = 実際総数量 × (実際構成比 − 予算構成比) × 標準貢献利益:A 10,000 × (−10%) × 20 = −20,000、B 10,000 × (+10%) × 10 = +10,000。合計10,000(不利)。高貢献利益品の比率が下がったため不利となる。",
    },
    {
      q: "During the month a company reported a large favorable direct materials price variance and a large unfavorable direct materials quantity variance. Which explanation is most consistent with these results?",
      ja: "当月、大きな有利の直接材料価格差異と、大きな不利の直接材料数量差異が報告された。これらの結果と最も整合的な説明はどれか。",
      c: [
        "The purchasing manager bought lower-quality material at a discount, causing more waste in production",
        "Production workers were more skilled than standard, reducing material usage",
        "A supplier raised prices, and the company reduced scrap",
        "Production volume was lower than budgeted",
      ],
      a: 0,
      ex: "低品質の安価な材料の購入は価格差異を有利にし、仕損・歩留悪化で数量差異を不利にする典型例である。生産量の低下は数量差異の原因とならない(標準消費量は実際産出量に基づくため)。",
    },
    {
      q: "The standard is 3 pounds of material per unit at $4 per pound. During the period 5,000 units were produced, and the direct materials quantity variance was $2,400 favorable. How many pounds of material were used?",
      ja: "標準は製品1個当たり材料3ポンド、1ポンド$4である。当期の生産量は5,000個で、直接材料数量差異は$2,400(有利)であった。実際消費量は何ポンドか。",
      c: ["15,600", "14,400", "15,000", "14,600"],
      a: 1,
      ex: "標準消費量 = 5,000 × 3 = 15,000。差異量 = 2,400 ÷ 4 = 600ポンド。有利なので実際消費量は少ない:15,000 − 600 = 14,400。15,600は有利・不利を逆にした誤り。",
    },
  ],
});

CPA.tbs({ id: "TBS-BAR-12", section: "BAR", chapter: "BAR-01", title: "総合原価計算(平均法とFIFO)",
  scenario: `<p>Kurobe Co. manufactures a single product in one department. Materials are added at the beginning of the process; conversion costs are incurred evenly. Data for March:</p>
<table><tr><th>Item</th><th>Units</th><th>Conversion % complete</th><th>Materials cost</th><th>Conversion cost</th></tr>
<tr><td>Beginning WIP</td><td>4,000</td><td>50%</td><td>$16,000</td><td>$9,000</td></tr>
<tr><td>Started during March</td><td>36,000</td><td>—</td><td>$162,000</td><td>$287,000</td></tr>
<tr><td>Ending WIP</td><td>5,000</td><td>40%</td><td>—</td><td>—</td></tr></table>
<p>Round cost per equivalent unit to the nearest cent.</p>
<p class="ja">黒部社は単一工程で単一製品を製造している。材料は工程の始点で投入され、加工費は均等に発生する。3月のデータは上表のとおり(期首仕掛品4,000個・加工進捗度50%・材料費$16,000・加工費$9,000、当期着手36,000個・当期材料費$162,000・当期加工費$287,000、期末仕掛品5,000個・加工進捗度40%)。換算量当たり単価はセント単位に四捨五入する。</p>`,
  rows: [
    { label: "Equivalent units for conversion — weighted average(平均法の加工費換算量)", type: "num", answer: 37000 },
    { label: "Equivalent units for conversion — FIFO(FIFOの加工費換算量)", type: "num", answer: 35000 },
    { label: "Materials cost per equivalent unit — weighted average(平均法の材料費単価)", type: "num", answer: 4.45, tol: 0.01 },
    { label: "Conversion cost per equivalent unit — FIFO(FIFOの加工費単価)", type: "num", answer: 8.2, tol: 0.01 },
    { label: "Cost of units transferred out — weighted average(平均法の完成品原価)", type: "num", answer: 435750, tol: 1 },
    { label: "Cost of ending WIP — weighted average(平均法の期末仕掛品原価)", type: "num", answer: 38250, tol: 1 },
  ],
  explain: `<p>完成品 = 4,000 + 36,000 − 5,000 = 35,000個。</p>
<p>平均法の換算量:材料 = 35,000 + 5,000 = 40,000、加工費 = 35,000 + 5,000 × 40% = 37,000。</p>
<p>FIFOの加工費換算量 = 期首分 4,000 × 50% = 2,000 + 当期着手完成 31,000 + 期末 2,000 = 35,000(平均法との差は期首仕掛品の前期作業分2,000)。</p>
<p>平均法の単価:材料 (16,000 + 162,000) ÷ 40,000 = $4.45、加工費 (9,000 + 287,000) ÷ 37,000 = $8.00。FIFOの加工費単価 = 287,000 ÷ 35,000 = $8.20。</p>
<p>平均法の完成品原価 = 35,000 × (4.45 + 8.00) = 435,750。期末仕掛品 = 5,000 × 4.45 + 2,000 × 8.00 = 22,250 + 16,000 = 38,250。検算:435,750 + 38,250 = 474,000 = 原価合計。</p>`,
});

CPA.tbs({ id: "TBS-BAR-13", section: "BAR", chapter: "BAR-01", title: "複数製品のCVP分析",
  scenario: `<p>Aoba Inc. sells two products in a constant sales mix of 3 units of Standard for every 1 unit of Deluxe.</p>
<table><tr><th></th><th>Standard</th><th>Deluxe</th></tr>
<tr><td>Selling price per unit</td><td>$40</td><td>$70</td></tr>
<tr><td>Variable cost per unit</td><td>$24</td><td>$40</td></tr></table>
<p>Annual fixed costs are $468,000, and the income tax rate is 30%. Management's target after-tax income is $109,200. The current sales plan is 30,000 units of Standard and 10,000 units of Deluxe.</p>
<p class="ja">青葉社は2製品をStandard 3個に対しDeluxe 1個の一定構成で販売している。販売単価はStandard $40・Deluxe $70、単位変動費は$24・$40。年間固定費は$468,000、税率30%。経営者の目標税引後利益は$109,200。現行の販売計画はStandard 30,000個、Deluxe 10,000個である。</p>`,
  rows: [
    { label: "Breakeven units of Standard(損益分岐点のStandard販売数量)", type: "num", answer: 18000 },
    { label: "Breakeven units of Deluxe(損益分岐点のDeluxe販売数量)", type: "num", answer: 6000 },
    { label: "Breakeven sales in dollars(損益分岐点売上高)", type: "num", answer: 1140000 },
    { label: "Units of Standard needed to earn the target after-tax income(目標税引後利益達成に必要なStandard数量)", type: "num", answer: 24000 },
    { label: "Degree of operating leverage at the current sales plan(現行計画での営業レバレッジ係数)", type: "num", answer: 2.5, tol: 0.01 },
    { label: "Margin of safety ratio at the current sales plan, in % (現行計画での安全余裕率、%)", type: "num", answer: 40, tol: 0.1 },
  ],
  explain: `<p>単位貢献利益:Standard $16、Deluxe $30。1セット(S3・D1)の貢献利益 = 48 + 30 = $78。</p>
<p>損益分岐点セット数 = 468,000 ÷ 78 = 6,000 → Standard 18,000個、Deluxe 6,000個。売上高 = 18,000 × 40 + 6,000 × 70 = 720,000 + 420,000 = 1,140,000。</p>
<p>目標税引前利益 = 109,200 ÷ 0.7 = 156,000。必要セット数 = (468,000 + 156,000) ÷ 78 = 8,000 → Standard 24,000個。</p>
<p>現行計画 = 10,000セット:貢献利益780,000、営業利益312,000。DOL = 780,000 ÷ 312,000 = 2.5。安全余裕率 = (10,000 − 6,000) ÷ 10,000 = 40%(= 1 ÷ DOL で検算可)。</p>`,
});

CPA.tbs({ id: "TBS-BAR-14", section: "BAR", chapter: "BAR-01", title: "直接材料・直接労務費の差異分析と販売数量差異",
  scenario: `<p>Minato Corp. uses a standard costing system. Standards per unit of product:</p>
<table><tr><th>Input</th><th>Standard quantity</th><th>Standard price</th></tr>
<tr><td>Direct materials</td><td>4 pounds</td><td>$5.00 per pound</td></tr>
<tr><td>Direct labor</td><td>1.5 hours</td><td>$24.00 per hour</td></tr></table>
<p>The master budget called for sales of 8,000 units; the standard contribution margin is $45 per unit. Actual results for the period:</p>
<ul><li>Produced and sold 8,400 units.</li>
<li>Purchased 36,000 pounds of material for $176,400; used 34,200 pounds. The materials price variance is recognized at the time of purchase.</li>
<li>Worked 12,300 direct labor hours at a total cost of $300,120.</li></ul>
<p>Enter variance amounts as positive numbers.</p>
<p class="ja">湊社は標準原価計算を採用している。製品1個当たりの標準は直接材料4ポンド(@$5.00)、直接作業1.5時間(@$24.00)。マスター・バジェットの販売数量は8,000個、標準単位貢献利益は$45。実績:8,400個を生産・販売。材料36,000ポンドを$176,400で購入し34,200ポンドを消費(価格差異は購入時に認識)。直接作業12,300時間、総額$300,120。差異は正の数で入力する。</p>`,
  rows: [
    { label: "Direct materials price variance (favorable)(直接材料価格差異・有利)", type: "num", answer: 3600 },
    { label: "Direct materials quantity variance (unfavorable)(直接材料数量差異・不利)", type: "num", answer: 3000 },
    { label: "Direct labor rate variance (unfavorable)(賃率差異・不利)", type: "num", answer: 4920 },
    { label: "Direct labor efficiency variance (favorable)(作業時間差異・有利)", type: "num", answer: 7200 },
    { label: "Net direct labor variance(直接労務費差異の純額の方向)", type: "select", options: ["Favorable", "Unfavorable", "Zero"], answer: "Favorable" },
    { label: "Sales volume variance in contribution margin (favorable)(貢献利益ベースの販売数量差異・有利)", type: "num", answer: 18000 },
  ],
  explain: `<p>材料:実際購入単価 = 176,400 ÷ 36,000 = $4.90。価格差異(購入時)= 36,000 × (5.00 − 4.90) = 3,600 有利。標準消費量 = 8,400 × 4 = 33,600、数量差異 = (34,200 − 33,600) × 5 = 3,000 不利。</p>
<p>労務:実際賃率 = 300,120 ÷ 12,300 = $24.40。賃率差異 = 12,300 × 0.40 = 4,920 不利。標準時間 = 8,400 × 1.5 = 12,600、作業時間差異 = (12,300 − 12,600) × 24 = 7,200 有利。純額 = 2,280 有利。</p>
<p>販売数量差異 = (8,400 − 8,000) × 45 = 18,000 有利。</p>`,
});
