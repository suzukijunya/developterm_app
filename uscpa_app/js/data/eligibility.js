// 受験資格・ライセンス要件の判定データ(日本の受験者がよく選ぶ州)。
// 2026年10月時点の公開情報(予備校・解説サイトなどの二次情報を含む)をもとにした目安。
// 情報源で食い違う点は厳しい側で判定し、notes に要確認事項として残す。
// 単位はすべて米国のセメスター単位。日本の大学の単位は「目安としてほぼ同数」で入力してもらう
// (正式な単位数は学歴評価機関の評価で決まる)。

const ELIGIBILITY = {
  checkedAt: "2026年10月",
  states: [
    {
      id: "AK",
      name: "アラスカ州",
      en: "Alaska",
      exam: { degree: "bachelor", total: 0, acct: 15, biz: 0 },
      examText: "学士号+会計15単位(科目の指定なし)",
      licenses: [
        { label: "学士(会計集中)+実務2年", degree: "bachelor", total: 0, acct: 24, biz: 9, exp: 2, note: "2026年1月の法改正(HB 121)で150単位要件を廃止" },
      ],
      notes: [
        "受験資格のハードルが低く、日本からの出願先として選ばれやすい州",
        "ライセンスの「会計集中」は会計24単位+ビジネス法・経済・数学/情報など9単位とされる",
        "在学中の受験可否は情報源で食い違うため、在学中の方は要確認",
      ],
      sources: [
        { label: "300hours: Alaska CPA Requirements", url: "https://300hours.com/alaska-cpa-requirements/" },
        { label: "AccountingEDU: Alaska CPA Requirements 2026", url: "https://www.accountingedu.org/alaska-cpa/" },
      ],
    },
    {
      id: "GU",
      name: "グアム",
      en: "Guam",
      exam: { degree: "bachelor", seniorOk: true, total: 120, acct: 24, biz: 24 },
      examText: "学士号+総120単位+会計24単位(上級)+ビジネス24単位。4年制大学の最終学年なら見込みで出願できる制度あり",
      licenses: [
        { label: "150単位+実務1年(2,000時間)", degree: "bachelor", total: 150, acct: 24, biz: 24, exp: 1 },
        { label: "150単位未満+実務2年", degree: "bachelor", total: 120, acct: 24, biz: 24, exp: 2, note: "情報源で扱いが異なるため要確認" },
      ],
      notes: [
        "SSN・米国市民権・グアム居住は不要とされる",
        "学歴評価は NIES・FACS・ERES のいずれか",
        "ビジネス単位の内訳(経済6・ファイナンス3・ビジネス法3など)の指定があるとされる",
        "受験に150単位が必要とする情報源もあり、要確認",
      ],
      sources: [
        { label: "300hours: Guam CPA Requirements", url: "https://300hours.com/guam-cpa-requirements/" },
        { label: "CPA Exam Guide: Guam", url: "https://www.cpaexamguide.com/cpa-exam-requirements/Guam-cpa-requirements" },
      ],
    },
    {
      id: "WA",
      name: "ワシントン州",
      en: "Washington",
      exam: { degree: "bachelor", total: 120, acct: 24, biz: 24 },
      examText: "学士号+総120単位+会計24単位+ビジネス24単位(2025年11月の改定後)",
      licenses: [
        { label: "学士(120単位)+実務2年", degree: "bachelor", total: 120, acct: 24, biz: 24, exp: 2 },
        { label: "150単位+実務1年", degree: "bachelor", total: 150, acct: 24, biz: 24, exp: 1 },
      ],
      notes: [
        "SSN不要。合格後のライセンス取得先として選ばれることが多い",
        "会計単位の超過分をビジネス単位に充てられるとされる",
        "150単位ルートは2035年末で終了予定との情報あり",
      ],
      sources: [
        { label: "300hours: Washington CPA Requirements", url: "https://300hours.com/washington-cpa-requirements/" },
        { label: "AccountingEDU: Washington CPA 2026", url: "https://www.accountingedu.org/washington-cpa/" },
      ],
    },
    {
      id: "MT",
      name: "モンタナ州",
      en: "Montana",
      exam: { degree: "none", total: 0, acct: 24, biz: 24 },
      examText: "会計24単位+ビジネス24単位(学位不要とする情報あり。120単位が必要とする情報もあり)",
      licenses: [
        { label: "学士+実務2年", degree: "bachelor", total: 120, acct: 24, biz: 24, exp: 2, note: "2026年1月から" },
        { label: "学士+150単位+実務1年", degree: "bachelor", total: 150, acct: 24, biz: 24, exp: 1 },
        { label: "修士+実務1年", degree: "master", total: 150, acct: 24, biz: 24, exp: 1 },
      ],
      notes: [
        "2026年1月に150単位の一律要件を廃止し、3つのルートに再編",
        "受験時の学位・総単位要件は情報源で食い違うため要確認",
        "SSNの要否も情報源で食い違う",
      ],
      sources: [
        { label: "300hours: Montana CPA Requirements", url: "https://300hours.com/montana-cpa-requirements/" },
        { label: "Becker: Montana CPA Requirements", url: "https://www.becker.com/cpa-review/montana-cpa-requirements" },
      ],
    },
    {
      id: "NY",
      name: "ニューヨーク州",
      en: "New York",
      exam: { degree: "none", total: 120, acct: 12, biz: 0, acctNote: "財務会計・原価/管理会計・税務・監査の4分野で各1科目" },
      examText: "総120単位+会計4分野(財務会計・原価/管理会計・税務・監査)で各1科目",
      licenses: [
        { label: "150単位(会計33)+実務1年", degree: "bachelor", total: 150, acct: 33, biz: 0, exp: 1 },
        { label: "120単位(学士・会計24)+実務2年", degree: "bachelor", total: 120, acct: 24, biz: 0, exp: 2, note: "2026年11月21日から" },
      ],
      notes: [
        "外国の学歴は州の教育局(NYSED)が直接審査するとされる",
        "2027年8月以降は受験要件が変わるとの情報あり(要確認)",
      ],
      sources: [
        { label: "300hours: New York CPA Requirements", url: "https://300hours.com/new-york-cpa-requirements/" },
        { label: "Atlas CPA Index: New York 120-credit pathway", url: "https://atlascpaindex.com/news/new-york-120-credit-cpa-pathway-2026" },
      ],
    },
  ],
  common: [
    { label: "合格の有効期限", text: "多くの州で、最初の合格科目から30か月以内に残りの科目に合格する必要がある(州により18か月・36か月など)" },
    { label: "学歴評価", text: "日本の大学の単位がどう認定されるかは、NIES・FACS などの評価機関の判定で決まる。出願前に最初に行う。期間の目安は1.5〜3か月" },
    { label: "受験地", text: "日本(東京・大阪)のプロメトリック・テストセンターで受験できる" },
    { label: "ライセンス", text: "試験合格に加え、実務経験(原則としてCPAによる確認が必要)と倫理試験が求められる州が多い" },
  ],
  generalSources: [
    { label: "300hours: CPA Requirements by State (2026)", url: "https://300hours.com/cpa-requirements-by-state/" },
    { label: "AICPA: State policy trends shaping accounting in 2026", url: "https://www.aicpa-cima.com/advocacy/article/state-policy-trends-shaping-accounting-in-2026" },
    { label: "cpaexamguide: How long do CPA exam scores last", url: "https://www.cpaexamguide.com/how-long-do-cpa-exam-scores-last" },
  ],
};
