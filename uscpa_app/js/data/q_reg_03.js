// REG の追加問題(代理・債権者債務者関係・担保取引・破産・事業形態・連邦法)

CPA.extend("REG-02", {
  mcq: [
    {
      q: "For three years, Agent regularly purchased lumber from Supplier on Principal's credit, and Principal always paid the invoices, some of which exceeded $8,000. Principal then privately instructed Agent not to make any single purchase above $5,000, but did not tell Supplier. Agent ordered $9,000 of lumber from Supplier in Principal's name. Is Principal liable to Supplier?",
      ja: "3年間、代理人(Agent)は本人(Principal)の信用で業者(Supplier)から材木を定期的に購入し、本人は$8,000を超えるものを含めて常に請求書を支払っていた。その後、本人は代理人に対し1回の購入を$5,000以下とするよう内々に指示したが、業者には伝えなかった。代理人は本人の名で業者に$9,000の材木を注文した。本人は業者に対して責任を負うか。",
      c: [
        "Yes, because Agent had apparent authority based on Principal's prior conduct toward Supplier",
        "No, because Agent exceeded his actual authority",
        "Yes, but only up to $5,000, the limit of Agent's actual authority",
        "No, unless Principal later ratifies the purchase",
      ],
      a: 0,
      ex: "表見代理は本人の第三者に対する言動(過去の取引で支払を続けたこと)から生じる。業者は内部的な制限を知らないため、本人は$9,000全額について拘束される。実際の権限を超えたことは本人と代理人の間の問題(代理人は本人に損害賠償責任)にすぎない。",
    },
    {
      q: "Without any authority, Agent signed a contract in Principal's name to buy a used truck from Seller for $30,000. Which of the following would prevent Principal from validly ratifying the contract?",
      ja: "何の権限もないまま、代理人は本人の名で売主から中古トラックを$30,000で購入する契約に署名した。次のうち、本人による有効な追認を妨げるものはどれか。",
      c: [
        "Principal ratifies orally even though the contract is in writing",
        "Principal ratifies by accepting delivery of the truck without expressly saying so",
        "Seller withdrew from the contract before Principal ratified it",
        "Principal learned of the contract two weeks after it was signed",
      ],
      a: 2,
      ex: "追認前であれば第三者は契約から離脱でき、離脱後の追認は効力を持たない。追認は黙示(引渡しの受領など)でもよく、通常は書面も不要である(同等形式の原則が適用される土地取引等を除く)。追認時に重要な事実を知っていればよく、知った時期は問題でない。",
    },
    {
      q: "Agent, acting for an undisclosed principal, signed a contract in Agent's own name to buy a vacant lot from Owner for $200,000. The contract did not prohibit assignment and involved no personal services. When Owner learned that Principal was the real buyer, Owner refused to convey. Which statement is correct?",
      ja: "代理人は非顕名の本人のために、自己の名でオーナーから空き地を$200,000で購入する契約に署名した。契約は譲渡を禁止しておらず、個人的役務も含まない。オーナーは本当の買主が本人であると知り、移転を拒否した。正しい記述はどれか。",
      c: [
        "Principal cannot enforce the contract because Owner never consented to deal with Principal",
        "Principal can enforce the contract against Owner",
        "Only Agent can enforce the contract, and Principal has no rights under it",
        "The contract is void because Agent failed to disclose the agency",
      ],
      a: 1,
      ex: "非顕名の本人も、契約が個人的性質を持たず本人の関与を明示的に排除していない限り、相手方に契約を強制できる。代理人も契約当事者として責任を負うが、本人の権利がなくなるわけではない。",
    },
    {
      q: "Driver, an employee of a bakery, was delivering cakes during work hours. Driver made a short detour of two blocks to pick up lunch, intending to resume the route, and negligently struck a pedestrian. The pedestrian sues the bakery. The bakery is most likely:",
      ja: "パン屋の従業員である運転手は、勤務時間中にケーキを配達していた。運転手は配達ルートに戻るつもりで昼食を買うため2ブロックだけ寄り道し、過失により歩行者をはねた。歩行者はパン屋を訴えた。パン屋はどうなる可能性が最も高いか。",
      c: [
        "Not liable, because Driver was pursuing a personal errand at the time",
        "Not liable, unless the bakery was negligent in hiring Driver",
        "Liable only if the bakery authorized the lunch stop in advance",
        "Liable, because a minor deviation is a detour within the scope of employment",
      ],
      a: 3,
      ex: "職務からの小さな逸脱(detour)は職務の範囲内とされ、使用者責任(respondeat superior)により使用者が責任を負う。職務から完全に離れた私用(frolic)なら使用者は責任を負わない。雇用時の過失は使用者責任の要件ではない。",
    },
    {
      q: "Developer hired Blaster Inc., an independent contractor, to demolish an old building with explosives. Blaster carefully followed industry practices, but the blast damaged a neighbor's house. The neighbor sues Developer. Developer is:",
      ja: "開発業者は独立請負人であるBlaster社に、爆薬を用いた古い建物の解体を依頼した。Blaster社は業界慣行に注意深く従ったが、爆破により隣家が損傷した。隣人は開発業者を訴えた。開発業者はどうなるか。",
      c: [
        "Liable, because the work was an ultrahazardous activity",
        "Not liable, because a principal is never liable for an independent contractor's torts",
        "Not liable, because Blaster was not negligent",
        "Liable only if Developer controlled the details of the blasting",
      ],
      a: 0,
      ex: "本人は原則として独立請負人の不法行為に責任を負わないが、爆破のような超危険(ultrahazardous)な活動は委任できない義務であり、過失の有無にかかわらず本人が責任を負う(厳格責任)。",
    },
    {
      q: "Principal hired Agent to locate and buy a warehouse. Without telling Principal, Agent sold Principal a warehouse that Agent herself owned, at a price equal to its appraised fair market value. Which statement is correct?",
      ja: "本人は代理人に倉庫を探して購入するよう依頼した。代理人は本人に告げずに、自分が所有する倉庫を鑑定上の公正市場価額と同額で本人に売却した。正しい記述はどれか。",
      c: [
        "Agent did not breach any duty because the price was fair",
        "Agent breached only the duty of obedience",
        "Agent breached the duty of loyalty, and Principal may rescind the purchase",
        "Principal may rescind only if the price exceeded fair market value",
      ],
      a: 2,
      ex: "代理人が本人に開示せずに自己取引を行うことは忠実義務違反であり、価格が公正であっても本人は取引を取り消し、代理人の利益を回収できる。価格の公正さは開示義務違反を治癒しない。",
    },
    {
      q: "Agent had purchased supplies on credit for Principal from Vendor A for years. Principal fired Agent and published a notice of the termination in a trade journal. Afterward, Agent ordered supplies in Principal's name from Vendor A, which had not seen the notice, and from Vendor B, which had known of the agency but had never dealt with Agent and had not seen the notice. Principal is bound to:",
      ja: "代理人は長年、本人のためにA社から掛けで資材を購入していた。本人は代理人を解任し、業界誌に解任の告知を掲載した。その後、代理人は本人の名で、告知を見ていないA社と、代理関係を知っていたが代理人と取引したことがなく告知も見ていないB社から資材を注文した。本人が拘束されるのはどれか。",
      c: [
        "Neither contract, because the termination was published",
        "Both contracts, because neither vendor actually saw the notice",
        "Only the contract with Vendor B",
        "Only the contract with Vendor A",
      ],
      a: 3,
      ex: "本人の意思による代理権終了の場合、代理人と取引のあった第三者(A社)には実際の通知が必要で、公告だけでは表見代理が残る。取引はないが代理関係を知っていた者(B社)には公告による擬制的通知で足りる。",
    },
    {
      q: "Owner borrowed $50,000 from Lender and, as security, gave Lender a written power to sell Owner's boat and apply the proceeds to the loan if Owner defaulted. Owner died before repaying. Lender's power to sell the boat:",
      ja: "オーナーは貸手から$50,000を借り、担保として、債務不履行時にはオーナーのボートを売却し代金を返済に充当する書面の権限を貸手に与えた。オーナーは返済前に死亡した。貸手のボート売却権限はどうなるか。",
      c: [
        "Terminated automatically on Owner's death by operation of law",
        "Continues, because it is an agency coupled with an interest",
        "Continues only if Owner's estate consents",
        "Terminated, but Lender may sue the estate as a general creditor only",
      ],
      a: 1,
      ex: "利益を伴う代理(agency coupled with an interest)は代理人自身の利益のために与えられた権限であり、本人の死亡や撤回によっても終了しない。通常の代理権は本人の死亡により法律上当然に終了する。",
    },
    {
      q: "In a state that follows the equal dignity rule, Principal orally authorized Agent to sign a contract selling Principal's farm. Agent signed a written sales contract with Buyer in Principal's name. Principal then refused to convey. Which statement is correct?",
      ja: "同等形式の原則(equal dignity rule)を採用する州において、本人は口頭で代理人に本人の農場の売買契約への署名を授権した。代理人は本人の名で買主と書面の売買契約に署名した。本人は移転を拒否した。正しい記述はどれか。",
      c: [
        "Buyer can enforce the contract because it is in writing and signed by Agent",
        "Buyer can enforce the contract because Agent had actual authority",
        "The contract is not enforceable against Principal because Agent's authority was not in writing",
        "Agent is personally obligated to convey the farm to Buyer",
      ],
      a: 2,
      ex: "同等形式の原則では、詐欺防止法により書面を要する契約(不動産売買)を代理人が締結するには、代理権自体も書面で授与されなければならない。口頭の授権では本人に対して強制できない。代理人は自ら所有しない農場を移転する義務を負わない。",
    },
    {
      q: "Agent, purporting to act for disclosed Principal, signed a contract with Buyer that was outside both Agent's actual and apparent authority. Principal refused to ratify. Buyer's best remedy is against:",
      ja: "代理人は顕名の本人のために行動するとして買主と契約に署名したが、その契約は代理人の実際の権限・表見代理のいずれの範囲外でもあった。本人は追認を拒否した。買主の最善の救済の相手方は誰か。",
      c: [
        "Principal, for breach of contract",
        "Principal, under the doctrine of respondeat superior",
        "No one, because Buyer had a duty to verify Agent's authority",
        "Agent, for breach of the implied warranty of authority",
      ],
      a: 3,
      ex: "権限なく本人のために契約した代理人は、追認がなければ黙示の権限保証違反として第三者に責任を負う。本人は権限も追認もないため契約上の責任を負わない。使用者責任は不法行為の法理であり契約には適用されない。",
    },
    {
      q: "Fran agreed, without compensation, to act as surety for her friend Dan's $40,000 bank loan. Later, without Fran's knowledge or consent, Dan and the bank agreed to extend the maturity date by two years and raise the interest rate from 6% to 9%. Dan then defaulted. Fran is:",
      ja: "Franは無償で友人Danの$40,000の銀行借入の保証人(surety)になった。その後、Franの知らないうちに同意なく、Danと銀行は満期を2年延長し利率を6%から9%に引き上げることに合意した。その後Danが債務不履行となった。Franはどうなるか。",
      c: [
        "Released from her obligation because of the material modification",
        "Liable for the full $40,000 plus interest at 9%",
        "Liable for $40,000 plus interest at the original 6% rate",
        "Liable, because a surety's consent is not required to modify the loan",
      ],
      a: 0,
      ex: "保証人の同意なく主債務の重要な変更(満期延長・利率引上げ)が行われた場合、無償の保証人は完全に免責される。報酬を得る保証人(compensated surety)は変更によりリスクが実質的に増加した範囲で免責される。",
    },
    {
      q: "Creditor lent Debtor $50,000, secured by Debtor's equipment worth $20,000, and Surety guaranteed the loan. Before Debtor defaulted, Creditor released the security interest in the equipment without Surety's consent. Debtor then defaulted on the entire $50,000. Surety is liable for:",
      ja: "債権者はDebtorに$50,000を貸し付け、Debtorの設備(価値$20,000)を担保とし、Suretyが保証した。Debtorの不履行前に、債権者はSuretyの同意なく設備の担保権を解除した。その後Debtorは$50,000全額を不履行とした。Suretyの責任額はいくらか。",
      c: ["$0", "$50,000", "$30,000", "$20,000"],
      a: 2,
      ex: "債権者が担保を解除した場合、保証人は解除された担保の価値の範囲で免責される。50,000 − 20,000 = 30,000。担保解除は保証人を全面的に免責するものではない($0は誤り)。",
    },
    {
      q: "Surety guaranteed Debtor's $80,000 loan from Bank, which held a perfected security interest in Debtor's inventory. After Debtor defaulted, Surety paid Bank the full $80,000. Surety now wants to enforce Bank's security interest in the inventory. Which right allows this?",
      ja: "SuretyはDebtorの銀行借入$80,000を保証しており、銀行はDebtorの棚卸資産に対抗要件を備えた担保権を有していた。Debtorの不履行後、Suretyは銀行に$80,000全額を支払った。Suretyは銀行の棚卸資産に対する担保権を行使したい。これを可能にする権利はどれか。",
      c: ["Exoneration", "Contribution", "Subrogation", "Attachment"],
      a: 2,
      ex: "代位(subrogation)により、債務を全額弁済した保証人は債権者の地位に立ち、債権者が有していた担保権等の権利を行使できる。求償免除請求(exoneration)は弁済前に債務者へ支払を求める権利、分担請求(contribution)は共同保証人間の権利である。",
    },
    {
      q: "Under a written, unconditional guaranty of payment, Guarantor promised to pay Lender if Borrower failed to pay a $25,000 note when due. Borrower missed the payment. Lender immediately demanded payment from Guarantor without first suing Borrower or giving Guarantor advance notice of the default. Guarantor is:",
      ja: "書面による無条件の支払保証により、保証人は借主が$25,000の手形を期日に支払わない場合に貸主へ支払うことを約束した。借主は支払を怠った。貸主は借主を先に訴えることも、保証人に不履行を事前通知することもなく、直ちに保証人に支払を請求した。保証人はどうなるか。",
      c: [
        "Not liable until Lender obtains an unsatisfied judgment against Borrower",
        "Released because Lender gave no notice of default",
        "Liable only for the portion Lender cannot collect from Borrower's assets",
        "Liable for the full $25,000 immediately upon Borrower's default",
      ],
      a: 3,
      ex: "支払保証人(surety/guarantor of payment)は主債務者の不履行と同時に責任を負い、債権者は債務者に先に請求・訴訟する必要も、保証人に通知する必要もない。先に債務者への執行を要するのは取立保証(guarantor of collection)の場合である。",
    },
    {
      q: "Able, Baker, and Cole are co-sureties on Debtor's $90,000 loan, each guaranteeing up to $60,000. Before Debtor defaulted, Creditor released Able from his guaranty without Baker's or Cole's consent and without reserving rights against them. Debtor then defaulted on the entire $90,000. What is the maximum amount Creditor can collect from Baker and Cole combined?",
      ja: "Able、Baker、ColeはDebtorの$90,000の借入の共同保証人であり、それぞれ$60,000まで保証している。Debtorの不履行前に、債権者はBakerとColeの同意なく、また両者に対する権利を留保せずにAbleの保証を免除した。その後Debtorは$90,000全額を不履行とした。債権者がBakerとColeから合計で回収できる最大額はいくらか。",
      c: ["$90,000", "$60,000", "$30,000", "$120,000"],
      a: 1,
      ex: "共同保証人の一人が免除されると、残りの保証人は免除された者の分担部分の範囲で免責される。Ableの分担 = 90,000 × 60/180 = 30,000。よって90,000 − 30,000 = 60,000。$120,000は各自の保証上限の合計で、債務額を超える。",
    },
    {
      q: "Kerr and Lane are co-sureties on a $100,000 loan to Debtor. Kerr guaranteed up to $50,000 and Lane up to $150,000. Debtor defaulted when the balance was $80,000, and Kerr paid the creditor the entire $80,000. How much can Kerr recover from Lane through contribution?",
      ja: "KerrとLaneはDebtorへの$100,000の貸付の共同保証人である。Kerrは$50,000まで、Laneは$150,000まで保証した。残高が$80,000の時点でDebtorが不履行となり、Kerrが債権者に$80,000全額を支払った。KerrがLaneに分担請求できる額はいくらか。",
      c: ["$60,000", "$40,000", "$30,000", "$80,000"],
      a: 0,
      ex: "分担割合は保証限度額の比率による。Laneの負担 = 80,000 × 150,000/(50,000 + 150,000) = 60,000。均等割の$40,000は典型的な誤りである。",
    },
    {
      q: "Uncle signed a guaranty of his nephew's $15,000 car loan that expressly stated Uncle was a guarantor of collection. Nephew defaulted. Before Uncle can be required to pay, the lender generally must:",
      ja: "叔父は甥の$15,000の自動車ローンについて、取立保証人(guarantor of collection)であると明記した保証書に署名した。甥が不履行となった。叔父に支払を求める前に、貸手は一般に何をしなければならないか。",
      c: [
        "Merely notify Uncle that Nephew has defaulted",
        "Obtain Nephew's written consent to proceed against Uncle",
        "Make a demand on Uncle within 10 days of the default",
        "Exhaust its legal remedies against Nephew, such as obtaining an unsatisfied judgment",
      ],
      a: 3,
      ex: "取立保証人は、債権者が主債務者に対する法的救済を尽くした(判決を得ても回収できない、債務者が支払不能等)後にのみ責任を負う。支払保証人であれば不履行時点で直ちに責任を負う。",
    },
    {
      q: "Contractor owed Supplier $40,000, and Supplier threatened to stop deliveries. Owner, whose building could not be completed without Supplier's materials, orally promised Supplier, \"If Contractor doesn't pay you, I will.\" Supplier continued deliveries. Contractor defaulted. Is Owner's oral promise enforceable?",
      ja: "請負業者は資材業者に$40,000の債務があり、資材業者は納入停止を示唆した。資材業者の資材がなければ建物を完成できない建物所有者は、資材業者に口頭で「請負業者が払わなければ私が払う」と約束した。資材業者は納入を続けた。請負業者は不履行となった。所有者の口頭の約束は強制可能か。",
      c: [
        "Yes, because the main purpose of Owner's promise was to benefit Owner",
        "No, because a promise to answer for the debt of another must always be in writing",
        "No, because Owner received no consideration",
        "Yes, but only if the debt is less than $500",
      ],
      a: 0,
      ex: "他人の債務を保証する約束は原則として詐欺防止法上書面を要するが、約束の主目的が保証人自身の利益(自分の建物の完成)である場合は主目的の例外(main purpose rule)により口頭でも強制可能である。納入継続が約因となる。",
    },
    {
      q: "On February 1, Bank agreed to lend Fabco $100,000 and advanced the funds. On February 5, Fabco signed a security agreement describing \"a CNC milling machine to be purchased from Toolco.\" Fabco acquired rights in the machine on February 10, and Bank filed a financing statement on February 15. Bank's security interest attached on:",
      ja: "2月1日、銀行はFabco社に$100,000を融資することに合意し資金を交付した。2月5日、Fabco社は「Toolco社から購入予定のCNCフライス盤」を記載した担保契約に署名した。Fabco社は2月10日にその機械の権利を取得し、銀行は2月15日に融資説明書(financing statement)を登録した。銀行の担保権が付着(attach)したのはいつか。",
      c: ["February 1", "February 5", "February 15", "February 10"],
      a: 3,
      ex: "付着には①価値の供与、②債務者が担保物に権利を有すること、③担保物を記載した認証済み担保契約(または占有)のすべてが必要で、最後の要件が満たされた2月10日に付着する。2月15日は対抗要件具備(perfection)の日である。",
    },
    {
      q: "Lender took a security interest in Borrower's checking account maintained at First Bank, as original collateral for a business loan. Lender wants to perfect its security interest. Lender must:",
      ja: "貸手は事業融資の当初担保として、借手がFirst Bankに有する当座預金口座に担保権を取得した。貸手は担保権の対抗要件を具備したい。貸手は何をしなければならないか。",
      c: [
        "Obtain control of the deposit account",
        "File a financing statement in the state of Borrower's location",
        "Do nothing, because perfection is automatic on attachment",
        "Take physical possession of Borrower's checkbook",
      ],
      a: 0,
      ex: "当初担保としての預金口座の担保権は支配(control)によってのみ対抗要件を具備でき、登録では足りない。支配は、貸手自身が預金銀行である場合や、預金銀行・債務者との支配契約等により取得する。",
    },
    {
      q: "Appliance Store sold a $2,500 television on credit to Ruth for use in her home, taking a written security interest in the TV. The store did not file a financing statement. Ruth then sold the TV for $1,500 to her neighbor for the neighbor's home use; the neighbor did not know of the store's interest. Ruth defaulted. Which statement is correct?",
      ja: "家電店はRuthに家庭用として$2,500のテレビを掛売りし、書面でテレビに担保権を設定した。店は融資説明書を登録しなかった。その後Ruthはテレビを$1,500で隣人に家庭用として売却し、隣人は店の担保権を知らなかった。Ruthは不履行となった。正しい記述はどれか。",
      c: [
        "The store's interest was unperfected, so it never had rights in the TV",
        "The store can repossess the TV from the neighbor because its PMSI was automatically perfected",
        "The neighbor takes free of the store's security interest",
        "The neighbor takes subject to the security interest but may recover the $1,500 from the store",
      ],
      a: 2,
      ex: "消費財のPMSIは付着と同時に自動的に対抗要件を具備するが、消費者から消費者へ善意・有償で家庭用に購入した者は、登録がない限り担保権の負担を受けない(garage sale rule)。担保権自体は付着しておりRuthには対抗できる。",
    },
    {
      q: "First Bank holds a perfected security interest in all of Car Dealer's inventory, and its financing statement is on file. Pat bought a new car from Car Dealer's lot for personal use, paying full price; Pat had seen First Bank's financing statement. Car Dealer then defaulted. First Bank:",
      ja: "First Bankは自動車ディーラーの全棚卸資産に対抗要件を備えた担保権を有し、融資説明書を登録している。Patは個人用にディーラーの店頭で新車を定価で購入した。PatはFirst Bankの融資説明書を見ていた。その後ディーラーは不履行となった。First Bankはどうなるか。",
      c: [
        "May repossess the car because Pat had actual knowledge of the filing",
        "May repossess the car because a filed financing statement is constructive notice",
        "Has a claim against Pat for the car's fair value",
        "Cannot recover the car from Pat, who is a buyer in the ordinary course of business",
      ],
      a: 3,
      ex: "通常の営業過程の買主(BIOC)は、売主が設定した担保権について、それが対抗要件を備え買主がその存在を知っていても、その負担を受けずに取得する。担保契約に違反することを知っている場合のみ保護されない。",
    },
    {
      q: "Bank A has a perfected security interest in all of Retailer's present and after-acquired inventory, filed in Year 1. In Year 3, Supplier sells new inventory to Retailer on credit and retains a purchase money security interest. To have priority over Bank A in the new inventory, Supplier must:",
      ja: "A銀行は小売業者の現在および将来取得するすべての棚卸資産に対抗要件を備えた担保権を有し、1年目に登録している。3年目、仕入先は新しい棚卸資産を掛売りし、購入代金担保権(PMSI)を留保した。新しい棚卸資産についてA銀行に優先するために、仕入先は何をしなければならないか。",
      c: [
        "Perfect its interest within 20 days after Retailer receives the goods",
        "Perfect before Retailer receives the goods and send authenticated notice to Bank A before Retailer receives the goods",
        "Obtain Bank A's written subordination agreement",
        "Nothing; a PMSI in inventory automatically has priority",
      ],
      a: 1,
      ex: "棚卸資産のPMSIが先行登録者に優先するには、債務者が占有を取得する前に対抗要件を具備し、かつ先行担保権者に認証済みの通知を送付しなければならない。20日の猶予は棚卸資産以外(設備等)のPMSIに適用される。",
    },
    {
      q: "On January 10, Finance Co. filed a financing statement and obtained a security interest in all of Maker's present and after-acquired equipment. On May 1, Maker bought a new press on credit from Seller, who retained a purchase money security interest; the press was delivered on May 3. Seller filed a financing statement on May 18. Maker later defaulted to both. Who has priority in the press?",
      ja: "1月10日、Finance社は融資説明書を登録し、Maker社の現在および将来取得するすべての設備に担保権を取得した。5月1日、Maker社は売主からプレス機を掛けで購入し、売主は購入代金担保権を留保した。プレス機は5月3日に引き渡された。売主は5月18日に融資説明書を登録した。Maker社はその後両者に対し不履行となった。プレス機について優先するのは誰か。",
      c: [
        "Finance Co., because it filed first",
        "Finance Co. and Seller share pro rata",
        "Seller, because it perfected its PMSI within 20 days after Maker received the press",
        "Seller, but only if Finance Co. received notice of the PMSI",
      ],
      a: 2,
      ex: "設備等(棚卸資産以外)のPMSIは、債務者が占有を取得してから20日以内に対抗要件を具備すれば先行登録者に優先する。5月3日から15日後の5月18日に登録しているので売主が優先する。通知は棚卸資産PMSIの要件であり設備には不要。",
    },
    {
      q: "On March 1, Lender obtained a signed security agreement covering Debtor's equipment and advanced $60,000, but did not file a financing statement. On April 1, Judgment Creditor obtained a judicial lien on the same equipment. On April 10, Lender filed a financing statement. Who has priority in the equipment?",
      ja: "3月1日、貸手は債務者の設備を対象とする署名済み担保契約を取得し$60,000を融資したが、融資説明書を登録しなかった。4月1日、判決債権者が同じ設備に差押えによるリーエンを取得した。4月10日に貸手が登録した。設備について優先するのは誰か。",
      c: [
        "Lender, because its security interest attached first",
        "Judgment Creditor, because its lien arose before Lender perfected",
        "Lender, because it perfected within 20 days of the lien",
        "They share equally because both have valid interests",
      ],
      a: 1,
      ex: "未対抗の担保権は、担保権者が対抗要件を具備する前にリーエンを取得したリーエン債権者に劣後する。付着が先でも対抗要件がなければ優先しない。20日ルールはPMSIにのみ適用される。",
    },
    {
      q: "After Debtor defaulted on a $40,000 loan, Secured Party repossessed the collateral and sold it in a commercially reasonable private sale for $30,000. Reasonable expenses of repossession and sale were $2,000. No other liens exist. What deficiency may Secured Party recover from Debtor?",
      ja: "債務者が$40,000の融資について不履行となった後、担保権者は担保物を回収し、商業上合理的な私的売却により$30,000で売却した。回収・売却の合理的費用は$2,000であった。他の担保権は存在しない。担保権者が債務者に請求できる不足額はいくらか。",
      c: ["$10,000", "$8,000", "$12,000", "$0"],
      a: 2,
      ex: "売却代金はまず回収・売却費用に充当され、残りが債務に充当される。不足額 = 40,000 + 2,000 − 30,000 = 12,000。費用を無視した$10,000は誤り。",
    },
    {
      q: "Consumer bought a $6,000 boat for personal use from Marine Dealer, which retained a PMSI. Consumer paid $4,200 before defaulting, and Marine Dealer repossessed the boat. Consumer has not signed any post-default waiver. Marine Dealer must:",
      ja: "消費者はMarine Dealerから個人用に$6,000のボートを購入し、Dealerは購入代金担保権を留保した。消費者は$4,200を支払った後に不履行となり、Dealerはボートを回収した。消費者は不履行後の権利放棄書に署名していない。Dealerは何をしなければならないか。",
      c: [
        "Dispose of the boat within 90 days after taking possession",
        "Keep the boat in full satisfaction of the debt",
        "Return the boat because Consumer paid more than half the price",
        "Hold the boat for at least one year before selling it",
      ],
      a: 0,
      ex: "消費財のPMSIで債務者が現金価格の60%以上(4,200/6,000 = 70%)を支払った場合、債務者が不履行後に放棄しない限り、担保権者は債務の満足に代えて保持(strict foreclosure)できず、占有取得後90日以内に処分しなければならない。",
    },
    {
      q: "After Debtor defaulted, Secured Party repossessed Debtor's equipment and scheduled a public sale for June 30. On June 20, Debtor wants to recover the equipment. Debtor may do so by:",
      ja: "債務者の不履行後、担保権者は債務者の設備を回収し、6月30日に公売を予定した。6月20日、債務者は設備を取り戻したい。債務者はどうすれば取り戻せるか。",
      c: [
        "Paying only the past-due installments",
        "Tendering full payment of the secured obligation plus the secured party's reasonable expenses",
        "Paying the equipment's fair market value",
        "Nothing; once the collateral is repossessed, the debtor has no right to recover it",
      ],
      a: 1,
      ex: "受戻権(right of redemption)により、債務者は担保物の処分前であれば、被担保債務全額と担保権者の合理的費用を提供して担保物を取り戻せる。延滞分のみの支払では足りない。",
    },
    {
      q: "Senior Lender and Junior Lender both hold perfected security interests in Debtor's machinery, securing debts of $35,000 and $20,000, respectively. Junior Lender sent Senior Lender an authenticated demand for proceeds before distribution. After default, Senior Lender sold the machinery for $50,000 and incurred $3,000 of reasonable sale expenses. How much does Junior Lender receive?",
      ja: "上位貸手と下位貸手はいずれも債務者の機械に対抗要件を備えた担保権を有し、被担保債務はそれぞれ$35,000と$20,000である。下位貸手は配当前に認証済みの代金請求を上位貸手に送付した。不履行後、上位貸手は機械を$50,000で売却し、合理的な売却費用$3,000を支出した。下位貸手が受け取る額はいくらか。",
      c: ["$15,000", "$20,000", "$17,000", "$12,000"],
      a: 3,
      ex: "処分代金は①費用、②処分した担保権者の債務、③請求した劣後担保権者、④残余は債務者の順に充当される。50,000 − 3,000 − 35,000 = 12,000が下位貸手へ配当される(費用控除を忘れると$15,000)。",
    },
    {
      q: "Debtor, an individual, owes nine creditors and is generally not paying debts as they become due. Assume the statutory threshold for an involuntary petition is $21,050 of unsecured claims that are not contingent and not subject to bona fide dispute. Creditor X alone holds such an unsecured claim of $25,000. Which statement is correct?",
      ja: "個人である債務者は9名の債権者に債務を負い、一般に弁済期の到来した債務を支払っていない。強制破産申立ての法定基準額は、条件付きでなく誠実な争いのない無担保債権$21,050とする。債権者Xは単独でこのような無担保債権$25,000を有する。正しい記述はどれか。",
      c: [
        "Creditor X may file an involuntary petition alone",
        "At least three creditors must join the petition",
        "An involuntary petition may not be filed against an individual",
        "Creditor X must first obtain a judgment against Debtor",
      ],
      a: 0,
      ex: "債権者が12名未満の場合、基準額以上の無担保債権を持つ債権者1名以上で強制申立てができる。12名以上なら3名以上の申立債権者が必要。個人(農業者・非営利法人を除く)にも強制申立ては可能。",
    },
    {
      q: "Shortly after Debtor filed a voluntary Chapter 7 petition, the following actions were taken. Which is NOT stayed by the automatic stay?",
      ja: "債務者が任意の第7章申立てを行った直後、次の行為が行われた。自動停止(automatic stay)の対象とならないのはどれか。",
      c: [
        "A lender's repossession of Debtor's car",
        "A utility's lawsuit to collect an unpaid bill",
        "A state's criminal prosecution of Debtor for writing bad checks",
        "A creditor's phone calls demanding payment of a credit card balance",
      ],
      a: 2,
      ex: "自動停止は債権回収行為(担保物の回収、訴訟、督促)を停止するが、刑事手続、養育費等家族扶養債務の非財団財産からの取立て、税務調査などは停止の対象外である。",
    },
    {
      q: "Eight months before filing a Chapter 7 petition, while insolvent, Debtor repaid a $30,000 unsecured loan from her brother, who would have received about 10% in a Chapter 7 liquidation. Debtor's other unsecured creditors received nothing during that period. The trustee:",
      ja: "第7章申立ての8か月前、支払不能状態にあった債務者は、兄からの$30,000の無担保借入を返済した。兄は第7章の清算では約10%しか受け取れなかったはずである。この期間中、他の無担保債権者は何も受け取っていない。管財人はどうできるか。",
      c: [
        "Cannot recover the payment because it was made more than 90 days before the petition",
        "Can recover the payment only if the brother knew Debtor was insolvent",
        "Cannot recover the payment because it repaid a legitimate debt",
        "Can recover the payment as a preferential transfer to an insider",
      ],
      a: 3,
      ex: "内部者(親族を含む)への偏頗弁済は申立前1年以内のものが否認対象となる(非内部者は90日以内)。既存債務の弁済、支払不能中、清算時より多く受領という要件を満たす。受領者の認識は要件ではない。",
    },
    {
      q: "Which of the following payments made by Debtor within 90 days before filing a Chapter 7 petition, while insolvent, is LEAST likely to be avoided by the trustee as a preference?",
      ja: "支払不能状態の債務者が第7章申立て前90日以内に行った次の支払のうち、管財人が偏頗行為として否認する可能性が最も低いものはどれか。",
      c: [
        "Repayment of a two-year-old personal loan from a friend",
        "Payment of the regular monthly electric bill, made on its normal due date in the ordinary course",
        "A lump-sum payment to a supplier on a seriously overdue account to induce it to keep shipping",
        "Granting a security interest to an existing unsecured creditor for an old debt",
      ],
      a: 1,
      ex: "通常の業務過程で通常の条件に従って行われた弁済(ordinary course exception)は否認されない。延滞債務の一括弁済や既存債務への担保設定は典型的な偏頗行為である。",
    },
    {
      q: "Eighteen months before filing a bankruptcy petition, while insolvent, Debtor sold his $100,000 boat to his cousin for $10,000. Debtor owed the cousin nothing. The trustee may most likely avoid this transfer as:",
      ja: "破産申立ての18か月前、支払不能状態の債務者は$100,000のボートを従兄弟に$10,000で売却した。債務者は従兄弟に債務を負っていなかった。管財人はこの移転を何として否認できる可能性が最も高いか。",
      c: [
        "A fraudulent transfer, because it was for less than reasonably equivalent value while Debtor was insolvent",
        "A preferential transfer to an insider",
        "Neither, because it occurred more than one year before the petition",
        "A voidable transfer only if the cousin had actual intent to defraud creditors",
      ],
      a: 0,
      ex: "申立前2年以内に、支払不能中に合理的に同等な対価を得ずに行った移転は(擬制的)詐害的移転として否認できる。既存債務の弁済ではないため偏頗行為には当たらない。擬制的詐害では詐害意思は不要。",
    },
    {
      q: "In a Chapter 7 case, $100,000 is available for unsecured claims. Claims are: trustee's administrative expenses $20,000; wages earned within 180 days before the petition of $9,000 owed to Employee A and $18,000 owed to Employee B; federal income taxes for the prior year $21,000; and general unsecured trade claims $137,000. Assume the wage priority limit is $15,000 per employee and there are no domestic support obligations. How much will Employee B receive in total?",
      ja: "第7章の事件で、無担保債権に$100,000が配当可能である。債権は、管財人の管理費用$20,000、申立前180日以内に発生した賃金(従業員A $9,000、従業員B $18,000)、前年の連邦所得税$21,000、一般無担保の取引債権$137,000である。賃金の優先上限は従業員1人当たり$15,000とし、家族扶養債務はない。従業員Bが受け取る総額はいくらか。",
      c: ["$15,000", "$18,000", "$15,750", "$15,375"],
      a: 2,
      ex: "優先順位:管理費用20,000 → 賃金優先部分9,000 + 15,000 = 24,000 → 租税21,000。残り100,000 − 65,000 = 35,000を一般無担保債権137,000 + 3,000(Bの上限超過分)= 140,000に按分(25%)。B = 15,000 + 3,000 × 25% = 15,750。",
    },
    {
      q: "Which of the following would most likely result in a complete denial of a Chapter 7 debtor's discharge, rather than merely making a particular debt nondischargeable?",
      ja: "次のうち、特定の債務が免責されないにとどまらず、第7章の債務者の免責全体が拒否される可能性が最も高いものはどれか。",
      c: [
        "Debtor owes $12,000 of past-due child support",
        "Debtor owes a judgment for injuries caused by drunk driving",
        "Debtor obtained a $5,000 loan by using a materially false written financial statement",
        "Six months before the petition, Debtor transferred valuable jewelry to a friend to hide it from creditors",
      ],
      a: 3,
      ex: "申立前1年以内に債権者を害する意図で財産を移転・隠匿した場合は免責全体が拒否される。養育費、飲酒運転による人身損害、虚偽の財務書類による借入は、その債務だけが非免責となる。",
    },
    {
      q: "Debtor received a Chapter 7 discharge in a case filed five years ago. Debtor now files a new Chapter 7 petition. Which statement is correct?",
      ja: "債務者は5年前に申し立てた事件で第7章の免責を受けた。債務者は今回、新たに第7章の申立てを行った。正しい記述はどれか。",
      c: [
        "Debtor may not file a new Chapter 7 petition at all",
        "Debtor may file, but will be denied a discharge because the prior case was filed within 8 years",
        "Debtor will receive a discharge only of debts incurred after the prior case",
        "Debtor will receive a discharge if the court finds the filing in good faith",
      ],
      a: 1,
      ex: "前回の第7章(または第11章)事件の申立てから8年以内に申し立てられた第7章事件では免責が拒否される。申立て自体は禁止されておらず、債務者の財産は清算される。",
    },
    {
      q: "Debtor filed a Chapter 7 petition on March 1. Which of the following is included in Debtor's bankruptcy estate?",
      ja: "債務者は3月1日に第7章の申立てを行った。次のうち、破産財団に含まれるものはどれか。",
      c: [
        "Wages Debtor earned from a new job in April",
        "A gift of $5,000 cash Debtor received from a friend in May",
        "An inheritance Debtor became entitled to when his aunt died on June 15",
        "Wages Debtor earned for services performed after the petition in August",
      ],
      a: 2,
      ex: "破産財団は原則として申立時の財産だが、申立後180日以内に相続・遺贈、離婚財産分与、生命保険金により取得した財産は含まれる(3月1日から6月15日は106日)。申立後の役務による賃金や通常の贈与は含まれない。",
    },
    {
      q: "When Debtor filed a Chapter 7 petition, Bank held a security interest in Debtor's equipment under a signed security agreement but had never filed a financing statement or taken possession. The equipment is worth $70,000, and Debtor owes Bank $90,000. Which statement is correct?",
      ja: "債務者が第7章の申立てを行った時点で、銀行は署名済み担保契約に基づき債務者の設備に担保権を有していたが、融資説明書の登録も占有もしていなかった。設備の価値は$70,000、債務者の銀行に対する債務は$90,000である。正しい記述はどれか。",
      c: [
        "The trustee can avoid Bank's security interest, leaving Bank with a $90,000 general unsecured claim",
        "Bank receives $70,000 from the equipment and has a $20,000 unsecured claim",
        "Bank may file a financing statement after the petition to perfect its interest",
        "The trustee must abandon the equipment to Bank",
      ],
      a: 0,
      ex: "管財人は仮定的リーエン債権者としての地位(strong-arm clause)により、申立時に未対抗の担保権を否認できる。銀行は$90,000全額について一般無担保債権者となる。申立後の登録は自動停止に反する。",
    },
    {
      q: "Hotel Corp. files a voluntary Chapter 11 petition. No trustee is appointed. Which statement is correct?",
      ja: "Hotel社は任意の第11章申立てを行った。管財人は選任されていない。正しい記述はどれか。",
      c: [
        "Hotel Corp.'s assets must be liquidated and distributed to creditors",
        "Only the creditors' committee may propose a reorganization plan",
        "Hotel Corp. must cease operating its business until a plan is confirmed",
        "Hotel Corp. continues operating as debtor in possession and has the exclusive right to file a plan for the first 120 days",
      ],
      a: 3,
      ex: "第11章では通常、債務者が占有継続債務者(DIP)として事業を継続し、申立後120日間は債務者のみが再建計画を提出できる。清算は第7章の手続である。",
    },
    {
      q: "Which of the following entities is NOT eligible to be a debtor under Chapter 7 of the Bankruptcy Code?",
      ja: "次のうち、破産法第7章の債務者となる資格がないものはどれか。",
      c: [
        "A general partnership",
        "An insurance company",
        "A limited liability company",
        "An individual whose debts are primarily business debts",
      ],
      a: 1,
      ex: "保険会社、銀行、信用組合などは他の規制による整理手続の対象であり、第7章の債務者になれない(鉄道は第11章のみ)。パートナーシップ、LLC、事業債務中心の個人は第7章を利用できる。",
    },
    {
      q: "Nora was admitted as a partner in an existing general partnership, contributing $30,000. At that time the partnership owed $100,000 to Vendor on a pre-existing contract. The partnership later failed, and its assets (including Nora's contribution) were insufficient to pay Vendor. Under the Revised Uniform Partnership Act, Nora's personal assets are exposed to Vendor's claim for:",
      ja: "Noraは既存のジェネラル・パートナーシップに$30,000を出資してパートナーとして加入した。その時点でパートナーシップは既存の契約により業者に$100,000の債務を負っていた。その後パートナーシップは破綻し、資産(Noraの出資を含む)では業者への支払に足りなかった。改正統一パートナーシップ法上、Noraの個人財産が業者の請求にさらされる額はいくらか。",
      c: ["$100,000", "$30,000", "$70,000", "$0"],
      a: 3,
      ex: "新規加入パートナーは加入前の債務について個人責任を負わず、責任はパートナーシップへの出資(持分)の範囲に限られる。$30,000の出資は失い得るが、個人財産は加入前債務の対象とならない。加入後の債務には無限責任を負う。",
    },
    {
      q: "Pam, a partner in a five-partner general partnership that operates a chain of restaurants, wants to take the following actions without consulting the other partners. Under the Revised Uniform Partnership Act, which action requires the consent of all partners?",
      ja: "レストランチェーンを営む5名のジェネラル・パートナーシップのパートナーPamは、他のパートナーに相談せずに次の行為を行いたい。改正統一パートナーシップ法上、全パートナーの同意を要するのはどれか。",
      c: [
        "Admitting a new partner to the partnership",
        "Ordering food supplies for the restaurants",
        "Hiring a new server for one restaurant",
        "Signing a one-year lease for a delivery van",
      ],
      a: 0,
      ex: "新パートナーの加入やパートナーシップ契約の変更、通常の業務範囲外の行為には全員の同意が必要である。食材の発注、従業員の雇用、通常の賃借は通常業務であり、各パートナーが単独で行える(過半数で決定)。",
    },
    {
      q: "Ito and Jain formed a general partnership. Ito contributed $60,000 and Jain contributed $40,000. Their partnership agreement is silent on sharing profits and losses. In the first year, the partnership had a loss of $30,000. Jain's share of the loss is:",
      ja: "ItoとJainはジェネラル・パートナーシップを設立した。Itoは$60,000、Jainは$40,000を出資した。パートナーシップ契約には損益の分配について定めがない。初年度、パートナーシップは$30,000の損失を計上した。Jainの損失負担額はいくらか。",
      c: ["$12,000", "$18,000", "$15,000", "$0"],
      a: 2,
      ex: "定めがない場合、利益は出資額にかかわらず均等に分配され、損失は利益と同じ割合で負担する。30,000 ÷ 2 = 15,000。出資比率による$12,000は典型的な誤り。",
    },
    {
      q: "Kim, Lee, and Moe signed a partnership agreement to operate a business as a limited partnership, with Kim as the general partner and Lee and Moe as limited partners. They never filed a certificate of limited partnership with the state, and the business incurred debts. Which statement is correct?",
      ja: "Kim、Lee、Moeはリミテッド・パートナーシップとして事業を営むパートナーシップ契約に署名し、Kimをジェネラル・パートナー、LeeとMoeをリミテッド・パートナーとした。州へリミテッド・パートナーシップ証明書を提出しないまま事業が債務を負った。正しい記述はどれか。",
      c: [
        "A limited partnership was validly formed when the agreement was signed",
        "No limited partnership exists, so Lee and Moe risk being treated as general partners",
        "Only Kim can be liable for the debts, because Lee and Moe never managed the business",
        "The business is treated as a corporation by estoppel",
      ],
      a: 1,
      ex: "リミテッド・パートナーシップは州への証明書の提出によって成立する。提出がなければジェネラル・パートナーシップとして扱われ、有限責任を予定していたパートナーも無限責任を負うおそれがある(誠実な誤信者の救済規定はあるが、成立したとはいえない)。",
    },
    {
      q: "Dee and Eli are partners in an accounting firm organized as a limited liability partnership. Eli negligently prepared a client's tax return, causing $200,000 of damages, and the firm's assets are insufficient. Dee did not supervise Eli or participate in the engagement. Which statement is correct?",
      ja: "DeeとEliは有限責任パートナーシップ(LLP)として組織された会計事務所のパートナーである。Eliは顧客の税務申告書を過失により作成し、$200,000の損害を生じさせたが、事務所の資産は不足している。DeeはEliを監督しておらず、業務にも関与していない。正しい記述はどれか。",
      c: [
        "Dee and Eli are jointly and severally liable for the full $200,000",
        "Neither Dee nor Eli is personally liable because the firm is an LLP",
        "Eli is personally liable, but Dee's personal assets are not exposed",
        "Dee is liable for half of the damages",
      ],
      a: 2,
      ex: "LLPでは、パートナーは他のパートナーの過失について個人責任を負わないが、自己の過失(および直接監督下の者の過失)については個人責任を負う。Deeの責任は事務所への出資の範囲に限られる。",
    },
    {
      q: "Two individuals form a limited liability company under state law and make no election regarding federal tax classification. Which statement is correct?",
      ja: "2名の個人が州法に基づきLLCを設立し、連邦税上の分類について何の選択もしていない。正しい記述はどれか。",
      c: [
        "The LLC is taxed as a C corporation, and members are personally liable for its debts",
        "The LLC is a disregarded entity, and members are not personally liable for its debts",
        "The LLC is taxed as an S corporation, and members are personally liable for its debts",
        "The LLC is taxed as a partnership, and members are generally not personally liable for its debts",
      ],
      a: 3,
      ex: "複数メンバーのLLCはチェック・ザ・ボックス規則のデフォルトでパートナーシップとして課税され、メンバーは州法上原則として有限責任である。単一メンバーなら無視される事業体(disregarded entity)となる。",
    },
    {
      q: "A court is most likely to pierce the corporate veil and hold the sole shareholder personally liable for a corporation's debts when the shareholder:",
      ja: "裁判所が法人格を否認し、唯一の株主に会社の債務について個人責任を負わせる可能性が最も高いのはどれか。",
      c: [
        "Commingled personal and corporate funds and formed the corporation with nominal capital to avoid paying existing creditors",
        "Is also the corporation's sole director and president",
        "Formed the corporation specifically to limit personal liability for future business debts",
        "Personally guaranteed none of the corporation's debts",
      ],
      a: 0,
      ex: "法人格否認は、資金の混同、過少資本、形式の無視などにより会社が株主の分身として詐欺・不正に利用された場合に認められる。一人会社であることや有限責任を目的とした設立自体は正当である。",
    },
    {
      q: "Before Newco Inc. was incorporated, Promoter signed a five-year lease for office space in Newco's name. After incorporation, Newco's board adopted the lease, and Newco paid rent for a year before defaulting. The landlord never agreed to release Promoter. Who is liable to the landlord?",
      ja: "Newco社の設立前、発起人はNewco社の名で5年の事務所賃貸借契約に署名した。設立後、Newco社の取締役会は契約を承認(採用)し、1年間賃料を支払った後に不履行となった。家主は発起人の免責に一度も同意していない。家主に対して責任を負うのは誰か。",
      c: [
        "Newco only, because it adopted the lease",
        "Promoter only, because Newco did not exist when the lease was signed",
        "Both Newco and Promoter",
        "Neither, because a pre-incorporation contract is void",
      ],
      a: 2,
      ex: "発起人は設立前契約について個人責任を負い、会社が採用(adoption)しても、相手方との更改(novation)がない限り免責されない。会社は採用により責任を負う。したがって両者が責任を負う。",
    },
    {
      q: "Zed owns 10% of the common stock of Alpha Corp., a corporation governed by the Revised Model Business Corporation Act. Alpha's articles of incorporation say nothing about preemptive rights. Alpha's board voted to issue 50,000 new shares for cash to an outside investor. Zed demands the right to buy 10% of the new shares. Zed:",
      ja: "Zedは改正模範事業会社法に準拠するAlpha社の普通株式の10%を保有している。Alpha社の定款には新株引受権について何の定めもない。取締役会は外部投資家に現金で新株50,000株を発行することを決議した。Zedは新株の10%を購入する権利を要求している。Zedはどうなるか。",
      c: [
        "Has that right, because preemptive rights exist unless the articles deny them",
        "Has that right only if the shares are issued below fair value",
        "Does not have that right, because preemptive rights exist only if the articles provide for them",
        "Has that right because Zed owns more than 5% of the stock",
      ],
      a: 2,
      ex: "RMBCAでは新株引受権(preemptive rights)は定款に定めがある場合にのみ存在する(opt-in)。定款が沈黙している以上、Zedに権利はない。発行価額が不当に低い場合は信認義務違反の問題となり得るが、引受権を生じさせるものではない。",
    },
    {
      q: "Director Vic owns the building that Beta Corp. wants to lease. Vic fully disclosed his interest and the material facts to Beta's board, and the lease was approved by a majority of the disinterested directors, with Vic not voting. A shareholder later challenges the lease. Which statement is correct?",
      ja: "取締役VicはBeta社が賃借を希望する建物を所有している。Vicは取締役会に自己の利害と重要な事実を完全に開示し、賃貸借契約はVicが投票せず、利害関係のない取締役の過半数で承認された。後に株主が契約に異議を唱えた。正しい記述はどれか。",
      c: [
        "The lease is automatically void because Vic has a conflict of interest",
        "The lease is voidable unless the shareholders also approved it",
        "Vic breached his duty of care by allowing the corporation to deal with him",
        "The lease is generally protected from challenge based on Vic's conflict of interest",
      ],
      a: 3,
      ex: "利益相反取引は、重要事実の開示後に利害関係のない取締役(または株主)が承認するか、会社にとって公正であれば、利益相反を理由に無効とされない(セーフハーバー)。株主承認は代替手段の一つであり必須ではない。",
    },
    {
      q: "Gamma Corp. has two directors, each owning 50% of its stock. They are hopelessly deadlocked over management of the corporation, the shareholders are unable to break the deadlock, and the business is suffering irreparable injury. Either shareholder may most likely:",
      ja: "Gamma社には取締役が2名おり、それぞれが株式の50%を保有している。両者は会社の経営について解決不能な膠着状態にあり、株主もこれを打開できず、事業は回復不能な損害を受けている。どちらの株主も行える可能性が最も高いのはどれか。",
      c: [
        "Petition a court for judicial dissolution of the corporation",
        "Unilaterally dissolve the corporation by filing articles of dissolution",
        "Compel the corporation to buy back his shares at book value",
        "Remove the other director without a shareholder vote",
      ],
      a: 0,
      ex: "取締役間の膠着状態を株主が打開できず会社に回復不能な損害が生じている場合、株主は裁判所に司法解散を申し立てることができる。任意解散には取締役会の決議と株主の承認が必要で、一方の株主が単独で行うことはできない。",
    },
    {
      q: "During the year, Employer paid Worker wages of $50,000, which is below the Social Security wage base. Assume the Social Security tax rate is 6.2% and the Medicare tax rate is 1.45% for both the employer and the employee, and no Additional Medicare Tax applies. What is the total FICA tax Employer must remit to the IRS for Worker?",
      ja: "当年、雇用主は労働者に社会保障税の課税上限を下回る$50,000の賃金を支払った。社会保障税率は6.2%、メディケア税率は1.45%(雇用主・従業員とも)とし、追加メディケア税は適用されない。雇用主がこの労働者についてIRSに納付しなければならないFICA税の総額はいくらか。",
      c: ["$3,825", "$6,200", "$7,650", "$3,100"],
      a: 2,
      ex: "雇用主は従業員負担分を源泉徴収し、同額を雇用主負担分として拠出して両方を納付する。50,000 × 7.65% × 2 = 7,650。$3,825は片方の負担分のみ。",
    },
    {
      q: "Which of the following statements about the Federal Unemployment Tax Act (FUTA) is correct?",
      ja: "連邦失業税法(FUTA)に関する次の記述のうち、正しいものはどれか。",
      c: [
        "FUTA tax is withheld equally from employees' wages and matched by the employer",
        "FUTA tax is imposed only on the employer and may not be withheld from employees' wages",
        "FUTA tax applies to payments made to independent contractors",
        "Employers receive no credit for contributions paid to state unemployment funds",
      ],
      a: 1,
      ex: "FUTA税は雇用主のみが負担し、従業員の賃金から控除してはならない。州の失業保険への拠出については一定の税額控除が認められる。独立請負人への支払は対象外。",
    },
    {
      q: "Webco engaged Pat to design its website. Pat uses her own equipment, sets her own hours, works for several other clients, is paid a fixed fee per completed project, and Webco has no right to control how she performs the work. For federal employment tax purposes, Webco should:",
      ja: "Webco社はPatに自社ウェブサイトの設計を依頼した。Patは自分の機材を使い、勤務時間を自分で決め、他の複数の顧客の仕事もしており、完成プロジェクトごとに固定報酬を受け取り、Webco社には作業方法を管理する権利がない。連邦雇用税の観点で、Webco社はどうすべきか。",
      c: [
        "Withhold income tax and FICA and pay FUTA on Pat's fees",
        "Pay the employer share of FICA but not withhold income tax",
        "Withhold income tax only, because Pat is a part-time employee",
        "Not withhold or pay employment taxes, because Pat is an independent contractor",
      ],
      a: 3,
      ex: "従業員か独立請負人かは、作業の方法・手段を管理する権利の有無(行動・財務・関係の各要素)で判断する。自己の機材、複数顧客、成果報酬、管理権なしは独立請負人の特徴であり、源泉徴収や雇用税は不要(Form 1099で報告)。",
    },
    {
      q: "Under ERISA, an employee who participates in her employer's 401(k) plan quits after 18 months of service. The plan uses a three-year cliff vesting schedule for employer matching contributions. Which portion of her account is vested?",
      ja: "ERISA上、雇用主の401(k)プランに加入している従業員が勤続18か月で退職した。プランは雇用主のマッチング拠出について3年クリフ・ベスティングを採用している。口座のうち受給権が確定しているのはどの部分か。",
      c: [
        "Only her own elective contributions and their earnings",
        "Both her contributions and 50% of the employer's contributions",
        "None of the account, because she has fewer than three years of service",
        "The entire account, because ERISA requires immediate vesting",
      ],
      a: 0,
      ex: "従業員自身の拠出(とその運用益)は常に100%受給権が確定している。雇用主拠出は3年クリフでは3年未満の勤続で0%となる。比例的な確定は段階的(graded)スケジュールの場合である。",
    },
    {
      q: "Delta Co., which has 150 employees and a group health plan, laid off Ron for economic reasons. Under COBRA, which statement is correct?",
      ja: "従業員150名で団体健康保険プランを有するDelta社は、経済的理由でRonを解雇した。COBRA上、正しい記述はどれか。",
      c: [
        "Delta must continue Ron's coverage at no cost to Ron for 18 months",
        "Ron may elect to continue coverage, generally for up to 18 months, and Delta may charge him up to 102% of the plan's cost",
        "Ron is not eligible for continuation coverage because he was terminated involuntarily",
        "COBRA applies only to employers with at least 500 employees",
      ],
      a: 1,
      ex: "COBRAは従業員20名以上の雇用主に適用され、重大な非行以外による離職は適格事由となる。継続は通常18か月までで、雇用主は保険料の102%まで本人に請求できる(無償である必要はない)。",
    },
    {
      q: "Nina, a nonexempt hourly employee covered by the Fair Labor Standards Act, earns $20 per hour. During one workweek, she worked 10 hours on each of Monday through Thursday and 6 hours on Friday. Her employer has no overtime policy beyond the FLSA requirements. What are her minimum gross wages for the week?",
      ja: "公正労働基準法(FLSA)の適用対象である非免除の時給従業員Ninaの時給は$20である。ある週に、月曜から木曜まで各10時間、金曜に6時間働いた。雇用主はFLSAの要件以上の残業規定を設けていない。この週の最低総支給額はいくらか。",
      c: ["$920", "$1,000", "$1,100", "$980"],
      a: 3,
      ex: "FLSAの割増賃金は1日単位ではなく週40時間超の労働に対し1.5倍。総労働46時間 = 40 × 20 + 6 × 30 = 980。1日8時間超で計算した$1,000(超過8時間)や全時間に時給を払い超過分に1.5倍を上乗せした$1,100は誤り。",
    },
    {
      q: "The three largest regional gasoline retailers secretly agreed to keep their pump prices at the same level, arguing that the agreed price was reasonable and prevented ruinous price wars. Under Section 1 of the Sherman Act, the agreement is:",
      ja: "地域最大手のガソリン小売業者3社は、価格を同水準に維持することを秘密裏に合意し、合意価格は合理的で破滅的な価格競争を防ぐと主張した。シャーマン法第1条上、この合意はどうなるか。",
      c: [
        "Legal, if the agreed price is shown to be reasonable",
        "Analyzed under the rule of reason, weighing pro- and anticompetitive effects",
        "A per se violation, regardless of the reasonableness of the price",
        "Legal, because the retailers do not have a monopoly",
      ],
      a: 2,
      ex: "競争者間の水平的価格協定は当然違法(per se illegal)であり、価格の合理性や競争上の正当化は抗弁にならない。合理の原則は垂直的非価格制限などに適用される。",
    },
    {
      q: "Which of the following actions by an issuer subject to the Sarbanes-Oxley Act is prohibited?",
      ja: "サーベンス・オクスリー法の適用を受ける発行会社の次の行為のうち、禁止されているものはどれか。",
      c: [
        "Having its CEO and CFO certify the financial statements in its annual report",
        "Requiring its audit committee to pre-approve non-audit services provided by the auditor",
        "Establishing procedures for employees to submit concerns anonymously about questionable accounting",
        "Extending a personal home loan to its chief financial officer",
      ],
      a: 3,
      ex: "SOX第402条は、発行会社が取締役・執行役員に個人的な貸付を行うことを原則禁止している。CEO・CFOの認証、監査委員会による非監査業務の事前承認、匿名の通報手続はいずれもSOXが要求する事項である。",
    },
  ],
});

