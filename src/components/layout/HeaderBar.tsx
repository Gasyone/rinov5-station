'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Bell, Check, Globe, LogOut, Moon, Search, Settings, Sun } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useUIStore } from '@/stores/useUIStore'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const UI_LOCALE_OPTIONS = [
  { code: 'vi', label: 'Tiếng Việt', shortLabel: 'VI', flag: 'https://flagcdn.com/w20/vn.png' },
  { code: 'en', label: 'English', shortLabel: 'EN', flag: 'https://flagcdn.com/w20/gb.png' },
  { code: 'zh', label: '中文', shortLabel: 'ZH', flag: 'https://flagcdn.com/w20/cn.png' },
] as const

export function HeaderBar() {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout } = useAuthStore()
  const { theme, setTheme, locale, setLocale } = useUIStore()
  const router = useRouter()
  const settingsRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const closeAllMenus = useCallback(() => {
    setShowNotifications(false)
    setShowSettingsMenu(false)
    setShowUserMenu(false)
  }, [])

  const handleWindowClick = useCallback(
    (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettingsMenu(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    },
    []
  )

  useEffect(() => {
    window.addEventListener('click', handleWindowClick)
    return () => window.removeEventListener('click', handleWindowClick)
  }, [handleWindowClick])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
    router.refresh()
  }

  const initial = user?.name?.charAt(0) ?? user?.email?.charAt(0) ?? 'U'

  return (
    <header className="ui-shell-header sticky top-0 z-50 flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 px-4 backdrop-blur-md dark:border-slate-700 md:pl-4 md:pr-6 bg-white/90 dark:bg-slate-900/90">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="ui-pill-surface flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
            <img src="/rinoedu-logo.png" alt="Logo" className="h-full w-full object-contain" />
          </div>
          <div className="hidden flex-col justify-center md:flex">
            <img src="/rinoedu-name.png" alt="RinoEdu" className="h-6 object-contain" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          type="button"
          className="ui-button-secondary hidden cursor-pointer gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 md:flex"
        >
          <Search className="h-4 w-4" />
          <span className="ui-meta-caption hidden pr-8 text-sm text-slate-400">Ctrl+K</span>
        </button>

        <div className="relative" ref={settingsRef}>
          <button
            type="button"
            className={cn(
              'ui-icon-button h-10 w-10 rounded-full border border-transparent text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
              showSettingsMenu ? 'ui-icon-button-active bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' : ''
            )}
            onClick={(e) => {
              e.stopPropagation()
              closeAllMenus()
              setShowSettingsMenu(!showSettingsMenu)
            }}
          >
            <Settings className="h-5 w-5" />
          </button>

          {showSettingsMenu && (
            <div
              className="ui-panel animate-scale-in absolute right-0 top-full z-[60] mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-1 pb-2">
                <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <Globe className="h-3.5 w-3.5" />
                  <span>Ngôn ngữ</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {UI_LOCALE_OPTIONS.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      className={cn(
                        'flex items-center justify-between rounded-lg px-2 py-2 text-left text-sm transition-colors',
                        locale === option.code
                          ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                          : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50'
                      )}
                      onClick={() => setLocale(option.code as 'vi' | 'en' | 'zh')}
                    >
                      <span className="text-xs font-semibold">{option.shortLabel}</span>
                      {locale === option.code && <Check className="h-3.5 w-3.5 text-sky-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mx-1 border-t border-slate-200 dark:border-slate-700" />

              <div className="px-1 pt-2">
                <div className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Giao diện
                </div>
                <button
                  type="button"
                  className="ui-option-neutral flex w-full items-center justify-between rounded-lg p-2 transition-colors text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'rounded-lg p-1.5',
                        theme === 'dark'
                          ? 'bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      )}
                    >
                      {theme === 'dark' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                    </div>
                    <span>{theme === 'dark' ? 'Chế độ tối' : 'Chế độ sáng'}</span>
                  </div>
                  <div
                    className={cn(
                      'flex h-4 w-8 items-center rounded-full p-0.5 transition-all',
                      theme === 'dark'
                        ? 'bg-sky-600 justify-end'
                        : 'bg-slate-300 justify-start dark:bg-slate-600'
                    )}
                  >
                    <div className="h-3 w-3 rounded-full bg-white shadow-sm" />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            className={cn(
              'ui-icon-button h-10 w-10 rounded-full border border-transparent text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
              showNotifications ? 'ui-icon-button-active bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' : ''
            )}
            onClick={(e) => {
              e.stopPropagation()
              closeAllMenus()
              setShowNotifications(!showNotifications)
            }}
          >
            <Bell className="h-5 w-5" />
          </button>
        </div>

        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            className={cn(
              'group flex items-center gap-2 rounded-full border border-transparent px-1.5 py-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800',
              showUserMenu ? 'ui-option-selected bg-slate-100 dark:bg-slate-800' : 'ui-option-neutral'
            )}
            onClick={(e) => {
              e.stopPropagation()
              closeAllMenus()
              setShowUserMenu(!showUserMenu)
            }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-orange-400 to-amber-300 text-sm font-bold text-white shadow-sm">
              {initial}
            </div>
          </button>

          {showUserMenu && (
            <div
              className="ui-panel animate-scale-in absolute right-0 top-full z-[60] mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b border-slate-200 p-4 dark:border-slate-700">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-orange-400 to-amber-300 text-base font-bold text-white shadow-md">
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="ui-cell-primary truncate font-semibold text-slate-900 dark:text-slate-100">
                    {user?.name ?? 'User'}
                  </h4>
                  <p className="ui-cell-secondary truncate text-sm text-slate-500 dark:text-slate-400">
                    {user?.email ?? ''}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold capitalize text-slate-400 dark:text-slate-500">
                    {user?.role ?? ''}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 p-2 dark:border-slate-700">
                <button
                  type="button"
                  className="ui-button-danger flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
