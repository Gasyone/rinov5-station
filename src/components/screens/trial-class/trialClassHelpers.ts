import { getTrialClasses, type TrialClass, type TrialClassStatus } from '@/mocks/trialClasses'
import type { CreateTrialClassForm, StatusTileId } from './trialClassTypes'
import { STATUS_META } from './trialClassConstants'

export function formatTrialDate(dateStr: string): string {
  if (!dateStr) return '—'
  const [date, time] = dateStr.split(' ')
  const parts = date.split('-')
  if (parts.length !== 3) return dateStr
  return `${parts[2]}/${parts[1]}/${parts[0]}${time ? ` ${time}` : ''}`
}

export function countStatus(trials: TrialClass[], id: StatusTileId): number {
  if (id === 'all') return trials.length
  if (id === 'unassigned') return trials.filter((t) => t.sessions.length === 0).length
  return trials.filter((t) => t.status === id).length
}

export function getTrialStatusLabel(status: string) {
  return STATUS_META[status as keyof typeof STATUS_META]?.label ?? status
}

export function getTrialFamilyMembers(trial: TrialClass) {
  if (trial.familyMembers?.length) return trial.familyMembers
  return [{ name: trial.parentName || trial.familyName, phone: trial.familyPhone, isPrimary: true }]
}

export function canAssign(trial: TrialClass): boolean {
  return trial.status === 'pending_confirmation' || trial.status === 'reschedule'
}

export function canRequestReschedule(trial: TrialClass): boolean {
  return trial.status === 'confirmed'
}

export function canCancel(trial: TrialClass): boolean {
  return !['cancelled', 'completed', 'no_show'].includes(trial.status)
}

export type TrialClassUpdater = TrialClass[] | ((current: TrialClass[]) => TrialClass[])

export function readTrialClasses(): { trials: TrialClass[]; error: Error | null } {
  try {
    return { trials: getTrialClasses(), error: null }
  } catch (error) {
    return {
      trials: [],
      error: error instanceof Error ? error : new Error('Không thể tải dữ liệu booking học thử.'),
    }
  }
}

export function buildEmptyCreateForm(): CreateTrialClassForm {
  return {
    studentId: '',
    studentName: '',

    school: '',
    program: '',
    subject: '',
    notes: '',

    selectedSessions: [],
  }
}

export function buildTrialFromCreateForm({
  id,
  form,
  activeBranch,
  branchOptions,
  now,
}: {
  id: string
  form: CreateTrialClassForm
  activeBranch: string
  branchOptions: string[]
  now: string
}): TrialClass {
  return {
    id,
    trialName: form.studentName
      ? `Học thử ${form.program} — ${form.studentName}`
      : `Học thử ${form.program}`,
    customerId: `KH-${Date.now().toString().slice(-6)}`,
    studentName: form.studentName,
    parentName: '',
    familyName: '',
    familyPhone: '',
    attempt: 'Lần 1',
    school: form.school,
    program: form.program,
    subject: form.subject,
    status: form.selectedSessions.length > 0 ? 'confirmed' : 'pending_confirmation',
    creator: 'Người dùng hiện tại',
    owner: 'Chưa gán',
    notes: form.notes,
    sessions: form.selectedSessions.map(s => ({
      classId: s.classId,
      className: s.className,
      sessionId: s.sessionId,
      sessionName: s.sessionName,
      trialDate: s.trialDate,
    })),
    branch: activeBranch === 'all'
      ? form.school
      : branchOptions.find((branch) => form.school.includes(branch)) ?? form.school,
    auditLog: [{ timestamp: now, author: 'Người dùng hiện tại', action: 'Tạo booking' }],
  }
}

export function applyTrialAssignment(
  trial: TrialClass,
  assignment: {
    sessions: import('./trialClassTypes').TrialSessionSelection[]
    notes: string
    now: string
  }
): TrialClass {
  return {
    ...trial,
    sessions: assignment.sessions,
    status: 'confirmed' as TrialClassStatus,
    notes: assignment.notes || trial.notes,
    auditLog: [
      ...trial.auditLog,
      {
        timestamp: assignment.now,
        author: 'Người dùng hiện tại',
        action: 'Ghép lớp',
        detail: `Đã chọn ${assignment.sessions.length} buổi học`,
      },
    ],
  }
}

export function applyTrialReschedule(
  trial: TrialClass,
  reason: string,
  notes: string,
  now: string
): TrialClass {
  const oldSession = trial.sessions.length > 0 ? trial.sessions[0] : undefined

  return {
    ...trial,
    sessions: [],
    status: 'reschedule' as TrialClassStatus,
    previousSession: oldSession,
    cancelReason: reason,
    notes: notes || trial.notes,
    auditLog: [
      ...trial.auditLog,
      { timestamp: now, author: 'Người dùng hiện tại', action: 'Yêu cầu đổi lịch', detail: reason },
      oldSession
        ? { timestamp: now, author: 'Hệ thống', action: 'Giải phóng lớp cũ', detail: `${oldSession.className} — ${trial.sessions.length} buổi` }
        : null,
    ].filter(Boolean) as TrialClass['auditLog'],
  }
}

export function filterTrialClasses(
  trials: TrialClass[],
  search: string,
  activeBranch: string,
  activeStatus: StatusTileId,
  filters: { programs: string[]; creators: string[] }
): TrialClass[] {
  return trials.filter((trial) => {
    if (activeBranch !== 'all' && trial.branch !== activeBranch) return false
    if (activeStatus === 'unassigned' && trial.sessions.length > 0) return false
    if (activeStatus !== 'all' && activeStatus !== 'unassigned' && trial.status !== activeStatus) return false
    if (filters.programs.length > 0 && !filters.programs.includes(trial.program)) return false
    if (filters.creators.length > 0 && !filters.creators.includes(trial.creator)) return false
    if (search) {
      const q = search.toLowerCase()
      const haystack = [
        trial.id,
        trial.trialName,
        trial.studentName,
        trial.customerId,
        trial.familyPhone,
        trial.program,
      ].join(' ').toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
}

export function maskPhone(phone: string): string {
  if (phone.length <= 4) return phone
  return phone.slice(0, 4) + '****' + phone.slice(-2)
}
