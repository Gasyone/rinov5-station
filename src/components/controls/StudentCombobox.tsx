'use client'

import * as React from 'react'
import { Check, User, Search, PlusCircle, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export interface StudentOption {
  id: string
  label: string // Student Name
  familyName?: string // Optional parent/family info
  phone?: string // Optional phone info
  avatar?: string // Optional avatar URL
}

interface StudentComboboxProps {
  options: StudentOption[]
  value: string
  onChange: (value: string, selectedStudent: StudentOption | null) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
  onCreateNew?: (searchValue: string) => void
}

export function StudentCombobox({
  options,
  value,
  onChange,
  placeholder = 'Tìm kiếm tên hoặc SĐT...',
  searchPlaceholder = 'Tìm kiếm tên hoặc SĐT...',
  emptyText = 'Không tìm thấy học viên.',
  disabled = false,
  className,
  onCreateNew,
}: StudentComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const selectedOption = React.useMemo(
    () => options.find((opt) => opt.id === value),
    [options, value]
  )

  // Sync search value when external value changes
  React.useEffect(() => {
    if (selectedOption) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchValue(selectedOption.label)
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchValue('')
    }
  }, [selectedOption])

  const getInitials = (name: string) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  const handleSelect = (currentValue: string) => {
    const selected = currentValue === value ? null : options.find(o => o.id === currentValue) || null
    onChange(currentValue === value ? '' : currentValue, selected)
    setSearchValue(selected ? selected.label : '')
    setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('', null)
    setSearchValue('')
    inputRef.current?.focus()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative w-full", className)}>
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            disabled={disabled}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
              if (!open) setOpen(true)
              if (value) {
                // If user types while something is selected, clear the selection
                onChange('', null)
              }
            }}
            onFocus={() => setOpen(true)}
            className={cn(
              "pl-9 pr-8",
              open && "ring-2 ring-ring ring-offset-2"
            )}
          />
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0" 
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()} // Prevent stealing focus from input
      >
        <Command
          shouldFilter={false} // We handle filtering manually based on searchValue
        >
          <CommandList className="max-h-[300px]">
            {options.filter((opt) => {
              const search = searchValue.toLowerCase()
              if (!search) return true
              return opt.label.toLowerCase().includes(search) || opt.phone?.includes(search)
            }).length === 0 && (
              <CommandEmpty className="py-6 text-center text-sm">
                <p className="text-muted-foreground">{emptyText}</p>
                {onCreateNew && searchValue && (
                  <Button
                    variant="link"
                    className="mt-2 h-auto p-0 text-primary"
                    onClick={() => {
                      onCreateNew(searchValue)
                      setOpen(false)
                    }}
                  >
                    <PlusCircle className="mr-1 h-3 w-3" />
                    Tạo mới &quot;{searchValue}&quot;
                  </Button>
                )}
              </CommandEmpty>
            )}
            
            <CommandGroup>
              {options.filter((opt) => {
                 const search = searchValue.toLowerCase()
                 if (!search) return true
                 return opt.label.toLowerCase().includes(search) || opt.phone?.includes(search)
              }).map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.id}
                  onSelect={handleSelect}
                  className="flex items-center justify-between gap-2 py-2"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={option.avatar} alt={option.label} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {getInitials(option.label)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col truncate">
                      <span className="truncate font-medium leading-none">{option.label}</span>
                      {option.phone ? (
                        <span className="mt-1 truncate text-xs text-muted-foreground">
                          {option.phone} {option.familyName ? `• ${option.familyName}` : ''}
                        </span>
                      ) : (
                        <span className="mt-1 truncate text-xs text-muted-foreground">
                          {option.familyName || 'Không có sđt'}
                        </span>
                      )}
                    </div>
                  </div>
                  <Check
                    className={cn(
                      'h-4 w-4 shrink-0',
                      value === option.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            {onCreateNew && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      onCreateNew(searchValue)
                      setOpen(false)
                    }}
                    className="flex cursor-pointer items-center gap-2 text-primary data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Thêm học viên mới
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
