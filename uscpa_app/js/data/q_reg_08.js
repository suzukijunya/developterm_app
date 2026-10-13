// REG の追加問題(パートナーシップ・S法人・LLC・信託の基礎)

CPA.extend("REG-05", {
  mcq: [
    {
      q: "Ivy, an individual, forms a domestic LLC in which she is the sole member. The LLC does not file Form 8832 or Form 2553. During the year the LLC operates a consulting business. For federal income tax purposes, how is the LLC's income reported?",
      ja: "個人のIvyは自らが唯一のメンバーである国内LLCを設立した。LLCはForm 8832もForm 2553も提出していない。当年、LLCはコンサルティング事業を営んでいる。連邦所得税上、LLCの所得はどのように申告されるか。",
      c: ["On Form 1065 as a partnership", "On Ivy's Form 1040, Schedule C, because the LLC is disregarded", "On Form 1120 as a C corporation", "On Form 1120-S as an S corporation"],
      a: 1,
      ex: "単一メンバーの国内LLCはデフォルトで「無視される事業体(disregarded entity)」であり、個人オーナーの場合はSchedule Cで申告する。パートナーシップ扱いはメンバーが2人以上の場合のデフォルトである。",
    },
    {
      q: "Three individuals form a domestic LLC under state law and make no entity classification election. Which statement is correct regarding the LLC's default federal tax classification?",
      ja: "3人の個人が州法に基づき国内LLCを設立し、事業体区分の選択を行わなかった。LLCのデフォルトの連邦税上の区分について正しいものはどれか。",
      c: ["It is taxed as a C corporation because members have limited liability", "It is a disregarded entity", "It is taxed as a partnership", "It is taxed as an S corporation if all members are U.S. citizens"],
      a: 2,
      ex: "メンバーが2人以上の国内適格事業体(eligible entity)はデフォルトでパートナーシップ扱いとなる。有限責任であっても、Form 8832で法人課税を選択しない限り法人とはならない。",
    },
    {
      q: "A multi-member LLC that had been classified as a partnership since its formation several years earlier elected on Form 8832 to be classified as an association taxable as a corporation, effective January 1, Year 1. In Year 3, the members want to change back to partnership classification. Absent IRS permission or a change of more than 50% in ownership, when is the earliest the LLC may make a new classification election?",
      ja: "設立以来数年間パートナーシップとして区分されてきた複数メンバーのLLCが、Form 8832により1年目1月1日付で法人として課税される社団(association)への区分を選択した。3年目にメンバーはパートナーシップ区分に戻したいと考えている。IRSの許可または50%超の所有権変更がない場合、新たな区分選択を最も早く行えるのはいつか。",
      c: ["Effective 60 months after January 1, Year 1", "Effective January 1, Year 4", "At any time by filing a new Form 8832", "Never; a corporate classification election is irrevocable"],
      a: 0,
      ex: "Check-the-box規則では、区分変更の選択を行った事業体は、その選択の効力発生日から60か月間は再度区分を変更できない(原則)。いつでも変更可能、または取消不能という選択肢は誤り。",
    },
    {
      q: "Which of the following business entities may NOT use the check-the-box regulations to elect to be taxed as a partnership?",
      ja: "次の事業体のうち、check-the-box規則を用いてパートナーシップとしての課税を選択できないものはどれか。",
      c: ["A two-member LLC organized in Delaware", "A state-law limited partnership", "A limited liability partnership with four partners", "An entity incorporated under a state corporation statute"],
      a: 3,
      ex: "州の会社法に基づいて設立された法人はper se corporation(当然法人)であり、区分選択はできない。LLC、LP、LLPは適格事業体であり、パートナーシップ課税が可能(デフォルト)である。",
    },
    {
      q: "Martin contributes land to a partnership in exchange for a 30% interest. The land, which Martin held as an investment for 4 years, has an adjusted basis of $40,000 and a fair market value of $70,000. There are no liabilities. What are the partnership's basis in the land and its holding period?",
      ja: "Martinは30%持分と引換えに土地をパートナーシップに拠出した。Martinが投資目的で4年間保有していたこの土地の調整取得価額は$40,000、公正価値は$70,000である。負債はない。パートナーシップにおける土地の取得価額と保有期間はどうなるか。",
      c: ["$70,000; holding period begins on the contribution date", "$40,000; holding period begins on the contribution date", "$40,000; holding period includes Martin's 4 years", "$70,000; holding period includes Martin's 4 years"],
      a: 2,
      ex: "§721により損益は認識されず、パートナーシップは拠出者の取得価額$40,000を引き継ぐ(§723)。取得価額を引き継ぐ資産の保有期間は拠出者の保有期間を通算する(§1223)。FMVの$70,000は資本勘定(book)上の金額にすぎない。",
    },
    {
      q: "Nora contributes a building with an adjusted basis of $60,000 and a fair market value of $100,000 to a partnership in exchange for a 40% interest. The building is subject to a $50,000 mortgage that the partnership assumes. Partnership liabilities are shared in proportion to interests. What is Nora's initial basis in her partnership interest?",
      ja: "Noraは調整取得価額$60,000、公正価値$100,000の建物を拠出し、パートナーシップの40%持分を取得した。建物には$50,000の抵当債務があり、パートナーシップが引き受けた。パートナーシップの負債は持分比率で分担される。Noraの持分の当初取得価額はいくらか。",
      c: ["$10,000", "$30,000", "$60,000", "$40,000"],
      a: 1,
      ex: "60,000 − 50,000(負債の引受けはみなし現金分配)+ 20,000(パートナーシップ負債の40%分担)= 30,000。純減少額30,000が取得価額60,000以下なので利得は認識しない。$10,000は自己の負債分担の加算を忘れた誤り。",
    },
    {
      q: "Omar contributes equipment with an adjusted basis of $20,000 and a fair market value of $90,000 to a partnership for a 25% interest. The partnership assumes a $60,000 liability secured by the equipment. Partnership liabilities are shared in proportion to interests. What gain does Omar recognize, and what is his basis in his partnership interest?",
      ja: "Omarは調整取得価額$20,000、公正価値$90,000の設備をパートナーシップに拠出し、25%持分を取得した。パートナーシップは設備を担保とする$60,000の負債を引き受けた。負債は持分比率で分担される。Omarが認識する利得と持分の取得価額はいくらか。",
      c: ["Gain $25,000; basis $0", "Gain $40,000; basis $0", "Gain $0; basis $0", "Gain $0; basis $(25,000)"],
      a: 0,
      ex: "負債の純減少額 = 60,000 − 15,000(60,000の25%)= 45,000。これが取得価額20,000を25,000超過するため、その超過額をキャピタルゲイン等として認識し、持分の取得価額は0となる(マイナスにはならない)。$40,000は自己分担額を考慮しない誤り。",
    },
    {
      q: "Paula contributes $10,000 cash and agrees to provide future management services in exchange for a 20% capital interest in an existing partnership. Immediately after the transaction, a liquidation of the partnership would entitle Paula to $40,000. What are Paula's recognized income and her basis in the partnership interest (ignore liabilities)?",
      ja: "Paulaは$10,000の現金を拠出し、将来の経営サービスの提供を約して、既存パートナーシップの20%の資本持分(capital interest)を取得した。取引直後にパートナーシップを清算すれば、Paulaは$40,000を受け取る権利がある。Paulaが認識する所得と持分の取得価額はいくらか(負債は無視)。",
      c: ["$0 income; $10,000 basis", "$30,000 income; $30,000 basis", "$40,000 income; $40,000 basis", "$30,000 income; $40,000 basis"],
      a: 3,
      ex: "サービスの対価として受け取った資本持分の価値 40,000 − 10,000 = 30,000 は通常所得として課税され、取得価額は現金10,000 + 課税された所得30,000 = 40,000となる。利益持分(profits interest)であれば原則として課税されない点と区別する。",
    },
    {
      q: "Rivera Partners reports the following for the year: sales $500,000; cost of goods sold $200,000; salaries to employees $80,000; guaranteed payments to partners $40,000; charitable contributions $5,000; net §1231 gain $10,000; interest income $3,000; and §179 expense $15,000. What is Rivera's ordinary business income (loss) on Form 1065?",
      ja: "Rivera Partnersの当年の数値は次のとおり:売上$500,000、売上原価$200,000、従業員給与$80,000、パートナーへの保証支払$40,000、寄附金$5,000、純§1231利得$10,000、受取利息$3,000、§179費用$15,000。Form 1065上の通常事業所得(損失)はいくらか。",
      c: ["$180,000", "$220,000", "$173,000", "$165,000"],
      a: 0,
      ex: "通常事業所得 = 500,000 − 200,000 − 80,000 − 40,000 = 180,000。保証支払は通常事業所得の計算上控除する。寄附金、§1231利得、利息、§179費用はパートナーごとに制限が異なるため個別記載項目(separately stated)となる。$220,000は保証支払を控除しない誤り。",
    },
    {
      q: "Which of the following items is NOT separately stated on a partner's Schedule K-1 but is instead netted in computing the partnership's ordinary business income?",
      ja: "次のうち、パートナーのSchedule K-1で個別記載されず、パートナーシップの通常事業所得の計算に含めて相殺されるものはどれか。",
      c: ["Net long-term capital gain", "MACRS depreciation on business equipment", "Section 179 expense deduction", "Qualified dividends"],
      a: 1,
      ex: "通常のMACRS減価償却費は事業の経常的な費用として通常事業所得の計算で控除する。キャピタルゲイン、§179費用(パートナー段階で限度額適用)、適格配当(優遇税率)はパートナー段階で扱いが異なるため個別記載される。",
    },
    {
      q: "Stella is a 50% partner in SK Partnership. During the year she received a guaranteed payment of $60,000 for services. SK's ordinary business income before deducting the guaranteed payment was $40,000. What total amount from SK must Stella include in her gross income (net of her share of any partnership loss)?",
      ja: "StellaはSKパートナーシップの50%パートナーである。当年、役務提供に対し$60,000の保証支払を受けた。保証支払控除前のSKの通常事業所得は$40,000であった。Stellaが所得に含めるSKからの合計額(パートナーシップ損失の持分控除後)はいくらか。",
      c: ["$80,000", "$60,000", "$50,000", "$20,000"],
      a: 2,
      ex: "保証支払控除後の通常事業損失 = 40,000 − 60,000 = △20,000、Stellaの持分は△10,000。保証支払60,000は通常所得として全額計上するため、合計 60,000 − 10,000 = 50,000(取得価額が十分にある前提)。$80,000は保証支払を控除前所得の分配と二重計上した誤り。",
    },
    {
      q: "At the beginning of the year, Tom's basis in his partnership interest was $10,000. During the year Tom received a $8,000 cash distribution, and his distributive share of the partnership's ordinary loss was $15,000. There were no other items. How much of the loss may Tom deduct this year (before at-risk and passive activity limits)?",
      ja: "期首におけるTomのパートナーシップ持分の取得価額は$10,000であった。当年、Tomは$8,000の現金分配を受け、通常事業損失の持分は$15,000であった。ほかの項目はない。Tomが当年に控除できる損失額はいくらか(at-risk・パッシブ制限の前)。",
      c: ["$10,000", "$15,000", "$7,000", "$2,000"],
      a: 3,
      ex: "取得価額の調整は増加項目→分配→損失の順で行う。10,000 − 8,000 = 2,000 までしか損失を控除できず、残り13,000は繰越(停止)される。分配より先に損失を充当すると$10,000となるが誤り。",
    },
    {
      q: "Uma's beginning basis in her partnership interest is $30,000. For the year, her shares of partnership items are: ordinary business income $20,000; tax-exempt interest $2,000; charitable contributions $3,000; nondeductible penalties $1,000. She received a $10,000 cash distribution, and her share of partnership liabilities decreased by $4,000. What is Uma's ending basis?",
      ja: "Umaの期首の持分取得価額は$30,000である。当年のパートナーシップ項目の持分は、通常事業所得$20,000、非課税利息$2,000、寄附金$3,000、損金不算入の罰金$1,000。$10,000の現金分配を受け、パートナーシップ負債の分担額は$4,000減少した。Umaの期末の取得価額はいくらか。",
      c: ["$34,000", "$38,000", "$36,000", "$32,000"],
      a: 0,
      ex: "30,000 + 20,000 + 2,000 − 10,000 − 4,000(負債分担の減少はみなし現金分配)− 3,000 − 1,000 = 34,000。非課税所得は増加、損金不算入費用は減少項目である。$38,000は負債減少を無視した誤り。",
    },
    {
      q: "Victor is a limited partner in a partnership that leases equipment. His basis in the partnership interest is $50,000, which includes his $20,000 share of nonrecourse debt that is not qualified nonrecourse financing. Victor has no other passive activities. His share of the partnership's ordinary loss for the year is $45,000. How much of the loss may Victor deduct this year?",
      ja: "Victorは設備リースを営むパートナーシップのリミテッド・パートナーである。持分の取得価額は$50,000で、これには適格ノンリコース融資に該当しないノンリコース債務の分担額$20,000が含まれる。Victorには他のパッシブ活動はない。当年の通常事業損失の持分は$45,000である。Victorが当年控除できる損失はいくらか。",
      c: ["$45,000", "$30,000", "$0", "$25,000"],
      a: 2,
      ex: "損失制限は取得価額→at-risk→パッシブの順で適用する。取得価額50,000では全額通過、at-risk額は30,000(非適格ノンリコース債務を除く)に制限される。さらにリミテッド・パートナーの損失はパッシブであり、パッシブ所得がないため控除額は0。$30,000はパッシブ制限を見落とした誤り。",
    },
    {
      q: "Which of the following would generally be included in a partner's amount at risk under §465?",
      ja: "§465の下で、一般にパートナーのat-risk額に含まれるものはどれか。",
      c: ["The partner's share of a nonrecourse loan used to buy equipment", "A loan from another partner that is guaranteed by the partnership's general partner and is nonrecourse to the borrower", "The partner's share of a recourse partnership loan for which the partner bears the economic risk of loss", "Amounts protected against loss through a stop-loss agreement"],
      a: 2,
      ex: "at-risk額には、拠出した現金・資産の取得価額と、パートナーが経済的損失リスクを負う(リコース)債務が含まれる。ノンリコース債務(不動産の適格ノンリコース融資を除く)やストップロス契約で保護された金額は含まれない。",
    },
    {
      q: "Wendy's basis in her partnership interest is $30,000. In a nonliquidating distribution, she receives $12,000 cash and land with a partnership basis of $25,000 and a fair market value of $40,000. What is Wendy's basis in the land, and what gain does she recognize?",
      ja: "Wendyの持分取得価額は$30,000である。非清算分配として、$12,000の現金と、パートナーシップでの取得価額$25,000・公正価値$40,000の土地を受け取った。Wendyの土地の取得価額と認識する利得はいくらか。",
      c: ["$25,000 basis; $7,000 gain", "$18,000 basis; $0 gain", "$40,000 basis; $0 gain", "$18,000 basis; $7,000 gain"],
      a: 1,
      ex: "まず現金12,000で取得価額を30,000から18,000に減少させる。現金が取得価額を超えないため利得はない。土地の取得価額は「パートナーシップの取得価額25,000」と「残りの持分取得価額18,000」の小さい方の18,000となり、持分の取得価額は0となる。",
    },
    {
      q: "Xavier has a $15,000 basis in his partnership interest. He receives a nonliquidating distribution of $20,000 cash and no other property. His share of partnership liabilities is unchanged. What are the tax consequences to Xavier?",
      ja: "Xavierの持分取得価額は$15,000である。$20,000の現金のみの非清算分配を受けた。パートナーシップ負債の分担額は変わらない。Xavierの課税関係はどうなるか。",
      c: ["$5,000 gain recognized; basis reduced to $0", "$20,000 ordinary income; basis remains $15,000", "No gain; basis reduced to $(5,000)", "No gain; the excess $5,000 is deferred until liquidation"],
      a: 0,
      ex: "現金分配(みなし現金分配を含む)が持分の取得価額を超える場合、その超過額5,000を持分の売却益(原則キャピタルゲイン)として認識し、取得価額は0になる。取得価額はマイナスにならない。",
    },
    {
      q: "Yolanda's basis in her partnership interest is $50,000 when she receives a liquidating distribution of $10,000 cash, inventory with a partnership basis of $15,000 (FMV $18,000), and land with a partnership basis of $10,000 (FMV $30,000). What is Yolanda's basis in the land?",
      ja: "Yolandaの持分取得価額が$50,000のとき、清算分配として現金$10,000、パートナーシップでの取得価額$15,000(FMV $18,000)の棚卸資産、取得価額$10,000(FMV $30,000)の土地を受け取った。Yolandaの土地の取得価額はいくらか。",
      c: ["$10,000", "$30,000", "$25,000", "$22,000"],
      a: 2,
      ex: "清算分配では、現金10,000 → 残40,000、棚卸資産は引継価額15,000 → 残25,000、残額25,000をすべて土地に配分する。棚卸資産の取得価額はパートナーシップの取得価額を超えて増額されない。$22,000は棚卸資産にFMVを用いた誤り。",
    },
    {
      q: "Zack's basis in his partnership interest is $50,000. In complete liquidation of his interest, he receives $20,000 cash and inventory with a partnership basis of $10,000. No other property is distributed and Zack has no share of liabilities. What does Zack recognize?",
      ja: "Zackの持分取得価額は$50,000である。持分の完全清算として、$20,000の現金とパートナーシップでの取得価額$10,000の棚卸資産を受け取った。他の資産の分配はなく、負債の分担もない。Zackは何を認識するか。",
      c: ["No loss; inventory basis becomes $30,000", "$20,000 ordinary loss", "No loss; the $20,000 is deferred", "$20,000 capital loss"],
      a: 3,
      ex: "清算分配で現金・未実現債権・棚卸資産のみを受け取り、その合計(20,000 + 10,000)が持分の取得価額50,000を下回る場合、差額20,000を損失(キャピタルロス)として認識する。棚卸資産の取得価額はパートナーシップの取得価額を超えて引き上げられない。",
    },
    {
      q: "In a liquidating distribution, Amy (outside basis $24,000, no cash received) receives two parcels of land: Parcel A (partnership basis $10,000; FMV $20,000) and Parcel B (partnership basis $20,000; FMV $40,000). What is Amy's basis in Parcel A?",
      ja: "清算分配において、Amy(持分取得価額$24,000、現金の受取なし)は2区画の土地を受け取った。区画A(パートナーシップでの取得価額$10,000、FMV $20,000)と区画B(取得価額$20,000、FMV $40,000)。Amyの区画Aの取得価額はいくらか。",
      c: ["$10,000", "$8,000", "$12,000", "$16,000"],
      a: 1,
      ex: "引継価額合計30,000を持分取得価額24,000まで6,000減額する。含み損のある資産がないため、減額は調整後取得価額の比率で配分:A 6,000 × 10/30 = 2,000、B 4,000。A = 10,000 − 2,000 = 8,000。$12,000は24,000を2区画に均等配分した誤り、$10,000は減額を無視した誤り。",
    },
    {
      q: "Ben and Cal formed an equal partnership. Ben contributed land with an adjusted basis of $30,000 and a fair market value of $50,000; Cal contributed $50,000 cash. Two years later the partnership sold the land for $56,000. The partnership uses the traditional method under §704(c). How much of the gain is allocated to Ben?",
      ja: "BenとCalは均等持分のパートナーシップを設立した。Benは調整取得価額$30,000、公正価値$50,000の土地を、Calは現金$50,000を拠出した。2年後、パートナーシップは土地を$56,000で売却した。§704(c)の伝統的方法を用いている。利得のうちBenに配分される額はいくらか。",
      c: ["$13,000", "$26,000", "$23,000", "$20,000"],
      a: 2,
      ex: "利得合計 = 56,000 − 30,000 = 26,000。拠出時の含み益20,000(拠出前利得)はBenに配分し、残りの6,000を均等に配分(各3,000)。Ben = 20,000 + 3,000 = 23,000。$13,000は拠出前利得を考慮せず均等配分した誤り。",
    },
    {
      q: "A partnership makes a current (nonliquidating) distribution of appreciated land to a partner whose outside basis exceeds the partnership's basis in the land. No cash or marketable securities are distributed, and §751 does not apply. Which statement is correct?",
      ja: "パートナーシップが、含み益のある土地を、持分取得価額が土地のパートナーシップ上の取得価額を上回るパートナーに非清算分配した。現金や市場性有価証券の分配はなく、§751は適用されない。正しい記述はどれか。",
      c: ["The partnership recognizes gain equal to the land's appreciation", "The partner takes a fair market value basis in the land", "The partner recognizes gain to the extent the land's value exceeds its basis", "Neither the partnership nor the partner recognizes gain, and the partner's holding period includes the partnership's"],
      a: 3,
      ex: "資産の分配では原則としてパートナーシップもパートナーも損益を認識しない(§731)。パートナーはパートナーシップの取得価額を引き継ぎ(持分取得価額が上限)、保有期間も通算される。FMVでの取得価額や利得認識は法人の現物配当のルールと混同した誤り。",
    },
    {
      q: "Brad sells his 25% partnership interest to a new partner for $80,000 cash, and the buyer assumes Brad's $20,000 share of partnership liabilities. Brad's basis in the interest, including his share of liabilities, is $70,000. The cash-method partnership holds accounts receivable with a zero basis; Brad's share of their value is $12,000. There are no other §751 assets. How should Brad report the sale?",
      ja: "Bradは25%のパートナーシップ持分を新パートナーに現金$80,000で売却し、買主はBradのパートナーシップ負債の分担額$20,000を引き受けた。負債分担額を含む持分の取得価額は$70,000である。現金主義のパートナーシップは取得価額ゼロの売掛金を保有しており、Bradの持分相当額は$12,000である。他に§751資産はない。Bradはどのように申告すべきか。",
      c: ["$30,000 capital gain", "$12,000 ordinary income and $18,000 capital gain", "$12,000 ordinary income and $2,000 capital loss", "$10,000 capital gain"],
      a: 1,
      ex: "実現額 = 現金80,000 + 負債の免除20,000 = 100,000、利得 = 100,000 − 70,000 = 30,000。未実現債権(hot asset)に帰属する12,000は通常所得、残り18,000はキャピタルゲインとなる。負債の免除を実現額に含めないと$10,000の利得となり誤り。",
    },
    {
      q: "For purposes of §751 (hot assets) on the sale of a partnership interest, which of the following is treated as an unrealized receivable?",
      ja: "パートナーシップ持分の売却における§751(ホット・アセット)上、未実現債権(unrealized receivable)として扱われるものはどれか。",
      c: ["Potential §1245 depreciation recapture on partnership equipment", "Land held for investment that has appreciated", "Cash held in the partnership's bank account", "Goodwill created by the partnership"],
      a: 0,
      ex: "未実現債権には、現金主義の売掛金のほか、資産を売却したと仮定した場合の§1245減価償却の取戻し(recapture)部分が含まれる。投資目的の土地やのれんはキャピタル資産・§1231資産として扱われ、現金はhot assetではない。",
    },
    {
      q: "A partnership has three partners: Alpha Corp. owns a 30% interest and has a June 30 year-end; Beta Corp. owns a 25% interest and has a June 30 year-end; Gamma, an individual, owns a 45% interest and uses the calendar year. Absent a business purpose or §444 election, what is the partnership's required tax year?",
      ja: "パートナーシップには3人のパートナーがいる。Alpha社(30%、6月30日決算)、Beta社(25%、6月30日決算)、個人のGamma(45%、暦年)。事業目的や§444選択がない場合、パートナーシップの要求課税年度はどれか。",
      c: ["Calendar year, because the largest single partner uses it", "June 30, because partners owning more than 50% share that year", "Calendar year, because a partnership must always use the calendar year", "Any year the partnership selects"],
      a: 1,
      ex: "第一順位は過半数持分課税年度(majority interest taxable year):同一の課税年度を持つパートナーの持分合計が50%を超えればその年度となる。AlphaとBetaで55%が6月30日決算のため6月30日となる。最大の単独パートナーの年度ではない。",
    },
    {
      q: "A partnership has two partners, each owning 50% of profits and capital. Partner X has a June 30 year-end and Partner Y has a September 30 year-end. No majority interest or principal partner year exists. Using the least aggregate deferral test, which year-end must the partnership adopt?",
      ja: "パートナーシップには利益・資本をそれぞれ50%ずつ保有する2人のパートナーがいる。Xは6月30日決算、Yは9月30日決算である。過半数持分年度も主要パートナー年度も存在しない。最小累積繰延テストを用いると、パートナーシップはどの決算日を採用しなければならないか。",
      c: ["June 30", "September 30", "December 31", "Either June 30 or September 30, at the partnership's option"],
      a: 0,
      ex: "6月30日を試すと、Yの繰延月数3か月 × 50% = 1.5。9月30日を試すと、Xの繰延月数9か月 × 50% = 4.5。累積繰延が最小となる6月30日を採用する。どちらでも選べるわけではない。",
    },
    {
      q: "A calendar-year partnership files Form 7004 to request an automatic extension for its Year 1 Form 1065. What is the extended due date of the return?",
      ja: "暦年のパートナーシップが1年目のForm 1065についてForm 7004で自動延長を申請した。延長後の申告期限はいつか。",
      c: ["April 15, Year 2", "October 15, Year 2", "September 15, Year 2", "March 15, Year 2"],
      a: 2,
      ex: "Form 1065の期限は課税年度終了後3か月目の15日(暦年なら3月15日)で、6か月の自動延長により9月15日となる。10月15日は個人(Form 1040)やC法人の延長期限である。",
    },
    {
      q: "A calendar-year partnership with 4 partners filed its Year 1 Form 1065 on May 25, Year 2, without an extension and without reasonable cause. Assume the late-filing penalty is $250 per partner for each month or part of a month the return is late (maximum 12 months). What is the penalty?",
      ja: "4人のパートナーを有する暦年のパートナーシップが、延長申請をせず合理的理由もなく、1年目のForm 1065を2年目5月25日に提出した。期限後提出ペナルティは、遅延した各月(1か月未満も1か月とする)ごとにパートナー1人当たり$250(最大12か月)と仮定する。ペナルティはいくらか。",
      c: ["$2,000", "$3,000", "$2,250", "$4,000"],
      a: 1,
      ex: "期限は3月15日。5月25日の提出は2か月と10日の遅延で、端数月も1か月と数えるため3か月。250 × 4人 × 3か月 = 3,000。$2,000は端数月を切り捨てた誤り。",
    },
    {
      q: "Dana is a limited partner (not a general partner) in an operating business partnership. For the year she received a $20,000 guaranteed payment for services actually rendered to the partnership, and her distributive share of ordinary business income was $30,000. What are Dana's net earnings from self-employment from the partnership (before the 92.35% adjustment)?",
      ja: "Danaは事業を営むパートナーシップのリミテッド・パートナー(ジェネラル・パートナーではない)である。当年、実際に提供した役務に対する保証支払$20,000を受け、通常事業所得の分配持分は$30,000であった。パートナーシップからのDanaの自営業純所得(92.35%調整前)はいくらか。",
      c: ["$50,000", "$30,000", "$0", "$20,000"],
      a: 3,
      ex: "リミテッド・パートナーの分配持分は自営業税の対象外だが、役務に対する保証支払は対象となる。したがって20,000。ジェネラル・パートナーであれば通常事業所得30,000も含め50,000となる。",
    },
    {
      q: "Eli is a general partner in a service partnership. For the year he received a $30,000 guaranteed payment for services. His distributive shares were: ordinary business loss $(10,000); net §1231 gain $4,000; interest income $1,000. What are Eli's net earnings from self-employment (before the 92.35% adjustment)?",
      ja: "Eliはサービス業のパートナーシップのジェネラル・パートナーである。当年、役務に対する保証支払$30,000を受けた。分配持分は、通常事業損失△$10,000、純§1231利得$4,000、受取利息$1,000であった。Eliの自営業純所得(92.35%調整前)はいくらか。",
      c: ["$20,000", "$25,000", "$30,000", "$24,000"],
      a: 0,
      ex: "ジェネラル・パートナーの自営業所得 = 保証支払30,000 + 通常事業損益△10,000 = 20,000。§1231利得や利息などの投資的所得は自営業所得から除外される。$25,000はこれらを含めた誤り。",
    },
    {
      q: "AB is a limited partnership. A, the sole general partner, and B, a limited partner, share profits and losses equally. The partnership has a $40,000 recourse liability; B has not guaranteed the debt and has no obligation to restore a deficit. How is the liability allocated for purposes of the partners' outside bases?",
      ja: "ABはリミテッド・パートナーシップである。唯一のジェネラル・パートナーAとリミテッド・パートナーBは損益を均等に分担する。パートナーシップには$40,000のリコース債務があり、Bは保証しておらず欠損填補義務もない。各パートナーの持分取得価額上、債務はどのように配分されるか。",
      c: ["A $20,000; B $20,000", "A $0; B $40,000", "A $40,000; B $0", "Neither partner; recourse debt does not affect basis"],
      a: 2,
      ex: "リコース債務は経済的損失リスク(economic risk of loss)を負うパートナーに配分される。損失リスクを負うのは無限責任のジェネラル・パートナーAのみであるため、全額40,000がAに配分される。損益比率での均等配分はノンリコース債務の考え方である。",
    },
    {
      q: "Fay had $13,000 of partnership losses suspended last year because her basis was reduced to zero. This year her distributive share of ordinary business income is $20,000, and there are no distributions or other items. What is Fay's basis in her partnership interest at the end of this year?",
      ja: "Fayは前年、持分の取得価額がゼロになったため$13,000のパートナーシップ損失が控除停止となった。当年の通常事業所得の分配持分は$20,000で、分配その他の項目はない。当年末のFayの持分取得価額はいくらか。",
      c: ["$20,000", "$7,000", "$33,000", "$0"],
      a: 1,
      ex: "当年の所得で取得価額が20,000に増加し、前年の停止損失13,000を控除できるようになる(繰越期間は無期限)。期末取得価額 = 20,000 − 13,000 = 7,000。停止損失の控除を無視すると$20,000となり誤り。",
    },
    {
      q: "Gina, a calendar-year individual, is a partner in a partnership whose tax year ends September 30. She receives a guaranteed payment of $5,000 per month for services from October 1, Year 1 through September 30, Year 2. How much of the guaranteed payments must Gina include in income for Year 2?",
      ja: "暦年課税の個人Ginaは、9月30日決算のパートナーシップのパートナーである。1年目10月1日から2年目9月30日まで、毎月$5,000の役務に対する保証支払を受けた。Ginaが2年目の所得に含めるべき保証支払の額はいくらか。",
      c: ["$45,000", "$15,000", "$60,000", "$0"],
      a: 2,
      ex: "保証支払は、パートナーの課税年度内に終了するパートナーシップの課税年度の所得として計上する。2年目9月30日に終了するパートナーシップ年度の12か月分60,000をすべて2年目に含める。実際の受領月で区分した$45,000(2年目1-9月分)は誤り。",
    },
    {
      q: "Which of the following is permitted to be a shareholder of an S corporation?",
      ja: "次のうち、S法人の株主となることが認められるものはどれか。",
      c: ["A nonresident alien individual", "A partnership", "The estate of a deceased individual shareholder", "A C corporation"],
      a: 2,
      ex: "S法人の株主は、米国市民・居住者である個人、遺産財団(estate)、一定の信託(QSST、ESBT、グランター・トラスト等)、免税団体等に限られる。非居住外国人、パートナーシップ、C法人は株主になれない。",
    },
    {
      q: "Harbor Inc., a domestic corporation with 40 shareholders, wants to elect S status. Which of the following features of its capital structure would NOT prevent a valid S election?",
      ja: "株主40人の国内法人Harbor社はS法人の選択を希望している。次の資本構成のうち、有効なS選択の妨げとならないものはどれか。",
      c: ["Common stock with identical distribution and liquidation rights, some voting and some nonvoting", "Preferred stock with a cumulative dividend preference", "Two classes of common stock with different liquidation preferences", "Common stock held by a foreign corporation"],
      a: 0,
      ex: "S法人は1種類の株式しか発行できないが、分配・残余財産の権利が同一であれば議決権の有無の違いは許容される。優先株式や残余財産優先権の違いは2種類目の株式となり、外国法人は株主になれない。",
    },
    {
      q: "Cedar Corp., a calendar-year C corporation, files Form 2553 on April 1, Year 1, with the consent of all shareholders, electing S status. Cedar does not qualify for, or request, late-election relief. When is the election effective?",
      ja: "暦年のC法人Cedar社は、全株主の同意を得て1年目4月1日にForm 2553を提出し、S法人を選択した。Cedarは遅延選択の救済に該当せず申請もしていない。選択はいつから有効となるか。",
      c: ["April 1, Year 1", "January 1, Year 1", "January 1, Year 2", "The election is invalid and must be refiled"],
      a: 2,
      ex: "当年度から有効とするには、課税年度開始後2か月と15日以内(暦年なら3月15日まで)に提出しなければならない。期限後の提出は翌課税年度(2年目1月1日)から有効となる。提出日から有効になるわけではない。",
    },
    {
      q: "On February 20, Year 1, calendar-year Dune Corp. files Form 2553 signed by all current shareholders. Kim, who owned 10% of Dune's stock from January 1 until she sold it on February 5, Year 1, did not consent. When is the S election effective?",
      ja: "暦年のDune社は1年目2月20日に、現株主全員が署名したForm 2553を提出した。1年目1月1日から2月5日に売却するまでDune株式の10%を保有していたKimは同意していない。S選択はいつから有効となるか。",
      c: ["January 1, Year 1", "January 1, Year 2", "February 20, Year 1", "February 5, Year 1"],
      a: 1,
      ex: "期限内(3月15日まで)の提出でも、当年度のうち選択前に株主であった者が同意していない場合(または選択前の期間に適格要件を満たさない場合)、選択は翌年度から有効となる。したがって2年目1月1日からとなる。",
    },
    {
      q: "Ella's beginning stock basis in an S corporation (no accumulated E&P) is $20,000. Her shares of the current-year items are: ordinary business income $15,000; tax-exempt interest $1,000; nondeductible expenses $2,000; long-term capital loss $3,000. She receives a cash distribution of $25,000. Under the default ordering rules, what is Ella's ending stock basis?",
      ja: "S法人(累積E&Pなし)におけるEllaの期首の株式取得価額は$20,000である。当年の持分は、通常事業所得$15,000、非課税利息$1,000、損金不算入費用$2,000、長期キャピタルロス$3,000。現金$25,000の分配を受けた。デフォルトの順序規則による期末の株式取得価額はいくらか。",
      c: ["$8,000", "$9,000", "$4,000", "$6,000"],
      a: 3,
      ex: "増加項目 20,000 + 15,000 + 1,000 = 36,000 → 分配 25,000 → 11,000 → 損金不算入費用 2,000 → 9,000 → 損失 3,000 → 6,000。分配は損失より先に減額するため非課税で受け取れる。$8,000は損金不算入費用を無視した誤り。",
    },
    {
      q: "At the beginning of Year 1, Finn had stock basis of $4,000 in an S corporation and had loaned the corporation $10,000. His share of the Year 1 ordinary loss was $9,000. In Year 2 his share of ordinary income was $6,000, and there were no distributions. What are Finn's stock basis and debt basis at the end of Year 2?",
      ja: "1年目期首、FinnのS法人株式の取得価額は$4,000で、同社に$10,000を貸し付けていた。1年目の通常損失の持分は$9,000であった。2年目の通常所得の持分は$6,000で、分配はなかった。2年目末のFinnの株式取得価額と貸付金(debt)取得価額はいくらか。",
      c: ["Stock $6,000; debt $5,000", "Stock $1,000; debt $10,000", "Stock $0; debt $11,000", "Stock $5,000; debt $6,000"],
      a: 1,
      ex: "1年目:損失9,000のうち4,000で株式を0に、残り5,000で貸付金取得価額を5,000に減額(全額控除可)。2年目:純増加はまず減額された貸付金取得価額の回復に充て(5,000で10,000に回復、上限は元本)、残り1,000が株式取得価額となる。株式から先に増加させるのは誤り。",
    },
    {
      q: "Larch Inc., a calendar-year S corporation, has ordinary business income of $365,000 for a non-leap year, earned evenly. Leo owned 50% of the stock and sold all of it to Mia on April 1. Under the regulations, a shareholder who disposes of stock is treated as the shareholder for the day of the disposition. No election to close the books is made. What is Leo's share of the ordinary business income?",
      ja: "暦年のS法人Larch社の通常事業所得は$365,000(平年、均等に発生)である。Leoは株式の50%を保有していたが、4月1日に全株をMiaに売却した。規則上、株式を処分した株主は処分日を株主として扱われる。帳簿閉鎖の選択は行っていない。Leoの通常事業所得の持分はいくらか。",
      c: ["$45,000", "$45,500", "$182,500", "$46,000"],
      a: 1,
      ex: "1株1日当たり按分:1日当たり所得 365,000 ÷ 365 = 1,000。Leoの保有日数は1月31 + 2月28 + 3月31 + 4月1日の1 = 91日。1,000 × 91 × 50% = 45,500。$45,000は売却日を含めない誤り、$182,500は年間を通じた50%とした誤り。",
    },
    {
      q: "A shareholder of a calendar-year S corporation terminates her entire 40% interest by selling her stock at the end of the day on June 30. The corporation's books show ordinary income of $20,000 for January 1 through June 30 and $180,000 for July 1 through December 31. If the corporation and all affected shareholders consent to the §1377(a)(2) election to close the books, what is the selling shareholder's share of ordinary income?",
      ja: "暦年S法人の株主が6月30日の終業時に株式を売却し、40%の持分をすべて手放した。帳簿上の通常所得は1月1日〜6月30日が$20,000、7月1日〜12月31日が$180,000である。法人と影響を受ける全株主が§1377(a)(2)の帳簿閉鎖選択に同意した場合、売却株主の通常所得の持分はいくらか。",
      c: ["$8,000", "$40,000", "$80,000", "$39,671"],
      a: 0,
      ex: "帳簿閉鎖の選択(terminating election)をすると、課税年度を売却日で2つに区分し、実際の帳簿上の所得で配分する。売却株主 = 20,000 × 40% = 8,000。選択しなければ1株1日按分となり年間200,000の約半分×40%(約$39,671)となる。",
    },
    {
      q: "Mason is the sole shareholder of an S corporation that has never been a C corporation. At the beginning of the year his stock basis is $30,000. The corporation has no income or loss for the year and distributes $40,000 cash to Mason. How should Mason report the distribution?",
      ja: "Masonは、C法人であったことのないS法人の唯一の株主である。期首の株式取得価額は$30,000。当年の損益はなく、法人はMasonに現金$40,000を分配した。Masonはこの分配をどのように申告すべきか。",
      c: ["$40,000 dividend income", "$30,000 nontaxable and $10,000 dividend", "$40,000 nontaxable; stock basis becomes $(10,000)", "$30,000 nontaxable return of basis and $10,000 capital gain"],
      a: 3,
      ex: "E&PのないS法人の分配は、まず株式取得価額の範囲で非課税(30,000)、超過額10,000は株式の売却益(キャピタルゲイン)として扱われる。E&Pがないため配当にはならず、取得価額はマイナスにならない。",
    },
    {
      q: "Nash Corp., an S corporation that was formerly a C corporation, has an accumulated adjustments account (AAA) of $20,000 and accumulated E&P of $15,000 at year-end, after current-year adjustments. Its sole shareholder, whose stock basis is $50,000, receives a $30,000 cash distribution. No elections are made. How is the distribution treated?",
      ja: "かつてC法人であったS法人Nash社の期末(当年調整後)の累積調整勘定(AAA)は$20,000、累積E&Pは$15,000である。株式取得価額$50,000の唯一の株主が$30,000の現金分配を受けた。選択は行っていない。分配はどのように扱われるか。",
      c: ["$30,000 nontaxable return of basis", "$20,000 nontaxable; $10,000 dividend", "$15,000 dividend; $15,000 nontaxable", "$20,000 nontaxable; $10,000 capital gain"],
      a: 1,
      ex: "E&Pを有するS法人の分配は、①AAAの範囲で非課税(取得価額の減額)20,000、②次に累積E&Pから配当として10,000、③その後は取得価額の回収・キャピタルゲインの順となる。取得価額が十分でも、AAAを超える部分はE&Pの範囲で配当となる。",
    },
    {
      q: "An S corporation with accumulated E&P from prior C corporation years earns $8,000 of tax-exempt municipal bond interest. How does this item affect the shareholders' stock basis and the corporation's accumulated adjustments account (AAA)?",
      ja: "過去のC法人時代の累積E&PがあるS法人が、非課税の地方債利息$8,000を得た。この項目は株主の株式取得価額と法人の累積調整勘定(AAA)にどのように影響するか。",
      c: ["Increases stock basis; does not increase AAA", "Increases both stock basis and AAA", "Increases AAA; does not affect stock basis", "Affects neither stock basis nor AAA"],
      a: 0,
      ex: "非課税所得は株主の株式取得価額を増加させるが、AAAには含めず、その他調整勘定(OAA)に計上する。AAAは課税済みで未分配の利益を追跡する勘定だからである。",
    },
    {
      q: "Nina, an S corporation shareholder, has $8,000 of losses suspended because her stock and debt basis were reduced to zero. She sells all of her stock to an unrelated buyer at year-end and has no remaining loans to the corporation. What happens to the suspended losses?",
      ja: "S法人の株主Ninaは、株式と貸付金の取得価額がゼロになったため$8,000の損失が控除停止となっている。期末に全株式を無関係の買主に売却し、法人への貸付金も残っていない。停止損失はどうなるか。",
      c: ["They transfer to the buyer with the stock", "They are deductible by Nina in the year of sale", "They are permanently lost", "They are carried back to the prior three years"],
      a: 2,
      ex: "取得価額不足で停止されたS法人の損失はその株主個人に帰属し、株式を保有している限り無期限に繰り越せるが、株式を(配偶者等への移転を除き)売却すると消滅する。買主には引き継がれない。",
    },
    {
      q: "Opal owns 30% of an S corporation that operates a restaurant but does not materially participate in its operations. Her stock basis and amount at risk are both $50,000. Her share of the corporation's ordinary loss is $20,000, and she has no passive income from any source. How much of the loss may Opal deduct?",
      ja: "Opalはレストランを営むS法人の30%を保有しているが、事業に実質的に参加(material participation)していない。株式取得価額とat-risk額はともに$50,000。通常損失の持分は$20,000で、いかなるパッシブ所得もない。Opalが控除できる損失はいくらか。",
      c: ["$20,000", "$0", "$3,000", "$6,000"],
      a: 1,
      ex: "取得価額・at-risk額の制限は通過するが、実質的に参加していない事業の損失はパッシブ損失であり、パッシブ所得の範囲でしか控除できない。パッシブ所得がないため控除額は0(停止損失として繰越)。$3,000はキャピタルロス控除限度と混同した誤り。",
    },
    {
      q: "Pine Corp., a calendar-year C corporation, elected S status effective January 1, Year 1. On that date its only built-in gain asset was land with a basis of $60,000 and a fair market value of $100,000 (net unrealized built-in gain $40,000). In Year 3 Pine sells the land for $110,000. Pine's taxable income computed as if it were a C corporation is $70,000. Assuming a 21% rate, what is Pine's built-in gains tax for Year 3?",
      ja: "暦年のC法人Pine社は1年目1月1日付でS法人を選択した。同日の唯一の含み益資産は土地(取得価額$60,000、公正価値$100,000、純未実現含み益$40,000)であった。3年目にPineは土地を$110,000で売却した。C法人とみなして計算した課税所得は$70,000である。税率21%とすると、3年目の含み益課税(BIG tax)はいくらか。",
      c: ["$10,500", "$14,700", "$0", "$8,400"],
      a: 3,
      ex: "認識される含み益は転換時の含み益40,000が上限(転換後の値上り10,000は対象外)。課税所得70,000と比べ小さい方の40,000 × 21% = 8,400。$10,500は売却益全体50,000に課税した誤り。認識期間(5年)内のため課税される。",
    },
    {
      q: "A C corporation converted to S status on January 1, Year 1, holding assets with a net unrealized built-in gain. Which sale of a built-in gain asset would NOT be subject to the built-in gains tax?",
      ja: "C法人が含み益(純未実現含み益)のある資産を保有した状態で1年目1月1日にS法人へ転換した。含み益資産の次の売却のうち、含み益課税の対象とならないものはどれか。",
      c: ["A sale in Year 2", "A sale in Year 4", "A sale in Year 6", "A sale on December 31, Year 5"],
      a: 2,
      ex: "含み益課税の認識期間はS法人の最初の課税年度開始日から5年間(1年目〜5年目)である。6年目の売却は期間経過後のため課税されない。5年目12月31日の売却は期間内である。",
    },
    {
      q: "Quail Inc., an S corporation, has accumulated E&P of $50,000 from its C corporation years. This year its gross receipts are $400,000, of which $200,000 is passive investment income (interest and dividends). Expenses directly connected with the passive investment income are $40,000. Assume a 21% rate and that taxable income does not limit the computation. What is the tax on excess net passive income?",
      ja: "S法人Quail社はC法人時代の累積E&Pが$50,000ある。当年の総収入は$400,000で、うち$200,000が受動的投資所得(利息・配当)である。受動的投資所得に直接関連する費用は$40,000。税率21%、課税所得による制限はないものとする。超過純受動所得に対する税額はいくらか。",
      c: ["$16,800", "$33,600", "$21,000", "$12,600"],
      a: 0,
      ex: "純受動所得 = 200,000 − 40,000 = 160,000。超過純受動所得 = 160,000 × (200,000 − 400,000 × 25%) ÷ 200,000 = 80,000。税額 = 80,000 × 21% = 16,800。$33,600は純受動所得全額に課税した誤り。",
    },
    {
      q: "An S corporation has accumulated E&P from its C corporation years. Its passive investment income exceeded 25% of gross receipts in Years 1, 2, and 3. When does its S election terminate?",
      ja: "S法人にはC法人時代の累積E&Pがある。1年目、2年目、3年目に受動的投資所得が総収入の25%を超えた。S選択はいつ終了するか。",
      c: ["At the end of Year 1", "On the first day of Year 3", "It does not terminate; only the passive investment income tax applies", "On the first day of Year 4"],
      a: 3,
      ex: "累積E&Pを有するS法人の受動的投資所得が3年連続で総収入の25%を超えた場合、S選択は4年目の初日に終了する。それまでの各年は受動的投資所得税の対象となる。",
    },
    {
      q: "Reed Corp., a calendar-year S corporation, has 10 individual shareholders. On August 10, Year 1, one shareholder sells 5% of the stock to a partnership. Absent inadvertent-termination relief, what are the consequences?",
      ja: "暦年のS法人Reed社には10人の個人株主がいる。1年目8月10日、株主の1人が株式の5%をパートナーシップに売却した。不注意による終了の救済がない場合、どのような結果となるか。",
      c: ["The S election terminates on January 1, Year 2", "The S election terminates on August 10, Year 1; the S short year ends August 9", "The S election remains valid because the partnership owns less than 10%", "The S election terminates retroactively to January 1, Year 1"],
      a: 1,
      ex: "パートナーシップは不適格株主であり、適格要件を満たさなくなった日(8月10日)に選択が終了する。S短期年度は8月9日に終了し、8月10日からC法人の短期年度となる。保有割合の大小は関係ない。",
    },
    {
      q: "An S corporation's election was revoked effective January 1, Year 1. Absent IRS consent, what is the first taxable year for which the corporation may make a new S election?",
      ja: "S法人の選択が1年目1月1日付で取り消された。IRSの同意がない場合、法人が新たにS選択を行える最初の課税年度はどれか。",
      c: ["Year 2", "Year 4", "Year 6", "Year 11"],
      a: 2,
      ex: "S選択が終了・取消された場合、IRSの同意がない限り、終了年度から5課税年度経過するまで再選択できない。1年目から5年目まで不可のため、最初は6年目となる。",
    },
    {
      q: "A calendar-year S corporation has not requested an extension. By what date must it file its Form 1120-S, and what is the extended due date if it timely files Form 7004?",
      ja: "暦年のS法人は延長を申請していない。Form 1120-Sの提出期限はいつか。また、Form 7004を期限内に提出した場合の延長後期限はいつか。",
      c: ["April 15; October 15", "March 15; October 15", "March 15; September 15", "April 15; September 15"],
      a: 2,
      ex: "Form 1120-S(パススルー事業体)の期限はForm 1065と同じく3か月目の15日(暦年なら3月15日)、6か月延長で9月15日となる。4月15日・10月15日はC法人(Form 1120)の期限である。",
    },
    {
      q: "Sam is the sole shareholder and full-time CEO of a profitable S corporation. He wants to minimize employment taxes by taking all of his compensation as distributions. Which statement is correct?",
      ja: "Samは収益性のあるS法人の唯一の株主で、常勤のCEOである。雇用税を最小化するため、報酬をすべて分配として受け取りたいと考えている。正しい記述はどれか。",
      c: ["Distributions to a shareholder-employee are subject to self-employment tax", "The IRS may recharacterize distributions as wages if Sam is not paid reasonable compensation for his services", "S corporations are prohibited from paying wages to shareholders", "Sam's distributive share of ordinary income is subject to self-employment tax"],
      a: 1,
      ex: "S法人の株主兼従業員には役務に見合う合理的な報酬を給与として支払う必要があり、これを怠るとIRSは分配を給与(FICA課税)に再分類できる。S法人の所得の分配持分や分配自体は自営業税の対象ではない。",
    },
    {
      q: "Which of the following items must an S corporation report as a separately stated item on Schedule K-1 rather than include in ordinary business income?",
      ja: "次のうち、S法人が通常事業所得に含めず、Schedule K-1で個別記載しなければならない項目はどれか。",
      c: ["Salaries paid to non-shareholder employees", "Cost of goods sold", "Net long-term capital gain", "Bad debt expense on trade receivables"],
      a: 2,
      ex: "長期キャピタルゲインは株主段階で優遇税率やキャピタルロスとの相殺が適用されるため個別記載する。従業員給与、売上原価、営業債権の貸倒損失は通常事業所得の計算に含める。",
    },
    {
      q: "Assume the Form 1041 filing threshold is gross income of $600 for estates and, for trusts, any taxable income or gross income of $600 or more; the personal exemption is $300 for a simple trust and $100 for a complex trust. Which of the following must file Form 1041 for the year (no beneficiary is a nonresident alien)?",
      ja: "Form 1041の申告義務の基準は、遺産財団は総所得$600以上、信託は課税所得がある場合または総所得$600以上とする。人的控除は単純信託$300、複合信託$100とする。次のうち当年Form 1041を提出しなければならないものはどれか(非居住外国人の受益者はいない)。",
      c: ["An estate with gross income of $550", "A simple trust with gross income of $500, all distributed currently", "A simple trust with gross income of $280, all distributed currently", "A complex trust with gross income of $400, none distributed, and no deductions"],
      a: 3,
      ex: "複合信託:400 − 100(控除)= 300の課税所得があるため申告が必要。遺産財団は総所得600未満なら不要、単純信託は全額分配により分配控除後の課税所得が0で総所得も600未満のため不要。",
    },
    {
      q: "A trust instrument requires that all income be distributed currently and does not provide for charitable contributions. In the current year, the trustee also distributes $20,000 of corpus to a beneficiary as permitted by the instrument. For the current year, the trust is:",
      ja: "信託証書は全所得の当期分配を要求し、慈善寄附の定めはない。当年、受託者は証書の許す範囲で元本$20,000も受益者に分配した。当年、この信託はどのように分類されるか。",
      c: ["A complex trust, with a $100 exemption", "A simple trust, with a $300 exemption", "A grantor trust", "A simple trust for income and a complex trust for corpus"],
      a: 0,
      ex: "単純信託の要件は、①全所得の当期分配義務、②慈善寄附なし、③元本の分配なし。元本を分配した年は複合信託として扱われ、人的控除は$100となる(単純信託は$300)。",
    },
    {
      q: "A simple trust has dividends of $20,000, taxable interest of $10,000, and a $8,000 capital gain allocated to corpus under the trust instrument. Trustee fees of $3,000 are charged to income and are fully deductible. All fiduciary accounting income is distributed. Assuming a $300 exemption, what is the trust's taxable income?",
      ja: "単純信託の所得は、配当$20,000、課税対象の利息$10,000、信託証書により元本に配分されるキャピタルゲイン$8,000である。受託者報酬$3,000は収益から支払われ、全額控除可能とする。受託者会計上の収益は全額分配された。人的控除$300とすると、信託の課税所得はいくらか。",
      c: ["$0", "$7,700", "$4,700", "$34,700"],
      a: 1,
      ex: "DNI = 20,000 + 10,000 − 3,000 = 27,000(元本に配分されるキャピタルゲインは除く)。分配控除27,000。課税所得 = 38,000 − 3,000 − 27,000 − 300 = 7,700(キャピタルゲインは信託段階で課税)。$0はキャピタルゲインも分配されたとみなした誤り。",
    },
    {
      q: "Which of the following best describes the role of distributable net income (DNI) in the taxation of trusts and estates?",
      ja: "信託・遺産財団の課税における分配可能純所得(DNI)の役割を最もよく表すものはどれか。",
      c: ["It is the amount on which the fiduciary pays tax after the distribution deduction", "It equals fiduciary accounting income in all cases", "It limits the distribution deduction and the amount taxable to beneficiaries, and determines the character of distributed income", "It is used only for grantor trusts"],
      a: 2,
      ex: "DNIは受託者の分配控除と受益者の課税額の上限となり、分配された所得の性質(非課税利息、適格配当等)を受益者に引き継がせる(導管理論)。会計上の収益とは一致しない場合があり、信託自体の課税所得でもない。",
    },
    {
      q: "Quinn creates a revocable living trust, retains the power to revoke it at any time, and names her children as remainder beneficiaries. The trust earns $25,000 of interest income this year, none of which is distributed. Who is taxed on the income?",
      ja: "Quinnは撤回可能なリビング・トラストを設定し、いつでも撤回できる権限を保持し、子どもたちを残余受益者に指定した。信託は当年$25,000の利息を得たが、分配はしていない。この所得は誰に課税されるか。",
      c: ["Quinn, because it is a grantor trust", "The trust, as a complex trust", "The children, as remainder beneficiaries", "No one until the income is distributed"],
      a: 0,
      ex: "撤回権を保持する信託はグランター・トラストであり、信託の所得は設定者(grantor)であるQuinnに直接課税される。分配の有無にかかわらず、信託や受益者には課税されない。",
    },
  ],
});

