// BAR の追加問題(デリバティブ・株式報酬・外貨換算・公開会社報告ほか)

CPA.extend("BAR-02", {
  mcq: [
    {
      q: "Under ASC 815, which of the following is NOT a required characteristic for a financial instrument or other contract to meet the definition of a derivative?",
      ja: "ASC 815において、金融商品その他の契約がデリバティブの定義を満たすために必要な特性でないものはどれか。",
      c: [
        "It has one or more underlyings and one or more notional amounts or payment provisions",
        "It requires no initial net investment or an initial net investment smaller than would be required for similar responses to market changes",
        "Its terms require or permit net settlement, it can be readily settled net outside the contract, or it provides for delivery of an asset that puts the recipient in a position not substantially different from net settlement",
        "It is traded on an organized exchange with daily margin settlement",
      ],
      a: 3,
      ex: "デリバティブの3要件は①原資産(underlying)と想定元本(または支払条項)、②当初純投資がゼロまたは僅少、③純額決済である。取引所取引であることは要件ではなく、相対(OTC)のフォワードやスワップもデリバティブに該当する。",
    },
    {
      q: "A company has a $5,000,000 fixed-rate note payable and enters into a receive-fixed, pay-SOFR interest rate swap that it designates as a fair value hedge of the note's benchmark interest rate risk. During the year, benchmark rates rise. The swap's fair value decreases by $120,000, and the fair value of the note attributable to changes in the benchmark rate decreases by $115,000. What is the carrying amount of the note at year-end (ignoring any premium or discount)?",
      ja: "会社は$5,000,000の固定利付借入金を有し、受取固定・支払SOFRの金利スワップを契約して借入金の指標金利リスクの公正価値ヘッジに指定した。当期に指標金利が上昇し、スワップの公正価値は$120,000減少、指標金利の変動に起因する借入金の公正価値は$115,000減少した。期末の借入金の帳簿価額はいくらか(プレミアム・ディスカウントは無視)。",
      c: ["$5,000,000", "$4,880,000", "$4,885,000", "$5,115,000"],
      a: 2,
      ex: "公正価値ヘッジではヘッジ対象の帳簿価額をヘッジされたリスクに起因する公正価値変動だけ調整する(basis adjustment)。5,000,000 − 115,000 = 4,885,000。スワップの損失120,000と借入金の利益115,000はともに損益に計上され、差額5,000が純損益に影響する。$4,880,000はスワップの変動額で調整した誤り。",
    },
    {
      q: "In Year 1, a company designated a foreign currency forward as a cash flow hedge of a forecasted purchase of manufacturing equipment. A cumulative gain of $40,000 on the forward was recorded in accumulated other comprehensive income. On January 1, Year 2, the company purchased the equipment for $800,000 and began depreciating it straight-line over 10 years with no salvage value. What amount should be reclassified from AOCI to earnings in Year 2?",
      ja: "第1年度、会社は製造設備の予定購入に対する為替予約をキャッシュフロー・ヘッジに指定し、為替予約の累積利益$40,000をその他の包括利益累計額(AOCI)に計上した。第2年度1月1日に設備を$800,000で購入し、残存価額ゼロ・耐用年数10年の定額法で減価償却を開始した。第2年度にAOCIから損益へ組替えるべき金額はいくらか。",
      c: ["$40,000", "$0", "$4,000", "$8,000"],
      a: 2,
      ex: "キャッシュフロー・ヘッジのAOCIは、ヘッジ対象の予定取引が損益に影響する期間に組替える。設備購入の場合は減価償却を通じて損益に影響するため、40,000 ÷ 10 = 4,000を毎年組替える。購入時に一括で組替える($40,000)のは誤り。",
    },
    {
      q: "A company has been applying cash flow hedge accounting to a forecasted sale. Accumulated other comprehensive income includes a $25,000 deferred loss on the hedging instrument. The company now determines that it is probable that the forecasted sale will NOT occur by the end of the originally specified time period or within an additional two-month period. How should the $25,000 be treated?",
      ja: "会社は予定販売取引にキャッシュフロー・ヘッジ会計を適用しており、AOCIにヘッジ手段の繰延損失$25,000がある。予定販売が当初の期間内およびその後2か月以内に発生しない可能性が高い(probable)と判断した。$25,000はどのように処理すべきか。",
      c: [
        "Reclassify it from AOCI into earnings immediately",
        "Leave it in AOCI until the original forecasted date and then reclassify it",
        "Leave it in AOCI permanently because the hedge was effective while designated",
        "Reclassify it to retained earnings as a direct adjustment",
      ],
      a: 0,
      ex: "予定取引が発生しない可能性が高くなった場合、AOCIの累積額は直ちに損益へ組替える。単にprobableでなくなった(reasonably possible)だけであれば、ヘッジ会計を中止してもAOCIは予定取引が損益に影響するまで据え置く点と区別する。",
    },
    {
      q: "A U.S. parent borrowed €2,000,000 and designated the debt as a hedge of its net investment in a German subsidiary whose functional currency is the euro. The net investment exceeds €2,000,000. During the year, the euro strengthened from $1.10 to $1.15. How should the parent report the $100,000 foreign currency loss on the euro-denominated debt in its consolidated financial statements?",
      ja: "米国親会社は€2,000,000を借入れ、ユーロを機能通貨とするドイツ子会社への純投資のヘッジに指定した。純投資は€2,000,000を超える。当期にユーロは$1.10から$1.15へ上昇した。ユーロ建借入金に生じた為替差損$100,000は連結財務諸表上どのように報告すべきか。",
      c: [
        "As a transaction loss in net income",
        "As a deferred charge on the balance sheet until the debt is repaid",
        "In other comprehensive income as part of the cumulative translation adjustment",
        "As an adjustment to the carrying amount of the investment in the subsidiary",
      ],
      a: 2,
      ex: "純投資ヘッジとして有効なヘッジ手段の損益は、換算調整勘定(CTA)の一部としてOCIに計上し、子会社の換算差益と相殺する。在外事業体の売却または実質的な清算時に損益へ組替える。通常の外貨建取引のように純損益に計上するのは誤り。",
    },
    {
      q: "Which of the following statements about documentation and effectiveness assessment for hedge accounting under ASC 815 (as amended by ASU 2017-12) is correct for a public business entity?",
      ja: "ASU 2017-12により改訂されたASC 815において、公開企業のヘッジ会計の文書化と有効性評価に関する記述として正しいものはどれか。",
      c: [
        "Formal documentation may be prepared at any time before the first annual financial statements are issued",
        "Formal documentation of the hedging relationship, risk management objective and effectiveness method must exist at inception, but the initial prospective quantitative assessment may be completed by the first quarterly effectiveness assessment date",
        "A quantitative effectiveness test is required every quarter for every hedging relationship, even after an initial quantitative test shows the hedge is highly effective",
        "A hedge is considered highly effective if offset is between 50% and 150%",
      ],
      a: 1,
      ex: "ヘッジ関係・リスク管理目的・有効性評価方法の正式な文書化はヘッジ開始時点で必要だが、当初の定量的な事前有効性評価は最初の四半期評価日までに完了すればよい。その後は条件により定性的評価も可能。高い有効性の目安は80%〜125%である。",
    },
    {
      q: "A company's derivative designated as a cash flow hedge of a forecasted purchase increased in fair value by $108,000 during the period. The change in the present value of the hedged forecasted cash flows was $120,000 in the opposite direction, and the hedge remains highly effective. Under ASC 815 as amended by ASU 2017-12, how is the $108,000 gain reported for the period?",
      ja: "予定購入のキャッシュフロー・ヘッジに指定したデリバティブの公正価値が当期に$108,000増加した。ヘッジ対象の予定キャッシュフローの現在価値の変動は逆方向に$120,000であり、ヘッジは引き続き高度に有効である。ASU 2017-12改訂後のASC 815で、$108,000の利益はどのように報告されるか。",
      c: [
        "$96,000 in OCI and $12,000 in earnings as ineffectiveness",
        "$108,000 in earnings",
        "$120,000 in OCI",
        "$108,000 in OCI and $0 in earnings",
      ],
      a: 3,
      ex: "ASU 2017-12以降、高度に有効なキャッシュフロー・ヘッジでは(除外部分を除き)ヘッジ手段の公正価値変動の全額をOCIに計上し、非有効部分を別個に測定・計上しない。ヘッジ対象が損益に影響する時点で、ヘッジ対象と同じ損益表示科目へ組替える。",
    },
    {
      q: "A company purchased a foreign currency put option for a $24,000 premium, all of which was time value, and designated it as a 12-month cash flow hedge. It excluded the option's time value from the assessment of effectiveness and elected the amortization approach for the excluded component. After 6 months, the fair value of the time value component has declined to $9,000. How much should be recognized in earnings for the excluded component for the 6 months?",
      ja: "会社はプレミアム$24,000(全額が時間価値)で通貨プットオプションを購入し、12か月のキャッシュフロー・ヘッジに指定した。時間価値を有効性評価から除外し、除外部分について償却アプローチを選択した。6か月後、時間価値の公正価値は$9,000に減少した。6か月間に除外部分について損益に計上すべき金額はいくらか。",
      c: ["$12,000", "$15,000", "$24,000", "$0"],
      a: 0,
      ex: "償却アプローチでは除外部分の当初価値24,000を体系的かつ合理的な方法でヘッジ期間にわたり損益に認識する。24,000 × 6/12 = 12,000。時間価値の実際の変動15,000(24,000 − 9,000)との差額3,000はOCIに計上する。$15,000は時価評価アプローチを選んだ場合の金額である。",
    },
    {
      q: "Which of the following features embedded in a debt host contract issued at par would most likely be required to be bifurcated and accounted for separately as a derivative?",
      ja: "額面発行の債務ホスト契約に組み込まれた次の特徴のうち、デリバティブとして区分処理(分離)が求められる可能性が最も高いものはどれか。",
      c: [
        "A call option permitting the issuer to prepay the debt at par",
        "Interest payments indexed to the return on the S&P 500 equity index",
        "An interest rate cap that is out of the money when the debt is issued",
        "Interest payments indexed to the inflation rate of the economy in whose currency the debt is denominated",
      ],
      a: 1,
      ex: "組込デリバティブは、①ホスト契約と経済的特性・リスクが明確かつ密接に関連していない、②混合商品全体が公正価値で評価され損益計上されていない、③独立ならデリバティブに該当する、の全要件で区分処理する。株価指数連動の利息は債務ホストと密接に関連しない。額面でのコール、発行時アウト・オブ・ザ・マネーのキャップ、自国通貨のインフレ連動は密接に関連するとされる。",
    },
    {
      q: "A bakery enters into a forward contract to buy wheat at a fixed price for physical delivery over the next six months in quantities it expects to use in production. The contract could be net settled, but the bakery documents that it will take delivery. If the bakery elects the normal purchases and normal sales scope exception, how is the contract accounted for before delivery?",
      ja: "パン製造会社は、今後6か月間に生産で使用する見込みの数量の小麦を固定価格で現物引取りする先渡契約を締結した。契約は純額決済も可能だが、会社は現物を引き取る旨を文書化している。通常の購入・販売の適用除外を選択した場合、引渡前の契約はどのように処理されるか。",
      c: [
        "It is measured at fair value with changes in earnings",
        "It is measured at fair value with changes in OCI until delivery",
        "It is not recognized at fair value; it is accounted for as an executory contract and purchases are recorded on delivery",
        "It must be designated as a cash flow hedge",
      ],
      a: 2,
      ex: "通常の購入・販売の例外(NPNS)を適用した契約はデリバティブ会計の対象外となり、公正価値で認識せず未履行契約として扱い、引渡時に購入を記録する。現物引渡しの可能性が高く、通常の事業で使用する数量であることが要件で、文書化が必要である。",
    },
    {
      q: "Which of the following statements correctly distinguishes futures contracts from forward contracts?",
      ja: "先物契約(futures)と先渡契約(forward)の違いを正しく述べたものはどれか。",
      c: [
        "Forward contracts are standardized and exchange-traded, while futures are customized over-the-counter agreements",
        "Futures contracts are standardized, exchange-traded and settled daily through margin accounts, while forwards are customized and generally settled at maturity with greater counterparty credit risk",
        "Futures contracts require a large up-front premium, while forwards require none",
        "Only forward contracts can qualify as derivatives under ASC 815",
      ],
      a: 1,
      ex: "先物は標準化された取引所取引で、値洗いにより日々証拠金で決済されるため信用リスクは小さい。先渡は相対で条件を個別に設定し、通常満期に決済されるためカウンターパーティの信用リスクがある。プレミアムを支払うのはオプションであり、どちらもデリバティブに該当しうる。",
    },
    {
      q: "On November 1, a U.S. company entered into a forward contract to sell €1,000,000 on January 31 at a forward rate of $1.12 per euro. At December 31, the forward rate for a contract maturing January 31 is $1.10 and the spot rate is $1.09. Ignoring discounting, what is the fair value of the forward contract at December 31?",
      ja: "11月1日、米国企業は1月31日に€1,000,000を1ユーロ$1.12で売却する為替予約を締結した。12月31日時点で1月31日満期の先渡レートは$1.10、直物レートは$1.09である。割引を無視した場合、12月31日の為替予約の公正価値はいくらか。",
      c: ["$20,000 asset", "$20,000 liability", "$30,000 asset", "$0"],
      a: 0,
      ex: "為替予約の公正価値は残存期間の先渡レートの変動で測定する。$1.12で売る権利を持ち、現在の先渡レートは$1.10なので (1.12 − 1.10) × 1,000,000 = 20,000の資産。直物レートを使うと$30,000となり誤り。ユーロ安で売予約は有利となるため負債ではない。",
    },
    {
      q: "A company holds a purchased call option on 1,000 shares of another company's stock with a strike price of $50 per share. At year-end, the stock trades at $58 per share and the option's fair value is $11,000. What is the time value of the option at year-end?",
      ja: "会社は他社株式1,000株に対する権利行使価格$50の購入コールオプションを保有している。期末の株価は$58、オプションの公正価値は$11,000である。期末のオプションの時間価値はいくらか。",
      c: ["$8,000", "$11,000", "$0", "$3,000"],
      a: 3,
      ex: "本源的価値 = (58 − 50) × 1,000 = 8,000。時間価値 = 公正価値11,000 − 本源的価値8,000 = 3,000。$8,000は本源的価値そのものである。",
    },
    {
      q: "A U.S. company entered into a firm commitment to purchase equipment for FC 1,000,000 and hedged the commitment with a forward contract designated as a fair value hedge of foreign currency risk. Before delivery, the forward contract gained $40,000 and the firm commitment lost $40,000 in fair value attributable to the hedged risk. On delivery, the company paid $1,240,000 (the spot rate equivalent) and settled the forward. At what amount should the equipment be initially recorded?",
      ja: "米国企業はFC 1,000,000で設備を購入する確定契約を締結し、為替予約で外貨リスクの公正価値ヘッジを行った。引渡前に為替予約は$40,000の利益、確定契約はヘッジ対象リスクに起因して$40,000の公正価値損失となった。引渡時に会社は直物換算額$1,240,000を支払い、為替予約を決済した。設備の当初計上額はいくらか。",
      c: ["$1,240,000", "$1,200,000", "$1,280,000", "$1,000,000"],
      a: 1,
      ex: "確定契約の公正価値変動は資産・負債(ここでは負債40,000)として認識し、取得資産の帳簿価額の調整として消去する。1,240,000 − 40,000 = 1,200,000で、ヘッジにより固定した価格となる。支払額のまま$1,240,000とするのは確定契約負債の振替を漏らした誤り。",
    },
    {
      q: "A company has $10,000,000 of variable-rate debt bearing interest at SOFR + 1%. To fix its interest cost, it entered into a pay-fixed 4%, receive-SOFR interest rate swap with a $10,000,000 notional amount and designated it as a cash flow hedge. During the year, SOFR averaged 5% and the swap is perfectly effective. What total interest expense should the company report for the year?",
      ja: "会社はSOFR + 1%の変動利付借入金$10,000,000を有する。金利を固定するため、想定元本$10,000,000の支払固定4%・受取SOFRの金利スワップを締結し、キャッシュフロー・ヘッジに指定した。当期のSOFRは平均5%で、スワップは完全に有効である。当期に報告すべき支払利息の総額はいくらか。",
      c: ["$600,000", "$500,000", "$400,000", "$700,000"],
      a: 1,
      ex: "借入金の利息は6% × 10,000,000 = 600,000。スワップの純受取額(5% − 4%) × 10,000,000 = 100,000はAOCIから支払利息へ組替えられ、支払利息は500,000(固定4% + スプレッド1%)となる。$400,000はスプレッド1%を見落とした誤り。",
    },
    {
      q: "Which of the following hedging relationships is most likely to qualify for the shortcut method under ASC 815?",
      ja: "ASC 815のショートカット法の適用要件を満たす可能性が最も高いヘッジ関係はどれか。",
      c: [
        "A commodity forward contract hedging forecasted purchases of inventory",
        "A purchased foreign currency option hedging a forecasted foreign-currency-denominated sale",
        "An interest rate swap with zero fair value at inception whose notional amount and repricing dates match a recognized fixed-rate note with no prepayment option",
        "An interest rate swap whose notional amount is larger than the principal of the hedged debt",
      ],
      a: 2,
      ex: "ショートカット法は金利スワップと認識済みの利付資産・負債(または一定の予定取引)の組合せに限られ、想定元本の一致、開始時の公正価値ゼロ、期限前償還条項の整合などの条件を満たす場合にヘッジが完全に有効と仮定できる。商品先渡や通貨オプションには適用できず、想定元本の不一致は要件を満たさない。",
    },
    {
      q: "A company discontinues a fair value hedge of its fixed-rate debt because it terminates the interest rate swap. At that date, the carrying amount of the debt includes a $30,000 cumulative basis adjustment from hedge accounting. How should the $30,000 basis adjustment be accounted for?",
      ja: "会社は金利スワップを解約したため、固定利付借入金の公正価値ヘッジを中止した。その時点で、借入金の帳簿価額にはヘッジ会計による累積のベーシス調整$30,000が含まれている。$30,000のベーシス調整はどのように処理すべきか。",
      c: [
        "Reverse it immediately against earnings on the discontinuation date",
        "Transfer it to accumulated other comprehensive income",
        "Leave it in the carrying amount of the debt permanently without amortization",
        "Amortize it to earnings as a yield adjustment over the remaining life of the debt",
      ],
      a: 3,
      ex: "公正価値ヘッジ中止後も、ヘッジ対象の帳簿価額に含まれるベーシス調整は取り消さず、利付金融商品であれば残存期間にわたり利回り調整として償却する。中止時に一括で損益に戻すのは誤りで、AOCIに振り替えるのはキャッシュフロー・ヘッジとの混同である。",
    },
    {
      q: "On January 1, Year 1, a company granted 9,000 stock options that vest in three equal tranches at the end of Year 1, Year 2 and Year 3 (service condition only). The grant-date fair value is $6 per option for every tranche. Using the graded-vesting (accelerated) attribution method, how much compensation cost should be recognized in Year 1?",
      ja: "第1年度1月1日、会社は第1年度末・第2年度末・第3年度末に3分の1ずつ権利確定する(勤務条件のみ)ストック・オプション9,000個を付与した。付与日の公正価値は各トランシェとも1個$6である。段階的(加速)配分法を用いた場合、第1年度に認識すべき報酬費用はいくらか。",
      c: ["$18,000", "$33,000", "$54,000", "$6,000"],
      a: 1,
      ex: "各トランシェ3,000個 × $6 = 18,000を各々の権利確定期間で配分する。第1トランシェ18,000 + 第2トランシェ18,000 ÷ 2 = 9,000 + 第3トランシェ18,000 ÷ 3 = 6,000 = 33,000。$18,000は定額法(勤務条件のみの場合は選択可)による金額である。",
    },
    {
      q: "On January 1, Year 1, a company granted 12,000 restricted stock units with a grant-date fair value of $25 each. The units vest at the end of Year 3 only if cumulative revenue reaches a specified target. At the end of Year 1, achievement was considered probable and $100,000 of cost was recognized. At the end of Year 2, the company concludes that achieving the target is no longer probable. What should be recognized in Year 2?",
      ja: "第1年度1月1日、会社は付与日公正価値1単位$25の譲渡制限付株式ユニット(RSU)12,000単位を付与した。3年間の累積売上高が目標に達した場合にのみ第3年度末に権利確定する。第1年度末には達成可能性が高いと判断し$100,000を費用計上した。第2年度末に目標達成の可能性は高くないと判断した。第2年度に認識すべき金額はどれか。",
      c: [
        "A $100,000 reduction (reversal) of previously recognized compensation cost",
        "$100,000 of compensation cost",
        "$0, because compensation cost previously recognized is never reversed",
        "$200,000 of compensation cost",
      ],
      a: 0,
      ex: "業績条件(performance condition)は達成可能性の評価により費用認識を判断し、probableでなくなれば累計額をゼロに修正するため既認識の100,000を戻し入れる。既認識費用を戻さないのは市場条件(market condition)の場合である。",
    },
    {
      q: "A company granted stock options that vest only if the company's share price reaches $60 for 20 consecutive trading days within three years and the employee remains employed for the three years. The employees rendered the full three years of service, but the share price never reached $60, so the options never vested. What happens to the compensation cost previously recognized?",
      ja: "会社は、3年以内に株価が20営業日連続で$60に達し、かつ従業員が3年間在籍した場合にのみ権利確定するストック・オプションを付与した。従業員は3年間勤務したが株価は$60に達せず、オプションは権利確定しなかった。既に認識した報酬費用はどうなるか。",
      c: [
        "It is reversed because the options never vested",
        "It is reclassified to other comprehensive income",
        "It is not reversed, because the market condition was already reflected in the grant-date fair value and the requisite service was rendered",
        "Half of it is reversed, reflecting the probability of achievement",
      ],
      a: 2,
      ex: "市場条件の達成可能性は付与日の公正価値(モンテカルロ等)に織り込まれるため、必要な勤務が提供されていれば、市場条件が未達でも費用は戻し入れない。業績条件と異なり、達成可能性の再評価による修正は行わない。",
    },
    {
      q: "A company repriced 5,000 fully vested employee stock options. Immediately before the modification, the fair value of each option was $4; immediately after the modification, the fair value was $7. The original grant-date fair value was $10 per option. What amount of compensation cost should be recognized as a result of the modification?",
      ja: "会社は権利確定済みの従業員ストック・オプション5,000個の行使価格を引き下げた(リプライシング)。条件変更直前の1個当たり公正価値は$4、直後は$7であった。当初の付与日公正価値は1個$10である。条件変更により認識すべき報酬費用はいくらか。",
      c: ["$35,000", "$50,000", "$20,000", "$15,000"],
      a: 3,
      ex: "条件変更による増分費用 = (変更後公正価値7 − 変更直前公正価値4) × 5,000 = 15,000。権利確定済みのため直ちに認識する。$35,000は変更後の公正価値総額、$50,000は当初付与日の公正価値総額であり誤り。",
    },
    {
      q: "Under an employee stock purchase plan available to substantially all employees, employees may purchase shares at 85% of the market price on the purchase date, with no look-back or other option features. During the year, employees purchased 10,000 shares when the market price was $40 per share. What compensation cost should be recognized?",
      ja: "ほぼすべての従業員が参加できる従業員持株購入制度(ESPP)では、購入日の市場価格の85%で株式を購入でき、ルックバック等のオプション的特徴はない。当期に従業員は市場価格$40のときに10,000株を購入した。認識すべき報酬費用はいくらか。",
      c: ["$0", "$60,000", "$40,000", "$340,000"],
      a: 1,
      ex: "ESPPが非報酬的とされるのは割引率が原則5%以下等の要件を満たす場合のみで、15%割引は報酬的である。費用は割引額全体 10,000 × (40 − 34) = 60,000。5%超部分のみ(40,000)とするのは誤り。",
    },
    {
      q: "Under ASC 718 as amended by ASU 2018-07, how should a company account for stock options granted to a nonemployee consultant in exchange for services?",
      ja: "ASU 2018-07により改訂されたASC 718において、非従業員のコンサルタントに役務の対価として付与したストック・オプションはどのように会計処理すべきか。",
      c: [
        "Measure the options at grant-date fair value and recognize cost in the same period and manner as if the company had paid cash for the services",
        "Measure the options at fair value on the date performance is complete, with remeasurement each reporting period until then",
        "Measure the options at intrinsic value and expense them when exercised",
        "Recognize no cost because the consultant is not an employee",
      ],
      a: 0,
      ex: "ASU 2018-07により非従業員への株式報酬も原則として従業員と同様に付与日の公正価値で測定する。費用は現金で支払った場合と同じ期間・方法で認識する。業績完了日まで再測定する旧ASC 505-50の処理は廃止された。",
    },
    {
      q: "A company recognized cumulative compensation cost of $100,000 for nonqualified stock options and a related deferred tax asset of $21,000 (21% rate). When the options were exercised, the company's tax deduction (intrinsic value) was $160,000. How should the resulting excess tax benefit be reported?",
      ja: "会社は非適格ストック・オプションについて累計$100,000の報酬費用と関連する繰延税金資産$21,000(税率21%)を認識していた。オプション行使時の税務上の損金(本源的価値)は$160,000であった。生じた超過税務便益はどのように報告すべきか。",
      c: [
        "$12,600 as a credit to additional paid-in capital",
        "$33,600 as a credit to additional paid-in capital",
        "$12,600 as a reduction of income tax expense in the income statement",
        "No amount is recognized until the shares are sold",
      ],
      a: 2,
      ex: "超過税務便益 = (160,000 − 100,000) × 21% = 12,600。ASU 2016-09以降、超過税務便益および不足額はすべて損益計算書の法人税等で認識する。旧規定のAPIC計上は廃止された。",
    },
    {
      q: "Which of the following share-based payment arrangements should be classified as a liability under ASC 718?",
      ja: "ASC 718上、負債に分類すべき株式報酬契約はどれか。",
      c: [
        "Restricted stock units that will be settled only in shares",
        "Options that permit net share settlement to cover statutory tax withholding up to the maximum individual statutory rate",
        "Options with a U.S.-dollar exercise price granted to U.S. employees of a U.S. company whose shares trade in U.S. dollars",
        "Shares issued on vesting that the employee may put back to the company for cash at fair value within three months after vesting",
      ],
      a: 3,
      ex: "従業員が株式の保有リスクを合理的な期間(一般に6か月以上)負わずに現金で会社に売り戻せるプット条項付株式は負債に分類する。最大法定税率までの源泉徴収のための純株式決済は持分分類を維持でき(ASU 2016-09)、株式決済のRSUや自国通貨建の行使価格も持分分類である。",
    },
    {
      q: "On January 1, Year 1, a company granted 20,000 stock options with a grant-date fair value of $9 each that cliff-vest after four years. The company has elected to account for forfeitures as they occur, although it expects about 10% of the options to be forfeited. No options were forfeited in Year 1. What compensation cost should be recognized in Year 1?",
      ja: "第1年度1月1日、会社は付与日公正価値1個$9で4年後に一括権利確定するストック・オプション20,000個を付与した。会社は失効を発生時に会計処理する方針を選択しているが、約10%が失効すると見込んでいる。第1年度に失効はなかった。第1年度に認識すべき報酬費用はいくらか。",
      c: ["$40,500", "$180,000", "$45,000", "$162,000"],
      a: 2,
      ex: "失効を発生時に処理する方針では見積失効率を用いず、20,000 × 9 ÷ 4 = 45,000を認識し、失効発生時に戻し入れる。$40,500は失効見積(10%)を織り込んだ方法による金額である。",
    },
    {
      q: "A foreign subsidiary maintains its books in local currency (LC), but its functional currency is the U.S. dollar. Its ending inventory, carried at cost of LC 200,000, was acquired when the exchange rate was $0.50 per LC. At year-end the rate is $0.40, and the average rate for the year is $0.45. At what amount should the inventory be reported in the remeasured U.S.-dollar financial statements (assume no write-down is required)?",
      ja: "在外子会社は現地通貨(LC)で記帳しているが、機能通貨は米ドルである。期末棚卸資産(取得原価LC 200,000)は1 LC = $0.50のときに取得した。期末レートは$0.40、期中平均レートは$0.45である。再測定後の米ドル財務諸表で棚卸資産はいくらで報告すべきか(評価減は不要とする)。",
      c: ["$80,000", "$90,000", "$100,000", "$200,000"],
      a: 2,
      ex: "再測定(テンポラル法)では原価で計上される非貨幣性項目は取得時の歴史的レートを用いる。200,000 × 0.50 = 100,000。$80,000は期末レート(カレントレート法の換算)で計算した誤り。",
    },
    {
      q: "A foreign subsidiary's functional currency is its local currency (LC). Its net assets at the beginning of the year were LC 1,000,000 when the rate was $1.20. During the year it earned net income of LC 200,000 evenly (average rate $1.25) and paid a dividend of LC 100,000 when the rate was $1.28. The year-end rate is $1.30. What is the translation adjustment for the year?",
      ja: "在外子会社の機能通貨は現地通貨(LC)である。期首純資産はLC 1,000,000(レート$1.20)。当期に当期純利益LC 200,000を均等に計上(平均レート$1.25)し、レート$1.28のときに配当LC 100,000を支払った。期末レートは$1.30である。当期の換算調整額はいくらか。",
      c: ["$108,000 credit", "$110,000 credit", "$100,000 credit", "$130,000 credit"],
      a: 0,
      ex: "期首純資産 1,000,000 × (1.30 − 1.20) = 100,000、純利益 200,000 × (1.30 − 1.25) = 10,000、配当 −100,000 × (1.30 − 1.28) = −2,000。合計108,000の貸方(換算差益)でOCIに計上する。$110,000は配当の影響を無視した誤り。",
    },
    {
      q: "A U.S. company's foreign subsidiary operates in a country whose cumulative inflation over the past three years is approximately 110%. The subsidiary's local currency would otherwise be its functional currency. How should the subsidiary's financial statements be converted into U.S. dollars?",
      ja: "米国企業の在外子会社は、過去3年間の累積インフレ率が約110%の国で事業を行っている。本来は現地通貨が機能通貨となる。子会社の財務諸表はどのように米ドルに変換すべきか。",
      c: [
        "Translated using the current rate method with adjustments in OCI",
        "Remeasured as if the U.S. dollar (reporting currency) were the functional currency, with gains and losses in net income",
        "Translated at the average rate for all items",
        "Restated for general price-level changes and then translated at the current rate",
      ],
      a: 1,
      ex: "3年間の累積インフレ率が約100%以上の高インフレ経済では、報告通貨を機能通貨とみなして再測定し、再測定損益は当期純利益に計上する。US GAAPでは物価水準修正後に換算する方法(IFRSのIAS 29の手法)は採用しない。",
    },
    {
      q: "A U.S. parent sold its entire interest in a wholly owned foreign subsidiary for $2,000,000. The carrying amount of the parent's net investment was $1,900,000, and accumulated other comprehensive income included a $75,000 cumulative translation adjustment credit related to the subsidiary. What gain on sale should the parent report in net income?",
      ja: "米国親会社は完全子会社である在外子会社の持分全部を$2,000,000で売却した。親会社の純投資の帳簿価額は$1,900,000で、AOCIには当該子会社に係る換算調整勘定の貸方残高$75,000が含まれていた。親会社が当期純利益に報告すべき売却益はいくらか。",
      c: ["$100,000", "$25,000", "$75,000", "$175,000"],
      a: 3,
      ex: "在外事業体の売却(または実質的な清算)時には、関連するCTAをAOCIから損益に組替え売却損益に含める。100,000 + 75,000 = 175,000。$100,000はCTAの組替えを漏らした誤り。",
    },
    {
      q: "A U.S. parent owns 100% of a foreign subsidiary (a business) and sells 20% of the subsidiary's shares to an unrelated investor, retaining control. AOCI includes a $50,000 cumulative translation adjustment credit related to the subsidiary. How should the CTA be treated?",
      ja: "米国親会社は在外子会社(事業)の100%を保有しており、その株式の20%を非関連の投資家に売却したが支配は維持している。AOCIには当該子会社に係る換算調整勘定の貸方$50,000がある。CTAはどのように処理すべきか。",
      c: [
        "Reclassify $50,000 to net income",
        "Reclassify $10,000 to net income and leave $40,000 in AOCI",
        "Reallocate a proportionate $10,000 to the noncontrolling interest, with no amount reclassified to net income",
        "Leave the entire $50,000 attributed to the parent with no adjustment",
      ],
      a: 2,
      ex: "支配を維持したままの持分一部売却は資本取引であり、損益は認識せずCTAも損益に組替えない。売却割合に応じた10,000を非支配持分に再配分する。損益への組替えは支配喪失や在外事業体の売却・実質的清算の場合である。",
    },
    {
      q: "A U.S. parent made a loan denominated in euros to its German subsidiary (functional currency: euro). Settlement of the loan is neither planned nor anticipated in the foreseeable future. How should the parent report the foreign currency transaction gains and losses on this intra-entity loan in its consolidated financial statements?",
      ja: "米国親会社はドイツ子会社(機能通貨はユーロ)にユーロ建の貸付を行った。予見可能な将来に返済は計画も予定もされていない。この企業集団内貸付に係る為替差損益は連結財務諸表上どのように報告すべきか。",
      c: [
        "In net income as transaction gains and losses",
        "In other comprehensive income, in the same manner as translation adjustments",
        "As an adjustment to the carrying amount of the loan receivable only, with no income statement or OCI effect",
        "Deferred until the loan is settled and then reported in net income",
      ],
      a: 1,
      ex: "長期投資の性質を有する企業集団内の外貨建取引(予見可能な将来に決済予定がないもの)の為替差損益は、換算調整と同様にOCIに計上する。通常の外貨建取引のように純損益に計上するのは誤り。",
    },
    {
      q: "On December 1, Year 1, a U.S. company purchased inventory from a foreign supplier for FC 100,000, payable on January 15, Year 2. The spot rates were: December 1, $0.90; December 31, $0.86; January 15, $0.88. What foreign currency transaction gain or loss should the company report in Year 2?",
      ja: "第1年度12月1日、米国企業は海外仕入先からFC 100,000の棚卸資産を購入し、代金は第2年度1月15日払いとした。直物レートは12月1日$0.90、12月31日$0.86、1月15日$0.88である。第2年度に報告すべき為替差損益はいくらか。",
      c: ["$2,000 gain", "$4,000 gain", "$2,000 loss", "$0"],
      a: 2,
      ex: "第1年度末:買掛金は90,000から86,000へ減少し4,000の為替差益。第2年度:86,000から決済時88,000へ増加し2,000の為替差損。$2,000の利益は取引全体(90,000 − 88,000)の純額で誤り。",
    },
    {
      q: "A U.S. company's foreign subsidiary keeps its books in Swiss francs, its functional currency is the euro, and the parent's reporting currency is the U.S. dollar. Which sequence correctly describes how the subsidiary's financial statements are converted?",
      ja: "米国企業の在外子会社はスイス・フランで記帳しており、機能通貨はユーロ、親会社の報告通貨は米ドルである。子会社の財務諸表の変換手順として正しいものはどれか。",
      c: [
        "Remeasure from Swiss francs to euros with gains and losses in net income, then translate from euros to U.S. dollars with adjustments in OCI",
        "Translate from Swiss francs to euros with adjustments in OCI, then remeasure from euros to U.S. dollars with gains and losses in net income",
        "Translate directly from Swiss francs to U.S. dollars using the current rate method",
        "Remeasure directly from Swiss francs to U.S. dollars with all gains and losses in net income",
      ],
      a: 0,
      ex: "記帳通貨が機能通貨と異なる場合はまず機能通貨へ再測定し(損益計上)、次に機能通貨から報告通貨へ換算する(CTAとしてOCI)。順序を逆にするのは誤りである。",
    },
    {
      q: "A foreign subsidiary whose functional currency is the U.S. dollar keeps its books in local currency (LC). It acquired equipment for LC 500,000 when the rate was $0.80 per LC and depreciates it straight-line over 10 years with no salvage value. The current year's average rate is $0.75 and the year-end rate is $0.70. What depreciation expense should appear in the remeasured financial statements for the current year?",
      ja: "機能通貨が米ドルの在外子会社は現地通貨(LC)で記帳している。1 LC = $0.80のときに設備をLC 500,000で取得し、残存価額ゼロ・耐用年数10年の定額法で償却している。当期の平均レートは$0.75、期末レートは$0.70である。再測定後の当期減価償却費はいくらか。",
      c: ["$35,000", "$37,500", "$50,000", "$40,000"],
      a: 3,
      ex: "再測定では減価償却費は関連する資産の歴史的レートを用いる。LC 50,000 × 0.80 = 40,000。$37,500は平均レート(カレントレート法の換算)を用いた誤り。",
    },
    {
      q: "A dealer-lessor enters into a lease classified as a sales-type lease. The fair value of the equipment, which equals the present value of the lease payments, is $100,000, and its carrying amount is $80,000. The lessor incurred $2,000 of initial direct costs. What is the net effect on the lessor's pretax income at lease commencement?",
      ja: "販売業者である貸手が販売型リースに分類されるリースを締結した。設備の公正価値(リース料の現在価値と等しい)は$100,000、帳簿価額は$80,000である。貸手は当初直接費用$2,000を負担した。リース開始時の貸手の税引前利益への純影響額はいくらか。",
      c: ["$18,000", "$20,000", "$0", "$22,000"],
      a: 0,
      ex: "公正価値と帳簿価額が異なる(販売利益がある)販売型リースでは、当初直接費用は開始時に費用処理する。販売利益 100,000 − 80,000 = 20,000 − 当初直接費用2,000 = 18,000。$20,000は当初直接費用を正味リース投資未回収額に含めて繰り延べた誤り。",
    },
    {
      q: "A lease does not meet any of the sales-type lease classification criteria. However, the present value of the lease payments plus a residual value guarantee from an unrelated third party equals substantially all of the asset's fair value, and collection is probable. The lessor's selling profit on the asset is $15,000. How should the lessor account for the lease and the selling profit?",
      ja: "あるリースは販売型リースの分類要件をいずれも満たさない。しかし、リース料の現在価値に非関連の第三者による残価保証を加えた額が資産の公正価値のほぼすべてに相当し、回収可能性も高い。資産の販売利益は$15,000である。貸手はリースと販売利益をどのように処理すべきか。",
      c: [
        "Sales-type lease, recognizing the $15,000 selling profit at commencement",
        "Operating lease, recognizing no selling profit",
        "Direct financing lease, deferring the $15,000 selling profit and recognizing it over the lease term through the net investment",
        "Direct financing lease, recognizing the $15,000 selling profit at commencement",
      ],
      a: 2,
      ex: "第三者残価保証を含めて実質的にすべての公正価値を回収し回収可能性が高い場合は直接金融リースとなる。直接金融リースでは販売利益は開始時に認識せず、正味リース投資未回収額から控除して繰り延べ、リース期間にわたり認識する(販売損失は開始時に認識)。",
    },
    {
      q: "A lessor enters into a three-year operating lease of office space. Annual lease payments, due at each year-end, are $0 in Year 1, $60,000 in Year 2 and $90,000 in Year 3. What lease income and related balance should the lessor report for Year 1?",
      ja: "貸手はオフィススペースの3年間のオペレーティング・リースを締結した。各年度末払いの年間リース料は第1年度$0、第2年度$60,000、第3年度$90,000である。貸手は第1年度にどのリース収益と関連残高を報告すべきか。",
      c: [
        "Lease income of $0 and no receivable",
        "Lease income of $60,000 and a $60,000 receivable",
        "Lease income of $150,000 and a $150,000 receivable",
        "Lease income of $50,000 and a $50,000 accrued rent receivable",
      ],
      a: 3,
      ex: "オペレーティング・リースの貸手は、より適切な体系的方法がない限りリース料総額を定額で収益認識する。150,000 ÷ 3 = 50,000をリース収益とし、未収(繰延)賃料50,000を計上する。現金受取ベースで$0とするのは誤り。",
    },
    {
      q: "A lessee amends an existing office lease to add an additional floor of the building for the remaining lease term. The increase in lease payments is commensurate with the standalone price of the additional floor. How should the lessee account for the modification?",
      ja: "借手は既存のオフィスリースを変更し、残存リース期間について建物のフロアを1つ追加した。リース料の増加額は追加フロアの独立価格に見合っている。借手はこの条件変更をどのように処理すべきか。",
      c: [
        "As a separate contract, recognizing a new lease for the additional floor with no change to the original lease",
        "By remeasuring the original lease liability using the original discount rate",
        "By derecognizing the original lease and recognizing a gain or loss",
        "As a change in estimate with no remeasurement until the next reporting period",
      ],
      a: 0,
      ex: "追加の使用権を付与し、対価の増加が独立価格に見合う(状況に応じた調整を含む)場合、条件変更は別個の契約として処理し、追加フロアについて新たなリースを認識する。既存リースは変更しない。",
    },
    {
      q: "A lessee and lessor agree to extend the term of an existing finance lease by three years at a higher monthly payment. The modification does not grant an additional right of use and is not accounted for as a separate contract. How should the lessee account for the modification?",
      ja: "借手と貸手は既存のファイナンス・リースの期間を月額リース料を引き上げて3年延長することに合意した。追加の使用権は付与されず、別個の契約としては処理しない。借手はこの条件変更をどのように処理すべきか。",
      c: [
        "Recognize a gain or loss equal to the change in the present value of payments",
        "Remeasure the lease liability using the original discount rate and adjust the right-of-use asset",
        "Account for the extension as a new, separate lease beginning at the end of the original term",
        "Reassess classification, remeasure the lease liability using a discount rate determined at the modification date, and adjust the right-of-use asset by the same amount",
      ],
      a: 3,
      ex: "別個の契約とならない条件変更では、変更日に分類を再評価し、変更日時点の割引率でリース負債を再測定して、同額を使用権資産で調整する。期間延長では損益は生じない。当初の割引率を使うのは誤り。",
    },
    {
      q: "At lease commencement, a lease meets the criteria for a sales-type lease, but collectibility of the lease payments is NOT probable. How should the lessor account for the arrangement at commencement?",
      ja: "リース開始時点で、あるリースは販売型リースの要件を満たすが、リース料の回収可能性が高くない(probableでない)。貸手は開始時にこの契約をどのように処理すべきか。",
      c: [
        "Derecognize the asset and recognize a net investment in the lease with a full allowance",
        "Continue to recognize the underlying asset and record lease payments received as a deposit liability until collectibility becomes probable or other specified events occur",
        "Classify the lease as a direct financing lease",
        "Derecognize the asset and recognize a loss equal to its carrying amount",
      ],
      a: 1,
      ex: "販売型リースの要件を満たしても回収可能性がprobableでない場合、貸手は原資産の認識を中止せず、受け取ったリース料を預り金(負債)として計上する。回収がprobableになる等の時点で販売型リースとして処理する。",
    },
    {
      q: "A calendar-year company qualifies as a large accelerated filer. Within how many days after the period end must it file its annual report on Form 10-K and its first-quarter report on Form 10-Q?",
      ja: "暦年決算の会社は大規模早期提出会社(large accelerated filer)に該当する。年次報告書Form 10-Kおよび第1四半期報告書Form 10-Qは、期末後それぞれ何日以内に提出しなければならないか。",
      c: [
        "Form 10-K: 90 days; Form 10-Q: 45 days",
        "Form 10-K: 75 days; Form 10-Q: 40 days",
        "Form 10-K: 60 days; Form 10-Q: 45 days",
        "Form 10-K: 60 days; Form 10-Q: 40 days",
      ],
      a: 3,
      ex: "大規模早期提出会社は10-Kが60日以内、10-Qが40日以内。早期提出会社は10-Kが75日・10-Qが40日、非早期提出会社は10-Kが90日・10-Qが45日である。",
    },
    {
      q: "A public company's audit committee dismissed its independent registered public accounting firm on March 3. Which SEC filing is required, and by when?",
      ja: "公開会社の監査委員会は3月3日に独立登録会計事務所を解任した。必要なSEC提出書類とその期限はどれか。",
      c: [
        "Form 8-K within four business days of the event",
        "Form 10-Q for the quarter in which the dismissal occurred",
        "Form 8-K within 15 calendar days of the event",
        "No filing is required until the next Form 10-K",
      ],
      a: 0,
      ex: "監査人の交代(Item 4.01)は重要な事象としてForm 8-Kで、原則として事象発生後4営業日以内に開示する。次回の10-Qや10-Kまで待つことはできない。",
    },
    {
      q: "Under ASC 280 as amended by ASU 2023-07, which of the following is required for a public entity's reportable segments?",
      ja: "ASU 2023-07により改訂されたASC 280において、公開企業の報告セグメントについて要求される事項はどれか。",
      c: [
        "Disclosure of significant segment expenses that are regularly provided to the chief operating decision maker and included in the reported measure of segment profit or loss, in both annual and interim periods",
        "Disclosure of segment expenses only for the largest reportable segment",
        "Segment disclosures only in annual financial statements",
        "Exemption from all segment disclosures for an entity with a single reportable segment",
      ],
      a: 0,
      ex: "ASU 2023-07は、CODMに定期的に提供されセグメント損益に含まれる重要なセグメント費用の開示を年次・四半期の両方で要求する。単一の報告セグメントの企業もASC 280の開示を全面的に適用しなければならない。CODMの役職名・肩書の開示も求められる。",
    },
    {
      q: "A public company has eight operating segments. Consolidated revenue from external customers is $1,000,000. The operating segments that meet the quantitative thresholds report external revenue totaling $690,000. What must the company do?",
      ja: "公開会社は8つの事業セグメントを有する。外部顧客からの連結売上高は$1,000,000である。量的基準を満たす事業セグメントの外部売上高合計は$690,000である。会社は何をしなければならないか。",
      c: [
        "Nothing; the reportable segments already exceed 50% of consolidated revenue",
        "Identify additional operating segments as reportable, even if they do not meet the 10% thresholds, until reportable segments' external revenue is at least $750,000",
        "Combine all remaining segments into one reportable segment regardless of their characteristics",
        "Report all eight operating segments separately",
      ],
      a: 1,
      ex: "報告セグメントの外部売上高合計は連結外部売上高の75%以上でなければならない。690,000 < 750,000のため、10%基準を満たさないセグメントも追加して75%に達するまで報告セグメントとする。50%基準は存在しない。",
    },
    {
      q: "A calendar-year company reported pretax income of $200,000 in the first quarter and $300,000 in the second quarter. At the end of the first quarter, its estimated annual effective tax rate was 25%; at the end of the second quarter, the estimate was revised to 28%. What income tax expense should the company report for the second quarter?",
      ja: "暦年決算の会社は第1四半期に税引前利益$200,000、第2四半期に$300,000を計上した。第1四半期末の見積年間実効税率は25%、第2四半期末には28%に改訂された。第2四半期に報告すべき法人税等はいくらか。",
      c: ["$84,000", "$75,000", "$90,000", "$140,000"],
      a: 2,
      ex: "期中の税金費用は累計の税引前利益に最新の見積年間実効税率を適用し、前四半期までの計上額を控除する。(200,000 + 300,000) × 28% − 200,000 × 25% = 140,000 − 50,000 = 90,000。$84,000は第2四半期単独に28%を乗じた誤り。",
    },
    {
      q: "A calendar-year company paid $120,000 of annual property taxes in January covering the entire year. How should the payment be reflected in the company's first-quarter interim financial statements?",
      ja: "暦年決算の会社は1月に年間分の固定資産税$120,000を支払った。この支払は第1四半期の期中財務諸表にどのように反映すべきか。",
      c: [
        "$120,000 expense in the first quarter",
        "$0 expense in the first quarter and $120,000 in the fourth quarter",
        "$40,000 expense in the first quarter",
        "$30,000 expense in the first quarter, with the remainder deferred as a prepaid asset",
      ],
      a: 3,
      ex: "ASC 270では、複数の期中期間に便益が及ぶ費用は合理的に配分する。120,000 × 3/12 = 30,000を第1四半期の費用とし、残り90,000は前払費用とする。支払時に全額費用処理するのは誤り。",
    },
    {
      q: "During the second quarter, a company that uses LIFO liquidated part of a base-period inventory layer. Management expects to replace the liquidated layer before the end of the fiscal year. How should cost of goods sold for the second quarter reflect the liquidation?",
      ja: "LIFOを採用する会社は第2四半期に基準期間の在庫層の一部を取り崩した。経営者は会計年度末までに取り崩した層を補充する見込みである。第2四半期の売上原価には取崩しをどのように反映すべきか。",
      c: [
        "Use the historical cost of the liquidated layer and recognize the resulting profit",
        "Include the expected cost of replacing the liquidated layer in cost of goods sold",
        "Defer all cost of goods sold until year-end",
        "Recognize the liquidation profit in other comprehensive income",
      ],
      a: 1,
      ex: "期中にLIFOの基準層を一時的に取り崩し年度末までに補充が見込まれる場合、売上原価は取り崩した層の補充見込原価で計上する。低い歴史的原価を用いて一時的な利益を計上するのは誤りである。",
    },
    {
      q: "A public company that is neither a smaller reporting company nor an emerging growth company files its Form 10-K. Under Regulation S-X, which audited financial statements must be included?",
      ja: "小規模報告会社でも新興成長企業でもない公開会社がForm 10-Kを提出する。Regulation S-X上、含めなければならない監査済財務諸表はどれか。",
      c: [
        "Balance sheets for 3 years and statements of income, comprehensive income, cash flows and equity for 3 years",
        "Balance sheets for 2 years and statements of income, comprehensive income, cash flows and equity for 2 years",
        "Balance sheets for 2 years and statements of income, comprehensive income, cash flows and equity for 3 years",
        "A balance sheet for 1 year and statements of income, comprehensive income, cash flows and equity for 2 years",
      ],
      a: 2,
      ex: "Regulation S-Xでは貸借対照表2期分、損益・包括利益・キャッシュフロー・株主資本等変動計算書3期分が必要である。小規模報告会社は2期分の業績計算書で足りる。",
    },
    {
      q: "Which of the following disposals is most likely to be reported as a discontinued operation under ASC 205-20?",
      ja: "ASC 205-20上、非継続事業として報告される可能性が最も高い処分はどれか。",
      c: [
        "Sale of one of 40 retail stores in a region where the company continues to operate the other stores",
        "Sale of the company's entire European operations, which generated 30% of consolidated revenue",
        "Disposal of an obsolete production line within a product line the company continues to sell",
        "Sale of a corporate headquarters building that will be leased back",
      ],
      a: 1,
      ex: "非継続事業は、事業の構成単位の処分が企業の業務と財務成績に重大な影響を与える(または与える)戦略的転換を表す場合に該当する(主要な地域・事業分野・持分法投資の処分等)。売上の30%を占める欧州事業全体の売却がこれに当たる。1店舗の売却や生産ラインの廃棄は戦略的転換に当たらない。",
    },
    {
      q: "On October 1, Year 1, a component that represents a strategic shift met the held-for-sale criteria. Its operating loss for Year 1 was $120,000. At December 31, Year 1, the component's carrying amount was $900,000, its fair value was $850,000 and estimated costs to sell were $30,000. The tax rate is 25%. What amount should be reported as loss from discontinued operations, net of tax, for Year 1?",
      ja: "第1年度10月1日、戦略的転換を表す構成単位が売却目的保有の要件を満たした。第1年度の営業損失は$120,000であった。第1年度12月31日の構成単位の帳簿価額は$900,000、公正価値は$850,000、見積売却費用は$30,000である。税率は25%である。第1年度の非継続事業損失(税引後)はいくらか。",
      c: ["$200,000", "$90,000", "$127,500", "$150,000"],
      a: 3,
      ex: "売却目的保有の処分グループは帳簿価額と公正価値−売却費用の低い方で測定する。評価損 = 900,000 − (850,000 − 30,000) = 80,000。税引前損失 = 120,000 + 80,000 = 200,000、税引後 200,000 × 75% = 150,000。$200,000は税効果を無視した誤り。",
    },
    {
      q: "At December 31, a company's management had not yet approved a plan to sell a business unit. On January 20 of the following year, before the financial statements were issued, management committed to the plan and all other held-for-sale criteria were met. How should the business unit be classified in the December 31 balance sheet?",
      ja: "12月31日時点で、経営者は事業単位の売却計画をまだ承認していなかった。翌年1月20日(財務諸表発行前)に経営者は計画を決定し、その他の売却目的保有の要件もすべて満たされた。12月31日の貸借対照表で当該事業単位はどのように分類すべきか。",
      c: [
        "As held for sale, because the criteria were met before the financial statements were issued",
        "As held for sale, with a retrospective impairment measured at January 20",
        "As held and used, with disclosure of the subsequent event",
        "As a discontinued operation in the December 31 income statement",
      ],
      a: 2,
      ex: "売却目的保有の要件が貸借対照表日後・財務諸表発行前に満たされた場合でも、期末時点では保有・使用(held and used)として分類を続け、後発事象として開示する。遡って売却目的保有とするのは誤り。",
    },
    {
      q: "A company sold a major line of business in Year 3 that qualifies as a discontinued operation. Its comparative income statements present Years 1 through 3. How should the results of the business be presented?",
      ja: "会社は第3年度に非継続事業に該当する主要な事業分野を売却した。比較損益計算書は第1年度から第3年度を表示している。当該事業の業績はどのように表示すべきか。",
      c: [
        "As discontinued operations in Year 3 only; Years 1 and 2 are not changed",
        "As discontinued operations, net of tax, separately from continuing operations for all three years presented",
        "As an extraordinary item in Year 3",
        "As a cumulative adjustment to opening retained earnings of Year 3",
      ],
      a: 1,
      ex: "非継続事業の業績(処分損益を含む)は、表示されるすべての期間について継続事業と区別し税引後で表示するため、過年度の比較情報も組み替える。異常項目の区分は廃止されている。",
    },
    {
      q: "A company acquires a business that, on the acquisition date, meets the criteria to be classified as held for sale because the company intends to sell it within one year. How should the acquired business be reported?",
      ja: "会社は事業を取得し、取得日において1年以内に売却する意図があるため売却目的保有の要件を満たした。取得した事業はどのように報告すべきか。",
      c: [
        "As a discontinued operation from the acquisition date, even though its disposal does not represent a strategic shift",
        "As part of continuing operations until it is sold",
        "As a discontinued operation only if it represents more than 10% of consolidated revenue",
        "As an equity method investment",
      ],
      a: 0,
      ex: "取得時点で売却目的保有の要件を満たす事業(または非営利活動)は、戦略的転換の要件にかかわらず取得日から非継続事業として報告する。規模基準は存在しない。",
    },
    {
      q: "Which of the following statements about the fair value option under ASC 825-10 is correct?",
      ja: "ASC 825-10の公正価値オプションに関する記述として正しいものはどれか。",
      c: [
        "It must be applied to all financial instruments of the same type held by the entity",
        "It may be revoked at any time if fair value becomes difficult to measure",
        "It may be elected for an investment in a subsidiary that the entity is required to consolidate",
        "It is generally elected instrument by instrument, is irrevocable, and is made at specified election dates such as initial recognition",
      ],
      a: 3,
      ex: "公正価値オプションは原則として金融商品ごとに選択でき、当初認識時など特定の選択日に行い、取消不能である。連結すべき子会社への投資等は対象外である。同種の全商品への一律適用は求められない。",
    },
    {
      q: "A company elected the fair value option for its fixed-rate bonds payable. During the year, the fair value of the bonds decreased by $50,000, of which $20,000 resulted from a deterioration in the company's own instrument-specific credit risk. How should the $50,000 change be reported?",
      ja: "会社は固定利付の社債に公正価値オプションを選択した。当期に社債の公正価値は$50,000減少し、そのうち$20,000は自社の商品固有の信用リスクの悪化によるものである。$50,000の変動はどのように報告すべきか。",
      c: [
        "$30,000 gain in net income and $20,000 gain in other comprehensive income",
        "$50,000 gain in net income",
        "$50,000 gain in other comprehensive income",
        "$20,000 gain in net income and $30,000 gain in other comprehensive income",
      ],
      a: 0,
      ex: "公正価値オプションを選択した金融負債の公正価値変動のうち、商品固有の信用リスクに起因する部分はOCIに、残りは純損益に計上する(ASU 2016-01)。50,000 − 20,000 = 30,000が純損益。全額を純損益とするのは改訂前の処理である。",
    },
    {
      q: "A company issued preferred stock that it must redeem for cash at its $100 par value on a specified date five years from issuance. The redemption is unconditional. How should the preferred stock and its dividends be reported?",
      ja: "会社は発行から5年後の特定日に額面$100で現金償還しなければならない優先株式を発行した。償還は無条件である。この優先株式とその配当はどのように報告すべきか。",
      c: [
        "As equity, with dividends charged to retained earnings",
        "As temporary (mezzanine) equity, with dividends charged to retained earnings",
        "As a liability, with dividends reported as interest cost",
        "As equity until the redemption date, then reclassified to liability",
      ],
      a: 2,
      ex: "ASC 480では、特定日または確実に発生する事象で現金等により償還が義務付けられた強制償還金融商品は負債に分類し、その配当は支払利息として処理する。メザニン区分は保有者の選択等による条件付償還の場合である。",
    },
    {
      q: "A company agreed to settle a $1,000,000 obligation by issuing however many of its common shares are needed to equal $1,000,000 based on the share price on the settlement date. How should the obligation be classified under ASC 480?",
      ja: "会社は$1,000,000の債務を、決済日の株価に基づき$1,000,000に相当する数の普通株式を発行することで決済することに合意した。ASC 480上、この債務はどのように分類すべきか。",
      c: [
        "As equity, because it will be settled in shares",
        "As a liability, because the monetary value is predominantly fixed and does not vary with the share price",
        "As temporary equity",
        "As equity if the company has enough authorized unissued shares",
      ],
      a: 1,
      ex: "固定金額(株価と無関係に価値が決まる)を可変数の自社株式で決済する義務は、保有者が株主としての地位にないため、株式決済であっても負債に分類する。決済手段が株式であることだけで持分とするのは誤り。",
    },
    {
      q: "A company enters into a forward contract to repurchase a fixed number of its own common shares for cash at a fixed price in one year (physical settlement). Under ASC 480, how should the company initially account for the contract?",
      ja: "会社は1年後に固定価格で一定数の自己株式を現金で買い戻す先渡契約(現物決済)を締結した。ASC 480上、会社はこの契約を当初どのように会計処理すべきか。",
      c: [
        "Disclose the contract only; nothing is recognized until settlement",
        "Recognize a derivative asset or liability at fair value with changes in earnings",
        "Recognize treasury stock and a liability at the forward price immediately, with no interest",
        "Recognize a liability initially measured at the fair value of the shares at inception (adjusted for any consideration), with a corresponding reduction of equity",
      ],
      a: 3,
      ex: "自己株式を現金で買い戻す現物決済の先渡購入契約は負債に分類し、当初は契約開始時の株式の公正価値(対価の調整後)で測定して同額の資本を減額する。その後は決済額までの増加を利息費用として認識する。",
    },
    {
      q: "An SEC registrant issued preferred stock that is redeemable for cash at the option of the holder at any time after five years. How should the preferred stock be classified?",
      ja: "SEC登録会社は、5年経過後いつでも保有者の選択により現金で償還可能な優先株式を発行した。この優先株式はどのように分類すべきか。",
      c: [
        "As temporary (mezzanine) equity, outside of permanent equity",
        "As a liability under ASC 480 because it is mandatorily redeemable",
        "As permanent equity with no special presentation",
        "As a derivative liability",
      ],
      a: 0,
      ex: "保有者の選択で償還される優先株式は償還が確実ではないため、ASC 480の強制償還金融商品(負債)には該当しない。ただしSECの規定(ASC 480-10-S99)により、発行者の支配外の償還条項を有する証券は永久資本の外(メザニン)に表示する。",
    },
  ],
});

