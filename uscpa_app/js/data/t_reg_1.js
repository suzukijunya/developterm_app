// REG のTBS追加(税務手続・倫理・業務責任・ビジネス法)

CPA.tbs({
  id: "TBS-REG-34", section: "REG", chapter: "REG-01", title: "延長申請・最低不提出ペナルティ・重大な過少申告の判定",
  scenario: `<p>You are reviewing penalty exposure for three unrelated individual clients' 2025 calendar-year returns. The original due date of each return was <b>April 15, 2026</b>. Fraud is not involved and no client has reasonable cause unless stated.</p>
<table><tr><th>Client</th><th>Facts</th></tr>
<tr><td>Ito</td><td>Filed a valid automatic extension (Form 4868) on April 10, 2026. Total tax shown on the return: <b>$50,000</b>. Withholding plus estimated and extension payments made by April 15, 2026: <b>$42,000</b>. Return filed and the <b>$8,000</b> balance paid on <b>October 15, 2026</b>.</td></tr>
<tr><td>Sato</td><td>No extension. Return filed and balance due of <b>$3,000</b> paid on <b>June 29, 2026</b> (75 days late).</td></tr>
<tr><td>Mori</td><td>Return filed timely. On examination, the correct tax was determined to be <b>$60,000</b>; tax shown on the return was <b>$54,000</b>. The IRS established that <b>$2,000</b> of the resulting underpayment is attributable to negligence (unsubstantiated travel expenses). No disclosure was made and no substantial authority exists for any item.</td></tr></table>
<p>Exhibit — Penalty notes: For returns required to be filed in 2026, assume the minimum failure-to-file penalty for a return more than 60 days late is the lesser of <b>$525</b> or 100% of the tax required to be shown as unpaid. Apply the minimum to the failure-to-file penalty after its reduction for the failure-to-pay penalty. For an extension, assume reasonable cause for late payment exists for the extension period only if at least 90% of the tax shown on the return was paid by the original due date and the balance is paid by the extended due date.</p>
<p class="ja">3人の無関係な個人顧客の2025暦年申告書のペナルティを検討する。いずれも当初の申告期限は2026年4月15日である。不正はなく、記載がない限り合理的理由もない。Itoは2026年4月10日に有効な自動延長(Form 4868)を提出した。申告税額$50,000、4月15日までの源泉徴収・予定納税・延長時納付の合計$42,000、残額$8,000は2026年10月15日の申告時に納付した。Satoは延長なしで、2026年6月29日(75日遅れ)に申告し未納額$3,000を納付した。Moriは期限内に申告したが、調査で正しい税額は$60,000、申告税額は$54,000とされた。不足税額のうち$2,000は過失(立証のない旅費)に起因するとIRSが立証した。開示はなく、いずれの項目にも実質的根拠はない。注記:2026年に提出すべき申告書が60日超遅れた場合の最低不提出ペナルティは$525と納付すべき税額の100%のいずれか少ない方と仮定する。最低額は不納付ペナルティによる減額後の不提出ペナルティに適用する。延長の場合、申告税額の90%以上を当初期限までに納付し、残額を延長期限までに納付したときに限り、延長期間の不納付に合理的理由があるものと仮定する。</p>`,
  rows: [
    { label: "Ito — failure-to-file penalty(Ito:不提出ペナルティ)", type: "num", answer: 0 },
    { label: "Ito — failure-to-pay penalty(Ito:不納付ペナルティ)", type: "num", answer: 240 },
    { label: "Ito — if $45,000 had been paid by April 15 and the $5,000 balance on October 15, the failure-to-pay penalty would be(Ito:4月15日までに$45,000を納付し残額$5,000を10月15日に納付していた場合の不納付ペナルティ)", type: "num", answer: 0 },
    { label: "Sato — failure-to-pay penalty(Sato:不納付ペナルティ)", type: "num", answer: 45 },
    { label: "Sato — failure-to-file penalty after the reduction and the minimum(Sato:減額・最低額適用後の不提出ペナルティ)", type: "num", answer: 525 },
    { label: "Mori — is the understatement a substantial understatement of income tax?(Mori:所得税の重大な過少申告に該当するか)", type: "select", options: ["Yes, because it exceeds $5,000", "Yes, because it exceeds 10% of the tax shown", "No, because it does not exceed the greater of 10% of the correct tax or $5,000", "No, because negligence penalties preempt the test"], answer: "No, because it does not exceed the greater of 10% of the correct tax or $5,000" },
    { label: "Mori — accuracy-related penalty(Mori:正確性関連ペナルティ)", type: "num", answer: 400 },
  ],
  explain: `<p><b>Ito</b>:有効な延長により申告期限は10月15日となり、同日に申告しているため不提出ペナルティは0。一方、延長は納付期限を延長しない。4月15日までの納付額は42,000 ÷ 50,000 = 84%で90%に満たないため、延長期間の合理的理由は認められない。4月15日から10月15日までちょうど6か月なので、不納付ペナルティ = 8,000 × 0.5% × 6 = 240。</p>
<p>$45,000を納付していれば45,000 ÷ 50,000 = 90%となり、残額を延長期限までに納付しているので延長期間の不納付には合理的理由があるとされ、不納付ペナルティは0となる。</p>
<p><b>Sato</b>:4月15日→5月15日(1か月)→6月15日(2か月)→6月29日(端数で3か月目)により3か月。不納付ペナルティ = 3,000 × 0.5% × 3 = 45。不提出ペナルティ = 3,000 × 5% × 3 = 450、不納付分45を控除して405。60日超の遅延なので最低額は$525と未納税額$3,000の少ない方で525。405 &lt; 525のため525となる。</p>
<p><b>Mori</b>:過少申告額 = 60,000 − 54,000 = 6,000。判定基準は正しい税額の10%(6,000)と$5,000のいずれか大きい方で6,000。過少申告額がこれを「超える」必要があり、6,000は6,000を超えないので重大な過少申告には該当しない。ただし過失に起因する部分$2,000には20%の正確性関連ペナルティが課され、2,000 × 20% = 400。</p>`,
});

