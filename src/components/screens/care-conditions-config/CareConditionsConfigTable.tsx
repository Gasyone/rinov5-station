'use client'

import React, { useState } from 'react'
import { Trash2, FileText, Power } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyState, ConfirmDialog } from '@/components/shared'
import { DataTablePagination } from '@/components/data-table'
import { CareConditionConfig } from './careConditionsTypes'
import { getConditionNatureBadge } from './careConditionsMockData'

interface CareConditionsConfigTableProps {
  conditions: CareConditionConfig[]
  onEditCondition: (item: CareConditionConfig) => void
  onToggleStatus: (id: string, newActive: boolean) => void
  onDeleteCondition: (id: string) => void
  onBatchToggleStatus?: (ids: string[], newActive: boolean) => void
  onBatchDelete?: (ids: string[]) => void
  pagination: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
  }
}

// Helper format chi tiết Tiêu chí theo dõi hiển thị đầy đủ thông số
function getDetailedMetricDisplay(item: CareConditionConfig): { mainText: string; subText: string } {
  const rule = item.triggerRule
  if (!rule) {
    return {
      mainText: item.name,
      subText: item.autoTriggerRule || 'Cấu hình quy tắc mặc định',
    }
  }

  if (rule.source === 'curriculum_path') {
    return {
      mainText: rule.metricLabel || 'Lộ trình - Khung chương trình',
      subText: 'Tự động kích hoạt tức thời khi diễn ra mốc buổi học trong môn',
    }
  }

  // Tiêu chí định lượng hoặc mốc sự kiện
  const opLabel = rule.operator === 'milestone' ? '' : rule.operatorLabel ? ` ${rule.operatorLabel}` : ''
  const valLabel = rule.operator !== 'milestone' && rule.thresholdValue !== undefined ? ` ${rule.thresholdValue} ${rule.metricUnit || ''}` : ''

  const mainText = `${rule.metricLabel}${opLabel}${valLabel}`
  
  const parts: string[] = []
  if (rule.windowRangeLabel) parts.push(rule.windowRangeLabel)
  if (rule.scopeLabel) parts.push(rule.scopeLabel)

  const subText = parts.length > 0 ? parts.join(' • ') : item.autoTriggerRule || ''

  return { mainText, subText }
}

