import type { StudentCareAlert } from '@/mocks/careAlerts'
import { getConsecutiveAbsences } from './operationsAlertHelpers'

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
  const d = new Date(cleanDate)
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
      comment: `🎯 Bài học hôm nay có gì:
- Con đã cùng cô khám phá về chủ đề hình học trong bài học Level G22: Bài 2 Tạo hình lớn hơn. 🟥

🏅 Thành tích nổi bật:
- Hôm nay con tham gia học tập rất tích cực và nắm được cách ghép hình, hoàn thành tốt các bài tập trong giờ học. ✨
- Con biết quan sát, so sánh hình đã ghép với hình mẫu và bước đầu hình dung được cách sắp xếp các mảnh ghép. 🧩
- Khả năng hình dung không gian con cần thêm thời gian để thử nghiệm nhiều cách ghép khác nhau, nhưng luôn có tinh thần cố gắng. 👏`,
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
      attendance: 'absent_excused',
      attendanceText: 'Vắng có phép',
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
      comment: 'Học viên vắng mặt không báo trước. CS đã liên hệ với phụ huynh để xác nhận lý do và cập nhật bài học bù.',
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
  type: 'uncommented' | 'unmarked' | 'absent' | 'homework' | 'special_care'
  actionHint?: string
}

/**
 * Tính toán các cảnh báo / lưu ý phát sinh cho phần Nhật ký buổi học
 * Dựa vào:
 * 1. Buổi học chưa nhận xét (comment rỗng, hiển thị rõ số buổi, ngày tháng, hướng xử lý)
 * 2. Buổi học chưa điểm danh (unmarked, hiển thị rõ số buổi, ngày tháng)
 * 3. Chuyên cần / Đang nghỉ liên tiếp (>= 2 buổi, kèm buổi và hướng giải quyết)
 * 4. Bài tập về nhà chưa hoàn thành (kèm mã BTVN, số buổi)
 * 5. Điều kiện Chăm sóc Đặc biệt (C90B, điểm bài kiểm tra thấp <= 6.0)
 */
