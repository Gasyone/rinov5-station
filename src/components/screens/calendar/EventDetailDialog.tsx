'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { InfoField, Panel } from '@/components/shared'
import { Clock, Calendar, Users, MapPin, Sparkles } from 'lucide-react'
import type { EventSession } from '@/mocks/calendarSchedule'

interface EventDetailDialogProps {
  session: EventSession | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRegister?: () => void
}

export function EventDetailDialog({
  session,
  open,
  onOpenChange,
  onRegister,
}: EventDetailDialogProps) {
  if (!session) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-base font-bold flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Chi tiết sự kiện / Hoạt động
            </DialogTitle>
            <Badge variant="secondary" className="text-xs">
              {session.typeLabel}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Header Card */}
          <div className="p-3 bg-muted/30 border rounded-lg space-y-1">
            <h3 className="font-semibold text-sm text-foreground">{session.title}</h3>
            <p className="text-xs text-muted-foreground">Người tổ chức: {session.organizer}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Ngày diễn ra</p>
                <p className="text-xs font-medium text-foreground">{session.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Thời gian</p>
                <p className="text-xs font-medium text-foreground">{session.timeLabel} - {session.endTimeLabel}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 col-span-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Địa điểm / Phòng</p>
                <p className="text-xs font-medium text-foreground">{session.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 col-span-2">
              <Users className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Tham gia</p>
                <p className="text-xs font-medium text-foreground">
                  Đã đăng ký: {session.participants} / {session.maxParticipants} chỗ
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-2 gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          {onRegister && session.participants < session.maxParticipants && (
            <Button onClick={onRegister}>
              Đăng ký tham gia
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
