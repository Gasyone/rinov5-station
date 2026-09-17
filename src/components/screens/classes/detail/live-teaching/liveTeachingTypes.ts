export type MaterialType = 'pdf' | 'video' | 'audio' | 'project'

export interface TeachingMaterial {
  id: string
  title: string
  type: MaterialType
  url: string
  badgeLabel?: string
  description?: string
  totalPages?: number
  defaultPage?: number
}

export interface LessonActivity {
  phase: string
  duration: string
  content: string
  teachingTip?: string
}

export interface LessonGuide {
  topic: string
  gradeLevel: string
  duration: string
  targets: string[]
  competencies: string[]
  activities: LessonActivity[]
  teacherNotes: string
}

export interface LiveQuickTag {
  id: string
  label: string
  shortLabel: string
  icon: string
  category: 'math' | 'logic' | 'attitude' | 'homework' | 'english'
  colorClass: string
  feedbackMapping?: {
    field: string
    value: unknown
    noteText?: string
  }
}

export interface StudentLiveLog {
  studentId: string
  tags: string[]
  quickNote: string
  starsEarned: number
  hasVoiceMemo?: boolean
  voiceMemoText?: string
  lastUpdated?: string
}

export const MATH_LIVE_TAGS: LiveQuickTag[] = [
  // 1. Tư duy Toán học
  {
    id: 'tag_math_split',
    label: 'Tách chục & đơn vị',
    shortLabel: 'Tách số',
    icon: '🔢',
    category: 'math',
    colorClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    feedbackMapping: {
      field: 'mathMath',
      value: 5,
      noteText: 'Vận dụng tốt phép tách số thành hàng chục và đơn vị',
    },
  },
  {
    id: 'tag_math_grid',
    label: 'Vị trí hàng & cột',
    shortLabel: 'Hàng & cột',
    icon: '📍',
    category: 'math',
    colorClass: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
    feedbackMapping: {
      field: 'mathBasic',
      value: 5,
      noteText: 'Xác định nhanh vị trí các số theo hàng và cột trên bảng 100',
    },
  },
  {
    id: 'tag_math_domino',
    label: 'Tạo số Domino phạm vi 50',
    shortLabel: 'Domino 50',
    icon: '🎲',
    category: 'math',
    colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
    feedbackMapping: {
      field: 'mathCreative',
      value: 5,
      noteText: 'Sáng tạo khi tạo số có 2 chữ số trong phạm vi 50 bằng quân domino',
    },
  },

  // 2. Tư duy Logic
  {
    id: 'tag_logic_pattern',
    label: 'Suy luận quy luật dấu chân',
    shortLabel: 'Quy luật',
    icon: '🧩',
    category: 'logic',
    colorClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    feedbackMapping: {
      field: 'mathLogic',
      value: 5,
      noteText: 'Xác định xuất sắc quy luật tăng giảm của các số qua dấu chân',
    },
  },
  {
    id: 'tag_logic_reasoning',
    label: 'Lập luận & giải thích',
    shortLabel: 'Lập luận +',
    icon: '💡',
    category: 'logic',
    colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    feedbackMapping: {
      field: 'mathCritical',
      value: 5,
      noteText: 'Tự tin giải thích cách tìm ra đáp án trước lớp',
    },
  },

  // 3. Thái độ & Cần rèn luyện
  {
    id: 'tag_att_active',
    label: 'Hăng hái giơ tay phát biểu',
    shortLabel: 'Hăng hái 🌟',
    icon: '🙋',
    category: 'attitude',
    colorClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    feedbackMapping: {
      field: 'attitude',
      value: 5,
      noteText: 'Rất chủ động tương tác và hăng hái phát biểu trong giờ học',
    },
  },
  {
    id: 'tag_att_careless',
    label: 'Tính nháp vội vàng / nhầm số',
    shortLabel: 'Nháp ẩu ⚠️',
    icon: '⚠️',
    category: 'attitude',
    colorClass: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800',
    feedbackMapping: {
      field: 'mathBasicWeakness',
      value: 'Cần cẩn thận hơn khi đặt phép tính nháp',
      noteText: 'Con cần cẩn thận hơn khi đặt phép tính nháp để tránh nhầm lẫn',
    },
  },
  {
    id: 'tag_hw_missing',
    label: 'Chưa hoàn thành BTVN',
    shortLabel: 'Thiếu BTVN ❌',
    icon: '📝',
    category: 'homework',
    colorClass: 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
    feedbackMapping: {
      field: 'homeworkBook',
      value: 'Chưa làm',
      noteText: 'Chưa làm bài tập về nhà trong sách',
    },
  },
]

