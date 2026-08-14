'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Lead, LeadChild } from '@/mocks/crmLeads'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldLabel } from '@/components/shared'
import { formatChildLabel } from './crmLeadsHelpers'
import { Calendar, GraduationCap, MapPin } from 'lucide-react'

interface CrmLeadsTrialClassModalProps {
  lead: Lead | null
  child: LeadChild | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CrmLeadsTrialClassModal({
  lead,
  child,
  open,
  onOpenChange,
  onSuccess,
}: CrmLeadsTrialClassModalProps) {
  const [startDate, setStartDate] = useState('2026-08-16')
  const [trialClass, setTrialClass] = useState('sk-01')
  const [sessionsCount, setSessionsCount] = useState('1')
  const [branch, setBranch] = useState(lead?.branch ?? 'Chi nhánh Quận 1')
  const [notes, setNotes] = useState('')

  const [prevKey, setPrevKey] = useState({ leadId: lead?.id, childId: child?.id })
  if (prevKey.leadId !== lead?.id || prevKey.childId !== child?.id) {
    setPrevKey({ leadId: lead?.id, childId: child?.id })
    if (lead?.branch) setBranch(lead.branch)
    if (child?.notes) setNotes(child.notes)
  }

  if (!lead || !child) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success(
      `Đăng ký Lớp học thử thành công cho ${child.name}! (${sessionsCount} buổi - Ngày bắt đầu: ${startDate} - ${branch})`
    )
    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
            <GraduationCap className="h-5 w-5" />
            <DialogTitle className="text-lg font-bold">
              Đăng ký Lớp học thử & Trải nghiệm
            </DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Xếp lịch học thử cho <span className="font-semibold text-foreground">{formatChildLabel(child)}</span> — PH: <span className="font-semibold text-foreground">{lead.parentName}</span> ({lead.phone})
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Thông tin pre-filled */}
          <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/30 p-3 text-xs">
            <div>
              <span className="text-muted-foreground">Phụ huynh:</span>
              <div className="font-medium text-foreground">{lead.parentName}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Học viên:</span>
              <div className="font-medium text-foreground">{formatChildLabel(child)}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Khóa học đăng ký:</span>
              <div className="font-medium text-violet-700 dark:text-violet-400">{child.targetSubject}</div>
            </div>
            <div>
              <span className="text-muted-foreground">SĐT liên hệ:</span>
              <div className="font-mono font-medium text-foreground">{lead.phone}</div>
            </div>
          </div>

          {/* Chọn Lớp học thử ghép & Số buổi */}
          <div className="space-y-3">
            <FieldLabel label="Lớp học thử ghép có sẵn" required>
              <Select value={trialClass} onValueChange={setTrialClass}>
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sk-01">SK-01 (SuperKids 1) • Ca T3-T5 (18:00 - 19:30)</SelectItem>
                  <SelectItem value="kd-02">KD-02 (Kindy 2) • Ca T7-CN (09:00 - 10:30)</SelectItem>
                  <SelectItem value="mv-03">MV-03 (Movers 3) • Ca T4-T6 (18:30 - 20:00)</SelectItem>
                  <SelectItem value="fl-01">FL-01 (Flyers 1) • Ca T2-T4 (17:30 - 19:00)</SelectItem>
                </SelectContent>
              </Select>
            </FieldLabel>

            <div className="grid grid-cols-2 gap-3">
              <FieldLabel label="Số buổi học thử" required>
                <Select value={sessionsCount} onValueChange={setSessionsCount}>
                  <SelectTrigger size="sm" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 buổi miễn phí</SelectItem>
                    <SelectItem value="2">2 buổi (1 tuần trải nghiệm)</SelectItem>
                  </SelectContent>
                </Select>
              </FieldLabel>

              <FieldLabel label="Ngày bắt đầu" required>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-8 pl-8 text-xs"
                    required
                  />
                </div>
              </FieldLabel>
            </div>

            <FieldLabel label="Cơ sở học thử" required>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Select value={branch} onValueChange={setBranch}>
                  <SelectTrigger size="sm" className="w-full pl-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chi nhánh Quận 1">RinoEdu Chi nhánh Quận 1</SelectItem>
                    <SelectItem value="Chi nhánh Cầu Giấy">RinoEdu Chi nhánh Cầu Giấy</SelectItem>
                    <SelectItem value="RinoEdu Smart City">RinoEdu Smart City</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </FieldLabel>
          </div>

          {/* Ghi chú */}
          <FieldLabel label="Ghi chú & Yêu cầu chuẩn bị">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi chú yêu cầu học thử (ví dụ: Chuẩn bị sách bài tập, cần trợ giảng xếp chỗ ngồi cạnh bạn...)"
              className="text-xs min-h-[60px]"
            />
          </FieldLabel>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" size="sm" className="bg-violet-600 text-white hover:bg-violet-700">
              Xác nhận Đăng ký Học thử
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
