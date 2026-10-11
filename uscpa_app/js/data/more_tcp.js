// TCP の追加問題(個人・事業体・信託/遺産の税務計画)

CPA.extend("TCP-01", {
  mcq: [
    {
      q: "Hiro gives $100,000 cash to his adult son. Hiro and his wife elect gift splitting. Assuming an annual exclusion of $19,000 per donee, what is the total amount of taxable gifts reported by the two spouses combined?",
      ja: "Hiroは成人した息子に現金$100,000を贈与した。Hiro夫妻は贈与の分割(gift splitting)を選択した。受贈者1人あたりの年間非課税枠を$19,000とすると、夫婦合計の課税贈与額はいくらか。",
      c: ["$81,000", "$62,000", "$50,000", "$100,000"],
      a: 1,
      ex: "分割により各配偶者が$50,000を贈与したとみなされ、各自$19,000の非課税枠を使える。(50,000 − 19,000) × 2 = $62,000。",
    },
    {
      q: "A transfer to an irrevocable trust that would otherwise be a gift of a future interest can qualify for the gift tax annual exclusion if the beneficiary has:",
      ja: "取消不能信託への移転は通常は将来権益の贈与となるが、受益者が何を持っていれば贈与税の年間非課税枠の対象となりうるか。",
      c: [
        "A remainder interest that vests at the grantor's death",
        "The right to receive trust income only after reaching age 30",
        "A temporary right to withdraw the contribution (a Crummey power)",
        "A testamentary power of appointment over the trust corpus",
      ],
      a: 2,
      ex: "受益者に拠出額を一定期間引き出せる権利(Crummey power)を与えると、現在権益の贈与として年間非課税枠を利用できる。残余権や遺言による指名権は将来権益のまま。",
    },
    {
      q: "A donor gives appreciated stock with a basis of $40,000 and a fair market value of $100,000. After the annual exclusion, the taxable gift is $80,000, and the donor pays $16,000 of gift tax. What is the donee's basis for gain?",
      ja: "贈与者は取得価額$40,000、時価$100,000の値上がり株式を贈与した。年間非課税枠控除後の課税贈与額は$80,000で、贈与者は贈与税$16,000を支払った。受贈者の利益計算上の取得価額はいくらか。",
      c: ["$40,000", "$56,000", "$100,000", "$52,000"],
      a: 3,
      ex: "値上がり益に対応する贈与税を加算する。16,000 × (100,000 − 40,000) ÷ 80,000 = 12,000。取得価額 = 40,000 + 12,000 = $52,000。",
    },
    {
      q: "An heir sells stock two months after inheriting it from a decedent, at a price above its fair market value at the date of death. The gain is:",
      ja: "相続人は被相続人から相続した株式を相続から2か月後に、死亡日の時価を上回る価格で売却した。この利益はどう扱われるか。",
      c: [
        "Long-term capital gain regardless of the actual holding period",
        "Short-term capital gain because the heir held it for less than one year",
        "Ordinary income",
        "Excluded from income",
      ],
      a: 0,
      ex: "相続財産は実際の保有期間に関係なく常に長期保有として扱われる。取得価額は原則として死亡日の時価。",
    },
    {
      q: "Mother gives appreciated land to her terminally ill son, who dies eight months later, leaving the land back to Mother. Mother's basis in the land is:",
      ja: "母は値上がりした土地を余命わずかな息子に贈与し、息子は8か月後に死亡して土地を母に遺贈した。母の土地の取得価額はどうなるか。",
      c: [
        "The fair market value at the son's death",
        "The son's adjusted basis immediately before death",
        "The fair market value at the date of the gift",
        "Zero",
      ],
      a: 1,
      ex: "死亡前1年以内に贈与された値上がり資産が贈与者(またはその配偶者)に戻る場合、時価への引上げ(step-up)は認められず、被相続人の死亡直前の取得価額を引き継ぐ(§1014(e))。",
    },
    {
      q: "A taxpayer has $30,000 of suspended passive losses from a rental building. In a fully taxable sale of the entire interest to an unrelated party, the taxpayer recognizes a $10,000 gain. How are the suspended losses treated?",
      ja: "納税者は賃貸建物について$30,000の繰越受動的損失を有する。非関連者に持分全部を完全課税取引で売却し、$10,000の利益を認識した。繰越受動的損失はどう扱われるか。",
      c: [
        "Only $10,000 is deductible, to the extent of the gain",
        "The losses remain suspended until the taxpayer has other passive income",
        "The losses are fully deductible against any type of income",
        "The losses are permanently disallowed",
      ],
      a: 2,
      ex: "受動的活動の持分全部を非関連者に完全課税で処分した場合、繰越損失$30,000はその年に全額(非受動的所得に対しても)控除できる。",
    },
    {
      q: "In Year 1, Sato invests $20,000 cash and signs a $50,000 nonrecourse note (not qualified nonrecourse financing) in an equipment leasing activity. Sato's share of the Year 1 loss is $35,000. Ignoring the passive activity rules, how much can Sato deduct in Year 1?",
      ja: "1年目、Satoは設備リース事業に現金$20,000を出資し、$50,000のノンリコース借入(適格ノンリコース融資ではない)に署名した。1年目の損失の持分は$35,000。受動的活動のルールを無視すると、1年目に控除できる額はいくらか。",
      c: ["$35,000", "$0", "$15,000", "$20,000"],
      a: 3,
      ex: "at-risk額は現金出資$20,000のみ(不動産以外のノンリコース借入は含まれない)。控除は$20,000、残り$15,000は翌年以降に繰越し。",
    },
    {
      q: "When an individual's share of a loss from a partnership is subject to several limitations, the limitations are applied in which order?",
      ja: "パートナーシップからの損失の持分に複数の制限がかかる場合、どの順序で適用されるか。",
      c: [
        "Passive activity, at-risk, tax basis",
        "Tax basis, at-risk, passive activity",
        "At-risk, tax basis, passive activity",
        "Tax basis, passive activity, at-risk",
      ],
      a: 1,
      ex: "まず持分の取得価額(basis)、次にat-risk額、その後に受動的活動の制限を適用する(さらにその後に超過事業損失の制限)。",
    },
    {
      q: "Which of the following, by itself, establishes material participation in a trade or business for passive activity purposes?",
      ja: "受動的活動の判定上、次のうちそれだけで事業への重要な関与(material participation)が認められるものはどれか。",
      c: [
        "Participating in the activity for more than 500 hours during the year",
        "Owning at least 10% of the activity",
        "Approving major capital expenditures as a limited partner",
        "Participating for 80 hours during the year while others participate more",
      ],
      a: 0,
      ex: "年間500時間超の関与は重要な関与の代表的なテスト。所有割合や有限責任パートナーとしての承認行為だけでは足りない。",
    },
    {
      q: "Which itemized deduction allowed for regular tax purposes is NOT allowed in computing alternative minimum taxable income?",
      ja: "通常の税計算で認められる項目別控除のうち、AMT課税所得の計算では認められないものはどれか。",
      c: [
        "Charitable contributions",
        "Qualified residence acquisition interest",
        "State and local income and property taxes",
        "Casualty losses from federally declared disasters",
      ],
      a: 2,
      ex: "州・地方税(SALT)の控除はAMTでは認められず、加算調整となる。寄附金や取得目的の住宅ローン利息はAMTでも控除できる。",
    },
    {
      q: "Interest on specified private activity bonds (other than those issued in 2009 or 2010) is:",
      ja: "特定私的活動債(2009年・2010年発行分を除く)の利息はどう扱われるか。",
      c: [
        "Taxable for both regular tax and AMT",
        "Excluded for regular tax but a tax preference item added back for AMT",
        "Excluded for both regular tax and AMT",
        "Taxable for regular tax but excluded for AMT",
      ],
      a: 1,
      ex: "特定私的活動債の利息は通常の税では非課税だが、AMTでは優遇項目(preference)として加算される。",
    },
    {
      q: "A taxpayer paid AMT in Year 1. The minimum tax credit carried to future years arises from AMT attributable to:",
      ja: "納税者は1年目にAMTを納付した。将来に繰り越せる最低税額控除(minimum tax credit)は、どの項目に起因するAMTから生じるか。",
      c: [
        "Exclusion items, such as disallowed state and local taxes",
        "All AMT adjustments and preferences equally",
        "Only the AMT exemption phase-out",
        "Deferral items, such as the bargain element on exercised ISOs",
      ],
      a: 3,
      ex: "最低税額控除は、タイミングの差(deferral items:ISOの行使益や減価償却の差など)によるAMTから生じる。SALTなど永久差異(exclusion items)からは生じない。",
    },
    {
      q: "A taxpayer fails to take a required minimum distribution (RMD) from a traditional IRA. Under current law, the excise tax on the shortfall is generally:",
      ja: "納税者が従来型IRAからの必要最低分配(RMD)を受け取らなかった。現行法で不足額に課される物品税は一般にいくらか。",
      c: [
        "50%, with no reduction for correction",
        "10%, regardless of when corrected",
        "25%, reduced to 10% if timely corrected",
        "6% per year until corrected",
      ],
      a: 2,
      ex: "SECURE 2.0法により、RMD不足額への物品税は25%、所定期間内に是正すれば10%に軽減される。",
    },
    {
      q: "A 45-year-old takes an early distribution to pay qualified higher education expenses. The 10% additional tax is waived if the distribution comes from:",
      ja: "45歳の者が適格高等教育費の支払いのために早期分配を受けた。10%の追加税が免除されるのは、どこからの分配の場合か。",
      c: [
        "An IRA, but not a 401(k) plan",
        "A 401(k) plan, but not an IRA",
        "Either an IRA or a 401(k) plan",
        "Neither an IRA nor a 401(k) plan",
      ],
      a: 0,
      ex: "適格高等教育費(および初回住宅購入)の例外はIRAにのみ適用され、401(k)等の適格雇用者プランには適用されない。",
    },
    {
      q: "Kenji's traditional IRA has a value of $100,000, which includes $20,000 of nondeductible contributions (basis). He has no other IRAs and takes a $10,000 distribution. How much of the distribution is taxable?",
      ja: "Kenjiの従来型IRAの残高は$100,000で、うち$20,000は控除されなかった拠出(basis)である。他にIRAはなく、$10,000の分配を受けた。課税される額はいくらか。",
      c: ["$10,000", "$0", "$8,000", "$2,000"],
      a: 2,
      ex: "按分ルール(pro rata)により非課税部分 = 10,000 × 20,000 ÷ 100,000 = 2,000。課税部分 = $8,000。",
    },
    {
      q: "An employee exercises ISOs for 1,000 shares at $20 per share when the market price is $50. More than two years after grant and one year after exercise, she sells the shares for $70 per share. For regular tax purposes, what does she recognize on the sale?",
      ja: "従業員はISOを行使し、時価$50のときに1株$20で1,000株を取得した。付与から2年超、行使から1年超経過後に1株$70で売却した。通常の税計算上、売却時に何を認識するか。",
      c: [
        "$20,000 long-term capital gain",
        "$30,000 ordinary income and $20,000 long-term capital gain",
        "$50,000 ordinary income",
        "$50,000 long-term capital gain",
      ],
      a: 3,
      ex: "保有要件を満たす適格処分では、売却額70,000 − 行使価格20,000 = $50,000 がすべて長期キャピタルゲイン。行使年の差額30,000はAMT調整のみ。",
    },
    {
      q: "An employee exercises nonqualified stock options (with no readily ascertainable value at grant) for 500 shares at $15 per share when the market price is $40. Two years later, the employee sells the shares for $35 per share. What is the capital gain or loss on the sale?",
      ja: "従業員は付与時に時価が容易に算定できない非適格ストック・オプション(NSO)を、時価$40のときに1株$15で500株行使した。2年後に1株$35で売却した。売却時のキャピタルゲイン(ロス)はいくらか。",
      c: ["$10,000 gain", "$2,500 loss", "$12,500 ordinary income", "$0"],
      a: 1,
      ex: "行使時に (40 − 15) × 500 = 12,500 を給与所得として認識し、株式の取得価額は1株$40。売却: (35 − 40) × 500 = $2,500 の長期キャピタルロス。",
    },
    {
      q: "An employee exercises ISOs and later makes a qualifying disposition of the shares. The employer's compensation deduction is:",
      ja: "従業員がISOを行使し、その後に保有要件を満たす適格処分を行った。雇用主の報酬費用の控除はどうなるか。",
      c: [
        "Equal to the bargain element at exercise",
        "Equal to the employee's gain on the sale",
        "Equal to the fair market value of the option at grant",
        "None",
      ],
      a: 3,
      ex: "ISOの適格処分では従業員に給与所得が生じないため、雇用主の控除もない。NSOでは従業員の給与所得と同額を雇用主が控除できる。",
    },
    {
      q: "A single taxpayer owned and used a home as a principal residence for 12 months and then sold it at a $300,000 gain because of a change in place of employment that qualifies for a reduced exclusion. How much gain may be excluded under §121?",
      ja: "単身の納税者は住宅を12か月間所有・主たる住居として使用し、軽減された除外が認められる転勤を理由に$300,000の利益で売却した。§121により除外できる利益はいくらか。",
      c: ["$0", "$250,000", "$125,000", "$150,000"],
      a: 2,
      ex: "要件期間24か月のうち12か月を満たしたので、上限$250,000 × 12/24 = $125,000 まで除外できる。",
    },
    {
      q: "A taxpayer sells a principal residence that qualifies for the full §121 exclusion at a $100,000 gain. She had claimed $8,000 of depreciation on a home office in the residence. How much gain must be recognized?",
      ja: "納税者は§121の全額除外要件を満たす主たる住居を$100,000の利益で売却した。住居内のホームオフィスについて$8,000の減価償却を計上していた。認識すべき利益はいくらか。",
      c: ["$8,000", "$0", "$92,000", "$100,000"],
      a: 0,
      ex: "1997年5月6日以降に計上した減価償却相当額は§121で除外できず、$8,000を(非回収§1250利益として)認識する。",
    },
    {
      q: "Which of the following children is subject to the kiddie tax on unearned income above the threshold?",
      ja: "次のうち、基準額を超える不労所得についてキディ・タックスの対象となる子はどれか。",
      c: [
        "A married 17-year-old who files a joint return",
        "A 22-year-old full-time student whose earned income does not exceed half of her support",
        "A 20-year-old who is not a student and works full time",
        "A 25-year-old full-time graduate student",
      ],
      a: 1,
      ex: "対象は年末時点で18歳未満、18歳(勤労所得が扶養費の半分以下)、または24歳未満のフルタイム学生(勤労所得が扶養費の半分以下)。共同申告する既婚者や24歳以上は対象外。",
    },
    {
      q: "An individual's prior-year AGI was $200,000, and prior-year tax was $40,000. Current-year tax is expected to be $60,000. What is the minimum total of timely estimated payments and withholding needed to avoid the underpayment penalty?",
      ja: "個人の前年AGIは$200,000、前年の税額は$40,000。当年の税額は$60,000と見込まれる。過少納付ペナルティを避けるのに必要な期限内の予定納税・源泉徴収の最低合計額はいくらか。",
      c: ["$40,000", "$54,000", "$60,000", "$44,000"],
      a: 3,
      ex: "当年税額の90%(54,000)と前年税額の100%(前年AGIが$150,000超なら110%)のいずれか少ない額。110% × 40,000 = $44,000 が最低額。",
    },
    {
      q: "For an individual, a net operating loss arising in a tax year beginning after 2020 (other than a farming loss) is generally:",
      ja: "個人について、2020年より後に開始する年度に生じた純事業損失(NOL、農業損失を除く)は一般にどう扱われるか。",
      c: [
        "Carried back 2 years and forward 20 years",
        "Carried forward indefinitely and deductible up to 80% of taxable income",
        "Carried back 5 years, then forward indefinitely",
        "Deductible in full against taxable income for 20 years",
      ],
      a: 1,
      ex: "現行法ではNOLの繰戻しは原則不可で、無期限に繰り越せる。ただし控除は各年の課税所得(NOL控除前)の80%が上限。",
    },
    {
      q: "In computing an individual's net operating loss, which of the following is NOT allowed?",
      ja: "個人のNOLを計算する際、次のうち認められないものはどれか。",
      c: [
        "Business expenses of a sole proprietorship",
        "A casualty loss of personal-use property in a federally declared disaster",
        "Nonbusiness deductions, such as the standard deduction, in excess of nonbusiness income",
        "Wages earned as an employee included in income",
      ],
      a: 2,
      ex: "NOL計算では、標準控除など非事業控除は非事業所得の範囲内でしか控除できない。災害による個人資産の損失は事業損失とみなされNOLに含められる。",
    },
  ],
});

