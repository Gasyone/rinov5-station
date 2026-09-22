'use client'

import React from 'react'
import {
  Compass,
  Calendar,
  User,
  BookOpen,
  Share2,
  FileText,
  RotateCcw,
  Sparkles,
  GraduationCap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import type { FamilyLeadOccurrence } from '../crmFamily360Types'

interface CrmFamilyLeadsTabProps {
  occurrences: FamilyLeadOccurrence[]
  onReactivateLead?: () => void
}

export function CrmFamilyLeadsTab({
  occurrences,
  onReactivateLead,
}: CrmFamilyLeadsTabProps) {
  return (
    <div className="space-y-3.5">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 p-3 bg-card border border-border/70 rounded-xl shadow-2xs flex-wrap">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-500/20">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">
              Lịch sử các đợt tiếp cận Lead của gia đình ({occurrences.length} đợt)
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Theo dõi chu kỳ tiếp cận, tư vấn tuyển sinh và chăm sóc qua từng thời kỳ
            </p>
          </div>
        </div>

        {onReactivateLead && (
          <Button
            type="button"
            size="sm"
            onClick={onReactivateLead}
            className="h-7 px-3 text-xs bg-purple-600 hover:bg-purple-700 text-white shadow-2xs font-semibold"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            <span>Kích hoạt đợt tiếp cận mới</span>
          </Button>
        )}
      </div>

      {/* Danh sách các lần tiếp cận */}
      <div className="space-y-3">
        {occurrences.map((cycle) => (
          <div
            key={cycle.id}
            className={cn(
              'rounded-xl border p-3.5 space-y-2.5 transition-all shadow-2xs',
              cycle.isCurrent
                ? 'border-purple-300 dark:border-purple-800 bg-purple-50/20 dark:bg-purple-950/10 ring-1 ring-purple-200 dark:ring-purple-900/30'
                : 'border-border/70 bg-card'
            )}
          >
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[11px] font-bold">
                  {cycle.cycleNumber}
                </span>
                <h5 className="text-xs font-bold text-foreground">{cycle.title}</h5>
                {cycle.childName && (
                  <Badge variant="outline" className="text-[10px] bg-muted/40 font-medium">
                    <GraduationCap className="h-2.5 w-2.5 mr-0.5 text-indigo-600" />
                    {cycle.childName}
                  </Badge>
                )}
                {cycle.isCurrent && (
                  <Badge className="bg-purple-600 text-white text-[10px] py-0 px-1.5 font-bold flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5" />
                    <span>Đợt hiện tại</span>
                  </Badge>
                )}
              </div>

              <Badge className={getStatusBadgeClass(cycle.status)}>
                {cycle.statusLabel}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
              <div className="space-y-0.5">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground/70" />
                  Thời gian tiếp cận
                </span>
                <p className="font-medium text-foreground">
                  {cycle.startDate} {cycle.endDate ? `→ ${cycle.endDate}` : ''}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Share2 className="h-3 w-3 text-sky-600" />
                  Kênh tiếp nhận
                </span>
                <p className="font-medium text-foreground">{cycle.channel}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3 text-amber-600" />
                  Tư vấn viên (Sales)
                </span>
                <p className="font-medium text-foreground truncate" title={cycle.assignedSales}>
                  {cycle.assignedSales}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <BookOpen className="h-3 w-3 text-emerald-600" />
                  Khóa học quan tâm
                </span>
                <p className="font-medium text-foreground truncate" title={cycle.productInterest}>
                  {cycle.productInterest}
                </p>
              </div>
            </div>

            {cycle.outcomeNote && (
              <div className="pt-2 border-t border-border/50 text-xs flex items-start gap-1.5 bg-muted/30 p-2 rounded-lg">
                <FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <span className="font-semibold text-foreground mr-1.5">Ghi chú diễn biến:</span>
                  <span className="text-muted-foreground leading-relaxed">
                    {cycle.outcomeNote}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
