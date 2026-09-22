import type { StudentCareAlert } from '@/mocks/careAlerts'

export interface AssistantInfo {
  id: string
  name: string
  role: string
  phone?: string
  email?: string
  avatar: string
}

export interface UnifiedSessionItem {
  id: string
  sessionNumber: number
  date: string
  type: 'upcoming' | 'lesson' | 'test'
  topic: string
  time?: string
  room?: string
  teacher?: string
  assistant?: AssistantInfo
  preparation?: string
  attendance?: string
  attendanceText?: string
  isLeaveRequested?: boolean
  leaveReason?: string
  homeworkCode?: string
  homeworkSubmitted?: boolean
  homeworkScore?: string
  rating?: number
  score?: number
  comment?: string
  skills?: Record<string, string>
}

export const getDayOfWeekName = (dateStr: string) => {
  if (dateStr.includes('Thứ')) {
    const match = dateStr.match(/(Thứ\s*\d|Thứ\s*Bảy|Chủ\s*Nhật)/i)
    if (match) return match[1]
  }
  const cleanDate = dateStr.split(' ')[0]
  let d = new Date(cleanDate)
  if (isNaN(d.getTime()) && cleanDate.includes('/')) {
    const parts = cleanDate.split('/')
    if (parts.length === 3) {
      d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
    }
  }
  if (isNaN(d.getTime())) return 'Thứ 4'
  const day = d.getDay()
  const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
  return days[day]
}

export const getShortDayOfWeek = (dateStr: string) => {
  if (/chủ nhật|cn/i.test(dateStr)) return 'CN'
  const tMatch = dateStr.match(/thứ\s*(\d|bảy)/i)
  if (tMatch) {
    if (tMatch[1].toLowerCase() === 'bảy') return 'T7'
    return `T${tMatch[1]}`
  }
  const cleanDate = dateStr.split(' ')[0]
  const d = new Date(cleanDate)
  if (isNaN(d.getTime())) return 'T4'
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  return days[d.getDay()]
}

