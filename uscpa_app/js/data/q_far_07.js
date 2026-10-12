// FAR の追加問題(州・地方政府会計と非営利組織会計)

CPA.extend("FAR-06", {
  mcq: [
    {
      q: "A city levies a dedicated gasoline tax whose proceeds are legally restricted by state statute to the maintenance of city streets. The tax is a substantial inflow and the city wants to demonstrate compliance with the restriction. In which fund should the tax be reported?",
      ja: "市はガソリン目的税を課しており、その収入は州法により市道の維持管理に使途が法的に制限されている。この税は重要な収入源であり、市は制限の遵守を示したいと考えている。この税はどの基金で報告すべきか。",
      c: ["General fund", "Capital projects fund", "Special revenue fund", "Permanent fund"],
      a: 2,
      ex: "特定の目的(資本プロジェクトや債務返済以外)に使途が制限された特定の収入源は特別収入基金(special revenue fund)で報告する。道路の維持管理は資本的支出ではないため資本プロジェクト基金ではない。元本を維持する要件もないため永久基金でもない。",
    },
    {
      q: "A retired resident donates $1,000,000 to a city under a trust agreement that requires the principal to be maintained intact and the investment earnings to be used for college scholarships awarded to children of city employees. The city should report the donation in a(n):",
      ja: "退職した住民が信託契約に基づき市に$1,000,000を寄付した。元本は維持し、運用益は市職員の子供に授与する大学奨学金に充てることが求められている。市はこの寄付をどの基金で報告すべきか。",
      c: ["Permanent fund", "Private-purpose trust fund", "Special revenue fund", "Custodial fund"],
      a: 1,
      ex: "受益者が政府自身やその住民全体ではなく特定の個人(職員の子供)である信託は私的目的信託基金で報告する。元本維持要件があっても、受益者が政府のプログラム(住民全体)である場合に限り永久基金となる。",
    },
    {
      q: "A county manages an external investment pool in which several independent school districts and special districts in the county invest their cash. The county's own general fund also participates. How should the county report the external participants' share of the pool?",
      ja: "郡は外部投資プールを運営しており、郡内の独立した学区や特別区が現金を投資している。郡自身の一般基金も参加している。外部参加者の持分を郡はどのように報告すべきか。",
      c: [
        "In an investment trust fund",
        "In the general fund as a liability",
        "In an internal service fund",
        "In a custodial fund with no additions or deductions reported",
      ],
      a: 0,
      ex: "政府が後援する外部投資プールの外部参加者持分は投資信託基金(investment trust fund)で報告する。郡自身の持分は参加している各基金に配分され、受託者基金には含まれない。内部サービス基金は政府内部の部署向けのサービス提供に用いる。",
    },
    {
      q: "A city operates a central motor pool that maintains and provides vehicles to the police, fire, and public works departments and charges each department a rate designed to recover the full cost of the service. The motor pool should be accounted for in a(n):",
      ja: "市は警察・消防・公共事業部門に車両を整備・提供する中央車両管理部門を運営しており、各部門に全額原価回収を目的とした料金を課している。この車両管理部門はどの基金で会計処理すべきか。",
      c: ["Enterprise fund", "General fund", "Special revenue fund", "Internal service fund"],
      a: 3,
      ex: "主として政府内の他の部署に原価回収ベースで財・サービスを提供する活動は内部サービス基金で報告する。外部の住民に料金を課す活動であれば事業基金(enterprise fund)となる。",
    },
    {
      q: "Under GASB standards, an activity that charges fees to external users MUST be reported in an enterprise fund in which of the following circumstances?",
      ja: "GASB基準において、外部の利用者に料金を課す活動が必ず事業基金で報告されなければならないのは次のうちどの場合か。",
      c: [
        "The activity receives an operating subsidy from the general fund",
        "The activity is financed with debt secured solely by a pledge of the net revenues from fees and charges of the activity",
        "The activity is managed by an elected official",
        "The activity's fees recover at least 50% of its operating costs",
      ],
      a: 1,
      ex: "事業基金の使用が義務付けられるのは、①活動の料金収入のみを担保とする債務で資金調達している場合、②法令で原価(資本コスト含む)を料金で回収することが求められる場合、③価格方針として原価回収を定めている場合のいずれかである。50%回収のような基準はない。",
    },
    {
      q: "Under GASB Statement No. 84, a county collects property taxes on behalf of several independent school districts and remits the collections to them. The county does not have administrative involvement or direct financial involvement in the taxes, and the arrangement is not a trust. The county should report these resources in a:",
      ja: "GASB第84号において、郡は複数の独立学区に代わって固定資産税を徴収し、学区に送金している。郡はこの税について管理上の関与も直接的な財務上の関与もなく、信託契約でもない。郡はこれらの資源をどの基金で報告すべきか。",
      c: ["Custodial fund", "Special revenue fund", "Private-purpose trust fund", "Agency fund reported only in the notes"],
      a: 0,
      ex: "GASB 84では、信託に該当しない受託者活動は保管基金(custodial fund)で報告する(旧agency fundに代わる区分)。保管基金も経済的資源測定・発生主義で、受託者純資産変動計算書に追加・控除を表示する。注記のみの開示ではない。",
    },
    {
      q: "For its fiscal year ending December 31, Year 1, a city levied property taxes of $2,000,000, of which 1% is estimated to be uncollectible. During Year 1, $1,850,000 was collected. The city expects to collect $60,000 during January and February of Year 2 and the remaining collectible balance later in Year 2. What amount of property tax revenue should be reported in the general fund for Year 1?",
      ja: "12月31日決算の市は、第1年度に$2,000,000の固定資産税を賦課し、そのうち1%は回収不能と見積もられる。第1年度中に$1,850,000を回収した。第2年度の1月・2月に$60,000、残りの回収可能額は第2年度の後半に回収される見込みである。第1年度の一般基金で報告すべき固定資産税収益はいくらか。",
      c: ["$1,850,000", "$1,980,000", "$2,000,000", "$1,910,000"],
      a: 3,
      ex: "修正発生主義では期末後60日以内に回収される額までが「利用可能」。1,850,000 + 60,000 = 1,910,000を収益とし、残り(1,980,000 − 1,910,000 = 70,000)は繰延資源流入とする。$1,980,000は政府全体財務諸表(発生主義)の金額である。",
    },
    {
      q: "In December of Year 1, several taxpayers paid $30,000 of property taxes that were levied for, and are intended to finance, Year 2. How should the city report the $30,000 in its Year 1 general fund balance sheet?",
      ja: "第1年度の12月に、数名の納税者が第2年度分として賦課され第2年度の財源となる固定資産税$30,000を納付した。市は第1年度の一般基金貸借対照表でこの$30,000をどのように報告すべきか。",
      c: ["Property tax revenue", "Deferred inflow of resources", "Unearned revenue (a liability)", "Committed fund balance"],
      a: 1,
      ex: "固定資産税(賦課税)は賦課対象期間に収益認識する。期間要件(time requirement)を満たす前に受け取った資源は負債ではなく繰延資源流入として報告する。負債(前受収益)となるのは期間以外の適格要件を満たす前に受け取った場合である。",
    },
    {
      q: "A city imposes a 1% local sales tax that is collected by the state and remitted to the city. Underlying retail sales during the city's fiscal year generated $500,000 of city sales tax. The city received $440,000 during the year, $35,000 within 45 days after year-end, and $25,000 four months after year-end. The city uses a 60-day availability period. What sales tax revenue should the city report in its general fund for the year?",
      ja: "市は1%の地方売上税を課しており、州が徴収して市に送金する。当期の小売販売に基づく市の売上税は$500,000であった。市は期中に$440,000、期末後45日以内に$35,000、期末後4か月後に$25,000を受け取った。市は60日の利用可能期間を採用している。当期の一般基金で報告すべき売上税収益はいくらか。",
      c: ["$475,000", "$440,000", "$500,000", "$465,000"],
      a: 0,
      ex: "売上税は派生税収益であり、基礎となる取引(販売)が発生した期に認識するが、修正発生主義では利用可能額に限られる。440,000 + 35,000 = 475,000。$500,000は政府全体財務諸表の金額である。",
    },
    {
      q: "A city was awarded a $200,000 state reimbursement-type grant for job-training programs. During the year, the city incurred $150,000 of allowable costs and received $120,000 of reimbursements from the state. The remaining reimbursement is expected to be received shortly after year-end. What grant revenue should the city report in the government-wide statement of activities?",
      ja: "市は職業訓練プログラムに対する$200,000の州の補填型補助金を交付決定された。当期に市は$150,000の適格費用を発生させ、州から$120,000の補填を受けた。残りの補填は期末後まもなく受け取る見込みである。政府全体の活動計算書で報告すべき補助金収益はいくらか。",
      c: ["$120,000", "$200,000", "$150,000", "$0"],
      a: 2,
      ex: "補填型補助金では適格費用の発生が適格要件(eligibility requirement)であり、要件を満たした$150,000を収益認識する。受領額$120,000ではなく、交付決定総額$200,000でもない。",
    },
    {
      q: "A city's general fund adopted an annual budget with estimated revenues of $5,000,000, appropriations of $4,800,000, and estimated other financing uses (transfers out) of $150,000. In recording the budget, the city should:",
      ja: "市の一般基金は、見積収益$5,000,000、歳出予算(appropriations)$4,800,000、その他の資金調達用途(繰出)見積額$150,000の年次予算を採択した。予算を記録する際、市は何をすべきか。",
      c: [
        "Debit budgetary fund balance $200,000",
        "Credit budgetary fund balance $200,000",
        "Debit budgetary fund balance $50,000",
        "Credit budgetary fund balance $50,000",
      ],
      a: 3,
      ex: "予算仕訳:借方 見積収益5,000,000/貸方 歳出予算4,800,000、見積繰出150,000、予算上の基金残高50,000。繰出を考慮しないと$200,000の貸方となり誤り。予算剰余は予算上の基金残高の貸方となる。",
    },
    {
      q: "A department's annual appropriation is $100,000. Before the transaction below, expenditures charged to the appropriation were $40,000 and outstanding encumbrances were $20,000. Goods ordered on a $12,000 purchase order (included in the outstanding encumbrances) were received with an invoice of $12,300. After recording the receipt, what is the unencumbered (available) balance of the appropriation?",
      ja: "ある部門の年間歳出予算は$100,000である。以下の取引前の時点で、支出済額は$40,000、未決済の負担額(encumbrances)は$20,000であった。$12,000の発注書(未決済負担額に含まれる)の物品が$12,300の請求書とともに納品された。納品の記録後、歳出予算の未使用(利用可能)残高はいくらか。",
      c: ["$40,000", "$39,700", "$27,700", "$52,000"],
      a: 1,
      ex: "納品時に負担額12,000を戻し、支出12,300を計上する。利用可能残高 = 100,000 − (40,000 + 12,300) − (20,000 − 12,000) = 39,700。負担額の戻し入れを忘れると$27,700となる。",
    },
    {
      q: "At fiscal year-end, a city's general fund has $75,000 of outstanding encumbrances for purchase orders that the city intends to honor in the following year. The resources are not otherwise restricted, committed, or assigned. Under GAAP, the outstanding encumbrances should be reported in the general fund balance sheet as:",
      ja: "期末時点で、市の一般基金には翌年度に履行する予定の発注書に係る未決済負担額$75,000がある。これらの資源は他に拘束・確約・指定されていない。GAAPでは、未決済負担額は一般基金の貸借対照表でどのように報告すべきか。",
      c: [
        "A liability of $75,000",
        "Expenditures of $75,000 reported in the statement of revenues, expenditures, and changes in fund balances",
        "Part of committed or assigned fund balance, depending on the level of authority that imposed the constraint",
        "A deferred outflow of resources",
      ],
      a: 2,
      ex: "未決済負担額は負債でも支出でもない。GAAPでは制約を課した権限の水準に応じて確約(committed)または指定(assigned)基金残高に含め、重要な場合は注記で開示する。予算ベースでは支出として扱うが、GAAPベースでは扱わない。",
    },
    {
      q: "A city's budgetary comparison schedule for the general fund is required to present which of the following columns?",
      ja: "一般基金の予算比較表(budgetary comparison schedule)に表示が求められる列はどれか。",
      c: [
        "The original budget, the final appropriated budget, and actual amounts on the budgetary basis",
        "The final budget and actual amounts on the GAAP basis only",
        "The original budget and actual amounts on the GAAP basis only",
        "The final budget, actual amounts on the GAAP basis, and the prior-year actual amounts",
      ],
      a: 0,
      ex: "予算比較表(必須補足情報またはベーシック財務諸表として表示)には当初予算、最終予算、予算ベースの実績が必要で、差異の列は任意である。予算ベースとGAAPベースが異なる場合は調整を示す。",
    },
    {
      q: "A city's general fund had supplies inventory of $8,000 at the beginning of the year, purchased supplies of $50,000 during the year, and had supplies inventory of $11,000 at year-end. What amounts of supplies expenditures should be reported under the consumption method and the purchases method, respectively?",
      ja: "市の一般基金の消耗品棚卸高は期首$8,000、当期購入額$50,000、期末$11,000であった。消費法と購入法それぞれで報告すべき消耗品支出はいくらか。",
      c: ["$50,000 and $47,000", "$53,000 and $50,000", "$47,000 and $47,000", "$47,000 and $50,000"],
      a: 3,
      ex: "消費法:8,000 + 50,000 − 11,000 = 47,000を支出とする。購入法:購入額50,000を支出とする(重要な期末在庫は貸借対照表に計上し非支出性基金残高とする)。順序を逆にした選択肢に注意。",
    },
    {
      q: "On October 1, Year 1, a city's general fund paid $24,000 for a one-year insurance policy covering general government buildings. The city's fiscal year ends December 31 and it uses the purchases method for prepaid items in its governmental funds. What amounts should be reported for Year 1 as the general fund expenditure and the government-wide expense, respectively?",
      ja: "第1年度10月1日、市の一般基金は一般行政用建物の1年分の保険料$24,000を支払った。市は12月31日決算で、政府基金の前払項目に購入法を採用している。第1年度の一般基金の支出と政府全体の費用はそれぞれいくらか。",
      c: ["$6,000 and $6,000", "$24,000 and $6,000", "$24,000 and $24,000", "$6,000 and $24,000"],
      a: 1,
      ex: "購入法では支払時に全額$24,000を支出とする。政府全体財務諸表は発生主義のため経過期間3か月分(24,000 × 3/12 = 6,000)のみ費用とし、残り$18,000は前払費用とする。",
    },
    {
      q: "On January 1, a city issued $2,000,000 of 10-year general obligation bonds at 102 to finance construction of a fire station. Proceeds were deposited in a capital projects fund. How should the bond issuance be reported in the capital projects fund?",
      ja: "1月1日、市は消防署の建設資金として10年満期の一般財源保証債$2,000,000を102で発行し、手取金を資本プロジェクト基金に預け入れた。資本プロジェクト基金でこの社債発行をどのように報告すべきか。",
      c: [
        "Bonds payable of $2,000,000 and a premium on bonds of $40,000",
        "Revenue of $2,040,000",
        "Other financing sources of $2,040,000 (face amount $2,000,000 and premium $40,000)",
        "Other financing sources of $2,000,000 and deferred inflows of resources of $40,000",
      ],
      a: 2,
      ex: "政府基金は流動財務資源測定のため長期債務を負債計上せず、額面2,000,000と発行プレミアム40,000をその他の資金調達源泉(other financing sources)として表示する。収益ではない。社債と未償却プレミアムの計上は政府全体財務諸表で行う。",
    },
    {
      q: "On January 1, a city issued $2,000,000 of 10-year, 5% general obligation bonds at 102. Interest is payable each December 31. The city amortizes premiums on the straight-line basis, which is not materially different from the effective interest method. What interest expense should be reported for the first year in the government-wide statement of activities?",
      ja: "1月1日、市は10年満期・利率5%の一般財源保証債$2,000,000を102で発行した。利息は毎年12月31日払い。市はプレミアムを定額法で償却しており、実効金利法との差は重要でない。政府全体の活動計算書で初年度に報告すべき支払利息はいくらか。",
      c: ["$96,000", "$100,000", "$104,000", "$102,000"],
      a: 0,
      ex: "プレミアム40,000を10年で償却し年4,000。支払利息 = 2,000,000 × 5% − 4,000 = 96,000。プレミアム償却は費用を減少させるため加算($104,000)は誤り。",
    },
    {
      q: "A city's general fund acquired equipment costing $90,000 by paying $30,000 in cash and signing a 3-year installment note for $60,000. How should the acquisition be reported in the general fund's statement of revenues, expenditures, and changes in fund balance?",
      ja: "市の一般基金は、現金$30,000の支払いと3年間の割賦手形$60,000の振出により、$90,000の備品を取得した。一般基金の収益・支出・基金残高変動計算書ではどのように報告すべきか。",
      c: [
        "Capital outlay expenditure of $30,000 only",
        "Capital outlay expenditure of $90,000 and other financing sources of $60,000",
        "Capital outlay expenditure of $90,000 and a note payable of $60,000",
        "No expenditure; equipment of $90,000 and a note payable of $60,000",
      ],
      a: 1,
      ex: "政府基金では資産の取得総額$90,000を資本的支出とし、長期の手形$60,000はその他の資金調達源泉として表示する(負債計上しない)。結果として基金残高の純減は現金支出$30,000に等しくなる。",
    },
    {
      q: "At year-end, a city's employees in governmental activities had earned but unused vacation leave of $400,000. Of this amount, $25,000 is owed to employees who retired before year-end and had not yet been paid. What liability for compensated absences should be reported in the general fund balance sheet?",
      ja: "期末時点で、市の政府活動の職員の未使用有給休暇は$400,000であった。このうち$25,000は期末前に退職し未払いとなっている職員に対するものである。一般基金の貸借対照表で報告すべき有給休暇負債はいくらか。",
      c: ["$400,000", "$375,000", "$0", "$25,000"],
      a: 3,
      ex: "政府基金では、通常は当期の利用可能な財務資源で清算される額、すなわち支払期日が到来した(退職者への未払分)$25,000のみを負債とする。残りは政府全体財務諸表で長期負債として報告し、$400,000全額は政府全体の負債額である。",
    },
    {
      q: "A city was sued for injuries sustained on city property. At year-end, the city's attorney concluded that a loss of $500,000 is probable and reasonably estimable; the settlement is expected to be paid in about three years from general fund resources. What amounts should be reported for the year as a general fund expenditure and as a government-wide expense, respectively?",
      ja: "市は市有地での負傷について訴訟を起こされた。期末時点で市の弁護士は$500,000の損失が発生可能性が高く合理的に見積可能と結論付けた。和解金は約3年後に一般基金の資源から支払われる見込みである。当期に一般基金の支出と政府全体の費用としてそれぞれいくら報告すべきか。",
      c: ["$0 and $500,000", "$500,000 and $500,000", "$0 and $0", "$500,000 and $0"],
      a: 0,
      ex: "政府基金では当期の利用可能な財務資源で清算されない請求・判決債務は負債・支出として計上しない(期日到来時に支出)。政府全体財務諸表(発生主義)では損失発生の可能性が高く見積可能であれば$500,000を負債と費用に計上する。",
    },
    {
      q: "A city uses the modified approach for its eligible road network and has documented that the roads are being preserved at the condition level it established. During the year, the city spent $800,000 resurfacing roads to maintain their condition and $1,200,000 to add new lanes that increase capacity. How should these costs be reported in the government-wide financial statements?",
      ja: "市は適格な道路網に修正アプローチを採用しており、道路が市の定めた状態水準に維持されていることを文書化している。当期、状態維持のための再舗装に$800,000、容量を増加させる新車線の追加に$1,200,000を支出した。政府全体財務諸表ではこれらの費用をどのように報告すべきか。",
      c: [
        "Capitalize $2,000,000 and record depreciation",
        "Expense $800,000; capitalize $1,200,000; record no depreciation on the road network",
        "Expense $2,000,000",
        "Capitalize $800,000 and expense $1,200,000",
      ],
      a: 1,
      ex: "修正アプローチではインフラ資産を減価償却せず、維持・保全のための支出(preservation costs)は費用処理する。追加・改良(容量・効率を高める支出)は資産計上する。よって費用$800,000、資産計上$1,200,000となる。",
    },
    {
      q: "A developer donated land to a city for a future park. The developer's carrying amount of the land was $150,000, its fair value (exit price) was $560,000, and its acquisition value (the price that would be paid to acquire an asset with equivalent service potential) was $600,000. At what amount should the city report the land in its government-wide statement of net position?",
      ja: "開発業者が将来の公園用地として土地を市に寄贈した。開発業者における土地の帳簿価額は$150,000、公正価値(出口価格)は$560,000、取得価値(同等のサービス提供能力を持つ資産を取得するために支払う価格)は$600,000であった。市は政府全体の純資産計算書でこの土地をいくらで報告すべきか。",
      c: ["$150,000", "$560,000", "$0", "$600,000"],
      a: 3,
      ex: "GASB 72により、寄贈された資本資産は取得価値(入口価格)で測定する。公正価値(出口価格)$560,000や寄贈者の帳簿価額$150,000ではない。政府全体財務諸表では資本資産として計上し、寄付収益(資本拠出)を認識する。",
    },
    {
      q: "A city's public safety function reported the following for the year: expenses of $3,000,000; traffic fines of $200,000; fire inspection fees of $150,000; a state grant restricted to police training of $100,000; a federal grant restricted to the purchase of fire trucks of $400,000; and unrestricted state-shared revenues of $500,000 used to finance public safety. What net (expense) revenue should be reported for the public safety function in the statement of activities?",
      ja: "市の公共安全機能の当期の状況は次のとおり:費用$3,000,000、交通違反罰金$200,000、消防検査手数料$150,000、警察訓練に使途制限された州補助金$100,000、消防車購入に使途制限された連邦補助金$400,000、公共安全の財源に用いた使途制限のない州共有収入$500,000。活動計算書で公共安全機能について報告すべき純(費用)収益はいくらか。",
      c: ["$(1,650,000)", "$(2,550,000)", "$(2,150,000)", "$(2,250,000)"],
      a: 2,
      ex: "プログラム収益 = 使用料等(罰金200,000 + 手数料150,000)+ 運営補助金100,000 + 資本補助金400,000 = 850,000。純費用 = 3,000,000 − 850,000 = 2,150,000。使途制限のない州共有収入は一般収益であり、機能別のプログラム収益に含めない。",
    },
    {
      q: "In the government-wide statement of activities, interest on general long-term debt that cannot be identified with a specific function is generally reported as:",
      ja: "政府全体の活動計算書において、特定の機能に関連付けられない一般長期債務の利息は一般にどのように報告されるか。",
      c: [
        "An indirect expense allocated to every function based on expenses",
        "A separate line item among governmental activities expenses",
        "A reduction of general revenues",
        "An other financing use",
      ],
      a: 1,
      ex: "一般長期債務の利息は通常、間接費用として政府活動の独立した費用行に表示する(特定の機能に直接関連する場合のみ当該機能の直接費用)。他の財務資源の使用(other financing use)は政府基金の概念であり、政府全体の活動計算書にはない。",
    },
    {
      q: "A city's governmental funds report total fund balances of $5,000,000. Additional information: governmental capital assets, net of accumulated depreciation, $20,000,000; general obligation bonds payable $8,000,000; accrued interest on the bonds not reported in the funds $100,000; property taxes reported as deferred inflows (unavailable revenue) in the funds $300,000; and net position of internal service funds that primarily serve governmental departments $400,000. What is the net position of governmental activities?",
      ja: "市の政府基金の基金残高合計は$5,000,000である。追加情報:政府活動の資本資産(減価償却累計額控除後)$20,000,000、一般財源保証債$8,000,000、基金で未計上の社債未払利息$100,000、基金で繰延資源流入(利用不能収益)とした固定資産税$300,000、主に政府部門にサービスを提供する内部サービス基金の純資産$400,000。政府活動の純資産はいくらか。",
      c: ["$17,600,000", "$17,200,000", "$17,000,000", "$17,700,000"],
      a: 0,
      ex: "5,000,000 + 20,000,000 − 8,000,000 − 100,000 + 300,000(利用不能収益の戻し)+ 400,000(内部サービス基金)= 17,600,000。内部サービス基金を加えないと$17,200,000、繰延資源流入を減算すると$17,000,000となり誤り。",
    },
    {
      q: "A city's governmental funds reported a net change in fund balances of $1,000,000. During the year: capital outlay expenditures were $2,000,000; depreciation on governmental capital assets was $700,000; proceeds from general obligation bonds were $3,000,000; principal repayments on bonds were $500,000; and unavailable property tax revenue (deferred inflows in the funds) increased by $100,000. What is the change in net position of governmental activities?",
      ja: "市の政府基金の基金残高の純変動は$1,000,000であった。当期:資本的支出$2,000,000、政府活動の資本資産の減価償却費$700,000、一般財源保証債の発行手取金$3,000,000、社債元本返済$500,000、利用不能な固定資産税収益(基金の繰延資源流入)の増加$100,000。政府活動の純資産の変動はいくらか。",
      c: ["$5,900,000", "$(1,100,000)", "$(200,000)", "$(100,000)"],
      a: 3,
      ex: "1,000,000 + 2,000,000(資本的支出を資産化)− 700,000(減価償却)− 3,000,000(社債発行は負債)+ 500,000(元本返済は負債の減少)+ 100,000(利用不能収益の増加分を収益化)= −100,000。社債手取金・元本返済の符号を誤ると他の選択肢になる。",
    },
    {
      q: "A city's general fund lent $50,000 to a special revenue fund to cover a temporary cash shortfall. The special revenue fund will repay the amount within six months. How should the general fund report this transaction?",
      ja: "市の一般基金は、一時的な資金不足を補うため特別収入基金に$50,000を貸し付けた。特別収入基金は6か月以内に返済する予定である。一般基金はこの取引をどのように報告すべきか。",
      c: [
        "An interfund receivable (due from other funds) of $50,000",
        "A transfer out (other financing use) of $50,000",
        "An expenditure of $50,000",
        "A reduction of its own expenditures of $50,000",
      ],
      a: 0,
      ex: "返済が予定される基金間の資金移動は基金間貸付(interfund loan)であり、貸手は基金間債権(due from)、借手は基金間債務(due to)を計上する。返済予定のない移動であれば振替(transfer)となる。",
    },
    {
      q: "A city's general fund paid $20,000 to the city's water utility enterprise fund for water used by general government buildings, billed at the utility's standard rates. How should this transaction be reported in the fund financial statements?",
      ja: "市の一般基金は、一般行政用建物で使用した水道料金$20,000を、水道事業の標準料金に基づき市の水道事業基金に支払った。基金財務諸表ではこの取引をどのように報告すべきか。",
      c: [
        "Transfer out in the general fund and transfer in in the enterprise fund",
        "Reduction of expenditures in the general fund and reduction of expenses in the enterprise fund",
        "Expenditure in the general fund and operating revenue in the enterprise fund",
        "Interfund receivable in the enterprise fund only; no revenue",
      ],
      a: 2,
      ex: "市場価格(標準料金)で他の基金から財・サービスを購入する取引は「基金間で提供・使用されるサービス」(interfund services provided and used)であり、購入側は支出(費用)、販売側は収益として報告する。振替ではない。",
    },
    {
      q: "During the year, a city's general fund paid $15,000 of salaries for employees who worked exclusively on a grant program accounted for in a special revenue fund. The special revenue fund later repaid the general fund. How should the repayment be reported?",
      ja: "当期、市の一般基金は、特別収入基金で会計処理される補助金プログラムに専属で従事した職員の給与$15,000を支払った。後日、特別収入基金が一般基金に返済した。この返済はどのように報告すべきか。",
      c: [
        "Transfer in to the general fund and transfer out from the special revenue fund",
        "Expenditure in the special revenue fund and a reduction of expenditures in the general fund",
        "Revenue in the general fund and expenditure in the special revenue fund",
        "Other financing source in the general fund and other financing use in the special revenue fund",
      ],
      a: 1,
      ex: "本来他の基金に帰属する支出を立て替えた後の払い戻しは基金間補填(reimbursement)であり、最終的に負担すべき特別収入基金で支出を計上し、一般基金では支出を減額する。収益や振替として報告すると支出・収益が二重計上される。",
    },
    {
      q: "A city's general fund made a $100,000 transfer to the city's transit enterprise fund to subsidize its operations; no repayment is expected. How should the transaction be reported in the government-wide statement of activities?",
      ja: "市の一般基金は、市の交通事業基金の運営を補助するため$100,000を振り替えた。返済は予定されていない。政府全体の活動計算書ではこの取引をどのように報告すべきか。",
      c: [
        "It is eliminated because it is an internal activity",
        "As program revenue of business-type activities and an expense of governmental activities",
        "As a special item",
        "As transfers between governmental activities and business-type activities, reported after general revenues",
      ],
      a: 3,
      ex: "政府全体財務諸表では同じ活動区分内の基金間取引は消去するが、政府活動と事業型活動の間の振替は「振替(transfers)」として一般収益の後に表示し、合計欄では相殺される。プログラム収益や費用ではない。",
    },
    {
      q: "During the year, a city council voted to sell a large tract of undeveloped land that the city had held for decades, recognizing a significant gain. The sale is unusual for the city but within the control of management. In the government-wide statement of activities, the gain should be reported as a(n):",
      ja: "当期、市議会は市が数十年保有してきた広大な未開発地の売却を決議し、多額の売却益を認識した。この売却は市にとって異常なものだが、経営者の管理下にある。政府全体の活動計算書ではこの利益をどのように報告すべきか。",
      c: ["Special item", "Extraordinary item", "Program revenue of the general government function", "Transfer"],
      a: 0,
      ex: "経営者の管理下にあり、性質が異常であるか発生頻度が低い(いずれか一方)重要な取引は特別項目(special item)。特別損益(extraordinary item)は異常かつ発生頻度が低いもので、通常は経営者の管理外の事象(例:自然災害)である。",
    },
    {
      q: "At year-end, a city's governmental activities report capital assets, net of accumulated depreciation, of $30,000,000. General obligation bonds of $12,000,000 were issued to finance these capital assets, and $2,000,000 of the bond proceeds remain unspent and held in cash at year-end. What amount should be reported as net investment in capital assets?",
      ja: "期末時点で、市の政府活動の資本資産(減価償却累計額控除後)は$30,000,000である。これらの資本資産の取得資金として一般財源保証債$12,000,000が発行され、期末時点で社債手取金のうち$2,000,000が未使用のまま現金で保有されている。資本資産への純投資(net investment in capital assets)として報告すべき金額はいくらか。",
      c: ["$18,000,000", "$30,000,000", "$20,000,000", "$16,000,000"],
      a: 2,
      ex: "資本資産への純投資 = 資本資産(純額)− 取得に帰属する債務。未使用の手取金に対応する債務部分は除外する。30,000,000 − (12,000,000 − 2,000,000) = 20,000,000。未使用分を除かないと$18,000,000となる。",
    },
    {
      q: "A city council adopted a policy authorizing the city manager to earmark general fund resources for specific purposes. Under this policy, the city manager set aside $250,000 for the replacement of computer equipment. The amount is not otherwise restricted or committed. How should the $250,000 be classified in the general fund balance sheet?",
      ja: "市議会は、市長(シティ・マネージャー)に一般基金の資源を特定目的に充当する権限を与える方針を採択した。この方針に基づき、市長はコンピュータ機器の更新のために$250,000を確保した。この金額は他に拘束・確約されていない。一般基金の貸借対照表で$250,000をどのように分類すべきか。",
      c: ["Committed fund balance", "Assigned fund balance", "Restricted fund balance", "Unassigned fund balance"],
      a: 1,
      ex: "最高意思決定機関(議会)の正式な決議による制約は確約(committed)だが、議会から委任を受けた職員が意図した用途を示すものは指定(assigned)基金残高となる。外部(債権者・補助金提供者・法令)による制約が拘束(restricted)である。",
    },
    {
      q: "Under GASB Statement No. 84, when should a government recognize a liability to beneficiaries in a fiduciary fund?",
      ja: "GASB第84号において、政府は受託者基金で受益者に対する負債をいつ認識すべきか。",
      c: [
        "When the resources are received by the government",
        "Only at the end of the fiscal year, for all resources held",
        "When the beneficiary submits a written demand for payment",
        "When an event has occurred that compels the government to disburse fiduciary resources",
      ],
      a: 3,
      ex: "GASB 84では、受託資源の支払いを政府に強制する事象が発生した時点(受益者が支払いを要求でき、それ以上の行動・承認・条件がない状態)で受益者に対する負債を認識する。資源受領時に全額負債とするのではない。",
    },
    {
      q: "A city's water utility enterprise fund paid interest of $300,000 on revenue bonds issued to construct its treatment plant and received $40,000 of interest on its investments. How should these items be classified in the enterprise fund's statement of cash flows?",
      ja: "市の水道事業基金は、浄水場建設のために発行したレベニュー債の利息$300,000を支払い、投資から利息$40,000を受け取った。事業基金のキャッシュ・フロー計算書でこれらの項目をどのように区分すべきか。",
      c: [
        "Interest paid: capital and related financing activities; interest received: investing activities",
        "Both items: operating activities",
        "Interest paid: noncapital financing activities; interest received: operating activities",
        "Interest paid: operating activities; interest received: investing activities",
      ],
      a: 0,
      ex: "GASBのキャッシュ・フロー計算書は4区分(営業、非資本的財務、資本的及び関連財務、投資)。資本資産取得のための債務の利息支払は資本的及び関連財務活動、投資からの受取利息は投資活動に区分する。FASBと異なり支払利息は営業活動にならない。",
    },
    {
      q: "A city's total governmental fund revenues are $10,000,000 and total enterprise fund revenues are $4,000,000. All other elements are below the major fund thresholds. Based on revenues, which of the following funds must be reported as a major fund?",
      ja: "市の政府基金の収益合計は$10,000,000、事業基金の収益合計は$4,000,000である。他の構成要素はすべて主要基金の基準を下回っている。収益に基づき、次のうち主要基金として報告しなければならないのはどれか。",
      c: [
        "Special revenue fund A with revenues of $950,000",
        "Enterprise fund D with revenues of $650,000",
        "Special revenue fund B with revenues of $1,050,000",
        "Capital projects fund C with revenues of $600,000",
      ],
      a: 2,
      ex: "主要基金の判定:同種基金合計の10%以上かつ政府基金+事業基金合計の5%以上。Bは1,050/10,000 = 10.5%、1,050/14,000 = 7.5%で該当。Aは9.5%で不該当。Dは事業基金合計の16.25%だが全体の4.6%で5%に満たない。",
    },
    {
      q: "A city issued $5,000,000 of general obligation bonds at par to finance a new library and paid $60,000 of underwriting and legal fees (debt issuance costs other than prepaid insurance) from the proceeds. How should the issuance costs be reported in the government-wide financial statements?",
      ja: "市は新図書館建設の資金として一般財源保証債$5,000,000を額面発行し、手取金から引受手数料・弁護士費用$60,000(前払保険料以外の債券発行費用)を支払った。政府全体財務諸表では発行費用をどのように報告すべきか。",
      c: [
        "As a deferred outflow of resources amortized over the life of the bonds",
        "As an expense in the period incurred",
        "As a reduction of the bonds payable amortized as interest",
        "As part of the cost of the library",
      ],
      a: 1,
      ex: "GASB 65により、前払保険料を除く債券発行費用は発生期間の費用とする(繰延資源流出や負債の減額ではない)。資本プロジェクト基金では額面$5,000,000をその他の資金調達源泉、発行費用$60,000を支出として報告する。",
    },
    {
      q: "A city budgets its general fund on a basis that treats encumbrances as expenditures of the year in which they are incurred. For the year, GAAP-basis expenditures were $4,600,000, including $80,000 for goods ordered in the prior year that were charged to the prior year's budget. Encumbrances outstanding at year-end totaled $120,000. What expenditures should be reported on the budgetary basis in the budgetary comparison schedule?",
      ja: "市の一般基金の予算は、負担額(encumbrances)を発生年度の支出として扱う基準で作成されている。当期のGAAPベースの支出は$4,600,000で、うち$80,000は前年度に発注し前年度予算に計上された物品に係るものである。期末の未決済負担額は$120,000であった。予算比較表に予算ベースで報告すべき支出はいくらか。",
      c: ["$4,560,000", "$4,720,000", "$4,800,000", "$4,640,000"],
      a: 3,
      ex: "予算ベース支出 = GAAP支出4,600,000 + 期末未決済負担額120,000 − 前年度予算に計上済みの80,000 = 4,640,000。前年度分を控除し忘れると$4,720,000となる。",
    },
    {
      q: "A foundation agreed to give a not-for-profit research institute $300,000 for a research program, but only if the institute hires a qualified lead researcher by June 30; any unspent amounts must be returned to the foundation. At signing in March, the foundation advanced $100,000 in cash. At the institute's March 31 year-end, no researcher had been hired. How should the institute report the $100,000?",
      ja: "財団は非営利の研究所に研究プログラムのため$300,000を拠出することに合意したが、研究所が6月30日までに適格な主任研究者を採用することが条件で、未使用額は財団に返還しなければならない。3月の契約時に財団は$100,000を前払いした。研究所の3月31日の期末時点で研究者は採用されていない。研究所はこの$100,000をどのように報告すべきか。",
      c: [
        "As a refundable advance (liability) of $100,000",
        "As contribution revenue with donor restrictions of $100,000",
        "As contribution revenue with donor restrictions of $300,000 and a receivable of $200,000",
        "As contribution revenue without donor restrictions of $100,000",
      ],
      a: 0,
      ex: "測定可能な障壁(主任研究者の採用)と返還の権利の両方があるため条件付寄付であり、障壁が克服されるまで収益認識しない。前受した現金は返還可能前受金(負債)とする。使途制限付寄付(条件なし)と混同しないこと。",
    },
    {
      q: "On December 31, Year 1, a donor made an unconditional promise to give a not-for-profit entity $100,000 at the end of each of the next three years, to be used for any purpose. The appropriate discount rate is 5%, and the present value of an ordinary annuity of $1 for 3 periods at 5% is 2.7232. How should the entity report the promise in its Year 1 statement of activities?",
      ja: "第1年度12月31日、寄付者は非営利組織に対し、今後3年間の各年末に$100,000ずつ、使途を問わず寄付するという無条件の約束をした。適切な割引率は5%、5%・3期間の通常年金現価係数は2.7232である。組織は第1年度の活動計算書でこの約束をどのように報告すべきか。",
      c: [
        "Contribution revenue without donor restrictions of $272,320",
        "Contribution revenue with donor restrictions of $272,320",
        "Contribution revenue with donor restrictions of $300,000",
        "No revenue until the cash is received",
      ],
      a: 1,
      ex: "無条件の寄付約束は約束時に現在価値で認識する:100,000 × 2.7232 = 272,320。将来受け取る金額には暗黙の時間制約があるため、使途の指定がなくても寄付者制約付純資産に分類する。",
    },
    {
      q: "Continuing the previous facts, in Year 2 the not-for-profit entity accretes the discount on the $272,320 promise receivable using the 5% rate. How should the $13,616 accretion be reported?",
      ja: "前問の続きで、第2年度に非営利組織は$272,320の寄付約束債権の割引を5%で増額(アクリーション)する。$13,616の増額はどのように報告すべきか。",
      c: [
        "Interest income without donor restrictions",
        "Investment return with donor restrictions",
        "Contribution revenue (with donor restrictions)",
        "A reduction of fund-raising expense",
      ],
      a: 2,
      ex: "寄付約束債権の割引の償却額は利息収益ではなく寄付収益として、元の寄付と同じ純資産区分(この場合は寄付者制約付)で報告する。272,320 × 5% = 13,616。",
    },
    {
      q: "Which of the following contributed services should a not-for-profit organization recognize as contribution revenue?",
      ja: "非営利組織が寄付収益として認識すべき寄付されたサービスはどれか。",
      c: [
        "Volunteers who greet visitors at the organization's museum",
        "Board members who attend monthly board meetings",
        "Volunteers who stuff envelopes for a fund-raising mailing",
        "A carpenter who volunteers to build a storage building for the organization",
      ],
      a: 3,
      ex: "寄付サービスは①非金融資産を創出・増強する場合、または②専門技能を要し、その技能を有する者が提供し、寄付がなければ購入が必要な場合に認識する。倉庫の建設は非金融資産を創出するため認識する。受付や封入作業は専門技能を要しない。",
    },
    {
      q: "A licensed electrician volunteered to rewire a not-for-profit organization's building. The fair value of the electrician's services was $5,000, and the electrician also donated materials with a fair value of $2,000. The work enhanced the building. What amount of contribution revenue should the organization recognize?",
      ja: "資格を持つ電気技師が非営利組織の建物の配線工事をボランティアで行った。技師のサービスの公正価値は$5,000で、公正価値$2,000の資材も寄付した。この工事により建物の価値が増強された。組織が認識すべき寄付収益はいくらか。",
      c: ["$7,000", "$5,000", "$2,000", "$0"],
      a: 0,
      ex: "非金融資産を増強する寄付サービス$5,000と寄付された資材$2,000はいずれも公正価値で認識する。合計7,000を建物(資本的支出)に計上し、寄付収益とする。サービスのみ・資材のみの金額は誤り。",
    },
    {
      q: "A not-for-profit museum has a policy of not capitalizing its collections, and its collection items meet the definition of a collection. During the year, it used $200,000 of resources without donor restrictions to purchase a painting for its collection. How should the purchase be reported?",
      ja: "非営利の美術館は収蔵品を資産計上しない方針を採っており、その収蔵品はコレクションの定義を満たしている。当期、寄付者制約のない資源$200,000を用いて収蔵品とする絵画を購入した。この購入はどのように報告すべきか。",
      c: [
        "As an asset of $200,000 in the statement of financial position",
        "As a decrease in net assets without donor restrictions in the statement of activities, separate from expenses",
        "As a program expense of $200,000",
        "Only in the notes, with no effect on net assets",
      ],
      a: 1,
      ex: "収蔵品を資産計上しない場合、収蔵品の購入は活動計算書で該当する純資産区分の減少として報告する(費用とは区分)。キャッシュ・フロー計算書では投資活動となる。資産計上する方針でない限り資産には載せない。",
    },
    {
      q: "At the beginning of the year, a not-for-profit organization had $50,000 of net assets with donor restrictions for a literacy program. During the year, it spent $30,000 on the literacy program, satisfying the donors' restrictions to that extent. What is the net effect of these expenditures on net assets without donor restrictions for the year?",
      ja: "期首時点で、非営利組織には識字プログラム用の寄付者制約付純資産$50,000があった。当期、識字プログラムに$30,000を支出し、その範囲で寄付者の制約が満たされた。この支出が当期の寄付者制約なし純資産に与える純影響はいくらか。",
      c: ["Decrease of $30,000", "Increase of $30,000", "No net effect", "Decrease of $50,000"],
      a: 2,
      ex: "制約の解除により寄付者制約付純資産が30,000減少し、寄付者制約なし純資産が30,000増加する(released from restrictions)。費用30,000は常に寄付者制約なし純資産で報告されるため、制約なし純資産への純影響はゼロとなる。",
    },
    {
      q: "A donor gave a not-for-profit organization $600,000 in cash restricted to the purchase of a building. The organization purchased the building and placed it in service during the year. The donor did not specify how long the building must be used. When should the restriction be released?",
      ja: "寄付者は非営利組織に建物購入に使途制限された現金$600,000を寄付した。組織は当期中に建物を購入し使用を開始した。寄付者は建物の使用期間を指定していない。制約はいつ解除すべきか。",
      c: [
        "Over the building's useful life, in proportion to depreciation",
        "When the cash is received",
        "Never, because the building must be held permanently",
        "When the building is placed in service",
      ],
      a: 3,
      ex: "ASU 2016-14により、寄付者が使用期間を指定しない限り、長期性資産の取得に制約された寄付は資産が使用開始された時点で制約解除する(暗黙の時間制約を用いて減価償却に応じて解除する選択肢は廃止された)。",
    },
    {
      q: "A not-for-profit organization received $40,000 from a donor with instructions to transfer the cash to a specified unaffiliated food bank. The organization has not been granted variance power and is not financially interrelated with the food bank. How should the organization report the receipt?",
      ja: "非営利組織は、寄付者から特定の関連のないフードバンクに現金を移転するよう指示されて$40,000を受け取った。組織には変更権(variance power)が与えられておらず、フードバンクとの間に財務的相互関係もない。組織はこの受領をどのように報告すべきか。",
      c: [
        "As an asset and a liability of $40,000",
        "As contribution revenue with donor restrictions of $40,000",
        "As contribution revenue without donor restrictions of $40,000",
        "Only in the notes",
      ],
      a: 0,
      ex: "変更権がなく指定受益者へ移転する仲介者・代理人の立場では、受領資産と同額の受益者に対する負債を計上し、寄付収益は認識しない。変更権が明示的に付与されていれば寄付収益として認識する。",
    },
    {
      q: "A not-for-profit organization's investments produced interest and dividends of $25,000 and net realized and unrealized gains of $40,000 during the year. It paid $5,000 of fees to an external investment advisor. What amount should be reported as investment return in the statement of activities?",
      ja: "非営利組織の投資から当期に利息・配当$25,000、実現・未実現利益(純額)$40,000が生じた。外部の投資顧問に報酬$5,000を支払った。活動計算書で投資収益(investment return)として報告すべき金額はいくらか。",
      c: ["$65,000", "$60,000", "$25,000", "$20,000"],
      a: 1,
      ex: "ASU 2016-14により、投資収益は外部および直接の内部投資費用控除後の純額で表示する:25,000 + 40,000 − 5,000 = 60,000。投資費用の開示は不要。未実現利益を除く金額は誤り。",
    },
    {
      q: "A donor established a perpetual endowment with a gift of $1,000,000 to a not-for-profit organization. Because of market declines, the fair value of the endowment fund fell to $940,000 at year-end. How should the $60,000 deficiency be reported?",
      ja: "寄付者は非営利組織に$1,000,000を寄付して永久基本財産を設定した。市場の下落により、期末の基本財産の公正価値は$940,000に減少した。$60,000の不足額はどのように報告すべきか。",
      c: [
        "As a reduction of net assets without donor restrictions",
        "As a liability to the donor",
        "As a reduction of net assets with donor restrictions, with disclosure of the underwater endowment",
        "As an extraordinary loss",
      ],
      a: 2,
      ex: "ASU 2016-14により、元本割れ(underwater)基本財産の不足額は寄付者制約付純資産の減少として報告し、当初の寄付額、公正価値、不足額、支出方針を開示する。旧基準のような制約なし純資産での計上は行わない。",
    },
    {
      q: "A not-for-profit organization sent an educational mailing that also asked recipients for donations. The mailing meets the purpose, audience, and content criteria for allocating joint costs. How should the $80,000 of joint costs be reported?",
      ja: "非営利組織は、教育目的の郵便物を送付し、その中で寄付も依頼した。この郵便物は共通費配分の目的・対象者・内容の要件を満たしている。$80,000の共通費はどのように報告すべきか。",
      c: [
        "Entirely as fund-raising expense",
        "Entirely as program expense",
        "Entirely as management and general expense",
        "Allocated between program services and fund-raising",
      ],
      a: 3,
      ex: "資金調達を含む活動の共通費は、目的・対象者・内容の3要件をすべて満たす場合に限りプログラム活動と資金調達活動などに配分できる。いずれかを満たさなければ全額を資金調達費とする。",
    },
    {
      q: "A not-for-profit organization reported the following expenses: salaries of program staff, $400,000; costs of a fund-raising campaign, $80,000; salaries of the accounting department, $60,000; depreciation on the facility used solely for programs, $50,000; and the cost of meals provided to attendees at a fund-raising dinner, $20,000. What total program services expense should be reported?",
      ja: "非営利組織の費用は次のとおり:プログラム職員の給与$400,000、資金調達キャンペーン費用$80,000、経理部門の給与$60,000、プログラム専用施設の減価償却費$50,000、資金調達ディナーの参加者に提供した食事の費用$20,000。報告すべきプログラム・サービス費用の合計はいくらか。",
      c: ["$450,000", "$470,000", "$510,000", "$530,000"],
      a: 0,
      ex: "プログラム費用 = 400,000 + 50,000 = 450,000。経理部門は管理・一般費、キャンペーン費用は資金調達費。寄付者への直接便益(食事)はプログラム費用ではなく、特別行事収益と相殺表示するか費用として別掲する。",
    },
    {
      q: "A not-for-profit organization sold 1,000 tickets to its annual gala at $150 each. The fair value of the dinner and entertainment provided to each attendee was $60. What amount of contribution revenue should the organization recognize from the ticket sales?",
      ja: "非営利組織は年次ガラのチケットを1枚$150で1,000枚販売した。各参加者に提供されたディナーと余興の公正価値は$60であった。チケット販売から認識すべき寄付収益はいくらか。",
      c: ["$150,000", "$90,000", "$60,000", "$0"],
      a: 1,
      ex: "チケット代のうち提供された便益の公正価値部分は交換取引の収益(1,000 × 60 = 60,000)、超過部分が寄付(1,000 × (150 − 60) = 90,000)となる。全額を寄付とするのは誤り。",
    },
    {
      q: "A not-for-profit organization reports the following at year-end: cash, $200,000; accounts receivable collectible within one year, $150,000; pledges receivable due in three years, $80,000; and investments of $1,000,000, of which $700,000 is a perpetual donor-restricted endowment and $100,000 is a board-designated quasi-endowment that the board does not intend to spend within the next year. What amount of financial assets is available to meet cash needs for general expenditures within one year?",
      ja: "非営利組織の期末の状況:現金$200,000、1年以内に回収可能な売掛金$150,000、3年後に期日が到来する寄付約束債権$80,000、投資$1,000,000(うち$700,000は寄付者制約付の永久基本財産、$100,000は理事会が翌年に支出する意図のない理事会指定の準基本財産)。1年以内の一般支出に充てるために利用可能な金融資産はいくらか。",
      c: ["$630,000", "$650,000", "$550,000", "$1,350,000"],
      a: 2,
      ex: "ASU 2016-14の流動性開示では、1年以内の一般支出に利用可能な金融資産を定量的に示す。200,000 + 150,000 + (1,000,000 − 700,000 − 100,000)= 550,000。期日が1年超の寄付約束や支出意図のない理事会指定分は除く。",
    },
    {
      q: "In a not-for-profit organization's statement of cash flows, how should $500,000 of cash received from a donor that is restricted by the donor to establishing a permanent endowment be classified?",
      ja: "非営利組織のキャッシュ・フロー計算書において、寄付者が永久基本財産の設定に制約した寄付者からの現金受領$500,000はどのように区分すべきか。",
      c: ["Operating activities", "Investing activities", "Noncash disclosure only", "Financing activities"],
      a: 3,
      ex: "長期目的(永久基本財産、長期性資産の取得など)に制約された現金寄付の受領は財務活動とする。制約のない寄付や当期のプログラムに制約された寄付は営業活動。",
    },
    {
      q: "A not-for-profit organization received a gift of publicly traded stock with no donor restrictions and, following its policy, sold the stock within days of receipt for $45,000. How should the cash proceeds be classified in the statement of cash flows?",
      ja: "非営利組織は寄付者制約のない上場株式の寄贈を受け、方針に従い受領後数日以内に$45,000で売却した。キャッシュ・フロー計算書でこの売却収入をどのように区分すべきか。",
      c: ["Operating activities", "Investing activities", "Financing activities", "Not reported because the stock was donated"],
      a: 0,
      ex: "ASC 230では、寄付された金融資産を制限なく受領後ほぼ直ちに現金化した場合の収入は、寄付の性質に応じて区分する。制約のない寄付であれば営業活動となる(長期目的に制約されていれば財務活動)。投資活動ではない。",
    },
    {
      q: "Under ASU 2016-14, a not-for-profit entity that presents its operating cash flows using the direct method:",
      ja: "ASU 2016-14において、営業活動によるキャッシュ・フローを直接法で表示する非営利組織はどうなるか。",
      c: [
        "Must also present a reconciliation of the change in net assets to net cash from operating activities",
        "Is not required to present the indirect method reconciliation",
        "Must present the reconciliation separately for each net asset class",
        "May not use the direct method",
      ],
      a: 1,
      ex: "ASU 2016-14により、非営利組織は直接法を採用する場合でも間接法による調整表(純資産の変動から営業活動によるキャッシュ・フローへの調整)の表示は不要となった。営利企業(ASC 230)では直接法でも調整表が必要である点と異なる。",
    },
    {
      q: "Under ASU 2020-07, how should a not-for-profit organization present contributed nonfinancial assets (gifts in kind), such as donated food and equipment, in its statement of activities?",
      ja: "ASU 2020-07において、非営利組織は寄贈された食品や備品などの非金融資産の寄付(現物寄付)を活動計算書でどのように表示すべきか。",
      c: [
        "Combined with cash and other financial asset contributions in one line",
        "Only in the notes, not in the statement of activities",
        "As a line item separate from contributions of cash and other financial assets, with disaggregated disclosure by category",
        "As a reduction of program expenses",
      ],
      a: 2,
      ex: "ASU 2020-07は、非金融資産の寄付を現金その他の金融資産の寄付とは区分して活動計算書に表示し、種類別の分解情報や評価方法、使用目的・換金方針などを注記することを求める。",
    },
    {
      q: "The board of trustees of a not-for-profit organization voted to set aside $200,000 of unrestricted resources for the future construction of a new facility. The board may reverse this decision at any time. How should the $200,000 be classified?",
      ja: "非営利組織の理事会は、将来の新施設建設のために制約のない資源$200,000を確保することを決議した。理事会はいつでもこの決定を撤回できる。この$200,000はどのように分類すべきか。",
      c: [
        "Net assets with donor restrictions",
        "A liability",
        "Temporarily restricted net assets",
        "Net assets without donor restrictions (board-designated)",
      ],
      a: 3,
      ex: "理事会指定(board-designated)は寄付者による制約ではないため、寄付者制約なし純資産に含まれる(理事会指定額として内訳表示・開示は可能)。寄付者制約付純資産に分類するのは寄付者が課した制約に限られる。",
    },
    {
      q: "A not-for-profit organization's net assets with donor restrictions were $500,000 at the beginning of the year. During the year: contributions with donor restrictions were $200,000; net assets released from restrictions were $150,000; and investment return on donor-restricted endowments (not yet appropriated) was $30,000. What are net assets with donor restrictions at year-end?",
      ja: "非営利組織の期首の寄付者制約付純資産は$500,000であった。当期:寄付者制約付寄付$200,000、制約解除された純資産$150,000、寄付者制約付基本財産の投資収益(未充当)$30,000。期末の寄付者制約付純資産はいくらか。",
      c: ["$730,000", "$550,000", "$580,000", "$880,000"],
      a: 2,
      ex: "500,000 + 200,000 − 150,000 + 30,000 = 580,000。寄付者制約付基本財産の投資収益は支出が充当されるまで寄付者制約付純資産に含める。制約解除を減算しないと$730,000、投資収益を除くと$550,000となる。",
    },
  ],
});

