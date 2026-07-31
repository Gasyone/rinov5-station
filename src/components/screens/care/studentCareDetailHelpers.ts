import { type StudentCareAlert, type CareInteractionLog } from '@/mocks/careAlerts'
import { mockOrders } from '@/mocks/orders'
import { mockStudents } from '@/mocks/students'
import { stableHash } from './operationsAlertHelpers'
import { type SimulatedPackage, type CareTopic, type CareTopicStatus, ALL_STANDARD_TAGS } from './studentCareDetailTypes'

// Parse care topic prefix from notes (e.g. "[ĐB1]")
export function parseLogTopic(notes?: string | null): string {
  if (!notes) return 'GENERAL'
  const match = notes.match(/^\[([^\]]+)\]/)
  return match ? match[1] : 'GENERAL'
}

// Parse recipient from notes (e.g. "[Đối tượng: Mẹ]")
export function parseRecipient(notes?: string | null, defaultVal: string = ''): string {
  if (!notes) return defaultVal
  const match = notes.match(/^\[[^\]]+\]\s*\[Đối tượng:\s*([^\]]+)\]/)
  return match ? match[1] : defaultVal
}

// Strip prefixes from notes text for display
export function cleanMessageNotes(notes?: string | null): string {
  if (!notes) return 'Đã tương tác trao đổi thông tin chăm sóc học viên.'
  let text = notes.trim()

  // Remove system metadata brackets: [Đến: ...], [Kênh: ...], [Mốc/Thẻ: ...], [Kết quả: ...]
  text = text.replace(/\[(Đến|Kênh|Mốc\/Thẻ|Kết quả|Hẹn gọi lại|Ý kiến PH|Đối tượng|CSKH Nội bộ|Chỉ CSKH)[^\]]*\]/gi, '').trim()
  text = text.replace(/^\[[A-Z0-9]{2,6}(-[0-9]{2})?\]\s*/i, '').trim()
  text = text.replace(/^(\||:|-|\s)+/, '').trim()

  if (!text || text.length < 2) {
    const rawClean = notes.replace(/\[[^\]]+\]/g, '').replace(/^(\||:|-|\s)+/, '').trim()
    text = rawClean || 'Đã tương tác trao đổi thông tin chăm sóc học viên.'
  }

  return text
}

