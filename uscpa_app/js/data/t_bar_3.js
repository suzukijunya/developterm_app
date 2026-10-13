// BAR のTBS追加(企業結合・連結・ヘッジ・外貨・株式報酬・非継続事業・セグメント)

CPA.tbs({
  id: "TBS-BAR-50", section: "BAR", chapter: "BAR-02", title: "割安購入益と取得日の測定(NCI公正価値・条件付対価・IPR&D)",
  scenario: `<p>On January 1, Year 1, Pico Corp. acquired <b>80%</b> of the voting shares of Sable Inc. in a transaction accounted for as a business combination under ASC 805. Pico elected to measure the noncontrolling interest (NCI) at fair value.</p>
<table><tr><th>Exhibit 1 — Consideration and related items</th><th>Amount</th></tr>
<tr><td>Cash paid to Sable's former shareholders</td><td>$480,000</td></tr>
<tr><td>Contingent consideration (liability-classified; payable if Year 2 EBITDA exceeds a target) — acquisition-date fair value</td><td>$40,000</td></tr>
<tr><td>Fair value of the 20% NCI (based on quoted prices of shares not acquired)</td><td>$150,000</td></tr>
<tr><td>Legal and valuation fees paid by Pico</td><td>$25,000</td></tr></table>
<table><tr><th>Exhibit 2 — Sable, acquisition-date fair values</th><th>Amount</th></tr>
<tr><td>Current assets</td><td>$180,000</td></tr>
<tr><td>Property, plant and equipment</td><td>$520,000</td></tr>
<tr><td>Customer relationships (not recorded by Sable)</td><td>$90,000</td></tr>
<tr><td>In-process research and development (IPR&amp;D)</td><td>$60,000</td></tr>
<tr><td>Total liabilities assumed</td><td>$140,000</td></tr></table>
<p>Pico reassessed the identification and measurement of all assets, liabilities, NCI and consideration and confirmed the amounts above. <b>Exhibit 3 — Memo (July 15, Year 1):</b> A final appraisal, based on facts and circumstances that existed at the acquisition date, indicates that the acquisition-date fair value of the PP&amp;E was <b>$500,000</b>, not $520,000. The measurement period is still open.</p>
<p class="ja">1年目1月1日、Pico社はSable社の議決権株式の80%を取得した(ASC 805の企業結合)。Pico社は非支配持分(NCI)を公正価値で測定することを選択した。<br>
資料1:Sable社の旧株主への現金支払$480,000、条件付対価(負債分類。2年目のEBITDAが目標を超えた場合に支払う)の取得日公正価値$40,000、20%のNCIの公正価値$150,000(取得されなかった株式の市場価格に基づく)、Pico社が支払った法務・評価費用$25,000。<br>
資料2:Sable社の取得日公正価値は、流動資産$180,000、有形固定資産$520,000、顧客関係(Sable社では未計上)$90,000、仕掛研究開発(IPR&amp;D)$60,000、引受負債合計$140,000。<br>
Pico社はすべての資産・負債・NCI・対価の識別と測定を再検討し、上記金額を確認した。資料3(1年目7月15日のメモ):取得日に存在した事実に基づく最終鑑定の結果、有形固定資産の取得日公正価値は$520,000ではなく$500,000であった。測定期間はまだ終了していない。</p>`,
  rows: [
    { label: "Total consideration transferred(移転された対価の合計)", type: "num", answer: 520000 },
    { label: "Bargain purchase gain recognized at acquisition, before the measurement-period adjustment(測定期間の修正前の割安購入益)", type: "num", answer: 40000 },
    { label: "NCI reported in the acquisition-date consolidated balance sheet(取得日の連結貸借対照表の非支配持分)", type: "num", answer: 150000 },
    { label: "Identifiable intangible assets recognized (excluding goodwill)(のれん以外に認識する識別可能無形資産)", type: "num", answer: 150000 },
    { label: "Accounting for the $25,000 legal and valuation fees(法務・評価費用$25,000の会計処理)", type: "select", options: ["Included in consideration transferred", "Expensed as incurred", "Capitalized as part of goodwill", "Deducted from the bargain purchase gain"], answer: "Expensed as incurred" },
    { label: "Classification of the IPR&D until completion or abandonment(完成・中止までのIPR&Dの分類)", type: "select", options: ["Expensed immediately as R&D", "Indefinite-lived intangible asset (tested for impairment, not amortized)", "Finite-lived intangible asset amortized over 5 years", "Included in goodwill"], answer: "Indefinite-lived intangible asset (tested for impairment, not amortized)" },
    { label: "Bargain purchase gain as revised for the July 15 measurement-period adjustment(7月15日の測定期間の修正後の割安購入益)", type: "num", answer: 20000 },
  ],
  explain: `<p>移転対価 = 現金480,000 + 条件付対価の公正価値40,000 = <b>520,000</b>。取得関連費用は対価に含めない。</p>
<p>識別可能純資産 = 180,000 + 520,000 + 90,000 + 60,000 − 140,000 = 710,000。対価520,000 + NCI公正価値150,000 = 670,000 < 710,000 なので、のれんではなく割安購入益 <b>40,000</b> が生じる。再検討を行ったうえで、取得日に取得企業(Pico社)の損益に計上する。NCIは公正価値<b>150,000</b>のままで、割安購入益はNCIに配分しない。</p>
<p>識別可能無形資産 = 顧客関係90,000 + IPR&amp;D 60,000 = <b>150,000</b>。企業結合で取得したIPR&amp;Dは、完成または中止まで耐用年数を確定できない無形資産として計上し、償却せずに減損テストを行う(即時費用化はしない)。</p>
<p>法務・評価費用25,000は発生時に費用処理する(ASC 805-10-25-23)。</p>
<p>測定期間の修正:取得日に存在した事実に基づく情報なので、取得日の金額を遡って修正する。純資産は 710,000 − 20,000 = 690,000、割安購入益 = 690,000 − 670,000 = <b>20,000</b>。修正は判明した期間に認識し、過年度の再表示は行わない。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-51", section: "BAR", chapter: "BAR-02", title: "内部取引の設備売却と社債の擬制的償還(2年目の連結)",
  scenario: `<p>Perry Co. owns <b>90%</b> of Sloan Inc. (acquired several years ago; no remaining acquisition-date fair value differentials). The Year 2 consolidation (calendar year) involves the following intercompany items.</p>
<table><tr><th>Exhibit 1 — Intercompany equipment (upstream)</th><th>Detail</th></tr>
<tr><td>Date of transfer</td><td>January 1, Year 1</td></tr>
<tr><td>Sloan's original cost / accumulated depreciation at transfer</td><td>$150,000 / $70,000</td></tr>
<tr><td>Price paid by Perry</td><td>$120,000</td></tr>
<tr><td>Remaining useful life at transfer (straight-line, no salvage)</td><td>5 years</td></tr></table>
<table><tr><th>Exhibit 2 — Intercompany bonds</th><th>Detail</th></tr>
<tr><td>Bonds issued by Sloan in prior years; Perry bought $200,000 face on the open market on January 1, Year 2</td><td>Price paid: $190,000</td></tr>
<tr><td>Sloan's carrying amount of those bonds on January 1, Year 2</td><td>$206,000</td></tr>
<tr><td>Stated rate (paid annually Dec 31) / remaining term</td><td>8% / 4 years</td></tr>
<tr><td>Premium and discount amortization</td><td>Straight-line</td></tr></table>
<p><b>Exhibit 3 — Year 2 separate-company results:</b> Perry's income from its own operations (excluding any investment income from Sloan but including interest revenue on the Sloan bonds) was <b>$300,000</b>. Sloan reported net income of <b>$100,000</b>. Perry's policy assigns gains and losses on constructive retirement of debt to the issuer.</p>
<p class="ja">Perry社はSloan社の90%を保有している(数年前に取得し、取得日の公正価値差額は残っていない)。暦年の2年目の連結で、次の内部取引がある。<br>
資料1(上流の設備売却):1年目1月1日に移転。移転時のSloan社の取得原価$150,000、減価償却累計額$70,000。Perry社の支払額$120,000。移転時の残存耐用年数5年(定額法、残存価額なし)。<br>
資料2(内部社債):Sloan社が過年度に発行した社債のうち額面$200,000を、Perry社が2年目1月1日に市場で$190,000で購入した。同日のSloan社における当該社債の帳簿価額は$206,000。表面利率8%(毎年12月31日払い)、残存期間4年。プレミアムとディスカウントは定額法で償却する。<br>
資料3(2年目の個別業績):Perry社の自社営業利益(Sloan社からの投資利益を除き、Sloan社債の受取利息を含む)は$300,000、Sloan社の純利益は$100,000。Perry社は社債の擬制的償還損益を発行会社に帰属させる方針である。</p>`,
  rows: [
    { label: "Unrealized gain on equipment eliminated in the Year 1 consolidation(1年目連結で消去する設備の未実現利益)", type: "num", answer: 40000 },
    { label: "Year 2 worksheet: debit to beginning retained earnings/NCI for the equipment(2年目精算表:設備に係る期首利益剰余金・NCIへの借方)", type: "num", answer: 32000 },
    { label: "Year 2 worksheet: credit to accumulated depreciation(2年目精算表:減価償却累計額への貸方)", type: "num", answer: 54000 },
    { label: "Gain on constructive retirement of bonds in Year 2 consolidated income(2年目の連結損益の社債擬制的償還益)", type: "num", answer: 16000 },
    { label: "Interest revenue on Perry's books eliminated in Year 2(2年目に消去するPerry社の受取利息)", type: "num", answer: 18500 },
    { label: "Year 2 consolidated net income(2年目の連結純利益)", type: "num", answer: 420000 },
    { label: "Year 2 net income attributable to NCI(2年目の非支配持分に帰属する純利益)", type: "num", answer: 12000 },
  ],
  explain: `<p><b>設備</b>:Sloan社の簿価 = 150,000 − 70,000 = 80,000、売却益 = 120,000 − 80,000 = <b>40,000</b>(1年目に消去)。Perry社の減価償却 120,000 ÷ 5 = 24,000、連結上は 80,000 ÷ 5 = 16,000 で、毎年8,000ずつ実現する。</p>
<p>2年目の消去仕訳:期首時点の未実現利益は 40,000 − 8,000 = <b>32,000</b>(上流なので期首利益剰余金とNCIに按分して借方)。設備は取得原価150,000に戻すため借方30,000。累計額は連結上 70,000 + 16,000 × 2 = 102,000、Perry社の帳簿は 24,000 × 2 = 48,000 なので、貸方 <b>54,000</b>。減価償却費の貸方8,000。借方 30,000 + 32,000 = 貸方 54,000 + 8,000 で一致する。</p>
<p><b>社債</b>:連結上は2年目1月1日に償還したとみなす。償還益 = 帳簿価額206,000 − 支払額190,000 = <b>16,000</b>。Perry社の受取利息 = 表面利息16,000 + ディスカウント償却 10,000 ÷ 4 = <b>18,500</b>。Sloan社の支払利息 = 16,000 − プレミアム償却 6,000 ÷ 4 = 14,500。両者を消去すると連結利益は 18,500 − 14,500 = 4,000 減るので、社債の連結純利益への影響は 16,000 − 4,000 = +12,000(発行会社Sloan社に帰属)。</p>
<p>連結純利益 = 300,000 + 100,000 + 設備の実現8,000 + 社債12,000 = <b>420,000</b>。<br>
NCI = 10% × (100,000 + 8,000 + 12,000) = <b>12,000</b>(上流取引と発行会社帰属の社債損益はSloan社の利益を修正する)。親会社帰属は408,000となる。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-52", section: "BAR", chapter: "BAR-02", title: "連結精算表のレビュー:簡便法の修正仕訳と非支配持分の期末残高",
  scenario: `<p>On January 1, Year 1, Pratt Corp. acquired <b>75%</b> of Stone Co. for <b>$900,000</b> cash. The fair value of the 25% NCI was <b>$290,000</b>. Stone's book value was $1,000,000 (common stock $400,000; retained earnings $600,000). Stone's building was undervalued by <b>$80,000</b> (10-year remaining life, straight-line); all other book values equaled fair value. Pratt accounts for the investment using the <b>initial value (cost) method</b> in its own books.</p>
<table><tr><th>Stone</th><th>Net income</th><th>Dividends declared and paid</th></tr>
<tr><td>Year 1</td><td>$150,000</td><td>$40,000</td></tr>
<tr><td>Year 2</td><td>$180,000</td><td>$60,000</td></tr></table>
<p>Intercompany inventory at December 31, Year 2 (none at the end of Year 1): Stone's ending inventory includes goods bought from Pratt containing <b>$12,000</b> of unrealized gross profit; Pratt's ending inventory includes goods bought from Stone containing <b>$8,000</b> of unrealized gross profit.</p>
<p><b>Staff draft (for review):</b> "Goodwill $90,000; NCI in Year 2 net income $45,000 (25% × $180,000); Dec 31, Year 2 NCI $290,000 plus 25% of Stone's retained earnings growth; downstream profit allocated 75/25 between Pratt and NCI."</p>
<p class="ja">1年目1月1日、Pratt社はStone社の75%を現金$900,000で取得した。25%のNCIの公正価値は$290,000。Stone社の簿価は$1,000,000(資本金$400,000、利益剰余金$600,000)。建物が$80,000過小評価されていた(残存耐用年数10年、定額法)。他の簿価は公正価値と等しい。Pratt社は自社の帳簿で投資を簡便法(原価法)で処理している。<br>
Stone社の純利益と配当:1年目 純利益$150,000・配当$40,000、2年目 純利益$180,000・配当$60,000。<br>
2年目12月31日の内部棚卸(1年目末はなし):Stone社の期末棚卸にPratt社から仕入れた商品の未実現利益$12,000、Pratt社の期末棚卸にStone社から仕入れた商品の未実現利益$8,000が含まれる。<br>
担当者の草案(レビュー対象):「のれん$90,000。2年目のNCI純利益$45,000(25% × $180,000)。2年目末NCIは$290,000にStone社の利益剰余金増加額の25%を加算。下流取引の利益はPratt社とNCIに75/25で配分。」</p>`,
  rows: [
    { label: "Correct consolidated goodwill(正しい連結のれん)", type: "num", answer: 110000 },
    { label: "Unamortized building fair value adjustment at Dec 31, Year 2(2年目末の建物の公正価値差額の未償却残高)", type: "num", answer: 64000 },
    { label: "Conversion entry to Pratt's Jan 1, Year 2 retained earnings (initial value to equity basis)(簡便法から持分法ベースへの2年目期首利益剰余金の修正額)", type: "num", answer: 76500 },
    { label: "Dividend income on Pratt's books eliminated in Year 2(2年目に消去するPratt社の受取配当)", type: "num", answer: 45000 },
    { label: "Correct Year 2 net income attributable to NCI(正しい2年目の非支配持分帰属純利益)", type: "num", answer: 41000 },
    { label: "Correct NCI balance at Dec 31, Year 2(正しい2年目末の非支配持分残高)", type: "num", answer: 341500 },
    { label: "Allocation of the $12,000 downstream unrealized profit(下流取引の未実現利益$12,000の配分)", type: "select", options: ["75% to Pratt and 25% to NCI", "Entirely to the controlling interest (Pratt)", "Entirely to the NCI", "Not eliminated because Stone is the buyer"], answer: "Entirely to the controlling interest (Pratt)" },
  ],
  explain: `<p>取得日の公正価値総額 = 900,000 + 290,000 = 1,190,000。識別可能純資産 = 1,000,000 + 80,000 = 1,080,000。のれん = <b>110,000</b>(草案の90,000は親会社分 900,000 − 75% × 1,080,000 だけで、NCI分20,000が漏れている)。</p>
<p>建物の差額償却は年8,000。2年目末の未償却残高 = 80,000 − 8,000 × 2 = <b>64,000</b>。</p>
<p>修正仕訳(*C):1年目のStone社の利益剰余金増加 150,000 − 40,000 = 110,000 から償却8,000を引いた102,000の75% = <b>76,500</b> をPratt社の期首利益剰余金に加える(1年目末に内部未実現利益はない)。</p>
<p>簡便法ではPratt社は配当を収益計上しているため、2年目の受取配当 75% × 60,000 = <b>45,000</b> を消去する。</p>
<p>2年目のNCI純利益 = 25% × (180,000 − 償却8,000 − 上流の未実現利益8,000) = 25% × 164,000 = <b>41,000</b>。下流取引の未実現利益12,000は売り手である親会社が負担し、<b>全額を支配持分に配分</b>する。</p>
<p>NCI残高 = 290,000 + 1年目 25% × (150,000 − 8,000) 35,500 − 配当10,000 + 2年目 41,000 − 配当15,000 = <b>341,500</b>。<br>
検算:25% × (2年目末Stone社純資産1,230,000 + 未償却差額64,000 − 上流未実現8,000) + NCI分のれん20,000 = 321,500 + 20,000 = 341,500。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-53", section: "BAR", chapter: "BAR-02", title: "VIEの主たる受益者の判定グリッドと初度連結",
  scenario: `<p>Harbor Inc., a public company, has relationships with five legal entities. For each, the controller prepared a summary (Exhibit 1). Harbor is not under common control with any of the entities.</p>
<table><tr><th>Entity</th><th>Facts</th></tr>
<tr><td>Lessor LLC</td><td>Owns one building leased to Harbor. Equity investment at risk is 2% of total assets; the rest is financed by a bank loan. Harbor guarantees the building's residual value and, under the lease, directs leasing decisions, capital improvements and maintenance.</td></tr>
<tr><td>Delta Partners</td><td>Equity at risk is 30% of total assets and Delta has obtained non-recourse financing on its own. The equity holders, through voting rights, direct the significant activities, absorb expected losses and receive residual returns. Harbor owns 15% of the voting equity.</td></tr>
<tr><td>Fund One</td><td>A VIE. Harbor holds subordinated notes that absorb most of the expected losses. An unrelated asset manager (with substantive authority that cannot be removed) makes all investment decisions that most significantly affect performance.</td></tr>
<tr><td>Servicer Trust</td><td>A VIE. Harbor services the receivables and directs the activities that most significantly affect performance. Harbor's only interest is a market-rate fee that is commensurate with its services; Harbor holds no other interests.</td></tr>
<tr><td>JV Energy</td><td>A VIE. Harbor and an unrelated party each hold 50% of the subordinated interests. All decisions on the significant activities require the consent of both parties.</td></tr></table>
<p><b>Exhibit 2 — Initial consolidation of Lessor LLC:</b> Lessor LLC does not meet the definition of a business. On the date Harbor became the primary beneficiary, the fair values were: building $1,050,000; bank loan $980,000; equity interests held by the unrelated owners (NCI) $20,000. Harbor paid no consideration and had no previously held equity interest.</p>
<p class="ja">上場会社のHarbor社は5つの事業体と関係がある(資料1)。Harbor社はいずれの事業体とも共通支配下にない。<br>
Lessor LLC:Harbor社に賃貸する建物を1棟保有。リスクにさらされた持分投資は総資産の2%で、残りは銀行借入。Harbor社が建物の残存価額を保証し、リース契約に基づき賃貸の決定・資本的改良・維持管理を指示している。<br>
Delta Partners:リスクにさらされた持分は総資産の30%で、自力でノンリコース融資を得ている。持分保有者が議決権により重要な活動を指示し、予想損失を負担し残余リターンを受け取る。Harbor社は議決権持分の15%を保有する。<br>
Fund One:VIE。Harbor社は予想損失の大部分を負担する劣後債を保有する。業績に最も重要な影響を与える投資決定はすべて、関係のない資産運用会社(解任できない実質的な権限を持つ)が行う。<br>
Servicer Trust:VIE。Harbor社は債権を回収管理し、業績に最も重要な影響を与える活動を指示する。Harbor社の唯一の持分は役務に見合う市場水準の報酬で、他の持分はない。<br>
JV Energy:VIE。Harbor社と関係のない相手方がそれぞれ劣後持分の50%を保有し、重要な活動の決定はすべて両者の同意を要する。<br>
資料2(Lessor LLCの初度連結):Lessor LLCは事業の定義を満たさない。Harbor社が主たる受益者となった日の公正価値は、建物$1,050,000、銀行借入$980,000、関係のない所有者の持分(NCI)$20,000。Harbor社は対価を支払っておらず、既存の持分もない。</p>`,
  rows: [
    { label: "Lessor LLC — conclusion for Harbor(Lessor LLCに関するHarbor社の結論)", type: "select", options: ["Consolidate as primary beneficiary", "Not a VIE — apply the voting interest model", "Not primary beneficiary — lacks power", "Not primary beneficiary — lacks a potentially significant economic interest", "No party consolidates — power is shared"], answer: "Consolidate as primary beneficiary" },
    { label: "Delta Partners — conclusion for Harbor(Delta Partnersに関する結論)", type: "select", options: ["Consolidate as primary beneficiary", "Not a VIE — apply the voting interest model", "Not primary beneficiary — lacks power", "Not primary beneficiary — lacks a potentially significant economic interest", "No party consolidates — power is shared"], answer: "Not a VIE — apply the voting interest model" },
    { label: "Fund One — conclusion for Harbor(Fund Oneに関する結論)", type: "select", options: ["Consolidate as primary beneficiary", "Not a VIE — apply the voting interest model", "Not primary beneficiary — lacks power", "Not primary beneficiary — lacks a potentially significant economic interest", "No party consolidates — power is shared"], answer: "Not primary beneficiary — lacks power" },
    { label: "Servicer Trust — conclusion for Harbor(Servicer Trustに関する結論)", type: "select", options: ["Consolidate as primary beneficiary", "Not a VIE — apply the voting interest model", "Not primary beneficiary — lacks power", "Not primary beneficiary — lacks a potentially significant economic interest", "No party consolidates — power is shared"], answer: "Not primary beneficiary — lacks a potentially significant economic interest" },
    { label: "JV Energy — conclusion for Harbor(JV Energyに関する結論)", type: "select", options: ["Consolidate as primary beneficiary", "Not a VIE — apply the voting interest model", "Not primary beneficiary — lacks power", "Not primary beneficiary — lacks a potentially significant economic interest", "No party consolidates — power is shared"], answer: "No party consolidates — power is shared" },
    { label: "Goodwill recognized on initial consolidation of Lessor LLC(Lessor LLCの初度連結で認識するのれん)", type: "num", answer: 0 },
    { label: "Gain recognized by Harbor on initial consolidation of Lessor LLC(Lessor LLCの初度連結でHarbor社が認識する利益)", type: "num", answer: 50000 },
  ],
  explain: `<p>主たる受益者は、(1) VIEの経済的成果に最も重要な影響を与える活動を指示する<b>パワー</b>と、(2) VIEにとって潜在的に重要となりうる損失を負担する義務または便益を受け取る権利の<b>両方</b>を持つ者である(ASC 810-10-25-38A)。</p>
<p>Lessor LLC:持分投資2%では劣後的支援なしに活動資金を賄えずVIEに該当する。Harbor社は賃貸・改良・維持の指示権(パワー)と残存価額保証(重要な損失負担)を持つので<b>主たる受益者として連結</b>する。</p>
<p>Delta Partners:持分が十分で、持分保有者がパワー・損失負担・残余リターンを持つためVIEではない。<b>議決権モデル</b>を適用し、15%保有では連結しない。</p>
<p>Fund One:Harbor社は重要な経済的持分を持つが、パワーは解任不能な資産運用会社にあるので<b>パワーがなく</b>主たる受益者ではない。</p>
<p>Servicer Trust:Harbor社はパワーを持つが、役務に見合う市場水準の報酬のみで他の持分がないため、報酬は変動持分に当たらず<b>重要な経済的持分がない</b>。</p>
<p>JV Energy:重要な決定がすべて関係のない二者の同意を要するので<b>パワーは共有</b>され、どちらも主たる受益者にならない。</p>
<p>初度連結:事業でないVIEの連結ではのれんを認識しない(<b>0</b>)。対価の公正価値0 + NCIの公正価値20,000 + 既存持分0 = 20,000 と、識別可能純資産 1,050,000 − 980,000 = 70,000 との差額 <b>50,000</b> を利益として認識する(ASC 810-10-30-4)。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-54", section: "BAR", chapter: "BAR-02", title: "報告単位別ののれん減損(1ステップ)と非公開会社の代替処理",
  scenario: `<p><b>Part A.</b> Vega Corp., a public business entity, performs its annual goodwill impairment test at December 31, Year 3. Vega bypassed the qualitative assessment for Alpha and Beta and performed the quantitative test. For Gamma, the qualitative assessment concluded that it is <b>not more likely than not</b> that Gamma's fair value is less than its carrying amount. Data:</p>
<table><tr><th>Reporting unit</th><th>Carrying amount (including goodwill)</th><th>Goodwill included</th><th>Fair value of the unit</th></tr>
<tr><td>Alpha</td><td>$2,400,000</td><td>$500,000</td><td>$2,100,000</td></tr>
<tr><td>Beta</td><td>$1,800,000</td><td>$200,000</td><td>$1,500,000</td></tr>
<tr><td>Gamma</td><td>$1,200,000</td><td>$150,000</td><td>$1,350,000</td></tr></table>
<p>Ignore income tax effects.</p>
<p><b>Part B.</b> Lynx Co., a private company, elected the private company accounting alternative for goodwill (amortization over 10 years, impairment testing at the entity level only upon a triggering event). Lynx recognized goodwill of <b>$360,000</b> on January 1, Year 1. A triggering event occurred on December 31, Year 3. After recording Year 3 amortization, Lynx's entity-level carrying amount (including goodwill) was <b>$1,900,000</b> and its fair value was <b>$1,700,000</b>.</p>
<p class="ja">A:上場企業(公開事業体)Vega社は3年目12月31日に年次ののれん減損テストを行う。AlphaとBetaは定性的評価を省略して定量的テストを行った。Gammaは定性的評価により、公正価値が帳簿価額を下回る可能性が50%超ではないと結論した。データ:Alpha 帳簿価額(のれん含む)$2,400,000・うちのれん$500,000・公正価値$2,100,000。Beta $1,800,000・$200,000・$1,500,000。Gamma $1,200,000・$150,000・$1,350,000。税効果は無視する。<br>
B:非公開会社Lynx社は、のれんの非公開会社向け代替処理(10年償却、トリガー事象発生時のみ企業単位で減損テスト)を選択した。1年目1月1日にのれん$360,000を認識した。3年目12月31日にトリガー事象が発生した。3年目の償却計上後、企業単位の帳簿価額(のれん含む)は$1,900,000、公正価値は$1,700,000であった。</p>`,
  rows: [
    { label: "Goodwill impairment — Alpha(Alphaののれん減損損失)", type: "num", answer: 300000 },
    { label: "Goodwill impairment — Beta(Betaののれん減損損失)", type: "num", answer: 200000 },
    { label: "Required action for Gamma(Gammaに必要な対応)", type: "select", options: ["Perform the quantitative test anyway", "No further testing; no impairment", "Recognize impairment equal to $150,000", "Measure implied goodwill (former Step 2)"], answer: "No further testing; no impairment" },
    { label: "Total goodwill impairment for Vega, Year 3(Vega社の3年目ののれん減損合計)", type: "num", answer: 500000 },
    { label: "Lynx goodwill carrying amount before the impairment test(減損テスト前のLynx社ののれん帳簿価額)", type: "num", answer: 252000 },
    { label: "Lynx goodwill impairment loss(Lynx社ののれん減損損失)", type: "num", answer: 200000 },
    { label: "Lynx goodwill amortization for Year 4(Lynx社の4年目ののれん償却額)", type: "num", answer: 7429, tol: 1 },
  ],
  explain: `<p>ASU 2017-04後の1ステップ方式:減損損失 = 報告単位の帳簿価額 − 公正価値。ただし当該報告単位に配分されたのれんの額を上限とする。</p>
<p>Alpha:2,400,000 − 2,100,000 = <b>300,000</b>(のれん500,000以内)。<br>
Beta:1,800,000 − 1,500,000 = 300,000 だが上限はのれん200,000なので <b>200,000</b>。<br>
Gamma:定性的評価で「50%超ではない」と結論したので定量的テストは不要で、<b>減損なし</b>(公正価値も帳簿価額を上回る)。旧ステップ2(含意されたのれんの測定)は廃止された。<br>
合計 = 300,000 + 200,000 = <b>500,000</b>。</p>
<p>Lynx社:年間償却 360,000 ÷ 10 = 36,000。3年目末の残高 = 360,000 − 36,000 × 3 = <b>252,000</b>。減損 = 1,900,000 − 1,700,000 = <b>200,000</b>(252,000以内)。減損後の残高52,000は残存期間7年で引き続き償却するので、4年目の償却 = 52,000 ÷ 7 ≒ <b>7,429</b>。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-55", section: "BAR", chapter: "BAR-02", title: "金利スワップによる固定利付債務の公正価値ヘッジの仕訳金額",
  scenario: `<p>On January 1, Year 1, Kestrel Corp. issued a <b>$1,000,000</b>, 5-year note at par with a fixed rate of <b>6%</b>, interest payable each December 31. On the same date Kestrel entered into an interest rate swap (notional $1,000,000, 5 years) under which it <b>receives 6% fixed and pays a variable rate</b> (SOFR-based), settled net each December 31. The variable rate is reset each December 31 for the following year. The swap had zero fair value at inception. Kestrel designated the swap as a <b>fair value hedge</b> of changes in the fair value of the note attributable to changes in the benchmark interest rate; all hedge criteria are met and the hedge is perfectly effective.</p>
<table><tr><th>Exhibit — Market data</th><th>Year 1</th><th>Year 2</th></tr>
<tr><td>Variable rate applicable for the year</td><td>6%</td><td>5% (reset Dec 31, Year 1)</td></tr>
<tr><td>Swap fair value at year-end (after net settlement) — asset</td><td>$38,000</td><td>$26,000</td></tr>
<tr><td>Change in note's fair value attributable to the benchmark rate</td><td>+$38,000</td><td>−$12,000</td></tr></table>
<p class="ja">1年目1月1日、Kestrel社は額面$1,000,000、期間5年、固定利率6%(毎年12月31日利払い)の手形を額面で発行した。同日、想定元本$1,000,000・期間5年の金利スワップ(6%固定受取・変動(SOFRベース)支払、毎年12月31日に純額決済)を締結した。変動金利は毎年12月31日に翌年分が改定される。開始時のスワップの公正価値はゼロ。Kestrel社はベンチマーク金利の変動による手形の公正価値の変動に対する<b>公正価値ヘッジ</b>としてスワップを指定し、要件をすべて満たし、ヘッジは完全に有効である。<br>
市場データ:適用変動金利 1年目6%、2年目5%(1年目12月31日改定)。年度末のスワップ公正価値(純額決済後、資産)1年目$38,000、2年目$26,000。ベンチマーク金利に起因する手形の公正価値変動 1年目+$38,000、2年目−$12,000。</p>`,
  rows: [
    { label: "Net swap settlement received (paid) on Dec 31, Year 1(1年目12月31日のスワップ純額決済額)", type: "num", answer: 0 },
    { label: "Gain on the swap recognized in Year 1(1年目に認識するスワップの利益)", type: "num", answer: 38000 },
    { label: "Carrying amount of the note at Dec 31, Year 1(1年目末の手形の帳簿価額)", type: "num", answer: 1038000 },
    { label: "Net effect on Year 1 earnings of the fair value changes of swap and note(1年目のスワップと手形の公正価値変動の損益への純影響)", type: "num", answer: 0 },
    { label: "Net swap settlement received on Dec 31, Year 2(2年目12月31日に受け取るスワップ純額決済額)", type: "num", answer: 10000 },
    { label: "Net interest expense reported for Year 2(2年目に計上する純支払利息)", type: "num", answer: 50000 },
    { label: "Income statement presentation of the swap's fair value change (ASU 2017-12)(スワップの公正価値変動の損益計算書上の表示)", type: "select", options: ["Other comprehensive income until the note matures", "Same line item as the hedged item's earnings effect (interest expense)", "Separate line item: hedge ineffectiveness", "Directly in retained earnings"], answer: "Same line item as the hedged item's earnings effect (interest expense)" },
  ],
  explain: `<p>1年目の変動金利は6%で固定受取6%と同じなので純額決済は <b>0</b>。支払利息は表面利息60,000のみ。</p>
<p>1年目末、金利低下でスワップ(固定受取)は資産38,000となり、スワップ利益 <b>38,000</b> を損益に計上する(Dr スワップ 38,000 / Cr 利益)。公正価値ヘッジでは被ヘッジ項目の手形もヘッジ対象リスクに起因する変動分だけ帳簿価額を修正する(Dr 損失 38,000 / Cr 手形 38,000)。手形の帳簿価額 = 1,000,000 + 38,000 = <b>1,038,000</b>。両者は相殺され損益への純影響は <b>0</b>。</p>
<p>2年目:受取 6% − 支払 5% = 1% × 1,000,000 = <b>10,000</b> を受け取る。純支払利息 = 60,000 − 10,000 = <b>50,000</b>。スワップの公正価値減少12,000と手形の帳簿価額減少12,000は相殺される(手形の帳簿価額は1,026,000)。結果として変動金利で借りたのと同じ利息負担となる。</p>
<p>ASU 2017-12により、ヘッジ手段の公正価値変動は被ヘッジ項目の損益影響と<b>同じ表示科目(支払利息)</b>に表示する。OCIに繰り延べるのはキャッシュフロー・ヘッジである。</p>`,
});

CPA.tbs({
  id: "TBS-BAR-56", section: "BAR", chapter: "BAR-02", title: "在外子会社の再測定(テンポラル法)と換算の比較",
  scenario: `<p>Atlas Inc. (U.S.) owns 100% of Bravo Ltd., located in Country X. Bravo keeps its books in the local currency unit (LCU). Bravo mainly resells products shipped from Atlas, its sales are priced in U.S. dollars, and its financing comes from Atlas; management has concluded that Bravo's <b>functional currency is the U.S. dollar</b>.</p>
<table><tr><th>Bravo — Dec 31, Year 3 balances</th><th>LCU</th><th>Relevant historical rate ($/LCU)</th></tr>
<tr><td>Cash</td><td>100,000</td><td>—</td></tr>
<tr><td>Inventory (at cost; acquired when rate was 0.50)</td><td>80,000</td><td>0.50</td></tr>
<tr><td>Equipment, cost</td><td>400,000</td><td>0.55</td></tr>
<tr><td>Accumulated depreciation</td><td>(100,000)</td><td>0.55</td></tr>
<tr><td>Accounts payable</td><td>90,000</td><td>—</td></tr>
<tr><td>Common stock</td><td>200,000</td><td>0.60</td></tr></table>
<p>Year 3 depreciation expense was <b>40,000 LCU</b>. Exchange rates ($ per LCU): Dec 31, Year 3 current rate <b>0.45</b>; Year 3 weighted-average rate <b>0.48</b>.</p>
<p class="ja">米国のAtlas社はX国のBravo社を100%保有する。Bravo社は現地通貨(LCU)で記帳している。Bravo社は主にAtlas社から出荷された製品を再販し、売上はドル建て、資金はAtlas社から調達しているため、経営者はBravo社の<b>機能通貨は米ドル</b>であると結論した。<br>
Bravo社の3年目12月31日残高:現金100,000 LCU、棚卸資産80,000 LCU(原価、レート0.50の時に取得)、設備取得原価400,000 LCU(0.55)、減価償却累計額(100,000) LCU(0.55)、買掛金90,000 LCU、資本金200,000 LCU(0.60)。3年目の減価償却費は40,000 LCU。為替レート($/LCU):3年目12月31日の決算日レート0.45、3年目の加重平均レート0.48。</p>`,
  rows: [
    { label: "Method required to convert Bravo's books into U.S. dollars(Bravo社の帳簿をドルにする方法)", type: "select", options: ["Translation (current rate method); adjustment to OCI", "Remeasurement (temporal method); gain or loss in net income", "Remeasurement into LCU, then translation", "No conversion needed"], answer: "Remeasurement (temporal method); gain or loss in net income" },
    { label: "Cash in U.S. dollars(現金のドル額)", type: "num", answer: 45000 },
    { label: "Inventory in U.S. dollars(棚卸資産のドル額)", type: "num", answer: 40000 },
    { label: "Equipment, net, in U.S. dollars(設備(純額)のドル額)", type: "num", answer: 165000 },
    { label: "Year 3 depreciation expense in U.S. dollars(3年目の減価償却費のドル額)", type: "num", answer: 22000 },
    { label: "Equipment, net, if the LCU were the functional currency(機能通貨がLCUだった場合の設備(純額)のドル額)", type: "num", answer: 135000 },
    { label: "If Country X's cumulative 3-year inflation exceeded 100% and Bravo's functional currency had been the LCU(X国の3年間累積インフレ率が100%超で、機能通貨がLCUであった場合)", type: "select", options: ["Translate using the current rate method; adjustment to CTA", "Remeasure as if the U.S. dollar were the functional currency", "Restate for inflation, then translate", "Use the average rate for all accounts"], answer: "Remeasure as if the U.S. dollar were the functional currency" },
  ],
  explain: `<p>機能通貨がドルで帳簿がLCUなので、ドルへの<b>再測定(テンポラル法)</b>を行い、再測定損益は<b>当期純利益</b>に計上する(ASC 830-10-45-17)。換算(決算日レート法)とCTA(OCI)は機能通貨が外貨の場合の方法である。</p>
<p>貨幣性項目は決算日レート:現金 100,000 × 0.45 = <b>45,000</b>、買掛金 90,000 × 0.45 = 40,500。<br>
非貨幣性項目は取得時の歴史的レート:棚卸資産(原価) 80,000 × 0.50 = <b>40,000</b>。設備純額 (400,000 − 100,000) × 0.55 = <b>165,000</b>。減価償却費も関連資産の歴史的レートを用いる:40,000 × 0.55 = <b>22,000</b>(平均レートではない)。</p>
<p>機能通貨がLCUなら資産・負債はすべて決算日レートで換算する:300,000 × 0.45 = <b>135,000</b>。差額はCTAとしてOCIに計上される。</p>
<p>超インフレ経済(3年間の累積インフレ率が約100%超)では、在外事業体の財務諸表は報告通貨が機能通貨であるかのように<b>再測定</b>する(ASC 830-10-45-11)。</p>`,
});
