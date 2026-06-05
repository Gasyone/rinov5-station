'use client'

import { useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState, StatusBadge } from '@/components/shared'
import { getTickets } from '@/mocks/tickets'
import { LifeBuoy } from 'lucide-react'

interface StudentDetailTicketsProps {
  studentId: string
}

export function StudentDetailTickets({ studentId }: StudentDetailTicketsProps) {
  const tickets = useMemo(() => getTickets({ studentId }), [studentId])

  if (!tickets || tickets.length === 0) {
    return (
      <EmptyState
        icon={<LifeBuoy className="h-8 w-8 text-muted-foreground" />}
        title="Không có yêu cầu hỗ trợ nào"
        description="Không tìm thấy bất kỳ ticket CSKH hay sự cố kỹ thuật nào được đăng ký cho học viên này."
        className="py-12"
      />
    )
  }

  const categoryLabels: Record<string, string> = {
    academic: 'Học tập',
    billing: 'Học phí / Thanh toán',
    attendance: 'Điểm danh',
    general: 'Yêu cầu chung',
  }

  const statusLabels: Record<string, string> = {
    new: 'Mới',
    pending: 'Đang chờ',
    in_progress: 'Đang xử lý',
    completed: 'Đã giải quyết',
    cancelled: 'Đã hủy',
  }

  return (
    <div className="w-full">
      <Table containerClassName="w-full">
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-[15%]">Mã ticket</TableHead>
            <TableHead className="w-[35%]">Tiêu đề / Nội dung</TableHead>
            <TableHead>Phân loại</TableHead>
            <TableHead>Độ ưu tiên</TableHead>
            <TableHead>Người xử lý</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((t) => (
            <TableRow key={t.id} className="hover:bg-muted/20">
              <TableCell className="font-mono text-xs font-bold text-foreground py-3.5">
                {t.id}
              </TableCell>
              <TableCell className="py-3.5">
                <div className="flex flex-col gap-1 text-xs">
                  <span className="font-semibold text-foreground leading-snug">{t.title}</span>
                  <span className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed" title={t.description}>
                    {t.description}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-xs text-foreground font-medium">
                {categoryLabels[t.category] || t.category}
              </TableCell>
              <TableCell>
                <StatusBadge
                  status={t.priority}
                  label={t.priority === 'high' ? 'Cao' : t.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                />
              </TableCell>
              <TableCell className="text-xs text-foreground font-medium">
                {t.assignee || 'Hệ thống'}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground font-medium">
                {new Date(t.createdDate).toLocaleDateString('vi-VN')}
              </TableCell>
              <TableCell>
                <StatusBadge
                  status={t.status}
                  label={statusLabels[t.status] || t.status}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
