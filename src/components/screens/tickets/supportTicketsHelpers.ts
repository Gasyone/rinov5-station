import type { SupportTicket } from '@/mocks/tickets'
import type { SupportTicketFilterState, StatusTileItem, TicketStatusFilter } from './supportTicketsTypes'
import { STATUS_LABELS } from './supportTicketsTypes'

export function filterTickets(
  tickets: SupportTicket[],
  filters: SupportTicketFilterState
): SupportTicket[] {
  return tickets.filter((ticket) => {
    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const matches =
        ticket.id.toLowerCase().includes(q) ||
        ticket.title.toLowerCase().includes(q) ||
        ticket.studentName.toLowerCase().includes(q) ||
        ticket.studentCode.toLowerCase().includes(q) ||
        ticket.assignee.toLowerCase().includes(q) ||
        (ticket.alertCode && ticket.alertCode.toLowerCase().includes(q)) ||
        ticket.description.toLowerCase().includes(q)
      if (!matches) return false
    }

    // Status filter
    if (filters.status !== 'all' && ticket.status !== filters.status) {
      return false
    }

    // Category filter
    if (filters.category !== 'all' && ticket.category !== filters.category) {
      return false
    }

    // Priority filter
    if (filters.priority !== 'all' && ticket.priority !== filters.priority) {
      return false
    }

    // Type filter
    if (filters.type !== 'all' && ticket.type !== filters.type) {
      return false
    }

    // Assignee filter
    if (filters.assignee !== 'all' && ticket.assignee !== filters.assignee) {
      return false
    }

    return true
  })
}

export function computeTicketStatusTiles(tickets: SupportTicket[]): StatusTileItem[] {
  const statusCounts: Record<TicketStatusFilter, number> = {
    all: tickets.length,
    new: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
  }

  for (const ticket of tickets) {
    if (statusCounts[ticket.status] !== undefined) {
      statusCounts[ticket.status] += 1
    }
  }

  return [
    { id: 'all', label: 'Tất cả ticket', count: statusCounts.all, variant: 'default' },
    { id: 'new', label: STATUS_LABELS.new, count: statusCounts.new, variant: 'info' },
    { id: 'pending', label: STATUS_LABELS.pending, count: statusCounts.pending, variant: 'warning' },
    { id: 'in_progress', label: STATUS_LABELS.in_progress, count: statusCounts.in_progress, variant: 'info' },
    { id: 'completed', label: STATUS_LABELS.completed, count: statusCounts.completed, variant: 'success' },
    { id: 'cancelled', label: STATUS_LABELS.cancelled, count: statusCounts.cancelled, variant: 'neutral' },
  ]
}

export function formatTicketDate(dateStr: string): string {
  if (!dateStr) return '-'
  try {
    const [year, month, day] = dateStr.split('-')
    if (year && month && day) {
      return `${day}/${month}/${year}`
    }
    return dateStr
  } catch {
    return dateStr
  }
}
