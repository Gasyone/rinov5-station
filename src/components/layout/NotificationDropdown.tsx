'use client'

import { Bell, AlertTriangle, ArrowRight, Clock, Settings } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  getRelativeTime,
  generateMockNotifications,
} from './notificationHelpers'

type FilterType = 'all' | 'unread'

const CATEGORY_ICONS = {
  system: Settings,
  workflow: ArrowRight,
  reminder: Clock,
  alert: AlertTriangle,
}

export function NotificationDropdown() {
  const router = useRouter()
  const [filter, setFilter] = useState<FilterType>('all')
  const notifications = generateMockNotifications()

  const unreadCount = notifications.filter((n) => !n.read).length

  const filtered =
    filter === 'all'
      ? notifications
      : notifications.filter((n) => !n.read)

  const handleItemClick = (route: string) => {
    router.push(route)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative inline-flex">
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="Thông báo"
            className="ui-icon-button inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-transparent p-0 leading-none text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground"
          >
            <Bell className="h-5 w-5" />
          </Button>
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">Thông báo</DropdownMenuLabel>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {unreadCount} chưa đọc
            </span>
          )}
        </div>

        <div className="flex gap-3 border-b border-border px-4 py-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={cn(
              'text-xs font-medium transition-colors',
              filter === 'all'
                ? 'text-foreground underline underline-offset-4'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Tất cả
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={cn(
              'text-xs font-medium transition-colors',
              filter === 'unread'
                ? 'text-foreground underline underline-offset-4'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Chưa đọc
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
              <Bell className="h-6 w-6 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Chưa có thông báo nào</p>
            </div>
          ) : (
            filtered.map((notif) => {
              const Icon = CATEGORY_ICONS[notif.category]
              return (
                <div
                  key={notif.id}
                  role="button"
                  tabIndex={0}
                  className={cn(
                    'relative flex cursor-pointer gap-3 border-l-2 px-4 py-2.5 transition-colors hover:bg-muted/50',
                    notif.read
                      ? 'border-l-border'
                      : 'border-l-primary bg-primary/[0.03]'
                  )}
                  onClick={() => handleItemClick(notif.targetRoute)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleItemClick(notif.targetRoute)
                  }}
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          'line-clamp-2 text-sm leading-snug',
                          notif.read ? 'font-normal text-muted-foreground' : 'font-semibold text-foreground'
                        )}
                      >
                        {notif.title}
                      </p>
                      <span className="shrink-0 whitespace-nowrap text-[11px] text-muted-foreground">
                        {getRelativeTime(notif.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
