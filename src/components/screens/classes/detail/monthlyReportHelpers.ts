import { mockCareAlerts } from '@/mocks/careAlerts'
import { MONTH_OPTIONS } from '@/mocks/monthlyReports'

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

export const MOCK_MATH_LESSONS_REVIEW: LessonReviewContent[] = [
  {
    lessonNumber: 1,
    title: 'Level: 401_Lesson 3: Trò chơi cơ bản: Tay trái, tay phải - Nhận diện không gian',
    words: 'Tay trái, tay phải, định vị không gian, phản xạ phương hướng',
    sentences: 'Xác định chính xác bên trái / bên phải của bản thân và đồ vật đối diện.',
    phonics: 'Tư duy không gian & phản xạ vận động',
  },
  {
    lessonNumber: 2,
    title: 'Level: 401_Lesson 4: Trò chơi Nâng cao: Tay trái, tay phải - Nhận diện không gian',
    words: 'Góc nhìn đảo ngược, định vị đa chiều, đối xứng cơ bản',
    sentences: 'Ứng dụng định vị không gian trong mê cung và bản đồ tương tác đa chiều.',
    phonics: 'Tư duy đa chiều & định hướng giải quyết vấn đề',
  },
  {
    lessonNumber: 3,
    title: 'Level: 402_Lesson 1: Câu chuyện Chiếc vòng vảy cá óng ánh',
    words: 'Quy luật màu sắc, sắp xếp tuần hoàn, phân loại đặc tính',
    sentences: 'Nhận diện và hoàn thành chuỗi lặp lại theo quy luật: A-B, A-B-C.',
    phonics: 'Tư duy phân tích quy luật & quan sát chi tiết',
  },
  {
    lessonNumber: 4,
    title: 'Level: 402_Lesson 2: Trò chơi cơ bản + Sách hoạt động',
    words: 'Số lượng, đếm nhanh, so sánh nhiều hơn - ít hơn',
    sentences: 'Ghép cặp tương ứng 1-1 và so sánh nhóm lượng trong phạm vi 10.',
    phonics: 'Khái niệm số học nền tảng & ghép nối logic',
  },
  {
    lessonNumber: 5,
    title: 'Level: 402: Lesson 3: Trò chơi nâng cao 1 + Sách hoạt động',
    words: 'Tập hợp, phân loại nâng cao, gộp nhóm đối tượng',
    sentences: 'Phân loại vật thể theo 2 tiêu chí đồng thời (màu sắc + hình dạng).',
    phonics: 'Tư duy tập hợp & logic loại trừ',
  },
  {
    lessonNumber: 6,
    title: 'Level: 402_Lesson 4: Trò chơi nâng cao 2 + Sách hoạt động',
    words: 'Quy luật ma trận 2x2, điền hình còn thiếu, suy luận logic',
    sentences: 'Tìm mảnh ghép quy luật theo hàng ngang và cột dọc trong ma trận.',
    phonics: 'Tư duy suy luận ma trận & kiểm chứng giả thuyết',
  },
  {
    lessonNumber: 7,
    title: 'Level: 403_Lesson 1: Câu chuyện Vương quốc Hình khối kỳ diệu',
    words: 'Hình vuông, hình tròn, tam giác, chữ nhật, khối lập phương',
    sentences: 'Nhận biết và gọi tên đặc điểm hình học phẳng & khối không gian.',
    phonics: 'Tư duy hình học trực quan & biểu đạt không gian',
  },
  {
    lessonNumber: 8,
    title: 'Level: 403_Lesson 2: Trò chơi cơ bản: Ghép hình tư duy Tangram',
    words: 'Tách - ghép hình học, xoay hướng không gian, tỉ lệ tương đối',
    sentences: 'Sáng tạo các mô hình động vật và đồ vật từ mảnh ghép Tangram.',
    phonics: 'Trí tưởng tượng không gian & óc sáng tạo cấu trúc',
  },
  {
    lessonNumber: 9,
    title: 'Level: 403_Lesson 3: Trò chơi nâng cao: Thử thách Cân thăng bằng',
    words: 'Nặng hơn, nhẹ hơn, bằng nhau, bảo toàn khối lượng',
    sentences: 'So sánh trọng lượng gián tiếp thông qua cân thăng bằng logic.',
    phonics: 'Tư duy suy luận định lượng & bảo toàn đại lượng',
  },
  {
    lessonNumber: 10,
    title: 'Level: 403_Lesson 4: Hoạt động trải nghiệm: Mê cung số học',
    words: 'Đường đi ngắn nhất, lập kế hoạch di chuyển, rẽ trái / rẽ phải',
    sentences: 'Tìm lộ trình tối ưu qua các trạm thử thách số học trên sa bàn.',
    phonics: 'Tư duy thuật toán sơ khai & chiến lược giải quyết vấn đề',
  },
  {
    lessonNumber: 11,
    title: 'Level: 404_Lesson 1: Khám phá Quy luật dãy số tăng dần',
    words: 'Dãy số cách đều, số liền trước, liền sau, bước nhảy +1, +2',
    sentences: 'Phát hiện quy luật và điền số thích hợp vào dãy số còn khuyết.',
    phonics: 'Tư duy số học tuần tự & quy nạp logic',
  },
  {
    lessonNumber: 12,
    title: 'Level: 404_Lesson 2: Trò chơi cơ bản: Xếp tháp logic & Thứ tự kích thước',
    words: 'Lớn nhất, nhỏ nhất, trung gian, trật tự sắp xếp',
    sentences: 'Sắp xếp dãy đối tượng theo thứ tự tăng/giảm dần theo nhiều tiêu chí.',
    phonics: 'Tư duy quan hệ thứ tự & phân cấp logic',
  },
  {
    lessonNumber: 13,
    title: 'Level: 404_Lesson 3: Trò chơi nâng cao: Thử thách Tháp Hà Nội mini',
    words: 'Di chuyển tuần tự, tối ưu số bước, điều kiện ràng buộc',
    sentences: 'Chuyển tháp đĩa tuân thủ quy tắc không đặt đĩa lớn lên đĩa nhỏ.',
    phonics: 'Tư duy đệ quy & lập kế hoạch hành động từng bước',
  },
  {
    lessonNumber: 14,
    title: 'Level: 404_Lesson 4: Sách hoạt động tư duy & Bài tập logic tổng hợp',
    words: 'Giải mã quy luật, nối điểm tư duy, bài toán tình huống thực tế',
    sentences: 'Vận dụng tổng hợp kỹ năng suy luận vào giải quyết bài tập dự án.',
    phonics: 'Tư duy tích hợp & giải quyết vấn đề toàn diện',
  },
  {
    lessonNumber: 15,
    title: 'Level: 405_Lesson 1: Ôn tập chuyên đề: Không gian & Số học ứng dụng',
    words: 'Hệ thống hóa kiến thức, củng cố phản xạ, phối hợp nhóm',
    sentences: 'Thuyết trình giải thích phương pháp tư duy và cách tìm đáp án.',
    phonics: 'Giao tiếp toán học & tự tin diễn đạt tư duy',
  },
  {
    lessonNumber: 16,
    title: 'Level: 405_Lesson 2: Đánh giá năng lực tư duy cuối kỳ & Dự án sáng tạo',
    words: 'Bài test năng lực, trao huy hiệu, tổng kết tiến trình',
    sentences: 'Tự hào thể hiện năng lực tư duy vượt trội sau toàn khóa học.',
    phonics: 'Tự nhận thức năng lực & khích lệ động lực bứt phá',
  },
]

