import { mockOrders } from '@/mocks/orders'
import type { Order, PaymentRecord } from '@/mocks/orders'
import type { PersonnelItem } from '@/components/shared'
import { getInitials } from '@/lib/format'
import {
  type NormalizedPaymentItem,
  type OrderFilterState,
  type OrderMetrics,
  type OrderSessionConversion,
  type OrderStatusFilter,
  type PackageTypeFilter,
  type PaymentConditionFilter,
  type TimeRangeFilter,
} from './ordersTypes'

export function getInitialOrders(): Order[] {
  return [...mockOrders]
}

export function getOrderBranches(items: Order[]) {
  return Array.from(new Set(items.map((o) => o.branch))).sort()
}

export function getOrderPaymentMethods(items: Order[]) {
  return Array.from(new Set(items.map((o) => o.paymentMethod))).sort()
}

export function getOrderPaymentStatuses(items: Order[]) {
  return Array.from(new Set(items.map((o) => o.paymentStatus))).sort()
}

export function matchOrderPackageType(order: Order, packageType: PackageTypeFilter): boolean {
  if (packageType === 'all') return true
  return order.items.some((item) => {
    if (item.packageCategory === packageType) return true
    const pName = (item.productName || '').toLowerCase()
    const cName = (item.categoryName || '').toLowerCase()
    if (packageType === 'combo') {
      return pName.includes('combo') || cName.includes('combo')
    }
    if (packageType === 'tutor') {
      return (
        pName.includes('gia sư') ||
        cName.includes('gia sư') ||
        pName.includes('1:4') ||
        pName.includes('1:6') ||
        Boolean(item.teacherType)
      )
    }
    if (packageType === 'single_course') {
      return (
        (pName.includes('khóa học') || pName.includes('tiếng')) &&
        !pName.includes('combo') &&
        !pName.includes('gia sư')
      )
    }
    if (packageType === 'book_service') {
      return (
        pName.includes('sách') ||
        pName.includes('giáo trình') ||
        pName.includes('test') ||
        pName.includes('tư vấn')
      )
    }
    return false
  })
}

export function matchOrderPaymentCondition(order: Order, condition: PaymentConditionFilter): boolean {
  if (condition === 'all') return true

  if (condition === 'deposit') {
    return isOrderDeposit(order)
  }

  if (condition === 'partial') {
    if (isOrderDeposit(order)) return false
    const installment = getOrderPaymentInstallmentInfo(order)
    if (installment.label.startsWith('Thanh toán lần')) return true
    const paid = order.paidAmount ?? (order.paymentStatus === 'paid' ? order.finalAmount : 0)
    const remaining = order.remainingAmount ?? Math.max(0, order.finalAmount - paid)
    return (paid > 0 && remaining > 0) || order.paymentOption === 'NHIỀU LẦN' || (order.paidCount ?? 0) > 1
  }

  if (condition === 'one_time') {
    if (isOrderDeposit(order)) return false
    const installment = getOrderPaymentInstallmentInfo(order)
    return installment.label === 'Thanh toán 1 lần'
  }

  if (condition === 'receivable') {
    if (order.status === 'cancelled' || order.status === 'refunded') return false
    const paid = order.paidAmount ?? (order.paymentStatus === 'paid' ? order.finalAmount : 0)
    const remaining = order.remainingAmount ?? Math.max(0, order.finalAmount - paid)
    return remaining > 0
  }

  if (condition === 'refunded') {
    return order.status === 'refunded' || (order.paymentStatus as string) === 'refunded'
  }

  return true
}

