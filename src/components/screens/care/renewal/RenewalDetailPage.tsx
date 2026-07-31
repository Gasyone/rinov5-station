'use client'

import { useMemo, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { ArrowLeft, GraduationCap, Receipt } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { type StudentCareAlert, getFamilyContacts } from '@/mocks/careAlerts'
import { AppAvatar } from '@/components/shared'
import { StudentCareHeaderCluster } from '../StudentCareHeaderCluster'
import { StudentCareReportTab } from '../StudentCareReportTab'
import { StudentOrdersTab, getStudentOrders } from '../StudentOrdersTab'
import { CareJourneyModal } from '../CareJourneyModal'
import { StudentDetailDialog } from '../../students/detail/StudentDetailDialog'
import { RenewalChatFeed } from './RenewalChatFeed'
import { getSimulatedPackagesList } from '../studentCareDetailHelpers'
import { stableHash } from './renewalHelpers'

interface RenewalDetailPageProps {
  studentId: string
  onBack: () => void
  alerts: StudentCareAlert[]
  onRefresh?: () => void
}

export function RenewalDetailPage({
  studentId,
  onBack,
  alerts,
  onRefresh,
}: RenewalDetailPageProps) {
  const [leftTab, setLeftTab] = useState<'learning' | 'orders'>('learning')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false)
  const [assignedCS, setAssignedCS] = useState('Lê Thị Lan')

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
  const [prevStudentId, setPrevStudentId] = useState<string | null>(null)

  if (student && student.studentId !== prevStudentId) {
    setPrevStudentId(student.studentId)
    setSelectedPackageId('pkg-1')
  }

  const activePackage = useMemo(() => {
    return packagesList.find((p) => p.id === selectedPackageId) || packagesList[0] || null
  }, [packagesList, selectedPackageId])

  const staffInfo = useMemo(() => {
    if (!activePackage) {
      return {
        cs: { id: '—', name: '—', role: 'CS', avatar: '' },
        teachers: [],
      }
    }
    const isEnglish = !activePackage.packageName.toLowerCase().includes('toán')

    return {
      cs: {
        id: 'EMP-MP',
        name: 'CSM Minh Phương',
        role: 'Quản lý chăm sóc học viên (CSM)',
        phone: '0901234567',
        email: 'phuong.minh@rinoedu.vn',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MinhPhuong',
      },
      teachers: [
        {
          id: 'EMP-GV-HH',
          name: isEnglish ? 'GV Nguyễn Huy Hoàng' : 'GV Nguyễn Minh Trí',
          role: isEnglish ? 'Giáo viên Tiếng Anh' : 'Giáo viên Toán tư duy',
          phone: '0912345678',
          email: isEnglish ? 'hoang.nh@rinoedu.vn' : 'tri.nm@rinoedu.vn',
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${isEnglish ? 'HuyHoang' : 'MinhTri'}`,
        },
        {
          id: 'EMP-GV-TA',
          name: isEnglish ? 'GV Sarah Smith' : 'GV Bùi Văn Anh',
          role: isEnglish ? 'Giáo viên Bản ngữ' : 'Giáo viên phụ khuyết',
          phone: '0918273645',
          email: isEnglish ? 'sarah.smith@rinoedu.vn' : 'anh.bv@rinoedu.vn',
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${isEnglish ? 'Sarah' : 'VanAnh'}`,
        },
      ],
    }
  }, [activePackage])

  // Get contacts
  const contacts = useMemo(() => {
    if (!student) return []
    return getFamilyContacts(student.studentId, student.studentName)
  }, [student])
  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0]

  const birthYear = useMemo(() => {
    if (!student) return ''
    const baseYear = 2018 - (stableHash(student.studentId) % 4)
    return `25/08/${baseYear}`
  }, [student])

  const address = useMemo(() => {
    if (!student) return ''
    const districts = ['Thanh Xuân', 'Cầu Giấy', 'Đống Đa', 'Hai Bà Trưng', 'Nam Từ Liêm']
    const district = districts[stableHash(student.studentId) % districts.length]
    return `Số ${10 + (stableHash(student.studentId) % 90)} Nguyễn Tuân, ${district}, Hà Nội`
  }, [student])

  const [prevContacts, setPrevContacts] = useState(contacts)
  const [contactsList, setContactsList] = useState(contacts)

  // Student note state
  const [studentNote, setStudentNote] = useState('')
  const [isEditingStudentNote, setIsEditingStudentNote] = useState(false)
  const [editingStudentNoteText, setEditingStudentNoteText] = useState('')
  const [isParentsExpanded, setIsParentsExpanded] = useState(false)
  const [isStudentNoteExpanded, setIsStudentNoteExpanded] = useState(false)

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
  const formattedPhone = primaryContact?.phone || '0981 511 122'

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      {/* Container Grid: Left (Profile & Academic/Orders) + Right (Renewal Chat Feed) */}
      <div className="flex-1 min-h-0 px-4 pb-4 pt-3 flex flex-col">
        <div className="grid flex-1 grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 min-h-0 overflow-hidden">
          
          {/* Left Column: Student Profile & Academic / Order Tabs */}
          <main className="flex min-h-0 flex-col overflow-y-auto bg-background pr-1.5 scrollbar-thin">
            
            {/* Personal Information Header Card */}
            <div className="shrink-0 bg-card dark:bg-zinc-900 border border-border/80 rounded-2xl p-4 shadow-xs space-y-3.5 select-none text-left mb-3">
              <div className="flex items-center gap-3.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground shrink-0 border"
                  title="Quay lại danh sách Tái phí"
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
                        size="2xl"
                        className="border-2 border-background shadow-md shrink-0 h-20 w-20 text-xl pointer-events-none"
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
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <div className="min-w-0 space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap leading-tight">
                    <span className="text-base font-bold text-foreground">{student.studentName}</span>
                    <Badge
                      className={cn(
                        'text-[9px] font-semibold py-0.5 px-2 rounded-full leading-none shadow-none',
                        student.status === 'Đang học'
                          ? getStatusBadgeClass('dang_hoc')
                          : student.status === 'Chờ chuyển lớp'
                          ? getStatusBadgeClass('pending_transfer')
                          : getStatusBadgeClass('session_ended')
                      )}
                    >
                      {student.status}
                    </Badge>
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

            {/* Left Column Tabs: Học tập & Đơn hàng */}
            <div className="w-full pt-1 flex flex-col">
              <div className="w-full bg-slate-100/90 dark:bg-zinc-800/80 p-1 rounded-lg flex items-center gap-1 mb-2.5 border border-slate-200/60 dark:border-zinc-700/60 shrink-0 h-9">
                <button
                  type="button"
                  onClick={() => setLeftTab('learning')}
                  className={cn(
                    'flex-1 h-7 px-3 rounded-md text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none',
                    leftTab === 'learning'
                      ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-2xs border border-slate-200/60 dark:border-zinc-700/60 font-semibold'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                  )}
                >
                  <GraduationCap className={cn('h-3.5 w-3.5 shrink-0', leftTab === 'learning' ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500')} />
                  <span>Học tập</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLeftTab('orders')}
                  className={cn(
                    'flex-1 h-7 px-3 rounded-md text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none',
                    leftTab === 'orders'
                      ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-2xs border border-slate-200/60 dark:border-zinc-700/60 font-semibold'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                  )}
                >
                  <Receipt className={cn('h-3.5 w-3.5 shrink-0', leftTab === 'orders' ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500')} />
                  <span>Đơn hàng</span>
                  <span
                    className={cn(
                      'inline-flex items-center justify-center text-[10px] font-bold h-4 px-1.5 rounded-full min-w-[16px]',
                      leftTab === 'orders' ? 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-200' : 'bg-slate-200/80 text-slate-600'
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
                <StudentOrdersTab studentId={student.studentId} studentName={student.studentName} />
              )}
            </div>
          </main>

          {/* Right Column: Dedicated Renewal Chat & Action Feed */}
          <aside className="flex min-h-0 flex-col text-left">
            <RenewalChatFeed
              key={student.studentId}
              student={student}
              contacts={contacts}
              formattedPhone={formattedPhone}
              primaryContact={primaryContact}
              onRefresh={onRefresh}
            />
          </aside>

        </div>
      </div>

      <StudentDetailDialog studentId={student.studentId} open={isProfileOpen} onOpenChange={setIsProfileOpen} />

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
                productName: student.attendanceRatio,
              }
            : null
        }
      />
    </div>
  )
}
