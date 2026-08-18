export interface MissedCallLogItem {
  time: string
  status: string
  note: string
  nextCallback?: string
}

export interface CareInteractionLog {
  id: string
  date: string
  staffName: string
  callConfirmation: 'Đã gọi' | 'KNM' | 'Đã nhắn Zalo' | 'Chưa gọi' | 'Đã gặp trực tiếp' | 'Đã tương tác'
  notes: string
  staffAvatar?: string
  parentOpinion?: string
  audioDuration?: string
  audioUrl?: string
  missedCallsList?: MissedCallLogItem[]
}

export interface StudentCareAlert {
  id: string              // STT
  studentId: string       // student_id
  customerCode?: string   // customer_code
  studentName: string     // student_name
  englishName?: string    // Tên tiếng Anh
  startDate: string       // Ngày bắt đầu học
  subject: 'Toán tư duy' | 'Tiếng Anh' // Môn học
  status: 'Đang học' | 'Chờ chuyển lớp' | 'Hết buổi' // Trạng thái
  level: string           // Level
  subLevel: string        // Sub-Level
  classCode: string       // Mã lớp
  teacherCode: string     // Mã GV
  schedule: string        // Lịch học
  totalSessions: number   // Số buổi học
  remainingSessions: number // Số buổi còn lại
  expectedEndDate: string // Hạn học dự kiến
  attendanceRatio: string // Chuyên cần (e.g., '6/6')
  homeworkCompletion: number // BTVN (%)
  lastTestScore: number   // Điểm kiểm tra (Lần gần nhất)
  priorTestScore: number  // Điểm kiểm tra (Trước lần gần nhất)
  careAlert?: string // Cảnh báo CSKH
  studentFolderLink: string // Link folder thông tin HS (ảnh, video)
  realtimeStatus: 'Đang học' | 'Chờ chuyển lớp' | 'Hết buổi' // Trạng thái (Real-time)
  teacherEvaluation?: string // CSSR GV đánh giá
  learningResultsLink: string // Link KQHT của HS
  teacherFeedbackMonth5?: string // Nhận xét của Giáo viên (Tháng 5)
  csStaff: string         // Tên CS
  confirmC90B?: 'ĐÃ CSDB' | 'ĐANG XỬ LÝ' | 'CHƯA XÁC NHẬN' // Xác nhận C90B
  firstTwoSessionsNotes?: string // Nội dung trao đổi 2 buổi học đầu tiên
  callConfirmation: 'Đã gọi' | 'KNM' | 'Đã nhắn Zalo' | 'Chưa gọi' | 'Đã gặp trực tiếp' | 'Đã tương tác' // Xác nhận cuộc gọi
  interactionNotes?: string // Nội dung trao đổi
  interactionLogs: CareInteractionLog[]
  substituteTeacher?: string // GV dạy thay (optional)
  completedCareTags?: string[] // Các nhãn cảnh báo chăm sóc đã hoàn thành
  customCareTags?: Array<{ code: string; name: string; description: string; sla: number }> // Các thẻ chăm sóc tự tạo
  activeUpsale?: boolean // Thẻ upsale có đang hoạt động hay không
  activeCSTP?: boolean // Thẻ CSTP có đang hoạt động hay không (mặc định ban đầu là true nếu chưa hoàn thành hoặc chưa có ghi nhận thành công)
  upsaleClassification?: string // Phân loại upsale (chọn trạng thái tương tự tái phí)
  monthlyReportLinks?: string[] // Danh sách link báo cáo tháng
  studentNote?: string // Ghi chú học viên (thói quen, sở thích, mục tiêu học tập)
}

export interface FamilyContact {
  name: string
  relationship: string
  phone: string
  isPrimary?: boolean
  note?: string
}

