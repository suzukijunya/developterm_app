// 特別コース「貿易実務 30ラリー特訓」。
// 日本の輸出者(田中)と中国の輸入者(王経理)の、問い合わせ〜価格交渉〜支払条件〜
// 船積み〜通関・クレーム〜リピート注文までの想定会話(30往復・60文)を5つの場面に分け、
// 聞き取り・読解・発音などの問題にする。レベルの順番とは関係なく、いつでも始められる。
(() => {
  const SPEAKERS = {
    A: { name: "王经理", role: "中国の輸入者(上海)", icon: "👩‍💼" },
    B: { name: "田中", role: "日本の輸出者(あなた)", icon: "🧑" },
  };

  // [話し手, 中国語, ピンイン, 日本語訳]
  const SCENES = [
    {
      title: "問い合わせと見積依頼",
      lines: [
        ["A", "田中先生您好,我是上海恒达贸易的王丽,我们对贵公司的保温杯很感兴趣。", "Tiánzhōng xiānsheng nín hǎo, wǒ shì Shànghǎi Héngdá Màoyì de Wáng Lì, wǒmen duì guì gōngsī de bǎowēnbēi hěn gǎn xìngqù.", "田中さん、こんにちは。上海恒達貿易の王麗です。御社の保温ボトルにとても興味があります。"],
        ["B", "王经理您好,谢谢您的询价。请问您主要对哪个系列感兴趣?", "Wáng jīnglǐ nín hǎo, xièxie nín de xúnjià. Qǐngwèn nín zhǔyào duì nǎge xìliè gǎn xìngqù?", "王マネージャー、こんにちは。お問い合わせありがとうございます。主にどのシリーズにご興味がありますか?"],
        ["A", "我们想要五百毫升的不锈钢款,颜色要白色和黑色。", "Wǒmen xiǎng yào wǔbǎi háoshēng de bùxiùgāng kuǎn, yánsè yào báisè hé hēisè.", "500mlのステンレスタイプで、色は白と黒がほしいです。"],
        ["B", "好的。这款的最小起订量是一千个,每种颜色至少五百个。", "Hǎo de. Zhè kuǎn de zuì xiǎo qǐdìngliàng shì yìqiān ge, měi zhǒng yánsè zhìshǎo wǔbǎi ge.", "承知しました。このタイプの最小注文数量は1000個で、各色500個以上です。"],
        ["A", "没问题。第一批我们打算订三千个。可以先寄样品吗?", "Méi wèntí. Dì yī pī wǒmen dǎsuàn dìng sānqiān ge. Kěyǐ xiān jì yàngpǐn ma?", "問題ありません。初回は3000個注文するつもりです。先にサンプルを送ってもらえますか?"],
        ["B", "可以,我们免费提供两个样品,运费需要贵公司承担。", "Kěyǐ, wǒmen miǎnfèi tígōng liǎng ge yàngpǐn, yùnfèi xūyào guì gōngsī chéngdān.", "はい。サンプル2個は無料ですが、送料は御社のご負担になります。"],
        ["A", "好的,请寄到我们上海的办公室。大概几天能到?", "Hǎo de, qǐng jì dào wǒmen Shànghǎi de bàngōngshì. Dàgài jǐ tiān néng dào?", "わかりました。上海のオフィスに送ってください。何日くらいで届きますか?"],
        ["B", "用国际快递的话,三到五天就能到。", "Yòng guójì kuàidì dehuà, sān dào wǔ tiān jiù néng dào.", "国際宅配便なら3〜5日で届きます。"],
        ["A", "另外,麻烦您发一份正式的报价单给我。", "Lìngwài, máfan nín fā yí fèn zhèngshì de bàojiàdān gěi wǒ.", "それから、正式な見積書を送っていただけますか。"],
        ["B", "好的。您需要离岸价还是到岸价?", "Hǎo de. Nín xūyào lí'ànjià háishi dào'ànjià?", "承知しました。FOB価格とCIF価格、どちらがよろしいですか?"],
        ["A", "请报到岸价,目的港是上海。", "Qǐng bào dào'ànjià, mùdìgǎng shì Shànghǎi.", "CIF価格でお願いします。仕向港は上海です。"],
        ["B", "明白,我明天把报价单发到您的邮箱。", "Míngbai, wǒ míngtiān bǎ bàojiàdān fā dào nín de yóuxiāng.", "わかりました。明日、見積書をメールでお送りします。"],
      ],
      listen: ["王マネージャーが興味を持っている商品は?", "500mlのステンレス製保温ボトル(白と黒)", "1Lのガラス製ボトル(赤と青)", "プラスチックの弁当箱"],
      read: [
        ["このタイプの最小注文数量は?", "合計1000個(各色500個以上)", "合計3000個", "各色1000個"],
        ["見積もりはどの条件で出しますか?", "CIF上海(到岸価)", "FOB横浜(離岸価)", "工場渡し"],
      ],
      drills: {
        listening: ["这款的最小起订量是一千个", "zhè kuǎn de zuì xiǎo qǐdìngliàng shì yìqiān ge", "このタイプの最小注文数量は1000個です", "このタイプの在庫は1000個です", "このタイプは1000円です"],
        translate: ["可以先寄样品吗?", "kěyǐ xiān jì yàngpǐn ma?", "先にサンプルを送ってもらえますか?", "先に代金を払ってもいいですか?", "サンプルは有料ですか?"],
        speaking: ["我明天把报价单发到您的邮箱", "wǒ míngtiān bǎ bàojiàdān fā dào nín de yóuxiāng", "明日、見積書をメールでお送りします"],
        writing: ["問い合わせ(価格の照会)", "xúnjià", "询价"],
        pinyin: ["报价单", "見積書", "bàojiàdān"],
      },
    },
    {
      title: "価格交渉",
      lines: [
        ["A", "田中先生,报价单收到了。每个十二美元,比我们的预算高了一些。", "Tiánzhōng xiānsheng, bàojiàdān shōudào le. Měi ge shí'èr měiyuán, bǐ wǒmen de yùsuàn gāo le yìxiē.", "田中さん、見積書を受け取りました。1個12ドルは、こちらの予算より少し高いですね。"],
        ["B", "我们用的是日本的真空技术,保温效果可以保持十二个小时。", "Wǒmen yòng de shì Rìběn de zhēnkōng jìshù, bǎowēn xiàoguǒ kěyǐ bǎochí shí'èr ge xiǎoshí.", "日本の真空技術を使っていて、保温効果は12時間続きます。"],
        ["A", "质量我们很认可。但是市场竞争很激烈,能不能降到十美元?", "Zhìliàng wǒmen hěn rènkě. Dànshì shìchǎng jìngzhēng hěn jīliè, néng bu néng jiàng dào shí měiyuán?", "品質は高く評価しています。ただ市場の競争が激しいので、10ドルまで下げられませんか?"],
        ["B", "十美元的话我们没有利润。如果订五千个,我们可以给十一美元。", "Shí měiyuán dehuà wǒmen méiyǒu lìrùn. Rúguǒ dìng wǔqiān ge, wǒmen kěyǐ gěi shíyī měiyuán.", "10ドルでは利益が出ません。5000個ご注文いただけるなら11ドルにできます。"],
        ["A", "五千个的话,库存压力比较大。三千个十一美元可以吗?", "Wǔqiān ge dehuà, kùcún yālì bǐjiào dà. Sānqiān ge shíyī měiyuán kěyǐ ma?", "5000個だと在庫の負担が大きいです。3000個で11ドルはどうですか?"],
        ["B", "这样吧,三千个的价格是十一点五美元,第二批订单再给您十一美元。", "Zhèyàng ba, sānqiān ge de jiàgé shì shíyī diǎn wǔ měiyuán, dì èr pī dìngdān zài gěi nín shíyī měiyuán.", "では、3000個は11.5ドルで、2回目のご注文から11ドルにしましょう。"],
        ["A", "那包装可以改成中文的吗?我们要在国内销售。", "Nà bāozhuāng kěyǐ gǎi chéng Zhōngwén de ma? Wǒmen yào zài guónèi xiāoshòu.", "では、パッケージを中国語にできますか?中国国内で販売するので。"],
        ["B", "可以,中文包装要另外收每个零点三美元的费用。", "Kěyǐ, Zhōngwén bāozhuāng yào lìngwài shōu měi ge líng diǎn sān měiyuán de fèiyòng.", "できます。中国語パッケージは別途1個0.3ドルの費用がかかります。"],
        ["A", "能不能免掉这个费用?就当是第一次合作的优惠。", "Néng bu néng miǎndiào zhège fèiyòng? Jiù dàng shì dì yī cì hézuò de yōuhuì.", "その費用をなしにできませんか?初めての取引のサービスということで。"],
        ["B", "好吧,第一批的中文包装费我们来承担。", "Hǎo ba, dì yī pī de Zhōngwén bāozhuāngfèi wǒmen lái chéngdān.", "わかりました。初回分の中国語パッケージ代は当社が負担します。"],
        ["A", "太感谢了。交货期大概多久?", "Tài gǎnxiè le. Jiāohuòqī dàgài duō jiǔ?", "ありがとうございます。納期はどのくらいですか?"],
        ["B", "收到定金以后四十五天可以交货。", "Shōudào dìngjīn yǐhòu sìshíwǔ tiān kěyǐ jiāohuò.", "手付金を受け取ってから45日で納品できます。"],
      ],
      listen: ["最初の見積もりの単価はいくらでしたか?", "12ドル", "10ドル", "11ドル"],
      read: [
        ["3000個の単価は最終的にいくらになりましたか?", "11.5ドル(2回目の注文から11ドル)", "10ドル", "12ドルのまま"],
        ["中国語パッケージの費用はどうなりましたか?", "初回分は田中さんの会社が負担する", "買い手が1個0.3ドル払う", "中国語パッケージは作らない"],
      ],
      drills: {
        listening: ["能不能降到十美元?", "néng bu néng jiàng dào shí měiyuán?", "10ドルまで下げられませんか?", "10ドル上げてもいいですか?", "10個まで減らせますか?"],
        translate: ["十美元的话我们没有利润", "shí měiyuán dehuà wǒmen méiyǒu lìrùn", "10ドルでは利益が出ません", "10ドルなら喜んで売ります", "10ドルは送料込みです"],
        speaking: ["收到定金以后四十五天可以交货", "shōudào dìngjīn yǐhòu sìshíwǔ tiān kěyǐ jiāohuò", "手付金を受け取ってから45日で納品できます"],
        writing: ["納期", "jiāohuòqī", "交货期"],
        pinyin: ["利润", "利益", "lìrùn"],
      },
    },
    {
      title: "支払条件と契約",
      lines: [
        ["A", "关于付款方式,我们希望用信用证。", "Guānyú fùkuǎn fāngshì, wǒmen xīwàng yòng xìnyòngzhèng.", "支払方法については、信用状(L/C)を希望します。"],
        ["B", "第一次合作,金额也不大,我们更希望用电汇。", "Dì yī cì hézuò, jīn'é yě bú dà, wǒmen gèng xīwàng yòng diànhuì.", "初めての取引で金額も大きくないので、電信送金(T/T)のほうがありがたいです。"],
        ["A", "电汇的话,具体条件是什么?", "Diànhuì dehuà, jùtǐ tiáojiàn shì shénme?", "T/Tなら、具体的な条件は?"],
        ["B", "签合同后先付百分之三十的定金,剩下的百分之七十见提单复印件后支付。", "Qiān hétong hòu xiān fù bǎi fēn zhī sānshí de dìngjīn, shèngxia de bǎi fēn zhī qīshí jiàn tídān fùyìnjiàn hòu zhīfù.", "契約後にまず30%の手付金、残り70%はB/Lのコピーを確認してからのお支払いです。"],
        ["A", "可以接受。尾款我们在收到提单复印件后五个工作日内付清。", "Kěyǐ jiēshòu. Wěikuǎn wǒmen zài shōudào tídān fùyìnjiàn hòu wǔ ge gōngzuòrì nèi fùqīng.", "受け入れます。残金はB/Lのコピーを受け取ってから5営業日以内に支払います。"],
        ["B", "好的。汇款手续费双方各自承担,可以吗?", "Hǎo de. Huìkuǎn shǒuxùfèi shuāngfāng gèzì chéngdān, kěyǐ ma?", "わかりました。送金手数料はそれぞれが負担、でよろしいですか?"],
        ["A", "没问题。那合同由哪一方起草?", "Méi wèntí. Nà hétong yóu nǎ yì fāng qǐcǎo?", "問題ありません。では契約書はどちらが作りますか?"],
        ["B", "我们来起草吧,中文和日文各一份,两种文本具有同等效力。", "Wǒmen lái qǐcǎo ba, Zhōngwén hé Rìwén gè yí fèn, liǎng zhǒng wénběn jùyǒu tóngděng xiàolì.", "当社で作ります。中国語版と日本語版を1部ずつ作り、どちらも同じ効力とします。"],
        ["A", "好的。质量标准和验货方式也请写清楚。", "Hǎo de. Zhìliàng biāozhǔn hé yànhuò fāngshì yě qǐng xiě qīngchu.", "わかりました。品質基準と検品方法もはっきり書いてください。"],
        ["B", "当然。货物到港后十天内,如有质量问题可以提出索赔。", "Dāngrán. Huòwù dào gǎng hòu shí tiān nèi, rú yǒu zhìliàng wèntí kěyǐ tíchū suǒpéi.", "もちろんです。貨物が港に着いてから10日以内なら、品質問題があればクレームを出せます。"],
        ["A", "明白了。合同发过来以后,我们尽快盖章。", "Míngbai le. Hétong fā guòlai yǐhòu, wǒmen jǐnkuài gàizhāng.", "わかりました。契約書が届いたら、すぐに押印します。"],
        ["B", "谢谢,定金到账后我们马上安排生产。", "Xièxie, dìngjīn dàozhàng hòu wǒmen mǎshàng ānpái shēngchǎn.", "ありがとうございます。手付金が入金されたらすぐに生産を手配します。"],
      ],
      listen: ["最終的に決まった支払方法は?", "電信送金(T/T)", "信用状(L/C)", "現金払い"],
      read: [
        ["残りの70%はいつ支払いますか?", "B/Lのコピーを受け取ってから5営業日以内", "契約書に署名したとき", "貨物が届いて30日後"],
        ["品質クレームを出せる期限は?", "貨物が港に着いてから10日以内", "契約から10日以内", "1か月以内"],
      ],
      drills: {
        listening: ["我们更希望用电汇", "wǒmen gèng xīwàng yòng diànhuì", "電信送金(T/T)のほうがありがたいです", "信用状のほうがありがたいです", "現金のほうがありがたいです"],
        translate: ["汇款手续费双方各自承担", "huìkuǎn shǒuxùfèi shuāngfāng gèzì chéngdān", "送金手数料はそれぞれが負担する", "送金手数料は買い手が全部負担する", "送金手数料はかからない"],
        speaking: ["签合同后先付百分之三十的定金", "qiān hétong hòu xiān fù bǎi fēn zhī sānshí de dìngjīn", "契約後に、まず30%の手付金をお支払いください"],
        writing: ["電信送金(T/T)", "diànhuì", "电汇"],
        pinyin: ["索赔", "クレーム(損害賠償の請求)", "suǒpéi"],
      },
    },
    {
      title: "生産・船積み・書類",
      lines: [
        ["A", "田中先生,生产进度怎么样了?", "Tiánzhōng xiānsheng, shēngchǎn jìndù zěnmeyàng le?", "田中さん、生産の進み具合はどうですか?"],
        ["B", "已经完成了百分之八十,下周五可以全部完成。", "Yǐjīng wánchéng le bǎi fēn zhī bāshí, xià zhōuwǔ kěyǐ quánbù wánchéng.", "もう80%終わっていて、来週金曜にはすべて完成します。"],
        ["A", "太好了。舱位订好了吗?", "Tài hǎo le. Cāngwèi dìng hǎo le ma?", "よかった。船のスペースは予約できましたか?"],
        ["B", "订好了,是从横滨港出发的船,预计二十号开船,二十三号到上海。", "Dìng hǎo le, shì cóng Héngbīn gǎng chūfā de chuán, yùjì èrshí hào kāichuán, èrshísān hào dào Shànghǎi.", "予約済みです。横浜港を出る船で、20日に出港、23日に上海着の予定です。"],
        ["A", "用的是二十尺的集装箱吗?", "Yòng de shì èrshí chǐ de jízhuāngxiāng ma?", "20フィートコンテナを使いますか?"],
        ["B", "是的,三千个保温杯正好装一个二十尺柜。", "Shì de, sānqiān ge bǎowēnbēi zhènghǎo zhuāng yí ge èrshí chǐ guì.", "はい、保温ボトル3000個でちょうど20フィートコンテナ1本分です。"],
        ["A", "清关需要的单据,请提前发电子版给我们确认。", "Qīngguān xūyào de dānjù, qǐng tíqián fā diànzǐbǎn gěi wǒmen quèrèn.", "通関に必要な書類は、事前に電子版を送って確認させてください。"],
        ["B", "好的,有商业发票、装箱单、提单,还有原产地证明。", "Hǎo de, yǒu shāngyè fāpiào, zhuāngxiāngdān, tídān, hái yǒu yuánchǎndì zhèngmíng.", "わかりました。インボイス、パッキングリスト、B/L、それに原産地証明書です。"],
        ["A", "原产地证明很重要,可以享受关税优惠。", "Yuánchǎndì zhèngmíng hěn zhòngyào, kěyǐ xiǎngshòu guānshuì yōuhuì.", "原産地証明書は大事です。関税の優遇が受けられますから。"],
        ["B", "明白,我们会办好原产地证明,和提单一起寄出。", "Míngbai, wǒmen huì bàn hǎo yuánchǎndì zhèngmíng, hé tídān yìqǐ jìchū.", "承知しました。原産地証明書を用意して、B/Lと一緒に送ります。"],
        ["A", "保险由你们这边买吧?", "Bǎoxiǎn yóu nǐmen zhèbiān mǎi ba?", "保険はそちらで掛けてもらえますよね?"],
        ["B", "对,到岸价包括保险,我们按发票金额的百分之一百一十投保。", "Duì, dào'ànjià bāokuò bǎoxiǎn, wǒmen àn fāpiào jīn'é de bǎi fēn zhī yìbǎi yīshí tóubǎo.", "はい。CIF価格には保険が含まれるので、インボイス金額の110%で付保します。"],
      ],
      listen: ["船は上海にいつ着く予定ですか?", "23日", "20日", "来週金曜日"],
      read: [
        ["原産地証明書が大事な理由は?", "関税の優遇が受けられるから", "保険の請求に必要だから", "コンテナを予約するのに必要だから"],
        ["保険について正しいものは?", "売り手がインボイス金額の110%で付保する", "買い手が自分で保険を掛ける", "保険は掛けない"],
      ],
      drills: {
        listening: ["舱位订好了吗?", "cāngwèi dìng hǎo le ma?", "船のスペースは予約できましたか?", "倉庫は見つかりましたか?", "書類はそろいましたか?"],
        translate: ["三千个保温杯正好装一个二十尺柜", "sānqiān ge bǎowēnbēi zhènghǎo zhuāng yí ge èrshí chǐ guì", "保温ボトル3000個でちょうど20フィートコンテナ1本分", "保温ボトル3000個はコンテナ2本必要", "保温ボトルは20個ずつ箱に入れる"],
        speaking: ["我们会办好原产地证明,和提单一起寄出", "wǒmen huì bàn hǎo yuánchǎndì zhèngmíng, hé tídān yìqǐ jìchū", "原産地証明書を用意して、B/Lと一緒に送ります"],
        writing: ["コンテナ", "jízhuāngxiāng", "集装箱"],
        pinyin: ["投保", "保険を掛ける", "tóubǎo"],
      },
    },
    {
      title: "通関・クレーム・リピート注文",
      lines: [
        ["A", "田中先生,货已经到上海了,但是被海关抽中查验了。", "Tiánzhōng xiānsheng, huò yǐjīng dào Shànghǎi le, dànshì bèi hǎiguān chōuzhòng cháyàn le.", "田中さん、貨物は上海に着きましたが、税関の検査対象に選ばれました。"],
        ["B", "需要我们提供什么资料吗?", "Xūyào wǒmen tígōng shénme zīliào ma?", "こちらから何か資料を出す必要はありますか?"],
        ["A", "海关要产品的成分说明,证明是食品级的不锈钢。", "Hǎiguān yào chǎnpǐn de chéngfèn shuōmíng, zhèngmíng shì shípǐnjí de bùxiùgāng.", "税関が、食品用のステンレスであることを示す成分説明を求めています。"],
        ["B", "我今天就把检测报告发给您。", "Wǒ jīntiān jiù bǎ jiǎncè bàogào fā gěi nín.", "今日中に検査報告書をお送りします。"],
        ["A", "谢谢。还有一个问题,开箱后发现有二十个杯子有凹痕。", "Xièxie. Hái yǒu yí ge wèntí, kāi xiāng hòu fāxiàn yǒu èrshí ge bēizi yǒu āohén.", "ありがとうございます。もう一つ、開梱したら20個のボトルにへこみがありました。"],
        ["B", "非常抱歉。请拍照片给我们,我们会向保险公司索赔。", "Fēicháng bàoqiàn. Qǐng pāi zhàopiàn gěi wǒmen, wǒmen huì xiàng bǎoxiǎn gōngsī suǒpéi.", "大変申し訳ありません。写真を送ってください。保険会社に保険金を請求します。"],
        ["A", "好的。这二十个能补发吗?", "Hǎo de. Zhè èrshí ge néng bǔfā ma?", "わかりました。その20個は補送してもらえますか?"],
        ["B", "可以,我们和第二批货一起免费补发。", "Kěyǐ, wǒmen hé dì èr pī huò yìqǐ miǎnfèi bǔfā.", "はい、2回目の貨物と一緒に無料で補送します。"],
        ["A", "其实我们正想谈第二批订单。这次想订五千个。", "Qíshí wǒmen zhèng xiǎng tán dì èr pī dìngdān. Zhè cì xiǎng dìng wǔqiān ge.", "実はちょうど2回目の注文の話をしたかったんです。今回は5000個注文したいです。"],
        ["B", "太好了!按照之前的约定,单价是十一美元。", "Tài hǎo le! Ànzhào zhīqián de yuēdìng, dānjià shì shíyī měiyuán.", "ありがとうございます!前回の約束どおり、単価は11ドルです。"],
        ["A", "好的,这次付款也按照上次的条件。", "Hǎo de, zhè cì fùkuǎn yě ànzhào shàng cì de tiáojiàn.", "わかりました。今回の支払いも前回と同じ条件で。"],
        ["B", "没问题,我马上准备合同。期待我们长期合作!", "Méi wèntí, wǒ mǎshàng zhǔnbèi hétong. Qīdài wǒmen chángqī hézuò!", "問題ありません。すぐ契約書を用意します。末長いお取引をよろしくお願いします!"],
      ],
      listen: ["税関が求めた資料は?", "食品用ステンレスであることを示す成分説明", "原産地証明書の原本", "追加の関税の支払い"],
      read: [
        ["へこみがあった20個はどうしますか?", "2回目の貨物と一緒に無料で補送する", "代金を返金する", "値引きで対応する"],
        ["2回目の注文の単価は?", "11ドル", "11.5ドル", "12ドル"],
      ],
      drills: {
        listening: ["货被海关抽中查验了", "huò bèi hǎiguān chōuzhòng cháyàn le", "貨物が税関の検査対象に選ばれました", "貨物が税関を通過しました", "貨物が港で紛失しました"],
        translate: ["我们会向保险公司索赔", "wǒmen huì xiàng bǎoxiǎn gōngsī suǒpéi", "保険会社に保険金を請求します", "保険会社に保険を解約します", "保険会社から連絡がありました"],
        speaking: ["我们和第二批货一起免费补发", "wǒmen hé dì èr pī huò yìqǐ miǎnfèi bǔfā", "2回目の貨物と一緒に無料で補送します"],
        writing: ["補送する(足りない分を送る)", "bǔfā", "补发"],
        pinyin: ["检测报告", "検査報告書", "jiǎncè bàogào"],
      },
    },
  ];

  const choices = (correct, ...wrong) => [{ text: correct, correct: true }, ...wrong.map((text) => ({ text, correct: false }))];
  const strip = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  const lessons = SCENES.map((scene, i) => {
    const d = scene.drills;
    const dialogue = { speakers: SPEAKERS, lines: scene.lines };
    return {
      id: `u33l${i + 1}`,
      title: `場面${i + 1}: ${scene.title}`,
      exercises: [
        Object.assign({ type: "dialogue_listening", question: scene.listen[0], choices: choices(...scene.listen.slice(1)) }, dialogue),
        { type: "listening_choice", audioText: d.listening[0], pinyin: d.listening[1], prompt: "今聞こえた文の意味はどれ?", choices: choices(...d.listening.slice(2)) },
        { type: "translate_choice", hanzi: d.translate[0], pinyin: d.translate[1], prompt: "この文の意味は?", choices: choices(...d.translate.slice(2)) },
        { type: "speaking", hanzi: d.speaking[0], pinyin: d.speaking[1], meaning: d.speaking[2], prompt: "田中さんになって言ってみましょう" },
        { type: "writing_cn", meaning: d.writing[0], pinyinHint: d.writing[1], answer: d.writing[2] },
        { type: "writing_pinyin", hanzi: d.pinyin[0], meaningHint: d.pinyin[1], answer: strip(d.pinyin[2]), answerToned: d.pinyin[2] },
        ...scene.read.map((q) => Object.assign({ type: "dialogue_reading", question: q[0], choices: choices(...q.slice(1)) }, dialogue)),
      ],
    };
  });

  // ロールプレイ: 相手のセリフを聞き取り → 田中としてこたえる、を6回
  const pick = (s, n) => SCENES[s].lines[n];
  const ROLEPLAY = [
    [0, 10, "CIF価格でお願いします。仕向港は上海です。", "FOB価格でお願いします。", "見積もりは不要です。", 11],
    [1, 2, "10ドルまで下げられませんか?", "12ドルで買います。", "品質に不満があります。", 3],
    [2, 0, "支払方法は信用状(L/C)を希望します。", "支払いは現金でします。", "支払いは来年にします。", 1],
    [3, 2, "船のスペースは予約できましたか?", "コンテナは何本ですか?", "保険は掛けましたか?", 3],
    [4, 4, "開梱したら20個にへこみがありました。", "20個足りませんでした。", "20日遅れて届きました。", 5],
    [4, 8, "今回は5000個注文したいです。", "今回は注文を見送ります。", "今回は500個だけにします。", 11],
  ];
  const roleplay = [];
  ROLEPLAY.forEach(([s, a, ja, w1, w2, b]) => {
    const partner = pick(s, a);
    const mine = pick(s, b);
    roleplay.push({ type: "listening_choice", audioText: partner[1], pinyin: partner[2], prompt: "王経理は何と言いましたか?", choices: choices(ja, w1, w2) });
    roleplay.push({ type: "speaking", hanzi: mine[1], pinyin: mine[2], meaning: mine[3], prompt: "田中さんとしてこたえましょう" });
  });
  lessons.push({ id: "u33l6", title: "ロールプレイ: 田中としてこたえる", exercises: roleplay });

  if (!UNITS.some((u) => u.id === "u33")) {
    UNITS.push({
      id: "u33",
      title: "貿易実務 30ラリー特訓",
      description: "問い合わせ→価格交渉→支払条件→船積み→通関・クレーム→リピート注文まで、30往復の想定会話で通しで練習",
      icon: "🚢",
      special: true, // レベルの順番に関係なく、いつでも始められる特別コース
      lessons,
    });
  }
  window.TRADE30_SCENES = SCENES;
})();
