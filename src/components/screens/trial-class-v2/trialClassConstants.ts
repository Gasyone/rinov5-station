import type { StatusConfigItem } from './trialClassTypes'

export const STATUS_CONFIG: StatusConfigItem[] = [
  { id: 'pending_approval', label: 'Chờ xác nhận', status: 'pending_approval' },
  { id: 'rejected', label: 'Từ chối ghép', status: 'rejected' },
  { id: 'reschedule', label: 'Cần đổi lịch', status: 'reschedule' },
  { id: 'confirmed', label: 'Đã ghép lớp', status: 'confirmed' },
  { id: 'no_show', label: 'Không đến', status: 'no_show' },
  { id: 'completed', label: 'Hoàn thành', status: 'completed' },
  { id: 'cancelled', label: 'Đã hủy', status: 'cancelled' },
]

export const STATUS_META = Object.fromEntries(
  STATUS_CONFIG.map((status) => [status.id, status])
) as Record<StatusConfigItem['id'], StatusConfigItem>

export const VIRTUAL_TILE_ID = 'unassigned'

export const PROGRAM_OPTIONS = [
  'Cambridge Starter',
  'Cambridge Movers',
  'Cambridge Flyers',
  'English Foundation',
  'Communication Kids',
  'Communication Junior',
  'IELTS Junior',
  'IELTS Prep',
  'Math Thinking',
  'Phonics',
  'STEM Robotics',
  'STEM Coding',
]

export const SUBJECT_MAP: Record<string, string> = {
  'Cambridge Starter': 'Tiếng Anh',
  'Cambridge Movers': 'Tiếng Anh',
  'Cambridge Flyers': 'Tiếng Anh',
  'English Foundation': 'Tiếng Anh',
  'Communication Kids': 'Tiếng Anh',
  'Communication Junior': 'Tiếng Anh',
  'IELTS Junior': 'Tiếng Anh',
  'IELTS Prep': 'Tiếng Anh',
  'Phonics': 'Tiếng Anh',
  'Math Thinking': 'Toán',
  'STEM Robotics': 'STEM',
  'STEM Coding': 'STEM',
}

export const CANCEL_REASONS = [
  'Khách bận',
  'Đã chốt sale sớm',
  'Trung tâm hủy',
  'GV nghỉ đột xuất',
  'Khác',
]

export const RESCHEDULE_REASONS = [
  'Khách báo bận',
  'Khách xin đổi ngày',
  'GV nghỉ đột xuất',
  'Lớp đầy, cần chuyển',
  'Lý do khác',
]



export interface MockClassOption {
  classId: string
  className: string
  teacher: string
  program: string
  schedule: string
  enrolledStudents: number
  maxStudents: number
  classType: string
}

export const MOCK_CLASS_OPTIONS: MockClassOption[] = [
  { classId: 'CLS-001', className: 'Cambridge Starter A1', teacher: 'Ms. Sarah', program: 'Cambridge Starter', schedule: 'T3/T5/CN 18:00', enrolledStudents: 12, maxStudents: 15, classType: 'Lớp chính thức' },
  { classId: 'CLS-002', className: 'STEM Robotics S1', teacher: 'Mr. David', program: 'STEM Robotics', schedule: 'T4/T7 19:30', enrolledStudents: 8, maxStudents: 12, classType: 'Lớp Workshop' },
  { classId: 'CLS-003', className: 'English Foundation A1', teacher: 'Ms. Emily', program: 'English Foundation', schedule: 'T3/T5 17:15', enrolledStudents: 10, maxStudents: 15, classType: 'Lớp chính thức' },
  { classId: 'CLS-004', className: 'Math Thinking M1', teacher: 'Mr. Robert', program: 'Math Thinking', schedule: 'T4/T6 18:45', enrolledStudents: 11, maxStudents: 15, classType: 'Lớp chính thức' },
  { classId: 'CLS-005', className: 'IELTS Junior J1', teacher: 'Ms. Anna', program: 'IELTS Junior', schedule: 'T3/T5 09:00', enrolledStudents: 10, maxStudents: 12, classType: 'Lớp chính thức' },
  { classId: 'CLS-007', className: 'Phonics P2', teacher: 'Ms. Emily', program: 'Phonics', schedule: 'T4/CN 17:30', enrolledStudents: 10, maxStudents: 15, classType: 'Lớp Workshop' },
  { classId: 'CLS-009', className: 'Communication Kids C1', teacher: 'Ms. Anna', program: 'Communication Kids', schedule: 'T2/T4 18:00', enrolledStudents: 8, maxStudents: 15, classType: 'Lớp chính thức' },
  { classId: 'CLS-010', className: 'STEM Coding C1', teacher: 'Mr. David', program: 'STEM Coding', schedule: 'T4/T7 19:15', enrolledStudents: 10, maxStudents: 12, classType: 'Lớp chính thức' },
  { classId: 'CLS-011', className: 'Cambridge Flyers F1', teacher: 'Ms. Sarah', program: 'Cambridge Flyers', schedule: 'T5/CN 18:30', enrolledStudents: 9, maxStudents: 15, classType: 'Lớp Workshop' },
  { classId: 'CLS-014', className: 'Math Thinking M3', teacher: 'Mr. Robert', program: 'Math Thinking', schedule: 'T3/T7 09:30', enrolledStudents: 8, maxStudents: 15, classType: 'Lớp chính thức' },
  { classId: 'CLS-015', className: 'IELTS Prep IP1', teacher: 'Ms. Anna', program: 'IELTS Prep', schedule: 'T2/T4 17:45', enrolledStudents: 10, maxStudents: 12, classType: 'Lớp Workshop' },
  { classId: 'CLS-016', className: 'STEM Robotics S2', teacher: 'Mr. David', program: 'STEM Robotics', schedule: 'T3/T6 10:00', enrolledStudents: 8, maxStudents: 12, classType: 'Lớp chính thức' },
  { classId: 'CLS-019', className: 'Communication Junior J2', teacher: 'Ms. Anna', program: 'Communication Junior', schedule: 'T5/CN 18:30', enrolledStudents: 9, maxStudents: 15, classType: 'Lớp chính thức' },
]
