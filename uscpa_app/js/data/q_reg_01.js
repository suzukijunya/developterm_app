// REG の追加問題(倫理・職業上の責任・税務手続・CPAの法的責任)

CPA.extend("REG-01", {
  mcq: [
    {
      q: "A client received a written notice of examination from the IRS on May 1. The client's CPA, a Circular 230 practitioner, offers to prepare an amended return for the year under examination for a fee equal to 20% of any tax reduction. Under Circular 230 §10.27, the contingent fee is permissible if the amended return is filed on or before which of the following dates?",
      ja: "クライアントは5月1日にIRSから書面による調査通知を受け取った。Circular 230の実務家であるCPAは、調査対象年度の修正申告書を作成し、税額減少額の20%を報酬とすることを提案した。Circular 230 §10.27の下で、この成功報酬が認められるのは修正申告書を次のどの日までに提出した場合か。",
      c: ["October 1", "August 20", "September 15", "November 30"],
      a: 1,
      ex: "調査通知の受領後120日以内に提出された修正申告書・還付請求については成功報酬が認められる。5月1日から120日後は8月29日であり、8月20日のみが期限内である。9月15日(137日後)以降は120日を超えるため不可である。",
    },
    {
      q: "A practitioner represents two business partners in an IRS matter whose interests are directly adverse. The practitioner reasonably believes she can provide competent and diligent representation to each, the representation is not prohibited by law, and each client gives informed consent confirmed in writing. Under Circular 230 §10.29, how long must the practitioner retain the written consents?",
      ja: "実務家は、利害が直接対立する2人の事業パートナーをIRS案件で代理している。実務家は各人に有能かつ誠実な代理を提供できると合理的に信じており、代理は法律で禁止されておらず、各クライアントは書面で確認されたインフォームド・コンセントを与えた。Circular 230 §10.29の下で、書面による同意はどれだけの期間保存しなければならないか。",
      c: ["For 3 years after the consent is signed", "Until the IRS matter is closed", "For 7 years after the representation begins", "For at least 36 months after the representation ends"],
      a: 3,
      ex: "利益相反の書面同意は代理終了日から少なくとも36か月保存し、IRSの求めに応じて提出できるようにしなければならない。同意の書面確認は口頭同意から合理的期間内(30日以内)に行う必要がある。案件終了時まで、という選択肢は保存期間を短く見誤っている。",
    },
    {
      q: "A practitioner publishes a schedule of fixed fees for preparing individual returns in a local newspaper on January 10 and does not publish it again. Under Circular 230 §10.30, the practitioner may not charge fees in excess of those published until at least:",
      ja: "実務家は1月10日に地元紙に個人申告書作成の固定報酬表を掲載し、その後は再掲載しなかった。Circular 230 §10.30の下で、実務家が掲載額を超える報酬を請求できないのは、少なくともいつまでか。",
      c: ["30 calendar days after January 10", "The end of the calendar year", "The due date of the individual returns", "90 calendar days after January 10"],
      a: 0,
      ex: "報酬情報を公表した実務家は、最後に公表した日から少なくとも30暦日は公表した報酬に拘束される。期末や申告期限まで拘束されるわけではない。",
    },
    {
      q: "A practitioner mails an unsolicited letter offering tax representation services to 2,000 small businesses in her area. The letter contains no false or misleading statements. Under Circular 230 §10.30, which of the following is required?",
      ja: "実務家は地域の小規模事業者2,000社に対し、税務代理サービスを案内する勧誘状を一方的に郵送した。手紙に虚偽や誤解を招く記述はない。Circular 230 §10.30の下で、次のうち要求されることはどれか。",
      c: ["The letter must be approved in advance by the IRS Office of Professional Responsibility", "The practitioner must retain a copy of the letter and a list of recipients for at least 36 months", "Direct mail solicitation is prohibited for practitioners who are CPAs", "The letter must disclose the practitioner's hourly rate"],
      a: 1,
      ex: "虚偽・誤解を招く・強圧的でなければ直接郵送による勧誘は認められるが、送付文書の写しと送付先リストを最後の送付日から36か月間保存しなければならない。OPRの事前承認は不要であり、時間単価の開示も強制されない。",
    },
    {
      q: "An IRS revenue agent makes a proper and lawful request to a practitioner for client records. The practitioner believes the records are not privileged but they are in the possession of the client's former bookkeeper, not the practitioner. Under Circular 230 §10.20, the practitioner must:",
      ja: "IRSの調査官が実務家に対し、適法かつ適切にクライアントの記録の提出を求めた。実務家は当該記録が秘匿特権の対象でないと考えているが、記録は実務家ではなくクライアントの元経理担当者が保有している。Circular 230 §10.20の下で、実務家はどうしなければならないか。",
      c: ["Obtain the records from the former bookkeeper by subpoena", "Refuse the request because the records are not in the practitioner's possession", "Promptly notify the IRS and provide any information the practitioner has about who possesses the records", "Withdraw from the engagement and notify the client in writing"],
      a: 2,
      ex: "記録が実務家やクライアントの手元にない場合、実務家は速やかにその旨をIRSに通知し、保有者に関して知っている情報を提供しなければならない。実務家に召喚権限はなく、単に拒否することも許されない。",
    },
    {
      q: "A practitioner delegates preparation of a client's return to a staff accountant whom the practitioner hired, trained and regularly reviews. The staff accountant makes an error the practitioner did not detect. Under Circular 230 §10.22, the practitioner will be presumed to have exercised due diligence if the practitioner:",
      ja: "実務家は、自ら採用・研修し定期的にレビューしているスタッフにクライアントの申告書作成を任せた。スタッフが誤りを犯し、実務家はそれを発見できなかった。Circular 230 §10.22の下で、実務家が相当の注意を払ったと推定されるのはどのような場合か。",
      c: ["Signs the return as the paid preparer", "Used reasonable care in engaging, supervising, training and evaluating the staff accountant", "Obtained a written representation from the client that the return is correct", "Personally reperformed every computation on the return"],
      a: 1,
      ex: "他者の作業成果に依拠した場合でも、その者の選任・監督・研修・評価に合理的な注意を払っていれば相当の注意を払ったと推定される。全計算の再実施までは要求されず、顧客の確認書だけでは足りない。",
    },
    {
      q: "A practitioner advises a client to take a return position that has a reasonable basis but lacks substantial authority. Under Circular 230 §10.34, the practitioner must:",
      ja: "実務家は、合理的根拠はあるが実質的根拠を欠く申告ポジションをとるようクライアントに助言した。Circular 230 §10.34の下で、実務家は何をしなければならないか。",
      c: ["Refuse to sign the return", "Disclose the position to the IRS on the client's behalf", "Obtain the client's written agreement to indemnify the practitioner", "Inform the client of any penalties reasonably likely to apply and of the opportunity to avoid them through disclosure"],
      a: 3,
      ex: "実務家は、ポジションに関して適用される可能性が合理的に高いペナルティと、開示(Form 8275等)によってそれを回避できる機会についてクライアントに助言しなければならない。合理的根拠があれば署名拒否は不要で、クライアントの同意なしに実務家がIRSへ開示することもない。",
    },
    {
      q: "The IRS Office of Professional Responsibility imposes a monetary penalty on a practitioner for violating Circular 230 while representing a client. The amount of the monetary penalty may not exceed:",
      ja: "IRSのOffice of Professional Responsibilityは、クライアント代理中にCircular 230に違反した実務家に金銭的制裁を科した。金銭的制裁の金額の上限はどれか。",
      c: ["The gross income derived or to be derived from the conduct giving rise to the penalty", "$1,000 per violation", "The tax understatement of the client", "Twice the fee charged to the client"],
      a: 0,
      ex: "§10.50(c)により、金銭的制裁は違反行為から得た(または得る予定の)総収入を上限とし、譴責・業務停止・資格剥奪に加えて、またはそれに代えて科すことができる。クライアントの過少申告額や定額$1,000は基準ではない。",
    },
    {
      q: "Under Circular 230 §10.51, which of the following constitutes incompetence and disreputable conduct for which a practitioner may be sanctioned?",
      ja: "Circular 230 §10.51の下で、実務家が制裁を受けうる不適格行為・不名誉な行為に該当するのはどれか。",
      c: ["Charging a fixed fee for representing a client in an examination", "Advertising tax services on the practitioner's website", "Willfully failing to file the practitioner's own federal income tax return", "Representing a client before IRS Appeals under a valid power of attorney"],
      a: 2,
      ex: "実務家自身の連邦税申告書を故意に提出しないことは§10.51の不名誉な行為の典型例である。固定報酬の請求、虚偽のない広告、委任状に基づく代理はいずれも許容される。",
    },
    {
      q: "A practitioner has been representing a client before the IRS for 14 months on a collection matter. The practitioner repeatedly fails to respond to IRS correspondence for months at a time, delaying resolution, although the client's records are complete. Which Circular 230 provision is most directly violated?",
      ja: "実務家は14か月にわたりクライアントの徴収案件をIRSで代理しているが、記録は揃っているにもかかわらず、数か月間IRSの書簡に回答しないことを繰り返し、解決を遅らせている。最も直接的に違反しているCircular 230の規定はどれか。",
      c: ["§10.29 Conflicting interests", "§10.27 Fees", "§10.30 Solicitation", "§10.23 Prompt disposition of pending matters"],
      a: 3,
      ex: "§10.23は、実務家がIRSに係属する案件の迅速な処理を不当に遅らせてはならないと定める。利益相反・報酬・勧誘の規定は本件の事実とは関係しない。",
    },
    {
      q: "A client's warehouse flooded, destroying receipts for business supplies. The client provides a reasonable estimate of supply expenses based on bank statements and prior-year patterns. Under the AICPA Statements on Standards for Tax Services, the CPA preparing the return:",
      ja: "クライアントの倉庫が浸水し、事業用消耗品の領収書が失われた。クライアントは銀行明細や前年の傾向に基づいて消耗品費の合理的な見積額を提示した。AICPAの税務業務基準書(SSTS)の下で、申告書を作成するCPAはどうすべきか。",
      c: ["May use the estimate, but should not present it in a manner that implies greater accuracy than exists", "May not use estimates unless the IRS grants advance permission", "Must attach a statement to the return disclosing every estimated amount", "May use the estimate only if the client signs an affidavit verifying the amount"],
      a: 0,
      ex: "記録の滅失等で正確なデータの入手が実務上困難で、見積が合理的であればCPAは見積を使用できる。ただし実際より高い精度を示唆する表示(端数まで細かい金額等)は避ける。通常は見積の開示は不要であり、IRSの事前許可も不要である。",
    },
    {
      q: "While preparing a client's current-year return, a CPA discovers that the client's prior-year return, prepared by another firm, omitted $15,000 of taxable income. Under the AICPA Statements on Standards for Tax Services, the CPA should:",
      ja: "当年度の申告書作成中に、CPAはクライアントの前年度申告書(他の事務所が作成)で$15,000の課税所得が漏れていることを発見した。SSTSの下で、CPAはどうすべきか。",
      c: ["Notify the IRS of the error immediately", "Promptly inform the client of the error and its potential consequences and recommend corrective measures", "Ignore the error because the CPA did not prepare the prior-year return", "Withdraw from the engagement immediately"],
      a: 1,
      ex: "誤りを知ったCPAは、それが自らの作成した申告書でなくても、速やかにクライアントに誤りと影響を伝え是正措置(修正申告)を勧告する。法令で求められる場合を除き、クライアントの許可なくIRSへ通知してはならず、即時の契約解除も要求されない(継続可否は検討する)。",
    },
    {
      q: "During an IRS examination in which a CPA represents a client, the CPA discovers an error on the return under examination that results in an additional $8,000 of tax. Under the AICPA Statements on Standards for Tax Services, the CPA should:",
      ja: "CPAがクライアントを代理しているIRS調査の過程で、調査対象申告書に$8,000の追加税額が生じる誤りを発見した。SSTSの下で、CPAはどうすべきか。",
      c: ["Disclose the error to the revenue agent without informing the client", "Continue the representation without addressing the error, since the IRS has the burden of finding it", "Inform the client and request the client's agreement to disclose the error to the IRS; if the client refuses, consider whether to withdraw", "File an amended return on the client's behalf"],
      a: 2,
      ex: "行政手続中に誤りを知った場合、CPAはクライアントに伝え、IRSへの開示に同意するよう求める。クライアントが拒否すれば代理を継続するか(撤退するか)を検討する。クライアントの同意なしにIRSへ開示したり、代わりに修正申告書を提出したりはできない。",
    },
    {
      q: "Under the AICPA Statements on Standards for Tax Services, which of the following is a reasonable ground for a CPA to sign a return on which a question has not been answered?",
      ja: "SSTSの下で、CPAが未回答の質問がある申告書に署名することが認められる合理的な理由はどれか。",
      c: ["The answer would increase the client's tax liability", "The client asked the CPA not to answer the question", "The question is commonly ignored by other preparers", "The information is not readily available and the answer is not significant to the taxpayer's tax liability"],
      a: 3,
      ex: "情報が容易に入手できず回答が税額に重要でない場合、質問が当該納税者に適用されない場合、回答が膨大な場合などは未回答のまま署名できる(理由の説明を検討)。税額が増える、顧客が望まない、という理由は合理的根拠にならない。",
    },
    {
      q: "A client with wages of $45,000 tells his CPA that he made $28,000 of cash contributions to his church during the year. Under the AICPA Statements on Standards for Tax Services, the CPA:",
      ja: "給与$45,000のクライアントが、当年に教会へ$28,000の現金寄附をしたとCPAに伝えた。SSTSの下で、CPAはどうすべきか。",
      c: ["Should make reasonable inquiries because the information appears unusual in light of other facts known", "May rely on the client's statement without inquiry because SSTS permits good-faith reliance", "Must examine all canceled checks and bank statements before preparing the return", "Must refuse to deduct the contributions"],
      a: 0,
      ex: "CPAは顧客提供情報に検証なく誠実に依拠できるが、知っている他の情報に照らして不正確・不完全・矛盾に見える場合は無視せず合理的な質問をすべきである。所得に比べ寄附が異常に大きいため照会が必要。ただし全証憑の監査までは要求されない。",
    },
    {
      q: "In a prior year, an IRS examination disallowed a deduction claimed by a client, and the client agreed to the adjustment to avoid litigation costs. For the current year, the CPA believes the same deduction has substantial authority. Under the AICPA Statements on Standards for Tax Services, the CPA:",
      ja: "前年度のIRS調査でクライアントの控除が否認され、クライアントは訴訟費用を避けるため更正に同意した。当年度、CPAは同じ控除に実質的根拠があると考えている。SSTSの下で、CPAはどうすべきか。",
      c: ["Must follow the prior-year treatment because the client agreed to it", "May recommend the deduction because the CPA is not bound by the prior administrative proceeding if the position meets the applicable standards", "May claim the deduction only if the IRS grants a private letter ruling", "Must disclose the prior-year settlement on the current return"],
      a: 1,
      ex: "過去の行政手続や裁判の結果は、当年度の申告ポジションをCPAに拘束しない。和解は訴訟回避など他の理由でなされることが多く、当年度のポジションが適用基準(連邦では実質的根拠)を満たせば推奨できる。",
    },
    {
      q: "A CPA recommends a federal return position that is not a tax shelter or reportable transaction and will not be disclosed on the return. Under the AICPA Statements on Standards for Tax Services, which incorporate the standards of the applicable taxing authority, the minimum level of support required is:",
      ja: "CPAは、タックスシェルターや報告対象取引に該当せず、申告書で開示しない連邦税の申告ポジションを推奨する。課税当局の基準を取り込むSSTSの下で、必要とされる最低限の根拠の水準はどれか。",
      c: ["Reasonable basis", "Realistic possibility of being sustained", "Substantial authority", "More likely than not"],
      a: 2,
      ex: "SSTSは課税当局の基準に従うことを求め、連邦では未開示ポジションには実質的根拠(substantial authority)が必要である。開示する場合は合理的根拠で足り、タックスシェルター等は「more likely than not」が必要。",
    },
    {
      q: "An individual's return, which showed a balance due of $20,000, was due April 15. No extension was requested. The return was filed, and the $20,000 was paid, 2 months and 10 days after the due date. Fraud is not involved, and any minimum penalty is ignored. What is the total of the failure-to-file and failure-to-pay penalties?",
      ja: "個人の申告書は納付税額$20,000を示しており、期限は4月15日であった。延長申請はしていない。申告書は期限の2か月10日後に提出され、同時に$20,000が納付された。不正はなく、最低ペナルティは無視する。申告書不提出ペナルティと不納付ペナルティの合計はいくらか。",
      c: ["$3,300", "$2,700", "$300", "$3,000"],
      a: 3,
      ex: "端数月は1か月とするため3か月。不納付 = 20,000 × 0.5% × 3 = 300。不提出 = 20,000 × 5% × 3 = 3,000から同じ月の不納付分300を控除して2,700。合計3,000。控除を忘れると$3,300になる。",
    },
    {
      q: "An individual obtained a valid automatic extension to file his return. By the original due date he paid 92% of the tax ultimately shown on the return, and he paid the remaining balance when he filed the return before the extended due date. Which penalty applies?",
      ja: "個人は申告期限の自動延長を有効に受けた。当初の期限までに最終的な申告税額の92%を納付し、延長期限前に申告書を提出した際に残額を納付した。適用されるペナルティはどれか。",
      c: ["No failure-to-file or failure-to-pay penalty applies", "A failure-to-pay penalty on the 8% balance", "A failure-to-file penalty because the return was filed after the original due date", "Both penalties, reduced for the extension period"],
      a: 0,
      ex: "延長により期限内申告となるため不提出ペナルティはない。延長の場合、当初期限までに税額の90%以上を納付し、残額を申告時に納付すれば合理的理由があるとみなされ不納付ペナルティも課されない(延滞利息は生じる)。",
    },
    {
      q: "A C corporation reported tax of $800,000 on its return. On examination, its correct tax liability was determined to be $900,000. There is no substantial authority or disclosure for the items involved. What accuracy-related penalty for substantial understatement applies?",
      ja: "C法人は申告書に税額$800,000を記載した。調査の結果、正しい税額は$900,000と判明した。該当項目に実質的根拠も開示もない。過少申告に係る正確性関連ペナルティはいくらか。",
      c: ["$0", "$20,000", "$18,000", "$2,000"],
      a: 1,
      ex: "法人の重大な過少申告の基準は「正しい税額の10%(ただし$10,000以上)または$10,000,000のいずれか少ない方」= 90,000。過少申告額100,000はこれを超えるため、20% × 100,000 = 20,000。$10,000,000の基準だけを見ると$0と誤る。",
    },
    {
      q: "An individual claimed a $500,000 charitable deduction for donated land. The IRS established that the land's correct value was $100,000, and the resulting underpayment of tax attributable to the overvaluation is $35,000. There is no reasonable cause and fraud is not involved. What is the accuracy-related penalty?",
      ja: "個人は寄附した土地について$500,000の寄附金控除を申告した。IRSは土地の正しい価額が$100,000であることを立証し、過大評価による納税不足額は$35,000である。合理的理由はなく、不正もない。正確性関連ペナルティはいくらか。",
      c: ["$7,000", "$26,250", "$14,000", "$10,500"],
      a: 2,
      ex: "申告価額が正しい価額の200%以上(本件は500%)であれば重大な評価誤り(gross valuation misstatement)となり、ペナルティ率は40%に倍増する。35,000 × 40% = 14,000。通常の20%とすると$7,000、不正ペナルティ75%とすると$26,250で誤り。",
    },
    {
      q: "A taxpayer fraudulently failed to file an income tax return showing a net tax due of $50,000. The return was eventually filed 7 months after the due date. What is the fraudulent failure-to-file penalty (before any reduction for the failure-to-pay penalty)?",
      ja: "納税者は純納付税額$50,000の申告書を不正に提出しなかった。申告書は最終的に期限から7か月後に提出された。不正な申告書不提出ペナルティ(不納付ペナルティとの調整前)はいくらか。",
      c: ["$52,500", "$37,500", "$12,500", "$17,500"],
      a: 1,
      ex: "不正な不提出の場合、率は月15%、上限75%となる。15% × 7 = 105%は上限を超えるため75% × 50,000 = 37,500。通常の不提出ペナルティの上限25%なら$12,500。",
    },
    {
      q: "An individual's prior-year AGI was $180,000, and her prior-year tax (on a full 12-month return) was $30,000. Her current-year tax is $50,000. What is the minimum total of timely withholding and estimated tax payments required for the current year to avoid the underpayment of estimated tax penalty?",
      ja: "個人の前年のAGIは$180,000、前年税額(12か月の申告書)は$30,000であった。当年の税額は$50,000である。予定納税不足ペナルティを回避するために当年に必要な源泉徴収と予定納税の適時納付額の最低合計はいくらか。",
      c: ["$30,000", "$45,000", "$50,000", "$33,000"],
      a: 3,
      ex: "必要額は当年税額の90%(45,000)と前年税額の100%(前年AGIが$150,000超なら110%)のいずれか少ない方。前年AGIが$150,000を超えるため110% × 30,000 = 33,000 < 45,000。100%とすると$30,000で誤り。",
    },
    {
      q: "An individual with prior-year AGI of $90,000 had prior-year tax (on a full 12-month return) of $12,000. Current-year tax is $20,000, and $11,000 was withheld evenly from wages during the year. No estimated payments were made. Which statement is correct regarding the estimated tax penalty?",
      ja: "前年AGIが$90,000の個人の前年税額(12か月の申告書)は$12,000であった。当年税額は$20,000で、給与から年間を通じて均等に$11,000が源泉徴収された。予定納税はしていない。予定納税ペナルティに関する正しい記述はどれか。",
      c: ["A penalty applies because the payments were less than both 90% of current-year tax and 100% of prior-year tax", "No penalty applies because withholding is at least 90% of prior-year tax", "No penalty applies because withholding exceeded 50% of current-year tax", "No penalty applies because the balance due is less than $10,000"],
      a: 0,
      ex: "必要額は90% × 20,000 = 18,000と前年税額100%の12,000のいずれか少ない方で12,000。源泉徴収11,000はこれに満たず、未納額9,000も$1,000以上なのでペナルティが課される。前年税額の「90%」という基準は存在しない。",
    },
    {
      q: "An individual's underpayment of tax for a year is $40,000. The IRS proves by clear and convincing evidence that fraud was involved, and the taxpayer proves that $10,000 of the underpayment is not attributable to fraud but to negligence. What is the total of the civil fraud penalty and the accuracy-related penalty?",
      ja: "個人のある年の納税不足額は$40,000である。IRSは明白かつ説得力ある証拠で不正を立証し、納税者は不足額のうち$10,000が不正ではなく過失によるものであることを立証した。民事不正ペナルティと正確性関連ペナルティの合計はいくらか。",
      c: ["$24,500", "$30,000", "$22,500", "$8,000"],
      a: 0,
      ex: "不正部分30,000 × 75% = 22,500、過失部分10,000 × 20% = 2,000、合計24,500。同一部分に両ペナルティは重複しない。納税者が立証しなければ全額40,000が不正扱いとなり$30,000となる。",
    },
    {
      q: "A paid preparer prepared a client's return containing an undisclosed position that had a reasonable basis but lacked substantial authority, resulting in an understatement. The position was not a tax shelter or reportable transaction, and the preparer's conduct was not willful or reckless. The preparer charged $4,000 for the return. What is the preparer penalty under IRC §6694?",
      ja: "有償の申告書作成者は、合理的根拠はあるが実質的根拠を欠く未開示ポジションを含むクライアントの申告書を作成し、過少申告が生じた。タックスシェルター等ではなく、故意・無謀ではない。報酬は$4,000であった。IRC §6694による作成者ペナルティはいくらか。",
      c: ["$1,000", "$2,000", "$3,000", "$5,000"],
      a: 1,
      ex: "未開示ポジションは実質的根拠が必要で、欠くため§6694(a)の不合理なポジションに該当する。ペナルティは$1,000と報酬の50%(2,000)のいずれか大きい方で2,000。75%や$5,000は故意・無謀な場合の§6694(b)の基準。",
    },
    {
      q: "Under IRC §6694(a), a paid preparer avoids the penalty for an understatement due to a position (other than a tax shelter or reportable transaction) that is adequately disclosed on the return if the position has at least:",
      ja: "IRC §6694(a)の下で、申告書上で適切に開示されたポジション(タックスシェルター・報告対象取引を除く)に起因する過少申告について、有償作成者がペナルティを回避できるのは、そのポジションが少なくとも何を有する場合か。",
      c: ["A more-likely-than-not chance of being sustained", "Substantial authority", "A reasonable basis", "A realistic possibility of being sustained"],
      a: 2,
      ex: "開示されたポジションは合理的根拠(reasonable basis)があればペナルティを回避できる。未開示なら実質的根拠、タックスシェルターや報告対象取引はmore likely than notが必要。",
    },
    {
      q: "A paid preparer charged $10,000 to prepare a return and recklessly disregarded IRS rules, resulting in an understatement based on an unreasonable position. Both IRC §6694(a) and §6694(b) apply to the same conduct. What is the total preparer penalty imposed?",
      ja: "有償作成者は申告書作成に$10,000を請求し、IRSの規則を無謀に無視した結果、不合理なポジションに基づく過少申告が生じた。同じ行為に§6694(a)と§6694(b)の両方が適用される。課される作成者ペナルティの合計はいくらか。",
      c: ["$12,500", "$5,000", "$10,000", "$7,500"],
      a: 3,
      ex: "§6694(a) = max($1,000, 50% × 10,000) = 5,000、§6694(b) = max($5,000, 75% × 10,000) = 7,500。§6694(b)のペナルティは同じ行為について課された(a)の額だけ減額されるため、合計は7,500。単純合計の$12,500は誤り。",
    },
    {
      q: "Which of the following failures by a paid tax return preparer is subject to a penalty under IRC §6695?",
      ja: "有償の申告書作成者の次の行為のうち、IRC §6695のペナルティの対象となるのはどれか。",
      c: ["Charging a fee based on the number of hours worked", "Failing to retain a copy or a list of the returns prepared for 3 years", "Advertising return preparation services on social media", "Declining to prepare a return for a prospective client"],
      a: 1,
      ex: "§6695は、申告書の写しの交付・署名・識別番号の記載・作成した申告書の写しまたはリストの3年間保存を怠ること、納税者の還付小切手の換金、EITC等のデューデリジェンス違反などに課される。時間報酬や広告、受任拒否は対象外。",
    },
    {
      q: "Under IRC §7216 and the related regulations, which of the following disclosures of tax return information by a preparer is permitted WITHOUT the taxpayer's consent?",
      ja: "IRC §7216と関連規則の下で、作成者による申告情報の開示のうち、納税者の同意なしに認められるのはどれか。",
      c: ["Providing a client list with income levels to an affiliated investment advisor", "Sending the client's return to a lender that requested it for a mortgage application", "Using return information to solicit the client for life insurance products", "Disclosing return information to another CPA firm performing a peer review of the preparer's practice"],
      a: 3,
      ex: "品質管理・ピアレビューのための開示は同意なしに認められる例外である(裁判所命令や同一事務所内の作成目的の開示も同様)。融資先への提出、関連会社への提供、税務以外のサービス勧誘には事前の書面同意が必要。",
    },
    {
      q: "Which of the following persons is NOT treated as a tax return preparer subject to the IRC §6694 penalty?",
      ja: "IRC §6694のペナルティの対象となる申告書作成者として扱われないのは次のうち誰か。",
      c: ["A volunteer who prepares returns at a community site without compensation", "A CPA who prepares a substantial portion of a client's return for a fee but does not sign it", "An enrolled agent who signs returns she prepares for a fee", "An employee of a tax preparation firm who prepares returns for the firm's paying customers"],
      a: 0,
      ex: "申告書作成者とは報酬を得て申告書(またはその相当部分)を作成する者であり、署名しない作成者(nonsigning preparer)も含む。無報酬のボランティアは該当しない。",
    },
    {
      q: "A paid preparer claims the earned income tax credit and head-of-household status for a client who states that his two nephews lived with him all year. Based on the birth dates provided, one nephew is 26 and the client has not indicated that he is disabled. To satisfy the due diligence requirements of IRC §6695(g), the preparer must:",
      ja: "有償作成者は、2人の甥が1年中同居していたと述べるクライアントについて、勤労所得税額控除(EITC)と世帯主ステータスを申告する。提供された生年月日によると甥の1人は26歳で、障害があるとの申告もない。IRC §6695(g)のデューデリジェンス要件を満たすため、作成者は何をしなければならないか。",
      c: ["Accept the client's statements because preparers may rely on client information without verification", "Obtain birth certificates and school records for both nephews before filing", "Make reasonable inquiries about the inconsistent information, document the inquiries and responses, and retain the records", "Refuse to prepare the return"],
      a: 2,
      ex: "EITC等のデューデリジェンス要件では、作成者は情報が不正確・矛盾・不完全に見える場合に合理的な質問を行い、その内容と回答を記録し保存しなければならない。26歳の非障害者は適格子とならない可能性があるため照会が必要。すべての書類入手までは常に要求されない。",
    },
    {
      q: "An individual filed her 2023 calendar-year income tax return on February 10, 2024. The return was not fraudulent and did not omit any gross income. The normal period for the IRS to assess additional tax for 2023 expires on:",
      ja: "個人は2023暦年の所得税申告書を2024年2月10日に提出した。申告書に不正はなく、総所得の脱漏もない。2023年分についてIRSが追加税額を査定できる通常の期間はいつ満了するか。",
      c: ["February 10, 2027", "April 15, 2027", "October 15, 2027", "April 15, 2030"],
      a: 1,
      ex: "期限前に提出された申告書は期限日(2024年4月15日)に提出されたものとみなされ、そこから3年後の2027年4月15日に査定期間が満了する。実際の提出日から数えた2027年2月10日は誤り。",
    },
    {
      q: "An individual did not request an extension and filed his 2023 calendar-year return on September 1, 2024. There was no fraud or substantial omission of income. The IRS generally may assess additional tax for 2023 until:",
      ja: "個人は延長申請をせず、2023暦年の申告書を2024年9月1日に提出した。不正や所得の重大な脱漏はない。IRSが2023年分の追加税額を査定できるのは原則としていつまでか。",
      c: ["April 15, 2027", "September 1, 2030", "September 1, 2027", "October 15, 2027"],
      a: 2,
      ex: "期限後に提出された申告書の査定期間は、実際の提出日から3年である。したがって2027年9月1日。期限日から数えるのは期限前提出の場合のみ。6年(2030年)は総所得の25%超の脱漏がある場合。",
    },
    {
      q: "A retailer reported gross sales of $400,000 and cost of goods sold of $300,000 on its timely filed return. It omitted $90,000 of interest income. There was no fraud. What is the period during which the IRS may assess additional tax?",
      ja: "小売業者は期限内提出の申告書に総売上$400,000、売上原価$300,000を記載した。受取利息$90,000を記載漏れしていた。不正はない。IRSが追加税額を査定できる期間はどれか。",
      c: ["3 years, because the omission is not more than 25% of gross income stated on the return", "6 years, because the omission exceeds 25% of gross profit", "Unlimited, because income was omitted", "7 years"],
      a: 0,
      ex: "25%基準の「総所得」は、事業については売上原価控除前の総収入金額で判定する。90,000 ÷ 400,000 = 22.5%で25%以下のため通常の3年となる。売上総利益100,000を分母にすると90%となり6年と誤る。",
    },
    {
      q: "An individual timely filed her 2021 return on April 10, 2022; $12,000 had been withheld from wages during 2021. After an examination, she paid an additional $3,000 of tax on October 1, 2024. She filed a refund claim for 2021 on August 1, 2025, contending that she overpaid her 2021 tax. What is the maximum refund she can receive?",
      ja: "個人は2021年分の申告書を2022年4月10日に期限内提出した。2021年中に給与から$12,000が源泉徴収されていた。調査後、2024年10月1日に追加税額$3,000を納付した。2025年8月1日に2021年分の還付請求を提出し、2021年分の税を過大に納付したと主張している。受け取れる還付の上限額はいくらか。",
      c: ["$0", "$15,000", "$12,000", "$3,000"],
      a: 3,
      ex: "申告から3年(期限前提出は期限日扱いで2025年4月15日)は経過しているが、納付から2年以内なので請求は適時である。ただし還付額は請求前2年以内に納付した税額に限られ、3,000が上限。源泉徴収分は2022年4月15日に納付したものとみなされ対象外。",
    },
    {
      q: "The IRS properly assessed an individual's income tax on June 1, 2022. Absent any suspension or extension, the IRS may collect the tax by levy or court proceeding until:",
      ja: "IRSは2022年6月1日に個人の所得税を適正に査定した。停止や延長がない場合、IRSが差押えまたは訴訟によりこの税を徴収できるのはいつまでか。",
      c: ["June 1, 2025", "June 1, 2028", "June 1, 2032", "There is no time limit on collection"],
      a: 2,
      ex: "徴収の時効は査定日から10年である。したがって2032年6月1日。3年は査定期間、6年は重大な脱漏時の査定期間と混同した誤り。",
    },
    {
      q: "Following a field examination, an individual receives a 30-day letter proposing a deficiency of $40,000 for one tax year. To obtain a conference with the IRS Independent Office of Appeals, the taxpayer generally must:",
      ja: "実地調査の後、個人は1課税年度について$40,000の不足税額を提案する30日レターを受け取った。IRS不服審査部(Appeals)との協議を得るため、納税者は原則として何をしなければならないか。",
      c: ["Pay the deficiency and file a claim for refund", "Submit a formal written protest within the time stated in the letter", "File a petition with the U.S. Tax Court", "Wait for the 90-day letter"],
      a: 1,
      ex: "提案額が$25,000を超える場合、Appealsでの協議を求めるには正式な書面による異議申立書(formal written protest)を提出する。$25,000以下なら簡易な申立て(small case request)で足りる。Tax Courtへの申立ては90日レター受領後の手続である。",
    },
    {
      q: "A taxpayer wants a jury to decide whether the IRS properly disallowed a deduction. Which course of action allows a jury trial?",
      ja: "納税者は、IRSが控除を否認したことの当否を陪審に判断してもらいたいと考えている。陪審審理が可能となる手続はどれか。",
      c: ["Pay the tax, file a refund claim, and after it is denied sue for a refund in U.S. District Court", "File a petition in the U.S. Tax Court without paying the tax", "Pay the tax and sue for a refund in the U.S. Court of Federal Claims", "Elect the small tax case procedure in the U.S. Tax Court"],
      a: 0,
      ex: "陪審審理が可能なのは連邦地方裁判所での還付訴訟のみであり、税の納付と還付請求の前置が必要。Tax Court(小額事件を含む)と連邦請求裁判所では陪審審理はない。",
    },
    {
      q: "A taxpayer loses a refund suit in the U.S. Court of Federal Claims. An appeal of the decision is heard by:",
      ja: "納税者は連邦請求裁判所(Court of Federal Claims)での還付訴訟に敗訴した。この判決に対する控訴を審理するのはどこか。",
      c: ["The U.S. Tax Court", "The U.S. Court of Appeals for the taxpayer's geographic circuit", "The U.S. District Court for the taxpayer's district", "The U.S. Court of Appeals for the Federal Circuit"],
      a: 3,
      ex: "連邦請求裁判所の判決は連邦巡回区控訴裁判所(Federal Circuit)へ控訴する。Tax Court(小額事件を除く)と連邦地方裁判所の判決は納税者の居住地を管轄する巡回区控訴裁判所へ控訴する。",
    },
    {
      q: "A taxpayer filed a proper claim for refund on March 1. The IRS has taken no action on the claim. The earliest date on which the taxpayer may file a refund suit in federal district court is:",
      ja: "納税者は3月1日に適正な還付請求を提出した。IRSは何の対応もしていない。納税者が連邦地方裁判所に還付訴訟を提起できる最も早い日はいつか。",
      c: ["Immediately after the claim is filed", "June 1", "September 1", "Only after the IRS issues a notice of disallowance"],
      a: 2,
      ex: "還付訴訟は、IRSが請求を否認した時、または請求提出後6か月を経過してもIRSが対応しない時に提起できる。3月1日から6か月後の9月1日。否認通知を受けた場合は通知日から2年以内に提訴しなければならない。",
    },
    {
      q: "In a court proceeding, each of the following taxpayers introduces credible evidence, has met substantiation requirements, maintained all required records, and cooperated with reasonable IRS requests. For which taxpayer will the burden of proof NOT shift to the IRS?",
      ja: "訴訟で、次の各納税者は信頼できる証拠を提出し、立証要件を満たし、必要な記録をすべて保持し、IRSの合理的な要請に協力した。立証責任がIRSに移転しないのはどの納税者か。",
      c: ["An individual with a net worth of $12 million", "A partnership with a net worth of $9 million", "A corporation with a net worth of $6 million", "A trust with a net worth of $2 million"],
      a: 1,
      ex: "法人・パートナーシップ・信託は純資産が$7,000,000を超えると立証責任の移転を受けられない。個人には純資産の制限はない。したがって純資産$9,000,000のパートナーシップのみ移転しない。",
    },
    {
      q: "The IRS asserts the civil fraud penalty against a taxpayer in a Tax Court proceeding. Which of the following correctly describes the burden of proof regarding fraud?",
      ja: "IRSはTax Courtの手続で納税者に民事不正ペナルティを主張している。不正に関する立証責任についての正しい記述はどれか。",
      c: ["The taxpayer must prove the absence of fraud by a preponderance of the evidence", "The IRS must prove fraud beyond a reasonable doubt", "The burden shifts to the IRS only if the taxpayer's net worth is under $7 million", "The IRS must prove fraud by clear and convincing evidence"],
      a: 3,
      ex: "民事不正ペナルティはIRSが明白かつ説得力ある証拠により立証しなければならない。「合理的な疑いを超える」は刑事事件の基準である。純資産の制限は一般的な立証責任移転の要件であり不正には関係しない。",
    },
    {
      q: "In determining whether a return position has substantial authority for purposes of the accuracy-related penalty, which of the following is NOT considered authority?",
      ja: "正確性関連ペナルティに関して申告ポジションに実質的根拠があるかを判断する際、根拠(authority)として考慮されないのはどれか。",
      c: ["An article in a respected tax journal", "A private letter ruling issued to another taxpayer", "A revenue procedure", "A congressional committee report"],
      a: 0,
      ex: "実質的根拠の判定では、法令・規則・レベニュールーリング/プロシージャ・判例・議会委員会報告書・他の納税者へのPLRやTAM等が根拠となる。専門誌の論文や論説、専門家の意見は根拠とならない。",
    },
    {
      q: "Which of the following statements regarding revenue rulings and private letter rulings is correct?",
      ja: "レベニュールーリングとプライベートレタールーリング(PLR)に関する記述のうち、正しいものはどれか。",
      c: ["A private letter ruling has the same precedential value as a revenue ruling", "A revenue ruling has the force and effect of law and binds the courts", "A private letter ruling may be relied on by any taxpayer with substantially similar facts", "A revenue ruling may be relied on by taxpayers whose facts are substantially the same, but a private letter ruling may be relied on only by the taxpayer who requested it"],
      a: 3,
      ex: "レベニュールーリングは内国歳入公報で公表され、事実関係が実質的に同じ納税者全員が依拠できる。PLRは請求した納税者のみに適用され、先例として引用できない。レベニュールーリングは裁判所を拘束しない。",
    },
    {
      q: "The IRS discovers a mathematical error on an individual's return that increases the tax due by $2,500 and sends a notice of additional tax due without first issuing a notice of deficiency. Which statement is correct?",
      ja: "IRSは個人の申告書に税額を$2,500増加させる計算誤りを発見し、不足税額通知を発出することなく追加納付通知を送付した。正しい記述はどれか。",
      c: ["The assessment is invalid because a 90-day letter must always precede an assessment", "The taxpayer may request abatement within 60 days, after which the IRS must follow normal deficiency procedures to assess", "The taxpayer must pay and sue for a refund to contest the adjustment", "The taxpayer may petition the Tax Court within 90 days of the notice"],
      a: 1,
      ex: "計算誤り・記載誤りは不足税額通知なしに略式査定できる。納税者は通知後60日以内に減額を請求でき、請求があればIRSは通常の不足税額手続(90日レター)によらなければ査定できない。",
    },
    {
      q: "A client sued its CPA firm for negligently failing to detect inventory shortages. The court found damages of $500,000 and determined that the client's own management was 40% at fault for ignoring internal control warnings. In a jurisdiction applying pure comparative negligence, the client can recover:",
      ja: "クライアントは、棚卸資産の不足を過失により発見できなかったとしてCPA事務所を訴えた。裁判所は損害額を$500,000と認定し、内部統制上の警告を無視したクライアント経営者に40%の過失があると判断した。純粋比較過失を適用する法域で、クライアントが回収できる額はいくらか。",
      c: ["$0", "$500,000", "$300,000", "$200,000"],
      a: 2,
      ex: "比較過失では損害額を原告の過失割合分減額する。500,000 × (1 − 40%) = 300,000。寄与過失(contributory negligence)を採用する法域なら原告に過失がある限り全く回収できず$0となる。",
    },
    {
      q: "A lender sues an auditor for negligence in a state that follows the near-privity approach of Credit Alliance (refining Ultramares). Which set of facts allows the lender to recover?",
      ja: "貸し手が、Credit Alliance判決(Ultramaresを精緻化したもの)の準直接契約関係(near-privity)アプローチを採用する州で、監査人を過失で訴えた。貸し手が回収できる事実関係はどれか。",
      c: ["The auditor knew the statements would be used for a particular purpose, the lender was a known party relying on them, and the auditor's conduct linked it to the lender showing it understood that reliance", "The lender's reliance on the audited statements was reasonably foreseeable", "The lender belongs to a class of persons such as trade creditors who commonly rely on audited statements", "The lender received the statements from the client and relied on them in good faith"],
      a: 0,
      ex: "Credit Alliance基準では、(1)特定目的での使用を監査人が知り、(2)既知の当事者が依拠し、(3)監査人とその当事者を結びつけ依拠の理解を示す行為が必要である。予見可能性や「類型的な利用者」は、それぞれForeseeabilityアプローチ・Restatementアプローチの考え方。",
    },
    {
      q: "A client told its CPA that the audited financial statements would be given to a bank to obtain a $2 million loan, but did not name the bank. The client later gave the statements to First Bank, which made the loan and suffered a loss due to the CPA's negligent audit. Under the Restatement (Second) of Torts §552 approach, the CPA is:",
      ja: "クライアントはCPAに対し、監査済財務諸表を$2百万の融資を受けるため銀行に提出すると伝えたが、銀行名は示さなかった。その後クライアントはFirst Bankに財務諸表を提出し、同行は融資を実行したが、CPAの過失監査が原因で損失を被った。Restatement (Second) of Torts §552のアプローチの下で、CPAはどうなるか。",
      c: ["Not liable, because First Bank was not specifically named", "Liable, because First Bank is within a limited class of users the CPA knew would rely on the statements for the transaction", "Liable only if the CPA acted with scienter", "Not liable, because only the client is in privity with the CPA"],
      a: 1,
      ex: "Restatementアプローチでは、監査人が利用を知っていた(意図された)限定的な利用者の範囲に属すれば、名前が特定されていなくても過失責任を負う。名指しを要するのはUltramares/near-privityの考え方である。",
    },
    {
      q: "An investor purchased a company's stock on a stock exchange after reading its audited financial statements, which were materially misstated because of the auditor's ordinary negligence. The auditor had no knowledge of the investor. Under which common-law approach is the investor most likely to recover?",
      ja: "投資家は監査済財務諸表を読んだうえで証券取引所で会社の株式を購入したが、財務諸表は監査人の通常の過失により重要な虚偽表示を含んでいた。監査人はこの投資家の存在を知らなかった。投資家が回収できる可能性が最も高いコモンロー上のアプローチはどれか。",
      c: ["The Ultramares approach", "The Restatement (Second) of Torts approach", "The near-privity approach", "The reasonably foreseeable user approach"],
      a: 3,
      ex: "Foreseeability(合理的に予見可能な利用者)アプローチでは、監査人が具体的に知らない第三者でも予見可能な利用者であれば通常の過失で責任を負う。Ultramares・near-privity・Restatementでは、未知の公開市場の投資家は通常の過失では回収できない。",
    },
    {
      q: "A third party sues an auditor for constructive fraud rather than actual fraud. Compared with actual fraud, the plaintiff in a constructive fraud action:",
      ja: "第三者が監査人を、現実の詐欺ではなく擬制詐欺(constructive fraud)で訴えた。現実の詐欺と比較して、擬制詐欺の訴訟における原告はどうか。",
      c: ["Need not prove the auditor's actual knowledge of falsity; reckless disregard for the truth (gross negligence) is sufficient", "Need not prove reliance on the financial statements", "Must be in privity of contract with the auditor", "Must prove the auditor intended to benefit personally from the misstatement"],
      a: 0,
      ex: "擬制詐欺(重過失)では、虚偽の認識(scienter)の代わりに真実に対する無謀な無視で足りる。依拠・因果関係・損害の立証は必要であり、責任は予見可能な第三者全般に及ぶため契約関係は不要。",
    },
    {
      q: "An auditor performed an audit in full compliance with generally accepted auditing standards but failed to detect an embezzlement concealed through collusion between the controller and an outside vendor using forged documents. If the client sues the auditor for negligence, the auditor is most likely:",
      ja: "監査人は一般に公正妥当と認められる監査基準に完全に準拠して監査を行ったが、経理部長と外部業者が偽造文書を用いて共謀し隠蔽した横領を発見できなかった。クライアントが監査人を過失で訴えた場合、監査人はどうなる可能性が最も高いか。",
      c: ["Liable, because an audit guarantees the detection of material fraud", "Liable for breach of contract regardless of due care", "Liable, because the client is in privity with the auditor", "Not liable, because compliance with professional standards demonstrates due care"],
      a: 3,
      ex: "監査は重要な虚偽表示について合理的保証を提供するもので、不正発見を保証しない。監査基準に従い正当な注意を払っていれば、巧妙な共謀・偽造による不正を発見できなくても通常は過失責任を負わない。",
    },
    {
      q: "Shares were offered to the public under a registration statement at $20 per share. An investor bought 1,000 shares in the aftermarket at $25 per share. The registration statement contained materially misstated audited financial statements, and the shares were worth $12 per share when the investor sued the auditor under Section 11 of the Securities Act of 1933. Assuming no defense applies, the investor's maximum recovery is:",
      ja: "株式は登録届出書に基づき1株$20で公募された。投資家は流通市場で1,000株を1株$25で購入した。登録届出書には重要な虚偽表示を含む監査済財務諸表が含まれており、投資家が1933年証券法第11条に基づき監査人を訴えた時点で株価は$12であった。抗弁が適用されないと仮定した場合、投資家の最大回収額はいくらか。",
      c: ["$13,000", "$8,000", "$5,000", "$12,000"],
      a: 1,
      ex: "第11条の損害額は、支払価額(ただし公募価格が上限)と提訴時の価値との差額である。(20 − 12) × 1,000 = 8,000。実際の購入価格$25を用いると$13,000となり誤り。",
    },
    {
      q: "An auditor's report on financial statements included in a registration statement is dated February 10, and the registration statement becomes effective on April 20. To establish the due diligence defense under Section 11 of the Securities Act of 1933, the auditor must show that, after reasonable investigation, it had reasonable grounds to believe the audited statements were true and not misleading as of:",
      ja: "登録届出書に含まれる財務諸表に対する監査報告書の日付は2月10日で、登録届出書は4月20日に効力発生した。1933年証券法第11条のデューデリジェンスの抗弁を立証するため、監査人は合理的な調査の結果、監査済財務諸表がいつの時点で真実で誤解を招かないと信じる合理的な根拠があったことを示さなければならないか。",
      c: ["The balance sheet date", "February 10, the date of the auditor's report", "April 20, the effective date of the registration statement", "The date the plaintiff purchased the shares"],
      a: 2,
      ex: "第11条のデューデリジェンスの抗弁は登録届出書の効力発生日を基準とする。そのため監査人は効力発生日まで後発事象のレビュー(S-1レビュー)を行う。監査報告書日や貸借対照表日は基準ではない。",
    },
    {
      q: "An investor bought shares in a public offering based on a prospectus containing financial statements audited by a CPA firm. The investor sues the CPA firm under Section 12(a)(2) of the Securities Act of 1933. The CPA firm will most likely:",
      ja: "投資家は、CPA事務所が監査した財務諸表を含む目論見書に基づき公募で株式を購入した。投資家はCPA事務所を1933年証券法第12条(a)(2)に基づき訴えた。CPA事務所はどうなる可能性が最も高いか。",
      c: ["Not be liable, because Section 12(a)(2) applies to persons who offer or sell securities, and auditors generally are not sellers", "Be liable, because Section 12(a)(2) imposes strict liability on all experts named in the prospectus", "Be liable only if the investor proves scienter", "Not be liable, because Section 12 applies only to securities exempt from registration"],
      a: 0,
      ex: "第12条(a)(2)は目論見書や口頭の勧誘で証券を募集・販売した者(売主)の責任を定めるもので、監査人は通常売主に当たらない。監査人の登録届出書上の責任は主に第11条で問われる。",
    },
    {
      q: "An investor purchased shares in a registered initial public offering but never read the registration statement. The audited financial statements in it were materially misstated because of the auditor's negligence (not recklessness). Which statement is correct?",
      ja: "投資家は登録された新規株式公開(IPO)で株式を購入したが、登録届出書は一度も読まなかった。そこに含まれる監査済財務諸表は監査人の過失(無謀ではない)により重要な虚偽表示を含んでいた。正しい記述はどれか。",
      c: ["The investor can recover under both Section 11 and Rule 10b-5", "The investor cannot recover under Section 11 because reliance must be proven", "The investor can recover under Rule 10b-5 but not Section 11", "The investor can recover under Section 11, but not under Rule 10b-5 because negligence does not establish scienter"],
      a: 3,
      ex: "第11条では原告は依拠も監査人の過失も立証不要で、重要な虚偽表示と損害を示せばよい(監査人側にデューデリジェンスの抗弁)。Rule 10b-5はscienter(故意または無謀)が必要で、単なる過失では責任を負わない。",
    },
    {
      q: "Under Section 18 of the Securities Exchange Act of 1934, which plaintiff is most likely able to sue the auditor of a company whose Form 10-K filed with the SEC contained materially misstated audited financial statements?",
      ja: "1934年証券取引所法第18条の下で、SECに提出されたForm 10-Kに重要な虚偽表示を含む監査済財務諸表があった会社の監査人を訴えることができる可能性が最も高い原告はどれか。",
      c: ["An investor who bought shares in reliance on the market price without reading the 10-K", "An investor who bought shares in an exempt private placement before the 10-K was filed", "An investor who read and relied on the 10-K and bought shares at a price affected by the misstatement", "Any shareholder who held shares during the year covered by the 10-K"],
      a: 2,
      ex: "第18条はSECに提出された書類の虚偽記載を対象とし、原告は当該書類を実際に読んで依拠したこと、価格がその虚偽に影響されたことを立証する必要がある(市場詐欺理論は使えない)。監査人は善意で虚偽を知らなかったことを抗弁にできる。",
    },
    {
      q: "A CPA is served with a federal grand jury subpoena for working papers and testimony relating to a client under investigation for criminal tax evasion. The CPA practices in a state that recognizes an accountant-client privilege by statute. The CPA:",
      ja: "CPAは、刑事脱税で捜査中のクライアントに関する調書と証言について連邦大陪審の召喚状を受けた。CPAが業務を行う州は法律で会計士・依頼人間の秘匿特権を認めている。CPAはどうなるか。",
      c: ["May refuse to comply because the state privilege applies in all courts", "Must comply, because there is no federal accountant-client privilege and the IRC §7525 privilege does not apply to criminal matters", "May refuse to comply under IRC §7525 because the advice concerned federal tax matters", "Must comply only with the request for working papers, not with the request for testimony"],
      a: 1,
      ex: "連邦法上は会計士・依頼人間の秘匿特権は認められず、州法上の特権は連邦事件では適用されない。§7525の秘匿特権も非刑事の税務事項に限られる。したがって調書提出と証言の双方に応じなければならない。",
    },
    {
      q: "A CPA firm holds the working papers from its audit of a client. Which of the following disclosures of the working papers requires the client's consent?",
      ja: "CPA事務所はクライアントの監査調書を保有している。次の調書の開示のうち、クライアントの同意を要するのはどれか。",
      c: ["Providing them to a bank considering a loan to the client", "Producing them in response to an enforceable subpoena", "Making them available for a peer review of the firm's practice", "Providing them to a state board of accountancy ethics investigation"],
      a: 0,
      ex: "調書はCPAが所有するが、そこに含まれる守秘情報は依頼人の同意なしに第三者(融資先の銀行等)へ開示できない。強制力ある召喚状、ピアレビュー、倫理調査への提出は同意不要の例外である。",
    },
    {
      q: "An accounting manager at a public company was demoted after reporting to the audit committee that revenue was being recognized fraudulently. Under the whistleblower provisions of Section 806 of the Sarbanes-Oxley Act, which statement is correct?",
      ja: "公開会社の経理マネージャーは、収益が不正に認識されていることを監査委員会に報告した後に降格された。サーベンス・オクスリー法第806条の内部告発者保護規定に関して、正しい記述はどれか。",
      c: ["The employee is protected only if the report was made directly to the SEC", "The employee must first sue in federal district court before any administrative complaint", "The employee may file a complaint with the Department of Labor (OSHA) within 180 days and may obtain reinstatement, back pay with interest and special damages including attorney fees", "Protection applies only if the alleged fraud is ultimately proven"],
      a: 2,
      ex: "SOX第806条は、社内(上司・監査委員会等)への報告も保護対象とし、違反から180日以内に労働省(OSHA)へ申立てができる。救済は復職、利息付バックペイ、弁護士費用等の特別損害である。不正が最終的に立証されなくても合理的な信念に基づく報告であれば保護される。",
    },
  ],
});

