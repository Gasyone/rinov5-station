'use client'

import { Building2, UserCheck, Star, MapPin, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DataTableActions,
  EmptyState,
  ContactCell,
} from '@/components/shared'
import type { Supplier } from '@/mocks/suppliers'
import { getStatusColors } from '@/lib/statusColors'

interface SuppliersTableProps {
  suppliers: Supplier[]
  selectedIds?: Set<string>
  onToggleAll?: (checked: boolean) => void
  onToggleOne?: (id: string, checked: boolean) => void
  onRowClick: (supplier: Supplier) => void
  onEdit: (supplier: Supplier) => void
  onDelete: (supplier: Supplier) => void
}

const COLUMNS: Array<{ label: string; className?: string }> = [
  { label: 'Đối tượng cung cấp', className: 'min-w-[260px]' },
  { label: 'Người liên hệ (Cá nhân)', className: 'min-w-[200px]' },
  { label: 'Điện thoại & Email', className: 'min-w-[190px]' },
  { label: 'Lĩnh vực cung cấp', className: 'min-w-[180px]' },
  { label: 'Địa chỉ / Trụ sở', className: 'min-w-[200px]' },
  { label: 'Đánh giá & Trạng thái', className: 'min-w-[160px]' },
  { label: '', className: 'w-16 text-right' },
]

export function SuppliersTable({
  suppliers,
  selectedIds = new Set(),
  onToggleAll,
  onToggleOne,
  onRowClick,
  onEdit,
  onDelete,
}: SuppliersTableProps) {
  if (suppliers.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <EmptyState
          icon={<Package className="h-7 w-7 text-muted-foreground" />}
          title="Không tìm thấy nhà cung cấp nào"
          description="Vui lòng thử điều chỉnh lại bộ lọc phân loại hoặc từ khóa tìm kiếm."
        />
      </div>
    )
  }

  const isAllSelected =
    suppliers.length > 0 && suppliers.every((s) => selectedIds.has(s.id))

  return (
    <Table containerClassName="min-w-full" className="min-w-[1100px] text-xs">
      <TableHeader>
        <TableRow className="bg-muted/60 hover:bg-muted/60 [&>th]:h-8 [&>th]:py-1 [&>th]:text-xs [&>th]:font-normal">
          {/* Checkbox chọn tất cả */}
          <TableHead className="w-9 min-w-9 max-w-9 text-center px-2">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={(checked) => onToggleAll?.(Boolean(checked))}
              className="h-3.5 w-3.5 translate-y-[1px]"
              aria-label="Chọn tất cả đối tượng cung cấp"
            />
          </TableHead>
          {COLUMNS.map((col) => (
            <TableHead key={col.label} className={col.className}>
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {suppliers.map((supplier) => {
          const isSelected = selectedIds.has(supplier.id)
          const isOrg = supplier.type === 'organization'
          const activeStatus = supplier.status === 'active'
          const statusColors = getStatusColors(activeStatus ? 'success' : 'neutral')

          return (
            <TableRow
              key={supplier.id}
              data-state={isSelected ? 'selected' : undefined}
              className="cursor-pointer hover:bg-muted/40 transition-colors"
              onClick={() => onRowClick(supplier)}
            >
              {/* Checkbox chọn từng dòng */}
              <TableCell
                className="w-9 min-w-9 max-w-9 text-center px-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) =>
                    onToggleOne?.(supplier.id, Boolean(checked))
                  }
                  className="h-3.5 w-3.5 translate-y-[1px]"
                  aria-label={`Chọn ${supplier.name}`}
                />
              </TableCell>

              {/* 1. Tên đối tượng cung cấp (Tổ chức / Cá nhân) */}
              <TableCell className="font-normal py-2.5">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold ${
                      isOrg
                        ? 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300'
                        : 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300'
                    }`}
                  >
                    {isOrg ? (
                      <Building2 className="h-4 w-4" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-foreground block truncate hover:text-primary">
                      {supplier.name}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] h-4.5 px-1.5 font-normal ${
                          isOrg
                            ? 'border-sky-200 text-sky-700 bg-sky-50/50'
                            : 'border-violet-200 text-violet-700 bg-violet-50/50'
                        }`}
                      >
                        {isOrg ? 'Tổ chức' : 'Cá nhân'}
                      </Badge>
                      {isOrg && supplier.taxCode && (
                        <span className="text-[11px] text-muted-foreground font-mono">
                          MST: {supplier.taxCode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* 2. Người liên hệ (Luôn là cá nhân) */}
              <TableCell className="py-2.5">
                <div className="min-w-0">
                  <span className="font-medium text-foreground block truncate">
                    {supplier.contactPersonName}
                  </span>
                  <span className="text-[11px] text-muted-foreground block truncate mt-0.5">
                    {supplier.contactPersonRole}
                  </span>
                </div>
              </TableCell>

              {/* 3. Điện thoại & Email */}
              <TableCell className="py-2.5" onClick={(e) => e.stopPropagation()}>
                <ContactCell
                  phone={supplier.contactPhone}
                  email={supplier.contactEmail}
                  masked
                  showCallButton
                />
              </TableCell>

              {/* 4. Lĩnh vực cung cấp */}
              <TableCell className="py-2.5">
                <Badge
                  variant="outline"
                  className="text-xs font-normal border-border/80 bg-muted/40"
                >
                  {supplier.category}
                </Badge>
              </TableCell>

              {/* 5. Địa chỉ / Trụ sở */}
              <TableCell className="py-2.5">
                <div className="flex items-center gap-1 text-muted-foreground max-w-[240px]">
                  <MapPin className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                  <span className="truncate text-xs">{supplier.address}</span>
                </div>
              </TableCell>

              {/* 6. Đánh giá & Trạng thái */}
              <TableCell className="py-2.5">
                <div className="flex flex-col gap-1">
                  {supplier.rating && (
                    <div className="flex items-center gap-1 text-xs font-medium text-amber-600">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{supplier.rating.toFixed(1)}</span>
                    </div>
                  )}
                  <Badge variant="outline" className={`text-[10px] h-4.5 px-1.5 w-fit ${statusColors.badge}`}>
                    {activeStatus ? 'Đang hợp tác' : 'Tạm dừng'}
                  </Badge>
                </div>
              </TableCell>

              {/* 7. Thao tác */}
              <TableCell
                className="text-right py-2.5"
                onClick={(e) => e.stopPropagation()}
              >
                <DataTableActions
                  onEdit={() => onEdit(supplier)}
                  onDelete={() => onDelete(supplier)}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