export const MOCK_ENGLISH_LESSONS_REVIEW: LessonReviewContent[] = [
  {
    lessonNumber: 1,
    title: 'Kindie A - Unit 1A - Lesson 1',
    words: 'hello, goodbye, sing, stand up, sit down, thank you',
    sentences: "How are you? I'm fine. Thank you.",
    phonics: 'Aa: alligator, ant, apple / Bb: bear, bird, banana',
  },
  {
    lessonNumber: 2,
    title: 'Kindie A - Unit 1A - Lesson 2',
    words: 'pen, pencil, book, eraser, ruler, school bag',
    sentences: "What's this? It's a pencil. Is it a book? Yes, it is.",
    phonics: 'Cc: cat, cup, car / Dd: dog, duck, doll',
  },
  {
    lessonNumber: 3,
    title: 'Kindie A - Unit 1A - Lesson 3',
    words: 'family, father, mother, brother, sister, baby',
    sentences: 'Who is this? This is my father. She is my mother.',
    phonics: 'Ee: elephant, egg, elbow / Ff: fish, farm, frog',
  },
  {
    lessonNumber: 4,
    title: 'Kindie A - Unit 1A - Lesson 4',
    words: 'red, blue, yellow, green, circle, square, triangle',
    sentences: "What color is it? It's blue. I see a yellow circle.",
    phonics: 'Gg: gorilla, goat, guitar / Hh: hat, house, horse',
  },
  {
    lessonNumber: 5,
    title: 'Kindie A - Unit 2A - Lesson 1',
    words: 'ball, doll, car, robot, puzzle, teddy bear',
    sentences: 'I have a robot. Do you like toys? Yes, I do.',
    phonics: 'Ii: iguana, ink, insect / Jj: jet, jam, juice',
  },
  {
    lessonNumber: 6,
    title: 'Kindie A - Unit 2A - Lesson 2',
    words: 'one, two, three, four, five, six, seven, eight, nine, ten',
    sentences: 'How many apples? Three apples. Count with me!',
    phonics: 'Kk: kangaroo, kite, king / Ll: lion, lemon, leaf',
  },
  {
    lessonNumber: 7,
    title: 'Kindie A - Unit 2A - Lesson 3',
    words: 'head, shoulders, knees, toes, eyes, ears, mouth, nose',
    sentences: 'Touch your nose. Open your mouth. I have two eyes.',
    phonics: 'Mm: monkey, moon, milk / Nn: nest, nut, net',
  },
  {
    lessonNumber: 8,
    title: 'Kindie A - Unit 2A - Lesson 4',
    words: 'dog, cat, rabbit, bird, hamster, fish, puppy',
    sentences: 'What animal do you like? I like rabbits. It can run.',
    phonics: 'Oo: octopus, ostrich, ox / Pp: panda, pig, pen',
  },
  {
    lessonNumber: 9,
    title: 'Kindie A - Unit 3A - Lesson 1',
    words: 'apple, banana, milk, bread, cheese, water, juice',
    sentences: 'Do you want milk? Yes, please. I like bananas.',
    phonics: 'Qq: queen, quilt, quiet / Rr: rabbit, ring, rain',
  },
  {
    lessonNumber: 10,
    title: 'Kindie A - Unit 3A - Lesson 2',
    words: 'house, bedroom, kitchen, living room, door, window',
    sentences: 'Where is Mom? She is in the kitchen.',
    phonics: 'Ss: sun, star, snake / Tt: tiger, tree, train',
  },
  {
    lessonNumber: 11,
    title: 'Kindie A - Unit 3A - Lesson 3',
    words: 'shirt, pants, shoes, socks, hat, coat, dress',
    sentences: 'Put on your shoes. I wear a red shirt.',
    phonics: 'Uu: umbrella, uncle, up / Vv: van, violin, vase',
  },
  {
    lessonNumber: 12,
    title: 'Kindie A - Unit 3A - Lesson 4',
    words: 'sunny, rainy, windy, snowy, hot, cold, summer, winter',
    sentences: "How's the weather today? It's sunny and warm.",
    phonics: 'Ww: water, watch, wind / Xx: fox, box, six',
  },
  {
    lessonNumber: 13,
    title: 'Kindie A - Unit 4A - Lesson 1',
    words: 'run, jump, swim, fly, dance, walk, read, write',
    sentences: 'Can you swim? Yes, I can. He is running fast.',
    phonics: 'Yy: yellow, yo-yo, yak / Zz: zebra, zoo, zero',
  },
  {
    lessonNumber: 14,
    title: 'Kindie A - Unit 4A - Lesson 2',
    words: 'bus, car, bicycle, train, plane, boat, taxi',
    sentences: 'I go to school by bus. Look at the train!',
    phonics: 'Bl: blue, black, block / Cl: clock, cloud, clap',
  },
  {
    lessonNumber: 15,
    title: 'Kindie A - Unit 4A - Lesson 3',
    words: 'happy, sad, angry, tired, hungry, thirsty, excited',
    sentences: 'Are you happy? Yes, I am. I feel hungry.',
    phonics: 'Fl: flower, flag, fly / Pl: plane, plum, play',
  },
  {
    lessonNumber: 16,
    title: 'Kindie A - Unit 4A - Lesson 4',
    words: 'friend, teacher, classroom, story, song, game',
    sentences: 'We love English! Let me tell a story.',
    phonics: 'Gl: glass, glove, glue / Sl: slide, sleep, sled',
  },
]

