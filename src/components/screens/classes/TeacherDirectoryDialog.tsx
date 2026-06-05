'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InlineSelect } from '@/components/controls'
import { EmptyState } from '@/components/shared'
import { mockTeachers } from '@/mocks/teacherRecords'
import { Search } from 'lucide-react'
import { getStatusBadgeClass } from '@/lib/statusColors'

interface TeacherDirectoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTeacher: (teacherId: string, teacherName: string) => void
  startTime?: string
  endTime?: string
  dayOfWeek?: string
}

const isTeacherConflicting = (teacherId: string, dayOfWeek?: string, startTime?: string): boolean => {
  if (!dayOfWeek || !startTime) return false
  const hour = parseInt(startTime.split(':')[0]) || 17
  const sum = teacherId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + 
              dayOfWeek.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) +
              hour
  return sum % 3 === 0
}

export function TeacherDirectoryDialog({
  open,
  onOpenChange,
  onSelectTeacher,
  startTime,
  dayOfWeek,
}: TeacherDirectoryDialogProps) {
  const [teacherSearch, setTeacherSearch] = useState('')
  const [teacherBranchFilter, setTeacherBranchFilter] = useState('all')

  const filteredTeachers = mockTeachers.filter((t) => {
    // Only show active (đang giảng dạy) teachers
    if (t.status !== 'active') return false

    // Search query filter
    if (teacherSearch.trim()) {
      const q = teacherSearch.toLowerCase()
      const match =
        t.name.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q) ||
        t.phone.includes(q) ||
        t.email.toLowerCase().includes(q)
      if (!match) return false
    }
    // Branch filter
    if (teacherBranchFilter !== 'all' && t.branch !== teacherBranchFilter) return false
    return true
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[75vh] flex flex-col p-0 overflow-hidden rounded-2xl border bg-background shadow-xl">
        <DialogTitle className="sr-only">Điều phối giáo viên hệ thống</DialogTitle>

        <div className="p-4 border-b space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-bold text-foreground">Điều phối giáo viên hệ thống</h3>
              <p className="text-xs text-muted-foreground">
                Tìm kiếm và gán giáo viên từ toàn bộ hệ thống cho ngày học đang chọn.
              </p>
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên, mã, email, SĐT..."
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <div>
              <InlineSelect
                value={teacherBranchFilter}
                options={[
                  { value: 'all', label: 'Tất cả chi nhánh' },
                  ...Array.from(new Set(mockTeachers.map((t) => t.branch))).map((b) => ({
                    value: b,
                    label: b,
                  })),
                ]}
                placeholder="Chi nhánh"
                onValueChange={setTeacherBranchFilter}
                className="w-full justify-between h-9 text-xs"
                variant="solid"
              />
            </div>
          </div>
        </div>

        {/* Teacher List Table */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {filteredTeachers.length === 0 ? (
            <div className="h-full flex items-center justify-center border border-dashed rounded-lg bg-muted/10 p-8">
              <EmptyState
                title="Không tìm thấy giáo viên"
                description="Hãy điều chỉnh bộ lọc hoặc từ khóa tìm kiếm để thử lại."
              />
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <table className="min-w-full divide-y divide-border text-left">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-4 py-2.5 text-xs font-bold text-muted-foreground uppercase">
                      Họ và tên / Mã GV
                    </th>
                    <th className="px-4 py-2.5 text-xs font-bold text-muted-foreground uppercase">
                      Chi nhánh chính
                    </th>
                    <th className="px-4 py-2.5 text-xs font-bold text-muted-foreground uppercase">
                      Môn giảng dạy
                    </th>
                    <th className="px-4 py-2.5 text-xs font-bold text-muted-foreground uppercase">
                      Lịch dạy
                    </th>
                    <th className="w-24 px-4 py-2.5 text-center text-xs font-bold text-muted-foreground uppercase">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {filteredTeachers.map((t) => {
                    const isConflict = isTeacherConflicting(t.id, dayOfWeek, startTime)
                    return (
                      <tr key={t.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-4 py-2 text-sm font-medium">
                          <div>
                            <span className="font-semibold text-foreground">{t.name}</span>
                            <span className="block text-xs text-muted-foreground font-normal font-mono mt-0.5">
                              {t.code} • {t.phone}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-xs text-muted-foreground font-medium">
                          {t.branch}
                        </td>
                        <td className="px-4 py-2 text-xs font-medium">
                          <div className="flex flex-wrap gap-1">
                            {t.subjects.map((s) => (
                              <span key={s} className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          {startTime ? (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadgeClass(
                                isConflict ? 'trung_lich' : 'trong_lich'
                              )}`}
                            >
                              {isConflict ? 'Trùng lịch' : 'Trống lịch'}
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onSelectTeacher(t.id, t.name)}
                            className="h-7 text-xs px-3"
                          >
                            Gán
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
