'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldLabel } from '@/components/shared'
import { ToolbarSelect } from '@/components/controls'
import type { Class } from '@/mocks/classes'

interface ClassesFormDialogProps {
  open: boolean
  mode: 'create' | 'edit'
  initial: Omit<Class, 'id'> & { id?: string }
  branches: string[]
  levels: string[]
  teachers: string[]
  onOpenChange: (open: boolean) => void
  onSubmit: (value: Omit<Class, 'id'> & { id?: string }) => void
}

export function ClassesFormDialog({
  open,
  mode,
  initial,
  branches,
  levels,
  teachers,
  onOpenChange,
  onSubmit,
}: ClassesFormDialogProps) {
  const [value, setValue] = useState(initial)

  const isValid =
    value.name.trim() &&
    value.branch.trim() &&
    value.level.trim() &&
    value.teacher.trim() &&
    value.startDate &&
    value.endDate

  const update = <K extends keyof typeof value>(key: K, next: (typeof value)[K]) =>
    setValue((current) => ({ ...current, [key]: next }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Tạo lớp mới' : 'Chỉnh sửa lớp'}</DialogTitle>
          <DialogDescription>
            Nhập thông tin lớp học. Các trường bắt buộc đánh dấu *.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 md:grid-cols-2">
          <FieldLabel label="Tên lớp" required className="md:col-span-2">
            <Input
              value={value.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="VD: IELTS Junior 1A"
            />
          </FieldLabel>
          <FieldLabel label="Chi nhánh" required>
            <ToolbarSelect
              value={value.branch}
              ariaLabel="Chi nhánh"
              options={[
                { value: '', label: 'Chọn chi nhánh' },
                ...branches.map((b) => ({ value: b, label: b })),
              ]}
              onValueChange={(v) => update('branch', v)}
            />
          </FieldLabel>
          <FieldLabel label="Trình độ" required>
            <ToolbarSelect
              value={value.level}
              ariaLabel="Trình độ"
              options={[
                { value: '', label: 'Chọn trình độ' },
                ...levels.map((l) => ({ value: l, label: l })),
              ]}
              onValueChange={(v) => update('level', v)}
            />
          </FieldLabel>
          <FieldLabel label="Giáo viên" required>
            <ToolbarSelect
              value={value.teacher}
              ariaLabel="Giáo viên"
              options={[
                { value: '', label: 'Chọn giáo viên' },
                ...teachers.map((t) => ({ value: t, label: t })),
              ]}
              onValueChange={(v) => update('teacher', v)}
            />
          </FieldLabel>
          <FieldLabel label="Phòng học">
            <Input
              value={value.room}
              onChange={(e) => update('room', e.target.value)}
              placeholder="VD: A101"
            />
          </FieldLabel>
          <FieldLabel label="Lịch học" required>
            <Input
              value={value.schedule}
              onChange={(e) => update('schedule', e.target.value)}
              placeholder='VD: 2/4/6 18:00-20:00'
            />
          </FieldLabel>
          <FieldLabel label="Ngày bắt đầu" required>
            <Input
              type="date"
              value={value.startDate}
              onChange={(e) => update('startDate', e.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="Ngày kết thúc" required>
            <Input
              type="date"
              value={value.endDate}
              onChange={(e) => update('endDate', e.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="Sĩ số tối đa">
            <Input
              type="number"
              min={1}
              value={value.maxStudents}
              onChange={(e) => update('maxStudents', Number(e.target.value) || 0)}
            />
          </FieldLabel>
          <FieldLabel label="Học viên hiện tại">
            <Input
              type="number"
              min={0}
              value={value.enrolledStudents}
              onChange={(e) => update('enrolledStudents', Number(e.target.value) || 0)}
            />
          </FieldLabel>
          <FieldLabel label="Học phí (VND)" className="md:col-span-2">
            <Input
              type="number"
              min={0}
              value={value.tuitionFee}
              onChange={(e) => update('tuitionFee', Number(e.target.value) || 0)}
            />
          </FieldLabel>
          <FieldLabel label="Ghi chú" className="md:col-span-2">
            <Textarea
              rows={3}
              value={value.notes ?? ''}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Ghi chú tambahan..."
            />
          </FieldLabel>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button disabled={!isValid} onClick={() => onSubmit(value)}>
            {mode === 'create' ? 'Tạo lớp' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
