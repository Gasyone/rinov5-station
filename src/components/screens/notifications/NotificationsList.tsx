'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  Check,
  ExternalLink,
  Trash2,
  Undo2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge, EmptyState } from '@/components/shared'
import { DataTablePagination } from '@/components/data-table'
import { cn } from '@/lib/utils'
import {
  getBusinessIconConfig,
  getRelativeTime,
  getCategoryLabel,
} from '@/components/layout/notificationHelpers'
import { RenderNotificationText } from '@/components/layout/NotificationEntityToken'
import {
  formatExactTime,
  getPriorityLabel,
} from './notificationsHelpers'
import type { NotificationItem } from './notificationsTypes'

interface NotificationsListProps {
  notifications: NotificationItem[]
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onMarkAsRead: (id: string) => void
  onToggleRead: (id: string) => void
  onRequestDelete: (id: string) => void
  autoMarkReadOnOpen: boolean
}

export function NotificationsList({
  notifications,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onMarkAsRead,
  onToggleRead,
  onRequestDelete,
  autoMarkReadOnOpen,
}: NotificationsListProps) {
  const router = useRouter()

  const total = notifications.length
  const startIndex = (page - 1) * pageSize
  const paginatedNotifications = notifications.slice(startIndex, startIndex + pageSize)

  const handleOpenTarget = (notif: NotificationItem) => {
    if (autoMarkReadOnOpen && !notif.read) {
      onMarkAsRead(notif.id)
    }
    if (notif.targetRoute) {
      router.push(notif.targetRoute)
    }
  }

  if (paginatedNotifications.length === 0) {
    return (
      <div className="rounded-lg border border-border/80 bg-card py-16">
        <EmptyState
          icon={<Bell className="h-10 w-10 text-muted-foreground/50" />}
          title="Không có thông báo nào"
          description="Không tìm thấy thông báo phù hợp với tiêu chí tìm kiếm hoặc bộ lọc hiện tại."
        />
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border/80 bg-card overflow-hidden shadow-xs">
      {/* Notification List Items */}
      <div className="divide-y divide-border/60">
        {paginatedNotifications.map((notif) => {
          const iconConfig = getBusinessIconConfig(notif)
          const Icon = iconConfig.icon
          const exactTime = formatExactTime(notif.timestamp)
          const relativeTime = getRelativeTime(notif.timestamp)

          return (
            <div
              key={notif.id}
              className={cn(
                'group relative flex flex-col sm:flex-row sm:items-start justify-between gap-3 px-4 py-3.5 transition-colors',
                !notif.read
                  ? 'bg-primary/[0.03] hover:bg-primary/[0.06]'
                  : 'bg-background hover:bg-muted/30'
              )}
            >
              {/* Left Side: Business Icon + Notification Content */}
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                {/* Business Semantic Icon - Flat, no border, no background */}
                <div className="shrink-0 mt-0.5 pt-0.5 flex items-center justify-center">
                  <Icon className={cn('h-4 w-4', iconConfig.color)} />
                </div>

                {/* Notification Content Body */}
                <div className="flex-1 min-w-0 space-y-1">
                  {/* Meta Row: Priority Badge + Category + Timestamp + Unread Dot */}
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge
                      status={notif.priority}
                      label={getPriorityLabel(notif.priority)}
                      className="text-[10px] px-2 py-0.5"
                    />

                    <span className="text-[11px] font-medium text-muted-foreground">
                      {getCategoryLabel(notif.category)}
                    </span>

                    <span className="text-[11px] text-muted-foreground/60">•</span>

                    <span
                      className="text-[11px] text-muted-foreground hover:text-foreground cursor-default transition-colors"
                      title={exactTime}
                    >
                      {relativeTime}
                    </span>

                    {!notif.read && (
                      <span className="flex h-2 w-2 rounded-full bg-primary shrink-0" title="Chưa đọc" />
                    )}
                  </div>

                  {/* Title with Entity Tokens */}
                  <h4
                    onClick={() => handleOpenTarget(notif)}
                    className={cn(
                      'text-xs sm:text-sm font-semibold tracking-tight cursor-pointer hover:text-primary transition-colors leading-snug',
                      !notif.read ? 'text-foreground' : 'text-foreground/80'
                    )}
                  >
                    <RenderNotificationText text={notif.title} />
                  </h4>

                  {/* Message Body with Entity Tokens */}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    <RenderNotificationText text={notif.message} />
                  </p>
                </div>
              </div>

              {/* Right Side: Actions (Xem nghiệp vụ, Đánh dấu đã đọc/chưa đọc, Xóa) */}
              <div className="shrink-0 flex items-center gap-1 sm:pt-0.5 self-end sm:self-start pl-11 sm:pl-0">
                {notif.targetRoute && (
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => handleOpenTarget(notif)}
                    className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10 border-primary/30 gap-1 px-2.5 font-medium shadow-2xs"
                    title="Xem nghiệp vụ liên quan"
                  >
                    <span>Xem nghiệp vụ</span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => onToggleRead(notif.id)}
                  className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
                  title={notif.read ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                >
                  {notif.read ? (
                    <>
                      <Undo2 className="h-3.5 w-3.5" />
                      <span className="hidden md:inline">Chưa đọc</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span className="hidden md:inline">Đã đọc</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onRequestDelete(notif.id)}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Xóa thông báo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer: Pagination */}
      <div className="border-t border-border/80 px-4 py-2 bg-muted/20">
        <DataTablePagination
          page={page}
          total={total}
          pageSize={pageSize}
          pageSizeOptions={[20, 50, 100]}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  )
}