CPA.extend("TCP-02", {
  mcq: [
    {
      q: "In a §351 exchange, Ito transfers land with a basis of $40,000 and a fair market value of $100,000 for stock worth $85,000 and $15,000 cash. What gain does Ito recognize?",
      ja: "§351の交換で、Itoは取得価額$40,000、時価$100,000の土地を移転し、時価$85,000の株式と現金$15,000を受け取った。Itoが認識する利益はいくらか。",
      c: ["$0", "$15,000", "$45,000", "$60,000"],
      a: 1,
      ex: "実現利益 60,000 とボート(現金)15,000 のいずれか少ない額 = $15,000 を認識する。",
    },
    {
      q: "Using the same facts (land basis $40,000, cash boot $15,000, gain recognized $15,000), what is the corporation's basis in the land?",
      ja: "同じ前提(土地の取得価額$40,000、現金ボート$15,000、認識利益$15,000)で、法人の土地の取得価額はいくらか。",
      c: ["$40,000", "$85,000", "$55,000", "$100,000"],
      a: 2,
      ex: "法人の取得価額 = 移転者の取得価額 40,000 + 移転者の認識利益 15,000 = $55,000(繰越取得価額)。",
    },
    {
      q: "In a §351 transfer, a shareholder contributes property with a basis of $30,000 and a fair market value of $120,000, subject to a $50,000 liability assumed by the corporation (no tax-avoidance purpose). What gain does the shareholder recognize?",
      ja: "§351の移転で、株主は取得価額$30,000、時価$120,000の資産を、法人が引き受ける$50,000の負債付きで出資した(租税回避目的なし)。株主が認識する利益はいくらか。",
      c: ["$20,000", "$0", "$50,000", "$90,000"],
      a: 0,
      ex: "§357(c):引き受けられた負債が移転資産の取得価額を超える部分は利益となる。50,000 − 30,000 = $20,000。",
    },
    {
      q: "If the principal purpose of having a corporation assume a liability in a §351 exchange is tax avoidance, then:",
      ja: "§351の交換で法人に負債を引き受けさせる主目的が租税回避である場合、どうなるか。",
      c: [
        "Only the liability in excess of basis is treated as boot",
        "The liability is ignored for all purposes",
        "The entire exchange is disqualified under §351",
        "All liabilities assumed are treated as boot",
      ],
      a: 3,
      ex: "§357(b):租税回避目的または事業目的がない場合、引き受けられた負債の全額がボート(現金)として扱われる。",
    },
    {
      q: "A transfers property worth $70,000 for 70% of a new corporation's stock, and B performs services worth $30,000 for the other 30%. Which is correct?",
      ja: "Aは時価$70,000の資産を新設法人の株式70%と交換し、Bは$30,000相当の役務提供で残り30%を取得した。正しいものはどれか。",
      c: [
        "Neither A nor B recognizes income because §351 applies",
        "A recognizes gain or loss on the property, and B recognizes $30,000 of ordinary income",
        "Only B recognizes income; A's transfer is tax-free",
        "A recognizes no gain, and B recognizes $30,000 of capital gain",
      ],
      a: 1,
      ex: "役務提供者は資産の移転者に含まれないため、資産移転者Aの持分は70%で80%支配要件を満たさず、Aは損益を認識する。Bは$30,000の通常所得。",
    },
    {
      q: "A C corporation has taxable income of $200,000, tax-exempt municipal interest of $10,000, federal income tax expense of $42,000, and a $6,000 net capital loss that was not deductible. What is current E&P?",
      ja: "C法人の課税所得は$200,000、非課税の地方債利息$10,000、連邦法人税$42,000、控除されなかった純キャピタルロス$6,000がある。当期E&Pはいくらか。",
      c: ["$168,000", "$200,000", "$152,000", "$162,000"],
      a: 3,
      ex: "200,000 + 10,000(非課税利息)− 42,000(連邦税)− 6,000(控除不可の資本損失)= $162,000。",
    },
    {
      q: "A corporation has accumulated E&P of $40,000 at the beginning of the year and a current-year E&P deficit of $(24,000), incurred evenly. It distributes $50,000 exactly halfway through the year. How much of the distribution is a dividend?",
      ja: "法人の期首累積E&Pは$40,000、当期E&Pは期中均等に発生した$(24,000)の欠損。期のちょうど中間に$50,000を分配した。配当となる額はいくらか。",
      c: ["$16,000", "$28,000", "$40,000", "$50,000"],
      a: 1,
      ex: "当期E&Pが欠損の場合、分配日までの按分額を累積E&Pから差し引く。40,000 − 24,000 × 1/2 = $28,000 が配当。",
    },
    {
      q: "A C corporation with ample E&P distributes property with a fair market value of $60,000 and an adjusted basis of $80,000 to a shareholder. What loss does the corporation recognize?",
      ja: "十分なE&PのあるC法人が、時価$60,000、取得価額$80,000の資産を株主に分配した。法人が認識する損失はいくらか。",
      c: ["$0", "$20,000", "$60,000", "$80,000"],
      a: 0,
      ex: "非清算分配では、法人は値上がり資産の利益は認識するが、値下がり資産の損失は認識しない(§311)。株主の配当額と取得価額は時価$60,000。",
    },
    {
      q: "A corporation with ample E&P distributes land (FMV $100,000; basis $30,000) subject to a $40,000 mortgage that the shareholder assumes. What is the amount of the distribution to the shareholder?",
      ja: "十分なE&Pのある法人が、株主が引き受ける$40,000の抵当付きの土地(時価$100,000、取得価額$30,000)を分配した。株主への分配額はいくらか。",
      c: ["$100,000", "$70,000", "$60,000", "$30,000"],
      a: 2,
      ex: "分配額 = 時価 100,000 − 株主が引き受けた負債 40,000 = $60,000。株主の土地の取得価額は時価$100,000。",
    },
    {
      q: "Shareholder K owns 60 of a corporation's 100 outstanding shares (no attribution). The corporation redeems 30 of K's shares. Is the redemption substantially disproportionate under §302(b)(2)?",
      ja: "株主Kは発行済株式100株のうち60株を保有している(みなし保有なし)。法人はKの株式30株を償還した。§302(b)(2)の実質的不均衡償還に該当するか。",
      c: [
        "No, because K still owns more than 40%",
        "No, because K's ownership decreased by only 30 shares",
        "Yes, because K's ownership falls below 50% and below 80% of the prior 60%",
        "Yes, because any redemption of 50% of a shareholder's shares qualifies",
      ],
      a: 2,
      ex: "償還後の持分 30 ÷ 70 = 42.9%。50%未満で、かつ償還前60%の80%(48%)未満なので要件を満たし、売却(交換)として扱われる。",
    },
    {
      q: "A parent corporation owns 100% of a subsidiary, which is completely liquidated under §332. The parent's basis in the assets received is:",
      ja: "親会社が100%所有する子会社を§332により完全清算した。親会社が受け取った資産の取得価額はどうなるか。",
      c: [
        "The fair market value of the assets",
        "The parent's basis in the subsidiary stock",
        "Zero",
        "The subsidiary's basis in the assets",
      ],
      a: 3,
      ex: "§332の清算では親会社は損益を認識せず、資産の取得価額は子会社の取得価額を引き継ぐ(§334(b))。",
    },
    {
      q: "A subsidiary that is 85% owned by its parent liquidates under §332, distributing appreciated property to both the parent and the 15% minority shareholders. The subsidiary recognizes gain on:",
      ja: "親会社が85%所有する子会社が§332により清算し、値上がり資産を親会社と15%の少数株主の両方に分配した。子会社が利益を認識するのはどれか。",
      c: [
        "Distributions to both the parent and minority shareholders",
        "Distributions to the minority shareholders only",
        "Distributions to the parent only",
        "Neither distribution",
      ],
      a: 1,
      ex: "§337により80%以上の親会社への分配では損益不認識。少数株主への分配は§336により利益を認識する(損失は認識不可)。",
    },
    {
      q: "To qualify as a Type B reorganization, the acquiring corporation must:",
      ja: "B型組織再編に該当するために、取得法人はどうしなければならないか。",
      c: [
        "Acquire substantially all of the target's assets for stock and cash",
        "Merge with the target under state law using any consideration",
        "Acquire the target's stock solely for its own voting stock and have control immediately after",
        "Acquire at least 50% of the target's stock for any form of consideration",
      ],
      a: 2,
      ex: "B型(株式交換型)は、取得法人の議決権株式のみを対価として対象会社株式を取得し、取得直後に80%以上の支配を有することが必要。",
    },
    {
      q: "In a tax-free reorganization, a shareholder exchanges target stock with a basis of $30,000 for acquirer stock worth $70,000 plus $10,000 cash. What gain does the shareholder recognize?",
      ja: "非課税の組織再編で、株主は取得価額$30,000の対象会社株式を、時価$70,000の取得法人株式と現金$10,000と交換した。株主が認識する利益はいくらか。",
      c: ["$10,000", "$0", "$40,000", "$50,000"],
      a: 0,
      ex: "実現利益 = 80,000 − 30,000 = 50,000。認識利益はボート10,000との少ない方 = $10,000。",
    },
    {
      q: "A partner contributes property with a basis of $40,000 and a fair market value of $90,000, subject to a $75,000 liability, for a one-third interest in a partnership. What gain does the partner recognize?",
      ja: "パートナーは取得価額$40,000、時価$90,000、$75,000の負債付きの資産を出資し、パートナーシップの3分の1の持分を得た。パートナーが認識する利益はいくらか。",
      c: ["$0", "$35,000", "$50,000", "$10,000"],
      a: 3,
      ex: "負債の純減少 = 75,000 − 75,000 × 1/3(25,000)= 50,000(みなし現金分配)。取得価額40,000を超える$10,000が利益。outside basis は0。",
    },
    {
      q: "A contributes land (basis $20,000; FMV $50,000) and B contributes $50,000 cash to form an equal partnership. The partnership later sells the land for $56,000. Under §704(c), how much of the gain is allocated to A?",
      ja: "Aは土地(取得価額$20,000、時価$50,000)、Bは現金$50,000を出資し、均等持分のパートナーシップを設立した。後に土地を$56,000で売却した。§704(c)により、Aに配分される利益はいくらか。",
      c: ["$18,000", "$36,000", "$33,000", "$30,000"],
      a: 2,
      ex: "利益36,000のうち出資前の含み益30,000はAに配分。残り6,000を均等に3,000ずつ。A = 30,000 + 3,000 = $33,000。",
    },
    {
      q: "In a liquidating distribution, a partner with an outside basis of $60,000 receives $10,000 cash, inventory with a partnership basis of $20,000, and land with a partnership basis of $15,000. What is the partner's basis in the land?",
      ja: "清算分配で、outside basis $60,000のパートナーが、現金$10,000、パートナーシップの取得価額$20,000の棚卸資産、同$15,000の土地を受け取った。パートナーの土地の取得価額はいくらか。",
      c: ["$15,000", "$30,000", "$40,000", "$50,000"],
      a: 1,
      ex: "清算分配では残りのbasisをすべて配分する。60,000 − 現金10,000 − 棚卸資産20,000 = $30,000 を土地に配分(損失は認識しない)。",
    },
    {
      q: "Mori buys a 25% partnership interest for $100,000 when her share of the partnership's inside basis is $70,000. If the partnership has a §754 election in effect, the §743(b) basis adjustment for Mori is:",
      ja: "Moriはパートナーシップ持分25%を$100,000で購入した。パートナーシップの資産の簿価(inside basis)に対する彼女の持分は$70,000。§754選択が有効な場合、Moriに対する§743(b)の調整額はいくらか。",
      c: ["$30,000 increase", "$25,000 increase", "$0", "$30,000 decrease"],
      a: 0,
      ex: "購入価額(outside basis)100,000 − inside basis の持分 70,000 = $30,000 の増額調整。Moriだけに適用される。",
    },
    {
      q: "A C corporation converts to an S corporation when an asset has a basis of $60,000 and an FMV of $100,000. In Year 3 of the recognition period, the S corporation sells the asset for $110,000. Assuming the taxable income and net unrealized built-in gain limits do not apply, the built-in gains tax at 21% is:",
      ja: "C法人がS法人に転換した時点で、ある資産の取得価額は$60,000、時価$100,000だった。認識期間の3年目にS法人はこの資産を$110,000で売却した。課税所得や純未実現含み益による制限は適用されないとすると、21%の含み益課税(BIG tax)はいくらか。",
      c: ["$10,500", "$2,100", "$0", "$8,400"],
      a: 3,
      ex: "含み益は転換時点の 100,000 − 60,000 = 40,000 に限られる(転換後の値上がり10,000は対象外)。40,000 × 21% = $8,400。",
    },
    {
      q: "An S corporation with accumulated E&P from C years has an AAA balance of $30,000 and accumulated E&P of $20,000. It distributes $45,000 to its sole shareholder, whose stock basis is $100,000. How much is a taxable dividend?",
      ja: "C法人時代の累積E&PがあるS法人の AAA 残高は$30,000、累積E&Pは$20,000。株式の取得価額$100,000の唯一の株主に$45,000を分配した。課税される配当はいくらか。",
      c: ["$0", "$20,000", "$15,000", "$45,000"],
      a: 2,
      ex: "分配はまずAAA(30,000、basisの範囲で非課税)、次に累積E&P から配当となる。45,000 − 30,000 = $15,000 が配当。",
    },
    {
      q: "An S corporation that has accumulated C corporation E&P will have its S election terminated if it has passive investment income exceeding 25% of gross receipts for:",
      ja: "C法人時代の累積E&Pを有するS法人が、受動的投資所得が総収入の25%を超える状態がどれだけ続くとS法人の選択が終了するか。",
      c: [
        "Any single tax year",
        "Two consecutive tax years",
        "Three consecutive tax years",
        "Five of any ten tax years",
      ],
      a: 2,
      ex: "累積E&Pがあり、受動的投資所得が総収入の25%を超える年は超過受動所得税が課され、それが3年連続するとS選択が終了する。",
    },
    {
      q: "Under Public Law 86-272, a state may NOT impose a net income tax on an out-of-state corporation whose only in-state activity is:",
      ja: "Public Law 86-272のもとで、州外法人の州内での活動が次のみである場合、州は純所得税を課すことができない。その活動はどれか。",
      c: [
        "Solicitation of orders for tangible personal property, approved and shipped from outside the state",
        "Providing installation and repair services to customers",
        "Selling intangible property such as software licenses through in-state employees",
        "Maintaining an in-state warehouse of inventory",
      ],
      a: 0,
      ex: "P.L. 86-272は有形動産の注文の勧誘(州外で承認・州外から出荷)のみを保護する。役務提供・無形資産販売・州内の在庫保有は保護されない。",
    },
    {
      q: "A corporation's apportionment factors for State X are: property 30%, payroll 40%, and sales 50%. Using an equally weighted three-factor formula, how much of its $1,000,000 apportionable income is taxed by State X?",
      ja: "法人のX州の配分要素は、資産30%、給与40%、売上50%である。均等加重の3要素方式を用いると、配分対象所得$1,000,000のうちX州で課税されるのはいくらか。",
      c: ["$500,000", "$300,000", "$450,000", "$400,000"],
      a: 3,
      ex: "(30% + 40% + 50%) ÷ 3 = 40%。1,000,000 × 40% = $400,000。",
    },
    {
      q: "Absent an election, a domestic LLC with a single individual owner is classified for federal income tax purposes as:",
      ja: "選択をしない場合、個人1人が所有する国内LLCは連邦所得税上どのように分類されるか。",
      c: [
        "A C corporation",
        "A disregarded entity (taxed as a sole proprietorship)",
        "A partnership",
        "An S corporation",
      ],
      a: 1,
      ex: "チェック・ザ・ボックス規則により、単一所有者のLLCは原則として無視される事業体(個人事業として課税)。複数所有者なら原則パートナーシップ。",
    },
  ],
});

