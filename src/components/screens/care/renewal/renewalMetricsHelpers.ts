import type { StudentCareAlert } from '@/mocks/careAlerts'
import { mockOrders } from '@/mocks/orders'
import { getRenewalClassification, isDaTaiPhi, stableHash } from './renewalHelpers'

export type RenewalTimeRangeFilter =
  | 'this_month'
  | 'last_month'
  | 'this_quarter'
  | 'this_year'
  | 'custom'
  | 'all'

export interface RenewalTimeRangeOption {
  value: RenewalTimeRangeFilter
  label: string
}

export const RENEWAL_TIME_RANGE_OPTIONS: RenewalTimeRangeOption[] = [
  { value: 'this_month', label: 'Tháng này (T08/2026)' },
  { value: 'last_month', label: 'Tháng trước (T07/2026)' },
  { value: 'this_quarter', label: 'Quý này (Q3/2026)' },
  { value: 'this_year', label: 'Năm nay (2026)' },
  { value: 'custom', label: 'Tùy chọn khoảng ngày...' },
  { value: 'all', label: 'Tất cả thời gian' },
]

export interface RenewalMetrics {
  total: number
  renewalRate: number // Tỷ lệ tái phí thành công (%)
  revenue: number // Doanh thu tái phí đã thu
  outstanding: number // Học phí tái phí còn nợ
  completed: number // Đơn tái phí thành công / hoàn tất
  collectionRate: number // Tiến độ thu học phí tái phí (%)
  paidCount: number // Đã thu đủ
  partialCount: number // Thu 1 phần
  unpaidCount: number // Chưa thu
}

