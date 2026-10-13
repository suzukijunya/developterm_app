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
