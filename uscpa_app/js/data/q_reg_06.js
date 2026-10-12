// REG の追加問題(資産取引:取得価額・キャピタルゲイン・§1231・同種交換・減価償却)

CPA.extend("REG-04", {
  mcq: [
    {
      q: "An individual purchased a building for investment by paying $80,000 cash and assuming the seller's $220,000 mortgage. The buyer also paid $5,000 of title and legal fees and $3,000 of delinquent real property taxes that were owed by the seller for the period before the sale. What is the buyer's basis in the building?",
      ja: "個人が投資目的で建物を購入し、現金$80,000を支払い、売主の抵当借入金$220,000を引き受けた。買主はさらに権原調査・法務費用$5,000と、売却前の期間について売主が負っていた滞納固定資産税$3,000を支払った。買主の建物の取得価額はいくらか。",
      c: ["$308,000", "$85,000", "$300,000", "$305,000"],
      a: 0,
      ex: "取得価額 = 現金80,000 + 引受債務220,000 + 取得付随費用5,000 + 売主負担の税金の肩代わり3,000 = 308,000。引き受けた債務は対価に含める($85,000は誤り)。売主負担分の税金を買主が支払った場合は資産の取得原価に加算する($305,000は漏れ)。",
    },
    {
      q: "Lena received shares of stock as a gift from her father. Her father's adjusted basis was $40,000, and the fair market value on the date of the gift was $30,000. No gift tax was paid. Lena later sold the shares for $34,000. What gain or loss should Lena recognize?",
      ja: "Lenaは父から株式の贈与を受けた。父の調整後取得価額は$40,000、贈与日の公正市場価値は$30,000であった。贈与税は支払われていない。Lenaは後にこの株式を$34,000で売却した。Lenaが認識すべき損益はいくらか。",
      c: ["$6,000 loss", "$4,000 gain", "No gain or loss", "$10,000 loss"],
      a: 2,
      ex: "贈与時のFMVが贈与者の取得価額を下回る場合は二重基準:利得計算には40,000、損失計算には30,000を用いる。売却額34,000は両者の間にあるため損益なし。$6,000の損失は利得用の基準で損失を計算した誤り。",
    },
    {
      q: "Marco received land as a gift when the donor's adjusted basis was $40,000 and its fair market value was $30,000. No gift tax was paid. Marco sold the land two years later for $44,000. What is Marco's recognized gain?",
      ja: "Marcoは土地の贈与を受けた。贈与時の贈与者の調整後取得価額は$40,000、公正市場価値は$30,000であった。贈与税は支払われていない。Marcoは2年後にこの土地を$44,000で売却した。Marcoの認識利得はいくらか。",
      c: ["$14,000", "$0", "$10,000", "$4,000"],
      a: 3,
      ex: "売却額が贈与者の取得価額を上回るため、利得計算用の基準(贈与者の取得価額40,000)を用いる。利得 = 44,000 − 40,000 = 4,000。$14,000はFMV 30,000を取得価額としてしまった誤り(FMVは損失計算にのみ使う)。",
    },
    {
      q: "A donor made a gift of land with an adjusted basis of $60,000 and a fair market value of $100,000. After the annual exclusion, the taxable gift was $80,000, and the donor paid gift tax of $20,000 on the gift. What is the donee's basis in the land?",
      ja: "贈与者が調整後取得価額$60,000、公正市場価値$100,000の土地を贈与した。年間非課税枠控除後の課税贈与額は$80,000で、贈与者はこの贈与について贈与税$20,000を支払った。受贈者の土地の取得価額はいくらか。",
      c: ["$80,000", "$70,000", "$60,000", "$100,000"],
      a: 1,
      ex: "贈与税のうち値上がり益に対応する部分のみ加算する。加算額 = 20,000 × (100,000 − 60,000) ÷ 80,000 = 10,000。取得価額 = 60,000 + 10,000 = 70,000。贈与税全額を加算する$80,000は1976年以前の旧ルールである。",
    },
    {
      q: "A decedent died on February 1. Stock included in the gross estate was worth $500,000 on the date of death and $440,000 six months later. The executor properly elected the alternate valuation date. The stock was distributed to the heir on June 1, when it was worth $460,000. What is the heir's basis in the stock?",
      ja: "被相続人が2月1日に死亡した。遺産総額に含まれる株式の価値は死亡日に$500,000、6か月後に$440,000であった。遺言執行者は代替評価日を適法に選択した。株式は6月1日に相続人に分配され、その日の価値は$460,000であった。相続人の株式の取得価額はいくらか。",
      c: ["$500,000", "$440,000", "$460,000", "$480,000"],
      a: 2,
      ex: "代替評価日を選択した場合、死亡後6か月以内に分配・売却された資産はその処分日の価値で評価する。6月1日に分配されたため460,000。$440,000は6か月後の価値をそのまま使った誤りである。",
    },
    {
      q: "Nora converted her personal residence to rental property. At conversion the house (ignore land) had an adjusted basis of $250,000 and a fair market value of $180,000. She claimed $12,000 of depreciation and then sold the house for $150,000. What is Nora's recognized gain or loss?",
      ja: "Noraは自宅を賃貸用不動産に転用した。転用時の家屋(土地は無視)の調整後取得価額は$250,000、公正市場価値は$180,000であった。減価償却費$12,000を計上した後、家屋を$150,000で売却した。Noraの認識損益はいくらか。",
      c: ["$88,000 loss", "$18,000 loss", "$30,000 loss", "No gain or loss"],
      a: 1,
      ex: "個人用から事業用に転用した資産の損失計算・減価償却の基準は、転用時のFMVと取得価額のいずれか低い方(180,000)。損失用基準 = 180,000 − 12,000 = 168,000、損失 = 168,000 − 150,000 = 18,000。$88,000は個人使用中の値下がり(控除不可)まで含めた誤り。",
    },
    {
      q: "Ken owns 200 shares of stock with a basis of $20,000. He receives nontaxable stock rights with a fair market value of $6,000 when the stock (ex-rights) has a fair market value of $30,000. How much of Ken's basis is allocated to the rights?",
      ja: "Kenは取得価額$20,000の株式200株を保有している。株式(権利落ち後)の公正市場価値が$30,000のときに、公正市場価値$6,000の非課税新株引受権を受け取った。新株引受権に配分される取得価額はいくらか。",
      c: ["$0", "$4,000", "$6,000", "$3,333"],
      a: 3,
      ex: "権利のFMVが株式FMVの15%以上(6,000/30,000 = 20%)なので取得価額を配分しなければならない。20,000 × 6,000 ÷ (30,000 + 6,000) = 3,333。$4,000は分母に権利のFMVを含めなかった誤り。",
    },
    {
      q: "Pia owns stock with a basis of $20,000 and a fair market value of $30,000. She receives nontaxable stock rights with a fair market value of $2,400 and does not elect to allocate basis to them. She sells the rights for $2,400. What is her recognized gain on the sale of the rights?",
      ja: "Piaは取得価額$20,000、公正市場価値$30,000の株式を保有している。公正市場価値$2,400の非課税新株引受権を受け取り、取得価額の配分を選択しなかった。彼女はこの権利を$2,400で売却した。権利の売却による認識利得はいくらか。",
      c: ["$2,400", "$919", "$0", "$800"],
      a: 0,
      ex: "権利のFMVが株式FMVの15%未満(2,400/30,000 = 8%)の場合、選択しない限り権利の取得価額はゼロ。したがって売却額2,400全額が利得となる。$919は配分を選択した場合(20,000 × 2,400/32,400 ≒ 1,481)の数値である。",
    },
    {
      q: "On February 10, 2025, Sam bought 100 shares of Delta Corp. for $5,000. On December 1, 2026, he sold the 100 shares for $3,500, and on December 15, 2026, he bought 100 shares of Delta Corp. for $3,800. What is Sam's basis in the new shares, and when does their holding period begin?",
      ja: "2025年2月10日、SamはDelta社株式100株を$5,000で購入した。2026年12月1日にその100株を$3,500で売却し、2026年12月15日にDelta社株式100株を$3,800で購入した。新株式の取得価額と保有期間の起算日はどれか。",
      c: [
        "$3,800; holding period begins December 15, 2026",
        "$5,300; holding period begins December 15, 2026",
        "$5,300; holding period includes the period since February 10, 2025",
        "$3,800; the $1,500 loss is recognized in 2026",
      ],
      a: 2,
      ex: "売却の前後30日以内に実質的に同一の株式を取得したためウォッシュセール。損失1,500は否認され新株の取得価額に加算:3,800 + 1,500 = 5,300。旧株の保有期間も通算されるため長期保有となる。",
    },
    {
      q: "Tara sold 100 shares of stock with a basis of $8,000 for $6,000. Twenty days later she purchased 60 shares of the same stock. What is Tara's recognized loss on the sale?",
      ja: "Taraは取得価額$8,000の株式100株を$6,000で売却した。20日後、同じ株式を60株購入した。売却に係るTaraの認識損失はいくらか。",
      c: ["$0", "$800", "$1,200", "$2,000"],
      a: 1,
      ex: "ウォッシュセールは買い戻した株数の割合だけ損失を否認する。否認額 = 2,000 × 60/100 = 1,200、認識損失 = 2,000 − 1,200 = 800。否認された1,200は60株の取得価額に加算される。$0は全額否認とした誤り。",
    },
    {
      q: "A donee received stock whose fair market value at the date of the gift ($12,000) was less than the donor's adjusted basis ($18,000). The donee later sold the stock for $9,000. For purposes of determining whether the loss is short-term or long-term, the donee's holding period:",
      ja: "受贈者が受け取った株式の贈与日の公正市場価値($12,000)は贈与者の調整後取得価額($18,000)を下回っていた。受贈者は後にこの株式を$9,000で売却した。損失が短期か長期かを判定するうえで、受贈者の保有期間はどうなるか。",
      c: [
        "Includes the donor's holding period",
        "Begins on the date of the gift",
        "Is automatically long-term",
        "Begins on the date the donor acquired the stock only if gift tax was paid",
      ],
      a: 1,
      ex: "損失計算にFMV(12,000)を取得価額として用いる場合、贈与者の取得価額を引き継がないため保有期間も通算されず、贈与日から起算する。贈与者の取得価額を引き継ぐ場合(利得計算)は贈与者の保有期間を通算する。",
    },
    {
      q: "In a transaction qualifying under §351, a shareholder transfers land held for investment for 6 years to a corporation in exchange for stock. Which statement is correct regarding the corporation's holding period for the land?",
      ja: "§351の要件を満たす取引で、株主が6年間投資目的で保有していた土地を株式と交換に法人へ移転した。法人の土地の保有期間に関する記述として正しいものはどれか。",
      c: [
        "It begins on the date of the transfer",
        "It includes the shareholder's 6-year holding period",
        "It includes the shareholder's holding period only if boot is received",
        "It begins on the date the corporation files its first tax return",
      ],
      a: 1,
      ex: "§351で受け入れた資産の法人側の取得価額は移転者の取得価額を引き継ぐ(繰越取得価額)ため、移転者の保有期間も通算される。株主側の株式の保有期間も資本資産・§1231資産を移転した場合は通算される。",
    },
    {
      q: "During the year, an individual had the following capital transactions: short-term capital gain $8,000, short-term capital loss $12,000, long-term capital gain $15,000, and long-term capital loss $3,000. What is the result of netting these transactions?",
      ja: "当年、個人に次の資本取引があった。短期キャピタルゲイン$8,000、短期キャピタルロス$12,000、長期キャピタルゲイン$15,000、長期キャピタルロス$3,000。これらを相殺した結果はどれか。",
      c: [
        "Net short-term capital loss of $4,000 deductible against ordinary income and net long-term capital gain of $12,000",
        "Net short-term capital gain of $8,000",
        "Net capital gain of $8,000 taxed as ordinary income",
        "Net long-term capital gain of $8,000 eligible for preferential rates",
      ],
      a: 3,
      ex: "短期:8,000 − 12,000 = 純短期損失4,000。長期:15,000 − 3,000 = 純長期利得12,000。両者を相殺し純長期キャピタルゲイン8,000となり、優遇税率の対象となる。短期損失を別途通常所得から控除することはできない。",
    },
    {
      q: "An individual sold a commercial building held for 8 years for $360,000. The building cost $400,000, and straight-line depreciation of $90,000 had been claimed. Ignore land. How much of the gain is unrecaptured §1250 gain subject to a maximum 25% rate?",
      ja: "個人が8年間保有していた商業用建物を$360,000で売却した。建物の取得原価は$400,000で、定額法による減価償却費$90,000を計上済みである。土地は無視する。利得のうち最高税率25%が適用される未回収§1250利得はいくらか。",
      c: ["$90,000", "$40,000", "$0", "$50,000"],
      a: 3,
      ex: "調整後取得価額 = 400,000 − 90,000 = 310,000、利得 = 360,000 − 310,000 = 50,000。未回収§1250利得は減価償却累計額と利得のいずれか少ない方なので50,000(全額25%区分)。$90,000は利得を超えて減価償却費全額をとった誤り。",
    },
    {
      q: "An individual had the following transactions: a $10,000 gain on the sale of gold coins (collectibles) held 3 years, a $20,000 long-term gain on stock, and a $6,000 short-term capital loss. How much of the net gain is taxed in the 28% rate group?",
      ja: "個人に次の取引があった。3年間保有した金貨(収集品)の売却益$10,000、株式の長期売却益$20,000、短期キャピタルロス$6,000。純利得のうち28%税率区分で課税される金額はいくらか。",
      c: ["$10,000", "$4,000", "$0", "$8,000"],
      a: 1,
      ex: "純短期キャピタルロスは最も税率の高い区分(28%区分)から順に相殺する。10,000 − 6,000 = 4,000が28%区分、20,000は0/15/20%区分。$8,000は損失を区分間で按分した誤り。",
    },
    {
      q: "Dana owns 300 shares of common stock with a basis of $18,000. She receives a nontaxable stock dividend of 100 shares of preferred stock. Immediately after the distribution, the common stock has a fair market value of $60,000 and the preferred stock has a fair market value of $30,000. What is Dana's basis in the preferred stock?",
      ja: "Danaは取得価額$18,000の普通株式300株を保有している。彼女は非課税の株式配当として優先株式100株を受け取った。分配直後の普通株式の公正市場価値は$60,000、優先株式は$30,000である。Danaの優先株式の取得価額はいくらか。",
      c: ["$4,500", "$6,000", "$0", "$30,000"],
      a: 1,
      ex: "非課税の株式配当(異なる種類の株式)は旧株の取得価額を相対的FMVで按分する。18,000 × 30,000 ÷ (60,000 + 30,000) = 6,000。$4,500は株数(100/400)で按分した誤りであり、$30,000は課税配当として扱った誤りである。",
    },
    {
      q: "Omar inherited stock from his aunt, who had purchased it 4 months before her death for $50,000. The fair market value at the date of death was $90,000, and no alternate valuation election was made. Omar sold the stock 2 months after her death for $85,000. What is Omar's gain or loss?",
      ja: "Omarは叔母から株式を相続した。叔母は死亡の4か月前にこの株式を$50,000で購入していた。死亡日の公正市場価値は$90,000で、代替評価日の選択は行われていない。Omarは叔母の死亡の2か月後にこの株式を$85,000で売却した。Omarの損益はどれか。",
      c: ["$5,000 long-term capital loss", "$35,000 long-term capital gain", "$5,000 short-term capital loss", "$35,000 short-term capital gain"],
      a: 0,
      ex: "相続資産の取得価額は死亡日のFMV 90,000(ステップアップ)であり、損失 = 85,000 − 90,000 = 5,000。相続資産は実際の保有期間にかかわらず常に長期として扱う。$35,000の利得は被相続人の取得価額を引き継いだ誤り。",
    },
    {
      q: "A single individual had the following capital transactions in 2026 and no capital loss carryovers from prior years: short-term capital loss of $2,000, long-term capital loss of $7,000, and long-term capital gain of $1,000. What is the amount and character of the capital loss carryover to 2027?",
      ja: "独身の個人に2026年中に次の資本取引があり、前年からの繰越損失はない。短期キャピタルロス$2,000、長期キャピタルロス$7,000、長期キャピタルゲイン$1,000。2027年へ繰り越すキャピタルロスの金額と性質はどれか。",
      c: ["$5,000 short-term", "$6,000 long-term", "$2,000 short-term and $3,000 long-term", "$5,000 long-term"],
      a: 3,
      ex: "純短期損失2,000、純長期損失6,000、合計8,000のうち3,000を通常所得から控除する。控除はまず短期損失(2,000)、次に長期損失(1,000)を充当するため、繰越は長期5,000のみ。繰越損失は元の性質(長期)を維持する。",
    },
    {
      q: "A married individual filing separately has a net capital loss of $4,000 for 2026 and no capital loss carryover from prior years. What amount may be deducted against ordinary income in 2026, and how much is carried over?",
      ja: "夫婦個別申告の個人に2026年の純キャピタルロス$4,000があり、前年からの繰越損失はない。2026年に通常所得から控除できる金額と繰越額はいくらか。",
      c: ["$3,000 deducted; $1,000 carried over", "$1,500 deducted; $2,500 carried over", "$4,000 deducted; $0 carried over", "$2,000 deducted; $2,000 carried over"],
      a: 1,
      ex: "純キャピタルロスの通常所得からの控除限度は年3,000だが、夫婦個別申告の場合は1,500である。残額2,500は無期限に繰り越す。$3,000は個別申告の限度を見落とした誤り。",
    },
    {
      q: "A C corporation has a net capital loss of $30,000 in 2026. It reported net capital gains of $10,000 in 2023, $5,000 in 2024, and $8,000 in 2025. Which statement correctly describes the treatment of the 2026 net capital loss?",
      ja: "C法人に2026年の純キャピタルロス$30,000がある。同社は2023年に$10,000、2024年に$5,000、2025年に$8,000の純キャピタルゲインを計上していた。2026年の純キャピタルロスの取扱いとして正しいものはどれか。",
      c: [
        "$3,000 is deducted against 2026 ordinary income and $27,000 is carried forward indefinitely",
        "$23,000 is carried back and $7,000 is carried forward up to 5 years as a long-term capital loss",
        "$23,000 is carried back to 2023-2025 and $7,000 is carried forward up to 5 years as a short-term capital loss",
        "The entire $30,000 is carried forward up to 5 years as a short-term capital loss",
      ],
      a: 2,
      ex: "法人の純キャピタルロスは通常所得から控除できず、3年繰戻し(古い年度から)・5年繰越しとなる。繰戻しで10,000 + 5,000 + 8,000 = 23,000を吸収し、残り7,000を5年間短期キャピタルロスとして繰り越す。年3,000の控除は個人のルールである。",
    },
    {
      q: "A C corporation had operating income of $100,000, a long-term capital gain of $4,000, and a short-term capital loss of $10,000 for the year. What is the corporation's taxable income?",
      ja: "C法人の当年の営業利益は$100,000、長期キャピタルゲイン$4,000、短期キャピタルロス$10,000であった。法人の課税所得はいくらか。",
      c: ["$100,000", "$97,000", "$94,000", "$104,000"],
      a: 0,
      ex: "キャピタルロスはキャピタルゲインの範囲でのみ控除できる。純キャピタルロス6,000は控除できず(繰戻し・繰越し)、課税所得は100,000。$97,000は個人の年3,000控除を法人に適用した誤り。",
    },
    {
      q: "A single taxpayer has 2026 taxable income of $55,000, which includes $15,000 of long-term capital gain; the rest is ordinary income. Assume the 0% capital gain rate applies to taxable income up to $48,000 for her filing status and the 15% rate applies above that amount up to $530,000. How much of the long-term capital gain is taxed at 0%?",
      ja: "独身の納税者の2026年の課税所得は$55,000で、そのうち$15,000は長期キャピタルゲイン、残りは通常所得である。彼女の申告区分では課税所得$48,000までにキャピタルゲイン0%税率が適用され、それを超え$530,000までは15%が適用されると仮定する。長期キャピタルゲインのうち0%で課税される金額はいくらか。",
      c: ["$15,000", "$0", "$8,000", "$7,000"],
      a: 2,
      ex: "通常所得40,000が先に課税所得の下層を占め、キャピタルゲインはその上に積み上げる。0%区分の残り = 48,000 − 40,000 = 8,000、残る7,000は15%。$7,000は15%部分であり、$0は課税所得全体が閾値を超えるとして全額15%とした誤り。",
    },
    {
      q: "A sole proprietor with no prior §1231 losses had the following 2026 transactions involving property held more than one year: $20,000 gain on the sale of business land, $8,000 loss on the sale of business equipment (sold for less than its adjusted basis), and a $3,000 casualty gain from storm damage to a business building, none of which is depreciation recapture. How are these results treated?",
      ja: "過去に§1231損失がない個人事業主に、保有期間1年超の資産について2026年に次の取引があった。事業用土地の売却益$20,000、事業用設備の売却損$8,000(調整後取得価額未満で売却)、事業用建物の暴風被害による災害利得$3,000(減価償却の取戻しはない)。これらはどのように扱われるか。",
      c: [
        "$20,000 long-term capital gain and $8,000 ordinary loss; the $3,000 casualty gain is ordinary income",
        "$15,000 ordinary income",
        "$12,000 long-term capital gain and $3,000 ordinary income",
        "$15,000 net §1231 gain treated as long-term capital gain",
      ],
      a: 3,
      ex: "事業用資産の災害純利得は§1231の相殺に含める。20,000 − 8,000 + 3,000 = 純§1231利得15,000で、過去5年の未回収§1231損失がないため全額長期キャピタルゲインとなる。損益を個別に性質決定する選択肢は相殺手続を無視している。",
    },
    {
      q: "In 2026, an individual has a net §1231 gain of $40,000. Prior net §1231 results were: 2020 loss of $6,000, 2022 loss of $15,000, 2024 gain of $9,000 (of which $9,000 was properly recharacterized as ordinary income in 2024), and no other §1231 activity. How is the 2026 net §1231 gain treated?",
      ja: "2026年に個人の純§1231利得は$40,000である。過去の純§1231の結果は、2020年損失$6,000、2022年損失$15,000、2024年利得$9,000(2024年に$9,000が適正に通常所得へ再分類された)であり、その他の§1231取引はない。2026年の純§1231利得はどのように扱われるか。",
      c: [
        "$6,000 ordinary income and $34,000 long-term capital gain",
        "$15,000 ordinary income and $25,000 long-term capital gain",
        "$12,000 ordinary income and $28,000 long-term capital gain",
        "$40,000 long-term capital gain",
      ],
      a: 0,
      ex: "5年ルックバック:2026年の場合は2021〜2025年の未回収純§1231損失のみ対象で、2020年の損失は対象外。2022年損失15,000のうち9,000は2024年に回収済みなので残り6,000を通常所得とし、34,000を長期キャピタルゲインとする。$12,000は期間外の2020年損失を含めた誤り。",
    },
    {
      q: "In 2026, an individual sold business land held 6 years at a $25,000 loss and sold a business building held 10 years (depreciated straight-line) at a $10,000 gain. There were no other property transactions. How is the net result treated?",
      ja: "2026年に個人が6年間保有した事業用土地を$25,000の損失で売却し、10年間保有した事業用建物(定額法で償却)を$10,000の利得で売却した。その他の資産取引はない。純結果はどのように扱われるか。",
      c: [
        "$25,000 ordinary loss and $10,000 long-term capital gain",
        "$15,000 long-term capital loss, of which $3,000 is deductible",
        "$15,000 ordinary loss",
        "$15,000 ordinary loss, limited to $3,000 per year",
      ],
      a: 2,
      ex: "§1231資産の損益を相殺すると純§1231損失15,000となり、全額通常損失として控除できる(キャピタルロスの3,000制限は適用されない)。定額法で償却した建物の利得も§1231の相殺に含まれる。",
    },
    {
      q: "A sole proprietor sold a machine held 4 years for $95,000. The machine cost $80,000, and $50,000 of MACRS depreciation had been claimed. What is the character of the gain?",
      ja: "個人事業主が4年間保有した機械を$95,000で売却した。機械の取得原価は$80,000で、MACRS減価償却費$50,000を計上済みである。利得の性質はどれか。",
      c: [
        "$50,000 ordinary income and $15,000 §1231 gain",
        "$65,000 ordinary income",
        "$65,000 §1231 gain",
        "$15,000 ordinary income and $50,000 §1231 gain",
      ],
      a: 0,
      ex: "調整後取得価額 = 80,000 − 50,000 = 30,000、利得 = 95,000 − 30,000 = 65,000。§1245により減価償却累計額50,000(利得の範囲内)が通常所得として取り戻され、取得原価を超える15,000は§1231利得となる。",
    },
    {
      q: "A C corporation sold a warehouse held 12 years for $450,000. The warehouse cost $500,000, and straight-line depreciation of $200,000 had been claimed. Ignore land. How much of the gain is ordinary income under §291?",
      ja: "C法人が12年間保有した倉庫を$450,000で売却した。倉庫の取得原価は$500,000で、定額法による減価償却費$200,000を計上済みである。土地は無視する。利得のうち§291により通常所得となる金額はいくらか。",
      c: ["$0", "$40,000", "$30,000", "$150,000"],
      a: 2,
      ex: "利得 = 450,000 − (500,000 − 200,000) = 150,000。法人は§291により、減価償却累計額200,000と利得150,000のいずれか少ない方の20%(30,000)を通常所得とする。残り120,000は§1231利得。$40,000は減価償却累計額全額に20%を掛けた誤り。",
    },
    {
      q: "An individual sold a residential rental building held 9 years for $325,000. The building cost $300,000, and straight-line depreciation of $45,000 had been claimed. Ignore land. How is the $70,000 gain characterized?",
      ja: "個人が9年間保有した居住用賃貸建物を$325,000で売却した。建物の取得原価は$300,000で、定額法による減価償却費$45,000を計上済みである。土地は無視する。利得$70,000の性質はどれか。",
      c: [
        "$45,000 ordinary income and $25,000 §1231 gain",
        "$9,000 ordinary income and $61,000 §1231 gain",
        "$70,000 §1231 gain taxed entirely at a maximum 25% rate",
        "$0 ordinary income; $45,000 unrecaptured §1250 gain and $25,000 other §1231 gain",
      ],
      a: 3,
      ex: "定額法で償却した不動産には§1250の通常所得の取戻しはない(加速償却超過額がゼロ)。減価償却累計額45,000は未回収§1250利得(最高25%)、残り25,000は通常の長期優遇税率の対象となる§1231利得。$45,000の通常所得は§1245を誤適用したもの、$9,000は法人の§291(20%)と混同したもの。",
    },
    {
      q: "A sole proprietor bought equipment for $30,000 and sold it 10 months later for $32,000 after claiming $6,000 of depreciation. What is the character of the $8,000 gain?",
      ja: "個人事業主が設備を$30,000で購入し、減価償却費$6,000を計上した後、10か月後に$32,000で売却した。利得$8,000の性質はどれか。",
      c: [
        "$6,000 ordinary income and $2,000 §1231 gain",
        "$8,000 ordinary income",
        "$8,000 short-term capital gain",
        "$6,000 ordinary income and $2,000 short-term capital gain",
      ],
      a: 1,
      ex: "事業用資産は資本資産ではなく、保有期間1年以下のため§1231資産にも該当しない。したがって利得8,000は全額通常所得となる。§1231利得とする選択肢は保有期間要件(1年超)を見落としている。",
    },
    {
      q: "Ann exchanges an office building held for investment (adjusted basis $300,000; fair market value $500,000) that is subject to a $120,000 mortgage for an apartment building held for investment with a fair market value of $380,000 and no liability. The other party assumes Ann's mortgage. What is Ann's recognized gain?",
      ja: "Annは、$120,000の抵当借入金が付いた投資用オフィスビル(調整後取得価額$300,000、公正市場価値$500,000)を、公正市場価値$380,000で債務のない投資用アパートと交換した。相手方はAnnの抵当借入金を引き受けた。Annの認識利得はいくらか。",
      c: ["$0", "$120,000", "$200,000", "$80,000"],
      a: 1,
      ex: "実現利得 = (380,000 + 債務免除120,000) − 300,000 = 200,000。相手方に引き受けられた債務120,000はボート(現金受取と同じ)として扱われ、実現利得の範囲で認識する。認識利得 = 120,000。$0は債務免除をボートと認識しなかった誤り。",
    },
    {
      q: "Bob exchanges investment real estate (adjusted basis $200,000; fair market value $400,000) subject to a $150,000 mortgage for investment real estate with a fair market value of $350,000 subject to a $100,000 mortgage. Each party assumes the other's mortgage, and no other consideration changes hands. What is Bob's basis in the property received?",
      ja: "Bobは、$150,000の抵当借入金が付いた投資用不動産(調整後取得価額$200,000、公正市場価値$400,000)を、$100,000の抵当借入金が付いた公正市場価値$350,000の投資用不動産と交換した。各当事者は相手方の抵当借入金を引き受け、他の対価の授受はない。Bobが受け取った不動産の取得価額はいくらか。",
      c: ["$250,000", "$150,000", "$350,000", "$200,000"],
      a: 3,
      ex: "債務は相殺し、純債務免除150,000 − 100,000 = 50,000がボート。実現利得200,000のうち50,000を認識。取得価額 = 200,000 + 引受債務100,000 − 免除債務150,000 + 認識利得50,000 = 200,000(検算:350,000 − 繰延利得150,000)。$250,000は債務を相殺せずに計算した誤り。",
    },
    {
      q: "Carla exchanges investment land (adjusted basis $100,000; fair market value $300,000) subject to an $80,000 mortgage for investment land with a fair market value of $260,000 and no liability. The other party assumes the mortgage, and Carla also pays $40,000 cash. What is Carla's recognized gain?",
      ja: "Carlaは、$80,000の抵当借入金が付いた投資用土地(調整後取得価額$100,000、公正市場価値$300,000)を、公正市場価値$260,000で債務のない投資用土地と交換した。相手方は抵当借入金を引き受け、Carlaはさらに現金$40,000を支払った。Carlaの認識利得はいくらか。",
      c: ["$40,000", "$80,000", "$0", "$200,000"],
      a: 0,
      ex: "支払った現金(ボート交付)は免除された債務と相殺できる。純ボート受取 = 80,000 − 40,000 = 40,000。実現利得 = (260,000 + 80,000) − (100,000 + 40,000) = 200,000なので、認識利得は40,000。$80,000は現金支払による相殺を無視した誤り。",
    },
    {
      q: "In a qualifying like-kind exchange, Dev transfers investment land (adjusted basis $50,000; fair market value $80,000) plus publicly traded stock (adjusted basis $30,000; fair market value $20,000) and receives investment land worth $100,000. What gain or loss does Dev recognize?",
      ja: "同種交換の要件を満たす取引で、Devは投資用土地(調整後取得価額$50,000、公正市場価値$80,000)と上場株式(調整後取得価額$30,000、公正市場価値$20,000)を移転し、価値$100,000の投資用土地を受け取った。Devが認識する損益はいくらか。",
      c: ["$30,000 gain", "$20,000 gain", "$10,000 loss", "No gain or loss"],
      a: 2,
      ex: "同種資産以外の資産(ボート)を交付した場合、その資産の含み損益は認識される。株式の損失 = 20,000 − 30,000 = 10,000を認識し、土地の利得30,000は繰り延べる。$20,000の利得は土地と株式の損益を合算してしまった誤り。",
    },
    {
      q: "Eli exchanges investment land with an adjusted basis of $140,000 and a fair market value of $150,000 for investment land with a fair market value of $125,000 plus $25,000 cash. What is Eli's recognized gain and basis in the new land?",
      ja: "Eliは調整後取得価額$140,000、公正市場価値$150,000の投資用土地を、公正市場価値$125,000の投資用土地と現金$25,000と交換した。Eliの認識利得と新しい土地の取得価額はいくらか。",
      c: [
        "$25,000 gain; $140,000 basis",
        "$10,000 gain; $140,000 basis",
        "$0 gain; $115,000 basis",
        "$10,000 gain; $125,000 basis",
      ],
      a: 3,
      ex: "実現利得 = 150,000 − 140,000 = 10,000。ボート25,000と実現利得のいずれか少ない方(10,000)を認識する。取得価額 = 140,000 − 受取ボート25,000 + 認識利得10,000 = 125,000(繰延利得ゼロのためFMVと一致)。$25,000はボート全額を認識した誤り。",
    },
    {
      q: "In 2026, Fay exchanged investment land with her brother in a transaction that qualified under §1031, deferring a $60,000 realized gain. Fourteen months later, her brother sold the land he received from Fay to an unrelated buyer. Neither death nor an involuntary conversion was involved, and tax avoidance was a principal purpose. What is the tax consequence to Fay?",
      ja: "2026年、Fayは兄弟と投資用土地を交換し、§1031の要件を満たして実現利得$60,000を繰り延べた。14か月後、兄弟はFayから受け取った土地を第三者に売却した。死亡や強制収用ではなく、租税回避が主たる目的であった。Fayにとっての課税上の結果はどれか。",
      c: [
        "No consequence, because Fay still holds the property she received",
        "Fay recognizes the $60,000 deferred gain in the year her brother sells the land",
        "Fay must amend her 2026 return to recognize the $60,000 gain",
        "The brother's gain is reduced by $60,000",
      ],
      a: 1,
      ex: "関連者間の同種交換で、いずれかが2年以内に受け取った資産を処分すると、繰り延べた利得はその処分の年に認識される(当初年度の修正申告ではない)。死亡・強制収用・租税回避目的でない場合は例外となるが、本問は該当しない。",
    },
    {
      q: "On March 1, 2026, Gus transferred relinquished investment property to a qualified intermediary in a deferred like-kind exchange. By what date must Gus identify the replacement property?",
      ja: "2026年3月1日、Gusは繰延型の同種交換において譲渡資産(投資用不動産)を適格仲介人に移転した。Gusが交換取得資産を特定しなければならない期限はいつか。",
      c: ["March 31, 2026", "August 28, 2026", "April 15, 2026", "April 15, 2027"],
      a: 2,
      ex: "取得資産の特定期限は譲渡日から45日以内(3月の残り30日 + 4月15日 = 45日目)。取得の完了期限は180日以内(8月28日)または申告期限(延長含む)のいずれか早い日。8月28日は取得期限と混同した誤り。",
    },
    {
      q: "Hana, a calendar-year individual, transferred relinquished property in a deferred like-kind exchange on December 1, 2026, and timely identified replacement property. Her 2026 return is due April 15, 2027. If she does not extend her return, by what date must she receive the replacement property?",
      ja: "暦年課税の個人Hanaは、2026年12月1日に繰延型同種交換で譲渡資産を移転し、期限内に取得資産を特定した。2026年分の申告期限は2027年4月15日である。申告期限を延長しない場合、取得資産をいつまでに受け取らなければならないか。",
      c: ["May 30, 2027", "January 15, 2027", "December 31, 2026", "April 15, 2027"],
      a: 3,
      ex: "取得期限は譲渡日から180日(2027年5月30日)と譲渡年の申告期限(延長含む)のいずれか早い日。延長しなければ2027年4月15日が期限となる。延長すれば5月30日まで受け取れる。January 15は45日の特定期限と混同した誤り。",
    },
    {
      q: "A city condemned Ivy's business building (adjusted basis $200,000) and paid her a $320,000 award. Within the replacement period, she purchased a replacement building for $290,000 and elected §1033 deferral. What is Ivy's recognized gain and basis in the replacement building?",
      ja: "市がIvyの事業用建物(調整後取得価額$200,000)を収用し、補償金$320,000を支払った。彼女は代替期間内に代替建物を$290,000で購入し、§1033の繰延べを選択した。Ivyの認識利得と代替建物の取得価額はいくらか。",
      c: [
        "$30,000 gain; $200,000 basis",
        "$120,000 gain; $290,000 basis",
        "$0 gain; $170,000 basis",
        "$30,000 gain; $290,000 basis",
      ],
      a: 0,
      ex: "実現利得 = 320,000 − 200,000 = 120,000。再投資しなかった30,000(320,000 − 290,000)を認識する。取得価額 = 代替資産の取得原価290,000 − 繰延利得90,000 = 200,000。$290,000の取得価額は繰延利得を控除していない誤り。",
    },
    {
      q: "A fire destroyed Jae's business warehouse (not a condemnation) in 2026, and the insurance proceeds, which produced a realized gain, were received in 2026. Jae is a calendar-year taxpayer. To defer the gain under §1033, by what date must Jae acquire qualified replacement property?",
      ja: "2026年に火災でJaeの事業用倉庫が焼失し(収用ではない)、実現利得を生じる保険金を2026年に受け取った。Jaeは暦年課税の納税者である。§1033で利得を繰り延べるには、いつまでに代替資産を取得しなければならないか。",
      c: ["December 31, 2029", "December 31, 2027", "December 31, 2028", "180 days after the fire"],
      a: 2,
      ex: "災害等による強制転換の代替期間は、利得が実現した最初の課税年度末から2年(2028年12月31日)。3年(2029年)は事業用・投資用不動産が収用された場合の特則である。180日は同種交換の期限と混同した誤り。",
    },
    {
      q: "Business equipment with an adjusted basis of $40,000 was destroyed in a flood. Kim received $70,000 of insurance proceeds and spent $85,000 on similar replacement equipment within the replacement period, electing §1033. What is Kim's basis in the replacement equipment?",
      ja: "調整後取得価額$40,000の事業用設備が洪水で滅失した。Kimは保険金$70,000を受け取り、代替期間内に類似の代替設備に$85,000を支出し、§1033を選択した。Kimの代替設備の取得価額はいくらか。",
      c: ["$85,000", "$55,000", "$40,000", "$70,000"],
      a: 1,
      ex: "実現利得 = 70,000 − 40,000 = 30,000。保険金全額を再投資したため認識利得はゼロ。取得価額 = 取得原価85,000 − 繰延利得30,000 = 55,000。$40,000は追加支出15,000を加算しなかった誤りである。",
    },
    {
      q: "Lou sells investment real estate with an adjusted basis of $150,000 for $400,000. The buyer assumes Lou's $100,000 mortgage, pays $60,000 cash at closing, and gives a note for the balance payable in later years. There are no selling expenses. Using the installment method, what gain does Lou recognize in the year of sale?",
      ja: "Louは調整後取得価額$150,000の投資用不動産を$400,000で売却した。買主はLouの抵当借入金$100,000を引き受け、決済時に現金$60,000を支払い、残額は翌年以降支払の手形とした。売却費用はない。割賦基準を用いた場合、Louが売却年度に認識する利得はいくらか。",
      c: ["$37,500", "$60,000", "$15,000", "$50,000"],
      a: 3,
      ex: "総利益 = 400,000 − 150,000 = 250,000。契約価額 = 400,000 − 引受債務100,000 = 300,000(債務が取得価額以下のため)。総利益率 = 250,000 ÷ 300,000 = 83.33%。認識利得 = 60,000 × 83.33% = 50,000。$37,500は売却価額を分母にした誤り(62.5%)。",
    },
    {
      q: "Mia sells business equipment (cost $100,000; accumulated depreciation $40,000) for $90,000. She receives $30,000 in the year of sale and a note for $60,000 payable next year. How much gain must Mia recognize in the year of sale?",
      ja: "Miaは事業用設備(取得原価$100,000、減価償却累計額$40,000)を$90,000で売却した。売却年度に$30,000を受け取り、残り$60,000は翌年支払の手形とした。Miaが売却年度に認識すべき利得はいくらか。",
      c: ["$10,000", "$30,000", "$0", "$40,000"],
      a: 1,
      ex: "利得 = 90,000 − 60,000 = 30,000で、減価償却累計額40,000の範囲内なので全額§1245の取戻し(通常所得)となる。減価償却の取戻し部分は割賦基準を使えず売却年度に全額認識する。$10,000は総利益率1/3を受取額に掛けた誤り。",
    },
    {
      q: "Nina, an investor, sells publicly traded stock with a basis of $30,000 to a friend for $90,000. The friend pays $10,000 at the time of sale and the remaining $80,000 the following year. What gain does Nina recognize in the year of sale?",
      ja: "投資家のNinaは、取得価額$30,000の上場株式を友人に$90,000で売却した。友人は売却時に$10,000を支払い、残り$80,000を翌年に支払う。Ninaが売却年度に認識する利得はいくらか。",
      c: ["$6,667", "$10,000", "$60,000", "$0"],
      a: 2,
      ex: "上場株式など公開市場で取引される証券の売却には割賦基準を適用できないため、売却年度に利得全額60,000(90,000 − 30,000)を認識する。$6,667は割賦基準(総利益率2/3 × 10,000)を誤適用した数値である。",
    },
    {
      q: "Olga sold stock with a basis of $50,000 to her son for its fair market value of $35,000. Two years later, the son sold the stock to an unrelated party for $30,000. What loss does the son recognize?",
      ja: "Olgaは取得価額$50,000の株式を息子に公正市場価値$35,000で売却した。2年後、息子はこの株式を第三者に$30,000で売却した。息子が認識する損失はいくらか。",
      c: ["$5,000", "$20,000", "$15,000", "$0"],
      a: 0,
      ex: "§267により親族間売却のOlgaの損失15,000は否認される。息子の取得価額は購入価額35,000で、売却損5,000を認識する。否認された損失は息子の利得を減額する場合にのみ使え、損失を増やすことはできない。$20,000は否認損失を加算した誤り。",
    },
    {
      q: "Pam owns 40% of the stock of Zeta Corp., and her husband owns 20%. The remaining stock is owned by unrelated parties. Pam sells land held for investment to Zeta Corp. at its fair market value, realizing a $12,000 loss. How much loss may Pam recognize?",
      ja: "PamはZeta社の株式の40%を、夫は20%を所有している。残りは無関係者が所有する。Pamは投資用土地を公正市場価値でZeta社に売却し、$12,000の損失が実現した。Pamが認識できる損失はいくらか。",
      c: ["$12,000", "$7,200", "$4,800", "$0"],
      a: 3,
      ex: "§267では配偶者の持分もみなし所有されるため、Pamの持分は40% + 20% = 60%となり50%超で関連者に該当する。損失12,000は全額否認される。$7,200は持分割合で按分した誤りである。",
    },
    {
      q: "A sole proprietor sold business equipment held 3 years for $40,000. The equipment cost $80,000, and $50,000 of depreciation had been claimed. What is the character of the gain?",
      ja: "個人事業主が3年間保有した事業用設備を$40,000で売却した。設備の取得原価は$80,000で、減価償却費$50,000を計上済みである。利得の性質はどれか。",
      c: [
        "$10,000 §1231 gain",
        "$10,000 ordinary income",
        "$50,000 ordinary income and $40,000 §1231 loss",
        "$10,000 long-term capital gain",
      ],
      a: 1,
      ex: "調整後取得価額 = 80,000 − 50,000 = 30,000、利得 = 40,000 − 30,000 = 10,000。§1245の取戻しは減価償却累計額50,000と利得10,000のいずれか少ない方なので、利得全額10,000が通常所得となる。§1231利得とするのは取戻しを見落とした誤り。",
    },
    {
      q: "Quinn, a single taxpayer, acquired qualifying §1244 stock at original issuance for $90,000. In 2026 the stock became worthless after being held 4 years. Quinn had no other capital gains or losses. Assume the §1244 ordinary loss limit is $50,000 for a single taxpayer. What total amount may Quinn deduct in 2026?",
      ja: "独身の納税者Quinnは、要件を満たす§1244株式を当初発行時に$90,000で取得した。2026年、4年間保有したこの株式が無価値となった。Quinnにその他のキャピタルゲイン・ロスはない。独身者の§1244通常損失限度額は$50,000とする。Quinnが2026年に控除できる合計額はいくらか。",
      c: ["$90,000", "$50,000", "$53,000", "$3,000"],
      a: 2,
      ex: "§1244により50,000までは通常損失として全額控除できる。超過分40,000は長期キャピタルロスとなり、他のキャピタルゲインがないため3,000のみ控除(37,000は繰越)。合計 = 50,000 + 3,000 = 53,000。$50,000はキャピタルロス部分の3,000控除を見落とした誤り。",
    },
    {
      q: "Ray purchased stock of a qualifying small business corporation for $30,000 from its founding shareholder, who had acquired it at original issuance under §1244. Three years later, the stock became worthless. How should Ray treat the $30,000 loss?",
      ja: "Rayは、§1244に基づき当初発行時に株式を取得した創業株主から、適格小規模事業法人の株式を$30,000で購入した。3年後、この株式は無価値となった。Rayは$30,000の損失をどのように扱うべきか。",
      c: [
        "$30,000 long-term capital loss",
        "$30,000 ordinary loss under §1244",
        "$30,000 short-term capital loss",
        "No loss is deductible until the corporation is liquidated",
      ],
      a: 0,
      ex: "§1244の通常損失は、法人から当初発行時に株式を取得した個人(またはパートナーシップ)のみが適用できる。他の株主から購入したRayは適用できず、3年保有の資本資産として長期キャピタルロスとなる。",
    },
    {
      q: "In 2018, Sara acquired stock at original issuance from a domestic C corporation that met all of the qualified small business stock requirements of §1202. She sold the stock in 2026 for a $2,000,000 gain. Assume the stock qualifies for the 100% exclusion applicable to stock acquired after September 27, 2010, and that the per-issuer limit is the greater of $10,000,000 or 10 times her basis. How much of the gain is excluded from gross income?",
      ja: "2018年、Saraは§1202の適格小規模事業株式の要件をすべて満たす内国C法人から当初発行時に株式を取得した。彼女は2026年にこの株式を売却し、$2,000,000の利得を得た。この株式は2010年9月27日後に取得した株式に適用される100%除外の対象であり、発行法人ごとの限度額は$10,000,000と取得価額の10倍のいずれか大きい方とする。利得のうち総所得から除外される金額はいくらか。",
      c: ["$1,000,000", "$0", "$1,500,000", "$2,000,000"],
      a: 3,
      ex: "5年超保有の適格小規模事業株式で100%除外が適用され、利得2,000,000は限度額10,000,000以内のため全額除外される。$1,000,000は当初の50%除外率を適用した誤りである。",
    },
    {
      q: "On October 1, 2025, Tom purchased stock for $10,000 as an investment. On March 1, 2026, the issuing corporation went bankrupt and the stock became completely worthless. Tom is a calendar-year taxpayer. How is the loss treated?",
      ja: "2025年10月1日、Tomは投資目的で株式を$10,000で購入した。2026年3月1日、発行法人が破綻し、株式は完全に無価値となった。Tomは暦年課税の納税者である。損失はどのように扱われるか。",
      c: [
        "$10,000 short-term capital loss in 2026",
        "$10,000 ordinary loss in 2026",
        "$10,000 long-term capital loss in 2026",
        "No deduction until the stock is sold",
      ],
      a: 2,
      ex: "無価値となった有価証券は、無価値となった年度の最終日(2026年12月31日)に売却したものとみなされる。保有期間は2025年10月1日から2026年12月31日で1年超のため長期キャピタルロスとなる。短期とするのは実際に無価値となった3月1日で判定した誤り。",
    },
    {
      q: "In 2024, Uma loaned $8,000 to a friend for the friend's personal use. In 2026, the debt became totally worthless. Uma had no other capital gains or losses in 2026. What is the effect on Uma's 2026 return?",
      ja: "2024年、Umaは友人の個人的な用途のために$8,000を貸し付けた。2026年、この債権は完全に回収不能となった。Umaには2026年にその他のキャピタルゲイン・ロスはない。Umaの2026年の申告への影響はどれか。",
      c: [
        "$8,000 ordinary deduction",
        "$3,000 deduction and $5,000 short-term capital loss carryover",
        "$3,000 deduction and $5,000 long-term capital loss carryover",
        "No deduction, because personal loans are never deductible",
      ],
      a: 1,
      ex: "非事業上の貸倒れは保有期間にかかわらず短期キャピタルロスとして扱う。他のゲインがないため3,000を控除し、5,000を短期キャピタルロスとして繰り越す。長期とするのは貸付期間で判定した誤り。",
    },
    {
      q: "Vic loaned $10,000 to his neighbor (a nonbusiness loan). In 2026, Vic determined that 60% of the loan was uncollectible, and in 2027 the remaining balance became totally worthless with nothing collected. How much may Vic deduct for 2026?",
      ja: "Vicは隣人に$10,000を貸し付けた(非事業上の貸付)。2026年、Vicは貸付金の60%が回収不能と判断し、2027年に残額を含め何も回収できず完全に無価値となった。Vicが2026年に控除できる金額はいくらか。",
      c: ["$0", "$6,000 short-term capital loss", "$6,000 ordinary loss", "$3,000 ordinary loss"],
      a: 0,
      ex: "非事業上の債権は完全に無価値となった年度にのみ控除でき、部分的な貸倒れは控除できない。2026年の控除はゼロで、2027年に10,000の短期キャピタルロスを計上する。部分貸倒れの控除が認められるのは事業上の債権である。",
    },
    {
      q: "A calendar-year business placed the following 7-year MACRS property in service in 2026 (no §179 or bonus depreciation): $20,000 in February and $50,000 in November. The applicable first-year mid-quarter rates for 7-year property are 25.00% (first quarter) and 3.57% (fourth quarter); the half-year rate is 14.29%. What is the 2026 MACRS depreciation?",
      ja: "暦年課税の事業者が2026年に次の7年MACRS資産を事業の用に供した(§179・ボーナス償却なし)。2月に$20,000、11月に$50,000。7年資産の初年度ミッドクォーター償却率は第1四半期25.00%、第4四半期3.57%、ハーフイヤー償却率は14.29%である。2026年のMACRS減価償却費はいくらか。",
      c: ["$10,003", "$6,785", "$5,000", "$12,500"],
      a: 1,
      ex: "第4四半期の取得額50,000が年間合計70,000の40%超(71%)のため、ミッドクォーター・コンベンションを適用する。20,000 × 25.00% + 50,000 × 3.57% = 5,000 + 1,785 = 6,785。$10,003はハーフイヤー・コンベンション(70,000 × 14.29%)を適用した誤り。",
    },
    {
      q: "On April 10, 2026, a calendar-year business placed in service a commercial office building (nonresidential real property) costing $390,000, excluding land. Using MACRS straight-line over 39 years, what is the 2026 depreciation?",
      ja: "2026年4月10日、暦年課税の事業者が取得原価$390,000(土地を除く)の商業用オフィスビル(非居住用不動産)を事業の用に供した。MACRSの39年定額法を用いた場合、2026年の減価償却費はいくらか。",
      c: ["$10,000", "$7,500", "$5,000", "$7,083"],
      a: 3,
      ex: "不動産にはミッドマンス・コンベンションを適用する。年間償却費 = 390,000 ÷ 39 = 10,000。4月は月の中央から供用とみなし8.5か月分:10,000 × 8.5/12 = 7,083。$7,500は4月1日から9か月分とした誤り、$5,000はハーフイヤーを誤適用したもの。",
    },
    {
      q: "A calendar-year landlord sold a residential rental building in March of its fifth year of service. The building's depreciable basis is $275,000, and it is depreciated straight-line over 27.5 years. What depreciation is allowed for the year of sale?",
      ja: "暦年課税の賃貸人が、供用5年目の3月に居住用賃貸建物を売却した。建物の償却基礎額は$275,000で、27.5年の定額法で償却している。売却年度に認められる減価償却費はいくらか。",
      c: ["$2,083", "$2,500", "$0", "$5,000"],
      a: 0,
      ex: "処分年度もミッドマンス・コンベンションを適用し、3月の中央まで(1月・2月 + 0.5か月 = 2.5か月)償却する。10,000 × 2.5/12 = 2,083。$2,500は3月末までの3か月分とした誤り、$0は売却年度の償却を認めない誤り。",
    },
    {
      q: "In 2026, a sole proprietor placed in service $200,000 of equipment eligible for §179 and elected to expense the maximum amount. Taxable income from the active conduct of the business before the §179 deduction was $120,000. Assume the §179 dollar limit is $2,560,000 and the phase-out threshold is $4,090,000. What is the 2026 §179 deduction and the carryover?",
      ja: "2026年、個人事業主が§179の対象となる設備$200,000を事業の用に供し、最大額の即時償却を選択した。§179控除前の能動的事業からの課税所得は$120,000であった。§179の限度額は$2,560,000、段階的縮小の開始額は$4,090,000とする。2026年の§179控除額と繰越額はいくらか。",
      c: [
        "$200,000 deduction; no carryover",
        "$120,000 deduction; no carryover",
        "$120,000 deduction; $80,000 carryover",
        "$0 deduction; $200,000 carryover",
      ],
      a: 2,
      ex: "§179控除は能動的事業からの課税所得(120,000)を上限とし、損失を生じさせることはできない。超過分80,000は翌年以降に繰り越せる。$200,000とするのは所得制限を見落とした誤りである。",
    },
    {
      q: "In 2026, a business placed in service $4,260,000 of §179 property. Assume the §179 dollar limit is $2,560,000 and the investment phase-out threshold is $4,090,000. What is the maximum §179 deduction available (before the taxable income limitation)?",
      ja: "2026年、事業者が§179対象資産$4,260,000を事業の用に供した。§179の限度額は$2,560,000、投資額による段階的縮小の開始額は$4,090,000とする。課税所得制限を考慮する前の§179控除の最大額はいくらか。",
      c: ["$2,560,000", "$170,000", "$2,730,000", "$2,390,000"],
      a: 3,
      ex: "取得額が開始額を超えた分だけ限度額を1ドルずつ減額する。超過額 = 4,260,000 − 4,090,000 = 170,000、最大控除額 = 2,560,000 − 170,000 = 2,390,000(OBBBAにより2025年以降の限度額は$2,500,000・開始額$4,000,000をベースにインフレ調整)。$170,000は減額分そのものである。",
    },
    {
      q: "A calendar-year business placed in service 7-year MACRS equipment costing $100,000 in June 2026. The equipment was acquired under a binding written contract entered into in 2024, so it is not eligible for the 100% bonus rate for property acquired after January 19, 2025; bonus depreciation of 20% applies. The business does not elect §179 and does not elect out of bonus depreciation. The first-year half-year MACRS rate for 7-year property is 14.29%. What is the total 2026 depreciation?",
      ja: "暦年課税の事業者が2026年6月に取得原価$100,000の7年MACRS設備を事業の用に供した。この設備は2024年に締結した書面による拘束力ある契約に基づき取得したため、2025年1月19日後取得資産の100%ボーナス償却の対象外であり、20%のボーナス償却が適用される。§179は選択せず、ボーナス償却の不適用選択もしない。7年資産の初年度ハーフイヤー償却率は14.29%とする。2026年の減価償却費合計はいくらか。",
      c: ["$20,000", "$34,290", "$31,432", "$14,290"],
      a: 2,
      ex: "ボーナス償却 = 100,000 × 20% = 20,000。残りの基礎額80,000にMACRSを適用:80,000 × 14.29% = 11,432。合計 = 31,432。$34,290はボーナス控除前の取得原価全額にMACRS率を掛けた誤り。なお2025年1月19日後に取得した資産はOBBBAにより100%ボーナス償却となる。",
    },
    {
      q: "A business placed in service $500,000 of 5-year MACRS equipment in 2026 and elected a $100,000 §179 deduction (within all limits). The equipment was acquired under a binding written contract entered into in 2024, so 20% bonus depreciation (not the 100% rate for property acquired after January 19, 2025) applies. The first-year half-year MACRS rate for 5-year property is 20%. What is the total 2026 cost recovery?",
      ja: "事業者が2026年に5年MACRS設備$500,000を事業の用に供し、§179控除$100,000を選択した(すべての制限内)。この設備は2024年に締結した書面による拘束力ある契約に基づき取得したため、(2025年1月19日後取得資産の100%ではなく)20%のボーナス償却が適用される。5年資産の初年度ハーフイヤー償却率は20%とする。2026年の費用回収額の合計はいくらか。",
      c: ["$244,000", "$180,000", "$200,000", "$260,000"],
      a: 0,
      ex: "順序は§179 → ボーナス → MACRS。§179 100,000、ボーナス = (500,000 − 100,000) × 20% = 80,000、MACRS = 320,000 × 20% = 64,000。合計 = 244,000。$180,000はMACRSを計上しなかった誤り、$260,000はボーナスを§179控除前の金額に適用した誤り(100,000 + 500,000 × 20% + 300,000 × 20%)。",
    },
    {
      q: "On October 1, 2026, a calendar-year business purchased all the assets of another business, paying $60,000 for the seller's 4-year covenant not to compete. What is the 2026 amortization deduction for the covenant?",
      ja: "2026年10月1日、暦年課税の事業者が他の事業の資産を一括取得し、売主の4年間の競業避止契約に$60,000を支払った。2026年の競業避止契約の償却額はいくらか。",
      c: ["$3,750", "$4,000", "$1,000", "$15,000"],
      a: 2,
      ex: "事業の取得に関連する競業避止契約は§197無形資産であり、契約期間にかかわらず取得月から15年(180か月)で償却する。60,000 ÷ 180 × 3か月 = 1,000。$3,750は4年の契約期間で償却した誤り、$4,000は1年分の償却額である。",
    },
  ],
});

