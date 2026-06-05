export type FeedbackStatus = 'pending' | 'completed' | 'needs_follow_up'
export type HomeworkStatus = 'done' | 'missing' | 'late' | 'partial'
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'
export type ProgressLevel = 'improved' | 'stable' | 'needs_attention'

export interface SessionFeedback {
  id: string
  sessionId: string
  sessionCode: string
  classId: string
  className: string
  classCode: string
  branch: string
  studentId: string
  studentName: string
  attendance: AttendanceStatus
  homeworkTitle?: string
  homeworkUrl?: string
  homeworkStatus: HomeworkStatus
  homeworkScore?: number
  homeworkNote?: string
  progress: ProgressLevel
  feedback?: string
  recommendation?: string
  status: FeedbackStatus
  teacher: string
  date: string
}

const generateMockFeedback = (): SessionFeedback[] => {
  const data: SessionFeedback[] = []
  let id = 1

  const studentsByClass: Record<string, Array<{ id: string; name: string }>> = {
    'c-ielts-a1': [
      { id: 's1', name: 'Nguyễn An' },
      { id: 's3', name: 'Lê Chi' },
      { id: 's6', name: 'Nguyễn Giang' },
      { id: 's9', name: 'Vũ Mai' },
      { id: 's11', name: 'Phạm Long' },
      { id: 's12', name: 'Trần Hằng' },
    ],
    'c-ielts-b1': [
      { id: 's2', name: 'Trần Bình' },
      { id: 's4', name: 'Phạm Dũng' },
      { id: 's7', name: 'Trần Hiếu' },
      { id: 's10', name: 'Nguyễn Nam' },
    ],
    'c-toeic-a2': [
      { id: 's5', name: 'Hoàng Em' },
      { id: 's8', name: 'Lê Khánh' },
    ],
    'c-movers-2b': [
      { id: 's1', name: 'Nguyễn An' },
      { id: 's2', name: 'Trần Bình' },
    ],
  }

  const completedSessions = [
    { sessionId: 'ses-001', code: 'SES-001', classId: 'c-ielts-a1', className: 'IELTS Junior 1A', classCode: 'IELTS-1A', teacher: 'Cô Lan', date: '2026-05-04', topic: 'Reading: IELTS Format', branch: 'RinoEdu Linh Đàm' },
    { sessionId: 'ses-002', code: 'SES-002', classId: 'c-ielts-a1', className: 'IELTS Junior 1A', classCode: 'IELTS-1A', teacher: 'Cô Lan', date: '2026-05-06', topic: 'Writing: Task 1', branch: 'RinoEdu Linh Đàm' },
    { sessionId: 'ses-010', code: 'SES-010', classId: 'c-ielts-b1', className: 'IELTS Junior 1B', classCode: 'IELTS-1B', teacher: 'Thầy Hùng', date: '2026-05-05', topic: 'Grammar: Conditionals', branch: 'RinoEdu Nguyễn Tuân' },
    { sessionId: 'ses-020', code: 'SES-020', classId: 'c-toeic-a2', className: 'TOEIC Foundation 2A', classCode: 'TOEIC-2A', teacher: 'Cô Hương', date: '2026-05-06', topic: 'Part 5: Incomplete Sentences', branch: 'RinoEdu Nguyễn Tuân' },
    { sessionId: 'ses-030', code: 'SES-030', classId: 'c-movers-2b', className: 'Movers 2B', classCode: 'MOV-2B', teacher: 'Cô Nga', date: '2026-05-04', topic: 'Unit 5: Animals', branch: 'RinoEdu Smart City' },
  ]

  const homeworkTitles = [
    'Bài tập Reading - Unit 5',
    'Bài tập Writing - Essay Task 1',
    'Bài tập Grammar - Conditional sentences',
    'Bài tập Part 5 - Practice Set 3',
    'Vocabulary Quiz - Animals Unit',
    'Listening - Section 2 Practice',
    'Speaking - Part 1 Topics',
    'Vocabulary - Academic Word List 4',
  ]

  const homeworkOptions: HomeworkStatus[] = ['done', 'done', 'done', 'missing', 'late', 'partial']
  const attendanceOptionsList: AttendanceStatus[] = ['present', 'present', 'present', 'late', 'absent', 'excused']
  const progressOptionsList: ProgressLevel[] = ['improved', 'stable', 'needs_attention', 'improved', 'stable']
  const feedbackSamples = [
    'HV làm bài tốt, nắm vững kiến thức.',
    'Cần ôn tập thêm phần ngữ pháp.',
    'HV tiến bộ rõ rệt so với buổi trước.',
    'HV chưa hoàn thành bài tập về nhà.',
    'HV tham gia phát biểu tích cực.',
    'Cần rèn luyện thêm kỹ năng viết.',
    'HV có tinh thần học tập tốt.',
    'HV cần chú ý hơn trong giờ học.',
  ]

  for (const session of completedSessions) {
    const students = studentsByClass[session.classId] || []

    for (const [studentIndex, student] of students.entries()) {
      const hasFeedback = studentIndex % 3 !== 2
      const hwStatus = homeworkOptions[(studentIndex + students.indexOf(student)) % (homeworkOptions.length)]
      const attendance = attendanceOptionsList[(studentIndex + session.sessionId.charCodeAt(4)) % (attendanceOptionsList.length)]
      const progress = progressOptionsList[(studentIndex) % (progressOptionsList.length)]
      const hasHomework = hwStatus === 'done' || hwStatus === 'partial'
      const feedbackIndex = (studentIndex + session.sessionId.charCodeAt(5)) % (feedbackSamples.length)

      data.push({
        id: `fb-${String(id++).padStart(3, '0')}`,
        sessionId: session.sessionId,
        sessionCode: session.code,
        classId: session.classId,
        className: session.className,
        classCode: session.classCode,
        branch: session.branch,
        studentId: student.id,
        studentName: student.name,
        attendance,
        homeworkTitle: hasHomework ? homeworkTitles[(studentIndex) % (homeworkTitles.length)] : undefined,
        homeworkUrl: hasHomework ? `https://classroom.rinoedu.vn/homework/${session.sessionId}/${student.id}` : undefined,
        homeworkStatus: hwStatus,
        homeworkScore: hwStatus === 'done' ? ((studentIndex % 3) + 7) : undefined,
        homeworkNote: hasHomework && (studentIndex % 2 === 0) ? feedbackSamples[feedbackIndex] : undefined,
        progress,
        feedback: hasFeedback ? feedbackSamples[feedbackIndex] : undefined,
        recommendation: hasFeedback && (studentIndex % 5 === 0) ? 'Nên làm thêm bài tập bổ trợ.' : undefined,
        status: hasFeedback ? (studentIndex % 4 === 3 ? 'needs_follow_up' : 'completed') : 'pending',
        teacher: session.teacher,
        date: session.date,
      })
    }
  }

  return data
}

