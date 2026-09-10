'use client'

import { useState, useMemo } from 'react'
import { Plus, Trash2, Search, Users, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InlineSelect } from '@/components/controls'
import type { BranchStaffMember } from './branchesTypes'
import { BranchAssignStaffDialog, PRESET_ASSIGNMENT_ROLES } from './BranchAssignStaffDialog'
import { cn } from '@/lib/utils'

interface BranchStaffTabProps {
  staff: BranchStaffMember[]
  branchName?: string
  isEditable?: boolean
  searchQuery?: string
  onAddStaff: (member: BranchStaffMember) => void
  onRemoveStaff: (memberId: string) => void
  onUpdateRole?: (memberId: string, newRole: string) => void
  onOpenAssignModal?: () => void
}

export function BranchStaffTab({
  staff,
  branchName = 'cơ sở',
  isEditable = true,
  searchQuery: externalSearchQuery,
  onAddStaff,
  onRemoveStaff,
  onUpdateRole,
  onOpenAssignModal,
}: BranchStaffTabProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState('')
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)

  const activeSearchQuery =
    externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery

  // Filtered staff for display
  const displayedStaff = useMemo(() => {
    if (!activeSearchQuery.trim()) return staff
    const q = activeSearchQuery.toLowerCase().trim()
    return staff.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.position.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        (s.roleInBranch && s.roleInBranch.toLowerCase().includes(q))
    )
  }, [staff, activeSearchQuery])

  const getRoleBadgeClass = (role?: string) => {
    if (!role) return 'bg-muted text-muted-foreground border-border'
    if (role.includes('Quản lý')) {
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
    }
    if (role.includes('Giáo viên')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
    }
    if (role.includes('Tuyển sinh') || role.includes('Sale')) {
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
    }
    if (role.includes('Chăm sóc') || role.includes('CSM')) {
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
    }
    if (role.includes('Lễ tân') || role.includes('Vận hành')) {
      return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800'
    }
    return 'bg-secondary text-secondary-foreground border-border'
  }

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const handleAssignBatch = (newMembers: BranchStaffMember[]) => {
    newMembers.forEach((member) => onAddStaff(member))
  }

  const handleTriggerAssignModal = () => {
    if (onOpenAssignModal) {
      onOpenAssignModal()
    } else {
      setIsAssignModalOpen(true)
    }
  }

  return (
    <div className="h-full min-h-0 flex flex-col rounded-lg border border-border/70 bg-card shadow-2xs overflow-hidden">
      {/* Card Header: Tiêu đề section + Thanh công cụ tìm kiếm và gán nhân sự */}
      <div className="shrink-0 px-3.5 py-2.5 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between bg-muted/20 gap-2">
        <span className="text-xs font-semibold text-foreground">
          Nhân sự phụ trách tại cơ sở ({staff.length})
        </span>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative w-40 sm:w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm nhân sự..."
              value={internalSearchQuery}
              onChange={(e) => setInternalSearchQuery(e.target.value)}
              className="h-7 text-xs pl-8 pr-2 bg-background"
            />
          </div>

          {isEditable && (
            <Button
              type="button"
              size="sm"
              className="h-7 text-xs gap-1.5 cursor-pointer px-2.5 shrink-0"
              onClick={handleTriggerAssignModal}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Gán nhân sự</span>
            </Button>
          )}
        </div>
      </div>

      {/* Staff Table: Bảng cuộn nội bộ bên trong khung section */}
      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 border-b border-border/50 bg-muted/40 font-medium text-muted-foreground">
            <tr>
              <th className="py-2 px-2.5">Nhân sự</th>
              <th className="py-2 px-2.5">Phòng ban & Chức danh</th>
              <th className="py-2 px-2.5">Số điện thoại</th>
              <th className="py-2 px-2.5">Vai trò tại cơ sở</th>
              <th className="py-2 px-2.5 text-center">Hình thức</th>
              {isEditable && <th className="py-2 px-1 text-center w-8"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {displayedStaff.length > 0 ? (
              displayedStaff.map((member) => (
                <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                  {/* Personnel Info */}
                  <td className="py-2 px-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-[10px] shrink-0 border border-primary/20">
                        {getInitials(member.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground truncate">{member.name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono truncate">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Department & Position */}
                  <td className="py-2 px-2.5">
                    <div className="font-medium text-foreground">{member.position}</div>
                    <div className="text-[10px] text-muted-foreground">{member.department}</div>
                  </td>

                  {/* Phone Number */}
                  <td className="py-2 px-2.5 font-mono text-[11px] text-muted-foreground">
                    {member.phone}
                  </td>

                  {/* Role in Branch */}
                  <td className="py-2 px-2.5">
                    {isEditable && onUpdateRole ? (
                      <div className="flex items-center gap-1">
                        <InlineSelect
                          value={member.roleInBranch || 'Nhân sự cắm chốt'}
                          options={PRESET_ASSIGNMENT_ROLES}
                          onValueChange={(val) => onUpdateRole(member.id, val)}
                          ariaLabel="Vai trò tại cơ sở"
                          className="h-6 text-[11px] w-[140px]"
                        />
                      </div>
                    ) : (
                      <span
                        className={cn(
                          'inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium border',
                          getRoleBadgeClass(member.roleInBranch)
                        )}
                      >
                        {member.roleInBranch || 'Nhân sự cắm chốt'}
                      </span>
                    )}
                  </td>

                  {/* Contract Type */}
                  <td className="py-2 px-2.5 text-center">
                    <span className="text-[10px] text-muted-foreground">
                      {member.contractType || 'Full-time'}
                    </span>
                  </td>

                  {/* Actions */}
                  {isEditable && (
                    <td className="py-2 px-1 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive cursor-pointer"
                        title="Hủy gán khỏi cơ sở"
                        onClick={() => onRemoveStaff(member.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Xóa</span>
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={isEditable ? 6 : 5}
                  className="py-12 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <Users className="h-8 w-8 text-muted-foreground/40" />
                    <span className="text-xs font-medium text-foreground">
                      {activeSearchQuery
                        ? 'Không tìm thấy nhân sự phù hợp với từ khóa.'
                        : 'Chưa có nhân sự nào được phân công tại cơ sở này.'}
                    </span>
                    {isEditable && !activeSearchQuery && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-1 h-7 text-xs gap-1.5 cursor-pointer"
                        onClick={handleTriggerAssignModal}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Gán nhân sự ngay</span>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal danh sách nhân sự để gán vào cơ sở */}
      <BranchAssignStaffDialog
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        branchName={branchName}
        currentStaffIds={staff.map((s) => s.id)}
        onAssign={handleAssignBatch}
      />
    </div>
  )
}
