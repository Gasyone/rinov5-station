'use client'

import { CalendarDays, Check, Copy, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'
import { StudentNotePopover } from './StudentNotePopover'
import { StatusBadge } from './StatusBadge'

export interface StudentRosterCardParent {
  name: string
  phone: string
  relationship: string
}

export interface StudentRosterCardItem {
  id: string
  name: string
  code: string
  status: string
  enrollmentDate: string
  parentName: string
  parentPhone: string
  parents?: StudentRosterCardParent[]
  note?: string
}

interface StudentRosterCardProps {
  student: StudentRosterCardItem
  copiedId?: string | null
  muted?: boolean
  isReadOnly?: boolean
  onStudentClick?: (studentId: string) => void
  onRemove?: (student: StudentRosterCardItem) => void
  onCallParent?: (phone: string, name: string) => void
  onCopyParentPhone?: (phone: string, copyId: string) => void
}

function getInitials(name: string) {
  return name
    .trim()
    .split(' ')
    .map((part) => part[0])
    .slice(-2)
    .join('')
    .toUpperCase()
}

function maskPhone(phone?: string) {
  if (!phone) return '—'
  const clean = phone.replace(/\s+/g, '')
  if (clean.length < 7) return clean
  return `${clean.substring(0, 3)}****${clean.substring(clean.length - 3)}`
}



function ParentContactRow({
  parent,
  copyId,
  copiedId,
  onCallParent,
  onCopyParentPhone,
}: {
  parent: StudentRosterCardParent
  copyId: string
  copiedId?: string | null
  onCallParent?: (phone: string, name: string) => void
  onCopyParentPhone?: (phone: string, copyId: string) => void
}) {
  return (
    <div className="flex items-center justify-between border-b border-muted/30 py-1.5 last:border-0">
      <div>
        <div className="text-xs font-semibold text-foreground">
          {parent.name} ({parent.relationship})
        </div>
        <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
          {maskPhone(parent.phone)}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={(event) => {
            event.stopPropagation()
            onCallParent?.(parent.phone, parent.name)
          }}
          className="h-6 w-6 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Gọi điện"
        >
          <Phone className="h-3 w-3 text-primary" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={(event) => {
            event.stopPropagation()
            onCopyParentPhone?.(parent.phone, copyId)
          }}
          className="h-6 w-6 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Sao chép số điện thoại"
        >
          {copiedId === copyId ? (
            <Check className="h-3 w-3 text-primary" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  )
}

export function StudentRosterCard({
  student,
  copiedId,
  muted,
  isReadOnly,
  onStudentClick,
  onRemove,
  onCallParent,
  onCopyParentPhone,
}: StudentRosterCardProps) {
  const initials = getInitials(student.name)
  const parents = student.parents?.length
    ? student.parents
    : [{ name: student.parentName, phone: student.parentPhone, relationship: 'Phụ huynh' }]

  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-xl border border-muted/60 bg-background p-4 shadow-xs transition-all hover:border-muted-foreground/30 hover:shadow-sm',
        muted && 'bg-muted/5 opacity-70'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex h-10 w-10 shrink-0 cursor-help items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-sm font-bold text-primary shadow-xs">
                {initials}
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-4" align="start">
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-muted pb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                    {initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{student.name}</h4>
                    <p className="font-mono text-[9px] text-muted-foreground">{student.code}</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p className="border-b border-muted/40 pb-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    LIÊN HỆ GIA ĐÌNH
                  </p>
                  {parents.map((parent, index) => (
                    <ParentContactRow
                      key={`${student.id}-${parent.phone}-${index}`}
                      parent={parent}
                      copyId={`${student.id}-${index}`}
                      copiedId={copiedId}
                      onCallParent={onCallParent}
                      onCopyParentPhone={onCopyParentPhone}
                    />
                  ))}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>

          <div className="min-w-0">
            <button
              type="button"
              className="block max-w-full truncate text-left text-sm font-bold text-foreground hover:text-primary hover:underline"
              onClick={(event) => {
                event.stopPropagation()
                onStudentClick?.(student.id)
              }}
            >
              {student.name}
            </button>
            <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{student.code}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5 text-right">
          {student.status === 'trial' && (
            <StatusBadge
              status="trial"
              label="Học thử"
              className="text-[10px] px-2 py-0.5"
            />
          )}
          <div className="flex items-center justify-end gap-1 text-[10px] font-normal text-muted-foreground">
            <CalendarDays className="h-3 w-3 text-muted-foreground/60" />
            <span>
              Nhập học:{' '}
              <strong className="font-mono font-semibold text-foreground">
                {new Date(student.enrollmentDate).toLocaleDateString('vi-VN')}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {(student.note || (!isReadOnly && onRemove && !muted)) ? (
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-muted/50 pt-3">
          <StudentNotePopover
            note={student.note}
            label="Ghi chú học viên"
            className="max-w-[70%]"
          />

          {!isReadOnly && onRemove && !muted ? (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => onRemove(student)}
              className="ml-auto h-7 shrink-0 rounded-lg px-2.5 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Xóa khỏi lớp
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
