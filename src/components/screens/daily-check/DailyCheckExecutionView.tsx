'use client'

import React, { useState, useMemo } from 'react'
import { toast } from 'sonner'
import {
  DAILY_CATALOG_ITEMS,
  DAILY_CLOSING_TASKS,
  type DailyCheckSubmission,
  type DailyCheckShift,
} from '@/mocks/dailyCheck'
import {
  getWeekDates,
  groupCatalogByCategory,
  groupClosingTasksByCategory,
  getMockHistoricalPhotos,
} from './dailyCheckHelpers'
import {
  DailyCheckExecutionToolbar,
  type ShiftProgressStats,
} from './DailyCheckExecutionToolbar'
import {
  DailyCheckExecutionTable,
  type EvidenceTargetData,
  type DailyDaySummaryScore,
} from './DailyCheckExecutionTable'
import {
  DailyCheckSkippedSection,
  type SkippedCriterionItem,
} from './DailyCheckSkippedSection'
import { DailyCheckEvidenceDialog } from './DailyCheckEvidenceDialog'
import {
  DailyCheckStandardDialog,
  type DailyStandardTarget,
} from './DailyCheckStandardDialog'

export interface DailyCheckExecutionViewProps {
  submissions: DailyCheckSubmission[]
  selectedBranch?: string
  onBranchChange?: (branch: string) => void
  selectedShift?: DailyCheckShift
  onShiftChange?: (shift: DailyCheckShift) => void
  manualEvals?: Record<string, 'pass' | 'fail'>
  onManualEvalsChange?: React.Dispatch<React.SetStateAction<Record<string, 'pass' | 'fail'>>>
  itemEvidence?: Record<string, string[]>
  onItemEvidenceChange?: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
  categoryEvidence?: Record<string, string[]>
  onCategoryEvidenceChange?: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
  skippedCategories?: string[]
  onSkippedCategoriesChange?: React.Dispatch<React.SetStateAction<string[]>>
  skippedCriteria?: SkippedCriterionItem[]
  onSkippedCriteriaChange?: React.Dispatch<React.SetStateAction<SkippedCriterionItem[]>>
  onSaveNewSubmission?: (sub: DailyCheckSubmission) => void
  currentStaffName?: string
  onOpenCatalog?: () => void
}

