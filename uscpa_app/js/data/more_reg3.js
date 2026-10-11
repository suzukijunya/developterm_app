// REG の追加問題(第3弾)

CPA.extend("REG-01", {
  mcq: [
    {
      q: "An individual's correct tax liability is $80,000, but the return reported only $68,000. There is no substantial authority, no adequate disclosure, and no reasonable cause. What is the accuracy-related penalty for substantial understatement?",
      ja: "個人の正しい税額は$80,000だが、申告書には$68,000しか記載されていなかった。相当な根拠(substantial authority)、適切な開示、合理的な理由はいずれもない。過少申告に対する正確性関連ペナルティはいくらか。",
      c: ["$0, because the understatement does not exceed the threshold", "$1,200", "$2,400", "$9,000"],
      a: 2,
      ex: "過少申告額 12,000 が「正しい税額の10%(8,000)と$5,000の大きい方」を超えるため substantial understatement に該当。ペナルティ = 12,000 × 20% = 2,400。",
    },
    {
      q: "A taxpayer filed a fraudulent return with the intent to evade tax. The period during which the IRS may assess the tax is:",
      ja: "納税者が脱税の意図をもって不正な申告書を提出した。IRSが税額を更正(賦課)できる期間はどれか。",
      c: ["Three years from the filing date", "Six years from the filing date", "Seven years from the due date", "Unlimited"],
      a: 3,
      ex: "不正(fraud)の申告書や無申告の場合、賦課期間の制限はなく、IRSはいつでも更正できる。通常は3年、25%超の総所得の申告漏れは6年。",
    },
    {
      q: "Under Circular 230 §10.37, when providing written advice on a federal tax matter, a practitioner may NOT:",
      ja: "Circular 230 §10.37 のもとで、連邦税務に関する書面による助言を提供する際、実務家が行ってはならないことはどれか。",
      c: [
        "Rely on representations of the client that are reasonable and not known to be incorrect",
        "Take into account the likelihood that a return will be audited or that an issue will be raised on audit",
        "Base the advice on reasonable factual and legal assumptions",
        "Consider all relevant facts and circumstances that the practitioner knows or reasonably should know",
      ],
      a: 1,
      ex: "書面による助言では、税務調査を受ける可能性や論点が指摘される可能性(audit lottery)を考慮してはならない。合理的な前提や依頼人の合理的な表明への依拠は認められる。",
    },
    {
      q: "A paid preparer willfully understates a client's tax liability on a return for which the preparer charged a fee of $8,000. What is the preparer penalty under IRC §6694(b)?",
      ja: "有償の作成者が、$8,000の報酬を受け取った申告書で、故意に依頼人の税額を過少に記載した。IRC §6694(b)に基づく作成者ペナルティはいくらか。",
      c: ["$1,000", "$4,000", "$5,000", "$6,000"],
      a: 3,
      ex: "故意または無謀な(willful or reckless)行為による過少申告のペナルティは「$5,000 と報酬の75%の大きい方」。8,000 × 75% = 6,000 > 5,000 なので 6,000。",
    },
    {
      q: "Under the Ultramares doctrine, an accountant who negligently performs an audit is liable to:",
      ja: "Ultramares 判例の考え方のもとで、監査を過失により実施した会計士が責任を負う相手はどれか。",
      c: [
        "The client and third parties in privity or near privity with the accountant",
        "All reasonably foreseeable users of the financial statements",
        "Any person who purchases the client's securities in the open market",
        "No one other than the client, under any circumstances",
      ],
      a: 0,
      ex: "Ultramares 原則では、通常の過失の責任はクライアントと、契約関係(privity)またはそれに近い関係(会計士が特定の第三者による利用を知っている主要受益者)にある者に限られる。予見可能な利用者まで広げるのは少数説。",
    },
    {
      q: "Under Section 18 of the Securities Exchange Act of 1934, an accountant sued over a false statement in a filed document can avoid liability by proving that the accountant:",
      ja: "1934年証券取引所法第18条のもとで、提出書類の虚偽記載について訴えられた会計士は、何を証明すれば責任を免れるか。",
      c: [
        "Was not in privity with the plaintiff",
        "Acted in good faith and had no knowledge that the statement was false or misleading",
        "Performed the audit with due diligence after a reasonable investigation",
        "Did not intend to deceive the plaintiff, even if the accountant knew the statement was false",
      ],
      a: 1,
      ex: "第18条では原告が虚偽記載への信頼と損害を立証し、会計士は善意で虚偽を知らなかったことを立証すれば免責される。デューディリジェンスの抗弁は1933年法第11条のもの。",
    },
    {
      q: "Under IRC §7216, a tax return preparer who wants to use a client's tax return information to market the preparer's financial planning services must first:",
      ja: "IRC §7216 のもとで、申告書作成者が依頼人の申告情報を自らのファイナンシャルプランニング業務の勧誘に利用するには、まず何が必要か。",
      c: [
        "Notify the IRS in writing",
        "Obtain the client's prior written consent",
        "Wait until the return has been accepted by the IRS",
        "Do nothing, because the preparer already possesses the information",
      ],
      a: 1,
      ex: "§7216 は申告書作成以外の目的で申告情報を使用・開示することを原則禁止しており、事前に依頼人の書面による同意を得る必要がある。違反には民事・刑事の罰則がある。",
    },
    {
      q: "A taxpayer elects the small tax case procedure (S case) in the U.S. Tax Court for a deficiency of $30,000 for one tax year. Which statement is correct?",
      ja: "納税者が、1課税年度$30,000の不足税額について米国租税裁判所の少額事件手続(S case)を選択した。正しい記述はどれか。",
      c: [
        "The taxpayer must first pay the deficiency",
        "The case will be heard by a jury",
        "The decision cannot be appealed by either party",
        "The decision becomes binding precedent for future cases",
      ],
      a: 2,
      ex: "少額事件手続は1年あたり$50,000以下の争訟額で利用でき、手続は簡略化されるが、判決はどちらの当事者も上訴できず先例にもならない。租税裁判所では事前納付は不要で陪審もない。",
    },
  ],
});

