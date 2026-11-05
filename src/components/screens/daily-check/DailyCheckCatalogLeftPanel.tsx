'use client'

import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Plus,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DailyCheckCatalogItemCard } from './DailyCheckCatalogItemCard'
import type { DailyCatalogItem, DailyClosingTask } from '@/mocks/dailyCheck'

export interface DailyCheckCatalogLeftPanelProps {
  activeShift: 'dau_ca' | 'cuoi_ca'
  groupedDaytime: Record<string, DailyCatalogItem[]>
  groupedClosing: Record<string, DailyClosingTask[]>
  daytimeGroupNames: string[]
  closingGroupNames: string[]
  selectedItem: { group: string; name: string; requirement?: string } | null
  isCreating: boolean
  createGroup: string | null
  onSelectItem: (item: { group: string; name: string; requirement?: string }) => void
  onCreateItem: (group: string) => void
  onDeleteDaytimeItem: (group: string, detail: string) => void
  onDeleteClosingTask: (id: string) => void
  onAddGroup: (name: string) => void
}

export function DailyCheckCatalogLeftPanel({
  activeShift,
  groupedDaytime,
  groupedClosing,
  daytimeGroupNames,
  closingGroupNames,
  selectedItem,
  isCreating,
  createGroup,
  onSelectItem,
  onCreateItem,
  onDeleteDaytimeItem,
  onDeleteClosingTask,
  onAddGroup,
}: DailyCheckCatalogLeftPanelProps) {
  // Adding Group state
  const [isAddingGroup, setIsAddingGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')

  const currentGroupNames = activeShift === 'dau_ca' ? daytimeGroupNames : closingGroupNames

  // Accordion expanded categories
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() => {
    return [daytimeGroupNames[0] || 'KHU VỰC SẢNH NGOÀI']
  })

  // Toggle single accordion group
  const toggleGroup = (grp: string) => {
    setExpandedGroups((prev) =>
      prev.includes(grp) ? prev.filter((g) => g !== grp) : [...prev, grp]
    )
  }

  // Expand all / Collapse all toggle
  const allExpanded = useMemo(() => {
    return currentGroupNames.length > 0 && currentGroupNames.every((g) => expandedGroups.includes(g))
  }, [currentGroupNames, expandedGroups])

  const handleToggleExpandAll = () => {
    if (allExpanded) {
      setExpandedGroups([])
    } else {
      setExpandedGroups([...currentGroupNames])
    }
  }

  const handleSaveGroup = () => {
    if (!newGroupName.trim()) return
    onAddGroup(newGroupName.trim())
    setNewGroupName('')
    setIsAddingGroup(false)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden text-left bg-background border-r border-border/70">
      {/* 1. Toolbar tinh gọn: Thu gọn / Mở tất cả & Thêm đầu mục */}
      <div className="p-2 px-3 border-b border-border/60 bg-muted/20 flex items-center justify-between gap-2 shrink-0">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleToggleExpandAll}
          className="h-6 text-[11px] gap-1 px-1.5 text-muted-foreground hover:text-foreground cursor-pointer font-normal"
        >
          <ChevronsUpDown className="h-3 w-3" />
          <span>{allExpanded ? 'Thu gọn tất cả' : 'Mở tất cả'}</span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsAddingGroup(true)}
          className="h-6 text-[11px] gap-1 px-2 cursor-pointer font-normal border-border/80"
        >
          <Plus className="h-3 w-3" />
          <span>Thêm đầu mục</span>
        </Button>
      </div>

      {/* 2. Form thêm đầu mục mới */}
      {isAddingGroup && (
        <div className="p-2.5 px-3 border-b border-border/70 bg-primary/5 flex items-center justify-between gap-1.5 shrink-0 animate-in fade-in-0 duration-150">
          <Input
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Tên đầu mục (VD: BẾP ĂN)..."
            className="h-6.5 text-xs bg-background flex-1 font-normal"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSaveGroup()}
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsAddingGroup(false)}
            className="h-6.5 text-xs px-1.5 font-normal"
          >
            Hủy
          </Button>
          <Button size="sm" onClick={handleSaveGroup} className="h-6.5 text-xs px-2 font-normal">
            Lưu
          </Button>
        </div>
      )}

      {/* 3. Danh sách dạng bảng đường line phẳng, không bọc nhiều viền, không nền hộp */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/60 bg-background">
        {currentGroupNames.length === 0 ? (
          <div className="text-center py-12 text-xs text-muted-foreground font-normal">
            Chưa có đầu mục nào.
          </div>
        ) : (
          currentGroupNames.map((grp, idx) => {
            const isExpanded = expandedGroups.includes(grp)
            const daytimeItemsInGrp = groupedDaytime[grp] || []
            const closingTasksInGrp = groupedClosing[grp] || []
            const count = activeShift === 'dau_ca' ? daytimeItemsInGrp.length : closingTasksInGrp.length
            const isGroupCreating = isCreating && createGroup === grp

            return (
              <div
                key={grp}
                className={cn(
                  'transition-colors',
                  isGroupCreating && 'bg-primary/5'
                )}
              >
                {/* Accordion Group Header - Dòng tiêu đề đầu mục phẳng */}
                <div
                  onClick={() => toggleGroup(grp)}
                  className={cn(
                    'py-2 px-3 flex items-center justify-between gap-2 cursor-pointer select-none transition-colors border-b border-border/40',
                    isExpanded ? 'bg-muted/30 font-medium' : 'bg-muted/10 hover:bg-muted/20 font-normal',
                    isGroupCreating && 'bg-primary/10 text-primary'
                  )}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-muted-foreground transition-transform">
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <span className="text-xs text-foreground truncate font-normal">
                      {idx + 1}. {grp}
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 font-normal ml-0.5 border-border/70 text-muted-foreground">
                      {count}
                    </Badge>
                  </div>

                  {/* Nút + Thêm tiêu chí vào nhóm */}
                  <Button
                    size="sm"
                    variant={isGroupCreating ? 'default' : 'ghost'}
                    onClick={(e) => {
                      e.stopPropagation()
                      onCreateItem(grp)
                      if (!isExpanded) {
                        setExpandedGroups((prev) => [...prev, grp])
                      }
                    }}
                    className={cn(
                      'h-5 text-[10px] gap-1 px-1.5 cursor-pointer font-normal shrink-0',
                      isGroupCreating
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                    title="Thêm tiêu chí mới vào đầu mục này"
                  >
                    <Plus className="h-2.5 w-2.5" />
                    <span>Thêm</span>
                  </Button>
                </div>

                {/* Danh sách tiêu chí bên trong: BỎ VIỀN, BỎ NỀN, HIỂN THỊ DẠNG BẢNG & ĐƯỜNG LINE */}
                {isExpanded && (
                  <div className="bg-background divide-y divide-border/30">
                    {activeShift === 'dau_ca' ? (
                      daytimeItemsInGrp.length === 0 ? (
                        <div className="text-center py-2.5 text-[11px] text-muted-foreground italic font-normal">
                          Chưa có chỉ tiêu nào.
                        </div>
                      ) : (
                        daytimeItemsInGrp.map((item, itemIdx) => {
                          const isSelected =
                            !isCreating &&
                            selectedItem?.group === grp &&
                            selectedItem?.name === item.detail

                          return (
                            <DailyCheckCatalogItemCard
                              key={`${item.group}-${item.detail}-${itemIdx}`}
                              name={item.detail}
                              requirement={item.requirement}
                              group={grp}
                              isSelected={isSelected}
                              isClosingShift={false}
                              onSelect={() =>
                                onSelectItem({
                                  group: grp,
                                  name: item.detail,
                                  requirement: item.requirement,
                                })
                              }
                              onDelete={() => onDeleteDaytimeItem(grp, item.detail)}
                            />
                          )
                        })
                      )
                    ) : closingTasksInGrp.length === 0 ? (
                      <div className="text-center py-2.5 text-[11px] text-muted-foreground italic font-normal">
                        Chưa có nhiệm vụ nào.
                      </div>
                    ) : (
                      closingTasksInGrp.map((task) => {
                        const isSelected =
                          !isCreating &&
                          selectedItem?.group === grp &&
                          selectedItem?.name === task.name

                        return (
                          <DailyCheckCatalogItemCard
                            key={task.id}
                            name={task.name}
                            requirement={task.description}
                            group={grp}
                            isSelected={isSelected}
                            isClosingShift={true}
                            onSelect={() =>
                              onSelectItem({
                                group: grp,
                                name: task.name,
                                requirement: task.description,
                              })
                            }
                            onDelete={() => onDeleteClosingTask(task.id)}
                          />
                        )
                      })
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
