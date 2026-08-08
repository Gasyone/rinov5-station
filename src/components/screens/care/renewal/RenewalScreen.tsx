/* eslint-disable react-hooks/preserve-manual-memoization */
'use client'

import { useMemo, useState } from 'react'
import { getCareAlerts, mockCareAlerts, getFamilyContacts, type StudentCareAlert } from '@/mocks/careAlerts'
import { mockStudents } from '@/mocks/students'
import { RenewalTable } from './RenewalTable'
import { RenewalToolbar } from './RenewalToolbar'
import { StudentCareDetailPage } from '../StudentCareDetailPage'
import { useCallStore } from '@/stores/useCallStore'
import { FilterGroupSheetPanel, createFilterGroup } from '@/components/filters'
import type { StatusTile } from '@/components/shared'
import { RenewalDashboardView } from './RenewalDashboardView'
import { toast } from 'sonner'
import { stableHash, getRenewalClassification } from './renewalHelpers'

// Helper functions for tag extraction
function getStudentActiveTags(item: StudentCareAlert) {
  const tags = [];
  const hash = stableHash(item.studentId);
  const avgScore = ((item.lastTestScore + item.priorTestScore) / 2).toFixed(1);
  
  // 1. CS Đặc biệt (Red / Error) -> ĐB
  if (item.careAlert === 'C90B' || item.homeworkCompletion < 70 || parseFloat(avgScore) < 5.0) {
    tags.push('ĐB1');
  }
  
  // 2. CS Định kỳ (Purple) -> ĐK
  if (hash % 3 === 0) {
    tags.push('ĐK1');
    tags.push('ĐK2');
  } else if (hash % 4 === 0) {
    tags.push('ĐK1');
  }
  
  // 3. CS Theo buổi (Warning / Amber) -> TB
  if (item.remainingSessions <= 5 || hash % 5 === 0) {
    tags.push('TB1');
  }
  if (hash % 6 === 0) {
    tags.push('TB2');
  }

  // 4. CS Tái phí (Success / Green) -> CSTP
  tags.push('CSTP');
  
  const completed = item.completedCareTags || [];
  return tags.filter(tag => !completed.includes(tag));
}

function hasActiveTags(item: StudentCareAlert) {
  return getStudentActiveTags(item).length > 0;
}

// Helper predicates for tuition renewal care progress
const isMoi = (item: StudentCareAlert) => getRenewalClassification(item) === 'moi'
const isCanNhac = (item: StudentCareAlert) => getRenewalClassification(item) === 'can_nhac'
const isTiemNang = (item: StudentCareAlert) => getRenewalClassification(item) === 'tiem_nang'
const isHenTai = (item: StudentCareAlert) => getRenewalClassification(item) === 'hen_tai'
const isDaTaiPhi = (item: StudentCareAlert) => getRenewalClassification(item) === 'tai_phi'
const isThatBai = (item: StudentCareAlert) => getRenewalClassification(item) === 'that_bai'