export function getFamilyContacts(studentId: string, studentName: string): FamilyContact[] {
  const lastDigit = parseInt(studentId.slice(-1), 10) || 0
  const contacts: FamilyContact[] = []
  let cleanNum = (studentId.replace(/\D/g, '') + '123').slice(0, 3)

  // Force siblings relation for Trần Minh Châu and Kim Nhật Anh
  if (studentName === "Trần Minh Châu" || studentName === "Kim Nhật Anh") {
    cleanNum = "161"
  }

  if (studentName === "Trần Minh Châu" || studentName === "Kim Nhật Anh" || lastDigit % 3 === 0) {
    contacts.push({
      name: "Nguyễn Thị Mai",
      relationship: "Mẹ",
      phone: `090${cleanNum}294`,
      isPrimary: true,
      note: "Người liên hệ chính. Rất quan tâm lộ trình của con, thích trao đổi qua Zalo."
    })
    contacts.push({
      name: "Trần Văn Sơn",
      relationship: "Bố",
      phone: `091${cleanNum}999`,
      note: "Chỉ liên hệ khi khẩn cấp hoặc không gọi được cho mẹ."
    })
  } else {
    const prefixes = ["038", "094", "091", "097", "086", "098"]
    const prefix = prefixes[lastDigit % prefixes.length]
    contacts.push({
      name: "Lê Thu Thủy",
      relationship: "Mẹ",
      phone: `${prefix}${cleanNum}122`,
      isPrimary: true,
      note: "Thường nghe máy sau giờ hành chính. Thích nhận tin nhắn Zalo hơn gọi trực tiếp."
    })
  }

  return contacts
}

