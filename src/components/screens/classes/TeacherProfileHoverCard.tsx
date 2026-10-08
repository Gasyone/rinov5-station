'use client'

import { type ReactNode, useState, useMemo } from 'react'
import {
  Phone,
  Mail,
  MapPin,
  BookOpen,
  Star,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getInitials, maskPhone } from '@/lib/format'
import { useCallStore } from '@/stores/useCallStore'
import { mockTeachers } from '@/mocks/teacherRecords'
import { mockEmployees } from '@/mocks/employees'
import type { ClassRecord } from '@/mocks/classRecords'
import { formatTeacherFullName } from './classesHelpers'

export interface TeacherProfileHoverCardProps {
  teacherName: string
  cls?: ClassRecord
  isSubstitute?: boolean
  substituteDate?: string
  substituteReason?: string
  isLeave?: boolean
  phone?: string
  email?: string
  role?: string
  children: ReactNode
  align?: 'start' | 'center' | 'end'
}

export interface ResolvedTeacherProfile {
  id: string
  code: string
  name: string
  avatar: string
  email: string
  phone: string
  maskedPhone: string
  branch: string
  position: string
  subjects: string[]
  rating: number
  totalClasses: number
  totalStudents: number
  startDate: string
  status: 'active' | 'on_leave' | 'substitute'
}

/**
 * Helper to resolve teacher profile information from available mocks.
 */
