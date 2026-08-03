export interface RosterStudentOption {
  id: string
  name: string
  code?: string
  initials?: string
  colorBg?: string
  colorText?: string
}

export const DEFAULT_ROSTER_STUDENTS: RosterStudentOption[] = [
  { id: 's1', name: 'Alex (Nguyễn An)', code: 'HV-S1-0', initials: 'A', colorBg: 'bg-amber-100 dark:bg-amber-950/60', colorText: 'text-amber-800 dark:text-amber-300 border-amber-200' },
  { id: 's2', name: 'Phạm Dũng', code: 'HV-S4-1', initials: 'PD', colorBg: 'bg-rose-100 dark:bg-rose-950/60', colorText: 'text-rose-800 dark:text-rose-300 border-rose-200' },
  { id: 's3', name: 'Annie (Đặng Hồng Phúc)', code: 'HV-S6-2', initials: 'A', colorBg: 'bg-emerald-100 dark:bg-emerald-950/60', colorText: 'text-emerald-800 dark:text-emerald-300 border-emerald-200' },
  { id: 's4', name: 'Lemon (Nguyễn Hoàng Dũng)', code: 'HV-S7-3', initials: 'L', colorBg: 'bg-violet-100 dark:bg-violet-950/60', colorText: 'text-violet-800 dark:text-violet-300 border-violet-200' },
  { id: 's5', name: 'Đặng Thiên An', code: 'HV-S10-4', initials: 'ĐA', colorBg: 'bg-rose-100 dark:bg-rose-950/60', colorText: 'text-rose-800 dark:text-rose-300 border-rose-200' },
  { id: 's6', name: 'Nguyễn Hoàng Vũ', code: 'HV-S12-5', initials: 'NV', colorBg: 'bg-teal-100 dark:bg-teal-950/60', colorText: 'text-teal-800 dark:text-teal-300 border-teal-200' },
]

export interface SessionMediaItem {
  id: string
  sessionId: string
  sessionNumber: number
  sessionTitle: string
  sessionDate: string
  sessionTime: string
  name: string
  type: 'image' | 'video' | 'doc'
  url: string
  thumbnailUrl?: string
  isLink?: boolean
  size: string
  uploadedBy: string
  uploadedAt: string
  duration?: string
  taggedStudentIds: string[] // Empty array = "Cả lớp"
}

export function extractThumbnailFromUrl(
  url: string
): { thumbnailUrl: string; type: 'image' | 'video' | 'doc'; defaultName: string } {
  const trimmed = url.trim()

  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  )
  if (ytMatch && ytMatch[1]) {
    return {
      thumbnailUrl: `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`,
      type: 'video',
      defaultName: `Video Youtube (${ytMatch[1]})`,
    }
  }

  if (
    /\.(jpeg|jpg|gif|png|webp)($|\?)/i.test(trimmed) ||
    trimmed.includes('unsplash.com') ||
    trimmed.includes('cloudinary')
  ) {
    return {
      thumbnailUrl: trimmed,
      type: 'image',
      defaultName: 'Hình ảnh đính kèm',
    }
  }

  if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
    return {
      thumbnailUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=80',
      type: 'doc',
      defaultName: 'Tài liệu Google Drive',
    }
  }

  return {
    thumbnailUrl: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&auto=format&fit=crop&q=80',
    type: 'doc',
    defaultName: 'Liên kết đính kèm',
  }
}
