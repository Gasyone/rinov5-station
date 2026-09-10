'use client'

import { useState } from 'react'
import { Calendar, Check, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  FilterAsidePanel,
  FilterCollapsibleSection,
  FilterRadioOption,
  FilterCheckboxOption,
} from '@/components/filters'
import { DateRangePicker, formatDateToDisplay } from '@/components/controls'
import { cn } from '@/lib/utils'
import type { PaymentReceipt, ReceiptType, PaymentMethod } from '@/mocks/paymentReceipts'
import {
  PaymentReceiptsFilterState,
  ReceiptTimeRangeFilter,
  RECEIPT_TIME_RANGE_OPTIONS,
  RECEIPT_DATE_PRESETS,
  DEBT_STATUS_OPTIONS,
  AMOUNT_RANGE_OPTIONS,
  FilterDebtStatus,
  FilterAmountRange,
} from './paymentReceiptsTypes'

interface PaymentReceiptsFilterPanelProps {
  receipts: PaymentReceipt[]
  filters: PaymentReceiptsFilterState
  staffList: string[]
  bankAccountList: string[]
  onClose: () => void
  onToggle: (
    key: 'createdBys' | 'receiptTypes' | 'paymentMethods' | 'bankAccounts',
    value: string
  ) => void
  onFilterChange: (updates: Partial<PaymentReceiptsFilterState>) => void
  onResetFilters: () => void
  onClearSection?: (key: keyof PaymentReceiptsFilterState) => void
}

const RECEIPT_TYPE_OPTIONS: { value: ReceiptType; label: string }[] = [
  { value: 'tuition_full', label: 'Học phí' },
  { value: 'deposit', label: 'Cọc giữ chỗ' },
  { value: 'installment', label: 'Kỳ trả góp' },
  { value: 'event_fee', label: 'Phí sự kiện' },
  { value: 'refund', label: 'Hoàn tiền' },
  { value: 'other', label: 'Khoản khác' },
]

const PAYMENT_METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'qr_transfer', label: 'Chuyển khoản QR' },
  { value: 'cash', label: 'Tiền mặt' },
  { value: 'pos_card', label: 'Cà thẻ POS' },
  { value: 'bank_transfer', label: 'Chuyển khoản NH' },
]

