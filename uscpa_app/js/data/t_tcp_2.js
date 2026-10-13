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