CPA.tbs({ id: "TBS-REG-25", section: "REG", chapter: "REG-04", title: "同種交換(ボート・債務の引受け)",
  scenario: `<p>Ortiz exchanged an office building held for investment for an apartment building to be held for investment in a transaction qualifying under §1031. Details:</p>
<table><tr><th></th><th>Relinquished (given)</th><th>Received</th></tr>
<tr><td>Fair market value</td><td>$700,000</td><td>$600,000</td></tr>
<tr><td>Ortiz's adjusted basis</td><td>$400,000</td><td>—</td></tr>
<tr><td>Mortgage on the property (assumed by the other party)</td><td>$250,000</td><td>$180,000</td></tr></table>
<p>In addition to the apartment building, Ortiz received <b>$30,000 cash</b>. Each party assumed the mortgage on the property it received. There were no exchange expenses.</p>
<p class="ja">Ortizは投資用オフィスビルを投資用アパートと交換し、§1031の要件を満たした。譲渡資産のFMV $700,000、Ortizの調整後取得価額$400,000、抵当借入金$250,000(相手方が引受け)。取得資産のFMV $600,000、抵当借入金$180,000(Ortizが引受け)。Ortizはアパートに加えて現金$30,000を受け取った。交換費用はない。</p>`,
  rows: [
    { label: "Realized gain(実現利得)", type: "num", answer: 300000 },
    { label: "Net liability relief treated as boot(ボートとなる純債務免除額)", type: "num", answer: 70000 },
    { label: "Total boot received(受取ボート合計)", type: "num", answer: 100000 },
    { label: "Recognized gain(認識利得)", type: "num", answer: 100000 },
    { label: "Deferred gain(繰延利得)", type: "num", answer: 200000 },
    { label: "Basis of the apartment building received(取得したアパートの取得価額)", type: "num", answer: 400000 },
  ],
  explain: `<p>実現利得:受取対価 = 600,000 + 現金30,000 + 免除債務250,000 = 880,000。差引:取得価額400,000 + 引受債務180,000 = 580,000。実現利得 = 300,000(検算:FMV 700,000 − 400,000)。</p>
<p>債務は相殺する:250,000 − 180,000 = 純債務免除70,000(ボート)。受取現金30,000は引受債務と相殺できないため加算し、ボート合計100,000。</p>
<p>認識利得 = 実現利得300,000とボート100,000のいずれか少ない方 = 100,000。繰延利得 = 200,000。</p>
<p>取得価額 = 400,000 + 引受債務180,000 + 認識利得100,000 − 現金30,000 − 免除債務250,000 = 400,000(検算:FMV 600,000 − 繰延利得200,000)。</p>`,
});

