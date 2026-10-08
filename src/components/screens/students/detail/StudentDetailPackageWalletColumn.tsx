'use client'

import { useMemo } from 'react'
import {
  Pencil,
  MapPin,
  ExternalLink,
  Building2,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PersonnelHoverCard, type PersonnelItem } from '@/components/shared'
import type { StudentProgram, StudentPackage } from './studentDetailTypes'

const BRANCH_INFO_MAP: Record<string, {
  code: string
  address: string
  manager: string
  admin: string
}> = {
  'RinoEdu Nguyễn Tuân': {
    code: 'CS-NT-01',
    address: 'Số 29 Nguyễn Tuân, Thanh Xuân Trung, Thanh Xuân, Hà Nội',
    manager: 'Đặng Văn Bắc',
    admin: 'Lê Thu Trang (Giáo vụ)',
  },
  'RinoEdu Linh Đàm': {
    code: 'CS-LD-02',
    address: 'Kiot 02, Tòa VP2, Bán đảo Linh Đàm, Hoàng Liệt, Hoàng Mai, Hà Nội',
    manager: 'Vũ Thị Hồng',
    admin: 'Nguyễn Thúy Quỳnh (Giáo vụ)',
  },
  'RinoEdu Smart City': {
    code: 'CS-SC-03',
    address: 'Tầng 2, Tòa S2.01, KĐT Vinhomes Smart City, Tây Mỗ, Nam Từ Liêm, Hà Nội',
    manager: 'Lê Hoàng Long',
    admin: 'Hoàng Phương Thảo (Giáo vụ)',
  },
}

export interface StudentDetailPackageWalletColumnProps {
  program: StudentProgram
  studentBranch?: string
  studentSaleName?: string
  csmName?: string
  activeDeductingPackage?: StudentPackage | null
  nextQueuedPackage?: StudentPackage | null
  otherActivePackages?: StudentPackage[]
  historicalPackages?: StudentPackage[]
  onReservePackage?: (packageId: string) => void
  onOpenAssignClass?: (packageId?: string) => void
  onEditScheduleSlots?: () => void
  onEditLevel?: () => void
  onEditSessions?: () => void
  onEditSessionsQuota?: () => void
}

