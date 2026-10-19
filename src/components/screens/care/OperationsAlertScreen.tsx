/* eslint-disable react-hooks/preserve-manual-memoization */
'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { getCareAlerts, mockCareAlerts, type StudentCareAlert } from '@/mocks/careAlerts'
import { StudentCareDetailPage } from './StudentCareDetailPage'
import { mockStudents } from '@/mocks/students'
import { OperationsAlertTable } from './OperationsAlertTable'
import { OperationsAlertToolbar } from './OperationsAlertToolbar'
import { CareJourneyModal } from './CareJourneyModal'
import { toast } from 'sonner'
import {
  getStudentActiveTags,
  hasActiveTags,
  isOverdue,
  isPending,
  isWeakAcademic,
  isLowAttendance,
  isToday,
  isHomeworkAlert,
  isCared,
  isRescheduled,
  isInProgress,
  getConsecutiveAbsences,
  getConsecutiveMissingHomework,
  getConsecutiveLowScores,
  getUnassignedStaffStatus,
  isMyCareAlert,
  DEFAULT_CARE_EXPORT_FIELDS,
  parseToYYYYMMDD,
} from './operationsAlertHelpers'
import { resolveStudentPlacementStatus } from './class-card/studentCareClassCardHelpers'
import { OperationsAlertFilterPanel } from './OperationsAlertFilterPanel'
import { useSystemConfigStore } from '@/stores/useSystemConfigStore'

