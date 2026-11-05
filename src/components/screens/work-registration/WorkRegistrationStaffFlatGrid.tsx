'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { WEEKDAYS, type ShiftSection } from '@/mocks/shiftRoster'
import {
  toWorkDateKey,
  type WorkRegistrationEmployee,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import { checkDateHoliday } from '@/mocks/holidays'
import {
  getEmployeeSubjectOrRoleLabel,
  resolveEmployeeDayShift,
} from './workRegistrationShiftHelpers'
import { formatDurationShort } from './workRegistrationHelpers'

interface WorkRegistrationStaffFlatGridProps {
  days: Date[]
  records: WorkRegistrationRecord[]
  employees: WorkRegistrationEmployee[]
  todayKey: string
  activeBranch?: string
  selectedShifts: ShiftSection[]
  subjectFilter?: string
  searchQuery?: string
  onSelectEmployee?: (employeeId: string) => void
  onOpenSlotDetail?: (date: string, slotId?: string, section?: string) => void
}

export function WorkRegistrationStaffFlatGrid({
  days,
  records,
  employees,
  todayKey,
  activeBranch,
  selectedShifts,
  subjectFilter = 'all',
  searchQuery = '',
  onSelectEmployee,
}: WorkRegistrationStaffFlatGridProps) {
  // Map ngày với index 0..6
  const dayDateKeys = useMemo(() => days.map((day) => toWorkDateKey(day)), [days])

  // Lọc danh sách nhân sự thỏa mãn điều kiện môn học và tìm kiếm chung
  const eligibleEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (subjectFilter !== 'all') {
        const hasSubj = emp.subjects?.includes(subjectFilter)
        if (!hasSubj) return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const match =
          emp.name.toLowerCase().includes(q) ||
          emp.code.toLowerCase().includes(q) ||
          emp.position.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [employees, subjectFilter, searchQuery])

  // Phân tích dữ liệu theo 7 ngày (mỗi ngày là 1 danh sách nhân sự duy nhất không trùng lặp)
  const dayStaffSummaries = useMemo(() => {
    return dayDateKeys.map((dateKey) => {
      const list = eligibleEmployees
        .map((emp) => resolveEmployeeDayShift(records, emp, dateKey))
        .filter(Boolean)
        .filter((summary) => {
          // Lọc theo bộ lọc ca được chọn (Sáng, Chiều, Tối)
          if (selectedShifts.length === 0) return true
          return summary!.shifts.some((s) => selectedShifts.includes(s))
        })

      return {
        dateKey,
        summaries: list as NonNullable<ReturnType<typeof resolveEmployeeDayShift>>[],
      }
    })
  }, [dayDateKeys, eligibleEmployees, records, selectedShifts])

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-card rounded-xl border border-border/80 shadow-2xs overflow-hidden">
      {/* VÙNG CUỘN NỘI DUNG MA TRẬN 7 CỘT PHẲNG */}
      <div className="flex-1 min-h-0 overflow-auto flex flex-col">
        <div className="flex flex-col flex-1 min-h-full min-w-[920px]">
          {/* HEADER: 7 THỨ TRONG TUẦN KÈM SỐ LƯỢNG NHÂN SỰ TỔNG HỢP */}
          <div className="shrink-0 grid grid-cols-7 divide-x bg-card text-xs font-semibold text-foreground sticky top-0 z-20 border-b">
            {WEEKDAYS.map((day, idx) => {
              const dateObj = days[idx]
              const dateKey = dateObj ? toWorkDateKey(dateObj) : ''
              const isToday = dateKey === todayKey
              const dayData = dayStaffSummaries[idx]
              const count = dayData?.summaries.length || 0
              const holiday = dateKey && activeBranch ? checkDateHoliday(dateKey, activeBranch) : undefined

              return (
                <div
                  key={day.index}
                  className={cn(
                    'px-2 py-2 flex items-center justify-center gap-1.5 text-center relative bg-card transition-colors',
                    isToday && 'bg-primary/5',
                    holiday && 'bg-amber-500/5'
                  )}
                >
                  <span className={cn('font-bold text-xs', isToday ? 'text-primary' : 'text-foreground')}>
                    {day.label}
                  </span>
                  <span
                    className={cn(
                      'text-xs font-semibold tabular-nums',
                      count > 0 ? 'text-primary' : 'text-muted-foreground/40 font-normal'
                    )}
                  >
                    ({count} NS)
                  </span>

                  {holiday && (
                    <span
                      className="ml-1 max-w-[70px] truncate rounded bg-amber-100 dark:bg-amber-950/80 px-1 py-0.2 text-[10px] font-semibold text-amber-800 dark:text-amber-300 border border-amber-300/50"
                      title={holiday.name}
                    >
                      🎉 {holiday.name}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* THÂN BẢNG: 7 CỘT PHẲNG CHẠY SUỐT CHIỀU CAO (ZERO DUPLICATION) */}
          <div className="flex-1 grid grid-cols-7 divide-x divide-border/60 bg-muted/5 min-h-[350px]">
            {dayDateKeys.map((dateKey, dayIdx) => {
              const dayData = dayStaffSummaries[dayIdx]
              const list = dayData?.summaries || []

              return (
                <div
                  key={dateKey}
                  className="flex flex-col p-1.5 gap-1.5 h-full overflow-y-auto"
                >
                  {list.length > 0 ? (
                    list.map((item) => {
                      const emp = item.employee
                      const subjectLabel = getEmployeeSubjectOrRoleLabel(emp)

                      return (
                        <div
                          key={emp.id}
                          onClick={() => onSelectEmployee?.(emp.id)}
                          title={`${emp.name} (${emp.code})\nMôn: ${subjectLabel}\nCa: ${item.badgeLabel} • Khung giờ: ${item.timeRangeLabel} (Tổng: ${formatDurationShort(item.totalMinutes)})\n(Bấm để xem/đăng ký thay)`}
                          className="group relative flex flex-col justify-between gap-1 p-2 rounded-lg border border-border/70 bg-card hover:bg-accent/40 hover:border-primary/50 transition-all cursor-pointer shadow-2xs"
                        >
                          {/* DÒNG 1: TÊN & CA LÀM VIỆC (KHÔNG VIỀN, KHÔNG NỀN) */}
                          <div className="flex items-center justify-between gap-1 min-w-0">
                            <span
                              className="font-semibold text-xs text-foreground truncate group-hover:text-primary transition-colors"
                              title={emp.name}
                            >
                              {emp.name}
                            </span>
                            <span
                              className={cn(
                                'shrink-0 text-xs tabular-nums leading-tight',
                                item.badgeClass
                              )}
                            >
                              {item.badgeLabel}
                            </span>
                          </div>

                          {/* DÒNG 2: MÔN HỌC & KHUNG GIỜ CHI TIẾT */}
                          <div className="flex items-center justify-between gap-1 text-[11px] text-muted-foreground mt-0.5">
                            <span className="truncate min-w-0 font-normal text-muted-foreground" title={subjectLabel}>
                              {subjectLabel}
                            </span>

                            <span
                              className="text-[11px] tabular-nums font-normal text-muted-foreground shrink-0 text-right"
                              title={`Khung giờ làm việc: ${item.timeRangeLabel} (Tổng: ${formatDurationShort(item.totalMinutes)})`}
                            >
                              {item.timeRangeLabel}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="h-32 flex items-center justify-center text-xs text-muted-foreground/35 select-none font-medium">
                      —
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
