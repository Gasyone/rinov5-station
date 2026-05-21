'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, GraduationCap, Calendar, Replace } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Panel, InfoField, BackButton, StatusBadge } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type { Class } from '@/mocks/classes'

// Import tabs
import { ClassDetailStudentsTab } from './ClassDetailStudentsTab'
import { ClassDetailSessionsTab } from './ClassDetailSessionsTab'

interface ClassDetailViewProps {
  cls: Class
  onBack: () => void
}

export function ClassDetailView({ cls, onBack }: ClassDetailViewProps) {
  const [activeTab, setActiveTab] = useState('students')

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="border-b px-4 py-3 lg:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BackButton onClick={onBack} />
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              {cls.name}
              <span className="text-sm font-mono text-muted-foreground font-normal">({cls.id})</span>
            </h1>
            <p className="text-xs text-muted-foreground">Chi nhánh: {cls.branch}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={cls.status} label={cls.status === 'active' ? 'Đang hoạt động' : cls.status === 'upcoming' ? 'Chưa bắt đầu' : 'Đã kết thúc'} />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 align-top">
          {/* Left Column: Metadata & Quick actions */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold text-sm mb-3">Thông tin lớp học</h3>
              <div className="space-y-3">
                <InfoField label="Trình độ / Level" value={cls.level} />
                <InfoField label="Giáo viên chủ nhiệm" value={cls.teacher} />
                <InfoField label="Lịch học" value={cls.schedule} />
                <InfoField label="Phòng học" value={cls.room || 'Phòng 102'} />
                <InfoField label="Sức chứa" value={`${cls.enrolledStudents} / ${cls.maxStudents} Học viên`} />
                <InfoField label="Ngày khai giảng" value={cls.startDate} />
                <InfoField label="Ngày kết thúc" value={cls.endDate} />
              </div>
            </Card>

            <Card className="p-4 space-y-2">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1">Thao tác lớp học</h3>
              <Button className="w-full justify-start text-xs h-9" variant="outline">
                <Calendar className="mr-2 h-4 w-4" /> Dời lịch cả lớp
              </Button>
              <Button className="w-full justify-start text-xs h-9" variant="outline">
                <Replace className="mr-2 h-4 w-4" /> Đổi giáo viên thay thế
              </Button>
            </Card>
          </div>

          {/* Right Column: Tab Panel */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="bg-muted/50 p-1 flex overflow-x-auto whitespace-nowrap scrollbar-none w-full justify-start">
                <TabsTrigger value="students">Học viên ({cls.enrolledStudents})</TabsTrigger>
                <TabsTrigger value="sessions">Tiến độ & Buổi học</TabsTrigger>
                <TabsTrigger value="teacher">Thông tin Giáo viên</TabsTrigger>
              </TabsList>

              <TabsContent value="students" className="mt-0">
                <ClassDetailStudentsTab classNameFilter={cls.name} />
              </TabsContent>
              <TabsContent value="sessions" className="mt-0">
                <ClassDetailSessionsTab classNameFilter={cls.name} />
              </TabsContent>
              <TabsContent value="teacher" className="mt-0">
                <Panel title="Giáo viên chủ nhiệm">
                  <div className="grid grid-cols-2 gap-4">
                    <InfoField label="Họ và tên" value={cls.teacher} />
                    <InfoField label="Email" value={`${cls.teacher.toLowerCase().replace(/ /g, '.')}@rinoedu.com`} />
                    <InfoField label="Số điện thoại" value="+84 912 345 678" />
                    <InfoField label="Chuyên môn" value="IELTS Academic 7.5+" />
                  </div>
                </Panel>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
