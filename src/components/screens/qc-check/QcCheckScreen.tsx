'use client'

import { useState, useMemo } from 'react'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { FilterGroupSheetPanel, createFilterGroup, type FilterGroupConfig } from '@/components/filters'
import {
  mockQcCheckEvents,
  QC_CHECK_STATUS_LABELS,
  QC_CHECK_ITEMS,
  INSPECTOR_OPTIONS,
  type QcCheckEvent,
  type QcError,
  type QcErrorStatus,
  type Inspector,
} from '@/mocks/qcChecks'
import {
  type StatusTileId,
  type FilterState,
  computeStatusTotal,
  STATUS_TILE_CONFIG_EXPORT,
} from './qcCheckTypes'
import type { CreateQcForm } from './QcCheckCreateDialog'
import type { QcErrorForm } from './QcCheckErrorDialog'
import { QcCheckToolbar } from './QcCheckToolbar'
import { QcCheckTable } from './QcCheckTable'
import { QcCheckCreateDialog } from './QcCheckCreateDialog'
import { QcCheckDetailDialog } from './QcCheckDetailDialog'
import { generateEventCode, getCalculatedStatus } from './qcCheckHelpers'

const CURRENT_USER_ID = 'ins_01'

const BRANCH_OPTIONS = ['RinoEdu Nguyễn Tuân', 'RinoEdu Linh Đàm', 'RinoEdu Smart City']
const STATUS_OPTIONS = Object.entries(QC_CHECK_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))

