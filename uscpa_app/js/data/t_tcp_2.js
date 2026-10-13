// TCP のTBS追加(事業体の税務計画:§351・M-1・E&P・償還・清算・パートナーシップ・S法人・事業体選択と州税)

CPA.tbs({ id: "TBS-TCP-31", section: "TCP", chapter: "TCP-02", title: "§351:複数の移転者・ブート・§357(c)の負債超過と役務提供者",
  scenario: `<p>On March 1, 2026, four individuals formed Newco, Inc. Each share of Newco common stock has a fair market value of <b>$1,000</b>. Newco issued only common stock and assumed the mortgages shown. The mortgages were incurred for business reasons several years ago (no tax-avoidance purpose).</p>
<table><tr><th>Transferor</th><th>Item transferred</th><th>FMV</th><th>Adjusted basis</th><th>Mortgage assumed by Newco</th><th>Received from Newco</th></tr>
<tr><td>Ava</td><td>Land (held 6 years)</td><td>$300,000</td><td>$120,000</td><td>$80,000</td><td>220 shares</td></tr>
<tr><td>Ben</td><td>Equipment (cost $130,000; accumulated depreciation $70,000)</td><td>$150,000</td><td>$60,000</td><td>—</td><td>120 shares + $30,000 cash</td></tr>
<tr><td>Cara</td><td>Building (held 9 years)</td><td>$200,000</td><td>$50,000</td><td>$90,000</td><td>110 shares</td></tr>
<tr><td>Dan</td><td>Services (organizing Newco)</td><td>$25,000</td><td>—</td><td>—</td><td>25 shares</td></tr></table>
<p>Immediately after the exchange Newco has 475 shares outstanding.</p>
<p class="ja">2026年3月1日、4名の個人がNewco社を設立した。普通株式1株の時価は$1,000である。Newcoは普通株式のみを発行し、表の抵当債務を引き受けた。債務は数年前に事業目的で生じたもの(租税回避目的なし)である。Ava:土地(保有6年、時価$300,000、基準価額$120,000、債務$80,000)→220株。Ben:設備(取得原価$130,000、減価償却累計額$70,000、時価$150,000、基準価額$60,000)→120株と現金$30,000。Cara:建物(保有9年、時価$200,000、基準価額$50,000、債務$90,000)→110株。Dan:設立に関する役務(時価$25,000)→25株。交換直後の発行済株式は475株である。</p>`,
  rows: [
    { label: "Does §351 apply to the property transferors?(財産移転者に§351が適用されるか)", type: "select", options: ["Yes — property transferors own 450 of 475 shares (94.7%), which meets the 80% control test", "No — Dan's shares count toward control only if he also transfers property, so control is 75%", "No — receipt of cash boot by Ben disqualifies the entire exchange", "Yes — but only for Ava and Cara because Ben received boot"], answer: "Yes — property transferors own 450 of 475 shares (94.7%), which meets the 80% control test" },
    { label: "Ben's recognized gain(Benの認識利得)", type: "num", answer: 30000 },
    { label: "Character of Ben's recognized gain(Benの認識利得の性質)", type: "select", options: ["Long-term capital gain", "Ordinary income (§1245 depreciation recapture)", "§1231 gain", "Unrecaptured §1250 gain taxed at 25%"], answer: "Ordinary income (§1245 depreciation recapture)" },
    { label: "Cara's recognized gain(Caraの認識利得)", type: "num", answer: 40000 },
    { label: "Ava's basis in her Newco stock(AvaのNewco株式の基準価額)", type: "num", answer: 40000 },
    { label: "Cara's basis in her Newco stock(CaraのNewco株式の基準価額)", type: "num", answer: 0 },
    { label: "Newco's basis in the equipment received from Ben(NewcoがBenから受けた設備の基準価額)", type: "num", answer: 90000 },
    { label: "Newco's basis in the building received from Cara(NewcoがCaraから受けた建物の基準価額)", type: "num", answer: 90000 },
  ],
  explain: `<p><b>支配要件</b>:財産を移転した者(Ava・Ben・Cara)の取得株式は 220 + 120 + 110 = 450株で、450 ÷ 475 = 94.7% ≥ 80%。役務のみ提供したDanの25株は支配の判定に含めないが、それでも80%を超えるため§351が適用される。Danは役務の対価として時価$25,000を通常所得として認識し、株式の基準価額は$25,000となる。</p>
<p><b>Ben</b>:実現利得 = 150,000 − 60,000 = 90,000。認識額はブート(現金)の範囲で <b>30,000</b>。設備の減価償却累計額70,000まではリキャプチャーの対象なので、30,000全額が§1245の<b>通常所得</b>である。株式の基準価額 = 60,000 + 30,000 − 30,000 = 60,000。Newcoの設備の基準価額 = 移転者の基準価額60,000 + 移転者の認識利得30,000 = <b>90,000</b>(§362)。</p>
<p><b>Ava</b>:引受債務80,000 ≤ 基準価額120,000 なので§357(a)によりブートとならず利得なし。株式の基準価額 = 120,000 − 80,000 = <b>40,000</b>。</p>
<p><b>Cara</b>:引受債務90,000が基準価額50,000を超えるため、§357(c)により超過額 <b>40,000</b> を利得として認識する。株式の基準価額 = 50,000 + 40,000 − 90,000 = <b>0</b>。Newcoの建物の基準価額 = 50,000 + 40,000 = <b>90,000</b>。</p>`,
});

