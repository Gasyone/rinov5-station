'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/useUIStore'
import { Lead, mockLeads } from '@/mocks/crmLeads'
import {
  mockCareAlerts,
  type StudentCareAlert,
} from '@/mocks/careAlerts'

import { CrmLeadVerticalPipeline } from './CrmLeadVerticalPipeline'
import { CrmLeadDropDialog } from './CrmLeadDropDialog'
import { CrmLeadTestTrialTab } from './CrmLeadTestTrialTab'
import { CrmLeadOrdersTab } from './CrmLeadOrdersTab'
import { CrmLeadOpsHandoffTab } from './CrmLeadOpsHandoffTab'
import { CrmLeadCareSection } from './CrmLeadCareSection'
import { CrmLeadHeaderCard } from './CrmLeadHeaderCard'
import { CrmLeadOverviewTab } from './CrmLeadOverviewTab'
import { CrmLeadContactsTab } from './CrmLeadContactsTab'
import { CrmLeadFullProfileModal } from './CrmLeadFullProfileModal'
import { DropRecord, SalesCycle, CareInteraction } from './crmLeadDetailTypes'
import { STATUS_LABEL_MAP } from '../crmLeadsTypes'

interface CrmLeadDetailPageProps {
  leadId: string
  onBack: () => void
  onOpenCreateOrder?: (lead: Lead) => void
  onUpdateLead?: (updatedLead: Lead) => void
}

type LeftTabKey = 'overview' | 'contacts' | 'test_trial' | 'orders' | 'ops_handoff'

