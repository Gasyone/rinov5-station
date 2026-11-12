'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { ConfirmDialog } from '@/components/shared'
import type { Supplier } from '@/mocks/suppliers'
import {
  buildEmptySupplier,
  filterSuppliers,
  getInitialSuppliers,
  getSupplierCategories,
} from './suppliersHelpers'
import type { SupplierTypeFilter } from './suppliersTypes'
import { SuppliersToolbar } from './SuppliersToolbar'
import { SuppliersTable } from './SuppliersTable'
import { SupplierDetailDialog } from './SupplierDetailDialog'
import { SupplierFormDialog } from './SupplierFormDialog'

type FormDialogState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; supplier: Supplier }

export function SuppliersScreen() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => getInitialSuppliers())
  const [activeType, setActiveType] = useState<SupplierTypeFilter>('all')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const [formDialog, setFormDialog] = useState<FormDialogState>({ mode: 'closed' })
  const [detailSupplier, setDetailSupplier] = useState<Supplier | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null)

  const categories = useMemo(() => getSupplierCategories(suppliers), [suppliers])

  const filtered = useMemo(
    () =>
      filterSuppliers(suppliers, {
        search: searchTerm,
        type: activeType,
        category: activeCategory,
      }),
    [suppliers, searchTerm, activeType, activeCategory]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paged.map((s) => s.id)))
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

  const handleFormSubmit = (value: Supplier) => {
    if (formDialog.mode === 'edit') {
      setSuppliers((current) =>
        current.map((s) => (s.id === formDialog.supplier.id ? { ...value } : s))
      )
      toast.success(`Đã cập nhật thông tin đối tượng: ${value.name}`)
    } else {
      setSuppliers((current) => [{ ...value, id: `sup-${Date.now()}` }, ...current])
      toast.success(`Đã thêm mới đối tượng cung cấp: ${value.name}`)
    }
    setFormDialog({ mode: 'closed' })
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    setSuppliers((current) => current.filter((s) => s.id !== deleteTarget.id))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(deleteTarget.id)
      return next
    })
    toast.success(`Đã xóa nhà cung cấp: ${deleteTarget.name}`)
    setDeleteTarget(null)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar lọc và tìm kiếm */}
      <SuppliersToolbar
        suppliers={suppliers}
        activeType={activeType}
        activeCategory={activeCategory}
        categories={categories}
        searchTerm={searchTerm}
        onTypeChange={(type) => {
          setActiveType(type)
          setPage(1)
        }}
        onCategoryChange={(cat) => {
          setActiveCategory(cat)
          setPage(1)
        }}
        onSearchChange={(term) => {
          setSearchTerm(term)
          setPage(1)
        }}
        onCreate={() => setFormDialog({ mode: 'create' })}
      />

      {/* Bảng danh sách nhà cung cấp */}
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
          <SuppliersTable
            suppliers={paged}
            selectedIds={selectedIds}
            onToggleAll={handleToggleAll}
            onToggleOne={handleToggleOne}
            onRowClick={(supplier) => setDetailSupplier(supplier)}
            onEdit={(supplier) => setFormDialog({ mode: 'edit', supplier })}
            onDelete={(supplier) => setDeleteTarget(supplier)}
          />
        </DataTableFrame>
      </div>

      {/* Dialog chi tiết đối tượng */}
      <SupplierDetailDialog
        open={Boolean(detailSupplier)}
        supplier={detailSupplier}
        onOpenChange={(open) => !open && setDetailSupplier(null)}
      />

      {/* Dialog tạo / sửa đối tượng */}
      <SupplierFormDialog
        open={formDialog.mode !== 'closed'}
        mode={formDialog.mode === 'edit' ? 'edit' : 'create'}
        initial={
          formDialog.mode === 'edit'
            ? formDialog.supplier
            : buildEmptySupplier()
        }
        onOpenChange={(open) => !open && setFormDialog({ mode: 'closed' })}
        onSubmit={handleFormSubmit}
      />

      {/* Xác nhận xóa đối tượng */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xóa nhà cung cấp / đối tượng"
        description={`Bạn có chắc chắn muốn xóa đối tượng "${deleteTarget?.name}" khỏi danh bạ đối tác cung cấp không? Hành động này không thể hoàn tác.`}
        confirmLabel="Xác nhận xóa"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
