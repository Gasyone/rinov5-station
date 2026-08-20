'use client'

import { useMemo } from 'react'
import { BookOpen, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WEEKDAYS, type ShiftSection } from '@/mocks/shiftRoster'
import {
  toWorkDateKey,
  WORK_TIME_SLOTS,
  type WorkPrioritySlotRule,
  type WorkRegistrationEmployee,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import { ClassSessionHoverCard } from '@/components/screens/calendar/ClassSessionHoverCard'
import { checkDateHoliday } from '@/mocks/holidays'
import {
  groupConsecutiveSlots,
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
  onOpenSlotDetail?: (date: string, slotId: string) => void
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

  // Map ngày với index 0..6
  const dayDateKeys = useMemo(
    () => days.map((day) => toWorkDateKey(day)),
    [days]
  )

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-auto bg-card rounded-xl border shadow-2xs">
      <div className="flex flex-col flex-1 h-full min-w-[860px] divide-y">
        {/* HEADER: 7 THỨ TRONG TUẦN */}
        <div className="shrink-0 grid grid-cols-7 divide-x bg-muted/40 text-xs font-semibold text-foreground sticky top-0 z-10 border-b">
          {WEEKDAYS.map((day, idx) => {
            const dateObj = days[idx]
            const dateKey = dateObj ? toWorkDateKey(dateObj) : ''
            const isToday = dateKey === todayKey
            const formattedDate = dateObj
              ? `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`
              : ''

            const holiday = dateKey ? checkDateHoliday(dateKey) : undefined

            return (
              <div
                key={day.index}
                className={cn('px-2 py-2 text-center relative', isToday && 'bg-primary/10', holiday && 'bg-amber-500/5')}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className={cn('font-bold text-xs', isToday ? 'text-primary' : 'text-foreground')}>
                    {day.label}
                  </span>
                </div>
                <span className={cn('block text-[10px] font-medium', isToday ? 'text-primary font-semibold' : 'text-muted-foreground')}>
                  {formattedDate}
                </span>
                {holiday && (
                  <span
                    className="inline-block mt-0.5 max-w-full truncate rounded bg-amber-100 dark:bg-amber-950/80 px-1 py-0.2 text-[9px] font-semibold text-amber-800 dark:text-amber-300 border border-amber-300/50"
                    title={holiday.name}
                  >
                    🎉 {holiday.name}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* 3 HÀNG BUỔI: SÁNG, CHIỀU, TỐI */}
        {WORK_REGISTRATION_GRID_SECTIONS.map((sec) => (
          <div key={sec.id} className="flex-1 min-h-0 flex flex-col">
            {/* TIÊU ĐỀ CA CÓ PHỦ NỀN ĐẸP (RIBBON HEADER) */}
            <div
              className={cn(
                'shrink-0 flex items-center justify-between px-3.5 py-1.5 border-y text-xs font-bold transition-colors',
                sec.id === 'morning'
                  ? 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-500/20 text-amber-900 dark:text-amber-200'
                  : sec.id === 'afternoon'
                  ? 'bg-sky-500/10 dark:bg-sky-950/40 border-sky-500/20 text-sky-900 dark:text-sky-200'
                  : 'bg-purple-500/10 dark:bg-purple-950/40 border-purple-500/20 text-purple-900 dark:text-purple-200'
              )}
            >
              <div className="flex items-center gap-2">
                <span>{sec.icon}</span>
                <span className="uppercase tracking-wider font-bold text-[11px]">
                  {sec.label}
                </span>
                <span
                  className={cn(
                    'text-[11px] font-normal',
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
            </div>

            {/* 7 CỘT THỨ (PHÂN CÁCH BẰNG ĐƯỜNG KẺ DỌC divide-x) */}
            <div className="flex-1 min-h-0 grid grid-cols-7 divide-x divide-border/60">
              {dayDateKeys.map((dateKey) => {
                
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
                  const intervals = groupConsecutiveSlots(records, editableEmployeeId, dateKey, sec.id)
                  const assignedClassRecord = sectionRecords.find(
                    (r) => r.employeeId === editableEmployeeId && r.assignedClass
                  )
                  const hasContent = intervals.length > 0 || Boolean(assignedClassRecord)

                  return (
                    <div
                      key={dateKey}
                      className={cn(
                        'relative flex flex-col justify-start p-2 h-full min-h-[90px] overflow-hidden transition-colors',
                        hasContent ? 'bg-card' : 'bg-muted/5 hover:bg-muted/15'
                      )}
                    >
                      <div className="space-y-1.5 flex-1 min-h-0 overflow-y-auto pr-0.5">
                        {/* Lớp học giảng dạy phân công */}
                        {assignedClassRecord && (
                          <ClassSessionHoverCard
                            session={resolveClassSessionHoverData(
                              assignedClassRecord,
                              employeeById.get(assignedClassRecord.employeeId)?.name || 'Thu Hà',
                              `${sec.start} - ${sec.end}`,
                              assignedClassRecord.branch || 'RinoEdu Linh Đàm'
                            )}
                          >
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex flex-col gap-0.5 rounded-md border border-amber-300/90 bg-amber-50/90 dark:bg-amber-950/50 dark:border-amber-700/60 p-1.5 text-amber-950 dark:text-amber-200 cursor-pointer shadow-2xs hover:bg-amber-100 hover:border-amber-400 dark:hover:bg-amber-900/60 transition-all group/class"
                            >
                              <div className="flex items-center justify-between gap-1 text-[9px] text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider">
                                <span className="flex items-center gap-1">
                                  <BookOpen className="h-2.5 w-2.5" />
                                  Lớp giảng dạy
                                </span>
                                <Info className="h-2.5 w-2.5 opacity-75 group-hover/class:opacity-100 transition-opacity text-amber-700 dark:text-amber-400" />
                              </div>
                              <div className="text-xs font-bold truncate leading-tight text-amber-950 dark:text-amber-100">
                                {assignedClassRecord.assignedClass}
                              </div>
                            </div>
                          </ClassSessionHoverCard>
                        )}

                        {/* Các khung giờ lẻ đã đăng ký */}
                        {intervals.map((interval) => (
                          <div
                            key={`${interval.start}-${interval.end}`}
                            className={cn(
                              'flex items-center justify-between gap-1 rounded-md border px-2 py-1 text-xs shadow-2xs font-semibold transition-colors',
                              sec.id === 'morning'
                                ? 'border-amber-300/80 bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700/60 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                                : sec.id === 'afternoon'
                                ? 'border-sky-300/80 bg-sky-50 text-sky-900 dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-700/60 hover:bg-sky-100 dark:hover:bg-sky-900/60'
                                : 'border-purple-300/80 bg-purple-50 text-purple-900 dark:bg-purple-950/60 dark:text-purple-200 dark:border-purple-700/60 hover:bg-purple-100 dark:hover:bg-purple-900/60'
                            )}
                          >
                            <span className="text-xs font-semibold">{interval.start} - {interval.end}</span>
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
                                title="Xóa khung giờ này"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        ))}

                        {!hasContent && (
                          <div className="h-full flex items-center justify-center text-[11px] text-muted-foreground/35 select-none font-medium">
                            —
                          </div>
                        )}
                      </div>
                    </div>
                  )
                }

                // -------------------------------------------------------------
                // TRƯỜNG HỢP 2: XEM TỔNG QUAN TOÀN BỘ CƠ SỞ (AGGREGATE OVERVIEW)
                // -------------------------------------------------------------
                const sectionAllSlots = WORK_TIME_SLOTS.filter((s) => s.section === sec.id)

                return (
                  <div
                    key={dateKey}
                    onClick={() => {
                      if (onOpenSlotDetail && sectionRecords.length > 0) {
                        onOpenSlotDetail(dateKey, sectionRecords[0].slotId)
                      }
                    }}
                    className={cn(
                      'relative flex flex-col justify-start p-2 h-full min-h-[90px] overflow-hidden transition-colors',
                      sectionRecords.length > 0 ? 'cursor-pointer hover:bg-muted/20' : 'bg-muted/5'
                    )}
                  >
                    <div className="space-y-1 flex-1 min-h-0 flex flex-col">
                      <div className="shrink-0 flex items-center justify-between text-[11px]">
                        <span
                          className={cn(
                            'text-[11px]',
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

                      {/* Danh sách nhân sự đăng ký trong ca */}
                      <div className="space-y-1.5 pt-0.5 flex-1 min-h-0 overflow-y-auto pr-0.5">
                        {registeredEmployees.slice(0, 4).map((emp) => {
                          const empSectionRecords = sectionRecords.filter((r) => r.employeeId === emp.id)
                          const empSlotIdSet = new Set(empSectionRecords.map((r) => r.slotId))
                          const empSlots = sectionAllSlots.filter((s) => empSlotIdSet.has(s.id))

                          // Full ca → hiển thị "Full ca", giờ lẻ hiển thị khoảng thời gian
                          const isFullSection = empSlots.length > 0 && empSlots.length >= sectionAllSlots.length
                          const timeLabel = isFullSection
                            ? 'Full ca'
                            : empSlots.length > 0
                            ? `${empSlots[0].start} - ${empSlots[empSlots.length - 1].end}`
                            : null

                          return (
                            <div
                              key={emp.id}
                              className="flex items-center justify-between gap-1.5 rounded-md bg-muted/40 px-2 py-1 text-xs hover:bg-muted/60 transition-colors"
                            >
                              <span className="truncate text-[11px] font-medium text-foreground">
                                {emp.name}
                              </span>
                              {timeLabel && (
                                <span
                                  className={cn(
                                    'ml-auto shrink-0 text-[9.5px] tabular-nums px-1.5 py-0.2 rounded font-semibold',
                                    isFullSection
                                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold border border-emerald-300/40'
                                      : 'text-muted-foreground bg-muted/70'
                                  )}
                                >
                                  {timeLabel}
                                </span>
                              )}
                            </div>
                          )
                        })}

                        {registeredEmployees.length > 4 && (
                          <div className="text-[9px] text-muted-foreground font-semibold px-1">
                            +{registeredEmployees.length - 4} nhân sự khác
                          </div>
                        )}

                        {registeredEmployees.length === 0 && (
                          <div className="h-full flex items-center justify-center text-[11px] text-muted-foreground/35 select-none font-medium">
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
        ))}
      </div>
    </div>
  )
}
