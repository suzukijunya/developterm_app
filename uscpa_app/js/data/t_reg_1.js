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

CPA.tbs({
  id: "TBS-REG-38", section: "REG", chapter: "REG-01", title: "税務リサーチ:該当するIRC条文・権威の種類・訴訟の場",
  scenario: `<p>A senior associate left the following research requests in a client file. For each request, identify the Internal Revenue Code section, the type of authority, or the forum that answers it.</p>
<table><tr><th>Request</th><th>Question</th></tr>
<tr><td>1</td><td>Our client, a dentist, wants to know the general rule allowing a deduction for ordinary and necessary expenses paid in carrying on her practice.</td></tr>
<tr><td>2</td><td>A married couple sold the home they had owned and used as their principal residence for six years. Which section governs exclusion of the gain?</td></tr>
<tr><td>3</td><td>A client traded a warehouse held for investment for undeveloped land. Which section governs deferral of the gain?</td></tr>
<tr><td>4</td><td>The IRS proposed a 20% penalty for a substantial understatement of income tax. Which section imposes it?</td></tr>
<tr><td>5</td><td>How long does the IRS have to assess additional tax on the client's return?</td></tr>
<tr><td>6</td><td>We want to cite sources supporting "substantial authority." Which item is <b>not</b> considered authority for that purpose?</td></tr>
<tr><td>7</td><td>The IRS issued official guidance on how to request an automatic change in accounting method. What type of pronouncement is this most likely to be?</td></tr>
<tr><td>8</td><td>The client wants to contest a statutory notice of deficiency without first paying the tax. Which forum must be used?</td></tr></table>
<p class="ja">シニアアソシエイトが顧客ファイルに次のリサーチ依頼を残した。各依頼に答えるIRC条文、権威の種類または訴訟の場を特定せよ。1:歯科医の顧客が、事業の遂行において支払った通常かつ必要な費用の控除を認める一般規定を知りたい。2:6年間所有し主たる住居として使用した自宅を夫婦が売却した。譲渡益の非課税を定める条文は。3:投資目的で保有する倉庫を未開発の土地と交換した。譲渡益の繰延べを定める条文は。4:IRSが所得税の重大な過少申告に対し20%のペナルティを提案した。これを課す条文は。5:IRSが追加税額を査定できる期間は。6:「実質的根拠」を裏付ける資料を引用したい。この目的上、権威とならないものは。7:会計方法の自動変更の申請方法についてIRSが公式ガイダンスを公表した。最も可能性の高い公表物の種類は。8:不足税額通知を、税額を先に納付せずに争いたい。利用すべき裁判所は。</p>`,
  rows: [
    { label: "Request 1(依頼1)", type: "select", options: ["IRC §61", "IRC §121", "IRC §162", "IRC §1031", "IRC §6501", "IRC §6662"], answer: "IRC §162" },
    { label: "Request 2(依頼2)", type: "select", options: ["IRC §61", "IRC §121", "IRC §162", "IRC §1031", "IRC §6501", "IRC §6662"], answer: "IRC §121" },
    { label: "Request 3(依頼3)", type: "select", options: ["IRC §61", "IRC §121", "IRC §162", "IRC §1031", "IRC §6501", "IRC §6662"], answer: "IRC §1031" },
    { label: "Request 4(依頼4)", type: "select", options: ["IRC §61", "IRC §121", "IRC §162", "IRC §1031", "IRC §6501", "IRC §6662"], answer: "IRC §6662" },
    { label: "Request 5(依頼5)", type: "select", options: ["IRC §61", "IRC §121", "IRC §162", "IRC §1031", "IRC §6501", "IRC §6662"], answer: "IRC §6501" },
    { label: "Request 6(依頼6)", type: "select", options: ["Proposed Treasury regulations", "Revenue rulings", "Private letter rulings", "IRS publications", "Tax treaties"], answer: "IRS publications" },
    { label: "Request 7(依頼7)", type: "select", options: ["Revenue ruling", "Revenue procedure", "Private letter ruling", "Technical advice memorandum", "Final regulation"], answer: "Revenue procedure" },
    { label: "Request 8(依頼8)", type: "select", options: ["U.S. Tax Court", "U.S. District Court", "U.S. Court of Federal Claims", "U.S. Court of Appeals"], answer: "U.S. Tax Court" },
  ],
  explain: `<p><b>1</b>:§162は事業の通常かつ必要な費用の控除を定める(§61は総所得の定義)。</p>
<p><b>2</b>:§121は主たる住居の譲渡益の非課税(夫婦合算で最大$500,000)を定める。</p>
<p><b>3</b>:§1031は事業用・投資用不動産の同種交換による譲渡益の繰延べを定める。投資用の倉庫と未開発の土地はいずれも不動産で同種である。</p>
<p><b>4</b>:§6662は正確性関連ペナルティ(過失・重大な過少申告等、20%)を定める。</p>
<p><b>5</b>:§6501は査定期間(原則3年、25%超の総所得の脱漏は6年等)を定める。</p>
<p><b>6</b>:実質的根拠の判断上、IRC・規則(提案規則を含む)・レベニュールーリング・プライベートレタールーリング・租税条約・判例等は権威となるが、IRSの刊行物(Publication)や論文・教科書は権威とならない。</p>
<p><b>7</b>:申請手続など手続的事項に関する公式ガイダンスはレベニュープロシージャ(Rev. Proc.)で示される。レベニュールーリングは特定の事実への実体法の適用を示すものである。</p>
<p><b>8</b>:税額を先に納付せずに争えるのは租税裁判所(Tax Court)のみであり、通知から90日以内に申し立てる。地方裁判所と連邦請求裁判所は納付後に還付訴訟として争う。</p>`,
});

