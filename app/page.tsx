"use client";

import { useEffect, useMemo, useState } from "react";

type Subject = "japanese" | "math" | "english" | "science";
type ChoiceId = "a" | "b" | "c" | "d";

type Choice = { id: ChoiceId; text: string };

type Question = {
  id: string; // review key としても使う（英語はすでに固有）
  subject: Subject;
  title: string;
  prompt: string;
  choices: Choice[];
  answer: ChoiceId;
  explanation: string;
};

type JapaneseType = "kanji_reading_context" | "word_meaning" | "antonym";
type JapaneseQuestion = {
  id: string;
  grade: 5 | 6;
  type: JapaneseType;
  title: string;
  prompt: string;
  choices: Choice[];
  answer: ChoiceId;
  explanation: string;
};

type WordPos =
  | "noun"
  | "verb"
  | "adj"
  | "adv"
  | "prep"
  | "pron"
  | "conj"
  | "det"
  | "interj";

type WordItem = {
  id: string;
  en: string;
  ja: string;
  pos: WordPos;
};

type SentenceItem = {
  id: string;
  en: string;
  ja: string;
  order: number;
};

type ReviewStat = {
  seen: number;
  correct: number;
  wrong: number;
  lastWrongAt: number | null;
};

type ReviewDB = Record<string, ReviewStat>;

const SUBJECT_LABEL: Record<Subject, string> = {
  japanese: "国語",
  math: "算数",
  english: "英語",
  science: "理科",
};

const SESSION_SIZE = 5;

/** ========== 国語（サンプル） ========== */
const JAPANESE_BANK: JapaneseQuestion[] = [
  {
    id: "jp-001",
    grade: 5,
    type: "kanji_reading_context",
    title: "国語｜漢字の読み（文脈）",
    prompt:
      "次の文の「仮定」の読み方はどれ？\n「もし雨が降ると仮定して、計画を立てた。」",
    choices: [
      { id: "a", text: "かてい" },
      { id: "b", text: "かだい" },
      { id: "c", text: "かどう" },
      { id: "d", text: "かくてい" },
    ],
    answer: "a",
    explanation:
      "「仮定（かてい）」は『もし〜だと考えること』。文の中での使われ方も一緒に確認しよう。",
  },
  {
    id: "jp-002",
    grade: 6,
    type: "word_meaning",
    title: "国語｜言葉の意味",
    prompt: "「努力」の意味として正しいものはどれ？",
    choices: [
      { id: "a", text: "何もしないこと" },
      { id: "b", text: "あきらめること" },
      { id: "c", text: "目標のために続けてがんばること" },
      { id: "d", text: "たまたまうまくいくこと" },
    ],
    answer: "c",
    explanation:
      "「努力」は、目標に向かって続けて取り組むこと。『続ける』『積み上げる』がポイント。",
  },
  {
    id: "jp-003",
    grade: 5,
    type: "antonym",
    title: "国語｜反対語",
    prompt: "「増加」の反対の意味の言葉はどれ？",
    choices: [
      { id: "a", text: "発展" },
      { id: "b", text: "減少" },
      { id: "c", text: "上昇" },
      { id: "d", text: "継続" },
    ],
    answer: "b",
    explanation:
      "「増加」は増えること。「減少」は減ること。反対の意味の組み合わせだね。",
  },
];

/** ========== 算数/理科（固定サンプル） ========== */
const FIXED_SUBJECT_QUESTIONS: Record<Exclude<Subject, "japanese" | "english">, Question[]> =
  {
    math: [
      {
        id: "math-001",
        subject: "math",
        title: "算数｜お試し",
        prompt: "12 × 3 の こたえは？",
        choices: [
          { id: "a", text: "15" },
          { id: "b", text: "24" },
          { id: "c", text: "36" },
          { id: "d", text: "48" },
        ],
        answer: "c",
        explanation:
          "12を3回たすと 12+12+12=36。かけ算は たし算を まとめたもの。",
      },
    ],
    science: [
      {
        id: "sci-001",
        subject: "science",
        title: "理科｜お試し",
        prompt: "水を あたためると、どう なる？",
        choices: [
          { id: "a", text: "こおる" },
          { id: "b", text: "へる" },
          { id: "c", text: "じょうきに なる" },
          { id: "d", text: "かたく なる" },
        ],
        answer: "c",
        explanation: "水は あたためると、気体（きたい）になって じょうきに かわる。",
      },
    ],
  };

