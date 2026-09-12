'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'
import { getLeads, Lead } from '@/mocks/crmLeads'
import { StatusTiles } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { FilterGroupSheetPanel, type FilterGroupConfig, createFilterGroup, getSchoolFilterGroup } from '@/components/filters'
import { SYSTEM_BRANCHES } from '@/components/controls'
import { cn } from '@/lib/utils'
import { CrmLeadsToolbar } from './CrmLeadsToolbar'
import { CrmLeadsTable } from './CrmLeadsTable'
import { CrmCustomerCreateDialog } from './CrmCustomerCreateDialog'
import { DraftOrderEditorDialog } from '@/components/screens/care/draft-order/DraftOrderEditorDialog'
import type { DetailedOrder } from '@/components/screens/care/student-orders/studentOrdersTypes'
import { formatCurrency } from '@/lib/format'
import { SUB_STATUS_MAP } from './crmLeadsTypes'
import {
  calculateStatusTileCounts,
  isMoiTiepNhanStatus,
  isDangTuVanStatus,
  isHenTraiNghiemStatus,
  isChoChotStatus,
  isChuyenDoiStatus,
  isThatBaiStatus,
  isTamDungStatus,
  isInactiveLeadStatus,
  isLeadTodayTask,
  isLeadOverdue,
  isLeadUnassigned,
  matchSubStatus,
} from './crmLeadsHelpers'

const CURRENT_USER_STAFF = 'Trần Thị Mai (Sales)'

interface CrmLeadsScreenProps {
  defaultViewScope?: 'my' | 'all'
}

