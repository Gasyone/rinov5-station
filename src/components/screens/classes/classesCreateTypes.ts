export const WEEKDAY_DAYS = [
  { id: 'monday', label: 'Thứ 2' },
  { id: 'tuesday', label: 'Thứ 3' },
  { id: 'wednesday', label: 'Thứ 4' },
  { id: 'thursday', label: 'Thứ 5' },
  { id: 'friday', label: 'Thứ 6' },
  { id: 'saturday', label: 'Thứ 7' },
  { id: 'sunday', label: 'Chủ nhật' },
]

export const DURATION_OPTIONS = [
  { value: '60', label: '60 phút' },
  { value: '90', label: '90 phút' },
  { value: '100', label: '100 phút' },
  { value: '120', label: '120 phút' },
  { value: '150', label: '150 phút' },
  { value: '180', label: '180 phút' },
]

export const CLASS_TYPES = [
  { value: 'Chính thức', label: 'Lớp Chính thức' },
  { value: 'Workshop', label: 'Lớp Workshop' },
]

export const TEACHER_TYPES = [
  { value: 'Nước ngoài', label: 'Nước ngoài' },
  { value: 'Việt Nam', label: 'Việt Nam' },
  { value: 'MIX', label: 'MIX' },
]

export const CLASS_RATIOS = [
  { value: '1:1', label: '1:1' },
  { value: '1:6', label: '1:6' },
  { value: '1:10', label: '1:10' },
  { value: '1:15', label: '1:15' },
  { value: '1:20', label: '1:20' },
]

export const CURRICULUM_FRAMES = [
  { value: 'STATION_OMO_OFFLINE_STARTERS A', label: 'STATION_OMO_OFFLINE_STARTERS A' },
  { value: 'STATION_OMO_OFFLINE_KINDIE A', label: 'STATION_OMO_OFFLINE_KINDIE A' },
  { value: 'Station_Toán tư duy (Col 4 tuổi)', label: 'Station_Toán tư duy (Col 4 tuổi)' },
  { value: 'Toán tư duy (Eins 8 tuổi)', label: 'Toán tư duy (Eins 8 tuổi)' },
  { value: 'WS_MUSIC_BASIC_2026', label: 'WS_MUSIC_BASIC_2026' },
]

export const ROOM_OPTIONS = [
  { value: 'Phòng 101', label: 'Phòng 101 (Hạn mức: 15)' },
  { value: 'Phòng 102', label: 'Phòng 102 (Hạn mức: 15)' },
  { value: 'Phòng 201', label: 'Phòng 201 (Hạn mức: 20)' },
  { value: 'Phòng 202', label: 'Phòng 202 (Hạn mức: 20)' },
  { value: 'Phòng 301', label: 'Phòng 301 (Hạn mức: 25)' },
  { value: 'Phòng 302', label: 'Phòng 302 (Hạn mức: 25)' },
  { value: 'Phòng Lab A', label: 'Phòng Lab A (Hạn mức: 30)' },
  { value: 'Phòng Lab B', label: 'Phòng Lab B (Hạn mức: 30)' },
  { value: 'Phòng Hội thảo', label: 'Phòng Hội thảo (Hạn mức: 50)' },
]

export const initialScheduleDays = {
  monday: { enabled: false, startTime: '17:30', endTime: '', teachers: [], room: '' },
  tuesday: { enabled: false, startTime: '17:30', endTime: '', teachers: [], room: '' },
  wednesday: { enabled: false, startTime: '17:30', endTime: '', teachers: [], room: '' },
  thursday: { enabled: false, startTime: '17:30', endTime: '', teachers: [], room: '' },
  friday: { enabled: false, startTime: '17:30', endTime: '', teachers: [], room: '' },
  saturday: { enabled: false, startTime: '17:30', endTime: '', teachers: [], room: '' },
  sunday: { enabled: false, startTime: '17:30', endTime: '', teachers: [], room: '' },
}

export const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  if (!startTime || !durationMinutes) return ''
  const [h, m] = startTime.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return ''
  const startMinutes = h * 60 + m
  const endMinutes = startMinutes + durationMinutes
  const endH = Math.floor(endMinutes / 60) % 24
  const endM = endMinutes % 60
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
}

