'use client'

import React from 'react'
import {
  GraduationCap,
  Users,
  Gauge,
  UserCheck,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react'
import type { HomeClassMetrics } from './homeTypes'
import { Button } from '@/components/ui/button'

interface HomeMetricsTopProps {
  metrics: HomeClassMetrics
  onNavigateClasses: () => void
}

export function HomeMetricsTop({
  metrics,
  onNavigateClasses,
}: HomeMetricsTopProps) {
  return (
    <div className="bg-card border border-border/70 rounded-xl p-1.5 sm:p-2 shadow-xs">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-border/50 items-center">
        {/* Metric 1: Lớp đang chạy */}
        <div
          onClick={onNavigateClasses}
          className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-muted/40 cursor-pointer transition-colors rounded-lg group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-muted-foreground font-medium block truncate">
              Lớp đang chạy
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-bold text-foreground tabular-nums leading-none">
                {metrics.activeClassesCount}
              </span>
              {metrics.upcomingClassesCount > 0 && (
                <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-1 py-0.2 rounded">
                  +{metrics.upcomingClassesCount} chờ mở
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Metric 2: Học viên đang học */}
        <div
          onClick={onNavigateClasses}
          className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-muted/40 cursor-pointer transition-colors rounded-lg group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
            <Users className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-muted-foreground font-medium block truncate">
              Học viên đang học
            </span>
            <span className="text-sm sm:text-base font-bold text-foreground tabular-nums leading-none">
              {metrics.totalEnrolledStudents}
            </span>
          </div>
        </div>

        {/* Metric 3: Tỷ lệ lấp đầy */}
        <div
          onClick={onNavigateClasses}
          className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-muted/40 cursor-pointer transition-colors rounded-lg group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 shrink-0 group-hover:scale-105 transition-transform">
            <Gauge className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-muted-foreground font-medium block truncate">
              Tỷ lệ lấp đầy
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-base font-bold text-foreground tabular-nums leading-none">
                {metrics.capacityFillRate}%
              </span>
              <span className="text-xs text-muted-foreground font-normal">
                ({metrics.totalEnrolledStudents}/{metrics.maxCapacity})
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4: Chuyên cần TB */}
        <div
          onClick={onNavigateClasses}
          className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-muted/40 cursor-pointer transition-colors rounded-lg group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-muted-foreground font-medium block truncate">
              Chuyên cần TB
            </span>
            <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 tabular-nums leading-none">
              {metrics.avgAttendanceRate}%
            </span>
          </div>
        </div>

        {/* Metric 5: Lớp cần lưu ý */}
        <div
          onClick={onNavigateClasses}
          className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-muted/40 cursor-pointer transition-colors rounded-lg group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-muted-foreground font-medium block truncate">
              Lớp cần lưu ý
            </span>
            <span className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400 tabular-nums leading-none">
              {metrics.specialCareClassesCount} lớp
            </span>
          </div>
        </div>

        {/* Link 6: Xem chi tiết */}
        <div className="flex items-center justify-end px-3 py-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onNavigateClasses}
            className="h-7 text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 px-2 rounded-lg hover:bg-muted/60 transition-colors"
          >
            <span>Chi tiết lớp</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
