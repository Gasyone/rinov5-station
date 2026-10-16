'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { StatusBadge, FieldLabel, InfoField } from '@/components/shared'
import { ToolbarSelect } from '@/components/controls'
import { Badge } from '@/components/ui/badge'
import {
  Phone,
  MessageSquare,
  Users,
  Mail,
  Send,
  AlertCircle,
  Clock,
} from 'lucide-react'
import { toast } from 'sonner'
import type { SupportTicket, TicketInteractionLog } from '@/mocks/tickets'
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
  TYPE_LABELS,
  CHANNEL_LABELS,
} from './supportTicketsTypes'
import { formatTicketDate } from './supportTicketsHelpers'

interface SupportTicketsDetailDialogProps {
  ticket: SupportTicket | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (ticketId: string, status: SupportTicket['status']) => void
  onAddInteraction: (
    ticketId: string,
    log: Omit<TicketInteractionLog, 'id' | 'date'>
  ) => void
}

const STATUS_SELECT_OPTIONS: Array<{ value: SupportTicket['status']; label: string }> = [
  { value: 'new', label: 'Mới tạo' },
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'in_progress', label: 'Đang xử lý' },
  { value: 'completed', label: 'Đã giải quyết' },
  { value: 'cancelled', label: 'Đã đóng / Hủy' },
]

const CHANNEL_OPTIONS: Array<{ value: TicketInteractionLog['channel']; label: string }> = [
  { value: 'phone', label: 'Gọi điện thoại' },
  { value: 'zalo', label: 'Nhắn Zalo' },
  { value: 'face_to_face', label: 'Gặp trực tiếp' },
  { value: 'email', label: 'Gửi Email' },
]

export function SupportTicketsDetailDialog({
  ticket,
  open,
  onOpenChange,
  onStatusChange,
  onAddInteraction,
}: SupportTicketsDetailDialogProps) {
  const [newChannel, setNewChannel] = useState<TicketInteractionLog['channel']>('phone')
  const [newStaffName, setNewStaffName] = useState('CSM Minh Phương')
  const [newNotes, setNewNotes] = useState('')

  if (!ticket) return null

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNotes.trim()) return

    onAddInteraction(ticket.id, {
      staffName: newStaffName,
      channel: newChannel,
      notes: newNotes.trim(),
    })

    setNewNotes('')
    toast.success('Đã thêm nhật ký tương tác mới!')
  }

  const getChannelIcon = (channel: TicketInteractionLog['channel']) => {
    switch (channel) {
      case 'phone':
        return <Phone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
      case 'zalo':
        return <MessageSquare className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
      case 'face_to_face':
        return <Users className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
      case 'email':
        return <Mail className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
      default:
        return <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card">
        <DialogHeader className="border-b pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-primary">{ticket.id}</span>
              <Badge variant="outline" className="text-xs">
                {TYPE_LABELS[ticket.type] ?? ticket.type}
              </Badge>
              {ticket.alertCode && (
                <Badge variant="secondary" className="text-xs text-amber-700 dark:text-amber-300">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {ticket.alertCode}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Trạng thái:</span>
              <ToolbarSelect
                value={ticket.status}
                onValueChange={(val) => {
                  onStatusChange(ticket.id, val as SupportTicket['status'])
                  toast.success(`Đã cập nhật trạng thái sang "${STATUS_LABELS[val]}"!`)
                }}
                options={STATUS_SELECT_OPTIONS}
                ariaLabel="Trạng thái ticket"
                className="w-[140px] h-8 text-xs"
              />
            </div>
          </div>

          <DialogTitle className="text-base font-bold text-foreground mt-2 text-left">
            {ticket.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground text-left">
            Tạo ngày {formatTicketDate(ticket.createdDate)} bởi người phụ trách {ticket.assignee}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Thông tin chính */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/30 p-3 rounded-lg border text-xs">
            <InfoField label="Học viên" value={`${ticket.studentName} (${ticket.studentCode})`} />
            <InfoField
              label="Phân loại"
              value={CATEGORY_LABELS[ticket.category] ?? ticket.category}
            />
            <InfoField
              label="Độ ưu tiên"
              value={
                <StatusBadge
                  status={ticket.priority}
                  label={PRIORITY_LABELS[ticket.priority] ?? ticket.priority}
                />
              }
            />
            <InfoField label="Người phụ trách" value={ticket.assignee} />
          </div>

          {/* Nội dung chi tiết */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Mô tả chi tiết sự việc / yêu cầu
            </h4>
            <div className="p-3 rounded-md bg-muted/20 border text-xs text-foreground leading-relaxed">
              {ticket.description}
            </div>
          </div>

          {/* Nhật ký trao đổi / tương tác */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Lịch sử trao đổi / Tương tác ({ticket.interactionLogs?.length ?? 0})</span>
            </h4>

            {(!ticket.interactionLogs || ticket.interactionLogs.length === 0) ? (
              <div className="p-4 text-center border border-dashed rounded-lg text-xs text-muted-foreground">
                Chưa có nhật ký tương tác nào cho ticket này. Hãy thêm ghi chú bên dưới sau khi liên hệ phụ huynh/học viên.
              </div>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {ticket.interactionLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg border bg-background text-xs space-y-1 shadow-xs"
                  >
                    <div className="flex items-center justify-between text-muted-foreground">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        {getChannelIcon(log.channel)}
                        <span>{log.staffName}</span>
                        <span className="text-[11px] text-muted-foreground font-normal">
                          qua {CHANNEL_LABELS[log.channel] ?? log.channel}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {log.date}
                      </span>
                    </div>
                    <p className="text-foreground leading-relaxed pl-5">{log.notes}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Form thêm tương tác mới */}
            <form onSubmit={handleAddLog} className="pt-2 border-t space-y-2">
              <span className="text-xs font-medium text-foreground block">
                Thêm ghi chú tương tác mới:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <FieldLabel label="Kênh liên hệ">
                  <ToolbarSelect
                    value={newChannel}
                    onValueChange={(val) => setNewChannel(val as TicketInteractionLog['channel'])}
                    options={CHANNEL_OPTIONS}
                    ariaLabel="Kênh liên hệ"
                    className="w-full h-8 text-xs"
                  />
                </FieldLabel>
                <FieldLabel label="Nhân sự thực hiện">
                  <input
                    type="text"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    placeholder="Tên nhân sự..."
                    className="h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    required
                  />
                </FieldLabel>
              </div>

              <FieldLabel label="Nội dung trao đổi / Kết quả">
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ghi nhận nội dung đã trao đổi với phụ huynh, học viên hoặc giáo viên..."
                  rows={2}
                  className="w-full rounded-md border border-input bg-background p-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                />
              </FieldLabel>

              <div className="flex justify-end">
                <Button type="submit" size="sm" className="h-8 gap-1 text-xs">
                  <Send className="h-3.5 w-3.5" />
                  Ghi nhận trao đổi
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
