'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { getLeads, Lead } from '@/mocks/crmLeads'
import { FilterGroupAsidePanel, type FilterGroupConfig } from '@/components/filters'
import { StatusTiles } from '@/components/shared'
import { CrmLeadsStatusMatrix } from './CrmLeadsStatusMatrix'
import { CrmLeadsToolbar } from './CrmLeadsToolbar'
import { CrmLeadsTable } from './CrmLeadsTable'
import { CrmCustomerCreateDialog } from './CrmCustomerCreateDialog'
import { DraftOrderEditorDialog } from '@/components/screens/care/draft-order/DraftOrderEditorDialog'
import type { DetailedOrder } from '@/components/screens/care/student-orders/studentOrdersTypes'
import { formatCurrency } from '@/lib/format'
import type { SalesCycle } from './detail/crmLeadDetailTypes'
import {
  INITIAL_ADVANCED_FILTERS,
  type AdvancedFiltersState,
  type StatusTileMode,
} from './crmLeadsTypes'
import { useLeadLifecycleStore } from '@/stores/useLeadLifecycleStore'
import {
  calculateStatusTileCounts,
  isMoiTiepNhanStatus,
  isDangTuVanStatus,
  isHenTraiNghiemStatus,
  isChoChotStatus,
  isThucHienDonStatus,
  isChuyenDoiStatus,
  isLeadTodayTask,
  isLeadOverdue,
  isLeadUnassigned,
  isHenGoiLaiStatus,
  isDaDatTestStatus,
  isDaTestCoKqStatus,
  isHocThuStatus,
  isHenNopPhiStatus,
  isDaCocStatus,
  isChoXepLopStatus,
  mapSubStatusToMainStatus,
  matchSubStatus,
  buildEditingOrderFromLead,
  buildCrmFilterGroups,
  filterLeadsWithAllCriteria,
} from './crmLeadsHelpers'

const CURRENT_USER_STAFF = 'Trần Thị Mai (Sales)'

interface CrmLeadsScreenProps {
  defaultViewScope?: 'my' | 'all'
}

