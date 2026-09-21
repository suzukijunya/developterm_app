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
  {
    id: "u5",
    title: "仕事の基本",
    description: "職業・自己紹介・予定調整などビジネスの基本表現",
    icon: "💼",
    lessons: [
      {
        id: "u5l1",
        title: "職業と会社",
        exercises: [
          {
            type: "listening_choice",
            audioText: "你做什么工作",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "お仕事は何ですか", correct: true },
              { text: "どこの会社ですか", correct: false },
              { text: "何歳ですか", correct: false },
            ],
          },
          {
            type: "translate_choice",
            hanzi: "我在贸易公司工作",
            pinyin: "wǒ zài màoyì gōngsī gōngzuò",
            prompt: "この文の意味は?",
            choices: [
              { text: "貿易会社で働いています", correct: true },
              { text: "貿易会社を経営しています", correct: false },
              { text: "貿易の勉強をしています", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "这是我的名片",
            pinyin: "zhè shì wǒ de míngpiàn",
            meaning: "これは私の名刺です",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "writing_cn",
            meaning: "名刺",
            pinyinHint: "míngpiàn",
            answer: "名片",
          },
          {
            type: "reading",
            passage: "您好,这是我的名片。我在一家贸易公司工作,负责销售。",
            passagePinyin: "Nín hǎo, zhè shì wǒ de míngpiàn. Wǒ zài yì jiā màoyì gōngsī gōngzuò, fùzé xiāoshòu.",
            question: "この人は何を担当していますか?",
            choices: [
              { text: "営業(販売)", correct: true },
              { text: "経理", correct: false },
              { text: "人事", correct: false },
            ],
          },
          {
            type: "listening_choice",
            audioText: "请多关照",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "どうぞよろしくお願いします", correct: true },
              { text: "ありがとうございます", correct: false },
              { text: "お疲れ様です", correct: false },
            ],
          },
        ],
      },
      {
        id: "u5l2",
        title: "自己紹介(ビジネス)",
        exercises: [
          {
            type: "listening_choice",
            audioText: "很荣幸认识您",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "お会いできて光栄です", correct: true },
              { text: "はじめまして", correct: false },
              { text: "お元気ですか", correct: false },
            ],
          },
          {
            type: "translate_choice",
            hanzi: "我负责市场部",
            pinyin: "wǒ fùzé shìchǎng bù",
            prompt: "この文の意味は?",
            choices: [
              { text: "マーケティング部を担当しています", correct: true },
              { text: "営業部で働いています", correct: false },
              { text: "人事部の部長です", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "请多指教",
            pinyin: "qǐng duō zhǐjiào",
            meaning: "ご指導よろしくお願いします",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "writing_pinyin",
            hanzi: "荣幸",
            meaningHint: "光栄",
            answer: "rongxing",
            answerToned: "róngxìng",
          },
          {
            type: "reading",
            passage: "我姓王,是这次项目的负责人。请多多关照。",
            passagePinyin: "Wǒ xìng Wáng, shì zhè cì xiàngmù de fùzé rén. Qǐng duōduō guānzhào.",
            question: "この人はプロジェクトの何ですか?",
            choices: [
              { text: "責任者", correct: true },
              { text: "アシスタント", correct: false },
              { text: "新人", correct: false },
            ],
          },
          {
            type: "writing_cn",
            meaning: "よろしくお願いします",
            pinyinHint: "qǐng duō guānzhào",
            answer: "请多关照",
          },
        ],
      },
      {
        id: "u5l3",
        title: "時間・予定を調整する",
        exercises: [
          {
            type: "listening_choice",
            audioText: "明天你有空吗",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "明日お時間ありますか", correct: true },
              { text: "今日は忙しいですか", correct: false },
              { text: "何時に会いますか", correct: false },
            ],
          },
          {
            type: "translate_choice",
            hanzi: "我们约在下午三点",
            pinyin: "wǒmen yuē zài xiàwǔ sān diǎn",
            prompt: "この文の意味は?",
            choices: [
              { text: "午後3時に約束しましょう", correct: true },
              { text: "午前3時に会議です", correct: false },
              { text: "3日後に会いましょう", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "几点方便",
            pinyin: "jǐ diǎn fāngbiàn",
            meaning: "何時が都合いいですか",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "writing_cn",
            meaning: "都合がいい",
            pinyinHint: "fāngbiàn",
            answer: "方便",
          },
          {
            type: "reading",
            passage: "A: 明天下午你有空吗? B: 有,几点方便? A: 三点怎么样? B: 可以,我们三点见。",
            passagePinyin: "A: Míngtiān xiàwǔ nǐ yǒu kòng ma? B: Yǒu, jǐ diǎn fāngbiàn? A: Sān diǎn zěnmeyàng? B: Kěyǐ, wǒmen sān diǎn jiàn.",
            question: "二人は何時に会う約束をしましたか?",
            choices: [
              { text: "3時", correct: true },
              { text: "2時", correct: false },
              { text: "4時", correct: false },
            ],
          },
          {
            type: "listening_choice",
            audioText: "我们改天再约",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "また日を改めて約束しましょう", correct: true },
              { text: "今すぐ会いましょう", correct: false },
              { text: "約束はキャンセルです", correct: false },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "u6",
    title: "電話とメール",
    description: "電話応対・伝言・メールの基本表現",
    icon: "📞",
    lessons: [
      {
        id: "u6l1",
        title: "電話に出る・かける",
        exercises: [
          {
            type: "listening_choice",
            audioText: "喂,请问王经理在吗",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "もしもし、王マネージャーはいらっしゃいますか", correct: true },
              { text: "もしもし、どちら様ですか", correct: false },
              { text: "もしもし、聞こえますか", correct: false },
            ],
          },
          {
            type: "translate_choice",
            hanzi: "请稍等",
            pinyin: "qǐng shāo děng",
            prompt: "この文の意味は?",
            choices: [
              { text: "少々お待ちください", correct: true },
              { text: "もう一度お願いします", correct: false },
              { text: "またかけ直します", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "我马上帮您转接",
            pinyin: "wǒ mǎshàng bāng nín zhuǎnjiē",
            meaning: "すぐにおつなぎします",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "writing_cn",
            meaning: "少々お待ちください",
            pinyinHint: "qǐng shāo děng",
            answer: "请稍等",
          },
          {
            type: "reading",
            passage: "喂,您好,这里是ABC公司。请问您找哪位?请稍等,我帮您转接。",
            passagePinyin: "Wéi, nín hǎo, zhèlǐ shì ABC gōngsī. Qǐngwèn nín zhǎo nǎ wèi? Qǐng shāo děng, wǒ bāng nín zhuǎnjiē.",
            question: "この会話はどこでの場面ですか?",
            choices: [
              { text: "電話対応", correct: true },
              { text: "レストラン", correct: false },
              { text: "会議", correct: false },
            ],
          },
          {
            type: "listening_choice",
            audioText: "电话占线",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "電話は話し中です", correct: true },
              { text: "電話番号が違います", correct: false },
              { text: "電話が切れました", correct: false },
            ],
          },
        ],
      },
      {
        id: "u6l2",
        title: "伝言を残す",
        exercises: [
          {
            type: "listening_choice",
            audioText: "他现在不在",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "彼は今席を外しています", correct: true },
              { text: "彼はもう帰りました", correct: false },
              { text: "彼は会議中です", correct: false },
            ],
          },
          {
            type: "translate_choice",
            hanzi: "我可以留言吗",
            pinyin: "wǒ kěyǐ liúyán ma",
            prompt: "この文の意味は?",
            choices: [
              { text: "伝言をお願いできますか", correct: true },
              { text: "また電話します", correct: false },
              { text: "メールを送ってもいいですか", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "请他给我回电话",
            pinyin: "qǐng tā gěi wǒ huí diànhuà",
            meaning: "折り返しお電話くださいとお伝えください",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "writing_pinyin",
            hanzi: "留言",
            meaningHint: "伝言",
            answer: "liuyan",
            answerToned: "liúyán",
          },
          {
            type: "reading",
            passage: "对不起,他现在开会,不在座位上。您要留言吗?好的,请转告他给我回电话。",
            passagePinyin: "Duìbuqǐ, tā xiànzài kāihuì, bú zài zuòwèi shàng. Nín yào liúyán ma? Hǎo de, qǐng zhuǎngào tā gěi wǒ huí diànhuà.",
            question: "相手はなぜ電話に出られませんか?",
            choices: [
              { text: "会議中だから", correct: true },
              { text: "外出しているから", correct: false },
              { text: "体調が悪いから", correct: false },
            ],
          },
          {
            type: "writing_cn",
            meaning: "折り返し電話する",
            pinyinHint: "huí diànhuà",
            answer: "回电话",
          },
        ],
      },
      {
        id: "u6l3",
        title: "メールの基本表現",
        exercises: [
          {
            type: "listening_choice",
            audioText: "谢谢您的邮件",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "メールをありがとうございます", correct: true },
              { text: "お電話ありがとうございます", correct: false },
              { text: "ご来社ありがとうございます", correct: false },
            ],
          },
          {
            type: "translate_choice",
            hanzi: "请查收附件",
            pinyin: "qǐng chá shōu fùjiàn",
            prompt: "この文の意味は?",
            choices: [
              { text: "添付ファイルをご確認ください", correct: true },
              { text: "お電話お待ちしております", correct: false },
              { text: "資料を送ってください", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "期待您的回复",
            pinyin: "qídài nín de huífù",
            meaning: "お返事をお待ちしております",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "writing_cn",
            meaning: "添付ファイル",
            pinyinHint: "fùjiàn",
            answer: "附件",
          },
          {
            type: "reading",
            passage: "王经理,您好。附件是本次会议的资料,请查收。如有问题请随时联系我。期待您的回复。",
            passagePinyin: "Wáng jīnglǐ, nín hǎo. Fùjiàn shì běn cì huìyì de zīliào, qǐng chá shōu. Rú yǒu wèntí qǐng suíshí liánxì wǒ. Qídài nín de huífù.",
            question: "このメールに添付されているものは何ですか?",
            choices: [
              { text: "会議資料", correct: true },
              { text: "契約書", correct: false },
              { text: "請求書", correct: false },
            ],
          },
          {
            type: "listening_choice",
            audioText: "如有问题请随时联系我",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "何か問題があればいつでもご連絡ください", correct: true },
              { text: "問題は今のところありません", correct: false },
              { text: "すぐに返信します", correct: false },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "u7",
    title: "会議と商談",
    description: "会議の進行・意見交換・価格交渉の表現",
    icon: "🤝",
    lessons: [
      {
        id: "u7l1",
        title: "会議を始める",
        exercises: [
          {
            type: "listening_choice",
            audioText: "我们开始吧",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "それでは始めましょう", correct: true },
              { text: "もう終わりました", correct: false },
              { text: "少し待ちましょう", correct: false },
            ],
          },
          {
            type: "translate_choice",
            hanzi: "今天的议题是什么",
            pinyin: "jīntiān de yìtí shì shénme",
            prompt: "この文の意味は?",
            choices: [
              { text: "今日の議題は何ですか", correct: true },
              { text: "今日は誰が来ますか", correct: false },
              { text: "会議はいつ終わりますか", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "请大家看一下资料",
            pinyin: "qǐng dàjiā kàn yíxià zīliào",
            meaning: "皆さん資料をご覧ください",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "writing_cn",
            meaning: "議題",
            pinyinHint: "yìtí",
            answer: "议题",
          },
          {
            type: "reading",
            passage: "大家好,今天的会议主要讨论新产品的销售计划。我们先看一下资料。",
            passagePinyin: "Dàjiā hǎo, jīntiān de huìyì zhǔyào tǎolùn xīn chǎnpǐn de xiāoshòu jìhuà. Wǒmen xiān kàn yíxià zīliào.",
            question: "今日の会議で主に話し合う内容は?",
            choices: [
              { text: "新商品の販売計画", correct: true },
              { text: "人事異動", correct: false },
              { text: "来期の予算", correct: false },
            ],
          },
          {
            type: "listening_choice",
            audioText: "会议到这里结束",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "会議はここまでとします", correct: true },
              { text: "会議はまだ続きます", correct: false },
              { text: "会議は延期します", correct: false },
            ],
          },
        ],
      },
      {
        id: "u7l2",
        title: "意見を言う",
        exercises: [
          {
            type: "listening_choice",
            audioText: "我认为这个方案不错",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "この案は良いと思います", correct: true },
              { text: "この案には反対です", correct: false },
              { text: "考え直しましょう", correct: false },
            ],
          },
          {
            type: "translate_choice",
            hanzi: "我有不同的看法",
            pinyin: "wǒ yǒu bùtóng de kànfǎ",
            prompt: "この文の意味は?",
            choices: [
              { text: "私は違う意見を持っています", correct: true },
              { text: "私も賛成です", correct: false },
              { text: "よくわかりません", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "我同意你的意见",
            pinyin: "wǒ tóngyì nǐ de yìjiàn",
            meaning: "あなたの意見に賛成です",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "writing_pinyin",
            hanzi: "看法",
            meaningHint: "意見・見方",
            answer: "kanfa",
            answerToned: "kànfǎ",
          },
          {
            type: "reading",
            passage: "A: 我认为应该先降低成本。 B: 我有不同的看法,我觉得应该先提高质量。",
            passagePinyin: "A: Wǒ rènwéi yīnggāi xiān jiàngdī chéngběn. B: Wǒ yǒu bùtóng de kànfǎ, wǒ juéde yīnggāi xiān tígāo zhìliàng.",
            question: "Bさんの考えは?",
            choices: [
              { text: "品質向上を優先すべき", correct: true },
              { text: "コスト削減を優先すべき", correct: false },
              { text: "両方とも不要", correct: false },
            ],
          },
          {
            type: "writing_cn",
            meaning: "賛成です",
            pinyinHint: "wǒ tóngyì",
            answer: "我同意",
          },
        ],
      },
      {
        id: "u7l3",
        title: "交渉する",
        exercises: [
          {
            type: "listening_choice",
            audioText: "价格可以再商量吗",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "価格はもう少し相談できますか", correct: true },
              { text: "品質はいかがですか", correct: false },
              { text: "納期はいつですか", correct: false },
            ],
          },
          {
            type: "translate_choice",
            hanzi: "这是我们的最终报价",
            pinyin: "zhè shì wǒmen de zuìzhōng bàojià",
            prompt: "この文の意味は?",
            choices: [
              { text: "これが弊社の最終見積もりです", correct: true },
              { text: "これが今回の契約書です", correct: false },
              { text: "これが最新のカタログです", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "我们需要再考虑一下",
            pinyin: "wǒmen xūyào zài kǎolǜ yíxià",
            meaning: "もう少し検討させてください",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "writing_cn",
            meaning: "見積もり",
            pinyinHint: "bàojià",
            answer: "报价",
          },
          {
            type: "reading",
            passage: "A: 这个价格能不能再便宜一点? B: 这已经是最优惠的价格了。 A: 好的,那我们需要再考虑一下。",
            passagePinyin: "A: Zhège jiàgé néng bùnéng zài piányi yìdiǎn? B: Zhè yǐjīng shì zuì yōuhuì de jiàgé le. A: Hǎo de, nà wǒmen xūyào zài kǎolǜ yíxià.",
            question: "Aさんはどうすると言っていますか?",
            choices: [
              { text: "検討する", correct: true },
              { text: "すぐに契約する", correct: false },
              { text: "取引をやめる", correct: false },
            ],
          },
          {
            type: "listening_choice",
            audioText: "我们合作愉快",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "良いお取引ができました", correct: true },
              { text: "また今度会いましょう", correct: false },
              { text: "契約は失敗しました", correct: false },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "u8",
    title: "出張と接待",
    description: "ホテル・レストラン接待・ビジネスマナーの表現",
    icon: "✈️",
    lessons: [
      {
        id: "u8l1",
        title: "空港とホテル",
        exercises: [
          {
            type: "listening_choice",
            audioText: "我要办理入住",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "チェックインをお願いします", correct: true },
              { text: "チェックアウトをお願いします", correct: false },
              { text: "部屋を予約したいです", correct: false },
            ],
          },
          {
            type: "translate_choice",
            hanzi: "我预订了一个房间",
            pinyin: "wǒ yùdìng le yí gè fángjiān",
            prompt: "この文の意味は?",
            choices: [
              { text: "部屋を一室予約しています", correct: true },
              { text: "部屋を変更したいです", correct: false },
              { text: "部屋は満室です", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "请问机场怎么走",
            pinyin: "qǐngwèn jīchǎng zěnme zǒu",
            meaning: "空港へはどう行けばいいですか",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "writing_cn",
            meaning: "チェックインする",
            pinyinHint: "bànlǐ rùzhù",
            answer: "办理入住",
          },
          {
            type: "reading",
            passage: "您好,我姓铃木,预订了一间单人房,今晚入住三晚。",
            passagePinyin: "Nín hǎo, wǒ xìng Língmù, yùdìng le yì jiān dānrénfáng, jīnwǎn rùzhù sān wǎn.",
            question: "何泊予約していますか?",
            choices: [
              { text: "3泊", correct: true },
              { text: "1泊", correct: false },
              { text: "1週間", correct: false },
            ],
          },
          {
            type: "listening_choice",
            audioText: "退房时间是几点",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "チェックアウトの時間は何時ですか", correct: true },
              { text: "朝食は何時からですか", correct: false },
              { text: "部屋代はいくらですか", correct: false },
            ],
          },
        ],
      },
      {
        id: "u8l2",
        title: "レストランで接待する",
        exercises: [
          {
            type: "listening_choice",
            audioText: "今天我请客",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "今日は私がおごります", correct: true },
              { text: "割り勘にしましょう", correct: false },
              { text: "お腹がすきました", correct: false },
            ],
          },
          {
            type: "translate_choice",
            hanzi: "请随便点",
            pinyin: "qǐng suíbiàn diǎn",
            prompt: "この文の意味は?",
            choices: [
              { text: "ご自由にご注文ください", correct: true },
              { text: "少々お待ちください", correct: false },
              { text: "辛いものは大丈夫ですか", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "为我们的合作干杯",
            pinyin: "wèi wǒmen de hézuò gānbēi",
            meaning: "私たちの協力に乾杯しましょう",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "writing_cn",
            meaning: "乾杯",
            pinyinHint: "gānbēi",
            answer: "干杯",
          },
          {
            type: "reading",
            passage: "今天晚上我请客,大家想吃什么随便点。为我们的合作干杯!",
            passagePinyin: "Jīntiān wǎnshàng wǒ qǐngkè, dàjiā xiǎng chī shénme suíbiàn diǎn. Wèi wǒmen de hézuò gānbēi!",
            question: "誰がおごりますか?",
            choices: [
              { text: "話している本人", correct: true },
              { text: "部下", correct: false },
              { text: "お客様", correct: false },
            ],
          },
          {
            type: "writing_pinyin",
            hanzi: "合作",
            meaningHint: "協力・提携",
            answer: "hezuo",
            answerToned: "hézuò",
          },
        ],
      },
      {
        id: "u8l3",
        title: "ビジネスマナー",
        exercises: [
          {
            type: "listening_choice",
            audioText: "谢谢您的款待",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "おもてなしありがとうございました", correct: true },
              { text: "ごちそうさまでした", correct: false },
              { text: "また会いましょう", correct: false },
            ],
          },
          {
            type: "translate_choice",
            hanzi: "有机会再来北京",
            pinyin: "yǒu jīhuì zài lái Běijīng",
            prompt: "この文の意味は?",
            choices: [
              { text: "機会があればまた北京に来ます", correct: true },
              { text: "また会議をしましょう", correct: false },
              { text: "次は上海に行きます", correct: false },
            ],
          },
          {
            type: "speaking",
            hanzi: "保持联系",
            pinyin: "bǎochí liánxì",
            meaning: "連絡を取り合いましょう",
            prompt: "声に出して発音してみましょう",
          },
          {
            type: "writing_cn",
            meaning: "連絡を取り合う",
            pinyinHint: "bǎochí liánxì",
            answer: "保持联系",
          },
          {
            type: "reading",
            passage: "这次真的很感谢您的款待。合作很愉快,以后我们保持联系,有机会再来拜访。",
            passagePinyin: "Zhè cì zhēn de hěn gǎnxiè nín de kuǎndài. Hézuò hěn yúkuài, yǐhòu wǒmen bǎochí liánxì, yǒu jīhuì zài lái bàifǎng.",
            question: "この人は今後どうしたいと言っていますか?",
            choices: [
              { text: "連絡を取り続けたい", correct: true },
              { text: "二度と会いたくない", correct: false },
              { text: "契約を終了したい", correct: false },
            ],
          },
          {
            type: "listening_choice",
            audioText: "一路平安",
            prompt: "今聞こえた文の意味はどれ?",
            choices: [
              { text: "道中お気をつけて", correct: true },
              { text: "おめでとうございます", correct: false },
              { text: "お先に失礼します", correct: false },
            ],
          },
        ],
      },
    ],
  },
];

