'use client'

import { Cake } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  BranchSelect,
  ExpandableSearch,
  ToolbarSelect,
} from '@/components/controls'
import type { Employee } from '@/mocks/employees'
import type { EmployeeBirthdayFilter } from './employeesTypes'
import { countBirthdayThisMonth } from './employeesHelpers'
import { cn } from '@/lib/utils'

interface EmployeesToolbarProps {
  employees: Employee[]
  departments: string[]
  branches: string[]
  activeDepartment: string
  activeBranch: string
  activeBirthday: EmployeeBirthdayFilter
  searchTerm: string
  onDepartmentChange: (dep: string) => void
  onBranchChange: (branch: string) => void
  onBirthdayChange: (birthday: EmployeeBirthdayFilter) => void
  onSearchChange: (value: string) => void
}

export function EmployeesToolbar({
  employees,
  departments,
  branches,
  activeDepartment,
  activeBranch,
  activeBirthday,
  searchTerm,
  onDepartmentChange,
  onBranchChange,
  onBirthdayChange,
  onSearchChange,
}: EmployeesToolbarProps) {
  const departmentOptions = [
    { value: 'all', label: 'Tất cả phòng ban' },
    ...departments.map((d) => ({ value: d, label: d })),
  ]

  const birthdayMonthCount = countBirthdayThisMonth(employees)

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 bg-background px-3 py-2.5 border-b border-border/60">
      {/* Trái: Lọc Phòng ban + Lọc Cơ sở + Lọc Sinh nhật nội bộ */}
      <div className="flex flex-wrap items-center gap-2">
        <ToolbarSelect
          value={activeDepartment}
          onValueChange={onDepartmentChange}
          options={departmentOptions}
          className="h-8 min-w-40 text-xs"
        />

        <BranchSelect
          value={activeBranch}
          branches={branches}
          allLabel="Tất cả cơ sở"
          placeholder="Chọn cơ sở"
          ariaLabel="Cơ sở"
          onValueChange={onBranchChange}
          className="h-8 min-w-36 text-xs"
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onBirthdayChange(activeBirthday === 'this_month' ? 'all' : 'this_month')
          }
          className={cn(
            'h-8 gap-1.5 px-2.5 text-xs font-normal border transition-colors cursor-pointer',
            activeBirthday === 'this_month'
              ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800'
              : 'border-border/70 hover:bg-muted/60 text-muted-foreground hover:text-foreground'
          )}
        >
          <Cake
            className={cn(
              'h-3.5 w-3.5',
              activeBirthday === 'this_month'
                ? 'text-pink-500 fill-pink-500/20'
                : 'text-muted-foreground'
            )}
          />
          <span>Sinh nhật tháng này ({birthdayMonthCount})</span>
        </Button>
      </div>

      {/* Phải: Ô tìm kiếm danh bạ */}
      <div className="flex items-center gap-2">
        <ExpandableSearch
          value={searchTerm}
          onValueChange={onSearchChange}
          label="Tìm nhân sự"
          placeholder="Tìm tên đồng nghiệp, chức vụ, email, SĐT..."
          inputClassName="sm:w-64 text-xs h-8"
        />
      </div>
    </div>
  )
}
