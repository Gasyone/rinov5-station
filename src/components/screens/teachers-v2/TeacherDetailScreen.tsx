'use client'

import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader, BackButton, ModuleLoadingSkeleton, EmptyState } from '@/components/shared'
import { type TeacherRecord } from '@/mocks/teacherRecords'
import { TEACHER_TABS } from './teacherDetailTypes'
import { TeacherOverviewTab } from './TeacherOverviewTab'
import { TeacherClassesTab } from './TeacherClassesTab'
import { TeacherScheduleTab } from './TeacherScheduleTab'
import { TeacherSubHistoryTab } from './TeacherSubHistoryTab'
import { TeacherQualityTab } from './TeacherQualityTab'
import { TeacherStatsTab } from './TeacherStatsTab'
import { TeacherNotesTab } from './TeacherNotesTab'
import { TeacherActivityLogTab } from './TeacherActivityLogTab'

interface TeacherDetailScreenProps {
  teacher: TeacherRecord | null
  isLoading?: boolean
}

export function TeacherDetailScreen({ teacher, isLoading = false }: TeacherDetailScreenProps) {
  const router = useRouter()

  if (isLoading) {
    return <ModuleLoadingSkeleton />
  }

  if (!teacher) {
    return (
      <div className="px-4 py-3 lg:px-6">
        <EmptyState title="Không tìm thấy giáo viên" description="Giáo viên này không tồn tại hoặc đã bị xóa." />
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="flex shrink-0 flex-col border-b bg-background px-4 py-3 lg:px-6">
        <div className="flex items-center gap-2">
          <BackButton onClick={() => router.push('/app/teachers')} />
          <PageHeader
            title={teacher.name}
            status={teacher.status}
            statusLabel={getStatusLabel(teacher.status)}
            code={teacher.code}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <Tabs defaultValue="overview" className="flex h-full min-h-0 flex-col">
          <div className="border-b px-4 lg:px-6">
            <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0">
              {TEACHER_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 lg:px-6">
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
      </div>
    </div>
  )
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Đang giảng dạy',
    on_leave: 'Đang nghỉ',
    probation: 'Thử việc',
    resigned: 'Đã nghỉ việc',
  }
  return labels[status] || status
}
