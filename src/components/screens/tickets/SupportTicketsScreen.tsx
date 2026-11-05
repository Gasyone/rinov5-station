'use client'

import React, { useState, useMemo, useCallback } from 'react'
import {
  mockTickets,
  addTicketInteraction,
  updateTicketStatus,
  createTicket,
  type SupportTicket,
  type TicketInteractionLog,
} from '@/mocks/tickets'
import { DEFAULT_PAGE_SIZE } from '@/components/data-table'
import {
  FilterGroupAsidePanel,
  createFilterGroup,
  type FilterGroupConfig,
} from '@/components/filters'
import { toast } from 'sonner'
import { SupportTicketsToolbar } from './SupportTicketsToolbar'
import { SupportTicketsTable } from './SupportTicketsTable'
import { SupportTicketsDetailDialog } from './SupportTicketsDetailDialog'
import { SupportTicketsCreateDialog } from './SupportTicketsCreateDialog'
import {
  filterTickets,
  computeTicketStatusTotals,
  sortTickets,
} from './supportTicketsHelpers'
import {
  BRANCH_OPTIONS,
  STATUS_FILTER_OPTIONS,
  CATEGORY_FILTER_OPTIONS,
  PRIORITY_FILTER_OPTIONS,
  TYPE_FILTER_OPTIONS,
  ASSIGNEE_FILTER_OPTIONS,
  INITIAL_ADVANCED_FILTER_STATE,
  type TicketStatusFilter,
  type AdvancedFilterState,
} from './supportTicketsTypes'

