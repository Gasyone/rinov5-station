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

export interface SessionMediaTeacher {
  id?: string
  name: string
  code?: string
  phone?: string
  email?: string
  role?: string
}

export interface SessionMediaItem {
  id: string
  sessionId: string
  sessionNumber: number
  sessionTitle: string
  sessionDate: string
  sessionTime: string
  teacher?: SessionMediaTeacher
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

export const MAX_IMAGE_DOC_SIZE_BYTES = 25 * 1024 * 1024 // 25MB
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024 // 100MB
export const MAX_FILES_PER_UPLOAD = 10

export interface UploadingMediaItem {
  id: string
  sessionId: string
  sessionNumber: number
  sessionTitle: string
  sessionDate: string
  sessionTime: string
  name: string
  type: 'image' | 'video' | 'doc'
  size: string
  totalBytes: number
  loadedBytes: number
  progress: number
  rawFile?: File
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

/**
 * Helper functions for Date parsing, formatting, and filtering in ClassesSessionMedia
 */
export function parseDateString(dateStr: string): Date | null {
  if (!dateStr) return null
  const trimmed = dateStr.trim()
  if (trimmed.includes('/')) {
    const parts = trimmed.split('/')
    if (parts.length === 3) {
      const d = Number(parts[0])
      const m = Number(parts[1]) - 1
      const y = Number(parts[2])
      const date = new Date(y, m, d)
      return isNaN(date.getTime()) ? null : date
    }
  }
  if (trimmed.includes('-')) {
    const parts = trimmed.split('-')
    if (parts.length === 3) {
      const y = Number(parts[0])
      const m = Number(parts[1]) - 1
      const d = Number(parts[2])
      const date = new Date(y, m, d)
      return isNaN(date.getTime()) ? null : date
    }
  }
  const fallback = new Date(trimmed)
  return isNaN(fallback.getTime()) ? null : fallback
}

export function formatDateToDisplay(date: Date | string | null | undefined): string {
  if (!date) return ''
  const d = typeof date === 'string' ? parseDateString(date) : date
  if (!d) return ''
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

export function formatDateToISO(date: Date | null | undefined): string {
  if (!date) return ''
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function isDateInRange(
  sessionDateStr: string,
  startDateStr: string,
  endDateStr: string
): boolean {
  if (!startDateStr && !endDateStr) return true
  const itemDate = parseDateString(sessionDateStr)
  if (!itemDate) return true

  const itemTime = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate()).getTime()

  if (startDateStr) {
    const sDate = parseDateString(startDateStr)
    if (sDate) {
      const startTime = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate()).getTime()
      if (itemTime < startTime) return false
    }
  }

  if (endDateStr) {
    const eDate = parseDateString(endDateStr)
    if (eDate) {
      const endTime = new Date(eDate.getFullYear(), eDate.getMonth(), eDate.getDate()).getTime()
      if (itemTime > endTime) return false
    }
  }

  return true
}

export const INITIAL_MOCK_MEDIA: SessionMediaItem[] = [
  {
    id: 'm1',
    sessionId: 'ses-5',
    sessionNumber: 5,
    sessionTitle: 'Reading Strategies & Skimming/Scanning',
    sessionDate: '09/05/2026',
    sessionTime: '18:00 - 19:30',
    name: 'Bang_Tu_Vung_Unit4.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    size: '2.4 MB',
    uploadedBy: 'Cô Mai',
    uploadedAt: '09/05/2026 19:15',
    taggedStudentIds: [], // Cả lớp
  },
  {
    id: 'm2',
    sessionId: 'ses-5',
    sessionNumber: 5,
    sessionTitle: 'Reading Strategies & Skimming/Scanning',
    sessionDate: '09/05/2026',
    sessionTime: '18:00 - 19:30',
    name: 'Hoat_Dong_Nhom_Sticker.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    size: '3.1 MB',
    uploadedBy: 'Cô Mai',
    uploadedAt: '09/05/2026 19:20',
    taggedStudentIds: ['s1', 's2'],
  },
  {
    id: 'm3',
    sessionId: 'ses-5',
    sessionNumber: 5,
    sessionTitle: 'Reading Strategies & Skimming/Scanning',
    sessionDate: '09/05/2026',
    sessionTime: '18:00 - 19:30',
    name: 'Thuyet_Trinh_Alex.mp4',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    size: '18.5 MB',
    uploadedBy: 'Cô Mai',
    uploadedAt: '09/05/2026 19:25',
    duration: '01:45',
    taggedStudentIds: ['s1'],
  },
  {
    id: 'm4',
    sessionId: 'ses-4',
    sessionNumber: 4,
    sessionTitle: 'Listening & Pronunciation Practice',
    sessionDate: '07/05/2026',
    sessionTime: '18:00 - 19:30',
    name: 'Bang_Phien_Am_IPA_Unit3.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
    size: '1.8 MB',
    uploadedBy: 'Hoàng Thị Mai',
    uploadedAt: '07/05/2026 19:10',
    taggedStudentIds: [],
  },
  {
    id: 'm5',
    sessionId: 'ses-4',
    sessionNumber: 4,
    sessionTitle: 'Listening & Pronunciation Practice',
    sessionDate: '07/05/2026',
    sessionTime: '18:00 - 19:30',
    name: 'Thao_Luan_Phien_Am_Lop.mp4',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    size: '24.2 MB',
    uploadedBy: 'Hoàng Thị Mai',
    uploadedAt: '07/05/2026 19:22',
    duration: '03:10',
    taggedStudentIds: ['s3', 's4'],
  },
  {
    id: 'm6',
    sessionId: 'ses-3',
    sessionNumber: 3,
    sessionTitle: 'Grammar in Use & Sentence Building',
    sessionDate: '05/05/2026',
    sessionTime: '18:00 - 19:30',
    name: 'Tai_Lieu_Song_Ngu_Unit2.pdf',
    type: 'doc',
    url: 'https://storage.rinoedu.vn/materials/tai-lieu-unit2.pdf',
    size: '4.5 MB',
    uploadedBy: 'Hoàng Thị Mai',
    uploadedAt: '05/05/2026 18:45',
    taggedStudentIds: [],
  },
  {
    id: 'm7',
    sessionId: 'ses-3',
    sessionNumber: 3,
    sessionTitle: 'Grammar in Use & Sentence Building',
    sessionDate: '05/05/2026',
    sessionTime: '18:00 - 19:30',
    name: 'Goc_Hoc_Tap_ThienAn.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    size: '2.9 MB',
    uploadedBy: 'Hoàng Thị Mai',
    uploadedAt: '05/05/2026 19:00',
    taggedStudentIds: ['s5'],
  },
  {
    id: 'm8',
    sessionId: 'ses-12',
    sessionNumber: 12,
    sessionTitle: 'Course Graduation & Feedback Review',
    sessionDate: '23/05/2026',
    sessionTime: '18:00 - 19:30',
    name: 'Anh_Tot_Nghiep_Lop_Kindie.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    size: '3.4 MB',
    uploadedBy: 'Cô Mai',
    uploadedAt: '23/05/2026 19:30',
    taggedStudentIds: ['s1', 's2', 's3'],
  },
  {
    id: 'm9',
    sessionId: 'ses-12',
    sessionNumber: 12,
    sessionTitle: 'Course Graduation & Feedback Review',
    sessionDate: '23/05/2026',
    sessionTime: '18:00 - 19:30',
    name: 'Video_Thuyet_Trinh_Tot_Nghiep.mp4',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    size: '32.1 MB',
    uploadedBy: 'Cô Mai',
    uploadedAt: '23/05/2026 19:45',
    duration: '02:45',
    taggedStudentIds: [],
  },
  {
    id: 'm10',
    sessionId: 'ses-12',
    sessionNumber: 12,
    sessionTitle: 'Course Graduation & Feedback Review',
    sessionDate: '23/05/2026',
    sessionTime: '18:00 - 19:30',
    name: 'Chung_Nhan_Tot_Nghiep_IELTS.pdf',
    type: 'doc',
    url: 'https://storage.rinoedu.vn/materials/chung-nhan-tot-nghiep.pdf',
    size: '1.2 MB',
    uploadedBy: 'Cô Mai',
    uploadedAt: '23/05/2026 19:50',
    taggedStudentIds: [],
  },
]

export const INITIAL_DEMO_UPLOADING: UploadingMediaItem[] = [
  {
    id: 'upload-demo-in-progress',
    sessionId: 'ses-5',
    sessionNumber: 5,
    sessionTitle: 'Reading Strategies & Skimming/Scanning',
    sessionDate: '09/05/2026',
    sessionTime: '18:00 - 19:30',
    name: 'Video_Bao_Cao_Nhom1_FullHD.mp4',
    type: 'video',
    size: '68.4 MB',
    totalBytes: Math.round(68.4 * 1024 * 1024),
    loadedBytes: Math.round(28.7 * 1024 * 1024),
    progress: 42,
  },
]