export function StudentDetailPackageWalletColumn({
  program,
  studentBranch,
  studentSaleName,
  onEditScheduleSlots,
  onEditLevel,
}: StudentDetailPackageWalletColumnProps) {
  // Target level & education class (chỉ hiện trình độ, sub level, và lớp trường cho môn toán)
  const activeLevel = program.level || 'Chưa phân cấp'
  const activeSubLevel = program.subLevel
  const isMath = program.subject === 'math' || program.name.toLowerCase().includes('toán')
  const schoolClass = program.schoolClass || 'Lớp 6'

  // Thông tin cơ sở Rinoedu & người phụ trách
  const effectiveBranch = studentBranch || program.branch || 'RinoEdu Nguyễn Tuân'
  const branchInfo = BRANCH_INFO_MAP[effectiveBranch] || BRANCH_INFO_MAP['RinoEdu Nguyễn Tuân']

  // Sale mới nhất lên đơn theo đơn hàng (ưu tiên gói có ngày mua mới nhất)
  const latestOrderPackage = useMemo(() => {
    if (!program.packages || program.packages.length === 0) return null
    const sorted = [...program.packages].sort((a, b) => {
      const dateA = a.purchaseDate ? new Date(a.purchaseDate).getTime() : 0
      const dateB = b.purchaseDate ? new Date(b.purchaseDate).getTime() : 0
      return dateB - dateA
    })
    return sorted[0]
  }, [program.packages])

  const latestSaleName = latestOrderPackage?.saleName || studentSaleName || program.saleName || 'Trần Thị Sale'
  const latestOrderNo = latestOrderPackage?.orderNo

  // Nhân sự cơ sở & kinh doanh phục vụ PersonnelHoverCard
  const cleanAdminName = useMemo(() => {
    return branchInfo.admin.replace(/\s*\(.*\)/, '').trim()
  }, [branchInfo.admin])

  const managerPersonnel: PersonnelItem = useMemo(() => ({
    id: `EMP-MGR-${branchInfo.code.replace('CS-', '')}`,
    name: branchInfo.manager,
    role: `Quản lý cơ sở (${effectiveBranch})`,
    phone: '0912 889 901',
    email: `${branchInfo.manager.toLowerCase().split(' ').pop()}@rinoedu.vn`,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(branchInfo.manager)}`,
  }), [branchInfo, effectiveBranch])

  const adminPersonnel: PersonnelItem = useMemo(() => ({
    id: `EMP-ADM-${branchInfo.code.replace('CS-', '')}`,
    name: cleanAdminName,
    role: `Giáo vụ cơ sở (${effectiveBranch})`,
    phone: '0915 234 567',
    email: `${cleanAdminName.toLowerCase().split(' ').pop()}@rinoedu.vn`,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(cleanAdminName)}`,
  }), [branchInfo, effectiveBranch, cleanAdminName])

  const salePersonnel: PersonnelItem = useMemo(() => ({
    id: `EMP-SALE-${String(Math.abs(latestSaleName.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % 900 + 100)}`,
    name: latestSaleName,
    role: latestOrderNo ? `Sales phụ trách đơn ${latestOrderNo}` : 'Chuyên viên Sales',
    phone: '0903 456 789',
    email: `${latestSaleName.toLowerCase().split(' ').pop()}@rinoedu.vn`,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(latestSaleName)}`,
  }), [latestSaleName, latestOrderNo])

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

  return (
    <div className="flex flex-col space-y-2 min-h-0">
      {/* ── 1. TRÌNH ĐỘ HỌC VIÊN (CHỈ HIỆN TRÌNH ĐỘ, SUB-LEVEL, KHỐI/LỚP) ── */}
      <div className="rounded-xl border border-border/70 bg-card p-2 sm:p-2.5 space-y-1 shadow-3xs text-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-normal text-muted-foreground">Trình độ học viên</span>
          {onEditLevel && (
            <button
              type="button"
              onClick={onEditLevel}
              className="h-5 px-1.5 text-[10.5px] font-normal text-sky-600 dark:text-sky-400 bg-transparent border border-transparent hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-md inline-flex items-center gap-1 transition-all cursor-pointer"
              title="Chỉnh sửa trình độ học viên"
            >
              <Pencil className="h-2.5 w-2.5 text-sky-600 dark:text-sky-400" />
              <span>Chỉnh sửa</span>
            </button>
          )}
        </div>

        {/* Trình độ hiện tại - Không in đậm */}
        <div
          className={cn(
            "grid gap-1.5 pt-0.5 text-xs",
            isMath && schoolClass
              ? "grid-cols-3 divide-x divide-border/40"
              : activeSubLevel
                ? "grid-cols-2 divide-x divide-border/40"
                : "grid-cols-1"
          )}
        >
          <div className="pr-1.5">
            <span className="text-muted-foreground block text-[10px]">Trình độ:</span>
            <span className="text-foreground font-normal text-xs sm:text-[12px] leading-tight block truncate">
              {activeLevel}
            </span>
          </div>
          {activeSubLevel && (
            <div className="pl-2.5 pr-1.5">
              <span className="text-muted-foreground block text-[10px]">Sub-level:</span>
              <span className="text-foreground font-normal text-xs sm:text-[12px] leading-tight block truncate">
                {activeSubLevel}
              </span>
            </div>
          )}
          {isMath && schoolClass && (
            <div className="pl-2.5">
              <span className="text-muted-foreground block text-[10px]">Khối / Lớp:</span>
              <span className="text-foreground font-normal text-xs sm:text-[12px] leading-tight block truncate">
                {schoolClass}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── 2. KHUNG GIỜ HỌC VIÊN RẢNH (Áp dụng chung tất cả các môn/gói) ── */}
      <div className="rounded-xl border border-border/70 bg-card p-2 sm:p-2.5 space-y-1 shadow-3xs text-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-normal text-muted-foreground">Khung giờ học viên rảnh</span>
          {onEditScheduleSlots && (
            <button
              type="button"
              onClick={onEditScheduleSlots}
              className="h-5 px-1.5 text-[10.5px] font-normal text-sky-600 dark:text-sky-400 bg-transparent border border-transparent hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-md inline-flex items-center gap-1 transition-all cursor-pointer"
              title="Chỉnh sửa lịch khung giờ rảnh"
            >
              <Pencil className="h-2.5 w-2.5 text-sky-600 dark:text-sky-400" />
              <span>Chỉnh sửa</span>
            </button>
          )}
        </div>

        {groupedSlots.length === 0 ? (
          <div className="text-[11px] text-muted-foreground italic py-0.5">
            Chưa cập nhật khung giờ rảnh
          </div>
        ) : (
          <div className="divide-y divide-border/30 pt-0.5 text-xs">
            {groupedSlots.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-0.5 first:pt-0 last:pb-0"
              >
                <span className="font-normal text-foreground text-[11.5px] shrink-0">
                  {item.day}
                </span>
                <span className="font-mono text-muted-foreground text-[11px] text-right">
                  {item.timeText}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 3. THÔNG TIN RINOEDU (CƠ SỞ, ĐỊA CHỈ, NHÂN SỰ) ── */}
      <div className="rounded-xl border border-border/70 bg-card p-2 sm:p-2.5 space-y-1.5 shadow-3xs text-xs text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs font-normal text-muted-foreground">Thông tin Rinoedu</span>
          <span className="text-[9.5px] font-medium text-muted-foreground bg-muted/60 border border-border/60 px-1 py-0.2 rounded leading-tight">
            Đang hoạt động
          </span>
        </div>

        {/* Nội dung chi tiết */}
        <div className="space-y-1 pt-0.5 text-xs">
          {/* Cơ sở & Mã cơ sở (Icon Tòa nhà + Tên cơ sở sát icon | Mã cơ sở ở cạnh phải dòng) */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 truncate min-w-0">
              <Building2 className="h-3 w-3 text-muted-foreground shrink-0" />
              <strong className="text-foreground font-semibold truncate text-[11.5px]">
                {effectiveBranch}
              </strong>
            </div>
            <span className="font-mono text-[9.5px] px-1 py-0.2 bg-muted text-muted-foreground rounded border border-border/50 shrink-0">
              {branchInfo.code}
            </span>
          </div>

          {/* Địa chỉ cơ sở: textlink có icon mở google map search đúng địa chỉ (bỏ nhãn Địa chỉ cơ sở) */}
          <div className="pt-0.5">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branchInfo.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-start gap-1 text-[11px] text-foreground/85 hover:text-foreground transition-colors cursor-pointer text-left leading-snug"
              title="Nhấp để tìm kiếm địa chỉ cơ sở trên Google Maps"
            >
              <MapPin className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <span className="line-clamp-2 underline-offset-2 group-hover:underline">
                {branchInfo.address}
              </span>
              <ExternalLink className="h-2.5 w-2.5 text-muted-foreground/70 group-hover:text-foreground shrink-0 mt-0.5 transition-colors" />
            </a>
          </div>

          {/* Nhân sự phụ trách (Icon Users + các nhân sự dạng hover popover, bỏ chức danh trong ngoặc) */}
          <div className="border-t border-border/40 pt-1 text-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1 text-muted-foreground shrink-0 mt-0.5" title="Nhân sự phụ trách">
                <Users className="h-3 w-3 shrink-0" />
              </div>
              <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-0.5 text-right">
                <PersonnelHoverCard person={managerPersonnel} align="end">
                  <span className="text-foreground hover:text-foreground font-medium text-[11px] cursor-pointer hover:underline transition-colors">
                    {branchInfo.manager}
                  </span>
                </PersonnelHoverCard>
                <span className="text-muted-foreground/40">•</span>
                <PersonnelHoverCard person={adminPersonnel} align="end">
                  <span className="text-foreground hover:text-foreground font-medium text-[11px] cursor-pointer hover:underline transition-colors">
                    {cleanAdminName}
                  </span>
                </PersonnelHoverCard>
                <span className="text-muted-foreground/40">•</span>
                <PersonnelHoverCard person={salePersonnel} align="end">
                  <span className="text-foreground hover:text-foreground font-medium text-[11px] cursor-pointer hover:underline transition-colors">
                    {latestSaleName}
                  </span>
                </PersonnelHoverCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
