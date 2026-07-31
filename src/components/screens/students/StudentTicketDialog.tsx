'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FieldLabel } from '@/components/shared'
import { ToolbarSelect } from '@/components/controls'
import { mockStudents } from '@/mocks/students'
import { toast } from 'sonner'

interface StudentTicketDialogProps {
  studentId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StudentTicketDialog({
  studentId,
  open,
  onOpenChange,
}: StudentTicketDialogProps) {
  const student = mockStudents.find((s) => s.id === studentId)
  const studentCode = student ? `STU-00${student.id.replace('s', '')}` : ''

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('general')
  const [priority, setPriority] = useState('medium')
  const [assignee, setAssignee] = useState('Nguyễn Thị Cầm (CSM)')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!student || !title.trim() || !description.trim()) return

    // Mock ticket creation success
    toast.success(`Tạo yêu cầu hỗ trợ thành công cho học viên ${student.name}!`, {
      description: `Tiêu đề: ${title}`,
    })
    onOpenChange(false)
  }

  const categoryOptions = [
    { value: 'academic', label: 'Học thuật' },
    { value: 'billing', label: 'Học phí' },
    { value: 'attendance', label: 'Chuyên cần' },
    { value: 'general', label: 'Chung' },
  ]

  const priorityOptions = [
    { value: 'high', label: 'Cao' },
    { value: 'medium', label: 'Trung bình' },
    { value: 'low', label: 'Thấp' },
  ]

  const assigneeOptions = [
    { value: 'Nguyễn Thị Cầm (CSM)', label: 'Nguyễn Thị Cầm (CSM)' },
    { value: 'Trần Thế Vinh (CSM)', label: 'Trần Thế Vinh (CSM)' },
    { value: 'Phạm Hồng Ngọc (CSM)', label: 'Phạm Hồng Ngọc (CSM)' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Ghi nhận yêu cầu hỗ trợ</DialogTitle>
          <DialogDescription>
            Tạo phiếu hỗ trợ chăm sóc (Support Ticket) cho học viên liên quan.
          </DialogDescription>
        </DialogHeader>

        {student && (
          <form onSubmit={handleSubmit} className="space-y-4 py-2 text-left">
            <div className="rounded-lg bg-muted/40 p-3 border text-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-muted-foreground text-xs">Học viên:</span>
                <span className="font-semibold text-foreground text-xs font-mono">{studentCode}</span>
              </div>
              <div className="font-bold text-foreground text-sm">{student.name}</div>
              <div className="text-muted-foreground text-xs mt-1">Trường: {student.branch}</div>
            </div>

            <FieldLabel label="Tiêu đề vụ việc / Sự kiện" required>
              <input
                id="ticket-title"
                type="text"
                placeholder="VD: Nghỉ học 3 buổi liên tiếp, phàn nàn học phí..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              />
            </FieldLabel>

            <div className="grid grid-cols-2 gap-4">
              <FieldLabel label="Phân loại">
                <ToolbarSelect
                  value={category}
                  onValueChange={setCategory}
                  options={categoryOptions}
                  ariaLabel="Phân loại"
                  className="h-9 min-w-full"
                />
              </FieldLabel>
              <FieldLabel label="Độ ưu tiên">
                <ToolbarSelect
                  value={priority}
                  onValueChange={setPriority}
                  options={priorityOptions}
                  ariaLabel="Mức độ ưu tiên"
                  className="h-9 min-w-full"
                />
              </FieldLabel>
            </div>

            <FieldLabel label="Người phụ trách xử lý">
              <ToolbarSelect
                value={assignee}
                onValueChange={setAssignee}
                options={assigneeOptions}
                ariaLabel="Người xử lý"
                className="h-9 min-w-full"
              />
            </FieldLabel>

            <FieldLabel label="Nội dung chi tiết" required>
              <textarea
                id="ticket-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả chi tiết vấn đề hoặc yêu cầu của phụ huynh..."
                className="w-full min-h-[90px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              />
            </FieldLabel>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={!title.trim() || !description.trim()}>Tạo phiếu hỗ trợ</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
