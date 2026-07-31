'use client'

import { Tabs, TabsContent } from '@/components/ui/tabs'
import {
  DetailDialogFrame,
  DetailDialogTabsList,
  EmptyState,
  ModuleLoadingSkeleton,
} from '@/components/shared'
import { type TeacherRecord } from '@/mocks/teacherRecords'
import { TEACHER_TABS } from './teacherDetailTypes'
import { TEACHER_STATUS_LABELS } from './teacherTypes'
import { TeacherOverviewTab } from './TeacherOverviewTab'
import { TeacherClassesTab } from './TeacherClassesTab'
import { TeacherScheduleTab } from './TeacherScheduleTab'
import { TeacherSubHistoryTab } from './TeacherSubHistoryTab'
import { TeacherQualityTab } from './TeacherQualityTab'
import { TeacherStatsTab } from './TeacherStatsTab'
import { TeacherNotesTab } from './TeacherNotesTab'
import { TeacherActivityLogTab } from './TeacherActivityLogTab'

interface TeacherDetailDialogProps {
  teacher: TeacherRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading?: boolean
}

export function TeacherDetailDialog({
  teacher,
  open,
  onOpenChange,
  isLoading = false,
}: TeacherDetailDialogProps) {
  if (isLoading) {
    return (
      <DetailDialogFrame
        open={open}
        onOpenChange={onOpenChange}
        title="Chi tiết giáo viên"
        accessibleTitle="Đang tải chi tiết giáo viên"
      >
        <ModuleLoadingSkeleton showToolbar={false} className="p-4 lg:p-6" />
      </DetailDialogFrame>
    )
  }

  if (!teacher) {
    return (
      <DetailDialogFrame
        open={open}
        onOpenChange={onOpenChange}
        title="Chi tiết giáo viên"
        accessibleTitle="Chi tiết giáo viên"
      >
        <EmptyState
          title="Không tìm thấy giáo viên"
          description="Giáo viên này không tồn tại hoặc đã bị xóa."
        />
      </DetailDialogFrame>
    )
  }

  return (
    <DetailDialogFrame
      open={open}
      onOpenChange={onOpenChange}
      title={teacher.name}
      accessibleTitle={`Chi tiết giáo viên ${teacher.name}`}
      description={teacher.branch}
      status={teacher.status}
      statusLabel={TEACHER_STATUS_LABELS[teacher.status] ?? teacher.status}
      code={teacher.code}
    >
      <Tabs defaultValue="overview" className="flex h-full min-h-0 flex-col">
        <DetailDialogTabsList tabs={TEACHER_TABS} />

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 lg:px-3">
          <TabsContent value="overview" className="m-0 p-0">
            <TeacherOverviewTab teacher={teacher} />
          </TabsContent>
          <TabsContent value="classes" className="m-0 p-0">
            <TeacherClassesTab teacherId={teacher.id} />
          </TabsContent>
          <TabsContent value="schedule" className="m-0 p-0">
            <TeacherScheduleTab teacherId={teacher.id} />
          </TabsContent>
          <TabsContent value="sub_history" className="m-0 p-0">
            <TeacherSubHistoryTab teacherId={teacher.id} />
          </TabsContent>
          <TabsContent value="quality" className="m-0 p-0">
            <TeacherQualityTab teacherId={teacher.id} />
          </TabsContent>
          <TabsContent value="stats" className="m-0 p-0">
            <TeacherStatsTab teacherId={teacher.id} />
          </TabsContent>
          <TabsContent value="notes" className="m-0 p-0">
            <TeacherNotesTab teacherId={teacher.id} />
          </TabsContent>
          <TabsContent value="activity_log" className="m-0 p-0">
            <TeacherActivityLogTab teacherId={teacher.id} />
          </TabsContent>
        </div>
      </Tabs>
    </DetailDialogFrame>
  )
}
