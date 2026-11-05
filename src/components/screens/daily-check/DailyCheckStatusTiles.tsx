'use client'

import React from 'react'
import { StatusTiles, type StatusTile } from '@/components/shared'
import type { DailyTileId, DailySummaryStats } from './dailyCheckTypes'

export interface DailyCheckStatusTilesProps {
  stats: DailySummaryStats
  activeTile: DailyTileId
  onSelectTile: (tileId: DailyTileId) => void
  className?: string
}

export function DailyCheckStatusTiles({
  stats,
  activeTile,
  onSelectTile,
  className,
}: DailyCheckStatusTilesProps) {
  const tiles: StatusTile<DailyTileId>[] = [
    {
      id: 'all',
      label: 'Tất cả ca kiểm tra',
      count: stats.total,
      semantic: 'neutral',
    },
    {
      id: 'perfect',
      label: 'Đạt chuẩn 100%',
      count: stats.perfect,
      semantic: 'success',
    },
    {
      id: 'has_issues',
      label: 'Có lỗi / Chưa xong',
      count: stats.hasIssues,
      semantic: 'error',
    },
    {
      id: 'missing_late',
      label: 'Chậm trễ / Chưa nộp',
      count: stats.missingOrLate,
      semantic: 'warning',
    },
  ]

  return (
    <StatusTiles
      tiles={tiles}
      activeId={activeTile}
      onSelect={onSelectTile}
      className={className}
      coloredCount
      compact
    />
  )
}
