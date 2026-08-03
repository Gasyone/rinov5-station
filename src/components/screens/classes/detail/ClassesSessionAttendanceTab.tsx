import React, { useMemo, useState, useEffect } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import type { RosterStudent, TestScoreData } from './classesDetailTypes'
import { LeaveReserveDetailDialog } from '@/components/screens/leave-reserve/LeaveReserveDetailDialog'
import { ClassesSessionAttendanceRow } from './ClassesSessionAttendanceRow'
import { mockLeaveReserveRequests } from '@/mocks/leaveReserve'
import type { AttendanceStatus } from './classesSessionDetailHelpers'



interface ClassesSessionAttendanceTabProps {
  activeRoster: RosterStudent[]
  setIsBulkFeedbackOpen: (open: boolean) => void
  getAttendance: (studentId: string) => AttendanceStatus
  onAttendanceChange: (studentId: string, status: AttendanceStatus) => void
  getFeedback: (studentId: string) => string
  getRating: (studentId: string) => number
  sessionId: string
  sessionDate?: string
  sessionStartTime?: string
  sessionStatus?: string
  isTestSession?: boolean
  isMath?: boolean
  onOpenCareDetail?: (student: RosterStudent) => void
  semesterEvalMap?: Record<string, unknown>
  testScores?: Record<string, Record<string, TestScoreData>>
  onOpenTestScoreDialog?: (studentId: string, skill: string) => void
  isCareOnlyFilter?: boolean
}

