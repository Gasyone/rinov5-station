'use client'

import React, { useState, useMemo } from 'react'
import { Check, Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { getStatusTextColor } from '@/lib/statusColors'
import {
  type DutyEmployee,
  type MasterShiftAssignment,
  type ShiftSection,
} from '@/mocks/shiftRoster'
import {
  toWorkDateKey,
  type WorkRegistrationEmployee,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import { getEmployeeSectionShiftInfo } from './workRegistrationShiftHelpers'

function getStaffSubjectTag(staff: DutyEmployee, employees?: WorkRegistrationEmployee[]): string {
  if (staff.role === 'Giáo viên' || staff.role === 'Trợ giảng') {
    if (staff.subject === 'math') return '· Toán'
    if (staff.subject === 'english') return '· Tiếng Anh'
    const emp = employees?.find((e) => e.id === staff.id)
    return emp?.subjects?.length ? `· ${emp.subjects.join(', ')}` : ''
  }
  return '· Hỗ trợ chung'
}

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
  subjectFilter?: string
  employees?: WorkRegistrationEmployee[]
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
  subjectFilter = 'all',
  employees = [],
  onClose,
  onSave,
}: WorkRegistrationAssignStaffDialogProps) {
  // Helper lấy thông tin đăng ký ca trực của 1 nhân viên trong ca đang chọn
  const getStaffRegistrationForCurrentShift = (staff: DutyEmployee) => {
    const isTeaching = staff.role === 'Giáo viên' || staff.role === 'Trợ giảng'
    const targetDateObj = weekDays[dayIndex]
    const targetDateKey = targetDateObj ? toWorkDateKey(targetDateObj) : ''
    const shiftInfo = getEmployeeSectionShiftInfo(records, staff.id, targetDateKey, section)

    if (!isTeaching && shiftInfo.notRegistered) {
      return {
        isTeaching,
        isFull: true,
        isPartial: false,
        intervals: [] as string[],
        notRegistered: false,
      }
    }

    return {
      isTeaching,
      isFull: shiftInfo.isFull,
      isPartial: shiftInfo.isPartial,
      intervals: shiftInfo.intervals,
      notRegistered: shiftInfo.notRegistered,
    }
  }

  const isStaffDisabled = (staff: DutyEmployee) => {
    const isTeaching = staff.role === 'Giáo viên' || staff.role === 'Trợ giảng'
    if (!isTeaching) return false
    const regInfo = getStaffRegistrationForCurrentShift(staff)
    return regInfo.notRegistered
  }

  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    return currentAssignedIds.filter((id) => {
      const staff = allStaff.find((s) => s.id === id)
      return staff ? !isStaffDisabled(staff) : true
    })
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'Giáo viên' | 'Khác'>('all')

  const toggleStaff = (id: string) => {
    const staff = allStaff.find((s) => s.id === id)
    if (staff && isStaffDisabled(staff)) return
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const filteredStaff = useMemo(() => {
    let list = allStaff
    if (roleFilter === 'Giáo viên') {
      list = list.filter((staff) => staff.role === 'Giáo viên' || staff.role === 'Trợ giảng')
    } else if (roleFilter === 'Khác') {
      list = list.filter((staff) => staff.role !== 'Giáo viên' && staff.role !== 'Trợ giảng')
    }
    if (subjectFilter && subjectFilter !== 'all') {
      list = list.filter((staff) => {
        if (staff.subject === 'all' || (staff.role !== 'Giáo viên' && staff.role !== 'Trợ giảng')) {
          return true
        }
        if (staff.subject === 'math') return subjectFilter === 'Toán'
        if (staff.subject === 'english') return subjectFilter === 'Tiếng Anh'
        const emp = employees?.find((e) => e.id === staff.id)
        return emp?.subjects?.includes(subjectFilter)
      })
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
  }, [allStaff, searchQuery, roleFilter, subjectFilter, employees])

  // Số ca trong tuần của 1 nhân sự (phản ánh trực tiếp trạng thái đang tick)
  const getWeeklyShiftCount = (employeeId: string) => {
    let count = masterRoster.filter(
      (item) =>
        item.branch === branchName &&
        item.assignedEmployeeIds.includes(employeeId) &&
        !(item.dayIndex === dayIndex && item.section === section)
    ).length
    if (selectedIds.includes(employeeId)) count += 1
    return count
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-xl max-h-[88vh] flex flex-col gap-0 p-0 overflow-hidden">
        {/* HEADER: TIÊU ĐỀ */}
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <DialogTitle className="text-sm font-bold text-foreground">
                Phân bổ người trực: {dayLabel} - {sectionLabel}
              </DialogTitle>
              {subjectFilter && subjectFilter !== 'all' && (
                <span className="rounded-full bg-primary/10 text-primary dark:bg-primary/20 px-2 py-0.5 text-xs font-semibold border border-primary/30">
                  Môn: {subjectFilter}
                </span>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* BODY: CHỈ HIỂN THỊ PANEL TRÁI (DANH SÁCH NHÂN SỰ) */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="p-3 flex flex-col min-h-0 h-full overflow-hidden space-y-2.5">
            {/* HÀNG BỘ LỌC VAI TRÒ & SEARCH */}
            <div className="flex items-center justify-between gap-1.5 shrink-0">
              <div className="flex items-center gap-1 flex-wrap">
                {(['all', 'Giáo viên', 'Khác'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRoleFilter(r)}
                    className={cn(
                      'px-2 py-0.5 rounded-md text-xs font-semibold transition-all cursor-pointer',
                      roleFilter === r
                        ? 'bg-primary text-primary-foreground shadow-2xs'
                        : 'bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {r === 'all' ? 'Tất cả' : r}
                  </button>
                ))}
              </div>

              <div className="relative flex items-center shrink-0">
                <Search className="h-3.5 w-3.5 absolute left-2 text-muted-foreground pointer-events-none" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên..."
                  className="h-7 w-32 sm:w-40 text-xs pl-7 pr-2 bg-background border-border/80"
                />
              </div>
            </div>

            {/* DANH SÁCH NHÂN SỰ */}
            <div className="space-y-1 flex-1 min-h-0 overflow-y-auto pr-1">
              {filteredStaff.map((staff) => {
                const isSelected = selectedIds.includes(staff.id)
                const weeklyCount = getWeeklyShiftCount(staff.id)
                const regInfo = getStaffRegistrationForCurrentShift(staff)
                const disabled = isStaffDisabled(staff)

                return (
                  <div
                    key={staff.id}
                    onClick={() => {
                      if (!disabled) toggleStaff(staff.id)
                    }}
                    className={cn(
                      'flex items-center justify-between rounded-lg px-2.5 py-2 transition-all border select-none',
                      disabled
                        ? 'border-transparent bg-muted/20 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'bg-primary/5 border-primary/30 text-foreground hover:bg-primary/10 cursor-pointer'
                        : 'border-transparent hover:bg-muted/50 text-foreground cursor-pointer'
                    )}
                  >
                    {/* TRÁI: CHECKBOX + TÊN + VAI TRÒ */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!disabled) toggleStaff(staff.id)
                        }}
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors',
                          disabled
                            ? 'border-border/60 bg-muted/40 text-muted-foreground/30 cursor-not-allowed'
                            : isSelected
                            ? 'bg-primary border-primary text-primary-foreground cursor-pointer'
                            : 'border-input hover:border-primary/60 bg-background cursor-pointer'
                        )}
                        title={
                          disabled
                            ? 'Giáo viên chưa đăng ký thời gian rảnh - Không thể chọn'
                            : isSelected
                            ? 'Bỏ chọn phân bổ'
                            : 'Chọn phân bổ ca này'
                        }
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            'text-xs font-semibold truncate',
                            disabled ? 'text-muted-foreground' : 'text-foreground'
                          )}
                        >
                          {staff.name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <span
                            className={cn(
                              'text-[10.5px] font-normal leading-tight',
                              disabled
                                ? 'text-muted-foreground/60'
                                : staff.role === 'Giáo viên'
                                ? 'text-blue-600 dark:text-blue-400'
                                : staff.role === 'Trợ giảng'
                                ? 'text-purple-600 dark:text-purple-400'
                                : staff.role === 'CS'
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-muted-foreground'
                            )}
                          >
                            {staff.role}
                          </span>
                          <span className="text-[10px] text-muted-foreground/70 font-normal">
                            {getStaffSubjectTag(staff, employees)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* PHẢI: GIỜ ĐĂNG KÝ + SỐ CA TRONG TUẦN */}
                    <div className="flex flex-col items-end gap-0.5 shrink-0 ml-2">
                      {regInfo.isFull ? (
                        <span
                          className="inline-flex items-center rounded px-1.5 py-0.2 text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                          title="Đăng ký trọn ca (Full)"
                        >
                          Full
                        </span>
                      ) : regInfo.isPartial && regInfo.intervals.length > 0 ? (
                        <div className="flex flex-wrap items-center justify-end gap-1 max-w-[240px]">
                          {regInfo.intervals.map((range, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded px-1.5 py-0.2 text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 tabular-nums"
                              title={`Giờ đăng ký: ${range}`}
                            >
                              {range}
                            </span>
                          ))}
                        </div>
                      ) : regInfo.notRegistered ? (
                        <span
                          className={cn(
                            'text-xs font-semibold leading-tight',
                            getStatusTextColor('not_registered')
                          )}
                          title="Chưa đăng ký thời gian rảnh"
                        >
                          Chưa đăng ký
                        </span>
                      ) : null}

                      <span
                        className={cn(
                          'text-xs font-normal tabular-nums',
                          weeklyCount > 0
                            ? 'text-muted-foreground'
                            : 'text-muted-foreground/50'
                        )}
                        title={`Đã phân bổ ${weeklyCount} ca trực trong tuần`}
                      >
                        {weeklyCount} ca/tuần
                      </span>
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
        </div>

        {/* FOOTER */}
        <DialogFooter className="p-2.5 px-3 border-t bg-muted/20 flex flex-row items-center justify-between gap-2 shrink-0">
          <span className="text-xs text-muted-foreground truncate">
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
