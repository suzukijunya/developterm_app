// TCP の追加問題(パートナーシップとS法人の税務計画)

CPA.extend("TCP-02", {
  mcq: [
    {
      q: "Kato performs consulting services for a newly formed partnership in exchange for a 20% capital interest that has a fair market value of $40,000. The other partners contribute property. How should Kato treat the receipt of the capital interest?",
      ja: "Katoは新設のパートナーシップにコンサルティング・サービスを提供し、その対価として公正価値$40,000の20%のキャピタル持分を受け取った。他のパートナーは財産を拠出した。Katoはこのキャピタル持分の受領をどのように扱うべきか。",
      c: [
        "No income is recognized under §721, and Kato's outside basis is $0",
        "Ordinary income of $40,000 is recognized, and Kato's outside basis is $40,000",
        "Capital gain of $40,000 is recognized, and Kato's outside basis is $40,000",
        "Income is deferred until Kato sells the interest, and outside basis is $0",
      ],
      a: 1,
      ex: "サービスは§721の「財産」に該当しないため、キャピタル持分の公正価値$40,000が通常所得(報酬)として課税され、課税済み金額がoutside basisとなる。§721の不認識は財産の拠出にのみ適用される。",
    },
    {
      q: "A and B form an equal general partnership. B contributes $100,000 cash. A contributes a building with an adjusted basis of $60,000 and a fair market value of $180,000, subject to an $80,000 recourse mortgage that the partnership assumes. The partners share economic risk of loss equally. What is B's outside basis immediately after formation?",
      ja: "AとBは持分均等のジェネラル・パートナーシップを設立した。Bは現金$100,000を拠出した。Aは調整後基準価額$60,000、公正価値$180,000の建物を拠出し、パートナーシップは建物に付された$80,000のリコース・モーゲージを引き受けた。パートナーは経済的損失リスクを均等に負担する。設立直後のBのoutside basisはいくらか。",
      c: ["$100,000", "$180,000", "$140,000", "$120,000"],
      a: 2,
      ex: "Bは現金$100,000に加え、引き受けたリコース負債の負担分(80,000 × 50% = 40,000)が基準価額に加算され$140,000となる。なおAは 60,000 − 80,000 + 40,000 = 20,000 で利得は生じない。",
    },
    {
      q: "Under §721(b), gain may be recognized on a contribution of property to a partnership when:",
      ja: "§721(b)のもとで、パートナーシップへの財産拠出について利得が認識される可能性があるのはどのような場合か。",
      c: [
        "The partnership would be treated as an investment company if it were incorporated and the transfer results in diversification of the transferor's interests",
        "The contributing partner receives less than an 80% interest in partnership capital",
        "The contributed property has a fair market value in excess of its adjusted basis",
        "The contributed property is subject to a nonrecourse liability of any amount",
      ],
      a: 0,
      ex: "§721(b)は、法人であれば投資会社に該当するパートナーシップへの拠出で、拠出者の投資が分散される場合に利得を認識させる。§351と異なり80%支配要件はなく、含み益があるだけでは課税されない。",
    },
    {
      q: "Mori contributes equipment (adjusted basis $30,000; fair market value $50,000) that she has held for four years to a partnership in exchange for a 25% interest. Which statement is correct?",
      ja: "Moriは4年間保有していた設備(調整後基準価額$30,000、公正価値$50,000)をパートナーシップに拠出し、25%の持分を取得した。正しい記述はどれか。",
      c: [
        "The partnership's basis in the equipment is $50,000 and its holding period begins on the contribution date",
        "Mori recognizes a $20,000 gain, and the partnership's basis in the equipment is $50,000",
        "The partnership's basis in the equipment is $30,000, but its holding period begins on the contribution date",
        "The partnership's basis in the equipment is $30,000, and the partnership's holding period includes Mori's four years",
      ],
      a: 3,
      ex: "§723によりパートナーシップの基準価額は拠出者の基準価額$30,000を引き継ぎ、保有期間も通算される(tacking)。§721により利得$20,000は認識されず、§704(c)の含み益としてMoriに配分される。",
    },
    {
      q: "At the beginning of the year, Ono's outside basis in a partnership was $50,000. For the year, Ono's distributive share included ordinary income of $20,000, tax-exempt interest of $2,000, a §179 deduction of $5,000, and nondeductible expenses of $1,000. Ono's share of partnership liabilities increased by $10,000, and Ono received a $15,000 cash distribution. What is Ono's outside basis at year-end?",
      ja: "期首におけるOnoのパートナーシップ持分のoutside basisは$50,000であった。当期のOnoの分配割当額は、通常所得$20,000、非課税利息$2,000、§179控除$5,000、損金不算入費用$1,000であった。Onoの負債負担分は$10,000増加し、Onoは現金$15,000の分配を受けた。期末のoutside basisはいくらか。",
      c: ["$61,000", "$59,000", "$51,000", "$66,000"],
      a: 0,
      ex: "50,000 + 20,000 + 2,000(非課税所得も加算)+ 10,000(負債増加はみなし拠出)− 15,000 − 1,000 − 5,000 = 61,000。非課税利息を加算し忘れると$59,000、負債増加を漏らすと$51,000となる。",
    },
    {
      q: "Before considering current-year items, Hara's outside basis is $20,000. For the year, Hara's share of the partnership's ordinary loss is $35,000, and Hara receives an $8,000 cash distribution. Hara has sufficient amounts at risk and materially participates. How much of the loss may Hara deduct, and how much is carried forward?",
      ja: "当期項目を考慮する前のHaraのoutside basisは$20,000である。当期のパートナーシップの通常損失のうちHaraの負担分は$35,000であり、Haraは現金$8,000の分配を受けた。Haraの危険負担額は十分であり、実質的に関与している。Haraが控除できる損失と繰り越される損失はいくらか。",
      c: [
        "Deduct $20,000; carry forward $15,000",
        "Deduct $35,000; carry forward $0",
        "Deduct $12,000; carry forward $23,000",
        "Deduct $12,000; recognize $8,000 gain on the distribution",
      ],
      a: 2,
      ex: "基準価額の減算は分配が損失より先である。20,000 − 8,000 = 12,000 が損失控除の上限となり、残り23,000は基準価額不足として無期限に繰り越される。分配を損失の後に処理すると$20,000控除・分配益$8,000と誤る。",
    },
    {
      q: "Sato inherited a partnership interest when its fair market value (net equity) was $300,000. At the date of death, the decedent's share of partnership liabilities was $50,000. The partnership has not made a §754 election and does not have a substantial built-in loss. What is Sato's initial outside basis?",
      ja: "Satoは公正価値(純資産持分)$300,000のパートナーシップ持分を相続した。死亡日における被相続人の負債負担分は$50,000であった。パートナーシップは§754選択を行っておらず、重要な含み損も有していない。Satoの当初のoutside basisはいくらか。",
      c: ["$300,000", "$350,000", "$250,000", "The decedent's outside basis carried over"],
      a: 1,
      ex: "相続による持分のoutside basisは死亡日の公正価値$300,000に負債負担分$50,000を加えた$350,000となる。§754選択がないため、inside basisは調整されず両者に差異が残る点に注意する。",
    },
    {
      q: "Under the §704(b) regulations, an allocation has economic effect under the general test only if the partnership agreement provides for all of the following EXCEPT:",
      ja: "§704(b)規則上、一般テストのもとで配分が経済的効果を有するためにパートナーシップ契約に定める必要がないものはどれか。",
      c: [
        "Maintenance of partner capital accounts in accordance with the regulations",
        "Liquidating distributions made in accordance with positive capital account balances",
        "An unconditional obligation to restore a deficit capital account balance upon liquidation",
        "Allocation of all items of income and loss in proportion to capital contributions",
      ],
      a: 3,
      ex: "経済的効果の一般テストは①規則に従った資本勘定の維持、②清算時の正の資本勘定に従った分配、③欠損補填義務(またはQIO)の3要件である。拠出比率どおりの配分は不要であり、特別配分自体が認められる。",
    },
    {
      q: "A partnership agreement allocates 90% of depreciation to partner X, although X shares all other items 50%. If the IRS determines that the special allocation lacks substantial economic effect, the depreciation will be allocated:",
      ja: "パートナーシップ契約は、他の項目はすべて50%ずつで共有しているが、減価償却費の90%をパートナーXに配分している。IRSがこの特別配分は実質的経済効果を欠くと判断した場合、減価償却費はどのように配分されるか。",
      c: [
        "100% to the partner who contributed the depreciable property",
        "In accordance with the partners' interests in the partnership",
        "Equally per capita, regardless of the partnership agreement",
        "To the partnership itself, which deducts it at the entity level",
      ],
      a: 1,
      ex: "実質的経済効果を欠く配分は否認され、パートナーのパートナーシップに対する持分(経済的取決め全体)に従って再配分される。本問ではその他の項目の比率である50%ずつが基準となる可能性が高い。",
    },
    {
      q: "A contributes land (basis $40,000; FMV $100,000) and B contributes $100,000 cash to an equal partnership that uses the traditional §704(c) method. Two years later, the partnership sells the land for $80,000. How much taxable gain is allocated to A?",
      ja: "Aは土地(基準価額$40,000、公正価値$100,000)を、Bは現金$100,000を拠出して持分均等のパートナーシップを設立した。パートナーシップは§704(c)の伝統的方法を採用している。2年後、パートナーシップは土地を$80,000で売却した。Aに配分される課税上の利得はいくらか。",
      c: ["$20,000", "$30,000", "$50,000", "$40,000"],
      a: 3,
      ex: "税務上の利得は 80,000 − 40,000 = 40,000、簿価上は100,000に対して20,000の損失。Bには簿価損失10,000に見合う税務上の損失を配分すべきだが、シーリング・ルールにより税務上の損失は存在しないため、税務上の利得$40,000は全額Aに配分される。",
    },
    {
      q: "Four years ago, A contributed land (basis $30,000; FMV $70,000) to a partnership. This year, when the land's FMV is $90,000, the partnership distributes the land to partner B. How much gain does A recognize as a result of the distribution?",
      ja: "4年前、Aは土地(基準価額$30,000、公正価値$70,000)をパートナーシップに拠出した。当期、土地の公正価値が$90,000のときに、パートナーシップは土地をパートナーBに分配した。この分配によりAが認識する利得はいくらか。",
      c: ["$0", "$40,000", "$60,000", "$20,000"],
      a: 1,
      ex: "拠出後7年以内に§704(c)財産が他のパートナーに分配されると、拠出パートナーは拠出時の含み益(70,000 − 30,000 = 40,000)を認識する(§704(c)(1)(B)、ミキシング・ボウル)。拠出後の値上がり20,000は対象外である。",
    },
    {
      q: "Three years ago, A contributed land with a basis of $20,000 and a FMV of $50,000 to a partnership. The land is still held by the partnership. This year, the partnership distributes to A other property (not the land) with a FMV of $45,000 and an inside basis of $25,000. A's outside basis immediately before the distribution is $20,000. How much gain does A recognize under §737?",
      ja: "3年前、Aは基準価額$20,000、公正価値$50,000の土地をパートナーシップに拠出し、土地は現在もパートナーシップが保有している。当期、パートナーシップはAに土地以外の財産(公正価値$45,000、inside basis $25,000)を分配した。分配直前のAのoutside basisは$20,000である。§737によりAが認識する利得はいくらか。",
      c: ["$25,000", "$30,000", "$20,000", "$0"],
      a: 0,
      ex: "§737の利得は、①分配財産の公正価値がoutside basisを超える額(45,000 − 20,000 = 25,000)と②純拠出前利得(30,000)のいずれか少ない額であり$25,000となる。②だけで判断すると$30,000と誤る。",
    },
    {
      q: "A general partnership borrows $100,000 on a recourse basis. Partner A shares profits 50% and losses 60%; partner B shares profits 50% and losses 40%. Under §752, how much of the liability is allocated to A?",
      ja: "ジェネラル・パートナーシップがリコース・ベースで$100,000を借り入れた。パートナーAは利益の50%、損失の60%を負担し、パートナーBは利益の50%、損失の40%を負担する。§752のもとでAに配分される負債はいくらか。",
      c: ["$50,000", "$100,000", "$60,000", "$40,000"],
      a: 2,
      ex: "リコース負債は経済的損失リスク(みなし清算テスト)を負うパートナーに配分され、通常は損失負担割合に従う。100,000 × 60% = 60,000。利益配分割合を使うのはノンリコース負債である。",
    },
    {
      q: "An LLC taxed as a partnership borrows $200,000 on a nonrecourse basis to acquire equipment. No member guarantees the debt, there is no partnership minimum gain, and no §704(c) property is involved. Member C shares profits 30% and losses 40%. How much of the liability is included in C's outside basis?",
      ja: "パートナーシップとして課税されるLLCが設備取得のためノンリコースで$200,000を借り入れた。保証するメンバーはおらず、パートナーシップ・ミニマム・ゲインも§704(c)財産もない。メンバーCは利益の30%、損失の40%を負担する。Cのoutside basisに含まれる負債額はいくらか。",
      c: ["$80,000", "$60,000", "$0", "$100,000"],
      a: 1,
      ex: "ノンリコース負債は(ミニマム・ゲインと§704(c)の段階を除き)利益配分割合に従って配分される。200,000 × 30% = 60,000。損失割合を用いる$80,000はリコース負債の考え方である。",
    },
    {
      q: "Ueda's outside basis is $15,000, which includes a $40,000 share of partnership recourse liabilities. During the year, the partnership repays debt, reducing Ueda's share of liabilities by $25,000. There are no other items. What is the tax consequence to Ueda?",
      ja: "Uedaのoutside basisは$15,000で、これにはパートナーシップのリコース負債の負担分$40,000が含まれている。当期、パートナーシップが負債を返済し、Uedaの負債負担分が$25,000減少した。他の項目はない。Uedaへの課税上の影響はどうなるか。",
      c: [
        "No gain; outside basis is reduced to $0 and the $10,000 excess is suspended",
        "$25,000 ordinary income from cancellation of debt",
        "$10,000 gain and an outside basis of $0",
        "No gain; outside basis becomes negative $10,000",
      ],
      a: 2,
      ex: "負債負担分の減少は現金のみなし分配(§752(b))であり、outside basisを超える部分(25,000 − 15,000 = 10,000)は利得として認識され、基準価額は0となる。基準価額はマイナスにならない。",
    },
    {
      q: "Ruiz, a general partner with a 40% interest in profits and losses, receives a $60,000 guaranteed payment for services. The partnership's ordinary income before the guaranteed payment is $150,000. What amount of net earnings from self-employment does Ruiz have from the partnership?",
      ja: "利益・損失の40%を有するジェネラル・パートナーのRuizは、役務に対して$60,000の保証支払を受けた。保証支払控除前のパートナーシップの通常所得は$150,000である。Ruizのパートナーシップからの自営業純所得はいくらか。",
      c: ["$60,000", "$120,000", "$84,000", "$96,000"],
      a: 3,
      ex: "保証支払控除後の通常所得は 150,000 − 60,000 = 90,000、Ruizの持分は 90,000 × 40% = 36,000。ジェネラル・パートナーは保証支払と分配割当額の双方が自営業所得となり 60,000 + 36,000 = 96,000。保証支払を控除せずに40%を掛けると$120,000と誤る。",
    },
    {
      q: "A partnership has ordinary income of $30,000 before considering a $50,000 guaranteed payment to partner Ito, who has a 50% interest in profits and losses. Ito has sufficient basis. What is the net effect on Ito's taxable income from the partnership?",
      ja: "パートナーシップの通常所得は、利益・損失の50%を有するパートナーItoへの$50,000の保証支払を考慮する前で$30,000である。Itoの基準価額は十分にある。パートナーシップからItoの課税所得への純影響額はいくらか。",
      c: ["$40,000", "$50,000", "$15,000", "$65,000"],
      a: 0,
      ex: "保証支払は分配可能な利益の有無にかかわらず控除され、パートナーシップは 30,000 − 50,000 = 20,000 の損失となる。Itoは保証支払50,000を所得計上し、損失の50%(10,000)を控除するため純額40,000。保証支払を利益からの分配と扱うと$15,000と誤る。",
    },
    {
      q: "Lane is a limited partner (not a general partner) in a state-law limited partnership. During the year, Lane received a $20,000 guaranteed payment for services actually rendered to the partnership and was allocated a $15,000 distributive share of ordinary business income. What amount is subject to self-employment tax?",
      ja: "Laneは州法上のリミテッド・パートナーシップのリミテッド・パートナー(ジェネラル・パートナーではない)である。当期、Laneはパートナーシップに実際に提供した役務に対して$20,000の保証支払を受け、通常事業所得$15,000の分配割当額を受けた。自営業税の対象となる金額はいくらか。",
      c: ["$0", "$35,000", "$20,000", "$15,000"],
      a: 2,
      ex: "リミテッド・パートナーの分配割当額は自営業所得から除外されるが、役務の対価として受ける保証支払は自営業所得に含まれる。したがって$20,000のみが対象となる。",
    },
    {
      q: "Kim is an individual partner who invested $30,000 cash in an equipment-leasing partnership. Kim's outside basis is $50,000, which includes a $20,000 share of a nonrecourse loan from an unrelated bank (not qualified nonrecourse financing). Kim materially participates. Kim's share of the partnership's loss is $45,000. How much of the loss may Kim deduct this year?",
      ja: "個人パートナーのKimは設備リース業のパートナーシップに現金$30,000を出資した。Kimのoutside basisは$50,000で、これには無関係の銀行からのノンリコース借入(適格ノンリコース融資ではない)の負担分$20,000が含まれる。Kimは実質的に関与している。パートナーシップの損失のKim負担分は$45,000である。Kimが当期に控除できる損失はいくらか。",
      c: ["$45,000", "$30,000", "$50,000", "$25,000"],
      a: 1,
      ex: "基準価額テスト(50,000)は通過するが、危険負担額(at-risk)には適格でないノンリコース負債を含まないため30,000が上限となる。残り15,000は§465により繰り越される。基準価額だけで判断すると$45,000と誤る。",
    },
    {
      q: "Wong, a limited partner, has an outside basis and amount at risk of $30,000 before any current-year loss. Wong's share of the partnership's ordinary loss is $25,000. Wong's only other passive activity generated $10,000 of passive income, and Wong has no prior suspended losses. Which statement is correct?",
      ja: "リミテッド・パートナーのWongは、当期損失考慮前のoutside basisと危険負担額がともに$30,000である。パートナーシップの通常損失のWong負担分は$25,000である。Wongの他の受動的活動は$10,000の受動的所得を生じており、過年度の停止損失はない。正しい記述はどれか。",
      c: [
        "Wong deducts $25,000, and outside basis becomes $5,000",
        "Wong deducts $10,000, and outside basis remains $20,000",
        "Wong deducts $10,000, suspends $15,000 under the passive activity rules, and outside basis becomes $5,000",
        "Wong deducts $0 because limited partners cannot deduct passive losses",
      ],
      a: 2,
      ex: "損失制限は基準価額→危険負担額→受動的活動→超過事業損失の順に適用する。基準価額・at-riskは通過するため基準価額は25,000減って$5,000となり、受動的損失は受動的所得10,000の範囲で控除、15,000は停止損失となる。",
    },
    {
      q: "After applying the basis, at-risk, and passive activity limitations, Diaz, a single taxpayer, has a net loss of $400,000 from active partnership businesses. Diaz also has $500,000 of wages and investment income. Assume the excess business loss threshold for the year is $256,000. How is the loss treated?",
      ja: "単身申告者のDiazは、基準価額・危険負担額・受動的活動の各制限を適用した後、能動的なパートナーシップ事業から$400,000の純損失を有する。Diazには給与および投資所得が$500,000ある。当年の超過事業損失の閾値は$256,000と仮定する。この損失はどのように扱われるか。",
      c: [
        "$256,000 is deductible currently, and $144,000 is carried forward as part of an NOL",
        "The full $400,000 is deductible currently against wages and investment income",
        "$144,000 is deductible currently, and $256,000 is carried forward",
        "$256,000 is deductible currently, and $144,000 is permanently disallowed",
      ],
      a: 0,
      ex: "超過事業損失の制限(§461(l))は受動的活動制限の後に適用され、閾値256,000を超える144,000は当期控除できず、翌年以降NOLとして繰り越される。永久に否認されるわけではない。",
    },
    {
      q: "Chen's outside basis is $25,000. In a nonliquidating distribution, Chen receives $28,000 cash and inventory with an inside basis of $6,000 and a fair market value of $9,000. What gain does Chen recognize, and what is Chen's basis in the inventory?",
      ja: "Chenのoutside basisは$25,000である。非清算分配により、Chenは現金$28,000と棚卸資産(inside basis $6,000、公正価値$9,000)を受け取った。Chenが認識する利得と棚卸資産の基準価額はいくらか。",
      c: [
        "Gain $0; inventory basis $0",
        "Gain $3,000; inventory basis $6,000",
        "Gain $12,000; inventory basis $9,000",
        "Gain $3,000; inventory basis $0",
      ],
      a: 3,
      ex: "現金が先にoutside basisを減額し、28,000 − 25,000 = 3,000 の超過額は利得となる。基準価額が0になるため、財産(棚卸資産)の基準価額は0となる。財産分配で利得は生じない。",
    },
    {
      q: "Fox's outside basis is $30,000. In a nonliquidating distribution, Fox receives $5,000 cash, inventory (inside basis $10,000; FMV $14,000), and equipment (inside basis $20,000; FMV $25,000). What is Fox's basis in the equipment?",
      ja: "Foxのoutside basisは$30,000である。非清算分配により、Foxは現金$5,000、棚卸資産(inside basis $10,000、公正価値$14,000)および設備(inside basis $20,000、公正価値$25,000)を受け取った。Foxの設備の基準価額はいくらか。",
      c: ["$15,000", "$20,000", "$25,000", "$10,000"],
      a: 0,
      ex: "順序は現金→未実現債権・棚卸資産→その他財産。30,000 − 5,000 = 25,000、棚卸資産は引継ぎ10,000、残り15,000が設備の基準価額となる(非清算分配では引継価額が上限)。",
    },
    {
      q: "Under §731(c), how is a distribution of marketable securities by a partnership to a partner generally treated?",
      ja: "§731(c)のもとで、パートナーシップからパートナーへの市場性有価証券の分配は一般にどのように扱われるか。",
      c: [
        "As a property distribution taking a carryover basis, with no gain recognized",
        "As a sale of the securities by the partnership at fair market value",
        "As a distribution of money equal to the securities' fair market value, reduced by the partner's share of the partnership's net appreciation in such securities",
        "As a guaranteed payment taxable as ordinary income",
      ],
      a: 2,
      ex: "市場性有価証券の分配は、原則として公正価値相当の金銭の分配とみなされ(パートナーの持分に帰属する含み益の分だけ減額)、outside basisを超えると利得が生じる。通常の財産分配と異なる点が論点である。",
    },
    {
      q: "In complete liquidation of her interest, Park (outside basis $70,000) receives $10,000 cash, Land A (inside basis $20,000; FMV $30,000), and Land B (inside basis $10,000; FMV $50,000). Neither parcel is a hot asset, and there is no §754 election. What is Park's basis in Land B?",
      ja: "持分の完全清算として、Park(outside basis $70,000)は現金$10,000、土地A(inside basis $20,000、公正価値$30,000)、土地B(inside basis $10,000、公正価値$50,000)を受け取った。いずれもホット資産ではなく、§754選択はない。Parkの土地Bの基準価額はいくらか。",
      c: ["$40,000", "$30,000", "$34,000", "$50,000"],
      a: 2,
      ex: "現金控除後の配分額60,000。まず引継価額(20,000、10,000)を付し、増額30,000は含み益の範囲で含み益比(10,000:40,000)により配分する。土地Bは 10,000 + 30,000 × 40/50 = 34,000(土地Aは26,000)。公正価値比で配分すると$37,500となり誤り。",
    },
    {
      q: "In complete liquidation of his interest, Gray (outside basis $40,000) receives $15,000 cash and inventory with an inside basis of $10,000 and a FMV of $18,000. What does Gray recognize?",
      ja: "持分の完全清算として、Gray(outside basis $40,000)は現金$15,000と棚卸資産(inside basis $10,000、公正価値$18,000)を受け取った。Grayは何を認識するか。",
      c: [
        "No loss; inventory basis is $25,000",
        "A $15,000 capital loss; inventory basis is $10,000",
        "A $7,000 capital loss; inventory basis is $18,000",
        "A $15,000 ordinary loss; inventory basis is $10,000",
      ],
      a: 1,
      ex: "清算分配で現金・未実現債権・棚卸資産のみを受け取る場合、棚卸資産は引継価額10,000を超えて増額できず、残額 40,000 − 15,000 − 10,000 = 15,000 は資本損失となる。棚卸資産の基準価額を増額する$25,000は誤り。",
    },
    {
      q: "In complete liquidation of her interest, Nash (outside basis $29,000) receives $5,000 cash, Equipment A (inside basis $22,000; FMV $20,000), and Equipment B (inside basis $14,000; FMV $10,000). Neither item has depreciation recapture. What is Nash's basis in Equipment A?",
      ja: "持分の完全清算として、Nash(outside basis $29,000)は現金$5,000、設備A(inside basis $22,000、公正価値$20,000)、設備B(inside basis $14,000、公正価値$10,000)を受け取った。いずれも減価償却の取戻しはない。Nashの設備Aの基準価額はいくらか。",
      c: ["$22,000", "$16,000", "$20,000", "$14,667"],
      a: 1,
      ex: "配分額24,000に対し引継価額合計36,000で減額12,000。まず含み損(A 2,000、B 4,000)の範囲で減額し20,000と10,000に、残り6,000は調整後基準価額比(2:1)で減額する。設備Aは 20,000 − 4,000 = 16,000、設備Bは8,000。",
    },
    {
      q: "Reed sells her one-third partnership interest for $100,000 cash. Her outside basis (including her $20,000 share of partnership liabilities, which the buyer assumes) is $70,000. Her share of partnership unrealized receivables is basis $0 and FMV $15,000, and her share of inventory is basis $9,000 and FMV $12,000. What are the character and amount of Reed's gain?",
      ja: "Reedは1/3のパートナーシップ持分を現金$100,000で売却した。outside basisは$70,000で、買手が引き受ける負債負担分$20,000を含む。Reedの持分に対応する未実現債権は基準価額$0・公正価値$15,000、棚卸資産は基準価額$9,000・公正価値$12,000である。Reedの利得の性質と金額はどうなるか。",
      c: [
        "Ordinary $18,000; capital $12,000",
        "Ordinary $15,000; capital $35,000",
        "Capital $50,000",
        "Ordinary $18,000; capital $32,000",
      ],
      a: 3,
      ex: "実現額は 100,000 + 20,000(負債の肩代わり)= 120,000、利得は 120,000 − 70,000 = 50,000。§751資産部分(15,000 + 3,000 = 18,000)が通常所得、残り32,000が資本利得。負債を実現額に含めないと総利得30,000と誤る。",
    },
    {
      q: "For purposes of §751, which statement about hot assets is correct?",
      ja: "§751におけるホット資産に関する記述のうち正しいものはどれか。",
      c: [
        "Inventory is a hot asset in a sale of a partnership interest only if it is substantially appreciated",
        "Unrealized receivables exclude §1245 depreciation recapture inherent in partnership equipment",
        "In a sale of a partnership interest, all inventory items are hot assets, but for disproportionate distributions under §751(b) inventory must be substantially appreciated",
        "Hot assets are taxed as capital gain to the selling partner",
      ],
      a: 2,
      ex: "持分売却(§751(a))ではすべての棚卸資産がホット資産となり、著しく値上がりした棚卸資産(FMVが基準価額の120%超)の要件は不均衡分配(§751(b))にのみ適用される。§1245の取戻し部分は未実現債権に含まれる。",
    },
    {
      q: "Bell sells his partnership interest for $60,000 cash. His outside basis is $35,000. The partnership's only ordinary-income item is equipment on which Bell's share of potential §1245 depreciation recapture is $8,000. The partnership has no inventory or receivables. How much of Bell's gain is ordinary income?",
      ja: "Bellはパートナーシップ持分を現金$60,000で売却した。outside basisは$35,000である。パートナーシップの通常所得項目は設備のみで、Bellの持分に対応する§1245減価償却取戻し見込額は$8,000である。棚卸資産や売掛金はない。Bellの利得のうち通常所得となる金額はいくらか。",
      c: ["$0", "$25,000", "$8,000", "$17,000"],
      a: 2,
      ex: "§1245の取戻し部分は§751上の未実現債権として扱われるため、総利得25,000のうち8,000が通常所得、残り17,000が資本利得となる。棚卸資産・売掛金がなければ全額資本利得とする$0は誤り。",
    },
    {
      q: "A partnership distributes cash to partner Q in exchange for part of Q's interest in the partnership's inventory, so that Q receives more than Q's proportionate share of cash (a cold asset) and gives up part of Q's share of substantially appreciated inventory. Under §751(b), the transaction is treated as:",
      ja: "パートナーシップがパートナーQに現金を分配し、その結果Qは自己の持分比率を超える現金(コールド資産)を受け取り、著しく値上がりした棚卸資産に対する持分の一部を手放すことになった。§751(b)のもとで、この取引はどのように扱われるか。",
      c: [
        "A nontaxable distribution in which Q reduces outside basis by the cash received",
        "A taxable exchange in which Q is treated as selling part of Q's share of the inventory to the partnership, producing ordinary income",
        "A guaranteed payment to Q taxable as ordinary income in full",
        "A capital gain transaction to the partnership only",
      ],
      a: 1,
      ex: "§751(b)は不均衡分配(ホット資産とコールド資産の持分の入替え)を課税交換として扱う。ホット資産を手放したQは、その持分をパートナーシップに売却したとみなされ通常所得を認識する。単純な非課税分配として扱うのは誤り。",
    },
    {
      q: "Lopez buys a 30% partnership interest for $150,000 cash. At the time, the partnership has assets with an aggregate adjusted basis of $400,000 and liabilities of $100,000, which are shared according to the 30% interest. The partnership has a §754 election in effect. What is the amount of Lopez's §743(b) basis adjustment?",
      ja: "Lopezは30%のパートナーシップ持分を現金$150,000で購入した。その時点でパートナーシップの資産の調整後基準価額合計は$400,000、負債は$100,000であり、負債は30%の持分に従って負担される。パートナーシップは§754選択を行っている。Lopezの§743(b)基準価額調整額はいくらか。",
      c: ["$30,000", "$60,000", "$0", "$90,000"],
      a: 1,
      ex: "Lopezのoutside basisは 150,000 + 30,000(負債負担分)= 180,000、inside basisの持分は 400,000 × 30% = 120,000。差額60,000がLopezのみに帰属する§743(b)調整となる。負債を加算しないと$30,000と誤る。",
    },
    {
      q: "A partnership has NOT made a §754 election. A partner sells her interest to a buyer at a time when the partnership's adjusted basis in its property exceeds the property's fair market value by $300,000. Which statement is correct?",
      ja: "パートナーシップは§754選択を行っていない。パートナーシップ財産の調整後基準価額が公正価値を$300,000上回っている時点で、あるパートナーが持分を買手に売却した。正しい記述はどれか。",
      c: [
        "No basis adjustment is made because the partnership has no §754 election",
        "The partnership must make a downward basis adjustment under §734(b)",
        "The selling partner's loss is disallowed under §751",
        "A mandatory downward §743(b) adjustment applies to the buyer because the partnership has a substantial built-in loss",
      ],
      a: 3,
      ex: "パートナーシップ財産の含み損が$250,000を超える(重要な含み損)場合、§754選択の有無にかかわらず譲受人について§743(b)の減額調整が強制される。含み損の重複控除を防ぐための規定である。",
    },
    {
      q: "A partnership with a §754 election in effect distributes $50,000 cash to partner Tan in complete liquidation of his interest. Tan's outside basis is $40,000, and there are no hot assets. What is the effect on the partnership's basis in its remaining property?",
      ja: "§754選択を行っているパートナーシップが、パートナーTanの持分の完全清算として現金$50,000を分配した。Tanのoutside basisは$40,000であり、ホット資産はない。パートナーシップの残存財産の基準価額への影響はどうなるか。",
      c: [
        "Increase of $10,000 under §734(b)",
        "Decrease of $10,000 under §734(b)",
        "No adjustment because only cash was distributed",
        "Increase of $50,000 under §743(b)",
      ],
      a: 0,
      ex: "Tanは 50,000 − 40,000 = 10,000 の利得を認識するため、§734(b)によりパートナーシップは残存財産の基準価額を同額増額する。§743(b)は持分の譲渡の場合の調整である。",
    },
    {
      q: "In complete liquidation of his interest, Ross (outside basis $20,000) receives land with an inside basis of $30,000. The partnership has a §754 election in effect. What are Ross's basis in the land and the partnership's §734(b) adjustment?",
      ja: "持分の完全清算として、Ross(outside basis $20,000)はinside basis $30,000の土地を受け取った。パートナーシップは§754選択を行っている。Rossの土地の基準価額とパートナーシップの§734(b)調整額はいくらか。",
      c: [
        "Land $30,000; partnership decreases remaining property basis by $10,000",
        "Land $20,000; no partnership adjustment",
        "Land $20,000; partnership increases remaining property basis by $10,000",
        "Land $30,000; Ross recognizes a $10,000 gain",
      ],
      a: 2,
      ex: "清算分配ではoutside basisが分配財産の基準価額となり土地は20,000。分配財産の基準価額が10,000減少したため、§754選択下では残存財産の基準価額を10,000増額して総基準価額を維持する。",
    },
    {
      q: "Evans sells her partnership interest to a buyer who pays $50,000 cash and assumes Evans's $30,000 share of partnership liabilities. Evans's outside basis, which includes the liability share, is $45,000. The partnership has no hot assets. What gain does Evans recognize?",
      ja: "Evansはパートナーシップ持分を売却し、買手は現金$50,000を支払うとともにEvansの負債負担分$30,000を引き受けた。負債負担分を含むEvansのoutside basisは$45,000である。パートナーシップにホット資産はない。Evansが認識する利得はいくらか。",
      c: ["$5,000", "$35,000", "$80,000", "$15,000"],
      a: 1,
      ex: "実現額は現金50,000に負債の免除30,000を加えた80,000で、利得は 80,000 − 45,000 = 35,000(資本利得)。負債を実現額に含めないと$5,000と誤る。",
    },
    {
      q: "During the current year, partners holding 60% of the capital and profits interests of a calendar-year partnership sell their interests to new investors, and the business continues. Under current law, what is the effect on the partnership?",
      ja: "当期中に、暦年のパートナーシップの資本・利益持分の60%を有するパートナーが持分を新しい投資家に売却し、事業は継続している。現行法上、パートナーシップへの影響はどうなるか。",
      c: [
        "The partnership terminates because 50% or more of its interests were sold within 12 months",
        "The partnership must file a short-year return and adopt a new tax year",
        "The partnership must obtain a new EIN and restart depreciation on its assets",
        "The partnership does not terminate; technical terminations were repealed, so it continues as long as any partner carries on the business in partnership form",
      ],
      a: 3,
      ex: "2017年TCJAにより2018年以降のテクニカル・ターミネーション(12か月以内の50%以上の持分売却による終了)は廃止された。パートナーシップは、事業の一部がパートナーシップ形態で継続されない場合にのみ終了する。",
    },
    {
      q: "A partnership has three partners: A (40% interest; fiscal year ending June 30), B (35%; calendar year), and C (25%; calendar year). Absent a business-purpose or §444 election, what tax year must the partnership use?",
      ja: "パートナーシップには3人のパートナー、A(持分40%、6月30日決算)、B(35%、暦年)、C(25%、暦年)がいる。事業目的または§444選択がない場合、パートナーシップはどの課税年度を採用しなければならないか。",
      c: [
        "The calendar year, because partners owning more than 50% use the calendar year",
        "A fiscal year ending June 30, because A is the largest partner",
        "The year resulting in the least aggregate deferral, computed for all three partners",
        "Any year the partnership chooses on its first return",
      ],
      a: 0,
      ex: "第1順位は過半数持分課税年度(合計50%超の持分を有するパートナーの共通の年度)であり、BとCで60%となるため暦年を採用する。最大パートナー個人の年度や最小累積繰延テストはこれに劣後する。",
    },
    {
      q: "A partnership has two equal partners. Partner X has a fiscal year ending June 30, and partner Y has a fiscal year ending September 30. There is no majority interest tax year and no common year among principal partners. Under the least aggregate deferral test, which year-end must the partnership use?",
      ja: "パートナーシップには持分均等の2人のパートナーがいる。Xは6月30日決算、Yは9月30日決算である。過半数持分課税年度も主要パートナー共通の年度もない。最小累積繰延テストのもとで、パートナーシップはどの決算日を採用しなければならないか。",
      c: ["September 30", "December 31", "June 30", "Either June 30 or September 30, at the partnership's option"],
      a: 2,
      ex: "6月30日を試すと、Yの繰延3か月 × 50% = 1.5、9月30日を試すと、Xの繰延9か月 × 50% = 4.5。累積繰延が最小となる6月30日を採用する。",
    },
    {
      q: "Under the centralized partnership audit regime enacted by the Bipartisan Budget Act of 2015 (BBA), which partnership is eligible to elect out of the regime for a tax year?",
      ja: "2015年超党派予算法(BBA)による集中型パートナーシップ監査制度のもとで、当該課税年度に同制度の適用除外を選択できるパートナーシップはどれか。",
      c: [
        "A partnership with 80 partners, one of which is another partnership",
        "A partnership with 50 partners, all of whom are individuals or C corporations, that makes the election on a timely filed return",
        "A partnership with 150 individual partners",
        "A partnership with 10 partners, one of which is a grantor trust",
      ],
      a: 1,
      ex: "適用除外は、K-1が100枚以下で、全パートナーが個人・C法人・S法人・外国法人・遺産財団等の適格パートナーである場合に、期限内申告書で選択できる。パートナーシップや信託(グランター・トラストを含む)がパートナーにいると選択できない。",
    },
    {
      q: "Under the BBA centralized partnership audit regime, which statement is correct?",
      ja: "BBAの集中型パートナーシップ監査制度に関する記述のうち正しいものはどれか。",
      c: [
        "Adjustments are assessed against the partners who were partners in the reviewed year, with no partnership-level tax",
        "Each partner may separately designate its own representative to deal with the IRS",
        "An imputed underpayment is generally assessed and collected at the partnership level in the adjustment year, unless the partnership makes a push-out election",
        "The imputed underpayment is computed at the lowest individual income tax rate",
      ],
      a: 2,
      ex: "BBA制度では、調整は原則としてパートナーシップ段階で調整年度に最高税率を用いたimputed underpaymentとして課される。プッシュアウト選択を行えば審査年度のパートナーに転嫁できる。IRSとの窓口は単一のパートナーシップ代表者である。",
    },
    {
      q: "An S corporation currently has 70 shareholders. Which of the following proposed transfers of stock would terminate its S election?",
      ja: "あるS法人には現在70人の株主がいる。次の株式譲渡案のうち、S選択を終了させるものはどれか。",
      c: [
        "A sale of shares to a nonresident alien individual",
        "A transfer of shares to an electing small business trust (ESBT)",
        "A gift of shares to a §501(c)(3) charitable organization",
        "A transfer of shares to the estate of a deceased shareholder",
      ],
      a: 0,
      ex: "非居住外国人はS法人の適格株主ではなく、譲渡日にS選択が終了する。ESBT、§501(c)(3)団体、遺産財団はいずれも適格株主である。なお家族は1人の株主として数えられ、100人基準の判定に用いる。",
    },
    {
      q: "An S corporation has two classes of common stock that are identical in all respects except that Class B shares have no voting rights. Its governing provisions give all shares identical rights to distribution and liquidation proceeds. Which statement is correct?",
      ja: "あるS法人は、B種株式に議決権がない点を除きすべての点で同一の2種類の普通株式を有している。定款等は全株式に分配および清算時の残余財産について同一の権利を与えている。正しい記述はどれか。",
      c: [
        "The S election terminates because the corporation has two classes of stock",
        "The corporation is treated as having one class of stock because differences in voting rights are disregarded",
        "The election remains valid only if Class B shares are held by family members",
        "Nonvoting shares are treated as debt for S corporation purposes",
      ],
      a: 1,
      ex: "1種類株式要件は分配・清算時の権利の同一性で判定し、議決権の有無の差は無視される。したがって議決権株と無議決権株を併存させても1種類株式とみなされ、事業承継の設計に用いられる。",
    },
    {
      q: "A calendar-year C corporation that has been in existence for several years files Form 2553, with consents from all shareholders, on April 2, 2026. Assuming no relief for late elections, when is the S election first effective?",
      ja: "数年間存続している暦年のC法人が、全株主の同意を得て2026年4月2日にForm 2553を提出した。遅延選択の救済がないとすると、S選択が最初に有効となるのはいつか。",
      c: ["January 1, 2026", "April 2, 2026", "January 1, 2027", "March 15, 2027"],
      a: 2,
      ex: "当年度から有効とするには課税年度開始後2か月15日以内(暦年なら3月15日)までに提出する必要がある。期限後の提出は翌課税年度(2027年1月1日)から有効となる。",
    },
    {
      q: "A calendar-year S corporation has 1,000 outstanding shares. Shareholders owning 550 shares consent to revoke the S election, and the revocation is filed on February 20 of the current year without specifying a prospective date. Which statement is correct?",
      ja: "暦年のS法人の発行済株式は1,000株である。550株を所有する株主がS選択の撤回に同意し、将来の日付を指定せずに当年の2月20日に撤回書を提出した。正しい記述はどれか。",
      c: [
        "The revocation is invalid because all shareholders must consent",
        "The revocation is effective on February 20 of the current year",
        "The revocation is effective on January 1 of the following year",
        "The revocation is effective on January 1 of the current year",
      ],
      a: 3,
      ex: "撤回には発行済株式の過半数を有する株主の同意が必要(550株で充足)。3月15日までに提出され将来日の指定がなければ当年度の期首(1月1日)に遡って有効となる。全員の同意が必要なのは選択(election)の方である。",
    },
    {
      q: "On July 1 of the current year, a shareholder of a calendar-year S corporation sells shares to a partnership. Which statement correctly describes the result?",
      ja: "当年7月1日、暦年のS法人の株主が株式をパートナーシップに売却した。結果を正しく説明している記述はどれか。",
      c: [
        "The S election terminates on July 1; the corporation files an S short-year return through June 30 and a C short-year return from July 1",
        "The S election terminates effective January 1 of the current year",
        "The S election terminates on January 1 of the following year",
        "The S election is not affected if the partnership has only individual partners",
      ],
      a: 0,
      ex: "パートナーシップは適格株主でないため、不適格株主の取得日(7月1日)にS選択が終了し、課税年度はS短期年度(〜6月30日)とC短期年度(7月1日〜)に分割される。パートナーの構成は関係ない。",
    },
    {
      q: "An S corporation has accumulated E&P from its prior C corporation years. Which circumstance will cause its S election to terminate under the passive investment income rule?",
      ja: "S法人はC法人時代の累積E&Pを有している。受動的投資所得の規定によりS選択が終了するのはどの場合か。",
      c: [
        "Passive investment income exceeds 25% of gross receipts in any single year",
        "Passive investment income exceeds 50% of gross receipts for two consecutive years",
        "It has accumulated C corporation E&P at the end of each of three consecutive years and passive investment income exceeding 25% of gross receipts in each of those years",
        "It pays the excess net passive income tax in any year",
      ],
      a: 2,
      ex: "C法人時代のE&Pを3年連続で期末に保有し、かつ3年連続で受動的投資所得が総収入の25%を超えた場合、4年目の期首にS選択が終了する。1年だけの超過では超過純受動的所得税が課されるのみである。",
    },
    {
      q: "An S corporation with accumulated E&P from C years has gross receipts of $400,000, of which $160,000 is passive investment income. Expenses directly connected with the passive income are $20,000. The corporate tax rate is 21%, and taxable income is ample. What is the excess net passive income tax?",
      ja: "C法人時代の累積E&Pを有するS法人の総収入は$400,000で、うち$160,000が受動的投資所得である。受動的所得に直接関連する費用は$20,000である。法人税率は21%で、課税所得は十分にある。超過純受動的所得税はいくらか。",
      c: ["$29,400", "$12,600", "$8,400", "$11,025"],
      a: 3,
      ex: "純受動的所得 = 160,000 − 20,000 = 140,000。超過部分 = 140,000 × (160,000 − 400,000 × 25%) ÷ 160,000 = 52,500。税額 = 52,500 × 21% = 11,025。純受動的所得全額に課税すると$29,400と誤る。",
    },
    {
      q: "At the beginning of the year, Abe's basis in his S corporation stock is $10,000, and his basis in a $5,000 loan he made to the corporation is $5,000. During the year, Abe receives a $4,000 cash distribution, and his share of the corporation's ordinary loss is $18,000. How much of the loss may Abe deduct (assuming at-risk and passive rules do not limit it)?",
      ja: "期首において、AbeのS法人株式の基準価額は$10,000、法人への貸付金$5,000の基準価額は$5,000である。当期、Abeは現金$4,000の分配を受け、法人の通常損失のAbe負担分は$18,000である。危険負担額・受動的活動の制限がないとして、Abeが控除できる損失はいくらか。",
      c: ["$15,000", "$11,000", "$10,000", "$18,000"],
      a: 1,
      ex: "株式基準価額は分配が損失より先に減額され 10,000 − 4,000 = 6,000。損失はまず株式基準価額6,000、次に貸付金基準価額5,000の範囲で控除でき計11,000、残り7,000は繰り越される。分配を後に処理すると$15,000と誤る。",
    },
    {
      q: "At the beginning of the year, Kaye's S corporation stock basis is $0, and her basis in a $10,000 shareholder loan has been reduced by prior losses to $2,000. This year, Kaye's share of the corporation's net income is $12,000, with no distributions and no suspended losses. What are Kaye's stock basis and debt basis at year-end?",
      ja: "期首において、KayeのS法人株式の基準価額は$0で、額面$10,000の株主貸付金の基準価額は過年度の損失により$2,000に減額されている。当期、法人の純利益のKaye負担分は$12,000で、分配や停止損失はない。期末のKayeの株式基準価額と貸付金基準価額はいくらか。",
      c: [
        "Stock $12,000; debt $2,000",
        "Stock $10,000; debt $4,000",
        "Stock $4,000; debt $10,000",
        "Stock $2,000; debt $12,000",
      ],
      a: 2,
      ex: "純増加額はまず減額された貸付金の基準価額を額面まで回復させる(2,000 → 10,000、8,000を使用)。残り4,000が株式基準価額を増加させる。貸付金の基準価額は額面を超えて増加しない。",
    },
    {
      q: "Lin holds a $10,000 note from her S corporation, evidenced by a written instrument held for three years. Prior pass-through losses reduced her basis in the note to $6,000, and no net increase has restored it. The corporation repays the note in full this year. What does Lin recognize?",
      ja: "Linは自身のS法人に対する$10,000の貸付金(書面による手形、3年間保有)を有している。過年度のパススルー損失により手形の基準価額は$6,000に減額されており、純増加による回復はない。当期、法人は手形を全額返済した。Linは何を認識するか。",
      c: [
        "$4,000 ordinary income because the loan was an open account",
        "No gain because repayment of a loan is a return of capital",
        "$10,000 dividend income",
        "$4,000 long-term capital gain",
      ],
      a: 3,
      ex: "減額された基準価額6,000を超える返済額4,000は利得となる。書面による手形で資本資産として長期保有していれば長期資本利得となる。書面のない開放勘定(open account)の貸付であれば通常所得となる。",
    },
    {
      q: "An S corporation with accumulated E&P of $20,000 begins the year with an AAA of $10,000. During the year it earns ordinary income of $30,000 and tax-exempt interest of $5,000, and it distributes $50,000 to its sole shareholder, whose stock basis is ample. No election is made to distribute E&P first. How much of the distribution is a taxable dividend?",
      ja: "累積E&P $20,000を有するS法人の期首AAAは$10,000である。当期、通常所得$30,000と非課税利息$5,000を稼得し、唯一の株主(株式基準価額は十分)に$50,000を分配した。E&Pを先に分配する選択は行っていない。分配のうち課税配当となるのはいくらか。",
      c: ["$5,000", "$20,000", "$10,000", "$0"],
      a: 2,
      ex: "AAA = 10,000 + 30,000 = 40,000(非課税所得はAAAに含めずOAAに計上)。分配50,000のうち40,000はAAAから非課税、次の10,000は累積E&Pからの配当となる。非課税利息をAAAに含めると$5,000と誤る。",
    },
    {
      q: "A C corporation elected S status three years ago, when it had a net unrealized built-in gain of $80,000. This year it sells an asset that had a $50,000 built-in gain at conversion. Its net recognized built-in gain before the taxable income limitation is $50,000, but its taxable income computed as if it were a C corporation is $30,000. The tax rate is 21%. What is the built-in gains tax for this year, and what happens to the excess?",
      ja: "あるC法人は3年前にS選択を行い、その時点の純未実現含み益は$80,000であった。当期、転換時に$50,000の含み益を有していた資産を売却した。課税所得制限前の純認識含み益は$50,000であるが、C法人とみなして計算した課税所得は$30,000である。税率は21%である。当期の含み益税額はいくらで、超過額はどうなるか。",
      c: [
        "$6,300; the $20,000 excess is carried forward to later years within the recognition period",
        "$10,500; there is no taxable income limitation",
        "$6,300; the $20,000 excess is permanently excluded",
        "$16,800; the tax is based on the full net unrealized built-in gain",
      ],
      a: 0,
      ex: "純認識含み益は課税所得で制限され、税額は 30,000 × 21% = 6,300。制限された20,000は認識期間内の翌年以降に繰り越して課税される。純未実現含み益80,000は課税総額の上限である。",
    },
    {
      q: "A calendar-year C corporation using LIFO elects S status effective January 1. At the end of its last C year, its inventory is $500,000 under FIFO and $380,000 under LIFO. The corporate rate is 21%. How much LIFO recapture tax is due with the final C corporation return?",
      ja: "LIFOを採用する暦年のC法人が1月1日付でS選択を行った。最終C年度末の棚卸資産はFIFOで$500,000、LIFOで$380,000である。法人税率は21%である。最終C法人申告書とともに納付すべきLIFO取戻し税額はいくらか。",
      c: ["$25,200", "$6,300", "$0, because LIFO recapture applies only on later sale", "$12,600"],
      a: 1,
      ex: "LIFO取戻額 = 500,000 − 380,000 = 120,000 を最終C年度の所得に含め、増加税額25,200は4回均等分割で納付する。初回(最終C年度申告期限)は 25,200 ÷ 4 = 6,300。残りはS法人が翌3年間に納付する。",
    },
    {
      q: "An S corporation pays $14,000 of health insurance premiums for Dana, an employee who owns 10% of its stock. Which statement correctly describes the tax treatment?",
      ja: "S法人は、株式の10%を所有する従業員Danaのために健康保険料$14,000を支払った。税務上の取扱いを正しく説明している記述はどれか。",
      c: [
        "The premiums are a tax-free fringe benefit to Dana and deductible by the corporation",
        "The premiums are nondeductible by the corporation and treated as a distribution",
        "The premiums are deductible by the corporation and included in Dana's W-2 wages, and Dana may claim the self-employed health insurance deduction",
        "The premiums are included in Dana's income but no deduction is available to anyone",
      ],
      a: 2,
      ex: "2%超株主は従業員フリンジ・ベネフィットについてパートナーと同様に扱われる。法人は保険料を控除し、Danaの給与(W-2)に含めるが(一定の場合FICA対象外)、Danaは自営業者健康保険料控除を受けられる。非課税福利厚生とするのは2%以下の株主の場合である。",
    },
    {
      q: "The sole shareholder of a profitable S corporation works full time in the business but takes no salary, instead receiving $200,000 of distributions each year. What is the most likely consequence if the IRS examines the arrangement?",
      ja: "利益の出ているS法人の唯一の株主は事業にフルタイムで従事しているが給与を受け取らず、代わりに毎年$200,000の分配を受けている。IRSがこの取決めを調査した場合、最も可能性の高い結果はどれか。",
      c: [
        "The S election is terminated for creating a second class of stock",
        "The distributions are recharacterized as dividends taxable at ordinary rates",
        "No consequence, because S corporation distributions are never subject to employment taxes",
        "A portion of the distributions is recharacterized as reasonable compensation subject to FICA and employment tax withholding",
      ],
      a: 3,
      ex: "S法人の役務提供株主には合理的な報酬の支払が求められ、IRSは分配の一部を給与に再分類してFICA等の雇用税を課す。給与とK-1所得の配分は自営業税負担を左右するため計画上の論点となる。",
    },
    {
      q: "An entity borrows $300,000 from an unrelated bank to finance operations, and the owners do not guarantee the loan. Which statement is correct when comparing an S corporation with an LLC taxed as a partnership?",
      ja: "事業体が無関係の銀行から運転資金として$300,000を借り入れ、所有者は保証していない。S法人とパートナーシップとして課税されるLLCを比較した場合、正しい記述はどれか。",
      c: [
        "The loan increases each LLC member's outside basis by their share, but it does not increase S corporation shareholders' stock or debt basis",
        "The loan increases basis for both S corporation shareholders and LLC members",
        "The loan increases basis only for S corporation shareholders, because the corporation is the borrower",
        "Neither entity's owners obtain basis from entity-level debt",
      ],
      a: 0,
      ex: "パートナーシップでは§752によりエンティティの負債がパートナーのoutside basisに含まれ、損失控除余地が広がる。S法人株主は株主が直接法人に貸し付けた債権についてのみ債権基準価額を得られ、保証や第三者借入では基準価額は増えない。",
    },
    {
      q: "A calendar-year S corporation has ordinary income of $365,000 for the year, earned evenly. Shareholder A owned 50% of the stock for the first 146 days of the year and then sold all of her shares to B, who held them for the remaining 219 days. No election to close the books is made. How much ordinary income is allocated to A?",
      ja: "暦年のS法人の当期通常所得は$365,000で、年間を通じて均等に稼得された。株主Aは期首から146日間株式の50%を所有し、その後全株式をBに売却し、Bが残りの219日間保有した。帳簿締切の選択は行っていない。Aに配分される通常所得はいくらか。",
      c: ["$182,500", "$146,000", "$109,500", "$73,000"],
      a: 3,
      ex: "S法人は1株1日あたりの按分で配分する。365,000 × 50% × 146/365 = 73,000(Bは109,500)。パートナーシップと異なり特別配分は認められない。年間の持分50%をそのまま当てると$182,500と誤る。",
    },
    {
      q: "Owen owns 10% of an existing entity whose net assets are worth $900,000. He transfers land with a basis of $20,000 and a FMV of $100,000 to the entity in exchange for an additional ownership interest; no other owners contribute property at the same time. Which statement is correct?",
      ja: "Owenは純資産価値$900,000の既存の事業体の10%を所有している。彼は基準価額$20,000、公正価値$100,000の土地を事業体に拠出し、追加の持分を取得した。同時に財産を拠出する他の所有者はいない。正しい記述はどれか。",
      c: [
        "Owen recognizes no gain whether the entity is a partnership or an S corporation",
        "Owen recognizes an $80,000 gain if the entity is a partnership, but no gain if it is an S corporation",
        "Owen recognizes no gain if the entity is a partnership, but an $80,000 gain if it is an S corporation because the §351 control requirement is not met",
        "Owen recognizes an $80,000 gain in either case",
      ],
      a: 2,
      ex: "§721には支配要件がなく、パートナーシップへの拠出は非課税。S法人への拠出は§351が適用され、拠出者グループが拠出直後に80%以上を支配する必要があるため、Owen単独(拠出後19%)では要件を満たさず利得80,000を認識する。",
    },
    {
      q: "An S corporation distributes land with a FMV of $50,000 and an adjusted basis of $20,000 to its sole shareholder, whose stock basis before the distribution is $40,000. The corporation has no E&P and no other items for the year. What is the shareholder's stock basis after the distribution?",
      ja: "S法人は公正価値$50,000、調整後基準価額$20,000の土地を唯一の株主に分配した。分配前の株主の株式基準価額は$40,000である。法人にE&Pはなく、当期の他の項目もない。分配後の株主の株式基準価額はいくらか。",
      c: ["$0, with a $10,000 capital gain", "$20,000", "$70,000", "$40,000"],
      a: 1,
      ex: "S法人は含み益のある財産の分配で利得30,000を認識し、株主にパススルーされ基準価額は70,000に増加する。その後、分配財産の公正価値50,000を減額して20,000となる(土地の基準価額は50,000)。パートナーシップであれば利得は認識されない。",
    },
  ],
});