CPA.extend("REG-02", {
  mcq: [
    {
      q: "A buyer and seller have a contract for the sale of goods. The seller later asks for a 5% price increase because of unexpected cost increases, and the buyer agrees in writing. The buyer gives nothing new in return. The modification is:",
      ja: "買主と売主の間に物品売買契約がある。売主は予想外のコスト増加を理由に5%の値上げを求め、買主は書面で同意した。買主は新たな対価を何も提供していない。この変更はどうなるか。",
      c: [
        "Unenforceable, because it lacks consideration",
        "Enforceable, because a good-faith modification under the UCC needs no consideration",
        "Enforceable only if the original contract was for less than $500",
        "Voidable at the option of the seller",
      ],
      a: 1,
      ex: "UCC では物品売買契約の誠実な変更に約因は不要。コモンロー(役務・不動産)では既存義務の原則により新たな約因がないと変更は拘束力をもたない。",
    },
    {
      q: "An agent contracts with a third party on behalf of an undisclosed principal. The third party later learns of the principal's identity. Which statement is correct?",
      ja: "代理人が開示されていない本人(undisclosed principal)のために第三者と契約した。第三者は後に本人の存在を知った。正しい記述はどれか。",
      c: [
        "Only the agent can be held liable on the contract",
        "Only the principal can be held liable on the contract",
        "The third party may elect to hold either the agent or the principal liable",
        "The contract is void because the principal was not disclosed",
      ],
      a: 2,
      ex: "非開示の本人の場合、代理人は契約当事者として個人責任を負う。第三者は本人を知った後、代理人か本人のいずれかを選択して責任を追及できる(選択後は他方に請求できない)。",
    },
    {
      q: "A buyer wrongfully repudiates a contract to buy goods for $10,000. The seller resells the goods in a commercially reasonable manner for $8,000 and incurs $300 of incidental resale expenses. What damages may the seller recover?",
      ja: "買主が$10,000で物品を購入する契約を不当に履行拒絶した。売主は商業上合理的な方法で物品を$8,000で転売し、付随的な転売費用$300を負担した。売主が回収できる損害額はいくらか。",
      c: ["$1,700", "$2,000", "$2,300", "$10,000"],
      a: 2,
      ex: "UCC の売主の転売による救済:契約価格と転売価格の差額に付随的損害を加える。(10,000 − 8,000) + 300 = 2,300。",
    },
    {
      q: "Lender A filed a financing statement covering Debtor's equipment on March 1 but did not make its loan until April 10. Lender B made a loan secured by the same equipment and filed a financing statement on March 20. Both security interests are perfected. Which lender has priority?",
      ja: "貸手Aは3月1日に債務者の設備を対象とする融資届出書を提出したが、融資の実行は4月10日だった。貸手Bは同じ設備を担保に融資を行い、3月20日に融資届出書を提出した。両者の担保権はいずれも対抗要件を備えている。優先するのはどちらか。",
      c: [
        "Lender B, because its security interest attached first",
        "Lender A, because it filed first",
        "Lender B, because it perfected first",
        "They share pro rata",
      ],
      a: 1,
      ex: "対抗要件を備えた担保権同士では「先に届出または対抗要件を備えた方」が優先する(first to file or perfect)。Aは3月1日に届出しているので、融資実行が後でもAが優先する。",
    },
    {
      q: "In a Chapter 7 bankruptcy, which of the following unsecured claims is paid first?",
      ja: "第7章の破産手続において、次の無担保債権のうち最初に支払われるものはどれか。",
      c: [
        "Wages earned within 180 days before the filing, up to the statutory limit",
        "Domestic support obligations, such as child support and alimony",
        "Federal income taxes for recent years",
        "General unsecured trade payables",
      ],
      a: 1,
      ex: "優先債権の順位は、家族扶養義務(domestic support obligations)が第1順位。次いで管財費用、賃金(上限あり)、従業員給付、一定の税金などと続き、一般無担保債権は最後。",
    },
    {
      q: "X and Y are co-sureties on a $100,000 loan, guaranteeing $40,000 and $60,000, respectively. The debtor defaults with $50,000 outstanding, and X pays the entire $50,000. How much can X recover from Y by way of contribution?",
      ja: "XとYは$100,000の借入れの共同保証人で、保証額はそれぞれ$40,000と$60,000である。債務者が残高$50,000で債務不履行となり、Xが$50,000を全額支払った。XがYに求償(負担部分の請求)できる額はいくらか。",
      c: ["$20,000", "$25,000", "$30,000", "$50,000"],
      a: 2,
      ex: "共同保証人は保証額の割合で負担する。Yの負担割合は 60,000 ÷ 100,000 = 60%。Yの負担額 = 50,000 × 60% = 30,000 をXはYに請求できる。",
    },
    {
      q: "Shareholders sue the directors of a corporation over a business decision that resulted in losses. The directors made the decision in good faith, after reasonable investigation, and without any conflict of interest. The directors are most likely:",
      ja: "株主が、損失をもたらした経営判断について取締役を訴えた。取締役は利益相反なく、合理的な調査の後、誠実にその判断を行った。取締役はどうなる可能性が最も高いか。",
      c: [
        "Liable, because directors guarantee the corporation's profitability",
        "Liable, because the decision caused losses to the shareholders",
        "Not liable, because of the business judgment rule",
        "Not liable, because directors owe no fiduciary duties to the corporation",
      ],
      a: 2,
      ex: "経営判断の原則(business judgment rule)により、十分な情報に基づき誠実かつ利益相反なく行われた判断は、結果的に損失が出ても取締役は責任を負わない。取締役は会社に注意義務・忠実義務を負う。",
    },
    {
      q: "A merchant seller sells goods to a buyer, who agrees to pick them up at the seller's warehouse. No common carrier is involved and the goods are not held by a bailee. Risk of loss passes to the buyer when:",
      ja: "商人である売主が物品を販売し、買主が売主の倉庫で引き取ることに合意した。運送人も受寄者も関与していない。危険はいつ買主に移転するか。",
      c: [
        "The contract is signed",
        "The seller tenders the goods and notifies the buyer",
        "The buyer pays for the goods",
        "The buyer takes physical possession of the goods",
      ],
      a: 3,
      ex: "運送人がいない場合、売主が商人なら買主が物品を受領(physical possession)した時に危険が移転する。売主が非商人なら、引渡しの提供(tender)の時に移転する。",
    },
  ],
});