// レベルロードマップ: ユニットをHSKに対応する段階にまとめ、
// 「ビジネス中国語が話せる」ゴールまでの距離を可視化する
const LEVELS = [
  {
    id: "lv1",
    label: "Lv.1 入門",
    hskLabel: "HSK1相当",
    unitIds: ["u1", "u2"],
    description: "あいさつ・数字など基本のフレーズが言える",
    implemented: true,
  },
  {
    id: "lv2",
    label: "Lv.2 初級",
    hskLabel: "HSK2相当",
    unitIds: ["u3", "u4"],
    description: "家族・日常生活について簡単な会話ができる",
    implemented: true,
  },
  {
    id: "lv3",
    label: "Lv.3 中級",
    hskLabel: "HSK3相当",
    unitIds: ["u5", "u6"],
    description: "職業紹介・電話やメールなど仕事の基本連絡ができる",
    implemented: true,
  },
  {
    id: "lv4",
    label: "Lv.4 中級上",
    hskLabel: "HSK4相当",
    unitIds: ["u7", "u8"],
    description: "会議・交渉・接待などビジネスの基本場面に対応できる",
    implemented: true,
  },
  {
    id: "lv5",
    label: "Lv.5 上級",
    hskLabel: "HSK5相当",
    unitIds: [],
    description: "プレゼン・契約交渉など複雑な議論ができる(レッスン追加予定)",
    implemented: false,
  },
  {
    id: "lv6",
    label: "Lv.6 ビジネス実務",
    hskLabel: "HSK6相当",
    unitIds: [],
    description: "ゴール: 通訳なしでビジネス商談・交渉を主導できる(レッスン追加予定)",
    implemented: false,
  },
];

const GOAL_LEVEL_ID = "lv6";

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
