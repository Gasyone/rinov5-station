'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { getTickets, updateTicketStatus, addTicketInteraction, createTicket, type SupportTicket, type TicketInteractionLog } from '@/mocks/tickets'
import { SupportTicketsToolbar } from './SupportTicketsToolbar'
import { SupportTicketsTable } from './SupportTicketsTable'
import { TicketDetailDialog } from './TicketDetailDialog'
import { TicketCreateDialog } from './TicketCreateDialog'

export function SupportTicketsScreen() {
  const [activeStatus, setActiveStatus] = useState<'all' | 'new' | 'in_progress' | 'completed' | 'pending' | 'cancelled'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  // Local state trigger to reload mock calculations
  const [updateTrigger, setUpdateTrigger] = useState(0)

  const filtered = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    updateTrigger;
    return getTickets({
      search: searchQuery,
      category: categoryFilter || undefined,
      priority: priorityFilter || undefined,
      status: activeStatus === 'all' ? undefined : activeStatus,
    })
  }, [searchQuery, categoryFilter, priorityFilter, activeStatus, updateTrigger])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = useMemo(() => {
    return filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  }, [filtered, currentPage, pageSize])

  const handleViewDetails = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setDetailOpen(true)
  }

  const handleUpdateStatus = (ticketId: string, status: SupportTicket['status']) => {
    const success = updateTicketStatus(ticketId, status)
    if (success) {
      setUpdateTrigger((prev) => prev + 1)
      // Update selected ticket state in open dialog
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket((prev) => prev ? { ...prev, status } : null)
      }
      toast.success('Cập nhật trạng thái Ticket thành công')
    } else {
      toast.error('Có lỗi xảy ra')
    }
  }

  const handleAddInteraction = (ticketId: string, log: Omit<TicketInteractionLog, 'id' | 'date'>) => {
    const success = addTicketInteraction(ticketId, log)
    if (success) {
      setUpdateTrigger((prev) => prev + 1)
      // Sync selected ticket interactions
      if (selectedTicket && selectedTicket.id === ticketId) {
        const newLog: TicketInteractionLog = {
          ...log,
          id: `log-${Date.now()}`,
          date: new Date().toISOString().split('T')[0]
        }
        setSelectedTicket((prev) => prev ? { ...prev, interactionLogs: [...prev.interactionLogs, newLog] } : null)
      }
      toast.success('Thêm nhật ký tương tác thành công')
    } else {
      toast.error('Có lỗi xảy ra')
    }
  }

  const handleCreateTicket = (newTicket: Omit<SupportTicket, 'id' | 'createdDate' | 'interactionLogs'>) => {
    createTicket(newTicket)
    setUpdateTrigger((prev) => prev + 1)
    toast.success('Đã tạo phiếu hỗ trợ thành công')
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <SupportTicketsToolbar
        activeStatus={activeStatus}
        onStatusChange={(s) => { setActiveStatus(s); setPage(1) }}
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setPage(1) }}
        categoryFilter={categoryFilter}
        onCategoryChange={(c) => { setCategoryFilter(c); setPage(1) }}
        priorityFilter={priorityFilter}
        onPriorityChange={(p) => { setPriorityFilter(p); setPage(1) }}
        onCreateTicket={() => setCreateOpen(true)}
      />

      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-2 lg:px-6 lg:pb-6">
        <DataTableFrame
          footer={
            <DataTablePagination
              page={currentPage}
              total={filtered.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          }
        >
          <SupportTicketsTable
            tickets={paged}
            onViewDetails={handleViewDetails}
          />
        </DataTableFrame>
      </div>

      <TicketDetailDialog
        ticket={selectedTicket}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onUpdateStatus={handleUpdateStatus}
        onAddInteraction={handleAddInteraction}
      />

      <TicketCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateTicket}
      />
    </div>
  )
}
