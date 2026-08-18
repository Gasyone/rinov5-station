'use client'

import { useMemo } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { FilterGroupSheetPanel, createFilterGroup } from '@/components/filters'
import { getDynamicMonthFilterOptions } from './operationsAlertHelpers'

export interface FilterState {
  selectedBranches: Set<string>
  selectedStatuses: Set<string>
  selectedCareStatuses: Set<string>
  selectedAlerts: Set<string>
  selectedCareTypes: Set<string>
  selectedAbsences: Set<string>
  selectedHomeworks: Set<string>
  selectedLowScores: Set<string>
  selectedTrends: Set<string>
  selectedCalls: Set<string>
  selectedClasses: Set<string>
  attendanceMin: string
  attendanceMax: string
  homeworkMin: string
  homeworkMax: string
  scoreMin: string
  scoreMax: string
  sessionMin: string
  sessionMax: string
  selectedMonths: Set<string>
  fromDate: string
  toDate: string
}

export interface FilterActions {
  setSelectedBranches: React.Dispatch<React.SetStateAction<Set<string>>>
  setSelectedStatuses: React.Dispatch<React.SetStateAction<Set<string>>>
  setSelectedCareStatuses: React.Dispatch<React.SetStateAction<Set<string>>>
  setSelectedAlerts: React.Dispatch<React.SetStateAction<Set<string>>>
  setSelectedCareTypes: React.Dispatch<React.SetStateAction<Set<string>>>
  setSelectedAbsences: React.Dispatch<React.SetStateAction<Set<string>>>
  setSelectedHomeworks: React.Dispatch<React.SetStateAction<Set<string>>>
  setSelectedLowScores: React.Dispatch<React.SetStateAction<Set<string>>>
  setSelectedTrends: React.Dispatch<React.SetStateAction<Set<string>>>
  setSelectedCalls: React.Dispatch<React.SetStateAction<Set<string>>>
  setSelectedClasses: React.Dispatch<React.SetStateAction<Set<string>>>
  setAttendanceMin: (v: string) => void
  setAttendanceMax: (v: string) => void
  setHomeworkMin: (v: string) => void
  setHomeworkMax: (v: string) => void
  setScoreMin: (v: string) => void
  setScoreMax: (v: string) => void
  setSessionMin: (v: string) => void
  setSessionMax: (v: string) => void
  setSelectedMonths: React.Dispatch<React.SetStateAction<Set<string>>>
  setFromDate: (v: string) => void
  setToDate: (v: string) => void
  resetPagination: () => void
}

interface OperationsAlertFilterPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  branchOptions: string[]
  classList: string[]
  searchQuery: string
  onSearchQueryChange: (q: string) => void
  state: FilterState
  actions: FilterActions
}

