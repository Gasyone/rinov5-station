'use client'

import { useState, useMemo } from 'react'
import { UserPlus, Search, Check } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { AppAvatar } from './AppAvatar'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export interface CSStaffItem {
  id: string
  name: string
  code: string
  avatar: string
}

export const DEFAULT_CS_STAFF_LIST: CSStaffItem[] = [
  { id: 'cs-1', name: 'Lê Thị Lan', code: 'EMP-CS-001', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Lan' },
  { id: 'cs-2', name: 'Minh Phương', code: 'EMP-CS-002', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Phuong' },
  { id: 'cs-3', name: 'Nguyễn Văn Hùng', code: 'EMP-CS-003', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Hung' },
  { id: 'cs-4', name: 'Phạm Thị Hà', code: 'EMP-CS-004', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ha' },
  { id: 'cs-5', name: 'Hoàng Anh Tuấn', code: 'EMP-CS-005', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tuan' },
  { id: 'cs-6', name: 'Đỗ Mai Hương', code: 'EMP-CS-006', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Huong' },
]

export interface ChangeCSStaffPopoverProps {
  currentCSName?: string
  branchName?: string
  onCSChange: (newCSName: string, csObj: CSStaffItem) => void
  csStaffList?: CSStaffItem[]
  showLabel?: boolean
  label?: string
  iconOnly?: boolean
  className?: string
  align?: 'start' | 'center' | 'end'
}

export function ChangeCSStaffPopover({
  currentCSName = 'Lê Thị Lan',
  branchName = 'RinoEdu Nguyễn Tuân',
  onCSChange,
  csStaffList = DEFAULT_CS_STAFF_LIST,
  showLabel = true,
  label,
  iconOnly = false,
  className,
  align = 'end',
}: ChangeCSStaffPopoverProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const activeCSObj = useMemo(() => {
    return csStaffList.find((c) => c.name === currentCSName) || csStaffList[0]
  }, [currentCSName, csStaffList])

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return csStaffList
    const q = searchQuery.toLowerCase()
    return csStaffList.filter(
      (item) => item.name.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)
    )
  }, [searchQuery, csStaffList])

  const handleSelect = (csItem: CSStaffItem) => {
    onCSChange(csItem.name, csItem)
    setOpen(false)
    toast.success(`Đã đổi nhân viên phụ trách (${branchName}) thành: ${csItem.name}`)
  }

  const popoverContent = (
    <PopoverContent
      align={align}
      className="w-64 p-3 space-y-2.5 text-xs z-50 shadow-xl border border-border/80 bg-popover text-popover-foreground rounded-xl"
    >
      <div className="pb-1 border-b border-border/40 space-y-0.5">
        <p className="font-bold text-foreground text-xs leading-tight">Đổi nhân viên phụ trách</p>
        <p className="text-[10px] text-muted-foreground italic leading-tight">Danh sách thuộc {branchName}</p>
      </div>

      <div className="relative flex items-center">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm nhân viên phụ trách..."
          className="w-full pl-8 pr-2.5 py-1.5 bg-muted/40 border border-sky-400/50 rounded-full text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-sky-500 shadow-2xs"
        />
      </div>

      <div className="max-h-52 overflow-y-auto space-y-1 pt-0.5 pr-0.5">
        {filteredList.length === 0 ? (
          <p className="text-[11px] text-muted-foreground italic text-center py-3">
            Không tìm thấy nhân viên phụ trách thuộc cơ sở
          </p>
        ) : (
          filteredList.map((csItem) => {
            const isSelected = (activeCSObj?.name || currentCSName) === csItem.name
            return (
              <button
                key={csItem.id}
                type="button"
                onClick={() => handleSelect(csItem)}
                className={cn(
                  'w-full text-left p-1.5 rounded-lg text-xs font-semibold hover:bg-muted/80 transition-colors flex items-center justify-between gap-2 cursor-pointer',
                  isSelected ? 'bg-muted/90 text-foreground font-bold' : 'text-foreground'
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <AppAvatar
                    src={csItem.avatar}
                    name={csItem.name}
                    size="xs"
                    className="h-6 w-6 border border-primary/10 shrink-0"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-bold text-xs truncate leading-none">{csItem.name}</p>
                    <p className="font-mono text-[9.5px] text-muted-foreground font-normal leading-none">
                      {csItem.code}
                    </p>
                  </div>
                </div>
                {isSelected && <Check className="h-4 w-4 text-foreground shrink-0" />}
              </button>
            )
          })
        )}
      </div>
    </PopoverContent>
  )

  if (iconOnly) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1 rounded hover:bg-muted"
            title={`Đổi nhân viên phụ trách tại ${branchName}`}
          >
            <UserPlus className="h-3.5 w-3.5" />
          </button>
        </PopoverTrigger>
        {popoverContent}
      </Popover>
    )
  }

  if (label) {
    return (
      <div className={cn("text-xs select-none", className)}>
        <div className="text-[11px] text-muted-foreground font-medium mb-0.5 flex items-center justify-between">
          <span>{label}</span>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded transition-colors cursor-pointer"
                title={`Đổi nhân viên phụ trách tại ${branchName}`}
              >
                <UserPlus className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            </PopoverTrigger>
            {popoverContent}
          </Popover>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <AppAvatar
            src={activeCSObj?.avatar}
            name={activeCSObj?.name || currentCSName}
            size="xs"
            className="h-5 w-5 border border-primary/10 shrink-0"
          />
          <span className="font-bold text-foreground text-xs">{activeCSObj?.name || currentCSName}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("inline-flex items-center gap-1.5 text-xs font-semibold select-none", className)}>
      {showLabel && <span className="text-muted-foreground font-bold">CS:</span>}
      <AppAvatar
        src={activeCSObj?.avatar}
        name={activeCSObj?.name || currentCSName}
        size="xs"
        className="h-5 w-5 border border-primary/10 shrink-0"
      />
      <span className="font-extrabold text-foreground text-xs">{activeCSObj?.name || currentCSName}</span>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded transition-colors cursor-pointer ml-0.5"
            title={`Đổi nhân viên phụ trách tại ${branchName}`}
          >
            <UserPlus className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
          </button>
        </PopoverTrigger>
        {popoverContent}
      </Popover>
    </div>
  )
}
