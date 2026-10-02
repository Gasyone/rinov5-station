import type { TuitionDebtItem } from './tuitionDebtTypes'

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ'
}

export function isDebtChoThu(item: TuitionDebtItem): boolean {
  return item.debtStatus === 'debt_cho_thu' || item.debtStatus === 'debt_moi'
}

export function isDebtThuMotPhan(item: TuitionDebtItem): boolean {
  return (
    item.debtStatus === 'debt_thu_mot_phan' ||
    item.debtStatus === 'debt_trong_han' ||
    item.debtStatus === 'debt_coc_hoc'
  )
}

export function isDebtDaThuDu(item: TuitionDebtItem): boolean {
  return item.debtStatus === 'debt_da_thu_du' || item.debtStatus === 'debt_da_thu'
}

export function isDebtDaHuy(item: TuitionDebtItem): boolean {
  return item.debtStatus === 'debt_da_huy' || item.debtStatus === 'debt_that_bai'
}

export function isOverdue(item: TuitionDebtItem): boolean {
  return Boolean(
    (item.daysOverdue ?? 0) > 0 &&
      !isDebtDaThuDu(item) &&
      !isDebtDaHuy(item)
  )
}

export function isCocHocLuon(item: TuitionDebtItem): boolean {
  return item.paymentPlan === 'coc_hoc_luon'
}

export function isCapReached(item: TuitionDebtItem): boolean {
  return (
    item.paymentPlan === 'coc_hoc_luon' &&
    item.allowedSessions !== undefined &&
    item.attendedSessions >= item.allowedSessions
  )
}

// Aliases for backward compatibility
export const isDebtMoi = isDebtChoThu
export const isDebtTrongHan = isDebtThuMotPhan
export const isDebtQuaHan = isOverdue
export const isDebtCocHoc = isCocHocLuon
export const isDebtDaThu = isDebtDaThuDu
export const isDebtThatBai = isDebtDaHuy

export function parseDate(dateStr?: string): number {
  if (!dateStr) return Infinity
  const parts = dateStr.split('/')
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10)
    const year = parseInt(parts[2], 10)
    return new Date(year, month - 1, day).getTime()
  }
  return Infinity
}

export function matchesDebtSearch(item: TuitionDebtItem, query: string): boolean {
  if (!query) return true
  const lower = query.toLowerCase().trim()
  return (
    item.studentName.toLowerCase().includes(lower) ||
    item.studentCode.toLowerCase().includes(lower) ||
    (item.englishName && item.englishName.toLowerCase().includes(lower)) ||
    item.parentName.toLowerCase().includes(lower) ||
    item.parentPhone.includes(lower) ||
    item.orderCode.toLowerCase().includes(lower) ||
    item.classCode.toLowerCase().includes(lower) ||
    item.csStaff.toLowerCase().includes(lower)
  )
}
