// ISC のTBS追加(SOC報告書:SOC 1/2の評価・報告書選択・再委託先・CUEC・ブリッジレター・TSC・サンプル数・記述書)

CPA.tbs({
  id: "TBS-ISC-37", section: "ISC", chapter: "ISC-03", title: "SOC 1 Type 2報告書のレビュー(統制目的ごとの結果と意見)",
  scenario: `<p>You are reviewing the draft SOC 1 Type 2 report of MedClaim Services, a health-claims processor, for the period January 1 – December 31, 2025. Section 4 (service auditor's tests of controls and results) is summarized below. The description was found to be fairly presented, and all controls were found to be suitably designed.</p>
<table><tr><th>Control objective (CO)</th><th>Control and frequency</th><th>Test performed</th><th>Result</th></tr>
<tr><td>CO1 Claims input is authorized</td><td>1.1 Supervisor approves claims over $5,000 (multiple times per day)<br>1.2 Automated duplicate-claim edit</td><td>1.1 Sample of 40<br>1.2 Inspected configuration; tested 1 duplicate</td><td>No deviations noted</td></tr>
<tr><td>CO2 Claim payments are accurate</td><td>2.1 Daily reconciliation of payment file to approved claims register (the only control for CO2)</td><td>Sample of 40 days</td><td>Reconciliation not performed on 3 days; no compensating control identified</td></tr>
<tr><td>CO3 Logical access is restricted</td><td>3.1 Quarterly user-access review<br>3.2 Terminated users removed within 1 business day</td><td>3.1 All 4 quarters<br>3.2 Sample of 25</td><td>3.1 No deviations<br>3.2 2 of 25 removed after 5 days; system logs show no activity after termination; Q-review (3.1) would detect</td></tr>
<tr><td>CO4 Program changes are authorized</td><td>4.1 Change advisory board approves changes to the claims application</td><td>Inquiry and inspection of change log</td><td>No changes were made to the claims application during the period</td></tr>
</table>
<p class="ja">MedClaim Services社(医療請求処理の受託会社)の2025年1月1日~12月31日を対象とするSOC 1 Type 2報告書のドラフトをレビューしている。第4部(受託会社監査人による統制テストと結果)の要約は上表のとおりである。記述書は適正に表示され、全統制のデザインは適切と判断された。CO1:5,000ドル超の請求の上長承認(1日複数回、40件テスト)と自動重複チェック(設定確認+1件テスト)で逸脱なし。CO2:支払ファイルと承認済請求台帳の日次照合(CO2の唯一の統制)を40日テストし、3日で未実施、補完統制なし。CO3:四半期のアクセスレビュー(4四半期、逸脱なし)と退職者の1営業日以内の削除(25件中2件が5日後に削除、退職後の利用ログなし、四半期レビューで発見可能)。CO4:変更諮問委員会による変更承認だが、期間中に請求アプリへの変更はなかった。</p>`,
  rows: [
    { label: "Result for CO1(CO1の結果)", type: "select", options: ["No deviations — control objective achieved", "Deviations noted, but control objective achieved — no opinion modification", "Control objective not achieved — opinion modified", "Control did not operate — no test of operating effectiveness possible"], answer: "No deviations — control objective achieved" },
    { label: "Result for CO2(CO2の結果)", type: "select", options: ["No deviations — control objective achieved", "Deviations noted, but control objective achieved — no opinion modification", "Control objective not achieved — opinion modified", "Control did not operate — no test of operating effectiveness possible"], answer: "Control objective not achieved — opinion modified" },
    { label: "Result for CO3(CO3の結果)", type: "select", options: ["No deviations — control objective achieved", "Deviations noted, but control objective achieved — no opinion modification", "Control objective not achieved — opinion modified", "Control did not operate — no test of operating effectiveness possible"], answer: "Deviations noted, but control objective achieved — no opinion modification" },
    { label: "Result for CO4(CO4の結果)", type: "select", options: ["No deviations — control objective achieved", "Deviations noted, but control objective achieved — no opinion modification", "Control objective not achieved — opinion modified", "Control did not operate — no test of operating effectiveness possible"], answer: "Control did not operate — no test of operating effectiveness possible" },
    { label: "Deviation rate for control 2.1, in percent(統制2.1の逸脱率・%)", type: "num", answer: 7.5, tol: 0.1 },
    { label: "Type of opinion in the service auditor's report(受託会社監査人の意見の種類)", type: "select", options: ["Unmodified", "Qualified", "Adverse", "Disclaimer"], answer: "Qualified" },
    { label: "Element of the opinion that is modified(修正される意見の要素)", type: "select", options: ["Fair presentation of the description", "Suitability of the design of controls", "Operating effectiveness of controls", "All three elements"], answer: "Operating effectiveness of controls" },
    { label: "Appropriate response of a user auditor relying on CO2(CO2に依拠したいユーザー監査人の対応)", type: "select", options: ["Rely on CO2 because the other control objectives were achieved", "Do not rely on CO2 controls; test user-entity controls over claim payments or expand substantive procedures", "Refer to the service auditor's qualified opinion in the user auditor's report", "Request that the service auditor reissue the report with an unmodified opinion"], answer: "Do not rely on CO2 controls; test user-entity controls over claim payments or expand substantive procedures" },
  ],
  explain: `<p><b>CO1</b>:両統制とも逸脱なしで、統制目的は達成されている。</p>
<p><b>CO2</b>:日次照合は唯一の統制で、40日中3日未実施、補完統制もない。統制が有効に運用されておらず、統制目的は達成されていない。運用状況の有効性について限定付意見となる。</p>
<p><b>CO3</b>:統制3.2に逸脱(25件中2件)があるが、退職後の利用はなく、四半期レビュー(3.1、逸脱なし)が発見統制として機能する。逸脱は第4部に記載されるが、統制目的は達成されており意見は修正しない。</p>
<p><b>CO4</b>:期間中に変更がなく、統制が運用される機会がなかった。運用状況の有効性はテストできないため、第4部に「変更が発生しなかったためテストしていない」旨を記載する。逸脱とは扱わない。</p>
<p><b>逸脱率</b>:3 ÷ 40 = 7.5%。</p>
<p><b>意見の種類</b>:4つの統制目的のうち1つ(CO2)が未達成で、影響は重要だが広範ではない。統制目的単位で除外事項とする限定付意見である。</p>
<p><b>修正される要素</b>:記述書は適正、デザインも適切であり、問題は統制が実行されなかったこと。したがって運用状況の有効性に関する意見のみが修正される。</p>
<p><b>ユーザー監査人</b>:CO2の統制には依拠できない。利用企業側の支払の正確性に関する統制のテスト、または実証手続の拡大で対応する(AU-C 402)。無限定意見でない場合でも、ユーザー監査人の報告書で受託会社監査人に言及することはない。</p>`,
});

