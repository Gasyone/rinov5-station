import type { QcIncident, QcEvaluationCriteria } from '@/mocks/qcChecks'
import {
  QC_CRITERIA_TAG_META,
  type QcTagCriteriaMeta,
  type QcPersonnelGroup,
  type QcLatestRemediationInfo,
  type QcPersonnelProfile,
} from './qcPersonnelTypes'
import { isIncidentOverdue } from './qcCheckTypes'
import { isToday as checkIsToday } from './qcCheckHelpers'
import { getStatusColors } from '@/lib/statusColors'

export function getPersonnelProfile(cleanName: string, targetGroup?: string): QcPersonnelProfile {
  if (cleanName.includes('Trần Hồng Thiệp')) {
    return {
      code: 'GV-0018',
      phone: '0982 112 334',
      email: 'thiep.th@rinoedu.vn',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      department: 'Tổ Giáo viên Toán Tư Duy',
      directManager: 'Trưởng bộ môn Toán',
      position: 'Giáo viên Toán',
      subject: 'Toán tư duy',
      branches: ['Linh Đàm'],
    }
  }
  if (cleanName.includes('Đỗ Bảo Ngọc')) {
    return {
      code: 'GV-0021',
      phone: '0975 223 445',
      email: 'ngoc.db@rinoedu.vn',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      department: 'Tổ Giáo viên Toán Tư Duy',
      directManager: 'Trưởng bộ môn Toán',
      position: 'Giáo viên Toán',
      subject: 'Toán tư duy',
      branches: ['Linh Đàm'],
    }
  }
  if (cleanName.includes('Trúc Anh')) {
    return {
      code: 'TA-0005',
      phone: '0963 334 556',
      email: 'trucanh.ta@rinoedu.vn',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      department: 'Đội ngũ Trợ giảng Cơ sở',
      directManager: 'Quản lý vận hành Tonkin',
      position: 'Trợ giảng (TA)',
      subject: 'Toán tư duy',
      branches: ['Tonkin'],
    }
  }
  if (cleanName.includes('FATIH KESKIN')) {
    return {
      code: 'GV-NN-003',
      phone: '0901 998 877',
      email: 'fatih.keskin@rinoedu.vn',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      department: 'Tổ Giáo viên Bản ngữ',
      directManager: 'Giám đốc Học thuật',
      position: 'Giáo viên Bản ngữ (Foreign Teacher)',
      subject: 'Tiếng Anh',
      branches: ['Vin SA1', 'Linh Đàm'],
    }
  }
  if (cleanName.includes('Roman')) {
    return {
      code: 'GV-NN-005',
      phone: '0903 887 766',
      email: 'roman.teacher@rinoedu.vn',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      department: 'Tổ Giáo viên Bản ngữ',
      directManager: 'Giám đốc Học thuật',
      position: 'Giáo viên Kindie Bản ngữ',
      subject: 'Kindie',
      branches: ['170 Nguyễn Tuân'],
    }
  }
  if (cleanName.includes('Maria')) {
    return {
      code: 'GV-NN-008',
      phone: '0905 776 655',
      email: 'maria.teacher@rinoedu.vn',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      department: 'Tổ Giáo viên Bản ngữ',
      directManager: 'Giám đốc Học thuật',
      position: 'Giáo viên Kindie',
      subject: 'Kindie',
      branches: ['Vin SA1'],
    }
  }
  if (cleanName.includes('Newway')) {
    return {
      code: 'DT-NW-01',
      phone: '0912 999 888',
      email: 'contact@newway-edu.vn',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150',
      department: 'Đối tác Cung ứng Giáo viên Newway',
      directManager: 'Trưởng ban Quản lý Đối tác',
      position: 'Giáo viên Đối tác',
      subject: 'Tiếng Anh',
      branches: ['Tonkin', 'Vin SA1'],
    }
  }
  if (cleanName.includes('QuangBD')) {
    return {
      code: 'KT-0012',
      phone: '0934 112 233',
      email: 'quang.bd@rinoedu.vn',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      department: 'Bộ phận Quản trị CSVC & Kỹ thuật',
      directManager: 'Giám đốc Chi nhánh Tonkin',
      position: 'Kỹ thuật viên CSVC',
      branches: ['Tonkin'],
    }
  }
  if (cleanName.includes('VanLT4')) {
    return {
      code: 'KT-0014',
      phone: '0945 223 344',
      email: 'van.lt4@rinoedu.vn',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      department: 'Bộ phận Quản lý Cơ sở',
      directManager: 'Giám đốc Chi nhánh Nguyễn Tuân',
      position: 'Quản lý Cơ sở',
      branches: ['170 Nguyễn Tuân'],
    }
  }
  if (cleanName.includes('ChiTTK3')) {
    return {
      code: 'CS-0033',
      phone: '0967 334 455',
      email: 'chi.ttk3@rinoedu.vn',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      department: 'Bộ phận Chăm sóc Khách hàng & Lễ tân',
      directManager: 'Trưởng nhóm CSM',
      position: 'Chuyên viên CS / Lễ tân',
      branches: ['170 Nguyễn Tuân'],
    }
  }
  if (cleanName.includes('HauTB')) {
    return {
      code: 'SL-0082',
      phone: '0978 445 566',
      email: 'hau.tb@rinoedu.vn',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      department: 'Bộ phận Tuyển sinh (Sale)',
      directManager: 'Trưởng nhóm Tuyển sinh',
      position: 'Chuyên viên Tư vấn Tuyển sinh',
      branches: ['170 Nguyễn Tuân'],
    }
  }
  if (cleanName.includes('ThuyPT9')) {
    return {
      code: 'SL-0099',
      phone: '0989 556 677',
      email: 'thuy.pt9@rinoedu.vn',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      department: 'Bộ phận Tuyển sinh (Sale)',
      directManager: 'Trưởng nhóm Tuyển sinh',
      position: 'Chuyên viên Tư vấn Tuyển sinh',
      branches: ['Tonkin', 'KDV'],
    }
  }
  if (cleanName.includes('MaiNTN6')) {
    return {
      code: 'SL-0066',
      phone: '0912 667 788',
      email: 'mai.ntn6@rinoedu.vn',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      department: 'Bộ phận Tuyển sinh (Sale)',
      directManager: 'Trưởng nhóm Tuyển sinh',
      position: 'Chuyên viên Tư vấn Tuyển sinh',
      branches: ['KDV'],
    }
  }
  if (cleanName.includes('HongPT')) {
    return {
      code: 'SL-0022',
      phone: '0923 778 899',
      email: 'hong.pt@rinoedu.vn',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      department: 'Bộ phận Tuyển sinh (Sale)',
      directManager: 'Trưởng nhóm Tuyển sinh',
      position: 'Chuyên viên Tư vấn Tuyển sinh',
      branches: ['Linh Đàm'],
    }
  }

  const prefix = targetGroup === 'teacher' ? 'GV' : targetGroup === 'facility' ? 'KT' : 'CS'
  return {
    code: `${prefix}-0099`,
    phone: '0912 888 999',
    email: 'personnel@rinoedu.vn',
    department: 'Cơ sở chi nhánh',
    directManager: 'Quản lý phụ trách',
    position: targetGroup === 'teacher' ? 'Giáo viên' : targetGroup === 'facility' ? 'Kỹ thuật viên CSVC' : 'Chuyên viên Vận hành / Sale',
    subject: targetGroup === 'teacher' ? 'Tiếng Anh' : undefined,
    branches: ['170 Nguyễn Tuân', 'Linh Đàm', 'Vin SA1', 'Tonkin', 'KDV'],
  }
}