CPA.tbs({
  id: "TBS-REG-39", section: "REG", chapter: "REG-02", title: "申込み・承諾の時系列と契約の効力(確定申込み・追加条項・約因・未成年者)",
  scenario: `<p>Exhibit 1 — Correspondence between Hill Lumber (a lumber dealer) and Gaku Furniture (a furniture manufacturer):</p>
<table><tr><th>Date</th><th>Communication</th></tr>
<tr><td>March 1</td><td>Signed letter from Hill: "We offer to sell you 500 oak boards at $40 each. This offer will remain open until March 31. Acceptance is limited to the terms of this offer."</td></tr>
<tr><td>March 5</td><td>E-mail from Hill: "Due to rising costs, we revoke our March 1 offer." Gaku received it the same day.</td></tr>
<tr><td>March 10</td><td>Signed letter from Gaku: "We accept your March 1 offer. All disputes shall be resolved by arbitration."</td></tr>
<tr><td>April 20</td><td>Hill and Gaku agree in a signed writing, in good faith because of an unexpected cost increase, to raise the price to $42 per board. Gaku receives nothing additional in exchange.</td></tr></table>
<p>Exhibit 2 — Other matters:</p>
<table><tr><th>Item</th><th>Facts</th></tr>
<tr><td>Consulting</td><td>On Day 1, Ito mailed Jun an offer to provide consulting services. On Day 3, Jun mailed an acceptance. On Day 4, Jun telephoned Ito to reject the offer. Ito received the acceptance on Day 5 and had not changed position in reliance on the call.</td></tr>
<tr><td>Bonus</td><td>Gaku's owner promised a retiring employee a $10,000 bonus "in appreciation of your 20 years of loyal service."</td></tr>
<tr><td>Car</td><td>A 17-year-old bought a used car from a dealer for $15,000 and damaged it in an accident. Before turning 18, she seeks to cancel the purchase.</td></tr>
<tr><td>Fee</td><td>An individual who does not hold the professional license that state law requires (to protect the public) performed services and sues the client for the agreed fee.</td></tr></table>
<p class="ja">資料1:Hill Lumber(材木商)とGaku Furniture(家具製造業者)の通信。3月1日:Hillの署名入り書面「オーク材500枚を1枚$40で売る申込みをする。この申込みは3月31日まで有効とする。承諾はこの申込みの条件に限る。」3月5日:Hillのメール「コスト上昇のため3月1日の申込みを撤回する。」Gakuは同日受信。3月10日:Gakuの署名入り書面「3月1日の申込みを承諾する。すべての紛争は仲裁で解決する。」4月20日:予期しないコスト上昇を理由に、両者は誠実に価格を1枚$42に引き上げることを署名入り書面で合意した。Gakuは見返りを何も受け取らない。資料2:コンサルティング:1日目にItoがJunにコンサルティング役務の申込みを郵送。3日目にJunが承諾を郵送。4日目にJunがItoに電話で拒絶を伝えた。Itoは5日目に承諾書を受領し、電話を信頼して立場を変えてはいなかった。賞与:Gakuのオーナーが退職する従業員に「20年間の忠実な勤務への感謝として」$10,000の賞与を約束した。自動車:17歳の者が販売店から中古車を$15,000で購入し事故で損傷させた。18歳になる前に購入を取り消そうとしている。報酬:公衆保護のため州法が要求する専門資格を持たない者が役務を提供し、合意した報酬を求めて顧客を訴えた。</p>`,
  rows: [
    { label: "Effect of Hill's March 5 revocation(3月5日のHillの撤回の効果)", type: "select", options: ["Effective when sent", "Effective when received by Gaku", "Ineffective; the offer is irrevocable until March 31", "Ineffective; a merchant's offer is irrevocable for three months regardless of its terms"], answer: "Ineffective; the offer is irrevocable until March 31" },
    { label: "Result of Gaku's March 10 letter(3月10日のGakuの書面の結果)", type: "select", options: ["No contract; the letter is a counteroffer", "Contract formed; the arbitration term is included", "Contract formed; the arbitration term is not included", "Contract formed only if Hill expressly assents to arbitration"], answer: "Contract formed; the arbitration term is not included" },
    { label: "April 20 price modification(4月20日の価格変更)", type: "select", options: ["Enforceable", "Voidable by one party", "Unenforceable for lack of consideration", "Void as illegal"], answer: "Enforceable" },
    { label: "Consulting — when was a contract formed?(コンサルティング:契約の成立時点)", type: "select", options: ["Day 3, when the acceptance was mailed", "Day 4, when the rejection was telephoned", "Day 5, when the acceptance was received", "No contract was formed"], answer: "Day 3, when the acceptance was mailed" },
    { label: "Bonus promise(賞与の約束)", type: "select", options: ["Enforceable", "Voidable by one party", "Unenforceable for lack of consideration", "Void as illegal"], answer: "Unenforceable for lack of consideration" },
    { label: "Car purchase by the minor(未成年者による自動車購入)", type: "select", options: ["Enforceable", "Voidable by one party", "Unenforceable for lack of consideration", "Void as illegal"], answer: "Voidable by one party" },
    { label: "Unlicensed individual's fee agreement(無資格者の報酬契約)", type: "select", options: ["Enforceable", "Voidable by one party", "Unenforceable for lack of consideration", "Void as illegal"], answer: "Void as illegal" },
  ],
  explain: `<p><b>撤回</b>:商人が署名入り書面で申込みを維持すると約したもの(確定申込み)は約因がなくても撤回できない。期間が明示されていればその期間(3か月が上限)、3月31日まで撤回不能であり、3月5日の撤回は無効である。</p>
<p><b>3月10日の書面</b>:UCC 2-207では、追加条項があっても明確かつ適時の承諾の表示は承諾となり契約が成立する(承諾が追加条項への同意を明示的条件としていないため)。商人間でも、申込みが承諾を申込みの条件に限定している場合、追加条項は契約内容にならない。よって契約は成立し仲裁条項は含まれない。</p>
<p><b>価格変更</b>:物品売買契約の変更はUCC上、誠実になされれば約因を要しない。価格$500以上の契約変更であり詐欺防止法の対象だが署名入り書面がある。よって強制可能。</p>
<p><b>コンサルティング</b>:役務提供はコモンローが適用される。承諾を先に発信した場合、発信時(3日目)に契約が成立する(発信主義)。その後の拒絶は、申込者が拒絶を信頼して立場を変えた場合を除き契約に影響しない。</p>
<p><b>賞与</b>:過去の勤務は過去の約因であり約因とならないため、強制できない。</p>
<p><b>自動車</b>:未成年者の契約は未成年者側から取り消しうる。多くの州では、未成年者は手元の物(損傷した車)を返還すれば取り消せる。</p>
<p><b>報酬</b>:公衆保護を目的とする規制的資格(免許)のない者との契約は違法で無効であり、報酬を請求できない(歳入目的の免許とは異なる)。</p>`,
});