CPA.tbs({
  id: "TBS-ISC-38", section: "ISC", chapter: "ISC-03", title: "利用者のニーズに応じたSOC報告書の選択(サイバーセキュリティ・サプライチェーンを含む)",
  scenario: `<p>Harlow &amp; Pike CPAs receives the following requests from clients and prospective clients. For each request, select the attestation report that best meets the stated need.</p>
<table><tr><th>#</th><th>Request</th></tr>
<tr><td>1</td><td>The auditor of a pension plan needs evidence that the plan's investment custodian's controls over the valuation and safekeeping of plan assets operated effectively throughout the plan year.</td></tr>
<tr><td>2</td><td>A publicly traded manufacturer (not a service organization) wants a report on its entity-wide cybersecurity risk management program to share with investors, analysts, and its board.</td></tr>
<tr><td>3</td><td>A retailer wants assurance about the controls of a contract manufacturer over the production, manufacturing, and distribution of goods the retailer purchases.</td></tr>
<tr><td>4</td><td>A data-center startup that began operations two months ago wants to give knowledgeable prospective customers a report on the design of its security and availability controls as of a specific date.</td></tr>
<tr><td>5</td><td>A payroll SaaS provider's marketing team wants a general-use report on security and availability it can post on its public website.</td></tr>
<tr><td>6</td><td>A hospital's vendor-risk team wants the detailed tests and results of a claims-hosting SaaS provider's controls over the confidentiality and privacy of patient data for the past 12 months.</td></tr>
</table>
<p class="ja">Harlow &amp; Pike会計事務所に以下の依頼があった。各依頼に最も適合する保証報告書を選択する。1:年金制度の監査人が、運用資産の評価・保管に関するカストディアンの統制が制度年度を通じて有効に運用されていた証拠を必要とする。2:上場製造業者(受託会社ではない)が、全社的なサイバーセキュリティリスク管理プログラムの報告書を投資家・アナリスト・取締役会に提供したい。3:小売業者が、購入商品の生産・製造・流通に関する受託製造業者の統制について保証を得たい。4:操業開始2か月のデータセンター新興企業が、十分な知識を有する見込み顧客に、特定時点のセキュリティ・可用性統制のデザインに関する報告書を提供したい。5:給与SaaS事業者のマーケティング部門が、自社Webサイトに掲載できるセキュリティ・可用性の一般利用報告書を求める。6:病院のベンダーリスク部門が、請求データをホスティングするSaaS事業者の患者データの機密性・プライバシーに関する統制について、過去12か月の詳細なテストと結果を求める。</p>`,
  rows: [
    { label: "Request 1(依頼1)", type: "select", options: ["SOC 1 Type 1", "SOC 1 Type 2", "SOC 2 Type 2", "SOC 3", "SOC for Cybersecurity"], answer: "SOC 1 Type 2" },
    { label: "Request 2(依頼2)", type: "select", options: ["SOC 2 Type 2", "SOC 3", "SOC for Cybersecurity", "SOC for Supply Chain", "SOC 1 Type 2"], answer: "SOC for Cybersecurity" },
    { label: "Request 3(依頼3)", type: "select", options: ["SOC 1 Type 2", "SOC 2 Type 2", "SOC for Cybersecurity", "SOC for Supply Chain", "SOC 3"], answer: "SOC for Supply Chain" },
    { label: "Request 4(依頼4)", type: "select", options: ["SOC 1 Type 1", "SOC 2 Type 1", "SOC 2 Type 2", "SOC 3", "SOC for Cybersecurity"], answer: "SOC 2 Type 1" },
    { label: "Request 5(依頼5)", type: "select", options: ["SOC 1 Type 2", "SOC 2 Type 1", "SOC 2 Type 2", "SOC 3"], answer: "SOC 3" },
    { label: "Request 6(依頼6)", type: "select", options: ["SOC 1 Type 2", "SOC 2 Type 1", "SOC 2 Type 2", "SOC 3", "SOC for Cybersecurity"], answer: "SOC 2 Type 2" },
    { label: "Criteria for management's description in Request 2(依頼2における経営者の記述の規準)", type: "select", options: ["DC 100 — description criteria for a cybersecurity risk management program", "DC 200 — description criteria for a SOC 2 system description", "COSO 2013 Internal Control — Integrated Framework", "AU-C 402 requirements"], answer: "DC 100 — description criteria for a cybersecurity risk management program" },
  ],
  explain: `<p><b>依頼1</b>:年金資産の評価・保管は財務報告に係る内部統制(ICFR)に関連し、利用者は財務諸表監査人である。期間を通じた運用状況の有効性が必要なのでSOC 1 Type 2。</p>
<p><b>依頼2</b>:受託会社に限らず、あらゆる企業の全社的サイバーセキュリティリスク管理プログラムを対象とする一般利用報告書はSOC for Cybersecurityである。</p>
<p><b>依頼3</b>:製品の生産・製造・流通システムに関する統制で、顧客・取引先向けの報告書はSOC for Supply Chainである。</p>
<p><b>依頼4</b>:セキュリティ・可用性(トラストサービス規準)が対象で、特定時点のデザインのみ(操業期間が短く運用期間を評価できない)なのでSOC 2 Type 1。</p>
<p><b>依頼5</b>:SOC 1・SOC 2は利用制限付きであり、Webに掲載できる一般利用の報告書はSOC 3である(テストの詳細は含まない)。</p>
<p><b>依頼6</b>:機密性・プライバシーはTSCの対象で、12か月の詳細なテストと結果が必要なのでSOC 2 Type 2。</p>
<p><b>規準</b>:SOC for Cybersecurityの経営者による記述にはDC 100(サイバーセキュリティリスク管理プログラムの記述規準)を、統制の有効性にはトラストサービス規準等を用いる。DC 200はSOC 2の記述規準である。</p>`,
});

