/* eslint-disable @next/next/no-img-element */
'use client'

import {
  BookOpen,
  Eye,
  GraduationCap,
  Layers,
  Package,
  PenTool,
  Tag,
  Ticket,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/components/shared'
import { formatCurrency, formatDate } from '@/lib/format'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import type { Product, ProductCategory } from '@/mocks/products'
import { CATEGORY_LABELS, STATUS_LABELS } from './productsTypes'
import { ProductComboPopover } from './ProductComboPopover'

interface ProductsTableProps {
  items: Product[]
  selectedIds: string[]
  onToggleSelectAll: (checked: boolean) => void
  onToggleSelectRow: (id: string, checked: boolean) => void
  onRowClick: (item: Product) => void
  onView: (item: Product) => void
  onOpenVouchers?: (item: Product) => void
}

function CategoryIcon({ category }: { category: ProductCategory }) {
  switch (category) {
    case 'course':
      return <GraduationCap className="h-5 w-5 text-primary" />
    case 'combo':
      return <Layers className="h-5 w-5 text-purple-600" />
    case 'book':
      return <BookOpen className="h-5 w-5 text-sky-600" />
    case 'stationery':
      return <PenTool className="h-5 w-5 text-amber-600" />
    case 'physical_product':
      return <Package className="h-5 w-5 text-emerald-600" />
    case 'service':
      return <Tag className="h-5 w-5 text-violet-600" />
    default:
      return <Package className="h-5 w-5 text-muted-foreground" />
  }
}

export function ProductsTable({
  items,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  onRowClick,
  onView,
  onOpenVouchers,
}: ProductsTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <EmptyState
          icon={<Package className="h-8 w-8 text-muted-foreground" />}
          title="Không tìm thấy sản phẩm nào"
          description="Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc phân loại."
        />
      </div>
    )
  }

  const isAllSelected = items.length > 0 && selectedIds.length === items.length

  return (
    <Table containerClassName="min-w-full" className="min-w-[1100px]">
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          {/* Cột 1: Checkbox + Tên sản phẩm & Mã */}
          <TableHead className="min-w-[340px] max-w-[420px]">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={(checked) => onToggleSelectAll(Boolean(checked))}
                aria-label="Chọn tất cả sản phẩm"
              />
              <span>Tên sản phẩm</span>
            </div>
          </TableHead>

          {/* Cột 2: Loại sản phẩm & Thẻ */}
          <TableHead className="min-w-[180px]">Loại sản phẩm</TableHead>

          {/* Cột 3: Nhóm sản phẩm (kèm DS sản phẩm combo nếu có) */}
          <TableHead className="min-w-[200px]">Nhóm sản phẩm</TableHead>

          {/* Cột 4: Giá bán lẻ (Gồm Đơn vị & Thời hạn bên dưới) */}
          <TableHead className="min-w-[150px] text-right">Giá bán lẻ</TableHead>

          {/* Cột 5: Voucher áp dụng */}
          <TableHead className="min-w-[140px]">Voucher áp dụng</TableHead>

          {/* Cột 6: Người tạo & Ngày tạo */}
          <TableHead className="min-w-[140px]">Người tạo</TableHead>

          {/* Cột 7: Trạng thái */}
          <TableHead className="min-w-[130px]">Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((product) => {
          const isSelected = selectedIds.includes(product.id)
          const isCombo = product.isCombo || product.category === 'combo'

          return (
            <TableRow
              key={product.id}
              className={cn(
                'group/row cursor-pointer transition-colors',
                isSelected ? 'bg-muted/50' : 'hover:bg-muted/30'
              )}
              onClick={() => onRowClick(product)}
            >
              {/* CỘT 1: CHECKBOX + ẢNH VUÔNG + TÊN SẢN PHẨM & MÃ SKU + ACTION HOVER */}
              <TableCell className="px-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      onToggleSelectRow(product.id, Boolean(checked))
                    }
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Chọn sản phẩm ${product.name}`}
                    className="shrink-0"
                  />

                  {/* Hình ảnh sản phẩm (Hình vuông) */}
                  <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/60">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="size-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <CategoryIcon category={product.category} />
                    )}
                  </div>

                  {/* Tên sản phẩm & Mã SKU */}
                  <div className="min-w-0 flex-1">
                    <p
                      className="line-clamp-2 text-sm font-semibold leading-tight text-foreground transition-colors hover:text-primary"
                      title={product.name}
                    >
                      {product.name}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {product.code}
                    </p>
                  </div>

                  {/* Thao tác ẩn: Chỉ hiện khi hover trên dòng */}
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover/row:opacity-100 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      title="Xem chi tiết"
                      onClick={(e) => {
                        e.stopPropagation()
                        onView(product)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TableCell>

              {/* CỘT 2: LOẠI SẢN PHẨM (DÒNG TRÊN) & THẺ TAGS (DÒNG DƯỚI) */}
              <TableCell>
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {CATEGORY_LABELS[product.category]}
                  </span>

                  {/* Thẻ Tags dưới dạng text nhẹ nhàng */}
                  {product.tags?.length ? (
                    <p className="mt-0.5 text-xs text-muted-foreground truncate" title={product.tags.map((t) => `#${t}`).join(' ')}>
                      {product.tags.map((t) => `#${t}`).join(' ')}
                    </p>
                  ) : null}
                </div>
              </TableCell>

              {/* CỘT 3: NHÓM SẢN PHẨM (NẾU LÀ COMBO -> HIỂN THỊ CÁC SẢN PHẨM Ở DƯỚI) */}
              <TableCell>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {product.group}
                  </p>
                  {isCombo && product.comboItems?.length ? (
                    <ProductComboPopover product={product} />
                  ) : null}
                </div>
              </TableCell>

              {/* CỘT 4: GIÁ BÁN LẺ (DÒNG TRÊN) & ĐƠN VỊ • THỜI HẠN (DÒNG DƯỚI) */}
              <TableCell className="text-right">
                <p className="font-mono text-sm font-semibold text-foreground">
                  {formatCurrency(product.price)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {product.unit} • {product.duration}
                </p>
              </TableCell>

              {/* CỘT 5: VOUCHER ÁP DỤNG (TINH GIẢN, BẤM ĐỂ MỞ MODAL KHUYẾN MẠI) */}
              <TableCell>
                {product.vouchers?.length ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenVouchers?.(product)
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:underline cursor-pointer select-none"
                    title="Bấm để xem danh sách khuyến mại áp dụng"
                  >
                    <Ticket className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                    <span>{product.vouchers.length} khuyến mại</span>
                  </button>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>

              {/* CỘT 6: NGƯỜI TẠO & NGÀY TẠO (NGÀY DƯỚI TÊN) */}
              <TableCell>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {product.createdBy}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(product.createdAt)}
                  </p>
                </div>
              </TableCell>

              {/* CỘT 7: TRẠNG THÁI */}
              <TableCell>
                <Badge className={cn('rounded-md text-xs', getStatusBadgeClass(product.status))}>
                  {STATUS_LABELS[product.status]}
                </Badge>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}


