'use client'

import { useCallback, useMemo, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { ExpandableSearch, ToolbarSelect } from '@/components/controls'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { CareScheduleTable, type CareScheduleItem } from './CareScheduleTable'
import { useCallStore } from '@/stores/useCallStore'

const INITIAL_SCHEDULE_ITEMS: CareScheduleItem[] = [
  {
    id: "SCH-001",
    studentId: "149235",
    studentName: "Kim Nhật Anh",
    parentName: "Mẹ Kim Anh",
    phone: "0987654321",
    scheduleTime: "Hôm nay, 10:00",
    touchpointType: "Cuộc gọi 2 buổi đầu",
    notes: "Tìm hiểu xem con đi học 2 buổi đầu môn Tiếng Anh có theo kịp các bạn không, phản hồi giáo viên ra sao.",
    status: "Chờ gọi"
  },
  {
    id: "SCH-002",
    studentId: "149231",
    studentName: "Nguyễn Mỹ Linh",
    parentName: "Mẹ Mỹ Linh",
    phone: "0912233445",
    scheduleTime: "Hôm nay, 14:15",
    touchpointType: "Cuộc gọi đột xuất C90B",
    notes: "Trao đổi Cảnh báo C90B, con đang bị vướng BTVN 0% và điểm test 0.7. Đề xuất gia hạn học phí lên Level tiếp theo.",
    status: "Chờ gọi"
  },
  {
    id: "SCH-003",
    studentId: "152149",
    studentName: "Phạm Đình Nguyên",
    parentName: "Mẹ Đình Nguyên",
    phone: "0909090909",
    scheduleTime: "Hôm nay, 16:30",
    touchpointType: "Cuộc gọi định kỳ tháng",
    notes: "Báo cáo kết quả học tập tháng 5 của con môn Tiếng Anh và môn Toán tư duy, khảo sát độ hài lòng của mẹ.",
    status: "Đã gọi"
  },
  {
    id: "SCH-004",
    studentId: "152292",
    studentName: "Minh Vy",
    parentName: "Mẹ Minh Vy",
    phone: "0911223344",
    scheduleTime: "Ngày mai, 09:30",
    touchpointType: "Cuộc gọi định kỳ tháng",
    notes: "Thảo luận điểm thi lần gần nhất bị tụt dốc xuống 0.2. Nhờ mẹ đôn đốc con làm lại bài kiểm tra bù.",
    status: "Chờ gọi"
  },
  {
    id: "SCH-005",
    studentId: "152414",
    studentName: "Trương Bảo An",
    parentName: "Ba Bảo An",
    phone: "0988776655",
    scheduleTime: "Ngày mai, 11:00",
    touchpointType: "Cuộc gọi 2 buổi đầu",
    notes: "Khảo sát cảm nhận 2 buổi đầu của con, báo cáo tình trạng BTVN đang bị thiếu nghiêm trọng (12.5%).",
    status: "Chờ gọi"
  }
]

export function CareScheduleScreen() {
  const [items, setItems] = useState<CareScheduleItem[]>(INITIAL_SCHEDULE_ITEMS)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Listen to the global CallDialog save event to update the local list item
  useEffect(() => {
    const handleCallSaved = (e: Event) => {
      const customEvent = e as CustomEvent
      const { scheduleItemId, status, note } = customEvent.detail

      // Map status from useCallStore to CareScheduleItem status
      // CallStore results: 'Đã gọi thành công' | 'Không nhấc máy' | 'Máy bận' | 'Hẹn gọi lại sau'
      // CareScheduleItem status: 'Chờ gọi' | 'Đã gọi' | 'KNM' | 'Hẹn gọi lại'
      let scheduleStatus: CareScheduleItem['status'] = 'Đã gọi'
      if (status === 'Không nhấc máy') scheduleStatus = 'KNM'
      else if (status === 'Máy bận') scheduleStatus = 'KNM'
      else if (status === 'Hẹn gọi lại sau') scheduleStatus = 'Hẹn gọi lại'

      setItems((prev) =>
        prev.map((i) =>
          i.id === scheduleItemId
            ? {
                ...i,
                status: scheduleStatus,
                notes: note ? `${i.notes} (Phản hồi: ${note})` : i.notes,
              }
            : i
        )
      )
    }

    window.addEventListener('careCallSaved', handleCallSaved)
    return () => window.removeEventListener('careCallSaved', handleCallSaved)
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim()
        const match =
          item.studentName.toLowerCase().includes(q) ||
          item.parentName.toLowerCase().includes(q) ||
          item.phone.includes(q) ||
          item.touchpointType.toLowerCase().includes(q)
        if (!match) return false
      }

      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false
      }

      if (typeFilter !== 'all' && item.touchpointType !== typeFilter) {
        return false
      }

      if (dateFilter !== 'all') {
        const isToday = item.scheduleTime.startsWith('Hôm nay')
        if (dateFilter === 'today' && !isToday) return false
        if (dateFilter === 'tomorrow' && isToday) return false
      }

      return true
    })
  }, [items, searchQuery, statusFilter, typeFilter, dateFilter])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = useMemo(() => {
    return filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  }, [filteredItems, currentPage, pageSize])

  const handleToggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleCall = (item: CareScheduleItem) => {
    // Kích hoạt cuộc gọi VoIP toàn cục hệ thống
    useCallStore.getState().startCall({
      studentId: item.studentId,
      studentName: item.studentName,
      parentPhone: item.phone,
      parentName: item.parentName,
      scheduleItemId: item.id
    })
    toast.info(`Đang kết nối cuộc gọi CSKH tới: ${item.parentName}`)
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="flex shrink-0 items-center justify-between gap-4 bg-background px-4 py-3 lg:px-6">
        <div className="flex-1 overflow-x-auto min-w-0" />

        <div className="flex shrink-0 items-center gap-2">
          <ExpandableSearch
            value={searchQuery}
            onValueChange={(q) => { setSearchQuery(q); setPage(1) }}
            placeholder="Tìm học viên, SĐT, loại..."
            inputClassName="sm:w-64"
          />

          <ToolbarSelect
            value={statusFilter}
            onValueChange={(v) => { setStatusFilter(v); setPage(1) }}
            options={[
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'Chờ gọi', label: 'Chờ gọi' },
              { value: 'Đã gọi', label: 'Đã gọi' },
              { value: 'KNM', label: 'Không nghe máy (KNM)' },
              { value: 'Hẹn gọi lại', label: 'Hẹn gọi lại' }
            ]}
            ariaLabel="Trạng thái lịch hẹn"
          />

          <ToolbarSelect
            value={typeFilter}
            onValueChange={(v) => { setTypeFilter(v); setPage(1) }}
            options={[
              { value: 'all', label: 'Tất cả điểm chạm' },
              { value: 'Cuộc gọi 2 buổi đầu', label: 'Cuộc gọi 2 buổi đầu' },
              { value: 'Cuộc gọi định kỳ tháng', label: 'Cuộc gọi định kỳ tháng' },
              { value: 'Cuộc gọi đột xuất C90B', label: 'Cuộc gọi đột xuất C90B' }
            ]}
            ariaLabel="Loại điểm chạm"
          />

          <ToolbarSelect
            value={dateFilter}
            onValueChange={(v) => { setDateFilter(v); setPage(1) }}
            options={[
              { value: 'all', label: 'Mọi thời gian hẹn' },
              { value: 'today', label: 'Hẹn hôm nay' },
              { value: 'tomorrow', label: 'Hẹn ngày mai' }
            ]}
            ariaLabel="Thời gian"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-2 lg:px-6 lg:pb-6">
        <DataTableFrame
          footer={
            <DataTablePagination
              page={currentPage}
              total={filteredItems.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          }
        >
          <CareScheduleTable
            items={paged}
            selectedIds={selectedIds}
            onToggleRow={handleToggleRow}
            onCall={handleCall}
          />
        </DataTableFrame>
      </div>
    </div>
  )
}