CPA.tbs({
  id: "TBS-ISC-39", section: "ISC", chapter: "ISC-03", title: "再委託先の取扱い:カーブアウト方式と一括方式",
  scenario: `<p>PayStream Inc. provides payroll processing to user entities and engages Ross LLP for a SOC 1 Type 2 examination. PayStream uses two subservice organizations whose controls are relevant to user entities' ICFR.</p>
<table><tr><th>Subservice organization</th><th>Service</th><th>Facts</th></tr>
<tr><td>NetVault</td><td>Data-center hosting (physical and environmental controls)</td><td>Agreed to provide a written assertion, a representation letter, and access for Ross LLP to test its controls</td></tr>
<tr><td>TaxLink</td><td>Payroll tax filing and remittance</td><td>Declined to provide an assertion or access; issues its own SOC 1 Type 2 report</td></tr>
</table>
<p>PayStream monitors TaxLink by reviewing TaxLink's SOC 1 report and its complementary user entity controls annually. Delta Corp, a PayStream customer, is audited by Kim &amp; Co.</p>
<p class="ja">PayStream社は利用企業に給与計算サービスを提供し、Ross LLPにSOC 1 Type 2の検証を依頼した。利用企業のICFRに関連する統制を有する再委託先が2社ある。NetVault:データセンターのホスティング(物理的・環境的統制)。経営者のアサーション、確認書の提供、Ross LLPによる統制テストへのアクセスに同意している。TaxLink:給与税の申告・納付。アサーションの提供やアクセスを拒否しているが、自社のSOC 1 Type 2報告書を発行している。PayStream社は毎年TaxLinkのSOC 1報告書とCUECをレビューしてモニタリングしている。PayStream社の顧客Delta社の監査人はKim &amp; Co.である。</p>`,
  rows: [
    { label: "Method most likely used for NetVault(NetVaultに用いる方法)", type: "select", options: ["Inclusive method", "Carve-out method", "Neither — NetVault's services are excluded entirely", "Either method requires no disclosure of NetVault"], answer: "Inclusive method" },
    { label: "Method required for TaxLink(TaxLinkに用いる方法)", type: "select", options: ["Inclusive method", "Carve-out method", "Ross LLP must disclaim an opinion", "TaxLink's services are omitted from the description"], answer: "Carve-out method" },
    { label: "Number of organizations whose management must provide a written assertion attached to the report(報告書に添付される経営者アサーションを提供する組織数)", type: "num", answer: 2 },
    { label: "How TaxLink is presented in PayStream's description(PayStreamの記述書におけるTaxLinkの表示)", type: "select", options: ["Its controls are described and tested by Ross LLP", "The nature of its services and the complementary subservice organization controls (CSOCs) assumed are described; its controls are excluded from the scope", "It is not mentioned because it is carved out", "Its SOC 1 report is attached as Section 5 and covered by Ross LLP's opinion"], answer: "The nature of its services and the complementary subservice organization controls (CSOCs) assumed are described; its controls are excluded from the scope" },
    { label: "Treatment of PayStream's annual review of TaxLink's SOC 1 report(TaxLinkのSOC 1報告書を毎年レビューするPayStreamの統制の扱い)", type: "select", options: ["A PayStream monitoring control that can be included in the description and tested", "A CUEC to be performed by user entities", "A CSOC performed by TaxLink", "Not a control; excluded from the description"], answer: "A PayStream monitoring control that can be included in the description and tested" },
    { label: "Scope of Ross LLP's opinion regarding NetVault(NetVaultに関するRoss LLPの意見の範囲)", type: "select", options: ["Covers relevant controls of both PayStream and NetVault", "Covers PayStream only; NetVault controls are presented as CSOCs", "Covers NetVault only for the portion of the period tested", "Expressed separately by NetVault's own auditor"], answer: "Covers relevant controls of both PayStream and NetVault" },
    { label: "Kim & Co.'s response regarding TaxLink controls relevant to Delta's payroll tax liabilities(Delta社の給与税債務に関連するTaxLinkの統制へのKim & Co.の対応)", type: "select", options: ["No action — PayStream's unmodified report covers TaxLink", "Obtain and evaluate TaxLink's SOC 1 Type 2 report (or perform other procedures, e.g., test Delta's reconciliation of tax remittances)", "Refer to TaxLink's service auditor in Kim & Co.'s opinion", "Issue a qualified opinion due to a scope limitation"], answer: "Obtain and evaluate TaxLink's SOC 1 Type 2 report (or perform other procedures, e.g., test Delta's reconciliation of tax remittances)" },
  ],
  explain: `<p><b>NetVault</b>:再委託先がアサーション・確認書の提供とテストへのアクセスに同意しているので、一括方式(inclusive)を用いることができる。</p>
<p><b>TaxLink</b>:アサーションもアクセスも得られないため一括方式は使えず、カーブアウト方式となる。</p>
<p><b>アサーション数</b>:一括方式では受託会社(PayStream)と再委託先(NetVault)の双方の経営者がアサーションを提供する。カーブアウトのTaxLinkは提供しない。よって2。</p>
<p><b>TaxLinkの表示</b>:カーブアウト方式では、再委託先が提供するサービスの内容と、受託会社が前提とする補完的な再委託先統制(CSOC)を記述するが、再委託先の統制自体は記述・テストの範囲外である。存在を省略するわけではない。</p>
<p><b>モニタリング統制</b>:TaxLinkのSOC報告書のレビューはPayStream自身が行う統制であり、記述書に含めてテストできる。CUECは利用企業が、CSOCは再委託先が行う統制である。</p>
<p><b>意見の範囲</b>:一括方式では、再委託先の関連する統制も記述書・意見の対象になる。</p>
<p><b>ユーザー監査人</b>:カーブアウトされた統制は PayStream の報告書ではカバーされない。TaxLink自身のSOC 1 Type 2報告書を入手・評価するか、利用企業側の照合など他の手続で証拠を得る(AU-C 402)。他の監査人として意見で言及することはない。</p>`,
});

