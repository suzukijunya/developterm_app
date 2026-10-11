// FAR の追加問題(第2弾:応用・計算中心)

CPA.extend("FAR-01", {
  mcq: [
    {
      q: "In Year 3, a company changed its inventory method from weighted-average to FIFO. Retained earnings at January 1, Year 3, as previously reported, was $500,000. Had FIFO been used in all prior years, pretax income would have been $40,000 higher in total. The tax rate is 25%, and only Year 3 is presented. What is the adjusted January 1, Year 3, retained earnings balance?",
      ja: "3年目に、ある会社が棚卸資産の評価方法を加重平均法からFIFOに変更した。3年目1月1日の利益剰余金(変更前の報告額)は$500,000。過去すべての年でFIFOを使っていれば、税引前利益は合計で$40,000多かった。税率25%、表示するのは3年目のみである。修正後の3年目1月1日の利益剰余金はいくらか。",
      c: ["$500,000", "$530,000", "$540,000", "$510,000"],
      a: 1,
      ex: "会計方針の変更は遡及適用。累積影響額を税引後で期首利益剰余金に加える:40,000 ×(1 − 25%)= 30,000。500,000 + 30,000 = $530,000。",
    },
    {
      q: "In Year 2, a company discovered that Year 1 depreciation expense of $20,000 was never recorded. The tax rate is 25%. How should the error be reported in the Year 2 financial statements?",
      ja: "2年目に、1年目の減価償却費$20,000が計上されていなかったことが判明した。税率は25%。2年目の財務諸表でこの誤謬はどのように報告すべきか。",
      c: [
        "As a $20,000 expense in Year 2 income",
        "As a $15,000 decrease to beginning retained earnings (prior period adjustment)",
        "As a $15,000 loss in other comprehensive income",
        "As a $20,000 increase to beginning retained earnings",
      ],
      a: 1,
      ex: "過去の誤謬は前期修正として期首利益剰余金を修正する。減価償却費の計上もれは利益の過大計上なので、税引後 20,000 × 75% = $15,000 を期首利益剰余金から減らす。",
    },
    {
      q: "A component that qualifies as a discontinued operation had a pretax operating loss of $300,000 for the year and a pretax loss on disposal of $200,000. The tax rate is 25%. What amount should be reported as the loss from discontinued operations?",
      ja: "非継続事業に該当する構成単位の当期の税引前営業損失は$300,000、処分による税引前損失は$200,000である。税率は25%。非継続事業からの損失としていくら報告すべきか。",
      c: ["$500,000", "$375,000", "$225,000", "$150,000"],
      a: 1,
      ex: "営業損失と処分損失を合計し、税引後で表示する。(300,000 + 200,000)× 75% = $375,000。",
    },
    {
      q: "When an available-for-sale debt security with a previously unrealized holding gain recorded in accumulated other comprehensive income is sold, the gain previously recorded in OCI is:",
      ja: "過去に未実現保有利益をその他の包括利益累計額に計上していた売却可能負債証券を売却した場合、OCIに計上済みの利益はどう扱われるか。",
      c: [
        "Left in accumulated OCI permanently",
        "Reclassified out of accumulated OCI into net income",
        "Transferred directly to retained earnings",
        "Reported as a prior period adjustment",
      ],
      a: 1,
      ex: "売却で実現した利益は、OCI累計額から当期純利益へ組み替える(reclassification adjustment)。二重計上を避けるため、OCIでは同額を減らす。",
    },
    {
      q: "Under U.S. GAAP, management must evaluate whether there is substantial doubt about the entity's ability to continue as a going concern within what period?",
      ja: "US GAAPにおいて、経営者は継続企業の前提に関する重要な疑義を、どの期間について評価しなければならないか。",
      c: [
        "Within one year after the balance sheet date",
        "Within one year after the date the financial statements are issued (or available to be issued)",
        "Within two years after the balance sheet date",
        "Only through the end of the next interim period",
      ],
      a: 1,
      ex: "ASC 205-40では、財務諸表の発行日(または発行可能日)から1年以内について評価する。監査基準でも同じ期間を使う。",
    },
    {
      q: "In interim financial reports, income tax expense for an interim period is generally computed using:",
      ja: "期中財務報告において、期中の法人税費用は一般にどのように計算するか。",
      c: [
        "The statutory tax rate applied to interim pretax income",
        "The estimated annual effective tax rate applied to year-to-date pretax income",
        "The prior year's actual effective tax rate",
        "Actual taxes paid during the interim period",
      ],
      a: 1,
      ex: "期中報告は年度の一部とみなす(integral view)ため、見積年間実効税率を累計の税引前利益に掛けて計算する。",
    },
  ],
});

