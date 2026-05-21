'use client'

import { useState, useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import { useUIStore } from '@/stores/useUIStore'
import { screens } from '@/config/screens'
import { allMenuItems } from '@/config/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  X,
  Copy,
  Check,
  Minus,
  Terminal,
  Route,
  FolderTree,
  Database,
} from 'lucide-react'
import { buildDevPanelContextMarkdown } from './devPanelHelpers'

interface DevPanelProps {
  componentName?: string
}

export function DevPanel({ componentName }: DevPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [copied, setCopied] = useState(false)
  const pathname = usePathname()

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)
  const authError = useAuthStore((s) => s.error)

  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const theme = useUIStore((s) => s.theme)
  const locale = useUIStore((s) => s.locale)
  const currentMenuId = useUIStore((s) => s.currentMenuId)
  const notifications = useUIStore((s) => s.notifications)
  const notificationCount = notifications.length

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const menuId = pathname?.split('/app/')[1] || null
  const screenConfig = menuId ? screens[menuId] : null
  const menuItem = allMenuItems.find((item) => item.id === menuId)

  const componentHierarchy = useMemo(
    () => [
      { name: 'MainLayout', type: 'layout' },
      { name: 'DashboardLayout', type: 'layout' },
      { name: menuId ? `MenuPage[${menuId}]` : 'Page', type: 'page' },
      ...(componentName ? [{ name: componentName, type: 'component' }] : []),
    ],
    [menuId, componentName]
  )

  const handleCopy = async () => {
    const markdown = buildDevPanelContextMarkdown({
      pathname,
      menuId,
      screenLabel: screenConfig?.label,
      screenDescription: screenConfig?.description,
      componentName,
      navigationLabel: menuItem?.label,
      componentHierarchy,
      authState: {
        isAuthenticated,
        user,
        isLoading,
        error: authError,
      },
      uiState: {
        sidebarOpen,
        theme,
        locale,
        currentMenuId,
        notificationCount,
      },
    })
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-mono text-sm">
      <div className="min-w-[320px] max-w-[480px] overflow-hidden rounded-xl border border-border bg-background/95 shadow-2xl backdrop-blur-md">
        {isMinimized ? (
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">DevPanel</span>
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setIsOpen(false)}
              aria-label="Close dev panel"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Dev Panel
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleCopy}
                  title="Copy context to clipboard"
                  aria-label="Copy context to clipboard"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setIsMinimized(true)}
                  title="Minimize"
                  aria-label="Minimize dev panel"
                >
                  <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  aria-label="Close dev panel"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
            </div>

            <div className="max-h-[500px] overflow-auto p-4">
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Route className="h-3.5 w-3.5 text-muted-foreground" />
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Page Info
                    </h3>
                  </div>
                  <div className="space-y-1 rounded-lg bg-muted/50 p-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Route:</span>
                      <span className="font-medium text-foreground">{pathname}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Menu ID:</span>
                      <span className="font-medium text-foreground">{menuId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Screen:</span>
                      <span className="font-medium text-foreground">
                        {screenConfig?.label || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Component:</span>
                      <span className="font-medium text-foreground">
                        {componentName || 'MenuPage'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <FolderTree className="h-3.5 w-3.5 text-muted-foreground" />
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Component Hierarchy
                    </h3>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="space-y-1">
                      {componentHierarchy.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs"
                          style={{ paddingLeft: `${idx * 16}px` }}
                        >
                          {idx > 0 && (
                            <span className="text-muted-foreground">└─</span>
                          )}
                          <Badge variant="outline" className="rounded px-1.5 py-0.5 font-medium">
                            {item.name}
                          </Badge>
                          <span className="text-muted-foreground">({item.type})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Database className="h-3.5 w-3.5 text-muted-foreground" />
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Zustand Stores
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-lg border border-border p-3 text-xs">
                      <h4 className="mb-1 font-medium text-foreground">Auth State</h4>
                      <div className="space-y-0.5 font-mono text-[11px] text-muted-foreground">
                        <div>
                          authenticated: <span className="text-foreground">{String(isAuthenticated)}</span>
                        </div>
                        <div>
                          user: <span className="text-foreground">{user?.name || 'null'}</span>
                        </div>
                        <div>
                          role: <span className="text-foreground">{user?.role || 'null'}</span>
                        </div>
                        <div>
                          loading: <span className="text-foreground">{String(isLoading)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border p-3 text-xs">
                      <h4 className="mb-1 font-medium text-foreground">UI State</h4>
                      <div className="space-y-0.5 font-mono text-[11px] text-muted-foreground">
                        <div>
                          sidebar: <span className="text-foreground">{String(sidebarOpen)}</span>
                        </div>
                        <div>
                          theme: <span className="text-foreground">{theme}</span>
                        </div>
                        <div>
                          locale: <span className="text-foreground">{locale}</span>
                        </div>
                        <div>
                          menuId: <span className="text-foreground">{currentMenuId || 'null'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
