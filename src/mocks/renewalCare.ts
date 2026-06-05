export interface CareInteractionLog {
  id: string
  date: string
  staffName: string
  actionType: 'Khách cọc' | 'Hoàn tất' | 'Đóng full' | 'Từ chối' | 'Liên hệ lại'
  notes: string
}

export interface RenewalCareRecord {
  id: string              // unique record ID
  studentId: string       // student_id
  studentName: string     // student_name
  customerCode?: string   // customer_code
  subject: 'Toán tư duy' | 'Tiếng Anh' // Môn học
  level: string           // Level
  subLevel: string        // Sub-Level
  classCode: string       // Mã lớp
  startDate: string       // Ngày bắt đầu
  expirationDate: string  // Hạn hết phí (YYYY-MM-DD)
  realtimeStatus: 'Đang học' | 'Chờ chuyển lớp' | 'Hết buổi' // Trạng thái lớp
  teacherCode: string     // Giáo viên chính
  substituteTeacher?: string // Giáo viên dạy thay (optional)
  schedule: string        // Lịch học
  remainingSessions: number // Số buổi còn lại
  totalSessions: number   // Tổng số buổi học
  attendanceRatio: string // Chuyên cần (e.g. '8/8')
  homeworkCompletion: number // BTVN (%)
  lastTestScore: number   // Điểm test gần nhất
  priorTestScore: number  // Điểm test trước đó
  csStaff: string         // CS phụ trách
  renewalStatus: 'Đang chăm sóc' | 'Thành công' | 'Thất bại' // Trạng thái chính
  subStatus: 'Chờ xử lý' | 'Khách cọc' | 'Hoàn tất' | 'Đóng full' | 'Thất bại tự động' | 'Thất bại từ chối'
  resultType: 'Tái phí thành công' | 'Vợt fail thành công' | 'Chồng phí tháng T thành công' | 'Gia hạn thời gian hết phí' | 'Thất bại' | 'Đang chăm sóc'
  interactionNotes?: string // Nội dung tương tác mới nhất
  studentFolderLink: string // Thư mục học viên
  learningResultsLink?: string // Đường dẫn báo cáo học tập
  interactionLogs: CareInteractionLog[]
  churnReason?: 'Học phí cao' | 'Chuyển nơi ở' | 'Không tiến bộ' | 'Trùng lịch học' | 'Dịch vụ chưa tốt' | 'Khác'
  careAlert?: 'C90B' | 'Học lực yếu' | 'Chuyên cần thấp' // Cảnh báo CSKH
}

// Current simulated local time is May 27, 2026.
// Month T = May 2026.
// Month T-1 = April 2026 (Past)
// Month T+1 = June 2026 (Future)
// Month T+2 = July 2026 (Future)

