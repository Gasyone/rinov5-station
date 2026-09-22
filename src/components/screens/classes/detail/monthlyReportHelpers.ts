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

import type { StudentGalleryPhoto } from '@/mocks/studentPhotos'

export interface DetailedMonthlyReportForm {
  monthPeriod: string
  awardBadge: string
  teacherName: string
  sectionAContent: string
  sectionA1Content: string
  sectionA2Content: string
  galleryPhotos?: StudentGalleryPhoto[]
  sectionB1Content: string
  sectionB2StartLesson: number
  sectionB2EndLesson: number
  sectionB2Weeks: WeekReviewItem[]
  sectionB2Content: string
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

export const AWARD_BADGES = MONTHLY_AWARDS_CRITERIA.map((a) => a.title)

export function normalizeAwardBadge(badge?: string): string {
  if (!badge) return ''
  const found = AWARD_BADGES.find(
    (b) => b === badge || b.includes(badge) || badge.includes(b.replace(/^[^\s]+\s+/, ''))
  )
  if (found) return found
  const lower = badge.toLowerCase()
  if (lower.includes('bứt phá') || lower.includes('chiến binh')) return '🚀 NGÔI SAO BỨT PHÁ'
  if (lower.includes('tiến bộ') || lower.includes('giải toán')) return '🏆 CAO THỦ GIẢI TOÁN'
  if (lower.includes('chăm')) return '⭐️ NGÔI SAO CHĂM CHỈ'
  if (lower.includes('xuất sắc') || lower.includes('siêu sao')) return '🌟 SIÊU SAO TOÁN HỌC'
  if (lower.includes('sáng tạo') || lower.includes('khám phá')) return '💡 NHÀ KHÁM PHÁ TOÁN HỌC'
  if (lower.includes('thám tử')) return '🧠 THÁM TỬ TOÁN HỌC'
  return badge
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
  sectionB2StartLesson: 8,
  sectionB2EndLesson: 10,
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
  sectionB2StartLesson: 8,
  sectionB2EndLesson: 10,
  sectionB2Weeks: [
    { weekNum: 1, title: 'Tuần 1', content: '', docLink: '', thumbnailUrl: '' },
    { weekNum: 2, title: 'Tuần 2', content: '', docLink: '', thumbnailUrl: '' },
    { weekNum: 3, title: 'Tuần 3', content: '', docLink: '', thumbnailUrl: '' },
    { weekNum: 4, title: 'Tuần 4', content: '', docLink: '', thumbnailUrl: '' },
  ],
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