export const MOCK_LESSONS_REVIEW: LessonReviewContent[] = MOCK_ENGLISH_LESSONS_REVIEW

export function getLessonsReviewBySubject(subject?: string, isMath?: boolean): LessonReviewContent[] {
  if (isMath !== undefined) {
    return isMath ? MOCK_MATH_LESSONS_REVIEW : MOCK_ENGLISH_LESSONS_REVIEW
  }
  if (!subject) return MOCK_ENGLISH_LESSONS_REVIEW
  const lower = subject.toLowerCase()
  if (lower.includes('toán') || lower.includes('math')) {
    return MOCK_MATH_LESSONS_REVIEW
  }
  return MOCK_ENGLISH_LESSONS_REVIEW
}

export function getReviewContentForRange(startNum: number, endNum: number, isMath?: boolean): string {
  const min = Math.min(startNum, endNum)
  const max = Math.max(startNum, endNum)
  const list = isMath ? MOCK_MATH_LESSONS_REVIEW : MOCK_ENGLISH_LESSONS_REVIEW
  const filtered = list.filter(
    (l) => l.lessonNumber >= min && l.lessonNumber <= max
  )

  if (isMath) {
    return filtered
      .map(
        (l) =>
          `📌 Buổi ${l.lessonNumber}:\n- Trọng tâm: ${l.words}\n- Kỹ năng tư duy: ${l.sentences}\n- Phương pháp: ${l.phonics}`
      )
      .join('\n\n')
  }

  return filtered
    .map(
      (l) =>
        `📌 Buổi ${l.lessonNumber}:\n- Words: ${l.words}\n- Sentences: ${l.sentences}\n- Phonics: ${l.phonics}`
    )
    .join('\n\n')
}

