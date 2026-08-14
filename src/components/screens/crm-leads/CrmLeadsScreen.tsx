'use client'

import { useState, useMemo } from 'react'
import { getLeads, Lead } from '@/mocks/crmLeads'
import { StatusTiles } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CrmLeadsToolbar } from './CrmLeadsToolbar'
import { CrmLeadsTable } from './CrmLeadsTable'
import { CrmLeadsDetailDialog } from './CrmLeadsDetailDialog'
import { calculateStatusTileCounts } from './crmLeadsHelpers'
import { SUB_STATUS_MAP } from './crmLeadsTypes'

const CURRENT_USER_STAFF = 'Trần Thị Mai (Sales)'

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

export function CrmLeadsScreen() {
  const [viewScope, setViewScope] = useState<'my' | 'all'>('my')
  const [source, setSource] = useState('all')
  const [assignment, setAssignment] = useState('all')
  const [followUp, setFollowUp] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedSubStatus, setSelectedSubStatus] = useState('all')
  const [isSubStatusOpen, setIsSubStatusOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // Dialog State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Sub-status options according to current main status
  const subStatusOptions = useMemo(() => {
    return SUB_STATUS_MAP[selectedStatus] || SUB_STATUS_MAP.all
  }, [selectedStatus])

  // Filter leads based on viewScope, source, assignment, followUp, search, selectedSubStatus
  const filteredLeads = useMemo(() => {
    let result = getLeads({ source, search })

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

    // Lọc theo sub-status nếu người dùng chọn cụ thể
    if (selectedSubStatus !== 'all') {
      result = result.filter((lead) => matchSubStatus(lead, selectedSubStatus))
    }

    return result
  }, [viewScope, source, assignment, followUp, search, selectedSubStatus])

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
      { id: 'that_bai', label: 'Thất bại', count: tileCounts.that_bai, status: 'that_bai' },
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
        viewScope={viewScope}
        onViewScopeChange={(scope) => {
          setViewScope(scope)
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
            <span className="text-[11px] font-bold text-muted-foreground uppercase px-1 shrink-0">
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
                      "inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-mono leading-none",
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
        />
      </div>

      {/* Detail Dialog */}
      <CrmLeadsDetailDialog
        lead={selectedLead}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  )
}