export function getOrderEffectiveStatus(order: Order): Order['status'] {
  if (order.status === 'cancelled') return 'cancelled'
  if (order.status === 'refunded') return 'refunded'
  
  const paid = order.paidAmount ?? (order.paymentStatus === 'paid' ? order.finalAmount : 0)
  const remaining = order.remainingAmount ?? Math.max(0, (order.finalAmount ?? 0) - paid)

  // 1. Đơn đã thanh toán đủ 100% (không còn nợ) -> Hoàn tất
  if (paid >= order.finalAmount && order.finalAmount > 0 && remaining === 0) {
    return 'completed'
  }

  // 2. Đơn cọc hoặc mới thanh toán 1 phần (còn nợ tiền) -> Đang xử lý
  if (paid > 0 && remaining > 0) {
    return 'processing'
  }

  // 3. Đơn chưa thanh toán đồng nào -> Chờ thanh toán
  if (paid === 0 || order.paymentStatus === 'unpaid' || order.status === 'pending') {
    return 'pending'
  }

  return order.status || 'completed'
}

export function getOrderStatusLabel(status: Order['status']): string {
  switch (status) {
    case 'completed':
      return 'Hoàn tất'
    case 'processing':
      return 'Đang xử lý'
    case 'pending':
      return 'Chờ thanh toán'
    case 'cancelled':
      return 'Đã hủy'
    case 'refunded':
      return 'Đã hoàn tiền'
    default:
      return status
  }
}

export function countOrdersByStatus(items: Order[], status: OrderStatusFilter): number {
  if (status === 'all') {
    return items.length
  }
  return items.filter((o) => getOrderEffectiveStatus(o) === status).length
}

export function countOrdersByPaymentCondition(items: Order[], condition: PaymentConditionFilter): number {
  if (condition === 'all') return items.length
  return items.filter((o) => matchOrderPaymentCondition(o, condition)).length
}

export function sumOrders(items: Order[]) {
  return items.reduce((acc, o) => acc + (o.finalAmount ?? 0), 0)
}

export function sumOrdersPaid(items: Order[]) {
  return items.reduce((acc, o) => {
    if (o.paidAmount !== undefined) return acc + o.paidAmount
    if (o.paymentStatus === 'paid') return acc + (o.finalAmount ?? 0)
    return acc
  }, 0)
}

export function sumOrdersOutstanding(items: Order[]) {
  return items.reduce((acc, o) => {
    if (o.remainingAmount !== undefined) return acc + o.remainingAmount
    if (o.paymentStatus === 'unpaid') return acc + (o.finalAmount ?? 0)
    if (o.paymentStatus === 'partial') return acc + Math.max(0, (o.finalAmount ?? 0) - (o.paidAmount ?? 0))
    return acc
  }, 0)
}

