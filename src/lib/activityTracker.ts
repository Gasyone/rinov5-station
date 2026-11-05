export interface ActivityItem {
  id: string
  time: string
  action: string
  type: 'click' | 'route' | 'error' | 'input'
}

const MAX_ACTIVITIES = 12
const activities: ActivityItem[] = []
let isInitialized = false

function getFormatTime(): string {
  const d = new Date()
  return d.toTimeString().split(' ')[0]
}

export function logActivity(action: string, type: ActivityItem['type'] = 'click') {
  if (typeof window === 'undefined') return

  // Prevent duplicate consecutive entries
  if (activities.length > 0 && activities[0].action === action) {
    return
  }

  const item: ActivityItem = {
    id: 'act_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    time: getFormatTime(),
    action,
    type,
  }

  activities.unshift(item)
  if (activities.length > MAX_ACTIVITIES) {
    activities.pop()
  }
}

export function getRecentActivities(): ActivityItem[] {
  // If empty, provide contextual breadcrumb based on current location
  if (activities.length === 0 && typeof window !== 'undefined') {
    const path = window.location.pathname
    return [
      { id: '1', time: getFormatTime(), action: `Truy cập màn hình: ${path}`, type: 'route' },
      { id: '2', time: getFormatTime(), action: 'Mở cửa sổ Báo lỗi & Yêu cầu điều chỉnh', type: 'click' },
    ]
  }
  return [...activities]
}

export function initActivityTracker() {
  if (typeof window === 'undefined' || isInitialized) return
  isInitialized = true

  // 1. Initial page load
  logActivity(`Khởi tạo trang: ${window.location.pathname}`, 'route')

  // 2. Global click tracking
  window.addEventListener(
    'click',
    (e) => {
      try {
        const target = e.target as HTMLElement | null
        if (!target) return

        // Ignore clicks inside the feedback popover/dialog
        if (target.closest('[data-feedback-container]') || target.closest('.ui-btn-feedback')) {
          return
        }

        // Find actionable element
        const actionable = target.closest('button, a, [role="button"], [role="tab"], input[type="submit"]') as HTMLElement | null
        if (actionable) {
          const rawText = (actionable.innerText || actionable.getAttribute('aria-label') || actionable.getAttribute('title') || '').trim()
          const cleanText = rawText.replace(/\s+/g, ' ').slice(0, 45)
          const tag = actionable.tagName.toLowerCase()

          if (cleanText) {
            logActivity(`Click ${tag === 'a' ? 'liên kết' : 'nút'} "${cleanText}"`, 'click')
          }
        }
      } catch {
        // Silently pass
      }
    },
    { capture: true, passive: true }
  )

  // 3. Global error tracking
  window.addEventListener('error', (e) => {
    try {
      const msg = e.message || 'Lỗi không xác định'
      logActivity(`Lỗi JS: ${msg.slice(0, 60)}`, 'error')
    } catch {
      // Silently pass
    }
  })
}
