'use client'

import React from 'react'
import { ChevronDown, Plus, Trash2, User, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { AppAvatar } from '@/components/shared'
import type { ChildGroup, DraftOrderItem } from './draftOrderTypes'
import { DraftOrderCardItem } from './DraftOrderCardItem'

export interface ChildDataOption {
  value: string
  name: string
  account: string
  lastOrderDate: string
  studentId: string
  branch?: string
  status?: string
}

export const RICH_CHILD_OPTIONS: ChildDataOption[] = [
  {
    value: 'con-1',
    name: 'Đặng Thiên An',
    account: '0903279888',
    lastOrderDate: '25/07/2026',
    studentId: 'HV-8849',
    branch: 'RinoEdu Nguyễn Tuân',
    status: 'Đang học',
  },
  {
    value: 'con-2',
    name: 'Đặng Quốc Bảo (Con thứ 2)',
    account: '0982345678',
    lastOrderDate: '15/07/2026',
    studentId: 'HV-8850',
    branch: 'Rino An Khánh',
    status: 'Đang học',
  },
  {
    value: 'con-3',
    name: 'Đặng Minh Châu (Con thứ 3)',
    account: '0903279888',
    lastOrderDate: '02/08/2026',
    studentId: 'HV-8851',
    branch: 'Rino Linh Đàm',
    status: 'Đang học',
  },
  {
    value: 'con-4',
    name: 'Đặng Bảo An (Con thứ 4)',
    account: '0912345678',
    lastOrderDate: '20/05/2026',
    studentId: 'HV-8852',
    branch: 'Rino Linh Đàm',
    status: 'Đang học',
  },
]

export function ChildProfileHoverCard({
  child,
  onOpenProfile,
  children,
}: {
  child: ChildDataOption
  onOpenProfile?: (studentId: string) => void
  children: React.ReactNode
}) {
  return (
    <HoverCard openDelay={150} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent align="start" className="w-72 p-3.5 bg-white dark:bg-zinc-900 border border-border shadow-xl z-[200] rounded-xl">
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <AppAvatar name={child.name} className="h-10 w-10 text-xs shrink-0 border border-indigo-100" />
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h4 className="font-bold text-xs text-foreground truncate">{child.name}</h4>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {child.status || 'Đang học'}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Mã HV: <strong className="font-semibold text-foreground">{child.studentId}</strong> • SĐT: {child.account}
              </p>
            </div>
          </div>

          <div className="text-[11px] space-y-1 pt-2 border-t border-border/50 text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Cơ sở học:</span>
              <span className="font-medium text-foreground">{child.branch || 'Rino Linh Đàm'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Đơn tạo gần nhất:</span>
              <span className="font-medium text-foreground">{child.lastOrderDate}</span>
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onOpenProfile?.(child.studentId)
            }}
            className="w-full h-7 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded cursor-pointer transition-colors shadow-2xs mt-1"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Xem Profile Chi Tiết
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

function CleanChildSelect({
  value,
  assignedChildAccounts = [],
  onChange,
}: {
  value: string
  assignedChildAccounts?: string[]
  onChange: (val: string, name: string) => void
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedChild = RICH_CHILD_OPTIONS.find((c) => c.value === value)

  return (
    <div ref={containerRef} className={`relative min-w-[200px] ${isOpen ? 'z-50' : 'z-10'}`}>
      {/* Trigger Button: Displays ONLY Child Name */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-8 px-2.5 py-0 flex items-center justify-between text-xs transition-all border border-input rounded-md bg-white dark:bg-zinc-900 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
      >
        <span className="font-semibold text-xs text-foreground truncate pr-2">
          {selectedChild ? selectedChild.name : '-- Chọn tài khoản con --'}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      </button>

      {/* Dropdown Options Panel: CLEAN 1-LINE LIST OF NAMES ONLY */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-full min-w-[220px] bg-white dark:bg-zinc-900 border border-border rounded-lg shadow-xl z-[120] p-1 space-y-0.5 overflow-hidden">
          {RICH_CHILD_OPTIONS.map((opt) => {
            const isSelected = opt.value === value
            const isDisabled = assignedChildAccounts.includes(opt.value) && opt.value !== value

            return (
              <div
                key={opt.value}
                onClick={() => {
                  if (!isDisabled) {
                    onChange(opt.value, opt.name)
                    setIsOpen(false)
                  }
                }}
                className={`p-2 px-2.5 rounded-md cursor-pointer transition-colors text-xs ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed bg-zinc-50 dark:bg-zinc-950/40 text-muted-foreground'
                    : isSelected
                    ? 'bg-indigo-50/80 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                    : 'text-foreground hover:bg-muted/60'
                }`}
              >
                <span>{opt.name}</span>
                {isDisabled && <span className="text-[10px] font-normal text-muted-foreground ml-1.5">(Đã chọn ở nhóm khác)</span>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface ChildGroupCardProps {
  group: ChildGroup
  assignedChildAccounts?: string[]
  canRemoveGroup?: boolean
  onUpdateGroupChild: (groupId: string, childAccount: string, childName: string) => void
  onRemoveGroup: (groupId: string) => void
  onAddItemToGroup: (groupId: string, category: 'gia_su' | 'khoa_hoc' | 'combo') => void
  onUpdateItem: (groupId: string, itemId: string, updates: Partial<DraftOrderItem>) => void
  onRemoveItem: (groupId: string, itemId: string) => void
  onResetItem: (groupId: string, itemId: string) => void
  onOpenChildProfile?: (studentId: string) => void
}

export function ChildGroupCard({
  group,
  assignedChildAccounts = [],
  canRemoveGroup = true,
  onUpdateGroupChild,
  onRemoveGroup,
  onAddItemToGroup,
  onUpdateItem,
  onRemoveItem,
  onResetItem,
  onOpenChildProfile,
}: ChildGroupCardProps) {
  const selectedChild = RICH_CHILD_OPTIONS.find((c) => c.value === group.childAccount)

  return (
    <div className="bg-white dark:bg-zinc-900 border border-border/80 rounded-xl shadow-2xs overflow-visible">
      {/* ── CHILD GROUP HEADER BANNER (Highlighted background fill with bottom line) ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-indigo-100/80 dark:bg-indigo-950/80 p-3 px-3.5 border-b border-indigo-200/60 dark:border-indigo-900/60 rounded-t-xl">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="h-6.5 w-6.5 rounded-full bg-white dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-medium text-xs shrink-0 border border-indigo-200/80 dark:border-indigo-800 shadow-2xs">
            <User className="h-3.5 w-3.5" />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-indigo-950 dark:text-indigo-200">
              Sản phẩm dành cho con:
            </span>

            {/* Clean Child Select Input (Name only in selection) */}
            <CleanChildSelect
              value={group.childAccount}
              assignedChildAccounts={assignedChildAccounts}
              onChange={(val, name) => onUpdateGroupChild(group.id, val, name)}
            />

            {/* Extra Child Metadata displayed OUTSIDE next to the selection with HoverCard profile trigger */}
            {selectedChild && (
              <ChildProfileHoverCard child={selectedChild} onOpenProfile={onOpenChildProfile}>
                <span
                  onClick={() => onOpenChildProfile?.(selectedChild.studentId)}
                  className="text-xs text-indigo-900/80 dark:text-indigo-200/80 font-normal ml-1 flex items-center gap-1.5 flex-wrap cursor-pointer hover:text-indigo-700 dark:hover:text-indigo-100 transition-colors"
                >
                  <span>( Tài khoản: <strong className="font-semibold text-indigo-950 dark:text-indigo-100">{selectedChild.account}</strong></span>
                  <span>•</span>
                  <span>Đơn tạo gần nhất: <strong className="font-semibold text-indigo-950 dark:text-indigo-100">{selectedChild.lastOrderDate}</strong> )</span>
                </span>
              </ChildProfileHoverCard>
            )}
          </div>
        </div>

        {/* Group Action Buttons */}
        <div className="flex items-center gap-2">
          {/* White background + soft subtle hover "+ Thêm sản phẩm" Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-100 hover:bg-white/90 font-medium text-xs px-3 h-8 rounded-md shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 mr-1 text-indigo-600 dark:text-indigo-400" />
                <span>Thêm sản phẩm</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 p-1 bg-white dark:bg-zinc-900 border border-border shadow-lg z-50">
              <DropdownMenuItem
                onClick={() => onAddItemToGroup(group.id, 'gia_su')}
                className="cursor-pointer py-2 px-3 font-medium text-xs text-foreground hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 rounded"
              >
                Sản phẩm gia sư
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAddItemToGroup(group.id, 'khoa_hoc')}
                className="cursor-pointer py-2 px-3 font-medium text-xs text-foreground hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 rounded"
              >
                Sản phẩm khóa học
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAddItemToGroup(group.id, 'combo')}
                className="cursor-pointer py-2 px-3 font-medium text-xs text-foreground hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 rounded"
              >
                Sản phẩm combo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Delete Child Group Button (Only for additional children, NOT primary child) */}
          {canRemoveGroup && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveGroup(group.id)}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 h-8 px-2 cursor-pointer"
              title="Xóa nhóm con này"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* ── GROUP PRODUCTS LIST (DIVIDER LINES BETWEEN PRODUCTS) ── */}
      <div className="divide-y divide-border/60">
        {group.items.length > 0 ? (
          group.items.map((item) => (
            <DraftOrderCardItem
              key={item.id}
              item={item}
              onUpdate={(id, updates) => onUpdateItem(group.id, id, updates)}
              onRemove={(id) => onRemoveItem(group.id, id)}
              onReset={(id) => onResetItem(group.id, id)}
            />
          ))
        ) : (
          <div className="p-6 text-center bg-zinc-50/40 dark:bg-zinc-950/20">
            <p className="text-xs text-muted-foreground italic">
              Chưa có sản phẩm nào cho {group.childName || 'con'}. Bấm nút <strong>+ THÊM SẢN PHẨM</strong> ở trên để thêm.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
