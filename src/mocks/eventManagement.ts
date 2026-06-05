export interface AgendaItem {
  id: string
  timeLabel: string // e.g. "09:00 - 09:30"
  title: string
  speaker?: string
  description?: string
}

export interface EventItem {
  id: string
  title: string
  type: 'seminar' | 'open_day' | 'trial' | 'other'
  typeLabel: string // "Hội thảo" | "Ngày hội mở" | "Trải nghiệm học thử" | "Khác"
  branch: string // e.g. "RinoEdu Linh Đàm"
  startDate: string // ISO string "2026-06-05T09:00:00"
  endDate: string // ISO string "2026-06-05T11:30:00"
  capacity: number
  location: string // e.g. "Phòng Hội thảo Tầng 2"
  organizer: string // e.g. "Phòng Tuyển sinh"
  description?: string
  status: 'nhap' | 'mo_dang_ky' | 'dang_dien_ra' | 'ket_thuc' | 'huy'
  statusLabel: string // "Nháp" | "Mở đăng ký" | "Đang diễn ra" | "Đã kết thúc" | "Đã hủy"
  cancelReason?: string
  agenda?: AgendaItem[]
  registeredCount: number
  checkedInCount: number
  targetAudience?: 'parent' | 'student' | 'family'
  targetAudienceLabel?: string
}

export interface AttendeeItem {
  id: string
  eventId: string
  name: string
  phone: string
  email?: string
  status: 'cho_checkin' | 'checkin' | 'cancelled' | 'waitlist'
  statusLabel: string // "Chờ check-in" | "Đã tham dự" | "Đã hủy" | "Danh sách chờ"
  checkInTime?: string // e.g. "09:15"
  childName?: string
  childAge?: number
  trialStation?: string // e.g. "Robotics" | "Toán tư duy" | "Tiếng Anh" | "Không đăng ký"
  parentCheckedIn?: boolean
  childCheckedIn?: boolean
  parentCheckInTime?: string
  childCheckInTime?: string
}