export function CrmLeadsScreen({ defaultViewScope = 'all' }: CrmLeadsScreenProps) {
  const { pools } = useLeadLifecycleStore()
  const viewScope = defaultViewScope
  const [statusTileMode, setStatusTileMode] = useState<StatusTileMode>('main')
  const [branch, setBranch] = useState('all')
  const [selectedPool, setSelectedPool] = useState('all')
  const [source, setSource] = useState('all')
  const [assignment, setAssignment] = useState('all')
  const [followUp, setFollowUp] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedSubStatus, setSelectedSubStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // Advanced Filter Sheet State
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFiltersState>(INITIAL_ADVANCED_FILTERS)

  // Detail View: điều hướng trực tiếp sang route /app/crm_leads/[id]
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlLeadId = searchParams.get('leadId')

  useEffect(() => {
    if (urlLeadId) {
      router.replace(`/app/crm_leads/${urlLeadId}`)
    }
  }, [urlLeadId, router])

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [contactProfileLead, setContactProfileLead] = useState<Lead | null>(null)
  const [isContactProfileOpen, setIsContactProfileOpen] = useState(false)
  const [customLeads, setCustomLeads] = useState<Lead[]>([])

  // Modal Lên đơn hàng cho Lead State
  const [orderModalLead, setOrderModalLead] = useState<Lead | null>(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<DetailedOrder | null>(null)

  // Handlers mở Booking Test (chuyển sang trang /app/booking_test/create)
  const handleOpenBookingTest = (lead: Lead) => {
    router.push(`/app/booking_test/create?leadId=${lead.id}`)
  }

  // Handlers mở Trial Class (chuyển sang trang /app/trial_class/create)
  const handleOpenTrialClass = (lead: Lead) => {
    router.push(`/app/trial_class/create?leadId=${lead.id}`)
  }

  // Handler mở Modal Lên đơn cho Lead
  const handleOpenCreateOrder = (lead: Lead) => {
    setOrderModalLead(lead)
    setEditingOrder(buildEditingOrderFromLead(lead, CURRENT_USER_STAFF))
    setIsOrderModalOpen(true)
  }

  const handleSaveOrderSuccess = (newOrder: DetailedOrder) => {
    if (!orderModalLead) return

    const updatedLead: Lead = {
      ...orderModalLead,
      orderCode: newOrder.orderNo || newOrder.id,
      orderStatus: newOrder.paymentStatus || 'unpaid',
      expectedAmount: formatCurrency(newOrder.finalAmount),
      expectedPackage:
        newOrder.items?.[0]?.productName ||
        newOrder.detailedItems?.[0]?.productName ||
        orderModalLead.expectedPackage ||
        'Gói học tiêu chuẩn',
      paymentTerm: newOrder.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : 'Tiền mặt',
      status:
        isMoiTiepNhanStatus(orderModalLead.status) || isDangTuVanStatus(orderModalLead.status)
          ? 'cho_chot'
          : orderModalLead.status,
    }

    setCustomLeads((prev) => {
      const exists = prev.some((l) => l.id === updatedLead.id)
      if (exists) {
        return prev.map((l) => (l.id === updatedLead.id ? updatedLead : l))
      }
      return [updatedLead, ...prev]
    })

    setIsOrderModalOpen(false)
    setOrderModalLead(null)
    setEditingOrder(null)
  }

  const handleReactivateCycle = (lead: Lead) => {
    const cycleCount = (lead.salesCycles?.length || 1) + 1
    const newCycleId = `cycle-${Date.now()}`
    const newCycle: SalesCycle = {
      cycleId: newCycleId,
      cycleNumber: cycleCount,
      title: `Đợt ${cycleCount} (${new Date().toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })} - Tái tiếp cận)`,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      assignedSales: lead.assignedTo || 'Trần Thị Mai (Sales)',
    }

    const updatedLead: Lead = {
      ...lead,
      status: 'moi_tiep_nhan',
      subStatus: 'Tái tiếp cận',
      isReturningLead: true,
      currentCycleId: newCycleId,
      salesCycles: [newCycle, ...(lead.salesCycles || [])],
      createdAt: new Date().toISOString().split('T')[0],
      lastNote: `[Tái kích hoạt #${cycleCount}]: Mở chăm sóc tiếp cận mới cho học viên.`,
    }

    setCustomLeads((prev) => {
      const exists = prev.some((l) => l.id === updatedLead.id)
      if (exists) {
        return prev.map((l) => (l.id === updatedLead.id ? updatedLead : l))
      }
      return [updatedLead, ...prev]
    })

    toast.success(`Đã kích hoạt tái tiếp cận cho học viên ${lead.studentName}!`)
  }

  // Tổng hợp toàn bộ Lead cơ sở trước khi áp dụng bộ lọc nâng cao
  const allLeads = useMemo(() => {
    const baseLeads = getLeads({ search })
    const customIds = new Set(customLeads.map((l) => l.id))
    return [...customLeads, ...baseLeads.filter((l) => !customIds.has(l.id))]
  }, [customLeads, search])

  // Đếm số lượng tiêu chí lọc nâng cao đang áp dụng
  const activeFilterCount = useMemo(() => {
    return Object.values(advancedFilters).reduce(
      (total, arr) => total + (Array.isArray(arr) ? arr.length : 0),
      0
    )
  }, [advancedFilters])

  // Lọc Leads dựa trên phạm vi, kho dữ liệu, phân bổ, và toàn bộ 13 nhóm tiêu chí nâng cao
  const filteredLeads = useMemo(() => {
    return filterLeadsWithAllCriteria({
      leads: allLeads,
      advancedFilters,
      viewScope,
      selectedPool,
      source,
      assignment,
      followUp,
      branch,
    })
  }, [allLeads, advancedFilters, viewScope, selectedPool, source, assignment, followUp, branch])

  // Cấu hình các nhóm bộ lọc cho FilterGroupAsidePanel
  const filterGroups = useMemo<FilterGroupConfig[]>(() => {
    return buildCrmFilterGroups({
      advancedFilters,
      viewScope,
      baseLeads: allLeads,
    })
  }, [advancedFilters, viewScope, allLeads])

  const handleToggleFilter = (sectionId: string, value: string) => {
    setCurrentPage(1)
    if (sectionId === 'statuses' || sectionId === 'failedStatuses') {
      setSelectedStatus('all')
      setSelectedSubStatus('all')
    }
    setAdvancedFilters((prev) => {
      const key = sectionId as keyof AdvancedFiltersState
      const list = (prev[key] as string[]) || []
      const exists = list.includes(value)
      return {
        ...prev,
        [key]: exists ? list.filter((item) => item !== value) : [...list, value],
      }
    })
  }

  const handleClearAllFilters = () => {
    setAdvancedFilters(INITIAL_ADVANCED_FILTERS)
    setCurrentPage(1)
  }

  // Calculate status tile counts dynamically based on current filters
  const tileCounts = useMemo(() => {
    return calculateStatusTileCounts(filteredLeads)
  }, [filteredLeads])


  // Final list filtered by selected status tile and sub-status
  const displayLeads = useMemo(() => {
    let list = filteredLeads
    if (selectedStatus === 'today_tasks') {
      list = filteredLeads.filter(isLeadTodayTask)
    } else if (selectedStatus === 'overdue') {
      list = filteredLeads.filter(isLeadOverdue)
    } else if (selectedStatus === 'unassigned' || selectedStatus === 'chua_phan_bo') {
      list = filteredLeads.filter((item) => isLeadUnassigned(item) || item.status === 'chua_phan_bo')
    } else if (selectedStatus === 'so_sai') {
      list = filteredLeads.filter((l) => l.subStatus?.toLowerCase().includes('sai') || (l.lastNote || '').toLowerCase().includes('sai'))
    } else if (selectedStatus === 'kho_chung') {
      list = filteredLeads.filter((l) => l.poolId === 'pool-t' || isLeadUnassigned(l))
    } else if (selectedStatus === 'kho_new') {
      list = filteredLeads.filter((l) => l.poolId === 'pool-m')
    } else if (selectedStatus === 'kho_loc') {
      list = filteredLeads.filter((l) => l.poolId === 'pool-c')
    } else if (selectedStatus === 'new' || selectedStatus === 'moi_tiep_nhan' || selectedStatus === 'chua_tiep_can') {
      list = filteredLeads.filter((item) => isMoiTiepNhanStatus(item.status) && !isLeadUnassigned(item))
    } else if (selectedStatus === 'knm') {
      list = filteredLeads.filter((l) => (l.lastNote || '').toLowerCase().includes('knm') || (l.lastNote || '').toLowerCase().includes('không nghe'))
    } else if (selectedStatus === 'gl' || selectedStatus === 'hen_goi_lai') {
      list = filteredLeads.filter(isHenGoiLaiStatus)
    } else if (selectedStatus === 'qt' || selectedStatus === 'dang_tu_van' || selectedStatus === 'dang_cham_soc') {
      list = filteredLeads.filter((item) => isDangTuVanStatus(item.status))
    } else if (selectedStatus === 'tad' || selectedStatus === 'da_dat_test') {
      list = filteredLeads.filter(isDaDatTestStatus)
    } else if (selectedStatus === 'dtt' || selectedStatus === 'da_test_co_kq') {
      list = filteredLeads.filter(isDaTestCoKqStatus)
    } else if (selectedStatus === 'tlttt') {
      list = filteredLeads.filter((l) => Boolean(l.testResultLevel || l.initialLevel))
    } else if (selectedStatus === 'dentt') {
      list = filteredLeads.filter((item) => isChoChotStatus(item.status) || isHenNopPhiStatus(item))
    } else if (selectedStatus === 'dadentt') {
      list = filteredLeads.filter((l) => l.testStatus === 'completed' || l.trialStatus === 'completed')
    } else if (selectedStatus === 'sdt') {
      list = filteredLeads.filter((l) => (l.academicPerformance || '').includes('Xuất sắc') || (l.lastNote || '').includes('Hot') || l.status === 'tiem_nang')
    } else if (selectedStatus === 'dg') {
      list = filteredLeads.filter((l) => (l.familySiblings && l.familySiblings.length > 0) || (l.lastNote || '').includes('Gộp'))
    } else if (selectedStatus === 'bank') {
      list = filteredLeads.filter((l) => l.previousOrders?.some((o) => (o.paymentTerm || '').toLowerCase().includes('bank') || (o.paymentTerm || '').toLowerCase().includes('chuyển khoản')) || (l.lastNote || '').toLowerCase().includes('chuyển khoản'))
    } else if (selectedStatus === 'cod') {
      list = filteredLeads.filter((l) => l.previousOrders?.some((o) => (o.paymentTerm || '').toLowerCase().includes('cod')) || (l.lastNote || '').toLowerCase().includes('cod'))
    } else if (selectedStatus === 'cgh') {
      list = filteredLeads.filter((l) => l.orderStatus === 'pending_payment' || isThucHienDonStatus(l))
    } else if (selectedStatus === 'dgnvc') {
      list = filteredLeads.filter((l) => isThucHienDonStatus(l) && (l.lastNote || '').includes('NVC'))
    } else if (selectedStatus === 'dgh') {
      list = filteredLeads.filter(isThucHienDonStatus)
    } else if (selectedStatus === 'cho_xep_lop') {
      list = filteredLeads.filter((item) => isChoXepLopStatus(item) || isThucHienDonStatus(item))
    } else if (selectedStatus === 'hen_trai_nghiem' || selectedStatus === 'danh_gia_trai_nghiem') {
      list = filteredLeads.filter((item) => isHenTraiNghiemStatus(item.status) || isDaDatTestStatus(item) || isDaTestCoKqStatus(item) || isHocThuStatus(item))
    } else if (selectedStatus === 'cho_chot' || selectedStatus === 'tiem_nang') {
      list = filteredLeads.filter((item) => isChoChotStatus(item.status) || isHenNopPhiStatus(item) || isDaCocStatus(item))
    } else if (selectedStatus === 'thuc_hien_don') {
      list = filteredLeads.filter((item) => isThucHienDonStatus(item) || isChoXepLopStatus(item))
    } else if (selectedStatus === 'chuyen_doi') {
      list = filteredLeads.filter((item) => isChuyenDoiStatus(item.status))
    } else if (selectedStatus !== 'all') {
      list = filteredLeads.filter((item) => item.status === selectedStatus)
    }

    if (selectedSubStatus !== 'all') {
      list = list.filter((lead) => matchSubStatus(lead, selectedSubStatus))
    }

    return list
  }, [filteredLeads, selectedStatus, selectedSubStatus])

  const handleToggleTileMode = () => {
    const nextMode: StatusTileMode = statusTileMode === 'main' ? 'all' : 'main'
    setStatusTileMode(nextMode)
    if (nextMode === 'main') {
      const mapped = mapSubStatusToMainStatus(selectedStatus)
      setSelectedStatus(mapped)
    }
    setCurrentPage(1)
    toast.info(
      nextMode === 'all'
        ? 'Chuyển sang chế độ: Chia cột đầy đủ chuẩn bản cũ (T0, T1, T2, T3)'
        : 'Chuyển sang chế độ: Trạng thái chính rút gọn'
    )
  }

  const handleTileSelect = (tileId: string) => {
    setSelectedStatus(tileId)
    setSelectedSubStatus('all') // Reset sub-status khi chọn tab mới
    if (advancedFilters.statuses.length > 0) {
      setAdvancedFilters((prev) => ({ ...prev, statuses: [] }))
    }
    setCurrentPage(1)
  }

  const mainStatusTilesData = useMemo(() => {
    return [
      { id: 'all', label: 'Tất cả', count: tileCounts.all, status: 'all', semantic: 'neutral' as const },
      ...(viewScope === 'all'
        ? [{ id: 'chua_phan_bo', label: 'Chưa phân bổ', count: tileCounts.chua_phan_bo, status: 'chua_phan_bo', semantic: 'warning' as const }]
        : []),
      { id: 'moi_tiep_nhan', label: 'Mới tiếp nhận', count: tileCounts.moi_tiep_nhan, status: 'moi_tiep_nhan', semantic: 'info' as const },
      { id: 'dang_tu_van', label: 'Đang tư vấn', count: tileCounts.dang_tu_van, status: 'dang_tu_van', semantic: 'warning' as const },
      { id: 'hen_trai_nghiem', label: 'Đánh giá & Học thử', count: tileCounts.hen_trai_nghiem, status: 'hen_trai_nghiem', semantic: 'purple' as const },
      { id: 'cho_chot', label: 'Chờ chốt deal', count: tileCounts.cho_chot, status: 'cho_chot', semantic: 'info' as const },
      { id: 'thuc_hien_don', label: 'Thực hiện đơn', count: tileCounts.thuc_hien_don, status: 'thuc_hien_don', semantic: 'info' as const },
      { id: 'chuyen_doi', label: 'Đã chuyển đổi', count: tileCounts.chuyen_doi, status: 'chuyen_doi', semantic: 'success' as const },
    ]
  }, [tileCounts, viewScope])

  const handleViewDetail = (lead: Lead) => {
    router.push(`/app/${viewScope === 'my' ? 'crm_my_leads' : 'crm_leads'}/${lead.id}`)
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3 lg:p-4 bg-background">
      {/* Toolbar với Nút Chuyển Mode đặt trước Cơ sở */}
      <CrmLeadsToolbar
        leads={filteredLeads}
        viewScope={viewScope}
        statusTileMode={statusTileMode}
        onToggleTileMode={handleToggleTileMode}
        pools={pools}
        pool={selectedPool}
        onPoolChange={(val) => {
          setSelectedPool(val)
          setCurrentPage(1)
        }}
        branch={branch}
        onBranchChange={(val) => {
          setBranch(val)
          setCurrentPage(1)
        }}
        source={source}
        onSourceChange={(val) => {
          setSource(val)
          setCurrentPage(1)
        }}
        assignment={assignment}
        onAssignmentChange={(val) => {
          setAssignment(val)
          setCurrentPage(1)
        }}
        followUp={followUp}
        onFollowUpChange={(val) => {
          setFollowUp(val)
          setCurrentPage(1)
        }}
        search={search}
        onSearchChange={(val) => {
          setSearch(val)
          setCurrentPage(1)
        }}
        activeFilterCount={activeFilterCount}
        onOpenFilters={() => setIsFilterOpen(true)}
        onCreateClick={() => setIsCreateOpen(true)}
      />

      {/* Dải Trạng thái: Mode Cấp 1 dùng Tab viên thuốc (StatusTiles), Mode All dùng Bảng chia cột (CrmLeadsStatusMatrix) */}
      {statusTileMode === 'main' ? (
        <div className="w-full min-w-0">
          <StatusTiles
            tiles={mainStatusTilesData}
            activeId={selectedStatus}
            onSelect={handleTileSelect}
            showDot={false}
            coloredCount={true}
          />
        </div>
      ) : (
        <CrmLeadsStatusMatrix
          mode="all"
          activeStatus={selectedStatus}
          onSelectStatus={handleTileSelect}
          counts={tileCounts}
          viewScope={viewScope}
        />
      )}

      {/* DataTable stretching to bottom & Panel Bộ Lọc Ghim Cạnh Phải */}
      <div className="flex flex-1 min-h-0 w-full gap-3 overflow-hidden">
        <div className="flex-1 min-w-0 h-full overflow-hidden">
          <CrmLeadsTable
            viewScope={viewScope}
            leads={displayLeads}
            totalItems={displayLeads.length}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setCurrentPage(1)
            }}
            onViewDetail={handleViewDetail}
            onOpenContactProfile={(lead) => {
              setContactProfileLead(lead)
              setIsContactProfileOpen(true)
            }}
            onOpenBookingTest={handleOpenBookingTest}
            onOpenTrialClass={handleOpenTrialClass}
            onOpenCreateOrder={handleOpenCreateOrder}
            onReactivateCycle={handleReactivateCycle}
          />
        </div>

        {/* Panel bộ lọc ghim ở cạnh phải (khớp chuẩn màn Đơn hàng) */}
        {isFilterOpen && (
          <FilterGroupAsidePanel
            title="Bộ lọc Lead"
            groups={filterGroups}
            onClose={() => setIsFilterOpen(false)}
            onToggle={handleToggleFilter}
            onClearAll={handleClearAllFilters}
            onClearSection={(sectionId) => {
              setAdvancedFilters((prev) => ({
                ...prev,
                [sectionId]: [],
              }))
              setCurrentPage(1)
            }}
          />
        )}
      </div>

      {/* Create Customer Dialog */}
      <CrmCustomerCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={(newLeads) => {
          setCustomLeads((prev) => [...newLeads, ...prev])
          setCurrentPage(1)
        }}
      />

      {/* Contact Profile Detail Dialog (Dùng chung modal tạo mới / detail) */}
      <CrmCustomerCreateDialog
        key={contactProfileLead?.id || 'contact-profile'}
        open={isContactProfileOpen}
        onOpenChange={(isOpen) => {
          setIsContactProfileOpen(isOpen)
          if (!isOpen) setContactProfileLead(null)
        }}
        initialLead={contactProfileLead}
        onSubmit={(updatedLeads) => {
          setCustomLeads((prev) => [...updatedLeads, ...prev])
          toast.success('Đã cập nhật thông tin hồ sơ liên hệ thành công!')
        }}
      />

      {/* Modal Lên đơn hàng (Draft Order Editor Dialog) */}
      <DraftOrderEditorDialog
        open={isOrderModalOpen}
        onOpenChange={(open) => {
          setIsOrderModalOpen(open)
          if (!open) {
            setOrderModalLead(null)
            setEditingOrder(null)
          }
        }}
        studentId={orderModalLead?.id || orderModalLead?.code || 'HV-8849'}
        studentName={orderModalLead?.studentName || 'Học viên'}
        studentPhone={orderModalLead?.phone || '0912345678'}
        studentAddress={orderModalLead?.address || 'Hà Nội'}
        existingOrder={editingOrder}
        onSaveSuccess={handleSaveOrderSuccess}
      />
    </div>
  )
}