CPA.tbs({ id: "TBS-REG-31", section: "REG", chapter: "REG-05", title: "パートナーシップの設立と持分の取得価額(§721・§752)",
  scenario: `<p>On January 1, Avery, Blake, and Corin form ABC Partnership, each receiving a one-third interest in capital, profits, and losses. Contributions:</p>
<table><tr><th>Partner</th><th>Property contributed</th><th>Adjusted basis</th><th>FMV</th></tr>
<tr><td>Avery</td><td>Cash</td><td>$50,000</td><td>$50,000</td></tr>
<tr><td>Blake</td><td>Land, subject to a $30,000 recourse mortgage assumed by ABC</td><td>$30,000</td><td>$80,000</td></tr>
<tr><td>Corin</td><td>Equipment</td><td>$40,000</td><td>$50,000</td></tr></table>
<p>The mortgage is ABC's only liability and is shared equally by the partners. No partner provides services.</p>
<p class="ja">1月1日、Avery、Blake、CorinはABCパートナーシップを設立し、各自が資本・損益の3分の1の持分を取得した。Averyは現金$50,000、Blakeは$30,000のリコース抵当債務付きの土地(取得価額$30,000、FMV $80,000、債務はABCが引受け)、Corinは設備(取得価額$40,000、FMV $50,000)を拠出した。抵当債務はABC唯一の負債で、パートナーが均等に分担する。役務を提供するパートナーはいない。</p>`,
  rows: [
    { label: "Avery's initial basis in partnership interest(Averyの持分の当初取得価額)", type: "num", answer: 60000 },
    { label: "Blake's initial basis in partnership interest(Blakeの持分の当初取得価額)", type: "num", answer: 10000 },
    { label: "Gain recognized by Blake on the contribution(Blakeが拠出時に認識する利得)", type: "select", options: ["$0", "$10,000", "$20,000", "$50,000"], answer: "$0" },
    { label: "Corin's initial basis in partnership interest(Corinの持分の当初取得価額)", type: "num", answer: 50000 },
    { label: "ABC's basis in the land(ABCの土地の取得価額)", type: "num", answer: 30000 },
    { label: "ABC's basis in the equipment(ABCの設備の取得価額)", type: "num", answer: 40000 },
  ],
  explain: `<p>§721により拠出時の損益は認識せず、持分の取得価額は拠出資産の取得価額+パートナーシップ負債の分担額−他のパートナーに引き受けられた個人負債で計算する。負債30,000の分担額は各10,000。</p>
<p>Avery:50,000 + 10,000 = 60,000。Blake:30,000 − 30,000 + 10,000 = 10,000。負債の純減少20,000は取得価額30,000を超えないため利得は0。Corin:40,000 + 10,000 = 50,000。</p>
<p>パートナーシップは拠出者の取得価額を引き継ぐ(§723):土地30,000、設備40,000。FMVは資本勘定(帳簿)上の金額にすぎない。</p>`,
});

