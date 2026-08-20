import { mockBookingTests, type BookingTest } from './bookingTests'
import { getMockClassSessions } from './calendarSchedule'
import { getMockWorkRegistrations } from './workRegistrations'

export type ShiftSection = 'morning' | 'afternoon' | 'evening' | 'evening_digi'

export interface DutyEmployee {
  id: string
  name: string
  shortName: string
  role: 'Giáo viên' | 'Trợ giảng' | 'CS' | 'Khác'
  colorClass: string
  branch: string
}

export interface MasterShiftAssignment {
  branch: string
  dayIndex: number // 0 = T2, 1 = T3, 2 = T4, 3 = T5, 4 = T6, 5 = T7, 6 = CN
  section: ShiftSection
  assignedEmployeeIds: string[]
}

export interface SlotStaffAvailability {
  employee: DutyEmployee
  isAvailable: boolean
  conflictType?: 'class_session' | 'booking_test' | 'trial_class' | 'none'
  conflictDetail?: string
}

export interface SlotCapacitySummary {
  slot: string
  section: ShiftSection
  availableCount: number
  totalDutyCount: number
  staff: SlotStaffAvailability[]
}

export const DUTY_SECTIONS: Array<{
  id: ShiftSection
  label: string
  icon: string
  slots: string[]
  badge?: string
  description?: string
}> = [
  {
    id: 'morning',
    label: 'Buổi sáng',
    icon: '☀️',
    slots: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00'],
  },
  {
    id: 'afternoon',
    label: 'Buổi chiều',
    icon: '🌤',
    slots: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
  },
  {
    id: 'evening',
    label: 'Buổi tối',
    icon: '🌙',
    slots: ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'],
  },
  {
    id: 'evening_digi',
    label: 'Buổi tối - Ca trực lớp Digital / Digi Station (18:00 - 21:00)',
    icon: '💻',
    badge: 'Phòng Digital',
    slots: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'],
    description: 'Giáo viên & Trợ giảng phụ trách lớp tự học Digital / Digi Station',
  },
]

export const WEEKDAYS = [
  { index: 0, label: 'Thứ 2', short: 'T2' },
  { index: 1, label: 'Thứ 3', short: 'T3' },
  { index: 2, label: 'Thứ 4', short: 'T4' },
  { index: 3, label: 'Thứ 5', short: 'T5' },
  { index: 4, label: 'Thứ 6', short: 'T6' },
  { index: 5, label: 'Thứ 7', short: 'T7' },
  { index: 6, label: 'Chủ nhật', short: 'CN' },
]

