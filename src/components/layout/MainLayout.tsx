'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import { HeaderBar } from './HeaderBar'
import { SidebarNav } from './SidebarNav'
import { getNavigationGroupsForRole } from '@/config/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import { useUIStore } from '@/stores/useUIStore'

const isDev = process.env.NODE_ENV === 'development'

const DevPanel = isDev
  ? dynamic(() => import('@/components/devtool/DevPanel').then((m) => m.DevPanel), {
      ssr: false,
    })
  : null

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen)
  const setCurrentMenuId = useUIStore((s) => s.setCurrentMenuId)
  const theme = useUIStore((s) => s.theme)
  const userRole = useAuthStore((s) => s.user?.role)
  const router = useRouter()
  const pathname = usePathname()

  const activeMenu = pathname?.split('/app/')[1] || ''
  const navigationGroups = getNavigationGroupsForRole(userRole)

  // Apply the theme to <html> so the `dark:` Tailwind variant works.
  // globals.css defines `@custom-variant dark (&:is(.dark *))`.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    setCurrentMenuId(activeMenu || null)
  }, [activeMenu, setCurrentMenuId])

  const handleNavigate = (menuId: string) => {
    router.push(`/app/${menuId}`)
  }

  const handleSidebarOpen = () => {
    setSidebarOpen(true)
  }

  const handleContentPointerDown = () => {
    if (sidebarOpen) setSidebarOpen(false)
  }

  return (
    <div className="ui-main-canvas flex h-screen overflow-hidden font-sans bg-background">
      <div className="relative flex h-full w-full flex-col bg-background">
        <HeaderBar
          onOpenMobileSidebar={() => setMobileNavOpen(true)}
        />

        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          <SidebarNav
            navigationGroups={navigationGroups}
            activeMenu={activeMenu}
            isOpen={sidebarOpen}
            mobileOpen={mobileNavOpen}
            onNavigate={handleNavigate}
            onOpen={handleSidebarOpen}
            onMobileClose={() => setMobileNavOpen(false)}
          />

          <main
            className="ui-main-canvas custom-scrollbar relative min-w-0 flex-1 overflow-hidden"
            onPointerDownCapture={handleContentPointerDown}
          >
            <div className="h-full w-full overflow-auto">{children}</div>
          </main>
        </div>
      </div>

      {isDev && DevPanel ? <DevPanel /> : null}
    </div>
  )
}
