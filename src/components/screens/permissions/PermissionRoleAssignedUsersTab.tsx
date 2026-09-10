'use client'

import { useState } from 'react'
import {
  Users,
  Trash2,
  Phone,
  Mail,
  Briefcase,
  Copy,
  Check,
  UserPlus,
  Search,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ConfirmDialog, EmptyState } from '@/components/shared'
import { mockEmployees, type Employee } from '@/mocks/employees'
import type { PermissionRole } from './permissionsTypes'

interface PermissionRoleAssignedUsersTabProps {
  role?: PermissionRole | null
  assignedEmployees: Employee[]
  isAddDialogOpen: boolean
  setIsAddDialogOpen: (open: boolean) => void
  onAssignEmployee: (employee: Employee) => void
  onRemoveEmployee: (employeeId: string) => void
}

function maskPhoneNumber(phone?: string): string {
  if (!phone) return '—'
  if (phone.length <= 6) return phone
  return `${phone.slice(0, 3)}****${phone.slice(-3)}`
}

export function PermissionRoleAssignedUsersTab({
  role,
  assignedEmployees,
  isAddDialogOpen,
  setIsAddDialogOpen,
  onAssignEmployee,
  onRemoveEmployee,
}: PermissionRoleAssignedUsersTabProps) {
  const [addSearchQuery, setAddSearchQuery] = useState('')
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null)

  // Confirm delete dialog state
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [targetEmployee, setTargetEmployee] = useState<Employee | null>(null)

  // Danh sách nhân sự khả dụng chưa được gán
  const availableEmployees = mockEmployees
    .filter((e) => !assignedEmployees.some((a) => a.id === e.id) && e.status !== 'resigned')
    .filter((e) => {
      const q = addSearchQuery.trim().toLowerCase()
      if (!q) return true
      return (
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.phone.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q)
      )
    })

  const handleCopyPhone = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone)
    setCopiedPhone(id)
    toast.success(`Đã sao chép số điện thoại: ${phone}`)
    setTimeout(() => setCopiedPhone(null), 2000)
  }

  const handleOpenRemoveConfirm = (employee: Employee) => {
    setTargetEmployee(employee)
    setConfirmDeleteOpen(true)
  }

  const handleConfirmRemove = () => {
    if (targetEmployee) {
      onRemoveEmployee(targetEmployee.id)
      toast.success(`Đã gỡ nhân sự "${targetEmployee.name}" khỏi nhóm quyền`)
    }
    setConfirmDeleteOpen(false)
    setTargetEmployee(null)
  }

  const handleAddEmployee = (emp: Employee) => {
    onAssignEmployee(emp)
    toast.success(`Đã gán "${emp.name}" vào nhóm quyền`)
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Danh sách nhân sự (Bỏ search, bỏ thống kê, bỏ cột cơ sở, giảm bớt đường line) */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {assignedEmployees.length === 0 ? (
          <div className="py-12 px-4">
            <EmptyState
              icon={<Users className="h-8 w-8 text-muted-foreground/30" />}
              title="Chưa có nhân sự nào được gán"
              description='Bấm nút "+ Thêm nhân sự" ở góc trên bên phải để gán nhân viên vào nhóm quyền này.'
              action={{
                label: '+ Thêm nhân sự ngay',
                onClick: () => setIsAddDialogOpen(true),
              }}
            />
          </div>
        ) : (
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground font-semibold">
                <th className="py-2.5 px-3 font-bold text-xs uppercase tracking-wider">
                  Nhân sự
                </th>
                <th className="py-2.5 px-3 font-bold text-xs uppercase tracking-wider">
                  Vị trí / Chức danh
                </th>
                <th className="py-2.5 px-3 font-bold text-xs uppercase tracking-wider">
                  Phòng ban
                </th>
                <th className="py-2.5 px-3 font-bold text-xs uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="py-2.5 px-3 text-right font-bold text-xs uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {assignedEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-muted/30 transition-colors border-b border-border/20">
                  {/* Cột 1: Tên + Avatar */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                        {emp.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-foreground truncate">{emp.name}</span>
                    </div>
                  </td>

                  {/* Cột 2: Vị trí */}
                  <td className="py-2.5 px-3 text-foreground/80">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span>{emp.position}</span>
                    </div>
                  </td>

                  {/* Cột 3: Phòng ban */}
                  <td className="py-2.5 px-3 text-muted-foreground">
                    <span>{emp.department}</span>
                  </td>

                  {/* Cột 4: Email & SĐT (Masked 091****111) */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-3 text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-[160px]">{emp.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 shrink-0" />
                        <span className="font-mono">{maskPhoneNumber(emp.phone)}</span>
                        {emp.phone && (
                          <button
                            type="button"
                            onClick={() => handleCopyPhone(emp.phone, emp.id)}
                            className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded"
                            title="Sao chép số điện thoại"
                          >
                            {copiedPhone === emp.id ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Cột 5: Action */}
                  <td className="py-2.5 px-3 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleOpenRemoveConfirm(emp)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
                      title="Gỡ nhân sự khỏi nhóm quyền"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Dialog Thêm nhân sự vào nhóm quyền */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[480px] max-h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-border/50 bg-muted/20">
            <DialogTitle className="text-sm font-bold text-foreground">
              Thêm nhân sự vào nhóm &quot;{role?.name}&quot;
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Chọn nhân viên từ danh sách để gán vào nhóm quyền này
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 border-b border-border/50 bg-background">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                value={addSearchQuery}
                onChange={(e) => setAddSearchQuery(e.target.value)}
                placeholder="Tìm theo tên, email, chức danh..."
                className="h-8 pl-8 text-xs bg-muted/20"
                autoFocus
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[340px] p-2 space-y-1">
            {availableEmployees.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Không tìm thấy nhân sự phù hợp
              </div>
            ) : (
              availableEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                      {emp.name.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-xs text-foreground truncate">{emp.name}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {emp.position} • {emp.department}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => handleAddEmployee(emp)}
                    className="h-7 px-2 text-xs font-medium gap-1 text-primary hover:bg-primary hover:text-primary-foreground shrink-0"
                  >
                    <UserPlus className="h-3 w-3" />
                    <span>Gán</span>
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận gỡ nhân sự */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title={`Gỡ nhân sự "${targetEmployee?.name}"?`}
        description={`Hành động này sẽ thu hồi toàn bộ quyền hạn của nhóm "${role?.name}" đối với nhân sự này. Bạn có chắc chắn muốn tiếp tục?`}
        confirmLabel="Xác nhận gỡ"
        variant="destructive"
        onConfirm={handleConfirmRemove}
      />
    </div>
  )
}
