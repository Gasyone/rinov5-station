'use client'

import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState, StatusBadge } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { getTickets, type SupportTicket } from '@/mocks/tickets'
import { LifeBuoy } from 'lucide-react'

interface StudentDetailTicketsProps {
  studentId: string
  onCreateTicket?: () => void
}

export function StudentDetailTickets({ studentId, onCreateTicket }: StudentDetailTicketsProps) {
  const [filter, setFilter] = useState<'all' | 'new' | 'pending' | 'in_progress' | 'completed' | 'cancelled'>('all')

  const tickets = useMemo(() => getTickets({ studentId }), [studentId])

  const filteredTickets = useMemo(() => {
    if (filter === 'all') return tickets
    return tickets.filter((t) => t.status === filter)
  }, [tickets, filter])

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

  const hasTickets = tickets && tickets.length > 0

  return (
    <div className="w-full pt-0 space-y-4">
      {/* Tickets tab status filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b mb-3 select-none">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { value: 'all', label: 'Tất cả' },
              { value: 'new', label: 'Mới' },
              { value: 'pending', label: 'Đang chờ' },
              { value: 'in_progress', label: 'Đang xử lý' },
              { value: 'completed', label: 'Đã giải quyết' },
              { value: 'cancelled', label: 'Đã hủy' }
            ] as const
          ).map((item) => {
            const getCount = () => {
              if (!hasTickets) return 0
              if (item.value === 'all') return tickets.length
              return tickets.filter((t) => t.status === item.value).length
            }
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filter === item.value 
                    ? 'bg-primary text-primary-foreground shadow-xs' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {item.label} ({getCount()})
              </button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onCreateTicket || (() => toast.info('Tính năng Tạo ticket đang được phát triển!'))}
          className="rounded-md text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-250 text-[11px] h-8 px-3 font-bold cursor-pointer flex items-center gap-1 shadow-none bg-background shrink-0"
        >
          <LifeBuoy className="h-3.5 w-3.5 text-amber-500" /> Tạo Ticket
        </Button>
      </div>

      <div className="w-full">
        {!hasTickets ? (
          <div className="w-full pt-0">
            <EmptyState
              icon={<LifeBuoy className="h-8 w-8 text-muted-foreground" />}
              title="Không có yêu cầu hỗ trợ nào"
              description="Không tìm thấy bất kỳ ticket CS hay sự cố kỹ thuật nào được đăng ký cho học viên này."
              className="py-12"
            />
          </div>
        ) : (
          <Table containerClassName="w-full border rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-[20%]">Nhóm ticket (Mã)</TableHead>
                <TableHead className="w-[45%]">Nội dung & Phản hồi</TableHead>
                <TableHead className="w-[20%]">Nhân sự liên quan</TableHead>
                <TableHead className="w-[15%] text-right">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-20 text-center text-muted-foreground italic">
                    Không tìm thấy ticket nào phù hợp với bộ lọc đang chọn.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((t) => (
                  <TableRow key={t.id} className="hover:bg-muted/20">
                    {/* Nhóm & Mã định danh */}
                    <TableCell className="py-2.5 px-3">
                      <div className="font-semibold text-foreground text-xs">
                        {categoryLabels[t.category] || t.category}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1.5 select-none">
                        <span>{t.id}</span>
                        <span>&bull;</span>
                        <span>{new Date(t.createdDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </TableCell>

                    {/* Nội dung (Title, Details, Last Log) */}
                    <TableCell className="py-2.5 px-3 max-w-[240px]">
                      <div className="font-bold text-foreground text-xs truncate" title={t.title}>
                        {t.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5" title={t.description}>
                        {t.description}
                      </div>
                      {t.interactionLogs && t.interactionLogs.length > 0 && (
                        <div className="text-[10px] bg-violet-500/5 text-violet-600 dark:text-violet-400 px-1.5 py-0.5 rounded mt-1 line-clamp-1" title={t.interactionLogs[t.interactionLogs.length - 1].notes}>
                          <strong>Xử lý: </strong>{t.interactionLogs[t.interactionLogs.length - 1].notes}
                        </div>
                      )}
                    </TableCell>

                    {/* Nhân viên (Người tạo & Người xử lý) */}
                    <TableCell className="py-2.5 px-3 text-[11px]">
                      <div className="text-foreground">
                        <span className="text-muted-foreground">Tạo:</span> {(t as SupportTicket & { creator?: string }).creator || 'Minh Phương'}
                      </div>
                      <div className="text-foreground mt-0.5">
                        <span className="text-muted-foreground">Xử lý:</span> {t.assignee || 'Hệ thống'}
                      </div>
                    </TableCell>

                    {/* Trạng thái */}
                    <TableCell className="py-2.5 px-3 text-right">
                      <StatusBadge
                        status={t.status}
                        label={statusLabels[t.status] || t.status}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
