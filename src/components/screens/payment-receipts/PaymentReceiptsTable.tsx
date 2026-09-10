'use client'

import { Eye, Copy, Check, ArrowDownLeft, ArrowUpRight, User, Plus, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  PaymentReceipt,
  RECEIPT_TYPE_MAP,
  PAYMENT_METHOD_MAP,
  RECEIPT_STATUS_MAP,
} from '@/mocks/paymentReceipts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTableFrame, DataTablePagination } from '@/components/data-table'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import { formatCurrency, maskPhoneNumber, formatReceiptDate } from './paymentReceiptsHelpers'
import { PaymentReceiptOrderPopover } from './PaymentReceiptOrderPopover'
import type { ReceiptSortField, ReceiptSortDirection } from './paymentReceiptsTypes'

interface PaymentReceiptsTableProps {
  receipts: PaymentReceipt[]
  totalItems: number
  currentPage: number
  pageSize: number
  sortField?: ReceiptSortField
  sortDirection?: ReceiptSortDirection
  onSortChange?: (field: ReceiptSortField) => void
  onSelectStaff?: (staff: string) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onViewDetail: (receipt: PaymentReceipt) => void
  onPayMore?: (receipt: PaymentReceipt) => void
}

export function PaymentReceiptsTable({
  receipts,
  totalItems,
  currentPage,
  pageSize,
  sortField,
  sortDirection,
  onSortChange,
  onSelectStaff,
  onPageChange,
  onPageSizeChange,
  onViewDetail,
  onPayMore,
}: PaymentReceiptsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const startIdx = (currentPage - 1) * pageSize
  const paginatedReceipts = receipts.slice(startIdx, startIdx + pageSize)

  const isAllSelected =
    paginatedReceipts.length > 0 &&
    paginatedReceipts.every((r) => selectedIds.includes(r.id))

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedReceipts.map((r) => r.id)
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])))
    } else {
      const pageIds = paginatedReceipts.map((r) => r.id)
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)))
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id))
    }
  }

  const handleCopyPhone = (e: React.MouseEvent, phone: string, id: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(phone)
    setCopiedId(id)
    toast.success(`Đã sao chép SĐT: ${phone}`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <DataTableFrame
      className="rounded-t-lg rounded-b-none border-b-0 border-r-0 h-full w-full"
      footer={
        <DataTablePagination
          page={currentPage}
          pageSize={pageSize}
          total={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      }
    >
      <Table className="w-full table-fixed" containerClassName="overflow-visible min-h-full">
        <TableHeader className="sticky top-0 z-20 bg-muted/95 backdrop-blur-xs shadow-2xs">
          <TableRow className="bg-muted/60 border-b border-border/80">
            <TableHead className="w-[44px] px-3 shrink-0 sticky top-0 z-20 bg-muted/95 backdrop-blur-xs border-b border-border/80">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Chọn tất cả phiếu thanh toán"
              />
            </TableHead>
            <TableHead className="w-[22%] min-w-[180px] sticky top-0 z-20 bg-muted/95 backdrop-blur-xs border-b border-border/80">
              <button
                type="button"
                onClick={() => onSortChange?.('createdAt')}
                className="inline-flex items-center gap-1.5 hover:text-foreground font-semibold transition-colors cursor-pointer select-none text-left"
                title="Sắp xếp theo ngày lập phiếu"
              >
                <span>Phiếu thanh toán</span>
                {sortField === 'createdAt' ? (
                  sortDirection === 'asc' ? (
                    <ArrowUp className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <ArrowDown className="h-3.5 w-3.5 text-primary" />
                  )
                ) : (
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                )}
              </button>
            </TableHead>
            <TableHead className="w-[18%] min-w-[150px] sticky top-0 z-20 bg-muted/95 backdrop-blur-xs border-b border-border/80">Khách hàng</TableHead>
            <TableHead className="w-[20%] min-w-[170px] sticky top-0 z-20 bg-muted/95 backdrop-blur-xs border-b border-border/80">Đơn hàng</TableHead>
            <TableHead className="w-[15%] min-w-[130px] sticky top-0 z-20 bg-muted/95 backdrop-blur-xs border-b border-border/80">
              <button
                type="button"
                onClick={() => onSortChange?.('amount')}
                className="inline-flex items-center gap-1.5 hover:text-foreground font-semibold transition-colors cursor-pointer select-none text-left"
                title="Sắp xếp theo số tiền giao dịch"
              >
                <span>Số tiền giao dịch</span>
                {sortField === 'amount' ? (
                  sortDirection === 'asc' ? (
                    <ArrowUp className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <ArrowDown className="h-3.5 w-3.5 text-primary" />
                  )
                ) : (
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                )}
              </button>
            </TableHead>
            <TableHead className="w-[15%] min-w-[130px] sticky top-0 z-20 bg-muted/95 backdrop-blur-xs border-b border-border/80">Phương thức & Tài khoản</TableHead>
            <TableHead className="w-[10%] min-w-[100px] sticky top-0 z-20 bg-muted/95 backdrop-blur-xs border-b border-border/80">Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedReceipts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                Không tìm thấy phiếu thanh toán nào phù hợp bộ lọc.
              </TableCell>
            </TableRow>
          ) : (
            paginatedReceipts.map((rcpt, idx) => {
              const isSelected = selectedIds.includes(rcpt.id)
              const isReceipt = rcpt.transactionType === 'receipt'

              return (
                <TableRow
                  key={rcpt.id}
                  className={cn(
                    isSelected
                      ? 'bg-primary/10 dark:bg-primary/20'
                      : idx % 2 === 1
                        ? 'bg-muted/60 dark:bg-zinc-800/40'
                        : 'bg-background',
                    'hover:bg-muted/80 dark:hover:bg-muted/60 transition-colors group'
                  )}
                >
                  <TableCell className="px-3 py-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleSelectRow(rcpt.id, Boolean(checked))
                      }
                      aria-label={`Chọn phiếu ${rcpt.code}`}
                    />
                  </TableCell>

                  {/* CỘT 1: PHIẾU THANH TOÁN (MÃ TNX + ICON THU/CHI, DÒNG DƯỚI: NGƯỜI LẬP • NGÀY LẬP) */}
                  <TableCell className="relative text-xs cursor-pointer py-3" onClick={() => onViewDetail(rcpt)}>
                    <div className="flex flex-col gap-1 pr-6 min-w-0">
                      {/* Dòng 1: Icon Thu/Chi + Mã TNX */}
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span title={isReceipt ? 'Phiếu thu' : 'Phiếu chi'} className="inline-flex shrink-0">
                          {isReceipt ? (
                            <ArrowDownLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                          )}
                        </span>
                        <span className="font-mono font-bold text-primary hover:underline text-xs truncate">
                          {rcpt.code}
                        </span>
                      </div>

                      {/* Dòng 2: Người lập • Ngày lập */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
                        <span
                          className={cn(
                            'truncate max-w-[120px]',
                            onSelectStaff && 'hover:text-primary hover:underline cursor-pointer'
                          )}
                          title={`Người lập: ${rcpt.createdBy}${onSelectStaff ? ' (Bấm để lọc)' : ''}`}
                          onClick={(e) => {
                            if (onSelectStaff) {
                              e.stopPropagation()
                              onSelectStaff(rcpt.createdBy)
                            }
                          }}
                        >
                          {rcpt.createdBy}
                        </span>
                        <span className="text-muted-foreground/40 shrink-0">•</span>
                        <span className="font-mono shrink-0 text-xs" title={`Ngày lập: ${rcpt.createdAt}`}>
                          {formatReceiptDate(rcpt.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Action button on hover */}
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-primary hover:bg-primary/10 rounded-full"
                        onClick={() => onViewDetail(rcpt)}
                        title="Xem chi tiết Phiếu thanh toán"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {rcpt.orderRemainingAmount > 0 && onPayMore && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-full"
                          onClick={() => onPayMore(rcpt)}
                          title="Thanh toán nhiều lần / Thanh toán thêm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>

                  {/* CỘT 2: KHÁCH HÀNG (TÊN + SỐ ĐIỆN THOẠI MÃ HÓA *******xxx CÓ NÚT COPY) */}
                  <TableCell className="py-3">
                    <div className="flex flex-col gap-0.5 text-xs font-normal">
                      {/* Dòng 1: Tên Khách hàng */}
                      <div
                        className="flex items-center gap-1.5 font-semibold text-foreground truncate"
                        title={`Khách hàng: ${rcpt.parentName || rcpt.studentName}${rcpt.studentName && rcpt.studentName !== rcpt.parentName ? ` (Học viên: ${rcpt.studentName})` : ''}`}
                      >
                        <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{rcpt.parentName || rcpt.studentName}</span>
                      </div>

                      {/* Dòng 2: SĐT bên dưới (encoding: *******xxx, có nút copy) */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono mt-0.5">
                        <span title={rcpt.phone}>{maskPhoneNumber(rcpt.phone)}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                          onClick={(e) => handleCopyPhone(e, rcpt.phone, rcpt.id)}
                          title={copiedId === rcpt.id ? 'Đã sao chép SĐT!' : 'Sao chép SĐT'}
                          aria-label="Sao chép số điện thoại"
                        >
                          {copiedId === rcpt.id ? (
                            <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </TableCell>

                  {/* CỘT 3: ĐƠN HÀNG (POPOVER DANH SÁCH ĐƠN HÀNG) */}
                  <TableCell className="py-3">
                    <PaymentReceiptOrderPopover receipt={rcpt} />
                  </TableCell>

                  {/* CỘT 4: SỐ TIỀN GIAO DỊCH + LOẠI GIAO DỊCH BÊN DƯỚI */}
                  <TableCell className="py-3 text-xs">
                    <div className="flex flex-col gap-0.5">
                      <div className="font-mono font-semibold">
                        {isReceipt ? (
                          <span className="text-emerald-700 dark:text-emerald-400">
                            +{formatCurrency(rcpt.amount)}
                          </span>
                        ) : (
                          <span className="text-rose-700 dark:text-rose-400">
                            -{formatCurrency(rcpt.amount)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground font-normal truncate" title={RECEIPT_TYPE_MAP[rcpt.receiptType] || rcpt.receiptType}>
                        {RECEIPT_TYPE_MAP[rcpt.receiptType] || rcpt.receiptType}
                      </span>
                    </div>
                  </TableCell>

                  {/* CỘT 5: PHƯƠNG THỨC & TÀI KHOẢN */}
                  <TableCell className="py-3 text-xs">
                    <div className="flex flex-col gap-0.5 font-normal">
                      <span className="text-foreground truncate">{PAYMENT_METHOD_MAP[rcpt.paymentMethod]}</span>
                      <span className="text-xs text-muted-foreground font-mono truncate max-w-[170px]" title={rcpt.bankAccount || 'Tiền mặt tại quầy'}>
                        {rcpt.bankAccount || 'Tiền mặt tại quầy'}
                      </span>
                    </div>
                  </TableCell>

                  {/* CỘT 6: TRẠNG THÁI */}
                  <TableCell className="py-3">
                    <Badge className={`text-xs py-0.5 px-1.5 font-normal ${getStatusBadgeClass(rcpt.status)}`}>
                      {RECEIPT_STATUS_MAP[rcpt.status] || rcpt.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </DataTableFrame>
  )
}



