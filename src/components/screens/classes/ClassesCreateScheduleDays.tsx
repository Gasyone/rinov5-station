import { useState, useMemo, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FieldLabel, Panel, PersonnelHoverCard, AppAvatar } from '@/components/shared'
import { InlineSelect } from '@/components/controls'
import { UserPlus, GraduationCap, Check, ChevronDown, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockTeachers } from '@/mocks/teacherRecords'
import { mockClassRecords } from '@/mocks/classRecords'
import { isTeacherConflicting, getConflictingSchedule } from './TeacherDirectoryDialog'
import {
  WEEKDAY_DAYS,
  DURATION_OPTIONS,
  getRoomsForBranch,
  isRoomConflict,
  getMockRoomCount,
  getMockTeacherCount,
  calculateEndTime,
} from './classesCreateTypes'

interface ScheduleSlotState {
  dayOfWeek?: string
  startTime: string
  endTime: string
  teachers: string[]
  room: string
}

interface ScheduleDayState {
  enabled: boolean
  startTime: string
  endTime: string
  teachers: string[]
  room: string
  hasSecondary?: boolean
  secondarySlot?: ScheduleSlotState
}

interface ClassesCreateScheduleDaysProps {
  duration: number
  onDurationChange: (val: string) => void
  scheduleDays: Record<string, ScheduleDayState>
  onToggleDay: (dayId: string) => void
  onStartTimeChange: (dayId: string, val: string) => void
  onRoomChange: (dayId: string, val: string) => void
  onTeacherSelect: (dayId: string, teacherId: string, roleIndex: 0 | 1) => void
  onAddSecondarySlot?: (dayId: string) => void
  onRemoveSecondarySlot?: (dayId: string) => void
  onSecondaryDayOfWeekChange?: (dayId: string, val: string) => void
  onSecondaryStartTimeChange?: (dayId: string, val: string) => void
  onSecondaryRoomChange?: (dayId: string, val: string) => void
  onSecondaryTeacherSelect?: (dayId: string, teacherId: string, roleIndex: 0 | 1) => void
  branch: string
  validationErrors: Record<string, string>
}

interface SearchableInlineOption {
  value: string
  label: string
  subText?: string
  isConflict?: boolean
  conflictText?: string
}

interface SearchableInlineSelectProps {
  value: string
  options: SearchableInlineOption[]
  placeholder: string
  onValueChange: (val: string) => void
  disabled?: boolean
  className?: string
}