/** ========== 英単語120語（同じ） ========== */
const EN_WORDS_120: WordItem[] = [
  { id: "w-001", en: "apple", ja: "りんご", pos: "noun" },
  { id: "w-002", en: "banana", ja: "バナナ", pos: "noun" },
  { id: "w-003", en: "grape", ja: "ぶどう", pos: "noun" },
  { id: "w-004", en: "strawberry", ja: "いちご", pos: "noun" },
  { id: "w-005", en: "orange", ja: "オレンジ", pos: "noun" },
  { id: "w-006", en: "water", ja: "水", pos: "noun" },
  { id: "w-007", en: "milk", ja: "牛乳", pos: "noun" },
  { id: "w-008", en: "bread", ja: "パン", pos: "noun" },
  { id: "w-009", en: "rice", ja: "ごはん", pos: "noun" },
  { id: "w-010", en: "egg", ja: "たまご", pos: "noun" },

  { id: "w-011", en: "school", ja: "学校", pos: "noun" },
  { id: "w-012", en: "class", ja: "クラス", pos: "noun" },
  { id: "w-013", en: "teacher", ja: "先生", pos: "noun" },
  { id: "w-014", en: "student", ja: "生徒", pos: "noun" },
  { id: "w-015", en: "homework", ja: "宿題", pos: "noun" },
  { id: "w-016", en: "book", ja: "本", pos: "noun" },
  { id: "w-017", en: "notebook", ja: "ノート", pos: "noun" },
  { id: "w-018", en: "pencil", ja: "えんぴつ", pos: "noun" },
  { id: "w-019", en: "eraser", ja: "消しゴム", pos: "noun" },
  { id: "w-020", en: "desk", ja: "机", pos: "noun" },

  { id: "w-021", en: "friend", ja: "友だち", pos: "noun" },
  { id: "w-022", en: "family", ja: "家族", pos: "noun" },
  { id: "w-023", en: "mother", ja: "母", pos: "noun" },
  { id: "w-024", en: "father", ja: "父", pos: "noun" },
  { id: "w-025", en: "sister", ja: "姉/妹", pos: "noun" },
  { id: "w-026", en: "brother", ja: "兄/弟", pos: "noun" },
  { id: "w-027", en: "child", ja: "子ども", pos: "noun" },
  { id: "w-028", en: "name", ja: "名前", pos: "noun" },
  { id: "w-029", en: "birthday", ja: "誕生日", pos: "noun" },
  { id: "w-030", en: "day", ja: "日", pos: "noun" },

  { id: "w-031", en: "morning", ja: "朝", pos: "noun" },
  { id: "w-032", en: "afternoon", ja: "午後", pos: "noun" },
  { id: "w-033", en: "evening", ja: "夕方", pos: "noun" },
  { id: "w-034", en: "night", ja: "夜", pos: "noun" },
  { id: "w-035", en: "today", ja: "今日", pos: "adv" },
  { id: "w-036", en: "tomorrow", ja: "明日", pos: "adv" },
  { id: "w-037", en: "yesterday", ja: "昨日", pos: "adv" },
  { id: "w-038", en: "always", ja: "いつも", pos: "adv" },
  { id: "w-039", en: "often", ja: "よく", pos: "adv" },
  { id: "w-040", en: "sometimes", ja: "ときどき", pos: "adv" },

  { id: "w-041", en: "go", ja: "行く", pos: "verb" },
  { id: "w-042", en: "come", ja: "来る", pos: "verb" },
  { id: "w-043", en: "see", ja: "見る", pos: "verb" },
  { id: "w-044", en: "hear", ja: "聞く", pos: "verb" },
  { id: "w-045", en: "eat", ja: "食べる", pos: "verb" },
  { id: "w-046", en: "drink", ja: "飲む", pos: "verb" },
  { id: "w-047", en: "play", ja: "遊ぶ", pos: "verb" },
  { id: "w-048", en: "study", ja: "勉強する", pos: "verb" },
  { id: "w-049", en: "read", ja: "読む", pos: "verb" },
  { id: "w-050", en: "write", ja: "書く", pos: "verb" },

  { id: "w-051", en: "run", ja: "走る", pos: "verb" },
  { id: "w-052", en: "walk", ja: "歩く", pos: "verb" },
  { id: "w-053", en: "swim", ja: "泳ぐ", pos: "verb" },
  { id: "w-054", en: "make", ja: "作る", pos: "verb" },
  { id: "w-055", en: "use", ja: "使う", pos: "verb" },
  { id: "w-056", en: "help", ja: "助ける", pos: "verb" },
  { id: "w-057", en: "open", ja: "開ける/開く", pos: "verb" },
  { id: "w-058", en: "close", ja: "閉める/閉じる", pos: "verb" },
  { id: "w-059", en: "like", ja: "好き", pos: "verb" },
  { id: "w-060", en: "love", ja: "大好き/愛する", pos: "verb" },

  { id: "w-061", en: "big", ja: "大きい", pos: "adj" },
  { id: "w-062", en: "small", ja: "小さい", pos: "adj" },
  { id: "w-063", en: "new", ja: "新しい", pos: "adj" },
  { id: "w-064", en: "old", ja: "古い", pos: "adj" },
  { id: "w-065", en: "good", ja: "良い", pos: "adj" },
  { id: "w-066", en: "bad", ja: "悪い", pos: "adj" },
  { id: "w-067", en: "hot", ja: "暑い/熱い", pos: "adj" },
  { id: "w-068", en: "cold", ja: "寒い/冷たい", pos: "adj" },
  { id: "w-069", en: "happy", ja: "うれしい", pos: "adj" },
  { id: "w-070", en: "sad", ja: "かなしい", pos: "adj" },

  { id: "w-071", en: "fast", ja: "速い", pos: "adj" },
  { id: "w-072", en: "slow", ja: "遅い", pos: "adj" },
  { id: "w-073", en: "easy", ja: "かんたん", pos: "adj" },
  { id: "w-074", en: "hard", ja: "むずかしい", pos: "adj" },
  { id: "w-075", en: "beautiful", ja: "きれい", pos: "adj" },
  { id: "w-076", en: "quiet", ja: "静か", pos: "adj" },
  { id: "w-077", en: "loud", ja: "うるさい", pos: "adj" },
  { id: "w-078", en: "clean", ja: "きれいな", pos: "adj" },
  { id: "w-079", en: "dirty", ja: "よごれた", pos: "adj" },
  { id: "w-080", en: "busy", ja: "いそがしい", pos: "adj" },

  { id: "w-081", en: "one", ja: "1", pos: "noun" },
  { id: "w-082", en: "two", ja: "2", pos: "noun" },
  { id: "w-083", en: "three", ja: "3", pos: "noun" },
  { id: "w-084", en: "four", ja: "4", pos: "noun" },
  { id: "w-085", en: "five", ja: "5", pos: "noun" },
  { id: "w-086", en: "six", ja: "6", pos: "noun" },
  { id: "w-087", en: "seven", ja: "7", pos: "noun" },
  { id: "w-088", en: "eight", ja: "8", pos: "noun" },
  { id: "w-089", en: "nine", ja: "9", pos: "noun" },
  { id: "w-090", en: "ten", ja: "10", pos: "noun" },

  { id: "w-091", en: "and", ja: "そして", pos: "conj" },
  { id: "w-092", en: "but", ja: "でも", pos: "conj" },
  { id: "w-093", en: "or", ja: "または", pos: "conj" },
  { id: "w-094", en: "because", ja: "なぜなら", pos: "conj" },
  { id: "w-095", en: "in", ja: "〜の中に", pos: "prep" },
  { id: "w-096", en: "on", ja: "〜の上に", pos: "prep" },
  { id: "w-097", en: "under", ja: "〜の下に", pos: "prep" },
  { id: "w-098", en: "to", ja: "〜へ/〜に", pos: "prep" },
  { id: "w-099", en: "from", ja: "〜から", pos: "prep" },
  { id: "w-100", en: "with", ja: "〜といっしょに", pos: "prep" },

  { id: "w-101", en: "this", ja: "これ", pos: "pron" },
  { id: "w-102", en: "that", ja: "あれ", pos: "pron" },
  { id: "w-103", en: "here", ja: "ここ", pos: "adv" },
  { id: "w-104", en: "there", ja: "そこ/あそこ", pos: "adv" },
  { id: "w-105", en: "what", ja: "なに", pos: "pron" },
  { id: "w-106", en: "who", ja: "だれ", pos: "pron" },
  { id: "w-107", en: "when", ja: "いつ", pos: "adv" },
  { id: "w-108", en: "where", ja: "どこ", pos: "adv" },
  { id: "w-109", en: "why", ja: "なぜ", pos: "adv" },
  { id: "w-110", en: "how", ja: "どうやって/どのように", pos: "adv" },

  { id: "w-111", en: "I", ja: "わたしは", pos: "pron" },
  { id: "w-112", en: "you", ja: "あなたは", pos: "pron" },
  { id: "w-113", en: "he", ja: "彼は", pos: "pron" },
  { id: "w-114", en: "she", ja: "彼女は", pos: "pron" },
  { id: "w-115", en: "we", ja: "私たちは", pos: "pron" },
  { id: "w-116", en: "they", ja: "彼らは/彼女らは", pos: "pron" },
  { id: "w-117", en: "is", ja: "〜です（be）", pos: "verb" },
  { id: "w-118", en: "are", ja: "〜です（be）", pos: "verb" },
  { id: "w-119", en: "do", ja: "する", pos: "verb" },
  { id: "w-120", en: "can", ja: "〜できる", pos: "verb" },
];

