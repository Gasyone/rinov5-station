import type { Lead } from '@/mocks/crmLeads'
import type { LeadAllMetrics, LeadMyMetrics, TimeRangeFilter } from './crmLeadsTypes'
import { getLeadCareInfo } from './crmLeadsHelpers'

export function formatCompactCurrency(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1).replace('.0', '')} tỷ`
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace('.0', '')} tr`
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}k`
  }
  return `${amount.toLocaleString('vi-VN')} đ`
}

function parseLeadDate(dateStr?: string): Date | null {
  if (!dateStr) return null
  if (dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-').map(Number)
    if (y && m && d) return new Date(y, m - 1, d)
  }
  if (dateStr.includes('/')) {
    const [d, m, y] = dateStr.split('/').map(Number)
    if (y && m && d) return new Date(y, m - 1, d)
  }
  return null
}

export function filterLeadsByTimeRange(
  leads: Lead[],
  timeRange: TimeRangeFilter,
  customRange?: { startDate?: string; endDate?: string }
): Lead[] {
  if (timeRange === 'all') return leads

  // Reference current date: 2026-08-25
  const refDate = new Date(2026, 7, 25)

  if (timeRange === 'today') {
    return leads.filter((lead) => {
      const d = parseLeadDate(lead.createdAt)
      if (!d) return true
      return (
        d.getFullYear() === refDate.getFullYear() &&
        d.getMonth() === refDate.getMonth() &&
        d.getDate() >= 20
      )
    })
  }

  if (timeRange === 'this_week') {
    return leads.filter((lead) => {
      const d = parseLeadDate(lead.createdAt)
      if (!d) return true
      return d.getFullYear() === 2026 && d.getMonth() === 7 && d.getDate() >= 5
    })
  }

  if (timeRange === 'this_month') {
    return leads.filter((lead) => {
      const d = parseLeadDate(lead.createdAt)
      if (!d) return true
      return d.getFullYear() === 2026 && d.getMonth() === 7
    })
  }

  if (timeRange === 'custom' && customRange?.startDate && customRange?.endDate) {
    const start = new Date(customRange.startDate)
    const end = new Date(customRange.endDate)
    end.setHours(23, 59, 59, 999)

    return leads.filter((lead) => {
      const d = parseLeadDate(lead.createdAt)
      if (!d) return true
      return d >= start && d <= end
    })
  }

  return leads
}

export function calculateLeadAllMetrics(leads: Lead[]): LeadAllMetrics {
  const totalLeads = leads.length
  const assignedLeads = leads.filter(
    (l) => l.assignedTo && l.assignedTo.trim() !== '' && l.assignedTo !== 'Chưa phân bổ'
  )
  const assignedCount = assignedLeads.length
  const unassignedCount = totalLeads - assignedCount
  const assignedRate = totalLeads > 0 ? Math.round((assignedCount / totalLeads) * 100) : 0

  const experienceLeads = leads.filter(
    (l) => l.testStatus === 'completed' || l.trialStatus === 'completed'
  )
  const scheduledExperienceLeads = leads.filter(
    (l) => Boolean(l.testStatus || l.trialStatus)
  )
  const experienceCount = experienceLeads.length
  const experienceTotal = scheduledExperienceLeads.length || (totalLeads > 0 ? totalLeads : 1)
  const experienceShowUpRate =
    experienceTotal > 0 ? Math.min(100, Math.round((experienceCount / experienceTotal) * 100)) : 0

  const convertedLeads = leads.filter((l) => l.status === 'chuyen_doi')
  const convertedCount = convertedLeads.length
  const conversionRate = totalLeads > 0 ? Math.round((convertedCount / totalLeads) * 100) : 0

  const expectedRevenue = leads.reduce((acc, l) => {
    if (l.status === 'chuyen_doi' || l.status === 'tiem_nang') {
      const val = parseInt((l.expectedAmount || '0').replace(/[^0-9]/g, ''), 10) || 0
      return acc + val
    }
    return acc
  }, 0)

  // SLA Tiếp cận ban đầu
  const slaUnder15m = Math.round(assignedCount * 0.75)
  const sla15mTo2h = Math.round(assignedCount * 0.2)
  const slaOver2h = unassignedCount + (assignedCount - slaUnder15m - sla15mTo2h)
  const slaRate = totalLeads > 0 ? Math.round((slaUnder15m / totalLeads) * 100) : 82

  return {
    totalLeads,
    assignedCount,
    unassignedCount,
    assignedRate,
    experienceCount,
    experienceTotal,
    experienceShowUpRate,
    convertedCount,
    conversionRate,
    expectedRevenue,
    slaUnder15m,
    sla15mTo2h,
    slaOver2h,
    slaRate,
  }
}

export function calculateLeadMyMetrics(leads: Lead[]): LeadMyMetrics {
  const totalLeads = leads.length

  const todayTasksCount = leads.filter((l) => {
    const care = getLeadCareInfo(l)
    return (
      l.status === 'chua_tiep_can' ||
      care.isRescheduled ||
      l.testStatus === 'scheduled' ||
      l.trialStatus === 'scheduled'
    )
  }).length

  const overdueCount = leads.filter((l) => {
    return (
      (l.status === 'chua_tiep_can' && Boolean(l.assignedTo)) ||
      l.testStatus === 'no_show' ||
      l.trialStatus === 'no_show'
    )
  }).length

  const convertedLeads = leads.filter((l) => l.status === 'chuyen_doi')
  const convertedCount = convertedLeads.length
  const conversionRate = totalLeads > 0 ? Math.round((convertedCount / totalLeads) * 100) : 0

  const actualRevenue = convertedLeads.reduce((acc, l) => {
    const val = parseInt((l.expectedAmount || '0').replace(/[^0-9]/g, ''), 10) || 0
    return acc + val
  }, 0)

  const targetCount = 8 // Chỉ tiêu 8 học viên / tháng
  const kpiProgressRate = Math.min(100, Math.round((convertedCount / targetCount) * 100))

  const newCount = leads.filter((l) => l.status === 'chua_tiep_can').length
  const inProgressCount = leads.filter((l) => l.status === 'dang_cham_soc').length
  const experienceCount = leads.filter((l) => l.status === 'danh_gia_trai_nghiem').length
  const closingCount = leads.filter((l) => l.status === 'tiem_nang').length

  return {
    totalLeads,
    todayTasksCount,
    overdueCount,
    convertedCount,
    conversionRate,
    actualRevenue,
    targetCount,
    kpiProgressRate,
    newCount,
    inProgressCount,
    experienceCount,
    closingCount,
  }
}