CPA.tbs({
  id: "TBS-REG-35", section: "REG", chapter: "REG-01", title: "還付請求の期限とルックバック上限額・修正申告による査定期間の延長",
  scenario: `<p>A tax manager asks you to prepare a deadline schedule for five independent individual clients. Each case concerns a <b>2023</b> calendar-year Form 1040, originally due <b>April 15, 2024</b>. No extensions of time to file and no agreements to extend the limitations period were made. Withholding and estimated payments are deemed paid on the original due date.</p>
<table><tr><th>Case</th><th>Facts</th></tr>
<tr><td>A</td><td>Return filed <b>February 20, 2024</b>; all tax paid through withholding. The client now wants to amend to claim a refund.</td></tr>
<tr><td>B</td><td>Return filed late on <b>August 1, 2025</b>. Withholding was <b>$12,000</b>; the <b>$3,000</b> balance was paid with the return. On <b>January 10, 2028</b>, the client files an amended return claiming a <b>$5,000</b> overpayment.</td></tr>
<tr><td>C</td><td>Return filed April 15, 2024. In 2026 the client learns that a loan made to a friend (a nonbusiness bad debt) became wholly worthless in 2023.</td></tr>
<tr><td>D</td><td>Return filed April 15, 2024. The client files an amended return showing <b>additional tax due</b>, which the IRS receives on <b>February 25, 2027</b>.</td></tr>
<tr><td>E</td><td>Return filed April 15, 2024. After examination, the client paid an assessed deficiency of <b>$7,000</b> on <b>September 7, 2027</b>, and later decides to file a refund claim contesting it.</td></tr></table>
<p class="ja">税務マネージャーから、5件の独立した個人顧客の期限表の作成を依頼された。いずれも2023暦年のForm 1040で、当初期限は2024年4月15日である。申告期限の延長も期間延長の合意もない。源泉徴収と予定納税は当初期限に納付されたものとみなす。A:2024年2月20日に申告し税額は全額源泉徴収で納付済み。還付を求め修正申告したい。B:2025年8月1日に期限後申告。源泉徴収$12,000、残額$3,000は申告時に納付。2028年1月10日に$5,000の過納を主張する修正申告(還付請求)を提出する。C:2024年4月15日に申告。2026年に、友人への貸付金(非事業用貸倒れ)が2023年に完全に回収不能になっていたことを知った。D:2024年4月15日に申告。追加税額を示す修正申告をIRSが2027年2月25日に受領した。E:2024年4月15日に申告。調査後、査定された不足税額$7,000を2027年9月7日に納付し、その後これを争う還付請求を検討している。</p>`,
  rows: [
    { label: "Case A — last day to file the refund claim(ケースA:還付請求の最終日)", type: "select", options: ["February 20, 2027", "April 15, 2027", "April 15, 2026", "April 15, 2030"], answer: "April 15, 2027" },
    { label: "Case B — last day to file a refund claim(ケースB:還付請求の最終日)", type: "select", options: ["April 15, 2027", "August 1, 2027", "August 1, 2028", "April 15, 2031"], answer: "August 1, 2028" },
    { label: "Case B — maximum refund allowable on the January 10, 2028 claim(ケースB:2028年1月10日の請求で認められる還付の上限額)", type: "num", answer: 3000 },
    { label: "Case C — last day to claim a refund attributable to the bad debt(ケースC:貸倒れに起因する還付請求の最終日)", type: "select", options: ["April 15, 2027", "April 15, 2028", "April 15, 2030", "April 15, 2031"], answer: "April 15, 2031" },
    { label: "Case D — last day for the IRS to assess the additional tax shown on the amended return(ケースD:修正申告に示された追加税額をIRSが査定できる最終日)", type: "select", options: ["April 15, 2027", "April 26, 2027", "February 25, 2030", "April 15, 2030"], answer: "April 26, 2027" },
    { label: "Case E — last day to file the refund claim for the deficiency payment(ケースE:不足税額納付分の還付請求の最終日)", type: "select", options: ["April 15, 2027", "September 7, 2029", "September 7, 2030", "April 15, 2031"], answer: "September 7, 2029" },
    { label: "Case E — maximum refund allowable on a timely claim(ケースE:期限内の請求で認められる還付の上限額)", type: "num", answer: 7000 },
  ],
  explain: `<p><b>A</b>:期限前に提出した申告書は期限日(2024年4月15日)に提出されたものとみなす。還付請求期限は申告から3年(または納付から2年のいずれか遅い方)なので2027年4月15日。</p>
<p><b>B</b>:申告日2025年8月1日から3年 → 2028年8月1日。2028年1月10日の請求は申告から3年以内なので、上限は請求前3年以内(延長なし)に納付した税額である。遡及期間は2025年1月10日〜2028年1月10日。源泉徴収$12,000は2024年4月15日に納付とみなされ期間外、2025年8月1日の$3,000のみ期間内。よって$5,000の過納のうち還付上限は3,000。</p>
<p><b>C</b>:貸倒れ(および無価値有価証券)による還付請求は申告期限から7年。2024年4月15日 + 7年 = 2031年4月15日。</p>
<p><b>D</b>:通常の査定期間は2027年4月15日に終了するが、その満了前60日以内に追加税額を示す修正申告が受領された場合、その税額については受領日から60日後まで査定期間が延長される。2月25日から2月28日で3日、3月31日で34日、4月26日で60日となるため2027年4月26日。</p>
<p><b>E</b>:申告から3年(2027年4月15日)は経過しているが、納付から2年以内であれば請求できる。2027年9月7日 + 2年 = 2029年9月7日。この場合の上限は請求前2年以内に納付した税額で、7,000全額となる。</p>`,
});

