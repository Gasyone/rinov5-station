'use client'

import React from 'react'
import {
  CheckCheck,
  Search,
  Settings,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  SegmentedControl,
  ToolbarSelect,
  type SegmentedControlOption,
} from '@/components/controls'
import { CATEGORY_FILTER_OPTIONS } from './notificationsHelpers'
import type {
  NotificationStatusFilter,
  NotificationCategoryFilter,
} from './notificationsTypes'

interface NotificationsToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  status: NotificationStatusFilter
  onStatusChange: (status: NotificationStatusFilter) => void
  category: NotificationCategoryFilter
  onCategoryChange: (category: NotificationCategoryFilter) => void
  unreadCount: number
  onMarkAllAsRead: () => void
  onOpenSettings: () => void
}

export function NotificationsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  unreadCount,
  onMarkAllAsRead,
  onOpenSettings,
}: NotificationsToolbarProps) {
  const statusOptions: SegmentedControlOption<NotificationStatusFilter>[] = [
    { value: 'all', label: 'Tất cả' },
    {
      value: 'unread',
      label: (
        <span className="flex items-center gap-1.5">
          <span>Chưa đọc</span>
          {unreadCount > 0 && (
            <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </span>
      ),
    },
  ]

  const categoryOptions = CATEGORY_FILTER_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }))

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5">
      {/* Left Side: Search + Filter status + Category filter */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search Input */}
        <div className="relative w-64 sm:w-80">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Tìm theo tiêu đề, nội dung, mã..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-8 pl-8 pr-7 text-xs rounded-md bg-background border-border/80 focus-visible:ring-1"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Status: Tất cả / Chưa đọc */}
        <SegmentedControl
          value={status}
          options={statusOptions}
          onValueChange={onStatusChange}
          className="h-8"
        />

        {/* Category Dropdown */}
        <div className="w-44">
          <ToolbarSelect
            value={category}
            options={categoryOptions}
            onValueChange={(val) => onCategoryChange(val as NotificationCategoryFilter)}
          />
        </div>
      </div>

      {/* Right Side: Mark All Read + Settings Dialog trigger */}
      <div className="flex items-center gap-1.5 ml-auto">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onMarkAllAsRead}
          disabled={unreadCount === 0}
          className="h-8 text-xs gap-1.5"
          title="Đánh dấu tất cả thông báo là đã đọc"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          <span>Đọc tất cả</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenSettings}
          className="h-8 text-xs gap-1.5"
          title="Mở hộp thoại cài đặt thông báo"
        >
          <Settings className="h-3.5 w-3.5" />
          <span>Cài đặt</span>
        </Button>
      </div>
    </div>
  )
}
