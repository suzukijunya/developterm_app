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
