// REG の追加問題(個人課税 その2:項目別控除・QBI・税額計算・税額控除・AMT・自営業税・損失制限)

CPA.extend("REG-03", {
  mcq: [
    {
      q: "A single individual with AGI of $120,000 paid the following during the year: doctor and hospital bills of $6,000, prescription drugs of $3,000, nonprescription vitamins of $1,200, and health insurance premiums of $4,800 (paid with after-tax dollars). She received a $2,000 insurance reimbursement for the hospital bills. What is her itemized medical expense deduction?",
      ja: "AGIが$120,000の単身者が当年に以下を支払った:医師・病院の費用$6,000、処方薬$3,000、処方箋不要のビタミン剤$1,200、健康保険料$4,800(税引後資金で支払)。病院費用について保険から$2,000の補填を受けた。項目別控除としての医療費控除額はいくらか。",
      c: ["$4,000", "$2,800", "$4,800", "$11,800"],
      a: 1,
      ex: "対象医療費 = 6,000 + 3,000 + 4,800 − 2,000 = 11,800。AGIの7.5% = 9,000を超える2,800が控除額。処方箋不要のビタミン剤は対象外であり、含めると$4,000となり誤り。保険補填を差し引かないと$4,800となる。",
    },
    {
      q: "On the advice of his physician, an individual with AGI of $100,000 installed an elevator in his home at a cost of $30,000 because of a heart condition. An appraisal showed the elevator increased the home's value by $18,000. He had no other medical expenses. What is his medical expense deduction?",
      ja: "AGIが$100,000の個人が、心臓疾患のため医師の助言に従い自宅にエレベーターを$30,000で設置した。鑑定によるとエレベーターにより住宅の価値は$18,000増加した。他に医療費はない。医療費控除額はいくらか。",
      c: ["$22,500", "$12,000", "$0", "$4,500"],
      a: 3,
      ex: "医療目的の資本的支出は、住宅価値の増加額を超える部分(30,000 − 18,000 = 12,000)のみ医療費となる。12,000 − 100,000 × 7.5% = 4,500。$12,000は7.5%の足切りを忘れた誤り、$22,500は価値増加分を控除していない誤り。",
    },
    {
      q: "A married couple filing jointly itemizes deductions. During the year they paid state income tax withheld of $6,000, a balance due on the prior year's state income tax return of $1,500, real property tax on their principal residence of $2,000, real property tax on a vacation home located in France of $1,000, and real property tax on a rental duplex of $3,000. Assume the SALT deduction cap for their return is $10,000. What amount of taxes may they deduct as an itemized deduction?",
      ja: "夫婦合算申告の夫婦が項目別控除を選択する。当年に支払ったのは、州所得税の源泉徴収$6,000、前年分州所得税の未払額$1,500、主たる住居の固定資産税$2,000、フランスにある別荘の固定資産税$1,000、賃貸用二世帯住宅の固定資産税$3,000である。SALT控除上限は$10,000とする。項目別控除として控除できる税額はいくらか。",
      c: ["$9,500", "$10,000", "$10,500", "$13,500"],
      a: 0,
      ex: "州所得税6,000 + 前年分の州税1,500 + 自宅の固定資産税2,000 = 9,500で上限内。外国の不動産税は項目別控除不可、賃貸物件の固定資産税はSchedule Eで控除されSALT上限の対象外。これらを含めて上限を適用すると$10,000となり誤り。",
    },
    {
      q: "In 2024, a married couple purchased a principal residence with an acquisition mortgage that had an average balance of $1,000,000 during the current year, on which they paid $50,000 of interest. Assume the acquisition indebtedness limit for debt incurred after December 15, 2017, is $750,000. How much of the mortgage interest is deductible as an itemized deduction?",
      ja: "2024年、夫婦は主たる住居を購入し、取得ローンの当年の平均残高は$1,000,000、支払利息は$50,000であった。2017年12月15日以降の借入に係る取得債務の上限は$750,000とする。項目別控除として控除可能な住宅ローン利息はいくらか。",
      c: ["$50,000", "$30,000", "$37,500", "$0"],
      a: 2,
      ex: "控除可能額 = 50,000 × 750,000 / 1,000,000 = 37,500。上限を超える債務に対応する利息は按分により控除不可。全額$50,000は上限を無視した誤り。",
    },
    {
      q: "An individual took out a $60,000 home equity loan secured by her principal residence. Under current law, interest on the loan is deductible as qualified residence interest only if the loan proceeds were used to:",
      ja: "個人が主たる住居を担保に$60,000のホームエクイティローンを借り入れた。現行法の下で、このローンの利息が適格住宅利息として控除できるのは、借入金を何に使った場合か。",
      c: [
        "Pay off credit card balances",
        "Substantially improve the residence that secures the loan",
        "Purchase a new automobile used for personal purposes",
        "Pay college tuition for a dependent child",
      ],
      a: 1,
      ex: "TCJA以降、ホームエクイティローンの利息は、担保となる住宅の取得・建築・大幅な改良に使われた場合(取得債務として扱われる場合)にのみ控除できる。クレジットカード返済、自動車購入、学費に使った場合は控除不可。",
    },
    {
      q: "An individual paid $12,000 of interest on a margin account used to purchase stocks. Her investment income consisted of $4,000 of taxable interest, $3,000 of qualified dividends, and a $2,000 net short-term capital gain. She makes no election regarding qualified dividends. What is her investment interest expense deduction for the year?",
      ja: "個人が株式購入に用いた信用取引口座の利息$12,000を支払った。投資収益は課税利息$4,000、適格配当$3,000、短期キャピタルゲイン純額$2,000である。適格配当に関する選択は行わない。当年の投資利息控除額はいくらか。",
      c: ["$9,000", "$12,000", "$4,000", "$6,000"],
      a: 3,
      ex: "純投資収益 = 利息4,000 + 短期譲渡益2,000 = 6,000。適格配当は軽減税率の適用を放棄する選択をしない限り純投資収益に含まれない。控除額6,000、残り6,000は無期限に繰越。適格配当を含めた$9,000は誤り。",
    },
    {
      q: "An individual's investment interest expense exceeds her net investment income. She elects to treat $5,000 of qualified dividends as investment income. What is the consequence of the election?",
      ja: "個人の投資利息が純投資収益を超えている。彼女は適格配当$5,000を投資収益として扱う選択を行った。この選択の結果はどうなるか。",
      c: [
        "The $5,000 is taxed at ordinary income rates, but her investment interest deduction may increase by up to $5,000",
        "The $5,000 continues to be taxed at the preferential rate and increases her investment interest deduction",
        "The $5,000 is excluded from gross income",
        "Any disallowed investment interest can no longer be carried forward",
      ],
      a: 0,
      ex: "適格配当や長期譲渡益を純投資収益に含める選択をすると、その分は軽減税率ではなく通常税率で課税されるが、投資利息控除の上限が増える。両方の恩恵を同時に受けることはできない。",
    },
    {
      q: "An individual with AGI of $100,000 contributed $70,000 cash to a public charity during the year. She made no other contributions. Assume the AGI limitation for cash gifts to public charities is 60%. Which of the following is correct?",
      ja: "AGIが$100,000の個人が、当年に公益慈善団体へ現金$70,000を寄付した。他の寄付はない。公益慈善団体への現金寄付のAGI上限は60%とする。正しいものはどれか。",
      c: [
        "She deducts $70,000 in the current year",
        "She deducts $50,000 and carries $20,000 forward for 5 years",
        "She deducts $60,000 and carries $10,000 forward for 5 years",
        "She deducts $60,000 and the $10,000 excess is permanently lost",
      ],
      a: 2,
      ex: "上限 = 100,000 × 60% = 60,000。超過額10,000は5年間繰越可能。50%は現金以外の寄付に適用される上限であり、超過額は消滅しない。",
    },
    {
      q: "An individual with AGI of $100,000 donated publicly traded stock held for 4 years to a public charity. The stock had a fair market value of $50,000 and an adjusted basis of $20,000. If she makes the election to measure the contribution at the stock's basis, what is her charitable contribution deduction for the current year?",
      ja: "AGIが$100,000の個人が、4年間保有した上場株式を公益慈善団体へ寄付した。時価は$50,000、調整後取得価額は$20,000。寄付額を取得価額で測定する選択を行った場合、当年の寄付金控除額はいくらか。",
      c: ["$20,000", "$30,000", "$50,000", "$0"],
      a: 0,
      ex: "長期キャピタルゲイン資産の寄付は通常、時価で評価しAGIの30%上限(30,000)が適用されるが、取得価額で評価する選択をすると50%上限が適用される。20,000は50,000(50%上限)以内のため全額控除。選択しない場合は$30,000控除、$20,000繰越となる。",
    },
    {
      q: "An individual donated shares of stock held for 8 months to her church. The stock had a fair market value of $10,000 and an adjusted basis of $6,000. Her AGI is $90,000. What is her charitable contribution deduction?",
      ja: "個人が8か月保有した株式を教会に寄付した。時価は$10,000、調整後取得価額は$6,000。AGIは$90,000。寄付金控除額はいくらか。",
      c: ["$10,000", "$4,000", "$6,000", "$27,000"],
      a: 2,
      ex: "短期保有資産は通常所得資産であり、控除額は時価から売却時に通常所得となる部分を差し引いた額、すなわち取得価額6,000に限られる。時価$10,000は長期保有資産の場合の扱いである。",
    },
    {
      q: "An individual donated a painting she had owned for 10 years to a hospital, which sold the painting immediately to raise funds. The painting had a fair market value of $40,000 and an adjusted basis of $15,000. Her AGI is $200,000. What is her charitable contribution deduction?",
      ja: "個人が10年間所有していた絵画を病院に寄付し、病院は資金調達のため直ちに売却した。絵画の時価は$40,000、調整後取得価額は$15,000。AGIは$200,000。寄付金控除額はいくらか。",
      c: ["$40,000", "$15,000", "$25,000", "$60,000"],
      a: 1,
      ex: "長期保有の有形動産であっても、受贈団体の本来の目的と関連しない用途(売却)に使われる場合は、控除額は取得価額15,000に限られる。美術館が展示に使うなど関連用途であれば時価$40,000となる。",
    },
    {
      q: "An individual with AGI of $200,000 donated publicly traded stock held for 5 years to a private nonoperating foundation. The stock had a fair market value of $50,000 and an adjusted basis of $10,000. Assume the AGI limit for capital gain property given to a private nonoperating foundation is 20%. What is the current-year deduction?",
      ja: "AGIが$200,000の個人が、5年間保有した上場株式を非事業型私立財団に寄付した。時価は$50,000、調整後取得価額は$10,000。非事業型私立財団へのキャピタルゲイン資産の寄付のAGI上限は20%とする。当年の控除額はいくらか。",
      c: ["$10,000", "$50,000", "$60,000", "$40,000"],
      a: 3,
      ex: "上場株式(適格評価益株式)は私立財団への寄付でも時価50,000で評価できる。上限 = 200,000 × 20% = 40,000で、残り10,000は5年間繰越。取得価額$10,000は非上場株式など適格評価益株式以外の場合の扱いである。",
    },
    {
      q: "An individual donated the following items to qualified charities during the year. For which donation is a qualified appraisal required to support the deduction?",
      ja: "個人が当年に適格慈善団体へ以下を寄付した。控除の裏付けとして適格鑑定が必要なのはどれか。",
      c: [
        "Publicly traded stock with a fair market value of $25,000",
        "A cash gift of $8,000 supported by a bank record and written acknowledgment",
        "A painting with a claimed value of $8,000",
        "Used clothing with a claimed value of $400",
      ],
      a: 2,
      ex: "現金以外の寄付で$5,000超を主張する場合は適格鑑定が必要だが、上場株式は例外である。現金寄付は鑑定不要($250以上は寄付先の同時期の書面受領証が必要)。$400の衣類は鑑定不要。",
    },
    {
      q: "An individual paid $300 for a ticket to a charity's fundraising dinner. The charity's written statement disclosed that the fair market value of the dinner was $80. What is the individual's charitable contribution deduction?",
      ja: "個人が慈善団体の資金集めの夕食会のチケットを$300で購入した。慈善団体の書面では夕食の時価は$80と開示されている。寄付金控除額はいくらか。",
      c: ["$300", "$220", "$80", "$0"],
      a: 1,
      ex: "対価を伴う寄付(quid pro quo)は、支払額から受け取った便益の時価を差し引いた額のみ控除できる。300 − 80 = 220。",
    },
    {
      q: "An individual's principal residence, located in a federally declared disaster area, was damaged by a hurricane. The home's adjusted basis was $200,000; its fair market value was $250,000 before the storm and $190,000 after. She received $40,000 of insurance proceeds. Her AGI is $80,000. Assume the $100 floor and 10%-of-AGI rule apply. What is her casualty loss deduction?",
      ja: "連邦災害指定地域にある個人の主たる住居がハリケーンで損傷した。住宅の調整後取得価額は$200,000、災害前の時価は$250,000、災害後は$190,000。保険金$40,000を受け取った。AGIは$80,000。$100の足切りとAGIの10%ルールが適用されるとする。災害損失控除額はいくらか。",
      c: ["$11,900", "$20,000", "$19,900", "$51,900"],
      a: 0,
      ex: "損失額 = 時価下落額60,000と取得価額200,000の小さい方60,000 − 保険金40,000 = 20,000。20,000 − 100 − 80,000 × 10% = 11,900。$19,900は10%足切りを忘れた誤り。",
    },
    {
      q: "Jewelry worth $8,000 (adjusted basis $5,000) was stolen from an individual's home. The theft did not occur in a federally declared disaster area, and the individual had no personal casualty gains during the year. Her AGI is $60,000 and she itemizes deductions. What is her deductible theft loss?",
      ja: "個人の自宅から時価$8,000(調整後取得価額$5,000)の宝石が盗まれた。盗難は連邦災害指定地域で発生したものではなく、当年に個人的災害利得はない。AGIは$60,000で項目別控除を選択している。控除可能な盗難損失はいくらか。",
      c: ["$4,900", "$0", "$1,900", "$5,000"],
      a: 1,
      ex: "個人の災害・盗難損失は、連邦災害指定地域に起因するもの(または個人的災害利得の範囲内)に限り控除できる。本問はいずれにも該当しないため0。$4,900や$1,900は旧ルールの計算を当てはめた誤り。",
    },
    {
      q: "A single taxpayer is 67 years old and legally blind. Assume the basic standard deduction for a single filer is $15,000 and the additional standard deduction for age 65 or older and for blindness is $2,000 each for an unmarried taxpayer. Ignoring any other special deductions, what is her standard deduction?",
      ja: "単身の納税者は67歳で、法的に盲目である。単身者の基本標準控除は$15,000、未婚者の65歳以上および盲目の追加標準控除はそれぞれ$2,000とする。その他の特別控除を無視した場合、標準控除額はいくらか。",
      c: ["$15,000", "$17,000", "$19,000", "$21,000"],
      a: 2,
      ex: "15,000 + 年齢2,000 + 盲目2,000 = 19,000。追加控除は年齢と盲目それぞれに適用される。$17,000は一方のみを加算した誤り。",
    },
    {
      q: "A 16-year-old is claimed as a dependent on her parents' return. She earned $3,000 from a part-time job and received $500 of interest income. Assume a dependent's standard deduction is limited to the greater of $1,350 or earned income plus $450, but not more than the regular standard deduction of $15,000. What is her standard deduction?",
      ja: "16歳の子は両親の申告書で被扶養者とされている。アルバイトで$3,000を稼ぎ、利息収入$500を受け取った。被扶養者の標準控除は$1,350または勤労所得+$450のいずれか大きい方(ただし通常の標準控除$15,000が上限)とする。この子の標準控除額はいくらか。",
      c: ["$3,450", "$1,350", "$3,500", "$15,000"],
      a: 0,
      ex: "勤労所得3,000 + 450 = 3,450 > 1,350のため3,450。利息などの不労所得は計算に含めない($3,500は誤り)。被扶養者は通常の標準控除全額を使えない。",
    },
    {
      q: "A married couple files separate returns. The wife itemizes her deductions. Which of the following is true regarding the husband?",
      ja: "夫婦が個別申告を行う。妻は項目別控除を選択する。夫について正しいものはどれか。",
      c: [
        "He may claim the full standard deduction for married filing separately",
        "He may claim one-half of the standard deduction",
        "He may choose between the standard deduction and itemizing",
        "He must also itemize deductions; his standard deduction is zero",
      ],
      a: 3,
      ex: "個別申告の夫婦の一方が項目別控除を選択した場合、他方も項目別控除を選択しなければならず、標準控除はゼロとなる。",
    },
    {
      q: "A single individual has $120,000 of qualified business income from a sole proprietorship (not a specified service trade or business). Her taxable income before the QBI deduction is $110,000, which includes a $15,000 net capital gain. Her taxable income is below the threshold at which the W-2 wage/UBIA limits apply. What is her QBI deduction?",
      ja: "単身の個人は個人事業(特定サービス事業ではない)から適格事業所得(QBI)$120,000を得ている。QBI控除前の課税所得は$110,000で、純キャピタルゲイン$15,000を含む。課税所得はW-2賃金/UBIA制限が適用される閾値を下回っている。QBI控除額はいくらか。",
      c: ["$24,000", "$22,000", "$19,000", "$21,000"],
      a: 2,
      ex: "控除額は、QBIの20%(24,000)と、(課税所得 − 純キャピタルゲイン)の20% = (110,000 − 15,000) × 20% = 19,000のいずれか小さい方で19,000。$22,000は純キャピタルゲインを差し引かなかった誤り。",
    },
    {
      q: "A married couple filing jointly has taxable income well above the top of the QBI phase-in range. Their non-SSTB business generated QBI of $400,000, paid W-2 wages of $100,000, and has unadjusted basis immediately after acquisition (UBIA) of qualified property of $600,000. What is their QBI deduction (assume the overall taxable income limitation does not apply)?",
      ja: "夫婦合算申告の課税所得はQBIの段階適用範囲の上限を大きく上回っている。特定サービス事業ではない事業のQBIは$400,000、支払W-2賃金は$100,000、適格資産のUBIAは$600,000である。QBI控除額はいくらか(課税所得全体による制限は適用されないとする)。",
      c: ["$80,000", "$50,000", "$40,000", "$65,000"],
      a: 1,
      ex: "QBIの20% = 80,000だが、W-2賃金の50%(50,000)と、W-2賃金の25% + UBIAの2.5%(25,000 + 15,000 = 40,000)のいずれか大きい方50,000が上限。よって50,000。$40,000は大きい方を選ばなかった誤り。",
    },
    {
      q: "A CPA operates her accounting practice as a sole proprietorship and has $300,000 of qualified business income. Her taxable income exceeds the upper end of the QBI phase-in range. What is her QBI deduction from the practice?",
      ja: "CPAが会計事務所を個人事業として営み、適格事業所得は$300,000である。課税所得はQBIの段階適用範囲の上限を超えている。この事務所からのQBI控除額はいくらか。",
      c: ["$0", "$60,000", "$30,000", "Limited to 50% of W-2 wages paid"],
      a: 0,
      ex: "会計業は特定サービス事業(SSTB)であり、課税所得が段階適用範囲の上限を超える場合、QBI控除は一切認められない。閾値以下であればSSTBでも20%控除が可能である。",
    },
    {
      q: "A single taxpayer has taxable income of $60,000, which includes a $20,000 long-term capital gain (no qualified dividends). Assume the 0% capital gains rate applies to taxable income up to $48,350 and the 15% rate applies above that amount (up to a much higher threshold). What is the tax on the long-term capital gain?",
      ja: "単身者の課税所得は$60,000で、長期キャピタルゲイン$20,000を含む(適格配当はない)。0%税率は課税所得$48,350まで、それを超える部分(かなり高い閾値まで)に15%が適用されるとする。長期キャピタルゲインに対する税額はいくらか。",
      c: ["$3,000", "$0", "$1,252.50", "$1,747.50"],
      a: 3,
      ex: "通常所得40,000が先に下位ブラケットを埋め、譲渡益は40,000〜60,000に積み上げられる。48,350までの8,350は0%、残り11,650 × 15% = 1,747.50。全額15%の$3,000は積み上げ順序を無視した誤り。",
    },
    {
      q: "A taxpayer in the 37% ordinary income bracket sold gold coins held as an investment for 3 years at a $10,000 gain. What is the maximum tax rate applicable to this gain (ignoring the net investment income tax)?",
      ja: "通常所得の37%ブラケットにある納税者が、投資目的で3年間保有した金貨を売却し$10,000の利益を得た。この利益に適用される最高税率はいくらか(純投資所得税は無視する)。",
      c: ["20%", "25%", "28%", "37%"],
      a: 2,
      ex: "収集品(金貨・美術品等)の長期譲渡益の最高税率は28%。25%は非回収§1250利得、20%は通常の長期譲渡益・適格配当の最高税率である。",
    },
    {
      q: "A 12-year-old child, whose parents are living, has $6,000 of interest and dividend income and no earned income. Assume that the first $1,350 of unearned income is offset by the child's standard deduction, the next $1,350 is taxed at the child's rate, and the excess is taxed at the parents' rate. How much of the child's income is taxed at the parents' rate?",
      ja: "両親が存命の12歳の子が、利息・配当収入$6,000を得ており勤労所得はない。不労所得の最初の$1,350は子の標準控除で相殺され、次の$1,350は子の税率、残りは親の税率で課税されるとする。親の税率で課税される金額はいくらか。",
      c: ["$4,650", "$6,000", "$3,300", "$2,700"],
      a: 2,
      ex: "純不労所得 = 6,000 − 1,350 − 1,350 = 3,300が親の税率で課税される(キディ・タックス)。$4,650は2つ目の$1,350を差し引かなかった誤り。",
    },
    {
      q: "Each of the following children has unearned income above the kiddie tax threshold and at least one living parent. Which child is subject to the kiddie tax?",
      ja: "以下の子はいずれもキディ・タックスの閾値を超える不労所得があり、少なくとも一方の親が存命である。キディ・タックスの対象となるのはどれか。",
      c: [
        "A 20-year-old full-time college student whose earned income is less than one-half of her support",
        "A 25-year-old full-time graduate student with no earned income",
        "An 18-year-old whose earned income exceeds one-half of his support",
        "A 17-year-old who files a joint return with her spouse",
      ],
      a: 0,
      ex: "キディ・タックスは19歳未満の子、または24歳未満のフルタイム学生で、勤労所得が自己の扶養費の半分以下の者に適用される。25歳は年齢超過、18歳で勤労所得が扶養費の半分超は対象外、合算申告をする既婚の子も対象外。",
    },
    {
      q: "A married couple filing jointly has three children: ages 8 and 14, and an 18-year-old who is their dependent. Their modified AGI is below the phase-out threshold. Assume the child tax credit is $2,200 per qualifying child and the credit for other dependents is $500 per dependent. What is their total credit?",
      ja: "夫婦合算申告の夫婦には8歳、14歳、および被扶養者である18歳の3人の子がいる。修正AGIは段階的縮小の閾値未満である。児童税額控除は適格児童1人当たり$2,200、その他扶養家族控除は1人当たり$500とする。控除の合計額はいくらか。",
      c: ["$6,600", "$4,400", "$5,400", "$4,900"],
      a: 3,
      ex: "児童税額控除は17歳未満の子が対象:2 × 2,200 = 4,400。18歳の被扶養者はその他扶養家族控除500。合計4,900。$6,600は18歳にも児童税額控除を適用した誤り。",
    },
    {
      q: "A married couple filing jointly has two qualifying children under age 17 and modified AGI of $412,500. Assume the child tax credit is $2,000 per child and is reduced by $50 for each $1,000 (or fraction thereof) of modified AGI above $400,000. What is their child tax credit?",
      ja: "夫婦合算申告の夫婦には17歳未満の適格児童が2人おり、修正AGIは$412,500である。児童税額控除は1人$2,000で、修正AGIが$400,000を超える$1,000(端数を含む)ごとに$50減額されるとする。児童税額控除額はいくらか。",
      c: ["$3,375", "$3,350", "$3,400", "$4,000"],
      a: 1,
      ex: "超過額12,500 → $1,000単位で端数切上げ13単位 × 50 = 650。4,000 − 650 = 3,350。端数を按分した$3,375や切り捨てた$3,400は誤り。",
    },
    {
      q: "A married couple filing jointly has two children ages 4 and 6 and paid $8,000 to a day-care center so both spouses could work. One spouse earned $70,000; the other worked part-time and earned $2,500. Their AGI is $72,500. Assume the expense limit is $6,000 for two or more qualifying individuals and the applicable credit percentage is 20%. What is their child and dependent care credit?",
      ja: "夫婦合算申告の夫婦には4歳と6歳の子がおり、夫婦が働くため保育所に$8,000を支払った。一方の配偶者の稼得額は$70,000、他方はパートで$2,500。AGIは$72,500。2人以上の適格者の費用上限は$6,000、適用控除率は20%とする。児童・扶養家族介護税額控除額はいくらか。",
      c: ["$1,200", "$1,600", "$500", "$600"],
      a: 2,
      ex: "対象費用は実支出8,000、上限6,000、および稼得の少ない配偶者の勤労所得2,500のうち最小の2,500。2,500 × 20% = 500。勤労所得の制限を無視すると$1,200となり誤り。",
    },
    {
      q: "A taxpayer's dependent son is a first-year, full-time undergraduate student. During the year the taxpayer paid tuition of $3,000, required course books purchased from the bookstore of $400, and room and board of $6,000. Modified AGI is below the phase-out range. What is the American Opportunity Tax Credit?",
      ja: "納税者の被扶養者である息子は大学1年のフルタイム学生である。当年に授業料$3,000、必要な教科書代$400、寮費・食費$6,000を支払った。修正AGIは段階的縮小の範囲未満である。アメリカン・オポチュニティ税額控除(AOTC)の額はいくらか。",
      c: ["$2,350", "$2,500", "$680", "$3,400"],
      a: 0,
      ex: "対象費用 = 3,000 + 400 = 3,400(寮費・食費は対象外)。最初の2,000の100% + 残り1,400の25% = 2,000 + 350 = 2,350。上限$2,500は対象費用が4,000以上の場合。$680は生涯学習控除(20%)の計算である。",
    },
    {
      q: "A married couple filing jointly paid $6,000 of graduate-school tuition for the husband and $7,000 of tuition for their dependent daughter, who is in her fifth year of undergraduate study. Neither student is eligible for the American Opportunity Tax Credit. Assume the lifetime learning credit is 20% of up to $10,000 of qualified expenses per return and their modified AGI is below the phase-out range. What is their lifetime learning credit?",
      ja: "夫婦合算申告の夫婦が、夫の大学院授業料$6,000と、学部5年目の被扶養者の娘の授業料$7,000を支払った。いずれもAOTCの対象外である。生涯学習控除は申告書1件当たり対象費用$10,000までの20%とし、修正AGIは段階的縮小の範囲未満とする。生涯学習控除額はいくらか。",
      c: ["$2,600", "$4,000", "$2,000", "$1,200"],
      a: 2,
      ex: "生涯学習控除は学生1人ごとではなく申告書1件当たり対象費用10,000が上限:10,000 × 20% = 2,000。学生ごとに計算した$2,600(または$4,000)は誤り。",
    },
    {
      q: "Which of the following statements correctly distinguishes the American Opportunity Tax Credit (AOTC) from the lifetime learning credit (LLC)?",
      ja: "アメリカン・オポチュニティ税額控除(AOTC)と生涯学習控除(LLC)の違いを正しく述べたものはどれか。",
      c: [
        "The LLC is partially refundable, while the AOTC is nonrefundable",
        "The AOTC is computed per eligible student and is partially refundable, while the LLC is computed per return, is nonrefundable, and is available for courses to improve job skills",
        "Both credits may be claimed for the same student in the same year",
        "The AOTC is available for any number of years of postsecondary education",
      ],
      a: 1,
      ex: "AOTCは学生1人ごと(最初の4年間、半日制以上の在籍)に計算され、40%(最大$1,000)が還付可能。LLCは申告書単位で還付不可、年数制限がなく職業技能向上の講座にも使える。同一学生に同一年で両方は適用できない。",
    },
    {
      q: "Which of the following would disqualify an otherwise eligible individual from claiming the earned income tax credit?",
      ja: "他の要件を満たす個人が勤労所得税額控除(EITC)を受けられなくなるのは、次のどれか。",
      c: [
        "Having investment income (such as interest, dividends, and capital gains) in excess of the statutory limit",
        "Having no qualifying children",
        "Having a tax liability of zero before credits",
        "Filing as head of household",
      ],
      a: 0,
      ex: "投資所得が法定上限を超えるとEITCは適用不可。適格児童がいなくても年齢要件等を満たせば少額の控除が受けられる。EITCは還付可能な控除のため税額ゼロでも受けられ、世帯主申告も適用可能。",
    },
    {
      q: "Which of the following statements about the premium tax credit is correct?",
      ja: "保険料税額控除(premium tax credit)について正しいものはどれか。",
      c: [
        "It is a nonrefundable credit available for employer-sponsored health coverage",
        "Advance payments are never reconciled on the individual's tax return",
        "It is a refundable credit for health insurance purchased through a Marketplace, and advance payments are reconciled with the actual credit on the tax return",
        "It is available only to taxpayers whose household income exceeds 400% of the federal poverty line",
      ],
      a: 2,
      ex: "保険料税額控除はマーケットプレイス(取引所)で購入した健康保険に対する還付可能な税額控除で、前払分(APTC)は申告書(Form 8962)で実際の控除額と精算される。家計所得が貧困線に対し一定範囲にある者が対象である。",
    },
    {
      q: "An individual's worldwide taxable income is $200,000, of which $40,000 is foreign-source taxable income. Her U.S. income tax before credits is $44,000, and she paid $12,000 of foreign income taxes. What is her foreign tax credit for the current year?",
      ja: "個人の全世界課税所得は$200,000で、うち国外源泉課税所得は$40,000である。税額控除前の米国所得税は$44,000、支払った外国所得税は$12,000。当年の外国税額控除額はいくらか。",
      c: ["$12,000", "$8,800", "$3,200", "$2,400"],
      a: 1,
      ex: "控除限度額 = 44,000 × 40,000 / 200,000 = 8,800。外国税12,000のうち8,800が控除され、超過3,200は1年繰戻し・10年繰越が可能。全額$12,000は限度額を無視した誤り。",
    },
    {
      q: "A married couple is adopting a U.S. child (not a special-needs child). They paid $6,000 of qualified adoption expenses in Year 1, before the adoption was finalized, and $8,000 in Year 2, when the adoption became final. Assume the maximum credit is $17,000 per child and their modified AGI is below the phase-out range. What adoption credit may they claim in Year 2?",
      ja: "夫婦が米国内の子(特別な支援を要する子ではない)を養子にする。養子縁組成立前の1年目に適格養子費用$6,000、縁組が確定した2年目に$8,000を支払った。控除上限は子1人当たり$17,000、修正AGIは段階的縮小の範囲未満とする。2年目に適用できる養子縁組税額控除はいくらか。",
      c: ["$8,000", "$6,000", "$17,000", "$14,000"],
      a: 3,
      ex: "国内養子の場合、縁組確定前に支払った費用は支払年の翌年に、確定年以降の費用は支払年に控除する。1年目の6,000は2年目に、2年目の8,000も2年目に控除され合計14,000。",
    },
    {
      q: "Assume that for the current year an individual qualifies for the residential clean energy credit at a 30% rate. She installed solar panels on her principal residence at a cost of $20,000. Her regular tax liability before this credit is $4,000, and she has no other credits. Which of the following is correct?",
      ja: "当年に個人が30%の住宅用クリーンエネルギー税額控除の適用を受けられるとする。主たる住居に$20,000で太陽光パネルを設置した。この控除前の通常税額は$4,000で、他に税額控除はない。正しいものはどれか。",
      c: [
        "She claims a $6,000 credit and receives a $2,000 refund",
        "She claims a $4,000 credit, and the remaining $2,000 is permanently lost",
        "She deducts $20,000 as an itemized deduction",
        "She claims a $4,000 credit and carries the remaining $2,000 forward",
      ],
      a: 3,
      ex: "控除額 = 20,000 × 30% = 6,000。この控除は還付不能(nonrefundable)のため当年は税額4,000まで、残り2,000は翌年以降に繰越せる。",
    },
    {
      q: "An individual's tax liability before credits is $1,000. She is entitled to a $1,500 child and dependent care credit (nonrefundable) and an $800 earned income tax credit (refundable). Her federal income tax withholding was $500. What is her refund?",
      ja: "個人の税額控除前の税額は$1,000である。児童・扶養家族介護税額控除$1,500(還付不能)と勤労所得税額控除$800(還付可能)を受けられる。連邦所得税の源泉徴収額は$500。還付額はいくらか。",
      c: ["$1,300", "$1,800", "$800", "$300"],
      a: 0,
      ex: "還付不能の控除は税額1,000までしか使えず、税額は0となる(超過500は消滅)。還付額 = 源泉徴収500 + EITC800 = 1,300。$1,800は還付不能控除の超過分まで還付したとする誤り。",
    },
    {
      q: "A single taxpayer who itemizes reports regular taxable income of $180,000, after deducting $10,000 of state and local taxes. During the year she exercised incentive stock options with a bargain element of $40,000 and did not sell the shares. She also received $5,000 of interest on specified private activity bonds and $3,000 of interest on general obligation municipal bonds. What is her alternative minimum taxable income (AMTI) before the exemption?",
      ja: "項目別控除を選択する単身者の通常の課税所得は$180,000で、州・地方税$10,000を控除した後の金額である。当年にインセンティブ・ストック・オプション(ISO)を行使し、行使時の含み益は$40,000で株式は売却していない。また、特定私的活動債の利息$5,000と一般財源地方債の利息$3,000を受け取った。免除額控除前の代替ミニマム課税所得(AMTI)はいくらか。",
      c: ["$238,000", "$225,000", "$235,000", "$230,000"],
      a: 2,
      ex: "AMTI = 180,000 + SALT 10,000 + ISO含み益40,000 + 私的活動債利息5,000 = 235,000。一般財源地方債の利息はAMTIにも含まれない($238,000は誤り)。",
    },
    {
      q: "A single taxpayer has AMTI of $235,000 and regular tax of $35,000. Assume an AMT exemption of $88,100 (not phased out) and an AMT rate of 26% on the first $239,100 of the AMT base. What is the alternative minimum tax?",
      ja: "単身者のAMTIは$235,000、通常の税額は$35,000である。AMT免除額は$88,100(段階的縮小なし)、AMT課税ベースの最初の$239,100に26%の税率が適用されるとする。代替ミニマム税(AMT)の額はいくらか。",
      c: ["$38,194", "$26,100", "$0", "$3,194"],
      a: 3,
      ex: "AMT課税ベース = 235,000 − 88,100 = 146,900。暫定ミニマム税 = 146,900 × 26% = 38,194。AMT = 38,194 − 35,000 = 3,194。$38,194は通常税額を差し引いていない誤り。",
    },
    {
      q: "Assume the AMT exemption for a married couple filing jointly is $100,000 and is reduced by 50 cents for each dollar of AMTI in excess of $1,000,000. The couple's AMTI is $1,100,000. What is their AMT exemption?",
      ja: "夫婦合算申告のAMT免除額は$100,000で、AMTIが$1,000,000を超える1ドルごとに50セント減額されるとする。夫婦のAMTIは$1,100,000である。AMT免除額はいくらか。",
      c: ["$50,000", "$75,000", "$100,000", "$0"],
      a: 0,
      ex: "減額 = (1,100,000 − 1,000,000) × 50% = 50,000。免除額 = 100,000 − 50,000 = 50,000。$75,000は25%で減額した誤り。",
    },
    {
      q: "For purposes of the individual alternative minimum tax, which of the following is a tax preference item (rather than an adjustment)?",
      ja: "個人の代替ミニマム税において、調整項目(adjustment)ではなく租税優遇項目(preference item)に該当するものはどれか。",
      c: [
        "The bargain element on the exercise of incentive stock options",
        "Tax-exempt interest on specified private activity bonds",
        "State and local income taxes deducted as itemized deductions",
        "The standard deduction",
      ],
      a: 1,
      ex: "特定私的活動債の非課税利息は優遇項目でAMTIに加算する。ISOの含み益、SALT、標準控除は調整項目である(調整項目は後年に逆調整が生じうる)。",
    },
    {
      q: "An individual paid AMT in Year 1. Which portion of that AMT generates a minimum tax credit that may be carried forward to reduce regular tax in later years?",
      ja: "個人が1年目にAMTを納付した。後年の通常税額を減らすために繰り越せるミニマム税額控除を生じさせるのは、そのAMTのうちどの部分か。",
      c: [
        "The portion attributable to the disallowance of state and local taxes",
        "The portion attributable to the disallowance of the standard deduction",
        "The portion attributable to deferral items, such as the incentive stock option bargain element",
        "The portion attributable to tax-exempt private activity bond interest",
      ],
      a: 2,
      ex: "ミニマム税額控除はISO含み益や減価償却差異など、時期のずれ(繰延項目)から生じたAMTについてのみ生じる。SALT、標準控除、私的活動債利息などの除外項目(恒久差異)からは生じない。",
    },
    {
      q: "A sole proprietor with no wage income has net profit of $200,000 from his business. Assume the Social Security wage base is $176,100, the Social Security rate is 12.4%, and the Medicare rate is 2.9% (ignore the additional Medicare tax). What is his self-employment tax?",
      ja: "給与所得のない個人事業主の事業純利益は$200,000である。社会保障税の賃金基準上限は$176,100、社会保障税率12.4%、メディケア税率2.9%とする(追加メディケア税は無視)。自営業税の額はいくらか。",
      c: ["$30,600.00", "$28,259.10", "$27,636.40", "$27,192.70"],
      a: 3,
      ex: "自営業純所得 = 200,000 × 92.35% = 184,700。社会保障部分 = 176,100 × 12.4% = 21,836.40、メディケア部分 = 184,700 × 2.9% = 5,356.30、合計27,192.70。$30,600は92.35%も上限も適用しない誤り。",
    },
    {
      q: "During the year an individual earned $150,000 of wages subject to Social Security tax and had $60,000 of net profit from a side business. Assume the Social Security wage base is $176,100. What is her self-employment tax (rounded to the nearest dollar)?",
      ja: "個人は当年に社会保障税の対象となる給与$150,000を得て、副業から事業純利益$60,000を得た。社会保障税の賃金基準上限は$176,100とする。自営業税の額(1ドル未満四捨五入)はいくらか。",
      c: ["$8,478", "$4,843", "$1,607", "$9,180"],
      a: 1,
      ex: "自営業純所得 = 60,000 × 92.35% = 55,410。社会保障部分は上限残額(176,100 − 150,000 = 26,100)× 12.4% = 3,236。メディケア部分 = 55,410 × 2.9% = 1,607。合計4,843。給与を考慮しない$8,478は誤り。",
    },
    {
      q: "An individual who has no other self-employment income earned $420 of net profit from occasional freelance work. Assume the self-employment tax applies only if net earnings from self-employment are $400 or more. What is the individual's self-employment tax?",
      ja: "他に自営業所得のない個人が、臨時のフリーランス業務から事業純利益$420を得た。自営業税は自営業純所得が$400以上の場合にのみ課されるとする。この個人の自営業税はいくらか。",
      c: ["$64.26", "$59.34", "$0", "$52.08"],
      a: 2,
      ex: "自営業純所得 = 420 × 92.35% = 387.87で$400未満のため自営業税は課されない。純利益420で判定すると$59.34(387.87 × 15.3%)などと誤る。",
    },
    {
      q: "A sole proprietor incurred the following costs during the year: business meals with clients, $2,000; tickets to sporting events for clients, $3,000; food and beverages at the annual holiday party for all employees, $1,500; and meals while traveling away from home on business, $800. What total amount may be deducted on Schedule C?",
      ja: "個人事業主が当年に以下の費用を負担した:顧客との業務上の食事$2,000、顧客のためのスポーツ観戦チケット$3,000、全従業員向けの年次ホリデーパーティーの飲食$1,500、出張中の食事$800。Schedule Cで控除できる合計額はいくらか。",
      c: ["$3,300", "$2,900", "$4,400", "$5,900"],
      a: 1,
      ex: "顧客との食事2,000 × 50% = 1,000、出張中の食事800 × 50% = 400、従業員全員向けのレクリエーション・パーティーは100%で1,500、娯楽(観戦チケット)は控除不可。合計2,900。出張中の食事を100%とすると$3,300、娯楽を50%で含めると$4,400となり誤り。",
    },
    {
      q: "A self-employed consultant uses a 350-square-foot room in her home regularly and exclusively as her principal place of business. Her gross income from the business far exceeds her business expenses. If she uses the simplified method, assuming a rate of $5 per square foot for up to 300 square feet, what is her home office deduction?",
      ja: "自営のコンサルタントは自宅の350平方フィートの部屋を主たる事業所として定期的かつ専用に使用している。事業の総収入は事業費用を大きく上回る。簡便法(1平方フィート$5、300平方フィートまで)を用いた場合、ホームオフィス控除額はいくらか。",
      c: ["$1,500", "$1,750", "$1,050", "$0"],
      a: 0,
      ex: "簡便法の対象面積は300平方フィートが上限:300 × 5 = 1,500。350全体に適用した$1,750は誤り。簡便法では減価償却は計上せず、住宅ローン利息・固定資産税は全額をSchedule Aで扱う。",
    },
    {
      q: "A self-employed individual uses 10% of her home exclusively and regularly as her principal place of business and uses the regular (actual expense) method. Total home costs for the year: mortgage interest $12,000, real estate taxes $5,000, utilities $3,000, insurance $1,000; depreciation on the business portion is $2,000. Her gross income from the business is $6,000, and business expenses not related to the home are $3,500. How much of the home office expenses is disallowed and carried forward?",
      ja: "自営業者が自宅の10%を主たる事業所として定期的かつ専用に使用し、通常法(実費法)を用いる。当年の住宅費用は住宅ローン利息$12,000、固定資産税$5,000、光熱費$3,000、保険料$1,000で、事業用部分の減価償却費は$2,000である。事業の総収入は$6,000、住宅に関連しない事業費用は$3,500。ホームオフィス費用のうち否認され繰り越される金額はいくらか。",
      c: ["$2,000", "$1,200", "$0", "$1,600"],
      a: 3,
      ex: "上限 = 6,000 − 3,500 = 2,500。控除順序は①利息・税(10% × 17,000 = 1,700)、②運営費(10% × 4,000 = 400)、③減価償却。残り2,500 − 1,700 − 400 = 400のみ減価償却を控除でき、2,000 − 400 = 1,600が繰越となる。",
    },
    {
      q: "A self-employed individual drove her car 18,000 miles during the year: 12,000 miles for business, 4,000 miles commuting between her home and her regular office, and 2,000 personal miles. She paid $300 for parking and tolls on business trips and $600 for parking at her regular office. Assume the standard mileage rate is 70 cents per mile. What is her deductible vehicle expense?",
      ja: "自営業者は当年に自動車を18,000マイル走行した:業務12,000マイル、自宅と通常の事務所間の通勤4,000マイル、私用2,000マイル。業務上の移動での駐車料金・通行料$300と、通常の事務所での駐車料金$600を支払った。標準走行単価は1マイル70セントとする。控除可能な車両費はいくらか。",
      c: ["$11,500", "$9,300", "$8,700", "$8,400"],
      a: 2,
      ex: "業務走行12,000 × 0.70 = 8,400に業務上の駐車料金・通行料300を加え8,700。通勤は私的費用であり、通勤距離や通常の事務所での駐車料金は控除不可。",
    },
    {
      q: "Under the hobby loss rules, an activity (other than one involving horses) is presumed to be engaged in for profit if it:",
      ja: "趣味損失規定において、活動(馬に関するものを除く)が営利目的と推定されるのはどのような場合か。",
      c: [
        "Produces gross income in 3 of 5 consecutive years",
        "Shows a profit in 3 or more of 5 consecutive years",
        "Shows a profit in 2 or more of 7 consecutive years",
        "Is conducted for at least 500 hours during the year",
      ],
      a: 1,
      ex: "5年連続のうち3年以上で利益を計上していれば営利目的と推定される(馬の飼育・調教等は7年中2年)。総収入の有無や500時間基準(重要な関与の判定)は無関係である。",
    },
    {
      q: "An individual who actively participates in a rental real estate activity has a $28,000 loss from the activity, modified AGI of $130,000, and no passive income. Assume the special allowance is $25,000, reduced by 50% of modified AGI over $100,000. What amount of the rental loss is suspended and carried forward?",
      ja: "賃貸不動産活動に積極的に参加する個人は、当該活動から$28,000の損失を有し、修正AGIは$130,000、パッシブ所得はない。特別控除枠は$25,000で、修正AGIが$100,000を超える額の50%だけ減額されるとする。停止され繰り越される賃貸損失はいくらか。",
      c: ["$18,000", "$3,000", "$28,000", "$13,000"],
      a: 0,
      ex: "控除枠 = 25,000 − (130,000 − 100,000) × 50% = 10,000。損失28,000のうち10,000を控除し、残り18,000が停止損失として繰越。$3,000は減額前の枠25,000を用いた誤り。",
    },
    {
      q: "An individual sold her entire interest in a passive limited partnership to an unrelated buyer in a fully taxable transaction, recognizing a $10,000 gain. She had $30,000 of suspended passive losses from the activity and no other passive activities. What is the treatment of the suspended losses?",
      ja: "個人が受動的なリミテッド・パートナーシップ持分の全部を無関係の買主に完全課税取引で売却し、$10,000の利益を認識した。当該活動からの停止パッシブ損失は$30,000で、他にパッシブ活動はない。停止損失の取扱いはどうなるか。",
      c: [
        "Only $10,000 of the suspended losses may be deducted; $20,000 remains suspended",
        "The suspended losses are permanently lost upon disposition",
        "The suspended losses are added to the basis of other investments",
        "All $30,000 of the suspended losses are deductible, offsetting the $10,000 gain and $20,000 of nonpassive income",
      ],
      a: 3,
      ex: "パッシブ活動の持分全部を非関連者へ完全課税取引で処分すると、停止損失は全額解放され、処分益を超える部分は給与やポートフォリオ所得などの非パッシブ所得とも相殺できる。",
    },
    {
      q: "An individual invested $20,000 cash in an equipment leasing activity and personally guaranteed (with full recourse) a $10,000 loan used in the activity. The activity also has a $30,000 nonrecourse loan for which she is not personally liable (not qualified nonrecourse financing). Her share of the activity's loss is $45,000. Before considering the passive activity rules, how much of the loss is deductible under the at-risk rules?",
      ja: "個人が機器リース事業に現金$20,000を出資し、事業で使用する$10,000の借入について個人保証(リコース)を行った。事業には個人責任のない$30,000のノンリコース借入(適格ノンリコース金融ではない)もある。事業損失の持分は$45,000。パッシブ活動規定を考慮する前に、アットリスク規定のもとで控除可能な損失はいくらか。",
      c: ["$45,000", "$30,000", "$20,000", "$60,000"],
      a: 1,
      ex: "アットリスク額 = 現金20,000 + 個人責任のある借入10,000 = 30,000。ノンリコース借入(不動産の適格ノンリコース金融を除く)は含まれない。超過15,000は繰り越される。",
    },
    {
      q: "A single individual has a $500,000 net loss from her trade or business activities and $600,000 of interest, dividends, and capital gains. Assume the excess business loss threshold for single filers is $313,000. What amount is treated as an excess business loss and carried forward as part of a net operating loss?",
      ja: "単身者の事業活動からの純損失は$500,000、利息・配当・キャピタルゲインは$600,000である。単身者の超過事業損失の閾値は$313,000とする。超過事業損失として扱われ、純営業損失(NOL)の一部として繰り越される金額はいくらか。",
      c: ["$0", "$313,000", "$187,000", "$100,000"],
      a: 2,
      ex: "超過事業損失 = 事業純損失500,000 − 閾値313,000 = 187,000。当年は313,000のみ非事業所得と相殺でき、187,000はNOLとして翌年以降に繰り越される。非事業所得が損失を上回っても制限は適用される($0は誤り)。",
    },
    {
      q: "An individual has a $100,000 net operating loss carryforward that arose in 2022. In the current year, her taxable income before the NOL deduction is $90,000. What is her NOL deduction for the current year?",
      ja: "個人は2022年に発生した$100,000の純営業損失(NOL)繰越額を有している。当年のNOL控除前の課税所得は$90,000である。当年のNOL控除額はいくらか。",
      c: ["$90,000", "$80,000", "$100,000", "$72,000"],
      a: 3,
      ex: "2017年後に発生したNOLの控除は、NOL控除前課税所得の80%が上限:90,000 × 80% = 72,000。残り28,000は無期限に繰越される(繰戻しは原則不可)。NOL額の80%とした$80,000は誤り。",
    },
    {
      q: "An individual's prior-year AGI was $200,000 and her prior-year tax liability was $30,000. Her current-year tax liability is expected to be $50,000. To avoid an underpayment penalty, what is the minimum total of withholding and timely estimated tax payments she must make for the current year?",
      ja: "個人の前年のAGIは$200,000、前年の税額は$30,000であった。当年の税額は$50,000と見込まれる。過少納付ペナルティを回避するために、当年に必要な源泉徴収と期限内予定納税の最低合計額はいくらか。",
      c: ["$30,000", "$33,000", "$45,000", "$50,000"],
      a: 1,
      ex: "必要額は当年税額の90%(45,000)と前年税額の100%(前年AGIが$150,000超の場合は110%)のいずれか小さい方。110% × 30,000 = 33,000 < 45,000。前年AGIが$150,000を超えるため$30,000では不足する。",
    },
    {
      q: "Which of the following statements regarding the individual estimated tax underpayment penalty is correct?",
      ja: "個人の予定納税の過少納付ペナルティについて正しいものはどれか。",
      c: [
        "Federal income tax withheld from wages is generally treated as paid in equal amounts on each installment due date, regardless of when it was actually withheld",
        "The penalty is deductible as interest expense on Schedule A",
        "No penalty applies if the balance due after withholding and credits is less than $5,000",
        "A calendar-year individual's fourth installment is due on December 15 of the tax year",
      ],
      a: 0,
      ex: "源泉徴収税額は、実際の徴収時期にかかわらず各納期に均等に納付されたものとみなされる(年末に源泉徴収を増やして不足を解消できる)。ペナルティは控除不可、免除基準は$1,000未満、第4回納期は翌年1月15日である。",
    },
    {
      q: "A single individual has modified AGI of $260,000, which includes $80,000 of net investment income. Assume the net investment income tax threshold for a single filer is $200,000. What is her net investment income tax?",
      ja: "単身者の修正AGIは$260,000で、純投資所得$80,000を含む。単身者の純投資所得税(NIIT)の閾値は$200,000とする。NIITの額はいくらか。",
      c: ["$3,040", "$2,280", "$9,880", "$540"],
      a: 1,
      ex: "NIIT = 3.8% × (純投資所得80,000と、修正AGIの閾値超過額60,000のいずれか小さい方) = 60,000 × 3.8% = 2,280。純投資所得全額に課した$3,040は誤り。",
    },
    {
      q: "A married couple files jointly. One spouse earned wages of $220,000 and the other earned wages of $80,000; neither has self-employment income. Assume the additional Medicare tax threshold is $250,000 for a joint return and employers must withhold the tax on wages paid to an employee in excess of $200,000. What is the couple's additional Medicare tax liability?",
      ja: "夫婦合算申告の夫婦で、一方の給与は$220,000、他方は$80,000であり、いずれも自営業所得はない。追加メディケア税の閾値は合算申告で$250,000、雇用主は従業員への給与が$200,000を超える部分について源泉徴収しなければならないとする。夫婦の追加メディケア税の負担額はいくらか。",
      c: ["$180", "$900", "$0", "$450"],
      a: 3,
      ex: "合算給与300,000 − 閾値250,000 = 50,000 × 0.9% = 450。雇用主の源泉徴収は(220,000 − 200,000) × 0.9% = 180のみなので、不足270を申告時に納付する。$180は源泉徴収額にすぎない。",
    },
  ],
});