CPA.tbs({ id: "TBS-TCP-32", section: "TCP", chapter: "TCP-02", title: "帳簿利益からの課税所得とSchedule M-1(寄附金1%フロア・DRD・資本損失・NOL)",
  scenario: `<p>Harbor Corp., a calendar-year C corporation, reports <b>net income per books of $600,000</b> for 2026. The controller's memo lists the following items reflected in book income:</p>
<table><tr><th>Item</th><th>Book amount</th><th>Notes</th></tr>
<tr><td>Federal income tax expense</td><td>$160,000</td><td>Current and deferred</td></tr>
<tr><td>Interest on municipal bonds</td><td>$12,000</td><td>Tax-exempt</td></tr>
<tr><td>Dividends from a domestic corporation (Harbor owns 25%)</td><td>$50,000</td><td>Qualifies for the 65% DRD</td></tr>
<tr><td>Premiums on key-person life insurance (Harbor is beneficiary)</td><td>$8,000</td><td>Expense</td></tr>
<tr><td>Business meals</td><td>$20,000</td><td>50% deductible</td></tr>
<tr><td>Loss on sale of stock investments</td><td>$30,000</td><td>No capital gains in 2026</td></tr>
<tr><td>Cash contributions to public charities</td><td>$70,000</td><td>Paid in 2026</td></tr>
<tr><td>Depreciation expense</td><td>$90,000</td><td>Tax (MACRS) depreciation is $140,000</td></tr>
<tr><td>Fines paid to a state agency</td><td>$5,000</td><td>Violation of law</td></tr></table>
<p>Harbor has a <b>$100,000 NOL carryforward</b> arising in 2022 (the 80% limitation is not binding). Under the One Big Beautiful Bill Act, for tax years beginning after 2025 a corporation's charitable deduction equals contributions (up to 10% of the limitation base) <b>reduced by 1% of the limitation base</b>. The limitation base is taxable income computed without the charitable deduction and the DRD but after the NOL carryforward deduction.</p>
<p class="ja">暦年のC法人Harbor社の2026年の帳簿上の当期純利益は$600,000である。帳簿利益に含まれる項目:法人税費用$160,000、地方債利息$12,000(非課税)、25%保有の内国法人からの配当$50,000(65%のDRD対象)、Harbor社が受取人の役員保険料$8,000、事業上の飲食費$20,000(50%控除)、投資株式の売却損$30,000(当期のキャピタルゲインなし)、公益慈善団体への現金寄附$70,000、減価償却費$90,000(税務上のMACRSは$140,000)、州機関への罰金$5,000。2022年発生のNOL繰越$100,000がある(80%制限は影響しない)。OBBBAにより2025年後開始事業年度から、法人の寄附金控除は「限度基準額の10%を上限とする寄附金」から「限度基準額の1%」を差し引いた額となる。限度基準額は寄附金控除とDRDを除き、NOL繰越控除後で計算した課税所得とする。</p>`,
  rows: [
    { label: "Charitable contribution deduction(寄附金控除額)", type: "num", answer: 62790 },
    { label: "Dividends-received deduction(受取配当控除額)", type: "num", answer: 32500 },
    { label: "Taxable income(課税所得)", type: "num", answer: 625710 },
    { label: "Schedule M-1, line 3: excess of capital losses over capital gains(M-1 3行:資本損失の超過額)", type: "num", answer: 30000 },
    { label: "Schedule M-1, line 5: expenses recorded on books not deducted on return(M-1 5行:帳簿上費用で申告上控除されないもの)", type: "num", answer: 30210 },
    { label: "Schedule M-1, line 10: income (Form 1120, line 28)(M-1 10行:Form 1120 28行の所得)", type: "num", answer: 758210 },
    { label: "Treatment of the $7,210 disallowed by the 1% floor(1%フロアで否認された$7,210の扱い)", type: "select", options: ["Carried forward 5 years in all cases", "Permanently disallowed, because Harbor's contributions did not exceed the 10% limit", "Carried back 3 years and forward 5 years", "Deductible as an ordinary business expense"], answer: "Permanently disallowed, because Harbor's contributions did not exceed the 10% limit" },
    { label: "Treatment of the $30,000 net capital loss(純資本損失$30,000の扱い)", type: "select", options: ["Deducted up to $3,000; the rest carried forward indefinitely", "Carried back 3 years and forward 5 years as a short-term capital loss", "Fully deductible against ordinary income", "Carried forward 20 years as an NOL"], answer: "Carried back 3 years and forward 5 years as a short-term capital loss" },
  ],
  explain: `<p><b>寄附金・DRD・NOL控除前の課税所得</b>:600,000 + 法人税160,000 + 資本損失30,000 + 寄附金70,000 + 役員保険料8,000 + 飲食費の非控除分10,000 + 罰金5,000 − 非課税利息12,000 − 減価償却の差額50,000 = 821,000。</p>
<p><b>寄附金</b>:限度基準額 = 821,000 − NOL繰越100,000 = 721,000。10%上限72,100 ≥ 寄附金70,000、1%フロア = 7,210。控除額 = 70,000 − 7,210 = <b>62,790</b>。法人の寄附金が10%上限を超える場合に限り1%フロア否認額も繰越しできるが、本問では超えていないため7,210は<b>永久に否認</b>される。</p>
<p><b>DRD</b>:50,000 × 65% = <b>32,500</b>(課税所得制限65% × 758,210 = 492,837 を下回るため制限なし)。</p>
<p><b>課税所得</b> = 821,000 − 62,790 − 32,500 − 100,000 = <b>625,710</b>(税額は21%で131,399)。</p>
<p><b>M-1</b>:3行 = <b>30,000</b>。5行 = 役員保険料8,000 + 飲食費10,000 + 罰金5,000 + 寄附金の超過7,210 = <b>30,210</b>。7行 = 非課税利息12,000、8行 = 減価償却50,000。10行 = 600,000 + 160,000 + 30,000 + 30,210 − 12,000 − 50,000 = <b>758,210</b>(= 821,000 − 62,790。DRDとNOLは29行の特別控除・NOLとしてこの後に差し引く)。</p>
<p><b>資本損失</b>:法人はキャピタルロスを通常所得から控除できず、3年繰戻し・5年繰越し(短期資本損失として扱う)となる。</p>`,
});