CPA.tbs({ id: "TBS-TCP-15", section: "TCP", chapter: "TCP-02", title: "パートナーシップの設立:§721・§752・§704(c)",
  scenario: `<p>A, B, and C form ABC Partnership, sharing all items equally (1/3 each):</p>
<table><tr><th>Partner</th><th>Contribution</th></tr>
<tr><td>A</td><td>Land: adjusted basis $30,000; FMV $90,000; subject to a $30,000 recourse mortgage assumed by the partnership</td></tr>
<tr><td>B</td><td>Cash $60,000</td></tr>
<tr><td>C</td><td>Services with a value of $60,000 in exchange for a 1/3 capital interest</td></tr></table>
<p>The partners share economic risk of loss on the recourse mortgage equally. Assume the partnership recognizes no gain on issuing C's interest. Three years later, the partnership sells the land for $120,000; it uses the traditional §704(c) method.</p>
<p class="ja">A・B・CはABCパートナーシップを設立し、全項目を1/3ずつ負担する。Aは土地(基準価額$30,000、公正価値$90,000、パートナーシップが引き受ける$30,000のリコース・モーゲージ付き)、Bは現金$60,000、Cは1/3のキャピタル持分と引換えに価値$60,000の役務を提供した。リコース負債の経済的損失リスクは均等に負担する。C持分の発行によりパートナーシップに利得は生じないものとする。3年後、パートナーシップは土地を$120,000で売却した(§704(c)は伝統的方法)。</p>`,
  rows: [
    { label: "Gain recognized by A on formation(設立時にAが認識する利得)", type: "num", answer: 0 },
    { label: "A's outside basis after formation(設立後のAのoutside basis)", type: "num", answer: 10000 },
    { label: "B's outside basis after formation(設立後のBのoutside basis)", type: "num", answer: 70000 },
    { label: "Ordinary income recognized by C(Cが認識する通常所得)", type: "num", answer: 60000 },
    { label: "C's outside basis after formation(設立後のCのoutside basis)", type: "num", answer: 70000 },
    { label: "Gain on the land sale allocated to A(土地売却益のうちAへの配分額)", type: "num", answer: 70000 },
  ],
  explain: `<p>A:30,000 − 30,000(負債の免除)+ 10,000(負債の1/3)= 10,000。基準価額がマイナスにならないため利得は0。</p>
<p>B:60,000 + 10,000 = 70,000。C:役務の対価として受けたキャピタル持分60,000は通常所得となり、基準価額は 60,000 + 10,000 = 70,000。</p>
<p>土地売却益 = 120,000 − 30,000 = 90,000。拠出時の含み益60,000はAに配分(§704(c))、残り30,000を1/3ずつ配分し、A = 60,000 + 10,000 = 70,000。</p>`,
});