export const ENGLISH_LIVE_TAGS: LiveQuickTag[] = [
  {
    id: 'tag_eng_pron_good',
    label: 'Phát âm chuẩn & rõ âm đuôi',
    shortLabel: 'Phát âm +',
    icon: '🗣️',
    category: 'english',
    colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    feedbackMapping: {
      field: 'pronunciation',
      value: 5,
      noteText: 'Phát âm to, rõ ràng và chuẩn âm đuôi',
    },
  },
  {
    id: 'tag_eng_pron_miss',
    label: 'Nuốt âm đuôi / Phát âm chưa rõ',
    shortLabel: 'Âm đuôi ⚠️',
    icon: '⚠️',
    category: 'english',
    colorClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    feedbackMapping: {
      field: 'pronImproveNotes',
      value: 'Cần chú ý phát âm rõ các âm đuôi /s/, /t/',
      noteText: 'Cần chú ý phát âm rõ âm đuôi',
    },
  },
  {
    id: 'tag_eng_vocab_quick',
    label: 'Phản xạ từ vựng nhanh nhạy',
    shortLabel: 'Từ vựng ⚡',
    icon: '🧠',
    category: 'english',
    colorClass: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
    feedbackMapping: {
      field: 'vocabulary',
      value: 5,
      noteText: 'Ghi nhớ từ vựng tốt và phản xạ nhanh',
    },
  },
  {
    id: 'tag_eng_sentence_full',
    label: 'Nói đủ câu / Mẫu câu hoàn chỉnh',
    shortLabel: 'Nói đủ câu',
    icon: '🎯',
    category: 'english',
    colorClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    feedbackMapping: {
      field: 'speaking',
      value: 5,
      noteText: 'Biết trả lời bằng cấu trúc câu hoàn chỉnh',
    },
  },
  {
    id: 'tag_eng_active',
    label: 'Hăng hái tương tác',
    shortLabel: 'Hăng hái 🌟',
    icon: '🙋',
    category: 'attitude',
    colorClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    feedbackMapping: {
      field: 'attitude',
      value: 5,
      noteText: 'Rất tích cực tương tác hội thoại với giáo viên và các bạn',
    },
  },
  {
    id: 'tag_eng_hw_done',
    label: 'Đã hoàn thành BTVN App & Sách',
    shortLabel: 'Xong BTVN ✨',
    icon: '📝',
    category: 'homework',
    colorClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    feedbackMapping: {
      field: 'homeworkApp',
      value: 'Done',
      noteText: 'Đã hoàn thành đầy đủ bài tập',
    },
  },
]

export interface LiveConclusionStudentEval {
  studentId: string
  attitude: number
  homeworkApp: string
  homeworkBook: string
  // Math criteria (1-5)
  mathBasic?: number
  mathLogic?: number
  mathMath?: number
  mathCreative?: number
  mathCritical?: number
  // English criteria (1-5)
  vocabulary?: number
  grammar?: number
  speaking?: number
  pronunciation?: number
  // Sub-notes per individual skill (Vocabulary, Grammar, Speaking, Pronunciation, or Math skills)
  skillGoodNotes?: Record<string, string>
  skillImproveNotes?: Record<string, string>
  // Final feedback text
  strength?: string
  weakness?: string
  reminders?: string[]
  otherReminder?: string
  feedbackText: string
  isGenerated: boolean
  isSent?: boolean
}