CPA.tbs({
  id: "TBS-BAR-21",
  section: "BAR",
  chapter: "BAR-02",
  title: "キャッシュフロー・ヘッジとAOCIの組替え",
  scenario: `<p>On October 1, Year 1, Ridge Corp., a U.S. company with a calendar year-end, forecasted a probable purchase of inventory from a European supplier for €500,000 on February 1, Year 2. Ridge entered into a forward contract to buy €500,000 on February 1, Year 2, and designated it as a cash flow hedge of the foreign currency risk. The hedge is highly effective, and no components are excluded.</p>
<table><tr><th>Date</th><th>Cumulative fair value of forward (asset)</th></tr>
<tr><td>December 31, Year 1</td><td>$15,000</td></tr>
<tr><td>February 1, Year 2</td><td>$20,000</td></tr></table>
<p>On February 1, Year 2, Ridge settled the forward and purchased the inventory for €500,000 when the spot rate was $1.04 per euro. During Year 2, Ridge sold 75% of the inventory to customers.</p>
<p class="ja">暦年決算の米国企業Ridge社は、第1年度10月1日に第2年度2月1日のユーロ建棚卸資産€500,000の購入を予定(発生可能性が高い)し、€500,000を購入する為替予約を締結して外貨リスクのキャッシュフロー・ヘッジに指定した。ヘッジは高度に有効で、除外部分はない。為替予約の累積公正価値(資産)は第1年度12月31日$15,000、第2年度2月1日$20,000である。第2年度2月1日に為替予約を決済し、直物レート1ユーロ$1.04で棚卸資産€500,000を購入した。第2年度中に棚卸資産の75%を販売した。</p>`,
  rows: [
    { label: "Year 1 gain recognized in OCI(第1年度にOCIに計上する利益)", type: "num", answer: 15000 },
    { label: "Year 2 gain recognized in OCI before the purchase(第2年度に購入前にOCIに計上する利益)", type: "num", answer: 5000 },
    { label: "Initial carrying amount of the inventory(棚卸資産の当初帳簿価額)", type: "num", answer: 520000 },
    { label: "Amount reclassified from AOCI to earnings in Year 2(第2年度にAOCIから損益へ組替える金額)", type: "num", answer: 15000 },
    { label: "Cost of goods sold reported in Year 2 for this inventory(第2年度に当該棚卸資産について報告する売上原価)", type: "num", answer: 375000 },
    { label: "AOCI balance related to the hedge at December 31, Year 2(第2年度末のヘッジに係るAOCI残高)", type: "num", answer: 5000 },
  ],
  explain: `<p>高度に有効なキャッシュフロー・ヘッジでは、ヘッジ手段の公正価値変動の全額をOCIに計上する。第1年度15,000、第2年度(購入日まで)20,000 − 15,000 = 5,000。</p>
<p>キャッシュフロー・ヘッジでは累積額を棚卸資産の取得原価に含めない(US GAAP)。棚卸資産は直物で 500,000 × 1.04 = 520,000。AOCI累計20,000は棚卸資産が売上原価として損益に影響する時点で同じ科目へ組替える。</p>
<p>販売75%:組替額 20,000 × 75% = 15,000。売上原価 = 520,000 × 75% − 15,000 = 390,000 − 15,000 = 375,000。期末AOCI残高 = 20,000 − 15,000 = 5,000(残りの在庫が販売されたときに組替える)。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-22",
  section: "BAR",
  chapter: "BAR-02",
  title: "在外子会社の換算と換算調整勘定(CTA)",
  scenario: `<p>Pine Corp., a U.S. company, formed a wholly owned foreign subsidiary on January 1, Year 1, investing LC 500,000 for all of its common stock. The subsidiary's functional currency is its local currency (LC). Year 1 data:</p>
<table><tr><th>Item</th><th>LC</th></tr>
<tr><td>Total assets, December 31</td><td>900,000</td></tr>
<tr><td>Total liabilities, December 31</td><td>250,000</td></tr>
<tr><td>Common stock</td><td>500,000</td></tr>
<tr><td>Net income for Year 1 (earned evenly)</td><td>200,000</td></tr>
<tr><td>Dividends paid</td><td>50,000</td></tr></table>
<table><tr><th>Exchange rates ($ per LC)</th><th>Rate</th></tr>
<tr><td>January 1, Year 1</td><td>$1.00</td></tr>
<tr><td>Average for Year 1</td><td>$1.05</td></tr>
<tr><td>Date dividends were paid</td><td>$1.08</td></tr>
<tr><td>December 31, Year 1</td><td>$1.10</td></tr></table>
<p class="ja">米国企業Pine社は第1年度1月1日にLC 500,000を出資して完全子会社を設立した。子会社の機能通貨は現地通貨(LC)である。第1年度末の総資産LC 900,000、総負債LC 250,000、普通株式LC 500,000、当期純利益LC 200,000(均等に発生)、支払配当LC 50,000。レートは1月1日$1.00、期中平均$1.05、配当支払日$1.08、12月31日$1.10である。</p>`,
  rows: [
    { label: "Translated total assets(換算後の総資産)", type: "num", answer: 990000 },
    { label: "Translated total liabilities(換算後の総負債)", type: "num", answer: 275000 },
    { label: "Translated common stock(換算後の普通株式)", type: "num", answer: 500000 },
    { label: "Translated retained earnings, December 31(換算後の期末利益剰余金)", type: "num", answer: 156000 },
    { label: "Cumulative translation adjustment, December 31(期末の換算調整勘定)", type: "num", answer: 59000 },
    { label: "Where is the translation adjustment reported?(換算調整額の報告区分)", type: "select", options: ["Net income", "Other comprehensive income", "Directly in retained earnings", "As a deferred charge"], answer: "Other comprehensive income" },
  ],
  explain: `<p>カレントレート法:資産・負債は期末レート、資本金は歴史的レート、損益は平均レート、配当は支払日レートで換算する。</p>
<p>総資産 900,000 × 1.10 = 990,000、総負債 250,000 × 1.10 = 275,000、普通株式 500,000 × 1.00 = 500,000。</p>
<p>利益剰余金 = 200,000 × 1.05 − 50,000 × 1.08 = 210,000 − 54,000 = 156,000。</p>
<p>CTA = 純資産 (990,000 − 275,000) 715,000 − 500,000 − 156,000 = 59,000(貸方)。検算:500,000 × 0.10 + 200,000 × 0.05 − 50,000 × 0.02 = 50,000 + 10,000 − 1,000 = 59,000。CTAはOCIに計上しAOCIに累積する。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-23",
  section: "BAR",
  chapter: "BAR-02",
  title: "段階的権利確定のストック・オプションと条件変更",
  scenario: `<p>On January 1, Year 1, Cedar Inc. granted 6,000 stock options to employees. The options vest in three equal tranches of 2,000 options at December 31 of Year 1, Year 2 and Year 3 (service condition only). The grant-date fair value is $9 per option for every tranche. Cedar accounts for forfeitures as they occur, and no forfeitures occurred.</p>
<p>On January 1, Year 3, Cedar reduced the exercise price of the 2,000 unvested options only. The fair value of each of those options was $5 immediately before the modification and $8 immediately after. The vesting date did not change.</p>
<p class="ja">Cedar社は第1年度1月1日、従業員にストック・オプション6,000個を付与した。第1・第2・第3年度の12月31日に2,000個ずつ権利確定する(勤務条件のみ)。付与日公正価値は各トランシェとも1個$9である。失効は発生時に処理し、失効は生じなかった。第3年度1月1日、未確定の2,000個についてのみ行使価格を引き下げた。条件変更直前の公正価値は1個$5、直後は$8であり、権利確定日は変わらない。</p>`,
  rows: [
    { label: "Year 1 compensation cost — graded-vesting (accelerated) attribution(第1年度報酬費用:段階的配分法)", type: "num", answer: 33000 },
    { label: "Year 1 compensation cost — straight-line attribution for the entire award(第1年度報酬費用:全体の定額法)", type: "num", answer: 18000 },
    { label: "Year 2 compensation cost — graded-vesting (accelerated) attribution(第2年度報酬費用:段階的配分法)", type: "num", answer: 15000 },
    { label: "Incremental compensation cost from the modification(条件変更による増分報酬費用)", type: "num", answer: 6000 },
    { label: "Year 3 compensation cost — graded-vesting (accelerated) attribution(第3年度報酬費用:段階的配分法)", type: "num", answer: 12000 },
    { label: "Type of modification(条件変更の種類)", type: "select", options: ["Probable-to-probable (Type I)", "Probable-to-improbable (Type II)", "Improbable-to-probable (Type III)", "Improbable-to-improbable (Type IV)"], answer: "Probable-to-probable (Type I)" },
  ],
  explain: `<p>各トランシェの公正価値 = 2,000 × 9 = 18,000、総額54,000。</p>
<p>段階的配分法:第1年度 = 18,000 + 18,000 ÷ 2 + 18,000 ÷ 3 = 18,000 + 9,000 + 6,000 = 33,000。第2年度 = 9,000 + 6,000 = 15,000。定額法では54,000 ÷ 3 = 18,000(累計認識額が確定部分以上であることを満たす)。</p>
<p>条件変更:増分公正価値 = (8 − 5) × 2,000 = 6,000を残存勤務期間(第3年度)で認識する。第3年度 = 第3トランシェの残り6,000 + 増分6,000 = 12,000。総費用 = 54,000 + 6,000 = 60,000。</p>
<p>変更前後とも権利確定の可能性が高いため、probable-to-probable(Type I)の条件変更である。</p>`,
});
