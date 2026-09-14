'use client'

import { useMemo, useState } from 'react'
import { DataTableFrame } from '@/components/data-table'
import {
  DataTablePagination,
  DEFAULT_PAGE_SIZE,
} from '@/components/data-table'
import {
  FilterGroupAsidePanel,
  createFilterGroup,
  type FilterGroupConfig,
} from '@/components/filters'
import type { Product, ProductCategory } from '@/mocks/products'
import {
  VoucherSelectionDialog,
  MOCK_VOUCHERS,
} from '@/components/screens/care/draft-order/VoucherSelectionDialog'
import {
  filterProducts,
  getInitialProducts,
  getProductCategories,
  getProductGroups,
} from './productsHelpers'
import {
  CATEGORY_LABELS,
  type ProductFilterState,
  type ProductStatusFilter,
} from './productsTypes'
import { ProductsToolbar } from './ProductsToolbar'
import { ProductsTable } from './ProductsTable'
import { ProductsFormDialog } from './ProductsFormDialog'

export function ProductsScreen() {
  const [products] = useState<Product[]>(() => getInitialProducts())
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeStatus, setActiveStatus] = useState<ProductStatusFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<ProductFilterState>({
    categories: [],
    groups: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [voucherModalOpen, setVoucherModalOpen] = useState(false)
  const [voucherProduct, setVoucherProduct] = useState<Product | null>(null)

  const categories = useMemo(() => getProductCategories(products), [products])
  const groups = useMemo(() => getProductGroups(products), [products])

  const filtered = useMemo(
    () =>
      filterProducts(products, {
        search: searchTerm,
        status: activeStatus,
        extra: filters,
      }),
    [products, searchTerm, activeStatus, filters]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const activeFilterCount = filters.categories.length + filters.groups.length

  const filterGroups = useMemo<FilterGroupConfig[]>(
    () => [
      createFilterGroup({
        id: 'categories',
        title: 'Loại sản phẩm',
        options: categories,
        selectedValues: filters.categories,
        getOptionLabel: (category) => CATEGORY_LABELS[category as ProductCategory],
        getOptionCount: (category) => products.filter((p) => p.category === category).length,
      }),
      createFilterGroup({
        id: 'groups',
        title: 'Nhóm sản phẩm',
        options: groups,
        selectedValues: filters.groups,
        getOptionCount: (group) => products.filter((p) => p.group === group).length,
      }),
    ],
    [categories, groups, products, filters]
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

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paged.map((p) => p.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleToggleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id))
    }
  }

  const handleOpenVouchers = (product: Product) => {
    setVoucherProduct(product)
    setVoucherModalOpen(true)
  }

  const appliedVouchers = useMemo(() => {
    if (!voucherProduct?.vouchers?.length) return []
    return MOCK_VOUCHERS.filter((v) => voucherProduct.vouchers?.includes(v.code))
  }, [voucherProduct])

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <ProductsToolbar
        products={products}
        activeStatus={activeStatus}
        searchTerm={searchTerm}
        filters={filters}
        activeFilterCount={activeFilterCount}
        onStatusChange={(s) => {
          setActiveStatus(s)
          setPage(1)
        }}
        onSearchChange={(v) => {
          setSearchTerm(v)
          setPage(1)
        }}
        onOpenFilters={() => setIsFilterOpen(true)}
      />

      <div className="flex flex-1 min-h-0 w-full gap-3 overflow-hidden px-3 pb-3 lg:px-3 lg:pb-3">
        <div className="flex-1 min-w-0 h-full overflow-hidden">
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
              selectedIds={selectedIds}
              onToggleSelectAll={handleToggleSelectAll}
              onToggleSelectRow={handleToggleSelectRow}
              onRowClick={(item) => setSelectedProduct(item)}
              onView={(item) => setSelectedProduct(item)}
              onOpenVouchers={handleOpenVouchers}
            />
          </DataTableFrame>
        </div>

        {isFilterOpen && (
          <FilterGroupAsidePanel
            title="Bộ lọc sản phẩm"
            description="Lọc danh sách theo loại sản phẩm và nhóm sản phẩm."
            groups={filterGroups}
            onToggle={(sectionId, value) => {
              if (sectionId === 'categories')
                toggleArray('categories', value as ProductCategory)
              if (sectionId === 'groups')
                toggleArray('groups', value)
            }}
            onClearAll={() => {
              setFilters({ categories: [], groups: [] })
              setPage(1)
            }}
            onClose={() => setIsFilterOpen(false)}
          />
        )}
      </div>

      {/* Chi tiết sản phẩm / Combo */}
      <ProductsFormDialog
        open={Boolean(selectedProduct)}
        product={selectedProduct}
        onOpenChange={(open) => {
          if (!open) setSelectedProduct(null)
        }}
        onOpenVouchers={handleOpenVouchers}
      />

      {/* Modal Danh sách khuyến mại / Vouchers tái sử dụng (Mode xem chỉ đọc, không có search & footer) */}
      <VoucherSelectionDialog
        open={voucherModalOpen}
        onOpenChange={(open) => {
          setVoucherModalOpen(open)
          if (!open) setVoucherProduct(null)
        }}
        alreadyAppliedVouchers={appliedVouchers}
        isReadOnly={true}
      />
    </div>
  )
}