// Raw Initial Data
const initialEvents: EventItem[] = [
  {
    id: "EVT-26-001",
    title: "Hội thảo Chiến Lược Chinh Phục IELTS 7.5+",
    type: "seminar",
    typeLabel: "Hội thảo",
    branch: "RinoEdu Linh Đàm",
    startDate: "2026-06-10T09:00:00",
    endDate: "2026-06-10T11:30:00",
    capacity: 50,
    location: "RinoEdu Linh Đàm - Hội trường Tầng 2",
    organizer: "Phòng Tuyển sinh",
    description: "Hội thảo định hướng lộ trình học IELTS toàn diện từ con số 0 cùng chuyên gia học thuật hàng đầu.",
    status: "mo_dang_ky",
    statusLabel: "Mở đăng ký",
    registeredCount: 42,
    checkedInCount: 0,
    targetAudience: "parent",
    targetAudienceLabel: "Phụ huynh",
    agenda: [
      { id: "ag-1-1", timeLabel: "08:30 - 09:00", title: "Đón khách & Teabreak chào mừng", speaker: "Ban đón tiếp" },
      { id: "ag-1-2", timeLabel: "09:00 - 10:00", title: "Phần 1: Những thay đổi cốt lõi trong đề thi IELTS và chiến lược ôn luyện", speaker: "Thầy John David (Academic Director)" },
      { id: "ag-1-3", timeLabel: "10:00 - 11:00", title: "Phần 2: Phương pháp phát âm chuẩn IPA và phản xạ IELTS Speaking", speaker: "Cô Thu Hà (IELTS Coach 8.5)" },
      { id: "ag-1-4", timeLabel: "11:00 - 11:30", title: "Q&A cùng Chuyên gia và Trao học bổng may mắn", speaker: "Tất cả diễn giả" }
    ]
  },
  {
    id: "EVT-26-002",
    title: "Open Day - Ngày hội trải nghiệm Tiếng Anh Công Nghệ",
    type: "open_day",
    typeLabel: "Ngày hội mở",
    branch: "RinoEdu Nguyễn Tuân",
    startDate: "2026-06-15T08:30:00",
    endDate: "2026-06-15T12:00:00",
    capacity: 100,
    location: "RinoEdu Nguyễn Tuân - Khuôn viên Sân chơi chính",
    organizer: "Phòng Marketing",
    description: "Ngày hội khám phá phương pháp học Tiếng Anh thông qua thực hành công nghệ và trò chơi tương tác sáng tạo.",
    status: "mo_dang_ky",
    statusLabel: "Mở đăng ký",
    registeredCount: 98,
    checkedInCount: 0,
    targetAudience: "family",
    targetAudienceLabel: "Cả gia đình",
    agenda: [
      { id: "ag-2-1", timeLabel: "08:30 - 09:30", title: "Check-in đón khách và phát Passport khám phá", speaker: "Marketing team" },
      { id: "ag-2-2", timeLabel: "09:30 - 11:30", title: "Trải nghiệm 4 Trạm Công nghệ Tiếng Anh liên hoàn", speaker: "Đội ngũ Giáo viên nước ngoài" },
      { id: "ag-2-3", timeLabel: "11:30 - 12:00", title: "Bốc thăm trúng thưởng & Tư vấn nhập học nhận ưu đãi đặc biệt", speaker: "Sales manager" }
    ]
  },
  {
    id: "EVT-26-003",
    title: "Đại Hội Khoa Học & Trải Nghiệm STEM Robotics",
    type: "trial",
    typeLabel: "Trải nghiệm học thử",
    branch: "RinoEdu Smart City",
    startDate: "2026-05-31T14:00:00",
    endDate: "2026-05-31T17:00:00",
    capacity: 30,
    location: "RinoEdu Smart City - Phòng Trải nghiệm STEM",
    organizer: "Phòng Đào tạo",
    description: "Khám phá thế giới lắp ráp robot tự động hóa, học lập trình cơ bản và thi đấu robot theo sa bàn thực tế.",
    status: "dang_dien_ra",
    statusLabel: "Đang diễn ra",
    registeredCount: 28,
    checkedInCount: 16,
    targetAudience: "student",
    targetAudienceLabel: "Học sinh",
    agenda: [
      { id: "ag-3-1", timeLabel: "14:00 - 14:30", title: "Lắp ráp robot dò đường cơ bản", speaker: "Thầy Thanh Bình" },
      { id: "ag-3-2", timeLabel: "14:30 - 16:00", title: "Học lệnh lập trình điều hướng cảm biến", speaker: "Thầy David John" },
      { id: "ag-3-3", timeLabel: "16:00 - 17:00", title: "Giải đấu Robo-Arena & Vinh danh nhà vô địch", speaker: "Ban Giám khảo" }
    ]
  },
  {
    id: "EVT-26-004",
    title: "Festival Trải Nghiệm Toán Tư Duy Rino Archimedes",
    type: "open_day",
    typeLabel: "Ngày hội mở",
    branch: "RinoEdu Nguyễn Tuân",
    startDate: "2026-05-24T09:00:00",
    endDate: "2026-05-24T11:30:00",
    capacity: 60,
    location: "RinoEdu Nguyễn Tuân - Phòng Đa năng 1",
    organizer: "Phòng Tuyển sinh",
    description: "Ngày hội Toán tư duy giúp trẻ khơi dậy tư duy sáng tạo thông qua các trò chơi xếp hình khối thông minh.",
    status: "ket_thuc",
    statusLabel: "Đã kết thúc",
    registeredCount: 56,
    checkedInCount: 48,
    targetAudience: "family",
    targetAudienceLabel: "Cả gia đình",
    agenda: [
      { id: "ag-4-1", timeLabel: "09:00 - 09:30", title: "Phát động ngày hội & Phổ biến luật đấu trí", speaker: "Cô Mỹ Linh" },
      { id: "ag-4-2", timeLabel: "09:30 - 11:00", title: "Khám phá Trạm Toán tư duy và giải đố Tangram", speaker: "Tập thể giáo viên Toán" },
      { id: "ag-4-3", timeLabel: "11:00 - 11:30", title: "Trao chứng nhận Rino-Math-Champ & chụp ảnh lưu niệm", speaker: "Branch Manager" }
    ]
  },
  {
    id: "EVT-26-005",
    title: "Hội thảo Hướng Nghiệp Kỹ Năng Thế Kỷ 21",
    type: "seminar",
    typeLabel: "Hội thảo",
    branch: "RinoEdu Linh Đàm",
    startDate: "2026-06-25T18:00:00",
    endDate: "2026-06-25T20:30:00",
    capacity: 80,
    location: "RinoEdu Linh Đàm - Phòng 105",
    organizer: "Phòng Tuyển sinh",
    description: "Buổi chia sẻ định hướng kỹ năng mềm, kỹ năng giao tiếp và tư duy phản biện cần thiết cho kỷ nguyên số.",
    status: "nhap",
    statusLabel: "Nháp",
    registeredCount: 0,
    checkedInCount: 0,
    targetAudience: "parent",
    targetAudienceLabel: "Phụ huynh",
    agenda: [
      { id: "ag-5-1", timeLabel: "18:00 - 18:30", title: "Đón phụ huynh và ổn định chỗ ngồi", speaker: "Ban lễ tân" },
      { id: "ag-5-2", timeLabel: "18:30 - 20:00", title: "Nội dung: 4Cs Kỹ năng thế kỷ 21 cho con trẻ", speaker: "Coenrad Redman" },
      { id: "ag-5-3", timeLabel: "20:00 - 20:30", title: "Tư vấn lộ trình học tích hợp kỹ năng tại RinoEdu", speaker: "Sales team" }
    ]
  },
  {
    id: "EVT-26-006",
    title: "Open Day - Lễ Hội Hè Trải Nghiệm Khai Giảng Mới",
    type: "open_day",
    typeLabel: "Ngày hội mở",
    branch: "RinoEdu Smart City",
    startDate: "2026-05-20T08:30:00",
    endDate: "2026-05-20T11:30:00",
    capacity: 40,
    location: "RinoEdu Smart City - Sân vườn chung",
    organizer: "Phòng Marketing",
    description: "Lễ hội hè vui nhộn kết hợp trải nghiệm các học phần Tiếng Anh mới.",
    status: "huy",
    statusLabel: "Đã hủy",
    cancelReason: "Trùng lịch bảo trì nguồn điện tổng của tòa nhà chi nhánh.",
    registeredCount: 15,
    checkedInCount: 0,
    targetAudience: "family",
    targetAudienceLabel: "Cả gia đình",
    agenda: []
  }
]

