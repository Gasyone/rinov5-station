'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
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
import { cn } from '@/lib/utils'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { type StudentCareAlert, getFamilyContacts } from '@/mocks/careAlerts'
import { stableHash } from './operationsAlertHelpers'
import { AppAvatar } from '@/components/shared'
import { StudentCareChatFeed } from './StudentCareChatFeed'
import { StudentCareReportTab } from './StudentCareReportTab'
import { StudentDetailDialog } from '../students/detail/StudentDetailDialog'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { StudentCareHeaderClusterInfo, StudentCareHeaderClusterNote } from './StudentCareHeaderCluster'
import {
  getCareTopicsForStudent,
  getSimulatedLogs,
  getSimulatedPackagesList,
} from './studentCareDetailHelpers'
import { defaultCSStaffList } from './studentCareDetailTypes'


interface StudentCareDetailDialogV2Props {
  studentId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  alerts: StudentCareAlert[]
  onRefresh?: () => void
  version: number
  onChangeVersion?: (version: 1 | 2) => void
}

export function StudentCareDetailDialogV2({
  studentId,
  open,
  onOpenChange,
  alerts,
  onRefresh,
}: StudentCareDetailDialogV2Props) {
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
  const [prevStudentId, setPrevStudentId] = useState<string | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Sync when student changes
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

  // Get contacts
  const contacts = useMemo(() => {
    if (!student) return []
    return getFamilyContacts(student.studentId, student.studentName)
  }, [student])
  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0]



  // Get dynamic care topics list
  const topicsList = useMemo(() => {
    if (!student) return []
    return getCareTopicsForStudent(student)
  }, [student])



  // Get merged simulated/realistic logs
  const allLogs = useMemo(() => {
    if (!student) return []
    return getSimulatedLogs(student, topicsList)
  }, [student, topicsList])

  const birthYear = useMemo(() => {
    if (!student) return ''
    const baseYear = 2018 - (stableHash(student.studentId) % 4)
    return `25/08/${baseYear}`
  }, [student])

  const address = useMemo(() => {
    if (!student) return ''
    const districts = ["Thanh Xuân", "Cầu Giấy", "Đống Đa", "Hai Bà Trưng", "Nam Từ Liêm"]
    const district = districts[stableHash(student.studentId) % districts.length]
    return `Số ${10 + (stableHash(student.studentId) % 90)} Nguyễn Tuân, ${district}, Hà Nội`
  }, [student])

  const [prevContacts, setPrevContacts] = useState(contacts)
  const [contactsList, setContactsList] = useState(contacts)

  // Student personality/attitude note
  const [studentNote, setStudentNote] = useState('')
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

  if (prevContacts !== contacts) {
    setPrevContacts(contacts)
    setContactsList(contacts)
  }

  if (!student) return null

  const studentAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${student.studentName}`
  const formattedPhone = primaryContact?.phone || '0901234567'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-[1380px] w-full h-[90vh] max-h-[900px] p-4 flex flex-col overflow-hidden bg-background text-foreground border border-border shadow-2xl rounded-2xl">
        
        <div className="grid flex-1 grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 min-h-0 overflow-hidden">
          
          {/* Column Left (50%): Profile Info Header & Report Tab */}
          <main className="flex min-h-0 flex-col overflow-y-auto bg-background pr-1.5 scrollbar-thin">
            
            {/* Unified Personal Information Cluster Card */}
            <div className="shrink-0 bg-card dark:bg-zinc-900 border border-border/80 rounded-2xl p-4 shadow-sm space-y-3.5 select-none text-left mb-3">
              {/* Header Row: Enlarged Avatar, Name, Status */}
              <div className="flex items-start gap-3">
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
                        size="xl"
                        className="border-2 border-background shadow-md shrink-0 h-16 w-16 text-xl pointer-events-none"
                      />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-4 rounded-xl shadow-md border bg-popover text-popover-foreground z-50 text-left" align="start">
                    <div className="space-y-3.5 text-xs text-left">
                      <div className="flex items-center gap-2.5 border-b border-border pb-2.5">
                        <AppAvatar src={studentAvatar} size="sm" className="h-9 w-9 border border-primary/10" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-sm text-foreground truncate">{student.studentName}</h4>
                            <Badge className={cn('text-xs font-bold py-0.5 px-1.5 rounded-full shadow-none border-none uppercase leading-none h-4', getStatusBadgeClass(student.status))}>
                              {student.status}
                            </Badge>
                          </div>
                          <p className="font-mono text-[9.5px] text-muted-foreground mt-0.5">{student.studentId}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-1.5">
                          <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Lớp học:</span>
                          <span className="font-semibold text-foreground truncate">{student.classCode}</span>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">LIÊN HỆ GIA ĐÌNH</p>
                          {contactsList.map((contact, idx) => (
                            <div key={idx} className="flex justify-between items-center gap-2 py-0.5">
                              <span className="font-medium text-foreground">{contact.name} ({contact.relationship})</span>
                              <span className="font-mono text-muted-foreground font-semibold">{contact.phone}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-[9.5px] text-primary font-bold text-center border-t border-border/40 pt-2 cursor-pointer hover:underline select-none">
                        Nhấp vào avatar để xem chi tiết đầy đủ
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                
                <div className="min-w-0 space-y-1 flex-1">
                  <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2 flex-wrap leading-tight">
                    <span>{student.studentName} {student.englishName ? `(${student.englishName})` : ''}</span>
                    <Badge className={cn('text-xs font-semibold py-0.5 px-2 rounded-full shadow-none border-none', getStatusBadgeClass(student.status))}>
                      {student.status}
                    </Badge>
                  </DialogTitle>

                  <StudentCareHeaderClusterInfo
                    birthYear={birthYear}
                    address={address}
                    contactsList={contactsList}
                    setContactsList={setContactsList}
                    isParentsExpanded={isParentsExpanded}
                    setIsParentsExpanded={setIsParentsExpanded}
                  />
                </div>
              </div>

              {/* Student Note Row: Full Width underneath Avatar, sát cạnh trái, luôn 2 dòng text */}
              <StudentCareHeaderClusterNote
                studentNote={studentNote}
                setStudentNote={setStudentNote}
                isEditingStudentNote={isEditingStudentNote}
                setIsEditingStudentNote={setIsEditingStudentNote}
                editingStudentNoteText={editingStudentNoteText}
                setEditingStudentNoteText={setEditingStudentNoteText}
              />
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
  </Dialog>
  )
}


