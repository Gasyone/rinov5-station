'use client'

import { useState, useMemo, useRef } from 'react'
import { Check, ChevronDown, Search, UserPlus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface ContactPerson {
  id: string
  name: string
  phone: string
  children: Array<{ id: string; name: string; dob?: string }>
}

interface ContactSearchableSelectProps {
  value: string
  onValueChange: (id: string) => void
  contacts: ContactPerson[]
  onAddNewContact?: () => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ContactSearchableSelect({
  value,
  onValueChange,
  contacts,
  onAddNewContact,
  placeholder = 'Tìm kiếm tên hoặc SĐT phụ huynh...',
  disabled = false,
  className,
}: ContactSearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedContact = useMemo(() => {
    return contacts.find((c) => c.id === value) || null
  }, [value, contacts])

  const displayLabel = useMemo(() => {
    if (selectedContact) {
      return `${selectedContact.name} - ${selectedContact.phone}`
    }
    return ''
  }, [selectedContact])

  // Sync input text when selected contact changes and user is not actively typing
  const [prevDisplay, setPrevDisplay] = useState(displayLabel)
  if (!isTyping && prevDisplay !== displayLabel) {
    setPrevDisplay(displayLabel)
    setSearchTerm(displayLabel)
  }

  // Filter contacts by search term (case-insensitive & accent-friendly)
  const filteredContacts = useMemo(() => {
    if (!open || !isTyping || !searchTerm.trim()) {
      return contacts
    }
    const q = searchTerm.toLowerCase().trim()
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.children.some((child) => child.name.toLowerCase().includes(q))
    )
  }, [contacts, searchTerm, open, isTyping])

  const handleSelect = (id: string) => {
    onValueChange(id)
    setIsTyping(false)
    const found = contacts.find((c) => c.id === id)
    setSearchTerm(found ? `${found.name} - ${found.phone}` : '')
    setOpen(false)
  }

  const handleInputFocus = () => {
    if (disabled) return
    setIsTyping(true)
    setSearchTerm('')
    setOpen(true)
  }

  const handleInputBlur = () => {
    // Timeout to allow click events on popover items to fire before blur reset
    setTimeout(() => {
      setIsTyping(false)
      setSearchTerm(displayLabel)
    }, 200)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSearchTerm('')
    setIsTyping(true)
    inputRef.current?.focus()
    setOpen(true)
  }

  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn('relative w-full', className)}>
          <div className="relative flex items-center">
            <Input
              ref={inputRef}
              disabled={disabled}
              value={isTyping ? searchTerm : displayLabel}
              placeholder={placeholder}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChange={(e) => {
                setIsTyping(true)
                setSearchTerm(e.target.value)
                if (!open) setOpen(true)
              }}
              className="h-9 bg-background pr-14 text-sm font-medium transition-colors cursor-pointer"
            />

            <div className="absolute right-2 flex items-center gap-1 text-muted-foreground">
              {isTyping && searchTerm ? (
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
        className="w-[380px] sm:w-[420px] max-w-[95vw] p-2 z-50 bg-background border rounded-xl shadow-xl space-y-1.5"
        align="start"
        sideOffset={6}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* OPTION 1 (LUÔN Ở ĐẦU TIÊN): MỞ MODAL TẠO MỚI CONTACT / PHỤ HUYNH */}
        <div
          onMouseDown={(e) => {
            e.preventDefault()
            setOpen(false)
            if (onAddNewContact) {
              onAddNewContact()
            }
          }}
          className="flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors text-xs font-semibold border border-dashed bg-primary/5 text-primary border-primary/40 hover:bg-primary/10"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0 shadow-2xs">
              <UserPlus className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold text-xs">+ Thêm Contact / Phụ huynh mới</p>
              <p className="truncate text-[10.5px] text-muted-foreground font-normal">
                Mở hộp thoại tạo mới khách hàng & học viên
              </p>
            </div>
          </div>
        </div>

        <div className="px-2 py-1 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 flex items-center justify-between">
          <span>Danh sách phụ huynh & học viên</span>
          <span className="text-[10.5px] font-normal text-muted-foreground">
            {filteredContacts.length} kết quả
          </span>
        </div>

        {/* DANH SÁCH CONTACT SEARCHABLE */}
        <div className="max-h-[300px] overflow-y-auto space-y-1 custom-scrollbar pr-0.5">
          {filteredContacts.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              Không tìm thấy phụ huynh hoặc học viên nào khớp với &quot;{searchTerm}&quot;
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
                    'flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors text-xs',
                    isSelected
                      ? 'bg-primary/10 text-primary font-medium ring-1 ring-primary/20'
                      : 'hover:bg-muted/70 text-foreground'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0',
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-semibold text-xs text-foreground truncate">
                          {contact.name}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          ({contact.phone})
                        </span>
                      </div>
                      {childrenNames && (
                        <div className="text-[10.5px] text-muted-foreground truncate mt-0.5 flex items-center gap-1">
                          <span>Con:</span>
                          <span className="font-medium text-foreground/90 bg-muted px-1.5 py-0.2 rounded text-xs">
                            {childrenNames}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="h-4 w-4 text-primary shrink-0 ml-1.5" />
                  )}
                </div>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
