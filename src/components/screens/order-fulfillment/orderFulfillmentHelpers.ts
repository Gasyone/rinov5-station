import type { OrderFulfillmentRecord } from '@/mocks/orderFulfillments'
import type {
  AdvancedFulfillmentFilterState,
  OrderFulfillmentFilterState,
} from './orderFulfillmentTypes'

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
 * Trích xuất ngày tạo (bỏ giờ, ví dụ "10:00 - 25/08/2026" -> "25/08/2026")
 */
export function extractDateOnly(dateTimeStr?: string): string {
  if (!dateTimeStr) return ''
  const match = dateTimeStr.match(/(\d{2}\/\d{2}\/\d{4})/)
  if (match) return match[1]
  return dateTimeStr.replace(/^[0-9:]+\s*-\s*/, '').trim()
}

/**
 * Rút gọn vai trò người nhận (bỏ chữ "học viên", ví dụ "Mẹ học viên" -> "Mẹ")
 */
export function cleanRecipientRole(role?: string): string {
  if (!role) return ''
  const cleaned = role.replace(/học viên/gi, '').trim()
  return cleaned || 'Học viên'
}

/**
 * Xác định thông tin NCC và tiến trình giao vận
 */
export function getDeliveryProgressInfo(record: OrderFulfillmentRecord): {
  ncc: string
  progress: string
  isExternal: boolean
} {
  const isExternal = Boolean(record.carrier || record.trackingCode)
  const ncc = isExternal ? (record.carrier || 'ĐVVC') : 'Nội bộ'

  let progress = ''
  if (isExternal) {
    switch (record.status) {
      case 'handed_over':
        progress = 'Đã phát thành công'
        break
      case 'shipping':
        progress = 'Đang phát hàng'
        break
      case 'pending_handover':
        progress = 'Chờ bàn giao ĐVVC'
        break
      case 'returned':
        progress = 'Hoàn về kho bưu cục'
        break
      default:
        progress = 'Đang xử lý'
    }
  } else {
    switch (record.status) {
      case 'handed_over':
        progress = 'Đã ký nhận tại quầy'
        break
      case 'pending_handover':
        progress = 'Chờ phụ huynh nhận'
        break
      case 'returned':
        progress = 'Lưu kho / Đã hủy'
        break
      default:
        progress = 'Chuẩn bị tại cơ sở'
    }
  }

  return { ncc, progress, isExternal }
}

export function filterOrderFulfillments(
  records: OrderFulfillmentRecord[],
  filters: OrderFulfillmentFilterState,
  advanced?: AdvancedFulfillmentFilterState
): OrderFulfillmentRecord[] {
  return records.filter((r) => {
    // Branch filter
    if (filters.branch !== 'all' && r.branch !== filters.branch) {
      return false
    }
    if (advanced?.branches.length && !advanced.branches.includes(r.branch)) {
      return false
    }

    // Status filter
    if (filters.status !== 'all' && r.status !== filters.status) {
      return false
    }
    if (advanced?.statuses.length && !advanced.statuses.includes(r.status)) {
      return false
    }

    // Delivery method filter
    if (filters.deliveryMethod !== 'all' && r.deliveryMethod !== filters.deliveryMethod) {
      return false
    }
    if (advanced?.deliveryMethods.length && !advanced.deliveryMethods.includes(r.deliveryMethod)) {
      return false
    }

    // Quick Filter Tabs
    if (filters.quickFilter === 'pickup' && r.deliveryMethod !== 'pickup') {
      return false
    }
    if (filters.quickFilter === 'shipping' && r.deliveryMethod !== 'shipping') {
      return false
    }
    if (filters.quickFilter === 'missing_pod') {
      const hasProof =
        (r.podImages && r.podImages.length > 0) ||
        (r.attachments && r.attachments.length > 0)
      if (hasProof) return false
    }
    if (filters.quickFilter === 'today') {
      const isToday = r.createdAt.includes('27/08/2026') || r.createdAt.includes('26/08/2026')
      if (!isToday) return false
    }

    // Carrier filter
    if (advanced?.carriers.length && (!r.carrier || !advanced.carriers.includes(r.carrier))) {
      return false
    }

    // Category filter
    if (
      advanced?.categories.length &&
      !r.products.some((p) => advanced.categories.includes(p.category))
    ) {
      return false
    }

    // Search term
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim()
      const match =
        r.id.toLowerCase().includes(q) ||
        r.orderNo.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.customerPhone.includes(q) ||
        r.studentName.toLowerCase().includes(q) ||
        (r.trackingCode && r.trackingCode.toLowerCase().includes(q)) ||
        r.products.some((p) => p.name.toLowerCase().includes(q))
      if (!match) return false
    }

    return true
  })
}

