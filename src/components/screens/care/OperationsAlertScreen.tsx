'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { getCareAlerts, mockCareAlerts, updateCareAlertInteraction, triggerCareAlertCalculation, type StudentCareAlert } from '@/mocks/careAlerts'
import { mockStudents } from '@/mocks/students'
import { OperationsAlertDetailDrawer } from './OperationsAlertDetailDrawer'
import { OperationsAlertTable } from './OperationsAlertTable'
import { OperationsAlertToolbar } from './OperationsAlertToolbar'
import { filterAlertData } from './operationsAlertHelpers'

export function OperationsAlertScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [branchFilter, setBranchFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [alertFilter, setAlertFilter] = useState('all')
  const [callFilter, setCallFilter] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
  const [classStatusTab, setClassStatusTab] = useState('all')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const [selectedStudent, setSelectedStudent] = useState<StudentCareAlert | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // 1. Get class list for filters
  const classList = useMemo(() => {
    const list = mockCareAlerts.map((item) => item.classCode)
    return Array.from(new Set(list)).sort()
  }, [])

  const branchOptions = useMemo(
    () => Array.from(new Set(mockStudents.map((student) => student.branch).filter(Boolean))).sort(),
    []
  )

  // 2. Perform search and filtering logic
  const filtered = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    refreshTrigger; // Trigger recalculation
    
    // Base alerts from mock
    const baseAlerts = getCareAlerts()
    
    // Apply UI filtering logic
    const res = filterAlertData(baseAlerts, {
      search: searchQuery,
      status: statusFilter,
      careAlert: alertFilter,
      classCode: classFilter,
      callConfirmation: callFilter
    })

    // Filter by class operational status tab
    if (classStatusTab !== 'all') {
      return res.filter((item) => item.realtimeStatus === classStatusTab)
    }
    return res
  }, [searchQuery, statusFilter, alertFilter, classFilter, callFilter, classStatusTab, refreshTrigger])

  // 3. Pagination calculations
  const totalRecords = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedRecords = useMemo(() => {
    return filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  }, [filtered, currentPage, pageSize])

  // 4. Synchronize data action simulation
  const handleSyncData = () => {
    setIsSyncing(true)
    setTimeout(() => {
      triggerCareAlertCalculation()
      setIsSyncing(false)
      setRefreshTrigger((prev) => prev + 1)
      toast.success('Đồng bộ chỉ số và cập nhật dữ liệu vận hành thành công!')
    }, 800)
  }

  // 5. Open Tagnhep/Drawer
  const handleTagnhep = (student: StudentCareAlert) => {
    setSelectedStudent(student)
    setDrawerOpen(true)
  }

  // 6. Save Interaction handler
  const handleSaveInteraction = (
    id: string,
    log: {
      callConfirmation: StudentCareAlert['callConfirmation']
      notes: string
    },
    confirmC90B?: StudentCareAlert['confirmC90B']
  ) => {
    const success = updateCareAlertInteraction(
      id,
      {
        callConfirmation: log.callConfirmation,
        notes: log.notes,
        staffName: 'AnhNTN33'
      },
      confirmC90B
    )
    if (success) {
      setRefreshTrigger((prev) => prev + 1)
      toast.success('Ghi chú cuộc gọi & Cập nhật trạng thái thành công!')
    } else {
      toast.error('Có lỗi xảy ra khi lưu tương tác!')
    }
  }

  // 7. Checkbox selection handlers
  const handleSelectChange = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    )
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? pagedRecords.map((x) => x.id) : [])
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <OperationsAlertToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setPage(1) }}
        branchFilter={branchFilter}
        branchOptions={branchOptions}
        onBranchChange={(b) => { setBranchFilter(b); setPage(1) }}
        statusFilter={statusFilter}
        onStatusChange={(s) => { setStatusFilter(s); setPage(1) }}
        alertFilter={alertFilter}
        onAlertChange={(a) => { setAlertFilter(a); setPage(1) }}
        callFilter={callFilter}
        onCallChange={(c) => { setCallFilter(c); setPage(1) }}
        classFilter={classFilter}
        onClassChange={(c) => { setClassFilter(c); setPage(1) }}
        onSyncData={handleSyncData}
        isSyncing={isSyncing}
        classList={classList}
        classStatusTab={classStatusTab}
        onClassStatusTabChange={(t) => { setClassStatusTab(t); setPage(1) }}
      />

      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-2 lg:px-6 lg:pb-6">
        <DataTableFrame
          footer={
            <DataTablePagination
              page={currentPage}
              total={totalRecords}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          }
        >
          <OperationsAlertTable
            alerts={pagedRecords}
            onTagnhep={handleTagnhep}
            selectedIds={selectedIds}
            onSelectChange={handleSelectChange}
            onSelectAll={handleSelectAll}
          />
        </DataTableFrame>
      </div>

      <OperationsAlertDetailDrawer
        key={selectedStudent?.id || 'none'}
        student={selectedStudent}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onSaveInteraction={handleSaveInteraction}
      />
    </div>
  )
}
