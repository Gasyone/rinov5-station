'use client'

import React from 'react'
import { Check, X, AlertTriangle, ArrowRight, PhoneCall, Calendar, Plus, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Lead } from '@/mocks/crmLeads'

interface CrmLeadPipelineStepperProps {
  lead: Lead
  onAdvanceStage?: () => void
  onOpenDropDialog?: () => void
  onOpenBookingTest?: () => void
  onOpenCreateOrder?: () => void
}

const STAGES = [
  { id: 'moi_tiep_nhan', label: '1. Tiếp nhận' },
  { id: 'dang_tu_van', label: '2. Tư vấn' },
  { id: 'hen_trai_nghiem', label: '3. Test / Trải nghiệm' },
  { id: 'cho_chot', label: '4. Chờ chốt deal' },
  { id: 'chuyen_doi', label: '5. Chuyển đổi' },
]

export function CrmLeadPipelineStepper({
  lead,
  onAdvanceStage,
  onOpenDropDialog,
  onOpenBookingTest,
  onOpenCreateOrder,
}: CrmLeadPipelineStepperProps) {
  const getStageIndex = (status: string) => {
    switch (status) {
      case 'chua_tiep_can':
      case 'moi_tiep_nhan':
        return 0
      case 'dang_cham_soc':
      case 'dang_tu_van':
        return 1
      case 'danh_gia_trai_nghiem':
      case 'hen_trai_nghiem':
        return 2
      case 'tiem_nang':
      case 'cho_chot':
        return 3
      case 'chuyen_doi':
        return 4
      case 'that_bai':
        return -1
      default:
        return 0
    }
  }

  const currentIndex = getStageIndex(lead.status)
  const isFailed = lead.status === 'that_bai'
  const isConverted = lead.status === 'chuyen_doi'

  return (
    <div className="bg-muted/40 border border-border/80 rounded-xl p-3.5 space-y-3">
      {/* Top row: Stepper stages */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center min-w-[500px]">
            {STAGES.map((stage, idx) => {
              const isCurrent = !isFailed && currentIndex === idx
              const isPast = !isFailed && currentIndex > idx
              const isFuture = !isFailed && currentIndex < idx

              return (
                <React.Fragment key={stage.id}>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all',
                        isPast && 'bg-emerald-600 text-white',
                        isCurrent && 'bg-primary text-primary-foreground ring-2 ring-primary/30',
                        isFuture && 'bg-muted border border-border text-muted-foreground',
                        isFailed && 'bg-muted border border-border text-muted-foreground/60'
                      )}
                    >
                      {isPast ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                    </div>
                    <span
                      className={cn(
                        'text-xs whitespace-nowrap',
                        isCurrent && 'font-bold text-foreground',
                        isPast && 'font-medium text-foreground/80',
                        isFuture && 'text-muted-foreground',
                        isFailed && 'text-muted-foreground/60'
                      )}
                    >
                      {stage.label}
                    </span>
                  </div>

                  {idx < STAGES.length - 1 && (
                    <div
                      className={cn(
                        'h-[2px] flex-1 mx-2 min-w-[20px]',
                        isPast ? 'bg-emerald-500' : 'bg-border'
                      )}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!isConverted && !isFailed && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7.5 px-2.5 text-xs text-rose-700 hover:text-rose-800 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 border-rose-300 dark:border-rose-800 cursor-pointer"
                onClick={onOpenDropDialog}
              >
                <UserX className="h-3.5 w-3.5 mr-1" />
                <span>Báo rớt</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7.5 px-2.5 text-xs border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
                onClick={onAdvanceStage}
              >
                <span>Chuyển chặng</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </>
          )}

          {isConverted && (
            <Badge className="bg-emerald-600 text-white border-none text-xs px-2.5 py-1 flex items-center gap-1">
              <Check className="h-3.5 w-3.5" />
              <span>Đã chuyển đổi thành công</span>
            </Badge>
          )}

          {isFailed && (
            <Badge variant="destructive" className="text-xs px-2.5 py-1 flex items-center gap-1">
              <X className="h-3.5 w-3.5" />
              <span>Đã dừng / Thất bại</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Warning/Alert Banner if Dropped */}
      {isFailed && lead.dropRecord && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 text-xs">
          <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            <span className="font-bold">Điểm rơi ghi nhận:</span>{' '}
            <span>{lead.dropRecord.stageLabel}</span> •{' '}
            <span className="font-semibold text-rose-700 dark:text-rose-300">
              Lý do: {lead.dropRecord.reasonLabel}
            </span>
            {lead.dropRecord.note && (
              <span className="text-muted-foreground block mt-0.5">
                Chi tiết: &ldquo;{lead.dropRecord.note}&rdquo;
              </span>
            )}
            {lead.dropRecord.reCareDate && (
              <span className="font-medium text-violet-700 dark:text-violet-400 block mt-0.5">
                ⏰ Dự kiến chăm sóc lại: {lead.dropRecord.reCareDate}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
