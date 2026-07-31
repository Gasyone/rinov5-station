'use client'

import { useState, useEffect, useMemo } from 'react'
import { StatusTiles, StatusTile, ConfirmDialog } from '@/components/shared'
import { EventManagementNewToolbar } from './EventManagementNewToolbar'
import { EventManagementNewTable } from './EventManagementNewTable'
import { EventManagementNewCreateDialog } from './EventManagementNewCreateDialog'
import { EventManagementNewDetailDialog } from './EventManagementNewDetailDialog'
import { getEvents, createEvent, updateEvent, cancelEvent, EventItem } from '@/mocks/eventManagement'
import { EventFilters, INITIAL_FILTERS } from './eventManagementNewTypes'
import { Input } from '@/components/ui/input'
import { FilterGroupSheetPanel, createFilterGroup, type FilterGroupConfig } from '@/components/filters'

// Constants
const BRANCH_OPTIONS = [
  'RinoEdu Linh Đàm',
  'RinoEdu Nguyễn Tuân',
  'RinoEdu Smart City'
]

interface AdvancedFilters {
  types: string[]
  branches: string[]
  statuses: string[]
  organizers: string[]
  capacities: string[]
  availabilities: string[]
  locations: string[]
  times: string[]
}

const INITIAL_ADV_FILTERS: AdvancedFilters = {
  types: [],
  branches: [],
  statuses: [],
  organizers: [],
  capacities: [],
  availabilities: [],
  locations: [],
  times: []
}

