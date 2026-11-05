'use client'

import React, { useState, useMemo } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import {
  mockDailyCheckSubmissions,
  type DailyCheckShift,
} from '@/mocks/dailyCheck'
import { buildDynamicSubmissions } from './dailyCheckHelpers'
import { DailyCheckBranchOverviewStrip } from './DailyCheckBranchOverviewStrip'
import { DailyCheckExecutionView } from './DailyCheckExecutionView'
import { DailyCheckCatalogDialog } from './DailyCheckCatalogDialog'
import type { SkippedCriterionItem } from './DailyCheckSkippedSection'

export function DailyCheckScreen() {
  const authUser = useAuthStore((s) => s.user)
  const currentStaffName = authUser?.name || 'Nguyễn Thị Ngọc Ánh'

  // 1. Quản lý trạng thái cơ sở & ca trực đang chọn
  const [executionBranch, setExecutionBranch] = useState<string>('CS1 Linh Đàm')
  const [executionShift, setExecutionShift] = useState<DailyCheckShift>('dau_ca')
  const [manualEvals, setManualEvals] = useState<Record<string, 'pass' | 'fail'>>({})
  const [itemEvidence, setItemEvidence] = useState<Record<string, string[]>>({})
  const [categoryEvidence, setCategoryEvidence] = useState<Record<string, string[]>>({})
  const [skippedCategories, setSkippedCategories] = useState<string[]>([])
  const [skippedCriteria, setSkippedCriteria] = useState<SkippedCriterionItem[]>([])

  // Modal State
  const [isCatalogOpen, setIsCatalogOpen] = useState(false)

  // 2. Dữ liệu đánh giá động: Đồng bộ dữ liệu lịch sử tuần
  const computedSubmissions = useMemo(() => {
    return buildDynamicSubmissions({
      baseSubmissions: mockDailyCheckSubmissions,
      manualEvals,
      itemEvidence,
      categoryEvidence,
      skippedCategories,
      skippedCriteria,
      currentStaffName,
    })
  }, [manualEvals, itemEvidence, categoryEvidence, skippedCategories, skippedCriteria, currentStaffName])

  return (
    <div className="flex flex-col h-full min-h-0 gap-2 px-2 py-2 lg:px-3 text-left">
      {/* ─── SECTION 1: DẢI GIÁM SÁT 5 CƠ SỞ TRÊN CÙNG (NHẤT THỂ HÓA 1 MÀN HÌNH, THU GỌN ĐƯỢC) ─── */}
      <DailyCheckBranchOverviewStrip
        submissions={computedSubmissions}
        selectedBranch={executionBranch}
        onSelectBranch={setExecutionBranch}
        currentDateStr="2026-10-29"
      />

      {/* ─── SECTION 2: BẢNG MA TRẬN THỰC THI & TIÊU CHUẨN 9 KHU VỰC ─── */}
      <div className="flex-1 min-h-0 flex flex-col">
        <DailyCheckExecutionView
          submissions={computedSubmissions}
          selectedBranch={executionBranch}
          onBranchChange={setExecutionBranch}
          selectedShift={executionShift}
          onShiftChange={setExecutionShift}
          manualEvals={manualEvals}
          onManualEvalsChange={setManualEvals}
          itemEvidence={itemEvidence}
          onItemEvidenceChange={setItemEvidence}
          categoryEvidence={categoryEvidence}
          onCategoryEvidenceChange={setCategoryEvidence}
          skippedCategories={skippedCategories}
          onSkippedCategoriesChange={setSkippedCategories}
          skippedCriteria={skippedCriteria}
          onSkippedCriteriaChange={setSkippedCriteria}
          currentStaffName={currentStaffName}
          onOpenCatalog={() => setIsCatalogOpen(true)}
        />
      </div>

      {/* ─── HỘP THOẠI QUY CHUẨN DANH MỤC 5 SAO ─── */}
      <DailyCheckCatalogDialog
        open={isCatalogOpen}
        onOpenChange={setIsCatalogOpen}
      />
    </div>
  )
}
