'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTableFrame } from '@/components/data-table'
import {
  DataTablePagination,
  DEFAULT_PAGE_SIZE,
} from '@/components/data-table'
import {
  FilterGroupSheetPanel,
  createFilterGroup,
  type FilterGroupConfig,
  getSchoolFilterGroup,
} from '@/components/filters'
import { ConfirmDialog } from '@/components/shared'
import type { Employee } from '@/mocks/employees'
import {
  buildEmptyEmployee,
  countEmployeesByStatus,
  filterEmployees,
  getEmployeeBranches,
  getEmployeeContractTypes,
  getEmployeeDepartments,
  getInitialEmployees,
  nextEmployeeId,
} from './employeesHelpers'
import {
  EMPLOYEE_STATUS_TABS,
  type EmployeeFilterState,
  type EmployeeStatusFilter,
} from './employeesTypes'
import { EmployeesToolbar } from './EmployeesToolbar'
import { EmployeesTable } from './EmployeesTable'
import { EmployeesFormDialog } from './EmployeesFormDialog'

type DialogState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; employee: Employee }

export function EmployeesScreen() {
  const [employees, setEmployees] = useState<Employee[]>(() => getInitialEmployees())
  const [activeBranch, setActiveBranch] = useState('all')
  const [activeStatus, setActiveStatus] = useState<EmployeeStatusFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<EmployeeFilterState>({
    branches: [],
    departments: [],
    contractTypes: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [dialog, setDialog] = useState<DialogState>({ mode: 'closed' })
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null)

  const branches = useMemo(() => getEmployeeBranches(employees), [employees])
  const departments = useMemo(() => getEmployeeDepartments(employees), [employees])
  const contractTypes = useMemo(() => getEmployeeContractTypes(employees), [employees])

  const filtered = useMemo(
    () =>
      filterEmployees(employees, {
        search: searchTerm,
        branch: activeBranch,
        status: activeStatus,
        extra: filters,
      }),
    [employees, searchTerm, activeBranch, activeStatus, filters]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const activeFilterCount =
    filters.branches.length +
    filters.departments.length +
    filters.contractTypes.length

  const filterGroups = useMemo<FilterGroupConfig[]>(
    () => [
      getSchoolFilterGroup(
        'branches',
        filters.branches,
        (branch) => employees.filter((e) => e.branch === branch).length,
        branches
      ),
      createFilterGroup({
        id: 'departments',
        options: departments,
        selectedValues: filters.departments,
        getOptionCount: (department) => employees.filter((e) => e.department === department).length,
      }),
      createFilterGroup({
        id: 'contractTypes',
        options: contractTypes,
        selectedValues: filters.contractTypes,
        getOptionCount: (contractType) => employees.filter((e) => e.contractType === contractType).length,
      }),
      createFilterGroup({
        id: 'statuses',
        options: EMPLOYEE_STATUS_TABS.filter((t) => t.id !== 'all').map((t) => ({
          value: t.id,
          label: t.label,
          count: countEmployeesByStatus(employees, t.id),
        })),
        selectedValues: activeStatus === 'all' ? [] : [activeStatus],
      }),
    ],
    [activeStatus, branches, departments, contractTypes, employees, filters]
  )

  const toggleArray = <K extends keyof EmployeeFilterState>(
    key: K,
    value: EmployeeFilterState[K][number]
  ) => {
    setPage(1)
    setFilters((current) => {
      const arr = current[key] as string[]
      return {
        ...current,
        [key]: arr.includes(value as string)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      } as EmployeeFilterState
    })
  }

  const handleSubmit = (value: Omit<Employee, 'id'> & { id?: string }) => {
    if (dialog.mode === 'edit') {
      setEmployees((current) =>
        current.map((e) =>
          e.id === dialog.employee.id ? { ...e, ...value, id: e.id } : e
        )
      )
      toast.success(`Updated ${value.name}`)
    } else {
      const id = nextEmployeeId(employees)
      const created: Employee = { ...buildEmptyEmployee(), ...value, id }
      setEmployees((current) => [created, ...current])
      toast.success(`Added ${value.name}`)
    }
    setDialog({ mode: 'closed' })
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    const name = deleteTarget.name
    setEmployees((current) => current.filter((e) => e.id !== deleteTarget.id))
    setDeleteTarget(null)
    toast.success(`Removed ${name}`)
  }

  const dialogInitial =
    dialog.mode === 'edit' ? { ...dialog.employee } : { ...buildEmptyEmployee() }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <EmployeesToolbar
        employees={employees}
        branches={branches}
        activeBranch={activeBranch}
        activeStatus={activeStatus}
        searchTerm={searchTerm}
        activeFilterCount={activeFilterCount}
        onBranchChange={(b) => {
          setActiveBranch(b)
          setPage(1)
        }}
        onStatusChange={(s) => {
          setActiveStatus(s)
          setPage(1)
        }}
        onSearchChange={(v) => {
          setSearchTerm(v)
          setPage(1)
        }}
        onOpenFilters={() => setIsFilterOpen(true)}
        onCreate={() => setDialog({ mode: 'create' })}
      />

      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4 lg:px-6 lg:pb-6">
        <DataTableFrame
          footer={
            <DataTablePagination
              page={currentPage}
              total={filtered.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          }
        >
          <EmployeesTable
            items={paged}
            onRowClick={(item) => setDialog({ mode: 'edit', employee: item })}
            onView={(item) => setDialog({ mode: 'edit', employee: item })}
            onEdit={(item) => setDialog({ mode: 'edit', employee: item })}
            onDelete={setDeleteTarget}
          />
        </DataTableFrame>
      </div>

      <FilterGroupSheetPanel
        open={isFilterOpen}
        title="Employee filters"
        description="Filter by branch, department, and contract type."
        groups={filterGroups}
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'branches') toggleArray('branches', value)
          if (sectionId === 'departments') toggleArray('departments', value)
          if (sectionId === 'contractTypes')
            toggleArray('contractTypes', value as Employee['contractType'])
          if (sectionId === 'statuses') {
            setActiveStatus(value as EmployeeStatusFilter)
            setPage(1)
          }
        }}
        onClearAll={() => {
          setFilters({ branches: [], departments: [], contractTypes: [] })
          setActiveStatus('all')
          setPage(1)
        }}
      />

      <EmployeesFormDialog
        open={dialog.mode !== 'closed'}
        mode={dialog.mode === 'edit' ? 'edit' : 'create'}
        initial={dialogInitial}
        branches={branches}
        departments={departments}
        onOpenChange={(open) => {
          if (!open) setDialog({ mode: 'closed' })
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        variant="destructive"
        title={`Remove ${deleteTarget?.name ?? 'employee'}?`}
        description="This deletes the employee record from the demo data set."
        confirmLabel="Remove"
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
