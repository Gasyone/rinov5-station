'use client'

import { useMemo } from 'react'
import { FilterSheetPanel, type FilterSection } from './FilterSheetPanel'

export type FilterSelectedValues = readonly string[] | ReadonlySet<string>

export interface FilterGroupOptionInput {
  value: string
  label?: string
  count?: number
  checked?: boolean
}

export type FilterGroupOptionSource = string | FilterGroupOptionInput

export interface FilterGroupConfig {
  id: string
  title?: string
  options: readonly FilterGroupOptionSource[]
  selectedValues?: FilterSelectedValues
  emptyMessage?: string
  defaultOpen?: boolean
  searchable?: boolean
  scrollable?: boolean
  customContent?: React.ReactNode
}

interface CreateFilterGroupConfig {
  id: string
  title?: string
  options: readonly FilterGroupOptionSource[]
  selectedValues?: FilterSelectedValues
  emptyMessage?: string
  defaultOpen?: boolean
  searchable?: boolean
  scrollable?: boolean
  customContent?: React.ReactNode
  getOptionLabel?: (value: string) => string
  getOptionCount?: (value: string) => number
}

interface FilterGroupSheetPanelProps {
  open: boolean
  title?: string
  description?: string
  groups: readonly FilterGroupConfig[]
  clearAllLabel?: string
  applyLabel?: string
  onOpenChange: (open: boolean) => void
  onToggle: (sectionId: string, value: string) => void
  onClearAll: () => void
  onClearSection?: (sectionId: string) => void
  onApply?: () => void
  children?: React.ReactNode
}

const FILTER_GROUP_TITLES: Record<string, string> = {
  assignees: 'Người phụ trách',
  attendance: 'Điểm danh',
  availabilities: 'Tình trạng chỗ',
  bookingStatuses: 'Trạng thái lịch test',
  branches: 'Cơ sở',
  buckets: 'Khoảng thời gian',
  capacity: 'Sĩ số & Độ lấp đầy',
  capacities: 'Sức chứa',
  categories: 'Danh mục',
  class: 'Lớp học',
  classes: 'Lớp học',
  classTypes: 'Hình thức lớp học',
  genders: 'Giới tính học viên',
  remainingSessionsRange: 'Số buổi học còn lại',
  conditions: 'Điều kiện khác',
  conditionFilters: 'Điều kiện khác',
  conflict: 'Xung đột',
  contractTypes: 'Loại hợp đồng',
  creators: 'Người tạo',
  dateRange: 'Khoảng thời gian',
  dateRanges: 'Thời gian',
  departments: 'Phòng ban',
  homework: 'Bài tập về nhà',
  jobTitles: 'Chức danh',
  levels: 'Trình độ',
  locations: 'Khu vực tổ chức',
  owners: 'Người phụ trách',
  organizers: 'Ban tổ chức',
  paymentMethods: 'Phương thức thanh toán',
  paymentStatuses: 'Trạng thái thanh toán',
  periods: 'Khoảng thời gian',
  programs: 'Chương trình',
  roles: 'Vai trò',
  rooms: 'Phòng học',
  roomFilters: 'Phòng học',
  sales: 'Sale',
  schools: 'Cơ sở',
  sources: 'Nguồn',
  statuses: 'Trạng thái',
  subjectFilters: 'Môn học',
  subjects: 'Môn học',
  teacher: 'Giáo viên',
  teachers: 'Giáo viên',
  times: 'Thời gian',
  trial_students: 'Học viên học thử',
  types: 'Loại',
  severities: 'Mức độ',
  weekdays: 'Ngày trong tuần',
}

export function createFilterGroup({
  id,
  title,
  options,
  selectedValues,
  emptyMessage,
  defaultOpen,
  searchable,
  scrollable,
  customContent,
  getOptionLabel,
  getOptionCount,
}: CreateFilterGroupConfig): FilterGroupConfig {
  return {
    id,
    title,
    selectedValues,
    emptyMessage,
    defaultOpen,
    searchable,
    scrollable,
    customContent,
    options: options.map((option) => {
      const value = typeof option === 'string' ? option : option.value
      const base = typeof option === 'string' ? { value } : option

      return {
        ...base,
        value,
        label: base.label ?? getOptionLabel?.(value) ?? value,
        count: base.count ?? getOptionCount?.(value),
      }
    }),
  }
}

export function buildFilterSections(groups: readonly FilterGroupConfig[]): FilterSection[] {
  return groups.map((group) => {
    const selectedValues = toSelectedSet(group.selectedValues)

    return {
      id: group.id,
      title: group.title ?? FILTER_GROUP_TITLES[group.id] ?? group.id,
      emptyMessage: group.emptyMessage,
      defaultOpen: group.defaultOpen,
      searchable: group.searchable,
      scrollable: group.scrollable,
      customContent: group.customContent,
      options: group.options.map((option) => {
        const value = typeof option === 'string' ? option : option.value
        const label = typeof option === 'string' ? option : option.label ?? value
        const count = typeof option === 'string' ? undefined : option.count
        const checked = typeof option === 'string' ? undefined : option.checked

        return {
          value,
          label,
          count,
          checked: checked ?? selectedValues.has(value),
        }
      }),
    }
  })
}

export function FilterGroupSheetPanel({
  groups,
  children,
  ...props
}: FilterGroupSheetPanelProps) {
  const sections = useMemo(() => buildFilterSections(groups), [groups])

  return (
    <FilterSheetPanel {...props} sections={sections}>
      {children}
    </FilterSheetPanel>
  )
}

function toSelectedSet(values?: FilterSelectedValues) {
  if (!values) return new Set<string>()
  return values instanceof Set ? values : new Set(values)
}