CPA.extend("FAR-02", {
  mcq: [
    {
      q: "A contractor has a $1,000,000 fixed-price contract and measures progress using costs incurred relative to total estimated costs. Total estimated costs are $800,000, and costs incurred in Year 1 are $200,000. How much revenue should be recognized in Year 1?",
      ja: "請負業者は$1,000,000の固定価格契約を結び、発生原価の見積総原価に対する割合で進捗度を測定している。見積総原価は$800,000、1年目の発生原価は$200,000である。1年目に認識すべき収益はいくらか。",
      c: ["$200,000", "$250,000", "$300,000", "$1,000,000"],
      a: 1,
      ex: "進捗度 = 200,000 ÷ 800,000 = 25%。収益 = 1,000,000 × 25% = $250,000(利益は 250,000 − 200,000 = 50,000)。",
    },
    {
      q: "A contractor has a $500,000 contract recognized over time. At the end of Year 1, costs incurred are $135,000 and estimated total costs are $540,000. What gross profit (loss) should be recognized in Year 1?",
      ja: "請負業者は一定期間にわたり収益を認識する$500,000の契約を結んでいる。1年目末の発生原価は$135,000、見積総原価は$540,000である。1年目に認識すべき売上総利益(損失)はいくらか。",
      c: ["$(10,000)", "$(40,000)", "$0", "$(30,000)"],
      a: 1,
      ex: "見積総原価が契約価格を上回る損失契約では、見込まれる損失の全額を直ちに認識する。540,000 − 500,000 = $40,000 の損失(進捗度に応じた按分はしない)。",
    },
    {
      q: "A company sells 1,000 units at $100 each with a right of return. Based on experience, it expects 5% of the units to be returned. How much revenue should be recognized at the time of sale?",
      ja: "ある会社は返品権付きで1個$100の製品を1,000個販売した。経験から5%が返品されると見込んでいる。販売時に認識すべき収益はいくらか。",
      c: ["$100,000", "$95,000", "$5,000", "$0 until the return period expires"],
      a: 1,
      ex: "返品が見込まれる部分は収益に含めず、返金負債とする。100,000 × 95% = $95,000 を収益、$5,000 を返金負債(返品資産も計上)。",
    },
    {
      q: "For a bill-and-hold arrangement to result in revenue recognition before delivery, which of the following is NOT required?",
      ja: "請求済未出荷契約(bill-and-hold)で引渡し前に収益を認識するために、必要とされないものはどれか。",
      c: [
        "The reason for the arrangement is substantive",
        "The product is identified separately as belonging to the customer",
        "The product is ready for physical transfer to the customer",
        "The customer has paid the full contract price in advance",
      ],
      a: 3,
      ex: "要件は、合理的な理由がある、顧客の製品として区分されている、物理的に引き渡せる状態にある、他の顧客に使えない、の4つ。全額前払いは要件ではない。",
    },
    {
      q: "A license that gives the customer a right to access the entity's intellectual property as it exists throughout the license period (such as a brand name) is recognized:",
      ja: "ライセンス期間を通じて存在する企業の知的財産にアクセスする権利(ブランド名など)を顧客に与えるライセンスの収益は、どのように認識されるか。",
      c: ["At the point in time the license is granted", "Over time throughout the license period", "Only when royalties are collected", "When the license expires"],
      a: 1,
      ex: "アクセスする権利(象徴的な知的財産)は期間にわたり認識。機能的な知的財産を使用する権利(ソフトウェアなど)は付与時点で認識する。",
    },
    {
      q: "A retailer sells gift cards and expects a portion of them never to be redeemed (breakage). If the retailer expects to be entitled to breakage, it should recognize the expected breakage amount:",
      ja: "小売業者はギフトカードを販売しており、一部は使われないと見込んでいる(非行使部分)。小売業者が非行使部分に対する権利を得ると見込む場合、見込まれる非行使額はどう認識すべきか。",
      c: [
        "Immediately when the gift cards are sold",
        "In proportion to the pattern of rights exercised by customers",
        "Only when the gift cards legally expire",
        "Never; it is always remitted to the state",
      ],
      a: 1,
      ex: "顧客の権利行使(カードの使用)のパターンに比例して非行使部分を収益に認識する。権利を得ると見込めない場合は、行使の可能性がほぼなくなった時点で認識する。",
    },
  ],
});