export function CrmLeadsScreen({ defaultViewScope = 'all' }: CrmLeadsScreenProps) {
  const [viewScope] = useState<'my' | 'all'>(defaultViewScope)
  const [branch, setBranch] = useState('all')
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
  const [advancedFilters, setAdvancedFilters] = useState<{
    branches: string[]
    sources: string[]
    subjects: string[]
    assignees: string[]
    statuses: string[]
  }>({
    branches: [],
    sources: [],
    subjects: [],
    assignees: [],
    statuses: [],
  })

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
    if (lead.orderCode) {
      const parsedAmount = lead.expectedAmount
        ? Number(lead.expectedAmount.replace(/\D/g, ''))
        : 8400000

      const orderItems = lead.packages && lead.packages.length > 0
        ? lead.packages.map((pkg, idx) => {
            const itemPrice = Number(pkg.amount.replace(/\D/g, '')) || 0
            return {
              productId: pkg.id || `P-00${idx + 1}`,
              productName: pkg.name,
              quantity: 1,
              unitPrice: itemPrice,
              subtotal: itemPrice,
            }
          })
        : [
            {
              productId: 'P-001',
              productName: lead.expectedPackage || 'Gói học tiêu chuẩn',
              quantity: 1,
              unitPrice: parsedAmount || 8400000,
              subtotal: parsedAmount || 8400000,
            },
          ]

      const detailedItems = lead.packages && lead.packages.length > 0
        ? lead.packages.map((pkg, idx) => {
            const itemPrice = Number(pkg.amount.replace(/\D/g, '')) || 0
            return {
              productId: pkg.id || `P-00${idx + 1}`,
              productName: pkg.name,
              quantity: 1,
              unitPrice: itemPrice,
              subtotal: itemPrice,
              studentName: lead.studentName,
              orderType: 'Mua mới',
              durationText: pkg.duration || '40 buổi',
            }
          })
        : [
            {
              productId: 'P-001',
              productName: lead.expectedPackage || 'Gói học tiêu chuẩn',
              quantity: 1,
              unitPrice: parsedAmount || 8400000,
              subtotal: parsedAmount || 8400000,
              studentName: lead.studentName,
              orderType: 'Mua mới',
              durationText: lead.paymentTerm || '40 buổi',
            },
          ]

      setEditingOrder({
        id: lead.orderCode,
        orderNo: lead.orderCode,
        studentId: lead.id,
        studentName: lead.studentName,
        items: orderItems,
        totalAmount: parsedAmount || 8400000,
        discountAmount: 0,
        finalAmount: parsedAmount || 8400000,
        paymentMethod: 'bank_transfer',
        paymentStatus: lead.orderStatus === 'paid' ? 'paid' : 'unpaid',
        status: 'pending',
        branch: lead.branch,
        saleBy: lead.assignedTo || CURRENT_USER_STAFF,
        createdAt: lead.createdAt || new Date().toISOString(),
        saleDate: lead.createdAt || new Date().toISOString().split('T')[0],
        detailedItems: detailedItems,
        payments: [],
      })
    } else {
      setEditingOrder(null)
    }
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

  // Count active advanced filters
  const activeFilterCount =
    advancedFilters.branches.length +
    advancedFilters.sources.length +
    advancedFilters.subjects.length +
    advancedFilters.assignees.length +
    advancedFilters.statuses.length

  // Filter leads based on viewScope, source, assignment, followUp, search, advancedFilters
  const filteredLeads = useMemo(() => {
    const baseLeads = getLeads({ source, search })
    const customIds = new Set(customLeads.map((l) => l.id))
    let result = [...customLeads, ...baseLeads.filter((l) => !customIds.has(l.id))]

    if (viewScope === 'my') {
      // Chỉ lấy các Lead được phân bổ cho Sale hiện tại
      result = result.filter(
        (lead) => lead.assignedTo === CURRENT_USER_STAFF
      )

      if (followUp === 'today') {
        result = result.filter(isLeadTodayTask)
      } else if (followUp === 'overdue') {
        result = result.filter(isLeadOverdue)
      }
    } else {
      // viewScope === 'all' -> Áp dụng bộ lọc phân bổ của Quản lý
      if (assignment === 'unassigned') {
        result = result.filter(isLeadUnassigned)
      } else if (assignment === 'assigned') {
        result = result.filter((l) => !isLeadUnassigned(l))
      }
    }

    // Áp dụng bộ lọc cơ sở từ Toolbar
    if (branch !== 'all') {
      result = result.filter((lead) => lead.branch === branch)
    }

    // Áp dụng bộ lọc nâng cao (Advanced Filters)
    if (advancedFilters.branches.length > 0) {
      result = result.filter((lead) => advancedFilters.branches.includes(lead.branch))
    }
    if (advancedFilters.sources.length > 0) {
      result = result.filter((lead) => advancedFilters.sources.includes(lead.source))
    }
    if (advancedFilters.subjects.length > 0) {
      result = result.filter((lead) =>
        advancedFilters.subjects.some((subj) =>
          (lead.targetSubject || '').toLowerCase().includes(subj.toLowerCase())
        )
      )
    }
    if (advancedFilters.assignees.length > 0) {
      result = result.filter((lead) => {
        const staff = lead.assignedTo?.trim() || 'Chưa phân bổ'
        return advancedFilters.assignees.includes(staff)
      })
    }
    if (advancedFilters.statuses.length > 0) {
      result = result.filter((lead) => {
        return advancedFilters.statuses.some((st) => {
          if (st === 'moi_tiep_nhan') return isMoiTiepNhanStatus(lead.status)
          if (st === 'dang_tu_van') return isDangTuVanStatus(lead.status)
          if (st === 'hen_trai_nghiem') return isHenTraiNghiemStatus(lead.status)
          if (st === 'cho_chot') return isChoChotStatus(lead.status)
          if (st === 'chuyen_doi') return isChuyenDoiStatus(lead.status)
          if (st === 'that_bai') return isThatBaiStatus(lead.status)
          if (st === 'tam_dung') return isTamDungStatus(lead.status)
          return lead.status === st
        })
      })
    } else {
      // Mặc định ở ngoài danh sách & tab Tất cả: Không hiển thị Lead Thất bại và Tạm dừng
      result = result.filter((lead) => !isInactiveLeadStatus(lead.status))
    }

    return result
  }, [customLeads, viewScope, branch, source, assignment, followUp, search, advancedFilters])

  // Filter group configuration for FilterGroupSheetPanel
  const filterGroups = useMemo<FilterGroupConfig[]>(() => {
    return [
      getSchoolFilterGroup(
        'branches',
        advancedFilters.branches,
        (b) => getLeads({ search }).filter((l) => l.branch === b).length,
        SYSTEM_BRANCHES
      ),
      createFilterGroup({
        id: 'statuses',
        title: 'Trạng thái Lead',
        options: [
          { value: 'moi_tiep_nhan', label: 'Mới tiếp nhận' },
          { value: 'dang_tu_van', label: 'Đang tư vấn' },
          { value: 'hen_trai_nghiem', label: 'Hẹn trải nghiệm' },
          { value: 'cho_chot', label: 'Chờ chốt deal' },
          { value: 'chuyen_doi', label: 'Đã chuyển đổi' },
          { value: 'that_bai', label: 'Thất bại' },
          { value: 'tam_dung', label: 'Tạm dừng' },
        ],
        selectedValues: advancedFilters.statuses,
        getOptionCount: (val) =>
          getLeads({ search }).filter((l) => {
            if (val === 'moi_tiep_nhan') return isMoiTiepNhanStatus(l.status)
            if (val === 'dang_tu_van') return isDangTuVanStatus(l.status)
            if (val === 'hen_trai_nghiem') return isHenTraiNghiemStatus(l.status)
            if (val === 'cho_chot') return isChoChotStatus(l.status)
            if (val === 'chuyen_doi') return isChuyenDoiStatus(l.status)
            if (val === 'that_bai') return isThatBaiStatus(l.status)
            if (val === 'tam_dung') return isTamDungStatus(l.status)
            return l.status === val
          }).length,
      }),
      createFilterGroup({
        id: 'sources',
        title: 'Nguồn Lead',
        options: [
          { value: 'facebook', label: 'Facebook Ads' },
          { value: 'hotline', label: 'Hotline/Tổng đài' },
          { value: 'event', label: 'Sự kiện / Workshop' },
          { value: 'referral', label: 'Giới thiệu (Referral)' },
          { value: 'website', label: 'Website / Form' },
        ],
        selectedValues: advancedFilters.sources,
        getOptionCount: (val) => getLeads({ search }).filter((l) => l.source === val).length,
      }),
      createFilterGroup({
        id: 'subjects',
        title: 'Khóa học quan tâm',
        options: [
          { value: 'superkids', label: 'SuperKids (Tiếng Anh thiếu nhi)' },
          { value: 'kindy', label: 'Kindy (Tiếng Anh mẫu giáo)' },
          { value: 'flyers', label: 'Luyện thi Flyers' },
          { value: 'starters', label: 'Luyện thi Starters' },
          { value: 'movers', label: 'Luyện thi Movers' },
          { value: 'ielts', label: 'Luyện thi IELTS' },
          { value: 'toán', label: 'Toán Tư Duy' },
        ],
        selectedValues: advancedFilters.subjects,
        getOptionCount: (val) =>
          getLeads({ search }).filter((l) =>
            (l.targetSubject || '').toLowerCase().includes(val.toLowerCase())
          ).length,
      }),
      createFilterGroup({
        id: 'assignees',
        title: 'Người phụ trách',
        options: [
          { value: 'Trần Thị Mai (Sales)', label: 'Trần Thị Mai (Sales)' },
          { value: 'Lê Hoàng Nam (Sales)', label: 'Lê Hoàng Nam (Sales)' },
          { value: 'Nguyễn Văn Hùng (Sales Manager)', label: 'Nguyễn Văn Hùng (Sales Manager)' },
          { value: 'Chưa phân bổ', label: 'Chưa phân bổ' },
        ],
        selectedValues: advancedFilters.assignees,
        getOptionCount: (val) =>
          getLeads({ search }).filter(
            (l) => (l.assignedTo?.trim() || 'Chưa phân bổ') === val
          ).length,
      }),
    ]
  }, [advancedFilters, search])

  const handleToggleFilter = (sectionId: string, value: string) => {
    setCurrentPage(1)
    if (sectionId === 'statuses') {
      setSelectedStatus('all')
      setSelectedSubStatus('all')
    }
    setAdvancedFilters((prev) => {
      const key = sectionId as keyof typeof prev
      const list = prev[key] || []
      const exists = list.includes(value)
      return {
        ...prev,
        [key]: exists ? list.filter((item) => item !== value) : [...list, value],
      }
    })
  }

  const handleClearAllFilters = () => {
    setAdvancedFilters({ branches: [], sources: [], subjects: [], assignees: [], statuses: [] })
    setCurrentPage(1)
  }

  // Calculate status tile counts dynamically based on current filters
  const tileCounts = useMemo(() => {
    return calculateStatusTileCounts(filteredLeads)
  }, [filteredLeads])

  // Sub-status options according to current main status
  const subStatusOptions = useMemo(() => {
    return SUB_STATUS_MAP[selectedStatus] || SUB_STATUS_MAP.all
  }, [selectedStatus])

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
    if (viewScope === 'my') {
      // Dải Tab Tác nghiệp cho Tư vấn viên (Action-driven / Worklist)
      return [
        { id: 'all', label: 'Tất cả', count: tileCounts.all, status: 'all' },
        { id: 'today_tasks', label: '⏰ Cần gọi hôm nay', count: tileCounts.today_tasks, status: 'today_tasks' },
        { id: 'overdue', label: '⚠️ Quá hạn', count: tileCounts.overdue, status: 'overdue' },
        { id: 'dang_tu_van', label: 'Đang tư vấn', count: tileCounts.dang_tu_van, status: 'dang_tu_van' },
        { id: 'hen_trai_nghiem', label: 'Lịch trải nghiệm', count: tileCounts.hen_trai_nghiem, status: 'hen_trai_nghiem' },
        { id: 'cho_chot', label: 'Chờ chốt deal', count: tileCounts.cho_chot, status: 'cho_chot' },
        { id: 'chuyen_doi', label: 'Đã chuyển đổi', count: tileCounts.chuyen_doi, status: 'chuyen_doi' },
      ]
    }

    // viewScope === 'all' -> Dải Tab Phễu & Điều phối cho Quản lý (Pipeline & Allocation)
    return [
      { id: 'all', label: 'Tất cả', count: tileCounts.all, status: 'all' },
      { id: 'unassigned', label: '👤 Chưa phân bổ', count: tileCounts.unassigned, status: 'unassigned' },
      { id: 'moi_tiep_nhan', label: 'Mới tiếp nhận', count: tileCounts.moi_tiep_nhan, status: 'moi_tiep_nhan' },
      { id: 'dang_tu_van', label: 'Đang tư vấn', count: tileCounts.dang_tu_van, status: 'dang_tu_van' },
      { id: 'hen_trai_nghiem', label: 'Đánh giá & Trải nghiệm', count: tileCounts.hen_trai_nghiem, status: 'hen_trai_nghiem' },
      { id: 'cho_chot', label: 'Chờ chốt deal', count: tileCounts.cho_chot, status: 'cho_chot' },
      { id: 'chuyen_doi', label: 'Đã chuyển đổi', count: tileCounts.chuyen_doi, status: 'chuyen_doi' },
    ]
  }, [tileCounts, viewScope])

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

      {/* DataTable stretching to bottom */}
      <div className="min-h-0 flex-1 overflow-hidden">
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
        />
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



      {/* Advanced Filter Sheet Panel */}
      <FilterGroupSheetPanel
        open={isFilterOpen}
        title="Bộ lọc Lead nâng cao"
        description="Lọc theo Cơ sở, Trạng thái (Thất bại, Tạm dừng), Nguồn tiếp nhận, Khóa học quan tâm và Người phụ trách."
        groups={filterGroups}
        onOpenChange={setIsFilterOpen}
        onToggle={handleToggleFilter}
        onClearAll={handleClearAllFilters}
      />
    </div>
  )
}
