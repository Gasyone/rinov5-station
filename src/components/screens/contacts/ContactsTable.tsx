'use client'

import { UsersRound, Cake, User, GraduationCap, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DataTableActions,
  EmptyState,
  AppAvatar,
  ContactCell,
} from '@/components/shared'
import type { Contact } from '@/mocks/contacts'
import { getBirthdayInfo } from './contactsHelpers'

interface ContactsTableProps {
  contacts: Contact[]
  selectedIds?: Set<string>
  onToggleAll?: (checked: boolean) => void
  onToggleOne?: (id: string, checked: boolean) => void
  onRowClick: (contact: Contact) => void
  onEdit: (contact: Contact) => void
  onDelete: (contact: Contact) => void
}

const COLUMNS: Array<{ label: string; className?: string }> = [
  { label: 'Người liên hệ', className: 'min-w-[220px]' },
  { label: 'Số điện thoại & Email', className: 'min-w-[190px]' },
  { label: 'Địa chỉ cư trú', className: 'min-w-[210px]' },
  { label: 'Ngày sinh & Sinh nhật', className: 'min-w-[190px]' },
  { label: 'Liên hệ liên kết', className: 'min-w-[200px]' },
  { label: 'Ghi chú liên lạc', className: 'min-w-[180px]' },
  { label: '', className: 'w-16 text-right' },
]

export function ContactsTable({
  contacts,
  selectedIds = new Set(),
  onToggleAll,
  onToggleOne,
  onRowClick,
  onEdit,
  onDelete,
}: ContactsTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <EmptyState
          icon={<UsersRound className="h-7 w-7 text-muted-foreground" />}
          title="Không tìm thấy liên hệ nào phù hợp"
          description="Vui lòng thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm."
        />
      </div>
    )
  }

  const isAllSelected = contacts.length > 0 && contacts.every((c) => selectedIds.has(c.phone))

  return (
    <Table containerClassName="min-w-full" className="min-w-[1100px] text-xs">
      <TableHeader>
        <TableRow className="bg-muted/60 hover:bg-muted/60 [&>th]:h-8 [&>th]:py-1 [&>th]:text-xs [&>th]:font-normal">
          {/* Checkbox chọn tất cả */}
          <TableHead className="w-9 min-w-9 max-w-9 text-center px-2">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={(checked) => onToggleAll?.(Boolean(checked))}
              className="h-3.5 w-3.5 translate-y-[1px]"
              aria-label="Chọn tất cả liên hệ"
            />
          </TableHead>
          {COLUMNS.map((col) => (
            <TableHead key={col.label} className={col.className}>
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => {
          const isParent = contact.role === 'parent'
          const bday = getBirthdayInfo(contact.dob)
          const isSelected = selectedIds.has(contact.phone)

          return (
            <TableRow
              key={contact.phone + '-' + contact.name}
              className={`cursor-pointer transition-colors ${
                isSelected ? 'bg-sky-50 dark:bg-sky-950/40' : 'hover:bg-muted/40'
              }`}
              onClick={() => onRowClick(contact)}
            >
              {/* Checkbox chọn từng dòng */}
              <TableCell
                className="w-9 min-w-9 max-w-9 text-center py-2.5 px-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => onToggleOne?.(contact.phone, Boolean(checked))}
                  className="h-3.5 w-3.5 translate-y-[1px]"
                  aria-label={`Chọn ${contact.name}`}
                />
              </TableCell>

              {/* 1. Người liên hệ: Tên + Dưới là Vai trò (BỎ MÃ) */}
              <TableCell className="py-2.5">
                <div className="flex items-center gap-2.5">
                  <AppAvatar
                    name={contact.name}
                    size="sm"
                    shape={isParent ? 'circle' : 'square'}
                    userId={contact.phone}
                    userType={isParent ? 'parent' : 'student'}
                    className="shrink-0"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-semibold text-xs text-foreground truncate leading-tight">
                      {contact.englishName ? `${contact.name} (${contact.englishName})` : contact.name}
                    </p>
                    <div>
                      {isParent ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-700 dark:text-sky-300">
                          <User className="h-3 w-3 shrink-0" />
                          <span>Phụ huynh</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                          <GraduationCap className="h-3 w-3 shrink-0" />
                          <span>Học viên</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* 2. Số điện thoại & Email */}
              <TableCell className="py-2.5" onClick={(e) => e.stopPropagation()}>
                <ContactCell
                  phone={contact.phone}
                  email={contact.email}
                  studentName={contact.name}
                  masked={true}
                  nameClassName="text-xs"
                  phoneClassName="text-xs font-mono font-medium text-foreground"
                />
              </TableCell>

              {/* 3. Địa chỉ cư trú */}
              <TableCell className="py-2.5">
                <div className="flex items-center gap-1.5 text-muted-foreground max-w-[210px]">
                  <MapPin className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                  <span className="truncate text-xs" title={contact.address}>
                    {contact.address || 'Chưa cập nhật'}
                  </span>
                </div>
              </TableCell>

              {/* 4. Ngày sinh & Nhãn sinh nhật */}
              <TableCell className="py-2.5">
                {bday ? (
                  <div className="space-y-1">
                    <div className="text-xs text-foreground font-normal">
                      <span>{bday.fullDob}</span>
                      {bday.age !== null && (
                        <span className="text-muted-foreground ml-1.5">
                          ({bday.age} tuổi)
                        </span>
                      )}
                    </div>
                    {bday.isToday ? (
                      <Badge
                        variant="secondary"
                        className="gap-1 text-[11px] font-medium px-2 py-0.5 bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 border border-pink-300 dark:border-pink-800 animate-pulse"
                      >
                        <Cake className="h-3 w-3 text-pink-500 fill-pink-500/20" />
                        <span>Hôm nay sinh nhật!</span>
                      </Badge>
                    ) : bday.isThisMonth ? (
                      <Badge
                        variant="secondary"
                        className="gap-1 text-[11px] font-normal px-2 py-0.5 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                      >
                        <Cake className="h-3 w-3 text-amber-500 fill-amber-500/20" />
                        <span>Sinh nhật tháng này</span>
                      </Badge>
                    ) : null}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-xs italic">Chưa cập nhật</span>
                )}
              </TableCell>

              {/* 4. Liên hệ liên kết (chỉ có Tên + SĐT) */}
              <TableCell className="py-2.5" onClick={(e) => e.stopPropagation()}>
                {contact.relatedContact ? (
                  <div className="space-y-0.5 max-w-[210px]">
                    <p className="text-xs font-medium text-foreground truncate">
                      {contact.relatedContact.name}{' '}
                      <span className="text-muted-foreground font-normal">
                        ({contact.relatedContact.relationship})
                      </span>
                    </p>
                    <ContactCell
                      phone={contact.relatedContact.phone}
                      masked={true}
                      showCallButton={true}
                      phoneClassName="text-xs font-mono text-muted-foreground"
                    />
                  </div>
                ) : (
                  <span className="text-muted-foreground text-xs italic">Chưa liên kết</span>
                )}
              </TableCell>

              {/* 5. Ghi chú liên lạc */}
              <TableCell className="py-2.5">
                <p className="text-xs text-muted-foreground truncate max-w-[200px]" title={contact.notes}>
                  {contact.notes || '—'}
                </p>
              </TableCell>

              {/* 6. Thao tác */}
              <TableCell className="py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                <DataTableActions
                  onEdit={() => onEdit(contact)}
                  onDelete={() => onDelete(contact)}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
