'use client'

import { createFilterGroup, type FilterGroupConfig } from '@/components/filters'

export interface BuildTuitionDebtFilterGroupsParams {
  branchOptions: string[]
  selectedBranches: Set<string>
  selectedSubjects: Set<string>
  selectedPaymentPlans: Set<string>
  selectedDebtStatuses: Set<string>
  selectedDebtRanges: Set<string>
  csStaffOptions: string[]
  selectedCSStaff: Set<string>
  teacherOptions: string[]
  selectedTeachers: Set<string>
}

export function buildTuitionDebtFilterGroups({
  branchOptions,
  selectedBranches,
  selectedSubjects,
  selectedPaymentPlans,
  selectedDebtStatuses,
  selectedDebtRanges,
  csStaffOptions,
  selectedCSStaff,
  teacherOptions,
  selectedTeachers,
}: BuildTuitionDebtFilterGroupsParams): FilterGroupConfig[] {
  return [
    createFilterGroup({
      id: 'branches',
      title: 'Cơ sở / Chi nhánh',
      options: branchOptions,
      selectedValues: selectedBranches,
      defaultOpen: true,
    }),
    createFilterGroup({
      id: 'debtStatuses',
      title: 'Trạng thái công nợ',
      options: [
        { value: 'debt_cho_thu', label: 'Chờ thu' },
        { value: 'debt_thu_mot_phan', label: 'Thu một phần' },
        { value: 'debt_da_thu_du', label: 'Đã thu đủ' },
        { value: 'debt_da_huy', label: 'Đã hủy / Miễn nợ' },
      ],
      selectedValues: selectedDebtStatuses,
      defaultOpen: true,
    }),
    createFilterGroup({
      id: 'paymentPlans',
      title: 'Hình thức thanh toán',
      options: [
        { value: 'nhieu_lan', label: 'Thanh toán nhiều lần' },
        { value: 'coc_hoc_luon', label: 'Cọc cho học luôn' },
        { value: 'tra_gop_bank', label: 'Trả góp qua Ngân hàng' },
        { value: 'dong_le', label: 'Đóng lẻ từng đợt' },
      ],
      selectedValues: selectedPaymentPlans,
      defaultOpen: true,
    }),
    createFilterGroup({
      id: 'debtRanges',
      title: 'Mức tiền còn nợ',
      options: [
        { value: 'under_5m', label: 'Dưới 5 triệu' },
        { value: '5m_to_10m', label: 'Từ 5 - 10 triệu' },
        { value: 'over_10m', label: 'Trên 10 triệu' },
      ],
      selectedValues: selectedDebtRanges,
    }),
    createFilterGroup({
      id: 'subjects',
      title: 'Môn học',
      options: [
        { value: 'Tiếng Anh', label: 'Tiếng Anh' },
        { value: 'Toán tư duy', label: 'Toán tư duy' },
      ],
      selectedValues: selectedSubjects,
    }),
    createFilterGroup({
      id: 'csStaff',
      title: 'Người phụ trách CS / Thu nợ',
      options: csStaffOptions,
      selectedValues: selectedCSStaff,
    }),
    createFilterGroup({
      id: 'teachers',
      title: 'Giáo viên phụ trách',
      options: teacherOptions,
      selectedValues: selectedTeachers,
    }),
  ]
}