CPA.extend("TCP-03", {
  mcq: [
    {
      q: "Under a typical trust instrument and state law, capital gains realized by a trust that are allocated to corpus are:",
      ja: "一般的な信託証書と州法のもとで、信託が実現し元本(corpus)に配分されるキャピタルゲインはどう扱われるか。",
      c: [
        "Included in both fiduciary accounting income and DNI",
        "Included in fiduciary accounting income but excluded from DNI",
        "Excluded from fiduciary accounting income and generally excluded from DNI",
        "Taxed to the income beneficiary",
      ],
      a: 2,
      ex: "元本に配分されるキャピタルゲインは信託会計上の所得(FAI)に含まれず、DNIからも原則除外されるため、信託が課税される。",
    },
    {
      q: "A trust has dividends of $30,000, taxable interest of $10,000, tax-exempt interest of $5,000, capital gains allocated to corpus of $20,000, and deductible trustee fees of $4,000. What is DNI (including net tax-exempt income)?",
      ja: "信託には配当$30,000、課税利息$10,000、非課税利息$5,000、元本に配分されるキャピタルゲイン$20,000、控除可能な受託者報酬$4,000がある。DNI(純非課税所得を含む)はいくらか。",
      c: ["$61,000", "$45,000", "$36,000", "$41,000"],
      a: 3,
      ex: "DNI = 30,000 + 10,000 + 5,000 − 4,000 = $41,000。元本に配分されるキャピタルゲインは除外。",
    },
    {
      q: "A complex trust has DNI of $50,000, including $10,000 of net tax-exempt interest. It distributes $25,000 to a beneficiary. What is the trust's distribution deduction?",
      ja: "複合信託のDNIは$50,000で、うち$10,000は純非課税利息である。受益者に$25,000を分配した。信託の分配控除はいくらか。",
      c: ["$25,000", "$20,000", "$15,000", "$40,000"],
      a: 1,
      ex: "分配額とDNIの少ない方(25,000)から非課税部分を除く。25,000 × 40,000 ÷ 50,000 = $20,000。",
    },
    {
      q: "For federal income tax purposes, the personal exemption allowed to a decedent's estate is:",
      ja: "連邦所得税上、被相続人の遺産財団(estate)に認められる人的控除はいくらか。",
      c: ["$100", "$300", "$600", "None"],
      a: 2,
      ex: "人的控除は遺産財団$600、単純信託$300、複合信託$100(物価調整なしの固定額)。",
    },
    {
      q: "A trust that is required to distribute all of its income currently also distributes part of its corpus during the year. For that year, the trust is treated as:",
      ja: "当期の所得を全額分配することが求められている信託が、当期に元本の一部も分配した。その年度、信託はどのように扱われるか。",
      c: [
        "A simple trust",
        "A grantor trust",
        "An estate",
        "A complex trust",
      ],
      a: 3,
      ex: "単純信託は所得の全額分配が要件で、元本を分配した年度は複合信託として扱われる(人的控除も$100)。",
    },
    {
      q: "A trust has DNI of $30,000. It must distribute $20,000 of income to A (first tier) and makes a discretionary distribution of $30,000 to B (second tier). How much DNI is allocated to B?",
      ja: "信託のDNIは$30,000。Aへの所得$20,000の分配が義務付けられ(第1順位)、Bへ$30,000の任意分配(第2順位)を行った。Bに配分されるDNIはいくらか。",
      c: ["$10,000", "$18,000", "$30,000", "$0"],
      a: 0,
      ex: "DNIはまず第1順位のAへ20,000を配分し、残り 30,000 − 20,000 = $10,000 を第2順位のBに配分する。",
    },
    {
      q: "A grantor creates an irrevocable trust but retains, in a nonfiduciary capacity, the power to reacquire trust assets by substituting property of equal value. For income tax purposes, the trust is:",
      ja: "委託者は取消不能信託を設定したが、受託者としてではなく、同等価値の財産と差し替えて信託財産を取り戻す権限を保持した。所得税上、この信託はどう扱われるか。",
      c: [
        "A complex trust taxed on undistributed income",
        "A grantor trust, with income taxed to the grantor",
        "A simple trust whose income is taxed to the beneficiaries",
        "Exempt from income tax",
      ],
      a: 1,
      ex: "資産差替え権(swap power)は委託者信託の要件に該当し、信託の所得は委託者に課税される(遺産税上は信託財産を除外できる「意図的欠陥信託」に利用される)。",
    },
    {
      q: "A trust is treated as a grantor trust under §673 when the grantor holds a reversionary interest whose value at the inception of the trust exceeds:",
      ja: "§673により、委託者が保有する復帰権の信託設定時の価値がどれを超えると、その信託は委託者信託として扱われるか。",
      c: ["5% of the trust's value", "10% of the trust's value", "25% of the trust's value", "50% of the trust's value"],
      a: 0,
      ex: "委託者の復帰権の価値が設定時に信託財産の5%を超えると委託者信託となり、所得は委託者に課税される。",
    },
    {
      q: "The 65-day rule allows the fiduciary of a complex trust to elect to:",
      ja: "65日ルールにより、複合信託の受託者は何を選択できるか。",
      c: [
        "Extend the Form 1041 due date by 65 days",
        "Treat distributions made within 65 days after year-end as made in the prior year",
        "Defer DNI to the year after the distribution",
        "Treat capital gains as part of DNI",
      ],
      a: 1,
      ex: "年度末後65日以内の分配を前年度の分配とみなす選択ができ、前年度の分配控除とDNIの配分に反映される。",
    },
    {
      q: "For a calendar-year trust, Form 1041 is due on:",
      ja: "暦年の信託について、Form 1041 の申告期限はいつか。",
      c: ["March 15", "April 15", "May 15", "October 15"],
      a: 1,
      ex: "Form 1041 は年度終了後4か月目の15日が期限。暦年なら4月15日(5.5か月の延長が可能)。",
    },
    {
      q: "Which of the following may generally adopt a fiscal tax year rather than a calendar year?",
      ja: "次のうち、一般に暦年ではなく事業年度(fiscal year)を採用できるものはどれか。",
      c: [
        "A simple trust",
        "A complex trust",
        "A decedent's estate",
        "A grantor trust",
      ],
      a: 2,
      ex: "遺産財団は任意の事業年度を選択できるが、信託は原則として暦年を用いなければならない(一定の選択を除く)。",
    },
    {
      q: "A decedent and her spouse owned real property as joint tenants with right of survivorship (a qualified joint interest). The property is worth $800,000 at death. How much is included in the decedent's gross estate?",
      ja: "被相続人と配偶者は不動産を生存者権付き合有(適格共有持分)で所有していた。死亡時の時価は$800,000。被相続人の総遺産に含まれる額はいくらか。",
      c: ["$0", "$800,000", "The amount of the decedent's contribution", "$400,000"],
      a: 3,
      ex: "配偶者間の適格共有持分は、拠出割合に関係なく50%が総遺産に含まれる。800,000 × 50% = $400,000。",
    },
    {
      q: "A decedent owned property as joint tenants with right of survivorship with his brother. The decedent provided 75% of the purchase price. The property is worth $600,000 at death. How much is included in the gross estate?",
      ja: "被相続人は兄弟と生存者権付き合有で財産を所有していた。購入代金の75%を被相続人が拠出した。死亡時の時価は$600,000。総遺産に含まれる額はいくらか。",
      c: ["$300,000", "$450,000", "$600,000", "$150,000"],
      a: 1,
      ex: "配偶者以外との合有は被相続人の拠出割合で含める。600,000 × 75% = $450,000。",
    },
    {
      q: "A decedent made taxable gifts two years before death and paid gift tax on them. The gift tax paid is:",
      ja: "被相続人は死亡の2年前に課税贈与を行い贈与税を納付した。納付した贈与税はどう扱われるか。",
      c: [
        "Included in the gross estate",
        "Deducted from the gross estate as a debt",
        "Ignored for estate tax purposes",
        "Added to the basis of the gifted property for estate tax",
      ],
      a: 0,
      ex: "死亡前3年以内の贈与について納付した贈与税は総遺産に含められる(gross-up ルール)。",
    },
    {
      q: "Which of the following is NOT deductible in computing the taxable estate?",
      ja: "課税遺産額の計算上、次のうち控除できないものはどれか。",
      c: [
        "Reasonable funeral expenses",
        "A bequest to a qualified charity",
        "Income taxes on income earned by the estate after the decedent's death",
        "The decedent's unpaid income taxes for the year before death",
      ],
      a: 2,
      ex: "死亡後に遺産財団が稼いだ所得への所得税は遺産税の控除対象ではない。葬儀費用、慈善遺贈、死亡前の未払税金(債務)は控除できる。",
    },
    {
      q: "For a surviving spouse to use a deceased spouse's unused exclusion (DSUE) amount under the portability rules:",
      ja: "ポータビリティのルールにより、生存配偶者が亡くなった配偶者の未使用の基礎控除額(DSUE)を利用するためには何が必要か。",
      c: [
        "The surviving spouse must remarry within two years",
        "No filing is required; portability is automatic",
        "The DSUE must be used within five years of the first death",
        "The executor of the deceased spouse's estate must elect it on a timely filed Form 706",
      ],
      a: 3,
      ex: "ポータビリティは、先に死亡した配偶者の遺産執行者が期限内のForm 706で選択する必要がある(遺産税の申告義務がなくても申告が必要)。",
    },
    {
      q: "An estate has a gross estate of $10,000,000, funeral and administration expenses of $100,000, debts of $300,000, a charitable bequest of $1,000,000, and a bequest to the surviving spouse of $3,000,000. What is the taxable estate?",
      ja: "総遺産は$10,000,000、葬儀・管理費用$100,000、債務$300,000、慈善遺贈$1,000,000、生存配偶者への遺贈$3,000,000。課税遺産額はいくらか。",
      c: ["$9,600,000", "$5,600,000", "$6,600,000", "$8,600,000"],
      a: 1,
      ex: "10,000,000 − 100,000 − 300,000 − 1,000,000(慈善控除)− 3,000,000(配偶者控除)= $5,600,000。",
    },
    {
      q: "A trust pays income to the grantor's child for life, with the remainder to the grantor's grandchild. At the child's death, the transfer of the remainder to the grandchild is a:",
      ja: "信託は委託者の子に終身で所得を支払い、残余は委託者の孫に帰属する。子の死亡時に孫へ残余が移転することは何に該当するか。",
      c: ["Direct skip", "Taxable distribution", "Taxable termination", "Non-skip transfer"],
      a: 2,
      ex: "非スキップ者(子)の権益が終了し、スキップ者(孫)だけが権益を持つことになるので、世代飛越移転税上のtaxable terminationに該当する。",
    },
    {
      q: "A grandparent makes a gift to a grandchild whose parent (the grandparent's child) died before the gift. For generation-skipping transfer tax purposes:",
      ja: "祖父母が孫に贈与したが、その孫の親(祖父母の子)は贈与前に死亡していた。世代飛越移転税上どう扱われるか。",
      c: [
        "The transfer is a direct skip subject to GST tax",
        "The grandchild is treated as moving up a generation, so the transfer is not a skip",
        "The transfer is a taxable termination",
        "The GST tax applies at twice the normal rate",
      ],
      a: 1,
      ex: "親が先に死亡している場合(predeceased parent exception)、孫は1世代繰り上がって子の世代とみなされ、スキップ移転にならない。",
    },
    {
      q: "A §501(c)(3) art museum earns income from each of the following. Which is unrelated business taxable income?",
      ja: "§501(c)(3)の美術館が次の各収入を得ている。非関連事業課税所得(UBTI)に該当するものはどれか。",
      c: [
        "Dividends on its investment portfolio",
        "Profits from a restaurant it regularly operates in a downtown office building, unrelated to its mission",
        "Rent from real property not financed by debt",
        "Sales of reproductions of works in its collection",
      ],
      a: 1,
      ex: "本来の目的と関係なく継続的に営む事業の所得はUBTI。配当・利息・ロイヤルティ・借入金のない不動産賃料は除外され、所蔵品の複製販売は目的に関連する。",
    },
    {
      q: "A tax-exempt organization operates a thrift shop in which substantially all of the work is performed by unpaid volunteers. Income from the shop is:",
      ja: "免税団体が、作業のほぼすべてを無給のボランティアが行うリサイクルショップを運営している。この店舗の所得はどう扱われるか。",
      c: [
        "UBTI, because the shop is regularly carried on",
        "UBTI only to the extent it exceeds $1,000",
        "Taxed to the volunteers",
        "Not UBTI, under the volunteer labor exception",
      ],
      a: 3,
      ex: "作業のほぼすべてを無給ボランティアが行う事業は非関連事業から除外される(寄贈品の販売も同様に除外)。",
    },
    {
      q: "An exempt organization must file Form 990-T when its gross income from an unrelated trade or business for the year is at least:",
      ja: "免税団体が Form 990-T を提出しなければならないのは、非関連事業からの総所得が年間いくら以上の場合か。",
      c: ["$1,000", "$5,000", "$25,000", "$50,000"],
      a: 0,
      ex: "非関連事業の総所得が$1,000以上ならForm 990-T を提出する。UBTIの計算では$1,000の特別控除も認められる。",
    },
    {
      q: "Which of the following organizations described in §501(c)(3) is NOT required to file an annual Form 990 information return?",
      ja: "§501(c)(3)に該当する次の団体のうち、年次の情報申告書Form 990の提出が求められないものはどれか。",
      c: [
        "A private foundation",
        "A private university",
        "A church",
        "A hospital",
      ],
      a: 2,
      ex: "教会(およびその関連団体)はForm 990の提出が免除される。私的財団はForm 990-PFを所得に関係なく毎年提出する。",
    },
    {
      q: "A small tax-exempt organization whose gross receipts are normally $50,000 or less may satisfy its annual filing requirement by filing:",
      ja: "総収入が通常$50,000以下の小規模免税団体は、年次の申告義務を何の提出で満たすことができるか。",
      c: ["Form 990-T", "Form 1023", "Form 990-PF", "Form 990-N (e-Postcard)"],
      a: 3,
      ex: "総収入が通常$50,000以下の団体はForm 990-N(電子はがき)で足りる。3年連続で提出しないと免税資格が自動的に取り消される。",
    },
  ],
});

