// app/_data/englishStory.ts

export type EnglishStoryStep = {
  id: number;
  scene: string;
  sentence: string;
  meaning: string;
  vocab: string[];
};

export const ENGLISH_STORY_G56: EnglishStoryStep[] = [
  // ===== Chapter 1 : Morning =====
  {
    id: 1,
    scene: "Day 1: Morning",
    sentence: "Aki wakes up early.",
    meaning: "アキは 早く 起きます。",
    vocab: ["wake", "up", "early"],
  },
  {
    id: 2,
    scene: "Day 1: Morning",
    sentence: "He looks at the sky.",
    meaning: "彼は 空を 見ます。",
    vocab: ["look", "sky"],
  },
  {
    id: 3,
    scene: "Day 1: Morning",
    sentence: "The sky is blue.",
    meaning: "空は 青いです。",
    vocab: ["sky", "blue"],
  },
  {
    id: 4,
    scene: "Day 1: Morning",
    sentence: "Aki feels happy.",
    meaning: "アキは うれしい 気持ちに なります。",
    vocab: ["feel", "happy"],
  },
  {
    id: 5,
    scene: "Day 1: Morning",
    sentence: "He drinks water.",
    meaning: "彼は 水を 飲みます。",
    vocab: ["drink", "water"],
  },

  // ===== Chapter 2 : Going to School =====
  {
    id: 6,
    scene: "Day 1: Going to School",
    sentence: "Aki goes to school.",
    meaning: "アキは 学校へ 行きます。",
    vocab: ["go", "school"],
  },
  {
    id: 7,
    scene: "Day 1: Going to School",
    sentence: "He walks with Mina.",
    meaning: "彼は ミナと いっしょに 歩きます。",
    vocab: ["walk", "with"],
  },
  {
    id: 8,
    scene: "Day 1: Going to School",
    sentence: "Mina smiles at Aki.",
    meaning: "ミナは アキに ほほえみます。",
    vocab: ["smile", "at"],
  },
  {
    id: 9,
    scene: "Day 1: Going to School",
    sentence: "They talk on the way.",
    meaning: "ふたりは 道で 話します。",
    vocab: ["talk", "on", "way"],
  },
  {
    id: 10,
    scene: "Day 1: Going to School",
    sentence: "School starts soon.",
    meaning: "学校は もうすぐ 始まります。",
    vocab: ["start", "soon"],
  },

  // ===== Chapter 3 : In the Classroom =====
  {
    id: 11,
    scene: "Day 1: Class",
    sentence: "They are in the classroom.",
    meaning: "ふたりは 教室に います。",
    vocab: ["be", "in", "classroom"],
  },
  {
    id: 12,
    scene: "Day 1: Class",
    sentence: "The teacher comes in.",
    meaning: "先生が 入ってきます。",
    vocab: ["teacher", "come", "in"],
  },
  {
    id: 13,
    scene: "Day 1: Class",
    sentence: "Aki opens his notebook.",
    meaning: "アキは ノートを 開きます。",
    vocab: ["open", "notebook"],
  },
  {
    id: 14,
    scene: "Day 1: Class",
    sentence: "Mina writes her name.",
    meaning: "ミナは 名前を 書きます。",
    vocab: ["write", "name"],
  },
  {
    id: 15,
    scene: "Day 1: Class",
    sentence: "They study English.",
    meaning: "ふたりは 英語を 勉強します。",
    vocab: ["study", "english"],
  },

  // ===== Chapter 4 : After School =====
  {
    id: 16,
    scene: "Day 1: After School",
    sentence: "School finishes in the afternoon.",
    meaning: "学校は 午後に 終わります。",
    vocab: ["finish", "afternoon"],
  },
  {
    id: 17,
    scene: "Day 1: After School",
    sentence: "They go to the park.",
    meaning: "ふたりは 公園へ 行きます。",
    vocab: ["go", "park"],
  },
  {
    id: 18,
    scene: "Day 1: After School",
    sentence: "They play soccer together.",
    meaning: "ふたりは いっしょに サッカーを します。",
    vocab: ["play", "soccer", "together"],
  },
  {
    id: 19,
    scene: "Day 1: After School",
    sentence: "Aki feels tired.",
    meaning: "アキは つかれたと 感じます。",
    vocab: ["feel", "tired"],
  },
  {
    id: 20,
    scene: "Day 1: After School",
    sentence: "Mina shares water with him.",
    meaning: "ミナは 彼と 水を 分けます。",
    vocab: ["share", "water", "with"],
  },

  // ===== Chapter 5 : Evening =====
  {
    id: 21,
    scene: "Day 1: Evening",
    sentence: "Aki goes home.",
    meaning: "アキは 家に 帰ります。",
    vocab: ["go", "home"],
  },
  {
    id: 22,
    scene: "Day 1: Evening",
    sentence: "He eats dinner with his family.",
    meaning: "彼は 家族と 夕食を 食べます。",
    vocab: ["eat", "dinner", "family"],
  },
  {
    id: 23,
    scene: "Day 1: Evening",
    sentence: "He does his homework.",
    meaning: "彼は 宿題を します。",
    vocab: ["do", "homework"],
  },
  {
    id: 24,
    scene: "Day 1: Evening",
    sentence: "Aki reads a book.",
    meaning: "アキは 本を 読みます。",
    vocab: ["read", "book"],
  },
  {
    id: 25,
    scene: "Day 1: Evening",
    sentence: "He sleeps early.",
    meaning: "彼は 早く ねます。",
    vocab: ["sleep", "early"],
  },

  // ===== ここから先は同じ形式で無限に追加できる =====
];
