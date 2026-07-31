'use client'

import { useState, useMemo } from 'react'
import { Package, MessageSquare, History, SendHorizontal, HeartHandshake } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StudentDetailPackageInfoTab } from './StudentDetailPackageInfoTab'
import type { StudentPackage, StudentNote, StudentGlobalLog } from './studentDetailTypes'
import type { EnrolledClass, Student } from '@/mocks/students'

import { AppAvatar } from '@/components/shared'
import { StudentCareChatFeed } from '@/components/screens/care/StudentCareChatFeed'
import { mockCareAlerts, getFamilyContacts, type StudentCareAlert } from '@/mocks/careAlerts'
import { getCareTopicsForStudent, getSimulatedLogs } from '@/components/screens/care/studentCareDetailHelpers'

interface StudentDetailV2SidePanelProps {
  packagesList: StudentPackage[]
  selectedPackageId: string
  setSelectedPackageId: (id: string) => void
  student: Student
  activeClass: EnrolledClass | null
  onEditLevel: () => void
  onEditSessions: () => void
  notes: StudentNote[]
  sideLogs: StudentGlobalLog[]
  noteInput: string
  onNoteInputChange: (val: string) => void
  onAddNote: () => void
}

export function StudentDetailV2SidePanel({
  packagesList,
  selectedPackageId,
  setSelectedPackageId,
  student,
  activeClass,
  onEditLevel,
  onEditSessions,
  notes,
  sideLogs,
  noteInput,
  onNoteInputChange,
  onAddNote,
}: StudentDetailV2SidePanelProps) {
  const [activeSideTab, setActiveSideTab] = useState<'package' | 'notes' | 'logs'>('package')

  const careStudentAlert: StudentCareAlert = useMemo(() => {
    const cleanId = student.id.replace('s', '')
    const found = mockCareAlerts.find((a) => a.studentId === student.id || a.id === cleanId || a.studentId === cleanId)
    if (found) return found

    return {
      id: student.id,
      studentId: student.id,
      customerCode: `KH-${student.id.toUpperCase()}`,
      studentName: student.name,
      startDate: '2026-05-01',
      subject: 'Tiếng Anh' as const,
      status: 'Đang học' as const,
      level: student.level || 'IELTS',
      subLevel: student.subLevel || '5.0-5.5',
      classCode: activeClass?.classCode || 'CLS-IELTS-001',
      teacherCode: activeClass?.teacherName || 'Cô Lan',
      schedule: 'T2/4/6 18:00–19:30',
      totalSessions: 24,
      remainingSessions: 18,
      expectedEndDate: '2026-08-30',
      attendanceRatio: '12/12',
      homeworkCompletion: 95,
      lastTestScore: 8.5,
      priorTestScore: 8.0,
      careAlert: 'ĐK1: Nhắc phí tái phí đợt 1',
      studentFolderLink: '#',
      learningResultsLink: '#',
      realtimeStatus: 'Đang học' as const,
      csStaff: 'Lê Thị Lan',
      confirmC90B: 'ĐANG XỬ LÝ' as const,
      callConfirmation: 'Đã gọi' as const,
      interactionNotes: 'Phụ huynh quan tâm tiến độ học tập của học viên.',
      interactionLogs: [
        {
          id: 'log-1',
          date: '2026-07-20 14:00',
          staffName: 'CS Lê Thị Lan',
          callConfirmation: 'Đã gọi',
          notes: '[ĐB1] Trao đổi về tình hình học tập và điểm thi vừa qua.'
        }
      ]
    }
  }, [student, activeClass])

  const contacts = useMemo(() => getFamilyContacts(careStudentAlert.studentId, careStudentAlert.studentName), [careStudentAlert])
  const primaryContact = useMemo(() => contacts.find((c) => c.isPrimary) || contacts[0], [contacts])
  const topicsList = useMemo(() => getCareTopicsForStudent(careStudentAlert), [careStudentAlert])
  const allLogs = useMemo(() => getSimulatedLogs(careStudentAlert, topicsList), [careStudentAlert, topicsList])

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <Tabs
        value={activeSideTab}
        onValueChange={(v) => setActiveSideTab(v as 'package' | 'notes' | 'logs')}
        className="flex min-h-0 flex-1 flex-col"
      >
        {/* Single Top Tab Bar Header */}
        <TabsList variant="line" className="shrink-0 justify-start border-none p-0 gap-3 h-9 w-full border-b border-border/40 mb-3">
          <TabsTrigger
            value="package"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary font-bold text-xs flex items-center gap-1.5 focus:outline-none shadow-none pb-2"
          >
            <Package className="h-3.5 w-3.5" /> Thông tin gói
          </TabsTrigger>
          {/* Tab Chăm sóc (tạm thời ẩn theo yêu cầu) */}
          {/* <TabsTrigger
            value="notes"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary font-bold text-xs flex items-center gap-1.5 focus:outline-none shadow-none pb-2"
          >
            <HeartHandshake className="h-3.5 w-3.5 text-rose-500" /> Chăm sóc ({allLogs.length || notes.length})
          </TabsTrigger> */}
          <TabsTrigger
            value="logs"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary font-bold text-xs flex items-center gap-1.5 focus:outline-none shadow-none pb-2"
          >
            <History className="h-3.5 w-3.5" /> Nhật ký ({sideLogs.length})
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {/* Tab 1: Thông tin gói */}
          <TabsContent value="package" className="m-0 focus-visible:outline-none h-full">
            <StudentDetailPackageInfoTab
              packagesList={packagesList}
              selectedPackageId={selectedPackageId}
              setSelectedPackageId={setSelectedPackageId}
              student={student}
              activeClass={activeClass}
              onEditLevel={onEditLevel}
              onEditSessions={onEditSessions}
            />
          </TabsContent>

          {/* Tab Chăm sóc học viên (Tạm thời ẩn) */}
          {/* <TabsContent value="notes" className="m-0 focus-visible:outline-none flex flex-col h-full overflow-hidden">
            <StudentCareChatFeed
              key={careStudentAlert.studentId}
              student={careStudentAlert}
              contacts={contacts}
              formattedPhone={student.parentPhone || '0941 711 122'}
              primaryContact={primaryContact}
              topicsList={topicsList}
              allLogs={allLogs}
            />
          </TabsContent> */}

          {/* Tab 3: Nhật ký */}
          <TabsContent value="logs" className="m-0 focus-visible:outline-none flex flex-col h-full">
            <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1 pt-1">
              {sideLogs.length === 0 ? (
                <p className="pt-2 text-xs text-muted-foreground italic">Chưa có nhật ký hoạt động.</p>
              ) : (
                sideLogs.map((log) => (
                  <div key={log.id} className="rounded-xl border border-border/60 bg-card p-3 space-y-1 shadow-2xs text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AppAvatar
                          name={log.operator}
                          size="xs"
                          className="h-6 w-6 border border-primary/10"
                        />
                        <span className="font-bold text-foreground">{log.operator}</span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">{log.timestamp}</span>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed pl-8">{log.action}</p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
