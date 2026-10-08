'use client'

import { DataTableFrame, DataTablePagination } from '@/components/data-table'
import { ErrorState, ModuleLoadingSkeleton } from '@/components/shared'
import type { TrialClass } from '@/mocks/trialClasses'
import { TrialClassTable } from './TrialClassTable'

interface TrialClassTableFrameProps {
  loading: boolean
  error: string | null
  trials: TrialClass[]
  selectedIds: Set<string>
  copiedKey: string
  currentPage: number
  total: number
  pageSize: number
  sortField?: import('./trialClassTypes').TrialSortField
  sortDirection?: import('./trialClassTypes').SortDirection
  onSort?: (field: import('./trialClassTypes').TrialSortField) => void
  onRetry: () => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onToggleAll: (checked: boolean, ids: string[]) => void
  onToggleOne: (id: string, checked: boolean) => void
  onRowClick: (id: string) => void
  onCopy: (text: string, key: string) => void
  onRequestReschedule?: (id: string) => void
  onOpenAssign?: (id: string) => void
  onOpenAssignReschedule?: (id: string) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onClearSelection?: () => void
}

export function TrialClassTableFrame({
  loading,
  error,
  trials,
  selectedIds,
  copiedKey,
  currentPage,
  total,
  pageSize,
  sortField,
  sortDirection,
  onSort,
  onRetry,
  onPageChange,
  onPageSizeChange,
  onToggleAll,
  onToggleOne,
  onRowClick,
  onCopy,
  onRequestReschedule,
  onOpenAssign,
  onOpenAssignReschedule,
  onApprove,
  onReject,
  onClearSelection,
}: TrialClassTableFrameProps) {
  if (loading) {
    return <ModuleLoadingSkeleton rows={8} columns={10} showToolbar={false} className="h-full" />
  }

  if (error) {
    return (
      <ErrorState
        title="Không thể tải booking học thử"
        description={error}
        onRetry={onRetry}
        className="h-full"
      />
    )
  }

  return (
    <DataTableFrame
      footer={
        <DataTablePagination
          page={currentPage}
          total={total}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          selectedCount={selectedIds.size}
          onClearSelection={onClearSelection}
          size="sm"
        />
      }
    >
      <TrialClassTable
        trials={trials}
        selectedIds={selectedIds}
        copiedKey={copiedKey}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
        onToggleAll={onToggleAll}
        onToggleOne={onToggleOne}
        onRowClick={onRowClick}
        onCopy={onCopy}
        onRequestReschedule={onRequestReschedule}
        onOpenAssign={onOpenAssign}
        onOpenAssignReschedule={onOpenAssignReschedule}
        onApprove={onApprove}
        onReject={onReject}
      />
    </DataTableFrame>
  )
}
