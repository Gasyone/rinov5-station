'use client'

import { Bell, AlertTriangle, ArrowRight, Clock, Settings, Check, Trash2, CheckCheck } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { getStatusDotClass } from '@/lib/statusColors'
import { ConfirmDialog, EmptyState } from '@/components/shared'
import { SegmentedControl } from '@/components/controls'
import { toast } from 'sonner'
import { useNotificationStore } from '@/stores/useNotificationStore'
import {
  getRelativeTime,
  NotificationCategory,
  NotificationPriority,
  NotificationItem,
} from './notificationHelpers'

type FilterCategory = 'all' | NotificationCategory
type FilterStatus = 'all' | 'unread'

const CATEGORY_ICONS = {
  system: Settings,
  workflow: ArrowRight,
  reminder: Clock,
  alert: AlertTriangle,
}

export function NotificationDropdown() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  // Zustand Store states and actions
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotificationStore()

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // Safely get unread count
  const unreadCount = mounted ? notifications.filter((n) => !n.read).length : 0

  // Filter and sort notifications
  const sortedNotifications = [...notifications].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime()
    const timeB = new Date(b.timestamp).getTime()
    return timeB - timeA
  })

  const filteredNotifications = sortedNotifications.filter((notif) => {
    const matchesCategory = categoryFilter === 'all' || notif.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || (!notif.read && statusFilter === 'unread')
    return matchesCategory && matchesStatus
  })

  // Dynamic counts for Category tabs
  const getCategoryUnreadCount = (category: NotificationCategory) => {
    return notifications.filter((n) => n.category === category && !n.read).length
  }

  const systemUnread = getCategoryUnreadCount('system')
  const workflowUnread = getCategoryUnreadCount('workflow')
  const reminderUnread = getCategoryUnreadCount('reminder')
  const alertUnread = getCategoryUnreadCount('alert')

  const categoryOptions = [
    { value: 'all' as FilterCategory, label: `Tất cả${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
    { value: 'system' as FilterCategory, label: `Hệ thống${systemUnread > 0 ? ` (${systemUnread})` : ''}` },
    { value: 'workflow' as FilterCategory, label: `Nghiệp vụ${workflowUnread > 0 ? ` (${workflowUnread})` : ''}` },
    { value: 'reminder' as FilterCategory, label: `Nhắc nhở${reminderUnread > 0 ? ` (${reminderUnread})` : ''}` },
    { value: 'alert' as FilterCategory, label: `Cảnh báo${alertUnread > 0 ? ` (${alertUnread})` : ''}` },
  ]

  const getPriorityDot = (priority: NotificationPriority) => {
    if (priority === 'high') return getStatusDotClass('high') // bg-red-500
    if (priority === 'medium') return getStatusDotClass('medium') // bg-amber-500
    return getStatusDotClass('inactive') // bg-zinc-400
  }

  const handleItemClick = (notif: NotificationItem) => {
    markAsRead(notif.id)
    if (notif.targetRoute) {
      router.push(notif.targetRoute)
    } else {
      router.push('/app/dashboard')
      toast.info('Trang liên kết không khả dụng, đã chuyển về Tổng quan')
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative inline-flex cursor-pointer select-none">
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              aria-label="Thông báo"
              className="ui-icon-button inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-transparent p-0 leading-none text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground"
            >
              <Bell className="h-5 w-5" />
            </Button>
            {mounted && unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              </span>
            )}
          </div>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-[380px] sm:w-[410px] p-0 shadow-lg border border-border bg-popover text-popover-foreground rounded-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-muted/20">
            <span className="text-sm font-semibold tracking-tight text-foreground">Thông báo</span>
            {mounted && unreadCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                className="h-7 px-2 text-xs font-semibold text-primary hover:bg-primary/5 hover:text-primary transition-all duration-200 flex items-center gap-1 rounded-md"
                onClick={(e) => {
                  e.stopPropagation()
                  markAllAsRead()
                  toast.success('Đã đánh dấu tất cả đã đọc')
                }}
              >
                <CheckCheck className="h-3.5 w-3.5 shrink-0" />
                Đọc tất cả
              </Button>
            )}
          </div>

          {!mounted ? (
            <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Đang tải thông báo...</span>
            </div>
          ) : (
            <>
              {/* Category Filter */}
              <div className="border-b border-border px-3 py-2 bg-muted/5">
                <SegmentedControl
                  value={categoryFilter}
                  options={categoryOptions}
                  onValueChange={(val) => setCategoryFilter(val)}
                  className="w-full flex"
                  itemClassName="flex-1 text-[10px] font-semibold py-1 h-7 text-center justify-center"
                />
              </div>

              {/* Status Filter */}
              <div className="border-b border-border px-3 py-1.5 flex items-center justify-between bg-muted/5">
                <span className="text-[11px] text-muted-foreground font-medium">Lọc theo trạng thái</span>
                <SegmentedControl
                  value={statusFilter}
                  options={[
                    { value: 'all', label: 'Tất cả' },
                    { value: 'unread', label: 'Chưa đọc' }
                  ]}
                  onValueChange={(val) => setStatusFilter(val)}
                  className="w-40 flex"
                  itemClassName="flex-1 text-[10px] py-1 h-6 font-semibold text-center justify-center"
                />
              </div>

              {/* Notifications List */}
              <div className="max-h-[380px] overflow-y-auto divide-y divide-border/60">
                {filteredNotifications.length === 0 ? (
                  <EmptyState
                    title="Chưa có thông báo nào"
                    description={
                      categoryFilter !== 'all' || statusFilter !== 'all'
                        ? 'Không tìm thấy thông báo phù hợp với bộ lọc hiện tại'
                        : 'Hệ thống sẽ gửi thông báo khi có hoạt động mới'
                    }
                    className="py-10 px-4"
                    icon={<Bell className="h-7 w-7 text-muted-foreground/30" />}
                  />
                ) : (
                  filteredNotifications.map((notif) => {
                    const Icon = CATEGORY_ICONS[notif.category] || Bell
                    return (
                      <div
                        key={notif.id}
                        role="button"
                        tabIndex={0}
                        className={cn(
                          'group relative flex cursor-pointer gap-3 border-l-4 px-4 py-3 transition-all duration-200 hover:bg-muted/50',
                          notif.read
                            ? 'border-l-transparent bg-transparent'
                            : 'border-l-primary bg-primary/[0.02]'
                        )}
                        onClick={() => handleItemClick(notif)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleItemClick(notif)
                        }}
                      >
                        {/* Icon Block with Priority Dot */}
                        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-background transition-colors">
                          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span
                            className={cn(
                              "absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-popover shadow-xs",
                              getPriorityDot(notif.priority)
                            )}
                            title={`Ưu tiên: ${notif.priority}`}
                          />
                        </div>

                        {/* Title & Message */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2 mb-0.5">
                            <p
                              className={cn(
                                'text-xs leading-snug line-clamp-2 pr-6',
                                notif.read ? 'font-normal text-muted-foreground' : 'font-semibold text-foreground'
                              )}
                              title={notif.title}
                            >
                              {notif.title}
                            </p>
                            <span className="shrink-0 whitespace-nowrap text-[10px] text-muted-foreground/85">
                              {getRelativeTime(notif.timestamp)}
                            </span>
                          </div>
                          <p 
                            className="text-[11px] text-muted-foreground line-clamp-1 leading-normal" 
                            title={notif.message}
                          >
                            {notif.message}
                          </p>
                        </div>

                        {/* Hover Actions Panel */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-popover/95 p-1 border border-border/80 shadow-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          {!notif.read && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              title="Đánh dấu đã đọc"
                              className="h-6 w-6 text-primary hover:bg-muted"
                              onClick={(e) => {
                                e.stopPropagation()
                                markAsRead(notif.id)
                                toast.success('Đã đánh dấu đã đọc')
                              }}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            title="Xóa thông báo"
                            className="h-6 w-6 text-destructive hover:bg-muted"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteTargetId(notif.id)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => {
          if (!open) setDeleteTargetId(null)
        }}
        title="Xóa thông báo"
        description="Bạn có chắc chắn muốn xóa thông báo này? Hành động này sẽ loại bỏ thông báo khỏi danh sách in-app của bạn."
        variant="destructive"
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        onConfirm={() => {
          if (deleteTargetId) {
            removeNotification(deleteTargetId)
            setDeleteTargetId(null)
            toast.success('Đã xóa thông báo')
          }
        }}
      />
    </>
  )
}