CPA.tbs({ id: "TBS-REG-22", section: "REG", chapter: "REG-03", title: "項目別控除(Schedule A)の計算",
  scenario: `<p>Hugo and Lena Park file a joint return. Their AGI is <b>$200,000</b>. They paid or incurred the following during the year:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Unreimbursed medical and dental expenses (including $1,000 for cosmetic surgery)</td><td>$18,000</td></tr>
<tr><td>State income tax withheld</td><td>$9,000</td></tr>
<tr><td>Real property tax on principal residence</td><td>$4,500</td></tr>
<tr><td>Interest on acquisition mortgage on principal residence (balance $600,000, incurred 2021)</td><td>$24,000</td></tr>
<tr><td>Interest on home equity loan used to pay for a family vacation</td><td>$2,000</td></tr>
<tr><td>Investment interest expense (net investment income is $3,000; no election)</td><td>$5,000</td></tr>
<tr><td>Cash contribution to their church</td><td>$8,000</td></tr>
<tr><td>Publicly traded stock held 6 years donated to a university (FMV $12,000; basis $5,000)</td><td>$12,000</td></tr></table>
<p>Assume: medical floor 7.5% of AGI; SALT cap $10,000; acquisition debt limit $750,000; standard deduction for a joint return $31,500.</p>
<p class="ja">Park夫妻は合算申告を行い、AGIは$200,000である。当年の支出は表のとおり:未補填の医療・歯科費$18,000(美容整形$1,000を含む)、州所得税の源泉徴収$9,000、主たる住居の固定資産税$4,500、主たる住居の取得ローン利息$24,000(残高$600,000、2021年借入)、家族旅行に充てたホームエクイティローンの利息$2,000、投資利息$5,000(純投資収益は$3,000、選択なし)、教会への現金寄付$8,000、6年保有の上場株式を大学へ寄付(時価$12,000、取得価額$5,000)。医療費の足切りはAGIの7.5%、SALT上限$10,000、取得債務上限$750,000、合算申告の標準控除$31,500とする。</p>`,
  rows: [
    { label: "Medical expense deduction(医療費控除)", type: "num", answer: 2000 },
    { label: "Deductible taxes(控除可能な税金)", type: "num", answer: 10000 },
    { label: "Deductible interest (mortgage and investment)(控除可能な支払利息)", type: "num", answer: 27000 },
    { label: "Charitable contribution deduction(寄付金控除)", type: "num", answer: 20000 },
    { label: "Total itemized deductions(項目別控除合計)", type: "num", answer: 59000 },
    { label: "Should the Parks itemize or take the standard deduction?(項目別控除と標準控除のどちらを選ぶべきか)", type: "select", options: ["Itemize", "Standard deduction", "Either; the amounts are equal"], answer: "Itemize" },
  ],
  explain: `<p>医療費:美容整形は対象外。(18,000 − 1,000) − 200,000 × 7.5% = 17,000 − 15,000 = 2,000。</p>
<p>税金:9,000 + 4,500 = 13,500 → SALT上限により10,000。</p>
<p>利息:取得ローン残高600,000は上限750,000以内のため24,000全額。旅行資金のホームエクイティローン利息は控除不可。投資利息は純投資収益3,000が上限(残り2,000は繰越)。24,000 + 3,000 = 27,000。</p>
<p>寄付:現金8,000 + 長期保有の上場株式は時価12,000 = 20,000。上限(現金60% = 120,000、キャピタルゲイン資産30% = 60,000)内。</p>
<p>合計 = 2,000 + 10,000 + 27,000 + 20,000 = 59,000 > 標準控除31,500のため項目別控除を選択する。</p>`,
});

