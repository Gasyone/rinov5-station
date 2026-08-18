import type { DetailedOrder } from '../studentOrdersTypes'
import { getFeeTransfers } from './studentFeeTransfersMock'
import { getPrimaryStudentOrders } from './studentPrimaryOrdersMock'
import { getSecondaryStudentOrders } from './studentSecondaryOrdersMock'

export { getFeeTransfers }

export function getStudentOrders(studentId: string, studentName?: string): DetailedOrder[] {
  const displayStudentName = studentName || 'Hà Phương'

  const primaryOrders = getPrimaryStudentOrders(studentId)
  const secondaryOrders = getSecondaryStudentOrders(studentId, displayStudentName)

  return [...primaryOrders, ...secondaryOrders]
}