export const MATH_MATERIALS: TeachingMaterial[] = [
  {
    id: 'mat_math_slide',
    title: 'Slide bài giảng J1_Pooka, Wooka (Tiết 2)',
    type: 'pdf',
    url: 'https://d28p5y0dwgfkyt.cloudfront.net/files/2025/09/12/1757661381_ttktcbpookawookatiet-2.pdf',
    badgeLabel: 'Slide chính',
    description: 'Bản trình chiếu tương tác về phép tách số & quy luật bảng 100',
    totalPages: 18,
    defaultPage: 2,
  },
  {
    id: 'mat_math_video',
    title: 'Video mô phỏng Domino 50 & Ghép số',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    badgeLabel: 'Video mô phỏng',
    description: 'Clip hướng dẫn học sinh thao tác ghép số phạm vi 50 bằng các quân domino',
  },
  {
    id: 'mat_math_worksheet',
    title: 'Phiếu bài tập rèn luyện bảng 100 (PDF)',
    type: 'pdf',
    url: 'https://d28p5y0dwgfkyt.cloudfront.net/files/2025/09/12/1757661381_ttktcbpookawookatiet-2.pdf',
    badgeLabel: 'Phiếu bài tập',
    description: 'Bài tập vận dụng điền số còn thiếu vào bảng 100',
    totalPages: 5,
    defaultPage: 1,
  },
]

export const ENGLISH_MATERIALS: TeachingMaterial[] = [
  {
    id: 'mat_eng_slide',
    title: 'Classroom Objects & Story Time (Slide chính)',
    type: 'pdf',
    url: 'https://d28p5y0dwgfkyt.cloudfront.net/files/2025/09/12/1757661381_ttktcbpookawookatiet-2.pdf',
    badgeLabel: 'Slide chính',
    description: 'Giáo trình Cambridge - Từ vựng đồ dùng học tập và truyện My Family Adventure',
    totalPages: 18,
    defaultPage: 2,
  },
  {
    id: 'mat_eng_audio',
    title: 'Story Time: My Family Adventure (Audio nghe)',
    type: 'audio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    badgeLabel: 'File nghe MP3',
    description: 'Audio giọng đọc bản ngữ bài đọc Story Time dành cho học sinh luyện nghe và nhắc lại',
  },
  {
    id: 'mat_eng_video',
    title: 'Classroom Chant & Phonics Song (Video bài hát)',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    badgeLabel: 'Video âm nhạc',
    description: 'Video bài hát vui nhộn ôn tập phát âm âm đuôi /s/, /t/ và từ vựng đồ dùng',
  },
]

export const MATH_LESSON_GUIDE: LessonGuide = {
  topic: 'J1_Pooka, Wooka (Tiết 2) — Phép tách số & Bảng 100',
  gradeLevel: 'Toán Tư Duy — Level J1',
  duration: '60 phút',
  targets: [
    'Biết xác định vị trí các số theo hàng và cột trên bảng 100.',
    'Nhận biết số có 2 chữ số gồm phần chục và đơn vị.',
    'Vận dụng linh hoạt phép tách số để tính nhẩm nhanh.',
    'Suy luận được quy luật bước chân của các con vật (Pooka, Wooka).',
  ],
  competencies: [
    '1. Tư duy cơ bản: Quan sát và định vị nhanh số trong bảng 100.',
    '2. Tư duy Logic: Tìm ra quy luật dãy số tăng/giảm.',
    '3. Tư duy Toán học: Bản chất phép tách số chục - đơn vị.',
    '4. Tư duy sáng tạo: Ghép quân Domino tạo thành các số khác nhau.',
    '5. Phản biện & GQVĐ: Diễn đạt bằng lời lý do chọn đáp án trước lớp.',
  ],
  activities: [
    {
      phase: '1. Khởi động (Warm-up)',
      duration: '10 phút',
      content: 'Trò chơi "Ai nhanh hơn": Nhận diện nhanh vị trí các số trên bảng 100 theo hàng và cột.',
      teachingTip: 'Gọi luân phiên các bạn nhút nhát để khích lệ tinh thần đầu giờ.',
    },
    {
      phase: '2. Khám phá (Discovery)',
      duration: '20 phút',
      content: 'Dẫn dắt câu chuyện Pooka & Wooka: Quan sát dấu chân để tìm ra quy luật tăng giảm của các ô số.',
      teachingTip: 'Nhắc học sinh quan sát hàng đơn vị trước khi kết luận số chục.',
    },
    {
      phase: '3. Thực hành (Practice)',
      duration: '20 phút',
      content: 'Hoạt động nhóm: Dùng các quân cờ Domino 50 để tách ghép thành số có 2 chữ số.',
      teachingTip: 'Quan sát các bạn tính nháp ẩu để nhắc nhở con cẩn thận hơn.',
    },
    {
      phase: '4. Vận dụng & Củng cố (Wrap-up)',
      duration: '10 phút',
      content: 'Tổng kết bài học, bình chọn Ngôi sao tích cực của buổi học.',
      teachingTip: 'Tốc ký các bạn có biểu hiện xuất sắc hoặc cần hỗ trợ để chuyển sang form đánh giá.',
    },
  ],
  teacherNotes: 'Lưu ý học sinh hay nhầm lẫn giữa hàng chục và hàng đơn vị ở các số có chữ số giống nhau (như 33, 44). Hãy dùng màu sắc phân biệt.',
}

