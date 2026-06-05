'use client'

import { DataTableFrame, DataTablePagination } from '@/components/data-table'
import { ErrorState, ModuleLoadingSkeleton } from '@/components/shared'
import type { TrialClass } from '@/mocks/trialClasses'
import { TrialClassTable } from './TrialClassTable'
import type { AssignDialogMode } from './trialClassTypes'

interface TrialClassTableFrameProps {
  loading: boolean
  error: string | null
  trials: TrialClass[]
  selectedIds: Set<string>
  copiedKey: string
  currentPage: number
  total: number
  pageSize: number
  onRetry: () => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onToggleAll: (checked: boolean, ids: string[]) => void
  onToggleOne: (id: string, checked: boolean) => void
  onRowClick: (id: string) => void
  onCopy: (text: string, key: string) => void
  onAssign?: (mode: AssignDialogMode) => void
  onRequestReschedule?: (id: string) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
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
  onRetry,
  onPageChange,
  onPageSizeChange,
  onToggleAll,
  onToggleOne,
  onRowClick,
  onCopy,
  onAssign,
  onRequestReschedule,
  onApprove,
  onReject,
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
        />
      }
    >
      <TrialClassTable
        trials={trials}
        selectedIds={selectedIds}
        copiedKey={copiedKey}
        onToggleAll={onToggleAll}
        onToggleOne={onToggleOne}
        onRowClick={onRowClick}
        onCopy={onCopy}
        onAssign={onAssign}
        onRequestReschedule={onRequestReschedule}
        onApprove={onApprove}
        onReject={onReject}
      />
    </DataTableFrame>
  )
}