export const ALL_DUTY_EMPLOYEES: DutyEmployee[] = [
  // --- RinoEdu Smart City ---
  { id: 'e1', name: 'Nguyễn Văn Quản Lý', shortName: 'QL', role: 'Khác', colorClass: 'bg-amber-600 text-white', branch: 'RinoEdu Smart City' },
  { id: 'e4', name: 'Hoàng Thị Giáo Viên', shortName: 'HG', role: 'Giáo viên', colorClass: 'bg-cyan-600 text-white', branch: 'RinoEdu Smart City' },
  { id: 'e5', name: 'Lê Thị Chăm Sóc', shortName: 'LC', role: 'CS', colorClass: 'bg-amber-600 text-white', branch: 'RinoEdu Smart City' },
  { id: 't6', name: 'Coenrad Redman', shortName: 'CR', role: 'Giáo viên', colorClass: 'bg-purple-600 text-white', branch: 'RinoEdu Smart City' },
  { id: 'tg_sc1', name: 'Nguyễn Thu Hà', shortName: 'TH', role: 'Trợ giảng', colorClass: 'bg-purple-700 text-white', branch: 'RinoEdu Smart City' },
  { id: 'tg_sc2', name: 'Trần Minh Châu', shortName: 'MC', role: 'Trợ giảng', colorClass: 'bg-pink-700 text-white', branch: 'RinoEdu Smart City' },
  { id: 'e9', name: 'Bùi Văn Support', shortName: 'BS', role: 'Khác', colorClass: 'bg-blue-600 text-white', branch: 'RinoEdu Smart City' },
  { id: 'sc1', name: 'Trần Bảo Ngọc', shortName: 'BN', role: 'Giáo viên', colorClass: 'bg-emerald-600 text-white', branch: 'RinoEdu Smart City' },
  { id: 'sc2', name: 'Vũ Đình Trọng', shortName: 'VT', role: 'Giáo viên', colorClass: 'bg-indigo-600 text-white', branch: 'RinoEdu Smart City' },
  { id: 'sc3', name: 'Phạm Mai Anh', shortName: 'MA', role: 'CS', colorClass: 'bg-rose-600 text-white', branch: 'RinoEdu Smart City' },
  { id: 'sc4', name: 'Đinh Quốc Tuấn', shortName: 'QT', role: 'CS', colorClass: 'bg-teal-600 text-white', branch: 'RinoEdu Smart City' },
  { id: 'sc5', name: 'Lê Thu Trang', shortName: 'TT', role: 'Giáo viên', colorClass: 'bg-violet-600 text-white', branch: 'RinoEdu Smart City' },
  { id: 'sc6', name: 'Nguyễn Hải Đăng', shortName: 'HĐ', role: 'Giáo viên', colorClass: 'bg-sky-600 text-white', branch: 'RinoEdu Smart City' },

  // --- RinoEdu Nguyễn Tuân ---
  { id: 't1', name: 'Sarah J.', shortName: 'SJ', role: 'Giáo viên', colorClass: 'bg-emerald-600 text-white', branch: 'RinoEdu Nguyễn Tuân' },
  { id: 't2', name: 'Robert L.', shortName: 'RL', role: 'Giáo viên', colorClass: 'bg-blue-600 text-white', branch: 'RinoEdu Nguyễn Tuân' },
  { id: 't3', name: 'Emily W.', shortName: 'EW', role: 'Giáo viên', colorClass: 'bg-indigo-600 text-white', branch: 'RinoEdu Nguyễn Tuân' },
  { id: 'tg_nt1', name: 'Lê Hồng Nhung', shortName: 'HN', role: 'Trợ giảng', colorClass: 'bg-purple-700 text-white', branch: 'RinoEdu Nguyễn Tuân' },
  { id: 'tg_nt2', name: 'Phạm Thùy Linh', shortName: 'TL', role: 'Trợ giảng', colorClass: 'bg-indigo-700 text-white', branch: 'RinoEdu Nguyễn Tuân' },
  { id: 'e3', name: 'Phạm Văn Giảng Dạy', shortName: 'PG', role: 'Giáo viên', colorClass: 'bg-teal-600 text-white', branch: 'RinoEdu Nguyễn Tuân' },
  { id: 'e2', name: 'Trần Thị Sale', shortName: 'TS', role: 'CS', colorClass: 'bg-rose-600 text-white', branch: 'RinoEdu Nguyễn Tuân' },
  { id: 'e6', name: 'Đặng Văn Bắc', shortName: 'ĐB', role: 'Khác', colorClass: 'bg-amber-600 text-white', branch: 'RinoEdu Nguyễn Tuân' },
  { id: 'e8', name: 'Ngô Thị Accounting', shortName: 'NA', role: 'Khác', colorClass: 'bg-slate-600 text-white', branch: 'RinoEdu Nguyễn Tuân' },
  { id: 'nt1', name: 'Nguyễn Đức Minh', shortName: 'DM', role: 'Giáo viên', colorClass: 'bg-cyan-600 text-white', branch: 'RinoEdu Nguyễn Tuân' },
  { id: 'nt2', name: 'Hoàng Thùy Linh', shortName: 'TL', role: 'Giáo viên', colorClass: 'bg-violet-600 text-white', branch: 'RinoEdu Nguyễn Tuân' },
  { id: 'nt3', name: 'Bùi Thu Phương', shortName: 'TP', role: 'CS', colorClass: 'bg-pink-600 text-white', branch: 'RinoEdu Nguyễn Tuân' },
  { id: 'nt4', name: 'Đỗ Anh Tuấn', shortName: 'AT', role: 'Giáo viên', colorClass: 'bg-sky-600 text-white', branch: 'RinoEdu Nguyễn Tuân' },

  // --- RinoEdu Linh Đàm ---
  { id: 't4', name: 'Thu Hà', shortName: 'TH', role: 'Giáo viên', colorClass: 'bg-emerald-700 text-white', branch: 'RinoEdu Linh Đàm' },
  { id: 't5', name: 'Mỹ Linh', shortName: 'ML', role: 'Giáo viên', colorClass: 'bg-sky-600 text-white', branch: 'RinoEdu Linh Đàm' },
  { id: 'tg_ld1', name: 'Nguyễn Thu Hà', shortName: 'TH', role: 'Trợ giảng', colorClass: 'bg-purple-700 text-white', branch: 'RinoEdu Linh Đàm' },
  { id: 'tg_ld2', name: 'Trần Minh Châu', shortName: 'MC', role: 'Trợ giảng', colorClass: 'bg-pink-700 text-white', branch: 'RinoEdu Linh Đàm' },
  { id: 'tg_ld3', name: 'Vũ Mai Hương', shortName: 'MH', role: 'Trợ giảng', colorClass: 'bg-teal-700 text-white', branch: 'RinoEdu Linh Đàm' },
  { id: 'e10', name: 'Đỗ Thị Part-time', shortName: 'ĐP', role: 'Khác', colorClass: 'bg-violet-600 text-white', branch: 'RinoEdu Linh Đàm' },
  { id: 'e7', name: 'Vũ Văn Reception', shortName: 'VR', role: 'Khác', colorClass: 'bg-amber-600 text-white', branch: 'RinoEdu Linh Đàm' },
  { id: 'e12', name: 'Nguyễn Hoàng Sale', shortName: 'HS', role: 'CS', colorClass: 'bg-rose-600 text-white', branch: 'RinoEdu Linh Đàm' },
  { id: 'ld1', name: 'Nguyễn Minh Đức', shortName: 'MĐ', role: 'Giáo viên', colorClass: 'bg-blue-600 text-white', branch: 'RinoEdu Linh Đàm' },
  { id: 'ld2', name: 'Lê Phương Thảo', shortName: 'PT', role: 'Giáo viên', colorClass: 'bg-teal-600 text-white', branch: 'RinoEdu Linh Đàm' },
  { id: 'ld3', name: 'Trần Quang Huy', shortName: 'QH', role: 'CS', colorClass: 'bg-indigo-600 text-white', branch: 'RinoEdu Linh Đàm' },
  { id: 'ld4', name: 'Đào Thị Lan', shortName: 'TL', role: 'CS', colorClass: 'bg-pink-600 text-white', branch: 'RinoEdu Linh Đàm' },
  { id: 'ld5', name: 'Phạm Hoàng Yến', shortName: 'HY', role: 'Giáo viên', colorClass: 'bg-cyan-600 text-white', branch: 'RinoEdu Linh Đàm' },
  { id: 'ld6', name: 'Vũ Minh Khang', shortName: 'MK', role: 'Giáo viên', colorClass: 'bg-purple-600 text-white', branch: 'RinoEdu Linh Đàm' },
]

