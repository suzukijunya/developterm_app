// FAR の追加問題(ASC 606 収益認識の詳細)

CPA.extend("FAR-02", {
  mcq: [
    {
      q: "A company received a $20,000 nonrefundable deposit from a customer under a written agreement. At contract inception, the company concludes it is NOT probable that it will collect substantially all of the consideration to which it will be entitled, so the arrangement does not meet the ASC 606 contract criteria. The company has not transferred any goods and still has remaining obligations. How should the $20,000 be reported?",
      ja: "会社は書面による合意に基づき顧客から返金不要の手付金$20,000を受領した。契約開始時点で、権利を得る対価のほぼすべてを回収する可能性が高い(probable)とはいえず、ASC 606の契約の要件を満たさない。会社はまだ財を移転しておらず、残存する義務がある。$20,000はどのように報告すべきか。",
      c: [
        "As revenue, because the deposit is nonrefundable",
        "As a liability until one of the specified events occurs (e.g., no remaining obligations and substantially all consideration received, or the contract is terminated)",
        "As a reduction of accounts receivable",
        "As deferred revenue recognized straight-line over the expected contract term",
      ],
      a: 1,
      ex: "契約の要件を満たさない場合、受領対価は、(1)残存義務がなく対価のほぼすべてを受領済、(2)契約が解約された、(3)支配を移転し以後の移転を停止し対価が返金不要、のいずれかが生じるまで負債として計上する。返金不要であることだけでは収益にならない。",
    },
    {
      q: "On March 1, a company signed Contract A with a customer, and on March 5 signed Contract B with the same customer. The price of Contract A depends on how the company performs under Contract B. How should the company account for the two contracts?",
      ja: "会社は3月1日に顧客と契約Aを締結し、3月5日に同じ顧客と契約Bを締結した。契約Aの価格は、契約Bにおける会社の履行状況に左右される。会社は2つの契約をどのように会計処理すべきか。",
      c: [
        "As two separate contracts, because they were signed on different dates",
        "As a contract modification of Contract A",
        "Combine them and account for them as a single contract",
        "As separate contracts, but disclose the relationship in the notes",
      ],
      a: 2,
      ex: "同一顧客と同時またはほぼ同時に締結した契約は、(1)単一の商業目的でパッケージとして交渉された、(2)一方の対価が他方の価格・履行に左右される、(3)約束した財・サービスが単一の履行義務である、のいずれかに該当すれば結合する。本問は(2)に該当する。",
    },
    {
      q: "A company sells equipment with a list price of $1,000,000 to a customer in a region experiencing severe economic difficulty. Based on its customary business practice, the company expects to accept $600,000 as full payment and concludes it is probable it will collect that amount. When control of the equipment transfers, how much revenue should be recognized?",
      ja: "会社は深刻な経済的困難に直面している地域の顧客に、定価$1,000,000の設備を販売した。慣行に基づき、会社は$600,000を全額支払として受け入れる見込みであり、その金額の回収可能性は高いと判断している。設備の支配が移転した時点で認識すべき収益はいくらか。",
      c: ["$600,000", "$1,000,000", "$1,000,000 with a $400,000 bad debt expense", "$0 until cash is collected"],
      a: 0,
      ex: "受け入れる意図のある値引きは「暗黙の価格譲歩」であり変動対価として取引価格を$600,000とする。回収可能性はこの金額で判定する。$400,000を貸倒費用とするのは信用リスクと価格譲歩を混同した誤りである。",
    },
    {
      q: "A software company sells a software license together with an installation service that significantly customizes the software to add substantial new functionality so it can interface with the customer's existing systems. How many performance obligations exist?",
      ja: "ソフトウェア会社は、ソフトウェア・ライセンスと、顧客の既存システムと連携させるために大幅な新機能を追加する重要なカスタマイズを伴うインストール・サービスをセットで販売した。履行義務はいくつか。",
      c: [
        "Two: the license and the installation service",
        "Three: the license, installation, and customization",
        "Zero, until the customization is complete",
        "One: a combined customized software solution",
      ],
      a: 3,
      ex: "インストールがソフトウェアを大幅に修正・カスタマイズする場合、両者は契約の文脈において区別できず(相互依存性が高い)、結合した単一の履行義務となる。標準的なインストールであれば2つになりうる。",
    },
    {
      q: "A company enters into a three-year contract to provide daily janitorial services to a customer's office building. Each day's service is distinct and is satisfied over time using the same measure of progress. How should the company identify the performance obligation(s)?",
      ja: "会社は顧客のオフィスビルに3年間毎日清掃サービスを提供する契約を締結した。各日のサービスは区別でき、同じ進捗度の測定方法で一定期間にわたり充足される。履行義務はどのように識別すべきか。",
      c: [
        "As a single performance obligation consisting of a series of distinct services",
        "As approximately 1,095 separate performance obligations, one for each day",
        "As three performance obligations, one for each year",
        "As a single performance obligation satisfied at the end of the three years",
      ],
      a: 0,
      ex: "実質的に同一で移転パターンが同じ一連の区別できるサービスは「シリーズ」として単一の履行義務とする。日ごとに別個の履行義務とする必要はない。一定期間にわたり充足されるため3年後に一括認識もしない。",
    },
    {
      q: "During the year, a company sold 100 machines at $1,200 each, including a standard one-year warranty that only assures the machines meet agreed specifications. Expected warranty cost is $40 per machine. In addition, 30 customers purchased a two-year extended warranty (covering the period after the standard warranty) for $150 each; both items were priced at standalone selling prices. How much revenue should be recognized at the time of sale?",
      ja: "当期、会社は機械100台を1台$1,200で販売した。価格には合意された仕様を満たすことを保証するだけの標準1年保証が含まれ、見積保証費用は1台$40である。さらに30人の顧客が標準保証期間後をカバーする2年間の延長保証を1件$150で購入した。いずれも独立販売価格で価格設定されている。販売時に認識すべき収益はいくらか。",
      c: ["$124,500", "$116,000", "$120,000", "$115,500"],
      a: 2,
      ex: "保証型(assurance-type)保証は履行義務ではなく、費用$4,000を引当計上するのみで収益は$120,000(=100×1,200)。延長保証$4,500はサービス型の別個の履行義務であり、保証期間にわたり認識するため販売時には契約負債とする。",
    },
    {
      q: "A retailer sells a product for $100 and gives the customer a voucher for a 40% discount on any future purchase up to $50 within 30 days. The retailer is offering a 10% discount on all purchases to all customers during that period. The retailer estimates an 80% likelihood that the voucher will be redeemed. How much of the $100 should be allocated to the product (rounded)?",
      ja: "小売業者は商品を$100で販売し、30日以内の将来の購入($50まで)に使える40%割引券を顧客に付与した。同期間中、小売業者は全顧客に全購入品の10%割引を提供している。割引券の使用可能性は80%と見積られる。$100のうち商品に配分すべき金額はいくらか(端数処理後)。",
      c: ["$100.00", "$89.29", "$83.33", "$86.21"],
      a: 1,
      ex: "重要な権利の独立販売価格 = 50 × (40% − 10%) × 80% = 12。商品への配分 = 100 × 100 ÷ 112 = 89.29。誰でも受けられる10%を控除しない場合(50×40%×80%=16)は86.21となり誤り。",
    },
    {
      q: "A company sells a product and grants the customer an option to purchase additional units in the future at the same price that any customer would pay for those units (their standalone selling price). How should the option be accounted for?",
      ja: "会社は商品を販売し、将来追加の商品を、どの顧客でも支払う価格(独立販売価格)で購入できるオプションを顧客に付与した。このオプションはどのように会計処理すべきか。",
      c: [
        "As a separate performance obligation measured at its fair value",
        "As variable consideration that reduces the transaction price",
        "As a contract asset",
        "It is not a performance obligation; it is a marketing offer accounted for only when exercised",
      ],
      a: 3,
      ex: "独立販売価格で追加購入できるオプションは顧客に重要な権利を提供しないため履行義務ではなく、行使されたときに新たな契約として会計処理する。重要な割引など契約がなければ得られない権利がある場合のみ別個の履行義務となる。",
    },
    {
      q: "A company has a large number of contracts with similar characteristics that include a performance incentive. For a new contract, the possible amounts of consideration are $200,000 (40% probability), $220,000 (35% probability), and $250,000 (25% probability). The company concludes that the expected value method best predicts the consideration and that the constraint does not limit the estimate. What is the transaction price?",
      ja: "会社は業績インセンティブを含む類似した特性の契約を多数有している。新規契約の対価の可能性は、$200,000(確率40%)、$220,000(確率35%)、$250,000(確率25%)である。期待値法が対価を最もよく予測し、制限によって見積りは制約されないと判断した。取引価格はいくらか。",
      c: ["$200,000", "$223,333", "$219,500", "$250,000"],
      a: 2,
      ex: "期待値 = 200,000×40% + 220,000×35% + 250,000×25% = 80,000 + 77,000 + 62,500 = 219,500。$200,000は最頻値法の結果、$223,333は単純平均であり、多数の類似契約がある場合は期待値法が適切である。",
    },
    {
      q: "A contractor enters into a contract for fixed consideration of $400,000 plus a $30,000 bonus if the building receives a specific environmental certification. The contractor estimates a 75% probability of obtaining the certification and concludes it is highly probable that including the bonus will not result in a significant revenue reversal. Using the method that best predicts the consideration, what is the transaction price?",
      ja: "建設業者は固定対価$400,000に加え、建物が特定の環境認証を取得すれば$30,000のボーナスを受け取る契約を締結した。認証取得の確率は75%と見積られ、ボーナスを含めても重大な収益の戻入れが生じない可能性が非常に高いと判断した。対価を最もよく予測する方法を用いた場合、取引価格はいくらか。",
      c: ["$422,500", "$400,000", "$407,500", "$430,000"],
      a: 3,
      ex: "結果が2つしかない(取得するか否か)場合は最頻値法が適切であり、最も可能性の高い結果はボーナス獲得なので400,000 + 30,000 = 430,000。期待値$422,500は二者択一の契約では実際に生じえない金額となるため不適切である。",
    },
    {
      q: "Which of the following factors would INCREASE the likelihood or magnitude of a revenue reversal, making it more likely that an estimate of variable consideration should be constrained?",
      ja: "変動対価の見積りを制限すべき可能性を高める、すなわち収益の戻入れの可能性または金額を増大させる要因はどれか。",
      c: [
        "The amount is highly susceptible to factors outside the entity's influence, such as market volatility",
        "The uncertainty is expected to be resolved within a short period of time",
        "The entity has extensive experience with similar types of contracts",
        "The contract has a small number of possible consideration amounts",
      ],
      a: 0,
      ex: "外部要因(市場の変動、第三者の判断、天候等)の影響を強く受ける金額は戻入れリスクが高い。不確実性の解消までの期間が長い、経験が限られる、可能性のある金額の幅が広い・数が多い場合も制限要因となる。他の選択肢は逆の状況である。",
    },
    {
      q: "On January 1, Year 1, a customer pays $500,000 in advance for equipment that the company will deliver on December 31, Year 2. The contract contains a significant financing component, and the appropriate discount rate is 6%. How much revenue should the company recognize upon delivery on December 31, Year 2?",
      ja: "1年目1月1日、顧客は2年目12月31日に引き渡される設備の代金$500,000を前払いした。契約には重要な金融要素が含まれ、適切な割引率は6%である。2年目12月31日の引渡し時に認識すべき収益はいくらか。",
      c: ["$500,000", "$530,000", "$444,998", "$561,800"],
      a: 3,
      ex: "前受けの場合、会社が顧客から資金を借りていると考え、契約負債に利息費用を計上する。1年目利息30,000、2年目31,800で負債は500,000 × 1.06² = 561,800となり、引渡し時にその額を収益認識する。$444,998は現在価値に割り引いた誤りである。",
    },
    {
      q: "A customer agrees to pay for services with 1,000 shares of its common stock. The shares have a fair value of $20 per share at contract inception and $25 per share when the services are completed. The change in fair value results solely from changes in the share price. What transaction price should the company use?",
      ja: "顧客はサービスの対価として自社の普通株式1,000株を支払うことに合意した。株式の公正価値は契約開始時に1株$20、サービス完了時に1株$25である。公正価値の変動はもっぱら株価の変動による。会社が用いるべき取引価格はいくらか。",
      c: ["$20,000", "$25,000", "$22,500", "$0, because noncash consideration is not revenue"],
      a: 0,
      ex: "非現金対価は契約開始時の公正価値で測定する(ASC 606)。対価の形態(株価)による事後的な公正価値の変動は取引価格に含めず、変動対価の制限も適用しない。よって1,000 × 20 = 20,000。",
    },
    {
      q: "A manufacturer sells $1,000,000 of products to a retailer. In the same arrangement, the manufacturer pays the retailer $50,000 for in-store advertising. The advertising is a distinct service with a reasonably estimable fair value of $30,000. How much revenue should the manufacturer recognize from the product sales?",
      ja: "製造業者は小売業者に製品$1,000,000を販売した。同じ取決めで、製造業者は店頭広告の対価として小売業者に$50,000を支払う。広告は区別できるサービスであり、合理的に見積可能な公正価値は$30,000である。製造業者が製品販売から認識すべき収益はいくらか。",
      c: ["$1,000,000", "$950,000", "$980,000", "$970,000"],
      a: 2,
      ex: "顧客への支払対価のうち、区別できる財・サービスの公正価値を超える部分は収益の減額とする。超過額 = 50,000 − 30,000 = 20,000、収益 = 1,000,000 − 20,000 = 980,000。$30,000は広告宣伝費とする。全額減額の$950,000は誤り。",
    },
    {
      q: "Consideration payable to a customer that is accounted for as a reduction of the transaction price should be recognized when (or as) which of the following occurs?",
      ja: "取引価格の減額として会計処理される顧客への支払対価は、いつ認識すべきか。",
      c: [
        "When the customer requests payment",
        "At the later of when the entity recognizes revenue for the related transfer of goods or services, or when the entity pays or promises to pay the consideration",
        "At the earlier of when the entity recognizes revenue or pays the consideration",
        "Only when cash is actually paid to the customer",
      ],
      a: 1,
      ex: "顧客への支払対価による収益の減額は、関連する財・サービスの収益認識時と、支払う(または支払を約束する。慣行による暗黙の約束を含む)時の「いずれか遅い時点」で認識する。",
    },
    {
      q: "A contract bundles Product A, Product B, and Product C for a total price of $1,000. Product A is regularly sold separately for $400 and Product B for $300. Product C has never been sold separately, and its selling price is highly variable. Under the residual approach, what amount should be allocated to Product C?",
      ja: "契約は製品A・B・Cを合計$1,000でセット販売するものである。製品Aは単独で通常$400、製品Bは$300で販売されている。製品Cは単独で販売されたことがなく、販売価格の変動が非常に大きい。残余アプローチによると、製品Cに配分すべき金額はいくらか。",
      c: ["$333", "$300", "$0", "$1,000"],
      a: 1,
      ex: "残余アプローチ:取引価格から観察可能な独立販売価格の合計を控除する。1,000 − (400 + 300) = 300。残余アプローチは独立販売価格が非常に変動的または不確実な場合にのみ使用できる。均等配分の$333は誤り。",
    },
    {
      q: "A company sells Product X and Service Y together for $918. Product X is regularly sold separately for $600. Service Y is never sold separately; the company estimates its cost to provide Y at $300 and its normal margin on such services is 40% of cost. Using the expected cost plus a margin approach for Y, how much of the transaction price should be allocated to Service Y?",
      ja: "会社は製品XとサービスYを合計$918でセット販売している。製品Xは単独で通常$600で販売されている。サービスYは単独で販売されておらず、提供原価は$300、同種サービスの通常の利益率は原価の40%である。Yに予想コスト・プラス・マージン・アプローチを用いた場合、サービスYに配分すべき取引価格はいくらか。",
      c: ["$318", "$420", "$306", "$378"],
      a: 3,
      ex: "YのSSP = 300 × 1.4 = 420。SSP合計 = 600 + 420 = 1,020。Yへの配分 = 918 × 420 ÷ 1,020 = 378(Xは540)。$318は残余アプローチ(918 − 600)で、観察可能な原価がある場合は不適切である。",
    },
    {
      q: "A company regularly sells Products A, B, and C individually at standalone selling prices of $40, $55, and $45, respectively. It also regularly sells B and C together for $60 and A alone for $40. A customer purchases A, B, and C for $100. How much should be allocated to Product B?",
      ja: "会社は製品A・B・Cをそれぞれ独立販売価格$40、$55、$45で単独販売している。また、BとCのセットを通常$60で、Aを単独で$40で販売している。顧客がA・B・Cを$100で購入した。製品Bに配分すべき金額はいくらか。",
      c: ["$39.29", "$55.00", "$33.00", "$30.00"],
      a: 2,
      ex: "値引き$40(=140 − 100)がBとCに係るという観察可能な証拠があるため、値引きをBとCにのみ配分する。Aは$40、BとCの$60をSSP比で配分:B = 60 × 55 ÷ 100 = 33。全体の比例配分($39.29)は誤り。",
    },
    {
      q: "A company grants two licenses in one contract: License A for a fixed $800,000 and License B for a royalty of 3% of the customer's future sales of products using License B. The standalone selling prices are approximately $800,000 for A and the expected royalties for B. How should the variable royalty be allocated?",
      ja: "会社は1つの契約で2つのライセンスを供与した。ライセンスAは固定額$800,000、ライセンスBはそれを用いた顧客の製品の将来売上の3%のロイヤルティである。独立販売価格はAが約$800,000、Bが見込ロイヤルティ額にほぼ等しい。変動するロイヤルティはどのように配分すべきか。",
      c: [
        "Entirely to License B",
        "Between Licenses A and B based on relative standalone selling prices",
        "Entirely to License A",
        "It is not allocated; it is recognized when cash is received",
      ],
      a: 0,
      ex: "変動対価の条件が特定の履行義務の充足に個別に関連し、全額をその履行義務に配分しても配分の目的と整合する場合、変動対価はその履行義務にのみ配分する。本問ではロイヤルティはBに係り、各配分額がSSPとほぼ一致する。",
    },
    {
      q: "A contract has two performance obligations. At inception, the transaction price was allocated 60% to PO 1 and 40% to PO 2 based on relative standalone selling prices. PO 1 has been fully satisfied. Later, the estimate of variable consideration (which is not specifically related to either PO) increases by $50,000, and standalone selling prices have changed since inception. How much additional revenue should be recognized immediately?",
      ja: "契約には2つの履行義務がある。契約開始時、取引価格は独立販売価格比に基づき履行義務1に60%、履行義務2に40%配分された。履行義務1は完全に充足済みである。その後、いずれの履行義務にも個別に関連しない変動対価の見積りが$50,000増加し、独立販売価格は開始時から変動している。直ちに認識すべき追加収益はいくらか。",
      c: ["$50,000", "$0", "$20,000", "$30,000"],
      a: 3,
      ex: "取引価格の事後的な変動は、契約開始時と同じ基礎で配分し、開始後の独立販売価格の変動を反映して再配分しない。充足済みの履行義務1分 50,000 × 60% = 30,000 を変動した期に収益認識する。",
    },
    {
      q: "A manufacturer builds specialized equipment designed to a customer's unique specifications; contractual restrictions prevent the manufacturer from directing the equipment to another customer. If the customer terminates the contract for convenience, it must pay for the costs incurred to date plus a reasonable profit margin. How should revenue be recognized?",
      ja: "製造業者は顧客独自の仕様に基づく特殊設備を製作している。契約上の制限により、製造業者はその設備を他の顧客に振り向けることができない。顧客が任意に契約を解除した場合、顧客はそれまでに発生した原価に合理的な利益を加えた金額を支払わなければならない。収益はどのように認識すべきか。",
      c: [
        "At a point in time when the equipment is delivered",
        "At a point in time when the customer accepts the equipment",
        "Over time, because the asset has no alternative use and the entity has an enforceable right to payment for performance to date",
        "Over time, only if the customer controls the work in process",
      ],
      a: 2,
      ex: "履行により他に転用できない資産が創出され、かつ現在までに完了した履行に対する支払(合理的な利益を含む)を受ける強制可能な権利がある場合、一定期間にわたり充足される。原価のみの回収(利益なし)の権利ではこの要件を満たさない。",
    },
    {
      q: "Which of the following is NOT an indicator that control of an asset has transferred to a customer at a point in time?",
      ja: "資産の支配が一時点で顧客に移転したことを示す指標でないものはどれか。",
      c: [
        "The customer has legal title to the asset",
        "The entity has transferred physical possession of the asset",
        "The customer has accepted the asset",
        "The entity has incurred substantially all of the costs of producing the asset",
      ],
      a: 3,
      ex: "支配移転の指標は、支払を受ける現在の権利、法的所有権、物理的占有、所有に伴う重大なリスクと経済価値、顧客の検収である。生産原価の発生状況は会社側の状況であり支配移転の指標ではない。",
    },
    {
      q: "A company contracts to build 50 miles of highway for $1,000,000 and measures progress using an output method based on miles completed, which faithfully depicts its performance. By year-end, 20 miles are completed, and costs incurred are $450,000 of total estimated costs of $800,000. How much revenue should be recognized for the year?",
      ja: "会社は50マイルの高速道路を$1,000,000で建設する契約を締結し、履行を忠実に描写する完成マイル数に基づくアウトプット法で進捗度を測定している。期末までに20マイルが完成し、発生原価は見積総原価$800,000のうち$450,000である。当期に認識すべき収益はいくらか。",
      c: ["$400,000", "$562,500", "$450,000", "$200,000"],
      a: 0,
      ex: "アウトプット法:20 ÷ 50 = 40% → 1,000,000 × 40% = 400,000。$562,500は原価比例法(450 ÷ 800)によるインプット法の結果であり、本問の方法とは異なる。",
    },
    {
      q: "A contractor has a $5,000,000 contract to renovate a building, including installing elevators. Total expected costs are $4,000,000, including $1,500,000 for elevators purchased from a third party; the contractor is not involved in designing or manufacturing them. At year-end, the elevators have been delivered to the site (control transferred to the customer) but not installed, and total costs incurred, including the elevators, are $2,000,000. Using a cost-to-cost input method adjusted as required by ASC 606, how much revenue should be recognized?",
      ja: "建設業者はエレベーター設置を含む建物改修契約を$5,000,000で締結した。見積総原価は$4,000,000で、うち$1,500,000は第三者から購入するエレベーターである(業者は設計・製造に関与しない)。期末にエレベーターは現場に搬入され(支配は顧客に移転)、未設置である。エレベーターを含む発生原価は$2,000,000である。ASC 606が求める調整を行った原価比例法では、収益はいくらか。",
      c: ["$2,500,000", "$2,200,000", "$1,500,000", "$700,000"],
      a: 1,
      ex: "未据付資材は進捗度から除き、原価相当額(利益ゼロ)で収益認識する。進捗度 = (2,000,000 − 1,500,000) ÷ (4,000,000 − 1,500,000) = 20%。収益 = (5,000,000 − 1,500,000) × 20% + 1,500,000 = 2,200,000。無調整の$2,500,000は利益を過大計上する。",
    },
    {
      q: "A contractor has a fixed-price contract of $2,000,000 recognized over time using cost-to-cost. At the end of Year 1, costs incurred are $600,000 and estimated costs to complete are $1,500,000. What gross profit (loss) should be recognized in Year 1?",
      ja: "建設業者は$2,000,000の固定価格契約を原価比例法により一定期間にわたり認識している。1年目末の発生原価は$600,000、完成までの見積原価は$1,500,000である。1年目に認識すべき売上総利益(損失)はいくらか。",
      c: ["$(28,571)", "$0", "$(100,000)", "$571,429"],
      a: 2,
      ex: "見積総原価2,100,000 > 契約価格2,000,000で損失100,000が見込まれるため、損失全額を判明した期に認識する。進捗度に比例させた$(28,571)は誤りである。",
    },
    {
      q: "A contractor has a $3,000,000 contract (cost-to-cost method). At the end of Year 1, costs incurred were $1,000,000 and estimated costs to complete were $1,500,000. At the end of Year 2, cumulative costs are $2,200,000 and estimated costs to complete are $900,000. What gross profit (loss) should be recognized in Year 2?",
      ja: "建設業者は$3,000,000の契約を原価比例法で会計処理している。1年目末の発生原価は$1,000,000、完成までの見積原価は$1,500,000であった。2年目末の累積原価は$2,200,000、完成までの見積原価は$900,000である。2年目に認識すべき売上総利益(損失)はいくらか。",
      c: ["$(100,000)", "$(300,000)", "$(70,968)", "$(200,000)"],
      a: 1,
      ex: "1年目:進捗40%、利益 = 500,000 × 40% = 200,000。2年目:見積総原価3,100,000で契約損失100,000。累計で損失100,000とするため、2年目 = −100,000 − 200,000 = −300,000。$(100,000)は1年目の利益の取消しを漏らしている。",
    },
    {
      q: "Early in a contract satisfied over time, a company cannot reasonably measure its progress toward complete satisfaction, but it expects to recover the costs incurred. Costs incurred to date are $400,000. How much revenue should be recognized?",
      ja: "一定期間にわたり充足される契約の初期段階で、会社は完全な充足に向けての進捗度を合理的に測定できないが、発生した原価は回収できると見込んでいる。これまでの発生原価は$400,000である。認識すべき収益はいくらか。",
      c: ["$0", "$400,000 less an estimated loss", "The full contract price", "$400,000"],
      a: 3,
      ex: "進捗度を合理的に測定できないが発生原価の回収が見込まれる場合、進捗度を合理的に測定できるようになるまで、発生原価の範囲でのみ収益を認識する(利益ゼロ)。収益を全く認識しない旧完成基準的な処理は誤り。",
    },
    {
      q: "An online travel company sells airline tickets on its website for $800 each. It does not purchase tickets in advance, the airline sets the price and is responsible for providing the flight, and the company remits $720 per ticket to the airline. How much revenue should the travel company recognize per ticket?",
      ja: "オンライン旅行会社は自社サイトで航空券を1枚$800で販売している。事前に航空券を購入しておらず、価格は航空会社が設定し、フライトの提供責任も航空会社にある。旅行会社は1枚あたり$720を航空会社に送金する。旅行会社が1枚あたり認識すべき収益はいくらか。",
      c: ["$800", "$720", "$80", "$0"],
      a: 2,
      ex: "顧客に移転される前に航空券(フライト)を支配していないため代理人であり、手数料の純額 800 − 720 = 80 を収益とする。在庫リスクなし、価格決定権なし、提供責任なしはいずれも代理人を示す。総額$800は本人の場合の処理である。",
    },
    {
      q: "A tour operator purchases a block of hotel rooms in advance on a nonrefundable basis, sets the prices at which it resells the rooms, and is responsible for addressing customer complaints about the rooms. How should the tour operator report revenue from reselling the rooms?",
      ja: "ツアー運営会社はホテルの客室を返金不可の条件で事前に一括購入し、再販売価格を自ら設定し、客室に関する顧客の苦情に対応する責任を負う。ツアー運営会社は客室の再販売による収益をどのように報告すべきか。",
      c: [
        "Gross, as a principal, because it controls the rooms before they are transferred to customers",
        "Net, as an agent, because the hotel provides the rooms",
        "Net, because it does not own the hotel",
        "Gross only for rooms sold above cost",
      ],
      a: 0,
      ex: "顧客への移転前に客室の利用権を支配している(返金不可で事前購入=在庫リスク、価格決定権、履行の主たる責任)ため本人であり、総額で収益を認識する。ホテルが物理的にサービスを提供することは代理人の根拠にならない。",
    },
    {
      q: "On January 1, Year 1, a software company grants a customer a five-year license to its existing software for a fixed fee of $500,000, paid up front. The software has significant standalone functionality, the company has no obligation to update it, and the customer can use and benefit from the software on January 1. How much revenue should be recognized in Year 1?",
      ja: "1年目1月1日、ソフトウェア会社は顧客に既存ソフトウェアの5年間のライセンスを固定料$500,000(前払)で供与した。ソフトウェアには重要な独立した機能があり、会社に更新義務はなく、顧客は1月1日から使用し便益を得ることができる。1年目に認識すべき収益はいくらか。",
      c: ["$500,000", "$100,000", "$0", "$250,000"],
      a: 0,
      ex: "重要な独立した機能を持つ知的財産(機能的IP)のライセンスは「使用する権利」であり、顧客が使用・便益を得られる時点で一時点に収益認識する。期間の長さに関係なく1年目に$500,000。期間按分の$100,000は「アクセスする権利」の処理である。",
    },
    {
      q: "On January 1, Year 1, a restaurant chain grants a franchisee a 10-year right to use its trade name, which the franchisor continues to support through brand-building activities. The franchisee pays a $300,000 up-front fee plus a royalty of 5% of sales. Franchisee sales for Year 1 are $2,000,000. No other performance obligations exist. What total revenue should the franchisor recognize in Year 1?",
      ja: "1年目1月1日、レストランチェーンはフランチャイジーに商号の10年間の使用権を供与した。フランチャイザーはブランド強化活動により商号を継続的に支援する。フランチャイジーは当初料$300,000と売上の5%のロイヤルティを支払う。1年目のフランチャイジーの売上は$2,000,000である。他の履行義務はない。フランチャイザーが1年目に認識すべき収益合計はいくらか。",
      c: ["$400,000", "$130,000", "$30,000", "$300,000"],
      a: 1,
      ex: "商号などの象徴的IPは「アクセスする権利」であり一定期間にわたり認識:300,000 ÷ 10 = 30,000。売上ベースのロイヤルティは売上発生時に認識:2,000,000 × 5% = 100,000。合計130,000。当初料の一括認識($400,000)は誤り。",
    },
    {
      q: "A company licenses functional intellectual property to a customer in exchange for a royalty of 4% of the customer's sales of products using the IP. The license was transferred in Year 1. How should the company account for the royalty consideration?",
      ja: "会社は機能的知的財産を顧客にライセンス供与し、その対価としてIPを用いた顧客の製品売上の4%のロイヤルティを受け取る。ライセンスは1年目に移転した。会社はロイヤルティ対価をどのように会計処理すべきか。",
      c: [
        "Estimate total expected royalties and recognize them when the license is transferred, subject to the constraint",
        "Recognize royalties only when cash is received from the customer",
        "Recognize royalties when (or as) the later of the customer's subsequent sales occur or the performance obligation is satisfied",
        "Recognize royalties straight-line over the license term",
      ],
      a: 2,
      ex: "知的財産のライセンスに係る売上・使用量ベースのロイヤルティには例外規定があり、変動対価として事前に見積らず、(1)顧客の売上・使用の発生、(2)履行義務の充足、のいずれか遅い時点で認識する。現金主義ではない。",
    },
    {
      q: "In November of Year 1, a company and a customer agree to renew an existing software license (functional IP) for an additional three years beginning January 1, Year 2, for $90,000. When should the company recognize revenue for the renewal?",
      ja: "1年目11月、会社と顧客は既存のソフトウェア・ライセンス(機能的IP)を2年目1月1日から3年間$90,000で更新することに合意した。会社は更新の収益をいつ認識すべきか。",
      c: [
        "In November of Year 1, when the renewal is agreed",
        "Ratably over Year 2 through Year 4",
        "When the customer pays the renewal fee",
        "On January 1, Year 2, when the renewal period begins",
      ],
      a: 3,
      ex: "ライセンス更新の収益は、顧客が更新後のライセンスを使用し便益を得ることができる期間(更新期間)の開始前には認識しない。機能的IPは一時点認識なので更新期間開始日の2年目1月1日に$90,000を認識する。",
    },
    {
      q: "On December 1, Year 1, a company completes equipment for a customer under a bill-and-hold arrangement that meets all of the ASC 606 criteria for transfer of control. The contract price of $1,000,000 also covers storing the equipment for four months starting December 1. Standalone selling prices are $960,000 for the equipment and $40,000 for the four months of storage. How much revenue should be recognized in Year 1?",
      ja: "1年目12月1日、会社は請求済未出荷契約に基づき顧客の設備を完成させた。この契約は支配移転に関するASC 606の要件をすべて満たしている。契約価格$1,000,000には12月1日から4か月間の設備の保管も含まれる。独立販売価格は設備$960,000、4か月の保管$40,000である。1年目に認識すべき収益はいくらか。",
      c: ["$970,000", "$1,000,000", "$960,000", "$0"],
      a: 0,
      ex: "要件を満たす請求済未出荷では、設備の支配が移転した12月1日に$960,000を認識する。保管(カストディ)サービスは別個の履行義務で、期間にわたり認識:40,000 × 1/4 = 10,000。合計970,000。",
    },
    {
      q: "A manufacturer ships goods with a sales price of $100,000 (cost $60,000) to a dealer on consignment. During the year, the dealer sells 70% of the goods to end customers at the stated prices and retains a 10% commission. How much revenue should the manufacturer (consignor) recognize?",
      ja: "製造業者は販売価格$100,000(原価$60,000)の商品を委託販売としてディーラーに発送した。当期、ディーラーは商品の70%を所定の価格で最終顧客に販売し、10%の手数料を差し引いた。製造業者(委託者)が認識すべき収益はいくらか。",
      c: ["$63,000", "$70,000", "$100,000", "$7,000"],
      a: 1,
      ex: "委託販売では、ディーラーが最終顧客に販売した時点で委託者が収益認識する。委託者は本人なので総額 100,000 × 70% = 70,000 を収益、手数料7,000は販売費とする。手数料控除後の$63,000や発送時の$100,000は誤り。",
    },
    {
      q: "A company sells 2,000 units at $50 each (cost $30 per unit) with a right of return. It expects 4% of the units to be returned in resalable condition and expects costs of $200 in total to recover them. What amount should be recognized as an asset for the right to recover products from customers?",
      ja: "会社は返品権付きで1個$50(原価$30)の商品を2,000個販売した。4%が再販売可能な状態で返品されると見込み、回収費用は合計$200と見込んでいる。顧客から商品を回収する権利として計上すべき資産の金額はいくらか。",
      c: ["$2,400", "$4,000", "$2,200", "$1,800"],
      a: 2,
      ex: "返品見込80個(=2,000 × 4%)。返品資産 = 帳簿価額 80 × 30 − 回収費用200 = 2,200。返金負債は80 × 50 = 4,000で、資産と相殺せず総額表示する。回収費用を控除しない$2,400は誤り。",
    },
    {
      q: "A customer returns a non-defective product and receives in exchange another product of the same type, quality, condition, and price (for example, a different color). How should the seller account for this exchange?",
      ja: "顧客が欠陥のない商品を返品し、代わりに同じ種類・品質・状態・価格の別の商品(例:色違い)を受け取った。売手はこの交換をどのように会計処理すべきか。",
      c: [
        "As a return, requiring a refund liability at the time of the original sale",
        "As a new sale and the reversal of the original sale",
        "As an assurance-type warranty obligation",
        "It is not accounted for as a return",
      ],
      a: 3,
      ex: "同じ種類・品質・状態・価格の商品との交換は返品とはみなさず、返金負債や収益の減額は不要である。欠陥品の交換は保証として会計処理する。",
    },
    {
      q: "During Year 1, a retailer sold $100,000 of gift cards. Based on extensive history, it expects 10% of the card value never to be redeemed and recognizes breakage in proportion to redemptions. Customers redeemed $45,000 of gift cards in Year 1, and no unclaimed property laws apply. What is the contract liability for the gift cards at the end of Year 1?",
      ja: "1年目、小売業者は商品券$100,000を販売した。豊富な過去の実績から、券面額の10%は使用されないと見込み、非行使部分(breakage)は使用割合に比例して収益認識する。1年目に顧客は$45,000を使用し、未請求財産法は適用されない。1年目末の商品券に係る契約負債はいくらか。",
      c: ["$55,000", "$45,000", "$50,000", "$60,000"],
      a: 2,
      ex: "使用見込額90,000のうち45,000(50%)が使用されたため、非行使部分10,000 × 50% = 5,000も収益とする。収益 = 45,000 + 5,000 = 50,000、契約負債 = 100,000 − 50,000 = 50,000。$55,000はbreakageを無視、$45,000は販売時に全額認識した誤り。",
    },
    {
      q: "A retailer sells gift cards in a state where unclaimed property (escheat) laws require that the value of unredeemed cards be remitted to the state after a dormancy period. How should the retailer account for the expected unredeemed amounts that must be remitted to the state?",
      ja: "小売業者は、休眠期間経過後に未使用商品券の価額を州に納付することを未請求財産法が義務付けている州で商品券を販売している。州に納付しなければならない未使用見込額はどのように会計処理すべきか。",
      c: [
        "As a liability, not as breakage revenue",
        "As breakage revenue in proportion to redemptions",
        "As breakage revenue when the likelihood of redemption becomes remote",
        "As other income when the cards are sold",
      ],
      a: 0,
      ex: "州に納付すべき金額は会社が権利を得る対価ではないため、breakageとして収益認識せず負債として計上する。breakageの収益認識は、会社が権利を得ると見込む未行使部分に限られる。",
    },
    {
      q: "In Year 1, a retailer allocated $9,000 of transaction price to 10,000 loyalty points and expected 9,500 points to be redeemed; 4,500 points were redeemed in Year 1 and $4,263 of revenue was recognized. In Year 2, an additional 4,000 points are redeemed (8,500 cumulative), and the retailer revises its estimate of total redemptions to 9,700 points. How much loyalty revenue should be recognized in Year 2 (rounded)?",
      ja: "1年目、小売業者は10,000ポイントに取引価格$9,000を配分し、9,500ポイントの使用を見込んだ。1年目に4,500ポイントが使用され、収益$4,263を認識した。2年目にさらに4,000ポイントが使用され(累計8,500)、使用見込総数を9,700ポイントに見直した。2年目に認識すべきポイント収益はいくらか(端数処理後)。",
      c: ["$3,790", "$3,624", "$4,737", "$3,711"],
      a: 1,
      ex: "累計収益 = 9,000 × 8,500 ÷ 9,700 = 7,887。2年目収益 = 7,887 − 4,263 = 3,624(見積変更は累積的に反映)。当初見込9,500を用いると8,053 − 4,263 = 3,790となり誤り。",
    },
    {
      q: "To obtain a new four-year customer contract, a company incurred the following costs: $12,000 sales commission paid only because the contract was signed, $3,000 of travel costs to present the proposal, and $5,000 of a year-end bonus to the sales manager based on overall company profitability. The company expects to recover these costs. What amount should be capitalized as costs of obtaining the contract?",
      ja: "新規の4年間の顧客契約を獲得するため、会社は以下の原価を負担した。契約締結によってのみ支払われる販売手数料$12,000、提案のための出張費$3,000、会社全体の収益性に基づく営業マネージャーへの年末賞与$5,000。会社はこれらの回収を見込んでいる。契約獲得コストとして資産計上すべき金額はいくらか。",
      c: ["$20,000", "$15,000", "$17,000", "$12,000"],
      a: 3,
      ex: "資産計上できるのは契約を獲得しなければ発生しなかった増分コストのみである。販売手数料12,000は該当。出張費は契約の成否に関係なく発生し、会社全体の収益性に基づく賞与も特定契約の増分コストではないため費用処理する。",
    },
    {
      q: "A company pays a $2,000 commission to obtain a nine-month service contract that it does not expect to renew. Under ASC 340-40, the company may:",
      ja: "会社は更新の見込みがない9か月のサービス契約を獲得するために$2,000の手数料を支払った。ASC 340-40の下で、会社は次のうちどの処理ができるか。",
      c: [
        "Expense the commission as incurred, because the amortization period would be one year or less",
        "Capitalize the commission and amortize it over five years",
        "Record the commission as a reduction of revenue",
        "Capitalize the commission only if the contract is over 12 months",
      ],
      a: 0,
      ex: "実務上の便法として、資産計上した場合の償却期間が1年以内であれば、契約獲得の増分コストを発生時に費用処理できる。手数料は収益の減額ではない(顧客への支払ではない)。",
    },
    {
      q: "A company pays a $9,000 commission on a new two-year service contract. No commission will be paid on renewals, and the company expects the customer to renew for one additional two-year period. Commissions are not commensurate between initial and renewal contracts. What is the annual amortization of the capitalized commission?",
      ja: "会社は新規の2年間のサービス契約に対し$9,000の手数料を支払った。更新時には手数料は支払われず、顧客はさらに2年間1回更新すると見込まれる。当初契約と更新契約の手数料は釣り合っていない。資産計上した手数料の年間償却額はいくらか。",
      c: ["$4,500", "$2,250", "$3,000", "$9,000"],
      a: 1,
      ex: "資産計上した契約コストは、関連する財・サービスの移転パターン(予想される更新を含む)に従って償却する。更新時に同等の手数料が支払われないため償却期間は4年:9,000 ÷ 4 = 2,250。当初契約期間のみの$4,500は誤り。",
    },
    {
      q: "Under a five-year IT outsourcing contract, a company incurred the following before services began: $120,000 to design the customer's platform, $60,000 for data migration and testing, $150,000 for computer hardware, $20,000 to train its own employees, and $30,000 of general and administrative costs. The costs relate directly to the contract, generate resources used to satisfy it, and are expected to be recovered. What amount should be capitalized as contract fulfillment costs under ASC 340-40?",
      ja: "5年間のITアウトソーシング契約に関し、会社はサービス開始前に以下を負担した:顧客用プラットフォームの設計$120,000、データ移行とテスト$60,000、コンピュータ・ハードウェア$150,000、自社従業員の研修$20,000、一般管理費$30,000。これらは契約に直接関連し、履行に使用される資源を創出し、回収が見込まれる。ASC 340-40に基づき契約履行コストとして資産計上すべき金額はいくらか。",
      c: ["$330,000", "$200,000", "$180,000", "$380,000"],
      a: 2,
      ex: "プラットフォーム設計と移行・テスト(120,000 + 60,000 = 180,000)が履行コストとして資産計上される。ハードウェアは有形固定資産(ASC 360)、研修費は費用(ASC 720)、一般管理費は契約上顧客に明示的に請求できない限り費用である。",
    },
    {
      q: "A company has capitalized contract costs with a carrying amount of $100,000. It expects to receive $150,000 of remaining consideration for the related services and expects to incur $80,000 of costs that relate directly to providing those services that have not yet been recognized as expenses. What impairment loss should be recognized?",
      ja: "会社は資産計上した契約コストの帳簿価額$100,000を有している。関連するサービスについて残りの対価$150,000の受領を見込み、まだ費用認識されていない当該サービスの提供に直接関連する原価$80,000の発生を見込んでいる。認識すべき減損損失はいくらか。",
      c: ["$30,000", "$0", "$50,000", "$100,000"],
      a: 0,
      ex: "帳簿価額100,000が(残りの対価150,000 − 直接関連する未認識原価80,000 = 70,000)を超える30,000が減損損失である。米国基準では契約コストの減損の戻入れは認められない。",
    },
    {
      q: "A company has a three-year contract to provide services for $120,000 per year. At the end of Year 2, the parties agree to reduce the Year 3 fee to $100,000 and to extend the contract for three more years for a total of $260,000. The standalone selling price of the services is $100,000 per year at the modification date. How much revenue should be recognized in each of the remaining four years?",
      ja: "会社は年$120,000で3年間サービスを提供する契約を有している。2年目末、当事者は3年目の料金を$100,000に減額し、さらに3年間を合計$260,000で延長することに合意した。変更日におけるサービスの独立販売価格は年$100,000である。残り4年間の各年に認識すべき収益はいくらか。",
      c: ["$100,000", "$86,667", "$95,000", "$90,000"],
      a: 3,
      ex: "追加サービスの価格がSSPを反映しない(300,000ではなく260,000)ため別個の契約ではない。残りのサービスは区別できるので、旧契約の解約と新契約の締結として将来に向かって処理:(100,000 + 260,000) ÷ 4 = 90,000。",
    },
    {
      q: "A contractor's single performance obligation to build a facility has a price of $1,000,000 and expected total costs of $700,000. At the end of Year 1, costs incurred are $420,000, and $600,000 of revenue has been recognized. At the beginning of Year 2, a modification increases the price by $150,000 and expected costs by $100,000; the added work is not distinct. What cumulative catch-up adjustment to revenue should be recorded at the modification date?",
      ja: "建設業者の施設建設という単一の履行義務は、価格$1,000,000、見積総原価$700,000である。1年目末の発生原価は$420,000で、$600,000の収益を認識済みである。2年目期首に、価格を$150,000、見積原価を$100,000増加させる契約変更があり、追加作業は区別できない。変更日に記録すべき収益の累積的キャッチアップ修正額はいくらか。",
      c: ["$90,000 increase", "$3,750 increase", "$0", "$56,250 decrease"],
      a: 1,
      ex: "区別できない追加作業は既存契約の一部として累積的キャッチアップで処理する。新しい進捗度 = 420,000 ÷ 800,000 = 52.5%。累計収益 = 1,150,000 × 52.5% = 603,750 → 修正額 = 603,750 − 600,000 = +3,750。",
    },
    {
      q: "A contractor and a customer have approved a change in the scope of a construction contract but have not yet determined the corresponding change in price. How should the contractor account for the unpriced change order?",
      ja: "建設業者と顧客は工事契約の範囲の変更を承認したが、対応する価格の変更はまだ決定していない。建設業者はこの価格未決定の変更指示をどのように会計処理すべきか。",
      c: [
        "Ignore it until the price change is agreed in writing",
        "Account for it as a separate contract at the contractor's list price",
        "Estimate the change to the transaction price as variable consideration, subject to the constraint",
        "Recognize the expected price change as revenue immediately",
      ],
      a: 2,
      ex: "範囲の変更が承認され価格が未決定の契約変更は、承認された範囲変更に係る価格の変動を変動対価として見積り、制限を適用して取引価格に反映する。合意を待つ必要はない。",
    },
    {
      q: "A company contracts to deliver Product A ($400) and Product B ($600). Payment of the full $1,000 is due only after both products are delivered. When Product A is delivered, what should the company record?",
      ja: "会社は製品A($400)と製品B($600)を引き渡す契約を締結した。総額$1,000の支払は両製品の引渡し後にのみ期限が到来する。製品Aを引き渡した時点で、会社は何を計上すべきか。",
      c: [
        "A receivable of $400",
        "A contract asset of $400",
        "A contract liability of $600",
        "No entry until Product B is delivered",
      ],
      a: 1,
      ex: "対価への権利が時の経過以外の条件(Bの引渡し)に左右されるため、債権ではなく契約資産$400を計上する。Bを引き渡した時点で無条件の権利となり、債権$1,000を計上し契約資産を振り替える。",
    },
    {
      q: "On January 1, a company enters into a noncancellable contract to deliver a product on March 31. The customer must pay $5,000 in advance on January 31. The customer pays on February 15. What entry, if any, should the company record on January 31?",
      ja: "1月1日、会社は3月31日に製品を引き渡す解約不能契約を締結した。顧客は1月31日に$5,000を前払いしなければならない。顧客は2月15日に支払った。1月31日に会社はどのような仕訳を行うべきか。",
      c: [
        "No entry, because no cash has been received",
        "Debit cash $5,000; credit contract liability $5,000",
        "Debit contract asset $5,000; credit revenue $5,000",
        "Debit receivable $5,000; credit contract liability $5,000",
      ],
      a: 3,
      ex: "解約不能契約で支払期日が到来すれば対価への無条件の権利が生じるため、1月31日に債権と契約負債を計上する。契約が解約可能であれば、現金受領時まで仕訳しない。収益は引渡し時に認識する。",
    },
    {
      q: "At year-end, a company has two contracts with the same customer that are not combined. Contract 1 has a contract asset of $50,000 and a contract liability of $20,000. Contract 2 has a contract liability of $45,000. How should these be presented on the balance sheet?",
      ja: "期末に会社は同一顧客と結合されない2つの契約を有している。契約1には契約資産$50,000と契約負債$20,000、契約2には契約負債$45,000がある。貸借対照表上どのように表示すべきか。",
      c: [
        "Contract asset $30,000 and contract liability $45,000",
        "Net contract liability $15,000",
        "Contract asset $50,000 and contract liability $65,000",
        "Contract asset $5,000",
      ],
      a: 0,
      ex: "契約資産と契約負債は契約ごとに純額で表示し、異なる契約間では相殺しない。契約1は純額で契約資産30,000、契約2は契約負債45,000。すべての契約を相殺した$15,000は誤り。",
    },
    {
      q: "A company is providing monthly services under a contract that met the ASC 606 criteria at inception. During the second year, the customer's ability to pay deteriorates significantly, and it is no longer probable that the company will collect consideration for future services. How should the company respond?",
      ja: "会社は契約開始時にASC 606の要件を満たした契約に基づき月次サービスを提供している。2年目に顧客の支払能力が著しく悪化し、将来のサービスに係る対価の回収可能性が高いとはいえなくなった。会社はどう対応すべきか。",
      c: [
        "Reverse all revenue previously recognized under the contract",
        "Continue to recognize revenue for future services because the contract criteria are assessed only at inception",
        "Stop recognizing revenue for future services under the contract model and assess existing receivables for credit losses",
        "Reduce the transaction price for services already provided",
      ],
      a: 2,
      ex: "事実と状況の重大な変化があれば契約要件を再評価する。将来分の回収可能性が高くなければ以後は契約が存在しないものとして処理し、既に認識した債権はASC 326で信用損失を評価する。過去の収益は取り消さない。",
    },
    {
      q: "A company sells equipment to a customer for $500,000. The customer has the right to require the company to repurchase the equipment in three years for $400,000. The expected market value of the equipment in three years is $300,000, so the customer has a significant economic incentive to exercise the put option. The arrangement is not part of a sale-leaseback. How should the company account for the arrangement?",
      ja: "会社は設備を顧客に$500,000で販売した。顧客は3年後に会社へ$400,000で買い戻すよう要求する権利を有する。3年後の設備の見込市場価値は$300,000であり、顧客にはプットオプションを行使する重要な経済的インセンティブがある。セール・アンド・リースバックの一部ではない。会社はこの取決めをどのように会計処理すべきか。",
      c: [
        "As a lease",
        "As a sale with a right of return",
        "As a financing arrangement",
        "As a sale, recognizing $500,000 of revenue",
      ],
      a: 0,
      ex: "顧客のプットオプションで、買戻価格が当初販売価格未満かつ顧客に行使の重要な経済的インセンティブがある場合はリース(ASC 842)として処理する。買戻価格が当初価格以上であれば金融取引となる。",
    },
    {
      q: "Which of the following arrangements is most likely satisfied over time because the customer simultaneously receives and consumes the benefits as the entity performs?",
      ja: "企業の履行に伴い顧客が便益を同時に受け取り消費するため、一定期間にわたり充足される可能性が最も高い取決めはどれか。",
      c: [
        "Sale of standard inventory shipped FOB destination",
        "Monthly payroll processing services",
        "Construction of a standard model home on the entity's own land for later sale",
        "Sale of a functional software license",
      ],
      a: 1,
      ex: "給与計算処理のような定型的・反復的なサービスは、他の企業が残りの作業を引き継いでも既履行部分をやり直す必要がなく、顧客が同時に便益を受け消費する。棚卸資産や機能的ライセンスは一時点、自社用地の標準住宅は他に転用可能である。",
    },
    {
      q: "A company sells goods FOB shipping point, so control transfers to the customer when the goods are shipped. The company also arranges and pays for delivery to the customer. Under ASC 606, the company may elect to:",
      ja: "会社は商品を出荷地渡し(FOB shipping point)で販売しており、出荷時に支配が顧客に移転する。会社は顧客への配送の手配と支払も行う。ASC 606の下で、会社は次のうちどれを選択できるか。",
      c: [
        "Treat shipping as a separate performance obligation recognized at a point in time before shipment",
        "Present shipping costs as a reduction of revenue",
        "Account for shipping and handling as a fulfillment activity rather than a separate performance obligation",
        "Defer all revenue until the goods are delivered",
      ],
      a: 2,
      ex: "支配移転後に行われる出荷・取扱活動は、会計方針の選択により履行活動(履行コスト)として処理でき、別個の履行義務としなくてよい。選択しない場合は配送サービスを別個の履行義務とし、取引価格を配分する。",
    },
    {
      q: "A company invoices a customer $10,600, which includes $600 of sales tax collected on behalf of the state. The company has elected to exclude sales taxes from the transaction price. How much revenue should be recognized?",
      ja: "会社は顧客に$10,600を請求した。これには州に代わって徴収した売上税$600が含まれる。会社は売上税を取引価格から除外する方針を選択している。認識すべき収益はいくらか。",
      c: ["$10,600", "$9,400", "$10,000", "$600"],
      a: 2,
      ex: "第三者(政府)のために回収する金額は取引価格に含めない。ASC 606は売上税を取引価格から除外する会計方針の選択を認めており、収益は10,600 − 600 = 10,000、$600は未払税金とする。",
    },
    {
      q: "A manufacturer sells 1,000 units at $50 each to a distributor. Based on extensive history with similar products, the manufacturer expects to grant the distributor a price concession of 10% to help it sell the units, and it concludes that a significant revenue reversal is not probable for that estimate. How much revenue should be recognized when control of the units transfers?",
      ja: "製造業者は販売業者に1個$50で1,000個を販売した。類似製品についての豊富な実績から、販売を支援するために10%の価格譲歩を行うと見込んでおり、その見積りについて重大な収益の戻入れが生じる可能性は高くないと判断した。支配移転時に認識すべき収益はいくらか。",
      c: ["$50,000", "$45,000", "$40,000", "$0 until the distributor sells the units"],
      a: 1,
      ex: "価格譲歩は変動対価であり、見込額を控除し制限を考慮して取引価格を算定する。50,000 × (1 − 10%) = 45,000。支配が移転している(委託販売ではない)ため販売業者の再販売まで待つ必要はない。",
    },
    {
      q: "On October 1, Year 1, a customer joins a fitness club, paying a nonrefundable $240 joining fee and $600 for a 12-month membership. The joining fee does not transfer a separate good or service, and the renewal option does not provide a material right. How much revenue should the club recognize for Year 1 (calendar year)?",
      ja: "1年目10月1日、顧客はフィットネスクラブに入会し、返金不要の入会金$240と12か月の会費$600を支払った。入会金は別個の財・サービスを移転せず、更新オプションは重要な権利を提供しない。クラブが1年目(暦年)に認識すべき収益はいくらか。",
      c: ["$390", "$840", "$150", "$210"],
      a: 3,
      ex: "財・サービスを移転しない返金不要の前払報酬は、将来の財・サービスに対する前払いとして、それらの提供期間(12か月)にわたり認識する。(240 + 600) × 3/12 = 210。入会金を即時認識する$390は誤り。",
    },
    {
      q: "A company sells an appliance with a three-year warranty, although applicable law requires only a one-year warranty and industry practice is one year. The warranty cannot be purchased separately. Which of the following best supports accounting for part of the warranty as a service-type warranty (a separate performance obligation)?",
      ja: "会社は家電を3年保証付きで販売している。法律上は1年の保証が求められ、業界慣行も1年である。保証は単独で購入できない。保証の一部をサービス型保証(別個の履行義務)として会計処理する根拠として最も適切なものはどれか。",
      c: [
        "The warranty cannot be purchased separately",
        "The warranty coverage period is longer than the period required by law and customary in the industry, indicating a service beyond assurance",
        "The warranty is required by law for the first year",
        "The company expects few warranty claims",
      ],
      a: 1,
      ex: "単独で購入できない保証でも、合意された仕様への適合保証を超えるサービスを提供する場合はその部分を履行義務とする。法定・業界慣行より長い保証期間はその指標である。法律で要求される部分は保証型を示す。",
    },
    {
      q: "On April 1, Year 1, a company receives $12,000 for a one-year subscription that gives the customer unlimited access to when-and-if-available software updates and technical support as needed. The company's efforts are expected to be spread evenly over the year. How much revenue should be recognized in Year 1 (calendar year)?",
      ja: "1年目4月1日、会社は、利用可能になった場合のソフトウェア更新と必要に応じた技術サポートを無制限に受けられる1年間のサブスクリプションの対価$12,000を受領した。会社の労力は年間を通じて均等に生じると見込まれる。1年目(暦年)に認識すべき収益はいくらか。",
      c: ["$9,000", "$12,000", "$0", "$3,000"],
      a: 0,
      ex: "提供可能になった時点の更新やサポートは、顧客がいつでも利用できる「待機義務(stand-ready obligation)」であり、期間にわたり定額で認識する。12,000 × 9/12 = 9,000、残り3,000は契約負債。実際の利用時まで繰り延べるのは誤り。",
    },
  ],
});

