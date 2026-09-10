'use client'

import React from 'react'
import {
  Briefcase,
  UserPlus,
  Pencil,
  Trash2,
  Users,
  Network,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge, EmptyState } from '@/components/shared'
import { cn } from '@/lib/utils'
import { mockEmployees } from '@/mocks/employees'
import type { JobTitle } from './jobTitlesTypes'
import { getAssignedEmployees } from './jobTitlesHelpers'

interface JobTitlesTableProps {
  items: JobTitle[]
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  onEdit: (item: JobTitle) => void
  onDelete: (item: JobTitle) => void
}

export const JobTitlesTable: React.FC<JobTitlesTableProps> = ({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
}) => {
  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <EmptyState
          icon={<Briefcase className="h-8 w-8 text-muted-foreground" />}
          title="Không tìm thấy chức danh phù hợp"
          description="Hãy thử điều chỉnh bộ lọc phòng ban hoặc từ khóa tìm kiếm."
        />
      </div>
    )
  }

  const isAllSelected = items.length > 0 && items.every((i) => selectedIds.has(i.id))
  const isSomeSelected = items.some((i) => selectedIds.has(i.id)) && !isAllSelected

  return (
    <Table containerClassName="w-full min-h-full" className="min-w-[950px]">
      <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur-xs shadow-2xs">
        <TableRow className="border-b border-border hover:bg-transparent">
          {/* 1. Cột Chức danh có Checkbox chọn tất cả */}
          <TableHead className="min-w-[320px]">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={isAllSelected ? true : isSomeSelected ? 'indeterminate' : false}
                onCheckedChange={onToggleSelectAll}
                aria-label="Chọn tất cả chức danh"
                className="cursor-pointer"
              />
              <span className="font-semibold text-foreground">Chức danh</span>
            </div>
          </TableHead>

          {/* 2. Khối / Phòng ban */}
          <TableHead className="min-w-[160px]">Khối / Phòng ban</TableHead>

          {/* 3. Nhân sự đảm nhiệm */}
          <TableHead className="min-w-[260px]">Nhân sự đảm nhiệm</TableHead>

          {/* 4. Mô tả nhiệm vụ */}
          <TableHead className="min-w-[260px] max-w-[380px]">Mô tả nhiệm vụ</TableHead>

          {/* 5. Trạng thái */}
          <TableHead className="min-w-[120px]">Trạng thái</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {items.map((item) => {
          const isSelected = selectedIds.has(item.id)
          const assignedStaff = getAssignedEmployees(item.assignedEmployeeIds, mockEmployees)
          const staffCount = item.assignedEmployeeIds.length
          const staffPreview = assignedStaff
            .slice(0, 3)
            .map((e) => e.name)
            .join(', ')

          return (
            <TableRow
              key={item.id}
              className={cn(
                'transition-colors border-b border-border/60 hover:bg-muted/30 group',
                isSelected && 'bg-muted/40'
              )}
            >
                {/* 1. CỘT CHỨC DANH: Checkbox + Tên chức danh + Mã chức danh ở dưới + Nút Thao tác ở cạnh phải */}
                <TableCell>
                  <div className="flex items-center justify-between w-full gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelect(item.id)}
                        aria-label={`Chọn chức danh ${item.name}`}
                        className="cursor-pointer shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span
                          className="font-medium text-sm text-foreground truncate cursor-pointer hover:underline"
                          onClick={() => onEdit(item)}
                          title={`Bấm để chỉnh sửa ${item.name}`}
                        >
                          {item.name}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {item.code}
                        </span>
                      </div>
                    </div>

                    {/* CÁC NÚT THAO TÁC NẰM Ở CẠNH PHẢI DÒNG CỘT CHỨC DANH */}
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      {/* Nút Sửa (Mở Modal 2 panel chi tiết & nhân sự) */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(item)
                        }}
                        title="Chỉnh sửa thông tin & nhân sự chức danh"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>

                      {/* Nút Xóa */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(item)
                        }}
                        title="Xóa chức danh"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </TableCell>

                {/* 2. KHỐI / PHÒNG BAN */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-xs font-normal bg-muted/30 text-foreground gap-1.5 py-1 border-border/80 inline-flex items-center"
                    title={item.department}
                  >
                    <Network className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate max-w-[220px]">{item.department}</span>
                  </Badge>
                </TableCell>

                {/* 3. NHÂN SỰ ĐẢM NHIỆM: Danh sách nhân sự ở dưới, không có ngoặc */}
                <TableCell>
                  <div
                    className="flex flex-col cursor-pointer p-1 -m-1 rounded-md hover:bg-accent/40 transition-colors max-w-[280px]"
                    onClick={() => onEdit(item)}
                    title="Bấm để xem và quản lý nhân sự đảm nhiệm"
                  >
                    {staffCount > 0 ? (
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                          <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span>{staffCount} nhân sự</span>
                        </div>
                        <span className="text-xs text-muted-foreground truncate line-clamp-1 max-w-[260px]">
                          {staffPreview}{staffCount > 3 ? ', ...' : ''}
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(item)
                        }}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-dashed border-primary/40 text-primary text-xs font-medium hover:bg-primary/5 transition-colors cursor-pointer w-fit"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>+ Gán nhân sự</span>
                      </button>
                    )}
                  </div>
                </TableCell>

                {/* 4. MÔ TẢ NHIỆM VỤ */}
                <TableCell className="whitespace-normal max-w-[380px]">
                  <p
                    className="text-xs text-muted-foreground line-clamp-2 break-words leading-relaxed"
                    title={item.description}
                  >
                    {item.description || '—'}
                  </p>
                </TableCell>

                {/* 5. TRẠNG THÁI (ÁP DỤNG / TẠM NGƯNG) */}
                <TableCell>
                  <StatusBadge
                    status={item.status}
                    label={item.status === 'active' ? 'Áp dụng' : 'Tạm ngưng'}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }
