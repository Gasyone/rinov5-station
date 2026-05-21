'use client'

import { useState } from 'react'
import { ArrowLeft, UserCheck, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader, BackButton, StatusBadge } from '@/components/shared'
import { mockStudents } from '@/mocks/students'
import { STUDENT_STATUS_LABELS } from './studentTypes'

// Import tabs
import { StudentDetailOverviewTab } from './StudentDetailOverviewTab'
import { StudentDetailClassesTab } from './StudentDetailClassesTab'
import { StudentDetailAcademicTab } from './StudentDetailAcademicTab'
import { StudentDetailOrdersTab } from './StudentDetailOrdersTab'
import { StudentDetailTicketsTab } from './StudentDetailTicketsTab'

interface StudentDetailViewProps {
  studentId: string
  onBack: () => void
}

export function StudentDetailView({ studentId, onBack }: StudentDetailViewProps) {
  const student = mockStudents.find((s) => s.id === studentId)
  const [activeTab, setActiveTab] = useState('overview')

  if (!student) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Không tìm thấy thông tin học viên.</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
        </Button>
      </div>
    )
  }

  const studentCode = `STU-00${student.id.replace('s', '')}`

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="border-b px-4 py-3 lg:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BackButton onClick={onBack} />
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              {student.name}
              <span className="text-sm font-mono text-muted-foreground font-normal">({studentCode})</span>
            </h1>
            <p className="text-xs text-muted-foreground">Chi nhánh: {student.branch}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={student.status} label={STUDENT_STATUS_LABELS[student.status] ?? student.status} />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 align-top">
          {/* Sidebar Info Card */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-4 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mb-3 border">
                {student.name.split(' ').pop()?.[0]}
              </div>
              <h2 className="font-semibold text-lg">{student.name}</h2>
              <span className="text-xs font-mono text-muted-foreground mb-3">{studentCode}</span>
              <div className="w-full border-t pt-3 text-left space-y-2">
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>Trình độ:</span>
                  <span className="font-semibold text-foreground">{student.level}</span>
                </div>
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>Lớp học:</span>
                  <span className="font-semibold text-foreground">{student.enrolledClass || 'Chưa xếp lớp'}</span>
                </div>
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>SĐT Phụ huynh:</span>
                  <span className="text-foreground">{student.parentPhone || '-'}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 space-y-2">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1">Hành động nhanh</h3>
              <Button className="w-full justify-start text-xs h-9" variant="outline">
                <UserCheck className="mr-2 h-4 w-4" /> Điểm danh bù
              </Button>
              <Button className="w-full justify-start text-xs h-9 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950" variant="outline">
                <ShieldAlert className="mr-2 h-4 w-4" /> Báo cáo đặc biệt
              </Button>
            </Card>
          </div>

          {/* Main Tabs Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="bg-muted/50 p-1 flex overflow-x-auto whitespace-nowrap scrollbar-none w-full justify-start">
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="classes">Lớp & Lịch học</TabsTrigger>
                <TabsTrigger value="academic">Học tập & Điểm danh</TabsTrigger>
                <TabsTrigger value="orders">Đăng ký & Đơn hàng</TabsTrigger>
                <TabsTrigger value="tickets">Chăm sóc & Tickets</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <StudentDetailOverviewTab student={student} />
              </TabsContent>
              <TabsContent value="classes" className="mt-0">
                <StudentDetailClassesTab student={student} />
              </TabsContent>
              <TabsContent value="academic" className="mt-0">
                <StudentDetailAcademicTab />
              </TabsContent>
              <TabsContent value="orders" className="mt-0">
                <StudentDetailOrdersTab />
              </TabsContent>
              <TabsContent value="tickets" className="mt-0">
                <StudentDetailTicketsTab studentId={student.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