export function formatCompactCurrency(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '')} tỷ`
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')} tr`
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}k`
  }
  return `${amount.toLocaleString('vi-VN')} đ`
}

function getStudentIsoDate(item: StudentCareAlert): string | null {
  if (item.expectedEndDate) {
    const parts = item.expectedEndDate.split('/')
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0')
      const month = parts[1].padStart(2, '0')
      const year = parts[2]
      return `${year}-${month}-${day}`
    }
  }
  return null
}

/**
 * Filter alerts by time range based on active renewal cohort & dates
 */
export function filterRenewalAlertsByTimeRange(
  alerts: StudentCareAlert[],
  timeRange: RenewalTimeRangeFilter,
  customRange?: { startDate?: string; endDate?: string }
): StudentCareAlert[] {
  if (timeRange === 'all') return alerts

  if (timeRange === 'custom') {
    if (!customRange?.startDate && !customRange?.endDate) return alerts
    return alerts.filter((item) => {
      const isoDate = getStudentIsoDate(item)
      if (!isoDate) return true
      if (customRange.startDate && isoDate < customRange.startDate) return false
      if (customRange.endDate && isoDate > customRange.endDate) return false
      return true
    })
  }

  if (timeRange === 'this_month') {
    // Current active renewal cohort for August 2026
    const taiPhiItems = alerts.filter(isDaTaiPhi)
    const pipelineItems = alerts.filter((a) => !isDaTaiPhi(a))

    // Select 5 tai_phi + 3 pipeline items to form standard 8-order cohort
    const selectedTaiPhi = taiPhiItems.slice(0, 5)
    const selectedPipeline = pipelineItems.slice(0, 3)
    const combined = [...selectedTaiPhi, ...selectedPipeline]

    return combined.length > 0 ? combined : alerts.slice(0, 8)
  }

  if (timeRange === 'last_month') {
    return alerts.filter((item) => {
      const hash = stableHash(item.studentId)
      return hash % 2 === 0
    })
  }

  if (timeRange === 'this_quarter') {
    return alerts.filter((item) => {
      const hash = stableHash(item.studentId)
      return hash % 4 !== 0
    })
  }

  if (timeRange === 'this_year') {
    return alerts
  }

  return alerts
}

export interface StudentFinancialInfo {
  studentId: string
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  paymentStatus: 'paid' | 'partial' | 'unpaid'
  isCompleted: boolean
}

/**
 * Derives financial metrics for a single student care alert
 */
export function getStudentFinancialInfo(item: StudentCareAlert): StudentFinancialInfo {
  const classification = getRenewalClassification(item)
  const hash = stableHash(item.studentId)

  // Standard tuition package amount based on subject
  const basePackageAmount = item.subject === 'Toán tư duy' ? 5800000 : 7980000

  // Check if student has actual order in mockOrders
  const matchedOrder = mockOrders.find(
    (o) => o.studentId === item.studentId || (o.studentName && o.studentName.toLowerCase() === item.studentName.toLowerCase())
  )

  if (matchedOrder) {
    const totalAmount = matchedOrder.finalAmount || matchedOrder.totalAmount || basePackageAmount
    const paidAmount = matchedOrder.paidAmount ?? (matchedOrder.paymentStatus === 'paid' ? totalAmount : 0)
    const remainingAmount = matchedOrder.remainingAmount ?? Math.max(0, totalAmount - paidAmount)
    const isCompleted = classification === 'tai_phi' || matchedOrder.status === 'completed' || matchedOrder.paymentStatus === 'paid'
    return {
      studentId: item.studentId,
      totalAmount,
      paidAmount: isCompleted && paidAmount === 0 ? totalAmount : paidAmount,
      remainingAmount: isCompleted ? 0 : remainingAmount,
      paymentStatus: isCompleted ? 'paid' : (remainingAmount === 0 ? 'paid' : paidAmount > 0 ? 'partial' : 'unpaid'),
      isCompleted,
    }
  }

  if (classification === 'tai_phi') {
    // Completed renewal payment (100% paid)
    return {
      studentId: item.studentId,
      totalAmount: basePackageAmount,
      paidAmount: basePackageAmount,
      remainingAmount: 0,
      paymentStatus: 'paid',
      isCompleted: true,
    }
  }

  if (classification === 'can_nhac' || classification === 'tiem_nang' || classification === 'hen_tai') {
    // In pipeline: 2/3 have partial deposits, 1/3 unpaid
    const isPartial = hash % 3 !== 0
    if (isPartial) {
      const deposit = hash % 2 === 0 ? 2000000 : 1000000
      return {
        studentId: item.studentId,
        totalAmount: basePackageAmount,
        paidAmount: deposit,
        remainingAmount: basePackageAmount - deposit,
        paymentStatus: 'partial',
        isCompleted: false,
      }
    }
    return {
      studentId: item.studentId,
      totalAmount: basePackageAmount,
      paidAmount: 0,
      remainingAmount: basePackageAmount,
      paymentStatus: 'unpaid',
      isCompleted: false,
    }
  }

  // Mới / Khác
  return {
    studentId: item.studentId,
    totalAmount: basePackageAmount,
    paidAmount: 0,
    remainingAmount: basePackageAmount,
    paymentStatus: 'unpaid',
    isCompleted: false,
  }
}

/**
 * Calculates comprehensive metrics for a list of student care alerts
 */
export function calculateRenewalMetrics(alerts: StudentCareAlert[]): RenewalMetrics {
  let totalRevenue = 0
  let totalOutstanding = 0
  let paidCount = 0
  let partialCount = 0
  let unpaidCount = 0
  let completed = 0

  alerts.forEach((item) => {
    const fin = getStudentFinancialInfo(item)
    totalRevenue += fin.paidAmount
    totalOutstanding += fin.remainingAmount

    if (fin.paymentStatus === 'paid') {
      paidCount++
    } else if (fin.paymentStatus === 'partial') {
      partialCount++
    } else {
      unpaidCount++
    }

    if (fin.isCompleted) {
      completed++
    }
  })

  const total = alerts.length
  const totalValue = totalRevenue + totalOutstanding
  const collectionRate = totalValue > 0 ? Math.round((totalRevenue / totalValue) * 100) : 0
  const renewalRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return {
    total,
    renewalRate,
    revenue: totalRevenue,
    outstanding: totalOutstanding,
    completed,
    collectionRate,
    paidCount,
    partialCount,
    unpaidCount,
  }
}