CPA.tbs({ id: "TBS-REG-26", section: "REG", chapter: "REG-04", title: "事業用資産売却の損益の性質(§1245・§1250・§1231)",
  scenario: `<p>Patel, a sole proprietor, sold the following assets in 2026. All assets had been held more than one year, depreciation was straight-line for the building, and Patel has no nonrecaptured net §1231 losses from prior years.</p>
<table><tr><th>Asset</th><th>Cost</th><th>Accumulated depreciation</th><th>Selling price</th></tr>
<tr><td>Machinery (business)</td><td>$120,000</td><td>$70,000</td><td>$85,000</td></tr>
<tr><td>Delivery truck (business)</td><td>$60,000</td><td>$45,000</td><td>$70,000</td></tr>
<tr><td>Commercial building (business)</td><td>$500,000</td><td>$120,000</td><td>$450,000</td></tr>
<tr><td>Land (business)</td><td>$100,000</td><td>—</td><td>$120,000</td></tr>
<tr><td>Stock (investment, held 3 years)</td><td>$15,000</td><td>—</td><td>$20,000</td></tr></table>
<p class="ja">個人事業主Patelは2026年に上表の資産を売却した。すべて保有期間1年超で、建物は定額法で償却しており、過去の未回収純§1231損失はない。</p>`,
  rows: [
    { label: "Total realized gain on all five sales(5件の実現利得合計)", type: "num", answer: 185000 },
    { label: "Ordinary income from §1245 recapture(§1245による通常所得)", type: "num", answer: 80000 },
    { label: "Net §1231 gain(純§1231利得)", type: "num", answer: 100000 },
    { label: "Unrecaptured §1250 gain taxed at a maximum 25% rate(最高25%の未回収§1250利得)", type: "num", answer: 70000 },
    { label: "Total long-term capital gain, including net §1231 gain(純§1231利得を含む長期キャピタルゲイン合計)", type: "num", answer: 105000 },
    { label: "Long-term gain eligible for the 0%/15%/20% rates(0%/15%/20%税率の対象となる長期利得)", type: "num", answer: 35000 },
  ],
  explain: `<p>機械:調整後取得価額50,000、利得35,000 → 減価償却累計額70,000の範囲内なので全額§1245の通常所得。</p>
<p>トラック:調整後取得価額15,000、利得55,000 → 45,000が§1245の通常所得、取得原価超過分10,000が§1231利得。</p>
<p>建物:調整後取得価額380,000、利得70,000 → 定額法のため個人には通常所得の取戻しなし。全額§1231利得で、減価償却累計額との少ない方70,000が未回収§1250利得(25%)。</p>
<p>土地:利得20,000(§1231)。株式:長期キャピタルゲイン5,000。</p>
<p>実現利得合計 = 35,000 + 55,000 + 70,000 + 20,000 + 5,000 = 185,000。通常所得 = 35,000 + 45,000 = 80,000。純§1231利得 = 10,000 + 70,000 + 20,000 = 100,000(過去損失がないため全額長期キャピタルゲイン)。長期キャピタルゲイン合計 = 100,000 + 5,000 = 105,000、うち25%区分70,000を除く35,000が0/15/20%区分。</p>`,
});

