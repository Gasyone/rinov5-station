export interface LessonReviewContent {
  lessonNumber: number
  title: string
  words: string
  sentences: string
  phonics: string
}

export interface WeekReviewItem {
  weekNum: number
  title: string
  content: string
  docLink?: string
  thumbnailUrl?: string
}

export const FIXED_PARENT_NOTICE = `Con sẽ phát phiếu và tranh học của phần ôn luyện riêng vào buổi tới. Con luyện tập phiếu bài tập, sau đó dựa trên tranh ảnh trên phiếu, con sẽ chỉ tranh trên phiếu, đọc to. Ba mẹ hỗ trợ con quay và gửi video qua zalo cho cô hàng tuần. Ba mẹ có thể cho con đến sớm để cô kiểm tra bài con mỗi buổi nhé.

Trân trọng cảm ơn!`

export const DEFAULT_SECTION_B2_WEEKS: WeekReviewItem[] = [
  {
    weekNum: 1,
    title: 'Tuần 1',
    content: 'Luyện phiếu bài tập với từ vựng “see” và “hear”. Sau đó con sẽ thực hiện luyện tập mẫu câu “I see with my eyes” và “I hear with my ears”.',
    docLink: 'https://drive.google.com/file/d/1AOasROm35C5mZk1bgoxmJunmf4GdYAh5/view?usp=drive_link',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=400&auto=format&fit=crop',
  },
  {
    weekNum: 2,
    title: 'Tuần 2',
    content: 'Luyện phiếu bài tập Letter T với từ vựng tiger và tent. Luyện nói mẫu câu “I can see a tiger.” và “ I can see a tent.”',
    docLink: 'https://drive.google.com/file/d/14oxsjCpMEL2NCsLlamNOpvVkVi6Q_Smq/view?usp=drive_link',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop',
  },
  {
    weekNum: 3,
    title: 'Tuần 3',
    content: 'Luyện tập thuyết trình với mẫu câu “I see/hear/smell/touch with my ….” với tranh đính kèm.',
    docLink: 'https://drive.google.com/file/d/1AOasROm35C5mZk1bgoxmJunmf4GdYAh5/view?usp=drive_link',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=400&auto=format&fit=crop',
  },
  {
    weekNum: 4,
    title: 'Tuần 4',
    content: 'Luyện tập thuyết trình với letter Tt tại tranh sau, sử dụng mẫu câu “I can see a … . It’s + color”.',
    docLink: 'https://drive.google.com/file/d/14oxsjCpMEL2NCsLlamNOpvVkVi6Q_Smq/view?usp=drive_link',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=400&auto=format&fit=crop',
  },
]

export const MOCK_LESSONS_REVIEW: LessonReviewContent[] = [
  {
    lessonNumber: 1,
    title: 'Unit 1 - Hello & Friends',
    words: 'hello, goodbye, sing, stand up, sit down, thank you',
    sentences: "How are you? I'm fine. Thank you.",
    phonics: 'Aa: alligator, ant, apple / Bb: bear, bird, banana',
  },
  {
    lessonNumber: 2,
    title: 'Unit 1 - School Supplies',
    words: 'pen, pencil, book, eraser, ruler, school bag',
    sentences: "What's this? It's a pencil. Is it a book? Yes, it is.",
    phonics: 'Cc: cat, cup, car / Dd: dog, duck, doll',
  },
  {
    lessonNumber: 3,
    title: 'Unit 2 - My Family',
    words: 'family, father, mother, brother, sister, baby',
    sentences: 'Who is this? This is my father. She is my mother.',
    phonics: 'Ee: elephant, egg, elbow / Ff: fish, farm, frog',
  },
  {
    lessonNumber: 4,
    title: 'Unit 2 - Colors & Shapes',
    words: 'red, blue, yellow, green, circle, square, triangle',
    sentences: "What color is it? It's blue. I see a yellow circle.",
    phonics: 'Gg: gorilla, goat, guitar / Hh: hat, house, horse',
  },
  {
    lessonNumber: 5,
    title: 'Unit 3 - Toys & Games',
    words: 'ball, doll, car, robot, puzzle, teddy bear',
    sentences: 'I have a robot. Do you like toys? Yes, I do.',
    phonics: 'Ii: iguana, ink, insect / Jj: jet, jam, juice',
  },
  {
    lessonNumber: 6,
    title: 'Unit 3 - Numbers & Counting',
    words: 'one, two, three, four, five, six, seven, eight, nine, ten',
    sentences: 'How many apples? Three apples. Count with me!',
    phonics: 'Kk: kangaroo, kite, king / Ll: lion, lemon, leaf',
  },
  {
    lessonNumber: 7,
    title: 'Unit 4 - Body Parts',
    words: 'head, shoulders, knees, toes, eyes, ears, mouth, nose',
    sentences: 'Touch your nose. Open your mouth. I have two eyes.',
    phonics: 'Mm: monkey, moon, milk / Nn: nest, nut, net',
  },
  {
    lessonNumber: 8,
    title: 'Unit 4 - Animals & Pets',
    words: 'dog, cat, rabbit, bird, hamster, fish, puppy',
    sentences: 'What animal do you like? I like rabbits. It can run.',
    phonics: 'Oo: octopus, ostrich, ox / Pp: panda, pig, pen',
  },
  {
    lessonNumber: 9,
    title: 'Unit 5 - Food & Drinks',
    words: 'apple, banana, milk, bread, cheese, water, juice',
    sentences: 'Do you want milk? Yes, please. I like bananas.',
    phonics: 'Qq: queen, quilt, quiet / Rr: rabbit, ring, rain',
  },
  {
    lessonNumber: 10,
    title: 'Unit 5 - My House',
    words: 'house, bedroom, kitchen, living room, door, window',
    sentences: 'Where is Mom? She is in the kitchen.',
    phonics: 'Ss: sun, star, snake / Tt: tiger, tree, train',
  },
  {
    lessonNumber: 11,
    title: 'Unit 6 - Clothes',
    words: 'shirt, pants, shoes, socks, hat, coat, dress',
    sentences: 'Put on your shoes. I wear a red shirt.',
    phonics: 'Uu: umbrella, uncle, up / Vv: van, violin, vase',
  },
  {
    lessonNumber: 12,
    title: 'Unit 6 - Weather & Seasons',
    words: 'sunny, rainy, windy, snowy, hot, cold, summer, winter',
    sentences: "How's the weather today? It's sunny and warm.",
    phonics: 'Ww: water, watch, wind / Xx: fox, box, six',
  },
  {
    lessonNumber: 13,
    title: 'Unit 7 - Action Verbs',
    words: 'run, jump, swim, fly, dance, walk, read, write',
    sentences: 'Can you swim? Yes, I can. He is running fast.',
    phonics: 'Yy: yellow, yo-yo, yak / Zz: zebra, zoo, zero',
  },
  {
    lessonNumber: 14,
    title: 'Unit 7 - Transportation',
    words: 'bus, car, bicycle, train, plane, boat, taxi',
    sentences: 'I go to school by bus. Look at the train!',
    phonics: 'Bl: blue, black, block / Cl: clock, cloud, clap',
  },
  {
    lessonNumber: 15,
    title: 'Unit 8 - Feelings & Emotions',
    words: 'happy, sad, angry, tired, hungry, thirsty, excited',
    sentences: 'Are you happy? Yes, I am. I feel hungry.',
    phonics: 'Fl: flower, flag, fly / Pl: plane, plum, play',
  },
  {
    lessonNumber: 16,
    title: 'Unit 8 - Review & Integration',
    words: 'friend, teacher, classroom, story, song, game',
    sentences: 'We love English! Let me tell a story.',
    phonics: 'Gl: glass, glove, glue / Sl: slide, sleep, sled',
  },
]

