export type BookingSubject = "english" | "math"

export type BookingStatus =
  | "booked_assessment"
  | "started_assessment"
  | "completed"
  | "failed"
  | "cancelled"

export interface BookingFamilyMember {
  name: string
  phone: string
  isPrimary?: boolean
}

export interface BookingNote {
  text: string
  author: string
  timestamp: string
}

export interface BookingTestResult {
  level?: string
  subLevel?: string
  speaking?: string
  speakingAi?: string
  speakingScore?: string
  lwr?: string
  lwrLevel?: string
  lwrScore?: string
  path?: string
}

export interface BookingTest {
  id: string
  childName: string
  familyName: string
  phone: string
  familyMembers: BookingFamilyMember[]
  status: BookingStatus
  isInterviewed?: boolean
  isTested?: boolean
  attendance?: "pending" | "confirmed" | "declined"
  subject: BookingSubject
  eventType: "test" | "demo"
  program: string
  school: string
  room: string
  classroom?: string
  testTime: string
  testResult?: BookingTestResult
  resultLink?: string
  testLink?: string
  createdBy?: string
  ops?: string
  teacher?: string
  tester?: string
  interviewer?: string
  msg?: string
  notes?: BookingNote[]
  avatar?: string
  dob?: string
}

export const PROGRAM_LEVELS = [
  "Pre-Kindie",
  "Kindie 1",
  "Kindie 2",
  "Kindie 3",
  "Pre-Level 0",
  "Level 1A",
  "Level 1B",
  "Level 2A",
  "Level 2B",
  "Level 3A",
  "Level 3B",
]

export const SUB_LEVELS = ["A1", "A", "B", "C"]