export function getCareSessionNotices(
  sessions: UnifiedSessionItem[],
  studentAlert?: StudentCareAlert | null,
  studentId?: string
): CareSessionNotice[] {
  const notices: CareSessionNotice[] = []
  const completedSessions = sessions.filter((s) => s.type === 'lesson' || s.type === 'test')

  // 1. Chưa nhận xét (buổi đã học nhưng comment rỗng)
  const uncommentedList = completedSessions.filter((s) => !s.comment || !s.comment.trim())
  if (uncommentedList.length > 0) {
    const sessionNumbers = uncommentedList.map((s) => `Buổi ${s.sessionNumber}`).join(', ')
    notices.push({
      id: 'uncommented',
      title: 'Chưa có nhận xét',
      text: `${sessionNumbers} chưa có nhận xét của giáo viên.`,
      actionHint: 'Cần đôn đốc GV hoàn thiện nhận xét buổi học',
      type: 'uncommented',
    })
  }

  // 2. Chưa điểm danh (buổi đã học nhưng chưa điểm danh)
  const unmarkedList = completedSessions.filter(
    (s) => s.attendance === 'unmarked' || !s.attendance || s.attendanceText === 'Chưa điểm danh'
  )
  if (unmarkedList.length > 0) {
    const sessionDetails = unmarkedList
      .map((s) => `Buổi ${s.sessionNumber} ngày ${formatDateNoYear(s.date)}`)
      .join(', ')
    notices.push({
      id: 'unmarked',
      title: 'Chưa điểm danh',
      text: `${sessionDetails} đã kết thúc nhưng chưa được chốt điểm danh trên hệ thống.`,
      actionHint: 'Cần liên hệ GV/TA chốt danh sách điểm danh',
      type: 'unmarked',
    })
  }

  // 3. Chuyên cần / Đang nghỉ liên tiếp
  let consecutiveAbsences = 0
  for (const s of completedSessions) {
    const isAbsent =
      s.attendance === 'absent' ||
      s.attendance === 'absent_unexcused' ||
      s.attendance === 'absent_excused' ||
      /vắng/i.test(s.attendanceText || '')
    if (isAbsent) {
      consecutiveAbsences++
    } else if (s.attendance === 'unmarked' || s.attendanceText === 'Chưa điểm danh') {
      continue
    } else {
      break
    }
  }

  // Fallback từ chuỗi buổi nghỉ trong lịch sử hoặc chỉ số học viên
  const historyConsecutive = (() => {
    let maxChain = 0
    let currChain = 0
    for (const s of completedSessions) {
      const isAbsent =
        s.attendance === 'absent' ||
        s.attendance === 'absent_unexcused' ||
        s.attendance === 'absent_excused' ||
        /vắng/i.test(s.attendanceText || '')
      if (isAbsent) {
        currChain++
        if (currChain > maxChain) maxChain = currChain
      } else {
        currChain = 0
      }
    }
    return maxChain
  })()

  const fallbackAbsences = studentId ? getConsecutiveAbsences(studentId) : 0
  const finalAbsences =
    consecutiveAbsences >= 2
      ? consecutiveAbsences
      : historyConsecutive >= 2
        ? historyConsecutive
        : fallbackAbsences >= 2
          ? fallbackAbsences
          : 0

  if (finalAbsences >= 2) {
    notices.push({
      id: 'absent',
      title: 'Nghỉ học liên tiếp',
      text: `Học viên đang nghỉ liên tiếp ${finalAbsences} buổi, chưa có lịch học bù.`,
      actionHint: 'Cần liên hệ phụ huynh xác minh lý do và xếp lịch học bù',
      type: 'absent',
    })
  } else if (studentAlert && studentAlert.attendanceRatio) {
    const ratio = studentAlert.attendanceRatio
    const [attended, total] = ratio.split('/').map(Number)
    const absentCount = total > 0 ? total - attended : 0
    if (absentCount >= 2) {
      const rate = Math.round((attended / total) * 100)
      notices.push({
        id: 'absent_ratio',
        title: 'Cảnh báo chuyên cần',
        text: `Học viên đã nghỉ ${absentCount} buổi trong ${total} buổi gần nhất, chuyên cần đạt ${rate}%.`,
        actionHint: 'Cần theo dõi sát chuyên cần các buổi tới',
        type: 'absent',
      })
    }
  }

  // 4. Chưa làm bài tập về nhà
  const missingHwList = completedSessions.filter((s) => s.homeworkSubmitted === false)
  if (missingHwList.length > 0) {
    notices.push({
      id: 'homework',
      title: 'Chưa làm bài tập',
      text: `Học viên đang chưa hoàn thành ${missingHwList.length} bài tập về nhà, cần đôn đốc nộp bù.`,
      actionHint: 'Nhắn Zalo phụ huynh hỗ trợ đôn đốc con làm bài',
      type: 'homework',
    })
  }

  // 5. Điều kiện Chăm sóc Đặc biệt (CSĐB)
  if (studentAlert) {
    if (
      studentAlert.careAlert === 'C90B' ||
      studentAlert.confirmC90B === 'ĐÃ CSDB' ||
      studentAlert.confirmC90B === 'ĐANG XỬ LÝ'
    ) {
      notices.push({
        id: 'csdb_c90b',
        title: 'Cảnh báo CSĐB',
        text: 'Học viên thuộc diện Chăm sóc Đặc biệt có nguy cơ thôi học cao C90B, cần liên hệ chăm sóc ưu tiên trong 24 giờ.',
        actionHint: 'Chuyên viên CS phối hợp Quản lý can thiệp trực tiếp',
        type: 'special_care',
      })
    } else if (studentAlert.lastTestScore > 0 && studentAlert.lastTestScore <= 6.0) {
      notices.push({
        id: 'csdb_score',
        title: 'Học lực sút giảm',
        text: `Bài kiểm tra gần nhất chỉ đạt ${studentAlert.lastTestScore}/10, kiến thức bị hổng.`,
        actionHint: 'Giáo viên phụ trách cần lên kế hoạch phụ đạo kiến thức',
        type: 'special_care',
      })
    } else if (studentAlert.careAlert && !studentAlert.careAlert.includes('Bình thường')) {
      notices.push({
        id: 'csdb_custom',
        title: 'Cảnh báo CSKH',
        text: `Phát sinh yêu cầu chăm sóc: ${studentAlert.careAlert}, cần cập nhật tiến độ tương tác.`,
        actionHint: 'Ghi nhận nhật ký chăm sóc sau khi liên hệ',
        type: 'special_care',
      })
    }
  }

  return notices
}