CPA.tbs({ id: "TBS-REG-23", section: "REG", chapter: "REG-03", title: "個人事業(Schedule C)の純利益と自営業税",
  scenario: `<p>Rina Ortiz is a self-employed marketing consultant with no wage income. Her business records for the year show:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Gross receipts</td><td>$150,000</td></tr>
<tr><td>Office supplies and software</td><td>$8,000</td></tr>
<tr><td>Meals with clients (business discussed)</td><td>$4,000</td></tr>
<tr><td>Golf outings with clients</td><td>$2,500</td></tr>
<tr><td>Business miles driven in her car: 10,000 (standard mileage rate 70 cents); business parking and tolls $200</td><td>—</td></tr>
<tr><td>Home office: 250 sq ft used regularly and exclusively (simplified method, $5 per sq ft up to 300 sq ft)</td><td>—</td></tr>
<tr><td>Traffic fines incurred while driving to clients</td><td>$500</td></tr></table>
<p>Assume the Social Security wage base is $176,100 and the combined self-employment tax rate is 15.3% (12.4% + 2.9%). Ignore the additional Medicare tax and the QBI deduction.</p>
<p class="ja">Ortizは給与所得のない自営のマーケティング・コンサルタントである。当年の事業記録:総収入$150,000、事務用品・ソフトウェア$8,000、顧客との食事(業務の話あり)$4,000、顧客とのゴルフ$2,500、業務走行10,000マイル(標準単価70セント)と業務上の駐車料金・通行料$200、ホームオフィス250平方フィートを定期的かつ専用に使用(簡便法、1平方フィート$5、300平方フィートまで)、顧客訪問中の交通違反の罰金$500。社会保障税の賃金基準上限は$176,100、自営業税率は合計15.3%とする。追加メディケア税とQBI控除は無視する。</p>`,
  rows: [
    { label: "Deductible meals and entertainment(控除可能な食事・娯楽費)", type: "num", answer: 2000 },
    { label: "Deductible vehicle expense(控除可能な車両費)", type: "num", answer: 7200 },
    { label: "Home office deduction(ホームオフィス控除)", type: "num", answer: 1250 },
    { label: "Schedule C net profit(Schedule Cの純利益)", type: "num", answer: 131550 },
    { label: "Self-employment tax (rounded)(自営業税・四捨五入)", type: "num", answer: 18587, tol: 1 },
    { label: "Deduction for one-half of self-employment tax (rounded)(自営業税の1/2控除・四捨五入)", type: "num", answer: 9294, tol: 1 },
  ],
  explain: `<p>食事:顧客との食事4,000 × 50% = 2,000。ゴルフは娯楽であり控除不可。</p>
<p>車両費:10,000 × 0.70 + 200 = 7,200。ホームオフィス:250 × 5 = 1,250。罰金は公序に反するため控除不可。</p>
<p>純利益 = 150,000 − 8,000 − 2,000 − 7,200 − 1,250 = 131,550。</p>
<p>自営業純所得 = 131,550 × 92.35% = 121,486(賃金基準上限未満)。自営業税 = 121,486.43 × 15.3% ≒ 18,587。その1/2の9,294はAGI算定上の控除(for AGI)となる。</p>`,
});

