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
import { cn } from '@/lib/utils'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { type StudentCareAlert, getFamilyContacts } from '@/mocks/careAlerts'
import { stableHash } from './operationsAlertHelpers'
import { AppAvatar } from '@/components/shared'
import { StudentCareChatFeed } from './StudentCareChatFeed'
import { StudentCareReportTab } from './StudentCareReportTab'
import { StudentOrdersTab, getStudentOrders } from './StudentOrdersTab'
import { StudentDetailDialog } from '../students/detail/StudentDetailDialog'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { StudentCareHeaderClusterInfo, StudentCareHeaderClusterNote } from './StudentCareHeaderCluster'
import {
  getCareTopicsForStudent,
  getSimulatedLogs,
  getSimulatedPackagesList,
} from './studentCareDetailHelpers'


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



  const [prevStudentId, setPrevStudentId] = useState<string | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Sync when student changes
  if (student && student.studentId !== prevStudentId) {
    setPrevStudentId(student.studentId)
    setClosedBanners([])
  }

  const activePackage = useMemo(() => {
    return packagesList[0] || null
  }, [packagesList])

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
      <DialogContent className="grid h-[88vh] max-h-[860px] overflow-hidden p-3.5 sm:max-w-[94vw] lg:max-w-[1260px] bg-background">
        
        {/* Active condition banners */}
        {activeConditions.length > 0 && (
          <div className="mb-2 flex flex-col gap-1.5 shrink-0 select-none">
            {activeConditions.map((cond) => {
              let colorClasses = "border-zinc-200 bg-transparent text-zinc-900 dark:border-zinc-800 dark:text-zinc-200"
              let IconComponent = Info
              let iconColor = "text-zinc-500"

              if (cond.severity === 'high') {
                colorClasses = "bg-transparent text-rose-900 dark:text-rose-250"
                IconComponent = ShieldAlert
                iconColor = "text-rose-600 dark:text-rose-400"
              } else if (cond.severity === 'medium') {
                colorClasses = "bg-transparent text-amber-900 dark:text-amber-250"
                IconComponent = Clock
                iconColor = "text-amber-600 dark:text-amber-400"
              }

              return (
                <div
                  key={cond.code}
                  className={cn(
                    "flex items-center justify-between gap-3 py-1.5 px-3 rounded-lg border-none shadow-none text-xs leading-none relative transition-all duration-200",
                    colorClasses
                  )}
                >
                  <div className="flex gap-2 min-w-0 items-center">
                    <IconComponent className={cn("h-3.5 w-3.5 shrink-0", iconColor)} />
                    <span className="truncate py-0.5 select-text font-normal">
                      <span className="font-medium text-muted-foreground">Kích hoạt điều kiện:</span> {cond.text}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setClosedBanners((prev) => [...prev, cond.code])}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-muted/40 p-1 rounded-md cursor-pointer transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <div className="grid flex-1 grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 min-h-0 overflow-hidden">
          
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
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">LIÊN HỆ GIA ĐÌNH</p>
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
                    <Badge className={cn('text-[9px] font-semibold py-0.5 px-2 rounded-full shadow-none border-none', getStatusBadgeClass(student.status))}>
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
                  selectedPackageId={activePackage?.id || ''}
                  setSelectedPackageId={() => {}}
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
  </Dialog>
  )
}


