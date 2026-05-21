import { mockOrders, type Order } from '@/mocks/orders'
import type { OrderFilterState, OrderStatusFilter } from './ordersTypes'

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

export function countOrdersByStatus(items: Order[], status: OrderStatusFilter): number {
  if (status === 'all') return items.length
  return items.filter((o) => o.status === status).length
}

export function sumOrders(items: Order[]) {
  return items.reduce((acc, o) => acc + (o.finalAmount ?? 0), 0)
}

export function sumOrdersPaid(items: Order[]) {
  return items
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((acc, o) => acc + (o.finalAmount ?? 0), 0)
}

export function filterOrders(
  items: Order[],
  filters: {
    search: string
    branch: string
    status: OrderStatusFilter
    extra: OrderFilterState
  }
): Order[] {
  const query = filters.search.trim().toLowerCase()
  return items.filter((o) => {
    if (filters.branch !== 'all' && o.branch !== filters.branch) return false
    if (filters.status !== 'all' && o.status !== filters.status) return false
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
    if (query) {
      const haystack = [
        o.orderNo,
        o.studentName,
        o.studentId,
        o.saleBy,
        o.items.map((i) => i.productName).join(' '),
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}