/** ========== 英文（サンプル） ========== */
const EN_STORY: SentenceItem[] = [
  { id: "s-001", order: 1, en: "I have an apple.", ja: "私はりんごを持っています。" },
  { id: "s-002", order: 2, en: "My friend sees it.", ja: "友だちがそれを見ます。" },
  { id: "s-003", order: 3, en: "We go to school.", ja: "私たちは学校へ行きます。" },
  { id: "s-004", order: 4, en: "The teacher is here.", ja: "先生はここにいます。" },
  { id: "s-005", order: 5, en: "I read a book.", ja: "私は本を読みます。" },
  { id: "s-006", order: 6, en: "You write in your notebook.", ja: "あなたはノートに書きます。" },
  { id: "s-007", order: 7, en: "We study together.", ja: "私たちは一緒に勉強します。" },
  { id: "s-008", order: 8, en: "After school, we play.", ja: "放課後、私たちは遊びます。" },
  { id: "s-009", order: 9, en: "It is a good day.", ja: "良い日です。" },
  { id: "s-010", order: 10, en: "But tomorrow is hard.", ja: "でも明日はむずかしいです。" },
  { id: "s-011", order: 11, en: "I can help you.", ja: "私はあなたを助けられます。" },
  { id: "s-012", order: 12, en: "You can help me, too.", ja: "あなたも私を助けられます。" },
  { id: "s-013", order: 13, en: "We open the book and read.", ja: "私たちは本を開いて読みます。" },
  { id: "s-014", order: 14, en: "We close it and smile.", ja: "私たちはそれを閉じて笑います。" },
  { id: "s-015", order: 15, en: "In the evening, I drink milk.", ja: "夕方、私は牛乳を飲みます。" },
  { id: "s-016", order: 16, en: "At night, I do my homework.", ja: "夜、私は宿題をします。" },
  { id: "s-017", order: 17, en: "My family is happy.", ja: "私の家族はうれしいです。" },
  { id: "s-018", order: 18, en: "We walk to the park.", ja: "私たちは公園へ歩きます。" },
  { id: "s-019", order: 19, en: "I run fast, but you run slow.", ja: "私は速く走るけど、あなたはゆっくり走ります。" },
  { id: "s-020", order: 20, en: "We make a plan because we want to win.", ja: "私たちは勝ちたいので計画を作ります。" },
].sort((a, b) => a.order - b.order);

