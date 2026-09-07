import type { Order, OrderItem } from '@/mocks/orders'

export type FulfillmentType = 'service' | 'physical'

export type ItemActivationStatus = 'activated' | 'pending_activation' | 'not_activated'
export type ItemHandoverStatus = 'handed_over' | 'pending_handover' | 'not_handed_over'

export interface ItemFulfillmentDetail {
  productId: string
  productName: string
  type: FulfillmentType
  studentName: string
  status: ItemActivationStatus | ItemHandoverStatus
  statusLabel: string
  semantic: 'success' | 'warning' | 'neutral'
  sessionsGranted?: number
  sessionsTotal?: number
  note?: string
}

export interface OrderFulfillmentSummary {
  /**
   * Trạng thái tổng quan của việc chuyển giao SP/DV
   */
  primaryStatus: 'activated' | 'pending_activation' | 'not_activated' | 'handed_over' | 'pending_handover' | 'partial'
  badgeLabel: string
  semantic: 'success' | 'warning' | 'neutral' | 'info'
  /**
   * Dòng 2 tóm tắt số buổi học viên nhận / số sản phẩm bàn giao
   */
  line2Text: string
  /**
   * Chi tiết từng học viên và từng món
   */
  details: ItemFulfillmentDetail[]
  /**
   * Thống kê
   */
  serviceCount: number
  physicalCount: number
  totalSessions: number
  grantedSessions: number
  pendingSessions: number
  hasMultipleItems: boolean
  distinctStudents: string[]
}

/**
 * Phân định món là Sản phẩm vật lý (cần bàn giao) hay Dịch vụ gói học (cần kích hoạt tài khoản học viên & cấp buổi)
 */
export function getItemFulfillmentType(item: OrderItem): FulfillmentType {
  if (item.fulfillmentType) return item.fulfillmentType
  if (item.packageCategory === 'book_service' || item.packageCategory === 'physical') {
    return 'physical'
  }
  const cat = (item.categoryName || '').toLowerCase()
  if (
    cat.includes('sách') ||
    cat.includes('giáo trình') ||
    cat.includes('học liệu') ||
    cat.includes('dụng cụ') ||
    cat.includes('quà tặng') ||
    cat.includes('vật phẩm')
  ) {
    return 'physical'
  }

  const name = item.productName.toLowerCase()
  if (
    name.startsWith('sách ') ||
    name.includes('giáo trình') ||
    name.includes('bộ đề thi') ||
    name.includes('học liệu') ||
    name.includes('bộ kit') ||
    name.includes('balo') ||
    name.includes('đồng phục') ||
    name.includes('flashcard')
  ) {
    return 'physical'
  }

  return 'service'
}

/**
 * Trích xuất tổng số buổi theo gói của một item
 */
export function getItemSessionCount(item: OrderItem): number {
  if (typeof item.sessionsTotal === 'number') return item.sessionsTotal

  const match = item.productName.match(/(\d+)\s*(?:buổi)/i)
  if (match) return parseInt(match[1], 10)

  if (item.packageType) {
    const pkgMatch = item.packageType.match(/(\d+)\s*(?:buổi)/i)
    if (pkgMatch) return parseInt(pkgMatch[1], 10)
  }

  const itemAny = item as typeof item & { durationText?: string }
  if (itemAny.durationText) {
    const durMatch = itemAny.durationText.match(/(\d+)\s*(?:buổi)/i)
    if (durMatch) return parseInt(durMatch[1], 10)
  }

  // Mặc định gói học chuẩn nếu không ghi rõ
  return 48
}

/**
 * Tính trạng thái kích hoạt học viên và số buổi nhận được cho gói dịch vụ
 */