CPA.extend("FAR-03", {
  mcq: [
    {
      q: "A company estimates inventory destroyed in a fire using the gross profit method. Beginning inventory was $100,000, purchases were $400,000, sales were $600,000, and the gross profit rate is 30% of sales. What is the estimated cost of inventory on hand?",
      ja: "ある会社は火災で焼失した棚卸資産を売上総利益率法で見積もっている。期首棚卸高$100,000、仕入高$400,000、売上高$600,000、売上総利益率は売上の30%。手元にあった棚卸資産の原価の見積額はいくらか。",
      c: ["$80,000", "$180,000", "$100,000", "$20,000"],
      a: 0,
      ex: "売上原価の見積 = 600,000 ×(1 − 30%)= 420,000。販売可能額 100,000 + 400,000 = 500,000 から差し引き、500,000 − 420,000 = $80,000。",
    },
    {
      q: "During construction of a building for its own use, a company had weighted-average accumulated expenditures of $1,000,000. It has a $600,000 specific construction loan at 8% and other general debt at 10%. Total actual interest incurred was $150,000. What is the amount of interest to capitalize?",
      ja: "自社使用の建物の建設期間中、加重平均累積支出額は$1,000,000だった。建設専用借入金$600,000(8%)と、その他の一般借入金(10%)がある。実際の支払利息の総額は$150,000。資本化すべき利息はいくらか。",
      c: ["$80,000", "$88,000", "$100,000", "$150,000"],
      a: 1,
      ex: "回避可能利息 = 600,000 × 8% + (1,000,000 − 600,000)× 10% = 48,000 + 40,000 = $88,000。実際の支払利息150,000を超えないので全額資本化する。",
    },
    {
      q: "A machine costing $100,000 with a salvage value of $10,000 is expected to produce 300,000 units. In Year 1, it produced 60,000 units. Using the units-of-production method, what is Year 1 depreciation?",
      ja: "取得原価$100,000、残存価額$10,000の機械は、30万個を生産すると見込まれている。1年目の生産量は6万個だった。生産高比例法による1年目の減価償却費はいくらか。",
      c: ["$20,000", "$18,000", "$10,000", "$12,000"],
      a: 1,
      ex: "1個あたりの償却額 =(100,000 − 10,000)÷ 300,000 = $0.30。60,000 × 0.30 = $18,000。",
    },
    {
      q: "Equipment costing $60,000 with no salvage value and a 5-year life was purchased on April 1. Using straight-line depreciation and a calendar year-end, what is depreciation expense for the first year?",
      ja: "取得原価$60,000、残存価額ゼロ、耐用年数5年の設備を4月1日に購入した。定額法・暦年決算で、初年度の減価償却費はいくらか。",
      c: ["$12,000", "$9,000", "$10,000", "$6,000"],
      a: 1,
      ex: "年間 60,000 ÷ 5 = 12,000。4月〜12月の9か月分:12,000 × 9/12 = $9,000。",
    },
    {
      q: "Equipment with a cost of $50,000 and accumulated depreciation of $35,000 is sold for $20,000 cash. What is the gain or loss on the sale?",
      ja: "取得原価$50,000、減価償却累計額$35,000の設備を現金$20,000で売却した。売却損益はいくらか。",
      c: ["$5,000 gain", "$15,000 loss", "$20,000 gain", "$30,000 loss"],
      a: 0,
      ex: "帳簿価額 = 50,000 − 35,000 = 15,000。売却額 20,000 − 15,000 = $5,000 の売却益。",
    },
    {
      q: "Under U.S. GAAP, which of the following costs related to a patent should be capitalized?",
      ja: "US GAAPにおいて、特許に関する次の費用のうち、資産計上すべきものはどれか。",
      c: [
        "Internal research and development costs that led to the patent",
        "Legal fees incurred to successfully defend the patent",
        "Legal fees incurred in an unsuccessful defense of the patent",
        "Salaries of engineers who developed the product",
      ],
      a: 1,
      ex: "特許の防御に成功した場合の訴訟費用は特許の価値を守るものとして資産計上する。社内の研究開発費は発生時に費用。防御に失敗した場合は費用処理し、特許の残高も減損させる。",
    },
  ],
});