export function EventManagementNewScreen() {
  // State Keepers
  const [allEvents, setAllEvents] = useState<EventItem[]>([])
  const [filters, setFilters] = useState<EventFilters>(INITIAL_FILTERS)
  const [activeTileId, setActiveTileId] = useState<string>('Tất cả')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // Dialog / Dialog triggers states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventItem | undefined>(undefined)
  const [detailEventId, setDetailEventId] = useState<string | null>(null)
  
  // Advanced filters state
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false)
  const [advFilters, setAdvFilters] = useState<AdvancedFilters>(INITIAL_ADV_FILTERS)

  // Cancel confirmation state
  const [cancellingEvent, setCancellingEvent] = useState<EventItem | null>(null)
  const [cancelReason, setCancelReason] = useState('')

  // Row selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())

  const handleToggleAll = (checked: boolean, ids: string[]) => {
    setSelectedIds(current => {
      const next = new Set(current)
      if (checked) {
        ids.forEach(id => next.add(id))
      } else {
        ids.forEach(id => next.delete(id))
      }
      return next
    })
  }

  const handleToggleOne = (id: string, checked: boolean) => {
    setSelectedIds(current => {
      const next = new Set(current)
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }

  // Helper load function
  const loadEvents = () => {
    const raw = getEvents()
    setAllEvents(raw)
  }

  // Initial Load - Wrapped in resolved Promise to avoid synchronous setState inside effect warning
  useEffect(() => {
    Promise.resolve().then(() => {
      loadEvents()
    })
  }, [])

  // Sync compute filteredEvents on render instead of inside useEffect (React best practice)
  const filteredEvents = useMemo(() => {
    let result = [...allEvents]

    // 1. Search Query
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(evt => 
        evt.title.toLowerCase().includes(q) ||
        evt.id.toLowerCase().includes(q) ||
        evt.location.toLowerCase().includes(q)
      )
    }

    // 2. Toolbar Branch Filter (Select)
    if (filters.branch && filters.branch !== 'all') {
      result = result.filter(evt => evt.branch === filters.branch)
    }

    // 3. Toolbar Type Select
    if (filters.status && filters.status !== 'all') {
      result = result.filter(evt => evt.type === filters.status)
    }

    // 4. Status Tile Select
    if (activeTileId !== 'Tất cả') {
      result = result.filter(evt => evt.status === activeTileId)
    }

    // ─── Advanced Filter Sheet Panel Criteria ───
    // 5. Types check
    if (advFilters.types.length > 0) {
      result = result.filter(evt => advFilters.types.includes(evt.type))
    }
    // 6. Branches check
    if (advFilters.branches.length > 0) {
      result = result.filter(evt => advFilters.branches.includes(evt.branch))
    }
    // 7. Statuses check
    if (advFilters.statuses.length > 0) {
      result = result.filter(evt => advFilters.statuses.includes(evt.status))
    }
    // 8. Organizers check
    if (advFilters.organizers.length > 0) {
      result = result.filter(evt => advFilters.organizers.includes(evt.organizer))
    }
    // 9. Capacities check
    if (advFilters.capacities.length > 0) {
      result = result.filter(evt => {
        return advFilters.capacities.some(cap => {
          if (cap === '<30') return evt.capacity < 30
          if (cap === '30-50') return evt.capacity >= 30 && evt.capacity <= 50
          if (cap === '>50') return evt.capacity > 50
          return false
        })
      })
    }
    // 10. Availabilities check
    if (advFilters.availabilities.length > 0) {
      result = result.filter(evt => {
        const isFull = evt.registeredCount >= evt.capacity
        return advFilters.availabilities.some(av => {
          if (av === 'available') return !isFull
          if (av === 'full') return isFull
          return false
        })
      })
    }
    // 11. Locations check
    if (advFilters.locations.length > 0) {
      result = result.filter(evt => {
        const loc = evt.location.toLowerCase()
        const isHall = loc.includes('hội trường') || loc.includes('đa năng') || loc.includes('hội thảo')
        const isOutdoor = loc.includes('sân') || loc.includes('vườn') || loc.includes('ngoài trời')
        const isLab = loc.includes('trải nghiệm') || loc.includes('stem') || loc.includes('robotics') || loc.includes('lab')
        const isOther = !isHall && !isOutdoor && !isLab
        
        return advFilters.locations.some(l => {
          if (l === 'hall') return isHall
          if (l === 'outdoor') return isOutdoor
          if (l === 'lab') return isLab
          if (l === 'other') return isOther
          return false
        })
      })
    }
    // 12. Times check
    if (advFilters.times.length > 0) {
      result = result.filter(evt => {
        const date = new Date(evt.startDate)
        const day = date.getDay() // 0 = Sun, 6 = Sat
        const isWeekend = day === 0 || day === 6
        return advFilters.times.some(t => {
          if (t === 'weekday') return !isWeekend
          if (t === 'weekend') return isWeekend
          return false
        })
      })
    }

    return result
  }, [allEvents, filters, activeTileId, advFilters])

  const handleFiltersChange = (newFilters: EventFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleSelectTile = (tileId: string) => {
    setActiveTileId(tileId)
    setCurrentPage(1)
  }

  // Count helper for Status Tiles
  const getStatusCount = (status: string) => {
    let base = [...allEvents]
    if (filters.branch && filters.branch !== 'all') {
      base = base.filter(evt => evt.branch === filters.branch)
    }
    if (filters.status && filters.status !== 'all') {
      base = base.filter(evt => evt.type === filters.status)
    }
    
    if (status === 'Tất cả') return base.length
    return base.filter(evt => evt.status === status).length
  }

  // Create Status Tiles Config
  const statusTiles: StatusTile<string>[] = [
    { id: 'Tất cả', label: 'Tất cả', count: getStatusCount('Tất cả'), status: 'all' },
    { id: 'nhap', label: 'Nháp', count: getStatusCount('nhap'), status: 'nhap' },
    { id: 'mo_dang_ky', label: 'Mở đăng ký', count: getStatusCount('mo_dang_ky'), status: 'mo_dang_ky' },
    { id: 'dang_dien_ra', label: 'Đang diễn ra', count: getStatusCount('dang_dien_ra'), status: 'dang_dien_ra' },
    { id: 'ket_thuc', label: 'Đã kết thúc', count: getStatusCount('ket_thuc'), status: 'ket_thuc' },
    { id: 'huy', label: 'Đã hủy', count: getStatusCount('huy'), status: 'huy' }
  ]

  // Form submit callback
  const handleSaveForm = (data: Omit<EventItem, 'id' | 'registeredCount' | 'checkedInCount' | 'statusLabel'> & { id?: string }) => {
    if (data.id) {
      updateEvent(data.id, data)
    } else {
      createEvent(data)
    }
    loadEvents()
  }

  // Cancel event callback
  const handleConfirmCancelEvent = () => {
    if (cancellingEvent && cancelReason.trim()) {
      cancelEvent(cancellingEvent.id, cancelReason)
      setCancellingEvent(null)
      setCancelReason('')
      loadEvents()
    }
  }

  // Handle advanced filter toggle
  const handleToggleFilter = (sectionId: string, value: string) => {
    setAdvFilters(prev => {
      const key = sectionId as keyof AdvancedFilters
      const values = prev[key]
      const nextValues = values.includes(value)
        ? values.filter(v => v !== value)
        : [...values, value]
      return { ...prev, [key]: nextValues }
    })
    setCurrentPage(1)
  }

  const handleClearAllFilters = () => {
    setAdvFilters(INITIAL_ADV_FILTERS)
    setCurrentPage(1)
  }

  const handleClearSection = (sectionId: string) => {
    setAdvFilters(prev => ({
      ...prev,
      [sectionId as keyof AdvancedFilters]: []
    }))
    setCurrentPage(1)
  }

  const filterGroups = useMemo<FilterGroupConfig[]>(() => [
    createFilterGroup({
      id: 'types',
      title: 'Loại sự kiện',
      options: [
        { value: 'seminar', label: 'Hội thảo' },
        { value: 'open_day', label: 'Ngày hội mở' },
        { value: 'trial', label: 'Trải nghiệm học thử' },
        { value: 'other', label: 'Khác' },
      ],
      selectedValues: advFilters.types,
    }),
    createFilterGroup({
      id: 'branches',
      options: BRANCH_OPTIONS,
      selectedValues: advFilters.branches,
    }),
    createFilterGroup({
      id: 'statuses',
      title: 'Trạng thái',
      options: [
        { value: 'nhap', label: 'Nháp' },
        { value: 'mo_dang_ky', label: 'Mở đăng ký' },
        { value: 'dang_dien_ra', label: 'Đang diễn ra' },
        { value: 'ket_thuc', label: 'Đã kết thúc' },
        { value: 'huy', label: 'Đã hủy' },
      ],
      selectedValues: advFilters.statuses,
    }),
    createFilterGroup({
      id: 'organizers',
      title: 'Ban tổ chức',
      options: [
        { value: 'Phòng Tuyển sinh', label: 'Phòng Tuyển sinh' },
        { value: 'Phòng Marketing', label: 'Phòng Marketing' },
        { value: 'Phòng Đào tạo', label: 'Phòng Đào tạo' },
      ],
      selectedValues: advFilters.organizers,
    }),
    createFilterGroup({
      id: 'capacities',
      title: 'Sức chứa sảnh',
      options: [
        { value: '<30', label: 'Nhỏ (Dưới 30 người)' },
        { value: '30-50', label: 'Vừa (30 - 50 người)' },
        { value: '>50', label: 'Lớn (Trên 50 người)' },
      ],
      selectedValues: advFilters.capacities,
    }),
    createFilterGroup({
      id: 'availabilities',
      title: 'Tình trạng chỗ',
      options: [
        { value: 'available', label: 'Còn chỗ trống' },
        { value: 'full', label: 'Đã đầy chỗ' },
      ],
      selectedValues: advFilters.availabilities,
    }),
    createFilterGroup({
      id: 'locations',
      title: 'Khu vực tổ chức',
      options: [
        { value: 'hall', label: 'Hội trường / Phòng Đa năng' },
        { value: 'outdoor', label: 'Sân chơi / Ngoài trời' },
        { value: 'lab', label: 'Phòng Trải nghiệm / STEM' },
        { value: 'other', label: 'Khu vực khác' },
      ],
      selectedValues: advFilters.locations,
    }),
    createFilterGroup({
      id: 'times',
      title: 'Thời gian lịch trình',
      options: [
        { value: 'weekday', label: 'Ngày trong tuần (T2 - T6)' },
        { value: 'weekend', label: 'Ngày cuối tuần (T7 - CN)' },
      ],
      selectedValues: advFilters.times,
    }),
  ], [advFilters])

  // Active filters count
  const activeFiltersCount = 
    advFilters.types.length + 
    advFilters.branches.length + 
    advFilters.statuses.length + 
    advFilters.organizers.length +
    advFilters.capacities.length +
    advFilters.availabilities.length +
    advFilters.locations.length +
    advFilters.times.length

  return (
    <div className="h-full flex flex-col min-h-0 space-y-4 px-3 py-3 lg:px-3 bg-background">
      
      {/* Horizontal Status Tiles bar */}
      <StatusTiles
        tiles={statusTiles}
        activeId={activeTileId}
        onSelect={handleSelectTile}
        className="w-full py-1 shrink-0"
      />

      {/* Toolbar list controls */}
      <EventManagementNewToolbar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        branchOptions={BRANCH_OPTIONS}
        onAddEvent={() => { setEditingEvent(undefined); setIsCreateOpen(true); }}
        onOpenAdvancedFilters={() => setIsAdvancedFiltersOpen(true)}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Events data list */}
      <EventManagementNewTable
        events={filteredEvents}
        onSelectDetail={setDetailEventId}
        onSelectEdit={(evt) => { setEditingEvent(evt); setIsCreateOpen(true); }}
        onSelectCancel={setCancellingEvent}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        selectedIds={selectedIds}
        onToggleAll={handleToggleAll}
        onToggleOne={handleToggleOne}
      />

      {/* Event creation and edit dialog */}
      <EventManagementNewCreateDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleSaveForm}
        editingEvent={editingEvent}
      />

      {/* Event Detail & Check-in sheet */}
      <EventManagementNewDetailDialog
        isOpen={detailEventId !== null}
        eventId={detailEventId}
        onClose={() => setDetailEventId(null)}
        onEventUpdated={loadEvents}
      />

      {/* Standard Filter Sheet Panel with multiple criteria options */}
      <FilterGroupSheetPanel
        open={isAdvancedFiltersOpen}
        onOpenChange={setIsAdvancedFiltersOpen}
        title="Bộ lọc nâng cao"
        description="Kết hợp nhiều tiêu chí nâng cao để tìm kiếm sự kiện tuyển sinh chính xác."
        groups={filterGroups}
        onToggle={handleToggleFilter}
        onClearAll={handleClearAllFilters}
        onClearSection={handleClearSection}
      />

      {/* Cancel Event Confirm dialog */}
      <ConfirmDialog
        open={cancellingEvent !== null}
        onOpenChange={(op) => { if (!op) setCancellingEvent(null); }}
        title="Bạn có chắc chắn muốn hủy sự kiện này?"
        description="Sự kiện sẽ chuyển sang trạng thái đã hủy. Toàn bộ vé khách mời đăng ký sẽ tự động hủy theo. Hành động này không thể hoàn tác."
        confirmLabel="Đồng ý hủy"
        cancelLabel="Đóng"
        onConfirm={handleConfirmCancelEvent}
      >
        <div className="mt-4 space-y-1.5">
          <label className="text-xs font-medium text-foreground">Lý do hủy sự kiện *</label>
          <Input 
            placeholder="Nhập lý do chi tiết..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </div>
      </ConfirmDialog>

    </div>
  )
}
