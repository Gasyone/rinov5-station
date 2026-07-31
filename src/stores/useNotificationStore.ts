import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { NotificationItem, MOCK_NOTIFICATIONS } from '@/components/layout/notificationHelpers'

interface NotificationState {
  notifications: NotificationItem[]
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      // Default to initial mock data. If empty/first load, this is used.
      notifications: MOCK_NOTIFICATIONS.map(n => ({
        ...n,
        // Ensure timestamp is stored in ISO string format for consistent storage
        timestamp: n.timestamp instanceof Date ? n.timestamp.toISOString() : n.timestamp
      })),

      markAsRead: (id: string) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }))
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }))
      },

      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))
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
      name: 'rinov5-notifications',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
