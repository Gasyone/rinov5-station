'use client'

import { useMemo } from 'react'
import { Clock, CheckCircle2, XCircle } from 'lucide-react'
import { Panel, EmptyState } from '@/components/shared'
import { getTeacherAssignments } from '@/mocks/teacherDetail'
import { generateWeekSchedule } from './teacherDetailHelpers'

interface TeacherScheduleTabProps {
  teacherId: string
}

export function TeacherScheduleTab({ teacherId }: TeacherScheduleTabProps) {
  const assignments = useMemo(() => getTeacherAssignments(teacherId).filter((a) => a.status === 'active'), [teacherId])
  const weekSchedule = useMemo(() => generateWeekSchedule(), [])

  if (assignments.length === 0) {
    return <EmptyState title="Không có lịch dạy" description="Giáo viên này không có lớp nào đang hoạt động." />
  }

  return (
    <div className="space-y-4">
      <Panel title="Lịch dạy tuần này">
        <div className="space-y-3">
          {weekSchedule.map((day) => (
            <div key={day.date} className="flex items-start gap-4 rounded-lg border p-3">
              <div className="w-20 shrink-0">
                <div className="text-sm font-medium">{day.day}</div>
                <div className="text-xs text-muted-foreground">{day.date}</div>
              </div>
              {day.hasClass ? (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{day.count} buổi học</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <XCircle className="h-4 w-4" />
                  <span>Không có lớp</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Chi tiết buổi học">
        <div className="space-y-2">
          {assignments.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <div className="font-medium">{a.classCode}</div>
                <div className="text-xs text-muted-foreground">{a.className} — Phòng {a.room}</div>
              </div>
              <div className="text-right text-sm text-muted-foreground">{a.schedule}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