export const mockCareAlerts: StudentCareAlert[] = [
  {
    id: "bao-han",
    studentId: "s-baohan",
    customerCode: "10700325",
    studentName: "Lê Nguyễn Bảo Hân",
    englishName: "Hannah",
    startDate: "14/08/2024",
    subject: "Toán tư duy",
    status: "Đang học",
    level: "Toán 1:6",
    subLevel: "A",
    classCode: "LD_TOAN_00032",
    teacherCode: "GV_HuiLT20",
    schedule: "T3 - 17:30-19:30, T6 - 17:30-19:30",
    totalSessions: 96,
    remainingSessions: 12,
    expectedEndDate: "14/08/2027",
    attendanceRatio: "92%",
    homeworkCompletion: 85.0,
    lastTestScore: 8.5,
    priorTestScore: 8.0,
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-baohan",
    realtimeStatus: "Đang học",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-baohan",
    csStaff: "Trần Thảo Anh 20",
    callConfirmation: "Đã gọi",
    completedCareTags: ['ĐK1'],
    studentNote: 'Học viên tích cực, chăm chỉ hoàn thành bài tập toán tư duy.',
    interactionNotes: 'Hẹn chuyển khoản hoàn tất tái phí gói Toán 1:6 (96 buổi). Phụ huynh đã nộp trước 2.8 triệu.',
    interactionLogs: []
  },
  {
    id: "1",
    studentId: "s13",
    customerCode: "",
    studentName: "Trần Minh Châu",
    englishName: "Grace",
    startDate: "17/08/2023",
    subject: "Toán tư duy",
    status: "Chờ chuyển lớp",
    level: "Einstein 0",
    subLevel: "A",
    classCode: "LD_TOAN_00010",
    teacherCode: "GV_HuiLT20",
    schedule: "T4 - 17:30-19:30",
    totalSessions: 102,
    remainingSessions: 68,
    expectedEndDate: "17/08/2027",
    attendanceRatio: "0/0",
    homeworkCompletion: 80.0,
    lastTestScore: 9.8,
    priorTestScore: 9.5,
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-1",
    realtimeStatus: "Chờ chuyển lớp",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-1",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Chưa gọi",
    activeCSTP: false,
    completedCareTags: ['ĐK1'],
    studentNote: 'Học viên tích cực, thích hoạt động nhóm, cần động viên nhiều hơn khi làm bài tập cá nhân.',
    interactionLogs: []
  },
  {
    id: "2",
    studentId: "s14",
    customerCode: "10210078",
    studentName: "Nguyễn Phương Vy",
    englishName: "Victoria",
    startDate: "31/07/2023",
    subject: "Tiếng Anh",
    status: "Đang học",
    level: "Level 4",
    subLevel: "A",
    classCode: "LD_TA_00020",
    teacherCode: "GV_F010",
    schedule: "T2 - 19:25-20:55, T5 - 19:25-20:55",
    totalSessions: 110,
    remainingSessions: 60,
    expectedEndDate: "25/10/2026",
    attendanceRatio: "0/0",
    homeworkCompletion: 80.0,
    lastTestScore: 9.8,
    priorTestScore: 9.5,
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-2",
    realtimeStatus: "Đang học",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-2",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Chưa gọi",
    activeCSTP: false,
    studentNote: '',
    interactionLogs: []
  },
  {
    id: "3",
    studentId: "s15",
    customerCode: "9986363",
    studentName: "Nguyễn Hà Phương",
    englishName: "Fiona",
    startDate: "17/08/2023",
    subject: "Tiếng Anh",
    status: "Chờ chuyển lớp",
    level: "Level 5",
    subLevel: "B",
    classCode: "LD_TA_00008",
    teacherCode: "GV_F010",
    schedule: "T2 - 18:30-20:00, T5 - 18:30-20:00",
    totalSessions: 96,
    remainingSessions: 1,
    expectedEndDate: "28/12/2024",
    attendanceRatio: "3/3",
    homeworkCompletion: 100.0,
    lastTestScore: 7.8,
    priorTestScore: 8.0,
    careAlert: "C90B",
    confirmC90B: "ĐÃ CSDB",
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-3",
    realtimeStatus: "Chờ chuyển lớp",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-3",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Đã gọi",
    completedCareTags: ['ĐB1', 'TB1'],
    studentNote: 'Con tiếp thu nhanh các bài học logic, hay đặt câu hỏi phản biện trên lớp.',
    interactionNotes: "Đã nhắn tin Zalo trao đổi với mẹ nhắc con làm bài tập chuẩn bị chuyển lớp mới.",
    interactionLogs: [
      {
        id: "log-c3-1",
        date: "2026-05-25",
        staffName: "Nguyễn Thị Ngọc Anh",
        callConfirmation: "Đã gọi",
        notes: "Đã nhắn tin Zalo trao đổi với mẹ nhắc con làm bài tập chuẩn bị chuyển lớp mới."
      }
    ]
  },
  {
    id: "4",
    studentId: "s16",
    customerCode: "3488383",
    studentName: "Kim Nhật Anh",
    startDate: "19/08/2023",
    subject: "Tiếng Anh",
    status: "Đang học",
    level: "Level 4",
    subLevel: "A",
    classCode: "LD_TA_00019",
    teacherCode: "GV_F010",
    schedule: "T5 - 17:45-19:15, CN - 17:45-19:15",
    totalSessions: 108,
    remainingSessions: 42,
    expectedEndDate: "23/09/2026",
    attendanceRatio: "4/7",
    homeworkCompletion: 57.1,
    lastTestScore: 8.5,
    priorTestScore: 8.3,
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-4",
    realtimeStatus: "Đang học",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-4",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Đã gọi",
    interactionNotes: "Gọi điện cho mẹ qua zalo, mẹ bày tỏ băn khoăn vì gần đây cuối tuần con hay nghỉ học. CS đã định hướng việc học lên lớp 5 sắp tới và giải thích để mẹ sắp xếp cho con.",
    interactionLogs: [
      {
        id: "log-c4-1",
        date: "2026-05-24",
        staffName: "Nguyễn Thị Ngọc Anh",
        callConfirmation: "Đã gọi",
        notes: "Gọi điện cho mẹ qua zalo, mẹ bày tỏ băn khoăn vì gần đây cuối tuần con hay nghỉ học. CS đã định hướng việc học lên lớp 5 sắp tới và giải thích để mẹ sắp xếp cho con."
      }
    ]
  },
  {
    id: "5",
    studentId: "s17",
    customerCode: "4542038",
    studentName: "Nguyễn Mỹ Linh",
    startDate: "11/10/2023",
    subject: "Toán tư duy",
    status: "Đang học",
    level: "Archimedes 5",
    subLevel: "A",
    classCode: "LD_TOAN_00007",
    teacherCode: "GV_HuiLT20",
    schedule: "T6 - 19:20-21:10",
    totalSessions: 98,
    remainingSessions: 54,
    expectedEndDate: "13/05/2027",
    attendanceRatio: "3/3",
    homeworkCompletion: 0.0,
    lastTestScore: 0.7,
    priorTestScore: 8.7,
    careAlert: "C90B",
    confirmC90B: "CHƯA XÁC NHẬN",
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-5",
    realtimeStatus: "Đang học",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-5",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Chưa gọi",
    activeCSTP: false,
    interactionLogs: []
  },
  {
    id: "6",
    studentId: "s18",
    customerCode: "10404458",
    studentName: "Phạm Đình Nguyên",
    startDate: "02/11/2023",
    subject: "Tiếng Anh",
    status: "Đang học",
    level: "Level 4",
    subLevel: "A",
    classCode: "LD_TA_00010",
    teacherCode: "GV_F010",
    schedule: "T2 - 17:45-19:15, T5 - 17:45-19:15",
    totalSessions: 59,
    remainingSessions: 15,
    expectedEndDate: "25/05/2026",
    attendanceRatio: "6/6",
    homeworkCompletion: 66.7,
    lastTestScore: 0.7,
    priorTestScore: 0.0,
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-6",
    realtimeStatus: "Đang học",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-6",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Đã gọi",
    interactionNotes: "Đợt này mẹ phản hồi cho con chơi nhiều, tối nay về sẽ nhắc con làm BTVN và chuẩn bị bài học.",
    interactionLogs: [
      {
        id: "log-c6-1",
        date: "2026-05-26",
        staffName: "Nguyễn Thị Ngọc Anh",
        callConfirmation: "Đã gọi",
        notes: "Đợt này mẹ phản hồi cho con chơi nhiều, tối nay về sẽ nhắc con làm BTVN và chuẩn bị bài học."
      }
    ]
  },
  {
    id: "7",
    studentId: "s18",
    customerCode: "10404458",
    studentName: "Phạm Đình Nguyên",
    startDate: "02/11/2023",
    subject: "Toán tư duy",
    status: "Đang học",
    level: "Einstein 0",
    subLevel: "A",
    classCode: "LD_TOAN_00001",
    teacherCode: "GV_HuiLT20",
    schedule: "T2 - 10:00-12:00, T5 - 10:00-12:00",
    totalSessions: 51,
    remainingSessions: 13,
    expectedEndDate: "02/08/2026",
    attendanceRatio: "3/3",
    homeworkCompletion: 66.7,
    lastTestScore: 0.7,
    priorTestScore: 0.0,
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-7",
    realtimeStatus: "Đang học",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-7",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Chưa gọi",
    interactionLogs: []
  },
  {
    id: "8",
    studentId: "s19",
    customerCode: "10057474",
    studentName: "Minh Vy",
    startDate: "05/11/2023",
    subject: "Tiếng Anh",
    status: "Đang học",
    level: "Level 4",
    subLevel: "A",
    classCode: "LD_TA_00019",
    teacherCode: "GV_F010",
    schedule: "T3 - 17:45-19:15, CN - 17:45-19:15",
    totalSessions: 106,
    remainingSessions: 41,
    expectedEndDate: "23/09/2026",
    attendanceRatio: "5/7",
    homeworkCompletion: 100.0,
    lastTestScore: 0.2,
    priorTestScore: 0.9,
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-8",
    realtimeStatus: "Đang học",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-8",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Đã nhắn Zalo",
    interactionNotes: "Trao đổi với mẹ bằng zalo trung tâm để nhắc mẹ nhắc con làm lại bài kiểm tra và làm bài tập về nhà đầy đủ.",
    interactionLogs: [
      {
        id: "log-c8-1",
        date: "2026-05-26",
        staffName: "Nguyễn Thị Ngọc Anh",
        callConfirmation: "Đã nhắn Zalo",
        notes: "Trao đổi với mẹ bằng zalo trung tâm để nhắc mẹ nhắc con làm lại bài kiểm tra và làm bài tập về nhà đầy đủ."
      }
    ]
  },
  {
    id: "9",
    studentId: "s8",
    customerCode: "10695953",
    studentName: "Trương Bảo An",
    startDate: "21/11/2023",
    subject: "Tiếng Anh",
    status: "Đang học",
    level: "Level 2",
    subLevel: "B",
    classCode: "LD_TA_00014",
    teacherCode: "GV_UYENNTT",
    schedule: "T4 - 17:45-19:15, T6 - 17:45-19:15",
    totalSessions: 123,
    remainingSessions: 47,
    expectedEndDate: "15/10/2026",
    attendanceRatio: "8/8",
    homeworkCompletion: 12.5,
    lastTestScore: 8.7,
    priorTestScore: 0.0,
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-9",
    realtimeStatus: "Đang học",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-9",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Đã nhắn Zalo",
    interactionNotes: "Nhờ ba mẹ nhắc nhở con làm bài tập về nhà vì tỷ lệ hoàn thành hiện tại đang rất thấp.",
    interactionLogs: [
      {
        id: "log-c9-1",
        date: "2026-05-26",
        staffName: "Nguyễn Thị Ngọc Anh",
        callConfirmation: "Đã nhắn Zalo",
        notes: "Nhờ ba mẹ nhắc nhở con làm bài tập về nhà vì tỷ lệ hoàn thành hiện tại đang rất thấp."
      }
    ]
  },
  {
    id: "10",
    studentId: "s9",
    customerCode: "4542201",
    studentName: "Nguyễn Lan Hương",
    startDate: "21/11/2023",
    subject: "Tiếng Anh",
    status: "Đang học",
    level: "Level 4",
    subLevel: "A",
    classCode: "LD_TA_00020",
    teacherCode: "GV_F010",
    schedule: "T2 - 19:25-20:55, T5 - 19:25-20:55",
    totalSessions: 138,
    remainingSessions: 75,
    expectedEndDate: "31/08/2028",
    attendanceRatio: "0/0",
    homeworkCompletion: 20.0,
    lastTestScore: 9.6,
    priorTestScore: 0.0,
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-10",
    realtimeStatus: "Đang học",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-10",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Chưa gọi",
    interactionLogs: []
  },
  {
    id: "11",
    studentId: "s10",
    customerCode: "10558339",
    studentName: "Đặng Thiên An",
    startDate: "23/11/2023",
    subject: "Tiếng Anh",
    status: "Chờ chuyển lớp",
    level: "Level 1",
    subLevel: "B",
    classCode: "LD_TA_00004",
    teacherCode: "GV_DTX",
    schedule: "T2 - 17:30-19:00, T5 - 17:30-19:00",
    totalSessions: 96,
    remainingSessions: 22,
    expectedEndDate: "07/08/2025",
    attendanceRatio: "0/0",
    homeworkCompletion: 0.0,
    lastTestScore: 0.0,
    priorTestScore: 0.0,
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-11",
    realtimeStatus: "Chờ chuyển lớp",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-11",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Chưa gọi",
    interactionLogs: []
  },
  {
    id: "12",
    studentId: "s11",
    customerCode: "10500409",
    studentName: "Đào Viết An",
    startDate: "23/11/2023",
    subject: "Toán tư duy",
    status: "Đang học",
    level: "Archimedes 5",
    subLevel: "A",
    classCode: "LD_TOAN_00007",
    teacherCode: "GV_HuiLT20",
    schedule: "T6 - 19:20-21:10",
    totalSessions: 48,
    remainingSessions: 30,
    expectedEndDate: "07/01/2027",
    attendanceRatio: "3/3",
    homeworkCompletion: 0.0,
    lastTestScore: 0.0,
    priorTestScore: 0.0,
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-12",
    realtimeStatus: "Đang học",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-12",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Đã gọi",
    interactionNotes: "Nhắn tin qua Zalo với mẹ, mẹ hứa nhắc nhở con làm bài tập về nhà nhiều hơn khi thi xong.",
    interactionLogs: [
      {
        id: "log-c12-1",
        date: "2026-05-26",
        staffName: "Nguyễn Thị Ngọc Anh",
        callConfirmation: "Đã gọi",
        notes: "Nhắn tin qua Zalo với mẹ, mẹ hứa nhắc nhở con làm bài tập về nhà nhiều hơn khi thi xong."
      }
    ]
  },
  {
    id: "13",
    studentId: "s12",
    customerCode: "10688414",
    studentName: "Nguyễn Hoàng Vũ",
    startDate: "23/11/2023",
    subject: "Toán tư duy",
    status: "Đang học",
    level: "Archimedes 5",
    subLevel: "A",
    classCode: "LD_TOAN_00007",
    teacherCode: "GV_HuiLT20",
    schedule: "T6 - 19:20-21:10",
    totalSessions: 60,
    remainingSessions: 30,
    expectedEndDate: "07/01/2027",
    attendanceRatio: "8/8",
    homeworkCompletion: 0.0,
    lastTestScore: 0.0,
    priorTestScore: 0.0,
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-13",
    realtimeStatus: "Đang học",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-13",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Đã gọi",
    interactionNotes: "Mẹ phản hồi đợt này do con bận ôn thi, mong muốn trung tâm gửi thêm tài liệu để con tự ôn. Đã gửi link tài liệu cho mẹ và add Zalo nhóm.",
    interactionLogs: [
      {
        id: "log-c13-1",
        date: "2026-05-26",
        staffName: "Nguyễn Thị Ngọc Anh",
        callConfirmation: "Đã gọi",
        notes: "Mẹ phản hồi đợt này do con bận ôn thi, mong muốn trung tâm gửi thêm tài liệu để con tự ôn. Đã gửi link tài liệu cho mẹ và add Zalo nhóm."
      }
    ]
  },
  {
    id: "14",
    studentId: "s5",
    customerCode: "6043770",
    studentName: "Trần Tuấn Khang",
    startDate: "04/12/2023",
    subject: "Tiếng Anh",
    status: "Đang học",
    level: "Level 0",
    subLevel: "A",
    classCode: "LD_TA_00010",
    teacherCode: "GV_F010",
    schedule: "T2 - 19:25-20:55, CN - 19:25-20:55",
    totalSessions: 98,
    remainingSessions: 21,
    expectedEndDate: "18/07/2026",
    attendanceRatio: "5/7",
    homeworkCompletion: 57.1,
    lastTestScore: 8.7,
    priorTestScore: 0.0,
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-14",
    realtimeStatus: "Đang học",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-14",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Chưa gọi",
    interactionLogs: []
  },
  {
    id: "15",
    studentId: "s6",
    customerCode: "3382666",
    studentName: "Đặng Hồng Phúc",
    startDate: "08/12/2023",
    subject: "Tiếng Anh",
    status: "Chờ chuyển lớp",
    level: "Level 5",
    subLevel: "B",
    classCode: "LD_TA_00008",
    teacherCode: "GV_F010",
    schedule: "T2 - 18:30-20:00, T5 - 18:30-20:00",
    totalSessions: 164,
    remainingSessions: 1,
    expectedEndDate: "15/07/2025",
    attendanceRatio: "0/0",
    homeworkCompletion: 0.0,
    lastTestScore: 8.8,
    priorTestScore: 0.0,
    careAlert: "C90B",
    confirmC90B: "CHƯA XÁC NHẬN",
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-15",
    realtimeStatus: "Chờ chuyển lớp",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-15",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Chưa gọi",
    interactionLogs: []
  },
  {
    id: "16",
    studentId: "s7",
    customerCode: "7943384",
    studentName: "Nguyễn Hoàng Dũng",
    startDate: "07/12/2023",
    subject: "Tiếng Anh",
    status: "Đang học",
    level: "Level 4",
    subLevel: "A",
    classCode: "LD_TA_00019",
    teacherCode: "GV_F010",
    schedule: "T3 - 17:45-19:15, CN - 17:45-19:15",
    totalSessions: 70,
    remainingSessions: 5,
    expectedEndDate: "23/05/2026",
    attendanceRatio: "5/7",
    homeworkCompletion: 100.0,
    lastTestScore: 8.0,
    priorTestScore: 5.5,
    careAlert: "C90B",
    confirmC90B: "CHƯA XÁC NHẬN",
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-16",
    realtimeStatus: "Hết buổi",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-16",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Chưa gọi",
    interactionLogs: []
  },
  {
    id: "17",
    studentId: "s13",
    customerCode: "",
    studentName: "Trần Minh Châu",
    startDate: "17/08/2023",
    subject: "Tiếng Anh",
    status: "Đang học",
    level: "Level 4",
    subLevel: "A",
    classCode: "LD_TA_00020",
    teacherCode: "GV_F010",
    schedule: "T2 - 19:25-20:55, T5 - 19:25-20:55",
    totalSessions: 110,
    remainingSessions: 60,
    expectedEndDate: "25/10/2026",
    attendanceRatio: "3/3",
    homeworkCompletion: 80.0,
    lastTestScore: 9.5,
    priorTestScore: 8.0,
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-1",
    realtimeStatus: "Đang học",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-1",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Chưa gọi",
    interactionLogs: []
  },
  {
    id: "18",
    studentId: "s13",
    customerCode: "",
    studentName: "Trần Minh Châu",
    startDate: "17/08/2023",
    subject: "Tiếng Anh",
    status: "Đang học",
    level: "Tutor Level 4",
    subLevel: "B",
    classCode: "TUTOR_TA_001",
    teacherCode: "GV_TUTOR_01",
    schedule: "T6 - 20:00-21:30",
    totalSessions: 30,
    remainingSessions: 12,
    expectedEndDate: "12/12/2026",
    attendanceRatio: "5/5",
    homeworkCompletion: 90.0,
    lastTestScore: 8.5,
    priorTestScore: 7.5,
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-1",
    realtimeStatus: "Đang học",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-1",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Chưa gọi",
    interactionLogs: [],
    substituteTeacher: "GV_TUTOR_SUB"
  },
  {
    id: "19",
    studentId: "s20",
    customerCode: "10999888",
    studentName: "Nguyễn Hoàng Nam",
    startDate: "20/12/2023",
    subject: "Toán tư duy",
    status: "Đang học",
    level: "Archimedes 5",
    subLevel: "A",
    classCode: "LD_TOAN_00011",
    teacherCode: "GV_HuiLT20",
    schedule: "T3 - 18:30-20:30",
    totalSessions: 80,
    remainingSessions: 45,
    expectedEndDate: "15/06/2027",
    attendanceRatio: "8/8",
    homeworkCompletion: 92.5,
    lastTestScore: 8.8,
    priorTestScore: 7.5,
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-nam",
    realtimeStatus: "Đang học",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-nam",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Chưa gọi",
    interactionLogs: []
  },
  {
    id: "20",
    studentId: "s20",
    customerCode: "10999888",
    studentName: "Nguyễn Hoàng Nam",
    startDate: "20/12/2023",
    subject: "Tiếng Anh",
    status: "Đang học",
    level: "Level 4",
    subLevel: "A",
    classCode: "LD_TA_00021",
    teacherCode: "GV_F010",
    schedule: "T2 - 18:00-19:30, T5 - 18:00-19:30",
    totalSessions: 96,
    remainingSessions: 52,
    expectedEndDate: "20/07/2027",
    attendanceRatio: "7/8",
    homeworkCompletion: 85.0,
    lastTestScore: 8.2,
    priorTestScore: 8.0,
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-nam",
    realtimeStatus: "Đang học",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-nam",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Chưa gọi",
    interactionLogs: [],
    substituteTeacher: "GV_TA_SUB"
  },
  {
    id: "21",
    studentId: "s20",
    customerCode: "10999888",
    studentName: "Nguyễn Hoàng Nam",
    startDate: "22/12/2023",
    subject: "Tiếng Anh",
    status: "Đang học",
    level: "Tutor Level 4",
    subLevel: "B",
    classCode: "TUTOR_TA_002",
    teacherCode: "GV_TUTOR_02",
    schedule: "T7 - 19:30-21:00",
    totalSessions: 40,
    remainingSessions: 28,
    expectedEndDate: "18/12/2026",
    attendanceRatio: "6/6",
    homeworkCompletion: 100.0,
    lastTestScore: 9.0,
    priorTestScore: 8.5,
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-nam",
    realtimeStatus: "Đang học",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-nam",
    csStaff: "Nguyễn Thị Ngọc Anh",
    callConfirmation: "Chưa gọi",
    interactionLogs: []
  }
]

