'use client'

import React from 'react'
import {
  Briefcase,
  UserPlus,
  Pencil,
  Trash2,
  Users,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  EntityCell,
  StatusBadge,
  EmptyState,
  AvatarStack,
} from '@/components/shared'
import { mockEmployees } from '@/mocks/employees'
import type { JobTitle } from './jobTitlesTypes'
import {
  mapEmployeesToAvatarStack,
  getHeadcountMetrics,
} from './jobTitlesHelpers'

interface JobTitlesTableProps {
  items: JobTitle[]
  onOpenAssignModal: (item: JobTitle) => void
  onEdit: (item: JobTitle) => void
  onDelete: (item: JobTitle) => void
}

const COLUMNS = [
  { label: 'Chức danh (Mã & Tên)', className: 'min-w-[220px]' },
  { label: 'Khối / Phòng ban', className: 'min-w-[160px]' },
  { label: 'Nhân sự đảm nhiệm (Gán)', className: 'min-w-[240px]' },
  { label: 'Định mức nhân sự', className: 'min-w-[170px]' },
  { label: 'Mô tả nhiệm vụ', className: 'min-w-[260px]' },
  { label: 'Trạng thái', className: 'min-w-[120px]' },
  { label: 'Thao tác', className: 'w-[120px] text-right' },
]

export const JobTitlesTable: React.FC<JobTitlesTableProps> = ({
  items,
  onOpenAssignModal,
  onEdit,
  onDelete,
}) => {
  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <EmptyState
          icon={<Briefcase className="h-8 w-8 text-muted-foreground" />}
          title="Không tìm thấy chức danh phù hợp"
          description="Hãy thử điều chỉnh bộ lọc phòng ban, định mức hoặc từ khóa tìm kiếm."
        />
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-auto">
      <Table containerClassName="min-w-full" className="min-w-[1100px]">
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {COLUMNS.map((col) => (
              <TableHead key={col.label} className={col.className}>
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const { items: avatarItems, employees } = mapEmployeesToAvatarStack(
              item.assignedEmployeeIds,
              mockEmployees
            )
            const metrics = getHeadcountMetrics(
              item.assignedEmployeeIds.length,
              item.targetHeadcount
            )

            return (
              <TableRow
                key={item.id}
                className="hover:bg-muted/30 transition-colors group"
              >
                {/* 1. Mã & Tên chức danh */}
                <TableCell>
                  <EntityCell
                    name={item.name}
                    supporting={`MÃ: ${item.code}`}
                    className="font-medium text-foreground"
                  />
                </TableCell>

                {/* 2. Khối / Phòng ban */}
                <TableCell>
                  <Badge variant="outline" className="text-xs font-normal bg-background">
                    {item.department}
                  </Badge>
                </TableCell>

                {/* 3. Cột Gán Nhân sự */}
                <TableCell>
                  <div
                    className="flex items-center gap-2 cursor-pointer p-1 -m-1 rounded-md hover:bg-accent/40 transition-colors"
                    onClick={() => onOpenAssignModal(item)}
                    title="Bấm để xem và phân bổ nhân sự"
                  >
                    {avatarItems.length > 0 ? (
                      <div className="flex items-center gap-2.5">
                        <AvatarStack items={avatarItems} maxVisible={3} size="sm" />
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-foreground flex items-center gap-1">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            {item.assignedEmployeeIds.length} nhân sự
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate max-w-[130px]">
                            {employees.slice(0, 2).map((e) => e.name).join(', ')}
                            {employees.length > 2 ? '...' : ''}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-dashed border-primary/40 text-primary text-xs font-medium hover:bg-primary/5 transition-colors cursor-pointer"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>+ Gán nhân sự</span>
                      </button>
                    )}
                  </div>
                </TableCell>

                {/* 4. Định mức nhân sự */}
                <TableCell>
                  <div className="flex flex-col gap-1 max-w-[150px]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">
                        {metrics.label} <span className="text-[11px] font-normal text-muted-foreground">người</span>
                      </span>
                      {metrics.isUnder ? (
                        <span className="flex items-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                          <AlertCircle className="h-2.5 w-2.5" />
                          Thiếu
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          Đạt
                        </span>
                      )}
                    </div>
                    {/* Mini capacity bar */}
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          metrics.isUnder ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(metrics.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </TableCell>

                {/* 5. Mô tả nhiệm vụ */}
                <TableCell>
                  <p
                    className="text-xs text-muted-foreground line-clamp-2 max-w-[300px]"
                    title={item.description}
                  >
                    {item.description || '—'}
                  </p>
                </TableCell>

                {/* 6. Trạng thái */}
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>

                {/* 7. Thao tác */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* Gán nhân sự nhanh */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-primary cursor-pointer"
                      onClick={() => onOpenAssignModal(item)}
                      title="Gán nhân sự cho chức danh này"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                    </Button>

                    {/* Sửa chức danh */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={() => onEdit(item)}
                      title="Chỉnh sửa thông tin chức danh"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>

                    {/* Xóa chức danh */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
                      onClick={() => onDelete(item)}
                      title="Xóa chức danh"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
