export const conversationFlow = [
  {
    botMessage:
      "ご注文ありがとうございます。まずは簡単なアンケートにご協力ください。",
    correctIndex: 1,
    options: [
      "よろしくお願いします！",
      "こちらこそ、ありがとうございます！",
      "はい、緊張しますね！",
    ],
  },
  {
    botMessage: "なぜこの味を？",
    correctIndex: 2,
    options: [
      "美味しいから！！",
      "食べたいから！早くして！",
      "この世で一番好きだから",
    ],
  },
  {
    botMessage: "注文をしたい？",
    correctIndex: 1,
    options: [
      "えーっと、何にしようかな…",
      "アレをくれ。いつものだ",
      "おすすめを教えてください",
    ],
  },
  {
    botMessage: "他に食べたいフレーバーはない？",
    correctIndex: 0,
    options: ["あるわけないよ", "全部食べたい！！", "食べたいから！早くして！"],
  },
  {
    botMessage: "本当にこれでよろしいのですね？",
    correctIndex: 2,
    options: [
      "はい、間違いありません...",
      "ちょっと考え直すかも…",
      "疑うのか？これが俺の答えだ",
    ],
  },
  {
    botMessage: "あなたにとって、これは一体…？",
    correctIndex: 0,
    options: ["生きる意味、そのものだ", "ただの食べ物だよ", "ご褒美かな"],
  },
  {
    botMessage: "他の選択肢は目に入らなかったのですか？",
    correctIndex: 2,
    options: [
      "色々見たけど、やっぱりこれかなって",
      "他のはあまり好きじゃない",
      "雑音は俺には聞こえない",
    ],
  },
  {
    botMessage: "初めて食べた時のことを、覚えていらっしゃいますか？",
    correctIndex: 2,
    options: [
      "覚えているよ！",
      "さあ？覚えてないな",
      "忘れるわけがない、運命だった",
    ],
  },
  {
    botMessage: "トッピングなど、何か加えますか？",
    correctIndex: 1,
    options: [
      "追加したい！",
      "完璧なものに蛇足は不要だ",
      "おすすめを乗せてほしい",
    ],
  },
  {
    botMessage: "大きさはどうなさいますか？",
    correctIndex: 2,
    options: [
      "普通サイズでお願いします",
      "今日は少なめで",
      "決まっているだろう、最大級だ",
    ],
  },
  {
    botMessage: "ご用意に少々お時間をいただきますが…",
    correctIndex: 0,
    options: ["一秒でも早く俺の元へ", "はい、待ちます", "あとどれくらい？"],
  },
  {
    botMessage: "対価を支払う覚悟は、おありですか？",
    correctIndex: 0,
    options: ["全てをくれてやる", "いくらでも払います", "いくらですか？"],
  },
  {
    botMessage: "その喜びは、どなたかと分かち合うのですか？",
    correctIndex: 2,
    options: [
      "友達と一緒に食べます",
      "お土産です",
      "この喜びは独り占めさせてもらう",
    ],
  },
  {
    botMessage: "喉を潤すものは必要ですか？",
    correctIndex: 1,
    options: [
      "水を一杯ください",
      "こいつさえいれば、何もいらない",
      "コーラが飲みたい",
    ],
  },
  {
    botMessage: "この選択に、後悔はありませんか？",
    correctIndex: 0,
    options: ["俺の選択に一片の悔いなし", "ないです！", "たぶん…"],
  },
  {
    botMessage: "これを一言で表現するなら、どんな言葉になりますか？",
    correctIndex: 0,
    options: ["神", "最高", "美味しい"],
  },
  {
    botMessage: "もし、これがこの世から無くなってしまったら…？",
    correctIndex: 0,
    options: ["考えるだけで恐ろしい", "別のものを探すよ", "困るなあ"],
  },
  {
    botMessage: "なぜ、今日だったのですか？",
    correctIndex: 2,
    options: [
      "たまたま食べたいなと思ったから",
      "かき氷があったので",
      "俺がこいつを求めていたからだ",
    ],
  },
  {
    botMessage: "本当に、本当に、これでいいのですね？",
    correctIndex: 0,
    options: ["問答無用。さっさと始めろ", "はい、大丈夫です", "しつこいな…"],
  },
  {
    botMessage: "何か他に、欲しいものは？",
    correctIndex: 2,
    options: [
      "他のシロップもつけて",
      "取り皿がほしい",
      "主役がいれば、成立する",
    ],
  },
  {
    botMessage: "そこまであなたを惹きつける、その魅力とは一体…？",
    correctIndex: 1,
    options: [
      "味が濃いところかな",
      "理屈じゃない、本能が叫んでいる",
      "うまく説明できない",
    ],
  },
  {
    botMessage: "今日はこれだけでよろしいですか？",
    correctIndex: 2,
    options: [
      "はい、以上で",
      "あとドリンクも",
      "まずはこいつと深く向き合う時間が必要だ",
    ],
  },
  {
    botMessage: "誰かに反対されても、それを選びますか？",
    correctIndex: 2,
    options: [
      "反対なんかされないよ",
      "人の意見は気にしない",
      "世界を敵に回しても、俺はこいつを選ぶ",
    ],
  },
  {
    botMessage: "これにまつわる特別な思い出はありますか？",
    correctIndex: 0,
    options: ["これから作る", "特にないかな", "子供の頃によく食べた"],
  },
  {
    botMessage: "どこで召し上がりますか？",
    correctIndex: 1,
    options: ["ここで食べます", "最高の舞台を用意しろ", "持ち帰りで"],
  },
  {
    botMessage: "心の準備は、できていますか？",
    correctIndex: 0,
    options: ["とうの昔にできている", "はい、お腹ペコペコです", "何の準備？"],
  },
  {
    botMessage: "召し上がった後、感想をお聞かせいただけますか？",
    correctIndex: 2,
    options: [
      "いいですよ！",
      "気分が乗ったらね",
      "俺の表情が全てを物語るだろう",
    ],
  },
  {
    botMessage: "また、注文に来てくれますか？",
    correctIndex: 0,
    options: ["約束します", "はい、また来ます", "わからない"],
  },
  {
    botMessage: "何か言い残したことは？",
    correctIndex: 0,
    options: ["ない。完璧だ", "特にないです", "早く食べたい！"],
  },
];
