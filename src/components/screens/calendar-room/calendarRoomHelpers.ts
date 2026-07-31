import type { RoomRecord } from './calendarRoomTypes'

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

export const DAY_NAMES = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']

export function getMockRooms(): RoomRecord[] {
  return [
    {
      id: 'room-101',
      roomName: 'Phòng 101',
      capacity: 20,
      roomType: 'theory',
      typeLabel: 'Phòng Lý thuyết',
      facilities: ['Máy chiếu', 'Loa', 'Điều hòa'],
      branch: 'RinoEdu Nguyễn Tuân',
      sessions: [
        {
          id: 'slot-1',
          classCode: 'CLS-IELTS-001',
          className: 'IELTS Junior 1A',
          teacherName: 'Cô Lan',
          timeSlot: '18:00 - 19:30',
          shift: 'evening',
          dayOfWeek: 'Thứ 2',
          studentCount: 8,
          maxCapacity: 20,
          status: 'active',
          subject: 'Tiếng Anh',
        },
        {
          id: 'slot-2',
          classCode: 'CLS-MATH-002',
          className: 'Toán Tư Duy A2',
          teacherName: 'Thầy Hùng',
          timeSlot: '19:45 - 21:15',
          shift: 'evening',
          dayOfWeek: 'Thứ 2',
          studentCount: 12,
          maxCapacity: 20,
          status: 'active',
          subject: 'Toán học',
        },
        {
          id: 'slot-1b',
          classCode: 'CLS-IELTS-001',
          className: 'IELTS Junior 1A',
          teacherName: 'Cô Lan',
          timeSlot: '18:00 - 19:30',
          shift: 'evening',
          dayOfWeek: 'Thứ 4',
          studentCount: 8,
          maxCapacity: 20,
          status: 'active',
          subject: 'Tiếng Anh',
        },
        {
          id: 'slot-1c',
          classCode: 'CLS-IELTS-001',
          className: 'IELTS Junior 1A',
          teacherName: 'Cô Lan',
          timeSlot: '18:00 - 19:30',
          shift: 'evening',
          dayOfWeek: 'Thứ 6',
          studentCount: 8,
          maxCapacity: 20,
          status: 'active',
          subject: 'Tiếng Anh',
        },
      ],
    },
    {
      id: 'room-102',
      roomName: 'Phòng 102',
      capacity: 15,
      roomType: 'theory',
      typeLabel: 'Phòng Lý thuyết',
      facilities: ['Bảng từ', 'Tivi', 'Điều hòa'],
      branch: 'RinoEdu Nguyễn Tuân',
      sessions: [
        {
          id: 'slot-3',
          classCode: 'CLS-ENG-003',
          className: 'English Kids K1',
          teacherName: 'Cô Phương',
          timeSlot: '18:00 - 19:30',
          shift: 'evening',
          dayOfWeek: 'Thứ 2',
          studentCount: 14,
          maxCapacity: 15,
          status: 'active',
          subject: 'Tiếng Anh',
        },
        {
          id: 'slot-3b',
          classCode: 'CLS-ENG-003',
          className: 'English Kids K1',
          teacherName: 'Cô Phương',
          timeSlot: '18:00 - 19:30',
          shift: 'evening',
          dayOfWeek: 'Thứ 5',
          studentCount: 14,
          maxCapacity: 15,
          status: 'active',
          subject: 'Tiếng Anh',
        },
      ],
    },
    {
      id: 'room-lab',
      roomName: 'Phòng Lab Robotics',
      capacity: 25,
      roomType: 'lab',
      typeLabel: 'Phòng Thực hành',
      facilities: ['25 Máy tính', 'Bộ Kit Robotics', 'Máy chiếu'],
      branch: 'RinoEdu Nguyễn Tuân',
      sessions: [
        {
          id: 'slot-4',
          classCode: 'CLS-STEM-001',
          className: 'STEM Lego Master',
          teacherName: 'Thầy Minh',
          timeSlot: '18:00 - 19:30',
          shift: 'evening',
          dayOfWeek: 'Thứ 2',
          studentCount: 18,
          maxCapacity: 25,
          status: 'active',
          subject: 'STEM Robotics',
        },
        {
          id: 'slot-5',
          classCode: 'CLS-STEM-002',
          className: 'STEM Robotics Pro',
          teacherName: 'Thầy Tuấn',
          timeSlot: '18:00 - 19:30',
          shift: 'evening',
          dayOfWeek: 'Thứ 2',
          studentCount: 15,
          maxCapacity: 25,
          status: 'conflict',
          subject: 'STEM Robotics',
        },
        {
          id: 'slot-4b',
          classCode: 'CLS-STEM-001',
          className: 'STEM Lego Master',
          teacherName: 'Thầy Minh',
          timeSlot: '09:00 - 11:30',
          shift: 'morning',
          dayOfWeek: 'Thứ 7',
          studentCount: 18,
          maxCapacity: 25,
          status: 'active',
          subject: 'STEM Robotics',
        },
      ],
    },
    {
      id: 'room-103',
      roomName: 'Phòng 103',
      capacity: 20,
      roomType: 'theory',
      typeLabel: 'Phòng Lý thuyết',
      facilities: ['Bảng từ', 'Máy chiếu', 'Điều hòa'],
      branch: 'RinoEdu Nguyễn Tuân',
      sessions: [
        {
          id: 'slot-7',
          classCode: 'CLS-MATH-005',
          className: 'Toán Nâng Cao 5',
          teacherName: 'Cô Thu',
          timeSlot: '14:00 - 17:00',
          shift: 'afternoon',
          dayOfWeek: 'Thứ 3',
          studentCount: 16,
          maxCapacity: 20,
          status: 'active',
          subject: 'Toán học',
        },
      ],
    },
    {
      id: 'room-201',
      roomName: 'Phòng 201',
      capacity: 30,
      roomType: 'theory',
      typeLabel: 'Hội trường lớn',
      facilities: ['Máy chiếu lớn', 'Loa âm trần', 'Điều hòa công suất lớn'],
      branch: 'RinoEdu Cầu Giấy',
      sessions: [
        {
          id: 'slot-6',
          classCode: 'CLS-IELTS-005',
          className: 'IELTS Intensive B2',
          teacherName: 'Cô Hải',
          timeSlot: '09:00 - 11:30',
          shift: 'morning',
          dayOfWeek: 'Thứ 7',
          studentCount: 22,
          maxCapacity: 30,
          status: 'active',
          subject: 'Tiếng Anh',
        },
      ],
    },
  ]
}

export function filterRooms(
  rooms: RoomRecord[],
  filters: {
    search: string
    branch: string
    statusTile: string
    roomType: string
  }
): RoomRecord[] {
  return rooms.filter((room) => {
    // Branch filter
    if (filters.branch !== 'all' && room.branch !== filters.branch) return false

    // Search query
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const matchName = room.roomName.toLowerCase().includes(q)
      const matchSession = room.sessions.some(
        (s) =>
          s.className.toLowerCase().includes(q) ||
          s.classCode.toLowerCase().includes(q) ||
          s.teacherName.toLowerCase().includes(q)
      )
      if (!matchName && !matchSession) return false
    }

    // Room type
    if (filters.roomType && filters.roomType !== 'all' && room.roomType !== filters.roomType) {
      return false
    }

    // Status tile filter
    if (filters.statusTile === 'active') {
      return room.sessions.some((s) => s.status === 'active')
    }
    if (filters.statusTile === 'conflict') {
      return room.sessions.some((s) => s.status === 'conflict')
    }
    if (filters.statusTile === 'free') {
      return room.sessions.length === 0 || room.sessions.some((s) => s.status === 'free')
    }

    return true
  })
}
