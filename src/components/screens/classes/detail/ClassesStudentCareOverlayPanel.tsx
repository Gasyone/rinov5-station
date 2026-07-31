'use client'

import { useState, useMemo } from 'react'
import { X, ExternalLink, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { RosterStudent } from './classesDetailTypes'
import { toast } from 'sonner'
import { StudentCareChatFeed } from '@/components/screens/care/StudentCareChatFeed'
import { StudentCareDetailDialog } from '@/components/screens/care/StudentCareDetailDialog'
import { mockCareAlerts, getFamilyContacts, type StudentCareAlert } from '@/mocks/careAlerts'
import { getCareTopicsForStudent, getSimulatedLogs } from '@/components/screens/care/studentCareDetailHelpers'

interface ClassesStudentCareOverlayPanelProps {
  student: RosterStudent
  onClose: () => void
}

export function ClassesStudentCareOverlayPanel({
  student,
  onClose,
}: ClassesStudentCareOverlayPanelProps) {
  const [isCareDetailOpen, setIsCareDetailOpen] = useState(false)

  // Find or construct mock care alert for the student
  const targetAlert: StudentCareAlert = useMemo(() => {
    const found = mockCareAlerts.find(
      (a) => a.studentId === student.id || a.studentName.toLowerCase().includes(student.name.toLowerCase())
    )
    if (found) return found

    // Fallback constructed alert matching RosterStudent
    return {
      ...mockCareAlerts[0],
      id: `alert-${student.id}`,
      studentId: student.id,
      studentName: student.name,
      studentCode: student.code || 'HV-001',
      className: 'IELTS Junior 1A',
      parentName: student.parentName || 'Nguyễn Thị Mai',
      parentPhone: student.parentPhone || '090161294',
    }
  }, [student])

  const contacts = useMemo(
    () => getFamilyContacts(targetAlert.studentId, targetAlert.studentName),
    [targetAlert]
  )
  const formattedPhone = contacts[0]?.phone || '090161294'
  const primaryContact = contacts[0]
  const topicsList = useMemo(() => getCareTopicsForStudent(targetAlert), [targetAlert])
  const allLogs = useMemo(() => getSimulatedLogs(targetAlert, topicsList), [targetAlert, topicsList])

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden w-full h-full bg-background relative z-10 animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Top Header Row with Student Name, ExternalLink Icon & Close (X) button */}
      <div className="shrink-0 flex items-center justify-between border-b border-border/60 pb-2.5 pt-1 mb-2 pr-1">
        {/* Left Side: Student Care Title & External Link Icon */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-[10px] font-extrabold text-rose-600 dark:text-rose-400">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs font-bold text-muted-foreground">Chăm sóc:</span>
            <span className="text-xs md:text-sm font-extrabold text-foreground truncate">
              {student.name}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => {
                toast.info(`Đang mở chi tiết chăm sóc của học viên ${student.name}...`)
                setIsCareDetailOpen(true)
              }}
              className="h-6 w-6 rounded-md text-primary hover:bg-primary/10 transition-colors shrink-0"
              title="Mở dialog/trang chi tiết chăm sóc đầy đủ của học viên này"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Close button (X) to dismiss Care Panel and return to Class Detail Right Panel */}
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onClose}
          className="h-7 w-7 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-transform active:scale-95 shrink-0"
          title="Đóng panel chăm sóc (Quay lại thông tin lớp)"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Reused StudentCareChatFeed component from Placement / Care Management */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col pr-0.5">
        <StudentCareChatFeed
          key={targetAlert.studentId}
          student={targetAlert}
          contacts={contacts}
          formattedPhone={formattedPhone}
          primaryContact={primaryContact}
          topicsList={topicsList}
          allLogs={allLogs}
        />
      </div>

      {/* Full Student Care Detail Dialog when ExternalLink icon clicked */}
      {isCareDetailOpen && (
        <StudentCareDetailDialog
          open={isCareDetailOpen}
          onOpenChange={setIsCareDetailOpen}
          studentId={student.id}
          alerts={mockCareAlerts}
        />
      )}
    </aside>
  )
}
