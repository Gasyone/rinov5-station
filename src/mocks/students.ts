import type { ScheduleSlot } from './classRecords'

export interface EnrolledClass {
  classCode: string
  className: string
  type: 'offline' | 'online_tutor'
  scheduleSlots: ScheduleSlot[]
  teacherName: string
  status: 'active' | 'inactive' | 'pending_transfer' | 'session_ended' | 'wait_for_assignment' | 'absent' | 'excused'
  progress: string
  branch?: string       // Trường học/Chi nhánh của lớp
  room?: string         // Phòng học
  level?: string        // Trình độ lớp
  subLevel?: string     // Sub level lớp
  programName?: string  // Chương trình học
  pathCode?: string     // Mã lộ trình
  startDate?: string    // Từ ngày
  endDate?: string      // Đến ngày
  curriculumName?: string  // Tên khung chương trình
  curriculumCode?: string  // Mã khung chương trình
  nextLessonName?: string  // Tên bài học tiếp theo
  nextLessonDate?: string  // Lịch học buổi tiếp theo
}

export interface Student {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  gender: "Male" | "Female" | "Other"
  dob: string
  status:
    | "pending_payment"
    | "draft_class"
    | "wait_for_assignment"
    | "enroll_later"
    | "pending_transfer"
    | "fee_transfer"
    | "awaiting_opening"
    | "trial"
    | "active"
    | "reserve"
    | "pending"
    | "session_ended"
  enrolledClass?: string
  branch: string
  level: string
  subLevel?: string        // Sub level của học viên
  learningPath?: string    // Lộ trình đang học của học viên
  curriculum?: string      // Khung chương trình đang học của học viên
  parentName?: string
  parentPhone?: string
  enrollmentDate: string
  notes?: string
  enrolledClasses?: EnrolledClass[]
  packageName?: string     // Gói đăng ký
  remainingSessions?: number // Số buổi còn lại
  totalSessions?: number     // Số buổi đăng ký
  saleName?: string        // Sale phụ trách
  subject?: 'english' | 'math' | 'stem' | 'japanese' // Môn học
  schoolClass?: string     // Lớp phổ thông của học viên (Lớp 1, 2, 3...)
  branches?: string[]      // Các cơ sở theo học/liên kết
}

const firstNames = ["An", "Bình", "Chi", "Dũng", "Em", "Giang", "Hiếu", "Khánh", "Mai", "Nam", "Oanh", "Phong", "Quỳnh", "Sơn", "Trang", "Việt", "Xuân", "Yến", "Long", "Hằng"]
const lastNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Nguyễn", "Trần", "Vũ", "Đặng", "Ngô", "Bùi", "Đỗ", "Hồ"]

const makeName = (i: number) => `${lastNames[i % lastNames.length]} ${firstNames[i % firstNames.length]}`

