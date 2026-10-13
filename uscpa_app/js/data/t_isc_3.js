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