CPA.extend("FAR-04", {
  mcq: [
    {
      q: "A company issues $100,000 face value, 5-year bonds with a 6% stated rate paid annually when the market rate is 8%. The PV of $1 for 5 periods at 8% is 0.6806, and the PV of an ordinary annuity of $1 for 5 periods at 8% is 3.9927. What is the issue price (rounded)?",
      ja: "ある会社は、市場利率8%のときに、額面$100,000、5年、表面利率6%(年1回払い)の社債を発行した。8%・5期の現価係数は0.6806、年金現価係数は3.9927。発行価額(端数四捨五入)はいくらか。",
      c: ["$100,000", "$92,016", "$95,926", "$108,111"],
      a: 1,
      ex: "額面の現在価値 100,000 × 0.6806 = 68,060。利息の現在価値 6,000 × 3.9927 = 23,956。合計 $92,016(市場利率 > 表面利率なので割引発行)。",
    },
    {
      q: "On March 1, a company issued $100,000 of 6% bonds at par. Interest is paid semiannually on January 1 and July 1. How much cash does the company receive at issuance?",
      ja: "3月1日に、ある会社は表面利率6%の社債$100,000を額面で発行した。利息は1月1日と7月1日の年2回払い。発行時に会社が受け取る現金はいくらか。",
      c: ["$100,000", "$101,000", "$103,000", "$99,000"],
      a: 1,
      ex: "利払日の間に発行すると、前回の利払日からの経過利息を購入者から受け取る(7月1日に6か月分を全額払うため)。100,000 × 6% × 2/12 = 1,000。合計 $101,000。",
    },
    {
      q: "Bonds with a carrying amount of $98,000 (face $100,000) are retired early by repurchasing them at 101. What is the gain or loss on extinguishment?",
      ja: "帳簿価額$98,000(額面$100,000)の社債を、額面の101%で買い入れて早期償還した。償還損益はいくらか。",
      c: ["$1,000 loss", "$3,000 loss", "$2,000 gain", "$3,000 gain"],
      a: 1,
      ex: "支払額 = 100,000 × 101% = 101,000。帳簿価額98,000との差額 $3,000 が償還損(当期の損益に計上)。",
    },
    {
      q: "A company began offering a one-year warranty this year. Sales were $1,000,000, and warranty costs are estimated at 2% of sales. Actual warranty costs paid this year were $8,000. What is the warranty liability at year-end?",
      ja: "ある会社は今年から1年間の製品保証を始めた。売上高は$1,000,000、保証費用は売上の2%と見積もられる。今年実際に支払った保証費用は$8,000。期末の製品保証引当金(負債)はいくらか。",
      c: ["$20,000", "$12,000", "$8,000", "$28,000"],
      a: 1,
      ex: "見積保証費用 1,000,000 × 2% = 20,000 を費用・負債に計上し、実際の支払8,000で負債を減らす。20,000 − 8,000 = $12,000。",
    },
    {
      q: "In a sales-type lease, the lessor at commencement generally:",
      ja: "販売型リースの貸手は、リース開始日に一般に何を行うか。",
      c: [
        "Continues to depreciate the leased asset and recognizes rental income",
        "Derecognizes the underlying asset, recognizes a net investment in the lease, and recognizes any selling profit or loss",
        "Records a right-of-use asset",
        "Defers all profit until the end of the lease",
      ],
      a: 1,
      ex: "販売型リースでは、貸手は原資産の認識をやめ、リース投資未回収額(net investment)を計上し、販売損益を開始日に認識する。オペレーティング・リースなら資産を残して受取リース料を収益にする。",
    },
    {
      q: "An employer should accrue a liability for employees' compensated absences (vacation pay) when all of the following are met EXCEPT:",
      ja: "雇用主が従業員の有給休暇に対する負債を計上する要件に含まれないものはどれか。",
      c: [
        "The obligation relates to services already rendered",
        "The rights vest or accumulate",
        "Payment is probable and the amount can be reasonably estimated",
        "The employees have already taken the vacation",
      ],
      a: 3,
      ex: "すでに提供された勤務に関係し、権利が確定または累積し、支払いの可能性が高く見積り可能なら計上する。休暇を取得済みかどうかは要件ではない(取得前に計上する)。",
    },
  ],
});