export function getItemActivationInfo(
  item: OrderItem,
  order: Order
): {
  status: ItemActivationStatus
  statusLabel: string
  semantic: 'success' | 'warning' | 'neutral'
  sessionsGranted: number
  sessionsTotal: number
} {
  const total = getItemSessionCount(item)

  // 1. Nếu có ghi đè trực tiếp trong mock item
  if (item.activationStatus) {
    const status = item.activationStatus
    const granted =
      typeof item.sessionsGranted === 'number'
        ? item.sessionsGranted
        : status === 'activated'
        ? total
        : 0
    const label =
      status === 'activated'
        ? 'Đã kích hoạt'
        : status === 'pending_activation'
        ? 'Chờ kích hoạt'
        : 'Chưa kích hoạt'
    const semantic =
      status === 'activated'
        ? 'success'
        : status === 'pending_activation'
        ? 'warning'
        : 'neutral'
    return { status, statusLabel: label, semantic, sessionsGranted: granted, sessionsTotal: total }
  }

  // 2. Nếu đơn bị hủy hoặc hoàn tiền
  if (order.status === 'cancelled' || order.status === 'refunded') {
    return {
      status: 'not_activated',
      statusLabel: 'Chưa kích hoạt',
      semantic: 'neutral',
      sessionsGranted: 0,
      sessionsTotal: total,
    }
  }

  // 3. Nếu đơn đã hoàn tất hoặc đã thanh toán đủ 100%
  if (order.status === 'completed' || order.paymentStatus === 'paid') {
    return {
      status: 'activated',
      statusLabel: 'Đã kích hoạt',
      semantic: 'success',
      sessionsGranted: total,
      sessionsTotal: total,
    }
  }

  // 4. Nếu đơn cọc hoặc thanh toán 1 phần: hệ thống tự động kích hoạt hoặc đang trong thời gian chờ kích hoạt
  const paid = order.paidAmount ?? 0
  if (order.hasDepositStudyNow || paid > 0 || order.paymentStatus === 'partial') {
    // Nếu có cọc học ngay: đã kích hoạt số buổi cọc hoặc toàn bộ
    if (order.hasDepositStudyNow) {
      return {
        status: 'activated',
        statusLabel: 'Đã kích hoạt',
        semantic: 'success',
        sessionsGranted: total,
        sessionsTotal: total,
      }
    }

    // Thời gian chờ hệ thống tự động kích hoạt tài khoản học viên và số buổi
    return {
      status: 'pending_activation',
      statusLabel: 'Chờ kích hoạt',
      semantic: 'warning',
      sessionsGranted: 0,
      sessionsTotal: total,
    }
  }

  // 5. Mặc định chưa thanh toán
  return {
    status: 'not_activated',
    statusLabel: 'Chưa kích hoạt',
    semantic: 'neutral',
    sessionsGranted: 0,
    sessionsTotal: total,
  }
}

/**
 * Tính trạng thái bàn giao cho sản phẩm vật lý (sách, giáo trình, học liệu...)
 */
export function getItemHandoverInfo(
  item: OrderItem,
  order: Order
): {
  status: ItemHandoverStatus
  statusLabel: string
  semantic: 'success' | 'warning' | 'neutral'
} {
  if (item.handoverStatus) {
    const status = item.handoverStatus
    const label =
      status === 'handed_over'
        ? 'Đã bàn giao'
        : status === 'pending_handover'
        ? 'Chờ bàn giao'
        : 'Chưa bàn giao'
    const semantic =
      status === 'handed_over'
        ? 'success'
        : status === 'pending_handover'
        ? 'warning'
        : 'neutral'
    return { status, statusLabel: label, semantic }
  }

  if (order.status === 'cancelled' || order.status === 'refunded') {
    return { status: 'not_handed_over', statusLabel: 'Chưa bàn giao', semantic: 'neutral' }
  }

  if (order.status === 'completed' || order.paymentStatus === 'paid') {
    return { status: 'handed_over', statusLabel: 'Đã bàn giao', semantic: 'success' }
  }

  const paid = order.paidAmount ?? 0
  if (paid > 0 || order.paymentStatus === 'partial') {
    return { status: 'pending_handover', statusLabel: 'Chờ bàn giao', semantic: 'warning' }
  }

  return { status: 'not_handed_over', statusLabel: 'Chưa bàn giao', semantic: 'neutral' }
}

/**
 * Tổng hợp toàn diện trạng thái chuyển giao Sản phẩm / Dịch vụ của một đơn hàng
 */
