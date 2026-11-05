import type { SupportTicket } from '@/mocks/tickets'
import type {
  TicketStatusFilter,
  AdvancedFilterState,
} from './supportTicketsTypes'

export function matchesTicketSearch(ticket: SupportTicket, searchTerm: string): boolean {
  if (!searchTerm) return true
  const q = searchTerm.toLowerCase().trim()
  return Boolean(
    ticket.id.toLowerCase().includes(q) ||
    ticket.title.toLowerCase().includes(q) ||
    ticket.studentName.toLowerCase().includes(q) ||
    ticket.studentCode.toLowerCase().includes(q) ||
    (ticket.studentPhone && ticket.studentPhone.includes(q)) ||
    (ticket.branch && ticket.branch.toLowerCase().includes(q)) ||
    ticket.assignee.toLowerCase().includes(q) ||
    (ticket.alertCode && ticket.alertCode.toLowerCase().includes(q)) ||
    ticket.description.toLowerCase().includes(q)
  )
}

export function filterTickets(
  tickets: SupportTicket[],
  options: {
    activeBranch: string
    activeCategory: string
    activeStatus: TicketStatusFilter
    activeType: string
    searchTerm: string
    advancedFilters: AdvancedFilterState
  }
): SupportTicket[] {
  const {
    activeBranch,
    activeCategory,
    activeStatus,
    activeType,
    searchTerm,
    advancedFilters,
  } = options

  return tickets.filter((ticket) => {
    // Branch filter from Toolbar
    if (activeBranch !== 'all' && ticket.branch !== activeBranch) {
      return false
    }

    // Category filter from Toolbar
    if (activeCategory !== 'all' && ticket.category !== activeCategory) {
      return false
    }

    // Type filter from Toolbar SegmentedControl
    if (activeType !== 'all' && ticket.type !== activeType) {
      return false
    }

    // Status filter from StatusTiles
    if (activeStatus !== 'all' && ticket.status !== activeStatus) {
      return false
    }

    // Search filter
    if (searchTerm && !matchesTicketSearch(ticket, searchTerm)) {
      return false
    }

    // Advanced Drawer Filters
    if (advancedFilters.branches.length > 0 && (!ticket.branch || !advancedFilters.branches.includes(ticket.branch))) {
      return false
    }
    if (advancedFilters.statuses.length > 0 && !advancedFilters.statuses.includes(ticket.status)) {
      return false
    }
    if (advancedFilters.categories.length > 0 && !advancedFilters.categories.includes(ticket.category)) {
      return false
    }
    if (advancedFilters.priorities.length > 0 && !advancedFilters.priorities.includes(ticket.priority)) {
      return false
    }
    if (advancedFilters.types.length > 0 && !advancedFilters.types.includes(ticket.type)) {
      return false
    }
    if (advancedFilters.assignees.length > 0 && !advancedFilters.assignees.includes(ticket.assignee)) {
      return false
    }

    return true
  })
}

/**
 * Dynamic calculation of status tile totals based on all current filters except status filter
 * Rule 5: Thẻ trạng thái đi theo bộ lọc
 */
export function computeTicketStatusTotals(
  tickets: SupportTicket[],
  options: {
    activeBranch: string
    activeCategory: string
    activeType: string
    searchTerm: string
    advancedFilters: AdvancedFilterState
  }
): Record<string, number> {
  const {
    activeBranch,
    activeCategory,
    activeType,
    searchTerm,
    advancedFilters,
  } = options

  // Base filtered tickets without status constraint
  const baseFiltered = tickets.filter((ticket) => {
    if (activeBranch !== 'all' && ticket.branch !== activeBranch) return false
    if (activeCategory !== 'all' && ticket.category !== activeCategory) return false
    if (activeType !== 'all' && ticket.type !== activeType) return false
    if (searchTerm && !matchesTicketSearch(ticket, searchTerm)) return false

    if (advancedFilters.branches.length > 0 && (!ticket.branch || !advancedFilters.branches.includes(ticket.branch))) {
      return false
    }
    if (advancedFilters.statuses.length > 0 && !advancedFilters.statuses.includes(ticket.status)) {
      return false
    }
    if (advancedFilters.categories.length > 0 && !advancedFilters.categories.includes(ticket.category)) {
      return false
    }
    if (advancedFilters.priorities.length > 0 && !advancedFilters.priorities.includes(ticket.priority)) {
      return false
    }
    if (advancedFilters.types.length > 0 && !advancedFilters.types.includes(ticket.type)) {
      return false
    }
    if (advancedFilters.assignees.length > 0 && !advancedFilters.assignees.includes(ticket.assignee)) {
      return false
    }

    return true
  })

  const totals: Record<string, number> = {
    all: baseFiltered.length,
    new: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
  }

  for (const t of baseFiltered) {
    if (totals[t.status] !== undefined) {
      totals[t.status] += 1
    }
  }

  return totals
}

/**
 * Mask phone number on the list table as 091****111 to prevent bulk scraping
 * per RULE[user_global] & ENTERPRISE_STANDARDS
 */
export function maskPhoneNumber(phone?: string | null): string {
  if (!phone) return '-'
  const clean = phone.replace(/\s+/g, '')
  if (clean.length < 7) return clean
  const prefix = clean.slice(0, 3)
  const suffix = clean.slice(-3)
  return `${prefix}****${suffix}`
}

export function formatTicketDate(dateStr?: string | null): string {
  if (!dateStr) return '-'
  try {
    const parts = dateStr.split('T')[0].split('-')
    if (parts.length === 3) {
      const [year, month, day] = parts
      return `${day}/${month}/${year}`
    }
    return dateStr
  } catch {
    return dateStr
  }
}

export function sortTickets(tickets: SupportTicket[]): SupportTicket[] {
  const priorityWeight: Record<SupportTicket['priority'], number> = {
    high: 3,
    medium: 2,
    low: 1,
  }

  return [...tickets].sort((a, b) => {
    // 1. High priority first
    const pDiff = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0)
    if (pDiff !== 0) return pDiff

    // 2. Created date descending (newest first)
    const dateA = new Date(a.createdDate).getTime() || 0
    const dateB = new Date(b.createdDate).getTime() || 0
    return dateB - dateA
  })
}
