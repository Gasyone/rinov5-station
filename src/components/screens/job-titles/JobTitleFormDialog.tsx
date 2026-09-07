'use client'

import React, { useState } from 'react'
import { Briefcase } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldLabel } from '@/components/shared'
import { ToolbarSelect } from '@/components/controls'
import type { JobTitle } from './jobTitlesTypes'

const DEPARTMENT_SELECT_OPTIONS = [
  { value: 'Phòng Đào tạo', label: 'Phòng Đào tạo' },
  { value: 'Ban Giám đốc', label: 'Ban Giám đốc' },
  { value: 'Customer Care', label: 'Customer Care' },
  { value: 'Phòng Tuyển sinh', label: 'Phòng Tuyển sinh' },
  { value: 'Kế toán & Tài chính', label: 'Kế toán & Tài chính' },
  { value: 'IT & Kỹ thuật', label: 'IT & Kỹ thuật' },
  { value: 'Hành chính & Lễ tân', label: 'Hành chính & Lễ tân' },
]

const STATUS_SELECT_OPTIONS = [
  { value: 'active', label: 'Đang áp dụng' },
  { value: 'inactive', label: 'Tạm ngưng' },
]

export interface JobTitleFormData {
  code: string
  name: string
  department: string
  targetHeadcount: number
  description: string
  status: 'active' | 'inactive'
}

interface JobTitleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  initialData?: JobTitle | null
  onSubmit: (data: JobTitleFormData) => void
}

function JobTitleFormFields({
  initialData,
  mode,
  onClose,
  onSubmit,
}: {
  initialData?: JobTitle | null
  mode: 'create' | 'edit'
  onClose: () => void
  onSubmit: (data: JobTitleFormData) => void
}) {
  const [name, setName] = useState(initialData?.name || '')
  const [code, setCode] = useState(initialData?.code || '')
  const [department, setDepartment] = useState(initialData?.department || 'Phòng Đào tạo')
  const [targetHeadcount, setTargetHeadcount] = useState(initialData?.targetHeadcount || 4)
  const [description, setDescription] = useState(initialData?.description || '')
  const [status, setStatus] = useState<'active' | 'inactive'>(initialData?.status || 'active')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Vui lòng nhập tên chức danh'
    if (!code.trim()) {
      errs.code = 'Vui lòng nhập mã chức danh'
    } else if (!/^[A-Z0-9_]+$/.test(code.trim())) {
      errs.code = 'Mã chức danh chỉ bao gồm chữ HOA, số và dấu gạch dưới (VD: TEACHER_EN)'
    }
    if (!department) errs.department = 'Vui lòng chọn phòng ban/khối'
    if (targetHeadcount < 1) errs.targetHeadcount = 'Định mức tối thiểu là 1'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    onSubmit({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      department,
      targetHeadcount: Number(targetHeadcount),
      description: description.trim(),
      status,
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      {/* Tên chức danh & Mã */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FieldLabel label="Tên chức danh" required error={errors.name}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Giáo viên Tiếng Anh"
            className="h-8 text-xs"
          />
        </FieldLabel>

        <FieldLabel label="Mã chức danh" required error={errors.code}>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="VD: TEACHER_EN"
            className="h-8 text-xs font-mono"
          />
        </FieldLabel>
      </div>

      {/* Khối / Phòng ban & Định mức */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FieldLabel label="Khối / Phòng ban" required error={errors.department}>
          <ToolbarSelect
            value={department}
            options={DEPARTMENT_SELECT_OPTIONS}
            onValueChange={(val) => setDepartment(val)}
            className="h-8 text-xs w-full justify-between"
          />
        </FieldLabel>

        <FieldLabel
          label="Định mức nhân sự (Chỉ tiêu)"
          required
          error={errors.targetHeadcount}
          description="Số lượng nhân sự tối thiểu cần duy trì"
        >
          <Input
            type="number"
            min={1}
            max={100}
            value={targetHeadcount}
            onChange={(e) => setTargetHeadcount(parseInt(e.target.value, 10) || 1)}
            className="h-8 text-xs"
          />
        </FieldLabel>
      </div>

      {/* Trạng thái áp dụng */}
      <FieldLabel label="Trạng thái áp dụng">
        <ToolbarSelect
          value={status}
          options={STATUS_SELECT_OPTIONS}
          onValueChange={(val) => setStatus(val as 'active' | 'inactive')}
          className="h-8 text-xs w-full justify-between"
        />
      </FieldLabel>

      {/* Mô tả nhiệm vụ */}
      <FieldLabel label="Mô tả vai trò & trách nhiệm">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Nhập tóm tắt mô tả công việc, nhiệm vụ chính của chức danh..."
          rows={3}
          className="text-xs resize-none"
        />
      </FieldLabel>

      <DialogFooter className="pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          className="h-8 text-xs cursor-pointer"
        >
          Hủy
        </Button>
        <Button
          type="submit"
          variant="default"
          size="sm"
          className="h-8 text-xs cursor-pointer"
        >
          {mode === 'create' ? 'Tạo chức danh' : 'Lưu thay đổi'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export const JobTitleFormDialog: React.FC<JobTitleFormDialogProps> = ({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Briefcase className="h-4 w-4 text-primary" />
            <span>{mode === 'create' ? 'Thêm mới Chức danh' : 'Chỉnh sửa Chức danh'}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {mode === 'create'
              ? 'Khai báo chức danh công việc mới để phục vụ cấu trúc tổ chức và gán nhân sự.'
              : `Cập nhật thông tin chức danh ${initialData?.name || ''}.`}
          </DialogDescription>
        </DialogHeader>

        {open ? (
          <JobTitleFormFields
            key={initialData ? `edit-${initialData.id}` : 'create'}
            initialData={initialData}
            mode={mode}
            onClose={() => onOpenChange(false)}
            onSubmit={onSubmit}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
