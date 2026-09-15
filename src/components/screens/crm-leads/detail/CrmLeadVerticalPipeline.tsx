'use client'

import React, { useState, useMemo } from 'react'
import {
  Check,
  UserX,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Headset,
  ChevronDown,
  ChevronRight,
  UserCog,
  Info,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type { Lead, LeadStatus } from '@/mocks/crmLeads'
import type { CareInteraction } from './crmLeadDetailTypes'
import { STATUS_LABEL_MAP } from '../crmLeadsTypes'
import { useLeadLifecycleStore } from '@/stores/useLeadLifecycleStore'
import { CrmLeadStaffInfoModal } from './CrmLeadStaffInfoModal'
import { CrmLeadReassignModal } from './CrmLeadReassignModal'

export interface VerticalPipelineStage {
  id: string
  code: string
  status: LeadStatus
  aliases: string[]
  name: string
  color: string
  description: string
  subStatuses: string[]
}

export const LIFECYCLE_STAGES: VerticalPipelineStage[] = [
  {
    id: 'stage-new',
    code: 'NEW',
    status: 'moi_tiep_nhan',
    aliases: ['chua_tiep_can', 'moi_tiep_nhan'],
    name: '1. Mới tiếp nhận',
    color: '#64c8f5',
    description: 'Data mới phân bổ, tư vấn viên chưa thực hiện cuộc gọi đầu',
    subStatuses: ['Mới về - Chưa phân Sale', 'Đã giao Sale - Chưa gọi', 'Số sai / Spam'],
  },
  {
    id: 'stage-qt',
    code: 'QT',
    status: 'dang_tu_van',
    aliases: ['dang_cham_soc', 'dang_tu_van'],
    name: '2. Đang tư vấn',
    color: '#ff9800',
    description: 'Đã kết nối, phụ huynh quan tâm và đang tìm hiểu khóa học',
    subStatuses: [
      'Đã gọi lần 1 (Chưa chốt)',
      'Đã gọi lần 2 (Đang chăm)',
      'Hẹn gọi lại sau',
      'Đã gửi lộ trình & Báo giá',
    ],
  },
  {
    id: 'stage-tad',
    code: 'TAD',
    status: 'hen_trai_nghiem',
    aliases: ['danh_gia_trai_nghiem', 'hen_trai_nghiem'],
    name: '3. Hẹn Test / Trải nghiệm',
    color: '#e57373',
    description: 'Đã xếp lịch kiểm tra đầu vào hoặc đăng ký học thử',
    subStatuses: [
      'Đã đặt lịch kiểm tra',
      'Đã đăng ký học thử',
      'Vắng test (No-show)',
      'Chờ phân công GV',
    ],
  },
  {
    id: 'stage-tlttt',
    code: 'TLTTT',
    status: 'tiem_nang',
    aliases: ['tiem_nang'],
    name: '4. Kết quả Test & Level',
    color: '#f48fb1',
    description: 'Đã có kết quả nhận xét học thuật và trình độ đề xuất',
    subStatuses: [
      'Đạt trình độ SuperKids',
      'Đạt trình độ Flyers',
      'Đạt trình độ Kindy Mầm non',
      'Chờ PH duyệt lộ trình',
    ],
  },
  {
    id: 'stage-dentt',
    code: 'DENTT',
    status: 'cho_chot',
    aliases: ['cho_chot'],
    name: '5. Chờ chốt / Đăng ký',
    color: '#00897b',
    description: 'Phụ huynh đồng ý ghi danh, đang chờ nộp học phí hoặc hoàn tất hồ sơ',
    subStatuses: [
      'Hẹn nộp tiền mặt',
      'Chờ chuyển khoản',
      'Đã cọc 50%',
      'Giữ chỗ ưu đãi 24h',
    ],
  },
  {
    id: 'stage-won',
    code: 'WON',
    status: 'chuyen_doi',
    aliases: ['chuyen_doi'],
    name: '6. Chuyển đổi thành công',
    color: '#10b981',
    description: 'Hoàn tất thanh toán học phí, tự động tạo hồ sơ học viên chính thức',
    subStatuses: ['Đã thu 100% học phí', 'Chờ xếp lớp chính thức'],
  },
]

interface CrmLeadVerticalPipelineProps {
  lead: Lead
  onSelectStage?: (status: LeadStatus, subStatus?: string) => void
  onAdvanceStage?: () => void
  onOpenDropDialog?: () => void
  onOpenHistoryModal?: () => void
  onReactivateCycle?: () => void
  onUpdateLead?: (updatedLead: Lead) => void
}

export function CrmLeadVerticalPipeline({
  lead,
  onSelectStage,
  onAdvanceStage,
  onOpenDropDialog,
  onOpenHistoryModal,
  onReactivateCycle,
  onUpdateLead,
}: CrmLeadVerticalPipelineProps) {
  const { getStagesForPool, pools } = useLeadLifecycleStore()
  const poolId = lead.poolId || 'pool-t'
  const pool = pools.find((p) => p.id === poolId)
  const poolName = lead.poolName || pool?.name || 'Kho Tổng (T)'

  const pipelineStages: VerticalPipelineStage[] = useMemo(() => {
    const rawStages = getStagesForPool(poolId)
    const active = (rawStages || []).filter((s) => s.isActive && s.stageType !== 'global_lost')
    if (active.length === 0) return LIFECYCLE_STAGES

    return active.map((s, idx) => {
      let status: LeadStatus = 'dang_tu_van'
      let aliases: string[] = []

      if (
        s.id === 'stage-new' ||
        s.code === 'NEW' ||
        s.code === 'M0' ||
        s.code === 'CC0' ||
        s.code === 'G0' ||
        s.code === 'T0'
      ) {
        status = 'moi_tiep_nhan'
        aliases = ['chua_tiep_can', 'moi_tiep_nhan', s.id, s.code.toLowerCase()]
      } else if (
        s.id === 'stage-qt' ||
        s.code === 'QT' ||
        s.code === 'M1' ||
        s.code === 'CC1' ||
        s.code === 'G1' ||
        s.code === 'T1'
      ) {
        status = 'dang_tu_van'
        aliases = ['dang_cham_soc', 'dang_tu_van', s.id, s.code.toLowerCase()]
      } else if (
        s.id === 'stage-tad' ||
        s.code === 'TAD' ||
        s.code === 'M2' ||
        s.code === 'G2' ||
        s.code === 'T2'
      ) {
        status = 'hen_trai_nghiem'
        aliases = ['danh_gia_trai_nghiem', 'hen_trai_nghiem', s.id, s.code.toLowerCase()]
      } else if (
        s.id === 'stage-tlttt' ||
        s.code === 'TLTTT' ||
        s.code === 'M3' ||
        s.code === 'G3' ||
        s.code === 'T3'
      ) {
        status = 'tiem_nang'
        aliases = ['tiem_nang', s.id, s.code.toLowerCase()]
      } else if (
        s.id === 'stage-dentt' ||
        s.code === 'DENTT' ||
        s.code === 'stage-order' ||
        s.code === 'T4' ||
        s.code === 'CC2'
      ) {
        status = 'cho_chot'
        aliases = ['cho_chot', s.id, s.code.toLowerCase()]
      } else if (
        s.id === 'stage-won' ||
        s.code === 'WON' ||
        s.code === 'T5' ||
        s.code === 'M4' ||
        s.code === 'CC3' ||
        s.code === 'G4' ||
        s.phaseGroup === 'T5' ||
        s.phaseGroup === 'M4' ||
        s.phaseGroup === 'CC3' ||
        s.phaseGroup === 'G4'
      ) {
        status = 'chuyen_doi'
        aliases = ['chuyen_doi', s.id, s.code.toLowerCase()]
      } else {
        status = 'dang_tu_van'
        aliases = [s.id, s.code.toLowerCase()]
      }

      return {
        id: s.id,
        code: s.code,
        status,
        aliases,
        name: `${idx + 1}. ${s.name.replace(/^\[.*?\]\s*/, '').replace(/\s*\(.*?\)/g, '').trim()}`,
        color: s.color || '#64c8f5',
        description: s.description || '',
        subStatuses: (s.subStatuses || [])
          .filter((sub) => sub.isActive !== false)
          .map((sub) => sub.name),
      }
    })
  }, [getStagesForPool, poolId])

  const [selectedSubStatus, setSelectedSubStatus] = useState<string>(
    lead.subStatus || ''
  )
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false)
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false)
  const [assignedStaff, setAssignedStaff] = useState<string>(
    lead.assignedTo || 'Trần Thị Mai'
  )

  const handleConfirmReassign = (
    newStaffName: string,
    reason: string,
    handoverNote: string
  ) => {
    setAssignedStaff(newStaffName)
    const newInteraction: CareInteraction = {
      id: `inter-${Date.now()}`,
      cycleId: lead.currentCycleId || 'cycle-001',
      timestamp: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      staffName: 'Admin / Điều phối',
      channel: 'direct',
      outcome: 'callback',
      outcomeLabel: 'Điều chuyển phụ trách',
      note: `Điều chuyển phụ trách sang: ${newStaffName}. Lý do: ${reason}.${handoverNote ? ` Ghi chú bàn giao: ${handoverNote}` : ''}`,
    }

    const updatedLead: Lead = {
      ...lead,
      assignedTo: newStaffName,
      lastNote: `Điều chuyển phụ trách sang ${newStaffName}: ${reason}`,
      careInteractions: [newInteraction, ...(lead.careInteractions || [])],
    }
    onUpdateLead?.(updatedLead)
    toast.success(`Đã điều chuyển Lead cho ${newStaffName} thành công!`)
  }

  const isFailed = lead.status === 'that_bai'
  const isConverted = lead.status === 'chuyen_doi'

  const statusLabel = STATUS_LABEL_MAP[lead.status] || 'Đang tư vấn'
  const statusBadge = getStatusBadgeClass(
    lead.status === 'moi_tiep_nhan'
      ? 'pending'
      : lead.status === 'chuyen_doi'
        ? 'active'
        : lead.status === 'that_bai'
          ? 'inactive'
          : 'warning'
  )

  // Tìm vị trí index của stage hiện tại
  const currentStageIndex = pipelineStages.findIndex((st) =>
    st.aliases.includes(lead.status)
  )

  const handleStageClick = (stage: VerticalPipelineStage) => {
    if (isFailed) return
    onSelectStage?.(stage.status, stage.subStatuses[0])
  }

  const handleSubStatusClick = (sub: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedSubStatus(sub)
    const currentStage = pipelineStages[currentStageIndex]
    if (currentStage) {
      onSelectStage?.(currentStage.status, sub)
    }
  }

  const rawAssignedStaff = assignedStaff || lead.assignedTo || 'Trần Thị Mai'
  const cleanStaffName = rawAssignedStaff
    .replace(/\s*\((?:Sales|Sale|Marketing|Tư vấn)\)/gi, '')
    .trim()

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-2.5 lg:p-3 shadow-xs text-left">
      {/* 1. Header Card Phễu (Dòng 1 & Dòng 2) */}
      <div className="pb-2 mb-2 border-b border-border/70 space-y-1.5">
        {/* Dòng trên: [Icon Thu gọn/Mở rộng] Title + Badge trạng thái + Nút Báo rớt/Tiếp tục */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Nút đóng / mở phễu đặt TRƯỚC text Phễu Vòng Đời Lead */}
            <button
              type="button"
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-primary cursor-pointer transition-colors select-none group"
              title={isCollapsed ? 'Mở rộng để xem tất cả các trạng thái' : 'Thu gọn chỉ hiển thị trạng thái hiện tại'}
            >
              <span className="h-5 w-5 rounded-md bg-muted/60 group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center text-muted-foreground transition-colors shrink-0">
                {isCollapsed ? (
                  <ChevronRight className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </span>
              <span>Phễu Vòng Đời Lead</span>
            </button>

            {/* Huy hiệu trạng thái hiện tại */}
            <Badge
              className={cn(
                'h-5.5 px-2 text-[11px] font-semibold rounded-full inline-flex items-center shadow-none',
                statusBadge
              )}
            >
              {statusLabel}
            </Badge>

            {isCollapsed && (
              <span className="text-[11px] text-muted-foreground font-normal">
                (Chặng {Math.max(1, currentStageIndex + 1)}/{pipelineStages.length})
              </span>
            )}
          </div>

          {/* Quick Action: Báo rớt / Tiếp tục */}
          <div className="flex items-center gap-1.5 ml-auto">
            {!isFailed && !isConverted && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onOpenDropDialog}
                  className="h-6.5 px-2 text-[11px] font-semibold text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/50 dark:hover:bg-rose-950/40 cursor-pointer"
                  title="Báo rớt Lead kèm lý do chuẩn hóa"
                >
                  <UserX className="h-3 w-3 mr-1" />
                  <span>Báo rớt</span>
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={onAdvanceStage}
                  className="h-6.5 px-2.5 text-[11px] font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs cursor-pointer"
                  title="Chuyển Lead sang chặng tiếp theo"
                >
                  <span>Tiếp tục</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </>
            )}

            {isFailed && (
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[11px] font-semibold bg-rose-50 text-rose-700 border-rose-200">
                  Đã báo rớt
                </Badge>
                {onReactivateCycle && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={onReactivateCycle}
                    className="h-6.5 px-2 text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-2xs gap-1 cursor-pointer"
                    title="Kích hoạt Chu kỳ Bán mới (Win-back / Tái tiếp cận)"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Kích hoạt lại</span>
                  </Button>
                )}
              </div>
            )}

            {isConverted && (
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border-emerald-200">
                  Chuyển đổi (WON)
                </Badge>
                {onReactivateCycle && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={onReactivateCycle}
                    className="h-6.5 px-2 text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-2xs gap-1 cursor-pointer"
                    title="Kích hoạt bán mới (Học thêm môn / Tái ký / Tái tiếp cận)"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Kích hoạt lại</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dòng dưới: Kho T, Lead quay lại, Phụ trách (bỏ viền, bỏ nền, text phẳng thanh lịch) */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap pt-0.5">
          {/* Kho T */}
          <span className="font-medium text-foreground/90">
            {poolName}
          </span>

          {/* Lead quay lại (nếu có) */}
          {lead.isReturningLead && (
            <>
              <span className="text-muted-foreground/40">•</span>
              <button
                type="button"
                onClick={onOpenHistoryModal}
                className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer transition-colors"
                title={
                  lead.returningReason
                    ? `${lead.returningReason} - Bấm để xem chi tiết lịch sử các đợt tiếp cận`
                    : 'Bấm để xem lịch sử các đợt tiếp cận'
                }
              >
                <RotateCcw className="h-3 w-3" />
                <span>Lead quay lại</span>
              </button>
            </>
          )}

          {/* Phụ trách (click mở modal thông tin CS, cơ sở,...) */}
          <span className="text-muted-foreground/40">•</span>
          <div className="inline-flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setIsStaffModalOpen(true)}
              className="inline-flex items-center gap-1 font-normal text-muted-foreground hover:text-foreground cursor-pointer transition-colors group"
              title="Nhấp để xem chi tiết thông tin phụ trách, CS và cơ sở"
            >
              <Headset className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>Phụ trách:</span>
              <strong className="text-foreground font-semibold group-hover:text-primary underline decoration-dotted decoration-muted-foreground/50 underline-offset-2 group-hover:decoration-primary">
                {cleanStaffName}
              </strong>
              <Info className="h-3 w-3 text-muted-foreground/60 group-hover:text-primary shrink-0" />
            </button>

            {/* Cơ chế Đổi phụ trách */}
            <button
              type="button"
              onClick={() => setIsReassignModalOpen(true)}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200/80 dark:border-sky-800 transition-colors cursor-pointer shadow-3xs"
              title="Điều chuyển phụ trách Lead cho nhân sự khác"
            >
              <UserCog className="h-3 w-3 text-sky-600 dark:text-sky-400" />
              <span>Đổi</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Banner cảnh báo nếu đã Thất bại / Báo rớt */}
      {isFailed && lead.dropRecord && (
        <div className="mb-3 p-2.5 rounded-xl border border-rose-200 bg-rose-50/70 dark:bg-rose-950/30 text-xs text-rose-900 dark:text-rose-200 space-y-1.5">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
              <span>Rớt tại: {lead.dropRecord.stageLabel}</span>
            </div>
            {onReactivateCycle && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onReactivateCycle}
                className="h-6 px-2 text-[10.5px] font-semibold text-amber-700 dark:text-amber-300 border-amber-300 hover:bg-amber-100/70 dark:hover:bg-amber-950/60 shadow-3xs cursor-pointer flex items-center gap-1"
                title="Kích hoạt lại chu kỳ bán mới"
              >
                <Sparkles className="h-2.5 w-2.5 text-amber-600" />
                <span>Kích hoạt lại</span>
              </Button>
            )}
          </div>
          <p className="text-[11px] text-rose-700 dark:text-rose-300">
            Lý do: <span className="font-semibold">{lead.dropRecord.reasonLabel}</span>
            {lead.dropRecord.note ? ` — "${lead.dropRecord.note}"` : ''}
          </p>
          {lead.dropRecord.reCareDate && (
            <p className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
              Lịch làm ấm lại: {lead.dropRecord.reCareDate}
            </p>
          )}
        </div>
      )}

      {/* 3. Danh sách các chặng dạng Dọc (Vertical Stepper) */}
      <div className="space-y-1 relative pl-1">
        {isCollapsed ? (
          // CHẾ ĐỘ THU GỌN: CHỈ HIỂN THỊ TRẠNG THÁI HIỆN TẠI
          (() => {
            const activeIndex = currentStageIndex >= 0 ? currentStageIndex : 0
            const stage = pipelineStages[activeIndex] || pipelineStages[0]
            const activeSub = selectedSubStatus || lead.subStatus || stage.subStatuses[0]

            return (
              <div key={stage.id} className="relative flex items-start gap-2.5">
                {/* Stage Step Circle */}
                <div
                  className={cn(
                    'relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold transition-all shadow-sm',
                    isFailed
                      ? 'bg-rose-600 text-white'
                      : 'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-105'
                  )}
                  title={`Chặng hiện tại: ${stage.name}`}
                >
                  {activeIndex + 1}
                </div>

                {/* Stage Content */}
                <div className="flex-1 rounded-xl p-2 bg-primary/5 border border-primary/25 shadow-2xs select-none">
                  <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs font-bold text-foreground truncate">
                        {stage.name}
                      </span>

                      {/* Mã Code Badge */}
                      <span
                        className="text-[9.5px] px-1.5 py-0.5 rounded font-mono font-bold tracking-tight inline-flex items-center shrink-0"
                        style={{
                          backgroundColor: `${stage.color}15`,
                          color: stage.color,
                        }}
                      >
                        {stage.code}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                      {/* Trạng thái đang chọn ở cạnh phải dòng trạng thái chính */}
                      {activeSub && (
                        <span className="text-[11px] font-semibold text-primary">
                          {activeSub}
                        </span>
                      )}
                      <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" />
                      <button
                        type="button"
                        onClick={() => setIsCollapsed(false)}
                        className="text-[10px] text-sky-600 dark:text-sky-400 hover:underline font-medium cursor-pointer"
                      >
                        Mở rộng
                      </button>
                    </div>
                  </div>

                  {/* Danh sách sub-statuses để Sales chọn nhanh (đã bỏ nhãn Trạng thái chi tiết và text trùng lặp) */}
                  {stage.subStatuses && stage.subStatuses.length > 0 && (
                    <div className="mt-1.5 pt-1.5 border-t border-primary/15 flex flex-wrap gap-1">
                      {stage.subStatuses.map((sub) => {
                        const isSelected = activeSub === sub
                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={(e) => handleSubStatusClick(sub, e)}
                            className={cn(
                              'text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors border cursor-pointer',
                              isSelected
                                ? 'bg-primary text-primary-foreground border-primary font-bold shadow-2xs'
                                : 'bg-background hover:bg-muted text-foreground/80 border-border/80'
                            )}
                          >
                            {sub}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })()
        ) : (
          // CHẾ ĐỘ MỞ RỘNG: HIỂN THỊ ĐẦY ĐỦ CÁC CHẶNG
          pipelineStages.map((stage, idx) => {
            const isCurrent = !isFailed && currentStageIndex === idx
            const isPast = !isFailed && currentStageIndex > idx
            const isFuture = !isFailed && (currentStageIndex < idx || currentStageIndex === -1)
            const isLast = idx === pipelineStages.length - 1

            const activeSub =
              isCurrent
                ? selectedSubStatus || lead.subStatus || stage.subStatuses[0]
                : null

            return (
              <div key={stage.id} className="relative flex items-start gap-2.5 group">
                {/* Connecting line between stages */}
                {!isLast && (
                  <div
                    className={cn(
                      'absolute left-[13px] top-[24px] bottom-[-4px] w-[2px] transition-colors',
                      isPast ? 'bg-emerald-500' : 'bg-border'
                    )}
                  />
                )}

                {/* Stage Step Circle */}
                <button
                  type="button"
                  onClick={() => handleStageClick(stage)}
                  disabled={isFailed}
                  className={cn(
                    'relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer',
                    isPast && 'bg-emerald-600 text-white shadow-2xs',
                    isCurrent &&
                      'bg-primary text-primary-foreground ring-4 ring-primary/20 font-extrabold shadow-sm scale-105',
                    isFuture &&
                      'bg-muted border border-border text-muted-foreground hover:border-primary/40',
                    isFailed && 'bg-muted/60 border border-border/60 text-muted-foreground/50'
                  )}
                  title={`Chuyển sang: ${stage.name}`}
                >
                  {isPast ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : idx + 1}
                </button>

                {/* Stage Content */}
                <div
                  onClick={() => handleStageClick(stage)}
                  className={cn(
                    'flex-1 rounded-xl p-2 transition-all cursor-pointer select-none',
                    isCurrent
                      ? 'bg-primary/5 border border-primary/25 shadow-2xs'
                      : 'hover:bg-muted/40 border border-transparent'
                  )}
                >
                  <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={cn(
                          'text-xs truncate',
                          isCurrent
                            ? 'font-bold text-foreground'
                            : isPast
                            ? 'font-semibold text-foreground/80'
                            : 'text-muted-foreground'
                        )}
                      >
                        {stage.name}
                      </span>

                      {/* Mã Code Badge */}
                      <span
                        className="text-[9.5px] px-1.5 py-0.5 rounded font-mono font-bold tracking-tight inline-flex items-center shrink-0"
                        style={{
                          backgroundColor: `${stage.color}15`,
                          color: stage.color,
                        }}
                      >
                        {stage.code}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                      {/* Trạng thái đang chọn ở cạnh phải dòng trạng thái chính */}
                      {isCurrent && activeSub && (
                        <span className="text-[11px] font-semibold text-primary">
                          {activeSub}
                        </span>
                      )}
                      {isCurrent && (
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" />
                      )}
                    </div>
                  </div>

                  {/* Danh sách sub-statuses để Sales chọn nhanh (đã bỏ nhãn Trạng thái chi tiết và text trùng lặp) */}
                  {isCurrent && stage.subStatuses && stage.subStatuses.length > 0 && (
                    <div className="mt-1.5 pt-1.5 border-t border-primary/15 flex flex-wrap gap-1">
                      {stage.subStatuses.map((sub) => {
                        const isSelected = activeSub === sub
                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={(e) => handleSubStatusClick(sub, e)}
                            className={cn(
                              'text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors border cursor-pointer',
                              isSelected
                                ? 'bg-primary text-primary-foreground border-primary font-bold shadow-2xs'
                                : 'bg-background hover:bg-muted text-foreground/80 border-border/80'
                            )}
                          >
                            {sub}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal Thông tin Phụ trách, CS và Cơ sở */}
      <CrmLeadStaffInfoModal
        open={isStaffModalOpen}
        onOpenChange={setIsStaffModalOpen}
        lead={lead}
        staffName={cleanStaffName}
        onReassignStaff={(newStaff) => {
          handleConfirmReassign(newStaff, 'Điều phối thủ công từ Modal thông tin', '')
        }}
        onOpenReassignModal={() => setIsReassignModalOpen(true)}
      />

      {/* Modal Điều chuyển Phụ trách Lead */}
      <CrmLeadReassignModal
        open={isReassignModalOpen}
        onOpenChange={setIsReassignModalOpen}
        lead={lead}
        currentStaffName={cleanStaffName}
        onConfirmReassign={handleConfirmReassign}
      />
    </div>
  )
}