CPA.tbs({ id: "TBS-TCP-16", section: "TCP", chapter: "TCP-02", title: "パートナーシップ持分の売却:§751と§743(b)",
  scenario: `<p>D sells her 25% interest in DEF Partnership to E for $80,000 cash. The partnership has a §754 election in effect. Its balance sheet at the sale date:</p>
<table><tr><th>Asset</th><th>Adjusted basis</th><th>FMV</th></tr>
<tr><td>Cash</td><td>$40,000</td><td>$40,000</td></tr>
<tr><td>Accounts receivable (cash basis)</td><td>$0</td><td>$40,000</td></tr>
<tr><td>Inventory</td><td>$60,000</td><td>$80,000</td></tr>
<tr><td>Land (capital asset)</td><td>$100,000</td><td>$200,000</td></tr>
<tr><td>Total</td><td>$200,000</td><td>$360,000</td></tr></table>
<p>Partnership liabilities are $40,000, shared 25% by D. D's outside basis, including her share of liabilities, is $50,000. E assumes D's share of liabilities.</p>
<p class="ja">DはDEFパートナーシップの25%持分をEに現金$80,000で売却した。パートナーシップは§754選択を行っている。売却日の資産は上表のとおり(合計:基準価額$200,000、公正価値$360,000)。負債は$40,000で、Dは25%を負担する。負債負担分を含むDのoutside basisは$50,000であり、EはDの負債負担分を引き受ける。</p>`,
  rows: [
    { label: "D's amount realized(Dの実現額)", type: "num", answer: 90000 },
    { label: "D's total recognized gain(Dの認識利得合計)", type: "num", answer: 40000 },
    { label: "Ordinary income under §751(§751による通常所得)", type: "num", answer: 15000 },
    { label: "Capital gain(資本利得)", type: "num", answer: 25000 },
    { label: "E's initial outside basis(Eの当初outside basis)", type: "num", answer: 90000 },
    { label: "E's §743(b) basis adjustment(Eの§743(b)基準価額調整額)", type: "num", answer: 40000 },
  ],
  explain: `<p>実現額 = 80,000 + 40,000 × 25%(10,000)= 90,000。利得 = 90,000 − 50,000 = 40,000。</p>
<p>§751資産(売掛金と棚卸資産)の含み益 = 40,000 + 20,000 = 60,000、Dの持分25%で15,000が通常所得。残り25,000が資本利得。</p>
<p>Eのoutside basis = 現金80,000 + 引受負債10,000 = 90,000。inside basisの持分 = 200,000 × 25% = 50,000。§743(b)調整 = 90,000 − 50,000 = 40,000(E個人にのみ帰属)。</p>`,
});