CPA.tbs({
  id: "TBS-TCP-03",
  section: "TCP",
  chapter: "TCP-02",
  title: "§351による法人設立と取得価額",
  scenario: `<p>Aoki and Beppu form Chiba Corp. in a transaction that qualifies under <b>§351</b>.</p>
<ul><li>Aoki transfers land with a basis of <b>$50,000</b> and an FMV of <b>$120,000</b>, and receives 100 shares (FMV <b>$100,000</b>) plus <b>$20,000</b> cash.</li>
<li>Beppu transfers equipment with a basis of <b>$30,000</b> and an FMV of <b>$50,000</b>, subject to a <b>$10,000</b> liability that Chiba assumes (bona fide business purpose), and receives 40 shares (FMV <b>$40,000</b>).</li></ul>
<p class="ja">AokiとBeppuは§351に該当する取引でChiba社を設立した。Aokiは取得価額$50,000、時価$120,000の土地を移転し、100株(時価$100,000)と現金$20,000を受け取った。Beppuは取得価額$30,000、時価$50,000の設備を、Chiba社が引き受ける$10,000の負債(正当な事業目的あり)付きで移転し、40株(時価$40,000)を受け取った。</p>`,
  rows: [
    { label: "Aoki's recognized gain(Aokiの認識利益)", type: "num", answer: 20000 },
    { label: "Aoki's basis in the Chiba stock(AokiのChiba株式の取得価額)", type: "num", answer: 50000 },
    { label: "Beppu's recognized gain(Beppuの認識利益)", type: "num", answer: 0 },
    { label: "Beppu's basis in the Chiba stock(BeppuのChiba株式の取得価額)", type: "num", answer: 20000 },
    { label: "Chiba's basis in the land(Chiba社の土地の取得価額)", type: "num", answer: 70000 },
    { label: "Chiba's basis in the equipment(Chiba社の設備の取得価額)", type: "num", answer: 30000 },
  ],
  explain: `<p>Aoki:実現利益 120,000 − 50,000 = 70,000、ボート 20,000 との少ない方 → 20,000 を認識。株式の取得価額 = 50,000 + 利益 20,000 − 現金 20,000 = 50,000。</p>
<p>Beppu:引受負債 10,000 は取得価額 30,000 以下で、租税回避目的もないためボートにならず利益なし。株式の取得価額 = 30,000 − 負債 10,000 = 20,000。</p>
<p>Chiba社:移転者の取得価額 + 移転者の認識利益。土地 50,000 + 20,000 = 70,000、設備 30,000 + 0 = 30,000。</p>`,
});

