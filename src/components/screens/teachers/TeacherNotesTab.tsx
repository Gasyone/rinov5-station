'use client'

import { useMemo } from 'react'
import { AlertTriangle, AlertCircle, FileText } from 'lucide-react'
import { Panel, EmptyState } from '@/components/shared'
import { getTeacherNotes, type TeacherNote } from '@/mocks/teacherDetail'

interface TeacherNotesTabProps {
  teacherId: string
}

const PRIORITY_CONFIG: Record<TeacherNote['priority'], { label: string; icon: typeof FileText; color: string }> = {
  normal: { label: 'Bình thường', icon: FileText, color: 'text-muted-foreground' },
  important: { label: 'Quan trọng', icon: AlertCircle, color: 'text-amber-600' },
  urgent: { label: 'Khẩn cấp', icon: AlertTriangle, color: 'text-red-600' },
}

export function TeacherNotesTab({ teacherId }: TeacherNotesTabProps) {
  const notes = useMemo(() => getTeacherNotes(teacherId), [teacherId])

  if (notes.length === 0) {
    return <EmptyState title="Chưa có ghi chú" description="Chưa có ghi chú vận hành nào cho giáo viên này." />
  }

  return (
    <Panel title="Ghi chú vận hành">
      <div className="space-y-3">
        {notes.map((note) => {
          const config = PRIORITY_CONFIG[note.priority]
          const Icon = config.icon
          return (
            <div key={note.id} className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${config.color}`} />
                  <span className="text-sm font-medium">{config.label}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{note.author}</span>
                  <span>•</span>
                  <span>{note.date}</span>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{note.content}</div>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
