// AUD の追加問題(SSARS・証明業務・政府監査・単一監査・コンフォートレター)

CPA.extend("AUD-05", {
  mcq: [
    {
      q: "A CPA is engaged under AR-C 70 to prepare a nonissuer's financial statements. Management refuses to allow a statement that \"no assurance is provided\" to appear on each page of the financial statements. Which action is appropriate for the CPA?",
      ja: "CPAはAR-C 70に基づき非公開企業の財務諸表の作成業務を受嘱した。経営者は、財務諸表の各ページに「保証は提供されない」旨の記載を入れることを拒否している。CPAの適切な対応はどれか。",
      c: [
        "Issue a disclaimer that makes clear that no assurance is provided on the financial statements",
        "Issue a review report because management's refusal converts the engagement into a review",
        "Complete the engagement without any legend or disclaimer, since no report is issued in a preparation engagement",
        "Express a qualified conclusion stating that the legend was omitted",
      ],
      a: 0,
      ex: "作成業務では各ページに「保証は提供されない」旨を記載するのが原則で、それができない場合は保証を提供しない旨を明確にするディスクレーマーを発行する(またはコンピレーション業務を行う/辞任する)。報告書を出さない業務だからといって何も表示しなくてよいわけではない。",
    },
    {
      q: "A CPA's spouse owns a material direct financial interest in a nonissuer client. The client asks the CPA to prepare its monthly financial statements under AR-C 70 for internal use. Which statement is correct?",
      ja: "CPAの配偶者が非公開企業の顧客に重要な直接的財務利害を有している。顧客は、内部利用目的の月次財務諸表をAR-C 70に基づき作成するようCPAに依頼した。正しい記述はどれか。",
      c: [
        "The CPA must decline because independence is impaired",
        "The CPA may perform the engagement but must issue a compilation report disclosing the lack of independence",
        "The CPA may perform the engagement, and independence need not be determined or disclosed",
        "The CPA may perform the engagement only if the spouse disposes of the interest before the statements are delivered",
      ],
      a: 2,
      ex: "作成業務(AR-C 70)は証明業務ではないため、独立性の判定・開示は求められない。独立性の欠如の開示が必要になるのはコンピレーション報告書を発行する場合である。",
    },
    {
      q: "Which of the following is required in a preparation engagement performed under AR-C 70?",
      ja: "AR-C 70に基づく作成業務において求められるものはどれか。",
      c: [
        "A management representation letter dated as of the date the financial statements are delivered",
        "Inquiry and analytical procedures sufficient to obtain limited assurance",
        "A written report describing the accountant's responsibilities",
        "An engagement letter or other written agreement signed by the accountant and management (or those charged with governance)",
      ],
      a: 3,
      ex: "作成業務では、業務の条件について会計士と経営者(またはガバナンス責任者)が署名した書面の合意が必要である。経営者確認書や分析的手続はレビューの要件であり、作成業務では報告書も発行しない。",
    },
    {
      q: "A CPA who is not independent of a nonissuer issues a compilation report and elects to disclose the reasons for the lack of independence. Which statement is correct?",
      ja: "非公開企業から独立していないCPAがコンピレーション報告書を発行し、独立性欠如の理由を開示することを選択した。正しい記述はどれか。",
      c: [
        "The CPA may disclose only the most significant reason",
        "If the CPA discloses any reasons, all reasons for the lack of independence must be included",
        "Disclosing the reasons is prohibited; only the statement of lack of independence is permitted",
        "Disclosing the reasons converts the report into a review report",
      ],
      a: 1,
      ex: "AR-C 80では独立性欠如の理由の開示は任意だが、開示する場合はすべての理由を記載しなければならない。一部の理由だけを選んで記載すると利用者を誤導するおそれがあるためである。",
    },
    {
      q: "Management of a nonissuer elects to omit substantially all disclosures required by GAAP from financial statements the CPA has compiled. The omission is not intended to mislead users. The CPA's compilation report should:",
      ja: "非公開企業の経営者は、CPAがコンピレーションした財務諸表からGAAPが要求する開示のほぼすべてを省略することを選択した。省略は利用者を誤導する意図によるものではない。CPAのコンピレーション報告書はどうすべきか。",
      c: [
        "Include a paragraph stating that management has elected to omit substantially all disclosures and that, if included, they might influence the user's conclusions",
        "Express an adverse conclusion because the statements are not presented in accordance with GAAP",
        "Not be issued, because a compilation of statements omitting disclosures is prohibited",
        "Include the omitted disclosures in the report itself",
      ],
      a: 0,
      ex: "誤導の意図がなければ開示の大部分を省略した財務諸表のコンピレーションは可能で、報告書に「経営者が開示のほぼすべての省略を選択した」「開示されていれば利用者の結論に影響し得る」旨の段落を加える。報告書に開示自体を記載する必要はない。",
    },
    {
      q: "Supplementary information accompanies financial statements that a CPA compiled under AR-C 80. Which action is appropriate regarding the supplementary information?",
      ja: "CPAがAR-C 80に基づきコンピレーションした財務諸表に補足情報が添付されている。補足情報に関する適切な対応はどれか。",
      c: [
        "Express an opinion on whether the supplementary information is fairly stated in relation to the financial statements as a whole",
        "Ignore the supplementary information because compilation reports never address it",
        "Clarify, in an other-matter paragraph or a separate report, whether the CPA compiled the supplementary information and the degree of responsibility taken",
        "Perform review procedures on the supplementary information and provide limited assurance",
      ],
      a: 2,
      ex: "コンピレーションでは補足情報についてCPAがどの程度の責任を負うか(コンピレーションしたか否か)を、その他の事項段落または別個の報告書で明らかにする。「財務諸表全体との関連で適正」という意見は監査人が表明するものである。",
    },
    {
      q: "A CPA has completed a compilation of a nonissuer's December 31 financial statements on March 3. Management approved the statements on March 5, and the CPA delivered them on March 8. The compilation report should be dated:",
      ja: "CPAは非公開企業の12月31日付財務諸表のコンピレーションを3月3日に完了した。経営者は3月5日に財務諸表を承認し、CPAは3月8日に引き渡した。コンピレーション報告書の日付はいつにすべきか。",
      c: ["December 31", "March 3", "March 5", "March 8"],
      a: 1,
      ex: "コンピレーション報告書はコンピレーション手続を完了した日付とする(3月3日)。引渡日や期末日ではない。なお監査報告書・レビュー報告書は十分な証拠を入手した日以降の日付であり、経営者承認日と結び付く点と混同しやすい。",
    },
    {
      q: "While compiling a nonissuer's financial statements, a CPA identifies a material departure from GAAP. Management refuses to revise the statements, and the CPA concludes that withdrawal is not necessary. The CPA should:",
      ja: "非公開企業の財務諸表をコンピレーション中、CPAはGAAPからの重要な逸脱を発見した。経営者は修正を拒否し、CPAは辞任までは不要と判断した。CPAはどうすべきか。",
      c: [
        "Issue a compilation report with a qualified conclusion",
        "Issue an adverse opinion",
        "Issue a standard compilation report because a compilation provides no assurance",
        "Disclose the departure in a separate paragraph of the compilation report, including its effects if known",
      ],
      a: 3,
      ex: "コンピレーションでは結論を表明しないため「限定付結論」「否定的意見」はない。GAAP逸脱は報告書の別段落で開示し、影響額が判明していれば記載する。保証がないからといって逸脱を無視して標準報告書を出すのは誤りである。",
    },
    {
      q: "During a compilation, a CPA becomes aware that the accounting records supplied by management are incomplete. Management refuses to provide additional or revised information. The CPA should:",
      ja: "コンピレーション中、CPAは経営者から提供された会計記録が不完全であることに気づいた。経営者は追加情報や修正情報の提供を拒否している。CPAはどうすべきか。",
      c: [
        "Withdraw from the engagement and inform management of the reasons",
        "Perform audit procedures to obtain the missing information independently",
        "Issue a compilation report with a disclaimer paragraph",
        "Issue the compilation report and describe the incomplete records as a scope limitation",
      ],
      a: 0,
      ex: "コンピレーションで情報が不完全・誤りと気づいた場合、追加・修正情報を求め、経営者が拒否すれば辞任し理由を経営者に伝える。コンピレーションでは検証手続は求められず、範囲制約を記載した報告書という形式もない。",
    },
    {
      q: "In a review of a nonissuer's financial statements, the accountant's analytical procedures show that revenue increased 35% while accounts receivable and cash collections were essentially unchanged. The accountant should first:",
      ja: "非公開企業の財務諸表のレビューにおいて、分析的手続の結果、売上高が35%増加した一方で売掛金と現金回収額はほぼ横ばいであった。会計士がまず行うべきことはどれか。",
      c: [
        "Send positive confirmations to major customers",
        "Express a qualified conclusion because of the unexplained fluctuation",
        "Inquire of management about the fluctuation and evaluate whether the responses are reasonable and consistent with other information",
        "Test the operating effectiveness of controls over revenue recognition",
      ],
      a: 2,
      ex: "レビューは質問と分析的手続が中心で、予期しない変動はまず経営者に質問し回答の合理性を評価する。回答が不十分なら追加手続を行う。確認や内部統制の運用評価手続は監査手続であり、レビューでは通常求められない。",
    },
    {
      q: "In a review engagement under AR-C 90, the representation letter should be dated:",
      ja: "AR-C 90に基づくレビュー業務において、経営者確認書の日付はいつにすべきか。",
      c: [
        "As of the balance sheet date",
        "As of the date the engagement letter was signed",
        "As of the date the financial statements are delivered to the bank",
        "As of the date of the accountant's review report",
      ],
      a: 3,
      ex: "レビューの経営者確認書は、財務諸表に表示された全期間を対象とし、会計士のレビュー報告書の日付で作成する。貸借対照表日では報告書日までの後発事象等を網羅できない。",
    },
    {
      q: "During a review of a nonissuer's financial statements, management refuses to sign the representation letter requested by the accountant. The accountant should:",
      ja: "非公開企業の財務諸表のレビュー中、経営者は会計士が要求した経営者確認書への署名を拒否した。会計士はどうすべきか。",
      c: [
        "Issue a review report with a qualified conclusion",
        "Not issue a review report and withdraw from the review engagement",
        "Issue a review report that describes the refusal in an other-matter paragraph",
        "Issue a review report with a disclaimer of conclusion",
      ],
      a: 1,
      ex: "経営者確認書はレビューに不可欠な証拠であり、拒否された場合はレビューを完了できないためレビュー報告書は発行せず辞任する。レビューには「結論の不表明」という報告形態はなく、限定付結論にもできない。",
    },
    {
      q: "Which statement about materiality in a review engagement performed under AR-C 90 is correct?",
      ja: "AR-C 90に基づくレビュー業務における重要性について正しい記述はどれか。",
      c: [
        "The accountant should determine materiality for the financial statements as a whole and apply it in designing procedures and evaluating results",
        "Materiality is not considered because a review provides only limited assurance",
        "Materiality must be set at a lower amount than in an audit of the same entity",
        "Materiality is determined by management and communicated to the accountant",
      ],
      a: 0,
      ex: "レビューでも会計士は財務諸表全体の重要性を決定し、手続の立案と結果の評価に用いる。限定的保証であっても重要性は考慮され、監査より低く設定する必要もない。重要性は会計士の職業的判断で決める。",
    },
    {
      q: "In a review of a nonissuer's financial statements, the accountant concludes that the entity's failure to consolidate several variable interest entities is a departure from GAAP that is both material and pervasive. Under AR-C 90, the accountant's report should include:",
      ja: "非公開企業の財務諸表のレビューにおいて、会計士は複数の変動持分事業体を連結していないことが重要かつ広範なGAAP逸脱であると結論付けた。AR-C 90に基づき、会計士の報告書に含めるべきものはどれか。",
      c: [
        "A qualified conclusion with a Basis for Qualified Conclusion section",
        "A disclaimer of conclusion",
        "An adverse conclusion with a Basis for Adverse Conclusion section",
        "An unmodified conclusion with an emphasis-of-matter paragraph",
      ],
      a: 2,
      ex: "SSARS No. 25以降、レビュー報告書でも重要かつ広範な逸脱は否定的結論とし、その根拠区分を設ける。重要だが広範でない場合が限定付結論。レビューにおける結論の不表明はなく、強調事項段落ではGAAP逸脱を解消できない。",
    },
    {
      q: "In a review of a nonissuer's financial statements, the accountant concludes that substantial doubt exists about the entity's ability to continue as a going concern for a reasonable period of time, and the matter is adequately disclosed. The accountant's review report should:",
      ja: "非公開企業の財務諸表のレビューにおいて、会計士は合理的な期間にわたり継続企業として存続する能力に重要な疑義があると結論付け、その事項は適切に開示されている。レビュー報告書はどうすべきか。",
      c: [
        "Express a qualified conclusion",
        "Express an adverse conclusion",
        "Not be issued until the uncertainty is resolved",
        "Include an emphasis-of-matter paragraph, with the conclusion unmodified",
      ],
      a: 3,
      ex: "AR-C 90では、継続企業の前提に重要な疑義があり適切に開示されている場合、結論は無限定のまま強調事項段落を追加する。開示が適切であればGAAP逸脱ではないため、限定付・否定的結論にはならない。",
    },
    {
      q: "A nonissuer asks its CPA to perform a review of its financial statements for a bank loan. During planning, the CPA learns that a member of the engagement team holds a material direct financial interest in the client, and the threat cannot be reduced to an acceptable level. Which option is available to the CPA?",
      ja: "非公開企業が銀行借入のためにCPAに財務諸表のレビューを依頼した。計画段階で、業務チームの一員が顧客に重要な直接的財務利害を有しており、脅威を許容可能な水準まで低減できないことが判明した。CPAが選択できるものはどれか。",
      c: [
        "Issue the review report and disclose the lack of independence in the report",
        "Issue a compilation report that discloses the lack of independence",
        "Issue the review report with a qualified conclusion",
        "Issue a review report restricted to the bank's use",
      ],
      a: 1,
      ex: "レビューは独立性が必須で、独立性がなければレビュー報告書は発行できない。一方コンピレーションは独立性欠如を報告書で開示すれば実施できる。独立性欠如を開示したレビュー報告書や利用制限付きのレビュー報告書は認められない。",
    },
    {
      q: "A CPA is asked to compile pro forma financial information under AR-C 120 showing the effects of a planned acquisition on a nonissuer's historical financial statements. Which of the following is a condition for performing the engagement?",
      ja: "CPAは、計画中の買収が非公開企業の過去財務諸表に与える影響を示すプロフォーマ財務情報を、AR-C 120に基づきコンピレーションするよう依頼された。業務実施の条件となるものはどれか。",
      c: [
        "The historical financial statements on which the pro forma information is based have been compiled, reviewed, or audited",
        "The CPA must be independent of the entity",
        "The historical financial statements must have been audited by the CPA performing the compilation",
        "The pro forma information must be accompanied by a financial forecast for the next year",
      ],
      a: 0,
      ex: "AR-C 120では、プロフォーマ情報の基礎となる過去財務諸表がコンピレーション・レビュー・監査のいずれかを受けていることが条件である。コンピレーションなので独立性は不要で、監査済みである必要もない。",
    },
    {
      q: "A CPA is engaged under SSARS to compile a nonissuer's financial forecast. The forecast presented by management omits the summary of significant assumptions. The CPA should:",
      ja: "CPAはSSARSに基づき非公開企業の財務予測(フォーキャスト)のコンピレーションを受嘱した。経営者が提示した予測には重要な仮定の要約が含まれていない。CPAはどうすべきか。",
      c: [
        "Issue a compilation report that describes the omission in a separate paragraph",
        "Issue a compilation report restricted to management's use",
        "Add the summary of significant assumptions to the compilation report",
        "Not issue a compilation report on the forecast (decline or withdraw)",
      ],
      a: 3,
      ex: "予測財務情報では重要な仮定の要約が不可欠で、これを省略した予測についてはコンピレーション報告書を発行しない。過去財務諸表の開示省略と異なり、別段落での記載や利用制限で対処することはできない。",
    },
    {
      q: "A CPA is asked to perform a review of a nonissuer's interim financial information under AU-C 930. Which of the following is a condition for performing the engagement?",
      ja: "CPAは非公開企業の期中財務情報についてAU-C 930に基づくレビューを依頼された。業務実施の条件となるものはどれか。",
      c: [
        "The auditor's report on the latest annual financial statements must have contained an unmodified opinion",
        "The interim financial information must be presented in condensed form",
        "The CPA has been engaged to audit the entity's current-year financial statements or audited the latest annual financial statements",
        "The CPA must have tested the operating effectiveness of internal control during the interim period",
      ],
      a: 2,
      ex: "AU-C 930の期中レビューは、当年度の財務諸表監査を受嘱しているか直近年度の監査を行っており、内部統制を理解していることが前提である。前年の意見が無限定である必要はなく、要約形式も条件ではない。内部統制の運用評価手続も求められない。",
    },
    {
      q: "Which procedure would an auditor ordinarily perform in a review of a nonissuer's interim financial information under AU-C 930?",
      ja: "AU-C 930に基づく非公開企業の期中財務情報のレビューにおいて、監査人が通常実施する手続はどれか。",
      c: [
        "Confirming accounts receivable balances with customers",
        "Reading the minutes of meetings of stockholders and the board of directors",
        "Observing the client's interim physical inventory count",
        "Examining documentation supporting a sample of interim cash disbursements",
      ],
      a: 1,
      ex: "期中レビューの手続は分析的手続、質問、議事録の閲覧、期中財務情報と会計記録との照合、経営者確認書の入手などである。確認・実地棚卸の立会・証憑突合は監査の実証手続であり、レビューでは通常行わない。",
    },
    {
      q: "During a review of interim financial information under AU-C 930, the auditor identifies a significant deficiency in internal control. The auditor should:",
      ja: "AU-C 930に基づく期中財務情報のレビュー中、監査人は内部統制の重要な不備を識別した。監査人はどうすべきか。",
      c: [
        "Communicate the significant deficiency in writing to management and those charged with governance",
        "Ignore it because internal control is not evaluated in a review",
        "Modify the review report to disclose the significant deficiency",
        "Withdraw from the engagement",
      ],
      a: 0,
      ex: "期中レビューで識別した重要な不備・重大な欠陥は、経営者とガバナンス責任者に書面で伝達する。レビューは内部統制の評価を目的としないが、識別した不備を無視してよいわけではない。報告書の修正や辞任は不要である。",
    },
    {
      q: "In a review of a nonissuer's interim financial information under AU-C 930, the auditor concludes that the interim information contains a material departure from GAAP that management will not correct. The auditor should:",
      ja: "AU-C 930に基づく非公開企業の期中財務情報のレビューにおいて、監査人は経営者が修正しないGAAPからの重要な逸脱があると結論付けた。監査人はどうすべきか。",
      c: [
        "Issue an adverse opinion on the interim financial information",
        "Issue the standard review report because a review provides only limited assurance",
        "Withdraw immediately without communicating with anyone",
        "Modify the review report to describe the nature of the departure and, if practicable, its effects",
      ],
      a: 3,
      ex: "期中レビューでGAAP逸脱が修正されない場合、レビュー報告書を修正して逸脱の内容と(実務上可能なら)影響額を記載する。レビューで「意見」は表明しないため否定的意見は誤り。限定的保証でも重要な逸脱は報告に反映させる。",
    },
    {
      q: "An issuer files its quarterly report on Form 10-Q. Which statement about the interim financial statements included in the filing is correct?",
      ja: "公開会社が四半期報告書(Form 10-Q)を提出する。提出書類に含まれる期中財務諸表について正しい記述はどれか。",
      c: [
        "They must be audited by an independent registered public accounting firm",
        "No involvement of the independent auditor is required",
        "They must be reviewed by an independent registered public accounting firm before filing, but the review report generally need not be included",
        "They must be compiled by the independent auditor, and a compilation report must be filed",
      ],
      a: 2,
      ex: "SECは10-Qの期中財務諸表について、提出前に独立した登録会計事務所によるレビュー(PCAOB AS 4105)を要求するが、監査は要求せず、レビュー報告書の添付も原則不要である(レビュー実施に言及する場合を除く)。",
    },
    {
      q: "A practitioner is engaged by a company's management to perform an examination of the company's schedule of investment performance statistics. Management, which is the responsible party, refuses to provide a written assertion. Under the AICPA attestation standards, the practitioner should:",
      ja: "実施者は、会社の経営者から投資成績統計表の検証(examination)業務を受嘱した。責任当事者である経営者は書面によるアサーションの提出を拒否した。AICPA証明業務基準に基づき、実施者はどうすべきか。",
      c: [
        "Withdraw from the engagement when withdrawal is possible under applicable law or regulation",
        "Issue the report with a qualified opinion and restrict its use",
        "Issue the report directly on the subject matter with an unmodified opinion",
        "Convert the engagement to a review",
      ],
      a: 0,
      ex: "依頼当事者が責任当事者でもある検証業務で書面アサーションを拒否された場合、法令上可能であれば辞任する。依頼当事者が責任当事者でない場合は、報告書で拒否を開示し利用制限を付す対応となる点と区別する。",
    },
    {
      q: "A practitioner performs a review under AT-C 210 of a company's statement of greenhouse gas emissions, measured against a widely recognized protocol. No material modifications are identified. The practitioner's conclusion should state that:",
      ja: "実施者は、広く認められたプロトコルを規準として測定された会社の温室効果ガス排出量報告書について、AT-C 210に基づくレビューを行った。重要な修正事項は識別されなかった。実施者の結論はどう記載すべきか。",
      c: [
        "The statement is presented fairly, in all material respects, in accordance with the protocol",
        "The practitioner is not aware of any material modifications that should be made to the statement for it to be in accordance with the protocol",
        "The practitioner performed the procedures agreed to by management and reports the findings",
        "No assurance is provided on the statement",
      ],
      a: 1,
      ex: "証明業務のレビューは限定的保証であり、「重要な修正が必要な事項に気づかなかった」という消極的形式の結論を表明する。「適正に表示」は検証(合理的保証)の意見、手続と発見事項の報告はAUPである。",
    },
    {
      q: "Under AT-C 215 (as revised by SSAE No. 19), which description of a procedure is appropriate for an agreed-upon procedures report?",
      ja: "AT-C 215(SSAE No. 19による改訂後)において、合意された手続の報告書に記載する手続の説明として適切なものはどれか。",
      c: [
        "We reviewed the schedule of expenses for reasonableness.",
        "We checked the accuracy of the schedule of expenses.",
        "We obtained negative assurance that the schedule is free of material misstatement.",
        "We compared each amount in the schedule of expenses to the general ledger and found no exceptions.",
      ],
      a: 3,
      ex: "AUP報告書では手続と発見事項を具体的に記載し、定義なしに「レビューした」「チェックした」など曖昧な用語を用いない。AUPでは保証(消極的保証を含む)を提供しないため、消極的保証の表現も不適切である。",
    },
    {
      q: "Under AT-C 215 as revised by SSAE No. 19, which statement about the use of an agreed-upon procedures report is correct?",
      ja: "SSAE No. 19により改訂されたAT-C 215において、合意された手続の報告書の利用について正しい記述はどれか。",
      c: [
        "The report must always be restricted to the parties that agreed to the procedures",
        "The report may be used only by the engaging party",
        "The report is not required to be restricted, but the practitioner may include an alert restricting its use",
        "The report may be distributed only if the engaging party provides a written assertion",
      ],
      a: 2,
      ex: "SSAE 19によりAUP報告書は一般利用も可能となり、利用制限は必須でなくなった(実施者の判断で制限文言を付すことは可)。アサーションの入手もAUPでは不要である。",
    },
    {
      q: "In an agreed-upon procedures engagement, the practitioner compares 50 vendor invoices to purchase orders and finds two minor price differences totaling $40. The engaging party did not agree to any materiality threshold for reporting exceptions. The practitioner should:",
      ja: "合意された手続の業務で、実施者は50件の仕入先請求書を発注書と照合し、合計$40の軽微な価格差異を2件発見した。依頼当事者とは例外事項の報告に関する重要性の基準について合意していない。実施者はどうすべきか。",
      c: [
        "Omit the differences because they are clearly trivial",
        "Report both exceptions in the findings",
        "Report the differences only to management orally",
        "Express a qualified opinion on the invoices",
      ],
      a: 1,
      ex: "AUPでは、依頼当事者と重要性の定義を合意して報告書に記載した場合を除き、すべての例外事項を発見事項として報告する。少額だからといって省略はできず、意見も表明しない。",
    },
    {
      q: "A lender engages a practitioner to examine a borrower's schedule of eligible collateral. The borrower is the responsible party and refuses to provide a written assertion. Under the AICPA attestation standards, the practitioner should:",
      ja: "貸手が、借手の適格担保明細表の検証業務を実施者に依頼した。借手は責任当事者であり、書面アサーションの提出を拒否した。AICPA証明業務基準に基づき、実施者はどうすべきか。",
      c: [
        "Disclose the refusal in the report and restrict the use of the report to the engaging party",
        "Withdraw from the engagement in all cases",
        "Issue an adverse opinion on the schedule",
        "Issue an unmodified opinion without mentioning the refusal",
      ],
      a: 0,
      ex: "依頼当事者(貸手)と責任当事者(借手)が異なる場合、責任当事者がアサーションを拒否しても業務は継続でき、報告書で拒否を開示し利用を依頼当事者に制限する。辞任が求められるのは依頼当事者自身が責任当事者で拒否した場合である。",
    },
    {
      q: "In an examination under AT-C 205, the practitioner concludes that the subject matter is materially misstated and that the effect is not pervasive. Which reporting approach is appropriate?",
      ja: "AT-C 205に基づく検証業務において、実施者は対象事項に重要な虚偽表示があり、その影響は広範ではないと結論付けた。適切な報告の方法はどれか。",
      c: [
        "Express an unmodified opinion on management's assertion and add an emphasis paragraph",
        "Express an adverse opinion on management's assertion",
        "Issue a disclaimer of opinion",
        "Express a qualified opinion, reporting directly on the subject matter rather than on the assertion",
      ],
      a: 3,
      ex: "検証業務で重要な虚偽表示により意見を修正する場合、アサーションではなく対象事項について直接報告し、広範でなければ限定付意見、広範なら否定的意見とする。結論の不表明は証拠不足(範囲制約)の場合である。",
    },
    {
      q: "A client asks its CPA firm to perform an agreed-upon procedures engagement under AT-C 215 on its royalty schedule. The firm's audit partner on the engagement has a material indirect financial interest in the client. Which statement is correct?",
      ja: "顧客が、ロイヤルティ明細表についてAT-C 215に基づく合意された手続の業務をCPA事務所に依頼した。業務を担当する監査パートナーは顧客に重要な間接的財務利害を有している。正しい記述はどれか。",
      c: [
        "Independence is not required because no opinion or conclusion is expressed",
        "The firm may perform the engagement if it discloses the lack of independence in the report",
        "Independence is required, so the firm cannot perform the engagement with this partner unless the impairment is eliminated",
        "Independence is required only if the report will be used by third parties",
      ],
      a: 2,
      ex: "AUPは保証を提供しないが証明業務であり、検証・レビューと同様に独立性が必要である。独立性欠如を開示して実施できるのはSSARSのコンピレーションのみで、AUPでは認められない。",
    },
    {
      q: "A practitioner examines a financial projection that management prepared to show the effects of a hypothetical plant expansion, for use in negotiating a loan with a single bank. The practitioner's examination report should:",
      ja: "実施者は、仮定の工場拡張の影響を示すために経営者が作成した財務計画(プロジェクション)を検証した。これは1つの銀行との借入交渉に使用される。実施者の検証報告書はどうすべきか。",
      c: [
        "Include an alert restricting the use of the report to the specified parties",
        "Be available for general use because the projection was examined",
        "State that the projection's results will be achieved",
        "Express limited assurance on the hypothetical assumptions",
      ],
      a: 0,
      ex: "プロジェクションは仮定(hypothetical)の前提に基づき、責任当事者と直接交渉する相手など限定された利用者向けであるため、報告書に利用制限の文言を含める。一般利用が可能なのはフォーキャストである。結果が達成されるとは記載しない。",
    },
    {
      q: "In an examination of a financial forecast under AT-C 305, the practitioner finds that the forecast fails to disclose an assumption that appears to be significant. Management refuses to add the disclosure. The practitioner should:",
      ja: "AT-C 305に基づく財務予測(フォーキャスト)の検証において、実施者は重要と思われる仮定が開示されていないことを発見した。経営者は開示の追加を拒否している。実施者はどうすべきか。",
      c: [
        "Express a qualified opinion",
        "Express an adverse opinion",
        "Issue an unmodified opinion with an emphasis paragraph",
        "Disclaim an opinion",
      ],
      a: 1,
      ex: "予測財務情報で重要と思われる仮定が開示されていない場合、提示がガイドラインに準拠していないとして否定的意見を表明する。仮定の欠落は予測全体の基礎を損なうため限定付意見では足りない。結論の不表明は範囲制約の場合である。",
    },
    {
      q: "A company's historical financial statements for the most recent year were reviewed, not audited. The company asks a practitioner to examine pro forma financial information under AT-C 310 based on those statements. The practitioner:",
      ja: "会社の直近年度の過去財務諸表は監査ではなくレビューを受けている。会社は、その財務諸表に基づくプロフォーマ財務情報についてAT-C 310に基づく検証を実施者に依頼した。実施者についての正しい記述はどれか。",
      c: [
        "May perform the examination because pro forma information is a separate subject matter",
        "May perform the examination only if management provides a written assertion",
        "Must decline any engagement on the pro forma information",
        "May perform only a review of the pro forma information, because assurance on it is limited to the level on the historical statements",
      ],
      a: 3,
      ex: "プロフォーマ情報に対する保証水準は基礎となる過去財務諸表の保証水準を超えられない。過去財務諸表がレビューのみなら、プロフォーマ情報もレビューまでで、検証は行えない。業務自体を断る必要はない。",
    },
    {
      q: "A state agency asks a CPA to provide assurance on a nonissuer's compliance with the specified requirements of a state grant. Under AT-C 315, which engagement may the CPA NOT accept?",
      ja: "州政府機関が、非公開企業の州補助金の特定要件への準拠についてCPAに保証を求めた。AT-C 315に基づき、CPAが受嘱できない業務はどれか。",
      c: [
        "An examination of the entity's compliance with the specified requirements",
        "An agreed-upon procedures engagement on compliance with the specified requirements",
        "A review of the entity's compliance with the specified requirements",
        "An examination of internal control over compliance in conjunction with an examination of compliance",
      ],
      a: 2,
      ex: "AT-C 315では、法令等の特定要件への準拠について検証またはAUPは実施できるが、レビュー(限定的保証)は受嘱してはならない。準拠性の検証に関連した内部統制の検証は可能である。",
    },
    {
      q: "Under SSAE No. 21, which characteristic distinguishes a direct examination engagement from an assertion-based examination?",
      ja: "SSAE No. 21において、直接検証業務(direct examination)をアサーションに基づく検証業務と区別する特徴はどれか。",
      c: [
        "The practitioner measures or evaluates the underlying subject matter against the criteria",
        "The practitioner provides only limited assurance",
        "The practitioner need not be independent",
        "The report is always restricted to management's use",
      ],
      a: 0,
      ex: "直接検証では、実施者自身が規準に照らして対象事項を測定・評価し、その結果について合理的保証の意見を表明する。保証水準は通常の検証と同じ合理的保証で、独立性も必要である。",
    },
    {
      q: "A company engages a practitioner to examine its sustainability report on water usage. The criteria were developed by management specifically for the company and are available only to the company's lender, which is the intended user. Which statement is correct?",
      ja: "会社は水使用量に関するサステナビリティ報告書の検証を実施者に依頼した。規準は経営者が会社専用に作成したもので、想定利用者である貸手のみが入手できる。正しい記述はどれか。",
      c: [
        "The practitioner must decline because only criteria issued by a standard setter are suitable",
        "The practitioner may issue a general-use report because the criteria were developed by management",
        "The engagement must be performed as a review rather than an examination",
        "The criteria may be suitable, but the use of the report should be restricted to the parties who have access to the criteria",
      ],
      a: 3,
      ex: "規準は適合性(関連性・客観性・測定可能性・完全性)があれば経営者が作成したものでもよいが、特定の当事者しか入手できない場合は報告書の利用をその当事者に制限する。基準設定主体の規準に限る、という制約はない。",
    },
    {
      q: "In a financial audit performed under Government Auditing Standards (GAGAS), the auditor identifies a significant deficiency in internal control over financial reporting. Which statement about reporting is correct?",
      ja: "政府監査基準(GAGAS)に基づく財務諸表監査において、監査人は財務報告に係る内部統制の重要な不備を識別した。報告について正しい記述はどれか。",
      c: [
        "The auditor must express an opinion on the effectiveness of internal control",
        "The auditor includes the deficiency in the GAGAS report on internal control over financial reporting and on compliance, which describes the scope and results of testing without an opinion",
        "The deficiency is communicated orally only, because GAGAS does not require written reporting on internal control",
        "The deficiency must be reported only if it is a material weakness",
      ],
      a: 1,
      ex: "GAGAS財務諸表監査では、財務報告に係る内部統制と法令・契約・補助金合意事項の準拠性に関する報告書を作成し、テストの範囲と結果(重要な不備・重大な欠陥を含む)を記載するが、内部統制の有効性について意見は表明しない。",
    },
    {
      q: "A GAGAS auditor documents the following: \"In 9 of 40 sampled travel vouchers, payments were made without the required supervisory approval.\" This statement represents which element of a finding?",
      ja: "GAGAS監査人は「サンプル40件の出張旅費伝票のうち9件で、必要な上司の承認なく支払が行われていた」と記録した。この記述は発見事項のどの要素に該当するか。",
      c: ["Criteria", "Cause", "Condition", "Effect"],
      a: 2,
      ex: "発見事項の要素は規準(あるべき姿)、状況(実際に存在する事実)、原因、影響である。サンプルで実際に観察された事実は「状況(condition)」。承認を求める規程そのものが規準にあたる。",
    },
    {
      q: "A GAGAS auditor notes that the supervisor responsible for approving travel vouchers had resigned and the position remained vacant for five months, so no one was assigned to perform approvals. In the structure of a finding, this information represents the:",
      ja: "GAGAS監査人は、出張旅費伝票の承認担当上司が退職し、その職が5か月間空席のままで承認担当者が割り当てられていなかったことに気づいた。発見事項の構成上、この情報はどの要素に該当するか。",
      c: ["Cause", "Criteria", "Condition", "Effect"],
      a: 0,
      ex: "原因(cause)は規準と状況の差異が生じた理由を示す要素であり、担当者不在により承認が行われなかったことがそれにあたる。影響(effect)は差異から生じた結果(不正な支払のリスク・損失など)である。",
    },
    {
      q: "During a two-year period, a GAGAS auditor completed 88 hours of CPE, including at least 20 hours in each year. Of the 88 hours, 18 directly related to government auditing, the government environment, or the auditee's specific environment. Which statement is correct?",
      ja: "2年間にGAGAS監査人は合計88時間のCPEを修了し、各年に少なくとも20時間を修了した。88時間のうち18時間が政府監査、政府環境、または被監査体固有の環境に直接関連するものであった。正しい記述はどれか。",
      c: [
        "The auditor meets the requirement because the 80-hour total is exceeded",
        "The auditor meets the requirement because at least 20 hours were completed each year",
        "The auditor does not meet the requirement because 40 hours of government-related CPE are required",
        "The auditor does not meet the requirement because at least 24 hours must directly relate to government auditing or the government environment",
      ],
      a: 3,
      ex: "GAGASのCPE要件は2年で80時間(各年20時間以上)かつそのうち24時間以上が政府監査・政府環境等に直接関連すること。合計88時間でも政府関連が18時間では6時間不足する。40時間という要件はない。",
    },
    {
      q: "Under Government Auditing Standards, an audit organization performing GAGAS engagements must:",
      ja: "政府監査基準において、GAGAS業務を実施する監査組織に求められることはどれか。",
      c: [
        "Obtain an external peer review at least once every three years",
        "Obtain an external peer review annually",
        "Obtain an external peer review only if it audits federal awards above $1,000,000",
        "Rely solely on internal monitoring, since peer review is optional under GAGAS",
      ],
      a: 0,
      ex: "GAGASでは、監査組織は品質管理システムについて少なくとも3年に1度外部のピアレビューを受けなければならない。毎年ではなく、連邦補助金の金額にも関係しない。",
    },
    {
      q: "Before issuing a GAGAS financial audit report that includes findings, the auditor should do which of the following regarding the views of responsible officials?",
      ja: "発見事項を含むGAGAS財務諸表監査報告書を発行する前に、責任ある当局者の見解について監査人は何をすべきか。",
      c: [
        "Nothing, because management's responses are not part of a GAGAS report",
        "Obtain only oral comments and keep them in the working papers",
        "Obtain and report the views of responsible officials concerning the findings, conclusions, and recommendations, including planned corrective actions",
        "Allow responsible officials to edit the findings before issuance",
      ],
      a: 2,
      ex: "GAGASでは、発見事項・結論・勧告に対する責任ある当局者の見解(是正措置計画を含む)を入手し報告書に含める。見解の入手は書面が望ましく、当局者に発見事項を編集させるわけではない。",
    },
    {
      q: "A nonprofit organization expended $950,000 of federal awards during its fiscal year. Assume the Uniform Guidance single audit threshold is $1,000,000 of federal awards expended. Which statement is correct?",
      ja: "ある非営利組織は当会計年度に連邦補助金$950,000を支出した。ユニフォーム・ガイダンスの単一監査の基準額は連邦補助金支出額$1,000,000とする。正しい記述はどれか。",
      c: [
        "A single audit is required because federal awards were received",
        "The organization is exempt from a single audit for the year but must make records available for review by federal agencies and pass-through entities",
        "A program-specific audit is required for each federal program",
        "A single audit is required if any program exceeds $250,000",
      ],
      a: 1,
      ex: "単一監査は連邦補助金の「支出額」が基準額($1,000,000)以上の場合に必要で、$950,000では不要である。ただし連邦機関・パススルー機関等によるレビューのため記録を利用可能にしておく必要がある。受領額や個別プログラム額で判定するのではない。",
    },
    {
      q: "In a single audit, total federal expenditures are $20,000,000, and the Type A threshold is $1,000,000. Which of the following Type A programs must be audited as a major program?",
      ja: "単一監査において、連邦支出総額は$20,000,000、タイプA基準額は$1,000,000である。次のタイプAプログラムのうち、主要プログラムとして監査しなければならないものはどれか。",
      c: [
        "Program K ($6,000,000), audited as a major program last year with no audit findings",
        "Program L ($1,400,000), audited as a major program in the prior year with no audit findings",
        "Program M ($3,000,000), audited as a major program last year with a material weakness in internal control over compliance reported",
        "Program N ($2,000,000), audited as a major program two years ago with no findings and with no significant changes in personnel or systems",
      ],
      a: 2,
      ex: "直近2監査期間のいずれかで主要プログラムとして監査され、直近の監査期間に重大な欠陥・遵守意見の修正・プログラム支出額の5%超の質問費用がないタイプAは低リスクと判定できる。前年に重大な欠陥が報告されたMは低リスクではない(高リスク)ため主要プログラムとして監査する。",
    },
    {
      q: "In a single audit, the auditor identified 8 Type A programs as low-risk. The auditor's risk assessment of Type B programs identified 5 high-risk Type B programs. Under the Uniform Guidance (option of auditing high-risk Type B programs), what is the minimum number of high-risk Type B programs that must be audited as major programs?",
      ja: "単一監査において、監査人は8つのタイプAプログラムを低リスクと判定した。タイプBプログラムのリスク評価の結果、高リスクのタイプBプログラムが5つ識別された。ユニフォーム・ガイダンスに基づき、主要プログラムとして監査しなければならない高リスクのタイプBプログラムの最少数はいくつか。",
      c: ["8", "5", "4", "2"],
      a: 3,
      ex: "主要プログラムとして監査する高リスクのタイプBプログラムは、低リスクのタイプAプログラム数の4分の1以上(8 × 1/4 = 2)でよい。識別した5つ全部や、低リスクのタイプA数(8)を監査する必要はない。",
    },
    {
      q: "An auditee that qualifies as a low-risk auditee expended $10,000,000 of federal awards. Under the percentage-of-coverage rule, the major programs audited must encompass federal expenditures of at least:",
      ja: "低リスク被監査体の要件を満たす被監査体が連邦補助金$10,000,000を支出した。カバー率ルールに基づき、監査する主要プログラムの連邦支出額は少なくともいくら以上でなければならないか。",
      c: ["$2,000,000", "$4,000,000", "$5,000,000", "$1,000,000"],
      a: 0,
      ex: "主要プログラムのカバー率は通常40%以上だが、低リスク被監査体は20%以上でよい。$10,000,000 × 20% = $2,000,000。$4,000,000は低リスクでない場合の40%を適用した誤りである。",
    },
    {
      q: "Which of the following would prevent an auditee from qualifying as a low-risk auditee under the Uniform Guidance for the current year?",
      ja: "ユニフォーム・ガイダンスにおいて、当年度に被監査体が低リスク被監査体の要件を満たさなくなる事項はどれか。",
      c: [
        "The auditee received a federal award from a new federal agency during the year",
        "In one of the two preceding years, the auditor's report on the financial statements included a going concern substantial doubt paragraph",
        "The auditee's federal expenditures increased by 15% from the prior year",
        "The auditee changed audit firms two years ago and single audits were performed in both preceding years",
      ],
      a: 1,
      ex: "低リスク被監査体の要件には、直前2年度に単一監査を受けていること、財務諸表・SEFAに無修正(in relation to)意見、GAAS上の重大な欠陥がないこと、継続企業の重要な疑義の記載がないことなどがある。継続企業の疑義の記載があれば要件を満たさない。支出額の増加や監査人交代は要件に関係しない。",
    },
    {
      q: "In a single audit, the auditor tests the allowable costs compliance requirement for a major program and identifies known questioned costs of $9,000. Projecting the results to the population, likely questioned costs are $28,000. Assuming the Uniform Guidance reporting threshold of $25,000, the auditor should:",
      ja: "単一監査において、監査人は主要プログラムの許容費用の遵守要件をテストし、既知の質問費用$9,000を識別した。母集団に推定した可能性の高い質問費用は$28,000である。ユニフォーム・ガイダンスの報告基準額を$25,000とした場合、監査人はどうすべきか。",
      c: [
        "Not report the questioned costs because known questioned costs are below $25,000",
        "Report only the likely questioned costs in excess of $25,000, or $3,000",
        "Report the finding in the schedule of findings and questioned costs because likely questioned costs exceed $25,000",
        "Report the questioned costs only in a management letter",
      ],
      a: 2,
      ex: "主要プログラムの遵守要件の種類ごとに、既知または可能性の高い質問費用が$25,000を超える場合は指摘事項として報告する。既知額$9,000が基準未満でも、可能性の高い額$28,000が超えるため報告対象。超過額だけを報告するのではない。",
    },
    {
      q: "Which of the following is NOT included in the summary of the auditor's results in the schedule of findings and questioned costs of a single audit?",
      ja: "単一監査の指摘事項及び質問費用一覧表における「監査人の結果の要約」に含まれないものはどれか。",
      c: [
        "The type of report issued on compliance for major programs",
        "The dollar threshold used to distinguish between Type A and Type B programs",
        "Whether the auditee qualified as a low-risk auditee",
        "An opinion on the operating effectiveness of internal control over compliance",
      ],
      a: 3,
      ex: "結果の要約には財務諸表とその主要プログラム遵守に関する報告の種類、内部統制の重大な欠陥・重要な不備の有無、主要プログラムの名称、タイプA/B基準額、低リスク被監査体か否かなどを記載する。単一監査では遵守に係る内部統制について意見を表明しない。",
    },
    {
      q: "An auditee with a June 30 fiscal year-end receives the auditor's single audit reports on November 15. Under the Uniform Guidance, the data collection form and reporting package must be submitted to the Federal Audit Clearinghouse by:",
      ja: "6月30日決算の被監査体は11月15日に監査人の単一監査報告書を受領した。ユニフォーム・ガイダンスに基づき、データ収集様式と報告パッケージを連邦監査クリアリングハウスに提出する期限はいつか。",
      c: ["December 15", "March 31", "January 15", "December 31"],
      a: 0,
      ex: "提出期限は監査報告書受領後30日以内または期末後9か月以内のいずれか早い方である。11月15日+30日 = 12月15日、期末後9か月 = 3月31日なので12月15日。9か月だけを見ると3月31日と誤る。",
    },
    {
      q: "In a single audit, the auditor's opinion on compliance with federal statutes, regulations, and the terms and conditions of federal awards is expressed:",
      ja: "単一監査において、連邦法令および連邦補助金の条件への遵守に関する監査人の意見はどの単位で表明されるか。",
      c: [
        "On all federal programs taken together as a whole",
        "For each major program",
        "Only for programs with questioned costs exceeding $25,000",
        "Only for high-risk Type A programs",
      ],
      a: 1,
      ex: "単一監査では、コンプライアンス・サプリメント等で直接的かつ重要な影響を持ち得る遵守要件を判断し、主要プログラムごとに遵守に関する意見を表明する。全プログラム一括の意見ではない。",
    },
    {
      q: "In connection with a registration statement, an accountant is asked to comment in a comfort letter on unaudited condensed interim financial statements. The accountant has NOT performed a review of that interim information under AU-C 930. The accountant may:",
      ja: "登録届出書に関連して、会計士はコンフォートレターで未監査の要約期中財務諸表についてコメントするよう求められた。会計士はその期中情報についてAU-C 930に基づくレビューを実施していない。会計士が行えることはどれか。",
      c: [
        "Provide negative assurance on the interim financial statements",
        "Express an opinion on the interim financial statements",
        "Report only the procedures performed and the findings obtained, without negative assurance",
        "Provide negative assurance if the interim period is less than 135 days after year-end",
      ],
      a: 2,
      ex: "未監査の期中財務情報について消極的保証を提供できるのは、AU-C 930(またはPCAOB AS 4105)のレビューを実施した場合に限られる。レビューをしていなければ、実施した手続と発見事項の記載にとどまる。",
    },
    {
      q: "A comfort letter issued in connection with an underwritten securities offering is ordinarily addressed to:",
      ja: "引受を伴う証券募集に関連して発行されるコンフォートレターの宛先は通常どれか。",
      c: [
        "The Securities and Exchange Commission",
        "The entity and the underwriters (or other requesting parties with a due diligence defense)",
        "The general public that purchases the securities",
        "The entity's stockholders",
      ],
      a: 1,
      ex: "コンフォートレターは引受人のデュー・ディリジェンスを支援するもので、通常、企業と引受人(またはデュー・ディリジェンスの抗弁を有する依頼当事者)宛てとする。SECや一般投資家宛てではない。",
    },
    {
      q: "Which of the following is NOT appropriate for an accountant to include in a comfort letter to underwriters?",
      ja: "引受人宛てのコンフォートレターに会計士が含めることが適切でないものはどれか。",
      c: [
        "Negative assurance on the audited financial statements included in the registration statement",
        "A statement about the accountant's independence",
        "Negative assurance on unaudited interim financial information that the accountant reviewed under AU-C 930",
        "Procedures performed and findings on specified tables of financial data in the registration statement",
      ],
      a: 0,
      ex: "監査済み財務諸表には既に監査意見が表明されているため、コンフォートレターで監査済み財務諸表に消極的保証を与えることは不適切である。独立性の記載、レビュー済み期中情報への消極的保証、特定の数値への手続と発見事項の記載は認められる。",
    },
    {
      q: "A comfort letter has a cutoff date that is 150 days after the end of the most recent period for which the accountant performed an audit or a review. Regarding subsequent changes in specified financial statement items through the cutoff date, the accountant may:",
      ja: "コンフォートレターのカットオフ日は、会計士が監査またはレビューを行った直近の期間の末日から150日後である。カットオフ日までの特定の財務諸表項目の事後的変動について、会計士が行えることはどれか。",
      c: [
        "Provide negative assurance because the letter is dated within one year of the audit",
        "Express an opinion on the subsequent changes",
        "Provide negative assurance only on decreases in net income",
        "Report procedures performed and findings, but not provide negative assurance",
      ],
      a: 3,
      ex: "直近の監査・レビュー対象期間の末日から135日以上経過している場合、事後的変動について消極的保証は提供できず、手続と発見事項の記載に限られる。150日は135日を超えるため消極的保証は不可である。",
    },
    {
      q: "An auditor who audited a nonissuer's complete financial statements is engaged under AU-C 810 to report on summary financial statements derived from them. When the opinion is unmodified, it should state that the summary financial statements are:",
      ja: "非公開企業の完全な財務諸表を監査した監査人が、AU-C 810に基づき、それから抜粋された要約財務諸表について報告する業務を受嘱した。意見が無限定の場合、要約財務諸表について何と記載すべきか。",
      c: [
        "Consistent, in all material respects, with the audited financial statements from which they have been derived, in accordance with the applied criteria",
        "Presented fairly, in all material respects, in accordance with GAAP",
        "Free of material misstatement based on limited assurance procedures",
        "Accurate in all respects because they are derived from audited statements",
      ],
      a: 0,
      ex: "要約財務諸表には「適用した規準に従い、監査済み財務諸表とすべての重要な点において整合している」という意見を表明する。要約財務諸表はGAAPの開示をすべて含まないため「GAAPに準拠して適正に表示」とは言えない。",
    },
    {
      q: "An auditor issued an adverse opinion on a nonissuer's complete financial statements. The client asks the auditor to report on summary financial statements derived from those statements. Under AU-C 810, the auditor's report on the summary financial statements should:",
      ja: "監査人は非公開企業の完全な財務諸表に否定的意見を表明した。顧客は、それから抜粋した要約財務諸表について報告するよう監査人に依頼した。AU-C 810に基づき、要約財務諸表に関する報告書はどうすべきか。",
      c: [
        "Express an unmodified opinion because the summary statements are consistent with the audited statements",
        "Express a qualified opinion on the summary statements",
        "Express an adverse opinion on the summary statements",
        "State that, because of the significance of the matter in the auditor's report on the audited statements, it is inappropriate to express an opinion on the summary statements",
      ],
      a: 3,
      ex: "基礎となる監査済み財務諸表の報告書が否定的意見または意見不表明の場合、要約財務諸表について意見を表明することは不適切である旨と、その根拠を記載する。整合していても無限定意見とはできない。",
    },
    {
      q: "Under SQMS No. 2, for an audit engagement subject to an engagement quality review, the engagement partner may date the auditor's report:",
      ja: "SQMS No. 2において、審査(エンゲージメント・クオリティ・レビュー)の対象となる監査業務では、業務執行責任者はいつ監査報告書に日付を付すことができるか。",
      c: [
        "Before the engagement quality review begins, as long as the review is completed before the report is released",
        "Only after being notified by the engagement quality reviewer that the review is complete",
        "At any time, because the engagement quality review is performed after report release",
        "Only after the firm's annual monitoring inspection of the engagement is complete",
      ],
      a: 1,
      ex: "SQMS 2では、業務執行責任者は審査担当者から審査が完了した旨の通知を受けるまで報告書に日付を付してはならない。審査は報告書日付前に完了させる必要があり、報告書発行後の事後的なモニタリングとは異なる。",
    },
    {
      q: "Under SQMS No. 2, an individual who served as the engagement partner on an audit may serve as the engagement quality reviewer for that same engagement only after a cooling-off period of at least:",
      ja: "SQMS No. 2において、ある監査の業務執行責任者を務めた者が同じ業務の審査担当者になるには、少なくともどれだけのクーリングオフ期間が必要か。",
      c: ["1 year", "3 years", "2 years", "5 years"],
      a: 2,
      ex: "SQMS 2では、業務執行責任者を務めた者が同一業務の審査担当者となるには2年間のクーリングオフ期間が必要である(客観性の確保のため)。より長い期間を定める法令等がある場合はそれに従う。",
    },
  ],
});