CPA.tbs({
  id: "TBS-FAR-16",
  section: "FAR",
  chapter: "FAR-02",
  title: "取引価格の算定と複数の履行義務への配分(変動対価・顧客への支払対価)",
  scenario: `<p>On January 1, Year 1, Mori Corp. enters into a contract with a customer to deliver equipment, install it, and provide maintenance for two years. Terms:</p>
<ul><li>Fixed consideration of <b>$600,000</b>.</li>
<li>A <b>$50,000</b> bonus if installation is completed by March 31, Year 1. Mori estimates an <b>80%</b> probability of earning the bonus and concludes that including it will not result in a significant revenue reversal.</li>
<li>Mori grants the customer a <b>$20,000</b> cash credit at contract inception; the customer provides no distinct goods or services in exchange.</li></ul>
<table><tr><th>Performance obligation</th><th>Standalone selling price</th><th>Timing</th></tr>
<tr><td>Equipment</td><td>$540,000</td><td>Delivered January 15, Year 1</td></tr>
<tr><td>Installation</td><td>$60,000</td><td>Completed March 20, Year 1</td></tr>
<tr><td>Maintenance (2 years)</td><td>$120,000</td><td>April 1, Year 1 – March 31, Year 3 (evenly)</td></tr></table>
<p>The customer paid the $600,000 on January 15 and the $50,000 bonus on March 31; the $20,000 credit was settled in cash. No other amounts were received in Year 1.</p>
<p class="ja">1年目1月1日、Mori社は顧客と、設備の引渡し・据付・2年間の保守を提供する契約を締結した。固定対価$600,000、3月31日までに据付が完了すれば$50,000のボーナス(獲得確率80%、含めても重大な戻入れは生じないと判断)。契約開始時に顧客へ$20,000の現金クレジットを付与し、顧客から区別できる財・サービスは受け取らない。独立販売価格は設備$540,000(1月15日引渡し)、据付$60,000(3月20日完了)、保守$120,000(1年目4月1日〜3年目3月31日、均等)。顧客は1月15日に$600,000、3月31日にボーナス$50,000を支払い、$20,000のクレジットは現金で決済された。1年目にその他の受領はない。</p>`,
  rows: [
    { label: "Method to estimate the installation bonus(据付ボーナスの見積方法)", type: "select", options: ["Expected value", "Most likely amount", "Not included until received"], answer: "Most likely amount" },
    { label: "Transaction price(取引価格)", type: "num", answer: 630000 },
    { label: "Amount allocated to equipment(設備への配分額)", type: "num", answer: 472500 },
    { label: "Amount allocated to maintenance(保守への配分額)", type: "num", answer: 105000 },
    { label: "Total revenue recognized in Year 1(1年目の収益合計)", type: "num", answer: 564375 },
    { label: "Contract liability at December 31, Year 1(1年目末の契約負債)", type: "num", answer: 65625 },
  ],
  explain: `<p>ボーナスは獲得するか否かの2通りなので最頻値法を用い$50,000を含める(期待値40,000ではない)。顧客への支払対価$20,000は区別できる財と交換でないため取引価格から減額。取引価格 = 600,000 + 50,000 − 20,000 = 630,000。</p>
<p>SSP合計720,000、配分比率 630,000 ÷ 720,000 = 87.5%。設備 540,000 × 87.5% = 472,500、据付 52,500、保守 105,000。</p>
<p>1年目収益 = 472,500 + 52,500 + 105,000 × 9/24(39,375) = 564,375。</p>
<p>純受領額 = 600,000 + 50,000 − 20,000 = 630,000。契約負債 = 630,000 − 564,375 = 65,625(未履行の保守分)。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-17",
  section: "FAR",
  chapter: "FAR-02",
  title: "返品権付販売・本人か代理人か・商品券の非行使部分",
  scenario: `<p>Hayashi Retail had the following transactions in Year 1:</p>
<ol><li>Sold <b>5,000</b> units of its own merchandise at <b>$80</b> each (cost <b>$50</b> each) for cash with a 30-day right of return. Based on reliable history, Hayashi expects <b>3%</b> of the units to be returned in resalable condition at no significant recovery cost. No returns had occurred by year-end.</li>
<li>Through its online marketplace, third-party sellers sold goods to customers for <b>$200,000</b>. The sellers set prices and ship the goods directly; Hayashi never controls the goods and keeps a <b>15%</b> commission, remitting the rest to the sellers.</li>
<li>Sold gift cards of <b>$50,000</b>. Hayashi expects <b>8%</b> of gift card value never to be redeemed (no escheat laws apply) and recognizes breakage in proportion to redemptions. Cards of <b>$23,000</b> were redeemed during Year 1.</li></ol>
<p class="ja">Hayashi社の1年目の取引:(1)自社商品5,000個を1個$80(原価$50)で30日間の返品権付きで現金販売。信頼できる実績から3%が再販売可能な状態で返品され、重要な回収費用はないと見込む。期末までに返品はない。(2)自社オンラインマーケットプレイスで第三者の出品者が顧客に$200,000の商品を販売。価格設定・発送は出品者が行い、Hayashi社は商品を支配せず、15%の手数料を受け取り残額を出品者に送金。(3)商品券$50,000を販売。8%は使用されないと見込み(未請求財産法の適用なし)、非行使部分は使用割合に比例して認識。1年目に$23,000が使用された。</p>`,
  rows: [
    { label: "Revenue from merchandise sales(自社商品の売上収益)", type: "num", answer: 388000 },
    { label: "Refund liability at year-end(期末の返金負債)", type: "num", answer: 12000 },
    { label: "Asset for right to recover returned products(返品資産)", type: "num", answer: 7500 },
    { label: "Revenue from marketplace transactions(マーケットプレイス取引の収益)", type: "num", answer: 30000 },
    { label: "Revenue from gift cards, including breakage(商品券の収益・非行使部分を含む)", type: "num", answer: 25000 },
    { label: "Total revenue for Year 1(1年目の収益合計)", type: "num", answer: 443000 },
  ],
  explain: `<p>(1)売上総額400,000、返品見込150個 × 80 = 12,000を返金負債とし、収益 = 388,000。返品資産 = 150 × 50 = 7,500(売上原価は250,000 − 7,500 = 242,500)。</p>
<p>(2)商品を支配しないため代理人。収益は手数料の純額 200,000 × 15% = 30,000。総額200,000は誤り。</p>
<p>(3)使用見込額 = 50,000 × 92% = 46,000、使用割合 = 23,000 ÷ 46,000 = 50%。非行使部分 4,000 × 50% = 2,000。収益 = 23,000 + 2,000 = 25,000。</p>
<p>合計 = 388,000 + 30,000 + 25,000 = 443,000。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-18",
  section: "FAR",
  chapter: "FAR-02",
  title: "契約コスト(獲得・履行)と契約変更",
  scenario: `<p>On January 1, Year 1, Sato Services signed a three-year contract to provide IT management services to a customer for <b>$300,000 per year</b>. The services are a series of distinct services satisfied evenly over time. In connection with the contract:</p>
<ul><li>Sato paid a <b>$36,000</b> sales commission that was payable only because the contract was signed. No renewal is expected.</li>
<li>Sato paid its sales director a <b>$10,000</b> year-end bonus based on overall company revenue targets, and incurred <b>$5,000</b> of legal fees to review the contract draft; the legal fees would have been incurred even if the contract had not been signed.</li>
<li>Before services began, Sato incurred <b>$90,000</b> of setup costs that relate directly to the contract, generate resources used to perform, and are expected to be recovered. These costs are not within the scope of other Topics.</li></ul>
<p>On December 31, Year 1, the parties modify the contract: the fee for Years 2 and 3 is reduced to <b>$270,000 per year</b>, and the contract is extended through Year 4 for an additional <b>$240,000</b>. The standalone selling price of the services at that date is <b>$270,000 per year</b>.</p>
<p class="ja">1年目1月1日、Sato社は顧客に年$300,000で3年間ITマネジメント・サービスを提供する契約を締結した。サービスは一定期間にわたり均等に充足される一連の区別できるサービスである。関連して、(1)契約締結によってのみ支払われる販売手数料$36,000(更新見込なし)、(2)会社全体の売上目標に基づく営業部長への年末賞与$10,000、および契約が締結されなくても発生した契約書レビューの弁護士費用$5,000、(3)サービス開始前の準備費用$90,000(契約に直接関連し、履行に使用される資源を創出し、回収が見込まれ、他のTopicの範囲外)が発生した。1年目12月31日に契約変更があり、2・3年目の料金を年$270,000に減額し、4年目まで$240,000で延長した。同日のサービスの独立販売価格は年$270,000である。</p>`,
  rows: [
    { label: "Capitalized costs of obtaining the contract(資産計上する契約獲得コスト)", type: "num", answer: 36000 },
    { label: "Amortization of costs of obtaining the contract, Year 1(1年目の契約獲得コスト償却額)", type: "num", answer: 12000 },
    { label: "Capitalized contract fulfillment costs(資産計上する契約履行コスト)", type: "num", answer: 90000 },
    { label: "Total expense for the commission, bonus, and legal fees recognized in Year 1(1年目に費用認識する手数料・賞与・弁護士費用の合計)", type: "num", answer: 27000 },
    { label: "Accounting for the modification(契約変更の会計処理)", type: "select", options: ["Separate contract", "Termination of the existing contract and creation of a new contract (prospective)", "Cumulative catch-up adjustment"], answer: "Termination of the existing contract and creation of a new contract (prospective)" },
    { label: "Service revenue recognized in Year 2(2年目のサービス収益)", type: "num", answer: 260000 },
  ],
  explain: `<p>契約獲得の増分コストは販売手数料36,000のみ。償却期間3年(更新見込なし)で年12,000。賞与は特定契約の増分コストでなく、弁護士費用は契約の成否に関係なく発生するため費用処理。</p>
<p>1年目の費用 = 12,000(償却)+ 10,000 + 5,000 = 27,000。準備費用90,000は履行コストとして資産計上(年30,000で償却)。</p>
<p>追加された4年目の価格240,000はSSP270,000を反映しないため別個の契約ではない。残りのサービスは移転済みのサービスと区別できるので、既存契約の解約と新契約の締結として将来に向かって処理する。</p>
<p>残りの対価 = 270,000 × 2 + 240,000 = 780,000 ÷ 3年 = 260,000/年。</p>`,
});
