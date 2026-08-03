'use client'

import { DataTableFrame, DataTablePagination } from '@/components/data-table'
import { ErrorState, ModuleLoadingSkeleton } from '@/components/shared'
import type { MakeupClassRequest } from '@/mocks/makeupClasses'
import { MakeupClassTable } from './MakeupClassTable'

interface MakeupClassTableFrameProps {
  loading: boolean
  error: string | null
  requests: MakeupClassRequest[]
  selectedIds: Set<string>
  currentPage: number
  total: number
  pageSize: number
  onRetry: () => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onToggleAll: (checked: boolean, ids: string[]) => void
  onToggleOne: (id: string, checked: boolean) => void
  onRowClick: (id: string) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export function MakeupClassTableFrame({
  loading,
  error,
  requests,
  selectedIds,
  currentPage,
  total,
  pageSize,
  onRetry,
  onPageChange,
  onPageSizeChange,
  onToggleAll,
  onToggleOne,
  onRowClick,
  onApprove,
  onReject,
}: MakeupClassTableFrameProps) {
  if (loading) {
    return <ModuleLoadingSkeleton rows={8} columns={9} showToolbar={false} className="h-full" />
  }

  if (error) {
    return (
      <ErrorState
        title="Không thể tải phiếu học bù"
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
      <MakeupClassTable
        requests={requests}
        selectedIds={selectedIds}
        onToggleAll={onToggleAll}
        onToggleOne={onToggleOne}
        onRowClick={onRowClick}
        onApprove={onApprove}
        onReject={onReject}
      />
    </DataTableFrame>
  )
}
