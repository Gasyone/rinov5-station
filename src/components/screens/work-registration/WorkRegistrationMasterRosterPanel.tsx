'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getStatusColors } from '@/lib/statusColors'
import { WorkRegistrationAssignStaffDialog } from './WorkRegistrationAssignStaffDialog'
import {
  DUTY_SECTIONS,
  WEEKDAYS,
  findDutyEmployeeById,
  getDutyEmployeesByBranch,
  getMasterShiftRoster,
  updateMasterShiftRosterSlot,
  type DutyEmployee,
  type ShiftSection,
} from '@/mocks/shiftRoster'
import {
  WORK_TIME_SLOTS,
  toWorkDateKey,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import { checkDateHoliday } from '@/mocks/holidays'

interface WorkRegistrationMasterRosterPanelProps {
  activeBranch: string
  searchQuery?: string
  weekDays?: Date[]
  records?: WorkRegistrationRecord[]
  onRosterUpdated?: () => void
}

export function WorkRegistrationMasterRosterPanel({
  activeBranch,
  searchQuery = '',
  weekDays = [],
  records = [],
  onRosterUpdated,
}: WorkRegistrationMasterRosterPanelProps) {
  // Lấy danh sách phân bổ hiện tại cho chi nhánh
  const [refreshKey, setRefreshKey] = useState(0)

  // Dialog chọn nhân viên cho 1 ca cụ thể
  const [editingSlot, setEditingSlot] = useState<{
    dayIndex: number
    dayLabel: string
    section: ShiftSection
    sectionLabel: string
  } | null>(null)

  const branchEmployees = getDutyEmployeesByBranch(activeBranch)
  const masterRoster = getMasterShiftRoster(activeBranch)

  const getSlotAssignedStaff = (dayIndex: number, section: ShiftSection): DutyEmployee[] => {
    const found = masterRoster.find(
      (item) => item.branch === activeBranch && item.dayIndex === dayIndex && item.section === section
    )
    if (!found) return []
    return found.assignedEmployeeIds.map(findDutyEmployeeById).filter(Boolean) as DutyEmployee[]
  }

  // Tạo map dateKey cho từng dayIndex
  const dayDateKeys = useMemo(() => {
    const map: Record<number, string> = {}
    weekDays.forEach((day, idx) => {
      map[idx] = toWorkDateKey(day)
    })
    return map
  }, [weekDays])

  // Lấy thông tin đăng ký của nhân viên cho ngày + buổi (trả về "Cả ca" nếu full hoặc mặc định, hoặc giờ lẻ e.g. "13:30 - 17:00")
  const getStaffRegisteredTime = (employeeId: string, dayIndex: number, section: ShiftSection): string => {
    const dateKey = dayDateKeys[dayIndex]
    const dutySec = DUTY_SECTIONS.find((s) => s.id === section)
    const prefix = section === 'evening_digi' ? 'evening' : section
    const sectionSlotIds = dutySec?.slots.map((t) => `${prefix}-${t.replace(':', '')}`) || []

    if (dateKey && sectionSlotIds.length > 0 && records && records.length > 0) {
      const empSlots = records
        .filter((r) => r.employeeId === employeeId && r.date === dateKey && sectionSlotIds.includes(r.slotId))
        .map((r) => WORK_TIME_SLOTS.find((s) => s.id === r.slotId)!)
        .filter(Boolean)
        .sort((a, b) => a.start.localeCompare(b.start))

      if (empSlots.length > 0) {
        if (empSlots.length >= sectionSlotIds.length) return 'Cả ca'
        return `${empSlots[0].start} - ${empSlots[empSlots.length - 1].end}`
      }
    }

    return 'Cả ca'
  }

  const isStaffMatch = (staff: DutyEmployee) => {
    if (!searchQuery.trim()) return false
    const q = searchQuery.toLowerCase().trim()
    return (
      staff.name.toLowerCase().includes(q) ||
      staff.role.toLowerCase().includes(q) ||
      staff.shortName.toLowerCase().includes(q)
    )
  }

  const handleSaveSlotStaff = (selectedIds: string[]) => {
    if (!editingSlot) return
    updateMasterShiftRosterSlot(activeBranch, editingSlot.dayIndex, editingSlot.section, selectedIds)
    setRefreshKey((k) => k + 1)
    onRosterUpdated?.()
    setEditingSlot(null)
    toast.success(`Đã cập nhật ca ${editingSlot.sectionLabel} (${editingSlot.dayLabel})`)
  }

  const hasSearch = Boolean(searchQuery.trim())

  return (
    <div key={refreshKey} className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      {/* MA TRẬN PHÂN BỔ CA TRỰC 7 NGÀY */}
      <div className="flex-1 min-h-0 overflow-auto rounded-xl border bg-card shadow-2xs flex flex-col">
        <div className="flex flex-col flex-1 h-full min-w-[900px] divide-y">
          {/* HEADER: 7 THỨ TRONG TUẦN */}
          <div className="shrink-0 grid grid-cols-7 divide-x bg-muted/40 text-xs font-semibold text-foreground sticky top-0 z-10 border-b">
            {WEEKDAYS.map((day, idx) => {
              const dateObj = weekDays[idx]
              const dateKey = dateObj ? toWorkDateKey(dateObj) : ''
              const holiday = dateKey ? checkDateHoliday(dateKey, activeBranch) : undefined

              return (
                <div key={day.index} className={cn('px-2 py-2 text-center', holiday && 'bg-amber-500/5')}>
                  <span className="font-bold">{day.label}</span>
                  {holiday && (
                    <span
                      className="block mt-0.5 max-w-full truncate rounded bg-amber-100 dark:bg-amber-950/80 px-1 py-0.2 text-[9px] font-semibold text-amber-800 dark:text-amber-300 border border-amber-300/50"
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
          {DUTY_SECTIONS.filter((sec) => sec.id !== 'evening_digi').map((sec) => {
            const isDigi = sec.id === 'evening_digi'

            return (
              <div key={sec.id} className="flex-1 min-h-0 flex flex-col">
                {/* TIÊU ĐỀ CA CÓ PHỦ NỀN ĐẸP (RIBBON HEADER) */}
                <div
                  className={cn(
                    'shrink-0 flex items-center justify-between px-3.5 py-1.5 border-y text-xs font-bold transition-colors',
                    isDigi
                      ? 'bg-purple-500/10 dark:bg-purple-950/40 border-purple-500/20 text-purple-900 dark:text-purple-200'
                      : 'bg-muted/60 dark:bg-muted/30 border-border/70 text-foreground'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span>{sec.icon}</span>
                    <span className="uppercase tracking-wider font-bold text-[11px]">
                      {sec.label}
                    </span>
                    <span className="text-[11px] font-normal text-muted-foreground">
                      ({sec.slots[0]} - {sec.slots[sec.slots.length - 1]})
                    </span>
                    {isDigi && (
                      <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 px-2 py-0.2 text-[9.5px] font-bold border border-purple-300 dark:border-purple-700">
                        Phòng Tự Học Digital
                      </span>
                    )}
                  </div>
                  {isDigi && (
                    <span className="hidden md:inline-block text-[10px] font-normal text-purple-700 dark:text-purple-300/80">
                      Gán giáo viên / Trợ giảng phụ trách
                    </span>
                  )}
                </div>

                {/* 7 CỘT THỨ (PHÂN CÁCH BẰNG ĐƯỜNG KẺ DỌC divide-x) */}
                <div className="flex-1 min-h-0 grid grid-cols-7 divide-x divide-border/60">
                  {WEEKDAYS.map((day) => {
                    const assignedStaff = getSlotAssignedStaff(day.index, sec.id)
                    const hasMatchingStaff = hasSearch && assignedStaff.some(isStaffMatch)

                    return (
                      <div
                        key={day.index}
                        onClick={() =>
                          setEditingSlot({
                            dayIndex: day.index,
                            dayLabel: day.label,
                            section: sec.id,
                            sectionLabel: sec.label,
                          })
                        }
                        className={cn(
                          'flex flex-col justify-between p-2.5 h-full min-h-[105px] overflow-hidden cursor-pointer transition-all hover:bg-muted/20 group relative',
                          isDigi && 'bg-purple-500/[0.02]',
                          hasSearch && hasMatchingStaff
                            ? 'bg-primary/5 ring-1 ring-primary/40'
                            : hasSearch && !hasMatchingStaff
                            ? 'opacity-35 hover:opacity-100'
                            : assignedStaff.length > 0
                            ? isDigi ? 'bg-purple-50/20 dark:bg-purple-950/10' : 'bg-card'
                            : 'bg-muted/5'
                        )}
                      >
                        <div className="space-y-1.5 flex-1 min-h-0 flex flex-col">
                          <div className="shrink-0 flex items-center justify-between text-[11px]">
                            <span
                              className={cn(
                                'text-[11px]',
                                hasMatchingStaff
                                  ? 'text-primary font-bold'
                                  : assignedStaff.length > 0
                                  ? isDigi
                                    ? 'text-purple-700 dark:text-purple-400 font-semibold'
                                    : 'text-amber-600 dark:text-amber-500 font-medium'
                                  : 'text-muted-foreground/60 font-normal'
                              )}
                            >
                              {hasMatchingStaff
                                ? `Khớp tìm kiếm`
                                : assignedStaff.length > 0
                                ? `${assignedStaff.length} người trực`
                                : 'Trống'}
                            </span>
                            <span
                              className={cn(
                                'transition-colors text-[11px] font-semibold',
                                isDigi
                                  ? 'text-purple-600 dark:text-purple-400 group-hover:underline'
                                  : 'text-muted-foreground group-hover:text-primary'
                              )}
                            >
                              + Sửa
                            </span>
                          </div>

                          {/* Danh sách nhân sự trong ca */}
                          <div className="space-y-1 pt-0.5 flex-1 min-h-0 overflow-y-auto pr-0.5">
                            {assignedStaff.map((staff) => {
                              const isMatched = isStaffMatch(staff)

                              return (
                                <div
                                  key={staff.id}
                                  className={cn(
                                    'flex items-center gap-1.5 rounded px-1.5 py-1 text-xs transition-colors',
                                    isMatched
                                      ? 'bg-primary text-primary-foreground font-semibold shadow-2xs ring-1 ring-primary-foreground/20'
                                      : isDigi
                                      ? 'bg-purple-100/50 dark:bg-purple-950/40 text-foreground border border-purple-200/40 dark:border-purple-800/40'
                                      : 'bg-muted/40 text-foreground'
                                  )}
                                >
                                  <div
                                    className={cn(
                                      'flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white',
                                      isMatched ? 'bg-white text-primary' : (staff.colorClass || 'bg-primary')
                                    )}
                                  >
                                    {staff.shortName}
                                  </div>
                                  <span
                                    className={cn(
                                      'truncate text-[11px] font-medium',
                                      isMatched ? 'text-primary-foreground font-bold' : 'text-foreground'
                                    )}
                                  >
                                    {staff.name}
                                  </span>
                                  {(() => {
                                    const regTime = getStaffRegisteredTime(staff.id, day.index, sec.id)
                                    return regTime ? (
                                      <span
                                        className={cn(
                                          'ml-auto shrink-0 text-[9px] font-semibold',
                                          isMatched
                                            ? 'text-primary-foreground/90'
                                            : regTime === 'Cả ca'
                                            ? getStatusColors('success').text
                                            : 'text-muted-foreground'
                                        )}
                                      >
                                        {regTime}
                                      </span>
                                    ) : null
                                  })()}
                                </div>
                              )
                            })}
                            {assignedStaff.length === 0 && (
                              <div className="py-3 text-center text-[10px] text-muted-foreground italic">
                                {isDigi ? 'Chưa gán trợ giảng / GV' : 'Chưa có người trực'}
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

      {/* DIALOG CHỈNH SỬA PHÂN BỔ NHÂN SỰ CHO 1 CA (2 PANELS: DANH SÁCH + LỊCH CHI TIẾT) */}
      {editingSlot && (
        <WorkRegistrationAssignStaffDialog
          open={Boolean(editingSlot)}
          branchName={activeBranch}
          dayIndex={editingSlot.dayIndex}
          dayLabel={editingSlot.dayLabel}
          section={editingSlot.section}
          sectionLabel={editingSlot.sectionLabel}
          allStaff={branchEmployees}
          masterRoster={masterRoster}
          records={records}
          weekDays={weekDays}
          currentAssignedIds={
            masterRoster.find(
              (item) =>
                item.branch === activeBranch &&
                item.dayIndex === editingSlot.dayIndex &&
                item.section === editingSlot.section
            )?.assignedEmployeeIds || []
          }
          onClose={() => setEditingSlot(null)}
          onSave={handleSaveSlotStaff}
        />
      )}
    </div>
  )
}
