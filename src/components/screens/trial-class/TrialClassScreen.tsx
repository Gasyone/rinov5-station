'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { FilterSheetPanel, type FilterSection } from '@/components/filters'
import { mockStudents } from '@/mocks/students'
import { nextTrialId, type TrialClass } from '@/mocks/trialClasses'
import { TrialClassToolbar } from './TrialClassToolbar'
import { TrialClassTableFrame } from './TrialClassTableFrame'
import { TrialClassCreateDialog } from './TrialClassCreateDialog'
import { TrialClassDetailDialog } from './TrialClassDetailDialog'
import { TrialClassAssignDialog } from './TrialClassAssignDialog'
import {
  applyTrialAssignment,
  applyTrialReschedule,
  buildEmptyCreateForm,
  buildTrialFromCreateForm,
  filterTrialClasses,
  readTrialClasses,
  type TrialClassUpdater,
} from './trialClassHelpers'
import type { AssignDialogMode, CreateTrialClassForm, StatusTileId } from './trialClassTypes'

function getUniqueStringValues(trials: TrialClass[], key: 'branch' | 'program' | 'creator'): string[] {
  return [...new Set(trials.map((t) => t[key]).filter(Boolean))]
}

interface TrialClassFilterOnly {
  programs: string[]
  creators: string[]
}

export function TrialClassScreen() {
  const [trialState, setTrialState] = useState(readTrialClasses)
  const [isLoading, setIsLoading] = useState(false)
  const [activeBranch, setActiveBranch] = useState('all')
  const [activeStatus, setActiveStatus] = useState<StatusTileId>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<TrialClassFilterOnly>({
    programs: [],
    creators: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [copiedKey, setCopiedKey] = useState('')

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState<CreateTrialClassForm>(buildEmptyCreateForm)
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

  const branchOptions = useMemo(() => getUniqueStringValues(trials, 'branch'), [trials])
  const programOptions = useMemo(() => getUniqueStringValues(trials, 'program'), [trials])
  const creatorOptions = useMemo(() => getUniqueStringValues(trials, 'creator'), [trials])
  
  const studentOptions = useMemo(
    () =>
      mockStudents.map((student) => ({
        id: student.id,
        label: student.name,
        familyName: student.parentName || `Gia đình ${student.name}`,
        phone: student.parentPhone || student.phone || '',
        avatar: student.avatar || '',
      })),
    []
  )

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

  const activeFilterCount = filters.programs.length + filters.creators.length

  const detailTrial = trials.find((t) => t.id === detailTrialId) ?? null
  const assignTrial = assignMode.mode !== 'closed'
    ? trials.find((t) => t.id === assignMode.trialId) ?? null
    : null

  const filterSections = useMemo<FilterSection[]>(
    () => [
      {
        id: 'programs',
        title: 'Chương trình',
        options: programOptions.map((p) => ({
          value: p,
          label: p,
          count: trials.filter((t) => t.program === p).length,
          checked: filters.programs.includes(p),
        })),
      },
      {
        id: 'creators',
        title: 'Người tạo',
        options: creatorOptions.map((c) => ({
          value: c,
          label: c,
          count: trials.filter((t) => t.creator === c).length,
          checked: filters.creators.includes(c),
        })),
      },
    ],
    [programOptions, creatorOptions, trials, filters]
  )

  const toggleArrayFilter = (key: 'programs' | 'creators', value: string) => {
    setPage(1)
    setFilters((current) => {
      const arr = current[key] as string[]
      return {
        ...current,
        [key]: arr.includes(value) ? arr.filter((v: string) => v !== value) : [...arr, value],
      }
    })
  }

  const handleCreate = () => {
    setCreateForm(buildEmptyCreateForm())
    setIsCreateOpen(true)
  }

  const handleSubmitCreate = () => {
    if (!createForm.studentName || !createForm.school || !createForm.program) {
      toast.error('Vui lòng điền đầy đủ: Tên học viên, Cơ sở, Chương trình.')
      return
    }
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
    const id = nextTrialId(trials)
    const newTrial = buildTrialFromCreateForm({
      id,
      form: createForm,
      activeBranch,
      branchOptions,
      now,
    })
    setTrials((current) => [newTrial, ...current])
    setIsCreateOpen(false)
    setCreateForm(buildEmptyCreateForm())
    toast.success(`Đã tạo booking ${id}`)
  }

  const handleAssign = (
    trialId: string,
    sessions: import('./trialClassTypes').TrialSessionSelection[],
    notes: string,
  ) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
    setTrials((current) =>
      current.map((t) => {
        if (t.id !== trialId) return t
        return applyTrialAssignment(t, {
          sessions,
          notes,
          now,
        })
      })
    )
    setAssignMode({ mode: 'closed' })
    toast.success('Đã ghép lớp thành công')
  }

  const handleRequestReschedule = (trialId: string, reason: string, notes: string) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
    setTrials((current) =>
      current.map((t) => {
        if (t.id !== trialId) return t

        return applyTrialReschedule(t, reason, notes, now)
      })
    )
    toast.success('Đã gửi yêu cầu đổi lịch — slot lớp cũ được giải phóng')
  }

  const handleUpdateTrial = (trialId: string, updater: (trial: TrialClass) => TrialClass) => {
    setTrials((current) => current.map((t) => (t.id === trialId ? updater(t) : t)))
    toast.success('Đã cập nhật')
  }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(''), 2000)
    toast.success('Đã sao chép')
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
        onCreate={handleCreate}
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
        />
      </div>

      <FilterSheetPanel
        open={isFilterOpen}
        sections={filterSections}
        description="Lọc theo chương trình, người tạo."
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'programs') toggleArrayFilter('programs', value)
          if (sectionId === 'creators') toggleArrayFilter('creators', value)
        }}
        onClearAll={() => {
          setFilters({ programs: [], creators: [] })
          setPage(1)
        }}
      />

      <TrialClassCreateDialog
        open={isCreateOpen}
        form={createForm}
        branchOptions={branchOptions}
        studentOptions={studentOptions}
        onOpenChange={(open) => { if (!open) setIsCreateOpen(false) }}
        onFormChange={setCreateForm}
        onSubmit={handleSubmitCreate}
      />

      <TrialClassDetailDialog
        trial={detailTrial}
        onOpenChange={(open) => { if (!open) setDetailTrialId('') }}
        onCopy={handleCopy}
        copiedKey={copiedKey}
        onAssign={setAssignMode}
        onRequestReschedule={handleRequestReschedule}
        onUpdateTrial={handleUpdateTrial}
      />

      <TrialClassAssignDialog
        mode={assignMode}
        trial={assignTrial}
        onOpenChange={(open) => { if (!open) setAssignMode({ mode: 'closed' }) }}
        onAssign={handleAssign}
      />
    </div>
  )
}
