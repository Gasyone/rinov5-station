'use client'

import { stableHash } from './operationsAlertHelpers'

export interface SessionHistory {
  id: string
  sessionNumber: number
  date: string
  topic: string
  type: 'lesson' | 'test'
  attendance: 'present' | 'absent' | 'late' | 'excused'
  homework: 'submitted' | 'not_submitted' | 'late'
  rating: number
  score: number | null
  comment: string | null
  // English skills scores (optional)
  listening?: string
  reading?: string
  writing?: string
  speaking?: string
  overall?: string
}

export interface SemesterEvaluationData {
  month: string
  attitude: number
  knowledge: number
  skills: number
  interaction: number
  comment: string
  evaluator: string
}


export const TOPICS = [
  'Grammar Structures in Writing', 'Listening Comprehension - Part 1',
  'Reading Strategies: Skimming & Scanning', 'Speaking Practice: Daily Topics',
  'Vocabulary: Academic Word List', 'Writing Task 2: Opinion Essay',
  'Pronunciation & Intonation', 'Reading: True/False/Not Given',
  'Midterm Test', 'Grammar Review & Practice',
  'Speaking: Describe a Place', 'Final Test',
]

export const COMMENTS_POOL = [
  'Học tập chăm chỉ, phát biểu tích cực trong lớp.',
  'Cần cải thiện phần phát âm, đặc biệt nguyên âm dài.',
  'Tiến bộ rõ rệt so với tháng trước, đặc biệt kỹ năng viết.',
  'Hoàn thành bài tập đầy đủ nhưng cần chú ý lỗi ngữ pháp.',
  'Tương tác tốt với bạn cùng nhóm, có khả năng dẫn dắt.',
  'Cần tập trung hơn trong giờ học, hay mất tập trung.',
  'Kỹ năng nghe tốt, cần luyện thêm phần nói.',
  'Năng lực tốt, nên thử thách với bài tập nâng cao.',
]