CPA.tbs({ id: "TBS-REG-10", section: "REG", chapter: "REG-01", title: "納税者ペナルティの計算(不提出・不納付・正確性関連・不正)",
  scenario: `<p>Mai Tanaka, an individual, did not request an extension. Her return was due April 15 and was filed on July 20 of the same year. Facts:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Tax shown on the return</td><td>$40,000</td></tr>
<tr><td>Income tax withheld during the year</td><td>$10,000</td></tr>
<tr><td>Balance due, paid in full with the return on July 20</td><td>$30,000</td></tr>
<tr><td>Correct tax liability determined on later IRS examination</td><td>$52,000</td></tr></table>
<p>Compute the failure-to-file and failure-to-pay penalties on the balance due shown on the return as filed (ignore the later deficiency and any minimum penalty for these two penalties). The understatement found on examination has no substantial authority, was not disclosed, and there is no reasonable cause. Fraud is not involved unless a row states otherwise.</p>
<p class="ja">個人のMai Tanakaは延長申請をしなかった。申告期限は4月15日で、同年7月20日に申告書を提出した。申告税額$40,000、源泉徴収額$10,000、未納額$30,000は7月20日の申告時に全額納付した。後のIRS調査で正しい税額は$52,000と判定された。不提出・不納付ペナルティは提出された申告書上の未納額に基づいて計算する(後の不足税額と最低ペナルティは無視)。調査での過少申告には実質的根拠も開示も合理的理由もない。行に別段の記載がない限り不正はない。</p>`,
  rows: [
    { label: "Number of months (including partial months) the return was late(遅延月数(端数月を含む))", type: "num", answer: 4 },
    { label: "Failure-to-pay penalty(不納付ペナルティ)", type: "num", answer: 600 },
    { label: "Failure-to-file penalty, after reduction for the failure-to-pay penalty(不納付ペナルティ控除後の不提出ペナルティ)", type: "num", answer: 5400 },
    { label: "Is the understatement found on examination a substantial understatement?(調査で判明した過少申告は重大な過少申告に該当するか)", type: "select", options: ["Yes", "No"], answer: "Yes" },
    { label: "Accuracy-related penalty on the understatement(過少申告に対する正確性関連ペナルティ)", type: "num", answer: 2400 },
    { label: "Civil fraud penalty if the entire understatement were instead attributable to fraud(過少申告全額が不正による場合の民事不正ペナルティ)", type: "num", answer: 9000 },
  ],
  explain: `<p>4月15日から7月20日までは3か月と5日であり、端数月は1か月とするため4か月。</p>
<p>不納付ペナルティ = 30,000 × 0.5% × 4 = 600。</p>
<p>不提出ペナルティ = 30,000 × 5% × 4 = 6,000。同じ月に不納付ペナルティが課されるため600を控除し5,400(合計6,000)。</p>
<p>過少申告額 = 52,000 − 40,000 = 12,000。基準は正しい税額の10%(5,200)と$5,000のいずれか大きい方で5,200。12,000 &gt; 5,200のため重大な過少申告に該当し、正確性関連ペナルティは20% × 12,000 = 2,400。</p>
<p>不正の場合は75% × 12,000 = 9,000(正確性関連ペナルティとは同じ部分に重複して課されない)。</p>`,
});

