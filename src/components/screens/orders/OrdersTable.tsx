'use client'

import { useState } from 'react'
import {
  Receipt,
  Ban,
  Check,
  Copy,
  ExternalLink,
  CreditCard,
  Banknote,
  Truck,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  EmptyState,
  PersonnelHoverCard,
  StatusBadge,
} from '@/components/shared'
import { formatCurrency, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Order } from '@/mocks/orders'
import {
  formatPhoneMaskMiddle,
  getOrderCustomerInfo,
  getOrderEffectiveStatus,
  getOrderPhone,
  getOrderStatusLabel,
  getStaffPersonnel,
  isOrderDeposit,
} from './ordersHelpers'
import { OrderFulfillmentCell } from './OrderFulfillmentCell'

interface OrdersTableProps {
  orders: Order[]
  onRowClick: (order: Order) => void
  onView?: (order: Order) => void
  onCancel: (order: Order) => void
  onAddPayment?: (order: Order) => void
  onQuickPay?: (order: Order) => void
  onQuickFulfill?: (order: Order) => void
}

export function OrdersTable({
  orders,
  onRowClick,
  onCancel,
  onAddPayment,
  onQuickPay,
  onQuickFulfill,
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
          {/* CỘT 3: GÓI SẢN PHẨM (THU HẸP) */}
          <TableHead className="w-[160px] min-w-[150px]">Gói sản phẩm</TableHead>
          {/* CỘT 4: TỔNG TIỀN */}
          <TableHead className="w-[130px] min-w-[120px]">Tổng tiền</TableHead>
          {/* CỘT 5: LỊCH SỬ THANH TOÁN */}
          <TableHead className="w-[170px] min-w-[160px]">Lịch sử thanh toán</TableHead>
          {/* CỘT 6: CHUYỂN GIAO SP/DV */}
          <TableHead className="w-[190px] min-w-[180px]">Chuyển giao SP/DV</TableHead>
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
          const customerInfo = getOrderCustomerInfo(order)
          const rawPhone = getOrderPhone(order)
          const maskedPhone = formatPhoneMaskMiddle(rawPhone)
          const staffName = order.saleBy || 'Nguyễn Văn Sale'
          const staffPersonnel = getStaffPersonnel(staffName)
          const isDeposit = isOrderDeposit(order)
          const distinctStudents = Array.from(
            new Set(
              order.items
                .map((i) => i.studentName)
                .filter((name): name is string => Boolean(name && name.trim()))
            )
          )
          const studentsList =
            distinctStudents.length > 0 ? distinctStudents : [order.studentName].filter(Boolean)
          const fullStudentsText = studentsList.join(', ')
          const studentDisplayText =
            studentsList.length > 1
              ? `${studentsList[0]}, ...`
              : (studentsList[0] || '---')

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
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (onQuickFulfill) onQuickFulfill(order)
                        }}
                        className="p-0.5 text-muted-foreground/70 hover:text-blue-600 rounded transition-colors cursor-pointer"
                        title="Tạo phiếu giao hàng / Bàn giao SP/DV"
                        aria-label="Tạo phiếu giao hàng"
                      >
                        <Truck className="h-3 w-3" />
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

                    {/* 2. Nút Tạo phiếu giao hàng / Bàn giao */}
                    {cancellable && onQuickFulfill && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          onQuickFulfill(order)
                        }}
                        title="Tạo phiếu giao hàng / Bàn giao SP/DV"
                      >
                        <Truck className="h-3.5 w-3.5" />
                      </Button>
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
                      className="truncate font-normal text-xs text-foreground"
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

              {/* CỘT 3: GÓI SẢN PHẨM (THU HẸP) */}
              <TableCell className="py-3 px-3">
                <div className="flex flex-col gap-0.5 text-xs min-w-0 max-w-[160px]">
                  {/* Dòng 1: Thống kê tổng số lượng gói */}
                  <span className="font-normal text-xs text-foreground truncate">
                    {order.items.length === 1 ? '1 gói sản phẩm' : `${order.items.length} gói sản phẩm`}
                  </span>

                  {/* Dòng 2: Con:... nếu nhiều thì ..., không hiển thị dòng 3 */}
                  <div
                    className="text-xs text-muted-foreground truncate"
                    title={`Con: ${fullStudentsText}`}
                  >
                    <span>Con: </span>
                    <span className="text-foreground font-normal">{studentDisplayText}</span>
                  </div>
                </div>
              </TableCell>

              {/* CỘT 4: TỔNG TIỀN */}
              <TableCell className="py-3 px-3">
                <div className="flex flex-col gap-0.5">
                  {/* Dòng 1: Tổng tiền */}
                  <span className="font-normal text-xs font-mono text-foreground">
                    {formatCurrency(order.finalAmount)}
                  </span>
                  {/* Dòng 2: Giá giảm */}
                  <span className="text-xs text-muted-foreground font-mono">
                    Giảm: {formatCurrency(order.discountAmount || 0)}
                  </span>
                </div>
              </TableCell>

              {/* CỘT 5: LỊCH SỬ THANH TOÁN */}
              <TableCell className="py-3 px-3">
                <div className="flex flex-col gap-0.5 text-xs">
                  {/* Dòng 1: Chỉ hiển thị tổng đã thu */}
                  <span
                    className={cn(
                      'font-mono font-normal',
                      paidAmount > 0 ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {formatCurrency(paidAmount)}
                  </span>

                  {/* Dòng 2: Còn: ... & Nút thu nợ nhanh */}
                  <div className="text-xs">
                    {order.status === 'cancelled' ? (
                      <span className="text-muted-foreground">Đơn đã hủy</span>
                    ) : order.status === 'refunded' ? (
                      <span className="text-muted-foreground">Đã hoàn tiền</span>
                    ) : remainingAmount > 0 ? (
                      <div className="whitespace-nowrap inline-flex items-center gap-1 text-xs">
                        <span className="font-mono text-amber-600 dark:text-amber-400 font-normal">
                          Còn: {formatCurrency(remainingAmount)}
                        </span>
                        {cancellable && onQuickPay && (
                          <>
                            <span className="text-muted-foreground/40 font-normal">•</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onQuickPay(order)
                              }}
                              className="text-primary hover:underline text-xs font-normal cursor-pointer transition-colors"
                              title={`Thu khoản nợ ${formatCurrency(remainingAmount)}`}
                            >
                              Thu nợ
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-normal whitespace-nowrap">
                        Đã thu đủ
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* CỘT 6: CHUYỂN GIAO SP/DV (KÍCH HOẠT HỌC VIÊN & BÀN GIAO SẢN PHẨM) */}
              <TableCell className="py-3 px-3">
                <OrderFulfillmentCell order={order} onQuickFulfill={onQuickFulfill} />
              </TableCell>

              {/* CỘT 7: TRẠNG THÁI (CHỈ HIỂN THỊ STATUS BADGE) */}
              <TableCell className="py-3 px-3">
                {(() => {
                  const effectiveStatus = getOrderEffectiveStatus(order)
                  return (
                    <StatusBadge
                      status={effectiveStatus}
                      label={getOrderStatusLabel(effectiveStatus)}
                      withDot
                    />
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
