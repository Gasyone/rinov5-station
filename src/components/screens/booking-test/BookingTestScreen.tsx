'use client'

import { useMemo, useState } from 'react'
import { DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { FilterGroupAsidePanel } from '@/components/filters'
import {
  getBookingTests,
  type BookingStatus,
  type BookingTest,
} from '@/mocks/bookingTests'
import { useAuthStore } from '@/stores/useAuthStore'
import { buildEmptyAssessmentDraft } from './bookingTestHelpers'
import type {
  AssessmentDraft,
  ConditionFilter,
  FilterState,
  StatusTileId,
} from './bookingTestTypes'
import { BookingTestToolbar } from './BookingTestToolbar'
import { BookingTestTable } from './BookingTestTable'
import { BookingTestDetailDialog } from './BookingTestDetailDialog'
import { BookingTestAssessmentDialog } from './BookingTestAssessmentDialog'
import { BookingTestManualUploadDialog } from './BookingTestManualUploadDialog'
import { useBookingTestData } from './useBookingTestData'
import { useBookingTestActions } from './useBookingTestActions'

export function BookingTestScreen() {
  const user = useAuthStore((state) => state.user)
  const authorName = user?.name ?? 'Người dùng hiện tại'

  const [bookings, setBookings] = useState<BookingTest[]>(() => getBookingTests())
  const [activeSubject, setActiveSubject] = useState<string>('english')
  const [activeSchool, setActiveSchool] = useState('all')
  const [activeStatus, setActiveStatus] = useState<StatusTileId>('all')
  const [selectedAssignee, setSelectedAssignee] = useState<'all' | 'my'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    schools: [],
    statuses: [],
    conditions: [],
    teachers: [],
    weekdays: [],
    programs: [],
    subjects: [],
    sales: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [copiedKey, setCopiedKey] = useState('')

  const [detailBookingId, setDetailBookingId] = useState('')
  const [assessmentBookingId, setAssessmentBookingId] = useState('')
  const [manualUploadBookingId, setManualUploadBookingId] = useState('')
  const [assessmentDraft, setAssessmentDraft] = useState<AssessmentDraft>(() =>
    buildEmptyAssessmentDraft()
  )
  const [detailNote, setDetailNote] = useState('')

  const {
    schoolOptions,
    studentOptions,
    baseForStatus,
    filteredBookings,
    filterGroups,
    activeFilterCount,
  } = useBookingTestData({
    bookings,
    activeSubject,
    activeSchool,
    activeStatus,
    searchTerm,
    filters,
    userRole: user?.role,
    userName: user?.name,
  })

  // Quick "Lịch của tôi" filter
  const myBookingsCount = useMemo(() => {
    return baseForStatus.filter(
      (b) =>
        b.teacher === authorName ||
        b.tester === authorName ||
        b.createdBy === authorName ||
        b.ops === authorName
    ).length
  }, [baseForStatus, authorName])

  const effectiveBookings = useMemo(() => {
    if (selectedAssignee === 'my') {
      return filteredBookings.filter(
        (b) =>
          b.teacher === authorName ||
          b.tester === authorName ||
          b.createdBy === authorName ||
          b.ops === authorName
      )
    }
    return filteredBookings
  }, [filteredBookings, selectedAssignee, authorName])

  const totalPages = Math.max(1, Math.ceil(effectiveBookings.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedBookings = effectiveBookings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const detailBooking = bookings.find((booking) => booking.id === detailBookingId) ?? null
  const assessmentBooking = bookings.find((booking) => booking.id === assessmentBookingId) ?? null
  const manualUploadBooking = bookings.find((booking) => booking.id === manualUploadBookingId) ?? null

  const actions = useBookingTestActions({
    bookings,
    setBookings,
    setCopiedKey,
    setAssessmentBookingId,
    setAssessmentDraft,
    setDetailNote,
    setSelectedIds,
    studentOptions,
    authorName,
    activeSubject,
    assessmentBooking,
    assessmentDraft,
    detailBooking,
    detailNote,
  })

  const toggleFilterValue = <T extends string>(group: keyof FilterState, value: T) => {
    setPage(1)
    setFilters((current) => {
      const currentValues = current[group] as T[]
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]
      return { ...current, [group]: nextValues }
    })
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <BookingTestToolbar
        activeSubject={activeSubject}
        activeSchool={activeSchool}
        activeStatus={activeStatus}
        searchTerm={searchTerm}
        schoolOptions={schoolOptions}
        baseForStatus={baseForStatus}
        activeFilterCount={activeFilterCount}
        selectedAssignee={selectedAssignee}
        onAssigneeChange={(assignee) => {
          setSelectedAssignee(assignee)
          setPage(1)
        }}
        myBookingsCount={myBookingsCount}
        onSubjectChange={(subject) => {
          setActiveSubject(subject)
          setPage(1)
        }}
        onSchoolChange={(school) => {
          setActiveSchool(school)
          setPage(1)
        }}
        onStatusChange={(status) => {
          setActiveStatus(status)
          setPage(1)
        }}
        onSearchChange={(value) => {
          setSearchTerm(value)
          setPage(1)
        }}
        onOpenFilters={() => setIsFilterOpen(true)}
      />

      <div className="flex flex-1 min-h-0 w-full gap-3 overflow-hidden px-2.5 pt-0.5 pb-2 lg:px-3">
        <div className="flex-1 min-w-0 h-full overflow-hidden flex flex-col">
          <BookingTestTable
            bookings={pagedBookings}
            selectedIds={selectedIds}
            copiedKey={copiedKey}
            activeSubject={activeSubject}
            onToggleAll={actions.toggleSelectAll}
            onToggleOne={actions.toggleSelectOne}
            onRowClick={setDetailBookingId}
            onOpenAssessment={actions.openAssessmentDialog}
            onOpenManualUpload={setManualUploadBookingId}
            onUpdateBooking={actions.updateBooking}
            onCopy={actions.copyToClipboard}
            onCall={actions.triggerDeskCall}
            pagination={{
              page: currentPage,
              total: effectiveBookings.length,
              pageSize: pageSize,
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
            }}
          />
        </div>

        {/* Panel bộ lọc ghim ở cạnh phải (khớp chuẩn màn Đơn hàng / Chăm sóc) */}
        {isFilterOpen && (
          <FilterGroupAsidePanel
            title="Bộ lọc nâng cao"
            activeCount={activeFilterCount}
            groups={filterGroups}
            onClose={() => setIsFilterOpen(false)}
            onToggle={(sectionId, value) => {
              if (sectionId === 'schools') toggleFilterValue('schools', value)
              if (sectionId === 'statuses') toggleFilterValue('statuses', value as BookingStatus)
              if (sectionId === 'conditions') toggleFilterValue('conditions', value as ConditionFilter)
              if (sectionId === 'teachers') toggleFilterValue('teachers', value)
              if (sectionId === 'weekdays') toggleFilterValue('weekdays', value)
              if (sectionId === 'programs') toggleFilterValue('programs', value)
              if (sectionId === 'subjects') toggleFilterValue('subjects', value)
              if (sectionId === 'sales') toggleFilterValue('sales', value)
            }}
            onClearAll={() => {
              setFilters({
                schools: [],
                statuses: [],
                conditions: [],
                teachers: [],
                weekdays: [],
                programs: [],
                subjects: [],
                sales: [],
              })
              setPage(1)
            }}
            onClearSection={(sectionId) => {
              setFilters((prev) => ({ ...prev, [sectionId]: [] }))
              setPage(1)
            }}
            showFooterActions={true}
            onApply={() => setIsFilterOpen(false)}
          />
        )}
      </div>

      <BookingTestDetailDialog
        booking={detailBooking}
        bookings={bookings}
        detailNote={detailNote}
        copiedKey={copiedKey}
        onOpenChange={(open) => {
          if (!open) setDetailBookingId('')
        }}
        onUpdateBooking={actions.updateBooking}
        onOpenAssessment={actions.openAssessmentDialog}
        onCall={actions.triggerDeskCall}
        onCopy={actions.copyToClipboard}
        onDetailNoteChange={setDetailNote}
        onAddNote={actions.addDetailNote}
        onSelectBooking={(selected) => setDetailBookingId(selected.id)}
      />

      <BookingTestAssessmentDialog
        booking={assessmentBooking}
        draft={assessmentDraft}
        onOpenChange={(open) => {
          if (!open) setAssessmentBookingId('')
        }}
        onDraftChange={setAssessmentDraft}
        onSave={actions.saveAssessment}
      />

      <BookingTestManualUploadDialog
        open={Boolean(manualUploadBookingId)}
        booking={manualUploadBooking}
        authorName={authorName}
        onOpenChange={(open) => {
          if (!open) setManualUploadBookingId('')
        }}
        onUpdateBooking={actions.updateBooking}
      />
    </div>
  )
}