CPA.tbs({ id: "TBS-FAR-31", section: "FAR", chapter: "FAR-06", title: "固定資産税と資本的支出(基金財務諸表と政府全体財務諸表)",
  scenario: `<p>The City of Ashford has a December 31 fiscal year-end and uses a 60-day availability period for property taxes. Selected Year 1 information for its general fund:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Property taxes levied for Year 1</td><td>$4,000,000</td></tr>
<tr><td>Estimated uncollectible portion of the levy</td><td>2%</td></tr>
<tr><td>Collections during Year 1</td><td>$3,700,000</td></tr>
<tr><td>Expected collections January 1 – February 28, Year 2</td><td>$120,000</td></tr>
<tr><td>Remaining collectible taxes expected after February, Year 2</td><td>$100,000</td></tr>
<tr><td>Equipment purchased for cash on July 1, Year 1 (5-year life, no salvage value, straight-line)</td><td>$300,000</td></tr></table>
<p class="ja">アシュフォード市は12月31日決算で、固定資産税に60日の利用可能期間を採用している。一般基金の第1年度の情報:第1年度分の固定資産税賦課額$4,000,000、回収不能見積率2%、第1年度中の回収額$3,700,000、第2年度1月1日〜2月28日の回収見込額$120,000、第2年度3月以降に回収見込みの残額$100,000、7月1日に現金で購入した備品$300,000(耐用年数5年、残存価額ゼロ、定額法)。</p>`,
  rows: [
    { label: "Property tax revenue — general fund (modified accrual)(一般基金の固定資産税収益・修正発生主義)", type: "num", answer: 3820000 },
    { label: "Deferred inflows of resources for property taxes — general fund(一般基金の固定資産税に係る繰延資源流入)", type: "num", answer: 100000 },
    { label: "Property tax revenue — government-wide statement of activities(政府全体の活動計算書の固定資産税収益)", type: "num", answer: 3920000 },
    { label: "General fund expenditure for the equipment(一般基金の備品に係る支出)", type: "num", answer: 300000 },
    { label: "Depreciation expense on the equipment — government-wide(政府全体の備品減価償却費)", type: "num", answer: 30000 },
    { label: "Classification of the equipment purchase in the general fund operating statement(一般基金の運営計算書における備品購入の区分)", type: "select", options: ["Capital outlay expenditure", "Capital asset", "Other financing use", "Expense"], answer: "Capital outlay expenditure" },
  ],
  explain: `<p>回収可能額 = 4,000,000 × 98% = 3,920,000(回収不能見積80,000)。</p>
<p>修正発生主義の収益 = 期中回収3,700,000 + 期末後60日以内の回収120,000 = 3,820,000。残り100,000は利用可能でないため繰延資源流入とする。</p>
<p>政府全体財務諸表(発生主義)では賦課期間に回収可能額3,920,000の全額を収益とする。</p>
<p>備品は一般基金では資本的支出(capital outlay expenditure)300,000として全額支出処理し、資産計上しない。政府全体では資本資産として計上し、減価償却費 = 300,000 ÷ 5 × 6/12 = 30,000。</p>`,
});

