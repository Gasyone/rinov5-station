import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Notification {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
}

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  locale: 'vi' | 'en' | 'zh'
  notifications: Notification[]
  currentMenuId: string | null
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
  setLocale: (locale: 'vi' | 'en' | 'zh') => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  setCurrentMenuId: (menuId: string | null) => void
}

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback for legacy environments. Not cryptographically strong; only used as a DOM key.
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'light',
      locale: 'vi',
      notifications: [],
      currentMenuId: null,

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open })
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }))
      },

      setTheme: (theme: 'light' | 'dark') => {
        set({ theme })
      },

      setLocale: (locale: 'vi' | 'en' | 'zh') => {
        set({ locale })
      },

      addNotification: (notification) => {
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: generateId(),
              timestamp: new Date(),
            },
          ],
        }))
      },

      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))
      },

      setCurrentMenuId: (menuId: string | null) => {
        set({ currentMenuId: menuId })
      },
    }),
    {
      name: 'rinov5-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        locale: state.locale,
      }),
    }
  )
)
