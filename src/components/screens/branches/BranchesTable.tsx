'use client'

import {
  Building2,
  DoorOpen,
  Eye,
  Lock,
  Pencil,
  Unlock,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { StatusBadge, EmptyState } from '@/components/shared'
import { cn } from '@/lib/utils'
import { getInitialStaffForBranch } from './branchesHelpers'
import type { Branch } from './branchesTypes'

interface BranchesTableProps {
  branches: Branch[]
  selectedIds?: string[]
  onToggleSelect?: (id: string) => void
  onToggleSelectAll?: (checked: boolean) => void
  onViewDetail: (branch: Branch, initialTab?: 'facilities' | 'staff') => void
  onEdit: (branch: Branch) => void
  onToggleStatus: (branch: Branch) => void
}

export function BranchesTable({
  branches,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  onViewDetail,
  onEdit,
  onToggleStatus,
}: BranchesTableProps) {
  if (branches.length === 0) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center p-8">
        <EmptyState
          icon={<Building2 className="h-10 w-10 text-muted-foreground" />}
          title="Không tìm thấy cơ sở nào"
          description="Thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt các tiêu chí lọc."
        />
      </div>
    )
  }

  const isAllSelected =
    branches.length > 0 && branches.every((b) => selectedIds.includes(b.id))

  return (
    <table className="w-full text-left text-xs border-collapse">
      <thead className="sticky top-0 z-10 border-b bg-muted/90 backdrop-blur font-medium text-muted-foreground shadow-2xs">
        <tr>
          <th className="py-2.5 px-4 font-semibold">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={(checked) => onToggleSelectAll?.(Boolean(checked))}
                aria-label="Chọn tất cả cơ sở"
                className="cursor-pointer"
              />
              <span>Cơ sở / Chi nhánh</span>
            </div>
          </th>
          <th className="py-2.5 px-3 font-semibold">Khu vực & Địa chỉ</th>
          <th className="py-2.5 px-3 font-semibold text-center">Phòng & Sức chứa</th>
          <th className="py-2.5 px-3 font-semibold">Nhân sự đang được gán</th>
          <th className="py-2.5 px-3 font-semibold text-center">Trạng thái</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border/60">
        {branches.map((branch) => {
          const isSelected = selectedIds.includes(branch.id)
          const staff = getInitialStaffForBranch(branch)

          return (
            <tr
              key={branch.id}
              className={cn(
                'group transition-colors cursor-pointer',
                isSelected ? 'bg-muted/50 hover:bg-muted/60' : 'hover:bg-muted/30'
              )}
              onClick={() => onViewDetail(branch)}
            >
              {/* Cột 1: Checkbox + Tên cơ sở & Mã ở dưới + Thao tác icon ở cạnh phải dòng */}
              <td className="py-2.5 px-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelect?.(branch.id)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Chọn cơ sở ${branch.name}`}
                      className="cursor-pointer shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-foreground hover:underline truncate">
                        {branch.name}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {branch.code}
                      </span>
                    </div>
                  </div>

                  {/* Thao tác icons nằm ở phía phải dòng cột cơ sở/chi nhánh, hiện khi hover */}
                  <div
                    className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                      title="Xem chi tiết cơ sở"
                      onClick={() => onViewDetail(branch)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span className="sr-only">Xem chi tiết</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                      title="Chỉnh sửa thông tin"
                      onClick={() => onEdit(branch)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="sr-only">Chỉnh sửa</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'h-7 w-7 cursor-pointer',
                        branch.status === 'active'
                          ? 'text-muted-foreground hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                          : 'text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                      )}
                      title={
                        branch.status === 'active'
                          ? 'Tạm dừng hoạt động cơ sở'
                          : 'Kích hoạt hoạt động'
                      }
                      onClick={() => onToggleStatus(branch)}
                    >
                      {branch.status === 'active' ? (
                        <Lock className="h-3.5 w-3.5" />
                      ) : (
                        <Unlock className="h-3.5 w-3.5" />
                      )}
                      <span className="sr-only">
                        {branch.status === 'active' ? 'Tạm dừng cơ sở' : 'Kích hoạt'}
                      </span>
                    </Button>
                  </div>
                </div>
              </td>

              {/* Khu vực & Địa chỉ */}
              <td className="py-2.5 px-3 max-w-[220px]">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-foreground">{branch.region}</span>
                  <span
                    className="text-[11px] text-muted-foreground truncate"
                    title={branch.address}
                  >
                    {branch.address}
                  </span>
                </div>
              </td>

              {/* Phòng học & Sức chứa */}
              <td className="py-2.5 px-3 text-center">
                <div className="inline-flex flex-col items-center">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <DoorOpen className="h-3.5 w-3.5 text-primary" />
                    <span>{branch.roomCount} phòng</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>Tối đa {branch.totalCapacity} HV</span>
                  </div>
                </div>
              </td>

              {/* Nhân sự đang được gán */}
              <td
                className="py-2.5 px-3 max-w-[240px]"
                onClick={(e) => {
                  e.stopPropagation()
                  onViewDetail(branch, 'staff')
                }}
              >
                <div className="flex flex-col gap-0.5">
                  {/* Dòng 1: Số nhân sự */}
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <Users className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>
                      {staff.length > 0 ? `${staff.length} nhân sự` : 'Chưa phân công'}
                    </span>
                  </div>

                  {/* Dòng 2: Danh sách nhân sự, ... nếu nhiều, click vào mở modal detail */}
                  <div
                    className={cn(
                      'text-[11px] truncate transition-colors cursor-pointer',
                      staff.length > 0
                        ? 'text-muted-foreground hover:text-primary hover:underline'
                        : 'text-muted-foreground/60 italic'
                    )}
                    title={
                      staff.length > 0
                        ? `Nhân sự phụ trách: ${staff.map((s) => s.name).join(', ')} (Click để mở chi tiết)`
                        : 'Chưa có nhân sự gán vào cơ sở này'
                    }
                  >
                    {staff.length > 0 ? (
                      <>
                        <span>{staff.slice(0, 2).map((s) => s.name).join(', ')}</span>
                        {staff.length > 2 && (
                          <span className="text-muted-foreground font-semibold">, ...</span>
                        )}
                      </>
                    ) : (
                      '—'
                    )}
                  </div>
                </div>
              </td>

              {/* Trạng thái */}
              <td className="py-2.5 px-3 text-center">
                <StatusBadge status={branch.status} label={branch.statusLabel} />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
