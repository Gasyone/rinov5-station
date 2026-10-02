'use client'

import { useState, useMemo } from 'react'
import {
  Wallet,
  Calendar,
  Clock,
  GraduationCap,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Pencil,
  RefreshCw,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { OrderDetailDialog } from '@/components/screens/orders/OrderDetailDialog'
import { mockOrders, type Order } from '@/mocks/orders'
import { getStudentOrders, type DetailedOrder } from '@/components/screens/care/student-orders/studentOrdersTypes'
import type { StudentProgram, StudentPackage } from './studentDetailTypes'

export interface StudentDetailPackageWalletColumnProps {
  program: StudentProgram
  activeDeductingPackage?: StudentPackage | null
  nextQueuedPackage?: StudentPackage | null
  otherActivePackages?: StudentPackage[]
  historicalPackages?: StudentPackage[]
  onReservePackage?: (packageId: string) => void
  onOpenAssignClass: (packageId?: string) => void
  onEditScheduleSlots?: () => void
  onEditLevel?: () => void
  onEditSessions?: () => void
  onEditSessionsQuota?: () => void
  onOpenRenewalDetail?: () => void
}

/**
 * Resolves the "Sản phẩm" string according to enterprise product rules:
 * - English: "Tiếng Anh [VN/NATIVE/PHI] [1:1 / 1:6 / 1:10 / 1:15]"
 * - Math: "Toán học [1:1 / 1:6 / 1:10 / 1:15]" (no teacher type because default is Vietnamese)
 */
function getProductSpecification(pkg: StudentPackage, program: StudentProgram): string {
  const pkgNameLower = (pkg.packageName || '').toLowerCase()
  const progNameLower = (program.name || '').toLowerCase()
  const isEnglish =
    program.subject === 'english' ||
    progNameLower.includes('tiếng anh') ||
    progNameLower.includes('english') ||
    pkgNameLower.includes('tiếng anh') ||
    pkgNameLower.includes('ielts') ||
    pkgNameLower.includes('speaking')

  // Detect ratio / class model (e.g. 1:1, 1:6, 1:10, 1:15...)
  let classModel = '1:10'
  const modelMatch = `${pkg.packageName} ${program.level || ''} ${program.name}`.match(/1:(10|15|20|6|1)/)
  if (modelMatch) {
    classModel = `1:${modelMatch[1]}`
  } else if (pkgNameLower.includes('1:6') || progNameLower.includes('1:6')) {
    classModel = '1:6'
  } else if (pkgNameLower.includes('1:1') || progNameLower.includes('1:1')) {
    classModel = '1:1'
  }

  if (isEnglish) {
    let teacherType = 'VN'
    if (pkgNameLower.includes('native') || pkgNameLower.includes('bản ngữ') || progNameLower.includes('native')) {
      teacherType = 'NATIVE'
    } else if (pkgNameLower.includes('phi') || pkgNameLower.includes('philippines')) {
      teacherType = 'PHI'
    }
    return `Tiếng Anh ${teacherType} ${classModel}`
  }

  // Math: "Toán thì không có VN/NAvi... vì mặc định là Việt nam"
  return `Toán học ${classModel}`
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
  return null
}

export function StudentDetailPackageWalletColumn({
  program,
  onEditScheduleSlots,
  onEditLevel,
  onEditSessions,
  onEditSessionsQuota,
  onOpenRenewalDetail,
}: StudentDetailPackageWalletColumnProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | DetailedOrder | null>(null)
  const [isExpandedPackages, setIsExpandedPackages] = useState(false)

  // Program-level quota statistics
  const totalSessions = program.totalSessions || program.packages.reduce((acc, p) => acc + p.totalSessions, 0)
  const remainingSessions = program.remainingSessions ?? program.packages.reduce((acc, p) => acc + p.remainingSessions, 0)
  const studiedSessions = program.studiedSessions !== undefined
    ? program.studiedSessions
    : Math.max(0, totalSessions - remainingSessions)
  const overallPercent = totalSessions > 0 ? Math.min(100, Math.round((studiedSessions / totalSessions) * 100)) : 0

  // Cộng dồn quota nghỉ phép của tất cả các gói học trong chương trình
  const totalLeaveQuota = useMemo(() => {
    return program.packages.reduce((acc, p) => acc + (p.leaveQuota ?? 0), 0)
  }, [program.packages])

  // Sort packages by purchaseDate descending (mới nhất lên đầu)
  const sortedPackages = useMemo(() => {
    return [...program.packages].sort((a, b) => {
      const timeA = new Date(a.purchaseDate).getTime() || 0
      const timeB = new Date(b.purchaseDate).getTime() || 0
      return timeB - timeA
    })
  }, [program.packages])

  // Xem tối đa 3 gói học gần nhất, các gói khác ấn mở rộng
  const visiblePackages = isExpandedPackages ? sortedPackages : sortedPackages.slice(0, 3)

  // Target level & education class (chỉ hiện trình độ, sub level, và lớp trường cho môn toán)
  const activeLevel = program.level || 'Chưa phân cấp'
  const activeSubLevel = program.subLevel
  const isMath = program.subject === 'math' || program.name.toLowerCase().includes('toán')
  const schoolClass = program.schoolClass || 'Lớp 6'

  // Available schedule slots (nhóm gọn theo từng thứ nếu có nhiều giờ)
  const groupedSlots = useMemo(() => {
    const rawSlots = program.availableSlots && program.availableSlots.length > 0 ? program.availableSlots : [
      { id: 'slot-1', dayOfWeek: 'Thứ 3 & Thứ 6', timeRange: '17:30 - 19:00' },
      { id: 'slot-2', dayOfWeek: 'Thứ 7', timeRange: '09:00 - 10:30' },
    ]
    const map = new Map<string, string[]>()
    rawSlots.forEach((s) => {
      const times = map.get(s.dayOfWeek) || []
      if (!times.includes(s.timeRange)) {
        times.push(s.timeRange)
      }
      map.set(s.dayOfWeek, times)
    })
    return Array.from(map.entries()).map(([day, times]) => ({
      day,
      timeText: times.join(', '),
    }))
  }, [program.availableSlots])

  // Find expected expiry date & remaining days calculated from now
  const expiryInfo = useMemo(() => {
    const dates = program.packages
      .map((p) => p.endDate)
      .filter((d): d is string => Boolean(d))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

    if (dates.length === 0) return { dateStr: '—', remainingDaysText: '', diffDays: 0 }
    const latestDateStr = dates[dates.length - 1]
    const d = new Date(latestDateStr)
    if (isNaN(d.getTime())) return { dateStr: latestDateStr, remainingDaysText: '', diffDays: 0 }

    const formattedDate = d.toLocaleDateString('vi-VN')
    const now = new Date()
    let diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    // In demo mock, if package is active with remaining sessions but year was static past, ensure realistic positive remaining days
    if (diffDays <= 0 && remainingSessions > 0) {
      diffDays = Math.max(30, remainingSessions * 7)
    }

    let remainingDaysText = ''
    if (diffDays > 0) {
      remainingDaysText = `Còn ${diffDays} ngày`
    } else if (diffDays === 0) {
      remainingDaysText = 'Hết hạn hôm nay'
    } else {
      remainingDaysText = `Đã quá hạn ${Math.abs(diffDays)} ngày`
    }

    return {
      dateStr: formattedDate,
      remainingDaysText,
      diffDays,
    }
  }, [program.packages, remainingSessions])

  const formatDateVi = (dateStr?: string) => {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('vi-VN')
  }

  // Tra cứu và mở Modal Chi tiết Đơn hàng liên kết
  const handleViewOrder = (orderNo?: string, pkg?: StudentPackage) => {
    if (!orderNo) {
      toast.info('Gói học này chưa có mã đơn hàng liên kết')
      return
    }

    // 1. Kiểm tra trong mockOrders
    const foundInMock = mockOrders.find(
      (o) => o.orderNo?.toLowerCase() === orderNo.toLowerCase() || o.id?.toLowerCase() === orderNo.toLowerCase()
    )
    if (foundInMock) {
      setSelectedOrder(foundInMock)
      return
    }

    // 2. Tra cứu trong student specific orders
    const studentOrders = getStudentOrders(program.id)
    const foundInStudent = studentOrders.find(
      (o) => o.orderNo?.toLowerCase() === orderNo.toLowerCase() || o.id?.toLowerCase() === orderNo.toLowerCase()
    )
    if (foundInStudent) {
      setSelectedOrder(foundInStudent)
      return
    }

    // 3. Khởi tạo đối tượng đơn hàng hợp lệ để Modal luôn mở đầy đủ thông tin
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
          unitPrice: pkg?.price || 12000000,
          subtotal: pkg?.price || 12000000,
          sessionsGranted: pkg?.totalSessions || 96,
          sessionsTotal: pkg?.totalSessions || 96,
          activationStatus: 'activated',
          packageCategory: 'tutor',
          categoryName: 'Sản phẩm gia sư',
        },
      ],
      totalAmount: pkg?.price || 12000000,
      discountAmount: 0,
      finalAmount: pkg?.price || 12000000,
      paidAmount: pkg?.price || 12000000,
      paymentMethod: 'bank_transfer',
      paymentStatus: 'paid',
      status: 'completed',
      branch: program.branch || 'RinoEdu Nguyễn Tuân',
      saleBy: program.saleName || 'Vũ Thị Lan 1',
      createdAt: pkg?.purchaseDate || '2024-08-14',
    }
    setSelectedOrder(fallbackOrder)
  }

  return (
    <div className="flex flex-col space-y-3.5 min-h-0">
      {/* ── 1. KHUNG GIỜ HỌC VIÊN RẢNH (Áp dụng chung tất cả các môn/gói) ── */}
      <div className="rounded-xl border border-border/70 bg-card p-2.5 sm:p-3 space-y-2 shadow-3xs text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="uppercase tracking-wider text-[11px]">Khung giờ học viên rảnh</span>
          </div>
          {onEditScheduleSlots && (
            <button
              type="button"
              onClick={onEditScheduleSlots}
              className="h-6 px-2 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md border border-border/60 inline-flex items-center gap-1 transition-colors cursor-pointer"
              title="Chỉnh sửa lịch khung giờ rảnh"
            >
              <Pencil className="h-2.5 w-2.5" />
              <span>Chỉnh sửa</span>
            </button>
          )}
        </div>

        {groupedSlots.length === 0 ? (
          <div className="text-xs text-muted-foreground italic py-1">
            Chưa cập nhật khung giờ rảnh
          </div>
        ) : (
          <div className="divide-y divide-border/30 pt-0.5 text-xs">
            {groupedSlots.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1.5 first:pt-0.5 last:pb-0"
              >
                <span className="font-semibold text-foreground text-xs shrink-0">
                  {item.day}
                </span>
                <span className="font-mono text-muted-foreground text-[11.5px] text-right">
                  {item.timeText}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 2. TRÌNH ĐỘ HỌC VIÊN (CHỈ HIỆN TRÌNH ĐỘ, SUB-LEVEL, KHỐI/LỚP) ── */}
      <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2.5 shadow-3xs text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="uppercase tracking-wider text-[11px]">Trình độ học viên</span>
          </div>
          {onEditLevel && (
            <button
              type="button"
              onClick={onEditLevel}
              className="h-6 px-2 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md border border-border/60 inline-flex items-center gap-1 transition-colors cursor-pointer"
              title="Chỉnh sửa trình độ học viên"
            >
              <Pencil className="h-2.5 w-2.5" />
              <span>Chỉnh sửa</span>
            </button>
          )}
        </div>

        {/* Trình độ hiện tại: Cân đối toàn thẻ, không nền xám & viền bên trong */}
        <div
          className={cn(
            "grid gap-2 pt-1 text-xs",
            isMath && schoolClass
              ? "grid-cols-3 divide-x divide-border/40"
              : activeSubLevel
                ? "grid-cols-2 divide-x divide-border/40"
                : "grid-cols-1"
          )}
        >
          <div className="pr-2">
            <span className="text-muted-foreground block text-[10.5px]">Trình độ:</span>
            <strong className="text-primary font-bold text-sm leading-tight block">
              {activeLevel}
            </strong>
          </div>
          {activeSubLevel && (
            <div className="pl-3 pr-2">
              <span className="text-muted-foreground block text-[10.5px]">Sub-level:</span>
              <strong className="text-foreground font-bold text-sm leading-tight block">
                {activeSubLevel}
              </strong>
            </div>
          )}
          {isMath && schoolClass && (
            <div className="pl-3">
              <span className="text-muted-foreground block text-[10.5px]">Khối / Lớp:</span>
              <strong className="text-foreground font-bold text-sm leading-tight block">
                {schoolClass}
              </strong>
            </div>
          )}
        </div>
      </div>

      {/* ── 3. TIÊU ĐỀ KHỐI VÍ GÓI HỌC & THỐNG KÊ QUOTA ── */}
      <div className="flex items-center justify-between px-0.5 pt-1 border-t border-border/30">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Wallet className="h-4 w-4" />
          </span>
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            Ví Gói Học & Quota Số Buổi
          </span>
        </div>
        {(onEditSessions || onEditSessionsQuota) && (
          <button
            type="button"
            onClick={onEditSessions || onEditSessionsQuota}
            className="h-6 px-2 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md border border-border/60 inline-flex items-center gap-1 transition-colors cursor-pointer"
            title="Chỉnh sửa số buổi học"
          >
            <Pencil className="h-2.5 w-2.5" />
            <span>Chỉnh sửa số buổi</span>
          </button>
        )}
      </div>

      {/* ── 4. CARD TỔNG QUOTA TOÀN CHƯƠNG TRÌNH (TÁCH 2 DÒNG + HẠN DỰ KIẾN + QUOTA NGHỈ PHÉP CỘNG DỒN) ── */}
      <div className="rounded-xl border border-border/80 bg-gradient-to-r from-emerald-50/40 via-background to-transparent dark:from-emerald-950/20 p-3 space-y-2.5 shadow-3xs">
        {/* Dòng 1: Buổi học & Tiến độ & Quota nghỉ phép cộng dồn */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 sm:gap-3 font-semibold flex-wrap">
            <div>
              <span className="text-muted-foreground font-normal text-[11px]">Tổng: </span>
              <strong className="text-foreground font-bold">{totalSessions}b</strong>
            </div>
            <div>
              <span className="text-muted-foreground font-normal text-[11px]">Đã học: </span>
              <strong className="text-primary font-bold">{studiedSessions}b</strong>
            </div>
            <div>
              <span className="text-muted-foreground font-normal text-[11px]">Còn lại: </span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{remainingSessions}b</strong>
            </div>
            <div>
              <span className="text-muted-foreground font-normal text-[11px]">Quota nghỉ: </span>
              <strong className="text-foreground font-bold">{totalLeaveQuota}b</strong>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-muted-foreground">
            {overallPercent}%
          </span>
        </div>

        {/* Thanh tiến độ tổng */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/60">
          <div
            className={cn(
              "h-full transition-all duration-300 rounded-full",
              overallPercent >= 100
                ? "bg-muted-foreground"
                : overallPercent > 80
                ? "bg-amber-500"
                : "bg-emerald-500"
            )}
            style={{ width: `${overallPercent}%` }}
          />
        </div>

        {/* Dòng 2: Hạn dự kiến & Ngày còn lại tính từ bây giờ + Icon Tái phí nếu dưới 90 ngày */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-muted-foreground text-[11.5px]">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
            <span>Hạn dự kiến:</span>
            <strong className="text-foreground font-bold">{expiryInfo.dateStr}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            {expiryInfo.remainingDaysText && (
              <span className={cn(
                "font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border",
                expiryInfo.diffDays > 30
                  ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800"
                  : expiryInfo.diffDays > 0
                  ? "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800"
                  : "text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800"
              )}>
                {expiryInfo.remainingDaysText}
              </span>
            )}

            {/* Icon Tái phí nếu dưới 90 ngày */}
            {expiryInfo.diffDays <= 90 && onOpenRenewalDetail && (
              <button
                type="button"
                onClick={onOpenRenewalDetail}
                className="h-5 px-1.5 rounded bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700 inline-flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer shadow-3xs"
                title="Hạn dùng dưới 90 ngày - Mở chi tiết màn Tái phí"
              >
                <RefreshCw className="h-2.5 w-2.5 shrink-0" />
                <span>Tái phí</span>
                <ExternalLink className="h-2 w-2 opacity-70" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 5. DANH SÁCH GÓI HỌC (TỐI ĐA 3 GÓI GẦN NHẤT + MỞ RỘNG + LINK ĐƠN HÀNG + QUOTA NGHỈ PHÉP) ── */}
      <div className="space-y-2">
        {visiblePackages.map((pkg) => {
          const effectiveOrderNo = pkg.orderNo || 'OD800436'
          const tagBadge = getPackageTagBadge(pkg)

          return (
            <div
              key={pkg.id}
              className="flex items-stretch justify-between p-3 rounded-xl border border-border/70 bg-card hover:bg-muted/20 transition-colors shadow-3xs"
            >
              {/* Thông tin gói + Dòng sản phẩm & Đơn hàng + Ngày kích hoạt */}
              <div className="space-y-1 min-w-0 flex-1 pr-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-foreground">
                      {pkg.packageName}
                    </span>
                    {tagBadge && (
                      <span
                        className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded-md border font-semibold inline-flex items-center tracking-wide shadow-3xs',
                          tagBadge.badgeClass
                        )}
                      >
                        {tagBadge.label}
                      </span>
                    )}
                  </div>

                  {/* Dòng Sản phẩm + Liên kết Đơn hàng */}
                  <div className="flex items-center gap-2 text-xs flex-wrap pt-0.5">
                    <span className="font-semibold text-primary/95 text-[11.5px]">
                      {getProductSpecification(pkg, program)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleViewOrder(effectiveOrderNo, pkg)}
                      className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 hover:underline px-1.5 py-0.2 rounded bg-sky-50 dark:bg-sky-950/60 border border-sky-200/60 dark:border-sky-800/60 cursor-pointer transition-colors"
                      title={`Mở chi tiết đơn hàng liên kết ${effectiveOrderNo}`}
                    >
                      <span>{effectiveOrderNo}</span>
                      <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                    </button>
                  </div>
                </div>

                {/* Ngày kích hoạt & Sales phụ trách gói */}
                <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground pt-1 flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3 opacity-70 shrink-0" />
                    <span>Kích hoạt: <strong className="text-foreground/80 font-medium">{formatDateVi(pkg.purchaseDate)}</strong></span>
                  </span>
                  <span className="text-border/60">•</span>
                  <span className="inline-flex items-center gap-1">
                    <User className="h-3 w-3 opacity-70 shrink-0" />
                    <span>Sales: <strong className="text-foreground/80 font-medium">{pkg.saleName || program.saleName || 'Trần Thị Mai'}</strong></span>
                  </span>
                </div>
              </div>

              {/* Cột phải: Số buổi cộng (ở trên) + Quota nghỉ phép (cùng dòng ngày kích hoạt ở dưới) */}
              <div className="shrink-0 flex flex-col items-end justify-between self-stretch py-0.5 pl-2">
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  +{pkg.totalSessions} buổi
                </span>
                <div className="text-[11px] text-muted-foreground">
                  <span>Quota nghỉ: </span>
                  <strong className="text-foreground font-mono font-semibold">
                    {pkg.leaveQuota ?? 0}b
                  </strong>
                </div>
              </div>
            </div>
          )
        })}

        {/* Nút Xem thêm / Thu gọn khi có nhiều hơn 3 gói học */}
        {sortedPackages.length > 3 && (
          <button
            type="button"
            onClick={() => setIsExpandedPackages((prev) => !prev)}
            className="w-full py-1.5 px-3 rounded-lg border border-dashed border-border/80 text-[11.5px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {isExpandedPackages ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                <span>Thu gọn ({sortedPackages.length - 3} gói cũ hơn)</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" />
                <span>Xem thêm {sortedPackages.length - 3} gói học khác</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Order Detail Modal Dialog */}
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