CPA.tbs({
  id: "TBS-TCP-04",
  section: "TCP",
  chapter: "TCP-02",
  title: "パートナーの outside basis と清算分配",
  scenario: `<p>Kato's outside basis in KLM Partnership was <b>$40,000</b> at the beginning of Year 1. For Year 1, Kato's distributive share was <b>$15,000</b> of ordinary income and <b>$2,000</b> of tax-exempt interest; Kato's share of partnership liabilities increased by <b>$8,000</b>; and Kato received a <b>$5,000</b> cash (nonliquidating) distribution.</p>
<p>On January 1, Year 2, Kato's entire interest is liquidated. Kato receives <b>$12,000</b> cash, inventory (partnership basis <b>$15,000</b>; FMV $18,000), and land held for investment (partnership basis <b>$10,000</b>; FMV $30,000). Kato is also relieved of his <b>$8,000</b> share of partnership liabilities. No §751 or §754 issues apply.</p>
<p class="ja">Katoの期首(1年目)のKLMパートナーシップ持分の outside basis は$40,000。1年目の分配可能持分は通常所得$15,000、非課税利息$2,000。パートナーシップ負債の持分が$8,000増加し、現金$5,000の非清算分配を受けた。2年目1月1日にKatoの持分全部が清算され、現金$12,000、棚卸資産(パートナーシップの取得価額$15,000、時価$18,000)、投資用土地(同$10,000、時価$30,000)を受け取り、負債の持分$8,000からも解放された。§751・§754の問題はないものとする。</p>`,
  rows: [
    { label: "Outside basis at the end of Year 1(1年目末の outside basis)", type: "num", answer: 60000 },
    { label: "Total money treated as distributed in the liquidation(清算で分配されたとみなされる金銭の合計)", type: "num", answer: 20000 },
    { label: "Gain or loss recognized by Kato on the liquidation(清算でKatoが認識する損益)", type: "num", answer: 0 },
    { label: "Kato's basis in the inventory(棚卸資産の取得価額)", type: "num", answer: 15000 },
    { label: "Kato's basis in the land(土地の取得価額)", type: "num", answer: 25000 },
    { label: "Treatment of Kato's basis remaining after money and inventory(金銭と棚卸資産の後に残るbasisの扱い)", type: "select", options: ["Allocated to the land", "Recognized as a capital loss", "Allocated to the inventory", "Forfeited"], answer: "Allocated to the land" },
  ],
  explain: `<p>1年目末:40,000 + 15,000 + 2,000(非課税所得も加算)+ 8,000(負債増加)− 5,000 = 60,000。</p>
<p>清算:現金 12,000 + 負債からの解放 8,000(みなし現金)= 20,000 < 60,000 なので利益なし。損失は金銭・未実現売掛金・棚卸資産のみを受け取った場合に限り認識するが、土地も受け取っているので損失もなし。</p>
<p>残り 40,000 をまず棚卸資産に 15,000(パートナーシップの取得価額)、残り 25,000 をすべて土地に配分する。</p>`,
});

