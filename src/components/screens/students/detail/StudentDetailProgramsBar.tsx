'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Package,
  Check,
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { StudentProgram } from './studentDetailTypes'
import {
  HistoricalPackagesPopover,
  type HistoricalPackageItem,
} from '@/components/shared'

export const defaultHistoricalOldPackages: HistoricalPackageItem[] = [
  {
    id: 'track-math-pre',
    programName: 'Toán tư duy',
    packageName: '[MATH_PRE] Toán Einstein 0 Foundation',
    statusLabel: 'Hết buổi',
  },
  {
    id: 'track-ie-super',
    programName: 'Tiếng Anh',
    packageName: '[IE_SUPER] Tiếng Anh SuperKids Level 2',
    statusLabel: 'Hết buổi',
  },
  {
    id: 'track-math-kindy',
    programName: 'Toán tư duy',
    packageName: '[MATH_KINDY] Toán Mầm Non Archimedes',
    statusLabel: 'Hết hạn',
  },
  {
    id: 'track-stem-robot',
    programName: 'Trải nghiệm',
    packageName: '[STEM_ROBOT] Lập Trình Robot & AI K1',
    statusLabel: 'Hết buổi',
  },
]

export function getProgramTabSublabel(prog: StudentProgram): string {
  const status = prog.programStatus
  if (status === 'reserve' || status === 'reserved') return 'Bảo lưu'
  if (status === 'pending_transfer' || status === 'dropped') return 'Chờ chuyển lớp'
  if (status === 'fee_transfer') return 'Chuyển phí'
  if (status === 'enroll_later') return 'Hẹn xếp sau'
  if (status === 'draft_class') {
    return prog.currentClass?.classCode && !prog.currentClass.classCode.startsWith('UNASSIGNED')
      ? prog.currentClass.classCode
      : 'Lớp nháp'
  }
  if (status === 'pending_payment') return 'Chờ thanh toán'
  if (status === 'trial') return 'Học thử'
  if (status === 'awaiting_opening') return 'Chờ khai giảng'
  if (status === 'session_ended' || prog.remainingSessions === 0) return 'Hết buổi'
  if (prog.currentClass?.classCode && status === 'active') return prog.currentClass.classCode
  return 'Chờ ghép lớp'
}

export interface StudentDetailProgramsBarProps {
  programs: StudentProgram[]
  selectedProgramId: string
  onSelectProgram: (id: string) => void
  historicalPackages?: HistoricalPackageItem[]
}

