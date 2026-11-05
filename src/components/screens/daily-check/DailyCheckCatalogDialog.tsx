'use client'

import React, { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { DailyCheckCatalogLeftPanel } from './DailyCheckCatalogLeftPanel'
import { DailyCheckCatalogRightPanel } from './DailyCheckCatalogRightPanel'
import {
  setCustomItemStandard,
  type DailyStandardMedia,
} from './dailyCheckStandards'
import {
  DAILY_CATALOG_ITEMS,
  DAILY_CLOSING_TASKS,
  type DailyCatalogItem,
  type DailyClosingTask,
} from '@/mocks/dailyCheck'
import {
  groupCatalogByCategory,
  groupClosingTasksByCategory,
} from './dailyCheckHelpers'

export interface DailyCheckCatalogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DailyCheckCatalogDialog({ open, onOpenChange }: DailyCheckCatalogDialogProps) {
  const [activeShift, setActiveShift] = useState<'dau_ca' | 'cuoi_ca'>('dau_ca')

  // Catalog items local state
  const [daytimeItems, setDaytimeItems] = useState<DailyCatalogItem[]>(DAILY_CATALOG_ITEMS)
  const [closingTasks, setClosingTasks] = useState<DailyClosingTask[]>(DAILY_CLOSING_TASKS)

  // Grouped daytime catalog
  const groupedDaytime = useMemo(() => {
    return groupCatalogByCategory(daytimeItems)
  }, [daytimeItems])

  const daytimeGroupNames = useMemo(() => {
    return Object.keys(groupedDaytime)
  }, [groupedDaytime])

  // Grouped closing tasks
  const groupedClosing = useMemo(() => {
    return groupClosingTasksByCategory(closingTasks)
  }, [closingTasks])

  const closingGroupNames = useMemo(() => {
    return Object.keys(groupedClosing)
  }, [groupedClosing])

  // Selected item for right panel viewing/editing
  const [selectedItem, setSelectedItem] = useState<{
    group: string
    name: string
    requirement?: string
  } | null>(() => {
    const first = DAILY_CATALOG_ITEMS[0]
    return first ? { group: first.group, name: first.detail, requirement: first.requirement } : null
  })

  // Mode creation & editing
  const [isCreating, setIsCreating] = useState(false)
  const [createGroup, setCreateGroup] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Switch shift handler
  const handleShiftChange = (shift: 'dau_ca' | 'cuoi_ca') => {
    setActiveShift(shift)
    setIsCreating(false)
    setCreateGroup(null)
    setIsEditing(false)

    // Tự động chọn mục đầu tiên của ca đó để panel phải luôn hiển thị đầy đủ
    if (shift === 'dau_ca') {
      const first = daytimeItems[0]
      if (first) {
        setSelectedItem({ group: first.group, name: first.detail, requirement: first.requirement })
      }
    } else {
      const first = closingTasks[0]
      if (first) {
        setSelectedItem({ group: first.group, name: first.name, requirement: first.description })
      }
    }
  }

  // Chọn 1 tiêu chí bên panel trái để xem bên panel phải
  const handleSelectItem = (item: { group: string; name: string; requirement?: string }) => {
    setSelectedItem(item)
    setIsCreating(false)
    setCreateGroup(null)
    setIsEditing(false)
  }

  // Bấm nút "+ Thêm" tại một khu vực để mở form tạo mới ở panel phải
  const handleStartCreateItem = (group: string) => {
    setIsCreating(true)
    setCreateGroup(group)
    setIsEditing(false)
  }

  const handleCancelCreate = () => {
    setIsCreating(false)
    setCreateGroup(null)
  }

  // Lưu tiêu chí mới từ Right Panel
  const handleSaveNewItem = (
    group: string,
    name: string,
    requirement: string,
    media: Partial<DailyStandardMedia>
  ) => {
    // 1. Lưu bộ tiêu chuẩn 5 sao vào cache
    setCustomItemStandard(name, media)

    // 2. Thêm vào danh mục ca
    if (activeShift === 'dau_ca') {
      const newItem: DailyCatalogItem = {
        stt: String(daytimeGroupNames.indexOf(group) + 1),
        group,
        detail: name,
        requirement,
      }
      setDaytimeItems((prev) => [...prev, newItem])
    } else {
      const task: DailyClosingTask = {
        id: `task_${Date.now()}`,
        group,
        name,
        description: requirement,
      }
      setClosingTasks((prev) => [...prev, task])
    }

    // 3. Chuyển ngay sang chế độ xem tiêu chí vừa tạo ở panel phải
    setSelectedItem({ group, name, requirement })
    setIsCreating(false)
    setCreateGroup(null)
    toast.success(`Đã thêm tiêu chí "${name}" kèm quy chuẩn 5 sao vào "${group}"!`)
  }

  // Cập nhật tiêu chí & quy chuẩn từ Right Panel
  const handleUpdateItem = (
    group: string,
    oldName: string,
    newName: string,
    requirement: string,
    media: Partial<DailyStandardMedia>
  ) => {
    // 1. Lưu tiêu chuẩn vào cache
    setCustomItemStandard(newName, media)

    // 2. Cập nhật tên & yêu cầu trong danh mục
    if (activeShift === 'dau_ca') {
      setDaytimeItems((prev) =>
        prev.map((it) => {
          if (it.group === group && it.detail === oldName) {
            return { ...it, detail: newName, requirement }
          }
          return it
        })
      )
    } else {
      setClosingTasks((prev) =>
        prev.map((t) => {
          if (t.group === group && t.name === oldName) {
            return { ...t, name: newName, description: requirement }
          }
          return t
        })
      )
    }

    // 3. Cập nhật selectedItem
    setSelectedItem({ group, name: newName, requirement })
    setIsEditing(false)
    toast.success(`Đã cập nhật tiêu chuẩn và quy cách vận hành cho "${newName}".`)
  }

  // Xóa tiêu chí
  const handleDeleteDaytimeItem = (grp: string, detail: string) => {
    setDaytimeItems((prev) => prev.filter((it) => !(it.group === grp && it.detail === detail)))
    if (selectedItem?.group === grp && selectedItem?.name === detail) {
      const remaining = daytimeItems.filter((it) => !(it.group === grp && it.detail === detail))
      if (remaining[0]) {
        setSelectedItem({
          group: remaining[0].group,
          name: remaining[0].detail,
          requirement: remaining[0].requirement,
        })
      } else {
        setSelectedItem(null)
      }
    }
    toast.info(`Đã xóa tiêu chí "${detail}".`)
  }

  const handleDeleteClosingTask = (id: string) => {
    const taskToDelete = closingTasks.find((t) => t.id === id)
    setClosingTasks((prev) => prev.filter((t) => t.id !== id))
    if (taskToDelete && selectedItem?.name === taskToDelete.name) {
      const remaining = closingTasks.filter((t) => t.id !== id)
      if (remaining[0]) {
        setSelectedItem({
          group: remaining[0].group,
          name: remaining[0].name,
          requirement: remaining[0].description,
        })
      } else {
        setSelectedItem(null)
      }
    }
    toast.info('Đã xóa nhiệm vụ chốt ca.')
  }

  // Thêm đầu mục mới
  const handleAddGroup = (groupName: string) => {
    const name = groupName.toUpperCase()

    if (activeShift === 'dau_ca') {
      if (daytimeGroupNames.includes(name)) {
        toast.error('Đầu mục này đã tồn tại trong ca sáng.')
        return
      }
      const placeholder: DailyCatalogItem = {
        stt: String(daytimeGroupNames.length + 1),
        group: name,
        detail: 'Kiểm tra tổng quan',
        requirement: 'Sạch sẽ, gọn gàng, hoạt động bình thường theo chuẩn 5 sao.',
      }
      setDaytimeItems((prev) => [...prev, placeholder])
      setSelectedItem({ group: name, name: placeholder.detail, requirement: placeholder.requirement })
    } else {
      if (closingGroupNames.includes(name)) {
        toast.error('Đầu mục này đã tồn tại trong ca tối.')
        return
      }
      const placeholderTask: DailyClosingTask = {
        id: `task_${Date.now()}`,
        group: name,
        name: 'Kiểm tra tổng quan ca tối',
        description: 'Thực hiện kiểm tra và hoàn tất theo ca.',
      }
      setClosingTasks((prev) => [...prev, placeholderTask])
      setSelectedItem({ group: name, name: placeholderTask.name, requirement: placeholderTask.description })
    }

    toast.success(`Đã thêm đầu mục mới: ${name}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] sm:max-w-4xl lg:max-w-5xl h-[590px] max-h-[82vh] p-0 flex flex-col overflow-hidden text-foreground gap-0 text-left rounded-xl border-border/80 shadow-2xl">
        {/* Header Modal: Title gọn gàng kèm Tab lọc Đầu ca / Cuối ca */}
        <DialogHeader className="p-2.5 px-5 shrink-0 border-b border-border/70 bg-background flex flex-row items-center justify-between gap-3 pr-10">
          <div className="flex items-center gap-3.5 flex-wrap">
            <DialogTitle className="text-sm font-medium text-foreground">
              Danh mục &amp; Tiêu chuẩn đánh giá 5 sao
            </DialogTitle>

            {/* Tab lọc Đầu ca / Cuối ca đưa lên Header */}
            <div className="flex items-center p-0.5 rounded-lg bg-muted/80 text-xs">
              <button
                type="button"
                onClick={() => handleShiftChange('dau_ca')}
                className={cn(
                  'flex items-center gap-1.5 py-1 px-2.5 rounded-md cursor-pointer transition-colors text-xs font-normal',
                  activeShift === 'dau_ca'
                    ? 'bg-background text-foreground shadow-xs font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Sun className="h-3.5 w-3.5 text-amber-500" />
                <span>Đầu ca ({daytimeItems.length})</span>
              </button>

              <button
                type="button"
                onClick={() => handleShiftChange('cuoi_ca')}
                className={cn(
                  'flex items-center gap-1.5 py-1 px-2.5 rounded-md cursor-pointer transition-colors text-xs font-normal',
                  activeShift === 'cuoi_ca'
                    ? 'bg-background text-foreground shadow-xs font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Moon className="h-3.5 w-3.5 text-indigo-400" />
                <span>Cuối ca ({closingTasks.length})</span>
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Bố cục chia Trái - Phải (Left Master List - Right Detail / Creator) */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border/60 overflow-hidden bg-background">
          {/* CỘT TRÁI: Danh sách danh mục & tiêu chí dạng List phẳng */}
          <div className="w-full md:w-[300px] lg:w-[330px] shrink-0 h-full overflow-hidden">
            <DailyCheckCatalogLeftPanel
              activeShift={activeShift}
              groupedDaytime={groupedDaytime}
              groupedClosing={groupedClosing}
              daytimeGroupNames={daytimeGroupNames}
              closingGroupNames={closingGroupNames}
              selectedItem={selectedItem}
              isCreating={isCreating}
              createGroup={createGroup}
              onSelectItem={handleSelectItem}
              onCreateItem={handleStartCreateItem}
              onDeleteDaytimeItem={handleDeleteDaytimeItem}
              onDeleteClosingTask={handleDeleteClosingTask}
              onAddGroup={handleAddGroup}
            />
          </div>

          {/* CỘT PHẢI: Xem chi tiết tiêu chuẩn hoặc Form thêm mới / chỉnh sửa */}
          <div className="flex-1 h-full overflow-hidden">
            <DailyCheckCatalogRightPanel
              selectedItem={selectedItem}
              isCreating={isCreating}
              createGroup={createGroup}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              onCancelCreate={handleCancelCreate}
              onSaveNewItem={handleSaveNewItem}
              onUpdateItem={handleUpdateItem}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