CPA.tbs({
  id: "TBS-ISC-40", section: "ISC", chapter: "ISC-03", title: "CUECの識別とユーザー監査人のフォローアップ",
  scenario: `<p>Lin &amp; Ortiz CPAs audits Harbor Credit Union (December 31, 2025 year end). Harbor uses CoreBank Data, a core-processing service organization, and obtained CoreBank's unmodified SOC 1 Type 2 report covering January 1 – December 31, 2025. The report's description lists the items below. The audit team's walkthroughs and tests at Harbor produced the findings shown.</p>
<table><tr><th>Item</th><th>Text in CoreBank's description</th><th>Findings at Harbor</th></tr>
<tr><td>A</td><td>User entities review daily rejected-transaction reports and resubmit corrected items.</td><td>Operations supervisor performs daily; 25 days tested with no exceptions.</td></tr>
<tr><td>B</td><td>User entities restrict access to the CoreBank application to authorized personnel and review user listings quarterly.</td><td>No reviews were performed for Q2 and Q3; three terminated employees' IDs remained active until November.</td></tr>
<tr><td>C</td><td>User entities reconcile their general ledger to CoreBank's month-end trial balance.</td><td>Controller performs monthly; 3 months tested with no exceptions.</td></tr>
<tr><td>D</td><td>User entities using the ACH module transmit ACH files only through the encrypted file-transfer portal.</td><td>Harbor does not use CoreBank's ACH module; ACH is processed by a different bank.</td></tr>
<tr><td>E</td><td>CoreBank calculates daily interest accruals using the rate tables in the application.</td><td>—</td></tr>
</table>
<p class="ja">Lin &amp; Ortiz会計事務所はHarbor信用組合(2025年12月31日決算)を監査している。Harborは勘定系の受託会社CoreBank Data社を利用し、2025年1月1日~12月31日を対象とする無限定のSOC 1 Type 2報告書を入手した。記述書の項目と、Harborでのウォークスルー・テストの結果は次のとおり。A:利用企業は日次の不備取引リストをレビューし修正して再送信する(業務責任者が毎日実施、25日テストし例外なし)。B:利用企業はCoreBankアプリへのアクセスを権限者に制限し、ユーザー一覧を四半期ごとにレビューする(第2・第3四半期は未実施、退職者3名のIDが11月まで有効)。C:利用企業は総勘定元帳をCoreBankの月末試算表と照合する(コントローラーが毎月実施、3か月テストし例外なし)。D:ACHモジュールを利用する利用企業は暗号化ポータル経由でのみACHファイルを送信する(HarborはACHモジュールを利用していない)。E:CoreBankがアプリ内の利率テーブルで日次の利息見越を計算する。</p>`,
  rows: [
    { label: "Item A(項目A)", type: "select", options: ["Relevant CUEC operating effectively — supports reliance", "Relevant CUEC not operating — reliance limited; additional procedures needed", "CUEC not relevant to Harbor — no procedures needed", "Not a CUEC — a control performed by CoreBank"], answer: "Relevant CUEC operating effectively — supports reliance" },
    { label: "Item B(項目B)", type: "select", options: ["Relevant CUEC operating effectively — supports reliance", "Relevant CUEC not operating — reliance limited; additional procedures needed", "CUEC not relevant to Harbor — no procedures needed", "Not a CUEC — a control performed by CoreBank"], answer: "Relevant CUEC not operating — reliance limited; additional procedures needed" },
    { label: "Item D(項目D)", type: "select", options: ["Relevant CUEC operating effectively — supports reliance", "Relevant CUEC not operating — reliance limited; additional procedures needed", "CUEC not relevant to Harbor — no procedures needed", "Not a CUEC — a control performed by CoreBank"], answer: "CUEC not relevant to Harbor — no procedures needed" },
    { label: "Item E(項目E)", type: "select", options: ["Relevant CUEC operating effectively — supports reliance", "Relevant CUEC not operating — reliance limited; additional procedures needed", "CUEC not relevant to Harbor — no procedures needed", "Not a CUEC — a control performed by CoreBank"], answer: "Not a CUEC — a control performed by CoreBank" },
    { label: "Number of CUECs (items A–E) relevant to Harbor's audit(Harborの監査に関連するCUECの数)", type: "num", answer: 3 },
    { label: "Most appropriate response to the Item B finding(項目Bの発見事項への最も適切な対応)", type: "select", options: ["None — CoreBank's report is unmodified", "Examine transactions initiated under the three terminated users' IDs and assess control risk higher for affected assertions, expanding substantive procedures", "Ask CoreBank's service auditor to modify the SOC 1 opinion", "Refer to CoreBank's service auditor in the auditor's report"], answer: "Examine transactions initiated under the three terminated users' IDs and assess control risk higher for affected assertions, expanding substantive procedures" },
    { label: "Reference to the service auditor in Lin & Ortiz's unmodified opinion(無限定意見における受託会社監査人への言及)", type: "select", options: ["Required, to divide responsibility", "Permitted if the service auditor consents", "Not permitted", "Required only when CUECs were not operating"], answer: "Not permitted" },
  ],
  explain: `<p><b>A</b>:Harborに関連するCUECで、テストの結果有効に運用されている。CoreBankの関連する統制目的への依拠を支える。</p>
<p><b>B</b>:関連するCUECだが、2四半期レビューがなく退職者IDが残存した。CoreBank側の統制が有効でも、利用企業側の補完統制が機能しないため、アクセス関連の統制目的への依拠は制限される。</p>
<p><b>C</b>:関連するCUECで有効に運用(行としては問わないが、関連CUECの数に含む)。</p>
<p><b>D</b>:HarborはACHモジュールを利用していないため関連がなく、手続は不要。</p>
<p><b>E</b>:CoreBank自身が行う統制(受託会社の統制)であり、CUECではない。SOC 1報告書のテスト結果で評価する。</p>
<p><b>関連CUEC数</b>:A・B・Cの3つ(Dは無関係、EはCUECではない)。</p>
<p><b>Bへの対応</b>:退職者IDで行われた取引の有無・内容を調べ、影響を受けるアサーションの統制リスクを高く評価して実証手続を拡大する。受託会社の報告書は受託会社の統制を対象としており、利用企業側の不備によって修正されるものではない。</p>
<p><b>言及</b>:AU-C 402では、無限定意見の監査報告書で受託会社監査人の作業に言及してはならない(責任の分担はできない)。</p>`,
});