CPA.tbs({ id: "TBS-FAR-32", section: "FAR", chapter: "FAR-06", title: "基金間取引の分類",
  scenario: `<p>The City of Brookfield had the following interfund activities during the year. For each item, select the type of interfund activity under GASB standards.</p>
<ol>
<li>The general fund lent $100,000 to a special revenue fund; the loan is to be repaid within 90 days.</li>
<li>The general fund paid the electric utility enterprise fund $45,000 for electricity used by city hall, billed at standard customer rates.</li>
<li>The general fund sent $600,000 to the debt service fund to provide resources for principal and interest payments on general obligation bonds.</li>
<li>A special revenue fund repaid the general fund $18,000 for salaries the general fund had paid on behalf of employees working solely on the special revenue fund's program.</li>
<li>The fleet maintenance internal service fund billed the police department (general fund) $32,000 for vehicle repairs.</li>
<li>The general fund contributed $1,000,000 to establish a new parking enterprise fund; no repayment is expected.</li>
</ol>
<p class="ja">ブルックフィールド市の当期の基金間取引:①一般基金が特別収入基金に$100,000を貸付(90日以内に返済予定)。②一般基金が市庁舎の電力使用料$45,000を標準料金で電力事業基金に支払。③一般基金が一般財源保証債の元利払いの財源として$600,000を債務返済基金に送金。④特別収入基金が、同基金のプログラムに専従する職員の給与として一般基金が立て替えた$18,000を一般基金に返済。⑤車両整備の内部サービス基金が警察部門(一般基金)に車両修理代$32,000を請求。⑥一般基金が新設の駐車場事業基金の設立資金として$1,000,000を拠出(返済予定なし)。各項目についてGASB基準上の基金間取引の種類を選択せよ。</p>`,
  rows: [
    { label: "Item 1 — Loan to special revenue fund(①特別収入基金への貸付)", type: "select", options: ["Interfund loan", "Interfund services provided and used", "Interfund transfer", "Interfund reimbursement"], answer: "Interfund loan" },
    { label: "Item 2 — Electricity billed at standard rates(②標準料金での電力料金)", type: "select", options: ["Interfund loan", "Interfund services provided and used", "Interfund transfer", "Interfund reimbursement"], answer: "Interfund services provided and used" },
    { label: "Item 3 — Resources sent to the debt service fund(③債務返済基金への送金)", type: "select", options: ["Interfund loan", "Interfund services provided and used", "Interfund transfer", "Interfund reimbursement"], answer: "Interfund transfer" },
    { label: "Item 4 — Repayment of salaries paid on behalf of another fund(④立替給与の返済)", type: "select", options: ["Interfund loan", "Interfund services provided and used", "Interfund transfer", "Interfund reimbursement"], answer: "Interfund reimbursement" },
    { label: "Item 5 — Internal service fund billing for vehicle repairs(⑤内部サービス基金の車両修理代請求)", type: "select", options: ["Interfund loan", "Interfund services provided and used", "Interfund transfer", "Interfund reimbursement"], answer: "Interfund services provided and used" },
    { label: "Item 6 — Contribution to establish a parking enterprise fund(⑥駐車場事業基金の設立拠出)", type: "select", options: ["Interfund loan", "Interfund services provided and used", "Interfund transfer", "Interfund reimbursement"], answer: "Interfund transfer" },
  ],
  explain: `<p>①返済が予定される資金移動は基金間貸付(due from/due to)。</p>
<p>②⑤市場価格・原価回収ベースの財・サービスの売買は「基金間で提供・使用されるサービス」で、購入側は支出(費用)、販売側は収益とする。</p>
<p>③⑥返済を予定しない一方的な資源移転は基金間振替で、政府基金ではその他の資金調達源泉・用途、事業基金では振替として表示する。</p>
<p>④本来負担すべき基金への支出の付け替えは基金間補填で、負担基金で支出を計上し、立替基金の支出を減額する。</p>`,
});