CPA.tbs({
  id: "TBS-REG-40", section: "REG", chapter: "REG-02", title: "UCC売買の救済:逸失利益・代金請求・保証違反の損害額と追完",
  scenario: `<p>A litigation-support engagement involves the following independent sales-of-goods disputes. All parties are merchants unless stated otherwise, and all contracts satisfy the statute of frauds.</p>
<table><tr><th>Part</th><th>Facts</th></tr>
<tr><td>A</td><td>Maple Pianos, a dealer with an unlimited supply of a standard model, contracted to sell a piano to a buyer for <b>$12,000</b>. Maple's cost is <b>$7,500</b>. The buyer repudiated. Maple later sold the same piano to another customer for $12,000 — a sale it would have made anyway. Maple incurred <b>$200</b> of incidental expenses (storage and re-delivery arrangements).</td></tr>
<tr><td>B</td><td>Print Co. manufactured 3,000 tote bags printed with a buyer's logo for <b>$9,000</b>. The buyer wrongfully refused delivery. The bags cannot reasonably be resold. Print Co. incurred <b>$300</b> to store them.</td></tr>
<tr><td>C</td><td>A buyer accepted a machine for <b>$18,000</b>, then discovered a breach of warranty and promptly notified the seller. Exhibit — Valuation report: value of the machine as warranted <b>$20,000</b>; value as accepted <b>$14,000</b>. The buyer incurred <b>$500</b> of inspection costs and lost <b>$3,000</b> of profits that the seller had reason to know would result and that could not be prevented by cover.</td></tr>
<tr><td>D</td><td>A seller delivered nonconforming goods on June 5. The contract delivery date is June 30. The seller promptly notified the buyer that it would deliver conforming goods by June 30.</td></tr>
<tr><td>E</td><td>A collector prepaid the full price for a one-of-a-kind antique clock. The seller refuses to deliver and offers to return the money.</td></tr></table>
<p class="ja">訴訟支援業務で次の独立した物品売買の紛争を扱う。特記がない限り当事者は商人で、契約は詐欺防止法を満たしている。A:標準モデルを無制限に供給できる販売店Maple Pianosが、ピアノを$12,000で販売する契約をした。原価は$7,500。買主は履行を拒絶した。Mapleは後に同じピアノを別の顧客に$12,000で販売したが、これはいずれにせよ行えた販売である。付随費用(保管・再配送手配)$200が生じた。B:Print社は買主のロゴ入りトートバッグ3,000個を$9,000で製造した。買主は不当に受領を拒否した。バッグは合理的に転売できない。保管費$300が生じた。C:買主は$18,000の機械を受領した後、保証違反を発見し速やかに売主に通知した。評価報告書:保証どおりの価値$20,000、受領時の実際の価値$14,000。買主は検査費$500を負担し、売主が生じることを知りうべきでカバーによって防げなかった逸失利益$3,000を被った。D:売主は6月5日に不適合品を引き渡した。契約上の引渡日は6月30日。売主は6月30日までに適合品を引き渡すと速やかに買主に通知した。E:収集家が唯一無二のアンティーク時計の代金を全額前払いした。売主は引渡しを拒み、代金の返還を申し出ている。</p>`,
  rows: [
    { label: "Part A — Maple's recoverable damages(Part A:Mapleが回収できる損害額)", type: "num", answer: 4700 },
    { label: "Part B — Print Co.'s total recovery(Part B:Print社の回収総額)", type: "num", answer: 9300 },
    { label: "Part B — remedy Print Co. uses(Part B:Print社が用いる救済)", type: "select", options: ["Action for the price", "Resale damages", "Market-price damages", "Specific performance"], answer: "Action for the price" },
    { label: "Part C — buyer's total recoverable damages(Part C:買主が回収できる損害総額)", type: "num", answer: 9500 },
    { label: "Part C — consequence if the buyer had failed to notify the seller within a reasonable time after discovering the breach(Part C:発見後合理的期間内に通知しなかった場合)", type: "select", options: ["Barred from any remedy for the breach", "May still revoke acceptance", "Recovery limited to incidental damages", "No effect because the buyer is a merchant"], answer: "Barred from any remedy for the breach" },
    { label: "Part D — the seller's right(Part D:売主の権利)", type: "select", options: ["May cure by delivering conforming goods by June 30", "Has no right to cure once nonconforming goods are tendered", "May cure only if the buyer consents in writing", "May cure only by reducing the price"], answer: "May cure by delivering conforming goods by June 30" },
    { label: "Part E — the collector's best remedy(Part E:収集家にとって最善の救済)", type: "select", options: ["Specific performance", "Cover damages", "Market-price damages", "Rescission and restitution only"], answer: "Specific performance" },
  ],
  explain: `<p><b>A</b>:Mapleは供給無制限の大量販売者(lost-volume seller)であり、再販売しても1件分の販売を失っている。再販売価格・市場価格による算定では損害が0となり不十分なので、逸失利益で算定する。12,000 − 7,500 = 4,500、付随費用200を加え4,700。</p>
<p><b>B</b>:特注品で合理的に転売できない場合、売主は代金請求訴訟(action for the price)ができる。9,000 + 付随費用300 = 9,300。売主は物品を買主のために保管する。</p>
<p><b>C</b>:受領した物品の保証違反の損害 =(保証どおりの価値 − 受領時の価値)+ 付随損害 + 結果的損害。(20,000 − 14,000)+ 500 + 3,000 = 9,500。契約価格$18,000ではなく保証どおりの価値$20,000を用いる点に注意。</p>
<p>受領後に違反を発見した買主は合理的期間内に売主へ通知しなければならず、怠るとあらゆる救済を失う。</p>
<p><b>D</b>:履行期限前に不適合品を提供した売主は、追完の意図を適時に通知すれば、期限内に適合品を引き渡して追完できる。</p>
<p><b>E</b>:目的物が唯一無二(unique)であれば、金銭賠償は不十分なので買主は特定履行を求められる。</p>`,
});