CPA.tbs({ id: "TBS-REG-16", section: "REG", chapter: "REG-02", title: "第7章破産における配当の計算",
  scenario: `<p>Ridge Co. filed a voluntary Chapter 7 petition. The trustee liquidated all nonexempt property for <b>$300,000</b>, including equipment sold for <b>$80,000</b> that was subject to First Bank's perfected security interest securing a <b>$100,000</b> loan. Other claims:</p>
<table><tr><th>Claim</th><th>Amount</th></tr>
<tr><td>Trustee's fees and administrative expenses</td><td>$25,000</td></tr>
<tr><td>Wages earned within 180 days before the petition — Employee A</td><td>$6,000</td></tr>
<tr><td>Wages earned within 180 days before the petition — Employee B</td><td>$9,000</td></tr>
<tr><td>Wages earned within 180 days before the petition — Employee C</td><td>$20,000</td></tr>
<tr><td>Federal income taxes for the prior year</td><td>$15,000</td></tr>
<tr><td>General unsecured trade creditors</td><td>$175,000</td></tr></table>
<p>Assume the wage priority limit is <b>$15,000</b> per employee. There are no domestic support obligations.</p>
<p class="ja">Ridge社は任意の第7章申立てを行った。管財人は非免除財産をすべて$300,000で換価した。この中には、First Bankの$100,000の融資を担保する対抗要件具備済み担保権の目的である設備の売却代金$80,000が含まれる。その他の債権は表のとおり(管財人報酬・管理費用$25,000、申立前180日以内の賃金 A $6,000・B $9,000・C $20,000、前年の連邦所得税$15,000、一般無担保の取引債権$175,000)。賃金の優先上限は従業員1人当たり$15,000とし、家族扶養債務はない。</p>`,
  rows: [
    { label: "Amount available for general unsecured claims after secured and priority claims(担保・優先債権支払後の一般無担保債権への配当可能額)", type: "num", answer: 150000 },
    { label: "Total general unsecured claims(一般無担保債権の総額)", type: "num", answer: 200000 },
    { label: "Total amount received by First Bank(First Bankの受取総額)", type: "num", answer: 95000 },
    { label: "Total amount received by Employee C(従業員Cの受取総額)", type: "num", answer: 18750 },
    { label: "Amount received by a trade creditor with a $40,000 claim($40,000の取引債権者の受取額)", type: "num", answer: 30000 },
    { label: "Treatment of the $5,000 of Employee C's wages above the limit(従業員Cの上限超過分$5,000の扱い)", type: "select", options: ["Priority wage claim", "General unsecured claim", "Not allowed", "Administrative expense"], answer: "General unsecured claim" },
  ],
  explain: `<p>担保権者:First Bankは設備の売却代金$80,000を受け取り、不足額$20,000は一般無担保債権となる。残余 300,000 − 80,000 = 220,000。</p>
<p>優先債権:管理費用25,000 → 賃金(A 6,000 + B 9,000 + C 15,000)= 30,000 → 租税15,000。220,000 − 70,000 = 150,000が一般無担保へ。</p>
<p>一般無担保債権:取引債権175,000 + 銀行不足額20,000 + C超過分5,000 = 200,000。配当率 150,000 ÷ 200,000 = 75%。</p>
<p>First Bank = 80,000 + 20,000 × 75% = 95,000。従業員C = 15,000 + 5,000 × 75% = 18,750。$40,000の取引債権者 = 40,000 × 75% = 30,000。</p>
<p>検算:80,000 + 25,000 + 30,000 + 15,000 + 150,000 = 300,000。</p>`,
});

