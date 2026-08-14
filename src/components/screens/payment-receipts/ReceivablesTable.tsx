'use client'

import { Plus, ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
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
import { formatCurrency } from './paymentReceiptsHelpers'

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
  const [copiedId, setCopiedId] = useState<string | null>(null)
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
                aria-label="Chọn tất cả khoản cần thu"
              />
            </TableHead>
            <TableHead className="w-[140px]">Mã đơn hàng</TableHead>
            <TableHead className="w-[200px]">Học viên / Phụ huynh</TableHead>
            <TableHead className="min-w-[200px]">Gói học dự kiến</TableHead>
            <TableHead className="w-[150px]">Loại khoản thu</TableHead>
            <TableHead className="w-[150px]">Số tiền cần thu</TableHead>
            <TableHead className="w-[150px]">Hạn thu & Cơ sở</TableHead>
            <TableHead className="w-[140px] text-right px-4">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedReceivables.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-xs">
                Không có khoản cần thu nào trong danh sách.
              </TableCell>
            </TableRow>
          ) : (
            paginatedReceivables.map((item) => {
              const isSelected = selectedIds.includes(item.id)
              const typeConfig = RECEIPT_TYPE_MAP[item.receiptType]

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
                  <TableCell>
                    <a
                      href={`/quote/${item.orderCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-sky-700 dark:text-sky-300 font-semibold hover:underline inline-flex items-center gap-1"
                      title="Mở Landing Page Báo giá / Đơn hàng"
                    >
                      <ExternalLink className="h-3 w-3 text-sky-600 shrink-0" />
                      <span>{item.orderCode}</span>
                    </a>
                  </TableCell>

                  {/* Học viên & Phụ huynh */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5 text-xs">
                      <span className="font-bold text-foreground">{item.studentName}</span>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <span>PH: {item.parentName}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                          onClick={(e) => handleCopyPhone(e, item.phone, item.id)}
                          title="Sao chép SĐT"
                        >
                          {copiedId === item.id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  </TableCell>

                  {/* Gói học dự kiến */}
                  <TableCell className="text-xs font-semibold text-foreground">
                    {item.packageName}
                  </TableCell>

                  {/* Loại khoản thu */}
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] py-0.5 px-1.5 font-normal ${typeConfig.class}`}>
                      {typeConfig.label}
                    </Badge>
                  </TableCell>

                  {/* Số tiền cần thu (KHÔNG CÓ CỘT TRẠNG THÁI) */}
                  <TableCell className="font-mono font-bold text-amber-700 dark:text-amber-400 text-xs">
                    {formatCurrency(item.amount)}
                  </TableCell>

                  {/* Hạn thu & Cơ sở */}
                  <TableCell className="text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-foreground">Hạn: {item.dueDate}</span>
                      <span className="text-[10px] text-muted-foreground">{item.branch}</span>
                    </div>
                  </TableCell>

                  {/* Nút Thao tác Lập phiếu thu trực tiếp */}
                  <TableCell className="text-right px-4">
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
