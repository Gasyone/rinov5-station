'use client'

import { useState, useMemo } from 'react'
import { Check, Search, UserPlus, Users, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { InlineSelect } from '@/components/controls'
import { mockEmployees, type Employee } from '@/mocks/employees'
import type { BranchStaffMember } from './branchesTypes'
import { cn } from '@/lib/utils'

export const PRESET_ASSIGNMENT_ROLES = [
  { value: 'Quản lý điểm trường', label: 'Quản lý điểm trường' },
  { value: 'Giáo viên phụ trách', label: 'Giáo viên phụ trách' },
  { value: 'Tư vấn tuyển sinh (Sale)', label: 'Tư vấn tuyển sinh (Sale)' },
  { value: 'Chăm sóc khách hàng (CSM)', label: 'Chăm sóc khách hàng (CSM)' },
  { value: 'Lễ tân / Vận hành', label: 'Lễ tân / Vận hành' },
  { value: 'Trợ giảng', label: 'Trợ giảng' },
  { value: 'Hỗ trợ kỹ thuật', label: 'Hỗ trợ kỹ thuật' },
  { value: 'Nhân sự cắm chốt', label: 'Nhân sự cắm chốt' },
]

export function getDefaultRoleForEmployee(emp: Employee): string {
  if (emp.position?.includes('Giám đốc') || emp.position?.includes('Manager')) {
    return 'Quản lý điểm trường'
  }
  if (emp.position?.includes('Teacher') || emp.position?.includes('Giáo viên')) {
    return 'Giáo viên phụ trách'
  }
  if (emp.department?.includes('Sale') || emp.department?.includes('Tuyển sinh') || emp.position?.includes('Sale')) {
    return 'Tư vấn tuyển sinh (Sale)'
  }
  if (emp.department?.includes('Care') || emp.department?.includes('CSM') || emp.position?.includes('CS')) {
    return 'Chăm sóc khách hàng (CSM)'
  }
  if (emp.position?.includes('Reception') || emp.position?.includes('Lễ tân')) {
    return 'Lễ tân / Vận hành'
  }
  if (emp.position?.includes('Teaching Assistant') || emp.position?.includes('Trợ giảng')) {
    return 'Trợ giảng'
  }
  if (emp.department?.includes('IT') || emp.position?.includes('Support')) {
    return 'Hỗ trợ kỹ thuật'
  }
  return 'Nhân sự cắm chốt'
}

interface BranchAssignStaffDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  branchName: string
  currentStaffIds: string[]
  onAssign: (selectedMembers: BranchStaffMember[]) => void
}

