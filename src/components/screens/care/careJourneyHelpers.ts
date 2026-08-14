import { getStatusColors } from '@/lib/statusColors'

export type ConditionCode = string

export interface StudentCareWorkItem {
  id: string
  studentId: string
  studentName: string
  studentCode?: string
  className: string
  productName?: string
  expectedEndDate?: string
  conditions?: string[]
  status?: string
}

export function getConditionBadgeInfo(code: string) {
  if (code.startsWith('CC')) return { name: 'Chuyên cần', colorClass: getStatusColors('info').badge }
  if (code.startsWith('HT')) return { name: 'Học tập', colorClass: getStatusColors('purple').badge }
  if (code.startsWith('DV')) return { name: 'Dịch vụ', colorClass: getStatusColors('warning').badge }
  if (code.startsWith('RR')) return { name: 'Rủi ro', colorClass: getStatusColors('error').badge }
  return { name: code, colorClass: getStatusColors('neutral').badge }
}
