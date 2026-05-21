'use client'

import { Banknote, MapPin, ReceiptText, UserRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { InfoField, Panel, StatusBadge } from '@/components/shared'
import { formatCurrency, formatDateTime } from '@/lib/format'
import type { Order } from '@/mocks/orders'
import { PAYMENT_METHOD_LABELS } from './ordersTypes'

interface OrderDetailDialogProps {
  order: Order | null
  onOpenChange: (open: boolean) => void
  onCancel?: (order: Order) => void
}

export function OrderDetailDialog({ order, onOpenChange, onCancel }: OrderDetailDialogProps) {
  if (!order) {
    return (
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogContent />
      </Dialog>
    )
  }

  const cancellable = order.status !== 'cancelled' && order.status !== 'refunded'

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2">
            <span className="font-mono">{order.orderNo}</span>
            <StatusBadge status={order.status} />
            <Badge variant="outline" className="rounded-md">
              {PAYMENT_METHOD_LABELS[order.paymentMethod]}
            </Badge>
            <StatusBadge status={order.paymentStatus} />
          </DialogTitle>
          <DialogDescription>
            Created {formatDateTime(order.createdAt)} · Sale by {order.saleBy}
          </DialogDescription>
        </DialogHeader>

        <section className="grid gap-x-8 gap-y-4 border-y border-border py-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoField
            label="Student"
            value={order.studentName}
            supporting={order.studentId.toUpperCase()}
          />
          <InfoField label="Branch" value={order.branch} />
          <InfoField label="Sale by" value={order.saleBy} />
          <InfoField label="Created" value={formatDateTime(order.createdAt)} />
        </section>

        <Panel title="Line items" icon={<ReceiptText className="h-4 w-4" />}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="w-20 text-center">Qty</TableHead>
                <TableHead className="text-right">Unit price</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(item.subtotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Panel>

        <Panel title="Payment summary" icon={<Banknote className="h-4 w-4" />}>
          <dl className="grid gap-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-mono">{formatCurrency(order.totalAmount)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Discount</dt>
              <dd className="font-mono">- {formatCurrency(order.discountAmount)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2 text-base font-semibold">
              <dt>Final amount</dt>
              <dd className="font-mono">{formatCurrency(order.finalAmount)}</dd>
            </div>
          </dl>
        </Panel>

        {order.notes ? (
          <Panel title="Notes" icon={<UserRound className="h-4 w-4" />}>
            <p className="text-sm text-muted-foreground">{order.notes}</p>
          </Panel>
        ) : null}

        <Panel title="Branch" icon={<MapPin className="h-4 w-4" />}>
          <p className="text-sm">{order.branch}</p>
        </Panel>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {cancellable && onCancel ? (
            <Button variant="destructive" onClick={() => onCancel(order)}>
              Cancel order
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
