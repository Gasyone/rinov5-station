/* eslint-disable react-hooks/preserve-manual-memoization */
'use client'

import { useMemo, useState } from 'react'

import { getCareAlerts, mockCareAlerts, type StudentCareAlert } from '@/mocks/careAlerts'
import { StudentCareDetailPage } from './StudentCareDetailPage'
import { mockStudents } from '@/mocks/students'
import { OperationsAlertTable } from './OperationsAlertTable'
import { OperationsAlertToolbar } from './OperationsAlertToolbar'
import { CareDashboardView } from './CareDashboardView'
import { CareJourneyModal } from './CareJourneyModal'
import { toast } from 'sonner'
import {
  parseAttendanceRate,
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
} from './operationsAlertHelpers'
import { OperationsAlertFilterPanel } from './OperationsAlertFilterPanel'

export function OperationsAlertScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [careViewMode, setCareViewMode] = useState<'service' | 'academic' | 'total'>('total')
  const [selectedToolbarBranch, setSelectedToolbarBranch] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [careStatusFilter, setCareStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'cared'>('all')
  const [dueDateFilter, setDueDateFilter] = useState<'all' | 'overdue' | 'today' | 'rescheduled'>('all')

  // CSDB filter state (droplist selection)
  const [csdbFilter, setCsdbFilter] = useState<string>('all')

  // Advanced filters state (Sets for multi-select checkboxes)
  const [selectedBranches, setSelectedBranches] = useState<Set<string>>(new Set())
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set())
  const [selectedCareStatuses, setSelectedCareStatuses] = useState<Set<string>>(new Set())
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set())
  const [selectedCalls, setSelectedCalls] = useState<Set<string>>(new Set())
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set())
  const [selectedCareTypes, setSelectedCareTypes] = useState<Set<string>>(new Set())
  
  // Custom numeric comparison indicators
  const [attendanceMin, setAttendanceMin] = useState('')
  const [attendanceMax, setAttendanceMax] = useState('')
  const [homeworkMin, setHomeworkMin] = useState('')
  const [homeworkMax, setHomeworkMax] = useState('')
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
  
  const [selectedTrends, setSelectedTrends] = useState<Set<string>>(new Set())
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Pagination states
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [viewMode, setViewMode] = useState<'table' | 'dashboard'>('table')

  // Detail sheet & roadmap modal states
  const [activeDetailStudentId, setActiveDetailStudentId] = useState<string | null>(null)
  const [roadmapModalStudent, setRoadmapModalStudent] = useState<StudentCareAlert | null>(null)

  const exportFields = [
    { id: 'studentId', label: 'Mã học viên', defaultChecked: true },
    { id: 'customerCode', label: 'Mã khách hàng', defaultChecked: true },
    { id: 'studentName', label: 'Họ và tên học viên', defaultChecked: true },
    { id: 'startDate', label: 'Ngày bắt đầu học', defaultChecked: true },
    { id: 'subjectAndClass', label: 'Môn học & Mã lớp', defaultChecked: true },
    { id: 'branch', label: 'Cơ sở phụ trách', defaultChecked: true },
    { id: 'schedule', label: 'Lịch học', defaultChecked: true },
    { id: 'teacher', label: 'Giáo viên giảng dạy', defaultChecked: true },
    { id: 'attendanceRatio', label: 'Gói sản phẩm', defaultChecked: true },
    { id: 'homeworkCompletion', label: 'Tỷ lệ hoàn thành BTVN (%)', defaultChecked: true },
    { id: 'lastTestScore', label: 'Điểm đánh giá gần nhất', defaultChecked: true },
    { id: 'evaluationComment', label: 'Nhận xét của Giáo viên', defaultChecked: true },
    { id: 'careAlerts', label: 'Trạng thái Cảnh báo CS', defaultChecked: true },
    { id: 'c90bConfirmation', label: 'Xác nhận C90B', defaultChecked: true },
    { id: 'latestCareNote', label: 'Ghi chú tương tác gần nhất', defaultChecked: true },
    { id: 'csStaff', label: 'Nhân viên CS phụ trách', defaultChecked: true }
  ]

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

  // 2. Perform search and filtering logic (before care progress tab)
  const baseFiltered = useMemo(() => {
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

    // Filter by status (including care alert item status and student status)
    if (selectedStatuses.size > 0) {
      res = res.filter((item) => {
        const student = mockStudents.find(
          (s) => s.id === item.studentId || s.name === item.studentName
        )
        const itemStatusMatch = selectedStatuses.has(item.status)
        const studentStatusMatch = Boolean(student && selectedStatuses.has(student.status))
        const mappedMatch =
          (selectedStatuses.has('active') && item.status === 'Đang học') ||
          (selectedStatuses.has('session_ended') && item.status === 'Hết buổi') ||
          (selectedStatuses.has('pending_transfer') && item.status === 'Chờ chuyển lớp')

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

    // Filter by attendance range (min/max input)
    if (attendanceMin !== '' || attendanceMax !== '') {
      res = res.filter((item) => {
        const rate = parseAttendanceRate(item.attendanceRatio)
        const minVal = attendanceMin !== '' ? parseFloat(attendanceMin) : 0
        const maxVal = attendanceMax !== '' ? parseFloat(attendanceMax) : 100
        return rate >= minVal && rate <= maxVal
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

    // Filter by homework range (min/max input)
    if (homeworkMin !== '' || homeworkMax !== '') {
      res = res.filter((item) => {
        const hw = item.homeworkCompletion
        const minVal = homeworkMin !== '' ? parseFloat(homeworkMin) : 0
        const maxVal = homeworkMax !== '' ? parseFloat(homeworkMax) : 100
        return hw >= minVal && hw <= maxVal
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

    // Filter by academic trend
    if (selectedTrends.size > 0) {
      res = res.filter((item) => {
        const isDecline = item.lastTestScore < item.priorTestScore
        const isImprove = item.lastTestScore > item.priorTestScore
        const isStable = item.lastTestScore === item.priorTestScore
        if (selectedTrends.has('decline') && isDecline) return true
        if (selectedTrends.has('improve') && isImprove) return true
        if (selectedTrends.has('stable') && isStable) return true
        return false
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

        const toYYYYMMDD = (dStr: string): string | null => {
          if (!dStr) return null
          const clean = dStr.split(' ')[0]
          if (clean.includes('/')) {
            const parts = clean.split('/')
            if (parts.length === 3) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
          }
          if (clean.includes('-')) {
            const parts = clean.split('-')
            if (parts.length === 3) return clean
          }
          return null
        }

        let monthMatch = true
        if (selectedMonths.size > 0) {
          monthMatch = dates.some((dStr) => {
            const parsed = toYYYYMMDD(dStr)
            if (!parsed) return false
            const [year, month] = parsed.split('-')
            const itemMonthYear = `${month}/${year}`
            return selectedMonths.has(itemMonthYear)
          })
        }

        let rangeMatch = true
        if (fromDate !== '' || toDate !== '') {
          rangeMatch = dates.some((dStr) => {
            const parsed = toYYYYMMDD(dStr)
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
    selectedStatuses,
    selectedCareStatuses,
    selectedAlerts,
    selectedCalls,
    selectedClasses,
    selectedCareTypes,
    attendanceMin,
    attendanceMax,
    homeworkMin,
    homeworkMax,
    scoreMin,
    scoreMax,
    sessionMin,
    sessionMax,
    selectedAbsences,
    selectedHomeworks,
    selectedLowScores,
    selectedTrends,
    selectedMonths,
    fromDate,
    toDate,
    searchQuery,
    selectedToolbarBranch,
    selectedSubject,
    refreshTrigger
  ])

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
      if (careStatusFilter === 'pending') res = res.filter(isPending)
      else if (careStatusFilter === 'in_progress') res = res.filter(isInProgress)
      else if (careStatusFilter === 'cared') res = res.filter(isCared)
      else if (careStatusFilter === 'all') res = res.filter((item) => !isCared(item))
    }

    // Due date filter
    if (dueDateFilter === 'overdue') res = res.filter(isOverdue)
    else if (dueDateFilter === 'today') res = res.filter(isToday)
    else if (dueDateFilter === 'rescheduled') res = res.filter(isRescheduled)

    return res
  }, [baseFiltered, careStatusFilter, dueDateFilter, selectedCareStatuses])

  const csdbCounts = useMemo(() => {
    return {
      weakAcademic: tabFiltered.filter(isWeakAcademic).length,
      homework: tabFiltered.filter(isHomeworkAlert).length,
      lowAttendance: tabFiltered.filter(isLowAttendance).length,
    }
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

    return [...result].sort((a, b) => {
      const getPriority = (item: StudentCareAlert) => {
        const unassigned = getUnassignedStaffStatus(item)
        if (unassigned.isUnassigned) return 10 // Always on top if CS or GV unassigned!
        const active = getStudentActiveTags(item)
        if (active.some((tag) => tag.startsWith('ĐB'))) return 3 // Đặc biệt
        if (active.some((tag) => tag.startsWith('TB'))) return 2 // Warning
        return 1 // Chăm sóc
      }
      return getPriority(b) - getPriority(a)
    })
  }, [tabFiltered, csdbFilter])

  // Split into Special Care vs Regular Students
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
      selectedStatuses.size > 0,
      selectedCareStatuses.size > 0,
      selectedAlerts.size > 0,
      selectedCalls.size > 0,
      selectedClasses.size > 0,
      selectedCareTypes.size > 0,
      attendanceMin !== '' || attendanceMax !== '',
      homeworkMin !== '' || homeworkMax !== '',
      scoreMin !== '' || scoreMax !== '',
      sessionMin !== '' || sessionMax !== '',
      selectedAbsences.size > 0,
      selectedHomeworks.size > 0,
      selectedLowScores.size > 0,
      selectedTrends.size > 0,
      selectedMonths.size > 0,
      fromDate !== '',
      toDate !== '',
    ].filter(Boolean).length
  }, [
    selectedBranches,
    selectedStatuses,
    selectedCareStatuses,
    selectedAlerts,
    selectedCalls,
    selectedClasses,
    selectedCareTypes,
    attendanceMin,
    attendanceMax,
    homeworkMin,
    homeworkMax,
    scoreMin,
    scoreMax,
    sessionMin,
    sessionMax,
    selectedAbsences,
    selectedHomeworks,
    selectedLowScores,
    selectedTrends,
    selectedMonths,
    fromDate,
    toDate,
  ])

  const filterState = {
    selectedBranches,
    selectedStatuses,
    selectedCareStatuses,
    selectedAlerts,
    selectedCareTypes,
    selectedAbsences,
    selectedHomeworks,
    selectedLowScores,
    selectedTrends,
    selectedCalls,
    selectedClasses,
    attendanceMin,
    attendanceMax,
    homeworkMin,
    homeworkMax,
    scoreMin,
    scoreMax,
    sessionMin,
    sessionMax,
    selectedMonths,
    fromDate,
    toDate,
  }

  const filterActions = {
    setSelectedBranches,
    setSelectedStatuses,
    setSelectedCareStatuses,
    setSelectedAlerts,
    setSelectedCareTypes,
    setSelectedAbsences,
    setSelectedHomeworks,
    setSelectedLowScores,
    setSelectedTrends,
    setSelectedCalls,
    setSelectedClasses,
    setAttendanceMin,
    setAttendanceMax,
    setHomeworkMin,
    setHomeworkMax,
    setScoreMin,
    setScoreMax,
    setSessionMin,
    setSessionMax,
    setSelectedMonths,
    setFromDate,
    setToDate,
    resetPagination,
  }

  if (activeDetailStudentId) {
    return (
      <StudentCareDetailPage
        studentId={activeDetailStudentId}
        onBack={() => {
          setActiveDetailStudentId(null)
        }}
        alerts={mockCareAlerts}
        onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
        onStudentSelect={(id) => setActiveDetailStudentId(id)}
      />
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <OperationsAlertToolbar
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
        careStatusFilter={careStatusFilter}
        onCareStatusFilterChange={(s) => { setCareStatusFilter(s); setSelectedCareStatuses(new Set()); resetPagination() }}
        careStatusCounts={careStatusCounts}
        dueDateFilter={dueDateFilter}
        onDueDateFilterChange={(d) => { setDueDateFilter(d); resetPagination() }}
        dueDateCounts={dueDateCounts}
        exportFields={exportFields}
        onConfirmExport={handleConfirmExport}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        csdbCounts={csdbCounts}
        csdbFilter={csdbFilter}
        onCsdbFilterChange={(val) => { setCsdbFilter(val); resetPagination() }}
      />

      {viewMode === 'dashboard' ? (
        <CareDashboardView 
          alerts={filtered} 
          onDrillDown={(filterType) => {
            if (filterType === 'overdue') {
              setDueDateFilter('overdue')
            } else if (filterType === 'pending') {
              setCareStatusFilter('pending')
              setSelectedCareStatuses(new Set())
            } else if (filterType === 'cared') {
              setCareStatusFilter('cared')
              setSelectedCareStatuses(new Set())
            } else if (filterType === 'academic') {
              setSelectedCareTypes(new Set(['ĐB', 'TB']))
            } else if (filterType === 'attendance') {
              setSelectedCareTypes(new Set(['TB']))
            } else {
              setDueDateFilter('all')
              setCareStatusFilter('all')
              setSelectedCareStatuses(new Set())
              setSelectedCareTypes(new Set())
            }
            resetPagination()
            setViewMode('table')
          }}
          onSelectStudent={(studentId) => {
            setActiveDetailStudentId(studentId)
          }}
          onFilterByStaff={(staffName) => {
            setSearchQuery(staffName)
            resetPagination()
            setViewMode('table')
          }}
        />
      ) : (
        <div className="min-h-0 flex-1 px-2 py-1.5 lg:px-3 pb-3 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 flex flex-col">
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
              onViewDetail={(id) => {
                setActiveDetailStudentId(id)
              }}
              onOpenRoadmapModal={(alert) => {
                setRoadmapModalStudent(alert)
              }}
            />
          </div>
        </div>
      )}

      {/* Advanced Filters Sheet Panel */}
      <OperationsAlertFilterPanel
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        branchOptions={branchOptions}
        classList={classList}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        state={filterState}
        actions={filterActions}
      />

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

      {/* Student Care Detail Dialog (Temporarily Disabled)
      <StudentCareDetailDialog
        studentId={activeDetailStudentId}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        alerts={mockCareAlerts}
        onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
      />
      */}
    </div>
  )
}
