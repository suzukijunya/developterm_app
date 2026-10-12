// FAR の追加問題(法人所得税・キャッシュフロー計算書)

CPA.extend("FAR-07", {
  mcq: [
    {
      q: "Which of the following items gives rise to a deferred tax asset under ASC 740?",
      ja: "ASC 740において、繰延税金資産を生じさせる項目はどれか。",
      c: [
        "Gross profit on an installment sale recognized for books at the point of sale but taxed as cash is collected",
        "Use of an accelerated depreciation method for tax and straight-line depreciation for books",
        "Estimated warranty costs accrued for books in the year of sale but deducted for tax when paid",
        "Premiums paid on a life insurance policy covering a key officer, with the company as beneficiary",
      ],
      a: 2,
      ex: "製品保証費は会計上先に費用計上され、税務上は支払時に損金算入されるため将来減算一時差異となり繰延税金資産を生じる。割賦販売益と加速償却は将来加算一時差異(繰延税金負債)、役員保険料は永久差異である。",
    },
    {
      q: "Which of the following differences between financial and taxable income is a permanent difference that does NOT create deferred taxes?",
      ja: "会計上の利益と課税所得の差異のうち、繰延税金を生じさせない永久差異はどれか。",
      c: [
        "The dividends-received deduction on dividends from a domestic corporation",
        "Rent collected in advance that is taxable when received",
        "An allowance for credit losses recognized for books, with deductions taken on write-off for tax",
        "Prepaid expenses deducted for tax when paid but expensed for books as consumed",
      ],
      a: 0,
      ex: "受取配当控除(DRD)は将来解消しない永久差異であり、繰延税金は認識しない。前受家賃・貸倒引当金・前払費用はいずれも時の経過で解消する一時差異である。",
    },
    {
      q: "At the end of Year 1, a company has a cumulative taxable temporary difference of $120,000 related to depreciation, which will reverse as follows: $50,000 in Year 2, $40,000 in Year 3, and $30,000 in Year 4. Enacted tax rates are 25% for Year 2, 22% for Year 3, and 20% for Year 4. What deferred tax liability should be reported at the end of Year 1?",
      ja: "第1期末において、減価償却に関する将来加算一時差異の累計額は$120,000であり、第2期に$50,000、第3期に$40,000、第4期に$30,000解消する。制定済税率は第2期25%、第3期22%、第4期20%である。第1期末に計上すべき繰延税金負債はいくらか。",
      c: ["$30,000", "$24,000", "$26,400", "$27,300"],
      a: 3,
      ex: "解消年度ごとに制定済税率を適用する:50,000×25% + 40,000×22% + 30,000×20% = 12,500 + 8,800 + 6,000 = 27,300。当期税率25%を一律に適用した$30,000は誤り。",
    },
    {
      q: "A company reported pretax financial income of $600,000, which includes $30,000 of interest on municipal bonds. Tax depreciation exceeded book depreciation by $50,000 during the year. The enacted tax rate is 21% for all years. What total income tax expense should be reported?",
      ja: "税引前利益は$600,000で、地方債利息$30,000を含む。当期の税務上の減価償却費は会計上を$50,000上回った。制定済税率は全期間21%である。計上すべき法人税等合計はいくらか。",
      c: ["$109,200", "$119,700", "$126,000", "$130,200"],
      a: 1,
      ex: "当期税金 = (600,000 − 30,000 − 50,000) × 21% = 109,200、繰延税金費用 = 50,000 × 21% = 10,500、合計119,700(=永久差異控除後の570,000×21%)。$109,200は当期分のみ、$126,000は地方債利息を除外していない。",
    },
    {
      q: "At year-end, a company has gross deferred tax assets of $200,000. Management concludes, based on the weight of available evidence, that it is more likely than not that only $150,000 will be realized. The valuation allowance at the beginning of the year was $20,000. What is the effect of the valuation allowance adjustment on current-year income tax expense?",
      ja: "期末の繰延税金資産総額は$200,000である。経営者は入手可能な証拠に基づき、$150,000のみが実現する可能性の方が高いと結論付けた。期首の評価性引当額は$20,000であった。評価性引当額の調整は当期の法人税等にどう影響するか。",
      c: [
        "Increase of $50,000",
        "Decrease of $30,000",
        "Increase of $30,000",
        "No effect; the allowance is recorded directly in equity",
      ],
      a: 2,
      ex: "必要な評価性引当額は200,000 − 150,000 = 50,000。期首20,000から30,000増加させ、繰延税金費用(法人税等)が30,000増加する。$50,000は期首残高を考慮していない。",
    },
    {
      q: "In assessing whether a valuation allowance is needed for deferred tax assets, which of the following is NOT one of the four sources of taxable income that may be considered under ASC 740?",
      ja: "繰延税金資産に評価性引当額が必要かを判断する際、ASC 740で考慮できる4つの課税所得の源泉に該当しないものはどれか。",
      c: [
        "Future reversals of existing taxable temporary differences",
        "Tax-planning strategies that are prudent and feasible",
        "Taxable income in prior carryback years, if carryback is permitted under the tax law",
        "A history of cumulative losses in recent years",
      ],
      a: 3,
      ex: "4つの源泉は、既存の将来加算一時差異の解消、解消分を除く将来課税所得、繰戻可能年度の課税所得、タックスプランニング戦略である。直近の累積損失は課税所得の源泉ではなく、評価性引当額を支持する重要な否定的証拠である。",
    },
    {
      q: "A corporation has a net operating loss carryforward of $500,000 that arose in a tax year beginning in 2022. In the current year, its taxable income before the NOL deduction is $400,000. Assuming no other limitations, what is taxable income after the NOL deduction?",
      ja: "法人には2022年開始事業年度に発生した$500,000の欠損金(NOL)繰越がある。当期のNOL控除前課税所得は$400,000である。他の制限がないとすると、NOL控除後の課税所得はいくらか。",
      c: ["$0", "$100,000", "$80,000", "$320,000"],
      a: 2,
      ex: "2017年後に発生したNOLの控除はNOL控除前課税所得の80%が上限:400,000 × 80% = 320,000。課税所得 = 400,000 − 320,000 = 80,000、残りの180,000は無期限に繰越す。$0は80%制限を無視している。",
    },
    {
      q: "In Year 1, its first year of operations, a corporation incurred a net operating loss of $300,000 for tax purposes, which equals its pretax book loss. The enacted rate is 21%, carryback is not permitted, and management concludes that it is more likely than not that the full loss will be utilized. How should the tax effect be reported in Year 1?",
      ja: "営業初年度の第1期、法人は税務上$300,000の欠損金を計上した(会計上の税引前損失と同額)。制定済税率は21%、繰戻しは認められず、経営者は欠損金全額が利用される可能性の方が高いと結論付けた。第1期に税効果をどう報告すべきか。",
      c: [
        "A deferred tax asset and an income tax benefit of $63,000",
        "An income tax refund receivable and an income tax benefit of $63,000",
        "No tax benefit until the loss is actually used to reduce taxes payable",
        "A deferred tax asset of $63,000 with an offsetting credit to additional paid-in capital",
      ],
      a: 0,
      ex: "繰越欠損金は将来の税金を減らすため、300,000 × 21% = 63,000の繰延税金資産と法人税等(ベネフィット)を損失発生年度に認識する。繰戻しができないため還付未収金は生じない。実現の可能性が高い限り、使用時まで認識を遅らせることはない。",
    },
    {
      q: "A company took a tax position that reduces its current tax liability by $100,000. It concludes that the position is more likely than not to be sustained on examination. The estimated possible outcomes upon settlement are: $100,000 (30% probability), $80,000 (25%), $60,000 (20%), and $40,000 (25%). What amount of tax benefit should the company recognize?",
      ja: "会社は当期税額を$100,000減らす税務ポジションを採用し、税務調査で認められる可能性の方が高いと結論付けた。和解時の結果の見積りは、$100,000(確率30%)、$80,000(25%)、$60,000(20%)、$40,000(25%)である。認識すべき税務上の便益はいくらか。",
      c: ["$100,000", "$72,000", "$80,000", "$60,000"],
      a: 2,
      ex: "第2段階の測定では、累積確率が50%を超える最大の金額を認識する。100,000(30%)→80,000(累積55%)となり80,000を認識し、20,000は未認識税務便益の負債とする。$72,000は期待値で、ASC 740の測定方法ではない。",
    },
    {
      q: "A company claimed a deduction that reduced its current income taxes by $10,500. Based on the technical merits, management believes there is only a 40% likelihood that the deduction would be sustained if examined. What should the company report for this position?",
      ja: "会社は当期の税額を$10,500減らす控除を申告した。経営者は、技術的なメリットに基づくと調査時に認められる可能性は40%にすぎないと考えている。このポジションについて何を報告すべきか。",
      c: [
        "A recognized tax benefit of $4,200 and a liability of $6,300",
        "A recognized tax benefit of $10,500 and disclosure of the uncertainty",
        "A recognized tax benefit of $5,250 and a liability of $5,250",
        "No recognized tax benefit and a liability for unrecognized tax benefits of $10,500",
      ],
      a: 3,
      ex: "第1段階(認識)で「認められる可能性の方が高い(50%超)」を満たさないため、便益は一切認識せず、申告で得た$10,500全額を未認識税務便益の負債とする。確率を乗じた$4,200の認識は誤り。",
    },
    {
      q: "Under ASC 740, how should a company classify interest and penalties related to unrecognized tax benefits in its income statement?",
      ja: "ASC 740において、未認識税務便益に関する利息と罰金は損益計算書上どのように分類すべきか。",
      c: [
        "Always as income tax expense",
        "As either income tax expense or interest/other expense, based on an accounting policy election that is applied consistently and disclosed",
        "Always as interest expense and other operating expense, respectively",
        "As a direct charge to retained earnings",
      ],
      a: 1,
      ex: "利息・罰金は、法人税等として表示するか、支払利息・その他費用として表示するかを会計方針として選択し、継続適用して開示する。いずれかに強制されるわけではない。",
    },
    {
      q: "At December 31, Year 1, a company had a deferred tax liability of $84,000, based on taxable temporary differences of $400,000 and an enacted rate of 21%. In June Year 2, legislation was enacted reducing the rate to 15% for all future years. Taxable temporary differences remain $400,000 at the enactment date. How should the effect be reported?",
      ja: "第1期末12月31日の繰延税金負債は$84,000(将来加算一時差異$400,000×制定済税率21%)。第2期6月に、将来のすべての年度の税率を15%に引き下げる法律が制定された。制定日の将来加算一時差異は$400,000のままである。その影響をどう報告すべきか。",
      c: [
        "As a $24,000 reduction of income tax expense from continuing operations in Year 2",
        "As a $24,000 increase in retained earnings at the beginning of Year 2",
        "Prospectively, as the temporary differences reverse in future years",
        "As a $24,000 credit to other comprehensive income",
      ],
      a: 0,
      ex: "税率変更の影響(84,000 − 400,000×15% = 24,000)は、制定日を含む期間に継続事業の法人税等で一括認識する。遡及修正や将来の解消時の認識はしない。",
    },
    {
      q: "A company's deferred tax liability relates entirely to unrealized holding gains on available-for-sale debt securities, which were originally recognized net of tax in other comprehensive income. A reduction in the enacted tax rate is subsequently enacted. Absent any special transition election, where is the adjustment of the deferred tax liability reported?",
      ja: "会社の繰延税金負債はすべて売却可能(AFS)負債証券の未実現保有利益に関するもので、当初は税効果控除後でその他の包括利益(OCI)に計上された。その後、税率引下げが制定された。特別な経過措置の選択がないとすると、繰延税金負債の修正額はどこに報告されるか。",
      c: [
        "Other comprehensive income, consistent with the original item",
        "Directly in accumulated other comprehensive income without passing through OCI",
        "Income tax expense from continuing operations",
        "As a prior-period adjustment to retained earnings",
      ],
      a: 2,
      ex: "ASC 740は「後追い(backwards tracing)」を禁止しており、税率変更の影響は元の項目がOCIであっても継続事業の法人税等に計上する。このためAOCIに税効果の残滓(stranded tax effects)が生じる。",
    },
    {
      q: "A company reports pretax income from continuing operations of $800,000 and a pretax loss from discontinued operations of $200,000. The enacted tax rate is 25%, and there are no other differences. Under intraperiod tax allocation, what income tax expense is allocated to continuing operations?",
      ja: "継続事業からの税引前利益は$800,000、非継続事業からの税引前損失は$200,000である。税率は25%で、他の差異はない。期間内税金配分により継続事業に配分される法人税等はいくらか。",
      c: ["$150,000", "$250,000", "$50,000", "$200,000"],
      a: 3,
      ex: "継続事業の法人税等はまず継続事業の利益だけで計算する:800,000 × 25% = 200,000。非継続事業は税効果50,000を控除した純額150,000の損失で表示する。$150,000は全社の税額合計であり誤り。",
    },
    {
      q: "A company has the following deferred tax balances, all related to noncurrent items: federal deferred tax liability $70,000; federal deferred tax asset $30,000; state deferred tax asset $12,000 (a different tax jurisdiction). There is no valuation allowance. How should these be presented in the classified balance sheet?",
      ja: "会社の繰延税金残高は次のとおりである:連邦の繰延税金負債$70,000、連邦の繰延税金資産$30,000、州(別の課税管轄)の繰延税金資産$12,000。評価性引当額はない。区分貸借対照表でどのように表示すべきか。",
      c: [
        "A noncurrent deferred tax liability of $28,000",
        "A noncurrent deferred tax liability of $40,000 and a noncurrent deferred tax asset of $12,000",
        "A noncurrent deferred tax liability of $70,000 and a noncurrent deferred tax asset of $42,000",
        "Current and noncurrent amounts based on the classification of the related assets and liabilities",
      ],
      a: 1,
      ex: "繰延税金はすべて非流動に分類し、同一の納税主体・課税管轄内でのみ相殺する。連邦分は70,000 − 30,000 = 40,000の負債、州分は12,000の資産として別建てで表示する。管轄をまたいだ相殺($28,000)は認められない。",
    },
    {
      q: "A company reports pretax financial income of $1,000,000. The amount includes $50,000 of tax-exempt municipal bond interest and is after deducting $20,000 of nondeductible fines. There are no temporary differences, and the statutory federal rate is 21%. What is the company's effective tax rate?",
      ja: "税引前利益は$1,000,000で、非課税の地方債利息$50,000を含み、損金不算入の罰金$20,000を控除した後の金額である。一時差異はなく、連邦法定税率は21%である。実効税率はいくらか。",
      c: ["21.00%", "19.95%", "20.37%", "21.42%"],
      a: 2,
      ex: "法人税等 = (1,000,000 − 50,000 + 20,000) × 21% = 203,700、実効税率 = 203,700 ÷ 1,000,000 = 20.37%。19.95%は罰金を、21.42%は地方債利息を考慮していない。",
    },
    {
      q: "A calendar-year company reported pretax ordinary income of $100,000 in the first quarter and $150,000 in the second quarter. At the end of the first quarter, the estimated annual effective tax rate was 25%; at the end of the second quarter, the estimate was revised to 24%. What income tax expense should be reported for the second quarter?",
      ja: "暦年決算の会社は、第1四半期に$100,000、第2四半期に$150,000の税引前経常利益を計上した。第1四半期末の見積年間実効税率は25%、第2四半期末には24%に改訂された。第2四半期に計上すべき法人税等はいくらか。",
      c: ["$35,000", "$36,000", "$37,500", "$60,000"],
      a: 0,
      ex: "累計(年初来)で計算する:(100,000 + 150,000) × 24% = 60,000から第1四半期計上額25,000を差し引き35,000。見積変更は当四半期で累計的に調整するため、150,000×24%=36,000は誤り。",
    },
    {
      q: "In the second quarter, a company recognizes a significant unusual gain from the settlement of litigation. How is the tax effect of this gain reported in the interim financial statements?",
      ja: "第2四半期に、会社は訴訟の和解により重要な異常利益を計上した。この利益の税効果は期中財務諸表においてどのように報告されるか。",
      c: [
        "It is included in the estimated annual effective tax rate and spread over all four quarters",
        "It is recognized entirely in the second quarter as a discrete item, not included in the estimated annual effective tax rate",
        "It is deferred and recognized in the fourth quarter when the annual tax return is prepared",
        "It is reported net in other comprehensive income",
      ],
      a: 1,
      ex: "異常・非経常的な項目は見積年間実効税率の計算から除外し、その税効果は発生した四半期に個別(discrete)に認識する。経常利益は見積年間実効税率で計算する。",
    },
    {
      q: "A company acquired 100% of the stock of a target in a nontaxable business combination and recorded goodwill of $500,000, none of which is deductible for tax purposes. What deferred tax should be recognized for the goodwill at the acquisition date?",
      ja: "会社は非課税の企業結合で対象会社株式の100%を取得し、のれん$500,000を計上した。のれんは税務上まったく損金算入できない。取得日に、のれんについてどのような繰延税金を認識すべきか。",
      c: [
        "A deferred tax liability equal to $500,000 times the enacted rate",
        "A deferred tax asset equal to $500,000 times the enacted rate",
        "A deferred tax liability recognized only when the goodwill is later impaired",
        "No deferred tax liability is recognized for the nondeductible goodwill",
      ],
      a: 3,
      ex: "ASC 805-740により、損金算入できないのれん(会計上ののれんが税務上ののれんを超える部分)については取得日に繰延税金負債を認識しない。認識すると、のれんと繰延税金負債が循環的に増加するためである。",
    },
    {
      q: "In a taxable business combination, tax-deductible goodwill is $600,000 and book goodwill before considering deferred taxes is $500,000. How does ASC 740 treat this difference at the acquisition date?",
      ja: "課税対象の企業結合において、税務上損金算入できるのれんは$600,000、繰延税金を考慮する前の会計上ののれんは$500,000である。ASC 740は取得日にこの差異をどう扱うか。",
      c: [
        "A deferred tax asset is recognized for the excess tax goodwill, which reduces book goodwill (using a simultaneous-equation computation)",
        "No deferred taxes are recognized because goodwill differences are always permanent",
        "A deferred tax liability is recognized for the $100,000 difference",
        "The excess tax goodwill is recognized as a tax benefit in income only when deducted on the tax return",
      ],
      a: 0,
      ex: "税務上ののれんが会計上ののれんを上回る場合、その差異について繰延税金資産を取得日に認識し、その分だけ会計上ののれんを減らす(連立方程式による反復計算)。逆の場合(会計上が上回る)は繰延税金負債を認識しない点と区別する。",
    },
    {
      q: "A company's pretax financial income was $2,000,000, after recognizing a $400,000 impairment loss on goodwill that is not deductible for tax purposes. There are no other book-tax differences, and the enacted rate is 21%. What is income tax expense for the year?",
      ja: "税引前利益は$2,000,000で、税務上損金算入できないのれんの減損損失$400,000を計上した後の金額である。他の差異はなく、制定済税率は21%である。当期の法人税等はいくらか。",
      c: ["$420,000", "$336,000", "$504,000", "$0"],
      a: 2,
      ex: "損金不算入ののれんの減損は永久差異:課税所得 = 2,000,000 + 400,000 = 2,400,000、法人税等 = 2,400,000 × 21% = 504,000。$420,000は減損を加算しておらず、$336,000は逆に控除している。",
    },
    {
      q: "An investor owns 30% of a domestic investee and applies the equity method. During the year it recognized equity income of $100,000 and received dividends of $30,000. Dividends qualify for a 65% dividends-received deduction, the enacted rate is 21%, and the investor expects to recover undistributed earnings through future dividends. What deferred tax liability arises from this year's activity?",
      ja: "投資会社は国内の投資先の株式30%を保有し持分法を適用している。当期に持分法利益$100,000を計上し、配当$30,000を受け取った。配当は65%の受取配当控除の対象で、制定済税率は21%、未分配利益は将来の配当により回収すると見込んでいる。当期の取引から生じる繰延税金負債はいくらか。",
      c: ["$14,700", "$5,145", "$7,350", "$0"],
      a: 1,
      ex: "一時差異は未分配利益 100,000 − 30,000 = 70,000。配当で回収する前提なので課税対象は35%:70,000 × 35% × 21% = 5,145。$14,700はDRDを無視、$7,350は受取済の配当まで含めている。",
    },
    {
      q: "In December Year 1, a lessor collected $60,000 of rent for Year 2, which is taxable when received. The enacted tax rate is 25% for all years. Which of the following is correct at December 31, Year 1?",
      ja: "第1期12月、貸手は第2期分の家賃$60,000を受け取った。この家賃は受取時に課税される。制定済税率は全期間25%である。第1期12月31日時点で正しいものはどれか。",
      c: [
        "A deferred tax liability of $15,000 is reported",
        "No deferred taxes arise because the cash has been received",
        "A deferred tax asset of $15,000 is reported",
        "A permanent difference of $60,000 reduces the effective tax rate",
      ],
      a: 2,
      ex: "前受家賃は先に課税され会計上は翌期に収益認識されるため、将来減算一時差異となり60,000 × 25% = 15,000の繰延税金資産を計上する。収益が先行して課税が後になる場合(負債)と取り違えないこと。",
    },
    {
      q: "A company's income taxes payable for the year are $120,000. Its deferred tax liability increased from $40,000 to $55,000, and its deferred tax asset (no valuation allowance) increased from $10,000 to $18,000. What is total income tax expense?",
      ja: "当期の未払法人税等(当期税額)は$120,000である。繰延税金負債は$40,000から$55,000に増加し、繰延税金資産(評価性引当額なし)は$10,000から$18,000に増加した。法人税等合計はいくらか。",
      c: ["$143,000", "$113,000", "$135,000", "$127,000"],
      a: 3,
      ex: "法人税等 = 当期税額120,000 + DTL増加15,000 − DTA増加8,000 = 127,000。DTAの増加は繰延税金ベネフィット(費用の減少)であるため、加算した$143,000は誤り。",
    },
    {
      q: "A company reports pretax financial income of $300,000. It includes $10,000 of business meal expenses (50% deductible), $8,000 of fines paid to a government agency, and $12,000 of interest on municipal bonds. There are no temporary differences. What is taxable income?",
      ja: "税引前利益は$300,000で、飲食費$10,000(50%損金算入可)、政府機関への罰金$8,000、地方債利息$12,000を含む。一時差異はない。課税所得はいくらか。",
      c: ["$306,000", "$301,000", "$325,000", "$299,000"],
      a: 1,
      ex: "課税所得 = 300,000 + 飲食費の不算入分5,000 + 罰金8,000 − 地方債利息12,000 = 301,000。$306,000は飲食費全額を加算している。いずれも永久差異で繰延税金は生じない。",
    },
    {
      q: "At the beginning of the year, a company had a deferred tax asset of $80,000 fully offset by a valuation allowance because of cumulative losses. During the year, the company achieved sustained profitability and now concludes that it is more likely than not that the entire deferred tax asset will be realized. How is the release of the valuation allowance reported?",
      ja: "期首、会社の繰延税金資産$80,000には累積損失を理由に全額の評価性引当額が設定されていた。当期、会社は持続的な黒字化を達成し、繰延税金資産全額が実現する可能性の方が高いと結論付けた。評価性引当額の取崩しはどう報告されるか。",
      c: [
        "As an $80,000 reduction of income tax expense from continuing operations in the current year",
        "As a prior-period adjustment to beginning retained earnings",
        "Ratably over the periods in which the deferred tax asset is realized",
        "As a credit to additional paid-in capital",
      ],
      a: 0,
      ex: "実現可能性の判断の変更による期首評価性引当額の取崩しは見積りの変更であり、判断が変わった期の継続事業の法人税等の減少として一括認識する。遡及修正はしない。",
    },
    {
      q: "A calendar-year company issues its financial statements in March Year 2. In February Year 2, a new tax law was enacted that increases the corporate rate for future years. How should the company measure its deferred tax balances at December 31, Year 1?",
      ja: "暦年決算の会社は第2期3月に財務諸表を発行する。第2期2月、将来年度の法人税率を引き上げる新税法が制定された。第1期12月31日の繰延税金残高はどのように測定すべきか。",
      c: [
        "Using the new rate, because it was enacted before the financial statements were issued",
        "Using the average of the old and new rates",
        "Using the rates enacted at December 31, Year 1, with the effect of the new law recognized in Year 2 and disclosed as a nonrecognized subsequent event",
        "Using the new rate, with the effect reported in other comprehensive income",
      ],
      a: 2,
      ex: "繰延税金は貸借対照表日現在で制定済の税率で測定する。期末後の税法制定は修正を要しない後発事象であり、影響は制定日を含む第2期に計上し、重要であれば注記する。",
    },
    {
      q: "A company has a deferred tax asset of $200,000 for a federal NOL carryforward and an unrecognized tax benefit of $30,000 for a position in the same jurisdiction. Tax law would require the NOL to be used to settle any additional tax from disallowance of the position, and the company intends to do so. How should the unrecognized tax benefit be presented?",
      ja: "会社は連邦の繰越欠損金に係る繰延税金資産$200,000と、同一管轄の税務ポジションに係る未認識税務便益$30,000を有している。税法上、ポジションが否認された場合の追加税額は繰越欠損金で充当することが求められ、会社もそうする意図である。未認識税務便益はどのように表示すべきか。",
      c: [
        "As a separate liability of $30,000, with the deferred tax asset reported at $200,000",
        "As a reduction of retained earnings",
        "As a current liability because it relates to the current-year return",
        "As a reduction of the deferred tax asset, which is presented at $170,000",
      ],
      a: 3,
      ex: "ASU 2013-11により、繰越欠損金等が利用可能で税法上それで決済される場合、未認識税務便益は負債ではなく繰延税金資産の減額として表示する(200,000 − 30,000 = 170,000)。利用できない場合に限り負債として表示する。",
    },
    {
      q: "During the year, a company reported an unrealized holding gain of $40,000 on available-for-sale debt securities. The enacted tax rate is 25%, and the gain is not taxable until realized. What amount should be reported in other comprehensive income for the year?",
      ja: "当期、会社は売却可能(AFS)負債証券について$40,000の未実現保有利益を計上した。制定済税率は25%で、利益は実現するまで課税されない。当期のその他の包括利益に計上すべき金額はいくらか。",
      c: ["$30,000", "$40,000", "$10,000", "$50,000"],
      a: 0,
      ex: "期間内税金配分により、OCI項目は関連する税効果控除後で表示する:40,000 − 繰延税金負債40,000×25% = 30,000。税効果10,000は継続事業の法人税等ではなくOCIに配分する。",
    },
    {
      q: "A company grants nonqualified stock options and recognizes compensation cost of $50,000 over the vesting period, recording a related deferred tax asset of $10,500 at a 21% rate. On exercise, the company receives a tax deduction of $80,000. Under current U.S. GAAP, how is the $6,300 excess tax benefit reported?",
      ja: "会社は非適格ストック・オプションを付与し、権利確定期間にわたり報酬費用$50,000を認識して21%で繰延税金資産$10,500を計上した。権利行使時に$80,000の税務上の損金が認められた。現行の米国GAAPにおいて、超過税務便益$6,300はどのように報告されるか。",
      c: [
        "As a credit to additional paid-in capital",
        "As a reduction of income tax expense in the income statement in the period of exercise",
        "As a deferred credit amortized over the remaining service period",
        "As a credit to other comprehensive income",
      ],
      a: 1,
      ex: "ASU 2016-09以降、超過税務便益(80,000 − 50,000 = 30,000 × 21% = 6,300)および不足額はすべて損益計算書の法人税等で認識する(離散項目)。従来のAPIC計上は廃止された。",
    },
    {
      q: "Under U.S. GAAP, which of the following cash receipts is classified as an investing activity in the statement of cash flows?",
      ja: "米国GAAPにおいて、キャッシュフロー計算書上、投資活動に分類される現金収入はどれか。",
      c: [
        "Interest received on a note receivable from another entity",
        "Dividends received on an equity-method investment within cumulative earnings",
        "Collection of the principal amount of a loan made to another entity",
        "Cash received from customers on account",
      ],
      a: 2,
      ex: "他者への貸付金の元本回収は投資活動。米国GAAPでは受取利息・受取配当(累積利益の範囲内)は営業活動に分類される点がIFRS(選択可)と異なる。",
    },
    {
      q: "A company's warehouse was destroyed by fire. During the year it received insurance proceeds of $500,000 for the building and $50,000 under a business interruption policy for lost profits. How should these proceeds be classified in the statement of cash flows?",
      ja: "会社の倉庫が火災で焼失した。当期、建物に対する保険金$500,000と、逸失利益に対する事業中断保険金$50,000を受け取った。キャッシュフロー計算書上、これらの保険金はどう分類すべきか。",
      c: [
        "Operating inflows of $550,000",
        "Investing inflows of $500,000 and operating inflows of $50,000",
        "Investing inflows of $550,000",
        "Financing inflows of $500,000 and operating inflows of $50,000",
      ],
      a: 1,
      ex: "ASU 2016-15により、保険金は損失の性質に基づいて分類する。建物(有形固定資産)の損失に対する保険金は投資活動、事業中断保険金は営業活動である。",
    },
    {
      q: "A company retired bonds with a carrying amount of $1,000,000 before maturity by paying the bondholders $1,030,000, which includes a $30,000 prepayment penalty. Using the indirect method, how is this transaction reported in the statement of cash flows?",
      ja: "会社は帳簿価額$1,000,000の社債を満期前に償還し、社債権者に$1,030,000(期限前償還ペナルティ$30,000を含む)を支払った。間接法の場合、この取引はキャッシュフロー計算書でどのように報告されるか。",
      c: [
        "Financing outflow of $1,030,000, with the $30,000 loss added back to net income in operating activities",
        "Financing outflow of $1,000,000 and operating outflow of $30,000",
        "Financing outflow of $1,000,000, with the $30,000 loss deducted from net income",
        "Investing outflow of $1,030,000",
      ],
      a: 0,
      ex: "ASU 2016-15により、期限前償還費用・債務消滅費用は財務活動の支出とする。したがって財務活動支出は1,030,000で、間接法では償還損30,000を純利益に加算し二重計上を避ける。",
    },
    {
      q: "In a business combination, an acquirer recognized contingent consideration at its acquisition-date fair value of $300,000. Two years after the acquisition, it paid $360,000 to settle the obligation. How should the $360,000 payment be classified?",
      ja: "企業結合において、取得企業は条件付対価を取得日の公正価値$300,000で認識した。取得の2年後、債務の決済として$360,000を支払った。この$360,000の支払はどう分類すべきか。",
      c: [
        "Investing outflow of $360,000",
        "Financing outflow of $360,000",
        "Operating outflow of $360,000",
        "Financing outflow of $300,000 and operating outflow of $60,000",
      ],
      a: 3,
      ex: "取得後相当期間(概ね3か月)を経過した条件付対価の支払は、取得日公正価値までが財務活動、それを超える部分が営業活動となる。取得直後の支払であれば投資活動である。",
    },
    {
      q: "A company securitizes trade receivables and, as part of the proceeds, obtains a beneficial interest in the securitized receivables. Later in the year, it collects cash on that beneficial interest. How are these items reported in the statement of cash flows?",
      ja: "会社は売掛金を証券化し、対価の一部として証券化された債権に対する受益持分を取得した。その後、当期中にその受益持分から現金を回収した。これらはキャッシュフロー計算書でどう報告されるか。",
      c: [
        "The beneficial interest obtained is an operating inflow, and later collections are operating inflows",
        "The beneficial interest obtained is a noncash investing activity disclosed separately, and later collections are investing inflows",
        "Both the beneficial interest obtained and the later collections are financing inflows",
        "The beneficial interest obtained is ignored, and later collections are operating inflows",
      ],
      a: 1,
      ex: "ASU 2016-15により、証券化で取得した受益持分は非資金投資活動として開示し、受益持分からのその後の回収は投資活動の収入とする。",
    },
    {
      q: "A company's balance sheets show cash and cash equivalents of $100,000 at the beginning of the year and $130,000 at year-end, and restricted cash (under a loan covenant) of $20,000 at the beginning and $50,000 at year-end. During the year, $30,000 was transferred from operating accounts into restricted cash. What net change should the statement of cash flows explain?",
      ja: "期首の現金及び現金同等物は$100,000、期末は$130,000である。また借入契約による拘束性預金は期首$20,000、期末$50,000である。当期中に運転資金口座から拘束性預金へ$30,000が振り替えられた。キャッシュフロー計算書が説明すべき純増減額はいくらか。",
      c: ["$30,000 increase", "$30,000 increase, with a $30,000 investing outflow for the transfer", "$60,000 increase", "$80,000 increase"],
      a: 2,
      ex: "ASU 2016-18により、キャッシュフロー計算書は現金・現金同等物・拘束性預金の合計の増減を説明する:(130,000+50,000) − (100,000+20,000) = 60,000。現金と拘束性預金の間の振替はキャッシュフローとして表示しない。",
    },
    {
      q: "At year-end, a company's only checking account has a negative bank balance (bank overdraft) of $15,000, and the company has no other accounts at that bank. How should the overdraft be reported under U.S. GAAP?",
      ja: "期末、会社の唯一の当座預金口座の銀行残高はマイナス$15,000(当座借越)であり、同じ銀行に他の口座はない。米国GAAPにおいて当座借越はどのように報告すべきか。",
      c: [
        "As a reduction of cash and cash equivalents, with no separate liability",
        "As an investing activity outflow",
        "As a contingent liability disclosed in the notes only",
        "As a liability, with the change in the overdraft balance reported as a financing activity",
      ],
      a: 3,
      ex: "米国GAAPでは当座借越は現金同等物の構成要素とせず負債(短期借入)として表示し、その増減は財務活動として報告する。IFRSで要求払いの当座借越を現金に含める扱いと混同しないこと。",
    },
    {
      q: "During the year, a company borrowed $500,000 under a revolving credit line in which each draw has a six-month maturity, and it repaid $400,000 of draws. How should these cash flows be presented?",
      ja: "当期、会社は各借入の満期が6か月のリボルビング与信枠から$500,000を借り入れ、$400,000を返済した。これらのキャッシュフローはどう表示すべきか。",
      c: [
        "A net financing inflow of $100,000",
        "A financing inflow of $500,000 and a financing outflow of $400,000",
        "A net operating inflow of $100,000",
        "No cash flows, because the borrowings are short-term",
      ],
      a: 1,
      ex: "原則は総額表示である。回転が速く金額が大きく満期が3か月以内の借入・返済に限り純額表示が認められる。満期6か月のため総額(収入500,000、支出400,000)で表示する。",
    },
    {
      q: "A company sold equipment with a cost of $80,000 and accumulated depreciation of $50,000, recognizing a gain of $6,000. Using the indirect method, how is the sale reported in the statement of cash flows?",
      ja: "会社は取得原価$80,000、減価償却累計額$50,000の設備を売却し、$6,000の売却益を計上した。間接法の場合、売却はキャッシュフロー計算書でどのように報告されるか。",
      c: [
        "Investing inflow of $36,000, and the $6,000 gain deducted from net income in operating activities",
        "Investing inflow of $30,000, and the $6,000 gain added to net income",
        "Investing inflow of $6,000 only",
        "Operating inflow of $36,000",
      ],
      a: 0,
      ex: "売却収入 = 帳簿価額30,000 + 売却益6,000 = 36,000を投資活動に計上する。売却益は純利益に含まれ収入は投資活動に計上済のため、営業活動では6,000を控除する。",
    },
    {
      q: "A company reported sales of $1,200,000, all on account. Gross accounts receivable increased from $150,000 to $180,000, and $10,000 of receivables were written off against the allowance during the year. In addition, cash received in advance from customers (contract liabilities) increased by $20,000. Using the direct method, how much cash was collected from customers?",
      ja: "売上高は$1,200,000(すべて掛売上)。売掛金総額は$150,000から$180,000に増加し、当期中に$10,000の債権を貸倒引当金と相殺して償却した。また顧客からの前受金(契約負債)が$20,000増加した。直接法による顧客からの現金回収額はいくらか。",
      c: ["$1,190,000", "$1,160,000", "$1,170,000", "$1,180,000"],
      a: 3,
      ex: "売掛金からの回収 = 150,000 + 1,200,000 − 償却10,000 − 180,000 = 1,160,000。前受金増加20,000を加え1,180,000。$1,190,000は貸倒償却を、$1,160,000は前受金を考慮していない。",
    },
    {
      q: "Cost of goods sold for the year was $700,000. Inventory decreased by $25,000, and accounts payable to suppliers decreased by $15,000. Using the direct method, how much cash was paid to suppliers?",
      ja: "当期の売上原価は$700,000。棚卸資産は$25,000減少し、仕入先への買掛金は$15,000減少した。直接法による仕入先への現金支払額はいくらか。",
      c: ["$690,000", "$710,000", "$740,000", "$660,000"],
      a: 0,
      ex: "仕入高 = 700,000 − 在庫減少25,000 = 675,000、支払額 = 675,000 + 買掛金減少15,000 = 690,000。$710,000は在庫減少を逆に加算し買掛金減少を控除している。",
    },
    {
      q: "Operating expenses on the income statement were $400,000, including depreciation of $40,000 and credit loss expense of $6,000. During the year, accrued liabilities increased by $12,000 and prepaid expenses increased by $5,000. Using the direct method, how much cash was paid for operating expenses?",
      ja: "損益計算書の営業費用は$400,000で、減価償却費$40,000と信用損失費用$6,000を含む。当期中に未払費用は$12,000増加し、前払費用は$5,000増加した。直接法による営業費用の現金支払額はいくらか。",
      c: ["$353,000", "$347,000", "$371,000", "$337,000"],
      a: 1,
      ex: "現金支払額 = 400,000 − 40,000 − 6,000 − 未払費用増加12,000 + 前払費用増加5,000 = 347,000。非資金費用の信用損失費用を控除しないと$353,000となる。",
    },
    {
      q: "Interest expense for the year was $80,000, after a reduction of $4,000 for amortization of bond premium. Interest payable decreased by $3,000 during the year. How much cash was paid for interest?",
      ja: "当期の支払利息は$80,000で、社債発行差金(プレミアム)の償却$4,000を減額した後の金額である。未払利息は当期中に$3,000減少した。利息の現金支払額はいくらか。",
      c: ["$79,000", "$81,000", "$87,000", "$73,000"],
      a: 2,
      ex: "プレミアム償却は費用を現金支払額より小さくするため加算する:80,000 + 4,000 + 未払利息減少3,000 = 87,000。ディスカウント償却(費用>支払)と取り違えると$79,000となる。",
    },
    {
      q: "Income tax expense for the year was $150,000. The deferred tax liability increased by $20,000, and income taxes payable decreased by $8,000. How much cash was paid for income taxes?",
      ja: "当期の法人税等は$150,000。繰延税金負債は$20,000増加し、未払法人税等は$8,000減少した。法人税等の現金支払額はいくらか。",
      c: ["$122,000", "$162,000", "$178,000", "$138,000"],
      a: 3,
      ex: "支払額 = 150,000 − 繰延税金負債増加20,000(非資金の繰延分)+ 未払法人税等減少8,000 = 138,000。未払法人税等の減少を控除した$122,000は符号の誤り。",
    },
    {
      q: "A company reported net income of $250,000. Other information: depreciation $60,000; patent amortization $10,000; loss on sale of equipment $8,000; equity in earnings of a 25%-owned investee $30,000, with dividends received of $12,000; increase in deferred tax liability $5,000; increase in accounts receivable $22,000; decrease in inventory $15,000; decrease in accounts payable $9,000. What is net cash provided by operating activities?",
      ja: "純利益は$250,000。その他の情報:減価償却費$60,000、特許権償却$10,000、設備売却損$8,000、25%保有の投資先に対する持分法利益$30,000(受取配当$12,000)、繰延税金負債の増加$5,000、売掛金の増加$22,000、棚卸資産の減少$15,000、買掛金の減少$9,000。営業活動によるキャッシュフローはいくらか。",
      c: ["$287,000", "$299,000", "$317,000", "$283,000"],
      a: 1,
      ex: "250,000 + 60,000 + 10,000 + 8,000 − 30,000 + 12,000 + 5,000 − 22,000 + 15,000 − 9,000 = 299,000。持分法利益は控除し、累積利益内の受取配当は営業収入として加算する。配当を加算し忘れると$287,000、売却損を控除すると$283,000となる。",
    },
    {
      q: "A company reported net income of $100,000, depreciation expense of $15,000, and amortization of premium on bonds payable of $3,000. There were no other noncash items or working capital changes. What is net cash provided by operating activities under the indirect method?",
      ja: "純利益は$100,000、減価償却費は$15,000、発行社債のプレミアム償却額は$3,000である。他に非資金項目や運転資本の増減はない。間接法による営業活動によるキャッシュフローはいくらか。",
      c: ["$118,000", "$115,000", "$112,000", "$97,000"],
      a: 2,
      ex: "プレミアム償却は支払利息を現金支払額より小さくしているため純利益から控除する:100,000 + 15,000 − 3,000 = 112,000。ディスカウント償却と混同して加算すると$118,000となる。",
    },
    {
      q: "A company reported net income of $200,000. During the year, its deferred tax asset increased by $4,000 and its deferred tax liability increased by $9,000. There were no other adjustments. What is net cash provided by operating activities under the indirect method?",
      ja: "純利益は$200,000。当期中に繰延税金資産は$4,000増加し、繰延税金負債は$9,000増加した。他に調整項目はない。間接法による営業活動によるキャッシュフローはいくらか。",
      c: ["$205,000", "$213,000", "$195,000", "$187,000"],
      a: 0,
      ex: "繰延税金負債の増加は非資金費用のため加算、繰延税金資産の増加は非資金収益(ベネフィット)のため控除:200,000 + 9,000 − 4,000 = 205,000。",
    },
    {
      q: "Which of the following transactions is reported as a noncash investing and financing activity in the supplemental disclosures to the statement of cash flows?",
      ja: "キャッシュフロー計算書の補足開示において、非資金投資・財務活動として報告される取引はどれか。",
      c: [
        "A 2-for-1 stock split",
        "Conversion of preferred stock into common stock",
        "Recognition of depreciation expense",
        "Purchase of equipment for cash",
      ],
      a: 1,
      ex: "優先株式の普通株式への転換は現金を伴わない財務活動であり、補足開示の対象である。株式分割は資源の移動がなく開示不要、減価償却は営業活動の調整項目、現金による設備購入は投資活動に表示される。",
    },
    {
      q: "A company acquired equipment costing $200,000 by paying $50,000 in cash and signing a $150,000 note payable to the seller. How is this acquisition reported in the statement of cash flows?",
      ja: "会社は$200,000の設備を、現金$50,000の支払と売主への$150,000の手形振出により取得した。この取得はキャッシュフロー計算書でどのように報告されるか。",
      c: [
        "Investing outflow of $200,000 and financing inflow of $150,000",
        "Investing outflow of $50,000 and noncash disclosure of $150,000",
        "Investing outflow of $200,000 only",
        "Noncash disclosure of $200,000 only",
      ],
      a: 1,
      ex: "現金支払部分50,000のみ投資活動の支出とし、売主への手形150,000は非資金投資・財務活動として補足開示する。手形を財務活動の収入として計上するのは誤り。",
    },
    {
      q: "At December 31, a company holds the following: a 3-month Treasury bill purchased December 1, $50,000; a 3-year Treasury note purchased November 15 that matures January 31, $30,000; a 6-month certificate of deposit purchased September 1, $40,000; a money market fund, $20,000; and 120-day commercial paper purchased December 15, $25,000. What amount should be reported as cash equivalents?",
      ja: "12月31日、会社は次を保有している:12月1日購入の3か月物財務省短期証券$50,000、11月15日購入で1月31日満期の3年物財務省中期証券$30,000、9月1日購入の6か月物譲渡性預金$40,000、MMF$20,000、12月15日購入の120日物コマーシャル・ペーパー$25,000。現金同等物として報告すべき金額はいくらか。",
      c: ["$140,000", "$70,000", "$125,000", "$100,000"],
      a: 3,
      ex: "現金同等物は取得時点で満期まで3か月以内のもの:T-bill 50,000 + 取得時残存2.5か月の中期証券30,000 + MMF 20,000 = 100,000。6か月物CDと120日物CPは取得時の満期が3か月超のため除く(期末時点の残存期間で判断しない)。",
    },
    {
      q: "Under U.S. GAAP, which of the following cash payments is classified as an operating activity?",
      ja: "米国GAAPにおいて、営業活動に分類される現金支出はどれか。",
      c: [
        "Cash paid to purchase available-for-sale debt securities",
        "Cash paid to repurchase treasury stock",
        "Cash paid for interest on bonds payable",
        "Cash paid for the principal portion of finance lease payments",
      ],
      a: 2,
      ex: "米国GAAPでは支払利息は営業活動(IFRSでは選択可)。AFS証券の購入は投資活動、自己株式の取得とファイナンス・リースの元本返済は財務活動である。",
    },
    {
      q: "A company received $250,000 in death benefits from a corporate-owned life insurance policy on a former executive. How should the proceeds be classified in the statement of cash flows?",
      ja: "会社は、元役員に掛けていた会社所有生命保険(COLI)から死亡保険金$250,000を受け取った。キャッシュフロー計算書上、この保険金はどう分類すべきか。",
      c: ["Operating activities", "Financing activities", "Investing activities", "Noncash disclosure only"],
      a: 2,
      ex: "ASU 2016-15により、COLIの保険金受取は投資活動に分類する。保険料の支払は投資活動・営業活動またはその組合せとして分類できる。",
    },
    {
      q: "An investor uses the cumulative earnings approach for distributions from equity method investees. Before the current year, it had received cumulative distributions of $70,000. Cumulative equity in earnings through the current year is $100,000. In the current year, it received distributions of $50,000. How should the current-year distributions be classified?",
      ja: "投資会社は持分法投資先からの分配について累積利益アプローチを採用している。当期以前の累積受取分配額は$70,000であり、当期までの累積持分法利益は$100,000である。当期に$50,000の分配を受け取った。当期の分配はどう分類すべきか。",
      c: [
        "Operating inflow of $50,000",
        "Investing inflow of $50,000",
        "Operating inflow of $20,000 and investing inflow of $30,000",
        "Operating inflow of $30,000 and investing inflow of $20,000",
      ],
      a: 3,
      ex: "累積受取額120,000(70,000+50,000)のうち累積利益100,000までは投資のリターンとして営業活動(当期分は30,000)、超過分20,000は投資の回収として投資活動となる。",
    },
    {
      q: "A company issued a zero-coupon bond for $400,000 and repaid it at maturity for $500,000. How is the $500,000 repayment classified in the statement of cash flows?",
      ja: "会社はゼロクーポン債を$400,000で発行し、満期に$500,000で償還した。この$500,000の償還はキャッシュフロー計算書でどう分類されるか。",
      c: [
        "Financing outflow of $500,000",
        "Operating outflow of $100,000 and financing outflow of $400,000",
        "Operating outflow of $500,000",
        "Investing outflow of $400,000 and operating outflow of $100,000",
      ],
      a: 1,
      ex: "ASU 2016-15により、ゼロクーポン債等の償還のうち発生利息(割引の償却)部分100,000は営業活動、当初受領額400,000は財務活動とする。",
    },
    {
      q: "During the year, a company paid total interest of $100,000, of which $20,000 was capitalized as part of the cost of a building under construction. How should the interest payments be classified?",
      ja: "当期、会社は利息を合計$100,000支払い、そのうち$20,000は建設中の建物の取得原価に資本化された。利息の支払はどう分類すべきか。",
      c: [
        "Operating outflow of $100,000",
        "Financing outflow of $100,000",
        "Operating outflow of $80,000 and investing outflow of $20,000",
        "Operating outflow of $80,000 and financing outflow of $20,000",
      ],
      a: 2,
      ex: "資本化された利息は有形固定資産の取得原価の一部であるため投資活動の支出とし、残りの80,000は営業活動とする。",
    },
    {
      q: "During the year, a company issued common stock for $200,000; repaid long-term debt principal of $150,000; declared dividends of $50,000, of which $40,000 was paid; purchased treasury stock for $30,000; paid $5,000 of debt extinguishment costs; and obtained a $60,000 short-term bank loan. What is net cash provided by financing activities?",
      ja: "当期、会社は普通株式を$200,000で発行し、長期借入金の元本$150,000を返済し、配当$50,000を宣言してうち$40,000を支払い、自己株式を$30,000で取得し、債務消滅費用$5,000を支払い、短期銀行借入$60,000を実行した。財務活動によるキャッシュフローはいくらか。",
      c: ["$35,000", "$25,000", "$40,000", "$95,000"],
      a: 0,
      ex: "200,000 − 150,000 − 40,000 − 30,000 − 5,000 + 60,000 = 35,000。配当は支払額40,000で計上(宣言額50,000なら$25,000)、債務消滅費用も財務活動の支出である。",
    },
    {
      q: "During the year, a company purchased equipment for $300,000 (paying $100,000 cash and issuing a $200,000 note), sold land with a carrying amount of $75,000 for $90,000, purchased available-for-sale debt securities for $40,000, made a $25,000 loan to a supplier, collected $10,000 of principal on that loan, and received $3,000 of interest on it. What is net cash used in investing activities?",
      ja: "当期、会社は設備を$300,000で購入し(現金$100,000、手形$200,000)、帳簿価額$75,000の土地を$90,000で売却し、AFS負債証券を$40,000で購入し、仕入先に$25,000を貸し付け、その貸付金の元本$10,000を回収し、利息$3,000を受け取った。投資活動によるキャッシュフロー(支出超過)はいくらか。",
      c: ["$(80,000)", "$(265,000)", "$(62,000)", "$(65,000)"],
      a: 3,
      ex: "−100,000 + 90,000 − 40,000 − 25,000 + 10,000 = −65,000。手形分200,000は非資金開示、受取利息は営業活動。土地を帳簿価額で計上すると$(80,000)、設備全額を含めると$(265,000)となる。",
    },
    {
      q: "A company presents operating cash flows using the direct method. Which of the following is required?",
      ja: "会社は直接法で営業活動によるキャッシュフローを表示している。次のうち要求されるものはどれか。",
      c: [
        "A separate reconciliation of net income to net cash provided by operating activities",
        "No reconciliation, because the direct method shows the major classes of receipts and payments",
        "Presentation of cash flow per share",
        "Reporting the gain on sale of equipment as an operating cash inflow",
      ],
      a: 0,
      ex: "直接法を採用した場合も、純利益から営業キャッシュフローへの調整表を別途開示しなければならない。1株当たりキャッシュフローの表示は禁止されており、売却益は現金収入ではない。",
    },
    {
      q: "A company that classifies Treasury bills with original maturities of three months or less as cash equivalents used $80,000 from its checking account to purchase a 60-day Treasury bill. How is the purchase reported in the statement of cash flows?",
      ja: "当初満期3か月以内の財務省短期証券を現金同等物に分類している会社が、当座預金から$80,000を支出して60日物の財務省短期証券を購入した。この購入はキャッシュフロー計算書でどう報告されるか。",
      c: [
        "As an investing outflow of $80,000",
        "As an operating outflow of $80,000",
        "As a noncash investing activity",
        "It is not reported as a cash flow, because it is an exchange within cash and cash equivalents",
      ],
      a: 3,
      ex: "現金と現金同等物の間の振替は、キャッシュフロー計算書の対象となる資金の内部移動にすぎないため、キャッシュフローとして報告しない。",
    },
    {
      q: "Under U.S. GAAP, how are the components of payments on leases classified by a lessee in the statement of cash flows?",
      ja: "米国GAAPにおいて、借手のリース料支払はキャッシュフロー計算書上どのように分類されるか。",
      c: [
        "All lease payments are financing activities",
        "Operating lease payments are operating; finance lease principal is financing and finance lease interest is operating",
        "Operating lease payments are financing; finance lease payments are investing",
        "All lease payments are operating activities",
      ],
      a: 1,
      ex: "ASC 842では、オペレーティング・リースの支払は営業活動、ファイナンス・リースは元本部分が財務活動、利息部分が営業活動(支払利息)となる。",
    },
  ],
});

