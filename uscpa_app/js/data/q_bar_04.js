// BAR の追加問題(企業結合・非支配持分・連結手続・VIE・のれんの減損・プッシュダウン会計・共通支配下の取引)

CPA.extend("BAR-02", {
  mcq: [
    {
      q: "Alder Corp. issued new voting shares to the shareholders of Birch Inc. in exchange for all of Birch's outstanding shares. After the exchange, Birch's former shareholders hold 60% of Alder's voting shares, Birch's former directors appoint a majority of the combined board, and Birch's senior management team manages the combined entity. For accounting purposes, which entity is the acquirer?",
      ja: "Alder社は新たな議決権株式をBirch社の株主に発行し、Birch社の発行済株式すべてと交換した。交換後、Birch社の旧株主がAlder社の議決権株式の60%を保有し、Birch社の旧取締役が統合後の取締役会の過半数を指名し、Birch社の上級経営陣が統合後の企業を経営している。会計上の取得企業はどちらか。",
      c: [
        "Alder, because it is the entity that issued its equity interests",
        "Birch, because its former owners and management obtain control of the combined entity",
        "Whichever entity has the larger total assets before the combination",
        "A new entity, because the combination is a merger of equals that is accounted for as a pooling",
      ],
      a: 1,
      ex: "議決権の過半数、取締役会の構成、経営陣の支配がすべてBirch側にあるため、法的な取得企業はAlderでも会計上の取得企業はBirchであり、逆取得として処理する。株式を発行した企業が常に取得企業とは限らず、持分プーリング法は認められていない。",
    },
    {
      q: "Cedar Co. publicly announced a planned acquisition of Dogwood Co. on February 1. The purchase agreement was signed on March 1, Dogwood's shareholders approved the deal on April 15, and on May 1 Cedar transferred the cash consideration and obtained control of Dogwood. Absent any written agreement to the contrary, the acquisition date is:",
      ja: "Cedar社は2月1日にDogwood社の買収計画を公表した。買収契約は3月1日に締結され、4月15日にDogwood社の株主が承認し、5月1日にCedar社が現金対価を支払いDogwood社の支配を獲得した。別段の書面合意がない場合、取得日はいつか。",
      c: ["February 1", "March 1", "May 1", "April 15"],
      a: 2,
      ex: "取得日は取得企業が被取得企業の支配を獲得した日であり、通常は対価を移転しクロージングした日(5月1日)である。公表日・契約締結日・株主承認日は支配獲得日ではない。",
    },
    {
      q: "To acquire 100% of Elm Co., Fir Corp. paid $500,000 cash, issued 10,000 shares of its $1 par common stock with a fair value of $30 per share, and transferred land with a carrying amount of $80,000 and a fair value of $120,000 to Elm's former owners. Fir also paid $15,000 to register and issue the shares. What is the consideration transferred?",
      ja: "Fir社はElm社の100%を取得するため、現金$500,000を支払い、額面$1の普通株式10,000株(1株当たり公正価値$30)を発行し、帳簿価額$80,000・公正価値$120,000の土地をElm社の旧株主に移転した。さらに株式の登録・発行費用$15,000を支払った。移転された対価はいくらか。",
      c: ["$920,000", "$880,000", "$935,000", "$800,000"],
      a: 0,
      ex: "対価は取得日の公正価値で測定する:500,000 + 300,000 + 120,000 = 920,000。土地は公正価値で測定し、差額$40,000は利益として認識する(帳簿価額を使う$880,000は誤り)。株式発行費用は対価に含めず払込資本から控除する。",
    },
    {
      q: "As part of a business combination, an acquirer agreed to issue a fixed number of additional shares to the seller if the acquiree meets an earnings target. The arrangement is classified as equity, with an acquisition-date fair value of $60,000. At the next reporting date, the fair value of the arrangement has increased to $90,000. How should the acquirer account for the $30,000 increase?",
      ja: "企業結合の一環として、取得企業は被取得企業が利益目標を達成した場合に一定数の追加株式を売主に発行することに合意した。この取決めは資本に分類され、取得日の公正価値は$60,000である。次の報告日に公正価値は$90,000に増加した。$30,000の増加をどう会計処理すべきか。",
      c: [
        "Recognize a $30,000 loss in earnings",
        "Increase goodwill by $30,000",
        "Recognize $30,000 in other comprehensive income",
        "Do not remeasure; the eventual settlement is accounted for within equity",
      ],
      a: 3,
      ex: "資本に分類された条件付対価は再測定せず、その後の決済も資本の中で処理する。負債に分類された条件付対価であれば公正価値で再測定し、変動を損益に計上する。のれんの修正は測定期間中の取得日時点の事実に関する情報による場合に限られる。",
    },
    {
      q: "An acquirer recorded a liability-classified contingent consideration arrangement at a provisional acquisition-date fair value of $100,000. Three months later, still within the measurement period, the acquirer obtained information about facts that existed at the acquisition date indicating the acquisition-date fair value was actually $115,000. How should the acquirer record the $15,000 adjustment?",
      ja: "取得企業は負債に分類される条件付対価を暫定的な取得日公正価値$100,000で計上した。3か月後(測定期間内)、取得日に存在していた事実に関する情報を入手し、取得日の公正価値は実際には$115,000であったことが判明した。$15,000の修正をどう計上すべきか。",
      c: [
        "As a $15,000 loss in current-period earnings",
        "As a $15,000 increase in the liability and in goodwill",
        "By restating prior-period financial statements with the adjustment recorded in OCI",
        "No adjustment until the contingent consideration is settled",
      ],
      a: 1,
      ex: "取得日時点の事実に関する測定期間中の新情報による修正は測定期間の修正であり、負債とのれんを$15,000増加させる。取得後の事象(目標達成状況の変化など)による公正価値の変動であれば損益に計上する。",
    },
    {
      q: "In connection with acquiring 100% of a target for $2,000,000 cash, an acquirer incurred $50,000 of external legal and due diligence fees, $30,000 of salaries for its internal acquisitions department attributable to the deal, and $40,000 of costs to issue debt that financed the purchase. What amount should be recognized as expense in the period of the acquisition?",
      ja: "取得企業は現金$2,000,000で対象会社の100%を取得するにあたり、外部の法務・デューデリジェンス費用$50,000、本件に帰属する社内買収部門の給与$30,000、買収資金を調達するための社債発行費用$40,000を負担した。取得年度に費用として認識すべき金額はいくらか。",
      c: ["$120,000", "$50,000", "$80,000", "$0"],
      a: 2,
      ex: "取得関連費用(外部報酬$50,000と社内の一般管理費$30,000)は発生時に費用処理する:80,000。社債発行費用$40,000は負債の帳簿価額から控除し実効金利法で償却するため、当期の一括費用には含めない。",
    },
    {
      q: "In a business combination, which of the following items should the acquirer NOT recognize as an identifiable intangible asset separately from goodwill?",
      ja: "企業結合において、取得企業がのれんとは区別して識別可能な無形資産として認識すべきでないものはどれか。",
      c: [
        "A customer list that could be sold or licensed",
        "An order backlog arising from purchase orders",
        "A registered trade name",
        "An assembled workforce of skilled employees",
      ],
      a: 3,
      ex: "無形資産は契約・法的要件または分離可能性要件を満たす場合に識別可能である。集合的な労働力(assembled workforce)はいずれも満たさないためのれんに含める。顧客リストは分離可能、受注残は契約、登録商標は法的権利に基づく。",
    },
    {
      q: "In a business combination, an acquirer obtained an in-process research and development (IPR&D) project with an acquisition-date fair value of $300,000. How should the acquirer initially account for the IPR&D?",
      ja: "企業結合において、取得企業は取得日公正価値$300,000の仕掛研究開発(IPR&D)プロジェクトを取得した。取得企業は当該IPR&Dを当初どう会計処理すべきか。",
      c: [
        "Expense it immediately as research and development cost",
        "Capitalize it as an indefinite-lived intangible asset, not amortized until completion or abandonment",
        "Include it in goodwill",
        "Capitalize it and amortize it over five years",
      ],
      a: 1,
      ex: "企業結合で取得したIPR&Dは公正価値で資産計上し、完了または放棄されるまで耐用年数を確定できない無形資産として扱い、償却せずに減損テストを行う。完了後は耐用年数で償却する。即時費用処理は資産取得の場合(代替的将来用途なし)の取扱いである。",
    },
    {
      q: "Gum Co. paid $1,000,000 for a group of assets that does not meet the definition of a business. Relative fair values are: patents $450,000, equipment $150,000, and an IPR&D project with no alternative future use $400,000. What amount should Gum recognize as R&D expense at the acquisition date?",
      ja: "Gum社は事業の定義を満たさない資産グループを$1,000,000で取得した。相対的公正価値は特許$450,000、設備$150,000、代替的将来用途のないIPR&Dプロジェクト$400,000である。取得日に研究開発費として認識すべき金額はいくらか。",
      c: ["$0", "$1,000,000", "$600,000", "$400,000"],
      a: 3,
      ex: "資産取得では取得原価を相対的公正価値で配分し、代替的将来用途のないIPR&Dに配分された$400,000は直ちに研究開発費とする。企業結合と異なりIPR&Dを無形資産として計上せず($0は誤り)、のれんも生じない。",
    },
    {
      q: "At the acquisition date, an acquiree is a defendant in a lawsuit. A loss is not considered probable, but the acquirer can reliably determine that the acquisition-date fair value of the contingent liability is $70,000. At what amount should the acquirer recognize the contingency in the acquisition accounting?",
      ja: "取得日において、被取得企業は訴訟の被告である。損失の発生は可能性が高い(probable)とはいえないが、取得企業は偶発負債の取得日公正価値を$70,000と信頼性をもって算定できる。取得企業は当該偶発事象を取得の会計処理でいくらで認識すべきか。",
      c: [
        "$0, with note disclosure only, because the loss is not probable",
        "$70,000",
        "$0, because contingencies are always included in goodwill",
        "$35,000, the midpoint of the range",
      ],
      a: 1,
      ex: "企業結合で引き受けた偶発事象は、取得日の公正価値が算定可能であれば公正価値($70,000)で認識する。ASC 450の発生可能性(probable)要件は公正価値が算定できない場合に適用されるもので、本問では適用しない。",
    },
    {
      q: "The seller in a business combination contractually agreed to indemnify the acquirer for any loss on a specific lawsuit in excess of $20,000. The acquirer recognized a liability for the lawsuit at its acquisition-date fair value of $90,000, and collectibility of the indemnification is not in doubt. What amount should the acquirer recognize as an indemnification asset?",
      ja: "企業結合の売主は、特定の訴訟について$20,000を超える損失を取得企業に補償することに契約上合意した。取得企業は当該訴訟について取得日公正価値$90,000の負債を認識し、補償の回収可能性に問題はない。取得企業が認識すべき補償資産はいくらか。",
      c: ["$90,000", "$70,000", "$0", "$20,000"],
      a: 1,
      ex: "補償資産は補償対象の負債と同じ基礎で測定し、回収可能性を考慮する。補償されるのは$20,000を超える部分なので 90,000 − 20,000 = 70,000。負債全額($90,000)を補償資産とするのは誤りである。",
    },
    {
      q: "Hazel Co. paid $1,200,000 cash for 75% of Ivy Co. The fair value of the noncontrolling interest was $380,000. Ivy's identifiable assets had a fair value of $2,100,000 and its liabilities a fair value of $800,000. What amount of goodwill should be reported in the consolidated balance sheet at the acquisition date?",
      ja: "Hazel社はIvy社の75%を現金$1,200,000で取得した。非支配持分の公正価値は$380,000であった。Ivy社の識別可能資産の公正価値は$2,100,000、負債の公正価値は$800,000である。取得日の連結貸借対照表に計上されるのれんはいくらか。",
      c: ["$225,000", "$280,000", "$300,000", "$380,000"],
      a: 1,
      ex: "のれん = (1,200,000 + 380,000) − (2,100,000 − 800,000) = 1,580,000 − 1,300,000 = 280,000。$225,000は親会社持分相当(1,200,000 − 75% × 1,300,000)のみの計算で、非支配持分を公正価値で測定する全部のれんを反映していない。",
    },
    {
      q: "Juniper Co. paid $700,000 for 80% of Kale Co. The fair value of the noncontrolling interest was $170,000, and the fair value of Kale's identifiable net assets was $950,000. After reassessing that all assets and liabilities were correctly identified and measured, how should Juniper report the excess?",
      ja: "Juniper社はKale社の80%を$700,000で取得した。非支配持分の公正価値は$170,000、Kale社の識別可能純資産の公正価値は$950,000である。すべての資産・負債が正しく識別・測定されていることを再検討した後、Juniper社は超過額をどう報告すべきか。",
      c: [
        "A $60,000 gain in earnings",
        "An $80,000 reduction of noncurrent assets acquired",
        "An $80,000 gain in earnings attributable to the acquirer",
        "An $80,000 deferred credit amortized over 5 years",
      ],
      a: 2,
      ex: "割安購入益 = 950,000 − (700,000 + 170,000) = 80,000 を取得日に損益として認識し、全額取得企業に帰属させる。$60,000は親会社持分(80% × 950,000 − 700,000)のみの計算で誤り。非流動資産の減額や繰延処理は旧基準の考え方である。",
    },
    {
      q: "A calendar-year company acquired a business on July 1, Year 1, and provisionally recorded a building at $600,000 with a 20-year remaining life (straight-line). In March Year 2, after the Year 1 financial statements were issued, an appraisal of acquisition-date conditions showed the building's fair value was $660,000. In Year 2, what amount of additional depreciation relating to Year 1 is recognized in Year 2 earnings?",
      ja: "暦年決算の会社がYear 1の7月1日に事業を取得し、建物を暫定的に$600,000(残存耐用年数20年、定額法)で計上した。Year 1の財務諸表発行後のYear 2の3月、取得日時点の状況に基づく鑑定により建物の公正価値は$660,000であったことが判明した。Year 2の損益に計上されるYear 1分の追加減価償却費はいくらか。",
      c: [
        "$0, because Year 1 statements must be retrospectively revised",
        "$3,000",
        "$1,500",
        "$0, because only goodwill is adjusted",
      ],
      a: 2,
      ex: "測定期間の修正は判明した期に認識し、取得日に完了していた場合の損益影響(前期分を含む)も当期に計上する(ASU 2015-16)。Year 1分 = 60,000 ÷ 20 × 6/12 = 1,500。過年度の遡及修正は不要である。",
    },
    {
      q: "Fourteen months after an acquisition, the acquirer obtains new information indicating that an acquired customer relationship was worth more at the acquisition date than its provisional amount. The original measurement was not an error. How should the acquirer account for this information?",
      ja: "取得から14か月後、取得企業は取得した顧客関係が取得日時点で暫定額より価値が高かったことを示す新情報を入手した。当初の測定は誤謬ではなかった。取得企業はこの情報をどう会計処理すべきか。",
      c: [
        "Do not adjust the acquisition accounting, because the measurement period has ended",
        "Increase the intangible asset and decrease goodwill",
        "Restate the acquisition-date balance sheet as a correction of an error",
        "Increase the intangible asset and recognize a gain in earnings",
      ],
      a: 0,
      ex: "測定期間は取得日から最長1年であり、それ以降は誤謬の訂正を除き取得の会計処理を修正しない。本件は誤謬ではないため修正しない。のれんとの振替は測定期間内に限られる。",
    },
    {
      q: "Laurel Co. held a 30% equity-method investment in Maple Co. with a carrying amount of $270,000 and a fair value of $360,000. Laurel then paid $600,000 cash for an additional 50% of Maple, obtaining control. The fair value of the remaining 20% noncontrolling interest was $220,000, and Maple's identifiable net assets had a fair value of $1,000,000. What gain and goodwill should Laurel recognize at the acquisition date?",
      ja: "Laurel社はMaple社に対する30%の持分法投資(帳簿価額$270,000、公正価値$360,000)を保有していた。その後、現金$600,000で追加の50%を取得し支配を獲得した。残る20%の非支配持分の公正価値は$220,000、Maple社の識別可能純資産の公正価値は$1,000,000である。取得日にLaurel社が認識する利益とのれんはいくらか。",
      c: [
        "Gain of $90,000; goodwill of $180,000",
        "No gain; goodwill of $90,000",
        "Gain of $90,000 in OCI; goodwill of $180,000",
        "No gain; goodwill of $180,000",
      ],
      a: 0,
      ex: "段階取得では既存持分を取得日の公正価値で再測定し差額を損益に計上する:360,000 − 270,000 = 90,000。のれん = 600,000 + 360,000 + 220,000 − 1,000,000 = 180,000。帳簿価額$270,000を使うとのれん$90,000となり誤り。再測定差額はOCIではなく純利益である。",
    },
    {
      q: "An investor's equity-method investment carried $8,000 of cumulative foreign currency translation gains in AOCI, representing its share of the investee's OCI. The investor then acquired additional shares and obtained control of the investee. How should the $8,000 be treated at the acquisition date?",
      ja: "投資企業の持分法投資について、被投資企業のOCIに対する持分として累積為替換算差益$8,000がAOCIに計上されていた。その後、投資企業は追加株式を取得して被投資企業の支配を獲得した。取得日に$8,000をどう扱うべきか。",
      c: [
        "It remains in AOCI until the subsidiary is sold",
        "It is reclassified to goodwill",
        "It is reclassified to additional paid-in capital",
        "It is reclassified into earnings as if the previously held interest had been disposed of",
      ],
      a: 3,
      ex: "段階取得では既存持分を処分したかのように扱うため、既存持分に関連してOCIに計上されていた金額は同じ基礎で純利益に組替える(再測定損益の一部となる)。AOCIに残したり、のれん・資本剰余金に振り替えたりしない。",
    },
    {
      q: "Nutmeg REIT paid $10,000,000 to acquire a single-tenant office property consisting of land, a building, and an in-place lease (combined fair value $9,200,000), plus office furniture with a fair value of $800,000. No employees or processes were transferred. Under ASC 805's screen test, how should Nutmeg account for the transaction?",
      ja: "Nutmeg REITは$10,000,000を支払い、土地・建物・既存リース(合計公正価値$9,200,000)から成る単一テナントのオフィス物件と、公正価値$800,000の事務所備品を取得した。従業員やプロセスは移転していない。ASC 805のスクリーンテストに基づき、Nutmegはこの取引をどう会計処理すべきか。",
      c: [
        "As an asset acquisition, because substantially all of the fair value of the gross assets is concentrated in a single identifiable asset",
        "As a business combination, because the property generates lease revenue",
        "As a business combination, because inputs were acquired",
        "As a business combination unless the furniture exceeds 5% of the total fair value",
      ],
      a: 0,
      ex: "土地・建物・付随する既存リース無形資産は単一の識別可能資産として扱い、総資産の公正価値の92%(9,200,000 ÷ 10,000,000)と実質的にすべてが集中するためスクリーンテストを満たし、事業ではなく資産取得となる。収益を生むこと自体は事業の判定要件ではない。",
    },
    {
      q: "Under ASC 805, if the screen test is not met, an acquired set of activities and assets must, at a minimum, include which of the following to be considered a business?",
      ja: "ASC 805において、スクリーンテストを満たさない場合、取得した活動と資産の集合が事業とみなされるために最低限含まなければならないものはどれか。",
      c: [
        "Outputs such as revenue from customers",
        "All the inputs and processes the seller used to operate it",
        "An organized workforce and a customer base",
        "An input and a substantive process that together significantly contribute to the ability to create outputs",
      ],
      a: 3,
      ex: "事業であるためには、少なくともインプットと実質的なプロセスがあり、両者が一体となってアウトプットを生み出す能力に大きく寄与する必要がある。アウトプットの存在や売主が用いたすべての要素は必須ではない。",
    },
    {
      q: "Olive Co. acquired a group of assets that does not constitute a business, paying $5,000,000 cash and incurring $100,000 of direct transaction costs. The fair value of the assets acquired is $5,300,000. What total amount should Olive capitalize for the assets acquired?",
      ja: "Olive社は事業に該当しない資産グループを取得し、現金$5,000,000を支払い、直接取引費用$100,000を負担した。取得資産の公正価値は$5,300,000である。Olive社が取得資産として資産計上すべき合計額はいくらか。",
      c: ["$5,100,000", "$5,000,000", "$5,300,000", "$5,400,000"],
      a: 0,
      ex: "資産取得は取得原価(支払対価 + 直接取引費用)で計上する:5,000,000 + 100,000 = 5,100,000 を相対的公正価値で配分する。企業結合と異なり取引費用は資産計上し、公正価値との差額で利益やのれんは認識しない。",
    },
    {
      q: "Pecan Co. had previously granted Quince Co. an exclusive franchise right with 4 years remaining on the contract. Pecan acquires Quince in a business combination and recognizes the reacquired franchise right as an intangible asset. Market participants would expect renewals for another 10 years. Over what period should Pecan amortize the reacquired right?",
      ja: "Pecan社は以前にQuince社へ独占的フランチャイズ権を付与しており、契約の残存期間は4年である。Pecan社は企業結合でQuince社を取得し、再取得したフランチャイズ権を無形資産として認識した。市場参加者はさらに10年の更新を見込んでいる。Pecan社は再取得した権利を何年で償却すべきか。",
      c: [
        "14 years, including expected renewals",
        "It is not amortized because it is indefinite-lived",
        "It is not recognized separately but included in goodwill",
        "4 years, the remaining contractual term",
      ],
      a: 3,
      ex: "再取得した権利は公正価値測定の例外として、更新の可能性を考慮せず残存契約期間に基づいて測定し、その残存契約期間(4年)で償却する。のれんに含めず、耐用年数を確定できない資産ともしない。",
    },
    {
      q: "In a business combination, an acquirer is obligated to replace the acquiree's employee stock awards. The fair-value-based measure of the replacement awards equals that of the original awards, $100,000. The original awards required 4 years of service, of which employees had completed 3 years at the acquisition date; the replacement awards require 1 more year. What amount is included in consideration transferred?",
      ja: "企業結合において、取得企業は被取得企業の従業員株式報酬を置き換える義務を負う。置換報酬の公正価値ベースの測定額は当初報酬と同じ$100,000である。当初報酬は4年の勤務を要件とし、取得日時点で従業員は3年を完了しており、置換報酬はさらに1年の勤務を要する。移転された対価に含める金額はいくらか。",
      c: ["$75,000", "$100,000", "$25,000", "$0"],
      a: 0,
      ex: "置換報酬のうち取得前の勤務に帰属する部分が対価となる:100,000 × 3/4 = 75,000。残りの$25,000は取得後の勤務に対する報酬費用として、残りの1年で認識する。",
    },
    {
      q: "At the acquisition date, an acquiree has a contract liability (deferred revenue) of $500,000 for customer prepayments, recognized in accordance with ASC 606. The fair value of the remaining performance obligation (cost to fulfill plus a normal margin) is $300,000. Under current U.S. GAAP, at what amount does the acquirer generally recognize the contract liability?",
      ja: "取得日において、被取得企業は顧客からの前受金についてASC 606に従い$500,000の契約負債(前受収益)を計上している。残存履行義務の公正価値(履行コスト+通常利益)は$300,000である。現行の米国GAAPでは、取得企業は通常いくらで契約負債を認識するか。",
      c: ["$300,000", "$0", "$400,000", "$500,000"],
      a: 3,
      ex: "ASU 2021-08により、取得した契約資産・契約負債は公正価値ではなく、取得企業が当該契約を自ら締結したかのようにASC 606に従って測定する。被取得企業の処理が適切であれば通常その帳簿価額$500,000となる。$300,000は旧来の公正価値測定である。",
    },
    {
      q: "Parent owns 80% of Sub; the noncontrolling interest was measured at fair value at acquisition. For the current year, Sub reported net income of $250,000. Amortization of acquisition-date fair value adjustments on Sub's customer list was $30,000, and Parent's ending inventory included $10,000 of unrealized profit on goods purchased from Sub. What is the net income attributable to the noncontrolling interest?",
      ja: "親会社はSub社の80%を所有し、取得時に非支配持分を公正価値で測定した。当期のSub社の純利益は$250,000である。Sub社の顧客リストに係る取得日公正価値修正の償却額は$30,000、親会社の期末棚卸資産にはSub社から購入した商品の未実現利益$10,000が含まれる。非支配持分に帰属する純利益はいくらか。",
      c: ["$42,000", "$50,000", "$44,000", "$48,000"],
      a: 0,
      ex: "アップストリーム取引の未実現利益と公正価値修正の償却はいずれも子会社の利益を修正する:(250,000 − 30,000 − 10,000) × 20% = 42,000。$44,000はアップストリームの未実現利益を無視した誤り、$50,000は修正をすべて無視した誤りである。",
    },
    {
      q: "At the beginning of the year, the noncontrolling interest in a subsidiary had a carrying amount of $400,000. For the year, the NCI's share of the subsidiary's net income was $60,000 and its share of the subsidiary's foreign currency translation gain was $5,000. The subsidiary paid dividends of which $15,000 went to the noncontrolling shareholders. What is the NCI balance at year-end?",
      ja: "期首において子会社の非支配持分の帳簿価額は$400,000であった。当期の子会社純利益に対する非支配持分の持分は$60,000、子会社の為替換算差益に対する持分は$5,000である。子会社は配当を支払い、そのうち$15,000が非支配株主に支払われた。期末の非支配持分残高はいくらか。",
      c: ["$445,000", "$465,000", "$460,000", "$450,000"],
      a: 3,
      ex: "非支配持分 = 400,000 + 60,000 + 5,000 − 15,000 = 450,000。非支配持分にはOCIの持分も配分され、非支配株主への配当は非支配持分を減少させる。$465,000は配当の控除漏れ、$445,000はOCIの配分漏れである。",
    },
    {
      q: "Parent owns 80% of Sub, and the noncontrolling interest has a carrying amount of $300,000, proportionate to Sub's net assets in the consolidated statements. Parent sells a 10% interest in Sub (of Sub's total shares) to outside investors for $220,000 and retains control. How should Parent report the sale in its consolidated statements?",
      ja: "親会社はSub社の80%を所有し、非支配持分の帳簿価額は$300,000(連結上のSub社純資産に比例)である。親会社はSub社株式(発行済総数に対して)10%を外部投資家に$220,000で売却し、支配は維持する。親会社は連結財務諸表で当該売却をどう報告すべきか。",
      c: [
        "A gain of $70,000 in net income",
        "A gain of $220,000 in net income",
        "An increase in additional paid-in capital of $70,000",
        "An increase in additional paid-in capital of $220,000",
      ],
      a: 2,
      ex: "支配を維持する持分変動は資本取引であり損益を認識しない。Sub社の連結上の純資産 = 300,000 ÷ 20% = 1,500,000、10%相当$150,000を非支配持分へ振り替え、差額 220,000 − 150,000 = 70,000 を資本剰余金の増加とする。",
    },
    {
      q: "Parent owns 70% of Sub. The noncontrolling interest has a carrying amount of $600,000. Parent pays $500,000 to acquire an additional 20% of Sub from the noncontrolling shareholders. How should Parent record the purchase in its consolidated statements?",
      ja: "親会社はSub社の70%を所有している。非支配持分の帳簿価額は$600,000である。親会社は非支配株主からSub社の追加20%を$500,000で取得した。親会社は連結財務諸表で当該取得をどう記録すべきか。",
      c: [
        "Increase goodwill by $100,000",
        "Recognize a loss of $100,000 in net income",
        "Decrease NCI by $400,000 and decrease additional paid-in capital by $100,000",
        "Decrease NCI by $500,000",
      ],
      a: 2,
      ex: "支配獲得後の追加取得は資本取引である。減少する非支配持分 = 600,000 × 20/30 = 400,000、支払額との差額$100,000は資本剰余金を減少させる。のれんの追加計上や損益の認識はしない。",
    },
    {
      q: "Parent owns 80% of Sub. In the consolidated statements, Sub's net assets (including goodwill) have a carrying amount of $1,000,000 and the noncontrolling interest a carrying amount of $200,000. Parent sells 60% of Sub's shares to an unrelated party for $900,000 cash, losing control, and retains a 20% interest with a fair value of $300,000. What gain should Parent recognize?",
      ja: "親会社はSub社の80%を所有している。連結上、Sub社の純資産(のれんを含む)の帳簿価額は$1,000,000、非支配持分の帳簿価額は$200,000である。親会社はSub社株式の60%を第三者に現金$900,000で売却して支配を喪失し、公正価値$300,000の20%持分を保持する。親会社が認識すべき利益はいくらか。",
      c: ["$400,000", "$300,000", "$100,000", "$200,000"],
      a: 0,
      ex: "支配喪失時の利益 = (受取対価900,000 + 保持持分の公正価値300,000 + 非支配持分の帳簿価額200,000) − 子会社純資産の帳簿価額1,000,000 = 400,000。$300,000は売却持分のみ(900,000 − 60% × 1,000,000)で計算し、保持持分の再測定益$100,000を漏らしている。",
    },
    {
      q: "After losing control of a subsidiary, a former parent retains a 25% interest that gives it significant influence. How should the retained interest be initially measured?",
      ja: "子会社の支配を喪失した後、旧親会社は重要な影響力を有する25%の持分を保持している。保持持分は当初どのように測定すべきか。",
      c: [
        "At its proportionate share of the subsidiary's carrying amount of net assets",
        "At the historical cost of the shares originally acquired",
        "At fair value at the date control is lost, which becomes the basis for applying the equity method",
        "At zero, with any gain deferred until the retained interest is sold",
      ],
      a: 2,
      ex: "支配喪失時に保持する持分は支配喪失日の公正価値で測定し(再測定差額は支配喪失損益に含める)、その金額が以後の持分法適用の基礎となる。帳簿価額の按分や取得原価のままとするのは誤りである。",
    },
    {
      q: "Parent owns 80% of Sub, with the noncontrolling interest measured at fair value. Parent's separate income, excluding any income from Sub, is $500,000. Sub reported net income of $200,000. Amortization of acquisition-date fair value adjustments is $10,000. There are no intercompany transactions. What is the consolidated net income attributable to Parent?",
      ja: "親会社はSub社の80%を所有し、非支配持分を公正価値で測定している。Sub社からの収益を除く親会社の個別利益は$500,000、Sub社の純利益は$200,000、取得日公正価値修正の償却額は$10,000である。内部取引はない。親会社に帰属する連結純利益はいくらか。",
      c: ["$690,000", "$660,000", "$652,000", "$700,000"],
      a: 2,
      ex: "連結純利益 = 500,000 + 200,000 − 10,000 = 690,000。非支配持分 = (200,000 − 10,000) × 20% = 38,000。親会社帰属 = 690,000 − 38,000 = 652,000。$690,000は非支配持分を含む連結純利益全体、$660,000は償却を無視した計算である。",
    },
    {
      q: "On the acquisition date, Parent's stockholders' equity was $2,000,000 and Sub's stockholders' equity was $600,000. Parent acquired 80% of Sub for cash, and the fair value of the noncontrolling interest was $250,000. What is total equity in the consolidated balance sheet immediately after the acquisition?",
      ja: "取得日において親会社の株主資本は$2,000,000、Sub社の株主資本は$600,000であった。親会社はSub社の80%を現金で取得し、非支配持分の公正価値は$250,000であった。取得直後の連結貸借対照表の資本合計はいくらか。",
      c: ["$2,850,000", "$2,250,000", "$2,000,000", "$2,600,000"],
      a: 1,
      ex: "子会社の資本は投資勘定との相殺消去で全額消去され、連結資本は親会社の資本$2,000,000に非支配持分$250,000を加えた$2,250,000となる。子会社の資本を加算する$2,850,000や$2,600,000は誤りである。",
    },
    {
      q: "Parent owns 80% of Sub. During the year, Parent sold inventory costing $50,000 to Sub for $75,000. At year-end, 40% of this inventory remains in Sub's warehouse. How is the elimination of unrealized profit attributed in the consolidated income statement?",
      ja: "親会社はSub社の80%を所有している。当期、親会社は原価$50,000の棚卸資産をSub社に$75,000で販売した。期末にこの在庫の40%がSub社の倉庫に残っている。未実現利益の消去は連結損益計算書でどのように帰属させるか。",
      c: [
        "$8,000 to Parent and $2,000 to the noncontrolling interest",
        "$10,000 to Parent and $0 to the noncontrolling interest",
        "$25,000 to Parent and $0 to the noncontrolling interest",
        "No elimination, because the profit was earned by Parent",
      ],
      a: 1,
      ex: "未実現利益 = (75,000 − 50,000) × 40% = 10,000。ダウンストリーム(親→子)取引の利益は親会社が稼得したものなので全額を親会社に帰属させ、非支配持分には配分しない。アップストリームであれば持分比率で按分する。",
    },
    {
      q: "During the year, Sub sold goods to Parent for $300,000; Sub's cost was $240,000. Parent resold two-thirds of these goods to outside customers and still holds the rest. Parent's recorded cost of goods sold is $900,000 (including $200,000 for the intercompany goods it resold), and Sub's recorded cost of goods sold is $600,000 (including the $240,000 for its sales to Parent). What is consolidated cost of goods sold?",
      ja: "当期、Sub社は親会社に商品を$300,000(Sub社の原価$240,000)で販売した。親会社はその3分の2を外部顧客に転売し、残りを保有している。親会社の売上原価は$900,000(転売した内部取引商品分$200,000を含む)、Sub社の売上原価は$600,000(親会社向け販売分$240,000を含む)である。連結売上原価はいくらか。",
      c: ["$1,200,000", "$1,220,000", "$1,180,000", "$1,500,000"],
      a: 1,
      ex: "合算1,500,000から内部売上300,000を消去し、期末在庫の未実現利益 (300,000 − 240,000) × 1/3 = 20,000 を加算する:1,500,000 − 300,000 + 20,000 = 1,220,000。検算:親会社の外部原価700,000 + 転売分のグループ原価160,000 + Sub社の外部原価360,000 = 1,220,000。",
    },
    {
      q: "Parent owns 90% of Sub. Parent's beginning inventory included $15,000 of unrealized profit on goods purchased from Sub in the prior year; all of those goods were sold to outsiders during the current year. Sub reported current-year net income of $100,000, and there were no other intercompany transactions or fair value adjustments. What is the net income attributable to the noncontrolling interest?",
      ja: "親会社はSub社の90%を所有している。親会社の期首棚卸資産には前期にSub社から購入した商品の未実現利益$15,000が含まれており、当期中にすべて外部に販売された。Sub社の当期純利益は$100,000で、その他の内部取引や公正価値修正はない。非支配持分に帰属する純利益はいくらか。",
      c: ["$10,000", "$11,500", "$8,500", "$13,000"],
      a: 1,
      ex: "前期のアップストリーム未実現利益は当期に外部販売されたことで実現し、Sub社の利益に加算する:(100,000 + 15,000) × 10% = 11,500。$8,500は実現を減算と取り違えた誤りである。",
    },
    {
      q: "On January 1, Year 1, Parent sold equipment with a carrying amount of $60,000 to its wholly owned subsidiary for $90,000. The equipment had a remaining useful life of 5 years (straight-line, no salvage). In the consolidation worksheet at December 31, Year 2, what is the debit to Parent's beginning retained earnings needed to eliminate the remaining unrealized gain?",
      ja: "Year 1の1月1日、親会社は帳簿価額$60,000の設備を完全子会社に$90,000で売却した。設備の残存耐用年数は5年(定額法、残存価額なし)である。Year 2の12月31日の連結精算表において、残存する未実現利益を消去するために親会社の期首利益剰余金に借記すべき金額はいくらか。",
      c: ["$30,000", "$18,000", "$24,000", "$6,000"],
      a: 2,
      ex: "売却益30,000は毎年 30,000 ÷ 5 = 6,000 ずつ減価償却を通じて実現する。Year 2期首時点の未実現利益 = 30,000 − 6,000 = 24,000 を期首利益剰余金から消去する。$18,000はYear 2末の残高、$30,000はYear 1の実現分を無視している。",
    },
    {
      q: "Parent owns 70% of Sub. During the year, Sub sold land to Parent for $140,000; Sub's carrying amount was $100,000. Parent still holds the land at year-end. By what amount does the elimination of the intercompany gain reduce the net income attributable to the noncontrolling interest?",
      ja: "親会社はSub社の70%を所有している。当期、Sub社は帳簿価額$100,000の土地を親会社に$140,000で売却した。期末に親会社は当該土地を保有している。内部取引の売却益の消去により、非支配持分に帰属する純利益はいくら減少するか。",
      c: ["$0", "$40,000", "$28,000", "$12,000"],
      a: 3,
      ex: "アップストリーム(子→親)の未実現利益40,000は子会社の利益を修正するため、非支配持分に30%を配分する:40,000 × 30% = 12,000。土地は減価償却されないため、外部に売却されるまで未実現のままである。",
    },
    {
      q: "Parent has bonds payable outstanding with a face amount of $1,000,000 and a carrying amount of $1,020,000. Its wholly owned subsidiary purchases all of the bonds in the open market for $970,000. In the consolidated financial statements, what amount is recognized at the purchase date?",
      ja: "親会社には額面$1,000,000、帳簿価額$1,020,000の社債が発行されている。完全子会社が市場でこの社債全額を$970,000で購入した。連結財務諸表では購入日にいくらを認識するか。",
      c: [
        "A loss of $50,000",
        "A gain of $30,000",
        "A gain of $50,000",
        "No gain or loss until the bonds mature",
      ],
      a: 2,
      ex: "連結上は社債を償還したものとみなし(擬制償還)、帳簿価額1,020,000と取得価額970,000の差額50,000を償還益として認識する。$30,000は額面との差額で誤りである。以後の内部利息は消去する。",
    },
    {
      q: "On the date Parent acquired 100% of Sub, Parent's retained earnings were $800,000 and Sub's retained earnings were $300,000. What amount of retained earnings should be reported in the consolidated balance sheet on the acquisition date?",
      ja: "親会社がSub社の100%を取得した日において、親会社の利益剰余金は$800,000、Sub社の利益剰余金は$300,000であった。取得日の連結貸借対照表に計上される利益剰余金はいくらか。",
      c: ["$800,000", "$1,100,000", "$1,040,000", "$500,000"],
      a: 0,
      ex: "取得日の子会社の利益剰余金は取得前の利益であり、投資と資本の相殺消去で全額消去される。連結利益剰余金は親会社の$800,000のみである。",
    },
    {
      q: "Parent acquired 100% of Sub on April 1. Sub's net income for the calendar year was $240,000, earned evenly throughout the year. How much of Sub's net income is included in consolidated net income for the year?",
      ja: "親会社は4月1日にSub社の100%を取得した。Sub社の暦年の純利益は$240,000で、年間を通じて均等に稼得された。当期の連結純利益に含まれるSub社の純利益はいくらか。",
      c: ["$240,000", "$60,000", "$180,000", "$120,000"],
      a: 2,
      ex: "連結財務諸表には取得日以降の子会社の収益・費用のみを含める:240,000 × 9/12 = 180,000。取得前の$60,000は取得時の純資産に含まれ、連結純利益には含めない。",
    },
    {
      q: "A legal entity is a VIE. Company X manages the entity under a contract that cannot be removed by any other party, directing the activities that most significantly affect the entity's performance, and X holds a subordinated loan that could absorb significant losses. Company Y holds 90% of the equity at risk but has no substantive decision-making rights. Company Z is a senior lender. Which party is the primary beneficiary?",
      ja: "ある法的主体はVIEである。X社は他の当事者が解任できない契約に基づき当該主体を運営し、業績に最も重要な影響を与える活動を指図しており、重大な損失を負担し得る劣後ローンも保有している。Y社はリスクのある持分の90%を保有するが実質的な意思決定権はない。Z社はシニアの貸手である。主たる受益者はどれか。",
      c: [
        "Y, because it holds most of the equity at risk",
        "Z, because it provides most of the financing",
        "X, because it has power over the most significant activities and an obligation to absorb potentially significant losses",
        "No party, because no one holds a majority voting interest",
      ],
      a: 2,
      ex: "主たる受益者は(1)VIEの経済的業績に最も重要な影響を与える活動を指図するパワーと、(2)潜在的に重要となり得る損失負担義務または便益受取権の両方を有する者である。X社が両方を満たす。持分の多寡や融資額は決定要因ではない。",
    },
    {
      q: "Two unrelated companies each hold 50% of the variable interests in a VIE. All decisions about the activities that most significantly affect the VIE's economic performance require the consent of both companies. Which statement is correct?",
      ja: "関連当事者ではない2社がそれぞれVIEの変動持分の50%を保有している。VIEの経済的業績に最も重要な影響を与える活動に関する決定はすべて両社の同意を要する。正しい記述はどれか。",
      c: [
        "Each company consolidates 50% of the VIE's assets and liabilities",
        "Neither company is the primary beneficiary, so neither consolidates the VIE",
        "The company with greater exposure to expected losses consolidates the VIE",
        "The company that formed the VIE must consolidate it",
      ],
      a: 1,
      ex: "パワーが関連当事者でない複数の当事者で共有され、重要な決定に全員の同意を要する場合、いずれもパワーを単独で有さず主たる受益者は存在しない。各社は持分法など他の基準で会計処理する。比例連結は認められない。",
    },
    {
      q: "A primary beneficiary initially consolidates a VIE that is not a business, and the two entities are not under common control. The consideration paid plus the fair value of the noncontrolling interest exceeds the fair value of the VIE's identifiable net assets. How is the excess reported?",
      ja: "主たる受益者が事業に該当しないVIEを当初連結する。両者は共通支配下にない。支払対価と非支配持分の公正価値の合計がVIEの識別可能純資産の公正価値を上回る。超過額はどう報告するか。",
      c: [
        "As goodwill",
        "As a loss in earnings; no goodwill is recognized",
        "As an increase to the VIE's long-lived assets",
        "As a deferred charge amortized over 10 years",
      ],
      a: 1,
      ex: "事業に該当しないVIEを当初連結する場合、のれんは認識せず、超過額は損失として認識する(不足額は利益)。のれんが生じるのはVIEが事業である場合のみである。",
    },
    {
      q: "Under the private company accounting alternative for variable interest entities (ASU 2018-17), which statement is correct?",
      ja: "VIEに関する非公開会社の会計代替処理(ASU 2018-17)について、正しい記述はどれか。",
      c: [
        "A private company may elect not to apply VIE guidance to a legal entity when the reporting entity and the legal entity are under common control and other criteria are met, but must disclose its involvement with that entity",
        "A private company may elect not to apply VIE guidance to any legal entity, regardless of control relationships",
        "A public business entity may also elect the alternative if the legal entity is privately held",
        "Electing the alternative requires the private company to consolidate all entities under common control",
      ],
      a: 0,
      ex: "ASU 2018-17により、非公開会社は報告主体と法的主体が共通支配下にある等の要件を満たす場合、当該法的主体にVIE指針を適用しないことを選択できる(会計方針として該当するすべての主体に適用)。ただし関与の内容等の開示が求められる。公開企業は選択できない。",
    },
    {
      q: "Regarding reassessments under the VIE model, which statement is correct?",
      ja: "VIEモデルにおける再評価について、正しい記述はどれか。",
      c: [
        "Both VIE status and primary beneficiary status are reassessed only when specified reconsideration events occur",
        "Both VIE status and primary beneficiary status are determined only at inception",
        "Primary beneficiary status is determined only at inception, while VIE status is reassessed every reporting period",
        "Whether an entity is a VIE is reconsidered only upon specified events, but primary beneficiary status is reassessed on an ongoing basis",
      ],
      a: 3,
      ex: "主体がVIEか否かは定款変更や持分の変動など特定の再検討事象が生じた場合にのみ再検討するが、主たる受益者か否かは継続的に(各報告期間に)再評価する。",
    },
    {
      q: "A public company's reporting unit has a carrying amount of $3,000,000, including goodwill of $200,000. The fair value of the reporting unit is $2,600,000. Ignoring income taxes, what goodwill impairment loss should be recognized?",
      ja: "公開会社の報告単位の帳簿価額は$3,000,000(のれん$200,000を含む)である。報告単位の公正価値は$2,600,000である。税効果を無視した場合、認識すべきのれんの減損損失はいくらか。",
      c: ["$400,000", "$200,000", "$0", "$600,000"],
      a: 1,
      ex: "減損損失は報告単位の帳簿価額が公正価値を超える額(3,000,000 − 2,600,000 = 400,000)だが、報告単位に配分されたのれんの額($200,000)が上限となる。残りの超過額を他の資産に配分することはない。",
    },
    {
      q: "A reporting unit has a carrying amount of $2,000,000, which includes goodwill of $400,000 and an indefinite-lived trademark with a carrying amount of $300,000 and a fair value of $250,000. The fair value of the reporting unit is $1,850,000. Both are tested at the same time. What goodwill impairment loss should be recognized?",
      ja: "報告単位の帳簿価額は$2,000,000で、のれん$400,000と耐用年数を確定できない商標(帳簿価額$300,000、公正価値$250,000)を含む。報告単位の公正価値は$1,850,000である。両者を同時に減損テストする。認識すべきのれんの減損損失はいくらか。",
      c: ["$100,000", "$150,000", "$200,000", "$50,000"],
      a: 0,
      ex: "のれん以外の資産の減損を先に認識する。商標の減損50,000により報告単位の帳簿価額は1,950,000となり、のれんの減損 = 1,950,000 − 1,850,000 = 100,000。商標を先に処理しない$150,000は誤りである(減損合計は$150,000)。",
    },
    {
      q: "Which statement about the optional qualitative assessment for goodwill impairment testing is correct?",
      ja: "のれんの減損テストにおける任意の定性的評価について、正しい記述はどれか。",
      c: [
        "Once an entity bypasses the qualitative assessment, it may not use it again for that reporting unit",
        "The qualitative assessment must be performed before any quantitative test",
        "Even if the qualitative assessment concludes impairment is not more likely than not, the quantitative test must be performed annually",
        "An entity may bypass the qualitative assessment for any reporting unit in any period and proceed directly to the quantitative test",
      ],
      a: 3,
      ex: "定性的評価は任意であり、どの報告単位・どの期間でも省略して定量的テストに進むことができ、翌期以降に再び定性的評価を行うこともできる。定性的評価で公正価値が帳簿価額を下回る可能性が50%超でないと判断すれば定量的テストは不要である。",
    },
    {
      q: "A reporting unit with a fair value of $4,000,000 and goodwill of $600,000 sells a business within the unit with a fair value of $1,000,000. The business was not acquired recently and the goodwill has not been specifically associated with it. What amount of goodwill should be included in the carrying amount of the business sold when determining the gain or loss?",
      ja: "公正価値$4,000,000、のれん$600,000の報告単位が、その中の公正価値$1,000,000の事業を売却する。当該事業は最近取得したものではなく、のれんは特定的に結び付いていない。売却損益の算定上、売却事業の帳簿価額に含めるべきのれんはいくらか。",
      c: ["$150,000", "$0", "$600,000", "$250,000"],
      a: 0,
      ex: "報告単位の一部である事業を処分する場合、のれんは売却事業と存続部分の相対的公正価値に基づいて配分する:600,000 × 1,000,000 / 4,000,000 = 150,000。のれんを含めない$0や全額$600,000は誤りである。",
    },
    {
      q: "A private company elected the accounting alternative to amortize goodwill and chose a 10-year straight-line life. It recognized goodwill of $600,000 in an acquisition on January 1, Year 1, and no impairment has occurred. What is the carrying amount of goodwill at December 31, Year 3?",
      ja: "非公開会社はのれん償却の会計代替処理を選択し、10年の定額法を採用した。Year 1の1月1日の取得でのれん$600,000を認識し、減損は生じていない。Year 3の12月31日ののれんの帳簿価額はいくらか。",
      c: ["$600,000", "$480,000", "$360,000", "$420,000"],
      a: 3,
      ex: "年間償却額 = 600,000 ÷ 10 = 60,000。3年間の償却累計180,000を控除し、帳簿価額は420,000となる。代替処理を選択した非公開会社は10年以内(より適切なら短い期間)で定額償却する。",
    },
    {
      q: "A private company that elected the goodwill accounting alternative tests goodwill at the entity level. After a triggering event, the entity's carrying amount is $5,000,000 (including goodwill, net of amortization, of $450,000), and its fair value is $4,800,000. Which describes the goodwill afterward?",
      ja: "のれんの会計代替処理を選択した非公開会社は、企業全体のレベルでのれんの減損テストを行う。トリガー事象の発生後、企業の帳簿価額は$5,000,000(償却後ののれん$450,000を含む)、公正価値は$4,800,000である。その後ののれんの状態として正しいものはどれか。",
      c: [
        "$250,000, amortized over the remaining amortization period",
        "$450,000, because private companies electing the alternative never recognize impairment",
        "$250,000, no longer amortized",
        "$0, because all goodwill is written off when impairment is indicated",
      ],
      a: 0,
      ex: "減損損失 = 5,000,000 − 4,800,000 = 200,000(のれん残高が上限)。減損後ののれん = 450,000 − 200,000 = 250,000 であり、残りの償却期間にわたり引き続き償却する。",
    },
    {
      q: "ASU 2021-03 provides private companies and not-for-profit entities with an accounting alternative related to goodwill. What does this alternative permit?",
      ja: "ASU 2021-03は非公開会社と非営利組織にのれんに関する会計代替処理を提供している。この代替処理は何を認めているか。",
      c: [
        "Writing off all goodwill to equity at the acquisition date",
        "Skipping goodwill impairment testing entirely if goodwill is amortized",
        "Testing goodwill for impairment only once every three years",
        "Evaluating goodwill impairment triggering events only as of the end of each reporting period, rather than continuously during the period",
      ],
      a: 3,
      ex: "ASU 2021-03により、対象企業はのれん減損のトリガー事象の有無を期中に継続的に監視するのではなく、各報告期間末(中間・年度)時点でのみ評価することを選択できる。減損テスト自体を省略できるわけではない。",
    },
    {
      q: "A public company has three reporting units. Which statement about the timing of the annual goodwill impairment test is correct?",
      ja: "公開会社には3つの報告単位がある。年次ののれん減損テストの実施時期について、正しい記述はどれか。",
      c: [
        "All reporting units must be tested on the last day of the fiscal year",
        "The test date may be changed freely each year without justification",
        "Each reporting unit may be tested at any time during the fiscal year, provided it is tested at the same time every year, and different units may use different dates",
        "Goodwill is tested only when a triggering event occurs",
      ],
      a: 2,
      ex: "年次テストは会計年度中のいつでもよいが、毎年同じ時期に行う必要があり、報告単位ごとに異なる時期とすることもできる。加えて、期中にトリガー事象があれば中間テストを行う。トリガー時のみのテストは非公開会社の代替処理である。",
    },
    {
      q: "An investor applied the equity method to its 35% interest, and the investment's carrying amount included equity-method goodwill (the excess of cost over its share of the investee's net assets). The investor then acquired an additional 40% and obtained control. How is the equity-method goodwill treated in the consolidated statements?",
      ja: "投資企業は35%持分に持分法を適用しており、投資の帳簿価額には持分法上ののれん(取得原価が被投資企業純資産の持分額を超える部分)が含まれていた。その後、追加で40%を取得し支配を獲得した。持分法上ののれんは連結財務諸表でどう扱われるか。",
      c: [
        "It is carried over and added to the goodwill computed on the 40% purchase",
        "It is amortized over 10 years",
        "It is not carried over; total goodwill is measured at the acquisition date using the fair value of the previously held interest, consideration transferred, and NCI",
        "It is written off to retained earnings",
      ],
      a: 2,
      ex: "支配獲得時には既存持分を公正価値で再測定し(差額は損益)、のれんは取得日に「移転対価 + 非支配持分の公正価値 + 既存持分の公正価値 − 識別可能純資産」で改めて算定する。持分法上ののれんを引き継いで加算するのではない。",
    },
    {
      q: "An acquiree undergoes a change-in-control event. Which statement about push-down accounting is correct?",
      ja: "被取得企業に支配の変更事象が生じた。プッシュダウン会計について正しい記述はどれか。",
      c: [
        "Push-down accounting is required for all SEC registrants that are acquired",
        "The acquiree may elect push-down accounting in the period of the change in control or in a later period as a change in accounting principle, and the election is irrevocable once applied",
        "Push-down accounting may be applied only if the acquirer obtains 100% ownership",
        "The acquiree may apply push-down accounting and later reverse it if the acquirer sells its shares",
      ],
      a: 1,
      ex: "ASC 805-50により、被取得企業は支配の変更事象ごとにプッシュダウン会計を任意に選択でき、当期に選択しなかった場合も後の期に会計原則の変更として適用できる。いったん適用すると取り消せない。100%取得は要件ではない。",
    },
    {
      q: "An acquiree elects push-down accounting. The acquirer's acquisition accounting resulted in a bargain purchase gain. How should the acquiree report the bargain purchase in its separate financial statements?",
      ja: "被取得企業がプッシュダウン会計を選択した。取得企業の取得の会計処理では割安購入益が生じた。被取得企業は個別財務諸表で割安購入をどう報告すべきか。",
      c: [
        "As a gain in its income statement",
        "As a deferred credit amortized over 5 years",
        "As a reduction of goodwill",
        "As an adjustment to additional paid-in capital, not in its income statement",
      ],
      a: 3,
      ex: "プッシュダウン会計では取得企業の新たな基礎を被取得企業の個別財務諸表に反映し、のれんも計上するが、割安購入益は被取得企業の損益には計上せず資本剰余金の調整として認識する。",
    },
    {
      q: "Under push-down accounting, when should the acquiree recognize in its separate financial statements the debt that the acquirer incurred to finance the acquisition?",
      ja: "プッシュダウン会計において、被取得企業は取得企業が買収資金として調達した借入金を、いつ個別財務諸表に認識すべきか。",
      c: [
        "Only if the acquiree is required to recognize the liability under other applicable GAAP (e.g., it is a joint and several obligor)",
        "Always, because all acquisition-related balances are pushed down",
        "Never, because only goodwill is pushed down",
        "Only if the debt exceeds 50% of the consideration transferred",
      ],
      a: 0,
      ex: "取得企業の買収関連借入金は、被取得企業自身が他の基準に従って負債を認識すべき場合(連帯債務者である等)に限り被取得企業の財務諸表に認識する。すべての残高を機械的にプッシュダウンするわけではない。",
    },
    {
      q: "Parent transfers its 100% interest in Sub B to its other wholly owned subsidiary, Sub A, for $900,000 cash. The carrying amount of Sub B's net assets in Parent's consolidated statements is $700,000, and their fair value is $950,000. How should Sub A record the transfer?",
      ja: "親会社は保有するSub B社株式100%を、別の完全子会社Sub A社に現金$900,000で移転する。親会社の連結財務諸表におけるSub B社の純資産の帳簿価額は$700,000、公正価値は$950,000である。Sub A社は当該移転をどう記録すべきか。",
      c: [
        "Net assets of $900,000, including goodwill of $200,000",
        "Net assets of $700,000, with the $200,000 excess paid charged to equity",
        "Net assets of $700,000 and a loss of $200,000",
        "Net assets at fair value of $950,000 and a bargain purchase gain of $50,000",
      ],
      a: 1,
      ex: "共通支配下の取引は企業結合(ASC 805の取得法)の対象外であり、受入企業は移転元(親会社)の帳簿価額$700,000で純資産を計上する。支払額との差額$200,000は資本の減少として処理し、のれんや損益は認識しない。",
    },
    {
      q: "In a transfer of a business between entities under common control, how should the receiving entity present its financial statements for prior periods?",
      ja: "共通支配下の企業間で事業が移転された場合、受入企業は過年度の財務諸表をどう表示すべきか。",
      c: [
        "Retrospectively adjusted to reflect the combined entities for all periods during which they were under common control",
        "Only from the date of transfer, with no adjustment to prior periods",
        "Using fair values as of the date common control was first established",
        "As a pooling of interests from the date the transfer agreement is signed, using fair values",
      ],
      a: 0,
      ex: "共通支配下の移転では、受入企業は移転日を期首とみなすのではなく、両者が共通支配下にあった全期間について結合後の主体として過年度を遡及的に修正表示する。公正価値は用いない。",
    },
    {
      q: "An individual owns 100% of Company R and 100% of Company S, which frequently transact with each other. No parent-subsidiary relationship exists between R and S. A lender requests a single set of financial statements for both companies. Which statement is correct?",
      ja: "個人がR社とS社をそれぞれ100%所有しており、両社は頻繁に取引している。R社とS社の間に親子関係はない。貸手が両社をまとめた1組の財務諸表を求めている。正しい記述はどれか。",
      c: [
        "Consolidated statements must be prepared with R as the parent because it is larger",
        "The companies may not be presented together because neither controls the other",
        "Combined statements may be prepared, but intercompany transactions are not eliminated",
        "Combined statements may be prepared; intercompany transactions and profits are eliminated and the equity of the companies is combined",
      ],
      a: 3,
      ex: "共通支配下の兄弟会社には結合財務諸表を作成できる。手続は連結に準じ、内部取引・内部利益を消去するが、投資と資本の相殺はなく各社の資本を合算して表示する。親会社が存在しないため一方を親会社とする連結は行わない。",
    },
    {
      q: "Parent acquired 100% of Sub for $800,000 cash. At the acquisition date, Sub held cash of $50,000. During the year, Sub (now consolidated) paid dividends of $20,000, all to Parent. In the consolidated statement of cash flows for the year, what is the net cash outflow for the acquisition reported in investing activities?",
      ja: "親会社はSub社の100%を現金$800,000で取得した。取得日にSub社は現金$50,000を保有していた。当期中にSub社(連結子会社)は配当$20,000をすべて親会社に支払った。当期の連結キャッシュ・フロー計算書で、投資活動に計上される取得に係る純現金支出額はいくらか。",
      c: ["$800,000", "$780,000", "$750,000", "$730,000"],
      a: 2,
      ex: "子会社の取得は取得した現金を控除した純額で投資活動に表示する:800,000 − 50,000 = 750,000。親会社への配当は連結内部の取引で消去されるため影響しない($730,000は誤り)。非支配株主への配当であれば財務活動に表示する。",
    },
  ],
});

