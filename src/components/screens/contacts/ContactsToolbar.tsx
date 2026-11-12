'use client'

import { Plus, Cake } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  BranchSelect,
  ExpandableSearch,
  SegmentedControl,
} from '@/components/controls'
import type { Contact } from '@/mocks/contacts'
import {
  CONTACT_ROLE_TABS,
  type ContactBirthdayFilter,
  type ContactRoleFilter,
} from './contactsTypes'
import { countBirthdayThisMonth, countContactsByRole } from './contactsHelpers'
import { cn } from '@/lib/utils'

interface ContactsToolbarProps {
  contacts: Contact[]
  branches: string[]
  activeBranch: string
  activeRole: ContactRoleFilter
  activeBirthday: ContactBirthdayFilter
  searchTerm: string
  onBranchChange: (branch: string) => void
  onRoleChange: (role: ContactRoleFilter) => void
  onBirthdayChange: (birthday: ContactBirthdayFilter) => void
  onSearchChange: (value: string) => void
  onCreate: () => void
}

export function ContactsToolbar({
  contacts,
  branches,
  activeBranch,
  activeRole,
  activeBirthday,
  searchTerm,
  onBranchChange,
  onRoleChange,
  onBirthdayChange,
  onSearchChange,
  onCreate,
}: ContactsToolbarProps) {
  const roleOptions = CONTACT_ROLE_TABS.map((tab) => ({
    value: tab.id,
    label: `${tab.label} (${countContactsByRole(contacts, tab.id)})`,
  }))

  const birthdayMonthCount = countBirthdayThisMonth(contacts)

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 bg-background px-3 py-2.5 border-b border-border/60">
      {/* Trái: Chọn vai trò + Lọc Cơ sở (BranchSelect) + Lọc sinh nhật trong tháng */}
      <div className="flex flex-wrap items-center gap-2">
        <SegmentedControl
          options={roleOptions}
          value={activeRole}
          onValueChange={(val) => onRoleChange(val as ContactRoleFilter)}
        />

        <BranchSelect
          value={activeBranch}
          branches={branches}
          allLabel="Tất cả cơ sở"
          placeholder="Chọn cơ sở"
          ariaLabel="Cơ sở"
          onValueChange={onBranchChange}
          className="h-8 min-w-36 text-xs"
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onBirthdayChange(activeBirthday === 'this_month' ? 'all' : 'this_month')
          }
          className={cn(
            'h-8 gap-1.5 px-2.5 text-xs font-normal border transition-colors cursor-pointer',
            activeBirthday === 'this_month'
              ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800'
              : 'border-border/70 hover:bg-muted/60 text-muted-foreground hover:text-foreground'
          )}
        >
          <Cake
            className={cn(
              'h-3.5 w-3.5',
              activeBirthday === 'this_month'
                ? 'text-pink-500 fill-pink-500/20'
                : 'text-muted-foreground'
            )}
          />
          <span>Sinh nhật tháng này ({birthdayMonthCount})</span>
        </Button>
      </div>

      {/* Phải: Tìm kiếm & Thêm mới */}
      <div className="flex items-center gap-2">
        <ExpandableSearch
          value={searchTerm}
          onValueChange={onSearchChange}
          label="Tìm kiếm danh bạ"
          placeholder="Tìm tên, SĐT, người liên kết..."
          inputClassName="sm:w-64 text-xs h-8"
        />
        <Button size="sm" onClick={onCreate} className="h-8 gap-1 px-2.5 text-xs font-medium cursor-pointer">
          <Plus className="h-3.5 w-3.5" />
          <span>Thêm liên hệ</span>
        </Button>
      </div>
    </div>
  )
}