export function OperationsAlertScreen() {
  const currentStaffName = useSystemConfigStore((s) => s.currentStaffName)
  const [searchQuery, setSearchQuery] = useState('')
  const [careViewMode, setCareViewMode] = useState<'service' | 'academic' | 'total'>('total')
  const [selectedToolbarBranch, setSelectedToolbarBranch] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all')
  const [careStatusFilter, setCareStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'cared'>('all')
  const [dueDateFilter, setDueDateFilter] = useState<'all' | 'overdue' | 'today' | 'rescheduled'>('all')
  const [packageStatusFilter, setPackageStatusFilter] = useState<string>('all')

  // CSDB filter state (droplist selection)
  const [csdbFilter, setCsdbFilter] = useState<string>('all')

  // Advanced filters state (Sets for multi-select checkboxes)
  const [selectedBranches, setSelectedBranches] = useState<Set<string>>(new Set())
  const [selectedCSStaff, setSelectedCSStaff] = useState<Set<string>>(new Set())
  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set())
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set())
  const [selectedCareStatuses, setSelectedCareStatuses] = useState<Set<string>>(new Set())
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set())
  const [selectedCalls, setSelectedCalls] = useState<Set<string>>(new Set())
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set())
  const [selectedCareTypes, setSelectedCareTypes] = useState<Set<string>>(new Set())
  
  // Custom numeric comparison indicators
  const [scoreMin, setScoreMin] = useState('')
  const [scoreMax, setScoreMax] = useState('')
  const [sessionMin, setSessionMin] = useState('')
  const [sessionMax, setSessionMax] = useState('')

  // Consecutive counts filters
  const [selectedAbsences, setSelectedAbsences] = useState<Set<string>>(new Set())
  const [selectedHomeworks, setSelectedHomeworks] = useState<Set<string>>(new Set())
  const [selectedLowScores, setSelectedLowScores] = useState<Set<string>>(new Set())

  // Time & Month filters
  const [selectedMonths, setSelectedMonths] = useState<Set<string>>(new Set())
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Pagination states
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Detail sheet & roadmap modal states
  const searchParams = useSearchParams()
  const studentIdFromUrl = searchParams.get('studentId') || null
  const [overrideStudentId, setOverrideStudentId] = useState<string | null | undefined>(undefined)
  const activeDetailStudentId = overrideStudentId !== undefined ? overrideStudentId : studentIdFromUrl

  const handleSelectStudentDetail = (id: string | null) => {
    setOverrideStudentId(id)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (id) {
        url.searchParams.set('studentId', id)
      } else {
        url.searchParams.delete('studentId')
      }
      window.history.replaceState({}, '', url.toString())
    }
  }

  const [roadmapModalStudent, setRoadmapModalStudent] = useState<StudentCareAlert | null>(null)

  const exportFields = DEFAULT_CARE_EXPORT_FIELDS

  const handleConfirmExport = (
    selectedFieldIds: string[],
    filters: { month: string; startDate: string; endDate: string }
  ) => {
    let filterDesc = ''
    if (filters.month !== 'all') {
      filterDesc += ` trong Tháng ${filters.month}`
    } else if (filters.startDate || filters.endDate) {
      const fromStr = filters.startDate ? filters.startDate.split('-').reverse().join('/') : '...'
      const toStr = filters.endDate ? filters.endDate.split('-').reverse().join('/') : '...'
      filterDesc += ` từ ${fromStr} đến ${toStr}`
    }
    toast.success(`Đã xuất thành công danh sách ${filtered.length} học viên${filterDesc} với ${selectedFieldIds.length} trường thông tin đã chọn sang Excel!`);
  }

  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Helper to reset pagination when filters change
  const resetPagination = () => {
    setPage(1)
  }

  // 1. Get class list and branch options
  const classList = useMemo(() => {
    const list = mockCareAlerts.map((item) => item.classCode)
    return Array.from(new Set(list)).sort()
  }, [])

  const branchOptions = useMemo(
    () => Array.from(new Set(mockStudents.map((student) => student.branch).filter(Boolean))).sort(),
    []
  )

  const csStaffOptions = useMemo(() => {
    const list = mockCareAlerts.map((item) => item.csStaff).filter(Boolean)
    return Array.from(new Set(list)).sort()
  }, [])

  const teacherOptions = useMemo(() => {
    const allTeachers: string[] = []
    mockCareAlerts.forEach((item) => {
      if (item.teacherCode) {
        item.teacherCode.split(/[,;\s/]+/).forEach((t) => {
          const clean = t.trim()
          if (clean) allTeachers.push(clean)
        })
      }
      if (item.substituteTeacher) {
        item.substituteTeacher.split(/[,;\s/]+/).forEach((t) => {
          const clean = t.trim()
          if (clean) allTeachers.push(clean)
        })
      }
    })
    return Array.from(new Set(allTeachers)).sort()
  }, [])

  const assigneeOptions = useMemo(() => {
    return [
      {
        value: 'all',
        label: 'Tất cả người phụ trách',
        selectedLabel: 'Tất cả người phụ trách',
        textValue: 'Tất cả người phụ trách',
      },
      {
        value: 'my',
        label: `⭐ Thẻ của tôi (${currentStaffName})`,
        selectedLabel: '⭐ Thẻ của tôi',
        textValue: `Thẻ của tôi (${currentStaffName})`,
      },
      ...csStaffOptions.map((cs) => ({
        value: `cs:${cs}`,
        label: `CS: ${cs}`,
        selectedLabel: `CS: ${cs}`,
        textValue: `CS ${cs}`,
      })),
      ...teacherOptions.map((t) => ({
        value: `gv:${t}`,
        label: `GV: ${t}`,
        selectedLabel: `GV: ${t}`,
        textValue: `GV ${t}`,
      })),
    ]
  }, [currentStaffName, csStaffOptions, teacherOptions])

  // 2. Perform search and filtering logic (before assignee & care progress tab)
  const preAssigneeFiltered = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    refreshTrigger; // Trigger recalculation
    
    // Base alerts from mock
    const baseAlerts = getCareAlerts()
    let res = baseAlerts

    // Filter by branch
    if (selectedBranches.size > 0) {
      res = res.filter((item) => {
        const student = mockStudents.find(
          (s) => s.id === item.studentId || s.name === item.studentName
        )
        return student && selectedBranches.has(student.branch)
      })
    }

    // Filter by CS Staff (Advanced filter)
    if (selectedCSStaff.size > 0) {
      res = res.filter((item) => selectedCSStaff.has(item.csStaff))
    }

    // Filter by Teachers (Advanced filter)
    if (selectedTeachers.size > 0) {
      res = res.filter((item) => {
        const tCodes = item.teacherCode ? item.teacherCode.split(/[,;\s/]+/).map((t) => t.trim()) : []
        const subCodes = item.substituteTeacher ? item.substituteTeacher.split(/[,;\s/]+/).map((t) => t.trim()) : []
        return Array.from(selectedTeachers).some((t) => tCodes.includes(t) || subCodes.includes(t))
      })
    }

    // Filter by status (including care alert item status and student status)
    if (selectedStatuses.size > 0) {
      res = res.filter((item) => {
        const student = mockStudents.find(
          (s) => s.id === item.studentId || s.name === item.studentName
        )
        const itemStatusMatch = selectedStatuses.has(item.status)
        const studentStatusMatch = Boolean(student && selectedStatuses.has(student.status))
        const mappedMatch =
          (selectedStatuses.has('active') && (item.status === 'Đang học' || student?.status === 'active')) ||
          (selectedStatuses.has('session_ended') && (item.status === 'Hết buổi' || student?.status === 'session_ended')) ||
          (selectedStatuses.has('reserve') && (item.status === 'Bảo lưu' || student?.status === 'reserve')) ||
          (selectedStatuses.has('wait_for_assignment') && (item.status === 'Chưa ghép lớp' || student?.status === 'wait_for_assignment')) ||
          (selectedStatuses.has('pending_transfer') && (item.status === 'Chờ chuyển lớp' || student?.status === 'pending_transfer')) ||
          (selectedStatuses.has('Bảo lưu') && (item.status === 'Bảo lưu' || student?.status === 'reserve')) ||
          (selectedStatuses.has('Chờ chuyển lớp') && (item.status === 'Chờ chuyển lớp' || student?.status === 'pending_transfer')) ||
          (selectedStatuses.has('Chưa ghép lớp') && (item.status === 'Chưa ghép lớp' || student?.status === 'wait_for_assignment'))

        return itemStatusMatch || studentStatusMatch || mappedMatch
      })
    }

    // Filter by careAlert
    if (selectedAlerts.size > 0) {
      res = res.filter((item) => item.careAlert && selectedAlerts.has(item.careAlert))
    }

    // Filter by careStatus (Trạng thái chăm sóc)
    if (selectedCareStatuses.size > 0) {
      res = res.filter((item) => {
        if (selectedCareStatuses.has('pending') && isPending(item)) return true
        if (selectedCareStatuses.has('in_progress') && isInProgress(item)) return true
        if (selectedCareStatuses.has('cared') && isCared(item)) return true
        return false
      })
    }

    // Filter by callConfirmation (Kết quả chăm sóc)
    if (selectedCalls.size > 0) {
      res = res.filter((item) => item.callConfirmation && selectedCalls.has(item.callConfirmation))
    }

    // Filter by classCode
    if (selectedClasses.size > 0) {
      res = res.filter((item) => selectedClasses.has(item.classCode))
    }

    // Filter by careType
    if (selectedCareTypes.size > 0) {
      res = res.filter((item) => {
        const activeTags = getStudentActiveTags(item)
        return activeTags.some((tag) => {
          if (selectedCareTypes.has('ĐB') && tag.startsWith('ĐB')) return true
          if (selectedCareTypes.has('ĐK') && tag.startsWith('ĐK')) return true
          if (selectedCareTypes.has('TB') && tag.startsWith('TB')) return true
          if (selectedCareTypes.has('CSTP') && tag === 'CSTP') return true
          if (selectedCareTypes.has('T') && tag.startsWith('T')) return true
          return false
        })
      })
    }

    // Filter by consecutive absences
    if (selectedAbsences.size > 0) {
      res = res.filter((item) => {
        const count = getConsecutiveAbsences(item.studentId)
        if (selectedAbsences.has('1') && count === 1) return true
        if (selectedAbsences.has('2') && count === 2) return true
        if (selectedAbsences.has('3') && count === 3) return true
        if (selectedAbsences.has('4+') && count >= 4) return true
        return false
      })
    }

    // Filter by consecutive homeworks
    if (selectedHomeworks.size > 0) {
      res = res.filter((item) => {
        const count = getConsecutiveMissingHomework(item.studentId)
        if (selectedHomeworks.has('1') && count === 1) return true
        if (selectedHomeworks.has('2') && count === 2) return true
        if (selectedHomeworks.has('3') && count === 3) return true
        if (selectedHomeworks.has('4+') && count >= 4) return true
        return false
      })
    }

    // Filter by test score range (check average score: (lastTestScore + priorTestScore) / 2)
    if (scoreMin !== '' || scoreMax !== '') {
      res = res.filter((item) => {
        const score = (item.lastTestScore + item.priorTestScore) / 2
        const minVal = scoreMin !== '' ? parseFloat(scoreMin) : 0
        const maxVal = scoreMax !== '' ? parseFloat(scoreMax) : 10
        return score >= minVal && score <= maxVal
      })
    }

    // Filter by consecutive low scores
    if (selectedLowScores.size > 0) {
      res = res.filter((item) => {
        const count = getConsecutiveLowScores(item.studentId)
        if (selectedLowScores.has('1') && count === 1) return true
        if (selectedLowScores.has('2') && count === 2) return true
        if (selectedLowScores.has('3') && count === 3) return true
        if (selectedLowScores.has('4+') && count >= 4) return true
        return false
      })
    }

    // Filter by remaining sessions range (min/max input)
    if (sessionMin !== '' || sessionMax !== '') {
      res = res.filter((item) => {
        const rem = item.remainingSessions
        const minVal = sessionMin !== '' ? parseInt(sessionMin, 10) : 0
        const maxVal = sessionMax !== '' ? parseInt(sessionMax, 10) : 9999
        return rem >= minVal && rem <= maxVal
      })
    }

    // Filter by toolbar branch
    if (selectedToolbarBranch !== 'all') {
      res = res.filter((item) => {
        const student = mockStudents.find(
          (s) => s.id === item.studentId || s.name === item.studentName
        )
        return student && student.branch === selectedToolbarBranch
      })
    }

    // Filter by subject
    if (selectedSubject !== 'all') {
      res = res.filter((item) => item.subject === selectedSubject)
    }

    // Filter by Time / Month and Date Range (Combined)
    if (selectedMonths.size > 0 || fromDate !== '' || toDate !== '') {
      res = res.filter((item) => {
        const dates: string[] = []
        if (item.startDate) dates.push(item.startDate)
        if (item.expectedEndDate) dates.push(item.expectedEndDate)
        item.interactionLogs.forEach((log) => {
          if (log.date) dates.push(log.date)
        })

        let monthMatch = true
        if (selectedMonths.size > 0) {
          monthMatch = dates.some((dStr) => {
            const parsed = parseToYYYYMMDD(dStr)
            if (!parsed) return false
            const [year, month] = parsed.split('-')
            const itemMonthYear = `${month}/${year}`
            return selectedMonths.has(itemMonthYear)
          })
        }

        let rangeMatch = true
        if (fromDate !== '' || toDate !== '') {
          rangeMatch = dates.some((dStr) => {
            const parsed = parseToYYYYMMDD(dStr)
            if (!parsed) return false
            if (fromDate !== '' && parsed < fromDate) return false
            if (toDate !== '' && parsed > toDate) return false
            return true
          })
        }

        return monthMatch && rangeMatch
      })
    }

    // Filter by general search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim()
      res = res.filter((item) => 
        item.studentName.toLowerCase().includes(q) ||
        (item.englishName && item.englishName.toLowerCase().includes(q)) ||
        item.studentId.includes(q) ||
        item.classCode.toLowerCase().includes(q) ||
        item.teacherCode.toLowerCase().includes(q) ||
        (item.customerCode && item.customerCode.toLowerCase().includes(q))
      )
    }

    return res.filter(hasActiveTags)
  }, [
    selectedBranches,
    selectedCSStaff,
    selectedTeachers,
    selectedStatuses,
    selectedCareStatuses,
    selectedAlerts,
    selectedCalls,
    selectedClasses,
    selectedCareTypes,
    scoreMin,
    scoreMax,
    sessionMin,
    sessionMax,
    selectedAbsences,
    selectedHomeworks,
    selectedLowScores,
    selectedMonths,
    fromDate,
    toDate,
    searchQuery,
    selectedToolbarBranch,
    selectedSubject,
    refreshTrigger
  ])

  // Count alerts belonging to the current user (within the current branch/subject/search scope)
  const myAlertsCount = useMemo(() => {
    return preAssigneeFiltered.filter((item) => isMyCareAlert(item, currentStaffName)).length
  }, [preAssigneeFiltered, currentStaffName])

  // Apply Toolbar assignee selection ('my', 'cs:name', 'gv:name', or 'all')
  const baseFiltered = useMemo(() => {
    let res = preAssigneeFiltered
    if (selectedAssignee === 'my') {
      res = res.filter((item) => isMyCareAlert(item, currentStaffName))
    } else if (selectedAssignee.startsWith('cs:')) {
      const staff = selectedAssignee.replace('cs:', '')
      res = res.filter((item) => item.csStaff === staff)
    } else if (selectedAssignee.startsWith('gv:')) {
      const teacher = selectedAssignee.replace('gv:', '')
      res = res.filter((item) => {
        const tCodes = item.teacherCode ? item.teacherCode.split(/[,;\s/]+/).map((t) => t.trim()) : []
        const subCodes = item.substituteTeacher ? item.substituteTeacher.split(/[,;\s/]+/).map((t) => t.trim()) : []
        return tCodes.includes(teacher) || subCodes.includes(teacher)
      })
    }
    return res
  }, [preAssigneeFiltered, selectedAssignee, currentStaffName])

  // Compute care status counts from baseFiltered
  const careStatusCounts = useMemo(() => {
    return {
      all: baseFiltered.filter((item) => !isCared(item)).length,
      pending: baseFiltered.filter(isPending).length,
      in_progress: baseFiltered.filter(isInProgress).length,
      cared: baseFiltered.filter(isCared).length,
    }
  }, [baseFiltered])

  // Compute due date counts from baseFiltered
  const dueDateCounts = useMemo(() => {
    return {
      all: baseFiltered.length,
      overdue: baseFiltered.filter(isOverdue).length,
      today: baseFiltered.filter(isToday).length,
      rescheduled: baseFiltered.filter(isRescheduled).length,
    }
  }, [baseFiltered])

  const tabFiltered = useMemo(() => {
    let res = baseFiltered

    // Care status filter from toolbar tabs (only applied when advanced filter has not explicitly set care status)
    if (selectedCareStatuses.size === 0) {
      if (dueDateFilter === 'rescheduled') {
        res = res.filter(isRescheduled)
      } else {
        if (careStatusFilter === 'pending') res = res.filter(isPending)
        else if (careStatusFilter === 'in_progress') res = res.filter(isInProgress)
        else if (careStatusFilter === 'cared') res = res.filter(isCared)
        else if (careStatusFilter === 'all') res = res.filter((item) => !isCared(item))
      }
    }

    // Due date filter
    if (dueDateFilter === 'overdue') res = res.filter(isOverdue)
    else if (dueDateFilter === 'today') res = res.filter(isToday)
    else if (dueDateFilter === 'rescheduled' && selectedCareStatuses.size > 0) res = res.filter(isRescheduled)

    return res
  }, [baseFiltered, careStatusFilter, dueDateFilter, selectedCareStatuses])

  const csdbCounts = useMemo(() => {
    return {
      weakAcademic: tabFiltered.filter(isWeakAcademic).length,
      homework: tabFiltered.filter(isHomeworkAlert).length,
      lowAttendance: tabFiltered.filter(isLowAttendance).length,
    }
  }, [tabFiltered])

  // Compute package / placement status counts from tabFiltered
  const packageStatusCounts = useMemo(() => {
    const counts = {
      all: tabFiltered.length,
      active: 0,
      pending_transfer: 0,
      wait_for_assignment: 0,
      reserve: 0,
      session_ended: 0,
    }

    tabFiltered.forEach((item) => {
      const studentInfo = mockStudents.find(
        (s) => s.id === item.studentId || s.name.toLowerCase() === item.studentName.toLowerCase()
      )
      const st = resolveStudentPlacementStatus(item, studentInfo)
      if (st === 'active') counts.active++
      else if (st === 'pending_transfer') counts.pending_transfer++
      else if (st === 'wait_for_assignment') counts.wait_for_assignment++
      else if (st === 'reserve') counts.reserve++
      else if (st === 'session_ended') counts.session_ended++
    })

    return counts
  }, [tabFiltered])

  // 3. Apply care progress tab filter & sort by category priority (Đặc biệt -> Warning -> Chăm sóc)
  const filtered = useMemo(() => {
    let result = tabFiltered

    if (csdbFilter !== 'all') {
      result = result.filter((item) => {
        if (csdbFilter === 'weakAcademic' && isWeakAcademic(item)) return true
        if (csdbFilter === 'homework' && isHomeworkAlert(item)) return true
        if (csdbFilter === 'lowAttendance' && isLowAttendance(item)) return true
        return false
      })
    }

    if (packageStatusFilter !== 'all') {
      result = result.filter((item) => {
        const studentInfo = mockStudents.find(
          (s) => s.id === item.studentId || s.name.toLowerCase() === item.studentName.toLowerCase()
        )
        const st = resolveStudentPlacementStatus(item, studentInfo)
        return st === packageStatusFilter
      })
    }

    return [...result].sort((a, b) => {
      const getPriority = (item: StudentCareAlert) => {
        const unassigned = getUnassignedStaffStatus(item)
        if (unassigned.isUnassigned) return 10 // Always on top if CS or GV unassigned!
        const active = getStudentActiveTags(item)
        if (active.some((tag) => tag.startsWith('ĐB')) || active.some((tag) => tag === 'CSCĐ')) return 3 // Đặc biệt
        if (active.some((tag) => tag.startsWith('TB'))) return 2 // Warning
        return 1 // Chăm sóc
      }
      return getPriority(b) - getPriority(a)
    })
  }, [tabFiltered, csdbFilter, packageStatusFilter])

  // Paginated list
  const paginatedAlerts = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    return filtered.slice(startIndex, startIndex + pageSize)
  }, [filtered, page, pageSize])

  // 7. Checkbox selection handlers
  const handleSelectChange = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    )
  }

  // Calculate active filters count
  const activeFilterCount = useMemo(() => {
    return [
      selectedBranches.size > 0,
      selectedCSStaff.size > 0,
      selectedTeachers.size > 0,
      selectedAssignee !== 'all',
      selectedStatuses.size > 0,
      selectedCareStatuses.size > 0,
      selectedAlerts.size > 0,
      selectedCalls.size > 0,
      selectedClasses.size > 0,
      selectedCareTypes.size > 0,
      scoreMin !== '' || scoreMax !== '',
      sessionMin !== '' || sessionMax !== '',
      selectedAbsences.size > 0,
      selectedHomeworks.size > 0,
      selectedLowScores.size > 0,
      selectedMonths.size > 0,
      fromDate !== '',
      toDate !== '',
    ].filter(Boolean).length
  }, [
    selectedBranches,
    selectedCSStaff,
    selectedTeachers,
    selectedAssignee,
    selectedStatuses,
    selectedCareStatuses,
    selectedAlerts,
    selectedCalls,
    selectedClasses,
    selectedCareTypes,
    scoreMin,
    scoreMax,
    sessionMin,
    sessionMax,
    selectedAbsences,
    selectedHomeworks,
    selectedLowScores,
    selectedMonths,
    fromDate,
    toDate,
  ])

  const filterState = {
    selectedBranches, selectedCSStaff, selectedTeachers, selectedStatuses,
    selectedCareStatuses, selectedAlerts, selectedCareTypes, selectedAbsences,
    selectedHomeworks, selectedLowScores, selectedCalls, selectedClasses,
    scoreMin, scoreMax, sessionMin, sessionMax, selectedMonths, fromDate, toDate,
  }

  const filterActions = {
    setSelectedBranches, setSelectedCSStaff, setSelectedTeachers, setSelectedStatuses,
    setSelectedCareStatuses, setSelectedAlerts, setSelectedCareTypes, setSelectedAbsences,
    setSelectedHomeworks, setSelectedLowScores, setSelectedCalls, setSelectedClasses,
    setScoreMin, setScoreMax, setSessionMin, setSessionMax, setSelectedMonths,
    setFromDate, setToDate, resetPagination,
  }

  if (activeDetailStudentId) {
    return (
      <StudentCareDetailPage
        studentId={activeDetailStudentId}
        onBack={() => {
          handleSelectStudentDetail(null)
        }}
        alerts={mockCareAlerts}
        onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
        onStudentSelect={(id) => handleSelectStudentDetail(id)}
      />
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <OperationsAlertToolbar
        alerts={filtered}
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); resetPagination() }}
        activeFilterCount={activeFilterCount}
        alertsCount={filtered.length}
        onOpenFilter={() => setIsFilterOpen(true)}
        careViewMode={careViewMode}
        onCareViewModeChange={setCareViewMode}
        selectedBranch={selectedToolbarBranch}
        onBranchChange={(b) => { setSelectedToolbarBranch(b); resetPagination() }}
        branchOptions={branchOptions}
        selectedSubject={selectedSubject}
        onSubjectChange={(s) => { setSelectedSubject(s); resetPagination() }}
        selectedAssignee={selectedAssignee}
        onAssigneeChange={(val) => { setSelectedAssignee(val); resetPagination() }}
        assigneeOptions={assigneeOptions}
        myAlertsCount={myAlertsCount}
        currentStaffName={currentStaffName}
        careStatusFilter={careStatusFilter}
        onCareStatusFilterChange={(s) => { setCareStatusFilter(s); setSelectedCareStatuses(new Set()); resetPagination() }}
        careStatusCounts={careStatusCounts}
        dueDateFilter={dueDateFilter}
        onDueDateFilterChange={(d) => { setDueDateFilter(d); resetPagination() }}
        dueDateCounts={dueDateCounts}
        exportFields={exportFields}
        onConfirmExport={handleConfirmExport}
        csdbCounts={csdbCounts}
        csdbFilter={csdbFilter}
        onCsdbFilterChange={(val) => { setCsdbFilter(val); resetPagination() }}
        packageStatusFilter={packageStatusFilter}
        onPackageStatusFilterChange={(st) => { setPackageStatusFilter(st); resetPagination() }}
        packageStatusCounts={packageStatusCounts}
      />

      <div className="flex flex-1 min-h-0 w-full gap-3 overflow-hidden px-2.5 pt-0.5 pb-2 lg:px-3">
        <div className="flex-1 min-w-0 h-full overflow-hidden flex flex-col">
          <OperationsAlertTable
            alerts={paginatedAlerts}
            selectedIds={selectedIds}
            onSelectChange={handleSelectChange}
            onSelectAll={(checked) => {
              setSelectedIds((prev) => {
                const otherIds = prev.filter((id) => !paginatedAlerts.some((x) => x.id === id))
                return checked ? [...otherIds, ...paginatedAlerts.map((x) => x.id)] : otherIds
              })
            }}
            className="flex-1"
            pagination={{
              page: page,
              total: filtered.length,
              pageSize: pageSize,
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
            }}
            viewMode={careViewMode}
            onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
            onViewDetail={handleSelectStudentDetail}
            onOpenRoadmapModal={(alert) => {
              setRoadmapModalStudent(alert)
            }}
          />
        </div>

        {/* Advanced Filters Aside Panel */}
        <OperationsAlertFilterPanel
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          branchOptions={branchOptions}
          classList={classList}
          csStaffOptions={csStaffOptions}
          teacherOptions={teacherOptions}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          state={filterState}
          actions={filterActions}
          activeCount={activeFilterCount}
          onApply={() => setIsFilterOpen(false)}
        />
      </div>

      {/* Care Journey / Roadmap Modal */}
      <CareJourneyModal
        isOpen={Boolean(roadmapModalStudent)}
        onClose={() => setRoadmapModalStudent(null)}
        workItem={
          roadmapModalStudent
            ? {
                id: roadmapModalStudent.id,
                studentId: roadmapModalStudent.studentId,
                studentName: roadmapModalStudent.studentName,
                className: roadmapModalStudent.classCode,
                productName: `${roadmapModalStudent.subject} - ${roadmapModalStudent.level}`,
                expectedEndDate: roadmapModalStudent.expectedEndDate || '25/10/2026',
              }
            : null
        }
      />
    </div>
  )
}