export const ENGLISH_LESSON_GUIDE: LessonGuide = {
  topic: 'Classroom Objects & Story Time: My Family Adventure',
  gradeLevel: 'Cambridge Primary / IELTS Junior — Level 2',
  duration: '60 phút',
  targets: [
    'Nhận diện và phát âm chuẩn 6 từ vựng đồ dùng học tập (pencil, eraser, notebook, classroom, teacher, student).',
    'Nắm vững cấu trúc hỏi đáp: "What is this? - It is a..." và đại từ chỉ định This/That.',
    'Luyện đọc và nghe hiểu câu chuyện "My Family Adventure".',
    'Tự tin giao tiếp theo cặp, trả lời bằng mẫu câu đầy đủ.',
  ],
  competencies: [
    '1. Vocabulary: Nắm vững từ vựng chủ đề trường học.',
    '2. Grammar & Structures: Sử dụng chính xác đại từ This / That.',
    '3. Speaking & Fluency: Giao tiếp tự nhiên, phản xạ có nhịp điệu.',
    '4. Pronunciation: Bật chuẩn các âm đuôi /s/, /t/, /k/.',
  ],
  activities: [
    {
      phase: '1. Warm-up & Phonics Chant',
      duration: '10 phút',
      content: 'Hát bài hát Classroom Chant kết hợp cử điệu tay để khởi động cơ miệng.',
      teachingTip: 'Uốn nắn ngay các bạn phát âm nuốt âm đuôi /s/.',
    },
    {
      phase: '2. Vocabulary & Structures',
      duration: '20 phút',
      content: 'Học từ vựng qua hình ảnh trực quan và luyện cấu trúc "What is this? - It\'s a...".',
      teachingTip: 'Khuyến khích học sinh nói cả câu thay vì chỉ nói từ đơn lẻ.',
    },
    {
      phase: '3. Story Time & Listening',
      duration: '20 phút',
      content: 'Bật audio nghe bài My Family Adventure và gọi học sinh đóng vai nhân vật đối thoại.',
      teachingTip: 'Bật audio từng đoạn ngắn để học sinh nhắc lại (shadowing).',
    },
    {
      phase: '4. Pair-work & Wrap-up',
      duration: '10 phút',
      content: 'Thực hành hỏi đáp theo cặp về đồ dùng trong cặp sách của mình.',
      teachingTip: 'Ghi nhận tag tốc ký cho các bạn nói lưu loát và tự tin.',
    },
  ],
  teacherNotes: 'Chú ý học sinh người Việt hay quên bật âm gió đuôi. Cần nhấn mạnh bằng cử chỉ tay mỗi khi phát âm từ có âm /s/.',
}

