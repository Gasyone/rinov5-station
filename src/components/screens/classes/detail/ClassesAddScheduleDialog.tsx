'use client'

import { useState, useMemo } from 'react'
import { Globe } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FieldLabel } from '@/components/shared'
import { InlineSelect, SearchableCombobox } from '@/components/controls'
import { TeacherDirectoryDialog } from '../TeacherDirectoryDialog'
import { mockTeachers } from '@/mocks/teacherRecords'
import type { ScheduleSlot, ClassRecord } from '@/mocks/classRecords'

interface ClassesAddScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cls: ClassRecord
  onSave: (slots: ScheduleSlot[]) => void
}

interface ScheduleDayState {
  enabled: boolean
  startTime: string
  endTime: string
  teachers: string[]
  room: string
}

const WEEKDAY_DAYS = [
  { id: 'monday', label: 'Thứ 2' },
  { id: 'tuesday', label: 'Thứ 3' },
  { id: 'wednesday', label: 'Thứ 4' },
  { id: 'thursday', label: 'Thứ 5' },
  { id: 'friday', label: 'Thứ 6' },
  { id: 'saturday', label: 'Thứ 7' },
  { id: 'sunday', label: 'Chủ nhật' },
]

const ROOM_OPTIONS = [
  { value: 'A101', label: 'Phòng A101' },
  { value: 'A102', label: 'Phòng A102' },
  { value: 'A103', label: 'Phòng A103' },
  { value: 'B201', label: 'Phòng B201' },
  { value: 'B202', label: 'Phòng B202' },
  { value: 'C301', label: 'Phòng C301' },
  { value: 'C302', label: 'Phòng C302' },
  { value: 'D401', label: 'Phòng D401' },
  { value: 'D402', label: 'Phòng D402' },
  { value: 'E501', label: 'Phòng E501' },
]

const sortedTeachers = [...mockTeachers].sort((a, b) => a.name.localeCompare(b.name, 'vi'))

// Pure helper function to calculate end time
const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  if (!startTime || !durationMinutes) return ''
  const [h, m] = startTime.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return ''
  const startMinutes = h * 60 + m
  const endMinutes = startMinutes + durationMinutes
  const endH = Math.floor(endMinutes / 60) % 24
  const endM = endMinutes % 60
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
}

const getMockRoomCount = (dayId: string, startTime: string): number => {
  if (!startTime) return 0
  const hour = parseInt(startTime.split(':')[0]) || 17
  const dayLength = dayId.length
  const hash = (dayLength + hour) % 4
  return [14, 8, 12, 10][hash]
}

const getMockTeacherCount = (dayId: string, startTime: string): number => {
  if (!startTime) return 0
  const hour = parseInt(startTime.split(':')[0]) || 17
  const dayLength = dayId.length
  const hash = (dayLength + hour) % 4
  return [9, 6, 8, 5][hash]
}

const parseClassDuration = (cls: ClassRecord): number => {
  if (cls.scheduleSlots && cls.scheduleSlots.length > 0) {
    const slot = cls.scheduleSlots[0]
    const [sh, sm] = slot.startTime.split(':').map(Number)
    const [eh, em] = slot.endTime.split(':').map(Number)
    if (!isNaN(sh) && !isNaN(sm) && !isNaN(eh) && !isNaN(em)) {
      const diff = (eh * 60 + em) - (sh * 60 + sm)
      if (diff > 0) return diff
    }
  }
  const timePart = cls.schedule?.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/)
  if (timePart) {
    const [sh, sm] = timePart[1].split(':').map(Number)
    const [eh, em] = timePart[2].split(':').map(Number)
    if (!isNaN(sh) && !isNaN(sm) && !isNaN(eh) && !isNaN(em)) {
      const diff = (eh * 60 + em) - (sh * 60 + sm)
      if (diff > 0) return diff
    }
  }
  return 90
}

