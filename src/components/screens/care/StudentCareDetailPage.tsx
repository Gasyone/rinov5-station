'use client'

import { useMemo, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useUIStore } from '@/stores/useUIStore'
import { mockCareAlerts, type StudentCareAlert, getFamilyContacts } from '@/mocks/careAlerts'
import { mockStudents, type Student } from '@/mocks/students'
import { StudentCareProfilePanel } from './StudentCareProfilePanel'
import {
  StudentDetailEditProfileDialog,
  type StudentProfileUpdateData,
} from '../students/detail/StudentDetailEditProfileDialog'
import { stableHash } from './operationsAlertHelpers'
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
  onBack?: () => void
  alerts: StudentCareAlert[]
  onRefresh?: () => void
  onStudentSelect?: (studentId: string) => void
  initialTab?: 'learning' | 'orders' | 'packages' | 'regular' | 'renewal'
  headerTitle?: string
}

export function StudentCareDetailPage({
  studentId,
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
    initialTab === 'orders'
      ? 'orders'
      : initialTab === 'renewal'
        ? 'renewal'
        : 'regular'

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [revision, setRevision] = useState(0)
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false)
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

  const address = useMemo(() => {
    if (!student) return 'Số 29 Nguyễn Tuân, Nam Từ Liêm, Hà Nội'
    const districts = ["Thanh Xuân", "Cầu Giấy", "Đống Đa", "Hai Bà Trưng", "Nam Từ Liêm"]
    const district = districts[stableHash(student.studentId) % districts.length]
    return `Số ${10 + (stableHash(student.studentId) % 90)} Nguyễn Tuân, ${district}, Hà Nội`
  }, [student])

  const [isLeaveReserveOpen, setIsLeaveReserveOpen] = useState(false)

  const leaveRequest = useMemo(() => {
    if (!student) return null
    return (
      mockLeaveReserveRequests.find(
        (r) => r.studentId === student.studentId || r.studentName === student.studentName
      ) || mockLeaveReserveRequests[0]
    )
  }, [student])

  // Find matching student record from mockStudents or synthesize
  const resolvedStudent = useMemo<Student | null>(() => {
    if (!student) return null
    const target = mockStudents.find(
      (s) =>
        s.id === student.studentId ||
        s.id === student.id ||
        s.name.toLowerCase() === student.studentName.toLowerCase() ||
        student.studentName.toLowerCase().includes(s.name.toLowerCase()) ||
        s.name.toLowerCase().includes(student.studentName.toLowerCase())
    )

    if (target) {
      return {
        ...target,
        name: student.studentName || target.name,
        englishName: student.englishName || target.englishName,
        notes: student.studentNote || target.notes,
      }
    }

    const lastDigit = parseInt(student.studentId.replace(/\D/g, '').slice(-1), 10) || 0
    const isFemale = lastDigit % 2 === 0
    const baseYear = 2018 - (stableHash(student.studentId) % 4)
    const familyContacts = getFamilyContacts(student.studentId, student.studentName)
    const primaryC = familyContacts.find((c) => c.isPrimary) || familyContacts[0]

    return {
      id: student.studentId || student.id,
      name: student.studentName,
      englishName: student.englishName,
      email: `${student.studentId.toLowerCase()}@student.rinoedu.vn`,
      phone: primaryC?.phone || '0901234567',
      gender: isFemale ? 'Female' : 'Male',
      dob: `${baseYear}-08-25`,
      status: 'active',
      branch: 'RinoEdu Nguyễn Tuân',
      level: student.level || 'Toán 1:6',
      subLevel: student.subLevel,
      parentName: primaryC?.name || 'Nguyễn Thu Trang',
      parentPhone: primaryC?.phone || '0912345678',
      enrollmentDate: student.startDate || '2024-08-14',
      notes: student.studentNote || 'Thường xuyên giơ tay phát biểu, có năng khiếu tự học tốt.',
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student, studentId, revision])

  const handleSaveProfile = (updatedData: StudentProfileUpdateData) => {
    if (!resolvedStudent || !student) return

    // 1. Update in mockStudents
    const targetStudent = mockStudents.find(
      (s) =>
        s.id === resolvedStudent.id ||
        s.id === student.studentId ||
        s.name.toLowerCase() === resolvedStudent.name.toLowerCase()
    )
    if (targetStudent) {
      targetStudent.name = updatedData.name
      targetStudent.englishName = updatedData.englishName
      if (updatedData.avatar) targetStudent.avatar = updatedData.avatar
      targetStudent.gender = updatedData.gender
      targetStudent.dob = updatedData.dob
    }

    // 2. Update in mockCareAlerts
    const foundAlert = mockCareAlerts.find(
      (a) => a.id === studentId || a.studentId === studentId || a.studentName === student.studentName
    )
    if (foundAlert) {
      foundAlert.studentName = updatedData.name
      foundAlert.englishName = updatedData.englishName
    }

    setRevision((r) => r + 1)
    onRefresh?.()
    toast.success('Đã cập nhật thông tin học viên thành công!')
  }

  const handleUpdateNote = (newNote: string) => {
    if (!resolvedStudent || !student) return

    const targetStudent = mockStudents.find(
      (s) =>
        s.id === resolvedStudent.id ||
        s.id === student.studentId ||
        s.name.toLowerCase() === resolvedStudent.name.toLowerCase()
    )
    if (targetStudent) {
      targetStudent.notes = newNote
    }

    const foundAlert = mockCareAlerts.find(
      (a) => a.id === studentId || a.studentId === studentId || a.studentName === student.studentName
    )
    if (foundAlert) {
      foundAlert.studentNote = newNote
    }

    setRevision((r) => r + 1)
    onRefresh?.()
    toast.success('Đã cập nhật ghi chú học viên!')
  }

  if (!student) return null

  const formattedPhone = selectedContactPhone || primaryContact?.phone || '0901234567'

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      {/* Direct direct-split layout without top header bar */}
      <div className="flex-1 min-h-0 px-2.5 pb-2.5 pt-1.5 flex flex-col">
        <div className="grid flex-1 grid-cols-1 lg:grid-cols-2 gap-2 min-h-0 overflow-hidden">
          
          {/* Left Column: Profile Info Header & Report Tab */}
          <main className="flex min-h-0 flex-col overflow-y-auto bg-background border-none shadow-none pr-1 scrollbar-thin">
            
            {/* Thông tin học viên (Độc lập cho màn Chi tiết Chăm sóc) */}
            {resolvedStudent && (
              <StudentCareProfilePanel
                student={resolvedStudent}
                address={address}
                onEditProfile={() => setIsEditProfileOpen(true)}
                onUpdateNote={handleUpdateNote}
                className="mb-1.5 shrink-0"
              />
            )}

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
              onSelectPackageId={setSelectedPackageId}
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

      {/* Dialog: Chỉnh sửa thông tin học viên (Ảnh 2) */}
      {resolvedStudent && isEditProfileOpen && (
        <StudentDetailEditProfileDialog
          open={isEditProfileOpen}
          onOpenChange={setIsEditProfileOpen}
          initialData={{
            name: resolvedStudent.name,
            englishName: resolvedStudent.englishName,
            avatar: resolvedStudent.avatar,
            gender: resolvedStudent.gender,
            dob: resolvedStudent.dob,
          }}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  )
}
