CPA.section({
  id: "REG",
  name: "Taxation and Regulation",
  ja: "税法および商法",
  kind: "必須(Core)",
  color: "#d97706",
  exam: { hours: 4, mcq: 72, tbs: 8, weight: "MC 50% / TBS 50%" },
  summary: "米国連邦税法(個人・法人・パススルー事業体・資産取引)、税務手続と職業倫理、ビジネス法(代理・契約・債権債務・会社法)。金額の基準値は毎年改正されるため、最新年度の数値は必ず公式資料で確認すること。",
  chapters: [
    {
      id: "REG-01",
      title: "職業倫理・税務手続・会計士の法的責任",
      en: "Ethics, Federal Tax Procedures and Legal Duties",
      note: `
<h3>1. Circular 230(財務省通達230号)</h3>
<p>IRS に対して業務を行う者(CPA・弁護士・Enrolled Agent)の行為規範。</p>
<ul>
<li>クライアントの<b>不遵守・誤りを知った場合</b>:速やかにクライアントに知らせ、その影響を助言する(IRSへの通報義務はない)。</li>
<li>デューデリジェンス、不当な遅延の禁止、IRSからの記録提出要求への迅速な対応。</li>
</ul>

<h3>2. 更正・決定の期間制限(<span class="en">Statute of Limitations</span>)</h3>
<table><tr><th>状況</th><th>IRS の更正期限</th></tr>
<tr><td>原則</td><td>申告期限または実際の申告日の<b>遅い方から3年</b></td></tr>
<tr><td>総所得の<b>25%超</b>の申告漏れ</td><td><b>6年</b></td></tr>
<tr><td>不正申告・無申告</td><td><b>期限なし</b></td></tr></table>
<p>納税者の還付請求:申告から3年、または納付から2年の遅い方。</p>

<h3>3. 税務争訟の流れ</h3>
<ul>
<li>30日レター(調査結果)→ 不服申立て(IRS Independent Office of Appeals)</li>
<li><b>90日レター(Statutory notice of deficiency)</b> → <b>Tax Court</b> に提訴(<b>税金を納付せずに</b>争える)</li>
<li>District Court・Court of Federal Claims は、まず納付して還付訴訟(<span class="en">refund suit</span>)</li>
</ul>

<h3>4. 会計士の法的責任</h3>
<table><tr><th>根拠</th><th>原告が証明すべきこと</th></tr>
<tr><td>コモンロー:契約違反・過失(クライアント)</td><td>注意義務、違反、因果関係、損害</td></tr>
<tr><td>コモンロー:過失(第三者)</td><td>多数説(Restatement):<b>予見された(foreseen)利用者</b>に責任。Ultramares:契約関係(privity)またはそれに近い者のみ</td></tr>
<tr><td>コモンロー:詐欺</td><td>故意(scienter)— すべての第三者に責任</td></tr>
<tr><td>1933年証券法 Section 11</td><td>重要な虚偽表示と損害のみ。<b>依拠・故意の立証不要</b>。会計士は<b>相当な注意(due diligence)</b>で抗弁</td></tr>
<tr><td>1934年証券取引法 Rule 10b-5</td><td>故意(scienter)、依拠、損害など</td></tr></table>

<h3>5. 税務実務家の秘匿特権(IRC §7525)</h3>
<p>連邦の非刑事の税務事項について、弁護士の秘匿特権と同様の保護。<b>刑事事件</b>や<b>タックスシェルターを推進する書面</b>には適用されない。</p>
`,
      mcq: [
        {
          q: "Under Circular 230, a practitioner who knows that a client has not complied with the revenue laws must:",
          ja: "Circular 230のもとで、クライアントが税法を遵守していないことを知った実務家は何をしなければならないか。",
          c: [
            "Notify the IRS immediately",
            "Promptly advise the client of the noncompliance and its consequences",
            "Withdraw from all engagements with the client",
            "Correct the client's return without consent",
          ],
          a: 1,
          ex: "実務家は速やかにクライアントに不遵守とその影響を知らせなければならない。IRSに通報する義務はなく、クライアントの同意なく修正することもできない。",
        },
        {
          q: "A taxpayer timely filed a return but omitted gross income exceeding 25% of the gross income stated on the return. The IRS may generally assess additional tax within:",
          ja: "納税者は期限内に申告したが、申告した総所得の25%を超える総所得を申告漏れしていた。IRSは一般にいつまで追加の課税ができるか。",
          c: ["2 years", "3 years", "6 years", "There is no limit"],
          a: 2,
          ex: "総所得の25%超の申告漏れは6年。原則は3年、不正・無申告は期限なし。",
        },
        {
          q: "A taxpayer who receives a statutory notice of deficiency (90-day letter) and wishes to contest the deficiency without first paying the tax should file a petition with the:",
          ja: "更正決定通知(90日レター)を受け取り、税金を納付せずに争いたい納税者は、どこに申し立てるべきか。",
          c: ["U.S. District Court", "U.S. Court of Federal Claims", "U.S. Tax Court", "U.S. Supreme Court"],
          a: 2,
          ex: "Tax Courtは事前納付なしで争える唯一の裁判所。District CourtとCourt of Federal Claimsは納付後の還付訴訟。",
        },
        {
          q: "Under the majority (Restatement) approach, an accountant who is negligent in an audit is liable to:",
          ja: "多数説(Restatement)のアプローチでは、監査で過失があった会計士は誰に対して責任を負うか。",
          c: [
            "Only the client with whom the accountant is in privity",
            "All reasonably foreseeable third parties, including unknown investors",
            "Third parties that the accountant knew would rely on the report, or members of a limited class of foreseen users",
            "No third parties under any circumstances",
          ],
          a: 2,
          ex: "Restatementアプローチでは、会計士が利用を知っていた(予見された)第三者または限定されたクラスの利用者に責任を負う。Ultramaresは契約関係(またはそれに近い者)のみ、少数説は合理的に予見可能なすべての者。",
        },
        {
          q: "Under Section 11 of the Securities Act of 1933, a purchaser suing an auditor over a misleading registration statement generally must prove:",
          ja: "1933年証券法Section 11に基づき、誤解を招く登録届出書について監査人を訴える購入者は、一般に何を証明しなければならないか。",
          c: [
            "Scienter on the part of the auditor",
            "That the purchaser relied on the financial statements",
            "A material misstatement or omission in the registration statement and resulting damages",
            "Privity of contract with the auditor",
          ],
          a: 2,
          ex: "Section 11では、原告は重要な虚偽表示・省略と損害を証明すればよく、依拠や故意の立証は原則不要。会計士は相当な注意(due diligence)などで抗弁する。",
        },
        {
          q: "The federally authorized tax practitioner privilege under IRC §7525 applies to:",
          ja: "IRC §7525に基づく連邦税務実務家の秘匿特権が適用されるのはどれか。",
          c: [
            "Criminal tax matters",
            "Noncriminal tax matters before the IRS",
            "Written communications promoting participation in tax shelters",
            "State tax matters before state agencies",
          ],
          a: 1,
          ex: "§7525の秘匿特権は、IRSに関する非刑事の連邦税務事項にのみ適用される。刑事事件やタックスシェルター推進の書面には適用されない。",
        },
      ],
      cards: [
        ["Circular 230", "財務省通達230号", "IRSに対する実務家の行為規範"],
        ["Statute of limitations", "更正の期間制限", "原則3年、25%超の申告漏れ6年、不正は無期限"],
        ["Statutory notice of deficiency", "更正決定通知(90日レター)", "受領後90日以内にTax Courtへ"],
        ["Privity", "契約関係", "Ultramaresで第三者責任の基準"],
        ["Scienter", "故意", "詐欺や10b-5の要件"],
        ["Due diligence defense", "相当な注意の抗弁", "Section 11での会計士の主な抗弁"],
      ],
    },
    {
      id: "REG-02",
      title: "ビジネス法",
      en: "Business Law",
      note: `
<h3>1. 代理(<span class="en">Agency</span>)</h3>
<ul>
<li><b>実際の権限(<span class="en">Actual authority</span>)</b>:本人が代理人に与えた権限(明示・黙示)</li>
<li><b>表見代理(<span class="en">Apparent authority</span>)</b>:<b>本人の第三者に対する言動</b>から第三者が合理的に権限ありと信じた場合。代理人自身の言動だけでは生じない</li>
<li>追認(<span class="en">Ratification</span>):本人が事後に契約全体を承認</li>
<li>代理人の義務:忠実義務、服従義務、合理的な注意、報告義務</li>
</ul>

<h3>2. 契約(<span class="en">Contracts</span>)</h3>
<div class="pt">要件:申込み+承諾(合意)、約因(<span class="en">consideration</span>)、行為能力、適法性</div>
<ul>
<li><b>メールボックス・ルール</b>:承諾は<b>発信時</b>に有効(申込者が認めた方法なら)。撤回・拒絶・反対申込みは<b>到達時</b>に有効。</li>
<li>コモンロー:承諾は申込みと完全に一致が必要(<span class="en">mirror image rule</span>)。UCCでは商人間で追加条項が契約の一部になりうる。</li>
</ul>

<h3>3. UCC 第2編(物品売買)</h3>
<ul>
<li>適用対象:<b>物品(goods)</b>の売買。不動産・サービスはコモンロー。</li>
<li><b>確定申込み(<span class="en">Firm offer</span>)</b>:<b>商人</b>が<b>署名した書面</b>で申込みを維持すると約束 → 約因なしで撤回不能(期間の定めがなければ合理的期間、最長3か月)。</li>
<li><b>詐欺防止法(<span class="en">Statute of Frauds</span>)</b>:<b>$500以上</b>の物品売買は書面が必要。ほかに不動産、1年以内に履行不能な契約、他人の債務の保証、婚姻を約因とする契約など。</li>
</ul>

<h3>4. 担保取引(UCC 第9編)</h3>
<ul>
<li><b>設定(<span class="en">Attachment</span>)</b>:担保契約、価値の提供、債務者の権利 → 債務者に対して有効</li>
<li><b>対抗要件(<span class="en">Perfection</span>)</b>:登録(financing statement)、占有、支配。<b>消費財の購入代金担保権(PMSI)</b>は<b>設定と同時に自動的に</b>対抗要件を備える</li>
</ul>

<h3>5. 保証(<span class="en">Suretyship</span>)と事業形態</h3>
<ul>
<li>保証人は債務者の抗弁(詐欺・強迫など)を主張できるが、債務者の<b>行為能力の欠如や破産</b>は抗弁にならない。</li>
<li>株式会社・LLC:出資者は<b>有限責任</b>。法人格否認(<span class="en">piercing the corporate veil</span>)があれば個人責任。ジェネラル・パートナーは無限責任。</li>
</ul>
`,
      mcq: [
        {
          q: "Apparent authority of an agent arises from:",
          ja: "代理人の表見代理権は何から生じるか。",
          c: [
            "The agent's own statements to third parties",
            "The principal's manifestations to third parties",
            "A written agency agreement only",
            "Ratification by the agent",
          ],
          a: 1,
          ex: "表見代理は、本人の第三者に対する言動(manifestation)により、第三者が合理的に代理権があると信じた場合に生じる。代理人自身の言動だけでは生じない。",
        },
        {
          q: "Under the common law mailbox rule, an acceptance sent by an authorized means of communication is effective when:",
          ja: "コモンローのメールボックス・ルールにおいて、許可された方法で送られた承諾はいつ有効となるか。",
          c: ["Received by the offeror", "Dispatched by the offeree", "Read by the offeror", "Acknowledged in writing by both parties"],
          a: 1,
          ex: "承諾は発信時に有効となる(メールボックス・ルール)。一方、申込みの撤回・拒絶・反対申込みは到達時に有効。",
        },
        {
          q: "Under the UCC, a firm offer is irrevocable without consideration if it is made by:",
          ja: "UCCにおいて、確定申込みが約因なしに撤回不能となるのは、誰がどのように行った場合か。",
          c: [
            "Any person, orally",
            "A merchant, in a signed writing",
            "A nonmerchant, in a signed writing",
            "Any person, if the price exceeds $500",
          ],
          a: 1,
          ex: "確定申込みは商人(merchant)が署名した書面で行うことが要件。期間の定めがなければ合理的期間、最長3か月撤回できない。",
        },
        {
          q: "Under the UCC Statute of Frauds, a contract for the sale of goods generally must be in writing if the price is:",
          ja: "UCCの詐欺防止法のもとで、物品売買契約が一般に書面を必要とするのは価格がいくらの場合か。",
          c: ["$100 or more", "$500 or more", "$1,000 or more", "$5,000 or more"],
          a: 1,
          ex: "UCC第2編では$500以上の物品売買契約に書面が必要(例外:特注品、自認、履行済み部分など)。",
        },
        {
          q: "A purchase money security interest in consumer goods is perfected:",
          ja: "消費財に対する購入代金担保権(PMSI)はいつ対抗要件を備えるか。",
          c: [
            "Only when a financing statement is filed",
            "Only when the secured party takes possession",
            "Automatically upon attachment",
            "Only after 20 days have passed",
          ],
          a: 2,
          ex: "消費財のPMSIは設定(attachment)と同時に自動的に対抗要件を備える。登録は不要(ただし善意の消費者購入者には対抗できない場合がある)。",
        },
        {
          q: "Which of the following defenses may a surety raise against a creditor?",
          ja: "保証人が債権者に対して主張できる抗弁はどれか。",
          c: ["The principal debtor's bankruptcy", "The principal debtor's lack of capacity (minority)", "Fraud by the creditor that induced the surety to sign", "The principal debtor's death"],
          a: 2,
          ex: "債権者の詐欺により保証契約を締結させられた場合は抗弁となる。主債務者の破産・未成年・死亡は、まさに保証が想定するリスクなので抗弁にならない。",
        },
      ],
      cards: [
        ["Apparent authority", "表見代理", "本人の言動から第三者が権限ありと信じる"],
        ["Consideration", "約因", "取引上の交換。契約の要件"],
        ["Mailbox rule", "メールボックス・ルール", "承諾は発信時に有効"],
        ["Firm offer", "確定申込み", "商人の署名書面。最長3か月撤回不能"],
        ["Statute of Frauds", "詐欺防止法", "一定の契約に書面を要求($500以上の物品売買など)"],
        ["Perfection", "対抗要件", "担保権を第三者に主張できる状態"],
      ],
    },
    {
      id: "REG-03",
      title: "個人所得税",
      en: "Individual Taxation",
      note: `
<h3>1. 個人所得税の計算構造</h3>
<div class="pt">総所得(<span class="en">Gross income</span>)<br>
− 所得調整控除(<span class="en">Deductions for AGI</span> / above-the-line)<br>
= 調整後総所得(<b>AGI</b>)<br>
− 標準控除 または 項目別控除の大きい方、適格事業所得控除(QBI)<br>
= 課税所得 → 税額 − 税額控除(<span class="en">credits</span>)</div>

<h3>2. 総所得からの除外(<span class="en">Exclusions</span>)の例</h3>
<ul>
<li>死亡による<b>生命保険金</b></li>
<li>贈与・相続で受け取った財産</li>
<li>地方債(municipal bond)の利息</li>
<li>適格奨学金(授業料・教科書分)</li>
<li>身体的傷害の損害賠償</li>
</ul>
<p>含まれるもの:賃金、利息・配当、事業所得、ギャンブルの賞金、懸賞・賞品、失業給付など。</p>

<h3>3. 所得調整控除(AGIの前)の例</h3>
<p>伝統的IRAへの拠出(控除可能分)、HSA拠出、学生ローン利息、<b>自営業税の50%</b>、自営業者の健康保険料、教育者経費など。</p>

<h3>4. 項目別控除(AGIの後)の例</h3>
<ul>
<li>医療費:<b>AGIの7.5%を超える部分</b></li>
<li>州・地方税(SALT):上限あり(上限額は法改正が続いているので最新値を確認)</li>
<li>住宅ローン利息、慈善寄付(AGIに対する割合の上限あり)</li>
</ul>
<p class="ex">例:AGI $80,000、補填されない医療費 $10,000 → 10,000 − 80,000 × 7.5% = <b>$4,000</b></p>

<h3>5. 申告区分と扶養家族</h3>
<ul>
<li><b>Qualifying surviving spouse</b>:配偶者死亡年の翌2年間、扶養する子と同居していれば使える(死亡年は夫婦合算申告が可能)。</li>
<li><b>Qualifying child</b>:関係、年齢、居住(年の半分超)、扶養(子自身が自分の扶養の半分超を負担していない)、合算申告なし。</li>
<li><b>Qualifying relative</b>:関係または同居、<b>総所得テスト</b>、扶養(納税者が半分超を負担)など。総所得テストは qualifying child には<b>ない</b>。</li>
</ul>

<h3>6. その他</h3>
<p>純投資所得税(NIIT)3.8%:MAGI が $200,000(夫婦合算 $250,000)を超える場合の投資所得に課税(この閾値はインフレ調整されない)。</p>
`,
      mcq: [
        {
          q: "Which of the following is excluded from an individual's gross income?",
          ja: "次のうち、個人の総所得から除外されるものはどれか。",
          c: ["Gambling winnings", "Unemployment compensation", "Life insurance proceeds received because of the insured's death", "Prizes won in a radio contest"],
          a: 2,
          ex: "死亡による生命保険金は総所得から除外される。ギャンブルの賞金、失業給付、懸賞の賞品はすべて総所得に含まれる。",
        },
        {
          q: "Which of the following is a deduction for adjusted gross income (above-the-line)?",
          ja: "次のうち、調整後総所得(AGI)を算出する前に控除できる(above-the-line)ものはどれか。",
          c: ["Home mortgage interest", "Charitable contributions", "One-half of self-employment tax", "State income taxes"],
          a: 2,
          ex: "自営業税の50%は所得調整控除(for AGI)。住宅ローン利息・慈善寄付・州所得税は項目別控除(from AGI)。",
        },
        {
          q: "A taxpayer has AGI of $80,000 and unreimbursed qualified medical expenses of $10,000. Assuming the taxpayer itemizes, what is the medical expense deduction?",
          ja: "納税者のAGIは$80,000、補填されない適格医療費は$10,000である。項目別控除を選択する場合、医療費控除はいくらか。",
          c: ["$10,000", "$6,000", "$4,000", "$2,000"],
          a: 2,
          ex: "医療費はAGIの7.5%を超える部分が控除可能。10,000 − 80,000 × 7.5%(6,000)= $4,000。",
        },
        {
          q: "A taxpayer's spouse died in Year 1. The taxpayer did not remarry and maintains a home for a dependent child. For which years may the taxpayer file as a qualifying surviving spouse?",
          ja: "納税者の配偶者が1年目に死亡した。納税者は再婚せず、扶養する子のために家計を維持している。納税者がqualifying surviving spouseとして申告できるのはどの年か。",
          c: ["Year 1 only", "Years 2 and 3", "Years 1, 2, and 3", "Years 2 through 5"],
          a: 1,
          ex: "死亡した年は夫婦合算申告(MFJ)が可能。qualifying surviving spouseは死亡年の翌2年間(2年目・3年目)使える。",
        },
        {
          q: "Which of the following tests applies to a qualifying relative but NOT to a qualifying child?",
          ja: "次のうち、qualifying relativeには適用されるが、qualifying childには適用されないテストはどれか。",
          c: ["Relationship test", "Gross income test", "Joint return test", "Citizenship or residency test"],
          a: 1,
          ex: "総所得テスト(扶養親族の総所得が一定額未満)はqualifying relativeのみ。qualifying childには年齢テストがあり、総所得テストはない。",
        },
        {
          q: "The net investment income tax applies at a rate of:",
          ja: "純投資所得税(NIIT)の税率はいくらか。",
          c: ["0.9%", "2.9%", "3.8%", "15.3%"],
          a: 2,
          ex: "NIITは3.8%。0.9%は追加メディケア税、2.9%はメディケア税(労使合計)、15.3%は自営業税の合計税率。",
        },
      ],
      cards: [
        ["Adjusted gross income (AGI)", "調整後総所得", "総所得 − 所得調整控除。各種制限の基準"],
        ["Exclusion", "非課税所得", "総所得に含めない項目(生命保険金など)"],
        ["Itemized deductions", "項目別控除", "標準控除と比較して大きい方を選ぶ"],
        ["Qualifying surviving spouse", "適格寡婦(夫)", "死亡年の翌2年間、扶養する子がいれば使える"],
        ["Qualifying relative", "扶養親族", "総所得テスト・扶養テストがある"],
        ["Tax credit", "税額控除", "税額から直接差し引く(所得控除より有利)"],
      ],
    },
    {
      id: "REG-04",
      title: "資産取引",
      en: "Property Transactions",
      note: `
<h3>1. 取得価額(<span class="en">Basis</span>)</h3>
<table><tr><th>取得方法</th><th>取得価額</th></tr>
<tr><td>購入</td><td>購入価額+付随費用</td></tr>
<tr><td>贈与(贈与時FMV ≧ 贈与者の取得価額)</td><td><b>贈与者の取得価額を引継ぎ</b>(carryover)</td></tr>
<tr><td>贈与(贈与時FMV < 贈与者の取得価額)</td><td><b>二重基準</b>:利益の計算は贈与者の取得価額、損失の計算は贈与時FMV。その間で売却 → 損益なし</td></tr>
<tr><td>相続</td><td>死亡日(または代替評価日)の<b>FMV</b>(step-up)。保有期間は自動的に<b>長期</b></td></tr></table>
<p class="ex">例:贈与者の取得価額 $10,000、贈与時FMV $7,000。受贈者が $8,000 で売却 → 利益基準では損失、損失基準では利益 → <b>損益なし</b></p>

<h3>2. 同種資産の交換(§1031 <span class="en">Like-kind exchange</span>)</h3>
<p>2018年以降は<b>事業用・投資用の不動産</b>のみが対象。</p>
<div class="pt">認識される利益 = min(実現利益, 受け取った<b>ボート(boot)</b>)<br>
新資産の取得価額 = 旧資産の取得価額 + 認識利益 − 受け取ったボート(+支払ったボート)<br>
= 新資産のFMV − 繰延利益</div>
<p class="ex">例:土地(取得価額 $100,000、FMV $150,000)を、土地(FMV $130,000)+現金 $20,000 と交換<br>実現利益 50,000、認識利益 <b>20,000</b>、新しい土地の取得価額 = 130,000 − 30,000 = <b>$100,000</b></p>

<h3>3. 事業用資産の売却(§1231 / §1245 / §1250)</h3>
<ul>
<li><b>§1245(動産)</b>:売却益のうち<b>過去の減価償却額まで</b>は通常所得(recapture)。残りは§1231利益。</li>
<li><b>§1250(不動産)</b>:個人の場合、定額法の減価償却部分は最高25%の税率(unrecaptured §1250 gain)。</li>
<li>§1231の純利益 → 長期キャピタルゲイン扱い、純損失 → 通常損失(過去5年の§1231純損失のルックバックあり)。</li>
</ul>

<h3>4. キャピタルロスの制限と各種否認</h3>
<ul>
<li>個人:純キャピタルロスは通常所得と<b>年$3,000</b>(MFS $1,500)まで相殺。残りは<b>無期限に繰越</b>。</li>
<li><b>ウォッシュセール</b>:売却日の<b>前後30日</b>以内に実質的に同一の証券を取得 → 損失は否認され、新しい株式の取得価額に加算。</li>
<li><b>関連当事者(§267)への売却損</b>は否認。</li>
<li>個人使用資産(自家用車など)の売却損は控除不可。</li>
</ul>
`,
      mcq: [
        {
          q: "A taxpayer received stock as a gift. The donor's basis was $10,000, and the fair market value at the date of the gift was $7,000. The taxpayer later sold the stock for $8,000. What is the taxpayer's recognized gain or loss?",
          ja: "納税者は株式を贈与により取得した。贈与者の取得価額は$10,000、贈与時の時価は$7,000であった。納税者は後にこの株式を$8,000で売却した。認識する損益はいくらか。",
          c: ["$2,000 loss", "$1,000 gain", "$0", "$3,000 loss"],
          a: 2,
          ex: "贈与時FMV < 贈与者の取得価額なので二重基準。利益計算の基準(10,000)では2,000の損失、損失計算の基準(7,000)では1,000の利益となり、どちらも成立しないため損益なし。",
        },
        {
          q: "What is the basis of property acquired from a decedent (assuming no alternate valuation election)?",
          ja: "相続により取得した財産の取得価額は何か(代替評価日の選択はないものとする)。",
          c: ["The decedent's adjusted basis", "The fair market value at the date of death", "The lower of the decedent's basis or fair market value", "Zero"],
          a: 1,
          ex: "相続財産の取得価額は死亡日の時価(stepped-up basis)。保有期間は実際の期間にかかわらず長期となる。",
        },
        {
          q: "A taxpayer exchanges land held for investment with an adjusted basis of $100,000 and a fair market value of $150,000 for land with a fair market value of $130,000 plus $20,000 cash. What is the recognized gain?",
          ja: "納税者は投資目的の土地(取得価額$100,000、時価$150,000)を、時価$130,000の土地と現金$20,000と交換した。認識される利益はいくらか。",
          c: ["$0", "$20,000", "$30,000", "$50,000"],
          a: 1,
          ex: "実現利益 = 150,000 − 100,000 = 50,000。認識利益は実現利益と受け取ったボート(現金20,000)の小さい方 = $20,000。",
        },
        {
          q: "Equipment used in a business was purchased for $50,000. Accumulated depreciation was $30,000 when it was sold for $45,000. How should the gain be characterized?",
          ja: "事業用設備を$50,000で購入し、減価償却累計額$30,000の時点で$45,000で売却した。利益はどのように性格づけられるか。",
          c: [
            "$25,000 ordinary income",
            "$25,000 Section 1231 gain",
            "$20,000 ordinary income and $5,000 Section 1231 gain",
            "$30,000 ordinary income",
          ],
          a: 0,
          ex: "帳簿価額 = 50,000 − 30,000 = 20,000、利益 = 45,000 − 20,000 = 25,000。§1245では減価償却額(30,000)まで通常所得としてリキャプチャーされるため、利益25,000はすべて通常所得。",
        },
        {
          q: "An individual has a net capital loss of $10,000 for the year and no other capital transactions. How much can be deducted against ordinary income this year (single filer)?",
          ja: "個人の当年の純キャピタルロスは$10,000で、他のキャピタル取引はない。当年に通常所得と相殺できる金額はいくらか(独身申告)。",
          c: ["$0", "$3,000", "$10,000", "$1,500"],
          a: 1,
          ex: "個人の純キャピタルロスは年$3,000(MFSは$1,500)まで通常所得と相殺でき、残り$7,000は無期限に繰り越す。",
        },
        {
          q: "A taxpayer sold stock at a loss and repurchased substantially identical stock 20 days later. What is the tax effect?",
          ja: "納税者は株式を損失で売却し、20日後に実質的に同一の株式を買い戻した。税務上の影響はどうなるか。",
          c: [
            "The loss is deductible in full",
            "The loss is disallowed and added to the basis of the new stock",
            "The loss is disallowed permanently",
            "The loss is treated as ordinary",
          ],
          a: 1,
          ex: "売却の前後30日以内に買い戻すとウォッシュセール。損失は否認され、新しい株式の取得価額に加算される(実質的に繰り延べ)。",
        },
      ],
      cards: [
        ["Adjusted basis", "調整後取得価額", "取得価額+資本的支出 − 減価償却"],
        ["Stepped-up basis", "時価への引上げ", "相続財産は死亡日のFMVが取得価額"],
        ["Like-kind exchange", "同種資産の交換(§1031)", "現在は不動産のみ。ボートの範囲で課税"],
        ["Boot", "ボート", "交換で受け取る現金など同種でない資産"],
        ["Depreciation recapture", "減価償却のリキャプチャー", "減価償却分の利益を通常所得として課税"],
        ["Wash sale", "ウォッシュセール", "前後30日以内の買戻しで損失否認"],
      ],
    },
    {
      id: "REG-05",
      title: "事業体の課税",
      en: "Taxation of Entities",
      note: `
<h3>1. C法人(<span class="en">C Corporation</span>)</h3>
<ul>
<li>法人税率:<b>21%</b>の単一税率</li>
<li><b>受取配当金控除(DRD)</b>:
<table><tr><th>持株比率</th><th>控除率</th></tr>
<tr><td>20%未満</td><td>50%</td></tr><tr><td>20%以上80%未満</td><td>65%</td></tr><tr><td>80%以上(関連グループ)</td><td>100%</td></tr></table></li>
<li>キャピタルロス:キャピタルゲインとのみ相殺。<b>3年繰戻し・5年繰越</b>(短期キャピタルロスとして)</li>
<li>Schedule M-1(または M-3):会計上の利益と課税所得の調整</li>
</ul>

<h3>2. S法人(<span class="en">S Corporation</span>)</h3>
<div class="pt"><b>適格要件</b>
<ul><li>国内法人</li><li>株主は<b>100人以下</b>(家族は1人とみなせる)</li>
<li>株主は個人(米国居住者・市民)、遺産財団、一定の信託など。<b>非居住外国人・法人・パートナーシップは不可</b></li>
<li><b>1種類の株式</b>のみ(議決権の有無の違いは可)</li></ul></div>
<p>所得は株主に配分(パススルー)し、法人段階では原則課税されない。</p>

<h3>3. パートナーシップ</h3>
<ul>
<li>出資時:原則として損益を認識しない。パートナーの持分の取得価額(outside basis)= 拠出資産の取得価額 + 負担する負債の持分 − 他のパートナーに引き受けられた負債</li>
<li><b>Guaranteed payments</b>:パートナーシップでは控除、パートナーには通常所得(自営業税の対象)</li>
</ul>
<p class="ex">例:25%のパートナーが、取得価額 $30,000(FMV $50,000)、負債 $10,000 付きの資産を拠出<br>outside basis = 30,000 − 10,000 + 10,000 × 25% = <b>$22,500</b></p>
`,
      mcq: [
        {
          q: "A C corporation owns 30% of another domestic corporation and receives dividends of $100,000. What is the dividends-received deduction, assuming no taxable income limitation applies?",
          ja: "C法人は他の内国法人の株式の30%を保有しており、$100,000の配当を受け取った。課税所得による制限はないものとして、受取配当金控除はいくらか。",
          c: ["$50,000", "$65,000", "$80,000", "$100,000"],
          a: 1,
          ex: "持株比率20%以上80%未満は65%。100,000 × 65% = $65,000。",
        },
        {
          q: "How may a C corporation use a net capital loss?",
          ja: "C法人は純キャピタルロスをどのように使えるか。",
          c: [
            "Deduct up to $3,000 against ordinary income and carry forward indefinitely",
            "Carry back 3 years and forward 5 years to offset capital gains only",
            "Carry forward 20 years against ordinary income",
            "Deduct in full against ordinary income in the current year",
          ],
          a: 1,
          ex: "法人のキャピタルロスはキャピタルゲインとのみ相殺でき、3年繰戻し・5年繰越。$3,000の通常所得との相殺は個人のルール。",
        },
        {
          q: "Which of the following would make a corporation ineligible to elect S corporation status?",
          ja: "次のうち、法人がS法人を選択できなくなる要因はどれか。",
          c: [
            "It has 90 shareholders",
            "It has voting and nonvoting common stock",
            "One of its shareholders is a nonresident alien",
            "One of its shareholders is an estate",
          ],
          a: 2,
          ex: "非居住外国人はS法人の株主になれない。100人以下の株主、議決権の有無のみが異なる普通株式、遺産財団の株主は認められる。",
        },
        {
          q: "A partner contributes property with an adjusted basis of $30,000 and a fair market value of $50,000, subject to a $10,000 liability assumed by the partnership, in exchange for a 25% interest. What is the partner's basis in the partnership interest?",
          ja: "パートナーが取得価額$30,000、時価$50,000の資産を、パートナーシップが引き受ける$10,000の負債付きで拠出し、25%の持分を取得した。パートナーの持分の取得価額はいくらか。",
          c: ["$20,000", "$22,500", "$30,000", "$42,500"],
          a: 1,
          ex: "30,000(拠出資産の取得価額)− 10,000(パートナーシップに引き受けられた負債)+ 2,500(負債のうち自分の持分25%)= $22,500。",
        },
        {
          q: "Guaranteed payments made by a partnership to a partner for services are:",
          ja: "パートナーシップがパートナーに役務の対価として支払うguaranteed paymentsはどう扱われるか。",
          c: [
            "Not deductible by the partnership and treated as a distribution",
            "Deductible by the partnership and ordinary income to the partner",
            "Deductible by the partnership and capital gain to the partner",
            "Excluded from the partner's income",
          ],
          a: 1,
          ex: "Guaranteed paymentsはパートナーシップの所得計算で控除され、受け取ったパートナーは通常所得(自営業税の対象)として申告する。",
        },
        {
          q: "What is the federal income tax rate for C corporations?",
          ja: "C法人の連邦法人税率は何%か。",
          c: ["Graduated rates from 15% to 35%", "A flat 21%", "A flat 25%", "A flat 35%"],
          a: 1,
          ex: "2018年以降、C法人の税率は21%の単一税率。",
        },
      ],
      cards: [
        ["Dividends-received deduction (DRD)", "受取配当金控除", "持株比率で50%/65%/100%"],
        ["S corporation", "S法人", "パススルー課税を選択した法人。株主100人以下"],
        ["Outside basis", "パートナーの持分の取得価額", "出資・負債の持分・所得配分で増減"],
        ["Guaranteed payment", "保証支払", "パートナーへの役務・資本の対価。控除可能"],
        ["Schedule M-1", "別表M-1", "会計上の利益と課税所得の調整表"],
        ["Pass-through entity", "パススルー事業体", "事業体段階で課税されず、出資者に所得を配分"],
      ],
    },
  ],
});