CPA.tbs({ id: "TBS-REG-24", section: "REG", chapter: "REG-03", title: "個人の代替ミニマム税(AMT)の計算",
  scenario: `<p>Dana Wu, a single taxpayer, itemizes deductions. Her regular taxable income is <b>$250,000</b> after deducting $10,000 of state and local taxes, $15,000 of qualified home mortgage interest, and $5,000 of charitable contributions. Her regular tax liability is <b>$55,000</b>. Other information for the year:</p>
<ul><li>She exercised incentive stock options; the bargain element at exercise was $60,000. She still holds the shares at year-end.</li>
<li>She received $8,000 of interest on specified private activity bonds and $4,000 of interest on general obligation bonds of her city.</li></ul>
<p>Assume an AMT exemption of $88,100 (no phase-out applies), and AMT rates of 26% on the first $239,100 of the AMT base and 28% on the excess.</p>
<p class="ja">単身のWuは項目別控除を選択している。通常の課税所得は$250,000で、州・地方税$10,000、適格住宅ローン利息$15,000、寄付金$5,000を控除した後の金額である。通常の税額は$55,000。当年にISOを行使し行使時の含み益は$60,000(株式は年末も保有)。特定私的活動債の利息$8,000と市の一般財源債の利息$4,000を受け取った。AMT免除額は$88,100(段階的縮小なし)、AMT税率はAMT課税ベースの最初の$239,100に26%、超過分に28%とする。</p>`,
  rows: [
    { label: "AMT adjustment for state and local taxes(州・地方税に係るAMT調整額)", type: "num", answer: 10000 },
    { label: "AMT adjustment for the ISO exercise(ISO行使に係るAMT調整額)", type: "num", answer: 60000 },
    { label: "Treatment of the $4,000 general obligation bond interest(一般財源債の利息$4,000の取扱い)", type: "select", options: ["Added to AMTI as a preference item", "Added to AMTI as an adjustment", "Not included in AMTI"], answer: "Not included in AMTI" },
    { label: "Alternative minimum taxable income (AMTI)(代替ミニマム課税所得)", type: "num", answer: 328000 },
    { label: "Tentative minimum tax(暫定ミニマム税)", type: "num", answer: 62390 },
    { label: "Alternative minimum tax(代替ミニマム税)", type: "num", answer: 7390 },
  ],
  explain: `<p>AMTではSALTの控除は認められないため10,000を加算する。住宅取得ローン利息と寄付金はAMTでも控除可能で調整不要。</p>
<p>ISOの含み益60,000は調整項目、特定私的活動債の利息8,000は優遇項目として加算。一般財源債の利息はAMTIにも含まれない。</p>
<p>AMTI = 250,000 + 10,000 + 60,000 + 8,000 = 328,000。AMT課税ベース = 328,000 − 88,100 = 239,900。</p>
<p>暫定ミニマム税 = 239,100 × 26% + 800 × 28% = 62,166 + 224 = 62,390。AMT = 62,390 − 55,000 = 7,390。ISOに起因する部分は将来のミニマム税額控除の対象となる。</p>`,
});