export const mockStudents: Student[] = [
  { 
    id: "s1", 
    name: makeName(0), 
    email: `an@email.com`, 
    phone: "0911111111", 
    gender: "Male", 
    dob: "2005-03-15", 
    status: "active", 
    enrolledClass: "IELTS A1", 
    branch: "RinoEdu Nguyễn Tuân", 
    level: "IELTS", 
    subLevel: "A1",
    learningPath: "Lộ trình IELTS tinh gọn từ mất gốc đến 7.5",
    curriculum: "Khung giáo trình chuẩn Cambridge Academic v2026",
    parentName: "Nguyễn Văn A", 
    parentPhone: "0922222222", 
    enrollmentDate: "2025-01-10",
    packageName: "Gói IELTS cam kết 7.0",
    remainingSessions: 18,
    totalSessions: 36,
    enrolledClasses: [
      { 
        classCode: "CLS-IELTS-01", 
        className: "IELTS A1", 
        type: "offline", 
        scheduleSlots: [
          { dayOfWeek: "Thứ 2", date: "02/06", startTime: "18:00", endTime: "20:00" },
          { dayOfWeek: "Thứ 4", date: "04/06", startTime: "18:00", endTime: "20:00" },
          { dayOfWeek: "Thứ 6", date: "06/06", startTime: "18:00", endTime: "20:00" }
        ], 
        teacherName: "Phạm Văn Giảng Dạy", 
        status: "active", 
        progress: "12 / 24 buổi",
        branch: "RinoEdu Nguyễn Tuân",
        room: "P201",
        level: "IELTS",
        subLevel: "A1",
        programName: "Chương trình IELTS chuẩn quốc tế",
        pathCode: "PATH-IELTS-A1",
        startDate: "2025-01-15",
        endDate: "2025-04-15"
      },
      { 
        classCode: "TUTOR-IELTS-WR", 
        className: "Tutor IELTS Writing", 
        type: "online_tutor", 
        scheduleSlots: [
          { dayOfWeek: "Thứ 7", date: "07/06", startTime: "20:00", endTime: "21:30" }
        ], 
        teacherName: "Ms. Emily Watson", 
        status: "active", 
        progress: "6 / 12 buổi",
        level: "IELTS",
        subLevel: "Writing",
        programName: "Luyện chuyên đề IELTS Online",
        pathCode: "PATH-IELTS-WR-TUTOR",
        startDate: "2025-02-10",
        endDate: "2025-05-10"
      },
      {
        classCode: "CLS-MATH-01",
        className: "Toán tư duy nâng cao",
        type: "offline",
        scheduleSlots: [
          { dayOfWeek: "Thứ Bảy", date: "07/06", startTime: "14:00", endTime: "16:00" }
        ],
        teacherName: "Thay Hung",
        status: "active",
        progress: "4 / 24 buổi",
        branch: "RinoEdu Nguyễn Tuân",
        room: "P301",
        level: "Math",
        subLevel: "Algebra v1",
        programName: "Toán tư duy",
        startDate: "2025-04-15",
        endDate: "2025-07-15"
      },
      {
        classCode: "CLS-STEM-01",
        className: "STEM Robotics Junior",
        type: "offline",
        scheduleSlots: [
          { dayOfWeek: "Chủ nhật", date: "08/06", startTime: "09:00", endTime: "11:00" }
        ],
        teacherName: "Mr. David",
        status: "active",
        progress: "2 / 12 buổi",
        branch: "RinoEdu Nguyễn Tuân",
        room: "P108",
        level: "STEM",
        subLevel: "Robotics v1",
        programName: "STEM Robotics",
        startDate: "2025-05-01",
        endDate: "2025-08-01"
      }
    ]
  },
  { 
    id: "s2", 
    name: makeName(1), 
    email: `binh@email.com`, 
    phone: "0933333333", 
    gender: "Female", 
    dob: "2007-07-20", 
    status: "pending_payment", 
    enrolledClass: "TOEIC B2", 
    branch: "RinoEdu Smart City", 
    level: "TOEIC", 
    subLevel: "B2",
    learningPath: "Lộ trình TOEIC bứt phá mục tiêu 850+",
    curriculum: "Giáo trình ETS Toeic Test cập nhật mới nhất",
    parentName: "Trần Thị B", 
    parentPhone: "0944444444", 
    enrollmentDate: "2025-02-15",
    packageName: "Gói TOEIC 4 kỹ năng",
    remainingSessions: 24,
    totalSessions: 24,
    enrolledClasses: []
  },
  { 
    id: "s3", 
    name: makeName(2), 
    email: `chi@email.com`, 
    phone: "0955555555", 
    gender: "Female", 
    dob: "2008-11-05", 
    status: "draft_class", 
    enrolledClass: "Tiếng Anh A1", 
    branch: "RinoEdu Nguyễn Tuân", 
    level: "Beginner", 
    subLevel: "A1",
    learningPath: "Lộ trình Tiếng Anh giao tiếp cơ bản",
    curriculum: "Khung chuẩn giao tiếp quốc tế CEFR",
    parentName: "Lê Văn C", 
    parentPhone: "0966666666", 
    enrollmentDate: "2025-03-01", 
    packageName: "Gói Giao tiếp cơ bản",
    remainingSessions: 22,
    totalSessions: 34,
    notes: "Chưa thanh toán đủ học phí",
    enrolledClasses: [
      { 
        classCode: "CLS-ENG-01", 
        className: "Tiếng Anh A1", 
        type: "offline", 
        scheduleSlots: [
          { dayOfWeek: "Thứ 2", date: "02/06", startTime: "18:30", endTime: "20:30" },
          { dayOfWeek: "Thứ 6", date: "06/06", startTime: "18:30", endTime: "20:30" }
        ], 
        teacherName: "Hoàng Thị Giáo Viên", 
        status: "active", 
        progress: "8 / 24 buổi",
        branch: "RinoEdu Nguyễn Tuân",
        room: "P302",
        level: "Beginner",
        subLevel: "A1",
        programName: "Tiếng Anh nền tảng cơ bản",
        pathCode: "PATH-ENG-A1",
        startDate: "2025-03-05",
        endDate: "2025-06-05"
      },
      { 
        classCode: "TUTOR-ENG-PH", 
        className: "Tutor Phát âm Tiếng Anh", 
        type: "online_tutor", 
        scheduleSlots: [
          { dayOfWeek: "Chủ nhật", date: "08/06", startTime: "10:00", endTime: "11:30" }
        ], 
        teacherName: "Mr. John Doe", 
        status: "active", 
        progress: "4 / 10 buổi",
        level: "Beginner",
        subLevel: "Phát âm",
        programName: "Luyện phát âm chuẩn Mỹ 1-1",
        pathCode: "PATH-TUTOR-ENG-PRON",
        startDate: "2025-03-10",
        endDate: "2025-05-10"
      }
    ]
  },
  { 
    id: "s4", 
    name: makeName(3), 
    email: `dung@email.com`, 
    phone: "0977777777", 
    gender: "Male", 
    dob: "2006-04-10", 
    status: "wait_for_assignment", 
    enrolledClass: "IELTS B1", 
    branch: "RinoEdu Linh Đàm", 
    level: "IELTS", 
    subLevel: "B1",
    learningPath: "Lộ trình IELTS bứt phá 6.0+",
    curriculum: "Giáo trình Cambridge IELTS Framework v4.0",
    parentName: "Phạm Thị D", 
    parentPhone: "0988888888", 
    enrollmentDate: "2025-04-20",
    packageName: "Gói IELTS VIP 1-1",
    remainingSessions: 24,
    totalSessions: 24,
    enrolledClasses: []
  },
  { 
    id: "s5", 
    name: makeName(4), 
    email: `em@email.com`, 
    phone: "0999999999", 
    gender: "Other", 
    dob: "2009-08-25", 
    status: "enroll_later", 
    enrolledClass: "Tiếng Nhật N5", 
    branch: "RinoEdu Smart City", 
    level: "Japanese", 
    subLevel: "N5",
    learningPath: "Lộ trình chinh phục JLPT N5 từ con số 0",
    curriculum: "Giáo trình Minna no Nihongo I",
    parentName: "Hoàng Văn E", 
    parentPhone: "0910101010", 
    enrollmentDate: "2025-05-15",
    packageName: "Gói Tiếng Nhật N5 cơ bản",
    remainingSessions: 24,
    totalSessions: 24,
    enrolledClasses: []
  },
  { 
    id: "s6", 
    name: makeName(5), 
    email: `giang@email.com`, 
    phone: "0912121212", 
    gender: "Female", 
    dob: "2004-12-01", 
    status: "pending_transfer", 
    enrolledClass: "IELTS C1", 
    branch: "RinoEdu Nguyễn Tuân", 
    level: "IELTS", 
    subLevel: "C1",
    learningPath: "Lộ trình IELTS Advanced Target 8.0+",
    curriculum: "Khung giáo trình học thuật cao cấp Cambridge Academic v2026",
    parentName: "Nguyễn Thị G", 
    parentPhone: "0913131313", 
    enrollmentDate: "2024-09-01",
    packageName: "Gói IELTS Mastery",
    remainingSessions: 6,
    totalSessions: 24,
    enrolledClasses: [
      { 
        classCode: "CLS-IELTS-09", 
        className: "IELTS C1", 
        type: "offline", 
        scheduleSlots: [
          { dayOfWeek: "Thứ 3", date: "03/06", startTime: "19:00", endTime: "21:00" },
          { dayOfWeek: "Thứ 5", date: "05/06", startTime: "19:00", endTime: "21:00" }
        ], 
        teacherName: "Ms. Emily Watson", 
        status: "pending_transfer", 
        progress: "18 / 24 buổi",
        branch: "RinoEdu Nguyễn Tuân",
        room: "P204",
        level: "IELTS",
        subLevel: "C1",
        programName: "IELTS Advanced Intensive",
        pathCode: "PATH-IELTS-C1",
        startDate: "2024-09-10",
        endDate: "2024-12-10"
      }
    ]
  },
  { 
    id: "s7", 
    name: makeName(6), 
    email: `hieu@email.com`, 
    phone: "0914141414", 
    gender: "Male", 
    dob: "2003-06-30", 
    status: "fee_transfer", 
    enrolledClass: "TOEIC A2", 
    branch: "RinoEdu Linh Đàm", 
    level: "TOEIC", 
    subLevel: "A2",
    learningPath: "Lộ trình TOEIC nền tảng đến 500+",
    curriculum: "Giáo trình TOEIC Starter ETS 2025",
    parentName: "Trần Văn H", 
    parentPhone: "0915151515", 
    enrollmentDate: "2024-11-15", 
    packageName: "Gói TOEIC mục tiêu 500",
    remainingSessions: 0,
    totalSessions: 24,
    notes: "Chuyển sang CN HCM",
    enrolledClasses: [
      { 
        classCode: "CLS-TOEIC-03", 
        className: "TOEIC A2", 
        type: "offline", 
        scheduleSlots: [
          { dayOfWeek: "Thứ 2", date: "02/06", startTime: "19:00", endTime: "21:00" },
          { dayOfWeek: "Thứ 4", date: "04/06", startTime: "19:00", endTime: "21:00" }
        ], 
        teacherName: "Phạm Văn Giảng Dạy", 
        status: "session_ended", 
        progress: "24 / 24 buổi",
        branch: "RinoEdu Linh Đàm",
        room: "P102",
        level: "TOEIC",
        subLevel: "A2",
        programName: "TOEIC Foundation",
        pathCode: "PATH-TOEIC-A2",
        startDate: "2024-11-20",
        endDate: "2025-02-20"
      }
    ]
  },
  { 
    id: "s8", 
    name: makeName(7), 
    email: `khanh@email.com`, 
    phone: "0916161616", 
    gender: "Male", 
    dob: "2008-01-11", 
    status: "awaiting_opening", 
    enrolledClass: "STEM Junior 01", 
    branch: "RinoEdu Smart City", 
    level: "STEM", 
    subLevel: "Robotics v1",
    learningPath: "Lộ trình Robotics & Tư duy lập trình",
    curriculum: "Khung chuẩn STEM Robotics cơ bản",
    parentName: "Lê Thị K", 
    parentPhone: "0917171717", 
    enrollmentDate: "2025-02-28",
    packageName: "Gói STEM Robotics cơ bản",
    remainingSessions: 24,
    totalSessions: 24,
    enrolledClasses: [
      { 
        classCode: "CLS-STEM-08", 
        className: "STEM Junior 01", 
        type: "offline", 
        scheduleSlots: [
          { dayOfWeek: "Thứ 3", date: "03/06", startTime: "18:30", endTime: "20:30" },
          { dayOfWeek: "Thứ 7", date: "07/06", startTime: "18:30", endTime: "20:30" }
        ], 
        teacherName: "Hoàng Thị Giáo Viên", 
        status: "active", 
        progress: "4 / 24 buổi",
        branch: "RinoEdu Smart City",
        room: "P108",
        level: "STEM",
        subLevel: "Robotics v1",
        programName: "STEM Robotics",
        pathCode: "PATH-STEM-ROB",
        startDate: "2025-03-15",
        endDate: "2025-06-15"
      }
    ]
  },
  { 
    id: "s9", 
    name: makeName(8), 
    email: `mai@email.com`, 
    phone: "0918181818", 
    gender: "Female", 
    dob: "2010-05-18", 
    status: "trial", 
    enrolledClass: "Toán tư duy M1", 
    branch: "RinoEdu Nguyễn Tuân", 
    level: "Math", 
    subLevel: "Algebra v1",
    learningPath: "Lộ trình Toán tư duy toàn diện cấp tiểu học",
    curriculum: "Giáo trình toán tư duy Singapore v2025",
    parentName: "Vũ Văn M", 
    parentPhone: "0919191919", 
    enrollmentDate: "2025-04-10",
    packageName: "Gói Toán tư duy tiểu học",
    remainingSessions: 2,
    totalSessions: 3,
    enrolledClasses: [
      { 
        classCode: "CLS-MATH-09", 
        className: "Toán tư duy M1", 
        type: "offline", 
        scheduleSlots: [
          { dayOfWeek: "Thứ 7", date: "07/06", startTime: "14:00", endTime: "16:00" }
        ], 
        teacherName: "Ms. Emily Watson", 
        status: "active", 
        progress: "1 / 3 buổi",
        branch: "RinoEdu Nguyễn Tuân",
        room: "P301",
        level: "Math",
        subLevel: "Algebra v1",
        programName: "Toán tư duy",
        pathCode: "PATH-MATH-ALG",
        startDate: "2025-04-15",
        endDate: "2025-04-18"
      }
    ]
  },
  { 
    id: "s10", 
    name: makeName(9), 
    email: `nam@email.com`, 
    phone: "0920202020", 
    gender: "Male", 
    dob: "2002-09-22", 
    status: "reserve", 
    enrolledClass: "IELTS A2", 
    branch: "RinoEdu Linh Đàm", 
    level: "IELTS", 
    subLevel: "A2",
    learningPath: "Lộ trình IELTS tinh gọn từ mất gốc đến 7.5",
    curriculum: "Khung giáo trình chuẩn Cambridge Academic v2026",
    parentName: "Nguyễn Văn D", 
    parentPhone: "0921212121", 
    enrollmentDate: "2025-05-01",
    packageName: "Gói IELTS Pro v2026",
    remainingSessions: 19,
    totalSessions: 24,
    enrolledClasses: [
      { 
        classCode: "CLS-IELTS-03", 
        className: "IELTS A2", 
        type: "offline", 
        scheduleSlots: [
          { dayOfWeek: "Thứ 3", date: "03/06", startTime: "18:00", endTime: "20:00" },
          { dayOfWeek: "Thứ 5", date: "05/06", startTime: "18:00", endTime: "20:00" }
        ], 
        teacherName: "Mr. John Doe", 
        status: "inactive", 
        progress: "5 / 24 buổi",
        branch: "RinoEdu Linh Đàm",
        room: "P103",
        level: "IELTS",
        subLevel: "A2",
        programName: "Chương trình IELTS chuẩn quốc tế",
        pathCode: "PATH-IELTS-A2",
        startDate: "2025-05-05",
        endDate: "2025-08-05"
      }
    ]
  },
  { 
    id: "s11", 
    name: makeName(10), 
    email: `long@email.com`, 
    phone: "0922222222", 
    gender: "Male", 
    dob: "2006-07-15", 
    status: "session_ended", 
    enrolledClass: "TOEIC B1", 
    branch: "RinoEdu Nguyễn Tuân", 
    level: "TOEIC", 
    subLevel: "B1",
    learningPath: "Lộ trình TOEIC chinh phục 650+ tự tin",
    curriculum: "ETS TOEIC L&R Test Series 2025",
    parentName: "Phạm Văn L", 
    parentPhone: "0923232323", 
    enrollmentDate: "2025-01-05",
    packageName: "Gói Combo TOEIC trọn gói",
    remainingSessions: 0,
    totalSessions: 34,
    enrolledClasses: [
      { 
        classCode: "CLS-TOEIC-11", 
        className: "TOEIC B1", 
        type: "offline", 
        scheduleSlots: [
          { dayOfWeek: "Thứ 2", date: "02/06", startTime: "19:30", endTime: "21:30" },
          { dayOfWeek: "Thứ 5", date: "05/06", startTime: "19:30", endTime: "21:30" }
        ], 
        teacherName: "Phạm Văn Giảng Dạy", 
        status: "session_ended", 
        progress: "24 / 24 buổi",
        branch: "RinoEdu Nguyễn Tuân",
        room: "P205",
        level: "TOEIC",
        subLevel: "B1",
        programName: "Luyện thi TOEIC Cấp tốc",
        pathCode: "PATH-TOEIC-B1",
        startDate: "2025-01-10",
        endDate: "2025-04-10"
      },
      { 
        classCode: "TUTOR-TOEIC-LC", 
        className: "Tutor TOEIC Listening & Reading", 
        type: "online_tutor", 
        scheduleSlots: [
          { dayOfWeek: "Thứ Bảy", date: "07/06", startTime: "09:00", endTime: "10:30" }
        ], 
        teacherName: "Mr. John Doe", 
        status: "session_ended", 
        progress: "10 / 10 buổi",
        level: "TOEIC",
        subLevel: "L&R",
        programName: "Tutor TOEIC 1-1 Online",
        pathCode: "PATH-TOEIC-LC-TUTOR",
        startDate: "2025-01-15",
        endDate: "2025-03-15"
      }
    ]
  },
  { 
    id: "s12", 
    name: makeName(11), 
    email: `hang@email.com`, 
    phone: "0924242424", 
    gender: "Female", 
    dob: "2008-02-28", 
    status: "session_ended", 
    enrolledClass: "IELTS B2", 
    branch: "RinoEdu Smart City", 
    level: "IELTS", 
    subLevel: "B2",
    learningPath: "Lộ trình IELTS bứt phá 6.0+",
    curriculum: "Giáo trình Cambridge IELTS Framework v4.0",
    parentName: "Trần Thị H", 
    parentPhone: "0925252525", 
    enrollmentDate: "2025-02-10",
    packageName: "Gói IELTS Prep B2",
    remainingSessions: 0,
    totalSessions: 24,
    enrolledClasses: [
      { 
        classCode: "CLS-IELTS-12", 
        className: "IELTS B2", 
        type: "offline", 
        scheduleSlots: [
          { dayOfWeek: "Thứ 3", date: "03/06", startTime: "18:00", endTime: "20:00" },
          { dayOfWeek: "Thứ 6", date: "06/06", startTime: "18:00", endTime: "20:00" }
        ], 
        teacherName: "Ms. Emily Watson", 
        status: "session_ended", 
        progress: "24 / 24 buổi",
        branch: "RinoEdu Smart City",
        room: "P109",
        level: "IELTS",
        subLevel: "B2",
        programName: "Chương trình IELTS chuẩn quốc tế",
        pathCode: "PATH-IELTS-B2",
        startDate: "2025-02-15",
        endDate: "2025-05-15"
      }
    ]
  },
]

