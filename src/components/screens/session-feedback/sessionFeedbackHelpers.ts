import type { SessionFeedback } from '@/mocks/sessionFeedback'
import { mockClassSessions } from '@/mocks/classSessions'
import type { SessionFeedbackGroup } from './sessionFeedbackTypes'

export function groupFeedbackBySession(feedbacks: SessionFeedback[]): SessionFeedbackGroup[] {
  const sessionMap = new Map<string, SessionFeedbackGroup>()

  for (const f of feedbacks) {
    if (!sessionMap.has(f.sessionId)) {
      const session = mockClassSessions.find((s) => s.id === f.sessionId)
      sessionMap.set(f.sessionId, {
        sessionId: f.sessionId,
        sessionCode: f.sessionCode,
        className: f.className,
        classCode: f.classCode,
        teacher: f.teacher,
        date: f.date,
        topic: session?.topic,
        feedbacks: [],
      })
    }
    sessionMap.get(f.sessionId)!.feedbacks.push(f)
  }

  return Array.from(sessionMap.values())
    .map((g) => ({
      ...g,
      feedbacks: [...g.feedbacks].sort((a, b) => a.studentName.localeCompare(b.studentName)),
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getFeedbackCompletionRate(group: SessionFeedbackGroup): { completed: number; total: number; percentage: number } {
  const total = group.feedbacks.length
  const completed = group.feedbacks.filter((f) => f.status === 'completed').length
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  }
}

export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}