export function calculateOrderMetrics(items: Order[]): OrderMetrics {
  const total = items.length
  const totalValue = sumOrders(items)
  const revenue = sumOrdersPaid(items)
  const outstanding = sumOrdersOutstanding(items)
  const completed = items.filter((o) => o.status === 'completed').length
  const paidCount = items.filter((o) => o.paymentStatus === 'paid').length
  const partialCount = items.filter((o) => o.paymentStatus === 'partial').length
  const unpaidCount = items.filter((o) => o.paymentStatus === 'unpaid').length
  const collectionRate = totalValue > 0 ? Math.round((revenue / totalValue) * 100) : 0

  return {
    total,
    revenue,
    outstanding,
    completed,
    collectionRate,
    paidCount,
    partialCount,
    unpaidCount,
  }
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

export function filterOrdersByTimeRange(
  items: Order[],
  timeRange: TimeRangeFilter,
  customRange?: { startDate?: string; endDate?: string }
): Order[] {
  if (timeRange === 'all') return items

  if (timeRange === 'custom') {
    if (!customRange?.startDate && !customRange?.endDate) return items
    return items.filter((order) => {
      if (!order.createdAt) return false
      const orderDateStr = order.createdAt.slice(0, 10) // YYYY-MM-DD
      if (customRange.startDate && orderDateStr < customRange.startDate) return false
      if (customRange.endDate && orderDateStr > customRange.endDate) return false
      return true
    })
  }

  // Reference date: August 2026 (current active system period)
  const refYear = 2026
  const refMonth = 7 // August (0-indexed)

  return items.filter((order) => {
    if (!order.createdAt) return false
    const d = new Date(order.createdAt)
    const y = d.getFullYear()
    const m = d.getMonth()

    if (timeRange === 'this_month') {
      return y === refYear && m === refMonth
    }
    if (timeRange === 'last_month') {
      return y === refYear && m === refMonth - 1
    }
    if (timeRange === 'this_quarter') {
      // Q3 = July, August, September (months 6, 7, 8)
      return y === refYear && m >= 6 && m <= 8
    }
    if (timeRange === 'this_year') {
      return y === refYear
    }
    return true
  })
}

export function filterOrders(
  items: Order[],
  filters: {
    search: string
    branch: string
    status: OrderStatusFilter
    packageType?: PackageTypeFilter
    paymentCondition?: PaymentConditionFilter
    extra: OrderFilterState
  }
): Order[] {
  const query = filters.search.trim().toLowerCase()
  return items.filter((o) => {
    const effStatus = getOrderEffectiveStatus(o)

    if (filters.branch !== 'all' && o.branch !== filters.branch) return false

    // Tab lọc trạng thái
    if (filters.status !== 'all') {
      if (effStatus !== filters.status) return false
    }

    if (filters.packageType && !matchOrderPackageType(o, filters.packageType)) return false
    if (filters.paymentCondition && !matchOrderPaymentCondition(o, filters.paymentCondition)) return false
    if (filters.extra.branches.length > 0 && !filters.extra.branches.includes(o.branch))
      return false
    if (
      filters.extra.paymentMethods.length > 0 &&
      !filters.extra.paymentMethods.includes(o.paymentMethod)
    )
      return false
    if (
      filters.extra.paymentStatuses.length > 0 &&
      !filters.extra.paymentStatuses.includes(o.paymentStatus)
    )
      return false
    if (
      filters.extra.orderStatuses &&
      filters.extra.orderStatuses.length > 0 &&
      !filters.extra.orderStatuses.includes(effStatus)
    )
      return false
    if (query) {
      const parent = getOrderCustomerInfo(o)
      const recipient = getOrderRecipientInfo(o)
      const phone = getOrderPhone(o)
      const haystack = [
        o.orderNo,
        o.studentName,
        o.studentId,
        parent.name,
        recipient.name,
        recipient.address,
        phone,
        o.saleBy,
        o.items.map((i) => `${i.productName} ${i.categoryName ?? ''} ${i.packageType ?? ''}`).join(' '),
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}

/**
 * Format chuỗi thời gian thanh toán: loại bỏ giây, đưa về dạng chuẩn thống nhất HH:mm - DD/MM/YYYY
 */
export function formatPaymentTime(raw?: string | null): string {
  if (!raw) return '—'
  const trimmed = raw.trim()

  // 1. Dạng HH:mm:ss - DD/MM/YYYY hoặc HH:mm:ss DD/MM/YYYY
  const timeSecDateMatch = trimmed.match(/^(\d{1,2}):(\d{2}):\d{2}\s*[-–]?\s*(\d{1,2}\/\d{1,2}\/\d{4})$/)
  if (timeSecDateMatch) {
    const [, h, m, d] = timeSecDateMatch
    return `${h.padStart(2, '0')}:${m} - ${d}`
  }

  // 2. Dạng HH:mm - DD/MM/YYYY
  const timeDateMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}\/\d{1,2}\/\d{4})$/)
  if (timeDateMatch) {
    const [, h, m, d] = timeDateMatch
    return `${h.padStart(2, '0')}:${m} - ${d}`
  }

  // 3. Dạng DD/MM HH:mm (VD: 09/08 10:00 hoặc 14/07 11:00) -> 10:00 - 09/08/2026
  const dateShortTimeMatch = trimmed.match(/^(\d{1,2}\/\d{1,2})\s+(\d{1,2}):(\d{2})$/)
  if (dateShortTimeMatch) {
    const [, d, h, m] = dateShortTimeMatch
    return `${h.padStart(2, '0')}:${m} - ${d}/2026`
  }

  // 4. Dạng DD/MM/YYYY HH:mm
  const dateLongTimeMatch = trimmed.match(/^(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d{1,2}):(\d{2})$/)
  if (dateLongTimeMatch) {
    const [, d, h, m] = dateLongTimeMatch
    return `${h.padStart(2, '0')}:${m} - ${d}`
  }

  // 5. Dạng ISO datetime: 2026-08-14T15:37:57Z
  if (trimmed.includes('T') || (trimmed.length === 10 && trimmed.includes('-'))) {
    const d = new Date(trimmed)
    if (!Number.isNaN(d.getTime())) {
      const hh = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      const mo = String(d.getMonth() + 1).padStart(2, '0')
      const yyyy = d.getFullYear()
      return `${hh}:${mm} - ${dd}/${mo}/${yyyy}`
    }
  }

  // Fallback: xóa :ss nếu có
  return trimmed.replace(/:(\d{2}):\d{2}/, ':$1')
}

/**
 * Format chuỗi thời gian thanh toán: bỏ giờ, chỉ lấy ngày gọn dạng DD/MM/YYYY
 */
export function formatPaymentDateOnly(raw?: string | null): string {
  if (!raw) return '—'
  const trimmed = raw.trim()

  // Dạng DD/MM/YYYY trong chuỗi (ví dụ: 10:20 - 18/08/2026, 18/08/2026)
  const fullDateMatch = trimmed.match(/(\d{1,2}\/\d{1,2}\/\d{4})/)
  if (fullDateMatch) {
    return fullDateMatch[1]
  }

  // Dạng DD/MM (ví dụ: 09/08 10:00) -> 09/08/2026
  const shortDateMatch = trimmed.match(/(\d{1,2}\/\d{1,2})/)
  if (shortDateMatch && !trimmed.includes('-')) {
    return `${shortDateMatch[1]}/2026`
  }

  // Dạng ISO datetime: 2026-08-14T15:37:57Z
  if (trimmed.includes('T') || (trimmed.length === 10 && trimmed.includes('-'))) {
    const d = new Date(trimmed)
    if (!Number.isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, '0')
      const mo = String(d.getMonth() + 1).padStart(2, '0')
      const yyyy = d.getFullYear()
      return `${dd}/${mo}/${yyyy}`
    }
  }

  return trimmed
}

export function getNormalizedPaymentHistory(order: Order): NormalizedPaymentItem[] {
  if (order.paymentHistory && order.paymentHistory.length > 0) {
    return [...order.paymentHistory].reverse().map((rec, idx): NormalizedPaymentItem => {
      const isCancelled = order.status === 'cancelled'
      const isReconciled = rec.note?.includes('THÀNH CÔNG') || order.paymentStatus === 'paid'
      const paymentRec = rec as PaymentRecord & { method?: string; time?: string; code?: string }
      return {
        id: paymentRec.id,
        code: paymentRec.code || paymentRec.note?.match(/TNX\d+/)?.[0] || `PT-${order.orderNo}-${paymentRec.sequenceNo || idx + 1}`,
        sequenceNo: paymentRec.sequenceNo || idx + 1,
        amount: paymentRec.amount,
        paymentMethod: paymentRec.paymentMethod || paymentRec.method || 'Tiền mặt',
        bankAccount: paymentRec.bankAccount,
        paidAt: formatPaymentTime(paymentRec.paidAt || paymentRec.time || order.createdAt),
        status: isCancelled ? 'HỦY' : isReconciled ? 'THÀNH CÔNG' : 'CHỜ XỬ LÝ',
        reconciliationStatus: isCancelled ? 'cancelled' : isReconciled ? 'reconciled' : 'pending',
        reconciliationLabel: isCancelled ? 'Hủy' : isReconciled ? 'Đã đối soát' : 'Chờ đối soát',
        paymentType: paymentRec.paymentType || 'Phiếu thu',
        createdBy: order.saleBy || 'Thủ quỹ',
        note: paymentRec.note,
      }
    })
  }

  if (order.receipts && order.receipts.length > 0) {
    return order.receipts.map((rc, idx) => {
      const isReconciled = rc.status === 'THÀNH CÔNG'
      const isCancelled = rc.status === 'HỦY'
      return {
        id: rc.id,
        code: rc.code,
        sequenceNo: idx + 1,
        amount: rc.amount,
        paymentMethod: rc.method,
        paidAt: formatPaymentTime(rc.timestamp),
        status: rc.status,
        reconciliationStatus: isCancelled ? 'cancelled' : isReconciled ? 'reconciled' : 'pending',
        reconciliationLabel: isCancelled ? 'Hủy' : isReconciled ? 'Đã đối soát' : 'Chờ đối soát',
        paymentType: 'Phiếu thu',
        createdBy: order.saleBy || 'Thủ quỹ',
      }
    })
  }

  return []
}

/**
 * Lấy ngày giờ cập nhật của đơn hàng:
 * Ưu tiên order.updatedAt -> lần thanh toán gần nhất -> order.createdAt
 */
export function getOrderUpdatedAt(order: Order): string {
  if (order.updatedAt) {
    return formatPaymentTime(order.updatedAt)
  }
  const history = getNormalizedPaymentHistory(order)
  if (history.length > 0 && history[0].paidAt && history[0].paidAt !== '—') {
    return history[0].paidAt
  }
  if (order.createdAt) {
    return formatPaymentTime(order.createdAt)
  }
  return '—'
}
// Re-export fulfillment helpers from dedicated module
export * from './orderFulfillmentHelpers'


export function getOrderSessionConversion(order: Order): OrderSessionConversion {
  const total = order.items.reduce((sum, item) => {
    const match = item.productName.match(/(\d+)\s*buổi/i)
    if (match) return sum + parseInt(match[1], 10)
    return sum + (item.quantity > 0 ? item.quantity * 48 : 48)
  }, 0)

  const paidAmount = order.paidAmount ?? (order.paymentStatus === 'paid' ? order.finalAmount : 0)
  let converted = 0
  let remaining = total

  if (order.status === 'completed' && (order.paymentStatus === 'paid' || paidAmount >= order.finalAmount)) {
    converted = total
    remaining = 0
  } else if (paidAmount > 0 && order.finalAmount > 0) {
    const ratio = paidAmount / order.finalAmount
    converted = Math.min(total, Math.max(1, Math.round(ratio * total)))
    remaining = Math.max(0, total - converted)
  } else {
    converted = 0
    remaining = total
  }

  return {
    totalSessions: total,
    convertedSessions: converted,
    remainingSessions: remaining,
    isApplicable: true,
  }
}

export interface OrderCustomerInfo {
  name: string
  relationship: string
}

const KNOWN_PARENT_MAP: Record<string, { name: string; relationship: string }> = {
  's-phamnguyenkhoi': { name: 'Trần Thu Hà', relationship: 'Mẹ' },
  's-buihuean': { name: 'Nguyễn Thị Du', relationship: 'Mẹ' },
  's-tuongvy': { name: 'Nhữ Đình Sơn', relationship: 'Bố' },
  's1': { name: 'Nguyễn Văn Hùng', relationship: 'Bố' },
  's2': { name: 'Trần Minh Đức', relationship: 'Bố' },
  's3': { name: 'Lê Thu Hương', relationship: 'Mẹ' },
  's4': { name: 'Phạm Văn Nam', relationship: 'Bố' },
  's5': { name: 'Trần Thị Thảo', relationship: 'Mẹ' },
  's6': { name: 'Đặng Quốc Bảo', relationship: 'Bố' },
  's7': { name: 'Nguyễn Thu Trang', relationship: 'Mẹ' },
  's8': { name: 'Trương Văn Hải', relationship: 'Bố' },
  's9': { name: 'Đỗ Văn Thành', relationship: 'Bố' },
  's10': { name: 'Trần Văn Toàn', relationship: 'Bố' },
}

/**
 * Lấy thông tin người liên hệ / phụ huynh (Tên riêng và Nhãn quan hệ Mẹ/Bố)
 */
export function getOrderCustomerInfo(order: Order): OrderCustomerInfo {
  if (order.studentId && KNOWN_PARENT_MAP[order.studentId]) {
    return KNOWN_PARENT_MAP[order.studentId]
  }

  if (order.customerName && !/^\d+$/.test(order.customerName.trim())) {
    const isMom =
      order.customerName.toLowerCase().includes('thị') ||
      order.customerName.toLowerCase().includes('hương') ||
      order.customerName.toLowerCase().includes('hà')
    return {
      name: order.customerName,
      relationship: isMom ? 'Mẹ' : 'Bố',
    }
  }

  return {
    name: order.studentName,
    relationship: 'Mẹ',
  }
}

/**
 * Lấy tên phụ huynh hiển thị (tương thích ngược)
 */
export function getOrderParentName(order: Order): string {
  return getOrderCustomerInfo(order).name
}

/**
 * Lấy số điện thoại đơn hàng
 */
export function getOrderPhone(order: Order): string {
  if (order.customerPhone && /^\d+$/.test(order.customerPhone.trim())) {
    return order.customerPhone
  }
  if (order.customerName && /^\d+$/.test(order.customerName.trim())) {
    return order.customerName
  }
  return '0983055652'
}

export interface OrderRecipientInfo {
  name: string
  address: string
}

const KNOWN_ADDRESS_MAP: Record<string, string> = {
  's-phamnguyenkhoi': 'Bắc Giang, Xã Nghĩa Hưng, Huyện Lạng Giang, Bắc Giang',
  's-buihuean': 'Ấp Đầu Lòng, Thị trấn Lai Uyên, Huyện Bàu Bàng, Bình Dương',
  's-tuongvy': 'thôn An Đồng, xã Thượng Hồng, Phường Đa Phúc, Quận Dương Kinh, Hải Phòng',
  's1': 'Số 12 Chùa Láng, Đống Đa, Hà Nội',
  's2': 'Tòa S1.02 Vinhomes Smart City, Tây Mỗ, Nam Từ Liêm, Hà Nội',
  's3': 'Số 88 Nguyễn Tuân, Thanh Xuân Trung, Thanh Xuân, Hà Nội',
  's4': 'Số 25 Linh Đàm, Hoàng Liệt, Hoàng Mai, Hà Nội',
  's5': 'Tòa Sapphire 1 Vinhomes Smart City, Nam Từ Liêm, Hà Nội',
  's6': 'Số 56 Nguyễn Trãi, Thanh Xuân, Hà Nội',
  's7': 'Số 15 Giải Phóng, Hai Bà Trưng, Hà Nội',
  's8': 'Số 102 Trần Duy Hưng, Cầu Giấy, Hà Nội',
  's9': 'Số 45 Lê Văn Lương, Cầu Giấy, Hà Nội',
  's10': 'Tòa S2.05 VinHomes Smart City, Nam Từ Liêm, Hà Nội',
}

/**
 * Lấy thông tin người nhận hàng (Tên người nhận và Địa chỉ giao hàng)
 */
export function getOrderRecipientInfo(order: Order): OrderRecipientInfo {
  const customer = getOrderCustomerInfo(order)
  const name = order.recipientName || (order.customerName && !/^\d+$/.test(order.customerName.trim()) ? order.customerName : customer.name) || order.studentName
  const address =
    order.shippingAddress ||
    KNOWN_ADDRESS_MAP[order.studentId] ||
    'Chưa cập nhật địa chỉ'
  return { name, address }
}

/**
 * Mã hóa số điện thoại theo định dạng *******xxx (ẩn 7 chữ số đầu, giữ lại 3 số cuối)
 */
export function formatPhoneMaskMiddle(phone?: string | null): string {
  if (!phone) return '*******111'
  const clean = phone.replace(/\D/g, '')
  if (clean.length <= 3) return clean || phone
  const last3 = clean.slice(-3)
  const starCount = Math.max(clean.length - 3, 7)
  return `${'*'.repeat(starCount)}${last3}`
}

export const maskPhoneNumber = formatPhoneMaskMiddle

/**
 * Kiểm tra xem đơn hàng có phải đơn đặt cọc không
 */
export function isOrderDeposit(order: Order): boolean {
  if (order.hasDepositPre || order.hasDepositStudyNow) return true
  if (order.paymentMethodTag?.toLowerCase().includes('cọc')) return true
  if (order.notes?.toLowerCase().includes('cọc')) return true
  if (order.paymentHistory?.some((p) => p.paymentType?.toLowerCase().includes('cọc') || p.note?.toLowerCase().includes('cọc'))) {
    return true
  }
  return false
}

export interface PaymentInstallmentInfo {
  label: string
  className: string
}

/**
 * Lấy thông tin đợt thanh toán hiển thị dưới trạng thái (Cọc, Thanh toán 1 lần, Thanh toán lần 1, 2, 3...)
 */
export function getOrderPaymentInstallmentInfo(order: Order): PaymentInstallmentInfo {
  // 1. Nếu là đơn đặt cọc
  if (isOrderDeposit(order)) {
    return {
      label: 'Cọc',
      className: 'font-medium text-blue-600 dark:text-blue-400',
    }
  }

  const history = getNormalizedPaymentHistory(order)
  const historyCount = history.length
  const paidCount = order.paidCount ?? (historyCount > 0 ? historyCount : (order.paidAmount ? 1 : 0))
  const effectiveCount = Math.max(historyCount, paidCount)

  const paidAmount = order.paidAmount ?? (order.paymentStatus === 'paid' ? order.finalAmount : 0)
  const remainingAmount = order.remainingAmount ?? Math.max(0, order.finalAmount - paidAmount)

  // 2. Nếu đã thanh toán từ 2 lần trở lên
  if (effectiveCount > 1) {
    return {
      label: `Thanh toán lần ${effectiveCount}`,
      className: 'font-medium text-blue-600 dark:text-blue-400',
    }
  }

  // 3. Nếu là đơn thanh toán nhiều lần / trả góp / còn nợ và đã có 1 lần đóng
  if (effectiveCount === 1 && (remainingAmount > 0 || order.paymentOption === 'NHIỀU LẦN')) {
    return {
      label: 'Thanh toán lần 1',
      className: 'font-medium text-blue-600 dark:text-blue-400',
    }
  }

  // 4. Mặc định là thanh toán 1 lần (hoặc chưa thanh toán / thanh toán 1 lần trọn gói)
  return {
    label: 'Thanh toán 1 lần',
    className: 'text-muted-foreground font-normal',
  }
}

/**
 * Lấy đối tượng nhân sự phục vụ PersonnelHoverCard
 */
export function getStaffPersonnel(name: string, role = 'Chuyên viên Tư vấn Tuyển sinh'): PersonnelItem {
  const cleanName = name.trim() || 'Nguyễn Văn Sale'
  const initials = getInitials(cleanName)
  const cleanEmail = cleanName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
  return {
    id: `EMP-${initials || 'SALE'}`,
    name: cleanName,
    role: role,
    phone: '0983055652',
    email: `${cleanEmail || 'sale'}@rinoedu.edu.vn`,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(cleanName)}`,
  }
}
