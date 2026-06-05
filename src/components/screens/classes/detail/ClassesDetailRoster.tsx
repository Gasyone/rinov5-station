'use client'

import { useState } from 'react'
import { 
  Users, 
  Copy, 
  Check, 
  Phone, 
  Plus, 
  CalendarDays
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { filterRosterStudents, maskPhone } from './classesDetailHelpers'
import type { RosterStudent } from './classesDetailTypes'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { ConfirmDialog, StudentNotePopover } from '@/components/shared'
import { toast } from 'sonner'

interface ClassesDetailRosterProps {
  students: RosterStudent[]
  onAddStudent?: () => void
  onRemoveStudent?: (studentId: string) => void
  isReadOnly?: boolean
}

export function ClassesDetailRoster({ 
  students, 
  onAddStudent,
  onRemoveStudent,
  isReadOnly = false
}: ClassesDetailRosterProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'new' | 'trial' | 'reserve_transfer' | 'inactive'>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [removeConfirmStudent, setRemoveConfirmStudent] = useState<RosterStudent | null>(null)

  const filteredStudents = filterRosterStudents(students, filter)

  const handleCopyPhone = async (phone: string, id: string) => {
    try {
      await navigator.clipboard.writeText(phone)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Không thể sao chép số điện thoại:', err)
    }
  }

  const handleCallPhone = (phone: string, name: string) => {
    toast.info(`Đang kết nối cuộc gọi tới phụ huynh: ${name} (${phone})`)
  }

  const handleRemoveConfirm = () => {
    if (removeConfirmStudent && onRemoveStudent) {
      onRemoveStudent(removeConfirmStudent.id)
    }
    setRemoveConfirmStudent(null)
  }



  return (
    <div className="space-y-4">
      
      {/* Roster Toolbar: Tag Filter Selectors + Action button - Sticky to top */}
      <div className="sticky top-0 bg-background z-10 flex flex-wrap items-center justify-between gap-3 pb-3 pt-1 border-b mb-3">
        <div className="flex flex-wrap gap-1.5">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setFilter('all')}
            className="rounded-lg text-xs"
          >
            Tất cả ({students.length})
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setFilter('active')}
            className="rounded-lg text-xs"
          >
            Đang học ({students.filter(s => s.status === 'active').length})
          </Button>
          <Button
            variant={filter === 'new' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setFilter('new')}
            className="rounded-lg text-xs"
          >
            Mới ghi danh ({students.filter(s => s.status === 'new').length})
          </Button>
          <Button
            variant={filter === 'trial' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setFilter('trial')}
            className="rounded-lg text-xs"
          >
            Học thử ({students.filter(s => s.status === 'trial').length})
          </Button>
          <Button
            variant={filter === 'reserve_transfer' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setFilter('reserve_transfer')}
            className="rounded-lg text-xs"
          >
            Bảo lưu/Chuyển ({students.filter(s => s.status === 'reserve' || s.status === 'transferred').length})
          </Button>
          <Button
            variant={filter === 'inactive' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setFilter('inactive')}
            className="rounded-lg text-xs"
          >
            Đã nghỉ ({students.filter(s => s.status === 'dropout' || s.status === 'session_ended').length})
          </Button>
        </div>

        {!isReadOnly && onAddStudent && (
          <Button size="xs" variant="outline" onClick={onAddStudent} className="rounded-lg text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" /> Thêm học viên
          </Button>
        )}
      </div>

      {/* Roster Cards Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((student) => {
            const initials = student.name
              .trim()
              .split(' ')
              .map((n) => n[0])
              .slice(-2)
              .join('')
              .toUpperCase()

            const isReservedOrTransferred = student.status === 'reserve' || student.status === 'transferred' || student.status === 'dropout' || student.status === 'session_ended'

            return (
              <div 
                key={student.id} 
                className={`p-4 border rounded-xl bg-background flex flex-col justify-between shadow-xs transition-all border-muted/60 hover:border-muted-foreground/30 hover:shadow-sm ${
                  isReservedOrTransferred ? 'opacity-70 bg-muted/5' : ''
                }`}
              >
                {/* Top Row: Avatar + Name + Status & Enrollment Date */}
                <div className="flex items-start justify-between gap-3">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div className="flex items-center gap-3 cursor-help">
                        <div className={`h-10 w-10 shrink-0 rounded-xl font-bold flex items-center justify-center text-sm shadow-xs border ${
                          student.status === 'trial' 
                            ? 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-800' 
                            : student.status === 'new'
                              ? 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-400 dark:border-sky-800'
                              : isReservedOrTransferred
                                ? 'bg-muted text-muted-foreground border-border'
                                : 'bg-primary/10 text-primary border-primary/20'
                        }`}>
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-foreground hover:underline truncate">{student.name}</h4>
                          <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{student.code}</p>
                        </div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-4" align="start">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-muted">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            {initials}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-foreground">{student.name}</h4>
                            <p className="font-mono text-[9px] text-muted-foreground">{student.code}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-xs text-muted-foreground">
                          <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase pb-1 border-b border-muted/40">
                            LIÊN HỆ GIA ĐÌNH
                          </p>
                          {student.parents && student.parents.length > 0 ? (
                            student.parents.map((parent, idx) => (
                              <div key={idx} className="flex items-center justify-between py-1.5 border-b border-muted/30 last:border-0">
                                <div>
                                  <div className="font-semibold text-foreground text-xs">{parent.name} ({parent.relationship})</div>
                                  <div className="font-mono text-[10px] mt-0.5 text-muted-foreground">{maskPhone(parent.phone)}</div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleCallPhone(parent.phone, parent.name)
                                    }}
                                    className="h-6 w-6 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                                    title="Gọi điện"
                                  >
                                    <Phone className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleCopyPhone(parent.phone, `${student.id}-${idx}`)
                                    }}
                                    className="h-6 w-6 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                                    title="Sao chép số điện thoại"
                                  >
                                    {copiedId === `${student.id}-${idx}` ? (
                                      <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center justify-between py-1.5">
                              <div>
                                <div className="font-semibold text-foreground text-xs">{student.parentName} (Phụ huynh)</div>
                                <div className="font-mono text-[10px] mt-0.5 text-muted-foreground">{maskPhone(student.parentPhone)}</div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleCallPhone(student.parentPhone, student.parentName)
                                  }}
                                  className="h-6 w-6 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                                  title="Gọi điện"
                                >
                                  <Phone className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleCopyPhone(student.parentPhone, student.id)
                                  }}
                                  className="h-6 w-6 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                                  title="Sao chép số điện thoại"
                                >
                                  {copiedId === student.id ? (
                                    <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <div className="flex flex-col items-end gap-1.5 shrink-0 text-right">
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {/* Secondary Roster Tag (Virtual Status/Condition) */}
                      {(() => {
                        const classTag = (() => {
                          switch (student.status) {
                            case 'trial':
                              return { code: 'trial', label: 'Học thử' }
                            case 'reserve':
                              return { code: 'reserve', label: 'Bảo lưu' }
                            case 'transferred':
                              return { code: 'transferred', label: 'Đã chuyển' }
                            case 'session_ended':
                              return { code: 'session_ended', label: 'Hết buổi' }
                            case 'new':
                              return { code: 'new', label: 'Mới' }
                            default:
                              return null
                          }
                        })()
                        if (!classTag) return null
                        return (
                          <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider border ${getStatusBadgeClass(classTag.code)}`}>
                            {classTag.label}
                          </span>
                        )
                      })()}
                      
                      {/* Primary Official Status Badge */}
                      {(() => {
                        const officialStatus = (() => {
                          switch (student.status) {
                            case 'dropout':
                              return { code: 'dropout', label: 'Đã nghỉ' }
                            case 'new':
                            case 'trial':
                              return { code: 'new', label: 'Ghi danh' }
                            case 'active':
                            case 'reserve':
                            case 'transferred':
                            case 'session_ended':
                            default:
                              return { code: 'active', label: 'Đang học' }
                          }
                        })()
                        return (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(officialStatus.code)}`}>
                            {officialStatus.label}
                          </span>
                        )
                      })()}
                    </div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1 justify-end font-normal">
                      <CalendarDays className="h-3 w-3 text-muted-foreground/60" />
                      <span>Nhập học: <strong className="text-foreground font-semibold font-mono">{new Date(student.enrollmentDate).toLocaleDateString('vi-VN')}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Footer row: Student note (left) and Remove button (right) */}
                {(student.note || (!isReadOnly && onRemoveStudent && !isReservedOrTransferred)) && (
                  <div className="mt-3 border-t border-muted/50 pt-3 flex items-center justify-between gap-2">
                    {/* Note Popover Bubble */}
                    <StudentNotePopover 
                      note={student.note} 
                      label="Ghi chú học viên"
                      className="max-w-[70%]"
                    />

                    {!isReadOnly && onRemoveStudent && !isReservedOrTransferred && (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => setRemoveConfirmStudent(student)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg text-xs h-7 px-2.5 font-medium shrink-0 ml-auto"
                      >
                        Xóa khỏi lớp
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="p-8 border border-dashed rounded-xl flex flex-col items-center justify-center text-center bg-muted/5 py-16">
          <Users className="h-8 w-8 text-muted-foreground/60 mb-2" />
          <h4 className="text-sm font-bold text-foreground">Không tìm thấy học viên</h4>
          <p className="text-xs text-muted-foreground max-w-xs mt-1">
            Không có học viên nào trong roster khớp với bộ lọc trạng thái được chọn.
          </p>
        </div>
      )}

      {/* Confirm dialog for student removal */}
      <ConfirmDialog
        open={!!removeConfirmStudent}
        onOpenChange={(open) => { if (!open) setRemoveConfirmStudent(null) }}
        title="Xóa học viên khỏi lớp"
        description={removeConfirmStudent ? `Bạn có chắc chắn muốn xóa học viên "${removeConfirmStudent.name}" khỏi lớp học này? Hành động này không thể hoàn tác.` : ''}
        confirmLabel="Xóa"
        variant="destructive"
        onConfirm={handleRemoveConfirm}
      />
    </div>
  )
}