CPA.tbs({ id: "TBS-TCP-33", section: "TCP", chapter: "TCP-02", title: "当期E&Pの調整と財産分配:累積欠損がある場合の株主別の分類",
  scenario: `<p>Ridge Corp., a calendar-year C corporation, had an <b>accumulated E&amp;P deficit of $(60,000)</b> on January 1, 2026. Its three shareholders and their stock bases on June 30, 2026 are: Xu 50% (basis $70,000), Yates 30% (basis $40,000) and Zane 20% (basis $3,000).</p>
<p>On June 30, 2026 Ridge made a pro rata distribution: Xu received land (FMV $100,000; adjusted basis $40,000; no liability), Yates received $60,000 cash and Zane received $40,000 cash.</p>
<p>Exhibit — 2026 tax return data:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Taxable income (includes the $60,000 gain on the land distribution)</td><td>$200,000</td></tr>
<tr><td>Federal income tax liability</td><td>$42,000</td></tr>
<tr><td>Tax-exempt municipal bond interest</td><td>$10,000</td></tr>
<tr><td>Excess of MACRS depreciation over ADS (E&amp;P) depreciation</td><td>$15,000</td></tr>
<tr><td>Dividends-received deduction claimed</td><td>$13,000</td></tr>
<tr><td>Nondeductible fines</td><td>$5,000</td></tr>
<tr><td>Premiums on key-person life insurance (no cash value increase)</td><td>$3,000</td></tr>
<tr><td>Net capital loss not deductible in 2026</td><td>$8,000</td></tr></table>
<p class="ja">暦年のC法人Ridge社は2026年1月1日時点で累積E&amp;Pが$(60,000)の欠損である。株主と2026年6月30日の株式の基準価額は、Xu 50%($70,000)、Yates 30%($40,000)、Zane 20%($3,000)である。6月30日に持株比例の分配を行い、Xuには土地(時価$100,000、基準価額$40,000、負債なし)、Yatesには現金$60,000、Zaneには現金$40,000を分配した。2026年の申告データ:課税所得$200,000(土地分配による利得$60,000を含む)、法人税額$42,000、地方債利息$10,000、MACRSがADS(E&amp;P用)を超える減価償却$15,000、受取配当控除$13,000、罰金$5,000、役員保険料$3,000(解約返戻金の増加なし)、2026年に控除できない純資本損失$8,000。</p>`,
  rows: [
    { label: "Current E&P for 2026 (before distributions)(2026年の当期E&P・分配前)", type: "num", answer: 180000 },
    { label: "Dividend income to Xu(Xuの配当所得)", type: "num", answer: 90000 },
    { label: "Nontaxable return of capital to Yates(Yatesの非課税の資本の払戻し)", type: "num", answer: 6000 },
    { label: "Capital gain recognized by Zane(Zaneが認識するキャピタルゲイン)", type: "num", answer: 1000 },
    { label: "Xu's basis in the land(Xuの土地の基準価額)", type: "num", answer: 100000 },
    { label: "Accumulated E&P on January 1, 2027(2027年1月1日の累積E&P)", type: "num", answer: -60000 },
    { label: "Effect of the accumulated deficit on the 2026 distributions(累積欠損が2026年の分配に与える影響)", type: "select", options: ["None — distributions are dividends to the extent of positive current E&P regardless of an accumulated deficit", "The deficit is netted against current E&P, so only $120,000 is a dividend", "The deficit makes the entire distribution a return of capital", "The deficit is netted only for distributions made after June 30"], answer: "None — distributions are dividends to the extent of positive current E&P regardless of an accumulated deficit" },
  ],
  explain: `<p><b>当期E&amp;P</b> = 200,000 + 非課税利息10,000 + 減価償却差額15,000 + DRD 13,000 − 法人税42,000 − 罰金5,000 − 保険料3,000 − 控除不能の資本損失8,000 = <b>180,000</b>。土地の分配益60,000は課税所得に含まれているので追加調整は不要である(§311(b))。</p>
<p><b>分配の分類</b>:分配総額 = 土地の時価100,000 + 60,000 + 40,000 = 200,000。当期E&amp;Pがプラスなら累積欠損と相殺せず、当期E&amp;Pの範囲で配当となる(累積欠損は当期E&amp;Pを超える部分の判定にのみ関係し、ここでは超過部分は資本の払戻し)。配当割合 = 180,000 ÷ 200,000 = 90%。</p>
<p>Xu:配当 100,000 × 90% = <b>90,000</b>、払戻し10,000(基準価額70,000→60,000)。土地の基準価額は時価 <b>100,000</b>(§301(d))。</p>
<p>Yates:配当54,000、払戻し 60,000 × 10% = <b>6,000</b>(基準価額40,000→34,000)。</p>
<p>Zane:配当36,000、払戻し4,000のうち基準価額3,000を超える <b>1,000</b> がキャピタルゲインとなる。</p>
<p><b>累積E&amp;P</b>:当期E&amp;P180,000は配当で全額使われる(分配によりE&amp;Pはマイナスにならない)ため、2027年期首の累積E&amp;Pは <b>−60,000</b> のままである。</p>`,
});

CPA.tbs({ id: "TBS-TCP-34", section: "TCP", chapter: "TCP-02", title: "株式償還:完全終了と家族帰属の放棄(パートナーシップ経由の帰属)",
  scenario: `<p>Pine Corp. has 1,000 shares of a single class of stock outstanding and ample E&amp;P (over $2,000,000). Ownership before any redemption:</p>
<table><tr><th>Shareholder</th><th>Shares</th><th>Relationship</th></tr>
<tr><td>Helen</td><td>400</td><td>—</td></tr>
<tr><td>Ian</td><td>250</td><td>Helen's son</td></tr>
<tr><td>Jack</td><td>150</td><td>Helen's brother (no other relatives own Pine stock)</td></tr>
<tr><td>Oak Partnership</td><td>200</td><td>Ian is a 50% partner; Helen is not a partner</td></tr></table>
<p>Redemption 1 (March 2026): Pine redeems all 150 of Jack's shares for $90,000. Jack's basis is $30,000.</p>
<p>Redemption 2 (August 2026): Pine redeems all 400 of Helen's shares for $320,000. Helen's basis is $100,000. Helen acquired her shares at formation 15 years ago, and none of the other shareholders acquired stock from her within the past 10 years. Helen is considering resigning as a director and filing the agreement required by §302(c)(2).</p>
<p class="ja">Pine社の発行済株式は単一種類1,000株で、E&amp;Pは十分(200万ドル超)にある。償還前の所有:Helen 400株、息子Ian 250株、Helenの弟Jack 150株(他の親族は株式を所有していない)、Oakパートナーシップ200株(Ianが50%のパートナー、Helenはパートナーではない)。償還1(2026年3月):Jackの150株全部を$90,000で償還(基準価額$30,000)。償還2(2026年8月):Helenの400株全部を$320,000で償還(基準価額$100,000)。Helenは15年前の設立時に株式を取得し、過去10年内に他の株主がHelenから株式を取得した事実はない。Helenは取締役を辞任し§302(c)(2)の合意書を提出することを検討している。</p>`,
  rows: [
    { label: "Treatment of Jack's redemption(Jackの償還の扱い)", type: "select", options: ["Exchange — complete termination; siblings are not related persons under §318", "Dividend — Jack constructively owns Helen's shares", "Exchange — but only because it is substantially disproportionate", "Dividend to the extent of E&P because Pine has ample E&P"], answer: "Exchange — complete termination; siblings are not related persons under §318" },
    { label: "Jack's recognized gain(Jackの認識利得)", type: "num", answer: 60000 },
    { label: "Helen's ownership % (actual + constructive) immediately before Redemption 2(償還2直前のHelenの所有割合・%)", type: "num", answer: 88.24, tol: 0.01 },
    { label: "Helen's ownership % (constructive) after Redemption 2 without a waiver(放棄なしの償還2後のHelenの所有割合・%)", type: "num", answer: 77.78, tol: 0.01 },
    { label: "Helen's dividend income if no waiver is filed(放棄しない場合のHelenの配当所得)", type: "num", answer: 320000 },
    { label: "Helen's recognized gain if a valid waiver is filed(有効な放棄をした場合のHelenの認識利得)", type: "num", answer: 220000 },
    { label: "Effect of the waiver on the shares Ian owns through Oak Partnership(Oak経由でIanが所有する株式への放棄の効果)", type: "select", options: ["Not waived — entity attribution can never be waived by an individual", "Waived — the 100 shares reach Helen only through family attribution from Ian, which the §302(c)(2) waiver eliminates", "Waived only if Oak Partnership also files a waiver", "Not relevant — partnership-owned stock is never attributed to partners"], answer: "Waived — the 100 shares reach Helen only through family attribution from Ian, which the §302(c)(2) waiver eliminates" },
    { label: "Condition required for Helen's waiver to remain valid(Helenの放棄が有効であるための条件)", type: "select", options: ["She may remain a director if she receives no salary", "She must have no interest in Pine (other than as a creditor), including as officer, director or employee, for 10 years after the redemption", "She must not acquire Pine stock by inheritance for 10 years", "She must sell any Pine notes received within 5 years"], answer: "She must have no interest in Pine (other than as a creditor), including as officer, director or employee, for 10 years after the redemption" },
  ],
  explain: `<p><b>Jack</b>:§318の家族帰属は配偶者・子・孫・親に限られ、兄弟姉妹は含まれない。Jackは全株を償還されるので完全終了(§302(b)(3))として交換取引。利得 = 90,000 − 30,000 = <b>60,000</b>(長期キャピタルゲイン)。</p>
<p><b>Helen(償還前)</b>:償還1の後の発行済は850株。直接400 + 息子Ianの250(家族帰属)+ OakからIanへ帰属する 200 × 50% = 100株をさらにHelenへ帰属(事業体→個人の後の家族帰属は二重帰属の禁止に当たらない)= 750株。750 ÷ 850 = <b>88.24%</b>。</p>
<p><b>償還後(放棄なし)</b>:発行済450株、Helenの所有は 250 + 100 = 350株。350 ÷ 450 = <b>77.78%</b>。80%テスト(88.24% × 80% = 70.59%未満が必要)も50%未満要件も満たさず、支配株主のままなので意味のある減少にも当たらない。よって§301の分配となり、E&amp;Pが十分なので <b>320,000</b> 全額が配当。償還株式の未回収基準価額はIanの株式に移る。</p>
<p><b>放棄あり</b>:§302(c)(2)の放棄は家族帰属を消すので、Ianの250株もOak経由の100株(Ianを経由した家族帰属部分)もHelenに帰属しない。完全終了となり、利得 = 320,000 − 100,000 = <b>220,000</b>。要件:償還後10年間、債権者以外の持分(役員・取締役・従業員を含む)を持たないこと(相続による取得は除く)、合意書を提出すること、過去10年内の関係者間取得がないこと。</p>`,
});

