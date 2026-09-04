'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getLeads, Lead } from '@/mocks/crmLeads'
import { StatusTiles } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FilterGroupSheetPanel, type FilterGroupConfig, createFilterGroup, getSchoolFilterGroup } from '@/components/filters'
import { CrmLeadsToolbar } from './CrmLeadsToolbar'
import { CrmLeadsTable } from './CrmLeadsTable'
import { CrmLeadsDetailDialog } from './CrmLeadsDetailDialog'
import { CrmCustomerCreateDialog } from './CrmCustomerCreateDialog'
import { DraftOrderEditorDialog } from '@/components/screens/care/draft-order/DraftOrderEditorDialog'
import type { DetailedOrder } from '@/components/screens/care/student-orders/studentOrdersTypes'
import { formatCurrency } from '@/lib/format'
import { calculateStatusTileCounts } from './crmLeadsHelpers'
import { SUB_STATUS_MAP } from './crmLeadsTypes'

const CURRENT_USER_STAFF = 'Trần Thị Mai (Sales)'

interface CrmLeadsScreenProps {
  defaultViewScope?: 'my' | 'all'
}

function matchSubStatus(lead: Lead, subStatusId: string): boolean {
  if (subStatusId === 'all') return true
  const note = (lead.lastNote || '').toLowerCase()
  const subj = (lead.targetSubject || '').toLowerCase()
  const level = (lead.testResultLevel || '').toLowerCase()

  switch (subStatusId) {
    case 'chua_co_sale':
      return !lead.assignedTo || lead.assignedTo === 'Chưa phân bổ' || lead.assignedTo.trim() === ''
    case 'da_phan_sale':
      return Boolean(lead.assignedTo && lead.assignedTo.trim() !== '' && lead.assignedTo !== 'Chưa phân bổ')
    case 'goi_lan_1':
      return note.includes('gọi lần 1')
    case 'goi_lan_2':
      return note.includes('gọi lần 2')
    case 'hen_goi_lai':
      return note.includes('hẹn gọi lại')
    case 'test_tuan_nay':
      return lead.testStatus === 'scheduled'
    case 'chua_giao_gv':
      return note.includes('chưa giao gv')
    case 'da_xac_nhan':
      return note.includes('xác nhận')
    case 'dat_superkids':
      return level.includes('superkids')
    case 'dat_flyers':
      return level.includes('flyers')
    case 'dat_kindy':
      return level.includes('kindy') || subj.includes('kindy')
    case 'giu_cho_24h':
      return note.includes('giữ chỗ')
    case 'cho_chuyen_khoan':
      return note.includes('chuyển khoản')
    case 'hen_nop_tien_mat':
      return note.includes('tiền mặt')
    case 'da_thu_100':
      return note.includes('100%')
    case 'da_thu_coc':
      return note.includes('cọc')
    case 'no_show':
      return lead.testStatus === 'no_show' || lead.trialStatus === 'no_show' || note.includes('vắng test')
    case 'khong_nghe_may':
      return note.includes('không nghe máy')
    case 'sai_so':
      return note.includes('sai số')
    case 'nha_xa':
      return note.includes('nhà xa')
    case 'che_phi_cao':
      return note.includes('chê học phí cao')
    default:
      return lead.status === subStatusId
  }
}

