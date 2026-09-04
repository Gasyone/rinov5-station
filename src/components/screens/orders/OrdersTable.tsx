'use client'

import { useState } from 'react'
import {
  Receipt,
  Ban,
  History,
  Check,
  Copy,
  Plus,
  ExternalLink,
  CreditCard,
  Banknote,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  EmptyState,
  PersonnelHoverCard,
  StatusBadge,
} from '@/components/shared'
import { formatCurrency, formatDateTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Order } from '@/mocks/orders'
import {
  formatPaymentTime,
  formatPhoneMaskMiddle,
  getNormalizedPaymentHistory,
  getOrderCustomerInfo,
  getOrderEffectiveStatus,
  getOrderPaymentInstallmentInfo,
  getOrderPhone,
  getOrderSessionConversion,
  getOrderStatusLabel,
  getStaffPersonnel,
  isOrderDeposit,
} from './ordersHelpers'
import { OrderProductsPopover } from './OrderProductsPopover'

interface OrdersTableProps {
  orders: Order[]
  onRowClick: (order: Order) => void
  onView?: (order: Order) => void
  onCancel: (order: Order) => void
  onAddPayment?: (order: Order) => void
}

export function OrdersTable({
  orders,
  onRowClick,
  onCancel,
  onAddPayment,
}: OrdersTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyPhone = (phone: string, id: string) => {
    navigator.clipboard?.writeText(phone)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const isAllSelected =
    orders.length > 0 && selectedIds.length === orders.length

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(orders.map((o) => o.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id))
    }
  }

  if (orders.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <EmptyState
          icon={<Receipt className="h-8 w-8 text-muted-foreground" />}
          title="Không tìm thấy đơn hàng nào"
          description="Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác"
        />
      </div>
    )
  }

  return (
    <Table className="border-collapse">
      <TableHeader className="sticky top-0 z-10 bg-background shadow-2xs">
        <TableRow>
          {/* CỘT 1: TÊN HỌC VIÊN */}
          <TableHead className="w-[300px] min-w-[280px]">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Chọn tất cả đơn hàng"
              />
              <span>Tên học viên</span>
            </div>
          </TableHead>

          {/* CỘT 2: LIÊN HỆ */}
          <TableHead className="min-w-[170px]">Liên hệ</TableHead>
          {/* CỘT 3: GÓI SẢN PHẨM */}
          <TableHead className="w-[170px] min-w-[150px] max-w-[180px]">Gói sản phẩm</TableHead>
          {/* CỘT 4: TỔNG TIỀN */}
          <TableHead className="min-w-[140px]">Tổng tiền</TableHead>
          {/* CỘT 5: LỊCH SỬ THANH TOÁN */}
          <TableHead className="min-w-[220px]">Lịch sử thanh toán</TableHead>
          {/* CỘT 6: SỐ BUỔI QUY ĐỔI */}
          <TableHead className="min-w-[130px]">Số buổi quy đổi</TableHead>
          {/* CỘT 7: TRẠNG THÁI */}
          <TableHead className="min-w-[130px]">Trạng thái</TableHead>
          {/* CỘT 8: NGƯỜI LÊN ĐƠN */}
          <TableHead className="min-w-[130px]">Người lên đơn</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order, index) => {
          const isSelected = selectedIds.includes(order.id)
          const cancellable = order.status !== 'cancelled' && order.status !== 'refunded'
          const paidAmount = order.paidAmount ?? (order.paymentStatus === 'paid' ? order.finalAmount : 0)
          const remainingAmount = order.remainingAmount ?? Math.max(0, order.finalAmount - paidAmount)
          const history = getNormalizedPaymentHistory(order)
          const latestPayment = history.length > 0 ? history[0] : null
          const conversion = getOrderSessionConversion(order)
          const customerInfo = getOrderCustomerInfo(order)
          const rawPhone = getOrderPhone(order)
          const maskedPhone = formatPhoneMaskMiddle(rawPhone)

          return (
            <TableRow
              key={order.id}
              className={cn(
                'group/row transition-colors border-b border-border/40',
                isSelected
                  ? 'bg-primary/10'
                  : index % 2 === 1
                    ? 'bg-muted/35 dark:bg-muted/20'
                    : 'bg-background',
                'hover:bg-muted/60 dark:hover:bg-muted/40'
              )}
            >
              {/* CỘT 1: CHECKBOX + TÊN HỌC VIÊN + MÃ ĐƠN & MÃ HỌC VIÊN + ACTION ICONS */}
              <TableCell className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleSelectRow(order.id, Boolean(checked))}
                    aria-label={`Chọn đơn ${order.orderNo}`}
                  />
                  <div className="min-w-0 flex-1">
                    {/* Dòng 1: Tên học viên */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="truncate font-semibold text-xs text-foreground hover:text-primary cursor-pointer"
                        onClick={() => onRowClick(order)}
                        title={`Học viên: ${order.studentName}`}
                      >
                        {order.studentName}
                      </span>
                    </div>

                    {/* Dòng 2: Mã đơn & Mã học viên */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono mt-0.5">
                      <span
                        className="font-medium text-foreground/80 hover:text-primary hover:underline cursor-pointer"
                        onClick={() => onRowClick(order)}
                        title={`Mã đơn: ${order.orderNo}`}
                      >
                        {order.orderNo}
                      </span>
                      <span className="text-muted-foreground/40">•</span>
                      <span className="uppercase" title={`Mã học viên: ${order.studentId}`}>
                        {order.studentId}
                      </span>
                    </div>
                  </div>

                  {/* Nút Action Icons: Ẩn mặc định, hover dòng mới hiện */}
                  <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover/row:opacity-100 transition-opacity">
                    {/* 1. Nút Thanh toán / Hoàn tất / TT thêm theo từng loại đơn */}
                    {cancellable && onAddPayment && (
                      paidAmount === 0 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-primary hover:text-primary hover:bg-primary/10 cursor-pointer"
                          onClick={() => onAddPayment(order)}
                          title="Tạo thanh toán cho đơn hàng"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                        </Button>
                      ) : isOrderDeposit(order) && remainingAmount > 0 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                          onClick={() => onAddPayment(order)}
                          title="Tạo đơn hoàn tất thanh toán (Đơn cọc)"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      ) : remainingAmount > 0 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
                          onClick={() => onAddPayment(order)}
                          title="Ghi nhận thanh toán thêm"
                        >
                          <Banknote className="h-3.5 w-3.5" />
                        </Button>
                      ) : null
                    )}

                    {/* 2. Hủy đơn */}
                    {cancellable && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                        onClick={() => onCancel(order)}
                        title="Hủy đơn hàng"
                      >
                        <Ban className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* CỘT 2: LIÊN HỆ (TÊN PHỤ HUYNH + SĐT MASKED & COPY) */}
              <TableCell className="py-3 px-3">
                <div className="min-w-0">
                  {/* Dòng 1: Tên phụ huynh + quan hệ */}
                  <div className="flex items-center gap-1 min-w-0">
                    <span
                      className="truncate font-medium text-xs text-foreground"
                      title={`${customerInfo.relationship}: ${customerInfo.name}`}
                    >
                      {customerInfo.name}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0 font-normal">
                      ({customerInfo.relationship})
                    </span>
                  </div>

                  {/* Dòng 2: SĐT có icon copy */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono mt-0.5">
                    <span title={rawPhone}>{maskedPhone}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopyPhone(rawPhone, order.id)
                      }}
                      className="p-0.5 text-muted-foreground/70 hover:text-foreground rounded transition-colors cursor-pointer"
                      title={copiedId === order.id ? 'Đã sao chép SĐT!' : 'Sao chép số điện thoại'}
                    >
                      {copiedId === order.id ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              </TableCell>

              {/* CỘT 3: GÓI SẢN PHẨM */}
              <TableCell className="py-3 px-3">
                <div className="max-w-[170px] truncate">
                  <OrderProductsPopover order={order} />
                </div>
              </TableCell>

              {/* CỘT 4: TỔNG TIỀN & PHÂN LOẠI THANH TOÁN TINH GỌN */}
              <TableCell className="py-3 px-3">
                <div className="flex flex-col gap-0.5">
                  {/* Dòng 1: Tổng tiền */}
                  <span className="font-semibold text-xs font-mono text-foreground">
                    {formatCurrency(order.finalAmount)}
                  </span>
                  {/* Dòng 2: Trạng thái thu gọn gàng, giảm ô nhiễm màu */}
                  <div className="text-xs">
                    {remainingAmount === 0 && paidAmount > 0 ? (
                      <span className="text-muted-foreground">Đã thanh toán đủ</span>
                    ) : remainingAmount > 0 && paidAmount > 0 ? (
                      <span className="font-mono text-amber-600 dark:text-amber-400 font-medium">
                        Còn nợ: {formatCurrency(remainingAmount)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Chưa thanh toán</span>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* CỘT 5: LỊCH SỬ THANH TOÁN */}
              <TableCell className="py-3 px-3">
                {latestPayment ? (
                  <div className="flex flex-col gap-0.5 text-xs">
                    {/* Dòng 1: Icon Check đối soát (trước) -> Số tiền -> Nút Popover lịch sử (sau) */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {latestPayment.reconciliationStatus === 'reconciled' && (
                        <span
                          title="Đã đối soát"
                          className="inline-flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0"
                        >
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        </span>
                      )}

                      <span className="font-mono font-medium text-foreground">
                        {formatCurrency(latestPayment.amount)}
                      </span>

                      {history.length > 1 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-5 px-1 py-0 text-xs font-normal text-muted-foreground hover:text-foreground hover:bg-muted border-0 shadow-none gap-0.5 cursor-pointer"
                              title="Nhấp xem toàn bộ lịch sử thanh toán"
                            >
                              <History className="h-3 w-3" />
                              <span>({history.length})</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className="w-[360px] p-3 text-xs shadow-xl border bg-background z-50 rounded-xl space-y-2.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-between pb-2 border-b">
                              <span className="font-bold text-foreground inline-flex items-center gap-1.5">
                                <History className="h-4 w-4 text-primary" />
                                Lịch sử thanh toán ({history.length})
                              </span>
                              <span className="font-mono text-xs font-semibold text-foreground">
                                Đã đóng: {formatCurrency(paidAmount)}
                              </span>
                            </div>
                            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                              {history.map((rec) => (
                                <div
                                  key={rec.id}
                                  className="flex flex-col gap-1 p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs"
                                >
                                  <div className="flex items-center justify-between font-bold">
                                    <span className="text-foreground font-mono">
                                      Lần {rec.sequenceNo} • {rec.code}
                                    </span>
                                    {rec.reconciliationStatus === 'reconciled' ? (
                                      <span
                                        title="Đã đối soát"
                                        className="inline-flex items-center gap-0.5 text-xs py-0.5 px-1.5 font-medium rounded bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300"
                                      >
                                        <Check className="h-3 w-3 stroke-[2.5]" />
                                        Đã đối soát
                                      </span>
                                    ) : (
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          'text-xs py-0 px-1.5 font-medium rounded',
                                          rec.reconciliationStatus === 'pending'
                                            ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                                            : 'bg-zinc-100 text-zinc-600 border-zinc-300'
                                        )}
                                      >
                                        {rec.reconciliationLabel}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between text-muted-foreground">
                                    <span>
                                      Số tiền: <strong className="font-mono text-foreground font-semibold">{formatCurrency(rec.amount)}</strong>
                                    </span>
                                    <span>PTTT: <span className="text-foreground font-normal">{rec.paymentMethod}</span></span>
                                  </div>
                                  {rec.bankAccount && (
                                    <div className="text-muted-foreground text-xs">
                                      Tài khoản: <span className="font-mono text-foreground">{rec.bankAccount}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between text-muted-foreground text-xs pt-0.5 border-t border-border/30">
                                    <span className="font-medium text-foreground">{rec.createdBy}</span>
                                    <span className="font-mono">{rec.paidAt}</span>
                                  </div>
                                  {rec.note && (
                                    <div className="text-xs italic text-muted-foreground">
                                      Ghi chú: {rec.note}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Footer if partial/deposit remaining */}
                            {remainingAmount > 0 && onAddPayment && cancellable && (
                              <div className="pt-2 border-t flex items-center justify-between gap-2">
                                <span className="text-xs text-muted-foreground">
                                  Còn nợ: <strong className="font-mono text-amber-600 dark:text-amber-400 font-semibold">{formatCurrency(remainingAmount)}</strong>
                                </span>
                                <Button
                                  type="button"
                                  size="sm"
                                  className={cn(
                                    'h-6 px-2 text-xs font-medium text-white shadow-2xs cursor-pointer',
                                    isOrderDeposit(order)
                                      ? 'bg-blue-600 hover:bg-blue-700'
                                      : 'bg-emerald-600 hover:bg-emerald-700'
                                  )}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onAddPayment(order)
                                  }}
                                >
                                  {isOrderDeposit(order) ? (
                                    <span className="inline-flex items-center gap-1">
                                      <span>Tạo đơn hoàn tất</span>
                                      <ExternalLink className="h-3 w-3" />
                                    </span>
                                  ) : (
                                    '+ Thanh toán thêm'
                                  )}
                                </Button>
                              </div>
                            )}
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>

                    {/* Dòng 2: Phương thức • Thời gian */}
                    <div
                      className="text-xs text-muted-foreground truncate max-w-[230px] flex items-center gap-1.5"
                      title={`${latestPayment.paymentMethod} • ${formatPaymentTime(latestPayment.paidAt)}`}
                    >
                      <span className="text-foreground/85 font-normal">{latestPayment.paymentMethod}</span>
                      <span className="text-muted-foreground/40">•</span>
                      <span className="font-mono">{formatPaymentTime(latestPayment.paidAt)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-start gap-1 text-xs">
                    <span className="text-muted-foreground">Chưa có giao dịch</span>
                    {onAddPayment && cancellable && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 py-0 text-xs font-medium border-primary/30 text-primary hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1 shadow-2xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          onAddPayment(order)
                        }}
                        title="Thêm giao dịch thanh toán cho đơn hàng"
                      >
                        <Plus className="h-3 w-3 mr-0.5" />
                        <span>Thêm giao dịch</span>
                      </Button>
                    )}
                  </div>
                )}
              </TableCell>

              {/* CỘT 6: SỐ BUỔI QUY ĐỔI */}
              <TableCell className="py-3 px-3">
                {conversion.isApplicable ? (
                  <div className="flex flex-col gap-0.5 text-xs">
                    {/* Dòng 1: Tổng số buổi */}
                    <span className="font-medium text-xs font-mono text-foreground">
                      {conversion.totalSessions} buổi
                    </span>
                    {/* Dòng 2: QĐ / Còn lại */}
                    <div className="text-xs text-muted-foreground font-mono flex items-center gap-1 flex-wrap">
                      <span>Đã QĐ: {conversion.convertedSessions}</span>
                      <span className="text-muted-foreground/40">•</span>
                      <span>Còn: {conversion.remainingSessions}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>

              {/* CỘT 7: TRẠNG THÁI & LẦN THANH TOÁN */}
              <TableCell className="py-3 px-3">
                {(() => {
                  const effectiveStatus = getOrderEffectiveStatus(order)
                  const installment = getOrderPaymentInstallmentInfo(order)
                  return (
                    <div className="flex flex-col gap-1 items-start">
                      <StatusBadge
                        status={effectiveStatus}
                        label={getOrderStatusLabel(effectiveStatus)}
                        withDot
                      />
                      {/* Dòng 2: Lần thanh toán (Cọc / Thanh toán 1 lần / Thanh toán lần 1, 2, 3...) */}
                      <div className="text-xs pl-0.5">
                        <span className={installment.className}>
                          {installment.label}
                        </span>
                      </div>
                    </div>
                  )
                })()}
              </TableCell>

              {/* CỘT 9: NGƯỜI LÊN ĐƠN */}
              <TableCell className="py-3 px-3">
                {(() => {
                  const staffName = order.saleBy || 'Nguyễn Văn Sale'
                  const staffPersonnel = getStaffPersonnel(staffName)
                  return (
                    <PersonnelHoverCard person={staffPersonnel} align="end">
                      <div className="flex flex-col gap-0.5 text-xs cursor-pointer group/staff max-w-[140px]">
                        <span
                          className="font-normal text-foreground group-hover/staff:text-primary group-hover/staff:underline truncate"
                          title={`Nhân sự: ${staffName}`}
                        >
                          {staffName}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {formatDateTime(order.createdAt)}
                        </span>
                      </div>
                    </PersonnelHoverCard>
                  )
                })()}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