CPA.tbs({ id: "TBS-FAR-34", section: "FAR", chapter: "FAR-07", title: "繰延税金の計算(制定済み税率の適用と評価性引当額)",
  scenario: `<p>Kestrel Corp. began operations in Year 1. Pretax financial income for Year 1 was <b>$500,000</b>. Information for Year 1:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Tax depreciation in excess of book depreciation (cumulative at year-end); reverses $40,000 in Year 2 and $80,000 in Year 3</td><td>$120,000</td></tr>
<tr><td>Warranty expense accrued for books, deductible for tax when paid in Year 2</td><td>$60,000</td></tr>
<tr><td>Interest income on municipal bonds</td><td>$20,000</td></tr></table>
<p>Enacted tax rates: Year 1 and Year 2 — <b>25%</b>; Year 3 and later — <b>21%</b>. Based on available evidence, it is more likely than not that $20,000 of the future warranty deduction will not be realized. All deferred items relate to the same tax jurisdiction.</p>
<p class="ja">Kestrel社はYear 1に営業を開始した。Year 1の税引前会計利益は$500,000。税務減価償却の超過額(期末累計)$120,000はYear 2に$40,000、Year 3に$80,000解消する。製品保証費用$60,000は会計上計上済みで、支払時のYear 2に税務上損金算入される。地方債利息収入は$20,000。制定済み税率はYear 1・Year 2が25%、Year 3以降が21%。入手可能な証拠に基づくと、将来の製品保証の損金算入額のうち$20,000は実現しない可能性が高い(more likely than not)。すべての繰延項目は同一の課税管轄に属する。</p>`,
  rows: [
    { label: "Year 1 taxable income(Year 1の課税所得)", type: "num", answer: 420000 },
    { label: "Current income tax expense(当期税金費用)", type: "num", answer: 105000 },
    { label: "Deferred tax liability at end of Year 1(Year 1末の繰延税金負債)", type: "num", answer: 26800 },
    { label: "Valuation allowance at end of Year 1(Year 1末の評価性引当額)", type: "num", answer: 5000 },
    { label: "Total income tax expense for Year 1(Year 1の法人税等合計)", type: "num", answer: 121800 },
    { label: "Balance sheet presentation of deferred taxes(繰延税金の貸借対照表表示)", type: "select", options: ["Current DTA $10,000 and noncurrent DTL $26,800", "Net noncurrent DTL $16,800", "Net current DTL $16,800", "Net noncurrent DTL $21,800"], answer: "Net noncurrent DTL $16,800" },
  ],
  explain: `<p>課税所得 = 500,000 − 20,000(地方債利息:永久差異)− 120,000(減価償却の将来加算一時差異)+ 60,000(製品保証の将来減算一時差異)= 420,000。当期税金 = 420,000 × 25% = 105,000。</p>
<p>繰延税金負債は解消年度の制定済み税率で測定する:40,000 × 25% + 80,000 × 21% = 10,000 + 16,800 = 26,800。繰延税金資産 = 60,000 × 25% = 15,000、評価性引当額 = 20,000 × 25% = 5,000、純額10,000。</p>
<p>繰延税金費用 = 26,800 − 10,000 = 16,800、税金費用合計 = 105,000 + 16,800 = 121,800。ASU 2015-17により繰延税金はすべて非流動に分類し、同一管轄内では相殺して純額の非流動繰延税金負債16,800を表示する。全額を25%で測定するとDTL 30,000となり誤りである。</p>`,
});

