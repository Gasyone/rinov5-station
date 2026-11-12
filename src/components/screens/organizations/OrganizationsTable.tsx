'use client'

import {
  Home,
  Building2,
  MapPin,
  GraduationCap,
  AlertCircle,
  Users,
} from 'lucide-react'
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
import { formatCurrency } from '@/lib/format'
import type { Organization } from '@/mocks/organizations'
import { getStatusColors } from '@/lib/statusColors'

interface OrganizationsTableProps {
  organizations: Organization[]
  selectedIds?: Set<string>
  onToggleAll?: (checked: boolean) => void
  onToggleOne?: (id: string, checked: boolean) => void
  onRowClick: (org: Organization) => void
  onEdit: (org: Organization) => void
  onDelete: (org: Organization) => void
}

const COLUMNS: Array<{ label: string; className?: string }> = [
  { label: 'Tổ chức / Hộ gia đình', className: 'min-w-[250px]' },
  { label: 'Người đại diện (Cá nhân)', className: 'min-w-[190px]' },
  { label: 'Điện thoại & Email', className: 'min-w-[180px]' },
  { label: 'Địa chỉ trụ sở / Cư trú', className: 'min-w-[220px]' },
  { label: 'Thành viên / Quy mô', className: 'min-w-[200px]' },
  { label: 'Cơ sở liên kết', className: 'min-w-[160px]' },
  { label: 'Tài chính & Công nợ', className: 'min-w-[170px]' },
  { label: 'Hạng', className: 'min-w-[90px]' },
  { label: '', className: 'w-16 text-right' },
]

