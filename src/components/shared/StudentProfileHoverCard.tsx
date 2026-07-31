'use client'

import React, { useState } from 'react'
import { Phone, Copy, Check, Eye, User, Calendar, Award, GraduationCap, ShieldCheck, HeartHandshake, Star, Sparkles } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Button } from '@/components/ui/button'
import { AppAvatar } from './AppAvatar'
import { toast } from 'sonner'
import { useCallStore } from '@/stores/useCallStore'

export interface StudentProfileItem {
  id: string
  name: string
  code?: string
  avatar?: string
  status?: string
  birthDate?: string
  gender?: string
  branch?: string
  classCode?: string
  className?: string
  parentName?: string
  parentPhone?: string
  parentRelation?: string
  attendanceRate?: string
  homeworkRate?: string
  avgScore?: string
  rating?: number
  isTrial?: boolean
  trialNotice?: string
  note?: string
}

export interface StudentProfileHoverCardProps {
  student: StudentProfileItem
  children: React.ReactNode
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  onOpenDetail?: (studentId: string) => void
}

export function StudentProfileHoverCard({
  student,
  children,
  align = 'start',
  side = 'bottom',
  onOpenDetail,
}: StudentProfileHoverCardProps) {
  const [copied, setCopied] = useState(false)
  const startCall = useCallStore((state) => state.startCall)

  const studentCode = student.code || `STU-${student.id.replace(/\D/g, '') || '001'}`
  const parentName = student.parentName || `Phụ huynh em ${student.name}`
  const parentPhone = student.parentPhone || '0987654321'
  const parentRelation = student.parentRelation || 'Phụ huynh'
  const birthDate = student.birthDate || '15/03/2005'
  const gender = student.gender || 'Nam'
  const statusLabel = student.status || 'Đang học'
  const branch = student.branch || 'RinoEdu Nguyễn Tuân'
  const attendanceRate = student.attendanceRate || '91.7%'
  const homeworkRate = student.homeworkRate || '91.7%'
  const avgScore = student.avgScore || '7.0 / 9.0'
  const rating = student.rating ?? 4.8
  const isTrial = student.isTrial ?? (student.name.includes('An') || student.name.includes('Chi'))

  const handleCopyPhone = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(parentPhone)
      setCopied(true)
      toast.success(`Đã sao chép SĐT phụ huynh: ${parentPhone}`)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Không thể sao chép số điện thoại!')
    }
  }

  const handleCallParent = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    startCall({
      studentId: student.id,
      studentName: student.name,
      parentPhone: parentPhone,
      parentName: parentName,
    })
    toast.success(`Đang thực hiện cuộc gọi tới phụ huynh: ${parentName} (${parentPhone})`)
  }

  return (
    <HoverCard openDelay={150} closeDelay={150}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        side={side}
        align={align}
        className="w-88 p-4 rounded-2xl shadow-xl border border-border/80 bg-popover text-popover-foreground z-50 text-left space-y-3 animate-in fade-in-50 zoom-in-95 duration-150"
      >
        {/* Header Row: Student Avatar, Name, Tab-style Status, Rating Star */}
        <div className="flex items-start gap-3 pb-2.5 border-b border-border/60">
          <div className="relative shrink-0">
            <AppAvatar
              src={student.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${student.name}`}
              name={student.name}
              size="lg"
              className="h-13 w-13 border-2 border-primary/30 shadow-xs"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-background shadow-2xs" />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            {/* Name + Status Tab Badge + Star Rating */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-sm font-bold text-foreground truncate leading-tight">
                {student.name}
              </h4>

              {/* Status Badge in Tab style */}
              <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 shrink-0 shadow-3xs">
                {statusLabel}
              </span>

              {/* Rating Star Average Badge */}
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 text-[10.5px] font-bold dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 shrink-0 shadow-3xs">
                <Star className="h-3 w-3 fill-amber-400 text-amber-500 shrink-0" />
                <span className="font-mono font-bold">{rating}</span>
              </span>
            </div>

            {/* Sub-info: Student Code, Birthdate, Gender */}
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground flex-wrap">
              <span className="font-mono font-semibold text-foreground bg-muted px-1.5 py-0.2 rounded text-[10px]">
                {studentCode}
              </span>
              <span>•</span>
              <span>{birthDate}</span>
              <span>({gender})</span>
            </div>

            {/* Branch / School */}
            <div className="text-[10.5px] font-medium text-muted-foreground flex items-center gap-1 truncate">
              <GraduationCap className="h-3 w-3 text-sky-600 shrink-0" />
              <span className="truncate">{branch}</span>
            </div>
          </div>
        </div>

        {/* Trial / New Student Alert Banner Notice */}
        {isTrial && (
          <div className="rounded-xl bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-sky-500/10 border border-cyan-300/80 dark:border-cyan-800/60 p-2.5 flex items-start gap-2 text-xs shadow-2xs">
            <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center justify-between gap-1">
                <span className="font-extrabold text-cyan-900 dark:text-cyan-200 text-[10.5px] uppercase tracking-wide">
                  HỌC VIÊN MỚI (TRIAL / HỌC THỬ)
                </span>
                <span className="text-[9px] font-extrabold bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 px-1.5 py-0.2 rounded-full border border-cyan-300/60">
                  Buổi 1/2
                </span>
              </div>
              <p className="text-[10.5px] text-muted-foreground leading-snug">
                {student.trialNotice || 'Học viên vừa gia nhập lớp học thử. Cần ưu tiên chú ý hỗ trợ & hỏi thăm hòa nhập 2 buổi đầu.'}
              </p>
            </div>
          </div>
        )}

        {/* Smart Metrics 3-Card Summary Grid */}
        <div className="grid grid-cols-3 gap-2 py-0.5 select-none">
          <div className="rounded-xl border border-border/60 bg-muted/30 p-2 text-center space-y-0.5">
            <span className="block text-[9.5px] font-extrabold text-muted-foreground uppercase tracking-wider">
              Chuyên cần
            </span>
            <span className="block text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {attendanceRate}
            </span>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/30 p-2 text-center space-y-0.5">
            <span className="block text-[9.5px] font-extrabold text-muted-foreground uppercase tracking-wider">
              BTVN
            </span>
            <span className="block text-xs font-extrabold text-sky-600 dark:text-sky-400 font-mono">
              {homeworkRate}
            </span>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/30 p-2 text-center space-y-0.5">
            <span className="block text-[9.5px] font-extrabold text-muted-foreground uppercase tracking-wider">
              Điểm TB
            </span>
            <span className="block text-xs font-extrabold text-amber-600 dark:text-amber-400 font-mono">
              {avgScore}
            </span>
          </div>
        </div>

        {/* Parent Information Card */}
        <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[10.5px] font-bold text-muted-foreground uppercase tracking-wide">
            <span>Thông tin Phụ huynh</span>
            <span className="text-[9.5px] font-normal text-emerald-600 dark:text-emerald-400">● Liên hệ chính</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="font-semibold text-foreground block truncate">
                {parentName} <span className="text-muted-foreground font-normal">({parentRelation})</span>
              </span>
              <span className="font-mono text-xs text-muted-foreground font-semibold block">
                {parentPhone}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                onClick={handleCallParent}
                className="h-7 w-7 rounded-lg border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900 dark:hover:bg-emerald-950/60 cursor-pointer shadow-2xs"
                title="Gọi điện cho phụ huynh"
              >
                <Phone className="h-3.5 w-3.5 fill-emerald-600/10" />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                onClick={handleCopyPhone}
                className="h-7 w-7 rounded-lg border-border hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
                title="Sao chép số điện thoại"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Action Footer Button */}
        <div className="pt-0.5 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="default"
            size="xs"
            onClick={(e) => {
              e.stopPropagation()
              if (onOpenDetail) {
                onOpenDetail(student.id)
              } else {
                toast.info(`Mở chi tiết học viên: ${student.name}`)
              }
            }}
            className="w-full h-7 text-xs font-semibold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-2xs flex items-center justify-center gap-1.5"
          >
            <Eye className="h-3.5 w-3.5" /> Xem chi tiết học viên
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