// Format seconds into mm:ss
export function formatSeconds(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Format ISO date string to Telegram-style relative date
export function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.floor((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hôm nay'
  if (diffDays === 1) return 'Hôm qua'
  if (diffDays < 7) {
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    return dayNames[date.getDay()]
  }
  // Older: dd/MM/yyyy
  const d = date.getDate().toString().padStart(2, '0')
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  return `${d}/${m}/${date.getFullYear()}`
}

// Derive care topic status based on completion, SLA, and interaction data
export function deriveCareStatus(topic: CareTopic, logCount: number): CareTopicStatus {
  if (topic.isCompleted) return 'completed'
  if (topic.code === 'TOTAL') return 'in_progress'
  
  // Parse SLA hours/days from sla string
  const slaMatch = topic.sla.match(/(\d+)\s*(giờ|ngày)/)
  if (slaMatch && topic.lastInteractionDate) {
    const slaValue = parseInt(slaMatch[1])
    const slaUnit = slaMatch[2]
    const slaMs = slaUnit === 'giờ' ? slaValue * 60 * 60 * 1000 : slaValue * 24 * 60 * 60 * 1000
    const lastDate = new Date(topic.lastInteractionDate)
    const now = new Date()
    if (now.getTime() - lastDate.getTime() > slaMs && logCount > 0) return 'overdue'
  }
  
  if (logCount > 0) return 'in_progress'
  return 'pending'
}

// Get localized status label
export function getCareStatusLabel(status: CareTopicStatus): string {
  switch (status) {
    case 'completed': return 'Hoàn thành'
    case 'overdue': return 'Quá hạn'
    case 'in_progress': return 'Đang xử lý'
    case 'pending': return 'Chăm sóc'
  }
}

// Dynamically generate the list of topics based on student criteria
// MUST match the same logic as getStudentCareTags() in operationsAlertHelpers.ts
export function getCareTopicsForStudent(student: StudentCareAlert): CareTopic[] {
  const list: CareTopic[] = []
  const completed = student.completedCareTags || []
  const defaultStatus = 'pending' as CareTopicStatus

  const hash = stableHash(student.studentId)
  const avgScore = ((student.lastTestScore + student.priorTestScore) / 2).toFixed(1)

  const getTopicCount = (code: string) => {
    const baseCount = hash % 2 + 1
    const addedLogs = student.interactionLogs.filter(l => (l.notes || '').includes(code)).length
    return baseCount + addedLogs
  }

  // 1. CS Đặc biệt (ĐB1)
  if (student.careAlert === 'C90B' || student.homeworkCompletion < 70 || parseFloat(avgScore) < 5.0) {
    const isComp = completed.includes('ĐB1')
    const count = getTopicCount('ĐB1')
    list.push({
      code: 'ĐB1', name: 'Chăm sóc Đặc biệt', sla: '24 giờ',
      criteria: 'Cảnh báo C90B, BTVN < 70% hoặc Điểm thi < 5.0',
      description: 'Kế hoạch chăm sóc khẩn cấp đối với các cảnh báo vận hành hoặc học lực yếu kém.',
      isCompleted: isComp, careStatus: defaultStatus,
      displayCode: isComp ? 'ĐB1' : (count === 1 ? 'ĐB1' : `ĐB1 (${count})`)
    })
  }

  // 2. CS Định kỳ (ĐK1, ĐK2)
  if (hash % 3 === 0) {
    const dk1Comp = completed.includes('ĐK1')
    const dk1Count = getTopicCount('ĐK1')
    list.push({
      code: 'ĐK1', name: 'CS học tập Định kỳ', sla: '5 ngày',
      criteria: 'Điểm chạm tương tác định kỳ hàng tháng',
      description: 'Trao đổi lộ trình học tập định kỳ và thu thập phản hồi của phụ huynh.',
      isCompleted: dk1Comp, careStatus: defaultStatus,
      displayCode: dk1Comp ? 'ĐK1' : (dk1Count === 1 ? 'ĐK1' : `ĐK1 (${dk1Count})`)
    })

    const dk2Comp = completed.includes('ĐK2')
    const dk2Count = getTopicCount('ĐK2')
    list.push({
      code: 'ĐK2', name: 'CS học phí Định kỳ', sla: '5 ngày',
      criteria: 'Cận hạn học phí hoặc có lịch sử nợ phí',
      description: 'Liên hệ nhắc phí và trao đổi lộ trình gia hạn khóa học.',
      isCompleted: dk2Comp, careStatus: defaultStatus,
      displayCode: dk2Comp ? 'ĐK2' : (dk2Count === 1 ? 'ĐK2' : `ĐK2 (${dk2Count})`)
    })
  } else if (hash % 4 === 0) {
    const dk1Comp = completed.includes('ĐK1')
    const dk1Count = getTopicCount('ĐK1')
    list.push({
      code: 'ĐK1', name: 'CS học tập Định kỳ', sla: '5 ngày',
      criteria: 'Điểm chạm kiểm tra định kỳ hàng tháng/giữa kỳ',
      description: 'Trao đổi lộ trình học tập định kỳ và thu thập phản hồi của phụ huynh.',
      isCompleted: dk1Comp, careStatus: defaultStatus,
      displayCode: dk1Comp ? 'ĐK1' : (dk1Count === 1 ? 'ĐK1' : `ĐK1 (${dk1Count})`)
    })
  }

  // 3. CS Theo buổi (TB1)
  if (student.remainingSessions <= 5 || hash % 5 === 0) {
    const tb1Comp = completed.includes('TB1')
    const tb1Count = getTopicCount('TB1')
    list.push({
      code: 'TB1', name: 'CS chuyên cần & gói phí', sla: '3 ngày',
      criteria: 'Buổi còn lại ≤ 5 hoặc chuyên cần < 80%',
      description: 'Theo dõi chuyên cần, nhắc nhở đi học đúng giờ và nhắc phí cận hạn.',
      isCompleted: tb1Comp, careStatus: defaultStatus,
      displayCode: tb1Comp ? 'TB1' : (tb1Count === 1 ? 'TB1' : `TB1 (${tb1Count})`)
    })
  }

  // TB2
  if (hash % 6 === 0) {
    const tb2Comp = completed.includes('TB2')
    const tb2Count = getTopicCount('TB2')
    list.push({
      code: 'TB2', name: 'CS bài tập & học lực', sla: '2 ngày',
      criteria: 'Thiếu bài tập về nhà hoặc điểm thi giảm sút',
      description: 'CS phối hợp giáo viên gửi bài tập làm bù và điều chỉnh nhịp học.',
      isCompleted: tb2Comp, careStatus: defaultStatus,
      displayCode: tb2Comp ? 'TB2' : (tb2Count === 1 ? 'TB2' : `TB2 (${tb2Count})`)
    })
  }

  // 4. CS Tái phí (CSTP)
  const cstpComp = completed.includes('CSTP')
  const cstpCount = getTopicCount('CSTP')
  list.push({
    code: 'CSTP', name: 'Chăm sóc Tái phí', sla: '5 ngày',
    criteria: 'Liên hệ gia hạn và đóng phí khóa học mới',
    description: 'Chăm sóc Tái phí: Liên hệ trao đổi gia hạn và đóng phí khóa học mới.',
    isCompleted: cstpComp, careStatus: defaultStatus,
    displayCode: cstpComp ? 'CSTP' : (cstpCount === 1 ? 'CSTP' : `CSTP (${cstpCount})`)
  })

  // Custom tags
  if (student.customCareTags) {
    student.customCareTags.forEach((t) => {
      if (!list.some((x) => x.code === t.code)) {
        const isComp = completed.includes(t.code)
        const customCount = getTopicCount(t.code)
        
        // Find if this is actually a standard tag stored as custom
        const standardMatch = ALL_STANDARD_TAGS.find(s => s.code === t.code)

        list.push({
          code: t.code,
          name: standardMatch ? standardMatch.name : t.name,
          sla: standardMatch ? standardMatch.sla : (t.sla.toString().includes('ngày') || t.sla.toString().includes('h') ? t.sla.toString() : `${t.sla} ngày`),
          criteria: standardMatch ? standardMatch.criteria : 'Yêu cầu chăm sóc khác được tạo thủ công',
          description: standardMatch ? standardMatch.description : (t.description || 'Yêu cầu chăm sóc khác'),
          isCompleted: isComp,
          careStatus: defaultStatus,
          displayCode: isComp ? t.code : (customCount === 1 ? t.code : `${t.code} (${customCount})`)
        })
      }
    })
  }

  // Fallback: CS Thường (T1)
  const hasActive = list.some((t) => !t.isCompleted)
  if (!hasActive) {
    list.push({
      code: 'T1', name: 'Chăm sóc thông thường', sla: '3 ngày',
      criteria: 'Chăm sóc định kỳ phát sinh',
      description: 'Tương tác chăm sóc, thăm hỏi định kỳ thông thường.',
      isCompleted: false, careStatus: defaultStatus,
      displayCode: 'T1'
    })
  }

  const sortedList = sortTopicsByLatestInteraction(list, student.interactionLogs)
  return sortedList
}

// Sort topics: active first, within each group sort by latest interaction date descending
// Also derives careStatus for each topic based on SLA and interaction data
function sortTopicsByLatestInteraction(topics: CareTopic[], logs: CareInteractionLog[]): CareTopic[] {
  return topics
    .map((topic) => {
      const topicLogs = logs.filter((l) => parseLogTopic(l.notes) === topic.code)
      const latestDate = topicLogs.length > 0
        ? topicLogs.reduce((latest, l) => (l.date > latest ? l.date : latest), topicLogs[0].date)
        : '1970-01-01'
      const enriched = { ...topic, lastInteractionDate: latestDate }
      return { ...enriched, careStatus: deriveCareStatus(enriched, topicLogs.length) }
    })
    .sort((a, b) => {
      // Active topics come before completed
      if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1
      // Within same group, sort by latest interaction date descending
      return (b.lastInteractionDate || '').localeCompare(a.lastInteractionDate || '')
    })
}

// Generate pre-populated mock logs for each topic if empty
export function getSimulatedLogs(student: StudentCareAlert, topicsList: CareTopic[]): CareInteractionLog[] {
  const logs = [...student.interactionLogs]

  topicsList.forEach((topic) => {
    if (topic.code === 'TOTAL') return
    const hasLogs = logs.some((l) => parseLogTopic(l.notes) === topic.code)
    if (!hasLogs) {
      if (topic.code === 'ĐB1') {
        logs.push({
          id: `sim-db-1`,
          date: '2026-07-08',
          staffName: 'Lan Anh (CSM)',
          callConfirmation: 'Đã gọi',
          audioDuration: '02:45',
          parentOpinion: 'Bố bận việc gia đình, xin bảo lưu kết quả 1 tháng để con về quê giải quyết việc.',
          notes: `[ĐB1] [Đối tượng: Châu Mẹ Nguyễn Thị Mai (Mẹ)] Đã gọi điện cảnh báo tình trạng điểm thi học viên bị sụt giảm xuống còn 4.5. Mẹ cam kết kèm cặp bé học bài tối thứ 3, 5. Bé Châu cam kết làm bù BTVN buổi 4.`,
        })
        logs.push({
          id: `sim-db-2`,
          date: '2026-07-09',
          staffName: 'Lan Anh (CSM)',
          callConfirmation: 'Đã nhắn Zalo',
          parentOpinion: 'Mẹ phản hồi sẽ nhắc nhở con làm bài tập 14 trong tối nay.',
          notes: `[ĐB1] [Đối tượng: Châu Mẹ Nguyễn Thị Mai (Mẹ)] Gửi kèm đề cương làm bù BTVN Toán cho mẹ qua Zalo. Mẹ phản hồi sẽ nhắc nhở con làm ngay tối nay.`,
        })
        logs.push({
          id: `sim-db-teacher`,
          date: '2026-07-07',
          staffName: 'GV. Nguyễn Huy Hoàng',
          callConfirmation: 'Đã tương tác',
          notes: `[ĐB1] [Đối tượng: Học viên] Giáo viên bộ môn đã kèm riêng 15 phút cuối giờ để giải đáp thắc mắc về các phần bài tập về nhà chưa đạt yêu cầu. Con đã nắm vững lại kiến thức cốt lõi.`,
        })
      } else if (topic.code === 'TB1') {
        logs.push({
          id: `sim-tb-1`,
          date: '2026-07-04',
          staffName: 'Ngọc Mai (Sale)',
          callConfirmation: 'Đã gọi',
          audioDuration: '01:30',
          parentOpinion: 'Mẹ hứa sẽ nhắc con đi học bù đầy đủ vào buổi tiếp theo.',
          missedCallsList: [
            { time: '03/07 09:30', status: 'Gọi KNM (Không nghe máy)', note: 'Chuông reo 5 tiếng phụ huynh không nghe máy, hẹn gọi lại ca chiều', nextCallback: '03/07 14:15' },
            { time: '03/07 14:15', status: 'Máy bận / Số bận', note: 'Số điện thoại bận cuộc gọi khác, hẹn gọi lại sáng hôm sau', nextCallback: '04/07 09:00' },
          ],
          notes: `[TB1] [Đối tượng: Châu Mẹ Nguyễn Thị Mai (Mẹ)] Trao đổi về chuyên cần thấp (vắng 2 buổi liên tiếp do sốt). Đã nhờ GV hỗ trợ kèm bù 15p đầu giờ buổi tiếp theo.`,
        })
        logs.push({
          id: `sim-tb-teacher`,
          date: '2026-07-03',
          staffName: 'GV. Nguyễn Huy Hoàng',
          callConfirmation: 'Đã tương tác',
          notes: `[TB1] [Đối tượng: Học viên] Đã kèm cặp học viên 15 phút đầu giờ để hướng dẫn bổ trợ kiến thức. Con chăm chú nghe giảng và hoàn thành tốt bài luyện tập tại lớp.`,
        })
      } else if (topic.code === 'TB2') {
        logs.push({
          id: `sim-tb2-1`,
          date: '2026-07-02',
          staffName: 'Lan Anh (CSM)',
          callConfirmation: 'Đã nhắn Zalo',
          notes: `[TB2] [Đối tượng: Châu Mẹ Nguyễn Thị Mai (Mẹ)] Báo cáo tình hình thiếu bài tập về nhà buổi 2. Mẹ đã tiếp nhận thông tin và sẽ kiểm tra.`,
        })
        logs.push({
          id: `sim-tb2-teacher`,
          date: '2026-07-01',
          staffName: 'GV. Nguyễn Huy Hoàng',
          callConfirmation: 'Đã tương tác',
          notes: `[TB2] [Đối tượng: Học viên] Đã giao thêm phiếu bài tập củng cố riêng biệt cho con làm bù phần kiến thức bị rỗng. Con hứa sẽ hoàn thành trước buổi học sau.`,
        })
      } else if (topic.code === 'ĐK1') {
        logs.push({
          id: `sim-dk1-1`,
          date: '2026-06-28',
          staffName: 'Lan Anh (CSM)',
          callConfirmation: 'Đã gọi',
          audioDuration: '03:15',
          notes: `[ĐK1] [Đối tượng: Châu Mẹ Nguyễn Thị Mai (Mẹ)] Chăm sóc định kỳ tháng đầu học tập. Bé thích nghi tốt, yêu quý lớp học và cô giáo phụ trách.`,
        })
        logs.push({
          id: `sim-dk1-teacher`,
          date: '2026-06-25',
          staffName: 'GV. Nguyễn Huy Hoàng',
          callConfirmation: 'Đã tương tác',
          notes: `[ĐK1] [Đối tượng: Học viên] Trao đổi nhanh cuối giờ học. Con hoàn thành tốt bài thuyết trình Speaking định kỳ trên lớp, tự tin tương tác với các bạn.`,
        })
      } else if (topic.code === 'ĐK2') {
        logs.push({
          id: `sim-dk2-1`,
          date: '2026-06-20',
          staffName: 'Ngọc Mai (Sale)',
          callConfirmation: 'Đã gọi',
          parentOpinion: 'Bố sẽ chuyển khoản đóng phí trước ngày 15/07.',
          notes: `[ĐK2] [Đối tượng: Châu Mẹ Nguyễn Thị Mai (Mẹ)] Gọi nhắc gia hạn học phí gói Toán tư duy mới. Mẹ xác nhận sẽ đóng trước ngày 15/07.`,
        })
      } else if (topic.code === 'CSTP') {
        logs.push({
          id: `sim-cstp-1`,
          date: '2026-07-05',
          staffName: 'Ngọc Mai (Sale)',
          callConfirmation: 'Đã gọi',
          audioDuration: '02:10',
          parentOpinion: 'Phụ huynh quan tâm gói 12 tháng nâng cao, muốn nhận ưu đãi đóng sớm.',
          missedCallsList: [
            { time: '04/07 10:00', status: 'Gọi KNM', note: 'Phụ huynh không nghe máy, hẹn gọi lại ca chiều', nextCallback: '04/07 15:30' },
          ],
          notes: `[CSTP] [Đối tượng: Châu Mẹ Nguyễn Thị Mai (Mẹ)] Trao đổi tái phí gói học mới. Mẹ quan tâm gói nâng cao, hẹn gọi lại tuần sau để xác nhận.`,
        })
        logs.push({
          id: `sim-cstp-2`,
          date: '2026-07-01',
          staffName: 'Lan Anh (CSM)',
          callConfirmation: 'Đã nhắn Zalo',
          notes: `[CSTP] [Đối tượng: Châu Mẹ Nguyễn Thị Mai (Mẹ)] Gửi thông tin các gói học mới kèm ưu đãi đăng ký sớm qua Zalo. Mẹ đã xem và phản hồi cảm ơn.`,
        })
        logs.push({
          id: `sim-cstp-teacher`,
          date: '2026-07-03',
          staffName: 'GV. Nguyễn Huy Hoàng',
          callConfirmation: 'Đã tương tác',
          notes: `[CSTP] [Đối tượng: Học viên] Đã trực tiếp trao đổi và động viên học viên trong giờ ra chơi về kế hoạch tiếp tục học lên lớp nâng cao. Con rất hào hứng và bày tỏ mong muốn được tiếp tục học cùng các bạn.`,
        })
      }
    }
  })

  return logs.sort((a, b) => b.date.localeCompare(a.date))
}

// Generate packages list
export function getSimulatedPackagesList(student: StudentCareAlert): SimulatedPackage[] {
  const isMath = student.subject === 'Toán tư duy'
  
  const pkg1: SimulatedPackage = {
    id: 'pkg-1',
    packageName: isMath ? 'Gói Toán tư duy Standard (6 tháng)' : 'Gói Tiếng Anh Level 4 (12 tháng)',
    totalSessions: student.totalSessions,
    remainingSessions: student.remainingSessions,
    classCode: student.classCode,
    className: isMath ? `Lớp Toán Tư Duy ${student.classCode.slice(-5)}` : `Lớp Tiếng Anh Giao Tiếp ${student.classCode.slice(-5)}`,
    teacherCode: student.teacherCode,
    schedule: student.schedule,
    attendanceRatio: student.attendanceRatio,
    homeworkCompletion: student.homeworkCompletion,
    lastTestScore: student.lastTestScore,
    priorTestScore: student.priorTestScore,
    startDate: student.startDate,
    endDate: student.expectedEndDate,
    level: student.level,
    subLevel: student.subLevel,
    status: student.remainingSessions > 0 ? 'active' : 'expired',
  }

  const pkg2: SimulatedPackage = {
    id: 'pkg-2',
    packageName: isMath ? 'Gói Tiếng Anh Bổ trợ Standard (12 tháng)' : 'Gói Toán tư duy nâng cao (6 tháng)',
    totalSessions: 48,
    remainingSessions: 32,
    classCode: isMath ? 'LD_ANH_00201' : 'LD_TOAN_00010',
    className: isMath ? 'Lớp Tiếng Anh Standard B1' : 'Lớp Toán Tư Duy Nâng Cao A1',
    teacherCode: 'GV_ThuTrang08',
    schedule: 'T3 - 18:00-19:30, T7 - 09:00-10:30',
    attendanceRatio: '8/8',
    homeworkCompletion: 95,
    lastTestScore: 9.0,
    priorTestScore: 8.5,
    startDate: '10/02/2026',
    endDate: '10/08/2026',
    level: isMath ? 'Flyers' : 'Einstein 1',
    subLevel: 'B',
    status: 'active',
  }

  const pkg3: SimulatedPackage = {
    id: 'pkg-3',
    packageName: isMath ? 'Gói Toán tư duy Basic (3 tháng - Đã hết)' : 'Gói Tiếng Anh Level 3 (6 tháng - Đã hết)',
    totalSessions: 24,
    remainingSessions: 0,
    classCode: isMath ? 'LD_TOAN_00002' : 'LD_ANH_00095',
    className: isMath ? 'Lớp Toán Tư Duy Khởi Động A0' : 'Lớp Tiếng Anh Giao Tiếp Level 3',
    teacherCode: 'GV_MinhHue',
    schedule: 'T2 - 17:30-19:00, T6 - 17:30-19:00',
    attendanceRatio: '24/24',
    homeworkCompletion: 88,
    lastTestScore: 8.0,
    priorTestScore: 7.5,
    startDate: '15/10/2025',
    endDate: '15/01/2026',
    level: isMath ? 'Kiddie' : 'Starters',
    subLevel: 'A',
    status: 'expired',
  }

  const pkg4: SimulatedPackage = {
    id: 'pkg-4',
    packageName: isMath ? 'Gói Toán tư duy Chuyên sâu (12 tháng - Chờ kích hoạt)' : 'Gói Tiếng Anh IELTS Standard (12 tháng - Chờ kích hoạt)',
    totalSessions: 96,
    remainingSessions: 96,
    classCode: isMath ? 'LD_TOAN_00888' : 'LD_ANH_00999',
    className: isMath ? 'Lớp Toán Tư Duy Chuyên Sâu T1' : 'Lớp Tiếng Anh Giao Tiếp Cam Kết Đầu Ra',
    teacherCode: 'GV_DavidSmith',
    schedule: 'T7 - 14:00-15:30, CN - 14:00-15:30',
    attendanceRatio: '0/0',
    homeworkCompletion: 0,
    lastTestScore: 0,
    priorTestScore: 0,
    startDate: '01/10/2026',
    endDate: '01/10/2027',
    level: isMath ? 'Newton' : 'Movers',
    subLevel: 'C',
    status: 'pending',
  }

  const hash = stableHash(student.studentId)
  if (hash % 2 === 0) {
    return [pkg1, pkg2, pkg3, pkg4]
  } else {
    return [pkg1, pkg2, pkg3]
  }
}

// Generate orders list
export function getSimulatedOrdersList(student: StudentCareAlert) {
  const matched = mockOrders.filter((o) => o.studentId === student.studentId)
  
  if (matched.length === 0) {
    const hash = stableHash(student.studentId)
    const cleanNum = student.studentId.replace(/\D/g, '') || '1'
    const orderCode1 = `ORD-2026${cleanNum.padStart(4, '0')}1`
    const orderCode2 = `ORD-2026${cleanNum.padStart(4, '0')}2`

    return [
      {
        orderNo: orderCode1,
        packageName: student.subject === 'Toán tư duy' ? 'Khóa học Toán tư duy Standard (6 tháng)' : 'Khóa học Tiếng Anh Level 4 (12 tháng)',
        finalAmount: student.totalSessions * 150000,
        paymentStatus: 'paid' as const,
        status: 'completed' as const,
        saleBy: hash % 2 === 0 ? 'Lan Anh (CSM)' : 'Ngọc Mai (Sale)',
        createdAt: student.startDate,
      },
      {
        orderNo: orderCode2,
        packageName: 'Gói Bổ trợ Kỹ năng Tư duy (3 tháng - Đã hết)',
        finalAmount: 1800000,
        paymentStatus: 'paid' as const,
        status: 'completed' as const,
        saleBy: 'Ngọc Mai (Sale)',
        createdAt: '2025-10-12T14:30:00Z',
      },
      {
        orderNo: `ORD-2026${cleanNum.padStart(4, '0')}3`,
        packageName: 'Khóa học bổ trợ Nghe nói phản xạ (Hủy)',
        finalAmount: 1200000,
        paymentStatus: 'unpaid' as const,
        status: 'cancelled' as const,
        saleBy: 'Ngọc Mai (Sale)',
        createdAt: '2026-02-15T09:00:00Z',
      }
    ]
  }
  return matched.map(m => ({
    orderNo: m.orderNo,
    packageName: m.items.map(item => item.productName).join(', '),
    finalAmount: m.finalAmount,
    paymentStatus: m.paymentStatus,
    status: m.status,
    saleBy: m.saleBy,
    createdAt: m.createdAt,
  }))
}

// Resolve student branch from DB
export function getStudentBranch(studentId: string): string {
  const match = mockStudents.find((s) => s.id === studentId)
  return match?.branch || 'RinoEdu Nguyễn Tuân'
}

export type MergedTimelineItem =
  | {
      type: 'log'
      date: string
      data: CareInteractionLog
    }
  | {
      type: 'system'
      date: string
      data: {
        title: string
        content: string
        tag: string
        iconType: 'activate' | 'complete'
        isOverdue?: boolean
        slaStatus?: 'within_sla' | 'due_today' | 'overdue'
      }
    }

export function getSlaStatus(activateDateStr: string, slaStr: string): 'within_sla' | 'due_today' | 'overdue' {
  const activateDate = new Date(activateDateStr)
  if (isNaN(activateDate.getTime())) return 'within_sla'
  
  // Simulated current date for demo
  const currentDate = new Date('2026-07-15')
  
  const aDateOnly = new Date(activateDate.getFullYear(), activateDate.getMonth(), activateDate.getDate())
  const cDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
  const diffTime = cDateOnly.getTime() - aDateOnly.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
  
  let slaDays = 5 // default
  if (slaStr.includes('giờ') || slaStr.includes('h') || slaStr.toLowerCase().includes('24h')) {
    const hours = parseInt(slaStr) || 24
    slaDays = Math.ceil(hours / 24)
  } else {
    slaDays = parseInt(slaStr) || 5
  }
  
  if (diffDays > slaDays) {
    return 'overdue'
  } else if (diffDays === slaDays) {
    return 'due_today'
  } else {
    return 'within_sla'
  }
}

export function isSlaOverdue(activateDateStr: string, slaStr: string): boolean {
  return getSlaStatus(activateDateStr, slaStr) === 'overdue'
}

export function getCombinedLogs(
  allLogs: CareInteractionLog[],
  topicsList: CareTopic[],
  completedTopics: string[]
): MergedTimelineItem[] {
  // 1. Filter out completion and chong-phi logs from the regular text logs list
  const logs = allLogs
    .filter((log) => !(log.notes || '').includes('[Hoàn thành Chăm sóc]') && !(log.notes || '').includes('[Chồng phí]'))
    .map((log) => ({
      type: 'log' as const,
      date: log.date,
      data: log,
    }))

  const systemEvents: MergedTimelineItem[] = []

  // 2. Parse allLogs to find and construct precise system events
  allLogs.forEach((log) => {
    const notesStr = log.notes || ''
    if (notesStr.includes('[Hoàn thành Chăm sóc]')) {
      const tagMatch = notesStr.match(/\[([^\]]+)\]/)
      const tag = tagMatch ? tagMatch[1] : 'TAG'
      systemEvents.push({
        type: 'system',
        date: log.date,
        data: {
          title: tag === 'CSTP' ? 'Đã tái phí thành công' : 'Đã hoàn thành chăm sóc',
          content: 'Thực hiện bởi nhân viên quản lý cơ sở.',
          tag: tag,
          iconType: 'complete',
        },
      })
    } else if (notesStr.includes('[Chồng phí]')) {
      const tagMatch = notesStr.match(/\[([^\]]+)\]/)
      const tag = tagMatch ? tagMatch[1] : 'CSTP'
      systemEvents.push({
        type: 'system',
        date: log.date,
        data: {
          title: 'Đã chồng phí thành công',
          content: 'Thực hiện bởi nhân viên quản lý cơ sở.',
          tag: tag,
          iconType: 'complete',
        },
      })
    }
  })

  // 3. Add activation and fallback completion events based on topicsList
  topicsList.forEach((topic) => {
    if (topic.code === 'TOTAL') return

    const topicLogs = allLogs.filter((l) => parseLogTopic(l.notes) === topic.code)
    let activateDate = '2026-07-01'
    if (topicLogs.length > 0) {
      const oldestLog = topicLogs.reduce((oldest, l) => (l.date < oldest ? l.date : oldest), topicLogs[0].date)
      const d = new Date(oldestLog)
      d.setDate(d.getDate() - 1)
      activateDate = d.toISOString().split('T')[0]
    } else {
      activateDate = '2026-07-08'
    }

    const isCompleted = completedTopics.includes(topic.code) || topic.isCompleted
    const slaStatus = isCompleted ? 'within_sla' : getSlaStatus(activateDate, topic.sla)

    systemEvents.push({
      type: 'system',
      date: activateDate,
      data: {
        title: `Hệ thống tự động kích hoạt thẻ [${topic.code}]`,
        content: `${topic.name} (Tiêu chí: ${topic.criteria})`,
        tag: topic.code,
        iconType: 'activate',
        isOverdue: slaStatus === 'overdue',
        slaStatus,
      },
    })

    const hasCompleteEvent = systemEvents.some((ev) => {
      if (ev.type !== 'system') return false
      return ev.data.tag === topic.code && ev.data.iconType === 'complete'
    })
    if (isCompleted && !hasCompleteEvent) {
      let completeDate = '2026-07-11'
      if (topicLogs.length > 0) {
        const latestLog = topicLogs.reduce((latest, l) => (l.date > latest ? l.date : latest), topicLogs[0].date)
        completeDate = latestLog
      }
      systemEvents.push({
        type: 'system',
        date: completeDate,
        data: {
          title: topic.code === 'CSTP' ? 'Đã tái phí thành công' : 'Đã hoàn thành chăm sóc',
          content: 'Thực hiện bởi nhân viên quản lý cơ sở.',
          tag: topic.code,
          iconType: 'complete',
        },
      })
    }
  })

  const allMerged = [...logs, ...systemEvents]
  return allMerged.sort((a, b) => a.date.localeCompare(b.date))
}
