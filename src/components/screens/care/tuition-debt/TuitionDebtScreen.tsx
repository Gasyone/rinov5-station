'use client'

import { useMemo, useState } from 'react'
import { mockTuitionDebts } from '@/mocks/tuitionDebts'
import { mockCareAlerts } from '@/mocks/careAlerts'
import { FilterGroupAsidePanel } from '@/components/filters'
import type { StatusTile } from '@/components/shared'
import { TuitionDebtTable } from './TuitionDebtTable'
import { TuitionDebtToolbar } from './TuitionDebtToolbar'
import { StudentCareDetailPage } from '../StudentCareDetailPage'
import { buildTuitionDebtFilterGroups } from './tuitionDebtFilterConfig'
import { PaymentReceiptPayMoreDialog } from '@/components/screens/payment-receipts/PaymentReceiptPayMoreDialog'
import type { PaymentReceipt } from '@/mocks/paymentReceipts'
import type { Order } from '@/mocks/orders'
import type { TuitionDebtItem } from './tuitionDebtTypes'
import {
  matchesDebtSearch,
  isDebtChoThu,
  isDebtThuMotPhan,
  isDebtDaThuDu,
  isDebtDaHuy,
  isOverdue,
} from './tuitionDebtHelpers'

export interface TuitionDebtScreenProps {
  headerSwitcher?: React.ReactNode
  embedded?: boolean
}

