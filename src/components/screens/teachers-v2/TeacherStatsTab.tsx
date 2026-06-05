'use client'

import { useMemo } from 'react'
import { Clock, CalendarDays, TrendingUp, Users } from 'lucide-react'
import { Panel, MetricTile } from '@/components/shared'
import { getTeacherStats } from '@/mocks/teacherDetail'
import { formatHours } from './teacherDetailHelpers'

interface TeacherStatsTabProps {
  teacherId: string
}

export function TeacherStatsTab({ teacherId }: TeacherStatsTabProps) {
  const stats = useMemo(() => getTeacherStats(teacherId), [teacherId])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricTile
          label="Giờ dạy tuần này"
          value={formatHours(stats.totalHoursThisWeek)}
          icon={Clock}
        />
        <MetricTile
          label="Giờ dạy tháng"
          value={formatHours(stats.totalHoursThisMonth)}
          icon={CalendarDays}
        />
        <MetricTile
          label="Tổng giờ tất cả"
          value={formatHours(stats.totalHoursAllTime)}
          icon={TrendingUp}
        />
        <MetricTile
          label="TB học viên/lớp"
          value={String(stats.avgStudentsPerClass)}
          icon={Users}
        />
      </div>

      <Panel title="Thông kê chi tiết">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Tỷ lệ điểm danh</div>
            <div className="mt-1 text-xl font-semibold text-emerald-600">{stats.attendanceRate}%</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Tỷ lệ phản hồi nhận xét</div>
            <div className="mt-1 text-xl font-semibold text-sky-600">{stats.feedbackResponseRate}%</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Ngày bận nhất</div>
            <div className="mt-1 text-xl font-semibold">{stats.peakDay}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Khung giờ bận nhất</div>
            <div className="mt-1 text-xl font-semibold">{stats.peakHour}</div>
          </div>
        </div>
      </Panel>
    </div>
  )
}