CPA.extend("FAR-05", {
  mcq: [
    {
      q: "A company declares a 2-for-1 stock split. What is the effect on total stockholders' equity and on par value per share?",
      ja: "ある会社が2対1の株式分割を行った。株主資本の合計額と1株あたりの額面への影響はどうなるか。",
      c: [
        "Total equity decreases; par value unchanged",
        "Total equity unchanged; par value per share is halved",
        "Total equity increases; par value doubles",
        "Total equity unchanged; par value unchanged",
      ],
      a: 1,
      ex: "株式分割は株式数を2倍、1株あたりの額面を半分にするだけで、仕訳は不要。株主資本の合計も各内訳も変わらない。",
    },
    {
      q: "A company declares a property dividend of an investment with a carrying amount of $40,000 and a fair value of $55,000. What amount should be recorded as a reduction of retained earnings, and what gain is recognized?",
      ja: "ある会社が、帳簿価額$40,000、時価$55,000の投資有価証券を現物配当として宣言した。利益剰余金の減少額と、認識する利益はいくらか。",
      c: [
        "$40,000 reduction; no gain",
        "$55,000 reduction; $15,000 gain",
        "$55,000 reduction; no gain",
        "$40,000 reduction; $15,000 gain",
      ],
      a: 1,
      ex: "現物配当は、まず資産を時価に評価替えして差額 $15,000 を利益に計上し、時価 $55,000 で利益剰余金を減らす。",
    },
    {
      q: "Net income is $200,000 and weighted-average common shares are 100,000. The company has 6% convertible bonds with a face value of $1,000,000, convertible into 20,000 shares. The tax rate is 25%. What is diluted EPS?",
      ja: "当期純利益は$200,000、普通株式の加重平均株式数は100,000株。表面利率6%、額面$1,000,000の転換社債があり、20,000株に転換できる。税率は25%。希薄化後EPSはいくらか。",
      c: ["$2.04", "$2.00", "$1.67", "$2.25"],
      a: 1,
      ex: "基本的EPS = 2.00。転換仮定法では税引後利息 1,000,000 × 6% × 75% = 45,000 を足し、株式20,000株を加える。増分EPS = 45,000 ÷ 20,000 = 2.25 が基本的EPSより大きく逆希薄化なので含めない。希薄化後EPSは $2.00。",
    },
    {
      q: "A company purchased debt securities classified as trading for $50,000. At year-end, their fair value is $53,000. How is the $3,000 increase reported?",
      ja: "ある会社は売買目的に分類した負債証券を$50,000で購入した。期末の時価は$53,000。$3,000の増加はどう報告されるか。",
      c: ["As an unrealized gain in net income", "In other comprehensive income", "Not recognized until sold", "As an increase to additional paid-in capital"],
      a: 0,
      ex: "売買目的(trading)は時価で評価し、評価差額は当期純利益に計上する。",
    },
    {
      q: "An investor increases its ownership in an investee so that it now has significant influence. Under current U.S. GAAP, the change to the equity method is applied:",
      ja: "投資会社が持株を買い増し、被投資会社に重要な影響を与えるようになった。現行のUS GAAPでは、持分法への変更はどのように適用されるか。",
      c: [
        "Retrospectively, restating all prior periods",
        "Prospectively from the date significant influence is obtained",
        "As a cumulative-effect adjustment to retained earnings",
        "Only at the beginning of the next fiscal year",
      ],
      a: 1,
      ex: "ASU 2016-07により、持分法への移行は遡及修正せず、重要な影響を持った日から将来に向かって適用する(既存の持分の帳簿価額に追加取得原価を加える)。",
    },
    {
      q: "When computing diluted EPS using the if-converted method for convertible preferred stock, the numerator is adjusted by:",
      ja: "転換優先株式について転換仮定法で希薄化後EPSを計算するとき、分子はどう調整するか。",
      c: [
        "Subtracting interest expense, net of tax",
        "Adding back the preferred dividends that were deducted for basic EPS",
        "Adding back preferred dividends, net of tax",
        "No adjustment is made to the numerator",
      ],
      a: 1,
      ex: "転換すれば優先配当は払わないので、基本的EPSで差し引いた優先配当を足し戻す。配当は損金にならないので税効果はない(転換社債の利息は税引後で足し戻す)。",
    },
  ],
});

