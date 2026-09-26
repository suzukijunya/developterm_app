// 追加ユニット: 中国での生活・チャット連絡・オンライン会議・IT開発・経理税務・通関物流・緊急時対応。
// data.js と同じ形式の問題を、短いヘルパーで書いてから UNITS の適切な位置に差し込む。

(() => {
  const L = (audioText, pinyin, correct, ...wrong) => ({
    type: "listening_choice",
    audioText,
    pinyin,
    prompt: "今聞こえた文の意味はどれ?",
    choices: [{ text: correct, correct: true }, ...wrong.map((text) => ({ text, correct: false }))],
  });
  const T = (hanzi, pinyin, correct, ...wrong) => ({
    type: "translate_choice",
    hanzi,
    pinyin,
    prompt: "この文の意味は?",
    choices: [{ text: correct, correct: true }, ...wrong.map((text) => ({ text, correct: false }))],
  });
  const S = (hanzi, pinyin, meaning) => ({ type: "speaking", hanzi, pinyin, meaning, prompt: "声に出して発音してみましょう" });
  const W = (meaning, pinyinHint, answer) => ({ type: "writing_cn", meaning, pinyinHint, answer });
  const strip = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const P = (hanzi, meaningHint, answerToned) => ({ type: "writing_pinyin", hanzi, meaningHint, answer: strip(answerToned), answerToned });
  const R = (passage, passagePinyin, question, correct, ...wrong) => ({
    type: "reading",
    passage,
    passagePinyin,
    question,
    choices: [{ text: correct, correct: true }, ...wrong.map((text) => ({ text, correct: false }))],
  });

  const NEW_UNITS = [
    {
      after: "u4",
      level: "lv2",
      unit: {
        id: "u14",
        title: "中国での生活",
        description: "スマホ決済・タクシー・出前・部屋探しなど、中国で暮らす基本",
        icon: "🏙️",
        lessons: [
          {
            id: "u14l1",
            title: "スマホ決済と買い物",
            exercises: [
              L("可以用微信支付吗", "kěyǐ yòng Wēixìn zhīfù ma", "WeChat Payで払えますか?", "現金しか使えませんか?", "レシートをもらえますか?"),
              T("我扫你还是你扫我?", "wǒ sǎo nǐ háishi nǐ sǎo wǒ?", "私が読み取りますか、それともあなたが読み取りますか?", "カードで払ってもいいですか?", "お釣りはありますか?"),
              S("请给我一个袋子", "qǐng gěi wǒ yí ge dàizi", "袋を1つください"),
              W("支払う", "zhīfù", "支付"),
              R(
                "现在在中国,很多人不带现金。买东西的时候,大家常常用手机扫码付款。",
                "Xiànzài zài Zhōngguó, hěn duō rén bú dài xiànjīn. Mǎi dōngxi de shíhou, dàjiā chángcháng yòng shǒujī sǎomǎ fùkuǎn.",
                "中国で買い物をするとき、多くの人はどう払いますか?",
                "スマホでコードを読み取って払う",
                "現金で払う",
                "クレジットカードで払う"
              ),
              P("便宜", "安い", "piányi"),
            ],
          },
          {
            id: "u14l2",
            title: "タクシーと出前",
            exercises: [
              L("师傅,去浦东机场", "shīfu, qù Pǔdōng jīchǎng", "運転手さん、浦東空港までお願いします", "運転手さん、ここで止めてください", "運転手さん、急いでください"),
              T("我用滴滴叫了一辆车", "wǒ yòng Dīdī jiào le yí liàng chē", "DiDiで車を1台呼びました", "駅でタクシーを待っています", "車を1台買いました"),
              S("师傅,就在前面停吧", "shīfu, jiù zài qiánmiàn tíng ba", "運転手さん、その先で止めてください"),
              L("外卖已经到楼下了", "wàimài yǐjīng dào lóuxià le", "出前がもう下に着きました", "出前がまだ届きません", "出前を注文したいです"),
              W("出前・デリバリー", "wàimài", "外卖"),
              R(
                "晚上加班的时候,我常常点外卖。一般三十分钟左右就送到公司。",
                "Wǎnshang jiābān de shíhou, wǒ chángcháng diǎn wàimài. Yìbān sānshí fēnzhōng zuǒyòu jiù sòngdào gōngsī.",
                "出前はだいたい何分で届きますか?",
                "30分ぐらい",
                "10分ぐらい",
                "1時間ぐらい"
              ),
            ],
          },
          {
            id: "u14l3",
            title: "部屋を借りる・銀行",
            exercises: [
              L("这套房子一个月房租多少钱", "zhè tào fángzi yí ge yuè fángzū duōshao qián", "この部屋の家賃は1か月いくらですか?", "この部屋は何平米ですか?", "この部屋はいつ入居できますか?"),
              T("押一付三", "yā yī fù sān", "敷金1か月分+家賃3か月分前払い", "家賃は1年分前払い", "敷金・礼金なし"),
              S("我想租一套离公司近的房子", "wǒ xiǎng zū yí tào lí gōngsī jìn de fángzi", "会社に近い部屋を借りたいです"),
              W("家賃", "fángzū", "房租"),
              L("我想办一张银行卡", "wǒ xiǎng bàn yì zhāng yínhángkǎ", "銀行カードを1枚作りたいです", "お金を下ろしたいです", "口座を解約したいです"),
              R(
                "外国人在中国办银行卡,需要带护照。有的银行还需要工作证明。",
                "Wàiguórén zài Zhōngguó bàn yínhángkǎ, xūyào dài hùzhào. Yǒude yínháng hái xūyào gōngzuò zhèngmíng.",
                "外国人が銀行カードを作るときに必ず必要なものは?",
                "パスポート",
                "運転免許証",
                "日本の銀行カード"
              ),
            ],
          },
        ],
      },
    },
    {
      after: "u6",
      level: "lv3",
      unit: {
        id: "u15",
        title: "チャットで連絡する",
        description: "WeChatでの返事・日程確認・グループへの報告",
        icon: "💬",
        lessons: [
          {
            id: "u15l1",
            title: "返事とあいづち",
            exercises: [
              L("收到,谢谢", "shōudào, xièxie", "受け取りました、ありがとうございます", "送りました、確認してください", "まだ届いていません"),
              T("好的,我马上看一下", "hǎo de, wǒ mǎshàng kàn yíxià", "わかりました、すぐ確認します", "わかりました、あとで電話します", "すみません、今忙しいです"),
              S("辛苦了", "xīnkǔ le", "お疲れさまです"),
              L("稍等,我确认一下", "shāo děng, wǒ quèrèn yíxià", "少々お待ちください、確認します", "もう確認しました", "確認をお願いします"),
              W("了解しました(受け取りました)", "shōudào", "收到"),
              P("明白了", "わかりました", "míngbai le"),
            ],
          },
          {
            id: "u15l2",
            title: "予定を確認する",
            exercises: [
              L("你明天下午方便吗", "nǐ míngtiān xiàwǔ fāngbiàn ma", "明日の午後はご都合いかがですか?", "明日の午後は忙しいですか?", "明日の午前は空いていますか?"),
              T("会议改到周四上午十点", "huìyì gǎidào zhōusì shàngwǔ shí diǎn", "会議は木曜の午前10時に変更です", "会議は木曜の午後に中止です", "会議は10時に始まりました"),
              S("不好意思,我可能会晚到十分钟", "bù hǎoyìsi, wǒ kěnéng huì wǎn dào shí fēnzhōng", "すみません、10分ほど遅れるかもしれません"),
              W("延期する", "tuīchí", "推迟"),
              R(
                "王经理:下周一的会可以推迟到周三吗?\n田中:可以,周三下午两点怎么样?\n王经理:没问题。",
                "Wáng jīnglǐ: Xià zhōuyī de huì kěyǐ tuīchí dào zhōusān ma?\nTiánzhōng: Kěyǐ, zhōusān xiàwǔ liǎng diǎn zěnmeyàng?\nWáng jīnglǐ: Méi wèntí.",
                "会議は結局いつになりましたか?",
                "水曜の午後2時",
                "月曜の午後2時",
                "水曜の午前10時"
              ),
              L("那就这么定了", "nà jiù zhème dìng le", "では、それで決まりですね", "では、また相談しましょう", "では、キャンセルしましょう"),
            ],
          },
          {
            id: "u15l3",
            title: "グループで報告する",
            exercises: [
              L("我把文件发到群里了", "wǒ bǎ wénjiàn fā dào qún li le", "ファイルをグループに送りました", "ファイルをメールで送りました", "ファイルがまだできていません"),
              T("有什么进展请随时告诉我", "yǒu shénme jìnzhǎn qǐng suíshí gàosu wǒ", "何か進展があればいつでも教えてください", "進展がなければ連絡は不要です", "毎日報告してください"),
              S("我先简单汇报一下今天的情况", "wǒ xiān jiǎndān huìbào yíxià jīntiān de qíngkuàng", "まず今日の状況を簡単に報告します"),
              W("転送する", "zhuǎnfā", "转发"),
              R(
                "各位好,项目的最新进展如下:一、设计已经完成;二、测试下周开始。有问题请在群里说。",
                "Gèwèi hǎo, xiàngmù de zuìxīn jìnzhǎn rúxià: yī, shèjì yǐjīng wánchéng; èr, cèshì xià zhōu kāishǐ. Yǒu wèntí qǐng zài qún li shuō.",
                "テストはいつ始まりますか?",
                "来週",
                "今日",
                "もう終わった"
              ),
              P("进展", "進展", "jìnzhǎn"),
            ],
          },
        ],
      },
    },
    {
      after: "u8",
      level: "lv4",
      unit: {
        id: "u16",
        title: "オンライン会議",
        description: "ビデオ会議の接続・画面共有・議事録とタスクのまとめ",
        icon: "💻",
        lessons: [
          {
            id: "u16l1",
            title: "会議に入る",
            exercises: [
              L("大家听得到我的声音吗", "dàjiā tīng de dào wǒ de shēngyīn ma", "皆さん、私の声は聞こえますか?", "皆さん、私の画面は見えますか?", "皆さん、もう始めてもいいですか?"),
              T("你那边好像是静音", "nǐ nàbiān hǎoxiàng shì jìngyīn", "そちらはミュートになっているようです", "そちらは声が大きすぎます", "そちらの画面が暗いです"),
              S("我先把摄像头打开", "wǒ xiān bǎ shèxiàngtóu dǎkāi", "先にカメラをオンにします"),
              W("マイク", "màikèfēng", "麦克风"),
              L("还有几个人没进来,我们再等两分钟", "hái yǒu jǐ ge rén méi jìnlái, wǒmen zài děng liǎng fēnzhōng", "まだ何人か入っていないので、あと2分待ちましょう", "全員そろったので始めましょう", "2分後に終わりにしましょう"),
              P("会议链接", "会議のリンク", "huìyì liànjiē"),
            ],
          },
          {
            id: "u16l2",
            title: "画面共有と通信トラブル",
            exercises: [
              L("我来共享一下屏幕", "wǒ lái gòngxiǎng yíxià píngmù", "私が画面を共有します", "私が録画を始めます", "私が資料を送ります"),
              T("你的声音有点卡", "nǐ de shēngyīn yǒudiǎn kǎ", "声が少し途切れています", "声が少し小さいです", "声がよく聞こえます"),
              S("不好意思,我刚才掉线了", "bù hǎoyìsi, wǒ gāngcái diàoxiàn le", "すみません、さっき回線が切れました"),
              W("画面", "píngmù", "屏幕"),
              R(
                "开会的时候如果网络不好,可以先关掉摄像头,只用声音。这样会比较流畅。",
                "Kāihuì de shíhou rúguǒ wǎngluò bù hǎo, kěyǐ xiān guāndiào shèxiàngtóu, zhǐ yòng shēngyīn. Zhèyàng huì bǐjiào liúchàng.",
                "通信状態が悪いときのアドバイスは?",
                "カメラを切って音声だけにする",
                "会議を延期する",
                "画面共有を続ける"
              ),
              L("你能看到我的屏幕吗", "nǐ néng kàndào wǒ de píngmù ma", "私の画面は見えますか?", "私の声は聞こえますか?", "私の資料は届きましたか?"),
            ],
          },
          {
            id: "u16l3",
            title: "会議のまとめ",
            exercises: [
              L("我来总结一下今天的会议", "wǒ lái zǒngjié yíxià jīntiān de huìyì", "今日の会議をまとめます", "今日の会議を始めます", "今日の会議は中止です"),
              T("下一步由谁负责?", "xià yí bù yóu shéi fùzé?", "次のステップは誰が担当しますか?", "次の会議はいつですか?", "誰が議事録を書きましたか?"),
              S("会议纪要我今天发给大家", "huìyì jìyào wǒ jīntiān fā gěi dàjiā", "議事録は今日皆さんに送ります"),
              W("締め切り", "jiézhǐ rìqī", "截止日期"),
              R(
                "今天的会议决定了三件事:第一,报价单周五前发给客户;第二,样品下周寄出;第三,下次会议在月底。",
                "Jīntiān de huìyì juédìng le sān jiàn shì: dì yī, bàojiàdān zhōuwǔ qián fā gěi kèhù; dì èr, yàngpǐn xià zhōu jìchū; dì sān, xià cì huìyì zài yuèdǐ.",
                "見積書はいつまでに顧客に送りますか?",
                "金曜日まで",
                "来週",
                "月末"
              ),
              P("负责人", "担当者", "fùzérén"),
            ],
          },
        ],
      },
    },
    {
      after: "u10",
      level: "lv5",
      unit: {
        id: "u17",
        title: "IT・システム開発",
        description: "要件定義・テスト・リリースと障害対応",
        icon: "🛠️",
        lessons: [
          {
            id: "u17l1",
            title: "要件と仕様",
            exercises: [
              L("我们先确认一下需求", "wǒmen xiān quèrèn yíxià xūqiú", "まず要件を確認しましょう", "まず見積もりを出しましょう", "まずテストをしましょう"),
              T("这个功能不在这次的范围内", "zhège gōngnéng bú zài zhè cì de fànwéi nèi", "この機能は今回の範囲外です", "この機能はもう完成しています", "この機能は無料です"),
              S("请把需求整理成文档", "qǐng bǎ xūqiú zhěnglǐ chéng wéndàng", "要件をドキュメントにまとめてください"),
              W("機能", "gōngnéng", "功能"),
              R(
                "客户希望增加一个导出表格的功能。开发需要三天,测试需要两天。",
                "Kèhù xīwàng zēngjiā yí ge dǎochū biǎogé de gōngnéng. Kāifā xūyào sān tiān, cèshì xūyào liǎng tiān.",
                "開発とテストで合計何日かかりますか?",
                "5日",
                "3日",
                "2日"
              ),
              P("需求", "要件・ニーズ", "xūqiú"),
            ],
          },
          {
            id: "u17l2",
            title: "開発とテスト",
            exercises: [
              L("测试的时候发现了一个问题", "cèshì de shíhou fāxiàn le yí ge wèntí", "テストのときに問題が1つ見つかりました", "テストはすべて合格しました", "テストはまだ始まっていません"),
              T("这个问题已经修复了", "zhège wèntí yǐjīng xiūfù le", "この問題はもう修正されました", "この問題はまだ再現できません", "この問題は仕様です"),
              S("麻烦你把复现步骤发给我", "máfan nǐ bǎ fùxiàn bùzhòu fā gěi wǒ", "再現手順を送っていただけますか"),
              W("テストする", "cèshì", "测试"),
              L("新版本明天可以提交测试", "xīn bǎnběn míngtiān kěyǐ tíjiāo cèshì", "新しいバージョンは明日テストに出せます", "新しいバージョンは今日リリースしました", "新しいバージョンは延期になりました"),
              P("版本", "バージョン", "bǎnběn"),
            ],
          },
          {
            id: "u17l3",
            title: "リリースと障害対応",
            exercises: [
              L("系统计划下周一上线", "xìtǒng jìhuà xià zhōuyī shàngxiàn", "システムは来週月曜にリリース予定です", "システムは来週月曜に停止します", "システムは先週リリースしました"),
              T("服务器出现故障,正在紧急处理", "fúwùqì chūxiàn gùzhàng, zhèngzài jǐnjí chǔlǐ", "サーバーに障害が発生し、緊急対応中です", "サーバーを新しく購入しました", "サーバーのメンテナンスが完了しました"),
              S("上线前一定要做好数据备份", "shàngxiàn qián yídìng yào zuò hǎo shùjù bèifèn", "リリース前に必ずデータのバックアップを取ってください"),
              W("サーバー", "fúwùqì", "服务器"),
              R(
                "今晚十点到十二点系统维护,期间无法登录。给大家带来不便,敬请谅解。",
                "Jīnwǎn shí diǎn dào shí'èr diǎn xìtǒng wéihù, qījiān wúfǎ dēnglù. Gěi dàjiā dàilái búbiàn, jìngqǐng liàngjiě.",
                "メンテナンス中はどうなりますか?",
                "ログインできない",
                "動作が遅くなるだけ",
                "データが消える"
              ),
              P("上线", "リリースする・稼働する", "shàngxiàn"),
            ],
          },
        ],
      },
    },
    {
      after: "u17",
      level: "lv5",
      unit: {
        id: "u18",
        title: "経理・税務",
        description: "発票(インボイス)・経費精算・税金と決算",
        icon: "🧾",
        lessons: [
          {
            id: "u18l1",
            title: "請求書と発票",
            exercises: [
              L("请帮我开一张发票", "qǐng bāng wǒ kāi yì zhāng fāpiào", "発票(領収書)を1枚発行してください", "請求書を送ってください", "お釣りをください"),
              T("发票抬头写公司全称", "fāpiào táitóu xiě gōngsī quánchēng", "発票の宛名は会社の正式名称を書きます", "発票の金額は税抜きで書きます", "発票は個人名で書きます"),
              S("请问贵公司的税号是多少?", "qǐngwèn guì gōngsī de shuìhào shì duōshao?", "御社の納税者番号は何番ですか?"),
              W("発票(公式の領収書)", "fāpiào", "发票"),
              R(
                "在中国,公司报销和记账都需要发票。发票上要有公司名称和税号,不然不能报销。",
                "Zài Zhōngguó, gōngsī bàoxiāo hé jìzhàng dōu xūyào fāpiào. Fāpiào shang yào yǒu gōngsī míngchēng hé shuìhào, bùrán bù néng bàoxiāo.",
                "発票に会社名と納税者番号がないとどうなりますか?",
                "経費精算できない",
                "税金が安くなる",
                "問題はない"
              ),
              P("税号", "納税者番号", "shuìhào"),
            ],
          },
          {
            id: "u18l2",
            title: "経費精算と予算",
            exercises: [
              L("出差的费用可以报销吗", "chūchāi de fèiyòng kěyǐ bàoxiāo ma", "出張の費用は精算できますか?", "出張の予算はいくらですか?", "出張はいつ行きますか?"),
              T("报销单需要部门经理审批", "bàoxiāodān xūyào bùmén jīnglǐ shěnpī", "精算書は部門長の承認が必要です", "精算書は経理に直接出します", "精算書は必要ありません"),
              S("这个月的预算已经超了", "zhège yuè de yùsuàn yǐjīng chāo le", "今月の予算はもうオーバーしています"),
              W("予算", "yùsuàn", "预算"),
              L("请把收据和发票一起交给财务", "qǐng bǎ shōujù hé fāpiào yìqǐ jiāo gěi cáiwù", "領収書と発票を一緒に経理に渡してください", "領収書は捨ててもいいです", "発票だけ経理に渡してください"),
              P("报销", "経費精算する", "bàoxiāo"),
            ],
          },
          {
            id: "u18l3",
            title: "税金と決算",
            exercises: [
              L("增值税每个月都要申报", "zēngzhíshuì měi ge yuè dōu yào shēnbào", "増値税は毎月申告しなければなりません", "増値税は年に1回だけ申告します", "増値税は免除されています"),
              T("这笔款项还没有入账", "zhè bǐ kuǎnxiàng hái méiyǒu rùzhàng", "この入金はまだ記帳されていません", "この支払いはもう完了しました", "この金額は間違っています"),
              S("我们需要和对方核对一下账目", "wǒmen xūyào hé duìfāng héduì yíxià zhàngmù", "相手方と帳簿を突き合わせる必要があります"),
              W("決算", "juésuàn", "决算"),
              R(
                "年底决算的时候,财务部要核对所有的收入和支出,然后向税务局提交报告。",
                "Niándǐ juésuàn de shíhou, cáiwùbù yào héduì suǒyǒu de shōurù hé zhīchū, ránhòu xiàng shuìwùjú tíjiāo bàogào.",
                "決算のとき、経理部は最後にどこに報告を出しますか?",
                "税務局",
                "銀行",
                "顧客"
              ),
              P("增值税", "増値税(付加価値税)", "zēngzhíshuì"),
            ],
          },
        ],
      },
    },
    {
      after: "u13",
      level: "lv6",
      unit: {
        id: "u19",
        title: "通関と物流",
        description: "通関手続き・税関検査・関税・輸送と納期",
        icon: "🛃",
        lessons: [
          {
            id: "u19l1",
            title: "通関の手続き",
            exercises: [
              L("这批货已经报关了吗", "zhè pī huò yǐjīng bàoguān le ma", "この貨物はもう通関申告しましたか?", "この貨物はもう出荷しましたか?", "この貨物はもう支払いましたか?"),
              T("清关需要三到五个工作日", "qīngguān xūyào sān dào wǔ ge gōngzuòrì", "通関には3〜5営業日かかります", "通関は即日で終わります", "通関には3〜5週間かかります"),
              S("请把报关单据准备好", "qǐng bǎ bàoguān dānjù zhǔnbèi hǎo", "通関書類を準備しておいてください"),
              W("税関", "hǎiguān", "海关"),
              R(
                "进口报关需要提供发票、装箱单和提单。如果资料不全,海关会要求补充。",
                "Jìnkǒu bàoguān xūyào tígōng fāpiào, zhuāngxiāngdān hé tídān. Rúguǒ zīliào bù quán, hǎiguān huì yāoqiú bǔchōng.",
                "書類が足りないと税関はどうしますか?",
                "追加の提出を求める",
                "貨物を返送する",
                "罰金だけで通す"
              ),
              P("清关", "通関(輸入許可まで)", "qīngguān"),
            ],
          },
          {
            id: "u19l2",
            title: "税関検査と関税",
            exercises: [
              L("这批货被海关抽中查验了", "zhè pī huò bèi hǎiguān chōuzhòng cháyàn le", "この貨物は税関の検査対象に選ばれました", "この貨物は税関を通過しました", "この貨物は税関で紛失しました"),
              T("关税由买方承担", "guānshuì yóu mǎifāng chéngdān", "関税は買い手が負担します", "関税は売り手が負担します", "関税はかかりません"),
              S("我们可以提供原产地证明", "wǒmen kěyǐ tígōng yuánchǎndì zhèngmíng", "原産地証明書を提出できます"),
              W("関税", "guānshuì", "关税"),
              R(
                "海关认为申报的价格偏低,要求我们补缴税款。我们准备了合同和付款记录来说明情况。",
                "Hǎiguān rènwéi shēnbào de jiàgé piān dī, yāoqiú wǒmen bǔjiǎo shuìkuǎn. Wǒmen zhǔnbèi le hétong hé fùkuǎn jìlù lái shuōmíng qíngkuàng.",
                "税関はなぜ追加納税を求めましたか?",
                "申告価格が低すぎると判断したから",
                "書類の期限が切れていたから",
                "貨物が壊れていたから"
              ),
              P("查验", "(税関の)検査", "cháyàn"),
            ],
          },
          {
            id: "u19l3",
            title: "物流と納期",
            exercises: [
              L("货物预计下周三到港", "huòwù yùjì xià zhōusān dào gǎng", "貨物は来週水曜に港に着く予定です", "貨物は来週水曜に出荷予定です", "貨物は昨日港に着きました"),
              T("因为台风,船期延误了", "yīnwèi táifēng, chuánqī yánwù le", "台風のため、船のスケジュールが遅れました", "台風のため、貨物が壊れました", "台風のため、出荷を中止しました"),
              S("能不能先发一部分货?", "néng bu néng xiān fā yí bùfen huò?", "先に一部だけ出荷できませんか?"),
              W("物流", "wùliú", "物流"),
              L("请提供一下物流单号", "qǐng tígōng yíxià wùliú dānhào", "追跡番号を教えてください", "送料を教えてください", "配達先を教えてください"),
              P("发货", "出荷する", "fāhuò"),
            ],
          },
        ],
      },
    },
    {
      after: "u19",
      level: "lv6",
      unit: {
        id: "u20",
        title: "緊急時・トラブル対応",
        description: "連絡がつかないとき・警察への届け出・弁護士と法的手続き",
        icon: "🚨",
        lessons: [
          {
            id: "u20l1",
            title: "連絡がつかない",
            exercises: [
              L("从昨天中午开始就联系不上他", "cóng zuótiān zhōngwǔ kāishǐ jiù liánxì bu shàng tā", "昨日の昼から彼と連絡がつきません", "昨日の昼に彼から連絡がありました", "昨日の昼に彼と会いました"),
              T("电话有信号,但是没人接", "diànhuà yǒu xìnhào, dànshì méi rén jiē", "電話はつながるが、誰も出ない", "電話の電源が切れている", "電話番号が間違っている"),
              S("请问你们有他的最新消息吗?", "qǐngwèn nǐmen yǒu tā de zuìxīn xiāoxi ma?", "彼の最新情報はありますか?"),
              W("家族(親族)", "jiāshǔ", "家属"),
              R(
                "我们发的消息一直显示未读。他的家属说,他中午打过一次电话,说现在不方便联系。",
                "Wǒmen fā de xiāoxi yìzhí xiǎnshì wèidú. Tā de jiāshǔ shuō, tā zhōngwǔ dǎguo yí cì diànhuà, shuō xiànzài bù fāngbiàn liánxì.",
                "家族によると、彼は電話で何と言いましたか?",
                "今は連絡しづらい",
                "すぐに帰る",
                "電話をなくした"
              ),
              P("失联", "連絡が取れなくなる", "shīlián"),
            ],
          },
          {
            id: "u20l2",
            title: "警察に届け出る",
            exercises: [
              L("我们去派出所报案了", "wǒmen qù pàichūsuǒ bào'àn le", "私たちは派出所に届け出をしました", "私たちは派出所から呼び出されました", "私たちは空港に行きました"),
              T("警察说系统里没有查到相关记录", "jǐngchá shuō xìtǒng li méiyǒu chádào xiāngguān jìlù", "警察によると、システムに関連記録は見つからなかった", "警察によると、事故の記録があった", "警察によると、明日また来てほしい"),
              S("请问报案需要带什么材料?", "qǐngwèn bào'àn xūyào dài shénme cáiliào?", "届け出には何の書類が必要ですか?"),
              W("警察に通報する", "bàojǐng", "报警"),
              R(
                "报案以后,派出所给了我们一张接报回执。上面有案件编号和联系电话,可以用来查询进展。",
                "Bào'àn yǐhòu, pàichūsuǒ gěi le wǒmen yì zhāng jiēbào huízhí. Shàngmiàn yǒu ànjiàn biānhào hé liánxì diànhuà, kěyǐ yònglái cháxún jìnzhǎn.",
                "受理の控えは何に使えますか?",
                "進捗の問い合わせ",
                "出国の手続き",
                "保険金の請求"
              ),
              P("派出所", "派出所・交番", "pàichūsuǒ"),
            ],
          },
          {
            id: "u20l3",
            title: "弁護士と法的手続き",
            exercises: [
              L("我们想请一位律师", "wǒmen xiǎng qǐng yí wèi lǜshī", "弁護士を1人頼みたいです", "弁護士と話が終わりました", "弁護士は必要ありません"),
              T("他已经被取保候审了", "tā yǐjīng bèi qǔbǎo hòushěn le", "彼はすでに保釈されました", "彼はまだ拘留されています", "彼は起訴されました"),
              S("在案件解决之前,他不能离开中国", "zài ànjiàn jiějué zhīqián, tā bù néng líkāi Zhōngguó", "事件が解決するまで、彼は中国を出られません"),
              W("弁護士", "lǜshī", "律师"),
              R(
                "取保候审期间,本人不能离开居住的城市,要随传随到,并且不能出境。",
                "Qǔbǎo hòushěn qījiān, běnrén bù néng líkāi jūzhù de chéngshì, yào suí chuán suí dào, bìngqiě bù néng chūjìng.",
                "保釈期間中にできないことは?",
                "出国すること",
                "家族と会うこと",
                "自宅に住むこと"
              ),
              P("配合", "協力する", "pèihé"),
            ],
          },
        ],
      },
    },
  ];

  // 追加ユニットを UNITS に加える(並び順とレベルは curriculum.js で LEVELS に合わせる)
  NEW_UNITS.forEach(({ unit }) => {
    if (!UNITS.some((u) => u.id === unit.id)) UNITS.push(unit);
  });
})();