const AVATAR_COLORS = [
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
  'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
  'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300',
]

function stableHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function getAvatarColor(idOrName: string): string {
  if (!idOrName) return AVATAR_COLORS[0]
  return AVATAR_COLORS[stableHash(idOrName) % AVATAR_COLORS.length]
}

export function getInitials(name: string): string {
  if (!name) return 'NS'
  const clean = name.replace(/^(Thầy|Cô|GV|KTV|Đ\/c)\s+/i, '').trim()
  const parts = clean.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'NS'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function formatStaffName(name?: string): string {
  if (!name) return 'Chưa phân công'
  let clean = name.replace(/^(Thầy|Cô)\s+/i, '').trim()
  clean = clean.replace(/\s*\([^)]*\)$/, '').trim()
  return clean || name
}

export function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return ''
  const parsed = new Date(dateStr)
  if (isNaN(parsed.getTime())) return dateStr

  // Base simulation reference date (matches 2026-10-16 in mock timeline)
  const baseDate = new Date('2026-10-16T12:00:00')
  const diffMs = baseDate.getTime() - parsed.getTime()
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))

  if (diffHours <= 0) return 'Vừa xong'
  if (diffHours < 24) return `${diffHours} giờ trước`
  const diffDays = Math.round(diffHours / 24)
  if (diffDays === 1) return 'Hôm qua'
  if (diffDays < 7) return `${diffDays} ngày trước`
  return `${parsed.getDate().toString().padStart(2, '0')}/${(parsed.getMonth() + 1).toString().padStart(2, '0')}/${parsed.getFullYear()}`
}