export const mockRenewalRecords: RenewalCareRecord[] = [
  // 1. Trần Minh Châu (ID: 140330) - 3 classes (2 Station + 1 Tutor)
  {
    id: "ren-c1-1",
    studentId: "140330",
    studentName: "Trần Minh Châu",
    customerCode: "CUST_MINHCHAU",
    subject: "Toán tư duy",
    level: "Einstein 0",
    subLevel: "A",
    classCode: "LD_TOAN_00010",
    startDate: "17/08/2023",
    expirationDate: "2026-04-20", // Month T-1 (Past)
    realtimeStatus: "Chờ chuyển lớp",
    teacherCode: "GV_HuiLT20",
    schedule: "T4 - 17:30-19:30",
    totalSessions: 102,
    remainingSessions: 0,
    attendanceRatio: "6/6",
    homeworkCompletion: 80.0,
    lastTestScore: 9.8,
    priorTestScore: 0.3,
    csStaff: "AnhNTN33",
    renewalStatus: "Đang chăm sóc", // Past, initially in progress
    subStatus: "Chờ xử lý",
    resultType: "Đang chăm sóc",
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-1",
    careAlert: "C90B",
    interactionLogs: []
  },
  {
    id: "ren-c1-2",
    studentId: "140330",
    studentName: "Trần Minh Châu",
    customerCode: "CUST_MINHCHAU",
    subject: "Tiếng Anh",
    level: "Level 4",
    subLevel: "A",
    classCode: "LD_TA_00020",
    startDate: "17/08/2023",
    expirationDate: "2026-05-12", // Month T (Present)
    realtimeStatus: "Đang học",
    teacherCode: "GV_F010",
    schedule: "T2 - 19:25-20:55, T5 - 19:25-20:55",
    totalSessions: 110,
    remainingSessions: 1,
    attendanceRatio: "6/6",
    homeworkCompletion: 80.0,
    lastTestScore: 9.5,
    priorTestScore: 8.0,
    csStaff: "AnhNTN33",
    renewalStatus: "Đang chăm sóc",
    subStatus: "Chờ xử lý",
    resultType: "Đang chăm sóc",
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-1",
    interactionLogs: []
  },
  {
    id: "ren-c1-3",
    studentId: "140330",
    studentName: "Trần Minh Châu",
    customerCode: "CUST_MINHCHAU",
    subject: "Tiếng Anh",
    level: "Tutor Level 4",
    subLevel: "B",
    classCode: "TUTOR_TA_001",
    startDate: "17/08/2023",
    expirationDate: "2026-06-15", // Month T+1 (Future)
    realtimeStatus: "Đang học",
    teacherCode: "GV_TUTOR_01",
    substituteTeacher: "GV_TUTOR_SUB",
    schedule: "T6 - 20:00-21:30",
    totalSessions: 30,
    remainingSessions: 12,
    attendanceRatio: "5/5",
    homeworkCompletion: 90.0,
    lastTestScore: 8.5,
    priorTestScore: 7.5,
    csStaff: "AnhNTN33",
    renewalStatus: "Đang chăm sóc",
    subStatus: "Chờ xử lý",
    resultType: "Đang chăm sóc",
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-1",
    interactionLogs: []
  },

  // 2. Nguyễn Hoàng Nam (ID: 160999) - 3 classes (2 Station + 1 Tutor)
  {
    id: "ren-nam-1",
    studentId: "160999",
    studentName: "Nguyễn Hoàng Nam",
    customerCode: "10999888",
    subject: "Toán tư duy",
    level: "Archimedes 5",
    subLevel: "A",
    classCode: "LD_TOAN_00011",
    startDate: "20/12/2023",
    expirationDate: "2026-06-20", // Month T+1 (Future)
    realtimeStatus: "Đang học",
    teacherCode: "GV_HuiLT20",
    schedule: "T3 - 18:30-20:30",
    totalSessions: 80,
    remainingSessions: 14,
    attendanceRatio: "8/8",
    homeworkCompletion: 92.5,
    lastTestScore: 8.8,
    priorTestScore: 7.5,
    csStaff: "AnhNTN33",
    renewalStatus: "Đang chăm sóc",
    subStatus: "Chờ xử lý",
    resultType: "Đang chăm sóc",
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-nam",
    interactionLogs: []
  },
  {
    id: "ren-nam-2",
    studentId: "160999",
    studentName: "Nguyễn Hoàng Nam",
    customerCode: "10999888",
    subject: "Tiếng Anh",
    level: "Level 4",
    subLevel: "A",
    classCode: "LD_TA_00021",
    startDate: "20/12/2023",
    expirationDate: "2026-05-25", // Month T (Present)
    realtimeStatus: "Đang học",
    teacherCode: "GV_F010",
    substituteTeacher: "GV_TA_SUB",
    schedule: "T2 - 18:00-19:30, T5 - 18:00-19:30",
    totalSessions: 96,
    remainingSessions: 1,
    attendanceRatio: "7/8",
    homeworkCompletion: 85.0,
    lastTestScore: 8.2,
    priorTestScore: 8.0,
    csStaff: "AnhNTN33",
    renewalStatus: "Đang chăm sóc",
    subStatus: "Chờ xử lý",
    resultType: "Đang chăm sóc",
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-nam",
    interactionLogs: []
  },
  {
    id: "ren-nam-3",
    studentId: "160999",
    studentName: "Nguyễn Hoàng Nam",
    customerCode: "10999888",
    subject: "Tiếng Anh",
    level: "Tutor Level 4",
    subLevel: "B",
    classCode: "TUTOR_TA_002",
    startDate: "22/12/2023",
    expirationDate: "2026-07-10", // Month T+2 (Future)
    realtimeStatus: "Đang học",
    teacherCode: "GV_TUTOR_02",
    schedule: "T7 - 19:30-21:00",
    totalSessions: 40,
    remainingSessions: 28,
    attendanceRatio: "6/6",
    homeworkCompletion: 100.0,
    lastTestScore: 9.0,
    priorTestScore: 8.5,
    csStaff: "AnhNTN33",
    renewalStatus: "Đang chăm sóc",
    subStatus: "Chờ xử lý",
    resultType: "Đang chăm sóc",
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-nam",
    interactionLogs: []
  },

  // 3. Nguyễn Phương Vy (May 15, 2026 - Month T)
  {
    id: "ren-c3",
    studentId: "140305",
    studentName: "Nguyễn Phương Vy",
    customerCode: "10210078",
    subject: "Tiếng Anh",
    level: "Level 4",
    subLevel: "A",
    classCode: "LD_TA_00020",
    startDate: "31/07/2023",
    expirationDate: "2026-05-15", // Month T (Present)
    realtimeStatus: "Đang học",
    teacherCode: "GV_F010",
    schedule: "T2 - 19:25-20:55, T5 - 19:25-20:55",
    totalSessions: 110,
    remainingSessions: 2,
    attendanceRatio: "7/8",
    homeworkCompletion: 80.0,
    lastTestScore: 9.8,
    priorTestScore: 9.0,
    csStaff: "AnhNTN33",
    renewalStatus: "Đang chăm sóc",
    subStatus: "Chờ xử lý",
    resultType: "Đang chăm sóc",
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-2",
    interactionLogs: []
  },

  // 4. Nguyễn Hà Phương (April 18, 2026 - Month T-1)
  {
    id: "ren-c4",
    studentId: "113838",
    studentName: "Nguyễn Hà Phương",
    customerCode: "9986363",
    subject: "Tiếng Anh",
    level: "Level 5",
    subLevel: "B",
    classCode: "LD_TA_00008",
    startDate: "17/08/2023",
    expirationDate: "2026-04-18", // Month T-1 (Past)
    realtimeStatus: "Chờ chuyển lớp",
    teacherCode: "GV_F010",
    schedule: "T2 - 18:30-20:00, T5 - 18:30-20:00",
    totalSessions: 96,
    remainingSessions: 0,
    attendanceRatio: "8/8",
    homeworkCompletion: 100.0,
    lastTestScore: 7.8,
    priorTestScore: 8.0,
    csStaff: "AnhNTN33",
    renewalStatus: "Đang chăm sóc",
    subStatus: "Chờ xử lý",
    resultType: "Đang chăm sóc",
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-3",
    interactionLogs: []
  },

  // 5. Kim Nhật Anh (June 1, 2026 - Month T+1)
  {
    id: "ren-c5",
    studentId: "149235",
    studentName: "Kim Nhật Anh",
    customerCode: "3488383",
    subject: "Tiếng Anh",
    level: "Level 4",
    subLevel: "A",
    classCode: "LD_TA_00019",
    startDate: "19/08/2023",
    expirationDate: "2026-06-01", // Month T+1 (Future)
    realtimeStatus: "Đang học",
    teacherCode: "GV_F010",
    schedule: "T5 - 17:45-19:15, CN - 17:45-19:15",
    totalSessions: 108,
    remainingSessions: 8,
    attendanceRatio: "6/8",
    homeworkCompletion: 70.0,
    lastTestScore: 8.5,
    priorTestScore: 8.3,
    csStaff: "AnhNTN33",
    renewalStatus: "Đang chăm sóc",
    subStatus: "Chờ xử lý",
    resultType: "Đang chăm sóc",
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-4",
    interactionLogs: []
  },

  // 6. Nguyễn Mỹ Linh (May 10, 2026 - Month T)
  {
    id: "ren-c6",
    studentId: "149231",
    studentName: "Nguyễn Mỹ Linh",
    customerCode: "4542038",
    subject: "Toán tư duy",
    level: "Archimedes 5",
    subLevel: "A",
    classCode: "LD_TOAN_00007",
    startDate: "11/10/2023",
    expirationDate: "2026-05-10", // Month T (Present)
    realtimeStatus: "Đang học",
    teacherCode: "GV_HuiLT20",
    schedule: "T6 - 19:20-21:10",
    totalSessions: 98,
    remainingSessions: 1,
    attendanceRatio: "8/8",
    homeworkCompletion: 0.0,
    lastTestScore: 0.7,
    priorTestScore: 8.7,
    csStaff: "AnhNTN33",
    renewalStatus: "Đang chăm sóc",
    subStatus: "Chờ xử lý",
    resultType: "Đang chăm sóc",
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-5",
    interactionLogs: []
  },

  // 7. Phạm Đình Nguyên (April 30, 2026 - Month T-1)
  {
    id: "ren-c7",
    studentId: "152149",
    studentName: "Phạm Đình Nguyên",
    customerCode: "10404458",
    subject: "Tiếng Anh",
    level: "Level 4",
    subLevel: "A",
    classCode: "LD_TA_00010",
    startDate: "02/11/2023",
    expirationDate: "2026-04-30", // Month T-1 (Past)
    realtimeStatus: "Đang học",
    teacherCode: "GV_F010",
    schedule: "T2 - 17:45-19:15, T5 - 17:45-19:15",
    totalSessions: 59,
    remainingSessions: 0,
    attendanceRatio: "8/8",
    homeworkCompletion: 66.7,
    lastTestScore: 0.7,
    priorTestScore: 0.0,
    csStaff: "AnhNTN33",
    renewalStatus: "Đang chăm sóc",
    subStatus: "Chờ xử lý",
    resultType: "Đang chăm sóc",
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-6",
    interactionLogs: []
  },

  // 8. Minh Vy (July 2, 2026 - Month T+2)
  {
    id: "ren-c8",
    studentId: "152292",
    studentName: "Minh Vy",
    customerCode: "10057474",
    subject: "Tiếng Anh",
    level: "Level 4",
    subLevel: "A",
    classCode: "LD_TA_00019",
    startDate: "05/11/2023",
    expirationDate: "2026-07-02", // Month T+2 (Future)
    realtimeStatus: "Đang học",
    teacherCode: "GV_F010",
    schedule: "T3 - 17:45-19:15, CN - 17:45-19:15",
    totalSessions: 106,
    remainingSessions: 18,
    attendanceRatio: "7/8",
    homeworkCompletion: 100.0,
    lastTestScore: 0.2,
    priorTestScore: 0.9,
    csStaff: "AnhNTN33",
    renewalStatus: "Đang chăm sóc",
    subStatus: "Chờ xử lý",
    resultType: "Đang chăm sóc",
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-8",
    interactionLogs: []
  }
]

