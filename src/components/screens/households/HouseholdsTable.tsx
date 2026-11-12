'use client'

import { Users, Home, MapPin, GraduationCap, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  EmptyState,
  EntityCell,
  ContactCell,
} from '@/components/shared'
import { formatCurrency } from '@/lib/format'
import type { Household } from '@/mocks/households'

interface HouseholdsTableProps {
  households: Household[]
  onRowClick: (household: Household) => void
  onEdit: (household: Household) => void
}

const COLUMNS: Array<{ label: string; className?: string }> = [
  { label: 'Hộ gia đình', className: 'min-w-[220px]' },
  { label: 'Đại diện chính (Phụ huynh)', className: 'min-w-[190px]' },
  { label: 'Thành viên & Con theo học', className: 'min-w-[230px]' },
  { label: 'Cơ sở & Địa chỉ', className: 'min-w-[210px]' },
  { label: 'Tài chính & Công nợ', className: 'min-w-[170px]' },
  { label: 'Hạng gia đình', className: 'min-w-[110px]' },
]

export function HouseholdsTable({
  households,
  onRowClick,
}: HouseholdsTableProps) {
  if (households.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <EmptyState
          icon={<Home className="h-7 w-7 text-muted-foreground" />}
          title="Không tìm thấy hộ gia đình nào phù hợp"
          description="Vui lòng thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm."
        />
      </div>
    )
  }

  return (
    <Table containerClassName="min-w-full" className="min-w-[1150px] text-xs">
      <TableHeader>
        <TableRow className="bg-muted/60 hover:bg-muted/60 [&>th]:h-8 [&>th]:py-1 [&>th]:text-xs [&>th]:font-normal">
          {COLUMNS.map((col) => (
            <TableHead key={col.label} className={col.className}>
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {households.map((h) => {
          const childrenMembers = h.members.filter((m) => m.role === 'student')

          return (
            <TableRow
              key={h.id}
              className="cursor-pointer hover:bg-muted/40 transition-colors"
              onClick={() => onRowClick(h)}
            >
              {/* 1. Mã & Tên Hộ gia đình */}
              <TableCell className="py-2.5">
                <EntityCell
                  name={h.name || h.familyName || ''}
                  supporting={h.code}
                />
              </TableCell>

              {/* 2. Đại diện chính (Phụ huynh) */}
              <TableCell className="py-2.5" onClick={(e) => e.stopPropagation()}>
                <ContactCell
                  name={`${h.primaryParentName} (${h.primaryParentRole})`}
                  phone={h.primaryPhone}
                  email={h.primaryEmail}
                  masked={true}
                  nameClassName="text-xs font-medium"
                  phoneClassName="text-xs font-mono text-muted-foreground"
                />
              </TableCell>

              {/* 3. Thành viên & Con theo học */}
              <TableCell className="py-2.5">
                <div className="space-y-1 max-w-[230px]">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Users className="h-3 w-3 shrink-0 text-primary" />
                    <span>
                      {h.membersCount.parents} Phụ huynh • {h.membersCount.children} Con
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {childrenMembers.map((c) => (
                      <span
                        key={c.id}
                        className="inline-flex items-center gap-1 text-[11px] bg-muted/80 px-1.5 py-0.5 rounded border border-border/60 text-foreground"
                      >
                        <GraduationCap className="h-2.5 w-2.5 text-primary" />
                        <span className="truncate max-w-[130px]">{c.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </TableCell>

              {/* 4. Cơ sở & Địa chỉ */}
              <TableCell className="py-2.5">
                <div className="space-y-0.5 max-w-[210px]">
                  <p className="text-xs font-medium text-foreground truncate">{h.branch}</p>
                  <p className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
                    <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <span className="truncate">{h.address}</span>
                  </p>
                </div>
              </TableCell>

              {/* 5. Tài chính & Công nợ */}
              <TableCell className="py-2.5">
                <div className="space-y-0.5">
                  <p className="text-xs text-foreground font-medium">
                    Tổng chi: {formatCurrency(h.totalSpent)}
                  </p>
                  {h.totalDebt > 0 ? (
                    <p className="flex items-center gap-1 text-[11px] font-semibold text-destructive">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      Nợ: {formatCurrency(h.totalDebt)}
                    </p>
                  ) : (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                      Không có công nợ
                    </p>
                  )}
                </div>
              </TableCell>

              {/* 6. Hạng gia đình */}
              <TableCell className="py-2.5">
                <Badge
                  variant="secondary"
                  className={
                    h.tier === 'VIP'
                      ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      : h.tier === 'Gold'
                      ? 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                      : 'bg-muted text-muted-foreground'
                  }
                >
                  {h.tier}
                </Badge>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
