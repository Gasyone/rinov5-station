'use client'

import { DataTableFrame, DataTablePagination } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { formatDateTime, calculatePercentage } from './eventManagementNewHelpers'
import { EventItem } from '@/mocks/eventManagement'
import { Eye, Edit2, Ban, Link2, UserCheck } from 'lucide-react'

interface EventManagementNewTableProps {
  events: EventItem[]
  onSelectDetail: (id: string) => void
  onSelectEdit: (evt: EventItem) => void
  onSelectCancel: (evt: EventItem) => void
  currentPage: number
  onPageChange: (page: number) => void
  pageSize: number
  onPageSizeChange: (size: number) => void
  selectedIds: Set<string>
  onToggleAll: (checked: boolean, ids: string[]) => void
  onToggleOne: (id: string, checked: boolean) => void
}

export function EventManagementNewTable({
  events,
  onSelectDetail,
  onSelectEdit,
  onSelectCancel,
  currentPage,
  onPageChange,
  pageSize,
  onPageSizeChange,
  selectedIds,
  onToggleAll,
  onToggleOne
}: EventManagementNewTableProps) {
  
  // Simulated pagination since it's mock data only
  const totalRecords = events.length
  const startIndex = (currentPage - 1) * pageSize
  const paginatedEvents = events.slice(startIndex, startIndex + pageSize)

  const columns = [
    { key: 'title', label: 'Tên Sự kiện / Mã' },
    { key: 'branch', label: 'Chi nhánh / Địa điểm' },
    { key: 'time', label: 'Thời gian tổ chức' },
    { key: 'capacity', label: 'Đăng ký / Sức chứa' },
    { key: 'status', label: 'Trạng thái' }
  ]

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-4 overflow-hidden">
      
      {/* Table Framework component */}
      <DataTableFrame className="flex-1 min-h-0 overflow-y-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 font-medium border-b sticky top-0 z-10 backdrop-blur-xs">
            <tr>
              <th className="p-3 w-12 text-center">
                <Checkbox
                  checked={paginatedEvents.length > 0 && paginatedEvents.every(e => selectedIds.has(e.id))}
                  onCheckedChange={(checked) => {
                    const pageIds = paginatedEvents.map(e => e.id)
                    onToggleAll(Boolean(checked), pageIds)
                  }}
                />
              </th>
              {columns.map(col => (
                <th 
                  key={col.key} 
                  className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedEvents.length > 0 ? (
              paginatedEvents.map(evt => {
                const fillPercent = calculatePercentage(evt.registeredCount, evt.capacity)
                const cleanLocation = evt.location.startsWith(evt.branch)
                  ? evt.location.substring(evt.branch.length).replace(/^(\s*-\s*|\s+)/, '')
                  : evt.location

                return (
                  <tr 
                    key={evt.id} 
                    className="hover:bg-muted/40 transition-colors cursor-pointer group"
                    onClick={() => onSelectDetail(evt.id)}
                  >
                    
                    {/* Checkbox Column */}
                    <td className="p-3 text-center w-12" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(evt.id)}
                        onCheckedChange={(checked) => onToggleOne(evt.id, Boolean(checked))}
                      />
                    </td>

                    {/* Tên Sự kiện + Nhãn Loại + Mã sự kiện + Hover Action Buttons */}
                    <td className="p-3 relative max-w-sm group">
                      <div className="relative z-10 max-w-full overflow-hidden pr-44">
                        <div className="space-y-1">
                          {/* Line 1: Title (One line only, with tooltip) */}
                          <div 
                            className="text-sm font-semibold text-foreground leading-tight truncate max-w-[260px] sm:max-w-[320px] block"
                            title={evt.title}
                          >
                            {evt.title}
                          </div>

                          {/* Line 2: Code + Badges on same line */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-mono text-muted-foreground font-semibold shrink-0">
                              {evt.id}
                            </span>
                            <span className="text-[10px] text-muted-foreground shrink-0">•</span>
                            <Badge variant="secondary" className="h-4 text-[8px] font-semibold rounded-full shrink-0 px-1.5 py-0.5">
                              {evt.typeLabel}
                            </Badge>
                            {evt.targetAudienceLabel && (
                              <Badge 
                                variant="outline" 
                                className={`h-4 text-[8px] font-bold rounded-full shrink-0 px-1.5 py-0.5 border ${
                                  evt.targetAudience === 'parent'
                                    ? 'bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200'
                                    : evt.targetAudience === 'student'
                                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200/50'
                                    : 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border-orange-200/50'
                                }`}
                              >
                                {evt.targetAudienceLabel}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Absolute actions visible ONLY on hover, similar to other screens */}
                        <div 
                          className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-background/95 dark:bg-background/95 backdrop-blur-xs pl-2 py-1 rounded-l-md"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-primary hover:bg-accent rounded-full border-0 shadow-none bg-transparent"
                            onClick={() => onSelectDetail(evt.id)}
                            title="Xem Chi tiết"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {/* Copy Link Đăng Ký */}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-primary hover:bg-accent rounded-full border-0 shadow-none bg-transparent"
                            onClick={() => {
                              const link = `https://register.rinoedu.vn/event/${evt.id}`
                              void navigator.clipboard.writeText(link)
                              alert(`Đã sao chép link đăng ký sự kiện cho phụ huynh:\n${link}`)
                            }}
                            title="Sao chép link đăng ký"
                          >
                            <Link2 className="h-4 w-4" />
                          </Button>
                          
                          {/* Điểm danh nhanh tại quầy */}
                          {evt.status === 'dang_dien_ra' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 rounded-full border-0 shadow-none bg-transparent"
                              onClick={() => {
                                alert(`Mở quầy check-in & đón tiếp nhanh cho sự kiện ${evt.title}.`)
                                onSelectDetail(evt.id)
                              }}
                              title="Điểm danh nhanh tại quầy"
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          )}

                          {(evt.status === 'nhap' || evt.status === 'mo_dang_ky') && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-primary hover:bg-accent rounded-full border-0 shadow-none bg-transparent"
                              onClick={() => onSelectEdit(evt)}
                              title="Chỉnh sửa"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                          {evt.status !== 'ket_thuc' && evt.status !== 'huy' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full border-0 shadow-none bg-transparent"
                              onClick={() => onSelectCancel(evt)}
                              title="Hủy Sự kiện"
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Chi nhánh / Địa điểm (Phòng/vị trí tổ chức ở dưới chi nhánh) */}
                    <td className="p-3">
                      <div className="space-y-0.5">
                        <p className="text-xs text-foreground font-medium">
                          {evt.branch}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {cleanLocation}
                        </p>
                      </div>
                    </td>

                    {/* Date/Time */}
                    <td className="p-3 text-xs text-muted-foreground">
                      {formatDateTime(evt.startDate)}
                    </td>

                    {/* Capacity progress */}
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <div className="space-y-1 w-28">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>{evt.registeredCount}/{evt.capacity}</span>
                          <span>{fillPercent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 rounded-full ${
                              fillPercent >= 100 
                                ? 'bg-amber-500' 
                                : 'bg-primary'
                            }`}
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-3">
                      <Badge className={getStatusBadgeClass(evt.status)}>
                        {evt.statusLabel}
                      </Badge>
                    </td>

                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="p-8 text-center text-xs text-muted-foreground">
                  Không tìm thấy sự kiện nào khớp bộ lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </DataTableFrame>

      {/* Standardized pagination footer */}
      <DataTablePagination
        page={currentPage}
        total={totalRecords}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  )
}