CPA.tbs({
  id: "TBS-REG-36", section: "REG", chapter: "REG-01", title: "Circular 230とSSTSの許容行為の判定(報酬・記録・利益相反・申告ポジション)",
  scenario: `<p>Lena Park, CPA, is enrolled to practice before the IRS and is a member of the AICPA. Her firm's quality reviewer compiled the following situations from Lena's tax practice during the current year. For each situation, determine whether the action is permitted under Treasury Department Circular 230 and the AICPA Statements on Standards for Tax Services (SSTS).</p>
<table><tr><th>No.</th><th>Situation</th></tr>
<tr><td>1</td><td>Lena prepares an original Form 1040 for a fee equal to 15% of the refund shown on the return.</td></tr>
<tr><td>2</td><td>Lena represents a client in an IRS examination of a previously filed return for a fee equal to 20% of the tax reduction obtained.</td></tr>
<tr><td>3</td><td>A former client requests the return of original bank statements and 1099s he provided to Lena. Lena refuses until her unpaid fee is paid.</td></tr>
<tr><td>4</td><td>Lena represents both spouses in a divorce-related innocent spouse matter in which their interests are directly adverse. She reasonably believes she can represent each competently.</td></tr>
<tr><td>5</td><td>A client's receipts for vehicle expenses were destroyed in a flood. Lena uses the client's reasonable estimates based on mileage calendars, without presenting them in a way that implies greater accuracy than exists.</td></tr>
<tr><td>6</td><td>Lena takes a return position that has a reasonable basis but lacks substantial authority, and the position is not a tax shelter or reportable transaction.</td></tr>
<tr><td>7</td><td>A client asks Lena to receive his federal refund check at her office and endorse it into her firm's account to pay her fee.</td></tr>
<tr><td>8</td><td>Lena discovers an error in a client's prior-year return. The client refuses to correct it. Lena notifies the IRS of the error without the client's consent.</td></tr></table>
<p class="ja">Lena Park(CPA)はIRSでの代理業務の登録者でありAICPA会員である。事務所の品質管理担当者が当年のLenaの税務業務から以下の状況をまとめた。各状況の行為がCircular 230およびAICPAの税務業務基準書(SSTS)で許容されるかを判定せよ。1:当初申告のForm 1040を還付額の15%の報酬で作成する。2:既に提出された申告書のIRS調査で、得られた減額の20%の報酬で代理する。3:元顧客が提供した銀行明細書と1099の原本の返却を求めたが、未払報酬の支払まで返却を拒否する。4:利害が直接対立する離婚関連の無過失配偶者事案で夫婦双方を代理する。双方を適切に代理できると合理的に信じている。5:車両費の領収書が洪水で失われたため、走行記録カレンダーに基づく顧客の合理的な見積りを、実際以上の正確性を示唆しない形で使用する。6:合理的根拠はあるが実質的根拠のない申告ポジションをとる(タックスシェルターや報告対象取引ではない)。7:顧客の連邦還付小切手を事務所で受け取り、報酬支払のため事務所口座に裏書入金するよう頼まれる。8:前年の申告書の誤りを発見したが顧客は訂正を拒否した。Lenaは顧客の同意なくIRSに通知する。</p>`,
  rows: [
    { label: "Situation 1(状況1)", type: "select", options: ["Permitted", "Permitted only with adequate disclosure on the return", "Permitted only with written informed consent", "Not permitted"], answer: "Not permitted" },
    { label: "Situation 2(状況2)", type: "select", options: ["Permitted", "Permitted only with adequate disclosure on the return", "Permitted only with written informed consent", "Not permitted"], answer: "Permitted" },
    { label: "Situation 3(状況3)", type: "select", options: ["Permitted", "Permitted only with adequate disclosure on the return", "Permitted only with written informed consent", "Not permitted"], answer: "Not permitted" },
    { label: "Situation 4(状況4)", type: "select", options: ["Permitted", "Permitted only with adequate disclosure on the return", "Permitted only with written informed consent", "Not permitted"], answer: "Permitted only with written informed consent" },
    { label: "Situation 5(状況5)", type: "select", options: ["Permitted", "Permitted only with adequate disclosure on the return", "Permitted only with written informed consent", "Not permitted"], answer: "Permitted" },
    { label: "Situation 6(状況6)", type: "select", options: ["Permitted", "Permitted only with adequate disclosure on the return", "Permitted only with written informed consent", "Not permitted"], answer: "Permitted only with adequate disclosure on the return" },
    { label: "Situation 7(状況7)", type: "select", options: ["Permitted", "Permitted only with adequate disclosure on the return", "Permitted only with written informed consent", "Not permitted"], answer: "Not permitted" },
    { label: "Situation 8(状況8)", type: "select", options: ["Permitted", "Permitted only with adequate disclosure on the return", "Permitted only with written informed consent", "Not permitted"], answer: "Not permitted" },
  ],
  explain: `<p><b>1</b>:当初申告書の作成に関する成功報酬は禁止される(Circular 230 §10.27)。</p>
<p><b>2</b>:IRSの調査・異議申立てにおける既提出申告書に関する代理は成功報酬の例外として認められる。</p>
<p><b>3</b>:顧客が税務上の義務を果たすために必要な顧客記録(顧客が提供した原本を含む)は、報酬の未払を理由に留保できず、請求があれば速やかに返却しなければならない(§10.28)。</p>
<p><b>4</b>:利益相反がある場合でも、各顧客を適切に代理できると合理的に信じ、法律で禁止されておらず、各顧客から書面による説明後の同意を得れば代理できる(§10.29)。同意書は少なくとも36か月保存する。</p>
<p><b>5</b>:記録がない場合、合理的な見積りの使用は認められる(SSTS「見積りの使用」)。実際より高い正確性を示唆しない表示であれば通常は開示も不要である。</p>
<p><b>6</b>:開示しない申告ポジションには実質的根拠が必要だが、合理的根拠があるポジションは適切に開示すれば採用できる(§10.34、SSTS)。</p>
<p><b>7</b>:実務家は顧客に発行された政府の還付小切手を裏書・換金してはならない(§10.31)。</p>
<p><b>8</b>:誤りを知った実務家は、顧客に誤りとその結果を速やかに伝える義務がある(§10.21、SSTS)。しかし顧客の同意なくIRSに通知することは守秘義務により認められない。業務継続の可否を検討する。</p>`,
});

