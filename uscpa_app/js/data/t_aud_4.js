// AUD のTBS追加(監査報告書・SSARS・証明業務・単一監査・内部統制統合監査)
CPA.tbs({
  id: "TBS-AUD-60", section: "AUD", chapter: "AUD-05", title: "監査報告書ドラフトのレビュー(SAS 134 非公開企業)",
  scenario: `<p>You are the engagement manager reviewing a staff draft of the auditor's report for <b>Larkspur Inc.</b>, a privately held (nonissuer) manufacturer, for the year ended December 31, 2026. The audit was performed under GAAS and the opinion is unmodified. Bracketed segments [1]–[7] were flagged for your review.</p>
<p><b>Exhibit 1 — Engagement timeline</b></p>
<table><tr><th>Date</th><th>Event</th></tr>
<tr><td>March 3, 2027</td><td>Fieldwork substantially complete; open items: legal letter update, subsequent events review</td></tr>
<tr><td>March 10, 2027</td><td>Open items cleared; management approved the financial statements and signed the representation letter</td></tr>
<tr><td>March 17, 2027</td><td>Report delivered to the board</td></tr></table>
<p><b>Exhibit 2 — Draft report (excerpts)</b></p>
<p>[1] Title: "Report of Independent Registered Public Accounting Firm"<br>
[2] The first section of the report is headed "Basis for Opinion," followed by the "Opinion" section.<br>
[3] "We conducted our audit in accordance with the standards of the Public Company Accounting Oversight Board (United States)."<br>
[4] "We are independent of Larkspur Inc. in accordance with the rules of the Securities and Exchange Commission and the PCAOB."<br>
[5] "In preparing the financial statements, management is required to evaluate whether there are conditions or events, considered in the aggregate, that raise substantial doubt about Larkspur's ability to continue as a going concern within twelve months after the balance sheet date."<br>
[6] "Obtain an understanding of internal control relevant to the audit in order to express an opinion on the effectiveness of Larkspur Inc.'s internal control."<br>
[7] "We are required to communicate with those charged with governance regarding, among other matters, the planned scope and timing of the audit, significant audit findings, and certain internal control–related matters that we identified during the audit."<br>
Report date in draft: March 3, 2027.</p>
<p class="ja">非公開企業(nonissuer)Larkspur社の2026年12月31日終了年度の監査報告書ドラフト(無限定意見、GAAS準拠)をレビューする。展示1:3月3日に往査がほぼ完了(弁護士確認書の更新・後発事象の検討が未了)、3月10日に未了事項が解消し経営者が財務諸表を承認・経営者確認書に署名、3月17日に取締役会へ報告書を提出。展示2:[1]表題「独立登録会計事務所の報告書」、[2]最初の区分が「意見の根拠」で次に「意見」、[3]PCAOB基準に準拠して監査を実施した、[4]SECおよびPCAOBの規則に従い独立である、[5]継続企業の評価期間を「貸借対照表日後12か月」と記載、[6]内部統制の有効性について意見を表明するために内部統制を理解する、[7]統治責任者とのコミュニケーション(計画した範囲と時期、重要な発見事項、内部統制関連事項)、ドラフトの報告書日付は3月3日。</p>`,
  rows: [
    { label: "[1] Report title(表題)", type: "select", options: ["No change needed", "Independent Auditor's Report", "Auditor's Opinion on Financial Statements", "Report of Certified Public Accountants on Internal Control"], answer: "Independent Auditor's Report" },
    { label: "[2] Order of the first two sections(冒頭2区分の順序)", type: "select", options: ["No change needed", "Opinion section first, immediately followed by Basis for Opinion", "Management's Responsibilities first, then Opinion", "Auditor's Responsibilities first, then Opinion"], answer: "Opinion section first, immediately followed by Basis for Opinion" },
    { label: "[3] Standards referenced(準拠した基準)", type: "select", options: ["No change needed", "auditing standards generally accepted in the United States of America (GAAS)", "Statements on Standards for Attestation Engagements", "International Standards on Auditing only"], answer: "auditing standards generally accepted in the United States of America (GAAS)" },
    { label: "[4] Independence statement(独立性の記載)", type: "select", options: ["No change needed", "Delete — independence is not mentioned in a nonissuer report", "…required to be independent… and to meet our other ethical responsibilities, in accordance with the relevant ethical requirements relating to our audit", "…independent in accordance with the Sarbanes-Oxley Act of 2002"], answer: "…required to be independent… and to meet our other ethical responsibilities, in accordance with the relevant ethical requirements relating to our audit" },
    { label: "[5] Going concern evaluation period(継続企業の評価期間)", type: "select", options: ["No change needed", "within one year after the date that the financial statements are issued (or available to be issued)", "within a reasonable period of time, not to exceed one year beyond the balance sheet date", "within two years after the report date"], answer: "within one year after the date that the financial statements are issued (or available to be issued)" },
    { label: "[6] Internal control wording(内部統制の記述)", type: "select", options: ["No change needed", "…in order to design audit procedures that are appropriate in the circumstances, but not for the purpose of expressing an opinion on the effectiveness of internal control. Accordingly, no such opinion is expressed.", "…in order to provide limited assurance on internal control", "Delete — internal control is not mentioned in the auditor's report"], answer: "…in order to design audit procedures that are appropriate in the circumstances, but not for the purpose of expressing an opinion on the effectiveness of internal control. Accordingly, no such opinion is expressed." },
    { label: "[7] Communication with TCWG(統治責任者とのコミュニケーション)", type: "select", options: ["No change needed", "Delete — required only for issuers", "Replace with a statement on critical audit matters", "Move to the Basis for Opinion section"], answer: "No change needed" },
    { label: "Correct report date(正しい報告書日付)", type: "select", options: ["December 31, 2026", "March 3, 2027", "March 10, 2027", "March 17, 2027"], answer: "March 10, 2027" },
  ],
  explain: `<p>[1] 非公開企業の監査報告書の表題は「Independent Auditor's Report」である。「Report of Independent Registered Public Accounting Firm」はPCAOB(AS 3101)の発行体監査の表題である。</p>
<p>[2] SAS 134(AU-C 700)では「Opinion」区分を最初に置き、その直後に「Basis for Opinion」区分を置く。</p>
<p>[3] 非公開企業の監査はGAAS(米国で一般に公正妥当と認められる監査基準)に準拠する。PCAOB基準への言及は発行体の場合である。</p>
<p>[4] AU-C 700は「関連する職業倫理に関する規定に従って独立であり、その他の倫理上の責任を果たすことが求められている」旨の記載を求める。SEC・PCAOB規則への言及は発行体向けである。</p>
<p>[5] 米国GAAP(ASC 205-40)では、経営者は財務諸表の発行日(または発行可能日)から1年間を評価する。「貸借対照表日後12か月」は誤り(IFRS的な表現)である。</p>
<p>[6] 監査人は状況に応じた監査手続を立案するために内部統制を理解するのであって、内部統制の有効性に意見を表明するためではない。その旨と「そのような意見は表明しない」を明記する。</p>
<p>[7] 統治責任者とのコミュニケーションに関する記載はSAS 134で非公開企業の報告書にも求められており、修正不要である。</p>
<p>報告書日付:十分かつ適切な監査証拠(経営者による財務諸表の承認を含む)を入手した日より前であってはならない。未了事項が解消し経営者が承認した3月10日が正しい。経営者確認書も報告書日付と同日付となる。3月3日は証拠入手前、3月17日は単なる提出日である。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-61", section: "AUD", chapter: "AUD-05", title: "意見の修正判断グリッド(虚偽表示/範囲制約×重要/広範)",
  scenario: `<p>Hollis & Grant CPAs is completing audits of several nonissuer clients for the year ended December 31, 2026. For each independent situation below, determine the type of auditor's report (opinion) that should be issued. Assume each matter is the only matter affecting the report. Overall materiality for each engagement is shown.</p>
<table><tr><th>#</th><th>Client</th><th>Materiality</th><th>Situation</th></tr>
<tr><td>1</td><td>Avon Tools</td><td>$150,000</td><td>Management refuses to record a $420,000 impairment on a single idle production line. The misstatement affects only PP&E, impairment loss and net income.</td></tr>
<tr><td>2</td><td>Briar Holdings</td><td>$300,000</td><td>Management refuses to consolidate a subsidiary that represents 55% of consolidated assets and 60% of revenue, accounting for it at cost.</td></tr>
<tr><td>3</td><td>Cobalt Retail</td><td>$200,000</td><td>Auditor was engaged in February 2027; could not observe the year-end count of inventory (48% of total assets) and accounting records supporting receivables (22% of total assets) were destroyed. No alternative procedures were possible.</td></tr>
<tr><td>4</td><td>Delta Foods</td><td>$100,000</td><td>Investee's management refuses access to audited financial statements of a 30% equity-method investee carried at $650,000 (total assets $9 million). No alternative procedures possible.</td></tr>
<tr><td>5</td><td>Elm Logistics</td><td>$250,000</td><td>Management refuses to provide the written representations required by AU-C 580.</td></tr>
<tr><td>6</td><td>Fern Software</td><td>$120,000</td><td>A significant patent lawsuit is pending; the outcome cannot be estimated. The uncertainty is adequately disclosed; the auditor believes it is fundamental to users' understanding.</td></tr>
<tr><td>7</td><td>Grove Dental</td><td>$80,000</td><td>The CFO asked the auditor not to send positive confirmations for receivables ($900,000). The auditor obtained sufficient appropriate evidence through subsequent cash receipts and shipping documents.</td></tr></table>
<p class="ja">Hollis & Grant会計事務所が非公開企業各社の2026年度監査を完了しようとしている。各状況は独立しており、それぞれ報告書に影響する唯一の事項とする。1:単一の遊休生産ラインの減損$420,000(重要性$150,000)を計上拒否(影響は固定資産・減損損失・純利益のみ)。2:総資産の55%・売上の60%を占める子会社を連結せず原価法で処理。3:2月に契約、総資産の48%の棚卸資産の実地棚卸に立会えず、売掛金(総資産の22%)の記録も焼失、代替手続不能。4:持分法投資$650,000(総資産$900万)の監査済財務諸表が入手できず代替手続不能。5:経営者がAU-C 580の確認書の提供を拒否。6:特許訴訟の不確実性が適切に開示され、利用者の理解に基礎的と判断。7:CFOが売掛金の積極的確認を行わないよう依頼したが、入金・出荷記録で十分な証拠を入手した。</p>`,
  rows: [
    { label: "1 Avon Tools", type: "select", options: ["Unmodified", "Unmodified with emphasis-of-matter paragraph", "Qualified", "Adverse", "Disclaimer"], answer: "Qualified" },
    { label: "2 Briar Holdings", type: "select", options: ["Unmodified", "Unmodified with emphasis-of-matter paragraph", "Qualified", "Adverse", "Disclaimer"], answer: "Adverse" },
    { label: "3 Cobalt Retail", type: "select", options: ["Unmodified", "Unmodified with emphasis-of-matter paragraph", "Qualified", "Adverse", "Disclaimer"], answer: "Disclaimer" },
    { label: "4 Delta Foods", type: "select", options: ["Unmodified", "Unmodified with emphasis-of-matter paragraph", "Qualified", "Adverse", "Disclaimer"], answer: "Qualified" },
    { label: "5 Elm Logistics", type: "select", options: ["Unmodified", "Unmodified with emphasis-of-matter paragraph", "Qualified", "Adverse", "Disclaimer"], answer: "Disclaimer" },
    { label: "6 Fern Software", type: "select", options: ["Unmodified", "Unmodified with emphasis-of-matter paragraph", "Qualified", "Adverse", "Disclaimer"], answer: "Unmodified with emphasis-of-matter paragraph" },
    { label: "7 Grove Dental", type: "select", options: ["Unmodified", "Unmodified with emphasis-of-matter paragraph", "Qualified", "Adverse", "Disclaimer"], answer: "Unmodified" },
  ],
  explain: `<p>判断軸は「虚偽表示か範囲制約か」×「重要だが広範でない/重要かつ広範」である。虚偽表示:重要→限定、広範→不適正。範囲制約:重要→限定、広範→意見不表明。</p>
<p>1:$420,000は重要性$150,000を超えるが、影響は特定の勘定に限定され広範ではない虚偽表示 → 限定付適正意見(Qualified, except for)。</p>
<p>2:総資産55%・売上60%の子会社の非連結は財務諸表全体に及ぶ広範な虚偽表示 → 不適正意見(Adverse)。</p>
<p>3:総資産の48%+22%=70%について証拠が得られず代替手続も不能。重要かつ広範な範囲制約 → 意見不表明(Disclaimer)。</p>
<p>4:$650,000は重要性$100,000を超えるが総資産の約7%で影響は投資・持分法損益に限定 → 範囲制約による限定付意見。</p>
<p>5:AU-C 580では、経営者が要求された確認書を提供しない場合、経営者の誠実性に疑義が生じ影響が広範になり得るため、意見不表明(または契約解除)とする。</p>
<p>6:不確実性が適切に開示されていれば虚偽表示ではない。利用者の理解に基礎的な事項として強調事項区分(Emphasis-of-Matter)を付した無限定意見とする。</p>
<p>7:経営者による制約でも、代替手続で十分かつ適切な証拠を入手できれば範囲制約は解消され、無限定意見となる(なお、確認を行わない理由の合理性は検討する)。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-62", section: "AUD", chapter: "AUD-05", title: "追加区分の要否グリッド(強調事項・その他の事項・継続企業・KAM/CAM)",
  scenario: `<p>The professional practice group of Ridley CPAs is preparing a training grid. For each independent situation, select the paragraph or section that must (or, where the client has engaged the auditor to do so, will) be added to an otherwise unmodified auditor's report. "Issuer" engagements follow PCAOB AS 3101; all others follow GAAS (AU-C 700 series).</p>
<table><tr><th>#</th><th>Entity type</th><th>Situation</th></tr>
<tr><td>1</td><td>Nonissuer</td><td>The auditor concludes that substantial doubt about the entity's ability to continue as a going concern exists; management's plans do not alleviate it, and disclosure is adequate.</td></tr>
<tr><td>2</td><td>Issuer (large accelerated filer)</td><td>Valuation of goodwill was communicated to the audit committee, relates to a material account, and involved especially challenging, subjective auditor judgment.</td></tr>
<tr><td>3</td><td>Nonissuer</td><td>The entity's board engaged the auditor to communicate key audit matters in the report; revenue recognition for multi-element contracts was a matter of most significance.</td></tr>
<tr><td>4</td><td>Nonissuer</td><td>The entity changed its inventory method from LIFO to FIFO; the change is justified, properly accounted for (retrospective application), and has a material effect.</td></tr>
<tr><td>5</td><td>Nonissuer</td><td>Consolidating schedules accompany the basic financial statements; the auditor was engaged to report on them within the auditor's report.</td></tr>
<tr><td>6</td><td>Nonissuer</td><td>A fire destroyed the main plant in February 2027 (after year-end); it is adequately disclosed and the auditor considers it fundamental to users' understanding.</td></tr>
<tr><td>7</td><td>Nonissuer</td><td>The auditor identified a significant deficiency in internal control over purchasing and communicated it in writing to those charged with governance.</td></tr>
<tr><td>8</td><td>Issuer</td><td>A matter was communicated to the audit committee but did not involve especially challenging, subjective, or complex auditor judgment.</td></tr></table>
<p class="ja">Ridley会計事務所の研修用グリッドである。各状況について、無限定意見の報告書に追加が必要な(または依頼により記載する)段落・区分を選ぶ。発行体はPCAOB AS 3101、その他はGAAS。1:非公開企業で継続企業の前提に重要な疑義があり、経営者の対応策でも解消されず開示は適切。2:発行体(大規模早期提出会社)でのれん評価が監査委員会に伝達され、重要な勘定に関係し、特に困難で主観的な判断を要した。3:非公開企業で取締役会がKAMの報告を依頼。4:LIFOからFIFOへの正当な会計方針の変更(遡及適用・重要な影響)。5:連結精算表について報告書内で報告する契約。6:決算日後の工場火災が適切に開示され基礎的と判断。7:購買の重要な不備を書面で統治責任者へ伝達済み。8:発行体で監査委員会に伝達したが特に困難な判断を伴わない事項。</p>`,
  rows: [
    { label: "1", type: "select", options: ["Emphasis-of-matter paragraph", "Other-matter paragraph", "Separate going concern section", "Key audit matters section", "Critical audit matters section", "None required"], answer: "Separate going concern section" },
    { label: "2", type: "select", options: ["Emphasis-of-matter paragraph", "Other-matter paragraph", "Separate going concern section", "Key audit matters section", "Critical audit matters section", "None required"], answer: "Critical audit matters section" },
    { label: "3", type: "select", options: ["Emphasis-of-matter paragraph", "Other-matter paragraph", "Separate going concern section", "Key audit matters section", "Critical audit matters section", "None required"], answer: "Key audit matters section" },
    { label: "4", type: "select", options: ["Emphasis-of-matter paragraph", "Other-matter paragraph", "Separate going concern section", "Key audit matters section", "Critical audit matters section", "None required"], answer: "Emphasis-of-matter paragraph" },
    { label: "5", type: "select", options: ["Emphasis-of-matter paragraph", "Other-matter paragraph", "Separate going concern section", "Key audit matters section", "Critical audit matters section", "None required"], answer: "Other-matter paragraph" },
    { label: "6", type: "select", options: ["Emphasis-of-matter paragraph", "Other-matter paragraph", "Separate going concern section", "Key audit matters section", "Critical audit matters section", "None required"], answer: "Emphasis-of-matter paragraph" },
    { label: "7", type: "select", options: ["Emphasis-of-matter paragraph", "Other-matter paragraph", "Separate going concern section", "Key audit matters section", "Critical audit matters section", "None required"], answer: "None required" },
    { label: "8", type: "select", options: ["Emphasis-of-matter paragraph", "Other-matter paragraph", "Separate going concern section", "Key audit matters section", "Critical audit matters section", "None required"], answer: "None required" },
  ],
  explain: `<p>強調事項(EOM)は財務諸表に適切に表示・開示された事項への注意喚起、その他の事項(OM)は財務諸表に表示・開示されていない事項(監査・報告書に関する事項)の説明である。</p>
<p>1:SAS 134改正後のAU-C 570では、重要な疑義が存在する場合、「Substantial Doubt About the Entity's Ability to Continue as a Going Concern」という見出しの独立区分を設ける(強調事項ではない)。</p>
<p>2:発行体ではAS 3101により、監査委員会に伝達(または伝達が必要)され、重要な勘定・開示に関係し、特に困難・主観的・複雑な判断を伴った事項がCAMとなり、CAM区分に記載する。</p>
<p>3:非公開企業では、KAMの報告(AU-C 701)は監査人がその報告を依頼された場合にのみ行う。依頼があるためKAM区分を設ける。</p>
<p>4:AU-C 708により、重要な影響のある会計原則の変更が適切に処理されていても、首尾一貫性に関する強調事項区分が必要である。</p>
<p>5:AU-C 725により、補足情報について報告書内で報告する場合はその他の事項区分を用いる(別個の報告書でもよい)。補足情報は財務諸表の一部ではないためOMである。</p>
<p>6:適切に開示された重要な後発事象で利用者の理解に基礎的なもの → 強調事項区分。</p>
<p>7:重要な不備はAU-C 265により統治責任者に書面で伝達するが、財務諸表監査報告書には記載しない。</p>
<p>8:CAMの要件(特に困難・主観的・複雑な判断)を満たさないため記載不要。なお、CAMが一つもない場合はその旨を記載するが、本問の事項自体を追加する必要はない。</p>`,
});

