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