CPA.tbs({
  id: "TBS-REG-37", section: "REG", chapter: "REG-01", title: "1933年証券法第11条の損害賠償額と監査人の抗弁",
  scenario: `<p>Bright Corp. completed an initial public offering at an offering price of <b>$20 per share</b>. The registration statement included financial statements audited by Wells &amp; Co., CPAs, that materially overstated revenue. After the misstatement was disclosed, investors filed suit against Wells under <b>Section 11 of the Securities Act of 1933</b>. Exhibit — Investor schedule (all shares are traceable to the registration statement):</p>
<table><tr><th>Investor</th><th>Shares</th><th>Price paid</th><th>Other facts</th></tr>
<tr><td>Ann</td><td>1,000</td><td>$20</td><td>Still holds the shares; value when suit was filed $12. Wells proves that $2 per share of the decline resulted from an industry-wide downturn unrelated to the misstatement.</td></tr>
<tr><td>Ben</td><td>500</td><td>$24 (aftermarket)</td><td>Sold the shares at $15 before suit was filed.</td></tr>
<tr><td>Cara</td><td>2,000</td><td>$20</td><td>Value when suit was filed $13; sold after suit was filed but before judgment at $16.</td></tr>
<tr><td>Dan</td><td>300</td><td>$20</td><td>Was told by a Bright insider of the overstatement before he purchased.</td></tr></table>
<p class="ja">Bright社は1株$20の公募価格で新規株式公開を行った。登録届出書にはWells &amp; Co.(CPA事務所)が監査した財務諸表が含まれ、収益が重要に過大表示されていた。虚偽表示の公表後、投資家は1933年証券法第11条に基づきWellsを提訴した。全株式は登録届出書にトレース可能である。Ann:1,000株を$20で取得し保有中、提訴時の価値$12。下落のうち1株$2は虚偽表示と無関係な業界全体の不況によることをWellsが立証した。Ben:500株を流通市場で$24で取得し、提訴前に$15で売却。Cara:2,000株を$20で取得、提訴時の価値$13、提訴後判決前に$16で売却。Dan:300株を$20で取得、購入前にBright社の内部者から過大表示を聞いていた。</p>`,
  rows: [
    { label: "Ann — damages recoverable from Wells(Ann:Wellsから回収できる損害賠償額)", type: "num", answer: 6000 },
    { label: "Ben — damages recoverable from Wells(Ben:Wellsから回収できる損害賠償額)", type: "num", answer: 2500 },
    { label: "Cara — damages recoverable from Wells(Cara:Wellsから回収できる損害賠償額)", type: "num", answer: 8000 },
    { label: "Dan — damages recoverable from Wells(Dan:Wellsから回収できる損害賠償額)", type: "num", answer: 0 },
    { label: "What must the plaintiffs prove against Wells under Section 11?(第11条で原告がWellsに対して立証すべき事項)", type: "select", options: ["A material misstatement in the audited financial statements and a loss", "Negligence by Wells and reliance on the financial statements", "Scienter and reliance", "Privity of contract with Wells"], answer: "A material misstatement in the audited financial statements and a loss" },
    { label: "Defense under which Wells avoids liability by proving it had reasonable grounds to believe, after reasonable investigation, that the statements were true(合理的調査の後、表示が真実と信じる合理的根拠があったと立証して責任を免れる抗弁)", type: "select", options: ["Due diligence", "Negative causation", "Contributory negligence", "Lack of privity"], answer: "Due diligence" },
    { label: "If Ben instead sued under Rule 10b-5 of the 1934 Act, the additional elements he must prove include(BenがRule 10b-5で提訴した場合に追加で立証すべき要素)", type: "select", options: ["Scienter and reliance", "Privity and negligence", "Only that he purchased in the IPO", "No additional elements"], answer: "Scienter and reliance" },
  ],
  explain: `<p>第11条の損害額は「支払額(公募価格が上限)− 提訴時の価値(提訴前に売却した場合は売却価格)」である。提訴後判決前に売却した場合は「支払額 − 売却価格」だが、「支払額 − 提訴時の価値」を超えない。</p>
<p><b>Ann</b>:(20 − 12)× 1,000 = 8,000。Wellsが虚偽表示と無関係な下落$2を立証したため(損害因果関係の欠如=negative causation)、(8 − 2)× 1,000 = 6,000。</p>
<p><b>Ben</b>:支払額$24は公募価格$20が上限。(20 − 15)× 500 = 2,500。</p>
<p><b>Cara</b>:支払額 − 売却価格 = (20 − 16)× 2,000 = 8,000。支払額 − 提訴時価値 = (20 − 13)× 2,000 = 14,000。少ない方の8,000。</p>
<p><b>Dan</b>:購入時に虚偽表示を知っていた者は第11条で回収できないので0。</p>
<p>第11条では、原告は重要な虚偽表示と損失を立証すれば足り、過失・信頼・故意・契約関係の立証は不要である。監査人は相当な注意(due diligence)の抗弁、原告の悪意、損害因果関係の欠如で責任を免れる・軽減できる。Rule 10b-5では、原告はさらに故意(scienter)と信頼を立証しなければならない。</p>`,
});
