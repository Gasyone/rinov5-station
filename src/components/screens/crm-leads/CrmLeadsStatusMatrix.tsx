import React, { useRef, useState, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  StatusTileMode,
  LegacyStatusGroup,
  LEGACY_STATUS_GROUPS,
  MAIN_STATUS_GROUPS,
} from './crmLeadsTypes'

interface CrmLeadsStatusMatrixProps {
  mode?: StatusTileMode
  onToggleMode?: () => void
  activeStatus: string
  onSelectStatus: (status: string) => void
  counts: Record<string, number>
  viewScope?: 'my' | 'all'
}

export const CrmLeadsStatusMatrix: React.FC<CrmLeadsStatusMatrixProps> = ({
  mode = 'all',
  activeStatus,
  onSelectStatus,
  counts,
  viewScope = 'all',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 2)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2)
    }
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollRef.current && e.deltaY !== 0) {
      scrollRef.current.scrollLeft += e.deltaY
    }
  }

  const baseGroups: LegacyStatusGroup[] = mode === 'all' ? LEGACY_STATUS_GROUPS : MAIN_STATUS_GROUPS
  const groups = React.useMemo(() => {
    if (viewScope !== 'my') return baseGroups
    return baseGroups
      .map((g) => ({
        ...g,
        columns: g.columns.filter((c) => c.id !== 'chua_phan_bo'),
      }))
      .filter((g) => g.columns.length > 0)
  }, [baseGroups, viewScope])
  const isAllActive = activeStatus === 'all'
  const totalCount = counts.all ?? 0

  return (
    <div className="w-full border border-slate-300 rounded-md bg-white shadow-2xs overflow-hidden">
      <div
        ref={scrollRef}
        onWheel={handleWheel}
        className="overflow-x-auto matrix-scrollbar select-none"
      >
        <table className="w-full border-collapse text-left border-spacing-0 min-w-max">
          <thead>
            {/* HÀNG 1: NHÓM CHẶNG (T0, T1, T2, T3...) */}
            <tr className="border-b border-slate-300 bg-slate-50/90 text-slate-700">
              {/* Ô Xem tất cả góc trái */}
              <th
                rowSpan={2}
                onClick={() => onSelectStatus('all')}
                className={`sticky left-0 z-20 w-28 min-w-[110px] p-2 border-r border-slate-300 shadow-[2px_0_6px_rgba(0,0,0,0.06)] text-center cursor-pointer transition-colors ${
                  isAllActive
                    ? 'bg-blue-100/90 text-blue-800'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
                title="Bấm để xem tất cả hồ sơ"
              >
                <div className="text-xs font-bold tracking-tight text-slate-800">
                  Xem tất cả
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                  Toàn bộ phễu
                </div>
                {/* Nút cuộn trái / phải hỗ trợ xem cột phía sau */}
                <div className="flex items-center justify-center gap-1 mt-1.5 pt-1 border-t border-slate-200/80">
                  <button
                    type="button"
                    disabled={!canScrollLeft}
                    onClick={(e) => {
                      e.stopPropagation()
                      scroll('left')
                    }}
                    className={`p-0.5 rounded transition-colors ${
                      canScrollLeft
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200 cursor-pointer'
                        : 'text-slate-300 opacity-40 cursor-not-allowed'
                    }`}
                    title="Cuộn sang trái"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[9px] text-slate-400 font-normal">Cuộn</span>
                  <button
                    type="button"
                    disabled={!canScrollRight}
                    onClick={(e) => {
                      e.stopPropagation()
                      scroll('right')
                    }}
                    className={`p-0.5 rounded transition-colors ${
                      canScrollRight
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200 cursor-pointer'
                        : 'text-slate-300 opacity-40 cursor-not-allowed'
                    }`}
                    title="Cuộn sang phải"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </th>

              {/* Các nhóm chặng */}
              {groups.map((group) => (
                <th
                  key={group.groupCode}
                  colSpan={group.columns.length}
                  className="py-1 px-2 border-r border-slate-300 text-center text-xs font-bold text-slate-700 bg-slate-100/80"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>{group.groupCode}</span>
                    {group.groupLabel && (
                      <span className="text-[11px] font-normal text-slate-500 hidden sm:inline">
                        • {group.groupLabel}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>

            {/* HÀNG 2: CÁC CỘT TRẠNG THÁI CON CÓ MÀU SẮC */}
            <tr className="border-b border-slate-300">
              {groups.flatMap((group) =>
                group.columns.map((col) => {
                  const isActive = activeStatus === col.id
                  return (
                    <th
                      key={col.id}
                      onClick={() => onSelectStatus(col.id)}
                      style={{ backgroundColor: col.color }}
                      className={`py-1 px-2.5 text-center text-[11px] font-semibold text-white whitespace-nowrap border-r border-white/25 cursor-pointer transition-opacity hover:opacity-90 ${
                        isActive ? 'ring-2 ring-inset ring-white' : ''
                      }`}
                      title={`Lọc theo ${col.label}`}
                    >
                      {col.label}
                    </th>
                  )
                })
              )}
            </tr>
          </thead>

          {/* HÀNG 3: DÒNG SỐ LƯỢNG ĐẾM */}
          <tbody>
            <tr className="bg-white hover:bg-slate-50/40 divide-x divide-slate-200">
              {/* Tổng số lượng Xem tất cả */}
              <td
                onClick={() => onSelectStatus('all')}
                className={`sticky left-0 z-20 w-28 min-w-[110px] py-1.5 px-2 text-center font-bold text-xs cursor-pointer border-r border-slate-300 shadow-[2px_0_6px_rgba(0,0,0,0.06)] transition-colors ${
                  isAllActive
                    ? 'bg-blue-50 text-blue-700 font-extrabold ring-2 ring-inset ring-blue-500'
                    : 'bg-white hover:bg-slate-100 text-slate-900'
                }`}
              >
                {totalCount.toLocaleString('vi-VN')}
              </td>

              {/* Số đếm từng cột */}
              {groups.flatMap((group) =>
                group.columns.map((col) => {
                  const count = counts[col.id] ?? 0
                  const isActive = activeStatus === col.id

                  return (
                    <td
                      key={`val-${col.id}`}
                      onClick={() => onSelectStatus(col.id)}
                      className={`py-1.5 px-2.5 text-center text-xs font-semibold cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-extrabold ring-2 ring-inset ring-blue-500'
                          : count > 0
                          ? 'text-slate-800 hover:bg-slate-100/90'
                          : 'text-slate-400 hover:bg-slate-50'
                      }`}
                      title={`${col.label}: ${count.toLocaleString('vi-VN')} hồ sơ`}
                    >
                      {count.toLocaleString('vi-VN')}
                    </td>
                  )
                })
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
