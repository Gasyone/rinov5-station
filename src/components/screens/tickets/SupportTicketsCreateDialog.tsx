'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FieldLabel } from '@/components/shared'
import { ToolbarSelect } from '@/components/controls'
import { mockStudents } from '@/mocks/students'
import { toast } from 'sonner'
import type { SupportTicket } from '@/mocks/tickets'
import { CATEGORY_LABELS, PRIORITY_LABELS, TYPE_LABELS } from './supportTicketsTypes'

interface SupportTicketsCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTicketCreated: (ticket: Omit<SupportTicket, 'id' | 'createdDate' | 'interactionLogs'>) => void
}

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}))

const PRIORITY_OPTIONS = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
  value,
  label,
}))

const TYPE_OPTIONS = Object.entries(TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}))

const ASSIGNEE_OPTIONS = [
  { value: 'AnhNTN33', label: 'AnhNTN33 (CSM Trưởng)' },
  { value: 'CSM Minh Phương', label: 'CSM Minh Phương' },
  { value: 'CSM Hoàng Lan', label: 'CSM Hoàng Lan' },
  { value: 'CSM Thu Trang', label: 'CSM Thu Trang' },
  { value: 'Giáo vụ Cơ sở', label: 'Giáo vụ Cơ sở' },
]

export function SupportTicketsCreateDialog({
  open,
  onOpenChange,
  onTicketCreated,
}: SupportTicketsCreateDialogProps) {
  const [selectedStudentId, setSelectedStudentId] = useState(mockStudents[0]?.id ?? 's1')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<SupportTicket['category']>('academic')
  const [priority, setPriority] = useState<SupportTicket['priority']>('medium')
  const [type, setType] = useState<SupportTicket['type']>('support')
  const [assignee, setAssignee] = useState('AnhNTN33')
  const [alertCode, setAlertCode] = useState('')
  const [description, setDescription] = useState('')

  const studentOptions = mockStudents.map((s) => ({
    value: s.id,
    label: `${s.name} (STU-00${s.id.replace('s', '')}) - ${s.branch ?? 'Cơ sở chính'}`,
  }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      toast.error('Vui lòng nhập đầy đủ tiêu đề và nội dung ticket!')
      return
    }

    const student = mockStudents.find((s) => s.id === selectedStudentId)
    if (!student) return

    const studentCode = `STU-00${student.id.replace('s', '')}`

    onTicketCreated({
      studentId: student.id,
      studentName: student.name,
      studentCode,
      title: title.trim(),
      category,
      priority,
      status: 'new',
      type,
      assignee,
      alertCode: alertCode.trim() ? alertCode.trim() : undefined,
      description: description.trim(),
    })

    toast.success(`Đã tạo phiếu hỗ trợ mới cho học viên ${student.name}!`, {
      description: title.trim(),
    })

    // Reset form
    setTitle('')
    setAlertCode('')
    setDescription('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-foreground">
            Khởi tạo Ticket & Phiếu hỗ trợ mới
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Ghi nhận thông tin khiếu nại, phản ánh chất lượng hoặc phiếu chăm sóc đặc biệt cho học viên.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 py-1 text-left">
          {/* Học viên */}
          <FieldLabel label="Học viên liên quan" required>
            <ToolbarSelect
              value={selectedStudentId}
              onValueChange={setSelectedStudentId}
              options={studentOptions}
              ariaLabel="Chọn học viên"
              className="w-full h-8 text-xs"
            />
          </FieldLabel>

          {/* Tiêu đề */}
          <FieldLabel label="Tiêu đề yêu cầu / Vụ việc" required>
            <input
              type="text"
              placeholder="VD: Phụ huynh phàn nàn ca học, đề nghị bảo lưu, cảnh báo BTVN..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-8 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            />
          </FieldLabel>

          {/* Grid 2 cột: Loại ticket & Phân loại */}
          <div className="grid grid-cols-2 gap-3">
            <FieldLabel label="Nhóm ticket" required>
              <ToolbarSelect
                value={type}
                onValueChange={(val) => setType(val as SupportTicket['type'])}
                options={TYPE_OPTIONS}
                ariaLabel="Nhóm ticket"
                className="w-full h-8 text-xs"
              />
            </FieldLabel>

            <FieldLabel label="Phân loại nội dung" required>
              <ToolbarSelect
                value={category}
                onValueChange={(val) => setCategory(val as SupportTicket['category'])}
                options={CATEGORY_OPTIONS}
                ariaLabel="Phân loại nội dung"
                className="w-full h-8 text-xs"
              />
            </FieldLabel>
          </div>

          {/* Grid 2 cột: Độ ưu tiên & Phụ trách */}
          <div className="grid grid-cols-2 gap-3">
            <FieldLabel label="Mức độ ưu tiên" required>
              <ToolbarSelect
                value={priority}
                onValueChange={(val) => setPriority(val as SupportTicket['priority'])}
                options={PRIORITY_OPTIONS}
                ariaLabel="Mức độ ưu tiên"
                className="w-full h-8 text-xs"
              />
            </FieldLabel>

            <FieldLabel label="Nhân sự phụ trách" required>
              <ToolbarSelect
                value={assignee}
                onValueChange={setAssignee}
                options={ASSIGNEE_OPTIONS}
                ariaLabel="Nhân sự phụ trách"
                className="w-full h-8 text-xs"
              />
            </FieldLabel>
          </div>

          {/* Mã cảnh báo liên kết (tùy chọn) */}
          <FieldLabel label="Mã cảnh báo liên kết (nếu có)">
            <input
              type="text"
              placeholder="VD: C90B, C100, Vắng 3 buổi, Điểm giảm..."
              value={alertCode}
              onChange={(e) => setAlertCode(e.target.value)}
              className="w-full h-8 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </FieldLabel>

          {/* Mô tả chi tiết */}
          <FieldLabel label="Mô tả chi tiết nội dung sự việc" required>
            <textarea
              rows={3}
              placeholder="Ghi nhận rõ nguyên nhân, chi tiết phản hồi từ phụ huynh và phương án đề xuất..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-input bg-background p-2.5 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            />
          </FieldLabel>

          <DialogFooter className="pt-2 border-t gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs"
            >
              Hủy bỏ
            </Button>
            <Button type="submit" size="sm" className="h-8 text-xs font-semibold">
              Tạo Ticket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
