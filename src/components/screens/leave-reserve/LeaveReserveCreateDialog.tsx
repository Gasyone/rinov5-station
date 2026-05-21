'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FieldLabel } from '@/components/shared'
import { InlineSelect } from '@/components/controls'
import { mockStudents } from '@/mocks/students'
import type { LeaveReserveRequest } from '@/mocks/leaveReserve'

interface LeaveReserveCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (req: Omit<LeaveReserveRequest, 'id' | 'status' | 'requestedDate'>) => void
}

export function LeaveReserveCreateDialog({
  open,
  onOpenChange,
  onSubmit,
}: LeaveReserveCreateDialogProps) {
  const [studentId, setStudentId] = useState(mockStudents[0]?.id || '')
  const [type, setType] = useState<LeaveReserveRequest['type']>('leave')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')

  const handleClearAndClose = () => {
    setStartDate('')
    setEndDate('')
    setReason('')
    onOpenChange(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const student = mockStudents.find((s) => s.id === studentId)
    if (!student || !startDate || !endDate || !reason) return

    onSubmit({
      studentId: student.id,
      studentName: student.name,
      studentCode: `STU-00${student.id.replace('s', '')}`,
      branch: student.branch,
      type,
      startDate,
      endDate,
      reason,
    })

    handleClearAndClose()
  }

  const studentOptions = mockStudents.map((s) => ({
    value: s.id,
    label: `${s.name} (${s.branch})`,
  }))

  const typeOptions = [
    { value: 'leave', label: 'Nghỉ phép' },
    { value: 'reserve', label: 'Bảo lưu' },
    { value: 'suspend', label: 'Nghỉ học tạm thời' },
  ]

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClearAndClose(); else onOpenChange(true); }}>
      <DialogContent className="max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Tạo đơn yêu cầu mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <FieldLabel label="Học viên">
            <InlineSelect
              value={studentId}
              onValueChange={setStudentId}
              options={studentOptions}
              ariaLabel="Chọn học viên"
            />
          </FieldLabel>

          <div className="grid grid-cols-2 gap-4">
            <FieldLabel label="Loại yêu cầu">
              <InlineSelect
                value={type}
                onValueChange={(val) => setType(val as LeaveReserveRequest['type'])}
                options={typeOptions}
                ariaLabel="Chọn loại yêu cầu"
              />
            </FieldLabel>
            <div>
              {/* Spacer or additional fields */}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FieldLabel label="Từ ngày" required>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </FieldLabel>
            <FieldLabel label="Đến ngày" required>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </FieldLabel>
          </div>

          <FieldLabel label="Lý do yêu cầu" required>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do chi tiết..."
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </FieldLabel>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClearAndClose}>
              Hủy
            </Button>
            <Button type="submit">Gửi yêu cầu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