// Pure helper to parse date to get month code (relative to simulated current month May 2026)
export function getCareStage(expirationDateStr: string): 'T-1' | 'T' | 'T+1' | 'T+2' {
  const date = new Date(expirationDateStr)
  const expYear = date.getFullYear()
  const expMonth = date.getMonth() // 0-indexed

  // Simulated current date: May 27, 2026
  const currentYear = 2026
  const currentMonth = 4 // May is 4 (0-indexed)

  const diffMonths = (expYear - currentYear) * 12 + (expMonth - currentMonth)

  if (diffMonths < 0) return 'T-1'
  if (diffMonths === 0) return 'T'
  if (diffMonths === 1) return 'T+1'
  return 'T+2'
}

// Get filtered renewal records
export function getRenewalRecords(filters?: {
  search?: string
  branch?: string
  renewalStatus?: string
  classCode?: string
  stage?: 'T-1' | 'T' | 'T+1' | 'T+2'
}): RenewalCareRecord[] {
  return mockRenewalRecords.filter((item) => {
    if (filters?.stage && getCareStage(item.expirationDate) !== filters.stage) return false
    if (filters?.renewalStatus && item.renewalStatus !== filters.renewalStatus) return false
    if (filters?.classCode && item.classCode !== filters.classCode) return false
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      return (
        item.studentName.toLowerCase().includes(q) ||
        item.studentId.includes(q) ||
        item.classCode.toLowerCase().includes(q) ||
        item.teacherCode.toLowerCase().includes(q) ||
        (item.customerCode && item.customerCode.includes(q))
      )
    }
    return true
  })
}

