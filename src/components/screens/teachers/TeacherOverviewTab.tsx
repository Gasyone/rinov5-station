'use client'

import { Clock, Users, BookOpen, Star } from 'lucide-react'
import { MetricTile, InfoField, Panel } from '@/components/shared'
import { type TeacherRecord } from '@/mocks/teacherRecords'
import { getTeacherStats } from '@/mocks/teacherDetail'

interface TeacherOverviewTabProps {
  teacher: TeacherRecord
}

export function TeacherOverviewTab({ teacher }: TeacherOverviewTabProps) {
  const stats = getTeacherStats(teacher.id)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricTile
          label="Lớp đang dạy"
          value={teacher.totalClasses}
          icon={BookOpen}
          trend={{ value: `${stats.totalHoursThisWeek} giờ/tuần` }}
        />
        <MetricTile
          label="Tổng học viên"
          value={teacher.totalStudents}
          icon={Users}
        />
        <MetricTile
          label="Giờ dạy tháng"
          value={stats.totalHoursThisMonth}
          icon={Clock}
          trend={{ value: `${stats.totalHoursThisMonth} giờ` }}
        />
        <MetricTile
          label="Đánh giá"
          value={teacher.rating.toFixed(1)}
          icon={Star}
          trend={{ value: '/5.0', positive: teacher.rating >= 4.5 }}
        />
      </div>

      <Panel title="Thông tin chung">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoField label="Mã giáo viên" value={teacher.code} />
          <InfoField label="Email" value={teacher.email} />
          <InfoField label="Số điện thoại" value={teacher.phone} />
          <InfoField label="Chi nhánh" value={teacher.branch} />
          <InfoField label="Ngày bắt đầu" value={teacher.startDate} />
          <InfoField label="Bộ môn" value={teacher.subjects.join(', ')} />
        </div>
      </Panel>

      {teacher.notes && (
        <Panel title="Ghi chú">
          <p className="text-sm text-muted-foreground">{teacher.notes}</p>
        </Panel>
      )}
    </div>
  )
}
