import type {
  ClassSessionV2,
  RoomRowRecord,
  TeacherRowRecord,
} from './calendarClassV2Types'

export const DAY_NAMES = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']

export const formatLabel = (date: Date, opts: Intl.DateTimeFormatOptions) =>
  date.toLocaleDateString('vi-VN', opts)

export const getMonday = (input: Date) => {
  const date = new Date(input)
  const day = date.getDay()
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1))
  date.setHours(0, 0, 0, 0)
  return date
}

export const getWeekDays = (from: Date) =>
  Array.from({ length: 7 }, (_, index) => {
    const date = new Date(from)
    date.setDate(date.getDate() + index)
    date.setHours(0, 0, 0, 0)
    return date
  })

export function getMockSessionsV2(): ClassSessionV2[] {
  return [
    {
      id: 'sess-1',
      classCode: 'CLS-IELTS-001',
      className: 'IELTS Junior 1A',
      subject: 'Tiếng Anh',
      teacherName: 'Cô Lan',
      taName: 'Trần Văn Hoàng',
      taStatus: 'confirmed',
      roomName: 'Phòng 101',
      branch: 'RinoEdu Nguyễn Tuân',
      timeSlot: '18:00 - 19:30',
      shift: 'evening',
      dayOfWeek: 'Thứ 2',
      attendedStudents: 18,
      totalStudents: 20,
      trialStudents: 2,
      currentSession: 18,
      totalSessions: 36,
      status: 'opening',
      milestone: 'midterm',
    },
    {
      id: 'sess-2',
      classCode: 'CLS-MATH-002',
      className: 'Toán Tư Duy A2',
      subject: 'Toán học',
      teacherName: 'Thầy Hùng',
      taStatus: 'missing',
      roomName: 'Phòng 101',
      branch: 'RinoEdu Nguyễn Tuân',
      timeSlot: '19:45 - 21:15',
      shift: 'evening',
      dayOfWeek: 'Thứ 2',
      attendedStudents: 12,
      totalStudents: 20,
      trialStudents: 0,
      currentSession: 28,
      totalSessions: 36,
      status: 'normal',
      milestone: 'renewal',
    },
    {
      id: 'sess-3',
      classCode: 'CLS-STEM-001',
      className: 'STEM Lego Master',
      subject: 'STEM Robotics',
      teacherName: 'Thầy Tuấn',
      substituteTeacher: 'Thầy Minh',
      taName: 'Lê Bảo Anh',
      taSubstituteName: 'Phạm Thu Trang',
      taStatus: 'substitute',
      roomName: 'Phòng Lab Robotics',
      branch: 'RinoEdu Nguyễn Tuân',
      timeSlot: '18:00 - 19:30',
      shift: 'evening',
      dayOfWeek: 'Thứ 2',
      attendedStudents: 15,
      totalStudents: 25,
      trialStudents: 1,
      currentSession: 10,
      totalSessions: 24,
      status: 'substitute',
    },
    {
      id: 'sess-4',
      classCode: 'CLS-STEM-002',
      className: 'STEM Robotics Pro',
      subject: 'STEM Robotics',
      teacherName: 'Thầy Tuấn',
      taStatus: 'missing',
      roomName: 'Phòng Lab Robotics',
      branch: 'RinoEdu Nguyễn Tuân',
      timeSlot: '18:00 - 19:30',
      shift: 'evening',
      dayOfWeek: 'Thứ 2',
      attendedStudents: 14,
      totalStudents: 25,
      trialStudents: 0,
      currentSession: 12,
      totalSessions: 24,
      status: 'conflict',
    },
    {
      id: 'sess-5',
      classCode: 'CLS-ENG-003',
      className: 'English Kids K1',
      subject: 'Tiếng Anh',
      teacherName: 'Cô Phương',
      taName: 'Đặng Minh Đức',
      taStatus: 'confirmed',
      roomName: 'Phòng 102',
      branch: 'RinoEdu Nguyễn Tuân',
      timeSlot: '18:00 - 19:30',
      shift: 'evening',
      dayOfWeek: 'Thứ 5',
      attendedStudents: 14,
      totalStudents: 15,
      trialStudents: 1,
      currentSession: 32,
      totalSessions: 36,
      status: 'normal',
      milestone: 'final',
    },
    {
      id: 'sess-6',
      classCode: 'CLS-IELTS-005',
      className: 'IELTS Intensive B2',
      subject: 'Tiếng Anh',
      teacherName: 'Cô Hải',
      taName: 'Vũ Thanh Hằng',
      taStatus: 'confirmed',
      roomName: 'Phòng 201',
      branch: 'RinoEdu Cầu Giấy',
      timeSlot: '09:00 - 11:30',
      shift: 'morning',
      dayOfWeek: 'Thứ 7',
      attendedStudents: 22,
      totalStudents: 30,
      trialStudents: 3,
      currentSession: 5,
      totalSessions: 40,
      status: 'normal',
    },
  ]
}

