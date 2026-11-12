'use client'

import { Building2, MapPin, Cake, UserCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  EmptyState,
  AppAvatar,
  ContactCell,
} from '@/components/shared'
import type { Employee } from '@/mocks/employees'
import { getBirthdayInfo } from './employeesHelpers'

interface EmployeesTableProps {
  employees: Employee[]
  selectedIds?: Set<string>
  onToggleAll?: (checked: boolean) => void
  onToggleOne?: (id: string, checked: boolean) => void
  onRowClick: (employee: Employee) => void
}

const COLUMNS: Array<{ label: string; className?: string }> = [
  { label: 'Cán bộ nhân viên', className: 'min-w-[220px]' },
  { label: 'Phòng ban', className: 'min-w-[150px]' },
  { label: 'Cơ sở công tác', className: 'min-w-[190px]' },
  { label: 'Liên hệ công vụ', className: 'min-w-[190px]' },
  { label: 'Địa chỉ cư trú', className: 'min-w-[200px]' },
  { label: 'Ngày sinh & Sinh nhật', className: 'min-w-[180px]' },
  { label: 'Ghi chú công tác', className: 'min-w-[160px]' },
]

export function EmployeesTable({
  employees,
  selectedIds = new Set(),
  onToggleAll,
  onToggleOne,
  onRowClick,
}: EmployeesTableProps) {
  if (employees.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <EmptyState
          icon={<UserCheck className="h-7 w-7 text-muted-foreground" />}
          title="Không tìm thấy nhân sự phù hợp"
          description="Vui lòng thử điều chỉnh lại phòng ban, cơ sở hoặc từ khóa tìm kiếm."
        />
      </div>
    )
  }

  const isAllSelected = employees.length > 0 && employees.every((e) => selectedIds.has(e.id))

  return (
    <Table containerClassName="min-w-full" className="min-w-[1100px] text-xs">
      <TableHeader>
        <TableRow className="bg-muted/60 hover:bg-muted/60 [&>th]:h-8 [&>th]:py-1 [&>th]:text-xs [&>th]:font-normal">
          {/* Checkbox chọn tất cả */}
          <TableHead className="w-9 min-w-9 max-w-9 text-center px-2">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={(checked) => onToggleAll?.(Boolean(checked))}
              className="h-3.5 w-3.5 translate-y-[1px]"
              aria-label="Chọn tất cả nhân sự"
            />
          </TableHead>
          {COLUMNS.map((col) => (
            <TableHead key={col.label} className={col.className}>
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((emp) => {
          const isSelected = selectedIds.has(emp.id)
          const bday = getBirthdayInfo(emp.dob)

          return (
            <TableRow
              key={emp.id}
              className={`cursor-pointer transition-colors ${
                isSelected ? 'bg-sky-50 dark:bg-sky-950/40' : 'hover:bg-muted/40'
              }`}
              onClick={() => onRowClick(emp)}
            >
              {/* Checkbox chọn dòng */}
              <TableCell
                className="w-9 min-w-9 max-w-9 text-center py-2.5 px-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => onToggleOne?.(emp.id, Boolean(checked))}
                  className="h-3.5 w-3.5 translate-y-[1px]"
                  aria-label={`Chọn ${emp.name}`}
                />
              </TableCell>

              {/* 1. Cán bộ nhân viên: Tên + Vị trí/Chức danh đặt ngay dưới tên */}
              <TableCell className="py-2.5">
                <div className="flex items-center gap-2.5">
                  <AppAvatar
                    name={emp.name}
                    size="sm"
                    shape="circle"
                    userId={emp.id}
                    userType="teacher"
                    className="shrink-0"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-semibold text-xs text-foreground truncate leading-tight">
                      {emp.name}
                    </p>
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-medium text-sky-700 dark:text-sky-300 truncate">
                        {emp.position}
                      </p>
                      {emp.secondaryPosition && (
                        <p className="text-[10px] text-muted-foreground italic truncate">
                          Kiêm: {emp.secondaryPosition}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* 2. Phòng ban */}
              <TableCell className="py-2.5">
                <div className="flex items-center gap-1.5 text-xs text-foreground">
                  <Building2 className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                  <span className="truncate">{emp.department}</span>
                </div>
              </TableCell>

              {/* 3. Cơ sở công tác */}
              <TableCell className="py-2.5">
                <div className="space-y-1 max-w-[210px]">
                  <div className="flex items-center gap-1 text-xs text-foreground">
                    <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="truncate font-medium">{emp.branch}</span>
                  </div>
                  {emp.branches && emp.branches.length > 1 && (
                    <div className="flex flex-wrap gap-1">
                      {emp.branches
                        .filter((b) => b !== emp.branch)
                        .map((b) => (
                          <span
                            key={b}
                            className="inline-flex text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border/60 text-muted-foreground truncate"
                          >
                            + {b}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </TableCell>

              {/* 4. Liên hệ công vụ */}
              <TableCell className="py-2.5" onClick={(e) => e.stopPropagation()}>
                <ContactCell
                  phone={emp.phone}
                  email={emp.email}
                  masked={true}
                  nameClassName="text-xs"
                  phoneClassName="text-xs font-mono font-medium text-foreground"
                />
              </TableCell>

              {/* 5. Địa chỉ cư trú */}
              <TableCell className="py-2.5">
                <div className="flex items-center gap-1.5 text-muted-foreground max-w-[200px]">
                  <MapPin className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                  <span className="truncate text-xs" title={emp.address}>
                    {emp.address || 'Chưa cập nhật'}
                  </span>
                </div>
              </TableCell>

              {/* 6. Ngày sinh & Sinh nhật nội bộ */}
              <TableCell className="py-2.5">
                {bday ? (
                  <div className="space-y-1">
                    <div className="text-xs text-foreground font-normal">
                      <span>{bday.fullDob}</span>
                      {bday.age !== null && (
                        <span className="text-muted-foreground ml-1.5">
                          ({bday.age} tuổi)
                        </span>
                      )}
                    </div>
                    {bday.isToday ? (
                      <Badge
                        variant="secondary"
                        className="gap-1 text-[11px] font-medium px-2 py-0.5 bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 border border-pink-300 dark:border-pink-800 animate-pulse"
                      >
                        <Cake className="h-3 w-3 text-pink-500 fill-pink-500/20" />
                        <span>Hôm nay sinh nhật!</span>
                      </Badge>
                    ) : bday.isThisMonth ? (
                      <Badge
                        variant="secondary"
                        className="gap-1 text-[11px] font-normal px-2 py-0.5 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                      >
                        <Cake className="h-3 w-3 text-amber-500 fill-amber-500/20" />
                        <span>Sinh nhật tháng này</span>
                      </Badge>
                    ) : null}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-xs italic">Chưa cập nhật</span>
                )}
              </TableCell>

              {/* 6. Ghi chú công tác */}
              <TableCell className="py-2.5">
                <p className="text-xs text-muted-foreground truncate max-w-[180px]" title={emp.address}>
                  {emp.address || '—'}
                </p>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