CPA.tbs({ id: "TBS-BAR-18", section: "BAR", chapter: "BAR-02", title: "取得法の適用:条件付対価・IPR&D・測定期間の修正",
  scenario: `<p>On January 1, Year 1, Alpha Corp. acquired 80% of Beta Inc. Alpha paid <b>$2,400,000</b> cash and agreed to pay additional cash if Beta meets revenue targets over the next two years; this liability-classified contingent consideration had an acquisition-date fair value of <b>$200,000</b>. The fair value of the noncontrolling interest was <b>$640,000</b>. Alpha paid <b>$60,000</b> of legal and valuation fees related to the acquisition.</p>
<p>Provisional acquisition-date fair values of Beta's identifiable items:</p>
<table><tr><th>Item</th><th>Fair value</th></tr>
<tr><td>Identifiable assets (including a customer list of $300,000 and an IPR&amp;D project of $250,000)</td><td>$3,500,000</td></tr>
<tr><td>Liabilities (including a lawsuit contingency of $50,000)</td><td>$900,000</td></tr></table>
<p>On April 30, Year 1, Alpha received a final appraisal based on facts existing at January 1 showing that the customer list's acquisition-date fair value was <b>$340,000</b>. At December 31, Year 1, because Beta's revenue exceeded expectations after the acquisition, the fair value of the contingent consideration increased to <b>$260,000</b>.</p>
<p class="ja">Year 1の1月1日、Alpha社はBeta社の80%を取得した。Alpha社は現金$2,400,000を支払い、今後2年間にBeta社が売上目標を達成した場合に追加の現金を支払うことに合意した。この負債に分類される条件付対価の取得日公正価値は$200,000である。非支配持分の公正価値は$640,000、Alpha社は取得に関する法務・評価費用$60,000を支払った。Beta社の識別可能資産の暫定公正価値は$3,500,000(顧客リスト$300,000とIPR&amp;Dプロジェクト$250,000を含む)、負債は$900,000(訴訟偶発負債$50,000を含む)。4月30日、1月1日時点の事実に基づく最終鑑定により顧客リストの取得日公正価値は$340,000と判明した。12月31日、取得後にBeta社の売上が予想を上回ったため、条件付対価の公正価値は$260,000に増加した。</p>`,
  rows: [
    { label: "Goodwill recognized provisionally at January 1, Year 1(1月1日に暫定的に認識したのれん)", type: "num", answer: 640000 },
    { label: "Goodwill after the April 30 measurement-period adjustment(4月30日の測定期間修正後ののれん)", type: "num", answer: 600000 },
    { label: "Acquisition-related costs expensed in Year 1(Year 1に費用処理する取得関連費用)", type: "num", answer: 60000 },
    { label: "Loss recognized in Year 1 earnings on remeasuring the contingent consideration(条件付対価の再測定によりYear 1の損益に計上する損失)", type: "num", answer: 60000 },
    { label: "Contingent consideration liability at December 31, Year 1(Year 1末の条件付対価負債)", type: "num", answer: 260000 },
    { label: "Accounting for the acquired IPR&D project after the acquisition date(取得後のIPR&Dの会計処理)", type: "select", options: ["Expensed immediately as R&D", "Indefinite-lived intangible, not amortized until completion or abandonment, tested for impairment", "Amortized over 5 years from the acquisition date", "Included in goodwill"], answer: "Indefinite-lived intangible, not amortized until completion or abandonment, tested for impairment" },
  ],
  explain: `<p>識別可能純資産(暫定)= 3,500,000 − 900,000 = 2,600,000。のれん = (2,400,000 + 200,000 + 640,000) − 2,600,000 = 640,000。条件付対価は取得日公正価値で対価に含め、訴訟偶発負債も公正価値で負債に含める。</p>
<p>顧客リストの修正は取得日時点の事実に関する測定期間中の情報なので、無形資産を40,000増やしのれんを同額減らす:640,000 − 40,000 = 600,000。</p>
<p>取得関連費用60,000は発生時に費用処理する。負債分類の条件付対価の取得後の事象による変動(260,000 − 200,000 = 60,000)はのれんを修正せず損益に計上し、負債は260,000となる。</p>
<p>企業結合で取得したIPR&amp;Dは耐用年数を確定できない無形資産として計上し、完了・放棄まで償却せず減損テストを行う。</p>`,
});

