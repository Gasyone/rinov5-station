'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import { useSystemConfigStore } from '@/stores/useSystemConfigStore'
import { useUIStore } from '@/stores/useUIStore'
import { mockClassRecords, type ClassRecord } from '@/mocks/classRecords'
import { getMockClassSessions, type ClassSession } from '@/mocks/calendarSchedule'
import { mockCareAlerts } from '@/mocks/careAlerts'
import { mockBookingTests, type BookingTest } from '@/mocks/bookingTests'
import { mockLeaveReserveRequests } from '@/mocks/leaveReserve'
import { toast } from 'sonner'

import { HomeWorkdayHeader } from './HomeWorkdayHeader'
import { HomeTodayScheduleSection } from './HomeTodayScheduleSection'
import { HomeManagedClassesSection } from './HomeManagedClassesSection'
import { HomeUpdatesFeedSection } from './HomeUpdatesFeedSection'

import { ClassesDetailDialog } from '@/components/screens/classes/detail/ClassesDetailDialog'
import { SessionDetailDialog } from '@/components/screens/calendar/SessionDetailDialog'
import { BookingTestDetailDialog } from '@/components/screens/booking-test/BookingTestDetailDialog'
import { HomeStudentDetailModal } from './HomeStudentDetailModal'
import { HomeMenuHubDialog } from './HomeMenuHubDialog'

import {
  computeHomeClassMetrics,
  getTodayScheduleItems,
  getCareAvatarItems,
  getRenewalAvatarItems,
  getDailyTodos,
  toDateKeyString,
} from './homeHelpers'
import type {
  TodayScheduleItem,
  CareAvatarItem,
  RenewalAvatarItem,
} from './homeTypes'

