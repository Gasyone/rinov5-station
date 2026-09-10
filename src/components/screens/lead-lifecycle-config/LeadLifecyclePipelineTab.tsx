'use client'

import React from 'react'
import {
  PipelineStageConfig,
  PipelineSubStatusConfig,
} from './leadLifecycleTypes'
import { getStagePhase } from './leadLifecycleHelpers'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Clock,
  Lock,
  ChevronDown,
  ChevronRight,
  Link2,
  Tag,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LeadLifecyclePipelineTabProps {
  stages: PipelineStageConfig[]
  onEditStage: (stage: PipelineStageConfig) => void
  onDeleteStage: (stageId: string) => void
  onMoveStage: (stageId: string, direction: 'up' | 'down') => void
  onAddNewSubStatus: (stage: PipelineStageConfig) => void
  onEditSubStatus: (stage: PipelineStageConfig, subStatus: PipelineSubStatusConfig) => void
  onDeleteSubStatus: (stageId: string, subStatusId: string) => void
  onToggleSubStatusActive: (stageId: string, subStatusId: string) => void
  expandedStages: Set<string>
  onToggleExpand: (stageId: string) => void
}

const PHASE_CONFIG: Record<
  string,
  { label: string; borderClass: string; badgeClass: string; dotClass: string }
> = {
  T0: {
    label: 'Giai đoạn [T0]: Tiếp nhận Lead',
    borderClass: 'border-l-blue-500',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300',
    dotClass: 'bg-blue-500',
  },
  T1: {
    label: 'Giai đoạn [T1]: Tư vấn & Quan tâm',
    borderClass: 'border-l-amber-500',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
    dotClass: 'bg-amber-500',
  },
  T2: {
    label: 'Giai đoạn [T2]: Đánh giá & Học thử',
    borderClass: 'border-l-indigo-500',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300',
    dotClass: 'bg-indigo-500',
  },
  T3: {
    label: 'Giai đoạn [T3]: Chốt Deal & Nhập học',
    borderClass: 'border-l-emerald-500',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
    dotClass: 'bg-emerald-500',
  },
  T4: {
    label: 'Giai đoạn [T4]: Vận đơn & Thu phí',
    borderClass: 'border-l-orange-500',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300',
    dotClass: 'bg-orange-500',
  },
  T5: {
    label: 'Giai đoạn [T5]: Hoàn tất & Thành công',
    borderClass: 'border-l-emerald-500',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
    dotClass: 'bg-emerald-500',
  },
}

const getCleanStageName = (name: string) => {
  return name.replace(/^\[T\d\]\s*/, '')
}