CPA.tbs({ id: "TBS-BAR-19", section: "BAR", chapter: "BAR-02", title: "内部取引の消去と連結純利益の帰属",
  scenario: `<p>Paxton Co. owns 80% of Sorrel Co., acquired several years ago. The noncontrolling interest was measured at fair value, and an equipment fair value adjustment is being amortized at <b>$10,000</b> per year. Data for the current year:</p>
<table><tr><th>Item</th><th>Paxton</th><th>Sorrel</th></tr>
<tr><td>Sales</td><td>$3,000,000</td><td>$1,200,000</td></tr>
<tr><td>Separate net income (Paxton's excludes dividend income from Sorrel)</td><td>$600,000</td><td>$300,000</td></tr></table>
<ul><li>Sorrel sold merchandise to Paxton for <b>$200,000</b> at a gross margin of 30% on selling price. At year-end, 25% of these goods remain in Paxton's inventory. There was no intercompany inventory at the beginning of the year.</li>
<li>On January 1, Paxton sold equipment with a carrying amount of <b>$50,000</b> to Sorrel for <b>$70,000</b>. Remaining useful life: 4 years, straight-line, no salvage. Paxton's $600,000 includes the gain.</li>
<li>Sorrel paid dividends of $40,000.</li></ul>
<p class="ja">Paxton社は数年前に取得したSorrel社の80%を所有している。非支配持分は公正価値で測定され、設備の公正価値修正を年$10,000ずつ償却している。当期の売上高はPaxton社$3,000,000、Sorrel社$1,200,000。個別純利益はPaxton社$600,000(Sorrel社からの受取配当を除く)、Sorrel社$300,000。Sorrel社はPaxton社に商品を$200,000(売価に対する粗利率30%)で販売し、期末にその25%がPaxton社の在庫に残っている(期首の内部在庫はない)。1月1日にPaxton社は帳簿価額$50,000の設備をSorrel社に$70,000で売却した(残存耐用年数4年、定額法、残存価額なし。Paxton社の$600,000には売却益が含まれる)。Sorrel社は配当$40,000を支払った。</p>`,
  rows: [
    { label: "Consolidated sales(連結売上高)", type: "num", answer: 4000000 },
    { label: "Unrealized profit in ending inventory to be eliminated(消去すべき期末棚卸資産の未実現利益)", type: "num", answer: 15000 },
    { label: "Consolidated net income(連結純利益)", type: "num", answer: 860000 },
    { label: "Net income attributable to the noncontrolling interest(非支配持分に帰属する純利益)", type: "num", answer: 55000 },
    { label: "Net income attributable to Paxton(親会社株主に帰属する純利益)", type: "num", answer: 805000 },
    { label: "Effect of the intercompany equipment gain on NCI income(設備売却益の消去が非支配持分利益に与える影響)", type: "select", options: ["Reduces NCI income by 20% of the net unrealized gain", "Reduces NCI income by 80% of the net unrealized gain", "No effect on NCI income"], answer: "No effect on NCI income" },
  ],
  explain: `<p>連結売上高 = 3,000,000 + 1,200,000 − 200,000 = 4,000,000。</p>
<p>未実現利益(アップストリーム)= 200,000 × 25% × 30% = 15,000。</p>
<p>設備(ダウンストリーム):売却益20,000を消去し、超過減価償却 20,000 ÷ 4 = 5,000 を戻す。純額15,000は親会社のみの修正で、非支配持分には影響しない。</p>
<p>Sorrel社の修正後利益 = 300,000 − 10,000 − 15,000 = 275,000。非支配持分 = 275,000 × 20% = 55,000。</p>
<p>連結純利益 = (600,000 − 20,000 + 5,000) + 275,000 = 860,000。親会社帰属 = 860,000 − 55,000 = 805,000(検算:585,000 + 275,000 × 80% = 805,000)。配当は内部取引として消去され、利益の計算には影響しない。</p>`,
});

