'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'
import { getLeads, Lead } from '@/mocks/crmLeads'
import { StatusTiles } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { FilterGroupAsidePanel, type FilterGroupConfig } from '@/components/filters'
import { cn } from '@/lib/utils'
import { CrmLeadsToolbar } from './CrmLeadsToolbar'
import { CrmLeadsTable } from './CrmLeadsTable'
import { CrmCustomerCreateDialog } from './CrmCustomerCreateDialog'
import { DraftOrderEditorDialog } from '@/components/screens/care/draft-order/DraftOrderEditorDialog'
import type { DetailedOrder } from '@/components/screens/care/student-orders/studentOrdersTypes'
import { formatCurrency } from '@/lib/format'
import type { SalesCycle } from './detail/crmLeadDetailTypes'
import {
  SUB_STATUS_MAP,
  INITIAL_ADVANCED_FILTERS,
  type AdvancedFiltersState,
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
  isThatBaiStatus,
  isTamDungStatus,
  isLeadTodayTask,
  isLeadOverdue,
  isLeadUnassigned,
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
  const { stages, pools } = useLeadLifecycleStore()
  const [viewScope] = useState<'my' | 'all'>(defaultViewScope)
  const [branch, setBranch] = useState('all')
  const [selectedPool, setSelectedPool] = useState('all')
  const [source, setSource] = useState('all')
  const [assignment, setAssignment] = useState('all')
  const [followUp, setFollowUp] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedSubStatus, setSelectedSubStatus] = useState('all')
  const [isSubStatusOpen, setIsSubStatusOpen] = useState(false)
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
      title: `Chu kỳ ${cycleCount} (${new Date().toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })} - Tái tiếp cận)`,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      assignedSales: lead.assignedTo || 'Trần Thị Mai (Sales)',
    }

    const updatedLead: Lead = {
      ...lead,
      status: 'moi_tiep_nhan',
      subStatus: 'Tái tiếp cận (Chu kỳ mới)',
      isReturningLead: true,
      currentCycleId: newCycleId,
      salesCycles: [newCycle, ...(lead.salesCycles || [])],
      createdAt: new Date().toISOString().split('T')[0],
      lastNote: `[Tái kích hoạt Chu kỳ ${cycleCount}]: Mở chu kỳ bán mới cho học viên.`,
    }

    setCustomLeads((prev) => {
      const exists = prev.some((l) => l.id === updatedLead.id)
      if (exists) {
        return prev.map((l) => (l.id === updatedLead.id ? updatedLead : l))
      }
      return [updatedLead, ...prev]
    })

    toast.success(`Đã kích hoạt Chu kỳ Bán mới (#${cycleCount}) cho học viên ${lead.studentName}!`)
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
    if (sectionId === 'statuses') {
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

  // Sub-status options according to current main status and stages in store
  const subStatusOptions = useMemo(() => {
    // Tìm stage tương ứng trong store
    const matchedStage = stages.find((s) => {
      if (selectedStatus === 'moi_tiep_nhan' || selectedStatus === 'chua_tiep_can') return s.id === 'stage-new' || s.code === 'NEW'
      if (selectedStatus === 'dang_tu_van' || selectedStatus === 'dang_cham_soc') return s.id === 'stage-qt' || s.code === 'QT'
      if (selectedStatus === 'hen_trai_nghiem' || selectedStatus === 'danh_gia_trai_nghiem') return s.id === 'stage-tad' || s.code === 'TAD'
      if (selectedStatus === 'cho_chot' || selectedStatus === 'tiem_nang') return s.id === 'stage-dentt' || s.code === 'DENTT'
      if (selectedStatus === 'thuc_hien_don') return s.id === 'stage-order' || s.code === 'T4'
      if (selectedStatus === 'chuyen_doi') return s.id === 'stage-won' || s.code === 'T5' || s.code === 'WON'
      if (selectedStatus === 'that_bai') return s.id === 'stage-lost' || s.code === 'LOST'
      return s.id === selectedStatus || s.code.toLowerCase() === selectedStatus.toLowerCase()
    })

    if (matchedStage && matchedStage.subStatuses && matchedStage.subStatuses.length > 0) {
      return [
        { id: 'all', label: 'Tất cả' },
        ...matchedStage.subStatuses
          .filter((sub) => sub.isActive !== false)
          .map((sub) => ({
            id: sub.code.toLowerCase(),
            label: sub.name.replace(/\s*\(.*?\)/g, '').trim(),
          })),
      ]
    }

    return SUB_STATUS_MAP[selectedStatus] || SUB_STATUS_MAP.all
  }, [selectedStatus, stages])

  // Count sub-status leads dynamically for current status tab
  const subStatusCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    let baseLeads = filteredLeads
    if (selectedStatus === 'today_tasks') {
      baseLeads = filteredLeads.filter(isLeadTodayTask)
    } else if (selectedStatus === 'overdue') {
      baseLeads = filteredLeads.filter(isLeadOverdue)
    } else if (selectedStatus === 'unassigned') {
      baseLeads = filteredLeads.filter(isLeadUnassigned)
    } else if (selectedStatus === 'moi_tiep_nhan' || selectedStatus === 'chua_tiep_can') {
      baseLeads = filteredLeads.filter((item) => isMoiTiepNhanStatus(item.status))
    } else if (selectedStatus === 'dang_tu_van' || selectedStatus === 'dang_cham_soc') {
      baseLeads = filteredLeads.filter((item) => isDangTuVanStatus(item.status))
    } else if (selectedStatus === 'hen_trai_nghiem' || selectedStatus === 'danh_gia_trai_nghiem') {
      baseLeads = filteredLeads.filter((item) => isHenTraiNghiemStatus(item.status))
    } else if (selectedStatus === 'cho_chot' || selectedStatus === 'tiem_nang') {
      baseLeads = filteredLeads.filter((item) => isChoChotStatus(item.status))
    } else if (selectedStatus === 'thuc_hien_don') {
      baseLeads = filteredLeads.filter(isThucHienDonStatus)
    } else if (selectedStatus === 'chuyen_doi') {
      baseLeads = filteredLeads.filter((item) => isChuyenDoiStatus(item.status))
    } else if (selectedStatus === 'that_bai') {
      baseLeads = filteredLeads.filter((item) => isThatBaiStatus(item.status))
    } else if (selectedStatus === 'tam_dung') {
      baseLeads = filteredLeads.filter((item) => isTamDungStatus(item.status))
    } else if (selectedStatus !== 'all') {
      baseLeads = filteredLeads.filter((item) => item.status === selectedStatus)
    }

    subStatusOptions.forEach((subOpt) => {
      if (subOpt.id === 'all') {
        counts[subOpt.id] = baseLeads.length
      } else {
        counts[subOpt.id] = baseLeads.filter((lead) => matchSubStatus(lead, subOpt.id)).length
      }
    })

    return counts
  }, [subStatusOptions, filteredLeads, selectedStatus])

  // Final list filtered by selected status tile and sub-status
  const displayLeads = useMemo(() => {
    let list = filteredLeads
    if (selectedStatus === 'today_tasks') {
      list = filteredLeads.filter(isLeadTodayTask)
    } else if (selectedStatus === 'overdue') {
      list = filteredLeads.filter(isLeadOverdue)
    } else if (selectedStatus === 'unassigned') {
      list = filteredLeads.filter(isLeadUnassigned)
    } else if (selectedStatus === 'moi_tiep_nhan' || selectedStatus === 'chua_tiep_can') {
      list = filteredLeads.filter((item) => isMoiTiepNhanStatus(item.status))
    } else if (selectedStatus === 'dang_tu_van' || selectedStatus === 'dang_cham_soc') {
      list = filteredLeads.filter((item) => isDangTuVanStatus(item.status))
    } else if (selectedStatus === 'hen_trai_nghiem' || selectedStatus === 'danh_gia_trai_nghiem') {
      list = filteredLeads.filter((item) => isHenTraiNghiemStatus(item.status))
    } else if (selectedStatus === 'cho_chot' || selectedStatus === 'tiem_nang') {
      list = filteredLeads.filter((item) => isChoChotStatus(item.status))
    } else if (selectedStatus === 'thuc_hien_don') {
      list = filteredLeads.filter(isThucHienDonStatus)
    } else if (selectedStatus === 'chuyen_doi') {
      list = filteredLeads.filter((item) => isChuyenDoiStatus(item.status))
    } else if (selectedStatus === 'that_bai') {
      list = filteredLeads.filter((item) => isThatBaiStatus(item.status))
    } else if (selectedStatus === 'tam_dung') {
      list = filteredLeads.filter((item) => isTamDungStatus(item.status))
    } else if (selectedStatus !== 'all') {
      list = filteredLeads.filter((item) => item.status === selectedStatus)
    }

    if (selectedSubStatus !== 'all') {
      list = list.filter((lead) => matchSubStatus(lead, selectedSubStatus))
    }

    return list
  }, [filteredLeads, selectedStatus, selectedSubStatus])

  const statusTilesData = useMemo(() => {
    // Xác định tiền tố hiển thị theo Kho đang chọn: Kho T -> T, Kho M -> M, Kho CC -> C, Kho G -> G. Mặc định 'T'
    const activePool = pools.find((p) => p.id === selectedPool)
    const poolPrefix = activePool ? activePool.code.toUpperCase() : 'T'

    const getStageName = (stageIdOrCode: string, fallback: string) => {
      const found = stages.find(
        (s) =>
          s.id === stageIdOrCode ||
          s.code.toLowerCase() === stageIdOrCode.toLowerCase()
      )
      if (!found) return fallback

      // Bỏ hoàn toàn các tiền tố ngoặc vuông [T0], [T1]... và hậu tố ngoặc đơn (...)
      const cleaned = found.name
        .replace(/^\[.*?\]\s*/, '')
        .replace(/\s*\(.*?\)/g, '')
        .trim()

      if (stageIdOrCode === 'stage-new' && (cleaned === 'Tiếp nhận Lead' || !cleaned)) return 'Tiếp nhận'
      if (stageIdOrCode === 'stage-qt' && (cleaned === 'Đang tư vấn & Chăm sóc' || !cleaned)) return 'Đang tư vấn'
      if (stageIdOrCode === 'stage-tad' && (cleaned === 'Đánh giá & Học thử' || !cleaned)) return fallback
      if (stageIdOrCode === 'stage-dentt' && (cleaned === 'Xác nhận nhập học' || found.name.includes('Chờ chốt deal'))) return 'Chờ chốt deal'
      if (stageIdOrCode === 'stage-order' && (cleaned === 'Thực hiện đơn & Bàn giao' || found.name.includes('Thực hiện đơn'))) return 'Thực hiện đơn'
      if (stageIdOrCode === 'stage-won' && (cleaned === 'Hoàn tất & Thành công' || found.name.includes('Won'))) return 'Đã chuyển đổi'

      return cleaned || fallback
    }

    if (viewScope === 'my') {
      // Dải Tab Tác nghiệp cho Tư vấn viên (Action-driven / Worklist)
      return [
        { id: 'all', label: 'Tất cả', count: tileCounts.all, status: 'all' },
        { id: 'today_tasks', label: '⏰ Cần gọi hôm nay', count: tileCounts.today_tasks, status: 'today_tasks' },
        { id: 'overdue', label: '⚠️ Quá hạn', count: tileCounts.overdue, status: 'overdue' },
        { id: 'dang_tu_van', label: `${poolPrefix}1 · ${getStageName('stage-qt', 'Đang tư vấn')}`, count: tileCounts.dang_tu_van, status: 'dang_tu_van' },
        { id: 'hen_trai_nghiem', label: `${poolPrefix}2 · ${getStageName('stage-tad', 'Lịch trải nghiệm')}`, count: tileCounts.hen_trai_nghiem, status: 'hen_trai_nghiem' },
        { id: 'cho_chot', label: `${poolPrefix}3 · ${getStageName('stage-dentt', 'Chờ chốt deal')}`, count: tileCounts.cho_chot, status: 'cho_chot' },
        { id: 'thuc_hien_don', label: `${poolPrefix}4 · ${getStageName('stage-order', 'Thực hiện đơn')}`, count: tileCounts.thuc_hien_don, status: 'thuc_hien_don' },
        { id: 'chuyen_doi', label: `${poolPrefix}5 · ${getStageName('stage-won', 'Đã chuyển đổi')}`, count: tileCounts.chuyen_doi, status: 'chuyen_doi' },
      ]
    }

    // viewScope === 'all' -> Dải Tab Phễu & Điều phối cho Quản lý (Pipeline & Allocation)
    return [
      { id: 'all', label: 'Tất cả', count: tileCounts.all, status: 'all' },
      { id: 'unassigned', label: '👤 Chưa phân bổ', count: tileCounts.unassigned, status: 'unassigned' },
      { id: 'moi_tiep_nhan', label: `${poolPrefix}0 · ${getStageName('stage-new', 'Tiếp nhận')}`, count: tileCounts.moi_tiep_nhan, status: 'moi_tiep_nhan' },
      { id: 'dang_tu_van', label: `${poolPrefix}1 · ${getStageName('stage-qt', 'Đang tư vấn')}`, count: tileCounts.dang_tu_van, status: 'dang_tu_van' },
      { id: 'hen_trai_nghiem', label: `${poolPrefix}2 · ${getStageName('stage-tad', 'Đánh giá & Học thử')}`, count: tileCounts.hen_trai_nghiem, status: 'hen_trai_nghiem' },
      { id: 'cho_chot', label: `${poolPrefix}3 · ${getStageName('stage-dentt', 'Chờ chốt deal')}`, count: tileCounts.cho_chot, status: 'cho_chot' },
      { id: 'thuc_hien_don', label: `${poolPrefix}4 · ${getStageName('stage-order', 'Thực hiện đơn')}`, count: tileCounts.thuc_hien_don, status: 'thuc_hien_don' },
      { id: 'chuyen_doi', label: `${poolPrefix}5 · ${getStageName('stage-won', 'Đã chuyển đổi')}`, count: tileCounts.chuyen_doi, status: 'chuyen_doi' },
    ]
  }, [tileCounts, viewScope, stages, pools, selectedPool])

  const handleTileSelect = (tileId: string) => {
    setSelectedStatus(tileId)
    setSelectedSubStatus('all') // Reset sub-status khi chọn tab mới
    if (advancedFilters.statuses.length > 0) {
      setAdvancedFilters((prev) => ({ ...prev, statuses: [] }))
    }
    setCurrentPage(1)
  }

  const handleViewDetail = (lead: Lead) => {
    router.push(`/app/${viewScope === 'my' ? 'crm_my_leads' : 'crm_leads'}/${lead.id}`)
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3 lg:p-4 bg-background">
      {/* Toolbar */}
      <CrmLeadsToolbar
        leads={filteredLeads}
        viewScope={viewScope}
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

      {/* Dải Status Tiles Chuẩn Hóa Theo Màn Hình + Nút Mở Rộng Tab Lọc Phụ */}
      <div className="flex items-center gap-2 w-full min-w-0">
        <div className="flex-1 min-w-0">
          <StatusTiles
            tiles={statusTilesData}
            activeId={selectedStatus}
            onSelect={handleTileSelect}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "h-8 gap-1.5 shrink-0 text-xs font-medium cursor-pointer transition-colors",
            isSubStatusOpen
              ? "bg-primary/10 border-primary text-primary"
              : "border-border text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setIsSubStatusOpen(!isSubStatusOpen)}
          title="Mở rộng lọc theo trạng thái phụ của tab hiện tại"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Lọc phụ</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isSubStatusOpen && "rotate-180")} />
        </Button>
      </div>

      {/* Thanh Lọc Trạng Thái Phụ Mở Rộng (Sub-status Filter Chips Bar) */}
      {isSubStatusOpen && (
        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-muted/40 rounded-lg border border-border/60 text-xs animate-in fade-in duration-150">
          <span className="text-xs font-semibold text-muted-foreground px-1 shrink-0">
            Lọc phụ:
          </span>
          {subStatusOptions.map((subOpt) => {
            const isActive = selectedSubStatus === subOpt.id
            const count = subStatusCounts[subOpt.id] ?? 0
            return (
              <button
                key={subOpt.id}
                type="button"
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-normal transition-all cursor-pointer border",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-xs font-medium"
                    : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                )}
                onClick={() => {
                  setSelectedSubStatus(isActive ? 'all' : subOpt.id)
                  setCurrentPage(1)
                }}
              >
                <span>{subOpt.label}</span>
                <span
                  className={cn(
                    "inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[11px] font-mono leading-none",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground font-semibold"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
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
