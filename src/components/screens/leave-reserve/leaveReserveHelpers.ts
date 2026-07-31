import type { LeaveReserveRequest } from '@/mocks/leaveReserve'

export const SUBJECT_OPTIONS = [
  { value: 'all', label: 'Tất cả môn' },
  { value: 'english', label: 'Tiếng Anh' },
  { value: 'math', label: 'Toán học' },
  { value: 'stem', label: 'STEM' },
  { value: 'japanese', label: 'Tiếng Nhật' },
]

export function getRequestSubject(r: LeaveReserveRequest): string {
  const name = (r.className || '').toLowerCase()
  const pkg = (r.productPackage || '').toLowerCase()
  const code = (r.classCode || '').toLowerCase()
  if (
    name.includes('ielts') ||
    name.includes('toeic') ||
    name.includes('tiếng anh') ||
    name.includes('eng') ||
    pkg.includes('giao tiếp')
  ) {
    return 'english'
  }
  if (name.includes('stem') || pkg.includes('stem') || code.includes('stem')) {
    return 'stem'
  }
  if (name.includes('toán') || name.includes('math') || pkg.includes('toán')) {
    return 'math'
  }
  if (name.includes('nhật') || name.includes('jpn') || pkg.includes('nhật')) {
    return 'japanese'
  }
  return 'other'
}
