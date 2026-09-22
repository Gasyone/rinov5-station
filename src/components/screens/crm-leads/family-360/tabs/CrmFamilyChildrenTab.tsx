'use client'

import React, { useState } from 'react'
import {
  GraduationCap,
  Plus,
  Compass,
  ShoppingBag,
  CircleDollarSign,
  User,
  Calendar,
  Share2,
  FileText,
  RotateCcw,
  Sparkles,
  BookOpen,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import type { FamilyChildItem, FamilyLeadOccurrence } from '../crmFamily360Types'

interface CrmFamilyChildrenTabProps {
  childrenList: FamilyChildItem[]
  leadOccurrences?: FamilyLeadOccurrence[]
  onSelectChild?: (childId: string) => void
  onAddChild?: () => void
  onReactivateLead?: () => void
}

export function CrmFamilyChildrenTab({
  childrenList,
  leadOccurrences = [],
  onSelectChild,
  onAddChild,
  onReactivateLead,
}: CrmFamilyChildrenTabProps) {
  const [selectedId, setSelectedId] = useState<string>(
    childrenList[0]?.id || ''
  )

  const activeChild =
    childrenList.find((c) => c.id === selectedId) || childrenList[0] || null

  const handleSelect = (id: string) => {
    setSelectedId(id)
    onSelectChild?.(id)
  }

  if (!activeChild) {
    return (
      <div className="p-8 text-center text-muted-foreground bg-card rounded-xl border border-border">
        <GraduationCap className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
        <p className="text-sm">Chưa có thông tin học viên (con) trong gia đình.</p>
        {onAddChild && (
          <Button size="sm" onClick={onAddChild} className="mt-3 cursor-pointer">
            <Plus className="h-4 w-4 mr-1" /> Thêm con vào gia đình
          </Button>
        )}
      </div>
    )
  }

  // Lọc lịch sử tiếp cận theo học viên đang chọn (hoặc các đợt liên quan)
  const childOccurrences = leadOccurrences.filter((occ) => {
    if (!occ.childName) return true
    return (
      occ.childName.toLowerCase().includes(activeChild.name.toLowerCase()) ||
      activeChild.name.toLowerCase().includes(occ.childName.toLowerCase())
    )
  })

  // Nếu lọc không có đợt riêng nào, hiển thị danh sách đợt chung của gia đình
  const displayOccurrences = childOccurrences.length > 0 ? childOccurrences : leadOccurrences

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
      {/* ============================================================ */}
      {/* CỘT TRÁI (PANEL CHÍNH, NHỎ ~ col-span-4): DANH SÁCH & TÓM TẮT */}
      {/* ============================================================ */}
      <div className="lg:col-span-4 space-y-3">
        {/* Khối 1: Danh sách các con trong gia đình */}
        <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-border/60">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
              Các con trong gia đình ({childrenList.length} bé)
            </span>
            {onAddChild && (
              <button
                type="button"
                onClick={onAddChild}
                className="h-6 px-2 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer border border-dashed border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 shrink-0"
              >
                <Plus className="h-3 w-3" />
                <span>Thêm con</span>
              </button>
            )}
          </div>

          {/* Selector từng con */}
          <div className="space-y-1.5">
            {childrenList.map((child, idx) => {
              const isSelected = child.id === activeChild.id
              return (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => handleSelect(child.id)}
                  className={cn(
                    'w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-center justify-between gap-2 cursor-pointer border',
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 shadow-2xs ring-1 ring-indigo-300/60 dark:ring-indigo-800'
                      : 'bg-background hover:bg-muted/60 border-border/70 text-foreground'
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold shrink-0',
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground truncate text-xs">
                          {child.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          ({child.age} tuổi)
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground block truncate">
                        {child.currentSchool || 'Chưa cập nhật trường'}
                      </span>
                    </div>
                  </div>

                  {child.isCurrent && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200 font-bold uppercase shrink-0">
                      Đang care
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Khối 2: Thẻ tóm tắt học viên đang chọn */}
        <div className="rounded-xl border border-border/70 bg-card p-3 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-indigo-600" />
              Tóm tắt học viên
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              Mã: {activeChild.customerCode}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 shrink-0">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-foreground truncate">{activeChild.name}</h4>
                <p className="text-[11px] text-muted-foreground">
                  Sinh năm {activeChild.birthYear} ({activeChild.age} tuổi)
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Trường học:</span>
                <span className="font-medium text-foreground truncate max-w-[170px]" title={activeChild.currentSchool}>
                  {activeChild.currentSchool || 'Chưa cập nhật'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Trạng thái học tập:</span>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 border-emerald-200 text-[10px] py-0"
                >
                  Đang theo học
                </Badge>
              </div>
            </div>

            {/* Thống kê đơn hàng & chi tiêu của bé */}
            <div className="pt-2 border-t border-border/60 grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-lg bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/50">
                <div className="flex items-center justify-center gap-1 text-[10px] text-amber-800 dark:text-amber-300 font-medium">
                  <ShoppingBag className="h-3 w-3" />
                  <span>Đơn hàng</span>
                </div>
                <span className="text-sm font-bold text-foreground">
                  {activeChild.totalOrdersCount || 0}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/50">
                <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-800 dark:text-emerald-300 font-medium">
                  <CircleDollarSign className="h-3 w-3" />
                  <span>Tích lũy</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 truncate block">
                  {activeChild.totalOrdersAmount || '0đ'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CỘT PHẢI (PANEL LỚN ~ col-span-8): THÔNG TIN & LỊCH SỬ TIẾP CẬN */}
      {/* ============================================================ */}
      <div className="lg:col-span-8 space-y-3.5">
        {/* Khối 1: Thông tin học tập & Định vị tác nghiệp */}
        <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-3 shadow-2xs">
          <div className="pb-1.5 border-b border-border/60 flex items-center justify-between">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
              <span>Thông tin học tập &amp; Định vị tác nghiệp ({activeChild.name})</span>
            </h4>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
              Khóa: {activeChild.course}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[11px] text-muted-foreground block">Học lực / Phản xạ</span>
              <p className="font-semibold text-foreground">
                {activeChild.academicPerformance || 'Khá / Phản xạ tốt'}
              </p>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">Tài khoản Vuihoc</span>
              <p className="font-mono font-medium text-purple-700 dark:text-purple-300">
                {activeChild.vuihocAccount || 'Chưa liên kết'}
              </p>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">SĐT riêng của con (nếu có)</span>
              <p className="font-mono text-foreground">{activeChild.phone || 'Chưa có SĐT riêng'}</p>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">Loại hình đào tạo</span>
              <p className="font-semibold text-foreground">{activeChild.customerType}</p>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">Nhóm ngành</span>
              <p className="font-semibold text-foreground">{activeChild.industryGroup}</p>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">Nhóm sản phẩm</span>
              <p className="font-medium text-foreground truncate" title={activeChild.selectedProductGroups?.join(', ')}>
                {activeChild.selectedProductGroups?.join(', ') || 'Tiếng Anh Thiếu Nhi'}
              </p>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">Nguồn tiếp nhận</span>
              <p className="font-medium text-foreground truncate" title={activeChild.selectedSources?.join(', ')}>
                {activeChild.selectedSources?.join(', ') || 'Web Rinoedu'}
              </p>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">Tư vấn phụ trách (Sales)</span>
              <p className="font-semibold text-foreground truncate" title={activeChild.selectedStaff?.join(', ')}>
                {activeChild.selectedStaff?.join(', ') || 'Trần Thị Mai'}
              </p>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">Nhân viên marketing</span>
              <p className="font-medium text-foreground truncate" title={activeChild.marketingStaff}>
                {activeChild.marketingStaff || 'Nguyễn Thị Lan (Marketing)'}
              </p>
            </div>
          </div>
        </div>

        {/* Khối 2: Lịch sử tiếp cận của học viên (Gộp lịch sử tiếp cận theo học viên) */}
        <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-3 shadow-2xs">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-500/20">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  Lịch sử tiếp cận &amp; Tư vấn của {activeChild.name} ({displayOccurrences.length} đợt)
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Chu kỳ tiếp cận, chăm sóc tuyển sinh và các lần liên hệ cho bé
                </p>
              </div>
            </div>

            {onReactivateLead && (
              <Button
                type="button"
                size="sm"
                onClick={onReactivateLead}
                className="h-6.5 px-2.5 text-xs bg-purple-600 hover:bg-purple-700 text-white shadow-2xs font-semibold cursor-pointer"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                <span>Kích hoạt đợt tiếp cận mới</span>
              </Button>
            )}
          </div>

          {/* Danh sách các đợt tiếp cận */}
          {displayOccurrences.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-xs">
              Chưa có lịch sử tiếp cận nào cho học viên này.
            </div>
          ) : (
            <div className="space-y-2.5">
              {displayOccurrences.map((cycle) => (
                <div
                  key={cycle.id}
                  className={cn(
                    'rounded-xl border p-3 space-y-2 transition-all shadow-2xs text-xs',
                    cycle.isCurrent
                      ? 'border-purple-300 dark:border-purple-800 bg-purple-50/20 dark:bg-purple-950/10 ring-1 ring-purple-200 dark:ring-purple-900/30'
                      : 'border-border/70 bg-card'
                  )}
                >
                  <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-border/60 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-bold">
                        {cycle.cycleNumber}
                      </span>
                      <h5 className="text-xs font-bold text-foreground">{cycle.title}</h5>
                      {cycle.isCurrent && (
                        <Badge className="bg-purple-600 text-white text-[9px] py-0 px-1.5 font-bold flex items-center gap-1">
                          <Sparkles className="h-2.5 w-2.5" />
                          <span>Đợt hiện tại</span>
                        </Badge>
                      )}
                    </div>

                    <Badge className={getStatusBadgeClass(cycle.status)}>
                      {cycle.statusLabel}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground/70" />
                        Thời gian tiếp cận
                      </span>
                      <p className="font-medium text-foreground">
                        {cycle.startDate} {cycle.endDate ? `→ ${cycle.endDate}` : ''}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Share2 className="h-3 w-3 text-sky-600" />
                        Kênh tiếp nhận
                      </span>
                      <p className="font-medium text-foreground">{cycle.channel}</p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3 text-amber-600" />
                        Tư vấn viên (Sales)
                      </span>
                      <p className="font-medium text-foreground truncate" title={cycle.assignedSales}>
                        {cycle.assignedSales}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-3 w-3 text-emerald-600" />
                        Khóa học quan tâm
                      </span>
                      <p className="font-medium text-foreground truncate" title={cycle.productInterest}>
                        {cycle.productInterest}
                      </p>
                    </div>
                  </div>

                  {cycle.outcomeNote && (
                    <div className="pt-1.5 border-t border-border/50 text-[11px] flex items-start gap-1.5 bg-muted/30 p-1.5 rounded-md">
                      <FileText className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-semibold text-foreground mr-1">Ghi chú diễn biến:</span>
                        <span className="text-muted-foreground leading-relaxed">
                          {cycle.outcomeNote}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