CPA.tbs({
  id: "TBS-TCP-05",
  section: "TCP",
  chapter: "TCP-02",
  title: "当期E&Pの計算と配当・資本の払戻し",
  scenario: `<p>Mizuno Corp., a calendar-year C corporation, reports the following for the current year:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Taxable income</td><td>$300,000</td></tr>
<tr><td>Federal income tax</td><td>$63,000</td></tr>
<tr><td>Tax-exempt interest income</td><td>$12,000</td></tr>
<tr><td>Premiums on key-person life insurance (nondeductible)</td><td>$5,000</td></tr>
<tr><td>Excess of MACRS depreciation over ADS depreciation</td><td>$20,000</td></tr>
<tr><td>Net capital loss (not deductible this year)</td><td>$8,000</td></tr></table>
<p>Accumulated E&P at the beginning of the year is a deficit of <b>$(100,000)</b>. On December 31, Mizuno distributes <b>$300,000</b> cash, split equally between its two shareholders, each of whom has a stock basis of <b>$30,000</b>.</p>
<p class="ja">暦年のC法人Mizuno社の当期データ:課税所得$300,000、連邦法人税$63,000、非課税利息$12,000、役員生命保険料(損金不算入)$5,000、MACRS償却額がADS償却額を超える額$20,000、当期控除できない純キャピタルロス$8,000。期首の累積E&Pは$(100,000)の欠損。12月31日に現金$300,000を2人の株主に均等に分配した。各株主の株式の取得価額は$30,000。</p>`,
  rows: [
    { label: "Current E&P(当期E&P)", type: "num", answer: 256000 },
    { label: "Total dividend income to both shareholders(株主2人の配当所得の合計)", type: "num", answer: 256000 },
    { label: "Dividend income per shareholder(株主1人あたりの配当所得)", type: "num", answer: 128000 },
    { label: "Return of capital per shareholder(株主1人あたりの資本の払戻し)", type: "num", answer: 22000 },
    { label: "Capital gain per shareholder(株主1人あたりのキャピタルゲイン)", type: "num", answer: 0 },
    { label: "Remaining stock basis per shareholder(株主1人あたりの残りの株式取得価額)", type: "num", answer: 8000 },
  ],
  explain: `<p>当期E&P = 300,000 − 63,000 + 12,000 − 5,000 + 20,000(E&PはADSで償却するため超過分を加算)− 8,000 = 256,000。</p>
<p>当期E&Pがプラスなので累積欠損に関係なく 256,000 が配当(1人 128,000)。残り 44,000(1人 22,000)は取得価額 30,000 の範囲内なので資本の払戻しで、残りの取得価額は 8,000、キャピタルゲインは 0。</p>`,
});

