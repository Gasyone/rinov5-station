import type { ClassSession } from '@/mocks/classSessions'
import type { SessionGroup } from './classSessionTypes'

export function groupSessionsByClass(sessions: ClassSession[]): SessionGroup[] {
  const map = new Map<string, SessionGroup>()
  for (const s of sessions) {
    if (!map.has(s.classId)) {
      map.set(s.classId, {
        classId: s.classId,
        className: s.className,
        classCode: s.classCode,
        teacher: s.teacher,
        branch: s.branch,
        sessions: [],
      })
    }
    map.get(s.classId)!.sessions.push(s)
  }

  return Array.from(map.values())
    .map((g) => ({
      ...g,
      sessions: [...g.sessions].sort((a, b) => a.date.localeCompare(b.date)),
    }))
    .sort((a, b) => a.className.localeCompare(b.className))
}

export function getAttendanceRate(session: ClassSession): number {
  if (session.total === 0) return 0
  return Math.round((session.attended / session.total) * 100)
}

export function getAttendanceLabel(session: ClassSession): string {
  return `${session.attended}/${session.total}`
}

export function isSubstitute(session: ClassSession): boolean {
  return !!session.substituteTeacher && session.substituteTeacher !== session.teacher
}

export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}
