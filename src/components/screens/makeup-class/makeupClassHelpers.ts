import { getMakeupClasses, type MakeupClassRequest } from '@/mocks/makeupClasses'
export type { MakeupClassRequest }
import type { MakeupStatusTileId, MakeupClassFilterState } from './makeupClassTypes'
import { MAKEUP_STATUS_META } from './makeupClassConstants'

export function formatMakeupDate(dateStr: string): string {
  if (!dateStr) return '—'
  const [date, time] = dateStr.split(' ')
  const parts = date.split('-')
  if (parts.length !== 3) return dateStr
  return `${parts[2]}/${parts[1]}/${parts[0]}${time ? ` ${time}` : ''}`
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '—'
  const [date] = dateStr.split(' ')
  const parts = date.split('-')
  if (parts.length !== 3) return '—'
  return `${parts[2]}/${parts[1]}`
}

export function formatTimeOnly(dateStr: string): string {
  if (!dateStr) return '—'
  const parts = dateStr.split(' ')
  return parts[1] ?? '—'
}

const WEEKDAYS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

export function getWeekday(dateStr: string): string {
  if (!dateStr) return ''
  const [datePart] = dateStr.split(' ')
  const d = new Date(datePart)
  if (isNaN(d.getTime())) return ''
  return WEEKDAYS_VI[d.getDay()] ?? ''
}

export function getEndTime(startTimeStr: string): string {
  if (!startTimeStr) return ''
  const [hStr, mStr] = startTimeStr.split(':')
  if (!hStr || !mStr) return ''
  let h = parseInt(hStr, 10)
  let m = parseInt(mStr, 10) + 90
  h += Math.floor(m / 60)
  m = m % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatDateWithWeekday(dateStr: string): string {
  if (!dateStr) return '—'
  const weekday = getWeekday(dateStr)
  const time = formatTimeOnly(dateStr)
  const dateShort = formatDateShort(dateStr)
  return `${weekday} ${dateShort} · ${time}`
}

export function formatSessionDateTimeRange(dateStr: string): string {
  if (!dateStr) return '—'
  const weekday = getWeekday(dateStr)
  const dateShort = formatDateShort(dateStr)
  const startTime = formatTimeOnly(dateStr)
  const endTime = getEndTime(startTime)
  const timeRange = endTime ? `${startTime} - ${endTime}` : startTime
  return `${weekday} ${dateShort} · ${timeRange}`
}

export function countStatus(requests: MakeupClassRequest[], id: string): number {
  if (id === 'all') return requests.length
  return requests.filter((r) => r.status === id).length
}

export function getMakeupStatusLabel(status: string): string {
  return MAKEUP_STATUS_META[status as keyof typeof MAKEUP_STATUS_META]?.label ?? status
}

export function maskPhone(phone: string): string {
  if (phone.length <= 4) return phone
  return phone.slice(0, 4) + '****' + phone.slice(-2)
}

export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
}

export type MakeupClassUpdater = MakeupClassRequest[] | ((current: MakeupClassRequest[]) => MakeupClassRequest[])

export function readMakeupClasses(): { requests: MakeupClassRequest[]; error: Error | null } {
  try {
    return { requests: getMakeupClasses(), error: null }
  } catch (error) {
    return {
      requests: [],
      error: error instanceof Error ? error : new Error('Không thể tải dữ liệu phiếu học bù.'),
    }
  }
}

export function filterMakeupClasses(
  requests: MakeupClassRequest[],
  search: string,
  activeBranch: string,
  activeStatus: MakeupStatusTileId,
  filters: MakeupClassFilterState,
  activeSubject?: string,
  activeResultFilter?: import('./makeupClassTypes').MakeupResultFilterId
): MakeupClassRequest[] {
  return requests.filter((req) => {
    if (activeBranch !== 'all' && req.branch !== activeBranch) return false
    // Lifecycle tile filter
    if (activeStatus !== 'all' && req.status !== activeStatus) return false
    // Result chip filter
    if (activeResultFilter && activeResultFilter !== 'all' && req.status !== activeResultFilter) return false
    if (activeSubject && activeSubject !== 'all') {
      const s = req.subject.toLowerCase()
      if (activeSubject === 'english' && !s.includes('anh')) return false
      if (activeSubject === 'math' && !s.includes('toán')) return false
      if (activeSubject === 'stem' && !s.includes('stem')) return false
    }
    if (filters.programs.length > 0 && !filters.programs.includes(req.program)) return false
    if (filters.creators.length > 0 && !filters.creators.includes(req.creator)) return false
    if (filters.subjects.length > 0 && !filters.subjects.includes(req.subject)) return false
    if (filters.owners.length > 0 && !filters.owners.includes(req.owner)) return false
    if (filters.statuses.length > 0 && !filters.statuses.includes(req.status)) return false
    if (filters.schools.length > 0 && !filters.schools.includes(req.school)) return false
    if (search) {
      const q = search.toLowerCase()
      const haystack = [
        req.id,
        req.studentName,
        req.customerId,
        req.familyPhone,
        req.program,
        req.originalClassName,
        req.makeupClassName ?? '',
      ].join(' ').toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

/** Check if the makeup request expiry is approaching (within 7 days) */
export function isExpiryApproaching(expiryDate: string): boolean {
  const expiry = new Date(expiryDate)
  const now = new Date()
  const diff = expiry.getTime() - now.getTime()
  const days = diff / (1000 * 60 * 60 * 24)
  return days >= 0 && days <= 7
}

/** Check if the makeup request has expired */
export function isExpired(expiryDate: string): boolean {
  return new Date(expiryDate) < new Date()
}

/** Get unified attendance status text */
export function getAttendanceStatusText(req: MakeupClassRequest): string {
  if (req.attendanceStatus) return req.attendanceStatus
  if (req.status === 'completed') return 'Có mặt'
  if (req.status === 'da_vang') return 'Vắng mặt'
  return 'Chưa điểm danh'
}

