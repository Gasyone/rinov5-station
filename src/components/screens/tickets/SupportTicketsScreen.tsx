'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  mockTickets,
  addTicketInteraction,
  updateTicketStatus,
  createTicket,
  type SupportTicket,
  type TicketInteractionLog,
} from '@/mocks/tickets'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { SupportTicketsToolbar } from './SupportTicketsToolbar'
import { SupportTicketsTable } from './SupportTicketsTable'
import { SupportTicketsDetailDialog } from './SupportTicketsDetailDialog'
import { SupportTicketsCreateDialog } from './SupportTicketsCreateDialog'
import { filterTickets, computeTicketStatusTiles } from './supportTicketsHelpers'
import type { SupportTicketFilterState } from './supportTicketsTypes'
import { toast } from 'sonner'

export function SupportTicketsScreen() {
  const [tickets, setTickets] = useState<SupportTicket[]>(() => structuredClone(mockTickets))
  const [filters, setFilters] = useState<SupportTicketFilterState>({
    search: '',
    status: 'all',
    category: 'all',
    priority: 'all',
    type: 'all',
    assignee: 'all',
  })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  // Dialog states
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return filterTickets(tickets, filters)
  }, [tickets, filters])

  // Status tiles count based on currently filtered tickets (without status constraint)
  const statusTiles = useMemo(() => {
    const withoutStatusFilter = filterTickets(tickets, { ...filters, status: 'all' })
    return computeTicketStatusTiles(withoutStatusFilter)
  }, [tickets, filters])

  // Pagination
  const totalRecords = filteredTickets.length
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedTickets = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredTickets.slice(start, start + pageSize)
  }, [filteredTickets, currentPage, pageSize])

  const selectedTicket = useMemo(() => {
    if (!selectedTicketId) return null
    return tickets.find((t) => t.id === selectedTicketId) ?? null
  }, [tickets, selectedTicketId])

  // Filter handlers
  const handleFilterChange = useCallback(
    <K extends keyof SupportTicketFilterState>(key: K, value: SupportTicketFilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
      setPage(1)
    },
    []
  )

  const handleResetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: 'all',
      category: 'all',
      priority: 'all',
      type: 'all',
      assignee: 'all',
    })
    setPage(1)
    toast.info('Đã làm mới các bộ lọc!')
  }, [])

  // Ticket action handlers
  const handleViewTicket = useCallback((ticket: SupportTicket) => {
    setSelectedTicketId(ticket.id)
    setIsDetailOpen(true)
  }, [])

  const handleStatusChange = useCallback((ticketId: string, newStatus: SupportTicket['status']) => {
    updateTicketStatus(ticketId, newStatus)
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    )
  }, [])

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
    <div className="flex h-full min-h-0 flex-col gap-3 px-4 py-3 lg:px-6">
      {/* Header Toolbar & Status Tiles */}
      <SupportTicketsToolbar
        filters={filters}
        statusTiles={statusTiles}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        onCreateTicket={() => setIsCreateOpen(true)}
      />

      {/* Main Table Frame */}
      <div className="min-h-0 flex-1">
        <DataTableFrame
          footer={
            <DataTablePagination
              page={currentPage}
              total={totalRecords}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize)
                setPage(1)
              }}
            />
          }
        >
          <SupportTicketsTable
            tickets={pagedTickets}
            onViewTicket={handleViewTicket}
            onCancelTicket={handleCancelTicket}
          />
        </DataTableFrame>
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