CPA.tbs({ id: "TBS-REG-11", section: "REG", chapter: "REG-01", title: "査定・還付・徴収の期間制限",
  scenario: `<p>Each of the following independent cases involves an individual's 2024 calendar-year federal income tax return, due April 15, 2025. No extensions of time to file were requested and no agreements to extend the statute of limitations were signed. For each case, select the date on which the relevant period expires.</p>
<table><tr><th>Case</th><th>Facts</th></tr>
<tr><td>A</td><td>Return filed March 3, 2025; no omission of income and no fraud. Period for the IRS to assess additional tax.</td></tr>
<tr><td>B</td><td>Return filed October 6, 2025; no omission of income and no fraud. Period for the IRS to assess additional tax.</td></tr>
<tr><td>C</td><td>Return filed April 15, 2025, reporting gross income of $200,000 (wages and interest only); $60,000 of gross income was omitted; no fraud. Period for the IRS to assess additional tax.</td></tr>
<tr><td>D</td><td>Return filed April 15, 2025, with intent to evade tax. Period for the IRS to assess additional tax.</td></tr>
<tr><td>E</td><td>Return filed March 3, 2025; all tax was paid through wage withholding. Latest date for the taxpayer to file a claim for refund that can recover the withheld tax.</td></tr>
<tr><td>F</td><td>Tax was properly assessed on June 30, 2026. Period for the IRS to collect the tax by levy or court proceeding.</td></tr></table>
<p class="ja">以下の独立したケースはいずれも、期限が2025年4月15日の個人の2024暦年連邦所得税申告書に関するものである。申告期限の延長申請も時効延長の合意もない。各ケースについて該当する期間の満了日を選択せよ。A:2025年3月3日提出、脱漏・不正なし(査定期間)。B:2025年10月6日提出、脱漏・不正なし(査定期間)。C:2025年4月15日提出、総所得$200,000(給与と利息のみ)を記載、総所得$60,000を脱漏、不正なし(査定期間)。D:2025年4月15日に脱税の意図をもって提出(査定期間)。E:2025年3月3日提出、税はすべて源泉徴収で納付(源泉税を回収できる還付請求の最終期限)。F:2026年6月30日に適正に査定(差押え・訴訟による徴収期間)。</p>`,
  rows: [
    { label: "Case A(ケースA)", type: "select", options: ["March 3, 2028", "April 15, 2028", "October 6, 2028", "April 15, 2031", "June 30, 2036", "No limitation"], answer: "April 15, 2028" },
    { label: "Case B(ケースB)", type: "select", options: ["March 3, 2028", "April 15, 2028", "October 6, 2028", "April 15, 2031", "June 30, 2036", "No limitation"], answer: "October 6, 2028" },
    { label: "Case C(ケースC)", type: "select", options: ["March 3, 2028", "April 15, 2028", "October 6, 2028", "April 15, 2031", "June 30, 2036", "No limitation"], answer: "April 15, 2031" },
    { label: "Case D(ケースD)", type: "select", options: ["March 3, 2028", "April 15, 2028", "October 6, 2028", "April 15, 2031", "June 30, 2036", "No limitation"], answer: "No limitation" },
    { label: "Case E(ケースE)", type: "select", options: ["March 3, 2028", "April 15, 2028", "October 6, 2028", "April 15, 2031", "June 30, 2036", "No limitation"], answer: "April 15, 2028" },
    { label: "Case F(ケースF)", type: "select", options: ["March 3, 2028", "April 15, 2028", "October 6, 2028", "April 15, 2031", "June 30, 2036", "No limitation"], answer: "June 30, 2036" },
  ],
  explain: `<p>A:期限前の提出は期限日(2025年4月15日)に提出したものとみなされ、3年後の2028年4月15日に満了。</p>
<p>B:期限後提出は実際の提出日から3年で2028年10月6日。</p>
<p>C:脱漏額60,000は記載総所得200,000の30%で25%を超えるため査定期間は6年となり2031年4月15日。</p>
<p>D:不正な申告書(および無申告)は期間制限がない。</p>
<p>E:還付請求は申告から3年または納付から2年のいずれか遅い日まで。源泉徴収税は期限日に納付したものとみなされ、早期提出も期限日提出とみなされるため2028年4月15日。</p>
<p>F:徴収期間は査定日から10年で2036年6月30日。</p>`,
});

