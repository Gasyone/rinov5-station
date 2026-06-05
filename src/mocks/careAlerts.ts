export interface CareInteractionLog {
  id: string
  date: string
  staffName: string
  callConfirmation: 'Đã gọi' | 'KNM' | 'Đã nhắn Zalo' | 'Chưa gọi'
  notes: string
}

export interface StudentCareAlert {
  id: string              // STT
  studentId: string       // student_id
  customerCode?: string   // customer_code
  studentName: string     // student_name
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
  careAlert?: 'C90B' | 'Học lực yếu' | 'Chuyên cần thấp' // Cảnh báo CSKH
  studentFolderLink: string // Link folder thông tin HS (ảnh, video)
  realtimeStatus: 'Đang học' | 'Chờ chuyển lớp' | 'Hết buổi' // Trạng thái (Real-time)
  teacherEvaluation?: string // CSSR GV đánh giá
  learningResultsLink: string // Link KQHT của HS
  teacherFeedbackMonth5?: string // Nhận xét của Giáo viên (Tháng 5)
  csStaff: string         // Tên CS
  confirmC90B?: 'ĐÃ CSDB' | 'ĐANG XỬ LÝ' | 'CHƯA XÁC NHẬN' // Xác nhận C90B
  firstTwoSessionsNotes?: string // Nội dung trao đổi 2 buổi học đầu tiên
  callConfirmation: 'Đã gọi' | 'KNM' | 'Đã nhắn Zalo' | 'Chưa gọi' // Xác nhận cuộc gọi
  interactionNotes?: string // Nội dung trao đổi
  interactionLogs: CareInteractionLog[]
  substituteTeacher?: string // GV dạy thay (optional)
}

export interface FamilyContact {
  name: string
  relationship: string
  phone: string
  isPrimary?: boolean
}

export function getFamilyContacts(studentId: string, studentName: string): FamilyContact[] {
  const lastDigit = parseInt(studentId.slice(-1), 10) || 0
  const contacts: FamilyContact[] = []
  const cleanNum = (studentId.replace(/\D/g, '') + '123').slice(0, 3)

  if (studentName === "Trần Minh Châu" || studentName === "Kim Nhật Anh" || lastDigit % 3 === 0) {
    contacts.push({
      name: `${studentName.split(' ').slice(-1)[0]} Mẹ Nguyễn Thị Mai`,
      relationship: "Mẹ",
      phone: `090${cleanNum}294`,
      isPrimary: true
    })
    contacts.push({
      name: `${studentName.split(' ').slice(-1)[0]} Bố Trần Văn Sơn`,
      relationship: "Bố",
      phone: `091${cleanNum}999`
    })
  } else {
    const prefixes = ["038", "094", "091", "097", "086", "098"]
    const prefix = prefixes[lastDigit % prefixes.length]
    contacts.push({
      name: `${studentName.split(' ').slice(-1)[0]} Mẹ Lê Thu Thủy`,
      relationship: "Mẹ",
      phone: `${prefix}${cleanNum}122`,
      isPrimary: true
    })
  }

  return contacts
}

