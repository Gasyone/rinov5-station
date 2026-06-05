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
import { Textarea } from '@/components/ui/textarea'
import { BranchSelect, InlineSelect, StudentCombobox } from '@/components/controls'
import {
  PROGRAM_LEVELS,
  type BookingSubject,
  type BookingTest,
} from '@/mocks/bookingTests'
import { FieldLabel } from '@/components/shared'
import { PROGRAM_OPTIONS } from './bookingTestConstants'
import { getSubjectLabel } from './bookingTestHelpers'
import type { CreateBookingForm } from './bookingTestTypes'
import { BookingTestSchedulePanel } from './BookingTestSchedulePanel'

function formatScheduleDate(dateStr: string) {
  const date = new Date(dateStr)
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  return `${days[date.getDay()]} ${date.getDate().toString().padStart(2, '0')}/${(
    date.getMonth() + 1
  ).toString().padStart(2, '0')}`
}

interface BookingTestCreateDialogProps {
  open: boolean
  activeSubject: BookingSubject
  form: CreateBookingForm
  studentOptions: Array<{ id: string; label: string; familyName: string; phone: string }>
  schoolOptions: string[]
  teacherOptions: string[]
  bookings: BookingTest[]
  onOpenChange: (open: boolean) => void
  onFormChange: (form: CreateBookingForm | ((current: CreateBookingForm) => CreateBookingForm)) => void
  onSubmit: () => void
}

export function BookingTestCreateDialog({
  open,
  activeSubject,
  form,
  studentOptions,
  schoolOptions,
  teacherOptions,
  bookings,
  onOpenChange,
  onFormChange,
  onSubmit,
}: BookingTestCreateDialogProps) {
  const activeSubjectLabel = getSubjectLabel(activeSubject)

  const handleScheduleChange = (date: string, time: string, teacher: string) => {
    onFormChange((current) => ({
      ...current,
      scheduleDate: date,
      scheduleTime: time,
      teacher,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-h-[90vh] overflow-y-auto sm:max-w-5xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Tạo lịch test</DialogTitle>
          <DialogDescription>
            Môn học lấy theo tab đang chọn:{' '}
            <span className="font-semibold">{getSubjectLabel(activeSubject)}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <section className="p-2">
            <h3 className="mb-4 text-sm font-semibold">Thông tin lịch test</h3>
            <div className="grid gap-3">
              <FieldLabel label="Học viên">
                <StudentCombobox
                  options={studentOptions}
                  value={form.studentId}
                  onChange={(studentId, selected) => {
                    onFormChange((current) => ({
                      ...current,
                      studentId,
                      childName: selected ? selected.label : current.childName,
                    }))
                  }}
                  onCreateNew={(name) => {
                    onFormChange((current) => ({
                      ...current,
                      studentId: '',
                      childName: name,
                    }))
                  }}
                  placeholder="Chọn học viên..."
                  className="h-9 border-solid text-sm shadow-xs"
                />
              </FieldLabel>
              <FieldLabel label="Chương trình">
                <InlineSelect
                  value={form.program}
                  ariaLabel="Chương trình"
                  options={[
                    { value: '', label: 'Chọn chương trình' },
                    ...PROGRAM_OPTIONS.map((program) => ({ value: program, label: program })),
                  ]}
                  onValueChange={(value) =>
                    onFormChange((current) => ({ ...current, program: value }))
                  }
                  className="h-9 border-solid text-sm shadow-xs"
                />
              </FieldLabel>
              <FieldLabel label="Trình độ">
                <InlineSelect
                  value={form.level}
                  ariaLabel="Trình độ"
                  options={[
                    { value: '', label: 'Chọn trình độ' },
                    ...PROGRAM_LEVELS.map((level) => ({ value: level, label: level })),
                  ]}
                  onValueChange={(value) =>
                    onFormChange((current) => ({ ...current, level: value }))
                  }
                  className="h-9 border-solid text-sm shadow-xs"
                />
              </FieldLabel>
              <FieldLabel label="Trường">
                <BranchSelect
                  value={form.school}
                  branches={schoolOptions}
                  variant="inline"
                  includeAll={false}
                  onValueChange={(value) =>
                    onFormChange((current) => ({ ...current, school: value }))
                  }
                  className="h-9 border-solid text-sm shadow-xs"
                />
              </FieldLabel>
              <FieldLabel label="Loại ca test">
                <InlineSelect
                  value="30 phút"
                  disabled
                  ariaLabel="Loại ca test"
                  options={[
                    { value: '30 phút', label: '30 phút' },
                  ]}
                  onValueChange={() => {}}
                  className="h-9 border-solid text-sm shadow-xs"
                />
              </FieldLabel>
              <FieldLabel label="Ghi chú">
                <Textarea
                  rows={4}
                  value={form.notes}
                  onChange={(event) =>
                    onFormChange((current) => ({ ...current, notes: event.target.value }))
                  }
                />
              </FieldLabel>
            </div>
          </section>

          <section className="p-2">
            <BookingTestSchedulePanel
              program={form.program}
              school={form.school}
              testDuration={form.testDuration}
              scheduleDate={form.scheduleDate}
              scheduleTime={form.scheduleTime}
              teacher={form.teacher}
              teacherOptions={teacherOptions}
              bookings={bookings}
              onScheduleChange={handleScheduleChange}
            />
          </section>
        </div>

        <DialogFooter className="flex w-full items-center justify-between sm:justify-between">
          <div className="text-left text-sm text-muted-foreground">
            {form.scheduleDate && form.scheduleTime ? (
              <span>
                Đã chọn: <strong className="text-foreground">{form.teacher || 'Không chọn GV'}</strong> - {formatScheduleDate(form.scheduleDate)} {form.scheduleTime}{' '}
                <span className="ml-1 rounded-md border px-1.5 py-0.5 text-xs font-medium">
                  {activeSubjectLabel}
                </span>
              </span>
            ) : (
              <span>Chưa chọn lịch hẹn</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={onSubmit}>Tạo lịch test</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