CPA.tbs({ id: "TBS-TCP-35", section: "TCP", chapter: "TCP-02", title: "子会社の清算:親会社(§332・§337)と少数株主(§331・§336)",
  scenario: `<p>Parent Corp. has owned <b>85%</b> of Sub Corp.'s only class of stock for 6 years (basis $300,000). Mia, an individual, owns the other <b>15%</b> (basis $40,000, held 4 years). Sub has no liabilities, a $150,000 NOL carryforward (from 2023) and adopts a plan of complete liquidation in 2026. Sub's assets:</p>
<table><tr><th>Asset</th><th>FMV</th><th>Adjusted basis</th><th>Distributed to</th></tr>
<tr><td>Cash</td><td>$50,000</td><td>$50,000</td><td>Parent</td></tr>
<tr><td>Land</td><td>$600,000</td><td>$250,000</td><td>Parent</td></tr>
<tr><td>Equipment</td><td>$200,000</td><td>$300,000</td><td>Parent</td></tr>
<tr><td>Marketable securities (capital assets)</td><td>$150,000</td><td>$90,000</td><td>Mia</td></tr></table>
<p class="ja">Parent社はSub社の単一種類の株式の85%を6年間保有している(基準価額$300,000)。残り15%は個人Miaが保有する(基準価額$40,000、保有4年)。Subは負債がなく、$150,000のNOL繰越(2023年発生)を有し、2026年に完全清算の計画を採択した。資産:現金$50,000→Parent、土地(時価$600,000、基準価額$250,000)→Parent、設備(時価$200,000、基準価額$300,000)→Parent、市場性有価証券(資本資産、時価$150,000、基準価額$90,000)→Mia。</p>`,
  rows: [
    { label: "Sub's recognized gain on the liquidating distributions(清算分配によるSubの認識利得)", type: "num", answer: 60000 },
    { label: "Sub's treatment of the $100,000 loss on the equipment(設備の損失$100,000のSubでの扱い)", type: "select", options: ["Recognized under §336 as an ordinary loss", "Not recognized — §337 provides nonrecognition on distributions to an 80% distributee", "Recognized only to the extent of Mia's 15% interest", "Deferred until Parent sells the equipment and then recognized by Sub"], answer: "Not recognized — §337 provides nonrecognition on distributions to an 80% distributee" },
    { label: "Parent's recognized gain on its Sub stock(ParentのSub株式に係る認識利得)", type: "num", answer: 0 },
    { label: "Parent's basis in the land(Parentの土地の基準価額)", type: "num", answer: 250000 },
    { label: "Parent's basis in the equipment(Parentの設備の基準価額)", type: "num", answer: 300000 },
    { label: "Mia's recognized long-term capital gain(Miaの長期キャピタルゲイン)", type: "num", answer: 110000 },
    { label: "Mia's basis in the securities(Miaの有価証券の基準価額)", type: "num", answer: 150000 },
    { label: "What happens to Sub's NOL carryforward and E&P?(SubのNOL繰越とE&Pの扱い)", type: "select", options: ["They disappear on liquidation", "They carry over to Parent under §381", "They are allocated 85% to Parent and 15% to Mia", "The NOL carries over but E&P is eliminated"], answer: "They carry over to Parent under §381" },
  ],
  explain: `<p><b>Sub</b>:80%以上を保有する親会社への清算分配は§337により損益を認識しない(設備の含み損100,000も認識されない)。少数株主Miaへの分配は§336により時価で売却したものとして扱い、有価証券の利得 150,000 − 90,000 = <b>60,000</b> を認識する。なお少数株主への分配で生じる損失は§336(d)(3)により認識できない。</p>
<p><b>Parent</b>:§332により株式の実現利得(時価850,000 − 基準価額300,000 = 550,000)は認識されない(<b>0</b>)。資産の基準価額はSubの基準価額を引き継ぐ(§334(b)):土地 <b>250,000</b>、設備 <b>300,000</b>(含み損も引き継がれる)。NOL・E&amp;P等の税務属性は§381により<b>Parentへ引き継がれる</b>(NOLはSubの最終年度の利得60,000に使用した後の残額)。</p>
<p><b>Mia</b>:§331により交換取引。受領資産の時価150,000 − 株式の基準価額40,000 = <b>110,000</b> の長期キャピタルゲイン。資産の基準価額は時価 <b>150,000</b>(§334(a))。</p>`,
});

