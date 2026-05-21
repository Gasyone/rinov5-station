'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FieldLabel, InfoField } from '@/components/shared'
import { InlineSelect } from '@/components/controls'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type { SupportTicket, TicketInteractionLog } from '@/mocks/tickets'

interface TicketDetailDialogProps {
  ticket: SupportTicket | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus: (ticketId: string, status: SupportTicket['status']) => void
  onAddInteraction: (ticketId: string, log: Omit<TicketInteractionLog, 'id' | 'date'>) => void
}

export function TicketDetailDialog({
  ticket,
  open,
  onOpenChange,
  onUpdateStatus,
  onAddInteraction,
}: TicketDetailDialogProps) {
  const [prevTicketId, setPrevTicketId] = useState<string | null>(null)
  const [status, setStatus] = useState<SupportTicket['status']>(ticket?.status || 'new')
  const [channel, setChannel] = useState<'phone' | 'zalo' | 'face_to_face' | 'email'>('phone')
  const [notes, setNotes] = useState('')

  // Adjust state during render when ticket changes
  if (ticket && ticket.id !== prevTicketId) {
    setPrevTicketId(ticket.id)
    setStatus(ticket.status)
  }

  if (!ticket) return null

  const handleStatusChange = (newStatus: string) => {
    const s = newStatus as SupportTicket['status']
    setStatus(s)
    onUpdateStatus(ticket.id, s)
  }

  const handleAddInteractionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!notes.trim()) return
    onAddInteraction(ticket.id, {
      staffName: 'Trần Văn A (Quản lý)',
      channel,
      notes: notes.trim(),
    })
    setNotes('')
  }

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

  const getChannelText = (ch: string) => {
    switch (ch) {
      case 'phone':
        return 'Điện thoại'
      case 'zalo':
        return 'Zalo'
      case 'face_to_face':
        return 'Gặp trực tiếp'
      case 'email':
        return 'Email'
      default:
        return ch
    }
  }

  const statusOptions = [
    { value: 'new', label: 'Mới' },
    { value: 'in_progress', label: 'Đang xử lý' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'pending', label: 'Chờ duyệt' },
    { value: 'cancelled', label: 'Đã hủy' },
  ]

  const channelOptions = [
    { value: 'phone', label: 'Điện thoại' },
    { value: 'zalo', label: 'Zalo' },
    { value: 'face_to_face', label: 'Trực tiếp' },
    { value: 'email', label: 'Email' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="flex items-center gap-2">
              <span>Chi tiết Ticket:</span>
              <span className="font-mono text-sm text-muted-foreground">{ticket.id}</span>
            </DialogTitle>
            <Badge variant="outline" className={getStatusBadgeClass(ticket.status)}>
              {ticket.status === 'new' ? 'Mới' : ticket.status === 'in_progress' ? 'Đang xử lý' : 'Hoàn thành'}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Main Info */}
          <div className="grid grid-cols-2 gap-4">
            <InfoField label="Học viên" value={`${ticket.studentName} (${ticket.studentCode})`} />
            <InfoField label="Người phụ trách" value={ticket.assignee} />
            <InfoField label="Phân loại" value={getCategoryText(ticket.category)} />
            <InfoField label="Độ ưu tiên" value={ticket.priority === 'high' ? 'Cao' : ticket.priority === 'medium' ? 'Trung bình' : 'Thấp'} />
            <div className="col-span-2">
              <InfoField label="Tiêu đề" value={ticket.title} />
            </div>
            <div className="col-span-2">
              <InfoField label="Mô tả chi tiết" value={ticket.description} />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="w-48">
              <FieldLabel label="Cập nhật trạng thái xử lý">
                <InlineSelect
                  value={status}
                  onValueChange={handleStatusChange}
                  options={statusOptions}
                  ariaLabel="Trạng thái xử lý"
                />
              </FieldLabel>
            </div>
          </div>

          {/* Interaction Logs */}
          <div className="border-t pt-4 space-y-3">
            <h3 className="font-semibold text-sm">Nhật ký tương tác ({ticket.interactionLogs.length})</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {ticket.interactionLogs.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Chưa có nhật ký tương tác nào.</p>
              ) : (
                ticket.interactionLogs.map((log) => (
                  <div key={log.id} className="p-2 bg-muted/40 border rounded-md text-xs space-y-1">
                    <div className="flex justify-between font-medium">
                      <span>{log.staffName} ({getChannelText(log.channel)})</span>
                      <span className="text-muted-foreground">{log.date}</span>
                    </div>
                    <p className="text-muted-foreground">{log.notes}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add log form */}
            <form onSubmit={handleAddInteractionSubmit} className="space-y-2 border-t pt-3">
              <h4 className="font-medium text-xs">Ghi nhận cuộc gọi/tương tác mới</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <InlineSelect
                    value={channel}
                    onValueChange={(val) => setChannel(val as 'phone' | 'zalo' | 'face_to_face' | 'email')}
                    options={channelOptions}
                    ariaLabel="Kênh liên hệ"
                  />
                </div>
                <div className="col-span-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập nội dung trao đổi..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  />
                  <Button type="submit" size="xs">Thêm</Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <DialogFooter className="border-t pt-2">
          <Button onClick={() => onOpenChange(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