export function RenewalScreen() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDetailStudentId, setActiveDetailStudentId] = useState<string | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const careViewMode = 'total'
  const [selectedToolbarBranch, setSelectedToolbarBranch] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedStudentStatus, setSelectedStudentStatus] = useState('all')
  const [careProgressTab, setCareProgressTab] = useState('all')

  // Advanced filters state (Sets for multi-select checkboxes)
  const [selectedBranches, setSelectedBranches] = useState<Set<string>>(new Set())
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set())
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set())
  const [selectedCalls, setSelectedCalls] = useState<Set<string>>(new Set())
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set())
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Pagination states for the unified table
  const [pageSingle, setPageSingle] = useState(1)
  const [pageSizeSingle, setPageSizeSingle] = useState(20)

  const [selectedMonth, setSelectedMonth] = useState('all')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'dashboard'>('table')

  const exportFields = [
    { id: 'studentId', label: 'Mã học viên', defaultChecked: true },
    { id: 'customerCode', label: 'Mã khách hàng', defaultChecked: true },
    { id: 'studentName', label: 'Họ và tên học viên', defaultChecked: true },
    { id: 'productName', label: 'Gói sản phẩm hiện tại', defaultChecked: true },
    { id: 'expectedEndDate', label: 'Hạn kết thúc học phí dự kiến', defaultChecked: true },
    { id: 'remainingSessions', label: 'Số buổi học còn lại', defaultChecked: true },
    { id: 'subjectAndSchedule', label: 'Môn học & Lịch học', defaultChecked: true },
    { id: 'officialRenewalStatus', label: 'Phân loại tái phí thực tế', defaultChecked: true },
    { id: 'virtualRenewalStatus', label: 'Phân loại tái phí ảo', defaultChecked: true },
    { id: 'latestRenewalNote', label: 'Ghi chú tương tác tái phí gần nhất', defaultChecked: true },
    { id: 'csStaff', label: 'Người phụ trách chăm sóc', defaultChecked: true }
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

  const startCall = useCallStore((state) => state.startCall)

  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Helper to reset pagination when filters change
  const resetPagination = () => {
    setPageSingle(1)
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
    refreshTrigger
    // Base alerts from mock
    const baseAlerts = getCareAlerts()
    let res = baseAlerts

    // Exclude 'that_bai' from base tab pool unless explicitly selected in advanced filters
    const includesThatBai = selectedCalls.has('that_bai') || selectedCalls.has('Thất bại')
    if (!includesThatBai) {
      res = res.filter(item => !isThatBai(item))
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

    // Filter by status
    if (selectedStatuses.size > 0) {
      res = res.filter((item) => selectedStatuses.has(item.status))
    }

    // Filter by careAlert
    if (selectedAlerts.size > 0) {
      res = res.filter((item) => item.careAlert && selectedAlerts.has(item.careAlert))
    }

    // Filter by callConfirmation & renewal status (including Thất bại)
    if (selectedCalls.size > 0) {
      res = res.filter((item) => {
        if (item.callConfirmation && selectedCalls.has(item.callConfirmation)) return true
        if ((selectedCalls.has('that_bai') || selectedCalls.has('Thất bại')) && isThatBai(item)) return true
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

    // Filter by tuition renewal care status (callConfirmation)
    if (selectedStudentStatus !== 'all') {
      res = res.filter((item) => item.callConfirmation === selectedStudentStatus)
    }

    // Filter by expected expiration month (with Dec/Jan transition support) or custom range
    if (selectedMonth !== 'all') {
      res = res.filter((item) => {
        if (!item.expectedEndDate) return false
        const parts = item.expectedEndDate.split('/')
        if (parts.length < 3) return false
        const day = parseInt(parts[0], 10)
        const month = parseInt(parts[1], 10)
        const year = parseInt(parts[2], 10)
        const itemDate = new Date(year, month - 1, day)

        if (selectedMonth === 'custom') {
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
        
        if (selectedMonth === '1') {
          return month === 1 || month === 12
        }
        if (selectedMonth === '12') {
          return month === 12 || month === 1
        }
        return month === parseInt(selectedMonth, 10)
      })
    }

    return res.filter(hasActiveTags)
  }, [
    selectedBranches,
    selectedStatuses,
    selectedAlerts,
    selectedCalls,
    selectedClasses,
    searchQuery,
    selectedToolbarBranch,
    selectedSubject,
    selectedStudentStatus,
    selectedMonth,
    customStartDate,
    customEndDate,
    refreshTrigger
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
      const parseDate = (dateStr: string) => {
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
      return parseDate(a.expectedEndDate) - parseDate(b.expectedEndDate)
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
      parentName: primaryContact ? `GĐ ${student.studentName.split(' ').pop()?.toUpperCase()}` : 'Phụ huynh',
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
      selectedStatuses.size > 0,
      selectedAlerts.size > 0,
      selectedCalls.size > 0,
      selectedClasses.size > 0,
    ].filter(Boolean).length
  }, [selectedBranches, selectedStatuses, selectedAlerts, selectedCalls, selectedClasses])

  // Advanced Filters Sheet configuration sections
  const filterGroups = useMemo(() => {
    return [
      createFilterGroup({
        id: 'branches',
        title: 'Trường',
        options: branchOptions,
        selectedValues: selectedBranches,
        defaultOpen: true,
      }),
      createFilterGroup({
        id: 'statuses',
        title: 'Trạng thái học',
        options: [
          { value: 'Đang học', label: 'Đang học' },
          { value: 'Chờ chuyển lớp', label: 'Chờ chuyển lớp' },
          { value: 'Hết buổi', label: 'Hết buổi' },
        ],
        selectedValues: selectedStatuses,
        defaultOpen: true,
      }),
      createFilterGroup({
        id: 'careAlerts',
        title: 'Cảnh báo CS',
        options: [
          { value: 'C90B', label: 'Cảnh báo C90B' },
          { value: 'Học lực yếu', label: 'Học lực yếu' },
          { value: 'Chuyên cần thấp', label: 'Chuyên cần thấp' },
        ],
        selectedValues: selectedAlerts,
        defaultOpen: true,
      }),
      createFilterGroup({
        id: 'callConfirmations',
        title: 'Trạng thái CS & Tái phí',
        options: [
          { value: 'Đã gọi', label: 'Đã gọi' },
          { value: 'KNM', label: 'Không nghe máy (KNM)' },
          { value: 'Đã nhắn Zalo', label: 'Đã nhắn Zalo' },
          { value: 'Chưa gọi', label: 'Chưa gọi / Liên hệ' },
          { value: 'that_bai', label: 'Thất bại' },
        ],
        selectedValues: selectedCalls,
        defaultOpen: true,
      }),
      createFilterGroup({
        id: 'classes',
        title: 'Lớp học',
        options: classList,
        selectedValues: selectedClasses,
        defaultOpen: false,
        searchable: true,
        scrollable: true,
      }),
    ]
  }, [branchOptions, selectedBranches, selectedStatuses, selectedAlerts, selectedCalls, classList, selectedClasses])

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
    else if (groupId === 'statuses') setSelectedStatuses(updateSet)
    else if (groupId === 'careAlerts') setSelectedAlerts(updateSet)
    else if (groupId === 'callConfirmations') setSelectedCalls(updateSet)
    else if (groupId === 'classes') setSelectedClasses(updateSet)
    
    resetPagination()
  }

  const handleClearAllFilters = () => {
    setSelectedBranches(new Set())
    setSelectedStatuses(new Set())
    setSelectedAlerts(new Set())
    setSelectedCalls(new Set())
    setSelectedClasses(new Set())
    resetPagination()
  }

  const handleClearSection = (groupId: string) => {
    if (groupId === 'branches') setSelectedBranches(new Set())
    else if (groupId === 'statuses') setSelectedStatuses(new Set())
    else if (groupId === 'careAlerts') setSelectedAlerts(new Set())
    else if (groupId === 'callConfirmations') setSelectedCalls(new Set())
    else if (groupId === 'classes') setSelectedClasses(new Set())
    resetPagination()
  }

  if (activeDetailStudentId) {
    return (
      <StudentCareDetailPage
        studentId={activeDetailStudentId}
        onBack={() => {
          setActiveDetailStudentId(null)
          setIsDetailOpen(false)
        }}
        alerts={mockCareAlerts}
        onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
        onStudentSelect={(id) => setActiveDetailStudentId(id)}
        initialTab="orders"
      />
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <RenewalToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); resetPagination() }}
        activeFilterCount={activeFilterCount}
        alertsCount={filtered.length}
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
        selectedMonth={selectedMonth}
        onMonthChange={(m) => { setSelectedMonth(m); resetPagination() }}
        exportFields={exportFields}
        onConfirmExport={handleConfirmExport}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === 'dashboard' ? (
        <RenewalDashboardView alerts={filtered} />
      ) : (
        <div className="min-h-0 flex-1 px-2 py-1.5 lg:px-3 pb-3 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 flex flex-col">
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
              setIsDetailOpen(true)
            }}
          />
        </div>
      </div>
      )}



      {/* Advanced Filters Sheet Panel */}
      <FilterGroupSheetPanel
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        title="Bộ lọc nâng cao"
        description="Kết hợp bộ lọc để tìm kiếm học viên chính xác."
        groups={filterGroups}
        onToggle={handleFilterToggle}
        onClearAll={handleClearAllFilters}
        onClearSection={handleClearSection}
      >
        {/* Search inside filter panel as requested */}
        <div className="mb-4">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
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
      </FilterGroupSheetPanel>

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