export function getReviewContentForRange(startNum: number, endNum: number): string {
  const min = Math.min(startNum, endNum)
  const max = Math.max(startNum, endNum)
  const filtered = MOCK_LESSONS_REVIEW.filter(
    (l) => l.lessonNumber >= min && l.lessonNumber <= max
  )

  return filtered
    .map(
      (l) =>
        `📌 Bài ${l.lessonNumber} (${l.title}):\n- Words: ${l.words}\n- Sentences: ${l.sentences}\n- Phonics: ${l.phonics}`
    )
    .join('\n\n')
}

export function getDirectLessonPlanForRange(startNum: number, endNum: number): string {
  const min = Math.min(startNum, endNum)
  const max = Math.max(startNum, endNum)
  const filtered = MOCK_LESSONS_REVIEW.filter(
    (l) => l.lessonNumber >= min && l.lessonNumber <= max
  )

  return `KẾ HOẠCH BÀI HỌC TRỌNG TÂM (BÀI ${min} DẾN BÀI ${max}):\n` +
    filtered.map((l) => `• Bài ${l.lessonNumber} (${l.title}): ${l.words}`).join('\n')
}

export function getAiSynthesizedNextMonthPlan(startNum: number, endNum: number): string {
  const min = Math.min(startNum, endNum)
  const max = Math.max(startNum, endNum)

  if (min >= 8 || max >= 8) {
    return `Tháng tới, các con sẽ học 2 chủ đề mới: Zoo Animals và Fun Shapes với nhiều hoạt động hấp dẫn:
Học từ vựng về động vật: bears, elephants, giraffes, lions
Học từ vựng về hình khối: circle, square, star, triangle
Luyện mẫu câu: Do you like bears? / What shape is it?
Học phát âm: Vv với violin, vase; Ww với watch, window; Xx với box, fox
Đọc truyện ngắn và luyện hội thoại: How old are you?, This is for you.
Tham gia hoạt động CLIL: vận động với climb, stomp và ôn số đếm
Làm mini project: làm mặt nạ động vật và làm búp bê.`
  }

  return `Tháng tới, các con sẽ học 2 chủ đề mới: Friends & Family và Colors & Animals với nhiều hoạt động hấp dẫn:
Học từ vựng về gia đình & học tập: father, mother, brother, pen, pencil, book
Học từ vựng về màu sắc & hình khối: red, blue, yellow, circle, square
Luyện mẫu câu: Who is this? / What's this? / It's a pencil
Học phát âm: Aa với apple; Bb với banana; Cc với cat; Dd với dog
Đọc truyện ngắn và luyện hội thoại: How are you?, I'm fine. Thank you.
Tham gia hoạt động CLIL: nhận biết âm nhạc & vận động đếm số (1-10)
Làm mini project: vẽ cây gia đình và làm con vật bằng giấy.`
}