export function ClassesAddScheduleDialog({
  open,
  onOpenChange,
  cls,
  onSave
}: ClassesAddScheduleDialogProps) {
  const duration = useMemo(() => parseClassDuration(cls), [cls])

  const activeOriginalDays = useMemo(() => {
    const active = new Set<string>()
    if (cls.scheduleSlots && cls.scheduleSlots.length > 0) {
      cls.scheduleSlots.forEach((slot) => {
        const dayMap: Record<string, string> = {
          'Thứ 2': 'monday',
          'Thứ 3': 'tuesday',
          'Thứ 4': 'wednesday',
          'Thứ 5': 'thursday',
          'Thứ 6': 'friday',
          'Thứ 7': 'saturday',
          'Chủ nhật': 'sunday',
        }
        const key = dayMap[slot.dayOfWeek]
        if (key) active.add(key)
      })
    }
    return active
  }, [cls.scheduleSlots])

  // Global Teacher Directory Modal state
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false)
  const [activeDayIdForTeacherModal, setActiveDayIdForTeacherModal] = useState<string | null>(null)

  // Initialize configurations for all days of the week
  const [scheduleDays, setScheduleDays] = useState<Record<string, ScheduleDayState>>(() => {
    const initial: Record<string, ScheduleDayState> = {
      monday: { enabled: false, startTime: '18:00', endTime: '19:30', teachers: cls.teacher ? [cls.teacher] : [], room: cls.room || 'A101' },
      tuesday: { enabled: false, startTime: '18:00', endTime: '19:30', teachers: [], room: 'A102' },
      wednesday: { enabled: false, startTime: '18:00', endTime: '19:30', teachers: cls.teacher ? [cls.teacher] : [], room: cls.room || 'A101' },
      thursday: { enabled: false, startTime: '18:00', endTime: '19:30', teachers: [], room: 'B201' },
      friday: { enabled: false, startTime: '18:00', endTime: '19:30', teachers: cls.teacher ? [cls.teacher] : [], room: cls.room || 'A101' },
      saturday: { enabled: false, startTime: '09:00', endTime: '10:30', teachers: [], room: 'C301' },
      sunday: { enabled: false, startTime: '09:00', endTime: '10:30', teachers: [], room: 'C301' },
    }

    if (cls.scheduleSlots && cls.scheduleSlots.length > 0) {
      cls.scheduleSlots.forEach((slot) => {
        const dayMap: Record<string, string> = {
          'Thứ 2': 'monday',
          'Thứ 3': 'tuesday',
          'Thứ 4': 'wednesday',
          'Thứ 5': 'thursday',
          'Thứ 6': 'friday',
          'Thứ 7': 'saturday',
          'Chủ nhật': 'sunday',
        }
        const key = dayMap[slot.dayOfWeek]
        if (key && key in initial) {
          initial[key] = {
            enabled: true,
            startTime: slot.startTime,
            endTime: slot.endTime,
            teachers: slot.teachers && slot.teachers.length > 0 ? slot.teachers : (cls.teacher ? [cls.teacher] : []),
            room: slot.room || cls.room || 'A101'
          }
        }
      })
    } else {
      if (cls.schedule?.includes('T2/4/6') || cls.schedule?.includes('2/4/6')) {
        initial.monday.enabled = true
        initial.wednesday.enabled = true
        initial.friday.enabled = true
      } else if (cls.schedule?.includes('T3/5') || cls.schedule?.includes('3/5')) {
        initial.tuesday.enabled = true
        initial.thursday.enabled = true
      }
    }
    return initial
  })

  // Dynamic combobox options with fallback for current assigned teacher
  const teacherComboboxOptions = useMemo(() => {
    const list = sortedTeachers.map((t) => ({
      id: t.name,
      label: t.name,
      subLabel: `${t.code} • ${t.phone}`,
      initials: t.name.split(' ').map((n) => n[0]).slice(-2).join('').toUpperCase()
    }))

    Object.values(scheduleDays).forEach((state) => {
      const teacherName = state.teachers[0]
      if (teacherName && !list.some((opt) => opt.id === teacherName)) {
        list.push({
          id: teacherName,
          label: teacherName,
          subLabel: 'Giáo viên lớp học',
          initials: teacherName.split(' ').map((n) => n[0]).slice(-2).join('').toUpperCase()
        })
      }
    })

    return list
  }, [scheduleDays])

  const handleToggleDay = (dayId: string) => {
    setScheduleDays((prev) => {
      const day = prev[dayId]
      const nextEnabled = !day.enabled
      const nextEndTime = nextEnabled ? calculateEndTime(day.startTime, duration) : ''
      return {
        ...prev,
        [dayId]: {
          ...day,
          enabled: nextEnabled,
          endTime: nextEndTime,
        },
      }
    })
  }

  const handleStartTimeChange = (dayId: string, nextStartTime: string) => {
    setScheduleDays((prev) => {
      const day = prev[dayId]
      return {
        ...prev,
        [dayId]: {
          ...day,
          startTime: nextStartTime,
          endTime: calculateEndTime(nextStartTime, duration),
        },
      }
    })
  }

  const handleRoomChange = (dayId: string, roomVal: string) => {
    setScheduleDays((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        room: roomVal,
      },
    }))
  }

  const handleSave = () => {
    const activeSlots: ScheduleSlot[] = WEEKDAY_DAYS.filter((d) => scheduleDays[d.id].enabled).map((d) => {
      const state = scheduleDays[d.id]
      return {
        dayOfWeek: d.label,
        date: '---',
        startTime: state.startTime,
        endTime: state.endTime,
        room: state.room,
        teachers: state.teachers
      }
    })

    onSave(activeSlots)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[720px] p-0 overflow-hidden rounded-2xl border border-muted shadow-2xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="bg-primary/5 px-6 py-4 border-b border-muted shrink-0">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground">
                Thiết lập thời lượng & Lịch học cố định
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Tạo lịch học hàng tuần cho lớp {cls.name}. Chọn các buổi học, thiết lập giờ học, phòng học, và điều phối giảng viên.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide px-1">
              Các ngày học trong tuần
            </span>
            
            <div className="space-y-3">
              {WEEKDAY_DAYS.map((day) => {
                const state = scheduleDays[day.id]
                return (
                  <div 
                    key={day.id} 
                    className={`border rounded-xl p-3 space-y-3 transition-all duration-200 ${
                      state.enabled 
                        ? 'bg-muted/30 border-muted-foreground/20 shadow-sm' 
                        : 'bg-background hover:bg-muted/5 border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <label className="flex cursor-pointer items-center gap-2.5 shrink-0 select-none">
                        <Checkbox 
                          checked={state.enabled}
                          onCheckedChange={() => handleToggleDay(day.id)}
                        />
                        <span className="text-[13px] font-bold text-foreground">
                          {day.label}
                        </span>
                        {activeOriginalDays.has(day.id) && (
                          <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded font-semibold border border-primary/20 select-none">
                            Đang hoạt động
                          </span>
                        )}
                      </label>

                      {state.enabled && (
                        <div className="flex items-center gap-2">
                          <Input 
                            type="time"
                            value={state.startTime}
                            onChange={(e) => handleStartTimeChange(day.id, e.target.value)}
                            className="h-8 w-24 rounded border px-2 text-[12px] bg-background"
                          />
                          <span className="text-[11px] text-muted-foreground">đến</span>
                          <Input 
                            type="time"
                            value={state.endTime}
                            readOnly
                            className="h-8 w-24 rounded border bg-muted/40 px-2 text-[12px] opacity-70 cursor-not-allowed"
                          />
                        </div>
                      )}
                    </div>

                    {state.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2.5 border-t border-dashed">
                        {/* Room Selection */}
                        <FieldLabel 
                          label={
                            <div className="flex items-center justify-between w-full">
                              <span>Phòng học</span>
                              {state.startTime && (
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold normal-case">
                                  {getMockRoomCount(day.id, state.startTime)} trống
                                </span>
                              )}
                            </div>
                          }
                          className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider w-full"
                        >
                          <InlineSelect
                            value={state.room}
                            options={ROOM_OPTIONS}
                            placeholder="Chọn phòng học..."
                            onValueChange={(val) => handleRoomChange(day.id, val)}
                            className="w-full justify-between h-8 text-[12px] bg-background"
                            variant="solid"
                          />
                        </FieldLabel>

                        {/* Single teacher selection */}
                        <FieldLabel 
                          label={
                            <div className="flex items-center justify-between w-full">
                              <span>Giáo viên giảng dạy</span>
                              {state.startTime && (
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold normal-case">
                                  {getMockTeacherCount(day.id, state.startTime)} khả dụng
                                </span>
                              )}
                            </div>
                          }
                          className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider w-full"
                        >
                          <div className="flex items-center gap-1.5 w-full">
                            <div className="flex-1 min-w-0">
                              <SearchableCombobox
                                options={teacherComboboxOptions}
                                value={state.teachers[0] || ''}
                                onChange={(val) => {
                                  setScheduleDays((prev) => ({
                                    ...prev,
                                    [day.id]: {
                                      ...prev[day.id],
                                      teachers: val ? [val as string] : [],
                                    },
                                  }))
                                }}
                                placeholder="Chọn giáo viên giảng dạy..."
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 shrink-0 border border-input"
                              onClick={() => {
                                setActiveDayIdForTeacherModal(day.id)
                                setIsTeacherModalOpen(true)
                              }}
                              title="Lọc giáo viên toàn hệ thống"
                            >
                              <Globe className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </FieldLabel>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-muted bg-muted/10 flex justify-end gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-lg text-xs"
            >
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="rounded-lg text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Lưu áp dụng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Global Teacher Directory Dialog */}
      {isTeacherModalOpen && activeDayIdForTeacherModal && (
        <TeacherDirectoryDialog
          open={isTeacherModalOpen}
          onOpenChange={setIsTeacherModalOpen}
          dayOfWeek={WEEKDAY_DAYS.find((d) => d.id === activeDayIdForTeacherModal)?.label || ''}
          startTime={scheduleDays[activeDayIdForTeacherModal]?.startTime}
          onSelectTeacher={(teacherId, teacherName) => {
            setScheduleDays((prev) => ({
              ...prev,
              [activeDayIdForTeacherModal]: {
                ...prev[activeDayIdForTeacherModal],
                teachers: [teacherName],
              },
            }))
            setIsTeacherModalOpen(false)
          }}
        />
      )}
    </>
  )
}
