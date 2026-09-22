// トークタブのコンテンツ(モーメンツの投稿・会話リスニング)
// 登場人物はすべて学習用の架空の人物

const MOMENT_PEOPLE = {
  xiaomei: { name: "小美", avatar: "🌸", profile: "上海のIT企業で働く28歳の会社員。明るくおしゃべりで、タピオカと旅行が好き。猫を飼っている。" },
  aming: { name: "阿明", avatar: "🎓", profile: "北京の大学に通う21歳の学生。バスケとゲームが好きで、日本に留学したいと思っている。" },
  wang: { name: "王老师", avatar: "👩‍🏫", profile: "中国語教師歴15年の女性の先生。やさしく丁寧で、学習のコツを教えるのが好き。" },
  liqiang: { name: "李强", avatar: "💻", profile: "深圳のIT企業で働く32歳のエンジニア。仕事熱心で、最近ジム通いを始めた。" },
  chen: { name: "陈阿姨", avatar: "🍲", profile: "成都に住む60歳の料理好きの女性。家族思いで、公園で広場ダンスをするのが日課。" },
};

const MOMENTS = [
  { id: "m1", who: "xiaomei", art: "🧋", time: "2時間前", likes: 32, zh: "今天加班到十点，终于下班了！奖励自己一杯奶茶。", pinyin: "Jīntiān jiābān dào shí diǎn, zhōngyú xiàbān le! Jiǎnglì zìjǐ yì bēi nǎichá.", ja: "今日は10時まで残業、やっと退勤!ご褒美にミルクティーを1杯。" },
  { id: "m2", who: "aming", art: "📚😵", time: "3時間前", likes: 18, zh: "明天考试，今晚要通宵复习。谁来救救我？", pinyin: "Míngtiān kǎoshì, jīnwǎn yào tōngxiāo fùxí. Shéi lái jiùjiu wǒ?", ja: "明日試験だから今夜は徹夜で復習。誰か助けて?" },
  { id: "m3", who: "chen", art: "🍲😋", time: "5時間前", likes: 56, zh: "周末给家人做了麻婆豆腐，大家都说好吃！", pinyin: "Zhōumò gěi jiārén zuò le mápó dòufu, dàjiā dōu shuō hǎochī!", ja: "週末に家族に麻婆豆腐を作ったら、みんなおいしいって!" },
  { id: "m4", who: "wang", art: "📖✨", time: "昨日", likes: 120, zh: "学中文的小技巧：每天大声读五分钟课文，发音会越来越好。", pinyin: "Xué Zhōngwén de xiǎo jìqiǎo: měitiān dàshēng dú wǔ fēnzhōng kèwén, fāyīn huì yuè lái yuè hǎo.", ja: "中国語学習のコツ:毎日5分、教科書を声に出して読むと発音がどんどん良くなります。" },
  { id: "m5", who: "liqiang", art: "🌧️🚇", time: "昨日", likes: 9, zh: "深圳今天下大雨，地铁里人特别多。", pinyin: "Shēnzhèn jīntiān xià dà yǔ, dìtiě li rén tèbié duō.", ja: "深圳は今日大雨で、地下鉄がめちゃくちゃ混んでる。" },
  { id: "m6", who: "xiaomei", art: "🏞️📸", time: "2日前", likes: 88, zh: "周末去了杭州西湖，风景太美了！", pinyin: "Zhōumò qù le Hángzhōu Xīhú, fēngjǐng tài měi le!", ja: "週末に杭州の西湖へ行ってきた、景色がすごくきれい!" },
  { id: "m7", who: "aming", art: "🍜🇯🇵", time: "2日前", likes: 41, zh: "第一次去日本旅游，最想吃的是拉面！", pinyin: "Dì yī cì qù Rìběn lǚyóu, zuì xiǎng chī de shì lāmiàn!", ja: "初めての日本旅行、一番食べたいのはラーメン!" },
  { id: "m8", who: "liqiang", art: "🚀🎉", time: "3日前", likes: 67, zh: "新项目终于上线了，团队辛苦了！", pinyin: "Xīn xiàngmù zhōngyú shàngxiàn le, tuánduì xīnkǔ le!", ja: "新しいプロジェクトがついにリリース、チームのみんなお疲れさま!" },
  { id: "m9", who: "chen", art: "💃🌳", time: "3日前", likes: 25, zh: "今天早上在公园跳广场舞，认识了新朋友。", pinyin: "Jīntiān zǎoshang zài gōngyuán tiào guǎngchǎngwǔ, rènshi le xīn péngyou.", ja: "今朝公園で広場ダンスをしていたら、新しい友達ができた。" },
  { id: "m10", who: "wang", art: "🥮🌕", time: "4日前", likes: 150, zh: "中秋节快乐！大家吃月饼了吗？", pinyin: "Zhōngqiūjié kuàilè! Dàjiā chī yuèbing le ma?", ja: "中秋節おめでとう!みなさん月餅は食べましたか?" },
  { id: "m11", who: "xiaomei", art: "🐱☕", time: "5日前", likes: 73, zh: "我的猫今天又把我的咖啡打翻了……", pinyin: "Wǒ de māo jīntiān yòu bǎ wǒ de kāfēi dǎfān le……", ja: "うちの猫、今日もまた私のコーヒーをひっくり返した…" },
  { id: "m12", who: "aming", art: "🚗🪪", time: "6日前", likes: 52, zh: "终于拿到驾照了！下次带你们去兜风。", pinyin: "Zhōngyú ná dào jiàzhào le! Xià cì dài nǐmen qù dōufēng.", ja: "ついに運転免許を取った!今度みんなをドライブに連れて行くよ。" },
  { id: "m13", who: "liqiang", art: "🏋️💦", time: "1週間前", likes: 30, zh: "下班后去健身房锻炼了一个小时，累但是很开心。", pinyin: "Xiàbān hòu qù jiànshēnfáng duànliàn le yí ge xiǎoshí, lèi dànshì hěn kāixīn.", ja: "仕事の後ジムで1時間トレーニング。疲れたけど楽しい。" },
  { id: "m14", who: "chen", art: "👶💕", time: "1週間前", likes: 99, zh: "孙子今天第一次叫我奶奶，太开心了！", pinyin: "Sūnzi jīntiān dì yī cì jiào wǒ nǎinai, tài kāixīn le!", ja: "孫が今日はじめて「おばあちゃん」って呼んでくれた、うれしすぎる!" },
  { id: "m15", who: "wang", art: "💡🎯", time: "1週間前", likes: 110, zh: "今天的成语：一举两得，意思是做一件事得到两个好处。", pinyin: "Jīntiān de chéngyǔ: yì jǔ liǎng dé, yìsi shì zuò yí jiàn shì dédào liǎng ge hǎochù.", ja: "今日の成語:一挙両得。1つのことをして2つの得をするという意味です。" },
];