CPA.tbs({ id: "TBS-TCP-36", section: "TCP", chapter: "TCP-02", title: "パートナーシップの設立から初年度のK-1まで:§752・保証支払・自営業所得",
  scenario: `<p>On January 1, 2026, Olga, Pete and Quinn formed OPQ, a <b>general partnership</b>, sharing profits, losses and capital equally (1/3 each). Recourse liabilities are shared equally. Contributions:</p>
<table><tr><th>Partner</th><th>Contribution</th></tr>
<tr><td>Olga</td><td>Building: FMV $300,000, adjusted basis $180,000, subject to a recourse mortgage of $120,000 assumed by OPQ</td></tr>
<tr><td>Pete</td><td>Cash $180,000</td></tr>
<tr><td>Quinn</td><td>Cash $100,000 and equipment (FMV $80,000, adjusted basis $50,000)</td></tr></table>
<p>2026 operations (exhibit from OPQ's trial balance):</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Ordinary business income <b>before</b> guaranteed payments</td><td>$270,000</td></tr>
<tr><td>Guaranteed payment to Pete for services (paid in cash)</td><td>$60,000</td></tr>
<tr><td>Long-term capital gain on investments</td><td>$30,000</td></tr>
<tr><td>Cash distribution to Olga</td><td>$20,000</td></tr>
<tr><td>Mortgage principal repaid (balance 12/31/2026: $105,000)</td><td>$15,000</td></tr></table>
<p>All partners materially participate. No §704(c) property was sold in 2026.</p>
<p class="ja">2026年1月1日、Olga・Pete・Quinnは損益・資本を1/3ずつ分配するゼネラル・パートナーシップOPQを設立した。リコース債務も均等に負担する。出資:Olgaは建物(時価$300,000、基準価額$180,000、OPQが引き受けるリコース抵当債務$120,000付き)、Peteは現金$180,000、Quinnは現金$100,000と設備(時価$80,000、基準価額$50,000)。2026年の営業:保証支払控除前の通常事業所得$270,000、Peteへの役務の保証支払$60,000(現金払い)、投資の長期キャピタルゲイン$30,000、Olgaへの現金分配$20,000、抵当債務の元本返済$15,000(年末残高$105,000)。全員が実質的に関与している。2026年に§704(c)資産の売却はない。</p>`,
  rows: [
    { label: "Olga's outside basis immediately after formation(設立直後のOlgaの持分の基準価額)", type: "num", answer: 100000 },
    { label: "Pete's outside basis immediately after formation(設立直後のPeteの持分の基準価額)", type: "num", answer: 220000 },
    { label: "OPQ's basis in the building(OPQの建物の基準価額)", type: "num", answer: 180000 },
    { label: "Pete's net earnings from self-employment from OPQ (K-1 box 14)(PeteのOPQからの自営業純所得・K-1 14欄)", type: "num", answer: 130000 },
    { label: "Total income Pete reports from OPQ for 2026(Peteが2026年に申告するOPQからの所得合計)", type: "num", answer: 140000 },
    { label: "Olga's outside basis on December 31, 2026(2026年12月31日のOlgaの持分の基準価額)", type: "num", answer: 155000 },
    { label: "Pete's outside basis on December 31, 2026(2026年12月31日のPeteの持分の基準価額)", type: "num", answer: 295000 },
    { label: "If Quinn were instead a limited partner in a limited partnership who performs no services for it (no guaranteed payments), his self-employment earnings would be(Quinnが役務を提供しないリミテッド・パートナーで保証支払がない場合の自営業所得)", type: "select", options: ["$70,000 — his distributive share of ordinary income", "$80,000 — ordinary income plus capital gain", "$0 — a limited partner's distributive share is excluded under §1402(a)(13)", "$35,000 — one-half of his distributive share"], answer: "$0 — a limited partner's distributive share is excluded under §1402(a)(13)" },
  ],
  explain: `<p><b>設立時</b>:債務120,000は各自40,000ずつ負担に再配分される。Olgaは債務から解放された80,000(120,000 − 自己負担40,000)をみなし現金分配として扱う。基準価額 = 180,000 − 120,000 + 40,000 = <b>100,000</b>(みなし分配80,000は基準価額を超えないので利得なし)。Pete = 180,000 + 40,000 = <b>220,000</b>。Quinn = 150,000 + 40,000 = 190,000。OPQの建物の基準価額はOlgaの基準価額を引き継いで <b>180,000</b>(§723)。</p>
<p><b>2026年の配分</b>:通常所得 = 270,000 − 60,000 = 210,000 → 各70,000。LTCG 30,000 → 各10,000。債務の減少15,000 → 各5,000のみなし分配。</p>
<p><b>Pete</b>:自営業所得 = 通常所得の分配分70,000 + 保証支払60,000 = <b>130,000</b>(キャピタルゲインは含まない)。申告所得 = 70,000 + 60,000 + 10,000 = <b>140,000</b>。期末基準価額 = 220,000 + 70,000 + 10,000 − 5,000 = <b>295,000</b>(保証支払は基準価額に影響しない)。</p>
<p><b>Olga</b>:100,000 + 70,000 + 10,000 − 現金分配20,000 − 債務減少5,000 = <b>155,000</b>。</p>
<p><b>リミテッド・パートナー</b>:§1402(a)(13)により分配分は自営業所得から除外され、役務の保証支払のみが対象となる。保証支払がなければ <b>$0</b>。</p>`,
});

