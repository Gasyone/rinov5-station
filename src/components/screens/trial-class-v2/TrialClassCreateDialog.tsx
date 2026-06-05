'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { BranchSelect, InlineSelect, StudentCombobox, type StudentOption } from '@/components/controls'
import { FieldLabel } from '@/components/shared'
import { PROGRAM_OPTIONS, SUBJECT_MAP } from './trialClassConstants'
import { TrialClassSchedulePanel } from './TrialClassSchedulePanel'
import type { CreateTrialClassForm } from './trialClassTypes'

interface TrialClassCreateDialogProps {
  open: boolean
  form: CreateTrialClassForm
  branchOptions: string[]
  studentOptions: StudentOption[]
  onOpenChange: (open: boolean) => void
  onFormChange: (form: CreateTrialClassForm | ((current: CreateTrialClassForm) => CreateTrialClassForm)) => void
  onSubmit: () => void
}

export function TrialClassCreateDialog({
  open,
  form,
  branchOptions,
  studentOptions,
  onOpenChange,
  onFormChange,
  onSubmit,
}: TrialClassCreateDialogProps) {
  const handleProgramChange = (value: string) => {
    const subject = SUBJECT_MAP[value] ?? ''
    onFormChange((current) => ({
      ...current,
      program: value,
      subject: subject,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-h-[90vh] overflow-y-auto sm:max-w-4xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Tạo Booking Học thử</DialogTitle>
          <DialogDescription>Ghi nhận nhu cầu học thử và chuyển cho giáo vụ xếp lớp.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <section className="p-2">
            <h3 className="mb-4 text-sm font-semibold">Thông tin chung</h3>
            <div className="grid gap-3">
              <FieldLabel label="Tên học viên / Lead">
                <StudentCombobox
                  options={studentOptions}
                  value={form.studentId}
                  onChange={(studentId, selected) => {
                    onFormChange((current) => ({
                      ...current,
                      studentId,
                      studentName: selected ? selected.label : current.studentName,
                    }))
                  }}
                  onCreateNew={(name) => {
                    onFormChange((current) => ({
                      ...current,
                      studentId: '',
                      studentName: name,
                    }))
                  }}
                  placeholder="Chọn học viên..."
                  className="h-9 border-solid text-sm shadow-xs"
                />
              </FieldLabel>



              <FieldLabel label="Trường">
                <BranchSelect
                  value={form.school}
                  branches={branchOptions}
                  variant="inline"
                  includeAll={false}
                  onValueChange={(value) =>
                    onFormChange((current) => ({ ...current, school: value }))
                  }
                  className="h-9 border-solid text-sm shadow-xs"
                />
              </FieldLabel>

              <FieldLabel label="Chương trình">
                <InlineSelect
                  value={form.program}
                  ariaLabel="Chương trình"
                  options={[
                    { value: '', label: 'Chọn chương trình' },
                    ...PROGRAM_OPTIONS.map((p) => ({ value: p, label: p })),
                  ]}
                  onValueChange={handleProgramChange}
                  className="h-9 border-solid text-sm shadow-xs"
                />
              </FieldLabel>

              <FieldLabel label="Môn học">
                <Input value={form.subject} disabled className="bg-muted" />
              </FieldLabel>

              <FieldLabel label="Ghi chú">
                <Textarea
                  rows={4}
                  value={form.notes}
                  onChange={(event) =>
                    onFormChange((current) => ({ ...current, notes: event.target.value }))
                  }
                  placeholder="VD: Khách rảnh buổi tối, bé nhát cần GV nữ..."
                />
              </FieldLabel>
            </div>
          </section>

          <section className="p-2">
            <TrialClassSchedulePanel
              program={form.program}
              selectedSessions={form.selectedSessions}
              onSelectSession={(session) => {
                onFormChange((current) => {
                  const isAlreadySelected = current.selectedSessions.some(
                    (s) => s.classId === session.classId && s.sessionId === session.sessionId
                  )
                  
                  if (current.selectedSessions.length > 0 && current.selectedSessions[0].classId !== session.classId) {
                    return {
                      ...current,
                      selectedSessions: [session],
                    }
                  }

                  return {
                    ...current,
                    selectedSessions: isAlreadySelected
                      ? current.selectedSessions.filter(
                          (s) => !(s.classId === session.classId && s.sessionId === session.sessionId)
                        )
                      : [...current.selectedSessions, session],
                  }
                })
              }}
            />
          </section>
        </div>

        <DialogFooter className="flex w-full items-center justify-between sm:justify-between">
          <div className="text-left text-sm text-muted-foreground">
            {form.selectedSessions.length > 0 ? (
              <span>
                Đã chọn: <strong className="text-foreground">{form.selectedSessions.length} buổi học</strong>
              </span>
            ) : (
              <span>Chưa chọn buổi học (Giáo vụ sẽ ghép sau)</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={onSubmit}>Tạo Booking</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

