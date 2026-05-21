'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { InfoField, Panel } from '@/components/shared'
import { Clock, Calendar, BookOpen, Users, MapPin } from 'lucide-react'
import type { ClassSession } from '@/mocks/calendarSchedule'

interface SessionDetailDialogProps {
  session: ClassSession | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onQuickAttendance?: () => void
}

export function SessionDetailDialog({
  session,
  open,
  onOpenChange,
  onQuickAttendance,
}: SessionDetailDialogProps) {
  if (!session) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-base font-bold">Chi tiết buổi học</DialogTitle>
            <Badge variant="secondary" className="text-xs">
              {session.typeLabel}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Header Card */}
          <div className="p-3 bg-muted/30 border rounded-lg space-y-1">
            <div className="text-xs text-primary font-bold flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span>{session.className} ({session.classCode})</span>
            </div>
            <h3 className="font-semibold text-sm text-foreground">{session.title}</h3>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Ngày học</p>
                <p className="text-xs font-medium text-foreground">{session.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Ca học</p>
                <p className="text-xs font-medium text-foreground">{session.timeLabel} - {session.endTimeLabel}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 col-span-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Chi nhánh & Phòng</p>
                <p className="text-xs font-medium text-foreground">{session.branch} - {session.schoolRoom || 'Phòng 204'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 col-span-2">
              <Users className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Học sinh tham gia</p>
                <p className="text-xs font-medium text-foreground">
                  Tổng: {session.totalStudents} học sinh (Trong đó có {session.trialStudents} học thử)
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-3">
            <Panel title="Thông tin giáo viên">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <InfoField label="Họ tên" value={session.teacher} />
                <InfoField label="Môn giảng dạy" value={session.subject} />
              </div>
            </Panel>
          </div>
        </div>

        <DialogFooter className="border-t pt-2 gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          {onQuickAttendance && (
            <Button onClick={onQuickAttendance}>
              Điểm danh nhanh
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