export const mockBookingTests: BookingTest[] = [
  {
    id: "E0001",
    childName: "Nguyễn An",
    dob: "2005-03-15",
    familyName: "Gia đình Nguyễn An",
    phone: "0911111111",
    familyMembers: [
      { name: "Nguyễn Văn A (Bố)", phone: "0922222222", isPrimary: true },
      { name: "Trần Thị Lan (Mẹ)", phone: "0922222223" },
    ],
    status: "completed",
    isInterviewed: true,
    isTested: true,
    attendance: "confirmed",
    subject: "english",
    eventType: "test",
    program: "Station Program",
    school: "RinoEdu Nguyễn Tuân",
    room: "Phòng A2",
    classroom: "Phòng A2",
    testTime: "2026-05-18 18:30",
    testResult: {
      level: "Level 2B",
      subLevel: "B",
      speaking: "6.5/8",
      speakingAi: "6/8",
      speakingScore: "1",
      lwr: "27/40",
      lwrLevel: "Starters",
      lwrScore: "1.5",
      path: "Kiểm tra đầu vào Tiếng Anh",
    },
    resultLink: "mock://booking-results/e0001",
    testLink: "mock://booking-tests/e0001",
    createdBy: "Hung Dao",
    ops: "Hung Dao",
    teacher: "Sarah J.",
    tester: "Sarah J.",
    interviewer: "Minh Hoang",
    msg: "Giao tiếp tốt",
    notes: [{ text: "Giao tiếp tốt", author: "Hung Dao", timestamp: "2026-05-18 20:00" }],
  },
  {
    id: "E0002",
    childName: "Truc My",
    dob: "2015-08-25",
    familyName: "Gia đình Trúc My",
    phone: "0388222122",
    familyMembers: [{ name: "Lê Hoa (Mẹ)", phone: "0388222122", isPrimary: true }],
    status: "booked_assessment",
    attendance: "pending",
    subject: "english",
    eventType: "test",
    program: "Station Program",
    school: "RinoEdu Linh Đàm",
    room: "Phòng B1",
    classroom: "Phòng B1",
    testTime: "2026-05-19 19:00",
    testResult: {
      level: "Level 1A",
      subLevel: "A",
      speaking: "5/8",
      speakingAi: "6/8",
      speakingScore: "0",
      lwr: "19/40",
      lwrLevel: "Pre-Starters",
      lwrScore: "0",
      path: "Kiểm tra đầu vào Tiếng Anh",
    },
    resultLink: "",
    testLink: "mock://booking-tests/e0002",
    createdBy: "Thanh Van",
    ops: "Thanh Van",
    teacher: "Robert L.",
    tester: "Robert L.",
    interviewer: "Thanh Ha",
    msg: "-",
    notes: [],
  },
  {
    id: "E0003",
    childName: "Quynh Chi",
    dob: "2017-01-05",
    familyName: "Gia đình Quỳnh Chi",
    phone: "0912333345",
    familyMembers: [
      { name: "Phạm Tuấn (Bố)", phone: "0912333345", isPrimary: true },
      { name: "Bà ngoại", phone: "0912333346" },
    ],
    status: "started_assessment",
    isInterviewed: true,
    isTested: false,
    attendance: "confirmed",
    subject: "math",
    eventType: "test",
    program: "Toán tư duy",
    school: "RinoEdu Nguyễn Tuân",
    room: "Phòng M3",
    classroom: "Phòng M3",
    testTime: "2026-05-19 19:30",
    testResult: {
      level: "Level 3A",
      subLevel: "C",
      speaking: "7/8",
      speakingAi: "7/8",
      speakingScore: "1",
      lwr: "33/40",
      lwrLevel: "Movers",
      lwrScore: "3.5",
    },
    resultLink: "mock://booking-results/e0003",
    testLink: "mock://booking-tests/e0003",
    createdBy: "Hung Dao",
    ops: "Hung Dao",
    teacher: "Emily W.",
    tester: "Thay Hung",
    interviewer: "Kieu Anh",
    msg: "Cần hỗ trợ học online",
    notes: [{ text: "Cần hỗ trợ học online", author: "Hung Dao", timestamp: "2026-05-19 20:30" }],
  },
  {
    id: "E0004",
    childName: "Tuong Vi",
    dob: "2018-11-30",
    familyName: "Gia đình Tường Vi",
    phone: "0944111119",
    familyMembers: [{ name: "Trần Tâm (Mẹ)", phone: "0944111119", isPrimary: true }],
    status: "booked_assessment",
    attendance: "declined",
    subject: "english",
    eventType: "test",
    program: "Station Program",
    school: "RinoEdu Nguyễn Tuân",
    room: "Sảnh tư vấn",
    classroom: "Phòng C1",
    testTime: "2026-05-20 17:00",
    testResult: {
      level: "Chưa xác định",
      speaking: "-",
      speakingAi: "0/0",
      speakingScore: "0",
      lwr: "-",
      lwrLevel: "-",
      lwrScore: "0",
      path: "Kiểm tra đầu vào Tiếng Anh",
    },
    resultLink: "",
    testLink: "mock://booking-tests/e0004",
    createdBy: "Yen Nhi",
    ops: "Yen Nhi",
    teacher: "",
    tester: "",
    interviewer: "Minh Hoang",
    msg: "-",
    notes: [],
  },
  {
    id: "E0005",
    childName: "Bao Chau",
    dob: "2014-06-17",
    familyName: "Gia đình Bảo Châu",
    phone: "0912345678",
    familyMembers: [
      { name: "Phạm Mai (Mẹ)", phone: "0912345678", isPrimary: true },
      { name: "Phạm Long (Bố)", phone: "0901122334" },
    ],
    status: "started_assessment",
    isInterviewed: true,
    isTested: true,
    attendance: "confirmed",
    subject: "english",
    eventType: "test",
    program: "IELTS Foundation",
    school: "RinoEdu Smart City",
    room: "Phòng IELTS",
    classroom: "Phòng IELTS",
    testTime: "2026-05-21 10:00",
    testResult: {
      level: "Level 3B",
      subLevel: "A",
      speaking: "7.5/8",
      speakingAi: "8/8",
      speakingScore: "1",
      lwr: "35/40",
      lwrLevel: "IELTS Readiness",
      lwrScore: "4",
      path: "IELTS Readiness",
    },
    resultLink: "",
    testLink: "mock://booking-tests/e0005",
    createdBy: "Le Hoang Nam",
    ops: "Le Hoang Nam",
    teacher: "Sarah J.",
    tester: "Sarah J.",
    interviewer: "Robert L.",
    msg: "Phụ huynh muốn tư vấn lộ trình IELTS sau khi có kết quả",
    notes: [{ text: "Phụ huynh muốn tư vấn lộ trình IELTS sau khi có kết quả", author: "Le Hoang Nam", timestamp: "2026-05-21 11:05" }],
  },
  {
    id: "E0006",
    childName: "Minh Khoa",
    dob: "2016-09-22",
    familyName: "Gia đình Minh Khoa",
    phone: "0901456789",
    familyMembers: [{ name: "Nguyễn Khang (Bố)", phone: "0901456789", isPrimary: true }],
    status: "failed",
    isInterviewed: false,
    isTested: true,
    attendance: "confirmed",
    subject: "math",
    eventType: "test",
    program: "Toán tư duy",
    school: "RinoEdu Linh Đàm",
    room: "Phòng M1",
    classroom: "Phòng M1",
    testTime: "2026-05-17 15:30",
    testResult: {
      level: "Pre-Level 0",
      subLevel: "A1",
      speaking: "-",
      speakingAi: "5/8",
      speakingScore: "0",
      lwr: "12/40",
      lwrLevel: "Starters",
      lwrScore: "0",
    },
    resultLink: "mock://booking-results/e0006",
    testLink: "mock://booking-tests/e0006",
    createdBy: "Thanh Van",
    ops: "Thanh Van",
    teacher: "Thay Hung",
    tester: "Thay Hung",
    msg: "Đề xuất test lại sau hai tuần",
    notes: [{ text: "Đề xuất test lại sau hai tuần", author: "Thay Hung", timestamp: "2026-05-17 16:20" }],
  },
  {
    id: "E0007",
    childName: "Gia Bao",
    dob: "2019-04-08",
    familyName: "Gia đình Gia Bảo",
    phone: "0977567890",
    familyMembers: [{ name: "Đặng Minh (Bố)", phone: "0977567890", isPrimary: true }],
    status: "cancelled",
    attendance: "declined",
    subject: "english",
    eventType: "test",
    program: "Tiếng Anh thiếu nhi",
    school: "RinoEdu Nguyễn Tuân",
    room: "Phòng K2",
    classroom: "Phòng K2",
    testTime: "2026-05-16 09:30",
    testResult: {
      level: "Chưa xác định",
      speaking: "-",
      speakingAi: "0/0",
      speakingScore: "0",
      lwr: "-",
      lwrLevel: "-",
      lwrScore: "0",
      path: "Kiểm tra đầu vào thiếu nhi",
    },
    resultLink: "",
    testLink: "mock://booking-tests/e0007",
    createdBy: "Tran Anh Kiet",
    ops: "Tran Anh Kiet",
    teacher: "Emily W.",
    tester: "Emily W.",
    msg: "Gia đình yêu cầu đổi lịch",
    notes: [{ text: "Gia đình yêu cầu đổi lịch", author: "Tran Anh Kiet", timestamp: "2026-05-16 08:00" }],
  },
  {
    id: "E0008",
    childName: "Thanh Huong",
    dob: "2015-12-03",
    familyName: "Gia đình Thanh Hương",
    phone: "0938456789",
    familyMembers: [
      { name: "Võ Thanh (Bố)", phone: "0938456789", isPrimary: true },
      { name: "Lê Minh (Mẹ)", phone: "0938456790" },
    ],
    status: "completed",
    isInterviewed: true,
    isTested: true,
    attendance: "confirmed",
    subject: "math",
    eventType: "test",
    program: "Toán Olympiad",
    school: "RinoEdu Smart City",
    room: "Phòng 301",
    classroom: "Phòng 301",
    testTime: "2026-05-15 14:30",
    testResult: {
      level: "Level 2A",
      subLevel: "B",
      speaking: "-",
      speakingAi: "8/8",
      speakingScore: "0",
      lwr: "31/40",
      lwrLevel: "Movers",
      lwrScore: "4",
    },
    resultLink: "mock://booking-results/e0008",
    testLink: "mock://booking-tests/e0008",
    createdBy: "Nguyen Thi Ha",
    ops: "Nguyen Thi Ha",
    teacher: "Thay Hung",
    tester: "Thay Hung",
    interviewer: "Kieu Anh",
    msg: "Sẵn sàng vào lớp Toán Olympiad khối 4",
    notes: [{ text: "Sẵn sàng vào lớp Toán Olympiad khối 4", author: "Thay Hung", timestamp: "2026-05-15 15:40" }],
  },
]

export function getBookingTests(filters?: {
  search?: string
  school?: string
  subject?: BookingSubject
  status?: BookingStatus
}): BookingTest[] {
  return mockBookingTests.filter((booking) => {
    if (filters?.subject && booking.subject !== filters.subject) return false
    if (filters?.school && booking.school !== filters.school) return false
    if (filters?.status && booking.status !== filters.status) return false
    if (filters?.search) {
      const query = filters.search.toLowerCase()
      const haystack = [
        booking.childName,
        booking.familyName,
        booking.phone,
        booking.id,
        booking.school,
        booking.classroom,
      ].join(" ").toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}