export function OrganizationsTable({
  organizations,
  selectedIds = new Set(),
  onToggleAll,
  onToggleOne,
  onRowClick,
  onEdit,
  onDelete,
}: OrganizationsTableProps) {
  if (organizations.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <EmptyState
          icon={<Building2 className="h-7 w-7 text-muted-foreground" />}
          title="Không tìm thấy tổ chức hoặc hộ gia đình nào phù hợp"
          description="Vui lòng thử điều chỉnh lại bộ lọc phân loại hoặc từ khóa tìm kiếm."
        />
      </div>
    )
  }

  const isAllSelected =
    organizations.length > 0 && organizations.every((o) => selectedIds.has(o.id))

  return (
    <Table containerClassName="min-w-full" className="min-w-[1300px] text-xs">
      <TableHeader>
        <TableRow className="bg-muted/60 hover:bg-muted/60 [&>th]:h-8 [&>th]:py-1 [&>th]:text-xs [&>th]:font-normal">
          <TableHead className="w-9 min-w-9 max-w-9 text-center px-2">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={(checked) => onToggleAll?.(Boolean(checked))}
              className="h-3.5 w-3.5 translate-y-[1px]"
              aria-label="Chọn tất cả đối tượng"
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
        {organizations.map((org) => {
          const isSelected = selectedIds.has(org.id)
          const isFamily = org.type === 'family'
          const childrenMembers = org.members?.filter((m) => m.role === 'student') ?? []
          const tierColors = getStatusColors(
            org.tier === 'VIP' ? 'success' : org.tier === 'Gold' ? 'warning' : 'neutral'
          )

          return (
            <TableRow
              key={org.id}
              data-state={isSelected ? 'selected' : undefined}
              className="cursor-pointer hover:bg-muted/40 transition-colors"
              onClick={() => onRowClick(org)}
            >
              {/* Checkbox */}
              <TableCell
                className="w-9 min-w-9 max-w-9 text-center px-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) =>
                    onToggleOne?.(org.id, Boolean(checked))
                  }
                  className="h-3.5 w-3.5 translate-y-[1px]"
                  aria-label={`Chọn ${org.name}`}
                />
              </TableCell>

              {/* 1. Tên tổ chức / Hộ gia đình */}
              <TableCell className="font-normal py-2.5">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold ${
                      isFamily
                        ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300'
                    }`}
                  >
                    {isFamily ? (
                      <Home className="h-4 w-4" />
                    ) : (
                      <Building2 className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-foreground block truncate hover:text-primary">
                      {org.name}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] h-4.5 px-1.5 font-normal ${
                          isFamily
                            ? 'border-amber-200 text-amber-700 bg-amber-50/50'
                            : 'border-sky-200 text-sky-700 bg-sky-50/50'
                        }`}
                      >
                        {isFamily ? 'Hộ gia đình' : 'Doanh nghiệp'}
                      </Badge>
                      {org.taxCode ? (
                        <span className="text-[11px] text-muted-foreground font-mono">
                          MST: {org.taxCode}
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {org.code}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* 2. Đại diện / Người liên hệ (Luôn là cá nhân) */}
              <TableCell className="py-2.5">
                <div className="min-w-0">
                  <span className="font-medium text-foreground block truncate">
                    {org.primaryContactName}
                  </span>
                  <span className="text-[11px] text-muted-foreground block truncate mt-0.5">
                    {org.primaryContactRole}
                  </span>
                </div>
              </TableCell>

              {/* 3. Điện thoại & Email */}
              <TableCell className="py-2.5" onClick={(e) => e.stopPropagation()}>
                <ContactCell
                  phone={org.primaryPhone}
                  email={org.primaryEmail}
                  masked
                  showCallButton
                />
              </TableCell>

              {/* 4. ĐỊA CHỈ TRỤ SỞ / CƯ TRÚ (BẮT BUỘC THEO YÊU CẦU) */}
              <TableCell className="py-2.5">
                <div className="flex items-center gap-1.5 text-muted-foreground max-w-[220px]">
                  <MapPin className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                  <span className="truncate text-xs" title={org.address}>
                    {org.address}
                  </span>
                </div>
              </TableCell>

              {/* 5. Thành viên / Quy mô */}
              <TableCell className="py-2.5">
                {isFamily ? (
                  <div className="space-y-1 max-w-[200px]">
                    <div className="text-[11px] text-muted-foreground">
                      {org.membersCount?.parents ?? 1} phụ huynh • {org.membersCount?.children ?? 1} con
                    </div>
                    {childrenMembers.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {childrenMembers.map((c) => (
                          <span
                            key={c.id}
                            className="inline-flex items-center gap-1 text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border/60 text-foreground truncate max-w-[120px]"
                          >
                            <GraduationCap className="h-2.5 w-2.5 text-primary" />
                            <span className="truncate">{c.name}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Badge variant="secondary" className="gap-1 text-[11px] font-normal">
                      <Users className="h-3 w-3 text-primary" />
                      <span>{org.membersCount?.students ?? 0} học viên theo học</span>
                    </Badge>
                  </div>
                )}
              </TableCell>

              {/* 6. Cơ sở liên kết */}
              <TableCell className="py-2.5">
                <span className="text-xs font-medium text-foreground truncate block max-w-[150px]">
                  {org.branch}
                </span>
              </TableCell>

              {/* 7. Tài chính & Công nợ */}
              <TableCell className="py-2.5">
                <div className="space-y-0.5">
                  <p className="text-xs text-foreground font-medium">
                    Chi: {formatCurrency(org.totalSpent)}
                  </p>
                  {org.totalDebt > 0 ? (
                    <p className="flex items-center gap-1 text-[11px] font-semibold text-destructive">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      Nợ: {formatCurrency(org.totalDebt)}
                    </p>
                  ) : (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                      Không nợ
                    </p>
                  )}
                </div>
              </TableCell>

              {/* 8. Hạng */}
              <TableCell className="py-2.5">
                <Badge variant="outline" className={`text-[10px] h-5 px-1.5 ${tierColors.badge}`}>
                  {org.tier}
                </Badge>
              </TableCell>

              {/* 9. Thao tác */}
              <TableCell
                className="text-right py-2.5"
                onClick={(e) => e.stopPropagation()}
              >
                <DataTableActions
                  onEdit={() => onEdit(org)}
                  onDelete={() => onDelete(org)}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
