'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { FilterGroupSheetPanel, createFilterGroup, type FilterGroupConfig } from '@/components/filters'
import type { TrialClass } from '@/mocks/trialClasses'
import { TrialClassToolbar } from './TrialClassToolbar'
import { TrialClassTableFrame } from './TrialClassTableFrame'
import { TrialClassDetailDialog } from './TrialClassDetailDialog'
import { TrialClassAssignDialog } from './TrialClassAssignDialog'
import {
  filterTrialClasses,
  readTrialClasses,
  type TrialClassUpdater,
  getWeekdayLabel,
} from './trialClassHelpers'
import { SYSTEM_BRANCHES } from '@/components/controls'
import { STATUS_CONFIG } from './trialClassConstants'
import type { AssignDialogMode, StatusTileId, TrialSessionSelection, TrialClassFilterState } from './trialClassTypes'

function getUniqueStringValues(trials: TrialClass[], key: 'branch' | 'program' | 'creator' | 'subject' | 'owner' | 'school'): string[] {
  return [...new Set(trials.map((t) => t[key]).filter(Boolean))] as string[]
}

export function TrialClassScreen() {
  const [trialState, setTrialState] = useState(readTrialClasses)
  const [isLoading, setIsLoading] = useState(false)
  const [activeBranch, setActiveBranch] = useState('all')
  const [activeStatus, setActiveStatus] = useState<StatusTileId>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<TrialClassFilterState>({
    programs: [],
    creators: [],
    statuses: [],
    subjects: [],
    owners: [],
    schools: [],
    weekdays: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [copiedKey, setCopiedKey] = useState('')

  const [detailTrialId, setDetailTrialId] = useState('')
  const [assignMode, setAssignMode] = useState<AssignDialogMode>({ mode: 'closed' })

  const trials = trialState.trials
  const error = trialState.error
  const setTrials = (updater: TrialClassUpdater) => {
    setTrialState((current) => ({
      ...current,
      trials: typeof updater === 'function' ? updater(current.trials) : updater,
    }))
  }

  const branchOptions = SYSTEM_BRANCHES
  const programOptions = useMemo(() => getUniqueStringValues(trials, 'program'), [trials])
  const creatorOptions = useMemo(() => getUniqueStringValues(trials, 'creator'), [trials])
  const subjectOptions = useMemo(() => getUniqueStringValues(trials, 'subject'), [trials])
  const ownerOptions = useMemo(() => getUniqueStringValues(trials, 'owner'), [trials])
  const schoolOptions = SYSTEM_BRANCHES

  const weekdayOptions = useMemo(() => {
    const days = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật']
    return days.map((day) => ({
      value: day,
      label: day,
      count: trials.filter((t) => t.sessions.length > 0 && getWeekdayLabel(t.sessions[0].trialDate) === day).length,
      checked: filters.weekdays?.includes(day) ?? false,
    }))
  }, [trials, filters.weekdays])

  const filtered = useMemo(
    () => filterTrialClasses(trials, searchTerm, activeBranch, activeStatus, filters),
    [trials, searchTerm, activeBranch, activeStatus, filters]
  )

  const reloadTrials = () => {
    setIsLoading(true)
    setTimeout(() => {
      setTrialState(readTrialClasses())
      setIsLoading(false)
    }, 500)
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const activeFilterCount =
    filters.programs.length +
    filters.creators.length +
    filters.statuses.length +
    filters.subjects.length +
    filters.owners.length +
    filters.schools.length +
    filters.weekdays.length

  const detailTrial = trials.find((t) => t.id === detailTrialId) ?? null

  const filterGroups = useMemo<FilterGroupConfig[]>(
    () => [
      createFilterGroup({
        id: 'schools',
        options: schoolOptions,
        selectedValues: filters.schools,
        getOptionCount: (school) => trials.filter((t) => t.school === school).length,
      }),
      createFilterGroup({
        id: 'statuses',
        options: STATUS_CONFIG.map((status) => ({
          value: status.id,
          label: status.label,
          count: trials.filter((t) => t.status === status.id).length,
        })),
        selectedValues: filters.statuses,
      }),
      createFilterGroup({
        id: 'weekdays',
        options: weekdayOptions,
        selectedValues: filters.weekdays,
      }),
      createFilterGroup({
        id: 'subjects',
        options: subjectOptions,
        selectedValues: filters.subjects,
        getOptionCount: (subject) => trials.filter((t) => t.subject === subject).length,
      }),
      createFilterGroup({
        id: 'programs',
        options: programOptions,
        selectedValues: filters.programs,
        getOptionCount: (program) => trials.filter((t) => t.program === program).length,
      }),
      createFilterGroup({
        id: 'owners',
        options: ownerOptions,
        selectedValues: filters.owners,
        getOptionCount: (owner) => trials.filter((t) => t.owner === owner).length,
      }),
      createFilterGroup({
        id: 'creators',
        title: 'Sale',
        options: creatorOptions,
        selectedValues: filters.creators,
        getOptionCount: (creator) => trials.filter((t) => t.creator === creator).length,
        searchable: true,
        scrollable: true,
      }),
    ],
    [schoolOptions, subjectOptions, programOptions, ownerOptions, creatorOptions, weekdayOptions, trials, filters]
  )

  const toggleArrayFilter = (key: keyof TrialClassFilterState, value: string) => {
    setPage(1)
    setFilters((current) => {
      const arr = (current[key] || []) as string[]
      return {
        ...current,
        [key]: arr.includes(value) ? arr.filter((v: string) => v !== value) : [...arr, value],
      }
    })
  }

  const handleUpdateTrial = (trialId: string, updater: (trial: TrialClass) => TrialClass) => {
    setTrials((current) => current.map((t) => (t.id === trialId ? updater(t) : t)))
    toast.success('Đã cập nhật')
  }

  const handleApprove = (trialId: string) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
    setTrials((current) =>
      current.map((t) => {
        if (t.id !== trialId) return t
        return {
          ...t,
          status: 'confirmed',
          auditLog: [
            ...t.auditLog,
            { timestamp: now, author: 'Người dùng hiện tại', action: 'Chấp thuận ghép lớp' },
          ],
        }
      })
    )
    toast.success('Đã chấp thuận học thử vào lớp thành công')
  }

  const handleReject = (trialId: string) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
    setTrials((current) =>
      current.map((t) => {
        if (t.id !== trialId) return t
        return {
          ...t,
          sessions: [],
          status: 'rejected',
          auditLog: [
            ...t.auditLog,
            { timestamp: now, author: 'Người dùng hiện tại', action: 'Từ chối ghép lớp', detail: 'Giải phóng lớp đã chọn' },
          ],
        }
      })
    )
    toast.success('Đã từ chối ghép lớp và giải phóng lịch học')
  }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(''), 2000)
    toast.success('Đã sao chép')
  }

  const handleAssign = (trialId: string, sessions: TrialSessionSelection[], notes: string, rescheduleReason?: string) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
    setTrials((current) =>
      current.map((t) => {
        if (t.id !== trialId) return t
        const previousSession = t.sessions.length > 0 ? t.sessions[0] : t.previousSession
        return {
          ...t,
          sessions: sessions.map((s) => ({
            classId: s.classId,
            className: s.className,
            sessionId: s.sessionId,
            sessionName: s.sessionName,
            trialDate: s.trialDate,
          })),
          status: 'confirmed' as const,
          previousSession: rescheduleReason ? previousSession : t.previousSession,
          auditLog: [
            ...t.auditLog,
            {
              timestamp: now,
              author: 'Người dùng hiện tại',
              action: rescheduleReason ? `Đổi buổi học (${rescheduleReason})` : 'Ghép lớp học thử',
              detail: notes || undefined,
            },
          ],
        }
      })
    )
    setAssignMode({ mode: 'closed' })
    toast.success(rescheduleReason ? 'Đã đổi buổi học thành công' : 'Đã ghép lớp thành công')
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <TrialClassToolbar
        activeBranch={activeBranch}
        activeStatus={activeStatus}
        searchTerm={searchTerm}
        branchOptions={branchOptions}
        baseForStatus={trials}
        activeFilterCount={activeFilterCount}
        onBranchChange={(branch) => { setActiveBranch(branch); setPage(1) }}
        onStatusChange={(status) => { setActiveStatus(status); setPage(1) }}
        onSearchChange={(value) => { setSearchTerm(value); setPage(1) }}
        onOpenFilters={() => setIsFilterOpen(true)}
      />

      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-2 lg:px-6 lg:pb-6">
        <TrialClassTableFrame
          loading={isLoading}
          error={error?.message ?? null}
          trials={paged}
          selectedIds={selectedIds}
          copiedKey={copiedKey}
          currentPage={currentPage}
          total={filtered.length}
          pageSize={pageSize}
          onRetry={reloadTrials}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onToggleAll={(checked, ids) => {
            setSelectedIds(checked ? new Set(ids) : new Set())
          }}
          onToggleOne={(id, checked) => {
            setSelectedIds((current) => {
              const next = new Set(current)
              if (checked) {
                next.add(id)
              } else {
                next.delete(id)
              }
              return next
            })
          }}
          onRowClick={setDetailTrialId}
          onCopy={handleCopy}
          onOpenAssignReschedule={(id) => {
            setAssignMode({ mode: 'reschedule', trialId: id })
          }}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>

      <FilterGroupSheetPanel
        open={isFilterOpen}
        groups={filterGroups}
        description="Kết hợp bộ lọc theo trường, trạng thái, ngày trong tuần, môn học, chương trình, người phụ trách và sale."
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          toggleArrayFilter(sectionId as keyof TrialClassFilterState, value)
        }}
        onClearAll={() => {
          setFilters({
            programs: [],
            creators: [],
            statuses: [],
            subjects: [],
            owners: [],
            schools: [],
            weekdays: [],
          })
          setPage(1)
        }}
      />

      <TrialClassDetailDialog
        trial={detailTrial}
        onOpenChange={(open) => { if (!open) setDetailTrialId('') }}
        onCopy={handleCopy}
        copiedKey={copiedKey}
        onOpenAssign={(mode) => setAssignMode(mode)}
        onRequestReschedule={() => {}}
        onUpdateTrial={handleUpdateTrial}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <TrialClassAssignDialog
        mode={assignMode}
        trial={assignMode.mode !== 'closed' ? trials.find((t) => t.id === assignMode.trialId) ?? null : null}
        onOpenChange={(open) => { if (!open) setAssignMode({ mode: 'closed' }) }}
        onAssign={handleAssign}
      />
    </div>
  )
}