export function DailyCheckExecutionView({
  submissions,
  selectedBranch: propSelectedBranch,
  onBranchChange,
  selectedShift: propSelectedShift,
  onShiftChange,
  manualEvals: propManualEvals,
  onManualEvalsChange,
  itemEvidence: propItemEvidence,
  onItemEvidenceChange,
  categoryEvidence: propCategoryEvidence,
  onCategoryEvidenceChange,
  skippedCategories: propSkippedCategories,
  onSkippedCategoriesChange,
  skippedCriteria: propSkippedCriteria,
  onSkippedCriteriaChange,
  onOpenCatalog,
}: DailyCheckExecutionViewProps) {
  // 1. Branch, Shift & Week Selection (Controlled with fallback)
  const [internalBranch, setInternalBranch] = useState<string>('CS1 Linh Đàm')
  const [internalShift, setInternalShift] = useState<DailyCheckShift>('dau_ca')
  const selectedBranch = propSelectedBranch ?? internalBranch
  const setSelectedBranch = (b: string) => {
    if (onBranchChange) onBranchChange(b)
    else setInternalBranch(b)
  }
  const selectedShift = propSelectedShift ?? internalShift
  const setSelectedShift = (s: DailyCheckShift) => {
    if (onShiftChange) onShiftChange(s)
    else setInternalShift(s)
  }

  const [weekOffset, setWeekOffset] = useState<number>(0)

  // 2. Dates of selected week (Reference date: 2026-10-29 - T5)
  const weekDays = useMemo(() => {
    const baseDate = new Date(2026, 9, 29)
    baseDate.setDate(baseDate.getDate() + weekOffset * 7)
    const refStr = `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, '0')}-${String(baseDate.getDate()).padStart(2, '0')}`
    return getWeekDates(refStr)
  }, [weekOffset])

  const weekRangeLabel = useMemo(() => {
    if (weekDays.length === 0) return ''
    const start = weekDays[0]
    const end = weekDays[6]
    return `${start.dayOfMonth}/${start.dateStr.split('-')[1]} - ${end.dayOfMonth}/${end.dateStr.split('-')[1]}/2026`
  }, [weekDays])

  // 3. Raw Catalogs
  const daytimeGrouped = useMemo(() => groupCatalogByCategory(DAILY_CATALOG_ITEMS), [])
  const closingGrouped = useMemo(() => groupClosingTasksByCategory(DAILY_CLOSING_TASKS), [])

  // 4. Overrides for Today (Controlled with fallback)
  const [internalManualEvals, setInternalManualEvals] = useState<Record<string, 'pass' | 'fail'>>({})
  const manualEvals = propManualEvals ?? internalManualEvals
  const setManualEvals = onManualEvalsChange ?? setInternalManualEvals

  // 5. Evidence Photos (Controlled with fallback)
  const [internalItemEvidence, setInternalItemEvidence] = useState<Record<string, string[]>>({})
  const itemEvidence = propItemEvidence ?? internalItemEvidence
  const setItemEvidence = onItemEvidenceChange ?? setInternalItemEvidence

  const [internalCategoryEvidence, setInternalCategoryEvidence] = useState<Record<string, string[]>>({})
  const categoryEvidence = propCategoryEvidence ?? internalCategoryEvidence
  const setCategoryEvidence = onCategoryEvidenceChange ?? setInternalCategoryEvidence

  const [evidenceTarget, setEvidenceTarget] = useState<EvidenceTargetData | null>(null)
  const [standardTarget, setStandardTarget] = useState<DailyStandardTarget | null>(null)

  // 6. Collapsed Categories state
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([])

  // 7. Skipped items (Controlled with fallback)
  const [internalSkippedCategories, setInternalSkippedCategories] = useState<string[]>([])
  const skippedCategories = propSkippedCategories ?? internalSkippedCategories
  const setSkippedCategories = onSkippedCategoriesChange ?? setInternalSkippedCategories

  const [internalSkippedCriteria, setInternalSkippedCriteria] = useState<SkippedCriterionItem[]>([])
  const skippedCriteria = propSkippedCriteria ?? internalSkippedCriteria
  const setSkippedCriteria = onSkippedCriteriaChange ?? setInternalSkippedCriteria

  const [isSkippedSectionOpen, setIsSkippedSectionOpen] = useState(false)

  // Check if today already has a saved submission
  const existingTodaySub = useMemo(() => {
    return submissions.find(
      (s) => s.branch === selectedBranch && s.shift === selectedShift && s.date === '2026-10-29'
    )
  }, [submissions, selectedBranch, selectedShift])

  // 8. Active (Filtered) Catalogs
  const activeDaytimeGrouped = useMemo(() => {
    const res: Record<string, typeof DAILY_CATALOG_ITEMS> = {}
    const skippedCritNames = new Set(skippedCriteria.map((c) => c.name))

    for (const [grp, items] of Object.entries(daytimeGrouped)) {
      if (!skippedCategories.includes(grp)) {
        const filtered = items.filter((it) => !skippedCritNames.has(it.detail))
        if (filtered.length > 0) {
          res[grp] = filtered
        }
      }
    }
    return res
  }, [daytimeGrouped, skippedCategories, skippedCriteria])

  const activeClosingGrouped = useMemo(() => {
    const res: Record<string, typeof DAILY_CLOSING_TASKS> = {}
    const skippedCritNames = new Set(skippedCriteria.map((c) => c.name))

    for (const [grp, tasks] of Object.entries(closingGrouped)) {
      if (!skippedCategories.includes(grp)) {
        const filtered = tasks.filter((t) => !skippedCritNames.has(t.name))
        if (filtered.length > 0) {
          res[grp] = filtered
        }
      }
    }
    return res
  }, [closingGrouped, skippedCategories, skippedCriteria])

  // 9. Status Helpers for Today
  const getItemTodayStatus = (itemName: string): 'pass' | 'fail' | 'pending' => {
    const key = `${selectedBranch}-${selectedShift}-${itemName}`
    if (manualEvals[key] !== undefined) {
      return manualEvals[key]
    }
    if (selectedBranch !== 'CS1 Linh Đàm' && existingTodaySub) {
      if (selectedShift === 'dau_ca') {
        const found = existingTodaySub.daytimeItems.find((i) => i.name === itemName)
        if (found) return found.status
      } else {
        const found = existingTodaySub.closingItems.find((i) => i.name === itemName)
        if (found) return found.status === 'done' ? 'pass' : 'fail'
      }
    }
    return 'pending'
  }

  const handleSetItemStatus = (itemName: string, status: 'pass' | 'fail') => {
    const key = `${selectedBranch}-${selectedShift}-${itemName}`
    setManualEvals((prev) => {
      const next = { ...prev }
      if (next[key] === status) {
        delete next[key]
      } else {
        next[key] = status
      }
      return next
    })
  }

  const handlePassAll = () => {
    setManualEvals((prev) => {
      const next = { ...prev }
      if (selectedShift === 'dau_ca') {
        const activeItems = Object.values(activeDaytimeGrouped).flatMap((items) => items)
        for (const it of activeItems) {
          next[`${selectedBranch}-${selectedShift}-${it.detail}`] = 'pass'
        }
      } else {
        const activeTasks = Object.values(activeClosingGrouped).flatMap((tasks) => tasks)
        for (const t of activeTasks) {
          next[`${selectedBranch}-${selectedShift}-${t.name}`] = 'pass'
        }
      }
      return next
    })
    toast.success('Đã đánh dấu Đạt cho toàn bộ danh mục hôm nay!')
  }

  // 10. Photo Helpers (Lưu & lấy ảnh theo ngày cụ thể)
  const getItemPhotos = (itemName: string, dateStr = '2026-10-29'): string[] => {
    const key = `${selectedBranch}-${selectedShift}-${dateStr}-${itemName}`
    return itemEvidence[key] || []
  }

  const getCategoryPhotos = (grp: string, dateStr: string): string[] => {
    const key = `${selectedBranch}-${selectedShift}-${dateStr}-${grp}`
    if (categoryEvidence[key] && categoryEvidence[key].length > 0) {
      return categoryEvidence[key]
    }

    if (dateStr < '2026-10-29') {
      const sub = submissions.find(
        (s) => s.branch === selectedBranch && s.shift === selectedShift && s.date === dateStr
      )
      if (sub && dateStr === '2026-10-28' && grp.includes('SẢNH NGOÀI')) {
        return ['https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80']
      }
    }
    return []
  }

  const handleAddPhotoToTarget = () => {
    if (!evidenceTarget) return
    const newPhotoUrl = `https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80`
    const dateStr = evidenceTarget.dateStr || '2026-10-29'

    if (evidenceTarget.type === 'item') {
      const key = `${selectedBranch}-${selectedShift}-${dateStr}-${evidenceTarget.name}`
      setItemEvidence((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), newPhotoUrl],
      }))
      toast.success(`Đã thêm ảnh bằng chứng cho "${evidenceTarget.name}"`)
    } else {
      const key = `${selectedBranch}-${selectedShift}-${dateStr}-${evidenceTarget.name}`
      setCategoryEvidence((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), newPhotoUrl],
      }))
      toast.success(`Đã thêm ảnh bằng chứng cho danh mục "${evidenceTarget.name}" (${dateStr})`)
    }
  }

  const handleCustomPhotoUpload = (photoUrl: string) => {
    if (!evidenceTarget) return
    const dateStr = evidenceTarget.dateStr || '2026-10-29'

    if (evidenceTarget.type === 'item') {
      const key = `${selectedBranch}-${selectedShift}-${dateStr}-${evidenceTarget.name}`
      setItemEvidence((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), photoUrl],
      }))
      toast.success(`Đã lưu ảnh chụp minh chứng cho "${evidenceTarget.name}"`)
    } else {
      const key = `${selectedBranch}-${selectedShift}-${dateStr}-${evidenceTarget.name}`
      setCategoryEvidence((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), photoUrl],
      }))
      toast.success(`Đã lưu ảnh chụp minh chứng cho danh mục "${evidenceTarget.name}"`)
    }
  }

  const handleDeletePhotoFromTarget = (photoUrl: string) => {
    if (!evidenceTarget) return
    const dateStr = evidenceTarget.dateStr || '2026-10-29'
    const key = `${selectedBranch}-${selectedShift}-${dateStr}-${evidenceTarget.name}`
    if (evidenceTarget.type === 'item') {
      setItemEvidence((prev) => ({
        ...prev,
        [key]: (prev[key] || []).filter((p) => p !== photoUrl),
      }))
    } else {
      setCategoryEvidence((prev) => ({
        ...prev,
        [key]: (prev[key] || []).filter((p) => p !== photoUrl),
      }))
    }
    toast.info('Đã gỡ ảnh bằng chứng.')
  }

  // 11. Hiding & Skipping Handlers
  const handleToggleCollapseCategory = (grp: string) => {
    setCollapsedCategories((prev) =>
      prev.includes(grp) ? prev.filter((g) => g !== grp) : [...prev, grp]
    )
  }

  // Thu gọn / Mở rộng tất cả danh mục
  const allCategoryKeys = useMemo(() => {
    return Object.keys(selectedShift === 'dau_ca' ? activeDaytimeGrouped : activeClosingGrouped)
  }, [selectedShift, activeDaytimeGrouped, activeClosingGrouped])

  const isAllCollapsed = useMemo(() => {
    return allCategoryKeys.length > 0 && allCategoryKeys.every((k) => collapsedCategories.includes(k))
  }, [allCategoryKeys, collapsedCategories])

  const handleToggleAllCategories = () => {
    if (isAllCollapsed) {
      setCollapsedCategories([])
      toast.info('Đã mở rộng toàn bộ danh mục.')
    } else {
      setCollapsedCategories(allCategoryKeys)
      toast.info('Đã thu gọn toàn bộ danh mục.')
    }
  }

  const handleSkipCategory = (grp: string) => {
    if (!skippedCategories.includes(grp)) {
      setSkippedCategories((prev) => [...prev, grp])
      toast.info(`Đã ẩn toàn bộ danh mục "${grp}" (chuyển vào danh sách bỏ qua).`)
    }
  }

  const handleRestoreCategory = (grp: string) => {
    setSkippedCategories((prev) => prev.filter((g) => g !== grp))
    toast.success(`Đã khôi phục danh mục "${grp}".`)
  }

  const handleSkipCriterion = (name: string, group: string) => {
    if (!skippedCriteria.some((c) => c.name === name)) {
      setSkippedCriteria((prev) => [...prev, { id: `${group}-${name}`, name, group }])
      toast.info(`Đã ẩn tiêu chí "${name}" (chuyển vào danh sách bỏ qua).`)
    }
  }

  const handleRestoreCriterion = (name: string) => {
    setSkippedCriteria((prev) => prev.filter((c) => c.name !== name))
    toast.success(`Đã khôi phục tiêu chí "${name}".`)
  }

  // 12. Shift Progress Stats (for Toolbar tabs: Đầu ca & Cuối ca)
  const daytimeStats: ShiftProgressStats = useMemo(() => {
    const activeList = Object.values(activeDaytimeGrouped).flatMap((items) => items.map((i) => i.detail))
    const total = activeList.length
    let checked = 0
    let pass = 0
    let fail = 0

    const todaySub = submissions.find(
      (s) => s.branch === selectedBranch && s.shift === 'dau_ca' && s.date === '2026-10-29'
    )

    for (const name of activeList) {
      const key = `${selectedBranch}-dau_ca-${name}`
      const manual = manualEvals[key]
      let status: 'pass' | 'fail' | 'pending' = manual ? manual : 'pending'
      if (status === 'pending' && selectedBranch !== 'CS1 Linh Đàm' && todaySub) {
        const found = todaySub.daytimeItems.find((i) => i.name === name)
        if (found) status = found.status
      }

      if (status === 'pass') {
        checked++
        pass++
      } else if (status === 'fail') {
        checked++
        fail++
      }
    }

    return {
      total,
      checked,
      pass,
      fail,
      isCompleted: total > 0 && checked === total,
    }
  }, [activeDaytimeGrouped, selectedBranch, manualEvals, submissions])

  const closingStats: ShiftProgressStats = useMemo(() => {
    const activeList = Object.values(activeClosingGrouped).flatMap((tasks) => tasks.map((t) => t.name))
    const total = activeList.length
    let checked = 0
    let pass = 0
    let fail = 0

    const todaySub = submissions.find(
      (s) => s.branch === selectedBranch && s.shift === 'cuoi_ca' && s.date === '2026-10-29'
    )

    for (const name of activeList) {
      const key = `${selectedBranch}-cuoi_ca-${name}`
      const manual = manualEvals[key]
      let status: 'pass' | 'fail' | 'pending' = manual ? manual : 'pending'
      if (status === 'pending' && selectedBranch !== 'CS1 Linh Đàm' && todaySub) {
        const found = todaySub.closingItems.find((i) => i.name === name)
        if (found) status = found.status === 'done' ? 'pass' : 'fail'
      }

      if (status === 'pass') {
        checked++
        pass++
      } else if (status === 'fail') {
        checked++
        fail++
      }
    }

    return {
      total,
      checked,
      pass,
      fail,
      isCompleted: total > 0 && checked === total,
    }
  }, [activeClosingGrouped, selectedBranch, manualEvals, submissions])

  // 13. Day Summary Score (Header Row 2)
  const getDaySummaryScore = (dateStr: string): DailyDaySummaryScore | null => {
    const currentShiftStats = selectedShift === 'dau_ca' ? daytimeStats : closingStats

    if (dateStr === '2026-10-29') {
      const totalCatalogs = selectedShift === 'dau_ca' ? DAILY_CATALOG_ITEMS.length : DAILY_CLOSING_TASKS.length
      const skippedCount = totalCatalogs - currentShiftStats.total

      return {
        activeTotal: currentShiftStats.total,
        passCount: currentShiftStats.pass,
        failCount: currentShiftStats.fail,
        skippedCount,
        isEvaluated: currentShiftStats.checked > 0,
      }
    }

    const sub = submissions.find(
      (s) => s.branch === selectedBranch && s.shift === selectedShift && s.date === dateStr
    )
    if (!sub) return null

    const totalCatalogs = selectedShift === 'dau_ca' ? DAILY_CATALOG_ITEMS.length : DAILY_CLOSING_TASKS.length
    const activeTotal = currentShiftStats.total
    const skippedCount = totalCatalogs - activeTotal
    const failCount = sub.failedItemsCount
    const passCount = Math.max(0, activeTotal - failCount)

    return {
      activeTotal,
      passCount,
      failCount,
      skippedCount,
      isEvaluated: true,
    }
  }

  // 14. Historical Evaluation & Evidence Resolver
  const getHistoricalItemStatus = (
    dateStr: string,
    itemName: string
  ): { status: 'pass' | 'fail' | 'not_submitted'; note?: string; photos?: string[] } => {
    const sub = submissions.find(
      (s) => s.branch === selectedBranch && s.shift === selectedShift && s.date === dateStr
    )
    if (!sub) return { status: 'not_submitted' }

    // Issue on T4 (2026-10-28) for Air conditioning failure
    if (dateStr === '2026-10-28' && (itemName === 'Điều hòa khu vực chung' || itemName.includes('Điều hòa'))) {
      return {
        status: 'fail',
        note: 'Dàn lạnh chảy nước tại sảnh chung, đã báo kỹ thuật xử lý.',
        photos: [
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
        ],
      }
    }

    const mockPhotos = getMockHistoricalPhotos(itemName, dateStr)

    if (selectedShift === 'dau_ca') {
      const found = sub.daytimeItems.find((i) => i.name === itemName)
      if (found) {
        const samplePhotos =
          found.photos && found.photos.length > 0
            ? found.photos
            : found.status === 'fail'
            ? ['https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80']
            : mockPhotos
        return { status: found.status, note: found.note, photos: samplePhotos }
      }
      return {
        status: 'pass',
        photos: mockPhotos,
      }
    } else {
      const found = sub.closingItems.find((i) => i.name === itemName)
      if (found) {
        return {
          status: found.status === 'done' ? 'pass' : 'fail',
          note: found.note,
          photos: mockPhotos,
        }
      }
      return {
        status: 'pass',
        photos: mockPhotos,
      }
    }
  }

  // Active photos list for open Evidence Dialog
  const currentEvidencePhotos = useMemo(() => {
    if (!evidenceTarget) return []
    if (evidenceTarget.isPastDay && evidenceTarget.photos && evidenceTarget.photos.length > 0) {
      return evidenceTarget.photos
    }
    const dateStr = evidenceTarget.dateStr || '2026-10-29'
    const key = `${selectedBranch}-${selectedShift}-${dateStr}-${evidenceTarget.name}`
    if (evidenceTarget.type === 'item') {
      return itemEvidence[key] || []
    }
    return categoryEvidence[key] || (dateStr < '2026-10-29' && dateStr === '2026-10-28' && evidenceTarget.name.includes('SẢNH NGOÀI') ? ['https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80'] : [])
  }, [evidenceTarget, selectedBranch, selectedShift, itemEvidence, categoryEvidence])

  return (
    <div className="flex flex-col h-full min-h-0 gap-2.5 text-left">
      {/* ─── 1. TOOLBAR: PHẲNG, CÓ VIỀN SELECTION, CHUYỂN CA KÈM STATS & CHECK ICON ─── */}
      <div className="shrink-0">
        <DailyCheckExecutionToolbar
          selectedBranch={selectedBranch}
          onSelectBranch={setSelectedBranch}
          selectedShift={selectedShift}
          onSelectShift={setSelectedShift}
          weekOffset={weekOffset}
          onPrevWeek={() => setWeekOffset((prev) => prev - 1)}
          onNextWeek={() => setWeekOffset((prev) => prev + 1)}
          onResetWeek={() => setWeekOffset(0)}
          weekRangeLabel={weekRangeLabel}
          onPassAll={handlePassAll}
          daytimeStats={daytimeStats}
          closingStats={closingStats}
          onOpenCatalog={onOpenCatalog}
        />
      </div>

      {/* ─── 2. BẢNG MA TRẬN TIÊU CHÍ X CÁC NGÀY TRONG TUẦN ─── */}
      <div className="flex-1 min-h-0 border border-border/70 rounded-lg overflow-hidden flex flex-col bg-card shadow-xs">
        <DailyCheckExecutionTable
          selectedShift={selectedShift}
          weekDays={weekDays}
          getDaySummaryScore={getDaySummaryScore}
          activeDaytimeGrouped={activeDaytimeGrouped}
          activeClosingGrouped={activeClosingGrouped}
          collapsedCategories={collapsedCategories}
          onToggleCollapseCategory={handleToggleCollapseCategory}
          isAllCollapsed={isAllCollapsed}
          onToggleAllCategories={handleToggleAllCategories}
          onSkipCategory={handleSkipCategory}
          onSkipCriterion={handleSkipCriterion}
          getCategoryPhotos={getCategoryPhotos}
          getItemPhotos={getItemPhotos}
          getItemTodayStatus={getItemTodayStatus}
          onSetItemStatus={handleSetItemStatus}
          getHistoricalItemStatus={getHistoricalItemStatus}
          onOpenEvidence={setEvidenceTarget}
          onOpenStandard={setStandardTarget}
        />

        {/* ─── 3. CƠ CHẾ BỎ QUA Ở CUỐI BẢNG (CHỈ HIỆN KHI CẦN KHÔI PHỤC) ─── */}
        <div className="shrink-0 flex flex-col border-t border-border/80 bg-muted/20">
          <DailyCheckSkippedSection
            isOpen={isSkippedSectionOpen}
            onToggle={() => setIsSkippedSectionOpen(!isSkippedSectionOpen)}
            skippedCategories={skippedCategories}
            onRestoreCategory={handleRestoreCategory}
            skippedCriteria={skippedCriteria}
            onRestoreCriterion={handleRestoreCriterion}
          />
        </div>
      </div>

      {/* ─── 4. MODAL BẰNG CHỨNG (HỖ TRỢ CẢ HÔM NAY VÀ XEM ẢNH LỊCH SỬ) ─── */}
      <DailyCheckEvidenceDialog
        target={evidenceTarget}
        photos={currentEvidencePhotos}
        onClose={() => setEvidenceTarget(null)}
        onAddPhoto={evidenceTarget && !evidenceTarget.isPastDay ? handleAddPhotoToTarget : undefined}
        onCustomPhotoUploaded={evidenceTarget && !evidenceTarget.isPastDay ? handleCustomPhotoUpload : undefined}
        onDeletePhoto={evidenceTarget && !evidenceTarget.isPastDay ? handleDeletePhotoFromTarget : undefined}
        branchName={selectedBranch}
      />

      {/* ─── 5. MODAL TIÊU CHUẨN VẬN HÀNH, HÌNH ẢNH & VIDEO MẪU ─── */}
      <DailyCheckStandardDialog
        target={standardTarget}
        open={Boolean(standardTarget)}
        onOpenChange={(open) => !open && setStandardTarget(null)}
      />
    </div>
  )
}