export function TuitionDebtScreen({ headerSwitcher }: TuitionDebtScreenProps = {}) {
  const [debtsList, setDebtsList] = useState<TuitionDebtItem[]>(mockTuitionDebts)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDetailStudentId, setActiveDetailStudentId] = useState<string | null>(null)
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState('all')
  const [debtStatusTab, setDebtStatusTab] = useState('all')

  // Pay more modal state
  const [isPayMoreOpen, setIsPayMoreOpen] = useState(false)
  const [payMoreItem, setPayMoreItem] = useState<TuitionDebtItem | null>(null)

  // Advanced filters state
  const [selectedBranches, setSelectedBranches] = useState<Set<string>>(new Set())
  const [selectedDebtStatuses, setSelectedDebtStatuses] = useState<Set<string>>(new Set())
  const [selectedPaymentPlans, setSelectedPaymentPlans] = useState<Set<string>>(new Set())
  const [selectedDebtRanges, setSelectedDebtRanges] = useState<Set<string>>(new Set())
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set())
  const [selectedCSStaff, setSelectedCSStaff] = useState<Set<string>>(new Set())
  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set())
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Pagination states
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const resetPagination = () => {
    setPage(1)
  }

  // Options for filters
  const branchOptions = useMemo(
    () => Array.from(new Set(debtsList.map((item) => item.branch))).sort(),
    [debtsList]
  )

  const csStaffOptions = useMemo(
    () => Array.from(new Set(debtsList.map((item) => item.csStaff))).sort(),
    [debtsList]
  )

  const teacherOptions = useMemo(
    () => Array.from(new Set(debtsList.map((item) => item.teacherName))).sort(),
    [debtsList]
  )

  // 1. Base filtering (search, toolbar selects, advanced filters)
  const baseFiltered = useMemo(() => {
    let res = debtsList

    // Search query
    if (searchQuery.trim()) {
      res = res.filter((item) => matchesDebtSearch(item, searchQuery))
    }

    // Quick Branch
    if (selectedBranch !== 'all') {
      res = res.filter((item) => item.branch === selectedBranch)
    }

    // Quick Subject
    if (selectedSubject !== 'all') {
      res = res.filter((item) => item.subject === selectedSubject)
    }

    // Quick Payment Plan
    if (selectedPaymentPlan !== 'all') {
      res = res.filter((item) => item.paymentPlan === selectedPaymentPlan)
    }

    // Advanced Branch Filter
    if (selectedBranches.size > 0) {
      res = res.filter((item) => selectedBranches.has(item.branch))
    }

    // Advanced Debt Status Filter
    if (selectedDebtStatuses.size > 0) {
      res = res.filter((item) => selectedDebtStatuses.has(item.debtStatus))
    }

    // Advanced Payment Plan Filter
    if (selectedPaymentPlans.size > 0) {
      res = res.filter((item) => selectedPaymentPlans.has(item.paymentPlan))
    }

    // Advanced Debt Range Filter
    if (selectedDebtRanges.size > 0) {
      res = res.filter((item) => {
        if (selectedDebtRanges.has('under_5m') && item.debtAmount < 5000000) return true
        if (selectedDebtRanges.has('5m_to_10m') && item.debtAmount >= 5000000 && item.debtAmount <= 10000000) return true
        if (selectedDebtRanges.has('over_10m') && item.debtAmount > 10000000) return true
        return false
      })
    }

    // Advanced Subject Filter
    if (selectedSubjects.size > 0) {
      res = res.filter((item) => selectedSubjects.has(item.subject))
    }

    // Advanced CS Staff Filter
    if (selectedCSStaff.size > 0) {
      res = res.filter((item) => selectedCSStaff.has(item.csStaff))
    }

    // Advanced Teacher Filter
    if (selectedTeachers.size > 0) {
      res = res.filter((item) => selectedTeachers.has(item.teacherName))
    }

    return res
  }, [
    debtsList,
    searchQuery,
    selectedBranch,
    selectedSubject,
    selectedPaymentPlan,
    selectedBranches,
    selectedDebtStatuses,
    selectedPaymentPlans,
    selectedDebtRanges,
    selectedSubjects,
    selectedCSStaff,
    selectedTeachers,
  ])

  // 2. Status Tiles calculation (Vòng đời chuẩn: Chưa thu, Thu một phần, Đã thu đủ, Đã hủy)
  const debtStatusTiles: StatusTile<string>[] = useMemo(() => {
    const activeDebts = baseFiltered.filter((item) => !isDebtDaThuDu(item) && !isDebtDaHuy(item))
    const choThuCount = baseFiltered.filter(isDebtChoThu).length
    const thuMotPhanCount = baseFiltered.filter(isDebtThuMotPhan).length
    const daThuDuCount = baseFiltered.filter(isDebtDaThuDu).length
    const daHuyCount = baseFiltered.filter(isDebtDaHuy).length

    return [
      { id: 'all', label: 'Tất cả nợ', count: activeDebts.length, semantic: 'neutral' as const },
      { id: 'debt_cho_thu', label: 'Chờ thu', count: choThuCount, semantic: 'warning' as const },
      { id: 'debt_thu_mot_phan', label: 'Thu một phần', count: thuMotPhanCount, semantic: 'info' as const },
      { id: 'debt_da_thu_du', label: 'Đã thu đủ', count: daThuDuCount, semantic: 'success' as const },
      { id: 'debt_da_huy', label: 'Đã hủy / Miễn nợ', count: daHuyCount, semantic: 'neutral' as const },
    ]
  }, [baseFiltered])

  // 3. Tab filter applied & sorting
  const filtered = useMemo(() => {
    let result = baseFiltered

    if (debtStatusTab === 'all') {
      result = baseFiltered.filter((item) => !isDebtDaThuDu(item) && !isDebtDaHuy(item))
    } else if (debtStatusTab === 'debt_cho_thu') {
      result = baseFiltered.filter(isDebtChoThu)
    } else if (debtStatusTab === 'debt_thu_mot_phan') {
      result = baseFiltered.filter(isDebtThuMotPhan)
    } else if (debtStatusTab === 'debt_da_thu_du') {
      result = baseFiltered.filter(isDebtDaThuDu)
    } else if (debtStatusTab === 'debt_da_huy') {
      result = baseFiltered.filter(isDebtDaHuy)
    }

    // Sort: Overdue first, then by daysOverdue descending, then highest debtAmount descending
    return [...result].sort((a, b) => {
      const aOverdue = isOverdue(a)
      const bOverdue = isOverdue(b)
      if (aOverdue && !bOverdue) return -1
      if (!aOverdue && bOverdue) return 1

      if ((a.daysOverdue ?? 0) !== (b.daysOverdue ?? 0)) {
        return (b.daysOverdue ?? 0) - (a.daysOverdue ?? 0)
      }

      return b.debtAmount - a.debtAmount
    })
  }, [baseFiltered, debtStatusTab])

  // Pagination slice
  const paginatedList = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (selectedBranch !== 'all') count++
    if (selectedSubject !== 'all') count++
    if (selectedPaymentPlan !== 'all') count++
    count += selectedBranches.size
    count += selectedDebtStatuses.size
    count += selectedPaymentPlans.size
    count += selectedDebtRanges.size
    count += selectedSubjects.size
    count += selectedCSStaff.size
    count += selectedTeachers.size
    return count
  }, [
    selectedBranch,
    selectedSubject,
    selectedPaymentPlan,
    selectedBranches,
    selectedDebtStatuses,
    selectedPaymentPlans,
    selectedDebtRanges,
    selectedSubjects,
    selectedCSStaff,
    selectedTeachers,
  ])

  // Filter groups for aside panel
  const filterGroups = useMemo(() => {
    return buildTuitionDebtFilterGroups({
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
    })
  }, [
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
  ])

  const handleFilterToggle = (groupId: string, value: string) => {
    const updateSet = (prev: Set<string>) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    }

    if (groupId === 'branches') setSelectedBranches(updateSet)
    else if (groupId === 'debtStatuses') setSelectedDebtStatuses(updateSet)
    else if (groupId === 'paymentPlans') setSelectedPaymentPlans(updateSet)
    else if (groupId === 'debtRanges') setSelectedDebtRanges(updateSet)
    else if (groupId === 'subjects') setSelectedSubjects(updateSet)
    else if (groupId === 'csStaff') setSelectedCSStaff(updateSet)
    else if (groupId === 'teachers') setSelectedTeachers(updateSet)
    resetPagination()
  }

  const handleClearAllFilters = () => {
    setSelectedBranches(new Set())
    setSelectedDebtStatuses(new Set())
    setSelectedPaymentPlans(new Set())
    setSelectedDebtRanges(new Set())
    setSelectedSubjects(new Set())
    setSelectedCSStaff(new Set())
    setSelectedTeachers(new Set())
    setSelectedBranch('all')
    setSelectedSubject('all')
    setSelectedPaymentPlan('all')
    setSearchQuery('')
    resetPagination()
  }

  const handleClearSection = (groupId: string) => {
    if (groupId === 'branches') setSelectedBranches(new Set())
    else if (groupId === 'debtStatuses') setSelectedDebtStatuses(new Set())
    else if (groupId === 'paymentPlans') setSelectedPaymentPlans(new Set())
    else if (groupId === 'debtRanges') setSelectedDebtRanges(new Set())
    else if (groupId === 'subjects') setSelectedSubjects(new Set())
    else if (groupId === 'csStaff') setSelectedCSStaff(new Set())
    else if (groupId === 'teachers') setSelectedTeachers(new Set())
    resetPagination()
  }

  const handleSelectChange = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    )
  }

  const handlePayMore = (item: TuitionDebtItem) => {
    setPayMoreItem(item)
    setIsPayMoreOpen(true)
  }

  const handlePayMoreSuccess = (newReceipt: PaymentReceipt) => {
    if (!payMoreItem) return
    const paidMore = newReceipt.amount || 0
    setDebtsList((prev) =>
      prev.map((item) => {
        if (item.id === payMoreItem.id) {
          const newDebt = Math.max(0, item.debtAmount - paidMore)
          return {
            ...item,
            paidAmount: item.paidAmount + paidMore,
            debtAmount: newDebt,
            debtStatus: newDebt === 0 ? 'debt_da_thu_du' : 'debt_thu_mot_phan',
          }
        }
        return item
      })
    )
    setIsPayMoreOpen(false)
    setPayMoreItem(null)
  }

  const fakeOrderForPayMore = useMemo((): Order | null => {
    if (!payMoreItem) return null
    return {
      id: payMoreItem.orderCode,
      orderNo: payMoreItem.orderCode,
      studentId: payMoreItem.studentId,
      studentName: payMoreItem.studentName,
      customerName: payMoreItem.parentName,
      customerPhone: payMoreItem.parentPhone,
      totalAmount: payMoreItem.totalAmount,
      discountAmount: 0,
      finalAmount: payMoreItem.totalAmount,
      paidAmount: payMoreItem.paidAmount,
      remainingAmount: payMoreItem.debtAmount,
      items: [],
      paymentMethod: 'bank_transfer',
      paymentStatus: 'partial',
      status: 'processing',
      branch: payMoreItem.branch,
      saleBy: payMoreItem.csStaff,
      createdAt: '2026-08-01',
    }
  }, [payMoreItem])

  // If a detail view is active, render StudentCareDetailPage
  if (activeDetailStudentId) {
    return (
      <StudentCareDetailPage
        studentId={activeDetailStudentId}
        onBack={() => setActiveDetailStudentId(null)}
        alerts={mockCareAlerts}
        headerTitle="Chi tiết Thu phí & Công nợ"
      />
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {headerSwitcher && (
        <div className="px-3 pt-2.5 shrink-0">
          {headerSwitcher}
        </div>
      )}

      <TuitionDebtToolbar
        debts={filtered}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q)
          resetPagination()
        }}
        activeFilterCount={activeFilterCount}
        onOpenFilter={() => setIsFilterOpen(true)}
        selectedBranch={selectedBranch}
        onBranchChange={(b) => {
          setSelectedBranch(b)
          resetPagination()
        }}
        branchOptions={branchOptions}
        selectedSubject={selectedSubject}
        onSubjectChange={(s) => {
          setSelectedSubject(s)
          resetPagination()
        }}
        selectedPaymentPlan={selectedPaymentPlan}
        onPaymentPlanChange={(p) => {
          setSelectedPaymentPlan(p)
          resetPagination()
        }}
        debtStatusTab={debtStatusTab}
        onDebtStatusTabChange={(t) => {
          setDebtStatusTab(t)
          resetPagination()
        }}
        debtStatusTiles={debtStatusTiles}
      />

      <div className="flex flex-1 min-h-0 w-full gap-3 overflow-hidden px-2 py-1.5 lg:px-3 pb-3">
        <div className="flex-1 min-w-0 h-full overflow-hidden flex flex-col">
          <TuitionDebtTable
            debts={paginatedList}
            selectedIds={selectedIds}
            onSelectChange={handleSelectChange}
            onSelectAll={(checked) => {
              setSelectedIds((prev) => {
                const otherIds = prev.filter((id) => !paginatedList.some((x) => x.id === id))
                return checked ? [...otherIds, ...paginatedList.map((x) => x.id)] : otherIds
              })
            }}
            className="border-zinc-200 dark:border-zinc-800 flex-1 min-h-0"
            pagination={{
              page,
              total: filtered.length,
              pageSize,
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
            }}
            onViewDetail={(studentId) => setActiveDetailStudentId(studentId)}
            onPayMore={handlePayMore}
          />
        </div>

        {isFilterOpen && (
          <FilterGroupAsidePanel
            title="Bộ lọc nâng cao"
            description="Kết hợp bộ lọc để tìm kiếm học viên có công nợ chính xác."
            groups={filterGroups}
            onToggle={handleFilterToggle}
            onClearAll={handleClearAllFilters}
            onClearSection={handleClearSection}
            onClose={() => setIsFilterOpen(false)}
          >
            <div className="mb-4">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                Tìm theo từ khóa
              </label>
              <input
                type="text"
                placeholder="Nhập tên, SĐT hoặc mã học viên..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  resetPagination()
                }}
                className="w-full h-9 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-background text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </FilterGroupAsidePanel>
        )}
      </div>

      <PaymentReceiptPayMoreDialog
        order={fakeOrderForPayMore}
        open={isPayMoreOpen}
        onOpenChange={setIsPayMoreOpen}
        onSuccess={handlePayMoreSuccess}
      />
    </div>
  )
}
