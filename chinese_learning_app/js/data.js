// 中国語学習アプリ - コンテンツデータ
// 各ユニットは複数のレッスンを持ち、各レッスンは4技能(聞く・話す・読む・書く)の
// エクササイズを組み合わせて構成される。

const UNITS = [
  {
    id: "u1",
    title: "あいさつと自己紹介",
    description: "基本のあいさつ表現を身につけよう",
    icon: "👋",
    lessons: [
      {
        id: "u1l1",
        title: "基本のあいさつ",
        exercises: [
          {
            type: "listening_choice",
            audioText: "你好",
            prompt: "今聞こえた言葉の意味はどれ?",
            choices: [
              { text: "こんにちは", correct: true },
              { text: "さようなら", correct: false },
              { text: "ありがとう", correct: false },
            ],
          },
          {
            type: "translate_choice",
            hanzi: "谢谢",
            pinyin: "xièxie",
            prompt: "この言葉の意味は?",
            choices: [
              { text: "ありがとう", correct: true },
              { text: "すみません", correct: false },
              { text: "こんにちは", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "你好",
            pinyin: "nǐ hǎo",
            meaning: "こんにちは",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "listening_choice",
            audioText: "再见",
            prompt: "今聞こえた言葉の意味はどれ?",
            choices: [
              { text: "さようなら", correct: true },
              { text: "おやすみなさい", correct: false },
              { text: "ありがとう", correct: false },
            ],
          },
          {
            type: "writing_cn",
            meaning: "こんにちは",
            pinyinHint: "nǐ hǎo",
            answer: "你好",
          },
          {
            type: "reading",
            passage: "你好!谢谢你。再见!",
            passagePinyin: "Nǐ hǎo! Xièxie nǐ. Zàijiàn!",
            question: "この文章に含まれていない表現はどれ?",
            choices: [
              { text: "对不起 (すみません)", correct: true },
              { text: "你好 (こんにちは)", correct: false },
              { text: "谢谢 (ありがとう)", correct: false },
            ],
          },
        ],
      },
      {
        id: "u1l2",
        title: "自己紹介をする",
        exercises: [
          {
            type: "listening_choice",
            audioText: "我叫田中",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "私は田中といいます", correct: true },
              { text: "私は日本人です", correct: false },
              { text: "あなたの名前は何ですか", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "我叫田中",
            pinyin: "wǒ jiào Tiánzhōng",
            meaning: "私は田中といいます",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "translate_choice",
            hanzi: "我是日本人",
            pinyin: "wǒ shì Rìběnrén",
            prompt: "この文の意味は?",
            choices: [
              { text: "私は日本人です", correct: true },
              { text: "私は中国人です", correct: false },
              { text: "あなたは日本人ですか", correct: false },
            ],
          },
          {
            type: "writing_pinyin",
            hanzi: "很高兴认识你",
            meaningHint: "お会いできて嬉しいです",
            answer: "hen gaoxing renshi ni",
            answerToned: "hěn gāoxìng rènshi nǐ",
          },
          {
            type: "reading",
            passage: "我叫田中。我是日本人。很高兴认识你。",
            passagePinyin: "Wǒ jiào Tiánzhōng. Wǒ shì Rìběnrén. Hěn gāoxìng rènshi nǐ.",
            question: "この人はどこの国の人ですか?",
            choices: [
              { text: "日本人", correct: true },
              { text: "中国人", correct: false },
              { text: "アメリカ人", correct: false },
            ],
          },
          {
            type: "writing_cn",
            meaning: "私は日本人です",
            pinyinHint: "wǒ shì Rìběnrén",
            answer: "我是日本人",
          },
        ],
      },
      {
        id: "u1l3",
        title: "相手に質問する",
        exercises: [
          {
            type: "listening_choice",
            audioText: "你叫什么名字",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "あなたの名前は何ですか", correct: true },
              { text: "あなたは元気ですか", correct: false },
              { text: "あなたはどこの国の人ですか", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "你好吗",
            pinyin: "nǐ hǎo ma",
            meaning: "お元気ですか",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "translate_choice",
            hanzi: "你是哪国人",
            pinyin: "nǐ shì nǎ guó rén",
            prompt: "この文の意味は?",
            choices: [
              { text: "あなたはどこの国の人ですか", correct: true },
              { text: "あなたの名前は何ですか", correct: false },
              { text: "あなたは何歳ですか", correct: false },
            ],
          },
          {
            type: "writing_cn",
            meaning: "お元気ですか",
            pinyinHint: "nǐ hǎo ma",
            answer: "你好吗",
          },
          {
            type: "reading",
            passage: "A: 你好吗? B: 我很好,谢谢。你呢? A: 我也很好。",
            passagePinyin: "A: Nǐ hǎo ma? B: Wǒ hěn hǎo, xièxie. Nǐ ne? A: Wǒ yě hěn hǎo.",
            question: "Bさんの調子はどうですか?",
            choices: [
              { text: "良い", correct: true },
              { text: "悪い", correct: false },
              { text: "分からない", correct: false },
            ],
          },
          {
            type: "listening_choice",
            audioText: "我很好",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "私は元気です", correct: true },
              { text: "私は疲れています", correct: false },
              { text: "私は日本人です", correct: false },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "u2",
    title: "数字と時間",
    description: "数字・年齢・時間の表現を学ぼう",
    icon: "🔢",
    lessons: [
      {
        id: "u2l1",
        title: "数字 1〜10",
        exercises: [
          {
            type: "listening_choice",
            audioText: "三",
            prompt: "今聞こえた数字はどれ?",
            choices: [
              { text: "3", correct: true },
              { text: "2", correct: false },
              { text: "8", correct: false },
            ],
          },
          {
            type: "translate_choice",
            hanzi: "七",
            pinyin: "qī",
            prompt: "この漢字が表す数字は?",
            choices: [
              { text: "7", correct: true },
              { text: "9", correct: false },
              { text: "1", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "一,二,三,四,五",
            pinyin: "yī, èr, sān, sì, wǔ",
            meaning: "1、2、3、4、5",
            prompt: "声に出して数字を読んでみましょう",
          },
          {
            type: "writing_cn",
            meaning: "10 (じゅう)",
            pinyinHint: "shí",
            answer: "十",
          },
          {
            type: "listening_choice",
            audioText: "九",
            prompt: "今聞こえた数字はどれ?",
            choices: [
              { text: "9", correct: true },
              { text: "6", correct: false },
              { text: "5", correct: false },
            ],
          },
          {
            type: "writing_pinyin",
            hanzi: "六",
            meaningHint: "数字の6",
            answer: "liu",
            answerToned: "liù",
          },
        ],
      },
      {
        id: "u2l2",
        title: "年齢を聞く",
        exercises: [
          {
            type: "listening_choice",
            audioText: "你多大了",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "あなたは何歳ですか", correct: true },
              { text: "今何時ですか", correct: false },
              { text: "あなたの名前は?", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "我二十岁",
            pinyin: "wǒ èrshí suì",
            meaning: "私は20歳です",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "translate_choice",
            hanzi: "我三十岁了",
            pinyin: "wǒ sānshí suì le",
            prompt: "この文の意味は?",
            choices: [
              { text: "私は30歳になりました", correct: true },
              { text: "私は13歳です", correct: false },
              { text: "私は300円持っています", correct: false },
            ],
          },
          {
            type: "reading",
            passage: "A: 你多大了? B: 我二十五岁了。你呢? A: 我二十八岁。",
            passagePinyin: "A: Nǐ duō dà le? B: Wǒ èrshíwǔ suì le. Nǐ ne? A: Wǒ èrshíbā suì.",
            question: "Bさんは何歳ですか?",
            choices: [
              { text: "25歳", correct: true },
              { text: "28歳", correct: false },
              { text: "20歳", correct: false },
            ],
          },
          {
            type: "writing_cn",
            meaning: "私は20歳です",
            pinyinHint: "wǒ èrshí suì",
            answer: "我二十岁",
          },
          {
            type: "listening_choice",
            audioText: "二十八",
            prompt: "今聞こえた数字はどれ?",
            choices: [
              { text: "28", correct: true },
              { text: "82", correct: false },
              { text: "18", correct: false },
            ],
          },
        ],
      },
      {
        id: "u2l3",
        title: "時間と曜日",
        exercises: [
          {
            type: "listening_choice",
            audioText: "现在几点",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "今何時ですか", correct: true },
              { text: "今日は何曜日ですか", correct: false },
              { text: "何時に会いますか", correct: false },
            ],
          },
          {
            type: "translate_choice",
            hanzi: "星期一",
            pinyin: "xīngqīyī",
            prompt: "この言葉の意味は?",
            choices: [
              { text: "月曜日", correct: true },
              { text: "日曜日", correct: false },
              { text: "1月", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "现在三点",
            pinyin: "xiànzài sān diǎn",
            meaning: "今3時です",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "writing_cn",
            meaning: "日曜日",
            pinyinHint: "xīngqītiān",
            answer: "星期天",
          },
          {
            type: "reading",
            passage: "今天是星期一。现在是早上八点。",
            passagePinyin: "Jīntiān shì xīngqīyī. Xiànzài shì zǎoshang bā diǎn.",
            question: "今日は何曜日ですか?",
            choices: [
              { text: "月曜日", correct: true },
              { text: "日曜日", correct: false },
              { text: "土曜日", correct: false },
            ],
          },
          {
            type: "writing_pinyin",
            hanzi: "星期五",
            meaningHint: "金曜日",
            answer: "xingqiwu",
            answerToned: "xīngqīwǔ",
          },
        ],
      },
    ],
  },
  {
    id: "u3",
    title: "家族と友達",
    description: "家族の呼び方や紹介の仕方を学ぼう",
    icon: "👨‍👩‍👧‍👦",
    lessons: [
      {
        id: "u3l1",
        title: "家族の呼び方",
        exercises: [
          {
            type: "listening_choice",
            audioText: "爸爸",
            prompt: "今聞こえた言葉の意味はどれ?",
            choices: [
              { text: "お父さん", correct: true },
              { text: "お母さん", correct: false },
              { text: "お兄さん", correct: false },
            ],
          },
          {
            type: "translate_choice",
            hanzi: "妈妈",
            pinyin: "māma",
            prompt: "この言葉の意味は?",
            choices: [
              { text: "お母さん", correct: true },
              { text: "妹", correct: false },
              { text: "お父さん", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "哥哥,姐姐,弟弟,妹妹",
            pinyin: "gēge, jiějie, dìdi, mèimei",
            meaning: "兄、姉、弟、妹",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "writing_cn",
            meaning: "お父さん",
            pinyinHint: "bàba",
            answer: "爸爸",
          },
          {
            type: "listening_choice",
            audioText: "姐姐",
            prompt: "今聞こえた言葉の意味はどれ?",
            choices: [
              { text: "お姉さん", correct: true },
              { text: "妹", correct: false },
              { text: "お母さん", correct: false },
            ],
          },
          {
            type: "writing_pinyin",
            hanzi: "弟弟",
            meaningHint: "弟",
            answer: "didi",
            answerToned: "dìdi",
          },
        ],
      },
      {
        id: "u3l2",
        title: "家族について話す",
        exercises: [
          {
            type: "listening_choice",
            audioText: "你家有几口人",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "あなたの家族は何人ですか", correct: true },
              { text: "あなたは何人兄弟ですか", correct: false },
              { text: "あなたの家はどこですか", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "我家有四口人",
            pinyin: "wǒ jiā yǒu sì kǒu rén",
            meaning: "私の家族は4人です",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "translate_choice",
            hanzi: "这是我的爸爸",
            pinyin: "zhè shì wǒ de bàba",
            prompt: "この文の意味は?",
            choices: [
              { text: "これは私の父です", correct: true },
              { text: "これは私の家です", correct: false },
              { text: "これは私の友達です", correct: false },
            ],
          },
          {
            type: "reading",
            passage: "我家有四口人:爸爸、妈妈、姐姐和我。我很喜欢我的家人。",
            passagePinyin: "Wǒ jiā yǒu sì kǒu rén: bàba, māma, jiějie hé wǒ. Wǒ hěn xǐhuan wǒ de jiārén.",
            question: "この人の家族は何人ですか?",
            choices: [
              { text: "4人", correct: true },
              { text: "3人", correct: false },
              { text: "5人", correct: false },
            ],
          },
          {
            type: "writing_cn",
            meaning: "私の家族は4人です",
            pinyinHint: "wǒ jiā yǒu sì kǒu rén",
            answer: "我家有四口人",
          },
          {
            type: "listening_choice",
            audioText: "这是我的妈妈",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "これは私の母です", correct: true },
              { text: "これは私の姉です", correct: false },
              { text: "これは私の先生です", correct: false },
            ],
          },
        ],
      },
      {
        id: "u3l3",
        title: "友達を紹介する",
        exercises: [
          {
            type: "listening_choice",
            audioText: "这是我的朋友",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "これは私の友達です", correct: true },
              { text: "これは私の先生です", correct: false },
              { text: "これは私の家族です", correct: false },
            ],
          },
          {
            type: "translate_choice",
            hanzi: "他是我的同学",
            pinyin: "tā shì wǒ de tóngxué",
            prompt: "この文の意味は?",
            choices: [
              { text: "彼は私のクラスメートです", correct: true },
              { text: "彼は私の先生です", correct: false },
              { text: "彼女は私の姉です", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "她是我的朋友,她很漂亮",
            pinyin: "tā shì wǒ de péngyou, tā hěn piàoliang",
            meaning: "彼女は私の友達で、とても綺麗です",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "writing_cn",
            meaning: "これは私の友達です",
            pinyinHint: "zhè shì wǒ de péngyou",
            answer: "这是我的朋友",
          },
          {
            type: "reading",
            passage: "这是我的朋友,他叫小明。他是中国人,今年二十岁。",
            passagePinyin: "Zhè shì wǒ de péngyou, tā jiào Xiǎomíng. Tā shì Zhōngguórén, jīnnián èrshí suì.",
            question: "小明さんは何歳ですか?",
            choices: [
              { text: "20歳", correct: true },
              { text: "22歳", correct: false },
              { text: "25歳", correct: false },
            ],
          },
          {
            type: "writing_pinyin",
            hanzi: "朋友",
            meaningHint: "友達",
            answer: "pengyou",
            answerToned: "péngyou",
          },
        ],
      },
    ],
  },
  {
    id: "u4",
    title: "日常生活",
    description: "食事・買い物・道案内の表現を学ぼう",
    icon: "🍜",
    lessons: [
      {
        id: "u4l1",
        title: "食事について話す",
        exercises: [
          {
            type: "listening_choice",
            audioText: "我想吃米饭",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "私はご飯が食べたいです", correct: true },
              { text: "私はお茶が飲みたいです", correct: false },
              { text: "私はお腹がいっぱいです", correct: false },
            ],
          },
          {
            type: "translate_choice",
            hanzi: "好吃",
            pinyin: "hǎochī",
            prompt: "この言葉の意味は?",
            choices: [
              { text: "美味しい", correct: true },
              { text: "まずい", correct: false },
              { text: "辛い", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "这个很好吃",
            pinyin: "zhège hěn hǎochī",
            meaning: "これはとても美味しいです",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "writing_cn",
            meaning: "美味しい",
            pinyinHint: "hǎochī",
            answer: "好吃",
          },
          {
            type: "reading",
            passage: "我喜欢吃中国菜。今天我想吃饺子,因为饺子很好吃。",
            passagePinyin: "Wǒ xǐhuan chī Zhōngguó cài. Jīntiān wǒ xiǎng chī jiǎozi, yīnwèi jiǎozi hěn hǎochī.",
            question: "今日食べたいものは何ですか?",
            choices: [
              { text: "餃子", correct: true },
              { text: "ご飯", correct: false },
              { text: "麺", correct: false },
            ],
          },
          {
            type: "listening_choice",
            audioText: "你喜欢吃什么",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "何を食べるのが好きですか", correct: true },
              { text: "何を飲みたいですか", correct: false },
              { text: "お腹が空きましたか", correct: false },
            ],
          },
        ],
      },
      {
        id: "u4l2",
        title: "買い物をする",
        exercises: [
          {
            type: "listening_choice",
            audioText: "这个多少钱",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "これはいくらですか", correct: true },
              { text: "これは何ですか", correct: false },
              { text: "これはどこにありますか", correct: false },
            ],
          },
          {
            type: "translate_choice",
            hanzi: "太贵了",
            pinyin: "tài guì le",
            prompt: "この文の意味は?",
            choices: [
              { text: "高すぎます", correct: true },
              { text: "安すぎます", correct: false },
              { text: "美味しすぎます", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "我要这个",
            pinyin: "wǒ yào zhège",
            meaning: "これをください",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "writing_cn",
            meaning: "いくらですか",
            pinyinHint: "duōshao qián",
            answer: "多少钱",
          },
          {
            type: "reading",
            passage: "A: 这个多少钱? B: 三十块。 A: 太贵了,便宜一点吧。 B: 好的,二十五块。",
            passagePinyin: "A: Zhège duōshao qián? B: Sānshí kuài. A: Tài guì le, piányi yìdiǎn ba. B: Hǎo de, èrshíwǔ kuài.",
            question: "最終的にいくらになりましたか?",
            choices: [
              { text: "25元", correct: true },
              { text: "30元", correct: false },
              { text: "20元", correct: false },
            ],
          },
          {
            type: "writing_pinyin",
            hanzi: "便宜",
            meaningHint: "安い",
            answer: "pianyi",
            answerToned: "piányi",
          },
        ],
      },
      {
        id: "u4l3",
        title: "道案内・交通",
        exercises: [
          {
            type: "listening_choice",
            audioText: "地铁站在哪儿",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "地下鉄の駅はどこですか", correct: true },
              { text: "バス停はどこですか", correct: false },
              { text: "トイレはどこですか", correct: false },
            ],
          },
          {
            type: "translate_choice",
            hanzi: "怎么走",
            pinyin: "zěnme zǒu",
            prompt: "この文の意味は?",
            choices: [
              { text: "どうやって行きますか", correct: true },
              { text: "何時に着きますか", correct: false },
              { text: "どこから来ましたか", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "一直往前走",
            pinyin: "yìzhí wǎng qián zǒu",
            meaning: "まっすぐ進んでください",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "writing_cn",
            meaning: "地下鉄の駅",
            pinyinHint: "dìtiě zhàn",
            answer: "地铁站",
          },
          {
            type: "reading",
            passage: "A: 请问,地铁站怎么走? B: 一直往前走,然后往右转就到了。 A: 谢谢你!",
            passagePinyin: "A: Qǐngwèn, dìtiě zhàn zěnme zǒu? B: Yìzhí wǎng qián zǒu, ránhòu wǎng yòu zhuǎn jiù dào le. A: Xièxie nǐ!",
            question: "地下鉄駅へはどう行けばよいですか?",
            choices: [
              { text: "まっすぐ進んでから右に曲がる", correct: true },
              { text: "まっすぐ進んでから左に曲がる", correct: false },
              { text: "後ろに戻る", correct: false },
            ],
          },
          {
            type: "listening_choice",
            audioText: "往右转",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "右に曲がる", correct: true },
              { text: "左に曲がる", correct: false },
              { text: "まっすぐ進む", correct: false },
            ],
          },
        ],
      },
    ],
  },
];

// スキル(4技能)のメタ情報
const SKILLS = {
  listening: { label: "リスニング", icon: "👂", color: "#1cb0f6" },
  speaking: { label: "スピーキング", icon: "🗣️", color: "#ff4b4b" },
  reading: { label: "リーディング", icon: "📖", color: "#ce82ff" },
  writing: { label: "ライティング", icon: "✍️", color: "#ffc800" },
};

// エクササイズタイプ → スキルの対応
const EXERCISE_SKILL = {
  listening_choice: "listening",
  speaking: "speaking",
  reading: "reading",
  translate_choice: "reading",
  writing_cn: "writing",
  writing_pinyin: "writing",
};
