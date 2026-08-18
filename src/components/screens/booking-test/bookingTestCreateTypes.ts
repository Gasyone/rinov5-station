import type { BookingSubject } from '@/mocks/bookingTests'

export interface TeacherAvatarItem {
  id: string
  name: string
  shortName: string
  role?: 'Giáo viên' | 'CS' | 'Khác'
  colorClass?: string
}

export const PROGRAM_CONFIG: Record<
  string,
  { subject: BookingSubject; levels: string[] }
> = {
  'Chương trình Station': {
    subject: 'english',
    levels: [
      'Pre-Starters (<=6)',
      'Starters (>6 và <=8)',
      'Mover (>8 và <=10)',
      'Flyers (>10)',
    ],
  },
  'Chương trình Toán tư duy': {
    subject: 'math',
    levels: ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5', 'Lớp 6', 'Lớp 7'],
  },
  'Chương trình Station Grammar': {
    subject: 'english',
    levels: ['Level 0-1', 'Level 2', 'Level 3', 'Level 4'],
  },
}

export const TIME_GROUPS = [
  {
    title: 'Buổi sáng',
    icon: '☀️',
    slots: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
  },
  {
    title: 'Buổi chiều',
    icon: '🌤',
    slots: ['13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
  },
  {
    title: 'Buổi tối',
    icon: '🌙',
    slots: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'],
  },
]

export const TIME_SLOTS = TIME_GROUPS.flatMap((g) => g.slots)

export const MOCK_TEACHERS: TeacherAvatarItem[] = [
  { id: 't1', name: 'Sarah J.', shortName: 'SJ', role: 'Giáo viên', colorClass: 'bg-indigo-600 text-white' },
  { id: 't2', name: 'Robert L.', shortName: 'RL', role: 'Giáo viên', colorClass: 'bg-blue-600 text-white' },
  { id: 't3', name: 'Emily W.', shortName: 'EW', role: 'Giáo viên', colorClass: 'bg-sky-600 text-white' },
  { id: 't4', name: 'Phạm Văn Giang', shortName: 'PG', role: 'CS', colorClass: 'bg-amber-600 text-white' },
  { id: 't5', name: 'Trần Thị Mai', shortName: 'TM', role: 'CS', colorClass: 'bg-orange-600 text-white' },
  { id: 't6', name: 'Đỗ Thị Part-time', shortName: 'ĐỔ', role: 'Khác', colorClass: 'bg-slate-600 text-white' },
]

export function getSlotTimeRange(startSlot: string, durationMinutes = 30): string {
  if (!startSlot) return ''
  const [hStr, mStr] = startSlot.split(':')
  const startMin = parseInt(hStr, 10) * 60 + parseInt(mStr, 10)
  const endMin = startMin + durationMinutes
  const endH = Math.floor(endMin / 60)
  const endM = endMin % 60
  const endSlot = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
  return `${startSlot} - ${endSlot}`
}
