import type { TuitionDebtItem, TuitionDebtStatus, PaymentPlanType } from '@/mocks/tuitionDebts'

export type { TuitionDebtItem, TuitionDebtStatus, PaymentPlanType }

export interface TuitionDebtFilterState {
  searchQuery: string
  selectedBranch: string
  selectedSubject: string
  selectedPaymentPlan: string
  debtStatusTab: string
  selectedBranches: Set<string>
  selectedSubjects: Set<string>
  selectedStatuses: Set<string>
  selectedPaymentPlans: Set<string>
  selectedCSStaff: Set<string>
  selectedDebtRanges: Set<string>
}

export const DEBT_STATUS_LABELS: Record<TuitionDebtStatus, string> = {
  debt_cho_thu: 'Chờ thu',
  debt_thu_mot_phan: 'Thu một phần',
  debt_da_thu_du: 'Đã thu đủ',
  debt_da_huy: 'Đã hủy / Miễn nợ',
  // Backward compatibility
  debt_moi: 'Chờ thu',
  debt_trong_han: 'Thu một phần',
  debt_qua_han: 'Quá hạn',
  debt_coc_hoc: 'Thu một phần',
  debt_da_thu: 'Đã thu đủ',
  debt_that_bai: 'Đã hủy / Miễn nợ',
}

export const PAYMENT_PLAN_LABELS: Record<PaymentPlanType, string> = {
  nhieu_lan: 'Thanh toán nhiều lần',
  coc_hoc_luon: 'Cọc cho học luôn',
  tra_gop_bank: 'Trả góp qua Ngân hàng',
  dong_le: 'Đóng lẻ từng đợt',
}