export function BranchAssignStaffDialog({
  open,
  onOpenChange,
  branchName,
  currentStaffIds,
  onAssign,
}: BranchAssignStaffDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [assignedRoles, setAssignedRoles] = useState<Record<string, string>>({})

  // Danh sách nhân sự khả dụng (chưa gán vào cơ sở này)
  const availableEmployees = useMemo(() => {
    const assignedSet = new Set(currentStaffIds)
    return mockEmployees.filter((e) => !assignedSet.has(e.id) && e.status !== 'resigned')
  }, [currentStaffIds])

  // Danh sách phòng ban duy nhất để lọc
  const departmentOptions = useMemo(() => {
    const depts = Array.from(new Set(mockEmployees.map((e) => e.department).filter(Boolean)))
    return [
      { value: 'all', label: 'Tất cả phòng ban' },
      ...depts.map((d) => ({ value: d, label: d })),
    ]
  }, [])

  // Lọc theo từ khóa và phòng ban
  const filteredEmployees = useMemo(() => {
    return availableEmployees.filter((emp) => {
      const matchDept = departmentFilter === 'all' || emp.department === departmentFilter
      if (!matchDept) return false

      if (!searchTerm.trim()) return true
      const q = searchTerm.toLowerCase().trim()
      return (
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.phone.includes(q) ||
        emp.position.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q)
      )
    })
  }, [availableEmployees, departmentFilter, searchTerm])

  const handleToggleSelect = (emp: Employee) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(emp.id)) {
        next.delete(emp.id)
      } else {
        next.add(emp.id)
        // Set default role if not yet set
        if (!assignedRoles[emp.id]) {
          setAssignedRoles((r) => ({ ...r, [emp.id]: getDefaultRoleForEmployee(emp) }))
        }
      }
      return next
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set<string>()
      const newRoles = { ...assignedRoles }
      filteredEmployees.forEach((emp) => {
        allIds.add(emp.id)
        if (!newRoles[emp.id]) {
          newRoles[emp.id] = getDefaultRoleForEmployee(emp)
        }
      })
      setSelectedIds(allIds)
      setAssignedRoles(newRoles)
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleRoleChange = (empId: string, newRole: string) => {
    setAssignedRoles((prev) => ({ ...prev, [empId]: newRole }))
    // Tự động tích chọn nhân sự khi chỉnh sửa vai trò
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.add(empId)
      return next
    })
  }

  const handleConfirm = () => {
    const selectedMembers: BranchStaffMember[] = []
    selectedIds.forEach((empId) => {
      const emp = mockEmployees.find((e) => e.id === empId)
      if (emp) {
        selectedMembers.push({
          id: emp.id,
          name: emp.name,
          email: emp.email,
          phone: emp.phone,
          department: emp.department,
          position: emp.position,
          roleInBranch: assignedRoles[emp.id] || getDefaultRoleForEmployee(emp),
          contractType: emp.contractType,
          avatar: emp.avatar,
        })
      }
    })

    onAssign(selectedMembers)
    handleClose()
  }

  const handleClose = () => {
    setSelectedIds(new Set())
    setSearchTerm('')
    setDepartmentFilter('all')
    onOpenChange(false)
  }

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const isAllSelected =
    filteredEmployees.length > 0 &&
    filteredEmployees.every((emp) => selectedIds.has(emp.id))

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] sm:max-w-4xl md:max-w-5xl h-[82vh] max-h-[720px] min-h-[500px] flex flex-col p-0 overflow-hidden shadow-2xl">
        {/* Header Modal */}
        <DialogHeader className="px-4 py-3 border-b shrink-0 bg-background/95">
          <div className="flex items-center justify-between gap-3 pr-6">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <UserPlus className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-sm font-semibold text-foreground">
                  Gán nhân sự phụ trách cơ sở
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Chọn nhân sự từ hệ thống để phân công phụ trách tại{' '}
                  <span className="font-medium text-foreground">{branchName || 'cơ sở'}</span>
                </p>
              </div>
            </div>

            <div className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md border shrink-0">
              Khả dụng:{' '}
              <span className="font-semibold text-foreground">{availableEmployees.length}</span> nhân sự
            </div>
          </div>
        </DialogHeader>

        {/* Toolbar bộ lọc & tìm kiếm */}
        <div className="px-4 py-2.5 border-b shrink-0 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm theo họ tên, email, SĐT, chức vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-xs pl-8 pr-7 bg-background"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <InlineSelect
              value={departmentFilter}
              options={departmentOptions}
              onValueChange={setDepartmentFilter}
              ariaLabel="Lọc phòng ban"
              className="h-8 text-xs bg-background w-[180px] shrink-0"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs">
            <span className="text-muted-foreground">
              Hiển thị:{' '}
              <span className="font-medium text-foreground">{filteredEmployees.length}</span> nhân sự
            </span>
          </div>
        </div>

        {/* Table danh sách nhân sự: Cuộn nội bộ */}
        <div className="flex-1 min-h-0 overflow-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10 border-b bg-muted/80 backdrop-blur font-medium text-muted-foreground">
              <tr>
                <th className="py-2 px-3 text-center w-10">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                    aria-label="Chọn tất cả"
                  />
                </th>
                <th className="py-2 px-3">Nhân sự</th>
                <th className="py-2 px-3">Phòng ban & Chức danh</th>
                <th className="py-2 px-3">Số điện thoại</th>
                <th className="py-2 px-3">Vai trò phân công tại cơ sở</th>
                <th className="py-2 px-3 text-center">Hình thức</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => {
                  const isSelected = selectedIds.has(emp.id)
                  const currentRole = assignedRoles[emp.id] || getDefaultRoleForEmployee(emp)

                  return (
                    <tr
                      key={emp.id}
                      onClick={() => handleToggleSelect(emp)}
                      className={cn(
                        'cursor-pointer transition-colors hover:bg-muted/40',
                        isSelected ? 'bg-primary/5 hover:bg-primary/10' : ''
                      )}
                    >
                      {/* Checkbox */}
                      <td
                        className="py-2 px-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleSelect(emp)}
                          aria-label={`Chọn ${emp.name}`}
                        />
                      </td>

                      {/* Thông tin nhân sự */}
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-[11px] shrink-0 border border-primary/20">
                            {getInitials(emp.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-foreground truncate">{emp.name}</div>
                            <div className="text-[11px] text-muted-foreground font-mono truncate">
                              {emp.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phòng ban & Chức danh */}
                      <td className="py-2 px-3">
                        <div className="font-medium text-foreground">{emp.position}</div>
                        <div className="text-[11px] text-muted-foreground">{emp.department}</div>
                      </td>

                      {/* SĐT */}
                      <td className="py-2 px-3 font-mono text-[11px] text-muted-foreground">
                        {emp.phone}
                      </td>

                      {/* Vai trò phân công tại cơ sở */}
                      <td
                        className="py-2 px-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <InlineSelect
                          value={currentRole}
                          options={PRESET_ASSIGNMENT_ROLES}
                          onValueChange={(newRole) => handleRoleChange(emp.id, newRole)}
                          ariaLabel="Vai trò tại cơ sở"
                          className={cn(
                            'h-7 text-xs w-[190px]',
                            isSelected ? 'border-primary/50 font-medium' : 'bg-background'
                          )}
                        />
                      </td>

                      {/* Hình thức */}
                      <td className="py-2 px-3 text-center">
                        <span
                          className={cn(
                            'inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium border',
                            emp.contractType === 'Part-time'
                              ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                          )}
                        >
                          {emp.contractType || 'Full-time'}
                        </span>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="h-9 w-9 text-muted-foreground/40" />
                      <span className="text-xs font-medium text-foreground">
                        {searchTerm || departmentFilter !== 'all'
                          ? 'Không tìm thấy nhân sự nào phù hợp với bộ lọc.'
                          : 'Tất cả nhân sự trong hệ thống đều đã được gán vào cơ sở này.'}
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Modal */}
        <div className="px-4 py-2.5 border-t shrink-0 bg-background flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Đã chọn:</span>
            <span className="inline-flex items-center rounded-full px-2 py-0.5 font-semibold text-xs bg-primary/10 text-primary border border-primary/20">
              {selectedIds.size} nhân sự
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs cursor-pointer px-3"
              onClick={handleClose}
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-8 text-xs gap-1.5 cursor-pointer px-4"
              disabled={selectedIds.size === 0}
              onClick={handleConfirm}
            >
              <Check className="h-3.5 w-3.5" />
              <span>Xác nhận gán ({selectedIds.size})</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
