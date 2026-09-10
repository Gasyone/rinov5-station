import { PaymentReceipt } from '@/mocks/paymentReceipts'
import {
  ReceiptMetrics,
  ReceiptTimeRangeFilter,
  FilterDebtStatus,
  FilterAmountRange,
  ReceiptSortField,
  ReceiptSortDirection,
} from './paymentReceiptsTypes'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCompactCurrency(amount: number): string {
  const absAmount = Math.abs(amount)
  const sign = amount < 0 ? '-' : ''
  if (absAmount >= 1_000_000_000) {
    return `${sign}${(absAmount / 1_000_000_000).toFixed(1).replace(/\.0$/, '')} tỷ`
  }
  if (absAmount >= 1_000_000) {
    return `${sign}${(absAmount / 1_000_000).toFixed(1).replace(/\.0$/, '')} tr`
  }
  if (absAmount >= 1_000) {
    return `${sign}${(absAmount / 1_000).toFixed(0)}k`
  }
  return `${amount.toLocaleString('vi-VN')} đ`
}

/**
 * Mã hóa số điện thoại theo định dạng *******xxx (ẩn 7 chữ số đầu, giữ lại 3 số cuối)
 */
export function maskPhoneNumber(phone?: string | null): string {
  if (!phone) return '*******111'
  const clean = phone.replace(/\D/g, '')
  if (clean.length <= 3) return clean || phone
  const last3 = clean.slice(-3)
  const starCount = Math.max(clean.length - 3, 7)
  return `${'*'.repeat(starCount)}${last3}`
}

/**
 * Chuẩn hóa và hiển thị ngày gọn dạng DD/MM/YYYY
 */
export function formatReceiptDate(dateStr?: string | null): string {
  if (!dateStr) return ''
  if (dateStr.includes(' - ')) {
    const parts = dateStr.split(' - ')
    return parts[1] || parts[0]
  }
  if (dateStr.includes(' ')) {
    const parts = dateStr.split(' ')
    return parts[0].includes('/') ? parts[0] : (parts[1] || dateStr)
  }
  return dateStr
}

export function parseReceiptDate(dateStr?: string | null): Date | null {
  if (!dateStr) return null
  const match = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (match) {
    const [, day, month, year] = match
    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10))
  }
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : d
}

export function calculateReceiptMetrics(receipts: PaymentReceipt[]): ReceiptMetrics {
  const total = receipts.length
  let totalReceipts = 0
  let totalVouchers = 0
  let receiptCount = 0
  let voucherCount = 0
  let completedCount = 0
  let pendingCount = 0
  let cancelledCount = 0
  let qrCount = 0
  let cashCount = 0
  let posCount = 0
  let bankTransferCount = 0

  receipts.forEach((r) => {
    if (r.transactionType === 'receipt') {
      receiptCount++
      if (r.status === 'completed') {
        totalReceipts += r.amount
      }
    } else {
      voucherCount++
      if (r.status === 'completed') {
        totalVouchers += r.amount
      }
    }

    if (r.status === 'completed') completedCount++
    else if (r.status === 'pending') pendingCount++
    else if (r.status === 'cancelled') cancelledCount++

    if (r.paymentMethod === 'qr_transfer') qrCount++
    else if (r.paymentMethod === 'cash') cashCount++
    else if (r.paymentMethod === 'pos_card') posCount++
    else if (r.paymentMethod === 'bank_transfer') bankTransferCount++
  })

  const netCash = totalReceipts - totalVouchers
  const successRate = total > 0 ? Math.round((completedCount / total) * 100) : 0

  return {
    total,
    totalReceipts,
    totalVouchers,
    netCash,
    receiptCount,
    voucherCount,
    completedCount,
    pendingCount,
    cancelledCount,
    successRate,
    qrCount,
    cashCount,
    posCount,
    bankTransferCount,
  }
}

export function filterReceiptsByTimeRange(
  items: PaymentReceipt[],
  timeRange: ReceiptTimeRangeFilter,
  customRange?: { startDate?: string; endDate?: string }
): PaymentReceipt[] {
  if (timeRange === 'all') return items

  // When explicit ISO date boundaries are provided, filter directly by date range
  if (customRange?.startDate || customRange?.endDate) {
    return items.filter((r) => {
      const d = parseReceiptDate(r.createdAt)
      if (!d) return false
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const dateIso = `${year}-${month}-${day}`
      if (customRange.startDate && dateIso < customRange.startDate) return false
      if (customRange.endDate && dateIso > customRange.endDate) return false
      return true
    })
  }

  // Reference year and month: August 2026
  const refYear = 2026
  const refMonth = 7 // August (0-indexed)

  return items.filter((r) => {
    const d = parseReceiptDate(r.createdAt)
    if (!d) return false
    const y = d.getFullYear()
    const m = d.getMonth()
    const day = d.getDate()

    if (timeRange === 'this_month') {
      return y === refYear && m === refMonth
    }
    if (timeRange === 'last_month') {
      return y === refYear && m === refMonth - 1
    }
    if (timeRange === 'today') {
      return y === refYear && m === refMonth && day >= 24
    }
    if (timeRange === 'this_week' || timeRange === '7days') {
      return y === refYear && m === refMonth && day >= 18
    }
    if (timeRange === '30days') {
      return (y === refYear && m === refMonth) || (y === refYear && m === refMonth - 1 && day >= 25)
    }
    if (timeRange === 'this_quarter') {
      return y === refYear && m >= 6 && m <= 8
    }
    return true
  })
}

export function filterReceiptsByDebt(
  items: PaymentReceipt[],
  debtStatus: FilterDebtStatus
): PaymentReceipt[] {
  if (debtStatus === 'all') return items
  if (debtStatus === 'has_debt') {
    return items.filter((r) => r.orderRemainingAmount > 0)
  }
  if (debtStatus === 'settled') {
    return items.filter((r) => r.orderRemainingAmount <= 0)
  }
  return items
}

export function filterReceiptsByAmountRange(
  items: PaymentReceipt[],
  amountRange: FilterAmountRange
): PaymentReceipt[] {
  if (amountRange === 'all') return items
  return items.filter((r) => {
    if (amountRange === 'under_1m') return r.amount < 1_000_000
    if (amountRange === '1m_to_5m') return r.amount >= 1_000_000 && r.amount <= 5_000_000
    if (amountRange === '5m_to_20m') return r.amount > 5_000_000 && r.amount <= 20_000_000
    if (amountRange === 'over_20m') return r.amount > 20_000_000
    return true
  })
}

export function getReceiptStaffList(receipts: PaymentReceipt[]): string[] {
  return Array.from(new Set(receipts.map((r) => r.createdBy).filter(Boolean))).sort()
}

export function getReceiptBankAccounts(receipts: PaymentReceipt[]): string[] {
  return Array.from(
    new Set(receipts.map((r) => r.bankAccount).filter(Boolean) as string[])
  ).sort()
}

export function sortReceipts(
  items: PaymentReceipt[],
  field: ReceiptSortField,
  direction: ReceiptSortDirection
): PaymentReceipt[] {
  return [...items].sort((a, b) => {
    if (field === 'amount') {
      return direction === 'asc' ? a.amount - b.amount : b.amount - a.amount
    }
    const dateA = parseReceiptDate(a.createdAt)?.getTime() ?? 0
    const dateB = parseReceiptDate(b.createdAt)?.getTime() ?? 0
    return direction === 'asc' ? dateA - dateB : dateB - dateA
  })
}