CPA.extend("FAR-06", {
  mcq: [
    {
      q: "A city's capital projects fund receives $5,000,000 from the issuance of general obligation bonds. In the capital projects fund, the bond proceeds are reported as:",
      ja: "市の資本プロジェクト・ファンドが、一般財源保証債の発行で$5,000,000を受け取った。資本プロジェクト・ファンドで、この発行代金はどう報告されるか。",
      c: ["Bonds payable", "Revenue", "Other financing sources", "Deferred inflows of resources"],
      a: 2,
      ex: "政府型ファンドは長期債務を負債に計上しないため、発行代金は「その他の財源(other financing sources)」とする。負債は政府全体財務諸表で計上する。",
    },
    {
      q: "The general fund transfers $300,000 to the debt service fund to pay principal and interest on general long-term debt. How is this reported in the governmental fund statements?",
      ja: "一般ファンドが、一般長期債務の元利払いのため債務返済ファンドに$300,000を繰り出した。政府型ファンドの財務諸表でどう報告されるか。",
      c: [
        "Expenditure in the general fund and revenue in the debt service fund",
        "Transfer out (other financing use) in the general fund and transfer in (other financing source) in the debt service fund",
        "Interfund loan receivable and payable",
        "No entry until the debt is paid",
      ],
      a: 1,
      ex: "返済を前提としないファンド間の資金移動は「繰出(transfers out)」「繰入(transfers in)」として、その他の財源の使途・財源に計上する。",
    },
    {
      q: "In governmental fund financial statements, inventories and prepaid items are generally classified within fund balance as:",
      ja: "政府型ファンドの財務諸表で、棚卸資産と前払項目は一般にファンド残高のどの区分に分類されるか。",
      c: ["Nonspendable", "Restricted", "Committed", "Unassigned"],
      a: 0,
      ex: "現金化して使えない形の資産(棚卸資産・前払項目)や、元本を維持しなければならない永久基金の元本は「使用不能(nonspendable)」。",
    },
    {
      q: "Which statement about the analysis of expenses by function and nature for not-for-profit entities is correct under current U.S. GAAP?",
      ja: "現行のUS GAAPにおいて、非営利組織の費用の機能別・性質別の分析について正しいものはどれか。",
      c: [
        "It is required only for voluntary health and welfare entities",
        "All NFPs must present it, either on the face of the statement of activities, as a separate statement, or in the notes",
        "It is optional for all NFPs",
        "It is required only for NFPs with revenues over $1 million",
      ],
      a: 1,
      ex: "ASU 2016-14により、すべての非営利組織が費用の機能別・性質別の分析を、活動計算書・独立した計算書・注記のいずれかで表示する(以前は保健福祉団体のみ)。",
    },
    {
      q: "In the government-wide financial statements, internal service funds are generally reported as part of:",
      ja: "政府全体財務諸表において、内部サービス・ファンドは一般にどの活動の一部として報告されるか。",
      c: ["Business-type activities", "Governmental activities", "Fiduciary activities", "Component units"],
      a: 1,
      ex: "内部サービス・ファンドは主に政府型の部署にサービスを提供するため、通常は政府型活動に含める(主に事業型活動に提供する場合は事業型活動)。",
    },
    {
      q: "A not-for-profit museum receives a donated painting that will be held for public exhibition, protected and preserved, and any proceeds from sale used to acquire other collection items. The museum may:",
      ja: "非営利の美術館が、一般公開用に展示・保護・保存し、売却代金は他の収蔵品の取得に使うことになっている絵画の寄贈を受けた。美術館はどうすることができるか。",
      c: [
        "Choose not to capitalize the painting or recognize contribution revenue",
        "Not be allowed to accept the donation",
        "Be required to depreciate the painting",
        "Be required to report it as an investment",
      ],
      a: 0,
      ex: "要件を満たす収蔵品(collections)は、資産計上・寄付収益の認識をしないことを選択できる。芸術作品は減価償却しない。",
    },
  ],
});