export function StudentDetailProgramsBar({
  programs,
  selectedProgramId,
  onSelectProgram,
  historicalPackages,
}: StudentDetailProgramsBarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [isMoreOpen, setIsMoreOpen] = useState(false)

  // Lắng nghe thay đổi kích thước của panel trái để tự động tính toán số tab vừa vặn
  useEffect(() => {
    if (!containerRef.current) return
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
      }
    }
    updateWidth()
    const ro = new ResizeObserver(() => {
      updateWidth()
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Chỉ lấy các gói/chương trình đang theo học thực tế (loại bỏ các gói cũ đã đưa vào mục "Khác")
  const activeTabs = useMemo(() => {
    const filtered = programs.filter(
      (p) =>
        !p.id.startsWith('track-math-pre') &&
        !p.id.startsWith('track-ie-super') &&
        !p.id.startsWith('track-math-kindy') &&
        !p.id.startsWith('track-stem-robot')
    )
    return filtered.length > 0 ? filtered : programs.slice(0, 2)
  }, [programs])

  const historicalList: HistoricalPackageItem[] =
    historicalPackages !== undefined ? historicalPackages : defaultHistoricalOldPackages

  // Tính toán số lượng tab hiển thị trực tiếp để không tạo thanh cuộn ngang
  const maxVisible = useMemo(() => {
    if (!containerWidth || containerWidth <= 0) return 2
    const TAB_WIDTH = 120
    const KHAC_WIDTH = historicalList.length > 0 ? 95 : 0
    const MORE_WIDTH = 105

    // Nếu tất cả activeTabs + nút Khác đều vừa trong containerWidth thì hiển thị hết
    const totalNeeded = activeTabs.length * TAB_WIDTH + KHAC_WIDTH
    if (totalNeeded <= containerWidth) {
      return activeTabs.length
    }

    // Nếu không đủ chỗ: chừa chỗ cho Khác + Xem thêm
    const availableForVisible = containerWidth - KHAC_WIDTH - MORE_WIDTH
    return Math.max(1, Math.floor(availableForVisible / TAB_WIDTH))
  }, [containerWidth, activeTabs.length, historicalList.length])

  // Phân chia danh sách tab: tab hiển thị trực tiếp (luôn ưu tiên tab đang chọn) & tab trong "Xem thêm"
  const { visibleTabs, overflowTabs } = useMemo(() => {
    if (activeTabs.length <= maxVisible) {
      return { visibleTabs: activeTabs, overflowTabs: [] }
    }

    // Đảm bảo chương trình đang chọn luôn xuất hiện trên thanh hiển thị trực tiếp
    const selectedProg = activeTabs.find((p) => p.id === selectedProgramId)
    const otherProgs = activeTabs.filter((p) => p.id !== selectedProgramId)

    let visible: StudentProgram[] = []
    let overflow: StudentProgram[] = []

    if (selectedProg) {
      visible = [selectedProg, ...otherProgs.slice(0, maxVisible - 1)]
      overflow = otherProgs.slice(maxVisible - 1)
    } else {
      visible = activeTabs.slice(0, maxVisible)
      overflow = activeTabs.slice(maxVisible)
    }

    return { visibleTabs: visible, overflowTabs: overflow }
  }, [activeTabs, maxVisible, selectedProgramId])

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-1.5 select-none overflow-hidden flex-nowrap w-full"
    >
      {/* ── 1. ACTIVE PROGRAM TABS (THU HẸP 10% BỀ RỘNG, KHÔNG WRAP, KHÔNG CUỘN NGANG) ── */}
      {visibleTabs.map((prog) => {
        const isSelected = selectedProgramId === prog.id
        const sublabel = getProgramTabSublabel(prog)

        return (
          <button
            key={prog.id}
            type="button"
            onClick={() => onSelectProgram(prog.id)}
            className={cn(
              'shrink-0 relative flex flex-col items-start justify-center rounded-lg px-2 py-0.5 text-left transition-all cursor-pointer shadow-3xs h-[34px] min-w-[92px] max-w-[144px]',
              isSelected
                ? 'border border-sky-300 dark:border-sky-700 bg-sky-50/80 dark:bg-sky-950/40 text-foreground'
                : 'border border-border/80 bg-background text-muted-foreground hover:bg-muted/40 hover:text-foreground'
            )}
            title={prog.name}
          >
            <span className="text-[10.5px] font-semibold text-foreground truncate w-full leading-tight">
              {prog.name}
            </span>
            <span
              className={cn(
                'font-mono text-[9px] leading-tight pt-0.5 truncate w-full',
                isSelected
                  ? 'text-sky-600 dark:text-sky-400 font-medium'
                  : 'text-muted-foreground font-normal'
              )}
            >
              {sublabel}
            </span>
          </button>
        )
      })}

      {/* ── 2. NÚT "XEM THÊM (N)" DÀNH CHO CÁC GÓI CÒN HẠN NHƯNG KHÔNG ĐỦ DIỆN TÍCH HIỂN THỊ ── */}
      {overflowTabs.length > 0 && (
        <Popover open={isMoreOpen} onOpenChange={setIsMoreOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                'shrink-0 relative flex flex-col items-start justify-center rounded-lg px-2 py-0.5 text-left transition-all cursor-pointer shadow-3xs h-[34px] min-w-[92px] max-w-[125px]',
                'border border-border/80 bg-background text-muted-foreground hover:bg-muted/40 hover:text-foreground'
              )}
              title="Xem thêm các gói học còn hạn sử dụng"
            >
              <div className="flex items-center justify-between w-full leading-tight gap-1">
                <span className="text-[10.5px] font-semibold text-foreground truncate">
                  Xem thêm ({overflowTabs.length})
                </span>
                <ChevronDown className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
              </div>
              <span className="font-mono text-[9px] text-muted-foreground truncate w-full leading-tight pt-0.5">
                Gói còn hạn
              </span>
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            side="bottom"
            sideOffset={6}
            className="w-[280px] sm:w-[320px] p-2 rounded-xl shadow-xl border border-border/60 bg-popover z-50 text-left space-y-1"
          >
            {/* Header popover xem thêm: 1 dòng gọn gàng */}
            <div className="flex items-center justify-between pb-1.5 border-b border-border/30">
              <div className="text-xs text-foreground font-normal flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>
                  Gói học còn hạn{' '}
                  <span className="text-muted-foreground font-normal">
                    ({overflowTabs.length} gói)
                  </span>
                </span>
              </div>
            </div>

            {/* Danh sách các gói còn hạn chưa đủ diện tích hiển thị */}
            <div className="max-h-[260px] overflow-y-auto space-y-1 pr-0.5 scrollbar-thin pt-1">
              {overflowTabs.map((prog) => {
                const isSelected = selectedProgramId === prog.id
                const sublabel = getProgramTabSublabel(prog)

                return (
                  <button
                    key={prog.id}
                    type="button"
                    onClick={() => {
                      onSelectProgram(prog.id)
                      setIsMoreOpen(false)
                    }}
                    className={cn(
                      'w-full p-2 rounded-lg text-left transition-colors cursor-pointer border flex items-center justify-between gap-2',
                      isSelected
                        ? 'border-sky-300 bg-sky-50/70 dark:border-sky-800 dark:bg-sky-950/40'
                        : 'border-transparent hover:border-border/60 hover:bg-muted/40'
                    )}
                  >
                    <div className="min-w-0 space-y-0.5 flex-1">
                      <div className="text-xs font-semibold text-foreground truncate">
                        {prog.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {sublabel} • Còn {prog.remainingSessions} buổi
                      </div>
                    </div>
                    {isSelected ? (
                      <Check className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* ── 3. TAB "KHÁC": GÓI CŨ / HẾT HẠN ĐƯỢC COMPONENT HÓA TÁI SỬ DỤNG ── */}
      {historicalList.length > 0 && (
        <HistoricalPackagesPopover
          items={historicalList}
          selectedId={selectedProgramId}
          onSelect={(item) => onSelectProgram(item.id)}
        />
      )}
    </div>
  )
}
