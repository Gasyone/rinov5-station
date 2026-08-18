import type { ReactNode } from 'react'

export interface ScheduleGridItem {
  id: string
  date: string
  timeLabel: string
  endTimeLabel: string
  startMin: number
}

export interface ScheduleItemRenderContext {
  overlapCount: number
  overlapIndex: number
  isOverlapped: boolean
}

export interface ScheduleTimeGridProps<T extends ScheduleGridItem> {
  items: T[]
  days: Date[]
  today: Date
  renderItem: (item: T, context: ScheduleItemRenderContext) => ReactNode
  hourStart?: number
  hourEnd?: number
  overlapLayout?: 'stack' | 'columns'
  rowClassName?: string
  fixedWidthItems?: boolean
  autoTimeRange?: boolean
  showCurrentTimeIndicator?: boolean
  autoScrollToCurrentTime?: boolean
}

export interface LayoutItem<T> {
  item: T
  top: number
  height: number
  left: number // percentage
  width: number // percentage
}