export function getCriteriaTagMeta(criteria: QcEvaluationCriteria): QcTagCriteriaMeta {
  return (
    QC_CRITERIA_TAG_META[criteria] || {
      abbrev: 'QC',
      label: 'Sự cố',
      fullLabel: 'QC - Sự cố kiểm tra chất lượng',
    }
  )
}

export function getTagStyle(incident: QcIncident): {
  badgeClass: string
  isCompleted: boolean
  isPendingReview: boolean
  isOverdue: boolean
} {
  const isCompleted = incident.status === 'closed'
  const isPendingReview = incident.status === 'corrected'
  const isOverdue = !isCompleted && isIncidentOverdue(incident)

  if (isCompleted) {
    return {
      badgeClass:
        'border-zinc-200 bg-zinc-100/80 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-500',
      isCompleted: true,
      isPendingReview: false,
      isOverdue: false,
    }
  }

  if (isPendingReview) {
    return {
      badgeClass: getStatusColors('warning').badge,
      isCompleted: false,
      isPendingReview: true,
      isOverdue: false,
    }
  }

  if (incident.severity === 'critical') {
    return {
      badgeClass: getStatusColors('error').badge,
      isCompleted: false,
      isPendingReview: false,
      isOverdue,
    }
  }

  if (incident.severity === 'high') {
    return {
      badgeClass: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-300',
      isCompleted: false,
      isPendingReview: false,
      isOverdue,
    }
  }

  if (incident.severity === 'medium') {
    return {
      badgeClass: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
      isCompleted: false,
      isPendingReview: false,
      isOverdue,
    }
  }

  return {
    badgeClass: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300',
    isCompleted: false,
    isPendingReview: false,
    isOverdue,
  }
}

/**
 * Extracts latest remediation note or round from an incident
 */
function extractLatestRemediation(incident: QcIncident): QcLatestRemediationInfo | undefined {
  if (incident.remediationRounds && incident.remediationRounds.length > 0) {
    const sortedRounds = [...incident.remediationRounds].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
    const latest = sortedRounds[0]
    return {
      action: latest.action,
      submittedAt: latest.submittedAt,
      submittedBy: latest.submittedBy,
      relativeTimeText: formatRelativeTime(latest.submittedAt),
      status: incident.status,
      reviewStatus: latest.reviewStatus,
    }
  }

  if (incident.correctiveAction) {
    return {
      action: incident.correctiveAction,
      submittedAt: incident.completionDate || incident.createdAt,
      submittedBy: incident.assignee,
      relativeTimeText: formatRelativeTime(incident.completionDate || incident.createdAt),
      status: incident.status,
    }
  }

  return undefined
}

/**
 * Groups flat incidents into personnel-centric rows matching Care Screen architecture.
 */