export const formatDateOnly = (dateStr: string) => {
  const cleanDate = dateStr.split(' ')[0]
  if (cleanDate.includes('/')) return cleanDate
  const d = new Date(cleanDate)
  if (isNaN(d.getTime())) return dateStr
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export const formatDateNoYear = (dateStr: string) => {
  const cleanDate = dateStr.split(' ')[0]
  if (cleanDate.includes('/')) {
    const parts = cleanDate.split('/')
    if (parts.length >= 2) {
      return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}`
    }
  }
  const d = new Date(cleanDate)
  if (isNaN(d.getTime())) return '22/07'
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}`
}

export function getCareSessions(pkgIsEnglish: boolean): UnifiedSessionItem[] {
  return [
    // Upcoming Sessions (On Top)
    {
      id: 'next-2',
      sessionNumber: 21,
      date: '2026-07-31 (Thứ 6)',
      time: '17:30 - 19:00',
      type: 'upcoming',
      topic: pkgIsEnglish
        ? 'Unit 9: Presentation Skills & Individual Speech Project'
        : 'Bài 20: Luyện tập tổng hợp & Thuyết trình Dự án Toán học',
      room: 'P.102 (Tầng 1)',
      teacher: 'Bùi Văn Anh',
      preparation: 'Chuẩn bị slide/poster dự án thuyết trình cá nhân',
      homeworkCode: 'BT-09',
      homeworkSubmitted: false,
    },
    {
      id: 'next-1',
      sessionNumber: 20,
      date: '2026-07-27 (Thứ 2)',
      time: '17:30 - 19:00',
      type: 'upcoming',
      topic: pkgIsEnglish
        ? 'Unit 8: Advanced Academic Vocabulary & Writing Strategy'
        : 'Bài 19: Tỉ số phần trăm & Ứng dụng thực tế tính tiền lãi',
      room: 'P.102 (Tầng 1)',
      teacher: 'Bùi Văn Anh',
      preparation: 'Đọc trước tài liệu Unit 8 & chuẩn bị bài tập nhóm',
      homeworkCode: 'BT-08',
      homeworkSubmitted: true,
      homeworkScore: '9.0/10',
    },

    // Completed Sessions (Descending Order: 19 ➔ 15)
    {
      id: 'past-19',
      sessionNumber: 19,
      date: '2026-07-22',
      type: 'lesson',
      topic: pkgIsEnglish
        ? 'Unit 7: World Culture & Global Heritage'
        : 'Bài 18: Phép chia Số có nhiều chữ số & Bài toán có lời văn',
      assistant: {
        id: 'EMP-TA-HA',
        name: 'Hoàng Anh',
        role: 'Trợ giảng (TA)',
        phone: '0934567890',
        email: 'honganh@rinoedu.com',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=HoangAnh',
      },
      attendance: 'unmarked',
      attendanceText: 'Chưa điểm danh',
      homeworkCode: 'BT-07',
      homeworkSubmitted: true,
      homeworkScore: '10/10',
      rating: 5,
      comment: '',
    },
    {
      id: 'past-18',
      sessionNumber: 18,
      date: '2026-07-20',
      type: 'lesson',
      topic: pkgIsEnglish
        ? 'Unit 6: Technology & Future Innovations'
        : 'Bài 17: Phép nhân và Phép chia Số thập phân',
      // Không có trợ giảng
      attendance: 'late',
      attendanceText: 'Đến muộn',
      homeworkCode: 'BT-06',
      homeworkSubmitted: true,
      homeworkScore: '9.0/10',
      rating: 4,
      comment: `🎯 Bài học hôm nay có gì:
- Con học chuyên đề Phép nhân và Phép chia Số thập phân, áp dụng vào bài toán thực tế tính tiền mua sắm. 🧮

🏅 Thành tích nổi bật:
- Con hiểu nhanh quy tắc dịch dấu phẩy và làm đúng các bài tập tính nhanh trên lớp. ✨

💡 Điểm cần rèn luyện:
- Con đến muộn 10 phút do kẹt xe nên cần giáo viên tóm tắt nhanh phần mở đầu. Ba mẹ nhắc con xem lại ví dụ mẫu số 2 trong vở nhé.`,
    },
    {
      id: 'past-17',
      sessionNumber: 17,
      date: '2026-07-17',
      type: 'lesson',
      topic: pkgIsEnglish
        ? 'Midterm Review & Critical Thinking Practice'
        : 'Bài 16: Hình học Không gian & Diện tích Hình Thang',
      assistant: {
        id: 'EMP-TA-TT',
        name: 'Trần Thảo',
        role: 'Trợ giảng (TA)',
        phone: '0988776655',
        email: 'thao.tran@rinoedu.com',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=TranThao',
      },
      attendance: 'present',
      attendanceText: 'Đã đến',
      homeworkCode: 'BT-05',
      homeworkSubmitted: true,
      homeworkScore: '9.5/10',
      rating: 5,
      comment: `🎯 Bài học hôm nay có gì:
- Con ôn tập kiến thức hình học diện tích hình thang và chuẩn bị bài kiểm tra logic. 📐

🏅 Thành tích nổi bật:
- Học tập rất tập trung, tương tác tích cực với thầy cô và hỗ trợ các bạn trong giờ thảo luận nhóm. ✨
- Khả năng tư duy hình học của con rất phát triển và chính xác. 🧩`,
    },
    {
      id: 'past-16',
      sessionNumber: 16,
      date: '2026-07-15',
      type: 'test',
      topic: pkgIsEnglish
        ? 'Kiểm tra Giữa kỳ (Midterm Assessment)'
        : 'Bài kiểm tra Định kỳ tháng 7',
      // Không có trợ giảng
      attendance: 'present',
      attendanceText: 'Đã đến',
      homeworkCode: 'BT-04',
      homeworkSubmitted: true,
      homeworkScore: '8.5/10',
      rating: 5,
      score: 8.5,
      comment: pkgIsEnglish
        ? '🎯 Kết quả kiểm tra: Đạt 8.5/10 (Xuất sắc). Con cải thiện vượt bậc ở kỹ năng Đọc hiểu và Từ vựng học thuật (+0.5 so với kỳ trước). Cần tiếp tục duy trì phong độ và rèn thêm phản xạ viết câu phức.'
        : '🎯 Kết quả kiểm tra: Đạt điểm giỏi bài kiểm tra logic định kỳ tháng 7 (8.5/10). Con có tư duy hình học không gian xuất sắc, tiến bộ +0.5 điểm so với kỳ trước. Cần rèn thêm bước trình bày cẩn thận đáp số bài toán có lời văn.',
    },
    {
      id: 'past-15',
      sessionNumber: 15,
      date: '2026-07-13',
      type: 'lesson',
      topic: pkgIsEnglish
        ? 'Unit 5: Environmental Conservation & Group Debate'
        : 'Bài 15: Phép chia Số có nhiều chữ số & Bài toán có lời văn',
      // Không có trợ giảng
      attendance: 'absent',
      attendanceText: 'Vắng',
      isLeaveRequested: true,
      leaveReason: 'Phụ huynh xin nghỉ phép do học viên bị ốm sốt nhẹ.',
      homeworkCode: 'BT-03',
      homeworkSubmitted: false,
      rating: 5,
      comment: `🎯 Bài học hôm nay có gì:
- Con học chủ đề Phép chia Số có nhiều chữ số và giải bài toán có lời văn thực tế. Phụ huynh xin nghỉ phép do học viên bị ốm sốt nhẹ.

💡 Kế hoạch hỗ trợ:
- Giáo viên đã gửi phiếu bài tập để con tự ôn tập bù tại nhà.`,
    },

    // Older Historical Sessions
    {
      id: 'past-14',
      sessionNumber: 14,
      date: '2026-07-10',
      type: 'lesson',
      topic: pkgIsEnglish
        ? 'Unit 4: Science & Space Exploration'
        : 'Bài 14: Luyện tập Toán Tư Duy & Ôn tập Tổng hợp',
      assistant: {
        id: 'EMP-TA-HA',
        name: 'Hoàng Anh',
        role: 'Trợ giảng (TA)',
        phone: '0934567890',
        email: 'honganh@rinoedu.com',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=HoangAnh',
      },
      attendance: 'absent_unexcused',
      attendanceText: 'Vắng không phép',
      homeworkCode: 'BT-02',
      homeworkSubmitted: false,
      rating: 4,
      comment: '',
    },
    {
      id: 'past-13',
      sessionNumber: 13,
      date: '2026-07-08',
      type: 'lesson',
      topic: pkgIsEnglish
        ? 'Unit 3: Healthy Lifestyle & Nutrition'
        : 'Bài 13: Bài toán Tìm hai số khi biết Tổng và Tỉ số',
      // Không có trợ giảng
      attendance: 'late',
      attendanceText: 'Đến muộn',
      homeworkCode: 'BT-01',
      homeworkSubmitted: true,
      homeworkScore: '8.5/10',
      rating: 4,
      comment: 'Tham gia xây dựng bài tích cực, hiểu rõ bản chất công thức tính tỉ số.',
    },
    {
      id: 'past-12',
      sessionNumber: 12,
      date: '2026-07-06',
      type: 'lesson',
      topic: pkgIsEnglish
        ? 'Grammar Review & Vocabulary Expansion'
        : 'Bài 12: Hình học Ôn tập Tính diện tích Tam giác & Tứ giác',
      // Không có trợ giảng
      attendance: 'present',
      attendanceText: 'Đã đến',
      homeworkCode: 'BT-12',
      homeworkSubmitted: true,
      homeworkScore: '9.5/10',
      rating: 5,
      comment: 'Nắm chắc kiến thức ngữ pháp cơ bản, làm bài tập thực hành nhanh và chuẩn xác.',
    },
    {
      id: 'past-11',
      sessionNumber: 11,
      date: '2026-07-03',
      type: 'lesson',
      topic: pkgIsEnglish
        ? 'Unit 2: Art, Music & Cultural Diversity'
        : 'Bài 11: Phép nhân và Phép chia Phân số Nâng cao',
      assistant: {
        id: 'EMP-TA-TT',
        name: 'Trần Thảo',
        role: 'Trợ giảng (TA)',
        phone: '0988776655',
        email: 'thao.tran@rinoedu.com',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=TranThao',
      },
      attendance: 'present',
      attendanceText: 'Đã đến',
      homeworkCode: 'BT-11',
      homeworkSubmitted: true,
      homeworkScore: '9.0/10',
      rating: 5,
      comment: 'Phát biểu sôi nổi, chủ động đặt nhiều câu hỏi mở rộng với giáo viên.',
    },
    {
      id: 'past-10',
      sessionNumber: 10,
      date: '2026-07-01',
      type: 'test',
      topic: pkgIsEnglish
        ? 'Bài kiểm tra Đầu tháng (Monthly Placement Test)'
        : 'Bài kiểm tra Định kỳ tháng 6',
      attendance: 'present',
      attendanceText: 'Đã đến',
      homeworkCode: 'BT-10',
      homeworkSubmitted: true,
      homeworkScore: '9.0/10',
      rating: 5,
      score: 9.0,
      comment: 'Bài thi đạt 9.0/10 xuất sắc, kiến thức nền tảng rất vững vàng.',
    },
    {
      id: 'past-05',
      sessionNumber: 5,
      date: '2026-06-15',
      type: 'test',
      topic: pkgIsEnglish
        ? 'Bài kiểm tra Giữa kỳ (Midterm Level Test)'
        : 'Bài kiểm tra Định kỳ tháng 5',
      attendance: 'present',
      attendanceText: 'Đã đến',
      homeworkCode: 'BT-05',
      homeworkSubmitted: true,
      homeworkScore: '8.8/10',
      rating: 5,
      score: 8.8,
      comment: 'Bài kiểm tra kiến thức tổng hợp giữa khóa đạt 8.8/10. Con làm tốt các bài toán logic.',
    },
    {
      id: 'past-01',
      sessionNumber: 1,
      date: '2026-06-01',
      type: 'test',
      topic: pkgIsEnglish
        ? 'Bài kiểm tra Đầu vào (Initial Assessment)'
        : 'Bài kiểm tra Đầu vào Level G2',
      attendance: 'present',
      attendanceText: 'Đã đến',
      homeworkCode: 'BT-01',
      homeworkSubmitted: true,
      homeworkScore: '9.2/10',
      rating: 5,
      score: 9.2,
      comment: 'Kết quả đánh giá năng lực đầu vào xuất sắc (9.2/10). Đủ điều kiện xếp lớp nâng cao.',
    },
  ]
}

export interface CareSessionNotice {
  id: string
  title: string
  text: string
  issue: string
  action: string
  type: 'uncommented' | 'unmarked' | 'absent' | 'homework' | 'special_care'
  actionHint?: string
}

/**
 * Tính toán các cảnh báo / lưu ý phát sinh cho phần Nhật ký buổi học
 * Dựa vào:
 * 1. Buổi học chưa nhận xét (comment rỗng)
 * 2. Buổi học chưa điểm danh (unmarked)
 * 3. Chuyên cần / Đang nghỉ liên tiếp (>= 2 buổi)
 * 4. Bài tập về nhà chưa hoàn thành (chưa nộp BTVN)
 * 5. Điểm kiểm tra dưới chuẩn (<= 6.0 điểm)
 */
export function getCareSessionNotices(
  sessions: UnifiedSessionItem[],
  studentAlert?: StudentCareAlert | null
): CareSessionNotice[] {
  const notices: CareSessionNotice[] = []
  const completedSessions = sessions.filter((s) => s.type === 'lesson' || s.type === 'test')

  // 1. Chưa nhận xét (buổi đã học nhưng comment rỗng - CHỈ áp dụng khi KHÔNG có xin nghỉ)
  const uncommentedList = completedSessions.filter((s) => {
    const hasLeave = Boolean(
      s.isLeaveRequested ||
      s.attendance === 'absent_excused' ||
      s.attendance === 'excused' ||
      /có phép|nghỉ phép/i.test(s.attendanceText || '') ||
      s.leaveReason
    )
    return (!s.comment || !s.comment.trim()) && !hasLeave
  })
  if (uncommentedList.length > 0) {
    const sessionNumbers = uncommentedList.map((s) => `Buổi ${s.sessionNumber}`).join(', ')
    notices.push({
      id: 'uncommented',
      title: 'Chưa có nhận xét',
      issue: `${sessionNumbers} chưa có nhận xét.`,
      action: 'Đôn đốc GV hoàn thiện.',
      text: `${sessionNumbers} chưa có nhận xét, đôn đốc GV hoàn thiện.`,
      actionHint: 'Đôn đốc GV hoàn thiện nhận xét',
      type: 'uncommented',
    })
  }

  // 2. Chưa điểm danh (buổi đã học nhưng chưa điểm danh)
  const unmarkedList = completedSessions.filter(
    (s) => s.attendance === 'unmarked' || !s.attendance || s.attendanceText === 'Chưa điểm danh'
  )
  if (unmarkedList.length > 0) {
    const sessionDetails = unmarkedList
      .map((s) => `Buổi ${s.sessionNumber} (${formatDateNoYear(s.date)})`)
      .join(', ')
    notices.push({
      id: 'unmarked',
      title: 'Chưa điểm danh',
      issue: `${sessionDetails} chưa chốt điểm danh.`,
      action: 'Xác minh GV cập nhật chuyên cần.',
      text: `${sessionDetails} chưa chốt điểm danh, xác minh GV cập nhật chuyên cần.`,
      actionHint: 'Xác minh GV cập nhật chuyên cần',
      type: 'unmarked',
    })
  }

  // 3. Chuyên cần / Đang nghỉ liên tiếp
  // 3. Chuyên cần: Nghỉ học không phép liên tiếp (chuỗi đang tiếp diễn từ buổi gần nhất)
  let consecutiveUnexcusedAbsences = 0
  for (const s of completedSessions) {
    const isUnexcused =
      (s.attendance === 'absent_unexcused' || s.attendance === 'absent') &&
      !s.isLeaveRequested &&
      !/có phép/i.test(s.attendanceText || '')

    if (isUnexcused) {
      consecutiveUnexcusedAbsences++
    } else if (s.attendance === 'unmarked' || s.attendanceText === 'Chưa điểm danh') {
      // Bỏ qua buổi chưa điểm danh để kiểm tra buổi học đã chốt gần nhất
      continue
    } else {
      // Ngắt chuỗi ngay lập tức khi học viên đi học (present/late) hoặc nghỉ có phép
      break
    }
  }

  if (consecutiveUnexcusedAbsences >= 2) {
    notices.push({
      id: 'absent_unexcused',
      title: 'Nghỉ không phép liên tiếp',
      issue: `Nghỉ không phép liên tiếp ${consecutiveUnexcusedAbsences} buổi chưa có lịch học bù.`,
      action: 'Liên hệ PH xác minh lý do và xếp lịch học bù sớm.',
      text: `Nghỉ không phép liên tiếp ${consecutiveUnexcusedAbsences} buổi chưa có lịch học bù, liên hệ PH xác minh lý do và xếp lịch học bù sớm.`,
      actionHint: 'Liên hệ PH xếp lịch học bù',
      type: 'absent',
    })
  }

  // 4. Chưa làm bài tập về nhà
  const missingHwList = completedSessions.filter((s) => s.homeworkSubmitted === false)
  if (missingHwList.length > 0) {
    const hwCodes = missingHwList
      .map((s) => s.homeworkCode)
      .filter(Boolean)
      .slice(0, 3)
      .join(', ')
    const hwDetail = hwCodes ? ` (${hwCodes})` : ''
    notices.push({
      id: 'homework',
      title: 'Chưa làm bài tập',
      issue: `Chưa hoàn thành ${missingHwList.length} BTVN gần nhất${hwDetail}.`,
      action: 'Đôn đốc PH hỗ trợ con nộp bù.',
      text: `Chưa hoàn thành ${missingHwList.length} BTVN gần nhất${hwDetail}, đôn đốc PH hỗ trợ con nộp bù.`,
      actionHint: 'Đôn đốc PH hỗ trợ nộp bài',
      type: 'homework',
    })
  }

  // 5. Sự kiện học tập: Điểm kiểm tra dưới chuẩn (<= 6.0 điểm)
  const recentTestSession = completedSessions.find(
    (s) => s.type === 'test' && s.score !== undefined && s.score !== null
  )
  const testScore =
    recentTestSession?.score ??
    (studentAlert?.lastTestScore && studentAlert.lastTestScore > 0 ? studentAlert.lastTestScore : null)

  if (testScore !== null && testScore <= 6.0) {
    notices.push({
      id: 'low_test_score',
      title: 'Học lực cần hỗ trợ',
      issue: `Điểm kiểm tra gần nhất ${testScore}/10 (dưới chuẩn 6.0).`,
      action: 'GV lên kế hoạch phụ đạo và củng cố kiến thức.',
      text: `Điểm kiểm tra gần nhất ${testScore}/10 (dưới chuẩn 6.0), GV lên kế hoạch phụ đạo và củng cố kiến thức.`,
      actionHint: 'Lên kế hoạch phụ đạo',
      type: 'special_care',
    })
  }

  return notices
}