export function generateSessionHistory(studentId: string, isEnglish: boolean): SessionHistory[] {
  return Array.from({ length: 12 }, (_, i) => {
    const h = stableHash(studentId + String(i))
    // Sessions 4, 8, 12 are tests to make sure old and new classes both have tests!
    const isTest = i === 3 || i === 8 || i === 11
    const att: SessionHistory['attendance'][] = ['present', 'present', 'present', 'late', 'absent', 'excused', 'present', 'present', 'present', 'present']
    const hwOptions: SessionHistory['homework'][] = ['submitted', 'submitted', 'submitted', 'late', 'not_submitted']
    
    const base: SessionHistory = {
      id: `sh-${i}`,
      sessionNumber: i + 1,
      date: `2026-${String(Math.floor(i / 4) + 5).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      topic: TOPICS[i % TOPICS.length],
      type: isTest ? 'test' as const : 'lesson' as const,
      attendance: att[h % att.length],
      homework: hwOptions[h % hwOptions.length],
      rating: Math.min(5, Math.max(1, 3 + (h % 3))),
      score: isTest ? parseFloat((6.5 + (h % 35) / 10).toFixed(1)) : (h % 3 === 0 ? parseFloat((5.0 + (h % 50) / 10).toFixed(1)) : null),
      comment: h % 3 === 0 ? COMMENTS_POOL[h % COMMENTS_POOL.length] : (isTest && h % 2 === 0 ? 'Tiến bộ rõ rệt so với buổi trước. Tự tin hơn khi giao tiếp.' : null),
    }

    if (isTest && isEnglish) {
      if (i === 11) {
        // Pending / Not started test
        base.listening = 'NOT START'
        base.reading = 'NOT START'
        base.writing = 'NOT START'
        base.speaking = 'SCORE' // shows blue SCORE button
        base.overall = '—'
      } else if (i === 8) {
        // Midterm test
        base.listening = '8/10'
        base.reading = '7.5/10'
        base.writing = '7/10'
        base.speaking = '7/10'
        base.overall = '7.4/10'
      } else {
        // Session 4 test (old class)
        base.listening = '7/10'
        base.reading = '6.5/10'
        base.writing = '7/10'
        base.speaking = '6.5/10'
        base.overall = '6.8/10'
      }
    }

    return base
  })
}

export function getMockMonthlyReports(isEnglish: boolean) {
  const docUrl = 'https://docs.google.com/document/d/1UXX0wgBd13PdfxVf79cQRHwLoXlKwLYk_HC0EbmKZ-k/edit?usp=drive_link'
  if (isEnglish) {
    return [
      { title: 'Báo cáo Tiếng Anh - Tháng 6/2026', date: 'Cập nhật: 30/06/2026', url: docUrl, packageId: 'pkg-1' },
      { title: 'Báo cáo Tiếng Anh - Tháng 5/2026', date: 'Cập nhật: 31/05/2026', url: docUrl, packageId: 'pkg-1' },
      { title: 'Báo cáo môn Toán - Tháng 6/2026', date: 'Cập nhật: 30/06/2026', url: docUrl, packageId: 'pkg-2' },
      { title: 'Báo cáo môn Toán - Tháng 5/2026', date: 'Cập nhật: 31/05/2026', url: docUrl, packageId: 'pkg-2' },
      { title: 'Báo cáo Tiếng Anh - Tháng 4/2026', date: 'Cập nhật: 30/04/2026', url: docUrl, packageId: 'pkg-3' },
      { title: 'Báo cáo Tiếng Anh - Tháng 3/2026', date: 'Cập nhật: 31/03/2026', url: docUrl, packageId: 'pkg-3' }
    ]
  }
  return [
    { title: 'Báo cáo môn Toán - Tháng 6/2026', date: 'Cập nhật: 30/06/2026', url: docUrl, packageId: 'pkg-1' },
    { title: 'Báo cáo môn Toán - Tháng 5/2026', date: 'Cập nhật: 31/05/2026', url: docUrl, packageId: 'pkg-1' },
    { title: 'Báo cáo Tiếng Anh - Tháng 6/2026', date: 'Cập nhật: 30/06/2026', url: docUrl, packageId: 'pkg-2' },
    { title: 'Báo cáo Tiếng Anh - Tháng 5/2026', date: 'Cập nhật: 31/05/2026', url: docUrl, packageId: 'pkg-2' },
    { title: 'Báo cáo môn Toán - Tháng 4/2026', date: 'Cập nhật: 30/04/2026', url: docUrl, packageId: 'pkg-3' },
    { title: 'Báo cáo môn Toán - Tháng 3/2026', date: 'Cập nhật: 31/03/2026', url: docUrl, packageId: 'pkg-3' }
  ]
}

export function getMockEvaluations(isEnglish: boolean) {
  return {
    currentClassEval: {
      month: 'Tháng 9/2026',
      attitude: 5,
      knowledge: 4,
      skills: 4,
      interaction: 5,
      comment: isEnglish 
        ? 'Học viên rất năng nổ tương tác nhóm, hiểu bài nhanh và có ý thức tự giác cao. Tuy nhiên cần chú ý rèn luyện viết từ vựng kỹ càng hơn để tránh các lỗi chính tả nhỏ.'
        : 'Học viên có tư duy phân tích đề rất tốt, làm đúng các bài toán logic phức tạp. Cần rèn tính cẩn thận, tránh nhẩm vội ở các phép tính lớn.',
      evaluator: 'Teacher Mark & Giáo vụ Lan'
    },
    oldClassEval: {
      month: 'Tháng 4/2026',
      attitude: 4,
      knowledge: 5,
      skills: 4,
      interaction: 4,
      comment: isEnglish
        ? 'Học viên hoàn thành xuất sắc khóa học Foundation, phản xạ nói tự nhiên, nắm vững kiến thức cấu trúc câu cơ bản của cấp độ.'
        : 'Học viên tính toán nhanh, tiếp thu bài tốt trong suốt học kỳ và có kết quả thi cuối khóa xuất sắc.',
      evaluator: 'Teacher Sarah & Giáo vụ Mai'
    },
    supplementalClassEval: {
      month: 'Tháng 8/2026',
      attitude: 5,
      knowledge: 4,
      skills: 5,
      interaction: 4,
      comment: isEnglish
        ? 'Học viên có tố chất tốt, nắm bắt nhanh các cấu trúc ngữ pháp nâng cao. Cần thực hành phát âm chuẩn xác và tự nhiên hơn nữa.'
        : 'Học viên tính toán logic rất xuất sắc, hiểu nhanh các dạng bài toán đố phức tạp. Cần kiên nhẫn hơn khi trình bày các bước giải.',
      evaluator: 'Teacher David & Giáo vụ Thảo'
    }
  }
}
