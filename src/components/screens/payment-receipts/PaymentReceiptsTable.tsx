'use client'

import { Eye, Copy, Check, ExternalLink } from 'lucide-react'
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
import { formatCurrency } from './paymentReceiptsHelpers'

interface PaymentReceiptsTableProps {
  receipts: PaymentReceipt[]
  totalItems: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onViewDetail: (receipt: PaymentReceipt) => void
}

export function PaymentReceiptsTable({
  receipts,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onViewDetail,
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
      className="rounded-t-lg rounded-b-none border-b-0 border-r-0 h-full"
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
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[40px] px-3">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Chọn tất cả phiếu thu"
              />
            </TableHead>
            <TableHead className="w-[140px]">Mã phiếu thu</TableHead>
            <TableHead className="w-[140px]">Mã đơn hàng</TableHead>
            <TableHead className="w-[180px]">Học viên / Phụ huynh</TableHead>
            <TableHead className="w-[140px]">Loại khoản thu</TableHead>
            <TableHead className="w-[140px]">Số tiền thu</TableHead>
            <TableHead className="w-[160px]">Hình thức thanh toán</TableHead>
            <TableHead className="w-[130px]">Trạng thái</TableHead>
            <TableHead className="min-w-[160px]">Người lập & Ngày</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedReceipts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground text-xs">
                Không tìm thấy phiếu thu nào phù hợp bộ lọc.
              </TableCell>
            </TableRow>
          ) : (
            paginatedReceipts.map((rcpt) => {
              const isSelected = selectedIds.includes(rcpt.id)
              const typeConfig = RECEIPT_TYPE_MAP[rcpt.receiptType]
              const statusConfig = RECEIPT_STATUS_MAP[rcpt.status]

              return (
                <TableRow
                  key={rcpt.id}
                  className={isSelected ? 'bg-muted/50 group' : 'hover:bg-muted/30 group'}
                >
                  <TableCell className="px-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleSelectRow(rcpt.id, Boolean(checked))
                      }
                      aria-label={`Chọn phiếu thu ${rcpt.code}`}
                    />
                  </TableCell>

                  {/* Mã phiếu thu + Xem chi tiết */}
                  <TableCell className="relative font-mono font-bold text-foreground text-xs cursor-pointer" onClick={() => onViewDetail(rcpt)}>
                    <div className="flex flex-col">
                      <span className="text-primary hover:underline">{rcpt.code}</span>
                      <span className="text-[10px] text-muted-foreground font-normal">{rcpt.branch}</span>
                    </div>

                    <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-primary hover:bg-primary/10 rounded-full"
                        onClick={() => onViewDetail(rcpt)}
                        title="Xem chi tiết Phiếu thu"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>

                  {/* Mã đơn hàng liên kết */}
                  <TableCell>
                    <a
                      href={`/quote/${rcpt.orderCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-sky-700 dark:text-sky-300 font-semibold hover:underline inline-flex items-center gap-1"
                      title="Mở Landing Page Báo giá / Đơn hàng"
                    >
                      <ExternalLink className="h-3 w-3 text-sky-600 shrink-0" />
                      <span>{rcpt.orderCode}</span>
                    </a>
                  </TableCell>

                  {/* Học viên & Phụ huynh */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5 text-xs">
                      <span className="font-bold text-foreground">{rcpt.studentName}</span>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <span>PH: {rcpt.parentName}</span>
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

                  {/* Loại khoản thu */}
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] py-0.5 px-1.5 font-normal ${typeConfig.class}`}>
                      {typeConfig.label}
                    </Badge>
                  </TableCell>

                  {/* Số tiền thu */}
                  <TableCell className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                    {formatCurrency(rcpt.amount)}
                  </TableCell>

                  {/* Phương thức thanh toán */}
                  <TableCell className="text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-foreground">{PAYMENT_METHOD_MAP[rcpt.paymentMethod]}</span>
                      {rcpt.bankAccount && (
                        <span className="text-[10px] text-muted-foreground font-mono truncate">{rcpt.bankAccount}</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Trạng thái phiếu */}
                  <TableCell>
                    <Badge className={`text-[10px] py-0.5 px-1.5 ${statusConfig.class}`}>
                      {statusConfig.label}
                    </Badge>
                  </TableCell>

                  {/* Người lập & Ngày */}
                  <TableCell className="text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-foreground truncate max-w-[150px]" title={rcpt.createdBy}>
                        {rcpt.createdBy}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">{rcpt.createdAt}</span>
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