/** ========= Review（復習） ========= */
const LS_KEY = "aha_edu_review_v1";

function loadReviewDB(): ReviewDB {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    return (JSON.parse(raw) as ReviewDB) ?? {};
  } catch {
    return {};
  }
}

function saveReviewDB(db: ReviewDB) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(db));
  } catch {}
}

function ensureStat(db: ReviewDB, id: string): ReviewStat {
  return (
    db[id] ?? {
      seen: 0,
      correct: 0,
      wrong: 0,
      lastWrongAt: null,
    }
  );
}

function recordAnswer(db: ReviewDB, id: string, ok: boolean): ReviewDB {
  const next = { ...db };
  const s = ensureStat(next, id);
  s.seen += 1;
  if (ok) s.correct += 1;
  else {
    s.wrong += 1;
    s.lastWrongAt = Date.now();
  }
  next[id] = s;
  return next;
}

function accuracy(s: ReviewStat): number {
  if (s.seen <= 0) return 0;
  return s.correct / s.seen;
}

function weightFor(id: string, db: ReviewDB): number {
  const s = ensureStat(db, id);
  const acc = accuracy(s);

  const novelty = s.seen < 3 ? 1.5 : 1.0;
  const accWeight = 0.2 + (1 - acc) * 1.6;
  const wrongWeight = 1 + Math.min(3, s.wrong) * 0.35;

  let recent = 1.0;
  if (s.lastWrongAt) {
    const hours = (Date.now() - s.lastWrongAt) / (1000 * 60 * 60);
    if (hours < 24) recent = 1.15;
  }

  return novelty * accWeight * wrongWeight * recent;
}