CPA.tbs({
  id: "TBS-TCP-06",
  section: "TCP",
  chapter: "TCP-01",
  title: "ISOとNSOの課税関係の比較",
  scenario: `<p>Yuki receives an option to buy <b>1,000</b> shares of her employer's stock at <b>$10</b> per share. Three years after grant, she exercises the option when the market price is <b>$30</b> per share. Eighteen months after exercise, she sells all the shares for <b>$45</b> per share.</p>
<p>Answer separately assuming (1) the option is an <b>incentive stock option (ISO)</b> and (2) the option is a <b>nonqualified stock option (NSO)</b> with no readily ascertainable fair market value at grant.</p>
<p class="ja">Yukiは勤務先の株式1,000株を1株$10で購入できるオプションを付与された。付与の3年後、時価$30のときに行使し、行使の18か月後に全株を1株$45で売却した。(1)インセンティブ・ストック・オプション(ISO)の場合と、(2)付与時に時価が容易に算定できない非適格ストック・オプション(NSO)の場合に分けて答えよ。</p>`,
  rows: [
    { label: "ISO: ordinary income at exercise(ISO:行使時の通常所得)", type: "num", answer: 0 },
    { label: "ISO: AMT adjustment in the year of exercise(ISO:行使年のAMT調整額)", type: "num", answer: 20000 },
    { label: "ISO: long-term capital gain on the sale(ISO:売却時の長期キャピタルゲイン)", type: "num", answer: 35000 },
    { label: "NSO: ordinary income at exercise(NSO:行使時の通常所得)", type: "num", answer: 20000 },
    { label: "NSO: basis in the shares(NSO:株式の取得価額)", type: "num", answer: 30000 },
    { label: "NSO: long-term capital gain on the sale(NSO:売却時の長期キャピタルゲイン)", type: "num", answer: 15000 },
  ],
  explain: `<p>ISO:行使時は通常の税では課税なし。差額 (30 − 10) × 1,000 = 20,000 はAMTの加算調整。付与から2年超・行使から1年超の保有要件を満たすので、売却益 (45 − 10) × 1,000 = 35,000 がすべて長期キャピタルゲイン(雇用主の控除なし)。</p>
<p>NSO:行使時に差額 20,000 を給与所得として認識し(雇用主は同額を控除)、取得価額は時価 30,000。売却益 45,000 − 30,000 = 15,000 は行使から1年超保有なので長期キャピタルゲイン。</p>`,
});