const initialAttendees: AttendeeItem[] = [
  // EVT-001 (Strategic IELTS - Target is Parent)
  { id: "att-1", eventId: "EVT-26-001", name: "Nguyễn Minh Anh", phone: "0987654321", email: "minhanh@gmail.com", status: "cho_checkin", statusLabel: "Chờ check-in", parentCheckedIn: false, childCheckedIn: false },
  { id: "att-2", eventId: "EVT-26-001", name: "Trần Đức Nam", phone: "0912345678", email: "ducnam@gmail.com", status: "cho_checkin", statusLabel: "Chờ check-in", parentCheckedIn: false, childCheckedIn: false },
  { id: "att-3", eventId: "EVT-26-001", name: "Lê Thu Thảo", phone: "0904445556", email: "thuthao@gmail.com", status: "cho_checkin", statusLabel: "Chờ check-in", parentCheckedIn: false, childCheckedIn: false },
  { id: "att-4", eventId: "EVT-26-001", name: "Phạm Hải Đăng", phone: "0945678901", email: "haidang@gmail.com", status: "cho_checkin", statusLabel: "Chờ check-in", parentCheckedIn: false, childCheckedIn: false },
  { id: "att-5", eventId: "EVT-26-001", name: "Hoàng Thùy Dương", phone: "0934567123", email: "thuyduong@gmail.com", status: "cho_checkin", statusLabel: "Chờ check-in", parentCheckedIn: false, childCheckedIn: false },
  
  // EVT-003 (STEM Robotics - Ongoing - Target is Student)
  { id: "att-11", eventId: "EVT-26-003", name: "Ngô Quốc Khánh", phone: "0981234567", email: "quockhanh@gmail.com", status: "checkin", statusLabel: "Đã tham dự", checkInTime: "13:58", childName: "Ngô Hoàng Bách", childAge: 8, trialStation: "Robotics", parentCheckedIn: true, childCheckedIn: true, parentCheckInTime: "13:58", childCheckInTime: "13:58" },
  { id: "att-12", eventId: "EVT-26-003", name: "Vũ Bảo Lâm", phone: "0972345678", email: "baolam@gmail.com", status: "checkin", statusLabel: "Đã tham dự", checkInTime: "14:02", childName: "Vũ Bảo Ngọc", childAge: 10, trialStation: "Robotics", parentCheckedIn: false, childCheckedIn: true, childCheckInTime: "14:02" },
  { id: "att-13", eventId: "EVT-26-003", name: "Lê Cẩm Tú", phone: "0963456789", email: "camtu@gmail.com", status: "checkin", statusLabel: "Đã tham dự", checkInTime: "14:05", childName: "Lê Cẩm Anh", childAge: 9, trialStation: "Robotics", parentCheckedIn: true, childCheckedIn: true, parentCheckInTime: "14:05", childCheckInTime: "14:05" },
  { id: "att-14", eventId: "EVT-26-003", name: "Bùi Tiến Đạt", phone: "0954567890", email: "tiendat@gmail.com", status: "cho_checkin", statusLabel: "Chờ check-in", childName: "Bùi Tiến Dũng", childAge: 7, trialStation: "Robotics", parentCheckedIn: false, childCheckedIn: false },
  { id: "att-15", eventId: "EVT-26-003", name: "Đặng Hồng Nhung", phone: "0945678901", email: "hongnhung@gmail.com", status: "cho_checkin", statusLabel: "Chờ check-in", childName: "Đặng Khánh Linh", childAge: 11, trialStation: "Robotics", parentCheckedIn: false, childCheckedIn: false },
  { id: "att-16", eventId: "EVT-26-003", name: "Phùng Gia Bảo", phone: "0936789012", email: "giabao@gmail.com", status: "waitlist", statusLabel: "Danh sách chờ", childName: "Phùng Tiến Phát", childAge: 6, trialStation: "Robotics", parentCheckedIn: false, childCheckedIn: false },
  { id: "att-17", eventId: "EVT-26-003", name: "Nguyễn Hoàng Long", phone: "0912789123", email: "hoanglong@gmail.com", status: "cancelled", statusLabel: "Đã hủy", childName: "Nguyễn Hoàng Hải", childAge: 8, trialStation: "Robotics", parentCheckedIn: false, childCheckedIn: false },

  // EVT-004 (Math Festival - Completed - Target is Family)
  { id: "att-21", eventId: "EVT-26-004", name: "Trương Mỹ Hạnh", phone: "0981112223", email: "myhanh@gmail.com", status: "checkin", statusLabel: "Đã tham dự", checkInTime: "08:45", childName: "Trương Minh Đức", childAge: 6, trialStation: "Toán tư duy", parentCheckedIn: true, childCheckedIn: true, parentCheckInTime: "08:45", childCheckInTime: "08:45" },
  { id: "att-22", eventId: "EVT-26-004", name: "Nguyễn Hải Phong", phone: "0972223334", email: "haiphong@gmail.com", status: "checkin", statusLabel: "Đã tham dự", checkInTime: "08:52", childName: "Nguyễn Hải Đăng", childAge: 7, trialStation: "Toán tư duy", parentCheckedIn: true, childCheckedIn: true, parentCheckInTime: "08:52", childCheckInTime: "08:52" },
  { id: "att-23", eventId: "EVT-26-004", name: "Phạm Khánh Huyền", phone: "0963334445", email: "khanhhuyen@gmail.com", status: "checkin", statusLabel: "Đã tham dự", checkInTime: "08:55", childName: "Phạm Minh Thư", childAge: 9, trialStation: "Toán tư duy", parentCheckedIn: true, childCheckedIn: true, parentCheckInTime: "08:55", childCheckInTime: "08:55" },
  { id: "att-24", eventId: "EVT-26-004", name: "Đỗ Gia Huy", phone: "0954445556", email: "giahuy@gmail.com", status: "cancelled", statusLabel: "Đã hủy", childName: "Đỗ Gia Hân", childAge: 5, trialStation: "Toán tư duy", parentCheckedIn: false, childCheckedIn: false }
]