CPA.tbs({
  id: "TBS-REG-41", section: "REG", chapter: "REG-02", title: "代理における本人・代理人の責任と事業体所有者の責任比較",
  scenario: `<p>Coast LLC, a manager-managed limited liability company, distributes marine supplies. Exhibit — Incident log prepared by Coast's general counsel:</p>
<table><tr><th>No.</th><th>Event</th></tr>
<tr><td>1</td><td>Ken, Coast's purchasing agent with written authority to buy inventory up to $50,000 per order, signed a $30,000 inventory contract "Coast LLC, by Ken, Purchasing Agent."</td></tr>
<tr><td>2</td><td>Coast fired Ken on June 1 but did not notify suppliers. On June 10, Ken ordered $20,000 of goods in Coast's name from Vendor V, who had regularly dealt with Ken and did not know of the termination.</td></tr>
<tr><td>3</td><td>Before his termination, at Coast's instruction, Ken bought a waterfront lot in his own name without disclosing that he was acting for Coast. The seller later learned of Coast's role and seeks payment of the price.</td></tr>
<tr><td>4</td><td>Before his termination, Ken signed a $80,000 contract for a forklift in Coast's name, exceeding his authority. Coast's manager, with full knowledge of the facts, later approved the contract.</td></tr>
<tr><td>5</td><td>Coast's employee-driver, while making a scheduled delivery, ran a red light and injured a pedestrian.</td></tr>
<tr><td>6</td><td>The same driver, after finishing all deliveries, drove 40 miles in the opposite direction to attend a friend's party and injured a cyclist.</td></tr></table>
<p>Coast later suffered a <b>$200,000</b> judgment that exceeds its assets. Counsel asks how the owners' exposure would differ by entity form.</p>
<p class="ja">Coast LLCはマネージャー管理型のLLCで、船舶用品を販売している。顧問弁護士の事案記録:1:1件$50,000まで在庫を購入する書面による権限を持つ購買担当代理人Kenが、「Coast LLC, by Ken, Purchasing Agent」として$30,000の在庫契約に署名した。2:CoastはKenを6月1日に解雇したが仕入先に通知しなかった。6月10日、KenはCoast名義で、以前からKenと取引し解雇を知らないVendor Vに$20,000の商品を注文した。3:解雇前、Coastの指示により、KenはCoastのために行動していることを明かさず自己名義で海辺の土地を購入した。売主は後にCoastの関与を知り代金の支払を求めている。4:解雇前、Kenは権限を超えてCoast名義で$80,000のフォークリフト契約に署名した。Coastのマネージャーは事実を完全に知った上で後に契約を承認した。5:Coastの従業員である運転手が予定の配送中に赤信号を無視し歩行者を負傷させた。6:同じ運転手が全配送を終えた後、友人のパーティーに出るため反対方向に40マイル運転し、自転車の人を負傷させた。Coastは後に資産を上回る$200,000の判決を受けた。事業体の形態により所有者の責任がどう異なるかを問われている。</p>`,
  rows: [
    { label: "Event 1 — liable to the seller(事象1:売主に対する責任者)", type: "select", options: ["Coast only", "Agent/employee only", "Either Coast or the agent (third party elects)", "Both Coast and the agent/employee", "Neither"], answer: "Coast only" },
    { label: "Event 2 — liable to Vendor V(事象2:Vendor Vに対する責任者)", type: "select", options: ["Coast only", "Agent/employee only", "Either Coast or the agent (third party elects)", "Both Coast and the agent/employee", "Neither"], answer: "Coast only" },
    { label: "Event 3 — liable to the land seller(事象3:土地の売主に対する責任者)", type: "select", options: ["Coast only", "Agent/employee only", "Either Coast or the agent (third party elects)", "Both Coast and the agent/employee", "Neither"], answer: "Either Coast or the agent (third party elects)" },
    { label: "Event 4 — liable to the forklift seller(事象4:フォークリフトの売主に対する責任者)", type: "select", options: ["Coast only", "Agent/employee only", "Either Coast or the agent (third party elects)", "Both Coast and the agent/employee", "Neither"], answer: "Coast only" },
    { label: "Event 5 — liable to the pedestrian(事象5:歩行者に対する責任者)", type: "select", options: ["Coast only", "Agent/employee only", "Either Coast or the agent (third party elects)", "Both Coast and the agent/employee", "Neither"], answer: "Both Coast and the agent/employee" },
    { label: "Event 6 — liable to the cyclist(事象6:自転車の人に対する責任者)", type: "select", options: ["Coast only", "Agent/employee only", "Either Coast or the agent (third party elects)", "Both Coast and the agent/employee", "Neither"], answer: "Agent/employee only" },
    { label: "Exposure of a non-managing member of Coast LLC for the unpaid judgment(未払判決に対するCoast LLCの非業務執行メンバーの責任)", type: "select", options: ["Personally liable for the full unpaid amount", "Loss limited to her investment in the entity", "Liable pro rata by ownership percentage", "Liable only if she signed the underlying contract"], answer: "Loss limited to her investment in the entity" },
    { label: "Exposure of a partner who took no part in the events if Coast had been a general partnership(Coastがゼネラル・パートナーシップだった場合の、事象に関与していないパートナーの責任)", type: "select", options: ["Personally liable for the full unpaid amount", "Loss limited to her investment in the entity", "Liable pro rata by ownership percentage", "Liable only if she signed the underlying contract"], answer: "Personally liable for the full unpaid amount" },
  ],
  explain: `<p><b>1</b>:明示の実権限内で、本人を開示して本人名義で署名しているので、本人Coastのみが責任を負い、代理人は責任を負わない。</p>
<p><b>2</b>:解雇で実権限は消滅したが、以前の取引相手には実際の通知が必要であり、通知していないので表見代理(apparent authority)が残る。Coastが責任を負う(Kenは本人Coastに損害を賠償する責任を負う)。第三者は期待どおりの相手方を得ており、Kenは第三者に責任を負わない。</p>
<p><b>3</b>:非開示本人(undisclosed principal)の場合、代理人は契約当事者として責任を負い、本人が判明すれば第三者は本人にも請求できるが、いずれかを選択しなければならない。</p>
<p><b>4</b>:権限外の行為でも、本人が事実を完全に知った上で全体を追認(ratification)すれば、契約時に遡って本人が拘束され、代理人は責任を免れる。</p>
<p><b>5</b>:職務の範囲内の従業員の不法行為には使用者責任(respondeat superior)が及び、不法行為者本人も責任を負う。両者が連帯して責任を負う。</p>
<p><b>6</b>:業務を終えた後の私的目的の大きな逸脱(frolic)は職務の範囲外であり、使用者は責任を負わない。運転手のみが責任を負う。</p>
<p><b>事業体比較</b>:LLCのメンバーは事業体の債務について個人責任を負わず、損失は出資額に限られる。ゼネラル・パートナーシップのパートナーは、関与の有無にかかわらずパートナーシップの全債務について連帯して無限責任を負う(通常、債権者はまずパートナーシップの財産から回収する)。</p>`,
});
