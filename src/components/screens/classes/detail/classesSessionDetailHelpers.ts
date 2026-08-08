import React from 'react'
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
} from 'lucide-react'
import type { RoadmapSession, RosterStudent, TestScoreData } from './classesDetailTypes'
import type { SemesterStudentEval } from './ClassesSemesterEvaluationDialog'

// ── Types ───────────────────────────────────────────────────────────────
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

// ── Pure helpers ────────────────────────────────────────────────────────

export function stableHash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = str.charCodeAt(i) + ((h << 5) - h)
  }
  return Math.abs(h)
}

export function getDayOfWeekName(dateStr?: string): string {
  if (!dateStr) return ''
  const trimmed = dateStr.trim()
  if (trimmed.startsWith('Thứ') || trimmed.startsWith('Chủ nhật')) return ''

  let dateObj: Date | null = null
  if (trimmed.includes('/')) {
    const parts = trimmed.split('/')
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1
      const year = parseInt(parts[2], 10)
      dateObj = new Date(year, month, day)
    }
  } else if (trimmed.includes('-')) {
    const parts = trimmed.split('-')
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
      } else {
        dateObj = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10))
      }
    }
  }

  if (!dateObj || isNaN(dateObj.getTime())) return ''

  const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
  return days[dateObj.getDay()]
}

export function formatDateWithDay(dateStr?: string): string {
  if (!dateStr) return ''
  const trimmed = dateStr.trim()
  if (trimmed.startsWith('Thứ') || trimmed.startsWith('Chủ nhật')) return trimmed

  const dayOfWeek = getDayOfWeekName(trimmed)
  return dayOfWeek ? `${dayOfWeek}, ${trimmed}` : trimmed
}

export function splitDateWithDay(dateStr?: string): { dayOfWeek: string; dateRest: string } | null {
  if (!dateStr) return null
  const formatted = formatDateWithDay(dateStr)
  const parts = formatted.split(', ')
  if (parts.length === 2) {
    return { dayOfWeek: parts[0], dateRest: parts[1] }
  }
  return { dayOfWeek: '', dateRest: formatted }
}

