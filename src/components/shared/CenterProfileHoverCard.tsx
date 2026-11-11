'use client'

import React, { useState } from 'react'
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  DoorOpen,
  Users,
  GraduationCap,
  Copy,
  Check,
  UserCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/format'
import { mockBranches } from '@/mocks/branches'
import { mockEmployees } from '@/mocks/employees'

export interface CenterTeacher {
  name: string
  subject: string
  avatar: string
  initials: string
  isNative: boolean
}

export interface CenterProfileData {
  id: string
  code: string
  name: string
  address: string
  phone: string
  businessHoursShort: string
  roomCount: number
  standardRooms: number
  labRooms: number
  vipRooms: number
  capacity: number
  activeClasses: number
  teachersCount: number
  nativeCount: number
  vnCount: number
  teachers: CenterTeacher[]
  staffCount: number
  taCount: number
  csmCount: number
}

/**
 * Danh sách giáo viên mẫu chất lượng cao để đảm bảo mỗi cơ sở luôn có từ 10 - 15 giáo viên
 */
const SAMPLE_FACULTY_POOL: Record<string, CenterTeacher[]> = {
  'linh-dam': [
    { name: 'Sarah J.', subject: 'Kindy', isNative: true, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', initials: 'SJ' },
    { name: 'Robert L.', subject: 'Movers', isNative: true, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', initials: 'RL' },
    { name: 'Emily W.', subject: 'Flyers', isNative: true, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', initials: 'EW' },
    { name: 'Coenrad Redman', subject: 'Giao tiếp', isNative: true, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', initials: 'CR' },
    { name: 'Nguyễn Minh Đức', subject: 'IELTS Foundation', isNative: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', initials: 'MĐ' },
    { name: 'Lê Phương Thảo', subject: 'Station English', isNative: false, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', initials: 'PT' },
    { name: 'Trần Quang Huy', subject: 'Toán tư duy', isNative: false, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', initials: 'QH' },
    { name: 'Đào Thị Lan', subject: 'Grammar', isNative: false, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', initials: 'TL' },
    { name: 'Phạm Hoàng Yến', subject: 'Kindy Phonics', isNative: false, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80', initials: 'HY' },
    { name: 'Vũ Minh Khang', subject: 'Toán logic', isNative: false, avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80', initials: 'MK' },
    { name: 'Thu Hà', subject: 'Tiếng Anh tiểu học', isNative: false, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80', initials: 'TH' },
    { name: 'Mỹ Linh', subject: 'Ngữ pháp Cambridge', isNative: false, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80', initials: 'ML' },
  ],
  'nguyen-tuan': [
    { name: 'Sarah J.', subject: 'Kindy', isNative: true, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', initials: 'SJ' },
    { name: 'Robert L.', subject: 'Movers', isNative: true, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', initials: 'RL' },
    { name: 'Emily W.', subject: 'Flyers', isNative: true, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', initials: 'EW' },
    { name: 'Phạm Văn Giảng Dạy', subject: 'IELTS', isNative: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', initials: 'GD' },
    { name: 'Nguyễn Đức Minh', subject: 'IELTS Prep', isNative: false, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', initials: 'ĐM' },
    { name: 'Hoàng Thùy Linh', subject: 'Tiếng Anh Thiếu nhi', isNative: false, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', initials: 'TL' },
    { name: 'Bùi Thu Phương', subject: 'Ngữ pháp', isNative: false, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', initials: 'TP' },
    { name: 'Đỗ Anh Tuấn', subject: 'Toán tư duy', isNative: false, avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80', initials: 'AT' },
    { name: 'Trần Bích Ngọc', subject: 'Cambridge Starters', isNative: false, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80', initials: 'BN' },
    { name: 'Lê Quốc Bảo', subject: 'Toán thực nghiệm', isNative: false, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', initials: 'QB' },
    { name: 'Vũ Mai Phương', subject: 'Station Grammar', isNative: false, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80', initials: 'MP' },
  ],
  'smart-city': [
    { name: 'Coenrad Redman', subject: 'Bản ngữ Lead', isNative: true, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', initials: 'CR' },
    { name: 'David Miller', subject: 'STEM Robot', isNative: true, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', initials: 'DM' },
    { name: 'Hoàng Thị Giáo Viên', subject: 'Tiếng Anh Tiểu học', isNative: false, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', initials: 'GV' },
    { name: 'Trần Bảo Ngọc', subject: 'IELTS 7.0+', isNative: false, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', initials: 'BN' },
    { name: 'Vũ Đình Trọng', subject: 'TOEIC & Giao tiếp', isNative: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', initials: 'ĐT' },
    { name: 'Lê Thu Trang', subject: 'Kids English', isNative: false, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', initials: 'TT' },
    { name: 'Nguyễn Hải Đăng', subject: 'Grammar', isNative: false, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', initials: 'HĐ' },
    { name: 'Đặng Thị Lan Anh', subject: 'Cambridge Starters', isNative: false, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', initials: 'LA' },
    { name: 'Trần Tuấn Kiệt', subject: 'Toán tư duy', isNative: false, avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80', initials: 'TK' },
    { name: 'Nguyễn Thùy Trang', subject: 'Kindy Mầm non', isNative: false, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80', initials: 'TT' },
    { name: 'Đặng Quốc Cường', subject: 'Toán logic', isNative: false, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', initials: 'QC' },
  ],
  default: [
    { name: 'Sarah J.', subject: 'Kindy', isNative: true, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', initials: 'SJ' },
    { name: 'David M.', subject: 'STEM', isNative: true, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', initials: 'DM' },
    { name: 'Robert L.', subject: 'Toán tư duy', isNative: true, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', initials: 'RL' },
    { name: 'Emily W.', subject: 'Flyers', isNative: true, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', initials: 'EW' },
    { name: 'Nguyễn Văn Nam', subject: 'IELTS', isNative: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', initials: 'VN' },
    { name: 'Trần Mai Phương', subject: 'Tiếng Anh', isNative: false, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', initials: 'MP' },
    { name: 'Lê Hoàng Quân', subject: 'Toán logic', isNative: false, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', initials: 'HQ' },
    { name: 'Phạm Thu Thảo', subject: 'Kindy', isNative: false, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', initials: 'TT' },
    { name: 'Đặng Minh Trí', subject: 'Toán tư duy', isNative: false, avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80', initials: 'MT' },
    { name: 'Hoàng Bích Thảo', subject: 'Ngữ pháp', isNative: false, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80', initials: 'BT' },
    { name: 'Vũ Văn Hùng', subject: 'Toán', isNative: false, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', initials: 'VH' },
  ],
}

/**
 * Tra cứu và tổng hợp hồ sơ chi tiết của một trung tâm / cơ sở
 */
export function getCenterProfile(centerName: string): CenterProfileData {
  const normalized = centerName.toLowerCase().trim()
  const branch = mockBranches.find(
    (b) =>
      b.name.toLowerCase() === normalized ||
      normalized.includes(b.name.toLowerCase()) ||
      b.name.toLowerCase().includes(normalized) ||
      b.code.toLowerCase() === normalized
  )

  // Lấy key danh sách giáo viên
  let poolKey = 'default'
  if (normalized.includes('linh đàm') || normalized.includes('linh dam')) poolKey = 'linh-dam'
  else if (normalized.includes('nguyễn tuân') || normalized.includes('nguyen tuan')) poolKey = 'nguyen-tuan'
  else if (normalized.includes('smart city')) poolKey = 'smart-city'

  const teachers = SAMPLE_FACULTY_POOL[poolKey] || SAMPLE_FACULTY_POOL.default
  const nativeCount = teachers.filter((t) => t.isNative).length
  const vnCount = teachers.length - nativeCount

  // Đếm nhân sự khác (Trợ giảng, Tuyển sinh, CSM, Vận hành)
  const branchStaff = mockEmployees.filter(
    (e) =>
      e.branch.toLowerCase().includes(normalized) ||
      e.branches?.some((br) => br.toLowerCase().includes(normalized)) ||
      (branch && (e.branch === branch.name || e.branches?.includes(branch.name)))
  )
  const otherStaffList = branchStaff.filter(
    (e) => e.department !== 'Teaching' && !e.position.toLowerCase().includes('teacher')
  )
  const staffCount = otherStaffList.length > 0 ? otherStaffList.length : 6
  const taCount = Math.max(2, Math.round(staffCount * 0.6))
  const csmCount = Math.max(1, staffCount - taCount)

  const roomCount = branch?.roomCount || 10
  const standardRooms = Math.max(1, roomCount - 4)
  const labRooms = 2
  const vipRooms = 2

  const capacity = branch?.totalCapacity || 200
  const activeClasses = branch?.activeClassesCount || 16

  const businessHoursShort = branch?.businessHours
    ? `${branch.businessHours.openTime} - ${branch.businessHours.closeTime}`
    : '08:00 - 21:30'

  return {
    id: branch?.id || `br-${centerName.toLowerCase().replace(/\s+/g, '-')}`,
    code: branch?.code || 'CS_RINO',
    name: branch?.name || centerName,
    address: branch?.address || 'Hệ thống cơ sở RinoEdu',
    phone: branch?.phone || '024 7300 8866',
    businessHoursShort,
    roomCount,
    standardRooms,
    labRooms,
    vipRooms,
    capacity,
    activeClasses,
    teachersCount: teachers.length,
    nativeCount,
    vnCount,
    teachers,
    staffCount,
    taCount,
    csmCount,
  }
}

export interface CenterProfileHoverCardProps {
  centerName: string
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  className?: string
  openDelay?: number
  closeDelay?: number
}

export function CenterProfileHoverCard({
  centerName,
  children,
  side = 'bottom',
  align = 'start',
  className,
  openDelay = 120,
  closeDelay = 180,
}: CenterProfileHoverCardProps) {
  const [copiedPhone, setCopiedPhone] = useState(false)

  if (!centerName || centerName.trim() === '') {
    return <>{children}</>
  }

  const profile = getCenterProfile(centerName)

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (profile.phone) {
      navigator.clipboard.writeText(profile.phone)
      setCopiedPhone(true)
      toast.success(`Đã sao chép hotline: ${profile.phone}`)
      setTimeout(() => setCopiedPhone(false), 2000)
    }
  }

  return (
    <HoverCard openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        side={side}
        align={align}
        sideOffset={6}
        className={cn(
          'w-[345px] p-0 rounded-2xl shadow-xl border border-border/80 bg-popover text-popover-foreground z-[100] text-xs overflow-hidden animate-in fade-in-0 zoom-in-95',
          className
        )}
      >
        {/* HEADER: DẢI MÀU ACCENT + TIÊU ĐỀ CƠ SỞ & CODE BADGE */}
        <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 p-3 pb-2.5 border-b border-border/50">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-foreground truncate leading-tight">
                  {profile.name}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                  <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                  <span className="truncate">{profile.address}</span>
                </div>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-md text-[10.5px] font-mono font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 shrink-0 uppercase tracking-wider">
              {profile.code}
            </span>
          </div>

          {/* Hotline & Giờ mở cửa */}
          <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-border/40 text-[11px]">
            <div className="flex items-center gap-1 text-foreground font-medium">
              <Phone className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-mono">{profile.phone}</span>
              <button
                type="button"
                onClick={handleCopyPhone}
                className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Sao chép hotline"
              >
                {copiedPhone ? (
                  <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground font-mono text-[10.5px]">
              <Clock className="h-3 w-3 text-amber-500 shrink-0" />
              <span>{profile.businessHoursShort}</span>
            </div>
          </div>
        </div>

        {/* BODY: CƠ CẤU PHÒNG, GIÁO VIÊN & NHÂN SỰ VỚI COLOR ACCENTS TINH TẾ */}
        <div className="p-3 space-y-2.5">
          {/* 1. PHÒNG HỌC & SỨC CHỨA (ĐÚNG 2 DÒNG NHƯNG CÓ BADGE MÀU SẮC ĐẸP MẮT) */}
          <div className="space-y-1.5 rounded-xl bg-muted/40 p-2 border border-border/50 text-[11.5px]">
            {/* Dòng 1: Phòng học */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <DoorOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="font-medium text-foreground">Phòng học:</span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10.5px] font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                  {profile.roomCount} phòng
                </span>
              </div>
              <span className="text-[10.5px] text-muted-foreground">
                {profile.standardRooms} tiêu chuẩn · {profile.labRooms} Lab · {profile.vipRooms} VIP
              </span>
            </div>

            {/* Dòng 2: Sức chứa & Lớp */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="font-medium text-foreground">Sức chứa:</span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10.5px] font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                  {profile.capacity} chỗ
                </span>
              </div>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10.5px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {profile.activeClasses} lớp đang học
              </span>
            </div>
          </div>

          {/* 2. KHỐI GIÁO VIÊN: TÁCH RIÊNG, BADGE ĐẾM SỐ LƯỢNG & AVATAR STACK 10-15 NGƯỜI */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-1 text-xs">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="font-semibold text-foreground">Giáo viên:</span>
                <span className="px-1.5 py-0.2 rounded-md font-bold text-[10.5px] bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                  {profile.teachersCount} GV
                </span>
              </div>

              <div className="flex items-center gap-1">
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-medium bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                  {profile.nativeCount} bản ngữ
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-medium bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20">
                  {profile.vnCount} VN
                </span>
              </div>
            </div>

            {/* Dải Avatar stack có hover nổi bật */}
            <div className="flex items-center -space-x-2 overflow-hidden py-1 pl-0.5">
              {profile.teachers.slice(0, 8).map((t, idx) => (
                <Avatar
                  key={idx}
                  size="sm"
                  className="h-7 w-7 border-2 border-background ring-1 ring-border shadow-xs shrink-0 hover:scale-115 hover:z-20 transition-all duration-200 cursor-pointer"
                  title={`${t.name} (${t.subject}${t.isNative ? ' · Bản ngữ' : ''})`}
                >
                  <AvatarImage src={t.avatar} alt={t.name} />
                  <AvatarFallback className="text-[9.5px] font-bold bg-indigo-50 text-indigo-700">
                    {t.initials || getInitials(t.name)}
                  </AvatarFallback>
                </Avatar>
              ))}

              {profile.teachers.length > 8 && (
                <span
                  className="h-7 px-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-background ring-1 ring-indigo-200 shadow-xs shrink-0 cursor-default"
                  title={`Và ${profile.teachers.length - 8} giáo viên khác`}
                >
                  +{profile.teachers.length - 8}
                </span>
              )}
            </div>
          </div>

          {/* 3. TÁCH RIÊNG NHÂN SỰ HỖ TRỢ VỚI BADGE TRỢ GIẢNG & CSM RIÊNG BIỆT */}
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center justify-between gap-1.5 text-xs flex-wrap">
              <div className="flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="font-semibold text-foreground">Nhân sự khác:</span>
                <span className="px-1.5 py-0.2 rounded-md font-bold text-[10.5px] bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  {profile.staffCount}
                </span>
              </div>

              <div className="flex items-center gap-1 flex-wrap">
                <span className="px-1.5 py-0.2 rounded-md text-[10.5px] font-medium bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                  {profile.taCount} Trợ giảng (TA)
                </span>
                <span className="px-1.5 py-0.2 rounded-md text-[10.5px] font-medium bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/20">
                  {profile.csmCount} Tuyển sinh & CSM
                </span>
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
