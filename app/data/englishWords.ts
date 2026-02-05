// app/_data/englishWords.ts

export type EnglishWord = {
  word: string;
  meaning: string;
  pos: "noun" | "verb" | "adjective" | "preposition";
};

/**
 * TSV形式: word \t meaning \t pos
 * 追加したい時は下の RAW_TSV に 1行足すだけ。
 * ※ pos は noun/verb/adjective/preposition のどれか
 */
const RAW_TSV = `
a\t1つの（不定冠詞）\tpreposition
an\t1つの（母音の前）\tpreposition
the\tその（定冠詞）\tpreposition

I\tわたしは\tpronoun
you\tあなたは\tpronoun
he\t彼は\tpronoun
she\t彼女は\tpronoun
we\tわたしたちは\tpronoun
they\t彼らは／彼女らは\tpronoun
it\tそれは\tpronoun
this\tこれは\tpronoun
that\tあれは\tpronoun
these\tこれらは\tpronoun
those\tあれらは\tpronoun

apple\tりんご\tnoun
banana\tバナナ\tnoun
orange\tオレンジ\tnoun
grape\tぶどう\tnoun
strawberry\tいちご\tnoun
water\t水\tnoun
milk\t牛乳\tnoun
juice\tジュース\tnoun
tea\tお茶\tnoun
rice\tごはん\tnoun
bread\tパン\tnoun
egg\t卵\tnoun
fish\t魚\tnoun
meat\t肉\tnoun
vegetable\t野菜\tnoun
fruit\t果物\tnoun

school\t学校\tnoun
class\tクラス\tnoun
teacher\t先生\tnoun
student\t生徒\tnoun
friend\t友だち\tnoun
home\t家\tnoun
house\t家（建物）\tnoun
room\t部屋\tnoun
desk\t机\tnoun
chair\tいす\tnoun
book\t本\tnoun
notebook\tノート\tnoun
pen\tペン\tnoun
pencil\tえんぴつ\tnoun
eraser\t消しゴム\tnoun
bag\tかばん\tnoun
door\tドア\tnoun
window\t窓\tnoun

mother\t母\tnoun
father\t父\tnoun
sister\t姉／妹\tnoun
brother\t兄／弟\tnoun
grandmother\tおばあちゃん\tnoun
grandfather\tおじいちゃん\tnoun
family\t家族\tnoun

dog\t犬\tnoun
cat\tねこ\tnoun
bird\t鳥\tnoun
fish\t魚\tnoun
animal\t動物\tnoun

day\t日\tnoun
today\t今日\tnoun
tomorrow\t明日\tnoun
yesterday\t昨日\tnoun
morning\t朝\tnoun
afternoon\t午後\tnoun
evening\t夕方\tnoun
night\t夜\tnoun
time\t時間\tnoun
week\t週\tnoun
month\t月\tnoun
year\t年\tnoun

red\t赤\tadjective
blue\t青\tadjective
green\t緑\tadjective
yellow\t黄色\tadjective
black\t黒\tadjective
white\t白\tadjective

big\t大きい\tadjective
small\t小さい\tadjective
long\t長い\tadjective
short\t短い\tadjective
new\t新しい\tadjective
old\t古い\tadjective
good\t良い\tadjective
bad\t悪い\tadjective
easy\tやさしい\tadjective
difficult\tむずかしい\tadjective
happy\tうれしい\tadjective
sad\tかなしい\tadjective
fast\t速い\tadjective
slow\tおそい\tadjective
hot\t暑い／熱い\tadjective
cold\t寒い／冷たい\tadjective
warm\tあたたかい\tadjective
cool\tすずしい\tadjective
busy\tいそがしい\tadjective
free\tひまな\tadjective
hungry\tおなかがすいた\tadjective
thirsty\tのどがかわいた\tadjective
tired\tつかれた\tadjective

go\t行く\tverb
come\t来る\tverb
eat\t食べる\tverb
drink\t飲む\tverb
see\t見る\tverb
watch\t（注意して）見る\tverb
look\t見る（目を向ける）\tverb
read\t読む\tverb
write\t書く\tverb
listen\t聞く\tverb
speak\t話す\tverb
say\t言う\tverb
tell\t伝える\tverb
ask\tたずねる\tverb
answer\t答える\tverb
play\t遊ぶ\tverb
study\t勉強する\tverb
learn\t学ぶ\tverb
teach\t教える\tverb
help\t助ける\tverb
make\t作る\tverb
use\t使う\tverb
open\t開ける\tverb
close\t閉める\tverb
start\t始める\tverb
finish\t終える\tverb
like\t好き\tverb
love\t大好き\tverb
want\tほしい\tverb
need\t必要とする\tverb
know\t知っている\tverb
think\t考える\tverb
work\t働く／作業する\tverb
sleep\tねる\tverb
wake\t起きる\tverb
run\t走る\tverb
walk\t歩く\tverb
swim\t泳ぐ\tverb
cook\t料理する\tverb
clean\tそうじする\tverb

in\t〜の中に\tpreposition
on\t〜の上に\tpreposition
under\t〜の下に\tpreposition
over\t〜の上を\tpreposition
by\t〜のそばに\tpreposition
near\t〜の近くに\tpreposition
with\t〜といっしょに\tpreposition
without\t〜なしで\tpreposition
for\t〜のために\tpreposition
from\t〜から\tpreposition
to\t〜へ\tpreposition
at\t〜で\tpreposition
into\t〜の中へ\tpreposition
out\t外へ\tpreposition
about\t〜について\tpreposition
before\t〜の前に\tpreposition
after\t〜の後に\tpreposition
between\t〜の間に\tpreposition
behind\t〜の後ろに\tpreposition
around\t〜のまわりに\tpreposition
`.trim();

/**
 * pronoun / article も混ざるけど、
 * まずはアプリ側で "noun/verb/adjective/preposition" の4つを主に使う。
 * pronoun / article は「表示用」として残しつつ、出題対象は後で制御できる。
 */
type RawPOS = "noun" | "verb" | "adjective" | "preposition" | "pronoun" | "article";

type EnglishWordRaw = { word: string; meaning: string; pos: RawPOS };

export const ENGLISH_WORDS_G56_RAW: EnglishWordRaw[] = RAW_TSV.split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const [word, meaning, pos] = line.split("\t");
    return { word, meaning, pos: pos as RawPOS };
  });

/**
 * いまの英語問題は4択品詞だけを想定してるので、
 * 出題バンクは4品詞に絞った版も用意しておく。
 */
export const ENGLISH_WORDS_G56: EnglishWord[] = ENGLISH_WORDS_G56_RAW.filter(
  (w): w is EnglishWord =>
    w.pos === "noun" || w.pos === "verb" || w.pos === "adjective" || w.pos === "preposition"
);
