'use client'

import { useMemo } from 'react'
import { Check, Plus, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { DUTY_SECTIONS, WEEKDAYS, type ShiftSection } from '@/mocks/shiftRoster'
import {
  isPriorityWorkSlot,
  toWorkDateKey,
  type WorkPrioritySlotRule,
  type WorkRegistrationEmployee,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import { getInitials } from './workRegistrationHelpers'

interface WorkRegistrationStaffSectionGridProps {
  days: Date[]
  records: WorkRegistrationRecord[]
  employees: WorkRegistrationEmployee[]
  todayKey: string
  editableEmployeeId?: string
  readonlyWeek?: boolean
  priorityRules: WorkPrioritySlotRule[]
  onToggleSection?: (date: string, section: ShiftSection) => void
  onOpenSlotDetail?: (date: string, slotId: string) => void
}

export function WorkRegistrationStaffSectionGrid({
  days,
  records,
  employees,
  todayKey,
  editableEmployeeId,
  readonlyWeek,
  priorityRules,
  onToggleSection,
  onOpenSlotDetail,
}: WorkRegistrationStaffSectionGridProps) {
  const employeeById = useMemo(
    () => new Map(employees.map((emp) => [emp.id, emp])),
    [employees]
  )

  // Map ngày với index 0..6
  const dayDateKeys = useMemo(
    () => days.map((day) => ({ dateKey: toWorkDateKey(day), day })),
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

            return (
              <div
                key={day.index}
                className={cn('px-2.5 py-2 text-center', isToday && 'bg-primary/10')}
              >
                <span className={cn('font-bold text-xs', isToday ? 'text-primary' : 'text-foreground')}>
                  {day.label}
                </span>
                <span className={cn('block text-[10px] font-medium', isToday ? 'text-primary font-semibold' : 'text-muted-foreground')}>
                  {formattedDate}
                </span>
              </div>
            )
          })}
        </div>

        {/* 3 HÀNG BUỔI: SÁNG, CHIỀU, TỐI */}
        {DUTY_SECTIONS.map((sec) => (
          <div key={sec.id} className="flex-1 min-h-0 flex flex-col p-2 space-y-1">
            {/* TIÊU ĐỀ CA */}
            <div className="shrink-0 flex items-center gap-1.5 px-2 py-0.5 text-xs font-bold text-foreground">
              <span>{sec.icon}</span>
              <span>{sec.label}</span>
              <span className="text-[10px] font-normal text-muted-foreground">
                ({sec.slots[0]} - {sec.slots[sec.slots.length - 1]})
              </span>
            </div>

            {/* 7 Ô CHO 7 NGÀY */}
            <div className="flex-1 min-h-0 grid grid-cols-7 gap-2">
              {dayDateKeys.map(({ dateKey, day }, dayIdx) => {
                const dayConfig = WEEKDAYS[dayIdx] || { index: dayIdx, short: `T${dayIdx + 2}` }
                
                // Lấy tất cả các records thuộc ngày và ca này
                const sectionRecords = records.filter(
                  (r) => r.date === dateKey && r.slotId.startsWith(sec.id)
                )

                // Danh sách nhân sự đăng ký trong ca này
                const registeredEmpIds = Array.from(new Set(sectionRecords.map((r) => r.employeeId)))
                const registeredEmployees = registeredEmpIds
                  .map((id) => employeeById.get(id))
                  .filter(Boolean) as WorkRegistrationEmployee[]

                // Kiểm tra xem có phải giờ vàng không
                const isPriority = isPriorityWorkSlot(dateKey, `${sec.id}-0800`, priorityRules) ||
                  isPriorityWorkSlot(dateKey, `${sec.id}-1800`, priorityRules)

                // -------------------------------------------------------------
                // TRƯỜNG HỢP 1: ĐANG ĐĂNG KÝ THAY CHO 1 NHÂN VIÊN
                // -------------------------------------------------------------
                if (editableEmployeeId) {
                  const employeeRecord = sectionRecords.find((r) => r.employeeId === editableEmployeeId)
                  const isRegistered = Boolean(employeeRecord)
                  const isLocked = employeeRecord?.status === 'locked'
                  const hasAssignedClass = Boolean(employeeRecord?.assignedClass)
                  const disabled = Boolean(readonlyWeek) || isLocked || hasAssignedClass

                  return (
                    <div
                      key={dateKey}
                      onClick={() => {
                        if (!disabled) {
                          onToggleSection?.(dateKey, sec.id)
                        }
                      }}
                      className={cn(
                        'flex flex-col justify-between rounded-lg border p-2.5 h-full min-h-[96px] overflow-hidden transition-all group',
                        disabled ? 'opacity-60 cursor-not-allowed bg-muted/30' : 'cursor-pointer',
                        isRegistered
                          ? 'border-primary bg-primary/10 ring-1 ring-primary/25'
                          : 'border-dashed border-border bg-card hover:border-primary/50 hover:bg-muted/30'
                      )}
                    >
                      <div className="space-y-1.5 flex-1 min-h-0 flex flex-col">
                        <div className="shrink-0 flex items-center justify-between">
                          <span
                            className={cn(
                              'text-[10px] font-bold px-1.5 py-0.2 rounded',
                              isRegistered
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            )}
                          >
                            {isRegistered ? '✓ Đã chọn ca' : '+ Chưa chọn'}
                          </span>
                          {isPriority && <Star className="h-3 w-3 text-amber-500 fill-amber-500" />}
                        </div>

                        {hasAssignedClass && (
                          <div className="shrink-0 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 text-[9px] font-semibold">
                            Lớp: {employeeRecord?.assignedClass}
                          </div>
                        )}

                        <div className="text-[11px] font-medium text-foreground">
                          {sec.label}
                        </div>
                      </div>

                      <div className="shrink-0 text-[9px] text-muted-foreground flex items-center justify-between pt-1 border-t border-border/30 mt-1">
                        <span>{dayConfig.short}</span>
                        {!disabled && (
                          <span className="text-[9px] group-hover:text-primary font-medium">
                            {isRegistered ? 'Click để hủy' : 'Click để nhận'}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                }

                // -------------------------------------------------------------
                // TRƯỜNG HỢP 2: XEM TỔNG QUAN TOÀN BỘ CƠ SỞ (AGGREGATE OVERVIEW)
                // -------------------------------------------------------------
                const isEnough = registeredEmployees.length >= 2

                return (
                  <div
                    key={dateKey}
                    onClick={() => {
                      if (onOpenSlotDetail && sectionRecords.length > 0) {
                        onOpenSlotDetail(dateKey, sectionRecords[0].slotId)
                      }
                    }}
                    className={cn(
                      'flex flex-col justify-between rounded-lg border p-2.5 h-full min-h-[96px] overflow-hidden transition-all group',
                      sectionRecords.length > 0 ? 'cursor-pointer hover:shadow-2xs hover:border-primary/40' : '',
                      registeredEmployees.length > 0
                        ? 'bg-card border-border/80'
                        : 'bg-muted/10 border-border/50'
                    )}
                  >
                    <div className="space-y-1 flex-1 min-h-0 flex flex-col">
                      <div className="shrink-0 flex items-center justify-between text-[11px]">
                        <span
                          className={cn(
                            'text-[11px]',
                            registeredEmployees.length > 0
                              ? 'text-amber-600 dark:text-amber-500 font-medium'
                              : 'text-muted-foreground/70 font-normal'
                          )}
                        >
                          {registeredEmployees.length > 0
                            ? `${registeredEmployees.length} NV đăng ký`
                            : 'Trống'}
                        </span>
                        {isPriority && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                      </div>

                      {/* Danh sách nhân sự đăng ký trong ca */}
                      <div className="space-y-1 pt-0.5 flex-1 min-h-0 overflow-y-auto pr-0.5">
                        {registeredEmployees.slice(0, 4).map((emp) => (
                          <div
                            key={emp.id}
                            className="flex items-center gap-1.5 rounded bg-muted/40 px-1.5 py-0.5 text-xs"
                          >
                            <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-primary/80 text-[7px] font-bold text-white">
                              {getInitials(emp.name)}
                            </div>
                            <span className="truncate text-[10px] font-medium text-foreground">
                              {emp.name}
                            </span>
                          </div>
                        ))}

                        {registeredEmployees.length > 4 && (
                          <div className="text-[9px] text-muted-foreground font-semibold px-1">
                            +{registeredEmployees.length - 4} nhân sự khác
                          </div>
                        )}

                        {registeredEmployees.length === 0 && (
                          <div className="py-3 text-center text-[9px] text-muted-foreground italic">
                            Chưa có đăng ký
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