CPA.tbs({ id: "TBS-FAR-35", section: "FAR", chapter: "FAR-07", title: "間接法による営業活動キャッシュフローの調整",
  scenario: `<p>Brightwater Inc. reported net income of <b>$300,000</b> for the year. Additional information:</p>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Depreciation expense</td><td>$45,000</td></tr>
<tr><td>Amortization of patent</td><td>$5,000</td></tr>
<tr><td>Amortization of discount on bonds payable</td><td>$2,000</td></tr>
<tr><td>Gain on sale of equipment</td><td>$12,000</td></tr>
<tr><td>Loss on early extinguishment of debt</td><td>$8,000</td></tr>
<tr><td>Increase in deferred tax liability</td><td>$7,000</td></tr>
<tr><td>Equity-method income from investee</td><td>$20,000</td></tr>
<tr><td>Dividends received from equity-method investee</td><td>$8,000</td></tr>
<tr><td>Increase in accounts receivable</td><td>$30,000</td></tr>
<tr><td>Decrease in inventory</td><td>$18,000</td></tr>
<tr><td>Increase in prepaid expenses</td><td>$4,000</td></tr>
<tr><td>Decrease in accounts payable</td><td>$15,000</td></tr>
<tr><td>Increase in accrued liabilities</td><td>$6,000</td></tr>
<tr><td>Cash dividends paid to shareholders</td><td>$50,000</td></tr></table>
<p>Enter decreases (negative adjustments) as negative numbers.</p>
<p class="ja">Brightwater社の当期純利益は$300,000。減価償却費$45,000、特許権償却$5,000、社債発行差金(ディスカウント)の償却$2,000、設備売却益$12,000、債務の早期消滅損$8,000、繰延税金負債の増加$7,000、持分法による投資利益$20,000、持分法投資先からの受取配当$8,000、売掛金の増加$30,000、棚卸資産の減少$18,000、前払費用の増加$4,000、買掛金の減少$15,000、未払負債の増加$6,000、株主への現金配当支払$50,000。減算調整は負の数で入力すること。</p>`,
  rows: [
    { label: "Net adjustment for the equity-method investment(持分法投資に関する純調整額)", type: "num", answer: -12000 },
    { label: "Net adjustment for changes in operating current assets and liabilities(営業性の流動資産・負債の増減による純調整額)", type: "num", answer: -25000 },
    { label: "Treatment of the gain on sale of equipment(設備売却益の取扱い)", type: "select", options: ["Add $12,000 to net income", "Subtract $12,000 from net income", "Report $12,000 as an operating inflow", "No adjustment"], answer: "Subtract $12,000 from net income" },
    { label: "Treatment of amortization of bond discount(社債ディスカウント償却の取扱い)", type: "select", options: ["Add back to net income", "Subtract from net income", "Report as a financing outflow", "No adjustment"], answer: "Add back to net income" },
    { label: "Net cash provided by operating activities(営業活動による正味キャッシュフロー)", type: "num", answer: 318000 },
    { label: "Classification of the $50,000 dividends paid(支払配当$50,000の区分)", type: "select", options: ["Operating", "Investing", "Financing", "Noncash disclosure only"], answer: "Financing" },
  ],
  explain: `<p>持分法:投資利益20,000は現金を伴わないため減算し、受取配当8,000(累積利益の範囲内=投資のリターン)は営業収入として加算する。純額 −12,000。</p>
<p>運転資本:−30,000(売掛金増)+ 18,000(棚卸減)− 4,000(前払増)− 15,000(買掛減)+ 6,000(未払増)= −25,000。</p>
<p>営業CF = 300,000 + 45,000 + 5,000 + 2,000 − 12,000 + 8,000 + 7,000 − 12,000 − 25,000 = 318,000。売却益は売却収入全額を投資活動に計上するため減算し、ディスカウント償却は現金支出を伴わない利息費用のため加算する。支払配当は財務活動であり営業CFに含めない(含めると268,000と誤る)。</p>`,
});

