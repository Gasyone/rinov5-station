'use client'

import { useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Panel } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { getTickets } from '@/mocks/tickets'

interface StudentDetailTicketsTabProps {
  studentId: string
}

export function StudentDetailTicketsTab({ studentId }: StudentDetailTicketsTabProps) {
  const tickets = useMemo(() => getTickets({ studentId }), [studentId])

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

  return (
    <div className="space-y-6">
      <Panel title="Phiếu chăm sóc & Hỗ trợ">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Mã Ticket</TableHead>
              <TableHead className="font-semibold">Tiêu đề</TableHead>
              <TableHead className="font-semibold">Phân loại</TableHead>
              <TableHead className="font-semibold">Độ ưu tiên</TableHead>
              <TableHead className="font-semibold">Người xử lý</TableHead>
              <TableHead className="font-semibold">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-20 text-center text-muted-foreground italic">
                  Không có phiếu hỗ trợ nào cho học viên này.
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs font-semibold">{t.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-foreground">{t.title}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1">{t.description}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{getCategoryText(t.category)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadgeClass(t.priority)}>
                      {getPriorityText(t.priority)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{t.assignee}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadgeClass(t.status)}>
                      {t.status === 'new'
                        ? 'Mới'
                        : t.status === 'in_progress'
                        ? 'Đang xử lý'
                        : t.status === 'completed'
                        ? 'Hoàn thành'
                        : t.status === 'pending'
                        ? 'Chờ duyệt'
                        : 'Đã hủy'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Panel>
    </div>
  )
}