export const getMockRoomCount = (dayId: string, startTime: string): number => {
  if (!startTime) return 0
  const hour = parseInt(startTime.split(':')[0]) || 17
  const dayLength = dayId.length
  const hash = (dayLength + hour) % 4
  return [14, 8, 12, 10][hash]
}

export const getMockTeacherCount = (dayId: string, startTime: string): number => {
  if (!startTime) return 0
  const hour = parseInt(startTime.split(':')[0]) || 17
  const dayLength = dayId.length
  const hash = (dayLength + hour) % 4
  return [9, 6, 8, 5][hash]
}

export const getMockRemainingSessions = (id: string): string => {
  const sessions = [12, 24, 36, 8, 16, 42, 4]
  const idx = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % sessions.length
  return `${sessions[idx]} buổi`
}

export const getMockSaleNote = (id: string, notes?: string): string => {
  if (notes) return notes
  const mockNotes = [
    'Học viên có nhu cầu học thử trước khi đóng phí.',
    'Sale note: Phụ huynh muốn xếp lớp học ca tối Thứ 2/Thứ 6.',
    'Chờ xếp lớp sau khi hoàn thành đóng phí đợt 2.',
    'Yêu cầu giáo viên bản ngữ dạy kèm IELTS Writing.',
    'Mong muốn học lớp sỹ số nhỏ để kèm cặp kỹ hơn.',
    'Học viên học lực khá, cần test đầu vào cẩn thận.',
  ]
  const idx = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % mockNotes.length
  return mockNotes[idx]
}

export const getMockPackage = (id: string, level?: string): string => {
  const packages = ['Tiêu chuẩn', 'Cao cấp Pro', 'Cấp tốc 1-1', 'Cam kết đầu ra']
  const idx = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % packages.length
  const prefix = level || 'IELTS'
  return `${prefix} ${packages[idx]}`
}

export const getCurriculumDetails = (frame: string) => {
  switch (frame) {
    case 'STATION_OMO_OFFLINE_STARTERS A':
      return { subject: 'English', level: 'Beginner', subLevel: 'Movers' }
    case 'STATION_OMO_OFFLINE_KINDIE A':
      return { subject: 'English', level: 'Beginner', subLevel: 'Flyers' }
    case 'Station_Toán tư duy (Col 4 tuổi)':
      return { subject: 'Beginner', level: 'Beginner', subLevel: 'Movers' }
    case 'Toán tư duy (Eins 8 tuổi)':
      return { subject: 'Beginner', level: 'Beginner', subLevel: 'Flyers' }
    case 'WS_MUSIC_BASIC_2026':
      return { subject: 'Beginner', level: 'Beginner', subLevel: 'Beginner' }
    default:
      return null
  }
}

export function getRoomsForBranch(branch: string) {
  const getCapacityText = (roomName: string) => {
    if (roomName.includes('101') || roomName.includes('102')) return ' (Hạn mức: 15)'
    if (roomName.includes('201') || roomName.includes('202')) return ' (Hạn mức: 20)'
    if (roomName.includes('301') || roomName.includes('302')) return ' (Hạn mức: 25)'
    if (roomName.includes('Lab')) return ' (Hạn mức: 30)'
    if (roomName.includes('Hội thảo')) return ' (Hạn mức: 50)'
    return ' (Hạn mức: 15)'
  }

  const mapRoom = (room: string) => ({
    value: room,
    label: `${room}${getCapacityText(room)}`
  })

  if (branch.includes('Linh Đàm')) {
    return [
      'Phòng 101 (LĐ)',
      'Phòng 102 (LĐ)',
      'Phòng 201 (LĐ)',
      'Phòng Lab A (LĐ)',
    ].map(mapRoom)
  } else if (branch.includes('Nguyễn Tuân')) {
    return [
      'Phòng 301 (NT)',
      'Phòng 302 (NT)',
      'Phòng Lab B (NT)',
      'Phòng Hội thảo (NT)',
    ].map(mapRoom)
  } else if (branch.includes('Smart City')) {
    return [
      'Phòng 201 (SC)',
      'Phòng 202 (SC)',
      'Phòng Lab A (SC)',
      'Phòng Hội thảo (SC)',
    ].map(mapRoom)
  }
  return [
    'Phòng 101',
    'Phòng 102',
    'Phòng 201',
    'Phòng 202',
  ].map(mapRoom)
}

