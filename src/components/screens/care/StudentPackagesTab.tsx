'use client'

import React, { useMemo, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { OrderDetailDialog } from '@/components/screens/orders/OrderDetailDialog'
import { type Order } from '@/mocks/orders'
import { cn } from '@/lib/utils'
import { getStudentOrders } from './student-orders/studentOrdersTypes'
import { getStudentEnrolledPackages } from './student-packages/studentPackagesMock'
import { StudentPackageCardItem } from './student-packages/StudentPackageCardItem'
import type { StudentPackagesTabProps } from './student-packages/studentPackagesTypes'

export function StudentPackagesTab({
  studentId,
  studentName,
  selectedPackageId = 'pkg-1',
  onSelectPackageId,
  onOpenLeaveReserve,
  onRenewalClick,
}: StudentPackagesTabProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Danh sách các gói học theo chương trình
  const allPackages = useMemo(() => {
    return getStudentEnrolledPackages(studentId, studentName)
  }, [studentId, studentName])

  // Danh sách đơn hàng để mở OrderDetailDialog khi nhấp vào mã đơn liên kết
  const studentOrders = useMemo(() => {
    return getStudentOrders(studentId, studentName)
  }, [studentId, studentName])

  // Danh sách các gói học tương ứng với chương trình được chọn ở panel trái
  const displayedPackages = useMemo(() => {
    const current = allPackages.find((p) => p.id === selectedPackageId) || allPackages[0]
    if (!current) return allPackages

    // Nếu chọn lịch sử gói cũ (pkg-3 hoặc status expired)
    if (current.id === 'pkg-3' || current.status === 'expired') {
      const expired = allPackages.filter((p) => p.status === 'expired' || p.id === 'pkg-3')
      return expired.length > 0 ? expired : [current]
    }

    // Lọc theo chương trình / môn học đang chọn ở panel trái
    const matched = allPackages.filter(
      (p) =>
        p.id === current.id ||
        (p.subject === current.subject && p.status !== 'expired')
    )
    return matched.length > 0 ? matched : [current]
  }, [allPackages, selectedPackageId])

  // Xử lý khi bấm xem chi tiết đơn hàng gốc (từ link ở header thẻ gói)
  const handleViewOrder = useCallback(
    (orderNo: string) => {
      const matched = studentOrders.find((o) => o.orderNo === orderNo || o.id === orderNo)
      if (matched) {
        setSelectedOrder(matched)
      } else {
        toast.info(`Thông tin đơn hàng ${orderNo}`)
      }
    },
    [studentOrders]
  )

  return (
    <div className="space-y-3.5 text-left">
      {/* ── DANH SÁCH GÓI ĐĂNG KÝ (ĐƯỢC CHỌN TỪ PANEL TRÁI) ── */}
      {displayedPackages.length > 0 ? (
        <div className="space-y-3">
          {displayedPackages.map((pkgItem) => (
            <StudentPackageCardItem
              key={pkgItem.id}
              pkg={pkgItem}
              onViewOrder={handleViewOrder}
              onRenewalClick={onRenewalClick}
              onOpenLeaveReserve={onOpenLeaveReserve}
              onNavigateToLearning={(p) => {
                toast.success(`Đã đồng bộ gói [${p.packageName}] sang góc nhìn Học tập bên trái!`)
              }}
            />
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-border/80 bg-muted/15 text-center text-xs text-muted-foreground">
          Không có gói đăng ký nào cho chương trình này.
        </div>
      )}

      {/* Modal Xem chi tiết Đơn hàng liên kết */}
      {selectedOrder && (
        <OrderDetailDialog
          order={selectedOrder}
          onOpenChange={(open) => {
            if (!open) setSelectedOrder(null)
          }}
        />
      )}
    </div>
  )
}