CPA.tbs({ id: "TBS-AUD-27", section: "AUD", chapter: "AUD-05", title: "単一監査:主要プログラムの決定とカバー率",
  scenario: `<p>Riverside County expended <b>$12,000,000</b> of federal awards during the year. Assume the single audit threshold is $1,000,000 and the Type A threshold is <b>$1,000,000</b>. Riverside is <b>not</b> a low-risk auditee because a material weakness was reported in the prior year's financial statement audit.</p>
<table><tr><th>Program</th><th>Expenditures</th><th>Type</th><th>Auditor's risk assessment</th></tr>
<tr><td>P1</td><td>$3,000,000</td><td>A</td><td>Audited as major last year, no audit findings (low-risk)</td></tr>
<tr><td>P2</td><td>$2,000,000</td><td>A</td><td>Audited as major last year, no audit findings (low-risk)</td></tr>
<tr><td>P3</td><td>$1,500,000</td><td>A</td><td>Audited as major two years ago, no audit findings (low-risk)</td></tr>
<tr><td>P4</td><td>$1,200,000</td><td>A</td><td>Audited as major last year, no audit findings (low-risk)</td></tr>
<tr><td>P5</td><td>$2,500,000</td><td>A</td><td>Prior-year material noncompliance reported</td></tr>
<tr><td>P6</td><td>$800,000</td><td>B</td><td>High-risk</td></tr>
<tr><td>P7</td><td>$700,000</td><td>B</td><td>High-risk</td></tr>
<tr><td>Other Type B</td><td>$300,000</td><td>B</td><td>Below risk-assessment level</td></tr></table>
<p>The auditor elects to audit as major the minimum number of high-risk Type B programs and selects P6.</p>
<p class="ja">Riverside郡は当年度に連邦補助金$12,000,000を支出した。単一監査基準額とタイプA基準額はともに$1,000,000とする。前年度の財務諸表監査で重大な欠陥が報告されたため、低リスク被監査体ではない。各プログラムの支出額・タイプ・リスク評価は表のとおり(P1〜P4は低リスクのタイプA、P5は前年に重要な不遵守が報告されたタイプA、P6・P7は高リスクのタイプB)。監査人は高リスクのタイプBを最少数だけ主要プログラムとして監査することとし、P6を選択した。</p>`,
  rows: [
    { label: "Classification of P5(P5の区分)", type: "select", options: ["Low-risk Type A — need not be major", "High-risk Type A — must be audited as major", "Type B — not assessed", "Excluded from the single audit"], answer: "High-risk Type A — must be audited as major" },
    { label: "Number of low-risk Type A programs(低リスクのタイプAプログラムの数)", type: "num", answer: 4 },
    { label: "Minimum number of high-risk Type B programs to audit as major(主要プログラムとして監査する高リスクのタイプBの最少数)", type: "num", answer: 1 },
    { label: "Minimum federal expenditures that major programs must cover ($)(主要プログラムがカバーすべき連邦支出の最低額)", type: "num", answer: 4800000 },
    { label: "Shortfall in coverage after auditing P5 and P6 ($)(P5とP6を監査した場合のカバー不足額)", type: "num", answer: 1500000 },
    { label: "Smallest single additional program that eliminates the shortfall(不足を単独で解消する最小の追加プログラム)", type: "select", options: ["P1", "P3", "P4", "P7"], answer: "P3" },
  ],
  explain: `<p>P5は前年に重要な不遵守が報告されているため低リスクではなく、高リスクのタイプAとして必ず主要プログラムになる。</p>
<p>低リスクのタイプAはP1〜P4の4つ。高リスクのタイプBは低リスクのタイプA数の4分の1以上を監査すればよく、4 × 1/4 = 1(P6)。</p>
<p>低リスク被監査体ではないためカバー率は40%:12,000,000 × 40% = 4,800,000。P5 + P6 = 2,500,000 + 800,000 = 3,300,000 で、不足額は 4,800,000 − 3,300,000 = 1,500,000。</p>
<p>単独で1,500,000以上を満たす最小のプログラムはP3($1,500,000)。P4($1,200,000)やP7($700,000)では不足し、P1も条件を満たすが最小ではない。</p>`,
});

