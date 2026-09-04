'use client'

import { Plus, ExternalLink, User, GraduationCap } from 'lucide-react'
import { useState } from 'react'
import { ReceivableItem, RECEIPT_TYPE_MAP } from '@/mocks/paymentReceipts'
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
import { formatCurrency, maskPhoneNumber } from './paymentReceiptsHelpers'

interface ReceivablesTableProps {
  receivables: ReceivableItem[]
  totalItems: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onCreateReceiptForItem: (item: ReceivableItem) => void
}

export function ReceivablesTable({
  receivables,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onCreateReceiptForItem,
}: ReceivablesTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const startIdx = (currentPage - 1) * pageSize
  const paginatedReceivables = receivables.slice(startIdx, startIdx + pageSize)

  const isAllSelected =
    paginatedReceivables.length > 0 &&
    paginatedReceivables.every((r) => selectedIds.includes(r.id))

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedReceivables.map((r) => r.id)
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])))
    } else {
      const pageIds = paginatedReceivables.map((r) => r.id)
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
            <TableHead className="w-[48px] px-3 shrink-0">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Chọn tất cả khoản cần thu"
              />
            </TableHead>
            <TableHead className="w-[18%] min-w-[150px]">Mã đơn hàng</TableHead>
            <TableHead className="w-[22%] min-w-[180px]">Liên hệ & Người thực hiện</TableHead>
            <TableHead className="w-[20%] min-w-[170px]">Gói học dự kiến</TableHead>
            <TableHead className="w-[14%] min-w-[120px]">Loại khoản thu</TableHead>
            <TableHead className="w-[14%] min-w-[130px]">Số tiền cần thu</TableHead>
            <TableHead className="w-[12%] min-w-[110px] text-right px-4">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedReceivables.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                Không có khoản cần thu nào trong danh sách.
              </TableCell>
            </TableRow>
          ) : (
            paginatedReceivables.map((item) => {
              const isSelected = selectedIds.includes(item.id)

              return (
                <TableRow
                  key={item.id}
                  className={isSelected ? 'bg-muted/50 group' : 'hover:bg-muted/30 group'}
                >
                  <TableCell className="px-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleSelectRow(item.id, Boolean(checked))
                      }
                      aria-label={`Chọn khoản cần thu ${item.orderCode}`}
                    />
                  </TableCell>

                  {/* Mã đơn hàng */}
                  <TableCell className="py-2.5">
                    <a
                      href={`/quote/${item.orderCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-sky-700 dark:text-sky-300 font-semibold hover:underline inline-flex items-center gap-1 truncate"
                      title="Mở Landing Page Báo giá / Đơn hàng"
                    >
                      <ExternalLink className="h-3 w-3 text-sky-600 shrink-0" />
                      <span className="truncate">{item.orderCode}</span>
                    </a>
                  </TableCell>

                  {/* Liên hệ & Người thực hiện (Khách hàng & Học viên) */}
                  <TableCell className="py-2.5">
                    <div className="flex flex-col gap-0.5 text-xs">
                      {/* Dòng 1: Khách hàng (Người liên hệ) */}
                      <div className="flex items-center gap-1 text-xs font-bold text-foreground truncate" title={item.parentName}>
                        <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{item.parentName}</span>
                      </div>

                      {/* Dòng 2: Học viên */}
                      <div className="flex items-center gap-1.5 text-foreground/90 truncate" title={item.studentName}>
                        <GraduationCap className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                        <span className="truncate">{item.studentName}</span>
                      </div>

                      {/* Dòng 3: SĐT */}
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">
                        {maskPhoneNumber(item.phone)}
                      </div>
                    </div>
                  </TableCell>

                  {/* Gói học dự kiến */}
                  <TableCell className="py-2.5 text-xs font-semibold text-foreground truncate" title={item.packageName}>
                    <span className="truncate">{item.packageName}</span>
                  </TableCell>

                  {/* Loại khoản thu */}
                  <TableCell className="py-2.5">
                    <Badge variant="outline" className="text-xs py-0.5 px-1.5 font-normal">
                      {RECEIPT_TYPE_MAP[item.receiptType] || item.receiptType}
                    </Badge>
                  </TableCell>

                  {/* Số tiền cần thu */}
                  <TableCell className="py-2.5 text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                        {formatCurrency(item.amount)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Tổng đơn: {formatCurrency(item.orderTotalAmount)}
                      </span>
                    </div>
                  </TableCell>

                  {/* Nút Thao tác Lập phiếu thu trực tiếp */}
                  <TableCell className="py-2.5 text-right px-4">
                    <Button
                      type="button"
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs h-7 px-2.5"
                      onClick={() => onCreateReceiptForItem(item)}
                      title="Tạo phiếu thu tiền trực tiếp cho khoản này"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Lập phiếu thu</span>
                    </Button>
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


