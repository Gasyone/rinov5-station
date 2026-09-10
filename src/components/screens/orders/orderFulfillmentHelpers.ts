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

export type OverallFulfillmentStatus = 'delivered' | 'processing' | 'pending'

export interface OrderFulfillmentSummary {
  /**
   * Trạng thái tổng quan của việc chuyển giao SP/DV:
   * 'delivered' (Đã chuyển giao), 'processing' (Đang xử lý), 'pending' (Chưa giao)
   * Xác định 'delivered' khi tất cả các sản phẩm được chuyển giao
   */
  status: OverallFulfillmentStatus
  statusLabel: string
  /**
   * Dòng 1 tóm tắt loại sản phẩm / số buổi / số lượng
   */
  line1Text: string
  /**
   * Dòng 2 tóm tắt chi tiết tiến độ các loại sản phẩm
   */
  line2Text: string
  /**
   * Trạng thái chi tiết (legacy support)
   */
  primaryStatus: 'activated' | 'pending_activation' | 'not_activated' | 'handed_over' | 'pending_handover' | 'partial'
  badgeLabel: string
  semantic: 'success' | 'warning' | 'neutral' | 'info'
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

  // Tính trạng thái chuyển giao theo yêu cầu:
  // "Trạng thái là icon thôi, Đã chuyển giao, đang xử lý, chưa giao, nó xác định khi tất cả các sản phẩm được chuyển giao"
  let status: OverallFulfillmentStatus = 'pending'
  let statusLabel = 'Chưa giao'

  const allServicesDone = serviceCount > 0 ? (activatedServiceCount === serviceCount && grantedSessions >= totalSessions) : true
  const allPhysicalDone = physicalCount > 0 ? (handedOverProductCount >= physicalCount) : true
  const hasItems = serviceCount > 0 || physicalCount > 0

  if (order.status === 'cancelled' || order.status === 'refunded') {
    status = 'pending'
    statusLabel = 'Chưa giao'
  } else if (!hasItems) {
    status = 'pending'
    statusLabel = 'Chưa giao'
  } else if (allServicesDone && allPhysicalDone) {
    status = 'delivered'
    statusLabel = 'Đã chuyển giao'
  } else if (
    activatedServiceCount > 0 ||
    handedOverProductCount > 0 ||
    pendingActivationServiceCount > 0 ||
    (order.paidAmount ?? 0) > 0 ||
    order.paymentStatus === 'partial'
  ) {
    status = 'processing'
    statusLabel = 'Đang xử lý'
  } else {
    status = 'pending'
    statusLabel = 'Chưa giao'
  }

  // Dòng 1: Tóm tắt số lượng sản phẩm / dịch vụ
  let line1Text = ''
  if (serviceCount > 0 && physicalCount > 0) {
    line1Text = `${totalSessions} buổi • ${physicalCount} SP`
  } else if (serviceCount > 0) {
    line1Text = `${totalSessions} buổi`
  } else if (physicalCount > 0) {
    line1Text = `${physicalCount} sản phẩm`
  } else {
    line1Text = '—'
  }

  // Dòng 2: Đề xuất dòng bên dưới, lưu ý chuyển giao nhiều loại sản phẩm
  let line2Text = ''
  if (order.status === 'cancelled') {
    line2Text = 'Đơn đã hủy'
  } else if (order.status === 'refunded') {
    line2Text = 'Đã hoàn tiền'
  } else if (serviceCount > 0 && physicalCount > 0) {
    // Chuyển giao nhiều loại sản phẩm (cả dịch vụ khóa học và sản phẩm vật lý)
    if (status === 'delivered') {
      line2Text = `Đã cấp ${grantedSessions} buổi • Giao ${physicalCount} SP`
    } else if (status === 'processing') {
      if (grantedSessions > 0 || handedOverProductCount > 0) {
        line2Text = `Cấp ${grantedSessions}/${totalSessions} b • Giao ${handedOverProductCount}/${physicalCount} SP`
      } else {
        line2Text = `Chờ cấp ${totalSessions} b • Chờ giao ${physicalCount} SP`
      }
    } else {
      line2Text = `Chờ cấp ${totalSessions} b • ${physicalCount} SP chưa giao`
    }
  } else if (serviceCount > 0) {
    // Chỉ có dịch vụ khóa học
    if (status === 'delivered') {
      line2Text = `Đã cấp đủ ${grantedSessions}/${totalSessions} buổi`
    } else if (status === 'processing') {
      line2Text =
        grantedSessions > 0
          ? `Đã cấp ${grantedSessions}/${totalSessions} buổi`
          : `Chờ cấp ${totalSessions} buổi`
    } else {
      line2Text = `Chưa kích hoạt (${totalSessions} buổi)`
    }
  } else if (physicalCount > 0) {
    // Chỉ có sản phẩm vật lý
    if (status === 'delivered') {
      line2Text = `Đã bàn giao ${physicalCount}/${physicalCount} SP`
    } else if (status === 'processing') {
      line2Text =
        handedOverProductCount > 0
          ? `Đã giao ${handedOverProductCount}/${physicalCount} SP`
          : `Chờ bàn giao ${physicalCount} SP`
    } else {
      line2Text = `Chưa bàn giao (${physicalCount} SP)`
    }
  } else {
    line2Text = '—'
  }

  // Legacy compatibility for primaryStatus, badgeLabel, semantic
  const primaryStatus =
    status === 'delivered' ? 'activated' : status === 'processing' ? 'partial' : 'not_activated'
  const badgeLabel = statusLabel
  const semantic =
    status === 'delivered' ? 'success' : status === 'processing' ? 'warning' : 'neutral'

  return {
    status,
    statusLabel,
    line1Text,
    line2Text,
    primaryStatus,
    badgeLabel,
    semantic,
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
