'use client'

import React, { useState } from 'react'
import {
  Eye,
  Trash2,
  AlertCircle,
  MessageSquare,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge, EmptyState, ConfirmDialog } from '@/components/shared'
import { DataTableFrame, DataTablePagination } from '@/components/data-table'
import { cn } from '@/lib/utils'
import type { SupportTicket } from '@/mocks/tickets'
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
  TYPE_LABELS,
} from './supportTicketsTypes'
import { formatTicketDate, maskPhoneNumber } from './supportTicketsHelpers'

export interface SupportTicketsTableProps {
  tickets: SupportTicket[]
  selectedIds: Set<string>
  onToggleAll: () => void
  onToggleOne: (id: string) => void
  onViewTicket: (ticket: SupportTicket) => void
  onCancelTicket: (ticketId: string) => void
  onBulkStatusChange?: (status: SupportTicket['status']) => void
  className?: string
  pagination?: {
    page: number
    total: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
  }
}

export function SupportTicketsTable({
  tickets = [],
  selectedIds,
  onToggleAll,
  onToggleOne,
  onViewTicket,
  onCancelTicket,
  onBulkStatusChange,
  className,
  pagination,
}: SupportTicketsTableProps) {
  const [cancellingTicketId, setCancellingTicketId] = useState<string | null>(null)
  const allSelected = tickets.length > 0 && tickets.every((t) => selectedIds.has(t.id))

  if (tickets.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare className="h-7 w-7 text-muted-foreground" />}
        title="Không tìm thấy ticket nào"
        description="Điều chỉnh tìm kiếm hoặc bộ lọc để hiển thị danh sách phiếu hỗ trợ & chăm sóc."
        className="py-10 border border-border rounded-lg bg-card"
      />
    )
  }

  return (
    <div className={cn('flex flex-col h-full min-h-0', className)}>
      {/* Bulk action toolbar if items are selected */}
      {selectedIds.size > 0 && (
        <div className="shrink-0 mb-1.5 flex items-center justify-between gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-md text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">
              Đã chọn {selectedIds.size} / {tickets.length} ticket
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {onBulkStatusChange && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onBulkStatusChange('in_progress')}
                  className="h-7 text-xs px-2 gap-1 text-sky-700 dark:text-sky-400 bg-background"
                >
                  <Clock className="h-3 w-3" />
                  Đang xử lý
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onBulkStatusChange('completed')}
                  className="h-7 text-xs px-2 gap-1 text-emerald-700 dark:text-emerald-400 bg-background"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Giải quyết
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onBulkStatusChange('cancelled')}
                  className="h-7 text-xs px-2 gap-1 text-zinc-600 dark:text-zinc-400 bg-background"
                >
                  <XCircle className="h-3 w-3" />
                  Đóng / Hủy
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleAll}
              className="h-7 text-xs px-2 text-muted-foreground"
            >
              Bỏ chọn
            </Button>
          </div>
        </div>
      )}

      {/* Main Table Frame */}
      <DataTableFrame className="flex-1 min-h-0">
        <table className="w-full min-w-[1050px] table-fixed text-left border-separate border-spacing-0">
          <colgroup>
            <col className="w-8" />
            <col className="w-[125px]" />
            <col className="w-auto min-w-[260px]" />
            <col className="w-[180px]" />
            <col className="w-[140px]" />
            <col className="w-[105px]" />
            <col className="w-[125px]" />
            <col className="w-[130px]" />
            <col className="w-[95px]" />
            <col className="w-[75px]" />
          </colgroup>
          <thead className="sticky top-0 z-40 bg-muted">
            <tr className="bg-muted hover:bg-muted [&>th]:h-9 [&>th]:py-1.5 [&>th]:text-xs [&>th]:font-normal [&>th]:text-muted-foreground [&>th]:border-b [&>th]:border-border/80 [&>th]:whitespace-nowrap">
              {/* Checkbox: Sticky left-0 */}
              <th className="sticky top-0 left-0 z-50 w-8 min-w-8 max-w-8 text-center px-1 bg-muted border-b border-border/80">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onToggleAll}
                  aria-label="Chọn tất cả ticket"
                />
              </th>
              {/* Mã Ticket: Sticky left-8 */}
              <th className="sticky top-0 left-8 z-50 w-[125px] px-2.5 bg-muted text-left border-b border-border/80">
                Mã Ticket
              </th>
              {/* Tiêu đề & Nội dung */}
              <th className="sticky top-0 z-40 bg-muted min-w-[260px] px-2.5 text-left border-b border-border/80">
                Tiêu đề & Nội dung
              </th>
              {/* Học viên & Cơ sở */}
              <th className="sticky top-0 z-40 bg-muted w-[180px] px-2.5 text-left border-b border-border/80">
                Học viên & Cơ sở
              </th>
              {/* Phân loại */}
              <th className="sticky top-0 z-40 bg-muted w-[140px] px-2.5 text-left border-b border-border/80">
                Phân loại
              </th>
              {/* Độ ưu tiên */}
              <th className="sticky top-0 z-40 bg-muted w-[105px] px-2.5 text-left border-b border-border/80">
                Ưu tiên
              </th>
              {/* Trạng thái */}
              <th className="sticky top-0 z-40 bg-muted w-[125px] px-2.5 text-left border-b border-border/80">
                Trạng thái
              </th>
              {/* Phụ trách */}
              <th className="sticky top-0 z-40 bg-muted w-[130px] px-2.5 text-left border-b border-border/80">
                Phụ trách
              </th>
              {/* Ngày tạo */}
              <th className="sticky top-0 z-40 bg-muted w-[95px] px-2.5 text-left border-b border-border/80">
                Ngày tạo
              </th>
              {/* Thao tác */}
              <th className="sticky top-0 z-40 bg-muted w-[75px] px-2.5 text-right border-b border-border/80">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => {
              const logCount = ticket.interactionLogs?.length ?? 0
              const isSelected = selectedIds.has(ticket.id)

              return (
                <tr
                  key={ticket.id}
                  onClick={() => onViewTicket(ticket)}
                  className={cn(
                    'group cursor-pointer hover:bg-muted/30 transition-colors border-b border-border/60',
                    isSelected && 'bg-primary/5 hover:bg-primary/10'
                  )}
                >
                  {/* 1. Checkbox: Sticky left-0 */}
                  <td
                    className="sticky left-0 z-20 w-8 px-1 text-center bg-background group-hover:bg-muted/30 border-b border-border/60 py-2.5 align-top"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleOne(ticket.id)}
                      aria-label={`Chọn ticket ${ticket.id}`}
                    />
                  </td>

                  {/* 2. Mã Ticket: Sticky left-8 */}
                  <td className="sticky left-8 z-20 w-[125px] px-2.5 py-2.5 text-xs font-semibold bg-background group-hover:bg-muted/30 border-b border-border/60 align-top">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="font-mono text-primary group-hover:underline">
                        {ticket.id}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 font-normal leading-normal text-muted-foreground"
                      >
                        {TYPE_LABELS[ticket.type] ?? ticket.type}
                      </Badge>
                      {ticket.alertCode && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                          <AlertCircle className="h-3 w-3" />
                          {ticket.alertCode}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 3. Tiêu đề & Nội dung */}
                  <td className="px-2.5 py-2.5 align-top border-b border-border/60">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-xs text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {ticket.title}
                      </span>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {ticket.description}
                      </p>
                      {logCount > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-sky-600 dark:text-sky-400 font-medium mt-0.5">
                          <MessageSquare className="h-3 w-3" />
                          <span>{logCount} lần trao đổi</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* 4. Học viên & Cơ sở */}
                  <td className="px-2.5 py-2.5 align-top border-b border-border/60">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-xs text-foreground">
                        {ticket.studentName}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                        <span>{ticket.studentCode}</span>
                        {ticket.studentPhone && (
                          <>
                            <span className="text-zinc-300 dark:text-zinc-700">•</span>
                            <span title="Số điện thoại che chống copy hàng loạt">
                              {maskPhoneNumber(ticket.studentPhone)}
                            </span>
                          </>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {ticket.branch ?? 'Cơ sở chính'}
                      </span>
                    </div>
                  </td>

                  {/* 5. Phân loại */}
                  <td className="px-2.5 py-2.5 align-top text-xs border-b border-border/60">
                    <span className="inline-block rounded-xs bg-muted/60 px-1.5 py-0.5 text-[11px] text-muted-foreground border border-border/60">
                      {CATEGORY_LABELS[ticket.category] ?? ticket.category}
                    </span>
                  </td>

                  {/* 6. Độ ưu tiên */}
                  <td className="px-2.5 py-2.5 align-top border-b border-border/60">
                    <StatusBadge
                      status={ticket.priority}
                      label={PRIORITY_LABELS[ticket.priority] ?? ticket.priority}
                      className="text-[11px] px-2 py-0.5"
                    />
                  </td>

                  {/* 7. Trạng thái */}
                  <td className="px-2.5 py-2.5 align-top border-b border-border/60">
                    <StatusBadge
                      status={ticket.status}
                      label={STATUS_LABELS[ticket.status] ?? ticket.status}
                      className="text-[11px] px-2 py-0.5"
                    />
                  </td>

                  {/* 8. Phụ trách */}
                  <td className="px-2.5 py-2.5 align-top text-xs border-b border-border/60">
                    <span className="font-medium text-foreground">{ticket.assignee}</span>
                  </td>

                  {/* 9. Ngày tạo */}
                  <td className="px-2.5 py-2.5 align-top text-xs text-muted-foreground font-mono border-b border-border/60">
                    {formatTicketDate(ticket.createdDate)}
                  </td>

                  {/* 10. Thao tác */}
                  <td
                    className="px-2.5 py-2.5 align-top text-right border-b border-border/60"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Xem chi tiết ticket"
                        onClick={() => onViewTicket(ticket)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {ticket.status !== 'cancelled' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
                          title="Hủy / Đóng ticket"
                          onClick={() => setCancellingTicketId(ticket.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </DataTableFrame>

      {/* Pagination matching QcCheckTable */}
      {pagination ? (
        <div className="shrink-0 pt-1 pb-0">
          <DataTablePagination
            page={pagination.page}
            total={pagination.total}
            pageSize={pagination.pageSize}
            onPageChange={pagination.onPageChange}
            onPageSizeChange={pagination.onPageSizeChange}
            selectedCount={selectedIds.size}
            onClearSelection={onToggleAll}
            size="sm"
            className="!bg-transparent border-0 border-none shadow-none px-0 py-0"
          />
        </div>
      ) : null}

      {/* Confirm cancel dialog */}
      <ConfirmDialog
        open={Boolean(cancellingTicketId)}
        onOpenChange={(open) => {
          if (!open) setCancellingTicketId(null)
        }}
        title="Xác nhận hủy / đóng ticket"
        description="Bạn có chắc chắn muốn hủy hoặc đóng phiếu hỗ trợ này? Trạng thái ticket sẽ được chuyển thành 'Đã đóng / Hủy'."
        confirmLabel="Đóng ticket"
        cancelLabel="Quay lại"
        variant="destructive"
        onConfirm={() => {
          if (cancellingTicketId) {
            onCancelTicket(cancellingTicketId)
            setCancellingTicketId(null)
          }
        }}
      />
    </div>
  )
}