export function HomeScreen() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const currentBranchFromConfig = useSystemConfigStore((s) => s.currentBranch)

  // Scope state from store
  const workdayDateStr = useUIStore((s) => s.workdayDate)
  const currentDate = useMemo(() => {
    return workdayDateStr ? new Date(`${workdayDateStr}T00:00:00`) : new Date()
  }, [workdayDateStr])

  const [selectedBranch, setSelectedBranch] = useState<string>(
    currentBranchFromConfig || 'all'
  )

  // Dialog states for Quick View / Detail Inspection
  const [isMenuHubOpen, setIsMenuHubOpen] = useState(false)
  const [activeClassSession, setActiveClassSession] = useState<ClassSession | null>(null)
  const [activeBookingTest, setActiveBookingTest] = useState<BookingTest | null>(null)
  const [bookingDetailNote, setBookingDetailNote] = useState('')
  const [activeClass, setActiveClass] = useState<ClassRecord | null>(null)
  const [activeCareStudent, setActiveCareStudent] = useState<CareAvatarItem | null>(null)
  const [activeRenewalStudent, setActiveRenewalStudent] = useState<RenewalAvatarItem | null>(null)

  // Memoized computations
  const classMetrics = useMemo(() => {
    return computeHomeClassMetrics(mockClassRecords, selectedBranch)
  }, [selectedBranch])

  const allClassSessions = useMemo(() => {
    return getMockClassSessions()
  }, [])

  const todayScheduleItems = useMemo(() => {
    const dateKey = toDateKeyString(currentDate)
    return getTodayScheduleItems(
      allClassSessions,
      mockBookingTests,
      selectedBranch,
      dateKey
    )
  }, [allClassSessions, currentDate, selectedBranch])

  const careAvatarItems = useMemo(() => {
    return getCareAvatarItems(mockCareAlerts, selectedBranch, 20)
  }, [selectedBranch])

  const renewalAvatarItems = useMemo(() => {
    return getRenewalAvatarItems(mockCareAlerts, selectedBranch, 20)
  }, [selectedBranch])

  const dailyTodos = useMemo(() => {
    return getDailyTodos(
      mockLeaveReserveRequests,
      allClassSessions,
      mockCareAlerts,
      selectedBranch
    )
  }, [allClassSessions, selectedBranch])

  const pendingLeaveCount = useMemo(() => {
    return mockLeaveReserveRequests.filter((l) => l.status === 'pending').length
  }, [])

  // Navigation handlers
  const handleNavigate = (path: string) => {
    router.push(path)
  }

  // Student click handlers
  const handleOpenCareStudent = (studentId: string) => {
    const found = careAvatarItems.find((c) => c.studentId === studentId)
    if (found) {
      setActiveCareStudent(found)
    }
  }

  const handleOpenRenewalStudent = (studentId: string) => {
    const found = renewalAvatarItems.find((r) => r.studentId === studentId)
    if (found) {
      setActiveRenewalStudent(found)
    }
  }

  const handleOpenScheduleSession = (item: TodayScheduleItem) => {
    // 1. Placement test booking (e.g. E0011)
    const matchedBooking = mockBookingTests.find(
      (b) => b.id === item.id || b.id === item.classCode
    )
    if (matchedBooking || item.type === 'placement_test') {
      setActiveBookingTest(matchedBooking || mockBookingTests[0])
      return
    }

    // 2. Class Session from calendar schedule
    if (item.rawSession) {
      setActiveClassSession(item.rawSession)
      return
    }

    const matchedSession = allClassSessions.find((s) => s.id === item.id)
    if (matchedSession) {
      setActiveClassSession(matchedSession)
      return
    }

    // 3. Fallback: synthesize ClassSession from TodayScheduleItem
    const dateKey = toDateKeyString(currentDate)
    const fallbackSession: ClassSession = {
      id: item.id,
      classCode: item.classCode,
      className: item.className,
      subject: item.subject,
      teacher: item.teacher,
      assistantTeacher: item.assistantTeacher,
      substituteTeacher: item.substituteTeacher,
      branch: item.branch,
      schoolRoom: item.room,
      level: item.level,
      date: dateKey,
      dateDisplay: 'Hôm nay',
      dateBucket: 'today',
      timeLabel: item.startTime,
      endTimeLabel: item.endTime,
      statusLabel: item.statusLabel,
      type:
        item.type === 'digi_session'
          ? 'digi_session'
          : item.type === 'test_session'
            ? 'test_session'
            : 'class_session',
      typeLabel: item.typeLabel,
      title: item.lessonTitle || item.className,
      lessonSubtitle: '',
      totalStudents: item.totalStudents,
      officialStudents: item.officialStudents,
      trialStudents: item.trialStudents,
      makeUpStudents: item.makeUpStudents,
      status:
        item.status === 'completed'
          ? 'completed'
          : item.status === 'cancelled'
            ? 'cancelled'
            : 'confirmed',
    }
    setActiveClassSession(fallbackSession)
  }

  return (
    <div className="w-full max-w-[1360px] 2xl:max-w-[1440px] mx-auto h-full flex flex-col justify-between p-2 sm:p-2.5 gap-2 pb-1.5 overflow-hidden">
      <div className="flex-1 min-h-0 flex flex-col gap-2.5 sm:gap-3">
        {/* 1. Header: Chào buổi chiều, Chăm sóc & Tái phí gộp bên dưới, Cơ sở cạnh Menu button, Thống kê 1 dòng */}
        <div className="shrink-0">
          <HomeWorkdayHeader
            selectedBranch={selectedBranch}
            onBranchChange={setSelectedBranch}
            userName={user?.name || 'Admin'}
            totalClasses={mockClassRecords.length}
            runningClasses={classMetrics.activeClassesCount}
            todaySessionsCount={todayScheduleItems.length}
            careAvatarItems={careAvatarItems}
            renewalAvatarItems={renewalAvatarItems}
            pendingLeaveCount={pendingLeaveCount}
            onOpenCareStudent={handleOpenCareStudent}
            onOpenRenewalStudent={handleOpenRenewalStudent}
            onNavigateCare={() => handleNavigate('/app/student_operations_alert')}
            onNavigateRenewal={() => handleNavigate('/app/renewal')}
            onOpenMenuHub={() => setIsMenuHubOpen(true)}
            onNavigateManage={() => handleNavigate('/app/classes')}
          />
        </div>

        {/* 2. Hoạt động chính: Thu hẹp section Lớp & Lịch, tăng bề rộng Thông tin cập nhật */}
        <div className="grid grid-cols-1 lg:grid-cols-[290px_minmax(0,1fr)_300px] gap-2 items-stretch flex-1 min-h-0">
          {/* Cột 1 (Bên trái, thu hẹp): Lớp học (Thống kê 1 dòng, có viền cho từng lớp, selection filter) */}
          <HomeManagedClassesSection
            classes={mockClassRecords}
            onOpenClassDetail={(cls) => setActiveClass(cls)}
            onNavigateClasses={() => handleNavigate('/app/classes')}
          />

          {/* Cột 2 (Ở giữa, tăng bề rộng): Bảng tin vận hành & việc cần xử lý */}
          <HomeUpdatesFeedSection
            todos={dailyTodos}
            onNavigate={handleNavigate}
            userName={user?.name || 'Admin'}
          />

          {/* Cột 3 (Bên phải, thu hẹp): Lịch hôm nay (Thống kê 1 dòng, có viền cho từng lịch, selection filter) */}
          <HomeTodayScheduleSection
            sessions={todayScheduleItems}
            onOpenSessionDetail={handleOpenScheduleSession}
            onNavigateCalendar={() => handleNavigate('/app/calendar_class_schedule')}
          />
        </div>
      </div>

      {/* Footer Bar: Chân trang cố định, gắn kết toàn bộ các section */}
      <div className="pt-1.5 pb-0.5 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-1 text-xs text-muted-foreground shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-normal text-muted-foreground">RinoEdu Station Hub</span>
          <span>•</span>
          <span>Cơ sở: {selectedBranch === 'all' ? 'Tất cả cơ sở' : selectedBranch}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{todayScheduleItems.length} ca học hôm nay • {mockClassRecords.length} lớp quản lý</span>
          <span>•</span>
          <span className="text-emerald-600/80 dark:text-emerald-400/80 font-normal">Hệ thống sẵn sàng</span>
        </div>
      </div>

      {/* Menu Hub Modal */}
      <HomeMenuHubDialog
        open={isMenuHubOpen}
        onOpenChange={setIsMenuHubOpen}
      />

      {/* Class Detail Modal (Reusing existing enterprise ClassesDetailDialog) */}
      <ClassesDetailDialog
        cls={activeClass}
        open={Boolean(activeClass)}
        onOpenChange={(open) => {
          if (!open) setActiveClass(null)
        }}
        initialEditMode={false}
        initialTab="roster"
      />

      {/* Calendar Session Detail Modal (Reusing existing enterprise SessionDetailDialog) */}
      <SessionDetailDialog
        session={activeClassSession}
        open={Boolean(activeClassSession)}
        onOpenChange={(open) => {
          if (!open) setActiveClassSession(null)
        }}
      />

      {/* Booking Test Detail Modal (Reusing existing enterprise BookingTestDetailDialog for placement tests) */}
      <BookingTestDetailDialog
        booking={activeBookingTest}
        bookings={mockBookingTests}
        detailNote={bookingDetailNote}
        copiedKey=""
        onOpenChange={(open) => {
          if (!open) setActiveBookingTest(null)
        }}
        onUpdateBooking={(bookingId, updater) => {
          if (activeBookingTest && activeBookingTest.id === bookingId) {
            setActiveBookingTest(updater(activeBookingTest))
          }
          toast.success('Đã cập nhật thông tin lịch test')
        }}
        onOpenAssessment={(bookingId) => {
          toast.info(`Mở phiếu đánh giá kết quả test cho mã: ${bookingId}`)
        }}
        onCall={(phone) => {
          toast.success(`Đang kết nối cuộc gọi tới phụ huynh: ${phone || '090****294'}`)
        }}
        onCopy={async (text) => {
          if (typeof navigator !== 'undefined' && navigator.clipboard) {
            await navigator.clipboard.writeText(text)
            toast.success(`Đã sao chép: ${text}`)
          }
        }}
        onDetailNoteChange={setBookingDetailNote}
        onAddNote={() => {
          if (bookingDetailNote.trim()) {
            toast.success(`Đã lưu ghi chú: ${bookingDetailNote.trim()}`)
            setBookingDetailNote('')
          }
        }}
        onSelectBooking={(selected) => {
          setActiveBookingTest(selected)
        }}
      />

      {/* Student Profile & Tasks Modal */}
      <HomeStudentDetailModal
        careItem={activeCareStudent}
        open={Boolean(activeCareStudent)}
        onOpenChange={(open) => !open && setActiveCareStudent(null)}
        onNavigateCare={() => handleNavigate('/app/student_operations_alert')}
        onNavigateRenewal={() => handleNavigate('/app/renewal')}
      />

      <HomeStudentDetailModal
        renewalItem={activeRenewalStudent}
        open={Boolean(activeRenewalStudent)}
        onOpenChange={(open) => !open && setActiveRenewalStudent(null)}
        onNavigateCare={() => handleNavigate('/app/student_operations_alert')}
        onNavigateRenewal={() => handleNavigate('/app/renewal')}
      />
    </div>
  )
}