CPA.tbs({
  id: "TBS-AUD-63", section: "AUD", chapter: "AUD-05", title: "比較財務諸表と前任監査人の報告",
  scenario: `<p>Baker & Lowe CPAs (successor) audited the financial statements of <b>Quill Corp.</b>, a nonissuer, for the year ended December 31, 2026. The 2025 financial statements, presented comparatively, were audited by Adams CPAs (predecessor), which issued an unmodified opinion dated March 6, 2026. Answer each question independently.</p>
<p><b>Exhibit — Situations</b></p>
<table><tr><th>#</th><th>Situation</th></tr>
<tr><td>A</td><td>Adams will not reissue its report on the 2025 statements.</td></tr>
<tr><td>B</td><td>Same as A. Baker's partner asks whether Adams may be named in Baker's report. Adams' practice was not acquired by Baker.</td></tr>
<tr><td>C</td><td>Quill asks Adams to reissue its report. Adams is deciding what it must do first.</td></tr>
<tr><td>D</td><td>Adams reissues; nothing came to its attention requiring revision of the 2025 statements or its report.</td></tr>
<tr><td>E</td><td>Alternative facts: Baker audited both years. In 2025 Baker issued a qualified opinion for a lease-accounting departure; in 2026 Quill restated 2025 to correct the departure.</td></tr>
<tr><td>F</td><td>Alternative facts: the 2025 statements were reviewed (not audited) by Adams under SSARS and are presented comparatively; Adams' review report is not reissued.</td></tr></table>
<p class="ja">後任監査人Baker & Lowe会計事務所が非公開企業Quill社の2026年度を監査した。比較表示される2025年度は前任監査人Adamsが監査し、2026年3月6日付で無限定意見を表明した。A:Adamsは2025年度の報告書を再発行しない。B:Aと同じ状況で、Bakerの報告書にAdamsの名称を記載できるか(BakerはAdamsの事務所を買収していない)。C:QuillがAdamsに報告書の再発行を依頼。D:Adamsが再発行し、修正を要する事項はなかった。E:別条件:Bakerが両年度を監査。2025年度はリース会計の逸脱で限定意見だったが、2026年に2025年度を修正再表示した。F:別条件:2025年度はAdamsがSSARSによるレビューを行ったもので比較表示され、レビュー報告書は再発行されない。</p>`,
  rows: [
    { label: "A: How Baker's report addresses 2025(Aの場合の2025年度の扱い)", type: "select", options: ["Baker expresses an opinion on both years", "Other-matter paragraph stating that 2025 was audited by a predecessor, the date and type of opinion, and reasons for any modification", "Emphasis-of-matter paragraph referring to Note 1", "No reference to 2025 is made"], answer: "Other-matter paragraph stating that 2025 was audited by a predecessor, the date and type of opinion, and reasons for any modification" },
    { label: "B: Naming the predecessor(前任監査人名の記載)", type: "select", options: ["Must be named", "Should not be named", "Named only if the predecessor's opinion was modified", "Named only with management's consent"], answer: "Should not be named" },
    { label: "C: Before reissuing, Adams should(再発行前の手続)", type: "select", options: ["Reaudit the 2025 financial statements", "Read the 2026 statements, compare 2025 as presented, and obtain representation letters from Baker and from management", "Obtain only an engagement letter from Quill", "Review Baker's 2026 working papers in full"], answer: "Read the 2026 statements, compare 2025 as presented, and obtain representation letters from Baker and from management" },
    { label: "D: Date of Adams' reissued report(再発行報告書の日付)", type: "select", options: ["March 6, 2026", "Date of Baker's 2026 report", "Dual dated: March 6, 2026 and Baker's report date", "Date Adams delivers the reissued report"], answer: "March 6, 2026" },
    { label: "E: Baker's report on restated 2025(修正再表示後の2025年度意見)", type: "select", options: ["Repeat the qualified opinion on 2025", "Unmodified opinion on 2025 with an other-matter paragraph disclosing the different prior opinion and the reasons", "Unmodified opinion on 2025 with no additional paragraph", "Disclaimer on 2025"], answer: "Unmodified opinion on 2025 with an other-matter paragraph disclosing the different prior opinion and the reasons" },
    { label: "F: Reviewed prior period(前期がレビューの場合)", type: "select", options: ["Other-matter paragraph stating the 2025 statements were reviewed, the date of the review report, that a review is substantially less in scope than an audit, and that no opinion is expressed", "Baker must audit 2025 before issuing its report", "Emphasis-of-matter paragraph only", "No statement is needed because a review provides limited assurance"], answer: "Other-matter paragraph stating the 2025 statements were reviewed, the date of the review report, that a review is substantially less in scope than an audit, and that no opinion is expressed" },
  ],
  explain: `<p>A:前任監査人の報告書が再発行されない場合、後任監査人はその他の事項区分で、前期は他の監査人が監査したこと、報告書の日付、意見の種類、修正意見の場合はその理由を記載する(AU-C 700)。Bakerの意見は2026年度のみが対象である。</p>
<p>B:前任監査人の名称は原則として記載しない。例外は前任監査人の業務が後任監査人に買収・統合された場合のみであり、本問は該当しない。</p>
<p>C:前任監査人は再発行前に、当期財務諸表を通読し、前期の表示を比較し、後任監査人から重要な事項がない旨の確認書、経営者から確認書を入手する。前期の再監査や後任の調書の全面閲覧までは不要である。</p>
<p>D:修正を要する事項がない場合、再発行報告書は当初の報告書日付(2026年3月6日)を用いる。前期財務諸表を修正した場合のみ二重日付とする。</p>
<p>E:前期について過去と異なる意見を表明する場合、その他の事項区分で前回の意見の内容と異なる意見を表明する理由を開示する(AU-C 700)。修正再表示で逸脱は解消されたので無限定意見となる。</p>
<p>F:前期がレビュー(または調製)の場合、当期の監査報告書のその他の事項区分で、実施した業務、報告書の日付、レビューは監査より範囲が大幅に狭く意見は表明しない旨を記載する。</p>`,
});