CPA.tbs({ id: "TBS-REG-32", section: "REG", chapter: "REG-05", title: "S法人株主の取得価額・分配・貸付金取得価額",
  scenario: `<p>Jordan owns 40% of the stock of Zenith Inc., a calendar-year S corporation that has never been a C corporation. At the beginning of the year, Jordan's stock basis is $18,000, and Jordan has a $5,000 loan outstanding to Zenith (debt basis $5,000). Zenith's results for the year:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Ordinary business income</td><td>$60,000</td></tr>
<tr><td>Tax-exempt interest income</td><td>$5,000</td></tr>
<tr><td>Net long-term capital gain</td><td>$10,000</td></tr>
<tr><td>Nondeductible expenses</td><td>$2,500</td></tr>
<tr><td>Section 179 expense</td><td>$7,500</td></tr>
<tr><td>Cash distributions to shareholders (pro rata)</td><td>$125,000</td></tr></table>
<p>Use the default basis ordering rules (no election). Assume Jordan can use the full §179 deduction at the shareholder level.</p>
<p class="ja">JordanはC法人であったことのない暦年S法人Zenith社の株式40%を保有する。期首の株式取得価額は$18,000で、Zenithへの貸付金$5,000(貸付金取得価額$5,000)がある。当年のZenithの数値:通常事業所得$60,000、非課税利息$5,000、純長期キャピタルゲイン$10,000、損金不算入費用$2,500、§179費用$7,500、株主への現金分配(持分比例)$125,000。デフォルトの順序規則による。Jordanは株主段階で§179控除を全額利用できるものとする。</p>`,
  rows: [
    { label: "Jordan's share of ordinary business income(Jordanの通常事業所得の持分)", type: "num", answer: 24000 },
    { label: "Stock basis immediately before the distribution(分配直前の株式取得価額)", type: "num", answer: 48000 },
    { label: "Gain Jordan recognizes on the distribution(分配によりJordanが認識する利得)", type: "num", answer: 2000 },
    { label: "Character of that gain(その利得の性質)", type: "select", options: ["Dividend income", "Capital gain", "Ordinary income", "Tax-exempt"], answer: "Capital gain" },
    { label: "Section 179 deduction Jordan may claim this year(Jordanが当年控除できる§179費用)", type: "num", answer: 3000 },
    { label: "Jordan's debt basis at year-end(期末の貸付金取得価額)", type: "num", answer: 1000 },
  ],
  explain: `<p>Jordanの持分(40%):通常事業所得24,000、非課税利息2,000、LTCG 4,000、損金不算入費用1,000、§179費用3,000、分配50,000。</p>
<p>①増加項目:18,000 + 24,000 + 2,000 + 4,000 = 48,000。②分配50,000 → 48,000まで非課税、超過2,000はキャピタルゲイン(E&PがないためDividendではない)。株式取得価額は0。分配は貸付金取得価額を減額しない。</p>
<p>③損金不算入費用1,000と④§179費用3,000は株式取得価額が0のため貸付金取得価額から減額:5,000 − 1,000 − 3,000 = 1,000。合計4,000が貸付金取得価額5,000以内なので§179費用3,000は全額控除可能。</p>`,
});