CPA.tbs({ id: "TBS-TCP-17", section: "TCP", chapter: "TCP-02", title: "S法人のAAA・分配・株主基準価額",
  scenario: `<p>Calendar-year XY Corp., a former C corporation, has been an S corporation for several years. Ito owns 60% of the stock; Yu owns 40%. Information for the year:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>AAA, beginning of year</td><td>$20,000</td></tr>
<tr><td>Accumulated E&amp;P from C years, beginning of year</td><td>$30,000</td></tr>
<tr><td>Ordinary business income</td><td>$100,000</td></tr>
<tr><td>Tax-exempt interest income</td><td>$10,000</td></tr>
<tr><td>Long-term capital gain</td><td>$20,000</td></tr>
<tr><td>Nondeductible expenses (not related to tax-exempt income)</td><td>$5,000</td></tr>
<tr><td>Cash distributions (pro rata to shareholders)</td><td>$150,000</td></tr></table>
<p>Ito's stock basis at the beginning of the year is $40,000. No elections affecting distribution ordering are made.</p>
<p class="ja">暦年のXY社は元C法人で、数年前からS法人である。Itoが60%、Yuが40%を所有する。期首AAA $20,000、C年度の累積E&amp;P $30,000、通常事業所得$100,000、非課税利息$10,000、長期資本利得$20,000、損金不算入費用(非課税所得に関連しない)$5,000、現金分配$150,000(持分比例)。Itoの期首株式基準価額は$40,000。分配順序に影響する選択はない。</p>`,
  rows: [
    { label: "AAA available before distributions(分配前のAAA)", type: "num", answer: 135000 },
    { label: "Ito's distribution from AAA (nontaxable)(Itoへの分配のうちAAAからの部分)", type: "num", answer: 81000 },
    { label: "Ito's dividend income(Itoの配当所得)", type: "num", answer: 9000 },
    { label: "Ito's stock basis at year-end(Itoの期末株式基準価額)", type: "num", answer: 34000 },
    { label: "Accumulated E&P at year-end(期末の累積E&P)", type: "num", answer: 15000 },
    { label: "AAA at year-end(期末AAA)", type: "num", answer: 0 },
  ],
  explain: `<p>AAA = 20,000 + 100,000 + 20,000 − 5,000 = 135,000(非課税利息はAAAに含めない)。分配150,000のうち135,000がAAAから、残り15,000が累積E&amp;Pからの配当となる。</p>
<p>Ito:AAA部分 135,000 × 60% = 81,000、配当 15,000 × 60% = 9,000。</p>
<p>Itoの基準価額:40,000 + (100,000 + 10,000 + 20,000) × 60% = 118,000 → 非課税分配81,000を減額して37,000 → 損金不算入費用3,000を減額して34,000。E&amp;Pからの配当は基準価額を減額しない。</p>
<p>期末累積E&amp;P = 30,000 − 15,000 = 15,000、期末AAA = 0。</p>`,
});
