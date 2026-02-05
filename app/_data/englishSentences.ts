// app/_data/englishSentences.ts

export type EnglishSentence = {
  level: 5 | 6;
  sentence: string;
  meaning: string;
};

const RAW_TSV = `
5\tI like apples.\tわたしは りんごが 好きです。
5\tI like music.\tわたしは 音楽が 好きです。
5\tI like soccer.\tわたしは サッカーが 好きです。
5\tI have a dog.\tわたしは 犬を 飼っています。
5\tI have a cat.\tわたしは ねこを 飼っています。
5\tI have a pen.\tわたしは ペンを 持っています。
5\tI have a book.\tわたしは 本を 持っています。
5\tI am happy.\tわたしは うれしいです。
5\tI am tired.\tわたしは つかれました。
5\tI am hungry.\tわたしは おなかが すきました。
5\tI am thirsty.\tわたしは のどが かわきました。
5\tYou are kind.\tあなたは やさしいです。
5\tHe is tall.\t彼は 背が 高いです。
5\tShe is smart.\t彼女は かしこいです。
5\tWe are friends.\tわたしたちは 友だちです。
5\tThey are students.\t彼らは 生徒です。

5\tThis is a pen.\tこれは ペンです。
5\tThis is my book.\tこれは わたしの 本です。
5\tThat is my desk.\tあれは わたしの 机です。
5\tThese are books.\tこれらは 本です。
5\tThose are chairs.\tあれらは いすです。

5\tI go to school.\tわたしは 学校へ 行きます。
5\tI come home.\tわたしは 家に 帰ります。
5\tI read a book.\tわたしは 本を 読みます。
5\tI write my name.\tわたしは 名前を 書きます。
5\tI study English.\tわたしは 英語を 勉強します。
5\tI play soccer.\tわたしは サッカーを します。
5\tI play a game.\tわたしは ゲームを します。
5\tI drink water.\tわたしは 水を 飲みます。
5\tI eat bread.\tわたしは パンを 食べます.
5\tI eat rice.\tわたしは ごはんを 食べます.

5\tThe book is on the desk.\t本は 机の上に あります。
5\tThe cat is under the chair.\tねこは いすの下に います。
5\tThe bag is in the room.\tかばんは 部屋の中に あります。
5\tI study with my friend.\tわたしは 友だちと いっしょに 勉強します。
5\tI go to the park.\tわたしは 公園へ 行きます。
5\tI walk to school.\tわたしは 学校まで 歩きます。
5\tI run in the park.\tわたしは 公園で 走ります。

6\tWe play soccer after school.\tわたしたちは 放課後 サッカーを します。
6\tWe study at home.\tわたしたちは 家で 勉強します。
6\tWe help our teacher.\tわたしたちは 先生を 手伝います。
6\tWe read books in the library.\tわたしたちは 図書館で 本を 読みます。
6\tWe are busy today.\tわたしたちは 今日 いそがしいです。
6\tWe are free tomorrow.\tわたしたちは 明日 ひまです。

6\tHe has a new bag.\t彼は 新しい かばんを 持っています。
6\tShe has a red pencil.\t彼女は 赤い えんぴつを 持っています。
6\tHe likes music.\t彼は 音楽が 好きです。
6\tShe likes apples.\t彼女は りんごが 好きです。

6\tI want a new book.\tわたしは 新しい 本が ほしいです。
6\tI need water.\tわたしは 水が 必要です。
6\tI know this song.\tわたしは この歌を 知っています。
6\tI think it is easy.\tわたしは それは かんたんだと 思います。
6\tI think it is difficult.\tわたしは それは むずかしいと 思います。

6\tThe dog is near the house.\t犬は 家の近くに います。
6\tThe pen is on the desk.\tペンは 机の上に あります。
6\tThe book is in the bag.\t本は かばんの中に あります。
6\tThe cat is behind the door.\tねこは ドアの後ろに います。
6\tThe park is near my school.\t公園は 学校の近くに あります。
6\tI go to school by bus.\tわたしは バスで 学校へ 行きます。
6\tI go to school on foot.\tわたしは 歩いて 学校へ 行きます。
6\tI come home after school.\tわたしは 放課後 家に 帰ります。

5\tI like blue.\tわたしは 青が 好きです。
5\tI like green.\tわたしは 緑が 好きです。
5\tThis apple is red.\tこの りんごは 赤いです。
5\tThat car is big.\tあの 車は 大きいです。
5\tThis room is small.\tこの 部屋は 小さいです。

6\tI listen to music.\tわたしは 音楽を 聞きます。
6\tI watch TV at night.\tわたしは 夜 テレビを 見ます。
6\tI read a book at night.\tわたしは 夜 本を 読みます。
6\tI wake up early.\tわたしは 早く 起きます。
6\tI sleep early.\tわたしは 早く ねます。

6\tWe clean the room.\tわたしたちは 部屋を そうじします。
6\tI help my mother.\tわたしは 母を 手伝います。
6\tI help my father.\tわたしは 父を 手伝います.
6\tI cook with my family.\tわたしは 家族と いっしょに 料理します。

5\tI have two pencils.\tわたしは えんぴつを2本 持っています。
5\tI have three books.\tわたしは 本を3冊 持っています。
5\tI have a small bag.\tわたしは 小さい かばんを 持っています。
5\tI have a big dog.\tわたしは 大きい 犬を 飼っています。

6\tThis is my new notebook.\tこれは わたしの 新しい ノートです。
6\tThat is your desk.\tあれは あなたの 机です。
6\tThese are our books.\tこれらは わたしたちの 本です。
6\tThose are their chairs.\tあれらは 彼らの いすです。

5\tI go to the library.\tわたしは 図書館へ 行きます。
5\tI study after dinner.\tわたしは 夕食の後 勉強します。
5\tI play in the park.\tわたしは 公園で 遊びます。
5\tI walk with my friend.\tわたしは 友だちと 歩きます。

6\tWe play games after school.\tわたしたちは 放課後 ゲームを します。
6\tWe study English together.\tわたしたちは いっしょに 英語を 勉強します。
6\tWe listen to music together.\tわたしたちは いっしょに 音楽を 聞きます。

6\tThe book is between the pens.\t本は ペンの間に あります。
6\tThe cat is under the table.\tねこは テーブルの下に います。
6\tThe bag is on the chair.\tかばんは いすの上に あります。
6\tThe dog is in the room.\t犬は 部屋の中に います。

5\tI like my school.\tわたしは 学校が 好きです。
5\tI like my class.\tわたしは クラスが 好きです。
6\tI love my family.\tわたしは 家族が 大好きです。
6\tWe love our friends.\tわたしたちは 友だちが 大好きです。

6\tI want to learn English.\tわたしは 英語を 学びたいです。
6\tI want to help my friend.\tわたしは 友だちを 助けたいです。
6\tI need to study today.\tわたしは 今日 勉強する必要があります。

5\tI am at home.\tわたしは 家に います。
5\tI am at school.\tわたしは 学校に います。
6\tI am in the library.\tわたしは 図書館に います。
6\tI am in the park.\tわたしは 公園に います。
`.trim();

export const ENGLISH_SENTENCES_G56: EnglishSentence[] = RAW_TSV.split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const [lvl, sentence, meaning] = line.split("\t");
    return {
      level: (Number(lvl) as 5 | 6),
      sentence,
      meaning,
    };
  });