function pickWeightedUnique(ids: string[], weights: number[], n: number): string[] {
  const pool = ids.map((id, i) => ({ id, w: Math.max(0.0001, weights[i]) }));
  const picked: string[] = [];

  for (let k = 0; k < n && pool.length > 0; k++) {
    const total = pool.reduce((a, b) => a + b.w, 0);
    let r = Math.random() * total;
    let idx = 0;
    for (let i = 0; i < pool.length; i++) {
      r -= pool[i].w;
      if (r <= 0) {
        idx = i;
        break;
      }
    }
    picked.push(pool[idx].id);
    pool.splice(idx, 1);
  }
  return picked;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** ========== 英語：単語/英文（生成関数） ========== */
function posLabel(pos: WordPos) {
  switch (pos) {
    case "noun":
      return "名詞";
    case "verb":
      return "動詞";
    case "adj":
      return "形容詞";
    case "adv":
      return "副詞";
    case "prep":
      return "前置詞";
    case "pron":
      return "代名詞";
    case "conj":
      return "接続詞";
    case "det":
      return "限定詞";
    case "interj":
      return "感動詞";
  }
}

function pickDistractorsWord(target: WordItem, pool: WordItem[], n: number, db: ReviewDB): WordItem[] {
  const samePos = pool.filter((x) => x.id !== target.id && x.pos === target.pos);
  const others = pool.filter((x) => x.id !== target.id && x.pos !== target.pos);

  const score = (w: WordItem) =>
    weightFor(`word:EN_TO_JA:${w.id}`, db) + weightFor(`word:JA_TO_EN:${w.id}`, db);

  const pickFrom = (arr: WordItem[], k: number) => {
    const sorted = [...arr].sort((x, y) => score(y) - score(x));
    const head = sorted.slice(0, Math.min(30, sorted.length));
    return shuffle(head).slice(0, k);
  };

  const r: WordItem[] = [];
  r.push(...pickFrom(samePos, Math.min(n, samePos.length)));
  if (r.length < n) r.push(...pickFrom(others, n - r.length));
  if (r.length < n) r.push(...shuffle(pool.filter((x) => x.id !== target.id)).slice(0, n - r.length));
  return r.slice(0, n);
}

function buildWordQuestion(
  target: WordItem,
  direction: "EN_TO_JA" | "JA_TO_EN",
  distractors: WordItem[]
): Question {
  const opts = shuffle([target, ...distractors]).slice(0, 4);
  const correctIndex = opts.findIndex((x) => x.id === target.id);
  const ids: ChoiceId[] = ["a", "b", "c", "d"];

  const choices: Choice[] = opts.map((w, i) => ({
    id: ids[i],
    text: direction === "EN_TO_JA" ? w.ja : w.en,
  }));

  const prompt = direction === "EN_TO_JA" ? `「${target.en}」はどれ？` : `「${target.ja}」は英語でどれ？`;
  const answer = ids[correctIndex] ?? "a";
  const explanation =
    direction === "EN_TO_JA"
      ? `${target.en} = 「${target.ja}」 / 品詞：${posLabel(target.pos)}`
      : `「${target.ja}」 = ${target.en} / 品詞：${posLabel(target.pos)}`;

  return {
    id: `word:${direction}:${target.id}`,
    subject: "english",
    title: `英語｜単語（${SESSION_SIZE}問）`,
    prompt,
    choices,
    answer,
    explanation,
  };
}

function pickDistractorsSentence(target: SentenceItem, pool: SentenceItem[], n: number, db: ReviewDB): SentenceItem[] {
  const near = pool
    .filter((x) => x.id !== target.id)
    .sort((a, b) => Math.abs(a.order - target.order) - Math.abs(b.order - target.order))
    .slice(0, 20);

  const weak = pool
    .filter((x) => x.id !== target.id)
    .sort((a, b) => weightFor(`sent:${b.id}`, db) - weightFor(`sent:${a.id}`, db))
    .slice(0, 20);

  const mixed = shuffle([...near, ...weak]);
  const uniq: SentenceItem[] = [];
  const seen = new Set<string>();

  for (const x of mixed) {
    if (seen.has(x.id)) continue;
    seen.add(x.id);
    uniq.push(x);
    if (uniq.length >= n) break;
  }

  if (uniq.length < n) {
    const rest = shuffle(pool.filter((x) => x.id !== target.id));
    for (const x of rest) {
      if (seen.has(x.id)) continue;
      uniq.push(x);
      if (uniq.length >= n) break;
    }
  }

  return uniq.slice(0, n);
}

function buildSentenceQuestion(target: SentenceItem, distractors: SentenceItem[]): Question {
  const opts = shuffle([target, ...distractors]).slice(0, 4);
  const correctIndex = opts.findIndex((x) => x.id === target.id);
  const ids: ChoiceId[] = ["a", "b", "c", "d"];

  const choices: Choice[] = opts.map((s, i) => ({ id: ids[i], text: s.ja }));

  return {
    id: `sent:${target.id}`,
    subject: "english",
    title: `英語｜英文（${SESSION_SIZE}問）`,
    prompt: `英語の意味はどれ？\n「${target.en}」`,
    choices,
    answer: ids[correctIndex] ?? "a",
    explanation: `正解：${target.ja}\n（英文）${target.en}`,
  };
}

/** =========================
 *  Home
 * ========================= */
type ModalView =
  | { kind: "none" }
  | { kind: "subject"; subject: Exclude<Subject, "english"> }
  | { kind: "english-entry" }
  | { kind: "english-word" }
  | { kind: "english-sentence" };

export default function Home() {
  const [modal, setModal] = useState<ModalView>({ kind: "none" });

  // 復習DB
  const [db, setDb] = useState<ReviewDB>({});

  // セッション（固定化）
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [sessionIndex, setSessionIndex] = useState(0);

  // 回答UI
  const [picked, setPicked] = useState<ChoiceId | null>(null);
  const [revealed, setRevealed] = useState(false);

  const currentQuestion = useMemo<Question | null>(() => {
    return sessionQuestions[sessionIndex] ?? null;
  }, [sessionQuestions, sessionIndex]);

  const progressText = useMemo(() => {
    if (modal.kind === "none" || modal.kind === "english-entry") return "";
    const cur = Math.min(sessionIndex + 1, SESSION_SIZE);
    const total = Math.min(SESSION_SIZE, sessionQuestions.length || SESSION_SIZE);
    return `${cur}/${total}`;
  }, [modal, sessionIndex, sessionQuestions.length]);

  useEffect(() => {
    setDb(loadReviewDB());
  }, []);

  // -------------------------
  // セッション構築（ここで choices を含めて固定生成する）
  // -------------------------
  const startSubjectSession = (subject: Exclude<Subject, "english">) => {
    setPicked(null);
    setRevealed(false);
    setSessionIndex(0);

    if (subject === "japanese") {
      const ids = JAPANESE_BANK.map((x) => x.id);
      const weights = ids.map((id) => weightFor(`jp:${id}`, db));
      const pickedIds = pickWeightedUnique(ids, weights, Math.min(SESSION_SIZE, ids.length));
      const qs: Question[] = pickedIds
        .map((id) => JAPANESE_BANK.find((x) => x.id === id))
        .filter(Boolean)
        .map((jq) => ({
          id: (jq as JapaneseQuestion).id,
          subject: "japanese",
          title: (jq as JapaneseQuestion).title,
          prompt: (jq as JapaneseQuestion).prompt,
          choices: (jq as JapaneseQuestion).choices,
          answer: (jq as JapaneseQuestion).answer,
          explanation: (jq as JapaneseQuestion).explanation,
        }));

      setSessionQuestions(qs);
      setModal({ kind: "subject", subject });
      return;
    }

    const bank = FIXED_SUBJECT_QUESTIONS[subject];
    const ids = bank.map((x) => x.id);
    const weights = ids.map((id) => weightFor(`${subject}:${id}`, db));
    const pickedIds = pickWeightedUnique(ids, weights, Math.min(SESSION_SIZE, ids.length));
    const qs = pickedIds.map((id) => bank.find((x) => x.id === id)).filter(Boolean) as Question[];

    setSessionQuestions(qs);
    setModal({ kind: "subject", subject });
  };

  const openEnglishEntry = () => {
    setPicked(null);
    setRevealed(false);
    setSessionIndex(0);
    setSessionQuestions([]);
    setModal({ kind: "english-entry" });
  };

  const startEnglishWordSession = () => {
    setPicked(null);
    setRevealed(false);
    setSessionIndex(0);

    // 全候補を「固定Question」にしてから、重みで5問選ぶ
    const pool = EN_WORDS_120;
    const candidates: Question[] = [];

    for (let i = 0; i < pool.length; i++) {
      const target = pool[i];
      const dir = i % 2 === 0 ? "EN_TO_JA" : "JA_TO_EN";
      const distractors = pickDistractorsWord(target, pool, 3, db);
      candidates.push(buildWordQuestion(target, dir, distractors));
    }

    const ids = candidates.map((q) => q.id);
    const weights = ids.map((id) => weightFor(id, db));
    const pickedIds = pickWeightedUnique(ids, weights, Math.min(SESSION_SIZE, ids.length));
    const qs = pickedIds.map((id) => candidates.find((q) => q.id === id)).filter(Boolean) as Question[];

    setSessionQuestions(qs);
    setModal({ kind: "english-word" });
  };

  const startEnglishSentenceSession = () => {
    setPicked(null);
    setRevealed(false);
    setSessionIndex(0);

    const candidates: Question[] = EN_STORY.map((target) => {
      const distractors = pickDistractorsSentence(target, EN_STORY, 3, db);
      return buildSentenceQuestion(target, distractors);
    });

    const ids = candidates.map((q) => q.id);

    // 学んだ順（order小）を少し優先しつつ復習も効かせる
    const weights = ids.map((id) => {
      const base = weightFor(id, db);
      const sId = id.replace("sent:", "");
      const item = EN_STORY.find((x) => x.id === sId);
      const orderBoost = item ? 1.2 / Math.sqrt(Math.max(1, item.order)) : 1;
      return base * orderBoost;
    });

    const pickedIds = pickWeightedUnique(ids, weights, Math.min(SESSION_SIZE, ids.length));
    const qs = pickedIds.map((id) => candidates.find((q) => q.id === id)).filter(Boolean) as Question[];

    setSessionQuestions(qs);
    setModal({ kind: "english-sentence" });
  };

  // -------------------------
  // 回答操作
  // -------------------------
  const choose = (id: ChoiceId) => {
    if (revealed) return;
    setPicked(id);
  };

  const check = () => {
    if (!picked || !currentQuestion) return;
    setRevealed(true);

    const ok = picked === currentQuestion.answer;

    let key = currentQuestion.id;
    if (currentQuestion.subject === "japanese") key = `jp:${currentQuestion.id}`;
    if (currentQuestion.subject === "math") key = `math:${currentQuestion.id}`;
    if (currentQuestion.subject === "science") key = `science:${currentQuestion.id}`;

    const nextDB = recordAnswer(db, key, ok);
    setDb(nextDB);
    saveReviewDB(nextDB);
  };

  const nextQuestion = () => {
    setPicked(null);
    setRevealed(false);

    const nextIdx = sessionIndex + 1;
    if (nextIdx >= sessionQuestions.length) return;
    setSessionIndex(nextIdx);
  };

  const restartSessionSame = () => {
    if (modal.kind === "subject") {
      startSubjectSession(modal.subject);
      return;
    }
    if (modal.kind === "english-word") {
      startEnglishWordSession();
      return;
    }
    if (modal.kind === "english-sentence") {
      startEnglishSentenceSession();
      return;
    }
  };

  const closeModal = () => {
    setModal({ kind: "none" });
    setPicked(null);
    setRevealed(false);
    setSessionIndex(0);
    setSessionQuestions([]);
  };

  const isCorrect = revealed && picked === currentQuestion?.answer;

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/10 grid place-items-center border border-white/10">
              <span className="text-sm font-bold">Aha</span>
            </div>
            <div className="leading-tight">
              <div className="text-lg font-bold">Aha Education</div>
              <div className="text-xs text-white/60">「あ、わかった」から始まる学び</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
              小5・小6：無料
            </span>
            <span className="text-xs rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
              中高：月500円（案）
            </span>
          </div>
        </div>
      </header>

      <section>
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h1 className="text-3xl font-bold leading-tight">1日3分で、理解が積み上がる。</h1>
              <p className="mt-3 text-white/70">
                スキマ時間で「1問 → なるほど → 次」。
                小5・小6の“つまずき”を軽くする。
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/60">
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">1問完結</span>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">解説は短く</span>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">英語は1日5問</span>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/75">
                下の「4教科お試し」から入る（内容の重複をなくす）
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm text-white/60">小5・小6：4教科 お試し</div>

                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  <button
                    type="button"
                    onClick={() => startSubjectSession("japanese")}
                    className="rounded-xl border border-white/10 bg-black/20 p-4 text-left hover:bg-white/5"
                  >
                    <div className="font-semibold">国語</div>
                    <div className="mt-1 text-xs text-white/60">3タイプからランダム</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => startSubjectSession("math")}
                    className="rounded-xl border border-white/10 bg-black/20 p-4 text-left hover:bg-white/5"
                  >
                    <div className="font-semibold">算数</div>
                    <div className="mt-1 text-xs text-white/60">お試し</div>
                  </button>

                  <button
                    type="button"
                    onClick={openEnglishEntry}
                    className="rounded-xl border border-white/10 bg-black/20 p-4 text-left hover:bg-white/5"
                  >
                    <div className="font-semibold">英語</div>
                    <div className="mt-1 text-xs text-white/60">単語 / 英文</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => startSubjectSession("science")}
                    className="rounded-xl border border-white/10 bg-black/20 p-4 text-left hover:bg-white/5"
                  >
                    <div className="font-semibold">理科</div>
                    <div className="mt-1 text-xs text-white/60">お試し</div>
                  </button>
                </div>

                <div className="mt-3 text-xs text-white/60">
                  ※ 国語は「漢字の読み（文脈）／言葉の意味／反対語」からランダム。
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm text-white/60">特徴</div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Feature title="軽い" desc="1日5問でも疲れにくい" />
                  <Feature title="明確" desc="答えがブレない設計" />
                  <Feature title="短い" desc="解説は2〜3行" />
                  <Feature title="復習" desc="まちがえた問題が出やすい" />
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-10 text-center text-xs text-white/40">Aha Education / Prototype</footer>
        </div>
      </section>

      {modal.kind !== "none" && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={closeModal}>
          <div
            className="mx-auto mt-10 w-[92vw] max-w-2xl rounded-2xl border border-white/10 bg-neutral-950 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-white/60">
                  {modal.kind === "english-entry" ? "英語｜入口" : currentQuestion ? currentQuestion.title : "読み込み中"}
                  {modal.kind !== "english-entry" && (
                    <span className="ml-2 text-xs text-white/50">({progressText})</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                aria-label="close"
              >
                ✕
              </button>
            </div>

            {modal.kind === "english-entry" && (
              <div className="mt-4">
                <div className="text-xl font-bold">どっちをやる？（1日5問）</div>
                <div className="mt-2 text-sm text-white/70">
                  単語：EN→JA / JA→EN をまぜる（品詞も表示）<br />
                  英文：英→日（まずは意味を取る）※物語り風に続く
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={startEnglishWordSession}
                    className="rounded-xl bg-white text-neutral-900 font-semibold px-4 py-4 hover:opacity-90"
                  >
                    単語（{SESSION_SIZE}問）
                  </button>

                  <button
                    type="button"
                    onClick={startEnglishSentenceSession}
                    className="rounded-xl border border-white/15 bg-transparent px-4 py-4 text-white/90 hover:bg-white/5"
                  >
                    英文（{SESSION_SIZE}問）
                  </button>
                </div>

                <div className="mt-4 text-xs text-white/60">
                  ※ まちがえた問題は、次回から少し出やすくなる（復習強化）。
                </div>
              </div>
            )}

            {modal.kind !== "english-entry" && currentQuestion && (
              <>
                <div className="mt-4 text-xl font-bold whitespace-pre-line">{currentQuestion.prompt}</div>

                <div className="mt-5 grid gap-3">
                  {currentQuestion.choices.map((c) => {
                    const selected = picked === c.id;
                    const correct = revealed && c.id === currentQuestion.answer;
                    const wrong = revealed && selected && c.id !== currentQuestion.answer;

                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => choose(c.id)}
                        className={[
                          "rounded-xl border px-4 py-3 text-left transition",
                          "border-white/10 bg-white/5 hover:bg-white/10",
                          selected ? "ring-2 ring-white/40" : "",
                          correct ? "border-white/40 bg-white/10" : "",
                          wrong ? "border-red-400/40 bg-red-500/10" : "",
                        ].join(" ")}
                      >
                        <div className="text-sm text-white/60">{c.id.toUpperCase()}</div>
                        <div className="font-semibold">{c.text}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-white/70">
                    {revealed ? (
                      isCorrect ? (
                        <span className="font-semibold">✅ 正解！</span>
                      ) : (
                        <span className="font-semibold">❌ ちがうかも</span>
                      )
                    ) : (
                      <span>答えを選んで「判定」</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {!revealed ? (
                      <>
                        <button
                          type="button"
                          onClick={check}
                          disabled={!picked}
                          className={[
                            "rounded-xl px-4 py-2 font-semibold",
                            picked
                              ? "bg-white text-neutral-900 hover:opacity-90"
                              : "bg-white/10 text-white/40 cursor-not-allowed",
                          ].join(" ")}
                        >
                          判定
                        </button>
                        <button
                          type="button"
                          onClick={closeModal}
                          className="rounded-xl border border-white/15 bg-transparent px-4 py-2 text-white/90 hover:bg-white/5"
                        >
                          閉じる
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={nextQuestion}
                          className="rounded-xl bg-white text-neutral-900 font-semibold px-4 py-2 hover:opacity-90"
                        >
                          次へ
                        </button>

                        <button
                          type="button"
                          onClick={restartSessionSame}
                          className="rounded-xl border border-white/15 bg-transparent px-4 py-2 text-white/90 hover:bg-white/5"
                        >
                          もう1セット
                        </button>

                        <button
                          type="button"
                          onClick={closeModal}
                          className="rounded-xl border border-white/15 bg-transparent px-4 py-2 text-white/90 hover:bg-white/5"
                        >
                          ホームに戻る
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {revealed && (
                  <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4">
                    <div className="text-sm text-white/60">解説</div>
                    <div className="mt-2 text-white/85 whitespace-pre-line">{currentQuestion.explanation}</div>
                  </div>
                )}

                {revealed && sessionIndex + 1 >= sessionQuestions.length && (
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
                    このセットは完了。<b>「次へ」</b>はもう進まないので、<b>「もう1セット」</b>か<b>「ホームに戻る」</b>を選んでね。
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="font-semibold">{title}</div>
      <div className="mt-1 text-sm text-white/70">{desc}</div>
    </div>
  );
}
