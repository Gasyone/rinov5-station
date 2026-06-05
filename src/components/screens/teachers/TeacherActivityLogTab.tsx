'use client'

import { useMemo } from 'react'
import { History } from 'lucide-react'
import { Panel, EmptyState } from '@/components/shared'
import { getTeacherActivityLogs } from '@/mocks/teacherDetail'

interface TeacherActivityLogTabProps {
  teacherId: string
}

export function TeacherActivityLogTab({ teacherId }: TeacherActivityLogTabProps) {
  const logs = useMemo(() => getTeacherActivityLogs(teacherId), [teacherId])

  if (logs.length === 0) {
    return <EmptyState title="Chưa có nhật ký" description="Chưa có hoạt động nào được ghi nhận cho giáo viên này." />
  }

  return (
    <Panel title="Nhật ký thao tác">
      <div className="relative border-l-2 border-muted pl-6">
        {logs.map((log) => (
          <div key={log.id} className="relative pb-6 last:pb-0">
            <div className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-background border-2 border-muted">
              <History className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-medium text-sm">{log.action}</div>
                <div className="text-sm text-muted-foreground">{log.detail}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-xs text-muted-foreground">{log.date}</div>
                <div className="text-xs text-muted-foreground">{log.actor}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}
