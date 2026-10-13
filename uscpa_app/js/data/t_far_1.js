// FAR のTBS追加(財務報告の枠組み・表示/収益認識)

CPA.tbs({
  id: "TBS-FAR-37", section: "FAR", chapter: "FAR-01", title: "貸借対照表の流動・非流動分類の修正(借換えと後発事象を含む)",
  scenario: `<p>Ridgeline Corp. prepared the draft balance sheet below for its fiscal year ended December 31, Year 2. The financial statements will be issued on March 15, Year 3. The controller has asked you to review the classification of current items.</p>
<table><tr><th>Exhibit 1 — Draft current assets</th><th>Amount</th></tr>
<tr><td>Cash (includes $50,000 deposited in a sinking fund for bonds maturing June, Year 5)</td><td>$180,000</td></tr>
<tr><td>Trading debt securities</td><td>90,000</td></tr>
<tr><td>Accounts receivable, net</td><td>410,000</td></tr>
<tr><td>Inventory</td><td>380,000</td></tr>
<tr><td>Prepaid expenses (includes $24,000 of rent prepaid for Year 4)</td><td>60,000</td></tr>
<tr><td>Cash surrender value of officers' life insurance</td><td>45,000</td></tr>
<tr><td>Treasury stock, at cost</td><td>75,000</td></tr>
<tr><td><b>Total current assets (draft)</b></td><td><b>$1,240,000</b></td></tr></table>
<table><tr><th>Exhibit 2 — Draft current liabilities</th><th>Amount</th></tr>
<tr><td>Accounts payable</td><td>$260,000</td></tr>
<tr><td>Note payable to bank, due March 31, Year 3</td><td>300,000</td></tr>
<tr><td>Accrued liabilities</td><td>110,000</td></tr>
<tr><td>Deferred income tax liability</td><td>60,000</td></tr>
<tr><td>Stock dividend distributable (declared December 20, Year 2)</td><td>40,000</td></tr>
<tr><td>Cash dividends payable (declared December 20, Year 2)</td><td>50,000</td></tr>
<tr><td><b>Total current liabilities (draft)</b></td><td><b>$820,000</b></td></tr></table>
<p>Exhibit 3 — Additional information:</p>
<ul><li>On February 20, Year 3, Ridgeline issued $250,000 of 5-year bonds for the stated purpose of refinancing the bank note. The proceeds were used to retire the bank note on March 31, Year 3; the remaining balance of the note was paid from operating cash.</li>
<li>Long-term debt in the draft includes $600,000 of serial bonds, of which $40,000 matures on October 1, Year 3.</li></ul>
<p class="ja">Ridgeline社は第2年度12月31日終了事業年度の貸借対照表草案を作成した。財務諸表の発行日は第3年度3月15日である。流動項目の分類の検討を依頼された。</p>
<p class="ja">資料1(流動資産草案):現金$180,000(第5年度6月満期の社債の減債基金$50,000を含む)、売買目的負債証券$90,000、売掛金(純額)$410,000、棚卸資産$380,000、前払費用$60,000(第4年度分の前払家賃$24,000を含む)、役員生命保険の解約返戻金$45,000、自己株式(取得原価)$75,000、合計$1,240,000。</p>
<p class="ja">資料2(流動負債草案):買掛金$260,000、銀行借入金(第3年度3月31日返済期限)$300,000、未払費用$110,000、繰延税金負債$60,000、未交付株式配当(第2年度12月20日宣言)$40,000、未払現金配当(同日宣言)$50,000、合計$820,000。</p>
<p class="ja">資料3:第3年度2月20日、銀行借入金の借換えを目的として5年債$250,000を発行し、その手取金で3月31日に借入金を返済した(残額は営業資金で返済)。長期負債には連続償還社債$600,000が含まれ、うち$40,000は第3年度10月1日に償還される。</p>`,
  rows: [
    { label: "Corrected total current assets(修正後の流動資産合計)", type: "num", answer: 1046000 },
    { label: "Corrected total current liabilities(修正後の流動負債合計)", type: "num", answer: 510000 },
    { label: "Corrected working capital(修正後の運転資本)", type: "num", answer: 536000 },
    { label: "Corrected current ratio, rounded to two decimals(修正後の流動比率・小数第2位)", type: "num", answer: 2.05, tol: 0.01 },
    { label: "Proper classification of the $40,000 stock dividend distributable(未交付株式配当$40,000の適切な分類)", type: "select", options: ["Current liability", "Noncurrent liability", "Stockholders' equity (contributed capital)", "Contra-asset"], answer: "Stockholders' equity (contributed capital)" },
    { label: "Authoritative guidance permitting $250,000 of the bank note to be excluded from current liabilities(銀行借入金$250,000を流動負債から除外できる根拠規定)", type: "select", options: ["ASC 470-10 (Debt — Overall)", "ASC 855-10 (Subsequent Events)", "ASC 450-20 (Loss Contingencies)", "ASC 205-40 (Going Concern)"], answer: "ASC 470-10 (Debt — Overall)" },
    { label: "Proper classification of the cash surrender value of life insurance(生命保険の解約返戻金の分類)", type: "select", options: ["Current asset", "Noncurrent asset (investments/other assets)", "Reduction of insurance expense", "Contra-equity"], answer: "Noncurrent asset (investments/other assets)" },
  ],
  explain: `<p><b>流動資産</b>:1,240,000 − 減債基金50,000(社債償還に拘束、非流動)− 第4年度分前払家賃24,000(1年超、非流動)− 解約返戻金45,000(投資・その他の資産)− 自己株式75,000(資産ではなく資本の控除)= <b>1,046,000</b>。</p>
<p><b>流動負債</b>:820,000 − 借換え分250,000 − 繰延税金負債60,000(ASU 2015-17により全額非流動)− 未交付株式配当40,000(資本)+ 連続償還社債の1年内償還分40,000 = <b>510,000</b>。現金配当50,000は流動負債のままである。</p>
<p>借入金:貸借対照表日後・財務諸表発行前に長期債を発行して短期債務を借り換えた場合、その手取額($250,000)を上限として非流動に分類できる(ASC 470-10-45)。残額$50,000は流動資産で返済されるため流動のままである。</p>
<p>運転資本 = 1,046,000 − 510,000 = 536,000。流動比率 = 1,046,000 ÷ 510,000 = 2.051 ≒ 2.05。</p>
<p>未交付株式配当は資産の流出を伴わないため負債ではなく、払込資本として株主資本に表示する。解約返戻金は長期的に保有される投資として非流動資産に分類する。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-38", section: "FAR", chapter: "FAR-01", title: "その他の包括利益と累積その他の包括利益(AOCI)の期中変動",
  scenario: `<p>Lumen Inc. reports comprehensive income in a separate statement following the income statement. Net income for Year 3 was $500,000. All OCI items are subject to a 25% income tax rate. Enter debit (loss) balances as negative numbers.</p>
<table><tr><th>Exhibit 1 — AOCI at January 1, Year 3 (net of tax)</th><th>Balance</th></tr>
<tr><td>Net unrealized gains on available-for-sale (AFS) debt securities</td><td>$36,000</td></tr>
<tr><td>Foreign currency translation adjustment</td><td>(12,000)</td></tr>
<tr><td>Defined benefit pension items (net loss and prior service cost)</td><td>(60,000)</td></tr>
<tr><td>Cash flow hedge gains</td><td>9,000</td></tr>
<tr><td><b>Total AOCI</b></td><td><b>$(27,000)</b></td></tr></table>
<table><tr><th>Exhibit 2 — Year 3 activity (pretax)</th><th>Amount</th></tr>
<tr><td>Unrealized holding gains on AFS debt securities arising during the year</td><td>$40,000</td></tr>
<tr><td>Accumulated gain on AFS securities sold during the year, realized in net income</td><td>16,000</td></tr>
<tr><td>Translation loss on foreign subsidiary</td><td>(8,000)</td></tr>
<tr><td>Actuarial loss arising during the year</td><td>(20,000)</td></tr>
<tr><td>Amortization of net actuarial loss included in net periodic pension cost</td><td>6,000</td></tr>
<tr><td>Amortization of prior service cost included in net periodic pension cost</td><td>4,000</td></tr>
<tr><td>Gain on cash flow hedging derivative during the year</td><td>12,000</td></tr>
<tr><td>Hedge gain reclassified to earnings when the forecasted sale occurred</td><td>8,000</td></tr></table>
<p class="ja">Lumen社は損益計算書に続けて包括利益計算書を別に表示している。第3年度の当期純利益は$500,000。OCI項目にはすべて25%の税率が適用される。借方(損失)残高はマイナスで入力する。</p>
<p class="ja">資料1(期首AOCI、税効果後):売却可能負債証券の未実現利益$36,000、為替換算調整額$(12,000)、確定給付年金項目(数理計算上の損失と過去勤務費用)$(60,000)、キャッシュフロー・ヘッジ利益$9,000、合計$(27,000)。</p>
<p class="ja">資料2(第3年度の変動、税引前):売却可能負債証券の当期発生保有利益$40,000、当期売却分の累積利益で当期純利益に実現したもの$16,000、在外子会社の換算損失$(8,000)、当期発生の数理計算上の損失$(20,000)、年金費用に含めた数理計算上の損失の償却$6,000、過去勤務費用の償却$4,000、キャッシュフロー・ヘッジ・デリバティブの当期利益$12,000、予定取引の実現により損益へ振り替えたヘッジ利益$8,000。</p>`,
  rows: [
    { label: "Other comprehensive income for Year 3, net of tax(第3年度のOCI・税効果後)", type: "num", answer: 7500 },
    { label: "Comprehensive income for Year 3(第3年度の包括利益)", type: "num", answer: 507500 },
    { label: "Total AOCI at December 31, Year 3(第3年度末のAOCI合計)", type: "num", answer: -19500 },
    { label: "AFS component of AOCI at December 31, Year 3(期末AOCIのうち売却可能負債証券部分)", type: "num", answer: 54000 },
    { label: "Pension component of AOCI at December 31, Year 3(期末AOCIのうち年金部分)", type: "num", answer: -67500 },
    { label: "Reclassification adjustment for AFS securities, net of tax(売却可能負債証券の組替調整額・税効果後)", type: "num", answer: 12000 },
    { label: "Which item is NOT reported in OCI?(OCIに計上されない項目はどれか)", type: "select", options: ["Unrealized holding gain on AFS debt securities", "Foreign currency translation adjustment", "Unrealized holding gain on equity securities with readily determinable fair values", "Effective portion of a cash flow hedge gain"], answer: "Unrealized holding gain on equity securities with readily determinable fair values" },
  ],
  explain: `<p>税引前OCI:売却可能証券 40,000 − 組替16,000 = +24,000/換算 −8,000/年金 −20,000 + 6,000 + 4,000 = −10,000(償却分は損益へ振り替えられるためAOCIを増やす方向)/ヘッジ +12,000 − 8,000 = +4,000。合計 +10,000、税2,500、<b>OCI(税後)= 7,500</b>。</p>
<p>包括利益 = 500,000 + 7,500 = <b>507,500</b>。期末AOCI = −27,000 + 7,500 = <b>−19,500</b>。</p>
<p>売却可能証券部分 = 36,000 + 24,000 × 75% = <b>54,000</b>。年金部分 = −60,000 + (−10,000 × 75%) = <b>−67,500</b>。</p>
<p>組替調整額(税後)= 16,000 × 75% = <b>12,000</b>。二重計上を避けるため、過去にOCIで認識した利益が当期純利益に実現した時点でOCIから控除する。</p>
<p>容易に算定可能な公正価値をもつ持分証券の公正価値変動はASU 2016-01以降、当期純利益に計上し、OCIには計上しない。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-39", section: "FAR", chapter: "FAR-01", title: "公正価値ヒエラルキーのレベル判定とレベル3の期中変動",
  scenario: `<p>Corwin Holdings measures the following financial assets at fair value on a recurring basis at December 31, Year 2. You are preparing the fair value hierarchy disclosure (ASC 820).</p>
<table><tr><th>Asset</th><th>Valuation information</th><th>Value used</th></tr>
<tr><td>A. 10,000 shares of an NYSE-listed common stock</td><td>Closing price $42 per share. Because Corwin's block is large, a broker states the block could be sold only at a 5% discount.</td><td>See note</td></tr>
<tr><td>B. Corporate bonds (thinly traded)</td><td>Quoted prices for similar bonds in active markets, adjusted for observable yield curves</td><td>$310,000</td></tr>
<tr><td>C. Interest rate swap (asset)</td><td>Pricing model using observable SOFR swap curve over the full term</td><td>$45,000</td></tr>
<tr><td>D. Investment in a private company</td><td>Discounted cash flows based on management's internal projections</td><td>$260,000</td></tr>
<tr><td>E. Auction-rate securities</td><td>Auctions failed in Year 2; internal model with unobservable liquidity-discount assumptions</td><td>$90,000</td></tr></table>
<table><tr><th>Level 3 rollforward data — Year 2</th><th>Amount</th></tr>
<tr><td>Balance, January 1, Year 2</td><td>$310,000</td></tr>
<tr><td>Purchases</td><td>40,000</td></tr>
<tr><td>Transfers into Level 3 (auction-rate securities, at transfer date)</td><td>95,000</td></tr>
<tr><td>Sales</td><td>(110,000)</td></tr>
<tr><td>Total gains or losses included in earnings</td><td>?</td></tr>
<tr><td>Balance, December 31, Year 2</td><td>?</td></tr></table>
<p class="ja">Corwin社は第2年度12月31日に以下の金融資産を経常的に公正価値で測定している。ASC 820の公正価値ヒエラルキーの開示を作成する。</p>
<p class="ja">A:NYSE上場株式10,000株。終値は1株$42。保有ブロックが大きいため、ブローカーは5%割引でなければ売却できないとしている。B:取引の少ない社債。活発な市場における類似債券の相場価格を観察可能な利回り曲線で調整し$310,000。C:金利スワップ(資産)。期間全体にわたり観察可能なSOFRスワップ・カーブを用いたモデルで$45,000。D:非上場会社への投資。経営者の内部予測に基づくDCFで$260,000。E:オークション・レート証券。第2年度にオークションが不成立となり、観察不能な流動性割引の仮定を用いた内部モデルで$90,000。</p>
<p class="ja">レベル3の期中変動:期首残高$310,000、購入$40,000、レベル3への振替(オークション・レート証券、振替日の価額)$95,000、売却$(110,000)、当期純利益に含めた損益合計は?、期末残高は?</p>`,
  rows: [
    { label: "Fair value hierarchy level of Asset A(資産Aのレベル)", type: "select", options: ["Level 1", "Level 2", "Level 3"], answer: "Level 1" },
    { label: "Fair value reported for Asset A(資産Aの公正価値)", type: "num", answer: 420000 },
    { label: "Fair value hierarchy level of Asset B(資産Bのレベル)", type: "select", options: ["Level 1", "Level 2", "Level 3"], answer: "Level 2" },
    { label: "Fair value hierarchy level of Asset E(資産Eのレベル)", type: "select", options: ["Level 1", "Level 2", "Level 3"], answer: "Level 3" },
    { label: "Total Level 2 fair value measurements(レベル2の合計額)", type: "num", answer: 355000 },
    { label: "Total Level 3 fair value measurements at December 31, Year 2(期末のレベル3合計額)", type: "num", answer: 350000 },
    { label: "Total gains included in earnings in the Level 3 rollforward(レベル3の期中変動における当期純利益計上の利益)", type: "num", answer: 15000 },
  ],
  explain: `<p>A:同一資産の活発な市場における無調整の相場価格であるためレベル1。保有規模に起因するブロッケージ・ファクターは資産の特性ではなく保有単位の特性であり、調整は認められない。公正価値 = 10,000 × 42 = <b>420,000</b>。</p>
<p>B:類似資産の相場価格を観察可能なインプットで調整しているためレベル2。C:全期間にわたり観察可能なインプットのみを使うモデルなのでレベル2。レベル2合計 = 310,000 + 45,000 = <b>355,000</b>。</p>
<p>D:経営者の予測(観察不能インプット)に基づくためレベル3。E:オークション不成立により市場インプットがなく、観察不能な仮定が重要であるためレベル3。レベル3合計 = 260,000 + 90,000 = <b>350,000</b>。</p>
<p>レベル3の期中変動:310,000 + 40,000 + 95,000 − 110,000 + X = 350,000 → X = <b>15,000</b>(利益)。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-40", section: "FAR", chapter: "FAR-01", title: "現金主義から発生主義への修正(誤謬の訂正)と減価償却方法の変更",
  scenario: `<p>During Year 3, before closing its books, Pell Corp. discovered that it had been recording service revenue and supplies expense on the cash basis rather than the accrual basis. Pell presents comparative financial statements for Year 3 and Year 2. Ignore income taxes.</p>
<table><tr><th>Exhibit 1 — Cash-basis data</th><th>12/31/Year 1</th><th>12/31/Year 2</th></tr>
<tr><td>Accounts receivable (not recorded)</td><td>$60,000</td><td>$85,000</td></tr>
<tr><td>Customer advances included in cash collections, service not yet performed</td><td>20,000</td><td>12,000</td></tr>
<tr><td>Supplies on hand (expensed when paid)</td><td>15,000</td><td>22,000</td></tr>
<tr><td>Accounts payable for supplies (not recorded)</td><td>10,000</td><td>6,000</td></tr></table>
<table><tr><th>Exhibit 2 — Year 2 amounts as originally reported</th><th>Amount</th></tr>
<tr><td>Service revenue (cash collected from customers)</td><td>$900,000</td></tr>
<tr><td>Supplies expense (cash paid to suppliers)</td><td>140,000</td></tr>
<tr><td>Net income</td><td>210,000</td></tr>
<tr><td>Retained earnings, January 1, Year 2</td><td>700,000</td></tr>
<tr><td>Dividends declared and paid</td><td>50,000</td></tr>
<tr><td>Retained earnings, December 31, Year 2</td><td>860,000</td></tr></table>
<p>Exhibit 3 — Equipment acquired January 1, Year 1 for $400,000 (8-year life, no salvage value) has been depreciated using the double-declining-balance method. Effective January 1, Year 3, Pell switched to the straight-line method because it better reflects the pattern of consumption. The remaining life is unchanged.</p>
<p class="ja">Pell社は第3年度の決算前に、役務収益と消耗品費を発生主義ではなく現金主義で記録していたことを発見した。第3年度と第2年度の比較財務諸表を作成する。法人税は無視する。</p>
<p class="ja">資料1(未記録項目、第1年度末/第2年度末):売掛金$60,000/$85,000、入金済みだが役務未提供の前受金$20,000/$12,000、手許消耗品(支払時に費用処理)$15,000/$22,000、消耗品の買掛金$10,000/$6,000。</p>
<p class="ja">資料2(第2年度の当初報告額):役務収益(顧客からの入金額)$900,000、消耗品費(仕入先への支払額)$140,000、当期純利益$210,000、期首利益剰余金$700,000、配当$50,000、期末利益剰余金$860,000。</p>
<p class="ja">資料3:第1年度1月1日に$400,000で取得した設備(耐用年数8年、残存価額ゼロ)を200%定率法で償却してきた。第3年度1月1日より、消費パターンをより適切に反映する定額法に変更した。残存耐用年数は変わらない。</p>`,
  rows: [
    { label: "Restated Year 2 service revenue(修正再表示後の第2年度役務収益)", type: "num", answer: 933000 },
    { label: "Restated Year 2 supplies expense(修正再表示後の第2年度消耗品費)", type: "num", answer: 129000 },
    { label: "Restated Year 2 net income(修正再表示後の第2年度当期純利益)", type: "num", answer: 254000 },
    { label: "Adjustment to retained earnings at January 1, Year 2(第2年度期首利益剰余金の修正額)", type: "num", answer: 45000 },
    { label: "Restated retained earnings at December 31, Year 2(修正再表示後の第2年度末利益剰余金)", type: "num", answer: 949000 },
    { label: "Year 3 depreciation expense on the equipment(第3年度の設備減価償却費)", type: "num", answer: 37500 },
    { label: "Reporting of the switch from cash basis to accrual basis(現金主義から発生主義への変更の会計処理)", type: "select", options: ["Change in accounting principle — retrospective application", "Correction of an error — restatement of prior periods", "Change in accounting estimate — prospective", "Change in reporting entity — retrospective"], answer: "Correction of an error — restatement of prior periods" },
    { label: "Reporting of the change in depreciation method(減価償却方法の変更の会計処理)", type: "select", options: ["Change in accounting principle — retrospective application", "Change in accounting estimate effected by a change in accounting principle — prospective", "Correction of an error — restatement", "Cumulative effect reported in Year 3 net income"], answer: "Change in accounting estimate effected by a change in accounting principle — prospective" },
  ],
  explain: `<p>GAAPに準拠しない現金主義から発生主義への変更は誤謬の訂正であり、表示される過年度を修正再表示し、最も古い表示期間の期首利益剰余金を修正する(ASC 250)。</p>
<p>収益 = 入金900,000 + 売掛金増加(85,000 − 60,000)25,000 + 前受金減少(20,000 − 12,000)8,000 = <b>933,000</b>。</p>
<p>消耗品仕入 = 支払140,000 + 期末買掛金6,000 − 期首買掛金10,000 = 136,000。消耗品費 = 136,000 + 期首在庫15,000 − 期末在庫22,000 = <b>129,000</b>。</p>
<p>当期純利益 = 210,000 + (933,000 − 900,000) + (140,000 − 129,000) = 210,000 + 33,000 + 11,000 = <b>254,000</b>。</p>
<p>第2年度期首の累積影響 = 売掛金60,000 − 前受金20,000 + 消耗品15,000 − 買掛金10,000 = <b>45,000</b>。修正後期首利益剰余金 745,000。</p>
<p>期末利益剰余金 = 745,000 + 254,000 − 50,000 = <b>949,000</b>(検算:860,000 + 第2年度末の純影響 85,000 − 12,000 + 22,000 − 6,000 = 89,000 → 949,000)。</p>
<p>減価償却:第1年度 400,000 × 25% = 100,000、第2年度 300,000 × 25% = 75,000、第3年度期首簿価225,000 ÷ 残存6年 = <b>37,500</b>。減価償却方法の変更は会計原則の変更により生じた見積りの変更として将来に向かって処理する。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-41", section: "FAR", chapter: "FAR-01", title: "報告セグメントの判定(10%基準・75%基準)とASU 2023-07の開示",
  scenario: `<p>Delmar Industries has six operating segments. The chief operating decision maker (CODM) reviews the following Year 1 information (in thousands of dollars). Segment profit or loss is the measure used by the CODM.</p>
<table><tr><th>Segment</th><th>External revenue</th><th>Intersegment revenue</th><th>Profit (loss)</th><th>Identifiable assets</th></tr>
<tr><td>A</td><td>4,000</td><td>600</td><td>900</td><td>6,000</td></tr>
<tr><td>B</td><td>2,200</td><td>0</td><td>400</td><td>3,000</td></tr>
<tr><td>C</td><td>600</td><td>900</td><td>(150)</td><td>1,000</td></tr>
<tr><td>D</td><td>500</td><td>0</td><td>80</td><td>2,000</td></tr>
<tr><td>E</td><td>700</td><td>100</td><td>(500)</td><td>900</td></tr>
<tr><td>F</td><td>400</td><td>0</td><td>70</td><td>600</td></tr></table>
<p>None of the segments meets the aggregation criteria. Answer amounts in thousands of dollars.</p>
<p class="ja">Delmar社には6つの事業セグメントがある。最高経営意思決定者(CODM)は上表の第1年度情報(単位:千ドル)を検討している。CODMが用いる指標はセグメント損益である。集約基準を満たすセグメントはない。金額は千ドル単位で解答する。</p>
<p class="ja">表:セグメント/外部収益/セグメント間収益/損益/識別可能資産。A 4,000/600/900/6,000、B 2,200/0/400/3,000、C 600/900/(150)/1,000、D 500/0/80/2,000、E 700/100/(500)/900、F 400/0/70/600。</p>`,
  rows: [
    { label: "Threshold for the revenue test(収益基準の閾値)", type: "num", answer: 1000 },
    { label: "Threshold for the profit or loss test(損益基準の閾値)", type: "num", answer: 145 },
    { label: "Threshold for the asset test(資産基準の閾値)", type: "num", answer: 1350 },
    { label: "Is Segment D reportable?(セグメントDは報告セグメントか)", type: "select", options: ["Yes — revenue test", "Yes — profit or loss test", "Yes — asset test", "No — fails all tests"], answer: "Yes — asset test" },
    { label: "Is Segment E reportable?(セグメントEは報告セグメントか)", type: "select", options: ["Yes — revenue test", "Yes — profit or loss test", "Yes — asset test", "No — fails all tests"], answer: "Yes — profit or loss test" },
    { label: "Number of reportable segments(報告セグメントの数)", type: "num", answer: 5 },
    { label: "External revenue of reportable segments compared in the 75% test(75%基準で比較する報告セグメントの外部収益)", type: "num", answer: 8000 },
    { label: "Which disclosure is required for each reportable segment under ASU 2023-07?(ASU 2023-07で各報告セグメントに求められる開示)", type: "select", options: ["Significant segment expenses regularly provided to the CODM", "Segment cash flows from operating activities", "Segment fair value hierarchy tables", "Segment earnings per share"], answer: "Significant segment expenses regularly provided to the CODM" },
  ],
  explain: `<p>収益基準:セグメント間収益を含む総収益 8,400 + 1,600 = 10,000 の10% = <b>1,000</b>。A 4,600、B 2,200、C 1,500が合格、D 500、E 800、F 400は不合格。</p>
<p>損益基準:利益合計(A 900 + B 400 + D 80 + F 70)= 1,450、損失合計(C 150 + E 500)= 650。絶対値の大きい1,450の10% = <b>145</b>。A、B、C(150)、E(500)が合格。</p>
<p>資産基準:総資産13,500の10% = <b>1,350</b>。A、B、D(2,000)が合格。</p>
<p>Dは資産基準のみ合格、Eは損益基準のみ合格。Fはいずれも不合格。報告セグメントはA〜Eの<b>5</b>つ。</p>
<p>75%基準:報告セグメントの外部収益 4,000 + 2,200 + 600 + 500 + 700 = <b>8,000</b> ≧ 外部収益合計8,400 × 75% = 6,300 なので、追加の報告セグメントは不要である。</p>
<p>ASU 2023-07は、CODMに定期的に提供されセグメント損益に含まれる重要なセグメント費用の開示を求める(CODMの役職名とその利用方法も開示)。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-42", section: "FAR", chapter: "FAR-02", title: "5ステップ:重要な権利(追加購入オプション)と業績ボーナスを含む契約",
  scenario: `<p>On October 1, Year 1, Fennick Robotics signed a contract with Ardent Foods and received a nonrefundable payment of $340,000. Fennick's fiscal year ends December 31.</p>
<table><tr><th>Exhibit 1 — Promises in the contract</th><th>Standalone selling price</th></tr>
<tr><td>Robotic packing arm; control transfers on delivery, October 1, Year 1</td><td>$300,000</td></tr>
<tr><td>Installation (routine; other vendors can perform it), completed October 31, Year 1</td><td>20,000</td></tr>
<tr><td>Maintenance service for 24 months beginning November 1, Year 1</td><td>64,000</td></tr>
<tr><td>Option to buy additional arms within 12 months at a 40% discount (other customers receive only 10%)</td><td>16,000 (estimated)</td></tr></table>
<p>Exhibit 2 — Email from the sales director: "Ardent will pay a $20,000 bonus if the arm achieves the throughput target by June 30, Year 2. The outcome is binary — either we earn the full $20,000 or nothing. Engineering is 85% confident; I see no realistic chance of a significant reversal."</p>
<p>Fennick allocates the transaction price, including the bonus, on a relative standalone selling price basis. Ardent had not exercised the option by December 31, Year 1.</p>
<p class="ja">第1年度10月1日、Fennick社はArdent社と契約を締結し、返金不要の$340,000を受け取った。決算日は12月31日である。</p>
<p class="ja">資料1(約束と独立販売価格):ロボット・アーム(10月1日の引渡時に支配が移転)$300,000、据付(定型作業で他社も実施可能、10月31日完了)$20,000、11月1日から24か月の保守サービス$64,000、12か月以内に追加アームを40%引きで購入できるオプション(他の顧客は10%引きのみ)$16,000(見積り)。</p>
<p class="ja">資料2(営業部長のメール):「第2年度6月30日までに処理能力目標を達成すれば$20,000のボーナスが支払われる。結果は全額か無しかの二者択一である。技術部門の確信度は85%で、重大な戻入れが生じる現実的な可能性はない。」</p>
<p class="ja">ボーナスを含む取引価格は独立販売価格の比率で配分する。第1年度末までにオプションは行使されていない。</p>`,
  rows: [
    { label: "Transaction price(取引価格)", type: "num", answer: 360000 },
    { label: "Method to estimate the bonus(ボーナスの見積方法)", type: "select", options: ["Expected value", "Most likely amount", "Exclude until the uncertainty is resolved", "Minimum amount guaranteed"], answer: "Most likely amount" },
    { label: "Accounting for the purchase option(追加購入オプションの会計処理)", type: "select", options: ["Material right — separate performance obligation", "Marketing offer — not a performance obligation", "Variable consideration", "Consideration payable to a customer"], answer: "Material right — separate performance obligation" },
    { label: "Transaction price allocated to the robotic arm(ロボット・アームへの配分額)", type: "num", answer: 270000 },
    { label: "Transaction price allocated to the purchase option(購入オプションへの配分額)", type: "num", answer: 14400 },
    { label: "Total revenue recognized in Year 1(第1年度の収益合計)", type: "num", answer: 292800 },
    { label: "Net contract liability at December 31, Year 1(第1年度末の契約負債・純額)", type: "num", answer: 47200 },
  ],
  explain: `<p>ステップ3:ボーナスは結果が二者択一なので最頻値法が適切である。重大な戻入れの可能性が低いので制約は不要で、取引価格 = 340,000 + 20,000 = <b>360,000</b>。</p>
<p>ステップ2:追加購入オプションは他の顧客が受けられない割引(40% − 10%)を与えるため重要な権利であり、別個の履行義務である。据付は他社でも実施可能で区別できる。</p>
<p>ステップ4:独立販売価格合計 = 300,000 + 20,000 + 64,000 + 16,000 = 400,000。配分比率 360,000 ÷ 400,000 = 90%。アーム <b>270,000</b>、据付18,000、保守57,600、オプション <b>14,400</b>。</p>
<p>ステップ5:第1年度収益 = アーム270,000 + 据付18,000 + 保守57,600 × 2/24 = 4,800 + オプション0(未行使)= <b>292,800</b>。</p>
<p>契約単位の純額:受領額340,000 − 認識収益292,800 = <b>47,200</b>の契約負債(ボーナスはまだ無条件の権利ではないため債権は計上しない)。</p>`,
});

CPA.tbs({
  id: "TBS-FAR-43", section: "FAR", chapter: "FAR-02", title: "本人か代理人か(オンライン・プラットフォームの4取引)",
  scenario: `<p>Tessaro Inc. operates an online platform. Its Year 1 transactions are summarized below.</p>
<table><tr><th>Arrangement</th><th>Facts</th></tr>
<tr><td>1. Marketplace sales</td><td>Third-party sellers list and ship their own goods and set prices. Tessaro never controls the goods. Customers paid $800,000 through the platform; Tessaro remitted 85% to the sellers.</td></tr>
<tr><td>2. House-brand products</td><td>Tessaro buys products from a manufacturer, holds them in its warehouse, sets prices, and accepts returns. Sales $500,000; cost $300,000.</td></tr>
<tr><td>3. Travel packages</td><td>Tessaro prepays non-refundable hotel room blocks, bundles them, and sets the selling price. Unsold rooms are Tessaro's loss. Sales $200,000; cost $150,000.</td></tr>
<tr><td>4. Concert tickets</td><td>Tessaro sells tickets on behalf of a venue at prices set by the venue and earns a 10% commission. Ticket sales $300,000. The venue is responsible for the concert.</td></tr></table>
<p class="ja">Tessaro社はオンライン・プラットフォームを運営している。第1年度の取引は以下のとおり。</p>
<p class="ja">1. マーケットプレイス販売:第三者の売手が自ら商品を出品・発送し価格を決める。Tessaroは商品を支配しない。顧客は$800,000を支払い、Tessaroは85%を売手に送金した。2. 自社ブランド商品:製造業者から仕入れ、自社倉庫で保管し、価格を設定し、返品を受け付ける。売上$500,000、原価$300,000。3. 旅行パッケージ:返金不可のホテル客室枠を前払いで確保し、組み合わせて販売価格を決める。売れ残りはTessaroの損失。売上$200,000、原価$150,000。4. コンサート・チケット:会場の代理として会場が決めた価格で販売し、10%の手数料を得る。チケット売上$300,000。公演の責任は会場が負う。</p>`,
  rows: [
    { label: "Tessaro's role in Arrangement 1(取引1におけるTessaroの立場)", type: "select", options: ["Principal — report gross revenue", "Agent — report net commission", "Neither — no revenue (pass-through)"], answer: "Agent — report net commission" },
    { label: "Revenue from Arrangement 1(取引1の収益)", type: "num", answer: 120000 },
    { label: "Tessaro's role in Arrangement 3(取引3におけるTessaroの立場)", type: "select", options: ["Principal — report gross revenue", "Agent — report net commission", "Neither — no revenue (pass-through)"], answer: "Principal — report gross revenue" },
    { label: "Revenue from Arrangement 3(取引3の収益)", type: "num", answer: 200000 },
    { label: "Revenue from Arrangement 4(取引4の収益)", type: "num", answer: 30000 },
    { label: "Total Year 1 revenue(第1年度の収益合計)", type: "num", answer: 850000 },
    { label: "Overarching principle for the principal-versus-agent determination(本人か代理人かの判定の基本原則)", type: "select", options: ["Whether the entity controls the specified good or service before it is transferred to the customer", "Whether the entity bears credit risk", "Whether consideration is in the form of a commission", "Whether legal title passes to the entity, even momentarily"], answer: "Whether the entity controls the specified good or service before it is transferred to the customer" },
  ],
  explain: `<p>判定の基本原則は、特定の財・サービスが顧客に移転する前に企業がそれを支配しているかどうかである(ASC 606-10-55-36〜40)。主たる責任、在庫リスク、価格決定権は支配の指標であり、信用リスクや手数料形式は現行基準の指標ではない。</p>
<p>取引1:売手が商品を支配し価格も決めるため代理人。収益 = 800,000 × 15% = <b>120,000</b>。</p>
<p>取引2:在庫を保有し価格を決め返品も受けるため本人。収益500,000。</p>
<p>取引3:返金不可の客室を前払いで確保し在庫リスクを負い価格を決めるため本人。収益 = <b>200,000</b>(総額)。</p>
<p>取引4:価格は会場が決め、履行責任も会場にあるため代理人。収益 = 300,000 × 10% = <b>30,000</b>。</p>
<p>合計 = 120,000 + 500,000 + 200,000 + 30,000 = <b>850,000</b>。</p>`,
});
