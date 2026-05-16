'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { HeaderBar } from './HeaderBar'
import { SidebarNav } from './SidebarNav'
import { navigationGroups } from '@/config/navigation'
import { useUIStore } from '@/stores/useUIStore'

export function MainLayout({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const theme = useUIStore((s) => s.theme)
  const router = useRouter()
  const pathname = usePathname()

  const activeMenu = pathname?.split('/app/')[1] || ''

  // Apply the theme to <html> so the `dark:` Tailwind variant works.
  // globals.css defines `@custom-variant dark (&:is(.dark *))`.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const handleNavigate = (menuId: string) => {
    router.push(`/app/${menuId}`)
  }

  return (
    <div className="ui-main-canvas flex h-screen overflow-hidden font-sans bg-background">
      <div className="relative flex h-full w-full flex-col bg-background">
        <HeaderBar />

        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          <SidebarNav
            navigationGroups={navigationGroups}
            activeMenu={activeMenu}
            isOpen={sidebarOpen}
            onNavigate={handleNavigate}
            onToggle={toggleSidebar}
          />

          <main className="ui-main-canvas custom-scrollbar relative min-w-0 flex-1 overflow-hidden">
            <div className="h-full w-full overflow-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
