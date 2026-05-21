'use client'

import { Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type { SupportTicket } from '@/mocks/tickets'

interface SupportTicketsTableProps {
  tickets: SupportTicket[]
  onViewDetails: (ticket: SupportTicket) => void
}

export function SupportTicketsTable({
  tickets,
  onViewDetails,
}: SupportTicketsTableProps) {
  const getCategoryText = (cat: string) => {
    switch (cat) {
      case 'academic':
        return 'Học thuật'
      case 'billing':
        return 'Học phí'
      case 'attendance':
        return 'Chuyên cần'
      case 'general':
        return 'Chung'
      default:
        return cat
    }
  }

  const getPriorityText = (prio: string) => {
    switch (prio) {
      case 'high':
        return 'Cao'
      case 'medium':
        return 'Trung bình'
      case 'low':
        return 'Thấp'
      default:
        return prio
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return 'Mới'
      case 'in_progress':
        return 'Đang xử lý'
      case 'completed':
        return 'Hoàn thành'
      case 'pending':
        return 'Chờ duyệt'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return status
    }
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[100px] font-semibold">Mã Ticket</TableHead>
            <TableHead className="font-semibold">Học viên</TableHead>
            <TableHead className="font-semibold">Tiêu đề</TableHead>
            <TableHead className="font-semibold">Phân loại</TableHead>
            <TableHead className="font-semibold">Độ ưu tiên</TableHead>
            <TableHead className="font-semibold">Người xử lý</TableHead>
            <TableHead className="font-semibold">Ngày tạo</TableHead>
            <TableHead className="font-semibold">Trạng thái</TableHead>
            <TableHead className="font-semibold text-right">Chi tiết</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                Không tìm thấy phiếu hỗ trợ nào.
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((t) => (
              <TableRow key={t.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-mono text-xs font-semibold">{t.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-foreground">{t.studentName}</span>
                    <span className="text-xs text-muted-foreground">{t.studentCode}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate" title={t.title}>
                  {t.title}
                </TableCell>
                <TableCell className="text-sm">{getCategoryText(t.category)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadgeClass(t.priority)}>
                    {getPriorityText(t.priority)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{t.assignee}</TableCell>
                <TableCell className="text-sm">{t.createdDate}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadgeClass(t.status)}>
                    {getStatusText(t.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="icon-sm" variant="ghost" className="h-8 w-8" onClick={() => onViewDetails(t)}>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
