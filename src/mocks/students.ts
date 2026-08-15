import { mockClassRecords, type ScheduleSlot } from './classRecords'

export interface EnrolledClass {
  classCode: string
  className: string
  type: 'offline' | 'online_tutor' | 'tutor' | 'station' | 'online'
  scheduleSlots: ScheduleSlot[]
  teacherName: string
  status: 'active' | 'inactive' | 'pending_transfer' | 'session_ended' | 'wait_for_assignment' | 'absent' | 'excused' | 'paused' | 'dropped'
  progress: string
  branch?: string       // Trường học của lớp
  room?: string         // Phòng học
  level?: string        // Trình độ lớp
  subLevel?: string     // Sub level lớp
  programName?: string  // Chương trình học
  pathCode?: string     // Mã lộ trình
  startDate?: string    // Từ ngày
  endDate?: string      // Đến ngày
  curriculumName?: string  // Tên chương trình
  curriculumCode?: string  // Mã chương trình
  nextLessonName?: string  // Tên bài học tiếp theo
  nextLessonDate?: string  // Lịch học buổi tiếp theo
  packageId?: string       // Mã gói đăng ký liên kết
}

export interface Student {
  id: string
  name: string
  englishName?: string
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
  curriculum?: string      // Chương trình đang học của học viên
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

export const mockStudents: Student[] = [
  {
    id: "s-baohan",
    name: "Lê Nguyễn Bảo Hân",
    englishName: "Hannah",
    email: "baohan.le@email.com",
    phone: "0987654321",
    gender: "Female",
    dob: "2012-08-14",
    status: "active",
    enrolledClass: "Toán Tư Duy 1:6",
    branch: "RinoEdu Nguyễn Tuân",
    level: "Toán 1:6",
    subLevel: "A",
    learningPath: "Toán tư duy tiểu học nâng cao",
    curriculum: "Toán logic & phản xạ tư duy",
    parentName: "Nguyễn Thu Trang",
    parentPhone: "0912345678",
    enrollmentDate: "2024-08-14",
    packageName: "[Gia sư][TH] Toán Tư Duy 1:6 (96 buổi + 8 buổi ôn tập)",
    remainingSessions: 12,
    totalSessions: 96,
    enrolledClasses: [
      {
        classCode: "LD_TOAN_00032",
        className: "Toán Tư Duy 1:6 (96 buổi)",
        type: "tutor",
        scheduleSlots: [
          { dayOfWeek: "Thứ 3", date: "18/08", startTime: "17:30", endTime: "19:30" },
          { dayOfWeek: "Thứ 6", date: "21/08", startTime: "17:30", endTime: "19:30" }
        ],
        teacherName: "GV_HuiLT20",
        status: "active",
        progress: "84 / 96 buổi",
        branch: "RinoEdu Nguyễn Tuân",
        room: "B202",
        level: "Toán 1:6",
        subLevel: "A",
        programName: "Chương trình Toán tư duy 1:6 chuẩn quốc tế",
        pathCode: "PATH-MATH-16",
        startDate: "2024-08-14",
        endDate: "2027-08-14"
      }
    ]
  },
  {
    id: "s1",
    name: "Nguyễn An",
    englishName: "Alex",
    email: "an@email.com",
    phone: "0911111111",
    gender: "Male",
    dob: "2005-03-15",
    status: "active",
    enrolledClass: "IELTS A1",
    branch: "RinoEdu Nguyễn Tuân",
    level: "IELTS",
    subLevel: "A1",
    learningPath: "Lộ trình IELTS tinh gọn từ mất gốc đến 7.5",
    curriculum: "Khung chương trình chuẩn Cambridge Academic v2026",
    parentName: "Nguyễn Văn A",
    parentPhone: "0922222222",
    enrollmentDate: "2025-01-10",
    packageName: "Gói IELTS cam kết 7.0",
    remainingSessions: 18,
    totalSessions: 36,
    enrolledClasses: [
      {
        classCode: "CLS-IELTS-001",
        className: "IELTS Junior 1A",
        type: "offline",
        scheduleSlots: [
          { dayOfWeek: "Thứ 2", date: "02/06", startTime: "18:00", endTime: "19:30" },
          { dayOfWeek: "Thứ 4", date: "04/06", startTime: "18:00", endTime: "19:30" },
          { dayOfWeek: "Thứ 6", date: "06/06", startTime: "18:00", endTime: "19:30" }
        ],
        teacherName: "Cô Lan",
        status: "active",
        progress: "12 / 24 buổi",
        branch: "RinoEdu Linh Đàm",
        room: "A101",
        level: "IELTS",
        subLevel: "5.0–5.5",
        programName: "Chương trình IELTS chuẩn quốc tế",
        pathCode: "PATH-IELTS-A1",
        startDate: "2026-05-01",
        endDate: "2026-08-01"
      },
      {
        classCode: "CLS-TOEIC-001",
        className: "TOEIC Foundation 2A",
        type: "online_tutor",
        scheduleSlots: [
          { dayOfWeek: "Thứ 4", date: "04/06", startTime: "19:00", endTime: "21:00" },
          { dayOfWeek: "Thứ 7", date: "07/06", startTime: "19:00", endTime: "21:00" }
        ],
        teacherName: "Cô Hương",
        status: "active",
        progress: "4 / 12 buổi",
        branch: "RinoEdu Nguyễn Tuân",
        room: "C301",
        level: "TOEIC",
        subLevel: "450–550",
        programName: "Khóa bổ trợ phát âm chuyên sâu",
        pathCode: "PATH-PRONUN",
        startDate: "2026-05-06",
        endDate: "2026-08-06"
      }
    ]
  },
  {
    id: "s2",
    name: "Trần Bình",
    englishName: "Bella",
    email: "binh@email.com",
    phone: "0933333333",
    gender: "Female",
    dob: "2007-07-20",
    status: "pending_payment",
    enrolledClass: "TOEIC B2",
    branch: "RinoEdu Smart City",
    level: "TOEIC",
    subLevel: "B2",
    learningPath: "Lộ trình TOEIC bứt phá mục tiêu 850+",
    curriculum: "Khung chương trình ETS Toeic Test cập nhật mới nhất",
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
    name: "Lê Chi",
    englishName: "Chloe",
    email: "chi@email.com",
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
        classCode: "CLS-BEG-001",
        className: "Tiếng Anh A1",
        type: "offline",
        scheduleSlots: [
          { dayOfWeek: "Thứ 4", date: "01/07", startTime: "18:00", endTime: "19:30" },
          { dayOfWeek: "Thứ 7", date: "04/07", startTime: "18:00", endTime: "19:30" }
        ],
        teacherName: "Cô Mai",
        status: "active",
        progress: "8 / 24 buổi",
        branch: "RinoEdu Nguyễn Tuân",
        room: "A102",
        level: "Beginner",
        subLevel: "A1",
        programName: "Tiếng Anh nền tảng cơ bản",
        pathCode: "PATH-ENG-A1",
        startDate: "2026-07-01",
        endDate: "2026-10-01"
      },
      {
        classCode: "CLS-TOEIC-002",
        className: "TOEIC B2",
        type: "online_tutor",
        scheduleSlots: [
          { dayOfWeek: "Thứ 3", date: "16/06", startTime: "19:00", endTime: "21:00" },
          { dayOfWeek: "Thứ 5", date: "18/06", startTime: "19:00", endTime: "21:00" }
        ],
        teacherName: "Cô Lan",
        status: "active",
        progress: "2 / 10 buổi",
        branch: "RinoEdu Smart City",
        room: "D402",
        level: "TOEIC",
        subLevel: "550–650",
        programName: "Tiếng Anh giao tiếp phản xạ",
        pathCode: "PATH-ENG-COMM",
        startDate: "2026-06-15",
        endDate: "2026-09-15"
      },
      {
        classCode: "CLS-FLY-001",
        className: "Flyers 3A",
        type: "offline",
        scheduleSlots: [
          { dayOfWeek: "Thứ 2", date: "08/06", startTime: "16:00", endTime: "17:30" },
          { dayOfWeek: "Thứ 4", date: "10/06", startTime: "16:00", endTime: "17:30" }
        ],
        teacherName: "Cô Nga",
        status: "pending_transfer",
        progress: "0 / 16 buổi",
        branch: "RinoEdu Linh Đàm",
        room: "A103",
        level: "Flyers",
        subLevel: "A2–B1",
        programName: "Tư duy lập trình & Robotics trẻ em",
        pathCode: "PATH-STEM-ROBO",
        startDate: "2026-06-10",
        endDate: "2026-09-10"
      }
    ]
  },
  {
    id: "s4",
    name: "Phạm Dũng",
    email: "dung@email.com",
    phone: "0977777777",
    gender: "Male",
    dob: "2006-04-10",
    status: "wait_for_assignment",
    enrolledClass: "IELTS B1",
    branch: "RinoEdu Linh Đàm",
    level: "IELTS",
    subLevel: "B1",
    learningPath: "Lộ trình IELTS bứt phá 6.0+",
    curriculum: "Khung chương trình Cambridge IELTS Framework v4.0",
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
    name: "Trần Tuấn Khang",
    email: "khang@email.com",
    phone: "0999999999",
    gender: "Male",
    dob: "2009-08-25",
    status: "enroll_later",
    enrolledClass: "Tiếng Nhật N5",
    branch: "RinoEdu Smart City",
    level: "Japanese",
    subLevel: "N5",
    learningPath: "Lộ trình chinh phục JLPT N5 từ con số 0",
    curriculum: "Khung chương trình Minna no Nihongo I",
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
    name: "Đặng Hồng Phúc",
    email: "phuc@email.com",
    phone: "0912121212",
    gender: "Male",
    dob: "2004-12-01",
    status: "pending_transfer",
    enrolledClass: "IELTS C1",
    branch: "RinoEdu Nguyễn Tuân",
    level: "IELTS",
    subLevel: "C1",
    learningPath: "Lộ trình IELTS Advanced Target 8.0+",
    curriculum: "Khung chương trình học thuật cao cấp Cambridge Academic v2026",
    parentName: "Nguyễn Thị G",
    parentPhone: "0913131313",
    enrollmentDate: "2024-09-01",
    packageName: "Gói IELTS Mastery",
    remainingSessions: 6,
    totalSessions: 24,
    enrolledClasses: []
  },
  {
    id: "s7",
    name: "Nguyễn Hoàng Dũng",
    email: "dung.nguyen@email.com",
    phone: "0914141414",
    gender: "Male",
    dob: "2003-06-30",
    status: "fee_transfer",
    enrolledClass: "TOEIC A2",
    branch: "RinoEdu Linh Đàm",
    level: "TOEIC",
    subLevel: "A2",
    learningPath: "Lộ trình TOEIC nền tảng đến 500+",
    curriculum: "Khung chương trình TOEIC Starter ETS 2025",
    parentName: "Trần Văn H",
    parentPhone: "0915151515",
    enrollmentDate: "2024-11-15",
    packageName: "Gói TOEIC mục tiêu 500",
    remainingSessions: 0,
    totalSessions: 24,
    enrolledClasses: []
  },
  {
    id: "s8",
    name: "Trương Bảo An",
    email: "an.truong@email.com",
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
    enrolledClasses: []
  },
  {
    id: "s9",
    name: "Nguyễn Lan Hương",
    email: "huong@email.com",
    phone: "0918181818",
    gender: "Female",
    dob: "2010-05-18",
    status: "trial",
    enrolledClass: "Toán tư duy M1",
    branch: "RinoEdu Nguyễn Tuân",
    level: "Math",
    subLevel: "Algebra v1",
    learningPath: "Lộ trình Toán tư duy toàn diện cấp tiểu học",
    curriculum: "Khung chương trình toán tư duy Singapore v2025",
    parentName: "Vũ Văn M",
    parentPhone: "0919191919",
    enrollmentDate: "2025-04-10",
    packageName: "Gói Toán tư duy tiểu học",
    remainingSessions: 2,
    totalSessions: 3,
    enrolledClasses: []
  },
  {
    id: "s10",
    name: "Đặng Thiên An",
    email: "an.dang@email.com",
    phone: "0920202020",
    gender: "Male",
    dob: "2002-09-22",
    status: "reserve",
    enrolledClass: "IELTS A2",
    branch: "RinoEdu Linh Đàm",
    level: "IELTS",
    subLevel: "A2",
    learningPath: "Lộ trình IELTS tinh gọn từ mất gốc đến 7.5",
    curriculum: "Khung chương trình chuẩn Cambridge Academic v2026",
    parentName: "Nguyễn Văn D",
    parentPhone: "0921212121",
    enrollmentDate: "2025-05-01",
    packageName: "Gói IELTS Pro v2026",
    remainingSessions: 19,
    totalSessions: 24,
    enrolledClasses: []
  },
  {
    id: "s11",
    name: "Đào Viết An",
    email: "an.dao@email.com",
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
    enrolledClasses: []
  },
  {
    id: "s12",
    name: "Nguyễn Hoàng Vũ",
    email: "vu.nguyen@email.com",
    phone: "0924242424",
    gender: "Female",
    dob: "2008-02-28",
    status: "session_ended",
    enrolledClass: "IELTS B2",
    branch: "RinoEdu Smart City",
    level: "IELTS",
    subLevel: "B2",
    learningPath: "Lộ trình IELTS bứt phá 6.0+",
    curriculum: "Khung chương trình Cambridge IELTS Framework v4.0",
    parentName: "Trần Thị H",
    parentPhone: "0925252525",
    enrollmentDate: "2025-02-10",
    packageName: "Gói IELTS Prep B2",
    remainingSessions: 0,
    totalSessions: 24,
    enrolledClasses: []
  },
  {
    id: "s13",
    name: "Trần Minh Châu",
    email: "chau.tran@email.com",
    phone: "0931403302",
    gender: "Female",
    dob: "2015-08-17",
    status: "active",
    branch: "RinoEdu Linh Đàm",
    level: "Math",
    subLevel: "Einstein 0",
    learningPath: "Lộ trình Toán tư duy toàn diện cấp tiểu học",
    curriculum: "Khung chuẩn Toán học Singapore",
    parentName: "Trần Văn Sơn",
    parentPhone: "0901403302",
    enrollmentDate: "2023-08-17",
    packageName: "Gói Toán tư duy nâng cao",
    remainingSessions: 68,
    totalSessions: 102,
    enrolledClasses: []
  },
  {
    id: "s14",
    name: "Nguyễn Phương Vy",
    email: "vy.nguyen@email.com",
    phone: "0931403052",
    gender: "Female",
    dob: "2016-04-12",
    status: "active",
    branch: "RinoEdu Nguyễn Tuân",
    level: "English",
    subLevel: "Level 4",
    learningPath: "Lộ trình Tiếng Anh giao tiếp Cambridge",
    curriculum: "Khung chương trình Cambridge English Scale",
    parentName: "Nguyễn Văn A",
    parentPhone: "0901403052",
    enrollmentDate: "2023-07-31",
    packageName: "Gói tiếng Anh Cambridge",
    remainingSessions: 60,
    totalSessions: 110,
    enrolledClasses: []
  },
  {
    id: "s15",
    name: "Nguyễn Hà Phương",
    email: "phuong.nguyen@email.com",
    phone: "0931138382",
    gender: "Female",
    dob: "2015-11-20",
    status: "active",
    branch: "RinoEdu Linh Đàm",
    level: "English",
    subLevel: "Level 5",
    learningPath: "Lộ trình Tiếng Anh giao tiếp Cambridge",
    curriculum: "Khung chương trình Cambridge English Scale",
    parentName: "Nguyễn Văn B",
    parentPhone: "0901138382",
    enrollmentDate: "2023-08-17",
    packageName: "Gói tiếng Anh Cambridge",
    remainingSessions: 1,
    totalSessions: 96,
    enrolledClasses: []
  },
  {
    id: "s16",
    name: "Kim Nhật Anh",
    email: "anh.kim@email.com",
    phone: "0931492352",
    gender: "Male",
    dob: "2016-05-18",
    status: "active",
    branch: "RinoEdu Nguyễn Tuân",
    level: "English",
    subLevel: "Level 4",
    learningPath: "Lộ trình Tiếng Anh giao tiếp Cambridge",
    curriculum: "Khung chương trình Cambridge English Scale",
    parentName: "Kim Văn C",
    parentPhone: "0901492352",
    enrollmentDate: "2023-08-19",
    packageName: "Gói tiếng Anh Cambridge",
    remainingSessions: 42,
    totalSessions: 108,
    enrolledClasses: []
  },
  {
    id: "s17",
    name: "Nguyễn Mỹ Linh",
    email: "linh.nguyen@email.com",
    phone: "0931492312",
    gender: "Female",
    dob: "2015-12-05",
    status: "active",
    branch: "RinoEdu Nguyễn Tuân",
    level: "Math",
    subLevel: "Archimedes 5",
    learningPath: "Lộ trình Toán tư duy Archimedes",
    curriculum: "Khung chuẩn Toán học Singapore",
    parentName: "Nguyễn Văn D",
    parentPhone: "0901492312",
    enrollmentDate: "2023-10-11",
    packageName: "Gói Toán tư duy Archimedes",
    remainingSessions: 54,
    totalSessions: 98,
    enrolledClasses: []
  },
  {
    id: "s18",
    name: "Phạm Đình Nguyên",
    email: "nguyen.pham@email.com",
    phone: "0931521492",
    gender: "Male",
    dob: "2016-01-20",
    status: "active",
    branch: "RinoEdu Linh Đàm",
    level: "English",
    subLevel: "Level 4",
    learningPath: "Lộ trình Tiếng Anh giao tiếp Cambridge",
    curriculum: "Khung chương trình Cambridge English Scale",
    parentName: "Phạm Văn E",
    parentPhone: "0901521492",
    enrollmentDate: "2023-11-02",
    packageName: "Gói tiếng Anh Cambridge",
    remainingSessions: 15,
    totalSessions: 59,
    enrolledClasses: []
  },
  {
    id: "s19",
    name: "Minh Vy",
    email: "vy.minh@email.com",
    phone: "0931522922",
    gender: "Female",
    dob: "2016-09-15",
    status: "active",
    branch: "RinoEdu Nguyễn Tuân",
    level: "English",
    subLevel: "Level 4",
    learningPath: "Lộ trình Tiếng Anh giao tiếp Cambridge",
    curriculum: "Khung chương trình Cambridge English Scale",
    parentName: "Nguyễn Văn F",
    parentPhone: "0901522922",
    enrollmentDate: "2023-11-05",
    packageName: "Gói tiếng Anh Cambridge",
    remainingSessions: 41,
    totalSessions: 106,
    enrolledClasses: []
  },
  {
    id: "s20",
    name: "Nguyễn Hoàng Nam",
    email: "nam.nguyen@email.com",
    phone: "0931609992",
    gender: "Male",
    dob: "2015-03-25",
    status: "active",
    branch: "RinoEdu Smart City",
    level: "Math",
    subLevel: "Archimedes 5",
    learningPath: "Lộ trình Toán tư duy Archimedes",
    curriculum: "Khung chuẩn Toán học Singapore",
    parentName: "Nguyễn Văn G",
    parentPhone: "0901609992",
    enrollmentDate: "2023-12-20",
    packageName: "Gói Toán tư duy Archimedes",
    remainingSessions: 45,
    totalSessions: 80,
    enrolledClasses: []
  }
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

  // Populate enrolled classes dynamically if empty
  if (student.enrolledClass && (!student.enrolledClasses || student.enrolledClasses.length === 0)) {
    const levelLower = (student.level || '').toLowerCase()
    const matchedClass = mockClassRecords.find((c) => {
      const clsLevel = (c.level || '').toLowerCase()
      return clsLevel.includes(levelLower) || levelLower.includes(clsLevel)
    }) || mockClassRecords[index % mockClassRecords.length]

    let type: 'offline' | 'online_tutor' | 'tutor' | 'station' | 'online' = 'offline'
    if (index % 5 === 0) type = 'offline'
    else if (index % 5 === 1) type = 'online_tutor'
    else if (index % 5 === 2) type = 'tutor'
    else if (index % 5 === 3) type = 'station'
    else type = 'online'

    let statusVal: 'active' | 'paused' | 'dropped' | 'session_ended' = 'active'
    if (index % 4 === 0) statusVal = 'active'
    else if (index % 4 === 1) statusVal = 'paused'
    else if (index % 4 === 2) statusVal = 'dropped'
    else statusVal = 'session_ended'

    student.enrolledClasses = [
      {
        classCode: matchedClass.code,
        className: matchedClass.name,
        type: type,
        scheduleSlots: matchedClass.scheduleSlots,
        teacherName: matchedClass.teacher,
        status: statusVal,
        progress: "12 / 24 buổi",
        branch: matchedClass.branch || student.branch,
      }
    ]
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