export function SupportTicketsScreen() {
  const [tickets, setTickets] = useState<SupportTicket[]>(() => structuredClone(mockTickets))

  // Toolbar Quick Filters
  const [activeBranch, setActiveBranch] = useState('all')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeStatus, setActiveStatus] = useState<TicketStatusFilter>('all')
  const [activeType, setActiveType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Advanced Aside Filter Drawer
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>(
    INITIAL_ADVANCED_FILTER_STATE
  )
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Selection & Pagination
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  // Dialog States
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    const list = filterTickets(tickets, {
      activeBranch,
      activeCategory,
      activeStatus,
      activeType,
      searchTerm,
      advancedFilters,
    })
    return sortTickets(list)
  }, [
    tickets,
    activeBranch,
    activeCategory,
    activeStatus,
    activeType,
    searchTerm,
    advancedFilters,
  ])

  // Status Tiles Counts (Dynamic based on all active filters except status per Rule 5)
  const statusTileTotals = useMemo(() => {
    return computeTicketStatusTotals(tickets, {
      activeBranch,
      activeCategory,
      activeType,
      searchTerm,
      advancedFilters,
    })
  }, [
    tickets,
    activeBranch,
    activeCategory,
    activeType,
    searchTerm,
    advancedFilters,
  ])

  // Pagination
  const totalRecords = filteredTickets.length
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedTickets = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredTickets.slice(start, start + pageSize)
  }, [filteredTickets, currentPage, pageSize])

  // Selected Ticket for Detail Dialog
  const selectedTicket = useMemo(() => {
    if (!selectedTicketId) return null
    return tickets.find((t) => t.id === selectedTicketId) ?? null
  }, [tickets, selectedTicketId])

  // Filter Panel Configuration matching QcCheckScreen
  const filterGroups = useMemo<FilterGroupConfig[]>(
    () => [
      createFilterGroup({
        id: 'statuses',
        title: 'Trạng thái ticket',
        options: STATUS_FILTER_OPTIONS,
        selectedValues: advancedFilters.statuses,
        getOptionCount: (val) => tickets.filter((t) => t.status === val).length,
      }),
      createFilterGroup({
        id: 'branches',
        title: 'Cơ sở tiếp nhận',
        options: BRANCH_OPTIONS.map((b) => ({ value: b, label: b })),
        selectedValues: advancedFilters.branches,
        getOptionCount: (b) => tickets.filter((t) => t.branch === b).length,
      }),
      createFilterGroup({
        id: 'categories',
        title: 'Phân loại nghiệp vụ',
        options: CATEGORY_FILTER_OPTIONS,
        selectedValues: advancedFilters.categories,
        getOptionCount: (val) => tickets.filter((t) => t.category === val).length,
      }),
      createFilterGroup({
        id: 'priorities',
        title: 'Mức độ ưu tiên',
        options: PRIORITY_FILTER_OPTIONS,
        selectedValues: advancedFilters.priorities,
        getOptionCount: (val) => tickets.filter((t) => t.priority === val).length,
      }),
      createFilterGroup({
        id: 'types',
        title: 'Loại ticket',
        options: TYPE_FILTER_OPTIONS,
        selectedValues: advancedFilters.types,
        getOptionCount: (val) => tickets.filter((t) => t.type === val).length,
      }),
      createFilterGroup({
        id: 'assignees',
        title: 'Người phụ trách',
        options: ASSIGNEE_FILTER_OPTIONS,
        selectedValues: advancedFilters.assignees,
        getOptionCount: (val) => tickets.filter((t) => t.assignee === val).length,
      }),
    ],
    [tickets, advancedFilters]
  )

  const activeFilterCount =
    advancedFilters.branches.length +
    advancedFilters.statuses.length +
    advancedFilters.categories.length +
    advancedFilters.priorities.length +
    advancedFilters.types.length +
    advancedFilters.assignees.length

  // Filter Toggling
  const handleToggleFilter = (sectionId: string, value: string) => {
    setPage(1)
    setAdvancedFilters((prev) => {
      const key = sectionId as keyof AdvancedFilterState
      const currentValues = prev[key] as string[]
      const exists = currentValues.includes(value)
      const nextValues = exists
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]
      return { ...prev, [key]: nextValues }
    })
  }

  const handleClearFilterSection = (sectionId: string) => {
    setPage(1)
    setAdvancedFilters((prev) => ({
      ...prev,
      [sectionId]: [],
    }))
  }

  const handleClearAllFilters = () => {
    setPage(1)
    setAdvancedFilters(INITIAL_ADVANCED_FILTER_STATE)
  }

  const handleResetFilters = useCallback(() => {
    setActiveBranch('all')
    setActiveCategory('all')
    setActiveStatus('all')
    setActiveType('all')
    setSearchTerm('')
    setAdvancedFilters(INITIAL_ADVANCED_FILTER_STATE)
    setPage(1)
    setSelectedIds(new Set())
    toast.info('Đã làm mới tất cả các bộ lọc!')
  }, [])

  // Selection handlers
  const toggleSelectAll = useCallback(() => {
    const pagedIds = pagedTickets.map((t) => t.id)
    const isAll = pagedIds.length > 0 && pagedIds.every((id) => selectedIds.has(id))
    setSelectedIds(isAll ? new Set() : new Set(pagedIds))
  }, [pagedTickets, selectedIds])

  const toggleSelectOne = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // Bulk status update
  const handleBulkStatusChange = useCallback(
    (newStatus: SupportTicket['status']) => {
      if (selectedIds.size === 0) return
      setTickets((prev) =>
        prev.map((t) => (selectedIds.has(t.id) ? { ...t, status: newStatus } : t))
      )
      toast.success(`Đã cập nhật trạng thái cho ${selectedIds.size} ticket đã chọn!`)
      setSelectedIds(new Set())
    },
    [selectedIds]
  )

  // Ticket actions
  const handleViewTicket = useCallback((ticket: SupportTicket) => {
    setSelectedTicketId(ticket.id)
    setIsDetailOpen(true)
  }, [])

  const handleStatusChange = useCallback(
    (ticketId: string, newStatus: SupportTicket['status']) => {
      updateTicketStatus(ticketId, newStatus)
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      )
    },
    []
  )

  const handleAddInteraction = useCallback(
    (ticketId: string, log: Omit<TicketInteractionLog, 'id' | 'date'>) => {
      addTicketInteraction(ticketId, log)
      const newLogItem: TicketInteractionLog = {
        ...log,
        id: `log-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
      }
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? { ...t, interactionLogs: [...t.interactionLogs, newLogItem] }
            : t
        )
      )
    },
    []
  )

  const handleCreateTicket = useCallback(
    (newTicketData: Omit<SupportTicket, 'id' | 'createdDate' | 'interactionLogs'>) => {
      const created = createTicket(newTicketData)
      setTickets((prev) => [created, ...prev])
      setPage(1)
    },
    []
  )

  const handleCancelTicket = useCallback((ticketId: string) => {
    updateTicketStatus(ticketId, 'cancelled')
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'cancelled' } : t))
    )
    toast.success('Đã hủy / đóng ticket thành công!')
  }, [])

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {/* Header Toolbar & Status Tiles matching QcCheckToolbar */}
      <SupportTicketsToolbar
        activeBranch={activeBranch}
        activeCategory={activeCategory}
        activeStatus={activeStatus}
        activeType={activeType}
        statusTileTotals={statusTileTotals}
        searchTerm={searchTerm}
        activeFilterCount={activeFilterCount}
        onBranchChange={(b) => {
          setActiveBranch(b)
          setPage(1)
        }}
        onCategoryChange={(c) => {
          setActiveCategory(c)
          setPage(1)
        }}
        onStatusChange={(s) => {
          setActiveStatus(s)
          setPage(1)
        }}
        onTypeChange={(t) => {
          setActiveType(t)
          setPage(1)
        }}
        onSearchChange={(v) => {
          setSearchTerm(v)
          setPage(1)
        }}
        onOpenFilters={() => setIsFilterOpen(true)}
        onResetFilters={handleResetFilters}
        onCreate={() => setIsCreateOpen(true)}
      />

      {/* Main Content Area: Table (Left) + Aside Filter Drawer (Right) matching QcCheckScreen */}
      <div className="flex flex-1 min-h-0 w-full gap-2 overflow-hidden px-2.5 pb-2 pt-1 lg:px-3 lg:pb-2.5">
        <div className="flex-1 min-w-0 h-full overflow-hidden">
          <SupportTicketsTable
            tickets={pagedTickets}
            selectedIds={selectedIds}
            onToggleAll={toggleSelectAll}
            onToggleOne={toggleSelectOne}
            onViewTicket={handleViewTicket}
            onCancelTicket={handleCancelTicket}
            onBulkStatusChange={handleBulkStatusChange}
            pagination={{
              page: currentPage,
              total: filteredTickets.length,
              pageSize,
              onPageChange: setPage,
              onPageSizeChange: (newSize) => {
                setPageSize(newSize)
                setPage(1)
              },
            }}
          />
        </div>

        {/* Slide-over Advanced Filter Aside Panel */}
        {isFilterOpen && (
          <FilterGroupAsidePanel
            title="Bộ lọc nâng cao"
            groups={filterGroups}
            description="Lọc ticket theo trạng thái, cơ sở, phân loại, độ ưu tiên, loại ticket và người phụ trách."
            onToggle={handleToggleFilter}
            onClearSection={handleClearFilterSection}
            onClearAll={handleClearAllFilters}
            onClose={() => setIsFilterOpen(false)}
          />
        )}
      </div>

      {/* Detail & History Dialog */}
      <SupportTicketsDetailDialog
        ticket={selectedTicket}
        open={isDetailOpen}
        onOpenChange={(open) => {
          setIsDetailOpen(open)
          if (!open) setSelectedTicketId(null)
        }}
        onStatusChange={handleStatusChange}
        onAddInteraction={handleAddInteraction}
      />

      {/* Create Ticket Dialog */}
      <SupportTicketsCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onTicketCreated={handleCreateTicket}
      />
    </div>
  )
}

export default SupportTicketsScreen