export function getCareAlerts(filters?: {
  search?: string
  branch?: string
  status?: string
  careAlert?: string
  classCode?: string
  callConfirmation?: string
}): StudentCareAlert[] {
  return mockCareAlerts.filter((item) => {
    if (filters?.status && item.status !== filters.status) return false
    if (filters?.careAlert && item.careAlert !== filters.careAlert) return false
    if (filters?.classCode && item.classCode !== filters.classCode) return false
    if (filters?.callConfirmation && item.callConfirmation !== filters.callConfirmation) return false
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

export function updateCareAlertInteraction(
  id: string,
  log: Omit<CareInteractionLog, 'id' | 'date'>,
  confirmC90B?: StudentCareAlert['confirmC90B'],
  careType?: 'DB' | 'TB' | 'DK' | 'OTHER'
): boolean {
  const item = mockCareAlerts.find((i) => i.id === id || i.studentId === id)
  if (item) {
    const newLog: CareInteractionLog = {
      ...log,
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    }
    item.interactionLogs = [...item.interactionLogs, newLog]
    item.callConfirmation = log.callConfirmation
    item.interactionNotes = log.notes
    if (confirmC90B) {
      item.confirmC90B = confirmC90B
    }
    if (careType) {
      if (!item.customCareTags) {
        item.customCareTags = []
      }
      let code = ''
      let name = ''
      switch (careType) {
        case 'DB':
          code = 'ĐB-YC'
          name = 'Chăm sóc Đặc biệt'
          break
        case 'TB':
          code = 'TB-YC'
          name = 'Chăm sóc Học tập (Theo buổi)'
          break
        case 'DK':
          code = 'ĐK-YC'
          name = 'Chăm sóc Định kỳ'
          break
        case 'OTHER':
          code = 'T-YC'
          name = 'Chăm sóc Khác'
          break
      }
      if (code && !item.customCareTags.some(t => t.code === code)) {
        item.customCareTags.push({
          code,
          name,
          description: `Yêu cầu ${name} vừa được khởi tạo.`,
          sla: 3
        })
      }
    }
    return true
  }
  return false
}

export function triggerCareAlertCalculation(): boolean {
  // Simulator for updating statistics
  return true
}

export function completeCareTag(id: string, tagLabel: string): boolean {
  const item = mockCareAlerts.find((i) => i.id === id || i.studentId === id)
  if (item) {
    if (!item.completedCareTags) {
      item.completedCareTags = []
    }
    if (!item.completedCareTags.includes(tagLabel)) {
      item.completedCareTags.push(tagLabel)
    }

    // Add completion log to interactionLogs
    const now = new Date()
    const dateStr = now.toISOString() // Store full ISO string for precise time!
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    // Check if a completion log already exists to avoid duplicates
    const logPrefix = `[${tagLabel}]`
    const hasCompletionLog = item.interactionLogs.some(
      (l) => l.notes.includes(logPrefix) && (l.notes.includes('Hoàn thành') || l.notes.includes('tích chăm sóc') || l.notes.includes('tái phí'))
    )
    if (!hasCompletionLog) {
      const isCstp = tagLabel === 'CSTP'
      item.interactionLogs.push({
        id: `complete-${tagLabel}-${now.getTime()}`,
        date: dateStr,
        staffName: 'CS Staff',
        callConfirmation: 'Đã gọi',
        notes: isCstp
          ? `[${tagLabel}] [Hoàn thành Chăm sóc] Đã tái phí thành công lúc ${timeStr} ngày ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}.`
          : `[${tagLabel}] [Hoàn thành Chăm sóc] Đã hoàn thành chăm sóc thẻ ${tagLabel} lúc ${timeStr} ngày ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}.`,
      })
    }
    return true
  }
  return false
}

export function uncompleteCareTag(id: string, tagLabel: string): boolean {
  const item = mockCareAlerts.find((i) => i.id === id || i.studentId === id)
  if (item) {
    if (item.completedCareTags) {
      item.completedCareTags = item.completedCareTags.filter((t) => t !== tagLabel)
    }
    // Remove the completion log from interactionLogs if any
    item.interactionLogs = item.interactionLogs.filter(
      (l) => !(l.notes.includes(`[${tagLabel}]`) && l.notes.includes('Hoàn thành Chăm sóc'))
    )
    return true
  }
  return false
}

export function updateRenewalClassification(id: string, classification: string): boolean {
  const item = mockCareAlerts.find((i) => i.id === id || i.studentId === id)
  if (item) {
    ;(item as StudentCareAlert & { renewalClassification?: string }).renewalClassification = classification
    return true
  }
  return false
}

export function updateUpsaleClassification(id: string, classification: string): boolean {
  const item = mockCareAlerts.find((i) => i.id === id || i.studentId === id)
  if (item) {
    item.upsaleClassification = classification
    return true
  }
  return false
}

// Populate mock monthly report links programmatically
mockCareAlerts.forEach((item, index) => {
  const hash = index + 1
  item.monthlyReportLinks = hash % 3 === 0 
    ? [
        `https://docs.google.com/document/d/report-t5-${item.studentId}`,
        `https://docs.google.com/document/d/report-t6-${item.studentId}`
      ]
    : hash % 3 === 1 
      ? [
          `https://docs.google.com/document/d/report-t6-${item.studentId}`
        ]
      : []
})
