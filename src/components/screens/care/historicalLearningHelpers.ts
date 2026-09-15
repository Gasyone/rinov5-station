import { mockBookingTests, type BookingTest } from '@/mocks/bookingTests'
import { MOCK_TRIAL_CLASSES, type TrialClass, type TrialClassStatus } from '@/mocks/trialClasses'

export interface HistoricalRadarSkill {
  label: string
  score: number
  textClass: string
  barClass: string
}

export interface HistoricalTestData {
  id: string
  bookingRaw?: BookingTest
  testDate: string
  testTime: string
  status: string
  statusLabel: string
  program: string
  branch: string
  targetLevel: string
  achievedLevel: string
  reportLink: string
  onlineTestLink: string
  totalScore: string
  skills: HistoricalRadarSkill[]
  strengths: string
  improvements: string
  teacherName: string
}

export interface HistoricalTrialData {
  id: string
  trialRaw?: TrialClass
  trialDate: string
  branch: string
  status: TrialClassStatus
  statusLabel: string
  teacherName: string
  rating: number
  ratingLabel: string
  quote: string
  feedbackSections: {
    whatLearned: string[]
    highlights: string[]
    improvements: string[]
    reminders: string[]
  }
}

export function getStudentHistoricalTest(
  studentName: string,
  branchName: string = 'RinoEdu Nguyễn Tuân',
  isEnglish: boolean = true
): HistoricalTestData {
  const normalizedName = studentName.trim().toLowerCase()
  const matched = mockBookingTests.find(
    (b) => b.childName.trim().toLowerCase() === normalizedName
  ) || mockBookingTests[0]

  const skills: HistoricalRadarSkill[] = isEnglish
    ? [
        { label: 'Phản xạ', score: 50, textClass: 'text-sky-600 dark:text-sky-400', barClass: 'bg-sky-500' },
        { label: 'Phát âm', score: 50, textClass: 'text-rose-600 dark:text-rose-400', barClass: 'bg-rose-500' },
        { label: 'Từ - Cấu trúc', score: 50, textClass: 'text-amber-600 dark:text-amber-400', barClass: 'bg-amber-500' },
        { label: 'Đọc - Viết', score: 50, textClass: 'text-emerald-600 dark:text-emerald-400', barClass: 'bg-emerald-500' },
        { label: 'Nghe hiểu', score: 50, textClass: 'text-indigo-600 dark:text-indigo-400', barClass: 'bg-indigo-500' },
      ]
    : [
        { label: 'Phản xạ logic', score: 60, textClass: 'text-sky-600 dark:text-sky-400', barClass: 'bg-sky-500' },
        { label: 'Hình khối', score: 75, textClass: 'text-rose-600 dark:text-rose-400', barClass: 'bg-rose-500' },
        { label: 'Số học nhẩm', score: 65, textClass: 'text-amber-600 dark:text-amber-400', barClass: 'bg-amber-500' },
        { label: 'Đọc hiểu đề', score: 70, textClass: 'text-emerald-600 dark:text-emerald-400', barClass: 'bg-emerald-500' },
        { label: 'Tập trung logic', score: 80, textClass: 'text-indigo-600 dark:text-indigo-400', barClass: 'bg-indigo-500' },
      ]

  return {
    id: matched?.id || 'BT-2605-001',
    bookingRaw: matched,
    testDate: '10/08/2026',
    testTime: '18:00',
    status: matched?.status || 'completed',
    statusLabel: 'Đã test đầu vào',
    program: isEnglish ? 'Anh văn Thiếu nhi (Movers)' : 'Toán tư duy (Tiểu học)',
    branch: branchName || matched?.school || 'RinoEdu Nguyễn Tuân',
    targetLevel: isEnglish ? 'Flyers Intensive Cấp độ 3' : 'Tư duy Tiểu học Cấp độ 2',
    achievedLevel: isEnglish ? 'Level 3B - B' : 'Level 2A - A',
    reportLink: '/app/booking_test',
    onlineTestLink: 'https://rinoedu.ai',
    totalScore: isEnglish ? '90/100' : '85/100',
    skills,
    strengths: isEnglish
      ? 'Ghi nhớ từ vựng nhanh qua ngữ cảnh, tự giác học tập.'
      : 'Tư duy logic nhạy bén, khả năng suy luận và tính nhẩm tốt.',
    improvements: isEnglish
      ? 'Cần rèn thêm kỹ năng viết luận tiếng Anh học thuật và phản xạ giao tiếp.'
      : 'Cần cẩn thận hơn trong các bài toán đố hình học không gian.',
    teacherName: matched?.teacher || matched?.tester || 'Sarah Smith',
  }
}

export function getStudentHistoricalTrial(
  studentName: string,
  branchName: string = 'RinoEdu Nguyễn Tuân',
  isEnglish: boolean = true
): HistoricalTrialData {
  const normalizedName = studentName.trim().toLowerCase()
  const matched = MOCK_TRIAL_CLASSES.find(
    (t) => t.studentName.trim().toLowerCase() === normalizedName
  ) || MOCK_TRIAL_CLASSES[0]

  const status: TrialClassStatus = 'pending_approval'

  return {
    id: matched?.id || 'TR-2605-001',
    trialRaw: matched,
    trialDate: '25/08/2026 18:00',
    branch: branchName || matched?.branch || 'RinoEdu Nguyễn Tuân',
    status,
    statusLabel: 'Chờ xác nhận',
    teacherName: isEnglish ? 'Sarah Smith' : 'Bùi Phương Anh',
    rating: 4,
    ratingLabel: 'Good',
    quote: 'Học lực Khá Giỏi ở trường THCS, tự giác cao, cần rèn thêm kỹ năng viết luận tiếng Anh học thuật.',
    feedbackSections: {
      whatLearned: [
        'Con đã học về các từ vựng: hen, horse 🐔 🐴',
        'Luyện tập cấu trúc câu: "What is that? It\'s a hen."',
        'Học âm Ff với các từ: fish, fork 🐟 🍴',
      ],
      highlights: [
        'Con rất tốt trong phần Từ vựng (4/5) và Phát âm (4/5) – cô khen con vì đã nhớ bài rất nhanh! 🌟',
      ],
      improvements: [
        'Phần Ngữ pháp (2/5) và Nói (2/5) con cần luyện tập thêm để phản xạ tự nhiên hơn nhé.',
        'Con hãy cố gắng đặt câu đầy đủ và luyện nói nhiều hơn để cải thiện khả năng giao tiếp nha! 🗣️',
      ],
      reminders: [
        'Con hãy ôn lại các từ vựng và cấu trúc đã học để ghi nhớ lâu hơn nhé!',
      ],
    },
  }
}