CPA.tbs({ id: "TBS-TCP-37", section: "TCP", chapter: "TCP-02", title: "パートナーシップ分配:§732の基準価額配分・§735の性質・清算時の損失認識",
  scenario: `<p>RST Partnership (cash-method; no liabilities) made two distributions on December 31, 2026, after all 2026 items were allocated. Each distribution is <b>proportionate</b> as to §751 assets, so §751(b) does not apply.</p>
<table><tr><th>Partner</th><th>Type</th><th>Outside basis before distribution</th><th>Property received</th><th>Partnership's basis</th><th>FMV</th></tr>
<tr><td rowspan="3">Rita</td><td rowspan="3">Current (nonliquidating)</td><td rowspan="3">$50,000</td><td>Cash</td><td>$20,000</td><td>$20,000</td></tr>
<tr><td>Inventory</td><td>$18,000</td><td>$25,000</td></tr>
<tr><td>Land (capital asset)</td><td>$30,000</td><td>$40,000</td></tr>
<tr><td rowspan="2">Sam</td><td rowspan="2">Liquidating</td><td rowspan="2">$70,000</td><td>Cash</td><td>$30,000</td><td>$30,000</td></tr>
<tr><td>Accounts receivable (unrealized receivables)</td><td>$0</td><td>$15,000</td></tr></table>
<p>In 2029 Rita sells the distributed inventory (held as a capital asset by her) for $26,000. In 2027 Sam collects the receivables in full.</p>
<p class="ja">RSTパートナーシップ(現金主義、負債なし)は2026年の損益配分後の12月31日に2件の分配を行った。いずれも§751資産について持分比例であり§751(b)は適用されない。Rita(非清算分配、分配前の持分の基準価額$50,000):現金$20,000、棚卸資産(パートナーシップの基準価額$18,000、時価$25,000)、土地(資本資産、基準価額$30,000、時価$40,000)。Sam(清算分配、基準価額$70,000):現金$30,000、売掛金(未実現債権、基準価額$0、時価$15,000)。Ritaは2029年に分配された棚卸資産(本人の手元では資本資産として保有)を$26,000で売却する。Samは2027年に売掛金を全額回収する。</p>`,
  rows: [
    { label: "Rita's basis in the inventory(Ritaの棚卸資産の基準価額)", type: "num", answer: 18000 },
    { label: "Rita's basis in the land(Ritaの土地の基準価額)", type: "num", answer: 12000 },
    { label: "Rita's recognized gain on the distribution(分配時のRitaの認識利得)", type: "num", answer: 0 },
    { label: "Rita's income on the 2029 sale of the inventory(2029年の棚卸資産売却によるRitaの所得)", type: "num", answer: 8000 },
    { label: "Character of Rita's income on the 2029 sale(2029年の売却所得の性質)", type: "select", options: ["Long-term capital gain, because she held it as a capital asset for more than 1 year", "Ordinary income, because inventory sold within 5 years of distribution retains its ordinary character (§735)", "§1231 gain", "Short-term capital gain"], answer: "Ordinary income, because inventory sold within 5 years of distribution retains its ordinary character (§735)" },
    { label: "Sam's recognized loss on the liquidating distribution(清算分配でSamが認識する損失)", type: "num", answer: 40000 },
    { label: "Character of Sam's loss(Samの損失の性質)", type: "select", options: ["Ordinary loss", "Capital loss under §731(a)(2)", "Not recognized; added to the basis of the receivables", "§1231 loss"], answer: "Capital loss under §731(a)(2)" },
    { label: "Sam's ordinary income when he collects the receivables in 2027(2027年の売掛金回収時のSamの通常所得)", type: "num", answer: 15000 },
  ],
  explain: `<p><b>Rita(非清算分配)</b>:まず現金で基準価額を減らす:50,000 − 20,000 = 30,000。次に未実現債権・棚卸資産にパートナーシップの基準価額を付す:棚卸資産 <b>18,000</b>(残り12,000)。その他の資産(土地)は残額に制限され <b>12,000</b>。現金分配が基準価額を超えないため利得は <b>0</b>、分配後の持分の基準価額は0となる。</p>
<p><b>§735</b>:分配された棚卸資産は分配後5年以内に処分すると通常所得の性質を保つ。2029年は5年以内なので、26,000 − 18,000 = <b>8,000</b> は<b>通常所得</b>である(未実現債権は期間の制限なく通常所得)。</p>
<p><b>Sam(清算分配)</b>:受領物が現金・未実現債権・棚卸資産のみのため損失を認識できる。未実現債権の基準価額は0(パートナーシップの基準価額)。損失 = 70,000 − 30,000 − 0 = <b>40,000</b>、§731(a)(2)により持分の売却損として<b>キャピタルロス</b>。土地などその他の資産も受け取っていれば損失は認識せず、残りの基準価額がその資産に付される。</p>
<p><b>回収</b>:売掛金の基準価額は0なので回収額 <b>15,000</b> 全額が通常所得となる。</p>`,
});

CPA.tbs({ id: "TBS-TCP-38", section: "TCP", chapter: "TCP-02", title: "S法人:損失年度の分配とAAAの純減少調整・株式と貸付金の基準価額",
  scenario: `<p>Tara has owned 100% of T Inc. since it elected S status in 2020. T was a C corporation before 2020 and still has <b>accumulated E&amp;P of $15,000</b>. T has not made a §1368(e)(3) election. Tara materially participates in T's business and is at risk for her stock and loan basis. Balances on January 1, 2026:</p>
<table><tr><th>Item</th><th>Balance</th></tr>
<tr><td>Tara's stock basis</td><td>$50,000</td></tr>
<tr><td>Tara's loan to T (face and basis)</td><td>$20,000</td></tr>
<tr><td>Accumulated adjustments account (AAA)</td><td>$30,000</td></tr></table>
<p>2026 results from T's Form 1120-S:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Ordinary business loss</td><td>$(70,000)</td></tr>
<tr><td>Tax-exempt interest income</td><td>$6,000</td></tr>
<tr><td>Long-term capital gain</td><td>$4,000</td></tr>
<tr><td>Nondeductible expenses</td><td>$3,000</td></tr>
<tr><td>Cash distribution to Tara (July 2026)</td><td>$40,000</td></tr></table>
<p class="ja">Taraは2020年にS法人を選択したT社の株式を100%保有している。Tは2020年前はC法人で、累積E&amp;P$15,000が残っている。§1368(e)(3)の選択はしていない。TaraはTの事業に実質的に関与しており、株式と貸付金の基準価額の範囲でat-riskである。2026年1月1日残高:株式の基準価額$50,000、TaraのTへの貸付金(額面・基準価額)$20,000、AAA$30,000。2026年の結果:通常事業損失$(70,000)、非課税利息$6,000、長期キャピタルゲイン$4,000、控除不能費用$3,000、Taraへの現金分配$40,000(7月)。</p>`,
  rows: [
    { label: "Portion of the distribution that is tax-free from AAA(AAAからの非課税分配額)", type: "num", answer: 30000 },
    { label: "Dividend income reported by Tara(Taraの配当所得)", type: "num", answer: 10000 },
    { label: "Ordinary loss Tara may deduct in 2026(Taraが2026年に控除できる通常損失)", type: "num", answer: 47000 },
    { label: "Suspended loss carried forward(繰り越される停止損失)", type: "num", answer: 23000 },
    { label: "Tara's stock basis on December 31, 2026(2026年末の株式の基準価額)", type: "num", answer: 0 },
    { label: "Tara's debt basis on December 31, 2026(2026年末の貸付金の基準価額)", type: "num", answer: 0 },
    { label: "T's AAA on December 31, 2026(2026年末のAAA)", type: "num", answer: -69000 },
    { label: "Why is AAA available for the distribution limited to $30,000?(分配に使えるAAAが$30,000に限られる理由)", type: "select", options: ["AAA can never exceed stock basis", "In a year with a net negative adjustment, AAA is determined for distributions without regard to that net negative adjustment, so the beginning balance is used", "Tax-exempt interest and capital gains never increase AAA", "Distributions are applied after losses reduce AAA"], answer: "In a year with a net negative adjustment, AAA is determined for distributions without regard to that net negative adjustment, so the beginning balance is used" },
  ],
  explain: `<p><b>AAA</b>:当期の増加項目(LTCG 4,000。非課税利息はAAAに含めない)に対し減少項目(損失70,000 + 控除不能費用3,000)が上回るので純減少調整 = 73,000 − 4,000 = 69,000。分配の判定では純減少調整を考慮しない(§1368(e)(1)(C))ため、使えるAAAは期首の <b>30,000</b>。分配40,000のうち30,000がAAAから非課税、次の10,000は累積E&amp;Pからの <b>配当</b>(株式の基準価額は減らさない)。年末AAA = 30,000 − 30,000 − 69,000 = <b>−69,000</b>(損失によるマイナスは可、分配ではマイナスにならない)。累積E&amp;Pは5,000に減る。</p>
<p><b>株式の基準価額</b>(増加→分配→控除不能費用→損失の順):50,000 + 6,000 + 4,000 = 60,000 → AAA分配30,000を控除して30,000 → 控除不能費用3,000で27,000 → 損失で <b>0</b>。</p>
<p><b>損失</b>:株式27,000 + 貸付金20,000 = <b>47,000</b> まで控除でき、貸付金の基準価額は <b>0</b>。残り 70,000 − 47,000 = <b>23,000</b> は停止損失として繰り越す。後に純増加が生じるとまず貸付金の基準価額が回復するので、回復前に返済を受けると利得が生じる点に注意する。</p>`,
});