export function CrmLeadDetailPage({
  leadId,
  onBack,
  onOpenCreateOrder,
  onUpdateLead,
}: CrmLeadDetailPageProps) {
  const router = useRouter()
  const setCustomHeaderTitle = useUIStore((s) => s.setCustomHeaderTitle)

  // Quản lý ID Lead đang hiển thị chi tiết (Hỗ trợ đổi xem giữa các con trong gia đình)
  const [prevLeadId, setPrevLeadId] = useState<string>(leadId)
  const [activeLeadId, setActiveLeadId] = useState<string>(leadId)

  if (leadId !== prevLeadId) {
    setPrevLeadId(leadId)
    setActiveLeadId(leadId)
  }

  // Find lead in mock data or state
  const foundLead = useMemo(() => {
    return mockLeads.find((l) => l.id === activeLeadId || l.code === activeLeadId) || mockLeads[0]
  }, [activeLeadId])

  const [prevFoundLead, setPrevFoundLead] = useState<Lead>(foundLead)
  const [currentLead, setCurrentLead] = useState<Lead>(foundLead)
  const [activeTab, setActiveTab] = useState<LeftTabKey>('overview')
  const [isDropOpen, setIsDropOpen] = useState(false)
  const [isFullProfileOpen, setIsFullProfileOpen] = useState(false)
  const [fullProfileInitialAction, setFullProfileInitialAction] = useState<'view' | 'add_parent' | 'add_child'>('view')
  const [activeCycleId, setActiveCycleId] = useState<string>(
    foundLead.currentCycleId || foundLead.salesCycles?.[0]?.cycleId || 'cycle-001'
  )
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  if (foundLead !== prevFoundLead) {
    setPrevFoundLead(foundLead)
    setCurrentLead(foundLead)
    setActiveCycleId(
      foundLead.currentCycleId || foundLead.salesCycles?.[0]?.cycleId || 'cycle-001'
    )
  }

  // Set header title
  useEffect(() => {
    setCustomHeaderTitle(`Chi tiết Lead: ${currentLead.studentName} (${currentLead.code})`)
    return () => {
      setCustomHeaderTitle(null)
    }
  }, [setCustomHeaderTitle, currentLead])

  // Sync / Register Lead into mockCareAlerts so StudentCareChatFeed's updateCareAlertInteraction works seamlessly
  const studentCareAlert = useMemo<StudentCareAlert>(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    refreshTrigger // re-eval
    const found = mockCareAlerts.find(
      (a) => a.id === currentLead.id || a.studentId === currentLead.code
    )
    if (found) return found

    const newItem: StudentCareAlert = {
      id: currentLead.id,
      studentId: currentLead.code,
      customerCode: currentLead.parentId || 'CUST-001',
      studentName: currentLead.studentName,
      englishName: currentLead.studentName,
      startDate: currentLead.createdAt || '10/08/2026',
      subject: currentLead.targetSubject.toLowerCase().includes('toán')
        ? 'Toán tư duy'
        : 'Tiếng Anh',
      status: currentLead.status === 'chuyen_doi' ? 'Đang học' : 'Đang học',
      level: currentLead.initialLevel || 'Đang tư vấn',
      subLevel: `${currentLead.studentAge} tuổi`,
      classCode:
        currentLead.opsHandoff?.currentClass ||
        currentLead.trialClassName ||
        'Chưa xếp lớp',
      teacherCode: currentLead.testerTeacherName || 'Alex',
      schedule: currentLead.testDate || currentLead.trialDate || 'T7, 18:00',
      totalSessions: 24,
      remainingSessions: 24,
      expectedEndDate: '25/10/2026',
      attendanceRatio: currentLead.opsHandoff?.attendanceRate || '0/0',
      homeworkCompletion: 100,
      lastTestScore: currentLead.testScore
        ? Number(currentLead.testScore.replace(/\D/g, '')) || 85
        : 85,
      priorTestScore: 80,
      studentFolderLink: '',
      learningResultsLink: '',
      realtimeStatus: 'Đang học',
      csStaff: currentLead.assignedTo || 'Trần Thị Mai (Sales)',
      callConfirmation: 'Đã tương tác',
      interactionNotes: currentLead.lastNote || '',
      interactionLogs: (currentLead.careInteractions || []).map((ci) => ({
        id: ci.id,
        date: ci.timestamp.split(' ')[0] || '11/08/2026',
        staffName: ci.staffName,
        callConfirmation:
          ci.channel === 'call'
            ? 'Đã gọi'
            : ci.channel === 'zalo'
              ? 'Đã nhắn Zalo'
              : 'Đã gặp trực tiếp',
        notes: `[Kênh: ${ci.channel === 'call' ? 'Cuộc gọi' : ci.channel === 'zalo' ? 'Zalo' : 'Trực tiếp'}] [Kết quả: ${ci.outcomeLabel}] ${ci.note}`,
        parentOpinion: ci.nextAppointment
          ? `Hẹn gọi lại: ${ci.nextAppointment}`
          : undefined,
      })),
      completedCareTags: [],
    }
    mockCareAlerts.push(newItem)
    return newItem
  }, [currentLead, refreshTrigger])

  // Interaction save handler
  const handleSaveInteraction = (interaction: {
    channel: 'zalo' | 'telephone' | 'direct'
    outcome: string
    note: string
    parentFeedback: string
    callbackTime?: string
    closeCare?: boolean
  }) => {
    const channelType =
      interaction.channel === 'telephone'
        ? 'call'
        : interaction.channel === 'zalo'
          ? 'zalo'
          : 'direct'

    const outcomeLabels: Record<string, string> = {
      nghe_may: 'Nghe máy',
      khong_nghe: 'Không nghe máy',
      may_ban: 'Máy bận',
      da_nhan: 'Đã gửi tin nhắn',
      da_phan_hoi: 'Phụ huynh đã phản hồi',
      da_gap: 'Đã gặp',
      vang_mat: 'Vắng mặt',
    }

    const outcomeKey: CareInteraction['outcome'] =
      interaction.outcome === 'nghe_may' ||
      interaction.outcome === 'da_nhan' ||
      interaction.outcome === 'da_gap'
        ? 'interested'
        : interaction.outcome === 'khong_nghe' || interaction.outcome === 'may_ban'
          ? 'no_answer'
          : 'callback'

    const newInteraction: CareInteraction = {
      id: `ci-${Date.now()}`,
      cycleId: currentLead.currentCycleId || 'cycle-1',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      staffName: 'Trần Thị Mai (Sales)',
      channel: channelType,
      outcome: outcomeKey,
      outcomeLabel: outcomeLabels[interaction.outcome] || interaction.outcome,
      note: [
        interaction.note,
        interaction.parentFeedback ? `Ý kiến PH: "${interaction.parentFeedback}"` : '',
      ]
        .filter(Boolean)
        .join(' • '),
      nextAppointment: interaction.callbackTime,
    }

    const updatedLead: Lead = {
      ...currentLead,
      lastNote: newInteraction.note,
      careInteractions: [newInteraction, ...(currentLead.careInteractions || [])],
    }
    setCurrentLead(updatedLead)
    onUpdateLead?.(updatedLead)
    setRefreshTrigger((prev) => prev + 1)
  }

  // Stage Advancement
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

  // Chọn chặng từ Phễu vòng đời dọc
  const handleSelectStage = (status: Lead['status'], subStatus?: string) => {
    const updated: Lead = {
      ...currentLead,
      status,
      subStatus: subStatus || currentLead.subStatus,
    }
    setCurrentLead(updated)
    onUpdateLead?.(updated)
    toast.success(
      `Đã cập nhật chặng: ${STATUS_LABEL_MAP[status] ?? status}${subStatus ? ` (${subStatus})` : ''}`
    )
  }

  // Drop Confirmation
  const handleConfirmDrop = (dropRecord: DropRecord) => {
    const updated: Lead = {
      ...currentLead,
      status: 'that_bai',
      dropRecord,
    }
    setCurrentLead(updated)
    onUpdateLead?.(updated)
    toast.error(`Đã báo rớt Lead tại ${dropRecord.stageLabel}: ${dropRecord.reasonLabel}`)
  }

  // Reactivate 6-month Inactive Student
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

    const updated: Lead = {
      ...currentLead,
      status: 'moi_tiep_nhan',
      currentCycleId: newCycleId,
      salesCycles: [newCycle, ...(currentLead.salesCycles || [])],
    }

    setCurrentLead(updated)
    setActiveCycleId(newCycleId)
    onUpdateLead?.(updated)
    toast.success(`Đã kích hoạt Chu kỳ Bán mới (#${newCycleNumber}) thành công!`)
  }

  const handleUpdateNote = (newNote: string) => {
    const updated = { ...currentLead, lastNote: newNote }
    setCurrentLead(updated)
    onUpdateLead?.(updated)
  }

  const handleSaveFullProfile = (updated: Lead) => {
    setCurrentLead(updated)
    onUpdateLead?.(updated)
  }

  const isInactive =
    (currentLead.opsHandoff?.daysInactive ?? 0) >= 180 || currentLead.opsHandoff?.canReactivate

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      {/* DIRECT SPLIT 2-PANEL WORKSTATION LAYOUT (BỎ 2 DÒNG TRÊN CÙNG) */}
      <div className="flex-1 min-h-0 pt-2 pb-2 pl-2.5 lg:pl-3 pr-0 flex flex-col">
        <div className="flex-1 flex flex-col lg:flex-row gap-2.5 min-h-0 overflow-hidden">
          {/* PANEL TRÁI: (Hồ sơ học viên & Các Tab thông tin chuyên sâu) */}
          <main className="flex-1 min-w-0 flex flex-col min-h-0 overflow-y-auto pr-1 scrollbar-thin space-y-2.5">
            {/* 1. SECTION THÔNG TIN HỌC VIÊN */}
            <CrmLeadHeaderCard
              lead={currentLead}
              onBack={onBack}
              onOpenDetailModal={() => setIsFullProfileOpen(true)}
              onUpdateNote={handleUpdateNote}
            />

            {/* 2. THANH 5 TABS (NGAY DƯỚI SECTION THÔNG TIN HỌC VIÊN) */}
            <div className="shrink-0">
              <div className="w-full bg-slate-100 dark:bg-zinc-800/90 p-1 rounded-xl flex items-center gap-1 border border-slate-200 dark:border-zinc-700 select-none">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={cn(
                    'flex-1 h-8 px-2.5 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-1 font-semibold whitespace-nowrap',
                    activeTab === 'overview'
                      ? 'bg-white dark:bg-zinc-900 text-foreground dark:text-white shadow-xs border border-slate-200/80 dark:border-zinc-700 font-bold'
                      : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-200/70'
                  )}
                >
                  <span>Tổng quan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('contacts')}
                  className={cn(
                    'flex-1 h-8 px-2.5 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-1 font-semibold whitespace-nowrap',
                    activeTab === 'contacts'
                      ? 'bg-white dark:bg-zinc-900 text-foreground dark:text-white shadow-xs border border-slate-200/80 dark:border-zinc-700 font-bold'
                      : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-200/70'
                  )}
                >
                  <span>Chân dung 360°</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('test_trial')}
                  className={cn(
                    'flex-1 h-8 px-2.5 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-1 font-semibold whitespace-nowrap',
                    activeTab === 'test_trial'
                      ? 'bg-white dark:bg-zinc-900 text-foreground dark:text-white shadow-xs border border-slate-200/80 dark:border-zinc-700 font-bold'
                      : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-200/70'
                  )}
                >
                  <span>Test & Thử</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className={cn(
                    'flex-1 h-8 px-2.5 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-1 font-semibold whitespace-nowrap',
                    activeTab === 'orders'
                      ? 'bg-white dark:bg-zinc-900 text-foreground dark:text-white shadow-xs border border-slate-200/80 dark:border-zinc-700 font-bold'
                      : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-200/70'
                  )}
                >
                  <span>Đơn hàng</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('ops_handoff')}
                  className={cn(
                    'flex-1 h-8 px-2.5 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-1 font-semibold whitespace-nowrap',
                    activeTab === 'ops_handoff'
                      ? 'bg-white dark:bg-zinc-900 text-foreground dark:text-white shadow-xs border border-slate-200/80 dark:border-zinc-700 font-bold'
                      : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-200/70',
                    isInactive && 'text-amber-600 dark:text-amber-400 font-bold'
                  )}
                >
                  <span>Vận hành</span>
                  {isInactive && <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse ml-0.5" />}
                </button>
              </div>
            </div>

            {/* 3. NỘI DUNG TAB ĐANG CHỌN */}
            <div className="flex-1 min-h-0 pt-1">
              {activeTab === 'overview' && (
                <CrmLeadOverviewTab
                  lead={currentLead}
                  activeCycleId={activeCycleId}
                  onCycleChange={setActiveCycleId}
                  onOpenDetailModal={() => setIsFullProfileOpen(true)}
                />
              )}

              {activeTab === 'contacts' && (
                <CrmLeadContactsTab
                  lead={currentLead}
                  onAddParent={() => {
                    setFullProfileInitialAction('add_parent')
                    setIsFullProfileOpen(true)
                  }}
                  onAddChild={() => {
                    setFullProfileInitialAction('add_child')
                    setIsFullProfileOpen(true)
                  }}
                  onOpenFullProfile={() => {
                    setFullProfileInitialAction('view')
                    setIsFullProfileOpen(true)
                  }}
                  onSwitchLead={(newLeadId) => {
                    setActiveLeadId(newLeadId)
                    router.push(`/app/crm_leads/${newLeadId}`)
                  }}
                />
              )}

              {activeTab === 'test_trial' && (
                <CrmLeadTestTrialTab
                  lead={currentLead}
                  activeCycleId={activeCycleId}
                  onOpenBookingTest={() =>
                    router.push(`/app/booking_test/create?leadId=${currentLead.id}`)
                  }
                  onOpenTrialClass={() =>
                    router.push(`/app/trial_class/create?leadId=${currentLead.id}`)
                  }
                  onSelectTrialSession={(session) =>
                    router.push(
                      `/app/trial_class/create?leadId=${currentLead.id}&classId=${session.classCode}&date=${session.date}`
                    )
                  }
                />
              )}

              {activeTab === 'orders' && (
                <CrmLeadOrdersTab lead={currentLead} onOpenCreateOrder={onOpenCreateOrder} />
              )}

              {activeTab === 'ops_handoff' && (
                <CrmLeadOpsHandoffTab lead={currentLead} onReactivate={handleReactivateCycle} />
              )}
            </div>
          </main>

          {/* PANEL PHẢI: (Phễu Vòng đời & Cụm Chăm sóc) */}
          <aside className="w-full lg:w-[650px] xl:w-[700px] 2xl:w-[750px] shrink-0 flex flex-col min-h-0 overflow-y-auto pr-1.5 scrollbar-thin space-y-2.5">
            {/* 1. PHỄU VÒNG ĐỜI DẠNG DỌC (Đồng bộ chuẩn lead_lifecycle_config) */}
            <CrmLeadVerticalPipeline
              lead={currentLead}
              onSelectStage={handleSelectStage}
              onAdvanceStage={handleAdvanceStage}
              onOpenDropDialog={() => setIsDropOpen(true)}
            />

            {/* 2. CỤM CHĂM SÓC (LIÊN HỆ, GHI CHÚ NHANH, ĐANG XỬ LÝ) */}
            <div className="rounded-2xl border border-sky-200/80 dark:border-sky-900/60 bg-card p-3 shadow-xs text-left">
              <CrmLeadCareSection
                lead={currentLead}
                studentCareAlert={studentCareAlert}
                onSaveInteraction={handleSaveInteraction}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* MODAL BÁO RỚT CHUẨN HÓA ĐIỂM RƠI */}
      <CrmLeadDropDialog
        lead={currentLead}
        open={isDropOpen}
        onOpenChange={setIsDropOpen}
        onConfirmDrop={handleConfirmDrop}
      />

      {/* MODAL CHI TIẾT TOÀN BỘ HỒ SƠ TẠO KHÁCH HÀNG (Ảnh 1) */}
      <CrmLeadFullProfileModal
        open={isFullProfileOpen}
        onOpenChange={setIsFullProfileOpen}
        lead={currentLead}
        initialAction={fullProfileInitialAction}
        onSave={handleSaveFullProfile}
      />
    </div>
  )
}