export const mockCareAlerts: StudentCareAlert[] = [
  {
    id: "1",
    studentId: "140330",
    customerCode: "",
    studentName: "Trần Minh Châu",
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
    priorTestScore: 0.3,
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-1",
    realtimeStatus: "Chờ chuyển lớp",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-1",
    csStaff: "AnhNTN33",
    callConfirmation: "Chưa gọi",
    interactionLogs: []
  },
  {
    id: "2",
    studentId: "140305",
    customerCode: "10210078",
    studentName: "Nguyễn Phương Vy",
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
    priorTestScore: 0.3,
    studentFolderLink: "https://docs.google.com/document/d/rinov5-student-folder-2",
    realtimeStatus: "Đang học",
    learningResultsLink: "https://docs.google.com/document/d/learning-result-2",
    csStaff: "AnhNTN33",
    callConfirmation: "Chưa gọi",
    interactionLogs: []
  },
  {
    id: "3",
    studentId: "113838",
    customerCode: "9986363",
    studentName: "Nguyễn Hà Phương",
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
    csStaff: "AnhNTN33",
    callConfirmation: "Đã gọi",
    interactionNotes: "Đã nhắn tin Zalo trao đổi với mẹ nhắc con làm bài tập chuẩn bị chuyển lớp mới.",
    interactionLogs: [
      {
        id: "log-c3-1",
        date: "2026-05-25",
        staffName: "AnhNTN33",
        callConfirmation: "Đã gọi",
        notes: "Đã nhắn tin Zalo trao đổi với mẹ nhắc con làm bài tập chuẩn bị chuyển lớp mới."
      }
    ]
  },
  {
    id: "4",
    studentId: "149235",
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
    csStaff: "AnhNTN33",
    callConfirmation: "Đã gọi",
    interactionNotes: "Gọi điện cho mẹ qua zalo, mẹ bày tỏ băn khoăn vì gần đây cuối tuần con hay nghỉ học. CS đã định hướng việc học lên lớp 5 sắp tới và giải thích để mẹ sắp xếp cho con.",
    interactionLogs: [
      {
        id: "log-c4-1",
        date: "2026-05-24",
        staffName: "AnhNTN33",
        callConfirmation: "Đã gọi",
        notes: "Gọi điện cho mẹ qua zalo, mẹ bày tỏ băn khoăn vì gần đây cuối tuần con hay nghỉ học. CS đã định hướng việc học lên lớp 5 sắp tới và giải thích để mẹ sắp xếp cho con."
      }
    ]
  },
  {
    id: "5",
    studentId: "149231",
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
    csStaff: "AnhNTN33",
    callConfirmation: "Chưa gọi",
    interactionLogs: []
  },
  {
    id: "6",
    studentId: "152149",
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
    csStaff: "AnhNTN33",
    callConfirmation: "Đã gọi",
    interactionNotes: "Đợt này mẹ phản hồi cho con chơi nhiều, tối nay về sẽ nhắc con làm BTVN và chuẩn bị bài học.",
    interactionLogs: [
      {
        id: "log-c6-1",
        date: "2026-05-26",
        staffName: "AnhNTN33",
        callConfirmation: "Đã gọi",
        notes: "Đợt này mẹ phản hồi cho con chơi nhiều, tối nay về sẽ nhắc con làm BTVN và chuẩn bị bài học."
      }
    ]
  },
  {
    id: "7",
    studentId: "152149",
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
    csStaff: "AnhNTN33",
    callConfirmation: "Chưa gọi",
    interactionLogs: []
  },
  {
    id: "8",
    studentId: "152292",
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
    csStaff: "AnhNTN33",
    callConfirmation: "Đã nhắn Zalo",
    interactionNotes: "Trao đổi với mẹ bằng zalo trung tâm để nhắc mẹ nhắc con làm lại bài kiểm tra và làm bài tập về nhà đầy đủ.",
    interactionLogs: [
      {
        id: "log-c8-1",
        date: "2026-05-26",
        staffName: "AnhNTN33",
        callConfirmation: "Đã nhắn Zalo",
        notes: "Trao đổi với mẹ bằng zalo trung tâm để nhắc mẹ nhắc con làm lại bài kiểm tra và làm bài tập về nhà đầy đủ."
      }
    ]
  },
  {
    id: "9",
    studentId: "152414",
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
    csStaff: "AnhNTN33",
    callConfirmation: "Đã nhắn Zalo",
    interactionNotes: "Nhờ ba mẹ nhắc nhở con làm bài tập về nhà vì tỷ lệ hoàn thành hiện tại đang rất thấp.",
    interactionLogs: [
      {
        id: "log-c9-1",
        date: "2026-05-26",
        staffName: "AnhNTN33",
        callConfirmation: "Đã nhắn Zalo",
        notes: "Nhờ ba mẹ nhắc nhở con làm bài tập về nhà vì tỷ lệ hoàn thành hiện tại đang rất thấp."
      }
    ]
  },
  {
    id: "10",
    studentId: "152817",
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
    csStaff: "AnhNTN33",
    callConfirmation: "Chưa gọi",
    interactionLogs: []
  },
  {
    id: "11",
    studentId: "152910",
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
    csStaff: "AnhNTN33",
    callConfirmation: "Chưa gọi",
    interactionLogs: []
  },
  {
    id: "12",
    studentId: "152920",
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
    csStaff: "AnhNTN33",
    callConfirmation: "Đã gọi",
    interactionNotes: "Nhắn tin qua Zalo với mẹ, mẹ hứa nhắc nhở con làm bài tập về nhà nhiều hơn khi thi xong.",
    interactionLogs: [
      {
        id: "log-c12-1",
        date: "2026-05-26",
        staffName: "AnhNTN33",
        callConfirmation: "Đã gọi",
        notes: "Nhắn tin qua Zalo với mẹ, mẹ hứa nhắc nhở con làm bài tập về nhà nhiều hơn khi thi xong."
      }
    ]
  },
  {
    id: "13",
    studentId: "152940",
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
    csStaff: "AnhNTN33",
    callConfirmation: "Đã gọi",
    interactionNotes: "Mẹ phản hồi đợt này do con bận ôn thi, mong muốn trung tâm gửi thêm tài liệu để con tự ôn. Đã gửi link tài liệu cho mẹ và add Zalo nhóm.",
    interactionLogs: [
      {
        id: "log-c13-1",
        date: "2026-05-26",
        staffName: "AnhNTN33",
        callConfirmation: "Đã gọi",
        notes: "Mẹ phản hồi đợt này do con bận ôn thi, mong muốn trung tâm gửi thêm tài liệu để con tự ôn. Đã gửi link tài liệu cho mẹ và add Zalo nhóm."
      }
    ]
  },
  {
    id: "14",
    studentId: "153100",
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
    csStaff: "AnhNTN33",
    callConfirmation: "Chưa gọi",
    interactionLogs: []
  },
  {
    id: "15",
    studentId: "54057",
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
    csStaff: "AnhNTN33",
    callConfirmation: "Chưa gọi",
    interactionLogs: []
  },
  {
    id: "16",
    studentId: "153623",
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
    csStaff: "AnhNTN33",
    callConfirmation: "Chưa gọi",
    interactionLogs: []
  },
  {
    id: "17",
    studentId: "140330",
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
    csStaff: "AnhNTN33",
    callConfirmation: "Chưa gọi",
    interactionLogs: []
  },
  {
    id: "18",
    studentId: "140330",
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
    csStaff: "AnhNTN33",
    callConfirmation: "Chưa gọi",
    interactionLogs: [],
    substituteTeacher: "GV_TUTOR_SUB"
  },
  {
    id: "19",
    studentId: "160999",
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
    csStaff: "AnhNTN33",
    callConfirmation: "Chưa gọi",
    interactionLogs: []
  },
  {
    id: "20",
    studentId: "160999",
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
    csStaff: "AnhNTN33",
    callConfirmation: "Chưa gọi",
    interactionLogs: [],
    substituteTeacher: "GV_TA_SUB"
  },
  {
    id: "21",
    studentId: "160999",
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
    csStaff: "AnhNTN33",
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
  confirmC90B?: StudentCareAlert['confirmC90B']
): boolean {
  const item = mockCareAlerts.find((i) => i.id === id)
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
    return true
  }
  return false
}

export function triggerCareAlertCalculation(): boolean {
  // Simulator for updating statistics
  return true
}