function resolveTeacherProfile(
  rawName: string,
  cls?: ClassRecord,
  isSubstitute?: boolean,
  isLeave?: boolean,
  overridePhone?: string,
  overrideEmail?: string
): ResolvedTeacherProfile {
  const cleanName = formatTeacherFullName(rawName)
  const lowerClean = cleanName.toLowerCase()

  // 1. Try matching from mockTeachers
  const matchedTeacher = mockTeachers.find((t) => {
    const tLower = t.name.toLowerCase()
    return tLower === lowerClean || tLower.includes(lowerClean) || lowerClean.includes(tLower)
  })

  // 2. Try matching from mockEmployees
  const matchedEmployee = mockEmployees.find((e) => {
    const eLower = e.name.toLowerCase()
    return eLower === lowerClean || eLower.includes(lowerClean) || lowerClean.includes(eLower)
  })

  // Deterministic seed for fallback
  const charCodeSum = cleanName.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  const fallbackCode = `GV-${String((charCodeSum % 900) + 100)}`
  const fallbackPhone = overridePhone || cls?.teacherPhone || `09${String((charCodeSum * 13) % 90000000 + 10000000)}`
  const fallbackEmail = overrideEmail || `gv.${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '')}@rinoedu.com`

  const subjects = matchedTeacher?.subjects || (
    cls?.level?.toLowerCase().includes('ielts') ? ['IELTS', 'Tiếng Anh giao tiếp'] :
    cls?.level?.toLowerCase().includes('toán') ? ['Toán tư duy', 'Toán nâng cao'] :
    cls?.level?.toLowerCase().includes('japanese') ? ['Tiếng Nhật JLPT'] :
    ['Tiếng Anh chuẩn Cambridge', 'Ngữ pháp']
  )

  const rating = matchedTeacher?.rating || (4.5 + ((charCodeSum % 5) * 0.1))
  const totalClasses = matchedTeacher?.totalClasses || ((charCodeSum % 3) + 2)
  const totalStudents = matchedTeacher?.totalStudents || (totalClasses * 18 + (charCodeSum % 10))

  const position = matchedEmployee?.position || (
    isSubstitute ? 'Giáo viên dạy thay (Cover)' :
    cls?.level?.toLowerCase().includes('ielts') ? 'IELTS Specialist Teacher' :
    cls?.level?.toLowerCase().includes('toán') ? 'Giáo viên Toán tư duy' :
    'Giáo viên cơ hữu'
  )

  const branch = matchedTeacher?.branch || matchedEmployee?.branch || cls?.branch || 'RinoEdu Smart City'

  const actualPhone = matchedTeacher?.phone || matchedEmployee?.phone || fallbackPhone
  const actualEmail = matchedTeacher?.email || matchedEmployee?.email || fallbackEmail

  return {
    id: matchedTeacher?.id || matchedEmployee?.id || `teacher-${cleanName}`,
    code: matchedTeacher?.code || fallbackCode,
    name: cleanName,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(cleanName)}`,
    email: actualEmail,
    phone: actualPhone,
    maskedPhone: maskPhone(actualPhone),
    branch,
    position,
    subjects,
    rating: Math.min(5, Math.max(4.0, rating)),
    totalClasses,
    totalStudents,
    startDate: matchedTeacher?.startDate ? new Date(matchedTeacher.startDate).toLocaleDateString('vi-VN') : '15/01/2023',
    status: isSubstitute ? 'substitute' : isLeave ? 'on_leave' : 'active',
  }
}

export function TeacherProfileHoverCard({
  teacherName,
  cls,
  isSubstitute = false,
  substituteDate,
  substituteReason,
  isLeave = false,
  phone,
  email,
  children,
  align = 'start',
}: TeacherProfileHoverCardProps) {
  const [phoneCopied, setPhoneCopied] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)
  const startCall = useCallStore((state) => state.startCall)

  const profile = useMemo(() => {
    return resolveTeacherProfile(teacherName, cls, isSubstitute, isLeave, phone, email)
  }, [teacherName, cls, isSubstitute, isLeave, phone, email])

  const initials = getInitials(profile.name)

  const handleCopyPhone = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!profile.phone) return
    try {
      await navigator.clipboard.writeText(profile.phone)
      setPhoneCopied(true)
      toast.success(`Đã sao chép SĐT giáo viên ${profile.name}!`)
      setTimeout(() => setPhoneCopied(false), 2000)
    } catch {
      toast.error('Không thể sao chép số điện thoại!')
    }
  }

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!profile.email) return
    try {
      await navigator.clipboard.writeText(profile.email)
      setEmailCopied(true)
      toast.success(`Đã sao chép Email giáo viên ${profile.name}!`)
      setTimeout(() => setEmailCopied(false), 2000)
    } catch {
      toast.error('Không thể sao chép email!')
    }
  }

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!profile.phone) return
    startCall({
      studentId: profile.id,
      studentName: profile.name,
      parentPhone: profile.phone,
      parentName: profile.name,
    })
    toast.success(`Đang thực hiện cuộc gọi tới giáo viên: ${profile.name} (${profile.phone})`)
  }

  const handleOpenProfile = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    toast.info(`Xem hồ sơ chi tiết giáo viên ${profile.name} (${profile.code})`)
  }

  return (
    <HoverCard openDelay={150} closeDelay={150}>
      <HoverCardTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 sm:w-[330px] p-3.5 rounded-xl shadow-xl border border-border/80 bg-popover text-popover-foreground z-50 space-y-3 text-xs"
        align={align}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Avatar, Name, Code, Status */}
        <div className="flex items-start gap-3 pb-2.5 border-b border-border/60">
          <Avatar className="h-11 w-11 shrink-0 border border-primary/20 shadow-2xs">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1.5">
              <span className="font-mono text-[10.5px] font-semibold text-muted-foreground bg-muted/80 px-1.5 py-0.2 rounded">
                {profile.code}
              </span>
              {isSubstitute ? (
                <Badge variant="outline" className="text-xs px-1.5 py-0 font-bold border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 shrink-0">
                  Dạy thay
                </Badge>
              ) : isLeave ? (
                <Badge variant="outline" className="text-xs px-1.5 py-0 font-bold border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-400 shrink-0">
                  Tạm nghỉ
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs px-1.5 py-0 font-bold border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shrink-0">
                  Đang giảng dạy
                </Badge>
              )}
            </div>
            <h4 className="text-sm font-bold text-foreground truncate mt-0.5 leading-snug" title={profile.name}>
              {profile.name}
            </h4>
            <p className="text-[11.5px] text-muted-foreground truncate">
              {profile.position}
            </p>
          </div>
        </div>

        {/* Quick Metrics: Rating, Classes, Students */}
        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div className="bg-muted/40 dark:bg-muted/20 border border-border/50 rounded-lg py-1.5 px-1">
            <span className="text-xs text-muted-foreground block font-medium">Đánh giá</span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-0.5 mt-0.5">
              {profile.rating.toFixed(1)} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            </span>
          </div>
          <div className="bg-muted/40 dark:bg-muted/20 border border-border/50 rounded-lg py-1.5 px-1">
            <span className="text-xs text-muted-foreground block font-medium">Lớp đảm nhiệm</span>
            <span className="text-xs font-bold text-foreground mt-0.5 block font-mono">
              {profile.totalClasses} lớp
            </span>
          </div>
          <div className="bg-muted/40 dark:bg-muted/20 border border-border/50 rounded-lg py-1.5 px-1">
            <span className="text-xs text-muted-foreground block font-medium">Học viên</span>
            <span className="text-xs font-bold text-[#0088cc] mt-0.5 block font-mono">
              {profile.totalStudents} HV
            </span>
          </div>
        </div>

        {/* Detailed Profile Info List */}
        <div className="space-y-2 text-xs">
          {/* Cơ sở */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground/80" />
              <span>Cơ sở:</span>
            </span>
            <span className="font-medium text-foreground truncate text-right">
              {profile.branch}
            </span>
          </div>

          {/* Môn học / Chuyên môn */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground/80" />
              <span>Bộ môn:</span>
            </span>
            <span className="font-medium text-foreground truncate text-right">
              {profile.subjects.join(', ') || 'Tiếng Anh'}
            </span>
          </div>

          {/* Số điện thoại */}
          <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-1.5">
            <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
              <Phone className="h-3.5 w-3.5 text-muted-foreground/80" />
              <span>Điện thoại:</span>
            </span>
            <div className="flex items-center gap-1">
              <span className="font-mono font-semibold text-foreground text-[11.5px]">
                {profile.maskedPhone}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={handleCall}
                className="h-5 w-5 rounded hover:bg-muted text-muted-foreground hover:text-emerald-600"
                title="Gọi điện cho giáo viên"
              >
                <Phone className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={handleCopyPhone}
                className="h-5 w-5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                title="Sao chép số điện thoại"
              >
                {phoneCopied ? (
                  <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
              <Mail className="h-3.5 w-3.5 text-muted-foreground/80" />
              <span>Email:</span>
            </span>
            <div className="flex items-center gap-1 min-w-0">
              <span className="font-mono text-muted-foreground truncate text-xs" title={profile.email}>
                {profile.email}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={handleCopyEmail}
                className="h-5 w-5 rounded hover:bg-muted text-muted-foreground hover:text-foreground shrink-0"
                title="Sao chép email"
              >
                {emailCopied ? (
                  <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Special Notice Banner: Substitute */}
        {isSubstitute && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-2 text-xs text-amber-800 dark:text-amber-300 space-y-0.5">
            <div className="font-bold flex items-center gap-1">
              <Calendar className="h-3 w-3 text-amber-600" />
              <span>Dạy thay buổi học {substituteDate ? `(${substituteDate})` : ''}</span>
            </div>
            {substituteReason && (
              <p className="text-muted-foreground italic text-[10.5px]">
                Lý do: {substituteReason}
              </p>
            )}
          </div>
        )}

        {/* Special Notice Banner: Leave */}
        {isLeave && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/20 p-2 text-xs text-rose-800 dark:text-rose-300">
            <p className="font-bold flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-rose-600" />
              <span>Đang trong diện nghỉ phép / tạm vắng</span>
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="border-t border-border/40 pt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Thâm niên: {profile.startDate}</span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleOpenProfile}
            className="h-6 px-2 text-xs font-semibold text-primary hover:bg-primary/10 rounded-md gap-1 cursor-pointer"
          >
            <span>Xem hồ sơ</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
