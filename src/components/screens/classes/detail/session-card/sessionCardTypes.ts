import type { RoadmapSession, RosterStudent } from '../classesDetailTypes'
import { stableHash } from '../classesSessionDetailHelpers'
import { cleanTeacherName, cleanAssistantName } from '../classesDetailHelpers'
import type { PersonnelItem } from '@/components/shared/PersonnelCell'

export interface ClassesSessionCardProps {
  session: RoadmapSession
  roster?: RosterStudent[]
  onView: (session: RoadmapSession) => void
  onCancel: (sessionId: string) => void
  onEditTeacher: (sessionId: string) => void
  onEditRoom: (sessionId: string) => void
  onUpload: (sessionId: string) => void
  onReschedule?: (sessionId: string) => void
  onDeleteMaterial: (sessionId: string, materialName: string, isSlide: boolean) => void
  onUpdateSession?: (sessionId: string, updates: Partial<RoadmapSession>) => void
}

export interface SessionMetrics {
  attendance: { present: number; total: number }
  homework: { submitted: number; total: number }
  rating: number
  testScore?: { graded: number; total: number; avgScore: number }
}

export function getSessionMetrics(sessionId: string, isTest: boolean): SessionMetrics {
  const hash = stableHash(sessionId)
  const total = 15 + (hash % 6)
  const present = Math.max(1, total - (hash % 3))
  const submitted = Math.max(0, present - ((hash >> 2) % 3))
  const rating = Number((4.3 + ((hash % 7) * 0.1)).toFixed(1))
  const avgScore = Number((7.6 + ((hash % 18) * 0.1)).toFixed(1))

  return {
    attendance: { present, total },
    homework: { submitted, total },
    rating,
    testScore: isTest ? { graded: present, total, avgScore } : undefined,
  }
}

export function getTeacherPersonnel(teacherName: string): PersonnelItem {
  const cleanName = cleanTeacherName(teacherName)
  const nameParts = cleanName.split(' ').filter(Boolean)
  const codeSuffix = nameParts.map((n) => n[0]).join('').toUpperCase() || 'CL'

  return {
    id: `EMP-${codeSuffix}`,
    name: cleanName,
    role: 'Giáo viên chính',
    phone: '0901234567',
    email: `${cleanName.toLowerCase().replace(/[^a-z0-9]/gi, '')}@rinoedu.com`,
  }
}

export function getAssistantPersonnel(name: string): PersonnelItem {
  const cleanName = cleanAssistantName(name)
  const codeSuffix = cleanName.split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase() || 'TA'

  return {
    id: `EMP-TA-${codeSuffix}`,
    name: cleanName,
    role: 'Trợ giảng (TA)',
    phone: '0934567890',
    email: `${cleanName.toLowerCase().replace(/[^a-z0-9]/gi, '')}@rinoedu.com`,
  }
}

export function getSessionTone(session: RoadmapSession) {
  const isCancelled = session.status === 'cancelled' || session.status === 'absent'
  const isOpeningDay = session.sessionNumber === 1
  const hasSubstitute = !!session.substituteTeacherName

  if (isCancelled) {
    return 'border-dashed border-border/60 bg-muted/15 opacity-60 hover:opacity-100'
  }
  if (isOpeningDay) {
    return 'bg-card text-card-foreground border-border border-l-4 border-l-rose-500 hover:border-border/80 shadow-2xs'
  }
  if (hasSubstitute) {
    return 'bg-card text-card-foreground border-border border-l-4 border-l-amber-500 hover:border-border/80 shadow-2xs'
  }
  if (session.status === 'completed') {
    return 'bg-card text-card-foreground border-border border-l-4 border-l-zinc-300 dark:border-l-zinc-700 hover:border-border/80 shadow-2xs'
  }
  if (session.status === 'upcoming') {
    return 'bg-card text-card-foreground border-border border-l-4 border-l-emerald-500 hover:border-border/80 shadow-2xs'
  }
  return 'bg-card text-card-foreground border-border border-l-4 border-l-primary/60 hover:border-primary/80 shadow-2xs'
}

export function getMaterialMeta(name: string) {
  const lowered = name.toLowerCase()
  const isSlide = lowered.includes('slide') || lowered.includes('bài giảng')
  const isVideo = lowered.includes('.mp4') || lowered.includes('video')
  const isImage = lowered.includes('.jpg') || lowered.includes('.png') || lowered.includes('ảnh') || isSlide

  let thumbnailUrl = 'https://images.unsplash.com/photo-1568667256549-094345857637?w=300&auto=format&fit=crop&q=80'
  if (lowered.includes('slide') || lowered.includes('unit')) {
    thumbnailUrl = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=300&auto=format&fit=crop&q=80'
  } else if (lowered.includes('btvn') || lowered.includes('bài tập')) {
    thumbnailUrl = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&auto=format&fit=crop&q=80'
  }

  return { isSlide, isVideo, isImage, thumbnailUrl }
}
