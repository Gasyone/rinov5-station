'use client'

import React, { useState } from 'react'
import { X, RotateCcw, Check, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

export interface FilterAsidePanelProps {
  title?: string
  description?: string
  activeCount?: number
  onReset?: () => void
  resetLabel?: string
  onClose: () => void
  ariaLabel?: string
  width?: string
  className?: string
  bodyClassName?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

/**
 * FilterAsidePanel: Khung bộ lọc nâng cao dạng thẻ ghim độc lập bên cạnh bảng dữ liệu
 * Tuân thủ quy chuẩn thiết kế Rinov5 Design System:
 * - Card nổi, bo góc rounded-lg, border border-border, đổ bóng nhẹ shadow-2xs
 * - Header có tiêu đề, badge đếm, nút Đặt lại và nút Đóng (X)
 * - Vùng danh sách nhóm cuộn tự động có dải phân cách divide-y
 */
export function FilterAsidePanel({
  title = 'Bộ lọc nâng cao',
  description,
  activeCount = 0,
  onReset,
  resetLabel = 'Đặt lại',
  onClose,
  ariaLabel = 'Panel bộ lọc nâng cao',
  width = 'w-[310px]',
  className,
  bodyClassName,
  children,
  footer,
}: FilterAsidePanelProps) {
  return (
    <aside
      aria-label={ariaLabel}
      className={cn(
        'shrink-0 border border-border bg-card rounded-lg flex flex-col h-full z-10 animate-in slide-in-from-right-4 duration-150 select-none shadow-2xs overflow-hidden',
        width,
        className
      )}
    >
      {/* 1. Header panel: Tên bộ lọc, badge số lượng, nút Đặt lại và nút đóng X */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border bg-muted/20 shrink-0">
        <div className="flex flex-col min-w-0 pr-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-semibold text-xs text-foreground truncate">{title}</span>
            {activeCount > 0 && (
              <Badge
                variant="secondary"
                className="h-4.5 rounded-full px-1.5 text-[10px] font-medium bg-primary/10 text-primary border-primary/20 shrink-0"
              >
                {activeCount}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5" title={description}>
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onReset && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={activeCount === 0}
              onClick={onReset}
              className={cn(
                'h-7 px-2 text-xs gap-1 cursor-pointer transition-colors',
                activeCount > 0
                  ? 'text-primary hover:text-primary hover:bg-primary/10 font-medium'
                  : 'text-muted-foreground/40 hover:text-muted-foreground/40 cursor-not-allowed'
              )}
              title="Đặt lại tất cả bộ lọc"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{resetLabel}</span>
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            onClick={onClose}
            title="Đóng bảng lọc"
            aria-label="Đóng bảng lọc"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 2. Danh sách các nhóm bộ lọc dạng cuộn */}
      <div
        className={cn(
          'flex-1 overflow-y-auto px-4 py-2 divide-y divide-border/40 min-h-0 text-xs',
          bodyClassName
        )}
      >
        {children}
      </div>

      {/* 3. Footer tuỳ chọn */}
      {footer && <div className="p-3 border-t border-border/50 bg-background shrink-0">{footer}</div>}
    </aside>
  )
}

export interface FilterCollapsibleSectionProps {
  title: string
  defaultOpen?: boolean
  badgeCount?: number
  onClear?: () => void
  clearLabel?: string
  className?: string
  children: React.ReactNode
}

/**
 * FilterCollapsibleSection: Nhóm bộ lọc có thể thu gọn/mở rộng
 * Tích hợp badge đếm số lượng đang chọn và nút Xóa nhanh từng nhóm
 */
export function FilterCollapsibleSection({
  title,
  defaultOpen = false,
  badgeCount = 0,
  onClear,
  clearLabel = 'Xóa',
  className,
  children,
}: FilterCollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={cn('py-2', className)}>
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex flex-1 items-center justify-between py-1 text-left cursor-pointer rounded transition-colors group/trigger"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="truncate text-xs font-semibold text-foreground group-hover/trigger:text-primary transition-colors">
                {title}
              </span>
              {badgeCount > 0 && (
                <span className="h-4 min-w-[16px] px-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center shrink-0">
                  {badgeCount}
                </span>
              )}
            </div>
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-hover/trigger:text-foreground shrink-0',
                open && 'rotate-180'
              )}
            />
          </button>
        </CollapsibleTrigger>
        {badgeCount > 0 && onClear && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            className="text-[10px] text-muted-foreground hover:text-foreground ml-2 px-1 py-0.5 rounded cursor-pointer transition-colors shrink-0"
          >
            {clearLabel}
          </button>
        )}
      </div>
      <CollapsibleContent className="animate-in slide-in-from-top-1 duration-150 pt-1">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

export interface FilterCheckboxOptionProps {
  value: string
  label: React.ReactNode
  checked: boolean
  count?: number
  onToggle: (value: string) => void
  disabled?: boolean
  className?: string
}

/**
 * FilterCheckboxOption: Hàng lựa chọn nhiều giá trị với Checkbox
 */
export function FilterCheckboxOption({
  value,
  label,
  checked,
  count,
  onToggle,
  disabled = false,
  className,
}: FilterCheckboxOptionProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center justify-between gap-2 rounded px-2 py-1.5 transition-colors select-none text-xs',
        checked ? 'bg-primary/8 text-foreground' : 'hover:bg-muted/50 text-foreground/85',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Checkbox
          checked={checked}
          disabled={disabled}
          onCheckedChange={() => !disabled && onToggle(value)}
          className={cn(
            'h-3.5 w-3.5 rounded transition-all',
            checked
              ? 'bg-primary border-primary text-primary-foreground'
              : 'border-border/80 dark:border-zinc-700 bg-background hover:border-primary/60'
          )}
        />
        <span className={cn('truncate', checked ? 'text-foreground font-medium' : 'text-foreground/80')}>
          {label}
        </span>
      </div>

      {typeof count === 'number' && (
        <span
          className={cn(
            'font-mono text-[11px] shrink-0',
            checked ? 'text-foreground/80 font-medium' : 'text-muted-foreground/60'
          )}
        >
          {count}
        </span>
      )}
    </label>
  )
}

export interface FilterRadioOptionProps {
  value: string
  label: React.ReactNode
  selected: boolean
  count?: number
  onSelect: (value: string) => void
  disabled?: boolean
  className?: string
}

/**
 * FilterRadioOption: Hàng lựa chọn đơn giá trị với icon Check khi kích hoạt
 */
export function FilterRadioOption({
  value,
  label,
  selected,
  count,
  onSelect,
  disabled = false,
  className,
}: FilterRadioOptionProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onSelect(value)}
      className={cn(
        'w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition-colors text-left cursor-pointer select-none',
        selected ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/70 text-foreground',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <span className="truncate">{label}</span>
      <div className="flex items-center gap-1 shrink-0">
        {typeof count === 'number' && (
          <span className="text-[11px] text-muted-foreground">({count})</span>
        )}
        {selected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
      </div>
    </button>
  )
}
