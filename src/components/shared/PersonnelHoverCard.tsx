'use client'

import { type ReactNode, useState } from 'react'
import { Phone, Copy, Check, Mail, Shield } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { toast } from 'sonner'
import { getInitials } from '@/lib/format'
import type { PersonnelItem } from './PersonnelCell'

interface PersonnelHoverCardProps {
  person: PersonnelItem
  children: ReactNode
  align?: 'start' | 'center' | 'end'
}

export function PersonnelHoverCard({
  person,
  children,
  align = 'start',
}: PersonnelHoverCardProps) {
  const [copied, setCopied] = useState(false)
  const initials = getInitials(person.name)
  const staffCode = person.id || `EMP-${person.name.split(' ').map((n) => n[0]).join('').toUpperCase()}`
  const staffAvatar = person.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${person.name}`

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!person.phone) return
    try {
      await navigator.clipboard.writeText(person.phone)
      setCopied(true)
      toast.success('Đã sao chép số điện thoại!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Không thể sao chép số điện thoại!')
    }
  }

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!person.phone) return
    toast.success(`Đang thực hiện cuộc gọi CS tới nhân viên: ${person.name} (${person.phone})`)
  }

  return (
    <HoverCard openDelay={100} closeDelay={150}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4 rounded-xl shadow-md border bg-popover text-popover-foreground z-50" align={align}>
        <div className="space-y-3.5">
          {/* Header row: Avatar + Name + Code */}
          <div className="flex items-center gap-3 pb-3 border-b border-border/60">
            <Avatar className="h-11 w-11 shrink-0 border border-primary/10">
              <AvatarImage src={staffAvatar} alt={person.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-foreground truncate">{person.name}</h4>
              <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-muted text-muted-foreground rounded-md text-[9px] font-mono font-semibold uppercase tracking-wider">
                {staffCode}
              </span>
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-muted-foreground block font-semibold uppercase tracking-wide">Chức danh</span>
                <span className="font-semibold text-foreground truncate block">{person.role || '—'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-border/30 pt-2">
              <div className="flex items-center gap-2 min-w-0">
                <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-muted-foreground block font-semibold uppercase tracking-wide">Số điện thoại</span>
                  <span className="font-semibold text-foreground font-mono truncate block">{person.phone || '—'}</span>
                </div>
              </div>
              
              {person.phone && (
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={handleCall}
                    className="h-6 w-6 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                    title="Gọi điện"
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={handleCopy}
                    className="h-6 w-6 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                    title="Sao chép số điện thoại"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-border/30 pt-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-muted-foreground block font-semibold uppercase tracking-wide">Email liên hệ</span>
                <span className="font-semibold text-foreground truncate block" title={person.email || undefined}>{person.email || '—'}</span>
              </div>
            </div>

            {person.isLeave && (
              <div className="mt-2.5 pt-2 border-t border-dashed border-rose-500/30 text-[11px] text-rose-600 dark:text-rose-400 bg-rose-50/30 dark:bg-rose-950/10 p-2 rounded-lg">
                <p className="font-bold flex items-center gap-1">
                  ⚠️ Đang tạm nghỉ (Nghỉ)
                </p>
              </div>
            )}

            {person.isSubstitute && (
              <div className="mt-2.5 pt-2 border-t border-dashed border-amber-500/30 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50/30 dark:bg-amber-950/10 p-2 rounded-lg">
                <p className="font-bold flex items-center gap-1">
                  ⚠️ Dạy thay {person.date ? `(${person.date})` : ''}
                </p>
                {person.reason && <p className="mt-0.5 italic">Lý do: {person.reason}</p>}
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
