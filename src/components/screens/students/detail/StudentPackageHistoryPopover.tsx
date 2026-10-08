'use client'

import { useState, useMemo } from 'react'
import {
  History,
  ExternalLink,
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import type { StudentProgram, StudentPackage } from './studentDetailTypes'
import { OrderDetailDialog } from '@/components/screens/orders/OrderDetailDialog'
import { mockOrders, type Order } from '@/mocks/orders'

export interface StudentPackageHistoryPopoverProps {
  program: StudentProgram
  packages?: StudentPackage[]
  className?: string
}

/**
 * Loại bỏ các hậu tố '(Cũ)', '(Hết hạn)', '(Hết buổi)' theo yêu cầu người dùng
 */
function cleanPackageName(name: string): string {
  return name
    .replace(/\s*\((?:Cũ|cũ|Hết hạn|hết hạn|Hết buổi|hết buổi)\)/gi, '')
    .trim()
}

/**
 * Phân tích chi tiết thành phần dòng 2: Môn, Loại GV (VN, Phil, Mix, Native), Loại lớp (1:6, 1:4...)
 */
function getPackageSpecParts(pkg: StudentPackage, program: StudentProgram): {
  subjectTitle: string
  teacherType: string
  classModel: string
} {
  const pkgNameLower = (pkg.packageName || '').toLowerCase()
  const progNameLower = (program.name || '').toLowerCase()
  const isEnglish =
    program.subject === 'english' ||
    progNameLower.includes('tiếng anh') ||
    progNameLower.includes('ielts') ||
    pkgNameLower.includes('tiếng anh') ||
    pkgNameLower.includes('ielts') ||
    pkgNameLower.includes('speaking')

  // Môn / Chương trình
  const subjectTitle = isEnglish ? 'Tiếng Anh' : 'Toán học'

  // Loại GV: VN, Phil, Mix, Native (ưu tiên thuộc tính trên pkg nếu có, hoặc suy ra từ tên)
  let teacherType = pkg.teacherType || 'VN'
  if (!pkg.teacherType) {
    if (pkgNameLower.includes('native') || pkgNameLower.includes('bản ngữ') || pkgNameLower.includes('speaking')) {
      teacherType = 'Native'
    } else if (pkgNameLower.includes('phil') || pkgNameLower.includes('philippines') || pkgNameLower.includes('standard')) {
      teacherType = 'Phil'
    } else if (pkgNameLower.includes('mix') || pkgNameLower.includes('intensive') || pkgNameLower.includes('giao tiếp')) {
      teacherType = 'Mix'
    } else {
      teacherType = 'VN'
    }
  }

  // Loại lớp: 1:1, 1:4, 1:6, 1:10...
  let classModel = '1:6'
  const modelMatch = `${pkg.packageName} ${program.level || ''} ${program.name}`.match(/1:(10|15|20|6|4|1)/)
  if (modelMatch) {
    classModel = `1:${modelMatch[1]}`
  } else if (pkgNameLower.includes('1:4')) {
    classModel = '1:4'
  } else if (pkgNameLower.includes('1:1')) {
    classModel = '1:1'
  }

  return { subjectTitle, teacherType, classModel }
}

function getPackageTagBadge(pkg: StudentPackage): { label: string; badgeClass: string } | null {
  if (pkg.packageTag === 'transferred' || pkg.status === 'transferred') {
    return {
      label: 'Gói chuyển',
      badgeClass: getStatusBadgeClass('goi_chuyen'),
    }
  }
  if (pkg.packageTag === 'cancelled' || pkg.status === 'cancelled') {
    return {
      label: 'Gói hủy',
      badgeClass: getStatusBadgeClass('goi_huy'),
    }
  }
  if (pkg.packageTag === 'received_transfer') {
    return {
      label: 'Gói nhận chuyển',
      badgeClass: getStatusBadgeClass('goi_nhan_chuyen'),
    }
  }
  // Bỏ nhãn "Hết hạn" theo yêu cầu người dùng
  return null
}

export function StudentPackageHistoryPopover({
  program,
  packages,
  className,
}: StudentPackageHistoryPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Danh sách các gói sản phẩm trước đó (loại trừ gói chính đang dùng đầu danh sách)
  const previousPackages: StudentPackage[] = useMemo(() => {
    if (packages && packages.length > 0) return packages
    if (!program.packages || program.packages.length === 0) return []
    if (program.packages.length > 1) {
      return program.packages.slice(1)
    }
    return []
  }, [packages, program.packages])

  const handleViewOrder = (orderNo?: string, pkg?: StudentPackage) => {
    if (!orderNo) return

    const foundInMock = mockOrders.find(
      (o) => o.orderNo?.toLowerCase() === orderNo.toLowerCase() || o.id?.toLowerCase() === orderNo.toLowerCase()
    )
    if (foundInMock) {
      setSelectedOrder(foundInMock)
      return
    }

    const fallbackOrder: Order = {
      id: `ORD-${orderNo}`,
      orderNo: orderNo,
      studentId: program.id,
      studentName: 'Học viên',
      customerName: 'Phụ huynh học viên',
      customerPhone: '0918223344',
      items: [
        {
          productId: `prod-${pkg?.id || 'default'}`,
          productName: pkg?.packageName || 'Gói học tiêu chuẩn',
          quantity: 1,
          unitPrice: pkg?.price || 3600000,
          subtotal: pkg?.price || 3600000,
          sessionsGranted: pkg?.totalSessions || 24,
          sessionsTotal: pkg?.totalSessions || 24,
          activationStatus: 'activated',
          packageCategory: 'tutor',
          categoryName: 'Sản phẩm gia sư',
        },
      ],
      totalAmount: pkg?.price || 3600000,
      discountAmount: 0,
      finalAmount: pkg?.price || 3600000,
      paidAmount: pkg?.price || 3600000,
      paymentMethod: 'bank_transfer',
      paymentStatus: 'paid',
      status: 'completed',
      branch: program.branch || 'RinoEdu Nguyễn Tuân',
      saleBy: pkg?.saleName || program.saleName || 'Trần Thị Mai (Sales)',
      createdAt: pkg?.purchaseDate || '2024-01-15',
    }
    setSelectedOrder(fallbackOrder)
  }

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              'inline-flex items-center gap-1 text-[11px] font-normal transition-all cursor-pointer rounded px-1.5 py-0.5 border border-transparent',
              'text-sky-600 dark:text-sky-400 hover:bg-sky-50/80 hover:border-sky-200/90 hover:text-sky-700 dark:hover:bg-sky-950/40 dark:hover:border-sky-800/60 dark:hover:text-sky-300',
              className
            )}
            title={`Xem danh sách ${previousPackages.length} gói sản phẩm trước đó & đơn hàng liên kết`}
          >
            <History className="h-3 w-3 shrink-0" />
            <span className="font-normal">({previousPackages.length})</span>
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={6}
          className="w-[330px] sm:w-[360px] p-2.5 rounded-xl shadow-lg border border-border/60 bg-popover z-50 text-left space-y-1.5"
        >
          {/* Header Popover: 1 dòng duy nhất, text thường không in đậm, gói trong ngoặc (x) */}
          <div className="flex items-center justify-between pb-1.5 border-b border-border/30">
            <div className="text-xs text-foreground font-normal flex items-center gap-1.5">
              <History className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>
                Gói sản phẩm trước đó{' '}
                <span className="text-muted-foreground font-normal">
                  ({previousPackages.length} gói)
                </span>
              </span>
            </div>
          </div>

          {/* Danh sách gói trước đó */}
          {previousPackages.length === 0 ? (
            <div className="py-4 text-center text-xs text-muted-foreground italic font-normal">
              Chưa có gói sản phẩm trước đó trong lộ trình này.
            </div>
          ) : (
            <div className="max-h-[320px] overflow-y-auto space-y-1 pr-0.5 scrollbar-thin">
              {previousPackages.map((pkg) => {
                const effectiveOrderNo = pkg.orderNo || 'OD800436'
                const tagBadge = getPackageTagBadge(pkg)
                const cleanedName = cleanPackageName(pkg.packageName)
                const { subjectTitle, teacherType, classModel } = getPackageSpecParts(pkg, program)

                return (
                  <div
                    key={pkg.id}
                    className="px-2 py-1.5 rounded-lg border border-transparent hover:border-border/60 hover:bg-muted/40 transition-colors space-y-0.5 text-xs text-left"
                  >
                    {/* Dòng 1: Tên gói viết thường không in đậm, bỏ chữ cũ / hết hạn | Số buổi (+ nhãn tag nếu có) */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="text-xs font-normal text-foreground truncate"
                          title={cleanedName}
                        >
                          {cleanedName}
                        </span>
                        {tagBadge && (
                          <span
                            className={cn(
                              'text-[9.5px] px-1 py-0.2 rounded border font-normal shrink-0 tracking-tight shadow-3xs',
                              tagBadge.badgeClass
                            )}
                          >
                            {tagBadge.label}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs font-normal text-emerald-600 dark:text-emerald-400 shrink-0">
                        +{pkg.totalSessions} buổi
                      </span>
                    </div>

                    {/* Dòng 2: Chia 3 cột riêng biệt (Cột 1: Môn • GV • Lớp | Cột 2: Quota ở giữa | Cột 3: Mã đơn ở phải) */}
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1.5 text-[11px] text-muted-foreground">
                      {/* Cột 1: Môn • Loại GV (bỏ in đậm) • Loại lớp */}
                      <div className="flex items-center gap-1 min-w-0 truncate justify-self-start">
                        <span>{subjectTitle}</span>
                        <span className="text-border/60">•</span>
                        <span>{teacherType}</span>
                        <span className="text-border/60">•</span>
                        <span>{classModel}</span>
                      </div>

                      {/* Cột 2: Tách Quota ra giữa */}
                      <div className="justify-self-center px-1 text-center whitespace-nowrap">
                        <span>Quota: {pkg.leaveQuota ?? 0}b</span>
                      </div>

                      {/* Cột 3: Mã đơn hàng ở cạnh phải */}
                      <div className="justify-self-end">
                        <button
                          type="button"
                          onClick={() => handleViewOrder(effectiveOrderNo, pkg)}
                          className="font-mono text-[11.5px] font-normal text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 hover:underline shrink-0 cursor-pointer inline-flex items-center gap-0.5 p-0 bg-transparent border-0 transition-colors"
                          title={`Mở chi tiết đơn hàng ${effectiveOrderNo}`}
                        >
                          <span>{effectiveOrderNo}</span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-70 shrink-0" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Modal Chi tiết đơn hàng liên kết khi click mã đơn */}
      {selectedOrder && (
        <OrderDetailDialog
          order={selectedOrder}
          onOpenChange={(open) => {
            if (!open) setSelectedOrder(null)
          }}
        />
      )}
    </>
  )
}
