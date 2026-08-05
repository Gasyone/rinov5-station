'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { FilterGroupSheetPanel, createFilterGroup, type FilterGroupConfig } from '@/components/filters'
import type { MakeupClassRequest } from '@/mocks/makeupClasses'
import { MakeupClassToolbar } from './MakeupClassToolbar'
import { MakeupClassTableFrame } from './MakeupClassTableFrame'
import { MakeupClassDetailDialog } from './MakeupClassDetailDialog'
import {
  filterMakeupClasses,
  readMakeupClasses,
  getWeekday,
  type MakeupClassUpdater,
} from './makeupClassHelpers'
import { SYSTEM_BRANCHES } from '@/components/controls'
import { MAKEUP_LIFECYCLE_CONFIG } from './makeupClassConstants'
import type { MakeupStatusTileId, MakeupClassFilterState, MakeupResultFilterId } from './makeupClassTypes'

function getUniqueStringValues(requests: MakeupClassRequest[], key: 'branch' | 'program' | 'creator' | 'subject' | 'owner' | 'school'): string[] {
  return [...new Set(requests.map((r) => r[key]).filter(Boolean))] as string[]
}

const EMPTY_FILTERS: MakeupClassFilterState = {
  programs: [],
  creators: [],
  statuses: [],
  subjects: [],
  owners: [],
  schools: [],
  attendanceResults: [],
  weekdays: [],
}