CPA.extend("FAR-07", {
  mcq: [
    {
      q: "A company has a deferred tax asset of $100,000. Management concludes that it is more likely than not that $30,000 of the asset will not be realized. What is the net deferred tax asset reported?",
      ja: "ある会社の繰延税金資産は$100,000。経営者は、そのうち$30,000が実現しない可能性が50%超であると結論づけた。報告する繰延税金資産の純額はいくらか。",
      c: ["$100,000", "$70,000", "$30,000", "$0"],
      a: 1,
      ex: "実現しない可能性が50%超の部分に評価性引当額$30,000を計上し、純額 $70,000 を表示する。",
    },
    {
      q: "Interest expense for the year was $50,000, which included $5,000 of bond discount amortization. Interest payable increased by $2,000 during the year. How much cash was paid for interest?",
      ja: "当期の支払利息は$50,000で、そのうち$5,000は社債割引の償却額である。期中に未払利息は$2,000増加した。利息の現金支払額はいくらか。",
      c: ["$50,000", "$43,000", "$47,000", "$53,000"],
      a: 1,
      ex: "割引の償却は現金を伴わない費用なので除く。未払利息の増加は未払い分なので除く。50,000 − 5,000 − 2,000 = $43,000。",
    },
    {
      q: "Sales for the year were $900,000. Accounts receivable increased from $100,000 to $130,000. How much cash was collected from customers?",
      ja: "当期の売上高は$900,000。売掛金は$100,000から$130,000に増加した。顧客からの現金回収額はいくらか。",
      c: ["$930,000", "$870,000", "$900,000", "$770,000"],
      a: 1,
      ex: "売掛金が増えた分はまだ回収していない。900,000 −(130,000 − 100,000)= $870,000。",
    },
    {
      q: "Under the indirect method, amortization of a bond discount is:",
      ja: "間接法において、社債割引の償却額はどう扱われるか。",
      c: [
        "Subtracted from net income",
        "Added back to net income",
        "Reported as a financing activity",
        "Not reported",
      ],
      a: 1,
      ex: "割引の償却は支払利息を増やすが現金は出ていないので、当期純利益に足し戻す(打歩の償却は差し引く)。",
    },
    {
      q: "A company has a deferred tax liability of $30,000 measured at a 20% rate. A new law raising the future rate to 25% is enacted. What is the effect on income tax expense in the period of enactment?",
      ja: "ある会社は、20%の税率で測定した繰延税金負債$30,000を計上している。将来の税率を25%に引き上げる法律が制定された。制定した期の法人税等への影響はいくらか。",
      c: ["Increase of $7,500", "Increase of $6,000", "Decrease of $7,500", "No effect until the difference reverses"],
      a: 0,
      ex: "一時差異 = 30,000 ÷ 20% = 150,000。新税率で 150,000 × 25% = 37,500。増加額 $7,500 を制定した期の税金費用に加える。",
    },
    {
      q: "Intraperiod tax allocation requires that income tax expense be allocated among:",
      ja: "期間内税金配分(intraperiod tax allocation)は、法人税費用をどのように配分することを求めているか。",
      c: [
        "Current and future periods",
        "Continuing operations, discontinued operations, other comprehensive income, and items charged directly to equity",
        "Federal and state jurisdictions only",
        "Deferred tax assets and liabilities",
      ],
      a: 1,
      ex: "同じ期間の中で、税金費用を継続事業・非継続事業・OCI・純資産直入項目などに配分し、各項目を税引後で表示する。期間をまたぐ配分は期間間税金配分(税効果会計)。",
    },
  ],
});

