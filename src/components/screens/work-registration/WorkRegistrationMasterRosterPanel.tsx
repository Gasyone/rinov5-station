'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
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
  toWorkDateKey,
  type WorkRegistrationEmployee,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import { checkDateHoliday } from '@/mocks/holidays'
import { getEmployeeSectionShiftInfo } from './workRegistrationShiftHelpers'

interface WorkRegistrationMasterRosterPanelProps {
  activeBranch: string
  subjectFilter?: string
  searchQuery?: string
  selectedShifts?: ShiftSection[]
  weekDays?: Date[]
  records?: WorkRegistrationRecord[]
  employees?: WorkRegistrationEmployee[]
  onRosterUpdated?: () => void
}

export function WorkRegistrationMasterRosterPanel({
  activeBranch,
  subjectFilter = 'all',
  searchQuery = '',
  selectedShifts,
  weekDays = [],
  records = [],
  employees = [],
  onRosterUpdated,
}: WorkRegistrationMasterRosterPanelProps) {
  const [refreshKey, setRefreshKey] = useState(0)

  // Ref đo chiều cao tổng thể của ma trận để phân bổ đều chiều cao các ca trực
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState<number>(460)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const updateHeight = () => {
      const h = el.clientHeight
      if (h > 0) setContainerHeight(h)
    }

    updateHeight()

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const h = entry.contentRect.height
          if (h > 0) setContainerHeight(h)
        }
      })
      ro.observe(el)
      return () => ro.disconnect()
    } else {
      window.addEventListener('resize', updateHeight)
      return () => window.removeEventListener('resize', updateHeight)
    }
  }, [])

  // Các ca được hiển thị (chia đều toàn bộ chiều cao màn hình)
  const displayedSections = useMemo(() => {
    if (!selectedShifts || selectedShifts.length === 0) return DUTY_SECTIONS
    return DUTY_SECTIONS.filter((s) => selectedShifts.includes(s.id))
  }, [selectedShifts])

  // Chiều cao thực tế khả dụng của mỗi ô ca trực sau khi chia đều cho các ca hiển thị
  const cellHeight = useMemo(() => {
    const numSections = displayedSections.length || 3
    const WEEKDAY_HEADER_HEIGHT = 37
    const SECTION_HEADER_HEIGHT = 31
    const totalGridsHeight = Math.max(
      numSections * 90,
      containerHeight - WEEKDAY_HEADER_HEIGHT - numSections * SECTION_HEADER_HEIGHT
    )
    return Math.floor(totalGridsHeight / numSections)
  }, [containerHeight, displayedSections.length])

  // Dialog chọn nhân viên cho 1 ca cụ thể
  const [editingSlot, setEditingSlot] = useState<{
    dayIndex: number
    dayLabel: string
    section: ShiftSection
    sectionLabel: string
  } | null>(null)

  const branchEmployees = useMemo(() => {
    const list = getDutyEmployeesByBranch(activeBranch)
    if (list.length > 0) return list
    return employees
      .filter((e) => e.branch === activeBranch)
      .map((e) => {
        const isTeacher =
          e.department === 'Teaching' ||
          e.department === 'Phòng Đào tạo' ||
          e.position.toLowerCase().includes('teacher') ||
          e.position.toLowerCase().includes('giáo viên')
        const isTA =
          e.position.toLowerCase().includes('assistant') ||
          e.position.toLowerCase().includes('trợ giảng')
        const isCS =
          e.department === 'Customer Care' || e.position.toLowerCase().includes('cs')
        return {
          id: e.id,
          name: e.name,
          shortName:
            e.name
              .split(' ')
              .slice(-2)
              .map((w) => w[0])
              .join('')
              .toUpperCase() || 'NV',
          role: (isTeacher
            ? 'Giáo viên'
            : isTA
            ? 'Trợ giảng'
            : isCS
            ? 'CS'
            : 'Khác') as DutyEmployee['role'],
          subject: (e.subjects?.includes('Toán')
            ? 'math'
            : e.subjects?.includes('Tiếng Anh')
            ? 'english'
            : 'all') as DutyEmployee['subject'],
          colorClass: isTeacher
            ? 'bg-indigo-600 text-white'
            : isTA
            ? 'bg-purple-700 text-white'
            : isCS
            ? 'bg-rose-600 text-white'
            : 'bg-amber-600 text-white',
          branch: e.branch,
        }
      })
  }, [activeBranch, employees])

  const masterRoster = getMasterShiftRoster(activeBranch)

  const hasSubject = Boolean(subjectFilter && subjectFilter !== 'all')
  const hasSearch = Boolean(searchQuery.trim())

  const isSubjectMatch = (staff: DutyEmployee) => {
    if (!hasSubject) return true
    if (staff.subject === 'all' || (staff.role !== 'Giáo viên' && staff.role !== 'Trợ giảng')) {
      return true
    }
    if (staff.subject === 'math') return subjectFilter === 'Toán'
    if (staff.subject === 'english') return subjectFilter === 'Tiếng Anh'
    return false
  }

  // Tạo map dateKey cho từng dayIndex
  const dayDateKeys = useMemo(() => {
    const map: Record<number, string> = {}
    weekDays.forEach((day, idx) => {
      map[idx] = toWorkDateKey(day)
    })
    return map
  }, [weekDays])

  // Lấy thông tin đăng ký của nhân viên cho ngày + buổi (hỗ trợ cả Full ca hoặc nhiều khoảng giờ lẻ rời nhau e.g. "8-9h, 10-11h")
  const getStaffShiftDisplay = (employeeId: string, dayIndex: number, section: ShiftSection) => {
    const staff = branchEmployees.find((e) => e.id === employeeId)
    const isTeaching = staff ? staff.role === 'Giáo viên' || staff.role === 'Trợ giảng' : false
    const dateKey = dayDateKeys[dayIndex] || ''
    const shiftInfo = getEmployeeSectionShiftInfo(records, employeeId, dateKey, section)

    if (!isTeaching && shiftInfo.notRegistered) {
      return {
        isFull: true,
        isPartial: false,
        notRegistered: false,
        intervals: [] as string[],
        compactLabel: 'Full',
        fullTooltipLabel: 'Full ca',
      }
    }
    return shiftInfo
  }

  const isStaffAvailableForShift = (staff: DutyEmployee, dayIndex: number, section: ShiftSection) => {
    const isTeaching = staff.role === 'Giáo viên' || staff.role === 'Trợ giảng'
    if (!isTeaching) return true
    const shiftInfo = getStaffShiftDisplay(staff.id, dayIndex, section)
    return !shiftInfo.notRegistered
  }

  const getSlotAssignedStaff = (dayIndex: number, section: ShiftSection): DutyEmployee[] => {
    const found = masterRoster.find(
      (item) => item.branch === activeBranch && item.dayIndex === dayIndex && item.section === section
    )
    if (!found) return []
    const list = found.assignedEmployeeIds
      .map((id) => branchEmployees.find((e) => e.id === id) || findDutyEmployeeById(id))
      .filter(Boolean) as DutyEmployee[]
    const availableList = list.filter((staff) => isStaffAvailableForShift(staff, dayIndex, section))
    return hasSubject ? availableList.filter(isSubjectMatch) : availableList
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

  // Tính số lượng nhân sự hiển thị tối đa vừa vặn với chiều cao thực tế của ô ca trực (chỉ khi không đủ chỗ mới +N)
  const getVisibleStaffInfo = (staffList: DutyEmployee[], availableCellHeight: number) => {
    if (staffList.length === 0) {
      return {
        visibleStaff: [] as DutyEmployee[],
        remainingStaff: [] as DutyEmployee[],
        remainingCount: 0,
        hasMoreStaff: false,
      }
    }

    const ITEM_HEIGHT = 18 // Chiều cao 1 dòng nhân sự (px)
    const ITEM_GAP = 2 // Khoảng cách giữa các dòng (px)
    const MORE_BTN_HEIGHT = 19 // Chiều cao nút +N (px)
    const MORE_BTN_GAP = 2 // Khoảng cách tới nút +N (px)
    const FIXED_OVERHEAD = 34 // Padding ô (12px) + header ô (18px) + buffer (4px)

    const availableForStaff = Math.max(0, availableCellHeight - FIXED_OVERHEAD)
    const totalNeededForAll =
      staffList.length * ITEM_HEIGHT + Math.max(0, staffList.length - 1) * ITEM_GAP

    // 1. Kiểm tra xem chiều cao thực tế của ô có đủ chỗ hiển thị toàn bộ danh sách nhân sự hay không
    const canFitAll = totalNeededForAll <= availableForStaff

    if (canFitAll) {
      return {
        visibleStaff: staffList,
        remainingStaff: [] as DutyEmployee[],
        remainingCount: 0,
        hasMoreStaff: false,
      }
    }

    // 2. Khi số lượng nhân sự vượt quá sức chứa của ô (không đủ chỗ cho tất cả):
    // Tự động kích hoạt cơ chế thu gọn: dành 1 dòng cuối cho nút "+N người khác | Chi tiết →"
    // và điền đầy tối đa số lượng nhân sự có thể vừa trong khoảng trống còn lại của ô (bestK)
    let bestK = 1
    for (let k = staffList.length - 1; k >= 1; k--) {
      const needed = k * ITEM_HEIGHT + (k - 1) * ITEM_GAP + MORE_BTN_GAP + MORE_BTN_HEIGHT
      if (needed <= availableForStaff) {
        bestK = k
        break
      }
    }

    // Đảm bảo khi đã gom về N+ thì luôn có ít nhất 1 người bị ẩn và hiện nút +N
    if (bestK >= staffList.length) {
      bestK = Math.max(1, staffList.length - 1)
    }

    const visibleStaff = staffList.slice(0, bestK)
    const remainingStaff = staffList.slice(bestK)
    const remainingCount = staffList.length - bestK

    return {
      visibleStaff,
      remainingStaff,
      remainingCount,
      hasMoreStaff: remainingCount > 0,
    }
  }

  const handleSaveSlotStaff = (selectedIds: string[]) => {
    if (!editingSlot) return
    updateMasterShiftRosterSlot(activeBranch, editingSlot.dayIndex, editingSlot.section, selectedIds)
    setRefreshKey((k) => k + 1)
    onRosterUpdated?.()
    setEditingSlot(null)
    toast.success(`Đã cập nhật ${editingSlot.sectionLabel} (${editingSlot.dayLabel})`)
  }

  return (
    <div key={refreshKey} className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      {/* MA TRẬN PHÂN BỔ CA TRỰC 7 NGÀY */}
      <div className="flex-1 min-h-0 overflow-auto rounded-xl border bg-card shadow-2xs flex flex-col">
        <div ref={containerRef} className="flex flex-col min-w-[900px] divide-y flex-1 min-h-[460px]">
          {/* HEADER: 7 THỨ TRONG TUẦN */}
          <div className="shrink-0 grid grid-cols-7 divide-x bg-muted/80 backdrop-blur-xs text-xs font-semibold text-foreground sticky top-0 z-20 border-b">
            {WEEKDAYS.map((day, idx) => {
              const dateObj = weekDays[idx]
              const dateKey = dateObj ? toWorkDateKey(dateObj) : ''
              const holiday = dateKey ? checkDateHoliday(dateKey, activeBranch) : undefined

              return (
                <div key={day.index} className={cn('px-2 py-2 text-center', holiday && 'bg-amber-500/5')}>
                  <span className="font-bold">{day.label}</span>
                  {holiday && (
                    <span
                      className="block mt-0.5 max-w-full truncate rounded bg-amber-100 dark:bg-amber-950/80 px-1 py-0.2 text-xs font-semibold text-amber-800 dark:text-amber-300 border border-amber-300/50"
                      title={holiday.name}
                    >
                      🎉 {holiday.name}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* 3 HÀNG BUỔI: BUỔI SÁNG, BUỔI CHIỀU, BUỔI TỐI - CHIA ĐỀU CHIỀU CAO KHẢ DỤNG */}
          {displayedSections.map((sec) => {
            return (
              <div key={sec.id} className="flex-1 min-h-0 flex flex-col overflow-hidden">
                {/* TIÊU ĐỀ CA CÓ PHỦ NỀN ĐẸP (RIBBON HEADER) */}
                <div
                  className={cn(
                    'shrink-0 flex items-center justify-between px-3.5 py-1.5 border-b text-xs font-bold transition-colors',
                    sec.id === 'morning'
                      ? 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-500/20 text-amber-900 dark:text-amber-200'
                      : sec.id === 'afternoon'
                      ? 'bg-sky-500/10 dark:bg-sky-950/40 border-sky-500/20 text-sky-900 dark:text-sky-200'
                      : 'bg-purple-500/10 dark:bg-purple-950/40 border-purple-500/20 text-purple-900 dark:text-purple-200'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs">
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
                      ({sec.slots[0]} - {sec.slots[sec.slots.length - 1]})
                    </span>
                  </div>
                </div>

                {/* 7 CỘT THỨ (PHÂN CÁCH BẰNG ĐƯỜNG KẺ DỌC divide-x) */}
                <div
                  className="grid grid-cols-7 divide-x divide-border/60 flex-1 min-h-0 overflow-hidden"
                >
                  {WEEKDAYS.map((day) => {
                    const assignedStaff = getSlotAssignedStaff(day.index, sec.id)
                    const hasMatchingStaff = hasSearch && assignedStaff.some(isStaffMatch)
                    const sortedStaff = hasSearch
                      ? [...assignedStaff].sort((a, b) => (isStaffMatch(b) ? 1 : 0) - (isStaffMatch(a) ? 1 : 0))
                      : assignedStaff
                    const { visibleStaff, remainingStaff, remainingCount, hasMoreStaff } =
                      getVisibleStaffInfo(sortedStaff, cellHeight)

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
                          'flex flex-col justify-between px-2 py-1.5 h-full min-h-0 overflow-hidden cursor-pointer transition-all hover:bg-muted/20 group relative',
                          hasSearch && hasMatchingStaff
                            ? 'bg-primary/5 ring-1 ring-primary/40'
                            : hasSearch && !hasMatchingStaff
                            ? 'opacity-35 hover:opacity-100'
                            : 'bg-card'
                        )}
                      >
                        <div className="space-y-1 flex-1 min-h-0 flex flex-col overflow-hidden">
                          {/* HEADER Ô: SỐ NGƯỜI TRỰC / TRỐNG + NÚT + SỬA */}
                          <div className="shrink-0 flex items-center justify-between text-xs leading-none">
                            <span
                              className={cn(
                                'text-[11.5px]',
                                hasMatchingStaff
                                  ? 'text-primary font-bold'
                                  : assignedStaff.length > 0
                                  ? 'text-amber-600 dark:text-amber-500 font-medium'
                                  : 'text-muted-foreground/60 font-normal'
                              )}
                            >
                              {hasMatchingStaff
                                ? 'Khớp tìm kiếm'
                                : assignedStaff.length > 0
                                ? `${assignedStaff.length} người trực`
                                : 'Trống'}
                            </span>
                            <span className="inline-flex items-center rounded bg-sky-500/10 px-1.5 py-0.2 text-[10.5px] font-semibold text-sky-600 dark:text-sky-400 group-hover:bg-sky-500/20 transition-colors">
                              + Sửa
                            </span>
                          </div>

                          {/* DANH SÁCH NHÂN SỰ TRONG CA */}
                          {assignedStaff.length > 0 ? (
                            <div className="space-y-0.5 pt-0.5 flex-1 min-h-0 overflow-hidden flex flex-col justify-start">
                              {visibleStaff.map((staff) => {
                                const isMatched = isStaffMatch(staff)
                                const shiftDisplay = getStaffShiftDisplay(staff.id, day.index, sec.id)
                                const isFull = !shiftDisplay.isPartial && !shiftDisplay.notRegistered
                                const compactTime = shiftDisplay.compactLabel

                                return (
                                  <div
                                    key={staff.id}
                                    title={`${staff.name} • ${shiftDisplay.fullTooltipLabel}`}
                                    className={cn(
                                      'flex items-center justify-between gap-1 rounded hover:bg-muted/60 px-1 py-0.2 text-[11px] leading-tight transition-colors shrink-0 h-[18px]',
                                      isMatched
                                        ? 'bg-primary text-primary-foreground shadow-2xs ring-1 ring-primary-foreground/20'
                                        : 'text-foreground'
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        'truncate text-[11px] font-normal flex-1 min-w-0',
                                        isMatched ? 'text-primary-foreground font-medium' : 'text-foreground'
                                      )}
                                      title={staff.name}
                                    >
                                      {staff.name}
                                    </span>
                                    {compactTime ? (
                                      <span
                                        className={cn(
                                          'shrink-0 tabular-nums leading-tight',
                                          isMatched
                                            ? 'text-primary-foreground font-medium text-[11px]'
                                            : isFull
                                            ? 'text-[11px] font-medium text-emerald-600 dark:text-emerald-400'
                                            : 'text-[10px] font-normal text-muted-foreground'
                                        )}
                                      >
                                        {compactTime}
                                      </span>
                                    ) : null}
                                  </div>
                                )
                              })}

                              {/* CHỈ BÁO +N KHI KHÔNG ĐỦ CHỖ HIỂN THỊ */}
                              {hasMoreStaff && (
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setEditingSlot({
                                      dayIndex: day.index,
                                      dayLabel: day.label,
                                      section: sec.id,
                                      sectionLabel: sec.label,
                                    })
                                  }}
                                  className="flex items-center justify-between rounded bg-sky-500/10 hover:bg-sky-500/20 px-1.5 py-0.2 text-[11px] font-semibold text-sky-700 dark:text-sky-300 border border-sky-500/20 transition-colors mt-0.5 cursor-pointer group/more shrink-0 h-[19px]"
                                  title={`Còn lại (${remainingCount} người trực):\n${remainingStaff
                                    .map(
                                      (s) =>
                                        `• ${s.name} (${getStaffShiftDisplay(s.id, day.index, sec.id).compactLabel || 'Full'})`
                                    )
                                    .join('\n')}`}
                                >
                                  <span className="font-semibold text-xs tabular-nums">
                                    +{remainingCount} người khác
                                  </span>
                                  <span className="text-[10px] font-normal text-sky-600/80 dark:text-sky-400/80 group-hover/more:underline">
                                    Chi tiết →
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-4 text-center select-none">
                              <p className="text-xs text-muted-foreground/60">Chưa có người trực</p>
                              <p className="text-[11px] text-muted-foreground/40 mt-0.5">
                                Nhấp hoặc bấm &quot;+ Sửa&quot;
                              </p>
                            </div>
                          )}
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

      {/* DIALOG CHỈNH SỬA PHÂN BỔ NHÂN SỰ CHO 1 CA */}
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
          subjectFilter={subjectFilter}
          employees={employees}
          currentAssignedIds={
            getSlotAssignedStaff(editingSlot.dayIndex, editingSlot.section).map((e) => e.id)
          }
          onClose={() => setEditingSlot(null)}
          onSave={handleSaveSlotStaff}
        />
      )}
    </div>
  )
}
