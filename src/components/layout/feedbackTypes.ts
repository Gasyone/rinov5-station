export type AdjustmentType = 'ui_ux' | 'feature' | 'bug' | 'other'

export type AdjustmentPriority = 'low' | 'normal' | 'high' | 'urgent'

export interface AdjustmentRequest {
  id: string
  title: string
  type: AdjustmentType
  priority: AdjustmentPriority
  description: string
  screenName: string
  currentUrl: string
  requesterName: string
  requesterEmail: string
  requesterRole: string
  createdAt: string
  status?: 'pending' | 'received' | 'done'
}

export const ADJUSTMENT_TYPES: Array<{ value: AdjustmentType; label: string; iconName?: string; desc: string }> = [
  { value: 'ui_ux', label: 'Giao diện (UI/UX)', desc: 'Màu sắc, layout, khoảng cách, font chữ, icon' },
  { value: 'feature', label: 'Nghiệp vụ / Tính năng', desc: 'Bổ sung trường dữ liệu, logic, luồng thao tác' },
  { value: 'bug', label: 'Lỗi kỹ thuật (Bug)', desc: 'Nút không bấm được, sai dữ liệu, hiển thị lỗi' },
  { value: 'other', label: 'Đóng góp ý kiến khác', desc: 'Ý tưởng mới hoặc nhận xét chung' },
]

export const ADJUSTMENT_PRIORITIES: Array<{ value: AdjustmentPriority; label: string; badgeClass: string }> = [
  { value: 'low', label: 'Thấp', badgeClass: 'bg-muted text-muted-foreground' },
  { value: 'normal', label: 'Bình thường', badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { value: 'high', label: 'Cao', badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { value: 'urgent', label: 'Khẩn cấp', badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold' },
]

const STORAGE_KEY = 'rinov5_feedback_history'

export function getStoredFeedbackHistory(): AdjustmentRequest[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as AdjustmentRequest[]
  } catch {
    return []
  }
}

export function saveFeedbackToHistory(item: AdjustmentRequest): void {
  if (typeof window === 'undefined') return
  try {
    const history = getStoredFeedbackHistory()
    const updated = [item, ...history].slice(0, 50) // keep latest 50
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to save feedback to local history', err)
  }
}

export function clearFeedbackHistory(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
