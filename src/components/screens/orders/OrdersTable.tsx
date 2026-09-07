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
import { formatCurrency, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Order } from '@/mocks/orders'
import {
  formatPaymentDateOnly,
  formatPhoneMaskMiddle,
  getNormalizedPaymentHistory,
  getOrderCustomerInfo,
  getOrderEffectiveStatus,
  getOrderPhone,
  getOrderStatusLabel,
  getOrderUpdatedAt,
  getStaffPersonnel,
  isOrderDeposit,
} from './ordersHelpers'
import { OrderProductsPopover } from './OrderProductsPopover'
import { OrderFulfillmentCell } from './OrderFulfillmentCell'

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
  const [copiedOrderNo, setCopiedOrderNo] = useState<string | null>(null)
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null)

  const handleCopyOrderNo = (orderNo: string, id: string) => {
    navigator.clipboard?.writeText(orderNo)
    setCopiedOrderNo(id)
    setTimeout(() => setCopiedOrderNo(null), 2000)
  }

  const handleCopyPhone = (phone: string, id: string) => {
    navigator.clipboard?.writeText(phone)
    setCopiedPhone(id)
    setTimeout(() => setCopiedPhone(null), 2000)
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
          {/* CỘT 1: ĐƠN HÀNG (TĂNG BỀ NGANG) */}
          <TableHead className="w-[280px] min-w-[260px]">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Chọn tất cả đơn hàng"
              />
              <span>Đơn hàng</span>
            </div>
          </TableHead>

          {/* CỘT 2: KHÁCH HÀNG */}
          <TableHead className="w-[160px] min-w-[150px]">Khách hàng</TableHead>
          {/* CỘT 3: GÓI SẢN PHẨM (TĂNG BỀ NGANG) */}
          <TableHead className="w-[290px] min-w-[270px]">Gói sản phẩm</TableHead>
          {/* CỘT 4: TỔNG TIỀN */}
          <TableHead className="w-[130px] min-w-[120px]">Tổng tiền</TableHead>
          {/* CỘT 5: LỊCH SỬ THANH TOÁN (THU HẸP BỀ NGANG) */}
          <TableHead className="w-[160px] min-w-[145px] max-w-[170px]">Lịch sử thanh toán</TableHead>
          {/* CỘT 6: CHUYỂN GIAO SP/DV */}
          <TableHead className="w-[185px] min-w-[170px]">Chuyển giao SP/DV</TableHead>
          {/* CỘT 7: TRẠNG THÁI */}
          <TableHead className="w-[140px] min-w-[130px]">Trạng thái</TableHead>
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
          const customerInfo = getOrderCustomerInfo(order)
          const rawPhone = getOrderPhone(order)
          const maskedPhone = formatPhoneMaskMiddle(rawPhone)
          const updatedTime = getOrderUpdatedAt(order)
          const staffName = order.saleBy || 'Nguyễn Văn Sale'
          const staffPersonnel = getStaffPersonnel(staffName)
          const isDeposit = isOrderDeposit(order)

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
              {/* CỘT 1: ĐƠN HÀNG (MÃ ĐƠN HÀNG + COPY ICON, DÒNG DƯỚI: NGƯỜI TẠO, NGÀY TẠO) */}
              <TableCell className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleSelectRow(order.id, Boolean(checked))}
                    aria-label={`Chọn đơn ${order.orderNo}`}
                  />
                  <div className="min-w-0 flex-1">
                    {/* Dòng 1: Mã đơn hàng có icon copy */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="font-mono font-bold text-xs text-foreground hover:text-primary hover:underline cursor-pointer"
                        onClick={() => onRowClick(order)}
                        title={`Mã đơn: ${order.orderNo} - Nhấp để xem chi tiết`}
                      >
                        {order.orderNo}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyOrderNo(order.orderNo, order.id)
                        }}
                        className="p-0.5 text-muted-foreground/70 hover:text-foreground rounded transition-colors cursor-pointer"
                        title={copiedOrderNo === order.id ? 'Đã sao chép mã đơn!' : 'Sao chép mã đơn hàng'}
                        aria-label="Sao chép mã đơn hàng"
                      >
                        {copiedOrderNo === order.id ? (
                          <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>

                    {/* Dòng 2: Người tạo, ngày tạo (bỏ giờ, chỉ để ngày gọn) */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 truncate max-w-[240px]">
                      <PersonnelHoverCard person={staffPersonnel} align="start">
                        <span
                          className="font-normal text-muted-foreground hover:text-primary hover:underline cursor-pointer truncate"
                          title={`Người tạo: ${staffName}`}
                        >
                          {staffName}
                        </span>
                      </PersonnelHoverCard>
                      <span className="text-muted-foreground/40">•</span>
                      <span
                        className="font-mono text-muted-foreground shrink-0 text-xs"
                        title={`Ngày tạo: ${formatDate(order.createdAt)}`}
                      >
                        {formatDate(order.createdAt)}
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
                      ) : isDeposit && remainingAmount > 0 ? (
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

              {/* CỘT 2: KHÁCH HÀNG (TÊN KH, BÊN DƯỚI LÀ SĐT) */}
              <TableCell className="py-3 px-3">
                <div className="min-w-0">
                  {/* Dòng 1: Tên KH */}
                  <div className="flex items-center gap-1 min-w-0">
                    <span
                      className="truncate font-semibold text-xs text-foreground"
                      title={`Khách hàng: ${customerInfo.name}`}
                    >
                      {customerInfo.name}
                    </span>
                    {customerInfo.relationship && (
                      <span className="text-xs text-muted-foreground shrink-0 font-normal">
                        ({customerInfo.relationship})
                      </span>
                    )}
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
                      title={copiedPhone === order.id ? 'Đã sao chép SĐT!' : 'Sao chép số điện thoại'}
                      aria-label="Sao chép số điện thoại"
                    >
                      {copiedPhone === order.id ? (
                        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              </TableCell>

              {/* CỘT 3: GÓI SẢN PHẨM */}
              <TableCell className="py-3 px-3">
                <div className="min-w-0 max-w-[280px]">
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
                    {/* Dòng 1: Icon Check đối soát (trước) -> Số tiền -> Nhãn Cọc (nếu là đơn cọc) -> Nút Popover lịch sử (sau) */}
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

                      {/* Nhãn cọc đưa vào lịch sử thanh toán */}
                      {isDeposit && (
                        <Badge
                          variant="outline"
                          className="text-[11px] px-1.5 py-0 h-4.5 font-medium rounded bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300"
                        >
                          Cọc
                        </Badge>
                      )}

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
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-foreground font-mono">
                                        Lần {rec.sequenceNo} • {rec.code}
                                      </span>
                                      {isDeposit && (
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] py-0 px-1 font-medium rounded bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300"
                                        >
                                          Cọc
                                        </Badge>
                                      )}
                                    </div>
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
                                    isDeposit
                                      ? 'bg-blue-600 hover:bg-blue-700'
                                      : 'bg-emerald-600 hover:bg-emerald-700'
                                  )}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onAddPayment(order)
                                  }}
                                >
                                  {isDeposit ? (
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

                    {/* Dòng 2: Phương thức • Ngày gọn (bỏ giờ) */}
                    <div
                      className="text-xs text-muted-foreground truncate max-w-[155px] flex items-center gap-1"
                      title={`${latestPayment.paymentMethod} • ${formatPaymentDateOnly(latestPayment.paidAt)}`}
                    >
                      <span className="text-foreground/85 font-normal truncate">{latestPayment.paymentMethod}</span>
                      <span className="text-muted-foreground/40">•</span>
                      <span className="font-mono shrink-0">{formatPaymentDateOnly(latestPayment.paidAt)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-start gap-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">Chưa có giao dịch</span>
                      {isDeposit && (
                        <Badge
                          variant="outline"
                          className="text-[11px] px-1.5 py-0 h-4.5 font-medium rounded bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300"
                        >
                          Cọc
                        </Badge>
                      )}
                    </div>
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

              {/* CỘT 6: CHUYỂN GIAO SP/DV (KÍCH HOẠT HỌC VIÊN & BÀN GIAO SẢN PHẨM) */}
              <TableCell className="py-3 px-3">
                <OrderFulfillmentCell order={order} />
              </TableCell>

              {/* CỘT 7: TRẠNG THÁI (STATUS BADGE + NGÀY GIỜ CẬP NHẬT Ở DÒNG DƯỚI) */}
              <TableCell className="py-3 px-3">
                {(() => {
                  const effectiveStatus = getOrderEffectiveStatus(order)
                  return (
                    <div className="flex flex-col gap-1 items-start">
                      <StatusBadge
                        status={effectiveStatus}
                        label={getOrderStatusLabel(effectiveStatus)}
                        withDot
                      />
                      {/* Dòng 2: Ngày giờ cập nhật */}
                      <span
                        className="text-xs text-muted-foreground font-mono pl-0.5"
                        title={`Thời gian cập nhật: ${updatedTime}`}
                      >
                        {updatedTime}
                      </span>
                    </div>
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
