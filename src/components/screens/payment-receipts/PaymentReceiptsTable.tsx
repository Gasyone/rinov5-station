'use client'

import { Eye, Copy, Check, ArrowDownLeft, ArrowUpRight, User, GraduationCap, Plus } from 'lucide-react'
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
import { formatCurrency, maskPhoneNumber } from './paymentReceiptsHelpers'
import { PaymentReceiptOrderPopover } from './PaymentReceiptOrderPopover'

interface PaymentReceiptsTableProps {
  receipts: PaymentReceipt[]
  totalItems: number
  currentPage: number
  pageSize: number
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
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[44px] px-3 shrink-0">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Chọn tất cả phiếu thanh toán"
              />
            </TableHead>
            <TableHead className="w-[16%] min-w-[150px]">Phiếu thanh toán</TableHead>
            <TableHead className="w-[15%] min-w-[140px]">Học viên & Liên hệ</TableHead>
            <TableHead className="w-[18%] min-w-[160px]">Đơn hàng</TableHead>
            <TableHead className="w-[13%] min-w-[120px]">Số tiền giao dịch</TableHead>
            <TableHead className="w-[13%] min-w-[130px]">Giá trị đơn & Còn lại</TableHead>
            <TableHead className="w-[13%] min-w-[130px]">Phương thức & Tài khoản</TableHead>
            <TableHead className="w-[10%] min-w-[100px]">Trạng thái</TableHead>
            <TableHead className="w-[12%] min-w-[120px]">Người lập & Ngày</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedReceipts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground text-xs">
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

                  {/* CỘT 1: PHIẾU THANH TOÁN (HIGHLIGHT: TÊN PHỤ HUYNH + MÃ TNX + THU/CHI) */}
                  <TableCell className="relative text-xs cursor-pointer py-3" onClick={() => onViewDetail(rcpt)}>
                    <div className="flex flex-col gap-1 pr-6">
                      {/* Dòng 1: Tên Phụ huynh / Khách hàng thanh toán */}
                      <div className="flex items-center gap-1.5 font-semibold text-foreground truncate" title={rcpt.parentName}>
                        <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{rcpt.parentName}</span>
                      </div>

                      {/* Dòng 2: Nhãn Thu/Chi + Mã phiếu TNX */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isReceipt ? (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <ArrowDownLeft className="h-3 w-3 shrink-0" />
                            <span>Thu</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                            <ArrowUpRight className="h-3 w-3 shrink-0" />
                            <span>Chi</span>
                          </span>
                        )}

                        <span className="font-mono font-bold text-primary hover:underline text-xs">
                          {rcpt.code}
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

                  {/* CỘT 2: HỌC VIÊN & LIÊN HỆ */}
                  <TableCell className="py-3">
                    <div className="flex flex-col gap-0.5 text-xs font-normal">
                      {/* Dòng 1: Tên các bé / Học viên */}
                      <div className="flex items-center gap-1.5 text-foreground truncate" title={rcpt.studentName}>
                        <GraduationCap className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{rcpt.studentName}</span>
                      </div>

                      {/* Dòng 2: SĐT bên dưới */}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono mt-0.5">
                        <span>{maskPhoneNumber(rcpt.phone)}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                          onClick={(e) => handleCopyPhone(e, rcpt.phone, rcpt.id)}
                          title="Sao chép SĐT"
                        >
                          {copiedId === rcpt.id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
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

                  {/* CỘT 5: GIÁ TRỊ ĐƠN & CÒN LẠI */}
                  <TableCell className="py-3 text-xs">
                    <div className="flex flex-col gap-0.5">
                      <div className="text-xs text-muted-foreground font-normal truncate">
                        Tổng: <span className="font-mono text-foreground">{formatCurrency(rcpt.orderTotalAmount)}</span>
                      </div>
                      {rcpt.orderRemainingAmount === 0 ? (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          ✓ Đã tất toán
                        </span>
                      ) : (
                        <div className="flex flex-col">
                          <span className="text-xs text-amber-700 dark:text-amber-400 font-normal truncate">
                            Còn nợ: <span className="font-mono font-medium">{formatCurrency(rcpt.orderRemainingAmount)}</span>
                          </span>
                          {onPayMore && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onPayMore(rcpt)
                              }}
                              className="text-xs text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline font-medium text-left mt-0.5 cursor-pointer"
                            >
                              + Thu tiếp đợt 2
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* CỘT 6: PHƯƠNG THỨC & TÀI KHOẢN */}
                  <TableCell className="py-3 text-xs">
                    <div className="flex flex-col gap-0.5 font-normal">
                      <span className="text-foreground truncate">{PAYMENT_METHOD_MAP[rcpt.paymentMethod]}</span>
                      <span className="text-xs text-muted-foreground font-mono truncate max-w-[170px]" title={rcpt.bankAccount || 'Tiền mặt tại quầy'}>
                        {rcpt.bankAccount || 'Tiền mặt tại quầy'}
                      </span>
                    </div>
                  </TableCell>

                  {/* CỘT 7: TRẠNG THÁI & ĐỐI SOÁT */}
                  <TableCell className="py-3">
                    <div className="flex flex-col gap-0.5">
                      <div>
                        <Badge className={`text-xs py-0.5 px-1.5 font-normal ${getStatusBadgeClass(rcpt.status)}`}>
                          {RECEIPT_STATUS_MAP[rcpt.status] || rcpt.status}
                        </Badge>
                      </div>
                      <span className={cn(
                        'text-xs font-normal',
                        rcpt.isReconciled
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-600 dark:text-amber-400'
                      )}>
                        {rcpt.isReconciled ? 'Đã đối soát' : 'Chưa đối soát'}
                      </span>
                    </div>
                  </TableCell>

                  {/* CỘT 8: NGƯỜI LẬP & NGÀY */}
                  <TableCell className="py-3 text-xs">
                    <div className="flex flex-col gap-0.5 font-normal">
                      <span className="text-foreground truncate max-w-[160px]" title={rcpt.createdBy}>
                        {rcpt.createdBy}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">{rcpt.createdAt}</span>
                    </div>
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