// 会話リスニング(みんなの話を聞いてみよう)
const DIALOGUES = [
  {
    id: "weekend",
    title: "週末なにしてた?",
    art: "🏔️🎬",
    level: "初級",
    speakers: { A: "xiaomei", B: "aming" },
    lines: [
      ["A", "阿明，周末你做了什么？", "Āmíng, zhōumò nǐ zuò le shénme?", "阿明、週末は何をしたの?"],
      ["B", "我和朋友去爬山了。你呢？", "Wǒ hé péngyou qù páshān le. Nǐ ne?", "友達と山登りに行ったよ。君は?"],
      ["A", "我在家看了一部电影。", "Wǒ zài jiā kàn le yí bù diànyǐng.", "家で映画を1本見たよ。"],
      ["B", "什么电影？好看吗？", "Shénme diànyǐng? Hǎokàn ma?", "どんな映画?面白かった?"],
      ["A", "是一部爱情片，特别感人。", "Shì yí bù àiqíngpiàn, tèbié gǎnrén.", "恋愛映画で、すごく感動した。"],
      ["B", "下次推荐给我吧！", "Xià cì tuījiàn gěi wǒ ba!", "今度おすすめしてよ!"],
    ],
  },
  {
    id: "cafe",
    title: "カフェで注文",
    art: "☕🧾",
    level: "初級",
    speakers: { A: "staff", B: "xiaomei" },
    lines: [
      ["A", "您好，请问喝点儿什么？", "Nín hǎo, qǐngwèn hē diǎnr shénme?", "いらっしゃいませ、何になさいますか?"],
      ["B", "我要一杯拿铁，少糖。", "Wǒ yào yì bēi nátiě, shǎo táng.", "ラテを1つ、甘さ控えめで。"],
      ["A", "要热的还是冰的？", "Yào rè de háishi bīng de?", "ホットですか、アイスですか?"],
      ["B", "冰的，谢谢。", "Bīng de, xièxie.", "アイスで、ありがとう。"],
      ["A", "在这儿喝还是带走？", "Zài zhèr hē háishi dàizǒu?", "店内でお召し上がりですか、お持ち帰りですか?"],
      ["B", "带走。可以用手机支付吗？", "Dàizǒu. Kěyǐ yòng shǒujī zhīfù ma?", "持ち帰りで。スマホ決済できますか?"],
      ["A", "可以，请扫这个二维码。", "Kěyǐ, qǐng sǎo zhège èrwéimǎ.", "はい、こちらのQRコードを読み取ってください。"],
    ],
  },
  {
    id: "job",
    title: "転職の話",
    art: "💼🎉",
    level: "中級",
    speakers: { A: "liqiang", B: "xiaomei" },
    lines: [
      ["A", "听说你要换工作了？", "Tīngshuō nǐ yào huàn gōngzuò le?", "転職するって聞いたけど?"],
      ["B", "对，我找到了一个新工作。", "Duì, wǒ zhǎodào le yí ge xīn gōngzuò.", "うん、新しい仕事が見つかったの。"],
      ["A", "恭喜！是什么样的公司？", "Gōngxǐ! Shì shénmeyàng de gōngsī?", "おめでとう!どんな会社?"],
      ["B", "是一家日本公司，需要会说日语。", "Shì yì jiā Rìběn gōngsī, xūyào huì shuō Rìyǔ.", "日本の会社で、日本語が話せる必要があるの。"],
      ["A", "那太适合你了。工资怎么样？", "Nà tài shìhé nǐ le. Gōngzī zěnmeyàng?", "それはぴったりだね。給料はどう?"],
      ["B", "比现在高一点儿，而且不用经常加班。", "Bǐ xiànzài gāo yìdiǎnr, érqiě búyòng jīngcháng jiābān.", "今より少し高いし、しょっちゅう残業しなくていいの。"],
    ],
  },
  {
    id: "trip",
    title: "旅行の計画",
    art: "🗺️✈️",
    level: "中級",
    speakers: { A: "aming", B: "xiaomei" },
    lines: [
      ["A", "国庆节你有什么打算？", "Guóqìngjié nǐ yǒu shénme dǎsuan?", "国慶節は何か予定ある?"],
      ["B", "我想去云南旅游。", "Wǒ xiǎng qù Yúnnán lǚyóu.", "雲南に旅行に行きたいな。"],
      ["A", "云南不错！你打算去几天？", "Yúnnán búcuò! Nǐ dǎsuan qù jǐ tiān?", "雲南いいね!何日行くつもり?"],
      ["B", "五天左右，先去昆明，再去大理。", "Wǔ tiān zuǒyòu, xiān qù Kūnmíng, zài qù Dàlǐ.", "5日くらい。まず昆明に行って、それから大理へ。"],
      ["A", "节假日人很多，最好早点儿订票。", "Jiéjiàrì rén hěn duō, zuìhǎo zǎo diǎnr dìng piào.", "連休は人が多いから、早めにチケットを取ったほうがいいよ。"],
      ["B", "好的，我今天就订。", "Hǎo de, wǒ jīntiān jiù dìng.", "わかった、今日のうちに予約する。"],
    ],
  },
  {
    id: "weather",
    title: "寒い日のあいさつ",
    art: "❄️🧣",
    level: "初級",
    speakers: { A: "chen", B: "aming" },
    lines: [
      ["A", "今天好冷啊，你多穿点儿衣服。", "Jīntiān hǎo lěng a, nǐ duō chuān diǎnr yīfu.", "今日はずいぶん寒いね、もっと着込みなさい。"],
      ["B", "知道了，阿姨。听说明天要下雪。", "Zhīdào le, āyí. Tīngshuō míngtiān yào xià xuě.", "わかりました。明日は雪が降るらしいですよ。"],
      ["A", "真的吗？那出门要小心，路很滑。", "Zhēn de ma? Nà chūmén yào xiǎoxīn, lù hěn huá.", "本当?じゃあ出かける時は気をつけて、道が滑るから。"],
      ["B", "放心吧，我坐地铁去学校。", "Fàngxīn ba, wǒ zuò dìtiě qù xuéxiào.", "安心してください、地下鉄で学校に行きます。"],
    ],
  },
  {
    id: "sick",
    title: "体調が悪いとき",
    art: "🤒🏥",
    level: "中級",
    speakers: { A: "wang", B: "liqiang" },
    lines: [
      ["A", "李强，你脸色不太好，怎么了？", "Lǐ Qiáng, nǐ liǎnsè bú tài hǎo, zěnme le?", "李強さん、顔色が良くないですね。どうしました?"],
      ["B", "我有点儿发烧，头也很疼。", "Wǒ yǒudiǎnr fāshāo, tóu yě hěn téng.", "少し熱があって、頭も痛いんです。"],
      ["A", "你应该去医院看看。", "Nǐ yīnggāi qù yīyuàn kànkan.", "病院で診てもらったほうがいいですよ。"],
      ["B", "好，我下午请个假。", "Hǎo, wǒ xiàwǔ qǐng ge jià.", "はい、午後は休みを取ります。"],
      ["A", "多喝水，好好儿休息。", "Duō hē shuǐ, hǎohāor xiūxi.", "水をたくさん飲んで、ゆっくり休んでね。"],
    ],
  },
  {
    id: "meeting",
    title: "会議の準備",
    art: "📊🗓️",
    level: "上級",
    speakers: { A: "liqiang", B: "xiaomei" },
    lines: [
      ["A", "明天的会议资料准备好了吗？", "Míngtiān de huìyì zīliào zhǔnbèi hǎo le ma?", "明日の会議資料は準備できた?"],
      ["B", "还差一点儿，今天下班前发给你。", "Hái chà yìdiǎnr, jīntiān xiàbān qián fā gěi nǐ.", "あと少しです。今日の退勤前に送ります。"],
      ["A", "好的，客户十点到，我们九点半先开个短会。", "Hǎo de, kèhù shí diǎn dào, wǒmen jiǔ diǎn bàn xiān kāi ge duǎn huì.", "了解。お客さんは10時に来るから、9時半に先に短い打ち合わせをしよう。"],
      ["B", "没问题。需要准备样品吗？", "Méi wèntí. Xūyào zhǔnbèi yàngpǐn ma?", "問題ありません。サンプルは用意しますか?"],
      ["A", "要，准备三个就行。", "Yào, zhǔnbèi sān ge jiù xíng.", "うん、3つ用意すれば大丈夫。"],
    ],
  },
  {
    id: "moving",
    title: "引っ越し",
    art: "📦🏠",
    level: "初級",
    speakers: { A: "aming", B: "chen" },
    lines: [
      ["A", "阿姨，我下个月要搬家了。", "Āyí, wǒ xià ge yuè yào bānjiā le.", "おばさん、来月引っ越すんです。"],
      ["B", "搬到哪儿去？", "Bān dào nǎr qù?", "どこに引っ越すの?"],
      ["A", "搬到学校附近，每天上课方便一点儿。", "Bān dào xuéxiào fùjìn, měitiān shàngkè fāngbiàn yìdiǎnr.", "学校の近くに。毎日の通学が少し楽になるので。"],
      ["B", "那太好了。需要帮忙就告诉我。", "Nà tài hǎo le. Xūyào bāngmáng jiù gàosu wǒ.", "それは良かった。手伝いが必要なら言ってね。"],
      ["A", "谢谢阿姨！搬完请您来吃饭。", "Xièxie āyí! Bān wán qǐng nín lái chīfàn.", "ありがとうございます!引っ越したらご飯を食べに来てください。"],
    ],
  },
];

const DIALOGUE_EXTRA_PEOPLE = {
  staff: { name: "店员", avatar: "🧑‍🍳" },
};