export function QcCheckScreen() {
  const [events, setEvents] = useState<QcCheckEvent[]>(() => structuredClone(mockQcCheckEvents))
  const [activeType, setActiveType] = useState('all')
  const [activeBranch, setActiveBranch] = useState('all')
  const [activeStatus, setActiveStatus] = useState<StatusTileId>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    branches: [],
    statuses: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [page, setPage] = useState(1)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [detailEventId, setDetailEventId] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())

  const filteredEvents = useMemo(() => events.filter((e) => {
    if (activeType !== 'all' && e.type !== activeType) return false
    if (activeBranch !== 'all' && e.branch !== activeBranch) return false
    if (activeStatus !== 'all' && getCalculatedStatus(e) !== activeStatus) return false
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      const nameMatch = e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q)
      const inspectorMatch = e.inspectors.some((i) => i.name.toLowerCase().includes(q))
      const branchMatch = e.branch.toLowerCase().includes(q)
      if (!nameMatch && !inspectorMatch && !branchMatch) return false
    }
    if (filters.branches.length > 0 && !filters.branches.includes(e.branch)) return false
    if (filters.statuses.length > 0 && !filters.statuses.includes(getCalculatedStatus(e))) return false
    return true
  }), [events, activeType, activeBranch, activeStatus, searchTerm, filters.branches, filters.statuses])

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedEvents = filteredEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const statusTileTotals: Record<string, number> = {}
  const tileIds: StatusTileId[] = ['all', ...STATUS_TILE_CONFIG_EXPORT().slice(1).map((t) => t.id)]
  for (const tileId of tileIds) {
    statusTileTotals[tileId] = computeStatusTotal(filteredEvents, tileId)
  }

  const filterGroups = useMemo<FilterGroupConfig[]>(() => [
    createFilterGroup({
      id: 'branches',
      options: BRANCH_OPTIONS,
      selectedValues: filters.branches,
      getOptionCount: (branch) => events.filter((event) => event.branch === branch).length,
    }),
    createFilterGroup({
      id: 'statuses',
      options: STATUS_OPTIONS,
      selectedValues: filters.statuses,
      getOptionCount: (status) => events.filter((event) => getCalculatedStatus(event) === status).length,
    }),
  ], [events, filters.branches, filters.statuses])

  const activeFilterCount = filters.branches.length + filters.statuses.length

  const detailEvent = events.find((e) => e.id === detailEventId) ?? null

  const handleCreate = (form: CreateQcForm) => {
    const newEventId = `qc_${Date.now()}`
    const eventCode = generateEventCode(events)

    const inspectors: Inspector[] = []
    const mainIns = INSPECTOR_OPTIONS.find((i) => i.id === form.inspectorId)
    if (mainIns) {
      inspectors.push(mainIns)
    }
    form.errors.forEach((err) => {
      const ins = INSPECTOR_OPTIONS.find((i) => i.id === err.inspectorId)
      if (ins && !inspectors.some((i) => i.id === ins.id)) {
        inspectors.push(ins)
      }
    })

    const areas = Array.from(new Set(form.errors.map((e) => e.area).filter(Boolean)))

    const mappedErrors = form.errors.map((err, idx) => {
      const errorIndex = idx + 1
      return {
        id: `err_${Date.now()}_${errorIndex}`,
        code: `${eventCode}.${errorIndex.toString().padStart(2, '0')}`,
        qcEventId: newEventId,
        eventCode: eventCode,
        itemId: `custom_${Date.now()}_${errorIndex}`,
        itemLabel: err.errorType === 'teacher' ? 'Lỗi Giáo viên' : 'Lỗi Cơ sở vật chất',
        errorType: (err.errorType === 'teacher' ? 'personnel' : 'facility') as QcError['errorType'],
        description: err.description,
        severity: err.severity as QcError['severity'],
        status: 'open' as const,
        recurrenceCount: 0,
        requiresCorrectiveAction: true,
        evidence: err.evidence || 'Ghi nhận trực tiếp khi đánh giá',
        evidenceLink: '',
        evidenceImage: err.evidenceImage || '',
        correctiveAction: '',
        correctiveEvidence: '',
        assignee: 'Bộ phận liên quan',
        issuedBy: err.inspectorId,
        notes: err.notes,
        createdAt: new Date().toISOString(),
      }
    })

    const newEvent: QcCheckEvent = {
      id: newEventId,
      code: eventCode,
      name: form.name || 'Chưa đặt tên',
      type: form.type,
      status: 'draft',
      date: new Date().toISOString().split('T')[0],
      branch: form.branch,
      inspectors,
      areas,
      errors: mappedErrors,
      comments: [],
      logs: [
        {
          id: `log_${Date.now()}`,
          userId: CURRENT_USER_ID,
          userName: 'Trần Văn Kiên',
          action: 'Tạo đợt QC (Nháp)',
          createdAt: new Date().toISOString(),
        }
      ],
      notes: '',
      createdAt: new Date().toISOString(),
    }
    setEvents((prev) => [...prev, newEvent])
    setIsCreateOpen(false)
  }

  const handleAddError = (eventId: string, form: QcErrorForm) => {
    const item = form.itemId ? QC_CHECK_ITEMS.find((i) => i.id === form.itemId) : null

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e
        const errorIndex = e.errors.length + 1
        const newError = {
          id: `err_${Date.now()}`,
          code: `${e.code}.${errorIndex.toString().padStart(2, '0')}`,
          qcEventId: eventId,
          eventCode: e.code,
          itemId: form.itemId,
          itemLabel: item?.label ?? '',
          errorType: form.errorType as QcError['errorType'],
          description: form.description,
          severity: form.severity as QcError['severity'],
          status: form.status as QcError['status'],
          recurrenceCount: 0,
          requiresCorrectiveAction: form.requiresCorrectiveAction,
          evidence: form.evidence,
          evidenceLink: form.evidenceLink || '',
          evidenceImage: form.evidenceImage || '',
          correctiveAction: form.requiresCorrectiveAction ? form.correctiveAction : '',
          correctiveEvidence: form.requiresCorrectiveAction ? form.correctiveEvidence : '',
          correctiveLink: form.requiresCorrectiveAction ? form.correctiveLink : '',
          correctiveImage: form.requiresCorrectiveAction ? form.correctiveImage : '',
          assignee: form.assignee,
          issuedBy: CURRENT_USER_ID,
          notes: form.notes,
          createdAt: new Date().toISOString(),
          deadline: form.requiresCorrectiveAction && form.deadline ? form.deadline : undefined,
        }
        const newLog = {
          id: `log_${Date.now()}_err`,
          userId: CURRENT_USER_ID,
          userName: 'Trần Văn Kiên',
          action: 'Ghi nhận lỗi',
          details: `Thêm lỗi ${newError.code} (${newError.itemLabel})`,
          createdAt: new Date().toISOString(),
        }
        return {
          ...e,
          errors: [...e.errors, newError],
          logs: [...(e.logs || []), newLog]
        }
      })
    )
  }

  const handleUpdateErrorStatus = (eventId: string, errorId: string, status: QcErrorStatus) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e
        const errorItem = e.errors.find((err) => err.id === errorId)
        
        // Log details
        const statusText = 
          status === 'open'
            ? 'Mở'
            : status === 'correcting'
              ? 'Đang khắc phục'
              : status === 'corrected'
                ? 'Đã khắc phục (chờ duyệt)'
                : status === 'closed'
                  ? 'Đóng lỗi (Đạt)'
                  : status === 'not_met'
                    ? 'Chưa đáp ứng'
                    : status

        const updatedErrors = e.errors.map((err) => {
          if (err.id !== errorId) return err
          const updates: { completionDate?: string; closedBy?: string; closedAt?: string } = {}
          if (status === 'corrected') {
            updates.completionDate = new Date().toISOString()
          }
          if (status === 'closed') {
            updates.closedBy = CURRENT_USER_ID
            updates.closedAt = new Date().toISOString()
          }
          return { ...err, status, ...updates }
        })

        const allClosed = updatedErrors.length > 0 && updatedErrors.every((err) => err.status === 'closed')
        const nextEventStatus = allClosed ? ('completed' as const) : e.status

        const newLog = {
          id: `log_${Date.now()}_status`,
          userId: CURRENT_USER_ID,
          userName: 'Trần Văn Kiên',
          action: status === 'closed' ? 'Đóng lỗi (Đạt)' : status === 'not_met' ? 'Đánh giá chưa đạt' : 'Cập nhật trạng thái lỗi',
          details: allClosed
            ? `Lỗi ${errorItem?.code} chuyển trạng thái sang: ${statusText}. Đã duyệt đạt tất cả các lỗi, đóng đợt QC.`
            : `Lỗi ${errorItem?.code} chuyển trạng thái sang: ${statusText}`,
          createdAt: new Date().toISOString(),
        }

        return {
          ...e,
          status: nextEventStatus,
          errors: updatedErrors,
          logs: [...(e.logs || []), newLog]
        }
      })
    )
  }

  const handleDeleteError = (eventId: string, errorId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e
        const errorItem = e.errors.find((err) => err.id === errorId)
        const newLog = {
          id: `log_${Date.now()}_del`,
          userId: CURRENT_USER_ID,
          userName: 'Trần Văn Kiên',
          action: 'Xóa ghi nhận lỗi',
          details: `Xóa lỗi ${errorItem?.code} (${errorItem?.itemLabel})`,
          createdAt: new Date().toISOString(),
        }
        return {
          ...e,
          errors: e.errors.filter((err) => err.id !== errorId),
          logs: [...(e.logs || []), newLog]
        }
      })
    )
  }

  const handleEditError = (eventId: string, errorId: string, form: QcErrorForm) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e
        const errorItem = e.errors.find((err) => err.id === errorId)
        const isResubmit = errorItem?.status === 'not_met'
        const nextStatus = isResubmit ? 'corrected' : form.status

        const newLog = {
          id: `log_${Date.now()}_edit`,
          userId: CURRENT_USER_ID,
          userName: 'Trần Văn Kiên',
          action: isResubmit ? 'Gửi lại khắc phục' : 'Chỉnh sửa thông tin lỗi',
          details: `Lỗi ${errorItem?.code} đã được chỉnh sửa cập nhật${isResubmit ? ' và gửi lại báo cáo khắc phục mới' : ''}`,
          createdAt: new Date().toISOString(),
        }

        return {
          ...e,
          errors: e.errors.map((err) => {
            if (err.id !== errorId) return err
            const updates: { completionDate?: string } = {}
            if (nextStatus === 'corrected') {
              updates.completionDate = new Date().toISOString()
            }
            return {
              ...err,
              description: form.description,
              severity: form.severity,
              status: nextStatus,
              evidence: form.evidence,
              evidenceLink: form.evidenceLink,
              evidenceImage: form.evidenceImage,
              requiresCorrectiveAction: form.requiresCorrectiveAction,
              correctiveAction: form.correctiveAction,
              correctiveEvidence: form.correctiveEvidence,
              correctiveLink: form.correctiveLink,
              correctiveImage: form.correctiveImage,
               assignee: form.assignee,
              notes: form.notes,
              deadline: form.requiresCorrectiveAction && form.deadline ? form.deadline : undefined,
              ...updates,
            }
          }),
          logs: [...(e.logs || []), newLog]
        }
      })
    )
  }

  const handleAddComment = (eventId: string, commentContent: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e
        const newComment = {
          id: `comm_${Date.now()}`,
          userId: CURRENT_USER_ID,
          userName: 'Trần Văn Kiên',
          userRole: 'Thanh tra viên',
          content: commentContent,
          createdAt: new Date().toISOString(),
        }
        const newLog = {
          id: `log_${Date.now()}_comm`,
          userId: CURRENT_USER_ID,
          userName: 'Trần Văn Kiên',
          action: 'Gửi trao đổi bình luận',
          details: `"${commentContent.substring(0, 50)}${commentContent.length > 50 ? '...' : ''}"`,
          createdAt: new Date().toISOString(),
        }
        return {
          ...e,
          comments: [...(e.comments || []), newComment],
          logs: [...(e.logs || []), newLog]
        }
      })
    )
  }

  const handlePublishEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e
        const newLog = {
          id: `log_${Date.now()}_pub`,
          userId: CURRENT_USER_ID,
          userName: 'Trần Văn Kiên',
          action: 'Phát hành đợt QC',
          createdAt: new Date().toISOString(),
        }
        const publishDate = new Date().toISOString().split('T')[0]
        return {
          ...e,
          status: 'published' as const,
          date: publishDate,
          publishedAt: new Date().toISOString(),
          logs: [...(e.logs || []), newLog]
        }
      })
    )
  }

  const handleCloseEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e
        const newLog = {
          id: `log_${Date.now()}_close`,
          userId: CURRENT_USER_ID,
          userName: 'Trần Văn Kiên',
          action: 'Đóng đợt QC',
          createdAt: new Date().toISOString(),
        }
        return {
          ...e,
          status: 'closed' as const,
          completedAt: new Date().toISOString(),
          logs: [...(e.logs || []), newLog]
        }
      })
    )
  }

  const handleCancelEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e
        const newLog = {
          id: `log_${Date.now()}_cancel`,
          userId: CURRENT_USER_ID,
          userName: 'Trần Văn Kiên',
          action: 'Hủy đợt QC',
          createdAt: new Date().toISOString(),
        }
        return {
          ...e,
          status: 'cancelled' as const,
          logs: [...(e.logs || []), newLog]
        }
      })
    )
  }

  const handleNotMet = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e
        const newLog = {
          id: `log_${Date.now()}_notmet`,
          userId: CURRENT_USER_ID,
          userName: 'Trần Văn Kiên',
          action: 'Đánh giá Đợt QC Chưa đạt',
          createdAt: new Date().toISOString(),
        }
        return {
          ...e,
          status: 'not_met' as const,
          logs: [...(e.logs || []), newLog]
        }
      })
    )
  }

  const toggleFilterValue = <T extends string>(group: keyof FilterState, value: T) => {
    setPage(1)
    setFilters((current) => {
      const currentValues = current[group] as T[]
      const next = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]
      return { ...current, [group]: next }
    })
  }

  const toggleSelectAll = () => {
    const allIds = filteredEvents.map((e) => e.id)
    const isAllSelected = allIds.every((id) => selectedIds.has(id))
    if (isAllSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(allIds))
    }
  }

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <QcCheckToolbar
        activeType={activeType}
        activeBranch={activeBranch}
        activeStatus={activeStatus}
        searchTerm={searchTerm}
        activeFilterCount={activeFilterCount}
        statusTileTotals={statusTileTotals}
        onTypeChange={(type) => { setActiveType(type); setPage(1) }}
        onBranchChange={(branch) => { setActiveBranch(branch); setPage(1) }}
        onStatusChange={(status) => { setActiveStatus(status); setPage(1) }}
        onSearchChange={(value) => { setSearchTerm(value); setPage(1) }}
        onOpenFilters={() => setIsFilterOpen(true)}
        onCreate={() => setIsCreateOpen(true)}
      />

      <div className="min-h-0 flex-1 overflow-hidden px-3 pb-3 pt-2 lg:px-3 lg:pb-3">
        <DataTableFrame
          footer={
            <DataTablePagination
              page={currentPage}
              total={filteredEvents.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          }
        >
          <QcCheckTable
            events={pagedEvents}
            selectedIds={selectedIds}
            onToggleAll={toggleSelectAll}
            onToggleOne={toggleSelectOne}
            onRowClick={setDetailEventId}
          />
        </DataTableFrame>
      </div>

      <FilterGroupSheetPanel
        open={isFilterOpen}
        groups={filterGroups}
        description="Kết hợp bộ lọc theo chi nhánh và trạng thái."
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'branches') toggleFilterValue('branches', value)
          if (sectionId === 'statuses') toggleFilterValue('statuses', value)
        }}
        onClearSection={(sectionId) => {
          setPage(1)
          setFilters((current) => ({
            ...current,
            [sectionId]: [],
          }))
        }}
        onClearAll={() => {
          setFilters({ branches: [], statuses: [] })
          setPage(1)
        }}
      />

      <QcCheckCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreate}
      />

      <QcCheckDetailDialog
        event={detailEvent}
        open={!!detailEvent}
        onOpenChange={(open) => { if (!open) setDetailEventId('') }}
        onAddError={handleAddError}
        onUpdateError={handleUpdateErrorStatus}
        onPublish={handlePublishEvent}
        onCloseEvent={handleCloseEvent}
        onCancelEvent={handleCancelEvent}
        onNotMet={handleNotMet}
        currentUserId={CURRENT_USER_ID}
        onEditError={handleEditError}
        onAddComment={handleAddComment}
        onDeleteError={handleDeleteError}
      />
    </div>
  )
}