CPA.tbs({ id: "TBS-TCP-39", section: "TCP", chapter: "TCP-02", title: "S法人の組込み利得税(§1374)と超過純受動所得税(§1375)",
  scenario: `<p>Lakeview Inc., a C corporation, elected S status effective <b>January 1, 2024</b>. At that date its net unrealized built-in gain (NUBIG) was <b>$200,000</b>, consisting of land (FMV $300,000; basis $120,000) and inventory (FMV $50,000; basis $30,000). All of the inventory was sold in 2024, and Lakeview recognized and paid tax on $20,000 of built-in gain in 2024. Lakeview still has <b>accumulated E&amp;P of $80,000</b> from its C years.</p>
<p>2026 data:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Gain on sale of the land (sold for $310,000; land is a §1231 asset)</td><td>$190,000</td></tr>
<tr><td>Taxable income computed as if Lakeview were a C corporation</td><td>$150,000</td></tr>
<tr><td>Gross receipts (for §1362(d)(3) purposes)</td><td>$600,000</td></tr>
<tr><td>Passive investment income: interest $90,000, dividends $60,000, passive rents $100,000</td><td>$250,000</td></tr>
<tr><td>Expenses directly connected with the passive investment income</td><td>$50,000</td></tr></table>
<p>Assume the 21% corporate rate applies to both taxes.</p>
<p class="ja">C法人Lakeview社は2024年1月1日付でS法人を選択した。その時点の純未実現組込み利得(NUBIG)は$200,000で、土地(時価$300,000、基準価額$120,000)と棚卸資産(時価$50,000、基準価額$30,000)からなる。棚卸資産は2024年にすべて販売され、2024年に組込み利得$20,000を認識して税を納付済みである。C法人時代の累積E&amp;P$80,000が残っている。2026年:土地売却益$190,000(売却価額$310,000、§1231資産)、C法人とみなした課税所得$150,000、総収入(§1362(d)(3)上)$600,000、受動投資所得$250,000(利息$90,000、配当$60,000、受動的賃料$100,000)、受動投資所得に直接関連する費用$50,000。両税とも21%の法人税率を用いる。</p>`,
  rows: [
    { label: "NUBIG remaining at the start of 2026(2026年期首の未使用NUBIG)", type: "num", answer: 180000 },
    { label: "Net recognized built-in gain for 2026(2026年の純認識組込み利得)", type: "num", answer: 150000 },
    { label: "Built-in gains tax for 2026(2026年の組込み利得税)", type: "num", answer: 31500 },
    { label: "Built-in gain carried forward to 2027 because of the taxable income limitation(課税所得制限により2027年へ繰り越される組込み利得)", type: "num", answer: 30000 },
    { label: "Excess net passive income(超過純受動所得)", type: "num", answer: 80000 },
    { label: "Passive investment income tax for 2026(2026年の受動投資所得税)", type: "num", answer: 16800 },
    { label: "§1231 gain from the land passed through to shareholders(株主にパススルーされる土地の§1231利得)", type: "num", answer: 158500 },
    { label: "Consequence if excess passive investment income and accumulated E&P persist(超過受動投資所得と累積E&Pが続いた場合の帰結)", type: "select", options: ["The S election terminates after 3 consecutive years of excess passive investment income with accumulated E&P at each year-end", "The S election terminates immediately in 2026", "The corporation must pay the PII tax at the highest individual rate", "Nothing — the tax itself is the only consequence"], answer: "The S election terminates after 3 consecutive years of excess passive investment income with accumulated E&P at each year-end" },
  ],
  explain: `<p><b>組込み利得税</b>:認識期間は5年(2024〜2028年)で2026年は期間内。未使用NUBIG = 200,000 − 2024年認識分20,000 = <b>180,000</b>。土地の認識組込み利得は転換時の含み益180,000に限られる(転換後の値上り10,000は対象外)。純認識組込み利得 = MIN(認識組込み利得180,000、C法人とみなした課税所得150,000、未使用NUBIG180,000)= <b>150,000</b>。税額 = 150,000 × 21% = <b>31,500</b>。課税所得制限で除かれた 180,000 − 150,000 = <b>30,000</b> は翌年に認識組込み利得として繰り越す(認識期間内に限る)。</p>
<p><b>受動投資所得税</b>:累積E&amp;Pがあり、受動投資所得250,000が総収入の25%(150,000)を超える。純受動所得 = 250,000 − 50,000 = 200,000。超過純受動所得 = 200,000 × (250,000 − 150,000) ÷ 250,000 = <b>80,000</b>(課税所得150,000の制限内)。税額 = 80,000 × 21% = <b>16,800</b>。</p>
<p><b>パススルー</b>:組込み利得税は同じ性質の損失として扱われるので、§1231利得 = 190,000 − 31,500 = <b>158,500</b>。受動投資所得税は各受動投資所得項目を比例的に減らす。</p>
<p><b>終了</b>:期末に累積E&amp;Pがあり超過受動投資所得が3年連続するとS選択は4年目の初日に終了する(§1362(d)(3))。累積E&amp;Pを配当で払い出すこと(§1368(e)(3)の選択)で回避できる。</p>`,
});

