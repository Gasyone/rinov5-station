'use client'

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Save, Sparkles } from 'lucide-react'
import type { RosterStudent } from './classesDetailTypes'

interface StudentFeedback {
  student: RosterStudent
  feedback: string
}

interface ClassesBulkFeedbackDialogProps {
  isOpen: boolean
  onClose: () => void
  students: StudentFeedback[]
  onSave: (feedbackMap: Record<string, string>) => void
}

export function ClassesBulkFeedbackDialog({
  isOpen,
  onClose,
  students,
  onSave,
}: ClassesBulkFeedbackDialogProps) {
  // Derive a stable key to detect when the student list changes
  const studentsKey = useMemo(
    () => students.map(({ student }) => student.id).join(','),
    [students],
  )

  const initialDrafts = useMemo(() => {
    const map: Record<string, string> = {}
    students.forEach(({ student, feedback }) => {
      map[student.id] = feedback
    })
    return map
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentsKey])

  const [drafts, setDrafts] = useState<Record<string, string>>(initialDrafts)

  // Reset drafts when students change (e.g. navigating sessions)
  const [prevKey, setPrevKey] = useState(studentsKey)
  if (prevKey !== studentsKey) {
    setPrevKey(studentsKey)
    setDrafts(initialDrafts)
  }

  const handleSave = () => {
    onSave(drafts)
    onClose()
  }

  const editedCount = students.filter(
    ({ student, feedback }) => (drafts[student.id] ?? '') !== feedback
  ).length

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[720px] max-h-[80vh] flex flex-col gap-0 p-0 rounded-xl border bg-white dark:bg-zinc-950 shadow-xl">
        <DialogHeader className="px-6 pt-5 pb-3 border-b shrink-0">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Nhận xét hàng loạt
            <span className="text-xs font-normal text-muted-foreground">
              — {students.length} học viên
            </span>
          </DialogTitle>
          <p className="text-[11px] text-muted-foreground mt-1">
            Nhận xét đã được tự động tạo sẵn. Chỉnh sửa bên dưới nếu cần.
          </p>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-3">
          {students.map(({ student }) => (
            <div key={student.id} className="flex gap-3 items-start">
              <div className="shrink-0 w-[130px] pt-2">
                <p className="text-xs font-semibold text-foreground truncate">{student.name}</p>
                <p className="text-[10px] text-muted-foreground font-mono">{student.code}</p>
              </div>
              <Textarea
                className="text-[11px] min-h-[44px] rounded-lg resize-none flex-1 bg-zinc-50 border-zinc-200 focus:bg-white transition-colors"
                rows={2}
                placeholder="Nhập nhận xét cho học viên..."
                value={drafts[student.id] ?? ''}
                onChange={(e) =>
                  setDrafts((prev) => ({ ...prev, [student.id]: e.target.value }))
                }
              />
            </div>
          ))}
        </div>

        <div className="px-6 py-3 border-t flex items-center justify-between shrink-0 bg-zinc-50/50">
          <span className="text-[10px] text-muted-foreground">
            {editedCount > 0 ? `${editedCount} nhận xét đã chỉnh sửa` : 'Không có thay đổi'}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
              Hủy
            </Button>
            <Button size="sm" onClick={handleSave} className="gap-1.5 text-xs">
              <Save className="h-3.5 w-3.5" />
              Lưu tất cả
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
