'use client'

import React, { useState, useMemo } from 'react'
import {
  Users,
  Search,
  X,
} from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldLabel, EmptyState } from '@/components/shared'
import { ToolbarSelect } from '@/components/controls'
import { mockOrgUnits } from '@/mocks/orgStructure'
import { mockEmployees } from '@/mocks/employees'
import { OrgUnitTreeSelect } from './OrgUnitTreeSelect'
import { getInitials, maskPhoneNumber } from './jobTitlesHelpers'
import { cn } from '@/lib/utils'
import type { JobTitle } from './jobTitlesTypes'

const STATUS_SELECT_OPTIONS = [
  { value: 'active', label: 'Đang áp dụng' },
  { value: 'inactive', label: 'Tạm ngưng' },
]

export interface JobTitleFormData {
  code: string
  name: string
  department: string
  orgUnitId?: string
  targetHeadcount?: number
  description: string
  status: 'active' | 'inactive'
  assignedEmployeeIds: string[]
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
  const defaultOrgUnitId =
    initialData?.orgUnitId ||
    mockOrgUnits.find((u) => u.name === initialData?.department)?.id ||
    ''

  // Left Panel State: Job title details
  const [name, setName] = useState(initialData?.name || '')
  const [code, setCode] = useState(initialData?.code || '')
  const [selectedOrgUnitId, setSelectedOrgUnitId] = useState(defaultOrgUnitId)
  const [description, setDescription] = useState(initialData?.description || '')
  const [status, setStatus] = useState<'active' | 'inactive'>(initialData?.status || 'active')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Right Panel State: Personnel assignment
  const [assignedEmployeeIds, setAssignedEmployeeIds] = useState<string[]>(
    () => initialData?.assignedEmployeeIds || []
  )
  const [employeeSearch, setEmployeeSearch] = useState('')
  const [employeeFilter, setEmployeeFilter] = useState<'all' | 'selected'>('all')

  // Filter available employees (not resigned)
  const eligibleEmployees = useMemo(() => {
    return mockEmployees.filter((e) => e.status !== 'resigned')
  }, [])

  const filteredEmployees = useMemo(() => {
    const q = employeeSearch.trim().toLowerCase()
    return eligibleEmployees.filter((emp) => {
      // Filter by tab
      if (employeeFilter === 'selected' && !assignedEmployeeIds.includes(emp.id)) {
        return false
      }
      // Filter by search query
      if (q) {
        const matchName = emp.name.toLowerCase().includes(q)
        const matchEmail = emp.email.toLowerCase().includes(q)
        const matchPhone = emp.phone.includes(q)
        const matchPos = emp.position.toLowerCase().includes(q)
        const matchDept = emp.department.toLowerCase().includes(q)
        if (!matchName && !matchEmail && !matchPhone && !matchPos && !matchDept) {
          return false
        }
      }
      return true
    })
  }, [eligibleEmployees, employeeFilter, assignedEmployeeIds, employeeSearch])

