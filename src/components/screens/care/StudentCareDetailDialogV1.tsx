'use client'

import { useMemo, useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  X,
  Info,
  Copy,
  Clock,
  UserPlus,
  Check,
  Pencil,
  Search,
  ChevronDown,
  ChevronUp,
  History,
  Eye,
} from 'lucide-react'
import { toast } from 'sonner'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'
import { StudentCareHeaderCluster } from './StudentCareHeaderCluster'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { type StudentCareAlert, getFamilyContacts } from '@/mocks/careAlerts'
import { stableHash } from './operationsAlertHelpers'
import { AppAvatar } from '@/components/shared'
import { StudentCareChatFeed } from './StudentCareChatFeed'
import { StudentCareReportTab } from './StudentCareReportTab'
import { StudentDetailDialog } from '../students/detail/StudentDetailDialog'
import {
  getCareTopicsForStudent,
  getSimulatedLogs,
  getSimulatedPackagesList,
} from './studentCareDetailHelpers'
import { defaultCSStaffList } from './studentCareDetailTypes'

export interface StudentCareDetailDialogV1Props {
  studentId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  alerts: StudentCareAlert[]
  onRefresh?: () => void
  version: number
  onChangeVersion: (version: 1 | 2) => void
}

export function StudentCareDetailDialogV1({
  studentId,
  open,
  onOpenChange,
  alerts,
  onRefresh,
  version,
  onChangeVersion,
}: StudentCareDetailDialogV1Props) {
  const [csSearchQuery, setCsSearchQuery] = useState('')

  const [localStudentId, setLocalStudentId] = useState<string | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalStudentId(studentId)
  }, [studentId])

  // Find student in care alerts
  const student = useMemo(() => {
    if (!localStudentId) return null
    return alerts.find((a) => a.id === localStudentId || a.studentId === localStudentId) || null
  }, [localStudentId, alerts])

  // Đồng bộ Phụ trách CS với cột ngoài danh sách
  const [assignedCS, setAssignedCS] = useState(student?.csStaff || 'Trần Thảo Anh 20')
  const [prevStudentIdForCS, setPrevStudentIdForCS] = useState<string | null>(student?.studentId || null)

  if (student && student.studentId !== prevStudentIdForCS) {
    setPrevStudentIdForCS(student.studentId)
    setAssignedCS(student.csStaff || 'Trần Thảo Anh 20')
  }

  const handleAssignedCSChange = (newCS: string) => {
    setAssignedCS(newCS)
    const foundAlert = alerts.find((a) => a.id === localStudentId || a.studentId === localStudentId)
    if (foundAlert) {
      foundAlert.csStaff = newCS
    }
    onRefresh?.()
  }

  const csStaffList = useMemo(() => defaultCSStaffList, [])

  const filteredCsList = useMemo(() => {
    if (!csSearchQuery.trim()) return csStaffList
    const q = csSearchQuery.toLowerCase()
    return csStaffList.filter((item) =>
      item.name.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)
    )
  }, [csSearchQuery, csStaffList])

  const currentCSObj = useMemo(() => {
    return csStaffList.find((c) => c.name.toLowerCase() === assignedCS.toLowerCase()) || csStaffList[0]
  }, [assignedCS, csStaffList])

  // Get packages list dynamically
  const packagesList = useMemo(() => {
    if (!student) return []
    return getSimulatedPackagesList(student)
  }, [student])

  const [selectedPackageId, setSelectedPackageId] = useState<string>('pkg-1')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isParentsModalOpen, setIsParentsModalOpen] = useState(false)
  const [selectedContactPhone, setSelectedContactPhone] = useState<string | null>(null)
  const [prevStudentId, setPrevStudentId] = useState<string | null>(null)

  // Sync selected package, notes and sideLogs when student changes
  if (student && student.studentId !== prevStudentId) {
    setPrevStudentId(student.studentId)
    const pkgs = getSimulatedPackagesList(student)
    if (pkgs.length > 0) {
      setSelectedPackageId(pkgs[0].id)
    }
  }

  const activePackage = useMemo(() => {
    return packagesList.find((p) => p.id === selectedPackageId) || packagesList[0] || null
  }, [packagesList, selectedPackageId])

  const contacts = useMemo(() => {
    if (!student) return []
    return getFamilyContacts(student.studentId, student.studentName)
  }, [student])

  const [contactsList, setContactsList] = useState(contacts)
  const [studentNote, setStudentNote] = useState('Học viên tích cực, thích hoạt động nhóm, cần động viên nhiều hơn khi làm bài tập cá nhân.')
  const [isEditingStudentNote, setIsEditingStudentNote] = useState(false)
  const [editingStudentNoteText, setEditingStudentNoteText] = useState('')
  const [isParentsExpanded, setIsParentsExpanded] = useState(false)
  const [isStudentNoteExpanded, setIsStudentNoteExpanded] = useState(false)

  // Parent note inline edit state
  const [isEditingParentNote, setIsEditingParentNote] = useState(false)
  const [editingParentNoteText, setEditingParentNoteText] = useState('')
  const [editingContactIdx, setEditingContactIdx] = useState<number | null>(null)
  const [editingContactNoteText, setEditingContactNoteText] = useState('')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContactsList(contacts)
  }, [contacts])

  useEffect(() => {
    if (student) {
      if (student.studentNote !== undefined) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStudentNote(student.studentNote)
      } else {
        const hash = stableHash(student.studentId)
        const mockNotes = [
          'Học viên tích cực, thích hoạt động nhóm, cần động viên nhiều hơn khi làm bài tập cá nhân.',
          '',
          'Con tiếp thu nhanh các bài học logic, hay đặt câu hỏi phản biện trên lớp.',
          '',
          'Thường xuyên giơ tay phát biểu, có năng khiếu tự học tốt.',
        ]
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStudentNote(mockNotes[hash % mockNotes.length])
      }
    }
  }, [student])

  const primaryContact = useMemo(() => {
    return contactsList.find((c) => c.isPrimary) || contactsList[0]
  }, [contactsList])

  const formattedPhone = useMemo(() => {
    if (!primaryContact?.phone) return ''
    const p = primaryContact.phone.replace(/\s+/g, '')
    if (p.length === 10) {
      return `${p.slice(0, 4)} ${p.slice(4, 7)} ${p.slice(7)}`
    }
    return primaryContact.phone
  }, [primaryContact])





  const topicsList = useMemo(() => {
    if (!student) return []
    return getCareTopicsForStudent(student)
  }, [student])

  const allLogs = useMemo(() => {
    if (!student) return []
    return getSimulatedLogs(student, topicsList)
  }, [student, topicsList])

  const staffInfo = useMemo(() => {
    if (!student) {
      return {
        cs: { id: 'cs1', name: 'Trần Thảo Anh 20', role: 'Chuyên viên CSKH', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ThaoAnh' },
        teachers: [],
      }
    }

    const rawTeacherCodes = [
      ...new Set([
        ...(student.teacherCode ? student.teacherCode.split(/[,;\s/]+/).map((t) => t.trim()) : []),
        ...(student.substituteTeacher ? student.substituteTeacher.split(/[,;\s/]+/).map((t) => t.trim()) : []),
      ]),
    ].filter((t) => t && t !== '-')

    const teachers = rawTeacherCodes.map((code, idx) => ({
      id: `teacher-${idx}-${code}`,
      name: code,
      role: code.toLowerCase().includes('sub') ? 'Trợ giảng (TA)' : 'Giáo viên Chủ nhiệm',
      phone: '0912 345 678',
      email: `${code.toLowerCase().replace(/[^a-z0-9]/g, '')}@rinoedu.vn`,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(code)}`,
    }))

    const csName = assignedCS || student.csStaff || 'Trần Thảo Anh 20'

    return {
      cs: {
        id: `cs-${csName.replace(/\s+/g, '-').toLowerCase()}`,
        name: csName,
        role: 'Chuyên viên CSKH',
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(csName)}`,
      },
      teachers,
    }
  }, [student, assignedCS])

  if (!open || !student) return null

  const studentAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${student.studentName}`
  const birthYear = '25/08/2017'
  const address = 'Số 49 Nguyễn Tuân, Nam Từ Liêm, Hà Nội'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-[1380px] w-full h-[90vh] max-h-[900px] p-4 flex flex-col overflow-hidden bg-background text-foreground border border-border shadow-2xl rounded-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Chi tiết học viên - {student.studentName}</DialogTitle>
        </DialogHeader>

        <div className="grid flex-1 grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 min-h-0 overflow-hidden">
          
          {/* Left Column: Profile Info Header & Report Tab */}
          <main className="flex min-h-0 flex-col overflow-y-auto text-left bg-background pr-1.5 scrollbar-thin">
            
            {/* Unified Personal Information Cluster Card */}
            <div className="shrink-0 bg-card dark:bg-zinc-900 border border-border/80 rounded-2xl p-4 shadow-sm space-y-3.5 select-none text-left mb-3">
              {/* Header Row: Enlarged Avatar, Name, Status */}
              <div className="flex items-center gap-3.5">
                <HoverCard openDelay={150} closeDelay={150}>
                  <HoverCardTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setIsProfileOpen(true)}
                      className="cursor-pointer hover:scale-105 hover:opacity-90 active:scale-95 transition-all shrink-0 rounded-full focus:outline-none"
                    >
                      <AppAvatar
                        src={studentAvatar}
                        name={student.studentName}
                        size="2xl"
                        className="border-2 border-background shadow-md shrink-0 h-24 w-24 text-2xl pointer-events-none"
                      />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent align="start" className="w-72 p-3 text-xs z-50 shadow-md border bg-popover text-popover-foreground">
                    <div className="flex items-start gap-3">
                      <AppAvatar src={studentAvatar} name={student.studentName} size="md" className="shrink-0 h-10 w-10" />
                      <div className="space-y-1 min-w-0">
                        <p className="font-bold text-sm leading-tight text-foreground truncate">{student.studentName}</p>
                        <p className="text-xs font-mono text-muted-foreground">{student.studentId.toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">Lớp: <span className="font-semibold text-foreground">{student.classCode}</span></p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <div className="min-w-0 flex-1 space-y-1 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsProfileOpen(true)}
                      className="font-extrabold text-xl sm:text-2xl text-foreground hover:text-sky-600 dark:hover:text-sky-400 transition-colors truncate text-left cursor-pointer"
                    >
                      {student.studentName}
                    </button>
                    <span className={cn('px-2.5 py-0.5 text-xs font-extrabold rounded-full border shadow-2xs leading-none shrink-0', getStatusBadgeClass(student.status))}>
                      {(student.status as string) === 'active' || student.status === 'Đang học' ? 'Đang học' : student.status}
                    </span>
                  </div>

                  <StudentCareHeaderCluster
                    birthYear={birthYear}
                    address={address}
                    contactsList={contactsList}
                    setContactsList={setContactsList}
                    studentNote={studentNote}
                    setStudentNote={setStudentNote}
                    isEditingStudentNote={isEditingStudentNote}
                    setIsEditingStudentNote={setIsEditingStudentNote}
                    editingStudentNoteText={editingStudentNoteText}
                    setEditingStudentNoteText={setEditingStudentNoteText}
                    isParentsExpanded={isParentsExpanded}
                    setIsParentsExpanded={setIsParentsExpanded}
                    isStudentNoteExpanded={isStudentNoteExpanded}
                    setIsStudentNoteExpanded={setIsStudentNoteExpanded}
                  />
                </div>
              </div>
            </div>

            <div className="w-full pt-1 flex flex-col">
              <StudentCareReportTab
                studentId={student.studentId}
                studentName={student.studentName}
                activePackage={activePackage}
                packagesList={packagesList}
                selectedPackageId={selectedPackageId}
                setSelectedPackageId={setSelectedPackageId}
                staffInfo={staffInfo}
                assignedCS={assignedCS}
                onAssignedCSChange={handleAssignedCSChange}
                branchName="RinoEdu Nguyễn Tuân"
              />
            </div>
          </main>

          {/* Column Right (50%): Interaction Timeline Feed */}
          <aside className="flex min-h-0 flex-col text-left lg:pl-3 pr-1">
            <StudentCareChatFeed
              key={student.studentId}
              student={student}
              contacts={contacts}
              formattedPhone={formattedPhone}
              primaryContact={primaryContact}
              onRefresh={onRefresh}
              topicsList={topicsList}
              allLogs={allLogs}
              selectedPackageId={selectedPackageId}
              selectedPackage={activePackage}
            />
          </aside>

        </div>
      </DialogContent>

      <StudentDetailDialog
        studentId={student.studentId}
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />

      {/* Modal: Danh sách phụ huynh liên hệ */}
      <Dialog open={isParentsModalOpen} onOpenChange={setIsParentsModalOpen}>
        <DialogContent className="max-w-md p-4 bg-background rounded-xl border border-border">
          <DialogHeader className="border-b border-border pb-2 text-left">
            <DialogTitle className="text-sm font-bold text-foreground">
              Danh sách phụ huynh liên hệ
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-3 overflow-y-auto max-h-[400px] scrollbar-thin pr-0.5">
            {contacts.map((contact, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-muted/30 dark:bg-muted/10 border border-border/60 rounded-xl text-left text-xs"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-foreground text-xs leading-none">{contact.name}</p>
                    <Badge variant="outline" className="text-xs font-bold py-0.5 px-1 border-primary/20 text-primary uppercase select-none leading-none">
                      {contact.relationship}
                    </Badge>
                    {contact.isPrimary && (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10 font-bold px-1 py-px text-[7.5px] rounded border-none shadow-none leading-none select-none">
                        Chính
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs font-mono text-foreground font-semibold">{contact.phone}</p>
                  {contact.note && (
                    <p className="text-xs text-muted-foreground leading-normal italic bg-background/50 p-1.5 rounded-lg border border-border/40">
                      Ghi chú: {contact.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
