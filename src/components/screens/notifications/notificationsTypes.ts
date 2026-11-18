import { LucideIcon } from 'lucide-react'
import type {
  NotificationItem,
  NotificationCategory,
  NotificationPriority,
} from '@/components/layout/notificationHelpers'
import type { NotificationSettings } from '@/stores/useNotificationStore'

export type {
  NotificationItem,
  NotificationCategory,
  NotificationPriority,
  NotificationSettings,
}

export type NotificationTabKey = 'inbox' | 'settings'

export type NotificationStatusFilter = 'all' | 'unread' | 'read'
export type NotificationPriorityFilter = 'all' | 'high' | 'medium' | 'low'
export type NotificationCategoryFilter = 'all' | NotificationCategory
export type NotificationTimeFilter = 'all' | 'today' | '7days' | '30days'

export interface NotificationFilterState {
  search: string
  status: NotificationStatusFilter
  category: NotificationCategoryFilter
  priority: NotificationPriorityFilter
  timeRange: NotificationTimeFilter
}

export interface CategoryOptionConfig {
  value: NotificationCategoryFilter
  label: string
  icon?: LucideIcon
}

export interface PriorityOptionConfig {
  value: NotificationPriorityFilter
  label: string
}