CPA.tbs({
  id: "TBS-ISC-41", section: "ISC", chapter: "ISC-03", title: "対象期間のギャップとブリッジレターの評価",
  scenario: `<p>Orchid Corp. has a December 31, 2025 fiscal year end. Its auditor has obtained the following reports from Orchid's service organizations:</p>
<table><tr><th>Service organization</th><th>Report obtained</th><th>Period / date</th></tr>
<tr><td>PayCo (payroll)</td><td>SOC 1 Type 2, unmodified</td><td>October 1, 2024 – September 30, 2025</td></tr>
<tr><td>InvestCustody (investment custody)</td><td>SOC 1 Type 2, unmodified</td><td>July 1, 2024 – June 30, 2025</td></tr>
<tr><td>HostIT (hosting of the general-ledger system)</td><td>SOC 1 Type 1, unmodified</td><td>As of November 30, 2025</td></tr>
</table>
<p>PayCo's management provided a letter dated January 20, 2026, stating that there were no significant changes to its system or controls from October 1 through December 31, 2025, and that it is not aware of any control deficiencies during that time. Investments held at InvestCustody are material to Orchid's balance sheet.</p>
<p class="ja">Orchid社の決算日は2025年12月31日である。監査人は受託会社から次の報告書を入手した。PayCo(給与):SOC 1 Type 2・無限定、2024年10月1日~2025年9月30日。InvestCustody(投資有価証券の保管):SOC 1 Type 2・無限定、2024年7月1日~2025年6月30日。HostIT(総勘定元帳システムのホスティング):SOC 1 Type 1・無限定、2025年11月30日現在。PayCo社の経営者は2026年1月20日付の書簡で、2025年10月1日~12月31日にシステム・統制の重要な変更はなく、統制の不備も認識していないと述べた。InvestCustodyで保管される投資はOrchid社の貸借対照表にとって重要である。</p>`,
  rows: [
    { label: "Months of Orchid's fiscal year not covered by PayCo's report(PayCo報告書でカバーされない月数)", type: "num", answer: 3 },
    { label: "Months of Orchid's fiscal year not covered by InvestCustody's report(InvestCustody報告書でカバーされない月数)", type: "num", answer: 6 },
    { label: "Months of Orchid's fiscal year covered by PayCo's report(PayCo報告書でカバーされる会計年度の月数)", type: "num", answer: 9 },
    { label: "Nature of PayCo's January 20 letter(1月20日付書簡の性質)", type: "select", options: ["A bridge (gap) letter — a representation by service organization management not examined by the service auditor", "An update to the service auditor's opinion covering the gap period", "A Type 1 report on the gap period", "An agreed-upon procedures report"], answer: "A bridge (gap) letter — a representation by service organization management not examined by the service auditor" },
    { label: "Appropriate response for PayCo(PayCoに関する適切な対応)", type: "select", options: ["Treat the letter as audit evidence equal to a Type 2 report and perform no further procedures", "Consider the letter with inquiry and evidence from Orchid's own controls (e.g., payroll review) over the 3-month gap", "Withdraw from the engagement", "Obtain a new SOC 1 report covering only the gap before issuing the opinion"], answer: "Consider the letter with inquiry and evidence from Orchid's own controls (e.g., payroll review) over the 3-month gap" },
    { label: "Appropriate response for InvestCustody(InvestCustodyに関する適切な対応)", type: "select", options: ["Rely on the report because it is unmodified", "Obtain additional evidence for the longer gap, such as confirming holdings directly with InvestCustody at year end and testing Orchid's reconciliations", "Issue a qualified opinion because the gap exceeds three months", "Refer to InvestCustody's service auditor in the opinion"], answer: "Obtain additional evidence for the longer gap, such as confirming holdings directly with InvestCustody at year end and testing Orchid's reconciliations" },
    { label: "Use of HostIT's Type 1 report(HostITのType 1報告書の利用)", type: "select", options: ["Provides evidence of operating effectiveness for the full year", "Helps understand controls and their design but provides no evidence of operating effectiveness", "Can be used only if a bridge letter is obtained", "Cannot be used at all because it is as of a date"], answer: "Helps understand controls and their design but provides no evidence of operating effectiveness" },
  ],
  explain: `<p><b>PayCo</b>:報告期間の終了は2025年9月30日。会計年度のうち10~12月の3か月がギャップである。カバーされる月は2025年1~9月の9か月。</p>
<p><b>InvestCustody</b>:報告期間の終了は2025年6月30日。7~12月の6か月がギャップ(カバーは1~6月の6か月)。</p>
<p><b>書簡の性質</b>:ブリッジレター(ギャップレター)は受託会社経営者の陳述であり、受託会社監査人は検証していない。意見の延長ではない。</p>
<p><b>PayCoへの対応</b>:ギャップの長さとリスクに応じて、ブリッジレター、受託会社への質問、利用企業側の統制(給与台帳のレビュー等)の証拠を組み合わせる。ギャップ期間だけの新報告書は通常入手できない。</p>
<p><b>InvestCustodyへの対応</b>:ギャップが6か月と長く、投資は重要である。期末残高を受託会社に直接確認する、Orchid社の照合統制をテストするなど追加の証拠を得る。ギャップの存在自体で意見を限定することはなく、受託会社監査人に言及することもない。</p>
<p><b>HostIT</b>:Type 1は特定時点の記述とデザインに関する報告書であり、運用状況の有効性の証拠にはならない。統制の理解には役立つが、依拠するには別途の証拠が必要である。</p>`,
});
