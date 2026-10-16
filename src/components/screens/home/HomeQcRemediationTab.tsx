'use client'

import React, { useState, useMemo } from 'react'
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  User,
  Wrench,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type { QcExtendedError } from '@/components/screens/qc-remediation/qcRemediationTypes'
import {
  isErrorOverdue,
  getErrorBadgeSemantic,
} from '@/components/screens/qc-remediation/qcRemediationTypes'
import {
  QC_ERROR_SEVERITY_LABELS,
  QC_ERROR_STATUS_LABELS,
  QC_ERROR_TYPE_LABELS,
} from '@/mocks/qcChecks'
import type { HomeQcMetrics } from './homeTypes'

interface HomeQcRemediationTabProps {
  errors: QcExtendedError[]
  metrics: HomeQcMetrics
  onOpenDetail: (error: QcExtendedError) => void
  onNavigateQc: () => void
}

type FilterChip = 'all' | 'pending' | 'overdue' | 'critical' | 'corrected'

export function HomeQcRemediationTab({
  errors,
  metrics,
  onOpenDetail,
  onNavigateQc,
}: HomeQcRemediationTabProps) {
  const [activeFilter, setActiveFilter] = useState<FilterChip>('pending')

  const filteredErrors = useMemo(() => {
    return errors.filter((err) => {
      const isOverdue = isErrorOverdue(err) && err.status !== 'closed' && err.status !== 'cancelled'
      if (activeFilter === 'pending') {
        return err.status === 'open' || err.status === 'correcting' || err.status === 'not_met'
      }
      if (activeFilter === 'overdue') {
        return isOverdue
      }
      if (activeFilter === 'critical') {
        return err.severity === 'critical' || err.severity === 'high'
      }
      if (activeFilter === 'corrected') {
        return err.status === 'corrected'
      }
      return true
    })
  }, [errors, activeFilter])

  return (
    <div className="flex-1 min-h-0 flex flex-col space-y-2">
      {/* 1. KHỐI THỐNG KÊ QC TÁC NGHIỆP NHANH (4 CHỈ SỐ CƠ BẢN) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 shrink-0 px-0.5">
        {/* Card 1: Cần khắc phục */}
        <button
          type="button"
          onClick={() => setActiveFilter('pending')}
          className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
            activeFilter === 'pending'
              ? 'border-amber-500/50 bg-amber-500/10 shadow-2xs'
              : 'border-border/60 bg-muted/20 hover:bg-muted/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-normal">Cần xử lý</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-base font-semibold text-foreground tracking-tight">
              {metrics.pending}
            </span>
            <span className="text-xs text-muted-foreground font-normal">lỗi</span>
          </div>
        </button>

        {/* Card 2: Quá hạn xử lý */}
        <button
          type="button"
          onClick={() => setActiveFilter('overdue')}
          className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
            activeFilter === 'overdue'
              ? 'border-rose-500/50 bg-rose-500/10 shadow-2xs'
              : 'border-border/60 bg-muted/20 hover:bg-muted/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-normal">Quá hạn</span>
            <Clock className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-base font-semibold text-rose-600 dark:text-rose-400 tracking-tight">
              {metrics.overdue}
            </span>
            <span className="text-xs text-rose-600/80 dark:text-rose-400/80 font-normal">trễ hạn</span>
          </div>
        </button>

        {/* Card 3: Mức nghiêm trọng */}
        <button
          type="button"
          onClick={() => setActiveFilter('critical')}
          className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
            activeFilter === 'critical'
              ? 'border-violet-500/50 bg-violet-500/10 shadow-2xs'
              : 'border-border/60 bg-muted/20 hover:bg-muted/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-normal">Nghiêm trọng</span>
            <ShieldAlert className="w-3.5 h-3.5 text-violet-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-base font-semibold text-violet-600 dark:text-violet-400 tracking-tight">
              {metrics.critical}
            </span>
            <span className="text-xs text-muted-foreground font-normal">lỗi cao</span>
          </div>
        </button>

        {/* Card 4: Chờ nghiệm thu */}
        <button
          type="button"
          onClick={() => setActiveFilter('corrected')}
          className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
            activeFilter === 'corrected'
              ? 'border-emerald-500/50 bg-emerald-500/10 shadow-2xs'
              : 'border-border/60 bg-muted/20 hover:bg-muted/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-normal">Chờ duyệt</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-base font-semibold text-emerald-600 dark:text-emerald-400 tracking-tight">
              {metrics.corrected}
            </span>
            <span className="text-xs text-muted-foreground font-normal">đã sửa</span>
          </div>
        </button>
      </div>

      {/* 2. CHIP LỌC NHANH & LINK VÀO PHÂN HỆ QC */}
      <div className="flex items-center justify-between gap-1.5 shrink-0 px-0.5">
        <div className="flex items-center gap-1 flex-wrap text-xs">
          <button
            type="button"
            onClick={() => setActiveFilter('pending')}
            className={`px-2 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
              activeFilter === 'pending'
                ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 font-medium border border-amber-500/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            Cần xử lý ({metrics.pending})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('overdue')}
            className={`px-2 py-0.5 rounded text-xs leading-none transition-all cursor-pointer flex items-center gap-0.5 ${
              activeFilter === 'overdue'
                ? 'bg-rose-500/15 text-rose-800 dark:text-rose-300 font-medium border border-rose-500/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            Quá hạn ({metrics.overdue})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('critical')}
            className={`px-2 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
              activeFilter === 'critical'
                ? 'bg-violet-500/15 text-violet-800 dark:text-violet-300 font-medium border border-violet-500/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            Nghiêm trọng ({metrics.critical})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-2 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            Tất cả ({errors.length})
          </button>
        </div>

        <button
          type="button"
          onClick={onNavigateQc}
          className="text-xs text-primary hover:underline flex items-center gap-0.5 shrink-0 cursor-pointer"
        >
          <span>Trang QC</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      {/* 3. DANH SÁCH CÁC ĐẦU MỤC QC CẦN KHẮC PHỤC */}
      {filteredErrors.length === 0 ? (
        <EmptyState
          title="Không có lỗi QC nào trong mục đã chọn"
          description="Tất cả các tiêu chuẩn kiểm tra chất lượng tại cơ sở đang được duy trì tốt."
          className="py-6 text-xs flex-1"
        />
      ) : (
        <div className="space-y-1.5 flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
          {filteredErrors.map((err) => {
            const isOverdue = isErrorOverdue(err) && err.status !== 'closed' && err.status !== 'cancelled'
            const semanticStatus = getErrorBadgeSemantic(err)

            return (
              <div
                key={err.id}
                onClick={() => onOpenDetail(err)}
                className={`rounded-lg border px-2.5 py-2 transition-all space-y-1 shadow-3xs cursor-pointer group ${
                  isOverdue
                    ? 'border-l-4 border-l-rose-500 border-border/70 bg-rose-500/5 dark:bg-rose-500/10 hover:bg-rose-500/15'
                    : err.severity === 'critical'
                    ? 'border-l-4 border-l-violet-500 border-border/70 bg-violet-500/5 dark:bg-violet-500/10 hover:bg-violet-500/15'
                    : 'border-border/70 bg-card/80 hover:bg-muted/50'
                }`}
              >
                {/* HÀNG 1: Mã lỗi, Hạng mục, Mức độ nghiêm trọng, Trạng thái & Hạn xử lý */}
                <div className="flex items-center justify-between gap-1.5 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 flex-wrap">
                    <span className="font-mono text-xs font-semibold text-foreground/90 shrink-0">
                      {err.code}
                    </span>

                    <span className="text-xs px-1.5 py-0.2 rounded bg-muted/80 text-muted-foreground font-normal shrink-0">
                      {QC_ERROR_TYPE_LABELS[err.errorType] || err.errorType}
                    </span>

                    <Badge
                      variant="outline"
                      className={`text-xs px-1.5 py-0 rounded font-normal shrink-0 ${
                        err.severity === 'critical'
                          ? 'border-red-300 text-red-700 bg-red-50 dark:bg-red-950/60 dark:text-red-300'
                          : err.severity === 'high'
                          ? 'border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'border-zinc-300 text-zinc-600 bg-zinc-50 dark:bg-zinc-800'
                      }`}
                    >
                      {QC_ERROR_SEVERITY_LABELS[err.severity] || err.severity}
                    </Badge>

                    <Badge
                      variant="outline"
                      className={`text-xs px-1.5 py-0 rounded font-normal shrink-0 ${getStatusBadgeClass(
                        semanticStatus
                      )}`}
                    >
                      {isOverdue ? 'Quá hạn' : QC_ERROR_STATUS_LABELS[err.status] || err.status}
                    </Badge>
                  </div>

                  {/* Thời hạn deadline */}
                  {err.deadline && (
                    <div
                      className={`text-xs flex items-center gap-1 shrink-0 ${
                        isOverdue
                          ? 'text-rose-600 dark:text-rose-400 font-medium'
                          : 'text-muted-foreground font-normal'
                      }`}
                    >
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>
                        Hạn: {new Date(err.deadline).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                      </span>
                    </div>
                  )}
                </div>

                {/* HÀNG 2: Tiêu đề mục lỗi vi phạm & Mô tả ngắn */}
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {err.itemLabel}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {err.description}
                  </p>
                </div>

                {/* HÀNG 3: Người phụ trách & Biện pháp khắc phục */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1 truncate max-w-[200px]">
                    <User className="w-3 h-3 text-muted-foreground/70 shrink-0" />
                    <span className="truncate">
                      {err.assignee || 'Chưa phân công'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {err.correctiveAction ? (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                        <Wrench className="w-3 h-3 shrink-0" />
                        <span>Đã có biện pháp</span>
                      </span>
                    ) : (
                      <span className="text-xs text-amber-600 dark:text-amber-400">
                        Chờ lập phương án
                      </span>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpenDetail(err)
                      }}
                      className="h-5 px-1.5 text-xs text-primary hover:bg-primary/10 rounded"
                    >
                      <span>Khắc phục</span>
                      <ArrowUpRight className="w-3 h-3 ml-0.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