export function MakeupClassScreen() {
  const [state, setState] = useState(readMakeupClasses)
  const [isLoading, setIsLoading] = useState(false)
  const [activeBranch, setActiveBranch] = useState('all')
  const [activeSubject, setActiveSubject] = useState('all')
  const [activeStatus, setActiveStatus] = useState<MakeupStatusTileId>('all')
  const [activeResultFilter, setActiveResultFilter] = useState<MakeupResultFilterId>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<MakeupClassFilterState>(EMPTY_FILTERS)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())

  const [detailId, setDetailId] = useState('')

  const requests = state.requests
  const error = state.error
  const setRequests = (updater: MakeupClassUpdater) => {
    setState((current) => ({
      ...current,
      requests: typeof updater === 'function' ? updater(current.requests) : updater,
    }))
  }

  const branchOptions = SYSTEM_BRANCHES
  const creatorOptions = useMemo(() => getUniqueStringValues(requests, 'creator'), [requests])
  const subjectOptions = useMemo(() => getUniqueStringValues(requests, 'subject'), [requests])
  const ownerOptions = useMemo(() => getUniqueStringValues(requests, 'owner'), [requests])
  const schoolOptions = SYSTEM_BRANCHES

  // Dynamic program options dependent on selected subjects
  const programOptions = useMemo(() => {
    if (filters.subjects.length > 0) {
      return [
        ...new Set(
          requests
            .filter((r) => filters.subjects.includes(r.subject))
            .map((r) => r.program)
            .filter(Boolean)
        ),
      ]
    }
    return getUniqueStringValues(requests, 'program')
  }, [requests, filters.subjects])

  const filtered = useMemo(
    () => filterMakeupClasses(requests, searchTerm, activeBranch, activeStatus, filters, activeSubject, activeResultFilter),
    [requests, searchTerm, activeBranch, activeStatus, filters, activeSubject, activeResultFilter]
  )

  const reloadRequests = () => {
    setIsLoading(true)
    setTimeout(() => {
      setState(readMakeupClasses())
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
    filters.attendanceResults.length +
    filters.weekdays.length

  const detailRequest = requests.find((r) => r.id === detailId) ?? null

  const filterGroups = useMemo<FilterGroupConfig[]>(
    () => [
      createFilterGroup({
        id: 'schools',
        title: 'Cơ sở',
        options: schoolOptions,
        selectedValues: filters.schools,
        getOptionCount: (school) => requests.filter((r) => r.school === school || r.branch === school).length,
      }),
      createFilterGroup({
        id: 'statuses',
        title: 'Trạng thái phiếu',
        options: MAKEUP_LIFECYCLE_CONFIG.map((s) => ({
          value: s.id,
          label: s.label,
          count: requests.filter((r) => r.status === s.id).length,
        })),
        selectedValues: filters.statuses,
      }),
      createFilterGroup({
        id: 'attendanceResults',
        title: 'Kết quả điểm danh',
        options: [
          { value: 'co_mat', label: 'Có mặt / Đã điểm danh', count: requests.filter((r) => (r.attendanceStatus === 'Có mặt' || r.attendanceStatus === 'Đã điểm danh' || r.status === 'completed')).length },
          { value: 'da_vang', label: 'Vắng mặt', count: requests.filter((r) => (r.attendanceStatus === 'Vắng mặt' || r.status === 'da_vang')).length },
          { value: 'chua_diem_danh', label: 'Chưa điểm danh', count: requests.filter((r) => (!r.attendanceStatus || r.attendanceStatus === 'Chưa điểm danh') && r.status !== 'completed' && r.status !== 'da_vang').length },
        ],
        selectedValues: filters.attendanceResults,
      }),
      createFilterGroup({
        id: 'subjects',
        title: 'Môn học',
        options: subjectOptions,
        selectedValues: filters.subjects,
        getOptionCount: (subject) => requests.filter((r) => r.subject === subject).length,
      }),
      createFilterGroup({
        id: 'programs',
        title: 'Chương trình',
        options: programOptions,
        selectedValues: filters.programs,
        getOptionCount: (program) => requests.filter((r) => r.program === program).length,
      }),
      createFilterGroup({
        id: 'owners',
        title: 'Người phụ trách',
        options: ownerOptions,
        selectedValues: filters.owners,
        getOptionCount: (owner) => requests.filter((r) => r.owner === owner).length,
      }),
      createFilterGroup({
        id: 'creators',
        title: 'Nguồn tạo',
        options: creatorOptions,
        selectedValues: filters.creators,
        getOptionCount: (creator) => requests.filter((r) => r.creator === creator).length,
      }),
      createFilterGroup({
        id: 'weekdays',
        title: 'Thứ trong tuần',
        options: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
        selectedValues: filters.weekdays,
        getOptionCount: (abbr) => requests.filter((r) => getWeekday(r.originalSessionDate) === abbr || (r.makeupSessionDate && getWeekday(r.makeupSessionDate) === abbr)).length,
      }),
    ],
    [schoolOptions, subjectOptions, programOptions, ownerOptions, creatorOptions, requests, filters]
  )

  const toggleArrayFilter = (key: keyof MakeupClassFilterState, value: string) => {
    setPage(1)
    setFilters((current) => {
      const arr = (current[key] || []) as string[]
      return {
        ...current,
        [key]: arr.includes(value) ? arr.filter((v: string) => v !== value) : [...arr, value],
      }
    })
  }

  const handleApprove = (requestId: string) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
    setRequests((current) =>
      current.map((r) => {
        if (r.id !== requestId) return r
        return {
          ...r,
          status: 'da_xep_lich',
          auditLog: [
            ...r.auditLog,
            { timestamp: now, author: 'Người dùng hiện tại', action: 'Duyệt phiếu bù' },
          ],
        }
      })
    )
    toast.success('Đã duyệt phiếu học bù')
  }

  const handleReject = (requestId: string) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
    setRequests((current) =>
      current.map((r) => {
        if (r.id !== requestId) return r
        return {
          ...r,
          status: 'tu_choi',
          auditLog: [
            ...r.auditLog,
            { timestamp: now, author: 'Người dùng hiện tại', action: 'Từ chối phiếu bù' },
          ],
        }
      })
    )
    toast.success('Đã từ chối phiếu học bù')
  }

  const handleCancel = (requestId: string) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
    setRequests((current) =>
      current.map((r) => {
        if (r.id !== requestId) return r
        return {
          ...r,
          status: 'cancelled',
          auditLog: [
            ...r.auditLog,
            { timestamp: now, author: 'Người dùng hiện tại', action: 'Hủy phiếu bù' },
          ],
        }
      })
    )
    toast.success('Đã hủy phiếu học bù')
  }

  const handleMarkCompleted = (requestId: string) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
    setRequests((current) =>
      current.map((r) => {
        if (r.id !== requestId) return r
        return {
          ...r,
          status: 'completed',
          auditLog: [
            ...r.auditLog,
            { timestamp: now, author: 'Người dùng hiện tại', action: 'Đánh dấu hoàn thành' },
          ],
        }
      })
    )
    toast.success('Đã đánh dấu hoàn thành buổi bù')
  }

  const handleMarkAbsent = (requestId: string) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
    setRequests((current) =>
      current.map((r) => {
        if (r.id !== requestId) return r
        return {
          ...r,
          status: 'da_vang',
          auditLog: [
            ...r.auditLog,
            { timestamp: now, author: 'Người dùng hiện tại', action: 'Đánh dấu vắng mặt' },
          ],
        }
      })
    )
    toast.success('Đã đánh dấu vắng mặt buổi bù')
  }

  const handleAssignSession = (
    requestId: string,
    session: import('@/components/screens/trial-class/trialClassTypes').TrialSessionSelection,
    notes: string
  ) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
    setRequests((current) =>
      current.map((r) => {
        if (r.id !== requestId) return r
        return {
          ...r,
          makeupClassName: session.className,
          makeupClassId: session.classId,
          makeupSessionName: session.sessionName,
          makeupSessionDate: session.trialDate,
          attendanceStatus: 'Đã điểm danh',
          status: 'da_xep_lich',
          exchangeNotes: notes || r.exchangeNotes,
          auditLog: [
            ...r.auditLog,
            {
              timestamp: now,
              author: 'Người dùng hiện tại',
              action: 'Ghép / Đổi buổi học bù',
              detail: `Xếp vào ${session.className} - ${session.sessionName} (${session.trialDate})`,
            },
          ],
        }
      })
    )
    toast.success(`Đã ghép vào lớp ${session.className} (${session.sessionName})`)
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <MakeupClassToolbar
        activeBranch={activeBranch}
        activeSubject={activeSubject}
        activeStatus={activeStatus}
        activeResultFilter={activeResultFilter}
        searchTerm={searchTerm}
        branchOptions={branchOptions}
        baseForStatus={requests}
        activeFilterCount={activeFilterCount}
        onBranchChange={(branch) => { setActiveBranch(branch); setPage(1) }}
        onSubjectChange={(subject) => { setActiveSubject(subject); setPage(1) }}
        onStatusChange={(status) => { setActiveStatus(status); setActiveResultFilter('all'); setPage(1) }}
        onResultFilterChange={(filter) => { setActiveResultFilter(filter); setActiveStatus('all'); setPage(1) }}
        onSearchChange={(value) => { setSearchTerm(value); setPage(1) }}
        onOpenFilters={() => setIsFilterOpen(true)}
      />

      <div className="min-h-0 flex-1 overflow-hidden px-3 pb-3 pt-2 lg:px-3 lg:pb-3">
        <MakeupClassTableFrame
          loading={isLoading}
          error={error?.message ?? null}
          requests={paged}
          selectedIds={selectedIds}
          currentPage={currentPage}
          total={filtered.length}
          pageSize={pageSize}
          onRetry={reloadRequests}
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
          onRowClick={setDetailId}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>

      <FilterGroupSheetPanel
        open={isFilterOpen}
        groups={filterGroups}
        description="Kết hợp bộ lọc theo trường, trạng thái, môn học, chương trình, người phụ trách và nguồn tạo."
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          toggleArrayFilter(sectionId as keyof MakeupClassFilterState, value)
        }}
        onClearAll={() => {
          setFilters(EMPTY_FILTERS)
          setPage(1)
        }}
      />

      <MakeupClassDetailDialog
        request={detailRequest}
        onOpenChange={(open) => { if (!open) setDetailId('') }}
        onApprove={handleApprove}
        onReject={handleReject}
        onCancel={handleCancel}
        onMarkCompleted={handleMarkCompleted}
        onMarkAbsent={handleMarkAbsent}
        onAssignSession={handleAssignSession}
      />
    </div>
  )
}
