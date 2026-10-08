'use client'

import {
  Bell,
  Check,
  Trash2,
  CheckCheck,
  GraduationCap,
  CalendarDays,
  CalendarX,
  CreditCard,
  ClipboardCheck,
  MessageSquareWarning,
  CircleDollarSign,
  FileText,
  AlertTriangle,
  RotateCcw,
  type LucideIcon,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { ConfirmDialog, EmptyState } from '@/components/shared'
import { toast } from 'sonner'
import { useNotificationStore } from '@/stores/useNotificationStore'
import {
  getRelativeTime,
  NotificationItem,
} from './notificationHelpers'

/**
 * Resolver mapping exact business notification events to semantic Lucide icons & colors
 * Directly grounded in Rinov5 Station modules (Classes, Students, Orders, Schedule, Tickets).
 */
function getBusinessIconConfig(notif: NotificationItem): { icon: LucideIcon; color: string } {
  const title = notif.title.toLowerCase()
  const msg = notif.message.toLowerCase()

  // 1. Buổi học bị hủy / Thay đổi lịch đột xuất (Lịch biểu)
  if (title.includes('hủy') || msg.includes('hủy')) {
    return { icon: CalendarX, color: 'text-rose-500 dark:text-rose-400' }
  }

  // 2. Điểm danh lớp học (Vận hành lớp học)
  if (title.includes('điểm danh') || msg.includes('điểm danh')) {
    return { icon: ClipboardCheck, color: 'text-blue-500 dark:text-blue-400' }
  }

  // 3. Đơn hàng mới / Thanh toán học phí (CRM & Thương mại)
  if (notif.category === 'commercial' && (title.includes('đơn hàng') || title.includes('ord-') || title.includes('phiếu thu'))) {
    return { icon: CreditCard, color: 'text-emerald-500 dark:text-emerald-400' }
  }

  // 4. Tái phí học viên (Tái phí & Công nợ)
  if (title.includes('tái phí') || msg.includes('tái phí')) {
    return { icon: CircleDollarSign, color: 'text-amber-500 dark:text-amber-400' }
  }

  // 5. Đơn bảo lưu / Nghỉ phép (Bảo lưu & Nghỉ phép)
  if (title.includes('bảo lưu') || title.includes('nghỉ phép') || msg.includes('bảo lưu')) {
    return { icon: FileText, color: 'text-indigo-500 dark:text-indigo-400' }
  }

  // 6. Ticket phản ánh & Khiếu nại (Ticket & Chất lượng)
  if (notif.category === 'ticket' || title.includes('ticket') || title.includes('phàn nàn') || title.includes('khiếu nại')) {
    return { icon: MessageSquareWarning, color: 'text-amber-500 dark:text-amber-400' }
  }

  // 7. Học vụ & Chăm sóc học viên (Vắng học, Điểm thi, Xếp lớp)
  if (notif.category === 'student_care' || title.includes('vắng') || title.startsWith('hv')) {
    return { icon: GraduationCap, color: 'text-indigo-500 dark:text-indigo-400' }
  }

  // 8. Lịch học mới / Lịch test (Lịch biểu trung tâm)
  if (notif.category === 'schedule' || title.includes('lịch')) {
    return { icon: CalendarDays, color: 'text-sky-500 dark:text-sky-400' }
  }

  // Fallbacks
  return { icon: AlertTriangle, color: 'text-zinc-500 dark:text-zinc-400' }
}

export function NotificationDropdown() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [onlyUnread, setOnlyUnread] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  // Zustand Store states and actions
  const { notifications, markAsRead, markAllAsRead, removeNotification, resetNotifications } = useNotificationStore()

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // Safely get unread count
  const unreadCount = mounted ? notifications.filter((n) => !n.read).length : 0

  // Filter and sort notifications (newest first)
  const sortedNotifications = [...notifications].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime()
    const timeB = new Date(b.timestamp).getTime()
    return timeB - timeA
  })

  const filteredNotifications = sortedNotifications.filter((notif) => {
    if (onlyUnread && notif.read) return false
    return true
  })

  const handleItemClick = (notif: NotificationItem) => {
    markAsRead(notif.id)
    if (notif.targetRoute) {
      router.push(notif.targetRoute)
    } else {
      router.push('/app/calendar_class_schedule')
      toast.info('Trang liên kết không khả dụng, đã chuyển về Lịch học')
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
              size="icon-sm"
              aria-label="Thông báo"
              className="ui-icon-button inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-transparent p-0 leading-none text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground"
            >
              <Bell className="h-4 w-4" />
            </Button>
            {mounted && unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              </span>
            )}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-[340px] sm:w-[360px] p-0 shadow-xl border border-border/80 bg-popover text-popover-foreground rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/70 px-3.5 py-2.5 bg-muted/15">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tracking-tight text-foreground">Thông báo</span>
              {mounted && unreadCount > 0 && (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-semibold text-primary">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Filter unread toggle pill button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setOnlyUnread((prev) => !prev)
                }}
                className={cn(
                  'h-6 px-2.5 text-xs font-medium rounded-full border transition-all flex items-center gap-1.5 select-none',
                  onlyUnread
                    ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                    : 'bg-background text-muted-foreground border-border/70 hover:text-foreground hover:bg-muted/50'
                )}
              >
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full transition-colors',
                    onlyUnread ? 'bg-white' : 'bg-primary'
                  )}
                />
                <span>Chưa đọc</span>
              </button>

              {/* Mark all as read button - ALWAYS VISIBLE */}
              <Button
                type="button"
                variant="ghost"
                size="xs"
                disabled={!mounted || unreadCount === 0}
                className={cn(
                  'h-6 px-1.5 text-xs font-medium transition-colors flex items-center gap-1 rounded-md',
                  mounted && unreadCount > 0
                    ? 'text-muted-foreground hover:text-primary cursor-pointer'
                    : 'text-muted-foreground/35 cursor-not-allowed opacity-50'
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  if (unreadCount > 0) {
                    markAllAsRead()
                    toast.success('Đã đánh dấu tất cả đã đọc')
                  }
                }}
                title={unreadCount > 0 ? 'Đánh dấu tất cả đã đọc' : 'Đã đọc tất cả thông báo'}
              >
                <CheckCheck className="h-3.5 w-3.5 shrink-0" />
                <span>Đọc tất cả</span>
              </Button>
            </div>
          </div>

          {!mounted ? (
            <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Đang tải thông báo...</span>
            </div>
          ) : (
            <>
              {/* Notifications scrollable list */}
              <div className="p-1.5 space-y-0.5 max-h-[350px] sm:max-h-[370px] overflow-y-auto overscroll-contain">
                {filteredNotifications.length === 0 ? (
                  <EmptyState
                    title={onlyUnread ? 'Không có thông báo chưa đọc' : 'Chưa có thông báo nào'}
                    description={
                      onlyUnread
                        ? 'Bạn đã đọc hết tất cả các thông báo mới'
                        : 'Hệ thống sẽ gửi thông báo khi có hoạt động mới'
                    }
                    className="py-8 px-4"
                    icon={
                      onlyUnread ? (
                        <CheckCheck className="h-6 w-6 text-primary/40" />
                      ) : (
                        <Bell className="h-6 w-6 text-muted-foreground/30" />
                      )
                    }
                    action={
                      onlyUnread
                        ? {
                            label: 'Xem tất cả thông báo',
                            onClick: () => setOnlyUnread(false),
                          }
                        : {
                            label: 'Khôi phục dữ liệu mẫu',
                            onClick: () => {
                              resetNotifications()
                              toast.success('Đã khôi phục dữ liệu thông báo mẫu')
                            },
                          }
                    }
                  />
                ) : (
                  filteredNotifications.map((notif) => {
                    const { icon: Icon, color: iconColor } = getBusinessIconConfig(notif)

                    return (
                      <div
                        key={notif.id}
                        role="button"
                        tabIndex={0}
                        className={cn(
                          'group relative flex items-start gap-2.5 p-2 rounded-lg transition-all duration-150 cursor-pointer select-none',
                          notif.read
                            ? 'bg-transparent hover:bg-muted/60'
                            : 'bg-primary/[0.04] hover:bg-primary/[0.08]'
                        )}
                        onClick={() => handleItemClick(notif)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleItemClick(notif)
                        }}
                      >
                        {/* Standalone Domain Icon (No border, no background circle) */}
                        <div className="relative shrink-0 mt-0.5 flex items-center justify-center">
                          <Icon className={cn('h-4 w-4 shrink-0 transition-transform group-hover:scale-110', iconColor)} />
                          {!notif.read && (
                            <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-primary" />
                          )}
                        </div>

                        {/* Content: Exactly 2 rows maximum */}
                        <div className="min-w-0 flex-1">
                          {/* Dòng chính: Tiêu đề (Nội dung chính, tối đa 2 dòng) */}
                          <p
                            className={cn(
                              'text-xs leading-snug line-clamp-2 pr-5',
                              notif.read
                                ? 'font-normal text-muted-foreground'
                                : 'font-semibold text-foreground'
                            )}
                            title={notif.title}
                          >
                            {notif.title}
                          </p>

                          {/* Dòng phụ: Nội dung phụ (truncate ... nếu dài) + Thời gian */}
                          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground/80 mt-1 min-w-0">
                            <span
                              className="truncate min-w-0"
                              title={notif.message}
                            >
                              {notif.message}
                            </span>
                            <span className="shrink-0 text-xs text-muted-foreground/60 font-medium">
                              {getRelativeTime(notif.timestamp)}
                            </span>
                          </div>
                        </div>

                        {/* Hover action buttons */}
                        <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-popover/90 backdrop-blur-xs p-0.5 rounded-md border border-border/60 shadow-xs z-10">
                          {!notif.read && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              title="Đánh dấu đã đọc"
                              className="h-5 w-5 text-primary hover:bg-muted rounded"
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
                            className="h-5 w-5 text-destructive hover:bg-muted rounded"
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

              {/* Fixed Footer Bar */}
              <div className="border-t border-border/70 px-3 py-2 bg-muted/15 flex items-center justify-between text-xs">
                <span className="text-xs text-muted-foreground/80">
                  {filteredNotifications.length} thông báo
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    title="Khôi phục lại danh sách dữ liệu mẫu"
                    onClick={(e) => {
                      e.stopPropagation()
                      resetNotifications()
                      toast.success('Đã nạp lại dữ liệu mẫu thông báo đầy đủ')
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Nạp lại</span>
                  </button>
                  <span className="h-3 w-px bg-border/60" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toast.info('Hệ thống đang hiển thị toàn bộ 16 thông báo mới nhất')
                    }}
                    className="text-xs font-medium text-primary hover:underline hover:text-primary/80 transition-colors flex items-center gap-0.5"
                  >
                    <span>Xem tất cả</span>
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
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
