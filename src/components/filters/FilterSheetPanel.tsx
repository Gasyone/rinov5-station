'use client'

import { useState, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { FilterClearAllButton } from './FilterClearAllButton'
import { cn } from '@/lib/utils'

export interface FilterOption {
  value: string
  label: string
  count?: number
  checked?: boolean
}

export interface FilterSection {
  id: string
  title: string
  options: FilterOption[]
  emptyMessage?: string
  defaultOpen?: boolean
  searchable?: boolean
  scrollable?: boolean
}

interface FilterSheetPanelProps {
  open: boolean
  title?: string
  description?: string
  sections: FilterSection[]
  clearAllLabel?: string
  applyLabel?: string
  onOpenChange: (open: boolean) => void
  onToggle: (sectionId: string, value: string) => void
  onClearAll: () => void
  onClearSection?: (sectionId: string) => void
  onApply?: () => void
  children?: React.ReactNode
}

export function FilterSheetPanel({
  open,
  title = 'Bộ lọc nâng cao',
  description = 'Kết hợp các bộ lọc để thu hẹp danh sách hiện tại.',
  sections,
  clearAllLabel = 'Xóa tất cả',
  applyLabel = 'Áp dụng',
  onOpenChange,
  onToggle,
  onClearAll,
  onClearSection,
  onApply,
  children,
}: FilterSheetPanelProps) {
  const selectedCount = sections.reduce(
    (total, section) => total + section.options.filter((option) => option.checked).length,
    0
  )

  const handleApply = () => {
    onApply?.()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          {children}
          {sections.map((section) => (
            <FilterSectionBlock
              key={section.id}
              section={section}
              onToggle={(value) => onToggle(section.id, value)}
              onClearSection={onClearSection ? () => onClearSection(section.id) : undefined}
            />
          ))}
        </div>

        <SheetFooter className="border-t border-border">
          <div className="flex gap-2">
            <FilterClearAllButton
              disabled={selectedCount === 0}
              label={clearAllLabel}
              onClick={onClearAll}
            />
            <Button className="flex-1" onClick={handleApply}>
              {applyLabel}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function FilterSectionBlock({
  section,
  onToggle,
  onClearSection,
}: {
  section: FilterSection
  onToggle: (value: string) => void
  onClearSection?: () => void
}) {
  const [open, setOpen] = useState(section.defaultOpen !== false)
  const [searchQuery, setSearchQuery] = useState('')
  const selectedOptions = section.options.filter((option) => option.checked)

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      setSearchQuery('')
    }
  }

  const isSearchable = section.searchable === true
  const isScrollable = section.scrollable === true

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return section.options
    const q = searchQuery.toLowerCase()
    return section.options.filter((opt) =>
      opt.label.toLowerCase().includes(q)
    )
  }, [section.options, searchQuery])

  return (
    <Collapsible open={open} onOpenChange={handleOpenChange} className="border-b border-border py-4 last:border-b-0">
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="flex h-auto w-full items-center justify-between gap-3 whitespace-normal rounded-md px-2 py-1.5 text-left hover:bg-accent"
        >
          <span className="flex min-w-0 items-center gap-2">
            <span className="truncate text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {section.title}
            </span>
            {selectedOptions.length > 0 ? (
              <Badge variant="secondary" className="h-5 rounded-full px-1.5 text-[10px]">
                {selectedOptions.length}
              </Badge>
            ) : null}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {selectedOptions.length > 0 && onClearSection && (
              <span
                role="button"
                tabIndex={0}
                className="text-[10px] font-semibold text-muted-foreground hover:text-foreground px-1"
                onClick={(e) => {
                  e.stopPropagation()
                  onClearSection()
                }}
              >
                Tắt lọc
              </span>
            )}
            <ChevronDown
              className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open ? '' : '-rotate-90')}
            />
          </div>
        </Button>
      </CollapsibleTrigger>

      {selectedOptions.length > 0 ? (
        <span className="sr-only">{selectedOptions.length} selected</span>
      ) : null}

      <CollapsibleContent>
        <div className="mt-3 px-2">
          {isSearchable && (
            <div className="mb-2">
              <input
                type="text"
                placeholder={`Tìm ${section.title.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 px-2.5 rounded-md border border-input bg-transparent text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          )}

          <div className={cn("space-y-1.5", isScrollable && "max-h-48 overflow-y-auto pr-1 select-none scrollbar-thin")}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-accent"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Checkbox checked={option.checked} onCheckedChange={() => onToggle(option.value)} />
                    <span className="truncate text-sm font-medium">{option.label}</span>
                  </span>
                  {typeof option.count === 'number' ? (
                    <span className="font-mono text-xs text-muted-foreground">{option.count}</span>
                  ) : null}
                </label>
              ))
            ) : (
              <p className="text-xs text-muted-foreground py-2 text-center">Không tìm thấy tùy chọn.</p>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
