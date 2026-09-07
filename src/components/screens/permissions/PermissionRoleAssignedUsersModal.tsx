'use client'

import { useState, useMemo } from 'react'
import {
  Users,
  Mail,
  Phone,
  Briefcase,
  ShieldCheck,
  Copy,
  Check,
  Trash2,
  UserPlus,
  Search,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ConfirmDialog, EmptyState } from '@/components/shared'
import { getAssignedEmployeesForRole } from './permissionsHelpers'
import { mockEmployees, type Employee } from '@/mocks/employees'
import type { PermissionRole } from './permissionsTypes'

interface PermissionRoleAssignedUsersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: PermissionRole | null
  topicName?: string
  onCountChange?: (newCount: number) => void
}

function maskPhoneNumber(phone?: string): string {
  if (!phone) return '—'
  if (phone.length <= 6) return phone
  return `${phone.slice(0, 3)}****${phone.slice(-3)}`
}

export function PermissionRoleAssignedUsersModal({
  open,
  onOpenChange,
  role,
  topicName,
  onCountChange,
}: PermissionRoleAssignedUsersModalProps) {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null)
  const [employees, setEmployees] = useState<Employee[]>(() =>
    role ? getAssignedEmployeesForRole(role) : []
  )
  const [prevRole, setPrevRole] = useState(role)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [addSearchQuery, setAddSearchQuery] = useState('')
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [employeeToRemove, setEmployeeToRemove] = useState<Employee | null>(null)

  // Đồng bộ danh sách nhân sự khi đổi role
  if (role !== prevRole) {
    setPrevRole(role)
    const initialList = role ? getAssignedEmployeesForRole(role) : []
    setEmployees(initialList)
    setIsAddingUser(false)
    setSearchQuery('')
    setAddSearchQuery('')
    onCountChange?.(initialList.length)
  }

  // Danh sách nhân sự chưa được gán vào nhóm quyền (chỉ lấy nhân sự đang làm việc / thử việc)
  const availableEmployees = useMemo(() => {
    const assignedIds = new Set(employees.map((e) => e.id))
    const q = addSearchQuery.trim().toLowerCase()
    return mockEmployees
      .filter((e) => !assignedIds.has(e.id) && e.status !== 'resigned')
      .filter((e) => {
        if (!q) return true
        return (
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.phone.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.position.toLowerCase().includes(q)
        )
      })
  }, [employees, addSearchQuery])

  // Lọc danh sách nhân sự hiện tại theo ô tìm kiếm
  const filteredEmployees = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return employees
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.phone.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q)
    )
  }, [employees, searchQuery])

  const handleCopyPhone = (phone?: string) => {
    if (!phone) return
    navigator.clipboard.writeText(phone)
    setCopiedPhone(phone)
    toast.success(`Đã sao chép số điện thoại: ${phone}`)
    setTimeout(() => {
      setCopiedPhone((prev) => (prev === phone ? null : prev))
    }, 2000)
  }

  // Thêm nhân sự vào nhóm
  const handleAddEmployee = (emp: Employee) => {
    const nextList = [emp, ...employees]
    setEmployees(nextList)
    onCountChange?.(nextList.length)
    toast.success(`Đã thêm nhân sự ${emp.name} vào nhóm quyền`)
    setAddSearchQuery('')
  }

  // Yêu cầu xóa nhân sự khỏi nhóm
  const handleRequestRemove = (emp: Employee) => {
    setEmployeeToRemove(emp)
    setDeleteConfirmOpen(true)
  }

  // Xác nhận xóa nhân sự
  const handleConfirmRemove = () => {
    if (!employeeToRemove) return
    const nextList = employees.filter((e) => e.id !== employeeToRemove.id)
    setEmployees(nextList)
    onCountChange?.(nextList.length)
    toast.success(`Đã xóa nhân sự ${employeeToRemove.name} khỏi nhóm quyền`)
    setDeleteConfirmOpen(false)
    setEmployeeToRemove(null)
  }

  if (!role && !open) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px] max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header tinh gọn */}
        <DialogHeader className="px-5 pt-4 pb-3 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2.5 pr-6">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Users className="h-4 w-4" />
            </div>
            <div className="space-y-0.5 text-left min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="text-sm font-bold text-foreground">
                  Nhân sự được phân quyền
                </DialogTitle>
                <span className="px-2 py-0.2 text-[10.5px] font-bold rounded-md bg-primary/10 text-primary">
                  {employees.length} nhân sự
                </span>
              </div>
              <DialogDescription className="text-xs text-muted-foreground truncate">
                Nhóm quyền:{' '}
                <span className="font-semibold text-foreground">
                  {role?.name || 'Chưa đặt tên'}
                </span>
                {topicName && (
                  <span className="ml-1.5 inline-flex items-center gap-1 text-[10.5px] bg-muted px-1.5 py-0.2 rounded border border-border/60">
                    <ShieldCheck className="h-3 w-3 text-muted-foreground" />
                    {topicName}
                  </span>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Toolbar: Tìm kiếm & Nút Thêm nhân sự */}
        <div className="px-5 py-2.5 bg-muted/10 border-b border-border/60 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, email, sđt..."
              className="h-8 pl-8 pr-3 text-xs bg-background"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <Button
            type="button"
            size="sm"
            onClick={() => setIsAddingUser((prev) => !prev)}
            className="h-8 px-3 text-xs font-semibold gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>{isAddingUser ? 'Đóng thêm nhân sự' : 'Thêm nhân sự'}</span>
          </Button>
        </div>

        {/* Khung Thêm nhân sự mới (Hiển thị khi click Thêm nhân sự) */}
        {isAddingUser && (
          <div className="p-3.5 bg-primary/5 border-b border-border/80 space-y-2.5 transition-all">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-foreground">
                Chọn nhân sự để gán vào nhóm quyền:
              </span>
              <span className="text-[11px] text-muted-foreground">
                ({availableEmployees.length} nhân sự có thể thêm)
              </span>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={addSearchQuery}
                onChange={(e) => setAddSearchQuery(e.target.value)}
                placeholder="Gõ tên, chức danh hoặc phòng ban để lọc..."
                className="h-8 pl-8 pr-3 text-xs bg-background"
                autoFocus
              />
            </div>

            <div className="max-h-40 overflow-y-auto divide-y divide-border/50 border border-border/70 rounded-md bg-background">
              {availableEmployees.length === 0 ? (
                <div className="py-4 text-center text-xs text-muted-foreground">
                  Không tìm thấy nhân sự khả dụng phù hợp
                </div>
              ) : (
                availableEmployees.slice(0, 15).map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between gap-3 p-2 hover:bg-muted/40 transition-colors cursor-pointer"
                    onClick={() => handleAddEmployee(emp)}
                  >
                    <div className="min-w-0 flex items-center gap-2.5">
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                        {emp.name.split(' ').slice(-1)[0]?.[0] || 'U'}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-foreground truncate block">
                          {emp.name}
                        </span>
                        <span className="text-[10.5px] text-muted-foreground truncate block">
                          {emp.position} • {emp.department} • {emp.branch}
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-[11px] font-semibold text-primary border-primary/30 hover:bg-primary hover:text-white shrink-0 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddEmployee(emp)
                      }}
                    >
                      + Gán quyền
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Danh sách nhân sự hiện tại (Đã bỏ nhãn trạng thái đã nghỉ việc/đang làm việc) */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[480px]">
          {filteredEmployees.length === 0 ? (
            <div className="py-8">
              <EmptyState
                title={searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có nhân sự'}
                description={
                  searchQuery
                    ? `Không tìm thấy nhân sự nào khớp với "${searchQuery}".`
                    : 'Nhóm quyền này hiện chưa được phân bổ cho nhân sự nào.'
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-border/50 rounded-lg border border-border/60 bg-card overflow-hidden">
              {filteredEmployees.map((emp) => {
                const initials = emp.name
                  .split(' ')
                  .slice(-2)
                  .map((w) => w[0])
                  .join('')
                  .toUpperCase()

                const isCopied = copiedPhone === emp.phone

                return (
                  <div
                    key={emp.id}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 hover:bg-muted/30 transition-colors"
                  >
                    {/* Cột trái: Định danh nhân sự (ĐÃ XÓA TRẠNG THÁI ĐANG LÀM VIỆC / ĐÃ NGHỈ VIỆC) */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                        {initials}
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-foreground">
                            {emp.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
                          <span className="inline-flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground/70" />
                            {emp.email}
                          </span>

                          {emp.phone && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCopyPhone(emp.phone)
                              }}
                              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors group/phone select-text"
                              title="Bấm để sao chép số điện thoại đầy đủ"
                            >
                              <Phone className="h-3 w-3 text-muted-foreground/70" />
                              <span className="font-mono text-[11px]">{maskPhoneNumber(emp.phone)}</span>
                              {isCopied ? (
                                <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                              ) : (
                                <Copy className="h-2.5 w-2.5 opacity-60 group-hover/phone:opacity-100 shrink-0" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Cột phải: Chức danh, Phòng ban & Nút Bớt user rõ ràng */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-1.5 sm:pt-0 border-border/30">
                      <div className="flex flex-col sm:items-end gap-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                          <Briefcase className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span>{emp.position}</span>
                          <span className="text-muted-foreground font-normal">
                            • {emp.department}
                          </span>
                        </div>

                        {emp.secondaryPosition && (
                          <span className="text-[10px] text-muted-foreground italic">
                            Kiêm nhiệm: {emp.secondaryPosition}
                          </span>
                        )}
                      </div>

                      {/* Nút Bớt user - Hiển thị trực quan rõ ràng */}
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRequestRemove(emp)
                        }}
                        className="h-7 w-7 p-0 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer shrink-0"
                        title={`Gỡ ${emp.name} khỏi nhóm quyền`}
                        aria-label={`Gỡ ${emp.name} khỏi nhóm quyền`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Hộp thoại xác nhận gỡ nhân sự */}
        <ConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          title="Xác nhận gỡ nhân sự khỏi nhóm quyền"
          description={
            <span>
              Bạn có chắc chắn muốn gỡ nhân sự{' '}
              <strong className="text-foreground">{employeeToRemove?.name}</strong> khỏi nhóm quyền{' '}
              <strong className="text-foreground">[{role?.name || 'Nhóm quyền'}]</strong> không? Sau khi gỡ, nhân sự này sẽ không còn các quyền thao tác thuộc nhóm này.
            </span>
          }
          confirmLabel="Xóa khỏi nhóm"
          cancelLabel="Hủy"
          variant="destructive"
          onConfirm={handleConfirmRemove}
        />
      </DialogContent>
    </Dialog>
  )
}
