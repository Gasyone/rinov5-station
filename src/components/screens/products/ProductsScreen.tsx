'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTableFrame } from '@/components/data-table'
import {
  DataTablePagination,
  DEFAULT_PAGE_SIZE,
} from '@/components/data-table'
import {
  FilterGroupSheetPanel,
  createFilterGroup,
  type FilterGroupConfig,
} from '@/components/filters'
import { ConfirmDialog } from '@/components/shared'
import type { Product } from '@/mocks/products'
import {
  buildEmptyProduct,
  filterProducts,
  getInitialProducts,
  getProductBranches,
  getProductCategories,
  nextProductId,
} from './productsHelpers'
import { CATEGORY_LABELS, type ProductFilterState, type ProductStatusFilter } from './productsTypes'
import { ProductsToolbar } from './ProductsToolbar'
import { ProductsTable } from './ProductsTable'
import { ProductsFormDialog } from './ProductsFormDialog'

type DialogState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; product: Product }

export function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>(() => getInitialProducts())
  const [activeBranch, setActiveBranch] = useState('all')
  const [activeStatus, setActiveStatus] = useState<ProductStatusFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<ProductFilterState>({
    branches: [],
    categories: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [dialog, setDialog] = useState<DialogState>({ mode: 'closed' })
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const branches = useMemo(() => getProductBranches(products), [products])
  const categories = useMemo(() => getProductCategories(products), [products])

  const filtered = useMemo(
    () =>
      filterProducts(products, {
        search: searchTerm,
        branch: activeBranch,
        status: activeStatus,
        extra: filters,
      }),
    [products, searchTerm, activeBranch, activeStatus, filters]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const activeFilterCount = filters.branches.length + filters.categories.length

  const filterGroups = useMemo<FilterGroupConfig[]>(
    () => [
      createFilterGroup({
        id: 'branches',
        options: branches,
        selectedValues: filters.branches,
        getOptionCount: (branch) => products.filter((p) => p.branch === branch).length,
      }),
      createFilterGroup({
        id: 'categories',
        options: categories,
        selectedValues: filters.categories,
        getOptionLabel: (category) => CATEGORY_LABELS[category as Product['category']],
        getOptionCount: (category) => products.filter((p) => p.category === category).length,
      }),
    ],
    [branches, categories, products, filters]
  )

  const toggleArray = <K extends keyof ProductFilterState>(
    key: K,
    value: ProductFilterState[K][number]
  ) => {
    setPage(1)
    setFilters((current) => {
      const arr = current[key] as string[]
      return {
        ...current,
        [key]: arr.includes(value as string)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      } as ProductFilterState
    })
  }

  const handleSubmit = (value: Omit<Product, 'id'> & { id?: string }) => {
    if (dialog.mode === 'edit') {
      setProducts((current) =>
        current.map((p) =>
          p.id === dialog.product.id ? { ...p, ...value, id: p.id } : p
        )
      )
      toast.success(`Updated ${value.name}`)
    } else {
      const id = nextProductId(products)
      const created: Product = { ...buildEmptyProduct(), ...value, id }
      setProducts((current) => [created, ...current])
      toast.success(`Added ${value.name}`)
    }
    setDialog({ mode: 'closed' })
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    const name = deleteTarget.name
    setProducts((current) => current.filter((p) => p.id !== deleteTarget.id))
    setDeleteTarget(null)
    toast.success(`Removed ${name}`)
  }

  const dialogInitial =
    dialog.mode === 'edit' ? { ...dialog.product } : { ...buildEmptyProduct() }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <ProductsToolbar
        products={products}
        branches={branches}
        activeBranch={activeBranch}
        activeStatus={activeStatus}
        searchTerm={searchTerm}
        activeFilterCount={activeFilterCount}
        onBranchChange={(b) => {
          setActiveBranch(b)
          setPage(1)
        }}
        onStatusChange={(s) => {
          setActiveStatus(s)
          setPage(1)
        }}
        onSearchChange={(v) => {
          setSearchTerm(v)
          setPage(1)
        }}
        onOpenFilters={() => setIsFilterOpen(true)}
        onCreate={() => setDialog({ mode: 'create' })}
      />

      <div className="min-h-0 flex-1 overflow-hidden px-3 pb-3 lg:px-3 lg:pb-3">
        <DataTableFrame
          footer={
            <DataTablePagination
              page={currentPage}
              total={filtered.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          }
        >
          <ProductsTable
            items={paged}
            onRowClick={(item) => setDialog({ mode: 'edit', product: item })}
            onView={(item) => setDialog({ mode: 'edit', product: item })}
            onEdit={(item) => setDialog({ mode: 'edit', product: item })}
            onDelete={setDeleteTarget}
          />
        </DataTableFrame>
      </div>

      <FilterGroupSheetPanel
        open={isFilterOpen}
        title="Product filters"
        description="Filter by branch and category."
        groups={filterGroups}
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'branches') toggleArray('branches', value)
          if (sectionId === 'categories')
            toggleArray('categories', value as Product['category'])
        }}
        onClearAll={() => {
          setFilters({ branches: [], categories: [] })
          setPage(1)
        }}
      />

      <ProductsFormDialog
        key={dialog.mode === 'edit' ? `edit-${dialog.product.id}` : `create-${dialog.mode}`}
        open={dialog.mode !== 'closed'}
        mode={dialog.mode === 'edit' ? 'edit' : 'create'}
        initial={dialogInitial}
        branches={branches}
        onOpenChange={(open) => {
          if (!open) setDialog({ mode: 'closed' })
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        variant="destructive"
        title={`Remove ${deleteTarget?.name ?? 'product'}?`}
        description="This deletes the product from the demo catalog."
        confirmLabel="Remove"
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
