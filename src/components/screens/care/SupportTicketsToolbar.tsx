'use client'

import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToolbarSelect, ExpandableSearch } from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { getTickets } from '@/mocks/tickets'

interface SupportTicketsToolbarProps {
  activeStatus: 'all' | 'new' | 'in_progress' | 'completed' | 'pending' | 'cancelled'
  onStatusChange: (status: 'all' | 'new' | 'in_progress' | 'completed' | 'pending' | 'cancelled') => void
  searchQuery: string
  onSearchChange: (q: string) => void
  categoryFilter: string
  onCategoryChange: (cat: string) => void
  priorityFilter: string
  onPriorityChange: (prio: string) => void
  onCreateTicket: () => void
}

export function SupportTicketsToolbar({
  activeStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  priorityFilter,
  onPriorityChange,
  onCreateTicket,
}: SupportTicketsToolbarProps) {
  const allTickets = useMemo(() => getTickets({}), [])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      new: 0,
      in_progress: 0,
      completed: 0,
      pending: 0,
      cancelled: 0,
    }
    for (const t of allTickets) {
      counts[t.status] = (counts[t.status] ?? 0) + 1
    }
    return counts
  }, [allTickets])

  const tiles: StatusTile<'all' | 'new' | 'in_progress' | 'completed' | 'pending' | 'cancelled'>[] = useMemo(
    () => [
      { id: 'all', label: 'Tất cả', count: allTickets.length, semantic: 'neutral' },
      { id: 'new', label: 'Mới', count: statusCounts.new, status: 'new' },
      { id: 'in_progress', label: 'Đang xử lý', count: statusCounts.in_progress, status: 'in_progress' },
      { id: 'completed', label: 'Hoàn thành', count: statusCounts.completed, status: 'completed' },
      { id: 'pending', label: 'Chờ duyệt', count: statusCounts.pending, status: 'pending' },
      { id: 'cancelled', label: 'Đã hủy', count: statusCounts.cancelled, status: 'cancelled' },
    ],
    [allTickets.length, statusCounts]
  )

  const categoryOptions = [
    { value: '', label: 'Tất cả phân loại' },
    { value: 'academic', label: 'Học thuật' },
    { value: 'billing', label: 'Học phí' },
    { value: 'attendance', label: 'Chuyên cần' },
    { value: 'general', label: 'Chung' },
  ]

  const priorityOptions = [
    { value: '', label: 'Tất cả mức ưu tiên' },
    { value: 'high', label: 'Cao' },
    { value: 'medium', label: 'Trung bình' },
    { value: 'low', label: 'Thấp' },
  ]

  return (
    <div className="flex shrink-0 items-center justify-between gap-4 bg-background px-4 py-3 lg:px-6">
      <div className="flex-1 overflow-x-auto min-w-0">
        <StatusTiles
          tiles={tiles}
          activeId={activeStatus}
          onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ExpandableSearch
          value={searchQuery}
          onValueChange={onSearchChange}
          placeholder="Tìm mã ticket, tên học viên..."
          inputClassName="sm:w-64"
        />
        <ToolbarSelect
          value={categoryFilter}
          onValueChange={onCategoryChange}
          options={categoryOptions}
          ariaLabel="Phân loại"
        />
        <ToolbarSelect
          value={priorityFilter}
          onValueChange={onPriorityChange}
          options={priorityOptions}
          ariaLabel="Độ ưu tiên"
        />
        <Button size="sm" onClick={onCreateTicket}>
          <Plus className="h-4 w-4 mr-1.5" />
          Tạo phiếu mới
        </Button>
      </div>
    </div>
  )
}
