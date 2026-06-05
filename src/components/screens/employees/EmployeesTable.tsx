'use client'

import { Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DataTableActions,
  EmptyState,
  EntityCell,
  StatusBadge,
  ContactCell,
} from '@/components/shared'
import { formatCurrency, formatDate } from '@/lib/format'
import type { Employee } from '@/mocks/employees'

interface EmployeesTableProps {
  items: Employee[]
  onRowClick: (item: Employee) => void
  onView: (item: Employee) => void
  onEdit: (item: Employee) => void
  onDelete: (item: Employee) => void
}

const COLUMNS: Array<{ label: string; className?: string }> = [
  { label: 'Employee' },
  { label: 'Position', className: 'min-w-44' },
  { label: 'Liên hệ', className: 'min-w-52' },
  { label: 'Branch', className: 'min-w-44' },
  { label: 'Contract', className: 'min-w-32' },
  { label: 'Hired', className: 'min-w-28' },
  { label: 'Salary', className: 'min-w-36' },
  { label: 'Status', className: 'min-w-28' },
  { label: 'Actions', className: 'w-28 text-right' },
]

export function EmployeesTable({
  items,
  onRowClick,
  onView,
  onEdit,
  onDelete,
}: EmployeesTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          icon={<Users className="h-7 w-7 text-muted-foreground" />}
          title="No employees match the filters"
          description="Adjust the search, branch, or status filters."
        />
      </div>
    )
  }

  return (
    <Table containerClassName="min-w-full" className="min-w-[1200px]">
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
        {items.map((employee) => (
          <TableRow
            key={employee.id}
            className="cursor-pointer"
            onClick={() => onRowClick(employee)}
          >
            <TableCell>
              <EntityCell
                name={employee.name}
                supporting={`STAFF-${employee.id.toUpperCase()}`}
              />
            </TableCell>
            <TableCell>
              <p className="truncate text-sm font-medium">{employee.position}</p>
              <p className="text-xs text-muted-foreground">{employee.department}</p>
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <ContactCell
                phone={employee.phone}
                email={employee.email}
                studentId={employee.id}
                studentName={employee.name}
              />
            </TableCell>
            <TableCell className="text-sm">{employee.branch}</TableCell>
            <TableCell>
              <Badge variant="outline" className="rounded-md text-[10px]">
                {employee.contractType}
              </Badge>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {formatDate(employee.hireDate)}
            </TableCell>
            <TableCell className="font-mono text-sm">
              {formatCurrency(employee.salary)}
            </TableCell>
            <TableCell>
              <StatusBadge status={employee.status} />
            </TableCell>
            <TableCell className="text-right">
              <DataTableActions
                onView={() => onView(employee)}
                onEdit={() => onEdit(employee)}
                onDelete={() => onDelete(employee)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