export function PaymentReceiptsFilterPanel({
  receipts,
  filters,
  staffList,
  bankAccountList,
  onClose,
  onToggle,
  onFilterChange,
  onResetFilters,
  onClearSection,
}: PaymentReceiptsFilterPanelProps) {
  const [staffSearch, setStaffSearch] = useState('')

  const activeCount =
    (filters.timeRange !== 'this_month' && filters.timeRange !== 'all' ? 1 : 0) +
    (filters.createdBys?.length ?? (filters.createdBy !== 'all' ? 1 : 0)) +
    (filters.receiptTypes?.length ?? (filters.receiptType !== 'all' ? 1 : 0)) +
    (filters.paymentMethods?.length ?? (filters.paymentMethod !== 'all' ? 1 : 0)) +
    (filters.bankAccounts?.length ?? (filters.bankAccount !== 'all' ? 1 : 0)) +
    (filters.debtStatus !== 'all' ? 1 : 0) +
    (filters.amountRange !== 'all' ? 1 : 0)

  const filteredStaff = staffList.filter((s) =>
    s.toLowerCase().includes(staffSearch.toLowerCase().trim())
  )

  return (
    <FilterAsidePanel
      title="Bộ lọc nâng cao"
      activeCount={activeCount}
      onReset={onResetFilters}
      resetLabel="Đặt lại"
      onClose={onClose}
      ariaLabel="Panel bộ lọc nâng cao"
    >
        {/* Nhóm 1: Khoảng thời gian */}
        <FilterCollapsibleSection
          title="Khoảng thời gian"
          defaultOpen={Boolean(filters.timeRange && filters.timeRange !== 'all')}
          badgeCount={filters.timeRange && filters.timeRange !== 'all' ? 1 : 0}
          onClear={
            filters.timeRange && filters.timeRange !== 'all'
              ? () => onFilterChange({ timeRange: 'all', customStartDate: '', customEndDate: '' })
              : undefined
          }
        >
          <div className="space-y-1 pt-0.5">
            {RECEIPT_TIME_RANGE_OPTIONS.map((opt) => {
              if (opt.value === 'custom') {
                const isCustomActive = filters.timeRange === 'custom'
                return (
                  <DateRangePicker
                    key="custom"
                    startDate={filters.customStartDate}
                    endDate={filters.customEndDate}
                    preset={filters.timeRange}
                    presets={RECEIPT_DATE_PRESETS}
                    align="end"
                    trigger={
                      <button
                        type="button"
                        className={cn(
                          'w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition-colors text-left cursor-pointer select-none',
                          isCustomActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'hover:bg-muted/70 text-foreground'
                        )}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="truncate">
                            {isCustomActive && filters.customStartDate
                              ? `${formatDateToDisplay(filters.customStartDate)} – ${formatDateToDisplay(filters.customEndDate)}`
                              : 'Tùy chọn khoảng ngày...'}
                          </span>
                        </div>
                        {isCustomActive && (
                          <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                        )}
                      </button>
                    }
                    onApply={({ startDate, endDate, preset }) => {
                      onFilterChange({
                        timeRange: (preset as ReceiptTimeRangeFilter) || 'custom',
                        customStartDate: startDate,
                        customEndDate: endDate,
                      })
                    }}
                    onClear={() => {
                      onFilterChange({
                        timeRange: 'all',
                        customStartDate: '',
                        customEndDate: '',
                      })
                    }}
                  />
                )
              }

              const isSelected = (filters.timeRange || 'all') === opt.value
              return (
                <FilterRadioOption
                  key={opt.value}
                  value={opt.value}
                  label={opt.label}
                  selected={isSelected}
                  onSelect={(val) =>
                    onFilterChange({
                      timeRange: isSelected && val !== 'all' ? 'all' : (val as ReceiptTimeRangeFilter),
                      customStartDate: '',
                      customEndDate: '',
                    })
                  }
                />
              )
            })}
          </div>
        </FilterCollapsibleSection>

        {/* Nhóm 2: Người lập phiếu */}
        <FilterCollapsibleSection
          title="Người lập phiếu"
          defaultOpen={(filters.createdBys?.length ?? 0) > 0 || filters.createdBy !== 'all'}
          badgeCount={filters.createdBys?.length ?? (filters.createdBy !== 'all' ? 1 : 0)}
          onClear={
            (filters.createdBys?.length ?? 0) > 0 || filters.createdBy !== 'all'
              ? () => {
                  if (onClearSection) {
                    onClearSection('createdBys')
                    onFilterChange({ createdBy: 'all' })
                  } else {
                    onFilterChange({ createdBys: [], createdBy: 'all' })
                  }
                }
              : undefined
          }
        >
          <div className="space-y-1.5 pt-1">
            {staffList.length > 5 && (
              <div className="relative mb-1.5">
                <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm tên người lập..."
                  value={staffSearch}
                  onChange={(e) => setStaffSearch(e.target.value)}
                  className="h-7 text-xs pl-7 pr-2"
                />
              </div>
            )}
            <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1">
              {filteredStaff.map((staff) => {
                const checked = (filters.createdBys || []).includes(staff) || filters.createdBy === staff
                const count = receipts.filter((r) => r.createdBy === staff).length
                return (
                  <FilterCheckboxOption
                    key={staff}
                    value={staff}
                    label={staff}
                    checked={checked}
                    count={count}
                    onToggle={(val) => onToggle('createdBys', val)}
                  />
                )
              })}
            </div>
          </div>
        </FilterCollapsibleSection>

        {/* Nhóm 3: Mục đích giao dịch */}
        <FilterCollapsibleSection
          title="Mục đích giao dịch"
          defaultOpen={(filters.receiptTypes?.length ?? 0) > 0 || filters.receiptType !== 'all'}
          badgeCount={filters.receiptTypes?.length ?? (filters.receiptType !== 'all' ? 1 : 0)}
          onClear={
            (filters.receiptTypes?.length ?? 0) > 0 || filters.receiptType !== 'all'
              ? () => {
                  if (onClearSection) {
                    onClearSection('receiptTypes')
                    onFilterChange({ receiptType: 'all' })
                  } else {
                    onFilterChange({ receiptTypes: [], receiptType: 'all' })
                  }
                }
              : undefined
          }
        >
          <div className="space-y-0.5 pt-1">
            {RECEIPT_TYPE_OPTIONS.map((opt) => {
              const checked = (filters.receiptTypes || []).includes(opt.value) || filters.receiptType === opt.value
              const count = receipts.filter((r) => r.receiptType === opt.value).length
              return (
                <FilterCheckboxOption
                  key={opt.value}
                  value={opt.value}
                  label={opt.label}
                  checked={checked}
                  count={count}
                  onToggle={(val) => onToggle('receiptTypes', val as ReceiptType)}
                />
              )
            })}
          </div>
        </FilterCollapsibleSection>

        {/* Nhóm 4: Phương thức thanh toán */}
        <FilterCollapsibleSection
          title="Phương thức thanh toán"
          defaultOpen={(filters.paymentMethods?.length ?? 0) > 0 || filters.paymentMethod !== 'all'}
          badgeCount={filters.paymentMethods?.length ?? (filters.paymentMethod !== 'all' ? 1 : 0)}
          onClear={
            (filters.paymentMethods?.length ?? 0) > 0 || filters.paymentMethod !== 'all'
              ? () => {
                  if (onClearSection) {
                    onClearSection('paymentMethods')
                    onFilterChange({ paymentMethod: 'all' })
                  } else {
                    onFilterChange({ paymentMethods: [], paymentMethod: 'all' })
                  }
                }
              : undefined
          }
        >
          <div className="space-y-0.5 pt-1">
            {PAYMENT_METHOD_OPTIONS.map((opt) => {
              const checked = (filters.paymentMethods || []).includes(opt.value) || filters.paymentMethod === opt.value
              const count = receipts.filter((r) => r.paymentMethod === opt.value).length
              return (
                <FilterCheckboxOption
                  key={opt.value}
                  value={opt.value}
                  label={opt.label}
                  checked={checked}
                  count={count}
                  onToggle={(val) => onToggle('paymentMethods', val as PaymentMethod)}
                />
              )
            })}
          </div>
        </FilterCollapsibleSection>

        {/* Nhóm 5: Tài khoản / Quầy giao dịch */}
        <FilterCollapsibleSection
          title="Tài khoản / Quầy giao dịch"
          defaultOpen={(filters.bankAccounts?.length ?? 0) > 0 || filters.bankAccount !== 'all'}
          badgeCount={filters.bankAccounts?.length ?? (filters.bankAccount !== 'all' ? 1 : 0)}
          onClear={
            (filters.bankAccounts?.length ?? 0) > 0 || filters.bankAccount !== 'all'
              ? () => {
                  if (onClearSection) {
                    onClearSection('bankAccounts')
                    onFilterChange({ bankAccount: 'all' })
                  } else {
                    onFilterChange({ bankAccounts: [], bankAccount: 'all' })
                  }
                }
              : undefined
          }
        >
          <div className="max-h-48 overflow-y-auto space-y-0.5 pt-1 pr-1">
            {bankAccountList.map((acc) => {
              const checked = (filters.bankAccounts || []).includes(acc) || filters.bankAccount === acc
              const count = receipts.filter((r) => r.bankAccount === acc).length
              return (
                <FilterCheckboxOption
                  key={acc}
                  value={acc}
                  label={acc}
                  checked={checked}
                  count={count}
                  onToggle={(val) => onToggle('bankAccounts', val)}
                />
              )
            })}
          </div>
        </FilterCollapsibleSection>

        {/* Nhóm 6: Tình trạng công nợ */}
        <FilterCollapsibleSection
          title="Tình trạng công nợ"
          defaultOpen={filters.debtStatus !== 'all'}
          badgeCount={filters.debtStatus !== 'all' ? 1 : 0}
          onClear={
            filters.debtStatus !== 'all'
              ? () => onFilterChange({ debtStatus: 'all' })
              : undefined
          }
        >
          <div className="space-y-0.5 pt-1">
            {DEBT_STATUS_OPTIONS.map((opt) => {
              const isSelected = filters.debtStatus === opt.value
              return (
                <FilterRadioOption
                  key={opt.value}
                  value={opt.value}
                  label={opt.label}
                  selected={isSelected}
                  onSelect={(val) =>
                    onFilterChange({
                      debtStatus: isSelected && val !== 'all' ? 'all' : (val as FilterDebtStatus),
                    })
                  }
                />
              )
            })}
          </div>
        </FilterCollapsibleSection>

        {/* Nhóm 7: Khoảng số tiền */}
        <FilterCollapsibleSection
          title="Khoảng số tiền giao dịch"
          defaultOpen={filters.amountRange !== 'all'}
          badgeCount={filters.amountRange !== 'all' ? 1 : 0}
          onClear={
            filters.amountRange !== 'all'
              ? () => onFilterChange({ amountRange: 'all' })
              : undefined
          }
        >
          <div className="space-y-0.5 pt-1">
            {AMOUNT_RANGE_OPTIONS.map((opt) => {
              const isSelected = filters.amountRange === opt.value
              return (
                <FilterRadioOption
                  key={opt.value}
                  value={opt.value}
                  label={opt.label}
                  selected={isSelected}
                  onSelect={(val) =>
                    onFilterChange({
                      amountRange: isSelected && val !== 'all' ? 'all' : (val as FilterAmountRange),
                    })
                  }
                />
              )
            })}
          </div>
        </FilterCollapsibleSection>
    </FilterAsidePanel>
  )
}