// Master Shift Template Cố định ban đầu cho các chi nhánh
const initialMasterRoster: MasterShiftAssignment[] = [
  // --- RinoEdu Nguyễn Tuân ---
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 0, section: 'morning', assignedEmployeeIds: ['t1', 't3', 'e3', 'nt1', 'nt3'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 0, section: 'afternoon', assignedEmployeeIds: ['t2', 'e2', 't3', 'nt2'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 0, section: 'evening', assignedEmployeeIds: ['t1', 't2', 'e3', 'nt4'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 0, section: 'evening_digi', assignedEmployeeIds: ['tg_nt1'] },

  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 1, section: 'morning', assignedEmployeeIds: ['t2', 't3', 'nt4', 'e6'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 1, section: 'afternoon', assignedEmployeeIds: ['t1', 'e2', 'nt1'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 1, section: 'evening', assignedEmployeeIds: ['t3', 'e3', 'nt1', 'nt2'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 1, section: 'evening_digi', assignedEmployeeIds: ['tg_nt2'] },

  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 2, section: 'morning', assignedEmployeeIds: ['t1', 't2', 't3', 'nt3'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 2, section: 'afternoon', assignedEmployeeIds: ['e3', 'e2', 'nt4', 'e8'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 2, section: 'evening', assignedEmployeeIds: ['t1', 't3', 'nt2'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 2, section: 'evening_digi', assignedEmployeeIds: ['tg_nt1'] },

  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 3, section: 'morning', assignedEmployeeIds: ['t3', 'e3', 'nt1'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 3, section: 'afternoon', assignedEmployeeIds: ['t1', 't2', 'nt3'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 3, section: 'evening', assignedEmployeeIds: ['t2', 'e2', 't3', 'nt4'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 3, section: 'evening_digi', assignedEmployeeIds: ['tg_nt2'] },

  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 4, section: 'morning', assignedEmployeeIds: ['t1', 't2', 'e3', 'nt2'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 4, section: 'afternoon', assignedEmployeeIds: ['t3', 'e2', 'nt1', 'nt4'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 4, section: 'evening', assignedEmployeeIds: ['t1', 't2', 'nt3'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 4, section: 'evening_digi', assignedEmployeeIds: ['tg_nt1'] },

  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 5, section: 'morning', assignedEmployeeIds: ['t1', 't2', 't3', 'e3', 'nt1'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 5, section: 'afternoon', assignedEmployeeIds: ['t1', 't3', 'e2', 'nt2'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 5, section: 'evening', assignedEmployeeIds: ['t2', 'e3', 'nt4'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 5, section: 'evening_digi', assignedEmployeeIds: ['tg_nt1', 'tg_nt2'] },

  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 6, section: 'morning', assignedEmployeeIds: ['t1', 't3', 'nt3', 'nt4'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 6, section: 'afternoon', assignedEmployeeIds: ['t2', 'e3', 'nt1'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 6, section: 'evening', assignedEmployeeIds: ['t1', 't2', 't3', 'nt2'] },
  { branch: 'RinoEdu Nguyễn Tuân', dayIndex: 6, section: 'evening_digi', assignedEmployeeIds: ['tg_nt2'] },

  // --- RinoEdu Linh Đàm ---
  { branch: 'RinoEdu Linh Đàm', dayIndex: 0, section: 'morning', assignedEmployeeIds: ['t4', 't5', 'ld1', 'ld3'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 0, section: 'afternoon', assignedEmployeeIds: ['t4', 'e10', 'ld2', 'ld4'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 0, section: 'evening', assignedEmployeeIds: ['t5', 'e10', 'ld5', 'ld6'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 0, section: 'evening_digi', assignedEmployeeIds: ['tg_ld1'] },

  { branch: 'RinoEdu Linh Đàm', dayIndex: 1, section: 'morning', assignedEmployeeIds: ['t5', 'e10', 'ld2', 'ld5'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 1, section: 'afternoon', assignedEmployeeIds: ['t4', 't5', 'ld1', 'ld3'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 1, section: 'evening', assignedEmployeeIds: ['t4', 'e10', 'ld6', 'e12'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 1, section: 'evening_digi', assignedEmployeeIds: ['tg_ld2'] },

  { branch: 'RinoEdu Linh Đàm', dayIndex: 2, section: 'morning', assignedEmployeeIds: ['t4', 't5', 'ld4', 'ld6'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 2, section: 'afternoon', assignedEmployeeIds: ['t5', 'e10', 'ld2', 'ld3'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 2, section: 'evening', assignedEmployeeIds: ['t4', 't5', 'ld1', 'ld5'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 2, section: 'evening_digi', assignedEmployeeIds: ['tg_ld1'] },

  { branch: 'RinoEdu Linh Đàm', dayIndex: 3, section: 'morning', assignedEmployeeIds: ['t5', 'e10', 'ld1', 'ld3'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 3, section: 'afternoon', assignedEmployeeIds: ['t4', 'e10', 'ld5', 'ld6'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 3, section: 'evening', assignedEmployeeIds: ['t4', 't5', 'ld2', 'ld4'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 3, section: 'evening_digi', assignedEmployeeIds: ['tg_ld3'] },

  { branch: 'RinoEdu Linh Đàm', dayIndex: 4, section: 'morning', assignedEmployeeIds: ['t4', 't5', 'e10', 'ld2'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 4, section: 'afternoon', assignedEmployeeIds: ['t4', 't5', 'ld4', 'ld6'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 4, section: 'evening', assignedEmployeeIds: ['t5', 'e10', 'ld1', 'ld3'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 4, section: 'evening_digi', assignedEmployeeIds: ['tg_ld1'] },

  { branch: 'RinoEdu Linh Đàm', dayIndex: 5, section: 'morning', assignedEmployeeIds: ['t4', 't5', 'ld1', 'ld5', 'e7'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 5, section: 'afternoon', assignedEmployeeIds: ['t4', 'e10', 'ld2', 'ld6'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 5, section: 'evening', assignedEmployeeIds: ['t5', 'e10', 'ld3', 'ld4'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 5, section: 'evening_digi', assignedEmployeeIds: ['tg_ld1', 'tg_ld2'] },

  { branch: 'RinoEdu Linh Đàm', dayIndex: 6, section: 'morning', assignedEmployeeIds: ['t4', 't5', 'ld3', 'ld6'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 6, section: 'afternoon', assignedEmployeeIds: ['t5', 'e10', 'ld1', 'ld5'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 6, section: 'evening', assignedEmployeeIds: ['t4', 'e10', 'ld2', 'ld4'] },
  { branch: 'RinoEdu Linh Đàm', dayIndex: 6, section: 'evening_digi', assignedEmployeeIds: ['tg_ld2'] },

  // --- RinoEdu Smart City ---
  { branch: 'RinoEdu Smart City', dayIndex: 0, section: 'morning', assignedEmployeeIds: ['e1', 'e4', 'e5', 'sc1', 'sc3', 'e9'] },
  { branch: 'RinoEdu Smart City', dayIndex: 0, section: 'afternoon', assignedEmployeeIds: ['t6', 'e5', 'sc4', 'tg_sc2'] },
  { branch: 'RinoEdu Smart City', dayIndex: 0, section: 'evening', assignedEmployeeIds: ['e4', 't6', 'sc5', 'sc6'] },
  { branch: 'RinoEdu Smart City', dayIndex: 0, section: 'evening_digi', assignedEmployeeIds: ['tg_sc1'] },

  { branch: 'RinoEdu Smart City', dayIndex: 1, section: 'morning', assignedEmployeeIds: ['t6', 'e5', 'sc2', 'sc4'] },
  { branch: 'RinoEdu Smart City', dayIndex: 1, section: 'afternoon', assignedEmployeeIds: ['e4', 'e5', 'sc1', 'sc6'] },
  { branch: 'RinoEdu Smart City', dayIndex: 1, section: 'evening', assignedEmployeeIds: ['e4', 't6', 'sc5'] },
  { branch: 'RinoEdu Smart City', dayIndex: 1, section: 'evening_digi', assignedEmployeeIds: ['tg_sc2'] },

  { branch: 'RinoEdu Smart City', dayIndex: 2, section: 'morning', assignedEmployeeIds: ['e1', 'e4', 't6', 'sc3', 'sc4'] },
  { branch: 'RinoEdu Smart City', dayIndex: 2, section: 'afternoon', assignedEmployeeIds: ['e5', 't6', 'sc5', 'tg_sc1'] },
  { branch: 'RinoEdu Smart City', dayIndex: 2, section: 'evening', assignedEmployeeIds: ['e4', 'e5', 'sc2'] },
  { branch: 'RinoEdu Smart City', dayIndex: 2, section: 'evening_digi', assignedEmployeeIds: ['tg_sc1'] },

  { branch: 'RinoEdu Smart City', dayIndex: 3, section: 'morning', assignedEmployeeIds: ['e4', 'e5', 'sc1', 'tg_sc1'] },
  { branch: 'RinoEdu Smart City', dayIndex: 3, section: 'afternoon', assignedEmployeeIds: ['t6', 'e5', 'sc3', 'sc6'] },
  { branch: 'RinoEdu Smart City', dayIndex: 3, section: 'evening', assignedEmployeeIds: ['e4', 't6', 'e9', 'sc5'] },
  { branch: 'RinoEdu Smart City', dayIndex: 3, section: 'evening_digi', assignedEmployeeIds: ['tg_sc2'] },

  { branch: 'RinoEdu Smart City', dayIndex: 4, section: 'morning', assignedEmployeeIds: ['t6', 'e5', 'sc4', 'sc5'] },
  { branch: 'RinoEdu Smart City', dayIndex: 4, section: 'afternoon', assignedEmployeeIds: ['e4', 't6', 'tg_sc2', 'sc1'] },
  { branch: 'RinoEdu Smart City', dayIndex: 4, section: 'evening', assignedEmployeeIds: ['e4', 'e5', 'sc6', 'sc2'] },
  { branch: 'RinoEdu Smart City', dayIndex: 4, section: 'evening_digi', assignedEmployeeIds: ['tg_sc1'] },

  { branch: 'RinoEdu Smart City', dayIndex: 5, section: 'morning', assignedEmployeeIds: ['e1', 'e4', 't6', 'e5', 'sc2'] },
  { branch: 'RinoEdu Smart City', dayIndex: 5, section: 'afternoon', assignedEmployeeIds: ['e4', 'e5', 'sc3', 'sc4'] },
  { branch: 'RinoEdu Smart City', dayIndex: 5, section: 'evening', assignedEmployeeIds: ['t6', 'e5', 'sc1', 'sc5'] },
  { branch: 'RinoEdu Smart City', dayIndex: 5, section: 'evening_digi', assignedEmployeeIds: ['tg_sc1', 'tg_sc2'] },

  { branch: 'RinoEdu Smart City', dayIndex: 6, section: 'morning', assignedEmployeeIds: ['e4', 'e5', 'sc1', 'sc3'] },
  { branch: 'RinoEdu Smart City', dayIndex: 6, section: 'afternoon', assignedEmployeeIds: ['t6', 'e5', 'sc2', 'sc6'] },
  { branch: 'RinoEdu Smart City', dayIndex: 6, section: 'evening', assignedEmployeeIds: ['e4', 't6', 'sc4', 'e9'] },
  { branch: 'RinoEdu Smart City', dayIndex: 6, section: 'evening_digi', assignedEmployeeIds: ['tg_sc2'] },
]

// In-Memory Master Store
let currentMasterRoster: MasterShiftAssignment[] = [...initialMasterRoster]

export function getMasterShiftRoster(branch?: string): MasterShiftAssignment[] {
  if (!branch || branch === 'all') return currentMasterRoster
  return currentMasterRoster.filter((item) => item.branch === branch)
}

export function updateMasterShiftRosterSlot(
  branch: string,
  dayIndex: number,
  section: ShiftSection,
  assignedEmployeeIds: string[]
): void {
  const existingIdx = currentMasterRoster.findIndex(
    (item) => item.branch === branch && item.dayIndex === dayIndex && item.section === section
  )
  if (existingIdx >= 0) {
    currentMasterRoster[existingIdx] = {
      branch,
      dayIndex,
      section,
      assignedEmployeeIds,
    }
  } else {
    currentMasterRoster.push({
      branch,
      dayIndex,
      section,
      assignedEmployeeIds,
    })
  }
}

export function resetMasterShiftRosterToDefault(): void {
  currentMasterRoster = [...initialMasterRoster]
}

export function getDutyEmployeesByBranch(branch?: string): DutyEmployee[] {
  if (!branch || branch === 'all' || branch === 'Toàn hệ thống') {
    return ALL_DUTY_EMPLOYEES
  }
  return ALL_DUTY_EMPLOYEES.filter((emp) => emp.branch === branch)
}

export function findDutyEmployeeById(id: string): DutyEmployee | undefined {
  return ALL_DUTY_EMPLOYEES.find((emp) => emp.id === id)
}

export function findDutyEmployeeByName(name: string): DutyEmployee | undefined {
  return ALL_DUTY_EMPLOYEES.find((emp) => emp.name.toLowerCase() === name.toLowerCase())
}

/**
 * Xác định buổi (Sáng, Chiều, Tối) từ chuỗi giờ '09:00', '14:30'...
 */
export function getSectionFromTime(time: string): ShiftSection {
  const [h] = time.split(':').map(Number)
  if (h < 12) return 'morning'
  if (h < 18) return 'afternoon'
  return 'evening'
}

/**
 * Lấy chỉ số ngày trong tuần (0 = T2, ..., 6 = CN) từ chuỗi YYYY-MM-DD
 */
export function getDayIndexFromDateStr(dateStr: string): number {
  const parts = dateStr.split('-').map(Number)
  if (parts.length < 3) return 0
  const d = new Date(parts[0], parts[1] - 1, parts[2])
  const day = d.getDay() // 0 = CN, 1 = T2 ... 6 = T7
  return day === 0 ? 6 : day - 1
}

/**
 * CONFLICT ENGINE:
 * Kiểm tra xem một nhân sự có bị xung đột thời gian với:
 * 1. Lớp học chính thức (Class Session trong calendarSchedule)
 * 2. Ca Booking Test khác (BookingTest trong bookingTests)
 */
const DEMO_SLOT_CONFLICTS: Record<string, Record<string, string>> = {
  'Sarah J.': {
    '08:30': 'Đang dạy lớp STA-01 (08:00 - 09:30)',
    '10:00': 'Trùng ca test của Nguyễn Gia Hân (Station Movers)',
    '14:30': 'Đang dạy kèm 1-1 học viên Phạm Đức Anh',
    '16:00': 'Đang họp chuyên môn khối Tiếng Anh',
    '19:30': 'Đang dạy lớp STA-04 (19:00 - 20:30)',
    '20:30': 'Trùng ca test của Vũ Bảo Châu (Flyers)',
  },
  'Robert L.': {
    '09:00': 'Đang dạy lớp IELTS Foundation (08:30 - 10:00)',
    '10:00': 'Đang họp phụ huynh định kỳ',
    '10:30': 'Đang dạy lớp FLY-02 (10:00 - 11:30)',
    '15:00': 'Trùng ca test của Đặng Minh Khôi',
    '16:00': 'Đang dạy lớp Toán Olympic (15:30 - 17:00)',
    '18:30': 'Đang dạy lớp Starters S2 (18:00 - 19:30)',
    '20:00': 'Trùng ca test của Hoàng Thùy Linh',
    '21:00': 'Đang chấm bài thi cuối khóa',
  },
  'Emily W.': {
    '08:00': 'Đang chuẩn bị học liệu đầu giờ',
    '10:00': 'Trùng ca test của Lê Tuấn Kiệt (Starters)',
    '11:00': 'Đang dạy lớp Pre-Starters P1 (10:30 - 12:00)',
    '14:00': 'Đang dạy kèm học viên chuyển tiếp',
    '16:00': 'Trùng ca test của Trần Ngọc Mai',
    '17:00': 'Đang dạy lớp Grammar G1 (16:30 - 18:00)',
    '19:00': 'Đang dạy lớp Movers M3 (18:30 - 20:00)',
    '20:30': 'Đang họp giao ban ca tối',
  },
  'Phạm Văn Giảng Dạy': {
    '08:30': 'Đang dạy lớp Math 1 (08:00 - 09:30)',
    '10:00': 'Trùng ca test của Bùi Anh Khoa',
    '15:30': 'Đang dạy lớp Math 3 (15:00 - 16:30)',
    '16:00': 'Trùng ca test của Chu Hải Đăng',
    '18:00': 'Đang dạy lớp Math 5 (17:30 - 19:00)',
    '20:30': 'Đang bận đào tạo giáo viên mới',
  },
  'Trần Thị Sale': {
    '09:30': 'Đang tư vấn trực tiếp cho phụ huynh tại sảnh',
    '11:00': 'Đang tiếp đoàn học sinh trải nghiệm',
    '14:30': 'Đang gọi điện chăm sóc khách hàng',
    '16:00': 'Đang họp đánh giá chỉ số tuần',
    '18:30': 'Đang đón tiếp phụ huynh ca tối',
    '20:30': 'Đang xử lý hồ sơ nhập học',
  },
  'Thu Hà': {
    '08:30': 'Đang dạy lớp STA-02 (08:00 - 09:30)',
    '10:00': 'Trùng ca test của Ngô Minh Quang',
    '15:00': 'Đang dạy lớp MOV-01 (14:30 - 16:00)',
    '19:00': 'Đang dạy lớp STA-03 (18:30 - 20:00)',
  },
  'Mỹ Linh': {
    '09:00': 'Đang dạy lớp IELTS (08:30 - 10:00)',
    '10:00': 'Trùng ca test của Đỗ Khánh Chi',
    '16:30': 'Đang dạy lớp FLY-01 (16:00 - 17:30)',
    '19:30': 'Đang dạy lớp Grammar G2 (19:00 - 20:30)',
  },
}

export function checkStaffConflict(
  staffName: string,
  dateStr: string,
  slotTime: string,
  currentBookingId?: string,
  extraBookings?: BookingTest[]
): { isConflicted: boolean; conflictType: 'class_session' | 'booking_test' | 'none'; conflictDetail?: string } {
  // 1. Quét Lịch lớp học (Class sessions)
  try {
    const classSessions = getMockClassSessions()
    const matchingClass = classSessions.find((cls) => {
      if (cls.status === 'cancelled') return false
      if (cls.date !== dateStr) return false
      if (cls.teacher !== staffName && cls.substituteTeacher !== staffName) return false

      // Check time overlap: slotTime e.g. 09:00 vs cls.timeLabel (09:00) & cls.endTimeLabel (10:30)
      const slotMin = timeToMinutes(slotTime)
      const classStartMin = timeToMinutes(cls.timeLabel)
      const classEndMin = timeToMinutes(cls.endTimeLabel)

      return slotMin >= classStartMin && slotMin < classEndMin
    })

    if (matchingClass) {
      return {
        isConflicted: true,
        conflictType: 'class_session',
        conflictDetail: `Đang dạy lớp ${matchingClass.className} (${matchingClass.timeLabel}-${matchingClass.endTimeLabel})`,
      }
    }
  } catch {
    // ignore
  }

  // 2. Quét Ca Booking Test khác
  const allBookings = extraBookings && extraBookings.length > 0 ? extraBookings : mockBookingTests
  const matchingBooking = allBookings.find((b) => {
    if (b.id === currentBookingId) return false
    if (b.status === 'cancelled') return false
    if (b.teacher !== staffName && b.tester !== staffName) return false

    // b.testTime is formatted as "YYYY-MM-DD HH:mm" or "YYYY-MM-DDTHH:mm:ss"
    const isSameDate = b.testTime.includes(dateStr)
    const isSameSlot = b.testTime.includes(slotTime)
    return isSameDate && isSameSlot
  })

  if (matchingBooking) {
    return {
      isConflicted: true,
      conflictType: 'booking_test',
      conflictDetail: `Trùng ca test của ${matchingBooking.childName} (${matchingBooking.program})`,
    }
  }

  // 3. Demo Mock Schedule Conflict Matrix
  const staffConflicts = DEMO_SLOT_CONFLICTS[staffName]
  if (staffConflicts && staffConflicts[slotTime]) {
    const detail = staffConflicts[slotTime]
    const type = detail.includes('lớp') ? 'class_session' : 'booking_test'
    return {
      isConflicted: true,
      conflictType: type,
      conflictDetail: detail,
    }
  }

  return { isConflicted: false, conflictType: 'none' }
}

function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0
  const [h, m] = timeStr.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

/**
 * ENGINE TRẢ VỀ DANH SÁCH NHÂN SỰ TRỰC CHO 1 SLOT CỤ THỂ
 */
export function getDutyStaffForSlot(params: {
  school: string
  dateStr: string
  slotTime: string
  currentBookingId?: string
  extraBookings?: BookingTest[]
}): SlotStaffAvailability[] {
  const { school, dateStr, slotTime, currentBookingId, extraBookings } = params
  const dayIndex = getDayIndexFromDateStr(dateStr)
  const section = getSectionFromTime(slotTime)

  // 1. Tìm Master assignment cho branch, day, section
  const assignment = currentMasterRoster.find(
    (item) => item.branch === school && item.dayIndex === dayIndex && item.section === section
  )

  const assignedIds = assignment?.assignedEmployeeIds || []
  const branchEmployees = getDutyEmployeesByBranch(school)

  // Nếu chưa có master assignment cho branch này, lấy fallback 2 nhân sự đầu tiên của cơ sở
  const targetEmployees =
    assignedIds.length > 0
      ? (assignedIds.map(findDutyEmployeeById).filter(Boolean) as DutyEmployee[])
      : branchEmployees.slice(0, 2)

  // 2. Chạy qua Conflict Engine
  return targetEmployees.map((emp) => {
    const conflict = checkStaffConflict(emp.name, dateStr, slotTime, currentBookingId, extraBookings)
    return {
      employee: emp,
      isAvailable: !conflict.isConflicted,
      conflictType: conflict.conflictType,
      conflictDetail: conflict.conflictDetail,
    }
  })
}

/**
 * ENGINE TRẢ VỀ TẤT CẢ CÁC KHUNG GIỜ TEST TRONG NGÀY CÙNG SỐ LƯỢNG NGƯỜI TRỰC RẢNH
 */
export function getDailySlotSummary(params: {
  school: string
  dateStr: string
  currentBookingId?: string
  extraBookings?: BookingTest[]
}): SlotCapacitySummary[] {
  const { school, dateStr, currentBookingId, extraBookings } = params

  return DUTY_SECTIONS.flatMap((sec) =>
    sec.slots.map((slot) => {
      const staffList = getDutyStaffForSlot({
        school,
        dateStr,
        slotTime: slot,
        currentBookingId,
        extraBookings,
      })

      const availableCount = staffList.filter((s) => s.isAvailable).length

      return {
        slot,
        section: sec.id,
        availableCount,
        totalDutyCount: staffList.length,
        staff: staffList,
      }
    })
  )
}

/**
 * AUTO-ASSIGN: Tự động phân bổ nhân sự cố định cho 1 cơ sở dựa trên kho lịch rảnh
 */
export function autoAssignBranchMasterRoster(branch: string): void {
  const branchEmployees = getDutyEmployeesByBranch(branch)
  if (branchEmployees.length === 0) return

  const workRecords = getMockWorkRegistrations()
  const branchRecords = workRecords.filter((r) => r.branch === branch && r.status !== 'draft')

  // Xếp tuần tự 0..6
  WEEKDAYS.forEach((day) => {
    DUTY_SECTIONS.forEach((sec) => {
      // Ưu tiên nhân sự đã tick rảnh ca này trong work registrations
      const candidateIds: string[] = []

      branchEmployees.forEach((emp) => {
        // Tìm xem nhân viên này có rảnh không
        const isRegistered = branchRecords.some(
          (rec) => rec.employeeId === emp.id && rec.slotId.startsWith(sec.id)
        )
        if (isRegistered || candidateIds.length < 2) {
          candidateIds.push(emp.id)
        }
      })

      // Đảm bảo mỗi ca có 2-3 người
      const finalIds = Array.from(new Set(candidateIds)).slice(0, 3)
      if (finalIds.length === 0) {
        finalIds.push(...branchEmployees.slice(0, 2).map((e) => e.id))
      }

      updateMasterShiftRosterSlot(branch, day.index, sec.id, finalIds)
    })
  })
}