export const mockSessionFeedback: SessionFeedback[] = generateMockFeedback()

export function getSessionFeedback(filters?: {
  search?: string
  branch?: string
  sessionId?: string
  classId?: string
  studentId?: string
  status?: string
  homeworkStatus?: string
  teacher?: string
  attendance?: string
}): SessionFeedback[] {
  return mockSessionFeedback.filter((f) => {
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      if (
        !f.studentName.toLowerCase().includes(q) &&
        !f.sessionCode.toLowerCase().includes(q) &&
        !f.className.toLowerCase().includes(q) &&
        !f.teacher.toLowerCase().includes(q)
      ) return false
    }
    if (filters?.branch && f.branch !== filters.branch) return false
    if (filters?.sessionId && f.sessionId !== filters.sessionId) return false
    if (filters?.classId && f.classId !== filters.classId) return false
    if (filters?.studentId && f.studentId !== filters.studentId) return false
    if (filters?.status && filters.status !== 'all' && f.status !== filters.status) return false
    if (filters?.homeworkStatus && filters.homeworkStatus !== 'all' && f.homeworkStatus !== filters.homeworkStatus) return false
    if (filters?.attendance && filters.attendance !== 'all' && f.attendance !== filters.attendance) return false
    if (filters?.teacher && !f.teacher.toLowerCase().includes(filters.teacher.toLowerCase())) return false
    return true
  })
}

export function getFeedbackCounts(items: SessionFeedback[]): Record<string, number> {
  const counts: Record<string, number> = {
    all: items.length,
    completed: 0,
    pending: 0,
    needs_follow_up: 0,
  }
  for (const f of items) {
    if (counts[f.status] !== undefined) counts[f.status]++
  }
  return counts
}

export function getHomeworkCounts(items: SessionFeedback[]): Record<string, number> {
  const counts: Record<string, number> = {
    all: items.length,
    done: 0,
    missing: 0,
    late: 0,
    partial: 0,
  }
  for (const f of items) {
    if (counts[f.homeworkStatus] !== undefined) counts[f.homeworkStatus]++
  }
  return counts
}

export const ATTENDANCE_LABELS: Record<AttendanceStatus, string> = {
  present: 'Có mặt',
  absent: 'Vắng',
  late: 'Đến muộn',
  excused: 'Có phép',
}

export const PROGRESS_LABELS: Record<ProgressLevel, string> = {
  improved: 'Tiến bộ',
  stable: 'Ổn định',
  needs_attention: 'Cần quan tâm',
}

export const HOMEWORK_LABELS: Record<HomeworkStatus, string> = {
  done: 'Đã nộp',
  missing: 'Chưa nộp',
  late: 'Nộp muộn',
  partial: 'Nộp một phần',
}

export const FEEDBACK_STATUS_LABELS: Record<FeedbackStatus, string> = {
  completed: 'Đã nhận xét',
  pending: 'Chưa nhận xét',
  needs_follow_up: 'Cần theo dõi',
}