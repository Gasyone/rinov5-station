'use client'

import { useMemo, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  ArrowLeft,
  Copy,
  Check,
  Pencil,
  MapPin,
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
import { useUIStore } from '@/stores/useUIStore'
import { StudentCareHeaderClusterInfo, StudentCareHeaderClusterNote } from './StudentCareHeaderCluster'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { type StudentCareAlert, getFamilyContacts } from '@/mocks/careAlerts'
import { stableHash } from './operationsAlertHelpers'
import { AppAvatar } from '@/components/shared'
import { StudentCareChatFeed } from './StudentCareChatFeed'
import { StudentCareReportTab } from './StudentCareReportTab'
import { StudentOrdersTab, getStudentOrders } from './StudentOrdersTab'
import { CareJourneyModal } from './CareJourneyModal'
import { StudentDetailDialog } from '../students/detail/StudentDetailDialog'
import {
  getCareTopicsForStudent,
  getSimulatedLogs,
  getSimulatedPackagesList,
} from './studentCareDetailHelpers'

interface StudentCareDetailPageProps {
  studentId: string
  onBack: () => void
  alerts: StudentCareAlert[]
  onRefresh?: () => void
  onStudentSelect?: (studentId: string) => void
  initialTab?: 'learning' | 'orders'
}

export function StudentCareDetailPage({
  studentId,
  onBack,
  alerts,
  onRefresh,
  initialTab = 'learning',
}: StudentCareDetailPageProps) {
  const setCustomHeaderTitle = useUIStore((s) => s.setCustomHeaderTitle)

  useEffect(() => {
    setCustomHeaderTitle('Chi tiết chăm sóc')
    return () => {
      setCustomHeaderTitle(null)
    }
  }, [setCustomHeaderTitle])

  const [leftTab, setLeftTab] = useState<'learning' | 'orders'>(initialTab)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLeftTab(initialTab)
  }, [initialTab, studentId])

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false)
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
  
  // Find student in care alerts
  const student = useMemo(() => {
    return alerts.find((a) => a.id === studentId || a.studentId === studentId) || null
  }, [studentId, alerts])


  // Get packages list dynamically
  const packagesList = useMemo(() => {
    if (!student) return []
    return getSimulatedPackagesList(student)
  }, [student])

  const [selectedPackageId, setSelectedPackageId] = useState<string>('pkg-1')
  const [selectedContactPhone] = useState<string | null>(null)
  const [prevStudentId, setPrevStudentId] = useState<string | null>(null)

  // Sync selected package and sideLogs when student changes
  if (student && student.studentId !== prevStudentId) {
    setPrevStudentId(student.studentId)
    setSelectedPackageId('pkg-1')
  }



  const activePackage = useMemo(() => {
    return packagesList.find((p) => p.id === selectedPackageId) || packagesList[0] || null
  }, [packagesList, selectedPackageId])

  const staffInfo = useMemo(() => {
    if (!activePackage) return {
      cs: { id: '—', name: '—', role: 'CS', avatar: '' },
      teachers: []
    }
    const isEnglish = !activePackage.packageName.toLowerCase().includes('toán')
    
    switch (activePackage.id) {
      case 'pkg-1':
        return {
          cs: {
            id: 'EMP-MP',
            name: 'CSM Minh Phương',
            role: 'Quản lý chăm sóc học viên (CSM)',
            phone: '0901234567',
            email: 'phuong.minh@rinoedu.vn',
            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MinhPhuong'
          },
          teachers: [
            {
              id: 'EMP-GV-HH',
              name: isEnglish ? 'GV Nguyễn Huy Hoàng' : 'GV Nguyễn Minh Trí',
              role: isEnglish ? 'Giáo viên Tiếng Anh' : 'Giáo viên Toán tư duy',
              phone: '0912345678',
              email: isEnglish ? 'hoang.nh@rinoedu.vn' : 'tri.nm@rinoedu.vn',
              avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${isEnglish ? 'HuyHoang' : 'MinhTri'}`
            },
            {
              id: 'EMP-GV-TA',
              name: isEnglish ? 'GV Sarah Smith' : 'GV Bùi Văn Anh',
              role: isEnglish ? 'Giáo viên Bản ngữ' : 'Giáo viên phụ khuyết',
              phone: '0918273645',
              email: isEnglish ? 'sarah.smith@rinoedu.vn' : 'anh.bv@rinoedu.vn',
              avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${isEnglish ? 'Sarah' : 'VanAnh'}`
            }
          ]
        }
      case 'pkg-2':
        return {
          cs: {
            id: 'EMP-TT',
            name: 'CSM Thu Trang',
            role: 'Quản lý chăm sóc học viên (CSM)',
            phone: '0907654321',
            email: 'trang.thu@rinoedu.vn',
            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ThuTrang'
          },
          teachers: [
            {
              id: 'EMP-GV-PTT',
              name: 'GV Phạm Thị Toán',
              role: 'Giáo viên Toán tư duy',
              phone: '0917654321',
              email: 'toan.pt@rinoedu.vn',
              avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ThiToan'
            }
          ]
        }
      case 'pkg-3':
        return {
          cs: {
            id: 'EMP-LA',
            name: 'CSM Lan Anh',
            role: 'Quản lý vận hành (CSM)',
            phone: '0901234567',
            email: 'lananh@rinoedu.vn',
            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=LanAnh'
          },
          teachers: [
            {
              id: 'EMP-GV-BVA',
              name: 'GV Bùi Văn Anh',
              role: 'Giáo viên chính',
              phone: '0918273645',
              email: 'anh.bv@rinoedu.vn',
              avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=VanAnh'
            }
          ]
        }
      default:
        return {
          cs: {
            id: 'EMP-LD',
            name: 'CSM Linh Đan',
            role: 'Quản lý chăm sóc học viên (CSM)',
            phone: '0902223334',
            email: 'dan.linh@rinoedu.vn',
            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=LinhDan'
          },
          teachers: [
            {
              id: 'EMP-GV-DEFAULT',
              name: isEnglish ? 'GV Sarah Smith' : 'GV Trần Minh Đức',
              role: isEnglish ? 'Giáo viên Bản ngữ' : 'Giáo viên Toán tư duy',
              phone: '0919998887',
              email: isEnglish ? 'sarah.smith@rinoedu.vn' : 'duc.tm@rinoedu.vn',
              avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${isEnglish ? 'Sarah' : 'MinhDuc'}`
            }
          ]
        }
    }
  }, [activePackage])


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
  const formattedPhone = selectedContactPhone || primaryContact?.phone || '0901234567'

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      {/* Direct direct-split layout without top header bar */}
      <div className="flex-1 min-h-0 px-4 pb-4 pt-3 flex flex-col">
        <div className="grid flex-1 grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 min-h-0 overflow-hidden">
          
          {/* Left Column: Profile Info Header & Report Tab */}
          <main className="flex min-h-0 flex-col overflow-y-auto bg-background border-none shadow-none pr-1.5 scrollbar-thin">
            
            {/* Unified Personal Information Cluster Card */}
            <div className="shrink-0 bg-card dark:bg-zinc-900 border border-border/80 rounded-2xl p-3.5 shadow-sm space-y-2 text-left mb-3">
              {/* Top Row: Back Button, Avatar (Dịch lên trên), Name, Status, NS, ĐC, Phụ huynh */}
              <div className="flex items-start gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground shrink-0 border mt-0.5"
                  title="Quay lại danh sách cảnh báo"
                  onClick={onBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

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
                            <Badge className={cn('text-[8px] font-bold py-0.5 px-1.5 rounded-full shadow-none border-none uppercase leading-none h-4', getStatusBadgeClass(student.status))}>
                              {student.status}
                            </Badge>
                          </div>
                          <p className="font-mono text-[9.5px] text-muted-foreground mt-0.5">{student.studentId}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-1.5">
                          <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Lớp học:</span>
                          <span className="font-semibold text-foreground truncate">{student.classCode}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-1.5">
                          <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Môn học:</span>
                          <span className="font-semibold text-foreground">{student.subject}</span>
                        </div>
                        <div className="space-y-1.5 pt-1">
                          <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">LIÊN HỆ GIA ĐÌNH</p>
                          {contactsList.map((contact, idx) => (
                            <div key={idx} className="flex justify-between items-center gap-2 py-0.5">
                              <span className="font-medium text-foreground">{contact.name} ({contact.relationship})</span>
                              <span className="font-mono text-muted-foreground font-semibold">{contact.phone}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-[9.5px] text-primary font-bold text-center border-t border-border/40 pt-2 cursor-pointer hover:underline">
                        Nhấp vào avatar để xem chi tiết đầy đủ
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                {/* Right side info next to avatar */}
                <div className="min-w-0 space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap leading-tight">
                    <span className="text-base font-bold text-foreground">
                      {student.studentName} {student.englishName ? `(${student.englishName})` : ''}
                    </span>
                    <Badge className={cn('text-[9px] font-semibold py-0.5 px-2 rounded-full leading-none shadow-none', 
                      student.status === 'Đang học'
                        ? getStatusBadgeClass('dang_hoc')
                        : student.status === 'Chờ chuyển lớp'
                          ? getStatusBadgeClass('pending_transfer')
                          : getStatusBadgeClass('session_ended')
                    )}>
                      {student.status}
                    </Badge>
                  </div>

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

              {/* Student Note Row: Full Width underneath Avatar */}
              <StudentCareHeaderClusterNote
                studentNote={studentNote}
                setStudentNote={setStudentNote}
                isEditingStudentNote={isEditingStudentNote}
                setIsEditingStudentNote={setIsEditingStudentNote}
                editingStudentNoteText={editingStudentNoteText}
                setEditingStudentNoteText={setEditingStudentNoteText}
              />
            </div>

            <div className="w-full pt-2.5 flex flex-col">
              {/* Left Column Navigation Tabs */}
              <div className="w-full bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg flex items-center gap-1 mb-2.5 border border-slate-200 dark:border-zinc-700 shrink-0 h-9">
                <button
                  type="button"
                  onClick={() => setLeftTab('learning')}
                  className={cn(
                    'flex-1 h-7 px-3 rounded-md text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5',
                    leftTab === 'learning'
                      ? 'bg-white dark:bg-zinc-900 text-foreground dark:text-white shadow-xs border border-slate-200 dark:border-zinc-700 font-bold'
                      : 'text-slate-700 dark:text-zinc-300 hover:text-foreground dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-zinc-700/70 font-semibold'
                  )}
                >
                  <GraduationCap className={cn('h-3.5 w-3.5 shrink-0', leftTab === 'learning' ? 'text-sky-600 dark:text-sky-400' : 'text-slate-600 dark:text-zinc-400')} />
                  <span>Học tập</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLeftTab('orders')}
                  className={cn(
                    'flex-1 h-7 px-3 rounded-md text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5',
                    leftTab === 'orders'
                      ? 'bg-white dark:bg-zinc-900 text-foreground dark:text-white shadow-xs border border-slate-200 dark:border-zinc-700 font-bold'
                      : 'text-slate-700 dark:text-zinc-300 hover:text-foreground dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-zinc-700/70 font-semibold'
                  )}
                >
                  <Receipt className={cn('h-3.5 w-3.5 shrink-0', leftTab === 'orders' ? 'text-sky-600 dark:text-sky-400' : 'text-slate-600 dark:text-zinc-400')} />
                  <span>Đơn hàng</span>
                  <span
                    className={cn(
                      'inline-flex items-center justify-center text-[10.5px] font-bold h-4 px-1.5 rounded-full min-w-[16px] transition-colors',
                      leftTab === 'orders'
                        ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                        : 'bg-slate-200 text-slate-700 dark:bg-zinc-700 dark:text-zinc-300'
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

          {/* Right Panel: Interaction Timeline Feed */}
          <aside className="flex min-h-0 flex-col text-left">
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
      </div>

      <StudentDetailDialog
        studentId={student.studentId}
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />

      <CareJourneyModal
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
        workItem={
          student
            ? {
                id: student.id,
                studentId: student.studentId,
                studentName: student.studentName,
                className: student.classCode,
                productName: `${student.subject} - ${student.level}`,
                expectedEndDate: student.expectedEndDate || '25/10/2026',
              }
            : null
        }
      />
    </div>
  )
}