CPA.tbs({ id: "TBS-TCP-40", section: "TCP", chapter: "TCP-02", title: "事業体選択の税引後比較:州のネクサス・売上単一要素配分とC法人対S法人",
  scenario: `<p>Owen plans to operate a manufacturing business expected to earn <b>$1,000,000</b> of pretax income per year and is choosing between a C corporation and an S corporation. Projected sales by state:</p>
<table><tr><th>State</th><th>Activities</th><th>Sales</th><th>Rate</th></tr>
<tr><td>X</td><td>Headquarters and plant; ships all goods from X</td><td>$1,200,000</td><td>6%</td></tr>
<tr><td>Y</td><td>Sales office with employees who also install and repair the products</td><td>$800,000</td><td>5%</td></tr>
<tr><td>Z</td><td>A traveling employee solicits orders for tangible goods; orders are approved and shipped from X</td><td>$500,000</td><td>7%</td></tr></table>
<p>Each state uses a single-sales-factor apportionment formula, has no throwback rule and taxes only businesses with income-tax nexus. Assumptions:</p>
<ul><li>C corporation: 21% federal rate; state taxes are deductible; all after-tax earnings are distributed as qualified dividends taxed to Owen at 20% plus 3.8% NIIT.</li>
<li>S corporation: the states impose the same total state tax at the entity level through elective pass-through entity taxes, deductible by the S corporation. Owen's marginal rate is 37%; the §199A deduction (20%, made permanent by the One Big Beautiful Bill Act) is fully available (W-2 wage limits are not binding). Owen materially participates (no NIIT). Ignore payroll taxes, reasonable compensation, the standard deduction and other personal items.</li></ul>
<p class="ja">Owenは税引前利益が年$1,000,000と見込まれる製造業をC法人とS法人のどちらで営むか検討している。州別売上:X州(本社・工場、全製品をXから出荷)$1,200,000・税率6%、Y州(販売事務所があり従業員が製品の設置・修理も行う)$800,000・5%、Z州(出張従業員が有形資産の注文を勧誘するのみで、承認・出荷はX州)$500,000・7%。各州は売上単一要素で配分し、スローバックはなく、所得税のネクサスがある事業者のみに課税する。前提:C法人は連邦税率21%、州税は損金算入、税引後利益は全額を適格配当として分配しOwenに20%+NIIT3.8%が課される。S法人は州が同額の州税を選択的パススルー事業体税として事業体レベルで課し、S法人で控除できる。Owenの限界税率は37%、§199A控除(20%、OBBBAで恒久化)は全額使える(W-2賃金制限は影響しない)。Owenは実質的に関与しNIITはない。給与税・合理的報酬・標準控除等は無視する。</p>`,
  rows: [
    { label: "Does the business have income-tax nexus with State Z?(Z州に所得税のネクサスがあるか)", type: "select", options: ["Yes — any sales into a state create nexus after Wayfair", "No — P.L. 86-272 protects solicitation of orders for tangible goods approved and shipped from outside the state", "Yes — because an employee is physically present", "No — because Z's sales are less than X's"], answer: "No — P.L. 86-272 protects solicitation of orders for tangible goods approved and shipped from outside the state" },
    { label: "Does P.L. 86-272 protect the business in State Y?(Y州でP.L. 86-272の保護を受けるか)", type: "select", options: ["Yes — the employees sell only tangible goods", "No — installation and repair services exceed the solicitation of orders", "Yes — because State Y uses a single-sales factor", "No — P.L. 86-272 never applies to corporations"], answer: "No — installation and repair services exceed the solicitation of orders" },
    { label: "State X apportionment percentage(X州の配分割合・%)", type: "num", answer: 48, tol: 0.01 },
    { label: "Total state income tax(州所得税の合計)", type: "num", answer: 44800 },
    { label: "C corporation federal income tax(C法人の連邦法人税)", type: "num", answer: 200592 },
    { label: "Owen's after-tax cash under the C corporation (all earnings distributed)(C法人で全額分配した場合のOwenの税引後手取り)", type: "num", answer: 575011, tol: 1 },
    { label: "Owen's §199A deduction under the S corporation(S法人の場合のOwenの§199A控除額)", type: "num", answer: 191040 },
    { label: "Owen's after-tax cash under the S corporation(S法人の場合のOwenの税引後手取り)", type: "num", answer: 672461, tol: 1 },
  ],
  explain: `<p><b>ネクサス</b>:Z州での活動は有形資産の注文勧誘のみで、承認・出荷は州外から行われるため、P.L. 86-272により純所得課税のネクサスがない(同法は売上税には適用されず、Wayfairは売上税の判例である)。Y州では設置・修理という勧誘を超える活動があるため保護されない。</p>
<p><b>配分</b>:売上単一要素の分母は全売上2,500,000(スローバックなしのためZ州の売上はどこにも課税されない)。X = 1,200,000 ÷ 2,500,000 = <b>48%</b>、Y = 800,000 ÷ 2,500,000 = 32%。州税 = 1,000,000 × 48% × 6% + 1,000,000 × 32% × 5% = 28,800 + 16,000 = <b>44,800</b>。</p>
<p><b>C法人</b>:連邦課税所得 = 1,000,000 − 44,800 = 955,200、連邦税 = 955,200 × 21% = <b>200,592</b>。法人税引後 = 955,200 − 200,592 = 754,608。配当課税 = 754,608 × 23.8% = 179,596.70。手取り = 754,608 − 179,596.70 = <b>575,011</b>(合計実効税率約42.5%)。</p>
<p><b>S法人</b>:パススルー所得(QBI)= 1,000,000 − 44,800 = 955,200。§199A控除 = 955,200 × 20% = <b>191,040</b>。課税所得764,160 × 37% = 282,739.20。手取り = 955,200 − 282,739.20 = <b>672,461</b>。S法人の方が年97,450多く、全額分配を前提とするとS法人が有利である(C法人で利益を内部留保すれば配当課税は繰り延べられる)。</p>`,
});