CPA.extend("REG-03", {
  mcq: [
    {
      q: "A sole proprietor has net earnings from self-employment of $100,000 (below the Social Security wage base). What is the deduction for adjusted gross income for one-half of the self-employment tax (rounded)?",
      ja: "個人事業主の自営業純利益は$100,000(社会保障税の上限未満)である。自営業税の2分の1としてのAGI算定上の控除額(四捨五入)はいくらか。",
      c: ["$6,529", "$7,065", "$7,650", "$14,130"],
      a: 1,
      ex: "課税対象 = 100,000 × 92.35% = 92,350。自営業税 = 92,350 × 15.3% = 14,129.55。その半分 7,065 が above-the-line 控除となる。",
    },
    {
      q: "Sam, age 22, is a full-time college student who lived with his parents for the entire year except while at school. Sam earned $8,000 from a part-time job and did not provide over half of his own support. Sam is:",
      ja: "22歳のSamはフルタイムの大学生で、在学中を除き1年間両親と同居した。アルバイトで$8,000を稼いだが、自分の生活費の半分超は負担していない。Samはどのように扱われるか。",
      c: [
        "Not a dependent, because he is over age 18",
        "Not a dependent, because his gross income exceeds the limit",
        "A qualifying relative of his parents",
        "A qualifying child of his parents",
      ],
      a: 3,
      ex: "フルタイム学生は24歳未満なら qualifying child の年齢要件を満たす。在学中の不在は一時的不在として同居とみなされ、qualifying child には総所得要件がないため$8,000の稼ぎは問題にならない。",
    },
    {
      q: "An individual operates an activity not engaged in for profit (a hobby). Revenue from the activity is $6,000 and related expenses are $8,000. How should the individual report the activity?",
      ja: "個人が営利を目的としない活動(趣味)を行っている。その活動の収入は$6,000、関連費用は$8,000である。どのように申告すべきか。",
      c: [
        "Include $6,000 in gross income; no deduction for the expenses",
        "Include $6,000 in gross income and deduct $6,000 of expenses",
        "Report a $2,000 deductible loss",
        "Exclude the revenue because the activity is not a business",
      ],
      a: 0,
      ex: "趣味の収入は全額総所得に含まれるが、TCJA以降(OBBBAで恒久化)、趣味の費用は雑多な項目別控除として控除できない。よって$6,000を含め、費用は控除不可。",
    },
    {
      q: "A beneficiary elects to receive $100,000 of life insurance proceeds (paid due to the insured's death) in 10 annual installments of $12,000. How much of each installment is included in gross income?",
      ja: "受取人が、被保険者の死亡による生命保険金$100,000を、年$12,000の10回の分割払いで受け取ることを選択した。各回の受取額のうち総所得に含まれる額はいくらか。",
      c: ["$0", "$2,000", "$10,000", "$12,000"],
      a: 1,
      ex: "死亡保険金の元本部分は非課税で、各回 100,000 ÷ 10 = 10,000 が除外される。残り 12,000 − 10,000 = 2,000 は利息部分として課税される。",
    },
    {
      q: "A retiree's investment in an annuity contract is $60,000, and the expected return is $100,000. The retiree receives $10,000 of payments this year. How much is taxable?",
      ja: "退職者の年金契約への投資額は$60,000、予想受取総額は$100,000である。当年に$10,000を受け取った。課税される額はいくらか。",
      c: ["$0", "$4,000", "$6,000", "$10,000"],
      a: 1,
      ex: "除外率 = 60,000 ÷ 100,000 = 60%。非課税部分 = 10,000 × 60% = 6,000、課税部分 = 4,000。",
    },
    {
      q: "An individual who itemizes deductions paid $9,000 of investment interest expense. Net investment income (without electing to include qualified dividends or net capital gain) is $6,000. What is the current-year deduction and the treatment of the remainder?",
      ja: "項目別控除を行う個人が投資利息$9,000を支払った。純投資所得(適格配当や純キャピタルゲインを含める選択はしない)は$6,000である。当年の控除額と残額の扱いはどれか。",
      c: [
        "$9,000 deduction",
        "$6,000 deduction; $3,000 is lost",
        "$6,000 deduction; $3,000 carries forward indefinitely",
        "$3,000 deduction; $6,000 carries forward five years",
      ],
      a: 2,
      ex: "投資利息の控除は純投資所得が上限。6,000 を控除し、超過 3,000 は無期限に繰越せる。",
    },
    {
      q: "An individual who actively participates in a rental real estate activity has a $30,000 loss from it and modified AGI of $120,000. There is no other passive income. How much of the rental loss is deductible this year?",
      ja: "賃貸不動産活動に積極的に参加している個人が、その活動から$30,000の損失を計上し、修正AGIは$120,000である。他に受動的所得はない。当年に控除できる賃貸損失はいくらか。",
      c: ["$0", "$10,000", "$15,000", "$25,000"],
      a: 2,
      ex: "積極的参加者は最大$25,000まで非受動所得と相殺できるが、修正AGIが$100,000を超える部分の50%だけ減額される。25,000 − (120,000 − 100,000) × 50% = 15,000。残り15,000は繰越し(停止損失)。",
    },
    {
      q: "An individual's prior-year tax liability was $20,000 (prior-year AGI $90,000). Current-year tax is expected to be $30,000. What is the minimum amount of timely estimated tax payments and withholding needed to avoid the underpayment penalty?",
      ja: "個人の前年の税額は$20,000(前年AGIは$90,000)。当年の税額は$30,000と見込まれる。過少予定納税ペナルティを避けるために必要な、期限内の予定納税と源泉徴収の最低額はいくらか。",
      c: ["$20,000", "$22,000", "$27,000", "$30,000"],
      a: 0,
      ex: "セーフハーバーは「当年税額の90%(27,000)」と「前年税額の100%(20,000)」の小さい方。前年AGIが$150,000以下なので110%ルールは適用されず、20,000 で足りる。",
    },
  ],
});

