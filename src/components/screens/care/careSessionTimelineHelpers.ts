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
 * Chuyển đổi chuỗi ngày của ca học thành Date object
 */
export const parseSessionDate = (dateStr: string): Date => {
  if (!dateStr) return new Date(2026, 6, 22)
  const cleanDate = dateStr.split(' ')[0]
  if (cleanDate.includes('/')) {
    const parts = cleanDate.split('/')
    if (parts.length === 3) {
      return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
    }
    if (parts.length === 2) {
      return new Date(2026, Number(parts[1]) - 1, Number(parts[0]))
    }
  }
  const d = new Date(cleanDate)
  if (!isNaN(d.getTime())) return d
  return new Date(2026, 6, 22)
}

/**
 * Xác định mốc thời gian hiện tại của tiến trình học (anchor date).
 * Trong môi trường mock với các buổi học tháng 7/2026, mốc hiện tại được neo vào 1 ngày sau buổi học đã hoàn thành gần nhất.
 */
export const getTimelineReferenceDate = (sessions: UnifiedSessionItem[]): Date => {
  const completed = sessions.filter((s) => s.type === 'lesson' || s.type === 'test')
  if (completed.length > 0) {
    const latestDate = parseSessionDate(completed[0].date)
    if (!isNaN(latestDate.getTime())) {
      const ref = new Date(latestDate)
      ref.setHours(23, 59, 59, 999)
      ref.setDate(ref.getDate() + 1)
      return ref
    }
  }
  return new Date(2026, 6, 23, 23, 59, 59)
}

/**
 * Kiểm tra xem buổi học có phát sinh trong vòng `maxDays` (mặc định 7 ngày) từ thời điểm hiện tại hay không.
 */
export const isSessionWithinDays = (dateStr: string, refDate: Date, maxDays = 7): boolean => {
  const sDate = parseSessionDate(dateStr)
  if (isNaN(sDate.getTime())) return false
  const diffMs = refDate.getTime() - sDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return diffDays >= 0 && diffDays <= maxDays
}

/**
 * Tính toán các cảnh báo / lưu ý phát sinh cho phần Nhật ký buổi học:
 * 1. Điều kiện hiển thị: Chỉ các sự kiện phát sinh trong vòng 7 ngày gần nhất.
 * 2. Cùng loại thì gom lại:
 *    - Các buổi chưa nhận xét -> Gom thành 1 cảnh báo duy nhất
 *    - Các buổi chưa điểm danh -> Gom thành 1 cảnh báo duy nhất
 *    - Các BTVN chưa làm -> Gom thành 1 cảnh báo duy nhất
 *    - Chuyên cần / Nghỉ không phép -> Gom thành 1 cảnh báo duy nhất
 *    - Điểm kiểm tra dưới chuẩn -> Gom thành 1 cảnh báo duy nhất
 */
