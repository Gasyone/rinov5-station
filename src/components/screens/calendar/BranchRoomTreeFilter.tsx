'use client'

import React, { useState, useMemo } from 'react'
import { ChevronRight, Search } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { ClassSession } from '@/mocks/calendarSchedule'

interface BranchRoomTreeFilterProps {
  branches: string[]
  roomsByBranch: Record<string, string[]>
  allSessions?: ClassSession[]
  selectedBranchRooms: Record<string, string[]>
  onToggleBranch: (branch: string) => void
  onToggleRoom: (branch: string, room: string) => void
  searchable?: boolean
  showCount?: boolean
}

export function BranchRoomTreeFilter({
  branches,
  roomsByBranch,
  allSessions,
  selectedBranchRooms,
  onToggleBranch,
  onToggleRoom,
  searchable = false,
  showCount = false,
}: BranchRoomTreeFilterProps) {
  const [query, setQuery] = useState('')
  const [expandedBranches, setExpandedBranches] = useState<Record<string, boolean>>(() => {
    // Default: expand all branches for quick access
    const initial: Record<string, boolean> = {}
    branches.forEach((b) => {
      initial[b] = true
    })
    return initial
  })

  const toggleExpand = (branch: string) => {
    setExpandedBranches((prev) => ({
      ...prev,
      [branch]: !prev[branch],
    }))
  }

  // Filter branches and rooms by search query
  const filteredBranches = useMemo(() => {
    if (!searchable) return branches
    const q = query.toLowerCase().trim()
    if (!q) return branches

    return branches.filter((branch) => {
      const matchBranch = branch.toLowerCase().includes(q)
      const rooms = roomsByBranch[branch] || []
      const matchRoom = rooms.some((r) => r.toLowerCase().includes(q))
      return matchBranch || matchRoom
    })
  }, [searchable, branches, roomsByBranch, query])

  return (
    <div className="space-y-1 pt-1">
      {searchable && branches.length > 2 && (
        <div className="relative mb-2 px-0.5">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm cơ sở, phòng học..."
            className="h-7 pl-7 pr-2 text-xs bg-muted/30"
          />
        </div>
      )}

      <div className="space-y-1">
        {filteredBranches.map((branch) => {
          const rooms = roomsByBranch[branch] || []
          const q = query.toLowerCase().trim()
          const visibleRooms = q
            ? rooms.filter((r) => r.toLowerCase().includes(q) || branch.toLowerCase().includes(q))
            : rooms

          const selectedRooms = selectedBranchRooms[branch] || []
          const isFullyChecked = rooms.length > 0 && rooms.every((r) => selectedRooms.includes(r))
          const isPartiallyChecked = !isFullyChecked && selectedRooms.length > 0
          const isExpanded = Boolean(expandedBranches[branch])

          const branchCount = allSessions
            ? allSessions.filter((s) => s.branch === branch).length
            : 0

          return (
            <div key={branch} className="rounded-md transition-colors">
              {/* Parent: Branch Item */}
              <div
                className={cn(
                  'flex items-center justify-between py-1 px-1.5 rounded transition-colors group select-none',
                  isFullyChecked || isPartiallyChecked ? 'bg-primary/8 text-foreground' : 'hover:bg-muted/40 text-foreground/90'
                )}
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => toggleExpand(branch)}
                    className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-transform shrink-0 cursor-pointer"
                    title={isExpanded ? 'Thu gọn phòng học' : 'Mở rộng phòng học'}
                  >
                    <ChevronRight
                      className={cn(
                        'h-3.5 w-3.5 transition-transform duration-200',
                        isExpanded && 'rotate-90 text-foreground'
                      )}
                    />
                  </button>

                  <Checkbox
                    checked={isFullyChecked ? true : isPartiallyChecked ? 'indeterminate' : false}
                    onCheckedChange={() => onToggleBranch(branch)}
                    className={cn(
                      'h-3.5 w-3.5 rounded transition-all shrink-0',
                      isFullyChecked || isPartiallyChecked
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-border/80 bg-background'
                    )}
                  />

                  <span
                    onClick={() => toggleExpand(branch)}
                    className="text-xs font-semibold truncate cursor-pointer hover:text-primary transition-colors flex-1"
                    title={branch}
                  >
                    {branch}
                  </span>
                </div>

                {showCount && (
                  <span className="text-xs text-muted-foreground font-medium shrink-0 ml-1.5">
                    {branchCount}
                  </span>
                )}
              </div>

              {/* Children: Rooms List (Indented with vertical guide line) */}
              {isExpanded && visibleRooms.length > 0 && (
                <div className="ml-3 pl-3.5 border-l border-border/60 py-0.5 my-0.5 space-y-0.5 animate-in slide-in-from-top-1 duration-150">
                  {visibleRooms.map((room) => {
                    const isRoomChecked = selectedRooms.includes(room)
                    const roomCount = allSessions
                      ? allSessions.filter((s) => s.branch === branch && s.schoolRoom === room).length
                      : 0

                    return (
                      <label
                        key={room}
                        className={cn(
                          'flex items-center justify-between py-1 px-1.5 rounded text-xs cursor-pointer select-none transition-colors',
                          isRoomChecked
                            ? 'bg-primary/10 text-foreground font-medium'
                            : 'hover:bg-muted/40 text-foreground/80'
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Checkbox
                            checked={isRoomChecked}
                            onCheckedChange={() => onToggleRoom(branch, room)}
                            className={cn(
                              'h-3 w-3 rounded transition-all shrink-0',
                              isRoomChecked
                                ? 'bg-primary border-primary text-primary-foreground'
                                : 'border-border/70 bg-background'
                            )}
                          />
                          <span className="text-xs truncate" title={room}>
                            {room}
                          </span>
                        </div>
                        {showCount && (
                          <span className="text-xs text-muted-foreground/75 font-normal shrink-0 ml-1.5">
                            {roomCount}
                          </span>
                        )}
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {filteredBranches.length === 0 && (
          <div className="py-2 px-2 text-center text-xs italic text-muted-foreground">
            Không tìm thấy cơ sở hoặc phòng học phù hợp
          </div>
        )}
      </div>
    </div>
  )
}