export function calculateFulfillmentCounts(
  records: OrderFulfillmentRecord[],
  filters: { branch: string; deliveryMethod: string; quickFilter?: string; search: string },
  advanced?: AdvancedFulfillmentFilterState
) {
  // Lọc theo bộ lọc phụ để đếm động theo cơ sở & hình thức nhận & từ khóa tìm kiếm & bộ lọc nâng cao
  const base = records.filter((r) => {
    if (filters.branch !== 'all' && r.branch !== filters.branch) return false
    if (advanced?.branches.length && !advanced.branches.includes(r.branch)) return false

    if (filters.deliveryMethod !== 'all' && r.deliveryMethod !== filters.deliveryMethod) return false
    if (advanced?.deliveryMethods.length && !advanced.deliveryMethods.includes(r.deliveryMethod)) {
      return false
    }

    if (filters.quickFilter === 'pickup' && r.deliveryMethod !== 'pickup') return false
    if (filters.quickFilter === 'shipping' && r.deliveryMethod !== 'shipping') return false
    if (filters.quickFilter === 'missing_pod') {
      const hasProof =
        (r.podImages && r.podImages.length > 0) ||
        (r.attachments && r.attachments.length > 0)
      if (hasProof) return false
    }
    if (filters.quickFilter === 'today') {
      const isToday = r.createdAt.includes('27/08/2026') || r.createdAt.includes('26/08/2026')
      if (!isToday) return false
    }

    if (advanced?.carriers.length && (!r.carrier || !advanced.carriers.includes(r.carrier))) {
      return false
    }
    if (
      advanced?.categories.length &&
      !r.products.some((p) => advanced.categories.includes(p.category))
    ) {
      return false
    }

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim()
      const match =
        r.id.toLowerCase().includes(q) ||
        r.orderNo.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.customerPhone.includes(q) ||
        r.studentName.toLowerCase().includes(q) ||
        (r.trackingCode && r.trackingCode.toLowerCase().includes(q)) ||
        r.products.some((p) => p.name.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })

  return {
    total: base.length,
    pending_handover: base.filter((r) => r.status === 'pending_handover').length,
    shipping: base.filter((r) => r.status === 'shipping').length,
    handed_over: base.filter((r) => r.status === 'handed_over').length,
    returned: base.filter((r) => r.status === 'returned').length,
  }
}

export function parseRecordDate(dateStr?: string): { day: number; month: number; year: number; iso: string } | null {
  if (!dateStr) return null
  const match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/)
  if (!match) return null
  const day = parseInt(match[1], 10)
  const month = parseInt(match[2], 10)
  const year = parseInt(match[3], 10)
  const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return { day, month, year, iso }
}

export function filterFulfillmentsByTimeRange(
  items: OrderFulfillmentRecord[],
  timeRange: 'today' | 'last_7_days' | 'this_month' | 'custom',
  customRange?: { startDate?: string; endDate?: string }
): OrderFulfillmentRecord[] {
  if (timeRange === 'custom') {
    if (!customRange?.startDate && !customRange?.endDate) return items
    return items.filter((r) => {
      const parsed = parseRecordDate(r.createdAt)
      if (!parsed) return true
      if (customRange.startDate && parsed.iso < customRange.startDate) return false
      if (customRange.endDate && parsed.iso > customRange.endDate) return false
      return true
    })
  }

  // Ref period in mock: August 2026 (Day 30)
  const refYear = 2026
  const refMonth = 8
  const refDay = 30

  return items.filter((r) => {
    const parsed = parseRecordDate(r.createdAt)
    if (!parsed) return true

    if (timeRange === 'today') {
      return parsed.year === refYear && parsed.month === refMonth && parsed.day === refDay
    }
    if (timeRange === 'last_7_days') {
      return (
        parsed.year === refYear &&
        parsed.month === refMonth &&
        parsed.day >= refDay - 6 &&
        parsed.day <= refDay
      )
    }
    if (timeRange === 'this_month') {
      return parsed.year === refYear && parsed.month === refMonth
    }
    return true
  })
}

export function calculateFulfillmentMetrics(items: OrderFulfillmentRecord[]) {
  const total = items.length
  const handedOverCount = items.filter((r) => r.status === 'handed_over').length
  const shippingCount = items.filter((r) => r.status === 'shipping').length
  const pendingCount = items.filter((r) => r.status === 'pending_handover').length
  const returnedCount = items.filter((r) => r.status === 'returned').length

  const handoverRate = total > 0 ? Math.round((handedOverCount / total) * 100) : 0
  const shippingRate = total > 0 ? Math.round((shippingCount / total) * 100) : 0
  const pendingRate = total > 0 ? Math.round((pendingCount / total) * 100) : 0

  const under24hCount = items.filter((r) => (r.slaHours ?? 20) <= 24 && r.status !== 'returned').length
  const between24And48hCount = items.filter((r) => {
    const h = r.slaHours ?? 20
    return h > 24 && h <= 48 && r.status !== 'returned'
  }).length
  const overdueCount = items.filter((r) => {
    const h = r.slaHours ?? 20
    return h > 48 || r.status === 'returned'
  }).length

  const slaRate = total > 0 ? Math.round((under24hCount / total) * 100) : 0

  return {
    total,
    handedOverCount,
    handoverRate,
    shippingCount,
    shippingRate,
    pendingCount,
    pendingRate,
    returnedCount,
    slaRate,
    under24hCount,
    between24And48hCount,
    overdueCount,
  }
}

