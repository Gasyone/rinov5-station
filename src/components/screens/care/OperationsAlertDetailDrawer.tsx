'use client'

import { useState } from 'react'
import { Calendar, PhoneCall, Save, BookOpen, Clock, UserCheck } from 'lucide-react'
import { InlineSelect } from '@/components/controls'
import { FieldLabel, InfoField, Panel } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { StudentCareAlert } from '@/mocks/careAlerts'

interface OperationsAlertDetailDrawerProps {
  student: StudentCareAlert | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaveInteraction: (
    id: string,
    log: {
      callConfirmation: StudentCareAlert['callConfirmation']
      notes: string
    },
    confirmC90B?: StudentCareAlert['confirmC90B']
  ) => void
}

export function OperationsAlertDetailDrawer({
  student,
  open,
  onOpenChange,
  onSaveInteraction
}: OperationsAlertDetailDrawerProps) {
  const [callConfirmation, setCallConfirmation] = useState<StudentCareAlert['callConfirmation']>(
    student?.callConfirmation || 'Chưa gọi'
  )
  const [confirmC90B, setConfirmC90B] = useState<StudentCareAlert['confirmC90B']>(
    student?.confirmC90B || 'CHƯA XÁC NHẬN'
  )
  const [notes, setNotes] = useState('')

  if (!student) return null

  const handleSave = () => {
    onSaveInteraction(
      student.id,
      {
        callConfirmation,
        notes: notes.trim() || `Tác nghiệp cuộc gọi: ${callConfirmation}`
      },
      confirmC90B
    )
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg p-0 flex flex-col h-full bg-background border-l border-border">
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border">
          <SheetTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-primary" />
            Tác nghiệp Chăm sóc Học viên
          </SheetTitle>
          <SheetDescription className="text-base font-semibold text-foreground mt-1">
            {student.studentName} — ID: {student.studentId}
          </SheetDescription>
        </SheetHeader>

        {/* Content Body */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="grid gap-6">
            
            {/* Panel 1: General Student Status */}
            <Panel title="Thông tin lớp học" icon={<BookOpen className="h-3.5 w-3.5" />}>
              <div className="grid grid-cols-2 gap-4 rounded-md border border-border bg-muted/30 p-3 mt-1">
                <InfoField label="Mã lớp" value={student.classCode} />
                <InfoField label="Môn học" value={student.subject} />
                <InfoField label="Cấp độ" value={`${student.level} (${student.subLevel})`} />
                <InfoField label="Giáo viên" value={student.teacherCode} />
                <InfoField label="Lịch học" value={student.schedule} className="col-span-2" />
              </div>
            </Panel>

            {/* Panel 2: Academic Statistics */}
            <Panel title="Hiệu suất học tập & Buổi học" icon={<Clock className="h-3.5 w-3.5" />}>
              <div className="grid grid-cols-3 gap-3 rounded-md border border-border bg-muted/30 p-3 mt-1">
                <InfoField label="Còn lại" value={`${student.remainingSessions}/${student.totalSessions}`} supporting="Số buổi học" />
                <InfoField label="Chuyên cần" value={student.attendanceRatio} supporting="Số buổi đi học" />
                <InfoField label="BTVN" value={`${student.homeworkCompletion}%`} supporting="Tỷ lệ hoàn thành" />
                <InfoField label="Kiểm tra" value={String(student.lastTestScore)} supporting={`Lần trước: ${student.priorTestScore}`} />
                <InfoField label="Hạn học" value={student.expectedEndDate} className="col-span-2" supporting="Ngày hết hạn dự kiến" />
              </div>
            </Panel>

            {/* Panel 3: Action Form */}
            <Panel title="Cập nhật tương tác chăm sóc" icon={<UserCheck className="h-3.5 w-3.5" />}>
              <div className="grid gap-4 mt-2">
                
                {/* Call Confirmation */}
                <FieldLabel label="Xác nhận cuộc gọi" required>
                  <InlineSelect
                    value={callConfirmation}
                    onValueChange={(val) => setCallConfirmation(val as StudentCareAlert['callConfirmation'])}
                    options={[
                      { value: 'Chưa gọi', label: 'Chưa gọi / Chưa liên hệ' },
                      { value: 'Đã gọi', label: 'Đã kết nối cuộc gọi thành công' },
                      { value: 'KNM', label: 'Không nghe máy (KNM)' },
                      { value: 'Đã nhắn Zalo', label: 'Đã nhắn tin Zalo trao đổi' }
                    ]}
                  />
                </FieldLabel>

                {/* Confirm C90B (Rendered only if careAlert exists) */}
                {student.careAlert && (
                  <FieldLabel label={`Xác nhận cảnh báo ${student.careAlert}`} required>
                    <InlineSelect
                      value={confirmC90B || 'CHƯA XÁC NHẬN'}
                      onValueChange={(val) => setConfirmC90B(val as StudentCareAlert['confirmC90B'])}
                      options={[
                        { value: 'CHƯA XÁC NHẬN', label: 'Chưa xác nhận / Đang chờ' },
                        { value: 'ĐANG XỬ LÝ', label: 'Đang xử lý hỗ trợ' },
                        { value: 'ĐÃ CSDB', label: 'Đã chăm sóc đặc biệt (CSDB)' }
                      ]}
                    />
                  </FieldLabel>
                )}

                {/* Notes Input */}
                <FieldLabel label="Nội dung trao đổi chi tiết" required description="Nhập ghi chú phản hồi của phụ huynh và cam kết hành động.">
                  <Textarea
                    placeholder="Ví dụ: Gọi điện cho mẹ, mẹ phản hồi do con bận ôn thi nên chưa làm bài tập. Mẹ hứa nhắc con hoàn thành trong tối nay..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="text-xs bg-background resize-none border border-input focus-visible:ring-[3px]"
                  />
                </FieldLabel>
              </div>
            </Panel>

            {/* Panel 4: Interaction logs timeline */}
            <Panel title="Lịch sử nhật ký CSKH" icon={<Calendar className="h-3.5 w-3.5" />}>
              <div className="grid gap-3 mt-1.5 pl-2 border-l border-border/80">
                {student.interactionLogs && student.interactionLogs.length > 0 ? (
                  student.interactionLogs.map((log) => (
                    <div key={log.id} className="relative pb-1">
                      <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground">
                        <span className="text-foreground">{log.staffName}</span>
                        <span>{log.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] px-1 bg-muted text-muted-foreground rounded font-medium">
                          {log.callConfirmation}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 leading-normal bg-muted/20 p-2 rounded">
                        {log.notes}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-muted-foreground italic pl-1">
                    Chưa có nhật ký tương tác trước đó.
                  </p>
                )}
              </div>
            </Panel>

          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="h-9 px-4 text-xs">
            Hủy bỏ
          </Button>
          <Button size="sm" onClick={handleSave} className="h-9 px-4 text-xs font-semibold">
            <Save className="h-3.5 w-3.5 mr-2" />
            Lưu tác nghiệp
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
