'use client'

import { useMemo, useState } from 'react'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { SegmentedControl } from '@/components/controls'
import { Panel, EmptyState, StatusBadge } from '@/components/shared'
import { getTeacherAssignments } from '@/mocks/teacherDetail'
import {
  formatScheduleString,
  getRoleLabel,
  getAssignmentStatusSemantic,
  getAssignmentStatusLabel,
} from './teacherDetailHelpers'

interface TeacherClassesTabProps {
  teacherId: string
}

export function TeacherClassesTab({ teacherId }: TeacherClassesTabProps) {
  const allAssignments = useMemo(() => getTeacherAssignments(teacherId), [teacherId])
  const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const filtered = useMemo(() => {
    if (filter === 'all') return allAssignments
    return allAssignments.filter((a) => a.status === filter)
  }, [allAssignments, filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  if (allAssignments.length === 0) {
    return <EmptyState title="Chưa có lớp nào" description="Giáo viên này chưa được phân công lớp nào." />
  }

  return (
    <div className="space-y-4">
      <SegmentedControl
        value={filter}
        onValueChange={(v) => { setFilter(v); setPage(1) }}
        options={[
          { value: 'all' as const, label: `Tất cả (${allAssignments.length})` },
          { value: 'active' as const, label: `Đang dạy (${allAssignments.filter((a) => a.status === 'active').length})` },
          { value: 'ended' as const, label: `Đã kết thúc (${allAssignments.filter((a) => a.status === 'ended').length})` },
        ]}
      />

      <Panel title="Danh sách lớp">
        <DataTableFrame
          footer={
            <DataTablePagination
              page={currentPage}
              total={filtered.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          }
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">Lớp</th>
                <th className="px-3 py-2 text-left font-medium">Vai trò</th>
                <th className="px-3 py-2 text-left font-medium">Sĩ số</th>
                <th className="hidden px-3 py-2 text-left font-medium md:table-cell">Lịch học</th>
                <th className="px-3 py-2 text-left font-medium">Phòng</th>
                <th className="px-3 py-2 text-left font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((a) => (
                <tr key={a.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-3 py-2">
                    <div className="font-medium">{a.classCode}</div>
                    <div className="text-xs text-muted-foreground">{a.className}</div>
                  </td>
                  <td className="px-3 py-2">{getRoleLabel(a.role)}</td>
                  <td className="px-3 py-2">{a.studentCount}/{a.maxStudents}</td>
                  <td className="hidden px-3 py-2 md:table-cell">{formatScheduleString(a.schedule, '')}</td>
                  <td className="px-3 py-2">{a.room}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={getAssignmentStatusSemantic(a.status)} label={getAssignmentStatusLabel(a.status)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataTableFrame>
      </Panel>
    </div>
  )
}