// State keepers for dynamic modifications inside current session
let events: EventItem[] = [...initialEvents]
let attendees: AttendeeItem[] = [...initialAttendees]

// CRUD Helper Methods
export function getEvents(filters?: {
  search?: string
  branch?: string
  status?: string
}): EventItem[] {
  return events.filter(evt => {
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      const matchSearch =
        evt.title.toLowerCase().includes(q) ||
        evt.id.toLowerCase().includes(q) ||
        evt.location.toLowerCase().includes(q)
      if (!matchSearch) return false
    }
    if (filters?.branch && filters.branch !== "Tất cả chi nhánh" && filters.branch !== "") {
      if (evt.branch !== filters.branch) return false
    }
    if (filters?.status && filters.status !== "Tất cả") {
      if (evt.status !== filters.status) return false
    }
    return true
  })
}

export function getEventDetail(id: string): EventItem | undefined {
  return events.find(evt => evt.id === id)
}

export function getAttendeesByEventId(eventId: string): AttendeeItem[] {
  return attendees.filter(att => att.eventId === eventId)
}

export function recalculateEventCounts(eventId: string) {
  const eventAttendees = attendees.filter(att => att.eventId === eventId)
  const registeredCount = eventAttendees.filter(att => att.status !== 'cancelled' && att.status !== 'waitlist').length
  const checkedInCount = eventAttendees.filter(att => att.status === 'checkin').length

  events = events.map(evt => {
    if (evt.id === eventId) {
      return {
        ...evt,
        registeredCount,
        checkedInCount
      }
    }
    return evt
  })
}

