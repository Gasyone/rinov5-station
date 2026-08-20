'use client'

import React, { useState, useMemo } from 'react'
import {
  Check,
  Calendar,
  User,
  ChevronRight,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ExpandableSearch } from '@/components/controls'
import { cn } from '@/lib/utils'
import { getStatusBadgeClass, getStatusColors } from '@/lib/statusColors'
import {
  DUTY_SECTIONS,
  WEEKDAYS,
  type DutyEmployee,
  type MasterShiftAssignment,
  type ShiftSection,
} from '@/mocks/shiftRoster'
import {
  WORK_TIME_SLOTS,
  toWorkDateKey,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'

interface WorkRegistrationAssignStaffDialogProps {
  open: boolean
  branchName: string
  dayIndex: number
  dayLabel: string
  section: ShiftSection
  sectionLabel: string
  allStaff: DutyEmployee[]
  masterRoster: MasterShiftAssignment[]
  currentAssignedIds: string[]
  records?: WorkRegistrationRecord[]
  weekDays?: Date[]
  onClose: () => void
  onSave: (ids: string[]) => void
}

export function WorkRegistrationAssignStaffDialog({
  open,
  branchName,
  dayIndex,
  dayLabel,
  section,
  sectionLabel,
  allStaff,
  masterRoster,
  currentAssignedIds,
  records = [],
  weekDays = [],
  onClose,
  onSave,
}: WorkRegistrationAssignStaffDialogProps) {
  const isDigi = section === 'evening_digi'
  const [selectedIds, setSelectedIds] = useState<string[]>(currentAssignedIds)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'Trợ giảng' | 'Giáo viên' | 'CS' | 'Khác'>('all')

  // Nhân sự đang được chọn xem lịch ở Panel phải
  const [focusedStaffId, setFocusedStaffId] = useState<string>(() => {
    return currentAssignedIds[0] || allStaff[0]?.id || ''
  })

  const toggleStaff = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
    setFocusedStaffId(id)
  }

  const filteredStaff = useMemo(() => {
    let list = allStaff
    if (roleFilter !== 'all') {
      list = list.filter((staff) => staff.role === roleFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (staff) =>
          staff.name.toLowerCase().includes(q) ||
          staff.role.toLowerCase().includes(q) ||
          staff.shortName.toLowerCase().includes(q)
      )
    }
    return list
  }, [allStaff, searchQuery, roleFilter])

  // Nhân sự đang được focus xem lịch
  const focusedStaff = useMemo(() => {
    return allStaff.find((s) => s.id === focusedStaffId) || filteredStaff[0] || allStaff[0]
  }, [allStaff, filteredStaff, focusedStaffId])

  // Lấy danh sách các ca trong tuần của nhân sự được focus (chỉ lấy các ca Sáng, Chiều, Tối)
  const getStaffWeeklyShifts = (employeeId: string) => {
    return masterRoster
      .filter((item) => item.branch === branchName && item.section !== 'evening_digi' && item.assignedEmployeeIds.includes(employeeId))
      .map((item) => {
        const day = WEEKDAYS.find((w) => w.index === item.dayIndex)
        const sec = DUTY_SECTIONS.find((s) => s.id === item.section)
        return {
          dayIndex: item.dayIndex,
          dayShort: day?.short || `T${item.dayIndex + 2}`,
          dayFull: day?.label || `Thứ ${item.dayIndex + 2}`,
          sectionId: item.section,
          sectionLabel: sec?.label || item.section,
          sectionIcon: sec?.icon || '⏱',
        }
      })
      .sort((a, b) => a.dayIndex - b.dayIndex)
  }

  const focusedWeeklyShifts = focusedStaff ? getStaffWeeklyShifts(focusedStaff.id) : []
  const isFocusedAssignedCurrent = focusedStaff ? selectedIds.includes(focusedStaff.id) : false

  // Helper lấy thông tin đăng ký ca trực của 1 nhân viên trong ca đang chọn
  const getStaffRegistrationForCurrentShift = (staffId: string) => {
    const targetDateObj = weekDays[dayIndex]
    const targetDateKey = targetDateObj ? toWorkDateKey(targetDateObj) : ''

    // Lấy danh sách slots thuộc ca trực hiện tại
    const dutySec = DUTY_SECTIONS.find((s) => s.id === section)
    const prefix = section === 'evening_digi' ? 'evening' : section
    const expectedSlotIds = dutySec?.slots.map((t) => `${prefix}-${t.replace(':', '')}`) || []

    if (!targetDateKey || expectedSlotIds.length === 0) {
      return { isFull: false, isPartial: false, timeRange: null }
    }

    const empSlots = records
      .filter((r) => r.employeeId === staffId && r.date === targetDateKey && expectedSlotIds.includes(r.slotId))
      .map((r) => WORK_TIME_SLOTS.find((s) => s.id === r.slotId)!)
      .filter(Boolean)
      .sort((a, b) => a.start.localeCompare(b.start))

    if (empSlots.length === 0) {
      return { isFull: true, isPartial: false, timeRange: 'Cả ca' }
    }

    const isFull = empSlots.length >= expectedSlotIds.length
    const timeRange = isFull ? 'Cả ca' : `${empSlots[0].start} - ${empSlots[empSlots.length - 1].end}`

    return { isFull, isPartial: !isFull, timeRange }
  }

  // Helper lấy thông tin đăng ký ca trực của 1 nhân viên trong bất kỳ ngày + ca nào
  const getStaffRegisteredTimeForDaySection = (staffId: string, targetDayIndex: number, targetSection: ShiftSection): string => {
    const targetDateObj = weekDays[targetDayIndex]
    const targetDateKey = targetDateObj ? toWorkDateKey(targetDateObj) : ''

    const dutySec = DUTY_SECTIONS.find((s) => s.id === targetSection)
    const prefix = targetSection === 'evening_digi' ? 'evening' : targetSection
    const expectedSlotIds = dutySec?.slots.map((t) => `${prefix}-${t.replace(':', '')}`) || []

    if (targetDateKey && expectedSlotIds.length > 0 && records && records.length > 0) {
      const empSlots = records
        .filter((r) => r.employeeId === staffId && r.date === targetDateKey && expectedSlotIds.includes(r.slotId))
        .map((r) => WORK_TIME_SLOTS.find((s) => s.id === r.slotId)!)
        .filter(Boolean)
        .sort((a, b) => a.start.localeCompare(b.start))

      if (empSlots.length > 0) {
        if (empSlots.length >= expectedSlotIds.length) return 'Cả ca'
        return `${empSlots[0].start} - ${empSlots[empSlots.length - 1].end}`
      }
    }

    return 'Cả ca'
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-3xl lg:max-w-4xl max-h-[88vh] flex flex-col gap-0 p-0 overflow-hidden">
        {/* HEADER: TIÊU ĐỀ + TABS LỌC VAI TRÒ & SEARCH TRÊN CÙNG HEADER */}
        <DialogHeader className="p-3 pb-2 border-b shrink-0 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <DialogTitle className="text-sm font-bold text-foreground">
                Phân bổ người trực: {dayLabel} - {sectionLabel}
              </DialogTitle>
              {isDigi && (
                <span className="rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.2 text-[9px] font-bold uppercase border border-purple-200 dark:border-purple-800">
                  Phòng Digi
                </span>
              )}
            </div>
          </div>

          {/* HÀNG BỘ LỌC VAI TRÒ (TRÁI) & SEARCH DẠNG ICON + ĐẾM CHỌN (PHẢI) */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            {/* TABS LỌC VAI TRÒ */}
            <div className="flex items-center gap-1 flex-wrap">
              {(['all', 'Trợ giảng', 'Giáo viên', 'CS', 'Khác'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoleFilter(r)}
                  className={cn(
                    'px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer',
                    roleFilter === r
                      ? 'bg-primary text-primary-foreground shadow-2xs'
                      : 'bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  {r === 'all' ? 'Tất cả' : r}
                </button>
              ))}
            </div>

            {/* SEARCH DẠNG ICON EXPANDABLE & SỐ LƯỢNG ĐÃ CHỌN */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-medium text-muted-foreground hidden sm:inline-block">
                Đã chọn: <strong className="text-primary font-bold">{selectedIds.length}</strong>
              </span>
              <ExpandableSearch
                value={searchQuery}
                onValueChange={setSearchQuery}
                label="Tìm nhân sự"
                placeholder="Tìm theo tên..."
                inputClassName="sm:w-44"
              />
            </div>
          </div>
        </DialogHeader>

        {/* BODY: 2 PANELS (TRÁI: DANH SÁCH NHÂN SỰ, PHẢI: LỊCH TRỰC CHI TIẾT) */}
        <div className="grid grid-cols-2 flex-1 min-h-0 overflow-hidden divide-x divide-border">
          {/* PANEL TRÁI: DANH SÁCH NHÂN SỰ ĐỂ PHÂN BỔ */}
          <div className="p-3 flex flex-col min-h-0 overflow-hidden">
            <div className="space-y-1 flex-1 min-h-0 overflow-y-auto pr-1">
              {filteredStaff.map((staff) => {
                const isSelected = selectedIds.includes(staff.id)
                const isFocused = focusedStaff?.id === staff.id
                const weeklyShifts = getStaffWeeklyShifts(staff.id)
                const regInfo = getStaffRegistrationForCurrentShift(staff.id)

                return (
                  <div
                    key={staff.id}
                    onClick={() => setFocusedStaffId(staff.id)}
                    className={cn(
                      'flex items-center justify-between rounded-lg px-2.5 py-2 cursor-pointer transition-all',
                      isFocused
                        ? 'bg-primary/10 text-foreground font-medium'
                        : isSelected
                        ? 'bg-primary/5 text-foreground hover:bg-primary/10'
                        : 'hover:bg-muted/50 text-foreground'
                    )}
                  >
                    {/* TRÁI: CHECKBOX + AVATAR + TÊN + VAI TRÒ */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleStaff(staff.id)
                        }}
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors cursor-pointer',
                          isSelected
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-input hover:border-primary/60 bg-background'
                        )}
                        title={isSelected ? 'Bỏ chọn phân bổ' : 'Chọn phân bổ ca này'}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </div>

                      <div
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white',
                          staff.colorClass || 'bg-primary'
                        )}
                      >
                        {staff.shortName}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-xs font-bold text-foreground truncate">{staff.name}</p>
                          <span
                            className={cn(
                              'inline-block text-[9px] px-1.5 py-0.2 rounded font-semibold',
                              staff.role === 'Trợ giảng'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300/40'
                                : staff.role === 'CS'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : staff.role === 'Khác'
                                ? 'bg-slate-200 text-slate-700'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            )}
                          >
                            {staff.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* PHẢI: BADGE CẢ CA / GIỜ LẺ + SỐ CA TRONG TUẦN & NÚT CHI TIẾT */}
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {regInfo.isFull ? (
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border',
                            getStatusBadgeClass('ca_ca')
                          )}
                        >
                          Cả ca
                        </span>
                      ) : regInfo.isPartial && regInfo.timeRange ? (
                        <span
                          className="inline-flex items-center rounded px-1.5 py-0.5 text-[9.5px] font-medium bg-muted text-muted-foreground border border-border/50 tabular-nums"
                          title={`Đã đăng ký: ${regInfo.timeRange}`}
                        >
                          {regInfo.timeRange}
                        </span>
                      ) : null}

                      <span
                        className={cn(
                          'inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
                          weeklyShifts.length > 0
                            ? 'bg-muted text-foreground'
                            : 'bg-muted/40 text-muted-foreground/60'
                        )}
                        title={`Đã phân bổ ${weeklyShifts.length} ca trực trong tuần`}
                      >
                        {weeklyShifts.length} ca/tuần
                      </span>
                      <ChevronRight
                        className={cn(
                          'h-4 w-4 transition-colors',
                          isFocused ? 'text-primary' : 'text-muted-foreground/40'
                        )}
                      />
                    </div>
                  </div>
                )
              })}

              {filteredStaff.length === 0 && (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  Không tìm thấy nhân sự phù hợp với điều kiện tìm kiếm
                </div>
              )}
            </div>
          </div>

          {/* PANEL PHẢI: THÔNG TIN LỊCH TRỰC CỦA NHÂN SỰ ĐANG XEM (PHẲNG, KHÔNG VIỀN HỘP) */}
          <div className="p-3.5 bg-muted/20 flex flex-col min-h-0 overflow-hidden">
            {focusedStaff ? (
              <div className="flex flex-col h-full min-h-0 space-y-3">
                {/* THÔNG TIN NHÂN SỰ HEADER */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border/50 shrink-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-2xs',
                        focusedStaff.colorClass || 'bg-primary'
                      )}
                    >
                      {focusedStaff.shortName}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-foreground truncate">{focusedStaff.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{focusedStaff.role} · {focusedStaff.branch}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-muted-foreground block">Lịch trực tuần</span>
                    <span className="text-xs font-bold text-primary tabular-nums">
                      {focusedWeeklyShifts.length} ca
                    </span>
                  </div>
                </div>

                {/* MA TRẬN / TIMELINE 7 NGÀY TRỰC TRONG TUẦN */}
                <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                  <div className="py-1 text-xs font-bold text-foreground flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>Lịch các ngày trong tuần</span>
                    </div>
                    <span className="text-[10px] font-normal text-muted-foreground">
                      {WEEKDAYS[0]?.short} - {WEEKDAYS[6]?.short}
                    </span>
                  </div>

                  <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 pt-1">
                    {WEEKDAYS.map((day) => {
                      const isTargetDay = day.index === dayIndex
                      const dayShifts = focusedWeeklyShifts.filter((s) => s.dayIndex === day.index)
                      const isEditingSlotHere = isTargetDay

                      return (
                        <div
                          key={day.index}
                          className={cn(
                            'p-2 rounded-lg text-xs transition-colors',
                            isTargetDay ? 'bg-primary/10 border border-primary/30' : 'bg-card/70 border border-border/40'
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={cn(
                                'text-[11px] font-bold',
                                isTargetDay ? 'text-primary' : 'text-foreground'
                              )}
                            >
                              {day.label}
                              {isTargetDay && (
                                <span className="ml-1 text-[10px] font-normal text-primary">
                                  (Ngày đang chọn)
                                </span>
                              )}
                            </span>

                            {dayShifts.length > 0 ? (
                              <span className="text-[10px] font-semibold text-muted-foreground tabular-nums">
                                {dayShifts.length} ca
                              </span>
                            ) : (
                              <span className="text-[10px] text-muted-foreground/60 italic">
                                Trống
                              </span>
                            )}
                          </div>

                          {/* DANH SÁCH CA TRONG NGÀY */}
                          <div className="space-y-1">
                            {dayShifts.map((shift, idx) => {
                              const isCurrentSection = isTargetDay && shift.sectionId === section
                              const shiftRegTime = getStaffRegisteredTimeForDaySection(focusedStaff.id, day.index, shift.sectionId)

                              return (
                                <div
                                  key={idx}
                                  className={cn(
                                    'flex items-center justify-between rounded px-2 py-1 text-[11px]',
                                    isCurrentSection
                                      ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                                      : 'bg-muted/70 text-foreground'
                                  )}
                                >
                                  <div className="flex items-center gap-1.5">
                                    <span>{shift.sectionIcon}</span>
                                    <span>{shift.sectionLabel}</span>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {isCurrentSection && (
                                      <span className="text-[9px] uppercase font-bold opacity-90">
                                        Ca đang chọn
                                      </span>
                                    )}
                                    <span
                                      className={cn(
                                        'text-[9.5px] font-semibold tabular-nums',
                                        isCurrentSection
                                          ? 'text-primary-foreground/95 font-bold'
                                          : shiftRegTime === 'Cả ca'
                                          ? getStatusColors('success').text
                                          : 'text-muted-foreground'
                                      )}
                                    >
                                      {shiftRegTime}
                                    </span>
                                  </div>
                                </div>
                              )
                            })}

                            {/* NẾU ĐANG PHÂN BỔ VÀO CA NÀY */}
                            {isEditingSlotHere && isFocusedAssignedCurrent && !dayShifts.some((s) => s.sectionId === section) && (
                              <div className="flex items-center justify-between rounded px-2 py-1 text-[11px] bg-primary/20 border border-primary/40 text-primary font-semibold">
                                <div className="flex items-center gap-1.5">
                                  <span>{isDigi ? '💻' : '⏱'}</span>
                                  <span>{sectionLabel}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[9px] uppercase font-bold">
                                    + Vừa gán
                                  </span>
                                  <span className="text-[9.5px] font-semibold text-primary tabular-nums">
                                    {getStaffRegisteredTimeForDaySection(focusedStaff.id, day.index, section)}
                                  </span>
                                </div>
                              </div>
                            )}

                            {dayShifts.length === 0 && (!isEditingSlotHere || !isFocusedAssignedCurrent) && (
                              <p className="text-[10px] text-muted-foreground/60 italic pl-1">
                                Không có ca trực
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center p-4 text-muted-foreground">
                <User className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-xs">Chọn một nhân sự ở danh sách bên trái để xem lịch trực chi tiết.</p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="p-2.5 px-3 border-t bg-muted/20 flex flex-row items-center justify-between gap-2 shrink-0">
          <span className="text-[11px] text-muted-foreground truncate">
            Đã chọn: <strong className="text-primary font-bold">{selectedIds.length}</strong> người trực
          </span>

          <div className="flex items-center gap-2 shrink-0">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-7 text-xs cursor-pointer">
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => onSave(selectedIds)}
              className="h-7 text-xs bg-primary font-semibold cursor-pointer gap-1"
            >
              <Check className="h-3.5 w-3.5" />
              Lưu phân bổ ({selectedIds.length})
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