CPA.tbs({ id: "TBS-REG-12", section: "REG", chapter: "REG-01", title: "監査人の第三者責任(コモンローと証券法)",
  scenario: `<p>Kato &amp; Co., CPAs, audited the financial statements of Rivera Corp. The statements were materially misstated, and Kato failed to detect the misstatement because of its <b>ordinary negligence</b> (not gross negligence or fraud) unless a case states otherwise. Kato cannot establish a due diligence defense. Each plaintiff relied on the statements (unless stated otherwise) and suffered losses caused by the misstatement. Determine whether Kato is liable to each plaintiff.</p>
<table><tr><th>Plaintiff</th><th>Facts</th></tr>
<tr><td>Ace Bank</td><td>Kato's engagement letter stated that the audit was being performed so that Ace Bank could decide on a loan to Rivera. Ace's state follows Ultramares/near-privity.</td></tr>
<tr><td>Baker Supply (Restatement state)</td><td>A trade creditor that Kato did not know about. Its state follows the Restatement (Second) of Torts §552.</td></tr>
<tr><td>Baker Supply (foreseeability state)</td><td>Same facts, but assume the state follows the reasonably foreseeable user approach.</td></tr>
<tr><td>Cole</td><td>Bought shares in Rivera's registered IPO, whose registration statement included the misstated statements; Cole never read them and sues under Section 11 of the 1933 Act.</td></tr>
<tr><td>Dunn</td><td>Bought Rivera shares on a stock exchange and sues under Rule 10b-5 of the 1934 Act.</td></tr>
<tr><td>Evans</td><td>A trade creditor unknown to Kato in a Restatement state; assume Kato's audit was performed with reckless disregard for the truth (gross negligence).</td></tr></table>
<p class="ja">Kato &amp; Co.(CPA事務所)はRivera社の財務諸表を監査した。財務諸表には重要な虚偽表示があり、別段の記載がない限りKatoは通常の過失(重過失・詐欺ではない)によりそれを発見できなかった。Katoはデューデリジェンスの抗弁を立証できない。各原告は(別段の記載がない限り)財務諸表に依拠し、虚偽表示による損失を被った。Ace Bank:契約書にAce Bankの融資判断のための監査と明記、州はUltramares/near-privity。Baker Supply:Katoが知らない取引債権者、州はRestatement §552(および、foreseeabilityの州と仮定した場合)。Cole:登録IPOで購入、財務諸表は読んでおらず第11条で提訴。Dunn:取引所で購入しRule 10b-5で提訴。Evans:Restatement州の未知の取引債権者だが、Katoは真実を無謀に無視した(重過失)。</p>`,
  rows: [
    { label: "Ace Bank(Ace Bank)", type: "select", options: ["Liable", "Not liable"], answer: "Liable" },
    { label: "Baker Supply — Restatement state(Baker Supply:Restatementの州)", type: "select", options: ["Liable", "Not liable"], answer: "Not liable" },
    { label: "Baker Supply — foreseeability state(Baker Supply:予見可能性の州)", type: "select", options: ["Liable", "Not liable"], answer: "Liable" },
    { label: "Cole — Section 11(Cole:第11条)", type: "select", options: ["Liable", "Not liable"], answer: "Liable" },
    { label: "Dunn — Rule 10b-5(Dunn:Rule 10b-5)", type: "select", options: ["Liable", "Not liable"], answer: "Not liable" },
    { label: "Evans — gross negligence(Evans:重過失)", type: "select", options: ["Liable", "Not liable"], answer: "Liable" },
  ],
  explain: `<p>Ace Bank:契約上の主たる受益者(既知の利用者)であり、Ultramares/near-privityでも過失責任を負う。</p>
<p>Baker Supply:Restatementでは監査人が知っていた限定的な利用者の範囲に限られるため、未知の取引債権者には通常の過失で責任を負わない。予見可能性アプローチなら合理的に予見可能な利用者として責任を負う。</p>
<p>Cole:第11条では依拠も過失も立証不要で、重要な虚偽表示と損害を示せばよい。監査人はデューデリジェンスの抗弁を立証できないため責任を負う。</p>
<p>Dunn:Rule 10b-5はscienter(故意または無謀)が必要で、通常の過失では責任を負わない。</p>
<p>Evans:重過失(擬制詐欺)は予見可能な第三者全般に責任が及ぶため、契約関係や既知性は不要。</p>`,
});