export function getInitials(name: string): string {
  const parts = name.replace(/\s*\(.*\)\s*$/, '').trim().split(/\s+/)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?'
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const AVATAR_COLORS = [
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
  'bg-indigo-100 text-indigo-700',
  'bg-orange-100 text-orange-700',
  'bg-cyan-100 text-cyan-700',
]

export function getAvatarColor(id: string): string {
  return AVATAR_COLORS[stableHash(id) % AVATAR_COLORS.length]
}

/** Only for active students (inactive are filtered out upstream). */
export function deriveAttendance(studentId: string, sessionId: string): AttendanceStatus {
  const mod = stableHash(studentId + sessionId) % 10
  if (mod === 0) return 'absent'
  if (mod === 1) return 'late'
  if (mod === 2) return 'excused'
  return 'present'
}

/** Returns a mock homework link, or null if not submitted. */
export function deriveHomeworkLink(studentId: string, sessionId: string): string | null {
  const mod = stableHash(sessionId + studentId + 'hw') % 10
  if (mod <= 2) return null // ~30% not submitted
  return `#btvn-${studentId.slice(-4)}`
}

/** Auto-generated feedback text. */
export function deriveFeedback(studentId: string, sessionId: string): string {
  const hashVal = stableHash(sessionId + studentId + 'fb')
  if (hashVal % 5 === 0) return '' // 20% of students have no feedback initially (placeholder demonstration)
  const bank = [
    'Tiếp thu bài nhanh, phát âm tốt. Cần luyện thêm ngữ pháp.',
    'Cần chú ý tập trung hơn trong giờ học. Hay nói chuyện riêng.',
    'Hoàn thành bài tập đầy đủ, rất tích cực tham gia phát biểu.',
    'Nghe hiểu tốt, cần cải thiện kỹ năng viết đoạn văn.',
    'Tiến bộ rõ rệt so với buổi trước. Tự tin hơn khi giao tiếp.',
    'Tham gia hoạt động nhóm tốt. Cần ôn lại từ vựng chủ đề.',
  ]
  return bank[hashVal % bank.length]
}

// ── Attendance config ───────────────────────────────────────────────────

export const ATTENDANCE_OPTIONS: {
  value: AttendanceStatus
  label: string
  activeClass: string
  iconNode: React.ReactNode
}[] = [
  {
    value: 'present',
    label: 'Có',
    activeClass: 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-200',
    iconNode: React.createElement(CheckCircle2, { className: 'h-3 w-3' }),
  },
  {
    value: 'late',
    label: 'Trễ',
    activeClass: 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-200',
    iconNode: React.createElement(AlertCircle, { className: 'h-3 w-3' }),
  },
  {
    value: 'excused',
    label: 'Phép',
    activeClass: 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-200',
    iconNode: React.createElement(HelpCircle, { className: 'h-3 w-3' }),
  },
  {
    value: 'absent',
    label: 'Vắng',
    activeClass: 'bg-red-500 text-white border-red-500 shadow-sm shadow-red-200',
    iconNode: React.createElement(XCircle, { className: 'h-3 w-3' }),
  },
]

// Exclude these from attendance list
export const INACTIVE_STATUSES: RosterStudent['status'][] = ['dropout', 'session_ended', 'reserve', 'transferred']

// ── Session status helpers ──────────────────────────────────────────────

export function getSessionStatusLabel(status: RoadmapSession['status']) {
  switch (status) {
    case 'completed': return 'Đã học'
    case 'ongoing': return 'Đang học'
    case 'upcoming': return 'Chờ diễn ra'
    case 'cancelled': return 'Đã hủy'
    case 'absent': return 'Nghỉ học'
    default: return status
  }
}

export function getHeaderTheme(status: RoadmapSession['status']) {
  switch (status) {
    case 'completed': return 'bg-emerald-50 border-b-emerald-200'
    case 'ongoing': return 'bg-sky-50 border-b-sky-200'
    case 'upcoming': return 'bg-amber-50/70 border-b-amber-200'
    case 'cancelled': return 'bg-zinc-100/60 border-b-zinc-200'
    default: return 'bg-white border-b-zinc-200'
  }
}

export function getParticipationBadge(status: RosterStudent['status']): { label: string; cls: string } | null {
  switch (status) {
    case 'trial': return { label: 'Học thử', cls: 'border-violet-200 bg-violet-50 text-violet-700' }
    case 'new': return { label: 'Mới', cls: 'border-sky-200 bg-sky-50 text-sky-700' }
    default: return null // active → "Chính thức" handled by caller
  }
}

export function formatNoteTimestamp(timestampStr: string): string {
  try {
    const parts = timestampStr.split(' ')
    if (parts.length !== 2) return timestampStr
    const [timePart, datePart] = parts
    const [hours, minutes] = timePart.split(':').map(Number)
    const [day, month, year] = datePart.split('/').map(Number)
    
    const noteDate = new Date(year, month - 1, day, hours, minutes)
    const now = new Date()
    
    const oneDayMs = 24 * 60 * 60 * 1000
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const noteDateStart = new Date(noteDate.getFullYear(), noteDate.getMonth(), noteDate.getDate())
    const diffDays = Math.floor((todayStart.getTime() - noteDateStart.getTime()) / oneDayMs)
    
    if (diffDays === 0) {
      return timePart
    }
    if (diffDays === 1) {
      return 'Hôm qua'
    }
    if (diffDays > 1 && diffDays < 7) {
      return `${diffDays} ngày trước`
    }
    
    const diffWeeks = Math.floor(diffDays / 7)
    if (diffWeeks > 0 && diffWeeks < 4) {
      return `${diffWeeks} tuần trước`
    }
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`
  } catch {
    return timestampStr
  }
}

export function getLessonsForRoadmapSession(session: RoadmapSession) {
  const components = (session.materials || []).map((m) => {
    let type: 'slide' | 'homework' | 'quiz' | 'audio' | 'video' = 'slide'
    if (m.type === 'homework' || m.type === 'quiz' || m.type === 'slide' || m.type === 'audio' || m.type === 'video') {
      type = m.type as 'slide' | 'homework' | 'quiz' | 'audio' | 'video'
    } else if (m.type === 'Phải làm') {
      type = 'homework'
    } else if (m.type === 'Tham khảo') {
      type = 'slide'
    } else {
      const lowerName = m.name.toLowerCase()
      if (lowerName.includes('bài tập') || lowerName.includes('homework') || lowerName.includes('btvn')) {
        type = 'homework'
      } else if (lowerName.includes('quiz') || lowerName.includes('test')) {
        type = 'quiz'
      } else if (lowerName.includes('audio') || lowerName.includes('listening')) {
        type = 'audio'
      } else if (lowerName.includes('video')) {
        type = 'video'
      }
    }
    return {
      name: m.name,
      type,
      url: m.url
    }
  })

  const fallbackComponents = [
    { name: `Slide bài giảng ${session.topic}`, type: 'slide' as const, url: '#' },
    { name: `Bài tập rèn luyện tự học Buổi ${session.sessionNumber}`, type: 'homework' as const, url: '#' },
    { name: `Bài kiểm tra đánh giá năng lực Buổi ${session.sessionNumber}`, type: 'quiz' as const, url: '#' },
  ]

  const finalComponents = components.length > 0 ? components : fallbackComponents

  const primaryLesson = {
    id: session.id,
    lessonNumber: session.sessionNumber,
    title: session.topic,
    description: session.description || '',
    components: finalComponents,
  }

  // If session.sessionNumber is 3 or 5, return two lessons to show "2 bài trong 1 buổi"
  if (session.sessionNumber === 3 || session.sessionNumber === 5) {
    const secondaryLesson = {
      id: `${session.id}-sub`,
      lessonNumber: session.sessionNumber,
      title: session.sessionNumber === 3 ? 'Thành phần buổi học 2 - 10 phút' : 'KET Practice Test 1 - 180 phút',
      description: session.sessionNumber === 3 ? 'Luyện tập bổ trợ từ vựng và ngữ pháp nâng cao.' : 'Bài kiểm tra năng lực và ôn tập bổ trợ từ vựng.',
      components: session.sessionNumber === 3 ? [
        { name: 'test kịch bản 2', type: 'quiz' as const, url: '#' },
        { name: 'Bài ôn tập 1', type: 'homework' as const, url: '#' }
      ] : [
        { name: 'Kỹ năng KET Test - 120 phút', type: 'homework' as const, url: '#' },
        { name: 'Bài kiểm tra bổ trợ từ vựng - 60 phút', type: 'quiz' as const, url: '#' }
      ]
    }
    return [primaryLesson, secondaryLesson]
  }

  return [primaryLesson]
}

export function getInitialSemesterEvals(roster: RosterStudent[]): Record<string, SemesterStudentEval> {
  const evals: Record<string, SemesterStudentEval> = {}
  roster.forEach((student, index) => {
    if (index % 3 === 0) {
      evals[student.id] = {
        conductRating: (index % 2 === 0) ? 5 : 4,
        conductAttendance: 'full',
        conductPunctual: 'on_time',
        conductHw: 'done',
        conductFocus: 'focus',
        conductActive: 'active',

        knowledgeRating: (index % 2 === 0) ? 4 : 5,
        vocabLevel: 'rich',
        vocabLearned: 'Vocabulary, Academic English, Vocabulary building',
        vocabNotLearned: 'Advanced academic descriptors',
        grammarLevel: 'proficient',
        grammarLearned: 'Present perfect, passive voice',
        grammarNotLearned: 'Inversion structures',

        skillsRating: 4,
        listeningReaction: 'good',
        listeningPractice: 'proficient',
        speakingVolume: 'loud',
        speakingPronunciation: 'correct',
        speakingFluency: 'fluent',
        readingComprehension: 'good',
        readingDetail: 'good',
        writingSpelling: 'correct',
        writingVocab: 'rich',
        writingExpression: 'clear',
        writingGrammar: 'correct',

        interactionRating: (index % 2 === 0) ? 5 : 4,
        interClassActivity: 'active',
        interFocus: 'attentive',
        interContribution: 'voluntary',

        isSubmitted: true,
      }
    }
  })
  return evals
}

export function getInitialTestScores(roster: RosterStudent[]): Record<string, Record<string, TestScoreData>> {
  const scores: Record<string, Record<string, TestScoreData>> = {}
  roster.forEach((student, index) => {
    scores[student.id] = {
      Listening: {
        score: index === 0 ? 8.0 : index === 3 ? 6.0 : null,
        status: (index === 0 || index === 3) ? 'graded' : 'not_start',
        objective: {
          correctAnswers: index === 0 ? 32 : index === 3 ? 24 : 0,
          totalQuestions: 40,
          comment: index === 0 ? 'Làm bài tốt, phản xạ nghe khá nhanh.' : 'Cần chú ý nghe kỹ các phần điền từ.',
        }
      },
      Reading: {
        score: index === 0 ? 7.5 : index === 3 ? 5.5 : null,
        status: (index === 0 || index === 3) ? 'graded' : 'not_start',
        objective: {
          correctAnswers: index === 0 ? 30 : index === 3 ? 22 : 0,
          totalQuestions: 40,
          comment: '',
        }
      },
      Writing: {
        score: index === 0 ? 7.0 : index === 3 ? 6.5 : null,
        status: (index === 0 || index === 3) ? 'graded' : 'not_start',
        objective: {
          correctAnswers: index === 0 ? 28 : index === 3 ? 26 : 0,
          totalQuestions: 40,
          comment: '',
        }
      },
      Speaking: {
        score: index === 0 ? 7.0 : index === 1 ? 4.0 : null,
        status: (index === 0 || index === 1) ? 'graded' : (index === 2 || index === 3) ? 'score_button' : 'not_start',
        rubric: index === 0 ? {
          vocabulary: 1,
          vocabCorrect: 'eeeee;dd;dd',
          vocabIncorrect: 'cccc',
          grammar: 3,
          grammarCorrect: 'wwww',
          grammarIncorrect: '',
          pronunciation: 5,
          pronunciationCorrect: 'wwwww',
          pronunciationIncorrect: '',
          fluency: 5,
          fluencyText: 'một cách tự tin;',
        } : index === 1 ? {
          vocabulary: 2,
          vocabCorrect: 'www;www;www',
          vocabIncorrect: '',
          grammar: 2,
          grammarCorrect: 'www',
          grammarIncorrect: '',
          pronunciation: 1,
          pronunciationCorrect: 'www',
          pronunciationIncorrect: '',
          fluency: 3,
          fluencyText: 'còn ngập ngừng, ấp úng;',
        } : index === 3 ? {
          vocabulary: 3,
          vocabCorrect: 'good',
          vocabIncorrect: '',
          grammar: 3,
          grammarCorrect: 'good',
          grammarIncorrect: '',
          pronunciation: 3,
          pronunciationCorrect: 'good',
          pronunciationIncorrect: '',
          fluency: 3,
          fluencyText: 'trôi chảy;',
        } : undefined
      }
    }
  })
  return scores
}

export function isSessionFuture(sessionDate?: string, sessionStatus?: string): boolean {
  if (sessionStatus === 'upcoming') return true
  if (sessionStatus === 'completed' || sessionStatus === 'submitted') return false
  if (!sessionDate) return false

  let year = 0, month = 0, day = 0
  if (sessionDate.includes('-')) {
    const parts = sessionDate.split('-')
    if (parts.length === 3) {
      year = parseInt(parts[0], 10)
      month = parseInt(parts[1], 10) - 1
      day = parseInt(parts[2], 10)
    }
  } else if (sessionDate.includes('/')) {
    const parts = sessionDate.split('/')
    if (parts.length === 3) {
      day = parseInt(parts[0], 10)
      month = parseInt(parts[1], 10) - 1
      year = parseInt(parts[2], 10)
    }
  }

  if (year === 0 || isNaN(year) || isNaN(month) || isNaN(day)) {
    return false
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const sessionDay = new Date(year, month, day, 0, 0, 0, 0)

  return sessionDay > today
}

export function isSessionPast(sessionDate?: string, sessionStartTime?: string, sessionStatus?: string): boolean {
  if (sessionStatus === 'upcoming') return false
  if (sessionStatus === 'completed' || sessionStatus === 'submitted') return true
  if (!sessionDate) return false

  let year = 0, month = 0, day = 0
  if (sessionDate.includes('-')) {
    const parts = sessionDate.split('-')
    if (parts.length === 3) {
      year = parseInt(parts[0], 10)
      month = parseInt(parts[1], 10) - 1
      day = parseInt(parts[2], 10)
    }
  } else if (sessionDate.includes('/')) {
    const parts = sessionDate.split('/')
    if (parts.length === 3) {
      day = parseInt(parts[0], 10)
      month = parseInt(parts[1], 10) - 1
      year = parseInt(parts[2], 10)
    }
  }

  if (year === 0 || isNaN(year) || isNaN(month) || isNaN(day)) {
    return false
  }

  let hour = 0, minute = 0
  if (sessionStartTime) {
    const parts = sessionStartTime.split('-')
    const cleanEndTime = (parts.length > 1 ? parts[1] : parts[0]).trim()
    const timeParts = cleanEndTime.split(':')
    if (timeParts.length >= 2) {
      hour = parseInt(timeParts[0], 10)
      minute = parseInt(timeParts[1], 10)
    }
  }

  if (isNaN(hour) || isNaN(minute)) {
    hour = 23
    minute = 59
  }

  const sessionEndDate = new Date(year, month, day, hour, minute)
  const now = new Date()
  return now > sessionEndDate
}

export interface SessionSyllabusContent {
  words?: string[]
  sentences?: string[]
  phonics?: string[]
  grammar?: string[]
}

export function getSessionSyllabusContent(session: RoadmapSession): SessionSyllabusContent {
  const num = session.sessionNumber
  const topic = session.topic || ''

  if (topic.toLowerCase().includes('reading') || topic.toLowerCase().includes('skimming')) {
    return {
      words: ['Skimming, Scanning, Keyword, Main idea, Paragraph, Inference'],
      sentences: ['What is the main topic of the passage?', 'According to paragraph 2, which statement is TRUE?'],
      grammar: ['Relative clauses with Who/Which/That'],
    }
  }

  if (topic.toLowerCase().includes('speaking') || topic.toLowerCase().includes('cue card')) {
    return {
      words: ['Fluency, Coherence, Cue card, Monologue, Intonation, Pronunciation'],
      sentences: ['I would like to talk about a memorable experience...', 'The main reason why I prefer this is...'],
      phonics: ['Stress patterns in multi-syllable words / Intonation patterns'],
    }
  }

  if (num % 3 === 1) {
    return {
      words: ['hello, goodbye, sing, stand up, sit down, thank you'],
      sentences: ['How are you? I\'m fine. Thank you.'],
      phonics: ['Aa: alligator, ant, apple / Bb: bear, bird, banana'],
    }
  } else if (num % 3 === 2) {
    return {
      words: ['pencil, eraser, notebook, classroom, teacher, student'],
      sentences: ['What is this? It\'s a pencil.', 'Where is your notebook?'],
      grammar: ['Demonstrative pronouns (This / That / These / Those)'],
    }
  } else {
    return {
      words: ['family, father, mother, brother, sister, grandparents'],
      sentences: ['Who is he? He is my father.', 'How many people are there in your family?'],
      phonics: ['Cc: cat, cup, car / Dd: dog, duck, door'],
    }
  }
}

