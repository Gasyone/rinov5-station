import { useState, useMemo } from 'react'
import { Eye, Star } from 'lucide-react'
import { DataTableFrame, DataTablePagination } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { EmptyState, StatusTiles, PersonnelHoverCard, type StatusTile, type PersonnelItem } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { getInitials } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { ClassSession } from './calendarClassScheduleTypes'

export type ListFilterId = 'all' | 'today' | 'upcoming' | 'past' | 'cancelled' | 'opening' | 'substitute'

interface CalendarClassScheduleListTableProps {
  sessions: ClassSession[]
  onSelectSession: (session: ClassSession) => void
}

function getTeacherPersonnel(name: string, role = 'Giáo viên Tiếng Anh', isSub = false): PersonnelItem {
  const cleanName = name.replace(/^TG:\s*/i, '').trim()
  const initials = getInitials(cleanName)
  const cleanEmail = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '')
  return {
    id: `EMP-${initials}`,
    name: cleanName,
    role: role,
    phone: '0912345678',
    email: `${cleanEmail || 'teacher'}@rinoedu.edu.vn`,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(cleanName)}`,
    isSubstitute: isSub,
  }
}

export function CalendarClassScheduleListTable({
  sessions,
  onSelectSession,
}: CalendarClassScheduleListTableProps) {
  const [activeTile, setActiveTile] = useState<ListFilterId>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Main class status tiles (Left side) with "Hôm nay" placed directly after "Tất cả"
  const mainStatusTiles: StatusTile<ListFilterId>[] = useMemo(() => {
    const allCount = sessions.length
    const todayCount = sessions.filter((s) => s.dateBucket === 'today' && s.status !== 'cancelled').length
    const upcomingCount = sessions.filter((s) => s.dateBucket === 'upcoming' && s.status !== 'cancelled').length
    const pastCount = sessions.filter((s) => s.dateBucket === 'past' && s.status !== 'cancelled').length
    const cancelledCount = sessions.filter((s) => s.status === 'cancelled').length

    return [
      { id: 'all', label: 'Tất cả', count: allCount, semantic: 'neutral' },
      { id: 'today', label: 'Hôm nay', count: todayCount, semantic: 'success' },
      { id: 'upcoming', label: 'Sắp diễn ra', count: upcomingCount, semantic: 'neutral' },
      { id: 'past', label: 'Đã diễn ra', count: pastCount, semantic: 'neutral' },
      { id: 'cancelled', label: 'Đã hủy', count: cancelledCount, semantic: 'warning' },
    ]
  }, [sessions])

  // Special condition filter tiles (Right side)
  const conditionTiles: StatusTile<ListFilterId>[] = useMemo(() => {
    const openingCount = sessions.filter((s) => s.isOpeningDay).length
    const substituteCount = sessions.filter((s) => Boolean(s.substituteTeacher)).length

    return [
      { id: 'opening', label: 'Khai giảng', count: openingCount, semantic: 'error' },
      { id: 'substitute', label: 'Dạy thay', count: substituteCount, semantic: 'purple' },
    ]
  }, [sessions])

  // Displayed sessions derived from selected filter tile
  const displayedSessions = useMemo(() => {
    if (activeTile === 'all') return sessions
    if (activeTile === 'today') return sessions.filter((s) => s.dateBucket === 'today' && s.status !== 'cancelled')
    if (activeTile === 'upcoming') return sessions.filter((s) => s.dateBucket === 'upcoming' && s.status !== 'cancelled')
    if (activeTile === 'past') return sessions.filter((s) => s.dateBucket === 'past' && s.status !== 'cancelled')
    if (activeTile === 'cancelled') return sessions.filter((s) => s.status === 'cancelled')
    if (activeTile === 'opening') return sessions.filter((s) => s.isOpeningDay)
    if (activeTile === 'substitute') return sessions.filter((s) => Boolean(s.substituteTeacher))
    return sessions
  }, [sessions, activeTile])

  // Pagination logic
  const total = displayedSessions.length
  const totalPages = Math.ceil(total / pageSize) || 1
  const currentPage = Math.min(page, totalPages)

  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return displayedSessions.slice(start, start + pageSize)
  }, [displayedSessions, currentPage, pageSize])

  // Selection handlers
  const isAllSelected =
    paginatedSessions.length > 0 && paginatedSessions.every((s) => selectedIds.has(s.id))

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        paginatedSessions.forEach((s) => next.delete(s.id))
        return next
      })
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        paginatedSessions.forEach((s) => next.add(s.id))
        return next
      })
    }
  }

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleTileSelect = (id: ListFilterId) => {
    if (activeTile === id && id !== 'all') {
      setActiveTile('all')
    } else {
      setActiveTile(id)
    }
    setPage(1)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden min-h-0 px-3 py-2 lg:px-4 gap-2">
      {/* Filter Row: Main lifecycle statuses on left, Special conditions on right (no overflow collapse) */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div className="flex items-center min-w-0">
          <StatusTiles
            tiles={mainStatusTiles}
            activeId={activeTile}
            onSelect={handleTileSelect}
            noOverflowCollapse
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusTiles
            tiles={conditionTiles}
            activeId={activeTile}
            onSelect={handleTileSelect}
            noOverflowCollapse
          />
        </div>
      </div>

      {/* Main Table + Tight Footer Container */}
      {displayedSessions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-6 border border-border rounded-lg bg-card">
          <EmptyState
            title="Không tìm thấy buổi học nào"
            description="Thử chọn tab trạng thái khác hoặc điều chỉnh bộ lọc tìm kiếm."
          />
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden min-h-0 rounded-lg border border-border bg-card shadow-2xs">
          <DataTableFrame className="flex-1 overflow-auto border-b border-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold sticky top-0 z-10 backdrop-blur-xs">
                <tr>
                  <th className="py-2 px-3 w-10 text-center">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleToggleSelectAll}
                      aria-label="Chọn tất cả buổi học"
                    />
                  </th>
                  <th className="py-2 px-3 min-w-[240px]">Mã & Tên lớp</th>
                  <th className="py-2 px-3 min-w-[130px]">Chương trình / Môn</th>
                  <th className="py-2 px-3 min-w-[140px]">Cơ sở & Phòng</th>
                  <th className="py-2 px-3 min-w-[130px]">Ngày & Giờ học</th>
                  <th className="py-2 px-3 min-w-[180px]">Giáo viên</th>
                  <th className="py-2 px-3 min-w-[100px] text-center">Sĩ số</th>
                  <th className="py-2 px-3 min-w-[120px] text-center">Đánh giá</th>
                  <th className="py-2 px-3 min-w-[110px] text-center">Nộp BTV</th>
                  <th className="py-2 px-3 min-w-[120px]">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginatedSessions.map((session) => {
                  const statusKey = session.status || (session.dateBucket === 'past' ? 'completed' : 'confirmed')
                  const statusBadgeClass = getStatusBadgeClass(statusKey)
                  const isChecked = selectedIds.has(session.id)

                  return (
                    <tr
                      key={session.id}
                      onClick={() => onSelectSession(session)}
                      className={cn(
                        "group transition-colors cursor-pointer",
                        isChecked ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/30"
                      )}
                    >
                      <td className="py-2 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => handleToggleSelect(session.id)}
                          aria-label={`Chọn buổi ${session.classCode}`}
                        />
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <div className="flex items-center gap-1.5 font-bold text-foreground">
                              <span>{session.classCode}</span>
                              {session.isOpeningDay && (
                                <Badge className="bg-red-500/10 text-red-600 border-red-200 dark:border-red-800 text-[9px] px-1 py-0 font-bold uppercase shrink-0">
                                  Khai giảng
                                </Badge>
                              )}
                            </div>
                            <span className="text-[11px] text-muted-foreground line-clamp-1">
                              {session.className}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              onSelectSession(session)
                            }}
                            className="size-7 shrink-0 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto"
                            title="Xem chi tiết buổi học"
                          >
                            <Eye className="size-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{session.subject}</span>
                          <span className="text-[11px] text-muted-foreground">Level: {session.level}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground truncate max-w-[140px]" title={session.branch}>
                            {session.branch}
                          </span>
                          <span className="text-[11px] text-muted-foreground">Phòng: {session.schoolRoom}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{session.dateDisplay || session.date}</span>
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {session.timeLabel} - {session.endTimeLabel}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex flex-col gap-1">
                          {/* Line 1: Main/Substitute Teacher with PersonnelHoverCard */}
                          {(() => {
                            const activeTeacher = session.substituteTeacher || session.teacher
                            const teacherPersonnel = getTeacherPersonnel(activeTeacher, 'Giáo viên Tiếng Anh', Boolean(session.substituteTeacher))
                            return (
                              <PersonnelHoverCard person={teacherPersonnel}>
                                <div
                                  className="flex items-center gap-1.5 cursor-pointer group/teacher hover:opacity-80 transition-opacity"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Avatar className="size-6 shrink-0 border border-border/60">
                                    <AvatarImage src={teacherPersonnel.avatar ?? undefined} alt={activeTeacher} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-[9px] font-bold">
                                      {getInitials(activeTeacher)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex items-center gap-1 min-w-0">
                                    <span className={cn("font-medium text-xs", session.substituteTeacher ? "text-sky-700 dark:text-sky-400 font-semibold" : "text-foreground hover:underline")}>
                                      {activeTeacher}
                                    </span>
                                    {session.substituteTeacher && (
                                      <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold truncate max-w-[100px]">
                                        (Dạy thay cho {session.teacher})
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </PersonnelHoverCard>
                            )
                          })()}

                          {/* Line 2: Assistant Teacher with PersonnelHoverCard */}
                          {(() => {
                            const assistantName = session.assistantSubstitute || session.assistantTeacher
                            if (!assistantName) return null
                            const assistantPersonnel = getTeacherPersonnel(assistantName, 'Trợ giảng', Boolean(session.assistantSubstitute))
                            return (
                              <PersonnelHoverCard person={assistantPersonnel}>
                                <div
                                  className="flex items-center gap-1.5 cursor-pointer group/assistant hover:opacity-80 transition-opacity"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Avatar className="size-5 shrink-0 border border-border/60">
                                    <AvatarImage src={assistantPersonnel.avatar ?? undefined} alt={assistantName} />
                                    <AvatarFallback className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[8px] font-bold">
                                      {getInitials(assistantName)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-[11px] text-muted-foreground hover:underline hover:text-foreground font-medium truncate max-w-[140px]">
                                    TG: {assistantName}
                                  </span>
                                </div>
                              </PersonnelHoverCard>
                            )
                          })()}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-foreground">{session.totalStudents} HS</span>
                          {session.trialStudents > 0 && (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                              {session.trialStudents} học thử
                            </span>
                          )}
                        </div>
                      </td>

                      {/* NEW COLUMN 1: Đánh giá / Rating */}
                      <td className="py-2 px-3 text-center">
                        {session.ratingCount && session.ratingCount > 0 && session.ratingAverage ? (
                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                              <Star className="size-3.5 fill-amber-400 text-amber-500" />
                              <span>{session.ratingAverage.toFixed(1)}</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground font-medium">
                              {session.ratingCount}/{session.totalStudents} ĐG
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground/60 italic">—</span>
                        )}
                      </td>

                      {/* NEW COLUMN 2: Nộp BTV */}
                      <td className="py-2 px-3 text-center">
                        {session.homeworkSubmitted !== undefined && session.homeworkSubmitted > 0 ? (
                          <div className="flex flex-col items-center">
                            <span className="font-bold text-foreground">
                              {session.homeworkSubmitted}/{session.totalStudents}
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              ({Math.round((session.homeworkSubmitted / session.totalStudents) * 100)}%)
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground/60 italic">—</span>
                        )}
                      </td>

                      <td className="py-2 px-3">
                        <div className="flex flex-col items-start">
                          <Badge className={cn("text-[10px] font-semibold border px-2 py-0.5", statusBadgeClass)}>
                            {session.statusLabel || (statusKey === 'completed' ? 'Đã hoàn thành' : statusKey === 'cancelled' ? 'Đã hủy' : 'Đã lên lịch')}
                          </Badge>
                          {session.attendedStudents !== undefined && (
                            <span className="text-[10.5px] font-normal text-emerald-600 dark:text-emerald-400 mt-0.5">
                              Đã điểm danh
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </DataTableFrame>

          {/* Tight Standard Pagination Footer */}
          <div className="shrink-0 bg-background/60 border-t border-border/40">
            <DataTablePagination
              total={total}
              pageSize={pageSize}
              page={currentPage}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize)
                setPage(1)
              }}
              pageSizeOptions={[20, 50, 100]}
            />
          </div>
        </div>
      )}
    </div>
  )
}