// Update a renewal record's action with automatic state machine transitions
export function updateRenewalRecordAction(
  id: string,
  actionType: 'Khách cọc' | 'Hoàn tất' | 'Đóng full' | 'Từ chối' | 'Liên hệ lại',
  notes: string,
  churnReason?: 'Học phí cao' | 'Chuyển nơi ở' | 'Không tiến bộ' | 'Trùng lịch học' | 'Dịch vụ chưa tốt' | 'Khác',
  staffName: string = 'AnhNTN33'
): boolean {
  const item = mockRenewalRecords.find((i) => i.id === id)
  if (!item) return false

  const stage = getCareStage(item.expirationDate)

  // 1. Create a log entry
  const log: CareInteractionLog = {
    id: `log-ren-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    staffName,
    actionType,
    notes: actionType === 'Từ chối' && churnReason ? `[Lý do: ${churnReason}] ${notes}` : notes
  }
  item.interactionLogs = [...item.interactionLogs, log]
  item.interactionNotes = notes

  // 2. Perform state transitions
  if (actionType === 'Liên hệ lại') {
    item.renewalStatus = 'Đang chăm sóc'
    item.subStatus = 'Chờ xử lý'
    item.resultType = 'Đang chăm sóc'
    item.churnReason = undefined
    return true
  }

  if (actionType === 'Từ chối') {
    item.renewalStatus = 'Thất bại'
    item.subStatus = 'Thất bại từ chối'
    item.resultType = 'Thất bại'
    item.churnReason = churnReason
    return true
  }

  // Handle financial actions
  if (stage === 'T-1') {
    // Past
    if (actionType === 'Khách cọc') {
      item.renewalStatus = 'Thành công'
      item.subStatus = 'Khách cọc'
      item.resultType = 'Gia hạn thời gian hết phí'
      // Auto extend expiration date by 30 days
      const date = new Date(item.expirationDate)
      date.setDate(date.getDate() + 30)
      item.expirationDate = date.toISOString().split('T')[0]
    } else if (actionType === 'Hoàn tất' || actionType === 'Đóng full') {
      item.renewalStatus = 'Thành công'
      item.subStatus = actionType === 'Hoàn tất' ? 'Hoàn tất' : 'Đóng full'
      item.resultType = 'Vợt fail thành công'
    }
  } else if (stage === 'T') {
    // Present
    if (actionType === 'Khách cọc') {
      item.renewalStatus = 'Thành công'
      item.subStatus = 'Khách cọc'
      item.resultType = 'Gia hạn thời gian hết phí'
      // Auto extend expiration date by 30 days
      const date = new Date(item.expirationDate)
      date.setDate(date.getDate() + 30)
      item.expirationDate = date.toISOString().split('T')[0]
    } else if (actionType === 'Hoàn tất' || actionType === 'Đóng full') {
      item.renewalStatus = 'Thành công'
      item.subStatus = actionType === 'Hoàn tất' ? 'Hoàn tất' : 'Đóng full'
      item.resultType = 'Tái phí thành công'
    }
  } else {
    // Future (T+1 or T+2)
    if (actionType === 'Khách cọc') {
      item.renewalStatus = 'Thành công'
      item.subStatus = 'Khách cọc'
      item.resultType = 'Gia hạn thời gian hết phí'
      // Auto extend expiration date by 30 days
      const date = new Date(item.expirationDate)
      date.setDate(date.getDate() + 30)
      item.expirationDate = date.toISOString().split('T')[0]
    } else if (actionType === 'Hoàn tất' || actionType === 'Đóng full') {
      item.renewalStatus = 'Thành công'
      item.subStatus = actionType === 'Hoàn tất' ? 'Hoàn tất' : 'Đóng full'
      item.resultType = 'Chồng phí tháng T thành công'
    }
  }

  return true
}

// Simulates Month T passing / ending.
// Converts all "Đang chăm sóc" records in Month T (or T-1) where expirationDate is past to "Thất bại" (Thất bại tự động)
// Month T+1 and Month T+2 remain "Đang chăm sóc".
export function runMonthEndSimulation(): boolean {
  // Today's simulated date is 2026-05-27. Let's assume we advance to June 1, 2026 for this calculation.
  let affected = 0
  mockRenewalRecords.forEach((item) => {
    const stage = getCareStage(item.expirationDate)
    if (item.renewalStatus === 'Đang chăm sóc') {
      // If it is in T or T-1 (meaning expired in May 2026 or April 2026)
      if (stage === 'T' || stage === 'T-1') {
        item.renewalStatus = 'Thất bại'
        item.subStatus = 'Thất bại tự động'
        item.resultType = 'Thất bại'
        item.interactionNotes = 'Tự động chuyển Thất bại khi hết tháng (Hạn chăm sóc tối đa đã qua)'
        
        // Add log
        item.interactionLogs = [
          ...item.interactionLogs,
          {
            id: `log-sim-${Date.now()}`,
            date: "2026-06-01",
            staffName: "Hệ thống",
            actionType: "Từ chối",
            notes: "Tự động chuyển Thất bại khi hết tháng (Hạn chăm sóc tối đa đã qua)"
          }
        ]
        affected++
      }
    }
  })
  return affected > 0
}

export function addRenewalRecord(
  record: Omit<RenewalCareRecord, 'id' | 'renewalStatus' | 'subStatus' | 'resultType' | 'interactionLogs'> & { id?: string }
): RenewalCareRecord {
  const newRecord: RenewalCareRecord = {
    ...record,
    id: record.id || `ren-manual-${Date.now()}`,
    renewalStatus: 'Đang chăm sóc',
    subStatus: 'Chờ xử lý',
    resultType: 'Đang chăm sóc',
    interactionLogs: []
  }
  
  const existingIndex = mockRenewalRecords.findIndex(
    (r) => r.studentId === record.studentId && r.classCode === record.classCode
  )
  
  if (existingIndex !== -1) {
    mockRenewalRecords[existingIndex].renewalStatus = 'Đang chăm sóc'
    mockRenewalRecords[existingIndex].subStatus = 'Chờ xử lý'
    mockRenewalRecords[existingIndex].resultType = 'Đang chăm sóc'
    mockRenewalRecords[existingIndex].expirationDate = record.expirationDate
    mockRenewalRecords[existingIndex].csStaff = record.csStaff
    mockRenewalRecords[existingIndex].remainingSessions = record.remainingSessions
    mockRenewalRecords[existingIndex].totalSessions = record.totalSessions
    return mockRenewalRecords[existingIndex]
  } else {
    mockRenewalRecords.unshift(newRecord)
    return newRecord
  }
}

