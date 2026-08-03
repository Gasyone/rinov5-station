'use client'

import { useState, useMemo } from 'react'
import { Plus, Trash2, Info } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { FieldLabel } from '@/components/shared'
import { InlineSelect, DirectSearchableSelect } from '@/components/controls'

import { mockTeachers } from '@/mocks/teacherRecords'
import { mockClassRecords, type ScheduleSlot, type ClassRecord } from '@/mocks/classRecords'

import { isTeacherConflicting, getConflictingSchedule } from '../TeacherDirectoryDialog'
import {
  WEEKDAY_DAYS,
  getRoomsForBranch,
  isRoomConflict,
  getMockRoomCount,
  getMockTeacherCount,
  calculateEndTime,
} from '../classesCreateTypes'

interface ClassesAddScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cls: ClassRecord
  onSave: (slots: ScheduleSlot[]) => void
}

interface SecondarySlotState {
  dayOfWeek?: string
  startTime: string
  endTime: string
  teachers: string[]
  assistants: string[]
  room: string
}

interface ScheduleDayState {
  enabled: boolean
  startTime: string
  endTime: string
  teachers: string[]
  assistants: string[]
  room: string
  hasSecondary?: boolean
  secondarySlot?: SecondarySlotState
}

const weekdayOptions = WEEKDAY_DAYS.map((d) => ({ value: d.label, label: d.label }))

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

  // Initialize configurations for all days of the week
  const [scheduleDays, setScheduleDays] = useState<Record<string, ScheduleDayState>>(() => {
    const initial: Record<string, ScheduleDayState> = {
      monday: { enabled: false, startTime: '18:00', endTime: '19:30', teachers: cls.teacher ? [cls.teacher] : [], assistants: ['Hoàng Anh'], room: cls.room || 'A101' },
      tuesday: { enabled: false, startTime: '18:00', endTime: '19:30', teachers: [], assistants: [], room: 'A102' },
      wednesday: { enabled: false, startTime: '18:00', endTime: '19:30', teachers: cls.teacher ? [cls.teacher] : [], assistants: [], room: cls.room || 'A101' },
      thursday: { enabled: false, startTime: '18:00', endTime: '19:30', teachers: [], assistants: [], room: 'B201' },
      friday: { enabled: false, startTime: '18:00', endTime: '19:30', teachers: cls.teacher ? [cls.teacher] : [], assistants: ['Bảo Ngọc'], room: cls.room || 'A101' },
      saturday: { enabled: false, startTime: '09:00', endTime: '10:30', teachers: [], assistants: [], room: 'C301' },
      sunday: { enabled: false, startTime: '09:00', endTime: '10:30', teachers: [], assistants: [], room: 'C301' },
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
            assistants: key === 'monday' ? ['Hoàng Anh'] : key === 'friday' ? ['Bảo Ngọc'] : [],
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

  const shiftOptions = useMemo(() => {
    const baseTimes = ['08:00', '09:00', '09:45', '14:00', '15:45', '16:00', '17:00', '17:30', '18:00', '18:30', '19:00', '19:15', '20:00']
    
    const times = [...baseTimes]
    Object.values(scheduleDays).forEach((dayState) => {
      if (dayState.enabled && dayState.startTime && !times.includes(dayState.startTime)) {
        times.push(dayState.startTime)
      }
    })
    
    times.sort((a, b) => {
      const [ha, ma] = a.split(':').map(Number)
      const [hb, mb] = b.split(':').map(Number)
      return (ha * 60 + ma) - (hb * 60 + mb)
    })
    
    return times.map((time) => {
      const end = calculateEndTime(time, duration)
      return {
        value: time,
        label: `Ca từ ${time} - đến ${end}`,
      }
    })
  }, [duration, scheduleDays])

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

  const handleTeacherSelect = (dayId: string, teacherId: string, roleIndex: 0 | 1) => {
    setScheduleDays((prev) => {
      const day = prev[dayId]
      if (roleIndex === 0) {
        return {
          ...prev,
          [dayId]: { ...day, teachers: teacherId ? [teacherId] : [] },
        }
      } else {
        return {
          ...prev,
          [dayId]: { ...day, assistants: teacherId ? [teacherId] : [] },
        }
      }
    })
  }

  // Secondary slot handlers
  const handleAddSecondarySlot = (dayId: string) => {
    setScheduleDays((prev) => {
      const day = prev[dayId]
      const defaultDayLabel = WEEKDAY_DAYS.find((d) => d.id === dayId)?.label || 'Thứ 2'
      return {
        ...prev,
        [dayId]: {
          ...day,
          hasSecondary: true,
          secondarySlot: {
            dayOfWeek: defaultDayLabel,
            startTime: '19:15',
            endTime: calculateEndTime('19:15', duration),
            teachers: day.teachers,
            assistants: day.assistants,
            room: day.room || 'A101',
          },
        },
      }
    })
  }

  const handleRemoveSecondarySlot = (dayId: string) => {
    setScheduleDays((prev) => {
      const day = prev[dayId]
      return {
        ...prev,
        [dayId]: {
          ...day,
          hasSecondary: false,
          secondarySlot: undefined,
        },
      }
    })
  }

  const handleSecondaryDayOfWeekChange = (dayId: string, val: string) => {
    setScheduleDays((prev) => {
      const day = prev[dayId]
      if (!day.secondarySlot) return prev
      return {
        ...prev,
        [dayId]: {
          ...day,
          secondarySlot: { ...day.secondarySlot, dayOfWeek: val },
        },
      }
    })
  }

  const handleSecondaryStartTimeChange = (dayId: string, val: string) => {
    setScheduleDays((prev) => {
      const day = prev[dayId]
      if (!day.secondarySlot) return prev
      return {
        ...prev,
        [dayId]: {
          ...day,
          secondarySlot: {
            ...day.secondarySlot,
            startTime: val,
            endTime: calculateEndTime(val, duration),
          },
        },
      }
    })
  }

  const handleSecondaryRoomChange = (dayId: string, val: string) => {
    setScheduleDays((prev) => {
      const day = prev[dayId]
      if (!day.secondarySlot) return prev
      return {
        ...prev,
        [dayId]: {
          ...day,
          secondarySlot: { ...day.secondarySlot, room: val },
        },
      }
    })
  }

  const handleSecondaryTeacherSelect = (dayId: string, teacherId: string, roleIndex: 0 | 1) => {
    setScheduleDays((prev) => {
      const day = prev[dayId]
      if (!day.secondarySlot) return prev
      if (roleIndex === 0) {
        return {
          ...prev,
          [dayId]: {
            ...day,
            secondarySlot: {
              ...day.secondarySlot,
              teachers: teacherId ? [teacherId] : [],
            },
          },
        }
      } else {
        return {
          ...prev,
          [dayId]: {
            ...day,
            secondarySlot: {
              ...day.secondarySlot,
              assistants: teacherId ? [teacherId] : [],
            },
          },
        }
      }
    })
  }

  const handleSave = () => {
    const activeSlots: ScheduleSlot[] = []

    WEEKDAY_DAYS.forEach((d) => {
      const state = scheduleDays[d.id]
      if (state.enabled) {
        activeSlots.push({
          dayOfWeek: d.label,
          date: '---',
          startTime: state.startTime,
          endTime: state.endTime,
          room: state.room,
          teachers: state.teachers
        })

        if (state.hasSecondary && state.secondarySlot) {
          activeSlots.push({
            dayOfWeek: state.secondarySlot.dayOfWeek || d.label,
            date: '---',
            startTime: state.secondarySlot.startTime,
            endTime: state.secondarySlot.endTime,
            room: state.secondarySlot.room,
            teachers: state.secondarySlot.teachers
          })
        }
      }
    })

    onSave(activeSlots)
    onOpenChange(false)
  }

  const activeTeachers = mockTeachers.filter((t) => t.status === 'active')
  const branchTeachers = cls.branch
    ? activeTeachers.filter((t) => t.branch === cls.branch)
    : activeTeachers

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[840px] p-0 overflow-hidden rounded-2xl border border-muted shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-muted/30 px-6 py-3.5 border-b border-border/60 shrink-0">
          <DialogHeader className="p-0 space-y-0">
            <DialogTitle className="text-base font-bold text-foreground">
              Thiết lập thời lượng & Lịch học cố định
            </DialogTitle>
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

              const branchRooms = getRoomsForBranch(cls.branch || '')
              const filteredRoomOptions =
                state.startTime && state.endTime
                  ? branchRooms.filter((r) => {
                      if (state.room === r.value) return true
                      return !isRoomConflict(
                        r.value,
                        day.label,
                        state.startTime,
                        state.endTime,
                        mockClassRecords
                      )
                    })
                  : branchRooms

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
                        {!state.hasSecondary && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddSecondarySlot(day.id)}
                            className="h-8 text-[11px] gap-1 font-medium text-primary border-primary/30 hover:bg-primary/5 hover:text-primary shrink-0"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Thêm buổi phụ
                          </Button>
                        )}
                        <InlineSelect
                          value={state.startTime}
                          options={shiftOptions}
                          placeholder="Chọn ca..."
                          onValueChange={(val) => handleStartTimeChange(day.id, val)}
                          className="h-8 w-[200px] rounded border px-2 text-[12px] bg-background justify-between"
                          variant="solid"
                        />
                      </div>
                    )}
                  </div>

                  {state.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2.5 border-t border-dashed">
                      {/* 1. Phòng học */}
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
                        className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider w-full"
                      >
                        <DirectSearchableSelect
                          value={state.room}
                          options={filteredRoomOptions.map((r) => ({
                            value: r.value,
                            label: r.value,
                            subText: r.label,
                          }))}
                          placeholder="Chọn phòng..."
                          onValueChange={(val) => handleRoomChange(day.id, val)}
                        />
                      </FieldLabel>

                      {/* 2. Giáo viên */}
                      <FieldLabel 
                        label={
                          <div className="flex items-center justify-between w-full">
                            <span>Giáo viên</span>
                            {state.startTime && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold normal-case">
                                {getMockTeacherCount(day.id, state.startTime)} khả dụng
                              </span>
                            )}
                          </div>
                        }
                        className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider w-full"
                      >
                        <DirectSearchableSelect
                          value={state.teachers[0] || ''}
                          options={branchTeachers.map((t) => {
                            const hasConflict = isTeacherConflicting(t.id, day.id, state.startTime)
                            const conflictTime = hasConflict
                              ? getConflictingSchedule(t.id, day.id, state.startTime, state.endTime)
                              : ''
                            return {
                              value: t.name,
                              label: t.name,
                              subText: `${t.code} • ${t.phone}`,
                              isConflict: hasConflict,
                              conflictText: conflictTime,
                            }
                          })}
                          placeholder="Chọn giáo viên..."
                          onValueChange={(val) => handleTeacherSelect(day.id, val, 0)}
                        />
                      </FieldLabel>

                      {/* 3. Trợ giảng */}
                      <FieldLabel 
                        label={
                          <div className="flex items-center justify-between w-full">
                            <span>Trợ giảng</span>
                            {state.startTime && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold normal-case">
                                {getMockTeacherCount(day.id, state.startTime)} khả dụng
                              </span>
                            )}
                          </div>
                        }
                        className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider w-full"
                      >
                        <DirectSearchableSelect
                          value={state.assistants[0] || ''}
                          options={branchTeachers.map((t) => {
                            const hasConflict = isTeacherConflicting(t.id, day.id, state.startTime)
                            const conflictTime = hasConflict
                              ? getConflictingSchedule(t.id, day.id, state.startTime, state.endTime)
                              : ''
                            return {
                              value: t.name,
                              label: t.name,
                              subText: `${t.code} • ${t.phone}`,
                              isConflict: hasConflict,
                              conflictText: conflictTime,
                            }
                          })}
                          placeholder="Chọn trợ giảng..."
                          onValueChange={(val) => handleTeacherSelect(day.id, val, 1)}
                        />
                      </FieldLabel>
                    </div>
                  )}

                  {/* Secondary slot (Buổi phụ) */}
                  {state.enabled && state.hasSecondary && (
                    <div className="pt-3 border-t border-dashed space-y-2.5">
                      {/* Secondary Slot Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <InlineSelect
                            value={state.secondarySlot?.dayOfWeek || day.label}
                            options={weekdayOptions}
                            placeholder="Chọn thứ..."
                            onValueChange={(val) => handleSecondaryDayOfWeekChange(day.id, val)}
                            className="h-8 w-[110px] rounded border px-2 text-[12px] bg-background justify-between"
                            variant="solid"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSecondarySlot(day.id)}
                            className="h-8 text-[11px] text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1 px-2 font-medium shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Xóa
                          </Button>
                          <InlineSelect
                            value={state.secondarySlot?.startTime || '19:15'}
                            options={shiftOptions}
                            placeholder="Chọn ca..."
                            onValueChange={(val) => handleSecondaryStartTimeChange(day.id, val)}
                            className="h-8 w-[200px] rounded border px-2 text-[12px] bg-background justify-between"
                            variant="solid"
                          />
                        </div>
                      </div>

                      {/* Secondary Slot 3 Columns */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        {/* Cột 1: Phòng học */}
                        <FieldLabel 
                          label={
                            <div className="flex items-center justify-between w-full">
                              <span>Phòng học</span>
                              {state.secondarySlot?.startTime && (
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold normal-case">
                                  {getMockRoomCount(day.id, state.secondarySlot.startTime)} trống
                                </span>
                              )}
                            </div>
                          }
                          className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider w-full"
                        >
                          <DirectSearchableSelect
                            value={state.secondarySlot?.room || ''}
                            options={filteredRoomOptions.map((r) => ({
                              value: r.value,
                              label: r.value,
                              subText: r.label,
                            }))}
                            placeholder="Chọn phòng..."
                            onValueChange={(val) => handleSecondaryRoomChange(day.id, val)}
                          />
                        </FieldLabel>

                        {/* Cột 2: Giáo viên */}
                        <FieldLabel 
                          label={
                            <div className="flex items-center justify-between w-full">
                              <span>Giáo viên</span>
                              {state.secondarySlot?.startTime && (
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold normal-case">
                                  {getMockTeacherCount(day.id, state.secondarySlot.startTime)} khả dụng
                                </span>
                              )}
                            </div>
                          }
                          className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider w-full"
                        >
                          <DirectSearchableSelect
                            value={state.secondarySlot?.teachers[0] || ''}
                            options={branchTeachers.map((t) => {
                              const hasConflict = state.secondarySlot?.startTime
                                ? isTeacherConflicting(t.id, day.id, state.secondarySlot.startTime)
                                : false
                              const conflictTime = hasConflict && state.secondarySlot
                                ? getConflictingSchedule(t.id, day.id, state.secondarySlot.startTime, state.secondarySlot.endTime)
                                : ''
                              return {
                                value: t.name,
                                label: t.name,
                                subText: `${t.code} • ${t.phone}`,
                                isConflict: hasConflict,
                                conflictText: conflictTime,
                              }
                            })}
                            placeholder="Chọn giáo viên..."
                            onValueChange={(val) => handleSecondaryTeacherSelect(day.id, val, 0)}
                          />
                        </FieldLabel>

                        {/* Cột 3: Trợ giảng */}
                        <FieldLabel 
                          label={
                            <div className="flex items-center justify-between w-full">
                              <span>Trợ giảng</span>
                              {state.secondarySlot?.startTime && (
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold normal-case">
                                  {getMockTeacherCount(day.id, state.secondarySlot.startTime)} khả dụng
                                </span>
                              )}
                            </div>
                          }
                          className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider w-full"
                        >
                          <DirectSearchableSelect
                            value={state.secondarySlot?.assistants[0] || ''}
                            options={branchTeachers.map((t) => {
                              const hasConflict = state.secondarySlot?.startTime
                                ? isTeacherConflicting(t.id, day.id, state.secondarySlot.startTime)
                                : false
                              const conflictTime = hasConflict && state.secondarySlot
                                ? getConflictingSchedule(t.id, day.id, state.secondarySlot.startTime, state.secondarySlot.endTime)
                                : ''
                              return {
                                value: t.name,
                                label: t.name,
                                subText: `${t.code} • ${t.phone}`,
                                isConflict: hasConflict,
                                conflictText: conflictTime,
                              }
                            })}
                            placeholder="Chọn trợ giảng..."
                            onValueChange={(val) => handleSecondaryTeacherSelect(day.id, val, 1)}
                          />
                        </FieldLabel>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-border/80 bg-muted/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Left: Notice Badge */}
          <div className="flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200/70 dark:border-amber-900/50">
            <Info className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-medium">Lưu ý: Thay đổi lịch cố định sẽ tự động cập nhật lịch các buổi học tương lai.</span>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 ms-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 px-3 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="h-8 px-4 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-xs cursor-pointer"
            >
              Lưu áp dụng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
