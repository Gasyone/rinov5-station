'use client'

import { useState } from 'react'
import { Receipt, Eye, Ban, FileText, History } from 'lucide-react'
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

export function OrdersTable({ orders, onRowClick, onView, onCancel }: OrdersTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const isAllSelected =
    orders.length > 0 && orders.every((o) => selectedIds.includes(o.id))

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
      setSelectedIds((prev) => prev.filter((i) => i !== id))
    }
  }

  if (orders.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          icon={<Receipt className="h-7 w-7 text-muted-foreground" />}
          title="Không tìm thấy đơn hàng nào"
          description="Vui lòng thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm."
        />
      </div>
    )
  }

  return (
    <Table containerClassName="min-w-full" className="min-w-[1250px]">
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          <TableHead className="min-w-[200px] px-3">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Chọn tất cả đơn hàng"
              />
              <span>Đơn hàng & Thao tác</span>
            </div>
          </TableHead>

          <TableHead className="min-w-[160px]">Học viên</TableHead>
          <TableHead className="min-w-[180px]">Gói sản phẩm</TableHead>
          <TableHead className="min-w-[140px]">Tổng tiền</TableHead>
          {/* TÁCH RIÊNG CỘT THỰC ĐÓNG & CÒN NỢ */}
          <TableHead className="min-w-[240px]">Thực đóng & Còn nợ</TableHead>
          <TableHead className="min-w-[160px]">Hình thức & Thu tiền</TableHead>
          <TableHead className="min-w-[120px]">Người bán</TableHead>
          <TableHead className="min-w-[120px]">Ngày tạo</TableHead>
          <TableHead className="min-w-[110px]">Trạng thái đơn</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const isSelected = selectedIds.includes(order.id)
          const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)
          const cancellable = order.status !== 'cancelled' && order.status !== 'refunded'
          const paidAmount = order.paidAmount ?? (order.paymentStatus === 'paid' ? order.finalAmount : 0)
          const remainingAmount = order.remainingAmount ?? Math.max(0, order.finalAmount - paidAmount)
          const history = order.paymentHistory ?? []
          const latestPayment = history.length > 0 ? history[history.length - 1] : null

          return (
            <TableRow
              key={order.id}
              className={isSelected ? 'bg-muted/50 group' : 'hover:bg-muted/30 group'}
            >
              {/* CỘT 1: CHECKBOX + MÃ ĐƠN + ACTION BUTTONS */}
              <TableCell className="px-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleSelectRow(order.id, Boolean(checked))}
                    aria-label={`Chọn đơn ${order.orderNo}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate font-mono text-xs font-bold text-sky-700 dark:text-sky-300 hover:underline cursor-pointer"
                      onClick={() => onRowClick(order)}
                    >
                      {order.orderNo}
                    </p>
                    <p className="truncate text-[10px] text-muted-foreground">{order.branch}</p>
                  </div>

                  {/* Nút Action trực tiếp trong cột Order */}
                  <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => onView(order)}
                      title="Xem chi tiết đơn"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    {cancellable && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-red-600"
                        onClick={() => onCancel(order)}
                        title="Hủy đơn hàng"
                      >
                        <Ban className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* CỘT 2: HỌC VIÊN */}
              <TableCell>
                <EntityCell
                  name={order.studentName}
                  supporting={order.studentId.toUpperCase()}
                />
              </TableCell>

              {/* CỘT 3: GÓI SẢN PHẨM */}
              <TableCell>
                <div className="min-w-0 text-xs">
                  <p className="truncate font-medium text-foreground">{order.items[0]?.productName ?? '—'}</p>
                  {totalItems > order.items[0]?.quantity ? (
                    <p className="text-[10px] text-muted-foreground">
                      +{totalItems - (order.items[0]?.quantity ?? 0)} món khác
                    </p>
                  ) : (
                    <p className="text-[10px] text-muted-foreground">
                      {totalItems} món
                    </p>
                  )}
                </div>
              </TableCell>

              {/* CỘT 4: TỔNG TIỀN (TÁCH RIÊNG CỘT) */}
              <TableCell>
                <div className="flex flex-col gap-0.5 text-xs font-mono">
                  <span className="font-bold text-foreground">
                    {formatCurrency(order.finalAmount)}
                  </span>
                  {order.discountAmount > 0 && (
                    <span className="text-[10px] text-muted-foreground">
                      Giảm: -{formatCurrency(order.discountAmount)}
                    </span>
                  )}
                </div>
              </TableCell>

              {/* CỘT 5: THỰC ĐÓNG & CÒN NỢ (TÁCH RIÊNG CỘT KÈM LẦN ĐÓNG GẦN NHẤT & HOVER BONG BÓNG POPOVER (N)) */}
              <TableCell>
                <div className="flex flex-col gap-0.5 text-xs">
                  {/* Line 1: Tổng đã đóng + Icon (N) nếu có nhiều lần đóng */}
                  <div className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                    <span>Đã đóng: {formatCurrency(paidAmount)}</span>

                    {/* Nếu đóng nhiều hơn 1 lần: Thêm icon (N) mở Popover Hover/Click Bong bóng lịch sử */}
                    {history.length > 1 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-5 px-1 py-0 text-[11px] font-semibold text-sky-700 dark:text-sky-300 bg-transparent hover:bg-sky-50 dark:hover:bg-sky-950 border-0 shadow-none gap-0.5"
                            title="Nhấp xem lịch sử các lần đóng tiền"
                          >
                            <FileText className="h-3 w-3" />
                            <span>({history.length})</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-80 p-3 text-xs shadow-xl border bg-background">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b">
                            <span className="font-bold text-foreground inline-flex items-center gap-1">
                              <History className="h-3.5 w-3.5 text-sky-600" />
                              Lịch sử đóng tiền ({history.length} lần)
                            </span>
                            <span className="font-mono text-[11px] font-semibold text-emerald-600">
                              Tổng: {formatCurrency(paidAmount)}
                            </span>
                          </div>
                          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                            {history.map((rec) => (
                              <div key={rec.id} className="flex flex-col gap-0.5 p-2 rounded bg-muted/40 border border-border/50 text-[11px]">
                                <div className="flex items-center justify-between font-bold">
                                  <span className="text-foreground">Lần {rec.sequenceNo} ({rec.paidAt})</span>
                                  <span className="font-mono text-emerald-700 dark:text-emerald-400">{formatCurrency(rec.amount)}</span>
                                </div>
                                <div className="text-muted-foreground">
                                  <span>Loại: <strong className="text-foreground">{rec.paymentType}</strong></span>
                                </div>
                                <div className="text-muted-foreground">
                                  <span>PTTT: <strong className="text-foreground">{rec.paymentMethod}</strong> {rec.bankAccount ? `(${rec.bankAccount})` : ''}</span>
                                </div>
                                {rec.note && <div className="text-[10px] italic text-muted-foreground">Ghi chú: {rec.note}</div>}
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>

                  {/* Line 2: Lần đóng gần nhất */}
                  {latestPayment ? (
                    <div className="text-[10px] text-muted-foreground truncate max-w-[230px]" title={`Gần nhất (${latestPayment.paidAt}): ${formatCurrency(latestPayment.amount)} - ${latestPayment.paymentType} (${latestPayment.paymentMethod})`}>
                      <span className="font-semibold text-foreground">Gần nhất ({latestPayment.paidAt}):</span> {latestPayment.paymentType} ({latestPayment.paymentMethod})
                    </div>
                  ) : (
                    <div className="text-[10px] text-muted-foreground">Chưa có giao dịch</div>
                  )}

                  {/* Line 3: Số tiền còn nợ */}
                  {remainingAmount > 0 ? (
                    <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                      Còn nợ: {formatCurrency(remainingAmount)}
                    </div>
                  ) : (
                    <div className="text-[10px] text-muted-foreground">
                      Còn lại: 0 đ
                    </div>
                  )}
                </div>
              </TableCell>

              {/* CỘT 6: HÌNH THỨC & TRẠNG THÁI THU TIỀN (Ghi rõ phương thức lần đầu) */}
              <TableCell>
                <div className="flex flex-col gap-1 text-xs">
                  <StatusBadge status={order.paymentStatus} className="self-start" />
                  <Badge variant="outline" className="self-start rounded-md text-[10px] py-0 px-1.5 font-normal">
                    Lần đầu: {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                  </Badge>
                </div>
              </TableCell>

              {/* CỘT 7: NGƯỜI BÁN */}
              <TableCell className="text-xs text-muted-foreground">{order.saleBy}</TableCell>

              {/* CỘT 8: NGÀY TẠO */}
              <TableCell className="text-xs text-muted-foreground">
                {formatDateTime(order.createdAt)}
              </TableCell>

              {/* CỘT 9: TRẠNG THÁI ĐƠN HÀNG */}
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