// Enrich mockStudents with saleName and subject dynamically
const MOCK_SYSTEM_BRANCHES = ["RinoEdu Nguyễn Tuân", "RinoEdu Linh Đàm", "RinoEdu Smart City"];

mockStudents.forEach((student, index) => {
  student.saleName = index % 2 === 0 ? "Trần Thị Sale" : "Nguyễn Hoàng Sale";
  student.schoolClass = `Lớp ${index % 5 + 3}`; // Mock school grade (Lớp 3, Lớp 4, Lớp 5...)

  // Initialize multiple branches (schools)
  student.branches = [student.branch];
  if (index % 3 === 0) {
    const mainIdx = MOCK_SYSTEM_BRANCHES.indexOf(student.branch);
    if (mainIdx !== -1) {
      const secondBranch = MOCK_SYSTEM_BRANCHES[(mainIdx + 1) % MOCK_SYSTEM_BRANCHES.length];
      student.branches.push(secondBranch);
    }
  }

  if (student.level === 'Japanese') {
    student.subject = 'japanese';
  } else if (student.level === 'STEM') {
    student.subject = 'stem';
  } else if (student.level === 'Math') {
    student.subject = 'math';
  } else {
    student.subject = 'english';
  }

  // Populate curriculum and next lesson details for enrolled classes
  student.enrolledClasses?.forEach((cls, classIdx) => {
    if (!cls.curriculumName) {
      cls.curriculumName = student.curriculum || `${student.level} Standard Curriculum`;
    }
    if (!cls.curriculumCode) {
      cls.curriculumCode = `CUR-${cls.classCode}`;
    }
    if (!cls.nextLessonName) {
      cls.nextLessonName = `Lesson ${classIdx + 13}: Review and Speaking/Writing Exercises`;
    }
    if (!cls.nextLessonDate) {
      cls.nextLessonDate = `Thứ Tư, 04/06 (18:00 - 20:00)`;
    }
  });
});

export function getStudents(filters?: { search?: string; branch?: string; status?: string; level?: string }): Student[] {
  return mockStudents.filter((s) => {
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      const matches =
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.phone?.toLowerCase().includes(q) ?? false)
      if (!matches) return false
    }
    if (filters?.branch && s.branch !== filters.branch) return false
    if (filters?.status && s.status !== filters.status) return false
    if (filters?.level && s.level !== filters.level) return false
    return true
  })
}
