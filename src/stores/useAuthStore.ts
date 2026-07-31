import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * MOCK AUTH — DEMO ONLY.
 * No real credential check happens. Any email/password is accepted.
 * The server route /api/auth/login sets an `auth_session=true` cookie that the
 * auth/dashboard layouts read. Do NOT use this pattern in production — the cookie
 * value is a plain literal and a determined client could set it manually.
 */

export type DemoRole = 'admin' | 'branch_manager' | 'ops' | 'academic' | 'teacher' | 'sale' | 'csm'

interface User {
  id: string
  name: string
  email: string
  role: DemoRole
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  switchRole: (role: DemoRole) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

function resolveDemoRole(identifier: string): DemoRole {
  const normalized = identifier.toLowerCase()
  if (normalized.includes('teacher')) return 'teacher'
  if (normalized.includes('sale')) return 'sale'
  if (normalized.includes('csm') || normalized.includes('care')) return 'csm'
  if (normalized.includes('branch') || normalized.includes('manager')) return 'branch_manager'
  return 'admin'
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,

      /**
       * Atomic mock login: the server sets the auth cookie FIRST; only then
       * do we flip the store to authenticated. If the request fails the store
       * stays clean and the caller sees `false`.
       */
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          if (!res.ok) {
            throw new Error(`Login failed (${res.status})`)
          }
          set({
            isAuthenticated: true,
            user: {
              id: 'demo-user',
              name: 'Admin Demo',
              email: email || 'admin@demo.com',
              role: resolveDemoRole(email),
            },
            isLoading: false,
          })
          return true
        } catch (err) {
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: err instanceof Error ? err.message : 'Login failed',
          })
          return false
        }
      },

      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' })
        } catch {
          // ignore — we still clear local state below
        }
        set({ isAuthenticated: false, user: null, error: null })
      },

      switchRole: (role: DemoRole) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, role }
            : { id: 'demo-user', name: 'Demo User', email: 'demo@rinoedu.ai', role },
        }))
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },
    }),
    {
      name: 'rinov5-auth',
      storage: createJSONStorage(() => localStorage),
      // Don't persist transient UI state — keep it minimal so it can't drift
      // out of sync with the server-side auth_session cookie.
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
)