CPA.extend("REG-04", {
  mcq: [
    {
      q: "A single taxpayer sells her principal residence, which she has owned and used as her main home for the past 4 years, realizing a gain of $300,000. She has not excluded gain on another home sale in the past 2 years. How much gain is recognized?",
      ja: "単身の納税者が、過去4年間所有し主たる住居として使用してきた自宅を売却し、$300,000の実現利益を得た。過去2年間に他の住宅売却で利益の除外を受けていない。認識される利益はいくらか。",
      c: ["$0", "$50,000", "$250,000", "$300,000"],
      a: 1,
      ex: "§121 により、5年間のうち2年以上の所有・居住要件を満たせば単身者は$250,000(夫婦合算は$500,000)まで除外できる。300,000 − 250,000 = 50,000 が課税対象。",
    },
    {
      q: "An individual sells a commercial building held for 10 years for $540,000. The building cost $500,000, and $80,000 of straight-line depreciation was taken. How much of the gain is unrecaptured §1250 gain taxed at a maximum rate of 25%?",
      ja: "個人が10年間保有した商業用建物を$540,000で売却した。取得原価は$500,000で、定額法による減価償却累計額は$80,000である。利益のうち最高税率25%が適用される unrecaptured §1250 gain はいくらか。",
      c: ["$0", "$40,000", "$80,000", "$120,000"],
      a: 2,
      ex: "利益 = 540,000 − (500,000 − 80,000) = 120,000。定額法の償却額のうち利益の範囲内の 80,000 が unrecaptured §1250 gain(最高25%)、残り 40,000 は通常の長期キャピタルゲイン税率。",
    },
    {
      q: "An individual has a $5,000 short-term capital loss and a $4,000 long-term capital loss for the year, and no capital gains. What capital loss carryover remains to the next year?",
      ja: "個人の当年の短期キャピタルロスは$5,000、長期キャピタルロスは$4,000で、キャピタルゲインはない。翌年に繰り越されるキャピタルロスはどれか。",
      c: [
        "$2,000 short-term and $4,000 long-term",
        "$5,000 short-term and $1,000 long-term",
        "$6,000 long-term",
        "No carryover",
      ],
      a: 0,
      ex: "当年は$3,000まで通常所得と相殺でき、短期ロスから先に使う。短期 5,000 − 3,000 = 2,000、長期 4,000 はそのまま繰越され、性質(短期・長期)も維持される。",
    },
    {
      q: "A married couple filing jointly sells qualifying §1244 small business stock that they acquired at original issuance, recognizing a $130,000 loss. How is the loss treated?",
      ja: "夫婦合算申告の夫婦が、当初発行時に取得した適格な§1244小規模事業株式を売却し、$130,000の損失を認識した。損失はどのように扱われるか。",
      c: [
        "$130,000 ordinary loss",
        "$50,000 ordinary loss and $80,000 capital loss",
        "$100,000 ordinary loss and $30,000 capital loss",
        "$130,000 capital loss",
      ],
      a: 2,
      ex: "§1244 株式の損失は年間$50,000(夫婦合算は$100,000)まで通常損失として扱われ、超過分はキャピタルロス。100,000 が通常損失、30,000 がキャピタルロス。",
    },
    {
      q: "Under MACRS, the mid-quarter convention must be used for personal property placed in service during the year if:",
      ja: "MACRSのもとで、当年に事業供用した動産について期央四半期法(mid-quarter convention)を使用しなければならないのはどの場合か。",
      c: [
        "Any property is placed in service in the fourth quarter",
        "More than 40% of the depreciable basis of such property is placed in service in the last quarter of the tax year",
        "More than 50% of the property is acquired from a related party",
        "The taxpayer elects to use the straight-line method",
      ],
      a: 1,
      ex: "当年に事業供用した動産(不動産等を除く)の減価償却基礎額の40%超が最終四半期に供用された場合、期央四半期法が強制される。それ以外は半年基準(half-year convention)。",
    },
    {
      q: "An heir inherits stock from a decedent and sells it at a gain 3 months after the decedent's death. The gain is:",
      ja: "相続人が被相続人から株式を相続し、死亡から3か月後に利益を出して売却した。この利益はどう扱われるか。",
      c: [
        "Short-term capital gain, because it was held less than one year",
        "Long-term capital gain, regardless of the actual holding period",
        "Ordinary income",
        "Excluded from gross income",
      ],
      a: 1,
      ex: "相続により取得した財産は、実際の保有期間にかかわらず常に長期保有として扱われる。取得価額は原則として死亡日の公正価値。",
    },
    {
      q: "On July 1 of the current year, a calendar-year business purchased the assets of another business, including goodwill valued at $90,000. What is the current-year amortization deduction for the goodwill for tax purposes?",
      ja: "暦年を事業年度とする事業者が、当年7月1日に他の事業の資産を購入し、その中に$90,000ののれんが含まれていた。税務上の当年ののれん償却額はいくらか。",
      c: ["$0", "$3,000", "$6,000", "$9,000"],
      a: 1,
      ex: "取得した §197 無形資産(のれん等)は、取得月から15年(180か月)の定額法で償却する。90,000 ÷ 180 × 6か月 = 3,000。税務では減損テストではなく償却を行う。",
    },
    {
      q: "A taxpayer sells business land held for 5 years at a loss. There are no other property transactions during the year. The loss is:",
      ja: "納税者が5年間保有した事業用土地を損失で売却した。当年に他の資産取引はない。この損失はどう扱われるか。",
      c: [
        "A capital loss subject to the $3,000 annual limit",
        "A §1231 loss deductible as an ordinary loss",
        "Nondeductible, because land is not depreciable",
        "A §1245 loss",
      ],
      a: 1,
      ex: "1年超保有の事業用資産(土地を含む)は§1231資産。純§1231損失は通常損失として全額控除でき、キャピタルロスの$3,000制限を受けない。",
    },
  ],
});

