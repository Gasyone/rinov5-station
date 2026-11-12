'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { ConfirmDialog } from '@/components/shared'
import type { Organization } from '@/mocks/organizations'
import {
  buildEmptyOrganization,
  filterOrganizations,
  getInitialOrganizations,
  getOrganizationBranches,
} from './organizationsHelpers'
import type { OrganizationTierFilter, OrganizationTypeFilter } from './organizationsTypes'
import { OrganizationsToolbar } from './OrganizationsToolbar'
import { OrganizationsTable } from './OrganizationsTable'
import { OrganizationDetailDialog } from './OrganizationDetailDialog'
import { OrganizationFormDialog } from './OrganizationFormDialog'

type FormDialogState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; organization: Organization }

export function OrganizationsScreen() {
  const [organizations, setOrganizations] = useState<Organization[]>(() =>
    getInitialOrganizations()
  )
  const [activeBranch, setActiveBranch] = useState('all')
  const [activeType, setActiveType] = useState<OrganizationTypeFilter>('all')
  const [activeTier, setActiveTier] = useState<OrganizationTierFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const [formDialog, setFormDialog] = useState<FormDialogState>({ mode: 'closed' })
  const [detailOrg, setDetailOrg] = useState<Organization | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Organization | null>(null)

  const branches = useMemo(
    () => getOrganizationBranches(organizations),
    [organizations]
  )

  const filtered = useMemo(
    () =>
      filterOrganizations(organizations, {
        search: searchTerm,
        branch: activeBranch,
        type: activeType,
        tier: activeTier,
      }),
    [organizations, searchTerm, activeBranch, activeType, activeTier]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paged.map((o) => o.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleToggleOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const handleFormSubmit = (value: Organization) => {
    if (formDialog.mode === 'edit') {
      setOrganizations((current) =>
        current.map((o) => (o.id === formDialog.organization.id ? { ...value } : o))
      )
      toast.success(`Đã cập nhật thông tin đối tượng: ${value.name}`)
    } else {
      setOrganizations((current) => [
        { ...value, id: `ORG-${Date.now()}` },
        ...current,
      ])
      toast.success(`Đã thêm mới: ${value.name}`)
    }
    setFormDialog({ mode: 'closed' })
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    setOrganizations((current) => current.filter((o) => o.id !== deleteTarget.id))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(deleteTarget.id)
      return next
    })
    toast.success(`Đã xóa đối tượng: ${deleteTarget.name}`)
    setDeleteTarget(null)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar lọc và tìm kiếm */}
      <OrganizationsToolbar
        organizations={organizations}
        branches={branches}
        activeBranch={activeBranch}
        activeType={activeType}
        searchTerm={searchTerm}
        onBranchChange={(b) => {
          setActiveBranch(b)
          setPage(1)
        }}
        onTypeChange={(t) => {
          setActiveType(t)
          setPage(1)
        }}
        onSearchChange={(q) => {
          setSearchTerm(q)
          setPage(1)
        }}
        onCreate={() => setFormDialog({ mode: 'create' })}
      />

      {/* Bảng danh sách tổ chức & hộ gia đình */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <DataTableFrame
          className="flex-1 min-h-0"
          footer={
            <DataTablePagination
              page={currentPage}
              total={filtered.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setPage(1)
              }}
              selectedCount={selectedIds.size > 0 ? selectedIds.size : undefined}
              onClearSelection={() => setSelectedIds(new Set())}
              size="sm"
            />
          }
        >
          <OrganizationsTable
            organizations={paged}
            selectedIds={selectedIds}
            onToggleAll={handleToggleAll}
            onToggleOne={handleToggleOne}
            onRowClick={(org) => setDetailOrg(org)}
            onEdit={(org) => setFormDialog({ mode: 'edit', organization: org })}
            onDelete={(org) => setDeleteTarget(org)}
          />
        </DataTableFrame>
      </div>

      {/* Dialog xem chi tiết đối tượng */}
      <OrganizationDetailDialog
        open={Boolean(detailOrg)}
        organization={detailOrg}
        onOpenChange={(open) => !open && setDetailOrg(null)}
      />

      {/* Dialog tạo / chỉnh sửa đối tượng */}
      <OrganizationFormDialog
        open={formDialog.mode !== 'closed'}
        mode={formDialog.mode === 'edit' ? 'edit' : 'create'}
        initial={
          formDialog.mode === 'edit'
            ? formDialog.organization
            : buildEmptyOrganization()
        }
        onOpenChange={(open) => !open && setFormDialog({ mode: 'closed' })}
        onSubmit={handleFormSubmit}
      />

      {/* Xác nhận xóa */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xóa đối tượng tổ chức / hộ gia đình"
        description={`Bạn có chắc chắn muốn xóa "${deleteTarget?.name}" không? Hành động này không thể hoàn tác.`}
        confirmLabel="Xác nhận xóa"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

// Alias tương thích ngược
export const HouseholdsScreen = OrganizationsScreen
