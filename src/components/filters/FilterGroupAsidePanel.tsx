'use client'

import React, { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  FilterAsidePanel,
  FilterCollapsibleSection,
  FilterCheckboxOption,
} from './FilterAsidePanel'
import {
  type FilterGroupConfig,
  buildFilterSections,
} from './FilterGroupSheetPanel'
import { cn } from '@/lib/utils'

export interface FilterGroupAsidePanelProps {
  title?: string
  description?: string
  width?: string
  className?: string
  bodyClassName?: string
  groups: readonly FilterGroupConfig[]
  onClose: () => void
  onToggle: (sectionId: string, value: string) => void
  onClearAll: () => void
  onClearSection?: (sectionId: string) => void
  activeCount?: number
  resetLabel?: string
  children?: React.ReactNode
  footer?: React.ReactNode
}

/**
 * FilterGroupAsidePanel:
 * Chuẩn hóa bộ lọc nâng cao dạng ghim cạnh phải (khớp 100% màn Quản lý đơn hàng).
 * Tự động ánh xạ từ `FilterGroupConfig[]` sẵn có thành các nhóm Accordion, Checkbox, Search, Badge đếm và nút Xóa.
 */
export function FilterGroupAsidePanel({
  title = 'Bộ lọc nâng cao',
  description,
  width = 'w-[310px]',
  className,
  bodyClassName,
  groups,
  onClose,
  onToggle,
  onClearAll,
  onClearSection,
  activeCount: propActiveCount,
  resetLabel = 'Đặt lại',
  children,
  footer,
}: FilterGroupAsidePanelProps) {
  const sections = useMemo(() => buildFilterSections(groups), [groups])
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({})

  // Tự động tính số lượng lọc đang active nếu không truyền vào
  const calculatedActiveCount = useMemo(() => {
    return sections.reduce(
      (total, section) => total + section.options.filter((opt) => opt.checked).length,
      0
    )
  }, [sections])

  const totalActiveCount = propActiveCount ?? calculatedActiveCount

  const handleSearchChange = (sectionId: string, query: string) => {
    setSearchTerms((prev) => ({
      ...prev,
      [sectionId]: query,
    }))
  }

  return (
    <FilterAsidePanel
      title={title}
      description={description}
      activeCount={totalActiveCount}
      onReset={onClearAll}
      resetLabel={resetLabel}
      onClose={onClose}
      width={width}
      className={className}
      bodyClassName={bodyClassName}
      footer={footer}
    >
      {/* 1. Phần mở rộng nếu có (ví dụ: bộ chọn ngày độc quyền) */}
      {children}

      {/* 2. Các nhóm lọc động tự động render theo chuẩn Accordion + Checkbox */}
      {sections.map((section) => {
        const query = (searchTerms[section.id] || '').toLowerCase().trim()
        const visibleOptions = query
          ? section.options.filter((opt) => opt.label.toLowerCase().includes(query))
          : section.options

        const checkedInThisSection = section.options.filter((opt) => opt.checked).length
        const isDefaultOpen = section.defaultOpen ?? checkedInThisSection > 0

        return (
          <FilterCollapsibleSection
            key={section.id}
            title={section.title}
            defaultOpen={isDefaultOpen}
            badgeCount={checkedInThisSection}
            onClear={
              onClearSection && checkedInThisSection > 0
                ? () => onClearSection(section.id)
                : undefined
            }
          >
            <div className="space-y-1 pt-1">
              {/* Ô tìm kiếm nhanh cho nhóm có cờ searchable hoặc nhiều hơn 7 lựa chọn */}
              {(section.searchable || section.options.length > 7) && (
                <div className="relative mb-1.5 px-0.5">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    type="text"
                    value={searchTerms[section.id] || ''}
                    onChange={(e) => handleSearchChange(section.id, e.target.value)}
                    placeholder={`Tìm trong ${section.title.toLowerCase()}...`}
                    className="h-7 pl-7 pr-2 text-xs bg-muted/30"
                  />
                </div>
              )}

              {/* Danh sách các lựa chọn dạng checkbox */}
              {visibleOptions.length === 0 ? (
                <div className="py-2 px-2 text-center text-xs italic text-muted-foreground">
                  {section.emptyMessage || 'Không tìm thấy lựa chọn phù hợp'}
                </div>
              ) : (
                <div
                  className={cn(
                    'space-y-0.5',
                    section.scrollable && 'max-h-48 overflow-y-auto pr-1'
                  )}
                >
                  {visibleOptions.map((opt) => (
                    <FilterCheckboxOption
                      key={opt.value}
                      value={opt.value}
                      label={opt.label}
                      checked={Boolean(opt.checked)}
                      count={opt.count}
                      onToggle={(val) => onToggle(section.id, val)}
                    />
                  ))}
                </div>
              )}

              {/* Nội dung tùy biến bổ sung nếu có */}
              {section.customContent}
            </div>
          </FilterCollapsibleSection>
        )
      })}
    </FilterAsidePanel>
  )
}
