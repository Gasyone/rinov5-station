'use client'

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { getStatusColors, resolveStatusSemantic, type StatusSemantic } from '@/lib/statusColors'
import { cn } from '@/lib/utils'

export interface StatusTile<T extends string> {
  id: T
  label: string
  count: number
  /** Use a known entity status string OR a semantic key */
  status?: string
  semantic?: StatusSemantic
  icon?: ReactNode
}

interface StatusTilesProps<T extends string> {
  tiles: StatusTile<T>[]
  activeId: T
  onSelect: (id: T) => void
  className?: string
  noOverflowCollapse?: boolean
}

/* ── Single tile button ───────────────────────────────────── */
function TileButton<T extends string>({
  tile,
  isActive,
  onSelect,
  compact,
}: {
  tile: StatusTile<T>
  isActive: boolean
  onSelect: (id: T) => void
  compact?: boolean
}) {
  const semantic =
    tile.semantic ??
    (tile.status ? resolveStatusSemantic(tile.status) : 'neutral')
  const colors = getStatusColors(semantic)

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => onSelect(tile.id)}
      className={cn(
        'inline-flex items-center gap-2 whitespace-nowrap rounded-full border text-xs font-medium transition-colors',
        compact ? 'h-7 px-2.5' : 'h-8 px-3',
        isActive
          ? colors.active
          : cn(
              'border-border bg-background text-muted-foreground',
              'hover:bg-accent hover:text-foreground'
            )
      )}
    >
      {tile.icon ? (
        <span className={cn('h-3.5 w-3.5', isActive ? 'text-primary-foreground' : colors.text)}>
          {tile.icon}
        </span>
      ) : (
        <span
          aria-hidden
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            isActive ? 'bg-primary-foreground' : colors.dot
          )}
        />
      )}
      <span>{tile.label}</span>
      <span
        className={cn(
          'rounded-full px-1.5 text-[10px] font-semibold',
          isActive
            ? 'bg-primary-foreground/20 text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        )}
      >
        {tile.count}
      </span>
    </Button>
  )
}

/**
 * Horizontal status tiles bar — used at top of List Page Pattern.
 *
 * Each tile shows label + count. Active tile uses solid semantic color.
 * When tiles overflow the container width, extras collapse into a popover.
 *
 * @see docs/DESIGN_SYSTEM.md §4.2 List Page Pattern
 */
export function StatusTiles<T extends string>({
  tiles,
  activeId,
  onSelect,
  className,
  noOverflowCollapse = false,
}: StatusTilesProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(tiles.length)

  const recalc = useCallback(() => {
    if (noOverflowCollapse) return
    const container = containerRef.current
    const measure = measureRef.current
    if (!container || !measure) return

    const containerWidth = container.clientWidth
    const children = Array.from(measure.children) as HTMLElement[]
    if (children.length === 0) return

    // Measure total width of all tiles with gaps
    const gap = 8
    const widths = children.map((c) => c.offsetWidth)
    const totalWidth = widths.reduce((s, w) => s + w, 0) + gap * (widths.length - 1)

    // If all tiles fit, show them all (no more button needed)
    if (totalWidth <= containerWidth) {
      setVisibleCount(children.length)
      return
    }

    // Need to collapse — reserve space for the "+N" button
    const moreButtonReserve = 130
    const maxWidth = containerWidth - moreButtonReserve
    let usedWidth = 0
    let fitCount = 0

    for (let i = 0; i < widths.length; i++) {
      const needed = usedWidth + widths[i] + (fitCount > 0 ? gap : 0)
      if (needed > maxWidth) break
      usedWidth = needed
      fitCount++
    }

    setVisibleCount(Math.max(1, fitCount))
  }, [noOverflowCollapse])

  useEffect(() => {
    recalc()
  }, [tiles, recalc])

  useEffect(() => {
    if (noOverflowCollapse) return
    const container = containerRef.current
    if (!container) return
    const ro = new ResizeObserver(recalc)
    ro.observe(container)
    return () => ro.disconnect()
  }, [recalc, noOverflowCollapse])

  if (noOverflowCollapse) {
    return (
      <div className={cn('flex items-center gap-2 flex-wrap min-w-0', className)}>
        {tiles.map((tile) => (
          <TileButton
            key={tile.id}
            tile={tile}
            isActive={tile.id === activeId}
            onSelect={onSelect}
          />
        ))}
      </div>
    )
  }

  const visibleTiles = tiles.slice(0, visibleCount)
  const overflowTiles = tiles.slice(visibleCount)
  const hasOverflow = overflowTiles.length > 0
  // Check if active tile is in the overflow
  const activeInOverflow = overflowTiles.some((t) => t.id === activeId)

  return (
    <div ref={containerRef} className={cn('relative overflow-hidden', className)}>
      {/* Hidden measuring row — renders all tiles to measure widths */}
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 flex items-center gap-2 whitespace-nowrap"
      >
        {tiles.map((tile) => (
          <TileButton
            key={tile.id}
            tile={tile}
            isActive={tile.id === activeId}
            onSelect={() => {}}
          />
        ))}
      </div>

      {/* Visible row */}
      <div className="flex items-center gap-2">
        {visibleTiles.map((tile) => (
          <TileButton
            key={tile.id}
            tile={tile}
            isActive={tile.id === activeId}
            onSelect={onSelect}
          />
        ))}

        {hasOverflow && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  'inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-xs font-medium',
                  activeInOverflow
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                +{overflowTiles.length} trạng thái
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto max-w-xs p-2">
              <div className="flex flex-wrap gap-1.5">
                {overflowTiles.map((tile) => (
                  <TileButton
                    key={tile.id}
                    tile={tile}
                    isActive={tile.id === activeId}
                    onSelect={onSelect}
                    compact
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  )
}