export function CrmLeadsScreen({ defaultViewScope = 'all' }: CrmLeadsScreenProps) {
  const [viewScope] = useState<'my' | 'all'>(defaultViewScope)
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

  // Dialog State
  const router = useRouter()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
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
      setEditingOrder({
        id: lead.orderCode,
        orderNo: lead.orderCode,
        studentId: lead.id,
        studentName: lead.studentName,
        items: [
          {
            productId: 'P-001',
            productName: lead.expectedPackage || 'Gói học tiêu chuẩn',
            quantity: 1,
            unitPrice: parsedAmount || 8400000,
            subtotal: parsedAmount || 8400000,
          },
        ],
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
        detailedItems: [
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
        ],
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
      orderStatus: newOrder.paymentStatus === 'paid' ? 'paid' : 'draft',
      expectedAmount: formatCurrency(newOrder.finalAmount),
      expectedPackage:
        newOrder.items?.[0]?.productName ||
        newOrder.detailedItems?.[0]?.productName ||
        orderModalLead.expectedPackage ||
        'Gói học tiêu chuẩn',
      paymentTerm: newOrder.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : 'Tiền mặt',
      status:
        orderModalLead.status === 'chua_tiep_can' || orderModalLead.status === 'dang_cham_soc'
          ? 'tiem_nang'
          : orderModalLead.status,
    }

    setCustomLeads((prev) => {
      const exists = prev.some((l) => l.id === updatedLead.id)
      if (exists) {
        return prev.map((l) => (l.id === updatedLead.id ? updatedLead : l))
      }
      return [updatedLead, ...prev]
    })

    setSelectedLead((prev) => (prev?.id === updatedLead.id ? updatedLead : prev))
    setIsOrderModalOpen(false)
    setOrderModalLead(null)
    setEditingOrder(null)
  }

  // Sub-status options according to current main status
  const subStatusOptions = useMemo(() => {
    return SUB_STATUS_MAP[selectedStatus] || SUB_STATUS_MAP.all
  }, [selectedStatus])

  // Count active advanced filters
  const activeFilterCount =
    advancedFilters.branches.length +
    advancedFilters.sources.length +
    advancedFilters.subjects.length +
    advancedFilters.assignees.length +
    advancedFilters.statuses.length

  // Filter leads based on viewScope, source, assignment, followUp, search, selectedSubStatus, advancedFilters
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
        result = result.filter(
          (lead) => lead.status === 'danh_gia_trai_nghiem' || lead.status === 'dang_cham_soc'
        )
      } else if (followUp === 'overdue') {
        result = result.filter(
          (lead) => lead.status === 'chua_tiep_can' || lead.testStatus === 'no_show'
        )
      }
    } else {
      // viewScope === 'all' -> Áp dụng bộ lọc phân bổ của Quản lý
      if (assignment === 'unassigned') {
        result = result.filter(
          (lead) => !lead.assignedTo || lead.assignedTo.trim() === '' || lead.assignedTo === 'Chưa phân bổ'
        )
      } else if (assignment === 'assigned') {
        result = result.filter(
          (lead) => lead.assignedTo && lead.assignedTo.trim() !== '' && lead.assignedTo !== 'Chưa phân bổ'
        )
      }
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
      result = result.filter((lead) => advancedFilters.statuses.includes(lead.status))
    } else {
      // Mặc định ở màn hình chỉ hiển thị các lead đang xử lý (không hiển thị thất bại)
      result = result.filter((lead) => lead.status !== 'that_bai')
    }

    // Lọc theo sub-status nếu người dùng chọn cụ thể
    if (selectedSubStatus !== 'all') {
      result = result.filter((lead) => matchSubStatus(lead, selectedSubStatus))
    }

    return result
  }, [customLeads, viewScope, source, assignment, followUp, search, selectedSubStatus, advancedFilters])

  // Filter group configuration for FilterGroupSheetPanel
  const filterGroups = useMemo<FilterGroupConfig[]>(() => {
    return [
      getSchoolFilterGroup(
        'branches',
        advancedFilters.branches,
        (branch) => getLeads({ search }).filter((l) => l.branch === branch).length
      ),
      createFilterGroup({
        id: 'statuses',
        title: 'Trạng thái Lead',
        options: [
          { value: 'chua_tiep_can', label: 'Chưa tiếp cận' },
          { value: 'dang_cham_soc', label: 'Đang chăm sóc' },
          { value: 'danh_gia_trai_nghiem', label: 'Đánh giá & Trải nghiệm' },
          { value: 'tiem_nang', label: 'Tiềm năng' },
          { value: 'chuyen_doi', label: 'Đã chuyển đổi' },
          { value: 'that_bai', label: 'Thất bại' },
        ],
        selectedValues: advancedFilters.statuses,
        getOptionCount: (val) =>
          getLeads({ search }).filter((l) => l.status === val).length,
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

  // Final list filtered by selected status tile
  const displayLeads = useMemo(() => {
    if (selectedStatus === 'all') return filteredLeads
    return filteredLeads.filter((item) => item.status === selectedStatus)
  }, [filteredLeads, selectedStatus])

  // Tính toán số lượng đếm động chính xác 100% cho từng Sub-status chip
  const subStatusCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    const baseLeads = selectedStatus === 'all'
      ? filteredLeads
      : filteredLeads.filter((item) => item.status === selectedStatus)

    subStatusOptions.forEach((subOpt) => {
      if (subOpt.id === 'all') {
        counts[subOpt.id] = baseLeads.length
      } else {
        counts[subOpt.id] = baseLeads.filter((lead) => matchSubStatus(lead, subOpt.id)).length
      }
    })

    return counts
  }, [subStatusOptions, filteredLeads, selectedStatus])

  const statusTilesData = useMemo(() => {
    return [
      { id: 'all', label: 'Tất cả', count: tileCounts.all, status: 'all' },
      { id: 'chua_tiep_can', label: 'Chưa tiếp cận', count: tileCounts.chua_tiep_can, status: 'chua_tiep_can' },
      { id: 'dang_cham_soc', label: 'Đang chăm sóc', count: tileCounts.dang_cham_soc, status: 'dang_cham_soc' },
      { id: 'danh_gia_trai_nghiem', label: 'Đánh giá & Trải nghiệm', count: tileCounts.danh_gia_trai_nghiem, status: 'danh_gia_trai_nghiem' },
      { id: 'tiem_nang', label: 'Tiềm năng', count: tileCounts.tiem_nang, status: 'tiem_nang' },
      { id: 'chuyen_doi', label: 'Đã chuyển đổi', count: tileCounts.chuyen_doi, status: 'chuyen_doi' },
    ]
  }, [tileCounts])

  const handleTileSelect = (tileId: string) => {
    setSelectedStatus(tileId)
    setSelectedSubStatus('all') // Reset sub-status khi chọn trạng thái chính mới
    setCurrentPage(1)
  }

  const handleViewDetail = (lead: Lead) => {
    setSelectedLead(lead)
    setIsDetailOpen(true)
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3 lg:p-4 bg-background">
      {/* Toolbar */}
      <CrmLeadsToolbar
        leads={filteredLeads}
        viewScope={viewScope}
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

      {/* Dải Status Tiles + Nút Mở Rộng Trạng Thái Phụ */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
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
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Lọc phụ</span>
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isSubStatusOpen && "rotate-180")} />
          </Button>
        </div>

        {/* Thanh Lọc Trạng Thái Phụ Mở Rộng (Sub-status Filter Chips Bar với Số Đếm Đảm Bảo > 0) */}
        {isSubStatusOpen && (
          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-muted/40 rounded-lg border border-border/60 text-xs animate-in fade-in duration-150">
            <span className="text-xs font-bold text-muted-foreground uppercase px-1 shrink-0">
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
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
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
                      "inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-xs font-mono leading-none",
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground font-bold"
                        : "bg-muted text-muted-foreground font-medium"
                    )}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

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
        totalOrdersCount={contactProfileLead?.orderStatus === 'paid' ? 1 : 0}
        totalOrdersAmount={contactProfileLead?.orderStatus === 'paid' ? '15.000.000đ' : '0đ'}
        onSubmit={(updatedLeads) => {
          setCustomLeads((prev) => [...updatedLeads, ...prev])
          toast.success('Đã cập nhật thông tin hồ sơ liên hệ thành công!')
        }}
      />

      {/* Detail Dialog */}
      <CrmLeadsDetailDialog
        lead={selectedLead}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onOpenCreateOrder={handleOpenCreateOrder}
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
        description="Lọc theo Cơ sở, Nguồn tiếp nhận, Khóa học quan tâm và Người phụ trách."
        groups={filterGroups}
        onOpenChange={setIsFilterOpen}
        onToggle={handleToggleFilter}
        onClearAll={handleClearAllFilters}
      />
    </div>
  )
}
