'use client'

import React, { useState } from 'react'
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
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  TYPE_LABELS,
  BRANCH_OPTIONS,
} from './supportTicketsTypes'

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

const BRANCH_SELECT_OPTIONS = BRANCH_OPTIONS.map((b) => ({
  value: b,
  label: b,
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
  const [branch, setBranch] = useState(BRANCH_OPTIONS[0])
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
      studentPhone: student.phone ?? '0912345678',
      branch: branch || student.branch || BRANCH_OPTIONS[0],
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
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-foreground">
            Tạo Ticket Hỗ trợ & Chăm sóc Mới
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Ghi nhận yêu cầu phản ánh, khiếu nại hoặc lịch chăm sóc chủ động dành cho học viên / phụ huynh.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 py-1">
          {/* Học viên & Cơ sở */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FieldLabel label="Học viên liên quan" required>
              <ToolbarSelect
                value={selectedStudentId}
                onValueChange={setSelectedStudentId}
                options={studentOptions}
                ariaLabel="Chọn học viên"
                className="w-full h-8 text-xs"
              />
            </FieldLabel>

            <FieldLabel label="Cơ sở tiếp nhận" required>
              <ToolbarSelect
                value={branch}
                onValueChange={setBranch}
                options={BRANCH_SELECT_OPTIONS}
                ariaLabel="Chọn cơ sở"
                className="w-full h-8 text-xs"
              />
            </FieldLabel>
          </div>

          {/* Tiêu đề ticket */}
          <FieldLabel label="Tiêu đề yêu cầu / Ticket" required>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Yêu cầu chuyển ca học tối thứ 4 sang thứ 6..."
              className="h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            />
          </FieldLabel>

          {/* Phân loại & Loại ticket */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FieldLabel label="Loại ticket" required>
              <ToolbarSelect
                value={type}
                onValueChange={(val) => setType(val as SupportTicket['type'])}
                options={TYPE_OPTIONS}
                ariaLabel="Loại ticket"
                className="w-full h-8 text-xs"
              />
            </FieldLabel>

            <FieldLabel label="Phân loại nghiệp vụ" required>
              <ToolbarSelect
                value={category}
                onValueChange={(val) => setCategory(val as SupportTicket['category'])}
                options={CATEGORY_OPTIONS}
                ariaLabel="Phân loại"
                className="w-full h-8 text-xs"
              />
            </FieldLabel>
          </div>

          {/* Độ ưu tiên & Người phụ trách & Mã cảnh báo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FieldLabel label="Độ ưu tiên" required>
              <ToolbarSelect
                value={priority}
                onValueChange={(val) => setPriority(val as SupportTicket['priority'])}
                options={PRIORITY_OPTIONS}
                ariaLabel="Độ ưu tiên"
                className="w-full h-8 text-xs"
              />
            </FieldLabel>

            <FieldLabel label="Người phụ trách" required>
              <ToolbarSelect
                value={assignee}
                onValueChange={setAssignee}
                options={ASSIGNEE_OPTIONS}
                ariaLabel="Người phụ trách"
                className="w-full h-8 text-xs"
              />
            </FieldLabel>

            <FieldLabel label="Mã cảnh báo (nếu có)">
              <input
                type="text"
                value={alertCode}
                onChange={(e) => setAlertCode(e.target.value)}
                placeholder="VD: C90B, C100..."
                className="h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </FieldLabel>
          </div>

          {/* Nội dung chi tiết */}
          <FieldLabel label="Mô tả chi tiết nội dung sự việc / yêu cầu" required>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ghi rõ chi tiết yêu cầu của phụ huynh, bối cảnh lớp học hoặc vấn đề phát sinh..."
              rows={3}
              className="w-full rounded-md border border-input bg-background p-2.5 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring leading-relaxed"
              required
            />
          </FieldLabel>

          <DialogFooter className="pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs cursor-pointer"
            >
              Hủy bỏ
            </Button>
            <Button type="submit" size="sm" className="h-8 text-xs cursor-pointer font-medium">
              Tạo Ticket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
