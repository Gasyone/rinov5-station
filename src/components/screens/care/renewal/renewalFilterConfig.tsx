'use client'

import { createFilterGroup, type FilterGroupConfig } from '@/components/filters'
import { ProgramLevelTreeFilter } from './ProgramLevelTreeFilter'
import { RenewalDateRangeFilter } from './RenewalDateRangeFilter'

export interface BuildRenewalFilterGroupsParams {
  branchOptions: string[]
  selectedBranches: Set<string>
  selectedSubjectsFilter: Set<string>
  selectedPrograms: Set<string>
  selectedLevels: Set<string>
  onToggleProgram: (progId: string) => void
  onToggleLevel: (lvlId: string) => void
  selectedRenewalStatuses: Set<string>
  selectedFeeDueMonths: Set<string>
  customStartDate: string
  customEndDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onClearDates: () => void
  selectedCalls: Set<string>
  csStaffOptions: string[]
  selectedCSStaff: Set<string>
  teacherOptions: string[]
  selectedTeachers: Set<string>
  selectedStatuses: Set<string>
  selectedOrderStatuses: Set<string>
  classList: string[]
  selectedClasses: Set<string>
}

export function buildRenewalFilterGroups({
  branchOptions,
  selectedBranches,
  selectedSubjectsFilter,
  selectedPrograms,
  selectedLevels,
  onToggleProgram,
  onToggleLevel,
  selectedRenewalStatuses,
  selectedFeeDueMonths,
  customStartDate,
  customEndDate,
  onStartDateChange,
  onEndDateChange,
  onClearDates,
  selectedCalls,
  csStaffOptions,
  selectedCSStaff,
  teacherOptions,
  selectedTeachers,
  selectedStatuses,
  selectedOrderStatuses,
  classList,
  selectedClasses,
}: BuildRenewalFilterGroupsParams): FilterGroupConfig[] {
  return [
    createFilterGroup({
      id: 'branches',
      title: 'Cơ sở / Trường học',
      options: branchOptions,
      selectedValues: selectedBranches,
      defaultOpen: true,
    }),
    createFilterGroup({
      id: 'subjects',
      title: 'Môn học',
      options: [
        { value: 'Tiếng Anh', label: 'Tiếng Anh' },
        { value: 'Toán tư duy', label: 'Toán tư duy' },
      ],
      selectedValues: selectedSubjectsFilter,
      defaultOpen: true,
    }),
    createFilterGroup({
      id: 'programs',
      title: 'Chương trình & Trình độ (Level)',
      options: [],
      defaultOpen: true,
      customContent: (
        <ProgramLevelTreeFilter
          selectedPrograms={selectedPrograms}
          selectedLevels={selectedLevels}
          onToggleProgram={onToggleProgram}
          onToggleLevel={onToggleLevel}
        />
      ),
    }),
    createFilterGroup({
      id: 'renewalStatuses',
      title: 'Trạng thái tái phí',
      options: [
        { value: 'moi', label: 'Mới' },
        { value: 'can_nhac', label: 'Cân nhắc' },
        { value: 'tiem_nang', label: 'Tiềm năng' },
        { value: 'hen_tai', label: 'Hẹn tái' },
        { value: 'tai_phi', label: 'Đã tái phí' },
        { value: 'that_bai', label: 'Thất bại' },
        { value: 'chua_den_han', label: 'Chưa đến hạn' },
      ],
      selectedValues: selectedRenewalStatuses,
      defaultOpen: true,
    }),
    createFilterGroup({
      id: 'feeDueMonths',
      title: 'Hạn học phí & Khoảng ngày',
      options: [
        { value: '1', label: 'Hạn T1 (≤ 1 tháng - Khẩn cấp)' },
        { value: '2', label: 'Hạn T2 (1 - 2 tháng)' },
        { value: '3', label: 'Hạn T3 (2 - 3 tháng)' },
      ],
      selectedValues: selectedFeeDueMonths,
      defaultOpen: true,
      customContent: (
        <RenewalDateRangeFilter
          startDate={customStartDate}
          endDate={customEndDate}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          onClearDates={onClearDates}
        />
      ),
    }),
    createFilterGroup({
      id: 'callConfirmations',
      title: 'Kết quả chăm sóc',
      options: [
        { value: 'Chưa gọi', label: 'Chưa liên hệ' },
        { value: 'Đã gọi', label: 'Đã gọi điện' },
        { value: 'KNM', label: 'Không nghe máy (KNM)' },
        { value: 'Đã nhắn Zalo', label: 'Đã nhắn Zalo' },
        { value: 'Đã gặp trực tiếp', label: 'Đã gặp trực tiếp' },
        { value: 'Đã tương tác', label: 'Đã tương tác' },
      ],
      selectedValues: selectedCalls,
      defaultOpen: false,
    }),
    createFilterGroup({
      id: 'csStaff',
      title: 'Chuyên viên CS (CSM)',
      options: csStaffOptions,
      selectedValues: selectedCSStaff,
      defaultOpen: false,
      searchable: true,
      scrollable: true,
    }),
    createFilterGroup({
      id: 'teachers',
      title: 'Giáo viên (GV)',
      options: teacherOptions,
      selectedValues: selectedTeachers,
      defaultOpen: false,
      searchable: true,
      scrollable: true,
    }),
    createFilterGroup({
      id: 'statuses',
      title: 'Trạng thái lớp & Học tập',
      options: [
        { value: 'Đang học', label: 'Đang học' },
        { value: 'Chờ chuyển lớp', label: 'Chờ ghép lớp / Chuyển lớp' },
        { value: 'Bảo lưu', label: 'Bảo lưu' },
        { value: 'Hết buổi', label: 'Hết phí / Hết buổi' },
      ],
      selectedValues: selectedStatuses,
      defaultOpen: false,
    }),
    createFilterGroup({
      id: 'orderStatus',
      title: 'Trạng thái Đơn hàng',
      options: [
        { value: 'has_order', label: 'Đã có đơn hàng' },
        { value: 'no_order', label: 'Chưa có đơn hàng' },
        { value: 'paid', label: 'Đã thanh toán / Đặt cọc' },
      ],
      selectedValues: selectedOrderStatuses,
      defaultOpen: false,
    }),
    createFilterGroup({
      id: 'classes',
      title: 'Lớp học',
      options: classList,
      selectedValues: selectedClasses,
      defaultOpen: false,
      searchable: true,
      scrollable: true,
    }),
  ]
}
