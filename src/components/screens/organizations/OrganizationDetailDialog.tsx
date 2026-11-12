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
  Building2,
  Users,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  CreditCard,
  UserCheck,
  FileText,
  Calendar,
} from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import type { Organization } from '@/mocks/organizations'
import { getStatusColors } from '@/lib/statusColors'

interface OrganizationDetailDialogProps {
  open: boolean
  organization: Organization | null
  onOpenChange: (open: boolean) => void
}

export function OrganizationDetailDialog({
  open,
  organization,
  onOpenChange,
}: OrganizationDetailDialogProps) {
  if (!organization) return null

  const isFamily = organization.type === 'family'
  const parents = organization.members?.filter((m) => m.role === 'parent') ?? []
  const children = organization.members?.filter((m) => m.role === 'student') ?? []
  const tierColors = getStatusColors(
    organization.tier === 'VIP'
      ? 'success'
      : organization.tier === 'Gold'
      ? 'warning'
      : 'neutral'
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-5 text-xs">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3 pr-6">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-base font-semibold ${
                  isFamily
                    ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300'
                }`}
              >
                {isFamily ? (
                  <Home className="h-5 w-5" />
                ) : (
                  <Building2 className="h-5 w-5" />
                )}
              </div>
              <div>
                <DialogTitle className="text-base font-semibold leading-tight">
                  {organization.name}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className={`text-[11px] h-5 px-2 font-normal ${
                      isFamily
                        ? 'border-amber-200 text-amber-700 bg-amber-50/50'
                        : 'border-sky-200 text-sky-700 bg-sky-50/50'
                    }`}
                  >
                    {isFamily ? 'Hộ gia đình' : 'Tổ chức / Doanh nghiệp'}
                  </Badge>
                  <span className="font-mono text-muted-foreground text-[11px]">
                    {organization.taxCode ? `MST: ${organization.taxCode}` : organization.code}
                  </span>
                  <Badge variant="outline" className={`text-[11px] h-5 px-2 ${tierColors.badge}`}>
                    Hạng {organization.tier}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* 1. NGƯỜI ĐẠI DIỆN / ĐẦU MỐI LIÊN HỆ (LUÔN LÀ CÁ NHÂN) */}
          <div className="rounded-lg border border-border/80 bg-muted/20 p-3.5 space-y-2.5">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <UserCheck className="h-4 w-4 text-primary" />
              <span>Người đại diện / Đầu mối liên hệ chính (Cá nhân)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-muted-foreground block text-[11px]">Họ và tên</span>
                <span className="font-medium text-foreground">{organization.primaryContactName}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Vai trò / Chức danh</span>
                <span className="font-medium text-foreground">{organization.primaryContactRole}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Số điện thoại liên lạc</span>
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <Phone className="h-3 w-3 text-emerald-600" />
                  {/* Trong Dialog chi tiết, hiển thị SĐT ĐẦY ĐỦ theo quy định bảo mật */}
                  <span className="font-mono">{organization.primaryPhone}</span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Địa chỉ Email</span>
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <Mail className="h-3 w-3 text-sky-600" />
                  <span>{organization.primaryEmail || 'Chưa cập nhật'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. ĐỊA CHỈ TRỤ SỞ / CƯ TRÚ & CƠ SỞ LIÊN KẾT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/80 bg-background p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Địa chỉ trụ sở / Nơi cư trú</span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed pt-1">
                {organization.address}
              </p>
            </div>

            <div className="rounded-lg border border-border/80 bg-background p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Tài chính & Cơ sở phụ trách</span>
              </div>
              <div className="space-y-1 pt-1">
                <div>
                  <span className="text-muted-foreground text-[11px]">Cơ sở liên kết: </span>
                  <span className="font-medium text-foreground">{organization.branch}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px]">Tổng chi tiêu: </span>
                  <span className="font-medium text-foreground">{formatCurrency(organization.totalSpent)}</span>
                </div>
                {organization.totalDebt > 0 && (
                  <div>
                    <span className="text-destructive font-semibold text-[11px]">Công nợ hiện tại: </span>
                    <span className="font-semibold text-destructive">{formatCurrency(organization.totalDebt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. THÀNH VIÊN GIA ĐÌNH HOẶC THÔNG TIN TỔ CHỨC */}
          {isFamily ? (
            <div className="rounded-lg border border-border/80 bg-muted/20 p-3.5 space-y-3">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <Users className="h-4 w-4 text-primary" />
                <span>Danh sách thành viên gia đình</span>
              </div>

              {/* Phụ huynh */}
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">
                  Phụ huynh ({parents.length})
                </p>
                <div className="space-y-1.5">
                  {parents.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between bg-background p-2 rounded border border-border/60"
                    >
                      <div>
                        <span className="font-medium text-foreground">{p.name}</span>
                        <span className="text-muted-foreground ml-1.5">({p.relationship})</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground font-mono">
                        {p.phone && <span>{p.phone}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Con cái theo học */}
              {children.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">
                    Con theo học tại trung tâm ({children.length})
                  </p>
                  <div className="space-y-1.5">
                    {children.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between bg-background p-2 rounded border border-border/60"
                      >
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-3.5 w-3.5 text-primary" />
                          <span className="font-medium text-foreground">{c.name}</span>
                          {c.studentCode && (
                            <span className="font-mono text-muted-foreground text-[10px]">
                              ({c.studentCode})
                            </span>
                          )}
                        </div>
                        {c.currentClass && (
                          <Badge variant="outline" className="text-[10px] bg-muted/40 font-mono">
                            {c.currentClass}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-sky-200/80 bg-sky-50/30 dark:border-sky-900 dark:bg-sky-950/20 p-3.5 space-y-2.5">
              <div className="flex items-center gap-1.5 font-semibold text-sky-900 dark:text-sky-300">
                <Building2 className="h-4 w-4 text-sky-600" />
                <span>Nội dung hợp tác & Quy mô liên kết đào tạo</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Loại hình tổ chức</span>
                  <span className="font-medium text-foreground">{organization.category || 'Doanh nghiệp'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Quy mô học viên liên kết</span>
                  <span className="font-semibold text-primary">{organization.membersCount?.students ?? 0} học viên</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground block text-[11px]">Ghi chú điều khoản hợp đồng</span>
                  <p className="text-foreground leading-relaxed pt-0.5">{organization.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* 4. GHI CHÚ & NGÀY KHỞI TẠO */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/60">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              <span>Khởi tạo: {new Date(organization.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
            {organization.assignedSale && (
              <span>Phụ trách: {organization.assignedSale}</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