CPA.tbs({
  id: "TBS-FAR-07",
  section: "FAR",
  chapter: "FAR-02",
  title: "工事契約の収益認識(一定期間にわたる認識)",
  scenario: `<p>Sato Construction signed a <b>$1,000,000</b> fixed-price contract to build a warehouse. It recognizes revenue over time and measures progress by costs incurred to date relative to total estimated costs.</p>
<table><tr><th></th><th>Year 1</th><th>Year 2</th></tr>
<tr><td>Costs incurred to date</td><td>$300,000</td><td>$600,000</td></tr>
<tr><td>Estimated costs to complete</td><td>$450,000</td><td>$200,000</td></tr></table>
<p class="ja">Sato建設は倉庫の建設について$1,000,000の固定価格契約を結んだ。一定期間にわたり収益を認識し、発生原価の見積総原価に対する割合で進捗度を測定する。表の発生原価は累計額。進捗度は%の数値で答えること。</p>`,
  rows: [
    { label: "Year 1 percentage complete, %(1年目の進捗度・%)", type: "num", answer: 40 },
    { label: "Year 1 revenue(1年目の収益)", type: "num", answer: 400000 },
    { label: "Year 1 gross profit(1年目の売上総利益)", type: "num", answer: 100000 },
    { label: "Year 2 percentage complete, %(2年目の進捗度・%)", type: "num", answer: 75 },
    { label: "Year 2 revenue(2年目の収益)", type: "num", answer: 350000 },
    { label: "Year 2 gross profit(2年目の売上総利益)", type: "num", answer: 50000 },
  ],
  explain: `<p>1年目:見積総原価 300,000 + 450,000 = 750,000 → 進捗度 40%。収益 400,000、利益 400,000 − 300,000 = 100,000。</p>
<p>2年目:見積総原価 600,000 + 200,000 = 800,000 → 進捗度 75%。累計収益 750,000 − 1年目 400,000 = 350,000。累計利益 750,000 − 600,000 = 150,000 − 1年目 100,000 = 50,000(2年目の原価は 300,000)。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-08",
  section: "FAR",
  chapter: "FAR-07",
  title: "キャッシュフロー計算書の作成(間接法)",
  scenario: `<p>Kobayashi Inc. reported the following for the year:</p>
<table><tr><td>Net income</td><td>$120,000</td></tr>
<tr><td>Depreciation expense</td><td>$30,000</td></tr>
<tr><td>Amortization of patent</td><td>$5,000</td></tr>
<tr><td>Loss on sale of equipment</td><td>$4,000</td></tr>
<tr><td>Increase in accounts receivable</td><td>$15,000</td></tr>
<tr><td>Decrease in inventory</td><td>$10,000</td></tr>
<tr><td>Increase in prepaid expenses</td><td>$3,000</td></tr>
<tr><td>Decrease in accounts payable</td><td>$8,000</td></tr>
<tr><td>Increase in accrued liabilities</td><td>$6,000</td></tr>
<tr><td>Proceeds from sale of equipment</td><td>$20,000</td></tr>
<tr><td>Purchase of equipment</td><td>$70,000</td></tr>
<tr><td>Cash dividends paid</td><td>$25,000</td></tr>
<tr><td>Proceeds from issuing bonds</td><td>$60,000</td></tr></table>
<p class="ja">Kobayashi社の当期のデータは上のとおり。各区分のキャッシュフローを答えなさい。支出超過はマイナス(-50,000 など)で入力すること。</p>`,
  rows: [
    { label: "Net cash from operating activities(営業活動によるCF)", type: "num", answer: 149000 },
    { label: "Net cash from investing activities(投資活動によるCF)", type: "num", answer: -50000 },
    { label: "Net cash from financing activities(財務活動によるCF)", type: "num", answer: 35000 },
    { label: "Net increase (decrease) in cash(現金の増減)", type: "num", answer: 134000 },
  ],
  explain: `<p>営業CF = 120,000 + 30,000 + 5,000 + 4,000(売却損は足し戻す)− 15,000 + 10,000 − 3,000 − 8,000 + 6,000 = 149,000。</p>
<p>投資CF = 20,000 − 70,000 = −50,000。財務CF = 60,000 − 25,000 = 35,000。合計 149,000 − 50,000 + 35,000 = 134,000。</p>`,
});