CPA.tbs({
  id: "TBS-TCP-07",
  section: "TCP",
  chapter: "TCP-03",
  title: "複合信託のDNIと受益者の課税所得",
  scenario: `<p>The Hayashi Trust is a complex trust. For the current year it has the following:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Dividends</td><td>$40,000</td></tr>
<tr><td>Taxable interest</td><td>$20,000</td></tr>
<tr><td>Tax-exempt interest</td><td>$20,000</td></tr>
<tr><td>Capital gains (allocated to corpus)</td><td>$15,000</td></tr>
<tr><td>Trustee fees (charged entirely to income)</td><td>$8,000</td></tr></table>
<p>The trustee makes a discretionary distribution of <b>$36,000</b> to the sole beneficiary. Trustee fees are allocated to tax-exempt income in proportion to the trust's income items (excluding capital gains).</p>
<p class="ja">Hayashi信託は複合信託である。当期:配当$40,000、課税利息$20,000、非課税利息$20,000、元本に配分されるキャピタルゲイン$15,000、受託者報酬$8,000(全額を所得に負担)。受託者は唯一の受益者に$36,000の任意分配を行った。受託者報酬は、キャピタルゲインを除く所得項目の割合で非課税所得に配分する。</p>`,
  rows: [
    { label: "Fiduciary accounting income(信託会計上の所得)", type: "num", answer: 72000 },
    { label: "Distributable net income (DNI)(分配可能純所得)", type: "num", answer: 72000 },
    { label: "Net tax-exempt income included in DNI(DNIに含まれる純非課税所得)", type: "num", answer: 18000 },
    { label: "Trust's distribution deduction(信託の分配控除)", type: "num", answer: 27000 },
    { label: "Amount taxable to the beneficiary(受益者の課税所得となる額)", type: "num", answer: 27000 },
    { label: "The $15,000 capital gain is taxed to(キャピタルゲイン$15,000の課税対象者)", type: "select", options: ["The trust", "The beneficiary", "The grantor", "Split equally between trust and beneficiary"], answer: "The trust" },
  ],
  explain: `<p>FAI = 40,000 + 20,000 + 20,000 − 8,000 = 72,000(元本に配分されるキャピタルゲインは除外)。DNI も同じく 72,000。</p>
<p>報酬のうち非課税分 = 8,000 × 20,000 ÷ 80,000 = 2,000 → 純非課税所得 18,000、課税DNI 54,000。</p>
<p>分配控除 = 分配 36,000 × 54,000 ÷ 72,000 = 27,000(非課税部分 9,000 は受益者にも非課税)。キャピタルゲインはDNIに含まれないので信託が課税される。</p>`,
});

CPA.tbs({
  id: "TBS-TCP-08",
  section: "TCP",
  chapter: "TCP-01",
  title: "贈与・相続財産の取得価額と売却損益",
  scenario: `<p>Determine the recognized gain or loss (enter a loss as a negative number) or basis in each independent case. No gift tax was paid unless stated.</p>
<ol><li>Stock received as a gift: donor's basis <b>$20,000</b>, FMV at the gift date <b>$50,000</b>. The donee sells it for <b>$45,000</b>.</li>
<li>Land received as a gift: donor's basis <b>$80,000</b>, FMV at the gift date <b>$60,000</b>. The donee sells it for <b>$50,000</b>.</li>
<li>Same land as in case 2, but the donee sells it for <b>$70,000</b>.</li>
<li>Same land as in case 2, but the donee sells it for <b>$90,000</b>.</li>
<li>Property inherited: decedent's basis <b>$30,000</b>, FMV at death <b>$100,000</b> (no alternate valuation). The heir sells it for <b>$110,000</b>.</li>
<li>Stock received as a gift: donor's basis <b>$40,000</b>, FMV <b>$100,000</b>; taxable gift after the annual exclusion <b>$80,000</b>; gift tax paid <b>$20,000</b>. Determine the donee's basis.</li></ol>
<p class="ja">それぞれ独立したケースについて、認識損益(損失はマイナスで入力)または取得価額を求めよ。記載がなければ贈与税は支払われていない。(1)贈与株式:贈与者の取得価額$20,000、贈与時時価$50,000、$45,000で売却。(2)贈与土地:贈与者の取得価額$80,000、贈与時時価$60,000、$50,000で売却。(3)同じ土地を$70,000で売却。(4)同じ土地を$90,000で売却。(5)相続財産:被相続人の取得価額$30,000、死亡時時価$100,000(代替評価日なし)、$110,000で売却。(6)贈与株式:贈与者の取得価額$40,000、時価$100,000、年間非課税枠控除後の課税贈与額$80,000、贈与税$20,000。受贈者の取得価額を求めよ。</p>`,
  rows: [
    { label: "Case 1: recognized gain (loss)(ケース1:認識損益)", type: "num", answer: 25000 },
    { label: "Case 2: recognized gain (loss)(ケース2:認識損益)", type: "num", answer: -10000 },
    { label: "Case 3: recognized gain (loss)(ケース3:認識損益)", type: "num", answer: 0 },
    { label: "Case 4: recognized gain (loss)(ケース4:認識損益)", type: "num", answer: 10000 },
    { label: "Case 5: recognized gain (loss)(ケース5:認識損益)", type: "num", answer: 10000 },
    { label: "Case 6: donee's basis(ケース6:受贈者の取得価額)", type: "num", answer: 55000 },
  ],
  explain: `<p>(1) 贈与時時価 ≥ 贈与者の取得価額なので取得価額は 20,000 を引き継ぐ。45,000 − 20,000 = 25,000。</p>
<p>(2)〜(4) 時価 < 贈与者の取得価額のため二重基準:利益計算は 80,000、損失計算は時価 60,000。50,000 → 損失 10,000、70,000 → 両基準の間なので損益なし、90,000 → 利益 10,000。</p>
<p>(5) 相続財産の取得価額は死亡時時価 100,000(step-up)。110,000 − 100,000 = 10,000(常に長期)。</p>
<p>(6) 40,000 + 20,000 × (100,000 − 40,000) ÷ 80,000 = 40,000 + 15,000 = 55,000。</p>`,
});