CPA.tbs({ id: "TBS-FAR-36", section: "FAR", chapter: "FAR-07", title: "直接法による営業活動キャッシュフロー",
  scenario: `<p>Harlow Co. presents its statement of cash flows using the direct method. Selected data for the year:</p>
<table><tr><th>Income statement</th><th>Amount</th></tr>
<tr><td>Sales (all on credit)</td><td>$900,000</td></tr>
<tr><td>Cost of goods sold</td><td>$540,000</td></tr>
<tr><td>Salaries expense</td><td>$150,000</td></tr>
<tr><td>Depreciation expense</td><td>$40,000</td></tr>
<tr><td>Interest expense (includes $3,000 amortization of bond discount)</td><td>$30,000</td></tr>
<tr><td>Income tax expense</td><td>$48,000</td></tr></table>
<table><tr><th>Balance sheet</th><th>Beginning</th><th>Ending</th></tr>
<tr><td>Accounts receivable</td><td>$70,000</td><td>$95,000</td></tr>
<tr><td>Inventory</td><td>$110,000</td><td>$90,000</td></tr>
<tr><td>Accounts payable (merchandise)</td><td>$60,000</td><td>$72,000</td></tr>
<tr><td>Salaries payable</td><td>$12,000</td><td>$8,000</td></tr>
<tr><td>Interest payable</td><td>$5,000</td><td>$7,000</td></tr>
<tr><td>Income taxes payable</td><td>$10,000</td><td>$6,000</td></tr>
<tr><td>Deferred tax liability</td><td>$20,000</td><td>$25,000</td></tr></table>
<p class="ja">Harlow社は直接法でキャッシュフロー計算書を作成している。損益計算書:売上(全額掛売)$900,000、売上原価$540,000、給与費用$150,000、減価償却費$40,000、支払利息$30,000(社債ディスカウント償却$3,000を含む)、法人税等$48,000。貸借対照表(期首/期末):売掛金$70,000/$95,000、棚卸資産$110,000/$90,000、買掛金(商品)$60,000/$72,000、未払給与$12,000/$8,000、未払利息$5,000/$7,000、未払法人税$10,000/$6,000、繰延税金負債$20,000/$25,000。</p>`,
  rows: [
    { label: "Cash collected from customers(顧客からの現金回収額)", type: "num", answer: 875000 },
    { label: "Cash paid to suppliers(仕入先への現金支払額)", type: "num", answer: 508000 },
    { label: "Cash paid to employees(従業員への現金支払額)", type: "num", answer: 154000 },
    { label: "Cash paid for interest(利息の現金支払額)", type: "num", answer: 25000 },
    { label: "Cash paid for income taxes(法人税等の現金支払額)", type: "num", answer: 47000 },
    { label: "Net cash provided by operating activities(営業活動による正味キャッシュフロー)", type: "num", answer: 141000 },
  ],
  explain: `<p>顧客からの回収 = 900,000 − 25,000(売掛金増)= 875,000。</p>
<p>仕入高 = 540,000 − 20,000(棚卸減)= 520,000、仕入先への支払 = 520,000 − 12,000(買掛金増)= 508,000。</p>
<p>給与支払 = 150,000 + 4,000(未払給与減)= 154,000。利息支払 = 30,000 − 3,000(ディスカウント償却)− 2,000(未払利息増)= 25,000。法人税支払 = 48,000 − 5,000(繰延税金負債増)+ 4,000(未払法人税減)= 47,000。</p>
<p>営業CF = 875,000 − 508,000 − 154,000 − 25,000 − 47,000 = 141,000。減価償却費は現金支出を伴わないため直接法では現れない。検算:純利益92,000 + 40,000 + 3,000 + 5,000 − 25,000 + 20,000 + 12,000 − 4,000 + 2,000 − 4,000 = 141,000。</p>`,
});