export function getCareSessionNotices(
  sessions: UnifiedSessionItem[],
  studentAlert?: StudentCareAlert | null
): CareSessionNotice[] {
  void studentAlert
  const notices: CareSessionNotice[] = []
  const completedSessions = sessions.filter((s) => s.type === 'lesson' || s.type === 'test')

  // Mốc thời gian đối chiếu: Neo theo buổi học gần nhất
  const refDate = getTimelineReferenceDate(sessions)

  // Điều kiện hiển thị: Chỉ xét các ca học phát sinh trong vòng 7 ngày gần nhất
  const recentSessions = completedSessions.filter((s) => isSessionWithinDays(s.date, refDate, 7))

  // 1. Chưa nhận xét (buổi đã học trong vòng 7 ngày nhưng comment rỗng - CHỈ áp dụng khi KHÔNG có xin nghỉ)
  const uncommentedList = recentSessions.filter((s) => {
    const hasLeave = Boolean(
      s.isLeaveRequested ||
      s.attendance === 'absent_excused' ||
      s.attendance === 'excused' ||
      /có phép|nghỉ phép/i.test(s.attendanceText || '') ||
      s.leaveReason
    )
    return (!s.comment || !s.comment.trim()) && !hasLeave
  })

  // Gom lại nếu có nhiều buổi cùng loại chưa nhận xét trong 7 ngày
  if (uncommentedList.length > 0) {
    const sessionDetails = uncommentedList
      .map((s) => `Buổi ${s.sessionNumber} (${formatDateNoYear(s.date)})`)
      .join(', ')
    const issueText =
      uncommentedList.length === 1
        ? `${sessionDetails} chưa có nhận xét.`
        : `${uncommentedList.length} buổi chưa có nhận xét (${sessionDetails}).`

    notices.push({
      id: 'uncommented',
      title: 'Chưa có nhận xét',
      issue: issueText,
      action: 'Đôn đốc GV hoàn thiện.',
      text: `${issueText} Đôn đốc GV hoàn thiện.`,
      actionHint: 'Đôn đốc GV hoàn thiện nhận xét',
      type: 'uncommented',
    })
  }

  // 2. Chưa điểm danh (buổi đã học trong vòng 7 ngày nhưng chưa điểm danh)
  const unmarkedList = recentSessions.filter(
    (s) => s.attendance === 'unmarked' || !s.attendance || s.attendanceText === 'Chưa điểm danh'
  )

  // Gom lại nếu có nhiều buổi cùng loại chưa điểm danh trong 7 ngày
  if (unmarkedList.length > 0) {
    const sessionDetails = unmarkedList
      .map((s) => `Buổi ${s.sessionNumber} (${formatDateNoYear(s.date)})`)
      .join(', ')
    const issueText =
      unmarkedList.length === 1
        ? `${sessionDetails} chưa chốt điểm danh.`
        : `${unmarkedList.length} buổi chưa chốt điểm danh (${sessionDetails}).`

    notices.push({
      id: 'unmarked',
      title: 'Chưa điểm danh',
      issue: issueText,
      action: 'Xác minh GV cập nhật chuyên cần.',
      text: `${issueText} Xác minh GV cập nhật chuyên cần.`,
      actionHint: 'Xác minh GV cập nhật chuyên cần',
      type: 'unmarked',
    })
  }

  // 3. Bài tập về nhà chưa hoàn thành (phát sinh trong vòng 7 ngày gần nhất)
  const missingHwList = recentSessions.filter((s) => s.homeworkSubmitted === false)

  // Gom lại nếu có nhiều BTVN cùng loại chưa làm trong 7 ngày
  if (missingHwList.length > 0) {
    const hwDetails = missingHwList
      .map((s) => {
        const code = s.homeworkCode ? ` (${s.homeworkCode})` : ''
        return `Buổi ${s.sessionNumber}${code}`
      })
      .join(', ')
    const issueText =
      missingHwList.length === 1
        ? `Chưa hoàn thành BTVN ${hwDetails}.`
        : `Chưa hoàn thành ${missingHwList.length} BTVN gần nhất (${hwDetails}).`

    notices.push({
      id: 'homework',
      title: 'Chưa làm bài tập',
      issue: issueText,
      action: 'Đôn đốc PH hỗ trợ con nộp bù.',
      text: `${issueText} Đôn đốc PH hỗ trợ con nộp bù.`,
      actionHint: 'Đôn đốc PH hỗ trợ nộp bài',
      type: 'homework',
    })
  }

  // 4. Chuyên cần: Nghỉ học không phép trong 7 ngày gần nhất
  const unexcusedList = recentSessions.filter(
    (s) =>
      (s.attendance === 'absent_unexcused' || s.attendance === 'absent') &&
      !s.isLeaveRequested &&
      !/có phép/i.test(s.attendanceText || '')
  )

  if (unexcusedList.length >= 2) {
    const sessionDetails = unexcusedList
      .map((s) => `Buổi ${s.sessionNumber} (${formatDateNoYear(s.date)})`)
      .join(', ')
    const issueText = `Nghỉ không phép liên tiếp ${unexcusedList.length} buổi (${sessionDetails}) chưa có lịch học bù.`
    notices.push({
      id: 'absent_unexcused',
      title: 'Nghỉ không phép liên tiếp',
      issue: issueText,
      action: 'Liên hệ PH xác minh lý do và xếp lịch học bù sớm.',
      text: `${issueText} Liên hệ PH xác minh lý do và xếp lịch học bù sớm.`,
      actionHint: 'Liên hệ PH xếp lịch học bù',
      type: 'absent',
    })
  } else if (unexcusedList.length === 1) {
    const s = unexcusedList[0]
    const issueText = `Vắng không phép Buổi ${s.sessionNumber} (${formatDateNoYear(s.date)}) chưa có lịch học bù.`
    notices.push({
      id: 'absent_unexcused',
      title: 'Nghỉ không phép',
      issue: issueText,
      action: 'Liên hệ PH xác minh lý do và xếp lịch học bù.',
      text: `${issueText} Liên hệ PH xác minh lý do và xếp lịch học bù.`,
      actionHint: 'Liên hệ PH xếp lịch học bù',
      type: 'absent',
    })
  }

  // 5. Sự kiện học tập: Điểm kiểm tra dưới chuẩn (<= 6.0 điểm) phát sinh trong 7 ngày gần nhất
  const lowTestSessions = recentSessions.filter(
    (s) => s.type === 'test' && s.score !== undefined && s.score !== null && s.score <= 6.0
  )

  if (lowTestSessions.length > 0) {
    const testDetails = lowTestSessions
      .map((s) => `Buổi ${s.sessionNumber} (${formatDateNoYear(s.date)}: ${s.score}/10)`)
      .join(', ')
    const issueText =
      lowTestSessions.length === 1
        ? `Điểm kiểm tra ${testDetails} dưới chuẩn 6.0.`
        : `${lowTestSessions.length} bài kiểm tra gần nhất dưới chuẩn 6.0 (${testDetails}).`

    notices.push({
      id: 'low_test_score',
      title: 'Học lực cần hỗ trợ',
      issue: issueText,
      action: 'GV lên kế hoạch phụ đạo và củng cố kiến thức.',
      text: `${issueText} GV lên kế hoạch phụ đạo và củng cố kiến thức.`,
      actionHint: 'Lên kế hoạch phụ đạo',
      type: 'special_care',
    })
  }

  return notices
}