CPA.tbs({ id: "TBS-REG-33", section: "REG", chapter: "REG-05", title: "パートナーシップの通常事業所得・K-1・自営業所得",
  scenario: `<p>Lakeview Partners, a calendar-year general partnership, reports the following for the year:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Gross sales</td><td>$600,000</td></tr>
<tr><td>Cost of goods sold</td><td>$250,000</td></tr>
<tr><td>Salaries to employees</td><td>$90,000</td></tr>
<tr><td>Guaranteed payment to partner Morgan for services</td><td>$50,000</td></tr>
<tr><td>Rent expense</td><td>$30,000</td></tr>
<tr><td>MACRS depreciation</td><td>$20,000</td></tr>
<tr><td>Charitable contributions</td><td>$6,000</td></tr>
<tr><td>Taxable interest income</td><td>$4,000</td></tr>
<tr><td>Net long-term capital gain</td><td>$12,000</td></tr>
<tr><td>Net §1231 gain</td><td>$8,000</td></tr>
<tr><td>Tax-exempt interest income</td><td>$2,000</td></tr></table>
<p>Morgan is a general partner with a 40% interest in profits, losses, and capital. Morgan's beginning outside basis is $40,000, partnership liabilities did not change, and Morgan received a $20,000 cash distribution in addition to the guaranteed payment.</p>
<p class="ja">暦年のゼネラル・パートナーシップLakeview Partnersの当年の数値:総売上$600,000、売上原価$250,000、従業員給与$90,000、パートナーMorganへの役務に対する保証支払$50,000、支払賃借料$30,000、MACRS減価償却費$20,000、寄附金$6,000、課税対象の受取利息$4,000、純長期キャピタルゲイン$12,000、純§1231利得$8,000、非課税利息$2,000。Morganは損益・資本の40%を有するジェネラル・パートナーで、期首の持分取得価額は$40,000、パートナーシップ負債に変動はなく、保証支払とは別に$20,000の現金分配を受けた。</p>`,
  rows: [
    { label: "Lakeview's ordinary business income(Lakeviewの通常事業所得)", type: "num", answer: 160000 },
    { label: "Morgan's share of ordinary business income(Morganの通常事業所得の持分)", type: "num", answer: 64000 },
    { label: "Tax treatment of the guaranteed payment to Morgan(Morganへの保証支払の取扱い)", type: "select", options: ["Ordinary income to Morgan; deductible in computing ordinary business income", "Distribution that reduces Morgan's basis", "Separately stated deduction only", "Not taxable to Morgan"], answer: "Ordinary income to Morgan; deductible in computing ordinary business income" },
    { label: "Morgan's net earnings from self-employment before the 92.35% adjustment(Morganの自営業純所得・92.35%調整前)", type: "num", answer: 114000 },
    { label: "Morgan's ending outside basis(Morganの期末の持分取得価額)", type: "num", answer: 92000 },
  ],
  explain: `<p>通常事業所得 = 600,000 − 250,000 − 90,000 − 50,000 − 30,000 − 20,000 = 160,000。寄附金、利息、LTCG、§1231利得、非課税利息は個別記載項目。Morganの持分 = 160,000 × 40% = 64,000。</p>
<p>保証支払はパートナーシップの通常事業所得の計算上控除され、Morganは通常所得として計上する(分配ではないため取得価額は減らない)。</p>
<p>自営業純所得(ジェネラル・パートナー)= 64,000 + 50,000 = 114,000。利息・キャピタルゲイン・§1231利得は除外する。</p>
<p>期末取得価額 = 40,000 + 64,000 + 利息1,600 + LTCG 4,800 + §1231利得3,200 + 非課税利息800 − 寄附金2,400 − 現金分配20,000 = 92,000。</p>`,
});
