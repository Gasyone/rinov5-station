'use client'

import { useMemo, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import {
  ArrowLeft,
  ShieldCheck,
  ChevronDown,
  Copy,
} from 'lucide-react'
import { toast } from 'sonner'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/useUIStore'
import { StudentCareHeaderClusterInfo, StudentCareHeaderClusterNote } from './StudentCareHeaderCluster'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { mockCareAlerts, type StudentCareAlert, getFamilyContacts } from '@/mocks/careAlerts'
import { stableHash } from './operationsAlertHelpers'
import { AppAvatar } from '@/components/shared'
import { StudentCareChatFeed } from './StudentCareChatFeed'
import { StudentCareReportTab } from './StudentCareReportTab'
import { LeaveReserveDetailDialog } from '@/components/screens/leave-reserve/LeaveReserveDetailDialog'
import { LeaveReserveCreateDialog } from '@/components/screens/leave-reserve/LeaveReserveCreateDialog'
import { formatDateISO } from '@/components/screens/leave-reserve/leaveReserveHelpers'
import { mockLeaveReserveRequests, type LeaveReserveRequest } from '@/mocks/leaveReserve'
import { CareJourneyModal } from './CareJourneyModal'
import { StudentDetailDialog } from '../students/detail/StudentDetailDialog'
import { StudentCareEarlyReturnDialog } from './StudentCareEarlyReturnDialog'
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
  initialTab?: 'learning' | 'orders' | 'regular' | 'renewal'
  headerTitle?: string
}