export const LeadLifecyclePipelineTab: React.FC<LeadLifecyclePipelineTabProps> = ({
  stages,
  onEditStage,
  onDeleteStage,
  onMoveStage,
  onAddNewSubStatus,
  onEditSubStatus,
  onDeleteSubStatus,
  onToggleSubStatusActive,
  expandedStages,
  onToggleExpand,
}) => {
  if (stages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border rounded-xl border-dashed border-border bg-card">
        <p className="text-xs text-muted-foreground">Không tìm thấy trạng thái phễu nào phù hợp với bộ lọc.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 pb-8">
      {stages.map((stage, idx) => {
        const isExpanded = expandedStages.has(stage.id)
        const subs = stage.subStatuses || []
        const cleanName = getCleanStageName(stage.name)
        const phaseKey = getStagePhase(stage)

        const cfg = PHASE_CONFIG[phaseKey] || {
          label: `Giai đoạn [${phaseKey}]`,
          borderClass: 'border-l-primary',
          badgeClass: 'bg-primary/10 text-primary border-primary/20',
          dotClass: 'bg-primary',
        }

        return (
          <div
            key={stage.id}
            className={cn(
              'rounded-xl border border-border/80 bg-card shadow-2xs transition-all overflow-hidden border-l-4',
              cfg.borderClass
            )}
          >
            {/* Stage Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:px-4 bg-muted/20 hover:bg-muted/40 transition-colors">
              {/* Left: Expand button, Order, Phase Badge, Name, Code */}
              <div
                className="flex items-center gap-2.5 cursor-pointer select-none flex-1 min-w-0"
                onClick={() => onToggleExpand(stage.id)}
              >
                <button
                  type="button"
                  className="h-6 w-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground shrink-0 cursor-pointer"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                <span className="text-[11px] font-mono font-bold text-muted-foreground/60 w-5 shrink-0">
                  #{stage.order}
                </span>

                <Badge
                  variant="outline"
                  className={cn('text-[11px] font-semibold px-2 py-0.5 shrink-0', cfg.badgeClass)}
                >
                  [{phaseKey}]
                </Badge>

                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-semibold text-xs text-foreground truncate">
                    {cleanName}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground/80 bg-muted px-1.5 py-0.5 rounded border border-border/40 shrink-0">
                    {stage.code}
                  </span>
                </div>

                {/* Stage Type Indicator */}
                {stage.stageType === 'won' && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Won</span>
                  </span>
                )}
                {stage.stageType === 'global_lost' && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 px-2 py-0.5 rounded-full shrink-0">
                    <AlertCircle className="h-3 w-3" />
                    <span>Lost</span>
                  </span>
                )}
              </div>

              {/* Right: SLA, Sub-status Count, Up/Down, Actions */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end sm:self-center">
                {stage.slaHours && (
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/50">
                    <Clock className="h-3 w-3 text-amber-500" />
                    <span>{stage.slaHours}h</span>
                  </div>
                )}

                <Badge
                  variant="secondary"
                  className="text-[11px] font-normal cursor-pointer hover:bg-muted"
                  onClick={() => onToggleExpand(stage.id)}
                >
                  {subs.length} nhãn con
                </Badge>

                {/* Stage Reorder Buttons */}
                <div className="flex items-center gap-0.5 border-l border-border/60 pl-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation()
                      onMoveStage(stage.id, 'up')
                    }}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-30"
                    title="Di chuyển lên"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={idx === stages.length - 1}
                    onClick={(e) => {
                      e.stopPropagation()
                      onMoveStage(stage.id, 'down')
                    }}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-30"
                    title="Di chuyển xuống"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Edit & Delete Stage */}
                <div className="flex items-center gap-0.5 border-l border-border/60 pl-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditStage(stage)
                    }}
                    className="h-7 w-7 text-muted-foreground hover:text-primary cursor-pointer"
                    title="Chỉnh sửa trạng thái"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  {stage.isSystemCore ? (
                    <div
                      className="h-7 w-7 flex items-center justify-center text-muted-foreground/40"
                      title="Bước phễu cốt lõi (không xóa)"
                    >
                      <Lock className="h-3 w-3" />
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteStage(stage.id)
                      }}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                      title="Xóa trạng thái"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Stage Expanded Body: Sub-status Compact List */}
            {isExpanded && (
              <div className="p-3 sm:p-4 bg-muted/10 border-t border-border/70 space-y-2.5">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      Danh sách nhãn con ({subs.length})
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      (
                      {subs.filter((s) => s.origin === 'system').length} hệ thống ·{' '}
                      {subs.filter((s) => s.origin === 'custom').length} tùy biến)
                    </span>
                  </div>

                  <Button
                    onClick={() => onAddNewSubStatus(stage)}
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs gap-1.5 border-dashed border-primary/40 text-primary hover:bg-primary/10 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>+ Thêm nhãn</span>
                  </Button>
                </div>

                {subs.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground bg-background rounded-lg border border-dashed border-border">
                    Chưa có nhãn trạng thái con nào được gán cho bước này.
                  </div>
                ) : (
                  <div className="rounded-lg border border-border/70 overflow-hidden bg-background shadow-2xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border/70 bg-muted/40 text-muted-foreground text-[11px] font-semibold">
                            <th className="py-2.5 px-3 w-[22%]">Tên Nhãn Trạng Thái</th>
                            <th className="py-2.5 px-2.5 w-[13%]">Mã Code</th>
                            <th className="py-2.5 px-2.5 w-[18%]">Phân Hệ / Nguồn Gốc</th>
                            <th className="py-2.5 px-2.5 w-[15%]">Ràng Buộc Tác Nghiệp</th>
                            <th className="py-2.5 px-3 w-[20%]">Mô Tả / Hướng Dẫn</th>
                            <th className="py-2.5 px-3 w-[12%] text-right">Trạng Thái &amp; Thao Tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {subs.map((sub) => (
                            <tr key={sub.id} className="hover:bg-muted/30 transition-colors group">
                              {/* 1. Tên Nhãn */}
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="h-2 w-2 rounded-full shrink-0"
                                    style={{ backgroundColor: sub.color }}
                                  />
                                  <span className="font-semibold text-xs text-foreground">
                                    {sub.name}
                                  </span>
                                </div>
                              </td>

                              {/* 2. Mã Code */}
                              <td className="py-2.5 px-2.5">
                                <span className="font-mono text-[10.5px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/50">
                                  {sub.code}
                                </span>
                              </td>

                              {/* 3. Phân Hệ / Nguồn Gốc */}
                              <td className="py-2.5 px-2.5">
                                {sub.origin === 'system' ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 font-medium">
                                    <Link2 className="h-3 w-3" />
                                    <span>⚙️ Hệ thống ({sub.systemModuleLabel || 'Tự động'})</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                    <Tag className="h-3 w-3 text-muted-foreground/60" />
                                    <span>Tác nghiệp nội bộ</span>
                                  </span>
                                )}
                              </td>

                              {/* 4. Ràng Buộc Tác Nghiệp */}
                              <td className="py-2.5 px-2.5">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {sub.requiresNote && (
                                    <span className="text-[10px] text-destructive bg-destructive/10 px-1.5 py-0.5 rounded font-medium border border-destructive/20">
                                      Bắt buộc ghi chú
                                    </span>
                                  )}
                                  {sub.suggestsCallback && (
                                    <span className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded font-medium border border-amber-200/60 dark:border-amber-900/40">
                                      Gợi ý hẹn ngày
                                    </span>
                                  )}
                                  {!sub.requiresNote && !sub.suggestsCallback && (
                                    <span className="text-[11px] text-muted-foreground/40 italic">—</span>
                                  )}
                                </div>
                              </td>

                              {/* 5. Mô Tả & Hướng Dẫn Sử Dụng */}
                              <td className="py-2.5 px-3">
                                <span
                                  className="text-[11px] text-muted-foreground line-clamp-1"
                                  title={sub.description || sub.systemEventTrigger || 'Nhãn theo dõi tiến trình chăm sóc khách hàng'}
                                >
                                  {sub.description || sub.systemEventTrigger || 'Nhãn theo dõi tiến trình chăm sóc khách hàng'}
                                </span>
                              </td>

                              {/* 6. Trạng Thái & Thao Tác */}
                              <td className="py-2.5 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Active Toggle */}
                                  {sub.origin === 'system' ? (
                                    <span
                                      className="text-[10.5px] px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 font-medium select-none"
                                      title="Nhãn hệ thống tự động kích hoạt theo module liên kết"
                                    >
                                      Tự động
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => onToggleSubStatusActive(stage.id, sub.id)}
                                      className={cn(
                                        'text-[10.5px] px-2 py-0.5 rounded-full border cursor-pointer font-medium transition-colors',
                                        sub.isActive
                                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300'
                                          : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                                      )}
                                      title={sub.isActive ? 'Nhấn để tạm dừng sử dụng nhãn này' : 'Nhấn để kích hoạt lại'}
                                    >
                                      {sub.isActive ? 'Đang dùng' : 'Tạm dừng'}
                                    </button>
                                  )}

                                  {/* Edit / View */}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEditSubStatus(stage, sub)}
                                    className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                                    title={sub.origin === 'system' ? 'Xem chi tiết nhãn hệ thống' : 'Sửa nhãn'}
                                  >
                                    {sub.origin === 'system' ? (
                                      <Eye className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                    ) : (
                                      <Edit2 className="h-3.5 w-3.5" />
                                    )}
                                  </Button>

                                  {/* Delete / Lock */}
                                  {sub.origin === 'system' || sub.isSystemCore ? (
                                    <div
                                      className="h-7 w-7 flex items-center justify-center text-muted-foreground/40"
                                      title="Nhãn liên kết hệ thống (cố định - không thể xóa)"
                                    >
                                      <Lock className="h-3 w-3" />
                                    </div>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => onDeleteSubStatus(stage.id, sub.id)}
                                      className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                      title="Xóa nhãn"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