CPA.tbs({ id: "TBS-REG-27", section: "REG", chapter: "REG-04", title: "贈与・相続・ウォッシュセールによる取得価額",
  scenario: `<p>Reyes had the following property transactions. No alternate valuation applies unless stated.</p>
<ol>
<li><b>Gift A:</b> Reyes received stock as a gift. The donor's basis was $30,000 and the fair market value at the date of the gift was $22,000. No gift tax was paid. Reyes sold the stock for $18,000.</li>
<li><b>Gift B:</b> Reyes received land as a gift. The donor's basis was $50,000 and the fair market value at the date of the gift was $90,000. The taxable gift (after the annual exclusion) was $72,000, and the donor paid gift tax of $14,400.</li>
<li><b>Inheritance:</b> Reyes inherited a building from her uncle, whose basis was $60,000. The fair market value was $150,000 at the date of death and $140,000 six months later. The executor properly elected the alternate valuation date, and the building was distributed to Reyes 8 months after death. Reyes sold the building 2 months after it was distributed.</li>
<li><b>Wash sale:</b> Reyes sold 200 shares of Kappa Corp. with a basis of $24,000 for $15,000, and 10 days later purchased 200 shares of Kappa Corp. for $16,000.</li>
</ol>
<p class="ja">Reyesの資産取引:①贈与A:贈与者の取得価額$30,000、贈与時FMV $22,000の株式を受贈し(贈与税なし)、$18,000で売却。②贈与B:贈与者の取得価額$50,000、贈与時FMV $90,000の土地を受贈。課税贈与額$72,000、贈与者が贈与税$14,400を納付。③相続:叔父(取得価額$60,000)から建物を相続。死亡日FMV $150,000、6か月後$140,000。代替評価日を適法に選択し、死亡8か月後に分配、分配の2か月後に売却。④ウォッシュセール:取得価額$24,000のKappa社株200株を$15,000で売却し、10日後に200株を$16,000で購入。</p>`,
  rows: [
    { label: "Recognized loss on the sale of Gift A stock (enter as a positive number)(贈与A株式の認識損失:正の数で入力)", type: "num", answer: 4000 },
    { label: "Reyes's basis in the Gift B land(贈与B土地の取得価額)", type: "num", answer: 58000 },
    { label: "Reyes's basis in the inherited building(相続した建物の取得価額)", type: "num", answer: 140000 },
    { label: "Holding period of the inherited building when sold(売却時の相続建物の保有期間区分)", type: "select", options: ["Short-term", "Long-term"], answer: "Long-term" },
    { label: "Recognized loss on the sale of Kappa Corp. shares(Kappa社株売却の認識損失)", type: "num", answer: 0 },
    { label: "Basis of the 200 Kappa Corp. shares purchased(購入したKappa社株200株の取得価額)", type: "num", answer: 25000 },
  ],
  explain: `<p>贈与A:贈与時FMV(22,000)が贈与者の取得価額(30,000)を下回るため二重基準。売却額18,000はFMVを下回るので損失用基準22,000を用い、損失 = 22,000 − 18,000 = 4,000。</p>
<p>贈与B:値上がり益に対応する贈与税を加算する。14,400 × (90,000 − 50,000) ÷ 72,000 = 8,000。取得価額 = 50,000 + 8,000 = 58,000。</p>
<p>相続:代替評価日を選択し、6か月経過後に分配されたため6か月後の価値140,000(6か月以内に分配された場合は分配日の価値)。相続資産は常に長期保有として扱う。</p>
<p>ウォッシュセール:30日以内に同一株式を同数買い戻したため損失9,000は全額否認(認識損失0)。新株の取得価額 = 16,000 + 9,000 = 25,000。</p>`,
});
