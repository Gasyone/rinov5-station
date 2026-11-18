import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { NotificationItem, MOCK_NOTIFICATIONS } from '@/components/layout/notificationHelpers'

export interface NotificationSettings {
  categoryPreferences: {
    operations: boolean
    student_care: boolean
    admissions: boolean
    commercial: boolean
    ticket: boolean
    system: boolean
    // backwards-compat
    schedule?: boolean
  }
  subCategoryPreferences: {
    // 1. Vận hành Lớp & Lịch học (CAP-OPS)
    ops_cancelled: boolean
    ops_substitution: boolean
    ops_room_change: boolean
    ops_attendance: boolean
    ops_materials: boolean

    // 2. Học vụ & Chăm sóc học viên (CAP-CARE)
    care_absent: boolean
    care_reserve: boolean
    care_makeup: boolean
    care_alert: boolean

    // 3. Tuyển sinh & Ghi danh (CAP-ADM)
    adm_booking_test: boolean
    adm_trial_class: boolean
    adm_lead_assigned: boolean

    // 4. Đơn hàng & Học phí (CAP-COM / CAP-FIN)
    order_created: boolean
    order_paid: boolean
    order_renewal: boolean
    order_debt: boolean

    // 5. Khiếu nại & Hỗ trợ (Ticket & SLA)
    ticket_created: boolean
    ticket_sla: boolean
    ticket_feedback: boolean

    // 6. Hệ thống & Tài khoản (CAP-SYS)
    sys_maintenance: boolean
    sys_permission: boolean
    sys_security: boolean

    // Backwards-compat keys (optional)
    [key: string]: boolean | undefined
  }
  channels: {
    webUi: boolean
    soundAlert: boolean
    emailDigest: boolean
    zaloSms: boolean
    telegram: boolean
    // legacy aliases for backward compatibility
    inAppPopup?: boolean
    zaloEmergency?: boolean
  }
  channelAccounts: {
    email: string
    phone: string
    telegram: string
  }
  emailFrequency: 'instant' | 'daily' | 'weekly' | 'never'
  dndEnabled?: boolean
  dndStartTime?: string
  dndEndTime?: string
  autoMarkReadOnOpen: boolean
  keepHistoryDays: number
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  categoryPreferences: {
    operations: true,
    student_care: true,
    admissions: true,
    commercial: true,
    ticket: true,
    system: true,
    schedule: true,
  },
  subCategoryPreferences: {
    ops_cancelled: true,
    ops_substitution: true,
    ops_room_change: true,
    ops_attendance: true,
    ops_materials: true,

    care_absent: true,
    care_reserve: true,
    care_makeup: true,
    care_alert: true,

    adm_booking_test: true,
    adm_trial_class: true,
    adm_lead_assigned: true,

    order_created: true,
    order_paid: true,
    order_renewal: true,
    order_debt: true,

    ticket_created: true,
    ticket_sla: true,
    ticket_feedback: true,

    sys_maintenance: true,
    sys_permission: true,
    sys_security: true,
  },
  channels: {
    webUi: true,
    soundAlert: true,
    emailDigest: true,
    zaloSms: false,
    telegram: false,
  },
  channelAccounts: {
    email: 'admin@rinoedu.vn',
    phone: '0912 345 678',
    telegram: '@rino_admin',
  },
  emailFrequency: 'daily',
  dndEnabled: false,
  dndStartTime: '22:00',
  dndEndTime: '07:00',
  autoMarkReadOnOpen: true,
  keepHistoryDays: 60,
}

interface NotificationState {
  notifications: NotificationItem[]
  settings: NotificationSettings
  markAsRead: (id: string) => void
  toggleRead: (id: string) => void
  markAllAsRead: () => void
  markMultipleAsRead: (ids: string[]) => void
  removeNotification: (id: string) => void
  removeMultipleNotifications: (ids: string[]) => void
  resetNotifications: () => void
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void
  updateSettings: (partial: Partial<NotificationSettings>) => void
  resetSettings: () => void
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      // Default to initial mock data (contains 6 unread and 10 read items)
      notifications: MOCK_NOTIFICATIONS.map((n) => ({
        ...n,
        timestamp: n.timestamp instanceof Date ? n.timestamp.toISOString() : n.timestamp,
      })),
      settings: DEFAULT_NOTIFICATION_SETTINGS,

      markAsRead: (id: string) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }))
      },

      toggleRead: (id: string) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: !n.read } : n
          ),
        }))
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }))
      },

      markMultipleAsRead: (ids: string[]) => {
        const idSet = new Set(ids)
        set((state) => ({
          notifications: state.notifications.map((n) =>
            idSet.has(n.id) ? { ...n, read: true } : n
          ),
        }))
      },

      resetNotifications: () => {
        set({
          notifications: MOCK_NOTIFICATIONS.map((n) => ({
            ...n,
            timestamp: n.timestamp instanceof Date ? n.timestamp.toISOString() : n.timestamp,
          })),
        })
      },

      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))
      },

      removeMultipleNotifications: (ids: string[]) => {
        const idSet = new Set(ids)
        set((state) => ({
          notifications: state.notifications.filter((n) => !idSet.has(n.id)),
        }))
      },

      updateSettings: (partial) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...partial,
            categoryPreferences: {
              ...state.settings.categoryPreferences,
              ...(partial.categoryPreferences || {}),
            },
            subCategoryPreferences: {
              ...state.settings.subCategoryPreferences,
              ...(partial.subCategoryPreferences || {}),
            },
            channels: {
              ...state.settings.channels,
              ...(partial.channels || {}),
            },
            channelAccounts: {
              ...state.settings.channelAccounts,
              ...(partial.channelAccounts || {}),
            },
          },
        }))
      },

      resetSettings: () => {
        set({ settings: DEFAULT_NOTIFICATION_SETTINGS })
      },

      addNotification: (notif) => {
        set((state) => {
          const newNotif: NotificationItem = {
            ...notif,
            id: `n-${Date.now()}`,
            read: false,
            timestamp: new Date().toISOString(),
          }
          let updatedList = [newNotif, ...state.notifications]

          // FIFO check if list exceeds 100 items (removes oldest read ones first)
          if (updatedList.length > 100) {
            const unread = updatedList.filter((n) => !n.read)
            const read = updatedList.filter((n) => n.read)
            if (read.length > 0) {
              const keepCount = 100 - unread.length
              const trimmedRead = read.slice(0, Math.max(0, keepCount))
              updatedList = [...unread, ...trimmedRead]
            } else {
              updatedList = updatedList.slice(0, 100)
            }
          }
          return { notifications: updatedList }
        })
      },
    }),
    {
      name: 'rinov5-notifications-v10',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
