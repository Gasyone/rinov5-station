'use client'

import { useMemo, useState } from 'react'
import { getCareAlerts, mockCareAlerts, getFamilyContacts, type StudentCareAlert } from '@/mocks/careAlerts'
import { mockStudents } from '@/mocks/students'
import { RenewalTable } from './RenewalTable'
import { RenewalToolbar } from './RenewalToolbar'
import { StudentCareDetailPage } from '../StudentCareDetailPage'
import { useCallStore } from '@/stores/useCallStore'
import { useSystemConfigStore } from '@/stores/useSystemConfigStore'
import { FilterGroupAsidePanel } from '@/components/filters'
import type { StatusTile } from '@/components/shared'
import {
  getRenewalClassification,
  getStudentOrderInfo,
  hasActiveTags,
  isMoi,
  isCanNhac,
  isTiemNang,
  isHenTai,
  isDaTaiPhi,
  isThatBai,
  isChuaDenHan,
} from './renewalHelpers'
import { buildRenewalFilterGroups } from './renewalFilterConfig'
import { resolveStudentPlacementStatus } from '../class-card/studentCareClassCardHelpers'

export function RenewalScreen() {
  const dataScope = useSystemConfigStore((s) => s.dataScope)
  const currentStaffName = useSystemConfigStore((s) => s.currentStaffName)
  const currentBranch = useSystemConfigStore((s) => s.currentBranch)

  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDetailStudentId, setActiveDetailStudentId] = useState<string | null>(null)
  const careViewMode = 'total'
  const [selectedToolbarBranch, setSelectedToolbarBranch] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedStudentStatus, setSelectedStudentStatus] = useState('all')
  const [careProgressTab, setCareProgressTab] = useState('all')

  // Advanced filters state (Sets for multi-select checkboxes)
  const [selectedBranches, setSelectedBranches] = useState<Set<string>>(new Set())
  const [selectedRenewalStatuses, setSelectedRenewalStatuses] = useState<Set<string>>(new Set())
  const [selectedFeeDueMonths, setSelectedFeeDueMonths] = useState<Set<string>>(new Set())
  const [selectedCalls, setSelectedCalls] = useState<Set<string>>(new Set())
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set())
  const [selectedSubjectsFilter, setSelectedSubjectsFilter] = useState<Set<string>>(new Set())
  const [selectedPrograms, setSelectedPrograms] = useState<Set<string>>(new Set())
  const [selectedLevels, setSelectedLevels] = useState<Set<string>>(new Set())
  const [selectedCSStaff, setSelectedCSStaff] = useState<Set<string>>(new Set())
  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set())
  const [selectedOrderStatuses, setSelectedOrderStatuses] = useState<Set<string>>(new Set())
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set())
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Pagination states for the unified table
  const [pageSingle, setPageSingle] = useState(1)
  const [pageSizeSingle, setPageSizeSingle] = useState(20)

  const [selectedExpiryPeriod, setSelectedExpiryPeriod] = useState('all')

  const startCall = useCallStore((state) => state.startCall)

  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Helper to reset pagination when filters change
  const resetPagination = () => {
    setPageSingle(1)
  }

  // 1. Get class list, branch options, csStaffOptions and teacherOptions
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
    const list: string[] = []
    mockCareAlerts.forEach((item) => {
      if (item.teacherCode) {
        item.teacherCode.split(/[,;\s/]+/).forEach((t) => {
          if (t.trim()) list.push(t.trim())
        })
      }
      if (item.substituteTeacher) {
        item.substituteTeacher.split(/[,;\s/]+/).forEach((t) => {
          if (t.trim()) list.push(t.trim())
        })
      }
    })
    return Array.from(new Set(list)).sort()
  }, [])

  // 2. Perform search and filtering logic (before care progress tab)
  const baseFiltered = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    refreshTrigger
    // Base alerts from mock
    const baseAlerts = getCareAlerts()
    let res = baseAlerts

    // 0. Filter by System Data Scope (Cấu hình phạm vi dữ liệu hệ thống: Cá nhân hoặc Cơ sở)
    if (dataScope === 'personal') {
      res = res.filter((item) => item.csStaff === currentStaffName)
    } else if (dataScope === 'branch') {
      res = res.filter((item) => {
        const student = mockStudents.find(
          (s) => s.id === item.studentId || s.name === item.studentName
        )
        return student && student.branch === currentBranch
      })
    }

    // Exclude 'that_bai' and 'chua_den_han' from base tab pool unless explicitly selected in advanced filters
    const includesThatBai = selectedCalls.has('that_bai') || selectedCalls.has('Thất bại') || selectedRenewalStatuses.has('that_bai')
    if (!includesThatBai) {
      res = res.filter(item => !isThatBai(item))
    }

    const includesChuaDenHan = selectedRenewalStatuses.has('chua_den_han')
    if (!includesChuaDenHan) {
      res = res.filter(item => !isChuaDenHan(item))
    }

    // Filter by branch
    if (selectedBranches.size > 0) {
      res = res.filter((item) => {
        const student = mockStudents.find(
          (s) => s.id === item.studentId || s.name === item.studentName
        )
        return student && selectedBranches.has(student.branch)
      })
    }

    // Filter by renewal status (Trạng thái tái phí)
    if (selectedRenewalStatuses.size > 0) {
      res = res.filter((item) => {
        const classification = getRenewalClassification(item)
        return selectedRenewalStatuses.has(classification)
      })
    }

    // Filter by fee due month (Hạn T1, T2, T3) or custom date range
    if (selectedFeeDueMonths.size > 0 || customStartDate || customEndDate) {
      res = res.filter((item) => {
        if (!item.expectedEndDate) return false
        const parts = item.expectedEndDate.split('/')
        if (parts.length < 3) return false
        const day = parseInt(parts[0], 10)
        const month = parseInt(parts[1], 10)
        const year = parseInt(parts[2], 10)
        const itemDate = new Date(year, month - 1, day)

        // Custom date range filtering
        if (customStartDate || customEndDate) {
          if (customStartDate) {
            const start = new Date(customStartDate)
            start.setHours(0, 0, 0, 0)
            if (itemDate < start) return false
          }
          if (customEndDate) {
            const end = new Date(customEndDate)
            end.setHours(23, 59, 59, 999)
            if (itemDate > end) return false
          }
          return true
        }

        // Fee due months presets
        if (selectedFeeDueMonths.size > 0) {
          return Array.from(selectedFeeDueMonths).some((val) => {
            if (val === '1') return month === 1 || month === 12 || month <= 2
            if (val === '2') return month >= 3 && month <= 6
            if (val === '3') return month >= 7 && month <= 9
            return true
          })
        }
        return true
      })
    }

    // Filter by call confirmation & interaction (Kết quả chăm sóc)
    if (selectedCalls.size > 0) {
      res = res.filter((item) => {
        if (item.callConfirmation && selectedCalls.has(item.callConfirmation)) return true
        if (item.interactionLogs && item.interactionLogs.some((l) => l.callConfirmation && selectedCalls.has(l.callConfirmation))) return true
        if ((selectedCalls.has('that_bai') || selectedCalls.has('Thất bại')) && isThatBai(item)) return true
        return false
      })
    }

    // Filter by status (Trạng thái lớp & Học tập đồng bộ với resolveStudentPlacementStatus)
    if (selectedStatuses.size > 0) {
      res = res.filter((item) => {
        const studentInfo = mockStudents.find(
          (s) => s.id === item.studentId || s.name.toLowerCase() === item.studentName.toLowerCase()
        )
        const placementStatus = resolveStudentPlacementStatus(item, studentInfo)
        return (
          selectedStatuses.has(placementStatus) ||
          selectedStatuses.has(item.status) ||
          (selectedStatuses.has('active') && item.status === 'Đang học') ||
          (selectedStatuses.has('reserve') && (item.status === 'Bảo lưu' || item.realtimeStatus === 'Bảo lưu')) ||
          (selectedStatuses.has('pending_transfer') && item.status === 'Chờ chuyển lớp') ||
          (selectedStatuses.has('session_ended') && item.status === 'Hết buổi') ||
          (selectedStatuses.has('wait_for_assignment') && item.status === 'Chưa ghép lớp')
        )
      })
    }

    // Filter by Subject (Môn học)
    if (selectedSubjectsFilter.size > 0) {
      res = res.filter((item) => selectedSubjectsFilter.has(item.subject))
    }

    // Filter by Program & Level Treeview
    if (selectedPrograms.size > 0 || selectedLevels.size > 0) {
      res = res.filter((item) => {
        if (selectedLevels.size > 0 && selectedLevels.has(item.level)) return true
        if (selectedPrograms.has('tieng_anh') && item.subject === 'Tiếng Anh') return true
        if (selectedPrograms.has('toan_tu_duy') && item.subject === 'Toán tư duy') return true
        return false
      })
    }

    // Filter by CS Staff
    if (selectedCSStaff.size > 0) {
      res = res.filter((item) => selectedCSStaff.has(item.csStaff))
    }

    // Filter by Teachers
    if (selectedTeachers.size > 0) {
      res = res.filter((item) => {
        const tCodes = item.teacherCode ? item.teacherCode.split(/[,;\s/]+/).map((t) => t.trim()) : []
        const subCodes = item.substituteTeacher ? item.substituteTeacher.split(/[,;\s/]+/).map((t) => t.trim()) : []
        return Array.from(selectedTeachers).some((t) => tCodes.includes(t) || subCodes.includes(t))
      })
    }

    // Filter by order status
    if (selectedOrderStatuses.size > 0) {
      res = res.filter((item) => {
        const order = getStudentOrderInfo(item)
        if (selectedOrderStatuses.has('has_order') && order.orderCode) return true
        if (selectedOrderStatuses.has('no_order') && !order.orderCode) return true
        if (selectedOrderStatuses.has('paid') && order.paymentTerm && (order.paymentTerm.includes('100%') || order.paymentTerm.includes('cọc'))) return true
        return false
      })
    }

    // Filter by classCode
    if (selectedClasses.size > 0) {
      res = res.filter((item) => selectedClasses.has(item.classCode))
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

    // Filter by student status (Trạng thái học viên chuẩn từ app/students)
    if (selectedStudentStatus !== 'all') {
      res = res.filter((item) => {
        const student = mockStudents.find(
          (s) => s.id === item.studentId || s.name === item.studentName
        )
        if (student) {
          return student.status === selectedStudentStatus
        }
        if (selectedStudentStatus === 'active' && item.status === 'Đang học') return true
        if (selectedStudentStatus === 'pending_transfer' && item.status === 'Chờ chuyển lớp') return true
        if (selectedStudentStatus === 'session_ended' && item.status === 'Hết buổi') return true
        return false
      })
    }

    // Filter by expected expiration period (Hạn T1: <= 30 ngày hoặc <= 5 buổi, Hạn T2: 31-60 ngày, Hạn T3: 61-90 ngày)
    if (selectedExpiryPeriod !== 'all') {
      res = res.filter((item) => {
        if (!item.expectedEndDate) return false
        const parts = item.expectedEndDate.split('/')
        if (parts.length < 3) return false
        const day = parseInt(parts[0], 10)
        const month = parseInt(parts[1], 10)
        const year = parseInt(parts[2], 10)
        const itemDate = new Date(year, month - 1, day)
        
        // Simulated base date for demo (2026-07-15)
        const baseDate = new Date(2026, 6, 15)
        const diffDays = Math.round((itemDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24))

        if (selectedExpiryPeriod === '1') {
          // Hạn T1 (≤ 1T): hết hạn trong vòng 30 ngày tới hoặc cận buổi (<= 5 buổi)
          return diffDays <= 30 || item.remainingSessions <= 5
        }
        if (selectedExpiryPeriod === '2') {
          // Hạn T2 (1-2T): 31 - 60 ngày
          return diffDays > 30 && diffDays <= 60
        }
        if (selectedExpiryPeriod === '3') {
          // Hạn T3 (2-3T): 61 - 90 ngày
          return diffDays > 60 && diffDays <= 90
        }
        return true
      })
    }

    return res.filter(hasActiveTags)
  }, [
    selectedBranches,
    selectedRenewalStatuses,
    selectedFeeDueMonths,
    selectedCalls,
    selectedStatuses,
    selectedSubjectsFilter,
    selectedPrograms,
    selectedLevels,
    selectedCSStaff,
    selectedTeachers,
    selectedOrderStatuses,
    selectedClasses,
    searchQuery,
    selectedToolbarBranch,
    selectedSubject,
    selectedStudentStatus,
    selectedExpiryPeriod,
    customStartDate,
    customEndDate,
    refreshTrigger,
    dataScope,
    currentStaffName,
    currentBranch,
  ])

  // Compute care progress tiles from baseFiltered
  const careProgressTiles: StatusTile<string>[] = useMemo(() => {
    const moiCount = baseFiltered.filter(isMoi).length
    const canNhacCount = baseFiltered.filter(isCanNhac).length
    const tiemNangCount = baseFiltered.filter(isTiemNang).length
    const henTaiCount = baseFiltered.filter(isHenTai).length
    const taiPhiCount = baseFiltered.filter(isDaTaiPhi).length
    
    return [
      { id: 'all', label: 'Tất cả', count: baseFiltered.length, semantic: 'neutral' as const },
      { id: 'moi', label: 'Mới', count: moiCount, semantic: 'neutral' as const },
      { id: 'can_nhac', label: 'Cân nhắc', count: canNhacCount, semantic: 'warning' as const },
      { id: 'tiem_nang', label: 'Tiềm năng', count: tiemNangCount, semantic: 'info' as const },
      { id: 'hen_tai', label: 'Hẹn tái', count: henTaiCount, semantic: 'purple' as const },
      { id: 'tai_phi', label: 'Đã tái phí', count: taiPhiCount, semantic: 'success' as const }
    ]
  }, [baseFiltered])

  // 3. Apply care progress tab filter & sort by expectedEndDate ascending (nearest to furthest)
  const filtered = useMemo(() => {
    let result = baseFiltered
    if (careProgressTab === 'moi') result = baseFiltered.filter(isMoi)
    else if (careProgressTab === 'can_nhac') result = baseFiltered.filter(isCanNhac)
    else if (careProgressTab === 'tiem_nang') result = baseFiltered.filter(isTiemNang)
    else if (careProgressTab === 'hen_tai') result = baseFiltered.filter(isHenTai)
    else if (careProgressTab === 'tai_phi') result = baseFiltered.filter(isDaTaiPhi)
    else if (careProgressTab === 'that_bai') result = baseFiltered.filter(isThatBai)

    return [...result].sort((a, b) => {
      const parseDate = (dateStr?: string) => {
        if (!dateStr) return Infinity
        const parts = dateStr.split('/')
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10)
          const month = parseInt(parts[1], 10)
          const year = parseInt(parts[2], 10)
          return new Date(year, month - 1, day).getTime()
        }
        return Infinity
      }

      const timeA = parseDate(a.expectedEndDate)
      const timeB = parseDate(b.expectedEndDate)

      // Tầng 1: Ngày hết hạn dự kiến gần nhất lên trước
      if (timeA !== timeB) {
        return timeA - timeB
      }

      // Tầng 2: Số buổi còn lại ít nhất lên trước
      if (a.remainingSessions !== b.remainingSessions) {
        return a.remainingSessions - b.remainingSessions
      }

      // Tầng 3 (Tùy chọn B): Thời điểm tương tác gần nhất (Ưu tiên ca chưa chăm sóc hoặc tương tác lâu nhất lên đầu)
      const getLastInteractionTime = (item: StudentCareAlert) => {
        if (!item.interactionLogs || item.interactionLogs.length === 0) {
          return 0 // Chưa từng tương tác -> Ưu tiên cao nhất (nổi lên đầu)
        }
        const dates = item.interactionLogs
          .map((log) => parseDate(log.date))
          .filter((t) => t !== Infinity)
        return dates.length > 0 ? Math.max(...dates) : 0
      }

      const lastTimeA = getLastInteractionTime(a)
      const lastTimeB = getLastInteractionTime(b)
      return lastTimeA - lastTimeB
    })
  }, [baseFiltered, careProgressTab])

  const paginatedSingle = useMemo(() => {
    const start = (pageSingle - 1) * pageSizeSingle
    return filtered.slice(start, start + pageSizeSingle)
  }, [filtered, pageSingle, pageSizeSingle])





  const handleOpenCallModal = (student: StudentCareAlert) => {
    const contacts = getFamilyContacts(student.studentId, student.studentName)
    const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0]
    
    startCall({
      studentId: student.studentId,
      studentName: student.studentName,
      parentPhone: primaryContact?.phone || '0912345678',
      parentName: primaryContact
        ? `${primaryContact.name}${primaryContact.relationship ? ` (${primaryContact.relationship})` : ''}`
        : 'Phụ huynh',
    })
  }



  // 6. Save Interaction handler


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
      selectedSubjectsFilter.size > 0,
      selectedPrograms.size > 0 || selectedLevels.size > 0,
      selectedRenewalStatuses.size > 0,
      selectedFeeDueMonths.size > 0 || Boolean(customStartDate) || Boolean(customEndDate),
      selectedCalls.size > 0,
      selectedCSStaff.size > 0,
      selectedTeachers.size > 0,
      selectedStatuses.size > 0,
      selectedOrderStatuses.size > 0,
      selectedClasses.size > 0,
    ].filter(Boolean).length
  }, [
    selectedBranches,
    selectedSubjectsFilter,
    selectedPrograms,
    selectedLevels,
    selectedRenewalStatuses,
    selectedFeeDueMonths,
    customStartDate,
    customEndDate,
    selectedCalls,
    selectedCSStaff,
    selectedTeachers,
    selectedStatuses,
    selectedOrderStatuses,
    selectedClasses,
  ])

  // Advanced Filters Sheet configuration sections (strictly tailored for Tuition Fee Renewal)
  const filterGroups = useMemo(() => {
    return buildRenewalFilterGroups({
      branchOptions,
      selectedBranches,
      selectedSubjectsFilter,
      selectedPrograms,
      selectedLevels,
      onToggleProgram: (progId) => {
        setSelectedPrograms((prev) => {
          const next = new Set(prev)
          if (next.has(progId)) next.delete(progId)
          else next.add(progId)
          return next
        })
        resetPagination()
      },
      onToggleLevel: (lvlId) => {
        setSelectedLevels((prev) => {
          const next = new Set(prev)
          if (next.has(lvlId)) next.delete(lvlId)
          else next.add(lvlId)
          return next
        })
        resetPagination()
      },
      selectedRenewalStatuses,
      selectedFeeDueMonths,
      customStartDate,
      customEndDate,
      onStartDateChange: (date) => {
        setCustomStartDate(date)
        resetPagination()
      },
      onEndDateChange: (date) => {
        setCustomEndDate(date)
        resetPagination()
      },
      onClearDates: () => {
        setCustomStartDate('')
        setCustomEndDate('')
        resetPagination()
      },
      selectedCalls,
      csStaffOptions,
      selectedCSStaff,
      teacherOptions,
      selectedTeachers,
      selectedStatuses,
      selectedOrderStatuses,
      classList,
      selectedClasses,
    })
  }, [
    branchOptions,
    selectedBranches,
    selectedSubjectsFilter,
    selectedPrograms,
    selectedLevels,
    selectedRenewalStatuses,
    selectedFeeDueMonths,
    customStartDate,
    customEndDate,
    selectedCalls,
    csStaffOptions,
    selectedCSStaff,
    teacherOptions,
    selectedTeachers,
    selectedStatuses,
    selectedOrderStatuses,
    classList,
    selectedClasses,
  ])

  const handleFilterToggle = (groupId: string, value: string) => {
    const updateSet = (prev: Set<string>) => {
      const next = new Set(prev)
      if (next.has(value)) {
        next.delete(value)
      } else {
        next.add(value)
      }
      return next
    }
    
    if (groupId === 'branches') setSelectedBranches(updateSet)
    else if (groupId === 'subjects') setSelectedSubjectsFilter(updateSet)
    else if (groupId === 'renewalStatuses') setSelectedRenewalStatuses(updateSet)
    else if (groupId === 'feeDueMonths') setSelectedFeeDueMonths(updateSet)
    else if (groupId === 'callConfirmations') setSelectedCalls(updateSet)
    else if (groupId === 'csStaff') setSelectedCSStaff(updateSet)
    else if (groupId === 'teachers') setSelectedTeachers(updateSet)
    else if (groupId === 'statuses') setSelectedStatuses(updateSet)
    else if (groupId === 'orderStatus') setSelectedOrderStatuses(updateSet)
    else if (groupId === 'classes') setSelectedClasses(updateSet)
    
    resetPagination()
  }

  const handleClearAllFilters = () => {
    setSelectedBranches(new Set())
    setSelectedSubjectsFilter(new Set())
    setSelectedPrograms(new Set())
    setSelectedLevels(new Set())
    setSelectedRenewalStatuses(new Set())
    setSelectedFeeDueMonths(new Set())
    setCustomStartDate('')
    setCustomEndDate('')
    setSelectedCalls(new Set())
    setSelectedCSStaff(new Set())
    setSelectedTeachers(new Set())
    setSelectedStatuses(new Set())
    setSelectedOrderStatuses(new Set())
    setSelectedClasses(new Set())
    resetPagination()
  }

  const handleClearSection = (groupId: string) => {
    if (groupId === 'branches') setSelectedBranches(new Set())
    else if (groupId === 'subjects') setSelectedSubjectsFilter(new Set())
    else if (groupId === 'programs') {
      setSelectedPrograms(new Set())
      setSelectedLevels(new Set())
    }
    else if (groupId === 'renewalStatuses') setSelectedRenewalStatuses(new Set())
    else if (groupId === 'feeDueMonths') {
      setSelectedFeeDueMonths(new Set())
      setCustomStartDate('')
      setCustomEndDate('')
    }
    else if (groupId === 'callConfirmations') setSelectedCalls(new Set())
    else if (groupId === 'csStaff') setSelectedCSStaff(new Set())
    else if (groupId === 'teachers') setSelectedTeachers(new Set())
    else if (groupId === 'statuses') setSelectedStatuses(new Set())
    else if (groupId === 'orderStatus') setSelectedOrderStatuses(new Set())
    else if (groupId === 'classes') setSelectedClasses(new Set())
    resetPagination()
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
        initialTab="renewal"
        headerTitle="Chi tiết Tái phí"
      />
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <RenewalToolbar
        alerts={filtered}
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); resetPagination() }}
        activeFilterCount={activeFilterCount}
        onOpenFilter={() => setIsFilterOpen(true)}
        selectedBranch={selectedToolbarBranch}
        onBranchChange={(b) => { setSelectedToolbarBranch(b); resetPagination() }}
        branchOptions={branchOptions}
        selectedSubject={selectedSubject}
        onSubjectChange={(s) => { setSelectedSubject(s); resetPagination() }}
        selectedStudentStatus={selectedStudentStatus}
        onStudentStatusChange={(s) => { setSelectedStudentStatus(s); resetPagination() }}
        careProgressTab={careProgressTab}
        onCareProgressTabChange={(t) => { setCareProgressTab(t); resetPagination() }}
        careProgressTiles={careProgressTiles}
        selectedExpiryPeriod={selectedExpiryPeriod}
        onExpiryPeriodChange={(p) => { setSelectedExpiryPeriod(p); resetPagination() }}
      />

      <div className="flex flex-1 min-h-0 w-full gap-3 overflow-hidden px-2 py-1.5 lg:px-3 pb-3">
        <div className="flex-1 min-w-0 h-full overflow-hidden flex flex-col">
          <RenewalTable
            alerts={paginatedSingle}
            selectedIds={selectedIds}
            onSelectChange={handleSelectChange}
            onSelectAll={(checked) => {
              setSelectedIds((prev) => {
                const otherIds = prev.filter((id) => !paginatedSingle.some((x) => x.id === id))
                return checked ? [...otherIds, ...paginatedSingle.map((x) => x.id)] : otherIds
              })
            }}
            className="border-zinc-200 dark:border-zinc-800 flex-1 min-h-0"
            pagination={{
              page: pageSingle,
              total: filtered.length,
              pageSize: pageSizeSingle,
              onPageChange: setPageSingle,
              onPageSizeChange: setPageSizeSingle,
            }}
            viewMode={careViewMode}
            onOpenCallModal={handleOpenCallModal}
            onRefresh={() => setRefreshTrigger(prev => prev + 1)}
            onViewDetail={(id) => {
              setActiveDetailStudentId(id)
            }}
          />
        </div>

        {isFilterOpen && (
          <FilterGroupAsidePanel
            title="Bộ lọc nâng cao"
            description="Kết hợp bộ lọc để tìm kiếm học viên chính xác."
            groups={filterGroups}
            onToggle={handleFilterToggle}
            onClearAll={handleClearAllFilters}
            onClearSection={handleClearSection}
            onClose={() => setIsFilterOpen(false)}
          >
            {/* Search inside filter panel as requested */}
            <div className="mb-4">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                Tìm theo học viên
              </label>
              <input
                type="text"
                placeholder="Nhập tên, SĐT hoặc mã học viên..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  resetPagination()
                }}
                className="w-full h-9 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-background text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </FilterGroupAsidePanel>
        )}
      </div>

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