CPA.extend("REG-05", {
  mcq: [
    {
      q: "A C corporation has taxable income of $200,000 before any net operating loss deduction and an NOL carryforward of $300,000 that arose in a tax year beginning after 2020. What NOL carryforward remains after this year?",
      ja: "C法人の欠損金控除前の課税所得は$200,000で、2020年より後に開始した事業年度に生じた繰越欠損金(NOL)が$300,000ある。当年度後に残るNOLの繰越額はいくらか。",
      c: ["$100,000", "$140,000", "$160,000", "$300,000"],
      a: 1,
      ex: "2017年後に生じたNOLの控除は課税所得の80%が上限で、無期限に繰越せる(原則として繰戻しは不可)。控除 = 200,000 × 80% = 160,000、残り = 300,000 − 160,000 = 140,000。",
    },
    {
      q: "In a transaction qualifying under §351, a shareholder transfers property with an adjusted basis of $40,000 and a fair market value of $100,000 in exchange for stock worth $90,000 and $10,000 cash. What gain does the shareholder recognize?",
      ja: "§351の要件を満たす取引で、株主が取得価額$40,000、公正価値$100,000の資産を移転し、その対価として$90,000相当の株式と現金$10,000を受け取った。株主が認識する利益はいくらか。",
      c: ["$0", "$10,000", "$50,000", "$60,000"],
      a: 1,
      ex: "実現利益は 100,000 − 40,000 = 60,000 だが、認識されるのは実現利益と受け取ったブート(現金10,000)の小さい方の 10,000。株式の取得価額は 40,000 + 10,000 − 10,000 = 40,000。",
    },
    {
      q: "A C corporation with ample E&P distributes land to a shareholder. The land has an adjusted basis of $30,000 and a fair market value of $80,000. What gain does the corporation recognize, and what is the shareholder's dividend income?",
      ja: "十分なE&Pを持つC法人が株主に土地を分配した。土地の取得価額は$30,000、公正価値は$80,000である。法人が認識する利益と株主の配当所得はそれぞれいくらか。",
      c: [
        "Corporate gain $0; dividend $30,000",
        "Corporate gain $0; dividend $80,000",
        "Corporate gain $50,000; dividend $30,000",
        "Corporate gain $50,000; dividend $80,000",
      ],
      a: 3,
      ex: "含み益のある資産を分配した法人は売却したものとして利益 80,000 − 30,000 = 50,000 を認識する(含み損は認識しない)。株主は公正価値 80,000 を配当とし、土地の取得価額も80,000となる。",
    },
    {
      q: "An S corporation that was formerly a C corporation sells an asset that had a built-in gain at the time of the S election. The built-in gains tax applies if the asset is sold within what period after the S election, and at what rate?",
      ja: "以前C法人であったS法人が、S選択時に含み益を有していた資産を売却した。ビルトインゲイン税は、S選択後どの期間内に売却した場合に、どの税率で課されるか。",
      c: [
        "3 years; 15%",
        "5 years; 21%",
        "10 years; 35%",
        "5 years; at the shareholders' individual rates",
      ],
      a: 1,
      ex: "ビルトインゲイン税は、S選択から5年間の認識期間内に選択時点の含み益を実現した場合に、法人段階で最高法人税率21%で課税される。",
    },
    {
      q: "An S corporation shareholder has stock basis of $10,000 and has loaned the corporation $5,000. The shareholder's share of the corporation's ordinary loss is $18,000. Assuming the at-risk and passive activity rules do not further limit the loss, how much can the shareholder deduct this year?",
      ja: "S法人の株主の株式の取得価額は$10,000で、法人に$5,000を貸し付けている。法人の通常損失のうち株主の持分は$18,000である。危険負担額ルールや受動的活動ルールによる追加の制限がないとすると、当年に控除できる額はいくらか。",
      c: ["$5,000", "$10,000", "$15,000", "$18,000"],
      a: 2,
      ex: "S法人の損失は株式の取得価額と、株主から法人への直接の貸付けによる債権の取得価額(debt basis)の合計まで控除できる。10,000 + 5,000 = 15,000 を控除し、残り 3,000 は繰越す。",
    },
    {
      q: "A general partner's distributive share from a partnership engaged in a trade or business includes $40,000 of ordinary business income and $5,000 of long-term capital gain. The partner also receives a $20,000 guaranteed payment for services. What amount is the partner's net earnings from self-employment (before the 92.35% adjustment)?",
      ja: "事業を営むパートナーシップのジェネラルパートナーの分配持分には、通常の事業所得$40,000と長期キャピタルゲイン$5,000が含まれる。また、役務に対する保証支払(guaranteed payment)$20,000を受け取った。92.35%の調整前の自営業純利益はいくらか。",
      c: ["$40,000", "$45,000", "$60,000", "$65,000"],
      a: 2,
      ex: "ジェネラルパートナーの自営業所得には通常の事業所得の持分と役務の保証支払が含まれ、キャピタルゲインは除かれる。40,000 + 20,000 = 60,000。",
    },
    {
      q: "A partner with an outside basis of $25,000 receives a nonliquidating distribution of $10,000 cash and land with a partnership basis of $20,000 and a fair market value of $30,000. What is the partner's basis in the land?",
      ja: "持分の取得価額(outside basis)が$25,000のパートナーが、清算でない分配として現金$10,000と、パートナーシップでの取得価額$20,000・公正価値$30,000の土地を受け取った。パートナーの土地の取得価額はいくらか。",
      c: ["$15,000", "$20,000", "$25,000", "$30,000"],
      a: 0,
      ex: "まず現金で持分の取得価額を 25,000 − 10,000 = 15,000 に減らす。資産の取得価額はパートナーシップの取得価額(20,000)と残りの持分の取得価額(15,000)の小さい方の 15,000。利益は認識しない。",
    },
    {
      q: "A corporation must file Schedule M-3 instead of Schedule M-1 to reconcile book and taxable income when its total assets at the end of the tax year are at least:",
      ja: "法人が会計上の利益と課税所得の調整に Schedule M-1 ではなく Schedule M-3 を提出しなければならないのは、期末の総資産がいくら以上の場合か。",
      c: ["$250,000", "$1 million", "$10 million", "$50 million"],
      a: 2,
      ex: "期末総資産が$1,000万以上の法人は、より詳細な Schedule M-3 で帳簿と税務の差異を開示する。それ未満は Schedule M-1(総収入と総資産が$250,000未満なら M-1 等の記載も不要)。",
    },
  ],
});

