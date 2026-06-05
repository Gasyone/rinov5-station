'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { getInitials } from '@/lib/format'
import { cn } from '@/lib/utils'
import { PersonnelHoverCard } from './PersonnelHoverCard'

export interface PersonnelItem {
  id?: string
  name: string
  avatar?: string | null
  role?: string
  phone?: string
  email?: string
  isSubstitute?: boolean // Dạy thay/tạm thời
  date?: string // Ngày dạy thay
  reason?: string // Lý do dạy thay
}

interface PersonnelCellProps {
  /** Danh sách nhân sự liên quan */
  items: PersonnelItem[]
  /** Số lượng hiển thị tối đa trong chế độ stack */
  maxVisible?: number
  /** Kích thước: sm (28px), md (36px) */
  size?: 'sm' | 'md'
  /** Chế độ hiển thị: auto (1 người hiển thị chi tiết, nhiều người hiển thị stack), single, stack */
  mode?: 'auto' | 'single' | 'stack'
  className?: string
}

/**
 * Component hiển thị nhân sự liên quan trong bảng.
 * Hỗ trợ hiển thị Avatar đơn lẻ kèm tên & vai trò hoặc xếp chồng (stack) nhiều nhân sự.
 * Khi hover hiển thị Tooltip thông tin chi tiết.
 *
 * @see docs/DESIGN_SYSTEM.md §3.4 Avatar Groups & §4.2 List Page Pattern
 */
export function PersonnelCell({
  items,
  maxVisible = 3,
  size = 'sm',
  mode = 'auto',
  className,
}: PersonnelCellProps) {
  const sizeClasses = {
    sm: {
      container: 'h-7 w-7 text-xs border-2',
      fallback: 'text-[10px] font-bold',
      singleText: 'text-xs',
      singleContainer: 'h-7 w-7 rounded-md',
    },
    md: {
      container: 'h-9 w-9 text-sm border-2',
      fallback: 'text-xs font-bold',
      singleText: 'text-sm',
      singleContainer: 'h-9 w-9 rounded-md',
    },
  }

  const currentSize = sizeClasses[size]
  const list = items.filter((item) => Boolean(item.name))

  if (list.length === 0) {
    return <span className="text-sm text-muted-foreground italic">-</span>
  }

  const isSingleMode = mode === 'single' || (mode === 'auto' && list.length === 1)

  // 1. Chế độ hiển thị đơn lẻ (Single Person Details)
  if (isSingleMode) {
    const person = list[0]
    const initials = getInitials(person.name)

    const content = (
      <div className={cn('flex items-center gap-2 min-w-0', className)}>
        <Avatar
          className={cn(
            'shrink-0 border bg-muted',
            currentSize.singleContainer,
            person.isSubstitute
              ? 'border-dashed border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-950/20'
              : 'border-border'
          )}
        >
          {person.avatar && (
            <AvatarImage src={person.avatar} alt={person.name} />
          )}
          <AvatarFallback className={currentSize.fallback}>
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 leading-tight">
          <p className={cn('font-semibold truncate text-foreground', currentSize.singleText)}>{person.name}</p>
          {person.role && (
            <p className="text-[10px] text-muted-foreground truncate">{person.role}</p>
          )}
        </div>
      </div>
    )

    return (
      <PersonnelHoverCard person={person} align="start">
        <div className="inline-block max-w-full cursor-help">{content}</div>
      </PersonnelHoverCard>
    )
  }

  // 2. Chế độ hiển thị nhóm xếp chồng (Avatar Stack Mode)
  const visibleItems = list.slice(0, maxVisible)
  const remainingCount = list.length - maxVisible

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn('flex items-center -space-x-2', className)}>
        {visibleItems.map((person, index) => {
          const initials = getInitials(person.name)
          return (
            <PersonnelHoverCard key={person.id || person.name || index} person={person} align="center">
              <Avatar
                className={cn(
                  'shrink-0 border-2 border-card bg-muted cursor-help transition-transform hover:translate-y-[-2px] hover:z-35',
                  currentSize.container,
                  person.isSubstitute
                    ? 'border-dashed border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                    : 'bg-primary/10 text-primary'
                )}
              >
                {person.avatar && (
                  <AvatarImage src={person.avatar} alt={person.name} />
                )}
                <AvatarFallback className={currentSize.fallback}>
                  {initials}
                </AvatarFallback>
              </Avatar>
            </PersonnelHoverCard>
          )
        })}

        {/* Badge số người còn lại */}
        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  'flex shrink-0 items-center justify-center rounded-full border-2 border-card bg-muted text-muted-foreground font-semibold cursor-help',
                  currentSize.container,
                  size === 'sm' ? 'text-[9px]' : 'text-xs'
                )}
              >
                +{remainingCount}
              </div>
            </TooltipTrigger>
            <TooltipContent className="p-2.5 max-w-56 rounded-lg shadow-lg border bg-popover text-popover-foreground">
              <p className="text-xs font-semibold text-muted-foreground mb-1.5">Nhân sự liên quan khác:</p>
              <ul className="space-y-1">
                {list.slice(maxVisible).map((person, index) => (
                  <li key={person.name + index} className="text-xs font-medium truncate">
                    • {person.name} {person.role ? `(${person.role})` : ''}
                  </li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}
