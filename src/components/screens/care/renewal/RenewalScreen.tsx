'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import {
  updateRenewalRecordAction,
  runMonthEndSimulation,
  getCareStage,
  mockRenewalRecords,
  addRenewalRecord,
  type RenewalCareRecord
} from '@/mocks/renewalCare'
import { mockStudents } from '@/mocks/students'
import { RenewalToolbar } from './RenewalToolbar'
import { RenewalTable } from './RenewalTable'
import { RenewalActionDialog } from './RenewalActionDialog'
import { RenewalAddDialog } from './RenewalAddDialog'
import { filterRenewalData } from './renewalHelpers'
import { RenewalStageFilter } from './renewalTypes'
import { type StudentOption } from '@/components/controls'


export function RenewalScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [branchFilter, setBranchFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
  const [stageFilter, setStageFilter] = useState<RenewalStageFilter>('T')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const [selectedRecord, setSelectedRecord] = useState<RenewalCareRecord | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Student options for manual addition combobox
  const studentOptions = useMemo<StudentOption[]>(() => {
    return mockStudents.map((s) => ({
      id: s.id,
      label: s.name,
      familyName: s.parentName,
      phone: s.phone
    }))
  }, [])

  const branchOptions = useMemo(
    () => Array.from(new Set(mockStudents.map((student) => student.branch).filter(Boolean))).sort(),
    []
  )

  // Handle adding new renewal record
  const handleAddRenewal = (newRecord: Omit<RenewalCareRecord, 'id' | 'renewalStatus' | 'subStatus' | 'resultType' | 'interactionLogs'>) => {
    const record = addRenewalRecord(newRecord)
    setRefreshTrigger((prev) => prev + 1)
    toast.success(`Đã thêm học viên ${record.studentName} vào danh sách chăm sóc tái phí lớp ${record.classCode}!`)
  }


  // 1. Get class list for filters
  const classList = useMemo(() => {
    const list = mockRenewalRecords.map((item) => item.classCode)
    return Array.from(new Set(list)).sort()
  }, [])

  // 2. Tab counts calculations
  const counts = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    refreshTrigger // Recalculate on refresh
    let past = 0
    let present = 0
    let future = 0

    mockRenewalRecords.forEach((item) => {
      const stage = getCareStage(item.expirationDate)
      if (stage === 'T-1') past++
      else if (stage === 'T') present++
      else if (stage === 'T+1' || stage === 'T+2') future++
    })

    return { past, present, future }
  }, [refreshTrigger])

  // 3. Perform search and filtering logic
  const filtered = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    refreshTrigger; // Trigger recalculation
    
    // Base records from mock
    const baseRecords = mockRenewalRecords
    
    // Apply UI filtering logic
    return filterRenewalData(baseRecords, {
      search: searchQuery,
      branch: branchFilter,
      renewalStatus: statusFilter,
      classCode: classFilter,
      stage: stageFilter
    })
  }, [searchQuery, branchFilter, statusFilter, classFilter, stageFilter, refreshTrigger])

  // 4. Pagination calculations
  const totalRecords = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedRecords = useMemo(() => {
    return filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  }, [filtered, currentPage, pageSize])

  // 5. Synchronize data action simulation (Simulates T Month End)
  const handleSyncData = () => {
    setIsSyncing(true)
    setTimeout(() => {
      const affected = runMonthEndSimulation()
      setIsSyncing(false)
      setRefreshTrigger((prev) => prev + 1)
      if (affected) {
        toast.success(`Giả lập hết tháng thành công! Tự động quét và chuyển ${affected} hồ sơ quá hạn (Tháng T) sang Thất bại.`)
      } else {
        toast.info('Đã đồng bộ chỉ số tái phí mới nhất. Không phát sinh hồ sơ quá hạn mới.')
      }
    }, 800)
  }

  // 6. Open Action Dialog
  const handleTagnhep = (record: RenewalCareRecord) => {
    setSelectedRecord(record)
    setDialogOpen(true)
  }

  // 7. Save Action handler
  const handleSaveAction = (
    id: string,
    actionType: 'Khách cọc' | 'Hoàn tất' | 'Đóng full' | 'Từ chối' | 'Liên hệ lại',
    notes: string,
    churnReason?: 'Học phí cao' | 'Chuyển nơi ở' | 'Không tiến bộ' | 'Trùng lịch học' | 'Dịch vụ chưa tốt' | 'Khác'
  ) => {
    const success = updateRenewalRecordAction(id, actionType, notes, churnReason)
    if (success) {
      setRefreshTrigger((prev) => prev + 1)
      if (actionType === 'Khách cọc') {
        toast.success('Đặt cọc thành công! Hệ thống tự động gia hạn ngày hết hạn thêm 30 ngày.')
      } else if (actionType === 'Từ chối') {
        toast.error('Ghi nhận từ chối tái phí thành công!')
      } else {
        toast.success(`Cập nhật trạng thái thành công: ${actionType}!`)
      }
    } else {
      toast.error('Có lỗi xảy ra khi cập nhật tác nghiệp!')
    }
  }

  // 8. Checkbox selection handlers
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
      <RenewalToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setPage(1) }}
        branchFilter={branchFilter}
        branchOptions={branchOptions}
        onBranchChange={(b) => { setBranchFilter(b); setPage(1) }}
        statusFilter={statusFilter}
        onStatusChange={(s) => { setStatusFilter(s); setPage(1) }}
        classFilter={classFilter}
        onClassChange={(c) => { setClassFilter(c); setPage(1) }}
        stageFilter={stageFilter}
        onStageChange={(s) => { setStageFilter(s); setPage(1) }}
        onSyncData={handleSyncData}
        isSyncing={isSyncing}
        classList={classList}
        counts={counts}
        onAddClick={() => setAddDialogOpen(true)}
      />

      <div className="min-h-0 flex-1 overflow-hidden px-3 pb-3 pt-1 lg:px-4 lg:pb-4 flex flex-col gap-2">
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
          <RenewalTable
            records={pagedRecords}
            onTagnhep={handleTagnhep}
            selectedIds={selectedIds}
            onSelectChange={handleSelectChange}
            onSelectAll={handleSelectAll}
          />
        </DataTableFrame>
      </div>

      <RenewalActionDialog
        key={selectedRecord?.id || 'none'}
        record={selectedRecord}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaveAction={handleSaveAction}
      />

      <RenewalAddDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        studentOptions={studentOptions}
        onAdd={handleAddRenewal}
      />
    </div>
  )
}