  const handleToggleEmployee = (id: string) => {
    setAssignedEmployeeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSelectAllFiltered = () => {
    const currentVisibleIds = filteredEmployees.map((e) => e.id)
    const allSelected = currentVisibleIds.every((id) => assignedEmployeeIds.includes(id))
    if (allSelected) {
      setAssignedEmployeeIds((prev) => prev.filter((id) => !currentVisibleIds.includes(id)))
    } else {
      setAssignedEmployeeIds((prev) => Array.from(new Set([...prev, ...currentVisibleIds])))
    }
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Vui lòng nhập tên chức danh'
    if (!code.trim()) {
      errs.code = 'Vui lòng nhập mã chức danh'
    } else if (!/^[A-Z0-9_]+$/.test(code.trim())) {
      errs.code = 'Mã chức danh chỉ bao gồm chữ HOA, số và dấu gạch dưới (VD: TEACHER_EN)'
    }
    if (!selectedOrgUnitId) errs.department = 'Vui lòng chọn phòng ban/khối từ Sơ đồ tổ chức'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const matchedUnit = mockOrgUnits.find((u) => u.id === selectedOrgUnitId)

    onSubmit({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      department: matchedUnit?.name || 'Phòng Đào tạo',
      orgUnitId: selectedOrgUnitId,
      targetHeadcount: assignedEmployeeIds.length,
      description: description.trim(),
      status,
      assignedEmployeeIds,
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
      {/* 2-PANEL LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-0 divide-y md:divide-y-0 md:divide-x divide-border overflow-hidden">
        {/* PANEL TRÁI: THÔNG TIN CHỨC DANH */}
        <div className="md:col-span-6 p-5 overflow-y-auto space-y-3.5 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-border/60 shrink-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Thông tin chức danh
            </span>
            <span className="text-[11px] text-muted-foreground">(* Bắt buộc)</span>
          </div>

          {/* Tên chức danh */}
          <FieldLabel label="Tên chức danh" required error={errors.name}>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Giáo viên Tiếng Anh"
              className="h-8 text-xs"
            />
          </FieldLabel>

          {/* Mã chức danh */}
          <FieldLabel label="Mã chức danh" required error={errors.code}>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="VD: TEACHER_EN"
              className="h-8 text-xs font-mono"
            />
          </FieldLabel>

          {/* Khối / Phòng ban (Sơ đồ tổ chức) */}
          <FieldLabel label="Khối / Phòng ban (Sơ đồ tổ chức)" required error={errors.department}>
            <OrgUnitTreeSelect
              value={selectedOrgUnitId}
              onChange={(unitId) => {
                setSelectedOrgUnitId(unitId)
                if (errors.department) {
                  setErrors((prev) => {
                    const copy = { ...prev }
                    delete copy.department
                    return copy
                  })
                }
              }}
              error={errors.department}
            />
          </FieldLabel>

          {/* Trạng thái áp dụng */}
          <FieldLabel label="Trạng thái áp dụng">
            <ToolbarSelect
              value={status}
              options={STATUS_SELECT_OPTIONS}
              onValueChange={(val) => setStatus(val as 'active' | 'inactive')}
              className="h-8 text-xs w-full justify-between"
            />
          </FieldLabel>

          {/* Mô tả vai trò & trách nhiệm */}
          <FieldLabel label="Mô tả vai trò & trách nhiệm">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập tóm tắt mô tả công việc, nhiệm vụ chính của chức danh..."
              rows={4}
              className="text-xs resize-none"
            />
          </FieldLabel>
        </div>

        {/* PANEL PHẢI: GÁN NHÂN SỰ TRỰC TIẾP */}
        <div className="md:col-span-6 p-5 flex flex-col min-h-0 bg-muted/5 overflow-hidden">
          {/* Header Panel Phải */}
          <div className="flex items-center justify-between pb-2 border-b border-border/60 shrink-0">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Nhân sự đảm nhiệm
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-xs font-normal bg-primary/5 text-primary border-primary/20 gap-1 py-0.5"
            >
              <span>Đã chọn:</span>
              <strong className="font-semibold">{assignedEmployeeIds.length}</strong>
            </Badge>
          </div>

          {/* Search & Filter bar */}
          <div className="flex flex-col gap-2 pt-2.5 pb-2 shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                placeholder="Tìm kiếm theo tên, email, SĐT, vị trí..."
                className="h-8 pl-8 pr-7 text-xs bg-background"
              />
              {employeeSearch && (
                <button
                  type="button"
                  onClick={() => setEmployeeSearch('')}
                  className="absolute right-2 top-2 p-0.5 text-muted-foreground hover:text-foreground rounded cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filter tabs */}
            <div className="flex items-center justify-between text-xs">
              <div className="inline-flex rounded-md p-0.5 bg-muted/60 text-muted-foreground">
                <button
                  type="button"
                  onClick={() => setEmployeeFilter('all')}
                  className={cn(
                    'px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer',
                    employeeFilter === 'all'
                      ? 'bg-background text-foreground shadow-2xs'
                      : 'hover:text-foreground'
                  )}
                >
                  Tất cả ({eligibleEmployees.length})
                </button>
                <button
                  type="button"
                  onClick={() => setEmployeeFilter('selected')}
                  className={cn(
                    'px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer',
                    employeeFilter === 'selected'
                      ? 'bg-background text-foreground shadow-2xs'
                      : 'hover:text-foreground'
                  )}
                >
                  Đã chọn ({assignedEmployeeIds.length})
                </button>
              </div>

              {filteredEmployees.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAllFiltered}
                  className="text-[11px] text-primary hover:underline cursor-pointer font-medium"
                >
                  {filteredEmployees.every((e) => assignedEmployeeIds.includes(e.id))
                    ? 'Bỏ chọn hiển thị'
                    : 'Chọn tất cả hiển thị'}
                </button>
              )}
            </div>
          </div>

          {/* Scrollable employee list */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 pt-1 min-h-0">
            {filteredEmployees.length === 0 ? (
              <div className="py-10">
                <EmptyState
                  icon={<Users className="h-6 w-6 text-muted-foreground" />}
                  title={
                    employeeFilter === 'selected' && assignedEmployeeIds.length === 0
                      ? 'Chưa chọn nhân sự nào'
                      : 'Không tìm thấy nhân sự phù hợp'
                  }
                  description={
                    employeeFilter === 'selected' && assignedEmployeeIds.length === 0
                      ? 'Chuyển sang mục "Tất cả" hoặc tìm kiếm để tích chọn nhân sự phụ trách.'
                      : 'Hãy thử tìm với tên hoặc số điện thoại khác.'
                  }
                />
              </div>
            ) : (
              filteredEmployees.map((emp) => {
                const isChecked = assignedEmployeeIds.includes(emp.id)
                return (
                  <div
                    key={emp.id}
                    onClick={() => handleToggleEmployee(emp.id)}
                    className={cn(
                      'flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer select-none text-xs',
                      isChecked
                        ? 'bg-primary/5 border-primary/30 shadow-2xs'
                        : 'bg-background border-border/70 hover:bg-muted/40'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => handleToggleEmployee(emp.id)}
                          className="cursor-pointer shrink-0"
                          aria-label={`Chọn ${emp.name}`}
                        />
                      </div>
                      <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                        {getInitials(emp.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              'text-xs truncate',
                              isChecked ? 'text-primary font-semibold' : 'text-foreground font-medium'
                            )}
                          >
                            {emp.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            STAFF-{emp.id.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground truncate">
                          <span>{emp.position || emp.department}</span>
                          <span>•</span>
                          <span>{maskPhoneNumber(emp.phone)}</span>
                        </div>
                      </div>
                    </div>

                    {isChecked && (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-primary/10 text-primary border-primary/30 shrink-0 font-normal py-0 px-1.5"
                      >
                        Đã gán
                      </Badge>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <DialogFooter className="px-6 py-3 border-t border-border shrink-0 bg-muted/20 flex items-center justify-between sm:justify-between w-full">
        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-primary" />
          <span>
            Đã chọn:{' '}
            <strong className="text-foreground font-semibold">
              {assignedEmployeeIds.length}
            </strong>{' '}
            nhân sự đảm nhiệm
          </span>
        </div>
        <div className="flex items-center gap-2">
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
        </div>
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
      <DialogContent className="sm:max-w-[880px] w-[94vw] max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-3.5 border-b border-border shrink-0 bg-muted/10">
          <DialogTitle className="text-sm font-normal text-foreground flex items-center gap-1.5 flex-wrap">
            {mode === 'create' ? (
              <span className="font-normal text-foreground">Thêm mới chức danh</span>
            ) : (
              <>
                <span className="font-normal text-muted-foreground">Chỉnh sửa chức danh:</span>
                <span className="font-semibold text-foreground">{initialData?.name || ''}</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {mode === 'create'
              ? 'Thêm mới chức danh'
              : `Chỉnh sửa chức danh: ${initialData?.name || ''}`}
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
