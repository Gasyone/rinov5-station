'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  UserCheck,
  Star,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Globe,
  FileText,
  Calendar,
} from 'lucide-react'
import type { Supplier } from '@/mocks/suppliers'
import { getStatusColors } from '@/lib/statusColors'

interface SupplierDetailDialogProps {
  open: boolean
  supplier: Supplier | null
  onOpenChange: (open: boolean) => void
}

export function SupplierDetailDialog({
  open,
  supplier,
  onOpenChange,
}: SupplierDetailDialogProps) {
  if (!supplier) return null

  const isOrg = supplier.type === 'organization'
  const activeStatus = supplier.status === 'active'
  const statusColors = getStatusColors(activeStatus ? 'success' : 'neutral')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-5">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3 pr-6">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-base font-semibold ${
                  isOrg
                    ? 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300'
                    : 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300'
                }`}
              >
                {isOrg ? (
                  <Building2 className="h-5 w-5" />
                ) : (
                  <UserCheck className="h-5 w-5" />
                )}
              </div>
              <div>
                <DialogTitle className="text-base font-semibold leading-tight">
                  {supplier.name}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className={`text-[11px] h-5 px-2 font-normal ${
                      isOrg
                        ? 'border-sky-200 text-sky-700 bg-sky-50/50'
                        : 'border-violet-200 text-violet-700 bg-violet-50/50'
                    }`}
                  >
                    {isOrg ? 'Tổ chức / Doanh nghiệp' : 'Cá nhân cung cấp'}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[11px] h-5 px-2 font-normal border-border/80 bg-muted/40"
                  >
                    {supplier.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-[11px] h-5 px-2 ${statusColors.badge}`}
                  >
                    {activeStatus ? 'Đang hợp tác' : 'Tạm dừng'}
                  </Badge>
                  {supplier.rating && (
                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{supplier.rating.toFixed(1)} / 5.0</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-xs">
          {/* 1. NGƯỜI LIÊN HỆ (LUÔN LÀ CÁ NHÂN) */}
          <div className="rounded-lg border border-border/80 bg-muted/20 p-3.5 space-y-2.5">
            <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
              <UserCheck className="h-4 w-4 text-primary" />
              <span>Người liên hệ phụ trách (Cá nhân)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-muted-foreground block text-[11px]">Họ và tên</span>
                <span className="font-medium text-foreground text-xs">{supplier.contactPersonName}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Chức danh / Vai trò</span>
                <span className="font-medium text-foreground text-xs">{supplier.contactPersonRole}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Số điện thoại liên lạc</span>
                <div className="flex items-center gap-1.5 font-medium text-foreground text-xs">
                  <Phone className="h-3 w-3 text-emerald-600" />
                  {/* Trong dialog chi tiết, hiển thị SĐT đầy đủ theo quy định bảo mật */}
                  <span className="font-mono">{supplier.contactPhone}</span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Địa chỉ Email</span>
                <div className="flex items-center gap-1.5 font-medium text-foreground text-xs">
                  <Mail className="h-3 w-3 text-sky-600" />
                  <span>{supplier.contactEmail || 'Chưa cập nhật'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. THÔNG TIN DOANH NGHIỆP / TỔ CHỨC (NẾU LÀ ORGANIZATION) */}
          {isOrg && (
            <div className="rounded-lg border border-sky-200/80 bg-sky-50/30 dark:border-sky-900 dark:bg-sky-950/20 p-3.5 space-y-2.5">
              <div className="flex items-center gap-1.5 font-semibold text-sky-900 dark:text-sky-300 text-xs">
                <Building2 className="h-4 w-4 text-sky-600" />
                <span>Thông tin pháp nhân & Tổ chức</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground block text-[11px]">Tên đầy đủ công ty / tổ chức</span>
                  <span className="font-medium text-foreground text-xs">{supplier.orgName || supplier.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Mã số thuế (MST)</span>
                  <span className="font-mono font-medium text-foreground text-xs">{supplier.taxCode || 'Chưa có MST'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Trang web / Cổng thông tin</span>
                  {supplier.website ? (
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-medium text-primary hover:underline text-xs"
                    >
                      <Globe className="h-3 w-3" />
                      <span className="truncate">{supplier.website}</span>
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-xs">Chưa cập nhật</span>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground block text-[11px]">Địa chỉ trụ sở chính</span>
                  <span className="text-foreground text-xs">{supplier.orgAddress || supplier.address}</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. ĐỊA CHỈ & TÀI KHOẢN NGÂN HÀNG */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/80 bg-background p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Địa chỉ giao dịch / kho bãi</span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed pt-1">{supplier.address}</p>
            </div>

            <div className="rounded-lg border border-border/80 bg-background p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Tài khoản ngân hàng thanh toán</span>
              </div>
              {supplier.bankInfo ? (
                <div className="space-y-0.5 pt-1 text-xs">
                  <div className="font-medium text-foreground">{supplier.bankInfo.bankName}</div>
                  <div className="font-mono text-primary font-semibold">{supplier.bankInfo.accountNumber}</div>
                  <div className="text-[11px] text-muted-foreground uppercase">{supplier.bankInfo.accountHolder}</div>
                </div>
              ) : (
                <p className="text-muted-foreground text-xs italic pt-1">Chưa cập nhật tài khoản</p>
              )}
            </div>
          </div>

          {/* 4. GHI CHÚ HỢP TÁC & THỜI GIAN TẠO */}
          <div className="rounded-lg border border-border/80 bg-muted/20 p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Ghi chú hợp tác & Chiết khấu</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {supplier.notes || 'Không có ghi chú thêm.'}
            </p>
            <div className="flex items-center gap-1.5 pt-2 text-[11px] text-muted-foreground border-t border-border/50">
              <Calendar className="h-3 w-3" />
              <span>
                Ngày khởi tạo hồ sơ:{' '}
                {new Date(supplier.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
