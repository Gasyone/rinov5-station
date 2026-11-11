'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Bell,
  Check,
  CheckCheck,
  Maximize2,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { ConfirmDialog, EmptyState } from '@/components/shared'
import { toast } from 'sonner'
import { useNotificationStore } from '@/stores/useNotificationStore'
import {
  getRelativeTime,
  getBusinessIconConfig,
  NotificationItem,
} from './notificationHelpers'
import { RenderNotificationText } from './NotificationEntityToken'

export function HeaderNotificationCenter() {
  const [mounted, setMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [onlyUnread, setOnlyUnread] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const { notifications, markAsRead, markAllAsRead, removeNotification, resetNotifications } =
    useNotificationStore()

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // Sorted notifications (newest first)
  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime()
      const timeB = new Date(b.timestamp).getTime()
      return timeB - timeA
    })
  }, [notifications])

  // Count unread
  const unreadCount = useMemo(() => {
    return mounted ? notifications.filter((n) => !n.read).length : 0
  }, [mounted, notifications])

  // Pick top 2 notifications for header ticker
  const topTwoNotifications = useMemo(() => {
    if (!mounted || sortedNotifications.length === 0) return []
    // Prioritize unread notifications first, then fill with recent
    const unread = sortedNotifications.filter((n) => !n.read)
    const read = sortedNotifications.filter((n) => n.read)
    const combined = [...unread, ...read]
    return combined.slice(0, 2)
  }, [mounted, sortedNotifications])

  // Filtered list for the modal
  const modalNotifications = useMemo(() => {
    return sortedNotifications.filter((n) => {
      if (onlyUnread && n.read) return false
      return true
    })
  }, [sortedNotifications, onlyUnread])

  const handleItemClick = (notif: NotificationItem) => {
    markAsRead(notif.id)
    setIsModalOpen(false)
    const route = notif.targetRoute || '/app/calendar_class_schedule'
    window.open(route, '_blank')
  }

  const notif1 = topTwoNotifications[0]
  const notif2 = topTwoNotifications[1]

  const notif1Config = notif1 ? getBusinessIconConfig(notif1) : null
  const notif2Config = notif2 ? getBusinessIconConfig(notif2) : null
  const Icon1 = notif1Config?.icon
  const Icon2 = notif2Config?.icon

  return (
    <>
      <Popover open={isModalOpen} onOpenChange={setIsModalOpen}>
        <PopoverTrigger asChild>
          {/* =========================================================================
              CENTER HEADER WIDGET: FIXED WIDTH (540px) MATCHING MODAL EXACTLY
             ========================================================================= */}
          <div className="flex items-center min-w-0">
            {/* Mobile: Compact Bell Button */}
            <div className="relative inline-flex md:hidden">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Thông báo"
                className="ui-icon-button inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-transparent p-0 leading-none text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Bell className="h-4 w-4" />
              </Button>
              {mounted && unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 pointer-events-none">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                  <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                </span>
              )}
            </div>

            {/* Desktop & Tablet: Fixed 540px 2-line Center Ticker Bar (Phẳng, không viền, không nền) */}
            <div
              role="button"
              tabIndex={0}
              className={cn(
                'group hidden md:flex items-center gap-2.5 h-[36px] px-2.5 py-1 rounded-lg transition-colors cursor-pointer select-none text-left w-[540px] shrink-0 hover:bg-muted/20'
              )}
              title="Nhấp để mở rộng danh sách thông báo"
            >
              {/* Bell Icon + Unread Counter */}
              <div className="relative shrink-0 flex items-center justify-center">
                <Bell className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                {mounted && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-3.5 min-w-3.5 px-0.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground shadow-xs animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>

              {/* 2 Lines Displaying 2 Notifications */}
              <div className="flex-1 min-w-0 flex flex-col justify-center leading-tight gap-0.5 overflow-hidden">
                {/* Line 1: First Notification */}
                {notif1 ? (
                  <div className="flex items-center gap-1.5 text-[11.5px] min-w-0">
                    <span
                      className={cn(
                        'h-1.5 w-1.5 rounded-full shrink-0',
                        !notif1.read ? 'bg-primary' : 'bg-transparent'
                      )}
                    />
                    {Icon1 && <Icon1 className={cn('h-3.5 w-3.5 shrink-0', notif1Config.color)} />}
                    <span
                      className={cn(
                        'truncate font-normal',
                        !notif1.read ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {notif1.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 shrink-0 ml-auto pl-2 whitespace-nowrap">
                      {getRelativeTime(notif1.timestamp)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70 min-w-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                    <span className="truncate">Chưa có thông báo nào</span>
                  </div>
                )}

                {/* Line 2: Second Notification */}
                {notif2 ? (
                  <div className="flex items-center gap-1.5 text-[11px] min-w-0">
                    <span
                      className={cn(
                        'h-1.5 w-1.5 rounded-full shrink-0',
                        !notif2.read ? 'bg-primary' : 'bg-transparent'
                      )}
                    />
                    {Icon2 && <Icon2 className={cn('h-3.5 w-3.5 shrink-0', notif2Config.color)} />}
                    <span
                      className={cn(
                        'truncate font-normal',
                        !notif2.read ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {notif2.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground/50 shrink-0 ml-auto pl-2 whitespace-nowrap">
                      {getRelativeTime(notif2.timestamp)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground/50 min-w-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-transparent shrink-0" />
                    <span className="truncate italic">Không có thông báo mới khác</span>
                  </div>
                )}
              </div>

              {/* Expand Button: Bỏ viền, bỏ nền */}
              <div
                role="button"
                className="inline-flex items-center gap-1.5 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors shrink-0 bg-transparent border-0 shadow-none cursor-pointer ml-1"
                title="Mở rộng xem tất cả thông báo"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsModalOpen((prev) => !prev)
                }}
              >
                <Maximize2 className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="hidden sm:inline text-[11px]">Mở rộng</span>
              </div>
            </div>
          </div>
        </PopoverTrigger>

        {/* =========================================================================
            NOTIFICATION FLOATING PANEL: FIXED WIDTH 540px, NO TABS, CLEAN HEADER
           ========================================================================= */}
        <PopoverContent
          align="center"
          sideOffset={8}
          className="w-[540px] max-w-[95vw] p-0 shadow-2xl border border-border/80 rounded-xl flex flex-col overflow-hidden max-h-[78vh] bg-popover text-popover-foreground z-50 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
        >
          {/* Header: Chỉ Title chính + Bộ điều khiển, không Subtitle, không Icon thừa, không Tab */}
          <div className="px-4 py-3 border-b border-border/80 bg-muted/20">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-foreground tracking-tight truncate">
                  Thông báo hệ thống
                </h3>
                {mounted && unreadCount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive shrink-0">
                    {unreadCount} chưa đọc
                  </span>
                )}
              </div>

              {/* Action Buttons & Close Button */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Filter unread toggle button */}
                <button
                  type="button"
                  onClick={() => setOnlyUnread((prev) => !prev)}
                  className={cn(
                    'h-7 px-2.5 text-xs font-medium rounded-full border transition-all flex items-center gap-1.5 select-none',
                    onlyUnread
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'bg-background text-muted-foreground border-border hover:text-foreground hover:bg-muted/50'
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

                {/* Mark all as read */}
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  disabled={!mounted || unreadCount === 0}
                  className={cn(
                    'h-7 px-2 text-xs font-medium transition-colors flex items-center gap-1 rounded-md',
                    mounted && unreadCount > 0
                      ? 'text-muted-foreground hover:text-primary cursor-pointer'
                      : 'text-muted-foreground/35 cursor-not-allowed opacity-50'
                  )}
                  onClick={() => {
                    if (unreadCount > 0) {
                      markAllAsRead()
                      toast.success('Đã đánh dấu tất cả thông báo là đã đọc')
                    }
                  }}
                  title={unreadCount > 0 ? 'Đánh dấu tất cả đã đọc' : 'Tất cả thông báo đã đọc'}
                >
                  <CheckCheck className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden sm:inline">Đọc tất cả</span>
                </Button>

                {/* Close Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Đóng"
                  onClick={() => setIsModalOpen(false)}
                  className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted ml-0.5"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Body: Scrollable Notification List */}
          <div className="flex-1 overflow-y-auto max-h-[52vh] p-3 space-y-1.5 overscroll-contain">
            {!mounted ? (
              <div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>Đang tải thông báo...</span>
              </div>
            ) : modalNotifications.length === 0 ? (
              <EmptyState
                title={onlyUnread ? 'Không có thông báo chưa đọc' : 'Chưa có thông báo nào'}
                description={
                  onlyUnread
                    ? 'Bạn đã đọc hết tất cả các thông báo mới'
                    : 'Hệ thống sẽ tự động gửi thông báo khi có hoạt động mới'
                }
                className="py-10 px-4"
                icon={
                  onlyUnread ? (
                    <CheckCheck className="h-8 w-8 text-primary/40" />
                  ) : (
                    <Bell className="h-8 w-8 text-muted-foreground/30" />
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
              modalNotifications.map((notif) => {
                const { icon: ItemIcon, color: iconColor } = getBusinessIconConfig(notif)
                return (
                  <div
                    key={notif.id}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      'group relative flex items-start gap-3 p-2.5 rounded-lg border border-transparent bg-transparent transition-all duration-150 cursor-pointer select-none',
                      'hover:bg-muted/60 hover:border-border/60'
                    )}
                    onClick={() => handleItemClick(notif)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleItemClick(notif)
                    }}
                  >
                    {/* Semantic Domain Icon with Subtle Container */}
                    <div
                      className={cn(
                        'relative shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                        notif.read ? 'bg-muted/40 text-muted-foreground' : 'bg-muted/80 text-foreground'
                      )}
                    >
                      <ItemIcon className={cn('h-4 w-4 shrink-0 transition-transform group-hover:scale-110', iconColor)} />
                      {!notif.read && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      {/* Dòng 1: Tiêu đề ở bên trái (tối đa 1 dòng), Thời gian sát mép phải */}
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={cn(
                            'text-xs leading-snug line-clamp-1 flex-1 min-w-0',
                            notif.read
                              ? 'font-normal text-muted-foreground'
                              : 'font-semibold text-foreground'
                          )}
                        >
                          <RenderNotificationText text={notif.title} />
                        </h4>
                        <span className="text-[11px] text-muted-foreground/70 shrink-0 whitespace-nowrap text-right pl-2">
                          {getRelativeTime(notif.timestamp)}
                        </span>
                      </div>

                      {/* Dòng 2: Nội dung tin nhắn (tối đa 2 dòng kèm ..., tổng khối tối đa 3 dòng) + Icon actions */}
                      <div className="flex items-end justify-between gap-2 mt-1 min-h-[24px]">
                        <p
                          className={cn(
                            'text-xs line-clamp-2 leading-relaxed flex-1 min-w-0 pr-2',
                            notif.read
                              ? 'font-normal text-muted-foreground/75'
                              : 'font-normal text-muted-foreground'
                          )}
                        >
                          <RenderNotificationText text={notif.message} />
                        </p>

                        {/* Action buttons moved to bottom row */}
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notif.read && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              title="Đánh dấu đã đọc"
                              className="h-6 w-6 text-primary hover:bg-muted rounded"
                              onClick={(e) => {
                                e.stopPropagation()
                                markAsRead(notif.id)
                                toast.success('Đã đánh dấu đã đọc')
                              }}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            title="Xóa thông báo"
                            className="h-6 w-6 text-destructive hover:bg-muted rounded"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteTargetId(notif.id)
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border/80 px-4 py-2.5 bg-muted/20 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                {modalNotifications.length} thông báo{' '}
                {unreadCount > 0 ? `(${unreadCount} chưa đọc)` : ''}
              </span>
              <span className="h-3 w-px bg-border/60" />
              <button
                type="button"
                onClick={() => {
                  resetNotifications()
                  toast.success('Đã khôi phục dữ liệu thông báo mẫu')
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                title="Khôi phục lại dữ liệu mẫu"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Nạp lại mẫu</span>
              </button>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => setIsModalOpen(false)}
            >
              Đóng
            </Button>
          </div>
        </PopoverContent>
      </Popover>

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
