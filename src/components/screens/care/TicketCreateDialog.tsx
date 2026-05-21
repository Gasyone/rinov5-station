'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FieldLabel } from '@/components/shared'
import { InlineSelect } from '@/components/controls'
import { mockStudents } from '@/mocks/students'
import type { SupportTicket } from '@/mocks/tickets'

interface TicketCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (ticket: Omit<SupportTicket, 'id' | 'createdDate' | 'interactionLogs'>) => void
}

export function TicketCreateDialog({
  open,
  onOpenChange,
  onSubmit,
}: TicketCreateDialogProps) {
  const [studentId, setStudentId] = useState(mockStudents[0]?.id || '')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<SupportTicket['category']>('general')
  const [priority, setPriority] = useState<SupportTicket['priority']>('medium')
  const [assignee, setAssignee] = useState('Nguyễn Thị Cầm (CSM)')
  const [description, setDescription] = useState('')

  const handleClearAndClose = () => {
    setTitle('')
    setCategory('general')
    setPriority('medium')
    setDescription('')
    onOpenChange(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const student = mockStudents.find((s) => s.id === studentId)
    if (!student || !title || !description) return

    onSubmit({
      studentId: student.id,
      studentName: student.name,
      studentCode: `STU-00${student.id.replace('s', '')}`,
      title,
      category,
      priority,
      assignee,
      status: 'new',
      description,
    })

    handleClearAndClose()
  }

  const studentOptions = mockStudents.map((s) => ({
    value: s.id,
    label: `${s.name} (${s.branch})`,
  }))

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
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClearAndClose(); else onOpenChange(true); }}>
      <DialogContent className="max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Tạo phiếu chăm sóc mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <FieldLabel label="Học viên liên quan">
            <InlineSelect
              value={studentId}
              onValueChange={setStudentId}
              options={studentOptions}
              ariaLabel="Chọn học viên"
            />
          </FieldLabel>

          <FieldLabel label="Tiêu đề vụ việc / Sự kiện" required>
            <input
              id="title"
              type="text"
              placeholder="VD: Nghỉ học 3 buổi liên tiếp..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </FieldLabel>

          <div className="grid grid-cols-2 gap-4">
            <FieldLabel label="Phân loại">
              <InlineSelect
                value={category}
                onValueChange={(val) => setCategory(val as SupportTicket['category'])}
                options={categoryOptions}
                ariaLabel="Phân loại"
              />
            </FieldLabel>
            <FieldLabel label="Độ ưu tiên">
              <InlineSelect
                value={priority}
                onValueChange={(val) => setPriority(val as SupportTicket['priority'])}
                options={priorityOptions}
                ariaLabel="Mức độ ưu tiên"
              />
            </FieldLabel>
          </div>

          <FieldLabel label="Người phụ trách xử lý">
            <InlineSelect
              value={assignee}
              onValueChange={setAssignee}
              options={assigneeOptions}
              ariaLabel="Người xử lý"
            />
          </FieldLabel>

          <FieldLabel label="Nội dung chi tiết" required>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả chi tiết vấn đề..."
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </FieldLabel>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClearAndClose}>
              Hủy
            </Button>
            <Button type="submit">Tạo phiếu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
