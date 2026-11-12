'use client'

import { useMemo, useState } from 'react'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import type { Employee } from '@/mocks/employees'
import {
  filterEmployees,
  getEmployeeBranches,
  getEmployeeDepartments,
  getInitialEmployees,
} from './employeesHelpers'
import type { EmployeeBirthdayFilter } from './employeesTypes'
import { EmployeesToolbar } from './EmployeesToolbar'
import { EmployeesTable } from './EmployeesTable'
import { EmployeeDetailDialog } from './EmployeeDetailDialog'

export function EmployeesScreen() {
  const [employees] = useState<Employee[]>(() => getInitialEmployees())
  const [activeDepartment, setActiveDepartment] = useState('all')
  const [activeBranch, setActiveBranch] = useState('all')
  const [activeBirthday, setActiveBirthday] = useState<EmployeeBirthdayFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  const departments = useMemo(() => getEmployeeDepartments(employees), [employees])
  const branches = useMemo(() => getEmployeeBranches(employees), [employees])

  const filtered = useMemo(
    () =>
      filterEmployees(employees, {
        search: searchTerm,
        department: activeDepartment,
        branch: activeBranch,
        birthday: activeBirthday,
      }),
    [employees, searchTerm, activeDepartment, activeBranch, activeBirthday]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paged.map((e) => e.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleToggleOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <EmployeesToolbar
        employees={employees}
        departments={departments}
        branches={branches}
        activeDepartment={activeDepartment}
        activeBranch={activeBranch}
        activeBirthday={activeBirthday}
        searchTerm={searchTerm}
        onDepartmentChange={(d) => {
          setActiveDepartment(d)
          setPage(1)
        }}
        onBranchChange={(b) => {
          setActiveBranch(b)
          setPage(1)
        }}
        onBirthdayChange={(b) => {
          setActiveBirthday(b)
          setPage(1)
        }}
        onSearchChange={(q) => {
          setSearchTerm(q)
          setPage(1)
        }}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <DataTableFrame
          className="flex-1 min-h-0"
          footer={
            <DataTablePagination
              page={currentPage}
              total={filtered.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setPage(1)
              }}
              selectedCount={selectedIds.size > 0 ? selectedIds.size : undefined}
              onClearSelection={() => setSelectedIds(new Set())}
              size="sm"
            />
          }
        >
          <EmployeesTable
            employees={paged}
            selectedIds={selectedIds}
            onToggleAll={handleToggleAll}
            onToggleOne={handleToggleOne}
            onRowClick={(e) => setSelectedEmployee(e)}
          />
        </DataTableFrame>
      </div>

      <EmployeeDetailDialog
        open={Boolean(selectedEmployee)}
        employee={selectedEmployee}
        onOpenChange={(open) => {
          if (!open) setSelectedEmployee(null)
        }}
      />
    </div>
  )
}