CPA.tbs({ id: "TBS-AUD-28", section: "AUD", chapter: "AUD-05", title: "SSARS・証明業務:状況に応じた報告形態の選択",
  scenario: `<p>Hale &amp; Co., CPAs, provides services to several nonissuer clients. For each independent situation, select the appropriate action or report. Each option may be used once, more than once, or not at all.</p>
<ol>
<li>Client A wants a review for its bank. Hale's engagement partner's spouse holds a material direct financial interest in Client A, and the threat cannot be eliminated. If a review is not possible, Client A will accept a compilation.</li>
<li>In a review of Client B, Hale identifies a material, but not pervasive, departure from GAAP that management will not correct.</li>
<li>In a review of Client C, substantial doubt about going concern exists and is adequately disclosed.</li>
<li>Client D asks Hale to compile financial statements from which management has elected to omit substantially all disclosures, with no intent to mislead.</li>
<li>Client E asks Hale to prepare financial statements for the owner's internal use; Hale is engaged under AR-C 70.</li>
<li>Client F asks Hale to perform agreed-upon procedures on its inventory schedule; a Hale partner on the engagement has a material financial interest in Client F that cannot be eliminated.</li>
</ol>
<p class="ja">Hale会計事務所は複数の非公開企業の顧客に業務を提供している。各状況(独立)について適切な対応または報告書を選択せよ。①A社が銀行向けにレビューを希望しているが、業務執行パートナーの配偶者がA社に重要な直接的財務利害を有し脅威を除去できない(レビューが不可能ならA社はコンピレーションを受け入れる)。②B社のレビューで、重要だが広範ではないGAAP逸脱があり経営者は修正しない。③C社のレビューで継続企業の前提に重要な疑義があり、適切に開示されている。④D社は、誤導の意図なく開示のほぼすべてを省略した財務諸表のコンピレーションを依頼。⑤E社はオーナーの内部利用目的の財務諸表作成をAR-C 70で依頼。⑥F社は棚卸資産明細表のAUPを依頼したが、担当パートナーがF社に重要な財務利害を有し除去できない。</p>`,
  rows: [
    { label: "Situation 1 — Client A(状況① A社)", type: "select", options: ["Unmodified review report", "Review report with qualified conclusion", "Review report with emphasis-of-matter paragraph", "Compilation report disclosing lack of independence", "Compilation report noting omission of substantially all disclosures", "No report; 'no assurance' statement on each page", "Decline or withdraw"], answer: "Compilation report disclosing lack of independence" },
    { label: "Situation 2 — Client B(状況② B社)", type: "select", options: ["Unmodified review report", "Review report with qualified conclusion", "Review report with emphasis-of-matter paragraph", "Compilation report disclosing lack of independence", "Compilation report noting omission of substantially all disclosures", "No report; 'no assurance' statement on each page", "Decline or withdraw"], answer: "Review report with qualified conclusion" },
    { label: "Situation 3 — Client C(状況③ C社)", type: "select", options: ["Unmodified review report", "Review report with qualified conclusion", "Review report with emphasis-of-matter paragraph", "Compilation report disclosing lack of independence", "Compilation report noting omission of substantially all disclosures", "No report; 'no assurance' statement on each page", "Decline or withdraw"], answer: "Review report with emphasis-of-matter paragraph" },
    { label: "Situation 4 — Client D(状況④ D社)", type: "select", options: ["Unmodified review report", "Review report with qualified conclusion", "Review report with emphasis-of-matter paragraph", "Compilation report disclosing lack of independence", "Compilation report noting omission of substantially all disclosures", "No report; 'no assurance' statement on each page", "Decline or withdraw"], answer: "Compilation report noting omission of substantially all disclosures" },
    { label: "Situation 5 — Client E(状況⑤ E社)", type: "select", options: ["Unmodified review report", "Review report with qualified conclusion", "Review report with emphasis-of-matter paragraph", "Compilation report disclosing lack of independence", "Compilation report noting omission of substantially all disclosures", "No report; 'no assurance' statement on each page", "Decline or withdraw"], answer: "No report; 'no assurance' statement on each page" },
    { label: "Situation 6 — Client F(状況⑥ F社)", type: "select", options: ["Unmodified review report", "Review report with qualified conclusion", "Review report with emphasis-of-matter paragraph", "Compilation report disclosing lack of independence", "Compilation report noting omission of substantially all disclosures", "No report; 'no assurance' statement on each page", "Decline or withdraw"], answer: "Decline or withdraw" },
  ],
  explain: `<p>① レビューは独立性が必要なため実施できない。コンピレーションなら独立性欠如を報告書で開示して実施できる。</p>
<p>② 重要だが広範でないGAAP逸脱はレビュー報告書で限定付結論(広範なら否定的結論)。</p>
<p>③ 継続企業の重要な疑義が適切に開示されていれば、結論は無限定のまま強調事項段落を追加する。</p>
<p>④ 誤導の意図がなければ開示省略のコンピレーションは可能で、省略の旨を報告書に記載する。</p>
<p>⑤ 作成業務(AR-C 70)は報告書を発行せず、各ページに「保証は提供されない」旨を表示する。独立性も不要。</p>
<p>⑥ AUPは証明業務で独立性が必要。独立性欠如を開示して実施する方法はないため、辞退(または辞任)する。</p>`,
});

