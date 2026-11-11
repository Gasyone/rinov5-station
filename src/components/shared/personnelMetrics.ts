import { mockClasses } from '@/mocks/classes'
import type { PersonnelItem } from './PersonnelCell'

export interface PersonnelOperationalMetrics {
  isTeacher: boolean
  // 1. Vận hành & Chăm sóc
  operations: {
    activeClassesCount?: number
    activeClassesText?: string
    nextScheduleText?: string
    caredStudentsText: string
    caredStudentsCount: number
    pendingFollowUpCount?: number
    shiftLabel?: string
  }
  // 2. Chất lượng & QC
  quality: {
    qualityScore: number
    qcErrorsMonth: number
    qcErrorsAllTime: number
    complianceRate: number
  }
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function isTeacherRole(role?: string, name?: string): boolean {
  const haystack = `${role || ''} ${name || ''}`.toLowerCase()
  if (haystack.includes('trợ giảng') || haystack.includes('teaching assistant')) return true
  return ['giáo viên', 'teacher', 'tutor', 'academic', 'ielts', 'native'].some((k) =>
    haystack.includes(k)
  )
}

export function getPersonnelOperationalMetrics(person: PersonnelItem): PersonnelOperationalMetrics {
  const isTeacher = isTeacherRole(person.role, person.name)
  const hash = hashString(person.name || 'personnel')

  // 1. Vận hành & Chăm sóc
  if (isTeacher) {
    const matchedClasses = mockClasses.filter((c) =>
      c.teacher.toLowerCase().includes((person.name || '').toLowerCase())
    )

    let activeClassesCount = matchedClasses.length
    let activeClassesText = matchedClasses.map((c) => c.name).join(', ')
    let nextScheduleText = matchedClasses[0]?.schedule
      ? `${matchedClasses[0].schedule} (${matchedClasses[0].room})`
      : ''
    let caredCount = matchedClasses.reduce((acc, c) => acc + (c.enrolledStudents || 0), 0)

    if (activeClassesCount === 0) {
      // Deterministic realistic fallback for teachers not explicitly in mockClasses
      const fallbackClassList = [
        ['IELTS Foundation', 'Pre-IELTS'],
        ['Native Talk K1', 'Kids English 2'],
        ['TOEIC B1', 'Giao tiếp Pro'],
        ['IELTS Junior 3', 'Grammar Plus'],
      ]
      const chosen = fallbackClassList[hash % fallbackClassList.length]
      activeClassesCount = chosen.length
      activeClassesText = chosen.join(', ')
      const days = ['T2, 09/11', 'T3, 10/11', 'T4, 11/11', 'T5, 12/11', 'T6, 13/11']
      const times = ['18:00', '19:30', '17:30', '20:00']
      const rooms = ['A101', 'B202', 'C301', 'D402']
      nextScheduleText = `${days[hash % days.length]} • ${times[hash % times.length]} (${rooms[hash % rooms.length]})`
      caredCount = 24 + (hash % 16)
    }

    // 2. Chất lượng & QC (Giáo viên cũng có điểm chất lượng và lỗi QC)
    const qualityScore = Number((4.6 + (hash % 4) * 0.1).toFixed(1))
    const qcErrorsMonth = hash % 4 === 0 ? 1 : 0
    const qcErrorsAllTime = qcErrorsMonth + (hash % 3)
    const complianceRate = 97 + (hash % 4)

    return {
      isTeacher: true,
      operations: {
        activeClassesCount,
        activeClassesText,
        nextScheduleText,
        caredStudentsCount: caredCount,
        caredStudentsText: `${caredCount} học viên (${activeClassesCount} lớp đang dạy)`,
      },
      quality: {
        qualityScore,
        qcErrorsMonth,
        qcErrorsAllTime,
        complianceRate,
      },
    }
  }

  // Non-teacher: CS / Vận hành / Tuyển sinh
  const caredQuota = 50
  const caredCount = 35 + (hash % 15)
  const quotaPercent = Math.round((caredCount / caredQuota) * 100)
  const pendingFollowUp = 1 + (hash % 4)
  const shifts = ['Sáng T2 (8:30 - 12:00)', 'Chiều T3 (13:30 - 17:30)', 'Sáng T4 (8:30 - 12:00)', 'Cả ngày T5']
  const shiftLabel = shifts[hash % shifts.length]

  const qualityScore = Number((4.7 + (hash % 3) * 0.1).toFixed(1))
  const qcErrorsMonth = hash % 5 === 0 ? 1 : 0
  const qcErrorsAllTime = qcErrorsMonth + (hash % 2)
  const complianceRate = 98 + (hash % 3)

  return {
    isTeacher: false,
    operations: {
      caredStudentsCount: caredCount,
      caredStudentsText: `${caredCount} / ${caredQuota} HV (${quotaPercent}% quota)`,
      pendingFollowUpCount: pendingFollowUp,
      shiftLabel,
    },
    quality: {
      qualityScore,
      qcErrorsMonth,
      qcErrorsAllTime,
      complianceRate,
    },
  }
}
