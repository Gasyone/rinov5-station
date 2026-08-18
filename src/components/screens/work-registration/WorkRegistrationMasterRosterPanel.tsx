'use client'

import { useMemo, useState } from 'react'
import { Check, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  DUTY_SECTIONS,
  WEEKDAYS,
  findDutyEmployeeById,
  getDutyEmployeesByBranch,
  getMasterShiftRoster,
  updateMasterShiftRosterSlot,
  type DutyEmployee,
  type MasterShiftAssignment,
  type ShiftSection,
} from '@/mocks/shiftRoster'

interface WorkRegistrationMasterRosterPanelProps {
  activeBranch: string
  searchQuery?: string
  onRosterUpdated?: () => void
}

export function WorkRegistrationMasterRosterPanel({
  activeBranch,
  searchQuery = '',
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
            {WEEKDAYS.map((day) => (
              <div key={day.index} className="px-3 py-2 text-center">
                <span className="font-bold">{day.label}</span>
              </div>
            ))}
          </div>

          {/* 3 HÀNG BUỔI: SÁNG, CHIỀU, TỐI */}
          {DUTY_SECTIONS.map((sec) => (
            <div key={sec.id} className="flex-1 min-h-0 flex flex-col p-2 space-y-1">
              <div className="shrink-0 flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-foreground">
                <span>{sec.icon}</span>
                <span>{sec.label}</span>
                <span className="text-[10px] font-normal text-muted-foreground">
                  ({sec.slots[0]} - {sec.slots[sec.slots.length - 1]})
                </span>
              </div>

              <div className="flex-1 min-h-0 grid grid-cols-7 gap-2">
                {WEEKDAYS.map((day) => {
                  const assignedStaff = getSlotAssignedStaff(day.index, sec.id)
                  const isEnough = assignedStaff.length >= 2
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
                        'flex flex-col justify-between rounded-lg border p-2.5 h-full min-h-[100px] overflow-hidden cursor-pointer transition-all hover:shadow-xs hover:border-primary/50 group',
                        hasSearch && hasMatchingStaff
                          ? 'border-primary ring-2 ring-primary/30 bg-primary/5 shadow-xs'
                          : hasSearch && !hasMatchingStaff
                          ? 'opacity-35 hover:opacity-100'
                          : isEnough
                          ? 'bg-background'
                          : 'bg-amber-50/30 dark:bg-amber-950/10 border-amber-200/60'
                      )}
                    >
                      <div className="space-y-1.5 flex-1 min-h-0 flex flex-col">
                        <div className="shrink-0 flex items-center justify-between text-[10px]">
                          <span
                            className={cn(
                              'font-bold px-1.5 py-0.2 rounded',
                              hasMatchingStaff
                                ? 'bg-primary text-primary-foreground'
                                : isEnough
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            )}
                          >
                            {hasMatchingStaff
                              ? `Khớp tìm kiếm`
                              : `${assignedStaff.length} người trực`}
                          </span>
                          <span className="text-muted-foreground group-hover:text-primary transition-colors text-[11px] font-semibold">
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
                              </div>
                            )
                          })}
                          {assignedStaff.length === 0 && (
                            <div className="py-3 text-center text-[10px] text-muted-foreground italic">
                              Chưa có người trực
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

      {/* DIALOG CHỈNH SỬA PHÂN BỔ NHÂN SỰ CHO 1 CA */}
      {editingSlot && (
        <EditSlotStaffDialog
          open={Boolean(editingSlot)}
          branchName={activeBranch}
          dayLabel={editingSlot.dayLabel}
          sectionLabel={editingSlot.sectionLabel}
          allStaff={branchEmployees}
          masterRoster={masterRoster}
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

// Sub-component Dialog chọn nhân sự
function EditSlotStaffDialog({
  open,
  branchName,
  dayLabel,
  sectionLabel,
  allStaff,
  masterRoster,
  currentAssignedIds,
  onClose,
  onSave,
}: {
  open: boolean
  branchName: string
  dayLabel: string
  sectionLabel: string
  allStaff: DutyEmployee[]
  masterRoster: MasterShiftAssignment[]
  currentAssignedIds: string[]
  onClose: () => void
  onSave: (ids: string[]) => void
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>(currentAssignedIds)
  const [searchQuery, setSearchQuery] = useState('')

  const toggleStaff = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const filteredStaff = useMemo(() => {
    if (!searchQuery.trim()) return allStaff
    const q = searchQuery.toLowerCase().trim()
    return allStaff.filter(
      (staff) =>
        staff.name.toLowerCase().includes(q) ||
        staff.role.toLowerCase().includes(q) ||
        staff.shortName.toLowerCase().includes(q)
    )
  }, [allStaff, searchQuery])

  // Lấy danh sách các ca trong tuần của từng nhân sự
  const getStaffWeeklyShifts = (employeeId: string) => {
    return masterRoster
      .filter((item) => item.branch === branchName && item.assignedEmployeeIds.includes(employeeId))
      .map((item) => {
        const day = WEEKDAYS.find((w) => w.index === item.dayIndex)
        const sec = DUTY_SECTIONS.find((s) => s.id === item.section)
        return {
          dayIndex: item.dayIndex,
          dayShort: day?.short || `T${item.dayIndex + 2}`,
          sectionLabel: sec?.label?.replace('Buổi ', '') || item.section,
        }
      })
      .sort((a, b) => a.dayIndex - b.dayIndex)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2 border-b">
          <DialogTitle className="text-base font-semibold">
            Phân bổ người trực: {dayLabel} - {sectionLabel}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Chọn nhân sự phụ trách ca trực tại cơ sở.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 pt-3 flex flex-col min-h-0 flex-1">
          {/* Ô tìm kiếm */}
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên hoặc chức danh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8.5 pr-8 h-9 text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Danh sách nhân sự */}
          <div className="space-y-2 flex-1 min-h-[380px] max-h-[460px] overflow-y-auto pr-1.5">
            {filteredStaff.map((staff) => {
              const isSelected = selectedIds.includes(staff.id)
              const weeklyShifts = getStaffWeeklyShifts(staff.id)

              return (
                <div
                  key={staff.id}
                  onClick={() => toggleStaff(staff.id)}
                  className={cn(
                    'flex flex-col gap-2 rounded-lg border p-3 cursor-pointer transition-all',
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                      : 'border-border bg-card hover:bg-muted/50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white',
                          staff.colorClass || 'bg-primary'
                        )}
                      >
                        {staff.shortName}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-foreground">{staff.name}</p>
                          <span
                            className={cn(
                              'inline-block text-[9px] px-1.5 py-0.2 rounded font-semibold',
                              staff.role === 'CS'
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

                    <div
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded-md border',
                        isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-input'
                      )}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </div>
                  </div>

                  {/* Lịch trực các ngày của nhân sự này trong tuần */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-border/40 text-[10px]">
                    <span className="font-semibold text-muted-foreground">
                      Lịch trực tuần ({weeklyShifts.length} ca):
                    </span>
                    {weeklyShifts.length > 0 ? (
                      weeklyShifts.map((shift, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-sm bg-muted/80 px-1.5 py-0.5 text-[10px] font-medium text-foreground"
                        >
                          {shift.dayShort} - {shift.sectionLabel}
                        </span>
                      ))
                    ) : (
                      <span className="italic text-muted-foreground/60">Chưa có ca trực khác</span>
                    )}
                  </div>
                </div>
              )
            })}

            {filteredStaff.length === 0 && (
              <div className="py-12 text-center text-xs text-muted-foreground">
                Không tìm thấy nhân sự phù hợp với "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-3 px-4 border-t bg-muted/20 flex flex-row items-center justify-end gap-3 sm:gap-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="cursor-pointer">
            Hủy
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onSave(selectedIds)}
            className="bg-primary font-semibold cursor-pointer"
          >
            Lưu phân bổ ({selectedIds.length} người)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