CPA.tbs({ id: "TBS-AUD-29", section: "AUD", chapter: "AUD-05", title: "政府監査基準:発見事項の要素・CPE・質問費用",
  scenario: `<p>Martin, CPA, is performing a GAGAS financial audit and single audit of Lakeview City. The following items were noted:</p>
<ol>
<li>The federal grant agreement requires that equipment purchases over $5,000 be approved by the grant manager.</li>
<li>Of 30 equipment purchases sampled, 7 (totaling $64,000) lacked grant manager approval.</li>
<li>The grant manager's duties were reassigned to a new employee who was not informed of the approval requirement.</li>
<li>Unallowable equipment could be charged to the grant, and the City may have to repay the funds.</li>
</ol>
<p>Martin's CPE for the current two-year period: 62 hours in total (at least 20 hours each year), of which 16 hours directly relate to government auditing or the government environment.</p>
<p>For the allowable costs compliance requirement of a major program, known questioned costs are $12,000 and likely questioned costs are $27,000. Assume a reporting threshold of $25,000.</p>
<p class="ja">Martin CPAはLakeview市のGAGAS財務諸表監査と単一監査を実施している。①連邦補助金契約は$5,000超の備品購入について補助金担当者の承認を要求している。②サンプル30件の備品購入のうち7件(計$64,000)に承認がなかった。③補助金担当者の職務が承認要件を知らされていない新任職員に引き継がれていた。④許容されない備品が補助金に計上され、市が資金を返還しなければならない可能性がある。MartinのCPEは当2年間で合計62時間(各年20時間以上)、うち政府監査・政府環境に直接関連するものは16時間。主要プログラムの許容費用要件について、既知の質問費用は$12,000、可能性の高い質問費用は$27,000で、報告基準額は$25,000とする。</p>`,
  rows: [
    { label: "Item 1 — element of the finding(①の要素)", type: "select", options: ["Criteria", "Condition", "Cause", "Effect"], answer: "Criteria" },
    { label: "Item 2 — element of the finding(②の要素)", type: "select", options: ["Criteria", "Condition", "Cause", "Effect"], answer: "Condition" },
    { label: "Item 3 — element of the finding(③の要素)", type: "select", options: ["Criteria", "Condition", "Cause", "Effect"], answer: "Cause" },
    { label: "Item 4 — element of the finding(④の要素)", type: "select", options: ["Criteria", "Condition", "Cause", "Effect"], answer: "Effect" },
    { label: "Minimum additional CPE hours Martin needs, assuming all are government-related(すべて政府関連とした場合に必要な追加CPEの最少時間)", type: "num", answer: 18 },
    { label: "Reporting of the questioned costs(質問費用の報告)", type: "select", options: ["Not reported — known questioned costs are below $25,000", "Reported — likely questioned costs exceed $25,000", "Reported only in a management letter", "Reported only if known questioned costs exceed $25,000"], answer: "Reported — likely questioned costs exceed $25,000" },
  ],
  explain: `<p>①あるべき姿を示す契約上の要件は規準(criteria)、②実際に観察された事実は状況(condition)、③差異が生じた理由は原因(cause)、④差異から生じる結果・リスクは影響(effect)である。</p>
<p>CPE:合計80時間以上かつ政府関連24時間以上が必要。総時間の不足 = 80 − 62 = 18、政府関連の不足 = 24 − 16 = 8。追加分をすべて政府関連とすれば、18時間で両方を満たす(政府関連 16 + 18 = 34 ≥ 24)。8時間では合計70時間で不足する。</p>
<p>質問費用:既知または可能性の高い質問費用が$25,000を超えれば指摘事項として報告する。可能性の高い額$27,000が基準を超えるため報告対象。</p>`,
});
