import type { Order } from '@/mocks/orders'

export type OrderStatusFilter = 'all' | Order['status']

export interface OrderFilterState {
  branches: string[]
  paymentMethods: Array<Order['paymentMethod']>
  paymentStatuses: Array<Order['paymentStatus']>
}

export const ORDER_STATUS_TABS: Array<{
  id: OrderStatusFilter
  label: string
  status?: Order['status']
}> = [
  { id: 'all', label: 'Tất cả đơn' },
  { id: 'completed', label: 'Hoàn tất', status: 'completed' },
  { id: 'pending', label: 'Chờ thanh toán', status: 'pending' },
  { id: 'cancelled', label: 'Đã hủy', status: 'cancelled' },
  { id: 'refunded', label: 'Đã hoàn tiền', status: 'refunded' },
]

export const PAYMENT_METHOD_LABELS: Record<Order['paymentMethod'], string> = {
  cash: 'Tiền mặt',
  bank_transfer: 'Chuyển khoản NH',
  credit_card: 'Cà thẻ tín dụng',
  momo: 'Ví MoMo',
}

export const PAYMENT_STATUS_LABELS: Record<Order['paymentStatus'], string> = {
  paid: 'Đã thu đủ',
  unpaid: 'Chưa thu tiền',
  partial: 'Thu 1 phần',
}