CPA.tbs({ id: "TBS-FAR-33", section: "FAR", chapter: "FAR-06", title: "非営利組織の寄付収益と純資産区分",
  scenario: `<p>Hope Shelter, a not-for-profit organization, had the following transactions during Year 1:</p>
<table><tr><th>#</th><th>Transaction</th></tr>
<tr><td>a</td><td>Received unrestricted cash gifts of $250,000.</td></tr>
<tr><td>b</td><td>Received an unconditional promise to give $60,000 payable in Year 2, for any purpose. Its present value is $57,000.</td></tr>
<tr><td>c</td><td>A foundation pledged $100,000 on the condition that Hope Shelter raise $100,000 in new donations by Year 2 (unmatched amounts are forfeited); the matching has not yet occurred. The foundation advanced $40,000 in cash.</td></tr>
<tr><td>d</td><td>Received $80,000 in cash restricted to a youth counseling program; $50,000 was spent on the program in Year 1.</td></tr>
<tr><td>e</td><td>A licensed nurse volunteered services that Hope Shelter would otherwise have purchased (fair value $12,000). General volunteers donated time valued at $20,000.</td></tr>
<tr><td>f</td><td>Sold 400 tickets to a benefit dinner at $200 each; the fair value of the dinner was $75 per ticket.</td></tr></table>
<p>Hope Shelter does not use the policy of reporting restricted contributions whose restrictions are met in the same period as net assets without donor restrictions.</p>
<p class="ja">非営利組織Hope Shelterの第1年度の取引:a 制約のない現金寄付$250,000。b 第2年度払いの使途を問わない無条件寄付約束$60,000(現在価値$57,000)。c 財団が、Hope Shelterが第2年度までに新規寄付$100,000を集めることを条件に$100,000を約束(未達成分は失効)。マッチングは未達成で、財団は現金$40,000を前払い。d 青少年カウンセリングプログラムに制約された現金$80,000を受領し、第1年度に$50,000をプログラムに支出。e 資格を持つ看護師が、寄付がなければ購入していたサービスを無償提供(公正価値$12,000)。一般ボランティアの時間の評価額は$20,000。f チャリティ・ディナーのチケットを1枚$200で400枚販売(ディナーの公正価値は1枚$75)。同一期間に制約が満たされた制約付寄付を制約なし純資産で報告する方針は採用していない。</p>`,
  rows: [
    { label: "Contribution revenue without donor restrictions(寄付者制約なしの寄付収益)", type: "num", answer: 312000 },
    { label: "Contribution revenue with donor restrictions(寄付者制約付の寄付収益)", type: "num", answer: 137000 },
    { label: "Net assets released from restrictions(制約から解除された純資産)", type: "num", answer: 50000 },
    { label: "Refundable advance (liability) at year-end(期末の返還可能前受金・負債)", type: "num", answer: 40000 },
    { label: "Change in net assets with donor restrictions(寄付者制約付純資産の増減額)", type: "num", answer: 87000 },
    { label: "Special event exchange revenue from the benefit dinner(ディナーの交換取引収益)", type: "num", answer: 30000 },
  ],
  explain: `<p>制約なし寄付 = a 250,000 + e 看護師の専門サービス12,000 + f 寄付部分400 × (200 − 75) = 50,000 → 312,000。一般ボランティアの時間は認識要件を満たさない。</p>
<p>制約付寄付 = b 57,000(将来受取分は暗黙の時間制約)+ d 80,000 = 137,000。</p>
<p>制約解除 = d のプログラム支出50,000。c は測定可能な障壁と権利放棄(失効)を伴う条件付寄付のため収益認識せず、前受金40,000は返還可能前受金(負債)とする。</p>
<p>制約付純資産の増減 = 137,000 − 50,000 = 87,000。ディナーの交換取引収益 = 400 × 75 = 30,000。</p>`,
});
