'use client'

import { useState, useMemo } from 'react'
import { Check, ChevronDown, Search, Plus } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { STAFF_LIST, StaffOption } from './crmCustomerCreateTypes'

/**
 * Dropdown đơn giản không cần ô tìm kiếm (Dành cho ít lựa chọn như Nhóm ngành)
 */
export function SimpleSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Chọn...',
  className,
}: {
  value: string
  onValueChange: (val: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const selectedLabel = options.find((o) => o.value === value)?.label || ''

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            'h-7.5 w-full justify-between px-2.5 text-xs bg-background font-normal border-input hover:bg-muted/30 cursor-pointer',
            className
          )}
        >
          <span
            className={cn(
              'truncate text-xs',
              selectedLabel ? 'text-foreground font-normal' : 'text-muted-foreground/50 text-xs font-normal'
            )}
          >
            {selectedLabel || placeholder}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50 shrink-0 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-48 p-1.5 space-y-1 max-h-56 overflow-y-auto z-50 shadow-md">
        {options.map((opt) => (
          <div
            key={opt.value}
            onClick={() => {
              onValueChange(opt.value)
              setOpen(false)
            }}
            className={cn(
              'flex items-center justify-between px-2.5 py-2 rounded-md text-xs cursor-pointer transition-colors min-h-[32px]',
              opt.value === value
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-muted/70 text-foreground'
            )}
          >
            <span>{opt.label}</span>
            {opt.value === value && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}

/**
 * Dropdown tìm kiếm có ô search
 */
export function SearchSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Chọn...',
  className,
}: {
  value: string
  onValueChange: (val: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return options
    const q = search.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, search])

  const selectedLabel = options.find((o) => o.value === value)?.label || ''

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            'h-7.5 w-full justify-between px-2.5 text-xs bg-background font-normal border-input hover:bg-muted/30 cursor-pointer',
            className
          )}
        >
          <span
            className={cn(
              'truncate text-xs',
              selectedLabel ? 'text-foreground font-normal' : 'text-muted-foreground/50 text-xs font-normal'
            )}
          >
            {selectedLabel || placeholder}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50 shrink-0 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-1.5 space-y-1.5 max-h-64 flex flex-col z-50 shadow-md">
        <div className="flex items-center gap-1.5 px-2 py-1.5 bg-muted/30 rounded-md border border-border/60">
          <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm..."
            className="w-full bg-transparent text-xs outline-none p-0 placeholder:text-xs placeholder:text-muted-foreground/50"
          />
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 max-h-48 pr-0.5">
          {filtered.length === 0 ? (
            <div className="py-3 text-center text-xs text-muted-foreground">Không có kết quả</div>
          ) : (
            filtered.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onValueChange(opt.value)
                  setOpen(false)
                  setSearch('')
                }}
                className={cn(
                  'flex items-center justify-between px-2.5 py-2 rounded-md text-xs cursor-pointer transition-colors min-h-[32px]',
                  opt.value === value
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-muted/70 text-foreground'
                )}
              >
                <span className="truncate">{opt.label}</span>
                {opt.value === value && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Dropdown chọn trường học có thể search hoặc gõ thêm tên trường mới
 */
export function CreatableSearchSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Chọn hoặc nhập tên trường...',
  className,
}: {
  value: string
  onValueChange: (val: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return options
    const q = search.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, search])

  const exactMatch = options.some(
    (o) => o.value.toLowerCase() === search.trim().toLowerCase()
  )

  const handleSelectValue = (val: string) => {
    onValueChange(val)
    setOpen(false)
    setSearch('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            'h-7.5 w-full justify-between px-2.5 text-xs bg-background font-normal border-input hover:bg-muted/30 cursor-pointer',
            className
          )}
        >
          <span
            className={cn(
              'truncate text-xs',
              value ? 'text-foreground font-normal' : 'text-muted-foreground/50 text-xs font-normal'
            )}
          >
            {value || placeholder}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50 shrink-0 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-1.5 space-y-1.5 max-h-64 flex flex-col z-50 shadow-md">
        <div className="flex items-center gap-1.5 px-2 py-1.5 bg-muted/30 rounded-md border border-border/60">
          <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm hoặc gõ tên trường mới..."
            className="w-full bg-transparent text-xs outline-none p-0 placeholder:text-xs placeholder:text-muted-foreground/50"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && search.trim()) {
                e.preventDefault()
                handleSelectValue(search.trim())
              }
            }}
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 max-h-48 pr-0.5">
          {search.trim() && !exactMatch && (
            <div
              onClick={() => handleSelectValue(search.trim())}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-md text-xs cursor-pointer bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 font-medium min-h-[32px] border border-emerald-200/60 transition-colors"
            >
              <Plus className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Thêm trường mới: &quot;{search.trim()}&quot;</span>
            </div>
          )}

          {filtered.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleSelectValue(opt.value)}
              className={cn(
                'flex items-center justify-between px-2.5 py-2 rounded-md text-xs cursor-pointer transition-colors min-h-[32px]',
                opt.value === value
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-muted/70 text-foreground'
              )}
            >
              <span className="truncate">{opt.label}</span>
              {opt.value === value && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
            </div>
          ))}

          {filtered.length === 0 && !search.trim() && (
            <div className="py-3 text-center text-xs text-muted-foreground">Không có dữ liệu gợi ý</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Dropdown / Popover chọn Nhân viên phụ trách có Search, Checkbox và Avatar tròn phía trước
 * Tái sử dụng đồng bộ cho cả Form Tạo lead mới và Danh sách Lead
 */
export function StaffSelect({
  selectedStaff,
  onToggleStaff,
  onSelectStaff,
  staffList = STAFF_LIST,
  trigger,
  mode = 'multiple',
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  placeholder = 'Chọn nhân sự phụ trách...',
  className,
  align = 'start',
}: {
  selectedStaff: string[] | string
  onToggleStaff?: (name: string) => void
  onSelectStaff?: (staff: StaffOption) => void
  staffList?: StaffOption[]
  trigger?: React.ReactNode
  mode?: 'single' | 'multiple'
  open?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  className?: string
  align?: 'start' | 'center' | 'end'
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = (val: boolean) => {
    if (isControlled) {
      setControlledOpen?.(val)
    } else {
      setInternalOpen(val)
    }
  }

  const [search, setSearch] = useState('')

  const selectedStaffArray = useMemo(() => {
    if (Array.isArray(selectedStaff)) return selectedStaff
    return selectedStaff ? [selectedStaff] : []
  }, [selectedStaff])

  const filtered = useMemo(() => {
    if (!search.trim()) return staffList
    const q = search.toLowerCase()
    return staffList.filter(
      (s) => s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q)
    )
  }, [staffList, search])

  const handleSelect = (staff: StaffOption) => {
    onSelectStaff?.(staff)
    onToggleStaff?.(staff.name)
    if (mode === 'single') {
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              'h-7.5 w-full justify-between text-xs px-2.5 bg-background font-normal border-input hover:bg-muted/30 cursor-pointer',
              className
            )}
          >
            <span className="truncate text-xs text-foreground">
              {selectedStaffArray.length === 0 ? (
                <span className="text-muted-foreground/50 text-xs font-normal">{placeholder}</span>
              ) : selectedStaffArray.length === 1 ? (
                selectedStaffArray[0]
              ) : (
                `${selectedStaffArray.length} nhân sự phụ trách`
              )}
            </span>
            <ChevronDown className="h-3 w-3 opacity-50 shrink-0 ml-1" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent align={align} className="w-72 p-2 space-y-1.5 max-h-80 flex flex-col z-50 shadow-md">
        <div className="flex items-center gap-1.5 px-2 py-1.5 bg-muted/30 rounded-md border border-border/60">
          <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm nhân sự..."
            className="w-full bg-transparent text-xs outline-none p-0 placeholder:text-xs placeholder:text-muted-foreground/50"
          />
        </div>
        <div className="text-[10.5px] font-semibold text-muted-foreground uppercase px-1 pb-0.5 border-b border-border/60">
          Danh sách nhân sự phụ trách
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 max-h-48 pr-0.5">
          {filtered.length === 0 ? (
            <div className="py-3 text-center text-xs text-muted-foreground">Không tìm thấy nhân sự</div>
          ) : (
            filtered.map((staff) => {
              const isChecked = selectedStaffArray.some(
                (s) => s === staff.name || s.includes(staff.name)
              )
              return (
                <div
                  key={staff.id}
                  onClick={() => handleSelect(staff)}
                  className="flex items-center justify-between px-2 py-1.5 rounded-md text-xs hover:bg-muted/70 cursor-pointer transition-colors min-h-[34px]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleSelect(staff)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs shrink-0">
                      {staff.avatar}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-foreground block truncate">{staff.name}</span>
                      <span className="text-xs text-muted-foreground block">{staff.role}</span>
                    </div>
                  </div>
                  {isChecked && <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-1" />}
                </div>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Dropdown chọn Nhóm sản phẩm có Checkbox
 */
export function ProductGroupSelect({
  selectedGroups,
  onToggleGroup,
  groups,
}: {
  selectedGroups: string[]
  onToggleGroup: (group: string) => void
  groups: string[]
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7.5 w-full justify-between text-xs px-2.5 bg-background font-normal border-input hover:bg-muted/30 cursor-pointer"
        >
          <span className="truncate text-xs text-foreground">
            {selectedGroups.length === 0 ? (
              <span className="text-muted-foreground/50 text-xs font-normal">Chọn nhóm sản phẩm...</span>
            ) : selectedGroups.length <= 2 ? (
              selectedGroups.join(', ')
            ) : (
              `${selectedGroups.length} nhóm sản phẩm`
            )}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50 shrink-0 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-2 space-y-1.5 max-h-64 overflow-y-auto z-50 shadow-md">
        <div className="text-[10.5px] font-semibold text-muted-foreground uppercase px-1 pb-1 border-b border-border/60">
          Danh sách nhóm sản phẩm
        </div>
        <div className="space-y-1 pt-1">
          {groups.map((group) => {
            const isChecked = selectedGroups.includes(group)
            return (
              <label
                key={group}
                className="flex items-center justify-between px-2.5 py-2 rounded-md text-xs hover:bg-muted/70 cursor-pointer transition-colors min-h-[32px]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => onToggleGroup(group)}
                  />
                  <span className="truncate text-xs text-foreground">{group}</span>
                </div>
                {isChecked && <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-1" />}
              </label>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function SmallLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <span className="text-xs font-normal text-muted-foreground block mb-0.5">
      {label} {required && <span className="text-rose-500 font-semibold">*</span>}
    </span>
  )
}