export function getMockRoomsV2(): RoomRowRecord[] {
  const sessions = getMockSessionsV2()
  return [
    {
      id: 'room-101',
      roomName: 'Phòng 101',
      capacity: 20,
      typeLabel: 'Phòng Lý thuyết',
      branch: 'RinoEdu Nguyễn Tuân',
      sessions: sessions.filter((s) => s.roomName === 'Phòng 101'),
    },
    {
      id: 'room-102',
      roomName: 'Phòng 102',
      capacity: 15,
      typeLabel: 'Phòng Lý thuyết',
      branch: 'RinoEdu Nguyễn Tuân',
      sessions: sessions.filter((s) => s.roomName === 'Phòng 102'),
    },
    {
      id: 'room-lab',
      roomName: 'Phòng Lab Robotics',
      capacity: 25,
      typeLabel: 'Phòng Thực hành',
      branch: 'RinoEdu Nguyễn Tuân',
      sessions: sessions.filter((s) => s.roomName === 'Phòng Lab Robotics'),
    },
    {
      id: 'room-201',
      roomName: 'Phòng 201',
      capacity: 30,
      typeLabel: 'Hội trường lớn',
      branch: 'RinoEdu Cầu Giấy',
      sessions: sessions.filter((s) => s.roomName === 'Phòng 201'),
    },
  ]
}

export function getMockTeachersV2(): TeacherRowRecord[] {
  const sessions = getMockSessionsV2()
  return [
    {
      id: 'tch-1',
      teacherName: 'Cô Lan',
      roleLabel: 'Giáo viên Tiếng Anh',
      weeklyHours: 32,
      isOverloaded: true,
      branch: 'RinoEdu Nguyễn Tuân',
      sessions: sessions.filter((s) => s.teacherName === 'Cô Lan'),
    },
    {
      id: 'tch-2',
      teacherName: 'Thầy Hùng',
      roleLabel: 'Giáo viên Toán',
      weeklyHours: 24,
      isOverloaded: false,
      branch: 'RinoEdu Nguyễn Tuân',
      sessions: sessions.filter((s) => s.teacherName === 'Thầy Hùng'),
    },
    {
      id: 'tch-3',
      teacherName: 'Thầy Tuấn',
      roleLabel: 'Giáo viên STEM',
      weeklyHours: 28,
      isOverloaded: false,
      branch: 'RinoEdu Nguyễn Tuân',
      sessions: sessions.filter((s) => s.teacherName === 'Thầy Tuấn'),
    },
    {
      id: 'tch-4',
      teacherName: 'Cô Phương',
      roleLabel: 'Giáo viên Mầm non',
      weeklyHours: 18,
      isOverloaded: false,
      branch: 'RinoEdu Nguyễn Tuân',
      sessions: sessions.filter((s) => s.teacherName === 'Cô Phương'),
    },
  ]
}


