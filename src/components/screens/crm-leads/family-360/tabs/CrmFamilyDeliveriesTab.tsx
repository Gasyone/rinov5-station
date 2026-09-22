'use client'

import React from 'react'
import {
  Package,
  Truck,
  User,
  CheckCircle2,
  Clock,
  BookOpen,
  Gift,
  Shirt,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { EmptyState } from '@/components/shared'
import type { FamilyDelivery } from '../crmFamily360Types'

interface CrmFamilyDeliveriesTabProps {
  deliveries: FamilyDelivery[]
}

export function CrmFamilyDeliveriesTab({
  deliveries,
}: CrmFamilyDeliveriesTabProps) {
  const completedCount = deliveries.filter((d) => d.status === 'handed_over').length

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('giáo trình') || category.toLowerCase().includes('sách')) {
      return <BookOpen className="h-3 w-3 text-sky-600" />
    }
    if (category.toLowerCase().includes('quà') || category.toLowerCase().includes('balo')) {
      return <Gift className="h-3 w-3 text-amber-600" />
    }
    if (category.toLowerCase().includes('đồng phục') || category.toLowerCase().includes('áo')) {
      return <Shirt className="h-3 w-3 text-indigo-600" />
    }
    return <Package className="h-3 w-3 text-muted-foreground" />
  }

  return (
    <div className="space-y-3.5">
      {/* Metric Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-card border border-border/70 rounded-xl shadow-2xs space-y-1">
          <span className="text-[11px] text-muted-foreground font-medium block">
            Tổng kiện hàng bàn giao gia đình
          </span>
          <p className="text-base font-bold text-foreground">
            {deliveries.length} kiện hàng
          </p>
        </div>

        <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl shadow-2xs space-y-1">
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium block">
            Đã giao thành công
          </span>
          <p className="text-base font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>
              {completedCount}/{deliveries.length} Kiện
            </span>
          </p>
        </div>

        <div className="p-3 bg-card border border-border/70 rounded-xl shadow-2xs space-y-1">
          <span className="text-[11px] text-muted-foreground font-medium block">
            Hình thức giao nhận
          </span>
          <p className="text-base font-bold text-foreground flex items-center gap-1.5">
            <Truck className="h-4 w-4 text-sky-600" />
            <span>Giao tận nhà &amp; Tại quầy</span>
          </p>
        </div>
      </div>

      {/* Danh sách Vận đơn */}
      {deliveries.length === 0 ? (
        <EmptyState
          title="Chưa có vận đơn giao hàng"
          description="Chưa có vận đơn giao nhận giáo trình, sách hoặc quà tặng nào cho gia đình này."
        />
      ) : (
        <div className="space-y-3">
          {deliveries.map((del) => (
            <div
              key={del.id}
              className="rounded-xl border border-border/70 bg-card p-3.5 space-y-2.5 shadow-2xs hover:border-border transition-colors"
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:bg-sky-500/20">
                    <Truck className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-foreground">
                    {del.trackingCode}
                  </span>
                  <Badge variant="outline" className="text-[10px] bg-muted/40">
                    {del.sourceTypeLabel}
                  </Badge>
                  {del.orderNo && (
                    <span className="text-xs text-muted-foreground">
                      (Đơn: <span className="font-mono font-medium text-foreground">{del.orderNo}</span>)
                    </span>
                  )}
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-xs text-foreground font-medium">
                    Học viên: {del.studentName}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Badge className={getStatusBadgeClass(del.status)}>
                    {del.status === 'handed_over'
                      ? 'Đã bàn giao thành công'
                      : del.status === 'shipping'
                      ? 'Đang giao hàng'
                      : 'Chờ xuất kho'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3 text-muted-foreground/70" />
                    Người nhận
                  </span>
                  <p className="font-semibold text-foreground">
                    {del.recipientName} ({del.recipientPhone})
                  </p>
                  <span className="text-[11px] text-muted-foreground truncate block" title={del.shippingAddress}>
                    {del.shippingAddress}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Truck className="h-3 w-3 text-muted-foreground/70" />
                    Hình thức &amp; Đơn vị
                  </span>
                  <p className="font-semibold text-foreground">
                    {del.deliveryMethod === 'shipping' ? 'Giao hàng tận nơi' : 'Nhận tại quầy'}
                  </p>
                  <span className="text-[11px] text-muted-foreground">{del.carrier || 'GHN Express'}</span>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground/70" />
                    Thời gian
                  </span>
                  <p className="font-medium text-foreground">Tạo: {del.createdAt}</p>
                  {del.completedAt && (
                    <span className="text-[11px] text-emerald-600 font-medium block">
                      Hoàn tất: {del.completedAt}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-border/50 space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground block">
                  Danh mục sản phẩm trong kiện ({del.products.length} mặt hàng):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
                  {del.products.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 rounded-md bg-muted/40 border border-border/40 text-xs flex items-center gap-1.5"
                    >
                      {getCategoryIcon(p.category)}
                      <span className="truncate flex-1 font-medium text-foreground" title={p.name}>
                        {p.name}
                      </span>
                      <Badge variant="outline" className="text-[10px] px-1 py-0 font-bold shrink-0">
                        x{p.quantity} {p.unit}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {del.notes && (
                <p className="text-[11px] text-muted-foreground italic bg-muted/20 p-1.5 rounded">
                  Ghi chú giao nhận: {del.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