CPA.tbs({ id: "TBS-REG-17", section: "REG", chapter: "REG-02", title: "UCC第9編:担保権の対抗要件と優先順位",
  scenario: `<p>Home Appliance Co. ("HAC") is a retailer of household appliances. The following events occurred during the year:</p>
<ol>
<li>January 5: First Bank lent HAC $200,000 under a signed security agreement covering all of HAC's present and after-acquired inventory and equipment, and filed a financing statement the same day.</li>
<li>February 20: Supplier filed a financing statement covering refrigerators it would sell to HAC on credit, retaining a purchase money security interest. On February 22, Supplier sent First Bank an authenticated notice of its PMSI. HAC received the refrigerators on March 1.</li>
<li>April 10: Ann bought one of the refrigerators from HAC's showroom for her home. Ann knew First Bank had filed a financing statement against HAC's inventory.</li>
<li>May 2: HAC sold a dishwasher on credit to Ben for his home, taking a signed security agreement. HAC did not file a financing statement.</li>
<li>June 1: Ben sold the dishwasher to his neighbor Cal for Cal's home use. Cal did not know of HAC's security interest.</li>
<li>July 1: Equip Finance lent HAC the purchase price of new display racks (equipment) and took a PMSI. HAC received the racks on July 3, and Equip Finance filed a financing statement on July 15.</li>
</ol>
<p class="ja">HAC社は家電の小売業者である。①1月5日、First BankはHAC社の現在・将来の棚卸資産と設備を対象とする担保契約により$200,000を融資し、同日登録した。②2月20日、仕入先はHAC社に掛売りする冷蔵庫についてPMSIを留保して登録し、2月22日にFirst Bankへ認証済み通知を送付した。HAC社は3月1日に冷蔵庫を受領した。③4月10日、AnnはHAC社の店頭で家庭用に冷蔵庫を購入した。AnnはFirst Bankの登録を知っていた。④5月2日、HAC社はBenに家庭用の食器洗い機を掛売りし、署名済み担保契約を取得したが登録しなかった。⑤6月1日、Benは隣人Calに家庭用として売却した。CalはHAC社の担保権を知らなかった。⑥7月1日、Equip Financeは陳列棚(設備)の購入資金を融資しPMSIを取得した。HAC社は7月3日に受領し、Equip Financeは7月15日に登録した。</p>`,
  rows: [
    { label: "Priority in the refrigerators HAC received March 1(3月1日受領の冷蔵庫に対する優先権)", type: "select", options: ["First Bank", "Supplier", "Shared pro rata"], answer: "Supplier" },
    { label: "Ann's rights in her refrigerator(Annの冷蔵庫に対する権利)", type: "select", options: ["Takes free of First Bank's interest", "Subject to First Bank's interest because she knew of the filing", "Subject to Supplier's interest only"], answer: "Takes free of First Bank's interest" },
    { label: "When HAC's security interest in Ben's dishwasher was perfected(Benの食器洗い機に対するHAC社の担保権の対抗要件具備時期)", type: "select", options: ["Upon attachment, without filing", "Only upon filing", "Never, because HAC lacked possession"], answer: "Upon attachment, without filing" },
    { label: "Cal's rights in the dishwasher(Calの食器洗い機に対する権利)", type: "select", options: ["Takes free of HAC's interest", "Subject to HAC's interest because it was perfected", "Subject to HAC's interest only if Ben defaults"], answer: "Takes free of HAC's interest" },
    { label: "Priority in the display racks(陳列棚に対する優先権)", type: "select", options: ["First Bank", "Equip Finance", "Shared pro rata"], answer: "Equip Finance" },
    { label: "Upon HAC's default, First Bank's right to repossess remaining inventory(HAC社の不履行時のFirst Bankによる在庫回収)", type: "select", options: ["Self-help permitted if no breach of the peace", "Court order always required", "Not permitted until 90 days after default"], answer: "Self-help permitted if no breach of the peace" },
  ],
  explain: `<p>① 棚卸資産のPMSIは、債務者の受領前に対抗要件を具備し、先行登録者に認証済み通知を送れば優先する。仕入先は2月20日登録・2月22日通知・3月1日受領なので仕入先が優先。</p>
<p>② Annは通常の営業過程の買主(BIOC)であり、売主が設定した担保権について、登録を知っていてもその負担を受けない。</p>
<p>③ 消費財のPMSIは付着と同時に自動的に対抗要件を具備する(登録不要)。</p>
<p>④ しかし登録していないため、善意・有償で家庭用に購入した消費者(Cal)には対抗できない(garage sale rule)。</p>
<p>⑤ 棚卸資産以外のPMSIは、債務者の受領後20日以内(7月3日→7月15日は12日後)に対抗要件を具備すれば先行登録者に優先する。</p>
<p>⑥ 担保権者は平穏を害しない限り、裁判手続によらず自力で担保物を回収できる。</p>`,
});

