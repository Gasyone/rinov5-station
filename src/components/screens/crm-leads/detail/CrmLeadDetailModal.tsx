'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Lead } from '@/mocks/crmLeads'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { STATUS_LABEL_MAP } from '../crmLeadsTypes'
import {
  Baby,
  Sparkles,
  Plus,
  GraduationCap,
  Clock,
  History,
  Receipt,
  Building2,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Subcomponents
import { CrmLeadPipelineStepper } from './CrmLeadPipelineStepper'
import { CrmLeadDropDialog } from './CrmLeadDropDialog'
import { CrmLeadProfileSidebar } from './CrmLeadProfileSidebar'
import { CrmLeadQuickCareCard } from './CrmLeadQuickCareCard'
import { CrmLeadTimelineTab } from './CrmLeadTimelineTab'
import { CrmLeadOpsHandoffTab } from './CrmLeadOpsHandoffTab'
import { CrmLeadTestTrialTab } from './CrmLeadTestTrialTab'
import { CrmLeadOrdersTab } from './CrmLeadOrdersTab'
import { CareInteraction, DropRecord, SalesCycle } from './crmLeadDetailTypes'

interface CrmLeadDetailModalProps {
  lead: Lead | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenCreateOrder?: (lead: Lead) => void
  onUpdateLead?: (updatedLead: Lead) => void
}

type TabKey = 'timeline' | 'test_trial' | 'orders' | 'ops_handoff'

export function CrmLeadDetailModal({
  lead: initialLead,
  open,
  onOpenChange,
  onOpenCreateOrder,
  onUpdateLead,
}: CrmLeadDetailModalProps) {
  const router = useRouter()
  const [currentLead, setCurrentLead] = useState<Lead | null>(initialLead)
  const [activeTab, setActiveTab] = useState<TabKey>('timeline')
  const [isDropOpen, setIsDropOpen] = useState(false)
  const [activeCycleId, setActiveCycleId] = useState<string>('cycle-001')

  useEffect(() => {
    if (initialLead) {
      setCurrentLead(initialLead)
      const defaultCycle =
        initialLead.currentCycleId ||
        initialLead.salesCycles?.[0]?.cycleId ||
        'cycle-001'
      setActiveCycleId(defaultCycle)
    }
  }, [initialLead])

  if (!currentLead) return null

  const birthYear = currentLead.birthYear ?? 2026 - currentLead.studentAge
  const cycles = currentLead.salesCycles || []
  const activeCycle = cycles.find((c) => c.cycleId === activeCycleId) || cycles[0]

  // Danh sách tương tác chăm sóc
  const interactions = currentLead.careInteractions || []

  // Xử lý chuyển chặng kế tiếp
  const handleAdvanceStage = () => {
    let nextStatus: Lead['status'] = currentLead.status
    if (currentLead.status === 'chua_tiep_can' || currentLead.status === 'moi_tiep_nhan') {
      nextStatus = 'dang_tu_van'
    } else if (currentLead.status === 'dang_cham_soc' || currentLead.status === 'dang_tu_van') {
      nextStatus = 'hen_trai_nghiem'
    } else if (currentLead.status === 'danh_gia_trai_nghiem' || currentLead.status === 'hen_trai_nghiem') {
      nextStatus = 'cho_chot'
    } else if (currentLead.status === 'tiem_nang' || currentLead.status === 'cho_chot') {
      nextStatus = 'chuyen_doi'
    }

    const updated = {
      ...currentLead,
      status: nextStatus,
    }
    setCurrentLead(updated)
    onUpdateLead?.(updated)
    toast.success(`Đã chuyển Lead sang chặng: ${STATUS_LABEL_MAP[nextStatus] ?? nextStatus}`)
  }

  // Xử lý xác nhận Báo rớt
  const handleConfirmDrop = (dropRecord: DropRecord) => {
    const droppedInteraction: CareInteraction = {
      id: `care-drop-${Date.now()}`,
      cycleId: activeCycleId,
      timestamp: dropRecord.droppedAt,
      staffName: dropRecord.droppedBy,
      channel: 'call',
      outcome: 'rejected',
      outcomeLabel: `Báo rớt (${dropRecord.reasonLabel})`,
      note: `Báo rớt tại ${dropRecord.stageLabel}. Lý do: ${dropRecord.reasonLabel}. ${dropRecord.note || ''}`,
      nextAppointment: dropRecord.reCareDate,
    }

    const updated: Lead = {
      ...currentLead,
      status: 'that_bai',
      dropRecord,
      careInteractions: [droppedInteraction, ...(currentLead.careInteractions || [])],
    }

    setCurrentLead(updated)
    onUpdateLead?.(updated)
    toast.error(`Đã báo rớt Lead tại ${dropRecord.stageLabel}: ${dropRecord.reasonLabel}`)
  }

  // Xử lý thêm biên bản tương tác mới
  const handleSaveInteraction = (newInteraction: CareInteraction) => {
    const updated: Lead = {
      ...currentLead,
      careInteractions: [newInteraction, ...(currentLead.careInteractions || [])],
    }
    setCurrentLead(updated)
    onUpdateLead?.(updated)
  }

  // Xử lý Tái kích hoạt chu kỳ bán mới (Win-back)
  const handleReactivateCycle = () => {
    const newCycleNumber = (currentLead.salesCycles?.length || 1) + 1
    const newCycleId = `cycle-reactivate-${Date.now()}`
    const newCycle: SalesCycle = {
      cycleId: newCycleId,
      cycleNumber: newCycleNumber,
      title: `Chu kỳ ${newCycleNumber} (Tái kích hoạt Win-back)`,
      status: 'active',
      startDate: '25/08/2026',
      assignedSales: currentLead.assignedTo || 'Trần Thị Mai (Sales)',
      outcomeNote: 'Học viên quay lại sau hơn 6 tháng không hoạt động.',
    }

    const reactivateLog: CareInteraction = {
      id: `care-reactivate-${Date.now()}`,
      cycleId: newCycleId,
      timestamp: '25/08/2026 15:30',
      staffName: currentLead.assignedTo || 'Trần Thị Mai (Sales)',
      channel: 'call',
      outcome: 'interested',
      outcomeLabel: 'Kích hoạt Chu kỳ Mới',
      note: `Học viên không hoạt động > 180 ngày. Đã mở Chu kỳ Bán thứ ${newCycleNumber} để tư vấn lộ trình tiếp nối.`,
    }

    const updated: Lead = {
      ...currentLead,
      status: 'moi_tiep_nhan',
      currentCycleId: newCycleId,
      salesCycles: [newCycle, ...(currentLead.salesCycles || [])],
      careInteractions: [reactivateLog, ...(currentLead.careInteractions || [])],
    }

    setCurrentLead(updated)
    setActiveCycleId(newCycleId)
    setActiveTab('timeline')
    onUpdateLead?.(updated)
    toast.success(`Đã kích hoạt Chu kỳ Bán mới (#${newCycleNumber}) thành công!`)
  }

  const isInactive = (currentLead.opsHandoff?.daysInactive ?? 0) >= 180 || currentLead.opsHandoff?.canReactivate

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl lg:max-w-6xl max-h-[92vh] overflow-y-auto p-4 sm:p-6">
          {/* HEADER */}
          <DialogHeader className="pr-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <Baby className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <span>{currentLead.studentName}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      ({currentLead.studentAge} tuổi - {birthYear})
                    </span>
                  </DialogTitle>
                  <div className="text-xs text-muted-foreground">
                    Mã Lead: <span className="font-mono font-medium text-foreground">{currentLead.code}</span> •
                    Phụ huynh: <span className="font-semibold text-foreground">{currentLead.parentName}</span>{' '}
                    {currentLead.parentRole ? `(${currentLead.parentRole})` : ''}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={getStatusBadgeClass(currentLead.status)}>
                  {STATUS_LABEL_MAP[currentLead.status] ?? currentLead.status}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          {/* MAIN CONTENT */}
          <div className="space-y-4 py-2">
            {/* 1. PIPELINE STEPPER & ACTION BAR */}
            <CrmLeadPipelineStepper
              lead={currentLead}
              onAdvanceStage={handleAdvanceStage}
              onOpenDropDialog={() => setIsDropOpen(true)}
              onOpenBookingTest={() => router.push(`/app/booking_test/create?leadId=${currentLead.id}`)}
              onOpenCreateOrder={() => onOpenCreateOrder?.(currentLead)}
            />

            {/* 2. TWO-COLUMN LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* CỘT TRÁI (35% = 4.2/12 cols): HỒ SƠ THỰC THỂ & CHU KỲ BÁN */}
              <div className="lg:col-span-4 space-y-4">
                <CrmLeadProfileSidebar
                  lead={currentLead}
                  activeCycleId={activeCycleId}
                  onCycleChange={setActiveCycleId}
                />
              </div>

              {/* CỘT PHẢI (65% = 7.8/12 cols): FORM TÁC NGHIỆP & TABS NỘI DUNG */}
              <div className="lg:col-span-8 space-y-4">
                {/* Form ghi nhận tương tác nhanh (Quick Care Logger) */}
                <CrmLeadQuickCareCard
                  cycleId={activeCycleId}
                  staffName={currentLead.assignedTo || 'Tư vấn viên'}
                  onSaveInteraction={handleSaveInteraction}
                />

                {/* TAB BAR NỘI DUNG */}
                <div className="border-b border-border/80 flex items-center gap-2 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('timeline')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer',
                      activeTab === 'timeline'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <History className="h-3.5 w-3.5" />
                    <span>Lịch sử chăm sóc ({interactions.filter((i) => i.cycleId === activeCycleId).length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('test_trial')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer',
                      activeTab === 'test_trial'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>Đánh giá & Học thử</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer',
                      activeTab === 'orders'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Receipt className="h-3.5 w-3.5" />
                    <span>Đơn hàng & Báo giá</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('ops_handoff')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer',
                      activeTab === 'ops_handoff'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground',
                      isInactive && 'text-amber-600 dark:text-amber-400'
                    )}
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Bàn giao Vận hành</span>
                    {isInactive && (
                      <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    )}
                  </button>
                </div>

                {/* TAB CONTENT PANELS */}
                <div className="min-h-[280px]">
                  {activeTab === 'timeline' && (
                    <CrmLeadTimelineTab
                      interactions={interactions}
                      activeCycleId={activeCycleId}
                      activeCycleTitle={activeCycle?.title}
                    />
                  )}

                  {activeTab === 'test_trial' && (
                    <CrmLeadTestTrialTab
                      lead={currentLead}
                      onOpenBookingTest={() => router.push(`/app/booking_test/create?leadId=${currentLead.id}`)}
                      onOpenTrialClass={() => router.push(`/app/trial_class/create?leadId=${currentLead.id}`)}
                    />
                  )}

                  {activeTab === 'orders' && (
                    <CrmLeadOrdersTab
                      lead={currentLead}
                      onOpenCreateOrder={onOpenCreateOrder}
                    />
                  )}

                  {activeTab === 'ops_handoff' && (
                    <CrmLeadOpsHandoffTab
                      lead={currentLead}
                      onReactivate={handleReactivateCycle}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL BÁO RỚT CHUẨN HÓA ĐIỂM RƠI */}
      <CrmLeadDropDialog
        lead={currentLead}
        open={isDropOpen}
        onOpenChange={setIsDropOpen}
        onConfirmDrop={handleConfirmDrop}
      />
    </>
  )
}