CPA.tbs({
  id: "TBS-REG-06",
  section: "REG",
  chapter: "REG-03",
  title: "個人の課税所得の計算",
  scenario: `<p>Mika Ota, a single taxpayer with no dependents, reports the following for the current year:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Salary</td><td>$90,000</td></tr>
<tr><td>Interest on corporate bonds</td><td>$2,000</td></tr>
<tr><td>Interest on municipal bonds</td><td>$3,000</td></tr>
<tr><td>Qualified dividends</td><td>$1,500</td></tr>
<tr><td>Net long-term capital gain on stock sales</td><td>$4,000</td></tr>
<tr><td>Cash gift received from her aunt</td><td>$10,000</td></tr>
<tr><td>Deductible contribution to a traditional IRA</td><td>$6,000</td></tr>
<tr><td>Qualified student loan interest paid (fully deductible)</td><td>$2,000</td></tr>
<tr><td>State income taxes paid</td><td>$7,000</td></tr>
<tr><td>Home mortgage interest (qualified residence)</td><td>$6,000</td></tr></table>
<p>Assume the applicable standard deduction is <b>$15,000</b> and that no limitation applies to the itemized deductions listed. Ignore the QBI deduction.</p>
<p class="ja">扶養家族のいない単身の納税者Mika Otaの当年の項目:給与$90,000、社債利息$2,000、地方債利息$3,000、適格配当$1,500、株式売却の純長期キャピタルゲイン$4,000、叔母からの現金贈与$10,000、控除可能な従来型IRAへの拠出$6,000、適格な学生ローン利息$2,000(全額控除可)、州所得税$7,000、自宅の住宅ローン利息$6,000。適用される標準控除は$15,000とし、上記の項目別控除に制限はかからないものとする。QBI控除は無視する。</p>`,
  rows: [
    { label: "Gross income(総所得)", type: "num", answer: 97500 },
    { label: "Total deductions for AGI(AGI算定上の控除の合計)", type: "num", answer: 8000 },
    { label: "Adjusted gross income(調整後総所得 AGI)", type: "num", answer: 89500 },
    { label: "Total itemized deductions(項目別控除の合計)", type: "num", answer: 13000 },
    { label: "Deduction claimed from AGI(AGIから差し引く控除額)", type: "num", answer: 15000 },
    { label: "Taxable income(課税所得)", type: "num", answer: 74500 },
  ],
  explain: `<p>総所得 = 90,000 + 2,000 + 1,500 + 4,000 = 97,500。地方債利息と贈与は総所得から除外される。</p>
<p>AGI算定上の控除 = IRA 6,000 + 学生ローン利息 2,000 = 8,000 → AGI = 89,500。</p>
<p>項目別控除 = 州所得税 7,000 + 住宅ローン利息 6,000 = 13,000 < 標準控除 15,000 なので標準控除を選択。課税所得 = 89,500 − 15,000 = 74,500。</p>`,
});