export function toggleCheckInStatus(
  eventId: string,
  attendeeId: string,
  targetStatus: 'cho_checkin' | 'checkin' | 'cancelled' | 'waitlist'
): AttendeeItem[] {
  const checkInTime = targetStatus === 'checkin' 
    ? new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : undefined

  const statusLabelMap: Record<string, string> = {
    cho_checkin: "Chờ check-in",
    checkin: "Đã tham dự",
    cancelled: "Đã hủy",
    waitlist: "Danh sách chờ"
  }

  attendees = attendees.map(att => {
    if (att.id === attendeeId && att.eventId === eventId) {
      const isCheckedIn = targetStatus === 'checkin'
      return {
        ...att,
        status: targetStatus,
        statusLabel: statusLabelMap[targetStatus],
        checkInTime,
        parentCheckedIn: isCheckedIn,
        childCheckedIn: isCheckedIn,
        parentCheckInTime: isCheckedIn ? checkInTime : undefined,
        childCheckInTime: isCheckedIn ? checkInTime : undefined
      }
    }
    return att
  })

  recalculateEventCounts(eventId)
  return getAttendeesByEventId(eventId)
}

export function toggleParentCheckIn(
  eventId: string,
  attendeeId: string,
  checkedIn: boolean
): AttendeeItem[] {
  const checkInTime = checkedIn 
    ? new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : undefined

  attendees = attendees.map(att => {
    if (att.id === attendeeId && att.eventId === eventId) {
      const nextParentCheckedIn = checkedIn
      const nextChildCheckedIn = att.childCheckedIn ?? false
      const eitherCheckedIn = nextParentCheckedIn || nextChildCheckedIn
      const nextStatus = eitherCheckedIn ? 'checkin' : 'cho_checkin'
      const nextStatusLabel = eitherCheckedIn ? "Đã tham dự" : "Chờ check-in"
      
      return {
        ...att,
        parentCheckedIn: nextParentCheckedIn,
        parentCheckInTime: checkInTime,
        status: nextStatus,
        statusLabel: nextStatusLabel,
        checkInTime: checkInTime || att.checkInTime
      }
    }
    return att
  })

  recalculateEventCounts(eventId)
  return getAttendeesByEventId(eventId)
}

