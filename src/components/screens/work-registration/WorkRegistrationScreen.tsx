'use client'

import { useMemo, useState } from 'react'
import { DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { FilterGroupSheetPanel } from '@/components/filters'
import { ConfirmDialog } from '@/components/shared'
import {
  DEFAULT_WORK_PRIORITY_RULES,
  getMockWorkRegistrations,
  getWorkRegistrationEmployees,
  getWorkWeekDays,
  getWorkWeekStart,
  isPriorityWorkSlot,
  toWorkDateKey,
  type WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import { useAuthStore } from '@/stores/useAuthStore'
import { toast } from 'sonner'
import type { ShiftSection } from '@/mocks/shiftRoster'
import {
  addWorkTimeRange,
  clearWorkRegistrationWeek,
  removeWorkSlots,
  submitWorkRegistration,
  toggleWorkSection,
  upsertWorkSlot,
} from './workRegistrationActions'
import { WorkRegistrationCenterOverview } from './WorkRegistrationCenterOverview'
import { WorkRegistrationEditablePanel } from './WorkRegistrationEditablePanel'
import { WorkRegistrationHolidayPanel } from './WorkRegistrationHolidayPanel'
import { WorkRegistrationMasterRosterPanel } from './WorkRegistrationMasterRosterPanel'
import { WorkRegistrationSlotDetailDialog } from './WorkRegistrationSlotDetailDialog'
import { WorkRegistrationStaffPanel } from './WorkRegistrationStaffPanel'
import { WorkRegistrationToolbar } from './WorkRegistrationToolbar'
import { WorkRegistrationWarningDialog } from './WorkRegistrationWarningDialog'
import {
  buildBranchSummaries,
  buildEmployeeSummaries,
  filterEmployeeSummaries,
  getEmployeeWeekRecords,
  getRecordsForWeek,
  getSlot,
  resolveWeekActionState,
  sumRegistrationMinutes,
} from './workRegistrationHelpers'
import type { SlotDetailTarget, WorkRegistrationStatusFilter, WorkRegistrationTab } from './workRegistrationTypes'
import { buildFilterGroups, resolveCurrentEmployeeId, slotDetailDescription } from './workRegistrationViewHelpers'

export function WorkRegistrationScreen() {
  const userRole = useAuthStore((state) => state.user?.role)
  const employees = useMemo(() => getWorkRegistrationEmployees(), [])
  const initialWeek = useMemo(() => getWorkWeekStart(new Date()), [])
  const [weekStart] = useState(initialWeek)
  const [records, setRecords] = useState<WorkRegistrationRecord[]>(() => getMockWorkRegistrations(initialWeek))
  const priorityRules = DEFAULT_WORK_PRIORITY_RULES
  const [activeTab, setActiveTab] = useState<WorkRegistrationTab>('mine')
  const [activeBranch, setActiveBranch] = useState(employees[0]?.branch ?? 'all')
  const [search, setSearch] = useState('')
  const [jobTitles, setJobTitles] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<WorkRegistrationStatusFilter>('all')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const [warningsOpen, setWarningsOpen] = useState(false)
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false)
  const [delegateEmployeeId, setDelegateEmployeeId] = useState<string>()
  const [slotDetail, setSlotDetail] = useState<SlotDetailTarget | null>(null)
  const [branchDetail, setBranchDetail] = useState<{ branch: string; date?: string; dayLabel?: string } | null>(null)
  const [staffPage, setStaffPage] = useState(1)
  const [staffPageSize, setStaffPageSize] = useState(50)
  const [centerPage, setCenterPage] = useState(1)
  const [centerPageSize, setCenterPageSize] = useState(DEFAULT_PAGE_SIZE)

  const todayKey = toWorkDateKey(new Date())
  const currentWeekStart = useMemo(() => getWorkWeekStart(new Date()), [])
  const weekDays = useMemo(() => getWorkWeekDays(weekStart), [weekStart])
  const branches = useMemo(
    () => Array.from(new Set(employees.map((employee) => employee.branch))).sort(),
    [employees]
  )
  const subjects = useMemo(
    () => Array.from(new Set(employees.flatMap((employee) => employee.subjects ?? []))).sort(),
    [employees]
  )
  const currentEmployeeId = resolveCurrentEmployeeId(userRole)
  const activeEmployeeId = activeTab === 'staff' && delegateEmployeeId ? delegateEmployeeId : currentEmployeeId
  const activeEmployee = employees.find((employee) => employee.id === activeEmployeeId) ?? employees[0]!

  const employeeSummaries = useMemo(
    () => buildEmployeeSummaries(employees, records, weekStart),
    [employees, records, weekStart]
  )
  const filteredSummaries = useMemo(
    () =>
      filterEmployeeSummaries(employeeSummaries, {
        branch: activeBranch,
        jobTitles,
        subject: subjectFilter,
        status: statusFilter,
        search,
      }),
    [activeBranch, employeeSummaries, jobTitles, search, statusFilter, subjectFilter]
  )
  const filterGroups = useMemo(
    () => buildFilterGroups(employeeSummaries, jobTitles, statusFilter, subjectFilter),
    [employeeSummaries, jobTitles, statusFilter, subjectFilter]
  )

  const visibleStaffIds = useMemo(
    () => new Set(filteredSummaries.map((summary) => summary.employee.id)),
    [filteredSummaries]
  )
  const weekRecords = useMemo(() => getRecordsForWeek(records, weekStart), [records, weekStart])
  const activeEmployeeRecords = useMemo(
    () => getEmployeeWeekRecords(records, activeEmployee.id, weekStart),
    [activeEmployee.id, records, weekStart]
  )
  const staffGridRecords = delegateEmployeeId
    ? activeEmployeeRecords
    : weekRecords.filter((record) => visibleStaffIds.has(record.employeeId))
  const centerSummaries = useMemo(
    () => buildBranchSummaries(employees, records, weekStart, activeTab === 'center' ? 'all' : activeBranch, priorityRules),
    [activeTab, activeBranch, employees, priorityRules, records, weekStart]
  )

  const priorityMinutes = activeEmployeeRecords
    .filter((record) => isPriorityWorkSlot(record.date, record.slotId, priorityRules))
    .reduce((total, record) => total + (getSlot(record.slotId)?.minutes ?? 0), 0)
  const slotDetailRecords = slotDetail
    ? weekRecords.filter((record) =>
        record.date === slotDetail.date &&
        record.slotId === slotDetail.slotId &&
        (!slotDetail.branch || record.branch === slotDetail.branch)
      )
    : []
  const branchDetailRecords = branchDetail
    ? weekRecords.filter((record) => record.branch === branchDetail.branch && (!branchDetail.date || record.date === branchDetail.date))
    : []
  const detailRecords = branchDetail ? branchDetailRecords : slotDetailRecords
  const actionState = useMemo(
    () => resolveWeekActionState(activeEmployeeRecords, weekStart, currentWeekStart),
    [activeEmployeeRecords, currentWeekStart, weekStart]
  )

  const handleSetSlot = (date: string, slotId: string, selected: boolean) => {
    if (!activeEmployee || !actionState.canMutate) return
    setRecords((current) =>
      upsertWorkSlot(current, activeEmployee, toWorkDateKey(weekStart), date, slotId, selected)
    )
  }

  const handleToggleSection = (date: string, section: ShiftSection) => {
    if (!activeEmployee || !actionState.canMutate) return
    setRecords((current) =>
      toggleWorkSection(current, activeEmployee, toWorkDateKey(weekStart), date, section)
    )
  }

  const handleAddRange = (
    dates: string[],
    startTime: string,
    endTime: string,
    multipleRanges?: Array<{ startTime: string; endTime: string }>
  ) => {
    if (!activeEmployee || !actionState.canMutate) return
    if (multipleRanges && multipleRanges.length > 0) {
      let updated = records
      for (const r of multipleRanges) {
        updated = addWorkTimeRange(updated, activeEmployee, toWorkDateKey(weekStart), dates, r.startTime, r.endTime)
      }
      setRecords(updated)
      toast.success(`Đã thêm ${multipleRanges.length} ca làm việc cho ${dates.length} ngày`)
    } else {
      setRecords((current) =>
        addWorkTimeRange(current, activeEmployee, toWorkDateKey(weekStart), dates, startTime, endTime)
      )
      toast.success(`Đã thêm khung giờ ${startTime} - ${endTime}`)
    }
  }

  const handleRemoveSlots = (date: string, slotIds: string[]) => {
    if (!activeEmployee || !actionState.canMutate) return
    setRecords((current) => removeWorkSlots(current, activeEmployee.id, date, slotIds))
    toast.info('Đã xóa khung giờ làm việc')
  }

  const submitActiveRegistration = () => {
    if (!actionState.canMutate) return
    const draftCount = activeEmployeeRecords.filter((r) => r.status === 'draft').length
    setRecords((current) =>
      submitWorkRegistration(current, activeEmployee.id, toWorkDateKey(weekStart))
    )
    if (draftCount > 0) {
      toast.success(`Đã cập nhật và lưu thành công lịch đăng ký mới cho ${activeEmployee.name}!`)
    } else {
      toast.success(`Đã cập nhật lịch làm việc cho ${activeEmployee.name}!`)
    }
  }

  const clearActiveWeek = () => {
    if (!actionState.canMutate) return
    setRecords((current) =>
      clearWorkRegistrationWeek(current, activeEmployee.id, toWorkDateKey(weekStart))
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <WorkRegistrationToolbar
        activeTab={activeTab}
        branches={branches}
        subjects={subjects}
        activeBranch={activeBranch}
        subjectFilter={subjectFilter}
        search={search}
        onTabChange={(tab) => {
          setActiveTab(tab)
          if (tab !== 'staff') setDelegateEmployeeId(undefined)
        }}
        onBranchChange={(branch) => { setActiveBranch(branch); setCenterPage(1) }}
        onSubjectChange={(subject) => {
          setSubjectFilter(subject)
          setStaffPage(1)
        }}
        onSearchChange={setSearch}
        onOpenWarnings={() => setWarningsOpen(true)}
      />

      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden px-3 pb-3 lg:px-3 lg:pb-3">
        {activeTab === 'mine' ? (
          <WorkRegistrationEditablePanel
            weekDays={weekDays}
            records={activeEmployeeRecords}
            employees={employees}
            activeEmployeeId={activeEmployee.id}
            activeEmployeeName={activeEmployee.name}
            todayKey={todayKey}
            totalMinutes={sumRegistrationMinutes(activeEmployeeRecords)}
            readonlyWeek={actionState.readonlyWeek}
            priorityRules={priorityRules}
            canMutate={actionState.canMutate}
            primaryActionLabel={actionState.primaryActionLabel}
            actionHelperText={actionState.actionHelperText}
            onAddRange={handleAddRange}
            onRemoveSlots={handleRemoveSlots}
            onToggleSection={handleToggleSection}
            onSubmit={submitActiveRegistration}
          />
        ) : null}

        {activeTab === 'roster' ? (
          <WorkRegistrationMasterRosterPanel
            activeBranch={activeBranch === 'all' ? branches[0] || 'RinoEdu Nguyễn Tuân' : activeBranch}
            searchQuery={search}
            weekDays={weekDays}
            records={records}
          />
        ) : null}

        {activeTab === 'staff' ? (
          <WorkRegistrationStaffPanel
            filteredSummaries={filteredSummaries}
            delegateEmployeeId={delegateEmployeeId}
            activeEmployeeName={activeEmployee.name}
            weekDays={weekDays}
            records={staffGridRecords}
            employees={employees}
            todayKey={todayKey}
            page={staffPage}
            pageSize={staffPageSize}
            totalMinutes={sumRegistrationMinutes(activeEmployeeRecords)}
            priorityMinutes={priorityMinutes}
            readonlyWeek={actionState.readonlyWeek}
            priorityRules={priorityRules}
            canMutate={actionState.canMutate}
            primaryActionLabel={actionState.primaryActionLabel}
            actionHelperText={actionState.actionHelperText}
            onPageChange={setStaffPage}
            onPageSizeChange={setStaffPageSize}
            onSetDelegateEmployee={(id) => {
              setDelegateEmployeeId(id)
            }}
            onToggleSection={handleToggleSection}
            onRemoveSlots={handleRemoveSlots}
            onAddRange={handleAddRange}
            onSetSlot={handleSetSlot}
            onOpenSlotDetail={(date, slotId) => setSlotDetail({ date, slotId })}
            onClear={() => setClearConfirmOpen(true)}
            onSubmit={submitActiveRegistration}
          />
        ) : null}

        {activeTab === 'center' ? (
          <WorkRegistrationCenterOverview
            summaries={centerSummaries}
            page={centerPage}
            pageSize={centerPageSize}
            onPageChange={setCenterPage}
            onPageSizeChange={setCenterPageSize}
            onOpenBranch={(branch) => setBranchDetail({ branch })}
            onOpenBranchDay={(branch, date, dayLabel) => setBranchDetail({ branch, date, dayLabel })}
          />
        ) : null}

        {activeTab === 'holidays' ? (
          <WorkRegistrationHolidayPanel
            activeBranch={activeBranch}
            branches={branches}
          />
        ) : null}
      </div>

      <FilterGroupSheetPanel
        open={filterOpen}
        title="Bộ lọc đăng ký nhân viên"
        description="Lọc nhân viên theo chức danh và trạng thái đăng ký."
        groups={filterGroups}
        onOpenChange={setFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'jobTitles') {
            setJobTitles((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value])
          }
          if (sectionId === 'statuses') {
            setStatusFilter((current) => current === value ? 'all' : value as WorkRegistrationStatusFilter)
          }
          if (sectionId === 'subjects') {
            setSubjectFilter((current) => current === value ? 'all' : value)
          }
          setStaffPage(1)
        }}
        onClearAll={() => {
          setJobTitles([])
          setStatusFilter('all')
          setSubjectFilter('all')
          setStaffPage(1)
        }}
      />
      <WorkRegistrationWarningDialog open={warningsOpen} onOpenChange={setWarningsOpen} />
      <WorkRegistrationSlotDetailDialog
        open={Boolean(slotDetail || branchDetail)}
        title={branchDetail?.branch ?? 'Đăng ký theo khung giờ'}
        description={branchDetail ? branchDetail.dayLabel : slotDetailDescription(slotDetail)}
        records={detailRecords}
        employees={employees}
        onOpenChange={(open) => {
          if (!open) {
            setSlotDetail(null)
            setBranchDetail(null)
          }
        }}
      />
      <ConfirmDialog
        open={clearConfirmOpen}
        onOpenChange={setClearConfirmOpen}
        variant="destructive"
        title="Xóa đăng ký tuần?"
        description={`Thao tác này xóa các khung giờ có thể chỉnh sửa của ${activeEmployee.name}. Khung giờ đã khóa vẫn giữ nguyên.`}
        confirmLabel="Xóa tuần"
        onConfirm={clearActiveWeek}
      />
    </div>
  )
}