CPA.tbs({ id: "TBS-REG-18", section: "REG", chapter: "REG-02", title: "共同保証人の分担と保証人の権利",
  scenario: `<p>Delta Inc. borrowed <b>$240,000</b> from Lender, secured by Delta's inventory. Three co-sureties guaranteed the loan: <b>X</b> up to <b>$120,000</b>, <b>Y</b> up to <b>$80,000</b>, and <b>Z</b> up to <b>$200,000</b>. When the unpaid balance was <b>$200,000</b>, Delta defaulted, and Lender collected the entire <b>$200,000</b> from Z. X and Y are solvent.</p>
<p class="ja">Delta社は棚卸資産を担保として貸手から$240,000を借り入れた。3名の共同保証人が保証しており、Xは$120,000まで、Yは$80,000まで、Zは$200,000までである。未返済残高が$200,000の時点でDelta社は不履行となり、貸手はZから$200,000全額を回収した。XとYは支払能力がある。</p>`,
  rows: [
    { label: "Amount Z may recover from X through contribution(ZがXに分担請求できる額)", type: "num", answer: 60000 },
    { label: "Amount Z may recover from Y through contribution(ZがYに分担請求できる額)", type: "num", answer: 40000 },
    { label: "Amount Z may seek from Delta through reimbursement(ZがDelta社に求償できる額)", type: "num", answer: 200000 },
    { label: "Alternative: if Lender had released X before default without the others' consent or a reservation of rights, the maximum Lender could collect from Y and Z combined(別例:不履行前に貸手が同意・権利留保なくXを免除していた場合、貸手がYとZから合計で回収できる最大額)", type: "num", answer: 140000 },
    { label: "Right allowing Z to enforce Lender's security interest in Delta's inventory(Delta社の棚卸資産に対する貸手の担保権をZが行使できる権利)", type: "select", options: ["Exoneration", "Subrogation", "Contribution", "Reimbursement"], answer: "Subrogation" },
    { label: "Right Z could have used before paying, to compel Delta to pay Lender when due(支払前に、期日にDelta社に弁済させるためZが使えた権利)", type: "select", options: ["Exoneration", "Subrogation", "Contribution", "Reimbursement"], answer: "Exoneration" },
  ],
  explain: `<p>分担割合は保証限度額の比率:合計 120,000 + 80,000 + 200,000 = 400,000。X 30%、Y 20%、Z 50%。</p>
<p>X = 200,000 × 30% = 60,000、Y = 200,000 × 20% = 40,000(Z自身の負担は100,000)。</p>
<p>保証人は主債務者に対して弁済額全額を求償(reimbursement)できる → 200,000。</p>
<p>共同保証人の一人を免除すると、他の保証人は免除された者の分担部分(60,000)の範囲で免責される → 200,000 − 60,000 = 140,000。</p>
<p>代位(subrogation)により、弁済した保証人は債権者の担保権等を行使できる。求償免除請求(exoneration)は、弁済前に債務者へ支払を強制する権利である。</p>`,
});
