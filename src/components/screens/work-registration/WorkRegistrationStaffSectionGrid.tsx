'use client'

import { useMemo } from 'react'
import { BookOpen, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WEEKDAYS, type ShiftSection, getMasterShiftRoster } from '@/mocks/shiftRoster'
import {
  toWorkDateKey,
  WORK_TIME_SLOTS,
  type WorkPrioritySlotRule,
  type WorkRegistrationEmployee,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import { ClassSessionHoverCard } from '@/components/screens/calendar/ClassSessionHoverCard'
import {
  calculateDailyRegistrationMinutes,
  calculateSectionRegistrationMinutes,
  calculateSlotPosition,
  formatCompactTimeLabel,
  formatDurationShort,
  getSectionHourTicks,
  groupConsecutiveSlots,
  resolveClassCode,
  resolveClassSessionHoverData,
} from './workRegistrationHelpers'
import { WORK_REGISTRATION_GRID_SECTIONS } from './workRegistrationTypes'

interface WorkRegistrationStaffSectionGridProps {
  days: Date[]
  records: WorkRegistrationRecord[]
  employees: WorkRegistrationEmployee[]
  todayKey: string
  editableEmployeeId?: string
  readonlyWeek?: boolean
  priorityRules?: WorkPrioritySlotRule[]
  onToggleSection?: (date: string, section: ShiftSection) => void
  onRemoveSlots?: (date: string, slotIds: string[]) => void
  onOpenSlotDetail?: (date: string, slotId?: string, section?: string) => void
}

export function WorkRegistrationStaffSectionGrid({
  days,
  records,
  employees,
  todayKey,
  editableEmployeeId,
  readonlyWeek,
  onRemoveSlots,
  onOpenSlotDetail,
}: WorkRegistrationStaffSectionGridProps) {
  const employeeById = useMemo(
    () => new Map(employees.map((emp) => [emp.id, emp])),
    [employees]
  )

  const masterRoster = useMemo(() => getMasterShiftRoster(), [])

  // Map ngày với index 0..6
  const dayDateKeys = useMemo(
    () => days.map((day) => toWorkDateKey(day)),
    [days]
  )

  // Map tổng thời lượng theo từng ngày (phục vụ hiển thị trên header thứ)
  const dailyMinutesMap = useMemo(() => {
    const map = new Map<string, number>()
    if (!editableEmployeeId) return map
    for (const dateKey of dayDateKeys) {
      map.set(
        dateKey,
        calculateDailyRegistrationMinutes(records, editableEmployeeId, dateKey)
      )
    }
    return map
  }, [records, editableEmployeeId, dayDateKeys])

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-card overflow-hidden">
      {/* VÙNG CUỘN NỘI DUNG LỊCH (PHẲNG FULL KHÔNG KHUNG VIỀN NGOÀI) */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="flex flex-col flex-1 min-w-[860px]">
          {/* HEADER: 7 THỨ TRONG TUẦN - 1 DÒNG DUY NHẤT: THỨ + GIỜ (KHÔNG CẦN NGÀY VÌ ĐÂY LÀ LỊCH TUẦN ĐỊNH DANH) */}
          <div className="shrink-0 grid grid-cols-7 divide-x bg-card text-xs font-semibold text-foreground sticky top-0 z-20 border-b">
            {WEEKDAYS.map((day, idx) => {
              const dateObj = days[idx]
              const dateKey = dateObj ? toWorkDateKey(dateObj) : ''
              const isToday = dateKey === todayKey
              const dayTotalMins = dailyMinutesMap.get(dateKey) || 0

              return (
                <div
                  key={day.index}
                  className={cn(
                    'px-2 py-1.5 flex items-center justify-center gap-1.5 text-center relative bg-card',
                    isToday && 'bg-primary/5'
                  )}
                >
                  <span className={cn('font-bold text-xs', isToday ? 'text-primary' : 'text-foreground')}>
                    {day.label}
                  </span>
                  {editableEmployeeId && (
                    <span
                      className={cn(
                        'text-xs font-bold tabular-nums',
                        dayTotalMins > 0 ? 'text-primary' : 'text-muted-foreground/35 font-normal'
                      )}
                    >
                      ({dayTotalMins > 0 ? formatDurationShort(dayTotalMins) : '0h'})
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* 3 HÀNG BUỔI: SÁNG, CHIỀU, TỐI */}
          {WORK_REGISTRATION_GRID_SECTIONS.map((sec) => {
            const hourTicks = getSectionHourTicks(sec.id)
            const sectionStats = editableEmployeeId
              ? calculateSectionRegistrationMinutes(records, editableEmployeeId, sec.id)
              : null

            return (
            <div key={sec.id} className="flex-1 min-h-[110px] flex flex-col">
              {/* TIÊU ĐỀ CA CÓ PHỦ NỀN ĐẸP (RIBBON HEADER) + THỐNG KÊ TỔNG CA TUẦN */}
              <div
                className={cn(
                  'shrink-0 flex items-center justify-between px-3 py-1 border-y text-xs font-bold transition-colors',
                  sec.id === 'morning'
                    ? 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-500/20 text-amber-900 dark:text-amber-200'
                    : sec.id === 'afternoon'
                    ? 'bg-sky-500/10 dark:bg-sky-950/40 border-sky-500/20 text-sky-900 dark:text-sky-200'
                    : 'bg-purple-500/10 dark:bg-purple-950/40 border-purple-500/20 text-purple-900 dark:text-purple-200'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="uppercase tracking-wider font-bold text-xs">
                    {sec.label}
                  </span>
                  <span
                    className={cn(
                      'text-xs font-normal',
                      sec.id === 'morning'
                        ? 'text-amber-700/80 dark:text-amber-400/80'
                        : sec.id === 'afternoon'
                        ? 'text-sky-700/80 dark:text-sky-400/80'
                        : 'text-purple-700/80 dark:text-purple-400/80'
                    )}
                  >
                    ({sec.start} - {sec.end})
                  </span>
                </div>

                {sectionStats && sectionStats.totalMinutes > 0 && (
                  <div className="flex items-center gap-2 text-[11px] font-medium opacity-85">
                    <span>
                      Tổng ca tuần: <strong>{sectionStats.shiftCount} buổi</strong> ({formatDurationShort(sectionStats.totalMinutes)})
                    </span>
                  </div>
                )}
              </div>

              {/* 7 CỘT THỨ (PHÂN CÁCH BẰNG ĐƯỜNG KẺ DỌC divide-x) */}
              <div className="flex-1 grid grid-cols-7 divide-x divide-border/60 min-h-[92px]">
              {dayDateKeys.map((dateKey, dayIndex) => {
                
                // Lấy tất cả các records thuộc ngày và ca này
                const sectionRecords = records.filter(
                  (r) => r.date === dateKey && r.slotId.startsWith(sec.id)
                )

                // Danh sách nhân sự đăng ký trong ca này (dùng cho Overview)
                const registeredEmpIds = Array.from(new Set(sectionRecords.map((r) => r.employeeId)))
                const registeredEmployees = registeredEmpIds
                  .map((id) => employeeById.get(id))
                  .filter(Boolean) as WorkRegistrationEmployee[]

                // -------------------------------------------------------------
                // TRƯỜNG HỢP 1: ĐANG XEM / ĐĂNG KÝ CHO 1 NHÂN VIÊN (LỊCH CỦA TÔI / ĐĂNG KÝ THAY)
                // -------------------------------------------------------------
                if (editableEmployeeId) {
                  const activeEmp = employeeById.get(editableEmployeeId)
                  const isDutyAssigned = Boolean(
                    masterRoster.some(
                      (r) =>
                        (!activeEmp?.branch || r.branch === activeEmp.branch) &&
                        r.dayIndex === dayIndex &&
                        (r.section === sec.id || (sec.id === 'evening' && r.section === 'evening_digi')) &&
                        r.assignedEmployeeIds.includes(editableEmployeeId)
                    )
                  )
                  const intervals = groupConsecutiveSlots(records, editableEmployeeId, dateKey, sec.id)
                  const empSectionRecords = sectionRecords.filter((r) => r.employeeId === editableEmployeeId)
                  const assignedClassRecords = empSectionRecords.filter((r) => Boolean(r.assignedClass))
                  const assignedClassRecord = assignedClassRecords[0]

                  let classTimeRange = `${sec.start} - ${sec.end}`
                  let classCode = ''
                  let classStart = sec.start
                  let classEnd = sec.end

                  if (assignedClassRecord) {
                    classCode = resolveClassCode(
                      assignedClassRecord.assignedClass,
                      assignedClassRecord.assignedClassCode
                    )
                    const classSlots = assignedClassRecords
                      .map((r) => WORK_TIME_SLOTS.find((s) => s.id === r.slotId))
                      .filter(Boolean)
                      .sort((a, b) => a!.start.localeCompare(b!.start))
                    if (classSlots.length > 0) {
                      classStart = classSlots[0]!.start
                      classEnd = classSlots[classSlots.length - 1]!.end
                      classTimeRange = `${classStart} - ${classEnd}`
                    }
                  }

                  const hasContent = intervals.length > 0 || Boolean(assignedClassRecord)

                  return (
                    <div
                      key={dateKey}
                      className={cn(
                        'relative h-full min-h-[92px] overflow-hidden transition-colors',
                        hasContent ? 'bg-card' : 'bg-muted/5 hover:bg-muted/15'
                      )}
                    >
                      {/* Thước đo mốc giờ ngầm (Subtle hour gridlines) */}
                      {hourTicks.map((tick) => (
                        <div
                          key={tick.time}
                          className="absolute inset-x-0 border-b border-dashed border-border/25 pointer-events-none z-0"
                          style={{ top: `${tick.topPercent}%` }}
                        />
                      ))}

                      {/* Khối lớp giảng dạy phân công (nếu có) */}
                      {assignedClassRecord && (() => {
                        const { topPercent: classTop, heightPercent: classHeight } = calculateSlotPosition(
                          classStart,
                          classEnd,
                          sec.start,
                          sec.end
                        )
                        const isTaller = classHeight >= 40

                        return (
                          <div
                            style={{
                              top: `${classTop}%`,
                              height: `${classHeight}%`,
                              minHeight: '36px',
                            }}
                            className="absolute inset-x-1 z-10 p-0.5"
                          >
                            <ClassSessionHoverCard
                              session={resolveClassSessionHoverData(
                                assignedClassRecord,
                                employeeById.get(assignedClassRecord.employeeId)?.name || 'Thu Hà',
                                classTimeRange,
                                assignedClassRecord.branch || 'RinoEdu Linh Đàm'
                              )}
                              hideRoom={true}
                              hideStudents={true}
                              hideBranch={true}
                            >
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="flex flex-col justify-between h-full w-full rounded-md border border-indigo-400/90 border-l-[3.5px] border-l-indigo-600 bg-indigo-50/95 dark:bg-indigo-950/70 dark:border-indigo-600/80 dark:border-l-indigo-500 p-1.5 cursor-pointer shadow-2xs hover:bg-indigo-100/90 hover:border-indigo-500 dark:hover:bg-indigo-900/70 transition-all group/class overflow-hidden"
                              >
                                <div className="flex items-center justify-between gap-1 text-[11px] text-indigo-800 dark:text-indigo-300 tracking-tight">
                                  <span className="flex items-center gap-1 font-normal truncate">
                                    <BookOpen className="h-3 w-3 shrink-0 text-indigo-700 dark:text-indigo-400" />
                                    <span>{classTimeRange}</span>
                                  </span>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <Info className="h-3 w-3 opacity-75 group-hover/class:opacity-100 transition-opacity text-indigo-700 dark:text-indigo-400" />
                                  </div>
                                </div>
                                <div className="flex items-baseline justify-between gap-1 mt-0.5">
                                  <span
                                    className="text-xs font-bold truncate leading-tight text-indigo-950 dark:text-indigo-100 font-mono"
                                    title={assignedClassRecord.assignedClass}
                                  >
                                    {classCode}
                                  </span>
                                </div>
                                {isTaller && (
                                  <div className="flex items-center justify-between gap-1 mt-auto pt-0.5 border-t border-indigo-200/60 dark:border-indigo-800/50 text-[10px] text-indigo-800/90 dark:text-indigo-300">
                                    <span className="truncate">{assignedClassRecord.assignedClass || 'Toán tư duy'}</span>
                                    <span className="text-[9px] font-bold bg-indigo-200/80 dark:bg-indigo-900/80 px-1 py-0.2 rounded shrink-0">
                                      Lớp dạy
                                    </span>
                                  </div>
                                )}
                              </div>
                            </ClassSessionHoverCard>
                          </div>
                        )
                      })()}

                      {/* Các khoảng thời gian làm việc đã đăng ký hoặc nháp */}
                      {intervals.map((interval) => {
                        const { topPercent, heightPercent } = calculateSlotPosition(
                          interval.start,
                          interval.end,
                          sec.start,
                          sec.end
                        )
                        const isFullShift = interval.start === sec.start && interval.end === sec.end
                        const isTaller = heightPercent >= 40

                        if (interval.isDraft) {
                          return (
                            <div
                              key={`${interval.start}-${interval.end}-${interval.status}`}
                              style={{
                                top: `${topPercent}%`,
                                height: `${heightPercent}%`,
                                minHeight: '28px',
                              }}
                              className="absolute inset-x-1 z-2 p-0.5"
                            >
                              <div
                                className={cn(
                                  'h-full w-full rounded-md border-2 border-dashed border-emerald-500/90 bg-emerald-50/95 dark:bg-emerald-950/70 p-1.5 text-xs shadow-2xs font-semibold text-emerald-950 dark:text-emerald-200 transition-all animate-in fade-in flex overflow-hidden',
                                  isTaller ? 'flex-col justify-between' : 'items-center justify-between gap-1 py-0.5'
                                )}
                              >
                                <div className="flex items-center justify-between gap-1 w-full">
                                  <div className="flex items-center gap-1 min-w-0">
                                    <span className="text-[11px] font-normal truncate">
                                      {isFullShift ? 'Cả buổi' : `${interval.start} - ${interval.end}`}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    {!isTaller && (
                                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                                        Chờ lưu
                                      </span>
                                    )}
                                    {!readonlyWeek && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          onRemoveSlots?.(dateKey, interval.slotIds)
                                        }}
                                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-emerald-700 hover:bg-emerald-200 hover:text-destructive transition-colors cursor-pointer"
                                        title="Hủy bỏ khung giờ mới này"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {isTaller && (
                                  <div className="flex items-center justify-between gap-1 mt-auto pt-0.5 border-t border-emerald-200/60 dark:border-emerald-800/50">
                                    {isDutyAssigned ? (
                                      <span className="text-[10px] text-emerald-800/90 dark:text-emerald-300 font-medium truncate">
                                        Trực ca
                                      </span>
                                    ) : (
                                      <span />
                                    )}
                                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                                      Chờ lưu
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        }

                        return (
                          <div
                            key={`${interval.start}-${interval.end}-${interval.status}`}
                            style={{
                              top: `${topPercent}%`,
                              height: `${heightPercent}%`,
                              minHeight: '28px',
                            }}
                            className="absolute inset-x-1 z-2 p-0.5"
                          >
                            <div
                              className={cn(
                                'h-full w-full rounded-md border p-1.5 text-xs shadow-2xs font-semibold transition-all overflow-hidden flex',
                                isTaller ? 'flex-col justify-between' : 'items-center justify-between gap-1 py-0.5',
                                sec.id === 'morning'
                                  ? 'border-amber-300/80 bg-amber-500/10 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100 dark:border-amber-700/60 hover:bg-amber-500/15'
                                  : sec.id === 'afternoon'
                                  ? 'border-sky-300/80 bg-sky-500/10 text-sky-950 dark:bg-sky-950/40 dark:text-sky-100 dark:border-sky-700/60 hover:bg-sky-500/15'
                                  : 'border-purple-300/80 bg-purple-500/10 text-purple-950 dark:bg-purple-950/40 dark:text-purple-100 dark:border-purple-700/60 hover:bg-purple-500/15'
                              )}
                            >
                              <div className="flex items-center justify-between gap-1 w-full">
                                <div className="flex items-center gap-1 min-w-0">
                                  <span className="text-[11px] font-normal truncate">
                                    {isFullShift ? 'Cả buổi' : `${interval.start} - ${interval.end}`}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  {!readonlyWeek && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        onRemoveSlots?.(dateKey, interval.slotIds)
                                      }}
                                      className={cn(
                                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer',
                                        sec.id === 'morning'
                                          ? 'text-amber-700/70 hover:bg-amber-200 hover:text-destructive'
                                          : sec.id === 'afternoon'
                                          ? 'text-sky-700/70 hover:bg-sky-200 hover:text-destructive'
                                          : 'text-purple-700/70 hover:bg-purple-200 hover:text-destructive'
                                      )}
                                      title="Xóa khung giờ đã đăng ký"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {isTaller && isDutyAssigned && (
                                <div className="flex items-center justify-between gap-1 mt-auto pt-0.5 border-t border-border/30">
                                  <span className="text-[10px] text-muted-foreground font-medium truncate">
                                    Trực ca
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}

                      {!hasContent && (
                        <div className="h-full flex items-center justify-center text-xs text-muted-foreground/35 select-none font-medium">
                          —
                        </div>
                      )}
                    </div>
                  )
                }

                // -------------------------------------------------------------
                // TRƯỜNG HỢP 2: XEM TỔNG QUAN TOÀN BỘ CƠ SỞ (AGGREGATE OVERVIEW)
                // -------------------------------------------------------------
                const sectionAllSlots = WORK_TIME_SLOTS.filter((s) => s.section === sec.id)
                const MAX_DISPLAY = 4
                const hasMoreThanMax = registeredEmployees.length > MAX_DISPLAY
                const displayedEmployees = hasMoreThanMax
                  ? registeredEmployees.slice(0, MAX_DISPLAY)
                  : registeredEmployees
                const remainingCount = registeredEmployees.length - MAX_DISPLAY

                return (
                  <div
                    key={dateKey}
                    onClick={() => {
                      if (hasMoreThanMax && onOpenSlotDetail && sectionRecords.length > 0) {
                        onOpenSlotDetail(dateKey, sectionRecords[0].slotId, sec.id)
                      }
                    }}
                    className={cn(
                      'relative flex flex-col justify-start p-1.5 h-full min-h-[92px] overflow-hidden transition-colors',
                      hasMoreThanMax
                        ? 'cursor-pointer hover:bg-muted/15'
                        : sectionRecords.length > 0
                        ? 'bg-transparent'
                        : 'bg-muted/5'
                    )}
                  >
                    <div className="space-y-1 flex-1 min-h-0 flex flex-col">
                      <div className="shrink-0 flex items-center justify-between text-xs">
                        <span
                          className={cn(
                            'text-xs',
                            registeredEmployees.length > 0
                              ? 'text-amber-600 dark:text-amber-500 font-medium'
                              : 'text-muted-foreground/50 font-normal'
                          )}
                        >
                          {registeredEmployees.length > 0
                            ? `${registeredEmployees.length} NV đăng ký`
                            : 'Trống'}
                        </span>
                      </div>

                      {/* Danh sách nhân sự đăng ký trong ca (tối đa 4 + dòng +N) */}
                      <div className="space-y-0.5 pt-0.5 flex-1 min-h-0 overflow-hidden">
                        {displayedEmployees.map((emp) => {
                          const empSectionRecords = sectionRecords.filter((r) => r.employeeId === emp.id)
                          const empSlotIdSet = new Set(empSectionRecords.map((r) => r.slotId))
                          const empSlots = sectionAllSlots.filter((s) => empSlotIdSet.has(s.id))

                          // Full ca → hiển thị "Full", giờ lẻ hiển thị giờ rút gọn (e.g. 8-10h, 8:30-10:30)
                          const isFullSection = empSlots.length > 0 && empSlots.length >= sectionAllSlots.length
                          const timeLabel = isFullSection
                            ? 'Full ca'
                            : empSlots.length > 0
                            ? `${empSlots[0].start} - ${empSlots[empSlots.length - 1].end}`
                            : null
                          const compactTime = formatCompactTimeLabel(timeLabel)

                          return (
                            <div
                              key={emp.id}
                              title={`${emp.name} • ${timeLabel || 'Full ca'}`}
                              className="flex items-center justify-between gap-1 rounded hover:bg-muted/60 px-1 py-0.5 text-xs transition-colors"
                            >
                              <span
                                className="truncate text-[11.5px] font-normal text-foreground flex-1 min-w-0"
                                title={emp.name}
                              >
                                {emp.name}
                              </span>
                              {compactTime && (
                                <span
                                  className={cn(
                                    'shrink-0 tabular-nums leading-tight',
                                    isFullSection
                                      ? 'text-[11px] font-medium text-emerald-600 dark:text-emerald-400'
                                      : 'text-[9.5px] font-normal text-muted-foreground'
                                  )}
                                >
                                  {compactTime}
                                </span>
                              )}
                            </div>
                          )
                        })}

                        {hasMoreThanMax && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              onOpenSlotDetail?.(dateKey, sectionRecords[0]?.slotId, sec.id)
                            }}
                            className="w-full text-left text-[11px] font-semibold text-primary hover:text-primary/80 hover:underline px-1 py-0.5 cursor-pointer flex items-center justify-between transition-colors pt-1 border-t border-border/30 mt-0.5"
                          >
                            <span>+{remainingCount} khác...</span>
                            <span className="text-[10px] font-normal text-muted-foreground">Chi tiết →</span>
                          </button>
                        )}

                        {registeredEmployees.length === 0 && (
                          <div className="h-full flex items-center justify-center text-xs text-muted-foreground/35 select-none font-medium">
                            —
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
        </div>
      </div>
    </div>
  )
}