export function ClassesSessionAttendanceTab({
  activeRoster,
  setIsBulkFeedbackOpen,
  getAttendance,
  onAttendanceChange,
  getFeedback,
  getRating,
  sessionId,
  sessionDate,
  sessionStatus,
  isTestSession = false,
  isMath = false,
  onOpenCareDetail,
  testScores = {},
  onOpenTestScoreDialog = () => {},
  isCareOnlyFilter = false,
}: ClassesSessionAttendanceTabProps) {
  const [isWelcomeExpanded, setIsWelcomeExpanded] = useState(true)
  const [rosterState, setRosterState] = useState<RosterStudent[]>(activeRoster)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRosterState(activeRoster)
  }, [activeRoster])

  const isSessionInactive = sessionStatus === 'cancelled' || sessionStatus === 'absent'
  const isAttendanceDisabled = isSessionInactive || sessionStatus === 'upcoming'
  const isScoreDisabled = isSessionInactive || sessionStatus === 'upcoming'

  // Leave request detail dialog state
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)
  const [selectedLeaveStudent, setSelectedLeaveStudent] = useState<RosterStudent | null>(null)

  const handleOpenLeaveDialog = (student: RosterStudent) => {
    setSelectedLeaveStudent(student)
    setLeaveDialogOpen(true)
  }

  // Find leave request in mocks, or fallback to a dynamically generated one
  const leaveRequest = useMemo(() => {
    if (!selectedLeaveStudent) return null
    const found = mockLeaveReserveRequests.find(
      (r) => r.studentId === selectedLeaveStudent.id || r.studentCode === selectedLeaveStudent.code
    )
    if (found) return found

    // Dynamic fallback request
    return {
      id: `LR-GEN-${selectedLeaveStudent.id}`,
      studentId: selectedLeaveStudent.id,
      studentName: selectedLeaveStudent.name,
      studentCode: selectedLeaveStudent.code,
      branch: 'RinoEdu Nguyễn Tuân',
      type: 'off' as const,
      startDate: sessionDate || '2026-06-25',
      endDate: sessionDate || '2026-06-25',
      reason: 'Nghỉ ốm có phép (Phụ huynh xin nghỉ qua ứng dụng)',
      status: 'approved' as const,
      requestedDate: sessionDate || '2026-06-25',
      approvedBy: 'Trần Văn A (Quản lý)',
      approvedDate: sessionDate || '2026-06-25',
      title: 'Đơn xin nghỉ phép học viên',
      phone: selectedLeaveStudent.parentPhone || '0912345678',
      email: `${selectedLeaveStudent.code.toLowerCase()}@rinoedu.vn`,
      className: 'Lớp học hiện tại',
      classCode: 'CLASS-01',
      productPackage: 'Gói Tiếng Anh chuẩn Cambridge',
      parentName: selectedLeaveStudent.parentName || 'Phụ huynh',
      additionalContacts: []
    }
  }, [selectedLeaveStudent, sessionDate])




  const welcomeStudents = useMemo(() => {
    return rosterState.filter((s) => s.status === 'new' || s.status === 'trial')
  }, [rosterState])

  const filteredRoster = useMemo(() => {
    let list = [...rosterState]
    if (isCareOnlyFilter) {
      list = list.filter(
        (s) => s.status === 'trial' || s.status === 'new' || !!s.sessionLabel
      )
    }
    // Sort: Care students (trial, new, or has sessionLabel) always at the top
    return list.sort((a, b) => {
      const aIsCare = a.status === 'new' || a.status === 'trial' || !!a.sessionLabel
      const bIsCare = b.status === 'new' || b.status === 'trial' || !!b.sessionLabel
      if (aIsCare && !bIsCare) return -1
      if (!aIsCare && bIsCare) return 1
      return 0
    })
  }, [rosterState, isCareOnlyFilter])

  return (
    <div className="m-0 h-full flex flex-col focus-visible:outline-none">
      {/* Welcome Banner for Trial or First Session students */}
      {welcomeStudents.length > 0 && (
        <div className="bg-[#fef3c7] dark:bg-amber-950/20 border border-[#f59e0b]/30 dark:border-amber-900/50 rounded-xl p-3.5 mb-4 shadow-2xs transition-all duration-200">
          <div 
            className="flex items-center justify-between cursor-pointer select-none"
            onClick={() => setIsWelcomeExpanded(!isWelcomeExpanded)}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50 text-[#92400e] dark:text-amber-400">
                {isWelcomeExpanded ? (
                  <ChevronUp className="h-4.5 w-4.5" />
                ) : (
                  <ChevronDown className="h-4.5 w-4.5" />
                )}
              </div>
              <span className="font-bold text-[#e11d48] dark:text-rose-400 text-xs flex items-center gap-1.5">
                🎉 Welcome new students join in class!
              </span>
            </div>
            <span className="text-[9px] font-bold text-amber-800 dark:text-amber-400 uppercase font-mono bg-amber-200/50 dark:bg-amber-900/40 px-2 py-0.5 rounded-md">
              {welcomeStudents.length} Học viên
            </span>
          </div>

          {isWelcomeExpanded && (
            <div className="mt-3 overflow-x-auto border-t border-amber-200/40 dark:border-amber-900/30 pt-3">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-amber-200/30 dark:border-amber-900/20 text-[9px] uppercase font-extrabold text-[#92400e]/80 dark:text-amber-400/80 tracking-wider">
                    <th className="pb-2 pr-4 font-bold text-left w-[200px]">Student</th>
                    <th className="pb-2 px-4 font-bold text-center w-[120px]">Attendance</th>
                    <th className="pb-2 px-4 font-bold text-center w-[120px]">Do homework</th>
                    <th className="pb-2 pl-4 font-bold text-center w-[120px]">Entrance test</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-200/20 dark:divide-amber-900/10">
                  {welcomeStudents.map((student) => {
                    let ageStr = '5y'
                    if (student.dob) {
                      const birthYear = new Date(student.dob).getFullYear()
                      if (!isNaN(birthYear)) {
                        ageStr = `${2026 - birthYear}y`
                      }
                    }

                    const att = getAttendance(student.id)
                    let attLabel = '—'
                    if (att === 'present') attLabel = 'Có'
                    else if (att === 'late') attLabel = 'Trễ'
                    else if (att === 'absent') attLabel = 'Vắng'
                    else if (att === 'excused') attLabel = 'Phép'

                    return (
                      <tr key={student.id} className="text-amber-950 dark:text-amber-100 font-medium">
                        <td className="py-2.5 pr-4 text-left text-zinc-900 dark:text-zinc-100">
                          {student.name}, {ageStr}
                        </td>
                        <td className="py-2.5 px-4 text-center text-[#92400e] dark:text-amber-400 font-mono">
                          {attLabel}
                        </td>
                        <td className="py-2.5 px-4 text-center text-[#92400e]/60 dark:text-amber-400/60 font-mono">
                          —
                        </td>
                        <td className="py-2.5 pl-4 text-center text-[#92400e]/60 dark:text-amber-400/60 font-mono">
                          —
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}


      {/* Table */}
      <div className="flex-1 border border-zinc-200 rounded-xl overflow-hidden shadow-xs bg-white dark:bg-zinc-900 dark:border-zinc-800 flex flex-col min-h-0">
        <div className="overflow-auto flex-1 min-h-0">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 sticky top-0 border-b border-zinc-200 dark:border-zinc-800 z-10">
              <tr>
                {isTestSession && !isMath ? (
                  <>
                    <th className="py-2 px-2.5 font-semibold text-zinc-500 dark:text-zinc-400 w-[180px]">Học viên</th>
                    <th className="py-2 px-2.5 font-semibold text-zinc-500 dark:text-zinc-400 text-center w-[85px]">Điểm danh</th>
                    <th className="py-2 px-2.5 font-semibold text-zinc-500 dark:text-zinc-400 text-center w-[68px]">Listening</th>
                    <th className="py-2 px-2.5 font-semibold text-zinc-500 dark:text-zinc-400 text-center w-[68px]">Reading</th>
                    <th className="py-2 px-2.5 font-semibold text-zinc-500 dark:text-zinc-400 text-center w-[68px]">Writing</th>
                    <th className="py-2 px-2.5 font-semibold text-zinc-500 dark:text-zinc-400 text-center w-[68px]">Speaking</th>
                    <th className="py-2 px-2.5 font-semibold text-zinc-500 dark:text-zinc-400 text-center w-[60px]">Overall</th>
                  </>
                ) : (
                  <>
                    <th className="py-2.5 px-3 font-semibold text-zinc-500 dark:text-zinc-400 w-[35%] min-w-[280px]">Học viên</th>
                    <th className="py-2.5 px-3 font-semibold text-zinc-500 dark:text-zinc-400 w-[15%] min-w-[110px]">Điểm danh</th>
                    <th className="py-2.5 px-3 font-semibold text-zinc-500 dark:text-zinc-400 w-[15%] min-w-[100px]">
                      {isTestSession && isMath ? 'KTĐK' : 'BTVN'}
                    </th>
                    <th className="py-2.5 px-3 font-semibold text-zinc-500 dark:text-zinc-400 w-[35%] min-w-[300px]">Nhận xét</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {filteredRoster.length === 0 ? (
                <tr>
                  <td colSpan={isTestSession && !isMath ? 7 : 4} className="py-10 text-center text-muted-foreground italic">
                    Không tìm thấy học viên.
                  </td>
                </tr>
              ) : (
                filteredRoster.map((student) => {
                  const att = getAttendance(student.id)
                  const fb = getFeedback(student.id)
                  const rating = getRating(student.id)
                  const isExcused = att === 'excused'
                  const hasLeave = student.status === 'reserve' || student.status === 'transferred' || att === 'excused'

                  return (
                    <ClassesSessionAttendanceRow
                      key={student.id}
                      student={student}
                      sessionId={sessionId}
                      isTestSession={isTestSession}
                      isMath={isMath}
                      isAttendanceDisabled={isAttendanceDisabled}
                      isScoreDisabled={isScoreDisabled}
                      att={att}
                      fb={fb}
                      rating={rating}
                      isExcused={isExcused}
                      hasLeave={hasLeave}
                      testScores={testScores}
                      onAttendanceChange={onAttendanceChange}
                      onOpenTestScoreDialog={onOpenTestScoreDialog}
                      setIsBulkFeedbackOpen={setIsBulkFeedbackOpen}
                      onOpenCareDetail={onOpenCareDetail}
                      handleOpenLeaveDialog={handleOpenLeaveDialog}
                      isSessionInactive={isSessionInactive}
                      sessionStatus={sessionStatus}
                    />
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Request Detail Dialog */}
      <LeaveReserveDetailDialog
        open={leaveDialogOpen}
        onOpenChange={setLeaveDialogOpen}
        request={leaveRequest}
        readOnly={true}
      />
    </div>
  )
}
