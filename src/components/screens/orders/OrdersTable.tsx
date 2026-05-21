'use client'

import { Receipt } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DataTableActions,
  EmptyState,
  EntityCell,
  StatusBadge,
} from '@/components/shared'
import { formatCurrency, formatDateTime } from '@/lib/format'
import type { Order } from '@/mocks/orders'
import { PAYMENT_METHOD_LABELS } from './ordersTypes'

interface OrdersTableProps {
  orders: Order[]
  onRowClick: (order: Order) => void
  onView: (order: Order) => void
  onCancel: (order: Order) => void
}

const COLUMNS: Array<{ label: string; className?: string }> = [
  { label: 'Order' },
  { label: 'Student', className: 'min-w-44' },
  { label: 'Items', className: 'min-w-44' },
  { label: 'Amount', className: 'min-w-40' },
  { label: 'Payment', className: 'min-w-40' },
  { label: 'Sale by', className: 'min-w-36' },
  { label: 'Created', className: 'min-w-36' },
  { label: 'Status', className: 'min-w-28' },
  { label: 'Actions', className: 'w-28 text-right' },
]

export function OrdersTable({ orders, onRowClick, onView, onCancel }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          icon={<Receipt className="h-7 w-7 text-muted-foreground" />}
          title="No orders match the filters"
          description="Adjust search, branch, or status filters."
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
        {orders.map((order) => {
          const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)
          const cancellable = order.status !== 'cancelled' && order.status !== 'refunded'
          return (
            <TableRow
              key={order.id}
              className="cursor-pointer"
              onClick={() => onRowClick(order)}
            >
              <TableCell>
                <div className="min-w-0">
                  <p className="truncate font-mono text-sm font-semibold">{order.orderNo}</p>
                  <p className="truncate text-xs text-muted-foreground">{order.branch}</p>
                </div>
              </TableCell>
              <TableCell>
                <EntityCell
                  name={order.studentName}
                  supporting={order.studentId.toUpperCase()}
                />
              </TableCell>
              <TableCell>
                <div className="min-w-0">
                  <p className="truncate text-sm">{order.items[0]?.productName ?? '—'}</p>
                  {totalItems > order.items[0]?.quantity ? (
                    <p className="text-xs text-muted-foreground">
                      +{totalItems - (order.items[0]?.quantity ?? 0)} other items
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {totalItems} item{totalItems > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <p className="font-mono text-sm font-semibold">
                  {formatCurrency(order.finalAmount)}
                </p>
                {order.discountAmount > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    -{formatCurrency(order.discountAmount)} discount
                  </p>
                ) : null}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <StatusBadge status={order.paymentStatus} className="self-start" />
                  <Badge variant="outline" className="self-start rounded-md text-[10px]">
                    {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{order.saleBy}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDateTime(order.createdAt)}
              </TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-right">
                <DataTableActions
                  onView={() => onView(order)}
                  onDelete={cancellable ? () => onCancel(order) : undefined}
                  menuLabel="Order actions"
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