export function StudentCareDetailPage({
  studentId,
  onBack,
  alerts,
  onRefresh,
  initialTab = 'learning',
  headerTitle = 'Chi tiết chăm sóc',
}: StudentCareDetailPageProps) {
  const setCustomHeaderTitle = useUIStore((s) => s.setCustomHeaderTitle)

  useEffect(() => {
    setCustomHeaderTitle(headerTitle)
    return () => {
      setCustomHeaderTitle(null)
    }
  }, [setCustomHeaderTitle, headerTitle])

  const initialMode: 'regular' | 'renewal' | 'orders' = 
    initialTab === 'orders' ? 'orders' : initialTab === 'renewal' ? 'renewal' : 'regular'

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false)
  const [showCodes, setShowCodes] = useState(false)
  const [isCreateLeaveReserveOpen, setIsCreateLeaveReserveOpen] = useState(false)
  const [createLeaveReserveType, setCreateLeaveReserveType] = useState<'off' | 'reservation'>('off')
  const [isEarlyReturnOpen, setIsEarlyReturnOpen] = useState(false)

  const handleOpenCreateLeaveReserve = (type: 'off' | 'reservation') => {
    setCreateLeaveReserveType(type)
    setIsCreateLeaveReserveOpen(true)
  }

  const handleCreateLeaveReserveSubmit = (newReq: Omit<LeaveReserveRequest, 'id' | 'status' | 'requestedDate'>) => {
    const idPrefix = newReq.type === 'off' ? 'NP' : 'BL'
    const newId = `${idPrefix}${String(mockLeaveReserveRequests.length + 1).padStart(3, '0')}`
    const createdRequest: LeaveReserveRequest = {
      ...newReq,
      id: newId,
      status: 'pending',
      requestedDate: formatDateISO(new Date()),
    }
    mockLeaveReserveRequests.unshift(createdRequest)
    setIsCreateLeaveReserveOpen(false)
    toast.success(
      `Tạo ${newReq.type === 'off' ? 'đơn xin nghỉ phép' : 'đơn bảo lưu'} thành công (${newId})!`,
      {
        description: `Học viên: ${newReq.studentName} • Bắt đầu: ${newReq.startDate}`,
      }
    )
  }

  // Find student in care alerts
  const student = useMemo(() => {
    return alerts.find((a) => a.id === studentId || a.studentId === studentId) || null
  }, [studentId, alerts])

  const [assignedCS, setAssignedCS] = useState(student?.csStaff || 'Trần Thị Mai')
  const [prevStudentIdForCS, setPrevStudentIdForCS] = useState<string | null>(student?.studentId || null)

  if (student && student.studentId !== prevStudentIdForCS) {
    setPrevStudentIdForCS(student.studentId)
    setAssignedCS(student.csStaff || 'Trần Thị Mai')
  }

  const isRenewalMode = initialTab === 'renewal' || initialMode === 'renewal'

  const handleAssignedCSChange = (newCS: string) => {
    setAssignedCS(newCS)
    const foundAlert = mockCareAlerts.find((a) => a.id === studentId || a.studentId === studentId)
    if (foundAlert) {
      foundAlert.csStaff = newCS
    }
    onRefresh?.()
  }

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
              id: 'EMP-GV-HTM',
              name: isEnglish ? 'GV Sarah Smith' : 'Hoàng Thị Mai',
              role: isEnglish ? 'Giáo viên Tiếng Anh' : 'Giáo viên Toán tư duy',
              phone: '0912345678',
              email: isEnglish ? 'sarah.smith@rinoedu.vn' : 'mai.htm@rinoedu.vn',
              avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${isEnglish ? 'Sarah' : 'ThiMai'}`
            },
            {
              id: 'EMP-GV-TA',
              name: 'Hoàng Anh',
              role: 'Trợ giảng (TA)',
              phone: '0934567890',
              email: 'honganh@rinoedu.com',
              avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=HoangAnh',
              titleHeader: 'Trợ giảng buổi học',
              badge: 'Trợ giảng'
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
              name: 'Phạm Thị Toán',
              role: 'Giáo viên Toán tư duy',
              phone: '0917654321',
              email: 'toan.pt@rinoedu.vn',
              avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ThiToan'
            },
            {
              id: 'EMP-GV-TA2',
              name: 'Nguyễn Văn Minh',
              role: 'Trợ giảng (TA)',
              phone: '0988776655',
              email: 'minh.nv@rinoedu.com',
              avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=VanMinh',
              titleHeader: 'Trợ giảng buổi học',
              badge: 'Trợ giảng'
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
              name: 'Bùi Văn Anh',
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
              name: isEnglish ? 'GV Sarah Smith' : 'Hoàng Thị Mai',
              role: isEnglish ? 'Giáo viên Bản ngữ' : 'Giáo viên Toán tư duy',
              phone: '0919998887',
              email: isEnglish ? 'sarah.smith@rinoedu.vn' : 'mai.htm@rinoedu.vn',
              avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${isEnglish ? 'Sarah' : 'ThiMai'}`
            },
            {
              id: 'EMP-GV-TA-DEF',
              name: 'Hoàng Anh',
              role: 'Trợ giảng (TA)',
              phone: '0934567890',
              email: 'honganh@rinoedu.com',
              avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=HoangAnh',
              titleHeader: 'Trợ giảng buổi học',
              badge: 'Trợ giảng'
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
  const [isLeaveReserveOpen, setIsLeaveReserveOpen] = useState(false)

  const leaveRequest = useMemo(() => {
    if (!student) return null
    return (
      mockLeaveReserveRequests.find(
        (r) => r.studentId === student.studentId || r.studentName === student.studentName
      ) || mockLeaveReserveRequests[0]
    )
  }, [student])

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
        setStudentNote(mockNotes[hash % mockNotes.length])
      }
    }
  }, [student])

  if (prevContacts !== contacts) {
    setPrevContacts(contacts)
    setContactsList(contacts)
  }

  if (!student) return null

  const cid = student.customerCode || (student.studentId ? `VH${student.studentId.replace(/\D/g, '') || '230994'}` : 'VH230994')
  const uid = String(100000 + (stableHash(student.studentId) % 900000))
  const sid = student.studentId || '193060'

  const handleCopyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code)
    toast.success(`Đã sao chép ${label}!`)
  }

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
              {/* Top Row: Back Button, Avatar, Name, Mã ID, NS, ĐC, Phụ huynh */}
              <div className="flex items-start gap-3 min-w-0">
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
                        <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-1.5">
                          <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Môn học:</span>
                          <span className="font-semibold text-foreground">{student.subject}</span>
                        </div>
                        <div className="space-y-1.5 pt-1">
                          <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">LIÊN HỆ GIA ĐÌNH</p>
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
                  {/* Row: Tên học viên + Nút Nghỉ phép, Bảo lưu, Mã ID */}
                  <div className="flex items-center justify-between gap-2 leading-tight flex-nowrap min-w-0">
                    <span className="text-base font-bold text-foreground truncate">
                      {student.studentName} {student.englishName ? `(${student.englishName})` : ''}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0 ml-auto flex-wrap sm:flex-nowrap">
                      {/* Toggle Icon Button Mở rộng Mã ID */}
                      <button
                        type="button"
                        onClick={() => setShowCodes((prev) => !prev)}
                        className={cn(
                          "inline-flex items-center gap-1 text-xs transition-colors cursor-pointer select-none shrink-0 h-6.5 px-2 rounded-md hover:bg-muted/80 whitespace-nowrap border border-border/60",
                          showCodes
                            ? "text-primary font-bold bg-primary/10 border-primary/30"
                            : "text-muted-foreground hover:text-foreground font-medium"
                        )}
                        title={showCodes ? "Ẩn danh sách mã hệ thống" : "Hiện mã CID, UID, SID"}
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>Mã ID</span>
                        <ChevronDown className={cn("h-3 w-3 shrink-0 transition-transform duration-200", showCodes && "rotate-180")} />
                      </button>
                    </div>
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

              {/* Dải hiển thị mã hệ thống khi mở rộng - Tách thành 1 dòng riêng biệt */}
              {showCodes && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground select-none py-1.5 px-3 bg-muted/40 dark:bg-zinc-800/40 rounded-xl border border-primary/20 animate-in fade-in slide-in-from-top-1 duration-200 w-full">
                  <span className="flex items-center gap-1 font-mono text-xs">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>CID:</span>
                    <strong className="text-foreground font-semibold">{cid}</strong>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(cid, 'Mã CID')}
                      className="p-0.5 hover:text-foreground text-muted-foreground transition-colors cursor-pointer rounded hover:bg-muted/80 ml-0.5"
                      title="Sao chép CID"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </span>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="flex items-center gap-1 font-mono text-xs">
                    <span>UID:</span>
                    <strong className="text-foreground font-semibold">{uid}</strong>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(uid, 'Mã UID')}
                      className="p-0.5 hover:text-foreground text-muted-foreground transition-colors cursor-pointer rounded hover:bg-muted/80 ml-0.5"
                      title="Sao chép UID"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </span>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="flex items-center gap-1 font-mono text-xs">
                    <span>SID:</span>
                    <strong className="text-foreground font-semibold">{sid}</strong>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(sid, 'Mã SID')}
                      className="p-0.5 hover:text-foreground text-muted-foreground transition-colors cursor-pointer rounded hover:bg-muted/80 ml-0.5"
                      title="Sao chép SID"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </span>
                </div>
              )}

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
                studentAlert={student}
                onOpenLeaveReserveDialog={() => setIsLeaveReserveOpen(true)}
                onCreateLeaveReserve={handleOpenCreateLeaveReserve}
                isRenewal={isRenewalMode}
              />
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
              selectedPackageId={selectedPackageId}
              selectedPackage={activePackage}
              initialMode={initialMode}
            />
          </aside>

        </div>
      </div>

      <StudentDetailDialog
        studentId={student.studentId}
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />

      {leaveRequest && (
        <LeaveReserveDetailDialog
          open={isLeaveReserveOpen}
          onOpenChange={setIsLeaveReserveOpen}
          request={leaveRequest}
          readOnly={true}
        />
      )}

      {/* Modal Tạo đơn bảo lưu / Nghỉ phép */}
      <LeaveReserveCreateDialog
        open={isCreateLeaveReserveOpen}
        onOpenChange={setIsCreateLeaveReserveOpen}
        initialType={createLeaveReserveType}
        initialStudentId={student?.studentId}
        onSubmit={handleCreateLeaveReserveSubmit}
      />

      {/* Modal Đi học lại (khi đang bảo lưu) */}
      <StudentCareEarlyReturnDialog
        open={isEarlyReturnOpen}
        onOpenChange={setIsEarlyReturnOpen}
        studentName={student?.studentName || ''}
        studentCode={student?.customerCode || student?.studentId || ''}
        studentId={student?.studentId}
        packageName={student ? `${student.subject} - ${student.level}` : 'Khóa học'}
        className={student?.classCode || 'Lớp học'}
        classCode={student?.classCode || 'LD_TOAN_00010'}
        isHoldingClass={Boolean(student?.classCode && student.classCode !== '-')}
        expectedReturnDate={student?.expectedEndDate || '16/09/2026'}
        remainingSessions={student?.remainingSessions ?? 22}
        branchName="RinoEdu Nguyễn Tuân"
        onSuccess={() => {
          setIsEarlyReturnOpen(false)
          toast.success(`Học viên ${student?.studentName} đã quay lại học thành công!`)
        }}
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