export function toggleChildCheckIn(
  eventId: string,
  attendeeId: string,
  checkedIn: boolean
): AttendeeItem[] {
  const checkInTime = checkedIn 
    ? new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : undefined

  attendees = attendees.map(att => {
    if (att.id === attendeeId && att.eventId === eventId) {
      const nextParentCheckedIn = att.parentCheckedIn ?? false
      const nextChildCheckedIn = checkedIn
      const eitherCheckedIn = nextParentCheckedIn || nextChildCheckedIn
      const nextStatus = eitherCheckedIn ? 'checkin' : 'cho_checkin'
      const nextStatusLabel = eitherCheckedIn ? "Đã tham dự" : "Chờ check-in"
      
      return {
        ...att,
        childCheckedIn: nextChildCheckedIn,
        childCheckInTime: checkInTime,
        status: nextStatus,
        statusLabel: nextStatusLabel,
        checkInTime: checkInTime || att.checkInTime
      }
    }
    return att
  })

  recalculateEventCounts(eventId)
  return getAttendeesByEventId(eventId)
}

export function addAttendeeToEvent(
  eventId: string,
  guest: { name: string; phone: string; email?: string; childName?: string; childAge?: number; trialStation?: string }
): AttendeeItem[] {
  const event = events.find(evt => evt.id === eventId)
  if (!event) return getAttendeesByEventId(eventId)

  const newId = `att-${Date.now()}`
  const eventAttendees = attendees.filter(att => att.eventId === eventId)
  const activeCount = eventAttendees.filter(att => att.status !== 'cancelled' && att.status !== 'waitlist').length

  const isWaitlist = activeCount >= event.capacity
  const status: AttendeeItem['status'] = isWaitlist ? 'waitlist' : 'cho_checkin'
  const statusLabel = isWaitlist ? 'Danh sách chờ' : 'Chờ check-in'

  const newAttendee: AttendeeItem = {
    id: newId,
    eventId,
    name: guest.name,
    phone: guest.phone,
    email: guest.email,
    status,
    statusLabel,
    childName: guest.childName,
    childAge: guest.childAge,
    trialStation: guest.trialStation || "Không đăng ký",
    parentCheckedIn: false,
    childCheckedIn: false
  }

  attendees.push(newAttendee)

  recalculateEventCounts(eventId)
  return getAttendeesByEventId(eventId)
}

export function createEvent(eventData: Omit<EventItem, 'id' | 'registeredCount' | 'checkedInCount' | 'statusLabel'>): EventItem {
  const newId = `EVT-26-${String(events.length + 1).padStart(3, '0')}`
  const statusLabelMap: Record<string, string> = {
    nhap: "Nháp",
    mo_dang_ky: "Mở đăng ký",
    dang_dien_ra: "Đang diễn ra",
    ket_thuc: "Đã kết thúc",
    huy: "Đã hủy"
  }

  const newEvent: EventItem = {
    ...eventData,
    id: newId,
    statusLabel: statusLabelMap[eventData.status],
    registeredCount: 0,
    checkedInCount: 0,
    agenda: eventData.agenda || []
  }

  events.push(newEvent)
  return newEvent
}

export function updateEvent(id: string, eventData: Partial<EventItem>): EventItem | undefined {
  const statusLabelMap: Record<string, string> = {
    nhap: "Nháp",
    mo_dang_ky: "Mở đăng ký",
    dang_dien_ra: "Đang diễn ra",
    ket_thuc: "Đã kết thúc",
    huy: "Đã hủy"
  }

  events = events.map(evt => {
    if (evt.id === id) {
      const status = eventData.status || evt.status
      return {
        ...evt,
        ...eventData,
        statusLabel: statusLabelMap[status] || evt.statusLabel
      }
    }
    return evt
  })

  return getEventDetail(id)
}

export function cancelEvent(id: string, reason: string): EventItem | undefined {
  events = events.map(evt => {
    if (evt.id === id) {
      return {
        ...evt,
        status: 'huy',
        statusLabel: 'Đã hủy',
        cancelReason: reason
      }
    }
    return evt
  })

  return getEventDetail(id)
}
