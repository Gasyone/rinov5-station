'use client'

import React, { useState } from 'react'
import {
  Check,
  TrendingUp,
  UserX,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Lead, LeadStatus } from '@/mocks/crmLeads'

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
}

export function CrmLeadVerticalPipeline({
  lead,
  onSelectStage,
  onAdvanceStage,
  onOpenDropDialog,
}: CrmLeadVerticalPipelineProps) {
  const [selectedSubStatus, setSelectedSubStatus] = useState<string>(
    lead.subStatus || ''
  )

  const isFailed = lead.status === 'that_bai'
  const isConverted = lead.status === 'chuyen_doi'

  // Tìm vị trí index của stage hiện tại
  const currentStageIndex = LIFECYCLE_STAGES.findIndex((st) =>
    st.aliases.includes(lead.status)
  )

  const handleStageClick = (stage: VerticalPipelineStage) => {
    if (isFailed) return
    onSelectStage?.(stage.status, stage.subStatuses[0])
  }

  const handleSubStatusClick = (sub: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedSubStatus(sub)
    const currentStage = LIFECYCLE_STAGES[currentStageIndex]
    if (currentStage) {
      onSelectStage?.(currentStage.status, sub)
    }
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-2.5 lg:p-3 shadow-xs text-left">
      {/* 1. Header Card Phễu */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-foreground">Phễu Vòng Đời Lead</span>
              <span className="text-[10px] text-muted-foreground font-mono font-medium">
                (Chu kỳ Sales)
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-1">
              {isFailed
                ? 'Lead đã dừng chuyển đổi / Lưu kho'
                : isConverted
                ? 'Đã chuyển đổi thành công (WON)'
                : 'Tiến trình chăm sóc & chốt khóa học'}
            </p>
          </div>
        </div>

        {/* Quick Action: Báo rớt / Đã chuyển đổi */}
        <div className="flex items-center gap-1.5">
          {!isFailed && !isConverted && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onOpenDropDialog}
                className="h-7 px-2 text-[11px] font-semibold text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/50 dark:hover:bg-rose-950/40 cursor-pointer"
                title="Báo rớt Lead kèm lý do chuẩn hóa"
              >
                <UserX className="h-3 w-3 mr-1" />
                <span>Báo rớt</span>
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={onAdvanceStage}
                className="h-7 px-2.5 text-[11px] font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs cursor-pointer"
                title="Chuyển Lead sang chặng tiếp theo"
              >
                <span>Tiếp tục</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </>
          )}

          {isFailed && (
            <Badge variant="outline" className="text-[11px] font-semibold bg-rose-50 text-rose-700 border-rose-200">
              Đã báo rớt
            </Badge>
          )}

          {isConverted && (
            <Badge variant="outline" className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border-emerald-200">
              Chuyển đổi (WON)
            </Badge>
          )}
        </div>
      </div>

      {/* 2. Banner cảnh báo nếu đã Thất bại / Báo rớt */}
      {isFailed && lead.dropRecord && (
        <div className="mb-3 p-2.5 rounded-xl border border-rose-200 bg-rose-50/70 dark:bg-rose-950/30 text-xs text-rose-900 dark:text-rose-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
            <span>Rớt tại: {lead.dropRecord.stageLabel}</span>
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
        {LIFECYCLE_STAGES.map((stage, idx) => {
          const isCurrent = !isFailed && currentStageIndex === idx
          const isPast = !isFailed && currentStageIndex > idx
          const isFuture = !isFailed && (currentStageIndex < idx || currentStageIndex === -1)
          const isLast = idx === LIFECYCLE_STAGES.length - 1

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
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'text-xs',
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
                      className="text-[9px] px-1 py-0.2 rounded font-mono font-bold tracking-tight"
                      style={{
                        backgroundColor: `${stage.color}15`,
                        color: stage.color,
                      }}
                    >
                      {stage.code}
                    </span>
                  </div>

                  {isCurrent && (
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>

                {/* Sub-status tag pill */}
                {isCurrent && (
                  <div className="mt-1.5 pt-1.5 border-t border-primary/15 space-y-1">
                    <div className="text-[10px] text-muted-foreground font-medium flex items-center justify-between">
                      <span>Trạng thái chi tiết:</span>
                      <span className="font-semibold text-primary">{activeSub}</span>
                    </div>

                    {/* Danh sách sub-statuses để Sales chọn nhanh */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
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
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