export const CareConditionsConfigTable: React.FC<CareConditionsConfigTableProps> = ({
  conditions,
  onEditCondition,
  onToggleStatus,
  onDeleteCondition,
  onBatchToggleStatus,
  onBatchDelete,
  pagination,
}) => {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [batchDeleteConfirmOpen, setBatchDeleteConfirmOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const isAllSelected = conditions.length > 0 && selectedIds.length === conditions.length
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < conditions.length

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(conditions.map((c) => c.id))
    }
  }

  const handleToggleSelectRow = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  if (conditions.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="h-7 w-7 text-muted-foreground" />}
        title="Không tìm thấy điều kiện chăm sóc nào"
        description="Thay đổi từ khóa tìm kiếm hoặc chọn lại các bộ lọc để xem kết quả."
        className="py-10 border border-border rounded-lg bg-card"
      />
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden flex flex-col justify-between flex-1 min-h-0 shadow-2xs relative">
      {/* FLOATING BATCH ACTION BAR WHEN ROWS ARE CHECKED */}
      {selectedIds.length > 0 && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 flex items-center justify-between gap-3 text-xs font-bold shrink-0 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2 text-primary font-mono">
            <span>Đã chọn <strong className="text-foreground font-extrabold">{selectedIds.length}</strong> điều kiện</span>
          </div>

          <div className="flex items-center gap-2">
            {onBatchToggleStatus && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => onBatchToggleStatus(selectedIds, true)}
                  className="h-7 text-xs font-bold gap-1 cursor-pointer border-emerald-500/30 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300"
                >
                  <Power className="h-3 w-3" />
                  <span>Kích hoạt áp dụng ({selectedIds.length})</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => onBatchToggleStatus(selectedIds, false)}
                  className="h-7 text-xs font-bold gap-1 cursor-pointer border-zinc-300 text-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  <Power className="h-3 w-3" />
                  <span>Tạm dừng ({selectedIds.length})</span>
                </Button>
              </>
            )}

            {onBatchDelete && (
              <Button
                type="button"
                variant="destructive"
                size="xs"
                onClick={() => setBatchDeleteConfirmOpen(true)}
                className="h-7 text-xs font-bold gap-1 cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
                <span>Xóa hàng loạt ({selectedIds.length})</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Scrollable Table Container */}
      <div className="overflow-auto flex-1 min-h-0">
        <table className="w-full text-left text-xs border-collapse">
          {/* OPAQUE STICKY HEADER */}
          <thead className="sticky top-0 z-20 bg-muted/60 dark:bg-zinc-900 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-2.5 px-3 w-10 text-center">
                <Checkbox
                  checked={isAllSelected || (isSomeSelected ? 'indeterminate' : false)}
                  onCheckedChange={handleToggleSelectAll}
                  aria-label="Chọn tất cả"
                />
              </th>
              <th className="py-2.5 px-3 min-w-[280px]">Điều kiện phát sinh chăm sóc</th>
              <th className="py-2.5 px-3 min-w-[150px]">Nguồn chỉ số</th>
              <th className="py-2.5 px-3 min-w-[240px]">Tiêu chí theo dõi (Chi tiết thiết lập)</th>
              <th className="py-2.5 px-3 min-w-[120px]">Thời hạn SLA</th>
              <th className="py-2.5 px-3 min-w-[120px]">Tính chất</th>
              <th className="py-2.5 px-3 min-w-[130px]">Vai trò chính</th>
              <th className="py-2.5 px-3 min-w-[110px]">Mức ưu tiên</th>
              <th className="py-2.5 px-3 min-w-[100px]">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y text-foreground bg-card">
            {conditions.map((item) => {
              const isRowSelected = selectedIds.includes(item.id)
              const natureBadge = getConditionNatureBadge(item.nature)
              const metricDisplay = getDetailedMetricDisplay(item)

              return (
                <tr
                  key={item.id}
                  onClick={() => onEditCondition(item)}
                  className={`group transition-colors hover:bg-muted/40 cursor-pointer ${
                    isRowSelected ? 'bg-primary/5' : ''
                  } ${!item.isActive ? 'opacity-60 bg-muted/10' : ''}`}
                >
                  {/* 1. CHECKBOX */}
                  <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isRowSelected}
                      onCheckedChange={() => handleToggleSelectRow(item.id)}
                      aria-label={`Chọn điều kiện ${item.code}`}
                    />
                  </td>

                  {/* 2. ĐIỀU KIỆN PHÁT SINH (TÊN + MÃ ĐIỀU KIỆN Ở DƯỚI) */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center justify-between gap-2 max-w-[320px]">
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <span className="font-medium text-xs text-foreground group-hover:text-primary transition-colors">
                          {item.name}
                        </span>
                        
                        <span className="font-mono text-[11px] text-muted-foreground">
                          Mã: {item.code}
                        </span>
                      </div>

                      {/* NÚT BẬT/TẮT ÁP DỤNG & NÚT XÓA INLINE (HOVER MỚI HIỆN) */}
                      <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            onToggleStatus(item.id, !item.isActive)
                          }}
                          className={`h-6 w-6 p-0 cursor-pointer ${
                            item.isActive
                              ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                          title={item.isActive ? 'Đang áp dụng (Bấm để tạm dừng)' : 'Đang tạm dừng (Bấm để kích hoạt)'}
                        >
                          <Power className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteTargetId(item.id)
                          }}
                          className="h-6 w-6 p-0 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 cursor-pointer"
                          title="Xóa điều kiện chăm sóc"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </td>

                  {/* 3. NGUỒN CHỈ SỐ */}
                  <td className="py-2.5 px-3">
                    <span className="text-xs text-muted-foreground font-normal">
                      {item.triggerRule?.sourceLabel || 'Lộ trình - Khung chương trình'}
                    </span>
                  </td>

                  {/* 4. TIÊU CHÍ THEO DÕI */}
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-xs text-foreground">
                        {metricDisplay.mainText}
                      </span>
                      {metricDisplay.subText && (
                        <span className="text-[11px] text-muted-foreground line-clamp-1">
                          {metricDisplay.subText}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 5. THỜI HẠN SLA */}
                  <td className="py-2.5 px-3">
                    <span className="text-xs text-muted-foreground font-normal">{item.slaLabel}</span>
                  </td>

                  {/* 6. TÍNH CHẤT */}
                  <td className="py-2.5 px-3">
                    <Badge variant="outline" className={`text-[10.5px] font-medium px-2 py-0.5 ${natureBadge.badgeClass}`}>
                      {natureBadge.label}
                    </Badge>
                  </td>

                  {/* 7. VAI TRÒ PHỤ TRÁCH & QUY TẮC HOÀN THÀNH */}
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1 flex-wrap text-xs">
                        {(item.assignedRoles && item.assignedRoles.length > 0 ? item.assignedRoles : [item.primaryRole]).map((r) => (
                          <span
                            key={r}
                            className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-mono font-medium"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                      {item.assignedRoles && item.assignedRoles.length > 1 ? (
                        <span className="text-[10.5px] text-muted-foreground">
                          {item.completionPolicy === 'all_roles' ? '• Cần 2 vai trò (AND)' : '• 1 vai trò (OR)'}
                        </span>
                      ) : (
                        <span className="text-[10.5px] text-muted-foreground">
                          • 1 vai trò
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 8. MỨC ƯU TIÊN */}
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-foreground font-medium">
                      <span
                        className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                          item.priority === 'urgent'
                            ? 'bg-rose-500'
                            : item.priority === 'high'
                            ? 'bg-amber-500'
                            : item.priority === 'medium'
                            ? 'bg-sky-500'
                            : 'bg-zinc-400'
                        }`}
                      />
                      <span>
                        {item.priority === 'urgent'
                          ? 'Khẩn cấp'
                          : item.priority === 'high'
                          ? 'Cao'
                          : item.priority === 'medium'
                          ? 'Trung bình'
                          : 'Thường'}
                      </span>
                    </span>
                  </td>

                  {/* 9. TRẠNG THÁI */}
                  <td className="py-2.5 px-3">
                    <Badge
                      variant="outline"
                      className={`text-[10.5px] font-medium px-2 py-0.5 ${
                        item.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400'
                      }`}
                    >
                      {item.isActive ? 'Áp dụng' : 'Tạm dừng'}
                    </Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* FOOTER PAGINATION */}
      <DataTablePagination
        page={pagination.page}
        total={pagination.total}
        pageSize={pagination.pageSize}
        onPageChange={pagination.onPageChange}
        onPageSizeChange={pagination.onPageSizeChange}
        className="border-t border-border bg-card shrink-0 shadow-none py-2.5"
      />

      {/* CONFIRM DIALOG XÓA ĐIỀU KIỆN ĐƠN LẺ */}
      {deleteTargetId && (
        <ConfirmDialog
          open={!!deleteTargetId}
          onOpenChange={(open) => { if (!open) setDeleteTargetId(null) }}
          title="Xác nhận xóa điều kiện chăm sóc"
          description="Bạn có chắc chắn muốn xóa mã điều kiện này khỏi danh mục hệ thống? Hành động này sẽ ngưng kích hoạt các quy tắc tự động liên quan."
          confirmLabel="Xác nhận xóa"
          cancelLabel="Hủy bỏ"
          variant="destructive"
          onConfirm={() => {
            onDeleteCondition(deleteTargetId)
            setDeleteTargetId(null)
          }}
        />
      )}

      {/* CONFIRM DIALOG XÓA HÀNG LOẠT */}
      {batchDeleteConfirmOpen && onBatchDelete && (
        <ConfirmDialog
          open={batchDeleteConfirmOpen}
          onOpenChange={setBatchDeleteConfirmOpen}
          title={`Xác nhận xóa ${selectedIds.length} điều kiện chăm sóc`}
          description={`Bạn có chắc chắn muốn xóa ${selectedIds.length} mã điều kiện đang chọn khỏi danh mục? Hành động này không thể hoàn tác.`}
          confirmLabel={`Xóa ${selectedIds.length} điều kiện`}
          cancelLabel="Hủy bỏ"
          variant="destructive"
          onConfirm={() => {
            onBatchDelete(selectedIds)
            setSelectedIds([])
            setBatchDeleteConfirmOpen(false)
          }}
        />
      )}
    </div>
  )
}
