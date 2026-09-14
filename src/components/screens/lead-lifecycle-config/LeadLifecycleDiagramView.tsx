'use client'

import React from 'react'
import {
  PipelineStageConfig,
  PipelineSubStatusConfig,
} from './leadLifecycleTypes'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Plus,
  Edit2,
  Clock,
  CornerDownRight,
  ArrowDown,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSystemModuleShortLabel } from './leadLifecycleHelpers'

interface LeadLifecycleDiagramViewProps {
  stages: PipelineStageConfig[]
  onEditStage: (stage: PipelineStageConfig) => void
  onAddNewSubStatus: (stage: PipelineStageConfig) => void
  onEditSubStatus: (
    stage: PipelineStageConfig,
    subStatus: PipelineSubStatusConfig
  ) => void
  onDeleteSubStatus?: (stageId: string, subStatusId: string) => void
  originFilter?: 'all' | 'system' | 'custom'
}

export const LeadLifecycleDiagramView: React.FC<LeadLifecycleDiagramViewProps> = ({
  stages,
  onEditStage,
  onAddNewSubStatus,
  onEditSubStatus,
  onDeleteSubStatus,
  originFilter = 'all',
}) => {
  // Trục chính Happy Path (sắp xếp theo thứ tự order của từng kho)
  const happyPathStages = stages
    .filter((s) => s.stageType !== 'global_lost')
    .slice()
    .sort((a, b) => a.order - b.order)

  const lostStage = stages.find((s) => s.stageType === 'global_lost')
  const t4Stage = stages.find((s) => s.phaseGroup === 'T4')

  // Các nhãn hoàn trả & sự cố từ T4 tách riêng cho nhánh ngoại lệ bên dưới (nếu kho có T4)
  const t4ExceptionCodes = ['CDH', 'DANG_HOAN', 'DA_HOAN_TRA', 'HUY_DON_HANG']
  const t4ExceptionSubs = (t4Stage?.subStatuses || [])
    .filter((sub) => t4ExceptionCodes.includes(sub.code))
    .filter((sub) => originFilter === 'all' || sub.origin === originFilter)

  const hasT4Exception = Boolean(t4Stage && t4ExceptionSubs.length > 0)

  const lostSubs = (lostStage?.subStatuses || []).filter(
    (sub) => originFilter === 'all' || sub.origin === originFilter
  )

  const getCleanStageName = (name: string) => {
    return name.replace(/^\[[A-Za-z0-9_]+\]\s*/, '')
  }

  const numCols = Math.max(happyPathStages.length, 1)

  return (
    <div className="w-full overflow-x-auto custom-scrollbar pb-3 select-none">
      <div className="min-w-[960px] xl:min-w-0 w-full max-w-[95%] mx-auto flex flex-col gap-1">
        {/* HÀNG 1: CÁC KHỐI CẤU HÌNH GIAI ĐOẠN TIẾN TRÌNH CHÍNH (ĐỘNG THEO KHO) */}
        <div
          className="grid gap-4 w-full"
          style={{ gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))` }}
        >
          {happyPathStages.map((stage, idx) => {
            const displayedSubs = (
              stage.phaseGroup === 'T4'
                ? (stage.subStatuses || []).filter(
                    (s) => !t4ExceptionCodes.includes(s.code)
                  )
                : stage.subStatuses || []
            ).filter(
              (s) => !originFilter || originFilter === 'all' || s.origin === originFilter
            )

            return (
              <div key={stage.id} className="relative flex flex-col">
                {/* Khối Cấu hình Giai đoạn */}
                <div
                  className="flex-1 flex flex-col rounded-xl border border-border bg-card shadow-2xs transition-all hover:shadow-xs hover:border-border/90"
                  style={{ borderTop: `3px solid ${stage.color}` }}
                >
                  {/* Header Khối Cấu hình */}
                  <div className="p-2 pb-1.5 border-b border-border/60 bg-muted/10">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="font-mono text-[10px] font-bold shrink-0 px-1.5 py-0.2 rounded text-white"
                          style={{ backgroundColor: stage.color }}
                        >
                          [{stage.phaseGroup}]
                        </span>
                        <span
                          className="font-semibold text-[11px] text-foreground truncate"
                          title={stage.name}
                        >
                          {getCleanStageName(stage.name)}
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditStage(stage)}
                        className="h-5 w-5 text-muted-foreground hover:text-foreground opacity-70 group-hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
                        title="Cấu hình bước này"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Setup Info: Mã & SLA */}
                    <div className="flex items-center justify-between text-[9.5px] text-muted-foreground pt-0.5">
                      <span className="font-mono bg-muted px-1.5 py-0.2 rounded border border-border/50">
                        {stage.code}
                      </span>
                      {stage.slaHours ? (
                        <span className="inline-flex items-center gap-0.5 font-mono">
                          <Clock className="h-2.5 w-2.5" />
                          SLA: {stage.slaHours}h
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60">Không SLA</span>
                      )}
                    </div>

                    {/* Action setup prompt */}
                    {stage.actionLabel && (
                      <div className="text-[9.5px] text-muted-foreground/80 italic truncate mt-1 pt-0.5 border-t border-border/40">
                        {stage.actionLabel}
                      </div>
                    )}
                  </div>

                  {/* Danh sách nhãn con cấu hình */}
                  <div className="p-1.5 flex-1 flex flex-col gap-1 min-h-[130px] max-h-[220px] overflow-y-auto custom-scrollbar">
                    {displayedSubs.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center text-[10px] text-muted-foreground/60 italic text-center p-2">
                        {originFilter === 'system'
                          ? 'Không có nhãn hệ thống'
                          : originFilter === 'custom'
                          ? 'Không có nhãn tùy biến'
                          : 'Chưa gắn nhãn'}
                      </div>
                    ) : (
                      displayedSubs.map((sub) => (
                        <div
                          key={sub.id}
                          onClick={() => onEditSubStatus(stage, sub)}
                          className={cn(
                            'group/item flex items-center justify-between gap-1 px-1.5 py-1 rounded text-[10.5px] border transition-all cursor-pointer',
                            sub.origin === 'system'
                              ? 'bg-blue-50/40 border-blue-200/70 hover:bg-blue-50/70 dark:bg-blue-950/25 dark:border-blue-900/50 shadow-2xs'
                              : 'bg-muted/30 hover:bg-muted/70 border-border/40'
                          )}
                          title={
                            sub.origin === 'system'
                              ? `⚙️ Nhãn Hệ thống: ${sub.name} (${sub.code})\n• Phân hệ: ${sub.systemModuleLabel || 'Tự động'}\n• Kích hoạt: ${sub.systemEventTrigger || 'Hệ thống'}`
                              : `✏️ Nhãn Tùy biến: ${sub.name} (${sub.code})\n${sub.description || 'Tác nghiệp nội bộ'}`
                          }
                        >
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <span
                              className="h-1.5 w-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: sub.color || stage.color }}
                            />
                            <span className="truncate text-foreground font-medium text-[10.5px]" title={sub.name}>
                              {sub.name}
                            </span>
                          </div>

                          {sub.origin === 'system' ? (
                            <span
                              className="shrink-0 text-[8.5px] px-1 py-0.2 rounded font-medium bg-blue-100/90 text-blue-700 border border-blue-300/80 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800 flex items-center gap-0.5"
                              title={`Liên kết hệ thống: ${sub.systemModuleLabel || 'Tự động'}`}
                            >
                              <span className="text-[7.5px]">⚙️</span>
                              <span>{getSystemModuleShortLabel(sub)}</span>
                            </span>
                          ) : (
                            onDeleteSubStatus && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDeleteSubStatus(stage.id, sub.id)
                                }}
                                className="opacity-0 group-hover/item:opacity-100 p-0.5 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded transition-all cursor-pointer shrink-0"
                                title={`Xóa nhãn: ${sub.name}`}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Nút Thêm nhãn */}
                  <div className="p-1 border-t border-border/50 bg-card rounded-b-xl">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAddNewSubStatus(stage)}
                      className="w-full h-5.5 text-[10.5px] gap-1 text-muted-foreground hover:text-primary hover:bg-primary/5 cursor-pointer font-normal"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Thêm nhãn</span>
                    </Button>
                  </div>
                </div>

                {/* Mũi Tên Liên Kết Tiến Trình Ngang Sang Bước Kế Tiếp */}
                {idx < happyPathStages.length - 1 && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 w-4 flex items-center justify-center z-20 pointer-events-none">
                    <div className="h-5 w-5 rounded-full bg-background border border-primary/40 flex items-center justify-center text-primary shadow-2xs shrink-0">
                      <ArrowRight className="h-3 w-3 text-primary stroke-[2.5]" />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* HÀNG 2: CÁC ĐƯỜNG LINE DỌC KẾT NỐI XUỐNG (CÙNG TỶ LỆ GRID ĐỘNG THEO SỐ BƯỚC) */}
        <div
          className="grid gap-4 w-full h-9"
          style={{ gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))` }}
        >
          {happyPathStages.map((stg, idx) => {
            if (idx === 0 || idx === numCols - 1) {
              return <div key={`arrow-spacer-${stg.id}`} />
            }
            if (stg.phaseGroup === 'T4' && hasT4Exception) {
              return (
                <div key={`arrow-${stg.id}`} className="flex flex-col items-center justify-end h-full">
                  <div className="w-0.5 h-full bg-red-500" />
                  <ArrowDown className="h-3.5 w-3.5 text-red-500 -mt-1 stroke-[3]" />
                </div>
              )
            }
            return (
              <div key={`arrow-${stg.id}`} className="flex flex-col items-center justify-end h-full">
                <div className="w-0.5 h-full bg-slate-400 dark:bg-slate-500" />
                <ArrowDown className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 -mt-1 stroke-[3]" />
              </div>
            )
          })}
        </div>

        {/* HÀNG 3: CÁC KHỐI NHẬN LUỒNG (GRID ĐỘNG) */}
        <div
          className="grid gap-4 w-full"
          style={{ gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))` }}
        >
          {/* Khoảng trống Cột 0 */}
          <div />

          {/* Nhánh Dừng Chăm sóc / Thất bại Toàn cục */}
          <div
            style={{
              gridColumn: hasT4Exception
                ? `span ${Math.max(numCols - 3, 1)} / span ${Math.max(numCols - 3, 1)}`
                : `span ${Math.max(numCols - 1, 1)} / span ${Math.max(numCols - 1, 1)}`,
            }}
          >
            {lostStage && (
              <div className="p-3 rounded-xl border border-slate-300/90 bg-slate-50/50 dark:bg-slate-900/30 dark:border-slate-700 shadow-2xs border-t-2 border-t-slate-400 dark:border-t-slate-500">
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-border/50">
                  <div className="flex items-center gap-1.5">
                    <CornerDownRight className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
                      Nhánh Dừng Chăm sóc / Thất bại (Global Lost)
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddNewSubStatus(lostStage)}
                    className="h-5 text-[11px] gap-1 text-slate-700 hover:text-slate-900 p-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Thêm lý do</span>
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {lostSubs.length === 0 ? (
                    <div className="col-span-3 text-center py-4 text-[11px] text-muted-foreground/70 italic">
                      {originFilter === 'system'
                        ? '(Toàn bộ lý do dừng chăm sóc là nhãn tác nghiệp nội bộ)'
                        : 'Không có lý do phù hợp bộ lọc'}
                    </div>
                  ) : (
                    lostSubs.slice(0, 6).map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => onEditSubStatus(lostStage, sub)}
                        className="group/lost p-2 rounded-lg bg-background border border-border hover:border-slate-400 text-xs cursor-pointer transition-colors flex items-center justify-between gap-1"
                        title={`Sửa lý do: ${sub.name} (${sub.code})`}
                      >
                        <div className="font-medium text-foreground truncate text-[11px]" title={sub.name}>
                          {sub.name}
                        </div>
                        {onDeleteSubStatus && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteSubStatus(lostStage.id, sub.id)
                            }}
                            className="opacity-0 group-hover/lost:opacity-100 p-0.5 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded transition-all cursor-pointer shrink-0"
                            title={`Xóa lý do: ${sub.name}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cột Ngoại lệ Hoàn hàng & Sự cố Vận đơn (Chỉ render khi kho có T4 và có nhãn exception) */}
          {hasT4Exception && (
            <div
              style={{
                gridColumn: `span ${Math.min(2, numCols - 1)} / span ${Math.min(2, numCols - 1)}`,
              }}
            >
              <div className="p-3 rounded-xl border border-red-200/90 bg-red-50/30 dark:bg-red-950/20 dark:border-red-900/50 shadow-2xs border-t-2 border-t-red-500">
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-red-200/50 dark:border-red-900/30">
                  <div className="flex items-center gap-1.5">
                    <CornerDownRight className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                    <span className="text-xs font-bold text-red-900 dark:text-red-300">
                      Nhánh Trả lại Giáo trình &amp; Hoàn hủy Đơn (Rẽ nhánh từ [T4])
                    </span>
                  </div>
                  <span className="text-[10px] text-red-600/80 dark:text-red-400 font-mono">
                    {t4ExceptionSubs.length} trạng thái con
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {t4ExceptionSubs.length === 0 ? (
                    <div className="col-span-4 text-center py-4 text-[11px] text-muted-foreground/70 italic">
                      Không có trạng thái ngoại lệ phù hợp bộ lọc
                    </div>
                  ) : (
                    t4ExceptionSubs.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => t4Stage && onEditSubStatus(t4Stage, sub)}
                        className={cn(
                          'group/except p-2 rounded-lg border text-xs cursor-pointer transition-colors flex flex-col justify-between gap-1',
                          sub.origin === 'system'
                            ? 'bg-blue-50/25 border-blue-200/80 dark:bg-blue-950/20 dark:border-blue-900/50 hover:border-blue-400'
                            : 'bg-background border-red-200/70 dark:border-red-900/50 hover:border-red-400'
                        )}
                        title={
                          sub.origin === 'system'
                            ? `⚙️ Nhãn Hệ thống: ${sub.name} (${sub.code}) | Liên kết: ${sub.systemModuleLabel}`
                            : `✏️ Sửa nhãn: ${sub.name} (${sub.code})`
                        }
                      >
                        <div className="flex items-center justify-between gap-1">
                          <div className="font-medium text-foreground truncate text-[11px]" title={sub.name}>
                            {sub.name}
                          </div>
                          {sub.origin === 'custom' && onDeleteSubStatus && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (t4Stage && onDeleteSubStatus) {
                                  onDeleteSubStatus(t4Stage.id, sub.id)
                                }
                              }}
                              className="opacity-0 group-hover/except:opacity-100 p-0.5 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded transition-all cursor-pointer shrink-0"
                              title={`Xóa nhãn: ${sub.name}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          {sub.origin === 'system' ? (
                            <span className="text-[8.5px] px-1.5 py-0.2 rounded font-medium bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 flex items-center gap-0.5">
                              <span className="text-[7.5px]">⚙️</span>
                              <span>{getSystemModuleShortLabel(sub)}</span>
                            </span>
                          ) : (
                            <span className="text-[8.5px] text-muted-foreground/70">Tùy biến</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