export function getDirectLessonPlanForRange(startNum: number, endNum: number, isMath?: boolean): string {
  const min = Math.min(startNum, endNum)
  const max = Math.max(startNum, endNum)
  const list = isMath ? MOCK_MATH_LESSONS_REVIEW : MOCK_ENGLISH_LESSONS_REVIEW
  const filtered = list.filter(
    (l) => l.lessonNumber >= min && l.lessonNumber <= max
  )

  return `KẾ HOẠCH BÀI HỌC TRỌNG TÂM (BUỔI ${min} ĐẾN BUỔI ${max}):\n` +
    filtered.map((l) => `• Buổi ${l.lessonNumber}: ${l.words}`).join('\n')
}

export function getAiSynthesizedNextMonthPlan(startNum: number, endNum: number, isMath?: boolean): string {
  const min = Math.min(startNum, endNum)
  const max = Math.max(startNum, endNum)

  if (isMath) {
    if (min <= 6) {
      return `Tháng tới, các con sẽ tiếp tục chương trình Toán tư duy Columbus với các chủ đề trọng tâm:
1. Nhận diện không gian & Định vị đa chiều: Phân biệt chính xác tay trái - tay phải của bản thân và vật thể đối diện; ứng dụng vào mê cung logic và bản đồ tương tác.
2. Tư duy quy luật & Sắp xếp tuần hoàn: Khám phá câu chuyện Chiếc vòng vảy cá óng ánh, nhận biết và hoàn thành các chuỗi quy luật màu sắc, hình khối A-B, A-B-C.
3. Hoạt động bổ trợ: Thực hành trò chơi cơ bản, sách hoạt động tư duy và các thử thách ghép nối logic theo nhóm.
Mục tiêu giúp con hình thành phản xạ không gian nhanh nhạy, rèn luyện tính kiên nhẫn và tự tin trình bày hướng tư duy của mình.`
    }
    if (min <= 12) {
      return `Tháng tới, các con sẽ tiếp tục chương trình Toán tư duy Columbus với các chủ đề trọng tâm:
1. Hình học tư duy & Cấu trúc không gian: Khám phá các hình học cơ bản (vuông, tròn, tam giác, chữ nhật), ứng dụng bộ ghép hình Tangram để sáng tạo mô hình con vật và nhận thức không gian đa chiều.
2. Đo lường logic & Cân thăng bằng: Làm quen với khái niệm nặng hơn - nhẹ hơn - bằng nhau thông qua cán cân logic; rèn luyện tư duy bảo toàn khối lượng và suy luận so sánh gián tiếp.
3. Dãy số & Quy luật logic: Rèn luyện tìm kiếm quy luật dãy số tăng dần, điền số còn thiếu và giải mã mê cung số học.
Mục tiêu giúp con nâng cao khả năng phân tích logic, liên kết hình khối và phát triển tư duy định lượng vững chắc.`
    }
    return `Tháng tới, các con sẽ bước vào giai đoạn nâng cao và hoàn thiện chuyên đề Toán tư duy Columbus:
1. Tư duy thuật toán & Kế hoạch nhiều bước: Chinh phục thử thách Tháp Hà Nội mini, rèn luyện năng lực tư duy tuần tự và lập chiến lược tối ưu số bước di chuyển.
2. Tư duy tích hợp & Giải quyết vấn đề: Vận dụng toàn diện các kiến thức về không gian, hình học và số học vào các bài tập logic thực tế trong sách hoạt động chuyên sâu.
3. Đánh giá năng lực & Dự án sáng tạo: Tham gia bài đánh giá năng lực tư duy cuối kỳ, thuyết trình giải pháp và vinh danh sự bứt phá của con.
Mục tiêu giúp con làm chủ phương pháp tư duy độc lập, tự tin phản biện và sẵn sàng bứt phá ở các cấp độ tiếp theo.`
  }

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

import type { StudentGalleryPhoto } from '@/mocks/studentPhotos'
import { parseEvaluationPair } from './FormattedEvaluationContent'

export interface DetailedMonthlyReportForm {
  monthPeriod: string
  awardBadge: string
  teacherName: string
  sectionAContent: string
  sectionA1Content: string
  sectionA2Content: string
  sectionA1Highlight?: string
  sectionA1Note?: string
  sectionA2Knowledge?: string
  sectionA2Skill?: string
  galleryPhotos?: StudentGalleryPhoto[]
  sectionB1Content: string
  sectionB2StartLesson?: number
  sectionB2EndLesson?: number
  sectionB2Weeks: WeekReviewItem[]
  sectionB2Content: string
}

export function composeSectionA1(highlight: string = '', note: string = ''): string {
  const parts: string[] = []
  const cleanHighlight = highlight.trim()
  const cleanNote = note.trim()
  if (cleanHighlight) {
    parts.push(`Điểm nổi bật: ${cleanHighlight}`)
  }
  if (cleanNote) {
    parts.push(`Điểm cần lưu ý: ${cleanNote}`)
  }
  return parts.join('\n\n')
}

export function decomposeSectionA1(content: string = ''): { highlight: string; note: string } {
  if (!content) return { highlight: '', note: '' }
  const { part1, part2 } = parseEvaluationPair(content, 'Điểm nổi bật:', 'Điểm cần lưu ý:')
  if (!part1 && !part2 && content.trim()) {
    return { highlight: content.trim(), note: '' }
  }
  return { highlight: part1, note: part2 }
}

export function composeSectionA2(
  knowledge: string = '',
  skill: string = '',
  isMath: boolean = false
): string {
  const marker1 = isMath ? 'Kiến thức & Tư duy:' : 'Từ vựng & Phonics:'
  const marker2 = isMath ? 'Kỹ năng giải toán:' : 'Cấu trúc & Mẫu câu:'
  const parts: string[] = []
  const cleanKnowledge = knowledge.trim()
  const cleanSkill = skill.trim()
  if (cleanKnowledge) {
    parts.push(`${marker1} ${cleanKnowledge}`)
  }
  if (cleanSkill) {
    parts.push(`${marker2} ${cleanSkill}`)
  }
  return parts.join('\n\n')
}

export function decomposeSectionA2(
  content: string = '',
  isMath: boolean = false
): { knowledge: string; skill: string } {
  if (!content) return { knowledge: '', skill: '' }

  const lower = content.toLowerCase()
  const isActuallyEnglish = lower.includes('từ vựng') || lower.includes('phonics') || lower.includes('mẫu câu')
  const isActuallyMath = lower.includes('kiến thức') || lower.includes('tư duy') || lower.includes('giải toán')

  const effectiveIsMath = isActuallyEnglish ? false : isActuallyMath ? true : isMath

  const marker1 = effectiveIsMath ? 'Kiến thức & Tư duy:' : 'Từ vựng & Phonics:'
  const marker2 = effectiveIsMath ? 'Kỹ năng giải toán:' : 'Cấu trúc & Mẫu câu:'

  let res = parseEvaluationPair(content, marker1, marker2)
  if (!res.part1 && !res.part2) {
    const alt1 = effectiveIsMath ? 'Từ vựng & Phonics:' : 'Kiến thức & Tư duy:'
    const alt2 = effectiveIsMath ? 'Cấu trúc & Mẫu câu:' : 'Kỹ năng giải toán:'
    res = parseEvaluationPair(content, alt1, alt2)
  }

  if (!res.part1 && !res.part2 && content.trim()) {
    return { knowledge: content.trim(), skill: '' }
  }

  return { knowledge: res.part1, skill: res.part2 }
}

export interface MonthlyAwardCriterion {
  title: string
  criteria: string
  meaning: string
}

export const MONTHLY_AWARDS_CRITERIA: MonthlyAwardCriterion[] = [
  {
    title: '🌟 SIÊU SAO TOÁN HỌC',
    criteria: 'Chuyên cần 100%, hoàn thành đầy đủ BTVN trên app với kết quả cao, nắm chắc kiến thức đã học, giải bài nhanh – chính xác và biết vận dụng linh hoạt các phương pháp tư duy.',
    meaning: 'Vinh danh học viên có kết quả học tập toàn diện và nổi bật trong tháng.',
  },
  {
    title: '🚀 NGÔI SAO BỨT PHÁ',
    criteria: 'Có sự tiến bộ vượt bậc so với tháng trước về kết quả bài tập, tốc độ tư duy và khả năng giải quyết vấn đề; từ còn phụ thuộc vào gợi ý sang chủ động tìm cách giải và trình bày được hướng tư duy của mình.',
    meaning: 'Động viên tinh thần nỗ lực vượt qua giới hạn và bứt phá năng lực tư duy của học viên.',
  },
  {
    title: '⭐️ NGÔI SAO CHĂM CHỈ',
    criteria: 'Đi học đầy đủ, đúng giờ, luôn hoàn thành BTVN đúng hạn, chuẩn bị bài nghiêm túc, tập trung trong giờ học và tích cực phối hợp với giáo viên trong các hoạt động tư duy.',
    meaning: 'Biểu dương ý thức kỷ luật, tinh thần tự giác và thái độ học tập tích cực của học viên.',
  },
  {
    title: '🏆 CAO THỦ GIẢI TOÁN',
    criteria: 'Có nỗ lực rõ rệt trong việc khắc phục những dạng bài còn yếu; giảm các lỗi tính toán, lỗi suy luận và biết vận dụng tốt hơn các phương pháp tư duy đã được hướng dẫn.',
    meaning: 'Ghi nhận sự kiên trì, tinh thần không bỏ cuộc và những tiến bộ từng bước của học viên.',
  },
  {
    title: '💡 NHÀ KHÁM PHÁ TOÁN HỌC',
    criteria: 'Biết tìm tòi nhiều cách giải khác nhau, đưa ra cách tiếp cận riêng cho bài toán, phát hiện quy luật nhanh hoặc có những cách suy luận độc đáo và hợp lý.',
    meaning: 'Khuyến khích khả năng tư duy mở, sự sáng tạo và thói quen tìm kiếm nhiều hướng giải quyết vấn đề.',
  },
  {
    title: '🧠 THÁM TỬ TOÁN HỌC',
    criteria: 'Chủ động tham gia các hoạt động tư duy, tích cực trình bày cách giải, biết giải thích vì sao mình chọn phương pháp đó, đặt câu hỏi và sẵn sàng chia sẻ cách suy luận với giáo viên, bạn bè.',
    meaning: 'Khích lệ học viên chủ động suy nghĩ, diễn đạt tư duy mạch lạc và tự tin trong quá trình giải quyết vấn đề.',
  },
]

export const ENGLISH_MONTHLY_AWARDS_CRITERIA: MonthlyAwardCriterion[] = [
  {
    title: '🌟 SIÊU SAO TIẾNG ANH',
    criteria: 'Chuyên cần 100%, tự tin giao tiếp cùng giáo viên bản ngữ, phát âm chuẩn, từ vựng phong phú và bài kiểm tra định kỳ đạt điểm xuất sắc.',
    meaning: 'Vinh danh học viên có thành tích học tập toàn diện và phản xạ tiếng Anh nổi bật trong tháng.',
  },
  {
    title: '🚀 NGÔI SAO BỨT PHÁ',
    criteria: 'Tiến bộ vượt bậc về sự tự tin, phát âm ngữ điệu tự nhiên và chủ động tham gia các hoạt động hội thoại nhóm trên lớp.',
    meaning: 'Động viên tinh thần nỗ lực bứt phá năng lực ngôn ngữ của học viên.',
  },
  {
    title: '⭐️ NGÔI SAO CHĂM CHỈ',
    criteria: 'Đi học đầy đủ, đúng giờ, hoàn thành bài tập về nhà và phiếu luyện tập đầy đủ, tích cực tương tác trong giờ học.',
    meaning: 'Biểu dương tinh thần tự giác và ý thức rèn luyện tiếng Anh chuyên cần.',
  },
  {
    title: '🏆 CAO THỦ TIẾNG ANH',
    criteria: 'Có nỗ lực rõ rệt trong việc cải thiện phát âm âm đuôi, ngữ pháp và mở rộng vốn từ vựng học thuật.',
    meaning: 'Ghi nhận sự kiên trì và tiến bộ vững chắc của học viên.',
  },
  {
    title: '💡 NHÀ KHÁM PHÁ NGÔN NGỮ',
    criteria: 'Yêu thích đọc truyện tiếng Anh, tò mò tìm hiểu từ mới và sáng tạo trong các bài thuyết trình, dự án.',
    meaning: 'Khuyến khích niềm đam mê khám phá ngôn ngữ và thế giới.',
  },
  {
    title: '🗣️ ĐẠI SỨ GIAO TIẾP',
    criteria: 'Tự tin thuyết trình trước đám đông, diễn đạt ý kiến mạch lạc và truyền cảm hứng tiếng Anh tới các bạn trong lớp.',
    meaning: 'Khích lệ năng lực diễn thuyết và khả năng sử dụng tiếng Anh tự tin.',
  },
]

export const AWARD_BADGES = MONTHLY_AWARDS_CRITERIA.map((a) => a.title)
export const ENGLISH_AWARD_BADGES = ENGLISH_MONTHLY_AWARDS_CRITERIA.map((a) => a.title)

export function normalizeAwardBadge(badge?: string): string {
  if (!badge) return ''
  const trimmed = badge.trim()
  if (!trimmed) return ''

  // 1. Nếu badge đã có sẵn chính xác trong danh mục Tiếng Anh hoặc Toán học thì giữ nguyên
  const allKnownBadges = [...ENGLISH_AWARD_BADGES, ...AWARD_BADGES]
  const exactMatch = allKnownBadges.find((b) => b === trimmed)
  if (exactMatch) return exactMatch

  const lower = trimmed.toLowerCase()

  // 2. Nhóm danh hiệu Tiếng Anh
  if (lower.includes('tiếng anh') || lower.includes('anh') || lower.includes('english')) {
    if (lower.includes('siêu sao') || lower.includes('xuất sắc')) return '🌟 SIÊU SAO TIẾNG ANH'
    if (lower.includes('cao thủ')) return '🏆 CAO THỦ TIẾNG ANH'
    if (lower.includes('bứt phá') || lower.includes('chiến binh')) return '🚀 NGÔI SAO BỨT PHÁ'
    if (lower.includes('chăm')) return '⭐️ NGÔI SAO CHĂM CHỈ'
    if (lower.includes('khám phá')) return '💡 NHÀ KHÁM PHÁ NGÔN NGỮ'
    if (lower.includes('giao tiếp') || lower.includes('đại sứ')) return '🗣️ ĐẠI SỨ GIAO TIẾP'
    return trimmed
  }

  // 3. Nhóm danh hiệu Toán học
  if (lower.includes('toán') || lower.includes('math')) {
    if (lower.includes('siêu sao') || lower.includes('xuất sắc')) return '🌟 SIÊU SAO TOÁN HỌC'
    if (lower.includes('giải toán') || lower.includes('cao thủ')) return '🏆 CAO THỦ GIẢI TOÁN'
    if (lower.includes('khám phá')) return '💡 NHÀ KHÁM PHÁ TOÁN HỌC'
    if (lower.includes('thám tử')) return '🧠 THÁM TỬ TOÁN HỌC'
    return trimmed
  }

  // 4. Nhóm danh hiệu chung
  if (lower.includes('bứt phá') || lower.includes('chiến binh')) return '🚀 NGÔI SAO BỨT PHÁ'
  if (lower.includes('chăm')) return '⭐️ NGÔI SAO CHĂM CHỈ'

  // 5. Nếu người dùng tự gõ danh hiệu riêng -> Giữ nguyên tuyệt đối (Tự điền)
  return trimmed
}

export const DEFAULT_FILLED_REPORT_FORM: DetailedMonthlyReportForm = {
  monthPeriod: '01/04/2026 đến 30/04/2026',
  awardBadge: '',
  teacherName: 'Ms.Chloe',
  sectionAContent: '',
  sectionA1Content: '',
  sectionA2Content: '',
  galleryPhotos: [],
  sectionB1Content: getAiSynthesizedNextMonthPlan(8, 10),
  sectionB2StartLesson: undefined,
  sectionB2EndLesson: undefined,
  sectionB2Weeks: DEFAULT_SECTION_B2_WEEKS,
  sectionB2Content: getReviewContentForRange(8, 10),
}

export const EMPTY_REPORT_FORM: DetailedMonthlyReportForm = {
  monthPeriod: '01/04/2026 đến 30/04/2026',
  awardBadge: '',
  teacherName: 'Ms.Chloe',
  sectionAContent: '',
  sectionA1Content: '',
  sectionA2Content: '',
  galleryPhotos: [],
  sectionB1Content: '',
  sectionB2StartLesson: undefined,
  sectionB2EndLesson: undefined,
  sectionB2Weeks: [],
  sectionB2Content: '',
}

export interface ReportEditStatus {
  canEdit: boolean
  isLocked: boolean
  daysRemaining: number
  deadlineText: string
  issuedDateText: string
  statusLabel: string
  statusMessage: string
}

export const REPORT_AUTOMATION_INFO = {
  title: 'Cơ chế Báo cáo Học tập Tự động & Hạn mức Chỉnh sửa',
  summary:
    'Hệ thống tự động tổng hợp báo cáo học tập định kỳ hàng tháng từ toàn bộ dữ liệu học tập của học viên, đồng thời áp dụng cơ chế khóa sau 5 ngày để bảo đảm tính thống nhất và minh bạch khi gửi phụ huynh.',
  sections: [
    {
      title: '1. Nguồn dữ liệu tổng hợp tự động',
      content:
        'Vào 00:00 ngày đầu tiên của tháng mới, hệ thống tự động quét và tổng hợp dữ liệu học tập tháng trước gồm: (1) Chuyên cần & tỷ lệ có mặt, (2) Điểm trung bình BTVN trên app, (3) Điểm kiểm tra định kỳ, (4) Thư viện hình ảnh & video sản phẩm từ các buổi học Dự án, và (5) Kế hoạch học tập gợi ý từ khung chương trình.',
    },
    {
      title: '2. Thời hạn rà soát & chỉnh sửa (05 ngày)',
      content:
        'Giáo viên và nhân viên chăm sóc (CSM) được phép rà soát, cá nhân hóa lời nhận xét, chọn hình ảnh tiêu biểu và cập nhật danh hiệu tuyên dương trong vòng 05 ngày kể từ ngày hệ thống phát hành tự động (từ ngày 01 đến 23:59 ngày 05 hàng tháng).',
    },
    {
      title: '3. Cơ chế tự động khóa dữ liệu',
      content:
        'Sau 23:59 ngày thứ 5 của kỳ phát hành, báo cáo sẽ tự động khóa tính năng chỉnh sửa (chế độ chỉ đọc). Toàn bộ dữ liệu được đóng băng để đảm bảo tính nhất quán với bản phụ huynh xem qua Landing Page và tin nhắn. Trường hợp đặc biệt cần điều chỉnh sau hạn, nhân sự cần gửi yêu cầu mở khóa đến Quản lý cơ sở hoặc Ban giám đốc.',
    },
  ],
}

export function getMonthlyReportEditStatus(monthOptionValue: string = '4_5_2026'): ReportEditStatus {
  // Mốc thời gian hệ thống vận hành demo: Tháng 5/2026
  if (monthOptionValue === '4_5_2026') {
    return {
      canEdit: true,
      isLocked: false,
      daysRemaining: 2,
      deadlineText: '23:59 05/05/2026',
      issuedDateText: '00:00 01/05/2026',
      statusLabel: 'Còn 2 ngày chỉnh sửa',
      statusMessage:
        'Báo cáo được hệ thống tự động tạo ngày 01/05/2026. Cho phép chỉnh sửa trong vòng 5 ngày (hạn chót: 23:59 05/05/2026 - còn 2 ngày). Sau 5 ngày hệ thống sẽ tự động khóa dữ liệu.',
    }
  }

  if (monthOptionValue === '5_6_2026' || monthOptionValue === '6_7_2026' || monthOptionValue === '7_8_2026') {
    return {
      canEdit: true,
      isLocked: false,
      daysRemaining: 5,
      deadlineText: '5 ngày kể từ ngày phát hành',
      issuedDateText: 'Kỳ dự thảo (Chưa chốt)',
      statusLabel: 'Kỳ dự thảo',
      statusMessage: 'Kỳ báo cáo đang chuẩn bị, cho phép cập nhật nội dung trước ngày phát hành tự động.',
    }
  }

  // Kỳ quá khứ: 3_4_2026, 2_3_2026...
  const pastDeadline = monthOptionValue === '3_4_2026' ? '05/04/2026' : '05/03/2026'
  const pastIssued = monthOptionValue === '3_4_2026' ? '01/04/2026' : '01/03/2026'
  return {
    canEdit: false,
    isLocked: true,
    daysRemaining: 0,
    deadlineText: pastDeadline,
    issuedDateText: pastIssued,
    statusLabel: 'Đã khóa chỉnh sửa',
    statusMessage: `Báo cáo đã khóa sau 5 ngày kể từ ngày phát hành (${pastIssued}) để bảo toàn dữ liệu đã gửi phụ huynh.`,
  }
}

export function getStudentReportMetrics(studentId?: string, studentName?: string, studentCode?: string) {
  const alert = mockCareAlerts.find(
    (a) =>
      (studentId && a.studentId === studentId) ||
      (a.studentName &&
        studentName &&
        a.studentName.toLowerCase().includes(studentName.toLowerCase())) ||
      (a.classCode && studentCode && a.classCode === studentCode)
  )

  if (alert) {
    return {
      attendanceRatio: alert.attendanceRatio || '5/7',
      lateCount: alert.attendanceRatio?.includes('5/7') ? 1 : 0,
      homeworkRatio: `${Math.round(7 * ((alert.homeworkCompletion || 90) / 100))}/7`,
      homeworkAvg: '7.5',
      testScore: alert.lastTestScore ?? 8.0,
      priorTestScore: alert.priorTestScore ?? 5.5,
    }
  }

  return {
    attendanceRatio: '5/7',
    lateCount: 1,
    homeworkRatio: '7/7',
    homeworkAvg: '7.5',
    testScore: 8.0,
    priorTestScore: 5.5,
  }
}

export function resolveMonthValue(key?: string): string {
  if (!key) return '4_5_2026'
  const match = MONTH_OPTIONS.find(
    (m) => m.value === key || m.monthKey === key || m.label.includes(key) || key.includes(m.current)
  )
  return match ? match.value : '4_5_2026'
}