function DirectSearchableSelect({
  value,
  options,
  placeholder,
  onValueChange,
  disabled,
  className,
}: SearchableInlineSelectProps) {
  const selectedOption = options.find((opt) => opt.value === value)
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(selectedOption?.label || '')
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!isFocused) {
      setInputValue(selectedOption?.label || '')
    }
  }, [value, selectedOption, isFocused])

  const filteredOptions = useMemo(() => {
    if (!inputValue.trim() || (selectedOption && inputValue === selectedOption.label)) {
      return options
    }
    const q = inputValue.toLowerCase()
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.subText && opt.subText.toLowerCase().includes(q))
    )
  }, [options, inputValue, selectedOption])

  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Input
            value={inputValue}
            disabled={disabled}
            placeholder={placeholder}
            onFocus={() => {
              setIsFocused(true)
              setOpen(true)
            }}
            onBlur={() => {
              setIsFocused(false)
            }}
            onChange={(e) => {
              const val = e.target.value
              setInputValue(val)
              if (!open) setOpen(true)
              if (!val) {
                onValueChange('')
              }
            }}
            className={cn(
              'h-8 text-[12px] bg-background pr-7 text-left font-normal truncate',
              selectedOption?.isConflict &&
                'border-red-400 bg-red-50/50 text-red-700 dark:bg-red-950/20 dark:text-red-300 font-medium',
              className
            )}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-muted-foreground">
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] min-w-[200px] p-1.5 z-50 bg-background border rounded-xl shadow-xl"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="max-h-[200px] overflow-y-auto space-y-0.5 custom-scrollbar">
          {value ? (
            <div
              onMouseDown={(e) => {
                e.preventDefault()
                onValueChange('')
                setInputValue('')
                setOpen(false)
              }}
              className="p-1.5 rounded-md cursor-pointer text-[11px] text-muted-foreground hover:bg-muted/60 transition-colors italic"
            >
              -- Bỏ chọn / Chưa gán --
            </div>
          ) : null}
          {filteredOptions.length === 0 ? (
            <div className="text-center py-3 text-xs text-muted-foreground">
              Không tìm thấy dữ liệu
            </div>
          ) : (
            filteredOptions.map((opt) => {
              const isSelected = opt.value === value
              return (
                <div
                  key={opt.value}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    onValueChange(opt.value)
                    setInputValue(opt.label)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex flex-col gap-0.5 p-2 rounded-lg cursor-pointer transition-colors text-xs',
                    isSelected
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-muted/50 text-foreground'
                  )}
                >
                  <div className="flex items-center justify-between gap-1 min-w-0">
                    <span className="truncate font-semibold">{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </div>
                  {opt.subText && (
                    <span className="truncate text-[10px] text-muted-foreground">
                      {opt.subText}
                    </span>
                  )}
                  {opt.isConflict && opt.conflictText && (
                    <span className="text-[10px] text-red-500 font-semibold mt-0.5 truncate">
                      Trùng: {opt.conflictText}
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function ClassesCreateScheduleDays({
  duration,
  onDurationChange,
  scheduleDays,
  onToggleDay,
  onStartTimeChange,
  onRoomChange,
  onTeacherSelect,
  onAddSecondarySlot,
  onRemoveSecondarySlot,
  onSecondaryDayOfWeekChange,
  onSecondaryStartTimeChange,
  onSecondaryRoomChange,
  onSecondaryTeacherSelect,
  branch,
  validationErrors,
}: ClassesCreateScheduleDaysProps) {
  const weekdayOptions = useMemo(
    () => WEEKDAY_DAYS.map((d) => ({ value: d.label, label: d.label })),
    []
  )

  const shiftOptions = useMemo(() => {
    const baseTimes = ['08:00', '09:00', '09:45', '14:00', '15:45', '16:00', '17:00', '17:30', '18:00', '18:30', '19:00', '19:15', '20:00']
    
    // Add existing ones if not in list
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

  return (
    <Tabs defaultValue="list" className="w-full">
      <Panel
        title="Thời lượng & Lịch học"
        className="space-y-4"
        actions={
          <TabsList className="grid grid-cols-2 h-8 w-[160px] p-0.5">
            <TabsTrigger value="list" className="text-xs h-7">List</TabsTrigger>
            <TabsTrigger value="calendar" className="text-xs h-7">Calendar</TabsTrigger>
          </TabsList>
        }
      >
        <div className="grid grid-cols-1 gap-3">
          <FieldLabel label="Thời lượng">
            <InlineSelect
              value={String(duration)}
              options={DURATION_OPTIONS}
              placeholder="Thời lượng"
              onValueChange={onDurationChange}
              className="w-full justify-between"
              variant="solid"
            />
          </FieldLabel>
        </div>

        <TabsContent value="list" className="space-y-3 pt-2 mt-2">
          <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
            <span>Các ngày học trong tuần</span>
            {validationErrors.schedule && (
              <span className="text-[10px] text-red-500 font-bold normal-case">
                {validationErrors.schedule}
              </span>
            )}
          </span>
          <div className="space-y-3">
            {WEEKDAY_DAYS.map((day) => {
              const state = scheduleDays[day.id]

              // Filter available rooms dynamically based on branch and schedule conflicts
              const branchRooms = getRoomsForBranch(branch)
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

              const activeTeachers = mockTeachers.filter((t) => t.status === 'active')
              const branchTeachers = branch
                ? activeTeachers.filter((t) => t.branch === branch)
                : activeTeachers

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
                        onCheckedChange={() => onToggleDay(day.id)}
                      />
                      <span className="text-[13px] font-bold text-foreground">{day.label}</span>
                    </label>

                    {state.enabled && (
                      <div className="flex items-center gap-2">
                        {!state.hasSecondary && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onAddSecondarySlot?.(day.id)}
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
                          onValueChange={(val) => onStartTimeChange(day.id, val)}
                          className="h-8 w-[200px] rounded border px-2 text-[12px] bg-background justify-between"
                          variant="solid"
                        />
                      </div>
                    )}
                  </div>

                  {state.enabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2.5 border-t border-dashed">
                      {/* Cột 1: Phòng học */}
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
                        className="text-[11px] text-muted-foreground font-semibold w-full"
                      >
                        <DirectSearchableSelect
                          value={state.room}
                          options={filteredRoomOptions.map((r) => ({
                            value: r.value,
                            label: r.value,
                            subText: r.label,
                          }))}
                          placeholder="Chọn phòng..."
                          onValueChange={(val) => onRoomChange(day.id, val)}
                        />
                        {validationErrors[`room_${day.id}`] && (
                          <span className="text-[10px] text-red-500 font-semibold mt-1 block normal-case">
                            {validationErrors[`room_${day.id}`]}
                          </span>
                        )}
                      </FieldLabel>

                      {/* Cột 2: Giáo viên */}
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
                        className="text-[11px] text-muted-foreground font-semibold w-full"
                      >
                        <DirectSearchableSelect
                          value={state.teachers[0] || ''}
                          options={branchTeachers.map((t) => {
                            const hasConflict = isTeacherConflicting(t.id, day.id, state.startTime)
                            const conflictTime = hasConflict
                              ? getConflictingSchedule(t.id, day.id, state.startTime, state.endTime)
                              : ''
                            return {
                              value: t.id,
                              label: t.name,
                              subText: `${t.code} • ${t.phone}`,
                              isConflict: hasConflict,
                              conflictText: conflictTime,
                            }
                          })}
                          placeholder="Chọn giáo viên..."
                          onValueChange={(val) => onTeacherSelect(day.id, val, 0)}
                        />
                        {validationErrors[`teacher_${day.id}`] && (
                          <span className="text-[10px] text-red-500 font-semibold mt-1 block normal-case">
                            {validationErrors[`teacher_${day.id}`]}
                          </span>
                        )}
                      </FieldLabel>

                      {/* Cột 3: Trợ giảng */}
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
                        className="text-[11px] text-muted-foreground font-semibold w-full"
                      >
                        <DirectSearchableSelect
                          value={state.teachers[1] || ''}
                          options={branchTeachers.map((t) => {
                            const hasConflict = isTeacherConflicting(t.id, day.id, state.startTime)
                            const conflictTime = hasConflict
                              ? getConflictingSchedule(t.id, day.id, state.startTime, state.endTime)
                              : ''
                            return {
                              value: t.id,
                              label: t.name,
                              subText: `${t.code} • ${t.phone}`,
                              isConflict: hasConflict,
                              conflictText: conflictTime,
                            }
                          })}
                          placeholder="Chọn trợ giảng..."
                          onValueChange={(val) => onTeacherSelect(day.id, val, 1)}
                        />
                      </FieldLabel>
                    </div>
                  )}

                  {state.enabled && state.hasSecondary && (
                    <div className="pt-3 border-t border-dashed space-y-2.5">
                      {/* Secondary Slot Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <InlineSelect
                            value={state.secondarySlot?.dayOfWeek || day.label}
                            options={weekdayOptions}
                            placeholder="Chọn thứ..."
                            onValueChange={(val) => onSecondaryDayOfWeekChange?.(day.id, val)}
                            className="h-8 w-[110px] rounded border px-2 text-[12px] bg-background justify-between"
                            variant="solid"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveSecondarySlot?.(day.id)}
                            className="h-8 text-[11px] text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1 px-2 font-medium shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Xóa
                          </Button>
                          <InlineSelect
                            value={state.secondarySlot?.startTime || '19:15'}
                            options={shiftOptions}
                            placeholder="Chọn ca..."
                            onValueChange={(val) => onSecondaryStartTimeChange?.(day.id, val)}
                            className="h-8 w-[200px] rounded border px-2 text-[12px] bg-background justify-between"
                            variant="solid"
                          />
                        </div>
                      </div>

                      {/* Secondary Slot 3 Columns */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
                          className="text-[11px] text-muted-foreground font-semibold w-full"
                        >
                          <DirectSearchableSelect
                            value={state.secondarySlot?.room || ''}
                            options={branchRooms.map((r) => ({
                              value: r.value,
                              label: r.value,
                              subText: r.label,
                            }))}
                            placeholder="Chọn phòng..."
                            onValueChange={(val) => onSecondaryRoomChange?.(day.id, val)}
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
                          className="text-[11px] text-muted-foreground font-semibold w-full"
                        >
                          <DirectSearchableSelect
                            value={state.secondarySlot?.teachers?.[0] || ''}
                            options={branchTeachers.map((t) => {
                              const hasConflict = isTeacherConflicting(
                                t.id,
                                day.id,
                                state.secondarySlot?.startTime || '19:15'
                              )
                              const conflictTime = hasConflict
                                ? getConflictingSchedule(
                                    t.id,
                                    day.id,
                                    state.secondarySlot?.startTime || '19:15',
                                    state.secondarySlot?.endTime || '20:45'
                                  )
                                : ''
                              return {
                                value: t.id,
                                label: t.name,
                                subText: `${t.code} • ${t.phone}`,
                                isConflict: hasConflict,
                                conflictText: conflictTime,
                              }
                            })}
                            placeholder="Chọn giáo viên..."
                            onValueChange={(val) => onSecondaryTeacherSelect?.(day.id, val, 0)}
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
                        >
                          <DirectSearchableSelect
                            value={state.secondarySlot?.teachers?.[1] || ''}
                            options={branchTeachers.map((t) => {
                              const hasConflict = isTeacherConflicting(
                                t.id,
                                day.id,
                                state.secondarySlot?.startTime || '19:15'
                              )
                              const conflictTime = hasConflict
                                ? getConflictingSchedule(
                                    t.id,
                                    day.id,
                                    state.secondarySlot?.startTime || '19:15',
                                    state.secondarySlot?.endTime || '20:45'
                                  )
                                : ''
                              return {
                                value: t.id,
                                label: t.name,
                                subText: `${t.code} • ${t.phone}`,
                                isConflict: hasConflict,
                                conflictText: conflictTime,
                              }
                            })}
                            placeholder="Chọn trợ giảng..."
                            onValueChange={(val) => onSecondaryTeacherSelect?.(day.id, val, 1)}
                          />
                        </FieldLabel>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-4">
          <div className="border border-dashed rounded-xl p-8 text-center text-muted-foreground bg-muted/5">
            Giao diện Calendar (Chưa cấu hình)
          </div>
        </TabsContent>
      </Panel>
    </Tabs>
  )
}