export function getOrderFulfillmentSummary(order: Order): OrderFulfillmentSummary {
  const details: ItemFulfillmentDetail[] = []
  let serviceCount = 0
  let physicalCount = 0
  let totalSessions = 0
  let grantedSessions = 0
  let pendingSessions = 0
  let activatedServiceCount = 0
  let pendingActivationServiceCount = 0
  let handedOverProductCount = 0

  const studentSet = new Set<string>()

  for (const item of order.items) {
    const itemStudent = item.studentName || order.studentName
    if (itemStudent) studentSet.add(itemStudent)

    const type = getItemFulfillmentType(item)

    if (type === 'physical') {
      physicalCount += item.quantity || 1
      const info = getItemHandoverInfo(item, order)
      if (info.status === 'handed_over') handedOverProductCount += item.quantity || 1

      details.push({
        productId: item.productId,
        productName: item.productName,
        type: 'physical',
        studentName: itemStudent,
        status: info.status,
        statusLabel: info.statusLabel,
        semantic: info.semantic,
        note: item.handoverDate ? `Bàn giao ngày ${item.handoverDate}` : undefined,
      })
    } else {
      // Service
      serviceCount += item.quantity || 1
      const info = getItemActivationInfo(item, order)
      totalSessions += info.sessionsTotal
      grantedSessions += info.sessionsGranted
      if (info.status === 'activated') {
        activatedServiceCount += 1
      } else if (info.status === 'pending_activation') {
        pendingActivationServiceCount += 1
        pendingSessions += info.sessionsTotal - info.sessionsGranted
      }

      details.push({
        productId: item.productId,
        productName: item.productName,
        type: 'service',
        studentName: itemStudent,
        status: info.status,
        statusLabel: info.statusLabel,
        semantic: info.semantic,
        sessionsGranted: info.sessionsGranted,
        sessionsTotal: info.sessionsTotal,
        note:
          info.status === 'activated'
            ? `Đã kích hoạt • Nhận ${info.sessionsGranted} buổi`
            : info.status === 'pending_activation'
            ? `Chờ hệ thống kích hoạt • ${info.sessionsTotal} buổi`
            : `Chưa kích hoạt • Dự kiến ${info.sessionsTotal} buổi`,
      })
    }
  }

  const distinctStudents = Array.from(studentSet)
  const hasMultipleItems = order.items.length > 1

  // Tính Primary status & Badge
  let primaryStatus: OrderFulfillmentSummary['primaryStatus'] = 'not_activated'
  let badgeLabel = 'Chưa kích hoạt'
  let semantic: OrderFulfillmentSummary['semantic'] = 'neutral'
  let line2Text = ''

  if (order.status === 'cancelled' || order.status === 'refunded') {
    primaryStatus = 'not_activated'
    badgeLabel = 'Đã hủy'
    semantic = 'neutral'
    line2Text = 'Đơn đã hủy'
  } else if (physicalCount > 0 && serviceCount === 0) {
    // 1. Đơn CHỈ CÓ SẢN PHẨM VẬT LÝ
    if (handedOverProductCount >= physicalCount) {
      primaryStatus = 'handed_over'
      badgeLabel = 'Đã bàn giao'
      semantic = 'success'
      line2Text = `${physicalCount} sản phẩm`
    } else if (handedOverProductCount > 0 || pendingActivationServiceCount > 0 || (order.paidAmount ?? 0) > 0) {
      primaryStatus = 'pending_handover'
      badgeLabel = 'Chờ bàn giao'
      semantic = 'warning'
      line2Text = `${physicalCount} sản phẩm`
    } else {
      primaryStatus = 'not_activated'
      badgeLabel = 'Chưa bàn giao'
      semantic = 'neutral'
      line2Text = `${physicalCount} sản phẩm`
    }
  } else if (physicalCount === 0 && serviceCount > 0) {
    // 2. Đơn CHỈ CÓ GÓI DỊCH VỤ HỌC
    if (activatedServiceCount === serviceCount) {
      primaryStatus = 'activated'
      badgeLabel = 'Đã kích hoạt'
      semantic = 'success'
      line2Text = `Nhận: ${grantedSessions} buổi`
    } else if (activatedServiceCount > 0 && pendingActivationServiceCount > 0) {
      primaryStatus = 'partial'
      badgeLabel = `Kích hoạt (${activatedServiceCount}/${serviceCount})`
      semantic = 'warning'
      line2Text = `Đã cấp ${grantedSessions} • Chờ ${pendingSessions} buổi`
    } else if (pendingActivationServiceCount > 0 || (order.paidAmount ?? 0) > 0) {
      primaryStatus = 'pending_activation'
      badgeLabel = 'Chờ kích hoạt'
      semantic = 'warning'
      line2Text = `Chờ cấp: ${totalSessions} buổi`
    } else {
      primaryStatus = 'not_activated'
      badgeLabel = 'Chưa kích hoạt'
      semantic = 'neutral'
      line2Text = `Dự kiến: ${totalSessions} buổi`
    }
  } else {
    // 3. ĐƠN HỖN HỢP: CẢ DỊCH VỤ VÀ SẢN PHẨM VẬT LÝ
    const allServicesActivated = activatedServiceCount === serviceCount
    const allProductsHandedOver = handedOverProductCount >= physicalCount

    if (allServicesActivated && allProductsHandedOver) {
      primaryStatus = 'activated'
      badgeLabel = 'Đã chuyển giao'
      semantic = 'success'
      line2Text = `Nhận: ${grantedSessions} buổi • ${physicalCount} SP`
    } else if (activatedServiceCount > 0 || handedOverProductCount > 0) {
      primaryStatus = 'partial'
      badgeLabel = 'Đang chuyển giao'
      semantic = 'warning'
      line2Text = `Nhận: ${grantedSessions} b • ${handedOverProductCount}/${physicalCount} SP`
    } else if (pendingActivationServiceCount > 0 || (order.paidAmount ?? 0) > 0) {
      primaryStatus = 'pending_activation'
      badgeLabel = 'Chờ kích hoạt'
      semantic = 'warning'
      line2Text = `Chờ cấp: ${totalSessions} buổi • ${physicalCount} SP`
    } else {
      primaryStatus = 'not_activated'
      badgeLabel = 'Chưa chuyển giao'
      semantic = 'neutral'
      line2Text = `Dự kiến: ${totalSessions} buổi • ${physicalCount} SP`
    }
  }

  return {
    primaryStatus,
    badgeLabel,
    semantic,
    line2Text,
    details,
    serviceCount,
    physicalCount,
    totalSessions,
    grantedSessions,
    pendingSessions,
    hasMultipleItems,
    distinctStudents,
  }
}
