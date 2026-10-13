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
