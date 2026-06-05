'use client'

import { useMemo } from 'react'
import { Panel, EmptyState, StatusBadge } from '@/components/shared'
import { getTeacherSubHistory } from '@/mocks/teacherDetail'
import { getSubStatusSemantic } from './teacherDetailHelpers'

interface TeacherSubHistoryTabProps {
  teacherId: string
}

export function TeacherSubHistoryTab({ teacherId }: TeacherSubHistoryTabProps) {
  const history = useMemo(() => getTeacherSubHistory(teacherId), [teacherId])

  if (history.length === 0) {
    return <EmptyState title="Không có lịch sử dạy thay" description="Giáo viên này chưa có lần dạy thay nào được ghi nhận." />
  }

  return (
    <Panel title="Lịch sử dạy thay">
      <div className="space-y-3">
        {history.map((record) => (
          <div key={record.id} className="flex items-start justify-between gap-4 rounded-lg border p-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{record.classCode}</span>
                <StatusBadge status={getSubStatusSemantic(record.status)} label={record.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'} />
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Dạy thay cho {record.originalTeacher} — {record.reason}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                Lớp: {record.className}
              </div>
            </div>
            <div className="shrink-0 text-right text-sm text-muted-foreground">{record.date}</div>
          </div>
        ))}
      </div>
    </Panel>
  )
}
