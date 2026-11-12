'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  Home,
  Users,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  CreditCard,
  UserCheck,
} from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import type { Household } from '@/mocks/households'

interface HouseholdDetailDialogProps {
  open: boolean
  household: Household | null
  onOpenChange: (open: boolean) => void
}

export function HouseholdDetailDialog({
  open,
  household,
  onOpenChange,
}: HouseholdDetailDialogProps) {
  if (!household) return null

  const parents = household.members.filter((m) => m.role === 'parent')
  const children = household.members.filter((m) => m.role === 'student')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-5">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2 pr-6">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold leading-tight">
                  {household.familyName}
                </DialogTitle>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  Mã Hộ gia đình: {household.code} • Cơ sở: {household.branch}
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className={
                household.tier === 'VIP'
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-sky-100 text-sky-800 border-sky-300'
              }
            >
              Hạng: {household.tier}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-3 text-xs">
          {/* 1. Khối Phụ huynh đại diện */}
          <div className="rounded-lg border border-border p-3.5 space-y-2 bg-muted/20">
            <h4 className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
              <UserCheck className="h-4 w-4 text-primary" />
              Thông tin Phụ huynh đại diện
            </h4>
            <div className="grid grid-cols-2 gap-3 pt-1">
              {parents.map((p) => (
                <div key={p.id} className="p-2.5 rounded-md bg-background border border-border/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{p.name}</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">{p.relationship}</Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground pt-0.5">
                    <Phone className="h-3 w-3 text-primary/70 shrink-0" />
                    <span className="font-mono text-foreground font-medium">{p.phone || '—'}</span>
                  </div>
                  {p.email && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="h-3 w-3 text-primary/70 shrink-0" />
                      <span className="truncate">{p.email}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. Khối Học viên (Các con trong gia đình) */}
          <div className="rounded-lg border border-border p-3.5 space-y-2 bg-muted/20">
            <h4 className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
              <GraduationCap className="h-4 w-4 text-primary" />
              Các con đang theo học ({children.length})
            </h4>
            <div className="space-y-2 pt-1">
              {children.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2.5 rounded-md bg-background border border-border/60"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-xs">{c.name}</span>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        ({c.studentCode})
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Lớp hiện tại: <span className="font-medium text-foreground">{c.currentClass || 'Chưa xếp lớp'}</span>
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[11px] text-emerald-700 bg-emerald-50 border-emerald-200">
                    {c.status === 'active' ? 'Đang học' : c.status === 'reserve' ? 'Bảo lưu' : 'Chờ xếp lớp'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Địa chỉ & Cơ sở gần nhất */}
          <div className="rounded-lg border border-border p-3.5 space-y-2 bg-muted/20">
            <h4 className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
              <MapPin className="h-4 w-4 text-primary" />
              Địa chỉ nhà & Khoảng cách cơ sở
            </h4>
            <p className="text-xs text-foreground font-medium">{household.address}</p>
            {household.nearestBranches && household.nearestBranches.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {household.nearestBranches.map((nb) => (
                  <span
                    key={nb.name}
                    className="inline-flex items-center gap-1 text-[11px] bg-background px-2 py-1 rounded border border-border/70 text-muted-foreground"
                  >
                    <span>{nb.name}:</span>
                    <strong className="text-foreground font-semibold">{nb.distance}</strong>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 4. Tài chính gia đình & Nhân sự phụ trách */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-3 space-y-1.5 bg-muted/20">
              <h4 className="font-semibold text-foreground flex items-center gap-1 text-xs">
                <CreditCard className="h-3.5 w-3.5 text-primary" />
                Tài chính gia đình
              </h4>
              <p className="text-xs text-foreground">
                Tổng chi tiêu: <strong>{formatCurrency(household.totalSpent)}</strong>
              </p>
              <p className="text-xs text-foreground">
                Công nợ hiện tại:{' '}
                <strong className={household.totalDebt > 0 ? 'text-destructive font-bold' : 'text-emerald-600'}>
                  {household.totalDebt > 0 ? formatCurrency(household.totalDebt) : '0 đ'}
                </strong>
              </p>
            </div>

            <div className="rounded-lg border border-border p-3 space-y-1.5 bg-muted/20">
              <h4 className="font-semibold text-foreground flex items-center gap-1 text-xs">
                <Users className="h-3.5 w-3.5 text-primary" />
                Nhân sự phụ trách
              </h4>
              <p className="text-xs text-muted-foreground">
                Tư vấn tuyển sinh: <strong className="text-foreground">{household.assignedSale || '—'}</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                Chăm sóc khách hàng (CSM): <strong className="text-foreground">{household.assignedCsm || '—'}</strong>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
