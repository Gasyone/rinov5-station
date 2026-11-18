'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { ConfirmDialog } from '@/components/shared'
import { toast } from 'sonner'
import { useNotificationStore } from '@/stores/useNotificationStore'
import { NotificationsToolbar } from './NotificationsToolbar'
import { NotificationsList } from './NotificationsList'
import { NotificationSettingsDialog } from './NotificationSettingsDialog'
import { filterNotifications } from './notificationsHelpers'
import type {
  NotificationFilterState,
  NotificationStatusFilter,
  NotificationCategoryFilter,
} from './notificationsTypes'

export function NotificationsScreen() {
  const [mounted, setMounted] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Search & Filter State
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<NotificationStatusFilter>('all')
  const [category, setCategory] = useState<NotificationCategoryFilter>('all')

  // Pagination State
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // Single Delete State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  // Zustand Store
  const {
    notifications,
    settings,
    markAsRead,
    toggleRead,
    markAllAsRead,
    removeNotification,
  } = useNotificationStore()

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const filterState: NotificationFilterState = useMemo(() => ({
    search,
    status,
    category,
    priority: 'all',
    timeRange: 'all',
  }), [search, status, category])

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return filterNotifications(notifications, filterState)
  }, [notifications, filterState])

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length
  }, [notifications])

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleStatusChange = (newStatus: NotificationStatusFilter) => {
    setStatus(newStatus)
    setPage(1)
  }

  const handleCategoryChange = (newCat: NotificationCategoryFilter) => {
    setCategory(newCat)
    setPage(1)
  }

  // Single Delete
  const handleConfirmSingleDelete = () => {
    if (!deleteTargetId) return
    removeNotification(deleteTargetId)
    toast.success('Đã xóa thông báo')
    setDeleteTargetId(null)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex-1 min-h-0 h-full w-full overflow-y-auto px-4 py-4 lg:px-6">
      <div className="max-w-4xl mx-auto space-y-3 pb-12">
        {/* 1. Clean Toolbar: Search + Status filter + Category dropdown + Actions */}
        <NotificationsToolbar
          search={search}
          onSearchChange={handleSearchChange}
          status={status}
          onStatusChange={handleStatusChange}
          category={category}
          onCategoryChange={handleCategoryChange}
          unreadCount={unreadCount}
          onMarkAllAsRead={() => {
            markAllAsRead()
            toast.success('Đã đánh dấu tất cả thông báo là đã đọc')
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* 2. Notification List Feed */}
        <NotificationsList
          notifications={filteredNotifications}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setPage(1)
          }}
          onMarkAsRead={markAsRead}
          onToggleRead={toggleRead}
          onRequestDelete={(id) => setDeleteTargetId(id)}
          autoMarkReadOnOpen={settings.autoMarkReadOnOpen}
        />

        {/* 3. Settings Modal Dialog */}
        <NotificationSettingsDialog
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />

        {/* 4. Single Delete Confirm Dialog */}
        <ConfirmDialog
          open={!!deleteTargetId}
          onOpenChange={(open) => {
            if (!open) setDeleteTargetId(null)
          }}
          title="Xóa thông báo"
          description="Bạn có chắc chắn muốn xóa thông báo này? Hành động này sẽ loại bỏ thông báo khỏi danh sách của bạn."
          variant="destructive"
          confirmLabel="Xóa thông báo"
          onConfirm={handleConfirmSingleDelete}
        />
      </div>
    </div>
  )
}
