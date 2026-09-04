'use client'

import { useState, useMemo, useRef } from 'react'
import { Check, ChevronDown, Search, UserPlus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { maskPhone } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { TrialContactPerson } from './trialClassCreateTypes'

interface TrialClassParentSearchSelectProps {
  value: string
  onValueChange: (id: string) => void
  contacts: TrialContactPerson[]
  onAddNewContact?: () => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function TrialClassParentSearchSelect({
  value,
  onValueChange,
  contacts,
  onAddNewContact,
  placeholder = 'Tìm kiếm tên hoặc SĐT phụ huynh / Lead...',
  disabled = false,
  className,
}: TrialClassParentSearchSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedContact = useMemo(() => {
    return contacts.find((c) => c.id === value) || null
  }, [value, contacts])

  const displayLabel = useMemo(() => {
    if (selectedContact) {
      return `${selectedContact.name} — ${maskPhone(selectedContact.phone)}`
    }
    return ''
  }, [selectedContact])

  const inputValue = open ? searchQuery : displayLabel

  const filteredContacts = useMemo(() => {
    if (!open || !searchQuery.trim()) {
      return contacts
    }
    const q = searchQuery.toLowerCase().trim()
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.children.some((child) => child.name.toLowerCase().includes(q) || (child.targetSubject && child.targetSubject.toLowerCase().includes(q)))
    )
  }, [contacts, searchQuery, open])

  const handleSelect = (id: string) => {
    onValueChange(id)
    setSearchQuery('')
    setOpen(false)
  }

  const handleInputFocus = () => {
    if (disabled) return
    setSearchQuery('')
    setOpen(true)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSearchQuery('')
    inputRef.current?.focus()
    setOpen(true)
  }

  return (
    <Popover
      open={open && !disabled}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          setSearchQuery('')
        }
      }}
    >
      <PopoverTrigger asChild>
        <div className={cn('relative w-full', className)}>
          <div className="relative flex items-center">
            <Input
              ref={inputRef}
              disabled={disabled}
              value={inputValue}
              placeholder={placeholder}
              onFocus={handleInputFocus}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (!open) setOpen(true)
              }}
              className="h-9 bg-background pr-14 text-sm font-medium transition-colors cursor-pointer"
            />

            <div className="absolute right-2 flex items-center gap-1 text-muted-foreground">
              {open && searchQuery ? (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleClear}
                  className="rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Search className="h-3.5 w-3.5 opacity-50" />
              )}
              <ChevronDown className={cn('h-3.5 w-3.5 opacity-50 transition-transform', open && 'rotate-180')} />
            </div>
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] min-w-[340px] p-1.5 z-50 bg-background border rounded-xl shadow-xl space-y-1"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Lựa chọn Tạo mới Contact / Phụ huynh (Mở Modal chuẩn) */}
        <div
          onMouseDown={(e) => {
            e.preventDefault()
            setOpen(false)
            if (onAddNewContact) {
              onAddNewContact()
            }
          }}
          className="flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs font-semibold border border-dashed bg-primary/5 text-primary border-primary/40 hover:bg-primary/10"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
              <UserPlus className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold text-xs">+ Thêm Contact / Phụ huynh mới</p>
              <p className="truncate text-xs text-muted-foreground font-normal">
                Mở hộp thoại tạo mới khách hàng & học viên
              </p>
            </div>
          </div>
        </div>

        <div className="px-2 py-1 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 flex items-center justify-between">
          <span>Phụ huynh & Khách hàng từ CRM Leads</span>
          <span className="text-xs font-normal text-muted-foreground">
            {filteredContacts.length} kết quả
          </span>
        </div>

        {/* Danh sách Contacts */}
        <div className="max-h-[440px] overflow-y-auto space-y-0.5 pr-0.5">
          {filteredContacts.length === 0 ? (
            <div className="py-4 text-center text-xs text-muted-foreground">
              Không tìm thấy phụ huynh nào khớp với &quot;{searchQuery}&quot;
            </div>
          ) : (
            filteredContacts.map((contact) => {
              const isSelected = value === contact.id
              const childrenNames = contact.children.map((c) => c.name).join(', ')

              return (
                <div
                  key={contact.id}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleSelect(contact.id)
                  }}
                  className={cn(
                    'flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs',
                    isSelected
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-muted/60 text-foreground'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shrink-0',
                        contact.isFromLead
                          ? 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground truncate text-xs">
                          {contact.name}
                        </span>
                        {contact.isFromLead && (
                          <Badge variant="outline" className="text-xs h-4 px-1 border-violet-300 text-violet-700 dark:text-violet-300">
                            Lead
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono">{maskPhone(contact.phone)}</span>
                        {childrenNames && (
                          <>
                            <span>&middot;</span>
                            <span className="truncate text-muted-foreground">
                              Con: <strong className="text-foreground/80 font-normal">{childrenNames}</strong>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {isSelected && <Check className="h-4 w-4 text-primary shrink-0 ml-2" />}
                </div>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