CPA.tbs({
  id: "TBS-REG-07",
  section: "REG",
  chapter: "REG-05",
  title: "Schedule M-1(会計上の利益と課税所得の調整)",
  scenario: `<p>Hayashi Corp., a calendar-year C corporation, reports net income per books of <b>$300,000</b>. The following items were included in book income:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Federal income tax expense</td><td>$63,000</td></tr>
<tr><td>Interest income on municipal bonds</td><td>$10,000</td></tr>
<tr><td>Premiums on key-person life insurance (corporation is beneficiary)</td><td>$5,000</td></tr>
<tr><td>Business meals (50% deductible)</td><td>$8,000</td></tr>
<tr><td>Excess of capital losses over capital gains</td><td>$6,000</td></tr>
<tr><td>Fines paid to a government agency</td><td>$3,000</td></tr>
<tr><td>Depreciation per books (MACRS depreciation for tax is $55,000)</td><td>$40,000</td></tr></table>
<p class="ja">暦年のC法人Hayashi社の帳簿上の純利益は$300,000。帳簿上の利益には次の項目が含まれている:連邦法人税費用$63,000、地方債の受取利息$10,000、法人が受取人の役員生命保険料$5,000、事業上の飲食費$8,000(50%控除可)、キャピタルロスのキャピタルゲイン超過額$6,000、政府機関への罰金$3,000、帳簿上の減価償却費$40,000(税務上のMACRS償却額は$55,000)。</p>`,
  rows: [
    { label: "Income before federal income tax per books(税引前の帳簿上の利益)", type: "num", answer: 363000 },
    { label: "Nondeductible portion of business meals(飲食費の損金不算入額)", type: "num", answer: 4000 },
    { label: "Expenses recorded on books not deducted on the return(帳簿に計上され申告書で控除されない費用の合計)", type: "num", answer: 12000 },
    { label: "Income recorded on books not included on the return(帳簿に計上され申告書に含まれない収益)", type: "num", answer: 10000 },
    { label: "Deductions on the return not charged against book income(申告書で控除され帳簿上の費用でないもの)", type: "num", answer: 15000 },
    { label: "Taxable income(課税所得)", type: "num", answer: 356000 },
  ],
  explain: `<p>税引前利益 = 300,000 + 63,000 = 363,000。</p>
<p>帳簿上の費用で損金不算入 = 生命保険料 5,000 + 飲食費の50% 4,000 + 罰金 3,000 = 12,000。キャピタルロスの超過 6,000 も加算(M-1では別行)。</p>
<p>減算:地方債利息 10,000(非課税)、税務の償却超過 55,000 − 40,000 = 15,000。</p>
<p>課税所得 = 363,000 + 6,000 + 12,000 − 10,000 − 15,000 = 356,000。</p>`,
});