CPA.tbs({ id: "TBS-BAR-20", section: "BAR", chapter: "BAR-02", title: "持分変動:追加取得と支配喪失",
  scenario: `<p>On January 1, Year 1, Pine Corp. acquired 70% of Spruce Co. for <b>$1,400,000</b> cash. The fair value of the 30% noncontrolling interest was <b>$600,000</b>, and Spruce's identifiable net assets had a fair value (equal to book value) of <b>$1,700,000</b>. No goodwill impairment has occurred.</p>
<table><tr><th>Event</th><th>Amount</th></tr>
<tr><td>Spruce net income, Year 1</td><td>$200,000</td></tr>
<tr><td>Spruce dividends declared and paid, Year 1</td><td>$50,000</td></tr>
<tr><td>Jan. 1, Year 2: Pine buys an additional 10% of Spruce from noncontrolling shareholders for cash</td><td>$240,000</td></tr>
<tr><td>Spruce net income, Year 2 (no dividends)</td><td>$150,000</td></tr>
<tr><td>Dec. 31, Year 2: Pine sells 60% of Spruce's shares to an unrelated buyer for cash</td><td>$1,800,000</td></tr>
<tr><td>Fair value of Pine's retained 20% interest at Dec. 31, Year 2 (significant influence)</td><td>$600,000</td></tr></table>
<p class="ja">Year 1の1月1日、Pine社はSpruce社の70%を現金$1,400,000で取得した。30%の非支配持分の公正価値は$600,000、Spruce社の識別可能純資産の公正価値(簿価と同額)は$1,700,000である。のれんの減損は生じていない。Spruce社のYear 1純利益$200,000、配当$50,000。Year 2の1月1日、Pine社は非支配株主から追加の10%を現金$240,000で取得。Year 2の純利益$150,000(配当なし)。Year 2の12月31日、Pine社はSpruce社株式の60%を第三者に現金$1,800,000で売却し、保持する20%持分(重要な影響力あり)の公正価値は$600,000である。</p>`,
  rows: [
    { label: "Goodwill at January 1, Year 1(Year 1期首ののれん)", type: "num", answer: 300000 },
    { label: "Noncontrolling interest at December 31, Year 1(Year 1末の非支配持分)", type: "num", answer: 645000 },
    { label: "Decrease in additional paid-in capital from the January 1, Year 2 purchase(Year 2期首の追加取得による資本剰余金の減少額)", type: "num", answer: 25000 },
    { label: "Noncontrolling interest immediately after the January 1, Year 2 purchase(追加取得直後の非支配持分)", type: "num", answer: 430000 },
    { label: "Gain recognized on the loss of control at December 31, Year 2(Year 2末の支配喪失に伴い認識する利益)", type: "num", answer: 560000 },
    { label: "Initial measurement of the retained 20% interest(保持する20%持分の当初測定)", type: "select", options: ["Fair value of $600,000 at the date control is lost", "Carrying amount of 20% of Spruce's net assets", "Original cost of the shares", "Zero until sold"], answer: "Fair value of $600,000 at the date control is lost" },
  ],
  explain: `<p>のれん = (1,400,000 + 600,000) − 1,700,000 = 300,000。連結上のSpruce社純資産(のれん含む)= 2,000,000。</p>
<p>Year 1末の非支配持分 = 600,000 + 200,000 × 30% − 50,000 × 30% = 645,000(= 2,150,000 × 30%)。</p>
<p>追加取得は資本取引:振替える非支配持分 = 645,000 × 10/30 = 215,000、支払額との差額 240,000 − 215,000 = 25,000 を資本剰余金から減額。非支配持分 = 645,000 − 215,000 = 430,000。</p>
<p>Year 2末:Spruce社純資産 = 2,150,000 + 150,000 = 2,300,000、非支配持分 = 430,000 + 150,000 × 20% = 460,000。支配喪失益 = (1,800,000 + 600,000 + 460,000) − 2,300,000 = 560,000。</p>
<p>保持持分は支配喪失日の公正価値$600,000で測定し、以後の持分法の基礎とする。</p>`,
});
