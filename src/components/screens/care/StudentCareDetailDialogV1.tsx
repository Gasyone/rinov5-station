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
  ShieldAlert,
  X,
  Info,
  Copy,
  Clock,
  UserPlus,
  Check,
  Pencil,
  Search,
  GraduationCap,
  Receipt,
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
import { StudentOrdersTab, getStudentOrders } from './StudentOrdersTab'
import { StudentDetailDialog } from '../students/detail/StudentDetailDialog'
import {
  getCareTopicsForStudent,
  getSimulatedLogs,
  getSimulatedPackagesList,
} from './studentCareDetailHelpers'

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
  const [leftTab, setLeftTab] = useState<'learning' | 'orders'>('learning')
  const [closedBanners, setClosedBanners] = useState<string[]>([])
  const [assignedCS, setAssignedCS] = useState('Lê Thị Lan')
  const [csSearchQuery, setCsSearchQuery] = useState('')

  const csStaffList = useMemo(() => [
    { id: 'cs-1', name: 'Lê Thị Lan', code: 'EMP-CS-001', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Lan' },
    { id: 'cs-2', name: 'Minh Phương', code: 'EMP-CS-002', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Phuong' },
    { id: 'cs-3', name: 'Nguyễn Văn Hùng', code: 'EMP-CS-003', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Hung' },
    { id: 'cs-4', name: 'Phạm Thị Hà', code: 'EMP-CS-004', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ha' },
    { id: 'cs-5', name: 'Hoàng Anh Tuấn', code: 'EMP-CS-005', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tuan' },
    { id: 'cs-6', name: 'Đỗ Mai Hương', code: 'EMP-CS-006', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Huong' },
  ], [])

  const filteredCsList = useMemo(() => {
    if (!csSearchQuery.trim()) return csStaffList
    const q = csSearchQuery.toLowerCase()
    return csStaffList.filter((item) =>
      item.name.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)
    )
  }, [csSearchQuery, csStaffList])

  const currentCSObj = useMemo(() => {
    return csStaffList.find((c) => c.name === assignedCS) || csStaffList[0]
  }, [assignedCS, csStaffList])

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



  // Get active condition triggers that have not been closed as banners
  const activeConditions = useMemo(() => {
    if (!student) return []
    const hash = stableHash(student.studentId)
    const list: Array<{ code: string; text: string; severity: 'high' | 'medium' | 'low' }> = []
    
    if (hash % 3 === 0) {
      list.push({
        code: 'COND_LATE',
        text: 'Học viên đi muộn 2 buổi liên tiếp (Buổi 11, Buổi 12)',
        severity: 'medium',
      })
      list.push({
        code: 'COND_ATT_LOW',
        text: 'Tỷ lệ chuyên cần giảm dưới 80% (Hiện tại: 75% trong 30 ngày qua)',
        severity: 'high',
      })
    } else if (hash % 3 === 1) {
      list.push({
        code: 'COND_SCORE_LOW',
        text: 'Điểm kiểm tra định kỳ trung bình dưới 5.0 (Điểm: 4.8 môn Tiếng Anh)',
        severity: 'high',
      })
      list.push({
        code: 'COND_HW_MISSING',
        text: 'Không nộp bài tập về nhà 3 buổi liên tiếp (Buổi 15, 16, 17)',
        severity: 'medium',
      })
    } else {
      list.push({
        code: 'COND_ABSENT_UNEXCUSED',
        text: 'Nghỉ học không phép 2 buổi liên tiếp (Buổi 20, 21)',
        severity: 'high',
      })
      list.push({
        code: 'COND_SESSIONS_LOW',
        text: 'Số buổi học còn lại của gói học dưới 5 buổi (Còn lại: 3 buổi)',
        severity: 'medium',
      })
    }
    
    return list.filter((item) => !closedBanners.includes(item.code))
  }, [student, closedBanners])

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
        cs: { id: 'cs1', name: 'CSM Minh Phương', role: 'CS KH', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Phuong' },
        teachers: [
          { id: 't1', name: 'GV Nguyễn Minh Trí', role: 'GV', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tri' },
          { id: 't2', name: 'GV Bùi Văn Anh', role: 'GV Phụ', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Anh' },
        ],
      }
    }
    const hash = stableHash(student.studentId)
    const teachersList = [
      [
        { id: 't1', name: 'GV Nguyễn Minh Trí', role: 'GV', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tri' },
        { id: 't2', name: 'GV Bùi Văn Anh', role: 'GV Phụ', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Anh' },
      ],
      [
        { id: 't3', name: 'GV Đỗ Thị Xuân', role: 'GV', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Xuan' },
      ],
      [
        { id: 't4', name: 'GV Trần Văn Nam', role: 'GV', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Nam' },
        { id: 't5', name: 'GV Lê Thu Hà', role: 'GV Phụ', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ha' },
      ],
    ]
    return {
      cs: {
        id: `cs-${hash % 3}`,
        name: student.csStaff || 'CSM Minh Phương',
        role: 'CS KH',
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${student.csStaff || 'CS'}`,
      },
      teachers: teachersList[hash % teachersList.length],
    }
  }, [student])

  if (!open || !student) return null

  const studentAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${student.studentName}`
  const birthYear = '25/08/2017'
  const address = 'Số 49 Nguyễn Tuân, Nam Từ Liêm, Hà Nội'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[94vw] lg:max-w-[1260px] w-full h-[88vh] max-h-[860px] p-3.5 flex flex-col overflow-hidden bg-background text-foreground border border-border shadow-xl rounded-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Chi tiết học viên - {student.studentName}</DialogTitle>
        </DialogHeader>

        {/* Dynamic Warning Banners Section */}
        {activeConditions.length > 0 && (
          <div className="shrink-0 space-y-1.5 mb-2 select-none">
            {activeConditions.map((cond) => {
              return (
                <div
                  key={cond.code}
                  className="flex items-center justify-between gap-3 px-3 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 rounded-xl text-xs transition-all animate-in fade-in-50 duration-200"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <p className="truncate text-xs font-semibold text-foreground">
                      {cond.text}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setClosedBanners((prev) => [...prev, cond.code])}
                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors shrink-0 cursor-pointer"
                    title="Đóng cảnh báo"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <div className="grid flex-1 grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 min-h-0 overflow-hidden">
          
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
                        <p className="text-[11px] font-mono text-muted-foreground">{student.studentId.toUpperCase()}</p>
                        <p className="text-[11px] text-muted-foreground">Lớp: <span className="font-semibold text-foreground">{student.classCode}</span></p>
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
                    <span className={cn('px-2.5 py-0.5 text-[11px] font-extrabold rounded-full border shadow-2xs leading-none shrink-0', getStatusBadgeClass(student.status))}>
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

            <div className="w-full pt-2.5 flex flex-col">
              {/* Left Column Navigation Tabs */}
              <div className="w-full bg-slate-100/90 dark:bg-zinc-800/80 p-1 rounded-lg flex items-center gap-1 mb-2.5 border border-slate-200/60 dark:border-zinc-700/60 shrink-0 h-9">
                <button
                  type="button"
                  onClick={() => setLeftTab('learning')}
                  className={cn(
                    'flex-1 h-7 px-3 rounded-md text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none',
                    leftTab === 'learning'
                      ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-2xs border border-slate-200/60 dark:border-zinc-700/60 font-semibold'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/40 dark:hover:bg-zinc-700/40 font-medium'
                  )}
                >
                  <GraduationCap className={cn('h-3.5 w-3.5 shrink-0', leftTab === 'learning' ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500 dark:text-zinc-400')} />
                  <span>Học tập</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLeftTab('orders')}
                  className={cn(
                    'flex-1 h-7 px-3 rounded-md text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none',
                    leftTab === 'orders'
                      ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-2xs border border-slate-200/60 dark:border-zinc-700/60 font-semibold'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/40 dark:hover:bg-zinc-700/40 font-medium'
                  )}
                >
                  <Receipt className={cn('h-3.5 w-3.5 shrink-0', leftTab === 'orders' ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500 dark:text-zinc-400')} />
                  <span>Đơn hàng</span>
                  <span
                    className={cn(
                      'inline-flex items-center justify-center text-[10px] font-bold h-4 px-1.5 rounded-full min-w-[16px] transition-colors',
                      leftTab === 'orders'
                        ? 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-200'
                        : 'bg-slate-200/80 text-slate-600 dark:bg-zinc-700 dark:text-zinc-300'
                    )}
                  >
                    {getStudentOrders(student.studentId, student.studentName).length}
                  </span>
                </button>
              </div>

              {leftTab === 'learning' ? (
                <StudentCareReportTab
                  studentId={student.studentId}
                  studentName={student.studentName}
                  activePackage={activePackage}
                  packagesList={packagesList}
                  selectedPackageId={selectedPackageId}
                  setSelectedPackageId={setSelectedPackageId}
                  staffInfo={staffInfo}
                  assignedCS={assignedCS}
                  onAssignedCSChange={setAssignedCS}
                  branchName="RinoEdu Nguyễn Tuân"
                />
              ) : (
                <StudentOrdersTab
                  studentId={student.studentId}
                  studentName={student.studentName}
                />
              )}
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
                    <Badge variant="outline" className="text-[8px] font-bold py-0.5 px-1 border-primary/20 text-primary uppercase select-none leading-none">
                      {contact.relationship}
                    </Badge>
                    {contact.isPrimary && (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10 font-bold px-1 py-px text-[7.5px] rounded border-none shadow-none leading-none select-none">
                        Chính
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-foreground font-semibold">{contact.phone}</p>
                  {contact.note && (
                    <p className="text-[10px] text-muted-foreground leading-normal italic bg-background/50 p-1.5 rounded-lg border border-border/40">
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
