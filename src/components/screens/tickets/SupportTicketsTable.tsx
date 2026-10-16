'use client'

import { useState } from 'react'
import { Eye, MessageSquare, Trash2, AlertCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge, EmptyState, ConfirmDialog } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { SupportTicket } from '@/mocks/tickets'
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
  TYPE_LABELS,
} from './supportTicketsTypes'
import { formatTicketDate } from './supportTicketsHelpers'

interface SupportTicketsTableProps {
  tickets: SupportTicket[]
  onViewTicket: (ticket: SupportTicket) => void
  onCancelTicket: (ticketId: string) => void
}

export function SupportTicketsTable({
  tickets,
  onViewTicket,
  onCancelTicket,
}: SupportTicketsTableProps) {
  const [cancellingTicketId, setCancellingTicketId] = useState<string | null>(null)

  if (tickets.length === 0) {
    return (
      <EmptyState
        title="Không tìm thấy ticket nào"
        description="Không có phiếu hỗ trợ hoặc chăm sóc nào phù hợp với bộ lọc tìm kiếm hiện tại."
      />
    )
  }

  return (
    <>
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[110px] font-semibold text-xs text-foreground">Mã Ticket</TableHead>
              <TableHead className="min-w-[220px] font-semibold text-xs text-foreground">Tiêu đề & Nội dung</TableHead>
              <TableHead className="w-[160px] font-semibold text-xs text-foreground">Học viên</TableHead>
              <TableHead className="w-[140px] font-semibold text-xs text-foreground">Phân loại</TableHead>
              <TableHead className="w-[110px] font-semibold text-xs text-foreground">Độ ưu tiên</TableHead>
              <TableHead className="w-[120px] font-semibold text-xs text-foreground">Trạng thái</TableHead>
              <TableHead className="w-[130px] font-semibold text-xs text-foreground">Phụ trách</TableHead>
              <TableHead className="w-[110px] font-semibold text-xs text-foreground">Ngày tạo</TableHead>
              <TableHead className="w-[90px] text-right font-semibold text-xs text-foreground">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => {
              const logCount = ticket.interactionLogs?.length ?? 0
              return (
                <TableRow
                  key={ticket.id}
                  className="hover:bg-muted/30 transition-colors group cursor-pointer"
                  onClick={() => onViewTicket(ticket)}
                >
                  {/* Mã ticket */}
                  <TableCell className="font-mono text-xs font-semibold py-3 align-top">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-primary hover:underline">{ticket.id}</span>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 font-normal leading-normal"
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
                  </TableCell>

                  {/* Tiêu đề & Nội dung */}
                  <TableCell className="py-3 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {ticket.title}
                      </span>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {ticket.description}
                      </p>
                      {logCount > 0 && (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                          <MessageSquare className="h-3 w-3 text-sky-500" />
                          <span>{logCount} lần trao đổi gần nhất</span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Học viên */}
                  <TableCell className="py-3 align-top">
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs text-foreground">
                        {ticket.studentName}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {ticket.studentCode}
                      </span>
                    </div>
                  </TableCell>

                  {/* Phân loại */}
                  <TableCell className="py-3 align-top text-xs text-foreground">
                    <span className="rounded-sm bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground border">
                      {CATEGORY_LABELS[ticket.category] ?? ticket.category}
                    </span>
                  </TableCell>

                  {/* Độ ưu tiên */}
                  <TableCell className="py-3 align-top">
                    <StatusBadge
                      status={ticket.priority}
                      label={PRIORITY_LABELS[ticket.priority] ?? ticket.priority}
                    />
                  </TableCell>

                  {/* Trạng thái */}
                  <TableCell className="py-3 align-top">
                    <StatusBadge
                      status={ticket.status}
                      label={STATUS_LABELS[ticket.status] ?? ticket.status}
                    />
                  </TableCell>

                  {/* Phụ trách */}
                  <TableCell className="py-3 align-top text-xs">
                    <span className="font-medium text-foreground">{ticket.assignee}</span>
                  </TableCell>

                  {/* Ngày tạo */}
                  <TableCell className="py-3 align-top text-xs text-muted-foreground font-mono">
                    {formatTicketDate(ticket.createdDate)}
                  </TableCell>

                  {/* Thao tác */}
                  <TableCell
                    className="py-3 align-top text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        title="Xem chi tiết ticket"
                        onClick={() => onViewTicket(ticket)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {ticket.status !== 'cancelled' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          title="Hủy / Đóng ticket"
                          onClick={() => setCancellingTicketId(ticket.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

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
    </>
  )
}
