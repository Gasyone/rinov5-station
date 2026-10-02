'use client'

import { useState, type ReactNode } from 'react'
import { Phone, Mail, Copy, Check, Shield, ExternalLink } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { AppAvatar } from '@/components/shared'
import { useUserProfileStore } from '@/stores/useUserProfileStore'
import { toast } from 'sonner'

export interface StaffProfileData {
  id?: string
  name: string
  role?: string
  phone?: string
  email?: string
  avatar?: string | null
  isSubstitute?: boolean
}

const STAFF_DETAILS: Record<string, { role: string; phone: string; email: string }> = {
  'Thu Hà': { role: 'Giáo viên Tiếng Anh', phone: '0912 345 678', email: 'ha.nt@rinoedu.edu.vn' },
  'Mỹ Linh': { role: 'Giáo viên Toán tư duy', phone: '0987 654 321', email: 'linh.pm@rinoedu.edu.vn' },
  'Coenrad Redman': { role: 'Giáo viên Bản ngữ', phone: '0909 123 456', email: 'coenrad.r@rinoedu.edu.vn' },
  'Hương Ly': { role: 'Giáo viên dạy thay', phone: '0911 223 344', email: 'ly.lh@rinoedu.edu.vn' },
  'Thanh Bình': { role: 'Giáo viên dạy thay', phone: '0922 334 455', email: 'binh.nt@rinoedu.edu.vn' },
  'David John': { role: 'Giáo viên Bản ngữ (Dạy thay)', phone: '0933 445 566', email: 'david.j@rinoedu.edu.vn' },
  'Quỳnh Trang': { role: 'Giáo viên Tiếng Anh', phone: '0966 778 899', email: 'trang.q@rinoedu.edu.vn' },
  'Minh Trang': { role: 'Trợ giảng', phone: '0977 889 900', email: 'trang.m@rinoedu.edu.vn' },
  'Hoàng Nam': { role: 'Trợ giảng', phone: '0934 567 890', email: 'nam.lh@rinoedu.edu.vn' },
  'Lan Anh': { role: 'Trợ giảng', phone: '0945 678 901', email: 'anh.nt@rinoedu.edu.vn' },
  'Đức Anh': { role: 'Trợ giảng', phone: '0956 789 012', email: 'anh.nd@rinoedu.edu.vn' },
  'Phương Thảo': { role: 'Trợ giảng trực thay', phone: '0967 890 123', email: 'thao.np@rinoedu.edu.vn' },
  'Gia Huy': { role: 'Trợ giảng trực thay', phone: '0978 901 234', email: 'huy.dg@rinoedu.edu.vn' },
  'Nguyễn Thu Hà': { role: 'Trợ giảng', phone: '0912 345 678', email: 'ha.nt@rinoedu.edu.vn' },
  'Trần Minh Châu': { role: 'Trợ giảng', phone: '0923 456 789', email: 'chau.tm@rinoedu.edu.vn' },
  'Lê Hoàng Nam': { role: 'Trợ giảng', phone: '0934 567 890', email: 'nam.lh@rinoedu.edu.vn' },
  'Vũ Hải Đăng': { role: 'Trợ giảng', phone: '0956 789 012', email: 'dang.vh@rinoedu.edu.vn' },
}

export function getStaffPersonnel(name: string, defaultRole = 'Giáo viên', isSub = false): StaffProfileData {
  const cleanName = name.replace(/^(GV|TG|Trợ giảng|Giáo viên):\s*/i, '').trim()
  const detail = STAFF_DETAILS[cleanName]
  const initials = cleanName
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

  return {
    id: `EMP-${initials || 'NV'}`,
    name: cleanName,
    role: isSub
      ? detail?.role?.includes('thay')
        ? detail.role
        : `${defaultRole} (Dạy thay)`
      : detail?.role || defaultRole,
    phone: detail?.phone || '0912 345 678',
    email: detail?.email || `${cleanName.toLowerCase().replace(/\s+/g, '')}@rinoedu.edu.vn`,
    isSubstitute: isSub,
  }
}

interface StaffProfilePopoverProps {
  person: StaffProfileData
  children: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}

export function StaffProfilePopover({
  person,
  children,
  side = 'top',
  align = 'start',
}: StaffProfilePopoverProps) {
  const [copied, setCopied] = useState(false)
  const openProfile = useUserProfileStore((s) => s.openProfile)

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!person.phone) return
    navigator.clipboard.writeText(person.phone)
    setCopied(true)
    toast.success('Đã sao chép số điện thoại!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!person.phone) return
    toast.success(`Đang thực hiện cuộc gọi CS tới nhân sự: ${person.name} (${person.phone})`)
  }

  const handleMail = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!person.email) return
    window.location.href = `mailto:${person.email}`
  }

  const handleOpenFullProfile = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const isTeacher = person.role?.toLowerCase().includes('giáo viên')
    openProfile(person.name, isTeacher ? 'teacher' : 'staff')
  }

  return (
    <Popover>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        sideOffset={6}
        className="w-72 p-3.5 rounded-xl shadow-xl border border-border/80 bg-popover text-popover-foreground z-60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-3">
          {/* Header row: Avatar, Name, Code, Substitute badge */}
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/50">
            <AppAvatar name={person.name} size="md" isSubstitute={person.isSubstitute} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-xs font-bold text-foreground truncate">{person.name}</h4>
                {person.isSubstitute && (
                  <span className="text-[9px] px-1 py-0.2 rounded font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    Dạy thay
                  </span>
                )}
              </div>
              <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-muted text-muted-foreground rounded text-[10px] font-mono font-medium">
                {person.id}
              </span>
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-muted-foreground block font-medium">Chức vụ</span>
                <span className="font-semibold text-foreground truncate block">{person.role || 'Nhân sự'}</span>
              </div>
            </div>

            {person.phone && (
              <div className="flex items-center justify-between gap-2 border-t border-border/30 pt-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-muted-foreground block font-medium">Số điện thoại</span>
                    <span className="font-semibold text-foreground font-mono truncate block">{person.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={handleCall}
                    className="h-6 w-6 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Gọi điện"
                  >
                    <Phone className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={handleCopyPhone}
                    className="h-6 w-6 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Sao chép số điện thoại"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {person.email && (
              <div className="flex items-center justify-between gap-2 border-t border-border/30 pt-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-muted-foreground block font-medium">Email</span>
                    <span className="font-semibold text-foreground truncate block text-[11px]">{person.email}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleMail}
                  className="h-6 w-6 rounded hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                  title="Gửi email"
                >
                  <Mail className="h-3 w-3 text-sky-600 dark:text-sky-400" />
                </Button>
              </div>
            )}
          </div>

          {/* Footer action link to full profile */}
          <div className="border-t border-border/40 pt-2 flex items-center justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleOpenFullProfile}
              className="h-6 px-2 text-[10px] font-semibold text-primary hover:text-primary/80 gap-1 cursor-pointer"
            >
              <ExternalLink className="h-3 w-3" />
              Xem hồ sơ chi tiết
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