export function groupIncidentsByPersonnel(incidents: QcIncident[]): QcPersonnelGroup[] {
  const groupMap = new Map<string, QcPersonnelGroup>()

  incidents.forEach((inc) => {
    // 1. Determine Personnel identity
    let rawName = inc.assignee
    let role = 'Nhân sự'

    if (inc.targetGroup === 'teacher') {
      rawName = inc.teacherName || inc.assignee
      if (rawName.includes('Trúc Anh') || rawName.includes('Trợ giảng') || rawName.includes('TA')) {
        role = 'Trợ giảng (TA)'
      } else if (inc.subject) {
        role = `Giáo viên ${inc.subject}`
      } else {
        role = 'Giáo viên'
      }
    } else if (inc.targetGroup === 'facility') {
      rawName = inc.assignee || 'Kỹ thuật & CSVC'
      role = 'Kỹ thuật & Quản trị CSVC'
    } else if (inc.targetGroup === 'operations') {
      rawName = inc.csmName || inc.assignee || 'Chuyên viên CS / Sale'
      if (rawName.includes('Lễ tân') || rawName.includes('ChiTTK3')) {
        role = 'Lễ tân & CS'
      } else {
        role = 'Chuyên viên Sale / CS'
      }
    }

    const cleanName = formatStaffName(rawName)
    const groupKey = `${cleanName}__${inc.branch}`

    if (!groupMap.has(groupKey)) {
      // Determine primary location
      const subContextParts: string[] = []
      if (inc.roomId) subContextParts.push(inc.roomId)
      if (inc.className) subContextParts.push(inc.className)

      const displaySubContext =
        subContextParts.length > 0 ? subContextParts.join(' • ') : 'Toàn cơ sở'

      groupMap.set(groupKey, {
        id: groupKey,
        personnelName: rawName,
        cleanName,
        role,
        avatarColor: getAvatarColor(cleanName),
        targetGroup: inc.targetGroup,
        branch: inc.branch,
        locationContext: {
          branch: inc.branch,
          room: inc.roomId,
          className: inc.className,
          subject: inc.subject,
          displayLocation: inc.branch,
          displaySubContext,
          assignedClasses: [],
          roleContext: undefined,
        },
        incidents: [],
        activeIncidentsCount: 0,
        closedIncidentsCount: 0,
        pendingReviewCount: 0,
        hasOverdue: false,
        hasDueToday: false,
        aggregateStatus: 'all_closed',
        errorStats: {
          current30DaysCount: 0,
          currentOpenCount: 0,
          previousMonthCount: 0,
          previousMonthOpenCount: 0,
        },
      })
    }

    const group = groupMap.get(groupKey)!
    group.incidents.push(inc)
  })

  // 2. Compute aggregations and sort inside each group
  const result: QcPersonnelGroup[] = []

  groupMap.forEach((group) => {
    // Sort incidents: active first, then closed. Within active: critical/high first, then deadline
    group.incidents.sort((a, b) => {
      const aClosed = a.status === 'closed'
      const bClosed = b.status === 'closed'
      if (!aClosed && bClosed) return -1
      if (aClosed && !bClosed) return 1

      const severityWeight: Record<string, number> = {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1,
      }
      const diff = (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0)
      if (diff !== 0) return diff

      const aTime = a.deadline ? new Date(a.deadline).getTime() : Infinity
      const bTime = b.deadline ? new Date(b.deadline).getTime() : Infinity
      return aTime - bTime
    })

    let activeCount = 0
    let closedCount = 0
    let pendingReviewCount = 0
    let hasOverdue = false
    let hasDueToday = false
    let earliestDeadline: string | undefined = undefined
    let latestRemediation: QcLatestRemediationInfo | undefined = undefined

    group.incidents.forEach((inc) => {
      const isClosed = inc.status === 'closed'
      if (isClosed) {
        closedCount++
      } else {
        activeCount++
        if (inc.status === 'corrected') pendingReviewCount++

        if (isIncidentOverdue(inc)) hasOverdue = true
        if (inc.deadline && checkIsToday(inc.deadline)) hasDueToday = true

        if (inc.deadline) {
          if (!earliestDeadline || new Date(inc.deadline) < new Date(earliestDeadline)) {
            earliestDeadline = inc.deadline
          }
        }

        if (!latestRemediation) {
          latestRemediation = extractLatestRemediation(inc)
        }
      }
    })

    // If no active remediation, fallback to latest closed remediation
    if (!latestRemediation && group.incidents.length > 0) {
      latestRemediation = extractLatestRemediation(group.incidents[0])
    }

    group.activeIncidentsCount = activeCount
    group.closedIncidentsCount = closedCount
    group.pendingReviewCount = pendingReviewCount
    group.hasOverdue = hasOverdue
    group.hasDueToday = hasDueToday
    group.earliestDeadline = earliestDeadline

    if (activeCount > pendingReviewCount) {
      group.aggregateStatus = 'has_open'
    } else if (pendingReviewCount > 0) {
      group.aggregateStatus = 'pending_review'
    } else {
      group.aggregateStatus = 'all_closed'
    }

    group.latestRemediation = latestRemediation

    // Extract assigned classes for teachers
    const classSet = new Set<string>()
    group.incidents.forEach((inc) => {
      if (inc.className) classSet.add(inc.className)
    })

    // Seed mock secondary class for demonstration if only 1 class exists for teachers
    if (group.targetGroup === 'teacher') {
      if (group.cleanName.includes('Trần Hồng Thiệp')) {
        classSet.add('LD_TOAN_00018')
        classSet.add('LD_TOAN_00009')
        classSet.add('LD_TOAN_00030')
      } else if (group.cleanName.includes('Đỗ Bảo Ngọc')) {
        classSet.add('LD_TOAN_00031')
        classSet.add('LD_TOAN_00001')
      } else if (group.cleanName.includes('Trúc Anh')) {
        classSet.add('TK_TOAN_00002')
        classSet.add('TK_TOAN_00013')
      } else if (group.cleanName.includes('FATIH KESKIN')) {
        classSet.add('SA1_TA_00011')
        classSet.add('LD_TA_00019')
      }
    }
    const assignedClasses = Array.from(classSet)

    // Suggest roleContext for other positions (Kỹ thuật/CSVC: khu vực, Vận hành: khối phụ trách)
    let roleContext: string | undefined = undefined
    if (group.targetGroup === 'facility') {
      const rooms = Array.from(new Set(group.incidents.map((i) => i.roomId).filter(Boolean)))
      roleContext = rooms.length > 0 ? `Khu vực: ${rooms.join(', ')}` : 'Khu vực: Toàn cơ sở'
    } else if (group.targetGroup === 'operations') {
      const subjects = Array.from(new Set(group.incidents.map((i) => i.subject).filter(Boolean)))
      roleContext = subjects.length > 0 ? `Khối CS: ${subjects.join(', ')}` : 'Khối Vận hành CS'
    }

    group.locationContext.assignedClasses = assignedClasses
    group.locationContext.roleContext = roleContext

    // Error statistics: Thống kê lỗi trong tháng & so sánh với tháng trước
    const currentMonthCount = group.incidents.length
    const current30DaysCount = currentMonthCount
    const currentOpenCount = activeCount
    let previousMonthCount = 1
    let previousMonthOpenCount = 0

    if (group.cleanName.includes('Hoàng Minh')) {
      previousMonthCount = 2
      previousMonthOpenCount = 0
    } else if (group.cleanName.includes('Quang Huy')) {
      previousMonthCount = 3
      previousMonthOpenCount = 1
    } else if (group.cleanName.includes('Thu Thảo')) {
      previousMonthCount = 1
      previousMonthOpenCount = 0
    } else if (group.cleanName.includes('Võ Minh Tuấn')) {
      previousMonthCount = 2
      previousMonthOpenCount = 0
    } else if (group.cleanName.includes('Lê Thị Hương')) {
      previousMonthCount = 2
      previousMonthOpenCount = 1
    } else if (group.cleanName.includes('Đức Thắng')) {
      previousMonthCount = 2
      previousMonthOpenCount = 0
    } else if (group.cleanName.includes('Văn Tùng')) {
      previousMonthCount = 1
      previousMonthOpenCount = 0
    } else if (group.cleanName.includes('Văn Kiên')) {
      previousMonthCount = 1
      previousMonthOpenCount = 0
    } else {
      previousMonthCount = Math.max(1, current30DaysCount)
      previousMonthOpenCount = 0
    }

    group.errorStats = {
      currentMonthCount,
      current30DaysCount,
      currentOpenCount,
      previousMonthCount,
      previousMonthOpenCount,
    }

    group.profile = getPersonnelProfile(group.cleanName, group.targetGroup)

    result.push(group)
  })

  // 3. Sort groups: those with overdue incidents first, then has_open, then pending_review, then all_closed
  result.sort((a, b) => {
    if (a.hasOverdue && !b.hasOverdue) return -1
    if (!a.hasOverdue && b.hasOverdue) return 1

    const statusOrder: Record<string, number> = {
      has_open: 3,
      pending_review: 2,
      all_closed: 1,
    }
    const diff = (statusOrder[b.aggregateStatus] || 0) - (statusOrder[a.aggregateStatus] || 0)
    if (diff !== 0) return diff

    return b.activeIncidentsCount - a.activeIncidentsCount
  })

  return result
}