CPA.tbs({
  id: "TBS-REG-08",
  section: "REG",
  chapter: "REG-05",
  title: "パートナーの持分の取得価額と分配",
  scenario: `<p>On January 1, Kato's basis in his interest in the KM Partnership was <b>$40,000</b>, including his <b>$10,000</b> share of partnership liabilities. For the year, Kato's distributive share of partnership items was:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Ordinary business income</td><td>$25,000</td></tr>
<tr><td>Tax-exempt interest income</td><td>$2,000</td></tr>
<tr><td>Section 1231 gain</td><td>$3,000</td></tr>
<tr><td>Charitable contributions</td><td>$1,000</td></tr></table>
<p>At year-end, Kato's share of partnership liabilities was <b>$16,000</b>. During the year, Kato received a nonliquidating distribution of <b>$20,000</b> cash and land with a partnership basis of <b>$30,000</b> and a fair market value of <b>$45,000</b>.</p>
<p class="ja">1月1日時点のKatoのKMパートナーシップ持分の取得価額は$40,000で、パートナーシップ負債の持分$10,000を含む。当年のKatoの分配持分は、通常の事業所得$25,000、非課税利息$2,000、§1231利益$3,000、寄附金$1,000。期末のパートナーシップ負債の持分は$16,000。当年中に、清算でない分配として現金$20,000と、パートナーシップでの取得価額$30,000・公正価値$45,000の土地を受け取った。</p>`,
  rows: [
    { label: "Ordinary business income Kato reports(Katoが申告する通常の事業所得)", type: "num", answer: 25000 },
    { label: "Basis after increases, before distributions(増加項目反映後・分配前の取得価額)", type: "num", answer: 76000 },
    { label: "Gain recognized on the distribution(分配により認識する利益)", type: "num", answer: 0 },
    { label: "Kato's basis in the land(Katoの土地の取得価額)", type: "num", answer: 30000 },
    { label: "Kato's basis at year-end(期末の持分の取得価額)", type: "num", answer: 25000 },
  ],
  explain: `<p>パートナーは分配の有無にかかわらず分配持分 25,000 に課税される。</p>
<p>増加:40,000 + 25,000 + 2,000(非課税所得も加算)+ 3,000 + 負債持分の増加 6,000(現金拠出とみなす)= 76,000。</p>
<p>分配:現金 20,000 は取得価額 76,000 以下なので利益なし → 56,000。土地はパートナーシップの取得価額 30,000(< 56,000)を引き継ぐ → 26,000。</p>
<p>最後に寄附金 1,000 を減額 → 期末 25,000。</p>`,
});

CPA.tbs({
  id: "TBS-REG-09",
  section: "REG",
  chapter: "REG-04",
  title: "事業用資産の売却損益の性質(§1245・§1231)",
  scenario: `<p>During the current year, Mori, a sole proprietor, sold the following business assets, each held for more than one year. Mori has no nonrecaptured net §1231 losses from prior years.</p>
<table><tr><th>Asset</th><th>Cost</th><th>Accumulated depreciation</th><th>Sales price</th></tr>
<tr><td>Machine</td><td>$100,000</td><td>$60,000</td><td>$70,000</td></tr>
<tr><td>Truck</td><td>$50,000</td><td>$20,000</td><td>$55,000</td></tr>
<tr><td>Land (used as a parking lot)</td><td>$40,000</td><td>—</td><td>$32,000</td></tr></table>
<p class="ja">個人事業主のMoriは当年に次の事業用資産(いずれも1年超保有)を売却した。機械:取得原価$100,000、減価償却累計額$60,000、売却価格$70,000。トラック:取得原価$50,000、減価償却累計額$20,000、売却価格$55,000。駐車場として使用していた土地:取得原価$40,000、売却価格$32,000。過去年度の未回収の純§1231損失はない。</p>`,
  rows: [
    { label: "Section 1245 recapture on the machine(機械の§1245リキャプチャー)", type: "num", answer: 30000 },
    { label: "Section 1245 recapture on the truck(トラックの§1245リキャプチャー)", type: "num", answer: 20000 },
    { label: "Section 1231 gain on the truck(トラックの§1231利益)", type: "num", answer: 5000 },
    { label: "Net §1231 loss for the year, entered as a positive number(当年の純§1231損失:正の数で入力)", type: "num", answer: 3000 },
    { label: "Character of the net §1231 result(純§1231損益の性質)", type: "select", options: ["Ordinary loss", "Capital loss", "Long-term capital gain", "Ordinary income"], answer: "Ordinary loss" },
    { label: "Net ordinary income from these sales(これらの売却による通常所得の純額)", type: "num", answer: 47000 },
  ],
  explain: `<p>機械:利益 70,000 − 40,000 = 30,000。償却累計 60,000 の範囲内なので全額 §1245 の通常所得。</p>
<p>トラック:利益 55,000 − 30,000 = 25,000。償却累計 20,000 が §1245 リキャプチャー、残り 5,000 が §1231 利益。</p>
<p>土地:損失 8,000 は §1231 損失。純§1231 = 5,000 − 8,000 = −3,000 の純損失 → 通常損失。</p>
<p>通常所得の純額 = 30,000 + 20,000 − 3,000 = 47,000。</p>`,
});
