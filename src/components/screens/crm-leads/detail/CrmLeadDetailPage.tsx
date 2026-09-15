'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/useUIStore'
import { Lead, mockLeads, updateLead } from '@/mocks/crmLeads'
import {
  mockCareAlerts,
  type StudentCareAlert,
} from '@/mocks/careAlerts'

import { Headset, ShoppingCart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { BookingTestCreateDialog, type BookingTestInitialData } from '@/components/screens/booking-test/BookingTestCreateDialog'
import type { BookingTest } from '@/mocks/bookingTests'
import { TrialClassCreateDialog } from '@/components/screens/trial-class/TrialClassCreateDialog'
import type { CreateTrialClassForm } from '@/components/screens/trial-class/trialClassTypes'
import { checkLeadHasBooking } from './leadContactsHelper'
import { mapLeadToDetailedOrders } from './leadOrderMapper'

import { CrmLeadVerticalPipeline } from './CrmLeadVerticalPipeline'
import { CrmLeadDropDialog } from './CrmLeadDropDialog'
import { CrmLeadOrdersTab } from './CrmLeadOrdersTab'
import { CrmLeadCareSection } from './CrmLeadCareSection'
import { CrmLeadHeaderCard } from './CrmLeadHeaderCard'
import { CrmLeadContactsTab } from './CrmLeadContactsTab'
import { CrmLeadFullProfileModal } from './CrmLeadFullProfileModal'
import { CrmLeadReturningHistoryModal } from './CrmLeadReturningHistoryModal'
import { DropRecord, CareInteraction, SalesCycle } from './crmLeadDetailTypes'
import { STATUS_LABEL_MAP } from '../crmLeadsTypes'

interface CrmLeadDetailPageProps {
  leadId: string
  onBack: () => void
  onOpenCreateOrder?: (lead: Lead) => void
  onUpdateLead?: (updatedLead: Lead) => void
}

type RightTabKey = 'care' | 'orders'

export function CrmLeadDetailPage({
  leadId,
  onBack,
  onOpenCreateOrder,
  onUpdateLead,
}: CrmLeadDetailPageProps) {
  const router = useRouter()
  const pathname = usePathname()
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
  const [rightTab, setRightTab] = useState<RightTabKey>('care')
  const [isDropOpen, setIsDropOpen] = useState(false)
  const [isFullProfileOpen, setIsFullProfileOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [fullProfileInitialAction, setFullProfileInitialAction] = useState<'view' | 'add_parent' | 'add_child'>('view')
  const [, setActiveCycleId] = useState<string>(
    foundLead.currentCycleId || foundLead.salesCycles?.[0]?.cycleId || 'cycle-001'
  )
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [activeParentPersona, setActiveParentPersona] = useState<string | null>(null)

  // Booking Dialogs state
  const [isBookingTestOpen, setIsBookingTestOpen] = useState(false)
  const [isTrialClassOpen, setIsTrialClassOpen] = useState(false)

  const [trialForm, setTrialForm] = useState<CreateTrialClassForm>({
    studentId: foundLead.id,
    studentName: foundLead.studentName,
    school: foundLead.branch || 'RinoEdu Linh Đàm',
    program: foundLead.targetSubject || 'Tiếng Anh',
    subject: foundLead.targetSubject.toLowerCase().includes('toán') ? 'Toán' : 'Tiếng Anh',
    notes: foundLead.lastNote || '',
    selectedSessions: [],
  })

  if (foundLead !== prevFoundLead) {
    setPrevFoundLead(foundLead)
    setCurrentLead(foundLead)
    setActiveCycleId(
      foundLead.currentCycleId || foundLead.salesCycles?.[0]?.cycleId || 'cycle-001'
    )
    setActiveParentPersona(null)
    setTrialForm((prev) => ({
      ...prev,
      studentId: foundLead.id,
      studentName: foundLead.studentName,
      school: foundLead.branch || 'RinoEdu Linh Đàm',
      program: foundLead.targetSubject || 'Tiếng Anh',
      subject: foundLead.targetSubject.toLowerCase().includes('toán') ? 'Toán' : 'Tiếng Anh',
      notes: foundLead.lastNote || '',
    }))
  }

  const hasBooking = useMemo(() => checkLeadHasBooking(currentLead), [currentLead])
  const orders = useMemo(() => {
    return mapLeadToDetailedOrders(currentLead, mockLeads)
  }, [currentLead])
  const ordersCount = orders.length

  // Set header title
  useEffect(() => {
    if (hasBooking) {
      setCustomHeaderTitle(`Chi tiết Lead: ${currentLead.studentName} (${currentLead.code})`)
    } else {
      setCustomHeaderTitle(`Chi tiết Lead: ${currentLead.parentName || currentLead.code} (${currentLead.code})`)
    }
    return () => {
      setCustomHeaderTitle(null)
    }
  }, [setCustomHeaderTitle, currentLead, hasBooking])

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

  const handleUpdateNote = (newNote: string) => {
    const updated = { ...currentLead, lastNote: newNote }
    setCurrentLead(updated)
    onUpdateLead?.(updated)
  }

  const handleSaveFullProfile = (updated: Lead) => {
    setCurrentLead(updated)
    onUpdateLead?.(updated)
  }

  const handleReactivateCycle = () => {
    const cycleCount = (currentLead.salesCycles?.length || 1) + 1
    const newCycleId = `cycle-${Date.now()}`
    const newCycle: SalesCycle = {
      cycleId: newCycleId,
      cycleNumber: cycleCount,
      title: `Đợt ${cycleCount} (${new Date().toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })} - Tái tiếp cận)`,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      assignedSales: currentLead.assignedTo || 'Trần Thị Mai (Sales)',
    }

    const updatedLead: Lead = {
      ...currentLead,
      status: 'moi_tiep_nhan',
      subStatus: 'Tái tiếp cận',
      isReturningLead: true,
      currentCycleId: newCycleId,
      salesCycles: [newCycle, ...(currentLead.salesCycles || [])],
      createdAt: new Date().toISOString().split('T')[0],
      lastNote: `[Tái kích hoạt #${cycleCount}]: Mở chăm sóc tiếp cận mới cho học viên.`,
    }

    setCurrentLead(updatedLead)
    onUpdateLead?.(updatedLead)
    toast.success(`Đã kích hoạt tái tiếp cận cho học viên ${currentLead.studentName}!`)
  }

  const bookingInitialData: BookingTestInitialData = useMemo(() => ({
    parentName: currentLead.parentName,
    phone: currentLead.phone,
    childName: currentLead.studentName,
    school: currentLead.branch || 'RinoEdu Linh Đàm',
    program: currentLead.targetSubject,
    notes: currentLead.lastNote,
  }), [currentLead])

  const handleBookingTestSubmit = (newBooking: BookingTest) => {
    const updatedLead: Lead = {
      ...currentLead,
      studentName: newBooking.childName || currentLead.studentName,
      testStatus: 'scheduled',
      testDate: newBooking.testTime.split(' ')[0] || new Date().toISOString().split('T')[0],
      testTime: newBooking.testTime.split(' ')[1] || '18:00',
      testerTeacherName: newBooking.teacher || 'Thầy Alex',
      branch: newBooking.school || currentLead.branch,
      status:
        currentLead.status === 'moi_tiep_nhan' || currentLead.status === 'chua_tiep_can'
          ? 'danh_gia_trai_nghiem'
          : currentLead.status,
    }
    setCurrentLead(updatedLead)
    updateLead(currentLead.id, updatedLead)
    onUpdateLead?.(updatedLead)
    setIsBookingTestOpen(false)
    toast.success(`Đã đặt lịch đánh giá thành công cho học viên ${updatedLead.studentName}!`)
  }

  const handleTrialClassSubmit = () => {
    const session = trialForm.selectedSessions[0]
    const updatedLead: Lead = {
      ...currentLead,
      studentName: trialForm.studentName || currentLead.studentName,
      trialStatus: 'scheduled',
      trialClassName: session?.className || 'Lớp chờ ghép',
      trialDate: session?.trialDate || new Date().toISOString().split('T')[0],
      trialTime: session?.sessionName || '18:00',
      branch: trialForm.school || currentLead.branch,
      status:
        currentLead.status === 'moi_tiep_nhan' || currentLead.status === 'chua_tiep_can'
          ? 'danh_gia_trai_nghiem'
          : currentLead.status,
    }
    setCurrentLead(updatedLead)
    updateLead(currentLead.id, updatedLead)
    onUpdateLead?.(updatedLead)
    setIsTrialClassOpen(false)
    toast.success(`Đã đặt lịch học thử thành công cho học viên ${updatedLead.studentName}!`)
  }

  const basePath = useMemo(() => {
    return pathname?.includes('crm_my_leads') ? '/app/crm_my_leads' : '/app/crm_leads'
  }, [pathname])

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      {/* DIRECT SPLIT 2-PANEL WORKSTATION LAYOUT (BỎ 2 DÒNG TRÊN CÙNG) */}
      <div className="flex-1 min-h-0 pt-2 pb-2 pl-2.5 lg:pl-3 pr-0 flex flex-col">
        <div className="flex-1 flex flex-col lg:flex-row gap-2.5 min-h-0 overflow-hidden">
          {/* PANEL TRÁI: (Hồ sơ học viên & Các Tab thông tin chuyên sâu) - 50% bề ngang */}
          <main className="w-full lg:w-1/2 lg:flex-1 min-w-0 flex flex-col min-h-0 overflow-y-auto pr-1 scrollbar-thin space-y-2.5">
            {/* 1. SECTION THÔNG TIN HỌC VIÊN */}
            <CrmLeadHeaderCard
              lead={currentLead}
              onBack={onBack}
              onOpenDetailModal={() => setIsFullProfileOpen(true)}
              onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
              onUpdateNote={handleUpdateNote}
              onUpdateLead={handleSaveFullProfile}
              onReactivateCycle={handleReactivateCycle}
              basePath={basePath}
            />

            {/* 2. NỘI DUNG CHÂN DUNG LEAD & HỌC VIÊN */}
            <div className="flex-1 min-h-0 pt-0.5">
              <CrmLeadContactsTab
                lead={currentLead}
                basePath={basePath}
                activeParentName={activeParentPersona}
                onSwitchParentPersona={setActiveParentPersona}
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
                  router.push(`${basePath}/${newLeadId}`)
                }}
                onUpdateLead={handleSaveFullProfile}
                onOpenBookingTest={() => setIsBookingTestOpen(true)}
                onOpenTrialClass={() => setIsTrialClassOpen(true)}
              />
            </div>
          </main>

          {/* PANEL PHẢI: (Tab Chăm sóc bán hàng & Tab Đơn hàng) - 50% bề ngang */}
          <aside className="w-full lg:w-1/2 lg:flex-1 min-w-0 flex flex-col min-h-0 overflow-y-auto pr-1.5 scrollbar-thin space-y-2.5">
            {/* THANH TABS PANEL PHẢI: CHĂM SÓC BÁN HÀNG / ĐƠN HÀNG */}
            <div className="shrink-0 bg-slate-100 dark:bg-zinc-800/90 p-1 rounded-xl flex items-center gap-1 border border-slate-200 dark:border-zinc-700 select-none">
              <button
                type="button"
                onClick={() => setRightTab('care')}
                className={cn(
                  'flex-1 h-8 px-2.5 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 font-medium whitespace-nowrap',
                  rightTab === 'care'
                    ? 'bg-white dark:bg-zinc-900 text-foreground dark:text-white shadow-xs border border-slate-200/80 dark:border-zinc-700 font-bold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-foreground hover:bg-slate-200/60 dark:hover:bg-zinc-700/60'
                )}
              >
                <Headset className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Chăm sóc bán hàng</span>
              </button>

              <button
                type="button"
                onClick={() => setRightTab('orders')}
                className={cn(
                  'flex-1 h-8 px-2.5 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 font-medium whitespace-nowrap',
                  rightTab === 'orders'
                    ? 'bg-white dark:bg-zinc-900 text-foreground dark:text-white shadow-xs border border-slate-200/80 dark:border-zinc-700 font-bold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-foreground hover:bg-slate-200/60 dark:hover:bg-zinc-700/60'
                )}
              >
                <ShoppingCart className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Đơn hàng</span>
                {ordersCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="h-4.5 min-w-4.5 px-1 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-0"
                  >
                    {ordersCount}
                  </Badge>
                )}
              </button>
            </div>

            {rightTab === 'care' && (
              <>
                {/* 1. PHỄU VÒNG ĐỜI DẠNG DỌC (Đồng bộ chuẩn lead_lifecycle_config) */}
                <CrmLeadVerticalPipeline
                  lead={currentLead}
                  onSelectStage={handleSelectStage}
                  onAdvanceStage={handleAdvanceStage}
                  onOpenDropDialog={() => setIsDropOpen(true)}
                  onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
                  onReactivateCycle={handleReactivateCycle}
                  onUpdateLead={(updated) => {
                    setCurrentLead(updated)
                    onUpdateLead?.(updated)
                  }}
                />

                {/* 2. CỤM CHĂM SÓC (LIÊN HỆ, GHI CHÚ NHANH, ĐANG XỬ LÝ) */}
                <div className="rounded-2xl border border-sky-200/80 dark:border-sky-900/60 bg-card p-3 shadow-xs text-left">
                  <CrmLeadCareSection
                    lead={currentLead}
                    studentCareAlert={studentCareAlert}
                    activeContactName={activeParentPersona || undefined}
                    onContactChange={setActiveParentPersona}
                    onSaveInteraction={handleSaveInteraction}
                  />
                </div>
              </>
            )}

            {rightTab === 'orders' && (
              <div className="flex-1 min-h-0">
                <CrmLeadOrdersTab lead={currentLead} onOpenCreateOrder={onOpenCreateOrder} />
              </div>
            )}
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

      {/* MODAL LỊCH SỬ CÁC ĐỢT TIẾP CẬN TRƯỚC ĐÂY (HỌC VIÊN CŨ / LEAD QUAY LẠI) */}
      {currentLead.isReturningLead && (
        <CrmLeadReturningHistoryModal
          lead={currentLead}
          open={isHistoryModalOpen}
          onOpenChange={setIsHistoryModalOpen}
        />
      )}

      {/* MODAL ĐẶT LỊCH ĐÁNH GIÁ (TEST) TRỰC TIẾP */}
      <BookingTestCreateDialog
        open={isBookingTestOpen}
        onOpenChange={setIsBookingTestOpen}
        initialData={bookingInitialData}
        onSubmit={handleBookingTestSubmit}
      />

      {/* MODAL ĐẶT LỊCH HỌC THỬ (TRIAL) TRỰC TIẾP */}
      <TrialClassCreateDialog
        open={isTrialClassOpen}
        onOpenChange={setIsTrialClassOpen}
        form={trialForm}
        onFormChange={setTrialForm}
        onSubmit={handleTrialClassSubmit}
      />
    </div>
  )
}