export function OperationsAlertFilterPanel({
  open,
  onOpenChange,
  branchOptions,
  classList,
  searchQuery,
  onSearchQueryChange,
  state,
  actions,
}: OperationsAlertFilterPanelProps) {

  const handleFilterToggle = (groupId: string, value: string) => {
    const updateSet = (prev: Set<string>) => {
      const next = new Set(prev)
      if (next.has(value)) {
        next.delete(value)
      } else {
        next.add(value)
      }
      return next
    }
    
    if (groupId === 'branches') actions.setSelectedBranches(updateSet)
    else if (groupId === 'statuses') actions.setSelectedStatuses(updateSet)
    else if (groupId === 'careStatuses') actions.setSelectedCareStatuses(updateSet)
    else if (groupId === 'careAlerts') actions.setSelectedAlerts(updateSet)
    else if (groupId === 'careTypes') actions.setSelectedCareTypes(updateSet)
    else if (groupId === 'trends') actions.setSelectedTrends(updateSet)
    else if (groupId === 'callConfirmations' || groupId === 'careResults') actions.setSelectedCalls(updateSet)
    else if (groupId === 'classes') actions.setSelectedClasses(updateSet)
    
    actions.resetPagination()
  }

  const handleClearAllFilters = () => {
    actions.setSelectedBranches(new Set())
    actions.setSelectedStatuses(new Set())
    actions.setSelectedCareStatuses(new Set())
    actions.setSelectedAlerts(new Set())
    actions.setSelectedCareTypes(new Set())
    actions.setAttendanceMin('')
    actions.setAttendanceMax('')
    actions.setHomeworkMin('')
    actions.setHomeworkMax('')
    actions.setScoreMin('')
    actions.setScoreMax('')
    actions.setSessionMin('')
    actions.setSessionMax('')
    actions.setSelectedAbsences(new Set())
    actions.setSelectedHomeworks(new Set())
    actions.setSelectedLowScores(new Set())
    actions.setSelectedTrends(new Set())
    actions.setSelectedCalls(new Set())
    actions.setSelectedClasses(new Set())
    actions.setSelectedMonths(new Set())
    actions.setFromDate('')
    actions.setToDate('')
    actions.resetPagination()
  }

  const handleClearSection = (groupId: string) => {
    if (groupId === 'branches') actions.setSelectedBranches(new Set())
    else if (groupId === 'timeFilter') {
      actions.setSelectedMonths(new Set())
      actions.setFromDate('')
      actions.setToDate('')
    } else if (groupId === 'statuses') actions.setSelectedStatuses(new Set())
    else if (groupId === 'careStatuses') actions.setSelectedCareStatuses(new Set())
    else if (groupId === 'careAlerts') actions.setSelectedAlerts(new Set())
    else if (groupId === 'careTypes') actions.setSelectedCareTypes(new Set())
    else if (groupId === 'attendance') {
      actions.setAttendanceMin('')
      actions.setAttendanceMax('')
      actions.setSelectedAbsences(new Set())
    } else if (groupId === 'homework') {
      actions.setHomeworkMin('')
      actions.setHomeworkMax('')
      actions.setSelectedHomeworks(new Set())
    } else if (groupId === 'scores') {
      actions.setScoreMin('')
      actions.setScoreMax('')
      actions.setSelectedLowScores(new Set())
    } else if (groupId === 'sessions') {
      actions.setSessionMin('')
      actions.setSessionMax('')
    } else if (groupId === 'trends') actions.setSelectedTrends(new Set())
    else if (groupId === 'callConfirmations' || groupId === 'careResults') actions.setSelectedCalls(new Set())
    else if (groupId === 'classes') actions.setSelectedClasses(new Set())
    actions.resetPagination()
  }

  // Advanced Filters Sheet configuration sections
  const filterGroups = useMemo(() => {
    return [
      createFilterGroup({
        id: 'branches',
        title: 'Trường',
        options: branchOptions,
        selectedValues: state.selectedBranches,
        defaultOpen: true,
      }),
      createFilterGroup({
        id: 'timeFilter',
        title: 'Thời gian & Tháng tác nghiệp',
        options: [],
        defaultOpen: true,
        customContent: (
          <div className="space-y-3">
            {/* Lọc theo tháng (Checkboxes) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Lọc theo Tháng
              </span>
              <div className="flex flex-col gap-1 mt-1 max-h-44 overflow-y-auto pr-1">
                {getDynamicMonthFilterOptions().map((opt) => (
                  <label key={opt.value} className="flex cursor-pointer items-center gap-2 rounded-md hover:bg-accent/50 p-1 text-xs select-none">
                    <Checkbox
                      checked={state.selectedMonths.has(opt.value)}
                      onCheckedChange={(checked) => {
                        actions.setSelectedMonths((prev) => {
                          const next = new Set(prev)
                          if (checked) next.add(opt.value)
                          else next.delete(opt.value)
                          return next
                        })
                        actions.resetPagination()
                      }}
                    />
                    <span className="font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Lọc theo khoảng thời gian (1 Dòng duy nhất) */}
            <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Khoảng thời gian tác nghiệp (Từ ngày - Đến ngày)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={state.fromDate}
                  onChange={(e) => {
                    actions.setFromDate(e.target.value)
                    actions.resetPagination()
                  }}
                  className="w-1/2 h-8 px-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <span className="text-muted-foreground text-xs font-medium shrink-0">-</span>
                <input
                  type="date"
                  value={state.toDate}
                  onChange={(e) => {
                    actions.setToDate(e.target.value)
                    actions.resetPagination()
                  }}
                  className="w-1/2 h-8 px-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            {(state.selectedMonths.size > 0 || state.fromDate !== '' || state.toDate !== '') && (
              <Button
                variant="link"
                className="h-auto p-0 text-[10px] text-muted-foreground hover:text-foreground inline-flex cursor-pointer"
                onClick={() => {
                  actions.setSelectedMonths(new Set())
                  actions.setFromDate('')
                  actions.setToDate('')
                  actions.resetPagination()
                }}
              >
                Xóa lọc thời gian
              </Button>
            )}
          </div>
        )
      }),
      createFilterGroup({
        id: 'statuses',
        title: 'Trạng thái học viên',
        options: [
          { value: 'active', label: 'Đang học' },
          { value: 'trial', label: 'Học thử' },
          { value: 'pending_payment', label: 'Chờ thanh toán' },
          { value: 'wait_for_assignment', label: 'Chờ xếp lớp' },
          { value: 'pending_transfer', label: 'Chờ chuyển' },
          { value: 'awaiting_opening', label: 'Chờ khai giảng' },
          { value: 'reserve', label: 'Bảo lưu' },
          { value: 'session_ended', label: 'Hết buổi' },
          { value: 'fee_transfer', label: 'Chuyển phí' },
          { value: 'enroll_later', label: 'Đăng ký sau' },
          { value: 'draft_class', label: 'Nháp lớp' },
          { value: 'Chờ chuyển lớp', label: 'Chờ chuyển lớp' },
        ],
        selectedValues: state.selectedStatuses,
        defaultOpen: true,
      }),
      createFilterGroup({
        id: 'careStatuses',
        title: 'Trạng thái chăm sóc',
        options: [
          { value: 'pending', label: 'Chưa chăm sóc' },
          { value: 'in_progress', label: 'Đang xử lý' },
          { value: 'cared', label: 'Đã chăm sóc' },
        ],
        selectedValues: state.selectedCareStatuses,
        defaultOpen: true,
      }),
      createFilterGroup({
        id: 'careAlerts',
        title: 'Cảnh báo CS',
        options: [
          { value: 'C90B', label: 'Cảnh báo C90B' },
          { value: 'Học lực yếu', label: 'Học lực yếu' },
          { value: 'Chuyên cần thấp', label: 'Chuyên cần thấp' },
        ],
        selectedValues: state.selectedAlerts,
        defaultOpen: true,
      }),
      createFilterGroup({
        id: 'careTypes',
        title: 'Loại chăm sóc',
        options: [
          { value: 'service', label: 'Chăm sóc' },
          { value: 'academic', label: 'Chuyên môn' },
          { value: 'ĐB', label: 'Chăm sóc Đặc biệt (ĐB)' },
          { value: 'ĐK', label: 'Chăm sóc Định kỳ (ĐK)' },
          { value: 'TB', label: 'Chăm sóc Theo buổi (TB)' },
          { value: 'CSTP', label: 'Chăm sóc Tái phí (CSTP)' },
          { value: 'T', label: 'Chăm sóc Thường (T)' },
        ],
        selectedValues: state.selectedCareTypes,
        defaultOpen: true,
      }),
      createFilterGroup({
        id: 'attendance',
        title: 'Chuyên cần',
        options: [],
        defaultOpen: false,
        customContent: (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Khoảng chuyên cần
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Từ %"
                    value={state.attendanceMin}
                    onChange={(e) => {
                      actions.setAttendanceMin(e.target.value)
                      actions.resetPagination()
                    }}
                    className="w-full h-8 px-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-background text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <span className="text-muted-foreground text-xs font-medium">đến</span>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Đến %"
                    value={state.attendanceMax}
                    onChange={(e) => {
                      actions.setAttendanceMax(e.target.value)
                      actions.resetPagination()
                    }}
                    className="w-full h-8 px-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-background text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Buổi nghỉ liên tiếp
              </span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  { value: '1', label: 'Nghỉ 1 buổi' },
                  { value: '2', label: 'Nghỉ 2 buổi liên tiếp' },
                  { value: '3', label: 'Nghỉ 3 buổi liên tiếp' },
                  { value: '4+', label: 'Nghỉ >= 4 buổi' }
                ].map((opt) => (
                  <label key={opt.value} className="flex cursor-pointer items-center gap-2 rounded-md hover:bg-accent/50 p-1 text-xs select-none">
                    <Checkbox
                      checked={state.selectedAbsences.has(opt.value)}
                      onCheckedChange={(checked) => {
                        actions.setSelectedAbsences((prev) => {
                          const next = new Set(prev)
                          if (checked) next.add(opt.value)
                          else next.delete(opt.value)
                          return next
                        })
                        actions.resetPagination()
                      }}
                    />
                    <span className="font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {(state.attendanceMin !== '' || state.attendanceMax !== '' || state.selectedAbsences.size > 0) && (
              <Button
                variant="link"
                className="h-auto p-0 text-[10px] text-muted-foreground hover:text-foreground inline-flex cursor-pointer"
                onClick={() => {
                  actions.setAttendanceMin('')
                  actions.setAttendanceMax('')
                  actions.setSelectedAbsences(new Set())
                  actions.resetPagination()
                }}
              >
                Xóa lọc chuyên cần
              </Button>
            )}
          </div>
        ),
      }),
      createFilterGroup({
        id: 'homework',
        title: 'Bài tập về nhà',
        options: [],
        defaultOpen: false,
        customContent: (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Khoảng BTVN
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Từ %"
                    value={state.homeworkMin}
                    onChange={(e) => {
                      actions.setHomeworkMin(e.target.value)
                      actions.resetPagination()
                    }}
                    className="w-full h-8 px-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-background text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <span className="text-muted-foreground text-xs font-medium">đến</span>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Đến %"
                    value={state.homeworkMax}
                    onChange={(e) => {
                      actions.setHomeworkMax(e.target.value)
                      actions.resetPagination()
                    }}
                    className="w-full h-8 px-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-background text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Thiếu bài liên tiếp
              </span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  { value: '1', label: 'Thiếu 1 buổi' },
                  { value: '2', label: 'Thiếu 2 buổi liên tiếp' },
                  { value: '3', label: 'Thiếu 3 buổi liên tiếp' },
                  { value: '4+', label: 'Thiếu >= 4 buổi' }
                ].map((opt) => (
                  <label key={opt.value} className="flex cursor-pointer items-center gap-2 rounded-md hover:bg-accent/50 p-1 text-xs select-none">
                    <Checkbox
                      checked={state.selectedHomeworks.has(opt.value)}
                      onCheckedChange={(checked) => {
                        actions.setSelectedHomeworks((prev) => {
                          const next = new Set(prev)
                          if (checked) next.add(opt.value)
                          else next.delete(opt.value)
                          return next
                        })
                        actions.resetPagination()
                      }}
                    />
                    <span className="font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {(state.homeworkMin !== '' || state.homeworkMax !== '' || state.selectedHomeworks.size > 0) && (
              <Button
                variant="link"
                className="h-auto p-0 text-[10px] text-muted-foreground hover:text-foreground inline-flex cursor-pointer"
                onClick={() => {
                  actions.setHomeworkMin('')
                  actions.setHomeworkMax('')
                  actions.setSelectedHomeworks(new Set())
                  actions.resetPagination()
                }}
              >
                Xóa lọc bài tập
              </Button>
            )}
          </div>
        ),
      }),
      createFilterGroup({
        id: 'scores',
        title: 'Điểm đánh giá gần nhất',
        options: [],
        defaultOpen: false,
        customContent: (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Khoảng điểm số
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Từ điểm"
                    value={state.scoreMin}
                    onChange={(e) => {
                      actions.setScoreMin(e.target.value)
                      actions.resetPagination()
                    }}
                    className="w-full h-8 px-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-background text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <span className="text-muted-foreground text-xs font-medium">đến</span>
                <div className="flex-1">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Đến điểm"
                    value={state.scoreMax}
                    onChange={(e) => {
                      actions.setScoreMax(e.target.value)
                      actions.resetPagination()
                    }}
                    className="w-full h-8 px-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-background text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Điểm kém liên tiếp
              </span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  { value: '1', label: 'Kém 1 buổi' },
                  { value: '2', label: 'Kém 2 buổi liên tiếp' },
                  { value: '3', label: 'Kém 3 buổi liên tiếp' },
                  { value: '4+', label: 'Kém >= 4 buổi' }
                ].map((opt) => (
                  <label key={opt.value} className="flex cursor-pointer items-center gap-2 rounded-md hover:bg-accent/50 p-1 text-xs select-none">
                    <Checkbox
                      checked={state.selectedLowScores.has(opt.value)}
                      onCheckedChange={(checked) => {
                        actions.setSelectedLowScores((prev) => {
                          const next = new Set(prev)
                          if (checked) next.add(opt.value)
                          else next.delete(opt.value)
                          return next
                        })
                        actions.resetPagination()
                      }}
                    />
                    <span className="font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {(state.scoreMin !== '' || state.scoreMax !== '' || state.selectedLowScores.size > 0) && (
              <Button
                variant="link"
                className="h-auto p-0 text-[10px] text-muted-foreground hover:text-foreground inline-flex cursor-pointer"
                onClick={() => {
                  actions.setScoreMin('')
                  actions.setScoreMax('')
                  actions.setSelectedLowScores(new Set())
                  actions.resetPagination()
                }}
              >
                Xóa lọc điểm số
              </Button>
            )}
          </div>
        ),
      }),
      createFilterGroup({
        id: 'sessions',
        title: 'Số buổi học còn lại (Thẻ phí)',
        options: [],
        defaultOpen: false,
        customContent: (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Từ buổi"
                  value={state.sessionMin}
                  onChange={(e) => {
                    actions.setSessionMin(e.target.value)
                    actions.resetPagination()
                  }}
                  className="w-full h-8 px-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-background text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <span className="text-muted-foreground text-xs font-medium">đến</span>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Đến buổi"
                  value={state.sessionMax}
                  onChange={(e) => {
                    actions.setSessionMax(e.target.value)
                    actions.resetPagination()
                  }}
                  className="w-full h-8 px-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-background text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>
            {(state.sessionMin !== '' || state.sessionMax !== '') && (
              <Button
                variant="link"
                className="h-auto p-0 text-[10px] text-muted-foreground hover:text-foreground inline-flex cursor-pointer"
                onClick={() => {
                  actions.setSessionMin('')
                  actions.setSessionMax('')
                  actions.resetPagination()
                }}
              >
                Xóa lọc thẻ phí
              </Button>
            )}
          </div>
        ),
      }),
      createFilterGroup({
        id: 'trends',
        title: 'Xu hướng học tập',
        options: [
          { value: 'decline', label: 'Xu hướng giảm (Cần cải thiện)' },
          { value: 'improve', label: 'Xu hướng tăng (Tiến bộ)' },
          { value: 'stable', label: 'Ổn định (Không đổi)' },
        ],
        selectedValues: state.selectedTrends,
        defaultOpen: false,
      }),
      createFilterGroup({
        id: 'callConfirmations',
        title: 'Kết quả chăm sóc',
        options: [
          { value: 'Chưa gọi', label: 'Chưa gọi / Liên hệ' },
          { value: 'Đã gọi', label: 'Đã gọi' },
          { value: 'KNM', label: 'Không nghe máy (KNM)' },
          { value: 'Đã nhắn Zalo', label: 'Đã nhắn Zalo' },
          { value: 'Đã gặp trực tiếp', label: 'Đã gặp trực tiếp' },
          { value: 'Đã tương tác', label: 'Đã tương tác' },
        ],
        selectedValues: state.selectedCalls,
        defaultOpen: true,
      }),
      createFilterGroup({
        id: 'classes',
        title: 'Lớp học',
        options: classList,
        selectedValues: state.selectedClasses,
        defaultOpen: false,
        searchable: true,
        scrollable: true,
      }),
    ]
  }, [
    branchOptions,
    state.selectedBranches,
    state.selectedStatuses,
    state.selectedCareStatuses,
    state.selectedAlerts,
    state.selectedCareTypes,
    state.attendanceMin,
    state.attendanceMax,
    state.homeworkMin,
    state.homeworkMax,
    state.scoreMin,
    state.scoreMax,
    state.sessionMin,
    state.sessionMax,
    state.selectedAbsences,
    state.selectedHomeworks,
    state.selectedLowScores,
    state.selectedTrends,
    state.selectedCalls,
    classList,
    state.selectedClasses,
    state.selectedMonths,
    state.fromDate,
    state.toDate,
    actions,
  ])

  return (
    <FilterGroupSheetPanel
      open={open}
      onOpenChange={onOpenChange}
      title="Bộ lọc nâng cao"
      description="Kết hợp bộ lọc để tìm kiếm học viên chính xác."
      groups={filterGroups}
      onToggle={handleFilterToggle}
      onClearAll={handleClearAllFilters}
      onClearSection={handleClearSection}
    >
      <div className="mb-4">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
          Tìm theo học viên
        </label>
        <input
          type="text"
          placeholder="Nhập tên, SĐT hoặc mã học viên..."
          value={searchQuery}
          onChange={(e) => {
            onSearchQueryChange(e.target.value)
            actions.resetPagination()
          }}
          className="w-full h-9 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-background text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
    </FilterGroupSheetPanel>
  )
}
