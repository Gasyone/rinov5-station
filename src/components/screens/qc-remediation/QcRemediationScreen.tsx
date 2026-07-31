'use client'

import { useState, useMemo } from 'react'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { FilterGroupSheetPanel, createFilterGroup, type FilterGroupConfig } from '@/components/filters'
import {
  mockQcCheckEvents,
} from '@/mocks/qcChecks'
import type {
  QcErrorType,
  QcErrorSeverity,
} from '@/mocks/qcChecks'
import type {
  QcErrorStatus,
  QcExtendedError,
  FilterState,
  ErrorStatusFilter,
} from './qcRemediationTypes'
import {
  isErrorOverdue,
  computeErrorStatusTotal,
  BRANCH_OPTIONS,
} from './qcRemediationTypes'
import { QcRemediationToolbar } from './QcRemediationToolbar'
import { QcRemediationTable } from './QcRemediationTable'
import { QcRemediationDetailDialog } from './QcRemediationDetailDialog'

const CURRENT_USER_ID = 'ins_01'

const ERROR_TYPE_OPTIONS = [
  { value: 'personnel', label: 'Giáo viên' },
  { value: 'facility', label: 'Cơ sở vật chất' },
]

export function QcRemediationScreen() {
  const [events] = useState(() => structuredClone(mockQcCheckEvents))

  const allErrors: QcExtendedError[] = useMemo(() => {
    return events.flatMap((e) =>
      e.errors
        .filter((err) => err.errorType === 'personnel' || err.errorType === 'facility')
        .map((err) => ({
          ...err,
          eventCode: e.code,
          eventName: e.name,
          branch: e.branch,
        }))
    )
  }, [events])

  const [activeType, setActiveType] = useState('all')
  const [activeBranch, setActiveBranch] = useState('all')
  const [activeStatus, setActiveStatus] = useState<ErrorStatusFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    branches: [],
    types: [],
    severities: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [page, setPage] = useState(1)
  const [detailErrorId, setDetailErrorId] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())

  const errorsForTotals = useMemo(() => {
    return allErrors.filter((err) => {
      if (activeType !== 'all' && err.errorType !== activeType) return false
      if (activeBranch !== 'all' && err.branch !== activeBranch) return false
      if (searchTerm) {
        const q = searchTerm.toLowerCase()
        const matches =
          err.code.toLowerCase().includes(q) ||
          err.eventCode.toLowerCase().includes(q) ||
          err.description.toLowerCase().includes(q) ||
          err.assignee?.toLowerCase().includes(q) ||
          err.itemLabel.toLowerCase().includes(q) ||
          err.eventName.toLowerCase().includes(q)
        if (!matches) return false
      }
      if (filters.branches.length > 0 && !filters.branches.includes(err.branch)) return false
      if (filters.types.length > 0 && !filters.types.includes(err.errorType)) return false
      if (filters.severities.length > 0 && !filters.severities.includes(err.severity)) return false
      return true
    })
  }, [allErrors, activeType, activeBranch, searchTerm, filters])

  const filteredErrors = useMemo(() => {
    return errorsForTotals.filter((err) => {
      if (activeStatus === 'overdue') {
        return isErrorOverdue(err)
      }
      if (activeStatus !== 'all' && err.status !== activeStatus) return false
      return true
    })
  }, [errorsForTotals, activeStatus])

  const sortedErrors = useMemo(() => {
    return [...filteredErrors].sort((a, b) => {
      if (isErrorOverdue(a) && !isErrorOverdue(b)) return -1
      if (!isErrorOverdue(a) && isErrorOverdue(b)) return 1
      const statusOrder: Record<QcErrorStatus, number> = {
        open: 0,
        correcting: 1,
        corrected: 2,
        not_met: 3,
        closed: 4,
        cancelled: 5,
      }
      return (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0)
    })
  }, [filteredErrors])

  const totalPages = Math.max(1, Math.ceil(sortedErrors.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedErrors = sortedErrors.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const statusTileTotals: Record<string, number> = {}
  const statusFilterIds: ErrorStatusFilter[] = ['all', 'open', 'correcting', 'corrected', 'not_met', 'closed', 'overdue']
  for (const tileId of statusFilterIds) {
    statusTileTotals[tileId] = computeErrorStatusTotal(errorsForTotals, tileId)
  }

  const activeFilterCount = filters.branches.length + filters.types.length + filters.severities.length

  const filterGroups = useMemo<FilterGroupConfig[]>(() => [
    createFilterGroup({
      id: 'branches',
      options: BRANCH_OPTIONS,
      selectedValues: filters.branches,
      getOptionCount: (branch) => allErrors.filter((error) => error.branch === branch).length,
    }),
    createFilterGroup({
      id: 'types',
      title: 'Loại lỗi',
      options: ERROR_TYPE_OPTIONS,
      selectedValues: filters.types,
      getOptionCount: (type) => allErrors.filter((error) => error.errorType === type).length,
    }),
    createFilterGroup({
      id: 'severities',
      options: [
        { value: 'low', label: 'Thấp', count: allErrors.filter((error) => error.severity === 'low').length },
        { value: 'medium', label: 'Trung bình', count: allErrors.filter((error) => error.severity === 'medium').length },
        { value: 'high', label: 'Cao', count: allErrors.filter((error) => error.severity === 'high').length },
        { value: 'critical', label: 'Nghiêm trọng', count: allErrors.filter((error) => error.severity === 'critical').length },
      ],
      selectedValues: filters.severities,
    }),
  ], [allErrors, filters.branches, filters.types, filters.severities])

  const detailError = filteredErrors.find((e) => e.id === detailErrorId) ?? null

  const handleUpdateErrorStatus = (errorId: string, status: QcErrorStatus) => {
    events.forEach((e) => {
      const error = e.errors.find((er) => er.id === errorId)
      if (error) {
        error.status = status
        if (status === 'corrected' && !error.completionDate) {
          error.completionDate = new Date().toISOString()
        }
        if (status === 'closed') {
          error.closedBy = CURRENT_USER_ID
          error.closedAt = new Date().toISOString()
        }
      }
    })
    setDetailErrorId('')
  }

  const handleAssign = (errorId: string, assigneeId: string) => {
    events.forEach((e) => {
      const error = e.errors.find((er) => er.id === errorId)
      if (error) {
        error.assignee = assigneeId
      }
    })
  }

  const handleUpdateCorrectiveAction = (errorId: string, correctiveAction: string, correctiveEvidence: string) => {
    events.forEach((e) => {
      const error = e.errors.find((er) => er.id === errorId)
      if (error) {
        error.correctiveAction = correctiveAction
        error.correctiveEvidence = correctiveEvidence
        if (!error.completionDate) {
          error.completionDate = new Date().toISOString()
        }
      }
    })
  }

  const toggleFilterValue = <T extends string>(group: keyof FilterState, value: T) => {
    setPage(1)
    setFilters((current) => {
      const currentValues = current[group] as T[]
      const next = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]
      return { ...current, [group]: next }
    })
  }

  const toggleSelectAll = () => {
    const allIds = filteredErrors.map((e) => e.id)
    const isAllSelected = allIds.every((id) => selectedIds.has(id))
    if (isAllSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(allIds))
    }
  }

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <QcRemediationToolbar
        activeType={activeType}
        activeBranch={activeBranch}
        activeStatus={activeStatus}
        searchTerm={searchTerm}
        activeFilterCount={activeFilterCount}
        statusTileTotals={statusTileTotals}
        onTypeChange={(type) => { setActiveType(type); setPage(1) }}
        onBranchChange={(branch) => { setActiveBranch(branch); setPage(1) }}
        onStatusChange={(status) => { setActiveStatus(status); setPage(1) }}
        onSearchChange={(value) => { setSearchTerm(value); setPage(1) }}
        onOpenFilters={() => setIsFilterOpen(true)}
      />

      <div className="min-h-0 flex-1 overflow-hidden px-3 pb-3 pt-2 lg:px-3 lg:pb-3">
        <DataTableFrame
          className="border-none bg-transparent shadow-none"
          footer={
            <DataTablePagination
              page={currentPage}
              total={sortedErrors.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          }
        >
          <QcRemediationTable
            errors={pagedErrors}
            selectedIds={selectedIds}
            onToggleAll={toggleSelectAll}
            onToggleOne={toggleSelectOne}
            onRowClick={setDetailErrorId}
            onAssign={handleAssign}
          />
        </DataTableFrame>
      </div>

      <FilterGroupSheetPanel
        open={isFilterOpen}
        groups={filterGroups}
        description="Kết hợp bộ lọc theo chi nhánh, loại lỗi và mức độ nghiêm trọng."
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'branches') toggleFilterValue('branches', value)
          if (sectionId === 'types') toggleFilterValue('types', value as QcErrorType)
          if (sectionId === 'severities') toggleFilterValue('severities', value as QcErrorSeverity)
        }}
        onClearAll={() => {
          setFilters({ branches: [], types: [], severities: [] })
          setPage(1)
        }}
        onClearSection={(sectionId) => {
          setFilters((current) => {
            const next = { ...current }
            if (sectionId === 'branches') next.branches = []
            if (sectionId === 'types') next.types = []
            if (sectionId === 'severities') next.severities = []
            return next
          })
          setPage(1)
        }}
      />

      <QcRemediationDetailDialog
        error={detailError}
        open={!!detailError}
        onOpenChange={(open) => { if (!open) setDetailErrorId('') }}
        onUpdateError={handleUpdateErrorStatus}
        onUpdateCorrectiveAction={handleUpdateCorrectiveAction}
        currentUserId={CURRENT_USER_ID}
      />
    </div>
  )
}
