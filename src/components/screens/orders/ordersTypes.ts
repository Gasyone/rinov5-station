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
  { id: 'all', label: 'All' },
  { id: 'completed', label: 'Completed', status: 'completed' },
  { id: 'pending', label: 'Pending', status: 'pending' },
  { id: 'cancelled', label: 'Cancelled', status: 'cancelled' },
  { id: 'refunded', label: 'Refunded', status: 'refunded' },
]

export const PAYMENT_METHOD_LABELS: Record<Order['paymentMethod'], string> = {
  cash: 'Cash',
  bank_transfer: 'Bank transfer',
  credit_card: 'Credit card',
  momo: 'MoMo',
}

export const PAYMENT_STATUS_LABELS: Record<Order['paymentStatus'], string> = {
  paid: 'Paid',
  unpaid: 'Unpaid',
  partial: 'Partial',
}
